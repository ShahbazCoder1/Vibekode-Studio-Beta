"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Check, 
  Zap, 
  Crown, 
  Rocket, 
  Users, 
  Code, 
  Palette, 
  Globe,
  ArrowRight,
  Sparkles,
  Shield,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import ScrollingBetaBanner from "@/components/ScrollingBetaBanner";

interface PricingTier {
  name: string;
  price: string;
  period: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  cta: string;
  ctaLink: string;
  ctaVariant: "primary" | "secondary" | "ghost";
  popular?: boolean;
  comingSoon?: boolean;
}

const pricingTiers: PricingTier[] = [
  {
    name: "Beta Access",
    price: "Free",
    period: "Limited Time",
    description: "Get early access to VibeKode Studio with unlimited usage during beta.",
    icon: <Rocket className="w-6 h-6" />,
    features: [
      "Unlimited AI-powered app generation",
      "Access to all beta features",
      "Community showcase participation",
      "Real-time preview & editing",
      "Export & download projects",
      "Priority feedback consideration",
    ],
    cta: "Start Building for Free",
    ctaLink: "/project",
    ctaVariant: "primary",
    popular: true,
  },
  {
    name: "Starter",
    price: "Coming Soon",
    period: "",
    description: "Perfect for individual developers and small projects.",
    icon: <Code className="w-6 h-6" />,
    features: [
      "50 AI generations per month",
      "Basic templates library",
      "Standard preview modes",
      "Project export (HTML/CSS/JS)",
      "Community forum access",
      "Email support",
    ],
    cta: "Coming Soon",
    ctaLink: "#",
    ctaVariant: "secondary",
    comingSoon: true,
  },
  {
    name: "Professional",
    price: "Coming Soon",
    period: "",
    description: "Advanced features for professional developers and teams.",
    icon: <Crown className="w-6 h-6" />,
    features: [
      "Unlimited AI generations",
      "Premium templates library",
      "Advanced preview modes",
      "Multi-format export options",
      "Custom component library",
      "Priority support",
    ],
    cta: "Coming Soon",
    ctaLink: "#",
    ctaVariant: "secondary",
    comingSoon: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "Tailored solutions for large teams and organizations.",
    icon: <Users className="w-6 h-6" />,
    features: [
      "Everything in Professional",
      "Unlimited team members",
      "White-label solutions",
      "Custom integrations",
      "Dedicated account manager",
      "24/7 priority support",
    ],
    cta: "Contact Sales",
    ctaLink: "mailto:hello.vibekode@gmail.com",
    ctaVariant: "secondary",
    comingSoon: true,
  },
];

const features = [
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Lightning Fast",
    description: "Go from idea to a fully functional application in seconds, not hours."
  },
  {
    icon: <Palette className="w-6 h-6" />,
    title: "Beautiful by Default",
    description: "Generate professional UI/UX with modern, clean design patterns."
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: "Production Ready",
    description: "Export clean, optimized, and extensible code ready for deployment."
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Secure & Reliable",
    description: "Built on an enterprise-grade infrastructure with 99.9% uptime."
  }
];

const faqs = [
  {
    question: "How long is the beta period?",
    answer: "The beta period is ongoing as we continuously add features and perfect the platform. We will provide all beta users with ample advance notice before transitioning to our official paid plans."
  },
  {
    question: "What happens to my projects after the beta ends?",
    answer: "Your projects are safe! All data and generated applications will be preserved. You will have a smooth transition to a new plan, with special discounts for being an early adopter."
  },
  {
    question: "Can I use the code I export for commercial projects?",
    answer: "Absolutely. During the beta, you have full rights to the code you export. Use it for personal projects, client work, or your own business."
  },
  {
    question: "When will the paid plans and pricing be finalized?",
    answer: "We will announce final pricing details closer to the end of the beta period. All beta users will receive early access to this information and exclusive early-bird pricing."
  }
];


const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl text-center">
    {children}
  </h2>
);

const SectionSubtitle = ({ children }: { children: React.ReactNode }) => (
  <p className="mt-4 text-lg text-zinc-400 max-w-2xl mx-auto text-center">
    {children}
  </p>
);

const GradientText = ({ children }: { children: React.ReactNode }) => (
  <span className="bg-gradient-to-r from-[#00ccb1] via-[#7b61ff] to-[#1ca0fb] bg-clip-text text-transparent">
    {children}
  </span>
);

const PricingCard = ({ tier, index }: { tier: PricingTier, index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    viewport={{ once: true }}
    className={cn(
      "relative flex flex-col rounded-2xl p-8 transition-all duration-300",
      tier.popular ? "bg-[#252529] ring-2 ring-[#00ccb1] shadow-2xl shadow-[#00ccb1]/10" : "bg-[#252529]/50 ring-1 ring-[#333338]",
      tier.comingSoon && "opacity-70"
    )}
  >
    {tier.popular && (
      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
        <div className="flex items-center gap-x-2 rounded-full bg-gradient-to-r from-[#00ccb1] to-[#1ca0fb] px-3.5 py-1 text-sm font-semibold text-white">
          <Sparkles className="h-4 w-4" />
          Beta Access
        </div>
      </div>
    )}
    
    <div className="flex-grow">
      <div className="flex items-center gap-4 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#333338] text-[#00ccb1]">
            {tier.icon}
          </div>
          <h3 className="text-xl font-semibold text-white">{tier.name}</h3>
      </div>
      <p className="text-zinc-400 text-sm mb-6 h-10">{tier.description}</p>
      
      <div className="mb-8 flex items-baseline gap-x-2">
        <span className={cn("text-4xl font-bold tracking-tight", tier.popular ? "text-white" : "text-white")}>
          {tier.price}
        </span>
        {tier.period && (
          <span className="text-sm font-semibold text-zinc-400">{tier.period}</span>
        )}
      </div>

      <ul className="space-y-4 text-sm text-zinc-300">
        {tier.features.map((feature, i) => (
          <li key={i} className="flex items-start gap-3">
            <Check className="h-5 w-5 flex-shrink-0 text-[#00ccb1] mt-0.5" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
    
    <Link href={tier.ctaLink} className="mt-10 block">
      <button
        className={cn(
          "w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2",
          tier.ctaVariant === "primary" && "bg-gradient-to-r from-[#00ccb1] to-[#1ca0fb] hover:from-[#7b61ff] hover:to-[#00ccb1] text-white shadow-lg shadow-[#00ccb1]/20",
          tier.ctaVariant === "secondary" && "bg-[#333338] text-white hover:bg-[#3f3f46]",
          tier.comingSoon && "cursor-not-allowed bg-[#333338]/50 text-zinc-400"
        )}
        disabled={tier.comingSoon}
      >
        {tier.cta}
        {tier.popular && <ArrowRight className="w-4 h-4" />}
      </button>
    </Link>
  </motion.div>
);

const AccordionItem = ({ faq, isOpen, onClick }: { faq: { question: string, answer: string }, isOpen: boolean, onClick: () => void }) => (
  <div className="border-b border-[#333338] py-6">
    <button onClick={onClick} className="flex w-full items-center justify-between text-left">
      <span className="text-lg font-medium text-white">{faq.question}</span>
      <motion.div
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <ChevronDown className="h-5 w-5 text-zinc-400" />
      </motion.div>
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0, marginTop: 0 }}
          animate={{ opacity: 1, height: 'auto', marginTop: '16px' }}
          exit={{ opacity: 0, height: 0, marginTop: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <p className="text-base text-zinc-400">{faq.answer}</p>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

export default function PricingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-[#18181b] text-white overflow-x-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-[#18181b] bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      <ScrollingBetaBanner />
      <Header />

      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-24 sm:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-x-2 rounded-full bg-[#252529] px-4 py-1.5 text-sm font-medium text-[#00ccb1] ring-1 ring-inset ring-[#333338]">
                <Sparkles className="h-4 w-4" />
                Free Beta Access Available Now
              </div>
              <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
                The <GradientText>Perfect Plan</GradientText> for Your Project
              </h1>
              <p className="mt-6 text-lg leading-8 text-zinc-300 max-w-3xl mx-auto">
                Start building with unlimited AI power during our free beta. Explore our upcoming plans designed for every scale, from solo developers to enterprise teams.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link href="/project">
                  <button className="bg-gradient-to-r from-[#00ccb1] to-[#1ca0fb] hover:from-[#7b61ff] hover:to-[#00ccb1] text-white px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-[#00ccb1]/20 hover:scale-105">
                    Start Building Free
                  </button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section id="pricing" className="pb-24 sm:pb-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
              {pricingTiers.map((tier, index) => (
                <PricingCard key={tier.name} tier={tier} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 sm:py-32 border-t border-[#333338]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <SectionTitle>
                Why Choose <GradientText>VibeKode</GradientText>
              </SectionTitle>
              <SectionSubtitle>
                Experience the future of web development with a platform built for speed, quality, and scalability.
              </SectionSubtitle>
            </motion.div>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="rounded-xl bg-[#252529]/50 p-6 text-center ring-1 ring-[#333338] transition-all hover:ring-[#00ccb1]/50"
                >
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-[#333338] text-[#00ccb1]">
                    {feature.icon}
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-white">{feature.title}</h3>
                  <p className="mt-2 text-sm text-zinc-400">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-24 sm:py-32 border-t border-[#333338]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <SectionTitle>
                Frequently Asked <GradientText>Questions</GradientText>
              </SectionTitle>
              <SectionSubtitle>
                Have questions? We have answers. If you can not find what you are looking for, feel free to contact us.
              </SectionSubtitle>
            </motion.div>

            <div className="mt-16 max-w-3xl mx-auto">
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
  );
}