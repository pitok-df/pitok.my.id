"use client";

import { useEffect, useRef } from "react";

export default function ParticlesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let isIntersecting = false;
    let running = false;

    // Scale particle count based on screen area to ensure smooth density across viewport sizes
    const getParticleCount = (w: number, h: number) => {
      return Math.min(45, Math.floor((w * h) / 25000));
    };

    let particlesCount = 0;
    let particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
    }[] = [];

    const createParticle = () => {
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4, // slow horizontal speed
        vy: (Math.random() - 0.5) * 0.4, // slow vertical speed
        size: Math.random() * 2 + 1.5, // 1.5px to 3.5px pixel sizes
        alpha: Math.random() * 0.3 + 0.15,
      };
    };

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < particlesCount; i++) {
        particles.push(createParticle());
      }
    };

    // ResizeObserver ensures canvas width/height is accurately set on mount and window changes
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        // Use clientWidth/clientHeight or bounding rect to guarantee layout dimensions
        const newWidth = Math.floor(
          canvas.clientWidth || entry.contentRect.width,
        );
        const newHeight = Math.floor(
          canvas.clientHeight || entry.contentRect.height,
        );

        if (
          newWidth > 0 &&
          newHeight > 0 &&
          (newWidth !== width || newHeight !== height)
        ) {
          width = canvas.width = newWidth;
          height = canvas.height = newHeight;
          particlesCount = getParticleCount(width, height);
          initParticles();

          // Re-trigger render loop if in view
          if (isIntersecting && !running) {
            render();
          }
        }
      }
    });

    resizeObserver.observe(canvas);

    // Mouse positions relative to the section element
    const mouse = { x: -1000, y: -1000, active: false };
    const parent = canvas.parentElement;

    const handleMouseMove = (e: MouseEvent) => {
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      // Calculate coordinates relative to parent (which matches canvas size & position)
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    if (parent) {
      parent.addEventListener("mousemove", handleMouseMove, { passive: true });
      parent.addEventListener("mouseleave", handleMouseLeave, {
        passive: true,
      });
    }

    const render = () => {
      if (!isIntersecting || width === 0 || height === 0) {
        running = false;
        return;
      }
      running = true;
      ctx.clearRect(0, 0, width, height);

      // Get current theme accent color dynamically
      const accentColor =
        getComputedStyle(document.documentElement)
          .getPropertyValue("--accent")
          .trim() || "#ff2d55";

      // Dynamically detect theme to increase contrast on light backgrounds
      const isLightMode = document.documentElement.classList.contains("light");
      const opacityMultiplier = isLightMode ? 2.5 : 1.0;

      ctx.fillStyle = accentColor;
      ctx.lineWidth = 0.8;

      // Draw lines between particles (Constellation grid)
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Connect particles close to each other
          if (dist < 90) {
            ctx.strokeStyle = accentColor;
            ctx.globalAlpha = Math.min(
              0.85,
              (1 - dist / 90) * 0.15 * opacityMultiplier,
            );
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }

        // Draw connections to the mouse cursor
        if (mouse.active) {
          const dx = p1.x - mouse.x;
          const dy = p1.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.strokeStyle = accentColor;
            ctx.globalAlpha = Math.min(
              0.9,
              (1 - dist / 120) * 0.26 * opacityMultiplier,
            );
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      }

      // Draw and update particle positions
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        ctx.globalAlpha = Math.min(0.95, p.alpha * opacityMultiplier);

        // Draw pixel squares to match retro CLI theme
        ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);

        // Update positions
        p.x += p.vx;
        p.y += p.vy;

        // Bounce back from horizontal bounds
        if (p.x < 0) {
          p.x = 0;
          p.vx *= -1;
        } else if (p.x > width) {
          p.x = width;
          p.vx *= -1;
        }

        // Bounce back from vertical bounds
        if (p.y < 0) {
          p.y = 0;
          p.vy *= -1;
        } else if (p.y > height) {
          p.y = height;
          p.vy *= -1;
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isIntersecting = entry.isIntersecting;
        if (isIntersecting && !running) {
          render();
        }
      },
      { threshold: 0.01 },
    );

    observer.observe(canvas);

    return () => {
      resizeObserver.disconnect();
      if (parent) {
        parent.removeEventListener("mousemove", handleMouseMove);
        parent.removeEventListener("mouseleave", handleMouseLeave);
      }
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
        opacity: 0.8, // Increased for clearer contrast
      }}
    />
  );
}
