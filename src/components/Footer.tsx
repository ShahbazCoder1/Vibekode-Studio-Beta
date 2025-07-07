"use client";

import React, { FC } from "react";
import Link from "next/link";
import Image from "next/image";
import { Twitter, Github, Instagram } from "lucide-react";

interface LinkItem {
  label: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: LinkItem[];
}

// --- Data (no changes here) ---
const footerLinks: FooterSection[] = [
  {
    title: "Product",
    links: [
      { label: "Home", href: "/" },
      { label: "Pricing", href: "/pricing" },
      { label: "Community Showcase", href: "/#community-showcase" },
      { label: "Start Building", href: "/project" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About VibeKode", href: "/about" },
      { label: "Contact Us", href: "mailto:hello.vibekode@gmail.com" },
      { label: "Beta Program", href: "/pricing" },
      { label: "Feedback", href: "mailto:hello.vibekode@gmail.com" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Support", href: "mailto:hello.vibekode@gmail.com" },
      { label: "Feature Requests", href: "mailto:hello.vibekode@gmail.com" },
    ],
  },
  {
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
      {/* Organization Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationStructuredData) }}
      />
      
      <footer className="w-full bg-gradient-to-br from-gray-900 to-black dark:from-gray-900 dark:to-black border-t border-gray-800 dark:border-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-100 dark:text-gray-100 mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-indigo-400 dark:text-gray-400 dark:hover:text-indigo-400 transition duration-150"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 dark:border-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center overflow-hidden">
                  <Image
                    src="/logo.png"
                    alt="Logo"
                    width={32}
                    height={32}
                    className="object-cover"
                  />
                </div>
                <span className="text-xl font-bold text-white">
                  VibeKode
                </span>
              </div>
            </div>

            <div className="mt-4 md:mt-0">
              <div className="flex space-x-6">
                {/* Twitter Icon */}
                <a
                  href="#"
                  className="text-gray-500 hover:text-gray-300 dark:hover:text-gray-300"
                >
                  <span className="sr-only">Twitter</span>
                  <Twitter className="h-5 w-5" />
                </a>
                {/* GitHub Icon */}
                <a
                  href="#"
                  className="text-gray-500 hover:text-gray-300 dark:hover:text-gray-300"
                >
                  <span className="sr-only">GitHub</span>
                  <Github className="h-5 w-5" />
                </a>
                {/* Instagram Icon */}
                <a
                  href="#"
                  className="text-gray-500 hover:text-gray-300 dark:hover:text-gray-300"
                >
                  <span className="sr-only">Instagram</span>
                  <Instagram className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-xs text-gray-400 dark:text-gray-400">
              © {new Date().getFullYear()} VibeKode. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
    </>
  );
};