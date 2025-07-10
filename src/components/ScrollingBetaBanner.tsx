"use client";

import React, { useState, useEffect } from 'react';
import { Sparkles, Zap } from 'lucide-react';

const ScrollingBetaBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 10;
      setIsVisible(!scrolled);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`relative w-full h-9 bg-gradient-to-r from-teal-600 via-blue-600 to-purple-600 overflow-hidden transition-all duration-300 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'
    }`}>
      {/* Animated background pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
      
      {/* Scrolling text container */}
      <div className="flex items-center h-full">
        <div className="flex animate-scroll whitespace-nowrap">
          {/* Repeat the content multiple times for seamless scrolling */}
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="flex items-center text-white font-medium text-sm mx-8">
              <Sparkles className="w-4 h-4 mr-2 text-yellow-300" />
              <span>Currently in BETA - 100% FREE to use</span>
              <Zap className="w-4 h-4 ml-2 text-yellow-300" />
            </div>
          ))}
        </div>
      </div>
      
      {/* Gradient fade edges */}
      <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-teal-600 to-transparent pointer-events-none"></div>
      <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-purple-600 to-transparent pointer-events-none"></div>
      
      {/* Custom CSS for scrolling animation */}
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-scroll {
          animation: scroll 20s linear infinite;
        }
        
        /* Pause animation on hover */
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default ScrollingBetaBanner;