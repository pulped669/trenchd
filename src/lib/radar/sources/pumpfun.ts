// pump.fun launches via the (unofficial, undocumented) frontend API that
// pump.fun's own site uses. It changes without notice; if it starts failing,
// point PUMPFUN_API_BASE at the current host or swap this adapter for a paid
// indexer (Moralis, Bitquery, Helius webhooks) or the PumpPortal websocket.

import type { RadarConfig } from "../config";
import { getJson, read } from "../http";
import type { SignalItem } from "../types";

const HEADERS = { origin: "https://pump.fun", referer: "https://pump.fun/" };
const PAGE = 50;

type RawCoin = Record<string, unknown>;

function toItem(c: RawCoin): SignalItem | null {
  const mint = read.str(c.mint);
  const name = read.str(c.name);
  const symbol = read.str(c.symbol);
  if (!mint || (!name && !symbol)) return null;
  const description = read.str(c.description) ?? "";
  return {
    id: `pumpfun:${mint}`,
    source: "pumpfun",
    kind: "launch",
    name: name ?? symbol!,
    symbol: symbol ?? name!,
    text: [name, symbol, description].filter(Boolean).join(" \n "),
    url: `https://pump.fun/coin/${mint}`,
    imageUrl: read.str(c.image_uri),
    createdAt: read.time(c.created_timestamp) ?? Date.now(),
    marketCapUsd: read.num(c.usd_market_cap),
    replies: read.num(c.reply_count),
    graduated: c.complete === true,
  };
}

function asArray(data: unknown): RawCoin[] {
  if (Array.isArray(data)) return data as RawCoin[];
  if (data && typeof data === "object") {
    const o = data as Record<string, unknown>;
    for (const key of ["coins", "data", "items", "results"]) {
      if (Array.isArray(o[key])) return o[key] as RawCoin[];
    }
    if (read.str(o.mint)) return [o];
  }
  return [];
}

export async function fetchPumpfun(cfg: RadarConfig["pumpfun"]): Promise<{ items: SignalItem[]; note: string }> {
  const base = cfg.apiBase.replace(/\/$/, "");
  const nsfw = `includeNsfw=${cfg.includeNsfw}`;
  const urls: string[] = [];
  for (let offset = 0; offset < cfg.newestLimit; offset += PAGE) {
    urls.push(`${base}/coins?offset=${offset}&limit=${PAGE}&sort=created_timestamp&order=DESC&${nsfw}`);
  }
  // Coins with the most recent trades: what's actually being bought right now.
  urls.push(`${base}/coins?offset=0&limit=${PAGE}&sort=last_trade_timestamp&order=DESC&${nsfw}`);
  urls.push(`${base}/coins/currently-live?offset=0&limit=${PAGE}&${nsfw}`);
  urls.push(`${base}/coins/king-of-the-hill?${nsfw}`);

  const results = await Promise.allSettled(urls.map((u) => getJson(u, { headers: HEADERS })));
  const failures = results.filter((r): r is PromiseRejectedResult => r.status === "rejected");
  if (failures.length === results.length) throw failures[0].reason;

  const byId = new Map<string, SignalItem>();
  for (const r of results) {
    if (r.status !== "fulfilled") continue;
    for (const raw of asArray(r.value)) {
      const item = toItem(raw);
      if (item && !byId.has(item.id)) byId.set(item.id, item);
    }
  }
  const note = failures.length ? `${failures.length}/${results.length} endpoints failed` : "";
  return { items: [...byId.values()], note };
}
