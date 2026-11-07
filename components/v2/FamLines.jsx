'use client';
/* FamLines (Families A kit): kinetic type. A heading whose words rise out of their own masks, once, in a 42 ms stagger.
   How to use it:
   - <FamLines as="h1" text={title} className="v2f-display" /> plays on load (hero headings; pure CSS, no flash);
   - play="view" plays when it first reaches the screen (headings further down); it never hides text that is already
     on screen, and reduced motion shows the words still.
   The full text is in the HTML once for readers (x-sr) and once as the masked words (aria-hidden). */
import { useEffect, useRef } from 'react';

export default function FamLines({ text, as: Tag = 'h2', className = '', play = 'load', delay = 0, ...rest }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (play !== 'view' || !el) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const r = el.getBoundingClientRect();
    if (r.top < innerHeight && r.bottom > 0) return; // already seen: leave it be
    el.setAttribute('data-wait', '');
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      el.removeAttribute('data-wait');
      el.setAttribute('data-in', '');
      io.disconnect();
    }, { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, [play]);
  const words = String(text || '').split(/\s+/).filter(Boolean);
  return (
    <Tag ref={ref} className={'v2f-lines ' + className} data-play={play} style={{ '--d': delay + 'ms' }} {...rest}>
      <span className="x-sr">{text}</span>
      <span aria-hidden="true">
        {words.map((w, i) => (
          <span key={i}>
            <span className="v2f-w"><span style={{ '--i': i }}>{w}</span></span>
            {i < words.length - 1 ? ' ' : ''}
          </span>
        ))}
      </span>
    </Tag>
  );
}
