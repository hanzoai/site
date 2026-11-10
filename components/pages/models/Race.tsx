'use client';
/* The /models family's signature (docs/MOTION-MAP.md `race`): a live race of the models on the page, on Hanzo's own
   numbers (context window, in and out per million tokens). One meter climbs at one speed for every lane; each bar
   runs with it and stops at its own value, its counter rolling and then locking to Hanzo's printed figure, so every
   bar that has stopped is at its true ratio to every other and the leader runs longest. It races once when it comes
   into view; a metric button re-races it on that number, the replay button runs it again. Reduced motion, the server
   and JavaScript off show the finished race. Nothing here is a number Hanzo did not print. */
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { A } from '../../kit';
import { calmNow } from './enter';
import './race.css';

const useIso = typeof window === 'undefined' ? useEffect : useLayoutEffect;
const RUN = 1700; // ms for the meter to reach the leader
const curve = (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

/* lanes: [{ key, name, href?, me?, values: { [metric]: number|null }, text: { [metric]: string } }]
   metrics: [{ k, label, fmt(number) }] (fmt prints a running value; the finished one is the lane's own text) */
export default function Race({ lanes, metrics, label, dark = false, className = '' }) {
  const [k, setK] = useState(0);
  const [p, setP] = useState(1);
  const box = useRef(null);
  const raf = useRef(0);
  const ran = useRef(false);
  const run = () => {
    cancelAnimationFrame(raf.current);
    if (calmNow()) { setP(1); return; }
    setP(0);
    let t0 = 0;
    const tick = (now) => {
      t0 ||= now;
      const t = Math.min(1, (now - t0) / RUN);
      setP(t);
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  };
  useIso(() => {
    if (calmNow()) return undefined;
    setP(0);
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || ran.current) return;
      ran.current = true; io.disconnect(); run();
    }, { rootMargin: '0px 0px -20% 0px' });
    io.observe(box.current);
    return () => { io.disconnect(); cancelAnimationFrame(raf.current); };
  }, []);
  const m = metrics[k];
  const vals = lanes.map((l) => l.values[m.k]);
  const top = Math.max(0, ...vals.filter((v) => v != null)) || 1;
  const meter = top * curve(p);
  const pick = (i) => { setK(i); ran.current = true; run(); };
  const left = vals.filter((v) => v != null && v > meter).length;
  return (
    <div className={'rc' + (dark ? ' dark' : '') + (p < 1 ? ' running' : '') + ' ' + className} ref={box} role="group" aria-label={label}>
      <div className="rc-bar">
        <div className="rc-seg" role="group" aria-label={label}>
          {metrics.map((x, i) => (
            <button key={x.k} type="button" aria-pressed={k === i} onClick={() => pick(i)} data-sound="tick">
              {k === i && <motion.span layoutId={'rc-seg-' + label} className="rc-seg-bg" transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} />}
              <span>{x.label}</span>
            </button>
          ))}
        </div>
        <span className="rc-clock x-mono" aria-hidden="true"><i className={left ? 'on' : ''} />{m.fmt(meter)}</span>
        <button type="button" className="rc-again" onClick={() => pick(k)} aria-label={'Replay: ' + m.label}><span aria-hidden="true">↻</span></button>
      </div>
      <ol className="rc-lanes">
        {lanes.map((l) => {
          const v = l.values[m.k];
          const done = v == null || v <= meter || p >= 1;
          const w = v == null ? 0 : Math.min(v, meter) / top;
          return (
            <li key={l.key} className={'rc-lane' + (l.me ? ' me' : '') + (done ? ' done' : '')}>
              <span className="rc-name">{l.href ? <A to={l.href}>{l.name}</A> : l.name}</span>
              <span className="rc-track" aria-hidden="true"><i style={{ transform: `scaleX(${w.toFixed(4)})` }} /></span>
              <b className="rc-v x-mono">{done ? l.text[m.k] : m.fmt(Math.min(v, meter))}</b>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
