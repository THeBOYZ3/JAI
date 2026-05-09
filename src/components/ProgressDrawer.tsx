// EXTERNAL ASSET MAP: 
// /public/public/music/previews/3D.mp4
// /public/public/music/previews/FloorPlan.mp4
// /public/public/music/previews/Coding.mp4
// /public/public/music/previews/AI.mp4
// NOTE: These assets are managed externally. DO NOT delete or rename these paths.

import { motion, AnimatePresence } from "motion/react";
import { useState, useRef } from "react";
import { X, ChevronLeft, Target, Terminal, Layout, Award } from "lucide-react";
import { playSound, SoundType } from "../lib/soundUtils";

const AUTOCAD_3D = "autocad-3d.png";
const AUTOCAD_PLAN = "autocad-plan.png";
const CODE_PALETTE = "pexels-marek-prasil-479620-37227160_2.jpg";
const AI_RESEARCH = "pexels-bertellifotografia-30530412_2.jpg";

const MENU_ITEMS = [
  { icon: Terminal, label: "Full-Stack", angle: -20 },
  { icon: Layout, label: "UX/UI Design", angle: 0 },
  { icon: Target, label: "AutoCAD Mastery", angle: 20 },
  { icon: Award, label: "Core Goals", angle: 40 },
];

interface ProgressDrawerProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function ProgressDrawer({ isOpen, setIsOpen }: ProgressDrawerProps) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <>
      {/* Floating Trigger Button */}
      <motion.button
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onMouseEnter={() => playSound(SoundType.TICK)}
        transition={{ type: "spring", stiffness: 260, damping: 10, delay: 2 }}
        onClick={() => {
          playSound(isOpen ? SoundType.DRAWER : SoundType.TAP);
          setIsOpen(!isOpen);
        }}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-[9999] bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-l-full shadow-2xl group flex items-center justify-center cursor-pointer overflow-hidden"
      >
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          {isOpen ? (
            <X className="text-white" size={24} />
          ) : (
            <div className="flex flex-col items-center gap-2">
              <ChevronLeft className="text-white/60 group-hover:text-white transition-colors" size={24} />
              <span className="[writing-mode:vertical-lr] text-[10px] uppercase tracking-[0.4em] font-bold text-white/40 group-hover:text-white/90">
                PROJECTS
              </span>
            </div>
          )}
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-[9998]"
            />

            {/* Drawer Container */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: "0%" }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 100, damping: 20, mass: 0.8 }}
              className={`fixed right-0 top-0 h-full ${isMobile ? 'w-[85%]' : 'w-[700px] lg:w-[850px]'} bg-black/90 backdrop-blur-3xl border-l border-white/10 z-[9999] flex flex-row items-center overflow-hidden`}
            >
              <div className="flex-1 h-full overflow-y-auto custom-scrollbar-hide flex flex-col justify-start p-6 md:p-24 pt-24 pb-32">
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="w-full max-w-xl space-y-16">
                  <div className="space-y-4">
                    <h3 className="text-4xl md:text-6xl font-heading font-bold text-white uppercase tracking-tighter leading-none">
                      STATUS_ <br />
                      <span className="text-white/30">PROGRESS</span>
                    </h3>
                    <div className="h-1.5 w-24 bg-white/40 rounded-full" />
                  </div>

                  <div className="space-y-6">
                    <h4 className="text-[10px] font-bold text-white/50 uppercase tracking-[0.6em]"> MY BIO </h4>
                    <p className="text-sm md:text-lg text-white/90 leading-relaxed font-light">
                      My name is <span className="text-white font-bold">Jairus C. Alolod</span>. I am a <span className="text-white font-medium">Senior High School student</span> and an <span className="text-white font-medium">aspiring Developer</span> working on the <span className="text-white font-bold">JAI Project</span>.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-12">
                    <ProjectCard src={AUTOCAD_3D} label="3D_VISUALIZATION" isMobile={isMobile} objectFit="contain" />
                    <ProjectCard src={AUTOCAD_PLAN} label="TECHNICAL_PLAN" isMobile={isMobile} objectFit="contain" />
                    <ProjectCard src={CODE_PALETTE} label="CODE_PALETTE" isMobile={isMobile} objectFit="cover" />
                    <ProjectCard src={AI_RESEARCH} label="AI_RESEARCH" isMobile={isMobile} objectFit="cover" />
                  </div>
                </motion.div>
              </div>

              {/* Icon Bar */}
              <div className="w-[80px] md:w-[120px] h-full border-l border-white/5 bg-white/[0.02] flex flex-col items-center justify-center gap-12 py-10 relative">
                {MENU_ITEMS.map((item, index) => (
                  <motion.div
                    key={index}
                    initial="initial"
                    whileHover="hover"
                    whileTap="tap"
                    className="relative flex items-center justify-center"
                  >
                    {/* Animated Tooltip */}
                    <motion.div
                      variants={{
                        initial: { opacity: 0, x: 20 },
                        hover: { opacity: 1, x: 0 }
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      className="absolute right-full mr-4 md:mr-8 pointer-events-none z-[110]"
                    >
                      <div className="bg-white/10 backdrop-blur-2xl border border-white/20 px-3 py-1.5 md:px-5 md:py-2.5 rounded-xl whitespace-nowrap shadow-2xl">
                        <span className="text-[9px] md:text-[11px] font-mono font-bold text-white uppercase tracking-[0.3em] md:tracking-[0.5em]">
                          {item.label}
                        </span>
                        {/* Tooltip Arrow/Accent */}
                        <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-white/20 border-r border-t border-white/20 rotate-45" />
                      </div>
                    </motion.div>

                    {/* Icon Button */}
                    <motion.div
                      whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                      whileTap={{ scale: 0.95 }}
                      onMouseEnter={() => playSound(SoundType.TICK)}
                      onClick={() => playSound(SoundType.TAP)}
                      className="w-12 h-12 md:w-20 md:h-20 flex items-center justify-center rounded-2xl md:rounded-3xl bg-white/10 border border-white/10 text-white/40 group-hover:text-white transition-all cursor-pointer backdrop-blur-xl shadow-lg relative z-10"
                    >
                      <item.icon size={isMobile ? 24 : 32} strokeWidth={1} />
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function ProjectCard({ src, label, isMobile, objectFit }: { src: string; label: string; isMobile: boolean; objectFit: 'contain' | 'cover' }) {
  const [isPressed, setIsPressed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const videoSrc = ({
    "3D_VISUALIZATION": "https://raw.githubusercontent.com/THeBOYZ3/JAI/main/public/public/music/previews/3D.mp4",
    "TECHNICAL_PLAN": "https://raw.githubusercontent.com/THeBOYZ3/JAI/main/public/public/music/previews/FloorPlan.mp4",
    "CODE_PALETTE": "https://raw.githubusercontent.com/THeBOYZ3/JAI/main/public/public/music/previews/Coding.mp4",
    "AI_RESEARCH": "https://raw.githubusercontent.com/THeBOYZ3/JAI/main/public/public/music/previews/AI.mp4"
  } as Record<string, string>)[label] || "";

  return (
    <div 
      // This state tells the video to show/hide
      onMouseEnter={() => setIsPressed(true)}
      onMouseLeave={() => setIsPressed(false)}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      className="group relative rounded-2xl md:rounded-3xl overflow-hidden border border-white/10 aspect-video bg-black shadow-2xl cursor-pointer touch-none"
    >
      {/* 1. STATIC IMAGE: Stays in background */}
      <img 
        src={src} 
        className={`w-full h-full ${objectFit === 'contain' ? 'object-contain' : 'object-cover'} transition-opacity duration-300 ${isPressed ? 'opacity-0' : 'opacity-100'}`} 
        alt={label} 
      />
      
      {/* 2. THE VIDEO: Uses autoPlay + loop + muted (Standard for Previews) */}
      {videoSrc && (
        <video
          ref={videoRef}
          src={videoSrc}
          autoPlay
          muted
          loop
          playsInline
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 z-50 pointer-events-none ${isPressed ? 'opacity-100' : 'opacity-0'}`}
        />
      )}

      {/* 3. DESKTOP LABEL ONLY */}
      {!isMobile && !isPressed && (
        <div className="absolute bottom-4 right-4 px-4 py-2 bg-black/80 backdrop-blur-md rounded-xl text-[10px] text-white/80 font-mono border border-white/10 uppercase z-20">
          {label}
        </div>
      )}
    </div>
  );
}
