"use client";

import React, { useState } from "react";
import { X, CreditCard, Info, Zap, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Tab = "credits" | "info" | "features";

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>("credits");

  if (!isOpen) return null;

  const tabs = [
    { id: "credits" as Tab, label: "Credits", icon: CreditCard },
    { id: "info" as Tab, label: "Info", icon: Info },
    { id: "features" as Tab, label: "Early Access", icon: Zap },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-[#18181b] border border-[#252529] rounded-xl shadow-2xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[#252529]">
            <h2 className="text-xl font-bold text-white">Settings</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-[#252529] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-[#252529]">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative",
                    activeTab === tab.id
                      ? "text-white bg-[#252529]"
                      : "text-gray-400 hover:text-white hover:bg-[#1f1f23]"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#00ccb1] to-[#1ca0fb]"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {activeTab === "credits" && <CreditsTab />}
            {activeTab === "info" && <InfoTab />}
            {activeTab === "features" && <FeaturesTab />}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

const CreditsTab = () => {
  return (
    <div className="space-y-6">
      {/* Beta Notice */}
      <div className="bg-gradient-to-r from-[#00ccb1]/10 to-[#1ca0fb]/10 border border-[#00ccb1]/20 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-[#00ccb1] flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-[#00ccb1] font-semibold text-sm mb-1">Beta Notice</h3>
            <p className="text-gray-300 text-sm">
              During beta, you have unlimited credits. Please note that this may change at any time without prior notification to users.
            </p>
          </div>
        </div>
      </div>

      {/* Current Usage */}
      <div className="bg-[#252529] rounded-lg p-6">
        <h3 className="text-white font-semibold mb-4">Current Usage</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Plan</span>
            <span className="text-[#00ccb1] font-medium">Beta (Unlimited)</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Credits Used</span>
            <span className="text-white font-medium">Unlimited</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Credits Remaining</span>
            <span className="text-[#00ccb1] font-medium">∞</span>
          </div>
        </div>

        {/* Usage Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-400">Usage this month</span>
            <span className="text-gray-400">Beta</span>
          </div>
          <div className="w-full bg-[#1a1a1e] rounded-full h-2">
            <div className="bg-gradient-to-r from-[#00ccb1] to-[#1ca0fb] h-2 rounded-full w-full opacity-50"></div>
          </div>
        </div>
      </div>

      {/* Upgrade Section */}
      <div className="bg-gradient-to-r from-[#7b61ff]/10 to-[#00ccb1]/10 border border-[#7b61ff]/20 rounded-lg p-6">
        <h3 className="text-white font-semibold mb-2">Future Plans</h3>
        <p className="text-gray-300 text-sm mb-4">
          When beta ends, we will introduce flexible pricing plans to suit your needs.
        </p>
        <button
          disabled
          className="px-4 py-2 bg-gray-700 text-gray-400 rounded-lg font-medium cursor-not-allowed"
        >
          Coming Soon
        </button>
      </div>
    </div>
  );
};

const InfoTab = () => {
  return (
    <div className="space-y-6">
      <div className="bg-[#252529] rounded-lg p-6">
        <h3 className="text-white font-semibold mb-4">Application Information</h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Version</span>
            <span className="text-white font-medium">Beta 1.0.0</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Build</span>
            <span className="text-white font-medium">2025.01.02</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Status</span>
            <span className="text-[#00ccb1] font-medium">Beta</span>
          </div>
        </div>
      </div>

      <div className="bg-[#252529] rounded-lg p-6">
        <h3 className="text-white font-semibold mb-4">About VibeKode Studio</h3>
        <p className="text-gray-300 text-sm leading-relaxed">
          VibeKode Studio is an AI-powered web development platform that helps you create stunning applications with natural language prompts. Our platform combines the power of modern AI with intuitive design tools to make web development accessible to everyone.
        </p>
      </div>

      <div className="bg-[#252529] rounded-lg p-6">
        <h3 className="text-white font-semibold mb-4">Contact & Support</h3>
        <div className="space-y-2">
          <p className="text-gray-300 text-sm">
            <span className="text-white font-medium">Email:</span> hello.vibekode@gmail.com
          </p>
          <p className="text-gray-300 text-sm">
            <span className="text-white font-medium">Documentation:</span> docs.vibekode.com
          </p>
          <p className="text-gray-300 text-sm">
            <span className="text-white font-medium">Community:</span> community.vibekode.com
          </p>
        </div>
      </div>
    </div>
  );
};

const FeaturesTab = () => {
  const features = [
    {
      name: "Advanced AI Models",
      description: "Access to latest GPT-4 and Claude models for enhanced code generation",
      status: "active",
    },
    {
      name: "Real-time Collaboration",
      description: "Work together with your team in real-time on projects",
      status: "coming-soon",
    },
    {
      name: "Custom Templates",
      description: "Create and share your own project templates",
      status: "active",
    },
    {
      name: "API Integration",
      description: "Connect external APIs and services to your projects",
      status: "active",
    },
    {
      name: "Advanced Analytics",
      description: "Detailed insights into your project performance and usage",
      status: "coming-soon",
    },
    {
      name: "Priority Support",
      description: "Get faster response times and dedicated support",
      status: "active",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-[#7b61ff]/10 to-[#00ccb1]/10 border border-[#7b61ff]/20 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Zap className="w-5 h-5 text-[#7b61ff] flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-[#7b61ff] font-semibold text-sm mb-1">Early Access Features</h3>
            <p className="text-gray-300 text-sm">
              As a beta user, you have access to cutting-edge features before they are released to the public.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {features.map((feature, index) => (
          <div key={index} className="bg-[#252529] rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-white font-medium">{feature.name}</h4>
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded-full text-xs font-medium",
                      feature.status === "active"
                        ? "bg-[#00ccb1]/20 text-[#00ccb1]"
                        : "bg-yellow-500/20 text-yellow-400"
                    )}
                  >
                    {feature.status === "active" ? "Active" : "Coming Soon"}
                  </span>
                </div>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#252529] rounded-lg p-6">
        <h3 className="text-white font-semibold mb-2">Beta Feedback</h3>
        <p className="text-gray-300 text-sm mb-4">
          Help us improve by sharing your feedback on these early access features.
        </p>
        <button className="px-4 py-2 bg-gradient-to-r from-[#00ccb1] to-[#1ca0fb] text-white rounded-lg font-medium hover:opacity-90 transition-opacity">
          Share Feedback
        </button>
      </div>
    </div>
  );
};