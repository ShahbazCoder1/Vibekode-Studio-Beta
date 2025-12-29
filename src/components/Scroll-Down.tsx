"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import Lenis from 'lenis';

// Hook to detect Lenis availability and use its scroll function
const useLenisScroll = () => {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const lenisInstance = (window as unknown as { lenis?: Lenis }).lenis;
      if (lenisInstance) {
        setLenis(lenisInstance);
      }
    }
  }, []);

  const lenisScroll = useCallback(
    (target: HTMLElement | number | "next", options: { duration?: number }) => {
      if (lenis) {
        lenis.scrollTo(target, {
          duration: options.duration ?? 1.2,
          lerp: 0.075,
        });
      }
    },
    [lenis]
  );

  return { lenis, lenisScroll };
};

export interface ScrollDownProps {
  className?: string;
  targetId?: string;
  text?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  scrollDistance?: number;
}

const ScrollDown: React.FC<ScrollDownProps> = ({
  className,
  targetId,
  text = "Scroll to explore",
  onClick,
  scrollDistance,
}) => {
  const { lenis, lenisScroll } = useLenisScroll();
  const [isPulsing, setIsPulsing] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    if (onClick) {
      onClick(event);
      return;
    }

    if (lenis) {
      if (targetId) {
        const element = document.getElementById(targetId);
        if (element) lenisScroll(element, {});
      } else if (scrollDistance) {
        lenisScroll(scrollDistance, {});
      } else {
        lenisScroll("next", {});
      }
    } else if (targetId) {
      const element = document.getElementById(targetId);
      if (element) element.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollBy({
        top: scrollDistance ?? window.innerHeight,
        behavior: "smooth",
      });
    }

    setIsPulsing(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setIsPulsing(false), 1000);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div
      className={cn(
        "absolute bottom-8 left-1/2 -translate-x-1/2 z-20",
        "flex flex-col items-center gap-3",
        className
      )}
    >
      {/* Text with fade-in animation */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3, duration: 0.8, ease: "easeOut" }}
        className="text-zinc-400 text-[10px] uppercase tracking-[0.2em] font-medium pointer-events-none select-none whitespace-nowrap text-center"
      >
        {text}
      </motion.p>

      {/* Container for Button and Ring to ensure perfect stacking */}
      <div className="relative flex items-center justify-center">
        {/* Animated scroll button */}
        <motion.button
          onClick={handleClick}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.5, duration: 0.8, ease: "easeOut" }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label={text}
          className={cn(
            "relative z-10",
            "w-[34px] h-[54px] sm:w-[38px] sm:h-[60px]", // Refined sizing
            "border border-white/20 rounded-full",
            "bg-black/20 backdrop-blur-sm",
            "hover:border-white/40 hover:bg-black/30",
            "transition-all duration-500 ease-out",
            "cursor-pointer",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00ccb1] focus-visible:ring-offset-2 focus-visible:ring-offset-black",
            isPulsing && "animate-pulse"
          )}
        >
          {/* Animated dot inside the scroll indicator */}
          <motion.div
            animate={{ y: [0, 8, 0], opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className={cn(
              "absolute top-2 left-1/2 -translate-x-1/2",
              "w-1 h-2 sm:w-1.5 sm:h-2.5",
              "bg-gradient-to-b from-[#00ccb1] to-[#1ca0fb]",
              "rounded-full shadow-[0_0_8px_rgba(28,160,251,0.5)]"
            )}
          />

          {/* Animated chevron icon */}
          <motion.div
            animate={{ y: [0, 2, 0], opacity: [0.5, 1, 0.5] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.2,
            }}
            className="absolute bottom-1.5 left-1/2 -translate-x-1/2"
          >
            <ChevronDown
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/70"
              strokeWidth={2.5}
            />
          </motion.div>

          {/* Hover effect background fill */}
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 0.1 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 rounded-full bg-gradient-to-b from-[#00ccb1] via-[#7b61ff] to-[#1ca0fb]"
          />
        </motion.button>

        {/* Pulsing ring animation - Positioned absolutely to align with button */}
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0, 0.3, 0],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className={cn(
            "absolute inset-0 z-0",
            "w-full h-full",
            "border border-white/20 rounded-full",
            "pointer-events-none"
          )}
        />
      </div>
    </div>
  );
};

export default ScrollDown;