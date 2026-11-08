'use client';
/* FamRoom (Families A kit): a dark room (graphite #171717 or black), as docs/build-notes/MASTER.md sets it: it enters as a rounded
   card inside the gutters and opens to full width as it is reached (clip-path only, scrubbed by scroll, so nothing
   reflows). At most 2 dark rooms per page, never back to back. Reduced motion shows it open.
   How to use it:
   - <FamRoom className="my-dark-section" aria-label="…">…</FamRoom> in place of <section data-room="dark">;
   - tone: 'graphite' (default) or 'black'; the class you pass sets padding and layout. */
import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';

export default function FamRoom({ children, className = '', tone = 'graphite', ...rest }) {
  const ref = useRef(null);
  const calm = useReducedMotion();
  const [on, setOn] = useState(false); // after hydration only: the server paints the room open
  useEffect(() => setOn(!calm), [calm]);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start 0.35'] });
  const side = useTransform(scrollYProgress, [0, 1], ['clamp(16px, 4vw, 32px)', '0px'], { clamp: true });
  const r = useTransform(scrollYProgress, [0, 1], [24, 0], { clamp: true });
  const clip = useTransform(() => `inset(0 ${side.get()} 0 ${side.get()} round ${r.get()}px)`);
  return (
    <motion.section ref={ref} data-room="dark" className={'v2f-room ' + tone + ' ' + className} style={on ? { clipPath: clip } : undefined} {...rest}>
      {children}
    </motion.section>
  );
}
