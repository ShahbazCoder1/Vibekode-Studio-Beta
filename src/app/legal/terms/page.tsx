"use client";

import React from "react";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import PersistentBetaBanner from "@/components/ScrollingBetaBanner";
import SmoothScroll from "@/components/ui/SmoothScroll";
import Link from "next/link";
import { FileText, AlertCircle, Scale, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const GradientText = ({ children }: { children: React.ReactNode }) => (
  <span className="bg-gradient-to-r from-[#5b21b6] to-[#1e40af] bg-clip-text text-transparent">
    {children}
  </span>
);

export default function TermsAndConditions() {
  return (
    <SmoothScroll>
      <div className="min-h-screen bg-[#09090b] text-white selection:bg-[#5b21b6]/30">
        <PersistentBetaBanner />
        <Header />

        {/* Background Decorations */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#5b21b6]/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#1e40af]/10 rounded-full blur-[120px]" />
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
                <FileText className="w-8 h-8 text-[#7c3aed]" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Terms & <GradientText>Conditions</GradientText>
              </h1>
              <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                Please read these terms carefully before using VibeKode. By using our service, you agree to be bound by these terms.
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
            <div className="space-y-12 text-zinc-400 leading-relaxed">
              
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
                <p className="mb-4">
                  Welcome to VibeKode! These Terms and Conditions (&quot;Terms&quot;) govern your use of the VibeKode platform, website, and services (collectively, the &quot;Service&quot;) operated by VibeKode (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;).
                </p>
                <p>
                  These Terms constitute a legally binding agreement between you and VibeKode. We may modify these Terms at any time, and such modifications will be effective immediately upon posting.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">2. Description of Service</h2>
                <p className="mb-4">
                  VibeKode is an AI-powered application builder platform. During the beta period, the Service is provided free of charge (subject to usage limits). We reserve the right to introduce pricing plans in the future with appropriate notice.
                </p>
                <ul className="list-disc pl-5 space-y-2 mt-4 bg-[#18181b]/30 p-4 rounded-xl border border-zinc-800/50">
                  <li>AI-powered code generation from text</li>
                  <li>Real-time application preview and editing</li>
                  <li>Project management and version control</li>
                  <li>Community showcase features</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">3. User Accounts</h2>
                <div className="grid gap-4 sm:grid-cols-2 mt-6">
                    <div className="bg-[#18181b]/50 p-5 rounded-lg border border-zinc-800/50">
                        <h3 className="text-white font-medium mb-2">Registration</h3>
                        <p className="text-sm">You must register using a valid email or third-party provider (Google/GitHub) to access features.</p>
                    </div>
                    <div className="bg-[#18181b]/50 p-5 rounded-lg border border-zinc-800/50">
                        <h3 className="text-white font-medium mb-2">Security</h3>
                        <p className="text-sm">You are responsible for maintaining the confidentiality of your credentials and all account activity.</p>
                    </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">4. Acceptable Use Policy</h2>
                <p className="mb-4">You agree NOT to use VibeKode to:</p>
                <ul className="space-y-3">
                   {[
                       "Create illegal, harmful, or offensive content",
                       "Generate malicious code or phishing sites",
                       "Reverse engineer our AI models",
                       "Overload our systems via automation"
                   ].map((item, i) => (
                       <li key={i} className="flex items-start gap-3 text-sm">
                           <AlertCircle className="w-5 h-5 text-red-500/80 flex-shrink-0" />
                           <span>{item}</span>
                       </li>
                   ))}
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">5. Intellectual Property</h2>
                <div className="p-4 rounded-xl bg-gradient-to-r from-[#5b21b6]/10 to-[#1e40af]/10 border border-[#5b21b6]/20">
                    <h3 className="text-white font-semibold mb-2">Your Content</h3>
                    <p className="text-zinc-300 text-sm">
                        You retain ownership of the applications and content you create using VibeKode. You grant us a license to store and process this content to provide the Service.
                    </p>
                </div>
                <p className="mt-4 text-sm">
                    VibeKode technology, branding, and UI are owned by us and protected by IP laws.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">6. Beta Disclaimer</h2>
                <p className="mb-4">
                  VibeKode is in <strong>Beta</strong>. The Service may contain bugs, and features may change without notice. The service is provided &quot;as-is&quot; without warranties of any kind regarding reliability or availability.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">7. Limitation of Liability</h2>
                <p className="mb-4">
                  To the maximum extent permitted by law, VibeKode shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">8. Termination</h2>
                <p className="mb-4">
                  We may suspend or terminate your access immediately, without prior notice, for any breach of these Terms. Upon termination, your right to use the Service ceases immediately.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">9. Contact Us</h2>
                <div className="bg-[#18181b] p-6 rounded-xl border border-zinc-800 flex flex-col md:flex-row gap-6 items-start md:items-center">
                  <div className="p-3 bg-[#5b21b6]/10 rounded-full">
                      <Scale className="w-6 h-6 text-[#7c3aed]" />
                  </div>
                  <div>
                      <p className="text-white font-medium mb-1">Legal Inquiries</p>
                      <p className="text-sm text-zinc-500 mb-2">For questions regarding these Terms:</p>
                      <a href="mailto:legal@vibekode.studio" className="text-[#1e40af] hover:text-[#7c3aed] font-medium transition-colors">hello.vibekode@gmail.com</a>
                  </div>
                </div>
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
                href="/legal/privacy" 
                className="px-6 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium transition-colors"
              >
                View Privacy Policy
              </Link>
            </div>
          </motion.div>
        </main>

        <Footer />
      </div>
    </SmoothScroll>
  );
}