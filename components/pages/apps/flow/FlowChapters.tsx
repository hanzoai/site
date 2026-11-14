'use client';
/* FlowChapters (page-local to /flow; built from v2 BizChapters' idea, not a fork of its file).
   Desktop: the stage pins on the left while the chapters scroll on the right, and the stage BUILDS: chapter 01 shows
   the first node alone, each chapter adds the next node and its wire, so by 06 the whole flow stands (one graph becomes
   the next instead of reprinting). The first chapter is already beside the stage when it pins, so neither column waits.
   Phone: one pinned scene, one in and one out. The mini-graph sits at the top of an opaque pinned panel and the chapter
   under it swaps as you scroll (the scroll through the section picks the chapter); nothing scrolls behind it. Every
   chapter stays in the HTML; with scripts off the phone list simply stacks.
   The heading leads each chapter; its "01 / 06" caption sits under it.
   Reduced motion: every chapter at full ink, no transitions; the stage still follows the chapter you read. */
import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useMotionValueEvent, useReducedMotion } from 'motion/react';

const two = (n: number) => String(n).padStart(2, '0');

export default function FlowChapters({ items, label, stage, mini, children }) {
  const ref = useRef<HTMLElement>(null);
  const run = useRef<HTMLDivElement>(null);
  const phone = useRef(false);
  const [at, setAt] = useState(0);
  const [live, setLive] = useState(false);
  const calm = useReducedMotion();
  const n = items.length;
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start center', 'end center'] });
  const { scrollYProgress: runP } = useScroll({ target: run, offset: ['start start', 'end end'] });
  // phones: the scroll through the pinned run picks the chapter
  useMotionValueEvent(runP, 'change', (v: number) => { if (phone.current) setAt(Math.min(n - 1, Math.max(0, Math.floor(v * n * 0.999)))); });
  useEffect(() => {
    setLive(true);
    const mq = matchMedia('(max-width: 900px)');
    const sync = () => { phone.current = mq.matches; };
    sync();
    mq.addEventListener('change', sync);
    // desktop: the chapter crossing the middle of the screen is the one in focus
    const els = [...ref.current!.querySelectorAll('[data-ch]')];
    const io = new IntersectionObserver((es) => es.forEach((e) => !phone.current && e.isIntersecting && setAt(+e.target.dataset.ch)), { rootMargin: '-45% 0px -45% 0px' });
    els.forEach((el) => io.observe(el));
    return () => { io.disconnect(); mq.removeEventListener('change', sync); };
  }, [n]);
  return (
    <section ref={ref} className={'flc' + (live && !calm ? ' live' : '')} aria-label={label} style={{ '--n': n }}>
      {children}
      <div ref={run} className="flc-run">
        <div className="flc-pin">
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
        </div>
      </div>
    </section>
  );
}
