"use client";

import { useState } from "react";
import TokenCard from "@/components/TokenCard";
import { MOCK_TOKENS } from "@/lib/mock-data";

type SortOption = "newest" | "marketcap" | "progress";

export default function Home() {
  const [sort, setSort] = useState<SortOption>("newest");
  const [search, setSearch] = useState("");

  const filtered = MOCK_TOKENS.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.ticker.toLowerCase().includes(search.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "newest") return b.createdAt - a.createdAt;
    if (sort === "marketcap") return b.marketCap - a.marketCap;
    return b.sold / b.supply - a.sold / a.supply;
  });

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          Launch tokens in the{" "}
          <span className="text-emerald-400">trenches</span>
        </h1>
        <p className="mt-2 text-zinc-400">
          Create and trade fair-launch tokens on Solana with bonding curves
        </p>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tokens..."
          className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none focus:border-emerald-500 sm:w-72"
        />
        <div className="flex gap-1 rounded-lg bg-zinc-900 p-1">
          {(
            [
              ["newest", "New"],
              ["marketcap", "Market Cap"],
              ["progress", "Graduating"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              onClick={() => setSort(value)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                sort === value
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((token) => (
          <TokenCard key={token.mint} token={token} />
        ))}
      </div>

      {sorted.length === 0 && (
        <div className="py-20 text-center text-zinc-500">
          No tokens found. Be the first to{" "}
          <a href="/create" className="text-emerald-400 hover:underline">
            create one
          </a>
          .
        </div>
      )}
    </main>
  );
}
