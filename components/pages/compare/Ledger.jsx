'use client';
/* /compare/<page> (one template): a proof page told like a model launch. The question as a headline, the hero figures as
   a race the vendors run in the table's own order (Enso is not first, and the page says so), then the ledger, a calm
   dark room on reading it honestly, and the doors out. Every word, figure and link is Hanzo's; the reported rows are the
   ones hanzo.ai/compare lists for this comparison, each vendor's own claim.
   Signature: the ledger files in. It opens on the rows Hanzo ran itself; press "+ Reported" and the vendors' own claims
   file in under it one by one, each cell a mark (yes, no, part, not published, a figure) beside its sentence, with the
   provenance stamped on every row.
   Supporting: the hero figures race to their published counts, a sliding ink on the switches, a clip-path wipe opening
   the dark room, a magnetic ask. Greys only (v3): hierarchy comes from ink, silver and the stamps, not from hues.
   Beyond: where they do differ. One switch (named in the lede's own words) folds every row on which all four say the same, and counts what is left,
   so you can test the page's own claim that they differ less than any of them advertise.
   Persona: Developer weighing OpenRouter, Portkey or LiteLLM. Goal: check the comparison and choose Enso. Metric: api_key_created.
   CTA: "Hanzo Enso" (to /enso): the one solid ask, in the hero and in "Go deeper"; vendor sites are text links.
   V2: 8.5/10 On Hanzo's deck: race of published counts as the 64px Air hero object that keeps reading after it lands, kit Tabs + DataTable ledger whose reported rows file in, subject column tinted, 13px floor, black room opening from a card, no springs. */
// Persona: developer weighing OpenRouter, Portkey or LiteLLM (MASTER §1 Developer row)
// Goal: check the comparison, then open Enso. Metric: api_key_created
// CTA: "Hanzo Enso" (compare-model-routing.hero, data-thumb), repeated at "Go deeper" (compare-model-routing.close)
// Signature: the ledger files in: measured rows first, the vendors' own claims filing in under them, every cell a verdict mark, every row stamped with its provenance
// Beyond: only where they differ: one switch folds the rows where all four say the same and counts what is left
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';
import { Count, Lines } from '../../ui';
import { EASE_OUT_EXPO as EASE, DUR } from '../../../lib/motion';
import { A, Cta, Tabs, TabPanel, DataTable } from '../../kit';
import './Ledger.css';

/* JavaScript off: the headline and lede that cut in, the race bars at their real lengths, the dark room unclipped */
/* JavaScript off: the race bars at their real lengths (the shared rule clears the other entrance states) */
const NOJS = '.xvs-race-b i{transform:scaleX(var(--w))!important}';
const Chev = () => <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
/* the page's one ask, in Hanzo's words: its own product, the first door in "Go deeper"; solid once per screen */
function Ask({ to, big, thumb, id }) {
  if (!to) return null;
  return (
    <span className="xvs-ask-w" {...(thumb ? {} : { 'data-ask-hide': '' })}>
      <Cta to={to.href} kind="solid" id={id} className="xvs-ask" data-thumb={thumb ? to.label : undefined}><span>{to.label}</span><Chev /></Cta>
    </span>
  );
}
const num = (t) => { const m = /^([\d,.]+)\+?/.exec(t || ''); return m ? parseFloat(m[1].replace(/,/g, '')) : null; };
const host = (h) => { try { return new URL(h).host.replace(/^www\./, ''); } catch { return ''; } };

function Mark({ v }) {
  return <i className="xvs-mark" data-v={v} aria-hidden="true" />;
}

/* "Yes — same key" → the verdict word, then the rest of the sentence */
function Said({ c }) {
  const m = /^(Yes|No|Not published|not measured by us)( — |\.\s|$)(.*)$/i.exec(c.t);
  if (c.v === 'figure') {
    const f = /^([\d,.]+\+?)\s*(.*)$/.exec(c.t);
    return <span className="xvs-said"><b className="xvs-fig x-mono">{f[1]}</b>{f[2] && <span>{' ' + f[2]}</span>}</span>;
  }
  if (m) return <span className="xvs-said"><b><span>{m[1]}</span></b>{m[3] && <span>{(m[2].trim() ? ' ' + m[2].trim() + ' ' : ' ') + m[3]}</span>}</span>;
  return <span className="xvs-said"><span className="xvs-said-p">{c.t}</span></span>;
}

/* ---------- hero figures: the published counts, raced in the table's order ---------- */
function Race({ row, cols, stamp }) {
  const box = useRef(null);
  const seen = useInView(box, { once: true, amount: 0.3 });
  const live = useInView(box, { amount: 0.3 });
  const vals = row.cells.map((c) => num(c.t));
  const max = Math.max(...vals.filter((v) => v !== null), 1);
  const [at, setAt] = useState(-1); // the router being read; -1 before the race lands and after its one pass
  const [held, setHeld] = useState(false);
  useEffect(() => {
    if (!live || held || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // reading passes over the routers after the race lands: each pass ends with every figure in ink for a breath, then
    // the next begins, so the first screen stays quietly alive while it is in view (a hover holds the router you point at)
    let k = 0, t = 0;
    const step = () => { setAt(k < vals.length ? k : -1); k = (k + 1) % (vals.length + 1); t = setTimeout(step, 2400); };
    t = setTimeout(step, 2300);
    return () => clearTimeout(t);
  }, [live, held, vals.length]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <figure className="xvs-race" ref={box} data-reading={at >= 0 || undefined} onMouseLeave={() => setHeld(false)}>
      <figcaption className="xvs-race-h">
        <span className="xvs-kick x-mono">{row.label}</span>
        {stamp && <motion.span className="xvs-stamp" data-k="theirs" initial={{ opacity: 0, y: 6 }} animate={seen ? { opacity: 1, y: 0 } : {}} transition={{ duration: DUR.fade, ease: EASE, delay: 1.7 }}>{stamp}</motion.span>}
      </figcaption>
      <ol>
        {row.cells.map((c, i) => {
          const f = /^([\d,.]+)(\+?)\s*(.*)$/.exec(c.t) || [];
          return (
            <li key={cols[i]} data-us={i === 0 || undefined} data-on={i === at || undefined} onMouseEnter={() => { setHeld(true); setAt(i); }}>
              <span className="xvs-race-n">{cols[i]}</span>
              <span className="xvs-race-b" aria-hidden="true"><motion.i style={{ '--w': (vals[i] || 0) / max }} initial={false} animate={{ scaleX: seen ? (vals[i] || 0) / max : 0.02 }} transition={{ duration: DUR.reveal, ease: EASE, delay: 0.15 + i * 0.06 }} /></span>
              <span className="xvs-race-f x-mono">{vals[i] !== null ? <Count to={vals[i]} suffix={f[2] || ''} run={seen} delay={0.15 + i * 0.06} duration={DUR.reveal} /> : c.t}</span>
              {f[3] && <span className="xvs-race-x">{f[3]}</span>}
            </li>
          );
        })}
      </ol>
      <noscript><style>{NOJS}</style></noscript>
    </figure>
  );
}

/* ---------- the ledger ---------- */
function Ledger({ s, theirs, diffLabel }) {
  const [tab, setTab] = useState(0);
  const [diff, setDiff] = useState(false);
  const rows = useMemo(() => [
    ...s.measured.map((r) => ({ ...r, k: 'ours' })),
    ...s.reported.map((r) => ({ ...r, k: 'theirs', mark: theirs })),
  ], [s, theirs]);
  const same = (r) => r.cells.every((c) => c.v === r.cells[0].v && c.v !== 'figure');
  const toggles = s.toggles.length === 2 ? s.toggles : ['Measured', '+ Reported'];
  // the kit's DataTable: the first column is the row header, Enso the tinted subject column, provenance last
  const cols = [{ key: 'label', label: s.corner }, ...s.head.map((h, i) => ({ key: 'c' + i, label: h, subject: i === 0 })), { key: 'prov', label: s.prov }];
  const cell = (c) => (
    <span className="xvs-cell" data-v={c.v}>
      <Mark v={c.v} />
      <Said c={c} />
      {c.link && <A to={c.link.href} className="xvs-run x-mono">[ {c.link.label} ]</A>}
    </span>
  );
  const row = (r) => ({ label: r.label, ...Object.fromEntries(r.cells.map((c, i) => ['c' + i, cell(c)])), prov: <span className="xvs-stamp" data-k={r.k}>{r.mark}</span> });
  const measured = rows.filter((r) => r.k === 'ours');
  const all = rows.filter((r) => !diff || !same(r));
  const folded = diff ? rows.filter(same) : [];
  return (
    <section className="xvs-sec xvs-side" aria-labelledby="xvs-side-h">
      <div className="xvs-wrap xvs-split">
        <h2 id="xvs-side-h" className="xvs-h2">{s.h2}</h2>
        <p className="xvs-lede">{s.lede}</p>
      </div>
      <div className="xvs-wrap">
        <div className="xvs-ctl">
          <Tabs id="xvs-rows" label="Which rows to show" tabs={toggles} value={tab} onChange={setTab} />
          {s.reported.length > 0 && (
            <button type="button" role="switch" aria-checked={diff} aria-controls="xvs-rows-panel-1" className="xvs-diff" disabled={tab !== 1} onClick={() => setDiff((d) => !d)}>
              <span className="xvs-diff-k" aria-hidden="true"><i /></span>
              <span>{diffLabel}</span>
              <span className="xvs-diff-n x-mono" aria-live="polite">{rows.filter((r) => !same(r)).length} / {rows.length}</span>
            </button>
          )}
        </div>
        <div className="xvs-led">
          <TabPanel id="xvs-rows" i={0} value={tab}><DataTable caption={s.corner} cols={cols} rows={measured.map(row)} /></TabPanel>
          <TabPanel id="xvs-rows" i={1} value={tab}>
            <DataTable key={diff ? 'd' : 'a'} caption={s.corner} cols={cols} rows={all.map(row)} />
            {folded.length > 0 && <p className="xvs-folded"><span className="x-mono">{folded.length}</span> {folded.map((r) => r.label).join(' · ')}</p>}
          </TabPanel>
        </div>
        {s.note && <p className="xvs-note"><strong>{s.note.k}</strong> {s.note.t}</p>}
      </div>
    </section>
  );
}

/* ---------- reading it honestly: the one dark room, opened by a wipe ---------- */
function Honest({ h }) {
  const [legend, ...rest] = h.paras;
  const last = rest.length ? rest[rest.length - 1].join('') : '';
  const cut = last.indexOf('. ');
  const big = cut > 0 ? last.slice(0, cut + 1) : last;
  const tail = cut > 0 ? last.slice(cut + 2) : '';
  const marks = { 'we ran this': 'ours', 'they published this': 'theirs', 'not published': 'none' };
  return (
    <motion.section className="xvs-sec xvs-honest" data-room="dark" aria-labelledby="xvs-hon-h"
      initial={{ clipPath: 'inset(0% 2.2% 0% 2.2% round 24px)' }} whileInView={{ clipPath: 'inset(0% 0% 0% 0% round 0px)' }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: DUR.reveal, ease: EASE }}>
      <div className="xvs-wrap">
        <h2 id="xvs-hon-h" className="xvs-kick x-mono">{h.h2}</h2>
        {big && <p className="xvs-quote">{big}</p>}
        <div className="xvs-hon-g">
          {tail && <p className="xvs-body xvs-hon-tail">{tail}</p>}
          {legend && (
            <p className="xvs-body xvs-legend">
              {legend.map((k, i) => (typeof k === 'string' ? k : <em key={i} className="xvs-stamp" data-k={marks[k.em] || 'none'}>{k.em}</em>))}
            </p>
          )}
        </div>
        {rest.slice(0, -1).map((p, i) => <p key={i} className="xvs-body">{p.map((k) => (typeof k === 'string' ? k : k.em)).join('')}</p>)}
      </div>
    </motion.section>
  );
}

function Deeper({ d }) {
  const [us, ...them] = d.links;
  return (
    <section className="xvs-sec xvs-deep" aria-labelledby="xvs-deep-h">
      <div className="xvs-wrap">
        <div className="xvs-deep-h">
          <h2 id="xvs-deep-h" className="xvs-h2">{d.h2}</h2>
          <Ask to={us} big id="compare-model-routing.close" />
        </div>
        <ul className="xvs-them">
          {them.map((l) => (
            <li key={l.href}>
              <A to={l.href}>
                <span className="xvs-them-t">{l.label}</span>
                <span className="xvs-them-h x-mono">{host(l.href)} ↗</span>
              </A>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default function Versus({ doc }) {
  const s = doc.side;
  const theirs = doc.honest && doc.honest.paras.flat().find((k) => k && k.em && /published this/.test(k.em));
  const hero = s && s.reported.find((r) => r.cells.every((c) => c.v === 'figure'));
  // the switch's label is the lede's own words ("…and where they do differ…")
  const said = /where they (do )?differ/i.exec(doc.lede || '');
  const diffLabel = said ? said[0][0].toUpperCase() + said[0].slice(1) : s && s.toggles[1];
  return (
    <main className="xvs">
      <section className="xvs-hero" aria-labelledby="xvs-h1">
        <div className="xvs-wrap xvs-hero-g">
          <div className="xvs-hero-t">
            <Lines as="h1" play="load" id="xvs-h1" className="xvs-h1" lines={[doc.h1]} data-morph-target="" />
            {doc.label && <p className="xvs-meta">{doc.label}</p>}
            <motion.p className="xvs-lede" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: DUR.enter, ease: EASE, delay: 0.35 }}>{doc.lede}</motion.p>
          </div>
          {hero && <Race row={hero} cols={s.cols} stamp={theirs && theirs.em} />}
          {doc.deeper && <div className="xvs-hero-a"><Ask to={doc.deeper.links[0]} big thumb id="compare-model-routing.hero" /></div>}
        </div>
      </section>
      {s && <Ledger s={s} theirs={theirs ? theirs.em : ''} diffLabel={diffLabel} />}
      {doc.honest && <Honest h={doc.honest} />}
      {doc.deeper && <Deeper d={doc.deeper} />}
    </main>
  );
}
