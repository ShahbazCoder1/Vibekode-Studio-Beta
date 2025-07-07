"use client";
import React, { useState } from "react";
import { 
  Modal, 
  ModalTrigger, 
  ModalBody, 
  ModalContent, 
  ModalFooter,
  useModal 
} from "@/components/ui/animated-modal";
import { signInWithGoogle } from "@/lib/firebase";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface AuthModalProps {
  triggerClassName?: string;
  triggerText?: string;
  mode: 'signin' | 'signup';
}

export const AuthModal = ({ 
  triggerClassName, 
  triggerText = "Sign In",
  mode = 'signin'
}: AuthModalProps) => {
  return (
    <Modal>
      <ModalTrigger className={triggerClassName}>
        {triggerText}
      </ModalTrigger>
      <ModalBody>
        <AuthModalContent mode={mode} />
      </ModalBody>
    </Modal>
  );
};

interface AuthModalContentProps {
  mode: 'signin' | 'signup';
}

const AuthModalContent = ({ mode }: AuthModalContentProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const { setOpen } = useModal();
  const router = useRouter();

  const isSignUp = mode === 'signup';

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      await signInWithGoogle();
      setOpen(false);
      // Redirect to project page after successful authentication
      router.push('/project');
    } catch (error: unknown) {
      console.error("Authentication error:", error);
      
      // Handle specific error cases
      if (error && typeof error === 'object' && 'code' in error) {
        const firebaseError = error as { code: string };
        if (firebaseError.code === 'auth/popup-closed-by-user') {
          setError(`${isSignUp ? 'Sign-up' : 'Sign-in'} was cancelled`);
        } else if (firebaseError.code === 'auth/popup-blocked') {
          setError("Popup was blocked by browser. Please allow popups and try again.");
        } else if (firebaseError.code === 'auth/network-request-failed') {
          setError("Network error. Please check your connection and try again.");
        } else {
          setError(`Failed to ${isSignUp ? 'sign up' : 'sign in'}. Please try again.`);
        }
      } else {
        setError(`Failed to ${isSignUp ? 'sign up' : 'sign in'}. Please try again.`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ModalContent className="p-0 bg-[#18181b]">
      {/* Header */}
      <div className="px-4 sm:px-8 mt-8 pt-6 sm:pt-8 pb-4">
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
            {isSignUp ? 'Join VibeKode Studio' : 'Welcome Back to VibeKode Studio'}
          </h2>
          <p className="text-gray-400 text-sm">
            {isSignUp 
              ? 'Create your account to start building amazing projects'
              : 'Sign in to access your projects and collaborate with your team'
            }
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-8 pb-6">
        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-900/20 border border-red-800 rounded-lg">
            <p className="text-sm text-red-400 text-center">
              {error}
            </p>
          </div>
        )}

        {/* Google Sign In/Up Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className={cn(
            "w-full flex items-center justify-center gap-3 px-4 py-3",
            "bg-[#252529] border border-[#2a2a2e]",
            "rounded-lg shadow-sm hover:shadow-md transition-all duration-200",
            "text-gray-200 font-medium",
            "hover:bg-[#2a2a2e]",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#18181b]",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            isLoading && "animate-pulse"
          )}
        >
          {isLoading ? (
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-gray-600 border-t-blue-500 rounded-full animate-spin"></div>
              <span className="text-sm sm:text-base">{isSignUp ? 'Creating account...' : 'Signing in...'}</span>
            </div>
          ) : (
            <>
              <svg className="w-5 h-5" viewBox="0 0 24 24">
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
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="text-sm sm:text-base">{isSignUp ? 'Continue with Google' : 'Continue with Google'}</span>
            </>
          )}
        </button>
        
      </div>

      {/* Footer */}
      <ModalFooter className="bg-[#1c1c20]">
        <p className="text-xs text-gray-500 text-center w-full px-2">
          By {isSignUp ? 'signing up' : 'signing in'}, you agree to our{" "}
          <a href="#" className="text-blue-400 hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-blue-400 hover:underline">
            Privacy Policy
          </a>
        </p>
      </ModalFooter>
    </ModalContent>
  );
};

export default AuthModal;