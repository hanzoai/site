'use client';
/* A blog post (/blog/<post>, one template), v2: an editorial chapter book (osply / hamol / grubogrubo).
   Screen one is the title alone at display size, the lede set off to the right. The post's own Sigil is the cover
   plate: a dark room that grows from an inset card to full bleed as it arrives (Stage), carrying the post's own figures
   as heroes. Then the text runs in chapters: each opens with its number and a headline, the copy at 66ch on the right
   of an 8/4 split, figures and code breaking wide. It closes on Hanzo's own next steps as big rows and the other posts
   as cards that open into their page (the card's title becomes the next hero; synchronized.studio).
   No brand hues (JAMES.md): greys, black and white; colour and imagery come only from Hanzo's own model films, on the
   plate, on the parts a post names and on the cards. All words, figures and code are Hanzo's.
   Signature: the reading thread. A margin rail holds the chapter you are in as a big numeral that hands over to the
   next, and a spine that fills as you read, each chapter a knot, the one you are in ringed (on a phone, a reading bar that opens the contents).
   Beyond: minutes left. The post's own stated read time counts down as you read, and any chapter is one press away.
   V2: 8.5/10 chaptered editorial rebuild: display cover (no eyebrow over the h1), a plate with the post's own model film or Sigil that opens to full bleed with hero figures, chapter openers, model films on the parts, next posts that open into their page; monochrome; Flap and decor sparks removed (5 → 4 techniques). */
// Persona: a developer or founder reading Hanzo's thinking (arrives from /blog, search or a shared link)
// Goal: finish the post, understand the one idea, take the post's own next step
// CTA: the post's own closing links (first one is the phone thumb bar's ask); the header keeps Try Hanzo
// Signature: the reading thread: a rail whose chapter numeral hands over as you read and a spine that fills, each chapter a knot
// Beyond: minutes left: the post's own read time counting down as you read, with a jump to any chapter
import { Fragment, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';
import { EASE, Copy } from '../../ui';
import { A } from '../../kit';
import Sigil from '../../Sigil';
import Life from './Life';
import Frontier from './Frontier';
import './Post.css';

const pad = (n) => String(n).padStart(2, '0');
const FILMS = ['enso', 'kai', 'zen', 'iro', 'koe', 'koma', 'mori', 'oto', 'uta'];
const film = (slug, ext) => '/models/' + slug + '.' + ext;

/* Hanzo's model films play only while on screen, and stay on their poster for reduced motion */
function Film({ slug, className }) {
  const ref = useRef(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { v.pause(); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) v.play().catch(() => {}); else v.pause(); });
    io.observe(v);
    return () => io.disconnect();
  }, []);
  return <video ref={ref} className={className} src={film(slug, 'webm')} poster={film(slug, 'webp')} muted loop playsInline preload="metadata" aria-hidden="true" />;
}

const go = (id) => {
  const el = document.getElementById(id);
  if (!el) return;
  if (window.__lenis) window.__lenis.scrollTo(el, { offset: -120 }); else el.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
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
                {t.lang}{i === at && <motion.i layoutId="xbg-tab-ink" className="xbg-tab-ink" transition={{ type: 'spring', stiffness: 300, damping: 30 }} />}
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

/* role · name · note, set as an editorial trio between hairlines (no boxes) */
function Parts({ cards }) {
  return (
    <ul className="xbg-parts" style={{ '--n': Math.min(cards.length, 3) }}>
      {cards.map(([role, name, note], i) => (
        <li key={name + i}>
          {FILMS.includes(name.toLowerCase()) && <Film slug={name.toLowerCase()} className="xbg-part-film" />}
          <span className="xbg-role x-mono">{role}</span>
          <b className="xbg-name">{name}</b>
          <span className="xbg-note">{note}</span>
        </li>
      ))}
    </ul>
  );
}

function Block({ b, doc, next }) {
  if (b.k === 'p') return <p className="xbg-p"><Inline inl={b.inl} /></p>;
  if (b.k === 'code') return <Code tabs={b.tabs} />;
  if (b.k === 'parts') return <Parts cards={b.cards} />;
  if (b.k === 'figure' && b.kind === 'gpqa') return doc.frontier ? <div className="xbg-wide"><Frontier f={doc.frontier} /></div> : null;
  if (b.k === 'figure') return <div className="xbg-wide"><Life beside={next && next.k === 'p' ? <Inline inl={next.inl} /> : null} /></div>;
  return null;
}

/* the title, word by word out of a mask, once */
function Title({ text }) {
  const words = text.split(' ');
  return (
    <h1 id="xbg-h1" className="xbg-h1" data-morph-target>
      <span className="x-sr">{text}</span>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="xbg-wm" aria-hidden="true">
            <motion.span className="xbg-wi" initial={{ y: '108%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.08 + i * 0.05 }}>{w}</motion.span>
          </span>
          {i < words.length - 1 ? ' ' : ''}
        </Fragment>
      ))}
    </h1>
  );
}

/* the cover plate: an inset card that opens to full bleed as it arrives, the post's figures on it */
function Plate({ doc, nums }) {
  const ref = useRef(null);
  const calm = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start 0.15'] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.86, 1]);
  const figs = doc.facts.some((c) => /\d/.test(c[1]));
  return (
    <section className={'xbg-plate' + (doc.film ? ' film' : '')} data-room="dark" ref={ref} aria-label={doc.chip}>
      <motion.div className="xbg-plate-in" style={{ scale: calm ? 1 : scale }}>
        {doc.film ? <Film slug={doc.film} className="xbg-plate-film" /> : <Sigil seed={doc.route} data={nums} className="xbg-sigil" />}
        <div className="xbg-plate-c xbg-w">
          <p className="xbg-plate-k x-mono"><span>{doc.chip}</span><span>{doc.date}</span></p>
          {doc.facts.length > 0 ? (
            <ul className={'xbg-facts' + (figs ? ' figs' : '')} style={{ '--n': doc.facts.length > 3 ? 2 : doc.facts.length }}>
              {doc.facts.map(([role, name, note], i) => (
                <li key={name + i}>
                  <span className="xbg-role x-mono">{role}</span>
                  <b className="xbg-fig">{name}</b>
                  <span className="xbg-note">{note}</span>
                </li>
              ))}
            </ul>
          ) : <p className="xbg-plate-t" aria-hidden="true">{doc.chip}</p>}
        </div>
      </motion.div>
    </section>
  );
}

/* the reading thread: the chapter numeral, the spine and its knots, the minutes left; a reading bar on phones */
function Thread({ doc, chapters, body }) {
  const [at, setAt] = useState(0);
  const [open, setOpen] = useState(false);
  const left = useRef(null), leftP = useRef(null);
  const { scrollYProgress } = useScroll({ target: body, offset: ['start 40%', 'end 85%'] });
  const fill = useSpring(scrollYProgress, { stiffness: 300, damping: 30, restDelta: 0.001 });
  const say = (v) => { const m = Math.ceil(doc.minutes * (1 - v) - 0.05); return v > 0.985 ? 'Finished' : (m < 1 ? 'Under a minute' : m + ' min') + ' left'; };
  // the chapter you are in: the last heading above 40% of the screen (read on scroll, so fast jumps never skip one)
  const hs = useRef([]);
  useEffect(() => { hs.current = [...document.querySelectorAll('.xbg [data-knot]')]; }, []);
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const s = say(v);
    [left.current, leftP.current].forEach((el) => { if (el && el.textContent !== s) el.textContent = s; });
    const line = innerHeight * 0.4;
    const n = hs.current.reduce((k, h, i) => (h.getBoundingClientRect().top < line ? i : k), 0);
    setAt((a) => (a === n ? a : n));
  });
  const list = (tap) => (
    <ol className="xbg-knots">
      {chapters.map((c, i) => (
        <li key={c.h.id} data-on={i === at || undefined} data-past={i < at || undefined}>
          <button type="button" aria-current={i === at ? 'location' : undefined} onClick={() => { tap && setOpen(false); go(c.h.id); }}>
            <i className="xbg-knot" aria-hidden="true" /><span className="x-mono">{pad(i + 1)}</span><span>{c.h.text}</span>
          </button>
        </li>
      ))}
    </ol>
  );
  return (
    <>
      <aside className="xbg-rail" aria-label="Contents">
        <div className="xbg-numeral" aria-hidden="true">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span key={at} className="xbg-numeral-n" initial={{ y: '100%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '-100%', opacity: 0 }} transition={{ duration: 0.5, ease: EASE }}>{pad(at + 1)}</motion.span>
          </AnimatePresence>
          <span className="xbg-numeral-of x-mono">/ {pad(chapters.length)}</span>
        </div>
        <p className="xbg-left x-mono"><span className="xbg-read">{doc.read}</span><span ref={left}>{say(0)}</span></p>
        <div className="xbg-thread">
          <div className="xbg-spine" aria-hidden="true"><motion.i style={{ scaleY: fill }} /></div>
          {list(false)}
        </div>
      </aside>
      <div className="xbg-bar">
        <button type="button" className="xbg-bar-b" aria-expanded={open} aria-controls="xbg-sheet" onClick={() => setOpen((o) => !o)}>
          <span className="xbg-bar-n x-mono">{pad(at + 1)}</span>
          <span className="xbg-bar-t">{chapters[at] ? chapters[at].h.text : doc.title}</span>
          <span className="xbg-bar-m x-mono" ref={leftP}>{say(0)}</span>
          <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" className={open ? 'up' : ''}><path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <motion.span className="xbg-bar-line" aria-hidden="true" style={{ scaleX: fill }} />
        <div id="xbg-sheet" className="xbg-sheet" hidden={!open}>{list(true)}</div>
      </div>
    </>
  );
}

function Arrow() {
  return <svg viewBox="0 0 16 16" width="18" height="18" aria-hidden="true" className="xbg-arr"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

/* the close: Hanzo's next steps as big rows, the sources, and the other posts as cards that open into their page */
function End({ doc, cta, sources }) {
  return (
    <section className="xbg-end" aria-label={cta ? cta.label : 'More'}>
      <div className="xbg-w">
        {cta && (
          <div className="xbg-end-g">
            <p className="xbg-end-l">{cta.label}</p>
            <ul className="xbg-rows">
              {cta.links.map((l, i) => (
                <li key={l.href}><A to={l.href} className="xbg-row" {...(i === 0 ? { 'data-thumb': '' } : {})}><span>{l.label}</span><Arrow /></A></li>
              ))}
            </ul>
          </div>
        )}
        {sources && (
          <aside className="xbg-src" aria-label={sources.label}>
            <p className="x-mono">{sources.label}</p>
            <ol>{sources.links.map((l) => <li key={l.href}><A to={l.href} className="xbg-a">{l.label}</A></li>)}</ol>
          </aside>
        )}
        {doc.next.length > 0 && (
          <ul className="xbg-next" aria-label={doc.back.label}>
            {doc.next.map((n, i) => (
              <li key={n.href} className={i === 0 ? 'big' : ''}>
                <A to={n.href} className="xbg-card" data-cursor="Open">
                  <span className="xbg-card-art">{n.film ? <img src={film(n.film, 'webp')} alt="" width="1200" height="1500" loading="lazy" decoding="async" /> : <Sigil seed={n.href} data={[parseInt(n.read, 10) || 0, n.title.length]} className="xbg-sigil" />}</span>
                  <span className="xbg-card-k x-mono"><span>{n.chip}</span><span>{n.date}</span><span className="xbg-card-r">{n.read}</span></span>
                  <span className="xbg-card-t" data-morph>{n.title}</span>
                </A>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

export default function Post({ doc }) {
  const body = useRef(null);
  // chapters: each h2 and what follows it; the closing actions and sources move to the end
  const chapters = [];
  let cta = null, sources = null;
  doc.body.forEach((b, i) => {
    if (b.k === 'h2') chapters.push({ h: b, blocks: [] });
    else if (b.k === 'cta') cta = b;
    else if (b.k === 'sources') sources = b;
    else if (chapters.length) chapters[chapters.length - 1].blocks.push({ b, i });
  });
  const nums = [doc.minutes, doc.title.length];
  return (
    <main className="xbg">
      <section className="xbg-cover" aria-labelledby="xbg-h1">
        <div className="xbg-w xbg-cover-g">
          <div className="xbg-top">
            <A to={doc.back.href} className="xbg-back"><svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M13 8H4M7.5 4.5 4 8l3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg><span>{doc.back.label}</span></A>
          </div>
          <Title text={doc.title} />
          <p className="xbg-meta x-mono"><span className="xbg-chip">{doc.chip}</span><span>{doc.date}</span><span>{doc.read}</span></p>
          <motion.p className="xbg-lede" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, ease: EASE, delay: 0.55 }}>{doc.lede}</motion.p>
        </div>
      </section>

      <Plate doc={doc} nums={nums} />

      <section className="xbg-body">
        <div className="xbg-w xbg-room">
          <Thread doc={doc} chapters={chapters} body={body} />
          <article className="xbg-text" ref={body}>
            {chapters.map((c, n) => (
              <section key={c.h.id} className="xbg-ch" aria-labelledby={c.h.id}>
                <header className="xbg-ch-h">
                  <span className="xbg-num x-mono" aria-hidden="true">{pad(n + 1)}</span>
                  <h2 id={c.h.id} tabIndex={-1} className="xbg-h2" data-knot>{c.h.text}</h2>
                </header>
                {c.blocks.map(({ b, i }) => (doc.body[i - 1] && doc.body[i - 1].k === 'figure' && doc.body[i - 1].kind === 'life' && b.k === 'p' ? null : <Block key={i} b={b} doc={doc} next={doc.body[i + 1]} />))}
              </section>
            ))}
          </article>
        </div>
      </section>

      <End doc={doc} cta={cta} sources={sources} />
    </main>
  );
}
