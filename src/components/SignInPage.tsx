"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { AuthModal } from "@/components/Auth-model";

// --- Right-Side Auto-Scrolling Showcase Panel ---
const ShowcasePanel = () => {
    const projectImages = [
        { name: "Tic Tac Toe Game", file: "tic-tac-toe.png", style: "dark" },
        { name: "My Tasks To-Do List", file: "todo-list-manager.png", style: "light" },
        { name: "Aria Sinclair Portfolio", file: "artist-portfolio.png", style: "dark" },
        { name: "SkyAcademy LMS", file: "lms-landing-page.png", style: "dark" },
        { name: "Pixel Art Paint App", file: "pixel-art-paint-app.png", style: "dark" },
    ];

    return (
        <aside className="relative hidden lg:block h-screen overflow-hidden bg-zinc-950">
            <div className="absolute inset-0 z-10 [mask-image:_linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]" />
            
            <div className="h-full w-full">
                <div className="animate-infinite-scroll flex flex-col items-center gap-8 p-8">
                    {/* We duplicate the content to create a seamless loop */}
                    {[...projectImages, ...projectImages].map((project, index) => (
                        <div
                            key={index}
                            className={cn(
                                "w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl shadow-black/40 p-6",
                                project.style === 'light' 
                                    ? "bg-gray-50" 
                                    : "bg-gradient-to-br from-purple-600/20 via-indigo-900/20 to-black"
                            )}
                        >
                            <Image
                                src={`/community/${project.file}`}
                                alt={`${project.name} Preview`}
                                width={1024}
                                height={768}
                                className="rounded-lg shadow-lg"
                                priority
                            />
                        </div>
                    ))}
                </div>
            </div>
        </aside>
    );
};

// --- Left-Side Authentication Panel ---
const AuthPanel = () => {
    const [mode, setMode] = useState<"signup" | "signin">("signup");

    const FADE_IN_VARIANTS = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0, transition: { type: "spring", duration: 0.8 } },
    };

    return (
        <main className="relative flex h-full flex-col items-center justify-center p-8">
            <div className="w-full max-w-sm">
                <motion.div
                    variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
                    initial="hidden"
                    animate="show"
                    className="flex flex-col items-center text-center"
                >
                    <motion.div variants={FADE_IN_VARIANTS} className="relative w-16 h-16 mb-6">
                        <Image
                            src="/logo.png"
                            alt="VibeKode Logo"
                            fill
                            className="object-contain rounded-full"
                            priority
                        />
                    </motion.div>
                    
                    <motion.h1 variants={FADE_IN_VARIANTS} className="text-3xl font-bold tracking-tight text-white mb-2">
                        {mode === 'signup' ? "Start creating today" : "Welcome back"}
                    </motion.h1>
                    
                    <motion.p variants={FADE_IN_VARIANTS} className="text-zinc-400 mb-8">
                        {mode === 'signup' ? "Your first project is free." : "Sign in to access your projects."}
                    </motion.p>

                    <motion.div variants={FADE_IN_VARIANTS} className="w-full">
                        <AuthModal
                            mode={mode}
                            triggerText="Continue with Google"
                            triggerClassName={cn(
                                "flex w-full items-center justify-center gap-3 rounded-lg bg-white px-4 py-3",
                                "font-semibold text-black transition-transform duration-200 ease-in-out",
                                "hover:scale-[1.02] active:scale-[0.98]"
                            )}
                        />
                    </motion.div>
                    
                    <motion.p variants={FADE_IN_VARIANTS} className="mt-8 text-sm text-zinc-400">
                        {mode === 'signup' ? "Already have an account?" : "Don't have an account?"}{" "}
                        <button 
                            onClick={() => setMode(mode === 'signup' ? 'signin' : 'signup')} 
                            className="font-semibold text-white hover:underline focus:outline-none"
                        >
                            {mode === 'signup' ? "Sign in" : "Sign up"}
                        </button>
                    </motion.p>
                </motion.div>
            </div>
        </main>
    );
};

// --- Main Page Component ---
export default function LoginPage() {
    return (
        <div className="grid min-h-screen w-full lg:grid-cols-2 bg-black">
            <AuthPanel />
            <ShowcasePanel />
        </div>
    );
}