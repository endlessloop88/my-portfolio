'use client';

import Image from 'next/image';
import { Mail, Terminal, Cpu, Code, Phone, GraduationCap, Briefcase, Calendar, MapPin, Music, User } from 'lucide-react';
import CommentForm from './components/CommentForm';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 px-6 py-12 md:px-24 flex flex-col justify-between">
      {/* Header Section */}
      <header className="flex justify-between items-center max-w-5xl mx-auto w-full pb-8 border-b border-slate-800">
        <h1 className="text-xl font-bold tracking-wider text-teal-400">&lt;YUNUS ILGUN /&gt;</h1>
        <nav className="flex gap-6 text-sm text-slate-400">
          <a href="#about" className="hover:text-teal-400 transition">Hakkımda</a>
          <a href="#experience" className="hover:text-teal-400 transition">Deneyim & Eğitim</a>
          <a href="#projects" className="hover:text-teal-400 transition">Projeler</a>
          <a href="#skills" className="hover:text-teal-400 transition">Yetenekler</a>
          <a href="#comments" className="hover:text-teal-400 transition">İletişim & Yorum</a>
        </nav>
      </header>

      {/* Hero Section */}
      <section id="about" className="max-w-5xl mx-auto w-full py-16 flex flex-col md:flex-row items-center md:items-start gap-10">
        
        {/* Profil Fotoğrafı Alanı */}
        <div className="relative w-44 h-44 md:w-56 md:h-56 rounded-2xl overflow-hidden border-2 border-teal-500/30 bg-slate-900 flex-shrink-0 flex items-center justify-center shadow-xl shadow-teal-500/5">
          <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/10 to-transparent z-10 pointer-events-none" />
          <Image
  src="/profile.jpg"
  alt="Yunus İlgün"
  fill
  className="object-cover"

            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <User size={64} className="text-slate-700" />
        </div>

        {/* Detaylar */}
        <div className="flex flex-col gap-6 flex-1">
          <div className="flex flex-wrap gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20 text-sm">
              <Terminal size={16} /> Bilgisayar Mühendisi & Yazılım Geliştirici
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-sm">
              <Calendar size={14} /> 16 Şubat 1988
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-sm">
              <MapPin size={14} /> Mersin, Akdeniz
            </div>
          </div>

          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-100 leading-tight">
            Sistemler, Mimariler ve <br />
            <span className="text-teal-400">Ölçeklenebilir Yazılımlar</span> Geliştiriyorum.
          </h2>
          
          <p className="text-slate-300 text-lg leading-relaxed">
            2010 yılından bu yana <strong>Java teknolojileri</strong> ve <strong>e-ticaret</strong> sektöründe aktif olarak çalışmaktayım. E-ticaret pazar yeri operasyonları ve arka yüz yazılım mimarileri geliştirmemin yanı sıra, <strong>23 yıllık profesyonel müzik hayatımı</strong> yazılım mühendisliği kariyerimle eş zamanlı olarak başarıyla sürdürüyorum.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <a 
              href="mailto:ilguny929@gmail.com" 
              className="px-6 py-3 bg-teal-500 hover:bg-teal-600 text-slate-950 font-semibold rounded-lg transition flex items-center gap-2"
            >
              <Mail size={18} /> E-Posta Gönder
            </a>
            <a 
              href="tel:+905355152546" 
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg border border-slate-700 transition flex items-center gap-2"
            >
              <Phone size={18} /> 0535 515 25 46
            </a>
          </div>
        </div>
      </section>

      {/* Experience & Education Section */}
      <section id="experience" className="max-w-5xl mx-auto w-full py-12 border-t border-slate-800/60">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Eğitim */}
          <div>
            <h3 className="text-2xl font-bold text-slate-200 mb-6 flex items-center gap-2">
              <GraduationCap className="text-teal-400" /> Eğitim Geçmişi
            </h3>
            <div className="space-y-6">
              <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-xs font-mono text-teal-400">Yüksek Lisans Programı</span>
                <h4 className="text-lg font-bold text-slate-100 mt-1">Bilgisayar Mühendisliği Yüksek Lisans</h4>
                <p className="text-slate-400 text-sm mt-1">Global College of America / Arizona State Board</p>
              </div>

              <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-xs font-mono text-teal-400">Lisans Derecesi</span>
                <h4 className="text-lg font-bold text-slate-100 mt-1">Bilgisayar Mühendisliği</h4>
                <p className="text-slate-400 text-sm mt-1">Uluslararası Dublin Üniversitesi</p>
              </div>
            </div>
          </div>

          {/* Kariyer Özet & Uzmanlık */}
          <div>
            <h3 className="text-2xl font-bold text-slate-200 mb-6 flex items-center gap-2">
              <Briefcase className="text-teal-400" /> Profesyonel Uzmanlık
            </h3>
            <div className="space-y-6">
              <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-lg font-bold text-slate-100">E-Ticaret Operasyonları & Yazılım</h4>
                  <span className="text-xs font-mono text-teal-400">2010 - Günümüz</span>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Trendyol, Hepsiburada, Amazon ve AliExpress gibi pazar yerlerinde 15 yıla yakın Mağaza Operasyon Yönetimi ve Java temelli entegrasyon çözümleri.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                    <Music size={16} className="text-teal-400" /> Müzisyenlik & Eğitmenlik
                  </h4>
                  <span className="text-xs font-mono text-teal-400">23 Yıllık Kariyer</span>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Canlı sahne performansları, davul / enstrüman eğitmenliği ve stüdyo kayıt çalışmalarıyla disiplinli sanatsal üretim.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="max-w-5xl mx-auto w-full py-12 border-t border-slate-800/60">
        <h3 className="text-2xl font-bold text-slate-200 mb-6 flex items-center gap-2">
          <Cpu className="text-teal-400" /> Teknolojiler & Yetenekler
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Java / Spring Boot', 'Python', 'C# / .NET', 'REST APIs', 'Next.js & React', 'TypeScript', 'Tailwind CSS', 'Git & GitHub'].map((skill) => (
            <div key={skill} className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-medium hover:border-teal-500/50 transition">
              {skill}
            </div>
          ))}
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="max-w-5xl mx-auto w-full py-12 border-t border-slate-800/60">
        <h3 className="text-2xl font-bold text-slate-200 mb-6 flex items-center gap-2">
          <Code className="text-teal-400" /> Öne Çıkan Projeler
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between hover:border-teal-500/50 transition">
            <div>
              <h4 className="text-xl font-bold text-slate-100 mb-2">Patent Ajanı Web Platformu</h4>
              <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                Spring Boot ve H2 veritabanı altyapısıyla geliştirilmiş, marka ve patent süreçlerini takip eden RESTful mimariye sahip web uygulaması.
              </p>
            </div>
            <div className="flex gap-2 text-xs text-teal-400 font-mono">
              <span>Java</span> • <span>Spring Boot</span> • <span>REST API</span>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between hover:border-teal-500/50 transition">
            <div>
              <h4 className="text-xl font-bold text-slate-100 mb-2">Mühendislik Portfolyo Platformu</h4>
              <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                Next.js App Router, TypeScript ve Tailwind CSS kullanılarak oluşturulmuş yüksek performanslı kişisel web platformu.
              </p>
            </div>
            <div className="flex gap-2 text-xs text-teal-400 font-mono">
              <span>Next.js</span> • <span>TypeScript</span> • <span>Tailwind</span>
            </div>
          </div>
        </div>
      </section>

      {/* Comment Form Section */}
      <section id="comments" className="max-w-5xl mx-auto w-full py-12 border-t border-slate-800/60">
        <CommentForm />
      </section>

      {/* Footer */}
      <footer id="contact" className="max-w-5xl mx-auto w-full pt-12 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} Yunus İlgün. Tüm hakları saklıdır.</p>
          <p className="text-xs text-slate-600 mt-1">İletişim: ilguny929@gmail.com | 0535 515 25 46</p>
        </div>
        <div className="flex gap-6 text-slate-400 items-center">
          <a href="https://github.com/endlessloop88" target="_blank" rel="noreferrer" className="hover:text-teal-400 transition" aria-label="GitHub">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
          </a>
          <a href="https://www.linkedin.com/in/yunus-ilg%C3%BCn-299652212/" target="_blank" rel="noreferrer" className="hover:text-teal-400 transition" aria-label="LinkedIn">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
          </a>
          <a href="https://instagram.com/yunuss.ilgun" target="_blank" rel="noreferrer" className="hover:text-teal-400 transition" aria-label="Instagram">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
          </a>
          <a href="mailto:ilguny929@gmail.com" className="hover:text-teal-400 transition flex items-center gap-1" aria-label="Mail">
            <Mail size={20} />
          </a>
        </div>
      </footer>
    </main>
  );
}