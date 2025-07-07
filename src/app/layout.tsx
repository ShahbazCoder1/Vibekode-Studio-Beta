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
  metadataBase: new URL('https://vibekode.studio'),
  title: {
    default: "VibeKode - AI-Powered App Creator | Build Apps with Simple Prompts",
    template: "%s | VibeKode - AI App Builder"
  },
  description: "Transform your ideas into fully functional web applications instantly with VibeKode's revolutionary AI platform. Simply describe what you want to build, and our advanced AI will generate complete, production-ready code in seconds. No programming experience required!",
  keywords: [
    "VibeKode",
    "Vibecode AI app builder",
    "Vibecode app creator",
    "Vibecode no code platform",
    "AI app builder",
    "no-code platform",
    "app generator",
    "web app creator",
    "AI coding assistant",
    "instant app development",
    "prompt to code",
    "automated coding",
    "AI development tool",
    "code generation",
    "web development",
    "app development",
    "AI programming",
    "visual programming",
    "Vibecode platform",
    "AI-powered development",
    "rapid prototyping",
    "instant web apps",
    "VibeKode studio",
    "beta app builder"
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
    title: "VibeKode - AI-Powered App Creator | Build Apps with Simple Prompts",
    description: "Transform your ideas into fully functional web applications instantly with VibeKode's revolutionary AI platform. Simply describe what you want to build, and our advanced AI will generate complete, production-ready code in seconds.",
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
    title: "VibeKode - AI-Powered App Creator | Build Apps with Simple Prompts",
    description: "Transform your ideas into fully functional web applications instantly with VibeKode's revolutionary AI platform. Simply describe what you want to build, and our advanced AI will generate complete, production-ready code in seconds.",
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
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "015xBxzag336d2WnLnZdbJvYgLEj-Vo87DfZebanWmE",
  },
  category: "Technology",
  other: {
    'theme-color': '#7b61ff',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'VibeKode',
    'application-name': 'VibeKode',
    'mobile-web-app-capable': 'yes',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "VibeKode",
    "alternateName": "VibeKode AI App Builder",
    "description": "AI-powered application builder that creates web apps from simple text prompts. Transform your ideas into functional applications instantly with VibeKode's revolutionary platform.",
    "url": "https://vibekode.studio",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Web Browser",
    "browserRequirements": "Modern web browser with JavaScript enabled",
    "softwareVersion": "1.0 Beta",
    "datePublished": "2024-01-01",
    "dateModified": "2025-01-01",
    "publisher": {
      "@type": "Organization",
      "name": "VibeKode",
      "url": "https://vibekode.studio",
      "logo": {
        "@type": "ImageObject",
        "url": "https://vibekode.studio/logo.png",
        "width": 1200,
        "height": 630
      }
    },
    "creator": {
      "@type": "Organization",
      "name": "VibeKode Team",
      "url": "https://vibekode.studio"
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "description": "Free during beta period"
    },
    "featureList": [
      "AI-powered code generation",
      "Instant app creation from text prompts",
      "No coding experience required",
      "Real-time preview and editing",
      "Multiple export formats",
      "Responsive web applications",
      "Community project sharing",
      "Beta access available"
    ],
    "keywords": "VibeKode, AI app builder, no-code platform, prompt to code, web app creator, instant development",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://vibekode.studio"
    },
    "image": {
      "@type": "ImageObject",
      "url": "https://vibekode.studio/logo.png",
      "width": 1200,
      "height": 630
    },
    "screenshot": {
      "@type": "ImageObject",
      "url": "https://vibekode.studio/logo.png",
      "width": 1200,
      "height": 630
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5.0",
      "ratingCount": "1000",
      "bestRating": "5",
      "worstRating": "1"
    }
  };

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#7b61ff" />
        <meta name="msapplication-TileColor" content="#7b61ff" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="VibeKode" />
        <meta name="application-name" content="VibeKode" />
        <meta name="mobile-web-app-capable" content="yes" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://vibekode.studio" />
        
        {/* Favicon and Touch Icons */}
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
