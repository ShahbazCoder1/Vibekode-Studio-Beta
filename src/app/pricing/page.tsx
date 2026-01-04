"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Zap,
  Crown,
  Rocket,
  Shield,
  ChevronDown,
  Sparkles,
  Lock,
  TrendingUp,
  Users,
  Code2,
  Star
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import PersistentBetaBanner from "@/components/ScrollingBetaBanner";
import SmoothScroll from "@/components/ui/SmoothScroll";
import { useRouter } from "next/navigation";

// --- TYPES ---
interface PricingTier {
  name: string;
  price: string;
  period?: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  cta: string;
  ctaLink: string;
  highlighted?: boolean;
  comingSoon?: boolean;
}

// --- DATA (UNCHANGED) ---
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

// --- CONVERSION FOCUSED FAQS ---
const faqs = [
  {
    question: "Is the Pro plan worth the investment?",
    answer: "Absolutely. For the price of two coffees ($15), you get an AI engineer that works 24/7. Pro users ship apps 4x faster on average because they don't hit daily limits and can keep their intellectual property private."
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer: "Yes, there are no contracts. You can cancel your subscription instantly from your dashboard. You will retain access to your credits until the end of your billing period."
  },
  {
    question: "What happens to my private projects if I downgrade?",
    answer: "Your projects remain safe. If you downgrade to Free, your private projects become read-only until you switch them to public or re-subscribe. You never lose your code."
  },
  {
    question: "Do I own the code I generate?",
    answer: "100%. Whether you are on the Free, Go, or Pro plan, the code is yours. You can sell it, open-source it, or use it for client work without owing us any royalties."
  }
];

// --- COMPONENTS ---

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl text-center">
    {children}
  </h2>
);

const GradientText = ({ children }: { children: React.ReactNode }) => (
  <span className="bg-gradient-to-r from-[#5b21b6] to-[#1e40af] bg-clip-text text-transparent">
    {children}
  </span>
);

const TrustBadge = ({ icon, text, subtext }: { icon: React.ReactNode, text: string, subtext: string }) => (
  <div className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-3 backdrop-blur-md">
    <div className="shrink-0 rounded-lg bg-[#5b21b6]/10 p-2 text-[#7c3aed]">
      {icon}
    </div>
    <div className="flex min-w-0 flex-col text-left">
      <span className="truncate text-white font-bold text-base leading-tight sm:text-lg">{text}</span>
      <span className="truncate text-zinc-500 text-xs font-medium uppercase tracking-wider">{subtext}</span>
    </div>
  </div>
);

const PricingCard = ({ tier, index, onSubscribe }: { tier: PricingTier; index: number; onSubscribe: (tierName: string) => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className={cn(
        "relative flex h-full min-h-[560px] flex-col rounded-2xl p-7 sm:p-8 transition-all duration-300",
        "focus-within:ring-2 focus-within:ring-[#5b21b6]/40 focus-within:ring-offset-0",
        tier.highlighted
          ? "bg-[#0f0f12] border border-[#5b21b6]/50 shadow-2xl shadow-[#5b21b6]/10"
          : "bg-[#09090b]/40 border border-zinc-800/50 border-dashed hover:border-zinc-700",
        tier.comingSoon && "opacity-80"
      )}
    >
      {/* Background Glow for Highlighted */}
      {tier.highlighted && (
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#5b21b6]/10 to-transparent rounded-2xl blur-xl" />
      )}

      {/* Recommended Badge */}
      {tier.name === "Pro" && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <div className="rounded-full bg-gradient-to-r from-[#5b21b6] to-[#1e40af] px-4 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-lg">
            Best Value
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div
          className={cn(
            "rounded-lg p-3",
            tier.highlighted
              ? "bg-[#5b21b6]/20 text-[#7c3aed]"
              : "bg-zinc-800/50 text-zinc-400"
          )}
        >
          {tier.icon}
        </div>

        {tier.highlighted && tier.name === "Free Beta" && (
          <span className="mt-1 shrink-0 rounded-full border border-zinc-700 bg-zinc-800 px-3 py-1 text-xs font-medium text-white">
            Ideal for testing
          </span>
        )}
      </div>

      <h3 className="text-xl font-bold text-white">{tier.name}</h3>
      <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
        {tier.description}
      </p>

      {/* Price */}
      <div className="mt-6">
        <div className="flex items-end gap-2">
          <span className={cn("text-4xl font-bold text-white", tier.comingSoon && "text-zinc-500 blur-[2px]")}>
            {tier.price}
          </span>
          {tier.period && !tier.comingSoon && (
            <span className="pb-1 text-zinc-500 font-medium">{tier.period}</span>
          )}
        </div>

        {tier.price !== "$0" && !tier.comingSoon && (
          <span className="mt-2 inline-flex items-center gap-1 text-xs text-emerald-500/80 font-medium">
            <Check className="w-3 h-3" /> Cancel anytime
          </span>
        )}
      </div>

      {/* Features */}
      <ul className="mt-7 space-y-4">
        {tier.features.map((feature, i) => (
          <li key={i} className="flex items-start gap-3 text-sm">
            <div
              className={cn(
                "mt-0.5 rounded-full p-0.5 shrink-0",
                tier.highlighted
                  ? "bg-[#5b21b6] text-white"
                  : "bg-zinc-800 text-zinc-500"
              )}
            >
              <Check className="w-3 h-3" />
            </div>
            <span className={cn(tier.highlighted ? "text-zinc-200" : "text-zinc-400")}>
              {feature}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <div className={cn("mt-auto pt-8", tier.comingSoon && "pointer-events-none")}>
        <motion.button
          onClick={() => !tier.comingSoon && tier.price !== "$0" ? onSubscribe(tier.name) : null}
          whileHover={!tier.comingSoon ? { scale: 1.02 } : {}}
          whileTap={!tier.comingSoon ? { scale: 0.98 } : {}}
          className={cn(
            "w-full rounded-xl px-6 py-3.5 text-sm font-semibold transition-all duration-300",
            "inline-flex items-center justify-center gap-2",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5b21b6]/60 focus-visible:ring-offset-0",
            tier.name === "Pro"
              ? "bg-white text-black hover:bg-zinc-200 hover:shadow-lg hover:shadow-white/10"
              : tier.highlighted
                ? "bg-gradient-to-r from-[#5b21b6] to-[#1e40af] text-white hover:shadow-lg hover:shadow-[#5b21b6]/25"
                : "bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-600",
            tier.comingSoon && "opacity-50 cursor-not-allowed",
            tier.price === "$0" && "bg-zinc-800 hover:bg-zinc-700 text-white border-transparent"
          )}
        >
          {tier.price === "$0" ? (
            <Link
              href={tier.ctaLink}
              className="w-full inline-flex items-center justify-center"
            >
              {tier.cta}
            </Link>
          ) : (
            tier.cta === "Get Started" && tier.name === "Pro" ? "Upgrade to Pro" : tier.cta
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

const AccordionItem = ({ faq, isOpen, onClick }: { faq: { question: string, answer: string }, isOpen: boolean, onClick: () => void }) => (
  <motion.div initial={false} className="border-b border-zinc-800 last:border-0">
    <button
      onClick={onClick}
      className="flex w-full items-center justify-between gap-4 py-6 text-left"
    >
      <span
        className={cn(
          "text-base sm:text-lg font-medium transition-colors duration-200",
          isOpen ? "text-[#7c3aed]" : "text-zinc-200 hover:text-white"
        )}
      >
        {faq.question}
      </span>

      <div
        className={cn(
          "shrink-0 rounded-full p-2 transition-all duration-300",
          isOpen ? "bg-[#5b21b6]/10 rotate-180" : "bg-zinc-900"
        )}
      >
        <ChevronDown className={cn("h-5 w-5 transition-colors", isOpen ? "text-[#7c3aed]" : "text-zinc-500")} />
      </div>
    </button>

    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <div className="pb-6 pr-2 sm:pr-10 text-sm sm:text-base text-zinc-400 leading-relaxed">
            {faq.answer}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

export default function PricingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const router = useRouter();

  const handleSubscribe = (tierName: string) => {
    // Redirect to the checkout page with the selected plan
    router.push(`/subscription/checkout?plan=${tierName}`);
  };

  return (
    <SmoothScroll>
      <div className="min-h-screen bg-[#09090b] text-white overflow-x-hidden selection:bg-[#5b21b6]/30">
        <PersistentBetaBanner />
        <Header />

        {/* Background Decorations */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[520px] h-[520px] bg-[#5b21b6]/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[520px] h-[520px] bg-[#1e40af]/10 rounded-full blur-[120px]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
        </div>

        <main className="relative z-10 pt-24 pb-20">

          {/* Hero Section */}
          <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mx-auto max-w-4xl"
            >
              <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-[#5b21b6]/10 border border-[#5b21b6]/20 px-3 py-1 text-sm font-medium text-[#7c3aed] mb-8">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Plans Now Live</span>
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.05]">
                Invest in Speed. <br className="hidden md:block" />
                <GradientText>Ship 10x Faster.</GradientText>
              </h1>

              <p className="mx-auto max-w-2xl text-lg md:text-xl text-zinc-400 mb-10 leading-relaxed">
                Stop coding from scratch. Join thousands of developers using VibeKode to build production-ready apps in minutes, not weeks.
              </p>
            </motion.div>

            {/* Social Proof Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mx-auto flex max-w-4xl flex-wrap justify-center gap-3 sm:gap-4 md:gap-6"
            >
              <TrustBadge
                icon={<Code2 className="w-5 h-5" />}
                text="100k+"
                subtext="Lines Generated"
              />
              <TrustBadge
                icon={<Users className="w-5 h-5" />}
                text="Happy"
                subtext="Community"
              />
              <TrustBadge
                icon={<TrendingUp className="w-5 h-5" />}
                text="99.9%"
                subtext="Uptime Reliability"
              />
            </motion.div>
          </section>

          {/* Pricing Grid */}
          <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-28 sm:mb-32 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[#5b21b6]/5 blur-[100px] -z-10 rounded-full pointer-events-none" />

            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-3 md:gap-8 items-stretch">
              {pricingTiers.map((tier, index) => (
                <PricingCard key={tier.name} tier={tier} index={index} onSubscribe={handleSubscribe} />
              ))}
            </div>

            <div className="mt-10 text-center">
              <p className="text-zinc-500 text-sm">
                Need a custom enterprise solution?{" "}
                <a href="mailto:support@vibekode.com" className="text-[#7c3aed] hover:underline">
                  Contact Sales
                </a>{" "}
                for volume pricing.
              </p>
            </div>
          </section>

          {/* Value Props / Features Grid */}
          <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-28 sm:mb-32">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl font-bold text-white mb-4">Why upgrade to Pro?</h2>
              <p className="text-zinc-400">Unlock the full suite of tools designed for serious builders.</p>
            </div>

            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: <Zap className="w-6 h-6 text-yellow-500" />,
                  title: "Priority Processing",
                  desc: "Skip the queue. Pro requests are processed first on our fastest GPU clusters."
                },
                {
                  icon: <Lock className="w-6 h-6 text-[#7c3aed]" />,
                  title: "Private Projects",
                  desc: "Keep your next big idea secret. Complete privacy for your intellectual property."
                },
                {
                  icon: <Shield className="w-6 h-6 text-emerald-500" />,
                  title: "Commercial Rights",
                  desc: "Full ownership. Sell your apps or use them for clients with zero restrictions."
                },
                {
                  icon: <Star className="w-6 h-6 text-blue-500" />,
                  title: "Premium Support",
                  desc: "Get help when you need it with priority access to our support team."
                }
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  viewport={{ once: true }}
                  className="group cursor-default rounded-xl border border-zinc-800 bg-[#0f0f12] p-6 transition-colors hover:border-zinc-700"
                >
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-900 transition-colors group-hover:bg-zinc-800 md:mx-0">
                    {feature.icon}
                  </div>
                  <h3 className="mb-2 text-center text-lg font-semibold text-white md:text-left">{feature.title}</h3>
                  <p className="text-center text-sm text-zinc-400 transition-colors group-hover:text-zinc-300 md:text-left">
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* FAQ Section */}
          <section className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
              <div className="mb-10 sm:mb-12 text-center">
                <SectionTitle>
                  Common <GradientText>Questions</GradientText>
                </SectionTitle>
                <p className="mt-4 text-zinc-400">Everything you need to know about billing and credits.</p>
              </div>

              <div className="rounded-2xl border border-zinc-800/50 bg-[#0f0f12]/50 p-5 sm:p-8 backdrop-blur-sm">
                {faqs.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    faq={faq}
                    isOpen={openFaq === index}
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  />
                ))}
              </div>
            </div>
          </section>

        </main>

        <Footer />
      </div>
    </SmoothScroll>
  );
}