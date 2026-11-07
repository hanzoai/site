'use client';
/* Compare. Its idea is the row you can check.
   Signature: the featured comparison as a live table — Hanzo's column stays put while the others scroll beside it, a
   reading line walks the seven rows on its own and the row it reaches is read out in full beneath, and every cell
   opens to its detail on hover, focus or tap. Then the index of comparisons, and the one different question.
   Beyond: "Count the Yes". Untick the rows that do not matter to you and each API's tally of Yes re-counts over the
   rows you kept, straight from the cells of the table; rows whose answer is a number, not a yes or no, are left out.
   Every word is Hanzo's. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'motion/react';
import { EASE, Rise } from '../ui';
import { A } from '../kit';
import './Compare.css';

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

function Tally() {
  const [keep, setKeep] = useState(YN);
  const flip = (i) => setKeep((k) => (k.includes(i) ? k.filter((x) => x !== i) : [...k, i].sort()));
  return (
    <div className="xcp-tally">
      <div className="xcp-tally-rows" role="group" aria-label="Rows to count">
        <span className="xcp-k">Count the Yes</span>
        {YN.map((i) => <button key={i} type="button" aria-pressed={keep.includes(i)} onClick={() => flip(i)}><span className="x-mono">{pad(i)}</span>{TABLE[i].k}</button>)}
      </div>
      <ul className="xcp-tally-cols" aria-live="polite">
        {COLS.map((c, j) => {
          const yes = keep.filter((i) => TABLE[i].c[j].v === 'Yes').length;
          return (
            <li key={c} className={j === 0 ? 'me' : ''}>
              <b>{c}</b>
              <i aria-hidden="true"><em style={{ transform: `scaleX(${keep.length ? yes / keep.length : 0})` }} /></i>
              <span className="x-mono">{keep.length ? `${yes} / ${keep.length}` : '—'}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Cell({ c, col, row }) {
  const [open, setOpen] = useState(false);
  const tone = c.v === 'Yes' ? 'y' : c.v === 'No' ? 'n' : c.v ? 'v' : '';
  return (
    <td className={'xcp-td' + (col === 0 ? ' me' : '')} onPointerEnter={(e) => e.pointerType === 'mouse' && setOpen(true)} onPointerLeave={() => setOpen(false)}>
      <button type="button" className="xcp-cell" aria-expanded={open} onFocus={() => setOpen(true)} onBlur={() => setOpen(false)} onClick={() => setOpen((v) => !v)} aria-label={`${COLS[col]}, ${row}: ${c.t}`}>
        {c.v && <span className={'xcp-v ' + tone}>{tone === 'y' && <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true"><path d="M3.5 8.5l3 3 6-6.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}{c.v}</span>}
        {c.d && <span className="xcp-d">{c.d}</span>}
      </button>
      <AnimatePresence>
        {open && c.t.length > 3 && (
          <motion.span className="xcp-tip" role="tooltip" initial={{ opacity: 0, y: 6, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 4, transition: { duration: 0.12 } }} transition={{ duration: 0.22, ease: EASE }}>
            <b>{COLS[col]}</b>{c.t}
          </motion.span>
        )}
      </AnimatePresence>
    </td>
  );
}

function Featured() {
  const [at, setAt] = useState(0);
  const [mine, setMine] = useState(false);
  const calm = useReducedMotion();
  const ref = useRef(null);
  const live = useInView(ref, { amount: 0.3 });
  useEffect(() => {
    if (mine || calm || !live) return;
    const t = setTimeout(() => setAt((v) => (v + 1) % ROWS.length), 3000);
    return () => clearTimeout(t);
  }, [at, mine, calm, live]);
  return (
    <motion.div className="xcp-feat" ref={ref} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.35 }}>
      <div className="xcp-feat-h">
        <div className="xcp-feat-img" aria-hidden="true"><img src="/models/enso.webp" alt="" /></div>
        <div>
          <p className="xcp-k">Model routing APIs</p>
          <A to="/compare/model-routing" className="xcp-q">Which API should you route your model calls through? <span aria-hidden="true">→</span></A>
        </div>
        <span className="xcp-n x-mono" aria-live="polite">{pad(at)} / 07</span>
      </div>
      <div className="xcp-scroll">
        <table className="xcp-t">
          <thead><tr><th scope="col" className="xcp-th-k"><span className="x-sr">Row</span></th>{COLS.map((c, i) => <th key={c} scope="col" className={i === 0 ? 'me' : ''}>{i === 0 ? <><small>Hanzo</small>{c}</> : c}</th>)}</tr></thead>
          <tbody>
            {TABLE.map((r, i) => (
              <tr key={r.k} className={at === i ? 'on' : ''} onClick={() => { setMine(true); setAt(i); }} data-cursor="Read">
                <th scope="row"><span className="x-mono">{pad(i)}</span>{r.k}</th>
                {r.c.map((c, j) => <Cell key={j} c={c} col={j} row={r.k} />)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="xcp-cap" aria-live="polite">
        {/* every row's sentence is in the page; the row being read is shown */}
        {TABLE.map((r, i) => (
          <motion.p key={r.k} initial={false} animate={at === i ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }} transition={{ duration: 0.4, ease: EASE }} aria-hidden={at !== i}>
            <b>{r.k}.</b> {r.s}
          </motion.p>
        ))}
      </div>
      <Tally />
    </motion.div>
  );
}

export default function Compare() {
  const line = (t, d) => <span className="x-line"><motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: d }}>{t}</motion.span></span>;
  return (
    <main className="xcp">
      <section className="xcp-hero" aria-labelledby="xcp-h1">
        <div className="x-wrap">
          <div className="xcp-hero-h">
            <motion.p className="x-kick" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }}>Hanzo vs</motion.p>
            <h1 id="xcp-h1" className="xcp-h1">{line('How we compare, row by row, with the source on every row', 0.05)}</h1>
            <motion.p className="xcp-lede" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.3 }}>Each page sets a Hanzo product beside a named alternative.</motion.p>
          </div>
          <Featured />
        </div>
      </section>

      <section className="x-sec xcp-index">
        <div className="x-wrap xcp-index-g">
          <h2 className="xcp-h2">Comparisons</h2>
          <ol className="xcp-list">
            <Rise as="li">
              <A to="/compare/model-routing" className="xcp-item" data-morph>
                <span className="xcp-item-n x-mono">01</span>
                <span className="xcp-item-q">Which API should you route your model calls through?</span>
                <span className="xcp-item-v">— Hanzo <b>Enso</b> against <span>OpenRouter, Portkey, LiteLLM</span> .</span>
                <span className="xcp-item-go" aria-hidden="true">→</span>
              </A>
            </Rise>
          </ol>
        </div>
      </section>

      <section className="xcp-diff">
        <div className="x-wrap">
          <div>
            <A to="/comparison" className="xcp-diff-c" data-morph>
              <span className="xcp-diff-l">
                <span className="xcp-k">A different question</span>
                <span className="xcp-diff-p">If what you are weighing is whether to run it yourself rather than buy it, that page is separate.</span>
              </span>
              <span className="xcp-diff-a">Buy it, or run it <i aria-hidden="true">→</i></span>
            </A>
          </div>
        </div>
      </section>
    </main>
  );
}
