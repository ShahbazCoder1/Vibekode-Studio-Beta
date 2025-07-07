import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "VibeKode Dashboard - AI App Builder Workspace",
  description: "Access your VibeKode dashboard to manage and create AI-powered applications. Private workspace for authenticated users only.",
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

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
