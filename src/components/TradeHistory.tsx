"use client";

import { Trade } from "@/types/token";

function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  return `${Math.floor(minutes / 60)}h ago`;
}

export default function TradeHistory({ trades }: { trades: Trade[] }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
      <h3 className="mb-3 text-sm font-semibold text-white">Recent Trades</h3>
      <div className="space-y-2">
        {trades.length === 0 && (
          <p className="text-sm text-zinc-500">No trades yet</p>
        )}
        {trades.map((trade) => (
          <div
            key={trade.id}
            className="flex items-center justify-between rounded-lg bg-zinc-800/50 px-3 py-2 text-xs"
          >
            <div className="flex items-center gap-2">
              <span
                className={
                  trade.type === "buy" ? "text-emerald-400" : "text-red-400"
                }
              >
                {trade.type === "buy" ? "BUY" : "SELL"}
              </span>
              <span className="text-zinc-400">{trade.trader}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-white">
                {(trade.amount / 1_000_000).toFixed(1)}M
              </span>
              <span className="text-zinc-500">{trade.solAmount} SOL</span>
              <span className="text-zinc-600">{timeAgo(trade.timestamp)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
