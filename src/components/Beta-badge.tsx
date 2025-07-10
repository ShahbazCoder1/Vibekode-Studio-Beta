"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils"; // Assumes you have a `cn` utility

interface BetaBadgeProps {
  className?: string;
}

const texts = ["BETA"];

const BetaBadge: React.FC<BetaBadgeProps> = ({ className }) => {
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % texts.length);
    }, 3000); // Cycle every 3 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1], delay: 0.2 }}
      className={cn(
        // --- CORE LAYOUT & SIZING ---
        // Base size for mobile
        "inline-flex select-none items-center gap-1.5 rounded-full px-2.5 py-1 mr-2",
        // Scale up for larger screens (sm and above)
        "sm:gap-2 sm:px-3 sm:py-1.5",

        // --- STYLING & AESTHETICS ---
        "font-semibold",
        // A slightly more vibrant gradient
        "bg-gradient-to-r from-teal-400 to-sky-500",
        // A soft, elegant glow
        "shadow-[0_0_20px_rgba(0,204,177,0.25)]",
        "border border-white/20",
        className
      )}
    >
      <Sparkles
        className={cn(
          "flex-shrink-0 text-white/90",
          // Responsive icon size
          "h-3 w-3 sm:h-4 sm:w-4"
        )}
      />

      <div className="relative flex items-center justify-center">
        <AnimatePresence initial={false} mode="wait">
          <motion.span
            key={texts[textIndex]}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 10, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={cn(
              "block whitespace-nowrap uppercase text-white",
              // Responsive text size
              "text-[11px] tracking-wide sm:text-xs sm:tracking-wider"
            )}
            // Add a subtle shadow to make white text pop professionally
            style={{
              textShadow: "0 1px 2px rgba(0, 0, 0, 0.15)",
            }}
          >
            {texts[textIndex]}
          </motion.span>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default BetaBadge;
export type { BetaBadgeProps };