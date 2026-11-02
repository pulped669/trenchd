// Runtime configuration for the radar. Everything is read from env so the
// same code runs in the Next.js server, the CLI, and a cron job.

function list(value: string | undefined, sep = ","): string[] {
  return (value ?? "")
    .split(sep)
    .map((s) => s.trim())
    .filter(Boolean);
}

function num(value: string | undefined, fallback: number): number {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

/** Accounts whose posts tend to start or move memecoin metas. Override with X_ACCOUNTS. */
const DEFAULT_X_ACCOUNTS = ["elonmusk", "pumpdotfun", "blknoiz06", "notthreadguy", "frankdegods", "MustStopMurad"];

/** Provider-neutral keyword queries. Override with X_QUERIES (separated by "||"). */
const DEFAULT_X_QUERIES = [
  "pump.fun OR pumpfun",
  'memecoin OR memecoins OR "meme coin"',
  '"new meta" OR "the meta" OR narrative solana',
];

export function radarConfig() {
  const env = process.env;
  return {
    pumpfun: {
      enabled: env.PUMPFUN_DISABLED !== "1",
      apiBase: env.PUMPFUN_API_BASE || "https://frontend-api-v3.pump.fun",
      includeNsfw: env.PUMPFUN_INCLUDE_NSFW === "1",
      /** How many of the newest launches to pull (paged 50 at a time). */
      newestLimit: num(env.PUMPFUN_NEWEST_LIMIT, 150),
    },
    dexscreener: {
      enabled: env.DEXSCREENER_DISABLED !== "1",
      apiBase: env.DEXSCREENER_API_BASE || "https://api.dexscreener.com",
      chain: env.DEXSCREENER_CHAIN || "solana",
    },
    x: {
      bearerToken: env.X_BEARER_TOKEN || "",
      twitterApiIoKey: env.TWITTERAPI_IO_KEY || "",
      accounts: env.X_ACCOUNTS !== undefined ? list(env.X_ACCOUNTS) : DEFAULT_X_ACCOUNTS,
      queries: env.X_QUERIES !== undefined ? list(env.X_QUERIES, "||") : DEFAULT_X_QUERIES,
      /** Yahoo WOEID for the trends feed. 1 = worldwide, 23424977 = US. */
      trendsWoeid: num(env.X_TRENDS_WOEID, 1),
      /** Minimum likes for keyword-search posts (twitterapi.io only; v2 has no such operator). */
      minFaves: num(env.X_MIN_FAVES, 25),
    },
    claude: {
      model: env.RADAR_MODEL || "claude-opus-5-5",
      effort: (env.RADAR_EFFORT as "low" | "medium" | "high" | "xhigh" | "max" | undefined) || "high",
      configured: Boolean(env.ANTHROPIC_API_KEY || env.ANTHROPIC_AUTH_TOKEN),
    },
    snapshotTtlMs: num(env.RADAR_SNAPSHOT_TTL_SECONDS, 45) * 1000,
  };
}

export type RadarConfig = ReturnType<typeof radarConfig>;
