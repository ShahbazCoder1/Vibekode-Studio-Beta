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
  Eye,
  EyeOff
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import * as Dialog from "@radix-ui/react-dialog";
import { auth, db } from "@/lib/firebase";
import { doc, onSnapshot, updateDoc, increment } from "firebase/firestore";
import { signOut } from "firebase/auth";
import Image from "next/image";

// --- TYPES ---

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId?: string;
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
  razorpaySubscriptionId?: string; // Added for Razorpay
  subscriptionStatus?: "active" | "cancelled" | "expired" | "suspended";
  subscriptionEndDate?: string;
  privateProjectsCount?: number;
}


type Tab = "profile" | "usage" | "about" | "projects";

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
      "flex items-center gap-2 md:gap-3 px-3 py-2 md:px-4 md:py-3 text-xs md:text-sm font-medium rounded-lg transition-all duration-200 group shrink-0 whitespace-nowrap",
      active
        ? "bg-zinc-800 text-white shadow-sm ring-1 ring-zinc-700/50"
        : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
    )}
  >
    <Icon
      className={cn(
        "w-4 h-4 transition-colors",
        active ? "text-[#7c3aed]" : "text-zinc-500 group-hover:text-zinc-400"
      )}
    />
    <span>{label}</span>
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
      "bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-4 md:p-6 backdrop-blur-sm hover:border-zinc-700/50 transition-colors",
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

// Add CancelSubscriptionDialog component after LogoutConfirmDialog
const CancelSubscriptionDialog = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
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
              className="fixed inset-0 z-[1003] bg-black/60 backdrop-blur-sm"
            />
          </Dialog.Overlay>
          <Dialog.Content asChild>
            <div className="fixed inset-0 z-[1004] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative bg-[#09090b] border border-zinc-800 rounded-xl p-6 max-w-md w-full shadow-2xl"
              >
                {loading ? (
                  // Processing State
                  <div className="text-center py-8">
                    <div className="flex justify-center mb-4">
                      <div className="w-16 h-16 rounded-full border-4 border-zinc-800 border-t-[#7c3aed] animate-spin" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Processing Cancellation...
                    </h3>
                    <p className="text-sm text-zinc-400">
                      Please wait while we process your request.
                    </p>
                  </div>
                ) : (
                  // Confirmation State
                  <>
                    <Dialog.Title className="text-lg font-semibold text-white mb-2">
                      Cancel Subscription?
                    </Dialog.Title>

                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-amber-500/10 rounded-lg shrink-0">
                          <AlertCircle className="w-5 h-5 text-amber-500" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-zinc-300 mb-3 leading-relaxed">
                            Are you sure you want to cancel your subscription?
                          </p>
                          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-3 space-y-2">
                            <div className="flex items-start gap-2">
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                              <p className="text-xs text-zinc-400">
                                You&apos;ll keep premium access until the end of your current billing period
                              </p>
                            </div>
                            <div className="flex items-start gap-2">
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                              <p className="text-xs text-zinc-400">
                                No charges will be made after cancellation
                              </p>
                            </div>
                            <div className="flex items-start gap-2">
                              <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                              <p className="text-xs text-zinc-400">
                                You&apos;ll be downgraded to the Free plan after the period ends
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3 pt-2">
                        <button
                          onClick={onClose}
                          className="flex-1 px-4 py-2.5 text-sm font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
                        >
                          Keep Subscription
                        </button>
                        <button
                          onClick={onConfirm}
                          className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                        >
                          Yes, Cancel
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    )}
  </AnimatePresence>
);

// Add SuccessDialog component
const SuccessDialog = ({
  isOpen,
  onClose,
  message,
}: {
  isOpen: boolean;
  onClose: () => void;
  message: string;
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
              className="fixed inset-0 z-[1003] bg-black/60 backdrop-blur-sm"
            />
          </Dialog.Overlay>
          <Dialog.Content asChild>
            <div className="fixed inset-0 z-[1004] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                className="relative bg-[#09090b] border border-zinc-800 rounded-xl p-6 max-w-sm w-full shadow-2xl"
              >
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.1, stiffness: 200, damping: 10 }}
                    className="flex justify-center mb-4"
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500/20 flex items-center justify-center">
                      <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                    </div>
                  </motion.div>
                  
                  <Dialog.Title className="text-lg font-semibold text-white mb-2">
                    Successfully Cancelled
                  </Dialog.Title>
                  
                  <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
                    {message}
                  </p>
                  
                  <button
                    onClick={onClose}
                    className="w-full px-4 py-2.5 text-sm font-medium text-white bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
                  >
                    Got it
                  </button>
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
// (ProfileView, UsageView, AboutView, ProjectVisibilityView remain unchanged for brevity, functionality is preserved)
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
        <div className="flex items-center gap-4 md:gap-6">
          <div className="relative shrink-0">
            <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-zinc-900 border-4 border-zinc-800 flex items-center justify-center overflow-hidden shadow-2xl">
              {userData.photoURL ? (
                <Image
                  src={userData.photoURL}
                  alt={userData.displayName || "User"}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-8 h-8 md:w-10 md:h-10 text-zinc-600" />
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 md:w-8 md:h-8 bg-gradient-to-r from-[#5b21b6] to-[#1e40af] rounded-full border-4 border-[#09090b] flex items-center justify-center">
              <CheckCircle2 className="w-3 h-3 md:w-3.5 md:h-3.5 text-white" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 md:gap-3">
              <h3 className="text-xl md:text-2xl font-bold text-white truncate">
                {userData.displayName}
              </h3>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-[#5b21b6]/10 text-[#7c3aed] border border-[#5b21b6]/20">
                <Sparkles className="w-3 h-3" />
                Beta
              </span>
            </div>

            <div className="flex items-center gap-2 mt-1">
              <p className="text-zinc-400 font-medium truncate text-sm md:text-base">{userData.email}</p>
              <button
                onClick={handleCopyEmail}
                className="p-1.5 hover:bg-zinc-800 rounded-md transition-colors text-zinc-500 hover:text-white shrink-0"
                title="Copy email"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard>
        <h4 className="text-sm font-semibold text-zinc-200 mb-4 flex items-center gap-2">
          <Info className="w-4 h-4 text-zinc-500" />
          Account Details
        </h4>
        <div className="space-y-0 divide-y divide-zinc-800/60">
          <div className="flex justify-between py-3.5 items-center">
            <span className="text-sm text-zinc-500">Status</span>
            <span className="text-sm text-emerald-400 font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Active
            </span>
          </div>
          <div className="flex justify-between py-3.5 items-center">
            <span className="text-sm text-zinc-500">Member Since</span>
            <span className="text-sm text-zinc-300">Beta 2025</span>
          </div>
          <div className="flex justify-between py-3.5 items-center">
            <span className="text-sm text-zinc-500">Plan Type</span>
            <span className="text-sm text-white capitalize font-medium px-2 py-1 rounded bg-zinc-800 border border-zinc-700">
              {userData.subscriptionType} Plan
            </span>
          </div>
        </div>
      </SectionCard>
    </div>
  );
};

const UsageView = ({ userData }: { userData: UserData | null }) => {
  // --- 1. HOOKS MUST BE DECLARED FIRST ---
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // --- 2. NOW IT IS SAFE TO RETURN EARLY ---
  if (!userData) return null;

  // --- 3. REST OF THE LOGIC ---
  const today = new Date().toISOString().split("T")[0];
  const subscriptionType = userData.subscriptionType || 'free';
  const isFree = subscriptionType === 'free';
  const isGo = subscriptionType === 'go';
  const isPro = subscriptionType === 'pro';
  const subscriptionStatus = userData.subscriptionStatus || 'active';
  const isCancelled = subscriptionStatus === 'cancelled';
  const isExpired = subscriptionStatus === 'expired';
  const isSuspended = subscriptionStatus === 'suspended';

  const FREE_DAILY_MAX = 5;
  const FREE_MONTHLY_MAX = 30;
  const GO_MONTHLY_MAX = 50;
  const PRO_MONTHLY_MAX = 150;
  const GO_PRIVATE_LIMIT = 5;

  const dailyUsage = userData.chatUsage.lastCheckedDate === today ? userData.chatUsage.count : 0;
  const monthlyUsage = userData.creditsUsed || 0;

  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  const hoursUntilDailyReset = Math.floor((tomorrow.getTime() - now.getTime()) / (1000 * 60 * 60));

  let nextBillingDateStr = userData.nextBillingDate;
  if (!nextBillingDateStr && isFree) {
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    d.setDate(1);
    nextBillingDateStr = d.toISOString();
  }

  const handleCancelClick = () => {
    setShowCancelDialog(true);
  };

  const handleCancelConfirm = async () => {
    setCancelLoading(true);

    try {
      const idToken = await auth.currentUser?.getIdToken();

      let url = "";
      let body = {};

      if (userData.razorpaySubscriptionId) {
        url = "/api/razorpay/cancel-subscription";
        body = { subscriptionId: userData.razorpaySubscriptionId, idToken };
      } else if (userData.paypalSubscriptionId) {
        url = "/api/paypal/cancel-subscription";
        body = { subscriptionId: userData.paypalSubscriptionId, idToken };
      }

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      const data = await res.json();
      
      if (res.ok) {
        setSuccessMessage("Your subscription has been cancelled successfully. You'll retain premium access until the end of your billing period.");
        setShowCancelDialog(false);
        setCancelLoading(false);
        setShowSuccessDialog(true);
      } else {
        throw new Error(data.error || "Failed to cancel subscription");
      }
    } catch (e) {
      console.error(e);
      setCancelLoading(false);
      setShowCancelDialog(false);
      setSuccessMessage("Failed to cancel subscription. Please try again or contact support.");
      setShowSuccessDialog(true);
    }
  };

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
      <div className="mb-8 last:mb-0">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
            {label}
          </h4>
          {resetText && <span className="text-xs text-zinc-500 font-medium">{resetText}</span>}
        </div>

        <div className="h-2.5 w-full bg-zinc-800 rounded-full overflow-hidden mb-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={cn("h-full rounded-full relative", pct > 90 ? "bg-red-500" : colorClass)}
          />
        </div>

        <div className="flex justify-between text-xs text-zinc-400 font-medium">
          <span>{used} used</span>
          <span>{total} total</span>
        </div>
      </div>
    );
  }

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

  // Determine if cancel button should show
  const hasActiveSubscription = (userData.paypalSubscriptionId || userData.razorpaySubscriptionId) && 
                                 subscriptionStatus === 'active' && 
                                 !isFree;

  return (
    <>
      <div className="space-y-6">
        <div className="relative overflow-hidden rounded-xl border border-[#5b21b6]/30 bg-gradient-to-br from-[#5b21b6]/10 via-[#1e40af]/5 to-transparent p-6 shadow-xl shadow-[#5b21b6]/5">
          <div className="flex items-start justify-between relative z-10">
            <div>
              <h3 className="text-white font-bold text-lg flex items-center gap-2 capitalize">
                <Sparkles className="w-4 h-4 text-[#7c3aed]" /> {subscriptionType} Plan
              </h3>
              <p className="text-zinc-400 text-sm mt-1 max-w-sm leading-relaxed">
                {isFree ? "You are currently on the Free tier." : `You are subscribed to the ${subscriptionType} plan.`}
              </p>
              {!isFree && userData.nextBillingDate && !isCancelled && !isExpired && (
                <p className="text-xs text-zinc-500 mt-3 font-medium">
                  Next billing: {new Date(userData.nextBillingDate).toLocaleDateString()}
                </p>
              )}
              {isFree && (
                <p className="text-xs text-zinc-500 mt-3 font-medium">
                  Monthly limit resets: {new Date(nextBillingDateStr!).toLocaleDateString()}
                </p>
              )}
            </div>

            <div className="text-right">
              {isFree ? (
                <>
                  <span className="block text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-500 tracking-tight">
                    {Math.max(0, FREE_DAILY_MAX - dailyUsage)}
                  </span>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mt-1 block">
                    Daily Chats Left
                  </span>
                </>
              ) : (
                <>
                  <span className="block text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#5b21b6] to-[#1e40af] tracking-tight">
                    {Math.max(0, (isGo ? GO_MONTHLY_MAX : PRO_MONTHLY_MAX) - monthlyUsage)}
                  </span>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mt-1 block">
                    Credits Left
                  </span>
                </>
              )}
            </div>
          </div>

          {hasActiveSubscription && (
            <div className="mt-4 pt-4 border-t border-zinc-700/30 flex justify-end">
              <button
                onClick={handleCancelClick}
                className="text-xs text-red-400 hover:text-red-300 transition-colors flex items-center gap-1.5 font-medium hover:underline"
              >
                Cancel Subscription
              </button>
            </div>
          )}
        </div>

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
          <h4 className="text-sm font-semibold text-zinc-200 mb-6 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-zinc-500" />
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
                resetText={userData.nextBillingDate ? `Resets ${new Date(userData.nextBillingDate).toLocaleDateString()}` : "Resets monthly"}
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

          {isPro && (
            <ProgressBar
              label="Monthly Credits"
              used={monthlyUsage}
              total={PRO_MONTHLY_MAX}
              resetText={userData.nextBillingDate ? `Resets ${new Date(userData.nextBillingDate).toLocaleDateString()}` : "Resets monthly"}
              colorClass="bg-gradient-to-r from-[#5b21b6] to-[#1e40af]"
            />
          )}
        </SectionCard>

        {isFree && (
          <div className="border border-dashed border-zinc-800 rounded-xl p-6 relative overflow-hidden group hover:border-[#5b21b6]/30 transition-colors">
            <div className="absolute inset-0 bg-gradient-to-br from-[#5b21b6]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 flex items-center justify-between">
              <div className="pr-4">
                <h4 className="text-sm font-bold text-zinc-200 flex items-center gap-2 mb-1">
                  <Lock className="w-4 h-4 text-zinc-500" />
                  Unlock Pro Features
                </h4>
                <p className="text-xs text-zinc-500">
                  Get 150 credits, unlimited daily chats & priority support.
                </p>
              </div>
              <a
                href="/pricing"
                className="px-4 py-2 bg-zinc-100 text-zinc-900 text-xs font-bold rounded-lg hover:bg-white hover:scale-105 transition-all flex items-center gap-2"
              >
                View Plans
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Cancel Subscription Dialog */}
      <CancelSubscriptionDialog
        isOpen={showCancelDialog}
        onClose={() => !cancelLoading && setShowCancelDialog(false)}
        onConfirm={handleCancelConfirm}
        loading={cancelLoading}
      />

      {/* Success Dialog */}
      <SuccessDialog
        isOpen={showSuccessDialog}
        onClose={() => setShowSuccessDialog(false)}
        message={successMessage}
      />
    </>
  );
};

const AboutView = () => (
  <div className="space-y-6">
    <div className="flex flex-col items-center justify-center py-10 text-center bg-zinc-900/20 rounded-xl border border-zinc-800/50">
      <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800 shadow-xl">
        <Image
          src="/logo.png"
          alt="VibeKode Studio Logo"
          width={80}
          height={80}
          className="object-contain"
        />
      </div>

      <h3 className="text-xl font-bold text-white tracking-tight">VibeKode Studio</h3>
      <div className="mt-2 flex items-center gap-2">
        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#7c3aed]/10 text-[#7c3aed] border border-[#7c3aed]/20">
          v0.1.0 Beta
        </span>
      </div>
      <p className="text-sm text-zinc-500 mt-3 max-w-sm px-4">
        Empowering creators with AI-powered code generation. Build faster, ship sooner.
      </p>
    </div>

    <SectionCard>
      <h4 className="text-sm font-semibold text-zinc-200 mb-4 flex items-center gap-2">
        <MessageSquare className="w-4 h-4 text-zinc-500" />
        Community & Socials
      </h4>
      <div className="grid gap-3">
        <a
          href="https://www.reddit.com/r/VibeKode/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between p-3.5 rounded-lg bg-zinc-900/30 border border-zinc-800 hover:bg-zinc-800/50 hover:border-zinc-700 transition-all group"
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
          className="flex items-center justify-between p-3.5 rounded-lg bg-zinc-900/30 border border-zinc-800 hover:bg-zinc-800/50 hover:border-zinc-700 transition-all group"
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
        className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-zinc-900/30 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all text-xs font-medium"
      >
        Documentation <ExternalLink className="w-3 h-3" />
      </a>
      <a
        href="/legal/privacy"
        className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-zinc-900/30 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all text-xs font-medium"
      >
        Privacy Policy <ExternalLink className="w-3 h-3" />
      </a>
    </div>

    <div className="text-center pt-4">
      <p className="text-[10px] text-zinc-600">
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
        <div className="flex items-start gap-5">
          <div className="p-3 bg-zinc-800/50 rounded-xl shrink-0">
            {isPrivate ? (
              <EyeOff className="w-6 h-6 text-amber-500" />
            ) : (
              <Eye className="w-6 h-6 text-blue-500" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-white mb-1">
              Project Privacy
            </h3>
            <p className="text-sm text-zinc-400 mb-5 truncate">
              {project.name}
            </p>

            <div className="flex items-center justify-between p-4 bg-zinc-800/30 rounded-xl border border-zinc-700/50">
              <div>
                <p className="text-sm font-medium text-white mb-1.5">
                  Current Status
                </p>
                <span className={cn(
                  "text-[10px] uppercase font-bold px-2.5 py-1 rounded-full border inline-block tracking-wide",
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
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-lg",
                  updating
                    ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                    : isPrivate
                      ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20"
                      : canMakePrivate
                        ? "bg-amber-600 hover:bg-amber-700 text-white shadow-amber-500/20"
                        : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                )}
              >
                {updating ? (
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
                    Updating
                  </span>
                ) : isPrivate ? (
                  "Make Public"
                ) : (
                  "Make Private"
                )}
              </button>
            </div>

            {!canMakePrivate && !isPrivate && (
              <div className="mt-4 p-3 bg-amber-500/5 border border-amber-500/10 rounded-lg">
                <p className="text-xs text-amber-500/80 flex items-start gap-2">
                  <Lock className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>
                    Upgrade to Go or Pro to create private projects.
                    <a href="/pricing" className="underline ml-1 hover:text-amber-400 font-medium">
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
              <p className="font-medium text-zinc-300 mb-0.5">Public Projects</p>
              <p className="text-xs leading-relaxed text-zinc-500">Visible to everyone. Can be shared via link and featured in the community showcase.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <EyeOff className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-zinc-300 mb-0.5">Private Projects</p>
              <p className="text-xs leading-relaxed text-zinc-500">Only visible to you. Secure and perfect for personal IP or client work.</p>
            </div>
          </div>
        </div>
      </SectionCard>

      {userData && (
        <div className="p-4 bg-zinc-900/40 border border-zinc-800/60 rounded-xl">
          <div className="flex justify-between items-center text-xs">
            <span className="text-zinc-500">Private Usage</span>
            <span className="text-zinc-300 font-medium">
              {userData.subscriptionType === 'free' && "0 Allowed"}
              {userData.subscriptionType === 'go' && `${userData.privateProjectsCount || 0} / 5 Used`}
              {userData.subscriptionType === 'pro' && "Unlimited"}
            </span>
          </div>
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
            razorpaySubscriptionId: data.razorpaySubscriptionId, // ✅ ADD THIS LINE
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

  // Keyboard shortcuts (UI removed, but logic kept as per instructions to not change code logic excessively)
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
                  className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-md"
                />
              </Dialog.Overlay>

              {/* Modal Container */}
              <Dialog.Content asChild>
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -20 }}
                    transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                    className="w-full max-w-4xl h-[85vh] md:h-[650px] bg-[#09090b] border border-zinc-800/80 rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden relative"
                  >
                    <Dialog.Title className="sr-only">
                      Settings Menu
                    </Dialog.Title>

                    {/* ABSOLUTE CLOSE BUTTON - VISIBLE ON TOP */}
                    <Dialog.Close asChild>
                      <button
                        onClick={onClose}
                        className="absolute top-3 right-3 md:top-4 md:right-4 z-50 p-2 rounded-full bg-zinc-900/80 border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 transition-all active:scale-95"
                        aria-label="Close settings"
                      >
                        <X className="w-4 h-4 text-zinc-400 group-hover:text-white" />
                      </button>
                    </Dialog.Close>

                    {/* SIDEBAR: Horizontal on mobile, Vertical on desktop */}
                    <aside className="w-full md:w-64 bg-zinc-900/30 border-b md:border-b-0 md:border-r border-zinc-800 flex flex-row md:flex-col items-center md:items-stretch p-3 md:p-5 shrink-0 h-auto md:h-full gap-2 md:gap-0 overflow-x-auto md:overflow-visible no-scrollbar pr-14 md:pr-5">
                      {/* Settings Title - Hidden on Mobile to save space for horizontal tabs */}
                      <div className="hidden md:block mb-8 pl-1">
                        <div className="flex items-center gap-2.5 text-white font-bold text-lg">
                          <div className="p-1.5 rounded-lg bg-gradient-to-br from-[#5b21b6] to-[#1e40af] shadow-lg shadow-[#5b21b6]/20">
                            <Settings className="w-4 h-4 text-white" />
                          </div>
                          <span className="tracking-tight">Settings</span>
                        </div>
                      </div>

                      {/* Navigation Tabs - Horizontal Row on Mobile */}
                      <nav className="flex flex-row md:flex-col gap-2 md:gap-0 md:space-y-1 flex-1 md:flex-none">
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

                      {/* Sign Out - Icon on mobile, Button on desktop */}
                      <div className="md:mt-auto md:pt-6 md:border-t md:border-zinc-800/50">
                        <button
                          onClick={() => setShowLogoutConfirm(true)}
                          className="flex items-center justify-center md:justify-start gap-3 w-auto md:w-full px-3 py-2 md:px-4 md:py-2.5 text-sm font-medium text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors group"
                          title="Sign Out"
                        >
                          <LogOut className="w-4 h-4 group-hover:text-red-400 transition-colors" />
                          <span className="hidden md:inline">Sign Out</span>
                        </button>
                      </div>
                    </aside>

                    {/* RIGHT CONTENT AREA */}
                    <main
                      data-lenis-prevent="true"
                      className="flex-1 overflow-y-auto bg-[#09090b] relative custom-scrollbar scroll-smooth"
                    >
                      {/* Top Header inside scroll area - Title Only */}
                      <div className="sticky top-0 z-20 bg-[#09090b]/90 backdrop-blur-xl px-6 py-4 md:px-8 md:py-6 border-b border-zinc-800/60 flex items-center justify-between">
                        <h1 className="text-lg md:text-xl font-bold text-white tracking-tight">
                          {activeTab === "profile" && "My Profile"}
                          {activeTab === "usage" && "Usage & Plan"}
                          {activeTab === "projects" && "Project Privacy"}
                          {activeTab === "about" && "About VibeKode"}
                        </h1>
                        {/* Removed Close button from here, it's now global */}
                      </div>

                      <div className="p-4 md:p-8 max-w-2xl mx-auto pb-20 md:pb-8">
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
                            <p className="text-sm text-zinc-500 mt-4 animate-pulse">
                              Loading your data...
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-6">
                            <AnimatePresence mode="wait">
                              <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
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
      {/* GLOBAL SCROLLBAR STYLE FOR MODAL */}
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
        /* Firefox */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #27272a transparent;
        }

        /* Chrome, Edge, Safari */
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #27272a; /* zinc-800 */
          border-radius: 9999px;
          border: 1px solid transparent; 
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #3f3f46; /* zinc-700 */
        }
      `}</style>
    </>
  );
}