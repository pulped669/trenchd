"use client";

import { useEffect, useRef } from "react";

export default function HeavenBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    // Wave lines
    const lines: {
      y: number;
      amplitude: number;
      frequency: number;
      speed: number;
      opacity: number;
      width: number;
      phase: number;
      drift: number;
      hue: number;
    }[] = [];

    for (let i = 0; i < 100; i++) {
      lines.push({
        y: Math.random() * 1.4 - 0.2,
        amplitude: 2 + Math.random() * 14,
        frequency: 0.002 + Math.random() * 0.007,
        speed: 0.2 + Math.random() * 0.8,
        opacity: 0.04 + Math.random() * 0.1,
        width: 0.5 + Math.random() * 1,
        phase: Math.random() * Math.PI * 2,
        drift: (Math.random() - 0.5) * 0.1,
        hue: 195 + Math.random() * 25, // teal-to-blue range
      });
    }

    // Particles
    const particles: {
      x: number;
      y: number;
      size: number;
      speed: number;
      opacity: number;
      wobbleSpeed: number;
      wobbleAmp: number;
    }[] = [];

    for (let i = 0; i < 30; i++) {
      particles.push({
        x: Math.random(),
        y: Math.random(),
        size: 0.8 + Math.random() * 1.5,
        speed: 0.03 + Math.random() * 0.12,
        opacity: 0.08 + Math.random() * 0.2,
        wobbleSpeed: 0.3 + Math.random() * 1,
        wobbleAmp: 8 + Math.random() * 20,
      });
    }

    function draw() {
      const w = canvas!.width;
      const h = canvas!.height;
      time += 0.016;

      // Deep navy gradient
      const grad = ctx!.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, "#0b1120");
      grad.addColorStop(0.4, "#0d1526");
      grad.addColorStop(0.7, "#0f1a2e");
      grad.addColorStop(1, "#111d35");
      ctx!.fillStyle = grad;
      ctx!.fillRect(0, 0, w, h);

      // Subtle top glow — cool blue
      const glow = ctx!.createRadialGradient(
        w * 0.5, h * 0.1, 0,
        w * 0.5, h * 0.1, w * 0.6
      );
      glow.addColorStop(0, "rgba(56, 189, 248, 0.03)");
      glow.addColorStop(1, "rgba(56, 189, 248, 0)");
      ctx!.fillStyle = glow;
      ctx!.fillRect(0, 0, w, h);

      // Wave lines — teal/slate blue
      for (const line of lines) {
        const baseY = line.y * h + Math.sin(time * line.drift) * 18;

        ctx!.beginPath();
        ctx!.strokeStyle = `hsla(${line.hue}, 40%, 55%, ${line.opacity})`;
        ctx!.lineWidth = line.width;

        for (let x = -20; x <= w + 20; x += 3) {
          const wave1 = Math.sin(x * line.frequency + time * line.speed + line.phase) * line.amplitude;
          const wave2 = Math.sin(x * line.frequency * 1.7 + time * line.speed * 0.6 + line.phase * 2) * line.amplitude * 0.35;
          const y = baseY + wave1 + wave2;

          if (x === -20) ctx!.moveTo(x, y);
          else ctx!.lineTo(x, y);
        }
        ctx!.stroke();
      }

      // Bright overlay lines — lighter, fewer
      for (let i = 0; i < 30; i++) {
        const line = lines[i];
        const baseY = line.y * h + Math.sin(time * line.drift * 1.3 + 2) * 12;

        ctx!.beginPath();
        ctx!.strokeStyle = `rgba(148, 210, 240, ${line.opacity * 0.5})`;
        ctx!.lineWidth = line.width * 0.4;

        for (let x = -20; x <= w + 20; x += 3) {
          const wave = Math.sin(x * line.frequency * 1.4 + time * line.speed * 1.1 + line.phase + 1.5) * line.amplitude * 0.6;
          const y = baseY + wave + 6;

          if (x === -20) ctx!.moveTo(x, y);
          else ctx!.lineTo(x, y);
        }
        ctx!.stroke();
      }

      // Particles — soft blue-white
      for (const p of particles) {
        const px = p.x * w + Math.sin(time * p.wobbleSpeed) * p.wobbleAmp;
        let py = p.y * h - time * p.speed * 25;
        if (py < -20) py = h + 20 + (py % (h + 40));

        const pulse = 0.7 + Math.sin(time * 1.5 + p.x * 8) * 0.3;

        ctx!.beginPath();
        ctx!.arc(px, py, p.size, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(148, 210, 240, ${p.opacity * pulse})`;
        ctx!.fill();
      }

      animationId = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
    />
  );
}
