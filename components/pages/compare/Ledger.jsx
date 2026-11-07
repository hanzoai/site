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
   Beyond: only where they differ. One switch folds every row on which all four say the same, and counts what is left,
   so you can test the page's own claim that they differ less than any of them advertise.
   Persona: Developer weighing OpenRouter, Portkey or LiteLLM. Goal: check the comparison and choose Enso. Metric: api_key_created.
   CTA: "Hanzo Enso" (to /enso): the one solid ask, in the hero and in "Go deeper"; vendor sites are text links.
   V2: 8/10 From a raw ported table to a launch-style proof page: hero figure race, a ledger that files in with verdict marks and provenance stamps, a differences-only switch, one dark room; greyscale, one solid ask hero to close. */
// Signature: the ledger files in: measured rows first, the vendors' own claims filing in under them, every cell a verdict mark, every row stamped with its provenance
// Beyond: only where they differ: one switch folds the rows where all four say the same and counts what is left
import { useMemo, useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';
import { EASE, Count, Magnetic } from '../../ui';
import { A } from '../../kit';
import './Ledger.css';

const INK = { type: 'spring', stiffness: 300, damping: 30 };
const Chev = () => <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
/* the page's one ask, in Hanzo's words: its own product, the first door in "Go deeper"; solid once per screen */
function Ask({ to, big }) {
  if (!to) return null;
  return <Magnetic strength={0.25}><A to={to.href} className={'x-btn solid xvs-ask' + (big ? ' big' : '')} data-thumb=""><span>{to.label}</span><Chev /></A></Magnetic>;
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
  if (m) return <span className="xvs-said"><b>{m[1]}</b>{m[3] && <span>{(m[2].trim() ? ' ' + m[2].trim() + ' ' : ' ') + m[3]}</span>}</span>;
  return <span className="xvs-said"><span className="xvs-said-p">{c.t}</span></span>;
}

/* ---------- hero figures: the published counts, raced in the table's order ---------- */
function Race({ row, cols, stamp }) {
  const box = useRef(null);
  const seen = useInView(box, { once: true, amount: 0.5 });
  const vals = row.cells.map((c) => num(c.t));
  const max = Math.max(...vals.filter((v) => v !== null), 1);
  return (
    <figure className="xvs-race" ref={box}>
      <figcaption className="xvs-race-h"><span className="xvs-kick x-mono">{row.label}</span>{stamp && <span className="xvs-stamp" data-k="theirs">{stamp}</span>}</figcaption>
      <ol>
        {row.cells.map((c, i) => {
          const f = /^([\d,.]+)(\+?)\s*(.*)$/.exec(c.t) || [];
          return (
            <li key={cols[i]} data-us={i === 0 || undefined}>
              <span className="xvs-race-n">{cols[i]}</span>
              <span className="xvs-race-b" aria-hidden="true"><motion.i initial={false} animate={{ scaleX: seen ? (vals[i] || 0) / max : 0.02 }} transition={{ duration: 1.4, ease: EASE, delay: 0.15 + i * 0.12 }} /></span>
              <span className="xvs-race-f x-mono">{vals[i] !== null ? <Count to={vals[i]} suffix={f[2] || ''} run={seen} delay={0.15 + i * 0.12} duration={1.4} /> : c.t}</span>
              {f[3] && <span className="xvs-race-x">{f[3]}</span>}
            </li>
          );
        })}
      </ol>
    </figure>
  );
}

/* ---------- the ledger ---------- */
function Ledger({ s, theirs }) {
  const [more, setMore] = useState(false);
  const [diff, setDiff] = useState(false);
  const rows = useMemo(() => [
    ...s.measured.map((r) => ({ ...r, k: 'ours' })),
    ...s.reported.map((r) => ({ ...r, k: 'theirs', mark: theirs })),
  ], [s, theirs]);
  const same = (r) => r.cells.every((c) => c.v === r.cells[0].v && c.v !== 'figure');
  const open = rows.filter((r) => (r.k === 'ours' || more));
  const shown = open.filter((r) => !diff || !same(r));
  const folded = open.filter((r) => diff && same(r));
  const toggles = s.toggles.length === 2 ? s.toggles : ['Measured', '+ Reported'];
  return (
    <section className="xvs-sec xvs-side" aria-labelledby="xvs-side-h">
      <div className="xvs-wrap">
        <div className="xvs-side-h">
          <h2 id="xvs-side-h" className="xvs-h2">{s.h2}</h2>
          <p className="xvs-lede">{s.lede}</p>
        </div>
        <div className="xvs-ctl">
          <div role="radiogroup" aria-label="Which rows to show" className="xvs-seg">
            {toggles.map((t, i) => (
              <button key={t} type="button" role="radio" aria-checked={more === (i === 1)} tabIndex={more === (i === 1) ? 0 : -1} onClick={() => setMore(i === 1)}
                onKeyDown={(e) => { if (/Arrow(Right|Left|Up|Down)/.test(e.key)) { e.preventDefault(); setMore(!more); e.currentTarget.parentNode.children[more ? 0 : 1]?.focus(); } }}>
                {more === (i === 1) && <motion.i layoutId="xvs-seg-ink" transition={INK} />}<span>{t}</span>
              </button>
            ))}
          </div>
          {s.reported.length > 0 && (
            <button type="button" role="switch" aria-checked={diff} className="xvs-diff" onClick={() => setDiff((d) => !d)}>
              <span className="xvs-diff-k" aria-hidden="true"><i /></span>
              <span>Only where they differ</span>
              <span className="xvs-diff-n x-mono" aria-live="polite">{open.filter((r) => !same(r)).length} of {open.length}</span>
            </button>
          )}
        </div>

        <div className="xvs-tab" role="table" aria-label={s.corner}>
          <div className="xvs-tr xvs-thead" role="row">
            <span role="columnheader" className="xvs-corner">{s.corner}</span>
            {s.head.map((h, i) => <span key={h} role="columnheader" className="xvs-col" data-us={i === 0 || undefined}>{h}</span>)}
            <span role="columnheader" className="xvs-prov-h">{s.prov}</span>
          </div>
          {rows.map((r, ri) => {
            const on = shown.includes(r);
            const n = shown.indexOf(r);
            return (
              <motion.div key={r.label} role="row" className="xvs-tr" data-k={r.k} hidden={!on} initial={false}
                animate={on ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }} transition={{ duration: 0.55, ease: EASE, delay: on && r.k === 'theirs' ? 0.06 * n : 0 }}>
                <span role="rowheader" className="xvs-rh">{r.label}</span>
                {r.cells.map((c, i) => (
                  <span key={i} role="cell" className="xvs-td" data-us={i === 0 || undefined} data-v={c.v}>
                    <span className="xvs-td-c x-mono" aria-hidden="true">{s.cols[i]}</span>
                    <Mark v={c.v} />
                    <Said c={c} />
                    {c.link && <A to={c.link.href} className="xvs-run x-mono">[ {c.link.label} ]</A>}
                  </span>
                ))}
                <span role="cell" className="xvs-prov"><span className="xvs-stamp" data-k={r.k}>{r.mark}</span></span>
              </motion.div>
            );
          })}
        </div>
        {folded.length > 0 && (
          <p className="xvs-folded"><span className="x-mono">{folded.length}</span> {folded.map((r) => r.label).join(' · ')}</p>
        )}
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
      initial={{ clipPath: 'inset(10% 4% 10% 4% round 28px)' }} whileInView={{ clipPath: 'inset(0% 0% 0% 0% round 0px)' }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 1.1, ease: EASE }}>
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
          <Ask to={us} big />
        </div>
        <ul className="xvs-them">
          {them.map((l) => (
            <li key={l.href}>
              <A to={l.href} data-cursor="Open">
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
  return (
    <main className="xvs">
      <section className="xvs-hero" aria-labelledby="xvs-h1">
        <div className="xvs-wrap xvs-hero-g">
          <div className="xvs-hero-t">
            <h1 id="xvs-h1" className="xvs-h1" data-morph-target>
              <span className="x-line"><motion.span className="x-line-in" initial={{ y: '106%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.1 }}>{doc.h1}</motion.span></span>
            </h1>
            {doc.label && <p className="xvs-meta">{doc.label}</p>}
            <motion.p className="xvs-lede" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: 0.35 }}>{doc.lede}</motion.p>
            {doc.deeper && <div className="xvs-hero-a"><Ask to={doc.deeper.links[0]} big /></div>}
          </div>
          {hero && <Race row={hero} cols={s.cols} stamp={theirs && theirs.em} />}
        </div>
      </section>
      {s && <Ledger s={s} theirs={theirs ? theirs.em : ''} />}
      {doc.honest && <Honest h={doc.honest} />}
      {doc.deeper && <Deeper d={doc.deeper} />}
    </main>
  );
}
