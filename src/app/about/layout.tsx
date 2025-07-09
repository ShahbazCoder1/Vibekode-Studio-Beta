import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About VibeKode - Revolutionary AI-Powered App Creator",
  description: "Learn about VibeKode's mission to democratize app development through AI. Discover how our revolutionary platform transforms simple text prompts into fully functional web applications, making coding accessible to everyone.",
  keywords: [
    "About VibeKode",
    "VibeKode story",
    "AI app development",
    "company mission",
    "VibeKode team",
    "democratizing coding",
    "AI-powered development",
    "no-code revolution",
    "VibeKode vision",
    "app creation platform"
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "About VibeKode - Revolutionary AI-Powered App Creator",
    description: "Learn how VibeKode makes app building easy with AI. Turn your ideas into real apps using simple text prompts. Build apps and websites fast with no-code tools.",
    url: "https://vibekode.studio/about",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "About VibeKode - AI-Powered App Creator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About VibeKode - Revolutionary AI-Powered App Creator",
    description: "Learn how VibeKode makes app building easy with AI. Turn your ideas into real apps using simple text prompts. Build apps and websites fast with no-code tools.",
    images: ["/logo.png"],
  },
  alternates: {
    canonical: "https://vibekode.studio/about",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
