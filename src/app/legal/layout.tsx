import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - VibeKode AI App Builder",
  description: "Learn how VibeKode protects your privacy and handles your personal data. Our comprehensive privacy policy outlines data collection, usage, and your rights.",
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
  alternates: {
    canonical: "https://vibekode.studio/legal/privacy",
  },
};

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
