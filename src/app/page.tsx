import React from "react";
import { AuroraBackground } from "@/components/ui/aurora-background";
import Header from "@/components/Header";
import HeroTitle from "@/components/Hero-title";
import PromptBox from "@/components/Prompt-Box";
import ScrollDown from "@/components/Scroll-Down";
import CommunityProject from "@/components/Community-Project";
import ScrollingBetaBanner from "@/components/ScrollingBetaBanner";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div>
      <ScrollingBetaBanner/>
      <AuroraBackground>
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-6.5rem)] md:min-h-[calc(100vh-2rem)] relative pt-16 md:pt-4">
          <HeroTitle />
          <PromptBox
            placeholder="Ask VibeKode to create something amazing..."
            containerClassName="flex items-center justify-center w-full max-w-[calc(100vw-1rem)] sm:max-w-[calc(100vw-2rem)] px-2 sm:px-4"
          />
          <ScrollDown text="Scroll to explore more" />
        </div>
      </AuroraBackground>

      <div id="community-showcase" className="bg-[#18181b]">
        <CommunityProject />
      </div>
      <Footer />
    </div>
  );
}
