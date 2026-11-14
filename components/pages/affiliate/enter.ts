'use client';
/* /affiliate entrances (docs/MOTION-MAP.md, in page order): depth-parallax (hero), focus-pull-scroll (the link band),
   iris (the one-question flow), noise-dissolve (the dark rule room), glitch-in (the close). Styles in enter.css.
   - The hero and the link band are in the first screen at both sizes, so their arrival runs in CSS from the first
     paint (no hidden server state, nothing to wait for). After that, the hero's layers keep their depths as you
     scroll away (each drifts at its own speed) and the link's background softens while the link stays sharp.
   - The three below the fold hide their start state only under `.xaf-enter`, a class added here after mount (server
     and client render the same markup, and JS off shows everything). One IntersectionObserver plays each once at ~25%.
   - Reduced motion: no class, no listeners, every section in its final state. */
import type React from 'react';
import { useEffect } from 'react';

export function useEntrances(root: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const main = root.current;
    if (!main || typeof IntersectionObserver === 'undefined') return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    main.classList.add('xaf-enter');
    const late = [...main.querySelectorAll('[data-enter="iris"], [data-enter="noise"], [data-enter="glitch"]')];
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.setAttribute('data-in', ''); // an attribute, not a class: React re-sets className on re-render
        io.unobserve(e.target);
      });
    }, { threshold: 0.25 });
    late.forEach((el) => io.observe(el));

    // depth-parallax and focus-pull, scroll-linked once they have arrived: the hero's three layers drift at their own
    // speeds as you scroll, and the hero (now the background) goes soft while the link band rises into focus
    const hero = main.querySelector('[data-enter="depth"]');
    let raf = 0;
    const paint = () => {
      raf = 0;
      if (hero) hero.style.setProperty('--xaf-sy', Math.min(scrollY, innerHeight).toFixed(1));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(paint); };
    addEventListener('scroll', onScroll, { passive: true });
    paint();
    return () => {
      io.disconnect();
      removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
      main.classList.remove('xaf-enter');
    };
  }, [root]);
}
