'use client';
/* Auto's five section entrances (MOTION-MAP rule 7), page-local. Each section enters once, its own way:
   hero word-shuffle (CSS keyframes, see Shuffle), canvas rack-focus, connectors scroll-tilt, index iris, band stack-drop.
   The server HTML is always the final state. After mount (and never under reduced motion) a section is marked
   data-ent="arm" (its start state, set by Auto.css); when a fifth of it is on screen it becomes data-ent="in" and plays.
   Entrances move by transform, filter, clip-path and opacity only, and end in the section's normal state. */
import { useEffect, useRef } from 'react';

const calmNow = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

/* scroll-tilt: the section starts tilted back on rotateX; each frame it levels out over ~900 ms (or as it scrolls fully in,
   whichever is sooner), while scroll speed adds a lean in the direction of travel; it settles at 0 and stops. */
function tilt(el) {
  let raf = 0;
  let last = scrollY;
  let cur = 14;
  const t0 = performance.now();
  const step = (t) => {
    const r = el.getBoundingClientRect();
    const byScroll = Math.min(1, Math.max(0, (innerHeight - r.top) / (innerHeight * 0.75)));
    const byTime = Math.min(1, (t - t0) / 900);
    const done = Math.max(byScroll, byTime);
    const v = scrollY - last;
    last = scrollY;
    const target = 14 * (1 - done) + Math.max(-6, Math.min(6, v * 0.35)) * (1 - done);
    cur += (target - cur) * 0.18;
    el.style.setProperty('--tilt', cur.toFixed(2) + 'deg');
    if (done >= 1 && Math.abs(cur) < 0.15) { el.style.removeProperty('--tilt'); return; }
    raf = requestAnimationFrame(step);
  };
  raf = requestAnimationFrame(step);
  return () => cancelAnimationFrame(raf);
}

export function Enter({ as: Tag = 'div', kind, className = '', threshold = 0.2, children, ...rest }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || calmNow()) return;
    el.dataset.ent = 'arm';
    if (kind === 'tilt') el.style.setProperty('--tilt', '14deg');
    let stop = () => {};
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      el.dataset.ent = 'in';
      if (kind === 'tilt') stop = tilt(el);
    }, { threshold });
    io.observe(el);
    return () => { io.disconnect(); stop(); };
  }, [kind, threshold]);
  return <Tag ref={ref} className={'au2-e-' + kind + ' ' + className} {...rest}>{children}</Tag>;
}

/* word-shuffle: each word arrives from a neighbour's slot, out of order, and swaps into place. Pure CSS keyframes under
   .js (so there is no flash and nothing to hydrate); the offsets and the order are fixed per word. */
const OFF = [[1.1, -0.35], [-1.2, 0.3], [0.7, 0.4], [-0.6, -0.4], [1.3, 0.2], [-0.9, -0.3], [0.5, 0.35]];
const ORDER = [3, 0, 5, 1, 6, 2, 4];
export function Shuffle({ text, start = 0 }) {
  const words = text.split(' ');
  return words.flatMap((w, i) => {
    const n = start + i;
    const [dx, dy] = OFF[n % OFF.length];
    const span = <span key={i} className="au2-ws" style={{ '--dx': dx + 'em', '--dy': dy + 'em', '--d': ORDER[n % ORDER.length] * 55 + 'ms' }}>{w}</span>;
    return i ? [' ', span] : [span];
  });
}
