import { radarConfig } from "../config";
import { errorMessage } from "../http";
import type { SignalItem, Snapshot, SourceId, SourceStatus } from "../types";
import { fetchDexscreener } from "./dexscreener";
import { fetchPumpfun } from "./pumpfun";
import { fetchX, xProvider } from "./x";

interface Job {
  id: SourceId;
  label: string;
  configured: boolean;
  note?: string;
  run: () => Promise<{ items: SignalItem[]; note: string }>;
}

let cached: { at: number; snapshot: Snapshot } | null = null;
let inflight: Promise<Snapshot> | null = null;

/** Pull every configured source in parallel. One failing source never sinks the rest. */
export async function collectSnapshot(opts: { fresh?: boolean } = {}): Promise<Snapshot> {
  const cfg = radarConfig();
  if (!opts.fresh && cached && Date.now() - cached.at < cfg.snapshotTtlMs) return cached.snapshot;
  if (inflight) return inflight;

  const jobs: Job[] = [
    { id: "pumpfun", label: "pump.fun", configured: cfg.pumpfun.enabled, run: () => fetchPumpfun(cfg.pumpfun) },
    {
      id: "dexscreener",
      label: "DexScreener",
      configured: cfg.dexscreener.enabled,
      run: () => fetchDexscreener(cfg.dexscreener),
    },
    {
      id: "x",
      label: "X / CT",
      configured: xProvider(cfg.x) !== null,
      note: "Set X_BEARER_TOKEN or TWITTERAPI_IO_KEY",
      run: () => fetchX(cfg.x),
    },
  ];

  inflight = (async () => {
    const settled = await Promise.all(
      jobs.map(async (job): Promise<{ status: SourceStatus; items: SignalItem[] }> => {
        const base = { id: job.id, label: job.label, configured: job.configured };
        if (!job.configured) return { status: { ...base, ok: false, count: 0, note: job.note }, items: [] };
        try {
          const { items, note } = await job.run();
          return { status: { ...base, ok: true, count: items.length, note: note || undefined }, items };
        } catch (err) {
          return { status: { ...base, ok: false, count: 0, error: errorMessage(err) }, items: [] };
        }
      }),
    );
    const snapshot: Snapshot = {
      generatedAt: Date.now(),
      items: settled.flatMap((s) => s.items),
      sources: settled.map((s) => s.status),
    };
    cached = { at: Date.now(), snapshot };
    return snapshot;
  })().finally(() => {
    inflight = null;
  });
  return inflight;
}

/** Turn pasted timeline observations (one per line) into signal items. */
export function notesToItems(notes: string, now = Date.now()): SignalItem[] {
  return notes
    .split(/\r?\n/)
    .map((l) => l.replace(/^[-*•\d.)\s]+/, "").trim())
    .filter((l) => l.length >= 3)
    .slice(0, 50)
    .map((text, i) => ({
      id: `manual:${i}`,
      source: "manual" as const,
      kind: "note" as const,
      text,
      createdAt: now,
      // Treat each note as a moderately engaged post: you saw it, so it's live.
      engagement: 400,
    }));
}
