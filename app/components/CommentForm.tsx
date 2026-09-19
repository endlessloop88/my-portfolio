'use client';

import { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';

export default function CommentForm() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.message) {
      setSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    }
  };

  return (
    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
      <h3 className="text-xl font-bold text-slate-100 mb-2">Bana Mesaj veya Yorum Bırakın</h3>
      <p className="text-sm text-slate-400 mb-6">Görüşlerinizi, proje taleplerinizi veya mesajlarınızı doğrudan iletebilirsiniz.</p>

      {submitted ? (
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
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-teal-500 text-sm"
                placeholder="Örn: Ahmet Yılmaz"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">E-Posta Adresiniz</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-teal-500 text-sm resize-none"
              placeholder="Notunuzu veya iletinizi buraya yazabilirsiniz..."
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 bg-teal-500 hover:bg-teal-600 text-slate-950 font-semibold rounded-lg transition flex items-center gap-2 text-sm"
          >
            <Send size={16} /> Gönder
          </button>
        </form>
      )}
    </div>
  );
}