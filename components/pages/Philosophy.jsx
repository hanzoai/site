'use client';
// Persona: a builder, founder or researcher deciding whether to trust Hanzo's stack, who wants to know how Hanzo thinks (arrives from About, Research, the footer or a shared link)
// Goal: understand the premise and the five laws, then open the 64 patterns and read the ones that fit their system
// CTA: Explore the 64 patterns -> #patterns (hero, data-cta="philosophy.hero", data-thumb) · closing link: Explore Hanzo -> / (data-cta="philosophy.close")
// Metric: cta_click on philosophy.close (Story: the page's own closing link), with philosophy.hero as the lead indicator
// Signature: timeline. The five operating laws on a strip you drag (or tap, or step with the arrow keys): the law under the thumb takes the panel and the hexagram beside it gains a line per law, its sixth line never settling (MOTION-MAP `timeline`).
// Beyond: "Change a line". Press any line of the hero hexagram and it flips, yin to yang, becoming the hexagram that change makes — its number, name and trigrams read from Hanzo's own sixty-four.
/* Philosophy: the Zen of Hanzo, told as a chapter book. Its idea is change itself, drawn in lines.
   A Story page on Hanzo's scale rhythm: the hexagram is the one big thing of the first screen (walking the sixty-four, changing at a press) over a 52px headline; then the five laws on a timeline you drag; the premise as a moment; the 64 as a quiet index whose every pattern opens in a sheet; the belief statement set still; deck easing only, nothing floating, every word legible with JavaScript off.
   One idea per screen, one big thing each: the hero hexagram (huge, centred, its name and trigrams either side, the
   lines that changed marked with a dot, any line you press flips), the 52px headline, caption, ask and lede at its
   foot; the five laws on a draggable strip, a hexagram building a line per law beside the law in hand, its last line
   never settling; the premise sentence beside one line that keeps opening and closing; the 64 as a
   quiet index (sequence, 8 x 8 matrix, or by lens) where every pattern opens into a sheet with its principle, practice
   and question; how we build, the method ring stepping round until you point; the stack; the questions, each beside
   its trigram; the belief statement; the close in the one dark room, 1 → 2 → 8 → 64.
   Motion: signature, the laws timeline (no pinned scene, no scroll scrub). Supporting: a line-mask cut-in on the h1, the
   premise and the stanza only, the view pill gliding (300 ms, ease-emphasis). Idle: the hero walk (with its pause control), the premise line, the laws' last line and one lap of the method ring, each ending at rest. Pointer: lines
   part their strokes under the pointer (James's "strokes parting"), rows and tiles fill. State: the sheet rises.
   The one dark room enters as a rounded card and opens to full width (MASTER §3.1 rooms). Deck timings only: 150 ms hover, 300 ms state, 400 ms fills, 800 ms line art; no springs, no overshoot.
   Ink only: hierarchy is alpha steps of black and white. Every word is Hanzo's.
   V2: 8/10 slice D: the h1 cut-in and the hexagram's draw run on CSS from first paint (arrival no longer waits for hydration); Sequence names stay whole down to 320px.
   Entrances (MOTION-MAP, philosophy/enter.js + enter.css, in order): typewriter (laws heading), venetian-type (premise),
   fold-out (the 64's view), invert-flash (method ring), side-carousel (stack rows); each plays once, none scroll-linked. */
import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { A, More } from '../kit';
import MaskLines from './proof/MaskLines';
import SceneWipe from './proof/SceneWipe';
import NoJs from '../NoJs';
import LivePause, { usePause } from '../v2/LivePause';
import '../v2/ProofScale.css';
import '../v2/ProofRhythm.css';
import '../v2/DetailSheet.css';
import { GROUPS, HEX, LENSES } from './philosophyData';
import './Philosophy.css';
import { useEnter } from './philosophy/enter';
import './philosophy/enter.css';

const TRI = { Heaven: [1, 1, 1], Lake: [1, 1, 0], Fire: [1, 0, 1], Thunder: [1, 0, 0], Wind: [0, 1, 1], Water: [0, 1, 0], Mountain: [0, 0, 1], Earth: [0, 0, 0] };
const TRI_ORDER = Object.keys(TRI);
const lines = (h) => [...TRI[h[3]], ...TRI[h[2]]]; // bottom to top: the lower trigram, then the upper
const split = (t) => { const [a, b] = t.split(' — '); return [a, b]; };
const triOf = (ls) => TRI_ORDER.find((t) => TRI[t].every((v, k) => v === ls[k]));
const hexOf = (ls) => HEX.findIndex((h) => h[2] === triOf(ls.slice(3)) && h[3] === triOf(ls.slice(0, 3)));
const pad = (n) => String(n).padStart(2, '0');

/* Six lines, bottom to top. A yang line is whole; a yin line opens in the middle (each half scales, transform only).
   hot: lines marked as changing (a dot beside them). press(i): the lines become buttons that change themselves. */
function Hexa({ ls, size = 80, drawn = 6, hot = [], press, className = '' }) {
  return (
    <span className={'xph-hx ' + className} style={{ '--w': size + 'px' }} aria-hidden={press ? undefined : true} role={press ? 'group' : undefined} aria-label={press ? 'The hexagram, line by line' : undefined}>
      {ls.map((y, i) => {
        const cls = 'xph-hl ' + (y ? 'yang' : 'yin') + (i < drawn ? '' : ' off') + (hot.includes(i) ? ' hot' : '');
        return press
          ? <button key={i} type="button" className={cls} onClick={() => press(i)} aria-label={`Line ${i + 1}, ${y ? 'whole' : 'open'}: change it`}><i /><i /></button>
          : <span key={i} className={cls}><i /><i /></span>;
      })}
    </span>
  );
}

/* ---------- hero: one hexagram walking the sixty-four; press a line to change it ---------- */
function Hero() {
  const [i, setI] = useState(0);
  const [hot, setHot] = useState([]);
  const [held, setHeld] = useState(0); // the time of the visitor's last change: the walk waits for them
  const [steps, setSteps] = useState(0);
  const [paused, pause] = usePause();
  const calm = useReducedMotion();
  const ref = useRef(null);
  const live = useInView(ref, { amount: 0.3 });
  useEffect(() => {
    if (calm || !live || paused) return;
    const t = setTimeout(() => {
      if (Date.now() - held < 7000) { setHeld((h) => h - 1); return; }
      setI((v) => {
        const n = (v + 1) % 64, a = lines(HEX[v]), b = lines(HEX[n]);
        setHot(a.map((x, k) => (x !== b[k] ? k : -1)).filter((k) => k >= 0));
        return n;
      });
      setSteps((s) => s + 1);
    }, steps ? 1800 : 900); // the first change comes within a second of arriving; then one every 1.8 s (lines move for 0.8 s of it)
    return () => clearTimeout(t);
  }, [i, calm, live, held, steps, paused]);
  const press = (k) => {
    const ls = lines(HEX[i]).map((x, j) => (j === k ? 1 - x : x));
    setI(hexOf(ls));
    setHot([k]);
    setHeld(Date.now());
  };
  const h = HEX[i];
  const [main, sub] = split(h[1]);
  return (
    <section className="xph-hero" ref={ref} aria-labelledby="xph-h1">
      <div className="pf-wrap xph-hero-g">
        <div className="xph-stage">
          <LivePause paused={paused} onToggle={pause} className="xph-pause" />
          <div className="xph-flank l" aria-live={Date.now() - held < 7000 ? 'polite' : 'off'}>
            <span className="pf-mono xph-oracle-n">{h[0]} / 64</span>
            <b>{main}</b>
          </div>
          <Hexa ls={lines(h)} size={340} hot={hot} press={press} className="xph-oracle-hx" />
          <div className="xph-flank r">
            <span>{sub} · {h[2]} over {h[3]}</span>
          </div>
        </div>
        {/* the h1 cuts in on CSS from first paint, so arrival never waits for hydration (same mask and easing as MaskLines) */}
        <h1 id="xph-h1" className="pf-display xph-h1"><span className="pf-mask-l"><span className="pf-mask-in xph-cut">The Zen</span> </span><span className="pf-mask-l"><span className="pf-mask-in xph-cut" style={{ '--d': '60ms' }}>of Hanzo</span></span></h1>
        <div className="pf-grid xph-hero-foot">
          <div className="xph-hero-a">
            <p className="pf-mono xph-cap">Philosophy</p>
            <p className="xph-sub">64 patterns for intelligent systems</p>
          </div>
          <p className="pf-body xph-lede">The <em>I Ching</em><span> is a map of change. Its 64 hexagrams describe recurring conditions: creation, resistance, conflict, growth, decay, transformation, completion and renewal.</span></p>
          <div className="xph-acts">
            <a href="#patterns" className="pf-btn solid" data-thumb="Explore the 64 patterns" data-cta="philosophy.hero">Explore the 64 patterns</a>
            <More to="https://cloud.hanzo.ai">Build with Hanzo</More>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- the premise: one sentence beside one line that keeps changing ---------- */
function Premise() {
  return (
    <section className="pf-sec xph-premise">
      <div className="pf-wrap">
        <div className="pf-grid xph-premise-top">
          <p className="pf-moment xph-big" data-enter="ven"><span className="xph-ven-l">No intelligent system</span> <span className="xph-ven-l">remains fixed.</span></p>
          <div className="xph-one" aria-hidden="true"><span className="xph-hl yang xph-one-l"><i /><i /></span></div>
        </div>
        <div className="pf-grid xph-premise-g">
          <div className="xph-premise-h">
            <h2 className="pf-title">Intelligence is always changing</h2>
            <p className="pf-mono xph-cap">The premise</p>
          </div>
          <div className="xph-premise-t">
            <p className="pf-body">Models learn. Data changes. Infrastructure fails. Organizations grow. Interfaces become dependencies. Successful architectures eventually meet conditions they were never designed to handle.</p>
            <p className="pf-body">The goal is not to prevent change. The goal is to build systems capable of changing without losing their integrity.</p>
            <p className="xph-that">That is the Zen of Hanzo.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- the five laws: a timeline you drag, a hexagram building itself beside it ---------- */
const LAWS = [
  ['See the system clearly', 'Understand the current condition before prescribing action.'],
  ['Separate what changes independently', 'Do not bind together concepts that evolve for different reasons.'],
  ['Compose capability from complete primitives', 'Small components should combine without central coordination or hidden behavior.'],
  ["Preserve the user's authority", 'The user should control their models, data, keys, infrastructure and economic participation.'],
  ['Design for the next transformation', 'Every completed system is already approaching its next condition.'],
];
const LAST = HEX[63]; // Before Completion: the hexagram that is never finished
const BUILD = lines(LAST);

/* The hexagram that the timeline builds: one line per law, bottom to top; on the fifth law the sixth line arrives and
   never settles (it flips six times, then rests as Before Completion). */
function LawStage({ at, calm }) {
  const ref = useRef(null);
  const live = useInView(ref, { amount: 0.3 });
  const [flick, setFlick] = useState(BUILD[5]);
  const [flips, setFlips] = useState(0);
  const done = at >= 4;
  useEffect(() => { if (!done) setFlips(0); }, [done]);
  useEffect(() => {
    if (!done || calm || !live || flips >= 6) return;
    const t = setTimeout(() => { setFlick((v) => 1 - v); setFlips((n) => n + 1); }, 1100);
    return () => clearTimeout(t);
  }, [done, calm, live, flips]);
  const ls = [...BUILD.slice(0, 5), done ? flick : BUILD[5]];
  const drawn = at + 1 + (done ? 1 : 0);
  const [, sub] = split(LAST[1]);
  return (
    <div className="xph-law-stage" ref={ref}>
      <div className="xph-law-hx" aria-hidden="true">
        {ls.map((y, i) => (
          <div key={i} className="xph-law-row" data-on={i < drawn} data-hot={i === (done ? 5 : at)}>
            <span className={'xph-hl ' + (y ? 'yang' : 'yin')}><i /><i /></span>
            <b className="pf-mono xph-law-n">{i < 5 ? pad(i + 1) : LAST[0]}</b>
          </div>
        ))}
      </div>
      <p className="xph-law-cap" data-on={done}>{LAST[4]}<span className="pf-mono">{LAST[0]} · {sub}</span></p>
    </div>
  );
}

/* Signature: the five laws on a timeline you drag. The strip runs law 01 to law 05; the thumb follows the finger or
   pointer anywhere along it (or the arrow keys), the law under it takes the panel, and the hexagram beside it gains a
   line per law. On release the thumb settles on the nearest law (300 ms, ease-in-out). It plays through once by itself
   when first seen, until the visitor takes it. */
function Laws() {
  const ref = useRef(null);
  const track = useRef(null);
  const seen = useInView(ref, { amount: 0.45 });
  const rm = useReducedMotion();
  const [calm, setCalm] = useState(false); // after hydration, so server and client markup match
  useEffect(() => setCalm(!!rm), [rm]);
  const [pos, setPos] = useState(0); // 0..4, continuous while dragging
  const [drag, setDrag] = useState(false);
  const [mine, setMine] = useState(false);
  const at = Math.round(pos);
  useEffect(() => {
    if (mine || calm || !seen || at >= 4) return;
    const t = setTimeout(() => setPos((p) => Math.min(4, Math.round(p) + 1)), at === 0 ? 1400 : 2600);
    return () => clearTimeout(t);
  }, [mine, calm, seen, at]);
  const fromX = (x) => {
    const r = track.current.getBoundingClientRect();
    return Math.max(0, Math.min(4, ((x - r.left) / r.width) * 4));
  };
  const down = (e) => {
    if (e.button !== undefined && e.button !== 0) return;
    setMine(true); setDrag(true);
    e.currentTarget.setPointerCapture?.(e.pointerId);
    setPos(fromX(e.clientX));
  };
  const move = (e) => { if (drag) setPos(fromX(e.clientX)); };
  const up = () => { if (!drag) return; setDrag(false); setPos((p) => Math.round(p)); };
  const go = (n) => { setMine(true); setPos(Math.max(0, Math.min(4, n))); };
  const key = (e) => {
    const k = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1 }[e.key];
    if (k) { e.preventDefault(); go(at + k); }
    else if (e.key === 'Home') { e.preventDefault(); go(0); }
    else if (e.key === 'End') { e.preventDefault(); go(4); }
  };
  return (
    <section className="pf-sec xph-laws" ref={ref} aria-labelledby="xph-laws-h">
      <div className="pf-wrap">
        <div className="pf-grid xph-laws-top" data-enter="type">
          <div className="xph-laws-t">
            <h2 className="pf-head xph-laws-h" id="xph-laws-h"><span className="xph-type"><span className="xph-type-t">Five operating laws</span></span></h2>
            <p className="pf-mono xph-cap">The synthesis</p>
          </div>
          <p className="pf-mono xph-laws-hint" aria-hidden="true">Drag the line · {pad(at + 1)} / 05</p>
        </div>
        <div className="pf-grid xph-laws-g">
          <LawStage at={at} calm={calm} />
          <div className="xph-law-panel" aria-live="polite">
            {LAWS.map(([t, d], i) => (
              <article key={t} className="xph-law-p" data-on={i === at} aria-hidden={i !== at}>
                <span className="pf-mono xph-law-k">Law {pad(i + 1)}</span>
                <h3 className="pf-title xph-law-t">{t}</h3>
                <p className="pf-lede">{d}</p>
              </article>
            ))}
          </div>
        </div>
        <div className="xph-tl" data-drag={drag} style={{ '--p': pos / 4 }}>
          <div ref={track} className="xph-tl-track" role="slider" tabIndex={0} aria-label="Five operating laws" aria-valuemin={1} aria-valuemax={5} aria-valuenow={at + 1} aria-valuetext={`Law ${at + 1}: ${LAWS[at][0]}`}
            onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onLostPointerCapture={up} onKeyDown={key}>
            <span className="xph-tl-rail" aria-hidden="true"><i /></span>
            {LAWS.map((_, i) => <span key={i} className="xph-tl-tick" data-on={i <= pos + 0.001} style={{ left: (i / 4) * 100 + '%' }} aria-hidden="true" />)}
            <span className="xph-tl-run" aria-hidden="true"><span className="xph-tl-thumb"><span className="xph-hl yang"><i /><i /></span></span></span>
          </div>
          <ol className="xph-tl-stops">
            {LAWS.map(([t], i) => (
              <li key={t} style={{ left: (i / 4) * 100 + '%' }} data-on={i === at}>
                <button type="button" tabIndex={-1} onClick={() => go(i)} aria-label={`Law ${i + 1}: ${t}`}>
                  <span className="pf-mono">{pad(i + 1)}</span><span className="xph-tl-name">{t}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ---------- the 64 patterns: a quiet index, each pattern opening into a sheet ---------- */
function Detail({ h }) {
  return (
    <article className="xph-det">
      <div className="xph-det-h">
        <Hexa ls={lines(h)} size={92} />
        <div>
          <h3 className="xph-det-t">{h[1]}</h3>
          <p className="xph-det-tri"><span className="pf-mono">{h[0]}</span> · {h[2]} <i>over</i> {h[3]}</p>
        </div>
      </div>
      <dl className="xph-det-l">
        <div><dt>Principle</dt><dd className="xph-pr">{h[4]}</dd></div>
        <div><dt>In practice</dt><dd>{h[5]}</dd></div>
        <div><dt>Ask</dt><dd className="xph-ask">{h[6]}</dd></div>
        {h[8] && <div><dt>Lenses</dt><dd className="xph-lens-d"><span className="xph-chip">{h[8]}</span><span>{LENSES[h[8]]}</span></dd></div>}
      </dl>
    </article>
  );
}

/* One sheet for all sixty-four (the kit's DetailSheet look): every pattern is in the page, the chosen one shows; the
   arrows or ← → step to its neighbours in King Wen order. */
// a native <dialog> (showModal: fixed, backdrop, focus trapped, Esc closes, nothing drawn while closed), which is what
// the kit's DetailSheet.css positions; the closed dialog's words stay in the server HTML
function PatternSheet({ sel, setSel }) {
  const open = sel !== null;
  const [shown, setShown] = useState(false); // drives the slide (data-open); the dialog itself opens a frame earlier
  const dlg = useRef(null);
  const close = useRef(null);
  const back = useRef(null);
  useEffect(() => {
    const d = dlg.current;
    if (!d) return;
    if (!open) {
      setShown(false);
      const t = setTimeout(() => { if (d.open) d.close(); const b = back.current; b?.focus?.({ preventScroll: true }); }, 420);
      return () => clearTimeout(t);
    }
    back.current = back.current && d.open ? back.current : document.activeElement;
    if (!d.open) d.showModal();
    const raf = requestAnimationFrame(() => setShown(true));
    const l = window.__lenis;
    l?.stop();
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    const t = setTimeout(() => close.current?.focus({ preventScroll: true }), 60);
    const key = (e) => {
      if (e.key === 'ArrowRight') setSel((s) => (s + 1) % 64);
      else if (e.key === 'ArrowLeft') setSel((s) => (s + 63) % 64);
    };
    addEventListener('keydown', key);
    return () => { cancelAnimationFrame(raf); clearTimeout(t); removeEventListener('keydown', key); l?.start(); document.documentElement.style.overflow = prev; };
  }, [open, setSel]);
  const cur = sel ?? 0;
  return (
    <dialog ref={dlg} className="pf-sheet xph-sheet" data-open={shown} aria-labelledby="xph-sheet-h"
      onCancel={(e) => { e.preventDefault(); setSel(null); }}
      onClick={(e) => { if (e.target === dlg.current) setSel(null); }}>
      <NoJs css="dialog.xph-sheet{display:block!important;position:static!important;width:auto!important;height:auto!important;margin:24px 0!important;background:none!important}.xph-sheet .pf-sheet-x{display:none!important}.xph-sheet .pf-sheet-panel{position:static!important;transform:none!important;width:auto!important;box-shadow:none!important}" />
      <div className="pf-sheet-panel" data-lenis-prevent>
        <div className="pf-sheet-top">
          <div>
            <p className="pf-title" id="xph-sheet-h">{HEX[cur][0]} / 64</p>
            <p className="pf-kick pf-sheet-cap">The 64 patterns</p>
          </div>
          <div className="xph-sheet-nav">
            <button type="button" className="pf-sheet-x" onClick={() => setSel((s) => (s + 63) % 64)} aria-label="Previous pattern"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M10 3.5 5.5 8l4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
            <button type="button" className="pf-sheet-x" onClick={() => setSel((s) => (s + 1) % 64)} aria-label="Next pattern"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M6 3.5 10.5 8 6 12.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
            <button ref={close} type="button" className="pf-sheet-x" onClick={() => setSel(null)} aria-label="Close"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg></button>
          </div>
        </div>
        <div className="pf-sheet-body">
          {HEX.map((h, i) => <div key={i} id={'xph-d-' + i} hidden={i !== cur}><Detail h={h} /></div>)}
        </div>
      </div>
    </dialog>
  );
}

function Tile({ h, i, open }) {
  const [main, sub] = split(h[1]);
  return (
    <button type="button" className="xph-tile" onClick={() => open(i)} aria-haspopup="dialog" aria-controls={'xph-d-' + i} aria-label={`${h[0]} ${h[1]}, ${h[2]} over ${h[3]}`}>
      <Hexa ls={lines(h)} size={40} />
      <span className="pf-mono xph-tile-n">{h[0]}</span>
      <span className="xph-tile-t">{main}</span>
      <span className="xph-tile-s"><span>{sub}</span><span className="xph-tile-p">{h[4]}</span></span>
    </button>
  );
}

function Sequence({ open }) {
  return (
    <div className="xph-seq">
      {GROUPS.map(([num, name], g) => {
        const hs = HEX.map((h, i) => [h, i]).filter(([h]) => h[7] === g);
        return (
          <section key={num} className="xph-grp" aria-labelledby={'xph-g-' + num}>
            <div className="xph-grp-h">
              <h3 id={'xph-g-' + num}>{name}</h3>
              <span className="pf-mono xph-grp-r">{num} · {hs[0][0][0]} – {hs[7][0][0]}</span>
            </div>
            <div className="xph-tiles">{hs.map(([h, i]) => <Tile key={i} h={h} i={i} open={open} />)}</div>
          </section>
        );
      })}
    </div>
  );
}

function Matrix({ open }) {
  const [hi, setHi] = useState(null); // a highlighted row (upper) or column (lower): ['u', name] | ['l', name]
  const lit = (up, lo) => hi && ((hi[0] === 'u' && hi[1] === up) || (hi[0] === 'l' && hi[1] === lo));
  const on = (k, t) => !!(hi && hi[0] === k && hi[1] === t);
  const tog = (k) => setHi((h) => (h && h[0] === k[0] && h[1] === k[1] ? null : k));
  return (
    <div className="xph-mx">
      <div className="xph-mx-side">
        <p className="pf-body">Each hexagram stacks two trigrams — the lower force (bottom three lines) beneath the upper force (top three lines). Select a row or column to see how one force meets every other.</p>
        <p className="xph-mx-leg"><span className="xph-mx-leg-h">The eight trigrams</span>{TRI_ORDER.map((t) => <span key={t}><Hexa ls={TRI[t]} size={16} />{t}</span>)}</p>
      </div>
      <div className="xph-mx-scroll">
        <div className={'xph-mx-g' + (hi ? ' hi' : '')}>
          <div className="xph-mx-c xph-mx-k"><span>U/L</span></div>
          {TRI_ORDER.map((t) => <button key={t} type="button" className={'xph-mx-c xph-mx-k xph-mx-h' + (on('l', t) ? ' on' : '')} onClick={() => tog(['l', t])} aria-pressed={on('l', t)} aria-label={'Lower: ' + t}><Hexa ls={TRI[t]} size={20} /><span>{t}</span></button>)}
          {TRI_ORDER.map((up) => (
            <div key={up} className="xph-mx-row">
              <button type="button" className={'xph-mx-c xph-mx-k xph-mx-h' + (on('u', up) ? ' on' : '')} onClick={() => tog(['u', up])} aria-pressed={on('u', up)} aria-label={'Upper: ' + up}><Hexa ls={TRI[up]} size={20} /><span>{up}</span></button>
              {TRI_ORDER.map((lo) => {
                const i = HEX.findIndex((h) => h[2] === up && h[3] === lo);
                return (
                  <button key={lo} type="button" className={'xph-mx-c xph-mx-b' + (lit(up, lo) ? ' lit' : '')} onClick={() => open(i)} aria-haspopup="dialog" aria-label={`${HEX[i][0]} ${HEX[i][1]}: ${up} over ${lo}`}>
                    <Hexa ls={lines(HEX[i])} size={30} /><span className="pf-mono">{HEX[i][0]}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Lenses() {
  const [lens, setLens] = useState(null);
  const names = Object.keys(LENSES);
  const hs = HEX.map((h, i) => [h, i]).filter(([h]) => (lens ? h[8] === lens : h[8]));
  return (
    <div className="xph-lenses">
      <div className="xph-chips">
        {[null, ...names].map((n) => (
          <button key={n || 'all'} type="button" aria-pressed={lens === n} onClick={() => setLens(n)}>
            {lens === n && <motion.span layoutId="xph-lens-pill" className="xph-pill" transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} />}
            <span>{n || 'All lensed patterns'}</span>{n && <span className="pf-mono">{HEX.filter((h) => h[8] === n).length}</span>}
          </button>
        ))}
      </div>
      <p className="pf-body xph-lens-p">{lens ? <><b>{lens}.</b> {LENSES[lens]}</> : 'Four modern minds read the same sixty-four patterns. Select one to see the conditions it illuminates.'}</p>
      <div className="xph-lens-l">{hs.map(([h, i]) => <div key={i} className="xph-lens-card"><Detail h={h} /></div>)}</div>
    </div>
  );
}

const VIEWS = ['Sequence', 'Matrix', 'Lenses'];
const HINTS = ['All sixty-four, in the traditional King Wen order.', 'The eight forces above and below — every pairing is one condition.', 'The same patterns, read through four modern minds.'];

function Patterns() {
  const [view, setView] = useState('Matrix'); // the 64 as one 8×8 object first; Sequence is a tab away
  const [sel, setSel] = useState(null);
  const keys = (e) => {
    const k = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    if (!k) return;
    const n = (VIEWS.indexOf(view) + k + 3) % 3;
    setView(VIEWS[n]);
    document.getElementById('tab-' + VIEWS[n].toLowerCase())?.focus();
  };
  return (
    <section className="pf-sec xph-pat" id="patterns">
      <div className="pf-wrap">
        <div className="pf-grid xph-pat-h">
          <div className="xph-pat-t">
            <h2 className="pf-head">Every hexagram is active</h2>
            <p className="pf-mono xph-cap">The 64 patterns</p>
          </div>
          <p className="pf-lede xph-pat-l">Each represents a condition that can appear in a model, an application, a company, a network or an entire technological ecosystem. The classical title names the condition. The Hanzo principle defines how we respond.</p>
        </div>
        <div className="xph-bar">
          <div className="xph-views" role="tablist" aria-label="View" onKeyDown={keys}>
            {VIEWS.map((v) => (
              <button key={v} type="button" role="tab" id={'tab-' + v.toLowerCase()} aria-selected={view === v} tabIndex={view === v ? 0 : -1} aria-controls={'panel-' + v.toLowerCase()} onClick={() => setView(v)}>
                {view === v && <motion.span layoutId="xph-view-pill" className="xph-view-bg" transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} />}
                <span>{v}</span>
              </button>
            ))}
          </div>
          <div className="xph-hints">{VIEWS.map((v, i) => <p key={v} className="pf-mono xph-hint" hidden={view !== v}>{HINTS[i]}</p>)}</div>
        </div>
        {/* all three views are in the page; the chosen one is shown */}
        <div className="xph-fold" data-enter="fold">
        <div id="panel-sequence" role="tabpanel" aria-labelledby="tab-sequence" hidden={view !== 'Sequence'}><Sequence open={setSel} /></div>
        <div id="panel-matrix" role="tabpanel" aria-labelledby="tab-matrix" hidden={view !== 'Matrix'}><Matrix open={setSel} /></div>
        <div id="panel-lenses" role="tabpanel" aria-labelledby="tab-lenses" hidden={view !== 'Lenses'}><Lenses /></div>
        </div>
      </div>
      <PatternSheet sel={sel} setSel={setSel} />
    </section>
  );
}

/* ---------- the method: a cycle you point at ---------- */
const METHOD = [['Observe', 'Identify the actual condition of the system.'], ['Separate', 'Untangle concerns that change for different reasons.'], ['Reduce', 'Find the smallest complete set of concepts.'], ['Compose', 'Combine orthogonal primitives into greater capability.'], ['Verify', 'Measure behavior instead of trusting intention.'], ['Adapt', 'Respond to evidence without abandoning the foundation.'], ['Distribute', 'Place data, computation and authority where they belong.'], ['Continue', 'Treat every completion as the beginning of another cycle.']];

function Method() {
  const [at, setAt] = useState(0);
  const [mine, setMine] = useState(false); // once the visitor points at a step, the cycle is theirs
  const [lap, setLap] = useState(0);
  const calm = useReducedMotion();
  const ref = useRef(null);
  const live = useInView(ref, { amount: 0.2 });
  useEffect(() => {
    if (mine || calm || !live || lap >= 8) return; // one lap by itself, then it rests back on Observe
    const t = setTimeout(() => { setAt((v) => (v + 1) % 8); setLap((n) => n + 1); }, 2400);
    return () => clearTimeout(t);
  }, [at, mine, calm, live, lap]);
  const take = (i) => { setMine(true); setAt(i); };
  return (
    <section className="pf-sec xph-method" ref={ref}>
      <div className="pf-wrap pf-grid xph-method-g">
        <div className="xph-method-l">
          <h2 className="pf-head">How we build</h2>
          <p className="pf-mono xph-cap">The method</p>
          <div className="xph-ring" data-enter="invert" aria-hidden="true" style={{ '--at': at }}>
            <svg viewBox="0 0 200 200"><circle cx="100" cy="100" r="86" /></svg>
            <i className="xph-hand" />
            {METHOD.map(([t], i) => {
              const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
              return <span key={t} className={'xph-node pf-mono' + (i === at ? ' on' : '')} style={{ left: 50 + Math.cos(a) * 43 + '%', top: 50 + Math.sin(a) * 43 + '%' }}>{pad(i + 1)}</span>;
            })}
            <div className="xph-ring-c">{METHOD.map(([t], i) => <b key={t} data-on={i === at}>{t}</b>)}</div>
          </div>
        </div>
        <ol className="xph-steps">
          {METHOD.map(([t, d], i) => (
            <li key={t} data-on={i === at}>
              <button type="button" aria-pressed={i === at} onClick={() => take(i)} onPointerEnter={(e) => e.pointerType === 'mouse' && take(i)} onFocus={() => take(i)}>
                <span className="pf-mono">{pad(i + 1)}</span>
                <h3>{t}</h3>
                <p>{d}</p>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------- across the stack: an editorial index ---------- */
const STACK = [
  ['Hanzo Models', 'Open and adaptable intelligence across language, vision, audio, code, tools and physical systems.', '/models'],
  ['Hanzo Platform', 'One control plane, assembled from services you can take apart.', '/platform'],
  ['Hanzo Engine', 'Efficient execution built around measurable performance, hardware awareness and composable runtimes.', '/engine'],
  ['Hanzo Router', 'Model choice treated as a changing systems problem—balancing capability, latency, cost, privacy and availability.', '/gateway'],
  ['Hanzo Network', 'Distributed intelligence designed to reduce centralized dependence and share value with those who contribute compute, models, code and knowledge.', '/network'],
  ['Hanzo Open Source', 'Infrastructure that can be inspected, operated, modified and carried forward by the people who depend upon it.', '/open-source'],
];

function Stack() {
  return (
    <section className="pf-sec xph-stack">
      <div className="pf-wrap">
        <div className="xph-stack-h">
          <h2 className="pf-head">One philosophy</h2>
          <p className="pf-mono xph-cap">Across the stack</p>
        </div>
        <ul className="xph-stack-l" data-enter="carousel">
          {STACK.map(([t, d, to], i) => (
            <li key={t}>
              <A to={to}>
                <Hexa ls={lines(HEX[[0, 1, 13, 62, 7, 12][i]])} size={34} />
                <span className="xph-stack-n" data-morph>{t}</span>
                <span>{d}</span>
                <i aria-hidden="true"><svg viewBox="0 0 16 16" width="18" height="18"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></i>
              </A>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------- the questions, each beside its trigram ---------- */
const QUESTIONS = ['Is it understandable?', 'Is it composable?', 'Is it verifiable?', 'Can it operate privately?', 'Can the user leave?', 'Can it survive failure?', 'Can it evolve without being destroyed?', 'Does it increase human agency?'];

function Change() {
  // the one big thing of this screen: the question's own trigram drawn large; it walks the eight once on arrival,
  // then follows the pointer or focus
  const ref = useRef(null);
  const seen = useInView(ref, { amount: 0.4 });
  const calm = useReducedMotion();
  const [q, setQ] = useState(0);
  const [mine, setMine] = useState(false);
  useEffect(() => {
    if (!seen || mine || calm) return;
    const t = setTimeout(() => { if (q >= 7) { setMine(true); setQ(0); } else setQ(q + 1); }, 900);
    return () => clearTimeout(t);
  }, [seen, mine, calm, q]);
  const pick = (i) => { setMine(true); setQ(i); };
  return (
    <section className="pf-sec xph-change" ref={ref}>
      <div className="pf-wrap pf-grid xph-change-g">
        <div className="xph-change-l">
          <h2 className="pf-head">Build systems that can change</h2>
          <p className="pf-lede">The purpose of a philosophy is not to decorate a company. It is to make difficult decisions clearer.</p>
          <div className="xph-change-big" aria-hidden="true"><Hexa ls={TRI[TRI_ORDER[q]]} size={150} /><span className="pf-mono">{pad(q + 1)} / 08</span></div>
        </div>
        <div className="xph-change-r">
          <p className="pf-body">When we design a model, an API, an agent, a database or a network, we return to the same questions:</p>
          <ol className="xph-qs">{QUESTIONS.map((x, i) => <li key={x} data-on={q === i ? '' : undefined} tabIndex={-1} onPointerEnter={(e) => e.pointerType === 'mouse' && pick(i)} onClick={() => pick(i)}><Hexa ls={TRI[TRI_ORDER[i]]} size={22} /><span className="pf-mono">{pad(i + 1)}</span><span>{x}</span></li>)}</ol>
        </div>
      </div>
    </section>
  );
}

const WHOLE = ['The Zen of Hanzo is not a promise that systems will remain still.', 'It is a method for building systems that remain whole while everything changes.'];
/* ---------- the belief statement: set still, in full ink (the timeline is this page's motion) ---------- */
function Whole() {
  return (
    <section className="pf-sec xph-whole">
      <div className="pf-wrap">
        {/* Hanzo's statement is one line of text (the real leaf, read and selected); the two tones are drawn by an
            aria-hidden copy set exactly under it */}
        <h2 className="pf-moment xph-whole-t"><span className="xph-whole-r">{WHOLE[0]} {WHOLE[1]}</span><span className="xph-whole-v" aria-hidden="true">{WHOLE[0]} <span className="xph-whole-b">{WHOLE[1]}</span></span></h2>
      </div>
    </section>
  );
}

/* ---------- the close, in the one dark room: from one line to sixty-four conditions ---------- */
function Close() {
  const stanza = ['From one line, two forces.', 'From two forces, eight patterns.', 'From eight patterns, sixty-four conditions.', 'From small primitives, unbounded intelligence.'];
  return (
    <SceneWipe className="xph-close" label="From one line to sixty-four conditions">
      <div className="pf-sec"><div className="pf-wrap">
        <div className="xph-grow" aria-hidden="true">
          <div className="xph-g1"><span className="xph-hl yang xph-one-l"><i /><i /></span></div>
          <span className="xph-gto" />
          <div className="xph-g2"><Hexa ls={[1]} size={56} /><Hexa ls={[0]} size={56} /></div>
          <span className="xph-gto" />
          <div className="xph-g8">{TRI_ORDER.map((t) => <Hexa key={t} ls={TRI[t]} size={26} />)}</div>
          <span className="xph-gto" />
          <div className="xph-g64">{HEX.map((h, i) => <Hexa key={i} ls={lines(h)} size={15} />)}</div>
        </div>
        <MaskLines as="h2" className="pf-head xph-stanza" lines={stanza} />
        <div className="xph-close-acts">
          <A to="/" className="pf-btn solid" data-cta="philosophy.close">Explore Hanzo</A>
          <More to="https://papers.hanzo.ai">Read the research</More>
          <More to="https://github.com/hanzoai">View the source</More>
        </div>
      </div></div>
    </SceneWipe>
  );
}

export default function Philosophy() {
  useEnter('.xph');
  return (
    <main id="main" className="xph pf-r">
      {/* JavaScript off: the five laws are laid out one under another and the strip is hidden, every view and all 64 patterns are laid out in the page, tiles show their principle */}
      <NoJs css=".xph-law-p{position:static!important;opacity:1!important;transform:none!important;visibility:visible!important;margin-bottom:32px}.xph-law-panel{display:block!important;height:auto!important}.xph-tl,.xph-laws-hint{display:none!important}.xph-law-row .xph-hl i{opacity:1!important}#panel-matrix,#panel-lenses,.xph-hint{display:block!important}#panel-matrix,#panel-lenses{margin-top:96px}.xph-mx-side{position:static!important}.xph-tile-s>span{grid-area:auto!important;opacity:1!important;transform:none!important}.xph-sheet{position:static!important;visibility:visible!important;pointer-events:auto!important;margin-top:96px}.xph-sheet .xph-sheet-nav{display:none!important}.xph-sheet .pf-sheet-panel{position:static!important;transform:none!important;width:auto!important;box-shadow:none!important;border-radius:0!important;overflow:visible!important}.xph-sheet .pf-sheet-top{padding:0 0 20px!important}.xph-sheet .pf-sheet-body{overflow:visible!important;padding:0!important}.xph-sheet [hidden]{display:block!important;margin-top:56px}" />
      <Hero />
      <Laws />
      <Premise />
      <Patterns />
      <Method />
      <Stack />
      <Change />
      <Whole />
      <Close />
    </main>
  );
}
