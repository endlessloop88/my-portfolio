'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Play, Pause, Music, Minus, Plus } from 'lucide-react';

const LOOKAHEAD_MS = 25; // zamanlayıcı kaç ms'de bir kontrol eder
const SCHEDULE_AHEAD_S = 0.1; // kaç saniye sonrasına kadar vuruşları önceden planla
const MIN_BPM = 40;
const MAX_BPM = 240;
const BAR_OPTIONS = [2, 3, 4, 5, 6, 7];

// Belirli bir zamana tek bir "tık" sesi planlar (ses motorunun kendi saatiyle, kaymaz)
function scheduleClick(ctx: AudioContext, time: number, accent: boolean) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.value = accent ? 1600 : 1000;

  gain.gain.setValueAtTime(0.0001, time);
  gain.gain.exponentialRampToValueAtTime(accent ? 0.9 : 0.6, time + 0.002);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.06);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(time);
  osc.stop(time + 0.08);
}

export default function Metronome() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(120);
  const [beatsPerBar, setBeatsPerBar] = useState(4);
  const [currentBeat, setCurrentBeat] = useState(-1);

  const ctxRef = useRef<AudioContext | null>(null);
  const bpmRef = useRef(bpm);
  const beatsPerBarRef = useRef(beatsPerBar);
  const nextNoteTimeRef = useRef(0);
  const beatIndexRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const visualTimersRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());

  // Çalarken tempo/ölçü değişirse zamanlayıcı güncel değeri okusun
  useEffect(() => {
    bpmRef.current = bpm;
  }, [bpm]);
  useEffect(() => {
    beatsPerBarRef.current = beatsPerBar;
  }, [beatsPerBar]);

  // Küçük aralıklarla çalışıp, önümüzdeki 0.1 sn içindeki vuruşları sıraya koyar
  const scheduler = useCallback(() => {
    const ctx = ctxRef.current;
    if (!ctx) return;

    while (nextNoteTimeRef.current < ctx.currentTime + SCHEDULE_AHEAD_S) {
      const beat = beatIndexRef.current;
      const time = nextNoteTimeRef.current;

      scheduleClick(ctx, time, beat === 0);

      // Görsel göstergeyi sesle aynı ana denk getir
      const delayMs = Math.max(0, (time - ctx.currentTime) * 1000);
      const timer = setTimeout(() => {
        setCurrentBeat(beat);
        visualTimersRef.current.delete(timer);
      }, delayMs);
      visualTimersRef.current.add(timer);

      nextNoteTimeRef.current += 60 / bpmRef.current;
      beatIndexRef.current = (beat + 1) % beatsPerBarRef.current;
    }
  }, []);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    visualTimersRef.current.forEach((t) => clearTimeout(t));
    visualTimersRef.current.clear();
    setCurrentBeat(-1);
    setIsPlaying(false);
  }, []);

  const start = useCallback(() => {
    if (!ctxRef.current) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
      ctxRef.current = new AudioContextClass();
    }
    const ctx = ctxRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    beatIndexRef.current = 0;
    nextNoteTimeRef.current = ctx.currentTime + 0.05;
    intervalRef.current = setInterval(scheduler, LOOKAHEAD_MS);
    setIsPlaying(true);
  }, [scheduler]);

  // Bileşen sayfadan kalkarken her şeyi temizle
  useEffect(() => {
    const timers = visualTimersRef.current;
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      timers.forEach((t) => clearTimeout(t));
      timers.clear();
      ctxRef.current?.close();
      ctxRef.current = null;
    };
  }, []);

  const changeBpm = (value: number) => {
    setBpm(Math.min(MAX_BPM, Math.max(MIN_BPM, value)));
  };

  return (
    <div className="bg-slate-900/60 p-6 md:p-8 rounded-3xl border border-slate-800 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Music className="text-teal-400" size={24} /> İnteraktif Metronom
          </h3>
          <span className="text-xs bg-teal-500/10 text-teal-400 px-3 py-1 rounded-full border border-teal-500/30">
            Pratik Aracı
          </span>
        </div>
        <p className="text-xs text-slate-400 mb-6">
          Davul ve ritim çalışmalarım için kullandığım tempo alıştırma aracı. Tempoyu ve ölçüyü ayarlayıp
          başlatın; ilk vuruş daha tizdir.
        </p>
      </div>

      <div className="space-y-6 flex flex-col items-center">
        {/* Vuruş göstergeleri (ölçüdeki her vuruş için bir nokta) */}
        <div className="flex gap-3 h-8 items-center">
          {Array.from({ length: beatsPerBar }).map((_, i) => {
            const isActive = currentBeat === i;
            const isAccent = i === 0;
            return (
              <div
                key={i}
                className={`w-5 h-5 rounded-full border-2 transition-all duration-100 ${
                  isActive
                    ? isAccent
                      ? 'bg-teal-400 border-teal-200 scale-125 shadow-lg shadow-teal-500/40'
                      : 'bg-slate-100 border-slate-300 scale-125'
                    : isAccent
                    ? 'bg-slate-950 border-teal-500/60'
                    : 'bg-slate-950 border-slate-700'
                }`}
              />
            );
          })}
        </div>

        {/* BPM ve +/- butonları */}
        <div className="flex items-center gap-5">
          <button
            type="button"
            onClick={() => changeBpm(bpm - 1)}
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            aria-label="Tempoyu 1 azalt"
          >
            <Minus size={18} />
          </button>
          <div className="text-center min-w-[88px]">
            <span className="text-4xl font-extrabold text-slate-100">{bpm}</span>
            <span className="text-xs text-slate-400 block mt-1">BPM (Tempo)</span>
          </div>
          <button
            type="button"
            onClick={() => changeBpm(bpm + 1)}
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            aria-label="Tempoyu 1 artır"
          >
            <Plus size={18} />
          </button>
        </div>

        <div className="w-full space-y-2">
          <input
            type="range"
            min={MIN_BPM}
            max={MAX_BPM}
            value={bpm}
            onChange={(e) => changeBpm(Number(e.target.value))}
            className="w-full accent-teal-400 bg-slate-950 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>{MIN_BPM} BPM</span>
            <span>{Math.round((MIN_BPM + MAX_BPM) / 2)} BPM</span>
            <span>{MAX_BPM} BPM</span>
          </div>
        </div>

        {/* Ölçü (kaç vuruşta bir vurgu) */}
        <div className="w-full">
          <span className="text-[11px] text-slate-400 block mb-2 text-center">Ölçüdeki vuruş sayısı</span>
          <div className="flex justify-center gap-2">
            {BAR_OPTIONS.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setBeatsPerBar(n)}
                className={`w-9 h-9 rounded-lg text-sm font-semibold transition ${
                  beatsPerBar === n
                    ? 'bg-teal-500 text-slate-950'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => (isPlaying ? stop() : start())}
          className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition shadow-lg ${
            isPlaying
              ? 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/30'
              : 'bg-teal-500 hover:bg-teal-400 text-slate-950'
          }`}
        >
          {isPlaying ? (
            <>
              <Pause size={18} /> Durdur
            </>
          ) : (
            <>
              <Play size={18} /> Başlat
            </>
          )}
        </button>
      </div>
    </div>
  );
}