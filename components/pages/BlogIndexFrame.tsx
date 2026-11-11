/* Server-rendered high-res visual plate for BlogIndex cover story before client hydration. */
import { resolvePlate } from '../../lib/visuals.ts';

export default function BlogIndexFrame({ seed, className = '' }: { seed: string; className?: string }) {
  const plate = resolvePlate(seed);
  return (
    <span
      className={('x-vplate ' + className).trim()}
      style={
        {
          '--vp-pos': plate.pos,
          '--vp-scale': String(plate.scale),
          '--vp-flip': String(plate.flip),
        } as React.CSSProperties
      }
      aria-hidden="true"
    >
      <img src={plate.src} alt="" decoding="async" draggable={false} />
    </span>
  );
}
