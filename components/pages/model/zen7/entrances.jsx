'use client';
/* Zen 7's five entrances, page-local (docs/MOTION-MAP.md rule 7), one per section and in the map's order:
   shrink-to-card (the first screen), letter-cascade (What Zen 7 brings), card-deal (the lineage line),
   focus-pull-scroll (the research room), stack-drop (the breadcrumb that closes the page).
   Every one renders its final state on the server and with JS off; it arms only after mount, and never under
   reduced motion (read from matchMedia inside the effect, so there is no hydration mismatch). */
import { useEffect, useRef, useState } from 'react';
import { useReducedMotion, useScroll, useTransform } from 'motion/react';

const reduced = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

/* reduced motion only after mount: the server cannot know it, so the first client render must match the server HTML */
export function useCalm() {
  const rm = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return { mounted, calm: mounted && !!rm };
}

/* rest (server, JS off, reduced motion) -> armed (hidden, after mount) -> go (playing) -> rest again when done,
   so the entrance's transitions never linger on later hovers */
function useArm(amount, ms, onArm, onDone) {
  const ref = useRef(null);
  const [st, setSt] = useState('rest');
  const cb = useRef({ onArm, onDone });
  cb.current = { onArm, onDone };
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced() || !('IntersectionObserver' in window)) return;
    cb.current.onArm?.();
    setSt('armed');
    let tm, raf;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      raf = requestAnimationFrame(() => setSt('go'));
      tm = setTimeout(() => { setSt('rest'); cb.current.onDone?.(); }, ms);
    }, { threshold: amount });
    io.observe(el);
    return () => { io.disconnect(); clearTimeout(tm); cancelAnimationFrame(raf); };
  }, [amount, ms]);
  return [ref, st];
}

/* 1. shrink-to-card: as the first screen leaves, it shrinks into a rounded card on a grey tray */
export function useShrinkCard() {
  const ref = useRef(null);
  const { mounted, calm } = useCalm();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const scale = useTransform(p, [0, 0.8], [1, 0.86], { clamp: true });
  const clipPath = useTransform(p, [0, 0.35], ['inset(0px round 0px)', 'inset(0px round 24px)'], { clamp: true });
  return [ref, mounted && !calm ? { scale, clipPath } : undefined];
}

/* 2. letter-cascade: each letter falls into place, one after another */
export function Cascade({ text, as: Tag = 'h2', className, id }) {
  const words = text.split(' ');
  const [ref, st] = useArm(0.6, 400 + text.length * 34 + 520);
  let n = 0;
  return (
    <Tag ref={ref} id={id} className={className + ' z7-cascade'} data-st={st} aria-label={text}>
      <span aria-hidden="true">
        {words.map((w, wi) => (
          <span key={wi} className="z7-word">
            {[...w].map((ch, ci) => <span key={ci} className="z7-ch" style={{ '--i': n++ }}>{ch}</span>)}
            {wi < words.length - 1 ? ' ' : ''}
          </span>
        ))}
      </span>
    </Tag>
  );
}

/* 3. card-deal: the line's cards start as one deck at its centre and are dealt onto their places in turn.
   Moves with the individual `translate` and `rotate` properties, so each card's own hover and press `transform` stay */
const TILT = [-7, 5, -3, 8, -5, 4];
export const DEAL_STEP = 110, DEAL_FLY = 640;
export function useDeal(n, { onArm, onDealt } = {}) {
  const items = useRef([]);
  const [offs, setOffs] = useState(null);
  const measure = () => {
    const b = ref.current; if (!b) return;
    const r = b.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    setOffs(items.current.map((el, i) => {
      if (!el) return [0, 0, 0];
      const q = el.getBoundingClientRect();
      return [cx - (q.left + q.width / 2), cy - (q.top + q.height / 2) - i * 4, TILT[i % TILT.length]];
    }));
    onArm?.();
  };
  const [ref, st] = useArm(0.35, (n - 1) * DEAL_STEP + DEAL_FLY + 60, measure, onDealt);
  const item = (i) => ({
    ref: (el) => { items.current[i] = el; },
    'data-deal': '',
    style: st !== 'rest' && offs ? { '--dx': offs[i][0] + 'px', '--dy': offs[i][1] + 'px', '--dr': offs[i][2] + 'deg', '--i': i, '--z': n - i } : undefined,
  });
  return { ref, st, item };
}

/* 4. focus-pull-scroll: as the room scrolls in, its background field softens while the words come into focus */
export function useFocusPull() {
  const ref = useRef(null);
  const { mounted, calm } = useCalm();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start 0.95', 'start 0.4'] });
  const subject = useTransform(p, (v) => `blur(${(10 * (1 - Math.min(1, Math.max(0, v)))).toFixed(2)}px)`);
  const bg = useTransform(p, (v) => `blur(${(4 * Math.min(1, Math.max(0, v))).toFixed(2)}px)`);
  const bgScale = useTransform(p, [0, 1], [1.08, 1], { clamp: true });
  const live = mounted && !calm;
  return [ref, live ? { filter: bg, scale: bgScale } : undefined, live ? { filter: subject } : undefined];
}

/* 5. stack-drop: the closing layers drop from above one after another and land on each other with a small bounce */
export function useStackDrop(n) {
  const [ref, st] = useArm(0.5, (n - 1) * 130 + 700);
  const layer = (i) => ({ 'data-drop': '', style: { '--i': i } });
  return { ref, st, layer };
}
