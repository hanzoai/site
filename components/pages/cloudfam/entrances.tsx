'use client';
/* The /cloud/* page's five entrances (MOTION-MAP: swing-door, opposite-drift, letter-cascade, iris, squash-land), page
   local. Each main section after the hero arrives one of these ways, in that order; each plays once, when its top
   crosses 70% of the screen. The waiting pose exists only under html.js (set before first paint), so with JS off, and
   under reduced motion, every section is simply there. Transform, opacity and clip-path only: no layout shift.
   opposite-drift is the one scroll-linked move: the section's two halves ([data-half=l] / [data-half=r]) slide in
   from opposite sides as it is scrolled in, then hold for good. */
import { createElement, useEffect, useRef, useState } from 'react';
import type { ElementType, HTMLAttributes, ReactNode } from 'react';
import useCalm from '../../v2/useCalm';

export const ENTRANCES = ['swing-door', 'opposite-drift', 'letter-cascade', 'iris', 'squash-land'] as const;
export type Kind = (typeof ENTRANCES)[number];
const CLS: Record<Kind, string> = { 'swing-door': 'swing', 'opposite-drift': 'drift', 'letter-cascade': 'cascade', iris: 'iris', 'squash-land': 'squash' };

interface EnterProps extends HTMLAttributes<HTMLElement> {
  kind?: Kind | null;
  as?: ElementType;
  children?: ReactNode;
}

export function Enter({ kind, as = 'section', className = '', children, ...rest }: EnterProps) {
  const ref = useRef<HTMLElement>(null);
  const [on, setOn] = useState(false);
  const calm = useCalm();
  useEffect(() => {
    const el = ref.current;
    if (!el || !kind) return undefined;
    if (calm || typeof IntersectionObserver === 'undefined') { setOn(true); return undefined; }
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { setOn(true); io.disconnect(); } }, { rootMargin: '0px 0px -30% 0px', threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, [kind, calm]);
  // opposite-drift: the halves follow the scroll in (rAF, passive), then latch at rest
  useEffect(() => {
    const el = ref.current;
    if (!el || kind !== 'opposite-drift') return undefined;
    if (calm) { el.style.setProperty('--xd', '0'); return undefined; }
    let raf = 0;
    let done = false;
    const tick = () => {
      raf = 0;
      const vh = window.innerHeight || 800;
      const top = el.getBoundingClientRect().top;
      const p = Math.min(1, Math.max(0, (vh - top) / (vh * 0.62)));
      const e = 1 - (1 - p) * (1 - p);
      el.style.setProperty('--xd', (1 - e).toFixed(4));
      if (p >= 1) { done = true; window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); }
    };
    const onScroll = () => { if (!done && !raf) raf = requestAnimationFrame(tick); };
    tick();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { if (raf) cancelAnimationFrame(raf); window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); };
  }, [kind, calm]);
  const c = kind ? ' xe xe-' + CLS[kind] + (on ? ' in' : '') : '';
  return createElement(as, { ref, className: className + c, 'data-entrance': kind || undefined, ...rest }, children);
}

/* letter-cascade: a heading's letters, each its own span, falling into place one by one (words never break apart).
   Without the cascade it is the plain text. */
export function Letters({ text, on }: { text?: string; on?: boolean }) {
  if (!on || !text) return text || null;
  let n = 0;
  // the heading reads once, whole (screen readers and the copy check); the falling letters are the picture of it
  return <><span className="x-sr">{text}</span><span aria-hidden="true">{text.split(/(\s+)/).map((w: string, i: number) => (/^\s+$/.test(w) || !w ? w : (
    <span key={i} className="xe-w">{Array.from(w).map((ch, k) => <span key={k} className="xe-l" style={{ '--i': Math.min(n++, 40) }}>{ch}</span>)}</span>
  )))}</span></>;
}
