import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "VibeKode Pricing - Free AI App Builder | Beta Access Available",
  description: "Get unlimited access to VibeKode's AI-powered app builder for free during beta. Create unlimited applications with our revolutionary prompt-to-code platform. No credit card required!",
  keywords: [
    "VibeKode pricing",
    "free AI app builder",
    "VibeKode beta access",
    "no-code pricing",
    "free app generator",
    "AI development tools pricing",
    "VibeKode subscription",
    "unlimited app creation",
    "beta pricing",
    "free web app builder"
  ],
  openGraph: {
    title: "VibeKode Pricing - Free During Beta | Unlimited AI App Creation",
    description: "Join thousands of developers using VibeKode's free AI app builder. Create unlimited applications during our beta period with no restrictions!",
    url: "https://vibekode.studio/pricing",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "VibeKode Pricing - Free AI App Builder",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VibeKode Pricing - Free During Beta",
    description: "Get unlimited access to AI-powered app creation. Join the beta now!",
    images: ["/logo.png"],
  },
  alternates: {
    canonical: "https://vibekode.studio/pricing",
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
