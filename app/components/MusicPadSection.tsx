'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

interface DrumPad {
  id: string;
  name: string;
  key: string;
  file: string; // public/sounds/savannah/ altındaki dosya adı
  color: string;
  chokes?: string[]; // bu pad çalınca susturulacak padlerin id'leri
}

const SOUND_DIR = '/sounds/savannah/';

const drumPads: DrumPad[] = [
  // Üst sıra: davullar ve hi-hat'ler
  { id: 'kick', name: 'Kick (22")', key: 'Q', file: 'kick.wav', color: 'from-amber-700 to-amber-900' },
  { id: 'snare', name: 'Snare', key: 'W', file: 'snare.wav', color: 'from-slate-600 to-slate-800' },
  { id: 'hihat', name: 'Hi-Hat', key: 'E', file: 'closed-hh.wav', color: 'from-yellow-600 to-amber-700', chokes: ['hihat-open'] },
  { id: 'hihat-open', name: 'Open Hi-Hat', key: 'Z', file: 'open-hh.wav', color: 'from-yellow-500 to-orange-600' },
  { id: 'tom1', name: 'Tom 1', key: 'R', file: 'rack-tom-1.wav', color: 'from-blue-700 to-blue-900' },
  { id: 'tom2', name: 'Tom 2', key: 'T', file: 'rack-tom-2.wav', color: 'from-emerald-700 to-emerald-900' },
  { id: 'floor-tom', name: 'Floor Tom', key: 'A', file: 'floor-tom.wav', color: 'from-purple-700 to-purple-900' },

  // Alt sıra: ziller
  { id: 'ride', name: 'Ride Zili', key: 'S', file: 'ride.wav', color: 'from-orange-600 to-amber-800' },
  { id: 'crash', name: 'Crash Zili', key: 'D', file: 'middle-crash.wav', color: 'from-pink-600 to-rose-700' },
  { id: 'crash-18', name: 'Crash 18" (Efekt)', key: 'F', file: 'china.wav', color: 'from-cyan-600 to-teal-800' },
  { id: 'splash', name: 'Splash Zili', key: 'G', file: 'splash.wav', color: 'from-fuchsia-600 to-purple-800' },
  { id: 'crash-left', name: 'Crash (Sol)', key: 'X', file: 'crash-left.wav', color: 'from-rose-600 to-red-800' },
  { id: 'crash-right', name: 'Crash (Sağ)', key: 'C', file: 'crash-right.wav', color: 'from-indigo-600 to-blue-800' },
  { id: 'bell', name: 'Bell', key: 'V', file: 'bell.wav', color: 'from-lime-600 to-green-800' },
];

interface ActiveVoice {
  source: AudioBufferSourceNode;
  gain: GainNode;
}

export default function MusicPadSection() {
  const [activePad, setActivePad] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const ctxRef = useRef<AudioContext | null>(null);
  const buffersRef = useRef<Map<string, AudioBuffer>>(new Map());
  const voicesRef = useRef<Map<string, ActiveVoice>>(new Map());

  const getContext = useCallback(() => {
    if (!ctxRef.current) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
      ctxRef.current = new AudioContextClass();
    }
    return ctxRef.current;
  }, []);

  // Sayfa açılınca tüm ses dosyalarını önceden yükle (gecikmesiz çalma için)
  useEffect(() => {
    let cancelled = false;

    const loadAll = async () => {
      try {
        const ctx = getContext();
        await Promise.all(
          drumPads.map(async (pad) => {
            const res = await fetch(SOUND_DIR + pad.file);
            if (!res.ok) throw new Error(`${pad.file} bulunamadı`);
            const data = await res.arrayBuffer();
            const buffer = await ctx.decodeAudioData(data);
            buffersRef.current.set(pad.id, buffer);
          })
        );
        if (!cancelled) setLoaded(true);
      } catch (e) {
        console.error('Ses dosyaları yüklenemedi:', e);
        if (!cancelled) setLoadError(true);
      }
    };

    loadAll();
    return () => {
      cancelled = true;
    };
  }, [getContext]);

  // Çalan bir sesi tıklama sesi çıkarmadan hızla kıs ve durdur
  const chokeVoice = useCallback((padId: string) => {
    const ctx = ctxRef.current;
    const voice = voicesRef.current.get(padId);
    if (!ctx || !voice) return;

    try {
      const now = ctx.currentTime;
      voice.gain.gain.cancelScheduledValues(now);
      voice.gain.gain.setValueAtTime(voice.gain.gain.value, now);
      voice.gain.gain.linearRampToValueAtTime(0, now + 0.04);
      voice.source.stop(now + 0.05);
    } catch {
      // ses zaten bitmiş olabilir
    }
    voicesRef.current.delete(padId);
  }, []);

  const playSound = useCallback(
    (pad: DrumPad) => {
      setActivePad(pad.id);
      setTimeout(() => setActivePad(null), 150);

      const buffer = buffersRef.current.get(pad.id);
      if (!buffer) return;

      try {
        const ctx = getContext();
        if (ctx.state === 'suspended') {
          ctx.resume();
        }

        // Hi-hat choke: kapalı hi-hat açık olanı susturur
        pad.chokes?.forEach((id) => chokeVoice(id));

        const source = ctx.createBufferSource();
        const gain = ctx.createGain();
        source.buffer = buffer;
        source.connect(gain);
        gain.connect(ctx.destination);
        source.start();

        voicesRef.current.set(pad.id, { source, gain });
        source.onended = () => {
          if (voicesRef.current.get(pad.id)?.source === source) {
            voicesRef.current.delete(pad.id);
          }
        };
      } catch (e) {
        console.error('Ses çalınamadı:', e);
      }
    },
    [getContext, chokeVoice]
  );

  // Klavye: Q W E Z R T A / S D F G X C V
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat || e.metaKey || e.ctrlKey || e.altKey) return;

      // Formlara yazarken pedler çalmasın
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }

      const found = drumPads.find((p) => p.key.toLowerCase() === e.key.toLowerCase());
      if (found) {
        playSound(found);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playSound]);

  return (
    <section className="mx-auto w-full max-w-4xl p-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {drumPads.map((pad) => (
          <button
            key={pad.id}
            type="button"
            onClick={() => playSound(pad)}
            disabled={!loaded}
            className={`rounded-xl bg-gradient-to-br ${pad.color} p-4 text-center text-white shadow-lg transition-transform disabled:opacity-50 ${
              activePad === pad.id ? 'scale-95 brightness-125' : 'hover:scale-[1.02]'
            }`}
            aria-label={`Play ${pad.name}`}
          >
            <span className="block text-sm font-bold leading-tight">{pad.name}</span>
            <span className="mt-1 block text-xs font-semibold opacity-80">{pad.key}</span>
          </button>
        ))}
      </div>

      <p className="mt-4 text-center text-xs text-slate-400">
        {loadError
          ? 'Ses dosyaları yüklenemedi. public/sounds/savannah klasörünü kontrol edin.'
          : loaded
          ? 'Klavyeden de çalabilirsiniz: Q W E Z R T A / S D F G X C V'
          : 'Sesler yükleniyor...'}
      </p>
    </section>
  );
}