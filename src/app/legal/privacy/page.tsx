"use client";

import React from "react";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import PersistentBetaBanner from "@/components/ScrollingBetaBanner";
import SmoothScroll from "@/components/ui/SmoothScroll";
import Link from "next/link";
import { Shield, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function PrivacyPolicy() {
  return (
    <SmoothScroll>
      <div className="min-h-screen bg-[#09090b] text-white selection:bg-[#5b21b6]/30">
        <PersistentBetaBanner />
        <Header />

        {/* Background Decorations */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#5b21b6]/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#1e40af]/10 rounded-full blur-[120px]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
        </div>

        <main className="relative z-10 max-w-4xl mx-auto px-6 py-24 pt-32">
          
          {/* Header Section */}
          <div className="text-center mb-16">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center justify-center p-3 mb-6 rounded-2xl bg-[#5b21b6]/10 border border-[#5b21b6]/20">
                <Shield className="w-8 h-8 text-[#7c3aed]" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Privacy Policy
              </h1>
              <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                Your privacy is our priority. We are committed to protecting your personal data and being transparent about how we use it.
              </p>
              <div className="mt-6 text-sm font-medium text-zinc-500 uppercase tracking-wider">
                Last updated: December 21, 2025
              </div>
            </motion.div>
          </div>

          {/* Main Content Card */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-[#0f0f12]/60 backdrop-blur-md rounded-2xl p-8 md:p-12 border border-zinc-800 shadow-2xl"
          >
            <div className="space-y-8 text-zinc-300 leading-relaxed">
              
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  1. Introduction
                </h2>
                <p className="mb-4">
                  Welcome to VibeKode (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). VibeKode is committed to protecting your privacy and ensuring you have a positive experience on our website and when using our AI-powered application builder platform. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.
                </p>
                <p>
                  By using VibeKode, you agree to the collection and use of information in accordance with this Privacy Policy. If you do not agree with our policies and practices, your choice is not to use our service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">2. Information We Collect</h2>
                
                <h3 className="text-lg font-semibold text-white mb-3">
                  2.1 Personal Information
                </h3>
                <ul className="list-disc pl-5 space-y-2 mb-6">
                  <li>Email address (when you create an account)</li>
                  <li>Name and profile information (if provided)</li>
                  <li>Authentication data from third-party providers (Google, GitHub, etc.)</li>
                  <li>Communication preferences</li>
                </ul>

                <h3 className="text-lg font-semibold text-white mb-3">
                  2.2 Usage Data
                </h3>
                <ul className="list-disc pl-5 space-y-2 mb-6">
                  <li>IP address and device information</li>
                  <li>Browser type and version</li>
                  <li>Pages visited and time spent on our service</li>
                  <li>App creation prompts and generated code (anonymized for improvement purposes)</li>
                  <li>Usage patterns and feature interactions</li>
                </ul>

                <h3 className="text-lg font-semibold text-white mb-3">2.3 Cookies and Tracking</h3>
                <p>
                  We use cookies, web beacons, and similar tracking technologies to enhance your experience and collect usage data. You can control cookie preferences through your browser settings.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">3. How We Use Your Information</h2>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Providing our AI app-building service</li>
                  <li>Processing app creation requests</li>
                  <li>Personalizing your experience</li>
                  <li>Communicating about updates</li>
                  <li>Improving our AI models</li>
                  <li>Detecting fraud or abuse</li>
                  <li>Complying with legal obligations</li>
                  <li>Sending promotional communications</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">4. Information Sharing</h2>
                <p className="mb-4">
                  <strong>We Do Not Sell Your Data.</strong> VibeKode does not sell, trade, or rent your personal information to third parties.
                </p>
                <p className="mb-4">We may share your information only in these circumstances:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Service Providers:</strong> Hosting, analytics, and support partners.</li>
                  <li><strong>Legal Requirements:</strong> When required by court order or law.</li>
                  <li><strong>Safety:</strong> To protect the rights and safety of VibeKode users.</li>
                  <li><strong>Business Transfers:</strong> In connection with a merger or acquisition.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">5. Data Security</h2>
                <p className="mb-4">
                  We implement enterprise-grade security measures including encryption in transit and at rest, regular security assessments, and strict access controls. While we strive to protect your information, no internet transmission is 100% secure.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">6. Your Privacy Rights</h2>
                <p className="mb-4">You have rights regarding your data, including access, correction, deletion, and portability. To exercise these rights, please contact us.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">7. Updates to This Policy</h2>
                <p className="mb-4">
                  We may update this Privacy Policy to reflect changes in our practices. We will notify you of material changes by posting the new policy here.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">8. Contact Information</h2>
                <p className="mb-2"><strong>Privacy Inquiries:</strong></p>
                <p className="mb-4">
                  Email: <a href="mailto:hello.vibekode@gmail.com" className="text-[#7c3aed] hover:underline">hello.vibekode@gmail.com</a>
                </p>
                <p className="mb-2"><strong>Website:</strong></p>
                <p>
                  <a href="https://vibekode.studio" className="text-[#7c3aed] hover:underline">vibekode.studio</a>
                </p>
              </section>

            </div>

            <div className="mt-12 pt-8 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <Link 
                href="/" 
                className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Home
              </Link>
              <Link 
                href="/legal/terms" 
                className="px-6 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium transition-colors"
              >
                View Terms & Conditions
              </Link>
            </div>
          </motion.div>
        </main>

        <Footer />
      </div>
    </SmoothScroll>
  );
}