'use client';
/* The dots and the one-line pitch under the hero's deck of devices on a phone (app/globals.css `.x-hero-stage` is the scroller). They
   follow its scroll and move it only through `scrollTo`; the clock turns a slide while the deck is on screen and the tab in front,
   waits after a touch, and does not run under reduced motion or where the stage is not a scroller. */
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
