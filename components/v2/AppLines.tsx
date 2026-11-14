'use client';
/* AppLines: v2 kinetic type for the Apps launch pages (/chat, /dev, /agents). Owner: the Wave 1 Apps chat.
   Usage:
     <AppLines as="h1" id="x-h1" className="v2a-display" lines={['Ask anything.', 'Enso picks the model.']} soft={[1]} />
     <AppLines as="h2" lines={['Kai decides.', 'Dev does.']} view />      // plays when it reaches the screen
   Each line rises out of its own mask once (translateY 105% to 0, 700 ms, 60 ms apart, ease-emphasis). The heading itself is what is watched (a masked
   line is clipped, so it could never be "seen" on its own). The server HTML holds every word; reduced motion
   (MotionConfig "user", set site-wide) shows the lines at rest. `soft` lists the line indexes drawn in the faint ink.
   A line may be a string or a node (e.g. a figure wrapped in its own span). */
import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import { EASE } from '../ui';
import './AppLines.css';

const line = { h: { y: '105%' }, s: { y: 0, transition: { duration: 0.7, ease: EASE } } }; // MASTER part 3: 700 ms, 60 ms apart

interface AppLinesProps {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  lines: readonly ReactNode[];
  soft?: readonly number[];
  view?: boolean;
  delay?: number;
  className?: string;
  id?: string;
}

export default function AppLines({ as = 'h2', lines, soft = [], view = false, delay = 0, className = '', id }: AppLinesProps) {
  const Tag = motion[as];
  const play = { staggerChildren: 0.06, delayChildren: delay };
  const run = view
    ? { initial: 'h', whileInView: 's', viewport: { once: true, amount: 0.4 } }
    : { initial: 'h', animate: 's' };
  return (
    <Tag className={'v2a-lines ' + className} id={id} variants={{ h: {}, s: { transition: play } }} {...run}>
      {lines.map((l, i) => (
        <span key={i} className={'v2a-line' + (soft.includes(i) ? ' soft' : '')}>
          <motion.span className="v2a-line-in" variants={line}>{l}</motion.span>
          {i < lines.length - 1 ? ' ' : ''}
        </span>
      ))}
    </Tag>
  );
}
