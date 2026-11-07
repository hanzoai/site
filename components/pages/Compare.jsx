'use client';
// Persona: a developer or platform lead choosing where to route model calls (arrives from the header's compare link, /models or search)
// Goal: see, row by row, how Enso stands against OpenRouter, Portkey and LiteLLM, then open the full comparison
// CTA: Model routing APIs -> /compare/model-routing (hero, the shared ask bar via data-thumb, close) · data-cta="compare.hero" / "compare.close"
// Metric: cta_click on compare.hero (developer path toward api_key_created)
// Signature: the table reads itself — a reading line glides down the seven rows of Enso, OpenRouter, Portkey and LiteLLM on its own, each row's verdicts lifting as it is reached; press a row to hold it, and every row's full sentence waits in a sheet.
// Beyond: "Count the Yes" — untick the rows that do not matter to you and each API's Yes re-counts over the rows you kept, as large figures, straight from the table's own cells.
/* Compare. Its idea is the row you can check, one row at a time.
   1. Hero: the h1 at rest size (52px) on the left, the lede and the one ask on the right, then the table as a wide object right under it: only
      Yes, No or the figure per cell, Enso's column raised by weight and a hairline, a reading line walking the rows
      by itself (a hairline under it times the next row). Every row's full sentence is one press away in a sheet.
   2. Count the Yes: Enso's tally is the one big figure of its screen (84px); the other three sit at 44px beside the rows you count.
   3. The comparison as a card that opens into its page (synchronized.studio).
   4. The one dark room wipes in: a different question, a card into /comparison, and the page's one ask again.
   Phones: the table becomes one card per row, the four APIs stacked, the sentence on tap.
   Colour: none of its own (JAMES.md): Yes in ink, No at 40% grey; the Enso image is the only colour.
   Motion: idle (the reading line walks), state (gliding line, lifting verdicts, re-counting figures, sheet), pointer
   (rows answer, switches swell, cards lift, presses give), scroll only for the dark room's wipe.
   Every word is Hanzo's.
   Scale has rhythm (MASTER 3.1): h1 52, headings 26, figures 64, one moment per screen; deck durations, ease-emphasis, no springs.
   V2: 8/10 the table that reads itself under a 52px h1 split 8/5 with its lede and ask, verdicts only, sentences in a sheet, list rows on phones, Enso's Yes tally the one big figure, card that opens, wiped dark room closing on the one ask; deck greys, rhythm and timing, legible with JS off. */
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react';
import { A } from '../kit';
import MaskLines from '../v2/MaskLines';
import DetailSheet from '../v2/DetailSheet';
import SceneWipe from '../v2/SceneWipe';
import AskBar from '../v2/AskBar';
import '../v2/ProofScale.css';
import '../v2/ProofRhythm.css';
import './Compare.css';

const EASE = [0.16, 1, 0.3, 1];
const COLS = ['Enso', 'OpenRouter', 'Portkey', 'LiteLLM'];
const ROWS = [
  ['Models reachable', 'Enso: 600+. OpenRouter: 500+ (80+ providers). Portkey: 1,600+. LiteLLM: 1,800+ (140+ providers).'],
  ['OpenAI-compatible endpoint', 'Enso: Yes — /v1/chat/completions. OpenRouter: Yes. Portkey: Yes. LiteLLM: Yes.'],
  ['Native Anthropic /v1/messages', 'Enso: Yes — same key. OpenRouter: Yes — Anthropic Messages format, tools and extended thinking. Portkey: Yes — /v1/messages routes to any of their models. LiteLLM: Yes — serves the format at /v1/messages.'],
  ['Cost known before the call runs', 'Enso: Yes — model calls are quoted from above before they happen, and an agent that would breach its cap is refused rather than discovered on an invoice. OpenRouter: No — blocks once a limit is reached (403), Enterprise plan only. No pre-flight quote published.. Portkey: No — budget limit expires the key once reached, Enterprise plan. No pre-flight quote published.. LiteLLM: No — caps budgets and stops at the cap. No pre-flight quote published..'],
  ['GPQA-Diamond, run by us', 'Enso: The router beside single models from other labs on the same 198 questions, every row a research run with its accuracy and what its tokens cost at list prices. OpenRouter: not measured by us. Portkey: not measured by us. LiteLLM: not measured by us.'],
  ['Routing quality published by the vendor', 'Enso: Yes — GPQA-Diamond, 198 graduate-level questions, every row a research run. OpenRouter: No — their Benchmarks API scores the models, not the router. Portkey: Not published. LiteLLM: Yes — Auto Routing Cost Ladders: 58.2% savings, 46.8% win rate vs flagship.'],
  ['Runs on your own infrastructure', 'Enso: Yes — the whole cloud is one binary and one API, on your own Kubernetes or your laptop. OpenRouter: No — a hosted service. Portkey: Self-hosting offered at enterprise tier. LiteLLM: Yes — open source, self-hosted free forever.'],
];
// each row's sentence, cut into its four cells: a short verdict where the cell leads with one, and the detail after it
const cells = (s) => COLS.map((c, i) => {
  const from = s.indexOf(c + ': ') + c.length + 2;
  const to = i < 3 ? s.indexOf(' ' + COLS[i + 1] + ': ') : s.length;
  const txt = s.slice(from, to).replace(/\.+$/, '');
  const m = txt.match(/^(Yes|No)(?: — (.*))?$/s) || txt.match(/^([\d,]+\+)(?: (.*))?$/);
  return m ? { v: m[1], d: m[2] || '', t: txt } : { v: '', d: txt, t: txt };
});
const TABLE = ROWS.map(([k, s]) => ({ k, s, c: cells(s) }));
const pad = (i) => String(i + 1).padStart(2, '0');
// Beyond: only rows where some cell answers Yes or No can be counted
const YN = TABLE.map((r, i) => (r.c.some((c) => c.v === 'Yes' || c.v === 'No') ? i : -1)).filter((i) => i >= 0);
const tone = (c) => (c.v === 'Yes' ? 'y' : c.v === 'No' ? 'n' : c.v ? 'v' : 't');
const ASK = { label: 'Model routing APIs', to: '/compare/model-routing', cta: 'compare.hero' };
const IO = [0.4, 0, 0.2, 1]; // deck ease-in-out: things that move and stay
// JS off: everything that starts hidden or offset stands in place
const NOJS = '<style>.xcp-in{opacity:1!important;transform:none!important}.xcp-mark{display:none!important}.xcp-tally-r li>i b{transform:scaleX(var(--w))!important}</style>';

const Tick = ({ s = 14 }) => <svg viewBox="0 0 16 16" width={s} height={s} aria-hidden="true"><path d="M3.5 8.5l3 3 6-6.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const Dash = ({ s = 14 }) => <svg viewBox="0 0 16 16" width={s} height={s} aria-hidden="true"><path d="M4 8h8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>;
const Mark = ({ c, s }) => (c.v === 'Yes' ? <Tick s={s} /> : c.v === 'No' ? <Dash s={s} /> : null);
const Arrow = ({ s = 18 }) => <svg viewBox="0 0 16 16" width={s} height={s} aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const Cell = ({ c }) => (c.v ? <span className="xcp-v"><Mark c={c} s={15} />{c.v}</span> : <span className="xcp-x">{c.d}</span>);

/* The reading line's clock is its own progress hairline: when the hairline's CSS animation ends, the line moves on.
   No timer runs. The hairline pauses (and so does the line) while the table is off screen, while a hand moves over it
   (a resting pointer lets it go on), while a pressed row holds it, and while the pause control is pressed. Reduced
   motion: no animation, so the line stays where it is. */
function useReader(ref) {
  const [at, setAt] = useState(0);
  const [held, setHeld] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [paused, setPaused] = useState(false);
  const calm = useReducedMotion();
  const live = useInView(ref, { amount: 'some' });
  const run = !held && !pinned && !paused && !calm && live;
  const rest = useRef(0);
  useEffect(() => () => clearTimeout(rest.current), []);
  const hand = {
    onPointerMove: (e) => { if (e.pointerType !== 'mouse') return; setHeld(true); clearTimeout(rest.current); rest.current = setTimeout(() => setHeld(false), 2500); },
    onPointerLeave: () => { clearTimeout(rest.current); setHeld(false); setPinned(false); },
  };
  const pick = (i) => { setAt(i); setPinned(true); };
  const next = () => setAt((v) => (v + 1) % ROWS.length);
  return { at, run, hand, pick, calm, next, paused, setPaused };
}

/* every row's sentence, as Hanzo writes it, for the sheet */
function Sentences() {
  return (
    <div className="xcp-all">
      {TABLE.map((r, i) => (
        <section key={r.k} aria-labelledby={'xcp-all-' + i}>
          <h3 id={'xcp-all-' + i}><span className="pf-mono">{pad(i)}</span>{r.k}</h3>
          <p>{r.s}</p>
        </section>
      ))}
    </div>
  );
}

/* ---------- the hero object: the table that reads itself ---------- */
function Reader() {
  const ref = useRef(null);
  const { at, run, hand, pick, calm, next, paused, setPaused } = useReader(ref);
  const [open, setOpen] = useState(-1); // phones: the row whose sentence is showing
  return (
    <motion.div ref={ref} className="xcp-obj pf-obj xcp-in" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE, delay: 0.3 }} {...hand}>
      <div className="xcp-obj-h">
        {/* first in the DOM (WCAG 2.2.2): stops the reading line; the register's "Pause" names it, icon-only until approved */}
        <button type="button" className="xcp-pause" aria-pressed={paused} aria-label="Pause" onClick={() => setPaused((p) => !p)}>
          <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">{paused ? <path d="M5 3.5v9l7.5-4.5z" fill="currentColor" /> : <path d="M5 3.5v9M11 3.5v9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />}</svg>
        </button>
        <img src="/models/enso.webp" alt="" width="44" height="44" className="xcp-obj-img" />
        <A to={ASK.to} className="xcp-obj-q">Which API should you route your model calls through? <span aria-hidden="true">→</span></A>
        <span className="xcp-obj-n pf-mono" aria-live="polite">{pad(at)} / 07</span>
        <i key={at} className={'xcp-tick' + (run ? '' : ' held')} aria-hidden="true" onAnimationEnd={next} />
      </div>

      {/* desktop: the table */}
      <div className="xcp-mx">
        <table className="xcp-t">
          <thead>
            <tr>
              <th scope="col" className="xcp-t-k"><span className="x-sr">Row</span></th>
              {COLS.map((c, i) => <th key={c} scope="col" className={i === 0 ? 'me' : ''}>{c}{i === 0 && <small>Hanzo</small>}</th>)}
            </tr>
          </thead>
          <tbody>
            {TABLE.map((r, i) => (
              <tr key={r.k} className={at === i ? 'on' : ''} onClick={() => pick(i)}>
                <th scope="row">
                  <button type="button" className="xcp-t-row" onClick={(e) => { e.stopPropagation(); pick(i); }} onFocus={() => pick(i)} aria-pressed={at === i}>
                    <span className="pf-mono">{pad(i)}</span>{r.k}
                  </button>
                </th>
                {r.c.map((c, j) => <td key={j} className={'xcp-td ' + tone(c) + (j === 0 ? ' me' : '')}><Cell c={c} /></td>)}
              </tr>
            ))}
          </tbody>
        </table>
        {/* the reading line: one band that glides to the row being read */}
        <motion.div className="xcp-mark" aria-hidden="true" initial={false} animate={{ y: at * 54 }} transition={calm ? { duration: 0 } : { duration: 0.3, ease: IO }}>
        </motion.div>
      </div>

      {/* phones: one card per row, the four APIs stacked, the sentence on tap */}
      <ol className="xcp-cards">
        {TABLE.map((r, i) => (
          <li key={r.k} className={at === i ? 'on' : ''}>
            <button type="button" className="xcp-card-h" aria-expanded={open === i} onClick={() => { setOpen(open === i ? -1 : i); pick(i); }}>
              <span className="pf-mono">{pad(i)}</span><b>{r.k}</b><i aria-hidden="true">+</i>
            </button>
            <dl>
              {r.c.map((c, j) => (
                <div key={j} className={'xcp-cl ' + tone(c) + (j === 0 ? ' me' : '')}>
                  <dt>{COLS[j]}</dt>
                  <dd><Cell c={c} /></dd>
                </div>
              ))}
            </dl>
            <p className="xcp-card-s" hidden={open !== i}>{r.s}</p>
          </li>
        ))}
      </ol>
    </motion.div>
  );
}

function Hero() {
  return (
    <section className="xcp-hero" aria-labelledby="xcp-h1">
      <noscript dangerouslySetInnerHTML={{ __html: NOJS }} />
      <div className="pf-wrap">
        <div className="xcp-hero-g">
        <MaskLines as="h1" id="xcp-h1" className="pf-display xcp-h1" lines={['How we compare,', 'row by row,', 'with the source', 'on every row']} />
        <motion.div className="xcp-sub xcp-in" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: EASE, delay: 0.3 }}>
          <div className="xcp-sub-l">
            <p className="pf-kick xcp-cap">Hanzo vs</p>
            <p className="pf-lede">Each page sets a Hanzo product beside a named alternative.</p>
          </div>
          <div className="xcp-acts">
            <DetailSheet label="Every row, in full" kicker="Model routing APIs" title="Which API should you route your model calls through?" ghost wide>
              <Sentences />
            </DetailSheet>
            <span data-thumb={ASK.label} data-href={ASK.to}><A to={ASK.to} className="pf-btn solid xcp-ask" data-cta={ASK.cta}>{ASK.label}<Arrow s={15} /></A></span>
          </div>
        </motion.div>
        </div>
        <Reader />
      </div>
    </section>
  );
}

/* a figure that changes in place: the old count leaves upward and the new one arrives, so only real counts are shown */
function Fig({ v }) {
  return (
    <span className="xcp-fig">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span key={v} initial={{ y: '70%', opacity: 0 }} animate={{ y: '0%', opacity: 1 }} exit={{ y: '-70%', opacity: 0, transition: { duration: 0.15 } }} transition={{ duration: 0.3, ease: EASE }}>{v}</motion.span>
      </AnimatePresence>
    </span>
  );
}

/* ---------- Beyond: count the Yes ---------- */
function Tally() {
  const [keep, setKeep] = useState(YN);
  const ref = useRef(null);
  const calm = useReducedMotion();
  const seen = useInView(ref, { once: true, amount: 0.35 });
  const go = seen || calm;
  const flip = (i) => setKeep((k) => (k.includes(i) ? k.filter((x) => x !== i) : [...k, i].sort()));
  return (
    <section className="pf-sec xcp-tally" aria-labelledby="xcp-tally-h">
      <div className="pf-wrap xcp-tally-g" ref={ref}>
        <div className="xcp-tally-l">
          <h2 id="xcp-tally-h" className="pf-head">Count the Yes</h2>
          <div className="xcp-chips" role="group" aria-label="Rows to count">
            {YN.map((i) => (
              <button key={i} type="button" aria-pressed={keep.includes(i)} onClick={() => flip(i)}>
                <i aria-hidden="true"><Tick s={12} /></i>
                <span className="pf-mono">{pad(i)}</span>{TABLE[i].k}
              </button>
            ))}
          </div>
        </div>
        <ul className="xcp-tally-r" aria-live="polite">
          {COLS.map((c, j) => {
            const yes = keep.filter((i) => TABLE[i].c[j].v === 'Yes').length;
            return (
              <li key={c} className={j === 0 ? 'me' : ''}>
                <span className="xcp-tally-n">{c}{j === 0 && <small>Hanzo</small>}</span>
                <span className={j === 0 ? 'pf-moment xcp-big' : 'pf-num xcp-small'}>{keep.length ? <Fig v={yes} /> : '—'}<em>{keep.length ? ` / ${keep.length}` : ''}</em></span>
                <i aria-hidden="true"><b style={{ '--w': keep.length ? yes / keep.length : 0, transform: `scaleX(${go && keep.length ? yes / keep.length : 0})` }} /></i>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* ---------- the index: a card that opens into its page ---------- */
function Index() {
  return (
    <section className="pf-sec xcp-index" aria-labelledby="xcp-index-h">
      <div className="pf-wrap">
        <h2 id="xcp-index-h" className="pf-head">Comparisons</h2>
        <ol className="xcp-list">
          <li>
            <A to="/compare/model-routing" className="xcp-card" data-cursor="Open">
              <span className="xcp-card-img" data-morph><img src="/models/enso.webp" alt="" width="1200" height="1500" /></span>
              <span className="xcp-card-b">
                <span className="xcp-card-q pf-title">Which API should you route your model calls through?</span>
                <span className="xcp-card-v pf-lede">— Hanzo <b>Enso</b> against <span>OpenRouter, Portkey, LiteLLM</span> .</span>
                <span className="xcp-card-f"><span className="xcp-card-n pf-mono">01</span><span className="xcp-card-go" aria-hidden="true"><Arrow /></span></span>
              </span>
            </A>
          </li>
        </ol>
      </div>
    </section>
  );
}

/* ---------- the one dark room: a different question, then the one ask again ---------- */
function Different() {
  return (
    <SceneWipe className="xcp-diff" label="A different question">
      <div className="pf-wrap pf-grid xcp-diff-g">
        <div className="xcp-diff-l">
          <h2 className="pf-head">A different question</h2>
          <p className="pf-lede">If what you are weighing is whether to run it yourself rather than buy it, that page is separate.</p>
          <A to={ASK.to} className="pf-btn solid xcp-ask xcp-ask-d" data-cta="compare.close">{ASK.label}<Arrow s={15} /></A>
        </div>
        <A to="/comparison" className="xcp-diff-c" data-morph data-cursor="Open">
          <span className="xcp-diff-a">Buy it, or run it</span>
          <i aria-hidden="true"><Arrow s={20} /></i>
        </A>
      </div>
    </SceneWipe>
  );
}

export default function Compare() {
  return (
    <main className="xcp pf-r">
      <Hero />
      <Tally />
      <Index />
      <Different />
      <AskBar title="Hanzo vs" label={ASK.label} to={ASK.to} cta={ASK.cta} />
    </main>
  );
}
