'use client';
/* ClipWipe: a scene change (VISION motion 7). The next room opens out of a rounded window into full bleed as you scroll
   in, a clip-path wipe scrubbed to scroll, so there is never a hard section edge. Use it for the page's one dark room.
   Usage: <ClipWipe dark className="my-room"> …section content… </ClipWipe>
   - dark: the room is ink (and the header turns dark over it); otherwise pass a background through className.
   - Content inside is ordinary flow; the wipe moves only the room's backdrop. Reduced motion shows it open.
   - It makes no stacking context, so a SpecDrawer sheet inside it still rises above the header. Owned by Cloud 3. */
import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';
import './LaunchType.css';
import './ClipWipe.css';

export default function ClipWipe({ children, dark, className = '', id, ...rest }) {
  const ref = useRef(null);
  const calm = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start start'] });
  // the window starts 14px in from each side and 5% down, so text set 24px from the edge is always inside it
  const x = useTransform(scrollYProgress, [0, 0.85], [14, 0], { clamp: true });
  const y = useTransform(scrollYProgress, [0, 0.85], [5, 0], { clamp: true });
  const r = useTransform(scrollYProgress, [0, 0.85], [44, 0], { clamp: true });
  const clipPath = useTransform([x, y, r], ([a, t, b]) => `inset(${t}% ${a}px 0 round ${b}px)`);
  return (
    <section ref={ref} id={id} className={`lx-wipe ${dark ? 'lx-dark' : ''} ${className}`} data-room={dark ? 'dark' : undefined} {...rest}>
      <motion.div className="lx-wipe-bg" aria-hidden="true" style={calm ? undefined : { clipPath }} />
      <div className="lx-wipe-in">{children}</div>
    </section>
  );
}
