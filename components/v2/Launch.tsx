'use client';
/* Launch: the v2 model-launch shell for Hanzo's named models (/enso /kai /zen /iro /koma /oto /koe /uta /mori).
   Owned by the Zen-names chat (wave 2, group 12). One file per piece; x-cray/Chapters.jsx is its partner.

   Usage (a page's body file):
     <Launch slug="enso" shape={ring} head={<><Lines/>, lede, actions…</>} headClass="eo-head">
       {…chapters, demo, chart, spec, <ModelCards slug="enso" />, <Band … />}
     </Launch>
   - Stage: the model card's film lands full-bleed (the WebGL opener's contract: data-hero={slug}, then data-ready once
     the poster decodes). On wide screens it settles into the page's own shape as you scroll (a pinned scene); on
     phones nothing pins: it settles by itself a moment after arrival. Clip-path, pan and zoom only. The page's
     headline then rises beside it, line by line. No eyebrow above the h1 (JAMES.md).
   - shape(t, W, H, wide) returns a CSS clip-path for t in 0..1 (0 = full-bleed). Helpers below: ring, box, poly.
   - over(W, H, wide) (optional) draws a layer over the settled film (e.g. a cube's edges); it fades in with the headline.
   - pos (optional): the film's object-position, e.g. '50% 88%' when the subject sits low in Hanzo's 4:5 frame.
   - aim(W, H, wide) (optional) returns [dx, dy, zoom?]: how far the camera pans (and zooms, default 1.14) the film by
     the time it settles, so the subject sits inside the shape. focus(fx, fy, tx, ty, z) works it out for you.
   - ask = { label, to, id }: the page's one solid ask, in Hanzo's words, on the very first screen (white on the film);
     the headline beside the settled film carries the same ask, so one solid button shows at a time.
   - Colour: none of our own (JAMES.md 7, 0 UI hues). The film is Hanzo's own, never filtered or dimmed; the only
     dimming is the gradient under the name. --ac / --ac-ink stay as neutral ink tokens for the page files.
   - One solid fill: Hanzo's sticky header carries the solid "Try Hanzo" (MASTER 3.2 rule 6), so the page's own asks
     are quiet (outline) and their seconds are links. The phone bar (Ask.jsx) carries the page's own ask where it covers nothing.
   - One pause (the shared FilmPause, bottom right of the stage) stops every film and self-running demo on the page.
   - Close runs the film back into the card it opened from. Reduced motion and JS off share one calm layout: the full
     film with the name and the ask, then the headline, lede and actions below it, nothing pinned or hidden. */
import { useEffect, useRef, useState } from 'react';
import { motion, animate, useScroll, useTransform, useMotionValue, useMotionValueEvent, useReducedMotion, useInView } from 'motion/react';
import { EASE } from '../ui';
import { Img, Cta } from '../kit';
import ModelFilm, { FilmPause } from './ModelFilm';
import { useOpener } from '../Opener';
import { bySlug, media } from '../../lib/models';
import '../pages/model/Model.css';
import './Launch.css';

// each model's own film, exactly as Hanzo publishes it
export const film = (slug, ext) => media(slug, ext);
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
// pos = the film's object-position as fractions (Launch's pos prop), when the page moves it off centre.
// Returns [dx, dy, z] for Launch's aim.
export const focus = (fx, fy, tx, ty, z = 1.14, box, pos = [0.5, 0.5]) => (W, H) => {
  const s0 = Math.max(W / 1200, H / 1500), iw = 1200 * s0, ih = 1500 * s0;
  const px = fx * iw - (iw - W) * pos[0], py = fy * ih - (ih - H) * pos[1], cx = W / 2, cy = H / 2;
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

export default function Launch({ slug, shape, aim, over, head, headClass = '', label, ask, pos, children }) {
  const m = bySlug[slug];
  const opener = useOpener();
  const stage = useRef(null), pin = useRef(null);
  const [ready, setReady] = useState(false);
  const [on, setOn] = useState(false);
  const [size, setSize] = useState(null);
  const calm = useReducedMotion();
  const [still, setStill] = useState(false); // set after mount: the server cannot know, and hydration keeps its attributes
  useEffect(() => setStill(!!calm), [calm]);
  const narrow = size ? !size.wide : false;

  // wide: the scroll drives the settle; narrow: time does (a moment after arrival), so phones never pin
  const { scrollYProgress: p } = useScroll({ target: stage, offset: ['start 60px', 'end end'] });
  const tv = useMotionValue(0);
  const mode = useRef({ narrow: false, still: false });
  mode.current = { narrow, still };
  const t = useTransform([p, tv], ([a, b]) => (mode.current.still ? 0 : mode.current.narrow ? b : clamp01(a / 0.8))); // reduced motion: the calm layout (film with the name, then the headline below)
  useEffect(() => {
    if (!ready || !narrow || still) return;
    const c = animate(tv, 1, { duration: 1.5, ease: EASE, delay: 1.1 });
    return () => c.stop();
  }, [ready, narrow, still, tv]);
  const clip = useTransform(t, (v) => (!size || v <= 0.002 ? 'none' : shape(settle(v), size.W, size.H, size.wide)));
  const zoom = useTransform(t, (v) => { if (!size) return 1; const a = aim ? aim(size.W, size.H, size.wide) : null; return 1 + (((a && a[2]) || 1.14) - 1) * v; });
  // aim: the camera pans the film so its subject sits inside the settled shape ([dx, dy] px at t = 1, per layout)
  const pan = (k) => (v) => { if (!size || !aim) return 0; const a = aim(size.W, size.H, size.wide); return (a ? a[k] : 0) * settle(v); };
  const panX = useTransform(t, pan(0));
  const panY = useTransform(t, pan(1));
  const nameO = useTransform(t, [0, 0.28], [1, 0]);
  const nameY = useTransform(t, [0, 0.28], [0, -72]);

  useEffect(() => {
    const img = stage.current.querySelector('.lv-film img');
    const done = () => setReady(true);
    if (img.complete && img.naturalWidth > 0) done();
    else if (img.complete) img.decode().then(done, done);
    else { img.addEventListener('load', done, { once: true }); img.addEventListener('error', done, { once: true }); }
    const ro = new ResizeObserver(([e]) => { const r = e.contentRect; setSize({ W: r.width, H: r.height, wide: r.width > 900 }); });
    ro.observe(pin.current);
    return () => ro.disconnect();
  }, []);
  useEffect(() => { if (still || t.get() > 0.7) setOn(true); }, [still, t, size]);
  const [gone, setGone] = useState(false);
  useEffect(() => { if (still) setGone(false); }, [still]);
  useMotionValueEvent(t, 'change', (v) => { setGone(v > 0.2); if (v > 0.7) setOn(true); else if (v < 0.45) setOn(false); }); // back up the stage, the headline steps aside for the name

  return (
    <main className="x-model lv" data-cursor="" style={pos ? { '--fpos': pos } : undefined} data-calm={still ? '' : undefined} data-narrow={narrow ? '' : undefined}>
      <section className="lv-stage" ref={stage} data-hero={slug} data-ready={ready ? '' : undefined} aria-label={label || m.name}>
        <div className="lv-pin" ref={pin}>
          <motion.div className="lv-film" style={{ clipPath: clip }}>
            <motion.div className="lv-film-in" style={{ scale: zoom, x: panX, y: panY }}>
              <Img src={film(slug, 'webp')} w={1200} h={1500} priority />
              <ModelFilm slug={slug} className="lv-film-v" />
            </motion.div>
            <motion.i className="lv-scrim" style={{ opacity: nameO }} aria-hidden="true" />
          </motion.div>
          <motion.div className="lv-name x-wrap" style={{ opacity: nameO, y: nameY }} data-gone={gone ? '' : undefined}>
            <h1 className="lv-name-h">
              <span className="x-line"><motion.span className="x-line-in" initial={{ y: '105%' }} animate={ready ? { y: 0 } : {}} transition={{ duration: 1.1, ease: EASE, delay: 0.1 }}>{m.name}</motion.span></span>
            </h1>
            <p className="lv-name-d" data-on={ready ? '' : undefined}>{m.desc}</p>
            <p className="x-mtags static lv-name-t" data-on={ready ? '' : undefined}>{m.tags.map((x) => <span key={x}>{x}</span>)}</p>
            {ask && <p className="lv-name-ask" data-on={ready ? '' : undefined}><Cta to={ask.to} kind="quiet" id={ask.id}>{ask.label}</Cta></p>}
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
          <FilmPause className="dark lv-pause" />
        </div>
      </section>
      <div className="x-model-body lv-body">{children}</div>
    </main>
  );
}
