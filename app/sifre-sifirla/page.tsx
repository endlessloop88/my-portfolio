'use client';

import { useEffect, useState } from 'react';
import { KeyRound, Loader2, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

type ViewState = 'checking' | 'ready' | 'invalid' | 'done';

function translateError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes('different from the old password') || m.includes('same as the old')) {
    return 'Yeni şifre eskisiyle aynı olamaz.';
  }
  if (m.includes('at least') && m.includes('characters')) return 'Şifre en az 8 karakter olmalı.';
  if (m.includes('session missing') || m.includes('expired')) {
    return 'Bağlantının süresi dolmuş. Lütfen yeni bir sıfırlama bağlantısı isteyin.';
  }
  if (m.includes('rate limit') || m.includes('too many')) {
    return 'Çok fazla deneme yapıldı. Lütfen biraz bekleyip tekrar deneyin.';
  }
  if (m.includes('network') || m.includes('fetch')) return 'Bağlantı hatası. İnternetinizi kontrol edin.';
  return 'Bir hata oluştu, lütfen tekrar deneyin.';
}

const inputClass =
  'w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-teal-500 text-sm';
const labelClass = 'block text-xs font-mono text-slate-400 mb-1';

export default function ResetPasswordPage() {
  const [state, setState] = useState<ViewState>('checking');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // E-postadaki bağlantıdan gelinince Supabase oturumu kendiliğinden kurar.
  // Kurulması bir an sürebileceği için birkaç kez kontrol edilir.
  useEffect(() => {
    if (!isSupabaseConfigured) {
      setState('invalid');
      return;
    }

    let active = true;

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return;
      if (event === 'PASSWORD_RECOVERY' || (event === 'SIGNED_IN' && session)) {
        setState('ready');
      }
    });

    const check = async () => {
      for (let i = 0; i < 8; i++) {
        const { data } = await supabase.auth.getSession();
        if (!active) return;
        if (data.session) {
          setState('ready');
          return;
        }
        await new Promise((resolve) => setTimeout(resolve, 400));
      }
      if (active) setState((prev) => (prev === 'checking' ? 'invalid' : prev));
    };
    check();

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  // Şifre değişince kısa süre sonra ana sayfadaki üyelik bölümüne dön
  useEffect(() => {
    if (state !== 'done') return;
    const timer = setTimeout(() => window.location.assign('/#membership'), 2500);
    return () => clearTimeout(timer);
  }, [state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError(null);

    if (password.length < 8) {
      setError('Şifre en az 8 karakter olmalı.');
      return;
    }
    if (password !== confirm) {
      setError('Şifreler aynı değil.');
      return;
    }

    setLoading(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;
      setPassword('');
      setConfirm('');
      setState('done');
    } catch (err) {
      setError(translateError(err instanceof Error ? err.message : ''));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-md mx-auto px-4 py-10 space-y-6">
        <a href="/" className="inline-flex items-center gap-2 text-sm text-teal-400 hover:underline">
          <ArrowLeft size={16} /> Siteye dön
        </a>

        <div className="bg-slate-900/60 p-6 md:p-8 rounded-3xl border border-slate-800 space-y-5">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <KeyRound className="text-teal-400" size={24} /> Yeni Şifre Belirle
          </h1>

          {state === 'checking' && (
            <p className="flex items-center gap-2 text-sm text-slate-400">
              <Loader2 size={16} className="animate-spin" /> Bağlantı doğrulanıyor...
            </p>
          )}

          {state === 'invalid' && (
            <div className="space-y-3 text-sm">
              <div className="p-3 rounded-lg border bg-rose-500/10 border-rose-500/30 text-rose-400 flex items-start gap-2 text-xs">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>
                  Bağlantı geçersiz ya da süresi dolmuş. Lütfen üyelik bölümünden &quot;Şifremi unuttum&quot;
                  ile yeni bir bağlantı isteyin.
                </span>
              </div>
              <a href="/#membership" className="text-teal-400 hover:underline">
                Üyelik bölümüne git
              </a>
            </div>
          )}

          {state === 'ready' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={labelClass}>Yeni şifre *</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  maxLength={72}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputClass}
                  placeholder="En az 8 karakter"
                  autoComplete="new-password"
                />
              </div>
              <div>
                <label className={labelClass}>Yeni şifre (tekrar) *</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  maxLength={72}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className={inputClass}
                  placeholder="Şifreyi tekrar yazın"
                  autoComplete="new-password"
                />
              </div>

              {error && (
                <div className="p-3 rounded-lg border bg-rose-500/10 border-rose-500/30 text-rose-400 flex items-start gap-2 text-xs">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-2.5 bg-teal-500 hover:bg-teal-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-semibold rounded-lg transition flex items-center justify-center gap-2 text-sm"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Kaydediliyor...
                  </>
                ) : (
                  <>
                    <KeyRound size={16} /> Şifreyi Kaydet
                  </>
                )}
              </button>
            </form>
          )}

          {state === 'done' && (
            <div className="p-3 rounded-lg border bg-teal-500/10 border-teal-500/30 text-teal-400 flex items-start gap-2 text-xs">
              <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
              <span>Şifreniz güncellendi. Üyelik bölümüne yönlendiriliyorsunuz...</span>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
