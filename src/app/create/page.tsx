"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { motion } from "framer-motion";
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
    toast.success("Token creation coming soon!");
    setCreating(false);
  }

  return (
    <main className="bg-gradient-hero bg-grid min-h-[calc(100vh-4rem)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto w-full max-w-lg px-6 py-16"
      >
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-3 py-1 text-xs font-medium text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
            New Token
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight">
            Launch your token
          </h1>
          <p className="mt-2 text-sm text-muted">
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
              className="mt-1.5 w-full rounded-xl border border-border bg-surface-light px-4 py-3 text-foreground placeholder-muted/50 outline-none transition-all focus:border-accent/40 focus:ring-1 focus:ring-accent/20"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">
              Ticker
            </label>
            <input
              type="text"
              value={ticker}
              onChange={(e) => setTicker(e.target.value.toUpperCase())}
              placeholder="e.g. TCAT"
              maxLength={10}
              className="mt-1.5 w-full rounded-xl border border-border bg-surface-light px-4 py-3 text-foreground placeholder-muted/50 outline-none transition-all focus:border-accent/40 focus:ring-1 focus:ring-accent/20"
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
              className="mt-1.5 w-full resize-none rounded-xl border border-border bg-surface-light px-4 py-3 text-foreground placeholder-muted/50 outline-none transition-all focus:border-accent/40 focus:ring-1 focus:ring-accent/20"
            />
            <p className="mt-1 text-right text-xs text-muted">
              {description.length}/256
            </p>
          </div>

          <div className="rounded-xl border border-border bg-surface-light/50 p-5">
            <h3 className="text-sm font-semibold text-foreground">
              Token Details
            </h3>
            <div className="mt-3 space-y-2 text-sm text-muted">
              <div className="flex items-center justify-between">
                <span>Supply</span>
                <span className="font-medium text-foreground">1,000,000,000</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Team allocation</span>
                <span className="font-medium text-accent">0%</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Graduates at</span>
                <span className="font-medium text-foreground">~69 SOL MC</span>
              </div>
              <div className="flex items-center justify-between">
                <span>DEX</span>
                <span className="font-medium text-foreground">Raydium</span>
              </div>
            </div>
          </div>

          {connected ? (
            <button
              type="submit"
              disabled={creating || !name || !ticker}
              className="glow-accent-sm w-full rounded-xl bg-accent py-3.5 text-sm font-semibold text-background transition-all hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100 disabled:shadow-none"
            >
              {creating ? "Deploying..." : "Launch Token"}
            </button>
          ) : (
            <div className="rounded-xl border border-border bg-surface-light/50 py-4 text-center text-sm text-muted">
              Connect your wallet to launch
            </div>
          )}
        </form>
      </motion.div>
    </main>
  );
}
