'use client';
/* A legal document (/legal/<doc>, 11 of them, one template), as a calm, precise reading room (Utility archetype).
   Persona: enterprise buyer, counsel and any user checking what they agreed to (PLAN-COMPONENTS 1.1, 2.5).
   Goal: find the clause you came for, and trust it is the current text (effective date and version up front).
   CTA: none to sell (PLAN-COMPONENTS 2.4: no thumb bar on legal, so the site's ask bar is off: data-ask="off"); the
   action is reading and finding. Metric: one contact click (the documents' own contact addresses).
   Stage: the document's name at display size beside its lede and dates; the hero object is the document's cover, a
   sheet with its own contour field (seeded from the document's name and counts) and every section as a numbered
   index. The cover reads itself: it turns through its clauses by itself, showing Hanzo's own number for it huge (or its
   title, where Hanzo numbers none) and its first sentence, and a hover or focus on any index row shows that clause instead. Then the reading room: a sticky contents
   rail beside 19px prose at 64 characters a line, each section opened by a big number plate that turns ink when you
   reach it. The other documents close the page as cards that open into their page.
   Signature: the reading rail. The contents marker springs to the section you are in while the line fills with your
   progress, and the percentage read counts beside it.
   Beyond: find in this document. Type a word and the contents show how often each section says it, the matches light
   up in the text, and sections without it dim, so you can go straight to the clause you came for.
   Motion, not only scroll: idle (the cover turns through its clauses, its contour drifts), pointer (index rows preview
   their clause, sibling rail drags with inertia), state (marker springs, find lights and dims), time (the cover's
   timing bar), scroll (rail line and percentage). 0 UI hues: ink, greys, white.
   Ledger: deletes the "Legal" kicker over the title, the invented "sections" and "min read" figures, the accent colour,
   and the find feature's invented sentences (numbers now, names from content/ui-strings.json).
   V2: 8/10 display title beside its lede and dates, a cover that reads its own clauses (hover previews any), 0-hue ink reading room with number plates, register-named find, sibling documents that open */
import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValueEvent, useScroll, useReducedMotion } from 'motion/react';
import Sigil from '../Sigil';
import { A } from '../kit';
import { Nodes, CopyLink, split } from './DocNodes';
import { useArrival } from './doorway';
import FamLines from '../v2/FamLines';
import FamStage from '../v2/FamStage';
import FamNext from '../v2/FamNext';
import { ui } from '../v2/famUi';
import './LegalDoc.css';
import './LegalRoom.css';

/* A page that is being read: lines of text, and a window of attention drifting down them. (Used by the /legal index.) */
/* children (a document's own Sigil) replace the drifting window, so only one thing moves in the hero */
export function Paper({ children }) {
  const bars = [92, 84, 96, 60, 0, 88, 94, 70, 90, 52, 0, 96, 82, 90, 66];
  return (
    <div className="xlg-paper" aria-hidden="true">
      <div className={'xlg-sheet' + (children ? ' sig' : '')}>
        {children}
        {bars.map((w, i) => (w ? <i key={i} style={{ width: w + '%' }} /> : <b key={i} />))}
        {!children && <span className="xlg-eye" />}
      </div>
      <span className="xlg-sheet xlg-sheet-b" />
    </div>
  );
}

/* counts each section's matches and lights them with the CSS Custom Highlight API where the browser has it */
function find(art, q) {
  const k = q.trim().toLowerCase();
  const hl = typeof CSS !== 'undefined' && CSS.highlights && typeof Highlight !== 'undefined';
  if (hl) CSS.highlights.delete('xlg-find');
  if (k.length < 2 || !art.current) return null;
  const hits = {}, ranges = [];
  art.current.querySelectorAll('section[data-s]').forEach((sec) => {
    let n = 0;
    const walk = document.createTreeWalker(sec, NodeFilter.SHOW_TEXT);
    for (let t = walk.nextNode(); t; t = walk.nextNode()) {
      const low = t.data.toLowerCase();
      for (let i = low.indexOf(k); i >= 0; i = low.indexOf(k, i + k.length)) {
        n++;
        if (hl && ranges.length < 400) { const r = new Range(); r.setStart(t, i); r.setEnd(t, i + k.length); ranges.push(r); }
      }
    }
    hits[sec.dataset.s] = n;
  });
  if (hl && ranges.length) CSS.highlights.set('xlg-find', new Highlight(...ranges));
  return hits;
}

function Rail({ toc, active, art }) {
  const { scrollYProgress } = useScroll({ target: art, offset: ['start 35%', 'end 65%'] });
  const pct = useRef(null);
  useMotionValueEvent(scrollYProgress, 'change', (v) => { if (pct.current) pct.current.textContent = Math.round(Math.min(1, Math.max(0, v)) * 100) + '%'; });
  const det = useRef(null);
  const [q, setQ] = useState('');
  const [hits, setHits] = useState(null);
  useEffect(() => { if (matchMedia('(max-width: 900px)').matches && det.current) det.current.open = false; }, []);
  useEffect(() => () => { if (typeof CSS !== 'undefined' && CSS.highlights) CSS.highlights.delete('xlg-find'); }, []);
  const total = hits ? Object.values(hits).reduce((a, b) => a + b, 0) : 0;
  const where = hits ? toc.filter((t) => hits[t.id]).length : 0;
  return (
    <aside className="xlg-rail xlg2-rail">
      <details open ref={det} className="xlg-det">
        <summary onClick={(e) => { if (matchMedia('(min-width: 901px)').matches) e.preventDefault(); }}>
          <h2>{ui('contents')}</h2>
          <span className="xlg-pct x-mono" ref={pct} aria-hidden="true">0%</span>
        </summary>
        {/* inline: the CSS build cannot parse ::highlight() yet */}
        <style>{'::highlight(xlg-find){background:rgba(0,0,0,.14)}'}</style>
        <div className="xlg-find">
          <label className="xlg2-find-f">
            <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true"><circle cx="8.5" cy="8.5" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.6" /><path d="M12.5 12.5 17 17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
            <input type="search" value={q} onChange={(e) => { setQ(e.target.value); setHits(find(art, e.target.value)); }} aria-label={ui('find')} />
          </label>
          <p className="x-mono xlg2-find-r" aria-live="polite">{hits ? (total ? <><b>{total}</b><span aria-hidden="true"> · {where}/{toc.length}</span><span className="x-sr"> · {where} {ui('of')} {toc.length}</span></> : ui('not_found')) : ''}</p>
        </div>
        <div className={'xlg-track' + (hits ? ' finding' : '')}>
          <span className="xlg-line" aria-hidden="true"><motion.i style={{ scaleY: scrollYProgress }} /></span>
          <nav aria-label="Contents">
            <ul>
              {toc.map((t) => (
                <li key={t.id}>
                  <a href={'#' + t.id} aria-current={active === t.id ? 'location' : undefined} data-none={hits && !hits[t.id] ? '' : undefined}>
                    {active === t.id && <motion.i layoutId="xlg-mark" className="xlg-mark" transition={{ type: 'spring', stiffness: 380, damping: 32 }} aria-hidden="true" />}
                    <span>{t.label}</span>
                    {hits && hits[t.id] > 0 && <em className="xlg-hit x-mono">{hits[t.id]}</em>}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </details>
    </aside>
  );
}

function Section({ s, i, on }) {
  const [num, text] = s.title ? split(s.title) : [null, null];
  return (
    <section className="xlg-sec xlg2-sec" data-s={s.id || 'top'} data-on={on || undefined}>
      {s.id && (
        <h2 id={s.id} className="xlg-hd xlg2-h2">
          <span className="xlg2-n v2f-num" aria-hidden={num ? undefined : 'true'}>{num || '§' + i}</span>
          <span className="xlg2-t">{text}</span>
          <CopyLink id={s.id} />
        </h2>
      )}
      <div className="xlg-prose xlg2-prose"><Nodes nodes={s.nodes} /></div>
    </section>
  );
}

/* a clause's first sentence, Hanzo's own words, for the cover's preview */
const plain = (nodes) => nodes.map((n) => (typeof n === 'string' ? n : n.t === 'h3' || n.t === 'table' ? ' ' : plain(n.c || []) + ' ')).join('');
const firstSentence = (nodes) => { const t = plain(nodes).replace(/\s+/g, ' ').trim(); const m = /^(.{40,220}?[.;:])(\s|$)/.exec(t); return m ? m[1] : t.slice(0, 200) + (t.length > 200 ? '…' : ''); };

/* the cover: the document as an object. Its contour, and a plate that turns through its clauses by itself (number
   huge, first sentence); hover or focus on an index row shows that clause and holds it */
function Cover({ doc }) {
  const calm = useReducedMotion();
  // only Hanzo's own section numbers are shown ("1."), never a count of ours
  const secs = doc.toc.map((t, k) => { const s = doc.sections.find((x) => x.id === t.id); const [num, text] = split(t.label); return { ...t, k, num, text, first: s ? firstSentence(s.nodes) : '' }; });
  const [at, setAt] = useState(0);
  const [held, setHeld] = useState(false);
  const box = useRef(null);
  useEffect(() => {
    if (calm || held || secs.length < 2) return;
    let seen = true;
    const io = new IntersectionObserver(([e]) => { seen = e.isIntersecting; });
    box.current && io.observe(box.current);
    const t = setInterval(() => { if (seen && !document.hidden) setAt((k) => (k + 1) % secs.length); }, 3400);
    return () => { clearInterval(t); io.disconnect(); };
  }, [calm, held, secs.length]);
  const cur = secs[at] || secs[0];
  const pick = (k) => { setAt(k); setHeld(true); };
  return (
    <div ref={box} className="xlg2-cover v2f-obj" onPointerLeave={() => setHeld(false)}>
      <div className="xlg2-cover-l" aria-hidden="true">
        <Sigil seed={'/legal/' + doc.slug} data={[doc.toc.length, doc.sections.length, doc.others.length]} className="xlg2-sigil" />
        {cur && (
          <div className="xlg2-read" key={cur.id}>
            {cur.num ? <span className="xlg2-read-n v2f-num">{cur.num}</span> : <span className="xlg2-read-h">{cur.text}</span>}
            <p className="xlg2-read-t">{cur.first}</p>
            {!calm && !held && secs.length > 1 && <i className="xlg2-read-bar" />}
          </div>
        )}
      </div>
      <nav className="xlg2-ix" aria-label={doc.title}>
        <ol>
          {secs.map((t) => {
            const [num, text] = split(t.label);
            return (
              <li key={t.id}>
                <a href={'#' + t.id} className={t.k === at ? 'on' : undefined} onPointerEnter={(e) => e.pointerType === 'mouse' && pick(t.k)} onFocus={() => pick(t.k)}>
                  <span className="xlg2-ix-n x-mono" aria-hidden="true">{num || '·'}</span>
                  <span className="xlg2-ix-t">{num ? <><span className="x-sr">{num} </span>{text}</> : t.label}</span>
                </a>
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}

export default function LegalDoc({ doc, peek = {} }) {
  useArrival();
  const art = useRef(null);
  const [active, setActive] = useState(doc.toc[0] && doc.toc[0].id);
  useEffect(() => {
    const secs = [...art.current.querySelectorAll('section[data-s]')].filter((s) => s.dataset.s !== 'top');
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) setActive(e.target.dataset.s); });
    }, { rootMargin: '-20% 0px -70% 0px' });
    secs.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [doc.slug]);
  const size = doc.title.length <= 14 ? '' : doc.title.length <= 26 ? ' mid' : ' small';
  let n = 0;
  return (
    <main className="v2f xlg xlg-doc xlg2" data-ask="off">
      <section className="xlg2-stage" aria-labelledby="xlg-h1">
        <div className="v2f-wrap v2f-grid xlg2-top">
          <FamLines as="h1" id="xlg-h1" className={'v2f-display xlg2-h1' + size} text={doc.title} data-morph-target />
          <div className="xlg2-side">
            <p className="v2f-lede xlg2-lede">{doc.lede}</p>
            <div className="xlg-meta xlg2-meta">
              {doc.meta.length > 0 && <Nodes nodes={doc.meta} />}
              <p className="xlg2-up"><A to="/legal" className="v2f-link">{doc.kicker}</A></p>
            </div>
          </div>
        </div>
        <div className="v2f-wrap xlg2-stage-o">
          <FamStage from={1.08} span={520}><Cover doc={doc} /></FamStage>
        </div>
      </section>
      <div className="v2f-wrap xlg-body xlg2-body">
        <Rail toc={doc.toc} active={active} art={art} />
        <article className="xlg-art xlg2-art" ref={art}>
          {doc.sections.map((s, i) => <Section key={s.id || 'top'} s={s} i={s.id ? ++n : 0} on={active === s.id} />)}
        </article>
      </div>
      <section className="xlg2-more v2f-sec tight">
        <div className="v2f-wrap">
          <h2 className="v2f-head xlg2-more-h"><A to="/legal" className="v2f-link">Legal &amp; Trust Center</A></h2>
          <FamNext label="Legal & Trust Center" items={[...doc.others.filter((o) => o.slug > doc.slug), ...doc.others.filter((o) => o.slug < doc.slug)].map((o) => ({ href: '/legal/' + o.slug, title: o.title, seed: '/legal/' + o.slug, preview: peek[o.slug] }))} />
        </div>
      </section>
    </main>
  );
}
