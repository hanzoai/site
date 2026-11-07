'use client';
/* Zen: open models, yours to run.
   Signature: the reasoning trace. Zen thinks out loud, step by step, about which Zen to run: every step reads one
   fact off the two model cards beside it (that row lights up), and the answer lands on its card. It runs three needs
   in turn; pick one by hand, or step through it yourself.
   Beyond: the trace is a chooser built only from Zen's own facts (local use, video, price), and the family strip
   below leads to every Zen model, Zen 7 and Zen 6 Max with each one's living sigil. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'motion/react';
import { EASE } from '../../ui';
import { A, More } from '../../kit';
import Sigil from '../../Sigil';
import { arrows } from './live';
import './Zen.css';

const CARDS = [
  { name: 'Zen 6 Flash', code: 'zen6-flash', desc: 'The compact build of Zen 6, for local and low-cost use.', size: 'Packed ternary, 5.95 GB', mods: 'Text and images', wb: 'https://platform.hanzo.ai/workbench?model=zen6-flash' },
  { name: 'Zen 6', code: 'zen6', desc: 'The open-weight flagship for agentic coding and multimodal work.', size: '27.3B dense', mods: 'Text, images and video', wb: 'https://platform.hanzo.ai/workbench?model=zen6' },
];
// each step reads one row of a card: [card, row, words, verdict]; the words are Hanzo's
const NEEDS = [
  { tab: 'Runs on my machine', steps: [
    [-1, 'open', 'Open weights: download the weights, or call them on Hanzo Cloud.'],
    [0, 'desc', 'Zen 6 Flash is the compact build of Zen 6, for local and low-cost use.', 'yes'],
    [0, 'size', 'Its weights: Packed ternary, 5.95 GB.'],
  ], pick: [0] },
  { tab: 'Reads video', steps: [
    [0, 'mods', 'Zen 6 Flash reads Text and images.', 'no'],
    [1, 'mods', 'Zen 6 reads Text, images and video.', 'yes'],
    [1, 'desc', 'The open-weight flagship for agentic coding and multimodal work.'],
  ], pick: [1] },
  { tab: 'Lowest price', steps: [
    [0, 'price', 'Zen 6 Flash: $2.28 in · $7.26 out, per 1M tokens.'],
    [1, 'price', 'Zen 6: $2.28 in · $7.26 out, per 1M tokens.'],
    [-1, 'price', 'The same price: either one.', 'yes'],
  ], pick: [0, 1] },
];

function Console() {
  const box = useRef(null);
  const seen = useInView(box, { amount: 0.3 });
  const calm = useReducedMotion();
  const [n, setN] = useState(0);
  const [step, setStep] = useState(9); // the server shows a finished trace; the browser replays it
  const [mine, setMine] = useState(false);
  const need = NEEDS[n];
  const len = need.steps.length;
  const done = step > len;
  useEffect(() => { if (!calm) setStep(0); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (calm || (!seen && !mine)) return;
    if (step <= len) { const t = setTimeout(() => setStep(step + 1), step === 0 ? 700 : 1500); return () => clearTimeout(t); }
    if (!mine) { const t = setTimeout(() => { setN((n + 1) % NEEDS.length); setStep(0); }, 3600); return () => clearTimeout(t); }
  }, [step, seen, calm, n, mine, len]);
  const pick = (i) => { setMine(true); setN(i); setStep(calm ? 9 : 0); };
  const cur = step >= 1 && step <= len ? need.steps[step - 1] : null;
  const lit = (ci, row) => {
    if (cur && (cur[0] === ci || cur[0] === -1) && cur[1] === row) return 'on';
    const past = need.steps.slice(0, Math.min(step, len)).find((s) => (s[0] === ci || s[0] === -1) && s[1] === row);
    return past ? (past[3] === 'no' ? 'no' : 'seen') : undefined;
  };
  return (
    <div className="ze-console mb-panel" ref={box}>
      <div className="ze-trace">
        <div className="ze-tabs" role="tablist" aria-label="What you need" onKeyDown={arrows}>
          {NEEDS.map((k, i) => <button key={k.tab} type="button" role="tab" aria-selected={i === n} className="mb-chip" onClick={() => pick(i)}>{k.tab}</button>)}
        </div>
        <p className="mb-mono ze-think"><span className="ze-dot" data-on={!done ? '' : undefined} />{done ? 'Answer' : 'Reasoning'}</p>
        <ol className="ze-steps" aria-live={mine ? 'polite' : 'off'}>
          <AnimatePresence initial={false}>
            {need.steps.slice(0, Math.min(step, len)).map((s, i) => (
              <motion.li key={n + '-' + i} initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, transition: { duration: 0.15 } }} transition={{ duration: 0.5, ease: EASE }} data-v={s[3]}>
                <span className="ze-n mb-tnum">{String(i + 1).padStart(2, '0')}</span>
                <span>{s[2]}</span>
              </motion.li>
            ))}
          </AnimatePresence>
          {!done && step > 0 && <li className="ze-wait" aria-hidden="true"><span className="ze-n">··</span><span className="ze-dots"><i /><i /><i /></span></li>}
        </ol>
        <AnimatePresence>
          {done && (
            <motion.p className="ze-answer" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, ease: EASE }}>
              {need.pick.map((ci) => <code key={ci}>{CARDS[ci].code}</code>)}
            </motion.p>
          )}
        </AnimatePresence>
        <button type="button" className="ze-step" onClick={() => { setMine(true); setStep(step > len ? 0 : step + 1); }}>{step > len ? 'Replay' : 'Next step'}</button>
      </div>
      <ul className="ze-cards">
        {CARDS.map((c, ci) => (
          <li key={c.code} className="ze-card" data-pick={done && need.pick.includes(ci) ? '' : undefined}>
            <div className="ze-card-h"><h3>{c.name}</h3><code>{c.code}</code></div>
            <p className="ze-row ze-price mb-tnum" data-l={lit(ci, 'price')}><b>$2.28</b> <span>in · per 1M tokens</span> <b>$7.26</b> <span>out</span></p>
            <p className="ze-row" data-l={lit(ci, 'desc')}>{c.desc}</p>
            <p className="ze-specs">
              <span className="ze-row" data-l={lit(ci, 'size')}>{c.size}</span>
              <span className="ze-row" data-l={lit(ci, 'mods')}>{c.mods}</span>
              <span className="ze-row" data-l={lit(ci, 'open')}>Open weights</span>
            </p>
            <p className="ze-acts">
              <A to="/login" className="ze-l">Try Hanzo</A>
              <A to={c.wb} className="ze-l">Open in Workbench</A>
              <A to="https://github.com/zenlm" className="ze-l">Docs on GitHub</A>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

const FAMILY = [
  ['/zen/models', 'Every Zen model', 'The complete Zen API catalog', [18, 2, 0.01]],
  ['/zen/7', 'Zen 7', 'Zen 7, the next open-weight generation. Apply for research access.', [7, 2.0]],
  ['/zen/zen6-max', 'Zen 6 Max', 'Built for the hardest work: deep reasoning, long context, and code.', [3.7, 9216, 5760]],
];

export default function Zen() {
  return (
    <>
      <section className="ze-intro mb-sec" aria-labelledby="ze-h">
        <div className="x-wrap">
          <div className="ze-top">
            <p className="mb-kick">Hanzo / Zen</p>
            <h2 id="ze-h" className="mb-h">Open models. Yours to run.</h2>
            <p className="mb-lede">The open-weight family behind Hanzo. Download the weights, or call them on Hanzo Cloud.</p>
            <div className="mb-acts">
              <A to="/login" className="x-btn solid" data-thumb="Try Hanzo">Try Hanzo</A>
              <A to="https://platform.hanzo.ai" className="x-btn">API Platform</A>
              <More to="https://github.com/zenlm">Docs on GitHub</More>
            </div>
          </div>
          <Console />
        </div>
      </section>
      <section className="ze-family mb-sec" aria-label="The Zen family">
        <div className="x-wrap">
          <ul className="ze-fam">
            {FAMILY.map(([to, name, line, data], i) => (
              <li key={to} className={i === 0 ? 'big' : ''}>
                <A to={to} className="ze-fam-a" data-cursor="Open">
                  <Sigil seed={to} data={data} className="ze-sig" />
                  <span className="ze-fam-n" data-morph>{name}</span>
                  <span className="ze-fam-d">{line}</span>
                  <svg className="ze-fam-go" viewBox="0 0 16 16" width="18" height="18" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </A>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
