'use client';
/* KeynoteChapters: the apple.com chapter backbone (VISION motion 1). The section pins; as you scroll, one chapter's words
   come in as the last one's go out, and the visual beside them changes with them. One idea per screen.
   Owned by the Cloud 1 chat.
   Usage:
     <KeynoteChapters
       items={[{ kick: 'run, serve, bench', title: 'One process…', body: <p>…</p> }, …]}
       visual={(i, on, p) => <MyVisual i={i} on={on} p={p} />}
       swap="wipe" side="left" count />
   - visual(i, on, p): what stands beside chapter i. on: it is the chapter in front. p: a MotionValue 0→1 of the scroll
     through that chapter (desktop), for scrubbing; null on phones. Keep idle loops gated on `on`.
   - swap: how one visual replaces the last: 'wipe' (clip from below), 'rise', 'scale' or 'fade'.
   - side: 'left' (words left on 5 columns, visual right on 7) or 'right'.
   - count: prints "01 / 06" under each chapter's words (with its kick), never above the headline.
   - rail: false hides the clickable chapter rail.
   Phones (≤ 900 px): no pinning; each chapter is its words then its visual, played as it scrolls into view.
   JS off: every chapter stands stacked, words and visual, all legible. Reduced motion: chapters change with no transition. */
import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent, useInView } from 'motion/react';
import type { MotionValue } from 'motion/react';
import { scrollToY } from '../../lib/scroll';
import './Keynote.css';
import './KeynoteChapters.css';

/* true on screens 900 px and wider (the server renders the wide layout) */
export function useWide(q = '(min-width: 900px)') {
  const [w, setW] = useState(true);
  useEffect(() => {
    const m = matchMedia(q);
    const f = () => setW(m.matches);
    f();
    m.addEventListener('change', f);
    return () => m.removeEventListener('change', f);
  }, [q]);
  return w;
}

const pad = (n: number) => String(n).padStart(2, '0');

interface KeynoteItem {
  title: ReactNode;
  body?: ReactNode;
  kick?: string;
}

type Visual = (i: number, on: boolean, p: MotionValue<number> | null) => ReactNode;
type Swap = 'wipe' | 'rise' | 'scale' | 'fade';

/* one chapter: its words and its visual. On phones it plays when the chapter itself is seen (the visual is clipped
   while it waits, so the chapter, not the visual, is what is watched). */
interface ChapterProps {
  it: KeynoteItem;
  i: number;
  n: number;
  p: MotionValue<number>;
  at: number;
  wide: boolean;
  visual: Visual;
  swap: Swap;
  count: boolean;
}

function Chapter({ it, i, n, p, at, wide, visual, swap, count }: ChapterProps) {
  const ref = useRef<HTMLElement>(null);
  const seen = useInView(ref, { amount: 0.25 });
  const local = useTransform(p, (v) => Math.min(1, Math.max(0, v * n - i)));
  const on = wide ? at === i : seen;
  const pos = at > i ? 'past' : at < i ? 'next' : 'now';
  return (
    <article ref={ref} className="knc-a">
      <div className="knc-t" data-on={!wide || at === i ? '' : undefined} data-pos={pos}>
        <h3 className="kn-headline knc-h">{it.title}</h3>
        {it.body && <div className="knc-body">{it.body}</div>}
        {(count || it.kick) && (
          <div className="knc-foot">
            {count && <p className="knc-count kn-fig">{pad(i + 1)} / {pad(n)}</p>}
            {it.kick && <p className="kn-kick">{it.kick}</p>}
          </div>
        )}
      </div>
      <div className={'knc-v ' + swap} data-on={on ? '' : undefined} data-pos={wide ? pos : 'next'}>
        {visual(i, on, wide ? local : null)}
      </div>
    </article>
  );
}

interface KeynoteChaptersProps {
  items: readonly KeynoteItem[];
  visual: Visual;
  swap?: Swap;
  side?: 'left' | 'right';
  count?: boolean;
  rail?: boolean;
  className?: string;
  head?: ReactNode;
  tall?: number;
}

export default function KeynoteChapters({ items, visual, swap = 'wipe', side = 'left', count = false, rail = true, className = '', head, tall = 100 }: KeynoteChaptersProps) {
  const sec = useRef<HTMLDivElement>(null);
  const n = items.length;
  const wide = useWide();
  const [at, setAt] = useState(0);
  const { scrollYProgress: p } = useScroll({ target: sec, offset: ['start start', 'end end'] });
  useMotionValueEvent(p, 'change', (v) => setAt(Math.min(n - 1, Math.max(0, Math.floor(v * n * 0.9999)))));
  const fill = useTransform(p, [0, 1], [0, 1]);
  const go = (i: number) => {
    const el = sec.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const span = el.offsetHeight - window.innerHeight;
    const y = top + (span * (i + 0.5)) / n;
    scrollToY(y, { duration: 1.1 });
  };
  return (
    <section className={`knc ${side} ${className}`} style={{ '--n': n, '--tall': tall + 'svh' } as CSSProperties}>
      {head && <div className="kn-wrap knc-head">{head}</div>}
      <div ref={sec} className="knc-run">
      <div className="knc-pin">
        <div className="kn-wrap kn-grid knc-g">
          {items.map((it, i) => <Chapter key={i} it={it} i={i} n={n} p={p} at={at} wide={wide} visual={visual} swap={swap} count={count} />)}
          {rail && (
            <nav className="knc-rail" aria-label="Chapters">
              <span className="knc-track" aria-hidden="true"><motion.i style={{ scaleX: fill }} /></span>
              {items.map((it, i) => (
                <button key={i} type="button" data-sound="tick" aria-current={at === i ? 'step' : undefined} onClick={() => go(i)} aria-label={`Chapter ${i + 1}: ${typeof it.title === 'string' ? it.title : ''}`}>
                  <span className="kn-fig">{pad(i + 1)}</span>
                </button>
              ))}
            </nav>
          )}
        </div>
      </div>
      </div>
    </section>
  );
}
