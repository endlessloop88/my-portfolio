import { NextResponse } from 'next/server';

const CHANNEL_ID = 'UC0EiA0n-wC5u_q9J8mmD-ag';
// Kanalın "yüklenenler" listesi kimliği: kanal kimliğindeki UC yerine UU gelir
const UPLOADS_ID = `UU${CHANNEL_ID.slice(2)}`;

const FEEDS = [
  { name: 'kanal akışı', url: `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}` },
  { name: 'yüklenenler listesi', url: `https://www.youtube.com/feeds/videos.xml?playlist_id=${UPLOADS_ID}` },
];
const MAX_VIDEOS = 6;

interface FeedVideo {
  id: string;
  title: string;
  published: string;
}

// YouTube akışları çalışmazsa gösterilecek elle yazılmış liste (istersen doldur)
const FALLBACK_VIDEOS: FeedVideo[] = [
  // { id: 'VIDEO_KIMLIGI', title: 'Video başlığı', published: '2026-01-01T00:00:00+00:00' },
];

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
  const problems: string[] = [];

  for (const feed of FEEDS) {
    try {
      const res = await fetch(feed.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; PortfolioSite/1.0)',
          Accept: 'application/atom+xml, application/xml, text/xml',
        },
        next: { revalidate: 1800 },
      });

      if (!res.ok) {
        problems.push(`${feed.name}: HTTP ${res.status}`);
        continue;
      }

      const xml = await res.text();
      // En yeni video en başta olacak şekilde yayın tarihine göre sırala
      const videos = parseFeed(xml)
        .sort((a, b) => new Date(b.published).getTime() - new Date(a.published).getTime())
        .slice(0, MAX_VIDEOS);

      if (videos.length > 0) {
        return NextResponse.json({ videos });
      }
      problems.push(`${feed.name}: akış geldi ama içinde video bulunamadı`);
    } catch (err) {
      problems.push(`${feed.name}: ${err instanceof Error ? err.message : 'bilinmeyen hata'}`);
    }
  }

  console.error('YouTube akışı alınamadı:', problems);

  // Akışlar çalışmazsa elle yazılmış listeyi, o da yoksa boş listeyi döndür
  return NextResponse.json({
    videos: FALLBACK_VIDEOS.slice(0, MAX_VIDEOS),
    problems,
  });
}
