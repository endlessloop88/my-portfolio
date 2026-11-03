import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import { ArrowLeft, Hand, Info, Keyboard, Plug } from 'lucide-react';
import CoachPwa from '../components/CoachPwa';
import DrumCoach from '../components/DrumCoach';

export const metadata: Metadata = {
  title: 'Ritim Koçu | Yunus İlgün',
  description:
    'Tıkla birlikte çal, vuruşlarının zamanlamasını milisaniye cinsinden gör. Klavye, dokunma ya da USB MIDI pad ile çalışır.',
  manifest: '/coach.webmanifest',
  icons: {
    icon: [
      { url: '/coach-icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/coach-icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/coach-icon-180.png',
  },
  appleWebApp: { capable: true, title: 'Ritim Koçu', statusBarStyle: 'black-translucent' },
};

export const viewport: Viewport = {
  themeColor: '#020617',
};

export default function CoachPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-teal-400 hover:underline">
          <ArrowLeft size={16} /> Siteye dön
        </Link>

        <header className="space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-100">Ritim Koçu</h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            Davulcu ve yazılımcı olarak kendi çalışmam için yaptığım bir zamanlama antrenörü. Tık çalar,
            vuruşlarının vuruştan ne kadar uzakta düştüğünü milisaniye cinsinden gösterir.
          </p>
        </header>

        <DrumCoach />

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-100">Telefona uygulama olarak yükle</h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Koç bir web uygulaması (PWA): yükleyince ana ekranında kendi simgesiyle açılır ve bir kez
            açtıktan sonra internet olmadan da çalışır.
          </p>
          <CoachPwa />
          <ul className="space-y-1 text-xs text-slate-400 list-disc list-inside">
            <li>Android (Chrome): menü, &quot;Uygulamayı yükle&quot; ya da &quot;Ana ekrana ekle&quot;.</li>
            <li>iPhone (Safari): Paylaş düğmesi, &quot;Ana Ekrana Ekle&quot;. iPhone&apos;da MIDI pad desteklenmez.</li>
            <li>Bilgisayar (Chrome/Edge): adres çubuğundaki yükleme simgesi.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-100">Nasıl kullanılır</h2>
          <ol className="space-y-2 text-sm text-slate-300 list-decimal list-inside">
            <li>Tempoyu seçip <strong>Başlat</strong>&apos;a bas. İlk ölçü sayımdır, puanlanmaz.</li>
            <li>
              Tıkla birlikte çal: boşluk tuşu ya da pad tuşları (Q W E Z R T A S D F G X C V), vuruş alanına
              tıklama/dokunma ya da USB MIDI pad.
            </li>
            <li>
              Sapmanı izle: eksi değer erken, artı değer geç demek. <strong>Sessiz ölçü</strong> modunda tık
              kesilir, tempoyu kendin tutarsın ve araç tıklı ile tıksız zamanlamanı karşılaştırır.
            </li>
          </ol>
          <div className="flex flex-wrap gap-3 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1.5 bg-slate-900/60 border border-slate-800 rounded-full px-3 py-1">
              <Keyboard size={13} className="text-teal-400" /> Klavye
            </span>
            <span className="inline-flex items-center gap-1.5 bg-slate-900/60 border border-slate-800 rounded-full px-3 py-1">
              <Hand size={13} className="text-teal-400" /> Dokunma / fare
            </span>
            <span className="inline-flex items-center gap-1.5 bg-slate-900/60 border border-slate-800 rounded-full px-3 py-1">
              <Plug size={13} className="text-teal-400" /> USB MIDI pad
            </span>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-100">MIDI pad bağlama</h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Pad&apos;i USB kablosuyla bilgisayarın USB portuna bağla (pad&apos;in bilgisayar ya da MIDI USB portu),
            pad&apos;i aç, <strong>MIDI pad bağla</strong> düğmesine bas ve tarayıcı izin isteyince onayla.
            Düğmenin yanında &quot;MIDI hazır&quot; yazmalı. MIDI desteği Chrome ve Edge&apos;de çalışır, Safari
            desteklemez. Bluetooth yerine kablolu kulaklık kullan, Bluetooth ses gecikmesi ekler.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Info size={18} className="text-teal-400" /> Bilmen gerekenler
          </h2>
          <ul className="space-y-2 text-sm text-slate-400 list-disc list-inside">
            <li>
              Ölçümler yaklaşıktır: her cihaz kendi ses ve giriş gecikmesini ekler. Hep aynı yönde sabit bir
              kayma görürsen <strong>gecikme düzeltmesi</strong> kaydırıcısıyla sıfırla.
            </li>
            <li>±20 ms mükemmel, ±40 ms iyi, ±70 ms orta eşikleri benim seçtiğim ölçüttür, bir standart değildir.</li>
            <li>
              Her şey tarayıcında çalışır. Vuruşların kaydedilmez ve hiçbir yere gönderilmez, sayfayı
              kapatınca istatistikler silinir.
            </li>
            <li>Telefonda dokunma gecikmesi cihaza göre değişir, en güvenilir ölçüm MIDI pad iledir.</li>
          </ul>
        </section>

        <footer className="pt-4 border-t border-slate-800 text-xs text-slate-500">
          Yunus İlgün ·{' '}
          <Link href="/" className="text-teal-400 hover:underline">
            yunusilgun.com
          </Link>{' '}
          ·{' '}
          <Link href="/gizlilik" className="text-teal-400 hover:underline">
            Gizlilik
          </Link>
        </footer>
      </div>
    </main>
  );
}
