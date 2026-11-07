'use client';
/* BizChapters: Apple's sticky chapters (VISION motion 1). Owned by the Business 1 chat.
   Usage:
     <BizChapters label="How the book stays true" items={[{ k: 'Kicker', t: 'Headline', d: 'Body', x: <extra /> }]}
       stage={(at) => <YourVisual at={at} />} flip={false} dark={false} />
   The stage (your product UI) pins on one side while the chapters scroll past on the other. One chapter is lit at a
   time and the rest dim, so one thing comes in as the last goes out; stage(at) redraws for the lit chapter, and a bar
   under the stage fills with the scroll. Phones: the stage pins at the top and the chapters scroll under it.
   Reduced motion: no transitions, the stage still follows the chapter you are reading. Every word stays in the HTML,
   and chapters dim only once JavaScript runs, so with JS off every chapter reads. */
import { useEffect, useRef, useState } from 'react';
import { motion, useScroll } from 'motion/react';
import './Biz.css';

export default function BizChapters({ items, stage, label, flip, dark, className = '', id, children }) {
  const ref = useRef(null);
  const [at, setAt] = useState(0);
  const [live, setLive] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start center', 'end center'] });
  useEffect(() => {
    setLive(true);
    const els = [...ref.current.querySelectorAll('[data-ch]')];
    const phone = matchMedia('(max-width: 900px)').matches;
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setAt(+e.target.dataset.ch)), { rootMargin: phone ? '-68% 0px -26% 0px' : '-48% 0px -48% 0px' });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items.length]);
  return (
    <section ref={ref} id={id} className={`bz-ch ${live ? 'live' : ''} ${flip ? 'flip' : ''} ${dark ? 'dark' : ''} ${className}`} aria-label={label} data-room={dark ? 'dark' : undefined}>
      {children}
      <div className="bz-wrap bz-ch-grid">
        <div className="bz-ch-stage">
          {stage(at)}
          <div className="bz-ch-meta" aria-hidden="true">
            <b>{String(at + 1).padStart(2, '0')}</b>
            <span className="bz-ch-bar"><motion.i style={{ scaleX: scrollYProgress }} /></span>
            <span>{String(items.length).padStart(2, '0')}</span>
          </div>
        </div>
        <ol className="bz-ch-list">
          {items.map((it, i) => (
            <li key={i} data-ch={i} className={'bz-ch-i' + (at === i ? ' on' : '')} aria-current={at === i ? 'step' : undefined}>
              <p className="bz-kick"><span className="x-mono">{String(i + 1).padStart(2, '0')}</span>{it.k && <>&ensp;{it.k}</>}</p>
              {it.t && <h3 className="bz-headline">{it.t}</h3>}
              {it.d && <p className="bz-body">{it.d}</p>}
              {it.x}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
