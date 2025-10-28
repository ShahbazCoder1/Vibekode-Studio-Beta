"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion"; // Import Variants
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils"; // Assumes you have a `cn` utility

interface BetaBadgeProps {
  className?: string;
}

const texts = ["BETA"];

// Variants for the sparkle icon's subtle pulse animation
const sparkleVariants: Variants = { // Typed as Variants
  pulse: {
    scale: [1, 1.1, 1],
    opacity: [0.9, 1, 0.9],
    transition: {
      duration: 1.5,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "reverse", // This is now correctly typed
    },
  },
};

// Variants for the text to make the fade and slide smoother
const textVariants: Variants = { // Typed as Variants
  enter: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      damping: 10,
      stiffness: 100,
    },
  },
  exit: {
    y: -15,
    opacity: 0,
    position: "absolute", // This is now correctly typed
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    },
  },
};

// Variants for the initial badge appearance animation
const badgeVariants: Variants = { // Typed as Variants
  hidden: { opacity: 0, scale: 0.8, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 12,
      stiffness: 100,
      delay: 0.1,
    },
  },
};

/**
 * A sub-component to handle the animated text.
 * This separation makes the component more modular and readable.
 */
const AnimatedText: React.FC<{ text: string }> = ({ text }) => {
  return (
    <motion.span
      key={text}
      initial="exit"
      animate="enter"
      exit="exit"
      variants={textVariants} // This now correctly matches the Variants type
      className={cn(
        "block whitespace-nowrap uppercase text-white",
        "text-[11px] tracking-wide sm:text-xs sm:tracking-wider",
        "font-bold"
      )}
      // Add a subtle text shadow for better contrast against the gradient
      style={{
        textShadow: "0 1px 3px rgba(0, 0, 0, 0.2)",
      }}
    >
      {text}
    </motion.span>
  );
};

const BetaBadge: React.FC<BetaBadgeProps> = ({ className }) => {
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    // Only set an interval if there is more than one text string
    if (texts.length > 1) {
      const interval = setInterval(() => {
        setTextIndex((prev) => (prev + 1) % texts.length);
      }, 3000); // Cycle every 3 seconds
      return () => clearInterval(interval);
    }
  }, []);

  return (
    <motion.div
      variants={badgeVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        // --- CORE LAYOUT & SIZING ---
        "inline-flex select-none items-center gap-1.5 rounded-full px-2.5 py-1 mr-2",
        "sm:gap-2 sm:px-3 sm:py-1.5",
        "relative overflow-hidden", // Necessary for clean text animation exit

        // --- STYLING & AESTHETICS ---
        "font-semibold",
        "bg-gradient-to-r from-teal-400 to-sky-500",
        "shadow-[0_0_20px_rgba(0,204,177,0.25)]",
        "border border-white/20",
        className
      )}
      // Add a subtle focus state for accessibility
      tabIndex={0}
    >
      <motion.div variants={sparkleVariants} animate="pulse">
        <Sparkles
          className={cn(
            "flex-shrink-0 text-white/90",
            "h-3 w-3 sm:h-4 sm:w-4"
          )}
        />
      </motion.div>

      <div className="relative flex items-center justify-center">
        <AnimatePresence initial={false} mode="wait">
          <AnimatedText text={texts[textIndex]} />
        </AnimatePresence>
      </div>

      {/* Accessibility enhancement for screen readers */}
      <span className="sr-only" aria-live="polite">
        Product is in Beta.
      </span>
    </motion.div>
  );
};

export default BetaBadge;
export type { BetaBadgeProps };