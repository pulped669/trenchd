// Crypto Twitter. Two interchangeable providers, picked by which key is set:
//   X_BEARER_TOKEN     official X API v2 (recent search + trends)
//   TWITTERAPI_IO_KEY  twitterapi.io, a cheaper third-party read API
// With neither set the radar still runs on pump.fun + DexScreener, and you
// can paste what you're seeing on the timeline as manual notes.

import type { RadarConfig } from "../config";
import { getJson, read } from "../http";
import type { SignalItem } from "../types";

type Raw = Record<string, unknown>;
type XConfig = RadarConfig["x"];

const LOOKBACK_MS = 6 * 60 * 60 * 1000;

export function xProvider(cfg: XConfig): "x-api" | "twitterapi.io" | null {
  if (cfg.bearerToken) return "x-api";
  if (cfg.twitterApiIoKey) return "twitterapi.io";
  return null;
}

function engagement(likes = 0, reposts = 0, replies = 0, quotes = 0) {
  return likes + 2 * reposts + replies + quotes;
}

/** Split `from:` queries so each stays under the 512-char v2 query limit. */
function accountQueries(accounts: string[]): string[] {
  const out: string[] = [];
  let cur: string[] = [];
  for (const a of accounts) {
    cur.push(`from:${a.replace(/^@/, "")}`);
    if (cur.join(" OR ").length > 400) {
      out.push(cur.join(" OR "));
      cur = [];
    }
  }
  if (cur.length) out.push(cur.join(" OR "));
  return out;
}

// ── Official X API v2 ────────────────────────────────────────────────────────

async function searchV2(cfg: XConfig, query: string): Promise<SignalItem[]> {
  const params = new URLSearchParams({
    query: `(${query}) -is:retweet`,
    max_results: "100",
    start_time: new Date(Date.now() - LOOKBACK_MS).toISOString(),
    "tweet.fields": "created_at,public_metrics,author_id,lang",
    expansions: "author_id",
    "user.fields": "username,public_metrics",
  });
  const data = await getJson<Raw>(`https://api.x.com/2/tweets/search/recent?${params}`, {
    headers: { authorization: `Bearer ${cfg.bearerToken}` },
  });
  const users = new Map<string, Raw>();
  for (const u of ((data.includes as Raw | undefined)?.users as Raw[] | undefined) ?? []) {
    const id = read.str(u.id);
    if (id) users.set(id, u);
  }
  return ((data.data as Raw[] | undefined) ?? []).flatMap((t) => {
    const id = read.str(t.id);
    const text = read.str(t.text);
    if (!id || !text) return [];
    const m = (t.public_metrics ?? {}) as Raw;
    const user = users.get(read.str(t.author_id) ?? "");
    const username = read.str(user?.username);
    const item: SignalItem = {
      id: `x:${id}`,
      source: "x",
      kind: "post",
      text,
      author: username,
      authorFollowers: read.num((user?.public_metrics as Raw | undefined)?.followers_count),
      url: username ? `https://x.com/${username}/status/${id}` : `https://x.com/i/status/${id}`,
      createdAt: read.time(t.created_at) ?? Date.now(),
      engagement: engagement(read.num(m.like_count), read.num(m.retweet_count), read.num(m.reply_count), read.num(m.quote_count)),
    };
    return [item];
  });
}

async function trendsV2(cfg: XConfig): Promise<SignalItem[]> {
  const data = await getJson<Raw>(`https://api.x.com/2/trends/by/woeid/${cfg.trendsWoeid}?max_trends=30`, {
    headers: { authorization: `Bearer ${cfg.bearerToken}` },
  });
  return trendItems((data.data as Raw[] | undefined) ?? []);
}

// ── twitterapi.io ────────────────────────────────────────────────────────────

function sinceClause(): string {
  const d = new Date(Date.now() - LOOKBACK_MS);
  const p = (n: number) => String(n).padStart(2, "0");
  return `since:${d.getUTCFullYear()}-${p(d.getUTCMonth() + 1)}-${p(d.getUTCDate())}_${p(d.getUTCHours())}:${p(d.getUTCMinutes())}:${p(d.getUTCSeconds())}_UTC`;
}

async function searchTwitterApiIo(cfg: XConfig, query: string, minFaves: number): Promise<SignalItem[]> {
  const q = `(${query}) -filter:retweets ${sinceClause()}${minFaves ? ` min_faves:${minFaves}` : ""}`;
  const params = new URLSearchParams({ query: q, queryType: "Latest" });
  const data = await getJson<Raw>(`https://api.twitterapi.io/twitter/tweet/advanced_search?${params}`, {
    headers: { "x-api-key": cfg.twitterApiIoKey },
  });
  return ((data.tweets as Raw[] | undefined) ?? []).flatMap((t) => {
    const id = read.str(t.id);
    const text = read.str(t.text);
    if (!id || !text) return [];
    const author = (t.author ?? {}) as Raw;
    const username = read.str(author.userName) ?? read.str(author.username);
    const item: SignalItem = {
      id: `x:${id}`,
      source: "x",
      kind: "post",
      text,
      author: username,
      authorFollowers: read.num(author.followers),
      url: read.str(t.url) ?? (username ? `https://x.com/${username}/status/${id}` : undefined),
      createdAt: read.time(t.createdAt) ?? Date.now(),
      engagement: engagement(read.num(t.likeCount), read.num(t.retweetCount), read.num(t.replyCount), read.num(t.quoteCount)),
    };
    return [item];
  });
}

async function trendsTwitterApiIo(cfg: XConfig): Promise<SignalItem[]> {
  const data = await getJson<Raw>(`https://api.twitterapi.io/twitter/trends?woeid=${cfg.trendsWoeid}`, {
    headers: { "x-api-key": cfg.twitterApiIoKey },
  });
  const arr = (data.trends ?? data.data ?? []) as Raw[];
  return trendItems(Array.isArray(arr) ? arr : []);
}

// ── shared ───────────────────────────────────────────────────────────────────

function trendItems(raw: Raw[]): SignalItem[] {
  const now = Date.now();
  return raw.flatMap((t, i) => {
    const inner = (t.trend ?? t) as Raw;
    const name = read.str(inner.trend_name) ?? read.str(inner.name);
    if (!name) return [];
    const volume = read.num(inner.tweet_count) ?? read.num(inner.tweet_volume) ?? read.num(inner.post_count);
    const item: SignalItem = {
      id: `x-trend:${name.toLowerCase()}`,
      source: "x",
      kind: "trend",
      text: name.replace(/^#/, ""),
      name,
      url: `https://x.com/search?q=${encodeURIComponent(name)}`,
      createdAt: now,
      // Unknown volume: rank-based stand-in so top trends still weigh more.
      engagement: volume ?? Math.max(50, 2000 - i * 60),
    };
    return [item];
  });
}

export async function fetchX(cfg: XConfig): Promise<{ items: SignalItem[]; note: string }> {
  const provider = xProvider(cfg);
  if (!provider) return { items: [], note: "" };

  const jobs: Promise<SignalItem[]>[] = [];
  if (provider === "x-api") {
    for (const q of cfg.queries) jobs.push(searchV2(cfg, q));
    for (const q of accountQueries(cfg.accounts)) jobs.push(searchV2(cfg, q));
    jobs.push(trendsV2(cfg));
  } else {
    for (const q of cfg.queries) jobs.push(searchTwitterApiIo(cfg, q, cfg.minFaves));
    for (const q of accountQueries(cfg.accounts)) jobs.push(searchTwitterApiIo(cfg, q, 0));
    jobs.push(trendsTwitterApiIo(cfg));
  }

  const results = await Promise.allSettled(jobs);
  const failures = results.filter((r): r is PromiseRejectedResult => r.status === "rejected");
  if (failures.length === results.length) throw failures[0].reason;

  const byId = new Map<string, SignalItem>();
  for (const r of results) {
    if (r.status === "fulfilled") for (const item of r.value) byId.set(item.id, item);
  }
  const note = `${provider}${failures.length ? ` · ${failures.length}/${results.length} requests failed` : ""}`;
  return { items: [...byId.values()], note };
}
