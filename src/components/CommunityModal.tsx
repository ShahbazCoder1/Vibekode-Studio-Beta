"use client";

import React from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import * as Dialog from "@radix-ui/react-dialog";
import CommunityProject from "./Community-Project"; // Assuming this is the SEO-friendly version from before
import * as Tooltip from "@radix-ui/react-tooltip";

interface CommunityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// A simple tooltip provider for the close button
const TooltipProvider = ({ children, content }: { children: React.ReactNode; content: string }) => (
  <Tooltip.Provider delayDuration={100}>
    <Tooltip.Root>
      <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          side="bottom"
          sideOffset={5}
          className="bg-zinc-800 text-white text-xs px-2 py-1 rounded-md shadow-lg z-[99999]"
        >
          {content}
          <Tooltip.Arrow className="fill-zinc-800" />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  </Tooltip.Provider>
);

export default function CommunityModal({ isOpen, onClose }: CommunityModalProps) {
  return (
    // Radix Dialog.Root controls the modal's open/closed state
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <AnimatePresence>
        {isOpen && (
          // Dialog.Portal ensures the modal is rendered at the top of the DOM tree
          <Dialog.Portal forceMount>
            {/* 1. Backdrop Overlay */}
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="fixed inset-0 z-[999] bg-black/80 backdrop-blur-sm"
              />
            </Dialog.Overlay>

            {/* 2. Modal Content */}
            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 25, mass: 0.5 }}
                className="fixed inset-0 z-[1000] flex items-center justify-center"
                aria-describedby={undefined} // Prevent screen readers from reading the entire content
              >
                <div className="relative w-full max-w-7xl mx-4 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">
                  
                  {/* Header */}
                  <header className="flex items-center justify-between p-4 sm:p-6 border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-md sticky top-0 z-10 flex-shrink-0">
                    <Dialog.Title asChild>
                      <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00ccb1] via-[#7b61ff] to-[#1ca0fb]">
                      
                      </h2>
                    </Dialog.Title>
                    <TooltipProvider content="Close (Esc)">
                      <Dialog.Close asChild>
                        <button
                          className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 focus-visible:ring-[#7b61ff]"
                          aria-label="Close"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </Dialog.Close>
                    </TooltipProvider>
                  </header>

                  {/* Scrollable Content Area */}
                  <div className="overflow-y-auto flex-grow scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
                    {/* The CommunityProject component with adjusted padding */}
                    <CommunityProject className="py-8" />
                  </div>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}