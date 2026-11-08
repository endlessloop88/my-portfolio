import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/admin', '/api/', '/sifre-sifirla'] }],
    sitemap: 'https://www.yunusilgun.com/sitemap.xml',
  };
}
