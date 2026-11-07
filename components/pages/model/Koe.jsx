'use client';
/* Koe: performance in every word. v2 launch page (Creative on Launch, Hanzo's black and white). The film settles
   into a tall capsule left of the headline.
   Signature: waveform. The booth is the first screen after the stage: a live waveform of one performance of "Hanzo"
   that plays by itself (it streams out of the playhead while the phonemes /h/ /æ/ /n/ /z/ /oʊ/ light in step), scrubs
   (drag or click anywhere on it, a finger works the same and vertical swipes still scroll; arrow keys step a quarter
   second, Page keys a second, Home/End jump, Space or Enter plays and pauses) and reacts to the pointer: the bars
   under it lift and the performance still to come shows through around it, with a ghost playhead reading its time.
   Each acting preset re-performs the same word (dramatic slow and wide, documentary breathy and soft, gritty rough,
   commercial brisk and even). (A drawn illustration of a performance, not Koe's audio.) Reduced motion: the whole
   performance drawn still, and scrubbing still moves the playhead and the phonemes.
   Entrances (each page-local, once, as the section comes into view; reduced motion and JS off show the final layout):
   typewriter (the booth's captions, timecode and specs type themselves out behind a caret, and the take starts at
   00:00), slot-roll (What Koe does), pendulum (Where Koe fits), inertia-drag (Find your field), noise-dissolve (the
   model cards). The capability chapters no longer pin: they are a plain section (KoeCreative.jsx).
   Beyond: the studio map (KoeCreative.jsx): every creative model serving your field, in its own words and colour.
   Persona: creative studio (researcher audience). Goal: request research access. CTA: Request access
   (/research-access?models=koe). Metric: contact_sales_submit.
   Body: KoeCreative.jsx (Koe's page-local copy of Creative.jsx) with KoePanels.jsx, so each capability and "Where Koe
   fits" draws its own booth-derived picture and Koe's wave film shows only on the stage, the map card and the model card.
   V2: 9/10 motion pass: the booth's waveform is the signature (plays, scrubs by drag, click, touch and keys, follows the pointer) right after the stage; five different entrances; the pinned chapters became a plain section */
import { useEffect, useMemo, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { Studio } from './Studio';
import { Scene } from './Creative';
import KoeCreative, { useEnter } from './KoeCreative';
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
const stamp = (t) => { const s = Math.min(LEN, Math.max(0, t)); return '00:0' + Math.floor(s) + '.' + String(s >= LEN ? 0 : Math.floor((s % 1) * 100)).padStart(2, '0'); };

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

/* entrance 1, typewriter: the booth's words type themselves out behind a caret. One line of the booth at a time with
   the caret (its caption, the timecode, the preset label), and the spec rows and the figure caption type alongside it.
   Clip-path only, line by line for wrapped text; the caret is a fixed 2px bar in the text's own colour. */
const MAIN = ['.ko-top .mb-mono', '.ko-tc', '.ko-presets .mb-mono'], SIDE = ['.mb-specs dt', '.mb-specs dd', '.mb-cap'];
function typer(fig, onStart) {
  const main = MAIN.map((s) => fig.querySelector(s)).filter(Boolean), side = SIDE.flatMap((s) => [...fig.querySelectorAll(s)]);
  const all = [...main, ...side];
  const hide = (el) => { el.style.clipPath = 'inset(0 100% 0 0)'; };
  all.forEach(hide);
  let raf = 0, caret = null;
  const geo = (el) => {
    const r = el.getBoundingClientRect(), rg = document.createRange();
    rg.selectNodeContents(el);
    const lines = [...rg.getClientRects()].filter((q) => q.width > 0).reduce((acc, q) => { const l = acc[acc.length - 1]; if (l && Math.abs(l.top - q.top) < 4) { l.right = Math.max(l.right, q.right); l.bottom = Math.max(l.bottom, q.bottom); } else acc.push({ left: q.left, right: q.right, top: q.top, bottom: q.bottom }); return acc; }, []);
    return { r, lines, total: lines.reduce((n, l) => n + l.right - l.left, 0) || 1, n: Math.max(1, (el.textContent || '').length) };
  };
  // the clip that shows the first k of the text's width: every line above in full, the current one up to its edge
  const clip = (el, g, k) => {
    let left = g.total * k, cur = g.lines[g.lines.length - 1], edge = cur ? cur.right : 0;
    for (const l of g.lines) { const w = l.right - l.left; if (left <= w) { cur = l; edge = l.left + left; break; } left -= w; }
    if (!cur) return null;
    const x = edge - g.r.left, top = cur.top - g.r.top, bot = cur.bottom - g.r.top + 2, W = g.r.width;
    el.style.clipPath = `polygon(0 0, ${W}px 0, ${W}px ${top}px, ${x}px ${top}px, ${x}px ${bot}px, 0 ${bot}px)`;
    return { x: edge, top: cur.top, h: cur.bottom - cur.top };
  };
  const api = {
    play() {
      onStart();
      const MS = 22; // per character
      let t0 = 0;
      const plan = [];
      main.forEach((el) => { const n = Math.max(1, (el.textContent || '').length); plan.push({ el, at: t0, dur: n * MS, caret: true }); t0 += n * MS + 90; });
      side.forEach((el, i) => { const n = Math.max(1, (el.textContent || '').length); plan.push({ el, at: 260 + i * 70, dur: Math.min(1100, n * 16) }); });
      const end = Math.max(...plan.map((p) => p.at + p.dur)) + 500;
      caret = document.createElement('i');
      caret.className = 'ko-caret';
      caret.setAttribute('aria-hidden', 'true');
      document.body.appendChild(caret);
      const start = performance.now();
      const tick = (now) => {
        const ms = now - start;
        let pos = null;
        plan.forEach((p) => {
          if (p.done) return;
          const k = Math.min(1, Math.max(0, (ms - p.at) / p.dur));
          if (ms < p.at) return;
          const g = geo(p.el);
          const q = clip(p.el, g, Math.round(k * g.n) / g.n);
          if (p.caret && q && k < 1) pos = [q, getComputedStyle(p.el).color];
          if (p.caret && q && k >= 1 && !pos) pos = [q, getComputedStyle(p.el).color];
          if (k >= 1) { p.el.style.clipPath = ''; p.done = true; }
        });
        if (pos) {
          const [q, col] = pos;
          caret.style.transform = `translate(${q.x + 1}px, ${q.top}px)`;
          caret.style.height = q.h + 'px';
          caret.style.background = col;
          caret.style.opacity = ms % 900 < 520 || ms < t0 ? '1' : '0';
        }
        if (ms < end) raf = requestAnimationFrame(tick);
        else api.cancel();
      };
      raf = requestAnimationFrame(tick);
    },
    cancel() { cancelAnimationFrame(raf); all.forEach((el) => { el.style.clipPath = ''; }); if (caret) caret.remove(); caret = null; },
  };
  return api;
}

function Booth() {
  const stage = useRef(null), wave = useRef(null), cv = useRef(null), sEl = useRef(null), csEl = useRef(null), cells = useRef([]), letters = useRef([]);
  const [pi, setPi] = useState(0);
  const [play, setPlay] = useState(true);
  const pagePaused = usePaused(); // the stage's one Pause holds the booth too
  const calm = useReducedMotion();
  // t: playhead (s); hx: the pointer over the wave (0..1) or null; lift: how much the pointer is felt (eases in/out)
  const S = useRef({ t: 1.9, hold: 0, k: -2, hx: null, lx: 0.5, lift: 0, drag: false, still: false, aria: '' });
  const amps = useMemo(() => PRESETS.map((p, i) => shape(p, 11 + i)), []);
  const piRef = useRef(0);
  piRef.current = pi;

  const mark = (t) => {
    const pr = PRESETS[piRef.current];
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

  const draw = () => {
    const c = cv.current, s = S.current;
    if (!c) return;
    const { w, h, d } = fit(c);
    const g = c.getContext('2d'), A = amps[piRef.current], bw = w / BARS, mid = h / 2;
    const hx = s.hx == null ? s.lx : s.hx, L = s.still ? (s.hx == null ? 0 : 1) : s.lift;
    g.clearRect(0, 0, w, h);
    for (let i = 0; i < BARS; i++) {
      const t = (i / BARS) * LEN, x = i * bw + bw * 0.2, bwid = Math.max(1, bw * 0.6);
      const near = L * Math.exp(-Math.pow(((i + 0.5) / BARS - hx) * BARS / 7, 2)); // the pointer's pull, 0..1
      if (t > s.t) {
        // still to come: a flat line, and around the pointer the performance ahead shows through
        const a = A[i] * near * (h * 0.46);
        g.fillStyle = `rgba(255,255,255,${(0.14 + near * 0.24).toFixed(3)})`;
        g.fillRect(x, mid - Math.max(d, a), bwid, Math.max(2 * d, a * 2));
        continue;
      }
      const grow = s.still ? 1 : Math.min(1, (s.t - t) / 0.12), a = A[i] * grow * (h * 0.46) * (1 + near * 0.18);
      g.fillStyle = s.t - t < 0.25 || near > 0.5 ? '#ffffff' : 'rgba(245,245,247,.78)';
      g.fillRect(x, mid - a, bwid, Math.max(2 * d, a * 2));
    }
    g.fillStyle = '#f5f5f5';
    g.fillRect(Math.min(w - 2 * d, (s.t / LEN) * w), 0, 2 * d, h);
    // the ghost playhead under the pointer, with the time it would seek to
    if (L > 0.02 && !s.drag) {
      const px = Math.min(w - d, hx * w);
      g.globalAlpha = Math.min(1, L);
      g.fillStyle = 'rgba(255,255,255,.4)';
      g.fillRect(px, 0, d, h);
      g.font = `500 ${Math.round(12 * d)}px ui-monospace, SFMono-Regular, Menlo, monospace`;
      g.textBaseline = 'top';
      const label = stamp(hx * LEN), tw = g.measureText(label).width, lx = px + 8 * d + tw > w ? px - 8 * d - tw : px + 8 * d;
      g.fillStyle = '#d4d4d4';
      g.fillText(label, lx, 10 * d);
      g.globalAlpha = 1;
    }
    const sec = Math.floor(Math.min(LEN, s.t)), cs = Math.floor((s.t % 1) * 100);
    if (sEl.current) sEl.current.textContent = String(Math.min(5, sec));
    if (csEl.current) csEl.current.textContent = String(s.t >= LEN ? 0 : cs).padStart(2, '0');
    const now = stamp(s.t);
    if (wave.current && now !== s.aria) { s.aria = now; wave.current.setAttribute('aria-valuenow', s.t.toFixed(2)); wave.current.setAttribute('aria-valuetext', now + ' of 00:05.00'); }
    mark(s.t);
  };

  useLoop(stage, (_, dt, still) => {
    const s = S.current;
    if (still) { if (!s.still) { s.still = true; s.t = LEN; } draw(); return; }
    s.still = false;
    if (play && !pagePaused && !s.drag) {
      if (s.t < LEN) s.t = Math.min(LEN, s.t + dt);
      else if ((s.hold += dt) > 1.1) { s.t = 0; s.hold = 0; }
    }
    s.lift += ((s.hx == null ? 0 : 1) - s.lift) * Math.min(1, dt * 10);
    if (s.hx != null) s.lx = s.hx;
    draw();
  });

  const xAt = (e) => { const r = cv.current.getBoundingClientRect(); return Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)); };
  const seekTo = (t) => { const s = S.current; s.t = Math.max(0, Math.min(LEN, t)); s.hold = 0; if (s.still || calm) draw(); };
  const down = (e) => {
    if (e.button > 0) return;
    const s = S.current;
    s.drag = true; s.hx = xAt(e);
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch {}
    seekTo(s.hx * LEN);
  };
  const move = (e) => {
    const s = S.current;
    if (e.pointerType !== 'mouse' && !s.drag) return; // touch: the wave answers the finger only while it scrubs
    s.hx = xAt(e);
    if (s.drag) seekTo(s.hx * LEN);
    else if (s.still || calm) draw();
  };
  const up = (e) => {
    const s = S.current;
    s.drag = false;
    if (e.pointerType !== 'mouse' || e.type === 'pointerleave' || e.type === 'pointercancel') s.hx = null;
    if (s.still || calm) draw();
  };
  const keys = (e) => {
    const s = S.current;
    const k = { ArrowRight: 0.25, ArrowUp: 0.25, ArrowLeft: -0.25, ArrowDown: -0.25, PageUp: 1, PageDown: -1 }[e.key];
    if (k) { e.preventDefault(); seekTo(s.t + k); return; }
    if (e.key === 'Home' || e.key === 'End') { e.preventDefault(); seekTo(e.key === 'Home' ? 0 : LEN); return; }
    if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); setPlay((p) => !p); }
  };
  const choose = (i) => { setPi(i); S.current.t = 0; S.current.hold = 0; S.current.k = -2; setPlay(true); };
  useEffect(() => { if (calm) draw(); }, [pi]); // eslint-disable-line react-hooks/exhaustive-deps

  // entrance 1: the booth types itself in, and the take starts from the top as it does
  useEnter(stage, null, (el) => typer(el.closest('.cr-studio') || el, () => { S.current.t = 0; S.current.hold = 0; S.current.k = -2; }));

  return (
    <div className="ko-booth" ref={stage}>
      <div className="ko-top">
        <p className="mb-mono">FLOW-MATCHING ACOUSTIC STAGE · STREAMING PHONEMES</p>
        <p className="ko-tc mb-tnum"><span>00:0</span><span ref={sEl}>1</span>.<span ref={csEl}>90</span> <span className="ko-tc-of">/ 00:05.00 · TTFT: 180ms</span></p>
        <button type="button" className="mb-chip" aria-pressed={play} onClick={() => setPlay(!play)}>{play ? 'Pause' : 'Play'}</button>
      </div>
      <div className="ko-wave" ref={wave} role="slider" tabIndex={0} aria-label="Voice waveform: seek" aria-valuemin={0} aria-valuemax={LEN} aria-valuenow={1.9} aria-valuetext="00:01.90 of 00:05.00" onKeyDown={keys}>
        <canvas ref={cv} aria-hidden="true" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onPointerLeave={up} />
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
