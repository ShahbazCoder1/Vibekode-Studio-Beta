"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { AuthModal } from "@/components/Auth-model";
import BetaBadge from "@/components/Beta-badge";

interface HeaderProps {
  className?: string;
}

interface ScrollState {
  scrolled: boolean;
  isMobile: boolean;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  const [scrollState, setScrollState] = useState<ScrollState>({
    scrolled: false,
    isMobile: false,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Initial mobile check
    const checkMobile = (): boolean => window.innerWidth < 768;

    setScrollState((prev) => ({
      ...prev,
      isMobile: checkMobile(),
    }));

    const handleScroll = (): void => {
      const isScrolled = window.scrollY > 10;
      setScrollState((prev) => ({
        ...prev,
        scrolled: isScrolled,
      }));
    };

    const handleResize = (): void => {
      setScrollState((prev) => ({
        ...prev,
        isMobile: checkMobile(),
      }));
    };

    // Add event listeners with passive option for performance
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });

    // Initial scroll check
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const { scrolled, isMobile } = scrollState;

  return (
    <header
      className={cn(
        "fixed left-0 right-0 z-50 w-full transition-all duration-300",
        // When not scrolled, position below banner (top-10). When scrolled, move to top (top-0)
        scrolled ? "top-0" : "top-10",
        scrolled
          ? "bg-zinc-900/80 backdrop-blur-md shadow-md border-b border-zinc-800/50"
          : "bg-transparent border-b border-transparent",
        className
      )}
    >
      <div className="container mx-auto flex h-14 md:h-16 items-center justify-between px-4 md:px-6">
        {/* Logo Section */}
        <LogoSection isMobile={isMobile} />

        {/* Authentication Section */}
        <AuthSection isMobile={isMobile} />
      </div>
    </header>
  );
};

interface LogoSectionProps {
  isMobile: boolean;
}

const LogoSection: React.FC<LogoSectionProps> = ({ isMobile }) => {
  return (
    <div className="flex items-center space-x-2 md:space-x-3">
      <div className="h-7 w-7 md:h-10 md:w-10 relative">
        <Image
          src="/logo.png"
          alt="VibeKode Studio Logo"
          width={isMobile ? 28 : 40}
          height={isMobile ? 28 : 40}
          className="object-contain rounded-full"
          priority
        />
      </div>
      <div className="flex items-center gap-1.5 min-w-0">
        <span
          className={cn(
            "font-bold text-transparent bg-clip-text bg-gradient-to-r",
            "from-[#00ccb1] via-[#7b61ff] to-[#1ca0fb]",
            "dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r",
            "dark:from-[#00ccb1] dark:via-[#7b61ff] dark:to-[#1ca0fb]",
            "text-base md:text-xl whitespace-nowrap"
          )}
        >
          VibeKode
        </span>
        <BetaBadge />
      </div>
    </div>
  );
};

interface AuthSectionProps {
  isMobile: boolean;
}

const AuthSection: React.FC<AuthSectionProps> = ({ isMobile }) => {
  return (
    <div className="flex items-center gap-2 md:gap-3">
      {/* Sign In Button */}
      <AuthModal
        mode="signin"
        triggerClassName={cn(
          // Responsive height and padding
          "h-8 sm:h-9 md:h-10",
          "px-3 sm:px-4 md:px-6",
          "py-1 sm:py-1.5 md:py-2",

          // Border and colors
          "rounded-md md:rounded-lg",
          "border border-blue-500/60 hover:border-blue-400",
          "bg-[#141414] hover:bg-blue-500/5",

          // Text styling
          "text-blue-400 hover:text-blue-300",
          "font-medium",
          "text-xs sm:text-sm md:text-base",

          // Layout and transitions
          "flex items-center justify-center",
          "transition-all duration-200 ease-in-out",
          "whitespace-nowrap",

          // Focus states
          "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2",
          "focus:ring-offset-zinc-900"
        )}
        triggerText={isMobile ? "Sign In" : "Sign In"}
      />

      {/* Sign Up Button with Hover Border Gradient */}
      <HoverBorderGradient
        containerClassName="rounded-md md:rounded-lg"
        className={cn(
          // Responsive sizing
          "h-8 sm:h-9 md:h-10",
          "px-3 sm:px-4 md:px-6",
          "py-1 sm:py-1.5 md:py-2",

          // Background and styling
          "bg-gradient-to-r from-zinc-800 to-zinc-900",
          "hover:from-zinc-700 hover:to-zinc-800",
          "text-white",
          "rounded-md md:rounded-lg",
          "border-0",

          // Text styling
          "font-medium",
          "text-xs sm:text-sm md:text-base",

          // Layout
          "flex items-center justify-center",
          "transition-all duration-200 ease-in-out",
          "whitespace-nowrap"
        )}
        duration={3}
        clockwise={true}
        as="div"
      >
        <AuthModal
          mode="signup"
          triggerClassName={cn(
            // Reset all default button styles
            "bg-transparent border-0 p-0 m-0",
            "h-full w-full",

            // Text styling
            "text-white font-medium",
            "text-xs sm:text-sm md:text-base",

            // Layout
            "flex items-center justify-center",
            "hover:bg-transparent",
            "focus:outline-none",
            "whitespace-nowrap",

            // Transitions
            "transition-all duration-200 ease-in-out"
          )}
          triggerText={isMobile ? "Sign Up" : "Sign Up"}
        />
      </HoverBorderGradient>
    </div>
  );
};

export default Header;
export type { HeaderProps };