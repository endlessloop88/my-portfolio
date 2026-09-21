'use client';

import { useState } from 'react';
import { Terminal, Code, CheckCircle, Copy } from 'lucide-react';

interface Algorithm {
  title: string;
  language: string;
  difficulty: 'Kolay' | 'Orta' | 'Zor';
  description: string;
  code: string;
  complexity: string;
}

const algorithmsData: Algorithm[] = [
  {
    title: "İki Sayının Toplamı (Two Sum)",
    language: "Python",
    difficulty: "Kolay",
    description: "Bir dizi içerisindeki hedef toplamı veren iki sayının indekslerini bulur.",
    code: `def twoSum(nums: list[int], target: int) -> list[int]:
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
    complexity: "Zaman: O(n) | Bellek: O(n)"
  },
  {
    title: "Asal Sayı Kontrolü & Optimize Algoritma",
    language: "Java",
    difficulty: "Orta",
    description: "Verilen bir sayının asal olup olmadığını karekök optimizasyonu ile kontrol eder.",
    code: `public boolean isPrime(int n) {
    if (n <= 1) return false;
    if (n <= 3) return true;
    if (n % 2 == 0 || n % 3 == 0) return false;
    
    for (int i = 5; i * i <= n; i += 6) {
        if (n % i == 0 || n % (i + 2) == 0) return false;
    }
    return true;
}`,
    complexity: "Zaman: O(√n) | Bellek: O(1)"
  }
];

export default function AlgorithmSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const activeAlgo = algorithmsData[activeIndex];

  const handleCopy = () => {
    navigator.clipboard.writeText(activeAlgo.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900/60 p-6 md:p-8 rounded-3xl border border-slate-800">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Terminal className="text-teal-400" size={24} /> Algoritma & Kod Çözümleri
          </h3>
          <p className="text-xs text-slate-400 mt-1">LeetCode ve yazılım projelerimden seçtiğim örnek kod blokları.</p>
        </div>
        
        <div className="flex gap-2">
          {algorithmsData.map((algo, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                activeIndex === index 
                  ? 'bg-teal-500 text-slate-950' 
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {algo.title.split(' ')[0]} ({algo.language})
            </button>
          ))}
        </div>
      </div>

      <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
        <div className="bg-slate-900/80 px-4 py-3 border-b border-slate-800 flex justify-between items-center text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <Code size={16} className="text-teal-400" />
            <span className="font-semibold">{activeAlgo.title}</span>
            <span className="bg-teal-500/10 text-teal-400 px-2 py-0.5 rounded border border-teal-500/20">{activeAlgo.language}</span>
          </div>
          <button 
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-slate-400 hover:text-teal-400 transition"
          >
            {copied ? <CheckCircle size={14} className="text-teal-400" /> : <Copy size={14} />}
            <span>{copied ? 'Kopyalandı!' : 'Kodu Kopyala'}</span>
          </button>
        </div>

        <div className="p-4 space-y-3">
          <p className="text-xs text-slate-400">{activeAlgo.description}</p>
          <pre className="bg-slate-900/90 p-4 rounded-xl text-teal-300 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
            <code>{activeAlgo.code}</code>
          </pre>
          <div className="flex justify-between items-center pt-2 text-[11px] text-slate-500">
            <span>Kompleksite: <strong className="text-slate-300">{activeAlgo.complexity}</strong></span>
            <span className="text-teal-400">Zorluk: {activeAlgo.difficulty}</span>
          </div>
        </div>
      </div>
    </div>
  );
}