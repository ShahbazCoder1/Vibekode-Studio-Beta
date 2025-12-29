import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://vibekode.studio"),
  title: {
    default: "VibeKode - Turn Ideas into Apps Instantly",
    template: "%s",
  },
  description:
    "Build software products, using only a chat interface. Prompt, run, edit & deploy apps",
  keywords: [
    "VibeKode",
    "VibeKode studio",
    "gpt software engineer",
    "AI app builder",
    "no-code platform",
    "app generator",
    "web app creator",
    "AI coding assistant",
    "instant app development",
    "automated coding",
    "AI development tool",
    "code generation",
    "web development",
    "app development",
    "AI programming",
    "visual programming",
    "AI-powered development",
    "rapid prototyping",
    "instant web apps",
    "website builder",
    "ai website builder",
    "Vibecode app creator",
    "no code website builder",
    "software engineer",
    "full stack engineer",
    "product engineer",
    "frontend engineer",
    "backend engineer",
    "ai full stack engineer",
    "ai developer",
    "ai coder",
    "ai engineer",
    "ai software engineer",
    "learn to code",
    "build website",
    "build app",
    "web agency",
  ],
  authors: [{ name: "VibeKode Team" }],
  creator: "VibeKode",
  publisher: "VibeKode",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://vibekode.studio",
    title: "VibeKode - Turn Ideas into Apps Instantly",
    description:
      "Build software products, using only a chat interface. Prompt, run, edit & deploy apps",
    siteName: "VibeKode",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "VibeKode - AI-Powered App Creator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VibeKode - Turn Ideas into Apps Instantly",
    description:
      "Build software products, using only a chat interface. Prompt, run, edit & deploy apps",
    images: ["/logo.png"],
    creator: "@vibekode",
    site: "@vibekode",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "015xBxzag336d2WnLnZdbJvYgLEj-Vo87DfZebanWmE",
  },
  category: "Technology",
  other: {
    "theme-color": "#09090b",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "VibeKode",
    "application-name": "VibeKode",
    "mobile-web-app-capable": "yes",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      // 1. Organization (Unified Company Info)
      {
        "@type": "Organization",
        "@id": "https://vibekode.studio/#organization",
        name: "VibeKode",
        alternateName: "VibeKode Studio",
        url: "https://vibekode.studio",
        logo: {
          "@type": "ImageObject",
          url: "https://vibekode.studio/logo.png",
          width: 1200,
          height: 630,
        },
        description:
          "AI-powered application builder that creates web apps from simple text prompts.",
        foundingDate: "2025",
        sameAs: [
          "https://www.linkedin.com/company/vibekode-studio/",
          "https://www.reddit.com/r/VibeKode/",
          "https://www.instagram.com/vibekode.studio/",
        ],
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer service",
          email: "hello.vibekode@gmail.com",
          availableLanguage: "English",
        },
      },
      // 2. Website
      {
        "@type": "WebSite",
        "@id": "https://vibekode.studio/",
        name: "VibeKode Studio",
        url: "https://vibekode.studio",
        description:
          "Build your next idea faster - From idea to code in seconds, with your personal AI assistant.",
        publisher: {
          "@id": "https://vibekode.studio/#organization",
        },
      },
      // 3. Software Application (Main product details with updated Pricing)
      {
        "@type": "SoftwareApplication",
        "@id": "https://vibekode.studio/#software",
        name: "VibeKode",
        alternateName: "VibeKode AI App Builder",
        description:
          "Build software products using only a chat interface. Prompt, run, edit & deploy apps instantly.",
        url: "https://vibekode.studio",
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Web Browser",
        softwareVersion: "1.0 Beta",
        datePublished: "2024-01-01",
        featureList: [
          "AI-powered code generation",
          "Instant app creation from text prompts",
          "No coding experience required",
          "Real-time preview and editing",
          "Multiple export formats",
          "Responsive web applications",
          "Community project sharing",
          "Private project management",
          "Commercial code ownership",
        ],
        offers: [
          {
            "@type": "Offer",
            name: "Free Beta",
            price: "0",
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
            description: "5 daily credits, public projects",
          },
          {
            "@type": "Offer",
            name: "Go Plan",
            price: "5.00",
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
            priceSpecification: {
              "@type": "UnitPriceSpecification",
              price: "5.00",
              priceCurrency: "USD",
              unitCode: "MON",
            },
            description: "50 monthly credits, 5 private projects",
          },
          {
            "@type": "Offer",
            name: "Pro Plan",
            price: "15.00",
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
            priceSpecification: {
              "@type": "UnitPriceSpecification",
              price: "15.00",
              priceCurrency: "USD",
              unitCode: "MON",
            },
            description:
              "150 monthly credits, unlimited private projects, commercial rights",
          },
        ],
        author: {
          "@id": "https://vibekode.studio/#organization",
        },
        screenshot: {
          "@type": "ImageObject",
          url: "https://vibekode.studio/logo.png",
          width: 1200,
          height: 630,
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "5.0",
          ratingCount: "1000",
          bestRating: "5",
          worstRating: "1",
        },
      },
      // 4. Site Navigation
      {
        "@type": "SiteNavigationElement",
        "@id": "https://vibekode.studio/#navigation",
        name: "Main Navigation",
        hasPart: [
          {
            "@type": "WebPage",
            name: "Home",
            url: "https://vibekode.studio/",
          },
          {
            "@type": "WebPage",
            name: "Pricing",
            url: "https://vibekode.studio/pricing",
          },
          {
            "@type": "WebPage",
            name: "Community",
            url: "https://vibekode.studio/#community-showcase",
          },
          {
            "@type": "WebPage",
            name: "About",
            url: "https://vibekode.studio/about",
          },
          {
            "@type": "WebPage",
            name: "Login",
            url: "https://vibekode.studio/login",
          },
          {
            "@type": "WebPage",
            name: "Sign Up",
            url: "https://vibekode.studio/signup",
          },
        ],
      },
    ],
  };

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#18181b" />
        <meta name="msapplication-TileColor" content="#18181b" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="VibeKode" />
        <meta name="application-name" content="VibeKode" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msvalidate.01" content="B6049CF5175263390C4915A70D62AAD7" />

        {/* Canonical URL */}
        <link rel="canonical" href="https://vibekode.studio" />

        {/* Favicon and Touch Icons */}
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link
          rel="icon"
          type="image/png"
          sizes="96x96"
          href="/favicon-96x96.png"
        />
        <link rel="manifest" href="/manifest.json" />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
