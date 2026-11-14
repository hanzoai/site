'use client';
/* /blog's signature, word-light (docs/MOTION-MAP.md): the masthead's own lede lights word by word at a reading pace, from
   grey to ink, from the first paint (CSS, no wait for scripts). A hand takes over the reading:
   - pointer: the words light up to the one under the pointer; leaving reads it again from the start;
   - touch: a tap reads it again;
   - keyboard: the lede is focusable; focus reads it again, and the arrow keys move the light a word at a time.
   Reduced motion and JS off: every word in ink at once. The words are Hanzo's, unchanged.
   A replay swaps the animation's name (.again), which restarts it without remounting (focus stays put). */
import type React from 'react';
import { Fragment, useState } from 'react';

interface WordLightProps {
  text: string;
  lead?: React.ReactNode;
  className?: string;
  label?: string;
}
export default function WordLight({ text, lead, className = '', label }: WordLightProps) {
  const words = text.split(' ');
  const [upto, setUpto] = useState<number | null>(null);
  const [run, setRun] = useState(0);
  const replay = () => { setUpto(null); setRun((r) => r + 1); };
  const at = (e: React.PointerEvent<HTMLParagraphElement>) => { const w = (e.target as Element).closest?.<HTMLElement>('.xbl-w'); if (w) setUpto(Number(w.dataset.i)); };
  const key = (e: React.KeyboardEvent<HTMLParagraphElement>) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    setUpto((u) => Math.max(0, Math.min(words.length - 1, (u ?? -1) + (e.key === 'ArrowRight' ? 1 : -1))));
  };
  return (
    <p
      className={className + ' xbl-wl' + (run % 2 ? ' again' : '') + (upto != null ? ' hand' : '')}
      tabIndex={0}
      aria-label={label}
      onPointerMove={(e) => { if (e.pointerType === 'mouse') at(e); }}
      onPointerLeave={(e) => { if (e.pointerType === 'mouse' && upto != null) replay(); }}
      onClick={(e) => { if ((e.nativeEvent as PointerEvent).pointerType !== 'mouse') replay(); }}
      onFocus={(e) => { if (upto == null && e.target.matches(':focus-visible')) setRun((r) => r + 1); }}
      onKeyDown={key}
    >
      {lead}
      {words.map((w, i) => (
        <Fragment key={i}>{i || lead ? ' ' : ''}<span className={'xbl-w' + (upto != null && i <= upto ? ' lit' : '')} data-i={i} style={{ '--w': i }}>{w}</span></Fragment>
      ))}
    </p>
  );
}
