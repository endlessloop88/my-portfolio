'use client';

import React, { useState } from 'react';
import { Bot, Send, User, Sparkles, ShieldCheck } from 'lucide-react';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

export default function PatentBot() {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Merhaba! Ben Patent Ajanı Asistanı. Spring Boot altyapısıyla çalışıyorum. Patent sorgulama veya başvuru süreçleri hakkında bana soru sorabilirsiniz.',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { sender: 'user', text: userMessage }]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let botResponse = 'Bu konuda patent ön araştırması yapmanızı öneririm.';
      const lower = userMessage.toLocaleLowerCase('tr-TR');
      
      if (lower.includes('patent') || lower.includes('başvuru')) {
        botResponse = 'Patent başvurusu için yenilik, buluş basamağı ve sanayiye uygulanabilirlik şarttır.';
      } else if (lower.includes('spring') || lower.includes('kod')) {
        botResponse = 'Bu sistem Spring Boot backend ve RESTful API mimarisiyle geliştirilmiştir.';
      }

      setMessages((prev) => [...prev, { sender: 'bot', text: botResponse }]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <section className="mx-auto flex w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
      <header className="flex items-center gap-3 bg-slate-900 px-5 py-4 text-white">
        <Bot size={22} />
        <div>
          <h2 className="font-semibold">Patent Ajanı Asistanı</h2>
          <p className="text-xs text-slate-300">Spring Boot destekli</p>
        </div>
        <Sparkles className="ml-auto text-amber-300" size={20} />
      </header>

      <div className="flex min-h-80 flex-col gap-3 overflow-y-auto p-4">
        {messages.map((message, index) => (
          <div
            key={`${message.sender}-${index}`}
            className={`flex items-start gap-2 ${message.sender === 'user' ? 'justify-end' : ''}`}
          >
            {message.sender === 'bot' && <Bot className="mt-1 shrink-0 text-slate-500" size={18} />}
            <p className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${message.sender === 'user' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`}>
              {message.text}
            </p>
            {message.sender === 'user' && <User className="mt-1 shrink-0 text-slate-500" size={18} />}
          </div>
        ))}
        {isTyping && <p className="text-sm text-slate-500">Yanıt yazılıyor...</p>}
      </div>

      <form onSubmit={handleSend} className="flex gap-2 border-t border-slate-200 p-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Sorunuzu yazın..."
          aria-label="Mesaj"
          className="min-w-0 flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
        />
        <button
          type="submit"
          aria-label="Gönder"
          disabled={isTyping || !input.trim()}
          className="rounded-xl bg-slate-900 px-4 py-2 text-white transition hover:bg-slate-700 disabled:opacity-50"
        >
          <Send size={18} />
        </button>
      </form>
    </section>
  );
}