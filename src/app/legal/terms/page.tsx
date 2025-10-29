"use client";

import React from "react";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import PersistentBetaBanner from "@/components/ScrollingBetaBanner";
import SmoothScroll from "@/components/ui/SmoothScroll";
import Link from "next/link";

export default function TermsAndConditions() {
  return (
    <SmoothScroll>
    <div className="min-h-screen bg-[#18181b]">
      <PersistentBetaBanner />
      
      {/* Fixed header */}
      <Header />
      
      <main className="max-w-4xl mx-auto px-6 py-16 pt-24">
        <div className="bg-[#252529]/50 backdrop-blur-sm rounded-2xl p-8 border border-[#333338]/50">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">Terms & Conditions</h1>
            <p className="text-zinc-300 text-lg">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div className="prose prose-invert max-w-none">
            <div className="text-zinc-300 space-y-8">
              
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
                <p className="mb-4">
                  Welcome to VibeKode! These Terms and Conditions (&quot;Terms&quot;) govern your use of the VibeKode platform, website, and services (collectively, the &quot;Service&quot;) operated by VibeKode (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;). By accessing or using our Service, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use our Service.
                </p>
                <p>
                  These Terms constitute a legally binding agreement between you and VibeKode. We may modify these Terms at any time, and such modifications will be effective immediately upon posting. Your continued use of the Service after any modifications constitutes acceptance of the updated Terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">2. Description of Service</h2>
                <p className="mb-4">
                  VibeKode is an AI-powered application builder platform that allows users to create web applications through natural language prompts. Our Service includes:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>AI-powered code generation from text descriptions</li>
                  <li>Real-time application preview and editing capabilities</li>
                  <li>Project management and version control features</li>
                  <li>Community showcase and sharing functionality</li>
                  <li>Export and download capabilities for generated applications</li>
                  <li>Customer support and documentation</li>
                </ul>
                <p>
                  During the beta period, the Service is provided free of charge. We reserve the right to introduce pricing plans in the future with appropriate notice to users.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">3. User Accounts and Registration</h2>
                
                <h3 className="text-xl font-medium text-white mb-3">3.1 Account Creation</h3>
                <p className="mb-4">
                  To use certain features of VibeKode, you must create an account. You may register using your email address or through third-party authentication providers (Google, GitHub, etc.).
                </p>

                <h3 className="text-xl font-medium text-white mb-3">3.2 Account Security</h3>
                <p className="mb-4">You are responsible for:</p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>Maintaining the confidentiality of your account credentials</li>
                  <li>All activities that occur under your account</li>
                  <li>Immediately notifying us of any unauthorized use of your account</li>
                  <li>Ensuring that your account information is accurate and up-to-date</li>
                </ul>

                <h3 className="text-xl font-medium text-white mb-3">3.3 Account Termination</h3>
                <p className="mb-4">
                  You may delete your account at any time. We may suspend or terminate your account if you violate these Terms or engage in prohibited activities.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">4. Acceptable Use Policy</h2>
                
                <h3 className="text-xl font-medium text-white mb-3">4.1 Permitted Uses</h3>
                <p className="mb-4">You may use VibeKode to:</p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>Create legitimate web applications for personal or commercial use</li>
                  <li>Learn and experiment with AI-powered development tools</li>
                  <li>Share your creations with the community (subject to content guidelines)</li>
                  <li>Provide feedback to help improve our Service</li>
                </ul>

                <h3 className="text-xl font-medium text-white mb-3">4.2 Prohibited Activities</h3>
                <p className="mb-4">You agree not to:</p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>Create applications containing illegal, harmful, or offensive content</li>
                  <li>Generate content that infringes on intellectual property rights</li>
                  <li>Use the Service to create malware, phishing sites, or other malicious applications</li>
                  <li>Attempt to reverse engineer, decompile, or extract our AI models</li>
                  <li>Overload our systems through automated requests or excessive usage</li>
                  <li>Share account credentials or allow unauthorized access to your account</li>
                  <li>Use the Service for any unlawful purpose or in violation of applicable laws</li>
                  <li>Create fake accounts or impersonate others</li>
                  <li>Interfere with or disrupt the Service or servers</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">5. Intellectual Property Rights</h2>
                
                <h3 className="text-xl font-medium text-white mb-3">5.1 Your Content</h3>
                <p className="mb-4">
                  You retain ownership of the applications and content you create using VibeKode. However, by using our Service, you grant us a limited, non-exclusive license to:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>Store and process your content to provide the Service</li>
                  <li>Use anonymized data to improve our AI models and platform</li>
                  <li>Display your shared projects in the community showcase (with your permission)</li>
                </ul>

                <h3 className="text-xl font-medium text-white mb-3">5.2 VibeKode&apos;s Intellectual Property</h3>
                <p className="mb-4">
                  VibeKode and all related technology, including our AI models, algorithms, user interface, and branding, are owned by us and protected by intellectual property laws. You may not copy, modify, or distribute our technology without express written permission.
                </p>

                <h3 className="text-xl font-medium text-white mb-3">5.3 Third-Party Content</h3>
                <p className="mb-4">
                  Our Service may incorporate third-party libraries, frameworks, or APIs. Such content is subject to their respective licenses and terms of use.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">6. Privacy and Data Protection</h2>
                <p className="mb-4">
                  Your privacy is important to us. Our collection, use, and protection of your personal information is governed by our <Link href="/legal/privacy" className="text-[#1ca0fb] hover:text-[#00ccb1]">Privacy Policy</Link>, which is incorporated into these Terms by reference. By using our Service, you consent to the practices described in our Privacy Policy.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">7. Beta Service Disclaimer</h2>
                <p className="mb-4">
                  VibeKode is currently in beta testing. This means:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>The Service may contain bugs, errors, or incomplete features</li>
                  <li>Service availability and performance may vary</li>
                  <li>Features and functionality may change without notice</li>
                  <li>Data loss or corruption may occur (though we implement safeguards to prevent this)</li>
                  <li>The Service is provided &quot;as-is&quot; during the beta period</li>
                </ul>
                <p>
                  We appreciate your participation in our beta program and encourage you to report any issues or provide feedback.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">8. Service Availability and Maintenance</h2>
                <p className="mb-4">
                  We strive to maintain high service availability but do not guarantee uninterrupted access. We may:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>Perform scheduled maintenance with advance notice when possible</li>
                  <li>Implement emergency maintenance or security updates as needed</li>
                  <li>Experience temporary outages due to technical issues or third-party dependencies</li>
                  <li>Modify or discontinue features with reasonable notice</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">9. Limitation of Liability</h2>
                <p className="mb-4">
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, VIBEKODE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>Loss of profits, data, or business opportunities</li>
                  <li>Service interruptions or security breaches</li>
                  <li>Errors in AI-generated content or code</li>
                  <li>Third-party actions or content</li>
                  <li>Any damages arising from use of the Service</li>
                </ul>
                <p>
                  Our total liability for any claims related to the Service shall not exceed the amount you paid us in the twelve months preceding the claim (currently $0 during beta).
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">10. Disclaimer of Warranties</h2>
                <p className="mb-4">
                  THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>Merchantability, fitness for a particular purpose, or non-infringement</li>
                  <li>Accuracy, reliability, or completeness of AI-generated content</li>
                  <li>Uninterrupted or error-free operation</li>
                  <li>Security or freedom from harmful components</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">11. Indemnification</h2>
                <p className="mb-4">
                  You agree to defend, indemnify, and hold harmless VibeKode and its officers, directors, employees, and agents from any claims, damages, or expenses (including reasonable attorneys&apos; fees) arising from:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>Your use of the Service</li>
                  <li>Your violation of these Terms</li>
                  <li>Your infringement of any third-party rights</li>
                  <li>Content you create or share through the Service</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">12. Governing Law and Dispute Resolution</h2>
                <p className="mb-4">
                  These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to conflict of law principles. Any disputes arising from these Terms or your use of the Service shall be resolved through:
                </p>
                <ol className="list-decimal pl-6 mb-4 space-y-2">
                  <li>Good faith negotiation between the parties</li>
                  <li>Binding arbitration if negotiation fails (where legally permissible)</li>
                  <li>Courts of competent jurisdiction in [Your Jurisdiction] as a last resort</li>
                </ol>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">13. International Users</h2>
                <p className="mb-4">
                  VibeKode is operated from [Your Country]. If you access the Service from outside [Your Country], you are responsible for compliance with local laws and regulations. The Service may not be available in all jurisdictions.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">14. Termination</h2>
                <p className="mb-4">
                  These Terms remain in effect until terminated by either party. We may terminate or suspend your access immediately, without prior notice, for any breach of these Terms. Upon termination:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>Your right to use the Service ceases immediately</li>
                  <li>You may download your projects and data (subject to technical feasibility)</li>
                  <li>We may delete your account and associated data after a reasonable period</li>
                  <li>Provisions regarding intellectual property, liability, and disputes shall survive</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">15. Changes to Terms</h2>
                <p className="mb-4">
                  We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting on our website. We will provide notice of material changes through:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>Email notification to registered users</li>
                  <li>Prominent notices on our website</li>
                  <li>In-app notifications when appropriate</li>
                </ul>
                <p>
                  Your continued use of the Service after changes constitutes acceptance of the updated Terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">16. Severability</h2>
                <p className="mb-4">
                  If any provision of these Terms is found to be unenforceable or invalid, that provision will be limited or eliminated to the minimum extent necessary so that the remaining Terms will remain in full force and effect.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">17. Contact Information</h2>
                <p className="mb-4">
                  If you have any questions about these Terms, please contact us:
                </p>
                <div className="bg-[#333338]/50 p-4 rounded-lg">
                  <p><strong>Email:</strong> <a href="mailto:legal@vibekode.studio" className="text-[#1ca0fb] hover:text-[#00ccb1]">legal@vibekode.studio</a></p>
                  <p><strong>General Contact:</strong> <a href="mailto:hello.vibekode@gmail.com" className="text-[#1ca0fb] hover:text-[#00ccb1]">hello.vibekode@gmail.com</a></p>
                  <p><strong>Website:</strong> <a href="https://vibekode.studio" className="text-[#1ca0fb] hover:text-[#00ccb1]">https://vibekode.studio</a></p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">18. Entire Agreement</h2>
                <p>
                  These Terms, together with our Privacy Policy and any other policies referenced herein, constitute the entire agreement between you and VibeKode regarding the use of our Service and supersede all prior agreements and understandings.
                </p>
              </section>

            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-[#333338] text-center">
            <Link 
              href="/legal/privacy" 
              className="text-[#1ca0fb] hover:text-[#00ccb1] mr-6"
            >
              View Privacy Policy
            </Link>
            <Link 
              href="/" 
              className="text-zinc-400 hover:text-zinc-300"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
    </SmoothScroll>
  );
}
