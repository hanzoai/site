'use client';
/* x-tender/Terminal: the clock under the two live terminals (/computer and /download). Only timing lives here; each
   page draws its own terminal, in its own look.
   Usage:
     const t = useRun(beats, { on, calm, runKey });
       beats  = an array of delays in ms, one per beat (a typed character, a streamed word, a filled bar: the page decides)
       on     = false while the terminal is off screen or paused: the clock holds where it is and resumes
       calm   = reduced motion: jumps to the last beat (the static final state)
       runKey = change it to start a new run from beat 0 (a new command)
     returns how many beats have played (0 .. beats.length). Server and first client render both return 0.
     <Shown text={s} n={k} ghost="cls" /> prints the first k characters and keeps the rest in the HTML in a span with
     the ghost class (the page makes it visibility: hidden under .js), so a line never reflows while it types and every
     word stays in the page. */
import { useEffect, useState } from 'react';

export function useRun(beats, { on, calm, runKey }) {
  const total = beats.length;
  const [t, setT] = useState(0);
  useEffect(() => { setT(calm ? total : 0); }, [runKey, calm, total]);
  useEffect(() => {
    if (!on || calm || t >= total) return undefined;
    const id = setTimeout(() => setT((v) => Math.min(total, v + 1)), beats[t] || 0);
    return () => clearTimeout(id);
  }, [t, on, calm, total, runKey]); // eslint-disable-line react-hooks/exhaustive-deps
  return t;
}

export function Shown({ text, n, ghost, caret }) {
  const k = Math.max(0, Math.min(text.length, n));
  return (
    <>
      {text.slice(0, k)}
      {caret}
      {k < text.length && <span className={ghost}>{text.slice(k)}</span>}
    </>
  );
}
