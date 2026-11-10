'use client';
/* Demo pause (Cloud 4 chat; used by the Cloud 4 pages' self-running objects).
   WCAG 2.2.2 / PLAN-COMPONENTS 2.12: anything that moves by itself for more than 5 s carries a pause control, first in its
   object's DOM, 44 px, aria-pressed. Usage:
     const [ref, run, calm, paused, toggle] = useDemo(0.05);   // run: on screen, motion allowed, not paused
     <div ref={ref}><PauseBtn paused={paused} onClick={toggle} />…</div>
   amount is how much of the object must be on screen before it runs (low, so a hero object half under the fold starts on
   arrival). Under reduced motion run is false and the object shows its final state. */
import { useEffect, useRef, useState } from 'react';
import { useInView } from 'motion/react';
import { useCalm } from '../../ui';

export function useDemo(amount = 0.05) {
  const ref = useRef(null);
  const seen = useInView(ref, { amount });
  const calm = useCalm();
  const [paused, setPaused] = useState(false);
  return [ref, seen && !calm && !paused, calm, paused, () => setPaused((p) => !p)];
}

export function PauseBtn({ paused, onClick, className = '' }) {
  return (
    <button type="button" className={'l2-pause ' + className} aria-pressed={paused} aria-label="Pause" onClick={onClick}>
      {paused
        ? <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M5 3.5v9l7-4.5z" fill="currentColor" /></svg>
        : <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M5 3.5h2v9H5zM9 3.5h2v9H9z" fill="currentColor" /></svg>}
    </button>
  );
}

/* Calls fn every ms while run is true, by a chain of timeouts (no interval), with the latest fn. */
export function useTick(ms, run, fn) {
  const f = useRef(fn);
  f.current = fn;
  useEffect(() => {
    if (!run) return;
    let t = 0;
    const step = () => { f.current(); t = setTimeout(step, ms); };
    t = setTimeout(step, ms);
    return () => clearTimeout(t);
  }, [ms, run]);
}
