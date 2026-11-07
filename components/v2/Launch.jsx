'use client';
/* Launch: the v2 model-launch shell for Hanzo's named models (/enso /kai /zen /iro /koma /oto /koe /uta /mori).
   Owned by the Zen-names chat (wave 2, group 12). One file per piece; Chapters.jsx is its partner.

   Usage (a page's body file):
     <Launch slug="enso" accent="#e5412d" ink="#b4301f" shape={ring} head={<>…kicker, <Lines/>, lede, actions…</>}
             headClass="eo-head">{…chapters, demo, chart, spec…}</Launch>
   - Stage: the model card's film lands full-bleed (the WebGL opener's contract: data-hero={slug}, then data-ready once
     the poster decodes), and as you scroll it settles into the page's own shape (clip-path only, the camera feel is
     scale + clip) while the page's headline reveals beside it, line by line, once.
   - shape(t, W, H, wide) returns a CSS clip-path for t in 0..1 (0 = full-bleed). Helpers below: ring, box, poly.
   - over(W, H, wide) (optional) draws a layer over the settled film (e.g. a cube's edges); it fades in with the headline.
   - aim(W, H, wide) (optional) returns [dx, dy, zoom?]: how far the camera pans (and zooms, default 1.14) the film by
     the time it settles, so the subject sits inside the shape. focus(fx, fy, tx, ty, z) works it out for you.
   - The page's accent is set as --ac (fills) and --ac-ink (text on white) on the root; the film itself is a duotone in
     that accent (public/models/v2, made by scripts/tint.py), so colour arrives through the picture, not tinted boxes.
   - Close runs the film back into the card it opened from; the page ends on the next model's card, which opens the
     same way. Reduced motion shows the settled stage, no pin. */
import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent, useReducedMotion, useInView } from 'motion/react';
import { EASE } from '../ui';
import { useOpener } from '../Opener';
import { bySlug, MODELS } from '../../lib/models';
import { useFilms } from '../pages/model/live';
import '../pages/model/Model.css';
import './Launch.css';

// each model's film in its page accent (scripts/tint.py bakes the duotone into the file)
export const film = (slug, ext) => `/models/v2/${slug}.${ext}`;
export const lerp = (a, b, t) => a + (b - a) * t;
export const clamp01 = (t) => Math.min(1, Math.max(0, t));
const settle = (t) => { const x = clamp01(t); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };

/* shape helpers: each returns a function (t, W, H, wide) => clip-path */
// a circle that closes from beyond the corners onto (cx, cy) with radius r (px), per layout
export const ring = (at) => (t, W, H, wide) => {
  const { x, y, r } = at(W, H, wide);
  const far = Math.hypot(W, H);
  return `circle(${lerp(far, r, t).toFixed(1)}px at ${lerp(W / 2, x, t).toFixed(1)}px ${lerp(H / 2, y, t).toFixed(1)}px)`;
};
// a rounded rectangle that closes onto {l, t, w, h, r} (px)
export const box = (at) => (t, W, H, wide) => {
  const b = at(W, H, wide);
  const top = lerp(0, b.t, t), left = lerp(0, b.l, t), right = lerp(0, W - b.l - b.w, t), bottom = lerp(0, H - b.t - b.h, t);
  const r = typeof b.r === 'string' ? b.r : `${lerp(0, b.r, t).toFixed(1)}px`;
  return `inset(${top.toFixed(1)}px ${right.toFixed(1)}px ${bottom.toFixed(1)}px ${left.toFixed(1)}px round ${r})`;
};
// any polygon: pts(W, H, wide) gives the settled outline in px (clockwise); the opening frame projects every point
// out from the outline's centre to well beyond the screen, so t = 0 covers it all and every frame between is the
// same polygon, which clip-path can interpolate
export const poly = (pts) => (t, W, H, wide) => {
  const P = pts(W, H, wide);
  const cx = P.reduce((s, p) => s + p[0], 0) / P.length, cy = P.reduce((s, p) => s + p[1], 0) / P.length;
  const M = Math.max(W, H) * 0.6;
  const out = P.map(([x, y]) => {
    const dx = x - cx || 0.001, dy = y - cy || 0.001;
    const k = Math.min(Math.abs(((dx > 0 ? W + M : -M) - cx) / dx), Math.abs(((dy > 0 ? H + M : -M) - cy) / dy));
    const fx = cx + dx * k, fy = cy + dy * k;
    return `${lerp(fx, x, t).toFixed(1)}px ${lerp(fy, y, t).toFixed(1)}px`;
  });
  return `polygon(${out.join(',')})`;
};
// aim helper: the film's subject sits at (fx, fy) of the 4:5 frame (fractions); land it on (tx, ty) px at zoom z.
// box = [l, t, r, b], the settled shape's bounds in px: the pan is held back so the zoomed film always covers it.
// Returns [dx, dy, z] for Launch's aim.
export const focus = (fx, fy, tx, ty, z = 1.14, box) => (W, H) => {
  const s0 = Math.max(W / 1200, H / 1500), iw = 1200 * s0, ih = 1500 * s0;
  const px = fx * iw - (iw - W) / 2, py = fy * ih - (ih - H) / 2, cx = W / 2, cy = H / 2;
  let dx = tx - (cx + (px - cx) * z), dy = ty - (cy + (py - cy) * z);
  if (box) {
    dx = Math.min(Math.max(dx, box[2] - cx - cx * z), box[0] - cx + cx * z);
    dy = Math.min(Math.max(dy, box[3] - cy - cy * z), box[1] - cy + cy * z);
  }
  return [dx, dy, z];
};
// densify a closed outline so the opening frame stays a full cover (n points per edge)
export const dense = (V, n = 6) => V.flatMap((a, i) => { const b = V[(i + 1) % V.length]; return Array.from({ length: n }, (_, k) => [lerp(a[0], b[0], k / n), lerp(a[1], b[1], k / n)]); });

// a headline whose lines rise out of a mask, staggered, when its parent says so ([data-on]), or by itself the first
// time it scrolls into view (reveal)
export function Lines({ as: T = 'h2', id, className = '', lines, reveal }) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.6 });
  return (
    <T id={id} ref={ref} className={'lv-lines ' + className} data-on={reveal && seen ? '' : undefined}>
      {lines.map((l, i) => <span key={i} className="lv-ln"><span style={{ '--i': i }}>{l}</span></span>)}
    </T>
  );
}

export default function Launch({ slug, accent, ink, shape, aim, over, head, headClass = '', label, children }) {
  const m = bySlug[slug];
  const opener = useOpener();
  const root = useRef(null), stage = useRef(null), pin = useRef(null);
  const [ready, setReady] = useState(false);
  const [on, setOn] = useState(false);
  const [size, setSize] = useState(null);
  const calm = useReducedMotion();
  const [still, setStill] = useState(false); // set after mount: the server cannot know, and hydration keeps its attributes
  useEffect(() => setStill(!!calm), [calm]);
  const i = MODELS.findIndex((x) => x.slug === slug);
  const next = MODELS[(i + 1) % MODELS.length];

  const { scrollYProgress: p } = useScroll({ target: stage, offset: ['start 60px', 'end end'] });
  const t = useTransform(p, (v) => (still ? 1 : clamp01(v / 0.8)));
  const clip = useTransform(t, (v) => (!size || v <= 0.002 ? 'none' : shape(settle(v), size.W, size.H, size.wide)));
  const zoom = useTransform(t, (v) => { if (!size) return 1; const a = aim ? aim(size.W, size.H, size.wide) : null; return 1 + (((a && a[2]) || 1.14) - 1) * v; });
  // aim: the camera pans the film so its subject sits inside the settled shape ([dx, dy] px at t = 1, per layout)
  const pan = (k) => (v) => { if (!size || !aim) return 0; const a = aim(size.W, size.H, size.wide); return (a ? a[k] : 0) * settle(v); };
  const panX = useTransform(t, pan(0));
  const panY = useTransform(t, pan(1));
  const nameO = useTransform(t, [0, 0.28], [1, 0]);
  const nameY = useTransform(t, [0, 0.28], [0, -72]);
  const cueO = useTransform(t, [0, 0.08], [1, 0]);

  useEffect(() => {
    const img = stage.current.querySelector('.lv-film img');
    const done = () => setReady(true);
    if (img.complete) img.decode().then(done, done); else { img.addEventListener('load', done, { once: true }); img.addEventListener('error', done, { once: true }); }
    const ro = new ResizeObserver(([e]) => { const r = e.contentRect; setSize({ W: r.width, H: r.height, wide: r.width > 900 }); });
    ro.observe(pin.current);
    return () => ro.disconnect();
  }, []);
  useEffect(() => { if (calm || t.get() > 0.7) setOn(true); }, [calm, t]);
  useMotionValueEvent(t, 'change', (v) => { if (v > 0.7) setOn(true); else if (v < 0.45) setOn(false); }); // back up the stage, the headline steps aside for the name
  useFilms(root);

  return (
    <main className="x-model lv" ref={root} style={{ '--ac': accent, '--ac-ink': ink || accent }} data-calm={still ? '' : undefined}>
      <section className="lv-stage" ref={stage} data-hero={slug} data-ready={ready ? '' : undefined} aria-label={label || m.name}>
        <div className="lv-pin" ref={pin}>
          <motion.div className="lv-film" style={{ clipPath: clip }}>
            <motion.div className="lv-film-in" style={{ scale: zoom, x: panX, y: panY }}>
              <img src={film(slug, 'webp')} alt="" />
              <video src={film(slug, 'webm')} autoPlay muted loop playsInline aria-hidden="true" />
            </motion.div>
            <motion.i className="lv-scrim" style={{ opacity: nameO }} aria-hidden="true" />
          </motion.div>
          <motion.div className="lv-name x-wrap" style={{ opacity: nameO, y: nameY }}>
            {m.kicker && <p className="lv-name-k" data-on={ready ? '' : undefined}>{m.kicker}</p>}
            <h1 className="lv-name-h">
              <span className="x-line"><motion.span className="x-line-in" initial={{ y: '105%' }} animate={ready ? { y: 0 } : {}} transition={{ duration: 1.1, ease: EASE, delay: 0.1 }}>{m.name}</motion.span></span>
            </h1>
            <p className="lv-name-d" data-on={ready ? '' : undefined}>{m.desc}</p>
            <p className="x-mtags static lv-name-t" data-on={ready ? '' : undefined}>{m.tags.map((x) => <span key={x}>{x}</span>)}</p>
          </motion.div>
          {over && size && <div className="lv-over" data-on={on ? '' : undefined} aria-hidden="true">{over(size.W, size.H, size.wide)}</div>}
          <div className={'lv-head ' + headClass} data-on={on ? '' : undefined}>{head}</div>
          <motion.a
            href="/"
            className="x-mclose lv-close"
            aria-label="Close and return to all models"
            onClick={(e) => opener.close(e, { key: slug, src: film(slug, 'webp') })}
            initial={{ opacity: 0, scale: 0.6 }} animate={ready ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.6, ease: EASE, delay: 0.5 }}
            whileHover={{ rotate: 90 }} whileTap={{ scale: 0.9 }}
          >
            <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3.5 3.5l9 9M12.5 3.5l-9 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
          </motion.a>
          <motion.span className="lv-cue" style={{ opacity: cueO }} aria-hidden="true"><i />Scroll</motion.span>
        </div>
      </section>
      <div className="x-model-body lv-body">{children}</div>
      <a href={'/' + next.slug} className="x-next lv-next" data-card={next.slug} data-cursor="Open" onClick={(e) => opener.open(e, { el: e.currentTarget, src: film(next.slug, 'webp'), href: '/' + next.slug, key: next.slug })}>
        <img src={film(next.slug, 'webp')} alt="" loading="lazy" />
        <video className="mb-next-film" src={film(next.slug, 'webm')} autoPlay muted loop playsInline preload="none" aria-hidden="true" />
        <span className="x-next-k">Next model</span>
        <span className="x-next-n">{next.name}</span>
        <span className="x-next-d">{next.desc}</span>
      </a>
    </main>
  );
}
