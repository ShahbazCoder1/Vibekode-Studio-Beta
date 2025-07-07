import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "VibeKode Project Editor - AI App Builder",
  description: "Edit and develop your AI-generated application in VibeKode's interactive workspace. Private project area for authenticated users.",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function ProjectIdLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
