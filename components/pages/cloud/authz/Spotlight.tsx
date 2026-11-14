'use client';
/* Authz's signature (MOTION-MAP `spotlight`): the six rules in a dark room. Only their numbers and titles are lit by
   the room; a light follows the cursor and whatever rule it falls on shows its whole text and its decision (the
   path, the verdict, the algorithms), drawn as chips. Touch: tap anywhere to place the light there. Keyboard: each
   rule is a tab stop; focusing it moves the light onto it. With no input, the light walks the rules once while the
   room is seen (on phones it rests on the rule nearest the middle of the screen as you scroll), then stays.
   Reduced motion: the light jumps instead of gliding and does not walk. JS off: every rule stands fully lit.
   The light is a mask over a second, identical grid (no glow, no colour); the dark grid under it is aria-hidden. */
import type React from 'react';
import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import { motion, animate, useInView, useMotionTemplate, useMotionValue, useReducedMotion } from 'motion/react';
import './Spotlight.css';

const MOVE: [number, number, number, number] = [0.4, 0, 0.2, 1];
const pad = (n: number) => String(n).padStart(2, '0');

interface TileProps {
  i: number;
  n: number;
  title: string;
  body: string;
  dec: string[][];
  on: boolean;
  lit?: boolean;
  onFocus?: () => void;
}
function Tile({ i, n, title, body, dec, on, lit, onFocus }: TileProps) {
  return (
    <li className={'az-sp-t' + (on ? ' on' : '')}>
      <article tabIndex={lit ? 0 : -1} aria-labelledby={lit ? 'az-sp-h' + i : undefined} onFocus={onFocus}>
        <p className="az-sp-n">{pad(i + 1)} / {pad(n)}</p>
        <h3 id={lit ? 'az-sp-h' + i : undefined} className="az-sp-h">{title}</h3>
        <p className="az-sp-b">{body}</p>
        <p className="az-sp-d">
          {dec.map(([t, k], j) => <span key={j} className={'az-sp-c' + (k ? ' ' + k : '')}>{t}</span>)}
        </p>
      </article>
    </li>
  );
}

interface SpotlightProps {
  rules: string[][];
  decisions: string[][][];
  children: ReactNode;
}
export default function Spotlight({ rules, decisions, children }: SpotlightProps) {
  const box = useRef<HTMLDivElement>(null);
  const calm = useReducedMotion();
  const seen = useInView(box, { amount: 0.3 });
  const [ready, setReady] = useState(false);
  const [at, setAt] = useState(0);
  const [mine, setMine] = useState(false); // the visitor has taken the light: the walk stops for good
  const [r, setR] = useState(300);
  const x = useMotionValue(-999);
  const y = useMotionValue(-999);
  const mask = useMotionTemplate`radial-gradient(circle at ${x}px ${y}px, #000 0px, #000 ${r * 0.5}px, transparent ${r}px)`;
  const runs = useRef([]);

  const stage = useRef<HTMLOListElement>(null); // the lit grid: the light's coordinates are in its box
  const tiles = () => [...(stage.current?.querySelectorAll('.az-sp-t') || [])];
  const center = (i: number) => { const el = tiles()[i]; return el ? [el.offsetLeft + el.offsetWidth / 2, el.offsetTop + el.offsetHeight / 2] : null; };
  const stop = () => { runs.current.forEach((c) => c.stop()); runs.current = []; };
  const glide = (tx, ty, d = 1.1) => {
    stop();
    if (calm) { x.set(tx); y.set(ty); return; }
    runs.current = [animate(x, tx, { duration: d, ease: MOVE }), animate(y, ty, { duration: d, ease: MOVE })];
  };
  const aim = (i: number, d: number) => { const c = center(i); if (c) { setAt(i); glide(c[0], c[1], d); } };
  const nearest = (px: number, py: number) => {
    let best = 0, bd = Infinity;
    tiles().forEach((el, i) => {
      const dx = Math.max(el.offsetLeft - px, 0, px - el.offsetLeft - el.offsetWidth);
      const dy = Math.max(el.offsetTop - py, 0, py - el.offsetTop - el.offsetHeight);
      const dd = dx * dx + dy * dy;
      if (dd < bd) { bd = dd; best = i; }
    });
    return best;
  };
  const local = (e: React.PointerEvent<HTMLDivElement>) => { const b = stage.current!.getBoundingClientRect(); return [e.clientX - b.left, e.clientY - b.top]; };

  /* mask on only once the script runs; light size from the room's width; light starts on the first rule */
  useEffect(() => {
    const size = () => setR(box.current && box.current.offsetWidth < 700 ? 200 : 300);
    size();
    const c = center(0);
    if (c) { x.set(c[0]); y.set(c[1]); }
    setReady(true);
    addEventListener('resize', size);
    return () => removeEventListener('resize', size);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* the walk: once through the rules while the room is seen (wide screens); phones rest on the rule nearest the middle */
  const wide = r >= 300;
  useEffect(() => {
    if (!ready || !seen || mine || calm || !wide) return;
    if (at >= rules.length - 1) return;
    const t = setTimeout(() => aim(at + 1), 2600);
    return () => clearTimeout(t);
  }, [ready, seen, mine, calm, wide, at]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!ready || wide || mine) return;
    let t: ReturnType<typeof setTimeout> | 0 = 0;
    const f = () => {
      clearTimeout(t);
      t = setTimeout(() => {
        const b = stage.current?.getBoundingClientRect();
        if (!b) return;
        const i = nearest(b.width / 2, innerHeight / 2 - b.top);
        aim(i, 0.7);
      }, 140);
    };
    addEventListener('scroll', f, { passive: true });
    return () => { removeEventListener('scroll', f); clearTimeout(t); };
  }, [ready, wide, mine]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => stop, []);

  const move = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return;
    stop();
    setMine(true);
    const [px, py] = local(e);
    x.set(px); y.set(py);
    const i = nearest(px, py);
    if (i !== at) setAt(i);
  };
  const place = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse') return;
    setMine(true);
    const [px, py] = local(e);
    setAt(nearest(px, py));
    glide(px, py, 0.5);
  };

  return (
    <div className={'az-sp' + (ready ? ' ready' : '')} ref={box} onPointerMove={move} onPointerDown={place}>
      {children}
      <div className="az-sp-s">
        <ol className="az-sp-g dim" aria-hidden="true">
          {rules.map(([t, b], i) => <Tile key={i} i={i} n={rules.length} title={t} body={b} dec={decisions[i]} on={false} />)}
        </ol>
        <motion.ol ref={stage} className="az-sp-g lit" style={ready ? { maskImage: mask, WebkitMaskImage: mask } : undefined}>
          {rules.map(([t, b], i) => (
            <Tile key={i} i={i} n={rules.length} title={t} body={b} dec={decisions[i]} on={at === i} lit
              onFocus={() => { setMine(true); aim(i, 0.6); }} />
          ))}
        </motion.ol>
      </div>
    </div>
  );
}
