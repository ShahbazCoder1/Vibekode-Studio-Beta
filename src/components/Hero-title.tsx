"use client";

import React from "react";
import { TypewriterEffect } from "@/components/ui/typewriter-effect";

interface HeroTitleProps {
  className?: string;
}

interface WordConfig {
  text: string;
  className?: string;
}

const HeroTitle: React.FC<HeroTitleProps> = ({ className = "" }) => {
  // Define the words with proper TypeScript typing
  const words: WordConfig[] = [
    { text: "Build" },
    { text: "something" },
    { text: "amazing" },
    { text: "with" },
    {
      text: "VibeKode",
      className:
        "text-transparent bg-clip-text bg-gradient-to-r from-[#00ccb1] via-[#7b61ff] to-[#1ca0fb] dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-[#00ccb1] dark:via-[#7b61ff] dark:to-[#1ca0fb]",
    },
  ];

  return (
    <div className={`w-full max-w-[calc(100vw-2rem)] mx-auto mt-0 md:mt-13 mb-10 px-4 text-center ${className}`}>
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-4">
        <TypewriterEffect
          words={words}
          cursorClassName="inline-block w-[3px] h-5 sm:h-6 md:h-8 bg-gradient-to-r from-[#00ccb1] via-[#7b61ff] to-[#1ca0fb] ml-1"
        />
      </h1>

      <p className="max-w-[50ch] mx-auto text-sm sm:text-base md:text-lg lg:text-xl text-white/80 leading-relaxed">
        From idea to code in seconds, with your personal AI assistant
      </p>
    </div>
  );
};

export default HeroTitle;
export type { HeroTitleProps, WordConfig };
