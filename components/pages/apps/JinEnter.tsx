'use client';
/* Jin's section entrances (MOTION-MAP rule 7): each main section arrives its own way, once, when it reaches the screen.
   1 squash-land  the hero's Figure 1 (pure CSS on first paint: .jn-hero-fig in Jin.css)
   2 curtain-rise the six rows rise from below behind a clip            (.jn-paper.en-in)
   3 pull-back    Figure 8 starts zoomed right in and pulls back         (.jn-try.en-in)
   4 venetian-type the close's lines slide in from alternating sides    (.jn-end.en-in)
   5 domino       the closing rows tip into place one after another     (.jn-more.en-in)
   This hook only sets the classes; the moves are CSS keyframes in Jin.css that use transform, opacity and clip-path, so
   nothing shifts layout. A section already on screen when the page runs, reduced motion and JS off are never armed:
   they simply show the final state. */
import { useLayoutEffect, useRef, useState } from 'react';

const useIso = typeof window === 'undefined' ? () => {} : useLayoutEffect;

export function useEnter<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T>(null);
  const [st, setSt] = useState('');
  useIso(() => {
    const el = ref.current;
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const r = el.getBoundingClientRect();
    if (r.top < innerHeight * 0.85 && r.bottom > 0) return;
    setSt(' en-armed');
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      setSt(' en-armed en-in');
    }, { rootMargin: '0px 0px -18% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, st] as const;
}
