'use client';
/* /about's signature, `word-light` (docs/MOTION-MAP.md): Hanzo's belief statement, set large, lights word by word as it
   is read. The reading line is the middle of the screen: every word above it is in ink, the rest wait in grey, so the
   scroll (wheel, touch, keys) reads it out. A hand over a word lights the statement up to that word, to read ahead.
   Server HTML and JS off: every word in ink. Reduced motion: every word in ink, nothing moves.
   The words are one paragraph of text (the spans only carry the light), so it reads once, in order. */
import { useEffect, useRef, useState } from 'react';
import './wordlight.css';

interface WordLightProps {
  text: string;
  className?: string;
}
export default function WordLight({ text, className = '' }: WordLightProps) {
  const words = text.split(' ');
  const N = words.length;
  const box = useRef<HTMLParagraphElement>(null);
  const [lit, setLit] = useState(N); // all lit on the server and in the first client render (no mismatch)
  const [ahead, setAhead] = useState(-1);
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = box.current;
    if (!el) return;
    setOn(true);
    let seen = false;
    const read = () => {
      if (!seen) return;
      const r = el.getBoundingClientRect();
      const line = innerHeight * 0.62; // the reading line
      // progress: 0 when the statement's top reaches the line, 1 when its bottom does
      const p = Math.max(0, Math.min(1, (line - r.top) / Math.max(1, r.height)));
      setLit(Math.round(p * N));
    };
    const io = new IntersectionObserver(([e]) => { seen = e.isIntersecting; read(); }, { rootMargin: '20% 0px 20% 0px' });
    io.observe(el);
    addEventListener('scroll', read, { passive: true });
    addEventListener('resize', read);
    return () => { io.disconnect(); removeEventListener('scroll', read); removeEventListener('resize', read); };
  }, [N]);
  const upto = Math.max(lit, ahead + 1);
  return (
    <p ref={box} className={'xab-wl' + (on ? ' on' : '') + (className ? ' ' + className : '')} onPointerLeave={() => setAhead(-1)}>
      {words.map((w, i) => (
        <span key={i} className={'xab-wl-w' + (i < upto ? ' lit' : '')} onPointerEnter={(e) => e.pointerType === 'mouse' && setAhead(i)}>{w}{i < N - 1 ? ' ' : ''}</span>
      ))}
    </p>
  );
}
