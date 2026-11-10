'use client';
/* Chapters (v2, owned by the Home chat): the Apple product-page pattern. The scene pins; the words hold on the left
   while the pictures change on the right, each new one wiping up over the last as you scroll (one comes in as the
   last goes out). An index beside it shows where you are and jumps to any chapter. On phones and with reduced motion
   nothing pins: each chapter is its picture, then its words, one after another.
   Usage:
     import Chapters from '../v2/Chapters';
     <Chapters label="Hanzo products" step={0.8} items={[
       { key: 'dev', title: 'Dev', to: '/dev', text: <p>…</p>, visual: <div>…</div> },
     ]} />
   - title is a link to `to` and carries data-morph, so it opens into that page (Morph layer).
   - a click on a picture (not on a link inside it) opens the same page.
   - step: screens of scroll each chapter holds (default 0.8).
   Every chapter is in the HTML; the hidden ones are inert. Needs components/v2/system.css. */
import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { A } from '../kit';
import './Chapters.css';

const pad = (n) => String(n).padStart(2, '0');

function Visual({ i, n, p, pinned, item, onOpen }) {
  // chapter i wipes up over chapter i-1 in the last stretch before its turn
  const q = useTransform(p, (v) => v * n);
  const clip = useTransform(q, (v) => {
    if (i === 0) return 'inset(0% 0% 0% 0% round 28px)';
    const t = Math.max(0, Math.min(1, (v - i + 0.6) / 0.6));
    const e = 1 - Math.pow(1 - t, 3);
    return `inset(${((1 - e) * 100).toFixed(2)}% 0% 0% 0% round 28px)`;
  });
  // the one going out sinks back a little as the next arrives
  const scale = useTransform(q, (v) => { const t = Math.max(0, Math.min(1, (v - i - 0.4) / 0.6)); return 1 - t * 0.06; });
  const on = pinned !== false;
  return (
    <motion.div className="v2-ch-vis" style={on ? { clipPath: clip, scale } : { clipPath: 'none', scale: 1 }} onClick={(e) => { if (!e.target.closest("a, button")) onOpen(); }} data-cursor="">
      {item.visual}
    </motion.div>
  );
}

export default function Chapters({ items, label, step = 0.8, className = '' }) {
  const n = items.length;
  const ref = useRef(null);
  const calm = useReducedMotion();
  const [pinned, setPinned] = useState(null);
  const [at, setAt] = useState(0);
  useEffect(() => {
    const m = matchMedia('(min-width: 900px)');
    const f = () => setPinned(m.matches && !calm);
    f();
    m.addEventListener('change', f);
    return () => m.removeEventListener('change', f);
  }, [calm]);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  useMotionValueEvent(p, 'change', (v) => { const k = Math.max(0, Math.min(n - 1, Math.floor(v * n + 0.3))); setAt((c) => (c === k ? c : k)); });
  const fill = useTransform(p, [0, 1], [1 / n, 1]);
  const jump = (i) => {
    const el = ref.current, r = el.getBoundingClientRect();
    const y = scrollY + r.top + ((i + 0.08) / n) * (el.offsetHeight - innerHeight);
    window.__lenis ? window.__lenis.scrollTo(y, { duration: 1.1 }) : scrollTo({ top: y, behavior: 'smooth' });
  };
  const open = (i) => document.getElementById(`v2-ch-${items[i].key}`)?.click();
  const live = pinned !== false;

  return (
    <div ref={ref} className={'v2-ch ' + className} data-pinned={pinned === null ? undefined : String(pinned)} style={{ '--v2-n': n, '--v2-step': step }} role="group" aria-label={label}>
      <div className="v2-ch-in v2-wrap">
        <div className="v2-ch-grid">
          {items.map((it, i) => (
            <div className="v2-ch-item" key={it.key} data-on={!live || at === i} role="group" aria-label={`${i + 1} of ${n}: ${it.title}`}>
              <div className="v2-ch-text" inert={live && pinned && at !== i ? true : undefined}>
                <A id={`v2-ch-${it.key}`} to={it.to} className="v2-ch-title" data-morph="">{it.title}</A>
                <p className="v2-kicker v2-ch-count"><span>{pad(i + 1)}</span> / {pad(n)}</p>
                <div className="v2-ch-body">{it.text}</div>
              </div>
              <Visual i={i} n={n} p={p} pinned={pinned} item={it} onOpen={() => open(i)} />
            </div>
          ))}
          <nav className="v2-ch-index" aria-label={label + ': chapters'}>
            <i className="v2-ch-track" aria-hidden="true"><motion.b style={{ scaleY: fill }} /></i>
            <ol>
              {items.map((it, i) => (
                <li key={it.key}><button type="button" aria-current={at === i ? 'step' : undefined} onClick={() => jump(i)}>{it.title}</button></li>
              ))}
            </ol>
          </nav>
        </div>
      </div>
    </div>
  );
}
