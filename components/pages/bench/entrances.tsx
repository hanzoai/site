'use client';
/* The benchmark pages' five entrances (docs/MOTION-MAP.md, /benchmarks/*), page-local, each played once when its section
   is about 30% on screen:
   1. venetian-type: the title and its lines slide in from alternating sides (the head beside the race);
   2. pull-back: the source room starts zoomed right in on its reply and pulls back to the whole room;
   3. blinds: venetian-blind slats over the facts (or the latest figures) turn open;
   4. glitch-in: a method section arrives in a short monochrome glitch, then holds still;
   5. slot-roll: the spec headings (and the closing band's) roll down into place like a slot machine reel.
   The pre-entrance state exists only under html.js (server CSS keeps everything visible with scripts off), and reduced
   motion shows every section in place at once. Only transform, opacity, clip-path and filter move: nothing reflows. */
import type React from 'react';
import type { ReactNode } from 'react';
import { useEffect, useRef } from 'react';
import './entrances.css';

const calm = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

/* mark the element [data-in] once it is `amount` on screen (at once for reduced motion); before() runs first */
export function useEnter(ref: React.RefObject<HTMLDivElement | null> | React.RefObject<null>, amount = 0.3, before) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (before) before(el);
    if (calm()) { el.setAttribute('data-in', ''); return; }
    // a section taller than the screen can never be 30% visible: then a third of the screen is enough
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      const r = e.intersectionRect.height;
      if (e.intersectionRatio < amount && r < innerHeight * amount) return;
      el.setAttribute('data-in', '');
      io.disconnect();
    }, { threshold: [0, 0.1, 0.2, amount, 0.5] });
    io.observe(el);
    return () => io.disconnect();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
}

/* a section that enters one way: kind is the entrance's name in the map */
export function Enter({ as: Tag = 'section', kind, className = '', children, amount = 0.3, ...rest }) {
  const ref = useRef(null);
  useEnter(ref, amount);
  return (
    <Tag ref={ref} data-enter={kind} className={className} {...rest}>
      {children}
      {kind === 'blinds' && <span className="xbe-blinds" aria-hidden="true">{Array.from({ length: 9 }, (_, k) => <i key={k} style={{ '--k': k }} />)}</span>}
    </Tag>
  );
}

/* venetian-type: the words of the title are grouped into the lines they actually wrap to; every line (and every block
   after the title: crumb, lede, ask) takes the opposite side to the one before */
interface VenetianProps {
  className?: string;
  children?: ReactNode;
  [key: string]: unknown;
}
export function Venetian({ className = '', children, ...rest }: VenetianProps) {
  const ref = useRef<HTMLDivElement>(null);
  useEnter(ref, 0.3, (el) => {
    const words = [...el.querySelectorAll('.xbe-w')];
    let top = null, k = -1;
    words.forEach((w) => { if (w.offsetTop !== top) { top = w.offsetTop; k += 1; } w.style.setProperty('--k', k); w.style.setProperty('--x', (k % 2 ? 72 : -72) + 'px'); });
    [...el.querySelectorAll('.xbe-vl')].forEach((b) => { k += 1; b.style.setProperty('--k', k); b.style.setProperty('--x', (k % 2 ? 72 : -72) + 'px'); });
  });
  return <div ref={ref} data-enter="venetian-type" className={'xbe-vt ' + className} {...rest}>{children}</div>;
}
/* a heading's words as the lines venetian-type moves (the words themselves are the text: nothing is duplicated) */
export function VWords({ text }) {
  const words = String(text || '').split(/\s+/).filter(Boolean);
  return words.map((w, i) => <span key={i}><span className="xbe-w">{w}</span>{i < words.length - 1 ? ' ' : ''}</span>);
}

/* slot-roll: each word is a reel; two blurred copies ride above it and the reel rolls down until the word lands */
export function Slot({ text, as: Tag = 'span', className = '', ...rest }) {
  const words = String(text || '').split(/\s+/).filter(Boolean);
  return (
    <Tag className={'xbe-slot ' + className} {...rest}>
      <span className="x-sr">{text}</span>
      <span aria-hidden="true">
        {words.map((w, i) => (
          <span key={i}>
            <span className="xbe-reel-m"><span className="xbe-reel" style={{ '--i': i }}>{w}<span className="xbe-ghost g1">{w}</span><span className="xbe-ghost g2">{w}</span></span></span>
            {i < words.length - 1 ? ' ' : ''}
          </span>
        ))}
      </span>
    </Tag>
  );
}
