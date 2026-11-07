'use client';
/* The creative family's v2 body (iro, koma, oto, koe, uta, mori), on the Launch + Chapters shell.
   Each model's own file (Iro.jsx, Koma.jsx...) brings the shape its film settles into, its live studio
   demo and the order of its scenes; this file gives every member the same grammar with its own words and film:
   the headline beside the settled film, what it does (four pinned chapters on its own film), where it fits (a tile
   grid of its film), the studio map, and the research preview.
   Beyond (family): the studio map. Pick a field and see every Hanzo creative model that serves it, in each model's
   own words, on Hanzo's black model cards; it tours the fields by itself and each card opens its model with the
   card-to-page transition. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'motion/react';
import { EASE } from '../../ui';
import { A, More, Cta, Img, Film, Band } from '../../kit';
import { useOpener } from '../../Opener';
import Launch, { Lines, film } from '../../v2/Launch';
import Chapters from '../../v2/x-cray/Chapters';
import ModelCards from './ModelCards';
import ModelFilm, { usePaused } from '../../v2/ModelFilm';
import { C, ORDER, FIELDS } from './creative';
import { Glyph } from './Studio';
import { arrows } from './live';
import './Creative.css';

// the headline that sits beside the settled film
function Head({ slug }) {
  const d = C[slug];
  return (
    <>
      <Lines id={'cr-h-' + slug} lines={[d.head]} />
      <p className="lv-lede">{d.desc}</p>
      <div className="lv-acts">
        <Cta kind="quiet" to={'/research-access?models=' + slug} id={slug + '.hero'} thumb>Request access</Cta>
        <Cta to="/design" kind="link" id={slug + '.hero-design'}>Try it in Design</Cta>
      </div>
      <p className="lv-crumb"><span>{d.kind}</span><span>{d.ver}</span></p>
    </>
  );
}

// a capability chapter's picture: the model's own film, each chapter a different framing aimed at the film's own
// subject (subject = where it sits in Hanzo's 4:5 frame; pos = the film's object-position), playing while read
const LOOK = [[1.12, 0, 0], [1.55, 0.09, -0.05], [2.1, -0.07, 0.06], [1.35, 0.05, 0.09]];
const clampPct = (v, z) => Math.max(-(z - 1) * 50, Math.min((z - 1) * 50, v));
function frame(i, subject, pos) {
  const [z, ox, oy] = LOOK[i];
  const fx = subject[0] + ox, fy = subject[1] + oy, py = parseFloat(String(pos || '50% 50%').split(' ')[1] || 50) / 100;
  const dx = fx - 0.5, dy = fy * (1.25 / 0.75) - (0.25 / 0.75) * 2 * py - 0.5; // offset from the box centre (4:3 box, 4:5 film)
  return { '--z': z, '--x': clampPct(-dx * 100 * z, z).toFixed(1) + '%', '--y': clampPct(-dy * 100 * z, z).toFixed(1) + '%' };
}
function CapArt({ slug, i, on, subject, pos }) {
  return (
    <div className="cr-art" style={frame(i, subject, pos)}>
      <Img src={film(slug, 'webp')} w={1200} h={1500} />
      <ModelFilm slug={slug} play={on} />
      <Glyph k={slug} i={i} />
    </div>
  );
}

function Caps({ slug, flip, subject, pos, capArt }) {
  const d = C[slug];
  return (
    <Chapters
      id={'cr-ch-' + slug}
      label={`What ${d.name} does`}
      flip={flip}
      className="cr-caps"
      head={<><h2 id={'cr-caps-' + slug} className="cr-caps-h">What {d.name} does</h2><p className="lv-side cr-caps-side">Capabilities</p></>}
      items={d.caps.map(([t, x], i) => ({ k: d.kind, rail: t, title: t, body: <p>{x}</p>, art: (on) => (capArt ? capArt(i, on) : <CapArt slug={slug} i={i} on={on} subject={subject} pos={pos} />) }))}
    />
  );
}

// where it fits: the three rooms as a quiet list beside one picture of the model at work
function Fits({ slug, flip, subject, pos, fitsArt }) {
  const d = C[slug];
  const box = useRef(null);
  const seen = useInView(box, { amount: 0.3 });
  return (
    <section className="lv-sec cr-fits" ref={box} aria-labelledby={'cr-fits-' + slug}>
      <div className={'x-wrap cr-fits-in' + (flip ? ' flip' : '')}>
        <div className="cr-fits-l">
          <div className="lv-sh">
            <h2 id={'cr-fits-' + slug} className="lv-h">Where {d.name} fits</h2>
            <p className="lv-side">In production</p>
          </div>
          <ol className="cr-fits-list">
            {d.fits.map(([k, t, x], i) => (
              <li key={t}>
                <span className="cr-fit-n mb-tnum" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <h3>{t}</h3>
                <p className="cr-fit-x">{x}</p>
                <p className="cr-fit-k">{k}</p>
              </li>
            ))}
          </ol>
        </div>
        {fitsArt ? fitsArt(seen) : (
          <figure className="cr-fits-art" style={frame(1, subject, pos)}>
            <Img src={film(slug, 'webp')} w={1200} h={1500} />
            <ModelFilm slug={slug} play={seen} />
          </figure>
        )}
      </div>
    </section>
  );
}

// the model card's pointer tilt (SPEC.md: up to 3°, flat on leave, none on touch or under reduced motion)
function tilt(e) {
  if (e.pointerType !== 'mouse' || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const el = e.currentTarget, r = el.getBoundingClientRect();
  const x = ((e.clientX - r.left) / r.width) * 2 - 1, y = ((e.clientY - r.top) / r.height) * 2 - 1;
  el.style.transform = `perspective(900px) rotateX(${(y * 3).toFixed(2)}deg) rotateY(${(-x * 3).toFixed(2)}deg)`;
}

function Map({ slug }) {
  const box = useRef(null);
  const seen = useInView(box, { amount: 0.4 });
  const calm = useReducedMotion();
  const opener = useOpener();
  const first = Math.max(0, FIELDS.findIndex(([, l]) => l.some(([s]) => s === slug)));
  const [f, setF] = useState(first);
  const [mine, setMine] = useState(false);
  const [play, setPlay] = useState(null);
  const paused = usePaused();
  useEffect(() => {
    if (!seen || mine || calm || paused) return;
    const t = setInterval(() => setF((x) => (x + 1) % FIELDS.length), 3200);
    return () => clearInterval(t);
  }, [seen, mine, calm, paused]);
  const [, list] = FIELDS[f];
  return (
    <section className="lv-sec cr-map" ref={box} aria-labelledby={'cr-map-' + slug}>
      <div className="x-wrap">
        <div className="lv-sh">
          <h2 id={'cr-map-' + slug} className="lv-h">Find your field</h2>
          <p className="lv-side">Hanzo Creative AI</p>
        </div>
        <div className="cr-map-tabs" role="tablist" aria-label="Fields" onKeyDown={arrows}>
          {FIELDS.map(([name], i) => (
            <button key={name} type="button" role="tab" id={'cr-f' + i} aria-controls="cr-fields" aria-selected={i === f} className="cr-tab" onClick={() => { setF(i); setMine(true); }}>
              {name}
              {i === f && <motion.span layoutId="cr-tab-ink" className="cr-tab-ink" transition={{ duration: 0.3, ease: EASE }} />}
            </button>
          ))}
        </div>
        <div id="cr-fields" role="tabpanel" aria-labelledby={'cr-f' + f}>
          <ul className="cr-map-grid">
            {ORDER.map((s) => {
              const uses = list.filter(([m]) => m === s).map(([, k]) => C[s].fits[k]);
              const here = s === slug;
              const on = uses.length > 0;
              return (
                <li key={s} className="cr-tile" data-on={on ? '' : undefined}>
                  <a
                    href={'/' + s}
                    className="cr-mc"
                    data-card={s}
                    data-cursor=""
                    onPointerMove={tilt}
                    onPointerOut={(e) => { e.currentTarget.style.transform = ''; }}
                    aria-current={here ? 'page' : undefined}
                    onPointerEnter={() => setPlay(s)}
                    onPointerLeave={() => setPlay((p) => (p === s ? null : p))}
                    onFocus={() => setPlay(s)}
                    onClick={(e) => { if (here) { e.preventDefault(); return; } opener.open(e, { el: e.currentTarget, src: film(s, 'webp'), href: '/' + s, key: s }); }}
                  >
                    <span className="cr-mc-media" aria-hidden="true">
                      <Img src={film(s, 'webp')} w={1200} h={1500} />
                      {play === s && <Film src={film(s, 'webm')} w={1200} h={1500} className="cr-mc-film" onPlaying={(e) => e.currentTarget.classList.add('on')} />}
                    </span>
                    <span className="cr-mc-t">{C[s].name}<span aria-hidden="true"> →</span></span>
                    <span className="cr-mc-d">
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.span key={f + s} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.35, ease: EASE }}>
                          {on ? uses.map((u) => u[1]).join(' · ') : C[s].kind}
                        </motion.span>
                      </AnimatePresence>
                    </span>
                    <span className="cr-mc-pill">{C[s].kind}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

// a model's live studio scene (the demo itself comes from the model's file); it carries no words of ours
export function Scene({ slug, dark, className = '', children }) {
  return (
    <section className={'lv-sec cr-scene ' + (dark ? 'lv-room ' : '') + className} data-room={dark ? 'dark' : undefined} aria-label={C[slug].name}>
      <div className="x-wrap">{children}</div>
    </section>
  );
}

/* slug, shape, aim, over, pos: as Launch. subject: where the film's subject sits in its 4:5 frame (aims every
   framing). demo: the model's Scene. first: 'demo' puts the demo straight after the stage, else the chapters come
   first. flip: chapters picture-left; the fits picture on the left. The page ends on Hanzo's exact model cards and a
   closing Band that carries the research preview in Hanzo's words and repeats the hero ask. */
/* Optional, per model (additive; models that omit them are unchanged): capArt(i, on) draws chapter i's own picture
   instead of the film; fitsArt(seen) replaces the fits picture; first='tail' puts the demo between the studio map and
   the model cards, so the two card grids never sit back to back. */
export default function Creative({ slug, shape, aim, over, pos, subject = [0.55, 0.5], headClass, demo, first = 'demo', flip, capArt, fitsArt }) {
  const d = C[slug];
  const caps = <Caps slug={slug} flip={flip} subject={subject} pos={pos} capArt={capArt} />;
  const tail = first === 'tail';
  return (
    <Launch slug={slug} pos={pos} ask={{ label: 'Request access', to: '/research-access?models=' + slug, id: slug + '.first' }} shape={shape} aim={aim} over={over} headClass={'cr-head ' + (headClass || '')} head={<Head slug={slug} />}>
      {first === 'demo' ? <>{demo}{caps}</> : tail ? caps : <>{caps}{demo}</>}
      <Fits slug={slug} flip={flip} subject={subject} pos={pos} fitsArt={fitsArt} />
      <Map slug={slug} />
      {tail && demo}
      <ModelCards slug={slug} />
      <Band
        title={`Try ${d.name} on your own work`}
        lede={`Samples of ${d.name}'s own output publish only after blind review, so the pictures here are illustrations. A studio can apply now to test it in its own pipeline.`}
        action="Request access"
        to={'/research-access?models=' + slug}
        note={<p className="cr-band-note"><More to="/models">Every model</More><A to="/beta/research">Research preview</A></p>}
      />
    </Launch>
  );
}
