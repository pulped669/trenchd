"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6 },
  }),
};

const steps = [
  {
    num: "01",
    title: "Create",
    desc: "Pick a name, ticker, and description. Your token deploys instantly on a bonding curve.",
  },
  {
    num: "02",
    title: "Trade",
    desc: "Anyone can buy along the curve. Price rises with demand — no LPs needed.",
  },
  {
    num: "03",
    title: "Graduate",
    desc: "At ~69 SOL market cap, liquidity auto-deposits to Raydium. Token trades freely.",
  },
];

const stats = [
  { value: "< 1min", label: "To launch" },
  { value: "0%", label: "Team allocation" },
  { value: "100%", label: "Fair launch" },
];

export default function Home() {
  return (
    <main className="overflow-hidden">
      {/* Hero */}
      <section className="bg-gradient-hero bg-grid relative">
        <div className="mx-auto max-w-6xl px-6 pb-28 pt-28 sm:pt-36">
          <motion.div
            initial="hidden"
            animate="visible"
            className="mx-auto max-w-3xl text-center"
          >
            <motion.div custom={0} variants={fadeUp}>
              <span className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5 text-sm font-medium text-accent">
                <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                Live on Solana
              </span>
            </motion.div>

            <motion.h1
              custom={1}
              variants={fadeUp}
              className="mt-8 text-5xl font-bold leading-[1.1] tracking-tight sm:text-7xl"
            >
              Launch tokens
              <br />
              <span className="text-gradient">in the trenches</span>
            </motion.h1>

            <motion.p
              custom={2}
              variants={fadeUp}
              className="mx-auto mt-6 max-w-lg text-lg leading-relaxed text-muted"
            >
              Fair-launch tokens on Solana with automatic bonding curves.
              No presale. No team allocation. Just deploy and go.
            </motion.p>

            <motion.div custom={3} variants={fadeUp} className="mt-10 flex items-center justify-center gap-4">
              <Link
                href="/create"
                className="glow-accent-sm inline-flex h-12 items-center rounded-xl bg-accent px-8 text-base font-semibold text-background transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Launch a Token
              </Link>
              <a
                href="#how"
                className="inline-flex h-12 items-center rounded-xl border border-border px-6 text-sm font-medium text-muted transition-colors hover:border-accent/30 hover:text-foreground"
              >
                How it works
              </a>
            </motion.div>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mx-auto mt-20 flex max-w-md items-center justify-between rounded-2xl border border-border bg-surface-light/50 px-8 py-5 backdrop-blur-sm"
          >
            {stats.map((s, i) => (
              <div key={i} className="text-center">
                <p className="text-2xl font-bold text-accent">{s.value}</p>
                <p className="mt-1 text-xs text-muted">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              How it works
            </h2>
            <p className="mt-3 text-muted">Three steps. Under a minute.</p>
          </motion.div>

          <div className="mt-16 grid gap-6 sm:grid-cols-3">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="group relative rounded-2xl border border-border bg-surface-light/30 p-8 transition-all hover:border-accent/20 hover:bg-surface-light/60"
              >
                <span className="text-4xl font-bold text-accent/20 transition-colors group-hover:text-accent/40">
                  {step.num}
                </span>
                <h3 className="mt-4 text-xl font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-grid">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glow-accent relative mx-auto max-w-2xl overflow-hidden rounded-3xl border border-accent/20 bg-accent/5 p-12 text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to launch?
            </h2>
            <p className="mt-3 text-muted">
              Connect your wallet and deploy a token in under a minute.
            </p>
            <Link
              href="/create"
              className="mt-8 inline-flex h-12 items-center rounded-xl bg-accent px-8 text-base font-semibold text-background transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Start a Launch
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 text-center text-sm text-muted">
        <p>&copy; {new Date().getFullYear()} trenchd. All rights reserved.</p>
      </footer>
    </main>
  );
}
