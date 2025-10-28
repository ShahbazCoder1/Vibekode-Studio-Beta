"use client";

import React, { FC } from "react";
import Link from "next/link";
import Image from "next/image";
import { Twitter, Github, Instagram, ArrowRight } from "lucide-react";

interface LinkItem {
  label: string;
  href: string;
}

interface FooterSection {
  id: string;
  title: string;
  links: LinkItem[];
}

const footerLinks: FooterSection[] = [
  {
    id: "product-links",
    title: "Product",
    links: [
      { label: "Home", href: "/" },
      { label: "Pricing", href: "/pricing" },
      { label: "Community Showcase", href: "/#community-showcase" },
    ],
  },
  {
    id: "company-links",
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "mailto:hello.vibekode@gmail.com" },
    ],
  },
  {
    id: "legal-links",
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/legal/privacy" },
      { label: "Terms & Conditions", href: "/legal/terms" },
    ],
  },
];

export const Footer: FC = () => {
  const organizationStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "VibeKode",
    "alternateName": "VibeKode AI App Builder",
    "url": "https://vibekode.studio",
    "logo": "https://vibekode.studio/logo.png",
    "description": "AI-powered application builder that creates web apps from simple text prompts",
    "foundingDate": "2025",
    "sameAs": [
      "https://twitter.com/vibekode",
      "https://github.com/vibekode",
      "https://instagram.com/vibekode"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "email": "hello.vibekode@gmail.com",
      "availableLanguage": "English"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationStructuredData) }}
      />
      
      <footer className="w-full bg-black dark:bg-black border-t border-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="lg:flex lg:items-start lg:justify-between lg:gap-8">
            <div className="max-w-md space-y-6">
              <Link href="/" className="flex items-center space-x-3 transition-transform hover:scale-105" aria-label="VibeKode Home">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center overflow-hidden shadow-lg">
                  <Image
                    src="/logo.png"
                    alt="VibeKode Logo"
                    width={40}
                    height={40}
                    className="object-cover transition-transform duration-300 hover:scale-110"
                  />
                </div>
                <span className="text-3xl font-bold tracking-tight text-white">
                  VibeKode
                </span>
              </Link>
              <p className="text-gray-400 text-sm">
                Unlock your creativity with the AI app builder. Turn your ideas into functional web applications with simple text prompts.
              </p>
              <Link
                href="/project"
                className="group inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-gradient-to-r from-[#00ccb1] via-[#7b61ff] to-[#1ca0fb] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 transform active:scale-95 ease-out"
              >
                Start Building Now
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="mt-12 grid grid-cols-2 gap-8 lg:mt-0 lg:grid-cols-3 xl:grid-cols-4">
              {footerLinks.map((section) => (
                <nav key={section.title} aria-labelledby={section.id}>
                  <h3 id={section.id} className="text-sm font-semibold uppercase tracking-wider text-gray-100 mb-4">
                    {section.title}
                  </h3>
                  <ul className="space-y-3">
                    {section.links.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="text-sm text-gray-400 hover:text-indigo-400 transition duration-200"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              ))}
              <section className="lg:col-start-4" aria-labelledby="social-links">
                <h3 id="social-links" className="text-sm font-semibold uppercase tracking-wider text-gray-100 mb-4">
                  Stay Connected
                </h3>
                <address className="flex space-x-4 not-italic">
                  <a
                    href="https://twitter.com/vibekode"
                    className="text-gray-500 hover:text-white transition duration-200"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Follow VibeKode on Twitter"
                  >
                    <Twitter className="h-6 w-6" />
                  </a>
                  <a
                    href="https://github.com/vibekode"
                    className="text-gray-500 hover:text-white transition duration-200"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Follow VibeKode on Github"
                  >
                    <Github className="h-6 w-6" />
                  </a>
                  <a
                    href="https://instagram.com/vibekode"
                    className="text-gray-500 hover:text-white transition duration-200"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Follow VibeKode on Instagram"
                  >
                    <Instagram className="h-6 w-6" />
                  </a>
                </address>
              </section>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-800">
            <div className="text-center md:flex md:items-center md:justify-center">
              <p className="text-xs text-gray-500">
                &copy; {new Date().getFullYear()} VibeKode. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};