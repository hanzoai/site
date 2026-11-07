'use client';
/* /cli signature (docs/MOTION-MAP.md `compare`): a before / after slider under "A resource tree, not a pile of flags".
   Before (left): the CLI's own commands as a pile of flags. After (right): the same commands as the resource tree.
   Every string is Hanzo's (the h2's own words and the tree's commands). The visitor drags the divider (pointer or finger),
   or focuses the handle and uses the arrow keys / Home / End. On first arrival the divider sweeps once to show it moves, then
   rests at the middle; any press hands it over. clip-path and transform only; reduced motion: no sweep. */
import { useEffect, useRef, useState } from 'react';

export default function Compare({ tree, labelledBy, go }) {
  const box = useRef(null);
  const [x, setX] = useState(50);
  const [held, setHeld] = useState(false);
  const mine = useRef(false);
  const drag = useRef(false);
  const flat = tree.flatMap(([, list]) => list.map(([, cmd]) => cmd));

  // the one-time sweep when the section arrives: 50 → 78 → 24 → 50, then it rests
  useEffect(() => {
    if (!go || mine.current) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const keys = [[0, 50], [700, 78], [1700, 24], [2500, 50]];
    let raf = 0;
    const t0 = performance.now();
    const ease = (p) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
    const tick = (t) => {
      if (mine.current) return;
      const dt = t - t0;
      let i = 0;
      while (i < keys.length - 2 && dt > keys[i + 1][0]) i++;
      const [ta, va] = keys[i], [tb, vb] = keys[i + 1];
      const p = Math.min(1, Math.max(0, (dt - ta) / (tb - ta)));
      setX(va + (vb - va) * ease(p));
      if (dt < keys[keys.length - 1][0]) raf = requestAnimationFrame(tick);
    };
    const t = setTimeout(() => { raf = requestAnimationFrame(tick); }, 500);
    return () => { clearTimeout(t); cancelAnimationFrame(raf); };
  }, [go]);

  const at = (clientX) => {
    const r = box.current.getBoundingClientRect();
    setX(Math.max(4, Math.min(96, ((clientX - r.left) / r.width) * 100)));
  };
  const down = (e) => {
    // a mouse may grab anywhere; a finger only by the handle, so a vertical scroll over the panel never moves the divider
    if (e.pointerType !== 'mouse' && !e.target.closest?.('.cli-cmp-h')) return;
    mine.current = true; drag.current = true; setHeld(true);
    e.currentTarget.setPointerCapture?.(e.pointerId);
    at(e.clientX);
  };
  const move = (e) => { if (drag.current) at(e.clientX); };
  const up = () => { drag.current = false; setHeld(false); };
  const key = (e) => {
    const step = { ArrowLeft: -5, ArrowDown: -5, ArrowRight: 5, ArrowUp: 5 }[e.key];
    if (step) { e.preventDefault(); mine.current = true; setX((v) => Math.max(4, Math.min(96, v + step))); }
    else if (e.key === 'Home') { e.preventDefault(); mine.current = true; setX(4); }
    else if (e.key === 'End') { e.preventDefault(); mine.current = true; setX(96); }
  };

  return (
    <div className={'cli-cmp' + (held ? ' held' : '')} ref={box} style={{ '--x': x + '%' }}
      onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
      <div className="cli-cmp-a" aria-hidden="true">
        <span className="cli-cmp-k x-mono">a pile of flags</span>
        <p className="cli-cmp-pile x-mono">{flat.map((c, i) => <span key={c} style={{ '--r': ((i * 37) % 7) - 3 }}>{c}</span>)}</p>
      </div>
      <div className="cli-cmp-b" aria-hidden="true">
        <span className="cli-cmp-k x-mono">A resource tree</span>
        <ul className="cli-cmp-tree x-mono">
          <li className="root">hanzo</li>
          {tree.map(([name, list], r) => (
            <li key={name}>
              <span className="g">{r === tree.length - 1 ? '└─ ' : '├─ '}</span><b>{name}</b>
              <span className="l">{list.map(([leaf]) => leaf).filter(Boolean).join('  ')}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="cli-cmp-bar">
        <span className="cli-cmp-h" role="slider" tabIndex={0} aria-labelledby={labelledBy}
          aria-valuemin={4} aria-valuemax={96} aria-valuenow={Math.round(x)} aria-valuetext={Math.round(x) + '%'} onKeyDown={key}>
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M9 7 4 12l5 5M15 7l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </span>
      </div>
    </div>
  );
}
