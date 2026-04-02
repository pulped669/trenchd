"use client";

import { useRef, useEffect, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
} from "framer-motion";
import { signIn, useSession } from "next-auth/react";

const GRADIENT = "linear-gradient(135deg, #f472b6 0%, #6366f1 40%, #38bdf8 100%)";
const GRADIENT_SUBTLE = "linear-gradient(135deg, rgba(244,114,182,0.12) 0%, rgba(99,102,241,0.08) 40%, rgba(56,189,248,0.06) 100%)";

// ─── Cursor glow (refined) ───
function CursorGlow() {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const sx = useSpring(x, { stiffness: 100, damping: 30 });
  const sy = useSpring(y, { stiffness: 100, damping: 30 });

  useEffect(() => {
    const move = (e: MouseEvent) => { x.set(e.clientX); y.set(e.clientY); };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);

  return (
    <motion.div
      className="pointer-events-none fixed z-30 h-[400px] w-[400px] rounded-full"
      style={{
        x: sx, y: sy,
        translateX: "-50%", translateY: "-50%",
        background: "radial-gradient(circle, rgba(99,102,241,0.04) 0%, rgba(56,189,248,0.02) 40%, transparent 65%)",
      }}
    />
  );
}

// ─── Nav ───
function Nav() {
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-8 transition-all duration-700"
      style={{ height: scrolled ? 56 : 72 }}
    >
      <div
        className="absolute inset-0 border-b transition-all duration-700"
        style={{
          backgroundColor: scrolled ? "rgba(8,14,28,0.75)" : "transparent",
          backdropFilter: scrolled ? "blur(40px) saturate(180%)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(40px) saturate(180%)" : "none",
          borderColor: scrolled ? "rgba(148,163,184,0.05)" : "transparent",
        }}
      />
      <span className="relative z-10 text-[13px] font-bold tracking-[0.2em] text-slate-400">
        TRENCH'D
      </span>
      <button
        onClick={() => (session ? null : signIn("twitter"))}
        className="relative z-10 rounded-full border border-slate-700/40 bg-slate-800/30 px-5 py-2 text-[12px] font-medium text-slate-300 backdrop-blur-sm transition-all duration-300 hover:border-slate-600/50 hover:bg-slate-700/40 hover:text-slate-100"
      >
        {session ? session.user?.name : "Sign in"}
      </button>
    </motion.nav>
  );
}

// ─── Hero ───
function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.4], [1, 0.88]);
  const y = useTransform(scrollYProgress, [0, 0.4], [0, -120]);
  const blur = useTransform(scrollYProgress, [0.15, 0.4], [0, 12]);

  return (
    <section ref={ref} className="relative flex h-screen items-center justify-center overflow-hidden">
      <motion.div
        style={{ opacity, scale, y, filter: useTransform(blur, (v) => `blur(${v}px)`) }}
        className="relative text-center px-6"
      >
        {/* Subtle badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-slate-700/30 bg-slate-800/20 px-4 py-2 backdrop-blur-sm"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </span>
          <span className="text-[11px] font-medium tracking-wide text-slate-400">Solana Mainnet</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5 }}
          className="text-[clamp(3.5rem,12vw,9rem)] font-black leading-[0.85] tracking-[-0.05em]"
        >
          <span
            style={{
              background: GRADIENT,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 0 40px rgba(99,102,241,0.15))",
            }}
          >
            trench'd
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-8 text-[clamp(1rem,2vw,1.3rem)] font-light tracking-wide text-slate-400"
        >
          AI-powered trading intelligence for Solana.
        </motion.p>

        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1.5, delay: 1.5 }}
          className="mx-auto mt-10 h-px w-20 origin-center"
          style={{ background: GRADIENT }}
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 1, delay: 2.2 }}
          className="mt-20"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            className="mx-auto h-16 w-px bg-gradient-to-b from-slate-500/15 to-transparent"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}

// ─── Correction cards ───
function WatchingSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 50, damping: 25 });
  const opacity = useTransform(smooth, [0.1, 0.3, 0.7, 0.88], [0, 1, 1, 0]);
  const y = useTransform(smooth, [0.1, 0.3, 0.7, 0.88], [80, 0, 0, -80]);

  const corrections = [
    { flaw: "EXIT NOW.", fix: "You've recovered your earlier loss. Coin is tapering off — take the win and rotate.", delay: 0 },
    { flaw: "Don't enter.", fix: "Your historical data shows a 78% loss rate entering above this level. Wait for structure.", delay: 0.3 },
    { flaw: "Revenge trade detected.", fix: "3 entries in 8 minutes following a loss. Pattern flagged — cooling period recommended.", delay: 0.6 },
  ];

  return (
    <section ref={ref} className="relative flex min-h-[90vh] items-center justify-center px-6">
      <motion.div style={{ opacity, y }} className="w-full max-w-2xl">
        <div className="mb-14 text-center">
          <p className="text-[clamp(1.8rem,3.5vw,2.6rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-slate-100">
            Real-time pattern detection.
            <br />
            <span className="text-slate-500">While you trade.</span>
          </p>
        </div>

        <div className="space-y-3">
          {corrections.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: c.delay, duration: 0.7 }}
              className="group relative overflow-hidden rounded-2xl border border-slate-700/25 backdrop-blur-xl transition-all duration-500 hover:border-slate-600/35"
              style={{
                background: "linear-gradient(135deg, rgba(15,23,42,0.6) 0%, rgba(15,23,42,0.4) 100%)",
                boxShadow: "0 4px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.03)",
              }}
            >
              {/* Top edge highlight */}
              <div className="absolute inset-x-0 top-0 h-px" style={{ background: "linear-gradient(90deg, transparent 0%, rgba(148,163,184,0.08) 50%, transparent 100%)" }} />

              <div className="relative flex items-start gap-4 p-6">
                {/* Animated dot with gradient */}
                <div className="relative mt-0.5">
                  <motion.div
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: GRADIENT, boxShadow: "0 0 12px rgba(99,102,241,0.4)" }}
                    animate={{ opacity: [0.5, 1, 0.5], scale: [0.9, 1.1, 0.9] }}
                    transition={{ duration: 3, delay: i * 0.4, repeat: Infinity }}
                  />
                </div>
                <div>
                  <p
                    className="text-[14px] font-bold tracking-[-0.01em]"
                    style={{ background: GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}
                  >
                    {c.flaw}
                  </p>
                  <p className="mt-2 text-[13px] leading-[1.7] text-slate-400/90">{c.fix}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

// ─── Statement ───
function Statement() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 50, damping: 25 });
  const opacity = useTransform(smooth, [0.2, 0.4, 0.6, 0.8], [0, 1, 1, 0]);
  const y = useTransform(smooth, [0.2, 0.4, 0.6, 0.8], [50, 0, 0, -50]);

  return (
    <section ref={ref} className="relative flex min-h-[55vh] items-center justify-center px-6">
      <motion.div style={{ opacity, y }} className="max-w-3xl text-center">
        <p className="text-[clamp(1.8rem,4vw,3rem)] font-semibold leading-[1.2] tracking-[-0.03em] text-slate-100">
          Most traders lose to themselves.
          <br />
          <span
            style={{
              background: GRADIENT,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 0 20px rgba(99,102,241,0.15))",
            }}
          >
            trench'd fixes that.
          </span>
        </p>
      </motion.div>
    </section>
  );
}

// ─── CTA ───
function CtaSection() {
  const { data: session } = useSession();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 50, damping: 25 });
  const opacity = useTransform(smooth, [0.15, 0.55], [0, 1]);
  const scale = useTransform(smooth, [0.15, 0.55], [0.92, 1]);

  return (
    <section ref={ref} className="relative flex min-h-[55vh] items-center justify-center px-6 pb-24">
      <motion.div style={{ opacity, scale }} className="text-center">
        <h2 className="text-[clamp(2.5rem,6.5vw,4.5rem)] font-black tracking-[-0.04em]">
          <span
            style={{
              background: GRADIENT,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 0 30px rgba(99,102,241,0.2))",
            }}
          >
            Trade with clarity.
          </span>
        </h2>

        <motion.button
          onClick={() => (session ? null : signIn("twitter"))}
          className="group relative mt-12 inline-flex h-14 items-center gap-3 overflow-hidden rounded-full px-10 text-[15px] font-semibold text-white transition-transform hover:scale-[1.03] active:scale-[0.97]"
          style={{
            background: GRADIENT,
            boxShadow: "0 4px 25px rgba(99,102,241,0.25), 0 8px 50px rgba(56,189,248,0.08), inset 0 1px 0 rgba(255,255,255,0.1)",
          }}
          whileHover={{
            boxShadow: "0 4px 35px rgba(99,102,241,0.35), 0 8px 60px rgba(56,189,248,0.12), inset 0 1px 0 rgba(255,255,255,0.15)",
          }}
        >
          {/* Shimmer effect */}
          <div
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{ background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.08) 50%, transparent 60%)", backgroundSize: "200% 100%", animation: "shimmer 2s infinite" }}
          />
          {session ? (
            <span className="relative z-10">Open Dashboard</span>
          ) : (
            <span className="relative z-10 inline-flex items-center gap-3">
              <svg viewBox="0 0 24 24" className="h-[14px] w-[14px] fill-current">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              Join the Waitlist
            </span>
          )}
        </motion.button>
      </motion.div>
    </section>
  );
}

// ─── Main ───
export default function Home() {
  return (
    <>
      <CursorGlow />
      <Nav />
      <main className="relative z-10">
        <Hero />
        <WatchingSection />
        <Statement />
        <CtaSection />
        <footer className="border-t border-slate-800/30 py-8 text-center text-[11px] text-slate-600 tracking-widest">
          TRENCH'D
        </footer>
      </main>
    </>
  );
}
