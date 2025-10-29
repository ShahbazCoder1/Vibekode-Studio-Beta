"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// --- ICON & COMPONENT IMPORTS ---
import { Settings, Users, MessageCircle, CreditCard, Menu, X } from "lucide-react";
import FuturisticSidebar, { SidebarContent } from "@/components/sidebar";
import Previewer from "@/components/Previewer-web";
import BottomNav from "@/components/Bottom-nav";
import Chat from "@/components/Chat";
import ProjectModal from "@/components/ProjectModal";
import SettingsModal from "@/components/SettingsModal";
import CommunityModal from "@/components/CommunityModal";
import SignInPage from "@/components/SignInPage";

// --- FIREBASE IMPORTS ---
import {
  subscribeToAuthChanges,
  AppUser,
  logout,
  getUserProjects,
  ProjectDocument,
  updateProjectName,
  deleteProject,
} from "@/lib/firebase";

// --- TYPE DEFINITIONS ---
interface LinkType {
  label: string;
  href: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

// --- MAIN PAGE COMPONENT ---
export default function ChatPage() {
  const params = useParams();
  const projectId = params.id as string;
  const router = useRouter();

  // --- STATE MANAGEMENT ---
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<ProjectDocument[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [currentProject, setCurrentProject] = useState<ProjectDocument | null>(null);
  const [activeView, setActiveView] = useState<"chat" | "preview">("chat");
  const [hasGeneratedCode, setHasGeneratedCode] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showCommunityModal, setShowCommunityModal] = useState(false);
  const [modalState, setModalState] = useState({ isOpen: false, mode: "rename" as "rename" | "delete", isLoading: false });

  // --- DATA FETCHING & AUTH ---
  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((authUser) => {
      setUser(authUser);
      if (authUser) {
        loadUserProjects(authUser.uid);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [projectId]);

  const loadUserProjects = async (userId: string) => {
    setProjectsLoading(true);
    try {
      const userProjects = await getUserProjects(userId);
      setProjects(userProjects);
      const current = userProjects.find((p) => p.id === projectId);
      setCurrentProject(current || null);
    } catch (error) {
      console.error('Error loading user projects:', error);
      setProjects([]);
    } finally {
      setProjectsLoading(false);
    }
  };

  // --- EVENT HANDLERS ---
  const handleLogout = async () => {
    try { await logout(); router.push("/"); } 
    catch (error) { console.error("Error logging out:", error); }
  };

  const handleModalConfirm = async (newName?: string) => {
    setModalState(prev => ({ ...prev, isLoading: true }));
    try {
      if (modalState.mode === "rename" && newName && currentProject) {
        await updateProjectName(projectId, newName);
        setCurrentProject((prev) => (prev ? { ...prev, name: newName } : null));
        setProjects((prev) => 
          prev.map((p) => (p.id === projectId ? { ...p, name: newName } : p))
        );
        setModalState({ isOpen: false, mode: 'rename', isLoading: false });
      } else if (modalState.mode === "delete") {
        await deleteProject(projectId);
        router.push("/project");
      }
    } catch (error) {
      console.error(`Error ${modalState.mode}ing project:`, error);
    } finally {
      setModalState(prev => ({ ...prev, isLoading: false }));
    }
  };

  // --- SIDEBAR LINKS ---
  const links: LinkType[] = [
    { label: "Community Showcase", href: "#", icon: <Users className="h-5 w-5" />, onClick: () => { setShowCommunityModal(true); setIsMobileOpen(false); } },
    { label: "Settings", href: "#", icon: <Settings className="h-5 w-5" />, onClick: () => { setShowSettingsModal(true); setIsMobileOpen(false); } },
    { label: "Manage Subscription", href: "/pricing", icon: <CreditCard className="h-5 w-5" /> },
    { label: "Contact Us!", href: "mailto:hello.vibekode@gmail.com", icon: <MessageCircle className="h-5 w-5" /> },
  ];

  // --- RENDER LOGIC ---
  if (loading) {
    return <div className="flex items-center justify-center h-screen bg-[#18181b]"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div></div>;
  }

  if (!user) {
    return <SignInPage />;
  }

  return (
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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMobileOpen(false)} className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden" />
            <motion.div
              variants={{ hidden: { x: "-100%" }, visible: { x: "0%" } }}
              initial="hidden" animate="visible" exit="hidden"
              className="fixed left-0 top-0 z-50 h-full w-[260px] border-r border-white/10 bg-neutral-900/90 md:hidden"
            >
              <SidebarContent
                user={user} projects={projects} projectsLoading={projectsLoading}
                links={links} onLogout={handleLogout} isExpanded={true}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className={cn("transition-all duration-300 ease-in-out", isSidebarExpanded ? "md:ml-[260px]" : "md:ml-[80px]")}>
        <div className="flex h-screen overflow-hidden">
          {/* Mobile View - Only shows the active component */}
          <div className="flex flex-col h-full w-full sm:hidden">
            {/* --- FIX IS APPLIED HERE --- */}
            <div className="flex-1 overflow-y-auto pt-10 sm:pt-0">
              <div className={cn("h-full", { hidden: activeView !== "chat" })}>
                <Chat projectId={projectId} onRename={() => setModalState({ isOpen: true, mode: 'rename', isLoading: false })} onDelete={() => setModalState({ isOpen: true, mode: 'delete', isLoading: false })} onCodeGenerated={() => setHasGeneratedCode(true)} />
              </div>
              <div className={cn("h-full", { hidden: activeView !== "preview" })}>
                <Previewer projectId={projectId} hasGeneratedCode={hasGeneratedCode} />
              </div>
            </div>
            <BottomNav activeView={activeView} onViewChange={setActiveView} />
          </div>

          {/* Desktop View - Shows both components side by side */}
          <div className="hidden sm:flex w-full">
            <div className="w-[30%] border-r border-[#252529]"><Chat projectId={projectId} onRename={() => setModalState({ isOpen: true, mode: 'rename', isLoading: false })} onDelete={() => setModalState({ isOpen: true, mode: 'delete', isLoading: false })} onCodeGenerated={() => setHasGeneratedCode(true)} /></div>
            <div className="w-[70%]"><Previewer projectId={projectId} hasGeneratedCode={hasGeneratedCode} /></div>
          </div>
        </div>
      </main>

      <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="fixed left-4 top-4 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-md md:hidden" aria-label="Toggle menu">
        {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <CommunityModal isOpen={showCommunityModal} onClose={() => setShowCommunityModal(false)} />
      <ProjectModal isOpen={modalState.isOpen} onClose={() => setModalState({ ...modalState, isOpen: false })} mode={modalState.mode} projectName={currentProject?.name || ""} onConfirm={handleModalConfirm} isLoading={modalState.isLoading} />
      <SettingsModal isOpen={showSettingsModal} onClose={() => setShowSettingsModal(false)} />
    </div>
  );
}