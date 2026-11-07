'use client';
/* The chain directory (/blockchain/directory): every network Hanzo lists, with its chain ID, its kind and the Hanzo
   products marked for it. Search and the kind filters work as on hanzo.ai.
   Signature: the coverage grid. Each chain card carries its ten product marks; press a product in the legend and the
   grid keeps only the chains that have it, re-flowing as it narrows.
   Beyond: the product filter in the legend (hanzo.ai only filters by kind). */
import { useState } from 'react';
import { motion, LayoutGroup } from 'motion/react';
import { EASE } from '../../ui';
import Sigil from '../../Sigil';
import './blockchain.css';

const KIND = { All: () => true, L1s: (k) => k === 'L1', L2s: (k) => k === 'L2', Rollups: (k) => /ROLLUP/i.test(k), 'Lux Ecosystem': (k) => /Lux/i.test(k), Cosmos: (k) => /COSMOS/i.test(k), Other: (k) => /OTHER/i.test(k) };

export default function Directory({ doc }) {
  const [q, setQ] = useState('');
  const [kind, setKind] = useState(doc.filters[0] || 'All');
  const [prod, setProd] = useState(null);
  const t = q.trim().toLowerCase();
  const fit = (c) => (KIND[kind] || KIND.All)(c.kind) && (!t || (c.name + ' ' + (c.id || '') + ' ' + c.kind).toLowerCase().includes(t)) && (!prod || c.marks.some((m) => m.p === prod && m.on));
  const n = doc.cards.filter(fit).length;
  return (
    <main className="xbc xbc-dir">
      <section className="xbc-hero" aria-labelledby="xbc-h1">
        <Sigil seed={doc.route} data={doc.cards.map((c) => parseInt((c.id || '').replace(/\D/g, ''), 10)).filter(Boolean)} className="xbc-sigil" />
        <div className="x-wrap">
          <motion.p className="xbc-chip" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }}><i aria-hidden="true" />{doc.label}</motion.p>
          <h1 id="xbc-h1" className="xbc-h1" data-morph-target><span className="x-line"><motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.06 }}>{doc.title}</motion.span></span></h1>
          <motion.p className="xbc-lede" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.3 }}>{doc.lede}</motion.p>
        </div>
      </section>
      <section className="xbc-dir-b">
        <div className="x-wrap">
          <div className="xbc-dir-tools">
            {doc.search && (
              <label className="xbc-search">
                <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true"><circle cx="7" cy="7" r="4.6" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="M10.5 10.5 14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={doc.search} aria-label="Search chains" />
              </label>
            )}
            <div className="xbc-seg" role="group" aria-label="Kind">
              {doc.filters.map((f) => (
                <button key={f} type="button" aria-pressed={kind === f} onClick={() => setKind(f)}>
                  {kind === f && <motion.span layoutId="xbc-kind" className="xbc-seg-bg" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
                  <span>{f}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="xbc-legend" role="group" aria-label={doc.legendLabel}>
            <span>{doc.legendLabel}</span>
            {doc.legend.map((p) => <button key={p} type="button" aria-pressed={prod === p} onClick={() => setProd(prod === p ? null : p)}>{p}</button>)}
            <span className="xbc-count x-mono" aria-live="polite">{n} / {doc.cards.length}</span>
          </div>
          <LayoutGroup>
            <ul className="xbc-dir-grid">
              {doc.cards.map((c) => (
                <motion.li key={c.name} layout="position" hidden={!fit(c)} transition={{ type: 'spring', stiffness: 300, damping: 32 }}>
                  <div className="xbc-dcard">
                    <h3>{c.name}</h3>
                    <p className="x-mono">{c.id && <span>{c.id}</span>}<span className="xbc-kind">{c.kind}</span></p>
                    <ul className="xbc-marks" aria-label={c.name + ' products'}>
                      {c.marks.map((m) => <li key={m.p} title={m.p} className={(m.on ? 'on' : '') + (prod === m.p ? ' hot' : '')}><span className="xbc-sr">{m.p}{m.on ? '' : ' (not marked)'}</span></li>)}
                    </ul>
                  </div>
                </motion.li>
              ))}
            </ul>
          </LayoutGroup>
          {n === 0 && <p className="xbc-none" role="status">No chain matches.</p>}
        </div>
      </section>
    </main>
  );
}
