"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

function Orb({
  size,
  color,
  x,
  y,
  delay,
  duration,
}: {
  size: number;
  color: string;
  x: string;
  y: string;
  delay: number;
  duration: number;
}) {
  return (
    <motion.div
      className="pointer-events-none absolute rounded-full blur-3xl"
      style={{
        width: size,
        height: size,
        background: color,
        left: x,
        top: y,
      }}
      animate={{
        y: [0, -30, 10, -20, 0],
        x: [0, 15, -10, 20, 0],
        scale: [1, 1.05, 0.95, 1.02, 1],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

function FloatingIcon({
  children,
  x,
  y,
  delay,
  mouseX,
  mouseY,
}: {
  children: React.ReactNode;
  x: string;
  y: string;
  delay: number;
  mouseX: ReturnType<typeof useSpring>;
  mouseY: ReturnType<typeof useSpring>;
}) {
  const offsetX = useTransform(mouseX, [0, 1], [-15, 15]);
  const offsetY = useTransform(mouseY, [0, 1], [-15, 15]);

  return (
    <motion.div
      className="pointer-events-none absolute flex items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm"
      style={{
        left: x,
        top: y,
        width: 56,
        height: 56,
        x: offsetX,
        y: offsetY,
      }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{
        opacity: [0, 0.7, 0.5, 0.7],
        scale: [0.5, 1, 0.97, 1],
        rotate: [0, 3, -2, 0],
      }}
      transition={{
        duration: 8,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <span className="text-xl">{children}</span>
    </motion.div>
  );
}

export default function FloatingElements() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseXRaw = useMotionValue(0.5);
  const mouseYRaw = useMotionValue(0.5);
  const mouseX = useSpring(mouseXRaw, { stiffness: 50, damping: 30 });
  const mouseY = useSpring(mouseYRaw, { stiffness: 50, damping: 30 });

  useEffect(() => {
    function handleMove(e: MouseEvent) {
      mouseXRaw.set(e.clientX / window.innerWidth);
      mouseYRaw.set(e.clientY / window.innerHeight);
    }
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [mouseXRaw, mouseYRaw]);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* Gradient orbs */}
      <Orb size={600} color="rgba(0, 255, 136, 0.04)" x="10%" y="-10%" delay={0} duration={20} />
      <Orb size={500} color="rgba(0, 212, 255, 0.03)" x="60%" y="20%" delay={2} duration={25} />
      <Orb size={400} color="rgba(0, 255, 136, 0.03)" x="30%" y="60%" delay={4} duration={22} />
      <Orb size={350} color="rgba(120, 0, 255, 0.02)" x="75%" y="70%" delay={1} duration={18} />

      {/* Floating icons with parallax */}
      <FloatingIcon x="8%" y="18%" delay={0.5} mouseX={mouseX} mouseY={mouseY}>
        ◆
      </FloatingIcon>
      <FloatingIcon x="85%" y="12%" delay={1.2} mouseX={mouseX} mouseY={mouseY}>
        ◈
      </FloatingIcon>
      <FloatingIcon x="75%" y="55%" delay={0.8} mouseX={mouseX} mouseY={mouseY}>
        ⬡
      </FloatingIcon>
      <FloatingIcon x="12%" y="65%" delay={1.5} mouseX={mouseX} mouseY={mouseY}>
        ◇
      </FloatingIcon>
      <FloatingIcon x="50%" y="80%" delay={2} mouseX={mouseX} mouseY={mouseY}>
        △
      </FloatingIcon>
      <FloatingIcon x="92%" y="40%" delay={0.3} mouseX={mouseX} mouseY={mouseY}>
        ○
      </FloatingIcon>
      <FloatingIcon x="35%" y="10%" delay={1.8} mouseX={mouseX} mouseY={mouseY}>
        □
      </FloatingIcon>
    </div>
  );
}
