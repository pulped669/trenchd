"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import toast from "react-hot-toast";

export default function CreateToken() {
  const { connected } = useWallet();
  const [name, setName] = useState("");
  const [ticker, setTicker] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();

    if (!connected) {
      toast.error("Connect your wallet first");
      return;
    }

    if (!name || !ticker) {
      toast.error("Name and ticker are required");
      return;
    }

    setCreating(true);
    // TODO: Implement on-chain token creation
    toast.success("Token creation coming soon!");
    setCreating(false);
  }

  return (
    <main className="mx-auto w-full max-w-lg px-4 py-12">
      <h1 className="text-2xl font-bold text-white">Create Token</h1>
      <p className="mt-1 text-sm text-zinc-400">
        Launch a token on a bonding curve. No presale, no team allocation.
      </p>

      <form onSubmit={handleCreate} className="mt-8 space-y-5">
        <div>
          <label className="text-sm font-medium text-zinc-300">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. TrenchCat"
            maxLength={32}
            className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-white placeholder-zinc-600 outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-zinc-300">Ticker</label>
          <input
            type="text"
            value={ticker}
            onChange={(e) => setTicker(e.target.value.toUpperCase())}
            placeholder="e.g. TCAT"
            maxLength={10}
            className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-white placeholder-zinc-600 outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-zinc-300">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What's this token about?"
            rows={3}
            maxLength={256}
            className="mt-1 w-full resize-none rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-white placeholder-zinc-600 outline-none focus:border-emerald-500"
          />
          <p className="mt-1 text-right text-xs text-zinc-600">
            {description.length}/256
          </p>
        </div>

        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
          <h3 className="text-sm font-medium text-zinc-300">Token Details</h3>
          <div className="mt-2 space-y-1 text-xs text-zinc-500">
            <p>Supply: 1,000,000,000 tokens</p>
            <p>Fair launch — no presale, no team tokens</p>
            <p>Bonding curve graduates to Raydium at ~69 SOL market cap</p>
          </div>
        </div>

        {connected ? (
          <button
            type="submit"
            disabled={creating || !name || !ticker}
            className="w-full rounded-lg bg-emerald-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {creating ? "Creating..." : "Create Token"}
          </button>
        ) : (
          <p className="rounded-lg border border-zinc-800 py-3 text-center text-sm text-zinc-500">
            Connect your wallet to create a token
          </p>
        )}
      </form>
    </main>
  );
}
