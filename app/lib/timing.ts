// Ritim koçunun saf hesap kısmı: ekran ya da ses motoru içermez, bu yüzden kolayca test edilir.

export const BEATS_PER_BAR = 4; // 4/4
export const COUNT_IN_BARS = 1; // ilk ölçü sayım: puanlanmaz

export type Rating = 'perfect' | 'good' | 'ok' | 'miss';

// Sapmaya (ms) göre değerlendirme. Eşikler bu uygulamanın ölçütüdür.
export function rate(deviationMs: number): Rating {
  const abs = Math.abs(deviationMs);
  if (abs <= 20) return 'perfect';
  if (abs <= 40) return 'good';
  if (abs <= 70) return 'ok';
  return 'miss';
}

// Sayımdan sonra "N ölçü tık, N ölçü sessiz" düzeni. silentBars = 0 ise sessiz ölçü yok.
export function isSilentBar(barIndex: number, silentBars: number): boolean {
  if (silentBars <= 0 || barIndex < COUNT_IN_BARS) return false;
  return (barIndex - COUNT_IN_BARS) % (silentBars * 2) >= silentBars;
}

export interface ScoredHit {
  deviation: number; // ms: negatif = erken, pozitif = geç
  silent: boolean;
  bar: number;
  step: number;
}

/**
 * Bir vuruşu en yakın ızgara noktasıyla karşılaştırır.
 * perfTimeMs: vuruşun zamanı (performance.now() saatiyle)
 * firstBeatMs: ilk tıkın duyulması gereken zaman (aynı saatle)
 * latencyMs: kullanıcının girdiği gecikme düzeltmesi (tık geç duyuluyorsa pozitif)
 * Sayım ölçüsündeki vuruşlar için null döner.
 */
export function scoreHit(
  perfTimeMs: number,
  firstBeatMs: number,
  beatMs: number,
  stepsPerBeat: number,
  latencyMs: number,
  silentBars: number,
): ScoredHit | null {
  const stepMs = beatMs / stepsPerBeat;
  const origin = firstBeatMs + latencyMs;
  const step = Math.round((perfTimeMs - origin) / stepMs);

  if (step < COUNT_IN_BARS * BEATS_PER_BAR * stepsPerBeat) return null;

  const deviation = perfTimeMs - (origin + step * stepMs);
  const bar = Math.floor(step / (stepsPerBeat * BEATS_PER_BAR));
  return { deviation, silent: isSilentBar(bar, silentBars), bar, step };
}

export interface HitLike {
  deviation: number;
  silent: boolean;
}

export interface Summary {
  count: number;
  mean: number; // işaretli ortalama sapma (ms)
  stdDev: number; // tutarlılık: ne kadar küçükse o kadar düzenli
  goodPercent: number; // ±40 ms içindeki vuruşların yüzdesi
  meanAbsClick: number | null; // tıklı ölçülerde ortalama |sapma|
  meanAbsSilent: number | null; // sessiz ölçülerde ortalama |sapma|
}

function meanAbs(hits: HitLike[]): number | null {
  if (hits.length === 0) return null;
  return hits.reduce((sum, h) => sum + Math.abs(h.deviation), 0) / hits.length;
}

export function summarize(hits: HitLike[]): Summary | null {
  const count = hits.length;
  if (count === 0) return null;

  const mean = hits.reduce((sum, h) => sum + h.deviation, 0) / count;
  const variance = hits.reduce((sum, h) => sum + (h.deviation - mean) ** 2, 0) / count;
  const good = hits.filter((h) => Math.abs(h.deviation) <= 40).length;

  return {
    count,
    mean,
    stdDev: Math.sqrt(variance),
    goodPercent: (good / count) * 100,
    meanAbsClick: meanAbs(hits.filter((h) => !h.silent)),
    meanAbsSilent: meanAbs(hits.filter((h) => h.silent)),
  };
}

export function tendencyText(meanMs: number): string {
  const abs = Math.round(Math.abs(meanMs));
  if (abs < 5) return 'Ortalaman tam vuruşta, harika.';
  return meanMs < 0
    ? `Genelde ${abs} ms erken çalıyorsun (acele ediyorsun).`
    : `Genelde ${abs} ms geç çalıyorsun (geride kalıyorsun).`;
}
