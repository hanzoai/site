'use client';
/* useEnter (page-local to /mcp): plays one section entrance once, the first time the section reaches the screen.
   Server HTML and JavaScript-off show every section in its final place: the hidden start state is a class ('e-arm')
   added on the client only to sections still below the fold, so nothing visible ever blinks out. When the section
   enters view it gets 'e-go' (McpPage.css runs the move); after `ms` both classes leave and the section is its plain,
   true layout again. Reduced motion never arms. Usage: const ref = useRef(null); useEnter(ref, { ms: 1600 }). */
import { useEffect } from 'react';
import type { RefObject } from 'react';

interface EnterOptions { ms?: number; amount?: number; onGo?: (el: HTMLElement) => void }

export default function useEnter(ref: RefObject<HTMLElement | null>, { ms = 1600, amount = 0.2, onGo }: EnterOptions = {}) {
  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (el.getBoundingClientRect().top < innerHeight * 0.92) return; // already on screen at load: stays as it is
    el.classList.add('e-arm');
    let t: ReturnType<typeof setTimeout> | undefined;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      requestAnimationFrame(() => {
        el.classList.add('e-go');
        onGo?.(el);
        t = setTimeout(() => el.classList.remove('e-arm', 'e-go'), ms);
      });
    }, { threshold: amount });
    io.observe(el);
    return () => { io.disconnect(); clearTimeout(t); el.classList.remove('e-arm', 'e-go'); };
  }, [ref, ms, amount, onGo]);
}
