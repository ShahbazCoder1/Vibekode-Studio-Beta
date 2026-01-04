"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Check,
  Loader2,
  X,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Lock
} from "lucide-react";
import { auth } from "@/lib/firebase";
import { toast } from "sonner";
import { onAuthStateChanged } from "firebase/auth";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

function SubscriptionSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Finalizing your secure transaction...");
  const [subType, setSubType] = useState<string>("");

  useEffect(() => {
    // Prevent double execution in strict mode if status is already determined
    if (status !== 'loading') return;

    const activateSubscription = async (idToken: string) => {
      try {
        const source = searchParams.get("source");
        const subscriptionId =
          searchParams.get("subscription_id") || searchParams.get("ba_token");

        if (!subscriptionId) {
          throw new Error("Missing transaction reference.");
        }

        console.log("🔄 Activating subscription:", { source, subscriptionId });

        if (source === "razorpay") {
          // Call the Razorpay verify endpoint
          const response = await fetch("/api/razorpay/verify-subscription", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ subscriptionId, idToken }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || "Verification failed.");
          }

          console.log("✅ Razorpay subscription verified:", data);

          setSubType(data.subscription?.type || "Premium");
          setStatus("success");
          setMessage("Payment verified successfully.");
          toast.success("Welcome to VibeKode Premium!");

          setTimeout(() => {
            router.push("/project");
          }, 3000);
          return;
        }

        // PayPal flow
        const response = await fetch("/api/paypal/activate-subscription", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subscriptionId, idToken }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Verification failed.");
        }

        console.log("✅ PayPal subscription activated:", data);

        setSubType(data.subscription?.type || "Premium");
        setStatus("success");
        setMessage("Payment verified successfully.");
        toast.success("Welcome to VibeKode Premium!");

        setTimeout(() => {
          router.push("/project");
        }, 3000);
      } catch (error: unknown) {
        console.error("❌ Activation error:", error);
        const errorMessage = error instanceof Error ? error.message : "Transaction verification failed";
        setStatus("error");
        setMessage(errorMessage);
        toast.error(errorMessage);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const idToken = await user.getIdToken();
          await activateSubscription(idToken);
        } catch (error) {
          console.error("Auth error:", error);
          setStatus("error");
          setMessage("Secure authentication failed.");
        }
      } else {
        setStatus("error");
        setMessage("Session expired. Please log in to finish setup.");
        setTimeout(() => {
          router.push("/login?redirect=/subscription/success?" + searchParams.toString());
        }, 3000);
      }
    });

    return () => unsubscribe();
  }, [router, searchParams, status]);

  return (
    <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center p-4 relative overflow-hidden text-white selection:bg-[#5b21b6]/30">

      {/* Background Decorations */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[520px] h-[520px] bg-[#5b21b6]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[520px] h-[520px] bg-[#1e40af]/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Card Container */}
        <div className="bg-[#0f0f12]/80 backdrop-blur-xl border border-[#5b21b6]/30 rounded-2xl shadow-2xl shadow-[#5b21b6]/10 overflow-hidden relative">

          {/* Removed the top gradient line as requested */}

          <div className="p-8 text-center">
            {/* Status Icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className={cn(
                  "w-20 h-20 rounded-full flex items-center justify-center border-4 transition-all duration-500",
                  status === "loading" ? "border-zinc-800 bg-zinc-900" :
                    status === "success" ? "border-emerald-500/20 bg-emerald-500/10" :
                      "border-red-500/20 bg-red-500/10"
                )}>
                  {status === "loading" && (
                    <Loader2 className="w-8 h-8 text-[#7c3aed] animate-spin" />
                  )}
                  {status === "success" && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 10 }}
                    >
                      <Check className="w-10 h-10 text-emerald-500" />
                    </motion.div>
                  )}
                  {status === "error" && (
                    <X className="w-10 h-10 text-red-500" />
                  )}
                </div>

                {/* Decorative Sparkle for Success */}
                {status === "success" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute -top-2 -right-2 bg-gradient-to-r from-[#5b21b6] to-[#1e40af] p-2 rounded-full border-2 border-[#0f0f12]"
                  >
                    <Sparkles className="w-4 h-4 text-white" />
                  </motion.div>
                )}
              </div>
            </div>

            {/* Main Text */}
            <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">
              {status === "loading" && "Processing Payment..."}
              {status === "success" && "You're all set!"}
              {status === "error" && "Activation Failed"}
            </h1>

            <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
              {status === "success"
                ? `Your ${subType.toUpperCase()} plan has been successfully activated. Redirecting you to the studio...`
                : message
              }
            </p>

            {/* Action Area */}
            {status === "success" && (
              <div className="space-y-4">
                <div className="py-3 px-4 bg-zinc-900/50 rounded-lg border border-zinc-800 flex items-center justify-between">
                  <span className="text-xs text-zinc-500 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" /> Secure Transaction
                  </span>
                  <span className="text-xs text-[#7c3aed] font-medium">Verified</span>
                </div>

                <button
                  onClick={() => router.push("/project")}
                  className="w-full py-3 px-4 rounded-xl font-medium text-sm bg-white text-black hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 group"
                >
                  Go to Studio
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            )}

            {status === "loading" && (
              <div className="flex items-center justify-center gap-2 text-xs text-zinc-500 mt-4">
                <Lock className="w-3 h-3" />
                <span>Encrypting data & verifying credentials</span>
              </div>
            )}

            {status === "error" && (
              <div className="space-y-3">
                <button
                  onClick={() => window.location.reload()}
                  className="w-full py-3 px-4 rounded-xl font-medium text-sm bg-zinc-800 text-white hover:bg-zinc-700 transition-all border border-zinc-700"
                >
                  Try Again
                </button>
                <button
                  onClick={() => router.push("/pricing")}
                  className="w-full py-3 px-4 rounded-xl font-medium text-sm text-zinc-400 hover:text-white transition-all"
                >
                  Return to Pricing
                </button>
              </div>
            )}
          </div>

          {/* Footer Bar */}
          <div className="bg-[#09090b]/50 border-t border-zinc-800/50 p-3 text-center">
            <p className="text-[10px] text-zinc-600 font-medium tracking-wide">
              VIBEKODE SECURE PAYMENT GATEWAY
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function SubscriptionSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center">
          <Loader2 className="w-10 h-10 text-[#7c3aed] animate-spin mb-4" />
          <p className="text-zinc-500 text-sm">Securely loading...</p>
        </div>
      }
    >
      <SubscriptionSuccessContent />
    </Suspense>
  );
}