'use client';
/* Decode (page-local to /security): the page's signature, MOTION-MAP `decode`. A name or a mechanism term resolves out of
   scrambled characters as it arrives, left to right with a little jitter (each letter keeps its case, digits stay
   digits, spaces and punctuation hold still); a fine pointer over it (or over its `host`, the closest ancestor matching
   that selector) scrambles it again and lets it resolve. The real words are always in the DOM, in place: the scramble
   is drawn over them while it runs (aria-hidden, absolutely placed, so nothing reflows), and they are what the server
   renders, what screen readers read and what shows with JavaScript off or reduced motion (applied after hydration).
   Props: text, run (it resolves each time this turns true), hold (while run is false, show a still scramble: the term
   has not arrived yet), dur (ms, default 520), host (selector), className, as. */
import { useEffect, useRef, useState } from 'react';
import type { ElementType } from 'react';
import { useReducedMotion } from 'motion/react';

const UP = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
const LO = 'abcdefghijkmnopqrstuvwxyz';
const DG = '0123456789';
const pick = (s: string) => s[(Math.random() * s.length) | 0];
const glyph = (c: string) => (/[A-Z]/.test(c) ? pick(UP) : /[a-z]/.test(c) ? pick(LO) : /[0-9]/.test(c) ? pick(DG) : c);
const scramble = (t: string) => Array.from(t, glyph).join('');

interface DecodeProps { text: string; run?: boolean; hold?: boolean; dur?: number; host?: string; className?: string; as?: ElementType }

export default function Decode({ text, run = true, hold = false, dur = 520, host, className = '', as: Tag = 'span' }: DecodeProps) {
  const ref = useRef<HTMLElement>(null);
  const rm = useReducedMotion();
  const [calm, setCalm] = useState(false);
  useEffect(() => setCalm(!!rm), [rm]);
  const [out, setOut] = useState<string | null>(null); // null: the real words show; a string: the scramble drawn over them
  const [one, setOne] = useState(true); // the words sit on one line: keep the scramble on one line too (glyph widths vary)
  const raf = useRef(0);
  const measure = () => { const t = ref.current?.firstChild as Element | null | undefined; if (t) setOne(t.getClientRects().length <= 1); };
  const play = (ms: number) => {
    cancelAnimationFrame(raf.current);
    measure();
    const n = text.length;
    const at = Array.from(text, (_, i) => (i / Math.max(1, n - 1)) * ms * 0.72 + Math.random() * ms * 0.28);
    const t0 = performance.now();
    let last = 0;
    const step = (now: number) => {
      const e = now - t0;
      if (e >= ms) { setOut(null); return; }
      if (now - last > 45) { // a new glyph every ~45 ms, not every frame: it reads as characters, not noise
        last = now;
        setOut(Array.from(text, (c, i) => (e >= at[i] ? c : glyph(c))).join(''));
      }
      raf.current = requestAnimationFrame(step);
    };
    setOut(scramble(text));
    raf.current = requestAnimationFrame(step);
  };
  // arrive: resolve each time `run` turns true; before that, a still scramble when `hold`
  useEffect(() => {
    if (calm) { cancelAnimationFrame(raf.current); setOut(null); return; }
    if (run) play(dur);
    else if (hold) { cancelAnimationFrame(raf.current); measure(); setOut(scramble(text)); }
    else { cancelAnimationFrame(raf.current); setOut(null); }
    return () => cancelAnimationFrame(raf.current);
  }, [run, hold, calm, text]); // eslint-disable-line react-hooks/exhaustive-deps
  // hover: scramble again and resolve (fine pointers only; a tap already chooses)
  useEffect(() => {
    const el = ref.current;
    const h = host ? el?.closest<HTMLElement>(host) : el;
    if (!h || calm) return;
    const enter = (e: PointerEvent) => { if (e.pointerType === 'mouse' && run) play(Math.min(dur, 420)); };
    h.addEventListener('pointerenter', enter);
    return () => h.removeEventListener('pointerenter', enter);
  }, [host, calm, run, text, dur]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <Tag ref={ref} className={'xdc ' + className} data-run={out !== null ? 'true' : undefined} data-one={one && out !== null ? 'true' : undefined}>
      <span className="xdc-t">{text}</span>
      {out !== null && <span className="xdc-fx" aria-hidden="true">{out}</span>}
    </Tag>
  );
}
