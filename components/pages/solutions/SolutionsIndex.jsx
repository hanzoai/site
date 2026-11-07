'use client';
/* /solutions. V2: 8/10 (v3 pass, JAMES.md): no hues and no eyebrows. A three-line kinetic headline with its one ask
   beside a live film reel that walks all seventeen solutions once and rests; then Teams, Industries and Use cases as
   huge words you press over a wall of model films that re-flows and opens each tile into its page; the reserved tier
   as the one dark room over a film. Colour arrives only through Hanzo's model films.
   Persona: a team lead or buyer in the Evaluate journey, looking for what Hanzo does for their team or industry.
   Goal: find their solution and open it, then try Hanzo or talk to sales.
   CTA: "Try Hanzo" (/signup) in the hero and the shared sticky ask bar (data-thumb), data-cta solutions.hero; metric
   signup_start. "Contact sales" stays a quiet outline beside it; "Explore the reserved tier" is the dark room's ask.
   Signature: the film wall. Teams, Industries and Use cases are the section's own headline; press one and a pill
   glides to it while the tiles leave and glide into the gap (rows of 6 + 3 + 3 like a wall of screens, numbered
   01 / 17); a tile's film plays under the pointer and its jobs rise over it; press it and the tile opens into the
   solution's page (openTile.js; Morph times out site-wide).
   Supporting (3): masked headline cut-in once, after the curtain; the hero reel walking the seventeen once (pause
   control); the tile's film and jobs answering the pointer. Deck curves only (no springs).
   Beyond: each tile lists that solution's actual jobs, so you can tell Finance from Financial services before you open
   either; the hero reel shows the same jobs on phones, where there is no pointer.
   Deletes: the crimson accent, the "Solutions" kicker over the h1, the invented "All" chip, the group label on every
   tile, the endless reel loop, raw <img>/<video> (kit Img and Film), opacity:0 arrival states. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { A, Img, Film } from '../../kit';
import { Loose } from '../models/parts';
import { media } from '../../../lib/models';
import MaskLines from '../company/MaskLines';
import useArrived from '../company/useArrived';
import { openTile, prefetchTile } from './openTile';
import '../../v2/vc-type.css';
import '../company/deck.css';
import './solutions.css';
import './SolutionsIndex.css';

const EASE = [0.16, 1, 0.3, 1];
const pad = (n) => String(n).padStart(2, '0');

/* 6 + 3 + 3, then 3 + 3 + 6, rows of three like a wall of screens; a short last row shares the width */
function span(i, n) {
  const last = Math.floor((n - 1) / 3) === Math.floor(i / 3) && n % 3;
  if (last) return 12 / (n % 3);
  const row = Math.floor(i / 3), p = i % 3;
  return row % 2 ? (p === 2 ? 6 : 3) : (p === 0 ? 6 : 3);
}

/* The reel walks every solution once, then rests on the first; a pause control stops it (WCAG 2.2.2). */
function useWalk(n, box, ms) {
  const [at, setAt] = useState(0);
  const [steps, setSteps] = useState(0);
  const [paused, setPaused] = useState(false);
  const [held, setHeld] = useState(false);
  const seen = useInView(box, { amount: 0.35 });
  const calm = useReducedMotion();
  const ok = useArrived(); // nothing walks behind the arrival curtain
  const done = steps >= n;
  const run = ok && seen && !held && !paused && !calm && !done;
  useEffect(() => {
    if (!run) return;
    const t = setTimeout(() => { setAt((a) => (a + 1) % n); setSteps((s) => s + 1); }, ms);
    return () => clearTimeout(t);
  }, [run, at, n, ms]);
  const toggle = () => { if (done) { setSteps(0); setPaused(false); } else setPaused((p) => !p); };
  return { at, run, done, paused, toggle, hold: { onPointerEnter: () => setHeld(true), onPointerLeave: () => setHeld(false) } };
}

function Tile({ it, d, w, k, n }) {
  const router = useRouter();
  const [hot, setHot] = useState(false);
  const on = (e) => { prefetchTile(it.href, router); if (e.pointerType === 'mouse' && !matchMedia('(prefers-reduced-motion: reduce)').matches) setHot(true); };
  // phones have no pointer: the one tile crossing the middle of the screen plays its film
  const li = useRef(null);
  useEffect(() => {
    if (matchMedia('(hover: hover)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const io = new IntersectionObserver(([x]) => { setHot(x.isIntersecting); if (x.isIntersecting) prefetchTile(it.href, router); }, { rootMargin: '-45% 0px -45% 0px' });
    io.observe(li.current);
    return () => io.disconnect();
  }, [it.href, router]);
  return (
    <motion.li ref={li} layout="position" className={'xso-tile w' + w} style={{ '--k': k }}
      initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.22 } }}
      transition={{ layout: { duration: 0.3, ease: EASE }, duration: 0.3, ease: EASE }}>
      <A to={it.href} className="xso-tile-a" data-no-morph onClick={(e) => openTile(e, it.href, router)} onPointerEnter={on} onTouchStart={() => prefetchTile(it.href, router)} onPointerLeave={(e) => { if (e.pointerType === 'mouse') setHot(false); }}>
        <span className="xso-tile-m" aria-hidden="true">
          {d.film && <Img src={media(d.film, 'webp')} alt="" w={1200} h={1500} />}
          {d.film && hot && <Film src={media(d.film, 'webm')} w={1200} h={1500} className="xso-tile-v" />}
        </span>
        <span className="xso-tile-no vc-num" aria-hidden="true">{pad(k + 1)} / {pad(n)}</span>
        <span className="xso-tile-go" aria-hidden="true">
          <svg viewBox="0 0 16 16" width="18" height="18"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </span>
        <span className="xso-tile-b">
          <span className="xso-tile-n">{it.name}</span>
          <span className="xso-tile-sw">
            <span className="xso-tile-t">{it.text}</span>
            {d.steps && d.steps.length > 0 && <span className="xso-jobs">{d.steps.map((s) => <span key={s}>{s}</span>)}</span>}
          </span>
        </span>
      </A>
    </motion.li>
  );
}

export default function SolutionsIndex({ doc, data }) {
  const all = doc.groups.flatMap((g) => g.items.map((it, i) => ({ ...it, group: g.title, i, n: g.items.length })));
  const box = useRef(null);
  const r = useWalk(all.length, box, 3800);
  const cur = all[r.at] || all[0];
  const film = (data[cur.slug] || {}).film || doc.film;
  const [group, setGroup] = useState(null);
  const shown = all.filter((it) => !group || it.group === group);
  const words = doc.title.split(' ');
  const lines = [words.slice(0, 2).join(' '), words.slice(2, 4).join(' '), words.slice(4).join(' ')];
  const [ask, other] = doc.actions;
  return (
    <main className="vc xso" style={{ '--acc': '#0a0a0a' }}>
      <section className="xso-hero vc-scene" aria-label={doc.label} data-ask-name={doc.label}>
        <div className="vc-grid xso-hero-g">
          <div className="xso-hero-c">
            <div data-morph-target><MaskLines as="h1" id="xso-h1" now delay={0.05} lines={lines} className="vc-display xso-h1" /></div>
            <div className="xso-hero-f xso-in">
              <p className="vc-lede"><Loose nodes={doc.lede} /></p>
              <div className="xso-acts">
                <A to={ask.href} className="xso-cta" data-thumb={ask.label} data-cta="solutions.hero">{ask.label}</A>
                {other && <A to={other.href} className="xso-cta q" data-cta="solutions.sales">{other.label}</A>}
              </div>
            </div>
          </div>
          <div className="xso-hero-o xso-in2">
            <div className="xso-reel vc-obj" ref={box} {...r.hold}>
              <AnimatePresence initial={false}>
                <motion.span key={film} className="xso-reel-f" initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.9, ease: EASE }}>
                  <Img src={media(film, 'webp')} alt="" w={1200} h={1500} priority />
                  <Film src={media(film, 'webm')} w={1200} h={1500} />
                </motion.span>
              </AnimatePresence>
              <span className="xso-scrim" aria-hidden="true" />
              <div className="xso-reel-top">
                <span className="vc-kick">{cur.group}</span>
                <span className="vc-kick vc-num">{pad(cur.i + 1)} / {pad(cur.n)}</span>
              </div>
              <div className="xso-panes">
                {all.map((it, k) => {
                  const d = data[it.slug] || {};
                  return (
                    <A key={it.href} to={it.href} className={'xso-pane' + (k === r.at ? ' on' : '')} aria-hidden={k !== r.at} tabIndex={k === r.at ? undefined : -1}>
                      <span className="xso-pane-n">{it.name}</span>
                      <span className="xso-pane-t">{it.text}</span>
                      {d.steps && d.steps.length > 0 && <span className="xso-pane-j">{d.steps.map((s) => <span key={s}>{s}</span>)}</span>}
                    </A>
                  );
                })}
              </div>
              <button type="button" className="xso-pause" onClick={r.toggle} aria-pressed={!r.run} aria-label={r.run ? 'Pause' : 'Play'}>
                {r.run
                  ? <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M5 3.5v9M11 3.5v9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                  : <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M5 3.2v9.6L12.6 8z" fill="currentColor" /></svg>}
              </button>
              <span className="xso-reel-bar" aria-hidden="true">{r.run && <u key={r.at} />}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="vc-sec xso-cat" aria-label="Solutions by team, industry and use case">
        <div className="vc-wrap">
          <div className="xso-groups" role="group" aria-label={doc.groups.map((g) => g.title).join(', ')}>
            {doc.groups.map((g) => (
              <h2 key={g.title}>
                <button type="button" aria-pressed={group === g.title} onClick={() => setGroup(group === g.title ? null : g.title)}>
                  {group === g.title && <motion.span layoutId="xso-pill" className="xso-pill" transition={{ duration: 0.3, ease: EASE }} />}
                  <span className="xso-g-t">{g.title}</span><sup className="vc-num">{pad(g.items.length)}</sup>
                </button>
              </h2>
            ))}
          </div>
          <ul className="xso-grid">
            <AnimatePresence mode="popLayout" initial={false}>
              {shown.map((it, i) => <Tile key={it.href} it={it} d={data[it.slug] || {}} w={span(i, shown.length)} k={i} n={shown.length} />)}
            </AnimatePresence>
          </ul>
        </div>
      </section>

      {doc.reserved && (
        <section className="xso-res" data-room="dark" data-ask-hide aria-labelledby="xso-res-h">
          <span className="xso-res-film" aria-hidden="true">
            <Img src={media((data.reserved || {}).film || 'enso', 'webp')} alt="" w={1200} h={1500} />
            <Film src={media((data.reserved || {}).film || 'enso', 'webm')} w={1200} h={1500} />
          </span>
          <span className="xso-res-scrim" aria-hidden="true" />
          <div className="vc-grid xso-res-g">
            <MaskLines id="xso-res-h" lines={[doc.reserved.title]} className="vc-display m" />
            <div className="xso-res-r">
              <p className="vc-lede">{doc.reserved.text}</p>
              <A to={doc.reserved.link.href} className="xso-cta lt" data-cta="solutions.reserved">{doc.reserved.link.label}</A>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
