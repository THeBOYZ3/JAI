import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
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

  const getAngle = (baseAngle: number) => {
    return isMobile ? baseAngle * 0.7 : baseAngle;
  };

  return (
    <>
      {/* Floating Trigger Button - Right Side */}
      <motion.button
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onMouseEnter={() => playSound(SoundType.TICK)}
        transition={{ 
          type: "spring", 
          stiffness: 260, 
          damping: 10,
          delay: 2 
        }}
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

      {/* Right Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                playSound(SoundType.DRAWER);
                setIsOpen(false);
              }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
            />

            {/* Right Drawer Container */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: "0%" }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 100, damping: 20, mass: 0.8 }}
              className={`fixed right-0 top-0 h-full ${isMobile ? 'w-[85%]' : 'w-[700px] lg:w-[850px]'} bg-black/80 md:bg-black/90 backdrop-blur-3xl border-l border-white/10 z-[9999] shadow-2xl flex flex-row items-center overflow-hidden`}
            >
              {/* Content Area - Centered/Left */}
              <div className="flex-1 h-full overflow-y-auto custom-scrollbar-hide flex flex-col justify-start p-8 md:p-24 lg:p-32 pt-20 md:pt-40 lg:pt-48">
                <motion.div 
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: 0.3 }}
                   className="w-full max-w-xl space-y-10 md:space-y-16"
                >
                  {/* Headers */}
                  <div className="space-y-4">
                    <h3 className="text-4xl md:text-6xl font-heading font-bold text-white uppercase tracking-tighter leading-none select-text">
                      STATUS_ <br />
                      <span className="text-white/30">PROGRESS</span>
                    </h3>
                    <div className="h-1.5 w-24 bg-white/40 rounded-full" />
                  </div>

                  {/* Bio */}
                  <div className="space-y-6">
                    <h4 className="text-[10px] md:text-xs font-bold text-white/50 uppercase tracking-[0.6em] select-text"> MY BIO </h4>
                    <p className="text-sm md:text-lg text-white/90 leading-relaxed font-light select-text max-w-lg">
                      I am a <span className="text-white font-medium">Senior High School student</span> and an <span className="text-white font-medium">aspiring Full-Stack Developer and UX/UI Designer</span>. I am working to master both <span className="text-white/60">AutoCAD and web development</span> to build a strong foundation for my future and the <span className="text-white font-bold">JAI Project</span>.
                    </p>
                  </div>

                  {/* Images */}
                  <div className="grid grid-cols-1 gap-8 md:gap-10">
                    <div className="group relative rounded-2xl md:rounded-3xl overflow-hidden border border-white/10 aspect-video bg-white/5 shadow-2xl">
                      <img 
                        src={AUTOCAD_3D} 
                        className="w-full h-full object-contain bg-black/20 opacity-90 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105" 
                        alt="AutoCAD 3D" 
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                      <div className="absolute bottom-4 right-4 px-4 py-2 bg-black/80 backdrop-blur-md rounded-xl text-[10px] text-white/80 font-mono tracking-widest border border-white/10 uppercase">
                        3D_VISUALIZATION
                      </div>
                    </div>
                    <div className="group relative rounded-2xl md:rounded-3xl overflow-hidden border border-white/10 aspect-video bg-white/5 shadow-2xl">
                      <img 
                        src={AUTOCAD_PLAN} 
                        className="w-full h-full object-contain bg-black/20 opacity-90 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105" 
                        alt="AutoCAD Plan" 
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                      <div className="absolute bottom-4 right-4 px-4 py-2 bg-black/80 backdrop-blur-md rounded-xl text-[10px] text-white/80 font-mono tracking-widest border border-white/10 uppercase">
                        TECHNICAL_PLAN
                      </div>
                    </div>

                    <div className="group relative rounded-2xl md:rounded-3xl overflow-hidden border border-white/10 aspect-video bg-white/5 shadow-2xl">
                      <img 
                        src={CODE_PALETTE} 
                        className="w-full h-full object-cover bg-black/20 opacity-90 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105" 
                        alt="Code Palette" 
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                      <div className="absolute bottom-4 right-4 px-4 py-2 bg-black/80 backdrop-blur-md rounded-xl text-[10px] text-white/80 font-mono tracking-widest border border-white/10 uppercase">
                        CODE_PALETTE
                      </div>
                    </div>

                    <div className="group relative rounded-2xl md:rounded-3xl overflow-hidden border border-white/10 aspect-video bg-white/5 shadow-2xl">
                      <img 
                        src={AI_RESEARCH} 
                        className="w-full h-full object-cover bg-black/20 opacity-90 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105" 
                        alt="AI Research" 
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                      <div className="absolute bottom-4 right-4 px-4 py-2 bg-black/80 backdrop-blur-md rounded-xl text-[10px] text-white/80 font-mono tracking-widest border border-white/10 uppercase">
                        AI_RESEARCH
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Vertical Icon Bar - Right Edge */}
              <div className="w-[80px] md:w-[120px] h-full border-l border-white/5 bg-white/[0.02] flex flex-col items-center justify-center gap-8 md:gap-12 py-10">
                {MENU_ITEMS.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="relative group"
                  >
                    <motion.div
                      whileHover={{ scale: 1.1, x: -5 }}
                      whileTap={{ scale: 0.95 }}
                      onMouseEnter={() => playSound(SoundType.TICK)}
                      onClick={() => playSound(SoundType.TAP)}
                      className="w-12 h-12 md:w-20 md:h-20 flex items-center justify-center rounded-2xl md:rounded-[2rem] bg-white/10 border border-white/10 text-white/40 group-hover:text-white group-hover:bg-white/20 group-hover:border-white/30 transition-all cursor-pointer backdrop-blur-xl shadow-xl overflow-hidden"
                    >
                      {/* Hover Glow */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <item.icon size={isMobile ? 24 : 32} strokeWidth={1} className="relative z-10" />
                    </motion.div>
                    
                    {/* Tooltip Label */}
                    <div className="absolute right-full mr-2 md:mr-6 top-1/2 -translate-y-1/2 transition-all transform pointer-events-none opacity-100 translate-x-0 md:opacity-0 md:group-hover:opacity-100 md:translate-x-4 md:group-hover:translate-x-0 z-20">
                      <span className="text-[8px] md:text-[10px] font-mono font-bold uppercase tracking-[0.2em] md:tracking-[0.4em] text-white/90 bg-white/10 backdrop-blur-md px-2 md:px-4 py-1 md:py-2 rounded-lg border border-white/10 whitespace-nowrap">
                        {item.label}
                      </span>
                    </div>
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
