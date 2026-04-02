"use client";

import { useRef, useEffect, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useMotionValueEvent,
} from "framer-motion";
import { signIn, useSession } from "next-auth/react";

// ─── Utility: smooth lerp color based on scroll ───
function useSmoothProgress(scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"]) {
  return useSpring(scrollYProgress, { stiffness: 80, damping: 30 });
}

// ─── Cursor glow that follows mouse ───
function CursorGlow() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 150, damping: 25 });
  const springY = useSpring(y, { stiffness: 150, damping: 25 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);

  return (
    <motion.div
      className="pointer-events-none fixed z-50 h-[500px] w-[500px] rounded-full"
      style={{
        x: springX,
        y: springY,
        translateX: "-50%",
        translateY: "-50%",
        background:
          "radial-gradient(circle, rgba(255,42,109,0.04) 0%, rgba(5,217,232,0.02) 40%, transparent 70%)",
      }}
    />
  );
}

// ─── Navbar ───
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
      className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-8 transition-all duration-500"
      style={{ height: scrolled ? 56 : 72 }}
    >
      <div
        className="absolute inset-0 border-b transition-all duration-500"
        style={{
          backgroundColor: scrolled ? "rgba(5,5,8,0.7)" : "transparent",
          backdropFilter: scrolled ? "blur(40px) saturate(180%)" : "none",
          borderColor: scrolled ? "rgba(255,255,255,0.04)" : "transparent",
        }}
      />
      <span className="relative z-10 text-[13px] font-bold tracking-[0.15em] text-fg/80">
        TRENCHD
      </span>
      <button
        onClick={() => (session ? null : signIn("twitter"))}
        className="relative z-10 rounded-full border border-fg/10 bg-fg/[0.03] px-5 py-2 text-[12px] font-medium text-fg/70 transition-all hover:bg-fg/[0.07] hover:text-fg"
      >
        {session ? session.user?.name : "Sign in"}
      </button>
    </motion.nav>
  );
}

// ─── Section 1: Opening ───
function Opening() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.92]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -80]);

  return (
    <section ref={ref} className="relative flex h-[100vh] items-center justify-center">
      {/* Radial glow behind title */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink/[0.03] blur-[150px]" />
        <div className="absolute left-[30%] top-[40%] h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan/[0.02] blur-[120px]" />
      </div>

      <motion.div style={{ opacity, scale, y }} className="relative text-center px-6">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-[clamp(3.5rem,12vw,9rem)] font-extrabold leading-[0.9] tracking-[-0.04em]"
        >
          <span className="block bg-gradient-to-b from-white via-fg/90 to-fg/40 bg-clip-text text-transparent">
            trenchd
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-6 text-[clamp(1rem,2vw,1.25rem)] font-light tracking-wide text-muted"
        >
          Autonomous trading on Solana.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.3, y: 0 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="mt-24"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="mx-auto h-12 w-px bg-gradient-to-b from-fg/20 to-transparent"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}

// ─── Section 2: Bold Statements ───
function Statement({
  children,
  accent,
  sub,
  index,
}: {
  children: React.ReactNode;
  accent?: string;
  sub?: string;
  index: number;
}) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const progress = useSmoothProgress(scrollYProgress);
  const opacity = useTransform(progress, [0.15, 0.35, 0.65, 0.85], [0, 1, 1, 0]);
  const y = useTransform(progress, [0.15, 0.35, 0.65, 0.85], [60, 0, 0, -60]);
  const scale = useTransform(progress, [0.15, 0.35, 0.65, 0.85], [0.97, 1, 1, 0.97]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-screen items-center justify-center px-6"
    >
      <motion.div style={{ opacity, y, scale }} className="max-w-4xl text-center">
        <p
          className="text-[clamp(2rem,5.5vw,4.2rem)] font-semibold leading-[1.15] tracking-[-0.03em]"
          style={{ color: accent }}
        >
          {children}
        </p>
        {sub && (
          <p className="mx-auto mt-6 max-w-lg text-[clamp(0.95rem,1.5vw,1.15rem)] font-light leading-relaxed text-muted">
            {sub}
          </p>
        )}
      </motion.div>
    </section>
  );
}

// ─── Section: Animated line ───
function LineDivider() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const width = useTransform(scrollYProgress, [0.2, 0.5], ["0%", "100%"]);
  const opacity = useTransform(scrollYProgress, [0.2, 0.4, 0.6, 0.8], [0, 1, 1, 0]);

  return (
    <div ref={ref} className="flex h-[40vh] items-center justify-center px-6">
      <motion.div
        style={{ width, opacity }}
        className="h-px max-w-2xl bg-gradient-to-r from-transparent via-pink/40 to-transparent"
      />
    </div>
  );
}

// ─── Section: Visual Feature ───
function VisualBlock({
  title,
  body,
  visual,
  reverse = false,
}: {
  title: string;
  body: string;
  visual: React.ReactNode;
  reverse?: boolean;
}) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const progress = useSmoothProgress(scrollYProgress);
  const opacity = useTransform(progress, [0.15, 0.35, 0.7, 0.85], [0, 1, 1, 0]);
  const x = useTransform(
    progress,
    [0.15, 0.35],
    reverse ? [-40, 0] : [40, 0]
  );

  return (
    <section ref={ref} className="flex min-h-screen items-center justify-center px-6 py-20">
      <motion.div
        style={{ opacity, x }}
        className={`mx-auto flex max-w-5xl flex-col items-center gap-16 ${
          reverse ? "lg:flex-row-reverse" : "lg:flex-row"
        }`}
      >
        <div className="flex-1 text-center lg:text-left">
          <h3 className="text-[clamp(1.8rem,3.5vw,2.8rem)] font-semibold tracking-[-0.03em]">
            {title}
          </h3>
          <p className="mt-4 max-w-md text-[16px] font-light leading-relaxed text-muted">
            {body}
          </p>
        </div>
        <div className="flex-1">{visual}</div>
      </motion.div>
    </section>
  );
}

// ─── Visual: Pulse ring ───
function PulseRing() {
  return (
    <div className="relative flex h-[300px] w-full items-center justify-center">
      {[1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-pink/10"
          style={{
            width: 80 + i * 60,
            height: 80 + i * 60,
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 3,
            delay: i * 0.4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
      <motion.div
        className="relative z-10 h-16 w-16 rounded-full bg-gradient-to-br from-pink to-purple"
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        style={{
          boxShadow: "0 0 40px rgba(255,42,109,0.4), 0 0 80px rgba(255,42,109,0.15)",
        }}
      />
    </div>
  );
}

// ─── Visual: Speed lines ───
function SpeedLines() {
  return (
    <div className="relative flex h-[300px] w-full items-center justify-center overflow-hidden">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-px bg-gradient-to-r from-transparent via-cyan to-transparent"
          style={{
            width: 40 + Math.random() * 120,
            top: `${15 + i * 6.5}%`,
            left: `${Math.random() * 60}%`,
          }}
          animate={{
            x: [0, 200, 0],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: 1.5 + Math.random(),
            delay: i * 0.15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
      <div className="relative z-10 font-mono text-[48px] font-bold text-cyan/80"
        style={{ textShadow: "0 0 30px rgba(5,217,232,0.5)" }}>
        14ms
      </div>
    </div>
  );
}

// ─── Visual: Discipline bars ───
function DisciplineBars() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });

  const labels = ["Emotion", "Fatigue", "Hesitation", "FOMO", "Discipline"];
  const humanVals = [82, 70, 65, 88, 30];
  const botVals = [0, 0, 0, 0, 100];
  const colors = ["#ff2a6d", "#ff2a6d", "#ff2a6d", "#ff2a6d", "#05d9e8"];

  return (
    <div ref={ref} className="w-full max-w-sm space-y-4">
      {labels.map((label, i) => {
        const w = useTransform(
          scrollYProgress,
          [0.3, 0.7],
          [humanVals[i], botVals[i]]
        );
        return (
          <div key={label}>
            <div className="mb-1.5 flex items-center justify-between text-[13px]">
              <span className="text-muted">{label}</span>
              <motion.span className="font-mono text-fg/60" style={{ opacity: 1 }}>
                <MotionPercent value={w} />
              </motion.span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-fg/[0.04]">
              <motion.div
                className="h-full rounded-full"
                style={{
                  width: useTransform(w, (v) => `${v}%`),
                  backgroundColor: colors[i],
                }}
              />
            </div>
          </div>
        );
      })}
      <div className="flex justify-between pt-2 text-[11px] text-muted/40">
        <span>HUMAN</span>
        <span>TRENCHD</span>
      </div>
    </div>
  );
}

function MotionPercent({ value }: { value: ReturnType<typeof useMotionValue<number>> }) {
  const [display, setDisplay] = useState(0);
  useMotionValueEvent(value, "change", (v: number) => setDisplay(Math.round(v)));
  return <>{display}%</>;
}

// ─── Section: CTA ───
function CtaSection() {
  const { data: session } = useSession();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });
  const progress = useSmoothProgress(scrollYProgress);
  const opacity = useTransform(progress, [0.2, 0.6], [0, 1]);
  const scale = useTransform(progress, [0.2, 0.6], [0.95, 1]);

  return (
    <section ref={ref} className="relative flex min-h-[80vh] items-center justify-center px-6 pb-32">
      <motion.div style={{ opacity, scale }} className="text-center">
        <h2 className="text-[clamp(2.5rem,6vw,4.5rem)] font-bold tracking-[-0.04em]">
          <span className="bg-gradient-to-r from-pink via-purple to-cyan bg-clip-text text-transparent">
            Enter the trenches.
          </span>
        </h2>
        <p className="mt-4 text-lg text-muted">
          One click. That&apos;s all it takes.
        </p>
        <motion.button
          onClick={() => (session ? null : signIn("twitter"))}
          className="mt-10 inline-flex h-14 items-center gap-3 rounded-full px-10 text-[15px] font-semibold text-white transition-transform hover:scale-[1.03] active:scale-[0.97]"
          style={{
            background: "linear-gradient(135deg, #ff2a6d 0%, #8b5cf6 50%, #05d9e8 100%)",
            boxShadow:
              "0 0 30px rgba(255,42,109,0.25), 0 0 60px rgba(139,92,246,0.15)",
          }}
          whileHover={{
            boxShadow:
              "0 0 40px rgba(255,42,109,0.35), 0 0 80px rgba(139,92,246,0.2)",
          }}
        >
          {session ? (
            "Open Dashboard"
          ) : (
            <>
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              Start Trading
            </>
          )}
        </motion.button>
      </motion.div>
    </section>
  );
}

// ─── Background color shift ───
function BackgroundShift() {
  const { scrollYProgress } = useScroll();
  const bg1 = useTransform(
    scrollYProgress,
    [0, 0.3, 0.5, 0.7, 1],
    [
      "rgba(255,42,109,0)",
      "rgba(255,42,109,0.02)",
      "rgba(5,217,232,0.02)",
      "rgba(139,92,246,0.02)",
      "rgba(255,42,109,0.02)",
    ]
  );

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-0"
      style={{ backgroundColor: bg1 }}
    />
  );
}

// ─── Main ───
export default function Home() {
  return (
    <>
      <CursorGlow />
      <BackgroundShift />
      <Nav />
      <main className="relative z-10">
        <Opening />

        <Statement
          index={0}
          accent="#ededf0"
          sub="trenchd watches every token, every candle, every order book — simultaneously. It doesn't scroll Twitter for alpha. It is the alpha."
        >
          While you sleep, it trades.
          <br />
          While you think, it&apos;s already in.
        </Statement>

        <LineDivider />

        <VisualBlock
          title="Zero emotion."
          body="No panic selling at the bottom. No FOMO buying the top. No revenge trading after a loss. trenchd executes with mechanical precision — every single time."
          visual={<PulseRing />}
        />

        <VisualBlock
          title="Inhuman speed."
          body="From signal to execution in 14 milliseconds. By the time you see the opportunity, trenchd has already taken it."
          visual={<SpeedLines />}
          reverse
        />

        <Statement
          index={1}
          accent="#05d9e8"
          sub="Every edge a human trader has, trenchd has more of it. Every weakness a human trader has, trenchd has none."
        >
          More disciplined than you.
          <br />
          And it doesn&apos;t need sleep.
        </Statement>

        <LineDivider />

        <VisualBlock
          title="Human vs. Machine."
          body="As you scroll, watch the bars shift from human to trenchd. This is what replacing emotion with code looks like."
          visual={<DisciplineBars />}
        />

        <Statement
          index={2}
          accent="#ff2a6d"
        >
          The market doesn&apos;t care
          <br />
          about your feelings.
          <br />
          <span className="text-muted">Neither does trenchd.</span>
        </Statement>

        <LineDivider />

        <CtaSection />

        <footer className="border-t border-border py-8 text-center text-[12px] text-muted/30">
          &copy; {new Date().getFullYear()} TRENCHD
        </footer>
      </main>
    </>
  );
}
