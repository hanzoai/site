'use client';
/* /dev's own section entrances (MOTION-MAP.md: stack-drop, letter-cascade, pendulum, slot-roll, zoom-through, in that
   order down the page). Page-local on purpose: no other page shares them.
   - <In kind="stack-drop">…</In> marks its block once a fifth of it is on screen (data-in); DevPage.css plays that
     kind's entrance then, once. Before that the entrance waits on its first frame (a paused CSS animation), so the
     server HTML is the final state: JS off and reduced motion show everything at rest.
   - <Cascade text="…" /> and <Roll text="…" /> split a heading into letters for letter-cascade and slot-roll; the full
     words stay in the HTML once for readers (x-sr) and the letters are aria-hidden. */
import { useRef } from 'react';
import type { ElementType, HTMLAttributes, RefObject } from 'react';
import { useInView } from 'motion/react';

interface InProps extends HTMLAttributes<HTMLElement> {
  kind: string;
  as?: ElementType;
  amount?: number;
  boxRef?: RefObject<HTMLElement | null>;
}


export function In({ kind, as: Tag = 'div', className = '', amount = 0.2, boxRef, children, ...rest }: InProps) {
  const own = useRef<HTMLElement>(null);
  const ref = boxRef || own; // a block that already has a ref (the race board's demo) lends it
  const seen = useInView(ref, { once: true, amount });
  // data-play too: the small CSS scenes inside a block (the Gen harness, the places' mini UIs) start with its entrance
  return <Tag ref={ref} className={('xdv-in ' + className).trim()} data-k={kind} data-in={seen ? '' : undefined} data-play={seen ? '' : undefined} {...rest}>{children}</Tag>;
}

/* letters grouped by word (a word never breaks across lines), each letter numbered across the whole text */
const letters = (text: string, cls: string) => {
  let c = 0;
  return text.split(' ').map((w, wi) => (
    <span key={wi} aria-hidden="true">
      {wi > 0 && ' '}
      <span className="xdv-w">{[...w].map((ch) => { const i = c++; return <span key={i} className={cls} style={{ '--c': i }}><span>{ch}</span></span>; })}</span>
    </span>
  ));
};

export function Cascade({ text }: { text: string }) {
  return <><span className="x-sr">{text}</span>{letters(text, 'xdv-lc')}</>;
}

export function Roll({ text }: { text: string }) {

  return <><span className="x-sr">{text}</span>{letters(text, 'xdv-sr')}</>;
}
