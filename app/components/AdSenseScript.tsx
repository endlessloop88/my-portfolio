'use client';

import Script from 'next/script';

const ADSENSE_CLIENT = 'ca-pub-6573289153467831';

// Google AdSense betiği. Yalnızca ana sayfada kullanılır; Ritim Koçu, gizlilik, üyelik ve yönetim
// sayfalarında Google reklam betiği yüklenmez.
export default function AdSenseScript() {
  return (
    <Script
      id="adsense"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
