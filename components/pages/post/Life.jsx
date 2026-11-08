'use client';
/* Conway's Game of Life, as the post describes it: a glider walks the board by itself (the board wraps, so it never
   leaves); press cells to draw your own pattern. Cells are buttons with one tab stop (arrow keys move it); each turn
   writes data-on straight to the cells, so React does not re-render per turn. Turns run on one rAF clock (no setInterval), stop off screen and stay
   still for reduced motion. The controls are kit Cta buttons. */
import { useCallback, useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'motion/react';
import { Cta } from '../../kit';
import { W, H, glider, step } from './lifeGrid';

export default function Life({ beside }) {
  const box = useRef(null);
  const cells = useRef([]);
  const grid = useRef(glider());
  const turn = useRef(null);
  const n = useRef(0);
  const paint = useRef(null);
  const [run, setRun] = useState(true);
  const [focus, setFocus] = useState(W * 4 + 3);
  const seen = useInView(box, { amount: 0.3 });
  const calm = useReducedMotion();

  const draw = useCallback(() => {
    const g = grid.current;
    cells.current.forEach((el, i) => { if (el && (el.dataset.on === '1') !== !!g[i]) { el.dataset.on = g[i] ? '1' : ''; el.setAttribute('aria-pressed', g[i] ? 'true' : 'false'); } });
    if (turn.current) turn.current.textContent = String(n.current);
  }, []);
  const tick = useCallback(() => { grid.current = step(grid.current); n.current += 1; draw(); }, [draw]);

  useEffect(() => { if (calm) setRun(false); }, [calm]);
  useEffect(() => {
    if (!run || !seen) return;
    let raf = 0, last = 0;
    const loop = (t) => { if (t - last >= 260) { last = t; tick(); } raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [run, seen, tick]);
  useEffect(() => { const up = () => { paint.current = null; }; addEventListener('pointerup', up); return () => removeEventListener('pointerup', up); }, []);

  const set = (i, v) => { grid.current[i] = v; draw(); };
  const key = (e, i) => {
    const m = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: W, ArrowUp: -W }[e.key];
    if (m === undefined) return;
    e.preventDefault();
    const j = (i + m + W * H) % (W * H);
    setFocus(j);
    cells.current[j]?.focus();
  };
  const reset = (g) => { grid.current = g; n.current = 0; draw(); };

  return (
    <figure className="xbg-life" ref={box}>
      <div className="xbg-board" data-enter="grid-wave" role="group" aria-label="Game of Life board" style={{ gridTemplateColumns: `repeat(${W}, minmax(0, 1fr))` }} data-swipe-own>
        {Array.from({ length: W * H }, (_, i) => {
          const on = grid.current[i] ? '1' : '';
          return (
            <button key={i} type="button" ref={(el) => { cells.current[i] = el; }} data-on={on} aria-pressed={!!on} tabIndex={i === focus ? 0 : -1}
              aria-label={'Cell ' + ((i % W) + 1) + ', ' + (Math.floor(i / W) + 1)}
              onPointerDown={(e) => { e.preventDefault(); const v = grid.current[i] ? 0 : 1; paint.current = v; set(i, v); setFocus(i); }}
              onPointerEnter={() => { if (paint.current !== null) set(i, paint.current); }}
              onKeyDown={(e) => { key(e, i); if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); set(i, grid.current[i] ? 0 : 1); } }} />
          );
        })}
      </div>
      <div className="xbg-life-bar">
        <Cta kind="quiet" size="sm" aria-pressed={run} onClick={() => setRun((r) => !r)}>{run ? 'Pause' : 'Run'}</Cta>
        <Cta kind="quiet" size="sm" onClick={tick}>Step</Cta>
        <Cta kind="quiet" size="sm" onClick={() => reset(glider())}>Glider</Cta>
        <Cta kind="quiet" size="sm" onClick={() => reset(new Uint8Array(W * H))}>Clear</Cta>
        <span className="xbg-turn x-mono" aria-live="off">Turn <b ref={turn}>0</b></span>
      </div>
      {beside && <figcaption className="xbg-p">{beside}</figcaption>}
    </figure>
  );
}
