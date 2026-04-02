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
    <main className="min-h-screen flex items-center justify-center px-6 pt-14">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md py-16"
      >
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-[13px] text-muted backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            New Token
          </span>
          <h1 className="mt-5 text-3xl font-semibold tracking-[-0.02em]">
            Launch your token
          </h1>
          <p className="mt-2 text-[15px] text-muted">
            Fair launch. No presale. No team allocation.
          </p>
        </div>

        <form onSubmit={handleCreate} className="mt-10 space-y-4">
          <div>
            <label className="text-[13px] font-medium text-muted">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. TrenchCat"
              maxLength={32}
              className="mt-1.5 w-full rounded-2xl border border-white/[0.06] bg-white/[0.03] px-4 py-3.5 text-[15px] text-foreground placeholder-muted/40 outline-none transition-all focus:border-accent/30 focus:bg-white/[0.05]"
            />
          </div>

          <div>
            <label className="text-[13px] font-medium text-muted">
              Ticker
            </label>
            <input
              type="text"
              value={ticker}
              onChange={(e) => setTicker(e.target.value.toUpperCase())}
              placeholder="e.g. TCAT"
              maxLength={10}
              className="mt-1.5 w-full rounded-2xl border border-white/[0.06] bg-white/[0.03] px-4 py-3.5 text-[15px] text-foreground placeholder-muted/40 outline-none transition-all focus:border-accent/30 focus:bg-white/[0.05]"
            />
          </div>

          <div>
            <label className="text-[13px] font-medium text-muted">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's this token about?"
              rows={3}
              maxLength={256}
              className="mt-1.5 w-full resize-none rounded-2xl border border-white/[0.06] bg-white/[0.03] px-4 py-3.5 text-[15px] text-foreground placeholder-muted/40 outline-none transition-all focus:border-accent/30 focus:bg-white/[0.05]"
            />
            <p className="mt-1 text-right text-[12px] text-muted/40">
              {description.length}/256
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
            <h3 className="text-[13px] font-semibold text-foreground">
              Token Details
            </h3>
            <div className="mt-3 space-y-2.5 text-[14px]">
              <div className="flex items-center justify-between">
                <span className="text-muted">Supply</span>
                <span className="font-medium">1,000,000,000</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted">Team allocation</span>
                <span className="font-medium text-accent">0%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted">Graduates at</span>
                <span className="font-medium">~69 SOL</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted">DEX</span>
                <span className="font-medium">Raydium</span>
              </div>
            </div>
          </div>

          {connected ? (
            <button
              type="submit"
              disabled={creating || !name || !ticker}
              className="glow w-full rounded-2xl bg-accent py-4 text-[15px] font-semibold text-background transition-all hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-30 disabled:shadow-none disabled:hover:scale-100"
            >
              {creating ? "Deploying..." : "Launch Token"}
            </button>
          ) : (
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] py-4 text-center text-[14px] text-muted">
              Connect your wallet to launch
            </div>
          )}
        </form>
      </motion.div>
    </main>
  );
}
