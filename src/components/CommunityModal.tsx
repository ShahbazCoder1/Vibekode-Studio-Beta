"use client";

import React from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CommunityProject from "./Community-Project";

interface CommunityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommunityModal({ isOpen, onClose }: CommunityModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-7xl mx-4 bg-[#18181b] border border-[#252529] rounded-xl shadow-2xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[#252529] bg-[#18181b] sticky top-0 z-10">
            <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00ccb1] via-[#7b61ff] to-[#1ca0fb]">
              Community Showcase
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-[#252529] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-80px)] scrollbar-thin scrollbar-thumb-neutral-600 scrollbar-track-transparent">
            <CommunityProject className="py-8" />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
