"use client";

import React, { useState } from "react";
import {
  LogOut,
  PlusCircle,
  FileText,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { AppUser, ProjectDocument } from "@/lib/firebase";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import BetaBadge from "@/components/Beta-badge";

// --- TYPE DEFINITIONS ---
interface LinkType {
  label: string;
  href: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

interface SidebarContentProps {
  user: AppUser | null;
  projects: ProjectDocument[];
  projectsLoading: boolean;
  links: LinkType[];
  onLogout: () => void;
  isExpanded: boolean;
}

interface SidebarProps extends SidebarContentProps {
  setIsExpanded: (isExpanded: boolean) => void;
}


// --- ANIMATION VARIANTS ---
const sidebarVariants = {
  collapsed: { width: '80px', transition: { type: "spring", stiffness: 400, damping: 40 } },
  expanded: { width: '260px', transition: { type: "spring", stiffness: 400, damping: 40 } },
};

const contentVariants = {
  collapsed: { opacity: 0, x: -10, transition: { duration: 0.2 } },
  expanded: { opacity: 1, x: 0, transition: { duration: 0.2, delay: 0.15 } },
};


// --- HELPER COMPONENTS ---
// (Tooltip, SidebarItem, and Logo remain unchanged)
const Tooltip = ({ children, label }: { children: React.ReactNode; label: string }) => {
  const [isVisible, setIsVisible] = useState(false);
  return (
    <div
      className="relative flex items-center justify-center"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className="absolute left-full top-1/2 z-50 ml-3 -translate-y-1/2 whitespace-nowrap rounded-md bg-black/80 px-2.5 py-1.5 text-xs font-medium text-white shadow-lg backdrop-blur-sm"
          >
            {label}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SidebarItem = ({ link, isExpanded }: { link: LinkType; isExpanded: boolean }) => {
  const router = useRouter();
  const pathname = usePathname();
  const isActive = pathname === link.href;

  const handleClick = (e: React.MouseEvent) => {
    if (link.onClick) {
      e.preventDefault();
      link.onClick();
    } else if (link.href !== '#') {
      router.push(link.href);
    }
  };

  const itemContent = (
    <motion.div
      className={cn(
        'relative flex h-10 cursor-pointer items-center gap-3.5 rounded-lg px-3 text-neutral-300 transition-colors duration-200',
        'hover:bg-white/10 hover:text-white',
        isActive && 'bg-white/10 text-white'
      )}
      whileTap={{ scale: 0.97 }}
    >
      {isActive && (
        <motion.div
          layoutId="active-glow"
          className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#7b61ff]/30 to-[#00ccb1]/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}
      <div className="flex-shrink-0">{link.icon}</div>
      <AnimatePresence>
        {isExpanded && (
          <motion.span
            variants={contentVariants}
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            className="whitespace-nowrap text-sm font-medium"
          >
            {link.label}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );

  return (
    <div onClick={handleClick}>
      {isExpanded ? itemContent : <Tooltip label={link.label}>{itemContent}</Tooltip>}
    </div>
  );
};

const Logo = ({ isExpanded }: { isExpanded: boolean }) => (
  <Link href="/project" className="flex items-center gap-2 overflow-hidden text-white">
    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md">
      <Image src="/logo.png" alt="VibeKode Logo" width="28" height="28" className="rounded-full object-contain" priority />
    </div>
    <AnimatePresence>
      {isExpanded && (
        <motion.div variants={contentVariants} initial="collapsed" animate="expanded" exit="collapsed" className="flex items-center gap-1.5">
          <span className="bg-gradient-to-r from-[#00ccb1] via-[#7b61ff] to-[#1ca0fb] bg-clip-text text-lg font-bold text-transparent">
            VibeKode
          </span>
          <BetaBadge />
        </motion.div>
      )}
    </AnimatePresence>
  </Link>
);


// --- NEW REUSABLE SIDEBAR CONTENT COMPONENT ---
export function SidebarContent({ user, projects, projectsLoading, links, onLogout, isExpanded }: SidebarContentProps) {
  const router = useRouter();
  return (
    <div className="flex h-full flex-col justify-between p-3">
      <div className="flex flex-1 flex-col gap-4 overflow-hidden">
        <div className={cn("flex items-center", isExpanded ? "justify-start" : "justify-center")}>
          <Logo isExpanded={isExpanded} />
        </div>
        <motion.button
          onClick={() => router.push('/project')}
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          className={cn('flex h-10 items-center gap-3.5 whitespace-nowrap rounded-lg px-3 text-sm font-medium text-white transition-all', 'bg-gradient-to-r from-[#5b21b6] to-[#1e40af] hover:from-[#5b21b6] hover:to-[#1e40af] shadow-[0_0_20px_rgba(123,97,255,0.4)]', !isExpanded && 'w-12 justify-center')}
        >
          <PlusCircle className="h-5 w-5 flex-shrink-0" />
          <AnimatePresence>{isExpanded && <motion.span variants={contentVariants}>New Project</motion.span>}</AnimatePresence>
        </motion.button>
        <div className={cn("flex flex-1 flex-col", isExpanded && "overflow-y-auto pr-1.5 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent")} onWheel={(e) => e.stopPropagation()}>
          <AnimatePresence>
            {isExpanded && (<motion.h3 variants={contentVariants} className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">Projects</motion.h3>)}
          </AnimatePresence>
          {isExpanded && (
            <>
              {projectsLoading ? (
                <div className="flex justify-center p-8"><div className="h-6 w-6 animate-spin rounded-full border-b-2 border-t-2 border-purple-500"></div></div>
              ) : projects.length > 0 ? (
                projects.map((project) => (<SidebarItem key={project.id} isExpanded={isExpanded} link={{ href: `/project/${project.id}`, label: project.name, icon: <FileText className="h-4 w-4" /> }} />))
              ) : (
                <AnimatePresence><motion.div variants={contentVariants} className="px-2 text-center text-xs text-neutral-500">No projects yet.</motion.div></AnimatePresence>
              )}
            </>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="border-t border-white/10 pt-2">{links.map((link, idx) => (<SidebarItem key={idx} isExpanded={isExpanded} link={link} />))}</div>
        <div className="border-t border-white/10 pt-3">
          <div className="flex items-center justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-9 w-9 flex-shrink-0 items-center ml-2.5 justify-center rounded-full bg-gradient-to-br from-[#00ccb1] to-[#1ca0fb]">
                {user?.photoURL ? (<Image src={user.photoURL} alt="User" width={36} height={36} className="h-full w-full rounded-full object-cover" />) : (<span className="text-sm font-medium text-white">{user?.displayName?.[0]?.toUpperCase() || 'U'}</span>)}
              </div>
              <AnimatePresence>{isExpanded && (<motion.div variants={contentVariants} className="min-w-0"><p className="truncate text-sm font-medium text-white">{user?.displayName || 'User'}</p><p className="text-xs text-neutral-400">Free Plan</p></motion.div>)}</AnimatePresence>
            </div>
            <AnimatePresence>
              {isExpanded && (
                <motion.div variants={contentVariants}>
                  <Tooltip label="Logout"><button onClick={onLogout} className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-white/10 hover:text-white"><LogOut className="h-4 w-4" /></button></Tooltip>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}


// --- MAIN DESKTOP SIDEBAR COMPONENT ---
export default function FuturisticSidebar({ user, projects, projectsLoading, links, onLogout, isExpanded, setIsExpanded }: SidebarProps) {
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (hoverTimeout) clearTimeout(hoverTimeout);
    setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => setIsExpanded(false), 200);
    setHoverTimeout(timeout);
  };

  return (
    <motion.div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      variants={sidebarVariants}
      animate={isExpanded ? 'expanded' : 'collapsed'}
      className="fixed top-0 left-0 z-50 hidden h-full border-r border-white/10 bg-black/30 backdrop-blur-lg md:block"
    >
      <SidebarContent {...{ user, projects, projectsLoading, links, onLogout, isExpanded }} />
    </motion.div>
  );
}