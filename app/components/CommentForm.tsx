'use client';

import { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

type Status = 'idle' | 'loading' | 'success' | 'error';

interface FormState {
  name: string;
  email: string;
  message: string;
  website: string; // honeypot: gerçek kullanıcılar bunu görmez ve doldurmaz
}

const EMPTY_FORM: FormState = { name: '', email: '', message: '', website: '' };

export default function CommentForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState<FormState>(EMPTY_FORM);

  const handleChange = (field: keyof FormState, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'loading') return;

    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || 'Mesaj gönderilemedi.');
      }

      setStatus('success');
      setFormData(EMPTY_FORM);
      setTimeout(() => setStatus('idle'), 5000);
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Mesaj gönderilemedi.');
    }
  };

  return (
    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
      <h3 className="text-xl font-bold text-slate-100 mb-2">Bana Mesaj veya Yorum Bırakın</h3>
      <p className="text-sm text-slate-400 mb-6">
        Görüşlerinizi, proje taleplerinizi veya mesajlarınızı doğrudan iletebilirsiniz.
      </p>

      {status === 'success' ? (
        <div className="p-4 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center gap-3">
          <CheckCircle2 size={20} />
          <span>Mesajınız başarıyla iletildi! Teşekkürler.</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Adınız Soyadınız *</label>
              <input
                type="text"
                required
                maxLength={100}
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-teal-500 text-sm"
                placeholder="Örn: Ahmet Yılmaz"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">E-Posta Adresiniz</label>
              <input
                type="email"
                maxLength={200}
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-teal-500 text-sm"
                placeholder="Örn: ahmet@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">Mesajınız *</label>
            <textarea
              required
              rows={4}
              maxLength={5000}
              value={formData.message}
              onChange={(e) => handleChange('message', e.target.value)}
              className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-teal-500 text-sm resize-none"
              placeholder="Notunuzu veya iletinizi buraya yazabilirsiniz..."
            />
          </div>

          {/* Honeypot: ekran dışında, klavye ile de erişilemez */}
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            value={formData.website}
            onChange={(e) => handleChange('website', e.target.value)}
            className="absolute left-[-9999px] h-0 w-0 opacity-0"
          />

          {status === 'error' && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center gap-2 text-xs">
              <AlertCircle size={16} />
              <span>{errorMessage}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'loading'}
            className="px-6 py-2.5 bg-teal-500 hover:bg-teal-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-semibold rounded-lg transition flex items-center gap-2 text-sm"
          >
            {status === 'loading' ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Gönderiliyor...
              </>
            ) : (
              <>
                <Send size={16} /> Gönder
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}