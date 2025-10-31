"use client";
import React, { useState, useEffect, useRef } from "react";
import { X, AlertTriangle, Check } from "lucide-react";

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
  const [isExiting, setIsExiting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setInputValue(mode === "rename" ? projectName : "");
      setError("");
      setIsExiting(false);
      // Focus input after animation
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, mode, projectName]);

  const handleClose = () => {
    if (isLoading) return;
    setIsExiting(true);
    setTimeout(() => {
      onClose();
      setIsExiting(false);
    }, 200);
  };

  const handleSubmit = () => {
    if (mode === "rename") {
      const trimmedValue = inputValue.trim();
      if (!trimmedValue) {
        setError("Project name cannot be empty");
        inputRef.current?.focus();
        return;
      }
      if (trimmedValue.length < 2) {
        setError("Project name must be at least 2 characters");
        return;
      }
      if (trimmedValue.length > 50) {
        setError("Project name must be less than 50 characters");
        return;
      }
      if (trimmedValue === projectName) {
        handleClose();
        return;
      }
      onConfirm(trimmedValue);
    } else {
      if (inputValue !== projectName) {
        setError("Project name doesn't match. Please type the exact name.");
        inputRef.current?.focus();
        return;
      }
      onConfirm();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape" && !isLoading) {
      handleClose();
    } else if (e.key === "Enter" && canSubmit && !isLoading) {
      handleSubmit();
    }
  };

  const isDeleteConfirmed = mode === "delete" && inputValue === projectName;
  const canSubmit = mode === "rename" 
    ? inputValue.trim() && inputValue.trim() !== projectName
    : isDeleteConfirmed;

  if (!isOpen) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-200 ${
        isExiting ? "opacity-0" : "opacity-100"
      }`}
      onKeyDown={handleKeyDown}
    >
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-all duration-200 ${
          isExiting ? "opacity-0" : "opacity-100"
        }`}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div 
        className={`relative w-full max-w-md bg-[#18181b] border border-[#252529] rounded-xl shadow-2xl transition-all duration-200 ${
          isExiting ? "scale-95 opacity-0" : "scale-100 opacity-100"
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#252529]">
          <h2 
            id="modal-title"
            className="text-lg font-semibold text-white"
          >
            {mode === "rename" ? "Rename Project" : "Delete Project"}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-150 disabled:opacity-50"
            disabled={isLoading}
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {mode === "delete" && (
            <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg animate-in fade-in slide-in-from-top-2 duration-300">
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm space-y-1">
                <p className="text-red-400 font-semibold">Warning: Permanent Action</p>
                <p className="text-gray-300 leading-relaxed">
                  This will permanently delete <span className="font-medium text-white">{projectName}</span> and all associated chat history. This action cannot be undone.
                </p>
              </div>
            </div>
          )}

          <div>
            <label 
              htmlFor="project-input"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              {mode === "rename" 
                ? "New Project Name" 
                : `Type "${projectName}" to confirm`
              }
            </label>
            <div className="relative">
              <input
                id="project-input"
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  setError("");
                }}
                onKeyDown={handleKeyDown}
                placeholder={mode === "rename" ? "Enter new name" : projectName}
                className={`w-full px-4 py-2.5 bg-[#252529] border rounded-lg text-white placeholder-gray-500 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#18181b] disabled:opacity-50 disabled:cursor-not-allowed ${
                  error 
                    ? "border-red-500 focus:ring-red-500/50" 
                    : isDeleteConfirmed
                    ? "border-green-500/50 focus:ring-green-500/50"
                    : "border-[#3a3a3e] focus:ring-blue-500/50"
                }`}
                disabled={isLoading}
                autoComplete="off"
                spellCheck="false"
              />
              {isDeleteConfirmed && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 animate-in fade-in zoom-in duration-200">
                  <Check className="w-5 h-5 text-green-500" />
                </div>
              )}
            </div>
            
            {/* Character count for rename */}
            {mode === "rename" && inputValue && (
              <p className={`mt-1.5 text-xs transition-colors duration-150 ${
                inputValue.length > 50 ? "text-red-400" : "text-gray-500"
              }`}>
                {inputValue.length}/50 characters
              </p>
            )}
            
            {error && (
              <p className="mt-2 text-sm text-red-400 animate-in fade-in slide-in-from-top-1 duration-200 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                {error}
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 bg-[#252529]/30 border-t border-[#252529] rounded-b-xl">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg font-medium transition-all duration-150 disabled:opacity-50"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading || !canSubmit}
            className={`px-5 py-2 rounded-lg font-medium transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 ${
              mode === "rename"
                ? "bg-gradient-to-r from-[#5b21b6] to-[#1e40af] text-white hover:shadow-lg hover:shadow-purple-500/20 hover:scale-[1.02] active:scale-[0.98]"
                : "bg-red-600 text-white hover:bg-red-700 hover:shadow-lg hover:shadow-red-500/20 hover:scale-[1.02] active:scale-[0.98]"
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{mode === "rename" ? "Renaming..." : "Deleting..."}</span>
              </>
            ) : (
              <span>{mode === "rename" ? "Rename Project" : "Delete Project"}</span>
            )}
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-in-from-top-1 {
          from { transform: translateY(-0.25rem); }
          to { transform: translateY(0); }
        }
        @keyframes slide-in-from-top-2 {
          from { transform: translateY(-0.5rem); }
          to { transform: translateY(0); }
        }
        @keyframes zoom-in {
          from { transform: scale(0.95); }
          to { transform: scale(1); }
        }
        .animate-in {
          animation-fill-mode: both;
        }
        .fade-in {
          animation-name: fade-in;
        }
        .slide-in-from-top-1 {
          animation-name: slide-in-from-top-1;
        }
        .slide-in-from-top-2 {
          animation-name: slide-in-from-top-2;
        }
        .zoom-in {
          animation-name: zoom-in;
        }
      `}</style>
    </div>
  );
}