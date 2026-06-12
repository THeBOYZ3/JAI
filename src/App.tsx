import { motion, AnimatePresence } from "motion/react";
import { VideoBackground } from "./components/VideoBackground";
import { DarkGlowingWater } from "./components/DarkGlowingWater";
import { ArrowRight } from "lucide-react";
import { LoadingScreen } from "./components/LoadingScreen";
import CrazyMovingText from "./components/CrazyMovingText";
import { AudioPlayer } from "./components/AudioPlayer";
import { InteractivePortrait } from "./components/InteractivePortrait";
import { SocialDock } from "./components/SocialDock";
import ProgressDrawer from "./components/ProgressDrawer";
import { useState } from "react";
import { playSound, SoundType } from "./lib/soundUtils";
import { VibeRain } from "./components/VibeRain";
import { SequentialHighlightProvider, HighlightSentence, HighlightListItem } from "./components/SequentialHighlight";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [audioReady, setAudioReady] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [view, setView] = useState<'hero' | 'about'>('hero');
  const [leftOpen, setLeftOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);

  const toggleLeft = () => {
    setLeftOpen(!leftOpen);
    if (!leftOpen) setRightOpen(false);
  };

  const toggleRight = () => {
    setRightOpen(!rightOpen);
    if (!rightOpen) setLeftOpen(false);
  };

  return (
    <>
      <SocialDock isOpen={leftOpen} setIsOpen={toggleLeft} />
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
        <AudioPlayer 
          onReady={() => setAudioReady(true)} 
          loading={loading} 
          onMusicStateChange={setIsMusicPlaying} 
        />

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
              <DarkGlowingWater />
              
              <div className="relative z-50 container mx-auto px-6 text-center flex flex-col items-center justify-center">
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
                  onClick={() => {
                    playSound(SoundType.TAP);
                    setView('about');
                  }}
                  onMouseEnter={() => playSound(SoundType.TICK)}
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
              <SequentialHighlightProvider>
                <div className="container mx-auto max-w-6xl relative z-10">
                  <button 
                    onClick={() => {
                      playSound(SoundType.TAP);
                      setView('hero');
                    }}
                    onMouseEnter={() => playSound(SoundType.TICK)}
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
                      <p className="text-xl md:text-2xl font-light leading-relaxed mb-12 flex flex-col gap-4">
                        <HighlightSentence index={0} text="My name is Jairus C. Alolod from PCCASHS.">
                          My name is <span className="text-white font-bold">Jairus C. Alolod</span> from <span className="text-white font-medium">PCCASHS</span>.
                        </HighlightSentence>
                        <HighlightSentence index={1} text="I am a Senior High School student and an aspiring Developer.">
                          I am a <span className="text-white font-medium">Senior High School student</span> and an <span className="text-white font-medium">aspiring Developer</span>.
                        </HighlightSentence>
                        <HighlightSentence index={2} text="I am working to master both AutoCAD and web development to build a strong foundation for my future and the JAI Project.">
                          I am working to master both <span className="text-white font-semibold">AutoCAD and web development</span> to build a strong foundation for my future and the <span className="text-white font-bold">JAI Project</span>.
                        </HighlightSentence>
                      </p>

                      <div className="space-y-12">
                        <div className="space-y-4" id="capabilities">
                          <div className="text-xs font-bold uppercase tracking-[0.3em] text-white/40 mb-2">Capabilities</div>
                          <ul className="space-y-6 text-lg font-light">
                            <HighlightListItem index={3} text="AutoCAD with a focus on Civil Engineering layouts and rapid technical mastery.">
                              AutoCAD with a focus on Civil Engineering layouts and rapid technical mastery.
                            </HighlightListItem>
                            <HighlightListItem index={4} text="Local AI Implementation: Experienced in configuring and running GGUF models locally using tools like Ollama and LM Studio.">
                              <span className="font-bold text-white/90">Local AI Implementation:</span> Experienced in configuring and running GGUF models locally using tools like Ollama and LM Studio.
                            </HighlightListItem>
                            <HighlightListItem index={5} text="System & Software Optimization: Skilled in technical troubleshooting, software repair, and optimizing environments for diskless systems and modding.">
                              <span className="font-bold text-white/90">System & Software Optimization:</span> Skilled in technical troubleshooting, software repair, and optimizing environments for diskless systems and modding.
                            </HighlightListItem>
                            <HighlightListItem index={6} text="Full-Stack Programming: Currently mastering multiple coding languages to build and refine digital tools and environments.">
                              <span className="font-bold text-white/90">Full-Stack Programming:</span> Currently mastering multiple coding languages to build and refine digital tools and environments.
                            </HighlightListItem>
                          </ul>
                        </div>

                        <div className="space-y-4" id="research">
                          <div className="text-xs font-bold uppercase tracking-[0.3em] text-white/40 mb-2">Research</div>
                          <p className="text-lg leading-relaxed flex flex-col gap-4">
                            <HighlightSentence index={7} text="I focus on setting up local AI models and creating custom modifications for digital environments.">
                              I focus on setting up local AI models and creating custom modifications for digital environments.
                            </HighlightSentence>
                            <HighlightSentence index={8} text="This project is a collection of my technical work and ongoing progress in these areas.">
                              This project is a collection of my technical work and ongoing progress in these areas.
                            </HighlightSentence>
                            <HighlightSentence index={9} text="I built this website through Vibecoding, using AI to turn my creative vision into a functional digital experience.">
                              I built this website through Vibecoding, using AI to turn my creative vision into a functional digital experience.
                            </HighlightSentence>
                          </p>
                        </div>

                        <div className="pt-6">
                          <a 
                            href="https://www.instagram.com/jcajairus/" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            onClick={() => playSound(SoundType.INSTAGRAM)}
                            onMouseEnter={() => playSound(SoundType.TICK)}
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
              </SequentialHighlightProvider>

              <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-[radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.02)_0%,transparent_70%)] pointer-events-none" />
              <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-white/5 to-transparent ml-12 hidden md:block" />
            </motion.section>
          )}
        </AnimatePresence>
        <ProgressDrawer isOpen={rightOpen} setIsOpen={toggleRight} />
      </main>
    </>
  );
}
