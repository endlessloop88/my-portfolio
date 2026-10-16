'use client';

import { useState } from 'react';
import { Link2, Mail, Phone, Code2 } from 'lucide-react';

import MusicPadSection from './components/MusicPadSection';
import VideoSection from './components/VideoSection';
import AlgorithmSection from './components/AlgorithmSection';
import Metronome from './components/Metronome';
import MembershipForm from './components/MembershipForm';
import CommentForm from './components/CommentForm';
import ProjectModal from './components/ProjectModal';
import BlogModal from './components/BlogModal';
import BookingSection from './components/BookingSection';

interface Project {
  title: string;
  tag: string;
  description: string;
  fullDetails: string;
  techs: string[];
  githubUrl: string;
}

interface BlogPost {
  title: string;
  date: string;
  description: string;
  readTime: string;
  content: string;
}

const projects: Project[] = [
  {
    title: 'Patent Ajanı',
    tag: 'Spring Boot & Java',
    description:
      'RESTful API mimarisi ve H2 veritabanı ile geliştirilmiş patent yönetim ve arama sistemi.',
    fullDetails:
      'Spring Boot kullanarak geliştirdiğim bu projede CRUD operasyonları, RESTful servisler ve dinamik arayüz entegrasyonu sağladım.',
    techs: ['Java', 'Spring Boot', 'HTML/CSS', 'H2 Database'],
    githubUrl: 'https://github.com',
  },
  {
    title: 'Kişisel Portfolyo & Blog',
    tag: 'Next.js',
    description:
      'Next.js App Router, TypeScript ve Tailwind CSS kullanılarak geliştirilmiş, modern mimarili kişisel web sitesi.',
    fullDetails:
      'Bu sitenin kendisi: App Router, istemci bileşenleri, interaktif davul pedleri, blog ve üyelik sistemi içeren tam kapsamlı bir Next.js projesi.',
    techs: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    githubUrl: 'https://github.com',
  },
];

const blogPosts: BlogPost[] = [
  {
    title: 'Java ve E-Ticaret Entegrasyonlarında Mimari Yaklaşımlar',
    date: '21 Eylül 2026',
    readTime: '4 dk okuma',
    description:
      "Trendyol, Hepsiburada ve Amazon gibi pazar yerleri ile yürütülen operasyonlarda Spring Boot tabanlı servislerin rolü ve performans optimizasyonları.",
    content: `Trendyol, Hepsiburada ve Amazon gibi pazar yerleri ile entegrasyon çalışırken karşılaştığım en büyük zorluklardan biri, her platformun kendi API kısıtlamaları ve hız limitleriydi.

Spring Boot tabanlı bir servis mimarisi kurarak, her pazar yeri için ayrı bir adapter katmanı oluşturdum. Bu sayede iş mantığı platformdan bağımsız kalırken, entegrasyon detayları izole edildi.

Performans tarafında ise asenkron işlem kuyrukları kullanarak senkronizasyon sürelerini önemli ölçüde kısalttım.`,
  },
];

export default function Home() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const navLinks = [
    { href: '#about', label: 'Hakkımda' },
    { href: '#experience', label: 'Deneyim & Eğitim' },
    { href: '#projects', label: 'Projeler' },
    { href: '#music', label: 'Müzik' },
    { href: '#blog', label: 'Blog' },
    { href: '#booking', label: 'Ders Kaydı' },
    { href: '#membership', label: 'Üye Ol / Giriş' },
    { href: '#skills', label: 'Yetenekler' },
    { href: '#comments', label: 'İletişim' },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      {/* Nav Bar */}
      <nav className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <span className="font-mono font-bold text-teal-400 flex items-center gap-2">
            <Code2 size={18} /> YUNUS İLGÜN
          </span>
          <div className="hidden md:flex gap-5 text-xs font-medium text-slate-400">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="hover:text-teal-400 transition">
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-12 space-y-16">
        {/* Hero / Hakkımda */}
        <section id="about" className="space-y-4">
          <p className="text-xs font-mono text-teal-400">
            Bilgisayar Mühendisi & Yazılım Geliştirici · 16 Şubat 1988 · İzmir, Türkiye
          </p>
          <h1 className="text-3xl md:text-4xl font-extrabold">
            Sistemler, Mimariler ve Ölçeklenebilir Yazılımlar Geliştiriyorum.
          </h1>
          <p className="text-slate-400 leading-relaxed max-w-2xl">
            2010 yılından bu yana Java teknolojileri ve e-ticaret sektöründe aktif olarak
            çalışmaktayım. E-ticaret pazar yeri operasyonları ve arka yüz yazılım mimarileri
            geliştirmemin yanı sıra, 23 yıllık profesyonel müzik hayatımı yazılım mühendisliği
            kariyerimle eş zamanlı olarak başarıyla sürdürüyorum.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href="mailto:iletisim@yunusilgun.com"
              className="flex items-center gap-2 text-xs font-semibold bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 px-4 py-2 rounded-xl border border-teal-500/30 transition"
            >
              <Mail size={14} /> E-Posta Gönder
            </a>
            <a
              href="tel:+905355152546"
              className="flex items-center gap-2 text-xs font-semibold bg-slate-800/50 hover:bg-slate-800 text-slate-300 px-4 py-2 rounded-xl border border-slate-700 transition"
            >
              <Phone size={14} /> 0535 515 25 46
            </a>
          </div>
        </section>

        {/* Deneyim & Eğitim */}
        <section id="experience" className="space-y-6">
          <h2 className="text-xl font-bold text-slate-100">Deneyim & Eğitim</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
              <span className="text-xs text-teal-400 font-medium">2026 - Planlanan</span>
              <h3 className="font-bold text-slate-100 mt-1">Bilgisayar Mühendisliği Yüksek Lisans</h3>
              <p className="text-sm text-slate-400 mt-1">Global College of America / Arizona State Board</p>
            </div>
            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
              <span className="text-xs text-teal-400 font-medium">Mezun</span>
              <h3 className="font-bold text-slate-100 mt-1">Bilgisayar Mühendisliği</h3>
              <p className="text-sm text-slate-400 mt-1">Uluslararası Dublin Üniversitesi</p>
            </div>
            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
              <span className="text-xs text-teal-400 font-medium">2010 - Günümüz</span>
              <h3 className="font-bold text-slate-100 mt-1">E-Ticaret Operasyonları & Yazılım</h3>
              <p className="text-sm text-slate-400 mt-1">
                Trendyol, Hepsiburada, Amazon ve AliExpress gibi pazar yerlerinde 15 yıla yakın
                mağaza operasyon yönetimi ve Java temelli entegrasyon çözümleri.
              </p>
            </div>
            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
              <span className="text-xs text-teal-400 font-medium">Müzik Kariyeri</span>
              <h3 className="font-bold text-slate-100 mt-1">Profesyonel Bateri Eğitmeni & Müzisyen</h3>
              <p className="text-sm text-slate-400 mt-1">
                23 yıllık sahne hayatı, profesyonel bateri icracılığı ve aktif özel ders eğitmenliği.
              </p>
            </div>
          </div>
        </section>

        {/* Projeler */}
        <section id="projects" className="space-y-6">
          <h2 className="text-xl font-bold text-slate-100">Öne Çıkan Projeler</h2>
          <p className="text-xs text-slate-400 -mt-4">
            Detayları incelemek için proje kartlarına tıklayabilirsiniz.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {projects.map((project, index) => (
              <div
                key={index}
                className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 hover:border-teal-500/50 transition"
              >
                <span className="text-xs uppercase text-teal-400 font-medium">{project.tag}</span>
                <h3 className="text-lg font-bold text-slate-100 mt-1">{project.title}</h3>
                <p className="text-sm text-slate-400 mt-2">{project.description}</p>
                <div className="flex gap-2 flex-wrap mt-3">
                  {project.techs.map((tech, i) => (
                    <span
                      key={i}
                      className="text-[11px] bg-slate-800 text-slate-300 px-2 py-1 rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => setSelectedProject(project)}
                  className="text-sm font-medium text-teal-400 hover:underline mt-4"
                >
                  Detayları Gör →
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Müzik: Pedler, Video, Metronom */}
        <section id="music" className="space-y-6">
          <h2 className="text-xl font-bold text-slate-100">Müzik & Bateri Performansları</h2>
          <p className="text-xs text-slate-400 -mt-4">
            23 yıllık sahne deneyimi, profesyonel bateri icracılığı ve özel ders eğitmenliği.
          </p>

          <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800">
            <h3 className="text-lg font-bold text-slate-100 mb-4">İnteraktif Müzik Pedi</h3>
            <MusicPadSection />
          </div>

          <VideoSection />

          <div className="grid md:grid-cols-2 gap-6">
            <Metronome />
            <div className="bg-slate-900/60 p-6 md:p-8 rounded-3xl border border-slate-800">
              <h3 className="text-xl font-bold text-slate-100 mb-3">Enstrüman & Konfigürasyon</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Özel konfigürasyon akustiği. Zil setinde Istanbul Agop (18&quot; Signature Crash,
                14&quot; Epoch Hi-Hat, 20&quot; Traditional Crash Ride) ve Istanbul Mehmet Sahra
                serisi tercihi.
              </p>
            </div>
          </div>
        </section>

        {/* Algoritma & Kod Çözümleri */}
        <section className="space-y-6">
          <AlgorithmSection />
        </section>

        {/* Blog */}
        <section id="blog" className="space-y-6">
          <h2 className="text-xl font-bold text-slate-100">Blog & Yazılar</h2>
          <p className="text-xs text-slate-400 -mt-4">
            Yazılım mimarileri, Java ve e-ticaret üzerine teknik düşüncelerim.
          </p>
          <div className="grid gap-4">
            {blogPosts.map((post, index) => (
              <div
                key={index}
                className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 hover:border-teal-500/50 transition"
              >
                <div className="flex items-center gap-3 text-xs text-slate-400 mb-2">
                  <span>{post.date}</span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-100">{post.title}</h3>
                <p className="text-sm text-slate-400 mt-2">{post.description}</p>
                <button
                  onClick={() => setSelectedPost(post)}
                  className="text-sm font-medium text-teal-400 hover:underline mt-3"
                >
                  Yazıyı Oku →
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Bateri Dersi Kaydı */}
        <section id="booking">
          <BookingSection />
        </section>

        {/* Üyelik */}
        <section id="membership">
          <MembershipForm />
        </section>

        {/* Yetenekler */}
        <section id="skills" className="space-y-6">
          <h2 className="text-xl font-bold text-slate-100">Teknik Yetkinlikler</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
              <h4 className="text-xs font-semibold text-teal-400 mb-1">Yazılım Dilleri</h4>
              <p className="text-sm text-slate-300">Python, Java, C#, C</p>
            </div>
            <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
              <h4 className="text-xs font-semibold text-teal-400 mb-1">Web & Framework</h4>
              <p className="text-sm text-slate-300">Next.js, Spring Boot, React</p>
            </div>
            <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
              <h4 className="text-xs font-semibold text-teal-400 mb-1">E-Ticaret & Pazar Yeri</h4>
              <p className="text-sm text-slate-300">Trendyol, Hepsiburada, Amazon</p>
            </div>
            <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
              <h4 className="text-xs font-semibold text-teal-400 mb-1">Araçlar & Donanım</h4>
              <p className="text-sm text-slate-300">Git, GitHub, Arduino, Cursor</p>
            </div>
          </div>
        </section>

        {/* İletişim / Yorum Formu */}
        <section id="comments">
          <CommentForm />
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800 mt-16">
        <div className="max-w-5xl mx-auto px-4 py-10 text-center space-y-4">
          <p className="text-sm text-slate-400">Kıdemli Yazılım ve Bilgisayar Mühendisi</p>
          <div className="flex justify-center gap-6">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-slate-400 hover:text-teal-400 transition"
            >
              <Link2 size={16} /> GitHub
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-slate-400 hover:text-teal-400 transition"
            >
              <Link2 size={16} /> LinkedIn
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-slate-400 hover:text-teal-400 transition"
            >
              <Link2 size={16} /> Instagram
            </a>
          </div>
          <p className="text-xs text-slate-600">© 2026 Yunus İlgün. Tüm hakları saklıdır.</p>
          <p className="text-xs text-slate-600">Profesyonel Müzisyen & Eğitmen</p>
        </div>
      </footer>

      {/* Modallar */}
      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      <BlogModal post={selectedPost} onClose={() => setSelectedPost(null)} />
    </main>
  );
}