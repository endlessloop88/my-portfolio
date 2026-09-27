'use client';

import { useState } from 'react';
import { UserPlus, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface FormState {
  name: string;
  surname: string;
  email: string;
  password: string;
}

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function MembershipForm() {
  const [formData, setFormData] = useState<FormState>({
    name: '',
    surname: '',
    email: '',
    password: '',
  });
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (field: keyof FormState, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Bir hata oluştu.');
      }

      setStatus('success');
      setFormData({ name: '', surname: '', email: '', password: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Bir hata oluştu.');
    }
  };

  return (
    <div className="bg-slate-900/60 p-6 md:p-8 rounded-3xl border border-slate-800">
      <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2 mb-2">
        <UserPlus className="text-teal-400" size={24} /> Üye Ol & Giriş Yap
      </h3>
      <p className="text-xs text-slate-400 mb-6">
        Ad, soyad, e-posta ve şifrenizi belirleyerek hemen üye olun ve bültenimize giriş yaparak
        ayrıcalıklı içeriklere erişin.
      </p>

      {status === 'success' ? (
        <div className="p-4 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center gap-3">
          <CheckCircle2 size={20} />
          <span>Üyeliğiniz başarıyla oluşturuldu!</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Adınız *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-teal-500 text-sm"
                placeholder="Adınız"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Soyadınız *</label>
              <input
                type="text"
                required
                value={formData.surname}
                onChange={(e) => handleChange('surname', e.target.value)}
                className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-teal-500 text-sm"
                placeholder="Soyadınız"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">E-Posta Adresiniz *</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-teal-500 text-sm"
              placeholder="ornek@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">Şifreniz *</label>
            <input
              type="password"
              required
              minLength={6}
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-teal-500 text-sm"
              placeholder="En az 6 karakter"
            />
          </div>

          {status === 'error' && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center gap-2 text-xs">
              <AlertCircle size={16} />
              <span>{errorMessage}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full md:w-auto px-6 py-2.5 bg-teal-500 hover:bg-teal-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-semibold rounded-lg transition flex items-center justify-center gap-2 text-sm"
          >
            {status === 'loading' ? (
              <>
                <Loader2 size={16} className="animate-spin" /> İşleniyor...
              </>
            ) : (
              <>
                <UserPlus size={16} /> Üye Ol & Giriş Yap
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}