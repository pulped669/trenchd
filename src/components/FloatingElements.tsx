"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

function FloatingShape({
  children,
  x,
  y,
  size,
  delay,
  duration,
  mouseX,
  mouseY,
  parallax = 20,
}: {
  children: React.ReactNode;
  x: string;
  y: string;
  size: number;
  delay: number;
  duration: number;
  mouseX: ReturnType<typeof useSpring>;
  mouseY: ReturnType<typeof useSpring>;
  parallax?: number;
}) {
  const offsetX = useTransform(mouseX, [0, 1], [-parallax, parallax]);
  const offsetY = useTransform(mouseY, [0, 1], [-parallax, parallax]);

  return (
    <motion.div
      className="pointer-events-none absolute"
      style={{ left: x, top: y, width: size, height: size, x: offsetX, y: offsetY }}
      animate={{
        y: [0, -15, 8, -10, 0],
        rotate: [0, 5, -3, 4, 0],
      }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}

export default function FloatingElements() {
  const mouseXRaw = useMotionValue(0.5);
  const mouseYRaw = useMotionValue(0.5);
  const mouseX = useSpring(mouseXRaw, { stiffness: 30, damping: 25 });
  const mouseY = useSpring(mouseYRaw, { stiffness: 30, damping: 25 });

  useEffect(() => {
    function handleMove(e: MouseEvent) {
      mouseXRaw.set(e.clientX / window.innerWidth);
      mouseYRaw.set(e.clientY / window.innerHeight);
    }
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [mouseXRaw, mouseYRaw]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Big pink glow */}
      <div className="absolute -left-[20%] top-[10%] h-[500px] w-[500px] rounded-full bg-pink/[0.04] blur-[120px]" />
      <div className="absolute -right-[10%] top-[30%] h-[400px] w-[400px] rounded-full bg-cyan/[0.03] blur-[100px]" />
      <div className="absolute left-[30%] top-[60%] h-[350px] w-[350px] rounded-full bg-purple/[0.04] blur-[100px]" />

      {/* Wireframe shapes */}
      <FloatingShape x="6%" y="15%" size={60} delay={0} duration={18} mouseX={mouseX} mouseY={mouseY} parallax={25}>
        <svg viewBox="0 0 60 60" className="h-full w-full">
          <polygon points="30,5 55,50 5,50" fill="none" stroke="rgba(5,217,232,0.15)" strokeWidth="1" />
        </svg>
      </FloatingShape>

      <FloatingShape x="88%" y="12%" size={50} delay={2} duration={20} mouseX={mouseX} mouseY={mouseY} parallax={18}>
        <svg viewBox="0 0 50 50" className="h-full w-full">
          <rect x="5" y="5" width="40" height="40" fill="none" stroke="rgba(255,42,109,0.12)" strokeWidth="1" transform="rotate(15 25 25)" />
        </svg>
      </FloatingShape>

      <FloatingShape x="78%" y="55%" size={70} delay={1} duration={22} mouseX={mouseX} mouseY={mouseY} parallax={15}>
        <svg viewBox="0 0 70 70" className="h-full w-full">
          <circle cx="35" cy="35" r="28" fill="none" stroke="rgba(155,93,229,0.1)" strokeWidth="1" />
          <circle cx="35" cy="35" r="18" fill="none" stroke="rgba(155,93,229,0.06)" strokeWidth="1" />
        </svg>
      </FloatingShape>

      <FloatingShape x="12%" y="65%" size={45} delay={3} duration={16} mouseX={mouseX} mouseY={mouseY} parallax={22}>
        <svg viewBox="0 0 45 45" className="h-full w-full">
          <polygon points="22.5,2 43,15 43,35 22.5,43 2,35 2,15" fill="none" stroke="rgba(5,217,232,0.1)" strokeWidth="1" />
        </svg>
      </FloatingShape>

      <FloatingShape x="45%" y="80%" size={40} delay={1.5} duration={19} mouseX={mouseX} mouseY={mouseY} parallax={20}>
        <svg viewBox="0 0 40 40" className="h-full w-full">
          <polygon points="20,2 38,14 32,36 8,36 2,14" fill="none" stroke="rgba(255,42,109,0.08)" strokeWidth="1" />
        </svg>
      </FloatingShape>

      <FloatingShape x="55%" y="8%" size={35} delay={4} duration={21} mouseX={mouseX} mouseY={mouseY} parallax={12}>
        <div className="flex h-full w-full items-center justify-center font-[var(--font-pixel)] text-[10px] text-cyan/10">
          ///
        </div>
      </FloatingShape>

      <FloatingShape x="30%" y="35%" size={25} delay={2.5} duration={17} mouseX={mouseX} mouseY={mouseY} parallax={30}>
        <div className="h-full w-full rounded-sm border border-pink/[0.08]" />
      </FloatingShape>
    </div>
  );
}
