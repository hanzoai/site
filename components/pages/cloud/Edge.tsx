'use client';
// Edge.
// V2: 8/10 Launch page on the deck: a 52px title beside a localhost window (the one big thing, streaming server-sent events by CSS from first paint, pausable); a full-bleed field of machines each answering for itself, its labels in a band above it and never over it; six runtime cards that open in place; "What runs on yours"; the reasons as the dark room; a light close.
// Persona: Developer who needs a model to run on the user's own machine (offline, private, no per-call bill).
// Goal: try Hanzo Edge (read the source on GitHub, then the docs).
// CTA: "View on GitHub" → https://github.com/hanzoai/edge (solid: data-cta edge.hero with data-thumb for the ask bar);
//   "View Documentation" → https://docs.hanzo.ai (quiet, edge.hero-2); "Deploy to Cloud" → https://platform.hanzo.ai/deploy
//   (edge.close, the close's one solid).
// Metric: api_key_created (proxy on this page: the edge.hero click).
// Signature: distance zero. A full-bleed field of machines drawn on one canvas walks Hanzo's three facts: the machines
//   gather into what it runs on (macOS, Linux, the browser through WebAssembly); then prompts land all over the field and
//   each is answered where it landed, a ring that never leaves its point (there is no request); then a Hugging Face repo
//   sends the weights to every machine once, the lines fade, and the field stays lit offline. Ink on white only: a lit
//   machine is darker and larger, never a colour. It runs while seen, with a pause control first in its DOM.
// Supporting: the Stage hero (the localhost window streams by CSS and settles as you scroll), the six runtime cards that
//   open into their own sheet, the machine picker's ink pill gliding to your choice.
// Motion kinds: arrival (title cut-in, stage), idle (the stream, the field), time (the facts advancing every 6.8 s with a
//   filling bar), state (picker pill, the answer by line mask, cards opening), scroll (stage settle and the dark room only).
// Beyond: "What runs on yours": pick the machine you have and see what Edge uses on it and which Zen model fits, each
//   answer built from Hanzo's own lines.
// Every word and link is Hanzo's; the field and the stream are drawn, not measured, and show no numbers.
import type React from 'react';
import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useScroll, useTransform, useMotionTemplate, useReducedMotion } from 'motion/react';
import { useWide } from '../../v2/KeynoteChapters';
import { A, Film } from '../../kit';
import { useCalm } from '../../ui';
import KeynoteStage, { useStagePause } from './SafeStage';
import KeynoteOpen from '../../v2/KeynoteOpen';
import KeynoteClose from '../../v2/KeynoteClose';
import KeynoteLines from '../../v2/KeynoteLines';
import './Edge.css';

const pad = (n: number) => String(n).padStart(2, '0');
const EMPH: [number, number, number, number] = [0.16, 1, 0.3, 1];

const Off = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" className="eg-off-i"><path d="M2 8.5a15 15 0 0 1 20 0M5.5 12a10 10 0 0 1 13 0M9 15.5a5 5 0 0 1 6 0" /><circle cx="12" cy="19" r="1.3" /><path d="M3 3l18 18" className="cut" /></svg>
);
interface PauseIconProps {
  on: boolean;
}
const PauseIcon = ({ on }: PauseIconProps) => on
  ? <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M4.5 3v10l8.5-5z" fill="currentColor" /></svg>
  : <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><rect x="4" y="3" width="2.6" height="10" rx="1" fill="currentColor" /><rect x="9.4" y="3" width="2.6" height="10" rx="1" fill="currentColor" /></svg>;

/* ---------- the hero: a server on localhost, streaming token by token with the network off ---------- */
// the stream is Hanzo's own words, one token per server-sent event
const TOKENS = 'There is no request, so there is nothing to be slow. Nothing is uploaded'.split(' ');
function Local() {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { amount: 0.25 });
  const calm = useCalm();
  const paused = useStagePause();
  const [round, setRound] = useState(0);
  // the stream plays by CSS from first paint; while seen and not paused it streams again every 7 s
  useEffect(() => {
    if (!seen || calm || paused) return;
    const t = setTimeout(() => setRound((r) => r + 1), 7000);
    return () => clearTimeout(t);
  }, [round, seen, calm, paused]);
  return (
    <div className="kn-obj ink eg-loc" ref={ref}>
      <div className="eg-loc-bar">
        <span className="eg-dots" aria-hidden="true"><i /><i /><i /></span>
        <span className="eg-host">localhost</span>
        <span className="eg-net"><Off />No network at all</span>
      </div>
      <div className="eg-loc-b">
        <dl className="eg-spec">
          <div><dt>Zen model</dt><dd>zen-eco <em>4B</em></dd></div>
          <div><dt>GGUF</dt><dd>Q4_K_M <em>about 2.5GB on disk</em></dd></div>
          <div><dt>It uses what it finds</dt><dd>Metal <em>Detected at startup</em></dd></div>
          <div className="eg-spec-own"><dt>The prompt never leaves</dt><dd><i className="eg-pulse" aria-hidden="true" />Nothing is uploaded</dd></div>
        </dl>
        <div className="eg-sse" aria-hidden="true">
          <p className="eg-sse-k"><span>Token by token</span><b>SSE</b></p>
          <div className="eg-sse-l" key={round}>
            {TOKENS.map((w, i) => (
              <p key={i} className="eg-ev" style={{ '--i': i }}><span>data:</span><b>{w}</b></p>
            ))}
          </div>
          <p className="eg-sse-f">Weights on disk, tokens out of local memory.</p>
        </div>
      </div>
    </div>
  );
}

/* ---------- the signature: a field of machines, each answering for itself ---------- */
const FACTS = [
  ['Where it runs', 'macOS on Apple Silicon and Intel, Linux on x86 and ARM, and modern browsers through WebAssembly'],
  ['No network at all', 'Weights on disk, tokens out of local memory. There is no request, so there is nothing to be slow'],
  ['Fetched once', 'Name a Hugging Face repo and it downloads and caches the weights. After that, offline'],
];
const SAID = ['Where it runs', 'There is no request', 'After that, offline'];
const KINDS = [['macOS', 'Apple Silicon and Intel'], ['Linux', 'x86 and ARM'], ['WebAssembly', 'modern browsers']];
const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

/* a machine in the field: its home, where it gathers, where it is now, its kind, how lit it is, how far from the top centre */
interface Pt { hx: number; hy: number; gx: number; gy: number; x: number; y: number; k: number; lit: number; f: number }
/* a prompt answered where it landed: the machine and the moment */
interface Ring { p: Pt; b: number }
interface Dots { pts: Pt[]; w: number; h: number; dpr: number; rings: Ring[]; t0: number; mode: number; last: number; ink: string; inkAt: number; kind?: number }

function useField(canvas: React.RefObject<HTMLCanvasElement | null>, wrap: React.RefObject<HTMLDivElement | null>) {
  const st = useRef<Dots>({ pts: [], w: 0, h: 0, dpr: 1, rings: [], t0: 0, mode: 0, last: 0, ink: '10, 10, 10', inkAt: 0 });
  useEffect(() => {
    const el = wrap.current, cv = canvas.current;
    if (!el || !cv) return;
    const build = () => {
      const r = el.getBoundingClientRect();
      const s = st.current;
      s.dpr = Math.min(2, window.devicePixelRatio || 1);
      s.w = r.width; s.h = r.height;
      cv.width = Math.round(r.width * s.dpr); cv.height = Math.round(r.height * s.dpr);
      const gap = r.width < 600 ? 26 : 34;
      const cols = Math.floor((r.width - 40) / gap), rows = Math.floor((r.height - 40) / gap);
      const ox = (r.width - (cols - 1) * gap) / 2, oy = (r.height - (rows - 1) * gap) / 2;
      const pts: Pt[] = [];
      for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
        const i = y * cols + x;
        const hx = ox + x * gap + (rnd(i) - 0.5) * gap * 0.5, hy = oy + y * gap + (rnd(i + 99) - 0.5) * gap * 0.5;
        const k = x < cols / 3 ? 0 : x < (2 * cols) / 3 ? 1 : 2;
        // where it gathers for "Where it runs": a disc per kind, under its label in the band above
        const a = rnd(i + 7) * Math.PI * 2, d = Math.sqrt(rnd(i + 13)) * Math.min(r.width / (r.width < 600 ? 6.6 : 8), r.height / 3.2);
        const cx = r.width * (0.2 + k * 0.3), cy = r.height * (r.width < 600 ? 0.34 : 0.5);
        pts.push({ hx, hy, gx: cx + Math.cos(a) * d, gy: cy + Math.sin(a) * d * 0.8, x: hx, y: hy, k, lit: 0, f: Math.hypot(hx - r.width / 2, hy) });
      }
      const far = Math.max(...pts.map((p) => p.f));
      pts.forEach((p) => { p.f /= far; });
      s.pts = pts;
    };
    // the ink comes from CSS (.eg-cv canvas { color: var(--ink) }), so the field is dark dots on white and light dots on
    // Hanzo's dark; it is re-read when <html>'s theme class changes
    const ink = () => { const m = getComputedStyle(cv).color.match(/[\d.]+/g); st.current.ink = m ? m.slice(0, 3).join(', ') : '10, 10, 10'; st.current.inkAt = performance.now(); };
    ink();
    build();
    const ro = new ResizeObserver(build);
    ro.observe(el);
    const mo = new MutationObserver(ink);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => { ro.disconnect(); mo.disconnect(); };
  }, [canvas, wrap]);
  return st;
}

/* one frame of the field, ink on white: a lit machine is darker and larger, a ring is ink fading out */
function draw(s: Dots, cv: HTMLCanvasElement, t: number, mode: number, calm: boolean) {
  const c = cv.getContext('2d');
  if (!c) return;
  const { w, h, dpr, pts } = s;
  if (s.mode !== mode) { s.mode = mode; s.t0 = t; s.rings = []; pts.forEach((p) => { p.lit = 0; }); }
  const e = calm ? 99 : t - s.t0;
  c.setTransform(dpr, 0, 0, dpr, 0, 0);
  c.clearRect(0, 0, w, h);
  // 03: the weights travel from the repo (top centre, under its label) to every machine once, then the lines are gone
  if (mode === 2) {
    const sx = w / 2, sy = 0;
    c.lineWidth = 1;
    for (const p of pts) {
      const at = 0.3 + p.f * 2.2;
      const q = Math.min(1, Math.max(0, (e - at) / 0.6));
      if (q > 0 && q < 1) {
        c.strokeStyle = `rgba(${s.ink}, ${0.4 * (1 - q)})`;
        c.beginPath(); c.moveTo(sx, sy); c.lineTo(sx + (p.x - sx) * q, sy + (p.y - sy) * q); c.stroke();
      }
      if (q >= 1) p.lit = 1;
    }
  }
  // 02: prompts land anywhere and are answered where they land
  if (mode === 1 && !calm && t - s.last > 0.045) {
    s.last = t;
    const p = pts[Math.floor(Math.random() * pts.length)];
    if (p) s.rings.push({ p, b: t });
  }
  if (mode === 1) {
    s.rings = s.rings.filter((r) => t - r.b < 1.8);
    for (const r of s.rings) {
      const a = (t - r.b) / 1.8;
      c.strokeStyle = `rgba(${s.ink}, ${0.8 * (1 - a) * (1 - a)})`;
      c.lineWidth = 1.5;
      c.beginPath(); c.arc(r.p.x, r.p.y, 3 + (1 - (1 - a) * (1 - a)) * 22, 0, Math.PI * 2); c.stroke();
      r.p.lit = Math.max(r.p.lit, 1 - a);
    }
  }
  const fore = calm ? -1 : s.kind ?? 0; // the kind in front while "Where it runs" shows
  const small = w < 600;
  for (const p of pts) {
    const big = mode === 0 && p.k === fore;
    const cx = w * (0.2 + p.k * 0.3), cy = h * (small ? 0.34 : 0.5);
    const tx = mode === 0 ? (big ? cx + (p.gx - cx) * 1.3 : p.gx) : p.hx, ty = mode === 0 ? (big ? cy + (p.gy - cy) * 1.3 : p.gy) : p.hy;
    const k = calm ? 1 : 0.075;
    p.x += (tx - p.x) * k; p.y += (ty - p.y) * k;
    if (mode === 1 && calm) p.lit = rnd(p.hx) > 0.8 ? 1 : 0;
    if (mode !== 2 && mode !== 1) p.lit = 0;
    if (mode === 1 && !calm) p.lit *= 0.985;
    const lit = p.lit;
    const back = mode === 0 && fore >= 0 && !big;
    c.fillStyle = `rgba(${s.ink}, ${big ? 0.9 : back ? (small ? 0.1 : 0.18) : 0.24 + lit * 0.76})`;
    c.beginPath(); c.arc(p.x, p.y, mode === 0 ? (big ? 3.4 : 2.2) : 2.2 + lit * 1.6, 0, Math.PI * 2); c.fill();
  }
}

function Field() {
  const ref = useRef<HTMLElement>(null);
  const seen = useInView(ref, { amount: 0.3 });
  const calm = useCalm();
  const [hold, setHold] = useState(false);
  const [at, setAt] = useState(0);
  const [mine, setMine] = useState(false);
  const live = seen && !calm && !hold;
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const s = useField(canvas, wrap);
  const mode = useRef(0);
  mode.current = at;
  // "Where it runs": one kind at a time comes forward (its machines gather wider and darken, its label inks)
  const [kind, setKind] = useState(0);
  s.current.kind = kind;
  useEffect(() => {
    if (at !== 0) return;
    setKind(0);
    if (!live) return;
    const t = setInterval(() => setKind((k) => (k + 1) % 3), 2200);
    return () => clearInterval(t);
  }, [at, live]);
  // the next fact every 6.8 s while seen, not paused and not chosen by hand
  useEffect(() => {
    if (!live || mine) return;
    const t = setTimeout(() => setAt((v) => (v + 1) % 3), 6800);
    return () => clearTimeout(t);
  }, [at, live, mine]);
  // one animation frame loop, only while seen and not paused (paused, the field holds its frame)
  useEffect(() => {
    if (!live) return;
    let raf = 0;
    const loop = (now: number) => { if (canvas.current) draw(s.current, canvas.current, now / 1000, mode.current, false); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [live, s]);
  // reduced motion: each fact's final frame, drawn once
  useEffect(() => {
    if (!calm || !canvas.current) return;
    const paint = () => canvas.current && draw(s.current, canvas.current, performance.now() / 1000, at, true);
    const id = setTimeout(paint, 60);
    const mo = new MutationObserver(() => setTimeout(paint, 30));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => { clearTimeout(id); mo.disconnect(); };
  }, [calm, at, s]);
  return (
    <section className="eg-field" ref={ref} aria-labelledby="eg-field-h" data-paused={hold ? '' : undefined} data-mine={mine ? '' : undefined}>
      <h2 id="eg-field-h" className="x-sr">On-device inference</h2>
      <div className="kn-wrap eg-ctl">
        <button type="button" className="kn-pause" aria-pressed={hold} aria-label="Pause" onClick={() => setHold((v) => !v)}><PauseIcon on={hold} /></button>
        <p className="eg-said" aria-live="polite"><span key={at}>{SAID[at]}</span></p>
      </div>
      <div className="eg-band" data-mode={at} aria-hidden="true">
        {KINDS.map(([k, d], i) => <p key={k} className={'eg-kind' + (kind === i ? ' on' : '')} style={{ left: 20 + i * 30 + '%' }}><b>{k}</b><span>{d}</span></p>)}
        <p className="eg-repo"><b>Hugging Face repo</b></p>
      </div>
      <div className="eg-cv" ref={wrap} aria-hidden="true">
        <canvas ref={canvas} />
      </div>
      <div className="kn-wrap kn-grid eg-facts">
        {/* Hanzo's own picture for these three facts: the Oto film, as on hanzo.ai/edge */}
        <div className="eg-film" aria-hidden="true">
          <Film src="/models/oto.webm" poster="/models/oto.webp" w={1200} h={1500} />
          <span className="eg-film-n kn-fig">{pad(at + 1)} / 03</span>
        </div>
        <div className="eg-fact-l" role="group" aria-label="Where it runs">
        {FACTS.map(([t, d], i) => (
          <button key={t} type="button" aria-pressed={at === i} onClick={() => { setAt(i); setMine(true); }} className="eg-fact">
            <span className="eg-fact-bar" aria-hidden="true"><i key={at === i ? 'on' + at : 'off'} /></span>
            <span className="eg-fact-t">{t}</span>
            <span className="eg-fact-d">{d}</span>
            <span className="eg-fact-n kn-fig">{pad(i + 1)} / 03</span>
          </button>
        ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- what the runtime does: six cards that open ---------- */
const RUNTIME = [
  ['A server on localhost', 'A local inference endpoint on a port you pick. Point a client at it and the rest of your code does not change.', 'localhost'],
  ['Quantized as a first language', 'GGUF is the native format — Q4_K, Q5_K, Q8_0. A 4B model at Q4_K_M is about 2.5GB on disk, which is what makes a phone a plausible place to run one.', 'GGUF'],
  ['It uses what it finds', 'Metal on Apple Silicon, CUDA where there is an NVIDIA card, AVX2 or AVX-512 on CPU. Detected at startup rather than configured by you.', 'Metal · CUDA · AVX'],
  ['Zen models sized for devices', 'zen3-nano at 600M for embedded work and zen-eco at 4B for phones and tablets, both published pre-quantized.', '600M · 4B'],
  ['Token by token', 'Streaming over server-sent events from the local server, or a callback from the Rust API, so a UI starts drawing before generation finishes.', 'SSE'],
  ['The prompt never leaves', 'Nothing is uploaded and there is no key to leak. The prompt and the output stay in the process that made them, which is the whole reason to run a model here.', 'Nothing is uploaded'],
];

interface ArtProps {
  i: number;
}
function Art({ i }: ArtProps) {
  if (i === 0) return <div className="eg-art a0"><p><b>localhost</b><span>:port</span></p><i /></div>;
  if (i === 1) return <div className="eg-art a1">{['Q4_K', 'Q5_K', 'Q8_0'].map((q, k) => <p key={q} style={{ '--w': 0.5 + k * 0.25 }}><b>{q}</b><i /></p>)}<em>Q4_K_M · about 2.5GB</em></div>;
  if (i === 2) return <div className="eg-art a2">{[['Metal', 'Apple Silicon'], ['CUDA', 'NVIDIA'], ['AVX2', 'AVX-512']].map(([a, b], k) => <p key={a} className={k === 0 ? 'on' : ''}><b>{a}</b><span>{b}</span></p>)}</div>;
  if (i === 3) return <div className="eg-art a3"><p><b className="kn-fig">600M</b><span>zen3-nano</span></p><p><b className="kn-fig">4B</b><span>zen-eco</span></p></div>;
  if (i === 4) return <div className="eg-art a4">{['so a UI', 'starts drawing', 'before', 'generation', 'finishes'].map((w, k) => <p key={k} style={{ '--d': k * 0.35 + 's' }}><span>data:</span><b>{w}</b></p>)}</div>;
  return <div className="eg-art a5"><div><p>prompt</p><p>output</p></div><span><Off /></span></div>;
}

/* ---------- Beyond: what runs on yours ---------- */
const YOURS = [
  ['Apple Silicon', 'Metal', '', 'Metal on Apple Silicon. Detected at startup rather than configured by you.'],
  ['NVIDIA card', 'CUDA', '', 'CUDA where there is an NVIDIA card. Detected at startup rather than configured by you.'],
  ['CPU only', 'AVX2 or AVX-512', '', 'AVX2 or AVX-512 on CPU. Detected at startup rather than configured by you.'],
  ['Phone or tablet', 'GGUF, Q4_K_M', 'zen-eco · 4B', 'A 4B model at Q4_K_M is about 2.5GB on disk, which is what makes a phone a plausible place to run one.'],
  ['Cortex-A board', 'ARM64 Linux', 'zen3-nano · 600M', 'Cortex-A class boards are experimental, and the 600M model is the one that fits them.'],
  ['Browser tab', 'WebAssembly', '', 'The WebAssembly build runs the model in the page, with nothing behind it.'],
];
const ICON = ['M5 4h14v10H5zM3 18h18', 'M3 7h18v10H3zM7 7V4M17 7V4M7 17v3M17 17v3', 'M7 7h10v10H7zM10 4v3M14 4v3M10 17v3M14 17v3M4 10h3M4 14h3M17 10h3M17 14h3', 'M7 3h10v18H7zM11 18h2', 'M4 6h16v12H4zM8 10h2v4H8zM13 10h3', 'M3 5h18v14H3zM3 9h18'];

/* the kit's open cards shut on Esc without handing focus back: give it back to the card that opened */
function useEscReturn(sel: string) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      const c = document.querySelector<HTMLElement>(sel + ' .kno-card[aria-expanded="true"]');
      if (c) setTimeout(() => c.focus({ preventScroll: true }), 80);
    };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [sel]);
}

function Yours() {
  const [at, setAt] = useState(0);
  const btns = useRef<(HTMLButtonElement | null)[]>([]);
  const [name, uses, model, line] = YOURS[at];
  const key = (e: React.KeyboardEvent<HTMLButtonElement>, i: number) => {
    const k = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!k) return;
    e.preventDefault();
    const j = (i + k + YOURS.length) % YOURS.length;
    setAt(j); btns.current[j]?.focus();
  };
  return (
    <section className="kn-sec eg-yours" aria-labelledby="eg-yours-h">
      <div className="kn-wrap kn-grid eg-yours-g">
        <div className="eg-yours-l">
          <div className="eg-yours-h">
            <KeynoteLines id="eg-yours-h" className="kn-headline" lines="What runs on yours" />
            <p className="kn-kick" id="eg-pick-k">It uses what it finds</p>
          </div>
          <div className="eg-pick" role="radiogroup" aria-labelledby="eg-yours-h">
            {YOURS.map(([n], i) => (
              <button key={n} ref={(el) => { btns.current[i] = el; }} type="button" role="radio" aria-checked={at === i} tabIndex={at === i ? 0 : -1} onClick={() => setAt(i)} onKeyDown={(e) => key(e, i)}>
                {at === i && <motion.span layoutId="eg-pick" className="eg-pick-bg" transition={{ duration: 0.3, ease: EMPH }} />}
                <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d={ICON[i]} /></svg>
                <span>{n}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="eg-ans" aria-live="polite">
          <div className="eg-ans-in" key={at}>
            <p className="eg-ans-k">{name}</p>
            <dl>
              <div><dt>Uses</dt><dd className="eg-m"><b className="kn-fig">{uses}</b></dd></div>
              {model && <div><dt>Zen model</dt><dd className="eg-m sm"><b className="kn-fig">{model}</b></dd></div>}
            </dl>
            <p className="eg-ans-l"><span>{line}</span></p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- when to reach for it: the dark room ---------- */
const WHEN: [string, string, string[]][] = [
  ['Apps that work with no signal', 'The model is a file on disk, so the feature does not stop existing when the connection does.', ['A desktop app that drafts and summarizes without a round trip', 'Field tools on a laptop, on a site with no coverage', 'Anything that has to keep working on a plane']],
  ['Text that cannot leave the building', 'Some prompts are a legal problem the moment they cross a network boundary. This is the answer to those.', ['Clinical and legal text processed on the workstation that holds it', 'On-premise deployments with no egress at all', 'Personal data handled on the device it belongs to']],
  ['Inside the browser tab', 'The WebAssembly build runs the model in the page, with nothing behind it — so a visitor costs you bandwidth once and compute never.', ['A demo that does not bill per visitor', 'An assistant inside a web app you already ship', 'Classification done client-side, before anything is uploaded']],
  ['Small hardware', 'ARM64 Linux is a production target. Cortex-A class boards are experimental, and the 600M model is the one that fits them.', ['A 600M model on a single-board computer', 'An ARM server doing batch work on its own', 'Kiosks and appliances with no account to sign in to']],
];

/* The dark room opens out of a rounded window as it scrolls in (as the kit's KeynoteRoom does), but hydration-safe:
   the server and the first render agree, and reduced motion drops the clip only after mount. */
interface RoomProps {
  children: ReactNode;
  className?: string;
}
function Room({ children, className = '' }: RoomProps) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const wide = useWide();
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start end', 'start 15%'] });
  const v = useTransform(p, [0, 1], [wide ? 6 : 2, 0], { clamp: true });
  const h = useTransform(p, [0, 1], [wide ? 7 : 3, 0], { clamp: true });
  const r = useTransform(p, [0, 1], [24, 0], { clamp: true });
  const clip = useMotionTemplate`inset(${v}% ${h}% ${v}% ${h}% round ${r}px)`;
  return (
    <section ref={ref} className={'knr ' + className} data-room="dark" style={{ position: 'relative', color: '#fafafa', isolation: 'isolate' }}>
      <motion.div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: '#171717', zIndex: -1, clipPath: ready && reduce ? 'none' : clip }} />
      {children}
    </section>
  );
}

/* the dark room: Hanzo's four cases, every word readable as a list. Beside them (wide screens) the room's one object:
   a localhost window with the network off, streaming the uses of the case you are reading (the one nearest the middle
   of the screen, or the one you point at). */
function When() {
  const [at, setAt] = useState(0);
  const items = useRef<(HTMLLIElement | null)[]>([]);
  const calm = useCalm();
  useEffect(() => {
    const els = items.current.filter((el): el is HTMLLIElement => !!el);
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) setAt(Number((e.target as HTMLElement).dataset.i)); }), { rootMargin: '-45% 0px -45% 0px' });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return (
    <Room className="kn-sec eg-when">
      <div className="kn-wrap">
        <div className="kn-grid eg-when-h">
          <KeynoteLines className="kn-headline eg-when-t" lines="When to reach for it" />
          <p className="kn-lede eg-when-l">Use Edge when the data cannot leave, the network cannot be relied on, or a per-call bill is the wrong shape. Use Hanzo Engine when you need full precision or many users at once.</p>
        </div>
        <div className="kn-grid eg-cases">
          <div className="eg-mini-wrap" aria-hidden="true">
            <div className="eg-mini">
              <div className="eg-mini-bar"><span className="eg-dots"><i /><i /><i /></span><span className="eg-host">localhost</span><span className="eg-net"><Off /></span></div>
              <p className="eg-mini-k kn-fig">{pad(at + 1)} / 04</p>
              <ul key={calm ? 'c' : at}>{WHEN[at][2].map((p, k) => <li key={p} style={{ '--k': k }}><span>data:</span><span>{p}</span></li>)}</ul>
            </div>
          </div>
          <ol className="eg-list">
            {WHEN.map(([t, d, pts], i) => (
              <li key={t} ref={(el) => { items.current[i] = el; }} data-i={i} className={'eg-case' + (at === i ? ' on' : '')} onPointerEnter={() => setAt(i)}>
                <span className="eg-case-n kn-fig" aria-hidden="true">{pad(i + 1)}</span>
                <div className="eg-case-t">
                  <h3 className="eg-case-h">{t}</h3>
                  <p>{d}</p>
                  <ul>{pts.map((p) => <li key={p}><span>{p}</span></li>)}</ul>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Room>
  );
}

/* related: hairline rows (Frame's Related is retired); the name flies into its page (Morph) */
const REL = [['GPUs', '/cloud/gpus', 'On-demand accelerators'], ['Machines', '/machines', 'VMs by the second'], ['Containers', '/cloud/containers']];
function Rel() {
  return (
    <div className="eg-rel">
      <p className="kn-kick">Related capabilities</p>
      <ul>
        {REL.map(([t, to, d]) => (
          <li key={t}>
            <A to={to} className="eg-rel-a">
              <b data-morph="">{t}</b>{d && <span>{d}</span>}
              <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </A>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Edge() {
  useEscReturn('.eg-open');
  return (
    <main className="kn eg">
      <KeynoteStage
        look="side"
        kick="On-device inference"
        title={['Hanzo Edge']}
        lede="Run a model on the machine in front of you."
        acts={[['View on GitHub', 'https://github.com/hanzoai/edge'], ['View Documentation', 'https://docs.hanzo.ai']]}
        meta={<span>Apache-2.0 · Rust · WebAssembly</span>}
        from={1.04}
        cta="edge.hero"
      >
        <Local />
      </KeynoteStage>

      <Field />

      <section className="kn-sec eg-rt" aria-labelledby="eg-rt-h">
        <div className="kn-wrap">
          <div className="kn-grid eg-rt-h">
            <KeynoteLines id="eg-rt-h" className="kn-headline eg-rt-t" lines="What the runtime does" />
            <p className="kn-lede eg-rt-l">One Rust binary, a core crate to embed, a WASM build for the browser, and a local server for everything else</p>
          </div>
          <KeynoteOpen
            className="eg-open"
            cols={3}
            items={RUNTIME.map(([t, d, sub], i) => ({ id: 'rt' + i, kick: pad(i + 1), title: t, sub, art: <Art i={i} />, body: <p>{d}</p> }))}
          />
        </div>
      </section>

      <Yours />
      <When />

      <KeynoteClose
        light
        name="Edge"
        tag="Edge compute"
        cta="edge.close"
        prompt="Read https://hanzo.ai/skill.md and use Hanzo Edge in my project."
      >
        <Rel />
      </KeynoteClose>
    </main>
  );
}
