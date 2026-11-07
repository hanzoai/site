'use client';
/* Careers' own entrances (MOTION-MAP.md, page-local; never a shared reveal). useEnter() marks an element `data-in` the
   first time it scrolls into view (IntersectionObserver, once). The hidden start states live in careers/enter.css under
   `html.js … :not([data-in])`, so JS off shows everything and reduced motion marks every element in at once.
   Roll: count-roll for a figure; each digit rides a 0–9 column to its value (the real text stays for readers). */
import { useEffect, useRef } from 'react';
import './enter.css';

export function useEnter(margin = '0px 0px -18% 0px') {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { el.dataset.in = ''; return; }
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { el.dataset.in = ''; io.disconnect(); } }, { rootMargin: margin });
    io.observe(el);
    return () => io.disconnect();
  }, [margin]);
  return ref;
}

export function Roll({ text, className = '' }) {
  let k = 0;
  return (
    <b className={'xce-roll ' + className}>
      <span className="x-sr">{text}</span>
      <span aria-hidden="true" className="xce-roll-v">
        {[...text].map((c, i) => (/\d/.test(c)
          ? <span key={i} className="xce-roll-d" style={{ '--d': c, '--k': k++ }}><span>{'0123456789'.split('').map((n) => <i key={n}>{n}</i>)}</span></span>
          : <span key={i} className="xce-roll-c">{c}</span>))}
      </span>
    </b>
  );
}
