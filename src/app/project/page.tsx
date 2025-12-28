"use client";

import React, { useState, useEffect, Suspense } from "react";
import {
  Users,
  Settings,
  CreditCard,
  MessageCircle,
  Menu,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

// Local Component Imports
import FuturisticSidebar, { SidebarContent } from "@/components/sidebar";
import SmoothScroll from "@/components/ui/SmoothScroll";
import { AuroraBackground } from "@/components/ui/aurora-background";
import HeroTitle from "@/components/Hero-title";
import PromptBox from "@/components/Prompt-Box";
import ScrollDown from "@/components/Scroll-Down";
import CommunityProject from "@/components/Community-Project";
import SettingsModal from "@/components/SettingsModal";
import CommunityModal from "@/components/CommunityModal";

// Firebase Imports
import {
  subscribeToAuthChanges,
  AppUser,
  logout,
  getUserProjects,
  ProjectDocument,
} from "@/lib/firebase";

// Main Content Component with the CORRECTED responsive margin
const MainContent = ({ isSidebarExpanded }: { isSidebarExpanded: boolean }) => (
  <main
    className={cn(
      "transition-all duration-300 ease-in-out",
      // This logic now applies margin ONLY on medium screens (desktop) and larger.
      // On mobile, the margin will be 0.
      isSidebarExpanded ? "md:ml-[260px]" : "md:ml-[80px]"
    )}
  >
    <div className="h-full w-full bg-neutral-900">
      <AuroraBackground>
        <div className="relative flex min-h-screen flex-col items-center justify-center">
          <HeroTitle />
          <PromptBox containerClassName="flex items-center justify-center w-full max-w-[calc(100vw-1rem)] sm:max-w-[calc(100vw-2rem)] px-2 sm:px-4" />
          <ScrollDown text="Scroll to explore more" />
        </div>
      </AuroraBackground>
      <div id="community-showcase" className="bg-[#18181b]">
        <CommunityProject />
      </div>
    </div>
  </main>
);

// Mobile Sidebar specific variants
const mobileSidebarVariants = {
  hidden: { x: "-100%", transition: { duration: 0.3, ease: "easeInOut" } },
  visible: { x: "0%", transition: { duration: 0.3, ease: "easeInOut" } },
};

// Main Page Component
function ProjectPageContent() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<ProjectDocument[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showCommunityModal, setShowCommunityModal] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Check if running in mobile app mode
  const isMobileApp = searchParams.get("mode") === "mobileapp";

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((authUser) => {
      setUser(authUser);
      if (authUser) loadUserProjects(authUser.uid);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    fetch("https://keypulselive.onrender.com/stats").catch(() => { });
  }, []);

  const loadUserProjects = async (userId: string) => {
    setProjectsLoading(true);
    try {
      setProjects(await getUserProjects(userId));
    } catch (error) {
      console.error("Error loading user projects:", error);
      setProjects([]);
    } finally {
      setProjectsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      const redirectUrl = isMobileApp ? "/login?mode=mobileapp" : "/";
      router.push(redirectUrl);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const links = [
    {
      label: "Community Showcase",
      href: "#",
      icon: <Users className="h-5 w-5" />,
      onClick: () => {
        setShowCommunityModal(true);
        setIsMobileOpen(false);
      },
    },
    {
      label: "Settings",
      href: "#",
      icon: <Settings className="h-5 w-5" />,
      onClick: () => {
        setShowSettingsModal(true);
        setIsMobileOpen(false);
      },
    },
    {
      label: "Manage Subscription",
      href: "/pricing",
      icon: <CreditCard className="h-5 w-5" />,
    },
    {
      label: "Contact Us!",
      href: "mailto:hello.vibekode@gmail.com",
      icon: <MessageCircle className="h-5 w-5" />,
    },
  ];

  // Handle redirection for unauthenticated users
  useEffect(() => {
    if (!loading && !user) {
      console.log("No user found on project page, redirecting to login...");
      const loginUrl = isMobileApp ? "/login?mode=mobileapp" : "/login";
      router.push(loginUrl);
    }
  }, [user, loading, isMobileApp, router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#18181b]">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-purple-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#18181b]">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <SmoothScroll>
      <div className="bg-neutral-900">
        <FuturisticSidebar
          user={user}
          projects={projects}
          projectsLoading={projectsLoading}
          links={links}
          onLogout={handleLogout}
          isExpanded={isSidebarExpanded}
          setIsExpanded={setIsSidebarExpanded}
        />

        <AnimatePresence>
          {isMobileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileOpen(false)}
                className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
              />
              <motion.div
                variants={mobileSidebarVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="fixed left-0 top-0 z-50 h-full w-[260px] border-r border-white/10 bg-neutral-900/90 md:hidden"
              >
                <SidebarContent
                  user={user}
                  projects={projects}
                  projectsLoading={projectsLoading}
                  links={links}
                  onLogout={handleLogout}
                  isExpanded={true}
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <MainContent isSidebarExpanded={isSidebarExpanded} />

        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="fixed left-4 top-4 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-md md:hidden"
          aria-label="Toggle menu"
        >
          {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <CommunityModal
          isOpen={showCommunityModal}
          onClose={() => setShowCommunityModal(false)}
        />
        <SettingsModal
          isOpen={showSettingsModal}
          onClose={() => setShowSettingsModal(false)}
        />
      </div>
    </SmoothScroll>
  );
}

// Wrapped export with Suspense boundary
export default function ProjectPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-[#18181b]">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-purple-500"></div>
        </div>
      }
    >
      <ProjectPageContent />
    </Suspense>
  );
}
