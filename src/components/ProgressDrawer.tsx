import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { X, ChevronLeft } from "lucide-react";

const AUTOCAD_3D = "autocad-3d.png";
const AUTOCAD_PLAN = "autocad-plan.png";

export default function ProgressDrawer() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Trigger Button */}
      <motion.button
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        transition={{ 
          type: "spring", 
          stiffness: 400, 
          damping: 10,
          delay: 2 
        }}
        onClick={() => setIsOpen(true)}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-[100] bg-white/10 backdrop-blur-md border-l border-y border-white/20 px-3 py-6 rounded-l-2xl shadow-2xl group flex flex-col items-center gap-2 cursor-pointer touch-none"
      >
        <ChevronLeft className="text-white/60 group-hover:text-white transition-colors" size={20} />
        <span className="[writing-mode:vertical-lr] text-[10px] uppercase tracking-[0.3em] font-bold text-white/40 group-hover:text-white/90 transition-colors">
          Progress
        </span>
      </motion.button>

      {/* Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30 
              }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-black/80 backdrop-blur-2xl border-l border-white/10 z-[101] shadow-2xl overflow-y-auto"
            >
              <div className="p-8 pb-24">
                {/* Header */}
                <div className="flex items-center justify-between mb-12">
                  <div>
                    <h3 className="text-2xl font-heading font-bold text-white mb-1">Project Logs_</h3>
                    <p className="text-xs uppercase tracking-widest text-white/40">Technical Progress & Goals</p>
                  </div>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all cursor-pointer"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* AutoCAD Visuals */}
                <div className="space-y-8">
                  <div className="group space-y-3">
                    <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 flex items-center gap-2">
                       <span className="w-8 h-px bg-white/10" /> 01 // 3D Visualization
                    </div>
                    <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 bg-white/5">
                      <img 
                        src={AUTOCAD_3D} 
                        alt="AutoCAD 3D House Visualization" 
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                        style={{ imageRendering: "high-quality" }}
                      />
                    </div>
                  </div>

                  <div className="group space-y-3">
                    <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 flex items-center gap-2">
                       <span className="w-8 h-px bg-white/10" /> 02 // Technical Floor Plan
                    </div>
                    <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 bg-white/5">
                      <img 
                        src={AUTOCAD_PLAN} 
                        alt="AutoCAD Technical Floor Plan" 
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                        style={{ imageRendering: "high-quality" }}
                      />
                    </div>
                  </div>
                </div>

                {/* Text Content */}
                <div className="mt-12 space-y-6">
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                    <h4 className="text-sm font-bold text-white/80 mb-3 uppercase tracking-wider">The Vision</h4>
                    <p className="text-sm text-white/60 leading-relaxed font-light">
                      My specialization lies in <span className="text-white/90 font-medium">Civil Engineering Drafting</span>, where I bridge the gap between architectural concept and structural reality using AutoCAD. 
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                    <h4 className="text-sm font-bold text-white/80 mb-3 uppercase tracking-wider">The Goal</h4>
                    <p className="text-sm text-white/60 leading-relaxed font-light italic">
                      "My ultimate objective is to achieve absolute mastery over all programming languages, turning complex syntax into a second nature for building the next generation of digital environments."
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
