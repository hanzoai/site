'use client';
/* ScrubRail (owner: Cloud 2 chat). A row of big cards that slides sideways as you scroll down (the section pins while
   the rail travels), apple.com tile-row style. Phones get a native swipe rail with snap instead of the pin.
   Usage: <ScrubRail label="The eight facts" head={<h2>…</h2>} items={[...]} card={(item, i) => <article>…</article>} />
   Every card is in the HTML. Reduced motion: the rail still follows the scroll (it is the scroll), no other movement.
   Styles: ScrubRail.css (prefix sr-); size cards with your own class inside. */
import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import './ScrubRail.css';

export default function ScrubRail({ items, card, head, label, className = '', dark }) {
  const sec = useRef(null);
  const rail = useRef(null);
  const [dist, setDist] = useState(0);
  const { scrollYProgress } = useScroll({ target: sec, offset: ['start start', 'end end'] });
  const x = useTransform(scrollYProgress, (p) => -dist * Math.min(1, Math.max(0, p)));
  useEffect(() => {
    const m = () => {
      const r = rail.current;
      if (!r) return;
      setDist(innerWidth > 900 ? Math.max(0, r.scrollWidth - innerWidth + 48) : 0);
    };
    m();
    const ro = new ResizeObserver(m);
    rail.current && ro.observe(rail.current);
    addEventListener('resize', m);
    return () => { ro.disconnect(); removeEventListener('resize', m); };
  }, []);
  return (
    <section ref={sec} className={`sr ${dark ? 'sr-dark' : ''} ${className}`} style={{ '--dist': dist + 'px' }} aria-label={label} data-room={dark ? 'dark' : undefined}>
      <div className="sr-stage">
        {head && <div className="sr-head v2-wrap">{head}</div>}
        <div className="sr-view">
          <motion.ol ref={rail} className="sr-rail" style={{ x }}>
            {items.map((it, i) => <li key={i} className="sr-item">{card(it, i)}</li>)}
          </motion.ol>
        </div>
      </div>
    </section>
  );
}
