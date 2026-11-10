'use client';
/* KMS section entrances (MOTION-MAP rule 7), in page order: magnet-gather (hero), blinds (the vault of rules),
   pendulum (Sealed on your machine), grid-wave (Nothing lands on disk), stretch-scroll (Paste and ship).
   Each plays once when its section arrives. The hidden start states live in Kms.css under `.js`, so with JS off
   every section is already in its final state; under reduced motion the start states are dropped too.
   Transform, opacity and clip only: nothing here changes a box's size, so nothing shifts. */
import { useEffect, useRef, useState } from 'react';

/* once: true the first time the element is `amount` visible */
export function useArrive(amount = 0.2) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setOn(true); io.disconnect(); }
    }, { threshold: amount });
    io.observe(el);
    return () => io.disconnect();
  }, [amount]);
  return [ref, on];
}

/* magnet-gather: each hero piece starts scattered (its own offset and turn) and is pulled into place on load.
   Pure CSS (.km-mg in Kms.css), so it runs at first paint without waiting for React. */
const SCATTER = [[-120, 70, -7], [140, 90, 6], [-180, -40, -9], [210, -70, 8], [60, 140, 5], [-80, 160, -4]];
export function gather(i, delay = 0) {
  const [x, y, r] = SCATTER[i % SCATTER.length];
  return { '--gx': x + 'px', '--gy': y + 'px', '--gr': r + 'deg', '--gd': (delay + i * 0.07).toFixed(2) + 's' };
}

/* blinds: paper-coloured slats over the dark room turn open one after another */
export function Blinds({ on, n = 10 }) {
  return (
    <span className={'km-blinds' + (on ? ' on' : '')} aria-hidden="true">
      {Array.from({ length: n }, (_, i) => <i key={i} style={{ '--i': i, '--n': n }} />)}
    </span>
  );
}

/* pendulum: the object swings in from a pivot above it and settles */
export function Pendulum({ children, className = '' }) {
  const [ref, on] = useArrive(0.35);
  return <div ref={ref} className={'km-pend ' + className + (on ? ' on' : '')}>{children}</div>;
}

/* grid-wave: a grid of tiles in the room's own black lifts away in rings from the cursor
   (from where the pointer last was; from the centre on touch) */
let last = null;
if (typeof window !== 'undefined') window.addEventListener('pointermove', (e) => { if (e.pointerType === 'mouse') last = [e.clientX, e.clientY]; }, { passive: true });
const COLS = 12, ROWS = 8;
export function GridWave({ on }) {
  const ref = useRef(null);
  const [go, setGo] = useState(false);
  useEffect(() => {
    if (!on || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    let ox = r.width / 2, oy = Math.min(r.height, window.innerHeight) / 2;
    if (last) {
      ox = Math.max(0, Math.min(r.width, last[0] - r.left));
      oy = Math.max(0, Math.min(r.height, last[1] - r.top));
    }
    const tiles = ref.current.children;
    const tw = r.width / COLS, th = r.height / ROWS;
    const far = Math.hypot(Math.max(ox, r.width - ox), Math.max(oy, r.height - oy)) || 1;
    for (let i = 0; i < tiles.length; i++) {
      const cx = (i % COLS + 0.5) * tw, cy = (Math.floor(i / COLS) + 0.5) * th;
      tiles[i].style.setProperty('--td', ((Math.hypot(cx - ox, cy - oy) / far) * 0.75).toFixed(3) + 's');
    }
    const id = requestAnimationFrame(() => setGo(true));
    return () => cancelAnimationFrame(id);
  }, [on]);
  return (
    <span ref={ref} className={'km-gw' + (go ? ' on' : '')} aria-hidden="true">
      {Array.from({ length: COLS * ROWS }, (_, i) => <i key={i} />)}
    </span>
  );
}

/* stretch-scroll: arrives stretched tall by however fast the page is scrolling, then relaxes to its size */
let vel = 0, lastY = 0, lastT = 0;
if (typeof window !== 'undefined') window.addEventListener('scroll', () => {
  const t = performance.now(), y = window.scrollY;
  if (lastT) vel = Math.abs(y - lastY) / Math.max(1, t - lastT) * 1000;
  lastY = y; lastT = t;
}, { passive: true });
export function Stretch({ children, className = '' }) {
  const ref = useRef(null);
  const [k, setK] = useState(0); // 0 = not arrived; the stretch is read from the scroll speed at the moment it arrives
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setK(1 + Math.min(0.24, Math.max(0.08, vel / 9000))); io.disconnect(); }
    }, { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} className={'km-stretch ' + className + (k ? ' on' : '')} style={k ? { '--k': k.toFixed(3) } : undefined}>{children}</div>;
}
