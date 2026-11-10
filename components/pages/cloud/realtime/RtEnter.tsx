'use client';
/* /realtime's five section entrances (docs/MOTION-MAP.md): card-deal (the use-case rail), tile-flip (the living
   graph's tile), shrink-to-card (the hero, as you leave it), vertical-ticker (the growth spec rows), venetian-type
   ("Two calls and the page keeps itself current"). Page-local, each played once (shrink-to-card is tied to leaving).
   The server HTML is every section's final state, so JS off or reduced motion shows it whole; start states are armed
   only after mount and only for a section still below the fold; each observer watches an unclipped box, so every
   arrival fires. Only transform, clip-path and opacity move: no box changes size. */
import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useCalm } from '../../../ui'; // read after hydration, so the server frame and the first client frame match

const calmNow = () => typeof window !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

function useArrive(margin = '0px 0px -18% 0px') {
  const ref = useRef(null);
  const [st, setSt] = useState('idle'); // idle (final, untouched) -> armed -> play
  useEffect(() => {
    const el = ref.current;
    if (!el || calmNow()) return;
    if (el.getBoundingClientRect().top < innerHeight * 0.82) return;
    setSt('armed');
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSt('play'); io.disconnect(); } }, { rootMargin: margin });
    io.observe(el);
    return () => io.disconnect();
  }, [margin]);
  return [ref, st];
}

/* shrink-to-card: as you scroll off the hero it settles back into a grey rounded card, a little smaller */
export function ShrinkToCard({ children, className = '', ...rest }) {
  const ref = useRef(null);
  const calm = useCalm();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const scale = useTransform(scrollYProgress, [0, 0.8], [1, 0.92], { clamp: true });
  const fill = useTransform(scrollYProgress, [0, 0.3], [0, 1], { clamp: true });
  const inset = useTransform(scrollYProgress, [0, 0.4], [0, 16], { clamp: true });
  const r = useTransform(scrollYProgress, [0, 0.4], [0, 32], { clamp: true });
  const clip = useTransform([inset, r], ([i, v]) => `inset(0px ${i}px round ${v}px)`);
  return (
    <section ref={ref} className={'rt-shrink ' + className} {...rest}>
      <motion.div className="rt-shrink-bg" aria-hidden="true" style={calm ? { opacity: 0 } : { scale, opacity: fill, clipPath: clip }} />
      <motion.div className="rt-shrink-in" style={calm ? undefined : { scale }}>{children}</motion.div>
    </section>
  );
}

/* tile-flip: a grid of white tiles over the graph's tile turns edge-on, one diagonal at a time, and the graph is
   formed under them (the veil exists only while it plays) */
export function FlipVeil({ cols = 8, rows = 5 }) {
  const [ref, st] = useArrive('0px 0px -20% 0px');
  const [gone, setGone] = useState(false);
  useEffect(() => { if (st !== 'play') return; const t = setTimeout(() => setGone(true), 1500); return () => clearTimeout(t); }, [st]);
  return (
    <span ref={ref} className="rt-flip" data-flip={st} aria-hidden="true" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)` }}>
      {st !== 'idle' && !gone && Array.from({ length: cols * rows }, (_, k) => <i key={k} style={{ '--t': ((k % cols) + ((k / cols) | 0)) * 45 + 'ms' }} />)}
    </span>
  );
}

/* card-deal: the use cases start as one deck at the first card's place and are dealt out to theirs */
export function CardDeal({ children, className = '', ...rest }) {
  const [ref, st] = useArrive('0px 0px -24% 0px');
  return <section ref={ref} className={'rt-deal ' + className} data-deal={st} {...rest}>{children}</section>;
}

/* vertical-ticker: each spec row's figure and line ride up from under the row's edge into place, one after another */
export function Ticker({ children }) {
  const [ref, st] = useArrive('0px 0px -15% 0px');
  return <div ref={ref} className="rt-tick" data-tick={st}>{children}</div>;
}

/* venetian-type: each line of the heading, then the line under it and the two links, slide in from alternating sides */
export function Venetian({ children, className = '' }) {
  const [ref, st] = useArrive('0px 0px -20% 0px');
  return <div ref={ref} className={'rt-ven ' + className} data-ven={st}>{children}</div>;
}
