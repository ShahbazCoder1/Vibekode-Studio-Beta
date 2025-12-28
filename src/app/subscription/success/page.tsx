"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { auth } from "@/lib/firebase";
import { toast } from "sonner";
import { onAuthStateChanged } from "firebase/auth";

function SubscriptionSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("Processing your subscription...");

  useEffect(() => {
    const activateSubscription = async (idToken: string) => {
      try {
        const subscriptionId =
          searchParams.get("subscription_id") || searchParams.get("ba_token");

        if (!subscriptionId) {
          throw new Error("No subscription ID found in URL");
        }

        const response = await fetch("/api/paypal/activate-subscription", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subscriptionId, idToken }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to activate subscription");
        }

        setStatus("success");
        setMessage(
          `Your ${data.subscription.type.toUpperCase()} subscription is now active!`
        );
        toast.success("Subscription activated successfully!");

        setTimeout(() => {
          router.push("/project");
        }, 3000);
      } catch (error: unknown) {
        console.error("Activation error:", error);

        const message =
          error instanceof Error
            ? error.message
            : "Failed to activate subscription";

        setStatus("error");
        setMessage(message);
        toast.error(message);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const idToken = await user.getIdToken();
          await activateSubscription(idToken);
        } catch (error: unknown) {
          console.error("Error getting ID token:", error);

          const message =
            error instanceof Error ? error.message : "Authentication error";

          setStatus("error");
          setMessage("Authentication error. Please try logging in again.");
          toast.error(message);
        }
      } else {
        setStatus("error");
        setMessage("Please log in to complete your subscription activation.");
        toast.error("Please log in first");

        setTimeout(() => {
          router.push(
            "/login?redirect=/subscription/success?" + searchParams.toString()
          );
        }, 2000);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center text-center p-4">
      <div className="bg-[#0f0f12] border border-[#5b21b6]/50 rounded-2xl p-12 max-w-lg w-full shadow-2xl shadow-[#5b21b6]/10">
        <div className="mx-auto w-16 h-16 bg-[#5b21b6]/20 rounded-full flex items-center justify-center mb-6">
          {status === "loading" && (
            <Loader2 className="w-8 h-8 text-[#7c3aed] animate-spin" />
          )}
          {status === "success" && (
            <CheckCircle2 className="w-8 h-8 text-[#7c3aed]" />
          )}
          {status === "error" && <XCircle className="w-8 h-8 text-red-500" />}
        </div>

        <h1 className="text-3xl font-bold text-white mb-4">
          {status === "loading" && "Processing..."}
          {status === "success" && "Subscription Active!"}
          {status === "error" && "Activation Failed"}
        </h1>

        <p className="text-zinc-400 mb-8">{message}</p>

        {status === "success" && (
          <div className="flex flex-col gap-3">
            <button
              onClick={() => router.push("/dashboard")}
              className="w-full py-3.5 px-6 rounded-xl font-semibold text-sm bg-gradient-to-r from-[#5b21b6] to-[#1e40af] text-white hover:shadow-lg hover:shadow-[#5b21b6]/25 transition-all"
            >
              Go to Dashboard
            </button>
            <p className="text-xs text-zinc-500 mt-4">
              Redirecting automatically in 3 seconds...
            </p>
          </div>
        )}

        {status === "error" && (
          <button
            onClick={() => router.push("/pricing")}
            className="w-full py-3.5 px-6 rounded-xl font-semibold text-sm bg-zinc-800 hover:bg-zinc-700 text-white transition-all"
          >
            Return to Pricing
          </button>
        )}
      </div>
    </div>
  );
}

export default function SubscriptionSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center">
          <div className="bg-[#0f0f12] border border-[#5b21b6]/50 rounded-2xl p-12 max-w-lg w-full">
            <div className="mx-auto w-16 h-16 bg-[#5b21b6]/20 rounded-full flex items-center justify-center mb-6">
              <Loader2 className="w-8 h-8 text-[#7c3aed] animate-spin" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">Loading...</h1>
            <p className="text-zinc-400">Please wait...</p>
          </div>
        </div>
      }
    >
      <SubscriptionSuccessContent />
    </Suspense>
  );
}