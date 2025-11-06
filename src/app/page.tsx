"use client";

import React, { useEffect } from "react";
import { AuroraBackground } from "@/components/ui/aurora-background";
import Header from "@/components/Header";
import HeroTitle from "@/components/Hero-title";
import PromptBox from "@/components/Prompt-Box";
import ScrollDown from "@/components/Scroll-Down";
import CommunityProject from "@/components/Community-Project";
import PersistentBetaBanner   from "@/components/ScrollingBetaBanner";
import { Footer } from "@/components/Footer";
import SmoothScroll from "@/components/ui/SmoothScroll";

export default function Home() {

  useEffect(() => {
    fetch("https://keypulse-8238.onrender.com/stats").catch(() => {});
  }, []);


  return (
    <SmoothScroll>
      <div>
        <PersistentBetaBanner  />
        <AuroraBackground>
          <div className="relative z-10 flex h-[calc(100vh-3rem)] md:h-[calc(100vh-2rem)] flex-col items-center justify-start pt-10 md:pt-4 pb-28 md:pb-3">
            <Header />
            <div className="flex w-full flex-grow flex-col items-center justify-center">
              <HeroTitle />
              <PromptBox
                containerClassName="flex items-center justify-center w-full max-w-[calc(100vw-1rem)] sm:max-w-[calc(100vw-2rem)] px-2 sm:px-4"
              />
            </div>
            <ScrollDown text="Scroll to explore more" />
          </div>
        </AuroraBackground>

        <div id="community-showcase" className="bg-[#18181b]">
          <CommunityProject />
        </div>
        <Footer />
      </div>
    </SmoothScroll>
  );
}