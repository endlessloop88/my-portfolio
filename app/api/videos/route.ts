import { NextResponse } from 'next/server';

const CHANNEL_ID = 'UC0EiA0n-wC5u_q9J8mmD-ag';
// Kanalın "yüklenenler" listesi kimliği: kanal kimliğindeki UC yerine UU gelir
const UPLOADS_ID = `UU${CHANNEL_ID.slice(2)}`;

const FEEDS = [
  { name: 'kanal akışı', url: `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}` },
  { name: 'yüklenenler listesi', url: `https://www.youtube.com/feeds/videos.xml?playlist_id=${UPLOADS_ID}` },
];
// YouTube, Vercel sunucularından gelen isteği reddederse kullanılan üçüncü taraf RSS çevirici (yedek)
const RSS2JSON = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(FEEDS[0].url)}`;
const MAX_VIDEOS = 6;

interface FeedVideo {
  id: string;
  title: string;
  published: string;
}

// Son çare: elle yazılmış liste (istersen doldur)
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

// rss2json yanıtını aynı biçime çevirir
function parseRss2Json(data: unknown): FeedVideo[] {
  const items = (data as { items?: Array<Record<string, string>> })?.items;
  if (!Array.isArray(items)) return [];

  const videos: FeedVideo[] = [];
  for (const item of items) {
    const id =
      item.guid?.replace('yt:video:', '') ||
      item.link?.match(/[?&]v=([^&]+)/)?.[1] ||
      '';
    const title = item.title;
    if (!id || !title) continue;

    const date = item.pubDate ? new Date(`${item.pubDate.replace(' ', 'T')}Z`) : null;
    videos.push({
      id,
      title,
      published: date && !Number.isNaN(date.getTime()) ? date.toISOString() : '',
    });
  }
  return videos;
}

// En yeni video en başta olacak şekilde sıralar ve sınırlar
function newestFirst(videos: FeedVideo[]): FeedVideo[] {
  return [...videos]
    .sort((a, b) => new Date(b.published).getTime() - new Date(a.published).getTime())
    .slice(0, MAX_VIDEOS);
}

export async function GET() {
  const problems: string[] = [];

  // 1) YouTube'un kendi akışları
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

      const videos = newestFirst(parseFeed(await res.text()));
      if (videos.length > 0) return NextResponse.json({ videos });
      problems.push(`${feed.name}: akış geldi ama içinde video bulunamadı`);
    } catch (err) {
      problems.push(`${feed.name}: ${err instanceof Error ? err.message : 'bilinmeyen hata'}`);
    }
  }

  // 2) Yedek: rss2json üzerinden aynı akış
  try {
    const res = await fetch(RSS2JSON, { next: { revalidate: 1800 } });
    if (!res.ok) {
      problems.push(`rss2json: HTTP ${res.status}`);
    } else {
      const videos = newestFirst(parseRss2Json(await res.json()));
      if (videos.length > 0) return NextResponse.json({ videos });
      problems.push('rss2json: video bulunamadı');
    }
  } catch (err) {
    problems.push(`rss2json: ${err instanceof Error ? err.message : 'bilinmeyen hata'}`);
  }

  console.error('YouTube akışı alınamadı:', problems);

  // 3) Son çare: elle yazılmış liste (boşsa boş döner)
  return NextResponse.json({
    videos: FALLBACK_VIDEOS.slice(0, MAX_VIDEOS),
    problems,
  });
}
