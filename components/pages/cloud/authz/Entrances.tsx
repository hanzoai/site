'use client';
/* Authz's five section entrances (MOTION-MAP rule 7, in the map's order): curtain-rise (the spotlight room),
   vertical-ticker (tech specs), slot-roll (delegate it yourself), inertia-drag (related + console), spiral-in (the
   close). Each plays once, in CSS (Entrances.css), when its section is first a quarter seen: the wrapper gets
   data-in. The final state is the written state; the start state applies only under html.js and before data-in, and
   never under reduced motion, so JS-off and server HTML show every section standing. */
import type { HTMLAttributes, ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import './Entrances.css';

interface EnterProps extends HTMLAttributes<HTMLElement> {
  kind: string;
  as?: 'div' | 'section';
  className?: string;
  children: ReactNode;
  amount?: number;
}
export default function Enter({ kind, as: Tag = 'div', className = '', children, amount = 0.25, ...rest }: EnterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [inn, setIn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') { setIn(true); return; }
    /* fires when the section's top has come a quarter of the way up the screen (works for sections taller than it) */
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setIn(true); io.disconnect(); } }, { threshold: 0, rootMargin: `0px 0px -${Math.round(amount * 100)}% 0px` });
    io.observe(el);
    return () => io.disconnect();
  }, [amount]);
  return (
    <Tag ref={ref} className={'az-in az-in-' + kind + (className ? ' ' + className : '')} data-in={inn ? '' : undefined} {...rest}>
      {children}
    </Tag>
  );
}
