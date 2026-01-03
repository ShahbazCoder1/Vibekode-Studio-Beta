"use client";

import { useState, useRef, useEffect } from "react";
import {
  Send,
  Mic,
  MoreVertical,
  User,
  Bot,
  PencilLine,
  Check,
  Loader2,
  ChevronDown,
  Square,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  generateAppName,
  generateMessage,
  generateAppArchitecture,
  generateCode,
  generateImproveCode,
} from "@/backend/backend";
import {
  getProject,
  updateProjectName,
  saveChatMessage,
  getChatHistory,
  chatExists,
  checkAndUpdateChatLimit,
  incrementChatCount,
  auth,
  type ChatMessage,
  type ChatLimitStatus,
} from "@/lib/firebase";
import { Toaster, toast } from "sonner";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

const FREE_TIER_MONTHLY_LIMIT = 30;


// --- Interfaces ---
interface Task {
  id: string;
  label: string;
}

interface Message {
  id: string;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
  hasProgressTracker?: boolean;
  progressTasks?: Task[];
  progressVersion?: number;
  completedTasks?: Set<string>;
  firebaseId?: string;
}

interface ChatProps {
  projectId: string;
  onRename?: () => void;
  onDelete?: () => void;
  onCodeGenerated?: (code: string) => void;
}

// --- Custom Progress Tracker Component ---
interface ProgressTrackerProps {
  tasks: Task[];
  completedTasks: Set<string>;
  isAnimating: boolean;
}

const ProgressTrackerComponent = ({
  tasks,
  completedTasks,
  isAnimating,
}: ProgressTrackerProps) => {
  return (
    <div className="space-y-3">
      {tasks.map((task) => {
        const isCompleted = completedTasks.has(task.id);
        const isActive = !isCompleted && isAnimating;
        const isPending = !isCompleted && !isActive;

        return (
          <div key={task.id} className="flex items-center gap-3 group">
            {/* Status Icon */}
            <div
              className={cn(
                "relative w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500",
                isCompleted &&
                "bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/30",
                isActive &&
                "bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/30",
                isPending && "bg-zinc-800 border border-zinc-700"
              )}
            >
              {isCompleted && (
                <Check className="w-3.5 h-3.5 text-white animate-in zoom-in duration-300" />
              )}
              {isActive && (
                <div className="absolute inset-0 rounded-full">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 animate-pulse" />
                  <Loader2 className="absolute inset-0 m-auto w-3.5 h-3.5 text-white animate-spin" />
                </div>
              )}
              {isPending && (
                <div className="w-2 h-2 rounded-full bg-zinc-600" />
              )}
            </div>

            {/* Task Label */}
            <div className="flex-1">
              <p
                className={cn(
                  "text-sm font-medium transition-all duration-300",
                  isCompleted && "text-emerald-400",
                  isActive && "text-blue-400 font-semibold",
                  isPending && "text-zinc-500"
                )}
              >
                {task.label}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// --- Main Component ---
export default function Chat({
  projectId,
  onRename,
  onDelete,
  onCodeGenerated,
}: ChatProps) {
  // State
  const [appName, setAppName] = useState("Loading...");
  const [appIdea, setAppIdea] = useState<string>("");
  const [isGeneratingResponse, setIsGeneratingResponse] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [showOverflowMenu, setShowOverflowMenu] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [completedTrackers, setCompletedTrackers] = useState<Set<string>>(
    new Set()
  );
  const [currentCode, setCurrentCode] = useState<string>("");
  const [latestProgressTrackerId, setLatestProgressTrackerId] =
    useState<string>("");
  const [isLoadingProject, setIsLoadingProject] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [chatLimitStatus, setChatLimitStatus] = useState<ChatLimitStatus | null>(null);
  const [showLimitWarning, setShowLimitWarning] = useState(false);

  // Refs
  const hasInitialized = useRef(false);
  const messageIdCounter = useRef(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  // Helper Functions
  const generateUniqueId = (prefix: string) => {
    messageIdCounter.current += 1;
    return `${prefix}-${Date.now()}-${messageIdCounter.current}`;
  };

  const convertFirebaseMessage = (chatMessage: ChatMessage): Message => {
    const isBot = chatMessage.type === "bot";
    const message: Message = {
      id: generateUniqueId(chatMessage.type),
      type: chatMessage.type,
      content: chatMessage.content,
      timestamp: chatMessage.timestamp.toDate(),
      firebaseId: chatMessage.id,
    };

    if (isBot) {
      const tasks: Task[] =
        chatMessage.version === 1
          ? [
            { id: "1", label: "Analyzing Requirements" },
            { id: "2", label: "Setting up Project Structure" },
            { id: "3", label: "Writing the code" },
            { id: "4", label: "Finalizing Application" },
          ]
          : [
            { id: "1", label: "Analyzing Requirements" },
            { id: "2", label: "Writing the code" },
            { id: "3", label: "Finalizing Application" },
          ];

      message.hasProgressTracker = true;
      message.progressTasks = tasks;
      message.progressVersion = chatMessage.version;
      message.completedTasks = new Set(tasks.map((task) => task.id));
    }

    return message;
  };

  const handleTrackerCompletion = (messageId: string) => {
    setCompletedTrackers((prev) => new Set(prev).add(messageId));
  };

  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
    });
  };

  // Initialize Speech Recognition
  // Update inputText when transcript changes
  useEffect(() => {
    if (transcript) {
      setInputText((prev) => {
        const newText = prev + transcript;
        resetTranscript(); // Clear transcript after adding to input
        return newText;
      });
    }
  }, [transcript, resetTranscript]);

  // Sync listening state
  useEffect(() => {
    setIsListening(listening);
  }, [listening]);

  // Toggle voice input
  const toggleVoiceInput = () => {
    if (!browserSupportsSpeechRecognition) {
      toast.error("Voice input not supported", {
        description: "Your browser doesn't support speech recognition",
      });
      return;
    }

    if (listening) {
      SpeechRecognition.stopListening();
      setIsListening(false);
      toast.info("Listening stopped");
    } else {
      SpeechRecognition.startListening({
        continuous: true,
        language: "en-US",
      });
      setIsListening(true);
      toast.success("Listening started", {
        description: "Speak now...",
        duration: 2000,
      });
    }
  };

  // Load project data and chat history
  useEffect(() => {
    const loadProjectAndChat = async () => {
      if (!projectId) return;

      try {
        setIsLoadingProject(true);

        const project = await getProject(projectId);
        if (!project) {
          console.error("Project not found");
          toast.error("Project not found");
          return;
        }

        setAppName(project.name);
        setAppIdea(project.prompt);

        const hasChatHistory = await chatExists(projectId);

        if (hasChatHistory) {
          const chatHistory = await getChatHistory(projectId);
          const convertedMessages = chatHistory.map(convertFirebaseMessage);
          setMessages(convertedMessages);

          const latestBotMessage = chatHistory
            .filter((msg) => msg.type === "bot" && msg.appCode)
            .sort((a, b) => b.version - a.version)[0];

          if (latestBotMessage?.appCode) {
            setCurrentCode(latestBotMessage.appCode);
            onCodeGenerated?.(latestBotMessage.appCode);
          }

          const botMessageIds = convertedMessages
            .filter((msg) => msg.type === "bot" && msg.hasProgressTracker)
            .map((msg) => msg.id);
          setCompletedTrackers(new Set(botMessageIds));

          toast.success("Project loaded successfully");
        } else {
          hasInitialized.current = false;
          initializeChat(project.prompt);
        }
      } catch (error) {
        console.error("Error loading project and chat:", error);
        toast.error("Failed to load project", {
          description: "Please try refreshing the page",
        });
      } finally {
        setIsLoadingProject(false);
      }
    };

    loadProjectAndChat();
  }, [projectId]);

  // Auto-scroll and scroll button visibility
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const container = messageContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isNearBottom);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputText]);

  // Initialize chat
  const initializeChat = async (prompt: string) => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    setIsGeneratingResponse(true);
    toast.info("Starting app generation...");

    const userMessage: Message = {
      id: generateUniqueId("user"),
      type: "user",
      content: prompt,
      timestamp: new Date(),
    };
    setMessages([userMessage]);

    try {
      await saveChatMessage(projectId, {
        version: 1,
        type: "user",
        content: prompt,
      });

      const [generatedAppName, botResponse] = await Promise.all([
        generateAppName(prompt),
        generateMessage(prompt, appName, false),
      ]);

      await updateProjectName(projectId, generatedAppName);
      setAppName(generatedAppName);

      const tasks: Task[] = [
        { id: "1", label: "Analyzing Requirements" },
        { id: "2", label: "Setting up Project Structure" },
        { id: "3", label: "Writing the code" },
        { id: "4", label: "Finalizing Application" },
      ];

      const botMessageId = generateUniqueId("bot");
      setLatestProgressTrackerId(botMessageId);
      const botMessage: Message = {
        id: botMessageId,
        type: "bot",
        content: botResponse,
        timestamp: new Date(),
        hasProgressTracker: true,
        progressTasks: tasks,
        progressVersion: 1,
        completedTasks: new Set(),
      };
      setMessages((prev) => [...prev, botMessage]);

      // Step 1
      setMessages((prev) =>
        prev.map((m) =>
          m.id === botMessageId
            ? { ...m, completedTasks: new Set(m.completedTasks).add("1") }
            : m
        )
      );

      // Step 2
      const appArchitecture = await generateAppArchitecture(
        prompt,
        generatedAppName
      );
      setMessages((prev) =>
        prev.map((m) =>
          m.id === botMessageId
            ? { ...m, completedTasks: new Set(m.completedTasks).add("2") }
            : m
        )
      );

      // Step 3
      const appCode = await generateCode(prompt, appName, appArchitecture, projectId);
      setCurrentCode(appCode);
      onCodeGenerated?.(appCode);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === botMessageId
            ? { ...m, completedTasks: new Set(m.completedTasks).add("3") }
            : m
        )
      );

      // Step 4
      setMessages((prev) =>
        prev.map((m) =>
          m.id === botMessageId
            ? { ...m, completedTasks: new Set(m.completedTasks).add("4") }
            : m
        )
      );

      const botFirebaseId = await saveChatMessage(projectId, {
        version: 1,
        type: "bot",
        content: botResponse,
        appArchitecture,
        appCode,
      });

      setMessages((prev) =>
        prev.map((m) =>
          m.id === botMessageId ? { ...m, firebaseId: botFirebaseId } : m
        )
      );

      handleTrackerCompletion(botMessageId);
      toast.success("Code generated successfully!", {
        description: "Your app is ready to preview",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error during initial generation:", error);
      const errorMessage: Message = {
        id: generateUniqueId("error"),
        type: "bot",
        content: "I'm sorry, an error occurred while building your app.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      toast.error("Generation failed", {
        description: "Please try again or contact support",
      });
    } finally {
      setIsGeneratingResponse(false);
    }
  };

  // Check chat limit on component mount and after each message
  useEffect(() => {
    const checkLimit = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const status = await checkAndUpdateChatLimit(user.uid);
        setChatLimitStatus(status);

        // Show warning when user has 2 or fewer chats remaining (and not premium)
        if (!status.isPremium && status.remaining <= 2 && status.remaining > 0) {
          setShowLimitWarning(true);
        }
      } catch (error) {
        console.error('Error checking chat limit:', error);
      }
    };

    if (!isLoadingProject) {
      checkLimit();
    }
  }, [messages.length, isLoadingProject]);

  // Handle follow-up messages
  const handleSendMessage = async () => {
    if (!inputText.trim() || isGeneratingResponse) return;

    const user = auth.currentUser;
    if (!user) {
      toast.error("Please sign in to continue");
      return;
    }

    // Check chat limit before proceeding
    try {
      const limitStatus = await checkAndUpdateChatLimit(user.uid);

      if (!limitStatus.canSendMessage) {
        // const resetTime = limitStatus.resetsAt.toLocaleTimeString('en-US', {
        //   hour: 'numeric',
        //   minute: '2-digit',
        //   hour12: true
        // });

        if (limitStatus.isPremium) {
          toast.error("Monthly credit limit reached", {
            description: `You've used all ${limitStatus.total} monthly credits. Credits will reset on your next billing date.`,
            duration: 6000,
            action: {
              label: "Manage Subscription",
              onClick: () => {
                // Navigate to settings page
                window.location.href = "/settings/subscription";
              },
            },
          });
        } else {
          // Better logic to distinguish between daily and monthly limits
          const resetTime = limitStatus.resetsAt.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          });
          
          // Check if it's a monthly limit (30) or daily limit (5)
          const isMonthlyLimit = limitStatus.total === FREE_TIER_MONTHLY_LIMIT;
          
          if (isMonthlyLimit) {
            toast.error("Monthly free limit reached", {
              description: `You've used all ${limitStatus.total} free credits for this month. Upgrade to Go or Pro for more!`,
              duration: 6000,
              action: {
                label: "Upgrade",
                onClick: () => {
                  window.location.href = "/pricing"; // Update with actual pricing page route
                },
              },
            });
          } else {
            toast.error("Daily chat limit reached", {
              description: `You've used all ${limitStatus.total} free chats today. Limit resets at midnight (${resetTime}). Upgrade to Premium for unlimited daily chats!`,
              duration: 6000,
              action: {
                label: "Upgrade",
                onClick: () => {
                  window.location.href = "/pricing"; // Update with actual pricing page route
                },
              },
            });
          }
        }
        return;
      }
    } catch (error) {
      console.error('Error checking limit:', error);
      toast.error("Failed to verify chat limit", {
        description: "Please try again",
      });
      return;
    }

    // Stop listening if active
    if (listening) {
      SpeechRecognition.stopListening();
      setIsListening(false);
    }

    const userMessage: Message = {
      id: generateUniqueId("user"),
      type: "user",
      content: inputText,
      timestamp: new Date(),
    };
    const currentInput = inputText;
    setInputText("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    setMessages((prev) => [...prev, userMessage]);
    setIsGeneratingResponse(true);
    toast.info("Processing your request...");

    try {
      // Increment chat count for free users
      await incrementChatCount(user.uid);

      // Update limit status after increment
      const newStatus = await checkAndUpdateChatLimit(user.uid);
      setChatLimitStatus(newStatus);

      const lastVersion = messages.reduce(
        (max, msg) => Math.max(max, msg.progressVersion || 0),
        0
      );
      const newVersion = lastVersion + 1;

      await saveChatMessage(projectId, {
        version: newVersion,
        type: "user",
        content: currentInput,
      });

      const botResponse = await generateMessage(currentInput, appName, true);

      const tasks: Task[] = [
        { id: "1", label: "Analyzing Requirements" },
        { id: "2", label: "Writing the code" },
        { id: "3", label: "Finalizing Application" },
      ];

      const botMessageId = generateUniqueId("bot");
      setLatestProgressTrackerId(botMessageId);
      const botMessage: Message = {
        id: botMessageId,
        type: "bot",
        content: botResponse,
        timestamp: new Date(),
        hasProgressTracker: true,
        progressTasks: tasks,
        progressVersion: newVersion,
        completedTasks: new Set(),
      };
      setMessages((prev) => [...prev, botMessage]);

      // Step 1
      setMessages((prev) =>
        prev.map((m) =>
          m.id === botMessageId
            ? { ...m, completedTasks: new Set(m.completedTasks).add("1") }
            : m
        )
      );

      // Step 2
      const improvedCode = await generateImproveCode(
        currentCode,
        currentInput,
        appName,
        appIdea,
        projectId
      );
      setCurrentCode(improvedCode);
      onCodeGenerated?.(improvedCode);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === botMessageId
            ? { ...m, completedTasks: new Set(m.completedTasks).add("2") }
            : m
        )
      );

      // Step 3
      setMessages((prev) =>
        prev.map((m) =>
          m.id === botMessageId
            ? { ...m, completedTasks: new Set(m.completedTasks).add("3") }
            : m
        )
      );

      const botFirebaseId = await saveChatMessage(projectId, {
        version: newVersion,
        type: "bot",
        content: botResponse,
        appCode: improvedCode,
      });

      setMessages((prev) =>
        prev.map((m) =>
          m.id === botMessageId ? { ...m, firebaseId: botFirebaseId } : m
        )
      );

      handleTrackerCompletion(botMessageId);

      // Show appropriate success message based on remaining chats
      // Show appropriate success message based on remaining chats
      if (newStatus.isPremium) {
        toast.success("Code updated successfully!", {
          description: `${newStatus.remaining} credits remaining this month`,
          duration: 3000,
        });
      } else if (newStatus.remaining > 0) {
        toast.success("Code updated successfully!", {
          description: `${newStatus.remaining} chat${newStatus.remaining !== 1 ? 's' : ''} remaining today`,
          duration: 3000,
        });
      } else {
        toast.success("Code updated successfully!", {
          description: "This was your last free chat today. Upgrade for unlimited!",
          duration: 5000,
          action: {
            label: "Upgrade",
            onClick: () => console.log("Navigate to upgrade"),
          },
        });
      }
    } catch (error) {
      console.error("Error generating improvement:", error);
      const errorMessage: Message = {
        id: generateUniqueId("error-followup"),
        type: "bot",
        content:
          "I encountered an issue while applying the changes. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      toast.error("Update failed", {
        description: "Please try again or rephrase your request",
      });
    } finally {
      setIsGeneratingResponse(false);
    }
  };

  // Event Handlers
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage();
  };

  // Loading State
  if (isLoadingProject) {
    return (
      <div className="flex flex-col h-screen bg-[#18181b] text-white font-sans">
        <Toaster position="bottom-right" theme="dark" richColors />
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-gray-400">Loading project...</p>
          </div>
        </div>
      </div>
    );
  }

  // Main Render
  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-[#18181b] via-[#1a1a1f] to-[#18181b] text-white">
      <Toaster position="bottom-right" theme="dark" richColors />

      {/* Header */}
      <div className="flex items-center justify-between h-16 px-6 bg-[#18181b]/80 backdrop-blur-xl border-b border-zinc-800/50 shadow-lg">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            {appName}
          </h1>
          {chatLimitStatus && !chatLimitStatus.isPremium && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800/50 rounded-full border border-zinc-700/50">
              <div className={cn(
                "w-2 h-2 rounded-full",
                chatLimitStatus.remaining > 2 ? "bg-emerald-500" :
                  chatLimitStatus.remaining > 0 ? "bg-yellow-500" : "bg-red-500"
              )} />
              <span className="text-xs font-medium text-gray-300">
                {chatLimitStatus.remaining}/{chatLimitStatus.total} chats left
              </span>
            </div>
          )}
          {chatLimitStatus?.isPremium && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full border border-purple-500/30">
              <div className={cn(
                "w-2 h-2 rounded-full",
                chatLimitStatus.remaining > 10 ? "bg-emerald-500" :
                  chatLimitStatus.remaining > 0 ? "bg-yellow-500" : "bg-red-500"
              )} />
              <span className="text-xs font-semibold text-purple-300">
                {chatLimitStatus.remaining}/{chatLimitStatus.total} credits left
              </span>
            </div>
          )}
        </div>
        <div className="relative">
          <button
            onClick={() => setShowOverflowMenu(!showOverflowMenu)}
            className="p-2 hover:bg-zinc-800/50 rounded-lg transition-all duration-200 hover:scale-105"
          >
            <MoreVertical className="w-5 h-5 text-gray-400" />
          </button>
          {showOverflowMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowOverflowMenu(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-48 bg-[#1c1c20] border border-zinc-800 rounded-xl shadow-2xl z-20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <button
                  onClick={() => {
                    onRename?.();
                    setShowOverflowMenu(false);
                  }}
                  className="w-full px-4 py-3 text-left text-sm hover:bg-zinc-800/50 transition-colors flex items-center gap-3"
                >
                  <PencilLine className="w-4 h-4 text-gray-400" />
                  Rename Project
                </button>
                <div className="h-px bg-zinc-800" />
                <button
                  onClick={() => {
                    onDelete?.();
                    setShowOverflowMenu(false);
                  }}
                  className="w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-3"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Delete Project
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Chat Limit Warning Banner */}
      {showLimitWarning && chatLimitStatus && !chatLimitStatus.isPremium && chatLimitStatus.remaining <= 2 && chatLimitStatus.remaining > 0 && (
        <div className="mx-4 mt-4 p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-yellow-400">
                Only {chatLimitStatus.remaining} chat{chatLimitStatus.remaining !== 1 ? 's' : ''} remaining today
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Resets at midnight • Upgrade to Premium for unlimited chats and exclusive features
              </p>
            </div>
            <button
              onClick={() => setShowLimitWarning(false)}
              className="text-gray-400 hover:text-gray-300 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Messages */}
      <div
        ref={messageContainerRef}
        className="flex-1 overflow-y-auto px-4 py-6 space-y-6 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent"
      >
        {messages.map((message, index) => (
          <div
            key={message.id}
            className={cn(
              "flex items-start gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500",
              message.type === "user" ? "justify-end" : "justify-start"
            )}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {message.type === "bot" && (
              <div className="w-10 h-10 bg-gradient-to-r from-[#5b21b6] to-[#1e40af] rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/30">
                <Bot className="w-5 h-5 text-white" />
              </div>
            )}

            <div
              className={cn(
                "flex flex-col max-w-[85%] md:max-w-[70%]",
                message.type === "user" ? "items-end" : "items-start"
              )}
            >
              <div
                className={cn(
                  "px-5 py-3 rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl",
                  message.type === "user"
                    ? "bg-gradient-to-r from-[#5b21b6] to-[#1e40af] text-white"
                    : "bg-[#1c1c20] border border-zinc-800/50 text-gray-100"
                )}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
              </div>

              {message.hasProgressTracker && message.progressTasks && (
                <div className="mt-3 w-full max-w-md bg-[#1c1c20] border border-zinc-800/50 rounded-2xl p-5 shadow-xl space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                        <Check className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-white">
                          Version {message.progressVersion}
                        </p>
                        {message.id === latestProgressTrackerId ? (
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <p className="text-xs font-semibold text-emerald-400 tracking-wider">
                              CURRENT
                            </p>
                          </div>
                        ) : (
                          <p className="text-xs font-medium text-gray-500 tracking-wide mt-0.5">
                            Completed
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-gray-300 bg-zinc-800/50 rounded-full px-3 py-1.5 border border-zinc-700/50">
                      {message.completedTasks?.size || 0}/
                      {message.progressTasks.length}
                    </div>
                  </div>

                  <ProgressTrackerComponent
                    tasks={message.progressTasks}
                    completedTasks={message.completedTasks || new Set()}
                    isAnimating={!completedTrackers.has(message.id)}
                  />
                </div>
              )}

              {completedTrackers.has(message.id) && (
                <div className="mt-3 flex items-center gap-3 w-full max-w-md bg-gradient-to-r from-zinc-800/50 to-zinc-900/50 backdrop-blur-sm rounded-2xl px-5 py-4 border border-zinc-700/50 shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <p className="flex-1 text-sm font-medium text-gray-200">
                    Preview updated successfully
                  </p>
                  <button className="text-sm font-semibold bg-gradient-to-r from-[#5b21b6] to-[#1e40af] hover:from-[#5b21b6] hover:to-[#1e40af]  px-4 py-2 rounded-lg transition-all duration-200 text-white shadow-lg hover:shadow-xl hover:scale-105">
                    View
                  </button>
                </div>
              )}
            </div>

            {message.type === "user" && (
              <div className="w-10 h-10 bg-gradient-to-br from-zinc-700 to-zinc-800 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg border border-zinc-700/50">
                <User className="w-5 h-5 text-gray-300" />
              </div>
            )}
          </div>
        ))}

        {isGeneratingResponse &&
          !messages[messages.length - 1]?.hasProgressTracker && (
            <div className="flex items-start gap-3 justify-start animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/30">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-[#1c1c20] border border-zinc-800/50 px-5 py-4 rounded-2xl shadow-xl">
                <div className="flex items-center gap-2 text-sm text-gray-300 font-medium">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                  Thinking...
                </div>
              </div>
            </div>
          )}

        <div ref={messagesEndRef} />
      </div>

      {/* Scroll to Bottom Button */}
      {showScrollButton && (
        <button
          onClick={() => scrollToBottom()}
          className="absolute bottom-28 right-8 w-10 h-10 bg-zinc-800 hover:bg-zinc-700 rounded-full flex items-center justify-center shadow-xl border border-zinc-700 transition-all duration-200 hover:scale-110 animate-in fade-in slide-in-from-bottom-2 z-10"
        >
          <ChevronDown className="w-5 h-5 text-gray-300" />
        </button>
      )}

      {/* Input Area */}
      <div className="bg-[#18181b]/80 backdrop-blur-xl border-t border-zinc-800/50 px-4 py-4">
        <div className="w-full max-w-4xl mx-auto">
          <div
            className={cn(
              "rounded-2xl p-[2px] transition-all duration-300",
              isFocused
                ? "bg-gradient-to-r from-blue-500 via-purple-600 to-emerald-500 shadow-lg shadow-blue-500/20"
                : "bg-zinc-800/50"
            )}
          >
            <div className="rounded-2xl bg-[#18181b]">
              <form onSubmit={handleSubmit} className="p-4">
                <div className="flex items-start gap-2">
                  <textarea
                    ref={textareaRef}
                    value={inputText}
                    onChange={(e) => {
                      setInputText(e.target.value);
                      const textarea = textareaRef.current;
                      if (textarea) {
                        textarea.style.height = "auto";
                        const lineHeight = 24;
                        const maxHeight = lineHeight * 5;
                        const newHeight = Math.min(
                          textarea.scrollHeight,
                          maxHeight
                        );
                        textarea.style.height = `${newHeight}px`;
                      }
                    }}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    onKeyDown={handleKeyPress}
                    placeholder="Ask for improvements or changes..."
                    rows={1}
                    disabled={isGeneratingResponse}
                    className="flex-1 bg-transparent resize-none outline-none placeholder:text-gray-500 text-white text-base leading-relaxed scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent disabled:opacity-50 disabled:cursor-not-allowed overflow-y-auto"
                    style={{ minHeight: "24px", maxHeight: "120px" }}
                  />
                  <button
                    type="submit"
                    disabled={!inputText.trim() || isGeneratingResponse}
                    className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 flex-shrink-0",
                      inputText.trim() && !isGeneratingResponse
                        ? "bg-gradient-to-r from-[#5b21b6] to-[#1e40af] hover:from-[#5b21b6] hover:to-[#1e40af] shadow-lg shadow-blue-500/30 hover:scale-105 hover:shadow-xl"
                        : "bg-zinc-800/50 cursor-not-allowed"
                    )}
                  >
                    {isGeneratingResponse ? (
                      <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                    ) : (
                      <Send
                        className={cn(
                          "w-5 h-5 transition-colors",
                          inputText.trim() ? "text-white" : "text-gray-600"
                        )}
                      />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-800/50">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={isGeneratingResponse}
                      className="p-2 text-gray-500 hover:text-gray-300 hover:bg-zinc-800/50 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Attach file (Coming soon)"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                        />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={toggleVoiceInput}
                      disabled={isGeneratingResponse}
                      className={cn(
                        "p-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
                        isListening
                          ? "text-red-500 bg-red-500/10 hover:bg-red-500/20 animate-pulse"
                          : "text-gray-500 hover:text-gray-300 hover:bg-zinc-800/50"
                      )}
                      title={isListening ? "Stop listening" : "Voice input"}
                    >
                      {isListening ? (
                        <Square className="w-5 h-5 fill-current" />
                      ) : (
                        <Mic className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 font-medium">
                      {inputText.length > 0 && (
                        <span className="animate-in fade-in duration-200">
                          {inputText.length} characters
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Helpful Hint */}
          {messages.length === 0 && !isGeneratingResponse && (
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500 animate-in fade-in duration-500">
                💡 Tip: Be specific with your requests for best results
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
