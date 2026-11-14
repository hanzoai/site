'use client';
/* How much AI, as one slider: the plan cards' usage ladder on the home and /pricing (lib/plans.ts `rungs`), lowest
   first, each stop named under it by its multiple of Go (3x … 50x), the last with no cap ∞. It is the browser's own
   range input, so arrows, Home/End, a drag and a screen reader all work as they do everywhere; aria-valuetext says the
   plan, its usage and its price. The track's fill and the stops' places are CSS from --n and --at, so the server draws
   it as it stays and nothing is measured. A tap on the track or a stop's name goes to that stop (Safari on a phone
   moves a range only by its thumb). */
import { useRef, type CSSProperties, type MouseEvent, type ReactNode } from 'react';
import type { Rung } from '../lib/plans';
import './Usage.css';

export default function Usage({ rungs, at, set }: { rungs: Rung[]; at: number; set: (i: number) => void }) {
  const r = rungs[at];
  const n = Math.max(1, rungs.length - 1);
  const down = useRef<number | null>(null);
  // a tap (not a drag) goes to the nearest stop: the stops sit a half thumb (22px) in from each end, as the input puts them
  const tap = (e: MouseEvent<HTMLInputElement>) => {
    if (down.current == null || Math.abs(e.clientX - down.current) > 6) return;
    const box = e.currentTarget.getBoundingClientRect();
    const k = Math.round(((e.clientX - box.left - 22) / (box.width - 44)) * n);
    set(Math.min(n, Math.max(0, k)));
  };
  return (
    <div className="x-usage" style={{ '--n': n, '--at': at } as CSSProperties}>
      <input
        type="range" min={0} max={n} step={1} value={at}
        onChange={(e) => set(+e.target.value)}
        onPointerDown={(e) => { down.current = e.clientX; }}
        onClick={tap}
        aria-label="Usage"
        aria-valuetext={`${r.name}, ${r.x === '∞' ? 'no usage caps' : r.x + ' usage'}, $${r.price} a month`}
      />
      <ol aria-hidden="true">
        {rungs.map((q, k) => <li key={q.id} style={{ '--k': k } as CSSProperties} data-on={k === at || undefined} data-inf={q.x === '∞' || undefined}>{q.x}</li>)}
      </ol>
    </div>
  );
}

/** Every stop's version of a part in one cell, the current one shown: the cell is as tall and as wide as the largest, so
    a move of the slider never moves anything around it. `as` is the cell's element: span within a line, div around blocks. */
export function Stack({ at, as: Tag = 'span', className = '', children }: { at: number; as?: 'span' | 'div'; className?: string; children: ReactNode[] }) {
  return (
    <Tag className={'x-stack' + (className ? ' ' + className : '')}>
      {children.map((c, k) => <Tag key={k} data-on={k === at || undefined}>{c}</Tag>)}
    </Tag>
  );
}
