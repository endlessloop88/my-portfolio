'use client';

import { useEffect, useState } from 'react';
import { PlaySquare, Film, X, ExternalLink } from 'lucide-react';

interface FeedVideo {
  id: string;
  title: string;
  published: string;
}

const CHANNEL_URL = 'https://www.youtube.com/channel/UC0EiA0n-wC5u_q9J8mmD-ag';

function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function VideoSection() {
  const [videos, setVideos] = useState<FeedVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState<FeedVideo | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch('/api/videos')
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setVideos(Array.isArray(data.videos) ? data.videos : []);
      })
      .catch(() => {
        if (!cancelled) setVideos([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="bg-slate-900/60 p-6 md:p-8 rounded-3xl border border-slate-800">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Film className="text-teal-400" size={24} /> Video Galerisi & Performanslar
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            YouTube kanalımdaki en son videolar. Yeni yüklediklerim burada kendiliğinden görünür.
          </p>
        </div>
        <a
          href={CHANNEL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs font-semibold bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 px-4 py-2 rounded-xl border border-teal-500/30 transition"
        >
          YouTube Kanalım <ExternalLink size={14} />
        </a>
      </div>

      {loading && <p className="text-sm text-slate-400">Videolar yükleniyor...</p>}

      {!loading && videos.length === 0 && (
        <p className="text-sm text-slate-400">
          Videolar şu anda yüklenemedi. Tüm videolarımı YouTube kanalımdan izleyebilirsiniz.
        </p>
      )}

      {videos.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {videos.map((video) => (
            <button
              key={video.id}
              type="button"
              onClick={() => setActiveVideo(video)}
              className="text-left bg-slate-950 p-3 rounded-2xl border border-slate-800 hover:border-teal-500/50 transition group"
            >
              <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
                  alt={video.title}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-teal-500/90 text-slate-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                    <PlaySquare size={24} />
                  </div>
                </div>
              </div>
              <h4 className="mt-3 text-sm font-bold text-slate-200 group-hover:text-teal-400 transition line-clamp-2">
                {video.title}
              </h4>
              {video.published && (
                <p className="text-[11px] text-slate-500 mt-1">{formatDate(video.published)}</p>
              )}
            </button>
          ))}
        </div>
      )}

      {activeVideo && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-3xl rounded-3xl p-6 relative shadow-2xl space-y-4">
            <div className="flex justify-between items-start gap-4 border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-slate-100">{activeVideo.title}</h3>
              <button
                type="button"
                onClick={() => setActiveVideo(null)}
                className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition shrink-0"
                aria-label="Kapat"
              >
                <X size={18} />
              </button>
            </div>

            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
              <iframe
                src={`https://www.youtube.com/embed/${activeVideo.id}?autoplay=1`}
                title={activeVideo.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="flex justify-end">
              <a
                href={CHANNEL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-teal-400 hover:underline flex items-center gap-1 font-medium"
              >
                Tüm videolar için kanalıma git <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
