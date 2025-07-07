"use client";
import { cn } from "@/lib/utils";
import React, { useState, createContext, useContext, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import Image from "next/image";

interface Links {
  label: string;
  href: string;
  icon: React.JSX.Element | React.ReactNode;
  onClick?: () => void;
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
  isMobile: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined
);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  const [openState, setOpenState] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };

    // Check for mobile on initial render
    if (typeof window !== 'undefined') {
      checkIsMobile();
    }

    // Add event listener for window resize
    window.addEventListener("resize", checkIsMobile);

    // Clean up
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  // Use the provided open state or fallback to internal state
  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider
      value={{ open, setOpen, animate: animate, isMobile }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...(props as React.ComponentProps<"div">)} />
    </>
  );
};

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen, animate, isMobile } = useSidebar();

  // Don't render desktop sidebar if on mobile
  if (isMobile) return null;

  return (
    <>
      <motion.div
        className={cn(
          "h-full px-4 py-4 hidden md:flex md:flex-col w-[280px] shrink-0 border-r ",
          className
        )}
        style={{ backgroundColor: '#18181b' }}
        animate={{
          width: animate ? (open ? "280px" : "80px") : "280px",
        }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        {...props}
      >
        {children}
      </motion.div>
    </>
  );
};

export const MobileSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  const { open, setOpen, isMobile } = useSidebar();

  if (!isMobile) return null;

  return (
    <>
      {/* Mobile Header */}
      <div
        className={cn(
          "fixed top-0 left-0 z-50 h-16 px-4 py-4 flex flex-row items-center justify-between w-full border-b border-neutral-200 dark:border-neutral-700"
        )}
        style={{ backgroundColor: '#18181b' }}
        {...props}
      >
        {/* Logo */}
        <div className="flex items-center">
           {/* Menu Button */}
        <button
          onClick={() => setOpen(!open)}
          className="p-2 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
        >
          <Menu className="h-6 w-6 text-neutral-800 dark:text-neutral-200" />
        </button>
          <a href="#" className="flex items-center">
            <div className="h-10 w-10 shrink-0 rounded-md flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="VibeKode Logo"
                width="28"
                height="28"
                className="object-contain rounded-full"
                priority
              />
            </div>
            <span className="ml-2 font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-[#00ccb1] via-[#7b61ff] to-[#1ca0fb]">
              VibeKode
            </span>
          </a>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
            className={cn(
              "fixed h-full w-[85%] max-w-[300px] inset-0 p-6 z-[100] flex flex-col border-r border-neutral-200 dark:border-neutral-700",
              className
            )}
            style={{ backgroundColor: '#18181b' }}
          >
            {/* Mobile Sidebar Header */}
            <div className="flex justify-between items-center mb-6">
              <a href="#" className="flex items-center">
                <div className="h-10 w-10 shrink-0 rounded-md flex items-center justify-center">
                  <Image
                    src="/logo.png"
                    alt="VibeKode Logo"
                    width={isMobile ? 28 : 50}
                    height={isMobile ? 28 : 50}
                    className="object-contain rounded-full"
                    priority
                  />
                </div>
                <span className="ml-2 font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-[#00ccb1] via-[#7b61ff] to-[#1ca0fb]">
                  VibeKode
                </span>
              </a>
              <button
                className="p-2 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                onClick={() => setOpen(false)}
              >
                <X className="h-6 w-6 text-neutral-800 dark:text-neutral-200" />
              </button>
            </div>

            {/* Mobile Sidebar Content */}
            <div className="flex-1 overflow-y-auto scrollbar-thin">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black z-[90]"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Extra space to push content down when mobile sidebar header is present */}
      <div className="h-16 md:hidden" />
    </>
  );
};

export const SidebarLink = ({
  link,
  className,
  ...props
}: {
  link: Links;
  className?: string;
}) => {
  const { open, animate, isMobile } = useSidebar();

  // On mobile, always show icons and labels
  const showLabel = isMobile || (animate ? open : true);

  const handleClick = (e: React.MouseEvent) => {
    if (link.onClick) {
      e.preventDefault();
      link.onClick();
    }
  };

  return (
    <a
      href={link.href}
      onClick={handleClick}
      className={cn(
        "flex items-center gap-2 group/sidebar py-2 px-2 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors",
        !open && !isMobile && "justify-center",
        className
      )}
      {...props}
    >
      {link.icon}

      {showLabel && (
        <span className="text-neutral-700 dark:text-neutral-200 text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0">
          {link.label}
        </span>
      )}
    </a>
  );
};
