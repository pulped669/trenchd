"use client";

import { motion } from "framer-motion";

function generatePath(width: number, height: number, seed: number): string {
  const points: [number, number][] = [];
  const steps = 50;
  let y = height * 0.7;

  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * width;
    const noise =
      Math.sin(i * 0.7 + seed) * (height * 0.14) +
      Math.cos(i * 1.4 + seed * 2.3) * (height * 0.07);
    const trend = -((i / steps) ** 1.4) * height * 0.4;
    y = height * 0.7 + trend + noise;
    y = Math.max(height * 0.08, Math.min(height * 0.92, y));
    points.push([x, y]);
  }

  return points.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]} ${p[1]}`).join(" ");
}

export default function MiniChart({
  seed = 1,
  color = "#05d9e8",
  className = "",
}: {
  seed?: number;
  color?: string;
  className?: string;
}) {
  const w = 200;
  const h = 60;
  const path = generatePath(w, h, seed);

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={`w-full ${className}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id={`vg-${seed}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path
        d={`${path} L ${w} ${h} L 0 ${h} Z`}
        fill={`url(#vg-${seed})`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />
      <motion.path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.8 }}
        transition={{ duration: 2.5, delay: 0.2 }}
      />
    </svg>
  );
}
