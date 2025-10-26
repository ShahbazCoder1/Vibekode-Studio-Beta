"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  Globe,
  Lock,
  Sparkles,
  AudioWaveform,
  Send,
} from "lucide-react";
import { createProject } from "@/lib/firebase";

// Add this after your imports and before the typingIdeas array
declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition: new () => SpeechRecognitionInstance;
  }
}

// Typing animation ideas
const typingIdeas = [
  "Habit Tracker with streak visualization",
  "Language Flashcard App with spaced repetition",
  "Subscription Tracker with payment reminders",
  "Book Journal with reading goals",
  "Travel Itinerary Planner with offline maps",
  "Local Event Finder with map integration",
  "Pomodoro Timer with customizable cycles",
  "Podcast Clipper for sharing short audio snippets",
  "Plant Care Assistant with watering schedules",
  "Movie Watchlist with API-driven recommendations",
];

interface PromptBoxProps {
  onSend?: (prompt: string) => void;
  placeholder?: string;
  className?: string;
  containerClassName?: string | false;
}

type ProjectMode = "sketch" | "voice";
type ProjectVisibility = "public" | "private";

// Speech Recognition types
interface SpeechRecognitionEvent {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  length: number;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  stop(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
}

const PromptBox: React.FC<PromptBoxProps> = ({
  onSend,
  className = "",
  containerClassName = "flex flex-col items-center justify-center min-h-[calc(100vh-6rem)] w-full max-w-[calc(100vw-2rem)] px-2 sm:px-4",
}) => {
  const [prompt, setPrompt] = useState<string>("");
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [mode] = useState<ProjectMode>("sketch");
  const [visibility, setVisibility] = useState<ProjectVisibility>("public");
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isMagicLoading, setIsMagicLoading] = useState<boolean>(false);
  const [typingPlaceholder, setTypingPlaceholder] = useState<string>("");
  const [currentIdeaIndex, setCurrentIdeaIndex] = useState<number>(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const router = useRouter();

  // Typing animation effect
  useEffect(() => {
    if (isFocused || prompt) return;

    const currentIdea = typingIdeas[currentIdeaIndex];
    let charIndex = 0;
    let isDeleting = false;
    let timeoutId: NodeJS.Timeout;

    const type = () => {
      if (!isDeleting && charIndex < currentIdea.length) {
        setTypingPlaceholder(currentIdea.substring(0, charIndex + 1));
        charIndex++;
        timeoutId = setTimeout(type, 100);
      } else if (!isDeleting && charIndex === currentIdea.length) {
        timeoutId = setTimeout(() => {
          isDeleting = true;
          type();
        }, 2000);
      } else if (isDeleting && charIndex > 0) {
        setTypingPlaceholder(currentIdea.substring(0, charIndex - 1));
        charIndex--;
        timeoutId = setTimeout(type, 50);
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        setCurrentIdeaIndex((prev) => (prev + 1) % typingIdeas.length);
      }
    };

    type();

    return () => clearTimeout(timeoutId);
  }, [currentIdeaIndex, isFocused, prompt]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition =
          new SpeechRecognition() as SpeechRecognitionInstance;
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          let transcript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          setPrompt(transcript);
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.error("Speech recognition error:", event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.error("Error stopping recognition on unmount:", e);
        }
      }
    };
  }, []);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
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
    if (!recognitionRef.current) {
      alert(
        "Speech recognition is not supported in your browser. Please try Chrome or Edge."
      );
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error("Error starting speech recognition:", error);
        alert("Could not start speech recognition. Please try again.");
      }
    }
  };

  const handleMagicClick = async (): Promise<void> => {
    setIsMagicLoading(true);

    try {
      const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      const MODEL_ID = "gemini-flash-latest";
      const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_ID}:generateContent?key=${GEMINI_API_KEY}`;

      const payload = {
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `Generate a single innovative app idea in one continuous paragraph without any formatting, bullet points, bold text, or line breaks. Write it as if you're casually explaining your app idea to a friend. Include the app name naturally in the description. Focus on the core concept, key features, and why users would love it. Keep it conversational and flowing, around 100-150 words.`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 1.0,
          maxOutputTokens: 200,
          thinkingConfig: {
            thinkingBudget: 0,
          },
        },
      };

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.error("Gemini API error:", await response.text());
        const randomIdea =
          typingIdeas[Math.floor(Math.random() * typingIdeas.length)];
        setPrompt(randomIdea);
        return;
      }

      const data = await response.json();
      const generatedText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

      if (generatedText) {
        setPrompt(generatedText);
      } else {
        const randomIdea =
          typingIdeas[Math.floor(Math.random() * typingIdeas.length)];
        setPrompt(randomIdea);
      }
    } catch (error) {
      console.error("Magic generation error:", error);
      const randomIdea =
        typingIdeas[Math.floor(Math.random() * typingIdeas.length)];
      setPrompt(randomIdea);
    } finally {
      setIsMagicLoading(false);
      textareaRef.current?.focus();
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
        className={`rounded-2xl p-[2px] bg-gradient-to-r from-[#00ccb1] via-[#7b61ff] to-[#1ca0fb] transition-transform duration-200 w-full max-w-[48rem] sm:w-[calc(100vw-4rem)] ${
          isFocused ? "scale-[1.002]" : ""
        } ${className}`}
      >
        <div className="rounded-2xl bg-[rgba(20,20,20,0.85)] backdrop-blur-lg h-48 shadow-xl border border-white/10 overflow-hidden">
          <form
            onSubmit={handleSubmit}
            className="p-3 sm:p-6 h-full flex flex-col"
          >
            {/* Main input area */}
            <div className="flex items-start gap-2 sm:gap-4 mb-3 sm:mb-4 flex-1">
              <textarea
                ref={textareaRef}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={
                  typingPlaceholder || "Ask Vibekode to create Something...."
                }
                rows={3}
                className="flex-1 bg-transparent resize-none outline-none placeholder:text-zinc-400 text-white text-base sm:text-lg leading-relaxed scrollbar-thin scrollbar-thumb-zinc-600 scrollbar-track-transparent overflow-y-auto"
              />
            </div>

            {/* Controls row */}
            <div className="flex items-center justify-between gap-2 flex-shrink-0">
              {/* Left side controls */}
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Magic button */}
                <button
                  type="button"
                  onClick={handleMagicClick}
                  disabled={isMagicLoading}
                  className={`px-3 sm:px-4 py-2 rounded-lg border transition-all duration-200 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium relative overflow-hidden ${
                    isMagicLoading
                      ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-400/50 text-purple-300"
                      : "border-zinc-600 text-zinc-400 hover:border-purple-500 hover:text-purple-300 hover:bg-purple-500/10"
                  }`}
                >
                  {isMagicLoading && (
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/30 to-purple-500/0 animate-shimmer" />
                  )}
                  <Sparkles
                    className={`w-3 h-3 sm:w-4 sm:h-4 ${
                      isMagicLoading ? "animate-spin" : ""
                    }`}
                  />
                  <span>Magic</span>
                </button>

                {/* Voice button */}
                <button
                  type="button"
                  onClick={toggleVoice}
                  className={`p-2 rounded-lg border transition-all duration-200 relative overflow-hidden ${
                    isListening
                      ? "bg-red-500/20 border-red-400/50 text-red-400"
                      : "border-zinc-600 text-zinc-400 hover:border-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  {isListening && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-full h-full flex items-center justify-center gap-0.5">
                        {[...Array(3)].map((_, i) => (
                          <div
                            key={i}
                            className="w-0.5 bg-red-400 rounded-full animate-wave"
                            style={{
                              height: "60%",
                              animationDelay: `${i * 0.15}s`,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  <AudioWaveform className="w-3 h-3 sm:w-4 sm:h-4 relative z-10" />
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

      {/* Custom animations */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        @keyframes wave {
          0%,
          100% {
            height: 20%;
          }
          50% {
            height: 80%;
          }
        }
        .animate-shimmer {
          animation: shimmer 1.5s ease-in-out infinite;
        }
        .animate-wave {
          animation: wave 1s ease-in-out infinite;
        }
      `}</style>
    </div>
  );

  if (containerClassName === false) {
    return box;
  }

  return <div className={containerClassName}>{box}</div>;
};

export default PromptBox;
export type { PromptBoxProps, ProjectMode, ProjectVisibility };
