"use client";

import type { FC } from "react";
import { MessageSquare, Eye } from "lucide-react";
import clsx from "clsx";

// Define the types for the component's props
export type NavView = "chat" | "preview";

interface BottomNavProps {
  activeView: NavView;
  onViewChange: (view: NavView) => void;
}

// Define the configuration for the navigation items
type NavItem = {
  key: NavView;
  label: string;
  icon: React.ElementType;
};

const navItems: NavItem[] = [
  { key: "chat", label: "Chat", icon: MessageSquare },
  { key: "preview", label: "Preview", icon: Eye },
];

/**
 * A bottom navigation component for switching between Chat and Preview views.
 * This component is only visible on mobile screens.
 */
const BottomNav: FC<BottomNavProps> = ({ activeView, onViewChange }) => {
  return (
    // The container is fixed to the bottom, with reduced padding for a more compact feel.
    <div className="bg-[#18181b]/80 p-2 backdrop-blur-sm sm:hidden border-t border-[#252529]">
      <div className="flex justify-center items-center">
        {/* The inner container follows the pill-shaped, expressive design */}
        <div className="flex bg-[#252529] p-1 rounded-full">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => onViewChange(item.key)}
              className={clsx(
                // Reduced padding and gap for a sleeker button design
                "flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-full transition-all duration-300 ease-in-out",
                activeView === item.key
                  ? "bg-gradient-to-r from-[#7b61ff] to-[#00ccb1] text-white"
                  : "text-gray-300 hover:bg-[#3a3a3e]"
              )}
              aria-label={`Switch to ${item.label} view`}
            >
              {/* Slightly smaller icon to match the new button size */}
              <item.icon size={16} />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BottomNav;