'use client';
/* A blog post (/blog/<post>, one template): a reading room. The post's own Sigil drifts beside a giant title; the text
   runs at 66ch; each post carries its own live figure (a Game of Life board, the GPQA frontier, Kai's two SDK calls).
   All wording, figures and code are Hanzo's.
   Signature: the reading thread. A margin spine fills as you read; every section is a knot on it, the knot you are in
   breathes, and its name rides beside the text (on a phone, a reading bar under the header that opens the contents).
   Beyond: minutes left. The post's own stated read time counts down as you read, and any section is one press away. */
// Signature: the reading thread: a margin spine that fills as you read, each section a knot, the current one breathing
// Beyond: minutes left: the post's own read time counting down as you read, with a jump to any section
import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValueEvent, useScroll, useSpring } from 'motion/react';
import { EASE, Copy } from '../../ui';
import { A, Flap } from '../../kit';
import Sigil from '../../Sigil';
import Life from './Life';
import Frontier from './Frontier';
import './Post.css';

const go = (id) => {
  const el = document.getElementById(id);
  if (!el) return;
  if (window.__lenis) window.__lenis.scrollTo(el, { offset: -110 }); else el.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  el.focus({ preventScroll: true });
};

function Inline({ inl }) {
  return inl.map((k, i) => {
    if (typeof k === 'string') return k;
    if (k.c !== undefined) return <code key={i} className="xbg-c">{k.c}</code>;
    if (k.a) return <A key={i} to={k.a} className="xbg-a">{k.t}</A>;
    if (k.b) return <strong key={i}>{k.b}</strong>;
    return null;
  });
}

function Code({ tabs }) {
  const [at, setAt] = useState(0);
  const src = (t) => t.lines.map((l) => l.map((x) => x[1]).join('')).join('\n');
  return (
    <figure className="xbg-code">
      <div className="xbg-code-bar">
        {tabs.length > 1 ? (
          <div role="tablist" aria-label="Language" className="xbg-tabs">
            {tabs.map((t, i) => (
              <button key={t.lang} type="button" role="tab" id={'xbg-tab-' + i} aria-controls={'xbg-pan-' + i} aria-selected={i === at} tabIndex={i === at ? 0 : -1} onClick={() => setAt(i)}
                onKeyDown={(e) => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { const n = (i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length; setAt(n); document.getElementById('xbg-tab-' + n)?.focus(); } }}>
                {t.lang}{i === at && <motion.i layoutId="xbg-tab-ink" className="xbg-tab-ink" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
              </button>
            ))}
          </div>
        ) : <span className="xbg-lang x-mono">{tabs[0].lang}</span>}
        <Copy text={src(tabs[at])} />
      </div>
      {tabs.map((t, i) => (
        <pre key={t.lang} id={'xbg-pan-' + i} role={tabs.length > 1 ? 'tabpanel' : undefined} aria-labelledby={tabs.length > 1 ? 'xbg-tab-' + i : undefined} hidden={i !== at} tabIndex={0} data-lenis-prevent>
          <code>{t.lines.map((l, j) => <span key={j} className="xbg-ln">{l.map(([kind, s], k) => <span key={k} data-k={kind}>{s}</span>)}{'\n'}</span>)}</code>
        </pre>
      ))}
    </figure>
  );
}

/* role · name · note cards; a spark visits each in turn so the row is never still */
function Parts({ cards, big }) {
  return (
    <ul className={'xbg-parts' + (big ? ' big' : '')} style={{ '--n': cards.length }}>
      {cards.map(([role, name, note], i) => (
        <motion.li key={name + i} style={{ '--i': i }} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.7, ease: EASE, delay: i * 0.05 }}>
          <span className="xbg-role x-mono">{role}</span>
          <b className="xbg-name">{big ? <Flap value={name} /> : name}</b>
          <span className="xbg-note">{note}</span>
          <i className="xbg-spark" aria-hidden="true" />
        </motion.li>
      ))}
    </ul>
  );
}

function Cta({ b }) {
  return (
    <div className="xbg-cta">
      <p className="xbg-cta-l">{b.label}</p>
      <div className="xbg-cta-a">
        {b.links.map((l, i) => <A key={l.href} to={l.href} className={'x-btn' + (l.fill ? ' solid' : '')} {...(i === 0 ? { 'data-thumb': '' } : {})}>{l.label}</A>)}
      </div>
    </div>
  );
}

function Block({ b, doc, next }) {
  if (b.k === 'h2') return <h2 id={b.id} tabIndex={-1} className="xbg-h2" data-knot>{b.text}</h2>;
  if (b.k === 'p') return <p className="xbg-p"><Inline inl={b.inl} /></p>;
  if (b.k === 'code') return <Code tabs={b.tabs} />;
  if (b.k === 'parts') return <Parts cards={b.cards} />;
  if (b.k === 'cta') return <Cta b={b} />;
  if (b.k === 'figure' && b.kind === 'gpqa') return doc.frontier ? <Frontier f={doc.frontier} /> : null;
  if (b.k === 'figure') return <Life beside={next && next.k === 'p' ? <Inline inl={next.inl} /> : null} />;
  if (b.k === 'sources') return (
    <aside className="xbg-src" aria-label={b.label}>
      <p className="x-mono">{b.label}</p>
      <ol>{b.links.map((l) => <li key={l.href}><A to={l.href} className="xbg-a">{l.label}</A></li>)}</ol>
    </aside>
  );
  return null;
}

/* the reading thread: the spine, its knots and the minutes left; a reading bar on phones */
function Thread({ doc, body }) {
  const knots = doc.body.filter((b) => b.k === 'h2');
  const [at, setAt] = useState(0);
  const [open, setOpen] = useState(false);
  const left = useRef(null), leftP = useRef(null);
  const { scrollYProgress } = useScroll({ target: body, offset: ['start 40%', 'end 85%'] });
  const fill = useSpring(scrollYProgress, { stiffness: 160, damping: 30, restDelta: 0.001 });
  const say = (v) => { const m = Math.ceil(doc.minutes * (1 - v) - 0.05); return v > 0.985 ? 'Finished' : (m < 1 ? 'Under a minute' : m + ' min') + ' left'; };
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const s = say(v);
    [left.current, leftP.current].forEach((el) => { if (el && el.textContent !== s) el.textContent = s; });
  });
  useEffect(() => {
    const hs = [...document.querySelectorAll('.xbg [data-knot]')];
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) setAt(hs.indexOf(e.target)); }), { rootMargin: '-20% 0px -70% 0px' });
    hs.forEach((h) => io.observe(h));
    return () => io.disconnect();
  }, []);
  const list = (tap) => (
    <ol className="xbg-knots">
      {knots.map((k, i) => (
        <li key={k.id} data-on={i === at || undefined} data-past={i < at || undefined}>
          <button type="button" aria-current={i === at ? 'location' : undefined} onClick={() => { tap && setOpen(false); go(k.id); }}>
            <i className="xbg-knot" aria-hidden="true" /><span>{k.text}</span>
          </button>
        </li>
      ))}
    </ol>
  );
  return (
    <>
      <aside className="xbg-rail" aria-label="Contents">
        <p className="xbg-left x-mono"><span className="xbg-read">{doc.read}</span><span ref={left}>{say(0)}</span></p>
        <div className="xbg-spine" aria-hidden="true"><motion.i style={{ scaleY: fill }} /></div>
        {list(false)}
      </aside>
      <div className="xbg-bar">
        <button type="button" className="xbg-bar-b" aria-expanded={open} aria-controls="xbg-sheet" onClick={() => setOpen((o) => !o)}>
          <i className="xbg-knot on" aria-hidden="true" />
          <span className="xbg-bar-t">{knots[at] ? knots[at].text : doc.title}</span>
          <span className="xbg-bar-m x-mono" ref={leftP}>{say(0)}</span>
          <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" className={open ? 'up' : ''}><path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <motion.span className="xbg-bar-line" aria-hidden="true" style={{ scaleX: fill }} />
        <div id="xbg-sheet" className="xbg-sheet" hidden={!open}>{list(true)}</div>
      </div>
    </>
  );
}

export default function Post({ doc }) {
  const body = useRef(null);
  const nums = [doc.minutes, ...doc.facts.map((c) => parseFloat(String(c[1]).replace(/[^\d.]/g, ''))), doc.body.length, doc.title.length];
  return (
    <main className="xbg">
      <section className="xbg-hero" aria-labelledby="xbg-h1">
        <div className="x-wrap xbg-hero-g">
          <div className="xbg-hero-t">
            <A to={doc.back.href} className="xbg-back"><svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M13 8H4M7.5 4.5 4 8l3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg><span>{doc.back.label}</span></A>
            <p className="xbg-meta x-mono"><span className="xbg-chip">{doc.chip}</span><span>{doc.date}</span><span>{doc.read}</span></p>
            <h1 id="xbg-h1" className="xbg-h1" data-morph-target>
              <span className="x-line"><motion.span className="x-line-in" initial={{ y: '106%' }} animate={{ y: 0 }} transition={{ duration: 1.05, ease: EASE, delay: 0.1 }}>{doc.title}</motion.span></span>
            </h1>
            <motion.p className="xbg-lede" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: 0.35 }}>{doc.lede}</motion.p>
          </div>
          <motion.div className="xbg-cover" initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.4, ease: EASE, delay: 0.15 }}>
            <Sigil seed={doc.route} data={nums} className="xbg-sigil" />
            <span className="xbg-cover-k x-mono" aria-hidden="true">{doc.chip}</span>
          </motion.div>
        </div>
      </section>

      {doc.facts.length > 0 && (
        <section className="xbg-facts">
          <div className="x-wrap"><Parts cards={doc.facts} big={doc.facts.some((c) => /\d/.test(c[1]))} /></div>
        </section>
      )}

      <section className="xbg-body">
        <div className="x-wrap xbg-room">
          <Thread doc={doc} body={body} />
          <article className="xbg-text" ref={body}>
            {doc.body.map((b, i) => (doc.body[i - 1] && doc.body[i - 1].k === 'figure' && doc.body[i - 1].kind === 'life' && b.k === 'p' ? null : <Block key={i} b={b} doc={doc} next={doc.body[i + 1]} />))}
          </article>
        </div>
      </section>
    </main>
  );
}
