"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { signInWithGoogle, auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

// --- Google Icon Component ---
const GoogleIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);


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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const router = useRouter();

  // Check if user is already authenticated
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is already signed in, redirect to project page
        router.push("/project");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError("");

    try {
      await signInWithGoogle();
      router.push("/project");
    } catch (error: unknown) {
      console.error("Authentication error:", error);
      const firebaseError = error as { code?: string };
      switch (firebaseError.code) {
        case "auth/popup-closed-by-user":
          setError("Sign-up was cancelled.");
          break;
        case "auth/popup-blocked":
          setError("Popup was blocked. Please allow popups and try again.");
          break;
        case "auth/network-request-failed":
          setError("Network error. Please check your connection.");
          break;
        default:
          setError("Failed to sign up. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

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

          {error && (
            <motion.div
              variants={FADE_IN_VARIANTS}
              className="mb-6 w-full p-4 bg-red-900/20 border border-red-800/50 rounded-xl"
            >
              <p className="text-sm text-red-300 text-center font-medium">
                {error}
              </p>
            </motion.div>
          )}

          <motion.div variants={FADE_IN_VARIANTS} className="w-full">
            <div className="group relative rounded-xl bg-white p-0.5 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]">
              <button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className={cn(
                  "flex w-full items-center justify-center gap-3 rounded-[10px] bg-white px-4 py-3.5",
                  "text-sm font-medium text-zinc-950 transition-all duration-200",
                  "hover:bg-zinc-50 active:scale-[0.99]",
                  "disabled:opacity-60 disabled:cursor-not-allowed"
                )}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-zinc-300 border-t-zinc-950 rounded-full animate-spin"></div>
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <GoogleIcon className="h-5 w-5" />
                    <span>Continue with Google</span>
                  </>
                )}
              </button>
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
        &copy; 2025 VibeKode. All rights reserved.
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
