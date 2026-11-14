'use client';
/* PinChapters: the Apple product-page backbone. The section pins for one screen per chapter; the words stay put
   while one chapter comes in as the last goes out, and the visual beside them changes with the chapter.
   Usage:
     <PinChapters id="how" label="How it works" chapters={[{ k: 'Kicker', t: 'Headline', b: <p>…</p> }, …]}
       visual={(i, mine) => <YourVisual at={i} />} />
   - visual(i) renders the pinned object for chapter i (the same object, changing, reads best).
   - Every chapter's words are always in the page (find-in-page, screen readers); only the active one is shown.
   - title (optional): the section's own heading, set once at the top of the numbered rail (never above a chapter headline).
   - The numbered rail glides to a chapter. Phones: the visual pins on top and the chapters scroll under it.
   - c.k is a mono meta line under the words (never an eyebrow above the headline).
   - c.node replaces the headline and body with your own block (for example the page's hero: its h1, lede and ask), and
     c.rail === false keeps that chapter out of the numbered rail; it then leads on phones too (before the visual).
   - Reduced motion: chapters swap without travel. JS off: <NoJs/> stacks every chapter. Owned by the Business 2 chat. */
import { useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { motion, useMotionValueEvent, useScroll, useReducedMotion } from 'motion/react';
import { scrollToY } from '../../../lib/scroll';
import './PinChapters.css';

const EASE = [0.16, 1, 0.3, 1] as const;

interface Chapter {
  k?: string;
  t?: ReactNode;
  b?: ReactNode;
  node?: ReactNode;
  rail?: boolean;
}

interface PinChaptersProps {
  id?: string;
  label: string;
  title?: string;
  chapters: Chapter[];
  visual: (at: number) => ReactNode;
  className?: string;
  flip?: boolean;
}

export default function PinChapters({ id, label, title, chapters, visual, className = '', flip = false }: PinChaptersProps) {
  const ref = useRef<HTMLElement>(null);
  const n = chapters.length;
  const [at, setAt] = useState(0);
  const calm = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  useMotionValueEvent(scrollYProgress, 'change', (v) => setAt(Math.min(n - 1, Math.max(0, Math.floor(v * n * 0.999)))));
  const go = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + scrollY + ((el.offsetHeight - innerHeight) * (i + 0.5)) / n;
    scrollToY(top, { duration: 0.9 });
  };
  return (
    <section ref={ref} id={id} aria-label={label} className={'w2-pin' + (flip ? ' flip' : '') + ' ' + className} style={{ '--n': n } as CSSProperties}>
      <div className="w2-pin-stick">
        <div className="w2-wrap w2-pin-grid">
          <div className="w2-pin-words">
            <ol className="w2-pin-rail" aria-label={title || 'Chapters'}>
              {title && <li className="w2-pin-title" aria-hidden="true"><span className="x-mono">{title}</span></li>}
              {chapters.map((c, i) => c.rail === false ? null : (
                <li key={i}>
                  <button type="button" aria-current={at === i ? 'step' : undefined} onClick={() => go(i)}>
                    <span className="x-mono">{String(i + 1 - chapters.slice(0, i).filter((x) => x.rail === false).length).padStart(2, '0')}</span>
                    <i aria-hidden="true"><motion.b initial={false} animate={{ scaleX: at > i ? 1 : at === i ? 0.5 : 0 }} transition={{ duration: 0.5, ease: EASE }} /></i>
                  </button>
                </li>
              ))}
            </ol>
            <div className="w2-pin-texts">
              {chapters.map((c, i) => (
                <motion.article key={i} className={'w2-pin-t' + (at === i ? ' on' : '') + (c.rail === false ? ' lead' : '')} initial={false}
                  animate={calm ? { opacity: at === i ? 1 : 0 } : { opacity: at === i ? 1 : 0, y: at === i ? 0 : at > i ? -48 : 48 }}
                  transition={{ duration: at === i ? 0.55 : 0.16, ease: EASE, delay: at === i ? 0.16 : 0 }}>
                  {c.node || <><h2 className="w2-headline">{c.t}</h2><div className="w2-pin-b">{c.b}</div></>}
                  {c.k && <p className="w2-pin-meta x-mono">{c.k}</p>}
                </motion.article>
              ))}
            </div>
          </div>
          <div className="w2-pin-visual">{visual(at)}</div>
        </div>
      </div>
    </section>
  );
}
