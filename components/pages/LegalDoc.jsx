'use client';
/* A legal document as a reading room (/legal/<doc>, one template). A sticky table of contents follows your place with
   a moving marker and a progress line, each section number settles as you reach it, tables keep their headers while
   you read them, and every heading carries a link to itself. The words are Hanzo's, untouched.
   Signature: the reading rail. The contents marker springs to the section you are in while the line fills with your
   progress; the sheet in the hero carries a contour field seeded from this document's own counts.
   Beyond: find in this document. Type a word and the contents show how often each section says it, the matches light
   up in the text, and sections without it dim, so you can go straight to the clause you came for. */
import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValueEvent, useScroll, useSpring } from 'motion/react';
import Sigil from '../Sigil';
import { EASE } from '../ui';
import { A } from '../kit';
import { Nodes, CopyLink, split } from './DocNodes';
import { useArrival } from './doorway';
import './LegalDoc.css';

/* A page that is being read: lines of text, and a window of attention drifting down them. */
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
  const fill = useSpring(scrollYProgress, { stiffness: 140, damping: 28, restDelta: 0.001 });
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
    <aside className="xlg-rail">
      <details open ref={det} className="xlg-det">
        <summary onClick={(e) => { if (matchMedia('(min-width: 901px)').matches) e.preventDefault(); }}>
          <h2>Contents</h2>
          <span className="xlg-pct x-mono" ref={pct} aria-hidden="true">0%</span>
        </summary>
        {/* inline: the CSS build cannot parse ::highlight() yet */}
        <style>{'::highlight(xlg-find){background:rgba(10,132,255,.22)}'}</style>
        <div className="xlg-find">
          <input type="search" value={q} onChange={(e) => { setQ(e.target.value); setHits(find(art, e.target.value)); }} placeholder="Find in this document" aria-label="Find in this document" />
          <p className="x-mono" aria-live="polite">{hits ? (total ? `${total} in ${where} of ${toc.length} sections` : 'Not in this document') : ''}</p>
        </div>
        <div className={'xlg-track' + (hits ? ' finding' : '')}>
          <span className="xlg-line" aria-hidden="true"><motion.i style={{ scaleY: fill }} /></span>
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
    <section className="xlg-sec" data-s={s.id || 'top'} data-on={on || undefined}>
      {s.id && (
        <h2 id={s.id} className="xlg-hd xlg-h2">
          <motion.span
            className="xlg-n x-mono"
            aria-hidden={num ? undefined : 'true'}
            initial={{ opacity: 0, y: '-0.7em', filter: 'blur(6px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, amount: 1, margin: '0px 0px -12% 0px' }}
            transition={{ type: 'spring', stiffness: 170, damping: 13, mass: 0.9 }}
          >
            {num || '§' + i}
          </motion.span>
          <span>{text}</span>
          <CopyLink id={s.id} />
        </h2>
      )}
      <div className="xlg-prose"><Nodes nodes={s.nodes} /></div>
    </section>
  );
}

export default function LegalDoc({ doc }) {
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
  const line = (t, d) => (
    <span className="x-line"><motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: d }}>{t}</motion.span></span>
  );
  let n = 0;
  return (
    <main className="xlg xlg-doc">
      <section className="xlg-hero" aria-labelledby="xlg-h1">
        <div className="x-wrap xlg-hero-g">
          <div>
            <motion.p className="x-kick" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }}>
              <A to="/legal">{doc.kicker}</A>
            </motion.p>
            <h1 id="xlg-h1" className="xlg-h1">{line(doc.title, 0.05)}</h1>
            <motion.p className="xlg-lede" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}>{doc.lede}</motion.p>
            {doc.meta.length > 0 && (
              <motion.div className="xlg-meta" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.5 }}><Nodes nodes={doc.meta} /></motion.div>
            )}
          </div>
          <Paper><Sigil seed={'/legal/' + doc.slug} data={[doc.toc.length, doc.sections.length, doc.others.length]} className="xlg-sigil" /></Paper>
        </div>
      </section>
      <div className="x-wrap xlg-body">
        <Rail toc={doc.toc} active={active} art={art} />
        <article className="xlg-art" ref={art}>
          {doc.sections.map((s, i) => <Section key={s.id || 'top'} s={s} i={s.id ? ++n : 0} on={active === s.id} />)}
        </article>
      </div>
      <section className="xlg-more">
        <div className="x-wrap">
          <p className="x-kick"><A to="/legal">Legal &amp; Trust Center</A></p>
          <ul>
            {doc.others.map((o) => <li key={o.slug}><A to={'/legal/' + o.slug}><span>{o.title}</span><svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></A></li>)}
          </ul>
        </div>
      </section>
    </main>
  );
}
