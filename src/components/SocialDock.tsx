import { motion, AnimatePresence } from "motion/react";
import React, { useState } from "react";
import { Facebook, Instagram, Mail, Youtube, Share2, X, Copy, Check } from "lucide-react";
import { playSound, SoundType } from "../lib/soundUtils";

const SOCIAL_LINKS = [
  {
    icon: Facebook,
    url: "https://www.facebook.com/jairus.c.alolod/",
    label: "Facebook",
    angle: -60,
    color: "#1877F2",
    glow: "0 0 20px rgba(24, 119, 242, 0.5)"
  },
  {
    icon: Instagram,
    url: "https://www.instagram.com/jcajairus/",
    label: "Instagram",
    angle: -20,
    color: "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
    glow: "0 0 20px rgba(228, 64, 95, 0.5)"
  },
  {
    icon: Youtube,
    url: "https://www.youtube.com/@jcajairus/",
    label: "YouTube",
    angle: 20,
    color: "#FF0000",
    glow: "0 0 20px rgba(255, 0, 0, 0.5)"
  },
  {
    icon: Mail,
    url: "#",
    label: "Mail",
    angle: 60,
    color: "#EA4335",
    glow: "0 0 20px rgba(234, 67, 53, 0.5)"
  }
];

interface SocialDockProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const SocialDock = ({ isOpen, setIsOpen }: SocialDockProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const email = "jcajairus@gmail.com";

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    playSound(SoundType.TAP); // Keep tap for copy
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const getAngle = (baseAngle: number) => {
    return isMobile ? baseAngle * 0.6 : baseAngle;
  };

  return (
    <>
      {/* Radial Trigger - Left Side */}
      <motion.button
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onMouseEnter={() => playSound(SoundType.TICK)}
        onClick={() => {
          playSound(isOpen ? SoundType.DRAWER : SoundType.TAP);
          setIsOpen(!isOpen);
        }}
        className="fixed left-0 top-1/2 -translate-y-1/2 z-[9999] bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-r-full shadow-2xl group flex items-center justify-center cursor-pointer"
      >
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          {isOpen ? <X className="text-white" size={24} /> : <Share2 className="text-white/60 group-hover:text-white" size={24} />}
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
              onClick={() => {
                setIsOpen(false);
                setShowEmailModal(false);
              }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
            />

            {/* Left Radial Wheel */}
            <motion.div
              initial={{ x: "-100%", rotate: -45 }}
              animate={{ x: isMobile ? "-70%" : "-50%", rotate: 0 }}
              exit={{ x: "-100%", rotate: -45 }}
              transition={{ type: "spring", stiffness: 80, damping: 20 }}
              className="fixed left-0 top-1/2 -translate-y-1/2 w-[100vw] h-[100vw] md:w-[600px] md:h-[600px] bg-black/40 backdrop-blur-3xl border border-white/10 z-[9999] rounded-full shadow-2xl flex items-center justify-end"
            >
              {/* Social Icons on the edge */}
              {SOCIAL_LINKS.map((social, index) => (
                <motion.div
                  key={social.label}
                  className="absolute right-0 w-full h-full flex items-center justify-end pointer-events-none"
                  style={{ rotate: `${getAngle(social.angle)}deg` }}
                >
                  <motion.div 
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="absolute right-[4%] group pointer-events-none flex items-center"
                  >
                    {/* Pie Slice Highlight */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-64 bg-white/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 pointer-events-none" 
                         style={{ 
                           transform: 'translate(-50%, -50%) rotate(-90deg)',
                           background: hoveredIndex === index ? (social.color.includes('gradient') ? 'rgba(255,255,255,0.05)' : `${social.color}11`) : 'rgba(255,255,255,0.05)'
                         }} />
                    
                    {/* Label - Hidden on mobile to avoid clutter */}
                    <div className="absolute left-full ml-6 opacity-0 group-hover:opacity-100 transition-all transform -translate-x-4 group-hover:translate-x-0 pointer-events-none hidden md:block">
                      <span className="text-[11px] font-mono font-bold uppercase tracking-[0.4em] text-white whitespace-nowrap">
                        {social.label}
                      </span>
                    </div>

                    {/* Icon Link - The only interactive part */}
                    <motion.a
                      href={social.url}
                      target={social.label === "Mail" ? undefined : "_blank"}
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        if (social.label === "Instagram") playSound(SoundType.INSTAGRAM);
                        else if (social.label === "YouTube") playSound(SoundType.YOUTUBE);
                        else if (social.label === "Mail") playSound(SoundType.EMAIL);
                        else if (social.label === "Facebook") playSound(SoundType.GENERIC_POP);
                        else playSound(SoundType.TAP);

                        if (social.label === "Mail") {
                          e.preventDefault();
                          setShowEmailModal(true);
                        }
                      }}
                      onMouseEnter={() => {
                        setHoveredIndex(index);
                        playSound(SoundType.TICK);
                      }}
                      onMouseLeave={() => setHoveredIndex(null)}
                      whileHover={{ 
                        scale: 1.2, 
                        x: 10,
                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                        boxShadow: social.glow
                      }}
                      whileTap={{
                        scale: 0.95,
                        backgroundColor: "rgba(255, 255, 255, 0.3)",
                        boxShadow: social.glow
                      }}
                      style={{
                        background: hoveredIndex === index && social.color.includes('gradient') 
                          ? social.color 
                          : undefined
                      }}
                      className={`w-14 h-14 md:w-20 md:h-20 flex items-center justify-center rounded-[1.2rem] md:rounded-[1.4rem] bg-white/10 border border-white/20 text-white/70 transition-all duration-300 backdrop-blur-md pointer-events-auto relative ${hoveredIndex === index ? (!social.color.includes('gradient') ? `!text-white` : '!text-white shadow-lg') : ''}`}
                    >
                      <social.icon 
                        size={isMobile ? 24 : 32} 
                        strokeWidth={1.5} 
                        style={{ color: hoveredIndex === index && !social.color.includes('gradient') ? social.color : undefined }}
                      />
                    </motion.a>
                  </motion.div>
                </motion.div>
              ))}

              {/* Decorative Rings */}
              <div className="absolute inset-0 pointer-events-none opacity-20">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] h-[85%] border border-dashed border-white/20 rounded-full" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] border border-white/10 rounded-full" />
              </div>
            </motion.div>

            {/* Email Floating Modal - Moved outside the wheel for true centering */}
            <AnimatePresence>
              {showEmailModal && (
                <div className="fixed inset-0 flex items-center justify-center z-[10000] p-6 lg:p-0">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/80 backdrop-blur-md"
                    onClick={() => {
                      playSound(SoundType.DRAWER);
                      setShowEmailModal(false);
                    }}
                  />
                  
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 20 }}
                    className="relative w-full max-w-md bg-black/90 border border-white/10 rounded-2xl shadow-2xl overflow-hidden p-8 backdrop-blur-2xl"
                  >
                    {/* Close Button */}
                    <button 
                      onClick={() => {
                        playSound(SoundType.DRAWER);
                        setShowEmailModal(false);
                      }}
                      onMouseEnter={() => playSound(SoundType.TICK)}
                      className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors cursor-pointer"
                    >
                      <X size={20} />
                    </button>

                    <div className="space-y-6">
                      <div className="text-center">
                        <h3 className="text-xs font-bold text-white/40 uppercase tracking-[0.4em] mb-4">Contact Detail</h3>
                        <div className="h-0.5 w-12 bg-white/20 mx-auto mb-6" />
                      </div>

                      <div className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-xl group transition-all hover:bg-white/10 hover:border-white/20">
                        <div className="flex flex-col flex-1 overflow-hidden">
                          <span className="text-[10px] text-white/30 uppercase tracking-widest font-bold mb-1">Email_Address</span>
                          <span className="text-white font-mono text-sm md:text-base truncate select-all">{email}</span>
                        </div>
                        
                        <button
                          onClick={handleCopy}
                          onMouseEnter={() => playSound(SoundType.TICK)}
                          className="relative flex items-center justify-center w-12 h-12 rounded-lg bg-white/10 border border-white/10 hover:bg-white/20 hover:border-white/20 transition-all cursor-pointer group/copy"
                        >
                          <AnimatePresence mode="wait">
                            {copied ? (
                              <motion.div
                                key="check"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                className="flex flex-col items-center"
                              >
                                <Check size={18} className="text-green-400" />
                                <span className="absolute -top-10 bg-green-500 text-black text-[10px] font-bold px-2 py-1 rounded shadow-lg whitespace-nowrap">COPIED!</span>
                              </motion.div>
                            ) : (
                              <motion.div
                                key="copy"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                              >
                                <Copy size={18} className="text-white/60 group-hover/copy:text-white" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
