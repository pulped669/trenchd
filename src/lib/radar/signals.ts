// The narrative engine. Deterministic, no LLM: it turns a pile of launches,
// posts and trends into ranked narratives with a lifecycle phase, so the
// model downstream reasons over evidence instead of vibes.
//
// Pipeline: items → terms (words, bigrams, tickers) → per-term heat →
// cluster terms that describe the same items → narrative metrics → phase.

import type { CoinRef, Narrative, Phase, PostRef, RadarReport, SignalItem, Snapshot, SourceId } from "./types";

const MIN = 60_000;
const HOUR = 60 * MIN;

const STOPWORDS = new Set(
  (
    // English filler
    "the and for with this that from you your are was were will just not but all its has have had our out get got " +
    "one now new who what when how why can about more most into over than then them they their there here his her " +
    "him she been being very also only like make made let lets any some every everyone everything first last next " +
    "best big real true back day today time year years way see look know want need going gonna think still even much " +
    "many people thing things would could should really never ever always posting post posted tweet tweets thread via " +
    "amp lol lmao yes yeah haha omg wow guys literally actually right left good great less same each both off " +
    "where which while because before after again ago soon week tonight tomorrow yesterday live life world " +
    // Crypto boilerplate that appears in every launch and says nothing about the narrative
    "coin coins token tokens sol solana pump pumpfun fun memecoin memecoins meme memes crypto launch launched launching " +
    "contract address dex dexscreener raydium buy buying sell selling bought sold hold holding holder holders moon " +
    "mooning gem gems chart charts mcap market cap price community cto official dev devs telegram twitter website join " +
    "burned burn renounced liquidity supply airdrop presale stealth fair safe rug rugs send sending ape aped degen " +
    "degens trench trenches wallet wallets onchain chain bonding curve king hill stream streaming bullish bearish " +
    "pumping dump dumping holders gm gn ser fren frens wagmi ngmi lfg alpha calls call entry exit profit profits " +
    "trade trading trader traders volume x100 100x 1000x 10x https http www com"
  ).split(/\s+/),
);

const URL_RE = /https?:\/\/\S+/g;
const MENTION_RE = /(^|\s)@\w+/g;
const CASHTAG_RE = /\$([a-z][a-z0-9]{1,14})\b/gi;

const MAX_WORDS_PER_ITEM = 60;
const MAX_BIGRAM_WORDS = 40;

function singular(w: string): string {
  if (w.length > 3 && w.endsWith("s") && !/(ss|us|is)$/.test(w)) return w.slice(0, -1);
  return w;
}

function validWord(w: string): boolean {
  if (w.length < 3 || w.length > 20) return false;
  if (/^\d+$/.test(w)) return false;
  if (/\d/.test(w) && w.replace(/\D/g, "").length > w.length / 2) return false;
  return !STOPWORDS.has(w);
}

function cleanTicker(sym: string): string | null {
  const t = singular(sym.toLowerCase().replace(/[^\p{L}\p{N}]/gu, ""));
  if (t.length < 2 || t.length > 15 || /^\d+$/.test(t) || STOPWORDS.has(t)) return null;
  return t;
}

function titleCase(term: string): string {
  return term.replace(/(^|\s)(\p{L})/gu, (_, sp: string, ch: string) => sp + ch.toUpperCase());
}

/** term → display form. Exported for tests. */
export function extractTerms(item: SignalItem): Map<string, string> {
  const terms = new Map<string, string>();
  const text = item.text.replace(URL_RE, " ").replace(MENTION_RE, " ");

  const tickers = [...text.matchAll(CASHTAG_RE)].map((m) => m[1]);
  if (item.symbol) tickers.push(item.symbol);
  for (const sym of tickers) {
    const t = cleanTicker(sym);
    if (t) terms.set(t, `$${sym.toUpperCase()}`);
  }

  const raw = text
    .toLowerCase()
    .replace(CASHTAG_RE, " ")
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean)
    .slice(0, MAX_WORDS_PER_ITEM);

  let prev: string | null = null;
  raw.forEach((w, i) => {
    const s = singular(w);
    const ok = validWord(w) && validWord(s);
    if (ok && !terms.has(s)) terms.set(s, titleCase(s));
    if (ok && prev && i < MAX_BIGRAM_WORDS && prev !== s) {
      const bigram = `${prev} ${s}`;
      if (!terms.has(bigram)) terms.set(bigram, titleCase(bigram));
    }
    prev = ok ? s : null;
  });
  return terms;
}

// ── heat ─────────────────────────────────────────────────────────────────────

const log10p = (x = 0) => Math.log10(1 + Math.max(0, x));

function decay(ageMs: number, halfLifeMs: number): number {
  return Math.pow(0.5, Math.max(0, ageMs) / halfLifeMs);
}

const ATTENTION_KINDS = new Set(["post", "trend", "note"]);
const isAttention = (i: SignalItem) => ATTENTION_KINDS.has(i.kind);

/** How much one item says "this is hot right now". */
export function itemHeat(item: SignalItem, now: number): number {
  const age = now - item.createdAt;
  switch (item.kind) {
    case "launch":
      return (1 + log10p((item.marketCapUsd ?? 0) / 10_000) + (item.graduated ? 1 : 0) + log10p(item.replies) / 2) *
        decay(age, 1.5 * HOUR);
    case "token":
      return (1 + log10p((item.marketCapUsd ?? 0) / 50_000) + log10p((item.volume24hUsd ?? 0) / 50_000) +
        (item.boosts ? 0.3 : 0)) * decay(age, 24 * HOUR);
    case "post":
      return (0.5 + log10p(item.engagement)) * decay(age, 3 * HOUR);
    case "trend":
      return 1 + log10p(item.engagement) / 2;
    case "note":
      return item.source === "news" ? 2 : 2.5;
  }
}

/** Single-item terms are allowed only from strong standalone signals (a trend, a note, a viral post). */
function strongSingle(item: SignalItem): boolean {
  return item.kind === "trend" || item.kind === "note" || (item.kind === "post" && (item.engagement ?? 0) >= 1000);
}

// ── clustering ───────────────────────────────────────────────────────────────

interface TermStat {
  term: string;
  items: Set<number>;
  heat: number;
  displays: Map<string, number>;
  strongSingle: boolean;
}

function jaccard(a: Set<number>, b: Set<number>): number {
  let inter = 0;
  for (const x of a) if (b.has(x)) inter++;
  return inter / (a.size + b.size - inter || 1);
}

function containment(small: Set<number>, big: Set<number>): number {
  let inter = 0;
  for (const x of small) if (big.has(x)) inter++;
  return inter / (small.size || 1);
}

interface Cluster {
  terms: TermStat[];
  items: Set<number>;
}

function cluster(stats: TermStat[]): Cluster[] {
  const clusters: Cluster[] = [];
  for (const s of stats) {
    let best: Cluster | null = null;
    let bestScore = 0;
    for (const c of clusters) {
      let sim = jaccard(s.items, c.items);
      // "baby pengu" belongs to the "pengu" narrative when its items are (nearly) a subset.
      const words = s.term.split(" ");
      if (words.length > 1 && c.terms.some((t) => words.includes(t.term)) && containment(s.items, c.items) >= 0.9) {
        sim = Math.max(sim, 0.75);
      }
      if (sim > bestScore) {
        bestScore = sim;
        best = c;
      }
    }
    if (best && bestScore >= 0.5) {
      best.terms.push(s);
      for (const i of s.items) best.items.add(i);
    } else {
      clusters.push({ terms: [s], items: new Set(s.items) });
    }
  }
  return clusters;
}

function labelFor(c: Cluster): string {
  const top = c.terms[0];
  // Prefer a bigram that contains the top term and covers most of its items: "Baby Pengu" over "Baby".
  const bigram = c.terms.find(
    (t) => t.term.includes(" ") && t.term.split(" ").includes(top.term) && t.items.size >= top.items.size * 0.8,
  );
  const chosen = bigram ?? top;
  return [...chosen.displays.entries()].sort((a, b) => b[1] - a[1])[0][0];
}

// ── phase ────────────────────────────────────────────────────────────────────

export function classifyPhase(n: Pick<Narrative, "launches" | "posts" | "maxMarketCapUsd" | "lastSeen">, now: number): Phase {
  if (n.launches.total >= 25) return "saturated";
  if (n.lastSeen < now - 3 * HOUR) return "cooling";
  if (n.maxMarketCapUsd >= 300_000 && (n.launches.last1h >= 2 || n.posts.last1h >= 2)) return "running";
  if (n.launches.total <= 2 && n.posts.total > 0) return "emerging";
  if (n.launches.last1h >= 3 || n.posts.last1h >= 3) return "heating";
  if (n.launches.last1h === 0 && n.posts.last1h === 0) return "cooling";
  return "heating";
}

// ── report ───────────────────────────────────────────────────────────────────

function coinRef(i: SignalItem, now: number): CoinRef {
  return {
    name: i.name ?? i.symbol ?? "?",
    symbol: i.symbol ?? "",
    url: i.url,
    imageUrl: i.imageUrl,
    marketCapUsd: i.marketCapUsd,
    ageMinutes: Math.max(0, Math.round((now - i.createdAt) / MIN)),
    source: i.source,
    graduated: i.graduated,
  };
}

function postRef(i: SignalItem, now: number): PostRef {
  return {
    text: i.text.length > 280 ? `${i.text.slice(0, 277)}…` : i.text,
    author: i.author,
    url: i.url,
    engagement: i.engagement ?? 0,
    ageMinutes: Math.max(0, Math.round((now - i.createdAt) / MIN)),
    source: i.source,
  };
}

export interface AnalyzeOptions {
  now?: number;
  maxNarratives?: number;
  /** Extra items (manual notes, news scan) merged into the snapshot before analysis. */
  extraItems?: SignalItem[];
}

export function analyze(snapshot: Snapshot, opts: AnalyzeOptions = {}): RadarReport {
  const now = opts.now ?? snapshot.generatedAt;
  const items = [...snapshot.items, ...(opts.extraItems ?? [])];
  const heat = items.map((i) => itemHeat(i, now));

  const stats = new Map<string, TermStat>();
  items.forEach((item, idx) => {
    for (const [term, display] of extractTerms(item)) {
      let s = stats.get(term);
      if (!s) {
        s = { term, items: new Set(), heat: 0, displays: new Map(), strongSingle: false };
        stats.set(term, s);
      }
      if (s.items.has(idx)) continue;
      s.items.add(idx);
      s.heat += heat[idx];
      s.displays.set(display, (s.displays.get(display) ?? 0) + 1);
      if (strongSingle(item)) s.strongSingle = true;
    }
  });

  const launchCount = items.filter((i) => i.kind === "launch").length;
  const candidates = [...stats.values()]
    .filter((s) => s.items.size >= 2 || s.strongSingle)
    .filter((s) => {
      // Drop words that show up in a large share of everything (boilerplate the stopword list missed).
      if (items.length >= 60 && s.items.size > items.length * 0.5) return false;
      const launches = [...s.items].filter((i) => items[i].kind === "launch").length;
      return !(launchCount >= 40 && launches > launchCount * 0.5);
    })
    .sort((a, b) => b.heat - a.heat || b.items.size - a.items.size)
    .slice(0, 200);

  const narratives: Narrative[] = cluster(candidates).map((c) => {
    const members = [...c.items].map((i) => items[i]);
    const launches = members.filter((i) => i.kind === "launch");
    const tokens = members.filter((i) => i.kind === "token");
    const attention = members.filter(isAttention);
    const coins = [...launches, ...tokens];
    const caps = coins.map((i) => i.marketCapUsd ?? 0);

    const sources = [...new Set(members.map((i) => i.source))] as SourceId[];
    const groups = [launches.length > 0, attention.length > 0, tokens.length > 0].filter(Boolean).length;
    const momentum = launches.filter((i) => now - i.createdAt <= HOUR).length;
    const rawScore =
      [...c.items].reduce((sum, i) => sum + heat[i], 0) * (1 + 0.5 * (groups - 1)) +
      (momentum >= 2 ? Math.log2(1 + momentum) : 0);

    const seenTickers = new Map<string, number>();
    for (const coin of coins) {
      const t = coin.symbol?.toUpperCase();
      if (t) seenTickers.set(t, Math.max(seenTickers.get(t) ?? 0, coin.marketCapUsd ?? 0));
    }

    const n: Narrative = {
      key: c.terms[0].term,
      label: labelFor(c),
      terms: c.terms.slice(0, 8).map((t) => t.term),
      score: 0,
      rawScore,
      phase: "emerging",
      launches: {
        total: launches.length,
        last15m: launches.filter((i) => now - i.createdAt <= 15 * MIN).length,
        last1h: momentum,
      },
      posts: {
        total: attention.length,
        last1h: attention.filter((i) => now - i.createdAt <= HOUR).length,
        engagement: attention.reduce((s, i) => s + (i.engagement ?? 0), 0),
      },
      listedTokens: tokens.length,
      maxMarketCapUsd: Math.max(0, ...caps),
      combinedMarketCapUsd: caps.reduce((a, b) => a + b, 0),
      firstSeen: Math.min(...members.map((i) => i.createdAt)),
      lastSeen: Math.max(...members.map((i) => i.createdAt)),
      sources,
      topCoins: [...coins]
        .sort((a, b) => (b.marketCapUsd ?? 0) - (a.marketCapUsd ?? 0))
        .slice(0, 5)
        .map((i) => coinRef(i, now)),
      samplePosts: [...attention]
        .sort((a, b) => (b.engagement ?? 0) - (a.engagement ?? 0))
        .slice(0, 3)
        .map((i) => postRef(i, now)),
      takenTickers: [...seenTickers.entries()].sort((a, b) => b[1] - a[1]).slice(0, 30).map(([t]) => t),
    };
    n.phase = classifyPhase(n, now);
    return n;
  });

  narratives.sort((a, b) => b.rawScore - a.rawScore);
  const top = narratives.slice(0, opts.maxNarratives ?? 25);
  const max = top[0]?.rawScore || 1;
  for (const n of top) n.score = Math.round((100 * n.rawScore) / max);

  const freshLaunches = items
    .filter((i) => i.kind === "launch")
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 12)
    .map((i) => coinRef(i, now));

  return { generatedAt: now, sources: snapshot.sources, narratives: top, freshLaunches, itemCount: items.length };
}
