"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const steps = [
  {
    num: "01",
    title: "Create",
    desc: "Pick a name and ticker. Your token deploys instantly on a fair bonding curve.",
    icon: "✦",
  },
  {
    num: "02",
    title: "Trade",
    desc: "Anyone buys along the curve. Price rises organically with demand.",
    icon: "◈",
  },
  {
    num: "03",
    title: "Graduate",
    desc: "At ~69 SOL, liquidity auto-migrates to Raydium. Fully tradeable.",
    icon: "◆",
  },
];

function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -60]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.97]);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center">
      <motion.div style={{ opacity, y, scale }} className="mx-auto max-w-3xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-[13px] text-muted backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            Live on Solana
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-8 text-[clamp(3rem,8vw,5.5rem)] font-semibold leading-[1.05] tracking-[-0.03em]"
        >
          Launch tokens
          <br />
          <span className="text-gradient">in the trenches</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mx-auto mt-6 max-w-md text-lg leading-relaxed text-muted"
        >
          Fair-launch tokens on Solana. No presale.
          No team allocation. Just deploy.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-10 flex items-center justify-center gap-4"
        >
          <Link
            href="/create"
            className="glow group relative inline-flex h-12 items-center overflow-hidden rounded-full bg-accent px-8 text-[15px] font-semibold text-background transition-all hover:scale-[1.03] active:scale-[0.97]"
          >
            <span className="relative z-10">Launch a Token</span>
          </Link>
          <a
            href="#how"
            className="inline-flex h-12 items-center rounded-full border border-white/[0.08] bg-white/[0.03] px-6 text-[14px] font-medium text-muted backdrop-blur-sm transition-all hover:border-white/[0.15] hover:text-foreground"
          >
            Learn more
          </a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="mt-24"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="mx-auto h-10 w-6 rounded-full border border-white/[0.1] p-1"
          >
            <div className="h-2 w-full rounded-full bg-white/20" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

function StepsSection() {
  return (
    <section id="how" className="relative py-32">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-4xl font-semibold tracking-[-0.02em] sm:text-5xl">
            How it works
          </h2>
          <p className="mt-4 text-lg text-muted">
            Three steps. Under a minute.
          </p>
        </motion.div>

        <div className="mt-20 grid gap-5 sm:grid-cols-3">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className="group relative overflow-hidden rounded-3xl border border-white/[0.06] bg-white/[0.02] p-8 transition-all duration-500 hover:border-white/[0.1] hover:bg-white/[0.04]"
            >
              <div className="absolute -right-6 -top-6 text-[120px] font-bold leading-none text-white/[0.02] transition-all duration-500 group-hover:text-accent/[0.05]">
                {step.icon}
              </div>
              <span className="text-sm font-medium text-accent/60">
                {step.num}
              </span>
              <h3 className="mt-4 text-2xl font-semibold tracking-tight">
                {step.title}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-muted">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaSection() {
  return (
    <section className="relative py-32">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="glow relative overflow-hidden rounded-[2rem] border border-accent/10 bg-accent/[0.03] p-16 text-center"
        >
          {/* Inner glow */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,255,136,0.06)_0%,transparent_70%)]" />

          <h2 className="relative text-4xl font-semibold tracking-[-0.02em] sm:text-5xl">
            Ready to launch?
          </h2>
          <p className="relative mt-4 text-lg text-muted">
            Connect your wallet. Deploy in seconds.
          </p>
          <Link
            href="/create"
            className="relative mt-8 inline-flex h-12 items-center rounded-full bg-accent px-8 text-[15px] font-semibold text-background transition-all hover:scale-[1.03] active:scale-[0.97]"
          >
            Start a Launch
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main>
      <HeroSection />
      <StepsSection />
      <CtaSection />
      <footer className="border-t border-white/[0.06] py-8 text-center text-[13px] text-muted/60">
        &copy; {new Date().getFullYear()} trenchd
      </footer>
    </main>
  );
}
