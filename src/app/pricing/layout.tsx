import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "VibeKode Pricing - Flexible Plans for AI App Development",
  description: "Compare VibeKode plans. Start building for free with daily credits or upgrade to Go ($5) and Pro ($15) for unlimited AI generation, private projects, and commercial rights.",
  keywords: [
    "VibeKode pricing",
    "AI app builder cost",
    "VibeKode Pro plan",
    "free react app generator",
    "affordable AI coding tools",
    "VibeKode subscription",
    "no-code platform pricing",
    "generative AI development costs",
    "unlimited code generation",
    "web app builder pricing"
  ],
  authors: [{ name: "VibeKode Team" }],
  openGraph: {
    title: "VibeKode Pricing | Start Free, Scale with Pro",
    description: "Choose the perfect plan to build AI apps faster. Unlock unlimited generations, private projects, and priority processing starting at just $5/month.",
    url: "https://vibekode.studio/pricing",
    siteName: "VibeKode Studio",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/logo.png", // Ensure this image is high quality
        width: 1200,
        height: 630,
        alt: "VibeKode Pricing Plans - Free, Go, and Pro",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VibeKode Pricing - Build Apps Faster for Less",
    description: "From free hobby projects to professional commercial apps. Check out our affordable plans starting at $0.",
    images: ["/logo.png"],
    creator: "@vibekode", // Update if you have a specific handle
  },
  alternates: {
    canonical: "https://vibekode.studio/pricing",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}