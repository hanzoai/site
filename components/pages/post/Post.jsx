'use client';
/* A blog post (/blog/<post>, one template): an editorial chapter book (osply / hamol / grubogrubo), built to MASTER.md.
   Screen one: the title at rest size (52px), the post's own ask, and beside it, on the 8 of an 8/5 split, the post's own
   film (Hanzo's model media) or its Sigil, already playing in a card: the one big thing on the screen. As you scroll
   the scene holds, the card opens to full bleed (the black room), the title steps back and the post's figures arrive on
   the film at 64px. Then the text runs in chapters in one calm 768px column beside a reading rail, figures and code at
   the column's full width; the other posts close as cards that open into their page (synchronized.studio), and the
   closing Band repeats the post's own ask. Monochrome; colour comes only from Hanzo's films. All words are Hanzo's.
   Signature: the reading thread. A margin rail holds the chapter you are in as a numeral that hands over to the next,
   and a spine that fills as you read, each chapter a knot (on a phone, a reading bar that opens the contents).
   Beyond: minutes left. The post's own stated read time counts down as you read, and any chapter is one press away.
   V2: 8/10 round 4: Life cells sized to their tracks (a real grid); closing band drawn page-locally with a line-mask cut-in (no blur); gradient under Kai's figures; synthesis chapters 02/03 get the board's own collision and the glider emblem; reduced motion shows the hero art beside the title; Frontier sources on one caption line; next-post hover raises the tag and read time. Round 3: one ask everywhere (header outlined from first paint while the post's own ask shows; on phones the ask rides in the chapter bar and the shared rising bar never floats over text); "Back to Blog / <chip>" breadcrumb under the h1; each post's data sets its rhythm (a figures post mirrors the scene, counts its figures with the scroll and keeps its rail on the right); synthesis parts lead with one large film and list the rest. Round 2: CSS title cut-in, poster drift, chapter gists, counter on every scroll */
// Persona: a developer or founder reading Hanzo's thinking (arrives from /blog, search or a shared link)
// Goal: finish the post, understand its one idea, take the post's own next step
// CTA: the post's first closing link as the one solid ask (hero, data-thumb, data-cta "blog-post.hero"), repeated in the closing Band
// Metric: cta_click blog-post.hero (journey metric: api_key_created)
// Signature: the reading thread: a rail whose chapter numeral hands over as you read and a spine that fills, each chapter a knot
// Beyond: minutes left: the post's own read time counting down as you read, with a jump to any chapter
import { Fragment, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useMotionValueEvent, useScroll, useTransform } from 'motion/react';
import { EASE, Magnetic } from '../../ui';
import { A, Cta, CodeBlock, Film as KitFilm, Img, Stat, Tabs, TabPanel } from '../../kit';
import Sigil from '../../Sigil';
import { useEnter } from './enter';
import './enter.css';
import Gist, { gist } from './Gist';
import Life from './Life';
import Frontier from './Frontier';
import './Post.css';

const pad = (n) => String(n).padStart(2, '0');
const FILMS = ['enso', 'kai', 'zen', 'iro', 'koe', 'koma', 'mori', 'oto', 'uta'];
const film = (slug, ext) => '/models/' + slug + '.' + ext;
const Film = ({ slug, className }) => <KitFilm src={film(slug, 'webm')} poster={film(slug, 'webp')} w={1200} h={1500} className={className} />;

const go = (id) => {
  const el = document.getElementById(id);
  if (!el) return;
  if (window.__lenis) window.__lenis.scrollTo(el, { offset: -120 }); else el.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  el.focus({ preventScroll: true });
};

function Inline({ inl }) {
  return inl.map((k, i) => {
    if (typeof k === 'string') return k;
    if (k.c !== undefined) return <code key={i} className="xbg-c"><span>{k.c}</span></code>; // the span keeps it a plain text leaf (copy check)
    if (k.a) return <A key={i} to={k.a} className="xbg-a">{k.t}</A>;
    if (k.b) return <strong key={i}>{k.b}</strong>;
    return null;
  });
}

/* code: the kit CodeBlock, inside kit Tabs when the post gives one sample in two languages */
function Code({ tabs, id }) {
  const [at, setAt] = useState(0);
  const src = (t) => t.lines.map((l) => l.map((x) => x[1]).join('')).join('\n');
  if (tabs.length === 1) return <div className="xbg-code"><CodeBlock code={src(tabs[0])} label={tabs[0].lang} /></div>;
  return (
    <div className="xbg-code">
      <Tabs id={id} label="Language" tabs={tabs.map((t) => t.lang)} value={at} onChange={setAt} />
      {tabs.map((t, i) => <TabPanel key={t.lang} id={id} i={i} value={at}><CodeBlock code={src(t)} label={t.lang} /></TabPanel>)}
    </div>
  );
}

/* role · name · note, asymmetric: the first part leads, large, with its own Hanzo film playing; the rest follow as a
   list beside it, each with its film's still (or its Sigil when it has no film) as a small mark */
function Parts({ cards }) {
  return (
    <ul className="xbg-parts" style={{ '--rest': Math.max(1, cards.length - 1) }}>
      {cards.map(([role, name, note], i) => (
        <li key={name + i} className={i === 0 ? 'lead' : ''}>
          {i === 0
            ? (FILMS.includes(name.toLowerCase()) && <Film slug={name.toLowerCase()} className="xbg-part-film" />)
            : <span className="xbg-part-mark" aria-hidden="true">{FILMS.includes(name.toLowerCase()) ? <Img src={film(name.toLowerCase(), 'webp')} alt="" w={1200} h={1500} /> : <Sigil seed={'part-' + name} data={[name.length, note.length]} className="xbg-sigil" />}</span>}
          <b className="xbg-name">{name}</b>
          <span className="xbg-role x-mono">{role}</span>
          <span className="xbg-note">{note}</span>
        </li>
      ))}
    </ul>
  );
}

function Block({ b, i, doc, next }) {
  if (b.k === 'p') return <p className="xbg-p"><Inline inl={b.inl} /></p>;
  if (b.k === 'code') return <Code tabs={b.tabs} id={'xbg-code-' + i} />;
  if (b.k === 'parts') return <Parts cards={b.cards} />;
  if (b.k === 'figure' && b.kind === 'gpqa') return doc.frontier ? <div className="xbg-wide"><Frontier f={doc.frontier} /></div> : null;
  if (b.k === 'figure') return <div className="xbg-wide"><Life beside={next && next.k === 'p' ? <Inline inl={next.inl} /> : null} /></div>;
  return null;
}

/* the title, word by word out of a mask, once (700 ms, 55 ms apart). A CSS animation, so it runs from first paint
   instead of waiting for hydration; reduced motion shows it at rest. */
function Title({ text }) {
  const words = text.split(' ');
  return (
    <h1 id="xbg-h1" className="xbg-h1" data-morph-target>
      <span className="x-sr">{text}</span>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="xbg-wm" aria-hidden="true">
            <span className="xbg-wi" style={{ '--i': i }}>{w}</span>
          </span>
          {i < words.length - 1 ? ' ' : ''}
        </Fragment>
      ))}
    </h1>
  );
}


/* One solid at a time, from the first paint (the /affiliate pattern): Post.css draws the header's ask outlined on a post
   unless <html> carries data-xbg-solid. This hook sets that flag only while none of the post's own solid asks (the hero
   ask, the phone chapter bar's ask, the closing Band's) is on screen, so the header is solid exactly when the post's
   ask is not, at every width, and there is no solid-to-outline flash in the first second. */
const OWN_ASKS = 'main.xbg [data-cta="blog-post.hero"], main.xbg [data-cta="blog-post.bar"], main.xbg .x-band .x-btn.solid';
function useQuietHeader() {
  useEffect(() => {
    const H = document.documentElement;
    const asks = [...document.querySelectorAll(OWN_ASKS)];
    if (!asks.length || typeof IntersectionObserver === 'undefined') return;
    const vis = new Set();
    // the hero ask fades out as the pinned plate opens (data-gone): faded counts as gone
    const apply = () => {
      const on = [...vis].some((el) => !el.closest('[data-gone="true"]'));
      if (on) delete H.dataset.xbgSolid; else H.dataset.xbgSolid = '';
    };
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => (e.isIntersecting && e.boundingClientRect.width ? vis.add(e.target) : vis.delete(e.target)));
      apply();
    });
    asks.forEach((a) => io.observe(a));
    addEventListener('scroll', apply, { passive: true });
    return () => { io.disconnect(); removeEventListener('scroll', apply); delete H.dataset.xbgSolid; };
  }, []);
}

/* Screen one, plain (no pinned scene): the title, breadcrumb, lede and the post's ask on the 5, and on the 8 the post's
   own film (or its Sigil) in a card that swings in like a pendulum from first paint (entrance 1, pure CSS so it never
   waits for hydration). A figures post (Kai) puts the card on the left. Phones stack the parts. */
function Hero({ doc, nums, ask, alt }) {
  const art = useRef(null);
  const [paused, setPaused] = useState(false);
  const toggle = () => {
    const v = art.current?.querySelector('video');
    if (!v) return;
    if (v.paused) { v.play().catch(() => {}); setPaused(false); } else { v.pause(); setPaused(true); }
  };
  return (
    <section className={'xbg-hero' + (doc.film ? ' film' : '') + (alt ? ' alt' : '')} aria-labelledby="xbg-h1" data-ask-hide>
      <div className="xbg-w xbg-hero-g">
        <div className="xbg-cover-t">
          <Title text={doc.title} />
          <div className="xbg-meta x-mono">
            <nav aria-label="Breadcrumb" className="xbg-crumbs">
              <ol>
                <li><A to={doc.back.href} className="xbg-back"><svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M13 8H4M7.5 4.5 4 8l3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg><span>{doc.back.label}</span></A></li>
                <li aria-current="page" className="xbg-chip">{doc.chip}</li>
              </ol>
            </nav>
            <span>{doc.date}</span><span>{doc.read}</span>
          </div>
          <p className="xbg-lede">{doc.lede}</p>
          {ask && <div className="xbg-ask"><Cta to={ask.href} id="blog-post.hero" thumb>{ask.label}</Cta></div>}
        </div>
        <div className="xbg-art" ref={art} data-enter="pendulum">
          {doc.film ? <Film slug={doc.film} className="xbg-art-film" /> : <Sigil seed={doc.route} data={nums} className="xbg-sigil" />}
          {doc.film && (
            <button type="button" className="xbg-pause" onClick={toggle} aria-label={paused ? 'Play' : 'Pause'} aria-pressed={paused}>
              <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">{paused ? <path d="M5 3.5v9l7.5-4.5z" fill="currentColor" /> : <path d="M5 3.5h2v9H5zM9 3.5h2v9H9z" fill="currentColor" />}</svg>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

/* The post's plate, a plain black section after the reading (no pinned room): its products or figures, which ripple in
   by distance from the pointer (entrance 3, grid-wave); figures count up once (kit Stat). */
function Plate({ doc }) {
  if (!doc.facts.length) return null;
  const figs = doc.facts.some((c) => /\d/.test(c[1]));
  return (
    <section className="xbg-plate" data-room="dark" aria-label={doc.chip}>
      <div className="xbg-w">
        <p className="xbg-plate-k x-mono"><span>{doc.chip}</span><span>{doc.date}</span></p>
        <ul className={'xbg-facts' + (figs ? ' figs' : '')} data-enter="grid-wave" style={{ '--n': doc.facts.length > 3 ? 2 : doc.facts.length }}>
          {doc.facts.map(([role, name, note], i) => (
            <li key={name + i} data-wave>
              {figs ? <Stat value={name} className="xbg-fig" /> : <b className="xbg-fig">{name}</b>}
              <span className="xbg-role x-mono">{role}</span>
              <span className="xbg-note">{note}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* the reading thread: the chapter numeral, the spine and its knots, the minutes left; a reading bar on phones */
function Thread({ doc, chapters, body, ask }) {
  const [at, setAt] = useState(0);
  const [open, setOpen] = useState(false);
  const left = useRef(null), leftP = useRef(null), leftS = useRef(null);
  const { scrollYProgress: fill } = useScroll({ target: body, offset: ['start 40%', 'end 85%'] });
  const say = (v) => { const m = Math.ceil(doc.minutes * (1 - v) - 0.05); return v > 0.985 ? 'Finished' : (m < 1 ? 'Under a minute' : m + ' min') + ' left'; };
  // the chapter you are in: the last heading above 60% of the screen, read on every scroll (not only while the body's
  // progress moves, which stops near the end and left the counter one chapter behind); finished means the last chapter
  const done = useRef(false);
  useEffect(() => {
    const hs = [...document.querySelectorAll('.xbg [data-knot]')];
    const read = () => {
      const line = innerHeight * 0.6;
      let n = hs.reduce((k, h, i) => (h.getBoundingClientRect().top < line ? i : k), 0);
      if (done.current) n = hs.length - 1;
      setAt((a) => (a === n ? a : n));
    };
    read();
    addEventListener('scroll', read, { passive: true });
    addEventListener('resize', read);
    return () => { removeEventListener('scroll', read); removeEventListener('resize', read); };
  }, []);
  useMotionValueEvent(fill, 'change', (v) => {
    const s = say(v);
    done.current = v > 0.985;
    [left.current, leftP.current, leftS.current].forEach((el) => { if (el && el.textContent !== s) el.textContent = s; });
  });
  /* the signature, drag the timeline: the spine (desktop, vertical) and the reading bar's line (phone, horizontal) are
     one scrubber. Drag or press anywhere on it and the post moves to that point of the reading; the numeral, the knots,
     the bar's chapter and the minutes left change with it, and a tip by the thumb names the chapter you are dragging to.
     Keyboard: the thumb is a slider; arrows, Home and End move by chapter. */
  const [drag, setDrag] = useState(false);
  const thumbY = useTransform(fill, (v) => v * 100 + '%');
  const scrub = (axis) => ({
    onPointerDown: (e) => {
      const el = e.currentTarget;
      el.setPointerCapture?.(e.pointerId);
      setDrag(true);
      const to = (ev) => {
        const r = el.getBoundingClientRect();
        const v = Math.min(1, Math.max(0, axis === 'y' ? (ev.clientY - r.top) / r.height : (ev.clientX - r.left) / r.width));
        const b = body.current.getBoundingClientRect();
        const A = b.top + scrollY - innerHeight * 0.4, B = b.bottom + scrollY - innerHeight * 0.85;
        const y = A + v * (B - A);
        if (window.__lenis) window.__lenis.scrollTo(y, { immediate: true }); else window.scrollTo(0, y);
      };
      to(e);
      const move = (ev) => to(ev);
      const up = () => { setDrag(false); el.removeEventListener('pointermove', move); el.removeEventListener('pointerup', up); el.removeEventListener('pointercancel', up); };
      el.addEventListener('pointermove', move);
      el.addEventListener('pointerup', up);
      el.addEventListener('pointercancel', up);
    },
  });
  const key = (e) => {
    const n = chapters.length - 1;
    const j = { ArrowDown: at + 1, ArrowRight: at + 1, ArrowUp: at - 1, ArrowLeft: at - 1, Home: 0, End: n }[e.key];
    if (j === undefined) return;
    e.preventDefault();
    const k = Math.min(n, Math.max(0, j));
    go(chapters[k].h.id);
    e.currentTarget.focus({ preventScroll: true });
  };
  const slider = { role: 'slider', tabIndex: 0, 'aria-label': 'Chapters', 'aria-valuemin': 1, 'aria-valuemax': chapters.length, 'aria-valuenow': at + 1, 'aria-valuetext': chapters[at] ? pad(at + 1) + ' ' + chapters[at].h.text : '', onKeyDown: key };
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
        <div className="xbg-thread" data-drag={drag || undefined}>
          <div className="xbg-spine" {...scrub('y')}>
            <motion.i aria-hidden="true" style={{ scaleY: fill }} />
            <motion.span className="xbg-thumb" style={{ top: thumbY }} {...slider}>
              <span className="xbg-tip x-mono" aria-hidden="true"><b>{pad(at + 1)}</b> {chapters[at] ? chapters[at].h.text : ''}</span>
            </motion.span>
          </div>
          {list(false)}
        </div>
      </aside>
      <div className="xbg-bar">
        <div className="xbg-bar-row">
          <button type="button" className="xbg-bar-b" aria-expanded={open} aria-controls="xbg-sheet" onClick={() => setOpen((o) => !o)}>
            <span className="xbg-bar-n x-mono">{pad(at + 1)}</span>
            <span className="xbg-bar-t">{chapters[at] ? chapters[at].h.text : doc.title}</span>
            <span className="xbg-bar-m x-mono" ref={leftP}>{say(0)}</span>
            <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" className={open ? 'up' : ''}><path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          {ask && <Cta to={ask.href} id="blog-post.bar" size="sm" className="xbg-bar-ask">{ask.label}</Cta>}
        </div>
        <div className="xbg-scrub" data-drag={drag || undefined} {...scrub('x')}>
          <motion.span className="xbg-bar-line" aria-hidden="true" style={{ scaleX: fill }} />
          <motion.span className="xbg-thumb" style={{ left: thumbY }} {...slider} />
        </div>
        <div id="xbg-sheet" className="xbg-sheet" hidden={!open}>
          {ask && <p className="xbg-sheet-m x-mono"><span>{doc.read}</span><span ref={leftS}>{say(0)}</span></p>}
          {list(true)}
        </div>
      </div>
    </>
  );
}

const Chevron = () => <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;

/* The closing band, page-local (the kit Band reveals with blur, against MASTER part 9): the same .x-band look and words;
   on arrival an underline sweeps under each word in turn (entrance 5, underline-sweep), then the post's own ask as a
   kit Cta (magnetic, as the Band's was) and the other closing links. Request to the kit owner: docs/requests/blog-family.md. */
function Close({ cta }) {
  const words = cta.label.split(' ');
  return (
    <section className="x-band xbg-band" data-room="dark" data-enter="underline-sweep">
      <div className="x-wrap">
        <h2 className="xbg-band-h">
          <span className="x-sr">{cta.label}</span>
          {words.map((w, i) => (
            <Fragment key={i}>
              <span className="xbg-uw" aria-hidden="true" style={{ '--i': i }}>{w}</span>
              {i < words.length - 1 ? ' ' : ''}
            </Fragment>
          ))}
        </h2>
        <div className="x-band-act">
          <Magnetic><Cta to={cta.links[0].href} id="blog-post.close-1" size="lg">{cta.links[0].label}</Cta></Magnetic>
          {cta.links.length > 1 && (
            <span className="xbg-band-more">
              {cta.links.slice(1).map((l, i) => <A key={l.href} to={l.href} className="x-arrow" data-cta={'blog-post.close-' + (i + 2)}><span>{l.label}</span><Chevron /></A>)}
            </span>
          )}
        </div>
      </div>
    </section>
  );
}

/* the close: the sources, the other posts as cards that open into their page, then the band with the post's own ask */
function End({ doc, cta, sources }) {
  return (
    <>
      <section className="xbg-end" aria-label={doc.back.label} data-ask-hide>
        <div className="xbg-w">
          {sources && (
            <aside className="xbg-src" aria-label={sources.label}>
              <p className="x-mono">{sources.label}</p>
              <ol>{sources.links.map((l) => <li key={l.href}><A to={l.href} className="xbg-a">{l.label}</A></li>)}</ol>
            </aside>
          )}
          {doc.next.length > 0 && (
            <ul className="xbg-next" data-enter="page-curl">
              {doc.next.map((n, i) => (
                <li key={n.href} className={i === 0 ? 'big' : ''}>
                  <A to={n.href} className="xbg-card" data-cta={'blog-post.next-' + (i + 1)}>
                    <span className="xbg-card-art">
                      {n.film ? <Img src={film(n.film, 'webp')} alt="" w={1200} h={1500} /> : <Sigil seed={n.href} data={[parseInt(n.read, 10) || 0, n.title.length]} className="xbg-sigil" />}
                      <span className="xbg-card-peek x-mono" aria-hidden="true"><span>{n.chip}</span><span>{n.read}</span></span>
                    </span>
                    <span className="xbg-card-t" data-morph>{n.title}</span>
                    <span className="xbg-card-k x-mono"><span>{n.chip}</span><span>{n.date}</span><span className="xbg-card-r">{n.read}</span></span>
                  </A>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
      {cta && <Close cta={cta} />}
    </>
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
  chapters.forEach((c) => { c.gist = gist(c.blocks); });
  // a post that holds the Game of Life gives its other text-only chapters the board's own moves: the collision, then
  // the glider alone as the emblem (after the chapter's first paragraph)
  if (doc.body.some((b) => b.k === 'figure' && b.kind === 'life')) {
    const kinds = ['collide', 'emblem'];
    chapters.forEach((c) => { if (!c.gist && c.blocks.length && c.blocks.every(({ b }) => b.k === 'p') && kinds.length) c.gist = { kind: kinds.shift(), after: 0 }; });
  }
  const nums = [doc.minutes, doc.title.length];
  const ask = cta && cta.links[0];
  // each post's own data sets its rhythm: a post whose plate holds figures (Kai) puts its film card on the left and its
  // timeline rail on the right; a post whose plate names products (Pareto) keeps card right, rail left; a post without
  // a film keeps its Sigil
  const alt = !!doc.film && doc.facts.length > 0 && doc.facts.every((c) => /\d/.test(c[1]));
  useQuietHeader();
  useEnter();
  // data-ask-hide: the post's ask lives inline (hero, phone chapter bar, Band), so the shared rising bar never floats over it
  return (
    <main className={'xbg' + (alt ? ' alt' : '')}>
      <Hero doc={doc} nums={nums} ask={ask} alt={alt} />

      <section className="xbg-body" data-ask-hide>
        <div className="xbg-w xbg-room">
          <Thread doc={doc} chapters={chapters} body={body} ask={ask} />
          <article className="xbg-text" ref={body}>
            {chapters.map((c, n) => (
              <section key={c.h.id} className="xbg-ch" aria-labelledby={c.h.id}>
                <header className="xbg-ch-h">
                  <span className="xbg-num x-mono" aria-hidden="true">{pad(n + 1)}</span>
                  <h2 id={c.h.id} tabIndex={-1} className="xbg-h2" data-knot data-enter="typewriter">{c.h.text}</h2>
                </header>
                {c.blocks.map(({ b, i }, k) => (doc.body[i - 1] && doc.body[i - 1].k === 'figure' && doc.body[i - 1].kind === 'life' && b.k === 'p' ? null : (
                  <Fragment key={i}>
                    <Block b={b} i={i} doc={doc} next={doc.body[i + 1]} />
                    {c.gist && c.gist.after === k && <Gist g={c.gist} />}
                  </Fragment>
                )))}
              </section>
            ))}
          </article>
        </div>
      </section>

      <Plate doc={doc} />

      <End doc={doc} cta={cta} sources={sources} />
    </main>
  );
}
