"use client";

import Link from "next/link";
import { Token } from "@/types/token";
import { getProgress } from "@/lib/bonding-curve";

function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function TokenCard({ token }: { token: Token }) {
  const progress = getProgress(token.sold);

  return (
    <Link href={`/token/${token.mint}`}>
      <div className="group cursor-pointer rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 transition-all hover:border-emerald-500/50 hover:bg-zinc-900">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-zinc-800 text-lg">
            {token.ticker.slice(0, 2)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="truncate font-semibold text-white">
                {token.name}
              </h3>
              <span className="shrink-0 text-xs text-zinc-500">
                ${token.ticker}
              </span>
            </div>
            <p className="mt-0.5 truncate text-xs text-zinc-500">
              {token.description}
            </p>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs">
          <span className="text-zinc-400">
            MC: <span className="text-emerald-400">{token.marketCap.toFixed(1)} SOL</span>
          </span>
          <span className="text-zinc-500">
            by {token.creator} · {timeAgo(token.createdAt)}
          </span>
        </div>

        <div className="mt-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-500">Bonding curve</span>
            <span className="text-zinc-400">{progress.toFixed(1)}%</span>
          </div>
          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </Link>
  );
}
