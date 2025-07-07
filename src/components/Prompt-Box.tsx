"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  Globe,
  Lock,
  Lightbulb,
  Sparkles,
  PencilLine,
  AudioWaveform,
  Send,
} from "lucide-react";
import { createProject } from "@/lib/firebase";

// Default example app ideas
const defaultIdeas: string[] = [
  "Note Taking App with dark mode",
  "Chess News App with live updates",
  "To-Do List Manager with categories",
  "Weather Dashboard with animations",
];

interface PromptBoxProps {
  onSend?: (prompt: string) => void;
  placeholder?: string;
  className?: string;
  containerClassName?: string | false;
  maxHeight?: number;
  minHeight?: number;
  ideas?: string[];
}

type ProjectMode = "sketch" | "voice";
type ProjectVisibility = "public" | "private";

const PromptBox: React.FC<PromptBoxProps> = ({
  onSend,
  placeholder = "Ask Vibekode to create Something....",
  className = "",
  containerClassName = "flex flex-col items-center justify-center min-h-[calc(100vh-6rem)] w-full max-w-[calc(100vw-2rem)] px-2 sm:px-4",
  maxHeight = 200,
  minHeight = 80,
  ideas = defaultIdeas,
}) => {
  const [prompt, setPrompt] = useState<string>("");
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [mode, setMode] = useState<ProjectMode>("sketch");
  const [visibility, setVisibility] = useState<ProjectVisibility>("public");
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();

  // Auto-resize textarea
  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = `${minHeight}px`;
    const scrollH = textareaRef.current.scrollHeight;
    textareaRef.current.style.height = `${Math.min(
      Math.max(scrollH, minHeight),
      maxHeight
    )}px`;
  }, [prompt, minHeight, maxHeight]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!prompt.trim()) return;

    try {
      // Save to localStorage for backup
      localStorage.setItem("vibekode_last_prompt", prompt);
      localStorage.setItem("vibekode_project_mode", mode);
      localStorage.setItem("vibekode_project_visibility", visibility);

      if (onSend) {
        onSend(prompt);
      }

      // Create project in Firestore
      const projectId = await createProject(prompt, visibility, mode);

      setPrompt("");

      await new Promise((resolve) => setTimeout(resolve, 100));

      router.push(`/project/${projectId}`);
    } catch (error) {
      console.error("Error creating project:", error);
      // Fallback to random ID if Firestore fails
      const randomId = Math.random().toString(36).substring(2, 15);
      router.push(`/project/${randomId}?type=newchat`);
    }
  };

  const toggleVoice = (): void => {
    if (mode === "voice") {
      setIsListening(!isListening);
      // Add voice recognition logic here
    } else {
      setMode("voice");
      setIsListening(true);
    }
  };

  const handleMagicPromptClick = (idea: string): void => {
    setPrompt(idea);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleVisibilityChange = (newVisibility: ProjectVisibility): void => {
    setVisibility(newVisibility);
    setShowDropdown(false);
  };

  const box = (
    <div className="flex flex-col items-center gap-6 w-full max-w-[48rem] sm:w-[calc(100vw-4rem)]">
      {/* Main Prompt Box */}
      <div
        className={cn(
          "rounded-2xl p-[2px] bg-gradient-to-r from-[#00ccb1] via-[#7b61ff] to-[#1ca0fb] transition-transform duration-200 w-full max-w-[48rem] sm:w-[calc(100vw-4rem)]",
          isFocused && "scale-[1.002]",
          className
        )}
      >
        <div
          className="rounded-2xl bg-[rgba(20,20,20,0.85)] backdrop-blur-lg shadow-xl border border-white/10"
          style={{ minHeight: `${minHeight + 20}px` }}
        >
          <form onSubmit={handleSubmit} className="p-3 sm:p-6">
            {/* Main input area */}
            <div className="flex items-start gap-2 sm:gap-4 mb-3 sm:mb-4">
              <textarea
                ref={textareaRef}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={placeholder}
                rows={1}
                className="flex-1 bg-transparent resize-none outline-none placeholder:text-zinc-400 text-white text-base sm:text-lg leading-relaxed scrollbar-thin scrollbar-thumb-zinc-600 scrollbar-track-transparent"
              />
            </div>

            {/* Controls row */}
            <div className="flex items-center justify-between gap-2">
              {/* Left side controls */}
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Sketch button */}
                <button
                  type="button"
                  onClick={() => setMode("sketch")}
                  className={cn(
                    "px-3 sm:px-4 py-2 rounded-lg border transition-all duration-200 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium",
                    mode === "sketch"
                      ? "bg-white/10 border-white/20 text-white"
                      : "border-zinc-600 text-zinc-400 hover:border-zinc-500 hover:text-zinc-300"
                  )}
                >
                  <PencilLine className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Sketch</span>
                </button>

                {/* Voice button */}
                <button
                  type="button"
                  onClick={toggleVoice}
                  className={cn(
                    "p-2 rounded-lg border transition-all duration-200 relative overflow-hidden",
                    "before:absolute before:inset-x-0 before:bottom-0 before:h-1/2 before:bg-gradient-to-t before:from-cyan-400/20 before:via-teal-400/15 before:to-transparent before:pointer-events-none",
                    mode === "voice" && isListening
                      ? "bg-red-500/20 border-red-400/50 text-red-400"
                      : mode === "voice"
                      ? "bg-white/10 border-white/20 text-white"
                      : "border-zinc-600 text-zinc-400 hover:border-zinc-500 hover:text-zinc-300"
                  )}
                >
                  <AudioWaveform className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>

              {/* Right side controls */}
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Visibility dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="px-2 sm:px-4 py-2 rounded-lg border border-zinc-600 text-zinc-300 hover:border-zinc-500 hover:text-white transition-all duration-200 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium"
                  >
                    {visibility === "public" ? (
                      <Globe className="w-3 h-3 sm:w-4 sm:h-4" />
                    ) : (
                      <Lock className="w-3 h-3 sm:w-4 sm:h-4" />
                    )}
                    <span className="hidden sm:inline">{visibility}</span>
                    <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 bottom-full mb-2 bg-zinc-900 border border-zinc-700 rounded-lg shadow-lg z-[9999] min-w-[100px] sm:min-w-[120px]">
                      <button
                        type="button"
                        onClick={() => handleVisibilityChange("public")}
                        className="w-full px-3 sm:px-4 py-2 text-left text-zinc-300 hover:bg-zinc-800 hover:text-white transition flex items-center gap-2 text-xs sm:text-sm"
                      >
                        <Globe className="w-3 h-3 sm:w-4 sm:h-4" />
                        public
                      </button>
                      <button
                        type="button"
                        onClick={() => handleVisibilityChange("private")}
                        className="w-full px-3 sm:px-4 py-2 text-left text-zinc-300 hover:bg-zinc-800 hover:text-white transition flex items-center gap-2 text-xs sm:text-sm"
                      >
                        <Lock className="w-3 h-3 sm:w-4 sm:h-4" />
                        private
                      </button>
                    </div>
                  )}
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={!prompt.trim()}
                  className="bg-gradient-to-r from-[#1ca0fb] to-[#4ab1ff] disabled:opacity-40 disabled:cursor-not-allowed p-2 sm:p-3 rounded-xl shadow-md hover:shadow-lg transition active:scale-95 disabled:hover:shadow-md"
                >
                  <Send className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Magic Prompts Section */}
      <div className="w-full max-w-[48rem] px-2 sm:px-4 pb-16 sm:pb-20">
        <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
          <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-[#00ccb1]" />
          <span className="text-zinc-400 text-xs sm:text-sm font-medium">
            Try these ideas
          </span>
          <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-[#7b61ff]" />
        </div>

        <div className="grid grid-cols-2 sm:flex sm:flex-wrap justify-center gap-2 sm:gap-2 md:gap-3 w-full">
          {ideas.map((idea) => (
            <button
              key={idea}
              onClick={() => handleMagicPromptClick(idea)}
              className="inline-flex items-center gap-x-1 sm:gap-x-1.5 md:gap-x-2 py-2 sm:py-2 md:py-2.5 px-3 sm:px-3 md:px-4 
                        rounded-lg sm:rounded-xl text-xs font-medium 
                        border border-[rgba(255,255,255,0.08)] bg-[rgba(20,20,20,0.4)] backdrop-blur-sm
                        hover:border-[rgba(255,255,255,0.15)] hover:bg-[rgba(20,20,20,0.6)]
                        cursor-pointer transition-all duration-300
                        text-white shadow-[0_2px_8px_rgba(0,204,177,0.08)] 
                        hover:shadow-[0_4px_16px_rgba(123,97,255,0.15)]
                        hover:scale-[1.02] active:scale-[0.98]
                        group justify-center sm:justify-start"
            >
              <Lightbulb className="w-3 h-3 text-[#00ccb1] group-hover:text-[#7b61ff] transition-colors duration-300 flex-shrink-0" />
              <span className="bg-clip-text bg-gradient-to-r from-[#00ccb1] to-[#1ca0fb] text-transparent truncate group-hover:from-[#7b61ff] group-hover:to-[#00ccb1] transition-all duration-300 text-xs sm:text-sm">
                {idea}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  if (containerClassName === false) {
    return box;
  }

  return <div className={containerClassName}>{box}</div>;
};

export default PromptBox;
export type { PromptBoxProps, ProjectMode, ProjectVisibility };
