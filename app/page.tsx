'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Mail, Terminal, Cpu, Code, Phone, GraduationCap, Briefcase, Calendar, MapPin, Music, User, BookOpen, Disc, CheckCircle, LogOut } from 'lucide-react';
import CommentForm from './components/CommentForm';
import { ThemeToggle } from './components/ThemeToggle';
import ProjectModal from './components/ProjectModal';
import BlogModal from './components/BlogModal';
import AlgorithmSection from './components/AlgorithmSection';
import Metronome from './components/Metronome';
import VideoSection from './components/VideoSection';

interface Project {
  title: string;
  tag: string;
  description: string;
  fullDetails: string;
  techs: string[];
  githubUrl?: string;
}

interface BlogPost {
  title: string;
  date: string;
  description: string;
  readTime: string;
  content: string;
}

const projectsData: Project[] = [
  {
    title: "Patent Ajanı",
    tag: "Spring Boot",
    description: "RESTful uç noktaları, H2 veritabanı ve HTML arayüzü bulunan, patent süreçlerini optimize eden Spring Boot tabanlı backend uygulaması.",
    fullDetails: "Patent Ajanı projesi; kurumsal patent başvuru süreçlerini dijitalleştirmek, takip etmek ve CRUD operasyonlarını hızlıca gerçekleştirmek amacıyla geliştirilmiştir. Arkada katmanlı mimari (Controller, Service, Repository) kullanılmış, veri kalıcılığı için hafif ve hızlı H2 veritabanı tercih edilmiştir. GitHub üzerinde açık kaynak olarak paylaşılmıştır.",
    techs: ["Java", "Spring Boot", "REST API", "H2 Database", "HTML/CSS"],
    githubUrl: "https://github.com"
  },
  {
    title: "Kişisel Portfolyo & Blog",
    tag: "Next.js",
    description: "Next.js App Router, TypeScript ve Tailwind CSS kullanılarak geliştirilmiş, modern mimarili kişisel web sitesi.",
    fullDetails: "Performans odaklı, SEO uyumlu ve dinamik tema desteğine sahip modern bir web uygulamasıdır. Server ve Client bileşenleri optimize edilmiş, form yönetimi ve interaktif modal yapılarıyla kullanıcı deneyimi üst seviyeye taşınmıştır.",
    techs: ["Next.js", "TypeScript", "Tailwind CSS", "Lucide React", "next-themes"],
    githubUrl: "https://github.com"
  }
];

const blogPostsData: BlogPost[] = [
  {
    title: "Java ve E-Ticaret Entegrasyonlarında Mimari Yaklaşımlar",
    date: "21 Eylül 2026",
    description: "Trendyol, Hepsiburada ve Amazon gibi pazar yerleri ile yürütülen operasyonlarda Spring Boot tabanlı servislerin rolü ve performans optimizasyonları.",
    readTime: "4 dk okuma",
    content: `Modern e-ticaret ekosisteminde birden fazla pazar yerini eş zamanlı yönetmek, robust (dayanıklı) arka yüz mimarileri gerektirir. 2010 yılından bu yana edindiğim deneyimlerle, sipariş ve stok senkronizasyonunda karşılaşılan zorlukları ve Java / Spring Boot ikilisinin bu süreçlerdeki gücünü inceliyoruz.

Temel Zorluklar ve Çözümler:

1. Eş Zamanlı İstek Yönetimi (Concurrency): Stok güncellemelerinin anlık olarak tüm pazar yerlerine yansıtılması kritik önem taşır. Threadpool ve asenkron servis yapılarıyla bu süreçler optimize edilir.
2. Hata Toleransı (Fault Tolerance): Harici servis kesintilerinde sistemin ayakta kalmasını sağlayan circuit breaker mekanizmaları entegre edilir.
3. Veritabanı Optimizasyonu: Hızlı sorgulama ve hafif veri katmanları ile yanıt sürelerini minimumda tutarak yüksek trafik altında bile stabil çalışan yapılar kurulur.`
  }
];

export default function Home() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  
  // Üyelik / Kayıt State'leri
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Oturum / Giriş State'i
  const [loggedInUser, setLoggedInUser] = useState<{ name: string; surname: string; email: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegisterAndLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!name.trim() || !surname.trim() || !email.trim() || !password.trim()) {
      setErrorMessage('Lütfen tüm alanları doldurun.');
      return;
    }

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, surname, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setLoggedInUser({ name, surname, email });
        setName('');
        setSurname('');
        setEmail('');
        setPassword('');
      } else {
        setErrorMessage(data.error || 'Kayıt olurken bir hata oluştu.');
      }
    } catch (error) {
      console.error('Bağlantı hatası:', error);
      setErrorMessage('Sunucuya bağlanırken bir hata oluştu.');
    }
  };

  const handleLogout = () => {
    setLoggedInUser(null);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 px-6 py-12 md:px-24 flex flex-col justify-between">
      {/* Header Section */}
      <header className="flex justify-between items-center max-w-5xl mx-auto w-full pb-8 border-b border-slate-800 dark:border-slate-800">
        <h1 className="text-xl font-bold tracking-wider text-teal-400">&lt;YUNUS İLGUN /&gt;</h1>
        
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex gap-6 text-sm text-slate-400">
            <a href="#about" className="hover:text-teal-400 transition">Hakkımda</a>
            <a href="#experience" className="hover:text-teal-400 transition">Deneyim & Eğitim</a>
            <a href="#projects" className="hover:text-teal-400 transition">Projeler</a>
            <a href="#music" className="hover:text-teal-400 transition">Müzik</a>
            <a href="#blog" className="hover:text-teal-400 transition">Blog</a>
            <a href="#membership" className="hover:text-teal-400 transition text-teal-400 font-medium">Üye Ol / Giriş</a>
            <a href="#skills" className="hover:text-teal-400 transition">Yetenekler</a>
            <a href="#comments" className="hover:text-teal-400 transition">İletişim</a>
          </nav>
          
          <ThemeToggle />
        </div>
      </header>

      {/* Hero Section */}
      <section id="about" className="max-w-5xl mx-auto w-full py-16 flex flex-col md:flex-row items-center md:items-start gap-10">
        <div className="relative w-44 h-44 md:w-56 md:h-56 rounded-2xl overflow-hidden border-2 border-teal-500/30 bg-slate-900 flex-shrink-0 flex items-center justify-center">
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

        <div className="flex flex-col gap-4 text-center md:text-left">
          <div className="flex flex-wrap justify-center md:justify-start gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1 bg-slate-900 px-3 py-1.5 rounded-full border border-slate-800 text-teal-400">
              <Terminal size={14} /> Bilgisayar Mühendisi & Yazılım Geliştirici
            </span>
            <span className="flex items-center gap-1 bg-slate-900 px-3 py-1.5 rounded-full border border-slate-800">
              <Calendar size={14} /> 16 Şubat 1988
            </span>
            <span className="flex items-center gap-1 bg-slate-900 px-3 py-1.5 rounded-full border border-slate-800">
              <MapPin size={14} /> İzmir, Türkiye
            </span>
          </div>

          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-100 leading-tight">
            Sistemler, Mimariler ve <span className="text-teal-400">Ölçeklenebilir Yazılımlar</span> Geliştiriyorum.
          </h2>

          <p className="text-slate-400 text-sm md:text-base leading-relaxed">
            2010 yılından bu yana <strong className="text-slate-200">Java teknolojileri</strong> ve <strong className="text-slate-200">e-ticaret</strong> sektöründe aktif olarak çalışmaktayım. 
            E-ticaret pazar yeri operasyonları ve arka yüz yazılım mimarileri geliştirmemin yanı sıra, <strong className="text-teal-400">23 yıllık profesyonel müzik hayatımı</strong> yazılım mühendisliği kariyerimle eş zamanlı olarak başarıyla sürdürüyorum.
          </p>

          <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
            <a href="mailto:iletisim@yunusilgun.com" className="flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold px-5 py-2.5 rounded-xl transition text-sm">
              <Mail size={16} /> E-Posta Gönder
            </a>
            <a href="tel:+905355152546" className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 px-5 py-2.5 rounded-xl transition text-sm">
              <Phone size={16} /> 0535 515 25 46
            </a>
          </div>
        </div>
      </section>

      {/* Eğitim ve Deneyim Bölümleri */}
      <section id="experience" className="max-w-5xl mx-auto w-full py-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
          <h3 className="text-xl font-bold text-teal-400 flex items-center gap-2 mb-6">
            <GraduationCap size={22} /> Eğitim Geçmişi
          </h3>
          <div className="space-y-6">
            <div className="border-l-2 border-teal-500/40 pl-4 space-y-1">
              <span className="text-xs text-teal-400 font-medium">Yüksek Lisans Programı</span>
              <h4 className="font-semibold text-slate-200">Bilgisayar Mühendisliği Yüksek Lisans</h4>
              <p className="text-xs text-slate-400">Global College of America / Arizona State Board</p>
              <span className="inline-block mt-1 text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">2026 - Planlanan</span>
            </div>
            <div className="border-l-2 border-slate-700 pl-4 space-y-1">
              <span className="text-xs text-teal-400 font-medium">Lisans Eğitimi</span>
              <h4 className="font-semibold text-slate-200">Bilgisayar Mühendisliği</h4>
              <p className="text-xs text-slate-400">Uluslararası Dublin Üniversitesi</p>
              <span className="inline-block mt-1 text-[11px] bg-teal-500/10 text-teal-400 px-2.5 py-0.5 rounded border border-teal-500/20">Mezun</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
          <h3 className="text-xl font-bold text-teal-400 flex items-center gap-2 mb-6">
            <Briefcase size={22} /> Profesyonel Uzmanlık
          </h3>
          <div className="space-y-6">
            <div className="border-l-2 border-teal-500/40 pl-4 space-y-1">
              <span className="text-xs text-teal-400 font-medium">2010 - Günümüz</span>
              <h4 className="font-semibold text-slate-200">E-Ticaret Operasyonları & Yazılım</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Trendyol, Hepsiburada, Amazon ve AliExpress gibi pazar yerlerinde 15 yıla yakın Mağaza Operasyon Yönetimi ve Java temelli entegrasyon çözümleri.
              </p>
            </div>
            <div className="border-l-2 border-slate-700 pl-4 space-y-1">
              <span className="text-xs text-teal-400 font-medium">Müzik Kariyeri</span>
              <h4 className="font-semibold text-slate-200">Profesyonel Bateri Eğitmeni & Müzisyen</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                23 yıllık sahne hayatı, profesyonel bateri icracılığı ve aktif özel ders eğitmenliği.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Projeler Bölümü */}
      <section id="projects" className="max-w-5xl mx-auto w-full py-12">
        <h3 className="text-2xl font-bold text-slate-100 mb-2 flex items-center gap-2">
          <Code className="text-teal-400" size={24} /> Öne Çıkan Projeler
        </h3>
        <p className="text-xs text-slate-400 mb-8">Detayları incelemek için proje kartlarına tıklayabilirsiniz.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projectsData.map((project, index) => (
            <div 
              key={index}
              onClick={() => setSelectedProject(project)}
              className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 hover:border-teal-500/50 transition cursor-pointer flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-lg text-teal-400 group-hover:underline">{project.title}</h4>
                  <span className="text-xs bg-teal-500/10 text-teal-400 px-2.5 py-1 rounded-full border border-teal-500/20">{project.tag}</span>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {project.description}
                </p>
              </div>
              <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-800/60 text-xs text-slate-400">
                <div className="flex gap-2">
                  {project.techs.slice(0, 3).map((tech, i) => (
                    <span key={i}>{tech}</span>
                  ))}
                </div>
                <span className="text-teal-400 font-medium group-hover:translate-x-1 transition">Detayları Gör &rarr;</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Müzik & Bateri Performansları Bölümü */}
      <section id="music" className="max-w-5xl mx-auto w-full py-12">
        <h3 className="text-2xl font-bold text-slate-100 mb-2 flex items-center gap-2">
          <Music className="text-teal-400" size={24} /> Müzik & Bateri Performansları
        </h3>
        <p className="text-xs text-slate-400 mb-8">23 yıllık sahne deneyimi, profesyonel bateri icracılığı ve özel ders eğitmenliği.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-3">
            <span className="text-teal-400 font-bold text-sm flex items-center gap-1.5"><Disc size={16} /> Enstrüman & Konfigürasyon</span>
            <h4 className="font-bold text-slate-200">Bateri & Zil Seti Konfigürasyonu</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Özel konfigürasyon akustiği. Zil setinde Istanbul Agop (18&quot; Signature Crash, 14&quot; Epoch Hi-Hat, 20&quot; Traditional Crash Ride) ve Istanbul Mehmet Sahra serisi tercihi.
            </p>
          </div>

          <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-3">
            <span className="text-teal-400 font-bold text-sm flex items-center gap-1.5"><User size={16} /> Özel Ders & Eğitmenlik</span>
            <h4 className="font-bold text-slate-200">Bateri Eğitmeni</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ritim teorisi, koordinasyon teknikleri ve pratik uygulama odaklı birebir özel bateri eğitmenliği hizmetleri.
            </p>
          </div>

          <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-3">
            <span className="text-teal-400 font-bold text-sm flex items-center gap-1.5"><Music size={16} /> Sahne & Akustik</span>
            <h4 className="font-bold text-slate-200">Canlı Performanslar</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Yıllara dayanan sahne geçmişi ile farklı müzik türlerinde profesyonel canlı bateri performansları.
            </p>
          </div>
        </div>
      </section>

      {/* Video Galerisi Bileşeni */}
      <section className="max-w-5xl mx-auto w-full py-6">
        <VideoSection />
      </section>

      {/* Blog Bölümü */}
      <section id="blog" className="max-w-5xl mx-auto w-full py-12">
        <h3 className="text-2xl font-bold text-slate-100 mb-2 flex items-center gap-2">
          <BookOpen className="text-teal-400" size={24} /> Blog & Yazılar
        </h3>
        <p className="text-xs text-slate-400 mb-8">Yazılım mimarileri, Java ve e-ticaret üzerine teknik düşüncelerim.</p>
        
        <div className="grid grid-cols-1 gap-6">
          {blogPostsData.map((post, index) => (
            <div 
              key={index}
              onClick={() => setSelectedPost(post)}
              className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 hover:border-teal-500/50 transition flex flex-col md:flex-row justify-between items-start md:items-center gap-4 group cursor-pointer"
            >
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="text-teal-400 font-medium">{post.date}</span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>
                <h4 className="font-bold text-xl text-slate-100 group-hover:text-teal-400 transition">{post.title}</h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {post.description}
                </p>
              </div>
              <button className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-teal-500 hover:text-slate-950 text-slate-300 text-xs font-semibold transition flex-shrink-0">
                Yazıyı Oku &rarr;
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Algoritma Köşesi Bileşeni */}
      <section className="max-w-5xl mx-auto w-full py-6">
        <AlgorithmSection />
      </section>

      {/* Davul Metronomu Bileşeni */}
      <section className="max-w-5xl mx-auto w-full py-6">
        <Metronome />
      </section>

      {/* Üye Ol / Giriş Bölümü */}
      <section id="membership" className="max-w-5xl mx-auto w-full py-12">
        <div className="bg-gradient-to-r from-teal-950/40 via-slate-900 to-slate-900 p-8 md:p-12 rounded-3xl border border-teal-500/20 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center md:text-left max-w-lg">
            <h3 className="text-2xl font-bold text-slate-100 flex items-center justify-center md:justify-start gap-2">
              <User className="text-teal-400" size={26} /> Üye Ol & Giriş Yap
            </h3>
            <p className="text-slate-400 text-sm">
              Ad, soyad, e-posta ve şifrenizi belirleyerek hemen üye olun ve bültenimize giriş yaparak ayrıcalıklı içeriklere erişin.
            </p>
          </div>

          <div className="w-full md:w-auto flex-shrink-0">
            {loggedInUser ? (
              <div className="flex flex-col sm:flex-row items-center gap-4 bg-teal-500/10 border border-teal-500/30 text-teal-400 px-6 py-4 rounded-2xl text-sm font-medium">
                <div className="flex items-center gap-3">
                  <CheckCircle size={20} />
                  <span>Hoş geldin, {loggedInUser.name} {loggedInUser.surname}!</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs transition"
                >
                  <LogOut size={14} /> Çıkış Yap
                </button>
              </div>
            ) : (
              <form onSubmit={handleRegisterAndLogin} className="flex flex-col gap-3 w-full sm:w-80">
                {errorMessage && (
                  <p className="text-xs text-red-400 bg-red-950/40 border border-red-900 p-2 rounded-lg text-center">
                    {errorMessage}
                  </p>
                )}
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ad" 
                    required
                    className="bg-slate-950 border border-slate-800 focus:border-teal-400 text-slate-200 placeholder-slate-500 px-3 py-2 rounded-xl text-sm outline-none transition w-1/2"
                  />
                  <input 
                    type="text" 
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                    placeholder="Soyad" 
                    required
                    className="bg-slate-950 border border-slate-800 focus:border-teal-400 text-slate-200 placeholder-slate-500 px-3 py-2 rounded-xl text-sm outline-none transition w-1/2"
                  />
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="E-posta adresi" 
                  required
                  className="bg-slate-950 border border-slate-800 focus:border-teal-400 text-slate-200 placeholder-slate-500 px-3 py-2.5 rounded-xl text-sm outline-none transition w-full"
                />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Şifre belirleyin" 
                  required
                  className="bg-slate-950 border border-slate-800 focus:border-teal-400 text-slate-200 placeholder-slate-500 px-3 py-2.5 rounded-xl text-sm outline-none transition w-full"
                />
                <button 
                  type="submit"
                  className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold px-6 py-2.5 rounded-xl text-sm transition shadow-lg shadow-teal-500/10 flex items-center justify-center gap-2 mt-1"
                >
                  Üye Ol & Giriş Yap
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Yetenekler */}
      <section id="skills" className="max-w-5xl mx-auto w-full py-12">
        <h3 className="text-2xl font-bold text-slate-100 mb-8 flex items-center gap-2">
          <Cpu className="text-teal-400" size={24} /> Teknik Yetkinlikler
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 text-center">
            <h4 className="font-semibold text-slate-200 text-sm">Yazılım Dilleri</h4>
            <p className="text-xs text-slate-400 mt-1">Python, Java, C#, C</p>
          </div>
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 text-center">
            <h4 className="font-semibold text-slate-200 text-sm">Web & Framework</h4>
            <p className="text-xs text-slate-400 mt-1">Next.js, Spring Boot, React</p>
          </div>
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 text-center">
            <h4 className="font-semibold text-slate-200 text-sm">E-Ticaret & Pazar Yeri</h4>
            <p className="text-xs text-slate-400 mt-1">Trendyol, Hepsiburada, Amazon</p>
          </div>
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 text-center">
            <h4 className="font-semibold text-slate-200 text-sm">Araçlar & Donanım</h4>
            <p className="text-xs text-slate-400 mt-1">Git, GitHub, Arduino, Cursor</p>
          </div>
        </div>
      </section>

      {/* Yorumlar ve İletişim Formu */}
      <section id="comments" className="max-w-5xl mx-auto w-full py-12">
        <CommentForm />
      </section>

      {/* Proje Detay Modalı */}
      <ProjectModal 
        project={selectedProject} 
        onClose={() => setSelectedProject(null)} 
      />

      {/* Blog Detay Modalı */}
      <BlogModal 
        post={selectedPost} 
        onClose={() => setSelectedPost(null)} 
      />

      {/* Footer */}
      <footer className="max-w-5xl mx-auto w-full pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 gap-4">
        <p>© 2026 Yunus İlgün. Tüm hakları saklıdır.</p>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1"><Music size={14} className="text-teal-400" /> Profesyonel Müzisyen & Eğitmen</span>
        </div>
      </footer>
    </main>
  );
}