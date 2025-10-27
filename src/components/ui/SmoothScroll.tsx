"use client";

import React, { useEffect, useRef, ReactNode } from 'react';
import Lenis from 'lenis';

interface SmoothScrollingProps {
  children: ReactNode;
}

function SmoothScrolling({ children }: SmoothScrollingProps) {
  const lenisInstance = useRef<Lenis | null>(null);

  useEffect(() => {
    // Check if the current screen width is below a certain threshold (e.g., 768px for typical mobile)
    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    if (!isMobile) {
      // Initialize Lenis only on non-mobile devices
      lenisInstance.current = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        syncTouch: true,
        lerp: 0.08, // Increased lerp value for better responsiveness
        wheelMultiplier: 1, // Adjusted for a more natural feel
        // smoothTouch: false, // You might explicitly set smoothTouch to false if needed, although it should be disabled on non-mobile implicitly here
        // touchMultiplier: 2, // You might adjust the touch multiplier for better responsiveness
      });

      // Request animation frame for Lenis only when initialized
      const raf = (time: DOMHighResTimeStamp) => {
        if (lenisInstance.current) {
          lenisInstance.current.raf(time);
        }
        requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);
    } else {
      // For mobile, ensure the scroll-behavior is set to auto or native
      document.documentElement.style.scrollBehavior = 'auto'; // Revert to native scrolling
    }

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