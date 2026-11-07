'use client';
/* Iro: imagine without limits. v2 launch page (Creative on Launch + Chapters, accent magenta).
   V2: 8/10 the film lands full-bleed and settles into a square canvas beside the headline; the live canvas comes first, then four pinned capability chapters on Iro's own film, a tile grid of where it fits, the studio map and the preview
   Signature: an image resolves out of noise. The canvas runs flow matching for real, x = t·image + (1−t)·noise,
   coarse shapes first and detail last, step 1 to 50; then a fresh seed starts again. Scrub the steps, pause, reseed,
   or reframe it at 16:9, 1:1 or 21:9. (The picture is Hanzo's own Iro illustration, not Iro's output.)
   Beyond: the studio map (Creative.jsx): every creative model serving your field, in its own words and colour. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { EASE } from '../../ui';
import { Studio } from './Studio';
import Creative, { Scene } from './Creative';
import { box as frame, film } from '../../v2/Launch';
import { useLoop, rng } from './live';
import './Iro.css';

const ASPECTS = [['16:9', 16 / 9], ['1:1', 1], ['21:9', 21 / 9]];
// fit each aspect inside the 4:3 frame (88% wide, 80% tall at most), as percentages of the frame
const box = (r) => { const w = Math.min(0.88, 0.6 * r); return { width: w * 100 + '%', height: (w / r / 0.75) * 100 + '%' }; };
const W = 240; // working width in pixels: the noise is computed here and the canvas scales it up
const STEPS = 50;

function Canvas() {
  const wrap = useRef(null), cv = useRef(null), stepEl = useRef(null), range = useRef(null);
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
    s.noise = new Float32Array(n);
    for (let i = 0; i < n; i++) s.noise[i] = (r() + r() + r() - 1.5) * 1.15; // roughly normal
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
        o[i + ch] = t * im + (1 - t) * (128 + N[i + ch] * 110);
      }
      o[i + 3] = 255;
    }
    g.putImageData(out, 0, 0);
    if (stepEl.current) stepEl.current.textContent = String(step);
    if (range.current && document.activeElement !== range.current) range.current.value = String(step);
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
            <img src={film('iro', 'webp')} alt="" data-on={done ? '' : undefined} />
          </motion.div>
        </AnimatePresence>
        <p className="ir-tag ir-tl mb-mono">CANVAS: 2048 × 2048 · 16-BIT FLOAT</p>
        <p className="ir-tag ir-bl mb-mono">FLOW-MATCHING CONVERGENCE: STEP <span ref={stepEl}>3</span>/50 · CFG: 7.0</p>
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

// the film settles into a square canvas beside the headline
const SQUARE = frame((W, H, wide) => {
  const z = wide ? Math.min(H * 0.76, W * 0.4) : Math.min(W * 0.8, H * 0.42);
  return wide ? { l: W * 0.7 - z / 2, t: (H - z) / 2, w: z, h: z, r: 16 } : { l: (W - z) / 2, t: H * 0.09, w: z, h: z, r: 16 };
});

export default function Iro() {
  return (
    <Creative
      slug="iro"
      accent="#e6337a"
      ink="#c2185b"
      shape={SQUARE}
      headClass="ir-head"
      aim={(W, H, wide) => (wide ? null : [-0.12 * W, -0.25 * H])}
      first="demo"
      demo={
        <Scene slug="iro" className="ir-scene" k="Live canvas" title="Watch an image resolve." lede="Flow matching, step 1 to 50: coarse shapes first, detail last. Scrub the steps, pause, reseed, or reframe it at 16:9, 1:1 or 21:9.">
          <Studio slug="iro" engine="Hanzo Iro-1 · Flow-matching DiT" specs={[['Typography Exactness', 'Font Locking', 'Locked'], ['Color Space', 'Wide Gamut', 'Display P3'], ['Prompt Adherence', 'Semantic Flow', 'High Precision']]}>
            <Canvas />
          </Studio>
        </Scene>
      }
    />
  );
}
