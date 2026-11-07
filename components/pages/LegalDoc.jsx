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
   Signature: the reading rail. The contents marker glides (300ms, ease-emphasis) to the section you are in while the line fills with your
   progress, and the percentage read counts beside it.
   Beyond: find in this document. Type a word and the contents show how often each section says it, the matches light
   up in the text, and sections without it dim, so you can go straight to the clause you came for.
   8 Nov (COPY-RULE rule 4, simple pages stay simple): the cover no longer turns by itself or zooms in on scroll, the
   title holds its size, phones go straight from the title to Contents, and the Contents rail shows its word.
   Motion, not only scroll: idle (the cover's contour drifts), pointer (index rows preview
   their clause, sibling rail drags with inertia), state (marker glides, find lights and dims), time (the cover's
   timing bar), scroll (rail line and percentage). 0 UI hues: ink, greys, white.
   Ledger: deletes the "Legal" kicker over the title, the invented "sections" and "min read" figures, the accent colour,
   and the find feature's invented sentences (numbers now, names from content/ui-strings.json).
   V2: the cover plate turns inside one stable node (masks out, masks in; a finger pauses it), its numeral 44px so the title leads, whole first sentences only, no invented numbers; the rail keeps the reader's row a third down; Hanzo's tables fit the reading column and stack as cards on phones; one index on phones with a chevroned Contents; ink 44px clear and copy controls; print sheet; reduced motion settled at first paint */
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, useMotionValueEvent, useScroll, useReducedMotion } from 'motion/react';
import Sigil from '../Sigil';
import { A, DataTable } from '../kit';
import { Nodes, Node, split } from './DocNodes';
import { play } from '../../lib/sound';
import { useArrival } from './doorway';
import FamLines from '../v2/FamLines';
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

/* the section's copy link (a legal-local copy of DocNodes' CopyLink): 44px on every pointer, it scales in with the
   heading's hover (not an opacity-only fade), and its confirmation is a check in an ink disc to its LEFT, so it never
   leaves the screen on a phone. Names from content/ui-strings.json; no unregistered sentence. */
function LCopy({ id }) {
  const [ok, setOk] = useState(false);
  const t = useRef(0);
  return (
    <button type="button" className="xlg2-cl" aria-label={ui('int_copy')} data-ok={ok || undefined}
      onClick={async () => {
        const url = location.origin + location.pathname + '#' + id;
        history.replaceState(null, '', '#' + id);
        // the check shows only when the link was really written; a blocked clipboard leaves it in the address bar
        try { await navigator.clipboard.writeText(url); } catch { return; }
        setOk(true); play('chime');
        clearTimeout(t.current);
        t.current = setTimeout(() => setOk(false), 1600);
      }}>
      <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M6.8 9.2a2.6 2.6 0 0 0 3.7 0l2-2a2.6 2.6 0 0 0-3.7-3.7l-.6.6M9.2 6.8a2.6 2.6 0 0 0-3.7 0l-2 2a2.6 2.6 0 0 0 3.7 3.7l.6-.6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
      <span className="xlg2-cl-ok" aria-hidden="true"><svg viewBox="0 0 16 16" width="14" height="14"><path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
    </button>
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
  const rail = useRef(null);
  // the rail follows the reader: the active row is kept inside the rail's own view
  useEffect(() => {
    const box = rail.current, a = box && box.querySelector('a[aria-current]');
    if (!a || box.scrollHeight <= box.clientHeight || matchMedia('(max-width: 900px)').matches) return;
    const r = a.getBoundingClientRect(), b = box.getBoundingClientRect();
    // the active row rides about a third of the way down the rail
    box.scrollTo({ top: box.scrollTop + (r.top - b.top) - b.height / 3 + r.height / 2, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }, [active]);
  const { scrollYProgress } = useScroll({ target: art, offset: ['start 35%', 'end 65%'] });
  const pct = useRef(null);
  useMotionValueEvent(scrollYProgress, 'change', (v) => { if (pct.current) pct.current.textContent = Math.round(Math.min(1, Math.max(0, v)) * 100) + '%'; });
  const det = useRef(null);
  const [q, setQ] = useState('');
  const [hits, setHits] = useState(null);
  const inp = useRef(null);
  const clear = () => { setQ(''); setHits(find(art, '')); if (inp.current) inp.current.focus(); };
  useEffect(() => { if (matchMedia('(max-width: 900px)').matches && det.current) det.current.open = false; }, []);
  useEffect(() => () => { if (typeof CSS !== 'undefined' && CSS.highlights) CSS.highlights.delete('xlg-find'); }, []);
  const total = hits ? Object.values(hits).reduce((a, b) => a + b, 0) : 0;
  const where = hits ? toc.filter((t) => hits[t.id]).length : 0;
  return (
    <aside ref={rail} className="xlg-rail xlg2-rail">
      <details open ref={det} className="xlg-det">
        <summary onClick={(e) => { if (matchMedia('(min-width: 901px)').matches) e.preventDefault(); }}>
          <h2 className="xlg2-sum-h">
            <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><path d="M3 5h2M3 10h2M3 15h2M8 5h9M8 10h9M8 15h6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
            <span className="xlg2-sum-t">{ui('contents')}</span>
          </h2>
          <span className="xlg-pct x-mono" ref={pct} aria-hidden="true">0%</span>
          <svg className="xlg2-chev" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </summary>
        {/* inline: the CSS build cannot parse ::highlight() yet */}
        <style>{'::highlight(xlg-find){background:rgba(0,0,0,.14)}'}</style>
        <div className="xlg-find">
          <div className="xlg2-find-row">
          <label className="xlg2-find-f">
            <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true"><circle cx="8.5" cy="8.5" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.6" /><path d="M12.5 12.5 17 17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
            <input ref={inp} type="search" value={q} onChange={(e) => { setQ(e.target.value); setHits(find(art, e.target.value)); }} onKeyDown={(e) => { if (e.key === 'Escape' && q) { e.preventDefault(); clear(); } }} aria-label={ui('find')} />
          </label>
          {q && (
            <button type="button" className="xlg2-clear" aria-label={ui('c4_reset')} onClick={clear}>
              <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>
            </button>
          )}
          </div>
          <p className="x-mono xlg2-find-r" aria-live="polite">{hits ? (total ? <><b>{total}</b><span aria-hidden="true"> · {where}/{toc.length}</span><span className="x-sr"> · {where} {ui('of')} {toc.length}</span></> : <><b aria-hidden="true">0</b><span className="x-sr">{ui('not_found')}</span></>) : ''}</p>
        </div>
        <div className={'xlg-track' + (hits ? ' finding' : '')}>
          <span className="xlg-line" aria-hidden="true"><motion.i style={{ scaleY: scrollYProgress }} /></span>
          <nav aria-label={ui('contents')}>
            <ul>
              {toc.map((t) => (
                <li key={t.id}>
                  <a href={'#' + t.id} aria-current={active === t.id ? 'location' : undefined} data-none={hits && !hits[t.id] ? '' : undefined}>
                    {active === t.id && <motion.i layoutId="xlg-mark" className="xlg-mark" transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} aria-hidden="true" />}
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

/* Hanzo's tables, through the kit's one DataTable: every cell as written (links kept), the first column the row
   header; the caption is the section's own heading */
const isEl = (k) => k && typeof k === 'object';
const textOf = (n) => (isEl(n) ? n.c.map(textOf).join('') : n || '');
function Table({ n, caption }) {
  const rowsOf = (sec) => (sec ? sec.c.filter((r) => isEl(r) && r.t === 'tr') : []);
  const thead = n.c.find((k) => isEl(k) && k.t === 'thead');
  const tbody = n.c.find((k) => isEl(k) && k.t === 'tbody') || n;
  const head = rowsOf(thead)[0];
  const heads = head ? head.c.filter(isEl).map((th) => textOf(th).replace(/\s+/g, ' ').trim()) : [];
  const body = rowsOf(tbody).filter((r) => r.c.some((k) => isEl(k) && (k.t === 'td' || k.t === 'th')) && r !== head);
  const width = Math.max(heads.length, ...body.map((r) => r.c.filter(isEl).length));
  const cols = Array.from({ length: width }, (_, j) => ({ key: 'c' + j, label: heads[j] || '' }));
  const rows = body.map((r) => Object.fromEntries(r.c.filter(isEl).map((td, j) => ['c' + j, <Nodes key={j} nodes={td.c} />])));
  return <DataTable caption={caption || heads.join(' · ')} cols={cols} rows={rows} className="xlg2-dt" />;
}
/* a section's nodes, with its tables through DataTable */
const Prose = ({ nodes, caption }) => nodes.map((n, i) => {
  if (isEl(n) && n.t === 'table') return <Table key={i} n={n} caption={caption} />;
  // the heading's words sit in one span (one leaf, Hanzo's line whole) beside its copy link
  if (isEl(n) && n.t === 'h3') { const id = n.a && n.a.id; return <h3 key={i} id={id} className="xlg-hd"><span className="xlg2-h3t">{n.c.every((k) => !isEl(k)) ? n.c.join('') : <Nodes nodes={n.c} />}</span>{id && <LCopy id={id} />}</h3>; }
  return <Node key={i} n={n} />;
});

function Section({ s, i, on }) {
  const [num, text] = s.title ? split(s.title) : [null, null];
  return (
    <section className="xlg-sec xlg2-sec" data-s={s.id || 'top'} data-on={on || undefined}>
      {s.id && (
        <h2 id={s.id} className="xlg-hd xlg2-h2">
          {num && <span className="xlg2-n v2f-num">{num}</span>}
          <span className="xlg2-t">{text}</span>
          <LCopy id={s.id} />
        </h2>
      )}
      <div className="xlg-prose xlg2-prose"><Prose nodes={s.nodes} caption={s.title} /></div>
    </section>
  );
}

/* a clause's first sentence, Hanzo's own words, for the cover's preview: the first whole sentence of its first paragraph,
   ending on its full stop (not after "Inc."), short enough to show whole. Never cut at ":" or ";", never an added "…":
   when no such sentence exists the plate shows the clause's own title instead (''). */
const plain = (nodes) => nodes.map((n) => (typeof n === 'string' ? n : n.t === 'table' ? ' ' : plain(n.c || []))).join('');
const firstSentence = (nodes) => {
  const p = nodes.find((n) => isEl(n) && n.t === 'p');
  if (!p) return '';
  const t = plain(p.c).replace(/\s+/g, ' ').trim();
  const m = /^(.{24,}?[a-z0-9)"”’](?<!\bInc|\bLtd|\bCo|\be\.g|\bi\.e|\bvs)[.!?])(\s|$)/.exec(t);
  const out = m ? m[1] : /[.!?]$/.test(t) ? t : '';
  return out.length <= 200 ? out : '';
};

/* the cover: the document as an object. Its contour, and a plate showing a clause (Hanzo's number, first sentence);
   hover or focus on an index row shows that clause and holds it */
function Cover({ doc }) {
  // reduced motion is read after hydration, so the server's HTML and the first client render agree (the CSS already
  // holds the plate still under reduced motion before that)
  const rm = useReducedMotion();
  const [calm, setCalm] = useState(false);
  useEffect(() => setCalm(!!rm), [rm]);
  // only Hanzo's own section numbers are shown ("1."), never a count of ours
  const secs = doc.toc.map((t, k) => { const s = doc.sections.find((x) => x.id === t.id); const [num, text] = split(t.label); return { ...t, k, num, text, first: s ? firstSentence(s.nodes) : '' }; });
  // the plate shows the first clause and turns only when you point at (or tab to) another index row: no timer, so
  // nothing moves on its own beside the text you are reading
  const [at, setAt] = useState(0);
  // the plate turns inside one stable node: the old clause masks up and out, then the next masks in from below
  // (no remount, so a swipe that starts on the card survives the turn)
  const [shown, setShown] = useState(0);
  const read = useRef(null);
  const leave = useRef(null); // the running mask-out, held until the next clause is in the DOM
  useEffect(() => {
    if (at === shown) return;
    const el = read.current;
    if (calm || !el || !el.animate) { setShown(at); return; }
    let live = true;
    const o = el.animate([{ clipPath: 'inset(0 0 0 0)', transform: 'none' }, { clipPath: 'inset(0 0 100% 0)', transform: 'translateY(-10px)' }], { duration: 220, easing: 'cubic-bezier(.4,0,1,1)', fill: 'forwards' });
    o.onfinish = () => { if (live) { leave.current = o; setShown(at); } };
    return () => { live = false; };
  }, [at, shown, calm]);
  // the next clause is in the DOM now (before paint): it masks in from below, and the held mask-out lets go
  useLayoutEffect(() => {
    const el = read.current, o = leave.current;
    if (!o || !el) return;
    leave.current = null;
    el.animate([{ clipPath: 'inset(100% 0 0 0)', transform: 'translateY(12px)' }, { clipPath: 'inset(0 0 0 0)', transform: 'none' }], { duration: 460, easing: 'cubic-bezier(.16,1,.3,1)' });
    o.cancel();
  }, [shown]);
  const cur = secs[shown] || secs[0];
  const pick = (k) => setAt(k);
  return (
    <div className="xlg2-cover v2f-obj">
      <div className="xlg2-cover-l" aria-hidden="true">
        <Sigil seed={'/legal/' + doc.slug} data={[doc.toc.length, doc.sections.length, doc.others.length]} className="xlg2-sigil" />
        {cur && (
          <div className="xlg2-read" ref={read}>
            {cur.num ? <span className="xlg2-read-n v2f-num">{cur.num}</span> : <span className="xlg2-read-h">{cur.text}</span>}
            <p className="xlg2-read-t">{cur.num ? cur.first || cur.text : cur.first}</p>
          </div>
        )}
      </div>
      <nav className="xlg2-ix" aria-label={doc.title}>
        <ol>
          {secs.map((t) => {
            const [num, text] = split(t.label);
            return (
              <li key={t.id}>
                <a href={'#' + t.id} className={t.k === at ? 'on' : undefined} data-cta={'legal.clause.' + doc.slug} onPointerEnter={(e) => e.pointerType === 'mouse' && pick(t.k)} onFocus={() => pick(t.k)}>
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
    // phones read each table row as a card: every cell carries its column's name
    art.current.querySelectorAll('table').forEach((t) => {
      const heads = [...t.querySelectorAll('thead th')].map((th) => th.textContent.trim());
      t.querySelectorAll('tbody tr').forEach((tr) => [...tr.children].forEach((td, j) => { if (heads[j]) td.setAttribute('data-col', heads[j]); }));
      const w = t.closest('.x-table-wrap'); if (w) { w.setAttribute('data-cards', ''); w.setAttribute('data-cursor', ''); }
    });
    // the page's metric: a click on one of the document's own contact addresses
    art.current.querySelectorAll('a[href^="mailto:"]').forEach((a) => a.setAttribute('data-cta', 'legal.contact.' + doc.slug));
    return () => io.disconnect();
  }, [doc.slug]);
  const size = doc.title.length <= 14 ? '' : doc.title.length <= 26 ? ' mid' : ' small';
  let n = 0;
  return (
    <main id="main" className="v2f xlg xlg-doc xlg2" data-ask="off">
      <section className="xlg2-stage" aria-labelledby="xlg-h1">
        <div className="v2f-wrap v2f-grid xlg2-top">
          <div className="xlg2-head">
            <FamLines as="h1" id="xlg-h1" className={'v2f-display xlg2-h1' + size} text={doc.title} settle={false} data-morph-target />
            <div className="xlg-meta xlg2-meta">
              {doc.meta.length > 0 && <Nodes nodes={doc.meta} />}
              <p className="xlg2-up"><A to="/legal" className="v2f-link">{doc.kicker}</A></p>
            </div>
          </div>
          <div className="xlg2-side">
            <p className="v2f-lede xlg2-lede">{doc.lede}</p>
          </div>
        </div>
        <div className="v2f-wrap xlg2-stage-o">
          <Cover doc={doc} />
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
