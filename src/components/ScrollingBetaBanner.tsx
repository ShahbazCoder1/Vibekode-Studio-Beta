"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Zap } from 'lucide-react';
import { motion, useMotionValue, animate, AnimationPlaybackControls  } from 'framer-motion';

interface PersistentBetaBannerProps {
  /** The message to display in the banner. */
  message?: string;
  /** The number of times to repeat the message for the scrolling effect. */
  repeatCount?: number;
  /** The duration of one complete scroll cycle in seconds. */
  scrollDuration?: number;
}

const PersistentBetaBanner = ({
  message = "Currently in BETA - 100% FREE to use",
  repeatCount = 8,
  scrollDuration = 25,
}: PersistentBetaBannerProps) => {
  const textContainerRef = useRef<HTMLDivElement>(null);
  const xTranslation = useMotionValue(0);

  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY === 0) {
        setIsVisible(true);
      } else {
        if (currentScrollY > lastScrollY.current) {
          setIsVisible(false);
        }
      }

      lastScrollY.current = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animate the text infinitely using Framer Motion
 useEffect(() => {
  let animation: AnimationPlaybackControls | undefined;
  const textElement = textContainerRef.current;

  if (textElement) {
    const textWidth = textElement.scrollWidth / repeatCount;
    animation = animate(xTranslation, -textWidth, {
      ease: "linear",
      duration: scrollDuration,
      repeat: Infinity,
      repeatType: "loop",
    });
  }

  return () => {
    animation?.stop();
  };
}, [xTranslation, repeatCount, scrollDuration]);

  return (
    <motion.div
      className="sticky top-0 z-50 w-full h-9 bg-gradient-to-r from-teal-600 via-blue-600 to-purple-600 overflow-hidden"
      role="banner"
      initial={{ y: "-100%" }}
      animate={{ y: isVisible ? "0%" : "-100%" }}
      transition={{ 
        y: { 
          duration: isVisible ? 0 : 0.3, 
          ease: isVisible ? "linear" : "easeInOut" 
        } 
      }}
    >
      {/* Animated background pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>

      {/* Scrolling text container using Framer Motion */}
      <motion.div
        ref={textContainerRef}
        className="flex items-center h-full touch-pan-x"
        style={{ x: xTranslation }}
      >
        {/* Repeat the content multiple times for seamless scrolling */}
        {Array.from({ length: repeatCount }).map((_, index) => (
          <span
            key={index}
            className="flex items-center text-white font-medium text-sm mx-8"
            style={{ minWidth: 'max-content' }}
          >
            <Sparkles className="w-4 h-4 mr-2 text-yellow-300" />
            <span aria-label="Feature notification">{message}</span>
            <Zap className="w-4 h-4 ml-2 text-yellow-300" />
          </span>
        ))}
      </motion.div>

      {/* Gradient fade edges */}
      <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-teal-600 to-transparent pointer-events-none"></div>
      <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-purple-600 to-transparent pointer-events-none"></div>
    </motion.div>
  );
};

export default PersistentBetaBanner;
