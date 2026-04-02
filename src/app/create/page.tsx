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
    <main className="mx-auto w-full max-w-lg px-4 py-16">
      <div className="text-center">
        <span className="inline-block rounded-full bg-green-light px-3 py-1 text-xs font-medium text-green-dark">
          New Token
        </span>
        <h1 className="mt-3 text-2xl font-bold text-foreground">
          Launch your token
        </h1>
        <p className="mt-1 text-sm text-gray-text">
          Fair launch on a bonding curve. No presale, no team allocation.
        </p>
      </div>

      <form onSubmit={handleCreate} className="mt-10 space-y-5">
        <div>
          <label className="text-sm font-medium text-foreground">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. TrenchCat"
            maxLength={32}
            className="mt-1.5 w-full rounded-xl border border-gray-border bg-white px-4 py-3 text-foreground placeholder-zinc-400 outline-none transition-colors focus:border-green"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-foreground">Ticker</label>
          <input
            type="text"
            value={ticker}
            onChange={(e) => setTicker(e.target.value.toUpperCase())}
            placeholder="e.g. TCAT"
            maxLength={10}
            className="mt-1.5 w-full rounded-xl border border-gray-border bg-white px-4 py-3 text-foreground placeholder-zinc-400 outline-none transition-colors focus:border-green"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-foreground">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What's this token about?"
            rows={3}
            maxLength={256}
            className="mt-1.5 w-full resize-none rounded-xl border border-gray-border bg-white px-4 py-3 text-foreground placeholder-zinc-400 outline-none transition-colors focus:border-green"
          />
          <p className="mt-1 text-right text-xs text-gray-text">
            {description.length}/256
          </p>
        </div>

        <div className="rounded-xl border border-gray-border bg-gray-bg p-4">
          <h3 className="text-sm font-medium text-foreground">Token Details</h3>
          <div className="mt-2 space-y-1 text-xs text-gray-text">
            <p>Supply: 1,000,000,000 tokens</p>
            <p>Fair launch — no presale, no team tokens</p>
            <p>Bonding curve graduates to Raydium at ~69 SOL market cap</p>
          </div>
        </div>

        {connected ? (
          <button
            type="submit"
            disabled={creating || !name || !ticker}
            className="w-full rounded-xl bg-green-dark py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {creating ? "Creating..." : "Launch Token"}
          </button>
        ) : (
          <div className="rounded-xl border border-gray-border bg-gray-bg py-4 text-center text-sm text-gray-text">
            Connect your wallet to launch a token
          </div>
        )}
      </form>
    </main>
  );
}
