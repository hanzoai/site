'use client';
/* /s3's five section entrances (docs/MOTION-MAP.md): text-mask-film ("An object, kept"), iris (the peel's stage),
   shutter (the black room's figures), cursor-lens (the agent prompt), grid-wave (the close's drawing). Page-local,
   each played once. The server HTML is every section's final state, so JS off or reduced motion shows it whole; a
   start state is armed only after mount and only while its element is still below the fold; each observer watches an
   unclipped box, so every arrival fires. Only transform, clip-path, opacity and a text fill move: no box changes size. */
import { useEffect, useRef, useState } from 'react';

const calmNow = () => typeof window !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

export function useArrive(margin = '0px 0px -18% 0px', ms = 0) {
  const ref = useRef(null);
  const [st, setSt] = useState('idle'); // idle (final, untouched) -> armed -> play -> idle again after ms (if given)
  useEffect(() => {
    const el = ref.current;
    if (!el || calmNow()) return;
    if (el.getBoundingClientRect().top < innerHeight * 0.82) return;
    setSt('armed');
    let t = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      setSt('play'); io.disconnect();
      if (ms) t = setTimeout(() => setSt('idle'), ms);
    }, { rootMargin: margin });
    io.observe(el);
    return () => { io.disconnect(); clearTimeout(t); };
  }, [margin, ms]);
  return [ref, st];
}

/* shutter: two graphite bars meet over the figures, then part to the top and bottom edges and open on them */
export function Shutter({ children }) {
  const [ref, st] = useArrive('0px 0px -20% 0px');
  return (
    <div ref={ref} className="s3-shut" data-shut={st}>
      {children}
      {st !== 'idle' && <><i className="s3-shut-b t" aria-hidden="true" /><i className="s3-shut-b b" aria-hidden="true" /></>}
    </div>
  );
}

/* cursor-lens: on arrival a round lens sweeps once across the prompt, magnifying it; then it follows a fine pointer
   (on touch, a tap places it for a moment). The lens holds an inert copy, scaled about the lens centre. */
export function CursorLens({ children }) {
  const [ref, st] = useArrive('0px 0px -25% 0px');
  const box = useRef(null);
  const glass = useRef(null);
  const [wd, setWd] = useState(0);
  useEffect(() => {
    const b = box.current; if (!b) return;
    const ro = new ResizeObserver(() => setWd(b.offsetWidth));
    ro.observe(b);
    return () => ro.disconnect();
  }, []);
  const place = (x, y, on) => {
    const g = glass.current; if (!g) return;
    g.style.setProperty('--x', x + 'px'); g.style.setProperty('--y', y + 'px'); g.dataset.on = on ? '1' : '0';
  };
  useEffect(() => {
    if (st !== 'play' || !box.current) return;
    const b = box.current, W = b.offsetWidth, H = b.offsetHeight;
    let raf = 0;
    const t0 = performance.now();
    const run = (now) => {
      const p = Math.min(1, (now - t0) / 1800);
      const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      place(W * (0.1 + 0.8 * e), H * (0.62 - 0.18 * Math.sin(e * Math.PI)), p < 1);
      if (p < 1) raf = requestAnimationFrame(run);
    };
    raf = requestAnimationFrame(run);
    return () => cancelAnimationFrame(raf);
  }, [st]);
  const onMove = (e) => {
    if (e.pointerType !== 'mouse' || calmNow()) return;
    const r = box.current.getBoundingClientRect();
    place(e.clientX - r.left, e.clientY - r.top, true);
  };
  const tapT = useRef(0);
  const onDown = (e) => {
    if (e.pointerType === 'mouse' || calmNow()) return;
    const r = box.current.getBoundingClientRect();
    place(e.clientX - r.left, e.clientY - r.top, true);
    clearTimeout(tapT.current);
    tapT.current = setTimeout(() => place(e.clientX - r.left, e.clientY - r.top, false), 1600);
  };
  return (
    <div ref={ref} className="s3-lensroom" data-lens={st}>
      <div ref={box} className="s3-lens-box" onPointerMove={onMove} onPointerLeave={() => place(0, 0, false)} onPointerDown={onDown}>
        {children}
        <div ref={glass} className="s3-lens" data-on="0" aria-hidden="true">
          <div className="s3-lens-copy" inert style={{ width: wd || undefined }}>{children}</div>
        </div>
      </div>
    </div>
  );
}

/* grid-wave: the close's drawing arrives under a grid of tiles that ripple away by distance from the cursor (or, with
   no pointer yet, from the drawing's centre). The grid is a veil laid over the art, drawn only while it plays. */
const last = { x: null, y: null };
if (typeof window !== 'undefined') addEventListener('pointermove', (e) => { last.x = e.clientX; last.y = e.clientY; }, { passive: true });
export function GridWave({ children, art = '.lx-close-art', cols = 9 }) {
  const [ref, st] = useArrive('0px 0px -25% 0px');
  const [veil, setVeil] = useState(null);
  const [gone, setGone] = useState(false);
  useEffect(() => {
    if (st === 'idle') return;
    const root = ref.current, a = root && root.querySelector(art);
    if (!a) return;
    const r = a.getBoundingClientRect(), q = root.getBoundingClientRect();
    const rows = Math.max(1, Math.round(cols * (r.height / r.width)));
    // where the wave starts, in tiles: the pointer if it is over the page, else the centre
    const px = last.x == null ? 0.5 : Math.min(1, Math.max(0, (last.x - r.left) / r.width));
    const py = last.y == null ? 0.5 : Math.min(1, Math.max(0, (last.y - r.top) / r.height));
    setVeil({ box: { left: r.left - q.left, top: r.top - q.top, width: r.width, height: r.height }, rows, ox: px * cols, oy: py * rows });
    if (st !== 'play') return;
    const t = setTimeout(() => setGone(true), 1500);
    return () => clearTimeout(t);
  }, [st, ref, art, cols]);
  return (
    <div ref={ref} className="s3-wave" data-wave={st}>
      {children}
      {veil && !gone && st !== 'idle' && (
        <span className="s3-wave-v" aria-hidden="true" style={{ ...veil.box, gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${veil.rows}, 1fr)` }}>
          {Array.from({ length: cols * veil.rows }, (_, k) => {
            const i = k % cols, j = (k / cols) | 0;
            const d = Math.hypot(i + 0.5 - veil.ox, j + 0.5 - veil.oy);
            return <i key={k} style={{ '--t': Math.round(d * 70) + 'ms' }} />;
          })}
        </span>
      )}
    </div>
  );
}
