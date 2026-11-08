'use client';
/* Iro: imagine without limits. v2 launch page (Creative on Launch + Chapters, Hanzo's black and white).
   Signature: an image resolves out of noise. The canvas runs flow matching for real, x = t·image + (1−t)·noise,
   coarse shapes first and detail last, step 1 to 50; then a fresh seed starts again. Scrub the steps, pause, reseed,
   or reframe it at 16:9, 1:1 or 21:9. (The picture is Hanzo's own Iro illustration, not Iro's output.)
   Beyond: the studio map (Creative.jsx): every creative model serving your field, in its own words and colour. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { EASE } from '../../ui';
import { Img } from '../../kit';
import { Studio, Glyph } from './Studio';
import Creative, { Scene } from './Creative';
import { box as frame, film, focus } from '../../v2/Launch';
import { useLoop, rng } from './live';
import usePhoneAsk from '../usePhoneAsk';
import './Iro.css';

const ASPECTS = [['16:9', 16 / 9], ['1:1', 1], ['21:9', 21 / 9]];
// each aspect fits inside the frame (88% wide, the frame's height less room for the tags), sized in CSS from --r
const box = (r) => ({ '--r': r });
const W = 240; // working width in pixels: the noise is computed here and the canvas scales it up
const STEPS = 50;

function Canvas() {
  const wrap = useRef(null), cv = useRef(null), stepEl = useRef(null), lineEl = useRef(null), range = useRef(null);
  const [a, setA] = useState(1);
  const aNow = useRef(1);
  aNow.current = a; // an exiting canvas (old aspect) must never take the ref back
  const [play, setPlay] = useState(true);
  const [done, setDone] = useState(false);
  const calm = useReducedMotion();
  const S = useRef({ levels: null, noise: null, seed: 7, step: 3, drawn: -1, t: 0, hold: 0, img: null });

  // build the working set for an aspect: the picture at five levels of detail, and a noise field
  const prep = () => {
    const s = S.current, img = s.img;
    if (!img) return;
    const r = ASPECTS[aNow.current][1], w = W, h = Math.round(W / r);
    const sh = img.width / r, sy = (img.height - sh) / 2; // crop the centre band, as object-fit: cover does
    const c = document.createElement('canvas'), g = c.getContext('2d', { willReadFrequently: true });
    c.width = w; c.height = h;
    s.levels = [24, 12, 6, 3, 1].map((div) => {
      const t = document.createElement('canvas'); t.width = Math.max(2, Math.round(w / div)); t.height = Math.max(2, Math.round(h / div));
      t.getContext('2d').drawImage(img, 0, sy, img.width, sh, 0, 0, t.width, t.height);
      g.imageSmoothingEnabled = true; g.clearRect(0, 0, w, h); g.drawImage(t, 0, 0, w, h);
      return g.getImageData(0, 0, w, h).data.slice();
    });
    reseed(false);
    const c2 = cv.current; c2.width = w; c2.height = h;
    s.drawn = -1;
  };
  const reseed = (restart = true) => {
    const s = S.current, n = s.levels ? s.levels[0].length : 0, r = rng(++s.seed);
    s.noise = new Float32Array(Math.ceil(n / 4)); // one value per pixel: grey noise, so colour only comes from Hanzo's picture
    for (let i = 0; i < s.noise.length; i++) s.noise[i] = (r() + r() + r() - 1.5) * 1.15; // roughly normal
    if (restart) { s.t = 0; s.hold = 0; s.drawn = -1; setDone(false); }
  };
  const draw = (step) => {
    const s = S.current;
    if (!s.levels || s.drawn === step) return;
    s.drawn = step;
    const c = cv.current, g = c.getContext('2d'), out = g.createImageData(c.width, c.height), o = out.data;
    const t = step / STEPS, f = Math.min(3.999, t * 4.4), k = Math.floor(f), fr = f - k, A = s.levels[k], B = s.levels[k + 1], N = s.noise;
    for (let i = 0; i < o.length; i += 4) {
      for (let ch = 0; ch < 3; ch++) {
        const im = A[i + ch] + (B[i + ch] - A[i + ch]) * fr;
        o[i + ch] = t * im + (1 - t) * (128 + N[i >> 2] * 110);
      }
      o[i + 3] = 255;
    }
    g.putImageData(out, 0, 0);
    if (stepEl.current) stepEl.current.textContent = String(step);
    if (lineEl.current) lineEl.current.textContent = `FLOW-MATCHING CONVERGENCE: STEP ${step}/50 · CFG: 7.0`; // Hanzo's readout line, whole, as it reads now
    if (range.current && document.activeElement !== range.current) range.current.value = String(step);
    range.current?.style.setProperty('--f', (((step - 1) / (STEPS - 1)) * 100).toFixed(1) + '%');
  };

  useEffect(() => {
    const img = new Image();
    img.src = film('iro', 'webp');
    img.decode().then(() => { S.current.img = img; prep(); draw(calm ? STEPS : S.current.step); if (calm) setDone(true); }).catch(() => {});
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (S.current.img) { prep(); draw(S.current.step); } }, [a]); // eslint-disable-line react-hooks/exhaustive-deps

  useLoop(wrap, (_, dt, still) => {
    const s = S.current;
    if (still || !s.levels) return;
    if (play) {
      if (s.step < STEPS) {
        s.t = Math.min(1, s.t + dt / 4.2);
        const e = s.t < 0.5 ? 2 * s.t * s.t : 1 - Math.pow(-2 * s.t + 2, 2) / 2;
        s.step = Math.max(1, Math.round(e * STEPS));
        if (s.step === STEPS) setDone(true);
      } else if ((s.hold += dt) > 2.6) { reseed(); s.step = 1; }
    }
    draw(s.step);
  });

  const scrub = (v) => { const s = S.current; setPlay(false); s.step = v; s.t = v / STEPS; setDone(v === STEPS); draw(v); };

  return (
    <div className="ir-stage" ref={wrap}>
      <div className="ir-frame">
        <AnimatePresence initial={false}>
          <motion.div key={a} className="ir-pic" style={box(ASPECTS[a][1])} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.02 }} transition={{ duration: 0.6, ease: EASE }}>
            <canvas data-a={a} ref={(el) => { if (el && +el.dataset.a === aNow.current) cv.current = el; }} aria-label="An image resolving from noise, step by step" role="img" />
            <Img src={film('iro', 'webp')} w={1200} h={1500} data-on={done ? '' : undefined} />
          </motion.div>
        </AnimatePresence>
        <p className="ir-tag ir-tl mb-mono">CANVAS: 2048 × 2048 · 16-BIT FLOAT</p>
        {/* Hanzo's own line, word for word, for readers and the copy check; the readout beside it counts the live step */}
        <p className="ir-tag ir-bl mb-mono"><span className="x-sr" ref={lineEl}>FLOW-MATCHING CONVERGENCE: STEP 3/50 · CFG: 7.0</span><span aria-hidden="true">FLOW-MATCHING CONVERGENCE: STEP <span className="ir-n" ref={stepEl}>3</span>/50 <span className="ir-cfg">· CFG: 7.0</span></span></p>
      </div>
      <div className="ir-ctl">
        <button type="button" className="mb-chip ir-play" aria-pressed={play} onClick={() => { const s = S.current; if (s.step >= STEPS) { reseed(); s.step = 1; } setPlay(!play); }}>{play ? 'Pause' : 'Play'}</button>
        <label className="ir-range">
          <span className="x-sr">Step</span>
          <input ref={range} type="range" min="1" max={STEPS} defaultValue="3" onInput={(e) => scrub(+e.target.value)} />
        </label>
        <button type="button" className="mb-chip" onClick={() => { reseed(); S.current.step = 1; setPlay(true); }}>New seed</button>
        <div className="mb-chips ir-asp" role="group" aria-label="Aspect">
          {ASPECTS.map(([l], i) => <button key={l} type="button" className="mb-chip" aria-pressed={a === i} onClick={() => setA(i)}>{l}</button>)}
        </div>
      </div>
    </div>
  );
}


/* a still of the same flow at one step: each chapter (and the fits tile) shows the picture part-made, so the page shows
   the image being made instead of one finished picture over and over; it runs up to its step while read */
const GW = 360, GH = 450;
function Grain({ step, on, seed }) {
  const cv = useRef(null);
  const calm = useReducedMotion();
  useEffect(() => {
    const img = new Image();
    img.src = film('iro', 'webp');
    let raf = 0, dead = false;
    img.decode().then(() => {
      const c = cv.current;
      if (dead || !c) return;
      c.width = GW; c.height = GH;
      const g = c.getContext('2d', { willReadFrequently: true }), tmp = document.createElement('canvas'), r = rng(seed);
      const N = new Float32Array(GW * GH).map(() => (r() + r() + r() - 1.5) * 1.15);
      const paint = (k) => {
        const t = k / STEPS, div = Math.max(1, Math.round(1 + 23 * (1 - t) ** 2)); // coarse shapes first, detail last
        tmp.width = Math.ceil(GW / div); tmp.height = Math.ceil(GH / div);
        tmp.getContext('2d').drawImage(img, 0, 0, tmp.width, tmp.height);
        g.imageSmoothingEnabled = true; g.drawImage(tmp, 0, 0, GW, GH);
        const d = g.getImageData(0, 0, GW, GH), o = d.data;
        for (let i = 0; i < o.length; i += 4) { const n = (1 - t) * (128 + N[i >> 2] * 80); o[i] = t * o[i] + n; o[i + 1] = t * o[i + 1] + n; o[i + 2] = t * o[i + 2] + n; }
        g.putImageData(d, 0, 0);
      };
      if (calm || !on) { paint(step); return; }
      const t0 = performance.now();
      const run = (now) => { const p = Math.min(1, (now - t0) / 1600); paint(Math.max(1, Math.round(step * (1 - (1 - p) ** 3)))); if (p < 1 && !dead) raf = requestAnimationFrame(run); };
      raf = requestAnimationFrame(run);
    }).catch(() => {});
    return () => { dead = true; cancelAnimationFrame(raf); };
  }, [on, step, seed, calm]);
  return <canvas ref={cv} role="img" aria-label={`Step ${step} of ${STEPS}`} />;
}
const CAP_STEPS = [26, 34, 42, 50];

// the film settles into a square canvas beside the headline
// (on a phone the square sits just above the headline block (about 270px tall at the foot of the screen, 320px on a 320px-wide phone), so no
// band of empty paper opens between them; the camera lands Iro's subject in the square wherever it sits)
const sq = (W, H, wide) => {
  if (wide) { const z = Math.min(H * 0.76, W * 0.4); return { l: W * 0.7 - z / 2, t: (H - z) / 2, w: z, h: z, r: 16 }; }
  const head = W < 360 ? 320 : 270, z = Math.min(W * 0.84, H * 0.46, H - head - 88);
  return { l: (W - z) / 2, t: Math.max(64, H - head - 24 - z), w: z, h: z, r: 16 };
};
const SQUARE = frame(sq);
const aimAt = (W, H, wide) => {
  if (wide) return null;
  const q = sq(W, H, false);
  return focus(0.62, 0.55, q.l + q.w / 2, q.t + q.h / 2, 1.14, [q.l, q.t, q.l + q.w, q.t + q.h])(W, H);
};

export default function Iro() {
  usePhoneAsk();
  return (
    <Creative
      slug="iro"
      subject={[0.62, 0.55]}
      shape={SQUARE}
      headClass="ir-head"
      aim={aimAt}
      first="demo"
      capArt={(i, on, base) => <div className="cr-art ir-grain" style={base}><Grain step={CAP_STEPS[i]} on={on} seed={11 + i} /><Glyph k="iro" i={i} /></div>}
      fitsArt={(seen) => <figure className="cr-fits-art ir-grain"><Grain step={STEPS} on={seen} seed={5} /></figure>}
      demo={
        <Scene slug="iro" className="ir-scene">
          <Studio slug="iro" engine="Hanzo Iro-1 · Flow-matching DiT" specs={[['Typography Exactness', 'Font Locking', 'Locked'], ['Color Space', 'Wide Gamut', 'Display P3'], ['Prompt Adherence', 'Semantic Flow', 'High Precision']]}>
            <Canvas />
          </Studio>
        </Scene>
      }
    />
  );
}
