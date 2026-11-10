'use client';
/* Decode (page-local, /risk signature): text resolves out of scrambled characters, left to right, as it arrives;
   hovering it scrambles it again and it re-resolves. The real words are always in the DOM (server render, JS off,
   screen readers, find-in-page); while decoding they are kept in place but transparent, and the scramble is drawn
   over them in an aria-hidden overlay, so nothing reflows. Reduced motion: the words, no scramble.
   Usage: <Decode as="h2" text="Where this is today" />  · start="mount" for the hero, "view" (default) otherwise,
          "change" to re-decode whenever `text` changes (the dial's decision word). */
import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';

const POOL = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghkmnpqrstuvwxyz0123456789#%&*/<>+=';
const scramble = (t, k, seed) => [...t].map((c, i) => (i < k || c === ' ' ? c : POOL[(i * 31 + seed * 17) % POOL.length])).join('');

export function useDecode(text, { start = 'view', ms = 720 } = {}) {
  const ref = useRef(null);
  const calm = useReducedMotion();
  const [fx, setFx] = useState(null); // the overlay string while decoding, null at rest
  const raf = useRef(0);
  const run = () => {
    if (calm) return;
    cancelAnimationFrame(raf.current);
    const t0 = performance.now(), n = text.length;
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / ms);
      const k = Math.floor(p * p * (3 - 2 * p) * (n + 1));
      if (p >= 1) { setFx(null); return; }
      setFx(scramble(text, k, Math.floor(now / 45)));
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  };
  const first = useRef(true);
  useEffect(() => {
    if (calm) return undefined;
    if (start === 'mount') { run(); return () => cancelAnimationFrame(raf.current); }
    if (start === 'change') { if (first.current) { first.current = false; return undefined; } run(); return () => cancelAnimationFrame(raf.current); }
    const el = ref.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { run(); io.disconnect(); } }, { threshold: 0.6 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf.current); };
  }, [calm, start, text]); // eslint-disable-line react-hooks/exhaustive-deps
  return { ref, fx, run };
}

export default function Decode({ as: Tag = 'span', text, start, ms, className = '', id, hover = true }) {
  const { ref, fx, run } = useDecode(text, { start, ms });
  return (
    <Tag ref={ref} id={id} className={'rk-dc ' + className} data-on={fx ? '' : undefined} onPointerEnter={hover ? (e) => { if (e.pointerType !== 'touch') run(); } : undefined}>
      <span className="rk-dc-t">{text}</span>
      {fx && <span className="rk-dc-fx" aria-hidden="true">{fx}</span>}
    </Tag>
  );
}

/* A headline in several lines, each line decoding a beat after the one above (the hero h1). */
export function DecodeLines({ as: Tag = 'h1', lines, className = '', id }) {
  return (
    <Tag id={id} className={'rk-dc-lines ' + className}>
      {lines.map((l, i) => <Decode key={l} className="rk-dc-line" text={l + (i < lines.length - 1 ? ' ' : '')} start="mount" ms={620 + i * 220} />)}
    </Tag>
  );
}
