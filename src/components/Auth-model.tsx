"use client";

import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  useRef,
  useCallback,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { signInWithGoogle, auth } from "@/lib/firebase"; // Import auth
import { onAuthStateChanged } from "firebase/auth"; // Import onAuthStateChanged
import { X } from "lucide-react";

// --- Custom Modal components ---

interface CustomModalContextType {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const CustomModalContext = createContext<CustomModalContextType | undefined>(
  undefined
);

const useModal = () => {
  const context = useContext(CustomModalContext);
  if (!context) {
    throw new Error("useModal must be used within a CustomModalProvider");
  }
  return context;
};

const CustomModal = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const openModal = useCallback(() => {
    setOpen(true);
    document.body.style.overflow = "hidden";
  }, []);

  const closeModal = useCallback(() => {
    setOpen(false);
    document.body.style.overflow = "unset";
  }, []);

  // Handle escape key to close the modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [closeModal]);

  const value = { isOpen, openModal, closeModal };

  if (!isMounted) {
    return null;
  }

  const [trigger, body] = React.Children.toArray(children);

  return (
    <CustomModalContext.Provider value={value}>
      {trigger}
      {isOpen &&
        createPortal(
          <ModalContent onClose={closeModal}>{body}</ModalContent>,
          document.body
        )}
    </CustomModalContext.Provider>
  );
};

const ModalContent = ({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal on outside click
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={handleOverlayClick}
    >
      <div
        ref={modalRef}
        className="relative z-10 w-full max-w-lg animate-scaleIn"
      >
        {children}
      </div>
    </div>
  );
};

const CustomModalTrigger = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const { openModal } = useModal();
  return (
    <button className={className} onClick={openModal}>
      {children}
    </button>
  );
};

const CustomModalBody = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

// --- Original component structure with custom modal implementation ---

interface AuthModalProps {
  triggerClassName?: string;
  triggerText?: string;
  mode: "signin" | "signup";
}

export const AuthModal = ({
  triggerClassName,
  triggerText = "Sign In",
  mode = "signin",
}: AuthModalProps) => {
  return (
    <CustomModal>
      <CustomModalTrigger className={triggerClassName}>
        {triggerText}
      </CustomModalTrigger>
      <CustomModalBody>
        <AuthModalContent mode={mode} />
      </CustomModalBody>
    </CustomModal>
  );
};

interface AuthModalContentProps {
  mode: "signin" | "signup";
}

const AuthModalContent = ({ mode }: AuthModalContentProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [isHovered, setIsHovered] = useState(false);
  const { closeModal } = useModal();
  const router = useRouter();

  const isSignUp = mode === "signup";

  // --- ADDED LOGIC ---
  // Check auth state when the modal opens. If the user is already logged in,
  // close the modal and redirect them to the project page.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, so we can redirect.
        closeModal();
        router.push("/project");
      }
      // If user is not signed in, the modal remains open for them to log in.
    });

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, [router, closeModal]);
  // --- END OF ADDED LOGIC ---


  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError("");

    try {
      await signInWithGoogle();
      closeModal();
      router.push("/project");
    } catch (error: unknown) {
      console.error("Authentication error:", error);
      const firebaseError = error as { code?: string };
      switch (firebaseError.code) {
        case "auth/popup-closed-by-user":
          setError(`${isSignUp ? "Sign-up" : "Sign-in"} was cancelled.`);
          break;
        case "auth/popup-blocked":
          setError(
            "Popup was blocked. Please allow popups and try again."
          );
          break;
        case "auth/network-request-failed":
          setError("Network error. Please check your connection.");
          break;
        default:
          setError(
            `Failed to ${isSignUp ? "sign up" : "sign in"}. Please try again.`
          );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-2xl bg-[#18181b] overflow-hidden w-full shadow-2xl border border-white/5">
      <button
        onClick={closeModal}
        className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200 group"
        aria-label="Close modal"
      >
        <X className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
      </button>

      <div className="relative px-6 sm:px-8 pt-10 pb-6">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 tracking-tight">
            {isSignUp ? "Join VibeKode Studio" : "Welcome Back"}
          </h2>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            {isSignUp
              ? "Create your account to start building amazing projects"
              : "Sign in to access your projects and collaborate"}
          </p>
        </div>
      </div>

      <div className="px-6 sm:px-8 pb-8">
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-800/50 rounded-xl animate-slideDown">
            <p className="text-sm text-red-300 text-center font-medium">
              {error}
            </p>
          </div>
        )}

        <button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={cn(
            "relative w-full flex items-center justify-center gap-3 px-6 py-4",
            "bg-white text-gray-900",
            "rounded-xl shadow-lg hover:shadow-xl transition-all duration-300",
            "font-semibold text-base",
            "transform hover:scale-[1.02] active:scale-[0.98]",
            "focus:outline-none focus:ring-4 focus:ring-blue-500/50",
            "disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none",
            "overflow-hidden"
          )}
        >
          <div
            className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700"
            style={{
              transform:
                isHovered && !isLoading
                  ? "translateX(100%)"
                  : "translateX(-100%)",
            }}
          />

          {isLoading ? (
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
              <span>
                {isSignUp ? "Creating account..." : "Signing in..."}
              </span>
            </div>
          ) : (
            <>
              <svg
                className="w-6 h-6"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.64-2.84h-.01z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Continue with Google</span>
            </>
          )}
        </button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-4 bg-[#18181b] text-gray-500 font-medium">
              Secure authentication
            </span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-gray-500 text-xs">
          <svg
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
              clipRule="evenodd"
            />
          </svg>
          <span>Your data is encrypted and secure</span>
        </div>
      </div>

      <div className="bg-[#1c1c20] px-6 py-5 border-t border-white/5">
        <p className="text-xs text-gray-500 text-center leading-relaxed">
          By {isSignUp ? "signing up" : "signing in"}, you agree to our{" "}
          <a
            href="/legal/terms"
            className="text-blue-400 hover:text-blue-300 hover:underline transition-colors"
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="/legal/privacy"
            className="text-blue-400 hover:text-blue-300 hover:underline transition-colors"
          >
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
};