import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Processing Subscription | VibeKode",
  description: "Completing your secure transaction...",
  // CRITICAL: Block search engines from indexing this page
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      "noimageindex": true,
    },
  },
};

export default function SuccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}