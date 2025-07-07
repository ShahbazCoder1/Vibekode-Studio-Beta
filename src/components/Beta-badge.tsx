"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface BetaBadgeProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const texts = ["BETA", "100% FREE"];

const BetaBadge: React.FC<BetaBadgeProps> = ({
  className,
  size = "md",
}) => {
  const [textIndex, setTextIndex] = useState(0);

  // Effect to cycle through the texts every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-2.5 py-1 text-xs",
    lg: "px-3 py-1.5 text-sm",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-3 h-3",
    lg: "w-3.5 h-3.5",
  };

  // Fixed width container for text to prevent badge resizing
  const textContainerWidth = {
    sm: "w-[4rem]",
    md: "w-[4.5rem]",
    lg: "w-[5.5rem]",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: 0.2, 
        ease: [0.23, 1, 0.32, 1] // Custom easing for smoother animation
      }}
      whileHover={{ 
        scale: 1.02,
      }}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-semibold",
        "bg-gradient-to-r from-[#00ccb1] to-[#1ca0fb]",
        "text-white",
        "border border-white/20",
        "relative overflow-hidden",
        "cursor-default select-none",
        sizeClasses[size],
        className
      )}
      style={{
        boxShadow: "0 0 10px rgba(0, 204, 177, 0.3)",
      }}
    >
      {/* Subtle sparkles animation */}
      <Sparkles 
        className={cn(
          "flex-shrink-0 z-10 relative animate-pulse", 
          iconSizes[size]
        )} 
      />

      {/* Container to hold the animated text and maintain a consistent width */}
      <div className={cn(
        "relative flex items-center justify-center z-10", 
        textContainerWidth[size]
      )}>
        <AnimatePresence mode="wait">
          <motion.span
            key={textIndex}
            initial={{ y: -15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 15, opacity: 0 }}
            transition={{ 
              duration: 0.3, 
              ease: "easeInOut"
            }}
            className="absolute whitespace-nowrap"
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