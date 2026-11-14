'use client';
/* /zen only: marks a section [data-in] the first time it is well in view, so its own entrance (in Zen.css) plays once.
   Each section has a different entrance; this hook only says "now". With JS off nothing is marked, and the CSS
   entrance states are scoped to html.js, so every section shows its final state. */
import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';

export function useEnter<T extends HTMLElement = HTMLElement>(amount = 0.25) {
  const ref = useRef<T>(null);
  const [inn, setIn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { setIn(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setIn(true); io.disconnect(); } }, { threshold: amount });
    io.observe(el);
    return () => io.disconnect();
  }, [amount]);
  return [ref, inn] as const;
}

// letter-cascade: a string as letter spans (the words stay whole for screen readers through the parent's text)
export function Letters({ text, from = 0 }: { text: string; from?: number }) {
  return text.split('').map((ch, i) => (
    <span key={i} className="ze-lt" style={{ '--i': from + i } as CSSProperties}>{ch}</span>
  ));
}
