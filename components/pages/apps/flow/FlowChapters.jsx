'use client';
/* FlowChapters (page-local to /flow; built from v2 BizChapters' idea, not a fork of its file).
   Desktop: the stage pins on the left while the chapters scroll on the right, and the stage BUILDS: chapter 01 shows
   the first node alone, each chapter adds the next node and its wire, so by 06 the whole flow stands (one graph becomes
   the next instead of reprinting). Phone: no big pin; one slim mini-graph sticks under the header and its lit node
   follows the chapter you are reading. The heading leads each chapter; its "01 / 06" caption sits under it.
   Both stage and mini-graph are in the server HTML and switch by CSS, so the first render never differs by device.
   Reduced motion: every chapter at full ink, no transitions; the stage still follows the chapter you read. */
import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useReducedMotion } from 'motion/react';

const two = (n) => String(n).padStart(2, '0');

export default function FlowChapters({ items, label, stage, mini, children }) {
  const ref = useRef(null);
  const [at, setAt] = useState(0);
  const [live, setLive] = useState(false);
  const calm = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start center', 'end center'] });
  useEffect(() => {
    setLive(true);
    const els = [...ref.current.querySelectorAll('[data-ch]')];
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setAt(+e.target.dataset.ch)), { rootMargin: '-45% 0px -45% 0px' });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items.length]);
  const n = items.length;
  return (
    <section ref={ref} className={'flc' + (live && !calm ? ' live' : '')} aria-label={label}>
      {children}
      <div className="flc-mini" aria-hidden="true">{mini(at)}</div>
      <div className="bz-wrap flc-grid">
        <div className="flc-stage">
          {stage(at)}
          <div className="flc-meta" aria-hidden="true">
            <b>{two(at + 1)}</b>
            <span className="flc-bar"><motion.i style={{ scaleX: scrollYProgress }} /></span>
            <span>{two(n)}</span>
          </div>
        </div>
        <ol className="flc-list">
          {items.map((it, i) => (
            <li key={i} data-ch={i} className={'flc-i' + (at === i ? ' on' : '')} aria-current={at === i ? 'step' : undefined}>
              <h3 className="bz-headline">{it.t}</h3>
              <p className="flc-n x-mono" aria-hidden="true"><b>{two(i + 1)}</b> / {two(n)}</p>
              <p className="bz-body">{it.d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
