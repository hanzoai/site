'use client';
/* /slack's five entrances (docs/MOTION-MAP.md), page-local, one per main section and never repeated:
   Pixel (pixel-resolve) the live window · Curl (page-curl) the setup card · Ripple (ripple) the three rooms ·
   Cascade (letter-cascade) the code-channel headline · Sweep (underline-sweep) the platform headline.
   Each one renders its resting state's markup on the server, waits for the browser (reduced motion is read only after
   mount, so the HTML never mismatches), plays once when it reaches the screen, then removes its own scaffolding. With
   JavaScript off, NoJs puts everything at rest; under reduced motion each one jumps to its final state. */
import { useEffect, useId, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'motion/react';
import NoJs from '../../NoJs';
import './Enter.css';

export function useMounted() {
  const [m, setM] = useState(false);
  useEffect(() => setM(true), []);
  return m;
}
export function useCalm() {
  const calm = useReducedMotion();
  return useMounted() && !!calm;
}

/* armed (server + first paint) → go (on screen) → done (scaffolding gone) */
function useEntrance(ref, amount = 0.3) {
  const [phase, setPhase] = useState('armed');
  const seen = useInView(ref, { once: true, amount });
  const calm = useCalm();
  useEffect(() => { if (calm) setPhase('done'); }, [calm]);
  useEffect(() => { if (seen) setPhase((p) => (p === 'armed' ? 'go' : p)); }, [seen]);
  return [phase, setPhase];
}

/* pixel-resolve: an SVG mosaic filter samples the window in coarse blocks that halve until the picture is sharp */
const BLOCKS = [36, 26, 18, 12, 8, 5, 3, 2];
export function Pixel({ children, className = '' }) {
  const ref = useRef(null);
  const nodes = useRef({});
  const fid = 'xsqpx' + useId().replace(/[^a-zA-Z0-9]/g, '');
  const [phase, setPhase] = useEntrance(ref, 0.2);
  useEffect(() => {
    if (phase !== 'go') return;
    let k = 0, t = 0;
    const set = (s) => {
      const { flood, tile, dil } = nodes.current;
      if (!flood) return;
      flood.setAttribute('x', String(s / 2 - 1)); flood.setAttribute('y', String(s / 2 - 1));
      tile.setAttribute('width', String(s)); tile.setAttribute('height', String(s));
      dil.setAttribute('radius', String(s / 2));
    };
    const tick = () => {
      if (k >= BLOCKS.length) { setPhase('done'); return; }
      set(BLOCKS[k++]);
      t = setTimeout(tick, k < 3 ? 120 : 85);
    };
    tick();
    return () => clearTimeout(t);
  }, [phase, setPhase]);
  const s = BLOCKS[0];
  return (
    <div ref={ref} className={`xsq-pix ${className} ${phase}`} style={phase === 'done' ? undefined : { filter: `url(#${fid})` }}>
      <NoJs css=".xsq-pix{filter:none!important}" />
      {phase !== 'done' && (
        <svg className="xsq-pix-svg" width="0" height="0" aria-hidden="true" focusable="false">
          <filter id={fid} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
            <feFlood ref={(n) => { nodes.current.flood = n; }} x={s / 2 - 1} y={s / 2 - 1} width="2" height="2" />
            <feComposite ref={(n) => { nodes.current.tile = n; }} width={s} height={s} />
            <feTile result="a" />
            <feComposite in="SourceGraphic" in2="a" operator="in" />
            <feMorphology ref={(n) => { nodes.current.dil = n; }} operator="dilate" radius={s / 2} />
          </filter>
        </svg>
      )}
      {children}
    </div>
  );
}

/* page-curl: a grey cover sheet lies over the card; its bottom-right corner lifts and curls back along a fold that
   sweeps to the top-left, showing the card under it. The fold is the line x + y = u (in the box's own fractions);
   the cover keeps the part before it and the flap is the curled-back part, mirrored over the fold. */
const ease = (x) => 1 - Math.pow(1 - x, 3);
function pts(list) { return 'polygon(' + list.map(([x, y]) => `${(x * 100).toFixed(2)}% ${(y * 100).toFixed(2)}%`).join(',') + ')'; }
function fold(u) {
  const cover = u >= 1 ? [[0, 0], [1, 0], [1, u - 1], [u - 1, 1], [0, 1]] : [[0, 0], [u, 0], [0, u]];
  const flap = u >= 1 ? [[1, u - 1], [u - 1, u - 1], [u - 1, 1]] : [[u, 0], [u, u - 1], [u - 1, u - 1], [u - 1, u], [0, u]];
  return [pts(cover), pts(flap)];
}
export function Curl({ children, className = '' }) {
  const ref = useRef(null);
  const cover = useRef(null);
  const flap = useRef(null);
  const [phase, setPhase] = useEntrance(ref, 0.45);
  useEffect(() => {
    if (phase !== 'go') return;
    let raf = 0, t0 = 0;
    const D = 1100;
    const step = (now) => {
      if (!t0) t0 = now;
      const x = Math.min(1, (now - t0) / D);
      const u = 2.02 - ease(x) * 2.1;
      const [c, f] = fold(u);
      if (cover.current) cover.current.style.clipPath = c;
      if (flap.current) flap.current.style.clipPath = f;
      if (x < 1) raf = requestAnimationFrame(step); else setPhase('done');
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [phase, setPhase]);
  const [c0, f0] = fold(2.02);
  return (
    <div ref={ref} className={`xsq-curl ${className}`}>
      {children}
      {phase !== 'done' && (
        <div className="xsq-curl-sheet" aria-hidden="true">
          <NoJs css=".xsq-curl-sheet{display:none!important}" />
          <i ref={cover} className="xsq-curl-cover" style={{ clipPath: c0 }} />
          <i ref={flap} className="xsq-curl-flap" style={{ clipPath: f0 }} />
        </div>
      )}
    </div>
  );
}

/* ripple: rings spread from the centre; the block appears inside the first ring and stays behind as they pass */
export function Ripple({ children, className = '' }) {
  const ref = useRef(null);
  const [phase, setPhase] = useEntrance(ref, 0.35);
  useEffect(() => {
    if (phase !== 'go') return;
    const t = setTimeout(() => setPhase('done'), 1700);
    return () => clearTimeout(t);
  }, [phase, setPhase]);
  return (
    <div ref={ref} className={`xsq-rip ${className} ${phase}`}>
      <NoJs css=".xsq-rip-in{clip-path:none!important}.xsq-rip-ring{display:none!important}" />
      <div className="xsq-rip-in">{children}</div>
      {phase !== 'done' && <>{[0, 1, 2].map((k) => <i key={k} className="xsq-rip-ring" style={{ '--k': k }} aria-hidden="true" />)}</>}
    </div>
  );
}

/* letter-cascade: each letter drops into its place, one after the next; words never break apart */
export function Cascade({ text, as = 'h2', id, className = '' }) {
  const ref = useRef(null);
  const [phase, setPhase] = useEntrance(ref, 0.6);
  const n = text.replace(/\s/g, '').length;
  useEffect(() => {
    if (phase !== 'go') return;
    const t = setTimeout(() => setPhase('done'), n * 18 + 700);
    return () => clearTimeout(t);
  }, [phase, setPhase, n]);
  const Tag = as;
  let i = 0;
  return (
    <Tag ref={ref} id={id} className={`xsq-cas ${className} ${phase}`} aria-label={text}>
      <NoJs css=".xsq-cas .xsq-ch{opacity:1!important;transform:none!important}" />
      {text.split(' ').map((w, k, all) => (
        <span key={k} aria-hidden="true">
          <span className="xsq-wd">{[...w].map((c) => <span key={i} className="xsq-ch" style={{ '--i': i++ }}>{c}</span>)}</span>
          {k < all.length - 1 ? ' ' : null}
        </span>
      ))}
    </Tag>
  );
}

/* underline-sweep: the key words take an ink underline, swept left to right in reading order */
export function Sweep({ text, keys, as = 'h2', id, className = '' }) {
  const ref = useRef(null);
  const [phase] = useEntrance(ref, 0.8);
  const parts = [];
  let rest = text;
  keys.forEach((k, j) => {
    const at = rest.indexOf(k);
    if (at < 0) return;
    if (at) parts.push(rest.slice(0, at));
    parts.push(<span key={j} className="xsq-sw" style={{ '--j': j }}>{k}</span>);
    rest = rest.slice(at + k.length);
  });
  if (rest) parts.push(rest);
  const Tag = as;
  return <Tag ref={ref} id={id} className={`xsq-swp ${className} ${phase}`}>{parts}</Tag>;
}
