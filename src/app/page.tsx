"use client";

import { useRef, useEffect, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { signIn, useSession } from "next-auth/react";

// ─── Cursor glow ───
function CursorGlow() {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const sx = useSpring(x, { stiffness: 120, damping: 25 });
  const sy = useSpring(y, { stiffness: 120, damping: 25 });

  useEffect(() => {
    const move = (e: MouseEvent) => { x.set(e.clientX); y.set(e.clientY); };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);

  return (
    <motion.div
      className="pointer-events-none fixed z-50 h-[500px] w-[500px] rounded-full"
      style={{
        x: sx, y: sy,
        translateX: "-50%", translateY: "-50%",
        background: "radial-gradient(circle, rgba(255,42,109,0.035) 0%, transparent 60%)",
      }}
    />
  );
}

// ─── Particles (single color) ───
function Particles() {
  const particles = useRef(
    [...Array(15)].map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 1,
      dur: 20 + Math.random() * 20,
      delay: Math.random() * 10,
    }))
  ).current;

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-accent/15"
          style={{ width: p.size, height: p.size, left: `${p.x}%`, top: `${p.y}%` }}
          animate={{ y: [0, -20, 8, -12, 0], opacity: [0, 0.4, 0.15, 0.4, 0] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
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
          backgroundColor: scrolled ? "rgba(5,5,8,0.7)" : "transparent",
          backdropFilter: scrolled ? "blur(50px) saturate(180%)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(50px) saturate(180%)" : "none",
          borderColor: scrolled ? "rgba(255,255,255,0.03)" : "transparent",
        }}
      />
      <span className="relative z-10 text-[13px] font-bold tracking-[0.2em] text-fg/60">
        TRENCHD
      </span>
      <button
        onClick={() => (session ? null : signIn("twitter"))}
        className="relative z-10 rounded-full border border-fg/[0.06] bg-fg/[0.03] px-5 py-2 text-[12px] font-medium text-fg/50 transition-all duration-300 hover:border-accent/20 hover:text-fg/80"
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
  const scale = useTransform(scrollYProgress, [0, 0.4], [1, 0.9]);
  const y = useTransform(scrollYProgress, [0, 0.4], [0, -100]);
  const blur = useTransform(scrollYProgress, [0.2, 0.4], [0, 10]);

  return (
    <section ref={ref} className="relative flex h-screen items-center justify-center overflow-hidden">
      {/* Single color ambient glow */}
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute left-1/2 top-[45%] h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(255,42,109,0.04) 0%, transparent 65%)" }}
          animate={{ scale: [1, 1.06, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <motion.div
        style={{ opacity, scale, y, filter: useTransform(blur, (v) => `blur(${v}px)`) }}
        className="relative text-center px-6"
      >
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="text-[clamp(3.5rem,12vw,9rem)] font-black leading-[0.85] tracking-[-0.05em]"
        >
          <span
            style={{
              background: "linear-gradient(135deg, #ff2a6d 0%, #8b5cf6 50%, #05d9e8 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            trenchd
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-8 text-[clamp(1rem,2vw,1.3rem)] font-light tracking-wide text-muted"
        >
          It&apos;s always watching. Always learning you.
        </motion.p>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, delay: 1.8 }}
          className="mx-auto mt-10 h-px w-16 origin-center bg-accent/20"
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ duration: 1, delay: 2.5 }}
          className="mt-20"
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="mx-auto h-16 w-px bg-gradient-to-b from-fg/15 to-transparent"
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
  const smooth = useSpring(scrollYProgress, { stiffness: 60, damping: 25 });
  const opacity = useTransform(smooth, [0.1, 0.3, 0.7, 0.88], [0, 1, 1, 0]);
  const y = useTransform(smooth, [0.1, 0.3, 0.7, 0.88], [80, 0, 0, -80]);

  const corrections = [
    { flaw: "EXIT NOW.", fix: "You've recovered your loss from earlier. Take the win and move on — coin is starting to taper off.", delay: 0 },
    { flaw: "Don't enter.", fix: "You always get fucked when you enter this high. Wait for a pullback or skip it entirely.", delay: 0.35 },
    { flaw: "You just revenge traded.", fix: "Last 3 entries were within 8 minutes of a loss. Step away. I'll keep watching.", delay: 0.7 },
  ];

  return (
    <section ref={ref} className="relative flex min-h-[90vh] items-center justify-center px-6">
      <motion.div style={{ opacity, y }} className="w-full max-w-2xl">
        <div className="mb-14 text-center">
          <p className="text-[clamp(1.8rem,3.5vw,2.6rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-fg">
            It finds what you won&apos;t
            <br />
            <span className="text-muted">admit to yourself.</span>
          </p>
        </div>

        <div className="space-y-3">
          {corrections.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: c.delay, duration: 0.6 }}
              className="rounded-2xl border border-border bg-surface/80 backdrop-blur-sm"
            >
              <div className="flex items-start gap-4 p-5">
                <motion.div
                  className="mt-1 h-2 w-2 shrink-0 rounded-full bg-accent"
                  style={{ boxShadow: "0 0 8px rgba(255,42,109,0.5)" }}
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
                />
                <div>
                  <p className="text-[13px] font-semibold text-accent">{c.flaw}</p>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-fg/45">{c.fix}</p>
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
  const smooth = useSpring(scrollYProgress, { stiffness: 60, damping: 25 });
  const opacity = useTransform(smooth, [0.2, 0.4, 0.6, 0.8], [0, 1, 1, 0]);
  const y = useTransform(smooth, [0.2, 0.4, 0.6, 0.8], [60, 0, 0, -60]);

  return (
    <section ref={ref} className="relative flex min-h-[55vh] items-center justify-center px-6">
      <motion.div style={{ opacity, y }} className="max-w-3xl text-center">
        <p className="text-[clamp(1.8rem,4vw,3rem)] font-semibold leading-[1.2] tracking-[-0.03em] text-fg">
          Your worst habit is invisible to you.
          <br />
          <span className="text-accent">Not to trenchd.</span>
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
  const smooth = useSpring(scrollYProgress, { stiffness: 60, damping: 25 });
  const opacity = useTransform(smooth, [0.15, 0.55], [0, 1]);
  const scale = useTransform(smooth, [0.15, 0.55], [0.93, 1]);

  return (
    <section ref={ref} className="relative flex min-h-[55vh] items-center justify-center px-6 pb-24">
      <motion.div style={{ opacity, scale }} className="text-center">
        <h2 className="text-[clamp(2.5rem,6.5vw,4.5rem)] font-black tracking-[-0.04em] text-fg">
          See yourself clearly.
        </h2>

        <motion.button
          onClick={() => (session ? null : signIn("twitter"))}
          className="mt-12 inline-flex h-14 items-center gap-3 rounded-full bg-accent px-10 text-[15px] font-semibold text-white transition-transform hover:scale-[1.03] active:scale-[0.97]"
          style={{ boxShadow: "0 0 30px rgba(255,42,109,0.2), 0 0 60px rgba(255,42,109,0.08)" }}
        >
          {session ? (
            "Open Dashboard"
          ) : (
            <>
              <svg viewBox="0 0 24 24" className="h-[14px] w-[14px] fill-current">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              Get Early Access
            </>
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
      <Particles />
      <Nav />
      <main className="relative z-10">
        <Hero />
        <WatchingSection />
        <Statement />
        <CtaSection />
        <footer className="border-t border-border py-8 text-center text-[11px] text-muted/40 tracking-widest">
          TRENCHD
        </footer>
      </main>
    </>
  );
}
