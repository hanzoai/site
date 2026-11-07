'use client';
/* AppDemo: the clock and the control for a live demo that runs by itself (PLAN-COMPONENTS 2.9 "Live demos", 2.12
   "Auto-moving content", BRIEF-v3 5.1 "the demo settles and does not loop"). Owner: the Wave 1 Apps chat.
   Used by the heroes of /chat, /dev and /agents.
   Usage:
     const demo = useDemo(box, async (sleep) => { ...await sleep(400)... }, { amount: 0.4 });
     <DemoCtl demo={demo} dark />            // first in the demo's DOM: a 44px icon button
   The script runs once when its box is at least `amount` in view, pauses while the tab is hidden or the box leaves the
   screen, and ends at rest on its final frame (no loop). `sleep(ms)` only counts time while the demo is playing, and
   throws STOP when the demo is replayed or unmounted. The control is Pause while playing (aria-pressed shows paused),
   then Replay once the script has ended. Reduced motion: the script is not run at all; render the final frame.
   Labels are aria-labels only ("Pause", "Replay", from the PLAN-COMPONENTS 0.6 register list), no visible words. */
import { useCallback, useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'motion/react';

export const STOP = Symbol('stop');

export function useDemo(box, script, { amount = 0.4 } = {}) {
  const seen = useInView(box, { amount });
  const calm = useReducedMotion();
  const [state, setState] = useState('idle'); // idle | play | pause | done
  const [go, setGo] = useState(false); // latched: the box has been seen once
  const [run, setRun] = useState(0);
  const paused = useRef(false);
  const away = useRef(true);
  const token = useRef(0);
  useEffect(() => { away.current = !seen; if (seen) setGo(true); }, [seen]);
  useEffect(() => {
    if (calm || !go) return;
    const id = ++token.current;
    paused.current = false;
    const sleep = (ms) => new Promise((ok, no) => {
      let left = ms, last = performance.now();
      const tick = () => {
        if (token.current !== id) { no(STOP); return; }
        const now = performance.now();
        const still = paused.current || away.current || document.hidden;
        if (!still) left -= now - last;
        last = now;
        if (left <= 0) ok(); else setTimeout(tick, still ? 120 : Math.min(left, 50));
      };
      setTimeout(tick, Math.min(ms, 50));
    });
    setState('play');
    (async () => {
      try { await script(sleep); if (token.current === id) setState('done'); } catch (e) { if (e !== STOP) throw e; }
    })();
    return () => { token.current++; };
  }, [run, calm, go]); // eslint-disable-line react-hooks/exhaustive-deps
  const toggle = useCallback(() => {
    if (state === 'done' || state === 'idle') { setRun((r) => r + 1); return; }
    paused.current = !paused.current;
    setState(paused.current ? 'pause' : 'play');
  }, [state]);
  // stop where it is (someone took the demo over); the control then offers Replay
  const stop = useCallback(() => { token.current++; setState('done'); }, []);
  const replay = useCallback(() => setRun((r) => r + 1), []);
  return { state, toggle, stop, replay, calm };
}

const ICON = {
  pause: <path d="M5.5 3.5v9M10.5 3.5v9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />,
  play: <path d="M5 3.2v9.6L12.6 8 5 3.2Z" fill="currentColor" />,
  replay: <path d="M13 8a5 5 0 1 1-1.6-3.7M13 2.5v3h-3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />,
};

export function DemoCtl({ demo, className = '' }) {
  if (demo.calm) return null;
  const done = demo.state === 'done' || demo.state === 'idle';
  const k = done ? 'replay' : demo.state === 'pause' ? 'play' : 'pause';
  return (
    <button type="button" className={'v2a-demo-ctl ' + className} onClick={demo.toggle} aria-label={done ? 'Replay' : 'Pause'} aria-pressed={done ? undefined : demo.state === 'pause'}>
      <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true">{ICON[k]}</svg>
    </button>
  );
}
