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
  Infinity,
  Lock,
  MessageSquare
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import PersistentBetaBanner from "@/components/ScrollingBetaBanner";
import SmoothScroll from "@/components/ui/SmoothScroll";

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

// --- DATA ---
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
    cta: "Join Waitlist",
    ctaLink: "#",
    comingSoon: true,
  },
  {
    name: "Pro",
    price: "$15",
    description: "For serious creators who need unlimited power.",
    icon: <Crown className="w-5 h-5" />,
    features: [
      "150 monthly credits",
      "Chat and generate apps",
      "1-click code export",
      "unlimited Private projects",
      "1-click deployment"
    ],
    cta: "Join Waitlist",
    ctaLink: "#",
    comingSoon: true,
  },
];

const faqs = [
  {
    question: "Why is there a limit on the Free plan?",
    answer: "During our beta phase, we limit free accounts to 5 generations per day to ensure system stability and fair resource usage for all users while we scale our infrastructure."
  },
  {
    question: "When do my daily credits reset?",
    answer: "Your credits reset every 24 hours at midnight UTC. You can check your remaining credits at any time in the Settings menu."
  },
  {
    question: "What happens when I upgrade to Pro?",
    answer: "Once Pro launches, upgrading will instantly unlock unlimited generations, faster processing speeds, and the ability to keep your projects private."
  },
  {
    question: "Can I use generated code commercially?",
    answer: "Yes! You own the code you generate. You are free to use it for personal projects, client work, or commercial applications without restriction."
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

const PricingCard = ({ tier, index }: { tier: PricingTier; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className={cn(
        "relative flex flex-col p-8 rounded-2xl transition-all duration-300 h-full",
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

      <div className="flex-grow">
        <div className="flex items-center justify-between mb-4">
          <div className={cn(
            "p-3 rounded-lg w-fit",
            tier.highlighted ? "bg-[#5b21b6]/20 text-[#7c3aed]" : "bg-zinc-800/50 text-zinc-400"
          )}>
            {tier.icon}
          </div>
          {tier.highlighted && (
            <span className="px-3 py-1 text-xs font-medium text-white bg-gradient-to-r from-[#5b21b6] to-[#1e40af] rounded-full shadow-lg shadow-[#5b21b6]/20">
              Most Popular
            </span>
          )}
          {tier.comingSoon && (
            <span className="px-3 py-1 text-xs font-medium text-yellow-500 bg-yellow-500/10 border border-yellow-500/20 rounded-full flex items-center gap-1">
              <Lock className="w-3 h-3" /> Coming Soon
            </span>
          )}
        </div>

        <h3 className="text-xl font-bold text-white mb-2">{tier.name}</h3>
        <p className="text-sm text-zinc-400 mb-6 h-10 leading-relaxed">{tier.description}</p>

        <div className="flex items-baseline gap-1 mb-8">
          <span className={cn("text-4xl font-bold text-white", tier.comingSoon && "text-zinc-500 blur-[2px]")}>
            {tier.price}
          </span>
          {tier.period && !tier.comingSoon && (
            <span className="text-zinc-500 font-medium">{tier.period}</span>
          )}
        </div>

        <ul className="space-y-4 mb-8">
          {tier.features.map((feature, i) => (
            <li key={i} className="flex items-start gap-3 text-sm">
              <div className={cn(
                "mt-0.5 rounded-full p-0.5",
                tier.highlighted ? "bg-[#5b21b6] text-white" : "bg-zinc-800 text-zinc-500"
              )}>
                <Check className="w-3 h-3" />
              </div>
              <span className={cn(
                tier.highlighted ? "text-zinc-200" : "text-zinc-400"
              )}>
                {feature}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <Link href={tier.ctaLink} className={cn("mt-auto block", tier.comingSoon && "pointer-events-none")}>
        <motion.button
          whileHover={!tier.comingSoon ? { scale: 1.02 } : {}}
          whileTap={!tier.comingSoon ? { scale: 0.98 } : {}}
          className={cn(
            "w-full py-3.5 px-6 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2",
            tier.highlighted
              ? "bg-gradient-to-r from-[#5b21b6] to-[#1e40af] text-white hover:shadow-lg hover:shadow-[#5b21b6]/25"
              : "bg-zinc-900 border border-zinc-800 text-zinc-400",
            tier.comingSoon && "opacity-50 cursor-not-allowed"
          )}
        >
          {tier.cta}
        </motion.button>
      </Link>
    </motion.div>
  );
};

const AccordionItem = ({ faq, isOpen, onClick }: { faq: { question: string, answer: string }, isOpen: boolean, onClick: () => void }) => (
  <motion.div 
    initial={false}
    className="border-b border-zinc-800 last:border-0"
  >
    <button
      onClick={onClick}
      className="flex w-full items-center justify-between py-6 text-left group"
    >
      <span className={cn(
        "text-lg font-medium transition-colors duration-200",
        isOpen ? "text-[#7c3aed]" : "text-zinc-200 group-hover:text-white"
      )}>
        {faq.question}
      </span>
      <div className={cn(
        "p-2 rounded-full transition-all duration-300",
        isOpen ? "bg-[#5b21b6]/10 rotate-180" : "bg-zinc-900"
      )}>
        <ChevronDown className={cn(
          "h-5 w-5 transition-colors",
          isOpen ? "text-[#7c3aed]" : "text-zinc-500"
        )} />
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
          <div className="pb-6 pr-12 text-zinc-400 leading-relaxed">
            {faq.answer}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

export default function PricingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <SmoothScroll>
      <div className="min-h-screen bg-[#09090b] text-white overflow-x-hidden selection:bg-[#5b21b6]/30">
        <PersistentBetaBanner />
        <Header />

        {/* Background Decorations */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#5b21b6]/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#1e40af]/10 rounded-full blur-[120px]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] mask-image-gradient" />
        </div>

        <main className="relative z-10 pt-24 pb-20">
          
          {/* Hero Section */}
          <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-20 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5b21b6]/10 border border-[#5b21b6]/20 text-[#7c3aed] text-sm font-medium mb-8">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Limited Free Beta Access</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
                Simple pricing, <br className="hidden md:block" />
                <GradientText>Unlimited Potential</GradientText>
              </h1>
              
              <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10">
                Start building today with our generous free tier. Upgrade later for unlimited power as you scale your applications.
              </p>
            </motion.div>
          </section>

          {/* Pricing Grid */}
          <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-32">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-start">
              {pricingTiers.map((tier, index) => (
                <PricingCard key={tier.name} tier={tier} index={index} />
              ))}
            </div>
          </section>

          {/* Features Grid */}
          <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-32">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-white mb-4">Everything you need to ship</h2>
              <p className="text-zinc-400">Built for speed, designed for quality.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {[
                {
                  icon: <Zap className="w-6 h-6 text-yellow-500" />,
                  title: "Lightning Fast",
                  desc: "Generate full-stack apps in seconds, not hours."
                },
                {
                  icon: <MessageSquare className="w-6 h-6 text-[#7c3aed]" />,
                  title: "Smart Context",
                  desc: "AI that remembers your project structure and style."
                },
                {
                  icon: <Shield className="w-6 h-6 text-emerald-500" />,
                  title: "Production Ready",
                  desc: "Clean, maintainable React & Tailwind code."
                },
                {
                  icon: <Infinity className="w-6 h-6 text-blue-500" />,
                  title: "Scalable",
                  desc: "Built to grow with your user base from day one."
                }
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="p-6 bg-[#0f0f12] border border-zinc-800 rounded-xl hover:border-zinc-700 transition-colors"
                >
                  <div className="w-12 h-12 rounded-lg bg-zinc-900 flex items-center justify-center mb-4 mx-auto md:mx-0">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2 text-center md:text-left">{feature.title}</h3>
                  <p className="text-sm text-zinc-400 text-center md:text-left">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* FAQ Section */}
          <section className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <SectionTitle>
                  Frequently Asked <GradientText>Questions</GradientText>
                </SectionTitle>
              </div>
              
              <div className="bg-[#0f0f12]/50 border border-zinc-800/50 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
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