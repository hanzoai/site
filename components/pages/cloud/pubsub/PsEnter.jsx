'use client';
/* /pubsub's five section entrances (docs/MOTION-MAP.md, in order): line-draw (hero), cursor-trail (events.go),
   spring-snap (the six facts), cover-slide (the quiet room), pixel-resolve (the close's art). Page-local, each played
   once. Every one leaves its final state in the server HTML: with JS off or reduced motion the section is whole, and
   none changes a box's size (transform, clip-path and opacity only), so nothing shifts. A start state is armed only
   after mount and only for a section still below the fold; each observer watches the section itself, never a clipped
   child, so every arrival fires. */
import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useCalm } from '../../../ui'; // read after hydration, so the server frame and the first client frame match

const calmNow = () => typeof window !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

/* arms an entrance after mount when its element is still below the fold, then plays it on arrival */
function useArrive(margin = '0px 0px -18% 0px') {
  const ref = useRef(null);
  const [st, setSt] = useState('idle'); // idle (final, untouched) -> armed -> play
  useEffect(() => {
    const el = ref.current;
    if (!el || calmNow()) return;
    if (el.getBoundingClientRect().top < innerHeight * 0.82) return;
    setSt('armed');
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSt('play'); io.disconnect(); } }, { rootMargin: margin });
    io.observe(el);
    return () => io.disconnect();
  }, [margin]);
  return [ref, st];
}

/* 1. line-draw: an outline that draws itself round its card on first paint, then the card fills (CSS only, so it
   plays from the server HTML with no hydration step; reduced motion skips it). Put inside a positioned card. */
export function Outline({ d = 0 }) {
  return (
    <svg className="ps-ol" aria-hidden="true" style={{ '--d': d + 's' }}>
      <rect pathLength="1" />
    </svg>
  );
}

/* 2. cursor-trail: on arrival a cursor crosses the section left to right, a short trail of dots behind it, and the
   section is uncovered up to the cursor; afterwards a fine pointer moving over it leaves the same short trail */
export function CursorTrail({ children, className = '', ...rest }) {
  const [ref, st] = useArrive('0px 0px -22% 0px');
  const dots = useRef([]);
  const pts = useRef([]);
  const raf = useRef(0);
  const [done, setDone] = useState(false);
  const draw = () => {
    const P = pts.current;
    dots.current.forEach((el, i) => {
      if (!el) return;
      const p = P[P.length - 1 - i * 2];
      if (!p) { el.style.opacity = '0'; return; }
      el.style.transform = `translate(${p[0]}px, ${p[1]}px) scale(${1 - i * 0.08})`;
      el.style.opacity = String((1 - i / dots.current.length) * 0.9);
    });
  };
  const fade = () => {
    cancelAnimationFrame(raf.current);
    const step = () => { pts.current.shift(); draw(); if (pts.current.length) raf.current = requestAnimationFrame(step); };
    raf.current = requestAnimationFrame(step);
  };
  useEffect(() => {
    if (st !== 'play') return;
    const el = ref.current; if (!el) return;
    const W = el.offsetWidth, H = el.offsetHeight;
    const t0 = performance.now();
    const run = (now) => {
      const p = Math.min(1, (now - t0) / 1100);
      const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      const x = W * e, y = H * (0.55 - 0.18 * Math.sin(e * Math.PI));
      el.style.setProperty('--tx', (e * 100).toFixed(2) + '%');
      pts.current.push([x, y]); if (pts.current.length > 20) pts.current.shift();
      draw();
      if (p < 1) raf.current = requestAnimationFrame(run); else { setDone(true); fade(); }
    };
    raf.current = requestAnimationFrame(run);
    return () => cancelAnimationFrame(raf.current);
  }, [st, ref]); // eslint-disable-line react-hooks/exhaustive-deps
  const move = (e) => {
    if (e.pointerType !== 'mouse' || calmNow() || (st === 'play' && !done)) return;
    const r = ref.current.getBoundingClientRect();
    pts.current.push([e.clientX - r.left, e.clientY - r.top]); if (pts.current.length > 20) pts.current.shift();
    draw();
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => setTimeout(fade, 60));
  };
  return (
    <section ref={ref} className={'ps-trail ' + className} data-trail={done ? 'idle' : st} onPointerMove={move} {...rest}>
      {children}
      <span className="ps-trail-dots" aria-hidden="true">{Array.from({ length: 8 }, (_, i) => <i key={i} ref={(el) => { dots.current[i] = el; }} />)}</span>
    </section>
  );
}

/* 3. spring-snap: each fact snaps in from the right as it arrives and overshoots a little before it settles (a tween
   with an overshooting curve, not a spring: the page stays tweens-only); the held drawing snaps in from the left */
export function useSnap(list) {
  useEffect(() => {
    const root = list.current;
    if (!root || calmNow()) return;
    const items = [...root.querySelectorAll('[data-snap]')].filter((el) => el.getBoundingClientRect().top > innerHeight * 0.9);
    items.forEach((el) => { el.dataset.snap = 'armed'; });
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { e.target.dataset.snap = 'play'; io.unobserve(e.target); }
    }), { rootMargin: '0px 0px -12% 0px' });
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [list]);
}

/* 4. cover-slide: the quiet room rides up over the end of the facts as it comes in (scroll-linked; it overlaps only
   the facts' empty bottom padding, and with reduced motion it simply sits there) */
export function CoverSlide({ children, className = '', ...rest }) {
  const ref = useRef(null);
  const calm = useCalm();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start 45%'] });
  const y = useTransform(scrollYProgress, [0, 1], [112, 0], { clamp: true });
  return (
    <motion.section ref={ref} className={'ps-cover ' + className} style={calm ? undefined : { y }} {...rest}>{children}</motion.section>
  );
}

/* 5. pixel-resolve: the close's drawing arrives as coarse grey pixels that break into finer ones and clear to the
   sharp line art. The pixels are a veil laid over the art (measured, not inside the shared close), drawn only while
   it plays */
const lum = (i, j, s) => { const x = Math.sin(i * 12.9898 + j * 78.233 + s) * 43758.5453; return x - Math.floor(x); };
const GREYS = ['#f5f5f5', '#ededed', '#e5e5e5', '#d4d4d4', '#a3a3a3'];
export function PixelResolve({ children, art = '.lx-close-art' }) {
  const [ref, st] = useArrive('0px 0px -25% 0px');
  const [box, setBox] = useState(null);
  const [gone, setGone] = useState(false);
  useEffect(() => {
    if (st === 'idle') return;
    const root = ref.current, a = root && root.querySelector(art);
    if (!a) return;
    const r = a.getBoundingClientRect(), q = root.getBoundingClientRect();
    setBox({ left: r.left - q.left, top: r.top - q.top, width: r.width, height: r.height });
    if (st !== 'play') return;
    const t = setTimeout(() => setGone(true), 1500);
    return () => clearTimeout(t);
  }, [st, ref, art]);
  const layer = (n, s, d0) => {
    const rows = Math.round(n * (box.height / box.width)) || n;
    return (
      <span className="ps-px-l" style={{ gridTemplateColumns: `repeat(${n}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)` }}>
        {Array.from({ length: n * rows }, (_, k) => {
          const i = k % n, j = (k / n) | 0, v = lum(i, j, s);
          return <i key={k} style={{ background: GREYS[(v * GREYS.length) | 0], '--t': (d0 + lum(j, i, s + 3) * 0.5).toFixed(2) + 's' }} />;
        })}
      </span>
    );
  };
  return (
    <div ref={ref} className="ps-px" data-px={st}>
      {children}
      {box && !gone && st !== 'idle' && (
        <span className="ps-px-veil" aria-hidden="true" style={box}>
          {layer(14, 7, 0.45)}
          {layer(6, 1, 0)}
        </span>
      )}
    </div>
  );
}
