import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | VibeKode - Create AI Apps in Minutes",
  description: "Join the VibeKode beta today. Create unlimited applications with our revolutionary prompt-to-code platform. Start building for free.",
  keywords: [
    "VibeKode sign up",
    "create account",
    "register vibeKode",
    "free ai app builder",
    "join beta",
    "developer account"
  ],
  openGraph: {
    title: "Join VibeKode - The AI App Builder",
    description: "Turn your ideas into production-ready apps instantly. Sign up for free access.",
    url: "https://vibekode.studio/signup",
    siteName: "VibeKode Studio",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Join VibeKode",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Start Building with VibeKode",
    description: "Sign up today and start generating full-stack apps with AI.",
    images: ["/logo.png"],
  },
  alternates: {
    canonical: "https://vibekode.studio/signup",
  },
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}