'use client';
/* /telemetry's entrances: one in-view switch. Each section sets data-in once it is reached; its own CSS (Telemetry.css,
   one entrance per section, never shared) plays from the pre-entry state under html.js to the final state. JS off,
   reduced motion and the server HTML show the final state. Page-local. */
import { useEffect, useRef, useState } from 'react';

export function useEnter(amount = 0.25) {
  const ref = useRef(null);
  const [inn, setIn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setIn(true); io.disconnect(); } }, { threshold: amount });
    io.observe(el);
    return () => io.disconnect();
  }, [amount]);
  return [ref, inn ? '' : undefined];
}
