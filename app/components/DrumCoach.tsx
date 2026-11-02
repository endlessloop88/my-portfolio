'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { Activity, Minus, Play, Plug, Plus, RotateCcw, Square } from 'lucide-react';
import {
  BEATS_PER_BAR,
  COUNT_IN_BARS,
  isSilentBar,
  rate,
  scoreHit,
  summarize,
  tendencyText,
  type Rating,
} from '../lib/timing';

const LOOKAHEAD_MS = 25; // zamanlayıcı kaç ms'de bir kontrol eder
const SCHEDULE_AHEAD_S = 0.1; // kaç saniye sonrasına kadar tıkları önceden planla
const MIN_BPM = 40;
const MAX_BPM = 200;
const MAX_STORED_HITS = 200;
const SILENT_OPTIONS = [0, 1, 2, 4];

// Vuruş sayılan tuşlar: Müzik Pedi'ndeki tuşlar + boşluk
const HIT_KEYS = new Set(['q', 'w', 'e', 'z', 'r', 't', 'a', 's', 'd', 'f', 'g', 'x', 'c', 'v', ' ']);

interface Hit {
  id: number;
  deviation: number;
  silent: boolean;
}

interface RunConfig {
  beatMs: number;
  startAudio: number; // ilk tıkın ses saatindeki zamanı (sn)
  stepsPerBeat: number;
  silentBars: number;
}

type MidiState = 'off' | 'on' | 'unsupported' | 'denied';

const RATING_STYLE: Record<Rating, { label: string; text: string; dot: string }> = {
  perfect: { label: 'Mükemmel', text: 'text-teal-300', dot: 'bg-teal-400' },
  good: { label: 'İyi', text: 'text-emerald-300', dot: 'bg-emerald-400' },
  ok: { label: 'Orta', text: 'text-amber-300', dot: 'bg-amber-400' },
  miss: { label: 'Kaçırdın', text: 'text-rose-300', dot: 'bg-rose-400' },
};

// Olay zamanını performance.now() saatine çevirir (bazı eski tarayıcılar epoch verir)
function stamp(eventTime: number): number {
  return eventTime > 1e11 ? performance.now() : eventTime;
}

// Ses saatinden (sn) performance.now() saatine (ms) geçiş: perf = audio * 1000 + offset.
// getOutputTimestamp varsa hoparlöre ulaşma zamanını (çıkış gecikmesi dahil) verir.
function audioToPerfOffset(ctx: AudioContext): number {
  if (typeof ctx.getOutputTimestamp === 'function') {
    const ts = ctx.getOutputTimestamp();
    if (ts.contextTime !== undefined && ts.performanceTime !== undefined && ts.performanceTime > 0) {
      return ts.performanceTime - ts.contextTime * 1000;
    }
  }
  const withLatency = ctx as AudioContext & { outputLatency?: number };
  const latencyMs = (withLatency.outputLatency ?? ctx.baseLatency ?? 0) * 1000;
  return performance.now() - ctx.currentTime * 1000 + latencyMs;
}

// Belirli bir zamana tek bir "tık" sesi planlar
function scheduleClick(ctx: AudioContext, time: number, accent: boolean, soft = false) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const peak = soft ? 0.25 : accent ? 0.9 : 0.6;

  osc.type = 'sine';
  osc.frequency.value = accent ? 1600 : 1000;
  gain.gain.setValueAtTime(0.0001, time);
  gain.gain.exponentialRampToValueAtTime(peak, time + 0.002);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.06);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(time);
  osc.stop(time + 0.08);
}

// Vuruş alanına/boşluğa basınca duyulan kısa davul benzeri ses
function playThump(ctx: AudioContext) {
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(170, now);
  osc.frequency.exponentialRampToValueAtTime(55, now + 0.12);
  gain.gain.setValueAtTime(0.7, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.2);
}

function TimingBar({ hits }: { hits: Hit[] }) {
  const recent = hits.slice(-16);

  return (
    <div className="w-full">
      <div className="relative h-12 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden">
        {/* ±40 ms ve ±20 ms bölgeleri (±100 ms = çubuğun yarısı) */}
        <div className="absolute inset-y-0 bg-emerald-500/10" style={{ left: '30%', width: '40%' }} />
        <div className="absolute inset-y-0 bg-teal-500/15" style={{ left: '40%', width: '20%' }} />
        <div className="absolute inset-y-0 left-1/2 w-px bg-slate-600" />
        {recent.map((hit, index) => {
          const clamped = Math.max(-100, Math.min(100, hit.deviation));
          const isLast = index === recent.length - 1;
          return (
            <div
              key={hit.id}
              className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full ${
                RATING_STYLE[rate(hit.deviation)].dot
              } ${isLast ? 'w-4 h-4' : 'w-2.5 h-2.5'}`}
              style={{ left: `${50 + (clamped / 100) * 50}%`, opacity: 0.35 + 0.65 * ((index + 1) / recent.length) }}
            />
          );
        })}
      </div>
      <div className="flex justify-between text-[10px] text-slate-500 mt-1">
        <span>← ERKEN</span>
        <span>tam vuruş</span>
        <span>GEÇ →</span>
      </div>
    </div>
  );
}

export default function DrumCoach() {
  const [bpm, setBpm] = useState(90);
  const [grid, setGrid] = useState<'quarter' | 'eighth'>('quarter');
  const [silentBars, setSilentBars] = useState(0);
  const [latencyMs, setLatencyMs] = useState(0);
  const [running, setRunning] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(-1);
  const [barSilent, setBarSilent] = useState(false);
  const [countIn, setCountIn] = useState(false);
  const [hits, setHits] = useState<Hit[]>([]);
  const [lastHit, setLastHit] = useState<Hit | null>(null);
  const [padFlash, setPadFlash] = useState(false);
  const [midiState, setMidiState] = useState<MidiState>('off');
  const [midiInputs, setMidiInputs] = useState(0);

  const ctxRef = useRef<AudioContext | null>(null);
  const cfgRef = useRef<RunConfig | null>(null);
  const perfOffsetRef = useRef(0);
  const latencyRef = useRef(0);
  const nextBeatTimeRef = useRef(0);
  const beatIndexRef = useRef(0);
  const hitIdRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const visualTimersRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());
  const midiRef = useRef<MIDIAccess | null>(null);

  useEffect(() => {
    latencyRef.current = latencyMs;
  }, [latencyMs]);

  // Bir vuruşu puanla ve ekrana işle (zaman: performance.now() saatiyle)
  const registerHit = useCallback((perfTime: number, withSound = false) => {
    const cfg = cfgRef.current;
    if (!cfg) return;

    if (withSound && ctxRef.current) playThump(ctxRef.current);
    setPadFlash(true);
    if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
    flashTimerRef.current = setTimeout(() => setPadFlash(false), 90);

    const firstBeatMs = cfg.startAudio * 1000 + perfOffsetRef.current;
    const scored = scoreHit(
      perfTime,
      firstBeatMs,
      cfg.beatMs,
      cfg.stepsPerBeat,
      latencyRef.current,
      cfg.silentBars,
    );
    if (!scored) return; // sayım ölçüsü: puanlanmaz

    const hit: Hit = { id: hitIdRef.current++, deviation: scored.deviation, silent: scored.silent };
    setHits((prev) => [...prev.slice(-(MAX_STORED_HITS - 1)), hit]);
    setLastHit(hit);
  }, []);

  // Küçük aralıklarla çalışıp önümüzdeki 0.1 sn içindeki tıkları sıraya koyar
  const scheduler = useCallback(() => {
    const ctx = ctxRef.current;
    const cfg = cfgRef.current;
    if (!ctx || !cfg) return;

    const beatSec = cfg.beatMs / 1000;
    while (nextBeatTimeRef.current < ctx.currentTime + SCHEDULE_AHEAD_S) {
      const beatIdx = beatIndexRef.current;
      const time = nextBeatTimeRef.current;
      const bar = Math.floor(beatIdx / BEATS_PER_BAR);
      const inBar = beatIdx % BEATS_PER_BAR;
      const silent = isSilentBar(bar, cfg.silentBars);

      if (!silent) {
        scheduleClick(ctx, time, inBar === 0);
        // sekizlik ızgarada aradaki "ve" vuruşuna hafif bir tık
        if (cfg.stepsPerBeat === 2) scheduleClick(ctx, time + beatSec / 2, false, true);
      }

      const delayMs = Math.max(0, (time - ctx.currentTime) * 1000);
      const timer = setTimeout(() => {
        setCurrentBeat(inBar);
        setBarSilent(silent);
        setCountIn(bar < COUNT_IN_BARS);
        visualTimersRef.current.delete(timer);
      }, delayMs);
      visualTimersRef.current.add(timer);

      nextBeatTimeRef.current += beatSec;
      beatIndexRef.current = beatIdx + 1;
    }
  }, []);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
    visualTimersRef.current.forEach((t) => clearTimeout(t));
    visualTimersRef.current.clear();
    cfgRef.current = null;
    ctxRef.current?.close();
    ctxRef.current = null;
    setRunning(false);
    setCurrentBeat(-1);
    setBarSilent(false);
    setCountIn(false);
  }, []);

  const start = useCallback(async () => {
    if (ctxRef.current) return;

    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
    const ctx = new AudioContextClass();
    ctxRef.current = ctx;
    await ctx.resume();

    const startAudio = ctx.currentTime + 0.25;
    perfOffsetRef.current = audioToPerfOffset(ctx);
    cfgRef.current = {
      beatMs: 60000 / bpm,
      startAudio,
      stepsPerBeat: grid === 'eighth' ? 2 : 1,
      silentBars,
    };
    nextBeatTimeRef.current = startAudio;
    beatIndexRef.current = 0;
    setHits([]);
    setLastHit(null);

    intervalRef.current = setInterval(scheduler, LOOKAHEAD_MS);
    // Ses çıkışı oturunca gecikme değeri değişebilir; bir kez yeniden ölç
    refreshTimerRef.current = setTimeout(() => {
      if (ctxRef.current) perfOffsetRef.current = audioToPerfOffset(ctxRef.current);
    }, 600);
    setRunning(true);
  }, [bpm, grid, silentBars, scheduler]);

  // Klavye: pad tuşları ve boşluk (çalışırken)
  useEffect(() => {
    if (!running) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat || e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        return;
      }
      const key = e.key.toLowerCase();
      if (!HIT_KEYS.has(key)) return;

      if (key === ' ') e.preventDefault(); // sayfa kaymasın
      // Pad tuşlarının sesini Müzik Pedi zaten çalar; sadece boşlukta kendi sesimizi çalarız
      registerHit(stamp(e.timeStamp), key === ' ');
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [running, registerHit]);

  // Fare / dokunma
  const handlePadDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!running) return;
    registerHit(stamp(e.nativeEvent.timeStamp), true);
  };

  // MIDI pad (Chrome / Edge): nota vuruşları da sayılır
  const connectMidi = async () => {
    if (typeof navigator === 'undefined' || typeof navigator.requestMIDIAccess !== 'function') {
      setMidiState('unsupported');
      return;
    }
    try {
      const access = await navigator.requestMIDIAccess();
      midiRef.current = access;

      const handler = (event: MIDIMessageEvent) => {
        const data = event.data;
        if (!data || data.length < 3) return;
        const isNoteOn = (data[0] & 0xf0) === 0x90 && data[2] > 0;
        if (isNoteOn) registerHit(stamp(event.timeStamp), false);
      };
      const attach = () => {
        let count = 0;
        access.inputs.forEach((input) => {
          input.onmidimessage = handler;
          count += 1;
        });
        setMidiInputs(count);
      };
      attach();
      access.onstatechange = attach;
      setMidiState('on');
    } catch {
      setMidiState('denied');
    }
  };

  // Sayfadan ayrılırken her şeyi temizle
  useEffect(() => {
    const timers = visualTimersRef.current;
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
      if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
      timers.forEach((t) => clearTimeout(t));
      timers.clear();
      ctxRef.current?.close();
      ctxRef.current = null;
      midiRef.current?.inputs.forEach((input) => {
        input.onmidimessage = null;
      });
    };
  }, []);

  const changeBpm = (value: number) => setBpm(Math.min(MAX_BPM, Math.max(MIN_BPM, value)));
  const summary = useMemo(() => summarize(hits), [hits]);
  const lastRating = lastHit ? RATING_STYLE[rate(lastHit.deviation)] : null;

  const optionButton = (active: boolean) =>
    `px-3 py-1.5 rounded-lg text-xs font-medium border transition disabled:opacity-40 disabled:cursor-not-allowed ${
      active
        ? 'bg-teal-500/20 border-teal-500/60 text-teal-300'
        : 'bg-slate-950 border-slate-700 text-slate-300 hover:border-slate-500'
    }`;

  return (
    <div className="bg-slate-900/60 p-6 md:p-8 rounded-3xl border border-slate-800 space-y-6">
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Activity className="text-teal-400" size={24} /> Ritim Koçu
          </h3>
          <span className="text-xs bg-teal-500/10 text-teal-400 px-3 py-1 rounded-full border border-teal-500/30">
            Yeni
          </span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Tıkla birlikte çal, vuruşlarının tam zamanında olup olmadığını milisaniye cinsinden gör. Pad
          tuşları, boşluk, fare/dokunma ya da USB MIDI pad ile çalışır. İlk ölçü sayımdır, puanlanmaz.
        </p>
      </div>

      {/* Ayarlar */}
      <div className="grid md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <span className="text-xs text-slate-400">Tempo</span>
          <div className="flex items-center gap-4">
            <button
              type="button"
              disabled={running}
              onClick={() => changeBpm(bpm - 1)}
              className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition disabled:opacity-40"
              aria-label="Tempoyu 1 azalt"
            >
              <Minus size={16} />
            </button>
            <div className="text-center min-w-[72px]">
              <span className="text-3xl font-extrabold text-slate-100">{bpm}</span>
              <span className="text-[10px] text-slate-400 block">BPM</span>
            </div>
            <button
              type="button"
              disabled={running}
              onClick={() => changeBpm(bpm + 1)}
              className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition disabled:opacity-40"
              aria-label="Tempoyu 1 artır"
            >
              <Plus size={16} />
            </button>
          </div>
          <input
            type="range"
            min={MIN_BPM}
            max={MAX_BPM}
            value={bpm}
            disabled={running}
            onChange={(e) => changeBpm(Number(e.target.value))}
            className="w-full accent-teal-400 cursor-pointer disabled:opacity-40"
          />
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <span className="text-xs text-slate-400">Izgara (neye vuracaksın)</span>
            <div className="flex gap-2">
              <button type="button" disabled={running} onClick={() => setGrid('quarter')} className={optionButton(grid === 'quarter')}>
                Dörtlükler
              </button>
              <button type="button" disabled={running} onClick={() => setGrid('eighth')} className={optionButton(grid === 'eighth')}>
                Sekizlikler
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <span className="text-xs text-slate-400">Sessiz ölçüler (tık kesilince tempoyu koru)</span>
            <div className="flex gap-2 flex-wrap">
              {SILENT_OPTIONS.map((n) => (
                <button key={n} type="button" disabled={running} onClick={() => setSilentBars(n)} className={optionButton(silentBars === n)}>
                  {n === 0 ? 'Kapalı' : `${n} ölçü`}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-xs text-slate-400">
          <span>Gecikme düzeltmesi (Bluetooth kulaklık gibi durumlarda tık geç duyuluyorsa artırın)</span>
          <span className="text-slate-200">{latencyMs} ms</span>
        </div>
        <input
          type="range"
          min={-100}
          max={300}
          step={5}
          value={latencyMs}
          onChange={(e) => setLatencyMs(Number(e.target.value))}
          className="w-full accent-teal-400 cursor-pointer"
        />
      </div>

      {/* Kontroller */}
      <div className="flex flex-wrap items-center gap-3">
        {running ? (
          <button
            type="button"
            onClick={stop}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-500/90 hover:bg-rose-500 text-white text-sm font-semibold transition"
          >
            <Square size={16} /> Durdur
          </button>
        ) : (
          <button
            type="button"
            onClick={(e) => {
              e.currentTarget.blur(); // boşluk tuşu bu düğmeyi tetiklemesin
              start();
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-sm font-semibold transition"
          >
            <Play size={16} /> Başlat
          </button>
        )}
        <button
          type="button"
          onClick={() => {
            setHits([]);
            setLastHit(null);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm transition"
        >
          <RotateCcw size={15} /> Sıfırla
        </button>
        <button
          type="button"
          onClick={connectMidi}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm transition"
        >
          <Plug size={15} /> MIDI pad bağla
        </button>
        <span className="text-[11px] text-slate-500">
          {midiState === 'on' && `MIDI hazır (${midiInputs} giriş)`}
          {midiState === 'unsupported' && 'Bu tarayıcı MIDI desteklemiyor (Chrome/Edge deneyin).'}
          {midiState === 'denied' && 'MIDI izni verilmedi.'}
        </span>
      </div>

      {/* Vuruş alanı + geri bildirim */}
      <div className="grid md:grid-cols-2 gap-5">
        <div
          onPointerDown={handlePadDown}
          className={`touch-none select-none rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center p-6 min-h-[150px] transition cursor-pointer ${
            running
              ? padFlash
                ? 'bg-teal-500/25 border-teal-400'
                : 'bg-slate-950 border-teal-500/50'
              : 'bg-slate-950/60 border-slate-700'
          }`}
        >
          <div className="flex gap-3 h-6 items-center mb-3">
            {Array.from({ length: BEATS_PER_BAR }).map((_, i) => (
              <div
                key={i}
                className={`w-4 h-4 rounded-full border-2 transition-all duration-100 ${
                  currentBeat === i
                    ? i === 0
                      ? 'bg-teal-400 border-teal-200 scale-125'
                      : 'bg-slate-100 border-slate-300 scale-125'
                    : i === 0
                    ? 'bg-slate-950 border-teal-500/60'
                    : 'bg-slate-950 border-slate-700'
                }`}
              />
            ))}
          </div>
          <p className="text-sm font-semibold text-slate-200">
            {!running && 'Başlat\u0027a bas, sonra buraya vur'}
            {running && countIn && 'Sayım: tıkları dinle'}
            {running && !countIn && barSilent && 'SESSİZ ÖLÇÜ: tempoyu koru'}
            {running && !countIn && !barSilent && 'Şimdi çal'}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">tıkla / dokun / pad tuşları / boşluk</p>
        </div>

        <div className="space-y-4">
          <div className="text-center min-h-[72px]" aria-live="polite">
            {lastHit && lastRating ? (
              <>
                <div className={`text-4xl font-extrabold ${lastRating.text}`}>
                  {lastHit.deviation > 0 ? '+' : ''}
                  {Math.round(lastHit.deviation)} ms
                </div>
                <div className="text-sm text-slate-300 mt-1">
                  {lastRating.label}
                  {Math.abs(lastHit.deviation) > 5 && (lastHit.deviation < 0 ? ' · erken' : ' · geç')}
                </div>
              </>
            ) : (
              <div className="text-sm text-slate-500 pt-5">Son vuruşun sapması burada görünür</div>
            )}
          </div>
          <TimingBar hits={hits} />
        </div>
      </div>

      {/* İstatistikler */}
      {summary ? (
        <div className="space-y-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 text-center">
              <div className="text-xl font-bold text-slate-100">{summary.count}</div>
              <div className="text-[10px] text-slate-400">vuruş</div>
            </div>
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 text-center">
              <div className="text-xl font-bold text-slate-100">%{Math.round(summary.goodPercent)}</div>
              <div className="text-[10px] text-slate-400">isabet (±40 ms)</div>
            </div>
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 text-center">
              <div className="text-xl font-bold text-slate-100">{Math.round(summary.stdDev)} ms</div>
              <div className="text-[10px] text-slate-400">tutarlılık (düşük = düzenli)</div>
            </div>
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 text-center">
              <div className="text-xl font-bold text-slate-100">
                {summary.mean > 0 ? '+' : ''}
                {Math.round(summary.mean)} ms
              </div>
              <div className="text-[10px] text-slate-400">ortalama sapma</div>
            </div>
          </div>
          <p className="text-sm text-slate-300">{tendencyText(summary.mean)}</p>
          {summary.meanAbsSilent !== null && summary.meanAbsClick !== null && (
            <p className="text-xs text-slate-400">
              Ortalama sapma: tıklı ölçülerde {Math.round(summary.meanAbsClick)} ms, sessiz ölçülerde{' '}
              {Math.round(summary.meanAbsSilent)} ms.
            </p>
          )}
          {summary.count < 8 && (
            <p className="text-[11px] text-slate-500">İstatistikler en az 8 vuruştan sonra daha anlamlı olur.</p>
          )}
        </div>
      ) : (
        <p className="text-xs text-slate-500">
          Ölçüt: ±20 ms mükemmel, ±40 ms iyi, ±70 ms orta. Tarayıcı ve cihaz gecikmeleri yüzünden ölçümler
          yaklaşıktır.
        </p>
      )}
    </div>
  );
}
