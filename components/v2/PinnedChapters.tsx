'use client';
/* PinnedChapters: the Apple product-page backbone (VISION motion 1). The words pin while one product object changes
   beside them: as you scroll, one chapter comes in as the last goes out. Every chapter's words are in the HTML.
   Usage:
     <PinnedChapters
       label="How MQ works"                       // names the rail for screen readers
       intro={{ title: ['The queue is data,', 'the workers are yours'], lede: '…' }}  // optional: the section's own
                                                  // h2 opens the scene beside the object, so the statement is never a
                                                  // screen with nothing to look at
       steps={[{ t: 'Scheduling', d: 'A cron…' }]} // Hanzo's words; k optional (defaults to "01 / 06")
       visual={(at, intro) => <Board step={at} />} // ONE object that changes state per chapter (at ≥ 0; intro true first)
       flip                                        // object on the left
       per={80}                                    // svh of scroll per chapter
       objH={34}                                   // phones: the object's window height in svh (default 40)
     />
   Desktop: 5/8 split. Phone (the rail there is a progress line, out of the tab order): the object on top, the words below, still one at a time. The rail of ticks scrolls to a
   chapter (keyboard too). JS off: the scene unpins and every chapter reads in order. Reduced motion: swaps, no
   movement. Owned by Cloud 3. */
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { useScroll, useMotionValueEvent } from 'motion/react';
import './LaunchType.css';
import './PinnedChapters.css';

const pad = (n: number) => String(n).padStart(2, '0');

interface PinStep {
  t?: string;
  k?: string;
  d?: ReactNode;
  extra?: ReactNode;
}

interface PinIntro {
  title: ReactNode | ReactNode[];
  lede?: ReactNode;
}

interface PinnedChaptersProps {
  steps: PinStep[];
  visual: (at: number, intro: boolean) => ReactNode;
  label?: string;
  flip?: boolean;
  per?: number;
  className?: string;
  id?: string;
  dark?: boolean;
  intro?: PinIntro;
  objH?: number;
}

export default function PinnedChapters({ steps, visual, label = 'Chapters', flip, per = 80, className = '', id, dark, intro, objH }: PinnedChaptersProps) {
  const ref = useRef<HTMLElement>(null);
  const n = steps.length;
  const lead = intro ? 1 : 0;
  const total = n + lead;
  const [at, setAt] = useState(intro ? -1 : 0);
  const [live, setLive] = useState(false);
  const [wide, setWide] = useState(true); // on phones the rail is a progress line (no tiny targets); scroll moves you
  useEffect(() => { setLive(true); const m = matchMedia('(min-width: 900px)'); const f = () => setWide(m.matches); f(); m.addEventListener('change', f); return () => m.removeEventListener('change', f); }, []);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    const i = Math.min(total - 1, Math.max(0, Math.floor(p * total * 0.999))) - lead;
    setAt((v) => (v === i ? v : i));
  });
  const jump = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const y = top + ((i + lead + 0.5) / total) * (el.offsetHeight - window.innerHeight);
    const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.__lenis ? window.__lenis.scrollTo(y, { duration: calm ? 0 : 1.4, easing: (t) => 1 - Math.pow(1 - t, 4) }) : window.scrollTo({ top: y, behavior: calm ? 'auto' : 'smooth' });
  };
  const where = (i: number) => (i < at ? 'past' : i === at ? 'on' : 'next');
  const Intro = intro && (
    <article className="lx-pin-step lx-pin-intro" data-at={where(-1)}>
      <h2 className="lx-pin-it">{(Array.isArray(intro.title) ? intro.title : [intro.title]).map((l, i) => <span key={i}>{l} </span>)}</h2>
      {intro.lede && <p className="lx-pin-il">{intro.lede}</p>}
    </article>
  );
  return (
    <section ref={ref} id={id} className={`lx-pin ${flip ? 'flip' : ''} ${dark ? 'lx-dark' : ''} ${className}`} style={{ '--n': total, '--per': per + 'svh', ...(objH ? { '--objh': objH + 'svh' } : {}) } as CSSProperties} data-room={dark ? 'dark' : undefined} data-live={live || undefined}>
      <div className="lx-pin-stick">
        <div className="lx-wrap lx-pin-grid">
          <div className="lx-pin-copy">
            <div className="lx-pin-steps">
              {Intro}
              {steps.map((s, i) => (
                <article key={i} className="lx-pin-step" data-at={where(i)}>
                  {s.t && <h3 className="lx-pin-t">{s.t}</h3>}
                  <p className="lx-kick lx-pin-k">{s.k || `${pad(i + 1)} / ${pad(n)}`}</p>
                  <p className="lx-pin-d">{s.d}</p>
                  {s.extra}
                </article>
              ))}
            </div>
            <nav className="lx-pin-rail" aria-label={label}>
              {steps.map((s, i) => (
                <button key={i} type="button" tabIndex={wide ? 0 : -1} aria-current={i === at ? 'step' : undefined} aria-label={`${pad(i + 1)}${s.t ? ': ' + s.t : ''}`} onClick={() => jump(i)}>
                  <i data-at={where(i)} />
                </button>
              ))}
            </nav>
          </div>
          <div className="lx-pin-obj">{visual(Math.max(0, at), at < 0)}</div>
        </div>
      </div>
    </section>
  );
}
