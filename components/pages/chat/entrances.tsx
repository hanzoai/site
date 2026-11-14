'use client';
/* /chat's own entrances (docs/MOTION-MAP.md, row /chat), page-local. In page order:
     1. glitch-in        the hero headline: a short monochrome glitch from the first paint, then it holds (CSS only)
     2. tilt-3d-hover    the card stack: arrives tilted back in 3D and swings level toward the pointer (CardStack.jsx)
     3. line-draw        the Band: its outline draws itself on the white page, then it fills black and the words arrive
     4. underline-sweep  the statement: underlines sweep under its key words, one after another
     5. scramble         who answers: the heading and the model names decode out of scrambled characters
   Each plays once when its section is about 30% on screen ([data-in] set here). Every pre-entrance state lives in
   chat-motion.css under `html.js` and prefers-reduced-motion: no-preference, so JS-off and reduced-motion visitors
   get the final state from the server HTML. Nothing here changes layout: transforms, opacity, clip-path and strokes. */
import type { ReactNode } from 'react';
import { Fragment, useEffect, useRef } from 'react';

const calm = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Mark the element [data-in] once it is `amount` on screen, then run `onIn` (once). */
export function useEnter<T extends HTMLElement = HTMLElement>(amount = 0.3, onIn?: (el: T) => void) {
  const ref = useRef<T>(null);
  const cb = useRef(onIn);
  cb.current = onIn;
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    el.setAttribute('data-armed', '');
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      el.setAttribute('data-in', '');
      cb.current?.(el);
    }, { threshold: amount });
    io.observe(el);
    return () => io.disconnect();
  }, [amount]);
  return ref;
}

/* scramble: each word keeps its real text as the sizer (so nothing reflows) and decodes in an overlay above it */
interface ScrProps {
  text: string;
}
export function Scr({ text }: ScrProps) {
  return text.split(' ').map((w, i) => (
    <Fragment key={i}>
      {i ? ' ' : ''}
      <span className="cht-scr-w"><span className="cht-scr-s">{w}</span><span className="cht-scr-o" aria-hidden="true" /></span>
    </Fragment>
  ));
}

const POOL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#%&*+=';
export function scrambleIn(root: HTMLElement) {
  const words = [...root.querySelectorAll<HTMLElement>('.cht-scr-w')];
  if (!words.length) return;
  if (calm()) { root.setAttribute('data-done', ''); return; }
  const jobs = words.map((w, k) => ({ w, o: w.querySelector('.cht-scr-o')!, s: w.querySelector('.cht-scr-s')!.textContent!, at: k * 55 })); // Scr draws all three inside each word
  jobs.forEach((j) => j.w.setAttribute('data-run', ''));
  const t0 = performance.now();
  const DUR = 720;
  let last = 0;
  const tick = (now: number) => {
    const t = now - t0;
    let live = false;
    if (now - last > 40) { // about 25 changes a second, so it reads as characters turning over, not noise
      last = now;
      for (const j of jobs) {
        const p = (t - j.at) / DUR;
        if (p >= 1) { if (j.w.hasAttribute('data-run')) { j.w.removeAttribute('data-run'); j.o.textContent = ''; } continue; }
        live = true;
        const fixed = Math.max(0, Math.floor(p * j.s.length));
        let out = '';
        for (let c = 0; c < j.s.length; c++) {
          const ch = j.s[c];
          out += c < fixed || /[\s.,·]/.test(ch) ? ch : POOL[(Math.random() * POOL.length) | 0];
        }
        j.o.textContent = out;
      }
    } else live = true;
    if (live) requestAnimationFrame(tick);
    else root.setAttribute('data-done', '');
  };
  requestAnimationFrame(tick);
}

/* underline-sweep: a key word whose underline sweeps in; `n` is its place in the sequence */
interface MarkProps {
  n: number;
  children?: ReactNode;
}
export const Mark = ({ n, children }: MarkProps) => <span className="cht-ul" style={{ '--k': n }}>{children}</span>;

/* line-draw: the outline the Band draws before it fills (a hairline rect, pathLength 1 so the dash is 0..1) */
export const Outline = () => (
  <svg className="cht-draw" aria-hidden="true" focusable="false">
    <rect x="1" y="1" width="100%" height="100%" pathLength="1" />
  </svg>
);
