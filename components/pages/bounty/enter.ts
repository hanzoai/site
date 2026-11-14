/* /bounty's five entrances (docs/MOTION-MAP.md, in page order): conveyor (the one-question flow), fold-out (the four
   ways to earn), domino (the standings), blinds (the token race), typewriter (the closing band's headline).
   One IntersectionObserver plays each once when about a quarter of it is in view. The start states live in enter.css
   under `.xbe`, a class this hook puts on <main> after mount, so the server HTML, JS off and reduced motion all show
   the final state, and server and client render the same markup. */
import type React from 'react';
import { useEffect } from 'react';

// the typewriter needs each line's width and length, measured once on the client
function measureType(el: HTMLElement) {
  let at = 0;
  el.querySelectorAll<HTMLElement>('.xbo-tw').forEach((line) => {
    const inner = line.firstElementChild as HTMLElement | null;
    if (!inner) return;
    const n = Math.max(1, inner.textContent.length);
    const dur = n * 55;
    line.style.setProperty('--w', inner.offsetWidth + 'px');
    line.style.setProperty('--n', String(n));
    line.style.setProperty('--t', dur + 'ms');
    line.style.setProperty('--d', at + 'ms');
    at += dur + 220;
  });
}

export function useEnter(root: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const main = root.current;
    if (!main || typeof IntersectionObserver === 'undefined') return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const els = [...main.querySelectorAll<HTMLElement>('[data-enter]')];
    els.filter((el) => el.dataset.enter === 'typewriter').forEach(measureType);
    main.classList.add('xbe');
    const timers: ReturnType<typeof setTimeout>[] = [];
    const io = new IntersectionObserver((list) => {
      list.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target as HTMLElement;
        io.unobserve(el);
        el.classList.add('in');
        // blinds drop their mask once open, so nothing stays masked
        if (el.dataset.enter === 'blinds') timers.push(setTimeout(() => el.classList.add('done'), 1400));
      });
    }, { threshold: 0.25 });
    els.forEach((el) => io.observe(el));
    return () => { io.disconnect(); timers.forEach(clearTimeout); main.classList.remove('xbe'); };
  }, [root]);
}
