'use client';
/* ZoomMap: the zoom-map primitive (docs/MOTION-MAP.md, `zoom-map`): scroll zooms from the whole system down into one
   part, which then fills the screen and explains itself. Used by /datastore (paper) and /engine (dark); each page
   draws its own map, its own part and its own look.
   Usage:
     <ZoomMap className="ds-z" label="Zoom" w={1400} h={800} tall={420}
       stops={[{ rect: [0, 0, 1400, 800], name: 'hanzoai/datastore' }, { rect: [x, y, w, h], name: 'node' }, …,
               { rect: [x, y, w, h], name: 'event', cover: true }]}
       head={<h2>…</h2>}            // the section's words, always on screen (a band over the map on wide screens)
       map={<g>…</g>}               // the SVG drawing, in map units (w × h); the camera is the SVG viewBox
       art={<div>…</div>}           // the part, drawn big: shown once the last stop fills the screen
       say={<div>…</div>}           // the part explaining itself (always in the HTML)
       onTail={(t) => …} />         // 0→1 over the scroll after the part has filled the screen (wide screens only)
   - stops: rects to frame, whole system first. `frame` [l, t, r, b] (stage fractions) is where a rect sits on wide
     screens, `frameTap` on phones; `cover: true` fills the stage with it (the last stop).
   - The root carries data-level (the stop reached), data-wide, data-mode ('scroll' | 'tap' | 'still') and the CSS
     vars --zl (level, float), --zd (the part shown, 0→1) and --zt (tail 0→1), for the page's CSS.
   - Wide screens with motion: a tall runway; the stage sticks while the scroll drives the camera (one stop at a time,
     with a hold at each). The path (a breadcrumb of stop names) and a click on the map jump to the next stop.
   - Phones: no runway; tap the map (or the path) and the camera glides one stop in. One rAF tween, only while moving.
   - Reduced motion: the last stop, the part shown and explained, statically; the path still jumps between stops.
   - JS off: the whole map, then the part and its words, stacked. */
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useScroll, useMotionValueEvent } from 'motion/react';
import { useCalm } from '../../ui';
import { useWide } from '../../v2/KeynoteChapters';
import { scrollToY } from '../../../lib/scroll';
import './ZoomMap.css';

const useIso = typeof window === 'undefined' ? useEffect : useLayoutEffect;
const clamp01 = (v) => Math.min(1, Math.max(0, v));
const smooth = (t) => t * t * (3 - 2 * t);
const Z0 = 0.03, Z1 = 0.58, D0 = 0.6, D1 = 0.68, T0 = 0.72, T1 = 0.95;
const FRAME = [0.05, 0.32, 0.95, 0.95];
const FRAME_TAP = [0.04, 0.05, 0.96, 0.95];

/* the camera that frames one stop on a W × H stage: the map point at the stage centre (cx, cy) and pixels per unit (s) */
function fit(stop, W, H, wide) {
  const [x, y, w, h] = stop.rect;
  if (stop.cover) return { cx: x + w / 2, cy: y + h / 2, s: Math.max(W / w, H / h) * 1.06 };
  const [l, t, r, b] = (wide ? stop.frame : stop.frameTap) || (wide ? FRAME : FRAME_TAP);
  const s = Math.min(((r - l) * W) / w, ((b - t) * H) / h);
  return { cx: x + w / 2 - (((l + r) / 2) * W - W / 2) / s, cy: y + h / 2 - (((t + b) / 2) * H - H / 2) / s, s };
}
/* a zoom between two cameras: scale moves geometrically, the centre keeps pace with it, so the target stays put */
function between(a, b, t) {
  const s = a.s * Math.pow(b.s / a.s, t);
  const f = Math.abs(b.s - a.s) < 1e-6 ? t : (1 / a.s - 1 / s) / (1 / a.s - 1 / b.s);
  return { cx: a.cx + (b.cx - a.cx) * f, cy: a.cy + (b.cy - a.cy) * f, s };
}
const viewBox = (c, W, H) => `${(c.cx - W / 2 / c.s).toFixed(2)} ${(c.cy - H / 2 / c.s).toFixed(2)} ${(W / c.s).toFixed(2)} ${(H / c.s).toFixed(2)}`;

export default function ZoomMap({ w, h, stops, map, head, art, say, label = 'Zoom', className = '', tall = 400, onTail }) {
  const root = useRef(null);
  const run = useRef(null);
  const view = useRef(null);
  const svg = useRef(null);
  const n = stops.length;
  const wide = useWide();
  const calm = useCalm();
  const mode = calm ? 'still' : wide ? 'scroll' : 'tap';
  const [level, setLevel] = useState(0);
  const [shown, setShown] = useState(false);
  const size = useRef({ W: 1470, H: 801 });
  const cams = useRef(null);
  const now = useRef({ L: 0, d: 0 });
  const tween = useRef(0);
  const tail = useRef(onTail);
  tail.current = onTail;
  const seg = (Z1 - Z0) / (n - 1);
  const { scrollYProgress: p } = useScroll({ target: run, offset: ['start start', 'end end'] });

  const camsFor = useCallback(() => stops.map((s) => fit(s, size.current.W, size.current.H, wide)), [stops, wide]);
  if (!cams.current) cams.current = stops.map((s) => fit(s, 1470, 801, true));

  /* draw one moment: level L (float), the part shown d, the tail t */
  const draw = useCallback((L, d, t) => {
    const C = cams.current, i = Math.min(n - 2, Math.floor(L));
    const c = between(C[i], C[i + 1], clamp01(L - i));
    const { W, H } = size.current;
    svg.current?.setAttribute('viewBox', viewBox(c, W, H));
    const el = root.current;
    if (el) {
      el.style.setProperty('--zl', L.toFixed(3));
      el.style.setProperty('--zd', d.toFixed(3));
      el.style.setProperty('--zt', t.toFixed(3));
    }
    now.current = { L, d };
    setLevel(Math.min(n - 1, Math.floor(L + 0.02)));
    setShown(d > 0.3);
    if (t >= 0) tail.current?.(t);
  }, [n]);

  const fromScroll = useCallback((v) => {
    const u = (v - Z0) / seg;
    const i = Math.floor(clamp01(u / (n - 1)) * (n - 1) - 1e-9);
    const L = u <= 0 ? 0 : u >= n - 1 ? n - 1 : i + smooth(clamp01((u - i - 0.18) / 0.82));
    draw(L, clamp01((v - D0) / (D1 - D0)), clamp01((v - T0) / (T1 - T0)));
  }, [draw, n, seg]);

  /* measure the stage, re-frame every stop, redraw where we are */
  useIso(() => {
    const el = view.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) return;
      size.current = { W: r.width, H: r.height };
      cams.current = camsFor();
      if (mode === 'scroll') fromScroll(p.get());
      else draw(now.current.L, now.current.d, -1);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [camsFor, mode]);

  /* the mode decides the starting moment: the scroll's, the top stop (tap) or the part explained (still) */
  useEffect(() => {
    cancelAnimationFrame(tween.current);
    if (mode === 'scroll') fromScroll(p.get());
    else if (mode === 'still') draw(n - 1, 1, 1);
    else draw(0, 0, -1);
  }, [mode]);

  useMotionValueEvent(p, 'change', (v) => { if (mode === 'scroll') fromScroll(v); });
  useEffect(() => () => cancelAnimationFrame(tween.current), []);

  /* tap mode: glide one stop at a time (one rAF tween, ended when it lands) */
  const glide = (k) => {
    cancelAnimationFrame(tween.current);
    const a = now.current, dTo = k === n - 1 ? 1 : 0;
    const ms = 650 + Math.abs(k - a.L) * 250;
    const t0 = performance.now();
    const step = (tm) => {
      const q = clamp01((tm - t0) / ms);
      const e = q < 0.5 ? 4 * q * q * q : 1 - Math.pow(-2 * q + 2, 3) / 2;
      const dq = dTo ? clamp01((q - 0.7) / 0.3) : clamp01(q / 0.25);
      draw(a.L + (k - a.L) * e, a.d + (dTo - a.d) * dq, -1);
      if (q < 1) tween.current = requestAnimationFrame(step);
    };
    tween.current = requestAnimationFrame(step);
  };

  const go = (k) => {
    if (mode === 'still') { draw(k, k === n - 1 ? 1 : 0, 1); return; }
    if (mode === 'tap') { glide(k); return; }
    const el = run.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const span = el.offsetHeight - window.innerHeight;
    const at = k === 0 ? 0 : k === n - 1 ? D1 + 0.01 : Z0 + k * seg + 0.06 * seg;
    scrollToY(top + span * at, { duration: 1.2 });
  };

  const next = stops[level + 1];
  const pad = next ? Math.max(next.rect[2], next.rect[3]) * 0.03 : 0;
  return (
    <section ref={root} className={'zm ' + className} data-mode={mode} data-wide={wide ? '' : undefined} data-level={level} data-shown={shown ? '' : undefined} style={{ '--zm-tall': tall + 'svh', '--zm-n': n }} aria-label={label}>
      <div ref={run} className="zm-run">
        <div className="zm-stage">
          <div className="zm-head">
            {head}
            <nav className="zm-path" aria-label={label}>
              {stops.map((s, i) => (
                <span key={s.name} className="zm-step">
                  {i > 0 && <span className="zm-sep" aria-hidden="true">/</span>}
                  <button type="button" data-sound="tick" aria-current={level === i ? 'step' : undefined} onClick={() => go(i)}>{s.name}</button>
                </span>
              ))}
            </nav>
          </div>
          <div ref={view} className="zm-view" onClick={() => { if (level < n - 1) go(level + 1); }} data-next={next ? '' : undefined}>
            <svg ref={svg} className="zm-svg" viewBox={viewBox(cams.current[0], 1470, 801)} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
              {map}
              {next && <rect className="zm-aim" x={next.rect[0] - pad} y={next.rect[1] - pad} width={next.rect[2] + 2 * pad} height={next.rect[3] + 2 * pad} rx={pad * 1.5} vectorEffect="non-scaling-stroke" />}
            </svg>
            <div className="zm-art">{art}</div>
          </div>
          <div className="zm-say">{say}</div>
        </div>
      </div>
    </section>
  );
}
