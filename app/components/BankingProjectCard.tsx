export default function BankingProjectCard() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-teal-500/50 transition duration-300 group">
      <div>
        <div className="flex justify-between items-start mb-4">
          <span className="text-xs font-mono px-3 py-1 bg-teal-500/10 text-teal-400 rounded-full border border-teal-500/20">
            Fintech / E-Commerce Architecture
          </span>
          <span className="text-xs text-slate-500 font-mono">Spring Boot & API</span>
        </div>
        
        <h3 className="text-xl font-bold text-slate-100 group-hover:text-teal-400 transition mb-2">
          Patent Ajanı & Bankacılık API Entegrasyonları
        </h3>
        
        <p className="text-sm text-slate-400 mb-6">
          15 yıllık e-commerce ve kurumsal mimari tecrübesiyle geliştirilmiş, güvenli ödeme sistemleri ve finansal veri akışlarını yöneten Spring Boot tabanlı servis altyapısı.
        </p>

        <div className="grid grid-cols-2 gap-3 mb-6 text-xs font-mono text-slate-300">
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-400"></span>
            <span>RESTful Endpoints</span>
          </div>
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-400"></span>
            <span>JWT & OAuth2 Güvenlik</span>
          </div>
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-400"></span>
            <span>H2 / PostgreSQL DB</span>
          </div>
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-400"></span>
            <span>Transaction Management</span>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
        <span className="text-[11px] text-slate-500 font-mono">Status: Production Ready</span>
        <a 
          href="https://github.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xs text-teal-400 hover:text-teal-300 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition"
        >
          GitHub Repo &rarr;
        </a>
      </div>
    </div>
  );
}