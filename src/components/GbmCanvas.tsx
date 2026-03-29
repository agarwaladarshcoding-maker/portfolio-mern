"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

export function GbmCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      // A nice tall height that covers at least the hero area
      canvas.height = window.innerHeight * 0.8; 
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Box-Muller transform for N(0,1)
    const randomNormal = () => {
      let u = 0, v = 0;
      while (u === 0) u = Math.random();
      while (v === 0) v = Math.random();
      return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    };

    const numPaths = 3;
    const dt = 1;
    const mu = 0.0001; // very small drift
    const sigma = 0.015; // volatility
    
    // Init paths
    let paths = Array.from({ length: numPaths }).map(() => ({
      x: 0,
      y: canvas.height / 2,
      lastX: 0,
      lastY: canvas.height / 2,
    }));

    const strokeColor = resolvedTheme === "dark" 
      ? "rgba(197, 160, 89, 0.1)"  // Muted Gold
      : "rgba(184, 115, 51, 0.1)"; // Copper

    const draw = () => {
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = strokeColor;

      paths.forEach((p) => {
        const dW = randomNormal() * Math.sqrt(dt);
        // GBM discrete step
        const dS = p.y * (mu * dt + sigma * dW);
        
        p.lastX = p.x;
        p.lastY = p.y;
        
        p.x += 1.5; // step forward
        p.y += dS;

        ctx.beginPath();
        ctx.moveTo(p.lastX, p.lastY);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();

        // Reset the path back to the left if it leaves viewport or goes way out of bounds
        if (p.x > canvas.width || p.y < -100 || p.y > canvas.height + 100) {
          p.x = 0;
          p.lastX = 0;
          p.y = canvas.height / 2;
          p.lastY = p.y;
        }
      });
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [resolvedTheme]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: -1,
        pointerEvents: 'none',
        opacity: 0.6,
      }}
    />
  );
}
