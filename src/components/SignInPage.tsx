"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { AuthModal } from "@/components/Auth-model";

// --- Right-Side Auto-Scrolling Showcase Panel ---
const ShowcasePanel = () => {
  const projectImages = [
    { name: "Tic Tac Toe Game", file: "tic-tac-toe.png", style: "dark" },
    {
      name: "My Tasks To-Do List",
      file: "todo-list-manager.png",
      style: "light",
    },
    {
      name: "Aria Sinclair Portfolio",
      file: "artist-portfolio.png",
      style: "dark",
    },
    { name: "SkyAcademy LMS", file: "lms-landing-page.png", style: "dark" },
    {
      name: "Pixel Art Paint App",
      file: "pixel-art-paint-app.png",
      style: "dark",
    },
  ];

  // Duplicate logic for seamless loop
  const slides = [...projectImages, ...projectImages];

  return (
    <aside className="relative hidden h-screen w-full overflow-hidden bg-zinc-950 border-l border-white/5 lg:block">
      {/* Ambient background glow */}
      <div className="absolute top-[-20%] right-[-10%] h-[500px] w-[500px] rounded-full bg-purple-500/10 blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-indigo-500/10 blur-[120px]" />

      {/* Top and Bottom Fade Masks */}
      <div className="absolute inset-x-0 top-0 z-20 h-32 bg-gradient-to-b from-zinc-950 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 z-20 h-32 bg-gradient-to-t from-zinc-950 to-transparent" />

      <div className="flex h-full items-center justify-center">
        {/* Framer Motion for guaranteed smooth scrolling */}
        <motion.div
          initial={{ y: 0 }}
          animate={{ y: "-50%" }}
          transition={{
            duration: 30,
            ease: "linear",
            repeat: Infinity,
            repeatType: "loop",
          }}
          className="flex flex-col gap-8 w-full max-w-xl px-8"
        >
          {slides.map((project, index) => (
            <div
              key={index}
              className={cn(
                "group relative w-full overflow-hidden rounded-2xl border border-white/5 bg-zinc-900/40 p-4 backdrop-blur-sm transition-all duration-500 hover:border-white/10 hover:bg-zinc-800/60",
                "shadow-2xl shadow-black/50"
              )}
            >
              {/* Card Header Dots (Browser look) */}
              <div className="mb-3 flex gap-1.5 opacity-40 group-hover:opacity-70 transition-opacity">
                <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
                <div className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
                <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
              </div>

              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-zinc-950">
                <Image
                  src={`/community/${project.file}`}
                  alt={`${project.name} Preview`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                {/* Inner Shadow for depth */}
                <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-lg" />
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </aside>
  );
};

// --- Left-Side Authentication Panel ---
const AuthPanel = () => {
  const [mode] = useState<"signup" | "signin">("signup");

  const FADE_IN_VARIANTS = {
    hidden: { opacity: 0, y: 10, filter: "blur(5px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { type: "spring", stiffness: 100, damping: 20 },
    },
  };

  return (
    <main className="relative flex h-full w-full flex-col items-center justify-center bg-zinc-950 p-8 text-white selection:bg-white/20">
      {/* Subtle Gradient Spotlights */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-[25%] -left-[10%] h-[50vh] w-[50vh] rounded-full bg-white/5 blur-[100px]" />
        <div className="absolute top-[30%] left-[20%] h-[30vh] w-[30vh] rounded-full bg-blue-500/5 blur-[80px]" />
      </div>

      <div className="relative z-10 w-full max-w-[360px]">
        <motion.div
          key={mode} // Triggers animation on mode switch
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.08 } },
          }}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center text-center"
        >
          {/* Logo with Glow */}
          <motion.div variants={FADE_IN_VARIANTS} className="relative mb-8">
            <div className="absolute inset-0 bg-white/20 blur-xl rounded-full" />
            <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-white/10 shadow-xl">
              <Image
                src="/logo.png"
                alt="VibeKode Logo"
                fill
                className="object-cover"
                priority
              />
            </div>
          </motion.div>

          <motion.h1
            variants={FADE_IN_VARIANTS}
            className="mb-3 text-3xl font-semibold tracking-tight text-white"
          >
            {mode === "signup" ? "Start creating today" : "Welcome back"}
          </motion.h1>

          <motion.p
            variants={FADE_IN_VARIANTS}
            className="mb-10 text-zinc-400 text-sm leading-relaxed max-w-[280px]"
          >
            {mode === "signup"
              ? "Join thousands of developers sharing their best work on VibeKode."
              : "Enter your credentials to access your projects and settings."}
          </motion.p>

          <motion.div variants={FADE_IN_VARIANTS} className="w-full">
            <div className="group relative rounded-xl bg-white p-0.5 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]">
              <AuthModal
                mode={mode}
                triggerText="Continue with Google"
                triggerClassName={cn(
                  "flex w-full items-center justify-center gap-3 rounded-[10px] bg-white px-4 py-3.5",
                  "text-sm font-medium text-zinc-950 transition-all duration-200",
                  "hover:bg-zinc-50 active:scale-[0.99]"
                )}
              />
            </div>
          </motion.div>

          <motion.div
            variants={FADE_IN_VARIANTS}
            className="mt-8 flex items-center gap-2 text-sm text-zinc-500"
          >
            {mode === "signup"
              ? "Already have an account?"
              : "Don't have an account?"}
            <Link
              href={mode === "signup" ? "/login" : "/signup"}
              className="font-medium text-white underline decoration-zinc-700 underline-offset-4 hover:decoration-white transition-all focus:outline-none"
            >
              {mode === "signup" ? "Sign in" : "Sign up"}
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Footer / Copyright */}
      <div className="absolute bottom-8 text-xs text-zinc-700">
        &copy; 2024 VibeKode. All rights reserved.
      </div>
    </main>
  );
};

// --- Main Page Component ---
export default function LoginPage() {
  return (
    <div className="grid min-h-screen w-full lg:grid-cols-2 bg-zinc-950 text-white">
      <AuthPanel />
      <ShowcasePanel />
    </div>
  );
}
