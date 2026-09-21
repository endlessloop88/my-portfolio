'use client';

import { ShieldCheck, Server, Database, Lock, ArrowUpRight } from 'lucide-react';

export default function BankingProjectCard() {
  return (
    <div className="bg-slate-900/60 p-6 md:p-8 rounded-3xl border border-slate-800 flex flex-col justify-between group hover:border-teal-500/40 transition">
      <div>
        <div className="flex justify-between items-start mb-4">
          <span className="text-xs bg-teal-500/10 text-teal-400 px-3 py-1 rounded-full border border-teal-500/30 font-medium">
            Fintech & Bankacılık Mimarisi
          </span>
          <span className="p-2 rounded-xl bg-slate-950 text-teal-400 border border-slate-800 group-hover:scale-110 transition">
            <ShieldCheck size={20} />
          </span>
        </div>

        <h3 className="text-xl font-bold text-slate-100 group-hover:text-teal-400 transition mb-2">
          Güvenli Bankacılık API & Ödeme Servisleri Entegrasyonu
        </h3>
        
        <p className="text-xs text-slate-400 leading-relaxed mb-6">
          Kurumsal bankacılık API standartlarına uygun, Spring Boot altyapısıyla geliştirilen; güvenli token yönetimi, işlem loglama ve yüksek performanslı işlem doğrulama modülü.
        </p>

        {/* Teknik Yetkinlik Rozetleri */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs text-slate-300">
            <Server size={14} className="text-teal-400" />
            <span>Spring Boot REST API</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs text-slate-300">
            <Lock size={14} className="text-teal-400" />
            <span>JWT & OAuth2 Güvenlik</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs text-slate-300">
            <Database size={14} className="text-teal-400" />
            <span>H2 / PostgreSQL DB</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs text-slate-300">
            <ShieldCheck size={14} className="text-teal-400" />
            <span>Transaction Management</span>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-800/80 flex justify-between items-center">
        <span className="text-[11px] text-slate-500 font-mono">Status: Production Ready</span>
        <a 
          href="https://github.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xs text-teal-400 hover:text-teal-300 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition"
        >
          GitHub Repo <ArrowUpRight size={14} />
        </a>
      </div>
    </div>
  );
}