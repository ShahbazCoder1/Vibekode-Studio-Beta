"use client";

import React from "react";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import PersistentBetaBanner from "@/components/ScrollingBetaBanner";
import Link from "next/link";
import {
  Zap,
  Users,
  Heart,
  Code,
  Lightbulb,
  Rocket,
  Globe,
  Shield,
  Clock,
  Sparkles,
  ArrowRight,
  Mail,
  CheckCircle2,
  Cpu
} from "lucide-react";
import { motion } from "framer-motion";
import SmoothScroll from "@/components/ui/SmoothScroll";

// --- COMPONENTS ---

const GradientText = ({ children }: { children: React.ReactNode }) => (
  <span className="bg-gradient-to-r from-[#5b21b6] via-[#7c3aed] to-[#1e40af] bg-clip-text text-transparent">
    {children}
  </span>
);

const SectionHeading = ({
  badge,
  title,
  subtitle,
}: {
  badge?: string;
  title: React.ReactNode;
  subtitle?: string;
}) => (
  <div className="text-center mb-12 sm:mb-16 max-w-3xl mx-auto px-1">
    {badge && (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5b21b6]/10 border border-[#5b21b6]/20 text-[#7c3aed] text-xs font-bold uppercase tracking-wider mb-6"
      >
        {badge}
      </motion.div>
    )}
    <motion.h2
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 }}
      className="text-3xl md:text-5xl font-bold text-white mb-5 sm:mb-6 tracking-tight leading-tight"
    >
      {title}
    </motion.h2>
    {subtitle && (
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="text-base sm:text-lg text-zinc-400 leading-relaxed"
      >
        {subtitle}
      </motion.p>
    )}
  </div>
);

const FeatureCard = ({
  icon,
  title,
  description,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    viewport={{ once: true }}
    className="group h-full p-7 sm:p-8 bg-[#0f0f12]/40 backdrop-blur-md border border-zinc-800/60 rounded-2xl hover:border-[#5b21b6]/40 transition-all duration-300 hover:bg-[#0f0f12]/80 hover:-translate-y-1"
  >
    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 text-[#7c3aed] mb-6 group-hover:scale-110 group-hover:bg-[#5b21b6]/10 group-hover:border-[#5b21b6]/20 transition-all duration-300">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#7c3aed] transition-colors">
      {title}
    </h3>
    <p className="text-zinc-400 text-sm leading-relaxed">{description}</p>
  </motion.div>
);

const StatCard = ({
  number,
  label,
  description,
}: {
  number: string;
  label: string;
  description: string;
}) => (
  <div className="relative group h-full">
    <div className="absolute inset-0 bg-gradient-to-b from-[#5b21b6]/10 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    <div className="relative h-full text-center p-6 sm:p-8 rounded-2xl bg-zinc-900/20 border border-zinc-800/50 backdrop-blur-sm hover:border-[#5b21b6]/30 transition-colors">
      <div className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight tabular-nums">
        {number}
      </div>
      <div className="text-[#7c3aed] font-medium mb-2 uppercase tracking-wide text-xs">
        {label}
      </div>
      <div className="text-zinc-500 text-sm leading-relaxed">{description}</div>
    </div>
  </div>
);

// --- MAIN PAGE ---

export default function AboutPage() {
  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <SmoothScroll>
      <div className="min-h-screen bg-[#09090b] text-white selection:bg-[#5b21b6]/30 overflow-x-hidden">
        <PersistentBetaBanner />
        <Header />

        {/* Background Decorations */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#5b21b6]/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#1e40af]/10 rounded-full blur-[120px]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] mask-image-gradient" />
        </div>

        <main className="relative z-10 pt-24">

          {/* Hero Section */}
          <section className="relative py-16 sm:py-20 lg:py-28 px-4 sm:px-6">
            <div className="max-w-5xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="mx-auto inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900/50 border border-zinc-800 text-zinc-300 text-sm font-medium mb-8 backdrop-blur-md">
                  <Sparkles className="w-3.5 h-3.5 text-[#7c3aed]" />
                  <span>Redefining Software Creation</span>
                </div>

                <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 sm:mb-8 tracking-tighter leading-[1.05]">
                  We are <GradientText>VibeKode</GradientText>
                </h1>

                <p className="text-lg sm:text-xl md:text-2xl text-zinc-400 mb-10 sm:mb-12 max-w-3xl mx-auto leading-relaxed">
                  We exist to bridge the gap between human imagination and digital reality.
                  Describe your vision, and let our intelligence handle the details.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center">
                  <Link
                    href="/project"
                    className="group inline-flex items-center justify-center px-8 py-4 bg-white text-black font-semibold rounded-xl hover:bg-zinc-200 transition-all duration-300"
                  >
                    Start Building
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    href="#story"
                    className="inline-flex items-center justify-center px-8 py-4 bg-zinc-900/50 border border-zinc-800 text-zinc-300 font-semibold rounded-xl hover:bg-zinc-800 hover:text-white transition-all duration-300 backdrop-blur-sm"
                  >
                    Read Our Mission
                  </Link>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="py-12 px-4 sm:px-6 border-y border-zinc-800/40 bg-[#0f0f12]/30">
            <div className="max-w-7xl mx-auto">
              <motion.div
                className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
                variants={staggerChildren}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
              >
                <motion.div variants={fadeInUp}>
                  <StatCard number="12,400+" label="Apps Generated" description="Since 2025 launch" />
                </motion.div>
                <motion.div variants={fadeInUp}>
                  <StatCard number="3,900+" label="Builders" description="Growing community" />
                </motion.div>
                <motion.div variants={fadeInUp}>
                  <StatCard number="99.9%" label="Reliability" description="Stable & consistent" />
                </motion.div>
                <motion.div variants={fadeInUp}>
                  <StatCard number="24/7" label="Momentum" description="Always improving" />
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* Our Story Section */}
          <section id="story" className="py-24 sm:py-32 px-4 sm:px-6">
            <div className="max-w-7xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 leading-tight">
                    The gap between <br />
                    <span className="text-zinc-500">idea and reality</span> <br />
                    was too wide.
                  </h2>
                  <div className="space-y-6 text-zinc-400 text-base sm:text-lg leading-relaxed">
                    <p>
                      In 2025, we noticed a pattern. Brilliant creators were abandoning their ideas
                      not because they lacked vision, but because the barrier to execution was simply too high.
                    </p>
                    <p>
                      We asked ourselves: <span className="text-white font-medium">What if building felt more like a conversation?</span>
                    </p>
                    <p>
                      VibeKode was built to be the translator — turning clear intent into real, usable output you can keep iterating on.
                    </p>
                    <div className="pt-4 flex items-center gap-4">
                      <div className="h-px bg-zinc-800 flex-1" />
                      <span className="text-sm font-mono text-[#7c3aed]">FOUNDED 2025</span>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#5b21b6] to-[#1e40af] rounded-3xl blur-2xl opacity-20" />
                  <div className="relative bg-[#09090b] p-8 sm:p-10 rounded-3xl border border-zinc-800 shadow-2xl">
                    <div className="flex items-center mb-8 sm:mb-10">
                      <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl mr-5">
                        <Rocket className="w-8 h-8 text-white" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-xl font-bold text-white">Our Mission</h3>
                        <p className="text-zinc-500 text-sm">The North Star</p>
                      </div>
                    </div>

                    <p className="text-zinc-300 text-lg sm:text-xl leading-relaxed mb-8 sm:mb-10 font-light">
                      &quot;To make building faster, simpler, and secure for everyone —
                      from weekend makers to growing teams.&quot;
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 text-zinc-400 text-sm">
                        <CheckCircle2 className="w-5 h-5 text-[#7c3aed]" />
                        <span>Zero lock-in</span>
                      </div>
                      <div className="flex items-center gap-3 text-zinc-400 text-sm">
                        <CheckCircle2 className="w-5 h-5 text-[#7c3aed]" />
                        <span>Readable output</span>
                      </div>
                      <div className="flex items-center gap-3 text-zinc-400 text-sm">
                        <CheckCircle2 className="w-5 h-5 text-[#7c3aed]" />
                        <span>Modern workflows</span>
                      </div>
                      <div className="flex items-center gap-3 text-zinc-400 text-sm">
                        <CheckCircle2 className="w-5 h-5 text-[#7c3aed]" />
                        <span>Scale ready</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Differentiators */}
          <section className="py-24 sm:py-32 px-4 sm:px-6 bg-[#0f0f12]/30">
            <div className="max-w-7xl mx-auto">
              <SectionHeading
                badge="Features"
                title={
                  <span>
                    Built for <GradientText>Builders</GradientText>
                  </span>
                }
                subtitle="Not just a generator — a development partner designed to accelerate your workflow."
              />

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
                <FeatureCard
                  icon={<Zap className="w-6 h-6" />}
                  title="Lightning Fast"
                  description="Turn a clear idea into a working start quickly, then iterate without friction."
                  delay={0.1}
                />
                <FeatureCard
                  icon={<Code className="w-6 h-6" />}
                  title="Maintainable Output"
                  description="Clear structure and consistency so your project stays easy to extend."
                  delay={0.2}
                />
                <FeatureCard
                  icon={<Globe className="w-6 h-6" />}
                  title="Modern Standards"
                  description="Built to match current expectations for performance, layout, and usability."
                  delay={0.3}
                />
                <FeatureCard
                  icon={<Clock className="w-6 h-6" />}
                  title="Smart Context"
                  description="Keeps track of what you’ve already built so changes feel smooth and connected."
                  delay={0.4}
                />
              </div>
            </div>
          </section>

          {/* Values Section */}
          <section className="py-24 sm:py-32 px-4 sm:px-6">
            <div className="max-w-7xl mx-auto">
              <SectionHeading badge="Culture" title="The Values That Drive Us" />

              <div className="grid md:grid-cols-2 gap-5 sm:gap-6 lg:gap-8">
                {[
                  {
                    icon: <Lightbulb className="w-6 h-6" />,
                    title: "Innovation First",
                    desc: "We keep pushing what’s possible to make building feel effortless."
                  },
                  {
                    icon: <Users className="w-6 h-6" />,
                    title: "Accessibility",
                    desc: "Great tools should be approachable. Clear intent should be enough to start."
                  },
                  {
                    icon: <Heart className="w-6 h-6" />,
                    title: "User-Centric",
                    desc: "We build around real workflows. Your feedback shapes what ships next."
                  },
                  {
                    icon: <Shield className="w-6 h-6" />,
                    title: "Trust & Security",
                    desc: "Your ideas stay yours. Privacy and control are part of the experience."
                  }
                ].map((value, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex flex-col sm:flex-row p-7 sm:p-8 rounded-2xl bg-zinc-900/30 border border-zinc-800 hover:border-zinc-700 transition-all hover:bg-zinc-900/50 gap-5 sm:gap-6"
                  >
                    <div className="shrink-0">
                      <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-[#7c3aed] w-fit">
                        {value.icon}
                      </div>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xl font-bold text-white mb-2 sm:mb-3">
                        {value.title}
                      </h3>
                      <p className="text-zinc-400 leading-relaxed text-sm">
                        {value.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Technology Showcase (Split) */}
          <section className="py-24 sm:py-32 px-4 sm:px-6 border-t border-zinc-800/40">
            <div className="max-w-7xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="inline-flex items-center gap-2 mb-6 text-[#7c3aed] font-mono text-sm tracking-widest uppercase">
                    <Cpu className="w-4 h-4" />
                    <span>Under the hood</span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                    Powered by <br />
                    <GradientText>Next-Gen Intelligence</GradientText>
                  </h2>
                  <div className="space-y-7 sm:space-y-8 text-zinc-400 text-base sm:text-lg">
                    <p>
                      We focus on keeping the experience consistent so you can move from idea to output
                      without constantly restarting or cleaning things up.
                    </p>
                    <div className="flex flex-col gap-4">
                      <div className="flex items-start gap-4 sm:gap-5 p-5 rounded-2xl bg-zinc-900/30 border border-zinc-800/50">
                        <div className="w-8 h-8 rounded-full bg-[#5b21b6]/20 flex items-center justify-center text-[#7c3aed] font-bold shrink-0 text-sm">
                          1
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-white font-bold mb-1">Context Awareness</h4>
                          <p className="text-sm text-zinc-500">
                            Keeps track of what you’re building so changes feel consistent.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4 sm:gap-5 p-5 rounded-2xl bg-zinc-900/30 border border-zinc-800/50">
                        <div className="w-8 h-8 rounded-full bg-[#1e40af]/20 flex items-center justify-center text-[#1e40af] font-bold shrink-0 text-sm">
                          2
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-white font-bold mb-1">Cleaner Iteration</h4>
                          <p className="text-sm text-zinc-500">
                            Helps you refine output faster, without breaking your flow.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="grid grid-cols-2 gap-5 sm:gap-6 relative"
                >
                  <div className="absolute inset-0 bg-[#5b21b6]/5 blur-3xl rounded-full" />

                  <div className="space-y-6 translate-y-10 sm:translate-y-12">
                    <div className="bg-[#09090b] p-6 rounded-2xl border border-zinc-800 opacity-40 blur-[1px]">
                      <div className="flex gap-2 mb-4">
                        <div className="w-3 h-3 rounded-full bg-zinc-700" />
                        <div className="w-3 h-3 rounded-full bg-zinc-700" />
                      </div>
                      <div className="h-2 w-12 bg-zinc-800 rounded mb-2" />
                      <div className="h-2 w-24 bg-zinc-800 rounded" />
                    </div>
                    <div className="bg-[#0f0f12] p-6 rounded-2xl border border-[#5b21b6]/30 shadow-2xl relative z-10">
                      <div className="flex gap-2 mb-4">
                        <div className="w-3 h-3 rounded-full bg-red-500/20" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                        <div className="w-3 h-3 rounded-full bg-green-500/20" />
                      </div>
                      <div className="text-[#7c3aed] font-mono text-xs mb-2">
                        import React from &apos;react&apos;;
                      </div>
                      <div className="text-zinc-500 text-[10px] font-mono typing-cursor">
                        const Component = () =&gt; ...
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-[#0f0f12] p-6 rounded-2xl border border-[#1e40af]/30 shadow-2xl relative z-10">
                      <div className="flex gap-2 mb-4">
                        <div className="w-3 h-3 rounded-full bg-zinc-800" />
                        <div className="w-3 h-3 rounded-full bg-zinc-800" />
                      </div>
                      <div className="text-[#1e40af] font-mono text-xs mb-2">
                        &lt;HeroSection /&gt;
                      </div>
                      <div className="flex gap-2 mt-4">
                        <div className="h-16 w-full bg-zinc-800/50 rounded-lg animate-pulse" />
                      </div>
                    </div>
                    <div className="bg-[#09090b] p-6 rounded-2xl border border-zinc-800 opacity-40 blur-[1px]">
                      <div className="flex gap-2 mb-4">
                        <div className="w-3 h-3 rounded-full bg-zinc-700" />
                        <div className="w-3 h-3 rounded-full bg-zinc-700" />
                      </div>
                      <div className="h-2 w-16 bg-zinc-800 rounded mb-2" />
                      <div className="h-2 w-20 bg-zinc-800 rounded" />
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Contact CTA */}
          <section className="py-20 sm:py-24 px-4 sm:px-6 pb-28 sm:pb-32">
            <div className="max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#5b21b6] to-[#1e40af] px-6 sm:px-8 py-16 sm:py-20 text-center shadow-2xl shadow-[#5b21b6]/20"
              >
                {/* Glow effects inside card */}
                <div className="absolute top-0 left-0 w-full h-full bg-[url('/noise.png')] opacity-10 mix-blend-overlay" />
                <div className="absolute -top-32 -left-32 w-96 h-96 bg-white/10 rounded-full blur-[100px]" />
                <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-black/20 rounded-full blur-[100px]" />

                <div className="relative z-10">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5 sm:mb-6 tracking-tight leading-tight">
                    Build your next big idea.
                  </h2>
                  <p className="text-white/80 text-base sm:text-lg md:text-xl mb-10 sm:mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
                    Join builders creating the future with VibeKode.
                    Start free, upgrade anytime.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link
                      href="/project"
                      className="min-w-[180px] px-8 py-4 bg-white text-[#5b21b6] font-bold rounded-xl hover:bg-zinc-100 transition-colors shadow-lg hover:shadow-xl hover:scale-105 transform duration-200 text-center"
                    >
                      Launch Studio
                    </Link>
                    <Link
                      href="mailto:hello.vibekode@gmail.com"
                      className="min-w-[180px] flex items-center justify-center gap-2 px-8 py-4 bg-[#09090b]/20 backdrop-blur-md border border-white/20 text-white font-semibold rounded-xl hover:bg-[#09090b]/40 transition-colors"
                    >
                      <Mail className="w-5 h-5" /> Contact Us
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

        </main>
        <Footer />
      </div>
    </SmoothScroll>
  );
}