'use client';
/* KeynoteRoom: the page's one dark room, arriving as a scene change (VISION motion 7). As the section scrolls in, the
   dark opens out of a rounded window to the full width of the screen (a scrubbed clip-path), so there is never a hard
   section edge. The header turns dark over it (data-room="dark"). Owned by the Cloud 1 chat.
   Usage: <KeynoteRoom className="my-room">…your section content (light text)…</KeynoteRoom>
   - from: the starting window as [top/bottom %, left/right %, radius px], default [6, 7, 48].
   - tone: the room's colour, default near-black. Use at most one per page.
   Reduced motion: the room is simply full width. */
import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion, useMotionTemplate } from 'motion/react';
import { useWide } from './KeynoteChapters';
import './Keynote.css';

export default function KeynoteRoom({ children, className = '', from = [6, 7, 48], tone = '#0a0a0b', id }) {
  const ref = useRef(null);
  const calm = useReducedMotion();
  const wide = useWide();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start end', 'start 15%'] });
  const v = useTransform(p, [0, 1], [wide ? from[0] : 2, 0], { clamp: true });
  const h = useTransform(p, [0, 1], [wide ? from[1] : 3, 0], { clamp: true });
  const r = useTransform(p, [0, 1], [wide ? from[2] : 24, 0], { clamp: true });
  const clip = useMotionTemplate`inset(${v}% ${h}% ${v}% ${h}% round ${r}px)`;
  return (
    <section ref={ref} id={id} className={'knr ' + className} data-room="dark" style={{ position: 'relative', color: '#f5f5f7', isolation: 'isolate' }}>
      <motion.div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: tone, zIndex: -1, clipPath: calm ? 'none' : clip }} />
      {children}
    </section>
  );
}
