'use client';
// Signature: the scroll reads the routing table one row per screen — the row pins on the left while a four-lane verdict board flips Enso, OpenRouter, Portkey and LiteLLM to that row's answer.
// Beyond: "Count the Yes" — untick the rows that do not matter to you and each API's tally of Yes re-counts, as huge figures, over the rows you kept, straight from the table's own cells.
/* Compare. Its idea is the row you can check.
   V2: 8/10 chaptered: the featured table is the crisp hero object (Hanzo's column raised, a reading line walking it), then one row per screen with a flipping verdict board, a giant-figure tally, the comparison as a card that opens into its page, and the "different question" as the one dark room.
   First screen: the headline in masked lines and the featured comparison as a big table, Hanzo's column raised and
   pinned, a reading line walking its seven rows by itself (press a row to go to its chapter). Every cell's full
   detail lives in a sheet. Then the chapters, the tally (Beyond), the index card that opens into its page
   (synchronized.studio), and the dark room that opens into /comparison. Accent #00a37a, from the Yes.
   Motion: signature = the pinned row chapters; supporting = masked headline lines, the hero reading line, the dark
   room's wipe. Every word is Hanzo's. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'motion/react';
import { A } from '../kit';
import MaskLines from '../v2/MaskLines';
import PinScenes from '../v2/PinScenes';
import DetailSheet from '../v2/DetailSheet';
import SceneWipe from '../v2/SceneWipe';
import '../v2/ProofScale.css';
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

const Check = ({ s = 14 }) => <svg viewBox="0 0 16 16" width={s} height={s} aria-hidden="true"><path d="M3.5 8.5l3 3 6-6.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;

/* go to row i's chapter, wherever the chapters are laid out (pinned on desktop, stacked on phones) */
function toChapter(i) {
  const sec = document.querySelector('.xcp-rows');
  if (!sec) return;
  const flat = sec.querySelectorAll('.pf-pin-flat-c');
  const top = sec.getBoundingClientRect().top + scrollY;
  const y = flat.length ? flat[i].getBoundingClientRect().top + scrollY - 90 : top + (sec.offsetHeight - innerHeight) * ((i + 0.5) / ROWS.length);
  window.__lenis ? window.__lenis.scrollTo(y, { duration: 1.4 }) : scrollTo({ top: y, behavior: 'smooth' });
}

/* ---------- the hero object: the featured table, Hanzo's column raised, a reading line walking it ---------- */
function HeroTable() {
  const [at, setAt] = useState(0);
  const [held, setHeld] = useState(false);
  const calm = useReducedMotion();
  const ref = useRef(null);
  const live = useInView(ref, { amount: 0.35 });
  useEffect(() => {
    if (held || calm || !live) return;
    const t = setTimeout(() => setAt((v) => (v + 1) % ROWS.length), 2600);
    return () => clearTimeout(t);
  }, [at, held, calm, live]);
  return (
    <motion.div className="xcp-obj pf-obj" ref={ref} initial={{ opacity: 0, y: 48 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: EASE, delay: 0.35 }}
      onPointerEnter={(e) => e.pointerType === 'mouse' && setHeld(true)} onPointerLeave={() => setHeld(false)}>
      <div className="xcp-obj-h">
        <img src="/models/enso.webp" alt="" className="xcp-obj-img" />
        <div className="xcp-obj-q">
          <p className="pf-kick">Model routing APIs</p>
          <A to="/compare/model-routing" className="xcp-obj-link">Which API should you route your model calls through? <span aria-hidden="true">→</span></A>
        </div>
        <span className="xcp-obj-n pf-mono" aria-live="polite">{pad(at)} / 07<i key={at} className={'xcp-obj-tick' + (held || calm || !live ? ' held' : '')} aria-hidden="true" /></span>
      </div>
      <div className="xcp-scroll">
        <table className="xcp-t">
          <thead>
            <tr>
              <th scope="col" className="xcp-t-k"><span className="x-sr">Row</span></th>
              {COLS.map((c, i) => <th key={c} scope="col" className={i === 0 ? 'me' : ''}>{i === 0 && <small>Hanzo</small>}{c}</th>)}
            </tr>
          </thead>
          <tbody>
            {TABLE.map((r, i) => (
              <tr key={r.k} className={at === i ? 'on' : ''} onClick={() => { setAt(i); toChapter(i); }} onPointerEnter={(e) => e.pointerType === 'mouse' && setAt(i)} data-cursor="Read">
                <th scope="row">
                  <button type="button" className="xcp-t-row" onClick={(e) => { e.stopPropagation(); setAt(i); toChapter(i); }} onFocus={() => setAt(i)}>
                    <span className="pf-mono">{pad(i)}</span>{r.k}
                  </button>
                </th>
                {r.c.map((c, j) => (
                  <td key={j} className={'xcp-td ' + tone(c) + (j === 0 ? ' me' : '')}>
                    {c.v && <span className="xcp-v">{c.v === 'Yes' && <Check />}{c.v}</span>}
                    {c.d && <span className="xcp-d">{c.d}</span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

/* every cell in full, for the sheet */
function AllCells() {
  return (
    <div className="xcp-all">
      {TABLE.map((r, i) => (
        <section key={r.k} className="xcp-all-r" aria-labelledby={'xcp-all-' + i}>
          <h3 id={'xcp-all-' + i}><span className="pf-mono">{pad(i)}</span> {r.k}</h3>
          <dl>
            {r.c.map((c, j) => (
              <div key={j} className={'xcp-all-c ' + tone(c) + (j === 0 ? ' me' : '')}>
                <dt>{COLS[j]}</dt>
                <dd>{c.v && <b>{c.v}</b>}{c.v && c.d ? ' — ' : ''}{c.d}</dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </div>
  );
}

function Hero() {
  return (
    <section className="xcp-hero" aria-labelledby="xcp-h1">
      <div className="pf-wrap">
        <div className="xcp-hero-g">
          <div className="xcp-hero-h">
            <motion.p className="pf-kick" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, ease: EASE }}>Hanzo vs</motion.p>
            <MaskLines as="h1" id="xcp-h1" className="pf-display s" lines={['How we compare,', 'row by row, with the', 'source on every row']} />
          </div>
          <div className="xcp-hero-side">
            <p className="pf-lede">Each page sets a Hanzo product beside a named alternative.</p>
            <DetailSheet label="Every cell, in full" kicker="Model routing APIs" title="Which API should you route your model calls through?" wide>
              <AllCells />
            </DetailSheet>
          </div>
        </div>
        <HeroTable />
      </div>
    </section>
  );
}

/* ---------- the signature: one row per screen, a verdict board that flips to it ---------- */
function Board({ i }) {
  const r = TABLE[i];
  return (
    <div className="xcp-board" aria-hidden="true">
      {r.c.map((c, j) => (
        <div key={j} className={'xcp-lane ' + tone(c) + (j === 0 ? ' me' : '')}>
          <p className="xcp-lane-n">{j === 0 && <small>Hanzo</small>}{COLS[j]}</p>
          <div className="xcp-lane-v">
            <AnimatePresence initial={false}>
              <motion.div key={i} className="xcp-lane-in" initial={{ y: '60%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '-40%', opacity: 0, transition: { duration: 0.25, ease: EASE } }} transition={{ duration: 0.7, ease: EASE, delay: j * 0.05 }}>
                {c.v ? <b>{c.v === 'Yes' && <Check s={30} />}{c.v}</b> : <b className="xcp-lane-t">{c.d}</b>}
                {c.v && c.d && <span>{c.d}</span>}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      ))}
    </div>
  );
}

function Rows() {
  const chapters = TABLE.map((r, i) => ({
    kicker: `${pad(i)} / 07`,
    title: r.k,
    body: <p className="pf-body xcp-row-s">{r.s}</p>,
  }));
  return <PinScenes className="xcp-rows" label="The comparison, row by row" chapters={chapters} per={70} visual={(i) => <Board i={i} />} />;
}

/* ---------- Beyond: count the Yes ---------- */
function Tally() {
  const [keep, setKeep] = useState(YN);
  const flip = (i) => setKeep((k) => (k.includes(i) ? k.filter((x) => x !== i) : [...k, i].sort()));
  return (
    <section className="pf-sec xcp-tally" aria-labelledby="xcp-tally-h">
      <div className="pf-wrap pf-grid">
        <div className="xcp-tally-l">
          <h2 id="xcp-tally-h" className="pf-kick">Count the Yes</h2>
          <div className="xcp-chips" role="group" aria-label="Rows to count">
            {YN.map((i) => (
              <button key={i} type="button" aria-pressed={keep.includes(i)} onClick={() => flip(i)}>
                <i aria-hidden="true"><Check s={12} /></i>
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
                <span className="xcp-tally-n">{j === 0 && <small>Hanzo</small>}{c}</span>
                <span className="pf-num">{keep.length ? yes : '—'}<em>{keep.length ? ` / ${keep.length}` : ''}</em></span>
                <i aria-hidden="true"><b style={{ transform: `scaleX(${keep.length ? yes / keep.length : 0})` }} /></i>
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
        <h2 id="xcp-index-h" className="pf-kick">Comparisons</h2>
        <ol className="xcp-list">
          <li>
            <A to="/compare/model-routing" className="xcp-card" data-cursor="Open">
              <span className="xcp-card-img" data-morph><img src="/models/enso.webp" alt="" /></span>
              <span className="xcp-card-b">
                <span className="xcp-card-n pf-mono">01</span>
                <span className="xcp-card-q pf-head">Which API should you route your model calls through?</span>
                <span className="xcp-card-v pf-lede">— Hanzo <b>Enso</b> against <span>OpenRouter, Portkey, LiteLLM</span> .</span>
                <span className="xcp-card-go" aria-hidden="true"><svg viewBox="0 0 16 16" width="18" height="18"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
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
          <p className="pf-kick">A different question</p>
          <p className="xcp-diff-p">If what you are weighing is whether to run it yourself rather than buy it, that page is separate.</p>
        </div>
        <A to="/comparison" className="xcp-diff-c" data-morph data-cursor="Open">
          <span className="xcp-diff-a">Buy it, or run it</span>
          <i aria-hidden="true"><svg viewBox="0 0 16 16" width="20" height="20"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></i>
        </A>
      </div>
    </SceneWipe>
  );
}

export default function Compare() {
  return (
    <main className="xcp">
      <Hero />
      <Rows />
      <Tally />
      <Index />
      <Different />
    </main>
  );
}
