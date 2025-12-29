"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { HoverBorderGradient } from "./ui/hover-border-gradient";
import BetaBadge from "@/components/Beta-badge";

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleScroll = (): void => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>

      <header
        className={cn(
          "fixed left-0 right-0 z-50 w-full transition-all duration-300",
          isScrolled ? "top-0" : "top-10",
          isScrolled
            ? "bg-zinc-900/80 backdrop-blur-md shadow-md border-b border-zinc-800/50"
            : "bg-transparent border-b border-transparent",
          className
        )}
        aria-label="Main Navigation"
      >
        <div className="container mx-auto flex h-14 md:h-16 items-center justify-between px-4 md:px-6">
          {/* Logo Section */}
          <div className="flex items-center space-x-2 md:space-x-3">
            <Link href="/" aria-label="VibeKode Studio Home">
              <Image
                src="/logo.png"
                alt="VibeKode Studio Logo"
                width={40}
                height={40}
                className="h-7 w-7 md:h-10 md:w-10 object-contain rounded-full"
                priority
              />
            </Link>
            <Link
              href="/"
              className="flex items-center gap-1.5 min-w-0"
              aria-label="VibeKode Studio"
            >
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
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav
            className="hidden md:flex flex-grow justify-center"
            aria-label="Desktop navigation"
          >
            <ul className="flex items-center space-x-8">
              <li>
                <Link
                  href="/"
                  className="text-zinc-300 hover:text-white transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-zinc-300 hover:text-white transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/#community-showcase"
                  className="text-zinc-300 hover:text-white transition-colors"
                >
                  Community
                </Link>
              </li>
            </ul>
          </nav>

          {/* Authentication buttons - visible on all screen sizes */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Sign In Button */}
            <Link
              href="/login"
              className={cn(
                "h-8 sm:h-9 md:h-10 px-3 sm:px-4 md:px-6 py-1 sm:py-1.5 md:py-2",
                "rounded-md md:rounded-lg border border-blue-500/60 hover:border-blue-400",
                "bg-[#141414] hover:bg-blue-500/5",
                "text-blue-400 hover:text-blue-300 font-medium text-xs sm:text-sm md:text-base",
                "flex items-center justify-center transition-all duration-200 ease-in-out whitespace-nowrap",
                "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-zinc-900"
              )}
            >
              Login
            </Link>

            {/* Sign Up Button with Hover Border Gradient */}
            <HoverBorderGradient
              containerClassName="rounded-md md:rounded-lg"
              className={cn(
                "h-8 sm:h-9 md:h-10 px-3 sm:px-4 md:px-6 py-1 sm:py-1.5 md:py-2",
                "bg-gradient-to-r from-zinc-800 to-zinc-900",
                "text-white rounded-md md:rounded-lg border-0",
                "font-medium text-xs sm:text-sm md:text-base",
                "flex items-center justify-center transition-all duration-200 ease-in-out whitespace-nowrap"
              )}
              duration={3}
              clockwise
              as="div"
            >
              <Link
                href="/signup"
                className={cn(
                  "bg-transparent border-0 p-0 m-0 h-full w-full",
                  "text-white font-medium text-xs sm:text-sm md:text-base",
                  "flex items-center justify-center hover:bg-transparent focus:outline-none whitespace-nowrap",
                  "transition-all duration-200 ease-in-out"
                )}
              >
                Get Started
              </Link>
            </HoverBorderGradient>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
