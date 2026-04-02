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

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-8 text-[clamp(1.1rem,2.2vw,1.5rem)] font-light tracking-wide text-muted"
        >
          AI that trades with you.
        </motion.p>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, delay: 1.8 }}
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

// ─── AI Chat mockup ───
function AIMockup() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 60, damping: 25 });
  const opacity = useTransform(smooth, [0.1, 0.3, 0.7, 0.88], [0, 1, 1, 0]);
  const y = useTransform(smooth, [0.1, 0.3, 0.7, 0.88], [80, 0, 0, -80]);

  const messages = [
    { role: "ai" as const, text: "SOL breaking out of the 4h wedge. Volume confirming.", delay: 0 },
    { role: "ai" as const, text: "Entry zone: $148.20–$149.00. R:R looks 3.2:1 here.", delay: 0.3 },
    { role: "user" as const, text: "What's the stop?", delay: 0.6 },
    { role: "ai" as const, text: "$145.80 — below the structure. Invalidates the setup.", delay: 0.9 },
    { role: "ai" as const, text: "Taking profit at $156. I'd scale out 50% there.", delay: 1.2 },
  ];

  return (
    <section ref={ref} className="relative flex min-h-[90vh] items-center justify-center px-6">
      <motion.div style={{ opacity, y }} className="flex flex-col items-center gap-12 lg:flex-row lg:gap-20">
        {/* Text */}
        <div className="max-w-sm text-center lg:text-left">
          <p className="text-[clamp(1.8rem,3.5vw,2.6rem)] font-semibold leading-[1.15] tracking-[-0.02em]">
            It sees what
            <br />
            you don&apos;t.
          </p>
          <p className="mt-5 text-[15px] font-light leading-relaxed text-muted/70">
            Real-time AI analysis while you trade. Entries, exits, risk levels — whispered in your ear before the move happens.
          </p>
        </div>

        {/* Chat UI */}
        <div className="w-full max-w-sm">
          <div
            className="overflow-hidden rounded-2xl border border-fg/[0.04]"
            style={{
              background: "linear-gradient(180deg, rgba(12,12,18,0.9) 0%, rgba(8,8,14,0.95) 100%)",
              boxShadow: "0 0 80px rgba(139,92,246,0.06), 0 20px 60px rgba(0,0,0,0.4)",
            }}
          >
            {/* Title bar */}
            <div className="flex items-center gap-2 border-b border-fg/[0.03] px-5 py-3">
              <motion.div
                className="h-2 w-2 rounded-full bg-pink"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ boxShadow: "0 0 8px rgba(255,42,109,0.5)" }}
              />
              <span className="text-[11px] font-medium tracking-wider text-fg/30">TRENCHD AI</span>
            </div>

            {/* Messages */}
            <div className="space-y-3 p-5">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: msg.delay, duration: 0.5 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed ${
                      msg.role === "ai"
                        ? "rounded-bl-md bg-fg/[0.04] text-fg/75"
                        : "rounded-br-md bg-pink/10 text-fg/60"
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {/* Typing indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 1.6 }}
                className="flex gap-1 px-1 pt-1"
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="h-1.5 w-1.5 rounded-full bg-fg/15"
                    animate={{ opacity: [0.2, 0.7, 0.2] }}
                    transition={{ duration: 1.2, delay: i * 0.2, repeat: Infinity }}
                  />
                ))}
              </motion.div>
            </div>
          </div>
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
    <section ref={ref} className="relative flex min-h-[70vh] items-center justify-center px-6">
      <motion.div style={{ opacity, y }} className="max-w-3xl text-center">
        <p className="text-[clamp(2rem,4.5vw,3.5rem)] font-semibold leading-[1.15] tracking-[-0.03em]">
          You make the calls.
          <br />
          <span
            style={{
              background: "linear-gradient(90deg, #ff2a6d, #8b5cf6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            It makes you better.
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
            Trade smarter.
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

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-[13px] text-muted/30"
        >
          You trade. It guides.
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
        <AIMockup />
        <Statement />
        <CtaSection />
        <footer className="border-t border-border py-8 text-center text-[11px] text-muted/20 tracking-widest">
          TRENCHD
        </footer>
      </main>
    </>
  );
}
