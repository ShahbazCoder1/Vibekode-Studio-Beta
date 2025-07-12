// src/components/ui/SmoothScroll.tsx
"use client";

import React, { useEffect, useRef, ReactNode } from 'react';
import Lenis from '@studio-freight/lenis';

interface SmoothScrollingProps {
  children: ReactNode;
}

function SmoothScrolling({ children }: SmoothScrollingProps) {
  const lenisInstance = useRef<Lenis | null>(null);

  useEffect(() => {
    lenisInstance.current = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: true,
      lerp: 0.08, // Increased lerp value for better responsiveness
      wheelMultiplier: 1, // Adjusted for a more natural feel
    });

    function raf(time: DOMHighResTimeStamp) {
      if (lenisInstance.current) {
        lenisInstance.current.raf(time);
      }
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      if (lenisInstance.current) {
        lenisInstance.current.destroy();
      }
    };
  }, []);

  return (
    <div>
      {children}
    </div>
  );
}

export default SmoothScrolling;