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
      className="pointer-events-none fixed z-50 h-[600px] w-[600px] rounded-full"
      style={{
        x: sx, y: sy,
        translateX: "-50%", translateY: "-50%",
        background: "radial-gradient(circle, rgba(255,42,109,0.04) 0%, rgba(139,92,246,0.02) 35%, transparent 65%)",
      }}
    />
  );
}

// ─── Particles ───
function Particles() {
  const particles = useRef(
    [...Array(20)].map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 1.5,
      dur: 18 + Math.random() * 20,
      delay: Math.random() * 10,
    }))
  ).current;

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: p.size, height: p.size,
            left: `${p.x}%`, top: `${p.y}%`,
            background: i % 3 === 0 ? "rgba(255,42,109,0.2)" : i % 3 === 1 ? "rgba(5,217,232,0.15)" : "rgba(139,92,246,0.15)",
          }}
          animate={{ y: [0, -25, 8, -15, 0], opacity: [0, 0.5, 0.2, 0.6, 0] }}
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
          backgroundColor: scrolled ? "rgba(5,5,8,0.6)" : "transparent",
          backdropFilter: scrolled ? "blur(50px) saturate(200%)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(50px) saturate(200%)" : "none",
          borderColor: scrolled ? "rgba(255,255,255,0.03)" : "transparent",
        }}
      />
      <span className="relative z-10 text-[13px] font-bold tracking-[0.2em] text-fg/70">
        TRENCHD
      </span>
      <button
        onClick={() => (session ? null : signIn("twitter"))}
        className="relative z-10 rounded-full border border-fg/[0.06] bg-fg/[0.02] px-5 py-2 text-[12px] font-medium text-fg/50 transition-all duration-300 hover:border-fg/[0.12] hover:bg-fg/[0.05] hover:text-fg/80"
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
    <section ref={ref} className="relative flex h-[100vh] items-center justify-center overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute left-1/2 top-[45%] h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(255,42,109,0.04) 0%, transparent 70%)" }}
          animate={{ scale: [1, 1.08, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute left-[25%] top-[35%] h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(5,217,232,0.025) 0%, transparent 70%)" }}
          animate={{ scale: [1, 1.12, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <motion.div
        style={{ opacity, scale, y, filter: useTransform(blur, (v) => `blur(${v}px)`) }}
        className="relative text-center px-6"
      >
        {/* Eye icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="mx-auto mb-10 flex h-16 w-16 items-center justify-center rounded-full"
          style={{
            background: "linear-gradient(135deg, rgba(255,42,109,0.1) 0%, rgba(139,92,246,0.1) 100%)",
            boxShadow: "0 0 40px rgba(255,42,109,0.1), 0 0 80px rgba(139,92,246,0.05)",
          }}
        >
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7">
              <path d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" stroke="rgba(255,42,109,0.6)" strokeWidth="1.5" />
              <path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" stroke="rgba(255,42,109,0.6)" strokeWidth="1.5" />
            </svg>
          </motion.div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.3 }}
          className="text-[clamp(3.5rem,12vw,9rem)] font-black leading-[0.85] tracking-[-0.05em]"
        >
          <span
            className="block"
            style={{
              background: "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.4) 60%, rgba(255,42,109,0.2) 100%)",
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
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-8 text-[clamp(1.05rem,2vw,1.35rem)] font-light tracking-wide text-muted"
        >
          It&apos;s always watching. Always learning you.
        </motion.p>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, delay: 2 }}
          className="mx-auto mt-10 h-px w-16 origin-center bg-gradient-to-r from-transparent via-pink/30 to-transparent"
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.25 }}
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

// ─── Screen watching mockup ───
function WatchingSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 60, damping: 25 });
  const opacity = useTransform(smooth, [0.1, 0.3, 0.7, 0.88], [0, 1, 1, 0]);
  const y = useTransform(smooth, [0.1, 0.3, 0.7, 0.88], [80, 0, 0, -80]);

  const corrections = [
    { flaw: "EXIT NOW.", fix: "You've recovered your loss from earlier. Take the win and move on — coin is starting to taper off.", color: "#ff2a6d", delay: 0 },
    { flaw: "Don't enter.", fix: "You always get fucked when you enter this high. Wait for a pullback or skip it entirely.", color: "#8b5cf6", delay: 0.4 },
    { flaw: "You just revenge traded.", fix: "Last 3 entries were within 8 minutes of a loss. Step away. I'll keep watching.", color: "#05d9e8", delay: 0.8 },
  ];

  return (
    <section ref={ref} className="relative flex min-h-[95vh] items-center justify-center px-6">
      <motion.div style={{ opacity, y }} className="w-full max-w-3xl">
        <div className="mb-12 text-center">
          <p className="text-[clamp(1.8rem,3.5vw,2.6rem)] font-semibold leading-[1.15] tracking-[-0.02em]">
            It finds what you won&apos;t
            <br />
            <span className="text-muted">admit to yourself.</span>
          </p>
        </div>

        <div className="space-y-4">
          {corrections.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: c.delay, duration: 0.6 }}
              className="overflow-hidden rounded-2xl border border-fg/[0.04]"
              style={{
                background: "linear-gradient(135deg, rgba(12,12,18,0.9) 0%, rgba(8,8,14,0.95) 100%)",
                boxShadow: `0 0 40px ${c.color}06, 0 8px 30px rgba(0,0,0,0.3)`,
              }}
            >
              <div className="flex items-start gap-4 p-5">
                {/* Pulse dot */}
                <motion.div
                  className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: c.color, boxShadow: `0 0 10px ${c.color}60` }}
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
                />
                <div>
                  <p className="text-[13px] font-medium" style={{ color: c.color }}>{c.flaw}</p>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-fg/50">{c.fix}</p>
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
    <section ref={ref} className="relative flex min-h-[60vh] items-center justify-center px-6">
      <motion.div style={{ opacity, y }} className="max-w-3xl text-center">
        <p className="text-[clamp(1.8rem,4vw,3rem)] font-semibold leading-[1.2] tracking-[-0.03em]">
          Your worst habit is invisible to you.
          <br />
          <span
            style={{
              background: "linear-gradient(90deg, #ff2a6d, #8b5cf6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Not to trenchd.
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
  const smooth = useSpring(scrollYProgress, { stiffness: 60, damping: 25 });
  const opacity = useTransform(smooth, [0.15, 0.55], [0, 1]);
  const scale = useTransform(smooth, [0.15, 0.55], [0.93, 1]);

  return (
    <section ref={ref} className="relative flex min-h-[60vh] items-center justify-center px-6 pb-24">
      <motion.div style={{ opacity, scale }} className="text-center">
        <h2 className="text-[clamp(2.5rem,6.5vw,4.5rem)] font-black tracking-[-0.04em]">
          <span
            style={{
              background: "linear-gradient(135deg, #ff2a6d 0%, #8b5cf6 40%, #05d9e8 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 0 30px rgba(139,92,246,0.3))",
            }}
          >
            See yourself clearly.
          </span>
        </h2>

        <motion.button
          onClick={() => (session ? null : signIn("twitter"))}
          className="mt-12 inline-flex h-14 items-center gap-3 overflow-hidden rounded-full px-10 text-[15px] font-semibold text-white"
          style={{
            background: "linear-gradient(135deg, #ff2a6d 0%, #8b5cf6 50%, #05d9e8 100%)",
            backgroundSize: "200% 200%",
          }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          animate={{
            boxShadow: [
              "0 0 30px rgba(255,42,109,0.2), 0 0 60px rgba(139,92,246,0.1)",
              "0 0 40px rgba(139,92,246,0.25), 0 0 80px rgba(5,217,232,0.12)",
              "0 0 30px rgba(255,42,109,0.2), 0 0 60px rgba(139,92,246,0.1)",
            ],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
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

// ─── Background shift ───
function BackgroundShift() {
  const { scrollYProgress } = useScroll();
  const bg = useTransform(
    scrollYProgress,
    [0, 0.35, 0.65, 1],
    ["rgba(255,42,109,0)", "rgba(255,42,109,0.012)", "rgba(139,92,246,0.012)", "rgba(5,217,232,0.008)"]
  );
  return <motion.div className="pointer-events-none fixed inset-0 z-0" style={{ backgroundColor: bg }} />;
}

// ─── Main ───
export default function Home() {
  return (
    <>
      <CursorGlow />
      <Particles />
      <BackgroundShift />
      <Nav />
      <main className="relative z-10">
        <Hero />
        <WatchingSection />
        <Statement />
        <CtaSection />
        <footer className="border-t border-border py-8 text-center text-[11px] text-muted/20 tracking-widest">
          TRENCHD
        </footer>
      </main>
    </>
  );
}
