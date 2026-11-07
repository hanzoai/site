'use client';
/* Chaptered: v2 sticky chapters (docs/VISION.md, motion 1), owned by the Wave 2 Programs chat.
   The words pin on one side while the visual on the other changes; scrolling brings one chapter in as the last goes
   out. Every chapter's words are in the HTML. On phones (≤ 900 px) it becomes a plain vertical story: each chapter
   followed by its own still visual. Keyboard: tabbing into a chapter scrolls to it; the rail's dots jump to each.
   Usage:
     <Chaptered label="How it works" chapters={[{ kicker, title, body }]} stage={(i, still) => <Visual at={i} />} />
   - stage(i, still): the visual for chapter i (still = true for the phone copies: draw the end state, no loops);
   - head: a node shown above the pinned words (desktop) and above the story (phone);
   - flip: the visual on the left; dark: the page's one dark room (sets data-room for the header);
   - per: viewport heights of scroll per chapter (default 0.9).
   Needs components/v2/ProgramScale.css. */
import { useRef, useState } from 'react';
import { motion, useScroll, useMotionValueEvent, useSpring } from 'motion/react';
import './Chaptered.css';

const EASE = [0.16, 1, 0.3, 1];

export default function Chaptered({ chapters, stage, head, label, flip = false, dark = false, per = 0.9, id, className = '' }) {
  const ref = useRef(null);
  const n = chapters.length;
  const [at, setAt] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const fill = useSpring(scrollYProgress, { stiffness: 300, damping: 30 });
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    const i = Math.max(0, Math.min(n - 1, Math.floor(p * n * 0.9999)));
    if (i !== at) setAt(i);
  });
  const go = (i) => {
    const el = ref.current;
    if (!el || getComputedStyle(el).getPropertyValue('--pinned').trim() !== '1') return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const y = top + ((i + 0.5) / n) * (el.offsetHeight - window.innerHeight);
    window.__lenis ? window.__lenis.scrollTo(y, { duration: 1.1 }) : window.scrollTo({ top: y, behavior: 'smooth' });
  };
  return (
    <section ref={ref} id={id} className={'xpc' + (flip ? ' flip' : '') + (dark ? ' xp-dark' : '') + ' ' + className} style={{ '--n': n, '--per': per }} aria-label={label} {...(dark ? { 'data-room': 'dark' } : {})}>
      <div className="xpc-pin">
        <div className="xp-wrap xpc-grid">
          <div className="xpc-words">
            {head && <div className="xpc-head">{head}</div>}
            <div className="xpc-stack">
              {chapters.map((c, i) => (
                <motion.article key={i} className={'xpc-ch' + (i === at ? ' on' : '')} onFocusCapture={() => { if (i !== at) go(i); }}
                  initial={false} animate={i === at ? { opacity: 1, y: 0 } : { opacity: 0, y: i < at ? -28 : 36 }}
                  transition={i === at ? { duration: 0.7, ease: EASE, delay: 0.08 } : { duration: 0.28, ease: [0.4, 0, 1, 1] }}>
                  {c.kicker && <p className="xp-kick plain xpc-k">{c.kicker}</p>}
                  <h3 className="xp-head xpc-t">{c.title}</h3>
                  {c.body && <div className="xp-body xpc-b">{c.body}</div>}
                </motion.article>
              ))}
            </div>
            <nav className="xpc-rail" aria-label={(label || 'Chapters') + ': jump to'}>
              <span className="xpc-track" aria-hidden="true"><motion.i style={{ scaleY: fill }} /></span>
              {chapters.map((c, i) => (
                <button key={i} type="button" className={i <= at ? 'on' : ''} aria-current={i === at ? 'step' : undefined} onClick={() => go(i)}>
                  <span className="x-sr">{typeof c.title === 'string' ? c.title : 'Chapter ' + (i + 1)}</span>
                </button>
              ))}
            </nav>
          </div>
          <div className="xpc-stage" aria-hidden="true">
            <div className="xpc-stage-in">{stage(at, false)}</div>
          </div>
        </div>
      </div>
      {/* phones: the same chapters as a vertical story, each with its own still visual */}
      <div className="xp-wrap xpc-story">
        {head && <div className="xpc-head">{head}</div>}
        {chapters.map((c, i) => (
          <div className="xpc-sch" key={i}>
            <div className="xpc-sstage" aria-hidden="true">{stage(i, true)}</div>
            {c.kicker && <p className="xp-kick plain">{c.kicker}</p>}
            <h3 className="xp-title">{c.title}</h3>
            {c.body && <div className="xp-body xpc-b">{c.body}</div>}
          </div>
        ))}
      </div>
    </section>
  );
}
