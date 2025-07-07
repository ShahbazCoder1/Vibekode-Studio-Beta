"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { Eye, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

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

// Default sample project data (fallback)
const defaultSampleProjects: Project[] = [
  {
    id: "1",
    title: "Tic Tac Toe Game",
    image: "/community/tic-tac-toe.png",
    tags: ["Game", "JavaScript", "Mini Project"],
    usePrompt: "Make a Tic Tac Toe game. With modern design.",
    previewUrl: "https://tic-tac-toefs56.netlify.app/"
  },
  {
    id: "2",
    title: "Pixel Art Paint App",
    image: "/community/pixel-art-paint-app.png",
    tags: ["Graphics", "Canvas", "Paint"],
    usePrompt: "Build a pixel art paint app that lets users create and edit pixel-based artwork on a customizable grid canvas. Include essential tools like pencil, eraser, color picker, fill bucket, and zoom, along with options to change canvas size, undo/redo actions, and export finished artwork. Keep the interface minimal and intuitive, focusing on a retro aesthetic that complements the pixel art style.",
    previewUrl: "https://paintly-3dffb7.netlify.app/"
  },
  {
    id: "3",
    title: "To-Do List Manager",
    image: "/community/todo-list-manager.png",
    tags: ["Productivity", "Task Manager", "App"],
    usePrompt: "To-Do List Manager with categories. Use the Notion design and features.",
    previewUrl: "https://todo-c32164.netlify.app/"
  },
  {
    id: "4",
    title: "Artist Portfolio",
    image: "/community/artist-portfolio.png",
    tags: ["Portfolio", "Gallery", "Website"],
    usePrompt: "Create an elegant artist portfolio using 3D elements with image galleries, contact forms, and smooth animations.",
    previewUrl: "https://aria-cb1b91.netlify.app/"
  },
  {
    id: "5",
    title: "LMS Landing Page",
    image: "/community/lms-landing-page.png",
    tags: ["Online Courses", "Certification", "Aviation"],
    usePrompt: "Create a professional landing page for a DGCA aviation training LMS platform featuring ground courses, interactive quizzes, and comprehensive test series for pilot certification. Design a modern, trust-inspiring interface with aviation-themed visuals, clear navigation, and mobile responsiveness that appeals to aspiring pilots and aviation professionals. Include essential sections like hero banner, course catalog, student testimonials, pricing plans, and strong call-to-action buttons for enrollment. Use a professional color scheme with aviation blues and whites, high-quality imagery, and conversion-focused copy that emphasizes DGCA certification success rates and expert instruction quality.",
    previewUrl: "https://lms-landing-page-4d72e0.netlify.app/"
  },
  {
    id: "6",
    title: "Retro-Style Control Panel",
    image: "/community/retro-control-panel.png",
    tags: ["Control Panel", "Retro Style", "UI"],
    usePrompt: "Design a retro-style control panel UI for a cyclotron, featuring analog-inspired dials, toggle switches, blinking indicator lights, and segmented LED displays. Include interactive elements to adjust beam intensity, magnetic field strength, and cooling systems. Emphasize vintage aesthetics with metallic textures, labeled sections, and worn-out controls to evoke an authentic retro-futuristic feel",
    previewUrl: "https://control-panel-7903d0.netlify.app/"
  }
];


const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleUsePrompt = () => {
    if (project.usePrompt) {
      // Copy prompt to clipboard
      navigator.clipboard.writeText(project.usePrompt).then(() => {
        console.log("Prompt copied to clipboard:", project.usePrompt);
        // You can add a toast notification here
      }).catch(err => {
        console.error("Failed to copy prompt:", err);
      });
    } else {
      console.log("Use prompt for:", project.title);
    }
  };

  const handlePreviewProject = () => {
    if (project.previewUrl) {
      window.open(project.previewUrl, '_blank', 'noopener,noreferrer');
    } else {
      console.log("Preview project:", project.title);
    }
  };

  return (
    <motion.div
      className="group relative bg-zinc-900/50 backdrop-blur-sm rounded-xl overflow-hidden border border-zinc-800/100 hover:border-zinc-700/50 transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -4 }}
      layout
    >
      {/* Project Image */}
      <div className="relative h-48 sm:h-52 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#00ccb1]/20 via-[#7b61ff]/20 to-[#1ca0fb]/20" />
        
        {/* Display actual image if provided, otherwise show placeholder */}
        {project.image ? (
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            quality={100}
            priority={false}
          />
        ) : (
          <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-zinc-400 text-sm">
            Project Preview
          </div>
        )}
        
        {/* Hover Overlay with Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center gap-3"
        >
          <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: isHovered ? 1 : 0.8, 
              opacity: isHovered ? 1 : 0 
            }}
            transition={{ delay: 0.1, duration: 0.2 }}
            onClick={handleUsePrompt}
            className={cn(
              "px-4 py-2 bg-gradient-to-r from-[#00ccb1] to-[#1ca0fb]",
              "text-white font-medium text-sm rounded-lg",
              "hover:from-[#7b61ff] hover:to-[#00ccb1]",
              "transition-all duration-200 shadow-lg",
              "flex items-center gap-2"
            )}
          >
            <Copy className="w-4 h-4" />
            Use Prompt
          </motion.button>
          
          <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: isHovered ? 1 : 0.8, 
              opacity: isHovered ? 1 : 0 
            }}
            transition={{ delay: 0.15, duration: 0.2 }}
            onClick={handlePreviewProject}
            className={cn(
              "px-4 py-2 bg-white/10 backdrop-blur-sm",
              "text-white font-medium text-sm rounded-lg",
              "border border-white/20 hover:bg-white/20",
              "transition-all duration-200",
              "flex items-center gap-2"
            )}
          >
            <Eye className="w-4 h-4" />
            Preview
          </motion.button>
        </motion.div>
      </div>

      {/* Project Info */}
      <div className="p-4 sm:p-5">
        {/* Project Title */}
        <h3 className="text-white font-semibold text-lg mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#00ccb1] group-hover:to-[#1ca0fb] transition-all duration-300">
          {project.title}
        </h3>

        {/* Tags */}
        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {project.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-zinc-800/50 text-zinc-300 text-xs rounded-md border border-zinc-700/50"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

const CommunityProject: React.FC<CommunityProjectProps> = ({ className, projects = defaultSampleProjects }) => {
  return (
    <section className={cn("py-16 sm:py-20 lg:py-24", className)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4"
          >
            Community{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ccb1] via-[#7b61ff] to-[#1ca0fb]">
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
            Discover amazing projects created by the VibeKode community using our platform
          </motion.p>
        </div>

        {/* Projects Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8"
        >
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              viewport={{ once: true }}
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </motion.div>

        {/* View More Button */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <button className="px-8 py-3 bg-gradient-to-r from-[#00ccb1] to-[#1ca0fb] text-white font-medium rounded-lg hover:from-[#7b61ff] hover:to-[#00ccb1] transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
            Explore More Projects
          </button>
        </motion.div> */}
      </div>
    </section>
  );
};

export default CommunityProject;
export type { CommunityProjectProps, Project };