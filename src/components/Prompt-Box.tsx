"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  RefObject,
} from "react";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  Globe,
  Lock,
  Sparkles,
  AudioWaveform,
  Send,
  LoaderCircle,
  X,
  Pause,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  createProject,
  auth,
  checkAndUpdateChatLimit,
  incrementChatCount,
  db,
} from "@/lib/firebase";
import { generateAppIdea } from "@/backend/backend";

// --- Declarations & Constants ---

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition: new () => SpeechRecognitionInstance;
  }
}

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

// --- Custom Hooks ---

const useTypewriter = (
  ideas: string[],
  isInputFocused: boolean,
  hasPrompt: boolean
) => {
  const [placeholder, setPlaceholder] = useState("");
  const ideaIndex = useRef<number>(0);
  const charIndex = useRef<number>(0);
  const isDeleting = useRef<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    const type = () => {
      if (isInputFocused || hasPrompt) return;

      const currentIdea = ideas[ideaIndex.current];
      let newPlaceholder = "";
      let delay = 120;

      if (isDeleting.current) {
        newPlaceholder = currentIdea.substring(0, charIndex.current - 1);
        charIndex.current--;
        delay = 60;
      } else {
        newPlaceholder = currentIdea.substring(0, charIndex.current + 1);
        charIndex.current++;
      }
      setPlaceholder(newPlaceholder);

      if (!isDeleting.current && charIndex.current === currentIdea.length) {
        isDeleting.current = true;
        delay = 2000;
      } else if (isDeleting.current && charIndex.current === 0) {
        isDeleting.current = false;
        ideaIndex.current = (ideaIndex.current + 1) % ideas.length;
      }

      timeoutRef.current = setTimeout(type, delay);
    };

    if (!isInputFocused && !hasPrompt) {
      timeoutRef.current = setTimeout(type, 100);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [ideas, isInputFocused, hasPrompt]);

  return placeholder;
};

const useAutosizeTextArea = (
  textAreaRef: React.RefObject<HTMLTextAreaElement>,
  value: string
) => {
  useEffect(() => {
    if (textAreaRef.current) {
      const textArea = textAreaRef.current;
      textArea.style.height = "auto";
      const scrollHeight = textArea.scrollHeight;

      const style = window.getComputedStyle(textArea);
      const lineHeight =
        parseFloat(style.lineHeight) || parseFloat(style.fontSize) * 1.5;
      const paddingTop = parseFloat(style.paddingTop);
      const paddingBottom = parseFloat(style.paddingBottom);
      // Cap at roughly 3-4 lines for better visibility before scrolling
      const maxHeight = 4 * lineHeight + paddingTop + paddingBottom;

      if (scrollHeight > maxHeight) {
        textArea.style.height = `${maxHeight}px`;
        textArea.style.overflowY = "auto";
      } else {
        textArea.style.height = `${scrollHeight}px`;
        textArea.style.overflowY = "hidden";
      }
    }
  }, [textAreaRef, value]);
};

const useClickOutside = (
  ref: React.RefObject<HTMLElement>,
  handler: () => void
) => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler();
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
};

// --- Speech Recognition Types ---
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
  isFinal: boolean;
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

// --- Main Component ---

export type ProjectMode = "sketch" | "voice";
export type ProjectVisibility = "public" | "private";
export interface PromptBoxProps {
  onSend?: (prompt: string) => void;
  className?: string;
  containerClassName?: string | false;
}

const PromptBox: React.FC<PromptBoxProps> = ({
  onSend,
  className = "",
  containerClassName = "flex flex-col items-center justify-center min-h-[calc(100vh-6rem)] w-full max-w-[calc(100vw-2rem)] px-2 sm:px-4",
}) => {
  const [prompt, setPrompt] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [visibility, setVisibility] = useState<ProjectVisibility>("public");
  const [showDropdown, setShowDropdown] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isMagicLoading, setIsMagicLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [charCount, setCharCount] = useState(0);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const router = useRouter();

  const typingPlaceholder = useTypewriter(typingIdeas, isFocused, !!prompt);

  // Subscription State
  const [subscriptionType, setSubscriptionType] = useState<
    "free" | "go" | "pro"
  >("free");
  const [privateCount, setPrivateCount] = useState(0);

  useEffect(() => {
    if (!auth.currentUser) return;
    const fetchUserData = async () => {
      try {
        const snap = await getDoc(doc(db, "users", auth.currentUser!.uid));
        if (snap.exists()) {
          const data = snap.data();
          setSubscriptionType(data.subscriptionType || "free");
          setPrivateCount(data.privateProjectsCount || 0);
        }
      } catch (e) {
        console.error("Error fetching user stats", e);
      }
    };
    fetchUserData();
  }, []);

  const canCreatePrivate = (() => {
    if (subscriptionType === "free") return false;
    if (subscriptionType === "go") return privateCount < 5;
    return true; // Pro
  })();

  const getPrivateTooltip = () => {
    if (subscriptionType === "free")
      return "Upgrade to create private projects";
    if (subscriptionType === "go" && !canCreatePrivate)
      return "Private project limit reached (5/5). Upgrade to Pro.";
    return "";
  };

  useAutosizeTextArea(textareaRef as RefObject<HTMLTextAreaElement>, prompt);
  useClickOutside(dropdownRef as RefObject<HTMLElement>, () =>
    setShowDropdown(false)
  );

  useEffect(() => {
    setCharCount(prompt.length);
  }, [prompt]);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        setPrompt((prev) =>
          prev.trim()
            ? `${prev.trim()} ${finalTranscript.trim()}`
            : finalTranscript.trim()
        );
      }
    };
    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setError("Voice recognition failed. Please try again.");
      setIsListening(false);
    };
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
    if (e.key === "Escape") {
      setPrompt("");
      setError(null);
    }
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!prompt.trim() || isMagicLoading) return;

      setError(null);

      try {
        const user = auth.currentUser;
        if (!user) {
          toast.error("Please sign in to create a project");
          return;
        }

        const status = await checkAndUpdateChatLimit(user.uid);
        if (!status.canSendMessage) {
          const resetTime = status.resetsAt.toLocaleDateString();
          if (!status.isPremium && status.total <= 5) {
            toast.error("Daily chat limit reached", {
              description:
                "Daily chat limit reached (5/5). Resets at midnight. Upgrade for unlimited daily chats!",
              action: {
                label: "Upgrade",
                onClick: () => console.log("Upgrade clicked"),
              },
            });
          } else {
            toast.error("Monthly credit limit reached", {
              description: `Monthly credit limit reached (${status.total}/${status.total}). Resets on ${resetTime}. Upgrade for more credits!`,
              action: {
                label: "Upgrade",
                onClick: () => console.log("Upgrade clicked"),
              },
            });
          }
          return;
        }
        if (onSend) onSend(prompt);
        const projectId = await createProject(prompt, visibility, "sketch");

        if (auth.currentUser) {
          await incrementChatCount(auth.currentUser.uid);
          const updatedStatus = await checkAndUpdateChatLimit(
            auth.currentUser.uid
          );
          const remainingText = updatedStatus.isPremium
            ? `${updatedStatus.remaining} credits remaining this month`
            : `${updatedStatus.remaining} chats remaining today`;

          toast.success(`Project created! ${remainingText}`);
        }
        setPrompt("");
        router.push(`/project/${projectId}`);
      } catch (error: unknown) {
        console.error("Error creating project:", error);
        let errorMessage = "Failed to create project. Redirecting...";

        if (error instanceof Error) {
          errorMessage = error.message;
          if (
            error.message.includes("limit reached") ||
            error.message.includes("Upgrade")
          ) {
            setError(error.message);
            return;
          }
        }
        setError(errorMessage);
        const randomId = Math.random().toString(36).substring(2, 15);
        setTimeout(() => {
          router.push(`/project/${randomId}?fallback=true`);
        }, 1500);
      }
    },
    [prompt, visibility, isMagicLoading, onSend, router]
  );

  const toggleVoice = () => {
    if (!recognitionRef.current) {
      setError("Voice recognition not supported in your browser");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setError(null);
      recognitionRef.current.start();
    }
    setIsListening(!isListening);
  };

  const handleMagicClick = useCallback(async () => {
    setIsMagicLoading(true);
    setError(null);
    try {
      const generatedText = await generateAppIdea();
      setPrompt(
        generatedText ||
          typingIdeas[Math.floor(Math.random() * typingIdeas.length)]
      );
    } catch (error) {
      console.error("Magic generation error:", error);
      setPrompt(typingIdeas[Math.floor(Math.random() * typingIdeas.length)]);
      setError("AI generation failed. Using a random idea instead.");
    } finally {
      setIsMagicLoading(false);
      textareaRef.current?.focus();
    }
  }, []);

  const clearPrompt = () => {
    setPrompt("");
    setError(null);
    textareaRef.current?.focus();
  };

  const box = (
    <div className={`w-full max-w-3xl ${className}`}>
      <motion.div
        layout // Smoothly animates size changes
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0, scale: isFocused ? 1.01 : 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="rounded-2xl p-[1px] bg-gradient-to-r from-teal-400/40 via-purple-500/40 to-blue-500/40 shadow-2xl hover:shadow-teal-500/20 transition-shadow duration-300"
      >
        <div className="rounded-[15px] bg-gray-900/90 backdrop-blur-xl border border-white/10">
          <form
            onSubmit={handleSubmit}
            className="p-4 sm:p-5 flex flex-col gap-4"
          >
            {/* Textarea Container */}
            <motion.div layout className="relative">
              <textarea
                ref={textareaRef}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onKeyDown={handleKeyDown}
                placeholder={typingPlaceholder}
                rows={1}
                // --- LENIS PREVENT SCROLL FIXES ---
                data-lenis-prevent
                onWheel={(e) => e.stopPropagation()} 
                // ----------------------------------
                className="w-full bg-transparent resize-none outline-none placeholder:text-zinc-500 text-white text-base sm:text-lg leading-relaxed transition-all duration-300 min-h-[28px] pr-10 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent"
                aria-label="Project idea prompt"
                maxLength={1000}
              />
              {/* Clear Button */}
              <AnimatePresence>
                {prompt && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    type="button"
                    onClick={clearPrompt}
                    className="absolute top-0 right-0 p-1 mr-5 text-zinc-500 hover:text-white transition-colors"
                    aria-label="Clear prompt"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Character Count */}
            <AnimatePresence>
              {charCount > 800 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-xs text-zinc-500 text-right"
                >
                  {charCount}/1000
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="px-3 py-2 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Buttons */}
            <motion.div layout className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <IconButton
                  onClick={handleMagicClick}
                  disabled={isMagicLoading}
                  tooltip="Generate an idea with AI"
                  isActive={isMagicLoading}
                  activeColor="blue"
                >
                  {isMagicLoading ? (
                    <LoaderCircle className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  <span className="hidden sm:inline">Magic</span>
                </IconButton>
                <IconButton
                  onClick={toggleVoice}
                  tooltip={isListening ? "Stop listening" : "Use voice input"}
                  isActive={isListening}
                  activeColor="red"
                >
                  {isListening ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <AudioWaveform className="w-4 h-4" />
                  )}
                </IconButton>
              </div>

              <div className="flex items-center gap-2">
                {/* Visibility Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="h-10 px-3 rounded-lg border border-zinc-700/80 bg-zinc-800/50 text-zinc-300 hover:border-zinc-600 hover:text-white hover:bg-zinc-800/70 transition-all flex items-center gap-2 text-xs sm:text-sm font-medium"
                    aria-label="Change project visibility"
                  >
                    {visibility === "public" ? (
                      <Globe className="w-4 h-4" />
                    ) : (
                      <Lock className="w-4 h-4" />
                    )}
                    <span className="hidden sm:inline capitalize">
                      {visibility}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        showDropdown ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {showDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 bottom-full mb-2 w-36 bg-zinc-900/95 backdrop-blur-xl border border-zinc-700 rounded-lg shadow-2xl z-10 overflow-hidden"
                      >
                        <DropdownItem
                          onClick={() => {
                            setVisibility("public");
                            setShowDropdown(false);
                          }}
                          icon={<Globe className="w-4 h-4" />}
                          text="Public"
                          isActive={visibility === "public"}
                        />
                        <DropdownItem
                          onClick={() => {
                            if (!canCreatePrivate) return;
                            setVisibility("private");
                            setShowDropdown(false);
                          }}
                          icon={<Lock className="w-4 h-4" />}
                          text="Private"
                          isActive={visibility === "private"}
                          disabled={!canCreatePrivate}
                          tooltip={getPrivateTooltip()}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={!prompt.trim() || isMagicLoading}
                  whileHover={{ scale: prompt.trim() ? 1.05 : 1 }}
                  whileTap={{ scale: prompt.trim() ? 0.95 : 1 }}
                  className="h-10 bg-gradient-to-br from-blue-500 to-purple-600 text-white disabled:opacity-40 disabled:cursor-not-allowed p-2.5 rounded-lg shadow-md hover:shadow-lg hover:shadow-blue-500/30 transition-all disabled:hover:shadow-md relative overflow-hidden group flex items-center justify-center"
                  aria-label="Submit prompt"
                >
                  <Send className="w-5 h-5 relative z-10" />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.button>
              </div>
            </motion.div>
          </form>
        </div>
      </motion.div>

      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        .scrollbar-thin {
          scrollbar-width: thin;
          scrollbar-color: #52525b transparent;
        }
        .scrollbar-thin::-webkit-scrollbar {
          width: 5px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background-color: #52525b;
          border-radius: 20px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background-color: #71717a;
        }
      `}</style>
    </div>
  );

  return containerClassName === false ? (
    box
  ) : (
    <div className={containerClassName}>{box}</div>
  );
};

// --- Helper Sub-components ---

const IconButton: React.FC<{
  onClick: () => void;
  disabled?: boolean;
  tooltip: string;
  children: React.ReactNode;
  isActive?: boolean;
  activeColor?: "blue" | "red";
}> = ({
  onClick,
  disabled,
  tooltip,
  children,
  isActive,
  activeColor = "blue",
}) => {
  const activeClasses = {
    blue: "border-blue-500/50 bg-blue-500/10 text-blue-400",
    red: "border-red-500/50 bg-red-500/10 text-red-400",
  };
  const inactiveClasses =
    "border-zinc-700/80 bg-zinc-800/50 text-zinc-400 hover:border-zinc-600 hover:text-white hover:bg-zinc-800/70";

  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      className={`group relative h-10 px-3 rounded-lg border transition-all flex items-center gap-2 text-xs sm:text-sm font-medium ${
        isActive ? activeClasses[activeColor] : inactiveClasses
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {children}
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        whileHover={{ opacity: 1, y: 0 }}
        className="absolute -top-10 left-1/2 -translate-x-1/2 hidden group-hover:block bg-zinc-800 text-white text-xs rounded-lg py-1.5 px-3 pointer-events-none whitespace-nowrap shadow-lg z-20"
      >
        {tooltip}
        <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-zinc-800 rotate-45" />
      </motion.div>
    </motion.button>
  );
};

const DropdownItem: React.FC<{
  onClick: () => void;
  icon: React.ReactNode;
  text: string;
  isActive?: boolean;
  disabled?: boolean;
  tooltip?: string;
}> = ({ onClick, icon, text, isActive, disabled, tooltip }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    title={tooltip}
    className={`w-full px-3 py-2.5 text-left transition-all flex items-center gap-2 text-sm capitalize ${
      isActive
        ? "bg-blue-500/20 text-blue-400"
        : disabled
        ? "opacity-50 cursor-not-allowed text-zinc-500"
        : "text-zinc-300 hover:bg-zinc-800 hover:text-white"
    }`}
  >
    {icon}
    {text}
  </button>
);

export default PromptBox;