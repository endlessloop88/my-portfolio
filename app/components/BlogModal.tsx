'use client';

import { X, Calendar, Clock } from 'lucide-react';

interface BlogPost {
  title: string;
  date: string;
  description: string;
  readTime: string;
  content: string;
}

interface BlogModalProps {
  post: BlogPost | null;
  onClose: () => void;
}

export default function BlogModal({ post, onClose }: BlogModalProps) {
  if (!post) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 md:p-8 relative shadow-2xl">
        
        {/* Kapatma Butonu */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-teal-400 bg-slate-800/50 p-2 rounded-full transition"
        >
          <X size={20} />
        </button>

        {/* Başlık ve Meta Bilgiler */}
        <div className="space-y-3 mb-6 pr-8">
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1 text-teal-400 font-medium">
              <Calendar size={14} /> {post.date}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock size={14} /> {post.readTime}
            </span>
          </div>
          <h3 className="text-2xl md:text-3xl font-extrabold text-slate-100 leading-tight">
            {post.title}
          </h3>
        </div>

        {/* Blog İçeriği */}
        <div className="text-slate-300 text-sm md:text-base leading-relaxed space-y-4 border-t border-slate-800 pt-6 whitespace-pre-line">
          {post.content}
        </div>

        {/* Alt Kısım */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex justify-end">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold text-sm transition"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
}