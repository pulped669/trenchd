"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { signIn, useSession } from "next-auth/react";
import LiveTicker from "@/components/LiveTicker";
import MiniChart from "@/components/MiniChart";

const strategies = [
  {
    name: "MOMENTUM",
    desc: "Rides trending tokens with volume spikes. Fast entries, tight stops.",
    risk: "HIGH",
    riskColor: "text-pink",
    avg: "+34.2%",
    trades: "~120/day",
    color: "#ff2a6d",
  },
  {
    name: "MEAN REVERT",
    desc: "Buys dips on strong tokens. Patient, calculated entries.",
    risk: "MEDIUM",
    riskColor: "text-yellow",
    avg: "+18.7%",
    trades: "~40/day",
    color: "#f5e642",
  },
  {
    name: "SNIPER",
    desc: "Catches new listings early. Extremely fast execution.",
    risk: "EXTREME",
    riskColor: "text-pink",
    avg: "+52.8%",
    trades: "~15/day",
    color: "#9b5de5",
  },
  {
    name: "DCA GRID",
    desc: "Steady accumulation with grid orders. Low maintenance, consistent.",
    risk: "LOW",
    riskColor: "text-green",
    avg: "+11.3%",
    trades: "~200/day",
    color: "#05d9e8",
  },
];

const features = [
  { title: "AUTONOMOUS", desc: "Set your strategy and walk away. Trades 24/7 without intervention.", icon: "⟐" },
  { title: "14ms EXECUTION", desc: "Direct RPC connections. Faster than any human trader.", icon: "⚡" },
  { title: "RISK ENGINE", desc: "Built-in stop losses, position sizing, and portfolio limits.", icon: "◈" },
  { title: "LIVE P&L", desc: "Real-time tracking, trade history, and performance analytics.", icon: "◧" },
  { title: "MULTI-DEX", desc: "Routes through Jupiter, Raydium, Orca. Best price, always.", icon: "⟁" },
  { title: "NON-CUSTODIAL", desc: "Your keys. Your funds. We never touch your wallet.", icon: "⬡" },
];

function RetroSun() {
  return (
    <div className="absolute left-1/2 top-[15%] -translate-x-1/2">
      <div className="relative h-[280px] w-[280px] sm:h-[350px] sm:w-[350px]">
        {/* Sun glow */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-pink/20 via-orange/10 to-transparent blur-[60px]" />
        {/* Sun body */}
        <div className="absolute inset-[15%] overflow-hidden rounded-full sunset-gradient opacity-60">
          {/* Horizontal lines through sun */}
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute left-0 right-0 bg-background"
              style={{
                height: `${3 + i * 0.5}px`,
                top: `${45 + i * 7}%`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.35], [0, -60]);

  return (
    <section ref={ref} className="relative min-h-screen overflow-hidden">
      <RetroSun />
      <div className="grid-floor" />

      <div className="relative flex min-h-screen items-center justify-center">
        <motion.div style={{ opacity, y }} className="mx-auto max-w-4xl px-6 pt-14 text-center">
          {/* Japanese decorative text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="font-[family-name:var(--font-pixel)] text-[10px] tracking-[0.5em] text-pink"
          >
            自動取引システム
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h1
              className="glitch mt-6 font-[family-name:var(--font-pixel)] text-[clamp(1.8rem,5vw,3.5rem)] leading-[1.3] text-foreground"
              data-text="TRENCHD"
            >
              TRENCHD
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-4 text-[clamp(1rem,2.5vw,1.4rem)] font-light tracking-wide text-cyan/80"
          >
            Fully autonomous Solana trading
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.65 }}
            className="mx-auto mt-4 max-w-md text-[14px] leading-relaxed text-muted"
          >
            Choose your strategy. Set your risk. Walk away.
            The bot handles everything else.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="mt-10 flex items-center justify-center gap-4"
          >
            <StartButton />
            <a
              href="#strategies"
              className="inline-flex h-11 items-center rounded border border-cyan/20 bg-cyan/5 px-6 text-[12px] font-bold uppercase tracking-widest text-cyan transition-all hover:bg-cyan/10 hover:glow-cyan"
            >
              Strategies
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1 }}
            className="mx-auto mt-20 flex max-w-md justify-between"
          >
            {[
              { value: "$2.4M+", label: "VOLUME" },
              { value: "14ms", label: "SPEED" },
              { value: "24/7", label: "UPTIME" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-mono text-2xl font-bold text-pink">{stat.value}</p>
                <p className="mt-1 font-[family-name:var(--font-pixel)] text-[8px] tracking-widest text-muted">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>

          {/* Scroll */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="mt-16"
          >
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="mx-auto w-fit"
            >
              <span className="font-[family-name:var(--font-pixel)] text-[8px] tracking-widest text-cyan/40">
                SCROLL
              </span>
              <div className="mx-auto mt-2 h-6 w-px bg-gradient-to-b from-cyan/30 to-transparent" />
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
  return (
    <button
      onClick={() => (session ? null : signIn("twitter"))}
      className="glow-pink inline-flex h-11 items-center rounded border border-pink/30 bg-pink/10 px-8 text-[12px] font-bold uppercase tracking-widest text-pink transition-all hover:bg-pink/20"
    >
      {session ? "Dashboard" : "Get Started"}
    </button>
  );
}

function FeaturesSection() {
  return (
    <section id="features" className="relative border-t border-cyan/10 py-28">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="font-[family-name:var(--font-pixel)] text-[9px] tracking-[0.4em] text-pink">
            FEATURES
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Built for the <span className="neon-cyan text-cyan">trenches</span>
          </h2>
        </motion.div>

        <div className="mt-16 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ delay: i * 0.07, duration: 0.5 }}
              className="group rounded-lg border border-cyan/[0.07] bg-surface-light/40 p-6 transition-all duration-300 hover:border-cyan/20 hover:bg-surface-light/70"
            >
              <span className="text-2xl text-cyan/40 transition-all group-hover:text-cyan/70 group-hover:neon-cyan">
                {f.icon}
              </span>
              <h3 className="mt-3 font-[family-name:var(--font-pixel)] text-[10px] tracking-wider text-foreground">
                {f.title}
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed text-muted">
                {f.desc}
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
    <section id="strategies" className="relative border-t border-cyan/10 py-28">
      {/* Background texture */}
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div className="absolute left-[10%] top-[20%] h-px w-[200px] bg-gradient-to-r from-transparent via-pink/20 to-transparent" />
        <div className="absolute right-[15%] top-[40%] h-px w-[150px] bg-gradient-to-r from-transparent via-cyan/20 to-transparent" />
        <div className="absolute left-[20%] bottom-[30%] h-px w-[180px] bg-gradient-to-r from-transparent via-purple/20 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="font-[family-name:var(--font-pixel)] text-[9px] tracking-[0.4em] text-pink">
            STRATEGIES
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Trade <span className="neon-pink text-pink">your way</span>
          </h2>
          <p className="mt-3 text-muted">Pick a style. Switch anytime.</p>
        </motion.div>

        <div className="mt-16 grid gap-4 sm:grid-cols-2">
          {strategies.map((strat, i) => (
            <motion.div
              key={strat.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="group relative overflow-hidden rounded-lg border border-cyan/[0.07] bg-surface-light/40 p-6 transition-all duration-300 hover:border-cyan/15 hover:bg-surface-light/60"
            >
              {/* Corner decoration */}
              <div className="absolute right-3 top-3 font-[family-name:var(--font-pixel)] text-[8px] text-muted/20">
                {String(i + 1).padStart(2, "0")}
              </div>

              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-[family-name:var(--font-pixel)] text-[11px] tracking-wider text-foreground">
                    {strat.name}
                  </h3>
                  <p className="mt-2 max-w-xs text-[13px] leading-relaxed text-muted">
                    {strat.desc}
                  </p>
                </div>
                <span className="font-mono text-2xl font-bold text-green">
                  {strat.avg}
                </span>
              </div>

              <div className="mt-4 h-14 opacity-60 transition-opacity group-hover:opacity-100">
                <MiniChart seed={i + 1} color={strat.color} />
              </div>

              <div className="mt-4 flex items-center gap-6 border-t border-cyan/[0.06] pt-4 font-mono text-[11px]">
                <span className="text-muted">
                  RISK <span className={`font-bold ${strat.riskColor}`}>{strat.risk}</span>
                </span>
                <span className="text-muted">
                  FREQ <span className="font-medium text-foreground/60">{strat.trades}</span>
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
    <section className="relative border-t border-cyan/10 py-28">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="glow-pink relative overflow-hidden rounded-xl border border-pink/15 bg-pink/[0.03] p-14 text-center sm:p-20"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,42,109,0.06)_0%,transparent_60%)]" />

          {/* Corner brackets */}
          <div className="pointer-events-none absolute left-4 top-4 h-6 w-6 border-l border-t border-pink/20" />
          <div className="pointer-events-none absolute right-4 top-4 h-6 w-6 border-r border-t border-pink/20" />
          <div className="pointer-events-none absolute bottom-4 left-4 h-6 w-6 border-b border-l border-pink/20" />
          <div className="pointer-events-none absolute bottom-4 right-4 h-6 w-6 border-b border-r border-pink/20" />

          <p className="relative font-[family-name:var(--font-pixel)] text-[8px] tracking-[0.5em] text-pink/50">
            INITIALIZE
          </p>
          <h2 className="relative mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Enter the trenches
          </h2>
          <p className="relative mt-3 text-muted">
            Sign in. Pick a strategy. Let it run.
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
  return (
    <button
      onClick={() => (session ? null : signIn("twitter"))}
      className="glow-pink inline-flex h-11 items-center gap-2 rounded border border-pink/30 bg-pink/10 px-8 text-[12px] font-bold uppercase tracking-widest text-pink transition-all hover:bg-pink/20"
    >
      {session ? (
        "Open Dashboard"
      ) : (
        <>
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          Connect with X
        </>
      )}
    </button>
  );
}

export default function Home() {
  return (
    <main className="scanlines">
      <HeroSection />
      <FeaturesSection />
      <StrategiesSection />
      <CtaSection />
      <footer className="border-t border-cyan/10 py-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6">
          <span className="font-[family-name:var(--font-pixel)] text-[8px] tracking-wider text-muted/30">
            &copy; {new Date().getFullYear()} TRENCHD
          </span>
          <div className="flex gap-4 text-[11px] text-muted/30">
            <a href="#" className="transition-colors hover:text-pink/50">Terms</a>
            <a href="#" className="transition-colors hover:text-pink/50">Privacy</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
