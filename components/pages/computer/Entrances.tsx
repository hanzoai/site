'use client';
/* /computer's five section entrances (docs/MOTION-MAP.md rule 7), in the map's order:
   1 conveyor (the live terminal and its desktop), 2 squash-land (the pre-flight), 3 venetian-type (paste and ship),
   4 diagonal-wipe (get Computer), 5 card-deal (the closing band). Page-local: only ComputerPage uses these.
   Hydration-safe: server and first render print the final state. The start state is an attribute set in an effect
   (data-ce="wait"), and data-ce="go" plays the arrival once, when ~30% of the section is in view. Reduced motion:
   the attribute is never set. The conveyor is in the first screen, so it is a CSS animation under .js instead
   (no flash of the final state before the effect runs). Styles: ./Entrances.css. */
import { useEffect, useRef } from 'react';
import type { ElementType, ReactNode, RefObject } from 'react';
import './Entrances.css';

type BlockProps = { as?: ElementType; className?: string; children?: ReactNode; [attr: string]: unknown };

function useArrive(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    el.setAttribute('data-ce', 'wait');
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      if (e.intersectionRatio < 0.3 && e.intersectionRect.height < innerHeight * 0.3) return;
      el.setAttribute('data-ce', 'go');
      io.disconnect();
    }, { threshold: [0, 0.1, 0.2, 0.3, 0.5] });
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
}

/* 1. conveyor: the desktop, then the terminal, ride in from the right on one belt */
export function Conveyor({ as: T = 'section', className = '', children, ...rest }: BlockProps) {
  return <T className={className + ' ce-conveyor'} {...rest}>{children}</T>;
}

/* 2. squash-land: each column drops, squashes on landing and stands back up */
export function SquashLand({ as: T = 'section', className = '', children, ...rest }: BlockProps) {
  const ref = useRef<HTMLElement>(null);
  useArrive(ref);
  return <T ref={ref} className={className + ' ce-squash'} {...rest}>{children}</T>;
}

/* 3. venetian-type: each line of type slides in from alternating sides */
export function VenetianType({ as: T = 'section', className = '', children, ...rest }: BlockProps) {
  const ref = useRef<HTMLElement>(null);
  useArrive(ref);
  return <T ref={ref} className={className + ' ce-venetian'} {...rest}>{children}</T>;
}

/* 4. diagonal-wipe: a diagonal clip sweeps from the top-left corner across the block */
export function DiagonalWipe({ as: T = 'section', className = '', children, ...rest }: BlockProps) {
  const ref = useRef<HTMLElement>(null);
  useArrive(ref);
  return <T ref={ref} className={className + ' ce-wipe'} {...rest}>{children}</T>;
}

/* 5. card-deal: the headline, the line and the two asks are dealt from one deck below onto their places */
export function CardDeal({ children, className = '' }: { children?: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useArrive(ref);
  return <div ref={ref} className={className + ' ce-deal'}>{children}</div>;
}
