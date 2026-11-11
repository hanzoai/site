'use client';
/* High-res dark-cinema visual plate replacing legacy contour/topology placeholders across Hanzo pages.
   Resolves each page/card seed deterministically to its model poster or monochrome 3D architectural plate,
   with subtle pointer depth parallax when interactive and a still frame under reduced motion. */
import { useEffect, useRef } from 'react';
import { sigilParams } from '../lib/sigil.ts';
import { resolvePlate } from '../lib/visuals.ts';

export { sigilParams };

export default function Sigil({
  seed,
  data = [],
  className = '',
  still = false,
}: {
  seed: string;
  data?: ReadonlyArray<number | string>;
  className?: string;
  still?: boolean;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const plate = resolvePlate(seed, data);

  useEffect(() => {
    const el = ref.current;
    if (!el || still || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const host = el.parentElement;
    if (!host || !matchMedia('(pointer: fine)').matches) return;

    const move = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      if (!r.width || !r.height) return;
      const nx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      const ny = ((e.clientY - r.top) / r.height - 0.5) * 2;
      el.style.setProperty('--vp-x', `${(-nx * 6).toFixed(2)}px`);
      el.style.setProperty('--vp-y', `${(-ny * 6).toFixed(2)}px`);
    };
    const leave = () => {
      el.style.setProperty('--vp-x', '0px');
      el.style.setProperty('--vp-y', '0px');
    };

    host.addEventListener('pointermove', move, { passive: true });
    host.addEventListener('pointerleave', leave);
    return () => {
      host.removeEventListener('pointermove', move);
      host.removeEventListener('pointerleave', leave);
    };
  }, [seed, still]);

  return (
    <span
      ref={ref}
      className={('x-sigil x-vplate ' + className).trim()}
      data-still={still ? 'true' : undefined}
      style={
        {
          '--vp-pos': plate.pos,
          '--vp-scale': String(plate.scale),
          '--vp-flip': String(plate.flip),
        } as React.CSSProperties
      }
      aria-hidden="true"
    >
      <img src={plate.src} alt="" loading="lazy" decoding="async" draggable={false} />
    </span>
  );
}
