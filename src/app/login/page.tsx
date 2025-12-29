"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import {
  signInWithGoogle,
  signInWithGoogleMobile,
  handleGoogleRedirectResult,
  createUserDocument,
  auth,
} from "@/lib/firebase";
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
    <aside className="relative hidden h-screen w-full overflow-hidden bg-[#09090b] border-l border-white/5 lg:block">
      {/* Ambient background glow */}
      <div className="absolute top-[-20%] right-[-10%] h-[600px] w-[600px] rounded-full bg-[#5b21b6]/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-[#1e40af]/10 blur-[120px] pointer-events-none" />

      {/* Top and Bottom Fade Masks */}
      <div className="absolute inset-x-0 top-0 z-20 h-40 bg-gradient-to-b from-[#09090b] to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 z-20 h-40 bg-gradient-to-t from-[#09090b] to-transparent pointer-events-none" />

      <div className="flex h-full items-center justify-center">
        {/* Framer Motion for guaranteed smooth scrolling */}
        <motion.div
          initial={{ y: 0 }}
          animate={{ y: "-50%" }}
          transition={{
            duration: 40,
            ease: "linear",
            repeat: Infinity,
            repeatType: "loop",
          }}
          className="flex flex-col gap-6 w-full max-w-lg px-8 py-8"
        >
          {slides.map((project, index) => (
            <div
              key={index}
              className={cn(
                "group relative w-full overflow-hidden rounded-xl border border-white/5 bg-zinc-900/40 p-3 backdrop-blur-sm transition-all duration-500 hover:border-white/10 hover:bg-zinc-800/60 hover:shadow-2xl hover:shadow-[#5b21b6]/10",
              )}
            >
              {/* Card Header Dots */}
              <div className="mb-3 flex gap-1.5 opacity-30 group-hover:opacity-60 transition-opacity px-1">
                <div className="h-2 w-2 rounded-full bg-zinc-500" />
                <div className="h-2 w-2 rounded-full bg-zinc-500" />
                <div className="h-2 w-2 rounded-full bg-zinc-500" />
              </div>

              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg bg-zinc-950 shadow-inner">
                <Image
                  src={`/community/${project.file}`}
                  alt={`${project.name} Preview`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
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
  const [mode] = useState<"signin" | "signup">("signin");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const router = useRouter();
  const searchParams = useSearchParams();

  const isMobileApp = searchParams.get("mode") === "mobileapp";

  useEffect(() => {
    handleGoogleRedirectResult()
      .then((result) => {
        if (result) {
          const dest = localStorage.getItem("auth_redirect_destination") || "/project";
          localStorage.removeItem("auth_redirect_destination");
          localStorage.removeItem("auth_mobile_mode");
          console.log("Redirect successful, navigating to:", dest);
          window.location.href = dest;
        }
      })
      .catch((error) => {
        console.error("Redirect result error:", error);
        localStorage.removeItem("auth_redirect_destination");
        localStorage.removeItem("auth_mobile_mode");
      });
  }, []);

  useEffect(() => {
    let mounted = true;
    if (auth.currentUser && mounted) {
      console.log("User already authenticated, redirecting...");
      router.push("/project");
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!mounted) return;

      if (user) {
        console.log("Auth state changed - user found:", user.email);
        try {
          await createUserDocument(user);
          router.push("/project");
        } catch (e) {
          console.error("User setup error:", e);
          setError("Failed to set up user account. Please try again.");
        }
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [router, isMobileApp]);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError("");

    try {
      if (isMobileApp) {
        localStorage.setItem("auth_redirect_destination", "/project");
        localStorage.setItem("auth_mobile_mode", "true");
        console.log("Starting mobile redirect flow...");
        await signInWithGoogleMobile();
      } else {
        await signInWithGoogle();
        router.push("/project");
      }
    } catch (error: unknown) {
      console.error("Authentication error:", error);
      const firebaseError = error as { code?: string };

      if (isMobileApp) {
        switch (firebaseError.code) {
          case "auth/network-request-failed":
            setError("Network error. Please check your connection.");
            break;
          default:
            setError("Failed to sign in. Please try again.");
        }
      } else {
        switch (firebaseError.code) {
          case "auth/popup-closed-by-user":
            setError("Sign-in was cancelled.");
            break;
          case "auth/popup-blocked":
            setError("Popup was blocked. Please allow popups and try again.");
            break;
          case "auth/network-request-failed":
            setError("Network error. Please check your connection.");
            break;
          default:
            setError("Failed to sign in. Please try again.");
        }
      }
      setIsLoading(false);
      localStorage.removeItem("auth_redirect_destination");
      localStorage.removeItem("auth_mobile_mode");
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
    <main className="relative flex h-screen w-full flex-col bg-[#09090b] text-white overflow-hidden">
      {/* Subtle Gradient Spotlights */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[25%] -left-[10%] h-[50vh] w-[50vh] rounded-full bg-[#5b21b6]/10 blur-[100px]" />
        <div className="absolute top-[30%] right-[20%] h-[30vh] w-[30vh] rounded-full bg-[#1e40af]/10 blur-[80px]" />
      </div>

      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 z-10">
        <div className="w-full max-w-[380px]">
          <motion.div
            key={mode}
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.08 } },
            }}
            initial="hidden"
            animate="show"
            className="flex flex-col items-center text-center"
          >
            {/* Logo with Glow */}
            <motion.div variants={FADE_IN_VARIANTS} className="relative mb-10 group">
              <div className="absolute inset-0 bg-[#5b21b6]/20 blur-xl rounded-full group-hover:bg-[#5b21b6]/30 transition-all duration-500" />
              <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-white/10 shadow-2xl bg-zinc-900/50 backdrop-blur-sm">
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
              className="mb-3 text-3xl font-bold tracking-tight text-white sm:text-4xl"
            >
              Welcome back
            </motion.h1>

            <motion.p
              variants={FADE_IN_VARIANTS}
              className="mb-10 text-zinc-400 text-sm leading-relaxed max-w-[300px]"
            >
              Enter your credentials to access your projects and settings.
            </motion.p>

            {error && (
              <motion.div
                variants={FADE_IN_VARIANTS}
                className="mb-6 w-full p-4 bg-red-500/10 border border-red-500/20 rounded-xl"
              >
                <p className="text-sm text-red-400 text-center font-medium">
                  {error}
                </p>
              </motion.div>
            )}

            <motion.div variants={FADE_IN_VARIANTS} className="w-full">
              <div className="group relative rounded-xl bg-gradient-to-b from-white/10 to-transparent p-[1px] transition-all duration-300 hover:from-white/20">
                <button
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className={cn(
                    "flex w-full items-center justify-center gap-3 rounded-[11px] bg-zinc-900 px-4 py-4",
                    "text-sm font-semibold text-white transition-all duration-200 border border-zinc-800",
                    "hover:bg-zinc-800 hover:border-zinc-700 active:scale-[0.98]",
                    "disabled:opacity-60 disabled:cursor-not-allowed"
                  )}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-zinc-500 border-t-white rounded-full animate-spin"></div>
                      <span className="text-zinc-300">
                        {isMobileApp ? "Redirecting..." : "Signing in..."}
                      </span>
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
              Don&apos;t have an account?
              <Link
                href={`/signup${isMobileApp ? "?mode=mobileapp" : ""}`}
                className="font-medium text-white hover:text-[#7c3aed] transition-colors focus:outline-none"
              >
                Sign up
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Footer / Copyright - Pinned nicely */}
      <div className="w-full py-6 text-center text-[11px] text-zinc-600 font-medium z-10">
        &copy; 2025 VibeKode. All rights reserved.
      </div>
    </main>
  );
};

// Wrapper component with Suspense boundary
function LoginPageContent() {
  return (
    <div className="grid min-h-screen w-full lg:grid-cols-2 bg-[#09090b] text-white">
      <AuthPanel />
      <ShowcasePanel />
    </div>
  );
}

// --- Main Page Component ---
export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-[#09090b]">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-zinc-800 border-t-[#7c3aed]"></div>
        </div>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}