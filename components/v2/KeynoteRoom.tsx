'use client';
/* KeynoteRoom: the page's one dark room, arriving as a scene change (VISION motion 7). As the section scrolls in, the
   dark opens out of a rounded window to the full width of the screen (a scrubbed clip-path), so there is never a hard
   section edge. The header turns dark over it (data-room="dark"). Owned by the Cloud 1 chat.
   Usage: <KeynoteRoom className="my-room">…your section content (light text)…</KeynoteRoom>
   - from: the starting window as [top/bottom %, left/right %, radius px], default [6, 7, 48].
   - tone: the room: graphite #171717 (code, ledgers; the default) or black #000 (art, the field). At most two per
     page, never back to back.
   Reduced motion: the room is simply full width. */
import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useReducedMotion, useMotionTemplate } from 'motion/react';
import { useWide } from './KeynoteChapters';
import './Keynote.css';

export default function KeynoteRoom({ children, className = '', from = [6, 7, 24], tone = '#171717', id }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const [calm, setCalm] = useState(false); // after mount, so the first render matches the server's HTML
  useEffect(() => setCalm(!!reduce), [reduce]);
  const wide = useWide();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start end', 'start 15%'] });
  const v = useTransform(p, [0, 1], [wide ? from[0] : 2, 0], { clamp: true });
  const h = useTransform(p, [0, 1], [wide ? from[1] : 3, 0], { clamp: true });
  const r = useTransform(p, [0, 1], [wide ? from[2] : 24, 0], { clamp: true });
  const clip = useMotionTemplate`inset(${v}% ${h}% ${v}% ${h}% round ${r}px)`;
  return (
    <section ref={ref} id={id} className={'knr ' + className} data-room="dark" style={{ position: 'relative', color: '#fafafa', isolation: 'isolate' }}>
      <motion.div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: tone, zIndex: -1, clipPath: calm ? 'none' : clip }} />
      {children}
    </section>
  );
}
