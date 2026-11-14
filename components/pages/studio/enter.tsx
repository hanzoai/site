'use client';
/* /studio's five entrances, page-local (docs/MOTION-MAP.md rule 7), one per main section, in the map's order:
   opposite-drift (the film strip), spiral-in (the capability graph), slot-roll (What is Hanzo Studio),
   snap-sections (the director's chair), noise-dissolve (the agent paste strip).
   Every one reads reduced motion only after mount, so the server HTML and the first client render are the same
   (resting, legible state); the entrance arms itself once mounted and never under reduced motion. */
import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, ElementType, ReactNode, RefObject } from 'react';
import { useScroll, useTransform } from 'motion/react';
import { scrollToY } from '../../../lib/scroll';

const RM = '(prefers-reduced-motion: reduce)';

/* [armed, calm]: armed once mounted and motion is allowed */
export function useArmed() {
  const [s, set] = useState<[boolean, boolean]>([false, false]);
  useEffect(() => {
    const mq = matchMedia(RM);
    const up = () => set([!mq.matches, mq.matches]);
    up();
    mq.addEventListener('change', up);
    return () => mq.removeEventListener('change', up);
  }, []);
  return s;
}

/* one-shot "it is on screen" flag */
export function useSeen(ref: RefObject<HTMLElement | null>, amount = 0.25) {
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { setSeen(true); io.disconnect(); } }, { threshold: amount });
    io.observe(el);
    return () => io.disconnect();
  }, [seen]); // eslint-disable-line react-hooks/exhaustive-deps
  return seen;
}

/* 1. opposite-drift: the left half and the right half ride in from opposite sides as the section scrolls up, and meet
   where they rest once its top is 30% down the screen. Returns motion styles (undefined until armed). */
export function useDrift(ref: RefObject<HTMLElement | null>, armed: boolean) {
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start end', 'start 0.3'] });
  const l = useTransform(p, [0, 1], ['-18vw', '0vw']);
  const r = useTransform(p, [0, 1], ['18vw', '0vw']);
  const rail = useTransform(p, [0, 1], ['30vw', '0vw']);
  const o = useTransform(p, [0, 0.7], [0.2, 1]);
  return armed ? [{ x: l, opacity: o }, { x: r, opacity: o }, { x: rail }] : [undefined, undefined, undefined];
}

/* 3. slot-roll: each word is a reel in its own window; the reels spin down past it and stop one after another, left
   to right, with the small kick of a slot machine landing (CSS keyframes, .xst-slot.go) */
interface SlotProps {
  as?: ElementType;
  id?: string;
  className?: string;
  lines: string[];
}

export function Slot({ as: Tag = 'h2', id, className = '', lines }: SlotProps) {
  const ref = useRef<HTMLElement>(null);
  const [armed] = useArmed();
  const seen = useSeen(ref, 0.4);
  let n = 0;
  return (
    <Tag id={id} ref={ref} className={className + ' xst-slot' + (armed ? ' arm' : '') + (seen ? ' go' : '')}>
      {lines.map((l, i) => (
        <span className="a2-ln" key={i}>
          {l.split(' ').map((w, j, all) => (
            <span key={j}>
              <span className="xst-slot-m"><span className="xst-slot-w" style={{ '--i': n++ } as CSSProperties}>{w}</span></span>
              {j < all.length - 1 ? ' ' : null}
            </span>
          ))}
          {i < lines.length - 1 ? ' ' : null}
        </span>
      ))}
    </Tag>
  );
}

/* 4. snap-sections: when a scroll comes to rest with this section's top in the upper part of the screen (and not
   already flush), the page glides the last stretch so the section fills the screen under the header. Once per
   approach; never under reduced motion; works for wheel, trackpad, keys and touch (it waits for the scroll to rest). */
export function useSnap(ref: RefObject<HTMLElement | null>, armed: boolean, head = 60) {
  useEffect(() => {
    if (!armed) return;
    let idle: ReturnType<typeof setTimeout> | undefined, gliding = false, done = false, last = scrollY;
    const check = () => {
      const el = ref.current;
      if (!el || gliding) return;
      const top = el.getBoundingClientRect().top - head, vh = innerHeight;
      if (top > vh * 0.6 || el.getBoundingClientRect().bottom < 0) { done = false; return; } // left: re-arm
      if (done || Math.abs(top) < 4) return;
      if (top < vh * 0.38 && top > -vh * 0.16) {
        done = true; gliding = true;
        scrollToY(scrollY + top, { duration: 0.6 });
        setTimeout(() => { gliding = false; }, 800);
      }
    };
    const on = () => {
      const down = scrollY >= last; last = scrollY;
      clearTimeout(idle);
      if (down || gliding) idle = setTimeout(check, 160);
    };
    addEventListener('scroll', on, { passive: true });
    return () => { removeEventListener('scroll', on); clearTimeout(idle); };
  }, [armed]); // eslint-disable-line react-hooks/exhaustive-deps
}

/* 5. noise-dissolve: a canvas of grain sits over the block in the page's own white and greys, then dissolves cell by
   cell (each cell has its own threshold) until the block is left behind. DPR-capped, one short rAF run. */
interface DissolveProps {
  children?: ReactNode;
  className?: string;
}

export function Dissolve({ children, className = '' }: DissolveProps) {
  const ref = useRef<HTMLDivElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);
  const [armed] = useArmed();
  const seen = useSeen(ref, 0.35);
  const [gone, setGone] = useState(false);
  useEffect(() => {
    const c = cv.current;
    if (!armed || !c || gone) return;
    const CELL = 4;
    const w = Math.max(1, Math.ceil(c.offsetWidth / CELL)), h = Math.max(1, Math.ceil(c.offsetHeight / CELL));
    c.width = w; c.height = h; // a coarse grid scaled up (pixelated): cheap at any DPR
    const g = c.getContext('2d');
    if (!g) return;
    const img = g.createImageData(w, h);
    const TONES = [[255, 255, 255], [255, 255, 255], [250, 250, 250], [245, 245, 245], [228, 228, 231], [212, 212, 212]]; // white, #fafafa, #f5f5f5, #e4e4e7, #d4d4d4
    const th = new Float32Array(w * h), tone = new Uint8Array(w * h);
    for (let i = 0; i < th.length; i++) { th[i] = Math.random(); tone[i] = (Math.random() * TONES.length) | 0; }
    const draw = (q: number) => {
      const d = img.data;
      for (let i = 0; i < th.length; i++) {
        const k = i * 4, t = TONES[tone[i]];
        d[k] = t[0]; d[k + 1] = t[1]; d[k + 2] = t[2]; d[k + 3] = th[i] > q ? 255 : 0;
      }
      g.putImageData(img, 0, 0);
    };
    draw(0);
    if (!seen) return;
    let raf = 0, t0 = 0;
    const loop = (now: number) => {
      if (!t0) t0 = now;
      const q = Math.min(1, (now - t0) / 900);
      draw(1 - Math.pow(1 - q, 2)); // ease-out: most grain clears early, the last specks linger
      if (q < 1) raf = requestAnimationFrame(loop); else setGone(true);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [armed, seen, gone]);
  return (
    <div ref={ref} className={'xst-dis ' + className}>
      {children}
      {armed && !gone && <canvas ref={cv} className="xst-dis-c" aria-hidden="true" />}
    </div>
  );
}
