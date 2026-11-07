'use client';
/* The chain directory (/blockchain/directory): every network Hanzo lists, with its chain ID, its kind and the Hanzo
   products marked for it, read as a catalogue. The first screen is the directory's name at display size and how many
   chains it holds, as one huge figure that follows every filter, over a contour field seeded from the chain IDs.
   Signature: the coverage grid that re-flows and opens. Each chain card carries its ten product marks; the kind chips,
   the search and the product legend narrow the grid, which re-flows as it narrows; press a card and it opens in place
   into its full sheet (shared-element morph): the ten products, each marked or not.
   Beyond: the product filter in the legend (hanzo.ai only filters by kind).
   V2: 8/10 Display headline with the live chain count as the hero figure, a sticky filter bar, cards in the member's accent that open into their sheet. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, LayoutGroup, useReducedMotion } from 'motion/react';
import Sigil from '../../Sigil';
import FamLines from '../../v2/FamLines';
import { accentAt } from '../../v2/famAccent';
import '../../v2/fam.css';
import './blockchain.css';
import './BlockPage.css';

const KIND = { All: () => true, L1s: (k) => k === 'L1', L2s: (k) => k === 'L2', Rollups: (k) => /ROLLUP/i.test(k), 'Lux Ecosystem': (k) => /Lux/i.test(k), Cosmos: (k) => /COSMOS/i.test(k), Other: (k) => /OTHER/i.test(k) };
const SPRING = { type: 'spring', stiffness: 300, damping: 30 };

function Sheet({ c, onClose }) {
  const x = useRef(null);
  useEffect(() => {
    const back = document.activeElement;
    x.current && x.current.focus({ preventScroll: true });
    const key = (e) => { if (e.key === 'Escape') onClose(); };
    addEventListener('keydown', key);
    document.documentElement.classList.add('x-lock');
    window.__lenis && window.__lenis.stop();
    return () => {
      removeEventListener('keydown', key);
      document.documentElement.classList.remove('x-lock');
      window.__lenis && window.__lenis.start();
      back && back.focus && back.focus({ preventScroll: true });
    };
  }, [onClose]);
  return (
    <div className="xb2-open" role="dialog" aria-modal="true" aria-label={c.name}>
      <motion.button type="button" className="xb2-scrim" aria-label="Close" tabIndex={-1} onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.2 } }} />
      <motion.article className="xb2-panel" layoutId={'xb2-c-' + c.name} transition={SPRING} data-lenis-prevent>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.1, duration: 0.3 } }} exit={{ opacity: 0, transition: { duration: 0.1 } }}>
          <button ref={x} type="button" className="xb2-panel-x" aria-label="Close" onClick={onClose}>
            <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
          </button>
          <h3>{c.name}</h3>
          <p className="x-mono">{c.id && <span>{c.id}</span>}<span className="xb2-kind">{c.kind}</span></p>
          <ul className="xb2-plist">
            {c.marks.map((m) => <li key={m.p} className={m.on ? '' : 'off'}><span>{m.p}</span><i aria-label={m.on ? 'Marked' : 'Not marked'}>{m.on ? '✓' : '–'}</i></li>)}
          </ul>
        </motion.div>
      </motion.article>
    </div>
  );
}

export default function Directory({ doc }) {
  const [q, setQ] = useState('');
  const [kind, setKind] = useState(doc.filters[0] || 'All');
  const [prod, setProd] = useState(null);
  const [open, setOpen] = useState(null);
  const calm = useReducedMotion();
  const t = q.trim().toLowerCase();
  const fit = (c) => (KIND[kind] || KIND.All)(c.kind) && (!t || (c.name + ' ' + (c.id || '') + ' ' + c.kind).toLowerCase().includes(t)) && (!prod || c.marks.some((m) => m.p === prod && m.on));
  const n = doc.cards.filter(fit).length;
  const card = open && doc.cards.find((c) => c.name === open);
  return (
    <main className="xbc xbc-dir xb2 v2f" style={{ '--acc': accentAt(doc.i) }}>
      <section className="xb2-dir-hero" aria-labelledby="xbc-h1">
        <Sigil seed={doc.route} data={doc.cards.map((c) => parseInt((c.id || '').replace(/\D/g, ''), 10)).filter(Boolean)} className="xb2-dir-sig" />
        <div className="v2f-wrap v2f-grid xb2-dir-g">
          <div className="xb2-dir-t">
            <p className="v2f-kick acc xb2-chip"><i aria-hidden="true" />{doc.label}</p>
            <FamLines as="h1" id="xbc-h1" text={doc.title} className="v2f-display mid" data-morph-target />
            <p className="v2f-lede">{doc.lede}</p>
          </div>
          <p className="xb2-dir-n" aria-live="polite"><b className="v2f-num">{n}</b><span className="x-mono">/ {doc.cards.length}</span></p>
        </div>
      </section>

      <div className="xb2-tools">
        <div className="v2f-wrap">
          <div className="xb2-tools-in">
            {doc.search && (
              <label className="xbc-search">
                <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true"><circle cx="7" cy="7" r="4.6" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="M10.5 10.5 14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={doc.search} aria-label="Search chains" />
              </label>
            )}
            <div className="xbc-seg" role="group" aria-label="Kind" data-swipe-own>
              {doc.filters.map((f) => (
                <button key={f} type="button" aria-pressed={kind === f} onClick={() => setKind(f)}>
                  {kind === f && <motion.span layoutId="xbc-kind" className="xbc-seg-bg" transition={SPRING} />}
                  <span>{f}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="xb2-legend" role="group" aria-label={doc.legendLabel} data-swipe-own>
            <span>{doc.legendLabel}</span>
            {doc.legend.map((p) => <button key={p} type="button" aria-pressed={prod === p} onClick={() => setProd(prod === p ? null : p)}><i aria-hidden="true" />{p}</button>)}
          </div>
        </div>
      </div>

      <section className="xb2-dir-b" aria-label={doc.title}>
        <div className="v2f-wrap">
          <LayoutGroup>
            <ul className="xb2-dgrid">
              {doc.cards.map((c) => (
                <motion.li key={c.name} layout={calm ? false : 'position'} hidden={!fit(c)} transition={SPRING}>
                  <motion.div className="xb2-dcard" layoutId={'xb2-c-' + c.name} transition={SPRING}>
                    <h3>{c.name}</h3>
                    <p className="x-mono">{c.id && <span>{c.id}</span>}<span className="xb2-kind">{c.kind}</span></p>
                    <ul className="xb2-marks" aria-label={c.name + ' products'}>
                      {c.marks.map((m) => <li key={m.p} title={m.p} className={(m.on ? 'on' : '') + (prod === m.p ? ' hot' : '')}><span className="xbc-sr">{m.p}{m.on ? '' : ' (not marked)'}</span></li>)}
                    </ul>
                    <button type="button" className="xb2-dcard-hit" onClick={() => setOpen(c.name)} aria-label={c.name} aria-haspopup="dialog" data-cursor="Open" />
                  </motion.div>
                </motion.li>
              ))}
            </ul>
          </LayoutGroup>
          {n === 0 && <p className="xb2-none" role="status">No chain matches.</p>}
        </div>
      </section>
      <AnimatePresence>{card && <Sheet key={card.name} c={card} onClose={() => setOpen(null)} />}</AnimatePresence>
    </main>
  );
}
