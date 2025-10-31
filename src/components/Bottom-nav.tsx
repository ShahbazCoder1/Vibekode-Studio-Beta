"use client";

import type { FC } from "react";
import { MessageSquare, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
// Assuming cn utility function is available and works as expected
// import { cn } from "@/lib/utils"; 

// A placeholder for cn if you don't have that utility
const cn = (...classes: (string | boolean | undefined | null)[]) => classes.filter(Boolean).join(' ');

export type NavView = "chat" | "preview";

interface BottomNavProps {
  activeView: NavView;
  onViewChange: (view: NavView) => void;
  hasGeneratedCode?: boolean;
}

type NavItem = {
  key: NavView;
  label: string;
  icon: React.ElementType;
  badge?: boolean;
};

const BottomNav: FC<BottomNavProps> = ({
  activeView,
  onViewChange,
  hasGeneratedCode = false,
}) => {
  const navItems: NavItem[] = [
    { key: "chat", label: "Chat", icon: MessageSquare },
    { key: "preview", label: "Preview", icon: Eye, badge: hasGeneratedCode },
  ];

  return (
    <div className="relative bg-gradient-to-t from-[#18181b] via-[#18181b] to-transparent p-3 backdrop-blur-xl sm:hidden border-t border-zinc-800/50 shadow-2xl">
      {/* Gradient Overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#18181b] via-[#18181b]/95 to-transparent pointer-events-none" />
      
      <div className="relative flex justify-center items-center">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }} // Smoother initial appearance
          className="flex bg-zinc-900 p-1.5 rounded-2xl shadow-2xl border border-zinc-800/50"
        >
          {navItems.map((item) => {
            const isActive = activeView === item.key;
            return (
              <motion.button
                key={item.key}
                onClick={() => onViewChange(item.key)}
                // Use a subtle scale for interaction feedback
                whileTap={{ scale: 0.98 }} 
                // Slight hover effect for inactive items
                whileHover={!isActive ? { scale: 1.02 } : {}}
                className={cn(
                  "relative flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl transition-colors duration-200 ease-in-out",
                  "font-medium text-sm min-w-[100px]",
                  isActive
                    ? "text-white"
                    : "text-gray-400 hover:text-gray-200 hover:bg-zinc-800/50"
                )}
                aria-label={`Switch to ${item.label} view`}
                aria-current={isActive ? "page" : undefined}
              >
                {/* Active Background with smooth transition */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-[#5b21b6] to-[#1e40af] rounded-xl shadow-lg"
                    // Optimized spring transition for smoothness and subtle bounce
                    transition={{
                      type: "spring",
                      stiffness: 300, 
                      damping: 25,
                      mass: 0.8,
                    }}
                  />
                )}

                {/* Icon and Label */}
                <span className="relative z-10 flex items-center gap-2">
                  <motion.div
                    // Simplified icon animation for responsiveness
                    animate={isActive ? { scale: 1.05 } : { scale: 1 }} 
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    <item.icon size={18} />
                  </motion.div>
                  <span>{item.label}</span>
                  
                  {/* Badge for new content */}
                  <AnimatePresence>
                    {item.badge && !isActive && (
                      <motion.span
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 500 }}
                        className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full shadow-lg"
                      >
                        <span className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full animate-ping opacity-75" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </span>

                {/* Glow effect on active (AnimatePresence added for smoother exit) */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 rounded-xl blur-xl opacity-50 -z-10"
                    />
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};

export default BottomNav;
