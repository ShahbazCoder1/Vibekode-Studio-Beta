import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - VibeKode AI App Builder",
  description: "LSee how VibeKode keeps your data safe. Learn what data we collect, how we use it, and your rights when using our AI app builder.",
  keywords: [
    "VibeKode privacy policy",
    "data protection",
    "user privacy",
    "AI app builder privacy",
    "personal information protection",
    "GDPR compliance",
    "data security"
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Privacy Policy - VibeKode",
    description: "Learn how VibeKode protects your privacy and handles your personal data.",
    url: "https://vibekode.studio/legal/privacy",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Privacy Policy - VibeKode",
    description: "Learn how VibeKode protects your privacy and handles your personal data.",
  },
  alternates: {
    canonical: "https://vibekode.studio/legal/privacy",
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
