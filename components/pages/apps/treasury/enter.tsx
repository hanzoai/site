'use client';
/* Treasury's five section entrances (MOTION-MAP, in order): accordion, iris, scramble, side-carousel, pixel-resolve.
   Each is drawn differently in treasury/motion.css; this file only arms them. The server and JS-off render is the final
   state. After hydration a section still below the fold is armed (data-enter="wait") and plays (data-enter="go") when
   a quarter of it is on screen. Reduced motion never arms. A section already on screen at load is left as it is. */
import { useEffect, useRef, useState } from 'react';

export function useEnter<T extends HTMLElement = HTMLElement>(amount = 0.25) {
  const ref = useRef<T>(null);
  const [st, setSt] = useState<'wait' | 'go' | undefined>(undefined);
  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (el.getBoundingClientRect().top < innerHeight * 0.9) return;
    setSt('wait');
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSt('go'); io.disconnect(); } }, { threshold: amount });
    io.observe(el);
    return () => io.disconnect();
  }, [amount]);
  return [ref, st] as const;
}

/* scramble: the statement's characters arrive as noise and decode, left to right, in about a second. The real words
   are always in the accessible name; the noise is drawn into aria-hidden spans only while it plays. */
const NOISE = '#%&*+=/<>0123456789ABCDEFGHJKLMNPQRSTUVWXYZ';
interface ScrambleProps {
  lines: string[];
  className: string;
  go?: 'wait' | 'go';
}
export function Scramble({ lines, className, go }: ScrambleProps) {
  const text = lines.join(' ');
  const [out, setOut] = useState<string | null>(null);
  useEffect(() => {
    if (go !== 'wait' && go !== 'go') return;
    if (go === 'wait') { setOut(text.replace(/\S/g, '·')); return; }
    const t0 = performance.now(), dur = 1100;
    let raf = 0;
    const tick = (t: number) => {
      const k = Math.min(1, (t - t0) / dur);
      const n = Math.floor(k * text.length);
      setOut(k >= 1 ? null : text.slice(0, n) + text.slice(n).replace(/\S/g, () => NOISE[(Math.random() * NOISE.length) | 0]));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [go, text]);
  if (out === null) return <p className={className}>{lines.map((l, i) => <span key={i} className="tsc-l">{l} </span>)}</p>;
  // while it plays: the real sentence for assistive tech, the noise for the eye (same box, so nothing moves)
  return (
    <p className={className + ' tsc-on'} aria-label={text}>
      <span aria-hidden="true" className="tsc-ghost">{lines.map((l, i) => <span key={i} className="tsc-l">{l} </span>)}</span>
      <span aria-hidden="true" className="tsc-noise">{out}</span>
    </p>
  );
}

/* pixel-resolve: two grids of paper-coloured blocks cover the close; the coarse blocks drop out first, then the fine
   ones, so the section resolves from big pixels to sharp (opacity only, stepped). */
export function Pixels() {
  const coarse = Array.from({ length: 6 * 4 });
  const fine = Array.from({ length: 16 * 10 });
  const d = (i: number, n: number, k: number) => ((i * 7919) % n) / n * k; // a fixed scatter, the same on server and client
  return (
    <div className="tpx" aria-hidden="true">
      <div className="tpx-g c">{coarse.map((_, i) => <i key={i} style={{ animationDelay: d(i, 24, 420) + 'ms' }} />)}</div>
      <div className="tpx-g f">{fine.map((_, i) => <i key={i} style={{ animationDelay: 260 + d(i, 160, 520) + 'ms' }} />)}</div>
    </div>
  );
}
