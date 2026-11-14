'use client';
// Signature: Before and after: the raw neon-horizon-master.mp3 upload on one side, what one conversation made of it on the other, and a divider you drag (or arrow) across them; the three steps choose what the upload became
// Beyond: One brief: write your own brief once, choose the artifacts you want, and the set one conversation hands back is laid out with each one's format and the model behind it
/* Hanzo Design, v2 (Archetype A, launch: the workspace is the product).
   Persona: a marketer or founder who has raw files (a track, a photo, a PDF) and needs decks, docs, ads and visuals from them.
   Goal: watch one conversation turn one upload into every artifact, then open Design.
   CTA: "Open Design" (/design), the one solid button, in the hero and the closing Band.
   Metric: signup_start
   V2: 8/10 motion map: compare — the pinned three-chapter scene is gone; "What is Hanzo Design" is a before/after divider over the raw upload and what it became, driven by the three steps; the capability sheets no longer stack on scroll. Earlier: round 2: the workspace window left and a 52px headline right, both in the first screen; one ask with text links; no labels over headlines; kit media; a pause control; the models' black room opens from a card; ends on one Band. Round 1: editorial 5/7 hero, oversized type running into a workspace window whose artifact morphs by itself; three pinned chapters; the six capabilities as sticky stacked sheets; One brief kept as the Beyond; the models in the one dark room open into their pages
   Motion: signature = the workspace window (the frame morphs to each artifact's shape, the headline's word follows). Supporting:
   the before/after divider, line-masked headline, one entrance per section. Greys only; colour comes from Hanzo's model media.
   The music app is live: its spectrum dances to 124 BPM and the four synth pads play. Every word is Hanzo's; the brief is yours. */
import { useEffect, useRef, useState } from 'react';
import type { ElementType, KeyboardEvent, MouseEvent, RefObject } from 'react';
import { motion, AnimatePresence, useInView, useScroll, useTransform } from 'motion/react';
import { Copy, Mark, useCalm } from '../ui';
import { A, More, Cta, Img, Film } from '../kit';
import { useOpener } from '../Opener';
import '../v2/AppType.css';
import './DesignPage.css';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const TABS = ['Music App', 'Presentation', 'Ad Suite', 'Visual', 'Document', 'Video'];
const KIND = ['app', 'deck', 'ad', 'visual', 'doc', 'video'];
const BADGE = ['HTML5 app', '16:9 deck', 'Multi-aspect ads', 'Iro', 'Vector PDF', 'MP4'];
const PADS = ['Sub Bass', 'Warm Pad', 'Arp Pluck', 'Air Shimmer'];
const MODES = ['BARS', 'WAVE', 'RADIAL'];
const N = 40;
const DWELL = 5200;

/* A synth pad: one short note in F# minor, made in the browser. */
function useSynth() {
  const ctx = useRef<AudioContext | null>(null);
  return (i: number) => {
    try {
      const AC: typeof AudioContext = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext!; // Safari before 14.1
      const C = ctx.current || (ctx.current = new AC());
      const t = C.currentTime, o = C.createOscillator(), g = C.createGain();
      const waves: OscillatorType[] = ['sine', 'triangle', 'sawtooth', 'sine'];
      o.type = waves[i];
      o.frequency.value = [46.25, 185, 554.37, 1479.98][i];
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(i === 2 ? 0.04 : 0.1, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + (i === 1 ? 1.4 : 0.8));
      o.connect(g).connect(C.destination);
      o.start(t); o.stop(t + 1.5);
    } catch { /* no audio on this device: the spectrum still answers the press */ }
  };
}

/* The spectrum: 40 bands moving to a 124 BPM pulse, written straight to the bars (no React state per frame). */
function Spectrum({ mode, live, energy }: { mode: number; live: boolean; energy: RefObject<number> }) {
  const bars = useRef<(HTMLElement | null)[]>([]);
  const wave = useRef<SVGPathElement>(null);
  useEffect(() => {
    if (!live) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const s = (t - t0) / 1000;
      const beat = Math.pow(Math.max(0, Math.sin(s * Math.PI * (124 / 60))), 8);
      const e = energy.current; energy.current *= 0.93;
      const v: number[] = [];
      for (let i = 0; i < N; i++) {
        const f = i / N;
        const x = 0.18 + (1 - f) * 0.5 * beat + 0.14 * Math.sin(s * (2 + f * 5) + i) + 0.1 * Math.sin(s * 7.3 + i * 1.7) + e * (0.55 - Math.abs(f - 0.3) * 0.5);
        v.push(Math.min(1, Math.max(0.05, x)));
      }
      if (mode === 2) bars.current.forEach((b, i) => b && (b.style.transform = `rotate(${i * 9}deg) translateY(-34%) scaleY(${v[i]})`));
      else if (mode === 0) bars.current.forEach((b, i) => b && (b.style.transform = `scaleY(${v[i]})`));
      else if (wave.current) wave.current.setAttribute('d', 'M0 50 ' + v.map((y, i) => `L${(i / (N - 1)) * 400} ${50 + (i % 2 ? -1 : 1) * y * 44}`).join(' '));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [mode, live, energy]);
  if (mode === 1) {
    return (
      <svg className="dz-wave" viewBox="0 0 400 100" preserveAspectRatio="none" aria-hidden="true">
        <path ref={wave} d="M0 50 L400 50" fill="none" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <div className={'dz-spec' + (mode === 2 ? ' radial' : '')} aria-hidden="true">
      {Array.from({ length: N }).map((_, i) => (
        <i key={i} ref={(el) => { bars.current[i] = el; }} style={{ transform: mode === 2 ? `rotate(${i * 9}deg) translateY(-34%) scaleY(.3)` : `scaleY(${0.2 + ((i * 37) % 11) / 20})` }} />
      ))}
    </div>
  );
}

function MusicApp({ live }: { live: boolean }) {
  const [mode, setMode] = useState(0);
  const [hit, setHit] = useState(-1);
  const energy = useRef(0);
  const synth = useSynth();
  return (
    <div className="dz-app">
      <div className="dz-app-top">
        <span className="dz-disc" aria-hidden="true"><Img src="/models/uta.webp" alt="" w={1200} h={1500} /></span>
        <div>
          <h3>Neon Horizon Player</h3>
          <p>Interactive HTML5 WebAudio + Canvas app with real-time 60fps FFT spectrum, waveform scrubber, 3-band EQ, and 4 playable synth pads.</p>
        </div>
      </div>
      <div className="dz-track">
        <span className="dz-track-t">Neon Horizon (Master Stem)</span>
        <span className="x-mono">124 BPM · F# Minor · WebAudio 60fps FFT Visualizer</span>
      </div>
      <div className="dz-viz">
        <Spectrum mode={mode} live={live} energy={energy} />
        <div className="dz-modes" role="tablist" aria-label="Visualizer">
          {MODES.map((m, i) => <button key={m} type="button" role="tab" aria-selected={mode === i} onClick={() => setMode(i)}>{m}</button>)}
        </div>
      </div>
      <div className="dz-pads">
        {PADS.map((p, i) => (
          <motion.button key={p} type="button" data-sound="" className={hit === i ? 'on' : ''} whileTap={{ scale: 0.94 }}
            onClick={() => { energy.current = 1; synth(i); setHit(i); setTimeout(() => setHit((h) => (h === i ? -1 : h)), 380); }}>{p}</motion.button>
        ))}
      </div>
      <p className="dz-eq x-mono">LOW +2.5 dB · MID 0.0 dB · HIGH +1.8 dB</p>
    </div>
  );
}

function Deck({ live }: { live: boolean }) {
  const [s, setS] = useState(0);
  useEffect(() => {
    if (!live) return;
    const t = setTimeout(() => setS((v) => (v + 1) % 4), 1300);
    return () => clearTimeout(t);
  }, [live, s]);
  return (
    <div className="dz-deck">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div key={s} className="dz-slide" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.5, ease: EASE }}>
          <Img src={['/models/uta.webp', '/models/oto.webp', '/models/koe.webp', '/models/iro.webp'][s]} alt="" w={1200} h={1500} />
          <span className="dz-slide-t">Neon Horizon</span>
          <span className="dz-slide-m x-mono">124 BPM · F# Minor</span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function Ads() {
  return (
    <div className="dz-ads">
      {[['9:16', 'story'], ['1:1', 'square'], ['16:9', 'banner']].map(([r, k], i) => (
        <motion.div key={k} className={'dz-ad ' + k} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE, delay: 0.35 + i * 0.08 }}>
          <Img src="/models/uta.webp" alt="" w={1200} h={1500} />
          <span className="dz-ad-t">Neon Horizon</span>
        </motion.div>
      ))}
    </div>
  );
}

function Poster() {
  return (
    <div className="dz-poster">
      <Img src="/models/iro.webp" alt="" w={1200} h={1500} />
      <span className="dz-poster-t">Neon<br />Horizon</span>
      <span className="dz-poster-m x-mono">124 BPM · F# Minor</span>
    </div>
  );
}

function Doc() {
  return (
    <div className="dz-doc">
      <span className="x-mono dz-doc-k">Neon Horizon (Master Stem)</span>
      <span className="dz-doc-h">Neon Horizon</span>
      <span className="x-mono dz-doc-m">124 BPM · F# Minor</span>
      <Img src="/models/uta.webp" alt="" w={1200} h={1500} />
      {[92, 100, 96, 70, 100, 88, 54].map((w, i) => <motion.i key={i} style={{ width: w + '%' }} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.7, ease: EASE, delay: 0.45 + i * 0.06 }} />)}
    </div>
  );
}

function Clip({ live }: { live: boolean }) {
  return (
    <div className="dz-film">
      <div className="dz-film-v">
        {live ? <Film src="/models/koma.webm" poster="/models/koma.webp" w={1200} h={1500} /> : <Img src="/models/koma.webp" alt="" w={1200} h={1500} />}
      </div>
      <div className="dz-tl" aria-hidden="true">{[34, 22, 28, 16].map((w, i) => <i key={i} style={{ flexGrow: w }} />)}<b /></div>
    </div>
  );
}

/* ---------- the signature: one conversation, the artifact morphing in its window ---------- */
/* Each artifact's shape inside the stage: [width share, height share, aspect]; the missing side follows the aspect. */
const SHAPE: Record<string, [number, number, number]> = { app: [1, 1, 0], deck: [0.84, 0, 16 / 9], ad: [1, 0.92, 0], visual: [0, 1, 0.8], doc: [0, 1, 0.74], video: [0.88, 0, 1.6] };
function shapeOf(k: string, W: number, H: number) {
  const [fw, fh, ar] = SHAPE[k];
  let w = fw ? W * fw : 0, h = fh ? H * fh : 0;
  if (!w) w = h * ar;
  if (!h) h = w / ar;
  if (w > W) { w = W; if (ar) h = w / ar; }
  if (h > H) { h = H; if (ar) w = h * ar; }
  const left = Math.round((W - w) / 2), top = Math.round((H - h) / 2);
  return { left, top, width: Math.round(w), height: Math.round(h), right: Math.round(W - left - w), bottom: Math.round(H - top - h) };
}
function useSize(ref: RefObject<HTMLElement | null>) {
  const [s, setS] = useState<[number, number] | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setS([e.contentRect.width, e.contentRect.height]));
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return s;
}

function Workspace({ at, pick, live, mine, calm, paused, onPause }: { at: number; pick: (i: number) => void; live: boolean; mine: boolean; calm: boolean; paused: boolean; onPause: () => void }) {
  const frame = useRef<HTMLDivElement>(null);
  const size = useSize(frame);
  const r = size && shapeOf(KIND[at], size[0], size[1]);
  const art = [<MusicApp key="a" live={live && at === 0} />, <Deck key="d" live={live && at === 1} />, <Ads key="ad" />, <Poster key="p" />, <Doc key="doc" />, <Clip key="f" live={live && at === 5} />][at];
  const key = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const arrows: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1 };
    const n = arrows[e.key]; if (!n) return;
    const j = (i + n + TABS.length) % TABS.length; pick(j);
    (e.currentTarget.parentElement?.children[j] as HTMLElement | undefined)?.focus();
  };
  return (
    <div className="dz-win">
      <div className="dz-bar">
        <button type="button" className="dz-pause" aria-pressed={paused} aria-label={paused ? 'Play' : 'Pause'} onClick={onPause}>
          {paused
            ? <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M4.5 3v10l8.5-5z" fill="currentColor" /></svg>
            : <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><rect x="4" y="3" width="2.6" height="10" rx="1" fill="currentColor" /><rect x="9.4" y="3" width="2.6" height="10" rx="1" fill="currentColor" /></svg>}
        </button>
        <div className="dz-tabs" role="tablist" aria-label="Artifacts">
          {TABS.map((t, i) => (
            <button key={t} type="button" role="tab" aria-selected={at === i} aria-controls="dz-art" tabIndex={at === i ? 0 : -1} onClick={() => pick(i)} onKeyDown={(e) => key(e, i)}>
              {at === i && <motion.span layoutId="dz-tab" className="dz-tab-bg" transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} />}
              <span>{t}</span>
              {at === i && !mine && !calm && <i key={'p' + at} className={'dz-tab-t' + (live ? '' : ' paused')} aria-hidden="true" />}
            </button>
          ))}
        </div>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span key={at} className="dz-badge x-mono" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3, ease: EASE }}>{BADGE[at]}</motion.span>
        </AnimatePresence>
      </div>
      <div className="dz-stage" id="dz-art" role="tabpanel" aria-label={TABS[at]}>
        {/* The frame's box never moves (no layout shift): its shape is a clip-path that morphs, and each new artifact
            mounts straight into the new shape's rectangle. */}
        <div ref={frame} className={'dz-frame k-' + KIND[at]} style={r ? { clipPath: `inset(${r.top}px ${r.right}px ${r.bottom}px ${r.left}px round 16px)` } : undefined}>
          <AnimatePresence initial={false}>
            <motion.div key={at} className="dz-art" style={r ? { left: r.left, top: r.top, width: r.width, height: r.height } : undefined}
              initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1, transition: { duration: 0.45, ease: EASE, delay: 0.4 } }} exit={{ opacity: 0, transition: { duration: 0.15 } }}>
              {art}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <div className="dz-chat">
        <div className="dz-file"><span className="dz-file-i" aria-hidden="true">♪</span><span className="x-mono">neon-horizon-master.mp3 (4.8 MB)</span></div>
        <p className="dz-msg">Uploaded neon-horizon-master.mp3 — build a full interactive music player app with a 60fps FFT spectrum visualizer, 3-band EQ, and synth pads.</p>
        <div className="dz-drop"><span aria-hidden="true">＋</span><span>Drop audio, image, PDF, CSV or video</span></div>
      </div>
    </div>
  );
}

/* ---------- section entrances (motion map: drop-in, explode-gather, opposite-drift, word-shuffle, count-roll) ----------
   Each main section arrives its own way, once, when about a third of it is in view. The server and the first render show
   the final state; the start state is set on the element after mount (data-enter="pre"), so JS-off and reduced motion
   simply show the section. */
function useEnter(onGo?: (el: HTMLElement) => void) {
  const ref = useRef<HTMLElement>(null);
  const calm = useCalm();
  const go = useRef(onGo); go.current = onGo;
  useEffect(() => {
    const el = ref.current;
    if (!el || calm) return;
    if (el.getBoundingClientRect().top < innerHeight * 0.7) return; // already on screen: leave it be
    el.dataset.enter = 'pre';
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      el.dataset.enter = 'go';
      go.current?.(el);
    }, { rootMargin: '0px 0px -25% 0px' }); // a tall section (the capabilities on a phone) never shows 30% of itself
    io.observe(el);
    return () => { io.disconnect(); delete el.dataset.enter; };
  }, [calm]);
  return ref;
}

/* word-shuffle: each word starts where another word sits and swaps into its own place (FLIP), text unchanged */
function Shuffle({ text, as: Tag = 'p', className }: { text: string; as?: ElementType; className?: string }) {
  const words = text.split(' ');
  return <Tag className={className}>{words.map((w, i) => <span key={i} className="dz-sw">{w}{i < words.length - 1 ? ' ' : ''}</span>)}</Tag>;
}
function shuffleIn(root: HTMLElement) {
  root.querySelectorAll<HTMLElement>('.dz-shuf').forEach((line, li) => {
    const ws = [...line.querySelectorAll<HTMLElement>('.dz-sw')];
    if (ws.length < 2) return;
    const pos = ws.map((w) => [w.offsetLeft, w.offsetTop]);
    const perm = ws.map((_, i) => (i * 3 + 1 + li) % ws.length);
    ws.forEach((w, i) => { w.style.transition = 'none'; w.style.transform = `translate(${pos[perm[i]][0] - pos[i][0]}px, ${pos[perm[i]][1] - pos[i][1]}px)`; w.style.opacity = '0.4'; });
    void line.offsetWidth;
    ws.forEach((w, i) => {
      w.style.transition = `transform .8s cubic-bezier(.16,1,.3,1) ${0.1 + i * 0.05}s, opacity .4s ease ${0.1 + i * 0.05}s`;
      w.style.transform = ''; w.style.opacity = '';
    });
  });
}

/* count-roll: each sheet's "0n / 06" rolls up from 00 to its value, one digit at a time */
function rollIn(root: HTMLElement) {
  root.querySelectorAll<HTMLElement>('.dz-sheet-n').forEach((el, k) => {
    const end = el.textContent || '';
    const n = parseInt(end, 10);
    let v = 0;
    const step = () => {
      el.textContent = String(v).padStart(2, '0') + end.slice(2);
      el.classList.remove('roll'); void el.offsetWidth; el.classList.add('roll');
      if (v < n) { v += 1; setTimeout(step, 110); }
    };
    setTimeout(step, 120 + k * 90);
  });
}

/* The h1 is one line of Hanzo's text (it breaks where the old line masks broke). Its words are also the tabs: an ink
   block sits over the word whose artifact is on screen, holding a white copy of the headline clipped to that word, so
   the word reads white on ink; it is measured from the text itself, and pointing at a word picks its tab. It wipes in from the top at first paint (CSS). */
const H1 = 'Create visuals,\ndecks, docs, ads,\nvideos &\ninteractive apps';
const H1W: [string, number][] = [['visuals', 3], ['decks', 1], ['docs', 4], ['ads', 2], ['videos', 5], ['interactive apps', 0]];
type Mark = { l: number; t: number; w: number; h: number };
function Headline({ at, pick }: { at: number; pick: (i: number) => void }) {
  const box = useRef<HTMLHeadingElement>(null);
  const txt = useRef<HTMLSpanElement>(null);
  const [rs, setRs] = useState<{ W: number; r: Record<number, Mark> } | null>(null);
  useEffect(() => {
    const node = txt.current?.firstChild;
    const el = box.current;
    if (!node || !el) return;
    const measure = () => {
      const b = el.getBoundingClientRect();
      const px = parseFloat(getComputedStyle(el).fontSize) * 0.06;
      const r: Record<number, Mark> = {};
      H1W.forEach(([w, k]) => {
        const i = H1.indexOf(w);
        const g = document.createRange(); g.setStart(node, i); g.setEnd(node, i + w.length);
        const q = [...g.getClientRects()]; if (!q.length) return;
        r[k] = { l: q[0].left - b.left - px, t: q[0].top - b.top + px, w: q[q.length - 1].right - q[0].left + 2 * px, h: q[0].height - 2 * px };
      });
      setRs({ W: b.width, r });
    };
    measure();
    const ro = new ResizeObserver(measure); ro.observe(el);
    document.fonts?.ready.then(measure);
    return () => ro.disconnect();
  }, []);
  const hit = (e: MouseEvent<HTMLElement>) => {
    const b = box.current?.getBoundingClientRect();
    if (!rs || !b) return -1;
    const x = e.clientX - b.left, y = e.clientY - b.top;
    const f = Object.entries(rs.r).find(([, r]) => x >= r.l && x <= r.l + r.w && y >= r.t && y <= r.t + r.h);
    return f ? +f[0] : -1;
  };
  const r = rs && rs.r[at];
  return (
    <h1 id="dz-h1" ref={box} className="dz-h1" onClick={(e) => { const k = hit(e); if (k >= 0) pick(k); }} onMouseMove={(e) => { e.currentTarget.style.cursor = hit(e) >= 0 ? 'pointer' : ''; }}>
      <span ref={txt} className="dz-h1-t">{H1}</span>
      {r && (
        <span className="dz-hl" aria-hidden="true" style={{ left: r.l, top: r.t, width: r.w, height: r.h }}>
          <span className="dz-hl-t" style={{ left: -r.l, top: -r.t, width: rs.W }}>{H1}</span>
        </span>
      )}
    </h1>
  );
}

function Hero() {
  const [at, setAtS] = useState(0);
  const [mine, setMine] = useState(false);
  const [paused, setPaused] = useState(false);
  const calm = useCalm();
  const box = useRef<HTMLElement>(null);
  const seen = useInView(box, { amount: 0.3 });
  const live = seen && !calm && !paused;
  const pick = (i: number) => { setAtS(i); setMine(true); };
  useEffect(() => {
    if (mine || !live) return;
    const t = setTimeout(() => setAtS((v) => (v + 1) % TABS.length), DWELL);
    return () => clearTimeout(t);
  }, [at, mine, live]);
  return (
    <section className="dz-hero" ref={box} aria-labelledby="dz-h1">
      <div className="av-wrap dz-hero-g">
        <motion.div className="dz-win-wrap" data-morph-target="" initial={calm ? false : { clipPath: 'inset(6% 0 0 0 round 24px)', opacity: 0, y: 24 }} animate={{ clipPath: 'inset(0% 0 0 0 round 24px)', opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}>
          <Workspace at={at} pick={pick} live={live} mine={mine} calm={calm} paused={paused} onPause={() => setPaused((p) => !p)} />
        </motion.div>
        <div className="dz-hero-t">
          <Headline at={at} pick={pick} />
          <p className="dz-lede">Your AI design studio inside Hanzo. Upload any file — a music track, product photo, PDF, or dataset — and turn it into visuals, presentations, documents, ads, videos, or a full-blown interactive music &amp; visualizer app.</p>
          <div className="dz-acts">
            <Cta to="/design" id="design-hero-open" thumb>Open Design</Cta>
            <Cta to="https://docs.hanzo.ai/docs/apps/design" kind="link" id="design-hero-docs">Read the docs</Cta>
          </div>
          <p className="dz-studio"><A to="https://studio.hanzo.ai" data-cta="design-hero-studio">Need full multi-shot AI cinema &amp; camera rigs? Open studio.hanzo.ai.</A></p>
        </div>
      </div>
      <div className="av-wrap av-grid dz-under">
        <span className="dz-cap x-mono">Hanzo Design · Creative AI Workspace</span>
        <ul className="dz-facts">
          {['Visuals, images, posters, presentations, documents, ads, video & music in tabs', 'Upload any file — even an MP3/WAV track to build a full interactive music player & visualizer app', 'Export vector PDFs, 16:9 slide decks, multi-aspect ads, MP4 clips, and standalone HTML5 apps'].map((t, i) => (
            <li key={t}><span className="x-mono av-num">{String(i + 1).padStart(2, '0')}</span><span>{t}</span></li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------- what it is: three pinned chapters ---------- */
function Files({ on }: { on: boolean }) {
  return (
    <div className={'dz-vis dz-files' + (on ? ' on' : '')} aria-hidden="true">
      <div className="dz-files-in">{['.mp3', '.wav', '.flac', 'PDF', 'CSV', 'JSON'].map((f, k) => <span key={f} className="x-mono" style={{ '--k': k }}>{f}</span>)}</div>
      <div className="dz-slot"><span className="dz-file-i">♪</span><span className="x-mono">neon-horizon-master.mp3 (4.8 MB)</span></div>
    </div>
  );
}
function Shapes({ on }: { on: boolean }) {
  return (
    <div className={'dz-vis dz-shapes' + (on ? ' on' : '')} aria-hidden="true">
      <span className="deck"><Img src="/models/oto.webp" alt="" w={1200} h={1500} /></span>
      <span className="doc"><b />{[90, 100, 84, 100, 62, 92, 70].map((w, j) => <i key={j} style={{ width: w + '%' }} />)}</span>
      <span className="ad"><Img src="/models/mori.webp" alt="" w={1200} h={1500} /></span>
    </div>
  );
}
function Eq({ on }: { on: boolean }) {
  return (
    <div className={'dz-vis dz-eqv' + (on ? ' on' : '')} aria-hidden="true">
      <div className="dz-eq-bars">{Array.from({ length: 24 }).map((_, k) => <i key={k} style={{ animationDelay: -k * 0.13 + 's', animationDuration: 0.6 + (k % 4) * 0.17 + 's' }} />)}</div>
      <div className="dz-eq-pads">{PADS.map((p) => <span key={p}>{p}</span>)}</div>
    </div>
  );
}

const STEPS = [
  { title: 'Upload any content', body: <p className="av-body">Drop in audio (.mp3, .wav, .flac), images, video clips, PDFs, Office docs, or CSV/JSON data. Every uploaded file is wired directly into the visuals, decks, and apps you create.</p>, visual: (on: boolean) => <Files on={on} /> },
  { title: 'Presentations, documents & ads', body: <p className="av-body">Generate 16:9 keynote slide decks, typeset brand &amp; technical documents with vector PDF export, and multi-format social and display ad campaigns.</p>, visual: (on: boolean) => <Shapes on={on} /> },
  { title: 'Interactive music & visual apps', body: <p className="av-body">Upload a song or audio stem and build a full-blown interactive WebAudio music app with a 60fps FFT spectrum visualizer, waveform scrubber, 3-band EQ, and playable synth pads.</p>, visual: (on: boolean) => <Eq on={on} /> },
];

/* ---------- the signature: before / after. The raw upload on one side, what one conversation made of it on the other;
   drag the divider (or use the arrow keys) across them. The step you choose decides what the upload became. ---------- */
function Compare({ step }: { step: number }) {
  const box = useRef<HTMLDivElement>(null);
  const calm = useCalm();
  const seen = useInView(box, { amount: 0.5, once: true });
  const [x, setX] = useState(50);
  const [held, setHeld] = useState(false);
  const [hinted, setHinted] = useState(false);
  // once, on arrival: the divider sweeps from the raw side to the middle, so the drag is obvious
  useEffect(() => {
    if (!seen || calm || hinted) return;
    setHinted(true);
    let raf = 0; const t0 = performance.now();
    const run = (t: number) => {
      const k = Math.min(1, (t - t0) / 1100);
      const e = 1 - Math.pow(1 - k, 3);
      setX(88 - 38 * e);
      if (k < 1) raf = requestAnimationFrame(run);
    };
    raf = requestAnimationFrame(run);
    return () => cancelAnimationFrame(raf);
  }, [seen, calm, hinted]);
  const at = (e: { clientX: number }) => {
    const r = box.current?.getBoundingClientRect();
    if (!r) return;
    setX(Math.max(4, Math.min(96, ((e.clientX - r.left) / r.width) * 100)));
  };
  const key = (e: KeyboardEvent<HTMLButtonElement>) => {
    const moves: Record<string, number> = { ArrowLeft: -5, ArrowRight: 5, Home: -100, End: 100 };
    const d = moves[e.key];
    if (d === undefined) return;
    e.preventDefault();
    setX((v) => Math.max(4, Math.min(96, v + d)));
  };
  const after = [<Files key="f" on />, <Shapes key="s" on />, <Eq key="e" on />][step];
  return (
    <div
      ref={box} className={'dz-cmp' + (held ? ' held' : '')} style={{ '--x': x + '%' }}
      onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); setHeld(true); at(e); }}
      onPointerMove={(e) => { if (held) at(e); }}
      onPointerUp={() => setHeld(false)} onPointerCancel={() => setHeld(false)}
    >
      <div className="dz-cmp-a" aria-hidden="true">
        <div className="dz-raw">
          <div className="dz-file"><span className="dz-file-i">♪</span><span className="x-mono">neon-horizon-master.mp3 (4.8 MB)</span></div>
          <div className="dz-raw-w">{Array.from({ length: 64 }).map((_, i) => <i key={i} style={{ height: 14 + ((i * 53) % 37) + ((i * 7) % 11) + '%' }} />)}</div>
          <div className="dz-drop"><span>＋</span><span>Drop audio, image, PDF, CSV or video</span></div>
        </div>
      </div>
      <div className="dz-cmp-b" aria-hidden="true">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={step} className="dz-cmp-art" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease: EASE }}>{after}</motion.div>
        </AnimatePresence>
      </div>
      <div className="dz-cmp-line" aria-hidden="true" />
      <button type="button" className="dz-cmp-h" role="slider" aria-label={STEPS[step].title} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(x)} onKeyDown={key}>
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M9 7 4 12l5 5M15 7l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
    </div>
  );
}

function What() {
  const [step, setStep] = useState(2);
  const ref = useEnter();
  return (
    <section className="av-sec dz-what dz-e-drop" ref={ref}>
      <div className="av-wrap av-grid">
        <div className="dz-what-l">
          <h2 className="av-display s">One conversation, every creative artifact in a tab</h2>
          <span className="dz-cap x-mono">What is Hanzo Design</span>
        </div>
        <p className="av-lede dz-what-r">Describe what you need or drop in your raw files. Hanzo Design creates and iterates on each artifact side-by-side in live tabs you can inspect, play, and export.</p>
      </div>
      <div className="av-wrap dz-cmp-g">
        <Compare step={step} />
        <ol className="dz-steps" aria-label="What is Hanzo Design">
          {STEPS.map((s, i) => (
            <li key={s.title}>
              <button type="button" aria-pressed={step === i} onClick={() => setStep(i)} className={step === i ? 'on' : ''}>
                <span className="x-mono av-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="dz-step-t">{s.title}</span>
              </button>
              <div className="dz-step-b">{s.body}</div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------- capabilities: six sheets that stack as you scroll ---------- */
const CAPS: [string, string, string, string][] = [
  ['Visuals, images & posters', 'High-resolution imagery, product photography, posters, and vector brand assets powered by Iro.', 'visual', 'Powered by Iro'],
  ['Slide decks & presentations', 'Structured 16:9 slide decks with keyboard navigation, speaker flow, and vector PDF download.', 'deck', '16:9 · vector PDF'],
  ['Documents & print-ready PDFs', 'Editorial reports, brand guidelines, and one-pagers with live preview and native PDF typesetting.', 'doc', 'Native PDF typesetting'],
  ['Ads & campaign kits', 'Social, story, and banner ads with matched art direction, headline lockups, and conversion CTAs.', 'ads', 'Social · story · banner'],
  ['Video & motion loops', 'Short product loops, animated promos, and motion graphics rendered with Koma and browser-native MP4 export.', 'video', 'Koma · MP4'],
  ['Music, voice & interactive apps', 'Original music (Uta), narration (Koe), sound effects (Oto), and self-contained interactive HTML5/Canvas/WebAudio apps.', 'music', 'Uta · Koe · Oto'],
];

/* Each capability's own media. In the Brief's cards (still) the clips show their posters, so at most two films play on a screen. */
function Clip2({ m, still }: { m: string; still?: boolean }) {
  return still ? <Img src={`/models/${m}.webp`} alt="" w={1200} h={1500} /> : <Film src={`/models/${m}.webm`} poster={`/models/${m}.webp`} w={1200} h={1500} />;
}
function CapArt({ k, still }: { k: string; still?: boolean }) {
  if (k === 'visual') return <span className="dz-ca dz-ca-visual"><Clip2 m="iro" still={still} /><b>Neon<br />Horizon</b></span>;
  if (k === 'deck') return <span className="dz-ca dz-ca-deck">{[0, 1, 2].map((i) => <i key={i}><Img src={['/models/oto.webp', '/models/uta.webp', '/models/koe.webp'][i]} alt="" w={1200} h={1500} /></i>)}</span>;
  if (k === 'doc') return <span className="dz-ca dz-ca-doc">{[0, 1].map((p) => <i key={p}><b />{[90, 100, 84, 100, 62, 96, 74].map((w, j) => <em key={j} style={{ width: w + '%' }} />)}</i>)}</span>;
  if (k === 'ads') return <span className="dz-ca dz-ca-ads">{['story', 'square', 'banner'].map((s) => <i key={s} className={s}><Img src="/models/mori.webp" alt="" w={1200} h={1500} /></i>)}</span>;
  if (k === 'video') return <span className="dz-ca dz-ca-video"><Clip2 m="koma" still={still} /><span className="dz-tl">{[34, 22, 28, 16].map((w, i) => <i key={i} style={{ flexGrow: w }} />)}<b /></span></span>;
  return <span className="dz-ca dz-ca-music">{['uta', 'koe', 'oto'].map((m, i) => <i key={m}><Clip2 m={m} still={still || i > 0} /></i>)}</span>;
}

function Caps() {
  const ref = useEnter(rollIn);
  return (
    <section className="av-sec dz-caps dz-e-roll" ref={ref}>
      <div className="av-wrap">
        <div className="av-grid dz-caps-top">
          <h2 className="av-head dz-caps-h">Everything a creative team ships</h2>
          <span className="dz-cap x-mono dz-caps-k">Capabilities</span>
        </div>
        <ol className="dz-stack">
          {CAPS.map(([t, d, k, tag], i) => (
            <li key={t} className={'dz-sheet c-' + k} style={{ '--i': i }}>
              <div className="dz-sheet-t">
                <span className="x-mono dz-sheet-n av-num">{String(i + 1).padStart(2, '0')} / 06</span>
                <h3 className="av-head">{t}</h3>
                <p className="av-body">{d}</p>
                <span className="x-mono dz-sheet-tag">{tag}</span>
              </div>
              <div className="dz-sheet-a"><CapArt k={k} /></div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------- Beyond: one brief, every artifact titled with it ---------- */
function Brief() {
  const [brief, setBrief] = useState('');
  const [on, setOn] = useState(() => CAPS.map(() => true));
  const title = brief.trim();
  const picked = CAPS.filter((_, i) => on[i]);
  // opposite-drift: as the section crosses the screen its two halves drift apart and meet in the middle
  const ref = useRef<HTMLElement>(null);
  const calm = useCalm();
  useEffect(() => {
    const el = ref.current;
    if (!el || calm) return;
    let raf = 0;
    const set = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const p = (r.top + r.height / 2 - innerHeight / 2) / innerHeight; // 0 when centred
      el.style.setProperty('--dz-d', Math.max(-1, Math.min(1, p)).toFixed(3));
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(set); };
    set(); addEventListener('scroll', on, { passive: true });
    return () => { removeEventListener('scroll', on); cancelAnimationFrame(raf); el.style.removeProperty('--dz-d'); };
  }, [calm]);
  return (
    <section className="av-sec dz-brief dz-e-drift" ref={ref}>
      <div className="av-wrap av-grid">
        <div className="dz-brief-l">
          <h2 className="av-display m">One brief</h2>
          <span className="dz-cap x-mono">One conversation, every artifact</span>
          <input className="dz-brief-in" value={brief} onChange={(e) => setBrief(e.target.value)} maxLength={80} placeholder="Your brief" aria-label="Your brief" />
          <div className="dz-brief-pick" role="group" aria-label="Artifacts">
            {CAPS.map(([t], i) => <button key={t} type="button" aria-pressed={on[i]} onClick={() => setOn((v) => v.map((x, k) => (k === i ? !x : x)))}>{t}</button>)}
          </div>
        </div>
        <div className="dz-brief-r">
          {picked.length ? (
            <ul className="dz-brief-set" aria-live="polite">
              {picked.map(([t, , k, tag]) => (
                <li key={t} className={'k-' + k}>
                  <span className="dz-brief-art" aria-hidden="true"><CapArt k={k} still /></span>
                  <span className="dz-brief-k x-mono">{tag}</span>
                  <b>{title || t}</b>
                  {title && <span>{t}</span>}
                </li>
              ))}
            </ul>
          ) : <p className="dz-brief-none">Choose at least one artifact.</p>}
        </div>
      </div>
    </section>
  );
}

/* ---------- the dark room: every creative model; each opens into its page ---------- */
const NODES: string[][] = [
  ['iro', 'Iro', 'Image generation and visual understanding.', 'Images'],
  ['koma', 'Koma', 'Video generation and world simulation.', 'Video'],
  ['oto', 'Oto', 'Sound generation and audio understanding.', 'Audio'],
  ['koe', 'Koe', 'Voice synthesis and speech understanding.', 'Voice'],
  ['uta', 'Uta', 'Music generation and composition.', 'Music'],
  ['mori', 'Mori', '3D generation and spatial understanding.', '3D'],
];

function Model({ n }: { n: string[] }) {
  const [slug, name, desc, kind] = n;
  const opener = useOpener();
  const box = useRef<HTMLAnchorElement>(null);
  return (
    <li>
      <a href={'/' + slug} ref={box} className="dz-model" data-cursor="" data-cta={'design-model-' + slug}
        onClick={(e) => opener.open(e, { el: box.current, src: `/models/${slug}.webp`, href: '/' + slug, key: slug })}>
        <span className="dz-model-m">
          <Film src={`/models/${slug}.webm`} poster={`/models/${slug}.webp`} w={1200} h={1500} />
        </span>
        <span className="dz-model-t">
          <span className="dz-model-k x-mono">{kind}</span>
          <b>{name}</b>
          <span>{desc}</span>
        </span>
      </a>
    </li>
  );
}

function Studio() {
  const ref = useEnter(); // explode-gather: the six model cards start scattered and collapse into the grid
  return (
    <section ref={ref} className="av-sec av-dark dz-dark dz-e-gather" data-room="dark">
      <div className="av-wrap av-grid">
        <div className="dz-dark-l">
          <h2 className="av-head">Every creative model, in one studio.</h2>
          <p className="av-body">Video, image, 3D, sound, voice and music, each a node on the canvas. Open one to see what it makes.</p>
          <div className="dz-dark-links">
            <More to="/pricing">Explore model pricing</More>
            <More to="/models">View full model catalog</More>
          </div>
          <span className="dz-hub"><Mark size={18} /><span>Hanzo Design</span></span>
        </div>
        <ul className="dz-models">{NODES.map((n) => <Model key={n[0]} n={n} />)}</ul>
      </div>
    </section>
  );
}

/* ---------- start ---------- */
const PASTE = 'Read https://hanzo.ai/skill.md and use Hanzo Design in my project.';

function Repo() {
  const ref = useEnter(shuffleIn); // word-shuffle
  return (
    <section className="av-sec tight dz-start dz-e-shuffle" ref={ref}>
      <div className="av-wrap av-grid dz-start-g">
        <div className="dz-paste">
          <Shuffle className="av-title dz-shuf" text="Paste and ship" />
          <p className="av-body">Paste this into any agent. It reads the skill manifest and calls Design from there.</p>
          <div className="dz-prompt">
            <span className="dz-cap x-mono">Agent prompt</span>
            <code className="x-mono">{PASTE}</code>
            <Copy text={PASTE} />
          </div>
        </div>
        <div className="dz-repo">
          <span className="dz-repo-mark"><Mark size={22} /></span>
          <Shuffle className="av-title dz-shuf" text="Get Design" />
          <Shuffle className="av-body dz-shuf" text="Creative AI workspace for visuals, decks, documents, ads & interactive apps" />
          <dl className="x-mono"><div><dt>License:</dt><dd>Apache-2.0</dd></div></dl>
          <div className="dz-repo-acts">
            <A to="https://github.com/hanzoai" className="dz-gh" data-cta="design-github">
              <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M8 0a8 8 0 0 0-2.53 15.59c.4.07.55-.17.55-.38v-1.33c-2.23.48-2.7-1.07-2.7-1.07-.36-.92-.89-1.17-.89-1.17-.73-.5.06-.49.06-.49.8.06 1.23.83 1.23.83.72 1.23 1.88.87 2.34.67.07-.52.28-.87.5-1.07-1.78-.2-3.65-.89-3.65-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 0 1 4 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.66 3.95.29.25.54.73.54 1.48v2.2c0 .21.15.46.55.38A8 8 0 0 0 8 0Z" /></svg>
              hanzoai
            </A>
            <Cta to="https://platform.hanzo.ai/deploy" kind="link" id="design-deploy">Deploy to Cloud</Cta>
          </div>
        </div>
      </div>
    </section>
  );
}

function Band() {
  const ref = useRef<HTMLElement>(null);
  const calm = useCalm();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start 0.2'] });
  const clip = useTransform(scrollYProgress, [0, 1], ['inset(0% 3% 0% 3% round 24px)', 'inset(0% 0% 0% 0% round 0px)']);
  const grow = useTransform(scrollYProgress, [0, 1], [0.72, 1]); // the heading grows to its 64px as the band opens
  return (
    <motion.section ref={ref} className="x-band dz-band" data-room="dark" style={calm ? undefined : { clipPath: clip }}>
      <div className="av-wrap">
        <motion.h2 className="dz-band-h" style={calm ? undefined : { scale: grow }}>Start creating in Hanzo Design</motion.h2>
        <p>Open the Design workspace in your browser and upload your first file.</p>
        <div className="x-band-act">
          <Cta to="/design" id="design-band-open" size="lg">Open Design</Cta>
          <Cta to="https://studio.hanzo.ai" kind="link" id="design-band-studio">Open Hanzo Studio (Cinema)</Cta>
        </div>
      </div>
    </motion.section>
  );
}

export default function DesignPage() {
  return (
    <main className="av dz" style={{ '--ac': '#0a0a0a' }}>
      <Hero />
      <What />
      <Studio />
      <Brief />
      <Repo />
      <Caps />
      <Band />
    </main>
  );
}
