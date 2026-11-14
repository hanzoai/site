'use client';
/* /ui motion, page-local (MOTION-MAP: signature `magnet-grid`; entrances accordion, page-curl, magnet-gather,
   cursor-trail, zoom-through). Each entrance is its own implementation; nothing here is a shared reveal.
   - useIn(ref): marks a section [data-in] once it is a fifth in view (at once under reduced motion). The CSS for each
     entrance lives in Motion.css and only applies under html.js, so JS off and the server HTML show the final state.
   - MagnetGrid: the signature. A field of the library's parts (class names, a pill, a field, a dot, a swatch) that bends
     toward the cursor and ripples outward from a click or tap. One rAF loop, running only while the grid is on screen
     and something is moving; a quiet ripple starts itself every few seconds so it is never dead. Reduced motion: still.
   - Curl: the page-curl entrance. The paper surface above the dark room curls away from its bottom-left corner.
   - Trail: the cursor-trail entrance. On fine pointers a cursor sweeps across the strip once, revealing it behind a
     short trail of dots; afterwards the trail follows the visitor's cursor over it. Touch: shown at rest, no trail. */
import type React from 'react';
import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import './Motion.css';

export function useIn(ref: React.RefObject<HTMLDivElement | null> | React.RefObject<null> | React.RefObject<HTMLElement | null>, amount = 0.2) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { setOn(true); return undefined; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect(); } }, { threshold: amount });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, amount]);
  return on;
}

// short names only, every one already on the page
const WORDS = ['.button', '.panel', '.field', '.table', 'Tab', 'role', 'focus', 'aria-*', '--radius', '@hanzo/ui'];
const COLS = 12, ROWS = 4;

export function MagnetGrid() {
  const box = useRef<HTMLDivElement>(null);
  const sec = useRef<HTMLElement>(null);
  const inView = useIn(sec, 0.25);
  useEffect(() => {
    const grid = box.current;
    if (!grid || matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const tiles = [...grid.querySelectorAll('.ux-t')];
    const st = tiles.map(() => ({ x: 0, y: 0, s: 1, cx: 0, cy: 0 }));
    const measure = () => {
      const g = grid.getBoundingClientRect();
      tiles.forEach((t, i) => { const r = t.getBoundingClientRect(); st[i].cx = r.left - g.left + r.width / 2 - st[i].x; st[i].cy = r.top - g.top + r.height / 2 - st[i].y; });
    };
    let ptr = null, last = 0, raf = 0, seen = false;
    const ripples = [];
    const fine = matchMedia('(pointer: fine)').matches;
    const tick = (now: number) => {
      raf = 0;
      let busy = false;
      for (let k = ripples.length - 1; k >= 0; k--) if (now - ripples[k].t > 1500) ripples.splice(k, 1);
      tiles.forEach((t, i) => {
        const s = st[i];
        let tx = 0, ty = 0, sc = 1;
        if (ptr) {
          const dx = ptr.x - s.cx, dy = ptr.y - s.cy, d = Math.hypot(dx, dy) || 1, R = 260;
          if (d < R) { const f = (1 - d / R) ** 2; tx = (dx / d) * f * 18; ty = (dy / d) * f * 18; sc += 0.16 * f; }
        }
        ripples.forEach((rp) => {
          const a = now - rp.t, d = Math.hypot(rp.x - s.cx, rp.y - s.cy), r = a * 0.75;
          const w = Math.exp(-(((d - r) / 46) ** 2)) * Math.max(0, 1 - a / 1500);
          sc += 0.24 * w; ty -= 12 * w;
        });
        s.x += (tx - s.x) * 0.18; s.y += (ty - s.y) * 0.18; s.s += (sc - s.s) * 0.2;
        if (Math.abs(tx - s.x) > 0.05 || Math.abs(ty - s.y) > 0.05 || Math.abs(sc - s.s) > 0.002) busy = true;
        t.style.transform = `translate3d(${s.x.toFixed(2)}px, ${s.y.toFixed(2)}px, 0) scale(${s.s.toFixed(3)})`;
      });
      if ((busy || ripples.length) && seen) raf = requestAnimationFrame(tick);
    };
    const wake = () => { if (!raf && seen) raf = requestAnimationFrame(tick); };
    const at = (e: PointerEvent) => { const g = grid.getBoundingClientRect(); return { x: e.clientX - g.left, y: e.clientY - g.top }; };
    const move = (e: PointerEvent) => { if (e.pointerType !== 'mouse') return; ptr = at(e); last = performance.now(); wake(); };
    const out = () => { ptr = null; wake(); };
    const down = (e: PointerEvent) => { const p = at(e); ripples.push({ ...p, t: performance.now() }); last = performance.now(); wake(); };
    const io = new IntersectionObserver(([e]) => { seen = e.isIntersecting; if (seen) { measure(); wake(); } }, { threshold: 0 });
    io.observe(grid);
    // never dead: with no pointer for a while, a quiet ripple starts from a tile on its own
    const auto = setInterval(() => {
      if (!seen || document.hidden || performance.now() - last < 3500) return;
      const s = st[Math.floor(Math.random() * st.length)];
      ripples.push({ x: s.cx, y: s.cy, t: performance.now() }); wake();
    }, 4200);
    measure();
    addEventListener('resize', measure);
    if (fine) { grid.addEventListener('pointermove', move); grid.addEventListener('pointerleave', out); }
    grid.addEventListener('pointerdown', down);
    return () => {
      cancelAnimationFrame(raf); clearInterval(auto); io.disconnect(); removeEventListener('resize', measure);
      grid.removeEventListener('pointermove', move); grid.removeEventListener('pointerleave', out); grid.removeEventListener('pointerdown', down);
    };
  }, []);
  let w = 0;
  return (
    <section className="ux-sig" ref={sec} data-in={inView ? '' : undefined} aria-label="@hanzo/ui">
      <div className="w2-wrap">
        <div className="ux-grid" ref={box} aria-hidden="true">
          {Array.from({ length: ROWS }).map((_, r) => (
            <div key={r} className="ux-row" style={{ '--r': r }}>
              {Array.from({ length: COLS }).map((__, c) => {
                const k = (r * 5 + c * 7) % 6;
                return (
                  <span key={c} className={'ux-t k' + k}>
                    {k === 0 ? <b className="x-mono">{WORDS[w++ % WORDS.length]}</b> : k === 1 ? <i /> : k === 2 ? <em /> : null}
                  </span>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* page-curl: wraps the dark room; the paper above peels off it from the bottom-left corner as it enters */
interface CurlProps {
  children: ReactNode;
}
export function Curl({ children }: CurlProps) {
  const ref = useRef<HTMLDivElement>(null);
  const on = useIn(ref, 0.2);
  return (
    <div className="ux-curlw" ref={ref} data-in={on ? '' : undefined}>
      {children}
      <i className="ux-curl-f" aria-hidden="true" />
      <i className="ux-curl" aria-hidden="true" />
    </div>
  );
}

/* cursor-trail: a strip revealed behind a sweeping cursor and its trail; then the trail follows the visitor's cursor */
interface TrailProps {
  children: ReactNode;
}
export function Trail({ children }: TrailProps) {
  const ref = useRef<HTMLDivElement>(null), inner = useRef<HTMLDivElement>(null), dots = useRef([]);
  const on = useIn(ref, 0.35);
  const [fine, setFine] = useState(false);
  useEffect(() => { setFine(matchMedia('(pointer: fine)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches); }, []);
  // the trail: N dots, each easing toward the one ahead of it
  useEffect(() => {
    if (!fine) return undefined;
    const el = ref.current;
    const P = dots.current.map(() => ({ x: -40, y: -40 }));
    let target = null, raf = 0, still = 0;
    const tick = () => {
      raf = 0;
      if (!target) return;
      let moving = false;
      P.forEach((p, i) => {
        const lead = i === 0 ? target : P[i - 1];
        const nx = p.x + (lead.x - p.x) * 0.38, ny = p.y + (lead.y - p.y) * 0.38;
        if (Math.abs(nx - p.x) + Math.abs(ny - p.y) > 0.2) moving = true;
        p.x = nx; p.y = ny;
        const d = dots.current[i];
        if (d) { d.style.transform = `translate3d(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px, 0) scale(${(1 - i / P.length).toFixed(2)})`; d.style.opacity = target.on ? String(0.55 - i * 0.045) : '0'; }
      });
      still = moving ? 0 : still + 1;
      if (still < 20) raf = requestAnimationFrame(tick);
    };
    const go = () => { if (!raf) raf = requestAnimationFrame(tick); };
    const move = (e: PointerEvent) => { const r = el.getBoundingClientRect(); target = { x: e.clientX - r.left, y: e.clientY - r.top, on: true }; still = 0; go(); };
    const out = () => { if (target) target.on = false; go(); };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', out);
    el.__trail = (x, y, show) => { target = { x, y, on: show }; still = 0; go(); };
    return () => { cancelAnimationFrame(raf); el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', out); };
  }, [fine]);
  // the entrance: a cursor sweeps once across the strip, uncovering it as it goes
  useEffect(() => {
    if (!on || !fine) return undefined;
    const el = ref.current, inn = inner.current;
    const r = el.getBoundingClientRect();
    const t0 = performance.now(), D = 1100;
    let raf = 0;
    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / D), e = 1 - (1 - p) ** 3;
      const x = e * (r.width + 40) - 20, y = r.height * (0.55 - 0.25 * Math.sin(e * Math.PI));
      inn.style.clipPath = p < 1 ? `inset(0 ${(100 - e * 100).toFixed(2)}% 0 0)` : 'none';
      el.__trail?.(x, y, p < 1);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [on, fine]);
  return (
    <div className="ux-trail" ref={ref} data-in={on ? '' : undefined} data-fine={fine ? '' : undefined}>
      <div className="ux-trail-in" ref={inner}>{children}</div>
      {fine && <span className="ux-dots" aria-hidden="true">{Array.from({ length: 10 }).map((_, i) => <i key={i} ref={(n) => { dots.current[i] = n; }} />)}</span>}
    </div>
  );
}

/* magnet-gather and zoom-through are CSS on [data-in]; this marks a block when it arrives */
interface InProps {
  as?: string;
  className?: string;
  amount?: number;
  children: ReactNode;
  [key: string]: unknown;
}
export function In({ as: T = 'div', className = '', amount = 0.2, children, ...rest }: InProps) {
  const ref = useRef(null);
  const on = useIn(ref, amount);
  return <T ref={ref} className={className} data-in={on ? '' : undefined} {...rest}>{children}</T>;
}
