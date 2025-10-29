"use client";

import React, { useState } from "react";
import { X, CreditCard, Info, Zap, AlertCircle, Mail, Book, Users, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import * as Dialog from "@radix-ui/react-dialog";
import * as Tooltip from "@radix-ui/react-tooltip";

// --- TYPES & CONSTANTS ---
interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Tab = "credits" | "info" | "features";

const tabs = [
  { id: "credits" as Tab, label: "Credits", icon: CreditCard },
  { id: "info" as Tab, label: "Info", icon: Info },
  { id: "features" as Tab, label: "Early Access", icon: Zap },
];

// --- HELPER & REUSABLE COMPONENTS ---
const TooltipProvider = ({ children, content }: { children: React.ReactNode; content: string }) => (
  <Tooltip.Provider delayDuration={100}>
    <Tooltip.Root>
      <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          side="bottom"
          sideOffset={5}
          className="bg-zinc-800 text-white text-xs px-2 py-1 rounded-md shadow-lg z-[99999]"
        >
          {content}
          <Tooltip.Arrow className="fill-zinc-800" />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  </Tooltip.Provider>
);

const SettingsCard = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("bg-zinc-800/50 border border-zinc-700/60 rounded-lg p-5 sm:p-6", className)}>
    {children}
  </div>
);

// --- MAIN MODAL COMPONENT ---
export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>("credits");

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <AnimatePresence>
        {isOpen && (
          <Dialog.Portal forceMount>
            {/* Backdrop */}
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[999] bg-black/70 backdrop-blur-sm"
              />
            </Dialog.Overlay>

            {/* Modal */}
            <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
              <Dialog.Content asChild>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25, mass: 0.5 }}
                  className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl max-h-[90vh] flex flex-col"
                >
                  {/* Header */}
                  <header className="flex-shrink-0 flex items-center justify-between p-4 sm:p-6 border-b border-zinc-800">
                    <Dialog.Title className="text-xl font-bold text-white">Settings</Dialog.Title>
                    <TooltipProvider content="Close (Esc)">
                      <Dialog.Close asChild>
                        <button
                          className="p-2 text-zinc-400 rounded-lg transition-colors hover:text-white hover:bg-zinc-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 focus-visible:ring-[#7b61ff]"
                          aria-label="Close settings"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </Dialog.Close>
                    </TooltipProvider>
                  </header>

                  {/* Tabs */}
                  <nav className="flex-shrink-0 flex border-b border-zinc-800 bg-zinc-900/50">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                          "flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative focus:outline-none",
                          activeTab === tab.id
                            ? "text-white"
                            : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                        )}
                      >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                        {activeTab === tab.id && (
                          <motion.div
                            layoutId="activeSettingsTab"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#00ccb1] to-[#1ca0fb]"
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          />
                        )}
                      </button>
                    ))}
                  </nav>

                  {/* Content */}
                  <div className="flex-grow p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        {activeTab === "credits" && <CreditsTab />}
                        {activeTab === "info" && <InfoTab />}
                        {activeTab === "features" && <FeaturesTab />}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </motion.div>
              </Dialog.Content>
            </div>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}


// --- TAB CONTENT COMPONENTS ---

const CreditsTab = () => (
  <div className="space-y-6">
    <div className="bg-gradient-to-r from-[#00ccb1]/10 to-[#1ca0fb]/10 border border-[#00ccb1]/20 rounded-lg p-4 flex items-start gap-3">
      <AlertCircle className="w-5 h-5 text-[#00ccb1] flex-shrink-0 mt-0.5" />
      <div>
        <h3 className="text-[#00ccb1] font-semibold text-sm mb-1">Beta Notice</h3>
        <p className="text-zinc-300 text-sm">
          During beta, you have unlimited credits. This may change at any time without prior notification.
        </p>
      </div>
    </div>

    <SettingsCard>
      <h3 className="text-white font-semibold mb-5">Current Usage</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-zinc-400">Current Plan</span>
          <span className="text-[#00ccb1] font-medium bg-[#00ccb1]/20 px-2 py-0.5 rounded-full">Beta</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-zinc-400">Credits Remaining</span>
          <span className="text-white font-medium text-lg">∞</span>
        </div>
      </div>
      <div className="mt-5 pt-5 border-t border-zinc-700/60">
        <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
          <span>Usage this month</span>
          <span>Unlimited</span>
        </div>
        <div className="w-full bg-zinc-700/50 rounded-full h-2 overflow-hidden">
          <div className="bg-gradient-to-r from-[#00ccb1] to-[#1ca0fb] h-2 rounded-full w-full opacity-75"></div>
        </div>
      </div>
    </SettingsCard>

    <div className="bg-gradient-to-r from-[#7b61ff]/10 to-[#00ccb1]/10 border border-[#7b61ff]/20 rounded-lg p-6 text-center">
      <h3 className="text-white font-semibold mb-2">Future Plans</h3>
      <p className="text-zinc-300 text-sm mb-4 max-w-sm mx-auto">
        When beta ends, we will introduce flexible pricing plans to suit your needs. Stay tuned!
      </p>
      <button disabled className="px-4 py-2 bg-zinc-700 text-zinc-400 rounded-lg font-medium cursor-not-allowed text-sm">
        Coming Soon
      </button>
    </div>
  </div>
);

const InfoTab = () => (
  <div className="space-y-6">
    <SettingsCard>
      <h3 className="text-white font-semibold mb-4">Application Information</h3>
      <ul className="space-y-3 text-sm">
        <li className="flex justify-between">
          <span className="text-zinc-400">Version</span>
          <span className="text-white font-medium">Beta 1.0.0</span>
        </li>
        <li className="flex justify-between">
          <span className="text-zinc-400">Last Build</span>
          <span className="text-white font-medium">2025.01.02</span>
        </li>
      </ul>
    </SettingsCard>

    <SettingsCard>
      <h3 className="text-white font-semibold mb-2">About VibeKode Studio</h3>
      <p className="text-zinc-300 text-sm leading-relaxed">
        VibeKode Studio is an AI-powered web development platform designed to make creating stunning applications as easy as describing them.
      </p>
    </SettingsCard>

    <SettingsCard>
      <h3 className="text-white font-semibold mb-4">Contact & Support</h3>
      <ul className="space-y-3 text-sm">
        {[
          { icon: Mail, label: 'Email', value: 'hello.vibekode@gmail.com', href: 'mailto:hello.vibekode@gmail.com' },
          { icon: Book, label: 'Docs', value: 'docs.vibekode.com', href: 'https://docs.vibekode.com' },
          { icon: Users, label: 'Community', value: 'community.vibekode.com', href: 'https://community.vibekode.com' },
        ].map(item => (
          <li key={item.label} className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-zinc-400">
              <item.icon className="w-4 h-4" /> {item.label}
            </span>
            <a href={item.href} target="_blank" rel="noopener noreferrer" className="text-[#00ccb1] font-medium hover:underline">
              {item.value}
            </a>
          </li>
        ))}
      </ul>
    </SettingsCard>
  </div>
);

const FeaturesTab = () => {
    const features = [
        { name: "Advanced AI Models", description: "Access to latest GPT-4 and Claude models.", status: "active" },
        { name: "Custom Templates", description: "Create and share your own project templates.", status: "active" },
        { name: "API Integration", description: "Connect external APIs to your projects.", status: "active" },
        { name: "Priority Support", description: "Get faster response times and dedicated support.", status: "active" },
        { name: "Real-time Collaboration", description: "Work together with your team in real-time.", status: "coming-soon" },
        { name: "Advanced Analytics", description: "Detailed insights into your project performance.", status: "coming-soon" },
    ];
    return (
        <div className="space-y-6">
             <div className="bg-gradient-to-r from-[#7b61ff]/10 to-[#00ccb1]/10 border border-[#7b61ff]/20 rounded-lg p-4 flex items-start gap-3">
                <Zap className="w-5 h-5 text-[#7b61ff] flex-shrink-0 mt-0.5" />
                <div>
                    <h3 className="text-[#7b61ff] font-semibold text-sm mb-1">Early Access Features</h3>
                    <p className="text-zinc-300 text-sm">
                        As a beta user, you get access to cutting-edge features before they are released publicly.
                    </p>
                </div>
            </div>

            <SettingsCard>
                <ul className="divide-y divide-zinc-700/60">
                    {features.map((feature) => (
                        <li key={feature.name} className="py-4 first:pt-0 last:pb-0">
                            <div className="flex items-center justify-between">
                                <h4 className="font-medium text-white">{feature.name}</h4>
                                <span className={cn(
                                    "px-2 py-0.5 rounded-full text-xs font-medium",
                                    feature.status === "active"
                                        ? "bg-[#00ccb1]/20 text-[#00ccb1]"
                                        : "bg-yellow-500/20 text-yellow-400"
                                )}>
                                    {feature.status === "active" ? "Active" : "Soon"}
                                </span>
                            </div>
                            <p className="text-zinc-400 text-sm mt-1">{feature.description}</p>
                        </li>
                    ))}
                </ul>
            </SettingsCard>

            <SettingsCard className="text-center">
                <div className="flex justify-center mb-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-[#00ccb1] to-[#1ca0fb] rounded-full flex items-center justify-center">
                        <Star className="w-6 h-6 text-white" />
                    </div>
                </div>
                <h3 className="text-white font-semibold mb-2">Help Us Improve!</h3>
                <p className="text-zinc-300 text-sm mb-4 max-w-sm mx-auto">
                    Your feedback on these early access features is invaluable in shaping the future of VibeKode.
                </p>
                <button className="w-full sm:w-auto px-5 py-2 bg-gradient-to-r from-[#00ccb1] to-[#1ca0fb] text-white rounded-lg font-medium hover:opacity-90 transition-opacity text-sm">
                    Share Feedback
                </button>
            </SettingsCard>
        </div>
    );
};