import { motion } from "motion/react";
import { useEffect, useState } from "react";

const LOGO_SRC = "P.png";

export function LoadingScreen({ onComplete, ready }: { onComplete: () => void; ready: boolean; key?: string }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Safety Timeout: Force complete after 5 seconds regardless of progress
    const safetyTimeout = setTimeout(() => {
      console.log("Loading screen safety timeout triggered");
      onComplete();
    }, 5000);

    // Simulate initial loading progress
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          // Prioritize visuals: complete when visuals are at 100%
          // even if the ready prop (audio) isn't set yet
          clearInterval(timer);
          clearTimeout(safetyTimeout);
          // Small buffer to ensure visual smoothness before calling onComplete
          setTimeout(onComplete, 800);
          return 100;
        }
        return prev + Math.random() * 3; // Make it slightly faster
      });
    }, 40);

    return () => {
      clearInterval(timer);
      clearTimeout(safetyTimeout);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0, 
        scale: 1.5,
        filter: "blur(20px)" 
      }}
      transition={{ 
        duration: 2.2, 
        ease: [0.76, 0, 0.24, 1] 
      }}
      className="fixed inset-0 z-[100] bg-[#050505] flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="relative flex flex-col items-center justify-center">
        {/* Progress Ring */}
        <div className="absolute w-[180px] h-[180px] md:w-[220px] md:h-[220px]">
          <svg className="w-full h-full -rotate-90">
            {/* Background circle */}
            <circle
              cx="50%"
              cy="50%"
              r="48%"
              className="stroke-white/5"
              strokeWidth="1"
              fill="none"
            />
            {/* Progress circle */}
            <motion.circle
              cx="50%"
              cy="50%"
              r="48%"
              stroke="white"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="100 0"
              initial={{ strokeDashoffset: 100 }}
              animate={{ 
                strokeDashoffset: 100 - progress,
                filter: "drop-shadow(0 0 8px rgba(255,255,255,0.4))"
              }}
              style={{ willChange: "stroke-dashoffset" }}
              className="drop-shadow-[0_0_10px_white]"
            />
          </svg>
          
          {/* Rotating Ring Accent */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            style={{ willChange: "transform" }}
            className="absolute inset-0 border border-white/10 rounded-full scale-105"
          />
        </div>

        {/* Breathing Logo */}
        <motion.div
          animate={{ 
            scale: [0.9, 1.05, 0.9],
            filter: ["brightness(0.8) blur(0px)", "brightness(1.2) blur(1px)", "brightness(0.8) blur(0px)"]
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          style={{ willChange: "transform, filter" }}
          className="relative w-[100px] h-[100px] rounded-full border border-white/20 overflow-hidden shadow-[0_0_50px_rgba(255,255,255,0.1)] z-10"
        >
          <img 
            src={LOGO_SRC} 
            alt="Logo" 
            width="100"
            height="100"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        {/* Status Text */}
        <div className="absolute -bottom-24 text-center">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-white font-display text-sm tracking-[0.4em] uppercase mb-1"
          >
            Flexxy Project
          </motion.h2>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            className="text-[10px] font-mono text-white tracking-[0.2em]"
          >
            Loading {Math.floor(progress)}%
          </motion.div>
        </div>
      </div>

      {/* Background Pulse Ambient */}
      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.03, 0.07, 0.03]
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,white_0%,transparent_60%)] pointer-events-none"
      />
    </motion.div>
  );
}
