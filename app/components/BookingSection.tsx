'use client';

import { CalendarDays, Clock, MapPin, ExternalLink } from 'lucide-react';

// ⚠️ Cal.com'da oluşturduğunuz etkinliğin açık adresini buraya yazın
const CAL_URL = 'https://cal.com/bateri-dersleri';
// Ders bilgilerini kendinize göre değiştirin
const LESSON_DETAILS = [
  { icon: Clock, label: 'Süre', value: '60 dakika' },
  { icon: MapPin, label: 'Yer', value: 'Yüz yüze ya da online' },
  { icon: CalendarDays, label: 'Takvim', value: 'Uygun gün ve saatleri seçerek randevu alın' },
];

export default function BookingSection() {
  return (
    <div className="bg-slate-900/60 p-6 md:p-8 rounded-3xl border border-slate-800">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="space-y-3 max-w-xl">
          <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <CalendarDays className="text-teal-400" size={24} /> Bateri Dersi Randevusu
          </h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Bateri, ritim ve perküsyon dersleri için uygun gün ve saati seçip randevu alabilirsiniz.
            Randevunuz onaylanınca e-posta ile bilgilendirilirsiniz.
          </p>
        </div>

        <a
          href={CAL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 inline-flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold px-6 py-3 rounded-xl transition text-sm"
        >
          Randevu Al <ExternalLink size={16} />
        </a>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mt-6">
        {LESSON_DETAILS.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-xs text-teal-400 font-medium mb-1">
                <Icon size={14} /> {item.label}
              </div>
              <p className="text-sm text-slate-300">{item.value}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}