"use client";

import React from "react";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import PersistentBetaBanner from "@/components/ScrollingBetaBanner";
import SmoothScroll from "@/components/ui/SmoothScroll";
import Link from "next/link";
import { FileText, ArrowLeft } from "lucide-react";
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
            <div className="space-y-8 text-zinc-300 leading-relaxed">
              
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  1. Acceptance of Terms
                </h2>
                <p className="mb-4">
                  Welcome to VibeKode! These Terms and Conditions (&quot;Terms&quot;) govern your use of the VibeKode platform, website, and services (collectively, the &quot;Service&quot;) operated by VibeKode (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;).
                </p>
                <p className="mb-4">
                  These Terms constitute a legally binding agreement between you and VibeKode. We may modify these Terms at any time, and such modifications will be effective immediately upon posting. Your continued use of the Service after any modifications indicates your acceptance of the updated Terms.
                </p>
                <p>
                  <strong>Important:</strong> If you do not agree to these Terms, you must immediately discontinue use of the Service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  2. Description of Service
                </h2>
                <p className="mb-4">
                  VibeKode is an AI-powered application builder platform that transforms natural language descriptions into functional applications. Our Service includes but is not limited to:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>AI-powered code generation from text prompts and descriptions</li>
                  <li>Real-time application preview and live editing capabilities</li>
                  <li>Project management, version control, and collaboration tools</li>
                  <li>Community showcase and template marketplace features</li>
                  <li>One-click deployment and hosting services</li>
                  <li>API access for enterprise customers</li>
                  <li>Custom domain integration and SSL certificates</li>
                  <li>Advanced analytics and usage monitoring</li>
                </ul>
                <p className="mt-4">
                  Features and availability may vary based on your subscription tier. We reserve the right to modify, add, or remove features at any time with reasonable notice.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  3. Subscription Plans and Pricing
                </h2>
                <p className="mb-4">
                  VibeKode offers multiple subscription tiers to meet different user needs. All plans include access to our core AI features, with varying levels of usage allowances and premium features.
                </p>
                
                <h3 className="text-lg font-semibold text-white mb-3">Pricing Plans:</h3>
                
                <p className="mb-2"><strong>Free Plan (Forever)</strong></p>
                <ul className="list-disc pl-5 space-y-1 mb-4">
                  <li>5 credits/day (up to 30 credits/month)</li>
                  <li>Basic AI generation, community access, watermarked exports</li>
                </ul>

                <p className="mb-2"><strong>Beta GO - $5/month</strong></p>
                <ul className="list-disc pl-5 space-y-1 mb-4">
                  <li>50 credits (1 credit = $0.10)</li>
                  <li>Priority generation, no watermarks, basic API access</li>
                </ul>

                <p className="mb-2"><strong>Standard - $15/month</strong></p>
                <ul className="list-disc pl-5 space-y-1 mb-4">
                  <li>150 credits (1 credit = $0.10)</li>
                  <li>All Beta GO features, custom templates, advanced integrations</li>
                </ul>

                <h3 className="text-lg font-semibold text-white mb-3 mt-6">Credit System Details:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>1 credit = $0.10 USD</li>
                  <li>Credits are consumed per AI generation request</li>
                  <li>Monthly credits reset on your billing date</li>
                  <li>Unused monthly credits do not roll over</li>
                  <li>Additional credits can be purchased anytime</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  4. User Accounts and Security
                </h2>
                <p className="mb-4">
                  <strong>Registration Requirements:</strong> You must register using a valid email address or authenticate via third-party providers (Google). All information provided must be accurate and current.
                </p>
                <p className="mb-4">
                  <strong>Account Security:</strong> You are responsible for maintaining the confidentiality of your credentials and all activity under your account. Notify us immediately of any unauthorized access.
                </p>
                <p>
                  You must be at least 13 years of age to use VibeKode. Users under 18 must have parental consent.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  5. Acceptable Use Policy
                </h2>
                <p className="mb-4">You agree NOT to use VibeKode to create, generate, or distribute:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Illegal, harmful, or offensive content violating laws</li>
                  <li>Malicious code, viruses, malware, or phishing sites</li>
                  <li>Content that infringes intellectual property rights</li>
                  <li>Private or confidential information without authorization</li>
                  <li>Spam, chain letters, or unsolicited commercial content</li>
                  <li>Content promoting violence, hate speech, or discrimination</li>
                </ul>
                <p className="mt-4">
                  <strong>Prohibited Technical Activities:</strong> Reverse engineering our AI models, attempting to bypass rate limits, using automated systems to overload our infrastructure, or scraping our content without permission.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  6. API Usage and Rate Limiting
                </h2>
                <p className="mb-4">
                  API access is available for Beta GO and Standard plan users. All API calls are subject to rate limiting to ensure service stability for all users.
                </p>
                <p className="mb-2"><strong>Rate Limits:</strong></p>
                <ul className="list-disc pl-5 space-y-1 mb-4">
                  <li>60 requests per minute</li>
                  <li>10,000 requests per day</li>
                  <li>1MB maximum request size</li>
                </ul>
                <p>
                  Exceeding these limits may result in temporary suspension of API access. Contact us for enterprise-level rate limits.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  7. Intellectual Property Rights
                </h2>
                <p className="mb-4">
                  <strong>Your Content & Applications:</strong> You retain full ownership of all applications, code, and content you create using VibeKode. You grant us a limited, non-exclusive license to store, process, and display this content solely for the purpose of providing and improving the Service.
                </p>
                <p className="mb-4">
                  <strong>VibeKode Technology:</strong> All VibeKode technology, software, AI models, branding, trademarks, UI/UX design, and proprietary algorithms are owned by VibeKode and protected by international intellectual property laws.
                </p>
                <p>
                  You may not modify, copy, distribute, transmit, display, perform, reproduce, publish, license, create derivative works from, transfer, or sell any information or services obtained from VibeKode without explicit written permission.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  8. Data Privacy and Security
                </h2>
                <p className="mb-4">
                  We implement industry-standard security measures to protect your data. However, no system is 100% secure. You acknowledge that you use the Service at your own risk.
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>All data is encrypted in transit using TLS 1.2+</li>
                  <li>Stored data is encrypted at rest using AES-256</li>
                  <li>Regular security audits and penetration testing</li>
                  <li>Compliance with GDPR and CCPA data protection regulations</li>
                </ul>
                <p className="mt-4">
                  For detailed information about data handling, see our <Link href="/legal/privacy" className="text-[#7c3aed] hover:underline">Privacy Policy</Link>.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  9. Payment, Billing, and Refunds
                </h2>
                <p className="mb-4">
                  All payments are processed through secure third-party payment processors. We accept major credit cards, PayPal, and select cryptocurrencies for enterprise customers.
                </p>
                <p className="mb-4">
                  <strong>Billing Cycle:</strong> Subscriptions are billed monthly in advance. Your billing date is based on the day you subscribed.
                </p>
                <p className="mb-4">
                  <strong>Refund Policy:</strong> We offer a 7-day money-back guarantee for first-time subscribers. Refunds are not provided for partial months or unused credits. Exceptions may be made for service outages exceeding 24 hours.
                </p>
                <p>
                  Failed payments may result in account suspension after a 7-day grace period. Annual subscriptions are available at a 20% discount.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  10. Beta Disclaimer and Service Availability
                </h2>
                <p className="mb-4">
                  VibeKode is currently in <strong>Public Beta</strong>. The Service may contain bugs, and features may change or be removed without notice. During beta, the Service is provided &quot;as-is&quot; without warranties of any kind.
                </p>
                <p className="mb-4"><strong>Beta Limitations:</strong></p>
                <ul className="list-disc pl-5 space-y-2 mb-4">
                  <li>No guaranteed uptime or availability SLA</li>
                  <li>Features may be experimental and unstable</li>
                  <li>Data loss may occur (regular backups recommended)</li>
                  <li>Priority support not included in paid plans during beta</li>
                </ul>
                <p>
                  We aim for 99% uptime but cannot guarantee continuous availability. Planned maintenance windows will be announced 24 hours in advance.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  11. Limitation of Liability and Indemnification
                </h2>
                <p className="mb-4">
                  To the maximum extent permitted by law, VibeKode shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or goodwill.
                </p>
                <p className="mb-4">
                  <strong>Maximum Liability:</strong> In no event shall our total liability exceed the amount you paid for the Service in the 12 months preceding the claim, or $100 USD if you used the free tier.
                </p>
                <p>
                  You agree to indemnify and hold harmless VibeKode from any claims arising from your use of the Service, violation of these Terms, or infringement of any third-party rights.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  12. Termination and Account Suspension
                </h2>
                <p className="mb-4">
                  We may suspend or terminate your access immediately, without prior notice, for:
                </p>
                <ul className="list-disc pl-5 space-y-2 mb-4">
                  <li>Any breach of these Terms</li>
                  <li>Violation of applicable laws or regulations</li>
                  <li>Prolonged account inactivity (12+ months)</li>
                  <li>Non-payment of subscription fees</li>
                  <li>Harmful impact on our systems or other users</li>
                </ul>
                <p className="mb-4">
                  Upon termination, your right to use the Service ceases immediately. We will provide a 30-day window to download your data before permanent deletion, except in cases of Terms violations.
                </p>
                <p>
                  Subscription fees are non-refundable upon termination for Terms violations.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  13. Governing Law and Jurisdiction
                </h2>
                <p className="mb-4">
                  These Terms are governed by the laws of the State of California, USA, without regard to conflict of law principles. Any disputes shall be resolved exclusively in the state or federal courts located in San Francisco County, California.
                </p>
                <p>
                  For international users, you consent to the jurisdiction of California courts and waive any objections based on venue or inconvenient forum.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  14. Export Controls and Sanctions
                </h2>
                <p className="mb-4">
                  You may not use VibeKode if you are located in a country embargoed by the United States or are on the U.S. Treasury Department&apos;s list of Specially Designated Nationals. You represent that you are not subject to such restrictions.
                </p>
                <p>
                  The Service may not be used for any purposes prohibited by U.S. export laws, including nuclear, chemical, or biological weapons proliferation.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  15. Contact Us and Legal Inquiries
                </h2>
                <p className="mb-4">
                  For questions regarding these Terms, privacy, or legal matters:
                </p>
                <p className="mb-2">
                  <strong>Email:</strong> <a href="mailto:hello.vibekode@gmail.com" className="text-[#7c3aed] hover:underline">hello.vibekode@gmail.com</a>
                </p>
                <p className="mt-4">
                  Response time for legal inquiries: 5-7 business days. For general support, please use our <Link href="/support" className="text-[#7c3aed] hover:underline">Support Center</Link>.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white mb-4">Additional Terms</h2>
                
                <p className="mb-2"><strong>Entire Agreement:</strong></p>
                <p className="mb-4">These Terms, together with our Privacy Policy and any additional terms you agree to, constitute the entire agreement between you and VibeKode.</p>
                
                <p className="mb-2"><strong>Severability:</strong></p>
                <p className="mb-4">If any provision is found unenforceable, the remaining provisions will remain in full effect.</p>
                
                <p className="mb-2"><strong>Waiver:</strong></p>
                <p className="mb-4">Failure to enforce any provision does not constitute a waiver of our rights.</p>
                
                <p className="mb-2"><strong>Assignment:</strong></p>
                <p>You may not assign these Terms without our consent. We may assign these Terms at any time.</p>
              </section>

            </div>

            {/* Footer Actions */}
            <div className="mt-12 pt-8 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <Link 
                href="/" 
                className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Home
              </Link>
              <div className="flex gap-3">
                <Link 
                  href="/legal/privacy" 
                  className="px-6 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium transition-colors"
                >
                  Privacy Policy
                </Link>
              </div>
            </div>
          </motion.div>
        </main>

        <Footer />
      </div>
    </SmoothScroll>
  );
}