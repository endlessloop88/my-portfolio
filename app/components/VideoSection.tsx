'use client';

import { useState } from 'react';
import { PlaySquare, Film, X } from 'lucide-react';

interface VideoItem {
  title: string;
  category: string;
  youtubeId: string;
  description: string;
}

const videosData: VideoItem[] = [
  {
    title: "El Yapımı Asma Davul & Ritim İcracılığı",
    category: "Müzik & Performans",
    youtubeId: "dQw4w9WgXcQ", // Örnek ID (Kendi YouTube video ID'niz ile değiştirebilirsiniz)
    description: "Ceviz gövdeli el yapımı asma davul ile geleneksel çırpı vuruşları ve ritim çalışması."
  },
  {
    title: "Spring Boot & E-Ticaret Entegrasyon Mimarisi",
    category: "Yazılım & Proje",
    youtubeId: "dQw4w9WgXcQ", // Örnek ID
    description: "Trendyol, Hepsiburada ve Amazon API'leri ile arka planda çalışan senkronizasyon mekanizmaları."
  }
];

export default function VideoSection() {
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);

  return (
    <div className="bg-slate-900/60 p-6 md:p-8 rounded-3xl border border-slate-800">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Film className="text-teal-400" size={24} /> Video Galerisi & Performanslar
          </h3>
          <p className="text-xs text-slate-400 mt-1">Sahne performanslarım, ders kesitlerim ve yazılım projelerimden videolar.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {videosData.map((video, index) => (
          <div 
            key={index}
            onClick={() => setActiveVideo(video)}
            className="bg-slate-950 p-4 rounded-2xl border border-slate-800 hover:border-teal-500/50 transition cursor-pointer flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center">
                {/* Küçük Önizleme / Poster Alanı */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent z-10" />
                <div className="absolute z-20 w-12 h-12 rounded-full bg-teal-500/90 text-slate-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                  <PlaySquare size={24} />
                </div>
                <span className="absolute bottom-3 left-3 z-20 text-[11px] bg-slate-900/80 text-teal-400 px-2.5 py-1 rounded-full border border-teal-500/30">
                  {video.category}
                </span>
              </div>
              
              <h4 className="font-bold text-slate-200 group-hover:text-teal-400 transition">{video.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{video.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Video Oynatma Modalı */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-3xl rounded-3xl p-6 relative shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <div>
                <span className="text-[11px] text-teal-400 font-medium">{activeVideo.category}</span>
                <h3 className="text-lg font-bold text-slate-100">{activeVideo.title}</h3>
              </div>
              <button 
                onClick={() => setActiveVideo(null)}
                className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              >
                <X size={18} />
              </button>
            </div>

            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
              <iframe
                src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1`}
                title={activeVideo.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <p className="text-xs text-slate-400">{activeVideo.description}</p>
          </div>
        </div>
      )}
    </div>
  );
}