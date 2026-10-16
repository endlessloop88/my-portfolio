'use client';

import { useEffect, useState } from 'react';
import { Users, Loader2, ShieldAlert, ArrowLeft } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface Member {
  id: string;
  name: string;
  surname: string;
  email: string;
  created_at: string;
}

type ViewState = 'loading' | 'signedout' | 'forbidden' | 'ready' | 'error';

const ADMIN_EMAIL = (process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? '').toLowerCase();

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleString('tr-TR', { dateStyle: 'medium', timeStyle: 'short' });
}

export default function AdminPage() {
  const [state, setState] = useState<ViewState>('loading');
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    let active = true;

    async function load() {
      if (!isSupabaseConfigured) {
        setState('error');
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!active) return;

      if (!session) {
        setState('signedout');
        return;
      }

      // Arayüz kontrolü. Asıl güvenlik Supabase'deki RLS kuralıdır, yönetici olmayan veri alamaz.
      if (!ADMIN_EMAIL || session.user.email?.toLowerCase() !== ADMIN_EMAIL) {
        setState('forbidden');
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, surname, email, created_at')
        .order('created_at', { ascending: false });
      if (!active) return;

      if (error) {
        console.error('Üyeler alınamadı:', error.message);
        setState('error');
        return;
      }

      setMembers((data as Member[]) ?? []);
      setState('ready');
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
        <a href="/" className="inline-flex items-center gap-2 text-sm text-teal-400 hover:underline">
          <ArrowLeft size={16} /> Siteye dön
        </a>

        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Users className="text-teal-400" size={26} /> Üye Listesi
        </h1>

        {state === 'loading' && (
          <p className="flex items-center gap-2 text-sm text-slate-400">
            <Loader2 size={16} className="animate-spin" /> Yükleniyor...
          </p>
        )}

        {state === 'signedout' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-sm text-slate-300">
            Bu sayfayı görmek için giriş yapmanız gerekiyor.{' '}
            <a href="/#membership" className="text-teal-400 hover:underline">
              Giriş yap
            </a>
          </div>
        )}

        {state === 'forbidden' && (
          <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-6 text-sm text-rose-400 flex items-center gap-2">
            <ShieldAlert size={18} /> Bu sayfayı görüntüleme yetkiniz yok.
          </div>
        )}

        {state === 'error' && (
          <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-6 text-sm text-rose-400">
            Üyeler yüklenemedi. Supabase kurulumunu ve ortam değişkenlerini kontrol edin.
          </div>
        )}

        {state === 'ready' && (
          <div className="space-y-3">
            <p className="text-sm text-slate-400">
              Toplam <span className="text-teal-400 font-semibold">{members.length}</span> üye
            </p>
            <div className="overflow-x-auto bg-slate-900 border border-slate-800 rounded-2xl">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-slate-400 border-b border-slate-800">
                    <th className="px-4 py-3 font-medium">Ad Soyad</th>
                    <th className="px-4 py-3 font-medium">E-posta</th>
                    <th className="px-4 py-3 font-medium">Kayıt Tarihi</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((m) => (
                    <tr key={m.id} className="border-b border-slate-800/60 last:border-0">
                      <td className="px-4 py-3 text-slate-200">
                        {`${m.name} ${m.surname}`.trim() || '—'}
                      </td>
                      <td className="px-4 py-3 text-slate-300">{m.email}</td>
                      <td className="px-4 py-3 text-slate-400">{formatDate(m.created_at)}</td>
                    </tr>
                  ))}
                  {members.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-4 py-6 text-center text-slate-500">
                        Henüz üye yok.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
