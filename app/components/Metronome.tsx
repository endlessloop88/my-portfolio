'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Music } from 'lucide-react';

export default function Metronome() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(120);
  const [beat, setBeat] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying) {
      const interval = (60 / bpm) * 1000;
      timerRef.current = setInterval(() => {
        setBeat(prev => !prev);
      }, interval);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setBeat(false);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, bpm]);

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
          Davul ve ritim çalışmalarım için kullandığım tempo alıştırma aracı. Temponuzu buradan test edebilirsiniz.
        </p>
      </div>

      <div className="space-y-6 flex flex-col items-center">
        {/* Görsel Vuruş Göstergesi */}
        <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all duration-150 ${
          beat ? 'bg-teal-500 border-teal-300 scale-110 shadow-lg shadow-teal-500/30' : 'bg-slate-950 border-slate-800'
        }`}>
          <div className={`w-6 h-6 rounded-full ${beat ? 'bg-slate-950' : 'bg-slate-800'}`} />
        </div>

        <div className="text-center">
          <span className="text-4xl font-extrabold text-slate-100">{bpm}</span>
          <span className="text-xs text-slate-400 block mt-1">BPM (Tempo)</span>
        </div>

        <div className="w-full space-y-2">
          <input 
            type="range" 
            min="60" 
            max="200" 
            value={bpm} 
            onChange={(e) => setBpm(Number(e.target.value))}
            className="w-full accent-teal-400 bg-slate-950 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>60 BPM</span>
            <span>130 BPM</span>
            <span>200 BPM</span>
          </div>
        </div>

        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition shadow-lg ${
            isPlaying 
              ? 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/30' 
              : 'bg-teal-500 hover:bg-teal-400 text-slate-950'
          }`}
        >
          {isPlaying ? <><Pause size={18} /> Durdur</> : <><Play size={18} /> Başlat</>}
        </button>
      </div>
    </div>
  );
}