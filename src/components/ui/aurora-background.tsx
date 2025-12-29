"use client";
import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  children: ReactNode;
  showRadialGradient?: boolean;
}

export const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
  ...props
}: AuroraBackgroundProps) => {
  return (
    <main>
      <div
        className={cn(
          "transition-bg relative flex h-[100vh] flex-col items-center justify-center bg-zinc-950 text-white",
          className,
        )}
        {...props}
      >
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={
            {
              // Updated Palette: Deep, rich brand colors to reduce eye strain while keeping the "Wow" factor.
              // Uses Deep Violet (#2e1065), Midnight Blue (#172554), and Dark Teal (#0f766e).
              "--aurora":
                "repeating-linear-gradient(100deg,#09090b_10%,#4c1d95_15%,#1e3a8a_20%,#0f766e_25%,#2e1065_30%)",
              "--dark-gradient":
                "repeating-linear-gradient(100deg,#000_0%,#000_7%,transparent_10%,transparent_12%,#000_16%)",
              "--white-gradient":
                "repeating-linear-gradient(100deg,#fff_0%,#fff_7%,transparent_10%,transparent_12%,#fff_16%)",
              "--primary": "#09090b", // Background match
              "--secondary": "#4c1d95", // Deep Brand Purple (Violet-900)
              "--accent1": "#1e3a8a", // Deep Brand Blue (Blue-900)
              "--accent2": "#0f766e", // Deep Teal (Teal-700) - Muted for comfort
              "--accent3": "#2e1065", // Darkest Violet (Violet-950)
              "--black": "#000",
              "--white": "#fff",
              "--transparent": "transparent",
            } as React.CSSProperties
          }
        >
          <div
            className={cn(
              // Reduced opacity from 50 to 30 for a subtle, premium ambient glow that doesn't distract
              `after:animate-aurora pointer-events-none absolute -inset-[10px] [background-image:var(--dark-gradient),var(--aurora)] [background-size:300%,_200%] [background-position:50%_50%,50%_50%] opacity-30 blur-[10px] invert-0 filter will-change-transform [--aurora:repeating-linear-gradient(100deg,var(--primary)_10%,var(--secondary)_15%,var(--accent1)_20%,var(--accent2)_25%,var(--accent3)_30%)] [--dark-gradient:repeating-linear-gradient(100deg,var(--black)_0%,var(--black)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--black)_16%)] [--white-gradient:repeating-linear-gradient(100deg,var(--white)_0%,var(--white)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--white)_16%)] after:absolute after:inset-0 after:[background-image:var(--dark-gradient),var(--aurora)] after:[background-size:200%,_100%] after:[background-attachment:fixed] after:mix-blend-difference after:content-[""]`,
              showRadialGradient &&
                `[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,var(--transparent)_70%)]`,
            )}
          ></div>
        </div>
        {children}
      </div>
    </main>
  );
};