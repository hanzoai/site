'use client';
/* /desktop's five entrances (MOTION-MAP order: swing-door, domino, inertia-drag, shrink-to-card, page-curl).
   Page-local, never shared. Each one plays once when its section scrolls into view (IntersectionObserver adds `.in`
   to the element by hand, so React never re-renders for it and server and client markup match). The hidden starting
   states live in enter.css under `html.js` only, so JS off shows everything; reduced motion adds `.in` at once and
   enter.css drops every transition. shrink-to-card is the one scroll-linked entrance: the section shrinks into a card
   as you leave it. */
import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import './enter.css';

export function useEnter(amount = 0.3) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { el.classList.add('in'); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('in'); io.disconnect(); } }, { threshold: amount });
    io.observe(el);
    return () => io.disconnect();
  }, [amount]);
  return ref;
}

// shrink-to-card: scale, corners and a grey fill follow the section out of the top of the screen
export function ShrinkCard({ children, className = '', ...rest }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['end end', 'end start'] });
  const scale = useTransform(scrollYProgress, [0, 0.75], [1, 0.86]);
  const radius = useTransform(scrollYProgress, [0, 0.35], [0, 32]);
  const fill = useTransform(scrollYProgress, [0, 0.25], ['rgba(245, 245, 245, 0)', 'rgba(245, 245, 245, 1)']);
  const fillA = useTransform(scrollYProgress, [0, 0.25], [0, 1]); // dark mode draws its own grey at this strength (enter.css)
  return (
    <motion.section ref={ref} className={'en-shrink ' + className} style={{ scale, borderRadius: radius, backgroundColor: fill, '--shrink-a': fillA }} {...rest}>
      {children}
    </motion.section>
  );
}

// page-curl: the grey card the last section shrank into lies over this one and curls away from its corner
export function Curl() {
  return <div className="en-curl" aria-hidden="true"><i className="en-curl-sheet" /><i className="en-curl-flap" /></div>;
}
