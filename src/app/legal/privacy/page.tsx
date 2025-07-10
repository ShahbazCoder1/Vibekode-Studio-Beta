"use client";

import React from "react";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import ScrollingBetaBanner from "@/components/ScrollingBetaBanner";
import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#18181b]">
      <ScrollingBetaBanner />
      
      {/* Fixed header */}
      <Header />
      
      <main className="max-w-4xl mx-auto px-6 py-16 pt-24">
        <div className="bg-[#252529]/50 backdrop-blur-sm rounded-2xl p-8 border border-[#333338]/50">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
            <p className="text-zinc-300 text-lg">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div className="prose prose-invert max-w-none">
            <div className="text-zinc-300 space-y-8">
              
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">1. Introduction</h2>
                <p className="mb-4">
                  Welcome to VibeKode (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). VibeKode is committed to protecting your privacy and ensuring you have a positive experience on our website and when using our AI-powered application builder platform. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.
                </p>
                <p>
                  By using VibeKode, you agree to the collection and use of information in accordance with this Privacy Policy. If you do not agree with our policies and practices, your choice is not to use our service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">2. Information We Collect</h2>
                
                <h3 className="text-xl font-medium text-white mb-3">2.1 Personal Information</h3>
                <p className="mb-4">We may collect the following personal information:</p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>Email address (when you create an account)</li>
                  <li>Name and profile information (if provided)</li>
                  <li>Authentication data from third-party providers (Google, GitHub, etc.)</li>
                  <li>Communication preferences</li>
                </ul>

                <h3 className="text-xl font-medium text-white mb-3">2.2 Usage Data</h3>
                <p className="mb-4">We automatically collect certain information when you use VibeKode:</p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>IP address and device information</li>
                  <li>Browser type and version</li>
                  <li>Pages visited and time spent on our service</li>
                  <li>App creation prompts and generated code (anonymized for improvement purposes)</li>
                  <li>Usage patterns and feature interactions</li>
                  <li>Error logs and performance data</li>
                </ul>

                <h3 className="text-xl font-medium text-white mb-3">2.3 Cookies and Tracking Technologies</h3>
                <p className="mb-4">
                  We use cookies, web beacons, and similar tracking technologies to enhance your experience and collect usage data. You can control cookie preferences through your browser settings.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">3. How We Use Your Information</h2>
                <p className="mb-4">We use the collected information for the following purposes:</p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>Providing and maintaining our AI app-building service</li>
                  <li>Processing your app creation requests and generating code</li>
                  <li>Personalizing your experience and improving our platform</li>
                  <li>Communicating with you about updates, features, and support</li>
                  <li>Analyzing usage patterns to enhance our AI models</li>
                  <li>Detecting and preventing fraud or abuse</li>
                  <li>Complying with legal obligations</li>
                  <li>Sending promotional communications (with your consent)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">4. Information Sharing and Disclosure</h2>
                
                <h3 className="text-xl font-medium text-white mb-3">4.1 We Do Not Sell Your Data</h3>
                <p className="mb-4">
                  VibeKode does not sell, trade, or rent your personal information to third parties.
                </p>

                <h3 className="text-xl font-medium text-white mb-3">4.2 Limited Sharing</h3>
                <p className="mb-4">We may share your information only in the following circumstances:</p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li><strong>Service Providers:</strong> With trusted third-party service providers who assist in operating our platform (hosting, analytics, customer support)</li>
                  <li><strong>Legal Requirements:</strong> When required by law, court order, or government request</li>
                  <li><strong>Safety and Security:</strong> To protect the rights, property, or safety of VibeKode, our users, or others</li>
                  <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets (with notice to users)</li>
                  <li><strong>Consent:</strong> With your explicit consent for specific purposes</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">5. Data Security</h2>
                <p className="mb-4">
                  We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Regular security assessments and updates</li>
                  <li>Access controls and authentication mechanisms</li>
                  <li>Secure cloud infrastructure with reputable providers</li>
                  <li>Regular backups and disaster recovery procedures</li>
                </ul>
                <p>
                  However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">6. Your Privacy Rights</h2>
                <p className="mb-4">Depending on your location, you may have the following rights:</p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li><strong>Access:</strong> Request access to your personal information</li>
                  <li><strong>Correction:</strong> Request correction of inaccurate or incomplete data</li>
                  <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                  <li><strong>Portability:</strong> Request transfer of your data to another service</li>
                  <li><strong>Restriction:</strong> Request restriction of processing in certain circumstances</li>
                  <li><strong>Objection:</strong> Object to processing based on legitimate interests</li>
                  <li><strong>Withdrawal:</strong> Withdraw consent for consent-based processing</li>
                </ul>
                <p>
                  To exercise these rights, please contact us at <a href="mailto:privacy@vibekode.studio" className="text-[#1ca0fb] hover:text-[#00ccb1]">privacy@vibekode.studio</a>.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">7. Data Retention</h2>
                <p className="mb-4">
                  We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law. Specifically:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>Account information: Until you delete your account or request deletion</li>
                  <li>Usage data: Up to 2 years for analytics and improvement purposes</li>
                  <li>Generated content: Until you delete projects or upon account deletion</li>
                  <li>Communication records: Up to 3 years for customer support purposes</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">8. International Data Transfers</h2>
                <p className="mb-4">
                  Your information may be transferred to and processed in countries other than your own. We ensure that such transfers comply with applicable data protection laws and implement appropriate safeguards, including standard contractual clauses approved by relevant authorities.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">9. Childrens Privacy</h2>
                <p className="mb-4">
                  VibeKode is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">10. Third-Party Services</h2>
                <p className="mb-4">
                  Our service may contain links to third-party websites or integrate with third-party services. This Privacy Policy does not apply to these external services. We encourage you to review the privacy policies of any third-party services you use.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">11. Updates to This Policy</h2>
                <p className="mb-4">
                  We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any material changes by posting the new Privacy Policy on our website and updating the &quot;Last updated&quot; date. Your continued use of VibeKode after such changes constitutes acceptance of the updated policy.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">12. Contact Information</h2>
                <p className="mb-4">
                  If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="bg-[#333338]/50 p-4 rounded-lg">
                  <p><strong>Email:</strong> <a href="mailto:privacy@vibekode.studio" className="text-[#1ca0fb] hover:text-[#00ccb1]">privacy@vibekode.studio</a></p>
                  <p><strong>General Contact:</strong> <a href="mailto:hello.vibekode@gmail.com" className="text-[#1ca0fb] hover:text-[#00ccb1]">hello.vibekode@gmail.com</a></p>
                  <p><strong>Website:</strong> <a href="https://vibekode.studio" className="text-[#1ca0fb] hover:text-[#00ccb1]">https://vibekode.studio</a></p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">13. Effective Date</h2>
                <p>
                  This Privacy Policy is effective as of {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} and will remain in effect except with respect to any changes in its provisions in the future, which will be in effect immediately after being posted on this page.
                </p>
              </section>

            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-[#333338] text-center">
            <Link 
              href="/legal/terms" 
              className="text-[#1ca0fb] hover:text-[#00ccb1] mr-6"
            >
              View Terms & Conditions
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
  );
}
