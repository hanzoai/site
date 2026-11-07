'use client';
// Signature: a verdict board that reads the routing table to you — a pill glides along the seven rows by itself and four lanes, Enso raised among OpenRouter, Portkey and LiteLLM, flip to that row's answer; press a row to hold it.
// Beyond: "Count the Yes" — untick the rows that do not matter to you and the table's foot re-counts each API's Yes over the rows you kept, as large figures, straight from the table's own cells.
/* Compare. Its idea is the row you can check, one row at a time.
   1. Hero: the headline in masked lines (Hanzo's "Hanzo vs" sits under it as a caption), one ask, and the live object:
      the verdict board. It walks the seven rows on its own (a pill glides, the four lanes flip, a hairline times the
      next row), pauses under the hand, and every row's full sentence is one press away in a sheet.
   2. The table itself, crisp, Enso's column raised in white; the rows you count carry a switch and the foot re-counts.
   3. The comparison as a card that opens into its page (synchronized.studio).
   4. The one dark room wipes in: a different question, as a card that opens into /comparison.
   Colour: none of its own (JAMES.md): ink and its alpha steps; Yes is ink with a tick, No is grey with a dash.
   Motion: idle (the board walks the rows), state (gliding pill, flipping lanes, re-counting figures, sheet), pointer
   (rows fill, lanes answer, cards lift, presses give), scroll only for the dark room's wipe.
   One ask, Hanzo's "Model routing APIs": in the hero, sticky after it (AskBar on desktop, the thumb bar on phones).
   Every word is Hanzo's.
   V2: 8/10 hero is a self-running verdict board (gliding row pill, flipping lanes) beside the masked headline; the crisp table counts the Yes in its foot; card that opens; wiped dark room; greys only, one sticky ask. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'motion/react';
import { A } from '../kit';
import MaskLines from '../v2/MaskLines';
import DetailSheet from '../v2/DetailSheet';
import SceneWipe from '../v2/SceneWipe';
import AskBar from '../v2/AskBar';
import '../v2/ProofScale.css';
import './Compare.css';

const EASE = [0.16, 1, 0.3, 1];
const STEP = 3400; // ms a row is read for
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
const ASK = { label: 'Model routing APIs', to: '/compare/model-routing' };

const Tick = ({ s = 14 }) => <svg viewBox="0 0 16 16" width={s} height={s} aria-hidden="true"><path d="M3.5 8.5l3 3 6-6.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const Dash = ({ s = 14 }) => <svg viewBox="0 0 16 16" width={s} height={s} aria-hidden="true"><path d="M4 8h8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>;
const Mark = ({ c, s }) => (c.v === 'Yes' ? <Tick s={s} /> : c.v === 'No' ? <Dash s={s} /> : null);
const Arrow = ({ s = 18 }) => <svg viewBox="0 0 16 16" width={s} height={s} aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;

/* ---------- the signature: the verdict board ---------- */
function Board() {
  const [at, setAt] = useState(0);
  const [held, setHeld] = useState(false); // a hand at work on the board pauses it; a resting pointer lets it go on
  const [pinned, setPinned] = useState(false); // a row pressed: held until the pointer leaves the board
  const rest = useRef(0);
  const calm = useReducedMotion();
  const ref = useRef(null);
  const live = useInView(ref, { amount: 0.4 });
  const run = !held && !pinned && !calm && live;
  // the countdown keeps its progress across pauses: a hand on the board stops the clock, it does not reset it
  const runRef = useRef(run);
  runRef.current = run;
  const spent = useRef(0);
  useEffect(() => { spent.current = 0; }, [at]);
  useEffect(() => {
    if (calm || !live) return;
    let last = performance.now();
    const id = setInterval(() => {
      const now = performance.now();
      if (runRef.current) spent.current += now - last;
      last = now;
      if (spent.current >= STEP) { spent.current = 0; setAt((v) => (v + 1) % ROWS.length); }
    }, 100);
    return () => clearInterval(id);
  }, [calm, live]);
  useEffect(() => () => clearTimeout(rest.current), []);
  const moved = (e) => { if (e.pointerType !== 'mouse') return; setHeld(true); clearTimeout(rest.current); rest.current = setTimeout(() => setHeld(false), 2500); };
  const keys = (e) => {
    const k = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!k) return;
    e.preventDefault();
    const n = (at + k + ROWS.length) % ROWS.length;
    setAt(n);
    document.getElementById('xcp-pill-' + n)?.focus();
  };
  const r = TABLE[at];
  return (
    <motion.div className="xcp-board pf-obj" ref={ref} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.3 }}
      onPointerMove={moved} onPointerLeave={() => { clearTimeout(rest.current); setHeld(false); setPinned(false); }}>
      <div className="xcp-b-head">
        <img src="/models/enso.webp" alt="" width="56" height="56" className="xcp-b-img" />
        <A to={ASK.to} className="xcp-b-q">Which API should you route your model calls through? <span aria-hidden="true">→</span></A>
      </div>

      <div className="xcp-b-rows">
        <div className="xcp-pills" role="tablist" aria-label="Rows" onKeyDown={keys}>
          {TABLE.map((row, i) => (
            <button key={row.k} id={'xcp-pill-' + i} type="button" role="tab" aria-selected={at === i} aria-controls="xcp-b-panel" tabIndex={at === i ? 0 : -1} aria-label={row.k}
              onClick={() => { setAt(i); setPinned(true); }}>
              {at === i && <motion.span layoutId="xcp-pill" className="xcp-pill-bg" transition={{ type: 'spring', stiffness: 500, damping: 35 }} />}
              <span className="pf-mono">{pad(i)}</span>
            </button>
          ))}
        </div>
        <span className="xcp-b-n pf-mono" aria-live="polite">{pad(at)} / 07<i key={at} className={'xcp-b-tick' + (run ? '' : ' held')} aria-hidden="true" /></span>
      </div>

      <div id="xcp-b-panel" role="tabpanel" aria-label={r.k} className="xcp-b-panel">
        <div className="xcp-b-k">
          <AnimatePresence initial={false}>
            <motion.p key={at} className="xcp-b-title" initial={{ y: '100%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '-60%', opacity: 0, transition: { duration: 0.25, ease: EASE } }} transition={{ duration: 0.7, ease: EASE }}>{r.k}</motion.p>
          </AnimatePresence>
        </div>
        <div className="xcp-lanes">
          {r.c.map((c, j) => (
            <div key={j} className={'xcp-lane ' + tone(c) + (j === 0 ? ' me' : '')}>
              <p className="xcp-lane-n">{COLS[j]}{j === 0 && <small>Hanzo</small>}</p>
              <div className="xcp-lane-v">
                <AnimatePresence initial={false}>
                  <motion.div key={at} className="xcp-lane-in" initial={{ y: '70%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '-40%', opacity: 0, transition: { duration: 0.22, ease: EASE } }} transition={{ duration: 0.7, ease: EASE, delay: 0.06 + j * 0.05 }}>
                    {c.v ? <b><Mark c={c} s={22} />{c.v}</b> : <b className="xcp-lane-t">{c.d}</b>}
                    {c.v && c.d && <span>{c.d}</span>}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
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

function Hero() {
  return (
    <section className="xcp-hero" aria-labelledby="xcp-h1">
      <div className="pf-wrap xcp-hero-g">
        <div className="xcp-hero-l">
          <MaskLines as="h1" id="xcp-h1" className="pf-display s" lines={['How we compare,', 'row by row, with the', 'source on every row']} />
          <motion.div className="xcp-hero-sub" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.45 }}>
            <p className="pf-kick xcp-cap">Hanzo vs</p>
            <p className="pf-lede">Each page sets a Hanzo product beside a named alternative.</p>
            <div className="xcp-acts">
              <A to={ASK.to} className="pf-btn solid xcp-ask" data-thumb={ASK.label}>{ASK.label}<Arrow s={15} /></A>
              <DetailSheet label="Every row, in full" kicker="Model routing APIs" title="Which API should you route your model calls through?" ghost wide>
                <Sentences />
              </DetailSheet>
            </div>
          </motion.div>
        </div>
        <div className="xcp-hero-r"><Board /></div>
      </div>
    </section>
  );
}

/* ---------- the table, crisp; the foot counts the Yes (Beyond) ---------- */
function Table() {
  const [keep, setKeep] = useState(YN);
  const flip = (i) => setKeep((k) => (k.includes(i) ? k.filter((x) => x !== i) : [...k, i].sort()));
  return (
    <section className="pf-sec xcp-table" aria-labelledby="xcp-t-h">
      <div className="pf-wrap">
        <div className="xcp-t-top">
          <h2 id="xcp-t-h" className="pf-head">Which API should you route your model calls through?</h2>
          <p className="pf-kick xcp-cap">Model routing APIs</p>
        </div>
        <div className="xcp-scroll pf-obj">
          <table className="xcp-t">
            <thead>
              <tr>
                <th scope="col" className="xcp-t-k"><span className="x-sr">Row</span></th>
                {COLS.map((c, i) => <th key={c} scope="col" className={i === 0 ? 'me' : ''}>{c}{i === 0 && <small>Hanzo</small>}</th>)}
              </tr>
            </thead>
            <tbody>
              {TABLE.map((r, i) => {
                const can = YN.includes(i);
                const on = keep.includes(i);
                return (
                  <tr key={r.k} className={can && !on ? 'off' : ''}>
                    <th scope="row">
                      <span className="xcp-t-row">
                        {can ? (
                          <button type="button" className="xcp-sw" aria-pressed={on} onClick={() => flip(i)} aria-label={(on ? 'Stop counting ' : 'Count ') + r.k}>
                            <i aria-hidden="true"><Tick s={12} /></i>
                          </button>
                        ) : <span className="xcp-sw-gap" aria-hidden="true" />}
                        <span className="pf-mono">{pad(i)}</span>
                        <span className="xcp-t-name">{r.k}</span>
                      </span>
                    </th>
                    {r.c.map((c, j) => (
                      <td key={j} className={'xcp-td ' + tone(c) + (j === 0 ? ' me' : '')}>
                        {c.v && <span className="xcp-v"><Mark c={c} s={14} />{c.v}</span>}
                        {c.d && <span className="xcp-d">{c.d}</span>}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
            <tfoot aria-live="polite">
              <tr>
                <th scope="row"><span className="xcp-count">Count the Yes</span></th>
                {COLS.map((c, j) => {
                  const yes = keep.filter((i) => TABLE[i].c[j].v === 'Yes').length;
                  return (
                    <td key={c} className={j === 0 ? 'me' : ''}>
                      <span className="xcp-fig">{keep.length ? yes : '—'}<em>{keep.length ? ` / ${keep.length}` : ''}</em></span>
                      <i className="xcp-bar" aria-hidden="true"><b style={{ transform: `scaleX(${keep.length ? yes / keep.length : 0})` }} /></i>
                    </td>
                  );
                })}
              </tr>
            </tfoot>
          </table>
        </div>
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

/* ---------- the one dark room: a different question, which opens into /comparison ---------- */
function Different() {
  return (
    <SceneWipe className="xcp-diff" label="A different question">
      <div className="pf-wrap pf-grid xcp-diff-g">
        <div className="xcp-diff-l">
          <h2 className="pf-head">A different question</h2>
          <p className="pf-lede">If what you are weighing is whether to run it yourself rather than buy it, that page is separate.</p>
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
    <main className="xcp">
      <Hero />
      <Table />
      <Index />
      <Different />
      <AskBar title="Hanzo vs" label={ASK.label} to={ASK.to} />
    </main>
  );
}
