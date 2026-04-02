"use client";

import { useRef, useEffect, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  AnimatePresence,
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
        background: "radial-gradient(circle, rgba(255,42,109,0.045) 0%, rgba(139,92,246,0.025) 35%, transparent 65%)",
      }}
    />
  );
}

// ─── Ambient particles ───
function Particles() {
  const particles = useRef(
    [...Array(25)].map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 2,
      dur: 15 + Math.random() * 25,
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
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            background: i % 3 === 0 ? "rgba(255,42,109,0.25)" : i % 3 === 1 ? "rgba(5,217,232,0.2)" : "rgba(139,92,246,0.2)",
          }}
          animate={{
            y: [0, -30, 10, -20, 0],
            opacity: [0, 0.6, 0.3, 0.7, 0],
          }}
          transition={{
            duration: p.dur,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
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

  // Staggered word reveal
  const words = ["It", "doesn't", "sleep."];

  return (
    <section ref={ref} className="relative flex h-[100vh] items-center justify-center overflow-hidden">
      {/* Deep ambient glows */}
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
        <motion.div
          className="absolute left-[70%] top-[55%] h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(139,92,246,0.03) 0%, transparent 70%)" }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
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
          className="text-[clamp(4rem,14vw,11rem)] font-black leading-[0.85] tracking-[-0.05em]"
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

        <div className="mt-8 flex items-center justify-center gap-[0.35em]">
          {words.map((word, i) => (
            <motion.span
              key={word}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 + i * 0.2 }}
              className="text-[clamp(1.1rem,2.2vw,1.5rem)] font-light tracking-wide text-muted"
            >
              {word}
            </motion.span>
          ))}
        </div>

        {/* Animated line underneath */}
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

// ─── Core statement ───
function CoreStatement() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 60, damping: 25 });

  const opacity = useTransform(smooth, [0.2, 0.4, 0.6, 0.8], [0, 1, 1, 0]);
  const y = useTransform(smooth, [0.2, 0.4, 0.6, 0.8], [80, 0, 0, -80]);
  const lineWidth = useTransform(smooth, [0.25, 0.45], ["0%", "40%"]);

  return (
    <section ref={ref} className="relative flex min-h-[80vh] items-center justify-center px-6">
      <motion.div style={{ opacity, y }} className="max-w-3xl text-center">
        <p className="text-[clamp(2.2rem,5vw,3.8rem)] font-semibold leading-[1.15] tracking-[-0.03em]">
          The market doesn&apos;t wait.
          <br />
          <span
            style={{
              background: "linear-gradient(90deg, #ff2a6d, #8b5cf6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Neither does trenchd.
          </span>
        </p>
        <motion.div
          style={{ width: lineWidth }}
          className="mx-auto mt-8 h-px bg-gradient-to-r from-transparent via-fg/10 to-transparent"
        />
      </motion.div>
    </section>
  );
}

// ─── Discipline visualization ───
function DisciplineSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 60, damping: 25 });
  const opacity = useTransform(smooth, [0.15, 0.35, 0.65, 0.82], [0, 1, 1, 0]);
  const y = useTransform(smooth, [0.15, 0.35, 0.65, 0.82], [60, 0, 0, -60]);

  // Pulsing core
  const coreScale = useTransform(smooth, [0.3, 0.5], [0.6, 1]);
  const coreOpacity = useTransform(smooth, [0.25, 0.45], [0, 1]);
  const ringCount = 5;

  return (
    <section ref={ref} className="relative flex min-h-[90vh] items-center justify-center px-6">
      <motion.div style={{ opacity, y }} className="flex flex-col items-center gap-16 lg:flex-row lg:gap-24">
        {/* Visual */}
        <div className="relative flex h-[320px] w-[320px] items-center justify-center">
          {[...Array(ringCount)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: 60 + i * 55,
                height: 60 + i * 55,
                border: `1px solid rgba(255,42,109,${0.04 + (ringCount - i) * 0.02})`,
                scale: coreScale,
                opacity: coreOpacity,
              }}
              animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
              transition={{ duration: 30 + i * 10, repeat: Infinity, ease: "linear" }}
            />
          ))}
          <motion.div
            className="relative z-10 h-14 w-14 rounded-full"
            style={{
              background: "linear-gradient(135deg, #ff2a6d 0%, #8b5cf6 100%)",
              boxShadow: "0 0 50px rgba(255,42,109,0.35), 0 0 100px rgba(139,92,246,0.15)",
              scale: coreScale,
              opacity: coreOpacity,
            }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* Text */}
        <div className="max-w-sm text-center lg:text-left">
          <p className="text-[clamp(1.6rem,3vw,2.4rem)] font-semibold leading-[1.2] tracking-[-0.02em]">
            Zero emotion.
            <br />
            <span className="text-muted">Pure execution.</span>
          </p>
          <p className="mt-5 text-[15px] font-light leading-relaxed text-muted/70">
            No panic. No FOMO. No hesitation.
            <br />
            Just code that runs exactly as designed.
          </p>
        </div>
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
    <section ref={ref} className="relative flex min-h-[70vh] items-center justify-center px-6 pb-24">
      <motion.div style={{ opacity, scale }} className="text-center">
        <h2 className="text-[clamp(2.8rem,7vw,5rem)] font-black tracking-[-0.04em]">
          <span
            style={{
              background: "linear-gradient(135deg, #ff2a6d 0%, #8b5cf6 40%, #05d9e8 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 0 30px rgba(139,92,246,0.3))",
            }}
          >
            Enter the trenches.
          </span>
        </h2>

        <motion.button
          onClick={() => (session ? null : signIn("twitter"))}
          className="group relative mt-12 inline-flex h-14 items-center gap-3 overflow-hidden rounded-full px-10 text-[15px] font-semibold text-white"
          style={{
            background: "linear-gradient(135deg, #ff2a6d 0%, #8b5cf6 50%, #05d9e8 100%)",
            backgroundSize: "200% 200%",
          }}
          whileHover={{ scale: 1.04, backgroundPosition: "100% 100%" }}
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
              Start Trading
            </>
          )}
        </motion.button>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-[13px] text-muted/40"
        >
          Non-custodial. Your keys, your funds.
        </motion.p>
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
    [
      "rgba(255,42,109,0)",
      "rgba(255,42,109,0.015)",
      "rgba(139,92,246,0.015)",
      "rgba(5,217,232,0.01)",
    ]
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
        <CoreStatement />
        <DisciplineSection />
        <CtaSection />
        <footer className="border-t border-border py-8 text-center text-[11px] text-muted/20 tracking-widest">
          TRENCHD
        </footer>
      </main>
    </>
  );
}
