"use client";

import { useEffect, useRef } from "react";

export default function Background3D({ variant = "particles" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    let mouseX = 0;
    let mouseY = 0;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouse = (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouse);

    if (variant === "particles") {
      const count = 80;
      const particles = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * 200,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
      }));

      const animate = () => {
        time += 0.005;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const sorted = [...particles].sort((a, b) => a.z - b.z);

        sorted.forEach((p) => {
          p.x += p.speedX + mouseX * 0.2;
          p.y += p.speedY + mouseY * 0.2;
          p.z += Math.sin(time + p.x * 0.01) * 0.3;

          if (p.x < 0) p.x = canvas.width;
          if (p.x > canvas.width) p.x = 0;
          if (p.y < 0) p.y = canvas.height;
          if (p.y > canvas.height) p.y = 0;

          const scale = 200 / (200 + p.z);
          const size = p.size * scale;
          const opacity = Math.max(0.1, 0.4 * scale);
          const x3d = (p.x - canvas.width / 2) * scale + canvas.width / 2;
          const y3d = (p.y - canvas.height / 2) * scale + canvas.height / 2;

          ctx.beginPath();
          ctx.arc(x3d, y3d, size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
          ctx.fill();
        });

        // connections
        for (let i = 0; i < sorted.length; i++) {
          for (let j = i + 1; j < sorted.length; j++) {
            const dx = sorted[i].x - sorted[j].x;
            const dy = sorted[i].y - sorted[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
              ctx.beginPath();
              ctx.moveTo(
                (sorted[i].x - canvas.width / 2) * (200 / (200 + sorted[i].z)) + canvas.width / 2,
                (sorted[i].y - canvas.height / 2) * (200 / (200 + sorted[i].z)) + canvas.height / 2
              );
              ctx.lineTo(
                (sorted[j].x - canvas.width / 2) * (200 / (200 + sorted[j].z)) + canvas.width / 2,
                (sorted[j].y - canvas.height / 2) * (200 / (200 + sorted[j].z)) + canvas.height / 2
              );
              ctx.strokeStyle = `rgba(255, 255, 255, ${0.04 * (1 - dist / 120)})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }

        animId = requestAnimationFrame(animate);
      };
      animate();
    } else {
      const gridSize = 40;
      const waveAnimate = () => {
        time += 0.02;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const cols = Math.ceil(canvas.width / gridSize) + 1;
        const rows = Math.ceil(canvas.height / gridSize) + 1;

        ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
        ctx.lineWidth = 0.5;

        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const x = c * gridSize;
            const y = r * gridSize;
            const offsetZ =
              Math.sin(x * 0.02 + time) * 15 +
              Math.sin(y * 0.02 + time * 0.7) * 10 +
              mouseX * 20;

            // lines to neighbors
            if (c < cols - 1) {
              const nx = (c + 1) * gridSize;
              const nz =
                Math.sin(nx * 0.02 + time) * 15 +
                Math.sin(y * 0.02 + time * 0.7) * 10 +
                mouseX * 20;
              ctx.beginPath();
              ctx.moveTo(x, y + offsetZ);
              ctx.lineTo(nx, y + nz);
              ctx.stroke();
            }
            if (r < rows - 1) {
              const ny = (r + 1) * gridSize;
              const nz =
                Math.sin(x * 0.02 + time) * 15 +
                Math.sin(ny * 0.02 + time * 0.7) * 10 +
                mouseX * 20;
              ctx.beginPath();
              ctx.moveTo(x, y + offsetZ);
              ctx.lineTo(x, ny + nz);
              ctx.stroke();
            }
          }
        }

        animId = requestAnimationFrame(waveAnimate);
      };
      waveAnimate();
    }

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
    };
  }, [variant]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  );
}
