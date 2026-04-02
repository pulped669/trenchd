"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { signIn, useSession } from "next-auth/react";
import LiveTicker from "@/components/LiveTicker";
import MiniChart from "@/components/MiniChart";

const strategies = [
  {
    name: "Momentum",
    desc: "Rides trending tokens with volume spikes. Fast entries, tight stops.",
    risk: "High",
    riskColor: "text-red",
    avg: "+34.2%",
    trades: "~120/day",
  },
  {
    name: "Mean Reversion",
    desc: "Buys dips on fundamentally strong tokens. Patient, calculated entries.",
    risk: "Medium",
    riskColor: "text-yellow-400",
    avg: "+18.7%",
    trades: "~40/day",
  },
  {
    name: "Sniper",
    desc: "Catches new listings and launches early. Extremely fast execution.",
    risk: "Very High",
    riskColor: "text-red",
    avg: "+52.8%",
    trades: "~15/day",
  },
  {
    name: "DCA Grid",
    desc: "Steady accumulation with grid orders. Low maintenance, consistent returns.",
    risk: "Low",
    riskColor: "text-green",
    avg: "+11.3%",
    trades: "~200/day",
  },
];

const features = [
  {
    title: "Fully Autonomous",
    desc: "Set your strategy and walk away. The bot analyzes, enters, and exits 24/7 without intervention.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />
      </svg>
    ),
  },
  {
    title: "Sub-second Execution",
    desc: "Direct RPC connections with optimized transaction building. Faster than any human trader.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
      </svg>
    ),
  },
  {
    title: "Risk Management",
    desc: "Built-in stop losses, position sizing, and portfolio limits. Never risk more than you set.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
      </svg>
    ),
  },
  {
    title: "Live Analytics",
    desc: "Real-time P&L tracking, trade history, and performance metrics on every position.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
      </svg>
    ),
  },
  {
    title: "Multi-DEX",
    desc: "Trades across Raydium, Orca, Jupiter, and more. Finds the best liquidity automatically.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
      </svg>
    ),
  },
  {
    title: "Non-Custodial",
    desc: "Your keys, your funds. We never hold your assets. Trades execute from your own wallet.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
      </svg>
    ),
  },
];

function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.4], [0, -50]);
  const scale = useTransform(scrollYProgress, [0, 0.4], [1, 0.98]);

  return (
    <section ref={ref} className="relative bg-radial-hero bg-grid">
      <div className="min-h-screen flex items-center justify-center">
        <motion.div style={{ opacity, y, scale }} className="mx-auto max-w-4xl px-6 pt-14 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-light/50 px-4 py-2 text-[13px] text-muted backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green" />
              </span>
              Autonomous trading — live on Solana
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="mt-8 text-[clamp(2.8rem,7vw,5rem)] font-semibold leading-[1.08] tracking-[-0.035em]"
          >
            Your trades.
            <br />
            <span className="text-gradient">Fully automated.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mx-auto mt-6 max-w-lg text-[17px] leading-relaxed text-muted"
          >
            trenchd is an autonomous Solana trading bot that executes your
            strategy 24/7. Choose a style, set your risk, and let it run.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.65 }}
            className="mt-10 flex items-center justify-center gap-3"
          >
            <StartButton />
            <a
              href="#strategies"
              className="inline-flex h-12 items-center rounded-xl border border-border bg-surface-light/50 px-6 text-[14px] font-medium text-muted backdrop-blur-sm transition-all hover:border-border-light hover:text-foreground"
            >
              View Strategies
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.85 }}
            className="mx-auto mt-16 grid max-w-lg grid-cols-3 gap-px overflow-hidden rounded-2xl border border-border bg-border"
          >
            {[
              { value: "$2.4M+", label: "Volume traded" },
              { value: "14ms", label: "Avg execution" },
              { value: "24/7", label: "Uptime" },
            ].map((stat) => (
              <div key={stat.label} className="bg-surface-light/80 px-6 py-5 backdrop-blur-sm">
                <p className="text-xl font-semibold text-foreground">{stat.value}</p>
                <p className="mt-0.5 text-[12px] text-muted">{stat.label}</p>
              </div>
            ))}
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="mt-20"
          >
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="mx-auto h-9 w-5 rounded-full border border-white/[0.08] p-1"
            >
              <div className="h-1.5 w-full rounded-full bg-white/15" />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
      <LiveTicker />
    </section>
  );
}

function StartButton() {
  const { data: session } = useSession();
  if (session) {
    return (
      <Link
        href="/dashboard"
        className="glow inline-flex h-12 items-center rounded-xl bg-accent px-8 text-[15px] font-semibold text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
      >
        Open Dashboard
      </Link>
    );
  }
  return (
    <button
      onClick={() => signIn("twitter")}
      className="glow inline-flex h-12 items-center gap-2 rounded-xl bg-accent px-8 text-[15px] font-semibold text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
    >
      Get Started
    </button>
  );
}

function FeaturesSection() {
  return (
    <section id="features" className="border-t border-border py-28">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="text-[13px] font-medium uppercase tracking-widest text-accent">
            Features
          </span>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">
            Built for serious traders
          </h2>
          <p className="mt-3 text-muted">
            Everything you need to trade Solana autonomously.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="group rounded-2xl border border-border bg-surface-light/30 p-6 transition-all duration-300 hover:border-border-light hover:bg-surface-light/60"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors group-hover:bg-accent/15">
                {feature.icon}
              </div>
              <h3 className="mt-4 text-[15px] font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed text-muted">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StrategiesSection() {
  return (
    <section id="strategies" className="border-t border-border bg-grid py-28">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="text-[13px] font-medium uppercase tracking-widest text-accent">
            Strategies
          </span>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">
            Trade your way
          </h2>
          <p className="mt-3 text-muted">
            Choose a strategy that fits your style. Switch anytime.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-4 sm:grid-cols-2">
          {strategies.map((strat, i) => (
            <motion.div
              key={strat.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="group relative overflow-hidden rounded-2xl border border-border bg-surface-light/30 p-6 transition-all duration-300 hover:border-border-light hover:bg-surface-light/60"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {strat.name}
                  </h3>
                  <p className="mt-1 max-w-xs text-[13px] leading-relaxed text-muted">
                    {strat.desc}
                  </p>
                </div>
                <span className="text-2xl font-semibold text-green">
                  {strat.avg}
                </span>
              </div>

              <div className="mt-4 h-14">
                <MiniChart seed={i + 1} color="var(--accent)" />
              </div>

              <div className="mt-4 flex items-center gap-4 border-t border-border pt-4 text-[12px]">
                <span className="text-muted">
                  Risk: <span className={`font-medium ${strat.riskColor}`}>{strat.risk}</span>
                </span>
                <span className="text-muted">
                  Trades: <span className="font-medium text-foreground">{strat.trades}</span>
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaSection() {
  return (
    <section className="border-t border-border py-28">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="glow relative overflow-hidden rounded-3xl border border-accent/15 bg-accent/[0.03] p-14 text-center sm:p-20"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.08)_0%,transparent_60%)]" />
          <h2 className="relative text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">
            Start trading autonomously
          </h2>
          <p className="relative mt-4 text-muted">
            Sign in, pick a strategy, and let trenchd handle the rest.
          </p>
          <div className="relative mt-8">
            <CtaButton />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function CtaButton() {
  const { data: session } = useSession();
  if (session) {
    return (
      <Link
        href="/dashboard"
        className="inline-flex h-12 items-center rounded-xl bg-accent px-8 text-[15px] font-semibold text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
      >
        Open Dashboard
      </Link>
    );
  }
  return (
    <button
      onClick={() => signIn("twitter")}
      className="inline-flex h-12 items-center gap-2 rounded-xl bg-accent px-8 text-[15px] font-semibold text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
      Sign in with X
    </button>
  );
}

export default function Home() {
  return (
    <main>
      <HeroSection />
      <FeaturesSection />
      <StrategiesSection />
      <CtaSection />
      <footer className="border-t border-border py-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 text-[12px] text-muted/50">
          <span>&copy; {new Date().getFullYear()} trenchd</span>
          <div className="flex gap-4">
            <a href="#" className="transition-colors hover:text-muted">Terms</a>
            <a href="#" className="transition-colors hover:text-muted">Privacy</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
