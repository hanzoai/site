'use client';
/* LineMask (x-gauss): the line-masked cut-in for the Business 2 pages, now a thin wrapper over the shared CSS LineMask
   (components/v2/LineMask.jsx), so the words are painted by the server and the cut starts at first paint: never hidden
   until a script runs, visible with JS off, still under reduced motion.
   Usage: <LineMask as="h1" now lines={['One risk plane', 'for accounts,']} />  (now: a hero, plays at first paint;
          otherwise it plays the first time it is scrolled to). Lines keep a trailing space so the text reads whole.
   Owned by the Business 2 chat. */
import Shared from '../LineMask';

export default function LineMask({ as = 'h2', lines, className = '', now = false, delay = 0, id }) {
  const L = lines.map((t, i) => (i < lines.length - 1 ? t + ' ' : t));
  return <Shared as={as} id={id} className={className} lines={L} delay={delay} inView={!now} stagger={0.06} />;
}
