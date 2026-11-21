'use client';
/* The hero's three devices on a phone are a deck you swipe (app/globals.css `.x-deck`, components/home/demo.css): the stage
   is the scroller, snapping one slide at a time. This draws the dots under it and says what the slide in view is for. It
   follows the scroll (a swipe, a tap on a dot, the clock) and moves nothing itself but through `scrollTo`. The clock turns
   a slide every few seconds while the deck is on screen and the tab is in front, waits ten seconds after a touch, and does
   not run under reduced motion or when the stage is not a scroller (a wider screen). */
import { useEffect, useRef, useState, type RefObject } from 'react';
import { useReducedMotion } from 'motion/react';

const SLIDES = [
  { id: 'app', label: 'Hanzo App', line: 'Chat, Dev, Design and Studio in one app' },
  { id: 'phone', label: 'Hanzo on your phone', line: 'The same Hanzo, in your pocket' },
  { id: 'cli', label: 'Hanzo in your terminal', line: 'hanzo dev: ship from the command line' },
] as const;
const EVERY = 4600;
const HOLD = 10000;

export default function Deck({ stage }: { stage: RefObject<HTMLDivElement | null> }) {
  const calm = useReducedMotion();
  const [at, setAt] = useState(0);
  const idx = useRef(0);
  const hold = useRef(0);
  const seen = useRef(true);

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const span = () => Math.max(1, (el.scrollWidth - el.clientWidth) / (SLIDES.length - 1));
    const scroller = () => el.scrollWidth > el.clientWidth + 8;
    const read = () => {
      if (!scroller()) return;
      const i = Math.min(SLIDES.length - 1, Math.max(0, Math.round(el.scrollLeft / span())));
      if (i !== idx.current) { idx.current = i; setAt(i); }
    };
    const touch = () => { hold.current = Date.now() + HOLD; };
    el.addEventListener('scroll', read, { passive: true });
    el.addEventListener('pointerdown', touch, { passive: true });
    el.addEventListener('wheel', touch, { passive: true });
    el.addEventListener('keydown', touch);
    const io = typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver(([e]) => { seen.current = !!e?.isIntersecting; }, { threshold: 0.6 });
    io?.observe(el);
    const t = calm ? 0 : window.setInterval(() => {
      if (!scroller() || !seen.current || document.hidden || Date.now() < hold.current) return;
      el.scrollTo({ left: ((idx.current + 1) % SLIDES.length) * span(), behavior: 'smooth' });
    }, EVERY);
    return () => {
      el.removeEventListener('scroll', read);
      el.removeEventListener('pointerdown', touch);
      el.removeEventListener('wheel', touch);
      el.removeEventListener('keydown', touch);
      io?.disconnect();
      if (t) clearInterval(t);
    };
  }, [stage, calm]);

  const go = (i: number) => {
    const el = stage.current;
    if (!el) return;
    hold.current = Date.now() + HOLD;
    el.scrollTo({ left: i * Math.max(1, (el.scrollWidth - el.clientWidth) / (SLIDES.length - 1)), behavior: calm ? 'auto' : 'smooth' });
  };

  return (
    <div className="x-deck">
      <div className="x-deck-dots" role="group" aria-label="Hanzo on every screen">
        {SLIDES.map((s, i) => (
          <button key={s.id} type="button" className="x-deck-dot" aria-label={s.label} aria-current={i === at} onClick={() => go(i)} />
        ))}
      </div>
      <p className="x-deck-cap">{SLIDES[at]!.line}</p>
    </div>
  );
}
