'use client';
/* ClipWipe: a scene change (VISION motion 7). The next room opens out of a rounded window into full bleed the moment
   you arrive at it: one timed wipe (0.9s, in-out), played once, not tied to the scroll position, so a page's motion
   is not all scroll (JAMES 9). Use it for the page's one dark room.
   Usage: <ClipWipe dark className="my-room"> …section content… </ClipWipe>
   - dark: the room is ink (and the header turns dark over it); otherwise pass a background through className/--wipe.
   - Content inside is ordinary flow; the wipe moves only the room's backdrop. The window starts 14px in from each side
     and 5% down, so text set 24px from the edge is always inside it.
   - JS off or reduced motion: the room is simply open. It makes no stacking context, so a SpecDrawer sheet inside it
     still rises above the header. Owned by Cloud 3. */
import { useEffect, useRef, useState } from 'react';
import './LaunchType.css';
import './ClipWipe.css';

export default function ClipWipe({ children, dark, className = '', id, ...rest }) {
  const ref = useRef(null);
  const [st, setSt] = useState('open'); // open (server, JS off) → armed (below the fold) → play
  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (el.getBoundingClientRect().top < innerHeight * 0.8) return;
    setSt('armed');
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSt('play'); io.disconnect(); } }, { threshold: 0.18 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <section ref={ref} id={id} className={`lx-wipe ${dark ? 'lx-dark' : ''} ${className}`} data-room={dark ? 'dark' : undefined} data-wipe={st} {...rest}>
      <div className="lx-wipe-bg" aria-hidden="true" />
      <div className="lx-wipe-in">{children}</div>
    </section>
  );
}
