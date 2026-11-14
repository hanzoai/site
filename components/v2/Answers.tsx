'use client';
/* Answers (v2): questions that open in place, and nothing else moves.
   Usage:
     import Answers from '../v2/Answers';
     <Answers items={[[question, answer], ...]} />            // answer can be a string or JSX with links
     <Answers items={qa} start={-1} dark />                   // start closed; on a dark room
   - One answer open at a time (the first by default). Every answer stays in the HTML, collapsed, for search engines,
     find-in-page and the parity check.
   - No entrance animation: the list sits still and reads. The only motion is the answer opening (360 ms, EASE) and the
     plus turning into a minus. Reduced motion opens it instantly (MotionConfig is global).
   - Real buttons with aria-expanded/aria-controls; the question is a heading so screen readers can jump between them.
   Owned by the Enterprise + Pricing chat (v2 wave 1). */
import { useId, useState } from 'react';
import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import './Answers.css';

const EASE = [0.16, 1, 0.3, 1] as const;

interface AnswersProps {
  items: ReadonlyArray<readonly [string, ReactNode]>;
  start?: number;
  dark?: boolean;
  className?: string;
}

export default function Answers({ items, start = 0, dark = false, className = '' }: AnswersProps) {
  const [open, setOpen] = useState(start);
  const id = useId();
  return (
    <ul className={'v2-ans' + (dark ? ' dark' : '') + (className ? ' ' + className : '')}>
      {items.map(([q, a], i) => {
        const on = open === i;
        return (
          <li key={q} className={on ? 'on' : undefined}>
            <h3>
              <button type="button" aria-expanded={on} aria-controls={id + i} onClick={() => setOpen(on ? -1 : i)}>
                <span>{q}</span>
                <i aria-hidden="true" />
              </button>
            </h3>
            <motion.div
              id={id + i}
              className="v2-ans-a"
              initial={false}
              animate={on ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
              transition={{ duration: 0.36, ease: EASE }}
              aria-hidden={!on}
              inert={!on}
            >
              <div>{a}</div>
            </motion.div>
          </li>
        );
      })}
    </ul>
  );
}
