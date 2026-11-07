'use client';
/* FamLines (Families A kit): kinetic type. A heading whose words rise out of their own masks, once, in a 42 ms stagger.
   How to use it:
   - <FamLines as="h1" text={title} className="v2f-display" /> plays on load (hero headings; pure CSS, no flash);
   - play="view" plays when it first reaches the screen (headings further down); it never hides text that is already
     on screen, and reduced motion shows the words still.
   The full text is in the HTML once for readers (x-sr) and once as the masked words (aria-hidden).
   An h1 starts big and settles (MASTER.md, scale has rhythm): on a desktop it arrives as large as its column and the
   space above allow (up to 84px from its 52px rest) and settles to its rest over the first 360px of scroll
   (transform only; nothing reflows). settle={false} turns it off; phones and reduced motion keep it at rest. */
import { useEffect, useRef } from 'react';

/* the h1's arrival size: the largest scale that fits its column and the room above it, at most 84/52 */
function useSettle(ref, on) {
  useEffect(() => {
    const el = ref.current;
    if (!on || !el || matchMedia('(max-width: 900px), (prefers-reduced-motion: reduce)').matches) return;
    const words = el.querySelector('span[aria-hidden]');
    const fit = () => {
      const r = el.getBoundingClientRect(), w = words.getBoundingClientRect().width || 1, col = el.parentElement.getBoundingClientRect().width;
      const above = r.top + scrollY - 76; // room under the header
      return Math.max(1, Math.min(84 / 52, col / w, 1 + above / Math.max(1, r.height)));
    };
    let s0 = fit(), raf = 0;
    el.style.transformOrigin = '0% 100%';
    const set = () => { raf = 0; const p = Math.min(1, Math.max(0, scrollY / 360)); el.style.transform = 'scale(' + (1 + (s0 - 1) * (1 - p)).toFixed(4) + ')'; };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(set); };
    const onResize = () => { el.style.transform = ''; s0 = fit(); set(); };
    set();
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(raf); removeEventListener('scroll', onScroll); removeEventListener('resize', onResize); el.style.transform = ''; };
  }, [ref, on]);
}

export default function FamLines({ text, as: Tag = 'h2', className = '', play = 'load', delay = 0, settle = true, ...rest }) {
  const ref = useRef(null);
  useSettle(ref, settle && Tag === 'h1');
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
