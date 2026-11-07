'use client';
// Persona: a builder, founder or researcher deciding whether to trust Hanzo's stack, who wants to know how Hanzo thinks (arrives from About, Research, the footer or a shared link)
// Goal: understand the premise and the five laws, then open the 64 patterns and read the ones that fit their system
// CTA: Explore the 64 patterns -> #patterns (hero, sticky AskBar and thumb bar) · metric cta_click (data-cta="explore-patterns"); close: Explore Hanzo -> / (data-cta="explore-hanzo")
/* Philosophy: the Zen of Hanzo, told as a chapter book. Its idea is change itself, drawn in lines.
   V2: 8/10 an editorial chapter book in ink only: the hexagram as a huge centred stage object that walks the sixty-four and changes at a press, the headline set across the foot of the first screen, the five laws pinned while one hexagram builds beside them, the 64 as a quiet index whose every pattern opens in a sheet, the belief statement filling in word by word, one ask that follows you; every word legible with JavaScript off.
   The hero is a stage: one hexagram, huge and centred, that never holds still: it walks the sixty-four in King Wen
   order, the lines that changed marked with a dot, and any line you press flips; its name and trigrams sit either side
   of it, and "The Zen of Hanzo" runs across the foot of the screen (osply / hamol: editorial type as the floor). Then one idea per screen: the premise as a single sentence beside one
   line that keeps opening and closing; the five laws as chapters that pin while a hexagram builds itself beside them, one
   line per law, its last line never settling; the 64 patterns as a quiet index (by sequence, as the 8 x 8 matrix of
   trigrams, or by lens) where every pattern opens into a sheet with its principle, practice and question and steps to its
   neighbours; how we build; the stack; the questions, each beside its trigram; the belief statement filling in word by
   word as you read; and the close in the one dark room, from one line to sixty-four conditions. Ink only: hierarchy is
   alpha steps of black and white (JAMES.md 7).
   Motion: signature, the changing line (the hexagram's lines flipping: hero, laws, the premise's one line, the close).
   Supporting: line-masked headings, the scroll word reveal of the belief statement, the pattern sheet that opens.
   Idle: the hero walk, the premise line, the laws' last line. Pointer: press a line, tiles lift, the method hand
   follows, stack rows fill. State: the view pill glides (layoutId), the sheet rises.
   Signature: the five laws pin as chapters while one hexagram builds itself beside them, a line per law, and its last line never stops changing.
   Beyond: "Change a line". Press any line of the hero hexagram and it flips, yin to yang, becoming the hexagram that change makes — its number, name and trigrams read from Hanzo's own sixty-four.
   Every word is Hanzo's. */
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { A, More } from '../kit';
import MaskLines from '../v2/MaskLines';
import PinScenes from '../v2/PinScenes';
import AskBar from '../v2/AskBar';
import '../v2/ProofScale.css';
import '../v2/DetailSheet.css';
import { GROUPS, HEX, LENSES } from './philosophyData';
import './Philosophy.css';

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
  const calm = useReducedMotion();
  const ref = useRef(null);
  const live = useInView(ref, { amount: 0.3 });
  useEffect(() => {
    if (calm || !live) return;
    const t = setTimeout(() => {
      if (Date.now() - held < 7000) { setHeld((h) => h - 1); return; }
      setI((v) => {
        const n = (v + 1) % 64, a = lines(HEX[v]), b = lines(HEX[n]);
        setHot(a.map((x, k) => (x !== b[k] ? k : -1)).filter((k) => k >= 0));
        return n;
      });
      setSteps((s) => s + 1);
    }, steps ? 2300 : 900); // the first change comes within a second of arriving
    return () => clearTimeout(t);
  }, [i, calm, live, held, steps]);
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
          <div className="xph-flank l" aria-live={Date.now() - held < 7000 ? 'polite' : 'off'}>
            <span className="pf-mono xph-oracle-n">{h[0]} / 64</span>
            <b>{main}</b>
          </div>
          <Hexa ls={lines(h)} size={340} hot={hot} press={press} className="xph-oracle-hx" />
          <div className="xph-flank r">
            <span>{sub} · {h[2]} over {h[3]}</span>
          </div>
        </div>
        <MaskLines as="h1" id="xph-h1" className="pf-display xph-h1" lines={['The Zen', 'of Hanzo']} amount={0.1} />
        <div className="pf-grid xph-hero-foot">
          <div className="xph-hero-a">
            <p className="pf-mono xph-cap">Philosophy</p>
            <p className="xph-sub">64 patterns for intelligent systems</p>
          </div>
          <p className="pf-body xph-lede">The <em>I Ching</em> is a map of change. Its 64 hexagrams describe recurring conditions: creation, resistance, conflict, growth, decay, transformation, completion and renewal.</p>
          <div className="xph-acts">
            <a href="#patterns" className="pf-btn solid" data-thumb="Explore the 64 patterns" data-cta="explore-patterns">Explore the 64 patterns</a>
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
          <MaskLines as="p" className="pf-display s xph-big" lines={['No intelligent system', 'remains fixed.']} />
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

/* ---------- the five laws: chapters that pin, a hexagram building itself beside them ---------- */
const LAWS = [
  ['See the system clearly', 'Understand the current condition before prescribing action.'],
  ['Separate what changes independently', 'Do not bind together concepts that evolve for different reasons.'],
  ['Compose capability from complete primitives', 'Small components should combine without central coordination or hidden behavior.'],
  ["Preserve the user's authority", 'The user should control their models, data, keys, infrastructure and economic participation.'],
  ['Design for the next transformation', 'Every completed system is already approaching its next condition.'],
];
const LAST = HEX[63]; // Before Completion: the hexagram that is never finished
const BUILD = lines(LAST);

function LawStage({ at }) {
  const ref = useRef(null);
  const live = useInView(ref, { amount: 0.3 });
  const calm = useReducedMotion();
  const [flick, setFlick] = useState(BUILD[5]);
  const done = at >= 4;
  useEffect(() => {
    if (!done || calm || !live) return;
    const t = setInterval(() => setFlick((v) => 1 - v), 1100);
    return () => clearInterval(t);
  }, [done, calm, live]);
  const ls = [...BUILD.slice(0, 5), done ? flick : BUILD[5]];
  const drawn = at + 1 + (done ? 1 : 0);
  const [main, sub] = split(LAST[1]);
  return (
    <div className="xph-law-stage" ref={ref}>
      <div className="xph-law-hx" style={{ '--w': 'clamp(240px, 27vw, 400px)' }} aria-hidden="true">
        {ls.map((y, i) => (
          <div key={i} className="xph-law-row" data-on={i < drawn} data-hot={i === (done ? 5 : at)}>
            <span className={'xph-hl ' + (y ? 'yang' : 'yin')}><i /><i /></span>
            <span className="xph-law-lab"><b className="pf-mono">{pad(i + 1)}</b>{i < 5 ? LAWS[i][0] : `${LAST[0]} · ${main}`}</span>
          </div>
        ))}
      </div>
      <p className="xph-law-cap" data-on={done} aria-hidden="true">{LAST[4]}<span className="pf-mono">{LAST[0]} · {sub}</span></p>
    </div>
  );
}

function Laws() {
  return (
    <>
      <section className="pf-sec xph-laws-in" aria-labelledby="xph-laws-h">
        <div className="pf-wrap">
          <MaskLines as="h2" id="xph-laws-h" className="pf-display m xph-laws-h" lines={['Five operating', 'laws']} />
          <p className="pf-mono xph-cap">The synthesis</p>
        </div>
      </section>
      <PinScenes
        className="xph-laws"
        label="Five operating laws"
        per={70}
        chapters={LAWS.map(([t, d]) => ({ title: t, body: <p className="pf-lede">{d}</p> }))}
        visual={(at) => <LawStage at={at} />}
      />
    </>
  );
}

/* ---------- the 64 patterns: a quiet index, each pattern opening into a sheet ---------- */
function Detail({ h }) {
  const [main, sub] = split(h[1]);
  return (
    <article className="xph-det">
      <div className="xph-det-h">
        <Hexa ls={lines(h)} size={92} />
        <div>
          <h3 className="xph-det-t">{main}</h3>
          <p className="xph-det-s">{sub}</p>
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
function PatternSheet({ sel, setSel }) {
  const open = sel !== null;
  const [host, setHost] = useState(null);
  const close = useRef(null);
  const back = useRef(null);
  useEffect(() => setHost(document.body), []);
  useEffect(() => {
    if (!open) return;
    back.current = document.activeElement;
    const l = window.__lenis;
    l?.stop();
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    const t = setTimeout(() => close.current?.focus(), 60);
    const key = (e) => {
      if (e.key === 'Escape') setSel(null);
      else if (e.key === 'ArrowRight') setSel((s) => (s + 1) % 64);
      else if (e.key === 'ArrowLeft') setSel((s) => (s + 63) % 64);
    };
    addEventListener('keydown', key);
    return () => {
      clearTimeout(t); removeEventListener('keydown', key); l?.start(); document.documentElement.style.overflow = prev;
      const b = back.current; setTimeout(() => b?.focus?.({ preventScroll: true }), 30);
    };
  }, [open, setSel]);
  const cur = sel ?? 0;
  const sheet = (
    <div className="pf-sheet xph-sheet" data-open={open} aria-hidden={host ? !open : undefined}>
      <div className="pf-sheet-scrim" onClick={() => setSel(null)} />
      <div className="pf-sheet-panel" role="dialog" aria-modal="true" aria-labelledby="xph-sheet-h" inert={host ? !open : undefined} data-lenis-prevent>
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
    </div>
  );
  return host ? createPortal(sheet, host) : sheet;
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
        <p className="xph-mx-leg"><b>The eight trigrams</b>{TRI_ORDER.map((t) => <span key={t}><Hexa ls={TRI[t]} size={16} />{t}</span>)}</p>
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
            {lens === n && <motion.span layoutId="xph-lens-pill" className="xph-pill" transition={{ type: 'spring', stiffness: 500, damping: 35 }} />}
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
  const [view, setView] = useState('Sequence');
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
                {view === v && <motion.span layoutId="xph-view-pill" className="xph-view-bg" transition={{ type: 'spring', stiffness: 500, damping: 35 }} />}
                <span>{v}</span>
              </button>
            ))}
          </div>
          <div className="xph-hints">{VIEWS.map((v, i) => <p key={v} className="pf-mono xph-hint" hidden={view !== v}>{HINTS[i]}</p>)}</div>
        </div>
        {/* all three views are in the page; the chosen one is shown */}
        <div id="panel-sequence" role="tabpanel" aria-labelledby="tab-sequence" hidden={view !== 'Sequence'}><Sequence open={setSel} /></div>
        <div id="panel-matrix" role="tabpanel" aria-labelledby="tab-matrix" hidden={view !== 'Matrix'}><Matrix open={setSel} /></div>
        <div id="panel-lenses" role="tabpanel" aria-labelledby="tab-lenses" hidden={view !== 'Lenses'}><Lenses /></div>
      </div>
      <PatternSheet sel={sel} setSel={setSel} />
    </section>
  );
}

/* ---------- the method: a cycle you point at ---------- */
const METHOD = [['Observe', 'Identify the actual condition of the system.'], ['Separate', 'Untangle concerns that change for different reasons.'], ['Reduce', 'Find the smallest complete set of concepts.'], ['Compose', 'Combine orthogonal primitives into greater capability.'], ['Verify', 'Measure behavior instead of trusting intention.'], ['Adapt', 'Respond to evidence without abandoning the foundation.'], ['Distribute', 'Place data, computation and authority where they belong.'], ['Continue', 'Treat every completion as the beginning of another cycle.']];

function Method() {
  const [at, setAt] = useState(0);
  return (
    <section className="pf-sec xph-method">
      <div className="pf-wrap pf-grid xph-method-g">
        <div className="xph-method-l">
          <h2 className="pf-head">How we build</h2>
          <p className="pf-mono xph-cap">The method</p>
          <div className="xph-ring" aria-hidden="true" style={{ '--at': at }}>
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
              <button type="button" aria-pressed={i === at} onClick={() => setAt(i)} onPointerEnter={(e) => e.pointerType === 'mouse' && setAt(i)} onFocus={() => setAt(i)}>
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
        <ul className="xph-stack-l">
          {STACK.map(([t, d, to], i) => (
            <li key={t}>
              <A to={to}>
                <Hexa ls={lines(HEX[[0, 1, 13, 62, 7, 12][i]])} size={34} />
                <b data-morph>{t}</b>
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
  return (
    <section className="pf-sec xph-change">
      <div className="pf-wrap pf-grid xph-change-g">
        <div className="xph-change-l">
          <h2 className="pf-head">Build systems that can change</h2>
          <p className="pf-lede">The purpose of a philosophy is not to decorate a company. It is to make difficult decisions clearer.</p>
        </div>
        <div className="xph-change-r">
          <p className="pf-body">When we design a model, an API, an agent, a database or a network, we return to the same questions:</p>
          <ol className="xph-qs">{QUESTIONS.map((q, i) => <li key={q}><Hexa ls={TRI[TRI_ORDER[i]]} size={22} /><span className="pf-mono">{pad(i + 1)}</span><span>{q}</span></li>)}</ol>
        </div>
      </div>
    </section>
  );
}

/* ---------- the belief statement, filling in word by word as you read it ---------- */
const WHOLE = 'The Zen of Hanzo is not a promise that systems will remain still. It is a method for building systems that remain whole while everything changes.';
function Word({ p, a, b, children }) {
  const o = useTransform(p, [a, b], [0.14, 1]);
  return <motion.span className="xph-w" style={{ opacity: o }}>{children}</motion.span>;
}
function Whole() {
  const ref = useRef(null);
  const calm = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] });
  const words = WHOLE.split(' ');
  return (
    <section className="pf-sec xph-whole" ref={ref}>
      <div className="pf-wrap">
        <h2 className="pf-display s xph-whole-t">
          {calm ? WHOLE : words.map((w, i) => <Word key={i} p={scrollYProgress} a={i / words.length} b={(i + 1.6) / words.length}>{w}{i < words.length - 1 ? ' ' : ''}</Word>)}
        </h2>
      </div>
    </section>
  );
}

/* ---------- the close, in the one dark room: from one line to sixty-four conditions ---------- */
function Close() {
  const stanza = ['From one line, two forces.', 'From two forces, eight patterns.', 'From eight patterns, sixty-four conditions.', 'From small primitives, unbounded intelligence.'];
  return (
    <section className="pf-sec xph-close" data-room="dark" aria-label="From one line to sixty-four conditions">
      <div className="pf-wrap">
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
          <A to="/" className="pf-btn solid" data-cta="explore-hanzo">Explore Hanzo</A>
          <More to="https://papers.hanzo.ai">Read the research</More>
          <More to="https://github.com/hanzoai">View the source</More>
        </div>
      </div>
    </section>
  );
}

export default function Philosophy() {
  return (
    <main className="xph">
      {/* JavaScript off: the word reveal is full ink, every view and all 64 patterns are laid out in the page, tiles show their principle */}
      <noscript dangerouslySetInnerHTML={{ __html: '<style>.xph-w{opacity:1!important}#panel-matrix,#panel-lenses,.xph-hint{display:block!important}#panel-matrix,#panel-lenses{margin-top:96px}.xph-mx-side{position:static!important}.xph-tile-s>span{grid-area:auto!important;opacity:1!important;transform:none!important}.xph-sheet{position:static!important;visibility:visible!important;pointer-events:auto!important;margin-top:96px}.xph-sheet .pf-sheet-scrim,.xph-sheet .xph-sheet-nav{display:none!important}.xph-sheet .pf-sheet-panel{position:static!important;transform:none!important;width:auto!important;box-shadow:none!important;border-radius:0!important;overflow:visible!important}.xph-sheet .pf-sheet-top{padding:0 0 20px!important}.xph-sheet .pf-sheet-body{overflow:visible!important;padding:0!important}.xph-sheet [hidden]{display:block!important;margin-top:56px}</style>' }} />
      <Hero />
      <Premise />
      <Laws />
      <Patterns />
      <Method />
      <Stack />
      <Change />
      <Whole />
      <Close />
      <AskBar title="Philosophy" label="Explore the 64 patterns" to="/philosophy#patterns" cta="explore-patterns" />
    </main>
  );
}
