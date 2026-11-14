'use client';
/* /network's own entrances (docs/MOTION-MAP.md: split-merge, grow-from-point, typewriter, zoom-through, invert-flash).
   Page-local on purpose: each of the page's five sections arrives a different way, once, as it enters the screen.
   <Enter kind="grow" as="section" …> sets data-enter: 'rest' (server, JS off, reduced motion: the final state),
   'armed' (waiting below the fold), 'in' (playing, then resting). Network.css draws each kind.
   grow-from-point grows from the point the visitor last clicked or pointed at (the middle of the screen if none).
   <Typed text on /> types a line with a caret once `on` is true; the full words stay in the HTML and hold the layout. */
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { ElementType, HTMLAttributes, ReactNode, RefObject } from 'react';

const useIso = typeof window === 'undefined' ? useEffect : useLayoutEffect;
const last: { x: number | null; y: number | null; on: boolean } = { x: null, y: null, on: false };
function track() {
  if (last.on || typeof window === 'undefined') return;
  last.on = true;
  const f = (e: PointerEvent) => { last.x = e.clientX; last.y = e.clientY; };
  addEventListener('pointermove', f, { passive: true });
  addEventListener('pointerdown', f, { passive: true });
}

export function useEnter(ref: RefObject<HTMLElement | null>, threshold = 0.2) {
  const [st, setSt] = useState('rest');
  useIso(() => {
    const el = ref.current;
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    track();
    setSt('armed');
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      if (el.dataset.kind === 'grow') {
        const r = el.getBoundingClientRect();
        const px = last.x ?? innerWidth / 2, py = last.y ?? innerHeight / 2;
        el.style.setProperty('--ox', Math.round(px - r.left) + 'px');
        el.style.setProperty('--oy', Math.round(py - r.top) + 'px');
      }
      requestAnimationFrame(() => requestAnimationFrame(() => setSt('in')));
    }, { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold]);
  return st;
}

interface EnterProps extends HTMLAttributes<HTMLElement> {
  kind: string;
  as?: ElementType;
  threshold?: number;
  children?: ReactNode;
}

export function Enter({ kind, as: Tag = 'div', className = '', threshold, children, ...rest }: EnterProps) {
  const ref = useRef<HTMLElement>(null);
  const st = useEnter(ref, threshold);
  return <Tag ref={ref} className={`nw-en nw-en-${kind} ${className}`} data-kind={kind} data-enter={st} {...rest}>{children}</Tag>;
}

// types `text` once `on` turns true (about 45ms a letter); before that the line is empty but holds its size
interface TypedProps {
  text: string;
  on?: boolean;
  as?: ElementType;
  className?: string;
  id?: string;
}

export function Typed({ text, on, as: Tag = 'span', className = '', id }: TypedProps) {
  const [n, setN] = useState(text.length);
  const [armed, setArmed] = useState(false);
  useIso(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setArmed(true);
    setN(0);
  }, []);
  useEffect(() => {
    if (!armed || !on) return;
    if (n >= text.length) return;
    const t = setTimeout(() => setN(n + 1), n === 0 ? 180 : 45);
    return () => clearTimeout(t);
  }, [armed, on, n, text.length]);
  const typing = armed && n < text.length;
  return (
    <Tag className={'nw-typed ' + className} id={id} data-armed={armed || undefined}>
      <span className="nw-typed-ghost">{text}</span>
      <span className="nw-typed-on" aria-hidden="true">{text.slice(0, n)}<i className={'nw-caret' + (typing || (armed && on && n >= text.length) ? ' on' : '')} /></span>
    </Tag>
  );
}
