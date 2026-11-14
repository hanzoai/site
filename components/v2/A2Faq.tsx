'use client';
/* A2Faq — questions that open in place, one at a time, with no fade-ups (Apps 2 chat; styles in A2.css).
   Usage: <A2Faq items={[['Question?', 'Answer.'], …]} dark={false} first={0} />
   Each row is a real button with aria-expanded; the answer grows from 0fr to 1fr (no height animation), and every
   answer stays in the HTML (closed ones are collapsed and inert). */
import { useState } from 'react';
import type { ReactNode } from 'react';

interface A2FaqProps {
  items: ReadonlyArray<readonly [string, ReactNode]>;
  dark?: boolean;
  first?: number;
}

export default function A2Faq({ items, dark, first = 0 }: A2FaqProps) {
  const [open, setOpen] = useState(first);
  return (
    <ul className={'a2-faq' + (dark ? ' dark' : '')}>
      {items.map(([q, a], i) => (
        <li key={q} className={open === i ? 'on' : ''}>
          <h3><button type="button" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}><span>{q}</span><i aria-hidden="true" /></button></h3>
          <div className="a2-faq-a" aria-hidden={open !== i} inert={open !== i}><div>{a}</div></div>
        </li>
      ))}
    </ul>
  );
}
