'use client';
/* Koe's own pictures for the capability chapters and "Where Koe fits", drawn from the booth (Koe.jsx) instead of
   repeating the stage film: Koe's wave is the stage, the map card and the model card, and nothing else.
   0 emotional modulation: a pitch contour that re-performs (whisper, irony, intense, hesitant) over its level bars
   1 cross-lingual cloning: two lines of speech, one voice: two waveforms under one shared envelope (the identity)
   2 viseme dubbing: the mouth shape of each phoneme of "Hanzo" opening in step with its slot on the timeline
   3 likeness rights: a waveform carrying a faint watermark line, each second logged as a block in a provenance chain
   4 where it fits: three voices streaming past one playhead (a dub, a branching line, an ensemble read)
   Canvas only, on screen only (useLoop), held by the page's one Pause, a single still frame under reduced motion.
   aria-hidden: the chapter's words carry the meaning. */
import { useRef } from 'react';
import { useLoop, fit, rng } from './live';
import { usePaused } from '../../v2/ModelFilm';

const PH = [['/h/', 0.55, 0.85, 0.16, 0.5], ['/æ/', 0.85, 1.55, 0.9, 1.25], ['/n/', 1.55, 1.95, 0.18, 0.75], ['/z/', 1.95, 2.45, 0.28, 0.6], ['/oʊ/', 2.45, 3.6, 0.72, 0.55]];
const INK = 'rgba(245,245,247,', W = '#fafafa';
const ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const noise = (seed, n) => { const r = rng(seed); return Array.from({ length: n }, () => r()); };
const N1 = noise(7, 400), N2 = noise(19, 400), N3 = noise(31, 400);

// emotional modulation: four deliveries of one line, the contour easing from one to the next every 2.6s
const DEL = [[0.25, 1.1, 0.35], [0.7, 2.2, 0.15], [1, 1.6, 0.05], [0.5, 3.4, 0.55]]; // [range, wiggle, breath]
function contour(g, w, h, d, t) {
  const n = DEL.length, f = (t / 2.6) % n, a = DEL[Math.floor(f)], b = DEL[(Math.floor(f) + 1) % n], k = ease(Math.min(1, (f % 1) * 1.6));
  const [rg, wg, br] = a.map((v, i) => v + (b[i] - v) * k);
  const env = (x) => Math.sin(Math.PI * Math.min(1, Math.max(0, x * 1.08 - 0.04)));
  const yAt = (x) => h * 0.36 - env(x) * h * 0.2 * rg * Math.sin(x * Math.PI * 1.4 + 0.4) - h * 0.04 * Math.sin(x * wg * 6.3 + t * 1.1) * env(x);
  const ph = (t * 0.22) % 1;
  // the contour: a wide soft trace, then the line itself
  for (const [lw, col] of [[10 * d, INK + '.08)'], [2 * d, W]]) {
    g.beginPath();
    for (let i = 0; i <= 120; i++) { const x = i / 120; g[i ? 'lineTo' : 'moveTo'](w * 0.08 + x * w * 0.84, yAt(x)); }
    g.lineWidth = lw; g.strokeStyle = col; g.lineCap = 'round'; g.stroke();
  }
  // pitch marks on the contour and the playhead dot
  for (let i = 1; i < 6; i++) { const x = i / 6; g.fillStyle = INK + '.5)'; g.beginPath(); g.arc(w * 0.08 + x * w * 0.84, yAt(x), 3 * d, 0, 7); g.fill(); }
  g.fillStyle = W; g.beginPath(); g.arc(w * 0.08 + ph * w * 0.84, yAt(ph), 6 * d, 0, 7); g.fill();
  // level bars under it: louder where the contour is wide, breathy noise where it is soft
  const bars = 64, base = h * 0.74, bw = (w * 0.84) / bars;
  for (let i = 0; i < bars; i++) {
    const x = i / bars, e = env(x) * (0.35 + rg * 0.65), jitter = 0.6 + 0.4 * Math.sin(i * 1.7 + t * 5) * (1 - br) + br * N1[(i + Math.floor(t * 12)) % 400];
    const a = Math.max(d, e * jitter * h * 0.13);
    g.fillStyle = x < ph ? INK + '.85)' : INK + '.28)';
    g.fillRect(w * 0.08 + i * bw + bw * 0.2, base - a, Math.max(d, bw * 0.6), a * 2);
  }
}

// cross-lingual cloning: one envelope (the voice) over two different syllable patterns (two languages)
function clone(g, w, h, d, t) {
  const bars = 72, bw = (w * 0.84) / bars, x0 = w * 0.08, ph = (t * 0.2) % 1;
  const env = (x, s) => Math.pow(Math.sin(Math.PI * x), 0.8) * (0.55 + 0.45 * Math.sin(x * 9 + s));
  const lanes = [[h * 0.32, N2, 0.6], [h * 0.68, N3, 2.1]];
  lanes.forEach(([mid, N, off], li) => {
    for (let i = 0; i < bars; i++) {
      const x = i / bars, syl = 0.35 + 0.65 * Math.abs(Math.sin(i * (li ? 0.55 : 0.82) + off + t * 0.9)) * (0.7 + 0.3 * N[i]);
      const a = Math.max(d, env(x, 0) * syl * h * 0.12);
      g.fillStyle = x < ph ? INK + '.9)' : INK + '.3)';
      g.fillRect(x0 + i * bw + bw * 0.2, mid - a, Math.max(d, bw * 0.6), a * 2);
    }
    // the shared envelope, the same line over both lanes
    g.beginPath();
    for (let i = 0; i <= 90; i++) { const x = i / 90; g[i ? 'lineTo' : 'moveTo'](x0 + x * w * 0.84, mid - env(x, 0) * h * 0.13 - 4 * d); }
    g.lineWidth = 1.5 * d; g.strokeStyle = W; g.setLineDash([4 * d, 5 * d]); g.lineDashOffset = -t * 20 * d; g.stroke(); g.setLineDash([]);
  });
  // the identity holding across: hairlines from lane to lane at the formant peaks
  for (let i = 1; i < 8; i++) {
    const x = x0 + (i / 8) * w * 0.84, lit = Math.abs(i / 8 - ph) < 0.07;
    g.fillStyle = lit ? W : INK + '.14)';
    g.fillRect(x, h * 0.32 + h * 0.15, d, h * 0.68 - h * 0.32 - h * 0.3);
  }
  g.fillStyle = W; g.fillRect(x0 + ph * w * 0.84, h * 0.14, 2 * d, h * 0.72);
}

// viseme dubbing: five mouths over five timed slots; the playhead walks the word and each mouth opens on its slot
function viseme(g, w, h, d, t) {
  const T = 4.2, s = (t % T) + 0.3, x0 = w * 0.08, tw = w * 0.84, span = 3.6 - 0.55;
  const cw = tw / 5, my = h * 0.38, R = Math.min(cw * 0.36, h * 0.16);
  PH.forEach(([p, a, b, open, wide], i) => {
    const on = s >= a && s < b, done = s >= b, u = on ? Math.sin(Math.PI * (s - a) / (b - a)) : 0;
    const cx = x0 + cw * (i + 0.5), rx = R * (0.55 + 0.45 * wide), ry = Math.max(1.5 * d, R * open * (on ? 0.25 + 0.75 * u : 0.12));
    g.beginPath(); g.ellipse(cx, my, rx, ry, 0, 0, 7);
    g.lineWidth = 2 * d; g.strokeStyle = on ? W : done ? INK + '.55)' : INK + '.22)'; g.stroke();
    if (on) { g.fillStyle = INK + '.12)'; g.fill(); }
    g.font = `500 ${Math.round(15 * d)}px ui-monospace, SFMono-Regular, Menlo, monospace`; g.textAlign = 'center';
    g.fillStyle = on ? W : done ? INK + '.6)' : INK + '.3)'; g.fillText(p, cx, my + R + 30 * d);
    // its slot on the timeline, as long as the phoneme lasts
    const sx = x0 + ((a - 0.55) / span) * tw, sw = ((b - a) / span) * tw;
    g.fillStyle = on ? W : done ? INK + '.45)' : INK + '.14)';
    g.fillRect(sx + d, h * 0.78, sw - 2 * d, 8 * d);
  });
  const px = x0 + (Math.min(Math.max(s - 0.55, 0), span) / span) * tw;
  g.fillStyle = W; g.fillRect(px, h * 0.74, 2 * d, 16 * d);
}

// likeness rights: the voice carries a watermark under it, and every second is logged as one block in a chain
function mark(g, w, h, d, t) {
  const bars = 80, bw = (w * 0.84) / bars, x0 = w * 0.08, mid = h * 0.4;
  for (let i = 0; i < bars; i++) {
    const x = i / bars, a = Math.max(d, Math.pow(Math.sin(Math.PI * x), 0.7) * (0.35 + 0.65 * Math.abs(Math.sin(i * 0.61 + t * 1.4))) * h * 0.17);
    g.fillStyle = INK + '.55)'; g.fillRect(x0 + i * bw + bw * 0.2, mid - a, Math.max(d, bw * 0.6), a * 2);
  }
  // the watermark: a fine dotted carrier riding through the voice, drifting
  for (let i = 0; i < 140; i++) {
    const x = i / 140, y = mid + Math.sin(x * 24 + t * 2.2) * h * 0.035;
    g.fillStyle = (i + Math.floor(t * 10)) % 7 === 0 ? W : INK + '.35)';
    g.fillRect(x0 + x * w * 0.84, y, 1.5 * d, 1.5 * d);
  }
  // the provenance log: blocks fill one per 0.45s, linked, then the chain starts a new page
  const n = 12, gap = 8 * d, bs = Math.min((w * 0.84 - gap * (n - 1)) / n, 26 * d), cy = h * 0.8, done = Math.floor((t / 0.45) % (n + 3));
  const sx = x0 + (w * 0.84 - (bs * n + gap * (n - 1))) / 2;
  for (let i = 0; i < n; i++) {
    const x = sx + i * (bs + gap);
    if (i) { g.fillStyle = i <= done ? INK + '.6)' : INK + '.14)'; g.fillRect(x - gap, cy + bs / 2 - d / 2, gap, d); }
    g.lineWidth = 1.5 * d;
    if (i < done) { g.fillStyle = INK + '.85)'; g.fillRect(x, cy, bs, bs); }
    else { g.strokeStyle = i === done ? W : INK + '.22)'; g.strokeRect(x + d, cy + d, bs - 2 * d, bs - 2 * d); }
  }
}

// where it fits: three voices stream leftward past one playhead
function fits(g, w, h, d, t) {
  const px = w * 0.62, bw = 5 * d;
  [[0.24, 0.9, N1, 1], [0.5, 2.3, N2, 0.6], [0.76, 0.5, N3, 0.85]].forEach(([y, rate, N, loud], li) => {
    const mid = h * y, n = Math.ceil(w / bw) + 1, shift = (t * 60 * d) % bw, k0 = Math.floor((t * 60 * d) / bw);
    for (let i = 0; i < n; i++) {
      const k = k0 + i, gapOn = Math.sin(k * 0.09 * rate + li * 2) > 0.55, x = i * bw - shift;
      const a = gapOn ? d : Math.max(d, (0.25 + 0.75 * N[k % 400]) * Math.abs(Math.sin(k * 0.35 / rate + li)) * h * 0.07 * loud);
      g.fillStyle = x < px ? INK + '.9)' : INK + '.3)';
      g.fillRect(x + bw * 0.2, mid - a, bw * 0.55, a * 2);
    }
    g.fillStyle = INK + '.12)'; g.fillRect(0, mid + h * 0.11, w, d);
  });
  g.fillStyle = W; g.fillRect(px, h * 0.08, 2 * d, h * 0.84);
}

const DRAW = [contour, clone, viseme, mark, fits];

export default function KoePanel({ k, on = true }) {
  const cv = useRef(null), T = useRef(k * 1.7);
  const paused = usePaused();
  useLoop(cv, (_, dt, still) => {
    const c = cv.current;
    if (!c) return;
    if (still) T.current = 2.2 + k * 0.5;
    else if (on && !paused) T.current += dt;
    const { w, h, d } = fit(c);
    const g = c.getContext('2d');
    g.clearRect(0, 0, w, h);
    DRAW[k](g, w, h, d, T.current);
  });
  return <canvas ref={cv} className="ko-panel" aria-hidden="true" />;
}
