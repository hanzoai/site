'use client';
/* LineMask: kinetic type, played once. Each line cuts up out of its own mask (VISION motion 4, JAMES "headlines cut
   into their line").
   Usage: <LineMask as="h1" className="lx-display" lines={['Hanzo', 'Metrics']} />  — a hero: plays at first paint;
          <LineMask lines={[...]} inView />                                         — plays when first scrolled to.
   The words are real text in the server HTML and are never hidden from a reader without JS:
   - the hero cut-in is a CSS animation, so it starts at first paint, does not wait for hydration and ends visible
     even with JS off;
   - the inView variant is armed (hidden) only after mount and only while it is still below the fold.
   Timing (MASTER part 3): translateY 105% → 0, 700 ms, ease-emphasis, 60 ms between lines.
   Reduced motion: set, no movement. Owned by Cloud 3. */
import { useEffect, useRef, useState } from 'react';
import './LaunchType.css';

export default function LineMask({ lines, as = 'h2', className = '', delay = 0, inView = false, stagger = 0.06, ...rest }) {
  const ref = useRef(null);
  const [st, setSt] = useState(inView ? 'idle' : 'play'); // idle (visible, untouched) → armed (hidden) → play
  useEffect(() => {
    if (!inView) return;
    const el = ref.current;
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (el.getBoundingClientRect().top < innerHeight * 0.9) return; // already in view: leave it set
    setSt('armed');
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSt('play'); io.disconnect(); } }, { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, [inView]);
  const Tag = as;
  return (
    <Tag ref={ref} className={`lx-lm ${className}`} data-lm={st} {...rest}>
      {lines.map((t, i) => (
        <span className="lx-line" key={i}>
          <span style={{ animationDelay: `${delay + i * stagger}s` }}>{t}</span>
        </span>
      ))}
    </Tag>
  );
}
