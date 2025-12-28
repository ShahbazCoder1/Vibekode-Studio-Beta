"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  User,
  BarChart3,
  Info,
  LogOut,
  Sparkles,
  Lock,
  Linkedin,
  MessageSquare,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  Copy,
  Check,
  Settings,
  LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import * as Dialog from "@radix-ui/react-dialog";
import { auth, db } from "@/lib/firebase";
import { doc, onSnapshot, updateDoc, increment } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";

// --- TYPES ---

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId?: string; // Optional: if provided, show project-specific options
}

interface Project {
  id: string;
  name: string;
  visibility: "public" | "private";
}

interface UserData {
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  chatUsage: {
    count: number;
    lastCheckedDate: string;
  };
  subscriptionType: "free" | "go" | "pro";
  monthlyCredits?: number;
  creditsUsed?: number;
  nextBillingDate?: string;
  paypalSubscriptionId?: string;
  subscriptionStatus?: "active" | "cancelled" | "expired" | "suspended";
  subscriptionEndDate?: string;
  privateProjectsCount?: number;
}


type Tab = "profile" | "usage" | "about" | "projects";

// --- CONSTANTS ---
// Removed unused FREE_DAILY_LIMIT

// --- REUSABLE COMPONENTS ---

const TabButton = ({
  active,
  label,
  icon: Icon,
  onClick,
}: {
  active: boolean;
  id: Tab;
  label: string;
  icon: LucideIcon;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center gap-3 w-full px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group",
      active
        ? "bg-zinc-800/80 text-white shadow-sm ring-1 ring-zinc-700"
        : "text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-200"
    )}
  >
    <Icon
      className={cn(
        "w-4 h-4 transition-colors",
        active ? "text-[#5b21b6]" : "text-zinc-500 group-hover:text-zinc-400"
      )}
    />
    {label}
  </button>
);

const SectionCard = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-5 hover:border-zinc-700/50 transition-colors",
      className
    )}
  >
    {children}
  </div>
);

// Custom Reddit Icon
const RedditIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
  </svg>
);

// Logout Confirmation Dialog
const LogoutConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) => (
  <AnimatePresence>
    {isOpen && (
      <Dialog.Root open={isOpen} onOpenChange={onClose}>
        <Dialog.Portal forceMount>
          <Dialog.Overlay asChild>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[1001] bg-black/60 backdrop-blur-sm"
            />
          </Dialog.Overlay>
          <Dialog.Content asChild>
            <div className="fixed inset-0 z-[1002] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative bg-[#09090b] border border-zinc-800 rounded-xl p-6 max-w-sm w-full shadow-2xl"
              >
                <Dialog.Title className="text-lg font-semibold text-white mb-2">
                  Sign Out?
                </Dialog.Title>

                <div className="flex items-start gap-4">
                  <div className="p-2 bg-red-500/10 rounded-lg shrink-0">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-zinc-400 mb-4">
                      Are you sure you want to sign out? You will need to log in
                      again to access your account.
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 text-sm font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={onConfirm}
                        className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    )}
  </AnimatePresence>
);

// --- VIEW COMPONENTS ---

const ProfileView = ({ userData }: { userData: UserData | null }) => {
  const [copied, setCopied] = useState(false);

  if (!userData) return null;

  const handleCopyEmail = () => {
    if (userData.email) {
      navigator.clipboard.writeText(userData.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      <SectionCard>
        <div className="flex items-start gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-zinc-900 border-4 border-zinc-800 flex items-center justify-center overflow-hidden shadow-2xl">
              {userData.photoURL ? (
                <Image
                  src={userData.photoURL}
                  alt={userData.displayName || "User"}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-10 h-10 text-zinc-600" />
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-gradient-to-r from-[#5b21b6] to-[#1e40af] rounded-full border-4 border-[#09090b] flex items-center justify-center">
              <CheckCircle2 className="w-3.5 h-3.5 text-white" />
            </div>
          </div>
          <div className="flex-1 pt-2">
            <h3 className="text-2xl font-bold text-white">
              {userData.displayName}
            </h3>
            <div className="flex items-center gap-2 mt-1.5">
              <p className="text-zinc-400 font-medium">{userData.email}</p>
              <button
                onClick={handleCopyEmail}
                className="p-1.5 hover:bg-zinc-800 rounded-md transition-colors text-zinc-500 hover:text-white"
                title="Copy email"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
            <span className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full text-xs font-semibold bg-[#5b21b6]/10 text-[#7c3aed] border border-[#5b21b6]/20">
              <Sparkles className="w-3 h-3" />
              Beta User
            </span>
          </div>
        </div>
      </SectionCard>

      <SectionCard>
        <h4 className="text-sm font-semibold text-zinc-200 mb-4 flex items-center gap-2">
          <Info className="w-4 h-4 text-zinc-500" />
          Account Details
        </h4>
        <div className="space-y-0 divide-y divide-zinc-800">
          <div className="flex justify-between py-3">
            <span className="text-sm text-zinc-500">Status</span>
            <span className="text-sm text-emerald-400 font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Active
            </span>
          </div>
          <div className="flex justify-between py-3">
            <span className="text-sm text-zinc-500">Member Since</span>
            <span className="text-sm text-zinc-300">Beta 2025</span>
          </div>
          <div className="flex justify-between py-3">
            <span className="text-sm text-zinc-500">Plan Type</span>
            <span className="text-sm text-white capitalize font-medium">
              {userData.subscriptionType} Plan
            </span>
          </div>
        </div>
      </SectionCard>
    </div>
  );
};

const UsageView = ({ userData }: { userData: UserData | null }) => {
  if (!userData) return null;

  const today = new Date().toISOString().split("T")[0];
  const subscriptionType = userData.subscriptionType || 'free';
  const isFree = subscriptionType === 'free';
  const isGo = subscriptionType === 'go';
  const subscriptionStatus = userData.subscriptionStatus || 'active';
  const isCancelled = subscriptionStatus === 'cancelled';
  const isExpired = subscriptionStatus === 'expired';
  const isSuspended = subscriptionStatus === 'suspended';

  // Constants
  const FREE_DAILY_MAX = 5;
  const FREE_MONTHLY_MAX = 30;
  const GO_MONTHLY_MAX = 50;
  const PRO_MONTHLY_MAX = 150;
  const GO_PRIVATE_LIMIT = 5;

  // Usage Data
  const dailyUsage = userData.chatUsage.lastCheckedDate === today ? userData.chatUsage.count : 0;
  const monthlyUsage = userData.creditsUsed || 0;

  // Calculate Refresh Times
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  const hoursUntilDailyReset = Math.floor((tomorrow.getTime() - now.getTime()) / (1000 * 60 * 60));

  let nextBillingDateStr = userData.nextBillingDate;
  if (!nextBillingDateStr && isFree) {
    // Estimate for free users based on simple monthly cycle if not present
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    d.setDate(1);
    nextBillingDateStr = d.toISOString();
  }

  const handleCancelClick = async () => {
    if (!userData.paypalSubscriptionId) return;
    if (!confirm("Are you sure you want to cancel your subscription? You will keep premium access until the end of the billing period.")) return;

    try {
      const idToken = await auth.currentUser?.getIdToken();
      const res = await fetch("/api/paypal/cancel-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscriptionId: userData.paypalSubscriptionId, idToken })
      });
      const data = await res.json();
      if (res.ok) {
        alert("Subscription cancelled successfully. You will retain access until the end of your billing period.");
      } else {
        alert("Failed to cancel: " + data.error);
      }
    } catch (e) {
      console.error(e);
      alert("Error cancelling subscription");
    }
  };

  // Render Progress Bar Helper
  const ProgressBar = ({ 
    label, 
    used, 
    total, 
    resetText, 
    colorClass = "bg-emerald-500" 
  }: { 
    label: string; 
    used: number; 
    total: number; 
    resetText?: string; 
    colorClass?: string;
  }) => {
    const pct = Math.min((used / total) * 100, 100);
    return (
      <div className="mb-6 last:mb-0">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
            {label}
          </h4>
          {resetText && <span className="text-xs text-zinc-500">{resetText}</span>}
        </div>
        <div className="mb-2 flex justify-between text-xs text-zinc-400">
          <span>{used} used</span>
          <span>{total} total</span>
        </div>
        <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={cn("h-full rounded-full relative", pct > 90 ? "bg-red-500" : colorClass)}
          />
        </div>
      </div>
    );
  }

  // Get status display info
  const getStatusInfo = () => {
    if (isFree) return null;

    if (isSuspended) {
      return {
        icon: AlertCircle,
        text: "Payment Failed",
        description: "Your subscription has been suspended due to payment failure. Please update your payment method.",
        color: "text-red-400",
        bgColor: "bg-red-500/10",
        borderColor: "border-red-500/20"
      };
    }

    if (isExpired) {
      return {
        icon: AlertCircle,
        text: "Subscription Expired",
        description: "Your subscription has ended. Upgrade to continue enjoying premium features.",
        color: "text-amber-400",
        bgColor: "bg-amber-500/10",
        borderColor: "border-amber-500/20"
      };
    }

    if (isCancelled) {
      const endDate = userData.subscriptionEndDate || userData.nextBillingDate;
      return {
        icon: CheckCircle2,
        text: "Subscription Cancelled",
        description: `You'll keep premium access until ${endDate ? new Date(endDate).toLocaleDateString() : 'the end of the billing period'}. After that, you'll be downgraded to the Free plan.`,
        color: "text-amber-400",
        bgColor: "bg-amber-500/10",
        borderColor: "border-amber-500/20"
      };
    }

    return null;
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-xl border border-[#5b21b6]/30 bg-gradient-to-br from-[#5b21b6]/10 via-[#1e40af]/5 to-transparent p-6">
        <div className="flex items-start justify-between relative z-10">
          <div>
            <h3 className="text-white font-bold text-lg flex items-center gap-2 capitalize">
              <Sparkles className="w-4 h-4 text-[#7c3aed]" /> {subscriptionType} Plan
            </h3>
            <p className="text-zinc-400 text-sm mt-1 max-w-sm">
              {isFree ? "You are currently on the Free tier." : `You are subscribed to the ${subscriptionType} plan.`}
            </p>
            {!isFree && userData.nextBillingDate && !isCancelled && !isExpired && (
              <p className="text-xs text-zinc-500 mt-2">
                Next billing: {new Date(userData.nextBillingDate).toLocaleDateString()}
              </p>
            )}
            {isFree && (
              <p className="text-xs text-zinc-500 mt-2">
                Monthly limit resets: {new Date(nextBillingDateStr!).toLocaleDateString()}
              </p>
            )}
          </div>

          {/* Main Big Number Display */}
          <div className="text-right">
            {isFree ? (
              <>
                <span className="block text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 to-zinc-400">
                  {Math.max(0, FREE_DAILY_MAX - dailyUsage)}
                </span>
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">
                  Daily Chats Left
                </span>
              </>
            ) : (
              <>
                <span className="block text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#5b21b6] to-[#1e40af]">
                  {Math.max(0, (subscriptionType === 'go' ? GO_MONTHLY_MAX : PRO_MONTHLY_MAX) - monthlyUsage)}
                </span>
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">
                  Credits Left
                </span>
              </>
            )}
          </div>
        </div>

        {/* Show cancel button only if active subscription */}
        {!isFree && subscriptionStatus === 'active' && userData.paypalSubscriptionId && (
          <div className="mt-4 pt-4 border-t border-zinc-700/50 flex justify-end">
            <button
              onClick={handleCancelClick}
              className="text-xs text-red-400 hover:text-red-300 transition-colors flex items-center gap-1.5"
            >
              Cancel Subscription
            </button>
          </div>
        )}
      </div>

      {/* Status Messages */}
      {statusInfo && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "p-4 rounded-xl border flex items-start gap-3",
            statusInfo.bgColor,
            statusInfo.borderColor
          )}
        >
          <div className={cn("p-2 rounded-lg shrink-0", statusInfo.bgColor)}>
            <statusInfo.icon className={cn("w-5 h-5", statusInfo.color)} />
          </div>
          <div className="flex-1">
            <p className={cn("text-sm font-semibold", statusInfo.color)}>
              {statusInfo.text}
            </p>
            <p className="text-xs text-zinc-400 mt-1">
              {statusInfo.description}
            </p>
            {(isExpired || isSuspended) && (
              <a
                href="/pricing"
                className="inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 bg-[#5b21b6] hover:bg-[#6d28d9] text-white text-xs font-medium rounded-lg transition-colors"
              >
                {isSuspended ? "Update Payment" : "Resubscribe"}
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </motion.div>
      )}

      <SectionCard>
        <h4 className="text-sm font-semibold text-zinc-200 mb-4 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-zinc-500" />
          Usage Statistics
        </h4>

        {isFree && (
          <>
            <ProgressBar
              label="Daily Chats"
              used={dailyUsage}
              total={FREE_DAILY_MAX}
              resetText={`Resets in ${hoursUntilDailyReset}h`}
              colorClass="bg-blue-500"
            />
            <ProgressBar
              label="Monthly Credits"
              used={monthlyUsage}
              total={FREE_MONTHLY_MAX}
              resetText="Resets monthly"
              colorClass="bg-purple-500"
            />
          </>
        )}

        {isGo && (
          <>
            <ProgressBar
              label="Monthly Credits"
              used={monthlyUsage}
              total={GO_MONTHLY_MAX}
              resetText={`Resets ${new Date(userData.nextBillingDate || Date.now()).toLocaleDateString()}`}
              colorClass="bg-purple-500"
            />
            <ProgressBar
              label="Private Projects"
              used={userData.privateProjectsCount || 0}
              total={GO_PRIVATE_LIMIT}
              resetText="Lifetime limit"
              colorClass="bg-amber-500"
            />
          </>
        )}

        {subscriptionType === 'pro' && (
          <ProgressBar
            label="Monthly Credits"
            used={monthlyUsage}
            total={PRO_MONTHLY_MAX}
            resetText={`Resets ${new Date(userData.nextBillingDate || Date.now()).toLocaleDateString()}`}
            colorClass="bg-gradient-to-r from-[#5b21b6] to-[#1e40af]"
          />
        )}
      </SectionCard>

      {isFree && (
        <div className="border border-dashed border-zinc-800 rounded-xl p-6 relative overflow-hidden group hover:border-[#5b21b6]/30 transition-colors">
          <div className="absolute inset-0 bg-gradient-to-br from-[#5b21b6]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-zinc-300 flex items-center gap-2">
                <Lock className="w-4 h-4 text-zinc-500" />
                Upgrade to Pro
              </h4>
            </div>
            <p className="text-sm text-zinc-500 mb-6">
              Unlock 150 monthly credits, unlimited daily chats, and priority support.
            </p>
            <a
              href="/pricing"
              className="w-full py-2.5 bg-zinc-900 border border-zinc-800 text-zinc-300 text-sm font-medium rounded-lg hover:text-white hover:border-zinc-700 transition-all flex items-center justify-center gap-2"
            >
              View Plans
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

const AboutView = () => (
  <div className="space-y-6">
    <div className="flex flex-col items-center justify-center py-8 text-center bg-zinc-900/20 rounded-xl border border-zinc-800/50">
      <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full overflow-hidden bg-zinc-900 border border-zinc-800">
        <Image
          src="/logo.png"
          alt="VibeKode Studio Logo"
          width={64}
          height={64}
          className="object-contain"
        />
      </div>

      <h3 className="text-xl font-bold text-white">VibeKode Studio</h3>
      <p className="text-sm text-[#7c3aed] font-medium mt-1">
        Beta Release v0.1
      </p>
      <p className="text-xs text-zinc-500 mt-2 max-w-sm">
        Empowering creators with AI-powered code generation.
      </p>
    </div>

    <SectionCard>
      <h4 className="text-sm font-semibold text-zinc-200 mb-4 flex items-center gap-2">
        <MessageSquare className="w-4 h-4 text-zinc-500" />
        Community
      </h4>
      <div className="space-y-2">
        <a
          href="https://www.reddit.com/r/VibeKode/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between p-3 rounded-lg hover:bg-zinc-800/50 transition-all group border border-transparent hover:border-zinc-800"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#FF4500]/10 rounded-md group-hover:bg-[#FF4500]/20 transition-colors">
              <RedditIcon className="w-5 h-5 text-[#FF4500]" />
            </div>
            <div>
              <span className="text-sm text-zinc-300 group-hover:text-white transition-colors block font-medium">
                Join our Subreddit
              </span>
              <span className="text-xs text-zinc-500">r/VibeKode</span>
            </div>
          </div>
          <ExternalLink className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
        </a>

        <a
          href="https://www.linkedin.com/company/vibekode-studio"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between p-3 rounded-lg hover:bg-zinc-800/50 transition-all group border border-transparent hover:border-zinc-800"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#0A66C2]/10 rounded-md group-hover:bg-[#0A66C2]/20 transition-colors">
              <Linkedin className="w-5 h-5 text-[#0A66C2]" />
            </div>
            <div>
              <span className="text-sm text-zinc-300 group-hover:text-white transition-colors block font-medium">
                Connect on LinkedIn
              </span>
              <span className="text-xs text-zinc-500">Follow for updates</span>
            </div>
          </div>
          <ExternalLink className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
        </a>
      </div>
    </SectionCard>

    <div className="grid grid-cols-2 gap-4">
      <a
        href="#"
        className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-zinc-900/50 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all text-xs font-medium"
      >
        Documentation <ExternalLink className="w-3 h-3" />
      </a>
      <a
        href="/legal/privacy"
        className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-zinc-900/50 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all text-xs font-medium"
      >
        Privacy Policy <ExternalLink className="w-3 h-3" />
      </a>
    </div>

    <div className="text-center pt-6 border-t border-zinc-800">
      <p className="text-xs text-zinc-600">
        © 2025 VibeKode Inc. All rights reserved.
      </p>
    </div>
  </div>
);

// New component for single project visibility editing
const ProjectVisibilityView = ({ userData, projectId }: { userData: UserData | null; projectId: string }) => {
  const [project, setProject] = useState<Partial<Project> | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!projectId) return;
    
    const projectRef = doc(db, "projects", projectId);
    const unsubscribe = onSnapshot(projectRef, (docSnap) => {
      if (docSnap.exists()) {
        setProject({ id: docSnap.id, ...docSnap.data() });
      }
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, [projectId]);

  const handleToggleVisibility = async () => {
    if (!userData || !auth.currentUser || !project) return;

    const newVisibility = project.visibility === 'public' ? 'private' : 'public';
    setUpdating(true);

    try {
      // Limit Check
      if (newVisibility === 'private') {
        const subType = userData.subscriptionType || 'free';
        const currentPrivate = userData.privateProjectsCount || 0;

        if (subType === 'free') {
          alert("Upgrade to Go or Pro to create private projects.");
          setUpdating(false);
          return;
        }
        if (subType === 'go' && currentPrivate >= 5) {
          alert("You have reached the limit of 5 private projects. Upgrade to Pro for unlimited.");
          setUpdating(false);
          return;
        }
      }

      // Update Project
      await updateDoc(doc(db, "projects", projectId), { visibility: newVisibility });

      // Update User Count
      const userRef = doc(db, "users", auth.currentUser.uid);
      const incrementValue = newVisibility === 'private' ? 1 : -1;
      await updateDoc(userRef, { privateProjectsCount: increment(incrementValue) });

    } catch (e) {
      console.error("Error updating visibility", e);
      alert("Failed to update project visibility");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-6 h-6 rounded-full border-2 border-zinc-800 border-t-[#5b21b6] animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <p className="text-zinc-500 text-sm">Project not found</p>
      </div>
    );
  }

  const isPrivate = project.visibility === 'private';
  const canMakePrivate = userData?.subscriptionType !== 'free';

  return (
    <div className="space-y-6">
      <SectionCard>
        <div className="flex items-start gap-4">
          <div className="p-3 bg-zinc-800/50 rounded-lg">
            {isPrivate ? (
              <EyeOff className="w-6 h-6 text-amber-500" />
            ) : (
              <Eye className="w-6 h-6 text-blue-500" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-1">
              Project Privacy
            </h3>
            <p className="text-sm text-zinc-400 mb-4">
              {project.name}
            </p>
            
            <div className="flex items-center justify-between p-4 bg-zinc-800/30 rounded-lg border border-zinc-700/50">
              <div>
                <p className="text-sm font-medium text-white mb-1">
                  Current Status
                </p>
                <span className={cn(
                  "text-xs uppercase font-bold px-2 py-1 rounded-full border inline-block",
                  isPrivate
                    ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                    : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                )}>
                  {isPrivate ? 'Private' : 'Public'}
                </span>
              </div>
              
              <button
                onClick={handleToggleVisibility}
                disabled={updating || (!canMakePrivate && !isPrivate)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  updating
                    ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                    : isPrivate
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : canMakePrivate
                    ? "bg-amber-600 hover:bg-amber-700 text-white"
                    : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                )}
              >
                {updating ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-zinc-600 border-t-transparent rounded-full animate-spin" />
                    Updating...
                  </span>
                ) : isPrivate ? (
                  "Make Public"
                ) : (
                  "Make Private"
                )}
              </button>
            </div>

            {!canMakePrivate && !isPrivate && (
              <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                <p className="text-xs text-amber-400 flex items-start gap-2">
                  <Lock className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    Upgrade to Go or Pro to create private projects. 
                    <a href="/pricing" className="underline ml-1 hover:text-amber-300">
                      View Plans
                    </a>
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>
      </SectionCard>

      <SectionCard>
        <h4 className="text-sm font-semibold text-zinc-200 mb-3 flex items-center gap-2">
          <Info className="w-4 h-4 text-zinc-500" />
          Privacy Information
        </h4>
        <div className="space-y-3 text-sm text-zinc-400">
          <div className="flex gap-3">
            <Eye className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-zinc-300 mb-1">Public Projects</p>
              <p className="text-xs">Visible to everyone and featured in the community showcase</p>
            </div>
          </div>
          <div className="flex gap-3">
            <EyeOff className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-zinc-300 mb-1">Private Projects</p>
              <p className="text-xs">Only visible to you. Perfect for personal or client work</p>
            </div>
          </div>
        </div>
      </SectionCard>

      {userData && (
        <div className="p-4 bg-zinc-900/40 border border-zinc-800/60 rounded-xl">
          <p className="text-xs text-zinc-500 text-center">
            {userData.subscriptionType === 'free' && "Free: 0 Private Projects"}
            {userData.subscriptionType === 'go' && `Go: ${userData.privateProjectsCount || 0}/5 Private Projects Used`}
            {userData.subscriptionType === 'pro' && "Pro: Unlimited Private Projects"}
          </p>
        </div>
      )}
    </div>
  );
};

// --- MAIN COMPONENT ---

export default function SettingsModal({ isOpen, onClose, projectId }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>(projectId ? "usage" : "usage");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch User Data Real-time
  useEffect(() => {
    if (!auth.currentUser) {
      setError("No authenticated user found");
      setLoading(false);
      return;
    }

    const userRef = doc(db, "users", auth.currentUser.uid);

    const unsubscribe = onSnapshot(
      userRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserData({
            displayName: auth.currentUser?.displayName || "Creator",
            email: auth.currentUser?.email || "",
            photoURL: auth.currentUser?.photoURL || null,
            chatUsage: data.chatUsage || {
              count: 0,
              lastCheckedDate: new Date().toISOString().split("T")[0],
            },
            subscriptionType: data.subscriptionType || "free",
            monthlyCredits: data.monthlyCredits,
            creditsUsed: data.creditsUsed,
            nextBillingDate: data.nextBillingDate,
            paypalSubscriptionId: data.paypalSubscriptionId,
            subscriptionStatus: data.subscriptionStatus || "active",
            subscriptionEndDate: data.subscriptionEndDate,
            privateProjectsCount: data.privateProjectsCount,
          });
          setError(null);
        } else {
          setError("User data not found");
        }
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching user data:", err);
        setError("Failed to load user data");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [isOpen]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape" && !showLogoutConfirm) {
        onClose();
      } else if (e.key === "1" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setActiveTab("profile");
      } else if (e.key === "2" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setActiveTab("usage");
      } else if ((e.key === "p" || e.key === "P") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setActiveTab("projects");
      } else if (e.key === "3" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setActiveTab("about");
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isOpen, onClose, showLogoutConfirm]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setShowLogoutConfirm(false);
      onClose();
      window.location.href = "/";
    } catch (error) {
      console.error("Error signing out", error);
      setError("Failed to sign out. Please try again.");
      setShowLogoutConfirm(false);
    }
  };

  // Determine which tabs to show
  const showProjectPrivacy = !!projectId; // Only show Project Privacy tab when projectId exists

  return (
    <>
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

              {/* Modal Container */}
              <Dialog.Content asChild>
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                    className="w-full max-w-4xl h-[650px] bg-[#09090b] border border-zinc-800 rounded-2xl shadow-2xl flex overflow-hidden relative"
                  >
                    <Dialog.Title className="sr-only">
                      Settings Menu
                    </Dialog.Title>

                    {/* LEFT SIDEBAR */}
                    <aside className="w-64 bg-zinc-900/20 border-r border-zinc-800 flex flex-col p-6">
                      <div className="mb-8 pl-2">
                        <div className="flex items-center gap-2 text-white font-bold text-lg">
                          <div className="p-1.5 rounded-lg bg-gradient-to-br from-[#5b21b6] to-[#1e40af]">
                            <Settings className="w-4 h-4 text-white" />
                          </div>
                          Settings
                        </div>
                      </div>

                      <nav className="space-y-1 flex-1">
                        <TabButton
                          active={activeTab === "usage"}
                          id="usage"
                          label="Usage & Limits"
                          icon={BarChart3}
                          onClick={() => setActiveTab("usage")}
                        />
                        {showProjectPrivacy && (
                          <TabButton
                            active={activeTab === "projects"}
                            id="projects"
                            label="Project Privacy"
                            icon={Lock}
                            onClick={() => setActiveTab("projects")}
                          />
                        )}
                        <TabButton
                          active={activeTab === "profile"}
                          id="profile"
                          label="Profile"
                          icon={User}
                          onClick={() => setActiveTab("profile")}
                        />
                        <TabButton
                          active={activeTab === "about"}
                          id="about"
                          label="About"
                          icon={Info}
                          onClick={() => setActiveTab("about")}
                        />
                      </nav>

                      {/* Keyboard Shortcuts Hint */}
                      <div className="mt-4 px-3 py-3 bg-zinc-900/40 rounded-lg border border-zinc-800/50">
                        <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-2 font-semibold">
                          Shortcuts
                        </p>
                        <div className="space-y-1.5 text-xs text-zinc-500">
                          <div className="flex justify-between items-center">
                            <span>Usage</span>
                            <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded text-[10px] font-mono border border-zinc-700 text-zinc-400">
                              ⌘U
                            </kbd>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Profile</span>
                            <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded text-[10px] font-mono border border-zinc-700 text-zinc-400">
                              ⌘1
                            </kbd>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Projects</span>
                            <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded text-[10px] font-mono border border-zinc-700 text-zinc-400">
                              ⌘P
                            </kbd>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>About</span>
                            <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded text-[10px] font-mono border border-zinc-700 text-zinc-400">
                              ⌘3
                            </kbd>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 pt-6 border-t border-zinc-800">
                        <button
                          onClick={() => setShowLogoutConfirm(true)}
                          className="flex items-center gap-3 w-full px-4 py-2 text-sm font-medium text-zinc-400 hover:text-red-400 hover:bg-red-500/5 rounded-lg transition-colors group"
                        >
                          <LogOut className="w-4 h-4 group-hover:text-red-400" />
                          Sign Out
                        </button>
                      </div>
                    </aside>

                    {/* RIGHT CONTENT AREA */}
                    <main
                      data-lenis-prevent="true"
                      className="flex-1 overflow-y-auto bg-[#09090b] relative custom-scrollbar"
                    >
                      {/* Top Header inside scroll area */}
                      <div className="sticky top-0 z-20 bg-[#09090b]/95 backdrop-blur-md px-8 py-6 border-b border-zinc-800 flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-white">
                          {activeTab === "profile" && "My Profile"}
                          {activeTab === "usage" && "Usage & Plan"}
                          {activeTab === "projects" && "Project Privacy"}
                          {activeTab === "about" && "About VibeKode"}
                        </h1>

                        <Dialog.Close asChild>
                          <button
                            onClick={onClose}
                            className="group p-2 rounded-full bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 transition-all active:scale-95"
                            aria-label="Close settings"
                          >
                            <X className="w-5 h-5 text-zinc-400 group-hover:text-white" />
                          </button>
                        </Dialog.Close>
                      </div>

                      <div className="p-8 max-w-2xl mx-auto">
                        {/* Error State */}
                        {error && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3"
                          >
                            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-red-400">
                                Error
                              </p>
                              <p className="text-xs text-red-300/80 mt-1">
                                {error}
                              </p>
                            </div>
                          </motion.div>
                        )}

                        {loading ? (
                          <div className="flex flex-col items-center justify-center h-40">
                            <div className="w-8 h-8 rounded-full border-2 border-zinc-800 border-t-[#5b21b6] animate-spin" />
                            <p className="text-sm text-zinc-500 mt-4">
                              Loading your data...
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-6 pb-8">
                            <AnimatePresence mode="wait">
                              <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                              >
                                {activeTab === "profile" && (
                                  <ProfileView userData={userData} />
                                )}
                                {activeTab === "projects" && projectId && (
                                  <ProjectVisibilityView userData={userData} projectId={projectId} />
                                )}
                                {activeTab === "usage" && (
                                  <UsageView userData={userData} />
                                )}
                                {activeTab === "about" && <AboutView />}
                              </motion.div>
                            </AnimatePresence>
                          </div>
                        )}
                      </div>
                    </main>
                  </motion.div>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          )}
        </AnimatePresence>
      </Dialog.Root>

      {/* Logout Confirmation */}
      <LogoutConfirmDialog
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
      />
    </>
  );
}
