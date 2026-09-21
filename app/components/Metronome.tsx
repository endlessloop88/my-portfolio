'use client';

import { useState, useEffect, useRef } from 'react';
import { Disc, Play, Square, Music } from 'lucide-react';

export default function Metronome() {
  const [bpm, setBpm] = useState<number>(120);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [beatCount, setBeatCount] = useState<number>(0);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Web Audio API ile tıklama sesi üretme
  const playClick = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const envelope = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, audioCtx.currentTime); // Vuruş frekansı

      envelope.gain.setValueAtTime(1, audioCtx.currentTime);
      envelope.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);

      osc.connect(envelope);
      envelope.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.05);
    } catch {
      // Ses bağlamı desteklenmiyorsa hata yoksayılır
    }
  };

  useEffect(() => {
    if (isPlaying) {
      const interval = (60 / bpm) * 1000;
      timerRef.current = setInterval(() => {
        playClick();
        setBeatCount((prev) => (prev % 4) + 1);
      }, interval);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setBeatCount(0);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, bpm]);

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="bg-slate-900/60 p-6 md:p-8 rounded-3xl border border-slate-800">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Disc className="text-teal-400 animate-spin-slow" size={24} /> Davul & Ritim Metronomu (BPM)
          </h3>
          <p className="text-xs text-slate-400 mt-1">Öğrencilerim ve pratik seanslarım için interaktif tempo aracı.</p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 px-4 py-2 rounded-2xl border border-slate-800">
          <Music size={16} className="text-teal-400" />
          <span className="text-xs text-slate-300 font-medium">Tempo: <strong className="text-teal-400">{bpm} BPM</strong></span>
        </div>
      </div>

      <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex flex-col items-center gap-6">
        {/* Vuruş Gösterge Lambaları */}
        <div className="flex gap-4">
          {[1, 2, 3, 4].map((beat) => (
            <div 
              key={beat}
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-150 ${
                isPlaying && beatCount === beat 
                  ? 'bg-teal-400 text-slate-950 scale-110 shadow-lg shadow-teal-500/50' 
                  : 'bg-slate-900 text-slate-500 border border-slate-800'
              }`}
            >
              {beat}
            </div>
          ))}
        </div>

        {/* Slider Ayarı */}
        <div className="w-full max-w-md space-y-2">
          <div className="flex justify-between text-xs text-slate-400">
            <span>60 BPM (Yavaş)</span>
            <span>120 BPM (Orta)</span>
            <span>180 BPM (Hızlı)</span>
          </div>
          <input 
            type="range" 
            min="40" 
            max="220" 
            value={bpm}
            onChange={(e) => setBpm(Number(e.target.value))}
            className="w-full accent-teal-400 bg-slate-900 cursor-pointer h-2 rounded-lg"
          />
        </div>

        {/* Kontrol Butonu */}
        <button
          onClick={handleTogglePlay}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition shadow-lg ${
            isPlaying 
              ? 'bg-red-500 hover:bg-red-400 text-slate-950 shadow-red-500/10' 
              : 'bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-teal-500/10'
          }`}
        >
          {isPlaying ? <Square size={16} /> : <Play size={16} />}
          {isPlaying ? 'Metronomu Durdur' : 'Metronomu Başlat'}
        </button>
      </div>
    </div>
  );
}