import { motion, AnimatePresence } from "motion/react";
import { VideoBackground } from "./components/VideoBackground";
import { ArrowRight } from "lucide-react";
import { LoadingScreen } from "./components/LoadingScreen";
import CrazyMovingText from "./components/CrazyMovingText";
import { AudioPlayer } from "./components/AudioPlayer";
import { InteractivePortrait } from "./components/InteractivePortrait";
import ProgressDrawer from "./components/ProgressDrawer";
import { useState } from "react";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [audioReady, setAudioReady] = useState(false);
  const [view, setView] = useState<'hero' | 'about'>('hero');

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && (
          <LoadingScreen 
            key="loader" 
            ready={audioReady} 
            onComplete={() => setLoading(false)} 
          />
        )}
      </AnimatePresence>

      <main className="relative min-h-screen w-full bg-background selection:bg-white selection:text-black">
        {/* PERSISTENT AUDIO & LOGO TRIGGER */}
        <AudioPlayer onReady={() => setAudioReady(true)} loading={loading} />

        <AnimatePresence mode="wait">
          {view === 'hero' ? (
            <motion.section
              key="hero"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -50, filter: "blur(20px)" }}
              transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
              className="relative h-screen flex flex-col items-center justify-center overflow-hidden"
            >
              <VideoBackground 
                url="https://assets.mixkit.co/videos/preview/mixkit-mysterious-pale-mountains-under-a-dark-sky-41484-large.mp4"
                filter="brightness(0.5) contrast(1.25)"
                overlayOpacity={0.4}
              />
              
              <div className="relative z-10 container mx-auto px-6 text-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="flex flex-col items-center justify-center mb-8"
                >
                  <CrazyMovingText 
                    text="JAI"
                    className="font-display text-[clamp(4rem,15vw,12rem)] leading-none font-extrabold uppercase tracking-tight text-white mb-2"
                  />
                  <CrazyMovingText 
                    text="Project"
                    delay={0.2}
                    className="font-heading italic text-[clamp(2.5rem,8vw,6rem)] leading-none text-white/90 -mt-2 md:-mt-6 ml-8 md:ml-20"
                  />
                </motion.div>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.8 }}
                  className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10"
                >
                  An introduction from my project
                </motion.p>
                
                <motion.button
                  onClick={() => setView('about')}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2, duration: 0.5 }}
                  className="group relative px-10 py-4 bg-white text-black font-semibold rounded-full overflow-hidden transition-all hover:pr-14"
                >
                  <span className="relative z-10 uppercase tracking-widest text-sm">LET'S START</span>
                  <ArrowRight className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-4 group-hover:translate-x-0" size={20} />
                </motion.button>
              </div>

              <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent z-10" />
            </motion.section>
          ) : (
            <motion.section
              key="about"
              initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -50, filter: "blur(10px)" }}
              transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
              className="min-h-screen bg-background text-white py-24 px-6 relative overflow-hidden"
            >
              <div className="container mx-auto max-w-6xl relative z-10">
                <button 
                  onClick={() => setView('hero')}
                  className="mb-12 text-white/40 hover:text-white transition-colors flex items-center gap-2 group cursor-pointer"
                >
                  <div className="rotate-180 inline-block group-hover:-translate-x-1 transition-transform">
                    <ArrowRight size={18} />
                  </div>
                  <span className="text-xs uppercase tracking-widest font-bold">Back to Summit</span>
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-start">
                  <div>
                    <h2 className="font-heading text-6xl md:text-8xl mb-8">About <br />Me_</h2>
                    <InteractivePortrait />
                  </div>

                  <div className="pt-0 md:pt-12">
                    <p className="text-xl md:text-2xl font-light leading-relaxed mb-12 opacity-90">
                      I am a creator interested in the intersection of technical modding, AI, and digital design. With a background in AutoCAD and civil engineering drafting, I enjoy mastering new technical tools quickly. I am currently focused on learning various programming languages while helping others with software troubleshooting and system optimization.
                    </p>

                    <div className="space-y-12">
                      <div className="space-y-4" id="capabilities">
                        <div className="text-xs font-bold uppercase tracking-[0.3em] text-white/40 mb-2">Capabilities</div>
                        <ul className="space-y-6 text-lg font-light">
                          <li className="flex items-start gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-white/20 mt-2.5 shrink-0" />
                            <span>AutoCAD with a focus on Civil Engineering layouts and rapid technical mastery.</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-white/20 mt-2.5 shrink-0" />
                            <span><span className="font-bold text-white/60">Local AI Implementation:</span> Experienced in configuring and running GGUF models locally using tools like Ollama and LM Studio.</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-white/20 mt-2.5 shrink-0" />
                            <span><span className="font-bold text-white/60">System & Software Optimization:</span> Skilled in technical troubleshooting, software repair, and optimizing environments for diskless systems and modding.</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-white/20 mt-2.5 shrink-0" />
                            <span><span className="font-bold text-white/60">Full-Stack Programming:</span> Currently mastering multiple coding languages to build and refine digital tools and environments.</span>
                          </li>
                        </ul>
                      </div>

                      <div className="space-y-4" id="research">
                        <div className="text-xs font-bold uppercase tracking-[0.3em] text-white/40 mb-2">Research</div>
                        <p className="text-muted-foreground leading-relaxed text-lg">
                          I focus on setting up local AI models and creating custom modifications for digital environments. This project is a collection of my technical work and ongoing progress in these areas. I built this website through Vibecoding, using AI to turn my creative vision into a functional digital experience.
                        </p>
                      </div>

                      <div className="pt-6">
                        <a 
                          href="https://www.instagram.com/jcajairus/" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex items-center gap-4 group cursor-pointer"
                        >
                          <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:border-white transition-all duration-300">
                            <ArrowRight size={18} className="group-hover:text-black transition-colors" />
                          </div>
                          <div className="text-left">
                            <p className="text-[10px] text-white/40 font-bold uppercase tracking-[0.2em]">Initiate Contact</p>
                            <p className="text-lg">jcajairus@gmail.com</p>
                          </div>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-[radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.02)_0%,transparent_70%)] pointer-events-none" />
              <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-white/5 to-transparent ml-12 hidden md:block" />
            </motion.section>
          )}
        </AnimatePresence>
        <ProgressDrawer />
      </main>
    </>
  );
}