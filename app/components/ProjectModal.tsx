'use client';

import { X, ExternalLink, Code, Layers } from 'lucide-react';

interface Project {
  title: string;
  tag: string;
  description: string;
  fullDetails: string;
  techs: string[];
  githubUrl?: string;
}

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 md:p-8 relative shadow-2xl">
        
        {/* Kapatma Butonu */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-100 bg-slate-800/50 hover:bg-slate-800 p-2 rounded-xl transition"
        >
          <X size={20} />
        </button>

        {/* Proje Başlığı ve Etiket */}
        <div className="flex items-center gap-3 mb-4">
          <span className="p-2.5 bg-teal-500/10 border border-teal-500/20 text-teal-400 rounded-xl">
            <Code size={24} />
          </span>
          <div>
            <span className="text-xs text-teal-400 font-medium">{project.tag}</span>
            <h3 className="text-2xl font-bold text-slate-100">{project.title}</h3>
          </div>
        </div>

        {/* Kısa Açıklama */}
        <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-6">
          {project.description}
        </p>

        {/* Detaylı Mimari / Özellik Açıklaması */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 mb-6 space-y-2">
          <h4 className="text-xs font-semibold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
            <Layers size={14} /> Mimari ve Detaylar
          </h4>
          <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
            {project.fullDetails}
          </p>
        </div>

        {/* Kullanılan Teknolojiler */}
        <div className="mb-8">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Kullanılan Teknolojiler</h4>
          <div className="flex flex-wrap gap-2">
            {project.techs.map((tech, index) => (
              <span key={index} className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-lg border border-slate-700/50">
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Alt Butonlar */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition"
          >
            Kapat
          </button>
          {project.githubUrl && (
            <a 
              href={project.githubUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-sm font-semibold transition"
            >
              GitHub'da İncele <ExternalLink size={16} />
            </a>
          )}
        </div>

      </div>
    </div>
  );
}