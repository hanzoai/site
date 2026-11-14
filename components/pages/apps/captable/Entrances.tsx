'use client';
/* /captable's five section entrances (MOTION-MAP rule 7), page-local.
   useEnter: the section stands in its final state in the server HTML. After mount, only if it is still below the
   fold and motion is allowed, it is "armed" (its CSS start state, see Captable.css [data-e]); when it first comes into
   view it goes "in" and its CSS transition plays once (<= 900ms). Transform, clip-path, filter and opacity only.
   CountTo: count-roll. The figure counts from 0 to its value once, when it first comes into view. */
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { animate } from 'motion/react';

const calm = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
const below = (el: Element) => el.getBoundingClientRect().top > innerHeight * 0.92;

function whenSeen(el: Element, amount: number, fn: () => void) {
  const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { io.disconnect(); fn(); } }, { threshold: amount });
  io.observe(el);
  return () => io.disconnect();
}

export function useEnter<T extends HTMLElement = HTMLElement>(amount = 0.2) {
  const ref = useRef<T>(null);
  const [state, setState] = useState<'armed' | 'in' | undefined>(undefined);
  useEffect(() => {
    const el = ref.current;
    if (!el || calm() || !below(el)) return;
    setState('armed');
    return whenSeen(el, amount, () => setState('in'));
  }, [amount]);
  return [ref, state] as const;
}

interface CountToProps {
  value: number;
  prefix?: string;
  render: (text: string) => ReactNode;
}
export function CountTo({ value, prefix = '', render }: CountToProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(value);
  useEffect(() => {
    const el = ref.current;
    if (!el || calm() || !below(el)) return;
    setN(0);
    let ctl: ReturnType<typeof animate> | undefined;
    const stop = whenSeen(el, 0.5, () => { ctl = animate(0, value, { duration: 0.85, ease: [0.16, 1, 0.3, 1], onUpdate: (v: number) => setN(Math.round(v)) }); });
    return () => { stop(); ctl?.stop(); };
  }, [value]);
  return <span ref={ref} className="ct-count">{render(prefix + n)}</span>;
}
