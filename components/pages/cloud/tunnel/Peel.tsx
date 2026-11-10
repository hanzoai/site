'use client';
/* /tunnel signature: Peel the layers. The share as a stack, bottom to top: the laptop (127.0.0.1:3000), the café network
   it sits on (nothing listening), the Hanzo fabric that carries the traffic, and the public URL on the open internet.
   The stack lifts apart into floating layers in 3D, each named, then closes again.
   - desktop: scrolling through the section opens it at the middle and closes it either side; drag the stack up or down
     to pull it open or push it shut (it eases back to the scroll's position when let go).
   - phones: it opens and closes by itself while seen; a tap opens or shuts it and stops the loop.
   - reduced motion: the opened stack, flat, every layer named. Only transform and opacity move. Words are Hanzo's. */
import { useEffect, useRef, useState } from 'react';
import { motion, animate, useScroll, useTransform, useMotionValue } from 'motion/react';
import useCalm from '../../../v2/useCalm';
import { useWide } from '../../../v2/useWide';
import { useEnter, scatter } from './enter';

const LAYERS = [
  { k: 'laptop', label: '127.0.0.1:3000', sub: 'hanzo share 3000' },
  { k: 'net', label: 'café network', sub: 'nothing listening' },
  { k: 'fabric', label: 'Hanzo fabric', sub: '→ sharing 3000' },
  { k: 'url', label: 'wispyfox7421.share.hanzo.ai', sub: 'open internet' },
];
const clamp = (v) => Math.max(0, Math.min(1, v));

function Layer({ i, s, gap, children, k }) {
  const z = useTransform(s, (v) => (i - 1.5) * (12 + v * gap));
  const plate = useTransform(z, (v) => `translate(-50%, -50%) rotateX(60deg) rotateZ(-40deg) translateZ(${v.toFixed(1)}px)`);
  return <motion.div className={'tp-plate tp-' + k} style={{ transform: plate }}>{children}</motion.div>;
}

function Label({ i, s, gap, l }) {
  const y = useTransform(s, (v) => -(i - 1.5) * (12 + v * gap) * 0.5);
  const o = useTransform(s, (v) => 0.45 + 0.55 * v);
  return (
    <motion.p className="tp-label" style={{ y, opacity: o }}>
      <b>{l.label}</b><span className="l2-mono">{l.sub}</span>
    </motion.p>
  );
}

export default function Peel() {
  const calm = useCalm();
  const wide = useWide();
  const sec = useRef(null);
  const [eref, ein] = useEnter(0.2);
  const setRefs = (el) => { sec.current = el; eref.current = el; };
  const { scrollYProgress } = useScroll({ target: sec, offset: ['start end', 'end start'] });
  const extra = useMotionValue(0); // drag, desktop
  const tap = useMotionValue(0); // the phone's own open/close
  const s = useTransform([scrollYProgress, extra, tap], ([a, b, c]) => (wide ? clamp(1 - Math.abs(a - 0.5) / 0.3 + b) : c));
  const gap = wide ? 118 : 70;

  // phones: open, hold, close, hold, while seen, until tapped
  const [seen, setSeen] = useState(false);
  const [mine, setMine] = useState(false);
  useEffect(() => {
    const el = sec.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setSeen(e.isIntersecting), { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (wide || calm || !seen || mine) return;
    let stop = false, c = null, t = 0;
    const go = (to) => { if (stop) return; c = animate(tap, to, { duration: 1.1, ease: [0.4, 0, 0.2, 1] }); t = setTimeout(() => go(to ? 0 : 1), to ? 3200 : 1800); };
    t = setTimeout(() => go(1), 500);
    return () => { stop = true; clearTimeout(t); c?.stop(); };
  }, [wide, calm, seen, mine, tap]);
  const toggle = () => { if (wide) return; setMine(true); animate(tap, tap.get() > 0.5 ? 0 : 1, { duration: 0.8, ease: [0.4, 0, 0.2, 1] }); };

  // desktop: drag the stack open or shut
  const drag = useRef(null);
  const down = (e) => { if (!wide || e.pointerType !== 'mouse' && e.pointerType !== 'pen') return; drag.current = { y: e.clientY, b: extra.get() }; e.currentTarget.setPointerCapture(e.pointerId); };
  const move = (e) => { if (!drag.current) return; extra.set(Math.max(-1, Math.min(1, drag.current.b - (e.clientY - drag.current.y) / 220))); };
  const up = () => { if (!drag.current) return; drag.current = null; animate(extra, 0, { duration: 1.4, ease: [0.16, 1, 0.3, 1] }); };

  // the noise-dissolve entrance: a field of cells in the page's own white fades out in a scattered order
  const cells = Array.from({ length: 96 }, (_, i) => scatter(i, 3));
  return (
    <section ref={setRefs} className={'tp' + (calm ? ' flat' : '')} data-in={ein ? '' : undefined} aria-label="Hanzo Tunnel, layer by layer">
      <div className="l2-wrap tp-in">
        <div className={'tp-stage' + (wide ? '' : ' tap')} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onClick={toggle} role={wide ? undefined : 'button'} tabIndex={wide ? undefined : 0} aria-label={wide ? undefined : 'Hanzo Tunnel'} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } }}>
          <div className="tp-scene" aria-hidden="true">
            {LAYERS.map((l, i) => (
              <Layer key={l.k} i={i} s={s} gap={gap} k={l.k}>
                {l.k === 'laptop' && <p className="tp-term l2-mono"><span>$</span> hanzo share 3000</p>}
                {l.k === 'fabric' && <span className="tp-pk"><i /><i /><i /></span>}
                {l.k === 'url' && <span className="tp-lock" />}
              </Layer>
            ))}
          </div>
          <div className="tp-labels">
            {LAYERS.map((l, i) => <Label key={l.k} i={i} s={s} gap={gap} l={l} />)}
          </div>
        </div>
      </div>
      <div className="tp-noise" aria-hidden="true">{cells.map((d, i) => <i key={i} style={{ '--d': (d * 640).toFixed(0) + 'ms' }} />)}</div>
    </section>
  );
}
