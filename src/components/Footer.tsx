"use client";

import React, { FC } from "react";
import Link from "next/link";
import Image from "next/image";
import { Linkedin, Instagram, ArrowRight } from "lucide-react";

interface LinkItem {
  label: string;
  href: string;
}

interface FooterSection {
  id: string;
  title: string;
  links: LinkItem[];
}

// Custom Reddit Icon
const RedditIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
  </svg>
);

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

  return (
    <>
      
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
                className="group inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-gradient-to-r from-[#5b21b6] to-[#1e40af] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 transform active:scale-95 ease-out"
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
                    href="https://www.reddit.com/r/VibeKode/"
                    className="text-gray-500 hover:text-white transition duration-200"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Follow VibeKode on Reddit"
                  >
                    <RedditIcon className="h-6 w-6" />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/vibekode-studio/"
                    className="text-gray-500 hover:text-white transition duration-200"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Follow VibeKode on Linkedin"
                  >
                    <Linkedin className="h-6 w-6" />
                  </a>
                  <a
                    href="https://www.instagram.com/vibekode.studio/"
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