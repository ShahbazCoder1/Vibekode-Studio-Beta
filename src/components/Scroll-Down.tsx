"use client";

import React from "react";
import { motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScrollDownProps {
  className?: string;
  onClick?: () => void;
  targetId?: string;
  text?: string;
}

const ScrollDown: React.FC<ScrollDownProps> = ({
  className,
  onClick,
  targetId,
  text = "Scroll to explore",
}) => {
  const handleClick = (): void => {
    if (onClick) {
      onClick();
    } else if (targetId) {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      // Default scroll down behavior
      window.scrollBy({ top: window.innerHeight, behavior: "smooth" });
    }
  };

  return (
    <div
      className={cn(
        "absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2",
        "flex flex-col items-center gap-1 sm:gap-2",
        className
      )}
    >
      {/* Text with fade animation */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3, duration: 0.8 }}
        className="text-white/50 text-xs font-medium tracking-wide"
      >
        {text}
      </motion.p>

      {/* Animated scroll button */}
      <motion.button
        onClick={handleClick}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3.5, duration: 0.8 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          "group relative",
          "w-8 h-12 sm:w-10 sm:h-14",
          "border border-white/15 rounded-full",
          "bg-black/20 backdrop-blur-sm",
          "hover:border-white/25 hover:bg-black/30",
          "transition-all duration-300",
          "focus:outline-none focus:ring-1 focus:ring-white/20"
        )}
      >
        {/* Animated dot inside the scroll indicator */}
        <motion.div
          animate={{
            y: [0, 6, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className={cn(
            "absolute top-2 left-1/2 transform -translate-x-1/2",
            "w-0.5 h-2 sm:w-1 sm:h-3",
            "bg-gradient-to-b from-[#00ccb1] to-[#1ca0fb]",
            "rounded-full",
            "group-hover:from-[#7b61ff] group-hover:to-[#00ccb1]",
            "transition-all duration-300"
          )}
        />

        {/* Animated chevron icon */}
        <motion.div
          animate={{
            y: [0, 3, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
          className="absolute bottom-1.5 left-1/2 transform -translate-x-1/2"
        >
          <ChevronDown
            className={cn(
              "w-3 h-3 sm:w-4 sm:h-4",
              "text-white/50 group-hover:text-white/70",
              "transition-colors duration-300"
            )}
          />
        </motion.div>

        {/* Hover effect background */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          whileHover={{ scale: 1, opacity: 0.05 }}
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
          scale: [1, 1.1, 1],
          opacity: [0.2, 0, 0.2],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className={cn(
          "absolute top-5 sm:top-6",
          "w-8 h-12 sm:w-10 sm:h-14",
          "border border-white/10 rounded-full",
          "pointer-events-none"
        )}
      />
    </div>
  );
};

export default ScrollDown;
export type { ScrollDownProps };
