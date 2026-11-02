// Claude turns the radar's evidence into launch ideas.
//
// Two calls:
//   1. (optional) news scan: web search for what's going viral right now. Its
//      lines are fed back into the narrative engine as "news" items, so a
//      breaking moment with zero pump.fun launches shows up as emerging.
//   2. idea generation: structured output validated against IdeasResultSchema.

import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { z } from "zod";
import { radarConfig } from "./config";
import type { Narrative, RadarReport, SignalItem } from "./types";

// ── output schema ────────────────────────────────────────────────────────────

export const PLAYS = ["first_mover", "derivative", "sequel", "inverse", "character", "mashup", "culture"] as const;
export const TIMINGS = ["launch_now", "next_few_hours", "today", "watch"] as const;
export const RISKS = ["low", "medium", "high"] as const;

// Enum-like fields are plain strings with the options in the description, then
// normalized below: this SDK's schema transform doesn't forward `enum` to the
// API, and a strict client-side enum would throw away a whole result over one
// "launch now" vs "launch_now".
const oneOf = (options: readonly string[], what: string) => `${what}. One of: ${options.join(", ")}`;

const RawIdeaSchema = z.object({
  name: z.string().describe("Token name as it would appear on pump.fun"),
  ticker: z.string().describe("Ticker without the $; 2-10 characters; not one of the narrative's taken tickers"),
  narrative: z.string().describe("Label of the radar narrative or news topic this rides"),
  play: z.string().describe(oneOf(PLAYS, "The kind of play")),
  pitch: z.string().describe("One line: what the coin is"),
  whyNow: z.string().describe("Why this window is open right now, citing the radar numbers"),
  evidence: z.array(z.string()).describe("Specific data points or posts from the input that support it"),
  timing: z.string().describe(oneOf(TIMINGS, "When to launch")),
  saturationRisk: z.string().describe(oneOf(RISKS, "How crowded the narrative already is")),
  conviction: z.number().describe("Integer 1-10, calibrated; most ideas land 4-7"),
  launchKit: z.object({
    description: z.string().describe("pump.fun description, 200 characters max"),
    imagePrompt: z.string().describe("Prompt for an image generator: subject, style, background"),
    firstPost: z.string().describe("Launch post for X in CT voice, 240 characters max"),
  }),
  risks: z.array(z.string()),
});

const RawResultSchema = z.object({
  marketRead: z.string().describe("2-4 sentences on what the trenches are doing right now"),
  ideas: z.array(RawIdeaSchema),
  avoid: z.array(z.object({ narrative: z.string(), reason: z.string() })),
});

type RawIdea = z.infer<typeof RawIdeaSchema>;

export type Idea = Omit<RawIdea, "play" | "timing" | "saturationRisk"> & {
  play: (typeof PLAYS)[number];
  timing: (typeof TIMINGS)[number];
  saturationRisk: (typeof RISKS)[number];
};

export interface IdeasResult {
  marketRead: string;
  ideas: Idea[];
  avoid: { narrative: string; reason: string }[];
}

function pick<T extends string>(value: string, options: readonly T[], fallback: T): T {
  const v = value.toLowerCase().replace(/[^a-z]+/g, "_").replace(/^_+|_+$/g, "");
  return options.find((o) => o === v) ?? options.find((o) => v && (v.includes(o) || o.includes(v))) ?? fallback;
}

export interface NewsLine {
  topic: string;
  url?: string;
}

export interface GenerateOptions {
  count?: number;
  /** Free-form style steer, e.g. "absurdist animals", "political satire", "clean brandable". */
  style?: string;
  notes?: string;
  news?: NewsLine[];
}

export class IdeaGenerationError extends Error {}

// ── prompts ──────────────────────────────────────────────────────────────────

const SYSTEM = `You are the strategy desk for someone who launches memecoins on pump.fun (Solana). Each request gives you a radar snapshot: narratives detected across fresh pump.fun launches, DexScreener-promoted tokens, crypto Twitter posts and trends, a web news scan, and the user's own notes. Your job is to propose coins to launch that ride ("vamp") a narrative that is live right now, and to say which narratives to stay away from.

How to read the radar:
- phase "emerging": attention exists but few or no coins yet. The first-mover window; the best ideas become the canonical coin for the moment.
- phase "heating": launches are accelerating, no clear winner yet. A sharper name or angle can still take it.
- phase "running": a coin is already big and the narrative is still drawing launches and posts. Derivatives (its wife, dog, baby, rival, sequel) catch spillover flows.
- phase "saturated": 25+ launches already. Late; only a clearly distinct angle has a chance.
- phase "cooling": activity is fading. Skip unless the input shows a fresh catalyst.
- Strong setups combine real attention (posts, trends, notes), proof of money (a runner's market cap) and room (few launches so far). Cite the numbers you rely on.

Plays: first_mover (first coin for a brand-new moment), derivative (a spin-off of a runner), sequel (the next chapter of a story), inverse (the counter-meme), character (a named character from a viral post or clip), mashup (two live metas combined), culture (a broader internet moment).

Naming: short, memeable, legible at a glance next to the image. The ticker must not exactly match any of the narrative's takenTickers; an exact copy of a live coin reads as a fake and CT calls it out. Riffs and spin-offs are fine.

Lines you hold: don't present a coin as the official token of a real person, company or project, or imply they endorse it; parody of public figures is fine when it is obviously a meme. Never promise or imply returns in the launch kit.

Launch kit: pump.fun description of 200 characters or fewer; an image prompt for a generator (subject, style, background; avoid text in the image unless the joke needs it); a launch post for X of 240 characters or fewer in native CT voice.

Rank ideas best first. Be calibrated with conviction: most ideas land 4-7, reserve 8+ for setups with attention, money and room all present. Put saturated or dead narratives from the radar in "avoid" with the reason.`;

function compactNarrative(n: Narrative) {
  return {
    label: n.label,
    terms: n.terms,
    phase: n.phase,
    score: n.score,
    launches: n.launches,
    posts: n.posts,
    listedTokens: n.listedTokens,
    maxMarketCapUsd: Math.round(n.maxMarketCapUsd),
    sources: n.sources,
    topCoins: n.topCoins.map((c) => ({
      name: c.name,
      symbol: c.symbol,
      marketCapUsd: c.marketCapUsd ? Math.round(c.marketCapUsd) : undefined,
      ageMinutes: c.ageMinutes,
      graduated: c.graduated || undefined,
    })),
    samplePosts: n.samplePosts.map((p) => ({ text: p.text, author: p.author, engagement: p.engagement, ageMinutes: p.ageMinutes })),
    takenTickers: n.takenTickers,
  };
}

function buildUserMessage(report: RadarReport, opts: GenerateOptions): string {
  const payload = {
    now: new Date(report.generatedAt).toISOString(),
    sources: report.sources.map((s) => ({ source: s.label, ok: s.ok, items: s.count, ...(s.ok ? {} : { status: s.error ?? s.note }) })),
    narratives: report.narratives.slice(0, 15).map(compactNarrative),
    freshLaunches: report.freshLaunches.map((c) => `${c.name} ($${c.symbol}) ${c.ageMinutes}m`),
    newsScan: opts.news?.map((n) => n.topic) ?? [],
    userNotes: opts.notes?.trim() || undefined,
  };
  const count = Math.min(Math.max(opts.count ?? 6, 1), 12);
  return [
    "<radar>",
    JSON.stringify(payload, null, 1),
    "</radar>",
    "",
    `Propose ${count} launch ideas.${opts.style?.trim() ? ` Style steer from the user: ${opts.style.trim()}` : ""}`,
    "Sources that are down or unconfigured are simply missing evidence, not a signal.",
  ].join("\n");
}

// ── calls ────────────────────────────────────────────────────────────────────

function client() {
  return new Anthropic();
}

function refusalMessage(msg: { stop_reason: string | null; stop_details?: { category?: string | null } | null }) {
  return `Claude declined this request${msg.stop_details?.category ? ` (${msg.stop_details.category})` : ""}.`;
}

/** Web search for what's going viral right now. Returns parsed "topic — why (url)" lines. */
export async function scanNews(): Promise<NewsLine[]> {
  const cfg = radarConfig().claude;
  const today = new Date().toISOString().slice(0, 10);
  const messages: Anthropic.Beta.BetaMessageParam[] = [
    {
      role: "user",
      content: `Today is ${today}. Search the web for what is going viral right now (roughly the past 24 hours) that Solana memecoin traders are riffing on or soon will be: viral posts by Elon Musk and other huge accounts, viral animals and characters, breaking news moments, internet culture, crypto-native drama, and memecoins crypto Twitter is talking about.

Reply with only 6 to 12 lines, most memeable first, each in exactly this format:
topic — why it's hot (source url)`,
    },
  ];

  let final: Anthropic.Beta.BetaMessage | null = null;
  for (let turn = 0; turn < 4; turn++) {
    final = await client()
      .beta.messages.stream({
        model: cfg.model,
        max_tokens: 16000,
        betas: ["server-side-fallback-2026-07-01"],
        fallbacks: "default",
        thinking: { type: "adaptive" },
        output_config: { effort: "medium" },
        tools: [{ type: "web_search_20260209", name: "web_search", max_uses: 6 }],
        messages,
      })
      .finalMessage();
    if (final.stop_reason !== "pause_turn") break;
    messages.push({ role: "assistant", content: final.content });
  }
  if (!final) return [];
  if (final.stop_reason === "refusal") throw new IdeaGenerationError(refusalMessage(final));

  const text = final.content.flatMap((b) => (b.type === "text" ? [b.text] : [])).join("");
  return text
    .split(/\r?\n/)
    .map((l) => l.replace(/^[-*•\d.)\s]+/, "").trim())
    .filter((l) => l.includes("—") || l.includes(" - "))
    .slice(0, 12)
    .map((line) => {
      const url = line.match(/\((https?:\/\/[^)\s]+)\)\s*$/)?.[1];
      return { topic: url ? line.slice(0, line.lastIndexOf("(")).trim() : line, url };
    });
}

export function newsToItems(news: NewsLine[], now = Date.now()): SignalItem[] {
  return news.map((n, i) => ({
    id: `news:${i}`,
    source: "news" as const,
    kind: "note" as const,
    text: n.topic,
    url: n.url,
    createdAt: now,
    engagement: 300,
  }));
}

export async function generateIdeas(
  report: RadarReport,
  opts: GenerateOptions = {},
): Promise<{ result: IdeasResult; model: string; usage: { inputTokens: number; outputTokens: number } }> {
  const cfg = radarConfig().claude;
  const msg = await client()
    .beta.messages.stream({
      model: cfg.model,
      max_tokens: 64000,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      thinking: { type: "adaptive" },
      output_config: { effort: cfg.effort, format: betaZodOutputFormat(RawResultSchema) },
      system: SYSTEM,
      messages: [{ role: "user", content: buildUserMessage(report, opts) }],
    })
    .finalMessage();

  if (msg.stop_reason === "refusal") throw new IdeaGenerationError(refusalMessage(msg));
  if (msg.stop_reason === "max_tokens") throw new IdeaGenerationError("Ran out of output tokens before finishing.");
  const parsed = msg.parsed_output;
  if (!parsed) throw new IdeaGenerationError("Claude's reply didn't match the ideas schema.");

  const taken = new Set(report.narratives.flatMap((n) => n.takenTickers));
  const ideas: Idea[] = parsed.ideas.map((idea) => ({
    ...idea,
    play: pick(idea.play, PLAYS, "culture"),
    timing: pick(idea.timing, TIMINGS, "watch"),
    saturationRisk: pick(idea.saturationRisk, RISKS, "medium"),
    ticker: idea.ticker.replace(/^\$/, "").toUpperCase(),
    conviction: Math.min(10, Math.max(1, Math.round(idea.conviction))),
    launchKit: { ...idea.launchKit, description: idea.launchKit.description.slice(0, 200) },
  }));
  // Belt and braces for the "no exact clones" rule.
  const flagged = ideas.map((idea) =>
    taken.has(idea.ticker) ? { ...idea, risks: [`$${idea.ticker} is already taken by a live coin`, ...idea.risks] } : idea,
  );

  return {
    result: { ...parsed, ideas: flagged },
    model: msg.model,
    usage: { inputTokens: msg.usage.input_tokens, outputTokens: msg.usage.output_tokens },
  };
}
