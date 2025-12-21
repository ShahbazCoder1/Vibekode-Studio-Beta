"use client";

import React, { useState } from "react";
import { 
  X, 
  Copy, 
  Check, 
  ExternalLink, 
  Code2, 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// --- TYPES & DATA ---

interface Project {
  id: string;
  title: string;
  image: string;
  tags: string[];
  usePrompt: string;
  previewUrl?: string;
}

const SAMPLE_PROJECTS: Project[] = [
  {
    id: "1",
    title: "Neon Tic Tac Toe",
    image: "/community/tic-tac-toe.png",
    tags: ["Game", "React", "Neon UI"],
    usePrompt: "Create a Tic Tac Toe game with a cyberpunk neon aesthetic. Use glowing borders, sound effects on click, and a score tracker.",
    previewUrl: "https://tic-tac-toefs56.netlify.app/",
  },
  {
    id: "2",
    title: "Pixel Art Studio",
    image: "/community/pixel-art-paint-app.png",
    tags: ["Graphics", "Canvas", "Retro"],
    usePrompt: "Build a pixel art editor. Features: customizable grid size, color palette picker, export to PNG, and local storage saving.",
    previewUrl: "https://paintly-3dffb7.netlify.app/",
  },
  {
    id: "3",
    title: "Zen To-Do Manager",
    image: "/community/todo-list-manager.png",
    tags: ["Productivity", "Minimalist"],
    usePrompt: "A minimalist To-Do list inspired by Notion. Drag and drop ordering, dark mode, and categorized project folders.",
    previewUrl: "https://todo-c32164.netlify.app/",
  },
  {
    id: "4",
    title: "3D Artist Portfolio",
    image: "/community/artist-portfolio.png",
    tags: ["Portfolio", "Three.js", "Animation"],
    usePrompt: "Create a high-end artist portfolio featuring a 3D interactive hero section, floating geometry, and smooth scroll parallax effects.",
    previewUrl: "https://aria-cb1b91.netlify.app/",
  },
  {
    id: "5",
    title: "Aviation LMS Platform",
    image: "/community/lms-landing-page.png",
    tags: ["Education", "Landing Page", "SaaS"],
    usePrompt: "Design a professional landing page for an Aviation Learning Management System. Blue and white color scheme, trust badges, and course cards.",
    previewUrl: "https://lms-landing-page-4d72e0.netlify.app/",
  },
  {
    id: "6",
    title: "Retro Control Panel",
    image: "/community/retro-control-panel.png",
    tags: ["UI Experiment", "Skeuomorphism"],
    usePrompt: "Design a retro sci-fi control panel with analog switches, VU meters, and blinking LED indicators using pure CSS and JS.",
    previewUrl: "https://control-panel-7903d0.netlify.app/",
  },
];

// --- SUB-COMPONENTS ---

const ProjectCard = ({ project }: { project: Project }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(project.usePrompt);
    setIsCopied(true);
    toast.success("Prompt copied to clipboard");
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="group relative flex flex-col h-full bg-zinc-900/40 border border-zinc-800/60 hover:border-[#5b21b6]/50 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-[#5b21b6]/10"
    >
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden bg-zinc-900">
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent z-10 opacity-60" />
        
        {project.image ? (
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-zinc-800 text-zinc-500">
            <Code2 className="w-10 h-10 opacity-20" />
          </div>
        )}

        {/* Floating Actions on Hover */}
        <div className="absolute top-3 right-3 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 translate-y-2 group-hover:translate-y-0">
          {project.previewUrl && (
            <a
              href={project.previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-zinc-950/80 backdrop-blur text-zinc-300 hover:text-white rounded-lg border border-zinc-700 hover:border-zinc-500 transition-colors"
              title="View Live"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-grow relative z-20">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-zinc-100 text-lg line-clamp-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#5b21b6] group-hover:to-[#1e40af] transition-all">
            {project.title}
          </h3>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.slice(0, 3).map((tag) => (
            <span 
              key={tag} 
              className="px-2 py-0.5 text-[10px] uppercase tracking-wider font-medium text-zinc-400 bg-zinc-800/50 rounded-md border border-zinc-800"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-4 border-t border-zinc-800/50">
          <button
            onClick={handleCopy}
            className={cn(
              "w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300",
              isCopied 
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                : "bg-zinc-800 text-zinc-300 hover:text-white hover:bg-gradient-to-r hover:from-[#5b21b6] hover:to-[#1e40af] shadow-md hover:shadow-[#5b21b6]/20"
            )}
          >
            {isCopied ? (
              <>
                <Check className="w-4 h-4" /> Copied Code
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" /> Copy Prompt
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// --- MAIN MODAL COMPONENT ---

interface CommunityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommunityModal({ isOpen, onClose }: CommunityModalProps) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <AnimatePresence>
        {isOpen && (
          <Dialog.Portal forceMount>
            {/* Backdrop */}
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm"
              />
            </Dialog.Overlay>

            {/* Modal Content */}
            <Dialog.Content asChild>
              <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6 pointer-events-none">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                  className="pointer-events-auto w-full max-w-6xl bg-[#09090b] border border-zinc-800 rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden relative"
                >
                  {/* Header */}
                  <div className="flex flex-row items-center justify-between p-6 sm:p-8 border-b border-zinc-800 bg-[#09090b]/95 backdrop-blur-md z-20 shrink-0">
                    <div>
                      <Dialog.Title className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
            
                        Community Showcase
                       
                      </Dialog.Title>
                      <Dialog.Description className="text-zinc-400 mt-1 max-w-lg text-sm sm:text-base">
                        Explore projects created by the Vibe Coding community.
                      </Dialog.Description>
                    </div>
                    
                    <button
                      onClick={onClose}
                      className="group p-2 rounded-full bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 transition-all active:scale-95"
                      aria-label="Close Modal"
                    >
                      <X className="w-5 h-5 text-zinc-400 group-hover:text-white" />
                    </button>
                  </div>

                  {/* Scrollable Content Area */}
                  {/* data-lenis-prevent="true" prevents parent Lenis scroll from hijacking this container */}
                  <div 
                    className="flex-grow overflow-y-auto p-6 sm:p-8 custom-scrollbar bg-zinc-950/50"
                    data-lenis-prevent="true"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {SAMPLE_PROJECTS.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                      ))}
                    </div>
                    
                    {/* Bottom Decorative Footer */}
                    {/* <div className="mt-12 text-center pb-4 flex flex-col items-center justify-center text-zinc-500 text-sm gap-2">
                      <Sparkles className="w-4 h-4 opacity-50" />
                      <p>
                        Built with Vibe Coding
                      </p>
                    </div> */}
                  </div>
                </motion.div>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}