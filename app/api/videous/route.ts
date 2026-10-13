import { NextResponse } from 'next/server';

const CHANNEL_ID = 'UC0EiA0n-wC5u_q9J8mmD-ag';
const FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
const MAX_VIDEOS = 6;

interface FeedVideo {
  id: string;
  title: string;
  published: string;
}

// XML'deki özel karakterleri normal metne çevirir (&amp; en sonda, çift çözümleme olmasın)
function decodeXml(text: string): string {
  return text
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&');
}

// Akıştaki her <entry> bir videodur: id, başlık ve yayın tarihini çıkarır
function parseFeed(xml: string): FeedVideo[] {
  const entries = xml.split('<entry>').slice(1);
  const videos: FeedVideo[] = [];

  for (const entry of entries) {
    const id = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1];
    const title = entry.match(/<title>([^<]*)<\/title>/)?.[1];
    const published = entry.match(/<published>([^<]+)<\/published>/)?.[1];

    if (id && title) {
      videos.push({ id, title: decodeXml(title), published: published ?? '' });
    }
  }

  return videos;
}

export async function GET() {
  try {
    // Sonuç bir saat önbellekte tutulur, her ziyarette YouTube'a gidilmez
    const res = await fetch(FEED_URL, { next: { revalidate: 3600 } });

    if (!res.ok) {
      throw new Error(`YouTube akışı yanıt vermedi: ${res.status}`);
    }

    const xml = await res.text();
    const videos = parseFeed(xml).slice(0, MAX_VIDEOS);

    return NextResponse.json({ videos });
  } catch (err) {
    console.error('YouTube akışı alınamadı:', err);
    // Hata olursa boş liste döner, sayfa kanal bağlantısını göstermeye devam eder
    return NextResponse.json({ videos: [] });
  }
}