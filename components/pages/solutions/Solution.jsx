'use client';
/* One solution (/solutions/<team, industry or use case>, 18 pages, one template), read as a launch.
   Persona: a team lead or buyer in that team or industry (Enterprise buyer, Founder).
   Goal: see what Hanzo does for this team, job by job, then what one account runs on.
   CTA: "Try Hanzo" (data-thumb, data-cta="solutions.hero"; the header and the site ask bar carry it after the hero),
   "Contact sales" as a text link. Metric: signup_start (contact_sales_submit for the second).
   First screen: the sentence (the kit's h1, arriving big and settling to 52) on the left, the lede and the ask on the
   right, aligned to the bottom (8/5); under them the solution's own film (Hanzo media, the one place colour may
   appear) runs full-bleed, edge to edge, playing its jobs like stories: a bar fills per job and the job's title rises
   over the film; a pointer or focus holds the story.
   Signature: the jobs as a horizontal scrubbed strip. Five framings of the film sit side by side in a pinned scene;
   as you scroll the strip slides left, one job in as the last goes out. Each job has its own framing and its own
   moment of the film, and only the job in view plays. Phones swipe the same strip. "What it runs on" and "Security
   and compliance" open as sheets from a slim row right after the last job (every word kept).
   Beyond: the overlap finder. Pick another team or industry and see which products the two share and which each adds,
   so a buyer with more than one team sees what one account covers. The other teams sit above it as a block of their
   own film stills (four to six real Hanzo visuals at once), each opening into its page.
   Motion: idle (the film and its stories) · time (stories every 5.2 s, one round, then the film settles with the
   sound kit's quiet 'done') · pointer (magnetic ask, hover holds the
   stories, stills drift under the pointer) · state (overlap pill glides, sheets rise) · scroll (the strip only).
   V2: 8/10 own layout in the family: full-bleed film under an 8/5 title row, jobs as a horizontal scrubbed strip of five framings each with its own moment of the film, sibling teams as a block of their own film stills, sheets from a row after the last job, one solid at the close, ink and tokens only. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion, useScroll, useTransform, useMotionValueEvent } from 'motion/react';
import { A, Img, Film as Clip } from '../../kit';
import { Magnetic } from '../../ui';
import Sigil from '../../Sigil';
import { Loose } from '../models/parts';
import { media } from '../../../lib/models';
import { play } from '../../../lib/sound';
import { useRouter } from 'next/navigation';
import { openTile, prefetchTile } from './openTile';
import FamLines from '../../v2/FamLines';
import FamDrawer from '../../v2/FamDrawer';
import '../../v2/fam.css';
import './solutions.css';
import './Solution.css';

const pad = (n) => String(n).padStart(2, '0');
const ARROW = <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;

/* a model's film (Hanzo's own media): the still at once, the clip only while on screen (kit Img + Film rules);
   play={false} keeps just the still; at (0–1) starts the clip at that moment of the film */
export function Film({ slug, className = '', priority = false, play = true, at = 0 }) {
  if (!slug) return <span className={'xsl-film ' + className} aria-hidden="true" />;
  return (
    <span className={'xsl-film ' + className} aria-hidden="true">
      <Img src={media(slug, 'webp')} w={1200} h={1500} priority={priority} />
      {play && <Clip key={slug + at} src={media(slug, 'webm')} poster={media(slug, 'webp')} w={1200} h={1500} onLoadedMetadata={(e) => { const v = e.currentTarget; if (at && v.duration) v.currentTime = v.duration * at; }} onPlaying={(e) => e.currentTarget.classList.add('on')} />}
    </span>
  );
}

/* the jobs, playing like stories on the film: one round, then the film settles on the first job with the sound
   kit's quiet 'done' (MASTER 4.1: a demo runs once, then settles); a pointer or focus holds it */
export function useReel(n, box, ms = 5200) {
  const [at, setAt] = useState(0);
  const [held, setHeld] = useState(false);
  const [done, setDone] = useState(false);
  const seen = useInView(box, { amount: 0.35 });
  const calm = useReducedMotion();
  const run = seen && !held && !calm && !done && n > 1;
  useEffect(() => {
    if (!run) return;
    const t = setTimeout(() => {
      const nx = (at + 1) % n;
      setAt(nx);
      if (nx === 0) { setDone(true); play('done'); }
    }, ms);
    return () => clearTimeout(t);
  }, [run, at, n, ms]);
  return { at, setAt, run, done, hold: { onPointerEnter: () => setHeld(true), onPointerLeave: () => setHeld(false), onFocus: () => setHeld(true), onBlur: () => setHeld(false) } };
}

/* each job's own framing of the film (where it looks, how close) and its own moment of it */
/* the hero is the solution's own model film (as on hanzo.ai); the five jobs and the closing band each take another
   of Hanzo's nine model films, so the page never shows one picture twice */
const FILMS = ['kai', 'enso', 'iro', 'koe', 'koma', 'mori', 'oto', 'uta', 'zen'];
const otherFilm = (own, k) => { const rest = FILMS.filter((f) => f !== own); return rest[(Math.max(0, FILMS.indexOf(own)) + k * 3) % rest.length]; }; // 3 is coprime with 8: six distinct films
/* the films the strip and the band may use: never the hero's, never one the team cards show a screen later, so no
   picture shows twice on the page; a job with no film left takes the solution's own Sigil instead */
const freeFilms = (own, taken) => { const out = []; for (let k = 1; k <= 8; k++) { const f = otherFilm(own, k); if (!taken.includes(f) && !out.includes(f)) out.push(f); } return out; };
// [where it looks, how close, mirrored, turned]: five framings that read as five different shots of one film
const FRAMES = [['50% 50%', 1.06, 1, 0], ['40% 35%', 1.9, -1, 0], ['62% 62%', 1.4, 1, 0], ['45% 70%', 2.5, -1, 0], ['58% 40%', 1.6, 1, 0], ['50% 55%', 2.1, -1, 0]];
function Shot({ slug, k, n, on, plain, seed }) {
  const [p, s, f, r] = plain ? ['50% 50%', 1.04, k % 2 ? -1 : 1, 0] : FRAMES[k % FRAMES.length];
  return (
    <div className="xs2-shot" aria-hidden="true" style={{ '--p': p, '--s': s, '--f': f, '--r': r + 'deg' }}>
      {slug ? <Film slug={slug} play={on} at={n > 1 ? k / n : 0} /> : <Sigil seed={seed + '#' + k} data={[k + 1, n]} className="xs2-shot-sig" />}
      <span className="xs2-shot-scrim" />
      <b className="xs2-shot-n">{pad(k + 1)}</b>
    </div>
  );
}

/* the hero: the film full-bleed under the title row, playing the jobs as stories */
function Stories({ reel, n }) {
  // the hero is the film alone (the jobs are told once, in the strip below): its label, how many jobs follow, and the
  // products it runs on as a quiet line; a pause control first in the box stops the loop
  const box = useRef(null);
  const [paused, setPaused] = useState(false);
  const toggle = () => {
    const next = !paused;
    setPaused(next);
    box.current?.querySelectorAll('video').forEach((v) => (next ? v.pause() : v.play?.().catch(() => {})));
  };
  return (
    <div ref={box} className="xs2-film">
      <button type="button" className="xs2-film-pause" aria-pressed={paused} aria-label={paused ? 'Play' : 'Pause'} onClick={toggle}>
        {paused
          ? <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M5 3.2v9.6L12.6 8z" fill="currentColor" /></svg>
          : <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M5 3.5v9M11 3.5v9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>}
      </button>
      <Film slug={reel.slug} priority />
      <span className="xs2-film-scrim" aria-hidden="true" />
      <div className="v2f-wrap xs2-film-in" aria-hidden="true">
        <div className="xs2-film-top">
          <span className="xs2-film-l x-mono"><span>{reel.label}</span></span>
        </div>
        {reel.names.length > 0 && <div className="xs2-film-job"><span className="xs2-names plain">{reel.names.join(' · ')}</span></div>}
      </div>
    </div>
  );
}

/* the signature: the jobs as a horizontal strip, scrubbed by scroll on desktop (pinned), swiped on phones */
function Strip({ reel, n, films, seed }) {
  const sec = useRef(null);
  const track = useRef(null);
  const rail = useRef(null);
  const calm = useReducedMotion();
  const [wide, setWide] = useState(false);
  const [dist, setDist] = useState(0);
  const [at, setAt] = useState(0);
  useEffect(() => {
    const mq = matchMedia('(min-width: 901px)');
    const set = () => setWide(mq.matches && !calm);
    set();
    mq.addEventListener('change', set);
    return () => mq.removeEventListener('change', set);
  }, [calm]);
  useEffect(() => {
    if (!wide) return;
    const m = () => { const t = track.current; if (t) setDist(Math.max(0, t.scrollWidth - t.parentElement.clientWidth)); };
    m();
    addEventListener('resize', m);
    return () => removeEventListener('resize', m);
  }, [wide]);
  const { scrollYProgress } = useScroll({ target: sec, offset: ['start start', 'end end'] });
  const x = useTransform(scrollYProgress, (p) => -Math.min(1, Math.max(0, p)) * dist);
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    if (!wide) return;
    const k = Math.max(0, Math.min(n - 1, Math.round(p * (n - 1))));
    if (k !== at) setAt(k);
  });
  // phones (and reduced motion): the rail itself says which job is in view
  useEffect(() => {
    const el = rail.current;
    if (!el || wide) return;
    const on = () => { const w = el.firstElementChild?.firstElementChild?.offsetWidth || 1; setAt(Math.max(0, Math.min(n - 1, Math.round(el.scrollLeft / (w + 16))))); };
    el.addEventListener('scroll', on, { passive: true });
    return () => el.removeEventListener('scroll', on);
  }, [wide, n]);
  return (
    <section ref={sec} className={'xs2-strip' + (wide ? ' pin' : '')} style={{ '--n': n }} aria-label={reel.label}>
      <noscript><style>{'.xs2-strip-v{overflow:visible!important}.xs2-track{flex-direction:column!important;transform:none!important}.xs2-panel{width:auto!important}'}</style></noscript>
      <div className="xs2-strip-pin">
        <div className="v2f-wrap xs2-strip-h">
          <div className="xs2-story xs2-story-ink" aria-hidden="true">{reel.steps.map((s, i) => <i key={s.title} className={i < at ? 'done' : i === at ? 'cur' : ''} />)}</div>
          <span className="v2f-kick xs2-strip-c"><span>{reel.label}</span> <span className="x-mono">{pad(at + 1)} / {pad(n)}</span></span>
        </div>
        <div className="xs2-strip-v" ref={rail} data-swipe-own={wide ? undefined : ''}>
          <motion.ol ref={track} className="xs2-track" style={wide ? { x } : undefined}>
            {reel.steps.map((s, k) => (
              <li key={s.title} className="xs2-panel" data-on={k === at ? '' : undefined}>
                <Shot slug={films[k]} seed={seed} plain k={k} n={n} on={k === at} />
                <div className="xs2-panel-t">
                  <h2 className="v2f-head">{s.title}</h2>
                  {s.text && <p className="v2f-body">{s.text}</p>}
                </div>
              </li>
            ))}
          </motion.ol>
        </div>
      </div>
    </section>
  );
}

/* the other teams as a block of their own film stills, each opening into its page (title → the next page's h1) */
function Teams({ cards, label }) {
  const router = useRouter();
  if (!cards.length) return null;
  return (
    <nav className={'xs2-teams' + (cards.length < 4 ? ' few' : '')} aria-label={label} data-swipe-own>
      {cards.slice(0, 6).map((c) => (
        // a team card opens into its page: its still grows from the card while that page loads, its title lands on the h1
        <A key={c.href} to={c.href} className="xs2-team" data-no-morph onClick={(e) => openTile(e, c.href, router)} onPointerEnter={() => prefetchTile(c.href, router)} onTouchStart={() => prefetchTile(c.href, router)}>
          <span className="xs2-team-f" aria-hidden="true">{c.film ? <Img src={media(c.film, 'webp')} w={1200} h={1500} /> : null}</span>
          <span className="xs2-team-m x-mono">{c.meta}</span>
          <span className="xs2-team-t" data-morph data-open-name>{c.title}</span>
          {c.preview && <span className="xs2-team-p">{c.preview}</span>}
        </A>
      ))}
    </nav>
  );
}

function Overlap({ here, me, sibs, data, seed, sig }) {
  const [pick, setPick] = useState(sibs[0] ? sibs[0].href : null);
  const other = sibs.find((s) => s.href === pick);
  const theirs = other ? (data[other.href.split('/').pop()] || {}).products || [] : [];
  const both = here.filter((p) => theirs.includes(p));
  const mine = here.filter((p) => !theirs.includes(p));
  const only = theirs.filter((p) => !here.includes(p));
  return (
    <div className="xsl-ovl xs2-ovl">
      {seed && <Sigil seed={seed} data={sig} className="xs2-ovl-sig" />}
      <div className="xsl-ovl-pick" role="group" aria-label={me} data-swipe-own>
        {sibs.map((s) => (
          <button key={s.href} type="button" aria-pressed={s.href === pick} onClick={() => setPick(s.href)}>
            {s.href === pick && <motion.span layoutId="xsl-ovl" className="xsl-ovl-bg" transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} />}
            <span>{s.label}</span>
          </button>
        ))}
      </div>
      {other && (
        <div className="xsl-ovl-g" aria-live="polite">
          <div className={'xsl-col both' + (both.length ? '' : ' zero')}><h3><b className="x-mono">{both.length}</b> {me} <span aria-hidden="true">∩</span> {other.label}</h3><ul><AnimatePresence initial={false}>{both.map((p) => <motion.li layout key={p} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>{p}</motion.li>)}</AnimatePresence></ul></div>
          <div className="xsl-col"><h3>{me}</h3><ul>{mine.map((p) => <motion.li layout key={p}>{p}</motion.li>)}</ul></div>
          <div className="xsl-col"><h3>{other.label}</h3><ul>{only.map((p) => <motion.li layout key={p}>{p}</motion.li>)}</ul><A to={other.href} className="x-arrow xsl-ovl-go"><span>{other.label}</span>{ARROW}</A></div>
        </div>
      )}
    </div>
  );
}

/* what it runs on, inside its sheet: the products on one account, each a link */
function Runs({ runs }) {
  return (
    <div className="xs2-sheet">
      {runs.lede && <p className="v2f-lede">{runs.lede}</p>}
      <ol className="xs2-stack xs2-stack-s">
        {runs.items.map((p, i) => (
          <li key={p.href}>
            <A to={p.href} className="xs2-row">
              <span className="xs2-row-n x-mono">{pad(i + 1)}</span>
              <b data-morph>{p.name}</b>
              <span className="xs2-row-t">{p.text}</span>
              <i aria-hidden="true">{ARROW}</i>
            </A>
          </li>
        ))}
      </ol>
      <div className="xs2-links">{runs.links.map((l) => <A key={l.href} to={l.href} className="x-arrow"><span>{l.label}</span>{ARROW}</A>)}</div>
    </div>
  );
}

/* security and compliance, inside its sheet: a calm list of proof */
function Proof({ sec }) {
  return (
    <div className="xs2-sheet">
      <ul className="xs2-proof">
        {sec.items.map((x, i) => (
          <li key={x.title}>
            <span className="xs2-proof-n v2f-num" aria-hidden="true">{pad(i + 1)}</span>
            <div><h3 className="v2f-title">{x.title}</h3><p className="v2f-body">{x.text}</p></div>
          </li>
        ))}
      </ul>
      <div className="xs2-links">{sec.links.map((l) => <A key={l.href} to={l.href} className="x-arrow"><span>{l.label}</span>{ARROW}</A>)}</div>
    </div>
  );
}

/* arriving from a tile (the index or a team card), the hero keeps the picture that was clicked (openTile.js leaves its
   film in sessionStorage); the cover sits over the hero while this swaps, so the open lands on the same film */
function useTileFilm(own) {
  const [film, setFilm] = useState(own);
  useEffect(() => {
    try {
      const t = JSON.parse(sessionStorage.getItem('hz-tile-film') || 'null');
      sessionStorage.removeItem('hz-tile-film');
      if (t && t.film && t.href === location.pathname.replace(/\/$/, '') && FILMS.includes(t.film)) setFilm(t.film);
    } catch { /* storage is a nicety */ }
  }, []);
  return film;
}

export default function Solution({ doc, data }) {
  const heroFilm = useTileFilm(doc.reel && doc.reel.slug);
  const reel = doc.reel && { ...doc.reel, slug: heroFilm };
  const n = reel ? reel.steps.length : 0;
  const sibLinks = doc.more ? doc.more.links.filter((l) => /^\/solutions\/[^/]+$/.test(l.href) && data[l.href.split('/').pop()]) : [];
  const otherLinks = doc.more ? doc.more.links.filter((l) => !doc.sibs.some((s) => s.href === l.href)) : [];
  const here = doc.runs ? doc.runs.items.map((x) => x.name) : [];
  const me = reel ? reel.label : doc.title;
  const cards = doc.sibs.map((s) => {
    const l = doc.more.links.find((x) => x.href === s.href);
    return { href: s.href, title: s.title, preview: s.first, meta: l ? l.label : s.label, film: s.film };
  });
  // the strip and the band take films the hero and the team cards below do not show
  const free = reel ? freeFilms(reel.slug, cards.slice(0, 6).map((c) => c.film).filter(Boolean)) : [];
  const stripFilms = Array.from({ length: n }, (_, k) => free[k] || null);
  const bandFilm = free[n] || (reel && reel.slug);
  const sheets = (doc.runs || doc.security) && (
    <div className="xs2-sheets">
      {doc.runs && <FamDrawer title={doc.runs.title} preview={doc.runs.title}><Runs runs={doc.runs} /></FamDrawer>}
      {doc.security && <FamDrawer title={doc.security.title} preview={doc.security.title}><Proof sec={doc.security} /></FamDrawer>}
    </div>
  );
  const ask = doc.actions.map((a, i) => (i ? <A key={a.label} to={a.href} className="x-arrow xs2-ask2" data-cta="solutions.hero-second"><span>{a.label}</span>{ARROW}</A>
    : <Magnetic key={a.label} strength={0.25}><A to={a.href} className="v2f-btn solid" data-thumb={a.label} data-cta="solutions.hero">{a.label}</A></Magnetic>));
  return (
    <main className="xsl xs2 v2f">
      <section className="xs2-hero" aria-labelledby="xs2-h1">
        <div className="v2f-wrap v2f-grid xs2-hero-g">
          <div className="xs2-hero-t">
            <FamLines as="h1" id="xs2-h1" text={doc.title} className="v2f-display xs2-h1" data-morph-target />
          </div>
          <div className="xs2-hero-r">
            <p className="v2f-lede xs2-lede">{doc.lede}</p>
            <div className="xs2-acts">{ask}</div>
            {doc.label && <p className="v2f-kick xs2-meta">{doc.label}</p>}
          </div>
        </div>
        {reel && <Stories reel={reel} n={n} />}
      </section>

      {reel && n > 0 && <Strip reel={reel} n={n} films={stripFilms} seed={'/solutions/' + doc.slug} />}
      {/* the two sheets open from a slim row right after the last job, outside the pinned scene, so they rise above the header */}
      {sheets && <div className="v2f-wrap xs2-after">{sheets}</div>}

      {doc.capacity && (
        <section className="v2f-sec xs2-cap" aria-labelledby="xs2-cap-h">
          <div className="v2f-wrap v2f-grid">
            <header className="xs2-side">
              <FamLines as="h2" id="xs2-cap-h" play="view" className="v2f-head" text={doc.capacity.title} />
              {doc.capacity.lede && <p className="v2f-lede">{doc.capacity.lede}</p>}
            </header>
            {doc.capacity.rows.length > 0 && (
              <div className="xs2-cap-t v2f-obj" role="region" aria-label={doc.capacity.title} tabIndex={0}>
                <table>
                  <thead><tr>{doc.capacity.head.map((h, i) => <th key={i} scope="col">{h || <span className="xsl-sr">GPU</span>}</th>)}</tr></thead>
                  <tbody>{doc.capacity.rows.map((row) => <tr key={row[0]}>{row.map((c, i) => (i ? <td key={i} className={i === 2 ? 'xs2-big' : 'x-mono'}>{c}</td> : <th key={i} scope="row">{c}</th>))}</tr>)}</tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      )}

      {doc.extra.map((e, i) => <section className="v2f-sec" key={i}><div className="v2f-wrap"><Loose nodes={e.nodes} /></div></section>)}

      {doc.more && cards.length > 0 && (
        <section className="v2f-sec xs2-more" aria-labelledby="xs2-more-h">
          <div className="v2f-wrap">
            <header className="xs2-more-h">
              <FamLines as="h2" id="xs2-more-h" play="view" className="v2f-head" text={doc.more.title} />
              <div className="xs2-links">{otherLinks.map((l) => <A key={l.href} to={l.href} className="x-arrow"><span>{l.label}</span>{ARROW}</A>)}</div>
            </header>
            <Teams cards={cards} label={doc.more.title} />
            {sibLinks.length > 0 && here.length > 0 && <Overlap here={here} me={me} sibs={sibLinks} data={data} seed={'/solutions/' + doc.slug} sig={[n, here.length]} />}
          </div>
        </section>
      )}

      {doc.band && (
        <section className="xs2-band" data-room="dark" data-ask-hide>
          <Film slug={bandFilm} className="xs2-band-film" />
          <div className="v2f-wrap v2f-grid xs2-band-g">
            <h2 className="v2f-display small xs2-band-h">{doc.band.title}</h2>
            <div className="xs2-band-r">
              {doc.band.lede && <p className="v2f-lede">{doc.band.lede}</p>}
              <div className="xs2-acts">
                {doc.band.actions.map((a, i) => (i ? <A key={a.label} to={a.href} className="x-arrow xs2-band-link" data-cta="solutions.band-second"><span>{a.label}</span>{ARROW}</A>
                  : <A key={a.label} to={a.href} className="v2f-btn light" data-cta="solutions.band">{a.label}</A>))}
              </div>
              {/* a member with no sibling cards (the reserved tier) keeps Hanzo's "more" heading and links here, not as an empty section */}
              {doc.more && cards.length === 0 && otherLinks.length > 0 && (
                <p className="xs2-band-more"><span className="v2f-kick">{doc.more.title}</span>{otherLinks.map((l) => <A key={l.href} to={l.href} className="x-arrow xs2-band-link"><span>{l.label}</span>{ARROW}</A>)}</p>
              )}
            </div>
          </div>
        </section>
      )}
      {doc.more && cards.length === 0 && !doc.band && otherLinks.length > 0 && (
        <section className="v2f-sec tight"><div className="v2f-wrap xs2-links">{otherLinks.map((l) => <A key={l.href} to={l.href} className="x-arrow"><span>{l.label}</span>{ARROW}</A>)}</div></section>
      )}
    </main>
  );
}
