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
  Eye,
} from "lucide-react";
import { ProgressTracker, Task } from "@/components/ui/Progress-tracker";
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
  type ChatMessage,
} from "@/lib/firebase";

// --- Interfaces and Helpers ---
interface Message {
  id: string;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
  hasProgressTracker?: boolean;
  progressTasks?: Task[];
  progressVersion?: number;
  completedTasks?: Set<string>;
  firebaseId?: string; // Track Firebase document ID
}

interface ChatProps {
  projectId: string;
  onRename?: () => void;
  onDelete?: () => void;
  onCodeGenerated?: (code: string) => void;
}

const getCompletedTasks = (tasks?: Task[], completed?: Set<string>) => {
  if (!tasks || !completed) return 0;
  return completed.size;
};

// --- Component ---
export default function Chat({
  projectId,
  onRename,
  onDelete,
  onCodeGenerated,
}: ChatProps) {
  // --- State and Refs ---
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
  const hasInitialized = useRef(false);
  const messageIdCounter = useRef(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Helper function to generate unique message IDs
  const generateUniqueId = (prefix: string) => {
    messageIdCounter.current += 1;
    return `${prefix}-${Date.now()}-${messageIdCounter.current}`;
  };

  // Convert Firebase ChatMessage to local Message format
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

  // --- Effects ---

  // Load project data and chat history
  useEffect(() => {
    const loadProjectAndChat = async () => {
      if (!projectId) return;

      try {
        setIsLoadingProject(true);
        //console.log("Loading project and chat history for:", projectId);

        // Load project data
        const project = await getProject(projectId);
        if (!project) {
          console.error("Project not found");
          return;
        }

        setAppName(project.name);
        setAppIdea(project.prompt);

        // Check if chat history exists
        const hasChatHistory = await chatExists(projectId);

        if (hasChatHistory) {
          // Load existing chat history
          const chatHistory = await getChatHistory(projectId);
          const convertedMessages = chatHistory.map(convertFirebaseMessage);
          setMessages(convertedMessages);

          // Find the latest code from chat history
          const latestBotMessage = chatHistory
            .filter((msg) => msg.type === "bot" && msg.appCode)
            .sort((a, b) => b.version - a.version)[0];

          if (latestBotMessage?.appCode) {
            setCurrentCode(latestBotMessage.appCode);
            onCodeGenerated?.(latestBotMessage.appCode);
          }

          // Mark all trackers as completed since they're from history
          const botMessageIds = convertedMessages
            .filter((msg) => msg.type === "bot" && msg.hasProgressTracker)
            .map((msg) => msg.id);
          setCompletedTrackers(new Set(botMessageIds));
        } else {
          // Initialize chat with the project's initial prompt
          hasInitialized.current = false;
          initializeChat(project.prompt);
        }
      } catch (error) {
        console.error("Error loading project and chat:", error);
      } finally {
        setIsLoadingProject(false);
      }
    };

    loadProjectAndChat();
  }, [projectId]);

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-resize the textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputText]);

  // --- Core Logic ---

  // Marks a progress tracker as "finished" to stop its animations
  const handleTrackerCompletion = (messageId: string) => {
    setCompletedTrackers((prev) => new Set(prev).add(messageId));
  };

  // Handles the very first user prompt to generate the initial app
  const initializeChat = async (prompt: string) => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    setIsGeneratingResponse(true);
    const userMessage: Message = {
      id: generateUniqueId("user"),
      type: "user",
      content: prompt,
      timestamp: new Date(),
    };
    setMessages([userMessage]);
    //console.log("\n\nInitializing chat with prompt:", prompt);

    try {
      // Save user message to Firebase
      await saveChatMessage(projectId, {
        version: 1,
        type: "user",
        content: prompt,
      });

      // Generate app name and bot response
      const [generatedAppName, botResponse] = await Promise.all([
        generateAppName(prompt),
        generateMessage(prompt, appName, false),
      ]);

      // Update project name in Firebase
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

      // --- Initial Generation Pipeline ---
      // Step 1: Analyzing Requirements
      setMessages((prev) =>
        prev.map((m) =>
          m.id === botMessageId
            ? { ...m, completedTasks: new Set(m.completedTasks).add("1") }
            : m
        )
      );

      // Step 2: Generate app architecture
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

      // Step 3: Generate code
      const appCode = await generateCode(prompt, appName, appArchitecture);
      setCurrentCode(appCode);
      onCodeGenerated?.(appCode);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === botMessageId
            ? { ...m, completedTasks: new Set(m.completedTasks).add("3") }
            : m
        )
      );

      // Step 4: Finalize
      setMessages((prev) =>
        prev.map((m) =>
          m.id === botMessageId
            ? { ...m, completedTasks: new Set(m.completedTasks).add("4") }
            : m
        )
      );

      // Save bot message to Firebase with architecture and code
      const botFirebaseId = await saveChatMessage(projectId, {
        version: 1,
        type: "bot",
        content: botResponse,
        appArchitecture,
        appCode,
      });

      // Update local message with Firebase ID
      setMessages((prev) =>
        prev.map((m) =>
          m.id === botMessageId ? { ...m, firebaseId: botFirebaseId } : m
        )
      );

      handleTrackerCompletion(botMessageId);
    } catch (error) {
      console.error("Error during initial generation:", error);
      const errorMessage: Message = {
        id: generateUniqueId("error"),
        type: "bot",
        content: "I'm sorry, an error occurred while building your app.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsGeneratingResponse(false);
    }
  };

  // Handles all subsequent "follow-up" messages to improve the code
  const handleSendMessage = async () => {
    if (!inputText.trim() || isGeneratingResponse) return;

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

    try {
      // Determine the next version number
      const lastVersion = messages.reduce(
        (max, msg) => Math.max(max, msg.progressVersion || 0),
        0
      );
      const newVersion = lastVersion + 1;

      // Save user message to Firebase
      await saveChatMessage(projectId, {
        version: newVersion,
        type: "user",
        content: currentInput,
      });

      // Generate conversational response
      const botResponse = await generateMessage(currentInput, appName, true);

      // Define the tasks for the improvement process
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

      // --- Improvement Pipeline ---
      // Step 1: Analyzing Requirements
      setMessages((prev) =>
        prev.map((m) =>
          m.id === botMessageId
            ? { ...m, completedTasks: new Set(m.completedTasks).add("1") }
            : m
        )
      );

      // Step 2: Generate improved code
      const improvedCode = await generateImproveCode(currentCode, currentInput, appName, appIdea);
      setCurrentCode(improvedCode);
      onCodeGenerated?.(improvedCode);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === botMessageId
            ? { ...m, completedTasks: new Set(m.completedTasks).add("2") }
            : m
        )
      );

      // Step 3: Finalize
      setMessages((prev) =>
        prev.map((m) =>
          m.id === botMessageId
            ? { ...m, completedTasks: new Set(m.completedTasks).add("3") }
            : m
        )
      );

      // Save bot message to Firebase with improved code
      const botFirebaseId = await saveChatMessage(projectId, {
        version: newVersion,
        type: "bot",
        content: botResponse,
        appCode: improvedCode,
      });

      // Update local message with Firebase ID
      setMessages((prev) =>
        prev.map((m) =>
          m.id === botMessageId ? { ...m, firebaseId: botFirebaseId } : m
        )
      );

      handleTrackerCompletion(botMessageId);
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
    } finally {
      setIsGeneratingResponse(false);
    }
  };

  // --- Event Handlers ---
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

  const handleVoiceInput = () => console.log("Voice input activated");

  // Show loading state
  if (isLoadingProject) {
    return (
      <div className="flex flex-col h-screen bg-[#18181b] text-white font-sans">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-gray-400">Loading project...</p>
          </div>
        </div>
      </div>
    );
  }

  // --- JSX ---
  return (
    <div className="flex flex-col h-full bg-[#18181b] text-white font-sans">
      {/* Top Bar */}
      <div className="flex items-center justify-between h-14 px-4 py-3 bg-[#18181b] border-b border-[#252529]">
        <h1 className="text-lg font-bold text-white">{appName}</h1>
        <div className="relative">
          <button
            onClick={() => setShowOverflowMenu(!showOverflowMenu)}
            className="p-2 hover:bg-[#252529] rounded-full"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
          {showOverflowMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-[#18181b] border border-[#252529] rounded-lg shadow-lg z-10">
              <button
                onClick={() => {
                  onRename?.();
                  setShowOverflowMenu(false);
                }}
                className="w-full px-4 py-2 text-left hover:bg-[#252529] transition-colors"
              >
                Rename
              </button>
              <button
                onClick={() => {
                  onDelete?.();
                  setShowOverflowMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-red-400 hover:bg-[#252529] transition-colors"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Message Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start space-x-3 ${
              message.type === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {message.type === "bot" && (
              <div className="w-8 h-8 bg-[#252529] rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-gray-400" />
              </div>
            )}
            <div
              className={`flex flex-col max-w-[85%] ${
                message.type === "user" ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-xl ${
                  message.type === "user"
                    ? "bg-gradient-to-r from-[#7b61ff] to-[#00ccb1]"
                    : "bg-[#252529]"
                }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
              </div>
              {message.hasProgressTracker && message.progressTasks && (
                <div className="mt-2 w-full max-w-md bg-[#1c1c20] border border-[#252529] rounded-xl p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                        <Check className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div>
                        <p className="font-bold">
                          Version {message.progressVersion}
                        </p>
                        {message.id === latestProgressTrackerId ? (
                          <p className="text-xs font-semibold text-[#00ccb1] tracking-wider">
                            CURRENT
                          </p>
                        ) : (
                          <p className="text-xs font-semibold text-gray-500 tracking-wider">
                            Version {message.progressVersion}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-sm font-medium text-gray-400 bg-[#252529] rounded-full px-2.5 py-1">
                      {getCompletedTasks(
                        message.progressTasks,
                        message.completedTasks
                      )}
                      /{message.progressTasks.length}
                    </div>
                  </div>
                  <ProgressTracker
                    initialTasks={message.progressTasks}
                    completedTasks={message.completedTasks || new Set()}
                    isLatest={!completedTrackers.has(message.id)}
                  />
                </div>
              )}
              {completedTrackers.has(message.id) && (
                <div className="mt-2 flex items-center gap-3 w-full max-w-md bg-[#252529] text-gray-200 rounded-xl px-4 py-3 border border-[#2a2a2e]">
                  <Eye className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <p className="flex-1 text-sm">
                    Preview updated. You can now see the result.
                  </p>
                  <button className="text-sm font-semibold bg-gradient-to-r from-[#7b61ff] to-[#00ccb1] hover:from-[#6a52e5] hover:to-[#00b3a0] px-3 py-1 rounded-md transition-all text-white">
                    Go to Preview
                  </button>
                </div>
              )}
            </div>
            {message.type === "user" && (
              <div className="w-8 h-8 bg-[#252529] rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5" />
              </div>
            )}
          </div>
        ))}
        {isGeneratingResponse &&
          !messages[messages.length - 1]?.hasProgressTracker && (
            <div className="flex items-start space-x-3 justify-start">
              <div className="w-8 h-8 bg-[#252529] rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-gray-400" />
              </div>
              <div className="bg-[#252529] px-4 py-3 rounded-xl">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  Thinking
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          )}
        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Input Bar */}
      <div className="bg-[#18181b] border-t border-[#252529] px-4 py-3">
        <div className="w-full max-w-4xl mx-auto">
          <div
            className={cn(
              "rounded-2xl p-[1px] transition-all duration-300",
              isFocused
                ? "bg-gradient-to-r from-[#00ccb1] via-[#7b61ff] to-[#1ca0fb]"
                : "bg-[#252529]"
            )}
          >
            <div className="rounded-2xl bg-[#18181b]">
              <form onSubmit={handleSubmit} className="p-2 sm:p-3">
                <div className="flex items-start gap-2 sm:gap-4">
                  <textarea
                    ref={textareaRef}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask VibeKode for follow up improvement"
                    rows={1}
                    disabled={isGeneratingResponse}
                    className="flex-1 bg-transparent resize-none outline-none placeholder:text-gray-400 text-white text-base leading-relaxed max-h-48 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent disabled:opacity-50"
                  />
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={isGeneratingResponse}
                      className="p-2 text-gray-400 hover:text-white rounded-md transition-colors disabled:opacity-50"
                    >
                      <PencilLine className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={handleVoiceInput}
                      disabled={isGeneratingResponse}
                      className="p-2 text-gray-400 hover:text-white rounded-md transition-colors disabled:opacity-50"
                    >
                      <Mic className="w-5 h-5" />
                    </button>
                  </div>
                  <div>
                    <button
                      type="submit"
                      disabled={!inputText.trim() || isGeneratingResponse}
                      className="p-2 text-gray-400 hover:text-white disabled:text-gray-600 disabled:cursor-not-allowed rounded-md transition-colors"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}