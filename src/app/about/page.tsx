"use client";

import React from "react";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import PersistentBetaBanner from "@/components/ScrollingBetaBanner";
import Link from "next/link";
import { 
  Zap, 
  Users, 
  Target, 
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
} from "lucide-react";
import { motion } from "framer-motion";
import SmoothScroll from "@/components/ui/SmoothScroll";

// --- COMPONENTS ---

const GradientText = ({ children }: { children: React.ReactNode }) => (
  <span className="bg-gradient-to-r from-[#5b21b6] to-[#1e40af] bg-clip-text text-transparent">
    {children}
  </span>
);

const FeatureCard = ({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    viewport={{ once: true }}
    className="group p-6 bg-[#0f0f12]/60 backdrop-blur-sm border border-zinc-800 rounded-xl hover:border-[#5b21b6]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#5b21b6]/10"
  >
    <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-zinc-900 border border-zinc-800 text-[#7c3aed] mb-4 group-hover:scale-110 transition-transform duration-300">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#7c3aed] transition-colors">{title}</h3>
    <p className="text-zinc-400 text-sm leading-relaxed">{description}</p>
  </motion.div>
);

const StatCard = ({ number, label, description }: { number: string, label: string, description: string }) => (
  <div className="text-center p-6 rounded-2xl bg-zinc-900/20 border border-zinc-800/50 backdrop-blur-sm">
    <div className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#5b21b6] to-[#1e40af] mb-2">
      {number}
    </div>
    <div className="text-white font-semibold mb-1">{label}</div>
    <div className="text-zinc-500 text-sm">{description}</div>
  </div>
);

// --- MAIN PAGE ---

export default function AboutPage() {
  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
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
        
        <main className="relative z-10 pt-20">
          
          {/* Hero Section */}
          <section className="relative py-20 px-6 lg:py-32">
            <div className="max-w-6xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5b21b6]/10 border border-[#5b21b6]/20 text-[#7c3aed] text-sm font-medium mb-8">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>The Future of Development</span>
                </div>
                
                <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
                  About <GradientText>VibeKode</GradientText>
                </h1>
                
                <p className="text-xl md:text-2xl text-zinc-400 mb-10 max-w-3xl mx-auto leading-relaxed">
                  We are bridging the gap between imagination and implementation. 
                  Describe your idea, and let our AI handle the code.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link 
                    href="/project"
                    className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-[#5b21b6] to-[#1e40af] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-[#5b21b6]/25 hover:scale-105 transition-all duration-300"
                  >
                    Start Building <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                  <Link 
                    href="#story"
                    className="inline-flex items-center justify-center px-8 py-4 bg-[#18181b] border border-zinc-700 text-zinc-300 font-semibold rounded-xl hover:bg-zinc-800 hover:text-white transition-all duration-300"
                  >
                    Read Our Story
                  </Link>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="py-12 px-6">
            <div className="max-w-6xl mx-auto">
              <motion.div 
                className="grid grid-cols-2 md:grid-cols-4 gap-6"
                variants={staggerChildren}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
              >
                <motion.div variants={fadeInUp}><StatCard number="5k+" label="Apps Created" description="During Beta" /></motion.div>
                <motion.div variants={fadeInUp}><StatCard number="10k+" label="Active Users" description="Growing Daily" /></motion.div>
                <motion.div variants={fadeInUp}><StatCard number="99.9%" label="Uptime" description="Enterprise Grade" /></motion.div>
                <motion.div variants={fadeInUp}><StatCard number="<1s" label="Response" description="Lightning Fast" /></motion.div>
              </motion.div>
            </div>
          </section>

          {/* Our Story Section */}
          <section id="story" className="py-24 px-6">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                    Our Story
                  </h2>
                  <div className="space-y-6 text-zinc-400 text-lg leading-relaxed">
                    <p>
                      VibeKode was born from a frustration we have all felt: <strong className="text-white">The gap between having an idea and building it is too wide.</strong>
                    </p>
                    <p>
                      We noticed that brilliant ideas were constantly being abandoned because of complex syntax, steep learning curves, and the sheer time required to write boilerplate code.
                    </p>
                    <p>
                      So we asked ourselves: <em className="text-[#7c3aed] font-medium">&quot;What if coding felt more like a conversation?&quot;</em>
                    </p>
                    <p>
                      Today, VibeKode transforms natural language into production-ready applications, empowering creators to build in minutes what used to take weeks.
                    </p>
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#5b21b6] to-[#1e40af] rounded-2xl blur-xl opacity-20" />
                  <div className="relative bg-[#0f0f12] p-8 md:p-10 rounded-2xl border border-zinc-800 shadow-2xl">
                    <div className="flex items-center mb-8">
                      <div className="p-3 bg-[#5b21b6]/10 rounded-lg mr-4">
                        <Rocket className="w-8 h-8 text-[#7c3aed]" />
                      </div>
                      <h3 className="text-2xl font-bold text-white">Our Mission</h3>
                    </div>
                    <p className="text-zinc-300 text-lg leading-relaxed mb-8 border-l-2 border-[#5b21b6] pl-6 italic">
                      To democratize software development by making code generation accessible, intuitive, and powerful for everyone.
                    </p>
                    <div className="flex items-center gap-2 text-[#7c3aed] font-medium">
                      <Target className="w-5 h-5" />
                      <span>Empowering 1 Million Creators</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Values Section */}
          <section className="py-24 px-6 border-y border-zinc-800/50 bg-[#0f0f12]/30">
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                  Core Values
                </h2>
                <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
                  The principles that guide our algorithms and our team.
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-8">
                {[
                  {
                    icon: <Lightbulb className="w-6 h-6" />,
                    title: "Innovation First",
                    desc: "We push the boundaries of LLMs, constantly exploring new ways to make development seamless."
                  },
                  {
                    icon: <Users className="w-6 h-6" />,
                    title: "Democratization",
                    desc: "Technology should be a tool for everyone. We break down the barriers of syntax and semantics."
                  },
                  {
                    icon: <Heart className="w-6 h-6" />,
                    title: "User-Centric",
                    desc: "We build for the human on the other side of the screen. Your workflow defines our roadmap."
                  },
                  {
                    icon: <Shield className="w-6 h-6" />,
                    title: "Quality & Security",
                    desc: "We maintain strict standards. Generated code should be safe, secure, and production-ready."
                  }
                ].map((value, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex p-6 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-[#5b21b6]/30 transition-all hover:bg-zinc-900"
                  >
                    <div className="mr-6">
                      <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg text-[#7c3aed]">
                        {value.icon}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">{value.title}</h3>
                      <p className="text-zinc-400 leading-relaxed">{value.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Differentiators */}
          <section className="py-24 px-6">
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                  Why VibeKode?
                </h2>
                <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
                  Not just a code generator. A complete development partner.
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <FeatureCard 
                  icon={<Zap className="w-6 h-6" />}
                  title="Lightning Fast"
                  description="From prompt to deployed app in seconds, bypassing hours of boilerplate setup."
                  delay={0.1}
                />
                <FeatureCard 
                  icon={<Code className="w-6 h-6" />}
                  title="Clean Code"
                  description="Export industry-standard React & Tailwind code that you can actually read and edit."
                  delay={0.2}
                />
                <FeatureCard 
                  icon={<Globe className="w-6 h-6" />}
                  title="Modern Stack"
                  description="Always up to date with the latest web standards, frameworks, and best practices."
                  delay={0.3}
                />
                <FeatureCard 
                  icon={<Clock className="w-6 h-6" />}
                  title="AI Memory"
                  description="Our AI remembers your project context, making iterations smooth and accurate."
                  delay={0.4}
                />
              </div>
            </div>
          </section>

          {/* Technology Showcase (Split) */}
          <section className="py-24 px-6 bg-[#0f0f12]/30 border-y border-zinc-800/50">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="inline-flex items-center gap-2 mb-6 text-[#7c3aed] font-mono text-sm">
                    <span className="w-2 h-2 rounded-full bg-[#7c3aed] animate-pulse" />
                    SYSTEM_ARCH
                  </div>
                  <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                    Powered by <br /><GradientText>Next-Gen Models</GradientText>
                  </h2>
                  <div className="space-y-6 text-zinc-400 text-lg">
                    <p>
                      We do not just wrap ChatGPT. We fine-tune models specifically for modern web development contexts, ensuring component reusability and UI consistency.
                    </p>
                    <div className="flex flex-col gap-4 mt-8">
                      <div className="flex items-center gap-4 p-4 rounded-lg bg-zinc-900/50 border border-zinc-800">
                        <div className="w-10 h-10 rounded-full bg-[#5b21b6]/10 flex items-center justify-center text-[#7c3aed] font-bold">1</div>
                        <div>
                          <h4 className="text-white font-medium">Context Awareness</h4>
                          <p className="text-sm">Understands your entire file structure.</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-4 rounded-lg bg-zinc-900/50 border border-zinc-800">
                         <div className="w-10 h-10 rounded-full bg-[#1e40af]/10 flex items-center justify-center text-[#1e40af] font-bold">2</div>
                        <div>
                          <h4 className="text-white font-medium">Real-time Optimization</h4>
                          <p className="text-sm">Refactors code while generating.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="grid grid-cols-2 gap-4"
                >
                  <div className="space-y-4 translate-y-8">
                    <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 opacity-60">
                        <div className="h-2 w-12 bg-zinc-700 rounded mb-2" />
                        <div className="h-2 w-24 bg-zinc-800 rounded" />
                    </div>
                    <div className="bg-gradient-to-br from-[#5b21b6]/20 to-[#09090b] p-6 rounded-2xl border border-[#5b21b6]/40 backdrop-blur-xl">
                        <div className="text-[#7c3aed] font-mono text-sm mb-2">import React...</div>
                        <div className="text-zinc-500 text-xs">Generating component logic...</div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-[#1e40af]/20 to-[#09090b] p-6 rounded-2xl border border-[#1e40af]/40 backdrop-blur-xl">
                        <div className="text-[#1e40af] font-mono text-sm mb-2">&lt;Component /&gt;</div>
                        <div className="text-zinc-500 text-xs">Rendering preview...</div>
                    </div>
                    <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 opacity-60">
                        <div className="h-2 w-16 bg-zinc-700 rounded mb-2" />
                        <div className="h-2 w-20 bg-zinc-800 rounded" />
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Contact CTA */}
          <section className="py-24 px-6">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#5b21b6] to-[#1e40af] p-12 text-center"
              >
                {/* Glow effects inside card */}
                <div className="absolute top-0 left-0 w-full h-full bg-[url('/noise.png')] opacity-20" />
                <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/20 rounded-full blur-[80px]" />
                
                <div className="relative z-10">
                  <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                    Ready to start building?
                  </h2>
                  <p className="text-white/80 text-lg mb-10 max-w-xl mx-auto">
                    Join thousands of developers creating the future with VibeKode. 
                    Get started for free today.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link 
                      href="/project"
                      className="px-8 py-4 bg-white text-[#5b21b6] font-bold rounded-xl hover:bg-zinc-100 transition-colors shadow-xl"
                    >
                      Launch Studio
                    </Link>
                    <Link 
                      href="mailto:hello.vibekode@gmail.com"
                      className="flex items-center gap-2 px-8 py-4 bg-transparent border border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors"
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