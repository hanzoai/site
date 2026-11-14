'use client';
/* The page's five entrances (docs/MOTION-MAP.md), page-local and each used once, in section order:
   1 tilt-3d-hover (the hero's film card), 2 slot-roll (the rack section's headings), 3 rack-focus (the B300/B200
   sheet), 4 conveyor (the promises), 5 line-draw (the close's art card).
   Each sets data-in on its section when it arrives; ZenMax.css holds the start states under `.js` and
   prefers-reduced-motion: no-preference, so with JS off or reduced motion every one shows its final state. Nothing
   reads the motion setting during render, so server and first client paint agree. */
import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, ElementType, ReactNode, RefObject } from 'react';
import { motion, useInView, useSpring } from 'motion/react';
import { useCalm } from '../../../ui';

/* data-in once a section is a share in view */
export function useIn<T extends HTMLElement = HTMLElement>(amount = 0.25) {
  const ref = useRef<T>(null);
  const seen = useInView(ref, { once: true, amount });
  return [ref, seen || undefined] as const;
}

/* 1 tilt-3d-hover: the card arrives tipped back in 3D and settles flat (transform only, the film is the LCP), then
   tilts toward the pointer anywhere over the hero (a finger tilts it while it is down). */
export function Tilt({ zone, children, className = '' }: { zone: RefObject<HTMLElement | null>; children?: ReactNode; className?: string }) {
  const [on, setOn] = useState(false);
  const calm = useCalm();
  const rx = useSpring(0, { stiffness: 150, damping: 18 });
  const ry = useSpring(0, { stiffness: 150, damping: 18 });
  useEffect(() => { const t = setTimeout(() => setOn(true), 80); return () => clearTimeout(t); }, []);
  useEffect(() => {
    const el = zone.current;
    if (!el || calm) return;
    let r: DOMRect | null = null;
    const aim = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' && e.buttons === 0 && e.type === 'pointermove') return;
      r = r || el.getBoundingClientRect();
      const u = (e.clientX - r.left) / r.width - 0.5, v = (e.clientY - r.top) / r.height - 0.5;
      ry.set(u * 14); rx.set(-v * 10);
    };
    const rest = () => { rx.set(0); ry.set(0); r = null; };
    const drop = () => { r = null; };
    const up = (e: PointerEvent) => { if (e.pointerType !== 'mouse') rest(); };
    el.addEventListener('pointermove', aim);
    el.addEventListener('pointerdown', aim);
    el.addEventListener('pointerleave', rest);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', rest);
    addEventListener('scroll', drop, { passive: true });
    addEventListener('resize', drop);
    return () => {
      el.removeEventListener('pointermove', aim); el.removeEventListener('pointerdown', aim); el.removeEventListener('pointerleave', rest);
      el.removeEventListener('pointerup', up); el.removeEventListener('pointercancel', rest);
      removeEventListener('scroll', drop); removeEventListener('resize', drop);
    };
  }, [zone, calm, rx, ry]);
  return (
    <div className={'zx-tilt ' + className} data-in={on || undefined}>
      <div className="zx-tilt-in">
        <motion.div className="zx-tilt-p" style={{ rotateX: rx, rotateY: ry }}>{children}</motion.div>
      </div>
    </div>
  );
}

/* 2 slot-roll: each letter is a reel that spins down through letters of the same line and stops on its own, left to
   right. The reel is decoration (aria-hidden); readers get the line once. The reels are fixed from the text itself,
   so server and browser render the same. */
export function Slot({ text, as: Tag = 'span', className, id, at = 0 }: { text: string; as?: ElementType; className?: string; id?: string; at?: number }) {
  let n = at;
  const pool = text.replace(/\s/g, '');
  const words = text.split(' ');
  return (
    <Tag className={className} id={id} data-slot="">
      <span className="x-sr">{text}</span>
      <span aria-hidden="true">
        {words.map((w, wi) => (
          <span key={wi}>
            <span className="zx-sl-w">
              {[...w].map((ch, ci) => {
                const i = n++, len = 3 + (i % 3);
                const reel = Array.from({ length: len }, (_, j) => pool[(i * 7 + j * 5 + 3) % pool.length]);
                return (
                  <span key={ci} className="zx-sl-c" style={{ '--i': i - at, '--n': len } as CSSProperties}>
                    <span className="zx-sl-g">{ch}</span>
                    <span className="zx-sl-s"><span>{ch}</span>{reel.map((g, j) => <span key={j}>{g}</span>)}</span>
                  </span>
                );
              })}
            </span>
            {wi < words.length - 1 ? ' ' : null}
          </span>
        ))}
      </span>
    </Tag>
  );
}

/* 5 line-draw: the art card's outline draws itself round, then the card fills and the Sigil shows */
export function Outline() {
  return (
    <svg className="zx-ld" aria-hidden="true">
      <rect pathLength="1" />
    </svg>
  );
}
