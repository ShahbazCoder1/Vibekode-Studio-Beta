"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Home, FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative min-h-screen w-full bg-[#09090b] text-white flex flex-col items-center justify-center p-4 overflow-hidden selection:bg-[#5b21b6]/30">
      
      {/* --- Background Ambience (Consistent with other pages) --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#5b21b6]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#1e40af]/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] mask-image-gradient" />
      </div>

      <div className="relative z-10 text-center max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Icon Badge */}
          <div className="mx-auto mb-8 w-16 h-16 rounded-2xl bg-zinc-900/50 border border-zinc-800 backdrop-blur-md flex items-center justify-center shadow-2xl shadow-[#5b21b6]/10">
            <FileQuestion className="w-8 h-8 text-[#7c3aed]" />
          </div>

          {/* Glitchy 404 Text */}
          <h1 className="text-8xl md:text-9xl font-black tracking-tighter mb-4 bg-gradient-to-r from-[#5b21b6] via-[#7c3aed] to-[#1e40af] bg-clip-text text-transparent select-none">
            404
          </h1>

          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Prompt Not Found
          </h2>

          <p className="text-zinc-400 text-lg mb-10 leading-relaxed max-w-md mx-auto">
            The page you are looking for seems to have been deleted or never existed. Even our AI could not generate this one.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#5b21b6] to-[#1e40af] text-white font-semibold hover:shadow-lg hover:shadow-[#5b21b6]/25 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              Back Home
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 font-medium hover:bg-zinc-800 hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>
          </div>
        </motion.div>
      </div>

      {/* Footer Text */}
      <div className="absolute bottom-8 text-center w-full z-10">
        <p className="text-xs text-zinc-600 font-mono">ERROR_CODE: PAGE_MISSING</p>
      </div>
    </div>
  );
}