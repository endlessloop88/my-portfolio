'use client';

import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import {
  UserPlus,
  LogIn,
  LogOut,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Info,
  Loader2,
  Mail,
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

type Mode = 'signup' | 'login' | 'forgot';
type MessageType = 'error' | 'success' | 'info';

const ADMIN_EMAIL = (process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? '').toLowerCase();

function translateError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes('already registered') || m.includes('already been registered')) {
    return 'Bu e-posta ile zaten bir üyelik var. Giriş yapmayı deneyin.';
  }
  if (m.includes('not authorized')) {
    return 'E-posta servisi şu anda bu adrese gönderim yapamıyor. Lütfen daha sonra tekrar deneyin.';
  }
  if (m.includes('only request this after') || m.includes('for security purposes')) {
    return 'Güvenlik nedeniyle yeni bir istek için yaklaşık bir dakika beklemeniz gerekiyor.';
  }
  if (m.includes('invalid login credentials')) return 'E-posta ya da şifre hatalı.';
  if (m.includes('email not confirmed')) {
    return 'E-postanız henüz doğrulanmamış. Gelen kutunuzdaki bağlantıya tıklayın.';
  }
  if (m.includes('at least') && m.includes('characters')) return 'Şifre en az 8 karakter olmalı.';
  if (m.includes('rate limit') || m.includes('too many')) {
    return 'Çok fazla deneme yapıldı. Lütfen biraz bekleyip tekrar deneyin.';
  }
  if (m.includes('invalid') && m.includes('email')) return 'Geçerli bir e-posta adresi girin.';
  if (m.includes('network') || m.includes('fetch')) return 'Bağlantı hatası. İnternetinizi kontrol edin.';
  return 'Bir hata oluştu, lütfen tekrar deneyin.';
}

const inputClass =
  'w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-teal-500 text-sm';
const labelClass = 'block text-xs font-mono text-slate-400 mb-1';

export default function MembershipForm() {
  const [mode, setMode] = useState<Mode>('signup');
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: MessageType; text: string } | null>(null);

  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [consent, setConsent] = useState(false);

  // Sayfa açılınca mevcut oturumu kontrol et, oturum değişimlerini dinle
  useEffect(() => {
    if (!isSupabaseConfigured) {
      setChecking(false);
      return;
    }

    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setUser(data.session?.user ?? null);
      setChecking(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setMessage(null);

    if (mode === 'forgot') {
      setLoading(true);
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: `${window.location.origin}/sifre-sifirla`,
        });
        if (error) throw error;
        // Adres kayıtlı olsun olmasın aynı mesaj gösterilir (hesap varlığı sızdırılmaz)
        setMessage({
          type: 'info',
          text: 'Bu adres kayıtlıysa şifre sıfırlama bağlantısı gönderildi. Gelen kutunuzu ve spam klasörünü kontrol edin.',
        });
      } catch (err) {
        setMessage({
          type: 'error',
          text: translateError(err instanceof Error ? err.message : ''),
        });
      } finally {
        setLoading(false);
      }
      return;
    }

    if (mode === 'signup') {
      if (password.length < 8) {
        setMessage({ type: 'error', text: 'Şifre en az 8 karakter olmalı.' });
        return;
      }
      if (!consent) {
        setMessage({ type: 'error', text: 'Devam etmek için onay kutusunu işaretleyin.' });
        return;
      }
    }

    setLoading(true);
    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { data: { name: name.trim(), surname: surname.trim() } },
        });
        if (error) throw error;

        if (data.session) {
          setMessage({ type: 'success', text: 'Üyeliğiniz oluşturuldu, hoş geldiniz!' });
        } else {
          setMessage({
            type: 'info',
            text: 'Kayıt alındı. E-postanıza gelen doğrulama bağlantısına tıklayın, ardından giriş yapın.',
          });
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) throw error;
      }
      setPassword('');
    } catch (err) {
      setMessage({
        type: 'error',
        text: translateError(err instanceof Error ? err.message : ''),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setMessage(null);
  };

  const messageStyle: Record<MessageType, string> = {
    error: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
    success: 'bg-teal-500/10 border-teal-500/30 text-teal-400',
    info: 'bg-sky-500/10 border-sky-500/30 text-sky-400',
  };
  const MessageIcon = message?.type === 'success' ? CheckCircle2 : message?.type === 'info' ? Info : AlertCircle;

  // --- Ortam değişkenleri yoksa ---
  if (!isSupabaseConfigured) {
    return (
      <div className="bg-slate-900/60 p-6 md:p-8 rounded-3xl border border-slate-800">
        <h3 className="text-xl font-bold text-slate-100 mb-2">Üye Ol & Giriş Yap</h3>
        <p className="text-sm text-slate-400">Üyelik sistemi şu anda kullanılamıyor.</p>
      </div>
    );
  }

  if (checking) {
    return (
      <div className="bg-slate-900/60 p-6 md:p-8 rounded-3xl border border-slate-800 flex items-center gap-2 text-sm text-slate-400">
        <Loader2 size={16} className="animate-spin" /> Yükleniyor...
      </div>
    );
  }

  // --- Giriş yapmış üye ---
  if (user) {
    const displayName = (user.user_metadata?.name as string | undefined) || user.email;
    const isAdmin = Boolean(ADMIN_EMAIL) && user.email?.toLowerCase() === ADMIN_EMAIL;

    return (
      <div className="bg-slate-900/60 p-6 md:p-8 rounded-3xl border border-slate-800">
        <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2 mb-2">
          <CheckCircle2 className="text-teal-400" size={24} /> Hoş geldiniz, {displayName}
        </h3>
        <p className="text-sm text-slate-400 mb-6">
          <span className="text-slate-300">{user.email}</span> adresiyle giriş yaptınız.
        </p>
        <div className="flex flex-wrap gap-3">
          {isAdmin && (
            <a
              href="/admin"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold rounded-lg transition text-sm"
            >
              <ShieldCheck size={16} /> Üye Listesi
            </a>
          )}
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg transition text-sm"
          >
            <LogOut size={16} /> Çıkış Yap
          </button>
        </div>
      </div>
    );
  }

  // --- Kayıt / giriş formu ---
  return (
    <div className="bg-slate-900/60 p-6 md:p-8 rounded-3xl border border-slate-800">
      <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2 mb-2">
        <UserPlus className="text-teal-400" size={24} /> Üye Ol & Giriş Yap
      </h3>
      <p className="text-xs text-slate-400 mb-5">
        Üye olarak siteye kayıtlı kullanıcı olursunuz. Şifreniz güvenli şekilde şifrelenerek saklanır.
      </p>

      <div className="flex gap-2 mb-6">
        {(['signup', 'login'] as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => {
              setMode(m);
              setMessage(null);
            }}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              mode === m ? 'bg-teal-500 text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {m === 'signup' ? 'Üye Ol' : 'Giriş Yap'}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'forgot' && (
          <p className="text-xs text-slate-400 leading-relaxed">
            Üyelikte kullandığınız e-posta adresini yazın, şifrenizi sıfırlamak için bir bağlantı gönderelim.
          </p>
        )}

        {mode === 'signup' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Adınız *</label>
              <input
                type="text"
                required
                maxLength={60}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
                placeholder="Adınız"
                autoComplete="given-name"
              />
            </div>
            <div>
              <label className={labelClass}>Soyadınız *</label>
              <input
                type="text"
                required
                maxLength={60}
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                className={inputClass}
                placeholder="Soyadınız"
                autoComplete="family-name"
              />
            </div>
          </div>
        )}

        <div>
          <label className={labelClass}>E-Posta Adresiniz *</label>
          <input
            type="email"
            required
            maxLength={200}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            placeholder="ornek@example.com"
            autoComplete="email"
          />
        </div>

        {mode !== 'forgot' && (
          <div>
            <label className={labelClass}>Şifreniz *</label>
            <input
              type="password"
              required
              minLength={mode === 'signup' ? 8 : undefined}
              maxLength={72}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
              placeholder={mode === 'signup' ? 'En az 8 karakter' : 'Şifreniz'}
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            />
            {mode === 'login' && (
              <button
                type="button"
                onClick={() => {
                  setMode('forgot');
                  setMessage(null);
                }}
                className="mt-2 text-xs text-teal-400 hover:underline"
              >
                Şifremi unuttum
              </button>
            )}
          </div>
        )}

        {mode === 'signup' && (
          <label className="flex items-start gap-2 text-xs text-slate-400 leading-relaxed cursor-pointer">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-0.5 accent-teal-400"
            />
            <span>
              Adım, soyadım ve e-posta adresimin üyelik oluşturmak amacıyla işlenmesini ve saklanmasını
              kabul ediyorum.
            </span>
          </label>
        )}

        {message && (
          <div className={`p-3 rounded-lg border flex items-start gap-2 text-xs ${messageStyle[message.type]}`}>
            <MessageIcon size={16} className="shrink-0 mt-0.5" />
            <span>{message.text}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full md:w-auto px-6 py-2.5 bg-teal-500 hover:bg-teal-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-semibold rounded-lg transition flex items-center justify-center gap-2 text-sm"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" /> İşleniyor...
            </>
          ) : mode === 'forgot' ? (
            <>
              <Mail size={16} /> Sıfırlama Bağlantısı Gönder
            </>
          ) : mode === 'signup' ? (
            <>
              <UserPlus size={16} /> Üye Ol
            </>
          ) : (
            <>
              <LogIn size={16} /> Giriş Yap
            </>
          )}
        </button>
      </form>

      {mode === 'forgot' && (
        <button
          type="button"
          onClick={() => {
            setMode('login');
            setMessage(null);
          }}
          className="mt-4 text-xs text-teal-400 hover:underline"
        >
          ← Girişe dön
        </button>
      )}
    </div>
  );
}
