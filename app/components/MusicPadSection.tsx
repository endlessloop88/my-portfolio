"use client";

import React, { useRef, useState } from 'react';

type PadType = 'kick' | 'snare' | 'hihat' | 'tom' | 'crash' | 'perc' | 'sub';

interface Pad {
  id: number;
  name: string;
  key: string;
  color: string;
  type: PadType;
  baseFreq: number;
}

const pads: Pad[] = [
  { id: 1, name: "Kick", key: "Q", color: "from-red-600 to-orange-600", type: "kick", baseFreq: 150 },
  { id: 2, name: "Snare", key: "W", color: "from-blue-600 to-cyan-600", type: "snare", baseFreq: 200 },
  { id: 3, name: "Hi-Hat", key: "E", color: "from-yellow-500 to-amber-600", type: "hihat", baseFreq: 8000 },
  { id: 4, name: "Tom 1", key: "A", color: "from-purple-600 to-indigo-600", type: "tom", baseFreq: 220 },
  { id: 5, name: "Tom 2", key: "S", color: "from-green-600 to-emerald-600", type: "tom", baseFreq: 150 },
  { id: 6, name: "Crash", key: "D", color: "from-pink-600 to-rose-600", type: "crash", baseFreq: 5000 },
  { id: 7, name: "Perc 1", key: "Z", color: "from-teal-600 to-cyan-700", type: "perc", baseFreq: 600 },
  { id: 8, name: "Perc 2", key: "X", color: "from-amber-600 to-orange-700", type: "perc", baseFreq: 900 },
  { id: 9, name: "Sub 808", key: "C", color: "from-violet-700 to-purple-900", type: "sub", baseFreq: 55 },
];

export default function MusicPadSection() {
  const [activePad, setActivePad] = useState(-1);
  const ctxRef = useRef<AudioContext | null>(null);
  const noiseBufferRef = useRef<AudioBuffer | null>(null);

  const getContext = () => {
    if (!ctxRef.current) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
      ctxRef.current = new AudioContextClass();
    }
    if (ctxRef.current.state === 'suspended') {
      ctxRef.current.resume();
    }
    return ctxRef.current;
  };

  const getNoiseBuffer = (ctx: AudioContext) => {
    if (!noiseBufferRef.current) {
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      noiseBufferRef.current = buffer;
    }
    return noiseBufferRef.current;
  };

  const playKick = (ctx: AudioContext, baseFreq: number) => {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq * 3, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.5, now + 0.35);

    gain.gain.setValueAtTime(1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.4);

    // Attack click (transient)
    const clickOsc = ctx.createOscillator();
    const clickGain = ctx.createGain();
    clickOsc.type = 'square';
    clickOsc.frequency.setValueAtTime(baseFreq * 6, now);
    clickGain.gain.setValueAtTime(0.4, now);
    clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
    clickOsc.connect(clickGain);
    clickGain.connect(ctx.destination);
    clickOsc.start(now);
    clickOsc.stop(now + 0.03);
  };

  const playSnare = (ctx: AudioContext) => {
    const now = ctx.currentTime;

    // Noise body
    const noise = ctx.createBufferSource();
    noise.buffer = getNoiseBuffer(ctx);
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.value = 1800;
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.7, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(now);
    noise.stop(now + 0.2);

    // Tonal body (the "thump")
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(180, now);
    oscGain.gain.setValueAtTime(0.5, now);
    oscGain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.12);
  };

  const playHiHat = (ctx: AudioContext, decay = 0.08) => {
    const now = ctx.currentTime;
    const noise = ctx.createBufferSource();
    noise.buffer = getNoiseBuffer(ctx);

    const bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.value = 9000;

    const highpass = ctx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.value = 7000;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + decay);

    noise.connect(bandpass);
    bandpass.connect(highpass);
    highpass.connect(gain);
    gain.connect(ctx.destination);
    noise.start(now);
    noise.stop(now + decay);
  };

  const playTom = (ctx: AudioContext, baseFreq: number) => {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq * 1.5, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.7, now + 0.3);

    gain.gain.setValueAtTime(0.8, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.35);
  };

  const playCrash = (ctx: AudioContext) => {
    const now = ctx.currentTime;
    const noise = ctx.createBufferSource();
    noise.buffer = getNoiseBuffer(ctx);

    const highpass = ctx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.value = 4000;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

    noise.connect(highpass);
    highpass.connect(gain);
    gain.connect(ctx.destination);
    noise.start(now);
    noise.stop(now + 1.2);
  };

  const playPerc = (ctx: AudioContext, baseFreq: number) => {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq * 2, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.8, now + 0.15);

    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.18);
  };

  const playSub808 = (ctx: AudioContext, baseFreq: number) => {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq * 2, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq, now + 0.08);

    gain.gain.setValueAtTime(0.9, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.8);
  };

  const playSound = (pad: Pad) => {
    setActivePad(pad.id);
    setTimeout(() => setActivePad(-1), 150);

    try {
      const ctx = getContext();
      switch (pad.type) {
        case 'kick':
          playKick(ctx, pad.baseFreq);
          break;
        case 'snare':
          playSnare(ctx);
          break;
        case 'hihat':
          playHiHat(ctx);
          break;
        case 'tom':
          playTom(ctx, pad.baseFreq);
          break;
        case 'crash':
          playCrash(ctx);
          break;
        case 'perc':
          playPerc(ctx, pad.baseFreq);
          break;
        case 'sub':
          playSub808(ctx, pad.baseFreq);
          break;
      }
    } catch {
      // AudioContext desteklenmeyen durumlar için
    }
  };

  return (
    <section className="mx-auto w-full max-w-3xl p-4">
      <div className="grid grid-cols-3 gap-3">
        {pads.map((pad) => (
          <button
            key={pad.id}
            type="button"
            onClick={() => playSound(pad)}
            className={`rounded-xl bg-gradient-to-br ${pad.color} p-6 text-center text-white shadow-lg transition-transform ${
              activePad === pad.id ? "scale-95 brightness-125" : "hover:scale-[1.02]"
            }`}
            aria-label={`Play ${pad.name}`}
          >
            <span className="block text-lg font-bold">{pad.name}</span>
            <span className="mt-1 block text-sm font-semibold opacity-80">{pad.key}</span>
          </button>
        ))}
      </div>
    </section>
  );
}