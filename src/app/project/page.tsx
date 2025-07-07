"use client";

import React, { useState, useEffect } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  Settings,
  LogOut,
  PlusCircle,
  Users,
  MessageCircle,
  CreditCard,
  FileText,
} from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { AuroraBackground } from "@/components/ui/aurora-background";
import HeroTitle from "@/components/Hero-title";
import PromptBox from "@/components/Prompt-Box";
import ScrollDown from "@/components/Scroll-Down";
import CommunityProject from "@/components/Community-Project";
import { subscribeToAuthChanges, AppUser, logout, getUserProjects, ProjectDocument } from "@/lib/firebase";
import { AuthModal } from "@/components/Auth-model";
import SettingsModal from "@/components/SettingsModal";
import CommunityModal from "@/components/CommunityModal";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import BetaBadge from "@/components/Beta-badge";

interface LinkType {
  label: string;
  href: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

export default function ProjectPage() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [open, setOpen] = useState(false);
  const [projects, setProjects] = useState<ProjectDocument[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showCommunityModal, setShowCommunityModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((authUser) => {
      setUser(authUser);
      setLoading(false);

      if (!authUser && !loading) {
        setShowAuthModal(true);
        setProjects([]);
      } else if (authUser) {
        setShowAuthModal(false);
        // Load user projects when user is authenticated
        loadUserProjects(authUser.uid);
      }
    });

    return () => unsubscribe();
  }, [loading]);

  const loadUserProjects = async (userId: string) => {
    setProjectsLoading(true);
    try {
      const userProjects = await getUserProjects(userId);
      setProjects(userProjects);
    } catch (error) {
      console.error('Error loading user projects:', error);
      setProjects([]);
    } finally {
      setProjectsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Menu links based on the sketch
  const links: LinkType[] = [
    {
      label: "Community Showcase",
      href: "#",
      icon: (
        <Users className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
      onClick: () => setShowCommunityModal(true),
    },
    {
      label: "Settings",
      href: "#",
      icon: (
        <Settings className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
      onClick: () => setShowSettingsModal(true),
    },
    {
      label: "Manage Subscription",
      href: "/pricing",
      icon: (
        <CreditCard className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Contact Us!",
      href: "mailto:hello.vibekode@gmail.com",
      icon: (
        <MessageCircle className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
  ];

  // Show loading screen while checking auth
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#18181b]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  // Show auth modal if user is not authenticated
  if (!user || showAuthModal) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-neutral-900">
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome to VibeKode Studio
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Please sign in to access your projects
            </p>
          </div>
          <AuthModal
            mode="signin"
            triggerText="Sign In to Continue"
            triggerClassName="px-6 py-3 bg-gradient-to-r from-[#00ccb1] to-[#1ca0fb] text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "mx-auto flex w-full flex-1 flex-col overflow-hidden bg-gray-100 md:flex-row dark:bg-neutral-900",
        "h-screen"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="flex flex-col justify-between h-full" style={{ backgroundColor: '#18181b' }}>
          {/* TOP SECTION - Hidden on mobile since we have header */}
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Logo - Only show on desktop */}
            <div className="hidden md:block">
              {open ? <Logo /> : <LogoIcon />}
            </div>
            
            {/* New Project Button */}
            <button
              onClick={() => router.push("/project")}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                "md:mt-4 mb-4", // Only add top margin on desktop
                open
                  ? "w-full bg-gradient-to-br from-[#7b61ff] to-[#00ccb1] hover:bg-purple-700 text-white"
                  : "justify-center w-10 h-10 bg-gradient-to-br from-[#7b61ff] to-[#00ccb1] hover:bg-purple-700 text-white md:w-10" // Ensure mobile shows full width
              )}
            >
              <PlusCircle className="h-5 w-5" />
              {open && "New Project"}
            </button>
            
            {/* Projects Section */}
            <div className="flex flex-col flex-1 min-h-0">
              {/* Projects Header - only show when expanded */}
              {open && (
                <h3 className="text-xs font-medium text-neutral-500 dark:text-neutral-400 px-2 mb-2">
                  PROJECTS
                </h3>
              )}
              
              {/* Projects List - scrollable with fixed height */}
              <div className="flex-1 overflow-y-auto space-y-1 pr-1 scrollbar-thin scrollbar-thumb-neutral-300 dark:scrollbar-thumb-neutral-600 scrollbar-track-transparent">
                {projectsLoading ? (
                  // Loading state
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-purple-500"></div>
                  </div>
                ) : projects.length > 0 ? (
                  // Show projects
                  projects.map((project) => (
                    <ProjectLink
                      key={project.id}
                      project={project}
                      open={open}
                    />
                  ))
                ) : (
                  // Empty state - only show when expanded
                  open && (
                    <div className="text-center py-8 px-2">
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        No projects yet
                      </p>
                      <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
                        Create your first project!
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
          
          {/* MIDDLE SECTION: Menu Items */}
          <div className="flex flex-col space-y-1 py-4 border-t border-neutral-200 dark:border-neutral-700">
            {links.map((link, idx) => (
              <SidebarLink key={idx} link={link} />
            ))}
          </div>
          
          {/* BOTTOM SECTION: User Profile */}
          <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4">
            <div className={cn(
              "flex items-center",
              open ? "justify-between px-2" : "justify-center"
            )}>
              {/* User Profile Info */}
              <div className={cn(
                "flex items-center",
                open ? "space-x-2" : "justify-center"
              )}>
                {/* User Avatar */}
                <div className="h-8 w-8 shrink-0 rounded-full overflow-hidden bg-gradient-to-br from-[#00ccb1] to-[#1ca0fb] flex items-center justify-center">
                  {user?.photoURL ? (
                    <Image
                      src={user.photoURL}
                      alt="User"
                      width={32}
                      height={32}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-white text-sm font-medium">
                      {user?.displayName?.[0]?.toUpperCase() || "U"}
                    </span>
                  )}
                </div>
                
                {/* User Info - only show when expanded */}
                {open && (
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
                      {user?.displayName || "User name"}
                    </span>
                    <span className="text-xs text-neutral-500 dark:text-neutral-400">
                      Free Plan
                    </span>
                  </div>
                )}
              </div>
              
              {/* Logout Button - only show when expanded */}
              {open && (
                <button
                  onClick={handleLogout}
                  className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4 text-neutral-700 dark:text-neutral-200" />
                </button>
              )}
            </div>
          </div>
        </SidebarBody>
      </Sidebar>
      <MainContent />
      
      {/* Community Modal */}
      <CommunityModal
        isOpen={showCommunityModal}
        onClose={() => setShowCommunityModal(false)}
      />
      
      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
      />
    </div>
  );
}

// Project Link Component - shows file icon only when expanded
const ProjectLink = ({ project, open }: { project: ProjectDocument; open: boolean }) => {
  if (!open) {
    // In collapsed mode, don't show project icons as per requirement
    return null;
  }

  return (
    <SidebarLink
      link={{
        href: `/project/${project.id}`,
        label: project.name,
        icon: (
          <FileText className="h-4 w-4 shrink-0 text-neutral-700 dark:text-neutral-200" />
        ),
      }}
      className="rounded-md px-2 py-1.5 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-sm"
    />
  );
};

const Logo = () => {
  return (
    <Link
      href="/"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black dark:text-white"
    >
       <div className="h-10 w-10 shrink-0 rounded-md flex items-center justify-center">
        <Image
          src="/logo.png"
          alt="VibeKode Logo"
          width="28"
          height="28"
          className="object-contain rounded-full"
          priority
        />
      </div>
      <div className="flex items-center gap-1.5 min-w-0">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-[#00ccb1] via-[#7b61ff] to-[#1ca0fb] whitespace-nowrap"
        >
          VibeKode
        </motion.span>
        <BetaBadge size="sm" />
      </div>
    </Link>
  );
};

const LogoIcon = () => {
  return (
    <Link
      href="/"
      className="relative z-20 flex items-center justify-center py-1 text-sm font-normal text-black dark:text-white"
    >
       <div className="h-10 w-10 shrink-0 rounded-md flex items-center justify-center">
        <Image
          src="/logo.png"
          alt="VibeKode Logo"
          width="28"
          height="28"
          className="object-contain rounded-full"
          priority
        />
      </div>
    </Link>
  );
};

// Main content component with the page content
const MainContent = () => {
  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex h-full w-full flex-1 flex-col overflow-y-auto bg-white dark:bg-neutral-900">
        <AuroraBackground>
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-5rem)] md:min-h-[calc(100vh)] relative">
            <HeroTitle />
            <PromptBox
              placeholder="Ask VibeKode to create something amazing..."
              containerClassName="flex items-center justify-center w-full max-w-[calc(100vw-1rem)] sm:max-w-[calc(100vw-2rem)] px-2 sm:px-4"
            />
            <ScrollDown text="Scroll to explore more" />
          </div>
        </AuroraBackground>

        <div id="community-showcase" className="bg-[#18181b]">
          <CommunityProject />
        </div>
      </div>
    </div>
  );
};
