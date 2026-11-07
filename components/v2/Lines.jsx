'use client';
/* Lines (v2, owned by the Home chat): kinetic type. A heading whose lines rise out of a mask, once, when it reaches the
   screen (or straight away with `now`). You choose the line breaks, so each line is a strong one.
   Usage:
     import Lines from '../v2/Lines';
     <Lines as="h2" id="x-h" className="v2-headline" lines={['Faster where', 'the work happens.']} />
     <Lines as="h1" now delay={0.1} lines={[<span className="big">Pick all three.</span>]} />
   The full sentence is the heading's text (screen readers and search read it once, in order); reduced motion shows it
   still. Needs components/v2/system.css. */
import { motion } from 'motion/react';

const EASE = [0.16, 1, 0.3, 1];

export default function Lines({ as = 'h2', lines, className = '', id, now = false, delay = 0, stagger = 0.06, amount = 0.6, ...rest }) {
  const Tag = motion[as];
  // the same props on the server and in the browser, so hydration never leaves a line hidden
  const play = now ? { initial: 'h', animate: 's' } : { initial: 'h', whileInView: 's', viewport: { once: true, amount } };
  return (
    <Tag id={id} className={'v2-lines ' + className} {...play} variants={{ h: {}, s: { transition: { staggerChildren: stagger, delayChildren: delay } } }} {...rest}>
      {lines.map((l, i) => (
        <span className="v2-line" key={i}>
          <motion.span variants={{ h: { y: '108%' }, s: { y: '0%', transition: { duration: 0.7, ease: EASE } } }}>{l}</motion.span>
          {i < lines.length - 1 ? ' ' : null}
        </span>
      ))}
    </Tag>
  );
}
