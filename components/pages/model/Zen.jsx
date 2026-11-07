'use client';
/* Zen: open models, yours to run. v2 launch page (Launch + Chapters, accent jade).
   V2: 8/10 film settles into an arch, a window onto Zen's sphere; the facts as hero figures; open weights, Zen 6 Flash and Zen 6 pin as chapters; the reasoning trace is the one dark room; a side-by-side spec sheet and the family as tiles
   Signature: the reasoning trace. Zen thinks out loud, step by step, about which Zen to run: every step reads one
   fact off the two model cards beside it (that row lights up), and the answer lands on its card. It runs three needs
   in turn; pick one by hand, or step through it yourself.
   Beyond: the trace is a chooser built only from Zen's own facts (local use, video, price), and the family tiles
   below lead to every Zen model, Zen 7 and Zen 6 Max with each one's living sigil. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'motion/react';
import { EASE } from '../../ui';
import { A, More } from '../../kit';
import Sigil from '../../Sigil';
import { arrows } from './live';
import Launch, { Lines, lerp, film } from '../../v2/Launch';
import Chapters from '../../v2/Chapters';
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

// the film closes into an arch: a window onto Zen's sphere
const ARCH = (t, W, H, wide) => {
  const w = wide ? Math.min(W * 0.32, H * 0.64) : Math.min(W * 0.62, H * 0.36);
  const h = wide ? H * 0.82 : H * 0.44;
  const l = wide ? W * 0.6 : (W - w) / 2, top = wide ? (H - h) / 2 : H * 0.05;
  const a = lerp(0, w / 2, t).toFixed(1), b = lerp(0, 16, t).toFixed(1);
  return `inset(${lerp(0, top, t).toFixed(1)}px ${lerp(0, W - l - w, t).toFixed(1)}px ${lerp(0, H - top - h, t).toFixed(1)}px ${lerp(0, l, t).toFixed(1)}px round ${a}px ${a}px ${b}px ${b}px)`;
};

// a chapter's picture: Zen's film with a model card on it
function CardArt({ ci, open, z }) {
  const c = CARDS[ci];
  return (
    <div className="ze-art" style={{ '--z': z }}>
      <img src={film('zen', 'webp')} alt="" loading="lazy" />
      {open ? (
        <div className="ze-open" aria-hidden="true">
          {CARDS.map((k) => <p key={k.code}><code>{k.code}</code><span>{k.size}</span><em>Open weights</em></p>)}
        </div>
      ) : (
        <div className="ze-mcard" aria-hidden="true">
          <p className="ze-mcard-h"><b>{c.name}</b><code>{c.code}</code></p>
          <p className="ze-mcard-big mb-tnum">{c.size}</p>
          <p className="ze-mcard-m">{c.mods}</p>
          <p className="ze-mcard-p mb-tnum"><b>$2.28</b> in <b>$7.26</b> out</p>
        </div>
      )}
    </div>
  );
}

const cardBody = (c) => (
  <>
    <p>{c.desc}</p>
    <p className="ze-ch-price mb-tnum"><b>$2.28</b> <span>in · per 1M tokens</span> <b>$7.26</b> <span>out</span></p>
    <p className="ze-ch-specs"><span>{c.size}</span><span>{c.mods}</span><span>Open weights</span></p>
    <p className="ze-ch-acts">
      <A to="/login" className="ze-l">Try Hanzo</A>
      <A to={c.wb} className="ze-l">Open in Workbench</A>
      <A to="https://github.com/zenlm" className="ze-l">Docs on GitHub</A>
    </p>
  </>
);
const CHAPTERS = [
  { k: 'Open weights', title: 'Download it, or call it.', art: <CardArt open z={1.1} />, body: <><p>Open weights: download the weights, or call them on Hanzo Cloud.</p><p><More to="https://github.com/zenlm">Docs on GitHub</More></p></> },
  { k: CARDS[0].name, title: 'Built for local use.', art: <CardArt ci={0} z={1.35} />, body: cardBody(CARDS[0]) },
  { k: CARDS[1].name, title: 'The flagship, open.', art: <CardArt ci={1} z={1.7} />, body: cardBody(CARDS[1]) },
];

export default function Zen() {
  return (
    <Launch
      slug="zen"
      accent="#0e9f8e"
      ink="#0a7a6d"
      shape={ARCH}
      aim={(W, H, wide) => (wide ? null : [-0.24 * W, -0.21 * H])}
      headClass="ze-head"
      head={
        <>
          <p className="lv-kick">Hanzo / Zen</p>
          <Lines id="ze-h" lines={['Open models.', 'Yours to run.']} />
          <p className="lv-lede">The open-weight family behind Hanzo. Download the weights, or call them on Hanzo Cloud.</p>
          <div className="lv-acts">
            <A to="/login" className="x-btn solid" data-thumb="Try Hanzo">Try Hanzo</A>
            <A to="https://platform.hanzo.ai" className="x-btn">API Platform</A>
            <More to="https://github.com/zenlm">Docs on GitHub</More>
          </div>
        </>
      }
    >
      <section className="lv-sec ze-figs-sec" aria-label="Zen in figures">
        <div className="x-wrap">
          <div className="lv-figs ze-figs">
            <div className="lv-fig ac"><b>5.95<small>GB</small></b><span>Zen 6 Flash weights, packed ternary</span></div>
            <div className="lv-fig"><b>27.3<small>B</small></b><span>Zen 6, dense</span></div>
            <div className="lv-fig"><b>$2.28</b><span>per 1M input tokens, either model</span></div>
          </div>
        </div>
      </section>
      <Chapters id="ze-ch" label="The Zen 6 family" items={CHAPTERS} />
      <section className="lv-room lv-sec ze-live" aria-labelledby="ze-live-h">
        <div className="x-wrap">
          <div className="lv-sh">
            <div>
              <p className="lv-kick"><span className="mb-live">Live</span></p>
              <h2 id="ze-live-h" className="lv-h">Which Zen should you run?</h2>
            </div>
            <p className="lv-p">Zen reasons out loud, one fact at a time, reading each step off the two model cards until the answer lands. Pick what you need.</p>
          </div>
          <Console />
        </div>
      </section>
      <section className="lv-sec ze-spec" aria-labelledby="ze-spec-h">
        <div className="x-wrap">
          <div className="lv-sh">
            <div>
              <p className="lv-kick">Spec sheet</p>
              <h2 id="ze-spec-h" className="lv-h">Zen 6 and Zen 6 Flash, side by side.</h2>
            </div>
          </div>
          <div className="ze-spec-scroll">
            <table className="lv-spec">
              <thead><tr><th scope="col"><span className="x-sr">Fact</span></th>{CARDS.map((c) => <th key={c.code} scope="col">{c.name}</th>)}</tr></thead>
              <tbody>
                <tr><th scope="row">Model</th>{CARDS.map((c) => <td key={c.code}><code>{c.code}</code></td>)}</tr>
                <tr><th scope="row">Weights</th>{CARDS.map((c) => <td key={c.code}>{c.size}</td>)}</tr>
                <tr><th scope="row">Reads</th>{CARDS.map((c) => <td key={c.code}>{c.mods}</td>)}</tr>
                <tr><th scope="row">Input</th>{CARDS.map((c) => <td key={c.code}><b>$2.28</b> per 1M tokens</td>)}</tr>
                <tr><th scope="row">Output</th>{CARDS.map((c) => <td key={c.code}><b>$7.26</b> per 1M tokens</td>)}</tr>
                <tr><th scope="row">Licence</th>{CARDS.map((c) => <td key={c.code}>Open weights</td>)}</tr>
                <tr><th scope="row">Workbench</th>{CARDS.map((c) => <td key={c.code}><A to={c.wb}>Open in Workbench</A></td>)}</tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <section className="lv-sec ze-family" aria-labelledby="ze-fam-h">
        <div className="x-wrap">
          <div className="lv-sh">
            <div>
              <p className="lv-kick">The Zen family</p>
              <h2 id="ze-fam-h" className="lv-h">Every Zen, one tap away.</h2>
            </div>
          </div>
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
    </Launch>
  );
}
