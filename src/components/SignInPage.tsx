import Image from "next/image";
import { useEffect, useRef } from "react";
import { AuthModal } from "@/components/Auth-model";

export default function SignInPage() {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let scrollPosition = 0;
    const scrollSpeed = 0.3;
    let animationFrameId: number;

    const animate = () => {
      scrollPosition += scrollSpeed;
      if (scrollPosition >= scrollContainer.scrollHeight / 2) {
        scrollPosition = 0;
      }
      scrollContainer.style.transform = `translateY(-${scrollPosition}px)`;
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const imageList = [
    "artist-portfolio",
    "lms-landing-page",
    "pixel-art-paint-app",
    "retro-control-panel",
    "tic-tac-toe",
    "todo-list-manager",
  ];

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-black overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/80 to-black/90 z-10" />
        <div
          ref={scrollRef}
          className="absolute inset-0 flex flex-col gap-6 p-6"
        >
          {imageList.concat(imageList).map((name, i) => (
            <div
              key={i}
              className="relative w-full h-full rounded-lg overflow-hidden opacity-40 blur-[2px]"
            >
              <Image
                src={`/community/${name}.png`}
                alt={name}
                fill
                className="object-cover"
                priority
              />
            </div>
          ))}
        </div>
      </div>

      {/* Foreground Content */}
      <div className="relative z-20 flex flex-col items-center px-6">
        <div className="relative w-16 h-16 mb-6">
          <Image
            src="/logo.png"
            alt="VibeKode Logo"
            fill
            className="object-contain rounded-full"
            priority
          />
        </div>

        <h1 className="text-3xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#00ccb1] via-[#7b61ff] to-[#1ca0fb] mb-6 text-center">
          Welcome to VibeKode
        </h1>

        <AuthModal
          mode="signin"
          triggerText="Sign In"
          triggerClassName="w-full py-3 bg-gradient-to-r from-[#00ccb1] to-[#1ca0fb] text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105 active:scale-95"
        />
      </div>
    </div>
  );
}
