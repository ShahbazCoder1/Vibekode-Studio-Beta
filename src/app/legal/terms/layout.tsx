import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions - VibeKode AI App Builder",
  description: "Read VibeKode's terms and conditions governing the use of our AI-powered application builder platform. Understand your rights and responsibilities when using our service.",
  keywords: [
    "VibeKode terms of service",
    "terms and conditions",
    "user agreement",
    "AI app builder terms",
    "service agreement",
    "user responsibilities",
    "platform rules"
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Terms & Conditions - VibeKode",
    description: "Read VibeKode's terms and conditions governing the use of our AI-powered application builder platform.",
    url: "https://vibekode.studio/legal/terms",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Terms & Conditions - VibeKode",
    description: "Read VibeKode's terms and conditions governing the use of our AI-powered application builder platform.",
  },
  alternates: {
    canonical: "https://vibekode.studio/legal/terms",
  },
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
