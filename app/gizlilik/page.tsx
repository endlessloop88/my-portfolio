import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

const CONTACT_EMAIL = 'ilguny929@gmail.com';
const LAST_UPDATED = '3 Kasım 2026';

export const metadata: Metadata = {
  title: 'Gizlilik Politikası ve KVKK Aydınlatma Metni | Yunus İlgün',
  description:
    'yunusilgun.com üzerinde hangi kişisel verilerin, hangi amaçla ve hangi hukuki sebeple işlendiği; haklarınız ve başvuru yöntemi.',
};

interface Activity {
  title: string;
  data: string;
  purpose: string;
  basis: string;
  method: string;
  recipients: string;
}

const ACTIVITIES: Activity[] = [
  {
    title: 'Üyelik (Üye Ol ve Giriş Yap)',
    data: 'Ad, soyad, e-posta adresi ve şifre. Şifre düz metin olarak saklanmaz; kimlik doğrulama hizmeti tarafından şifrelenmiş (özetlenmiş) biçimde tutulur.',
    purpose:
      'Üyelik hesabının oluşturulması ve yönetilmesi, giriş yapılması, şifre sıfırlama e-postalarının gönderilmesi, hesap güvenliğinin sağlanması.',
    basis:
      'KVKK m.5/2-c (bir sözleşmenin kurulması veya ifasıyla doğrudan ilgili olması) ve m.5/2-f (ilgili kişinin temel hak ve özgürlüklerine zarar vermemek kaydıyla veri sorumlusunun meşru menfaati).',
    method: 'Sitedeki üyelik formu üzerinden, elektronik ortamda ve otomatik yolla toplanır.',
    recipients:
      'Supabase (veritabanı ve kimlik doğrulama hizmeti), Resend (şifre sıfırlama e-postalarının gönderimi). Yönetici hesabı, üyelerin ad, soyad ve e-posta bilgilerini yönetim paneli üzerinden görebilir.',
  },
  {
    title: 'İletişim ve yorum formu',
    data: 'Ad, e-posta adresi (isteğe bağlı) ve mesaj içeriği.',
    purpose: 'Mesajınızı almak ve size yanıt verebilmek.',
    basis: 'KVKK m.5/2-f (veri sorumlusunun meşru menfaati). Mesajı kendi isteğinizle iletirsiniz.',
    method: 'Sitedeki form üzerinden, elektronik ortamda toplanır.',
    recipients:
      'Mesajınız e-posta olarak veri sorumlusuna iletilir (gönderim: Resend, alıcı posta kutusu: Google Gmail). Mesajlar sitenin veritabanında saklanmaz.',
  },
  {
    title: 'Ders kaydı',
    data: 'Ders kaydı Cal.com üzerinden yapılır. Orada girdiğiniz bilgiler (ad, e-posta, tarih seçimi gibi) Cal.com tarafından işlenir.',
    purpose: 'Özel bateri dersi talebinin alınması ve planlanması.',
    basis: 'Cal.com kendi politikası kapsamında ayrıca veri sorumlusudur; veri sorumlusu olarak yalnızca ders talebi sürecinde bize iletilen bilgileri işleriz (KVKK m.5/2-c).',
    method: 'Cal.com randevu sayfası üzerinden.',
    recipients: 'Cal.com. Ayrıntılar için Cal.com gizlilik politikasına bakınız.',
  },
  {
    title: 'Video galerisi (YouTube)',
    data: 'Bir videoyu açtığınızda tarayıcınız YouTube oynatıcısını yükler.',
    purpose: 'Videoların site içinde izlenebilmesi.',
    basis: 'Video izleme isteğiniz üzerine yapılır (KVKK m.5/2-f).',
    method: 'Videoyu açtığınızda tarayıcınız doğrudan YouTube ile bağlantı kurar.',
    recipients:
      'Google (YouTube). Bu sırada Google kendi gizlilik politikası ve çerez uygulamaları kapsamında veri işleyebilir.',
  },
  {
    title: 'Reklamlar (Google AdSense)',
    data: 'Ana sayfada reklam gösterilirse Google ve iş ortakları, çerezler ve benzeri teknolojilerle IP adresi, tarayıcı ve cihaz bilgisi ile sayfa kullanımınıza ilişkin verileri işleyebilir.',
    purpose: 'Reklamların gösterilmesi, ölçülmesi ve kişiselleştirilmesi; geçersiz tıklamaların ve kötüye kullanımın önlenmesi.',
    basis:
      "Reklam çerezleri için onayınız aranır: Avrupa Ekonomik Alanı, Birleşik Krallık ve İsviçre'den ziyaret edenlere Google'ın onay mesajı gösterilir. Reklam kişiselleştirmeyi Google Reklam Ayarları'ndan kapatabilirsiniz.",
    method:
      'Ana sayfa yüklendiğinde tarayıcınız Google ile bağlantı kurar. Ritim Koçu, gizlilik, üyelik ve yönetim sayfalarında Google reklam betiği yüklenmez.',
    recipients: "Google (AdSense) ve Google'ın reklam iş ortakları.",
  },
  {
    title: 'Barındırma ve güvenlik kayıtları',
    data: 'IP adresi, tarayıcı ve cihaz bilgisi, istek zamanı ve adresi gibi teknik kayıtlar.',
    purpose: 'Sitenin sunulması, hata ayıklama ve güvenliğin sağlanması.',
    basis: 'KVKK m.5/2-f (meşru menfaat).',
    method: 'Siteyi ziyaret ettiğinizde sunucu tarafından otomatik olarak oluşur.',
    recipients: 'Vercel (barındırma sağlayıcısı).',
  },
  {
    title: 'Ritim Koçu',
    data: 'Hiçbir kişisel veri toplanmaz. Vuruş zamanları, sapma değerleri ve istatistikler yalnızca tarayıcınızın belleğinde tutulur, sayfayı kapatınca silinir.',
    purpose: 'Zamanlama ölçümünün size gösterilmesi.',
    basis: 'Veri toplanmadığı için işleme yoktur.',
    method:
      'Ses ve MIDI işlemleri tarayıcınızda çalışır. Mikrofon kullanılmaz. MIDI için izin yalnızca MIDI cihazlarına erişim içindir ve hiçbir yere gönderilmez. Uygulama olarak yüklerseniz sayfa dosyaları cihazınızda önbelleğe alınır.',
    recipients: 'Yok.',
  },
];

const TOC = [
  { id: 'veri-sorumlusu', label: 'Veri sorumlusu' },
  { id: 'veriler', label: 'İşlenen veriler, amaçlar ve hukuki sebepler' },
  { id: 'aktarim', label: 'Yurt dışına aktarım' },
  { id: 'saklama', label: 'Saklama süresi' },
  { id: 'guvenlik', label: 'Güvenlik' },
  { id: 'cerezler', label: 'Çerezler ve tarayıcı depolama' },
  { id: 'haklar', label: 'Haklarınız ve başvuru' },
  { id: 'guncellemeler', label: 'Bu metindeki değişiklikler' },
  { id: 'english', label: 'English summary' },
];

const SUMMARY = [
  'Üye olursanız ad, soyad, e-posta ve şifreniz (şifreli olarak) saklanır. İletişim formuna yazdıklarınız yalnızca e-posta ile iletilir, sitenin veritabanında tutulmaz.',
  'Ritim Koçu hiçbir kişisel veri toplamaz: vuruşlarınız yalnızca tarayıcınızda kalır, mikrofon kullanılmaz.',
  "Verileriniz satılmaz. Ana sayfada Google AdSense reklamları gösterilebilir ve Google reklam çerezleri kullanabilir (Avrupa'dan gelen ziyaretçilerden önce onay istenir); Ritim Koçu ve diğer sayfalarda reklam betiği yüklenmez.",
  'Verileriniz Supabase, Vercel, Resend, Google ve Cal.com gibi hizmet sağlayıcılarda işlenir; bunların bir kısmının sunucuları yurt dışındadır.',
  'İstediğiniz zaman erişim, düzeltme veya silme talep edebilirsiniz (aşağıdaki hazır e-posta düğmesiyle).',
];

const APPLICATION_MAIL = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('KVKK başvurusu')}&body=${encodeURIComponent(
  'Ad Soyad:\nÜyelikte kullandığım e-posta adresi:\nTalebim (erişim / düzeltme / silme / diğer):\n',
)}`;

const RIGHTS = [
  'Kişisel verilerinizin işlenip işlenmediğini öğrenme',
  'İşlenmişse buna ilişkin bilgi talep etme',
  'İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme',
  'Yurt içinde veya yurt dışında verilerin aktarıldığı üçüncü kişileri bilme',
  'Eksik veya yanlış işlenmişse düzeltilmesini isteme',
  'KVKK m.7 kapsamında silinmesini veya yok edilmesini isteme',
  'Düzeltme ve silme işlemlerinin verilerin aktarıldığı üçüncü kişilere bildirilmesini isteme',
  'Verilerin yalnızca otomatik sistemlerle analiz edilmesi sonucu aleyhinize bir sonuç çıkmasına itiraz etme',
  'Kanuna aykırı işleme nedeniyle zarara uğramanız hâlinde zararın giderilmesini talep etme',
];

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="space-y-3 scroll-mt-6">
      <h2 className="text-lg font-bold text-slate-100">{title}</h2>
      <div className="space-y-3 text-sm text-slate-300 leading-relaxed">{children}</div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="text-sm text-slate-300 leading-relaxed">{value}</dd>
    </div>
  );
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-10">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-teal-400 hover:underline">
          <ArrowLeft size={16} /> Siteye dön
        </Link>

        <header className="space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-100 flex items-center gap-3">
            <ShieldCheck className="text-teal-400" size={30} /> Gizlilik Politikası ve KVKK Aydınlatma Metni
          </h1>
          <p className="text-xs text-slate-500">Son güncelleme: {LAST_UPDATED} · English summary below</p>
          <p className="text-sm text-slate-400 leading-relaxed">
            Bu metin, 6698 sayılı Kişisel Verilerin Korunması Kanunu&apos;nun (KVKK) 10. maddesi uyarınca
            yunusilgun.com sitesinde kişisel verilerinizin nasıl işlendiğini anlatır.
          </p>
        </header>

        <section className="bg-teal-500/5 border border-teal-500/30 rounded-2xl p-5 space-y-3">
          <h2 className="text-base font-bold text-teal-300">Kısaca</h2>
          <ul className="space-y-2 text-sm text-slate-300 leading-relaxed list-disc list-inside">
            {SUMMARY.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <nav aria-label="İçindekiler" className="space-y-2">
          <h2 className="text-sm font-bold text-slate-200">İçindekiler</h2>
          <ol className="grid sm:grid-cols-2 gap-x-6 gap-y-1 text-sm list-decimal list-inside text-slate-400">
            {TOC.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} className="hover:text-teal-400 transition">
                  {item.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <Section id="veri-sorumlusu" title="1. Veri sorumlusu">
          <p>
            Veri sorumlusu Yunus İlgün&apos;dür (kişisel web sitesi). İletişim:{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-teal-400 hover:underline">
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </Section>

        <section id="veriler" className="space-y-4 scroll-mt-6">
          <h2 className="text-lg font-bold text-slate-100">2. İşlenen veriler, amaçlar ve hukuki sebepler</h2>
          <div className="space-y-4">
            {ACTIVITIES.map((activity) => (
              <article key={activity.title} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
                <h3 className="text-base font-bold text-teal-300">{activity.title}</h3>
                <dl className="space-y-3">
                  <Row label="İşlenen veriler" value={activity.data} />
                  <Row label="İşleme amacı" value={activity.purpose} />
                  <Row label="Hukuki sebep" value={activity.basis} />
                  <Row label="Toplama yöntemi" value={activity.method} />
                  <Row label="Aktarım yapılan taraflar" value={activity.recipients} />
                </dl>
              </article>
            ))}
          </div>
        </section>

        <Section id="aktarim" title="3. Yurt dışına aktarım">
          <p>
            Kullandığımız hizmet sağlayıcıların (Supabase, Vercel, Resend, Google ve Cal.com) sunucuları yurt dışında
            bulunabilir. Bu nedenle verileriniz yurt dışına aktarılmış olabilir. Aktarımlar, KVKK m.9&apos;da
            düzenlenen şartlar çerçevesinde ve hizmet sağlayıcıların sunduğu sözleşmesel ve teknik güvencelerle
            yapılır.
          </p>
        </Section>

        <Section id="saklama" title="4. Saklama süresi">
          <ul className="list-disc list-inside space-y-1">
            <li>Üyelik verileri, üyeliğiniz devam ettiği sürece saklanır; silme talebiniz üzerine silinir.</li>
            <li>İletişim mesajları, talebinizin gerektirdiği süre boyunca saklanır; talebiniz üzerine silinir.</li>
            <li>Teknik sunucu kayıtları, hizmet sağlayıcının kendi saklama süreleri kapsamında tutulur.</li>
          </ul>
        </Section>

        <Section id="guvenlik" title="5. Güvenlik">
          <p>
            Site HTTPS ile sunulur. Üyelik verileri, her üyenin yalnızca kendi kaydına erişebileceği veritabanı
            kurallarıyla korunur; üye listesine yalnızca yönetici hesabı erişir. Hiçbir sistem tamamen risksiz
            olmadığından mutlak güvenlik garantisi verilemez.
          </p>
        </Section>

        <Section id="cerezler" title="6. Çerezler ve tarayıcı depolama">
          <p>
            Ana sayfada Google AdSense reklamları gösterilebilir; bu durumda Google ve iş ortakları reklam çerezleri
            kullanabilir. Ritim Koçu, gizlilik, üyelik ve yönetim sayfalarında reklam çerezi kullanılmaz. Üye olarak
            giriş yaptığınızda oturumunuzu sürdürmek için, ve tema tercihi gibi ayarlarınızı hatırlamak için
            tarayıcınızın yerel depolaması kullanılabilir. YouTube videolarını açtığınızda Google kendi çerezlerini
            kullanabilir.
          </p>
          <p>
            Google&apos;ın reklam çerezlerini nasıl kullandığını{' '}
            <a
              href="https://policies.google.com/technologies/ads"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-400 hover:underline"
            >
              buradan
            </a>{' '}
            öğrenebilir, reklam kişiselleştirmeyi{' '}
            <a
              href="https://adssettings.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-400 hover:underline"
            >
              Google Reklam Ayarları
            </a>
            &apos;ndan yönetebilirsiniz.
          </p>
        </Section>

        <section id="haklar" className="space-y-3 scroll-mt-6">
          <h2 className="text-lg font-bold text-slate-100">7. Haklarınız (KVKK m.11)</h2>
          <p className="text-sm text-slate-300">Veri sorumlusuna başvurarak şunları talep edebilirsiniz:</p>
          <ul className="list-disc list-inside space-y-1 text-sm text-slate-300">
            {RIGHTS.map((right) => (
              <li key={right}>{right}</li>
            ))}
          </ul>
          <p className="text-sm text-slate-300 leading-relaxed">
            Başvurunuzu{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-teal-400 hover:underline">
              {CONTACT_EMAIL}
            </a>{' '}
            adresine e-posta ile iletebilirsiniz. Kimliğinizi doğrulayabilmek için adınızı, soyadınızı ve varsa
            üyelikte kullandığınız e-posta adresini yazın. Başvurular, talebin niteliğine göre en geç otuz gün içinde
            ücretsiz olarak sonuçlandırılır. Yanıttan memnun kalmazsanız Kişisel Verileri Koruma Kurulu&apos;na şikâyet
            hakkınız saklıdır.
          </p>
          <a
            href={APPLICATION_MAIL}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-sm font-semibold transition"
          >
            Başvuru e-postası aç
          </a>
        </section>

        <Section id="guncellemeler" title="8. Bu metindeki değişiklikler">
          <p>
            Bu metin gerektiğinde güncellenebilir. Güncel sürüm her zaman bu sayfadadır; önemli değişikliklerde
            sayfanın üstündeki &quot;Son güncelleme&quot; tarihi yenilenir.
          </p>
        </Section>

        <section id="english" className="space-y-3 border-t border-slate-800 pt-8 scroll-mt-6">
          <h2 className="text-lg font-bold text-slate-100">English summary</h2>
          <div className="space-y-3 text-sm text-slate-300 leading-relaxed">
            <p>
              This is the personal website of Yunus İlgün (data controller). Contact:{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-teal-400 hover:underline">
                {CONTACT_EMAIL}
              </a>
              . Last updated: November 3, 2026.
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Membership:</strong> name, surname, email and password (stored hashed) to create and manage
                your account. Processed by Supabase; password reset emails are sent through Resend.
              </li>
              <li>
                <strong>Contact form:</strong> name, optional email and your message, delivered to my inbox by email
                (Resend, Gmail). Messages are not stored in the website database.
              </li>
              <li>
                <strong>Lesson booking:</strong> handled by Cal.com under its own privacy policy.
              </li>
              <li>
                <strong>Videos:</strong> playing a YouTube video loads Google&apos;s player.
              </li>
              <li>
                <strong>Hosting:</strong> Vercel processes technical logs (IP address, browser, request time) to serve
                and secure the site.
              </li>
              <li>
                <strong>Rhythm Coach (/coach):</strong> collects no personal data. Timing data stays in your browser
                memory and is cleared when you close the page. No microphone is used, and MIDI input is never sent
                anywhere.
              </li>
              <li>
                <strong>Ads:</strong> Google AdSense ads may be shown on the home page, and Google and its partners may
                use advertising cookies there. Visitors from the EEA, UK and Switzerland are asked for consent through
                Google&apos;s consent message. The Rhythm Coach, privacy, member and admin pages load no advertising
                script.
              </li>
            </ul>
            <p>
              Some of these providers run servers outside Turkey, so data may be transferred abroad. You can ask to
              access, correct or delete your data by emailing the address above.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
