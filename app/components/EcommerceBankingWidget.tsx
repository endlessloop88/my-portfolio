'use client';

import React, { useState } from 'react';
import { ShoppingCart, Landmark, TrendingUp, Package, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

export default function EcommerceBankingWidget() {
  const [activeTab, setActiveTab] = useState<'ecommerce' | 'banking'>('ecommerce');
  const [selectedMarketplace, setSelectedMarketplace] = useState<'Trendyol' | 'Hepsiburada' | 'Amazon' | 'AliExpress'>('Trendyol');
  
  // Bankacılık Simülasyonu State'leri
  const [ibanInput, setIbanInput] = useState('');
  const [ibanResult, setIbanResult] = useState<{ status: 'idle' | 'success' | 'error'; message: string }>({ status: 'idle', message: '' });

  // Pazar Yeri Sahte Verileri
  const marketplaceData = {
    Trendyol: { orders: 142, revenue: '128.450 ₺', stockAlert: 3, status: 'Aktif Entegrasyon' },
    Hepsiburada: { orders: 98, revenue: '94.200 ₺', stockAlert: 1, status: 'Aktif Entegrasyon' },
    Amazon: { orders: 215, revenue: '$6,420', stockAlert: 5, status: 'Aktif Entegrasyon' },
    AliExpress: { orders: 310, revenue: '$4,150', stockAlert: 8, status: 'Aktif Entegrasyon' },
  };

  const handleIbanCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanIban = ibanInput.replace(/\s+/g, '').toUpperCase();
    // TR ile başlayan 26 haneli basit IBAN kontrolü simülasyonu
    if (/^TR\d{24}$/.test(cleanIban)) {
      setIbanResult({ status: 'success', message: 'IBAN formatı doğrulandı. Banka API bağlantısı başarılı.' });
    } else {
      setIbanResult({ status: 'error', message: 'Geçersiz IBAN formatı! Örnek format: TR00 0000 0000 0000 0000 0000 00' });
    }
  };

  return null;
}