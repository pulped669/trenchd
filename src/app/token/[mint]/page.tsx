"use client";

import { use } from "react";
import { MOCK_TOKENS, MOCK_TRADES } from "@/lib/mock-data";
import { getProgress, TOTAL_SUPPLY, GRADUATION_THRESHOLD } from "@/lib/bonding-curve";
import TradePanel from "@/components/TradePanel";
import TradeHistory from "@/components/TradeHistory";

export default function TokenPage({
  params,
}: {
  params: Promise<{ mint: string }>;
}) {
  const { mint } = use(params);
  const token = MOCK_TOKENS.find((t) => t.mint === mint);
  const trades = MOCK_TRADES.filter((t) => t.mint === mint);

  if (!token) {
    return (
      <main className="flex flex-1 items-center justify-center">
        <p className="text-zinc-500">Token not found</p>
      </main>
    );
  }

  const progress = getProgress(token.sold);

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Token info */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-zinc-800 text-2xl font-bold text-zinc-400">
                {token.ticker.slice(0, 2)}
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-white">
                    {token.name}
                  </h1>
                  <span className="rounded-md bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400">
                    ${token.ticker}
                  </span>
                  {token.graduated && (
                    <span className="rounded-md bg-emerald-900/50 px-2 py-0.5 text-xs text-emerald-400">
                      Graduated
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-zinc-400">
                  {token.description}
                </p>
                <p className="mt-2 text-xs text-zinc-600">
                  Created by {token.creator}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="rounded-lg bg-zinc-800/50 px-4 py-3">
                <p className="text-xs text-zinc-500">Market Cap</p>
                <p className="mt-1 text-lg font-semibold text-emerald-400">
                  {token.marketCap.toFixed(1)} SOL
                </p>
              </div>
              <div className="rounded-lg bg-zinc-800/50 px-4 py-3">
                <p className="text-xs text-zinc-500">Tokens Sold</p>
                <p className="mt-1 text-lg font-semibold text-white">
                  {((token.sold / TOTAL_SUPPLY) * 100).toFixed(1)}%
                </p>
              </div>
              <div className="rounded-lg bg-zinc-800/50 px-4 py-3">
                <p className="text-xs text-zinc-500">Graduation</p>
                <p className="mt-1 text-lg font-semibold text-white">
                  {progress.toFixed(1)}%
                </p>
              </div>
            </div>

            {/* Bonding curve progress */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-zinc-500">
                <span>Bonding curve progress</span>
                <span>
                  {(token.sold / 1_000_000).toFixed(0)}M /{" "}
                  {(GRADUATION_THRESHOLD / 1_000_000).toFixed(0)}M tokens
                </span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-zinc-800">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Trade history */}
          <TradeHistory trades={trades} />
        </div>

        {/* Trade panel */}
        <div>
          <TradePanel token={token} />
        </div>
      </div>
    </main>
  );
}
