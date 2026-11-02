// Shared types for the trenchd radar: trend detection + launch idea generation.

export type SourceId = "pumpfun" | "dexscreener" | "x" | "news" | "manual";

export type ItemKind = "launch" | "token" | "post" | "trend" | "note";

/** One normalized observation from any source (a launch, a tweet, a trend, a note). */
export interface SignalItem {
  /** Unique across sources, e.g. "pumpfun:<mint>" or "x:<tweet id>". */
  id: string;
  source: SourceId;
  kind: ItemKind;
  /** Free text the term extractor reads (coin name + symbol + description, tweet text, ...). */
  text: string;
  name?: string;
  symbol?: string;
  url?: string;
  imageUrl?: string;
  /** ms epoch. */
  createdAt: number;
  marketCapUsd?: number;
  volume24hUsd?: number;
  priceChange1hPct?: number;
  /** likes + 2×reposts + replies + quotes, or trend tweet volume. */
  engagement?: number;
  author?: string;
  authorFollowers?: number;
  replies?: number;
  graduated?: boolean;
  boosts?: number;
}

export interface SourceStatus {
  id: SourceId;
  label: string;
  /** False when the source needs a key that isn't set. */
  configured: boolean;
  ok: boolean;
  count: number;
  error?: string;
  note?: string;
}

export interface Snapshot {
  generatedAt: number;
  items: SignalItem[];
  sources: SourceStatus[];
}

/**
 * Where a narrative sits in its lifecycle, from the point of view of someone
 * deciding whether to launch into it.
 */
export type Phase = "emerging" | "heating" | "running" | "saturated" | "cooling";

export interface CoinRef {
  name: string;
  symbol: string;
  url?: string;
  imageUrl?: string;
  marketCapUsd?: number;
  ageMinutes: number;
  source: SourceId;
  graduated?: boolean;
}

export interface PostRef {
  text: string;
  author?: string;
  url?: string;
  engagement: number;
  ageMinutes: number;
  source: SourceId;
}

export interface Narrative {
  key: string;
  label: string;
  terms: string[];
  /** 0–100, relative to the strongest narrative in this snapshot. */
  score: number;
  rawScore: number;
  phase: Phase;
  launches: { total: number; last15m: number; last1h: number };
  posts: { total: number; last1h: number; engagement: number };
  /** DexScreener-listed tokens (profiles/boosts) in this narrative. */
  listedTokens: number;
  maxMarketCapUsd: number;
  combinedMarketCapUsd: number;
  firstSeen: number;
  lastSeen: number;
  sources: SourceId[];
  topCoins: CoinRef[];
  samplePosts: PostRef[];
  /** Tickers already used by launches in this narrative (avoid exact clones). */
  takenTickers: string[];
}

export interface RadarReport {
  generatedAt: number;
  sources: SourceStatus[];
  narratives: Narrative[];
  freshLaunches: CoinRef[];
  itemCount: number;
}
