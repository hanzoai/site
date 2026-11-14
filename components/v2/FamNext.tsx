'use client';
/* FamNext (Families A kit): the siblings, as cards that open into their page (synchronized.studio). Each card is a big
   in-site link whose title carries data-morph, so the Morph layer flies it into the next page's hero
   (data-morph-target there). Each card wears its sibling's own still contour (Sigil seeded with its slug), in ink.
   Motion that is not scroll: on a mouse the rail drags with inertia (it keeps gliding after you let go, then eases to
   rest) and a card you hover lifts and shows its own line (preview, Hanzo's words). Phones swipe it natively.
   PLAN-COMPONENTS 2.15: at most 6 siblings, one tab stop per card. Nothing floats over content (MASTER.md): the rail
   opts out of the site's cursor label (data-cursor="").
   How to use it:
   - <FamNext items={[{ href, title, preview, meta, seed, data, dir }]} label="Benchmarks" />;
   - dir: 'prev' | 'next' draws an arrow (its name from the UI register) instead of a word; title and preview are
     Hanzo's own strings. */
import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import { A } from '../kit';
import Sigil from '../Sigil';
import { ui } from './famUi';

const Arrow = ({ back }: { back?: boolean }) => (
  <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" style={back ? { transform: 'scaleX(-1)' } : undefined}><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

/* drag to scroll on a fine pointer, with inertia; a drag never fires the card's click */
function useDragRail(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !matchMedia('(pointer: fine)').matches) return;
    const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let down: { x: number; l: number; t: number } | null = null, v = 0, raf = 0, moved = false;
    el.classList.add('drag');
    const glide = () => {
      if (Math.abs(v) < 0.4) return;
      el.scrollLeft -= v;
      v *= 0.94;
      raf = requestAnimationFrame(glide);
    };
    const pd = (e: PointerEvent) => {
      if (e.button !== 0 || el.scrollWidth <= el.clientWidth + 4) return;
      cancelAnimationFrame(raf);
      down = { x: e.clientX, l: el.scrollLeft, t: performance.now() };
      v = 0; moved = false;
    };
    const pm = (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - down.x;
      if (!moved && Math.abs(dx) < 6) return;
      if (!moved) { moved = true; el.classList.add('held'); el.setPointerCapture?.(e.pointerId); }
      const now = performance.now();
      const step = el.scrollLeft;
      el.scrollLeft = down.l - dx;
      v = (step - el.scrollLeft) / Math.max(1, (now - (down.t || now)) / 16);
      down.t = now;
      e.preventDefault();
    };
    const pu = () => {
      if (!down) return;
      down = null;
      el.classList.remove('held');
      if (moved && !calm) raf = requestAnimationFrame(glide);
    };
    const click = (e: MouseEvent) => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } };
    el.addEventListener('pointerdown', pd);
    addEventListener('pointermove', pm, { passive: false });
    addEventListener('pointerup', pu);
    el.addEventListener('click', click, true);
    el.addEventListener('dragstart', (e) => e.preventDefault());
    return () => { cancelAnimationFrame(raf); el.removeEventListener('pointerdown', pd); removeEventListener('pointermove', pm); removeEventListener('pointerup', pu); el.removeEventListener('click', click, true); el.classList.remove('drag'); };
  }, [ref]);
}

interface FamNextItem {
  href: string;
  title: string;
  preview?: string;
  meta?: string;
  seed?: string;
  data?: number[];
  dir?: 'prev' | 'next';
}

interface FamNextProps {
  items?: readonly FamNextItem[];
  label?: string;
  className?: string;
}

export default function FamNext({ items, label, className = '' }: FamNextProps) {
  const ref = useRef<HTMLElement>(null);
  useDragRail(ref);
  if (!items || !items.length) return null;
  return (
    <nav ref={ref} className={'v2f-next ' + className} aria-label={label} data-swipe-own data-drag="" data-cursor="">
      {items.slice(0, 6).map((it) => (
        <A key={it.href} to={it.href} className="v2f-next-c" aria-label={it.dir ? ui(it.dir === 'prev' ? 'previous' : 'next') + ': ' + it.title : undefined} draggable={false}>
          {it.seed && <span className="v2f-next-s" aria-hidden="true"><Sigil seed={it.seed} data={it.data || []} still /></span>}
          <span>
            <span className="v2f-next-t" data-morph style={{ display: 'block' }}>{it.title}</span>
            {it.preview && <span className="v2f-next-p">{it.preview}</span>}
          </span>
          <span className="v2f-next-m">
            <span>{it.meta}</span>
            <span className="v2f-next-go" aria-hidden="true"><Arrow back={it.dir === 'prev'} /></span>
          </span>
        </A>
      ))}
    </nav>
  );
}
