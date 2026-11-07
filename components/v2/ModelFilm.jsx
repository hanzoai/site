'use client';
/* ModelFilm (components/v2, owned by the Models chat). The kit's Film rules (poster first, nothing downloads until the
   clip nears the screen, plays only on screen with the tab visible, never under reduced motion or Data Saver), plus
   what the model pages need and the kit Film cannot do yet (request filed in docs/coverage/models.md):
   - `play`: the page decides which film is live (the lit tile, the active chapter, a hovered card);
   - a budget of two playing films on the whole page (PLAN-COMPONENTS 2.10, "max 2 playing"): a third waits its turn;
   - one page-wide pause for everything that moves by itself (WCAG 2.2.2): <FilmPause /> toggles every ModelFilm, and
     page loops read usePaused() to stop too.
   Usage:
     <ModelFilm slug="enso" play={lit === 'enso'} className="my-film" />   fills its box (object-fit: cover)
     <FilmPause />                                                          once per page, by the first moving film
     const paused = usePaused();                                            in any self-running loop on the page
     <Sigil still={paused} … />                                             a drifting field stops with it
     [data-mpaused] .my-loop { animation-play-state: paused; }              and so do CSS loops */
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { useReducedMotion } from 'motion/react';
import { media } from '../../lib/models';
import './ModelFilm.css';

const MAX = 2;
const playing = new Set();
const queue = [];
const wake = () => { while (playing.size < MAX && queue.length) queue.shift()(); };

let paused = false;
const subs = new Set();
const sub = (f) => { subs.add(f); return () => subs.delete(f); };
const setPaused = (v) => {
  paused = v;
  document.documentElement.toggleAttribute('data-mpaused', v); // CSS loops on the page stop too ([data-mpaused] …)
  subs.forEach((f) => f());
};
export const usePaused = () => useSyncExternalStore(sub, () => paused, () => false);

export default function ModelFilm({ slug, play = true, className = '', label }) {
  const ref = useRef(null);
  const [near, setNear] = useState(false);
  const [seen, setSeen] = useState(false);
  const calm = useReducedMotion();
  const stop = usePaused();
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setNear(true);
      setSeen(e.intersectionRatio > 0.15);
    }, { rootMargin: '300px 0px', threshold: [0, 0.15] });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    const v = ref.current;
    const want = play && seen && near && !calm && !stop && !navigator.connection?.saveData;
    let gone = false;
    const go = () => { if (gone || document.hidden) return; playing.add(v); v.play().catch(() => { playing.delete(v); wake(); }); };
    const halt = () => {
      v.pause();
      const i = queue.indexOf(go);
      if (i >= 0) queue.splice(i, 1);
      if (playing.delete(v)) wake();
    };
    if (want) { if (playing.size < MAX) go(); else queue.push(go); }
    const vis = () => { if (document.hidden) halt(); else if (want && playing.size < MAX) go(); };
    document.addEventListener('visibilitychange', vis);
    return () => { gone = true; document.removeEventListener('visibilitychange', vis); halt(); };
  }, [play, seen, near, calm, stop]);
  return (
    <video
      ref={ref}
      className={'v2-mfilm ' + className}
      poster={media(slug, 'webp')}
      muted
      loop
      playsInline
      preload="none"
      {...(label ? { 'aria-label': label } : { 'aria-hidden': true })}
    >
      {near && <source src={media(slug, 'webm')} type="video/webm" />}
    </video>
  );
}

/* The one pause for the page: icon only, its name in aria-label (PLAN-COMPONENTS 0.6: register strings stay icon-only
   until James approves the visible words). */
export function FilmPause({ className = '' }) {
  const p = usePaused();
  return (
    <button type="button" className={'v2-mpause ' + className} aria-pressed={p} aria-label={p ? 'Play' : 'Pause'} onClick={() => setPaused(!p)}>
      <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
        {p ? <path d="M4.5 3.2v9.6L12.6 8z" fill="currentColor" /> : <path d="M4.5 3.5h2.4v9H4.5zM9.1 3.5h2.4v9H9.1z" fill="currentColor" />}
      </svg>
    </button>
  );
}
