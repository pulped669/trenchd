"use client";

import { useEffect } from "react";
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
      className="pointer-events-none absolute rounded-full"
      style={{
        width: size,
        height: size,
        background: color,
        left: x,
        top: y,
        filter: `blur(${size / 3}px)`,
      }}
      animate={{
        y: [0, -20, 10, -15, 0],
        x: [0, 10, -8, 12, 0],
        scale: [1, 1.03, 0.97, 1.01, 1],
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

function GridDot({
  x,
  y,
  delay,
  mouseX,
  mouseY,
}: {
  x: string;
  y: string;
  delay: number;
  mouseX: ReturnType<typeof useSpring>;
  mouseY: ReturnType<typeof useSpring>;
}) {
  const offsetX = useTransform(mouseX, [0, 1], [-8, 8]);
  const offsetY = useTransform(mouseY, [0, 1], [-8, 8]);

  return (
    <motion.div
      className="pointer-events-none absolute h-1 w-1 rounded-full bg-accent/20"
      style={{ left: x, top: y, x: offsetX, y: offsetY }}
      animate={{ opacity: [0.15, 0.4, 0.15] }}
      transition={{
        duration: 4,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

export default function FloatingElements() {
  const mouseXRaw = useMotionValue(0.5);
  const mouseYRaw = useMotionValue(0.5);
  const mouseX = useSpring(mouseXRaw, { stiffness: 40, damping: 30 });
  const mouseY = useSpring(mouseYRaw, { stiffness: 40, damping: 30 });

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
      <Orb size={500} color="rgba(99, 102, 241, 0.03)" x="5%" y="-5%" delay={0} duration={22} />
      <Orb size={400} color="rgba(139, 92, 246, 0.025)" x="65%" y="15%" delay={3} duration={26} />
      <Orb size={350} color="rgba(99, 102, 241, 0.02)" x="25%" y="55%" delay={5} duration={20} />

      {/* Scattered dots with parallax */}
      {[
        { x: "10%", y: "20%", d: 0 },
        { x: "25%", y: "35%", d: 0.5 },
        { x: "40%", y: "15%", d: 1 },
        { x: "55%", y: "45%", d: 1.5 },
        { x: "70%", y: "25%", d: 2 },
        { x: "85%", y: "40%", d: 0.8 },
        { x: "15%", y: "60%", d: 1.2 },
        { x: "60%", y: "65%", d: 0.3 },
        { x: "80%", y: "55%", d: 1.8 },
        { x: "35%", y: "75%", d: 2.2 },
        { x: "90%", y: "70%", d: 0.6 },
        { x: "50%", y: "85%", d: 1.4 },
      ].map((dot, i) => (
        <GridDot key={i} x={dot.x} y={dot.y} delay={dot.d} mouseX={mouseX} mouseY={mouseY} />
      ))}
    </div>
  );
}
