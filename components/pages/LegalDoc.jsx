'use client';
/* A legal document (/legal/<doc>, 11 of them, one template), as a calm, precise reading room (Utility archetype).
   Stage: the document's name at display size, its lede and dates; the hero object is the document's cover, a sheet
   with its own contour field (seeded from the document's name and counts), its size (sections, minutes to read) and
   every section as a numbered index you can jump from, settling into place as you scroll. Then the reading room: a
   sticky contents rail beside 19px prose at 64 characters a line, each section opened by a big number plate that takes
   the document's accent when you reach it. The other documents close the page as cards that open into their page.
   Signature: the reading rail. The contents marker springs to the section you are in while the line fills with your
   progress, and the percentage read counts beside it.
   Beyond: find in this document. Type a word and the contents show how often each section says it, the matches light
   up in the text, and sections without it dim, so you can go straight to the clause you came for.
   Motion: signature (layout marker + scroll-linked line) · stage settle (scroll scale) · kinetic title · sigil field.
   V2: 8/10 display-size stage with the document's cover as the settling hero object (contour, size, numbered index), 19px reading measure with number plates, one accent per document, sibling documents as cards that open */
import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValueEvent, useScroll } from 'motion/react';
import Sigil from '../Sigil';
import { A } from '../kit';
import { Nodes, CopyLink, split } from './DocNodes';
import { useArrival } from './doorway';
import FamLines from '../v2/FamLines';
import FamStage from '../v2/FamStage';
import FamNext from '../v2/FamNext';
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
          <h2>Contents</h2>
          <span className="xlg-pct x-mono" ref={pct} aria-hidden="true">0%</span>
        </summary>
        {/* inline: the CSS build cannot parse ::highlight() yet */}
        <style>{'::highlight(xlg-find){background:color-mix(in srgb, var(--acc) 26%, transparent)}'}</style>
        <div className="xlg-find">
          <input type="search" value={q} onChange={(e) => { setQ(e.target.value); setHits(find(art, e.target.value)); }} placeholder="Find in this document" aria-label="Find in this document" />
          <p className="x-mono" aria-live="polite">{hits ? (total ? `${total} in ${where} of ${toc.length} sections` : 'Not in this document') : ''}</p>
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

/* how long the document is, from its own words (about 230 words a minute) */
const words = (nodes) => nodes.reduce((k, n) => k + (typeof n === 'string' ? n.split(/\s+/).filter(Boolean).length : words(n.c || [])), 0);

/* the cover: the document as an object, its contour, its size and its contents */
function Cover({ doc }) {
  const total = doc.sections.reduce((k, s) => k + words(s.nodes) + (s.title ? s.title.split(/\s+/).length : 0), 0);
  const mins = Math.max(1, Math.round(total / 230));
  return (
    <div className="xlg2-cover v2f-obj">
      <div className="xlg2-cover-l">
        <Sigil seed={'/legal/' + doc.slug} data={[doc.toc.length, doc.sections.length, doc.others.length]} className="xlg2-sigil" />
        <dl className="xlg2-size">
          <div><dt>sections</dt><dd className="v2f-num">{doc.toc.length}</dd></div>
          <div><dt>min read</dt><dd className="v2f-num">{mins}</dd></div>
        </dl>
      </div>
      <nav className="xlg2-ix" aria-label={doc.title}>
        <ol>
          {doc.toc.map((t, k) => {
            const [num, text] = split(t.label);
            return (
              <li key={t.id}>
                <a href={'#' + t.id}>
                  <span className="xlg2-ix-n x-mono" aria-hidden="true">{String(k + 1).padStart(2, '0')}</span>
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

export default function LegalDoc({ doc, acc }) {
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
    <main className="v2f xlg xlg-doc xlg2" style={{ '--acc': acc }}>
      <section className="xlg2-stage" aria-labelledby="xlg-h1">
        <div className="v2f-wrap">
          <p className="v2f-kick xlg2-kick"><A to="/legal">{doc.kicker}</A></p>
          <FamLines as="h1" id="xlg-h1" className={'v2f-display xlg2-h1' + size} text={doc.title} data-morph-target />
          <div className="v2f-grid xlg2-intro">
            <p className="v2f-lede xlg2-lede">{doc.lede}</p>
            {doc.meta.length > 0 && <div className="xlg-meta xlg2-meta"><Nodes nodes={doc.meta} /></div>}
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
          <p className="v2f-kick xlg2-kick"><A to="/legal">Legal &amp; Trust Center</A></p>
          <FamNext label="Legal & Trust Center" items={doc.others.map((o) => ({ href: '/legal/' + o.slug, title: o.title, seed: '/legal/' + o.slug }))} />
        </div>
      </section>
    </main>
  );
}
