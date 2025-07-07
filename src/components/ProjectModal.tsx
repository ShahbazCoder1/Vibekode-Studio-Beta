"use client";

import React, { useState, useEffect } from "react";
import { X, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "rename" | "delete";
  projectName: string;
  onConfirm: (newName?: string) => void;
  isLoading?: boolean;
}

export default function ProjectModal({
  isOpen,
  onClose,
  mode,
  projectName,
  onConfirm,
  isLoading = false,
}: ProjectModalProps) {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setInputValue(mode === "rename" ? projectName : "");
      setError("");
    }
  }, [isOpen, mode, projectName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === "rename") {
      const trimmedValue = inputValue.trim();
      if (!trimmedValue) {
        setError("Project name cannot be empty");
        return;
      }
      if (trimmedValue === projectName) {
        onClose();
        return;
      }
      onConfirm(trimmedValue);
    } else {
      // Delete mode - check if user typed the project name correctly
      if (inputValue !== projectName) {
        setError("Project name doesn't match. Please type the exact project name to confirm deletion.");
        return;
      }
      onConfirm();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md bg-[#18181b] border border-[#252529] rounded-lg shadow-xl">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[#252529]">
            <h2 className="text-lg font-semibold text-white">
              {mode === "rename" ? "Rename Project" : "Delete Project"}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-white rounded-md transition-colors"
              disabled={isLoading}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {mode === "delete" && (
              <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="text-red-400 font-medium mb-1">Warning</p>
                  <p className="text-gray-300">
                    This action cannot be undone. This will permanently delete the project 
                    and all associated chat history.
                  </p>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {mode === "rename" 
                  ? "Project Name" 
                  : `Type "${projectName}" to confirm deletion`
                }
              </label>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  setError("");
                }}
                onKeyDown={handleKeyDown}
                placeholder={mode === "rename" ? "Enter project name" : projectName}
                className={cn(
                  "w-full px-3 py-2 bg-[#252529] border rounded-md text-white placeholder-gray-400",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                  error ? "border-red-500" : "border-[#3a3a3e]"
                )}
                disabled={isLoading}
                autoFocus
              />
              {error && (
                <p className="mt-1 text-sm text-red-400">{error}</p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-[#252529]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className={cn(
                "px-4 py-2 rounded-md font-medium transition-colors",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                mode === "rename"
                  ? "bg-gradient-to-r from-[#00ccb1] to-[#1ca0fb] text-white hover:opacity-90"
                  : "bg-red-600 text-white hover:bg-red-700"
              )}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {mode === "rename" ? "Renaming..." : "Deleting..."}
                </div>
              ) : (
                mode === "rename" ? "Rename" : "Delete"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
