

export enum SoundType {
  TICK = 'TICK',
  TAP = 'TAP',
  DRAWER = 'DRAWER',
  YOUTUBE = 'YOUTUBE',
  INSTAGRAM = 'INSTAGRAM',
  EMAIL = 'EMAIL',
  GENERIC_POP = 'GENERIC_POP'
}

class AudioSynthesizer {
  private static instance: AudioSynthesizer;
  private ctx: AudioContext | null = null;

  private constructor() {}

  static getInstance() {
    if (!AudioSynthesizer.instance) {
      AudioSynthesizer.instance = new AudioSynthesizer();
    }
    return AudioSynthesizer.instance;
  }

  private initContext() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  play(type: SoundType) {
    const ctx = this.initContext();
    const now = ctx.currentTime;

    const createOscillator = (freq: number, type: OscillatorType = 'sine') => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);
      osc.connect(gain);
      gain.connect(ctx.destination);
      return { osc, gain };
    };

    switch (type) {
      case SoundType.TICK: {
        const { osc, gain } = createOscillator(800);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.01);
        osc.start(now);
        osc.stop(now + 0.01);
        break;
      }

      case SoundType.TAP: {
        const { osc, gain } = createOscillator(600, 'triangle');
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.03);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
        osc.start(now);
        osc.stop(now + 0.03);
        break;
      }

      case SoundType.DRAWER: {
        const { osc, gain } = createOscillator(150);
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.05);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
        break;
      }

      case SoundType.YOUTUBE: {
        // Play Chime: 400Hz -> 600Hz
        const tone1 = createOscillator(400);
        tone1.gain.gain.setValueAtTime(0.1, now);
        tone1.gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        tone1.osc.start(now);
        tone1.osc.stop(now + 0.05);

        const tone2 = createOscillator(600);
        tone2.gain.gain.setValueAtTime(0, now);
        tone2.gain.gain.setValueAtTime(0.1, now + 0.05);
        tone2.gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        tone2.osc.start(now + 0.05);
        tone2.osc.stop(now + 0.1);
        break;
      }

      case SoundType.INSTAGRAM: {
        // Camera Shutter: 15ms white noise + 800Hz tick
        const bufferSize = ctx.sampleRate * 0.015;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.05, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.015);
        noise.connect(noiseGain);
        noiseGain.connect(ctx.destination);
        noise.start(now);

        const { osc, gain } = createOscillator(800);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.01);
        osc.start(now);
        osc.stop(now + 0.01);
        break;
      }

      case SoundType.EMAIL: {
        // Paper Swoosh: 200Hz -> 50Hz sweep
        const { osc, gain } = createOscillator(200);
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.1);
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.1, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
        break;
      }

      case SoundType.GENERIC_POP: {
        // Bubble Pop: 500Hz -> 100Hz in 20ms
        const { osc, gain } = createOscillator(500);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.02);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
        osc.start(now);
        osc.stop(now + 0.02);
        break;
      }
    }
  }
}

export const playSound = (type: SoundType) => AudioSynthesizer.getInstance().play(type);
