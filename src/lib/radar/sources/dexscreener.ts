// DexScreener's public API (no key). Token profiles and boosts are what teams
// pay to promote, so they're a decent read on which tokens are being pushed;
// /tokens/v1 fills in name, symbol, market cap and volume.

import type { RadarConfig } from "../config";
import { getJson, read } from "../http";
import type { SignalItem } from "../types";

type Raw = Record<string, unknown>;

interface Listing {
  address: string;
  description?: string;
  boosts?: number;
  icon?: string;
}

const BATCH = 30; // /tokens/v1 accepts up to 30 comma-separated addresses

export async function fetchDexscreener(cfg: RadarConfig["dexscreener"]): Promise<{ items: SignalItem[]; note: string }> {
  const base = cfg.apiBase;
  const lists = await Promise.allSettled([
    getJson<Raw[]>(`${base}/token-profiles/latest/v1`),
    getJson<Raw[]>(`${base}/token-boosts/latest/v1`),
    getJson<Raw[]>(`${base}/token-boosts/top/v1`),
  ]);
  if (lists.every((r) => r.status === "rejected")) throw (lists[0] as PromiseRejectedResult).reason;

  const listings = new Map<string, Listing>();
  for (const r of lists) {
    if (r.status !== "fulfilled" || !Array.isArray(r.value)) continue;
    for (const raw of r.value) {
      const address = read.str(raw.tokenAddress);
      if (!address || read.str(raw.chainId) !== cfg.chain) continue;
      const prev = listings.get(address);
      listings.set(address, {
        address,
        description: prev?.description ?? read.str(raw.description),
        icon: prev?.icon ?? read.str(raw.icon),
        boosts: Math.max(prev?.boosts ?? 0, read.num(raw.totalAmount) ?? read.num(raw.amount) ?? 0) || undefined,
      });
    }
  }

  const addresses = [...listings.keys()];
  const batches: string[][] = [];
  for (let i = 0; i < addresses.length; i += BATCH) batches.push(addresses.slice(i, i + BATCH));
  const pairResults = await Promise.allSettled(
    batches.map((b) => getJson<Raw[]>(`${base}/tokens/v1/${cfg.chain}/${b.join(",")}`)),
  );

  // Keep the most liquid pair per token.
  const bestPair = new Map<string, Raw>();
  for (const r of pairResults) {
    if (r.status !== "fulfilled" || !Array.isArray(r.value)) continue;
    for (const pair of r.value) {
      const baseToken = (pair.baseToken ?? {}) as Raw;
      const address = read.str(baseToken.address);
      if (!address || !listings.has(address)) continue;
      const liq = (p: Raw) => read.num((p.liquidity as Raw | undefined)?.usd) ?? 0;
      const prev = bestPair.get(address);
      if (!prev || liq(pair) > liq(prev)) bestPair.set(address, pair);
    }
  }

  const items: SignalItem[] = [];
  for (const [address, pair] of bestPair) {
    const listing = listings.get(address)!;
    const baseToken = (pair.baseToken ?? {}) as Raw;
    const name = read.str(baseToken.name) ?? "";
    const symbol = read.str(baseToken.symbol) ?? "";
    const info = (pair.info ?? {}) as Raw;
    items.push({
      id: `dexscreener:${address}`,
      source: "dexscreener",
      kind: "token",
      name,
      symbol,
      text: [name, symbol, listing.description].filter(Boolean).join(" \n "),
      url: read.str(pair.url) ?? `https://dexscreener.com/${cfg.chain}/${address}`,
      imageUrl: read.str(info.imageUrl) ?? listing.icon,
      createdAt: read.time(pair.pairCreatedAt) ?? Date.now(),
      marketCapUsd: read.num(pair.marketCap) ?? read.num(pair.fdv),
      volume24hUsd: read.num((pair.volume as Raw | undefined)?.h24),
      priceChange1hPct: read.num((pair.priceChange as Raw | undefined)?.h1),
      boosts: listing.boosts,
    });
  }
  const failed = pairResults.filter((r) => r.status === "rejected").length;
  return { items, note: failed ? `${failed}/${pairResults.length} pair lookups failed` : "" };
}
