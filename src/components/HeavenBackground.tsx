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
    let dpr = 1;

    function resize() {
      dpr = window.devicePixelRatio || 1;
      canvas!.width = window.innerWidth * dpr;
      canvas!.height = window.innerHeight * dpr;
      canvas!.style.width = window.innerWidth + "px";
      canvas!.style.height = window.innerHeight + "px";
      ctx!.scale(dpr, dpr);
    }
    resize();
    window.addEventListener("resize", resize);

    // ─── Wave line layers ───
    // Layer 1: deep background — slow, wide, very subtle
    // Layer 2: mid field — medium speed, main visual
    // Layer 3: foreground — faster, thinner, brighter
    interface WaveLine {
      y: number;
      amplitude: number;
      frequency: number;
      speed: number;
      opacity: number;
      width: number;
      phase: number;
      drift: number;
      hue: number;
      saturation: number;
      lightness: number;
    }

    function createLayer(
      count: number,
      opts: {
        ampMin: number; ampMax: number;
        freqMin: number; freqMax: number;
        speedMin: number; speedMax: number;
        opacityMin: number; opacityMax: number;
        widthMin: number; widthMax: number;
        hueMin: number; hueMax: number;
        satMin: number; satMax: number;
        lightMin: number; lightMax: number;
      }
    ): WaveLine[] {
      const lines: WaveLine[] = [];
      for (let i = 0; i < count; i++) {
        lines.push({
          y: Math.random() * 1.5 - 0.25,
          amplitude: opts.ampMin + Math.random() * (opts.ampMax - opts.ampMin),
          frequency: opts.freqMin + Math.random() * (opts.freqMax - opts.freqMin),
          speed: opts.speedMin + Math.random() * (opts.speedMax - opts.speedMin),
          opacity: opts.opacityMin + Math.random() * (opts.opacityMax - opts.opacityMin),
          width: opts.widthMin + Math.random() * (opts.widthMax - opts.widthMin),
          phase: Math.random() * Math.PI * 2,
          drift: (Math.random() - 0.5) * 0.08,
          hue: opts.hueMin + Math.random() * (opts.hueMax - opts.hueMin),
          saturation: opts.satMin + Math.random() * (opts.satMax - opts.satMin),
          lightness: opts.lightMin + Math.random() * (opts.lightMax - opts.lightMin),
        });
      }
      return lines;
    }

    // Deep background waves — slow, large, ghostly
    const bgWaves = createLayer(40, {
      ampMin: 8, ampMax: 25,
      freqMin: 0.001, freqMax: 0.003,
      speedMin: 0.08, speedMax: 0.25,
      opacityMin: 0.015, opacityMax: 0.04,
      widthMin: 1.5, widthMax: 3,
      hueMin: 210, hueMax: 230,
      satMin: 30, satMax: 50,
      lightMin: 40, lightMax: 55,
    });

    // Mid waves — the main visual body
    const midWaves = createLayer(80, {
      ampMin: 3, ampMax: 16,
      freqMin: 0.002, freqMax: 0.008,
      speedMin: 0.2, speedMax: 0.7,
      opacityMin: 0.03, opacityMax: 0.09,
      widthMin: 0.5, widthMax: 1.2,
      hueMin: 195, hueMax: 220,
      satMin: 35, satMax: 55,
      lightMin: 50, lightMax: 65,
    });

    // Foreground highlights — thin, fast, bright
    const fgWaves = createLayer(35, {
      ampMin: 2, ampMax: 10,
      freqMin: 0.004, freqMax: 0.012,
      speedMin: 0.5, speedMax: 1.2,
      opacityMin: 0.04, opacityMax: 0.12,
      widthMin: 0.3, widthMax: 0.7,
      hueMin: 190, hueMax: 210,
      satMin: 50, satMax: 70,
      lightMin: 65, lightMax: 80,
    });

    // Particles with depth
    interface Particle {
      x: number;
      y: number;
      size: number;
      speed: number;
      baseOpacity: number;
      wobbleSpeed: number;
      wobbleAmp: number;
      hue: number;
      layer: number; // 0 = far, 1 = mid, 2 = near
    }

    const particles: Particle[] = [];
    for (let i = 0; i < 50; i++) {
      const layer = i < 15 ? 0 : i < 35 ? 1 : 2;
      particles.push({
        x: Math.random(),
        y: Math.random(),
        size: layer === 0 ? 0.5 + Math.random() * 0.8 : layer === 1 ? 0.8 + Math.random() * 1.2 : 1.2 + Math.random() * 2,
        speed: layer === 0 ? 0.01 + Math.random() * 0.04 : layer === 1 ? 0.04 + Math.random() * 0.1 : 0.08 + Math.random() * 0.15,
        baseOpacity: layer === 0 ? 0.06 : layer === 1 ? 0.12 : 0.2,
        wobbleSpeed: 0.2 + Math.random() * 1,
        wobbleAmp: 5 + Math.random() * 15,
        hue: 200 + Math.random() * 20,
        layer,
      });
    }

    // Nebula clouds — very soft, large
    interface Nebula {
      x: number;
      y: number;
      radius: number;
      hue: number;
      opacity: number;
      driftX: number;
      driftY: number;
    }

    const nebulae: Nebula[] = [
      { x: 0.2, y: 0.15, radius: 0.35, hue: 220, opacity: 0.018, driftX: 0.02, driftY: 0.01 },
      { x: 0.75, y: 0.3, radius: 0.25, hue: 200, opacity: 0.015, driftX: -0.015, driftY: 0.02 },
      { x: 0.5, y: 0.7, radius: 0.3, hue: 230, opacity: 0.012, driftX: 0.01, driftY: -0.01 },
      { x: 0.1, y: 0.8, radius: 0.2, hue: 210, opacity: 0.01, driftX: 0.025, driftY: 0.005 },
    ];

    function drawWaveLayer(lines: WaveLine[], w: number, h: number, step: number) {
      for (const line of lines) {
        const baseY = line.y * h + Math.sin(time * line.drift) * 20;

        ctx!.beginPath();
        ctx!.strokeStyle = `hsla(${line.hue}, ${line.saturation}%, ${line.lightness}%, ${line.opacity})`;
        ctx!.lineWidth = line.width;
        ctx!.lineCap = "round";
        ctx!.lineJoin = "round";

        let first = true;
        for (let x = -20; x <= w + 20; x += step) {
          const wave1 = Math.sin(x * line.frequency + time * line.speed + line.phase) * line.amplitude;
          const wave2 = Math.sin(x * line.frequency * 1.8 + time * line.speed * 0.55 + line.phase * 2.3) * line.amplitude * 0.3;
          const wave3 = Math.sin(x * line.frequency * 3.1 + time * line.speed * 0.3 + line.phase * 0.7) * line.amplitude * 0.1;
          const y = baseY + wave1 + wave2 + wave3;

          if (first) { ctx!.moveTo(x, y); first = false; }
          else ctx!.lineTo(x, y);
        }
        ctx!.stroke();
      }
    }

    function draw() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      time += 0.016;

      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      // ─── Sky gradient — richer, deeper navy ───
      const grad = ctx!.createLinearGradient(0, 0, w * 0.3, h);
      grad.addColorStop(0, "#080e1c");
      grad.addColorStop(0.25, "#0a1224");
      grad.addColorStop(0.5, "#0d162a");
      grad.addColorStop(0.75, "#0f1a30");
      grad.addColorStop(1, "#111e38");
      ctx!.fillStyle = grad;
      ctx!.fillRect(0, 0, w, h);

      // ─── Nebula clouds ───
      for (const n of nebulae) {
        const nx = n.x * w + Math.sin(time * n.driftX) * w * 0.05;
        const ny = n.y * h + Math.sin(time * n.driftY + 1) * h * 0.03;
        const r = n.radius * Math.min(w, h);

        const nGrad = ctx!.createRadialGradient(nx, ny, 0, nx, ny, r);
        nGrad.addColorStop(0, `hsla(${n.hue}, 50%, 50%, ${n.opacity})`);
        nGrad.addColorStop(0.5, `hsla(${n.hue}, 40%, 40%, ${n.opacity * 0.4})`);
        nGrad.addColorStop(1, `hsla(${n.hue}, 30%, 30%, 0)`);
        ctx!.fillStyle = nGrad;
        ctx!.fillRect(0, 0, w, h);
      }

      // ─── Subtle top-center glow ───
      const topGlow = ctx!.createRadialGradient(
        w * 0.5, h * 0.05, 0,
        w * 0.5, h * 0.05, w * 0.7
      );
      topGlow.addColorStop(0, "rgba(56, 140, 220, 0.025)");
      topGlow.addColorStop(0.5, "rgba(56, 140, 220, 0.008)");
      topGlow.addColorStop(1, "rgba(56, 140, 220, 0)");
      ctx!.fillStyle = topGlow;
      ctx!.fillRect(0, 0, w, h);

      // ─── Wave layers with depth (back to front) ───
      drawWaveLayer(bgWaves, w, h, 4);
      drawWaveLayer(midWaves, w, h, 2);
      drawWaveLayer(fgWaves, w, h, 2);

      // ─── Particles with glow ───
      for (const p of particles) {
        const px = p.x * w + Math.sin(time * p.wobbleSpeed + p.x * 5) * p.wobbleAmp;
        let py = p.y * h - time * p.speed * 20;
        if (py < -20) py = h + 20 + (py % (h + 40));

        const pulse = 0.6 + Math.sin(time * 1.8 + p.x * 12 + p.y * 7) * 0.4;
        const alpha = p.baseOpacity * pulse;

        // Outer glow
        if (p.layer >= 1) {
          const glowGrad = ctx!.createRadialGradient(px, py, 0, px, py, p.size * 4);
          glowGrad.addColorStop(0, `hsla(${p.hue}, 60%, 70%, ${alpha * 0.3})`);
          glowGrad.addColorStop(1, `hsla(${p.hue}, 60%, 70%, 0)`);
          ctx!.fillStyle = glowGrad;
          ctx!.fillRect(px - p.size * 4, py - p.size * 4, p.size * 8, p.size * 8);
        }

        // Core
        ctx!.beginPath();
        ctx!.arc(px, py, p.size, 0, Math.PI * 2);
        ctx!.fillStyle = `hsla(${p.hue}, 60%, 80%, ${alpha})`;
        ctx!.fill();
      }

      // ─── Vignette ───
      const vignette = ctx!.createRadialGradient(
        w * 0.5, h * 0.5, w * 0.2,
        w * 0.5, h * 0.5, w * 0.8
      );
      vignette.addColorStop(0, "rgba(0,0,0,0)");
      vignette.addColorStop(1, "rgba(5,8,16,0.35)");
      ctx!.fillStyle = vignette;
      ctx!.fillRect(0, 0, w, h);

      // ─── Film grain (subtle) ───
      const imageData = ctx!.getImageData(0, 0, w * dpr, h * dpr);
      const data = imageData.data;
      const grainStrength = 6;
      // Only apply to every 4th pixel for perf
      for (let i = 0; i < data.length; i += 16) {
        const noise = (Math.random() - 0.5) * grainStrength;
        data[i] += noise;     // R
        data[i+1] += noise;   // G
        data[i+2] += noise;   // B
      }
      ctx!.putImageData(imageData, 0, 0);

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
