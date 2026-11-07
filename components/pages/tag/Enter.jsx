'use client';
/* /tag's five entrances, page-local (docs/MOTION-MAP.md, /tag row), one per main section, in this order:
   letter-cascade (the h1), blinds (the see room), drop-in (the pull request), cover-slide (the rooms slide up over it),
   domino (the six built cards). Each is CSS keyframes switched by a state this file computes once the page is mounted:
   'done' on the server, with reduced motion, or for a section already scrolled past, so the server HTML is the final
   state (legible with JS off, no hydration mismatch); 'pre' while waiting below the fold; 'in' once it arrives. */
import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'motion/react';
import { P, useMounted } from './Art';

export function useArrive() {
  const ref = useRef(null);
  const mounted = useMounted();
  const calm = useReducedMotion();
  const seen = useInView(ref, { once: true, margin: '0px 0px -22% 0px' });
  const [past, setPast] = useState(false);
  useEffect(() => {
    const r = ref.current && ref.current.getBoundingClientRect();
    if (r && r.top < 0) setPast(true); // reloaded further down: it has already arrived
  }, []);
  return [ref, !mounted || calm || past ? 'done' : seen ? 'in' : 'pre'];
}

/* letter-cascade: the letters fall into place one by one. Screen readers get the line as words. */
export function Letters({ lines, id, className }) {
  let n = 0;
  return (
    <h1 id={id} className={className}>
      <span className={`${P}-sr`}>{lines.join(' ')}</span>
      <span className={`${P}-lc`} aria-hidden="true">
        {lines.map((l, i) => (
          <span key={i} className={`${P}-lc-l`}>
            {l.split(' ').map((w, j, all) => (
              <span key={j}>
                <span className={`${P}-lc-w`}>{[...w].map((c, k) => <span key={k} style={{ '--i': n++ }}>{c}</span>)}</span>
                {j < all.length - 1 ? ' ' : null}
              </span>
            ))}
          </span>
        ))}
      </span>
    </h1>
  );
}

/* blinds: venetian-blind strips in the page's paper turn edge-on, one after another, and open on the dark room. */
export function Blinds({ state, n = 9 }) {
  if (state === 'done') return null;
  return (
    <div className={`${P}-blinds`} data-s={state} aria-hidden="true">
      {Array.from({ length: n }, (_, i) => <i key={i} style={{ '--i': i }} />)}
    </div>
  );
}

/* cover-slide: the section before the rooms holds still once its foot reaches the bottom of the screen, and the rooms
   slide up over it. Its stick point is its own height above the screen's foot, measured on mount and on resize. */
export function useStick() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const set = () => el.style.setProperty('--stick', Math.min(0, window.innerHeight - el.offsetHeight) + 'px');
    set();
    const ro = new ResizeObserver(set);
    ro.observe(el);
    window.addEventListener('resize', set);
    return () => { ro.disconnect(); window.removeEventListener('resize', set); };
  }, []);
  return ref;
}
