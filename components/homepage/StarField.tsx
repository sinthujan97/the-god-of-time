"use client";

import React, { useEffect, useRef } from "react";

type Star = {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  twinkleSpeed: number;
  twinkleOffset: number;
  parallaxDepth: number;
};

export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const scrollYRef = useRef<number>(0);
  const isDarkRef = useRef<boolean>(true);
  const animationFrameIdRef = useRef<number | null>(null);

  useEffect(() => {
    // 1. Check for prefers-reduced-motion
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // 2. Defer canvas initialization to avoid blocking LCP (Largest Contentful Paint)
    const initTimer = setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // 3. Set initial theme color setting
      const checkTheme = () => {
        const isDark = document.documentElement.classList.contains("dark") || 
                       !document.documentElement.classList.contains("light");
        isDarkRef.current = isDark;
      };
      checkTheme();

      // 4. MutationObserver to watch theme switch on HTML element
      const observer = new MutationObserver(() => {
        checkTheme();
      });
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      });

      // 5. Setup dimensions & generate stars
      const handleResize = () => {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        generateStars(canvas.width, canvas.height);
      };

      const generateStars = (width: number, height: number) => {
        const count = 200;
        const generated: Star[] = [];
        for (let i = 0; i < count; i++) {
          generated.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: 0.3 + Math.random() * 1.5,
            opacity: 0.2 + Math.random() * 0.7,
            twinkleSpeed: 0.003 + Math.random() * 0.005,
            twinkleOffset: Math.random() * Math.PI * 2,
            parallaxDepth: 0.1 + Math.random() * 0.4,
          });
        }
        starsRef.current = generated;
      };

      // Set canvas size initially and generate
      handleResize();

      // Debounced resize handler (200ms)
      let resizeTimeout: NodeJS.Timeout;
      const onResize = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          handleResize();
        }, 200);
      };
      window.addEventListener("resize", onResize);

      // Passive scroll listener for parallax calculations
      const onScroll = () => {
        scrollYRef.current = window.scrollY;
      };
      window.addEventListener("scroll", onScroll, { passive: true });

      // 6. Draw loop (RAF)
      const render = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const isDark = isDarkRef.current;
        const scrollY = scrollYRef.current;
        const stars = starsRef.current;

        for (let i = 0; i < stars.length; i++) {
          const star = stars[i];

          // Compute y coordinate with scroll parallax offset
          const yOffset = prefersReduced ? 0 : scrollY * star.parallaxDepth * 0.03;
          let y = star.y - yOffset;

          // Wrap stars around vertically when scrolled out of viewport
          if (y < 0) {
            y = (y % canvas.height) + canvas.height;
          } else if (y > canvas.height) {
            y = y % canvas.height;
          }

          // Twinkle formula (opacity shifts with time via sine function)
          const currentOpacity = prefersReduced
            ? star.opacity
            : star.opacity * (0.6 + 0.4 * Math.sin(Date.now() * star.twinkleSpeed + star.twinkleOffset));

          // Draw circle
          ctx.beginPath();
          ctx.arc(star.x, y, star.radius, 0, Math.PI * 2);
          if (isDark) {
            ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity})`;
          } else {
            ctx.fillStyle = `rgba(26, 26, 46, ${currentOpacity * 0.6})`;
          }
          ctx.fill();
        }

        if (!prefersReduced) {
          animationFrameIdRef.current = requestAnimationFrame(render);
        }
      };

      // Start loop
      if (prefersReduced) {
        render(); // static draw once
      } else {
        render();
      }

      // Cleanup context bindings
      return () => {
        clearTimeout(resizeTimeout);
        window.removeEventListener("resize", onResize);
        window.removeEventListener("scroll", onScroll);
        observer.disconnect();
        if (animationFrameIdRef.current) {
          cancelAnimationFrame(animationFrameIdRef.current);
        }
      };
    }, 100);

    return () => {
      clearTimeout(initTimer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full pointer-events-none select-none z-0"
      style={{ opacity: 0.85 }}
    />
  );
}
