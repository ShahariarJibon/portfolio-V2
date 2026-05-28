"use client";

import { useEffect, useRef } from "react";

export default function AdminBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const orbs = Array.from({ length: 5 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: 120 + Math.random() * 180,
      dx: (Math.random() - 0.5) * 1.2,
      dy: (Math.random() - 0.5) * 1.2,
      alpha: 0.06 + Math.random() * 0.06,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      orbs.forEach((o) => {
        o.x += o.dx;
        o.y += o.dy;
        if (o.x < -o.r || o.x > canvas.width + o.r) o.dx *= -1;
        if (o.y < -o.r || o.y > canvas.height + o.r) o.dy *= -1;

        const gradient = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
        gradient.addColorStop(0, `rgba(239, 116, 92, ${o.alpha})`);
        gradient.addColorStop(0.4, `rgba(239, 116, 92, ${o.alpha * 0.5})`);
        gradient.addColorStop(1, "rgba(239, 116, 92, 0)");

        ctx.fillStyle = gradient;
        ctx.fillRect(o.x - o.r, o.y - o.r, o.r * 2, o.r * 2);
      });

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
    />
  );
}
