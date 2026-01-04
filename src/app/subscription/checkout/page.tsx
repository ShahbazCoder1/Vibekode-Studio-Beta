"use client";

import React, { useState, useEffect, Suspense, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { Loader2, Lock, Check, ShieldCheck, Zap, Crown, Rocket, AlertCircle, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { auth } from "@/lib/firebase";
import Script from "next/script";

// --- Types & Data ---

interface PricingTier {
    name: string;
    price: string;
    period: string;
    description: string;
    icon: React.ReactNode;
    features: string[];
    cta: string;
    ctaLink: string;
    highlighted?: boolean;
    comingSoon?: boolean;
}

const pricingTiers: PricingTier[] = [
    {
        name: "Free Beta",
        price: "$0",
        period: "/ forever",
        description: "Experience the power of VibeKode with daily credits.",
        icon: <Rocket className="w-5 h-5" />,
        features: [
            "5 daily credits (up to 30/month)",
            "Chat and generate apps",
            "Public projects",
            "1-click deployment"
        ],
        cta: "Start Building Free",
        ctaLink: "/project",
        highlighted: true,
    },
    {
        name: "Go",
        price: "$5",
        period: "/ month",
        description: "For Hobby creators who need unlimited power.",
        icon: <Zap className="w-5 h-5" />,
        features: [
            "50 monthly credits",
            "Chat and generate apps",
            "1-click code export",
            "5 Private projects",
            "1-click deployment"
        ],
        cta: "Get Started",
        ctaLink: "#",
        comingSoon: false,
    },
    {
        name: "Pro",
        price: "$15",
        period: "/ month",
        description: "For serious creators who need unlimited power.",
        icon: <Crown className="w-5 h-5" />,
        features: [
            "150 monthly credits",
            "Chat and generate apps",
            "1-click code export",
            "unlimited Private projects",
            "1-click deployment"
        ],
        cta: "Get Started",
        ctaLink: "#",
        comingSoon: false,
    },
];

// --- Razorpay Types ---
interface RazorpayOptions {
    key: string;
    subscription_id: string;
    name: string;
    description: string;
    image: string;
    handler: () => void;
    prefill: { name?: string; email?: string; contact?: string };
    theme: { color: string };
    modal: { ondismiss: () => void };
}

interface RazorpayInstance {
    open: () => void;
}

declare global {
    interface Window {
        Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
    }
}

// --- Animation Variants ---
const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

function CheckoutContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const planName = searchParams.get("plan");

    const [loading, setLoading] = useState(false);
    const [razorpayLoaded, setRazorpayLoaded] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<"razorpay" | "paypal">("razorpay");
    const [userEmail, setUserEmail] = useState<string>("");

    const selectedPlan = useMemo(() => {
        return pricingTiers.find(p => p.name === planName);
    }, [planName]);

    useEffect(() => {
        if (!planName || !selectedPlan) {
            // Optional: Handle invalid plan
        }

        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user && user.email) {
                setUserEmail(user.email);
            }
        });
        return () => unsubscribe();
    }, [planName, selectedPlan]);

    // --- Payment Handlers ---

    const handlePayPal = async () => {
        const user = auth.currentUser;
        if (!user) return toast.error("Please log in to subscribe");

        try {
            setLoading(true);
            toast.loading("Redirecting to PayPal...");
            const idToken = await user.getIdToken();

            const response = await fetch("/api/paypal/create-subscription", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tierName: planName, idToken }),
            });

            const data = await response.json();
            if (data.error) throw new Error(data.error);

            if (data.approvalUrl) {
                window.location.href = data.approvalUrl;
            }
        } catch (error: unknown) {
            console.error(error);
            toast.dismiss();
            toast.error(error instanceof Error ? error.message : "An unknown error occurred");
            setLoading(false);
        }
    };

    const handleRazorpay = async () => {
        if (!razorpayLoaded) {
            toast.error("Gateway loading... please refresh.");
            return;
        }

        const user = auth.currentUser;
        if (!user) return toast.error("Please log in to subscribe");

        try {
            setLoading(true);
            toast.loading("Initializing secure payment...");
            const idToken = await user.getIdToken();

            const response = await fetch("/api/razorpay/create-subscription", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tierName: planName, idToken }),
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.error || "Failed to create subscription");

            toast.dismiss();

            const options: RazorpayOptions = {
                key: data.key,
                subscription_id: data.subscriptionId,
                name: "VibeKode Studio",
                description: `${planName} Plan Subscription`,
                image: "https://vibekode.studio/logo.png",
                handler: function () {
                    toast.success("Payment Successful!");
                    router.push(`/subscription/success?source=razorpay&subscription_id=${data.subscriptionId}`);
                },
                prefill: {
                    name: user.displayName || "",
                    email: user.email || "",
                },
                theme: { color: "#7c3aed" },
                modal: {
                    ondismiss: function () {
                        setLoading(false);
                        toast.info("Payment cancelled");
                    }
                }
            };

            const razorpayInstance = new window.Razorpay(options);
            razorpayInstance.open();

        } catch (error: unknown) {
            console.error(error);
            toast.dismiss();
            toast.error(error instanceof Error ? error.message : "An unknown error occurred");
            setLoading(false);
        }
    };

    const handleSubscribe = () => {
        if (paymentMethod === "paypal") handlePayPal();
        else handleRazorpay();
    };

    if (!selectedPlan) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
                <AlertCircle className="w-12 h-12 text-red-500" />
                <h2 className="text-xl font-bold">Plan not found</h2>
                <button onClick={() => router.push("/pricing")} className="text-violet-400 hover:underline">
                    Return to Pricing
                </button>
            </div>
        );
    }

    return (
        <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-start"
        >
            <Script
                id="razorpay-checkout-js"
                src="https://checkout.razorpay.com/v1/checkout.js"
                onLoad={() => setRazorpayLoaded(true)}
            />

            {/* --- LEFT COLUMN: Order Summary --- */}
            <div className="order-2 md:order-1 flex flex-col gap-6">
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 lg:p-8 relative overflow-hidden shadow-xl">
                    {/* Background accent */}
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-violet-600/10 blur-[60px] rounded-full pointer-events-none" />

                    <h2 className="text-lg font-medium text-zinc-400 mb-6 flex items-center gap-2 relative z-10">
                        Order Summary
                    </h2>

                    {/* Plan Header */}
                    <div className="flex justify-between items-start pb-6 border-b border-zinc-800 relative z-10">
                        <div className="space-y-1">
                            <h3 className="font-bold text-white text-2xl tracking-tight">
                                {selectedPlan.name} Plan
                            </h3>
                            <p className="text-sm text-zinc-500 max-w-[220px] leading-relaxed">
                                {selectedPlan.description}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-white text-2xl tracking-tight">{selectedPlan.price}</p>
                            <p className="text-xs text-zinc-500 font-medium uppercase tracking-wide">Monthly</p>
                        </div>
                    </div>

                    {/* Cost Breakdown (No Tax) */}
                    <div className="py-6 relative z-10 space-y-2">
                        <div className="flex justify-between items-center text-zinc-400 text-sm">
                            <span>Subtotal</span>
                            <span className="font-medium text-zinc-200">{selectedPlan.price}</span>
                        </div>
                        <div className="flex justify-between items-center text-zinc-400 text-sm">
                            <span>Tax</span>
                            <span className="font-medium text-zinc-200">$0.00</span>
                        </div>
                    </div>
                    
                    {/* Total */}
                    <div className="pt-4 border-t border-zinc-800 flex justify-between items-end relative z-10">
                        <span className="font-medium text-zinc-300">Total due today</span>
                        <div className="text-right">
                             <span className="text-xs text-zinc-500 block mb-1">USD</span>
                             <span className="font-bold text-3xl text-white leading-none">{selectedPlan.price}</span>
                        </div>
                    </div>

                    {/* Features Included */}
                    <div className="mt-8 pt-6 border-t border-zinc-800/50 relative z-10 bg-zinc-900/30 -mx-6 -mb-6 p-6">
                        <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Includes</p>
                        <ul className="grid gap-3">
                            {selectedPlan.features.map((feature, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm text-zinc-300">
                                    <div className="bg-violet-500/10 p-1 rounded-full shrink-0">
                                        <Check className="w-3 h-3 text-violet-400" />
                                    </div>
                                    <span className="leading-tight">{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Trust Signals */}
                <div className="flex items-center justify-center gap-6 text-xs font-medium text-zinc-600">
                    <span className="flex items-center gap-1.5"><Lock className="w-3 h-3" /> SSL Secure</span>
                    <span className="flex items-center gap-1.5"><ShieldCheck className="w-3 h-3" /> Money-back guarantee</span>
                </div>
            </div>

            {/* --- RIGHT COLUMN: Payment Details --- */}
            <div className="order-1 md:order-2 flex flex-col gap-8 md:pt-2">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold text-white tracking-tight">Checkout</h1>
                    <p className="text-zinc-400 text-sm">Complete your subscription setup.</p>
                </div>

                {/* Email Display */}
                <div className="space-y-2.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Account</label>
                    <div className="group relative flex items-center w-full px-4 py-3.5 bg-zinc-900/50 border border-zinc-800 rounded-xl transition-colors hover:border-zinc-700">
                        <span className="text-zinc-300 text-sm font-medium">{userEmail || "Loading..."}</span>
                        <Lock className="w-4 h-4 text-zinc-600 absolute right-4" />
                    </div>
                </div>

                {/* Payment Methods */}
                <div className="space-y-3">
                    <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Payment Method</label>
                    
                    <div className="grid gap-3">
                        {/* Razorpay Card */}
                        <div 
                            onClick={() => setPaymentMethod("razorpay")}
                            className={`relative w-full p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                                paymentMethod === "razorpay" 
                                    ? "border-violet-500/50 bg-violet-500/5 ring-1 ring-violet-500/20" 
                                    : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 hover:bg-zinc-800/50"
                            }`}
                        >
                            <div className="flex items-center gap-4">
                                {/* Radio Circle */}
                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                                    paymentMethod === "razorpay" ? "border-violet-500" : "border-zinc-600"
                                }`}>
                                    {paymentMethod === "razorpay" && <motion.div layoutId="active-dot" className="w-2.5 h-2.5 rounded-full bg-violet-500" />}
                                </div>
                                
                                {/* Logo & Text */}
                                <div className="flex items-center justify-between w-full">
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-sm text-zinc-200">Cards, UPI & Netbanking</span>
                                        <span className="text-xs text-zinc-500">Powered by Razorpay</span>
                                    </div>
                                    <div className="w-10 h-8 bg-white rounded flex items-center justify-center p-1 shrink-0 ml-3">
                                         <Image src="/razorpay.png" alt="Razorpay" width={28} height={28} className="object-contain" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* PayPal Card */}
                        <div 
                            onClick={() => setPaymentMethod("paypal")}
                            className={`relative w-full p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                                paymentMethod === "paypal" 
                                    ? "border-[#FFC439]/50 bg-[#FFC439]/5 ring-1 ring-[#FFC439]/20" 
                                    : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 hover:bg-zinc-800/50"
                            }`}
                        >
                            <div className="flex items-center gap-4">
                                {/* Radio Circle */}
                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                                    paymentMethod === "paypal" ? "border-[#FFC439]" : "border-zinc-600"
                                }`}>
                                    {paymentMethod === "paypal" && <motion.div layoutId="active-dot" className="w-2.5 h-2.5 rounded-full bg-[#FFC439]" />}
                                </div>
                                
                                {/* Logo & Text */}
                                <div className="flex items-center justify-between w-full">
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-sm text-zinc-200">PayPal</span>
                                        <span className="text-xs text-zinc-500">Pay securely with PayPal</span>
                                    </div>
                                    <div className="w-10 h-8 bg-white rounded flex items-center justify-center p-1.5 shrink-0 ml-3">
                                        <Image src="/paypal.png" alt="PayPal" width={28} height={28} className="object-contain" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="h-px bg-zinc-800/50 w-full my-2" />

                {/* Submit Button */}
                <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubscribe}
                    disabled={loading}
                    className={`w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 shadow-lg transition-all ${
                        paymentMethod === "paypal"
                            ? "bg-[#FFC439] hover:bg-[#F4BB29] text-black" 
                            : "bg-violet-600 hover:bg-violet-500 text-white shadow-violet-500/20"
                    } ${loading ? "opacity-70 cursor-not-allowed grayscale" : ""}`}
                >
                    {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            {paymentMethod === "paypal" ? (
                                <span>Pay with PayPal</span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    Subscribe <CreditCard className="w-4 h-4 opacity-80" />
                                </span>
                            )}
                        </>
                    )}
                </motion.button>
                
                <p className="text-center text-[11px] leading-tight text-zinc-500 px-4">
                    By clicking the button above, you agree to our Terms of Service and Privacy Policy. 
                    You can cancel your subscription at any time.
                </p>
            </div>
        </motion.div>
    );
}

export default function CheckoutPage() {
    return (
        <div className="min-h-screen bg-[#09090b] text-white pt-32 pb-20 px-4 flex justify-center">
            <Suspense fallback={
                <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
                    <p className="text-sm text-zinc-500 font-medium">Preparing secure checkout...</p>
                </div>
            }>
                <CheckoutContent />
            </Suspense>
        </div>
    );
}