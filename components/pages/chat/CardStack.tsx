'use client';
/* /chat's signature (docs/MOTION-MAP.md: `card-stack`): the six things Hanzo Chat does, as a stack of dark cards.
   Each card is one idea, its own scripted panel. Drag or flick the top card away (mouse or finger, either way) and the
   next comes up; the flicked card goes to the back of the deck. Keyboard: the Previous / Next buttons, the six index
   buttons, or the arrow keys while the stack has focus. Each card's small scene plays when it reaches the top
   ([data-play] on its art, only once the stack has been on screen), and pauses while the stack is off screen.
   Entrance (`tilt-3d-hover`): the stack arrives tilted back in 3D and swings level toward the pointer; after that it
   keeps leaning toward a mouse pointer, and toward a dragging finger on touch screens.
   Every card's words are in the server HTML; with JS off the stack shows its first card, all six titles are in the
   index, and every card's words stay in the document. */
import type React from 'react';
import type { ReactNode, Ref } from 'react';
import { memo, useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ui } from '../../v2/famUi';

const DEPTH = 3; // cards visible behind the top one
const OUT = 440; // ms a flicked card takes to leave

interface ArrowProps {
  d: number;
}
const Arrow = ({ d }: ArrowProps) => (
  <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d={d < 0 ? 'M10 3 5 8l5 5' : 'm6 3 5 5-5 5'} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

export interface StackItem {
  key: string;
  title: string;
  body: string;
  icon: ReactNode;
  art: ReactNode;
}
interface FaceProps {
  it: StackItem;
  i: number;
  n: number;
}
const Face = memo(function Face({ it, i, n }: FaceProps) {
  return (
    <div className="cht-card-txt">
      <span className="cht-card-ico" aria-hidden="true">{it.icon}</span>
      <h3 className="cht-card-t">{it.title}</h3>
      <p className="cht-card-b">{it.body}</p>
      <p className="cht-card-n x-mono" aria-hidden="true">{String(i + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}</p>
    </div>
  );
});
interface ArtProps {
  art: ReactNode;
  play: boolean;
}
const Art = memo(function Art({ art, play }: ArtProps) {
  return <div className="cht-card-art" aria-hidden="true" data-play={play ? '' : undefined}><div className="cht-card-art-in">{art}</div></div>;
});

/* the top card while a finger or mouse holds it: where it started, how far it has moved, the last few x positions */
interface Drag {
  i: number;
  x0: number;
  y0: number;
  dx: number;
  dy: number;
  axis: 'x' | null;
  id: number;
  hist: [number, number][];
  touch: boolean;
}
interface CardStackProps {
  items: StackItem[];
  label: string;
  id: string;
  enter?: Ref<HTMLDivElement>;
}
export default function CardStack({ items, label, id, enter }: CardStackProps) {
  const n = items.length;
  const [order, setOrder] = useState(() => items.map((_, i) => i));
  const [fly, setFly] = useState<{ i: number; dir: number } | null>(null); // { i, dir }: a card off to one side (leaving, or about to come back)
  const [snap, setSnap] = useState(-1); // a card moved without a transition this frame
  const [seen, setSeen] = useState(false);
  const [held, setHeld] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const tilt = useRef<HTMLDivElement>(null);
  const inner = useRef<(HTMLDivElement | null)[]>([]);
  const drag = useRef<Drag | null>(null);
  const busy = useRef(false);
  const top = order[0];

  // the stack plays only once seen, and pauses its scenes while off screen
  useEffect(() => {
    const el = box.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(([e]) => {
      el.toggleAttribute('data-off', !e.isIntersecting);
      if (e.isIntersecting) setSeen(true);
    }, { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const frames = (f: () => void) => requestAnimationFrame(() => requestAnimationFrame(f));
  const lean = (rx: number, ry: number) => { const t = tilt.current; if (t) { t.style.setProperty('--rx', rx.toFixed(2) + 'deg'); t.style.setProperty('--ry', ry.toFixed(2) + 'deg'); } };

  const next = (dir = -1) => {
    if (busy.current) return;
    busy.current = true;
    const i = order[0];
    setFly({ i, dir });
    setOrder((o) => [...o.slice(1), o[0]]);
    setTimeout(() => {
      setSnap(i); setFly(null);
      const el = inner.current[i];
      if (el) { el.style.transition = 'none'; el.style.transform = ''; }
      frames(() => { setSnap(-1); if (el) el.style.transition = ''; busy.current = false; });
    }, OUT);
  };
  const prev = () => {
    if (busy.current) return;
    busy.current = true;
    const i = order[n - 1];
    setSnap(i); setFly({ i, dir: -1 });
    setOrder((o) => [o[n - 1], ...o.slice(0, -1)]);
    frames(() => { setSnap(-1); setFly(null); setTimeout(() => { busy.current = false; }, OUT); });
  };
  const goTo = (k: number) => {
    if (k === top || busy.current) return;
    setOrder((o) => { const p = o.indexOf(k); return [...o.slice(p), ...o.slice(0, p)]; });
  };

  const key = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); next(-1); }
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); prev(); }
  };

  /* drag: the top card follows the pointer (the inner layer, so React's own transform on the card is untouched) */
  const down = (e: React.PointerEvent<HTMLDivElement>, i: number) => {
    if (i !== top || busy.current || (e.pointerType === 'mouse' && e.button !== 0)) return;
    drag.current = { i, x0: e.clientX, y0: e.clientY, dx: 0, dy: 0, axis: null, id: e.pointerId, hist: [[e.timeStamp, e.clientX]], touch: e.pointerType !== 'mouse' };
  };
  const move = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || e.pointerId !== d.id) return;
    d.dx = e.clientX - d.x0; d.dy = e.clientY - d.y0;
    if (!d.axis) {
      if (Math.abs(d.dx) > 6 && Math.abs(d.dx) > Math.abs(d.dy)) {
        d.axis = 'x';
        e.currentTarget.setPointerCapture?.(e.pointerId);
        setHeld(true);
      } else if (Math.abs(d.dy) > 8) { drag.current = null; return; }
      else return;
    }
    d.hist.push([e.timeStamp, e.clientX]);
    if (d.hist.length > 6) d.hist.shift();
    const el = inner.current[d.i];
    if (el) { el.style.transition = 'none'; el.style.transform = `translate3d(${d.dx}px, ${d.dy * 0.12}px, 0) rotate(${d.dx * 0.04}deg)`; }
    if (d.touch) lean(0, Math.max(-9, Math.min(9, d.dx * 0.03))); // touch: the stack leans with the finger
  };
  const up = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || e.pointerId !== d.id) return;
    drag.current = null;
    setHeld(false);
    if (d.axis !== 'x') return;
    const [t0, x0] = d.hist[0];
    const v = (e.clientX - x0) / Math.max(1, e.timeStamp - t0); // px per ms
    const w = inner.current[d.i]?.offsetWidth || 600;
    if (d.touch) lean(0, 0);
    if (Math.abs(d.dx) > w * 0.22 || Math.abs(v) > 0.55) next(d.dx < 0 ? -1 : 1);
    else { const el = inner.current[d.i]; if (el) { el.style.transition = ''; el.style.transform = ''; } }
  };

  /* tilt-3d-hover: after the entrance the stack leans toward a mouse pointer */
  const hover = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || drag.current?.axis) return;
    const r = box.current!.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    lean(-py * 7, px * 9);
  };

  const place = (i: number) => {
    const d = order.indexOf(i);
    const k = Math.min(d, DEPTH);
    if (fly && fly.i === i) return { transform: `translate3d(${fly.dir * 118}%, 3%, 0) rotate(${fly.dir * 12}deg)`, zIndex: n + 1, transition: snap === i ? 'none' : undefined };
    return {
      transform: `translate3d(0, ${-k * 18}px, 0) scale(${(1 - k * 0.05).toFixed(3)})`,
      zIndex: n - d,
      opacity: d < DEPTH ? 1 : 0,
      transition: snap === i ? 'none' : undefined,
    };
  };

  return (
    <div className="cht-stack-wrap" ref={enter}>
      <div
        className={'cht-stack' + (held ? ' held' : '')}
        ref={box}
        id={id}
        role="group"
        aria-label={label}
        tabIndex={0}
        onKeyDown={key}
        onPointerMove={hover}
        onPointerLeave={(e) => { if (e.pointerType === 'mouse') lean(0, 0); }}
      >
        <div className="cht-tilt" ref={tilt}>
          {items.map((it, i) => {
            const d = order.indexOf(i);
            return (
              <article
                key={it.key}
                className={'cht-card' + (d === 0 ? ' top' : '')}
                style={place(i)}
                aria-hidden={d === 0 ? undefined : true}
                aria-label={`${i + 1} ${ui('of')} ${n}`}
              >
                <div
                  className="cht-card-in"
                  ref={(el) => { inner.current[i] = el; }}
                  onPointerDown={(e) => down(e, i)}
                  onPointerMove={move}
                  onPointerUp={up}
                  onPointerCancel={up}
                >
                  <Face it={it} i={i} n={n} />
                  <Art art={it.art} play={seen && d === 0} />
                </div>
              </article>
            );
          })}
        </div>
      </div>
      <nav className="cht-stack-nav" aria-label={label}>
        <button type="button" className="cht-stack-step" aria-label={ui('previous')} aria-controls={id} onClick={prev}><Arrow d={-1} /></button>
        <div className="cht-stack-idx">
          {items.map((it, i) => (
            <button key={it.key} type="button" aria-label={it.title} aria-controls={id} aria-current={i === top ? 'true' : undefined} onClick={() => goTo(i)}>
              {i === top && <motion.span layoutId="cht-stack-pill" className="cht-stack-pill" transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} />}
              {it.icon}<span className="cht-stack-t" aria-hidden="true">{it.title}</span>
            </button>
          ))}
        </div>
        <span className="cht-stack-dots" aria-hidden="true">{items.map((it, i) => <i key={it.key} className={i === top ? 'on' : ''} />)}</span>
        <button type="button" className="cht-stack-step" aria-label={ui('next')} aria-controls={id} onClick={() => next(-1)}><Arrow d={1} /></button>
      </nav>
    </div>
  );
}
