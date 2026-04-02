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

    // Wave line config
    const lines: {
      y: number;
      amplitude: number;
      frequency: number;
      speed: number;
      opacity: number;
      width: number;
      phase: number;
      drift: number;
    }[] = [];

    for (let i = 0; i < 80; i++) {
      lines.push({
        y: Math.random() * 1.4 - 0.2, // normalized position, some offscreen
        amplitude: 2 + Math.random() * 12,
        frequency: 0.002 + Math.random() * 0.008,
        speed: 0.3 + Math.random() * 1.2,
        opacity: 0.03 + Math.random() * 0.08,
        width: 0.5 + Math.random() * 1,
        phase: Math.random() * Math.PI * 2,
        drift: (Math.random() - 0.5) * 0.15, // slow vertical drift
      });
    }

    // Floating particles
    const particles: {
      x: number;
      y: number;
      size: number;
      speed: number;
      opacity: number;
      wobbleSpeed: number;
      wobbleAmp: number;
    }[] = [];

    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random(),
        y: Math.random(),
        size: 1 + Math.random() * 2.5,
        speed: 0.05 + Math.random() * 0.2,
        opacity: 0.1 + Math.random() * 0.25,
        wobbleSpeed: 0.5 + Math.random() * 1.5,
        wobbleAmp: 10 + Math.random() * 25,
      });
    }

    function draw() {
      const w = canvas!.width;
      const h = canvas!.height;
      time += 0.016;

      // Sky gradient
      const grad = ctx!.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, "#dceefb");
      grad.addColorStop(0.3, "#e8f4fd");
      grad.addColorStop(0.6, "#f0f7fc");
      grad.addColorStop(1, "#f8fbfe");
      ctx!.fillStyle = grad;
      ctx!.fillRect(0, 0, w, h);

      // Soft radial light sources
      const glow1 = ctx!.createRadialGradient(
        w * 0.3, h * 0.2, 0,
        w * 0.3, h * 0.2, w * 0.5
      );
      glow1.addColorStop(0, "rgba(255, 255, 255, 0.4)");
      glow1.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx!.fillStyle = glow1;
      ctx!.fillRect(0, 0, w, h);

      const glow2 = ctx!.createRadialGradient(
        w * 0.7, h * 0.15, 0,
        w * 0.7, h * 0.15, w * 0.4
      );
      glow2.addColorStop(0, "rgba(255, 255, 255, 0.3)");
      glow2.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx!.fillStyle = glow2;
      ctx!.fillRect(0, 0, w, h);

      // Wave lines
      for (const line of lines) {
        const baseY = line.y * h + Math.sin(time * line.drift) * 20;

        ctx!.beginPath();
        ctx!.strokeStyle = `rgba(180, 210, 235, ${line.opacity})`;
        ctx!.lineWidth = line.width;

        for (let x = -20; x <= w + 20; x += 3) {
          const wave1 = Math.sin(x * line.frequency + time * line.speed + line.phase) * line.amplitude;
          const wave2 = Math.sin(x * line.frequency * 1.8 + time * line.speed * 0.7 + line.phase * 2) * line.amplitude * 0.4;
          const y = baseY + wave1 + wave2;

          if (x === -20) {
            ctx!.moveTo(x, y);
          } else {
            ctx!.lineTo(x, y);
          }
        }
        ctx!.stroke();
      }

      // A second pass of thinner, brighter lines
      for (let i = 0; i < 25; i++) {
        const line = lines[i];
        const baseY = line.y * h + Math.sin(time * line.drift * 1.5 + 3) * 15;

        ctx!.beginPath();
        ctx!.strokeStyle = `rgba(255, 255, 255, ${line.opacity * 0.8})`;
        ctx!.lineWidth = line.width * 0.5;

        for (let x = -20; x <= w + 20; x += 3) {
          const wave = Math.sin(x * line.frequency * 1.3 + time * line.speed * 1.2 + line.phase + 1) * line.amplitude * 0.7;
          const y = baseY + wave + 8;

          if (x === -20) {
            ctx!.moveTo(x, y);
          } else {
            ctx!.lineTo(x, y);
          }
        }
        ctx!.stroke();
      }

      // Floating particles
      for (const p of particles) {
        const px = p.x * w + Math.sin(time * p.wobbleSpeed) * p.wobbleAmp;
        let py = p.y * h - time * p.speed * 30;

        // Wrap around
        if (py < -20) {
          py = h + 20 + (py % (h + 40));
        }

        const pulse = 0.7 + Math.sin(time * 2 + p.x * 10) * 0.3;

        ctx!.beginPath();
        ctx!.arc(px, py, p.size, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(255, 255, 255, ${p.opacity * pulse})`;
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
