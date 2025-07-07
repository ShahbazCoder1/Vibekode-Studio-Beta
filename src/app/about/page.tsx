"use client";

import React from "react";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
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
  ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";

export default function AboutPage() {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
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

  const values = [
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: "Innovation First",
      description: "We push the boundaries of what is possible with AI, constantly exploring new ways to make development more intuitive and accessible."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Democratization",
      description: "Technology should be accessible to everyone. We are breaking down barriers between ideas and implementation."
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "User-Centric",
      description: "Every feature we build starts with understanding our users needs and challenges. Your success is our mission."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Quality & Security",
      description: "We maintain the highest standards in code quality, security, and reliability for every application generated."
    }
  ];

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast",
      description: "From idea to working app in seconds, not months"
    },
    {
      icon: <Code className="w-6 h-6" />,
      title: "Production Ready",
      description: "Generate clean, optimized, and maintainable code"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Modern Standards",
      description: "Built with the latest web technologies and best practices"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Always Learning",
      description: "Our AI continuously improves with every interaction"
    }
  ];

  const stats = [
    { number: "5,000+", label: "Apps Created", description: "During Beta" },
    { number: "10,000+", label: "Active Users", description: "Growing Daily" },
    { number: "99.9%", label: "Uptime", description: "Reliable Service" },
    { number: "500ms", label: "Avg Response", description: "Lightning Fast" }
  ];

  return (
    <div className="min-h-screen bg-[#18181b]">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative py-20 px-6">
          <div className="max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                About{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ccb1] via-[#7b61ff] to-[#1ca0fb]">
                  VibeKode
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-zinc-300 mb-8 max-w-4xl mx-auto leading-relaxed">
                We are revolutionizing software development by making it as simple as describing what you want to build. 
                No coding experience? No problem. Your imagination is the only limit.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/project"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#00ccb1] to-[#1ca0fb] text-white font-semibold rounded-full hover:shadow-lg hover:shadow-[#00ccb1]/25 transition-all duration-300"
                >
                  Start Building <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link 
                  href="#story"
                  className="inline-flex items-center px-8 py-4 border border-zinc-600 text-zinc-300 font-semibold rounded-full hover:border-zinc-500 hover:text-white transition-all duration-300"
                >
                  Our Story
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 px-6 bg-[#252529]/30">
          <div className="max-w-6xl mx-auto">
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 gap-8"
              variants={staggerChildren}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="text-center"
                >
                  <div className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00ccb1] to-[#7b61ff] mb-2">
                    {stat.number}
                  </div>
                  <div className="text-white font-semibold mb-1">{stat.label}</div>
                  <div className="text-zinc-400 text-sm">{stat.description}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Our Story Section */}
        <section id="story" className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  Our Story
                </h2>
                <div className="space-y-6 text-zinc-300 text-lg leading-relaxed">
                  <p>
                    VibeKode was born from a simple yet powerful vision: <strong className="text-white">
                    what if anyone could create software just by describing what they want?</strong>
                  </p>
                  <p>
                    We noticed that while technology continues to advance at breakneck speed, the barrier to 
                    creating digital solutions remained frustratingly high. Brilliant ideas were trapped 
                    behind complex programming languages, steep learning curves, and months of development time.
                  </p>
                  <p>
                    So we asked ourselves: <em className="text-[#1ca0fb]">&quot;What if we could bridge the gap between 
                    human creativity and technical implementation?&quot;</em>
                  </p>
                  <p>
                    Today, VibeKode transforms natural language into functional applications, empowering 
                    entrepreneurs, designers, students, and dreamers to bring their ideas to life instantly.
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
                <div className="bg-gradient-to-br from-[#252529] to-[#1a1a1e] p-8 rounded-2xl border border-[#333338]">
                  <div className="flex items-center mb-6">
                    <Rocket className="w-8 h-8 text-[#7b61ff] mr-3" />
                    <h3 className="text-2xl font-bold text-white">Our Mission</h3>
                  </div>
                  <p className="text-zinc-300 text-lg leading-relaxed mb-6">
                    To democratize software development and make app creation accessible to everyone, 
                    regardless of their technical background.
                  </p>
                  <div className="flex items-center text-[#00ccb1]">
                    <Target className="w-5 h-5 mr-2" />
                    <span className="font-semibold">Empowering Innovation for All</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 px-6 bg-[#252529]/30">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Our Values
              </h2>
              <p className="text-xl text-zinc-300 max-w-3xl mx-auto">
                The principles that guide everything we do and shape the future we are building
              </p>
            </motion.div>

            <motion.div 
              className="grid md:grid-cols-2 gap-8"
              variants={staggerChildren}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="bg-gradient-to-br from-[#252529] to-[#1a1a1e] p-8 rounded-2xl border border-[#333338] hover:border-[#00ccb1]/50 transition-all duration-300"
                >
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-gradient-to-r from-[#7b61ff] to-[#1ca0fb] rounded-lg text-white mr-4">
                      {value.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-white">{value.title}</h3>
                  </div>
                  <p className="text-zinc-300 text-lg leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* What Makes Us Different */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                What Makes Us Different
              </h2>
              <p className="text-xl text-zinc-300 max-w-3xl mx-auto">
                We are not just another code generator. We are building the future of human-computer interaction.
              </p>
            </motion.div>

            <motion.div 
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
              variants={staggerChildren}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="text-center p-6 bg-[#252529]/50 rounded-xl border border-[#333338] hover:border-[#00ccb1]/50 transition-all duration-300"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-[#00ccb1] to-[#7b61ff] rounded-lg text-white mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-zinc-300">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Technology Section */}
        <section className="py-20 px-6 bg-[#252529]/30">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  Powered by Advanced AI
                </h2>
                <div className="space-y-6 text-zinc-300 text-lg leading-relaxed">
                  <p>
                    Our platform leverages cutting-edge artificial intelligence and machine learning 
                    technologies to understand natural language and translate it into clean, 
                    production-ready code.
                  </p>
                  <p>
                    We have trained our AI on millions of code patterns, best practices, and design 
                    principles to ensure every generated application meets professional standards.
                  </p>
                  <div className="bg-[#252529]/50 p-6 rounded-xl border border-[#333338]">
                    <div className="flex items-center mb-3">
                      <Sparkles className="w-6 h-6 text-[#7b61ff] mr-2" />
                      <span className="font-semibold text-white">Continuous Learning</span>
                    </div>
                    <p className="text-zinc-300">
                      Our AI continuously learns from every interaction, becoming smarter and 
                      more capable with each app created.
                    </p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="grid grid-cols-2 gap-4"
              >
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-[#1ca0fb]/20 to-[#7b61ff]/20 p-6 rounded-xl border border-[#1ca0fb]/30">
                    <div className="text-2xl font-bold text-[#1ca0fb] mb-2">Natural Language</div>
                    <div className="text-zinc-300">Understanding</div>
                  </div>
                  <div className="bg-gradient-to-br from-[#00ccb1]/20 to-[#1ca0fb]/20 p-6 rounded-xl border border-[#00ccb1]/30">
                    <div className="text-2xl font-bold text-[#00ccb1] mb-2">Smart Code</div>
                    <div className="text-zinc-300">Generation</div>
                  </div>
                </div>
                <div className="space-y-4 mt-8">
                  <div className="bg-gradient-to-br from-[#7b61ff]/20 to-[#00ccb1]/20 p-6 rounded-xl border border-[#7b61ff]/30">
                    <div className="text-2xl font-bold text-[#7b61ff] mb-2">Real-time</div>
                    <div className="text-zinc-300">Preview</div>
                  </div>
                  <div className="bg-gradient-to-br from-[#00ccb1]/20 to-[#7b61ff]/20 p-6 rounded-xl border border-[#00ccb1]/30">
                    <div className="text-2xl font-bold text-[#00ccb1] mb-2">Auto</div>
                    <div className="text-zinc-300">Optimization</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Community Section */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Join Our Community
              </h2>
              <p className="text-xl text-zinc-300 mb-12 max-w-3xl mx-auto">
                Be part of a growing community of creators, innovators, and dreamers who are 
                reshaping the future of software development.
              </p>
              
              <div className="grid md:grid-cols-3 gap-8 mb-12">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#7b61ff] to-[#1ca0fb] rounded-full text-white mb-4">
                    <Users className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Creators</h3>
                  <p className="text-zinc-300">Share your amazing creations with the world</p>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#00ccb1] to-[#7b61ff] rounded-full text-white mb-4">
                    <Lightbulb className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Innovators</h3>
                  <p className="text-zinc-300">Push the boundaries of what is possible</p>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#1ca0fb] to-[#00ccb1] rounded-full text-white mb-4">
                    <Heart className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Supporters</h3>
                  <p className="text-zinc-300">Help shape the future of development</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/project"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#00ccb1] to-[#1ca0fb] text-white font-semibold rounded-full hover:shadow-lg hover:shadow-[#00ccb1]/25 transition-all duration-300"
                >
                  Start Creating <Rocket className="ml-2 w-5 h-5" />
                </Link>
                <Link 
                  href="/#community-showcase"
                  className="inline-flex items-center px-8 py-4 border border-zinc-600 text-zinc-300 font-semibold rounded-full hover:border-zinc-500 hover:text-white transition-all duration-300"
                >
                  Explore Showcase
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20 px-6 bg-[#252529]/30">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Get in Touch
              </h2>
              <p className="text-xl text-zinc-300 mb-12">
                Have questions, feedback, or want to collaborate? We&apos;d love to hear from you!
              </p>
              
              <div className="grid md:grid-cols-3 gap-8">
                <Link 
                  href="mailto:hello.vibekode@gmail.com"
                  className="p-6 bg-[#252529]/50 rounded-xl border border-[#333338] hover:border-[#00ccb1]/50 transition-all duration-300"
                >
                  <div className="text-[#7b61ff] mb-4">
                    <svg className="w-8 h-8 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Email Us</h3>
                  <p className="text-zinc-300">hello.vibekode@gmail.com</p>
                </Link>
                
                
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
