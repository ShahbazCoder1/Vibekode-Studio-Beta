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
        "absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2",
        "flex flex-col items-center gap-1 sm:gap-2",
        className
      )}
    >
      {/* Text with fade-in animation */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3, duration: 0.8, ease: "easeInOut" }}
        className="text-white/50 text-xs font-medium tracking-wide pointer-events-none"
      >
        {text}
      </motion.p>

      {/* Animated scroll button */}
      <motion.button
        onClick={handleClick}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3.5, duration: 0.8, ease: "easeInOut" }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={text}
        className={cn(
          "group relative",
          "w-9 h-14 sm:w-10 sm:h-16",
          "border-2 border-white/20 rounded-full",
          "bg-black/10 backdrop-blur-sm",
          "hover:border-white/40 hover:bg-black/20",
          "transition-all duration-300",
          "focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent",
          isPulsing && "animate-pulse"
        )}
      >
        {/* Animated dot inside the scroll indicator */}
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className={cn(
            "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
            "w-1 h-3.5 sm:w-1.5 sm:h-4",
            "bg-gradient-to-b from-[#00ccb1] to-[#1ca0fb]",
            "rounded-full",
            "group-hover:from-[#7b61ff] group-hover:to-[#00ccb1]",
            "transition-all duration-300"
          )}
        />

        {/* Animated chevron icon */}
        <motion.div
          animate={{ y: [0, 3, 0] }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
          className="absolute bottom-2 left-1/2 -translate-x-1/2"
        >
          <ChevronDown
            className={cn(
              "w-4 h-4 sm:w-5 sm:h-5",
              "text-white/60 group-hover:text-white/80",
              "transition-colors duration-300"
            )}
          />
        </motion.div>

        {/* Hover effect background */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          whileHover={{ scale: 1, opacity: 0.08 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "absolute inset-0 rounded-full",
            "bg-gradient-to-b from-[#00ccb1] to-[#1ca0fb]"
          )}
        />
      </motion.button>

      {/* Pulsing ring animation */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0, 0.2],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className={cn(
          "absolute top-5 sm:top-6",
          "w-9 h-14 sm:w-10 sm:h-16",
          "border-2 border-white/10 rounded-full",
          "pointer-events-none"
        )}
      />
    </div>
  );
};

export default ScrollDown;
