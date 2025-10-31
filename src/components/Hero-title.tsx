"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface WordConfig {
  text: string;
  className?: string;
}

interface HeroTitleProps {
  className?: string;
  cursorClassName?: string;
}

const words: WordConfig[] = [
  { text: "Build" },
  { text: "your" },
  { text: "next" },
  { text: "idea" },
  {
    text: "faster",
    className:
      "text-transparent bg-clip-text bg-gradient-to-r from-[#00ccb1] via-[#7b61ff] to-[#1ca0fb] animate-gradient",
  },
];

// Define animation variants for cleaner, more scalable animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.05, 
    },
  },
};

const wordVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 12,
      stiffness: 100,
    },
  },
};

const charVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.03,
      ease: "easeInOut",
    },
  },
};

const HeroTitle: React.FC<HeroTitleProps> = ({ className = "", cursorClassName }) => {
  return (
    <div className={cn("w-full text-center pt-0 mt-0 mb-10 px-4 relative", className)}>
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="inline-block"
        >
          {words.map((word, wi) => (
            <motion.span
              key={wi}
              variants={wordVariants}
              // This is the line that was changed from `mr-2` to `mr-4`
              className="inline-block mr-2 md:mr-4"
            >
              {word.text.split("").map((char, ci) => (
                <motion.span
                  key={`${wi}-${ci}`}
                  variants={charVariants}
                  className={cn("inline-block", word.className)}
                >
                  {char}
                </motion.span>
              ))}
            </motion.span>
          ))}

          {/* Blinking Cursor */}
          <AnimatePresence>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className={cn(
                "inline-block w-[3px] sm:w-[4px] h-6 sm:h-8 bg-gradient-to-b from-[#00ccb1] via-[#7b61ff] to-[#1ca0fb] align-middle ml-1 rounded-sm",
                cursorClassName
              )}
            ></motion.span>
          </AnimatePresence>
        </motion.div>
      </h1>

      <p className="max-w-[50ch] mx-auto text-white/70 text-base sm:text-lg md:text-xl leading-relaxed">
        From idea to code in seconds, with your personal AI assistant.
      </p>

      <style jsx global>{`
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default HeroTitle;