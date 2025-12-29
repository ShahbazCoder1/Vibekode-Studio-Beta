"use client";

import React, { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Copy, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import * as Tooltip from "@radix-ui/react-tooltip";
import { Toaster, toast } from "sonner";

// --- TYPESCRIPT INTERFACES ---
interface Project {
  id: string;
  title: string;
  image: string;
  tags?: string[];
  usePrompt?: string;
  previewUrl?: string;
}

interface CommunityProjectProps {
  className?: string;
  projects?: Project[];
}

// --- DEFAULT PROJECT DATA ---
const defaultSampleProjects: Project[] = [
  {
    id: "1",
    title: "Tic Tac Toe Game",
    image: "/community/tic-tac-toe.png",
    tags: ["Game", "JavaScript", "Mini Project"],
    usePrompt: "Make a Tic Tac Toe game. With modern design.",
    previewUrl: "https://tic-tac-toefs56.netlify.app/",
  },
  {
    id: "2",
    title: "Pixel Art Paint App",
    image: "/community/pixel-art-paint-app.png",
    tags: ["Graphics", "Canvas", "Paint"],
    usePrompt:
      "Build a pixel art paint app that lets users create and edit pixel-based artwork on a customizable grid canvas. Include essential tools like pencil, eraser, color picker, fill bucket, and zoom, along with options to change canvas size, undo/redo actions, and export finished artwork. Keep the interface minimal and intuitive, focusing on a retro aesthetic that complements the pixel art style.",
    previewUrl: "https://paintly-3dffb7.netlify.app/",
  },
  {
    id: "3",
    title: "To-Do List Manager",
    image: "/community/todo-list-manager.png",
    tags: ["Productivity", "Task Manager", "App"],
    usePrompt:
      "To-Do List Manager with categories. Use the Notion design and features.",
    previewUrl: "https://todo-c32164.netlify.app/",
  },
  {
    id: "4",
    title: "Artist Portfolio",
    image: "/community/artist-portfolio.png",
    tags: ["Portfolio", "Gallery", "Website"],
    usePrompt:
      "Create an elegant artist portfolio using 3D elements with image galleries, contact forms, and smooth animations.",
    previewUrl: "https://aria-cb1b91.netlify.app/",
  },
  {
    id: "5",
    title: "LMS Landing Page",
    image: "/community/lms-landing-page.png",
    tags: ["Online Courses", "Certification", "Aviation"],
    usePrompt:
      "Create a professional landing page for a DGCA aviation training LMS platform featuring ground courses, interactive quizzes, and comprehensive test series for pilot certification. Design a modern, trust-inspiring interface with aviation-themed visuals, clear navigation, and mobile responsiveness that appeals to aspiring pilots and aviation professionals. Include essential sections like hero banner, course catalog, student testimonials, pricing plans, and strong call-to-action buttons for enrollment. Use a professional color scheme with aviation blues and whites, high-quality imagery, and conversion-focused copy that emphasizes DGCA certification success rates and expert instruction quality.",
    previewUrl: "https://lms-landing-page-4d72e0.netlify.app/",
  },
  {
    id: "6",
    title: "Retro-Style Control Panel",
    image: "/community/retro-control-panel.png",
    tags: ["Control Panel", "Retro Style", "UI"],
    usePrompt:
      "Design a retro-style control panel UI for a cyclotron, featuring analog-inspired dials, toggle switches, blinking indicator lights, and segmented LED displays. Include interactive elements to adjust beam intensity, magnetic field strength, and cooling systems. Emphasize vintage aesthetics with metallic textures, labeled sections, and worn-out controls to evoke an authentic retro-futuristic feel",
    previewUrl: "https://control-panel-7903d0.netlify.app/",
  },
];

// --- HELPER COMPONENTS ---
const TooltipProvider = ({
  children,
  content,
}: {
  children: React.ReactNode;
  content: string;
}) => (
  <Tooltip.Provider delayDuration={100}>
    <Tooltip.Root>
      <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          sideOffset={5}
          className="bg-zinc-800 text-white text-xs px-2 py-1 rounded-md shadow-lg z-50"
          aria-live="polite"
        >
          {content}
          <Tooltip.Arrow className="fill-zinc-800" />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  </Tooltip.Provider>
);

// --- MAIN COMPONENTS ---

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleUsePrompt = () => {
    if (project.usePrompt) {
      navigator.clipboard
        .writeText(project.usePrompt)
        .then(() => {
          toast.success("Prompt copied to clipboard!");
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000);
        })
        .catch((err) => {
          toast.error("Failed to copy prompt.");
          console.error("Failed to copy prompt:", err);
        });
    }
  };

  return (
    // SEO: Use <article> for self-contained content
    <motion.article
      className="group relative bg-zinc-900/50 backdrop-blur-sm rounded-xl overflow-hidden border border-zinc-800 hover:border-zinc-700/80 transition-all duration-300 h-full flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -5, scale: 1.02 }}
      layout
    >
      <div className="relative h-48 sm:h-52 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#00ccb1]/10 via-[#7b61ff]/10 to-[#1ca0fb]/10" />

        {project.image ? (
          <Image
            src={project.image}
            alt={project.title} // SEO: Descriptive alt text
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            quality={100}
          />
        ) : (
          <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-zinc-400 text-sm">
            Project Preview
          </div>
        )}

        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center gap-4"
            >
              <TooltipProvider content="Copy Prompt">
                <motion.button
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    delay: 0.1,
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                  }}
                  onClick={handleUsePrompt}
                  className={cn(
                    "px-4 py-2 bg-gradient-to-r from-[#5b21b6] to-[#1e40af] text-white font-medium text-sm rounded-lg",
                    "hover:from-[#5b21b6] hover:to-[#1e40af] transition-all duration-200 shadow-lg",
                    "flex items-center gap-2"
                  )}
                  aria-label="Copy Prompt"
                >
                  {isCopied ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                  {isCopied ? "Copied!" : "Use Prompt"}
                </motion.button>
              </TooltipProvider>

              {/* SEO: Use <a> tag for navigation */}
              {project.previewUrl && (
                <TooltipProvider content="Live Preview">
                  <motion.a
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      delay: 0.15,
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                    }}
                    href={project.previewUrl}
                    target="_blank"
                    rel="noopener noreferrer" // SEO: Security best practice for new tabs
                    className={cn(
                      "px-4 py-2 bg-white/10 backdrop-blur-sm text-white font-medium text-sm rounded-lg",
                      "border border-white/20 hover:bg-white/20 transition-all duration-200",
                      "flex items-center gap-2"
                    )}
                    aria-label={`Preview ${project.title}`}
                  >
                    <Eye className="w-4 h-4" />
                    Preview
                  </motion.a>
                </TooltipProvider>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-4 sm:p-5 flex-grow flex flex-col">
        {/* SEO: Proper heading structure */}
        <h3 className="text-gray-300 font-semibold text-lg mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#7c3aed] group-hover:to-[#2563eb] transition-all duration-300">
          {project.title}
        </h3>
        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-auto pt-2">
            {project.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-zinc-800/60 text-zinc-300 text-xs rounded-full border border-zinc-700/60"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.article>
  );
};

const CommunityProject: React.FC<CommunityProjectProps> = ({
  className,
  projects: initialProjects = defaultSampleProjects,
}) => {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [isLoading, startTransition] = useTransition();

  const loadMoreProjects = () => {
    startTransition(() => {
      setTimeout(() => {
        const newProjects = defaultSampleProjects.map((p) => ({
          ...p,
          id: `${p.id}-${Math.random()}`,
        }));
        setProjects((prev) => [...prev, ...newProjects]);
      }, 1000);
    });
  };

  return (
    <>
      <Toaster position="bottom-right" richColors theme="dark" />

      <section
        className={cn("py-16 sm:py-20 lg:py-24 bg-[#09090b]", className)}
        aria-labelledby="community-showcase-title"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:py-8 max-w-7xl">
          <div className="text-center mb-12 sm:mb-16">
            {/* SEO: A clear, descriptive heading for the section */}
            <motion.h2
              id="community-showcase-title"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4"
            >
              Community{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7c3aed] to-[#2563eb]">
                Showcase
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-zinc-400 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed"
            >
              Discover amazing projects created by the VibeKode community using
              our platform
            </motion.p>
          </div>

          {/* SEO: Use <ul> for a list of items */}
          <motion.ul
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            transition={{ staggerChildren: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 list-none p-0"
          >
            {projects.map((project) => (
              // SEO: Use <li> for each list item
              <motion.li
                key={project.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="list-none"
              >
                <ProjectCard project={project} />
              </motion.li>
            ))}
          </motion.ul>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <button 
              onClick={loadMoreProjects}
              disabled={isLoading}
              className="px-8 py-3 bg-gradient-to-r from-[#5b21b6] to-[#1e40af] text-white font-medium rounded-lg hover:from-[#7b61ff] hover:to-[#00ccb1] transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
              aria-live="polite"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  <span>Loading...</span>
                </>
              ) : (
                "Explore More Projects"
              )}
            </button>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default CommunityProject;
export type { CommunityProjectProps, Project };
