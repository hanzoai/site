'use client';
/* /customers (index) motion kit, page-local (MOTION-MAP, 7 Nov):
   - useEnterAll(root, selector): every matching element gets data-in the first time it scrolls into view (once). The
     entrance states live in enter.css under `html.js` and `prefers-reduced-motion: no-preference`, so JS off and reduced
     motion show the final state from the server HTML.
   - WordLight: the signature `word-light`. A long statement (Hanzo's own lede, word for word) lights word by word as it
     is read: the words fill from quiet grey to ink with the scroll, and settle lit.
   - Lens: the hero's `cursor-lens`. A round lens follows a fine pointer over the headline and magnifies it (1.4x). */
import { useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { useMotionValueEvent, useScroll } from 'motion/react';
import './enter.css';

export function useEnterAll(root: RefObject<HTMLElement | null>, selector: string, deps: unknown[] = []) {
  useEffect(() => {
    const host = root.current;
    if (!host) return;
    const els = [...host.querySelectorAll(selector)].filter((e) => !e.hasAttribute('data-in'));
    if (!els.length) return;
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { e.target.setAttribute('data-in', ''); io.unobserve(e.target); }
    }), { rootMargin: '0px 0px -12% 0px', threshold: 0.01 });
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps
}

export function WordLight({ text, className = '', id }: { text: string; className?: string; id?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const words = text.split(' ');
  const [lit, setLit] = useState(0);
  // lit from when the statement's top reaches 88% of the screen until its end passes 45%
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 88%', 'end 45%'] });
  const set = (v: number) => setLit(Math.round(Math.max(0, Math.min(1, v)) * words.length));
  useMotionValueEvent(scrollYProgress, 'change', set);
  useEffect(() => { set(scrollYProgress.get()); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <p ref={ref} id={id} className={'xcu-wl ' + className} data-lit={lit >= words.length ? '' : undefined}>
      {words.map((w, i) => <span key={i} className={i < lit ? 'w on' : 'w'}>{w}{i < words.length - 1 ? ' ' : ''}</span>)}
    </p>
  );
}

export function Lens({ lines }: { lines: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const lens = ref.current, host = lens?.parentElement?.closest('section'), h1 = host?.querySelector('h1');
    if (!lens || !host || !h1) return;
    if (!matchMedia('(pointer: fine)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const move = (e: PointerEvent) => {
      const r = lens.getBoundingClientRect();
      lens.style.setProperty('--lx', (e.clientX - r.left) + 'px');
      lens.style.setProperty('--ly', (e.clientY - r.top) + 'px');
      // on only over the headline's drawn words (a lens over the blank above or beside them shows an empty disc)
      const g = document.createRange();
      g.selectNodeContents(h1);
      const inside = [...g.getClientRects()].some((q) => e.clientY > q.top && e.clientY < q.bottom && e.clientX > q.left - 8 && e.clientX < q.right + 8);
      lens.toggleAttribute('data-on', inside);
    };
    const leave = () => lens.removeAttribute('data-on');
    host.addEventListener('pointermove', move, { passive: true });
    host.addEventListener('pointerleave', leave);
    return () => { host.removeEventListener('pointermove', move); host.removeEventListener('pointerleave', leave); };
  }, []);
  return (
    <div ref={ref} className="vc-display xcu-h1 xcu-lens" aria-hidden="true">
      <span className="xcu-lens-in">{lines.map((l, i) => <span className="xcu-lens-l" key={i}>{l}</span>)}</span>
    </div>
  );
}
