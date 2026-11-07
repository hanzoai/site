'use client';
/* Koe: performance in every word. v2 launch page (Creative on Launch + Chapters, Hanzo's black and white). The film settles
   into a tall capsule left of the headline.
   Signature: a voice waveform with its transcript. The waveform streams out of the playhead while the phonemes of
   "Hanzo" (/h/ /æ/ /n/ /z/ /oʊ/) light in step; each acting preset re-performs the same word (dramatic is slow and
   wide, documentary breathy and soft, gritty rough, commercial brisk and even). Tap the waveform to seek, pick a
   preset, or pause. (A drawn illustration of a performance, not Koe's audio.)
   Beyond: the studio map (Creative.jsx): every creative model serving your field, in its own words and colour.
   Persona: creative studio (researcher audience). Goal: request research access. CTA: Request access
   (/research-access?models=koe). Metric: contact_sales_submit.
   Body: KoeCreative.jsx (Koe's page-local copy of Creative.jsx) with KoePanels.jsx, so each chapter and "Where Koe
   fits" draws its own booth-derived picture and Koe's wave film shows only on the stage, the map card and the model card.
   V2: 8/10 own picture per chapter (contour, two-lane clone, visemes, watermark chain) and fits; one steady solid ask (hero solid, header outlined while it shows); h1 stays visible after the settle; every hover answers; gaps closed; phone tabs one row, pause docked on the pill, ask clear of the cookie card */
import { useEffect, useMemo, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { Studio } from './Studio';
import { Scene } from './Creative';
import KoeCreative from './KoeCreative';
import { usePaused } from '../../v2/ModelFilm';
import { box as frame, focus } from '../../v2/Launch';
import { useLoop, fit, rng, arrows } from './live';
import './Koe.css';

const PH = [['/h/', 0.55, 0.85, 'H'], ['/æ/', 0.85, 1.55, 'a'], ['/n/', 1.55, 1.95, 'n'], ['/z/', 1.95, 2.45, 'z'], ['/oʊ/', 2.45, 3.6, 'o']];
const PRESETS = [
  ['Cinematic Dramatic', 1.2, 1, 0.12, 0.04],
  ['Intimate Documentary', 1, 0.5, 0.05, 0.22],
  ['Gritty Character', 0.95, 0.85, 0.45, 0.08],
  ['Warm Commercial', 0.85, 0.75, 0.03, 0.02],
];
const LEN = 5, BARS = 160;
const at = (pr, k) => [0.55 + (PH[k][1] - 0.55) * pr[1], 0.55 + (PH[k][2] - 0.55) * pr[1]];

// the performance: one amplitude per bar across the 5 seconds
function shape(pr, seed) {
  const r = rng(seed), out = new Float32Array(BARS);
  for (let i = 0; i < BARS; i++) {
    const t = (i / BARS) * LEN;
    let a = 0.025 + r() * 0.02;
    PH.forEach((p, k) => {
      const [s, e] = at(pr, k);
      if (t < s || t >= e) return;
      const u = (t - s) / (e - s), env = Math.sin(Math.PI * Math.min(1, u * 1.2 + 0.05));
      const base = [0.22 + pr[4], 0.92, 0.5, 0.32 + pr[4] * 0.5, 0.86 * (1 - u * 0.7)][k];
      const noisy = k === 0 || k === 3;
      a = base * env * pr[2] * (noisy ? 0.55 + r() * 0.6 : 0.85 + 0.15 * Math.sin(t * 70)) * (1 + (r() - 0.5) * pr[3]);
    });
    out[i] = Math.min(1, a);
  }
  return out;
}

function Booth() {
  const stage = useRef(null), cv = useRef(null), sEl = useRef(null), csEl = useRef(null), cells = useRef([]), letters = useRef([]);
  const [pi, setPi] = useState(0);
  const [play, setPlay] = useState(true);
  const pagePaused = usePaused(); // the stage's one Pause holds the booth too
  const S = useRef({ t: 1.9, hold: 0, k: -2 });
  const amps = useMemo(() => PRESETS.map((p, i) => shape(p, 11 + i)), []);

  const mark = (t) => {
    const pr = PRESETS[pi];
    let k = -1;
    PH.forEach((_, j) => { const [s, e] = at(pr, j); if (t >= s && t < e) k = j; });
    const done = PH.filter((_, j) => t >= at(pr, j)[1]).length;
    const key = k * 10 + done;
    if (key === S.current.k) return;
    S.current.k = key;
    PH.forEach((_, j) => {
      const st = j === k ? 'on' : j < done ? 'done' : '';
      [cells.current[j], letters.current[j]].forEach((el) => { if (el && el.dataset.s !== st) el.dataset.s = st; });
    });
  };

  useLoop(stage, (_, dt, still) => {
    const c = cv.current, s = S.current;
    if (!c) return;
    if (still) s.t = LEN;
    else if (play && !pagePaused) {
      if (s.t < LEN) s.t = Math.min(LEN, s.t + dt);
      else if ((s.hold += dt) > 1.1) { s.t = 0; s.hold = 0; }
    }
    const { w, h, d } = fit(c);
    const g = c.getContext('2d'), A = amps[pi], bw = w / BARS, mid = h / 2;
    g.clearRect(0, 0, w, h);
    for (let i = 0; i < BARS; i++) {
      const t = (i / BARS) * LEN, x = i * bw + bw * 0.2, bwid = Math.max(1, bw * 0.6);
      if (t > s.t) { g.fillStyle = 'rgba(255,255,255,.14)'; g.fillRect(x, mid - d, bwid, 2 * d); continue; }
      const grow = Math.min(1, (s.t - t) / 0.12), a = A[i] * grow * (h * 0.46);
      g.fillStyle = s.t - t < 0.25 ? '#ffffff' : 'rgba(245,245,247,.78)';
      g.fillRect(x, mid - a, bwid, Math.max(2 * d, a * 2));
    }
    g.fillStyle = '#f5f5f5';
    g.fillRect(Math.min(w - 2 * d, (s.t / LEN) * w), 0, 2 * d, h);
    const sec = Math.floor(s.t), cs = Math.floor((s.t % 1) * 100);
    if (sEl.current) sEl.current.textContent = String(Math.min(5, sec));
    if (csEl.current) csEl.current.textContent = String(s.t >= LEN ? 0 : cs).padStart(2, '0');
    mark(s.t);
  });

  const seek = (e) => { const r = cv.current.getBoundingClientRect(); S.current.t = Math.max(0, Math.min(LEN, ((e.clientX - r.left) / r.width) * LEN)); S.current.hold = 0; };
  const choose = (i) => { setPi(i); S.current.t = 0; S.current.hold = 0; S.current.k = -2; setPlay(true); };

  return (
    <div className="ko-booth" ref={stage}>
      <div className="ko-top">
        <p className="mb-mono">FLOW-MATCHING ACOUSTIC STAGE · STREAMING PHONEMES</p>
        <p className="ko-tc mb-tnum"><span>00:0</span><span ref={sEl}>1</span>.<span ref={csEl}>90</span> <span className="ko-tc-of">/ 00:05.00 · TTFT: 180ms</span></p>
        <button type="button" className="mb-chip" aria-pressed={play} onClick={() => setPlay(!play)}>{play ? 'Pause' : 'Play'}</button>
      </div>
      <div className="ko-wave" role="slider" tabIndex={0} aria-label="Voice waveform: seek" aria-valuemin={0} aria-valuemax={LEN} aria-valuenow={1.9} onKeyDown={(e) => { const k = { ArrowRight: 0.25, ArrowLeft: -0.25 }[e.key]; if (k) { e.preventDefault(); S.current.t = Math.max(0, Math.min(LEN, S.current.t + k)); S.current.hold = 0; } }}>
        <canvas ref={cv} aria-hidden="true" onPointerDown={seek} />
      </div>
      <div className="ko-script">
        <ol className="ko-ph" aria-label="Phonemes">
          {PH.map(([p], i) => <li key={p} ref={(el) => (cells.current[i] = el)}>{p}</li>)}
        </ol>
        <p className="ko-word" role="img" aria-label="Hanzo">{PH.map(([, , , l], i) => <span key={i} ref={(el) => (letters.current[i] = el)} aria-hidden="true">{l}</span>)}</p>
      </div>
      <div className="ko-presets">
        <p className="mb-mono">ACTING PRESET:</p>
        <div className="mb-chips" role="radiogroup" aria-label="Acting preset" onKeyDown={arrows}>
          {PRESETS.map(([n], i) => <button key={n} type="button" role="radio" aria-checked={pi === i} className="mb-chip" onClick={() => choose(i)}>{n}</button>)}
        </div>
      </div>
    </div>
  );
}

// the film closes into a tall capsule on the left (a horizontal one on phones: it starts under the × close, 20 + 48 + 8,
// and ends where Koe.css starts the headline, 47% of the stage; on short phones a slimmer pill ending at 34%, so the ask
// clears the cookie card at 375x667); the headline sits right of it. "Koe" (the h1) rests in the band above the pill.
const PILL = (W, H) => { const t = 76, h = H * (H < 641 ? 0.34 : 0.47) - t; return { l: 20, t, w: W - 40, h, r: h / 2 }; };
const CAPSULE = frame((W, H, wide) => {
  if (wide) { const w = Math.min(W * 0.2, H * 0.4), h = H * 0.84; return { l: W * 0.26 - w / 2, t: (H - h) / 2, w, h, r: w / 2 }; }
  return PILL(W, H);
});

// phones: the settled capsule keeps speaking. A playhead sweeps the film once per 6s loop (the film's own length) and
// a level meter of 28 bars breathes at its foot, the booth's waveform in miniature. CSS only (transform), so the
// page's one Pause stops it ([data-mpaused]) and reduced motion never shows it (Launch hides the layer when calm).
const LEVELS = Array.from({ length: 28 }, (_, i) => [0.62 + ((i * 37) % 11) / 14, -((i * 53) % 17) / 13, 0.3 + (((i * 29) % 13) / 13) * 0.7]);
function Meter(W, H, wide) {
  if (wide) return null;
  const b = PILL(W, H);
  return (
    <div className="ko-pill" style={{ left: b.l, top: b.t, width: b.w, height: b.h, borderRadius: b.r, '--pw': b.w + 'px' }}>
      <i className="ko-sweep" />
      <span className="ko-meter">{LEVELS.map(([d, o, a], i) => <i key={i} style={{ animationDuration: d + 's', animationDelay: o + 's', '--a': a }} />)}</span>
    </div>
  );
}

/* the settled capsule shows under a fifth of the stage film, and ModelFilm's on-screen test (ratio > 0.15, measured
   after the clip-path) then reads it as off screen and pauses it while the page's Pause still says "playing". Koe keeps
   its own stage film honest: while the stage is on screen, the tab is visible and the page is not paused, a pause it
   did not ask for is undone. The page's Pause ([data-mpaused]) and reduced motion still stop it. */
function useStageFilm() {
  const calm = useReducedMotion();
  useEffect(() => {
    const stage = document.querySelector('.lv-stage[data-hero="koe"]'), v = stage && stage.querySelector('video');
    if (!v || calm || navigator.connection?.saveData) return;
    let shown = false, raf = 0;
    const want = () => shown && !document.hidden && !document.documentElement.hasAttribute('data-mpaused');
    const nudge = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => { if (want() && v.paused && v.currentSrc) v.play().catch(() => {}); }); };
    const io = new IntersectionObserver(([e]) => { shown = e.intersectionRatio > 0.3; if (shown) nudge(); }, { threshold: [0, 0.3, 0.6] });
    io.observe(stage);
    const mo = new MutationObserver(nudge); // the page's Pause pressed again: play resumes here too
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-mpaused'] });
    document.addEventListener('visibilitychange', nudge);
    v.addEventListener('pause', nudge);
    v.addEventListener('loadeddata', nudge);
    return () => { io.disconnect(); mo.disconnect(); document.removeEventListener('visibilitychange', nudge); cancelAnimationFrame(raf); v.removeEventListener('pause', nudge); v.removeEventListener('loadeddata', nudge); };
  }, [calm]);
}

/* one solid ask per screen: while Koe's own "Request access" shows (white on the film, then solid ink beside the
   settled headline), html[data-ko-ask] outlines the header's ask (Koe.css); once it has scrolled by, the header's ask is
   the solid one again. */
function useOneAsk() {
  useEffect(() => {
    const H = document.documentElement;
    let raf = 0;
    const shown = (el, ok) => { if (!el || !ok(el)) return false; const r = el.getBoundingClientRect(); return r.bottom > 60 && r.top < innerHeight && r.width > 0; };
    const check = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const first = shown(document.querySelector('[data-cta="koe.first"]'), (el) => !el.closest('.lv-name[data-gone]'));
        const hero = shown(document.querySelector('[data-cta="koe.hero"]'), (el) => !!el.closest('.lv-head[data-on], .lv[data-calm]'));
        H.toggleAttribute('data-ko-ask', first || hero);
      });
    };
    const stage = document.querySelector('.lv-stage[data-hero="koe"]');
    const mo = new MutationObserver(check);
    if (stage) mo.observe(stage, { attributes: true, subtree: true, attributeFilter: ['data-gone', 'data-on'] });
    addEventListener('scroll', check, { passive: true });
    addEventListener('resize', check);
    const timers = [0, 400, 1400, 3000].map((ms) => setTimeout(check, ms));
    return () => { mo.disconnect(); removeEventListener('scroll', check); removeEventListener('resize', check); timers.forEach(clearTimeout); cancelAnimationFrame(raf); H.removeAttribute('data-ko-ask'); };
  }, []);
}

export default function Koe() {
  useStageFilm();
  useOneAsk();
  return (
    <KoeCreative
      shape={CAPSULE}
      over={Meter}
      aim={(W, H, wide) => (wide ? focus(0.66, 0.45, W * 0.26, H * 0.5, 1.25) : focus(0.68, 0.45, W / 2, PILL(W, H).t + PILL(W, H).h / 2, 1.35, [20, PILL(W, H).t, W - 20, PILL(W, H).t + PILL(W, H).h]))(W, H)}
      headClass="ko-v2"
      demo={
        <Scene slug="koe" className="ko-scene">
          <Studio slug="koe" engine="" specs={[['Zero-Shot Cloning', 'Reference Audio', '3.0s Clean Sample'], ['Sub-Second Latency', 'First Token', '< 200ms'], ['Synthesis Engine', 'Hanzo Koe-1 Engine', 'Neural Flow-Matching']]}>
            <Booth />
          </Studio>
        </Scene>
      }
    />
  );
}
