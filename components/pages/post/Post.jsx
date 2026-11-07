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
   V2: 8.5/10 film card plays beside the title inside the first 801px (kit Film + pause), the header carries the post's ask on desktop (no floating pill), on phones the post's ask is the outline beside the header's one solid, code in greys, press on back link and next-post cards, NoJs instead of <noscript> */
// Persona: a developer or founder reading Hanzo's thinking (arrives from /blog, search or a shared link)
// Goal: finish the post, understand its one idea, take the post's own next step
// CTA: the post's first closing link as the one solid ask (hero, data-thumb, data-cta "blog-post.hero"), repeated in the closing Band
// Metric: cta_click blog-post.hero (journey metric: api_key_created)
// Signature: the reading thread: a rail whose chapter numeral hands over as you read and a spine that fills, each chapter a knot
// Beyond: minutes left: the post's own read time counting down as you read, with a jump to any chapter
import { Fragment, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useMotionValueEvent, useScroll, useTransform } from 'motion/react';
import { EASE } from '../../ui';
import { A, Band, Cta, CodeBlock, Film as KitFilm, Img, Tabs, TabPanel } from '../../kit';
import Sigil from '../../Sigil';
import NoJs from '../../NoJs';
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
    if (k.c !== undefined) return <code key={i} className="xbg-c">{k.c}</code>;
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

/* role · name · note between hairlines; a part with its own Hanzo film shows it */
function Parts({ cards }) {
  return (
    <ul className="xbg-parts" style={{ '--n': Math.min(cards.length, 3) }}>
      {cards.map(([role, name, note], i) => (
        <li key={name + i}>
          {FILMS.includes(name.toLowerCase()) && <Film slug={name.toLowerCase()} className="xbg-part-film" />}
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

/* the title, word by word out of a mask, once (700 ms, 55 ms apart) */
function Title({ text }) {
  const words = text.split(' ');
  return (
    <h1 id="xbg-h1" className="xbg-h1" data-morph-target>
      <NoJs css=".xbg-wi{transform:none!important}" />
      <span className="x-sr">{text}</span>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="xbg-wm" aria-hidden="true">
            <motion.span className="xbg-wi" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 0.7, ease: EASE, delay: 0.05 + i * 0.055 }}>{w}</motion.span>
          </span>
          {i < words.length - 1 ? ' ' : ''}
        </Fragment>
      ))}
    </h1>
  );
}

/* The first screen and the plate in one scene. On a desktop the post's own film (or its Sigil) plays in a card on the
   8 of an 8/5 split from the first second; as you scroll the scene holds, the card opens to full bleed (clip-path from
   the measured slot), the title steps back and the post's figures settle onto the film. Phones (under 900px), reduced
   motion and no-JS get the same parts stacked. The header turns dark only once the plate fills the screen. */
const PIN = '(min-width: 900px) and (prefers-reduced-motion: no-preference)';
function Stage({ doc, nums, ask }) {
  const ref = useRef(null), plate = useRef(null), slot = useRef(null);
  const box = useRef({ t: 120, r: 32, b: 72, l: 520 });
  const [pin, setPin] = useState(false);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const m = matchMedia(PIN);
    const measure = () => {
      const s = slot.current?.getBoundingClientRect(), p = plate.current?.getBoundingClientRect();
      if (s && p && s.width) box.current = { t: s.top - p.top, r: p.right - s.right, b: p.bottom - s.bottom, l: s.left - p.left };
    };
    const on = () => { measure(); setPin(m.matches); };
    on();
    m.addEventListener('change', on);
    addEventListener('resize', measure);
    return () => { m.removeEventListener('change', on); removeEventListener('resize', measure); };
  }, []);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  // function maps keep these on the main thread (Motion's native scroll-timeline shortcut mis-maps such ranges)
  const ramp = (a, b) => (v) => Math.min(1, Math.max(0, (v - a) / (b - a)));
  const clipPath = useTransform(p, (t) => {
    const k = 1 - ramp(0, 0.55)(t), c = box.current;
    return `inset(${(c.t * k).toFixed(1)}px ${(c.r * k).toFixed(1)}px ${(c.b * k).toFixed(1)}px ${(c.l * k).toFixed(1)}px round ${(24 * k).toFixed(1)}px)`;
  });
  const coverO = useTransform(p, (v) => 1 - ramp(0, 0.28)(v));
  const coverY = useTransform(p, (v) => -32 * ramp(0, 0.28)(v));
  const factsO = useTransform(p, ramp(0.48, 0.72));
  const factsS = useTransform(p, (v) => 1.3125 - 0.3125 * ramp(0.48, 0.8)(v)); // the figures arrive at 84px and settle to 64px
  const markY = useTransform(p, (v) => (v >= 0.54 ? '0%' : '100%'));
  useMotionValueEvent(coverO, 'change', (v) => { if (ref.current) ref.current.dataset.gone = String(pin && v < 0.04); });
  const figs = doc.facts.some((c) => /\d/.test(c[1]));
  const toggle = () => {
    const v = plate.current?.querySelector('video');
    if (!v) return;
    if (v.paused) { v.play().catch(() => {}); setPaused(false); } else { v.pause(); setPaused(true); }
  };
  return (
    <section className={'xbg-stage' + (doc.film ? ' film' : '')} ref={ref} aria-labelledby="xbg-h1">
      <div className="xbg-stage-in">
        <motion.div className="xbg-plate-in" ref={plate} style={pin ? { clipPath } : undefined}>
          {doc.film && (
            <button type="button" className="xbg-pause" onClick={toggle} aria-label={paused ? 'Play' : 'Pause'} aria-pressed={paused}>
              <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">{paused ? <path d="M5 3.5v9l7.5-4.5z" fill="currentColor" /> : <path d="M5 3.5h2v9H5zM9 3.5h2v9H9z" fill="currentColor" />}</svg>
            </button>
          )}
          <motion.i className="xbg-mark" data-room="dark" aria-hidden="true" style={pin ? { y: markY } : undefined} />
          {doc.film ? <Film slug={doc.film} className="xbg-plate-film" /> : <Sigil seed={doc.route} data={nums} className="xbg-sigil" />}
          <motion.div className="xbg-plate-c xbg-w" style={pin ? { opacity: factsO } : undefined} aria-label={doc.chip} role="group">
            <p className="xbg-plate-k x-mono"><span>{doc.chip}</span><span>{doc.date}</span></p>
            <motion.div className="xbg-plate-f" style={pin ? { scale: factsS } : undefined}>
              {doc.facts.length > 0 ? (
                <ul className={'xbg-facts' + (figs ? ' figs' : '')} style={{ '--n': doc.facts.length > 3 ? 2 : doc.facts.length }}>
                  {doc.facts.map(([role, name, note], i) => (
                    <li key={name + i}>
                      <b className="xbg-fig">{name}</b>
                      <span className="xbg-role x-mono">{role}</span>
                      <span className="xbg-note">{note}</span>
                    </li>
                  ))}
                </ul>
              ) : <p className="xbg-plate-t" aria-hidden="true">{doc.chip}</p>}
            </motion.div>
          </motion.div>
        </motion.div>
        <motion.div className="xbg-cover" style={pin ? { opacity: coverO, y: coverY } : undefined}>
          <div className="xbg-w xbg-cover-g">
            <div className="xbg-cover-t">
              <A to={doc.back.href} className="xbg-back"><svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M13 8H4M7.5 4.5 4 8l3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg><span>{doc.back.label}</span></A>
              <Title text={doc.title} />
              <p className="xbg-meta x-mono"><span className="xbg-chip">{doc.chip}</span><span>{doc.date}</span><span>{doc.read}</span></p>
              <p className="xbg-lede">{doc.lede}</p>
              {ask && <div className="xbg-ask"><Cta to={ask.href} id="blog-post.hero" thumb>{ask.label}</Cta></div>}
            </div>
            <i className="xbg-slot" ref={slot} aria-hidden="true" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* the reading thread: the chapter numeral, the spine and its knots, the minutes left; a reading bar on phones */
function Thread({ doc, chapters, body }) {
  const [at, setAt] = useState(0);
  const [open, setOpen] = useState(false);
  const left = useRef(null), leftP = useRef(null);
  const { scrollYProgress: fill } = useScroll({ target: body, offset: ['start 40%', 'end 85%'] });
  const say = (v) => { const m = Math.ceil(doc.minutes * (1 - v) - 0.05); return v > 0.985 ? 'Finished' : (m < 1 ? 'Under a minute' : m + ' min') + ' left'; };
  // the chapter you are in: the last heading above 40% of the screen (read on scroll, so fast jumps never skip one)
  const hs = useRef([]);
  useEffect(() => { hs.current = [...document.querySelectorAll('.xbg [data-knot]')]; }, []);
  useMotionValueEvent(fill, 'change', (v) => {
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

const Chevron = () => <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;

/* the close: the sources, the other posts as cards that open into their page, then the Band with the post's own ask */
function End({ doc, cta, sources }) {
  return (
    <>
      <section className="xbg-end" aria-label={doc.back.label}>
        <div className="xbg-w">
          {sources && (
            <aside className="xbg-src" aria-label={sources.label}>
              <p className="x-mono">{sources.label}</p>
              <ol>{sources.links.map((l) => <li key={l.href}><A to={l.href} className="xbg-a">{l.label}</A></li>)}</ol>
            </aside>
          )}
          {doc.next.length > 0 && (
            <ul className="xbg-next">
              {doc.next.map((n, i) => (
                <li key={n.href} className={i === 0 ? 'big' : ''}>
                  <A to={n.href} className="xbg-card" data-cta={'blog-post.next-' + (i + 1)}>
                    <span className="xbg-card-art">{n.film ? <Img src={film(n.film, 'webp')} alt="" w={1200} h={1500} /> : <Sigil seed={n.href} data={[parseInt(n.read, 10) || 0, n.title.length]} className="xbg-sigil" />}</span>
                    <span className="xbg-card-t" data-morph>{n.title}</span>
                    <span className="xbg-card-k x-mono"><span>{n.chip}</span><span>{n.date}</span><span className="xbg-card-r">{n.read}</span></span>
                  </A>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
      {cta && (
        <Band title={cta.label} action={cta.links[0].label} to={cta.links[0].href}
          note={cta.links.length > 1 ? (
            <span className="xbg-band-more">
              {cta.links.slice(1).map((l, i) => <A key={l.href} to={l.href} className="x-arrow" data-cta={'blog-post.close-' + (i + 2)}><span>{l.label}</span><Chevron /></A>)}
            </span>
          ) : null} />
      )}
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
  const nums = [doc.minutes, doc.title.length];
  return (
    <main className="xbg">
      <Stage doc={doc} nums={nums} ask={cta && cta.links[0]} />

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
                {c.blocks.map(({ b, i }) => (doc.body[i - 1] && doc.body[i - 1].k === 'figure' && doc.body[i - 1].kind === 'life' && b.k === 'p' ? null : <Block key={i} b={b} i={i} doc={doc} next={doc.body[i + 1]} />))}
              </section>
            ))}
          </article>
        </div>
      </section>

      <End doc={doc} cta={cta} sources={sources} />
    </main>
  );
}
