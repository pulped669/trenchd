"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Token } from "@/types/token";
import { getBuyPrice, getSellPrice } from "@/lib/bonding-curve";

export default function TradePanel({ token }: { token: Token }) {
  const { connected } = useWallet();
  const [tab, setTab] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState("");

  const numAmount = Number(amount) || 0;
  const cost =
    tab === "buy"
      ? getBuyPrice(token.sold, numAmount)
      : getSellPrice(token.sold, numAmount);

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
      <div className="flex gap-1 rounded-lg bg-zinc-800 p-1">
        <button
          onClick={() => setTab("buy")}
          className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
            tab === "buy"
              ? "bg-emerald-600 text-white"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          Buy
        </button>
        <button
          onClick={() => setTab("sell")}
          className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
            tab === "sell"
              ? "bg-red-600 text-white"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          Sell
        </button>
      </div>

      <div className="mt-4">
        <label className="text-xs text-zinc-400">
          Amount ({token.ticker})
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0"
          className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-white placeholder-zinc-600 outline-none focus:border-emerald-500"
        />
        <div className="mt-2 flex gap-2">
          {[100_000, 1_000_000, 10_000_000, 100_000_000].map((preset) => (
            <button
              key={preset}
              onClick={() => setAmount(preset.toString())}
              className="rounded-md bg-zinc-800 px-2 py-1 text-xs text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-white"
            >
              {preset >= 1_000_000
                ? `${preset / 1_000_000}M`
                : `${preset / 1_000}K`}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between rounded-lg bg-zinc-800/50 px-3 py-2 text-sm">
        <span className="text-zinc-400">
          {tab === "buy" ? "Cost" : "Receive"}
        </span>
        <span className="text-white">{cost.toFixed(6)} SOL</span>
      </div>

      {connected ? (
        <button
          className={`mt-4 w-full rounded-lg py-3 text-sm font-semibold text-white transition-colors ${
            tab === "buy"
              ? "bg-emerald-600 hover:bg-emerald-500"
              : "bg-red-600 hover:bg-red-500"
          }`}
        >
          {tab === "buy" ? "Buy" : "Sell"} {token.ticker}
        </button>
      ) : (
        <p className="mt-4 text-center text-sm text-zinc-500">
          Connect wallet to trade
        </p>
      )}
    </div>
  );
}
