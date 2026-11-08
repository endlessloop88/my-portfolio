import type { MetadataRoute } from 'next';

const BASE = 'https://yunusilgun.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${BASE}/`, lastModified: now, changeFrequency: 'monthly', priority: 1 },
    { url: `${BASE}/en`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/coach`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/gizlilik`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];
}
