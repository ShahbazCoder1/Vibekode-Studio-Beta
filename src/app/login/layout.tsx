import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | VibeKode - Access Your Projects",
  description: "Welcome back to VibeKode. Log in to access your dashboard, projects, and continue building your AI-powered applications.",
  keywords: [
    "VibeKode login",
    "sign in",
    "access dashboard",
    "ai builder login",
    "vibekode account",
    "login"
  ],
  openGraph: {
    title: "Login to VibeKode",
    description: "Access your AI app development dashboard.",
    url: "https://vibekode.studio/login",
    siteName: "VibeKode Studio",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "VibeKode Login",
      },
    ],
    type: "website",
  },
  alternates: {
    canonical: "https://vibekode.studio/login",
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}