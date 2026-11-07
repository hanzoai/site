'use client';
/* Koe's copy of the creative family's body (Creative.jsx), kept page-local so /koe can differ without touching the
   family file other pages use. Same grammar and the same words (C.koe, FIELDS, ORDER); what differs:
   - the headline's "Request access" is the one solid ask on the settled first screen (the header's ask is outlined
     while it shows, Koe.jsx + Koe.css);
   - the four capability chapters and "Where Koe fits" each draw their own booth-derived picture (KoePanels.jsx), so
     Koe's wave film shows only on the stage, the map card and the model card;
   - section captions sit under their headings, and the rooms close up (Koe.css).
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
import { usePaused } from '../../v2/ModelFilm';
import { C, ORDER, FIELDS } from './creative';
import { Glyph } from './Studio';
import { arrows } from './live';
import KoePanel from './KoePanels';
import './Creative.css';

const SLUG = 'koe';

function Head() {
  const d = C[SLUG];
  return (
    <>
      <Lines id={'cr-h-' + SLUG} lines={[d.head]} />
      <p className="lv-lede">{d.desc}</p>
      <div className="lv-acts">
        <Cta to={'/research-access?models=' + SLUG} id={SLUG + '.hero'} thumb>Request access</Cta>
        <Cta to="/design" kind="link" id={SLUG + '.hero-design'}>Try it in Design</Cta>
      </div>
      <p className="lv-crumb"><span>{d.kind}</span><span>{d.ver}</span></p>
    </>
  );
}

function Caps({ flip }) {
  const d = C[SLUG];
  return (
    <Chapters
      id={'cr-ch-' + SLUG}
      label={`What ${d.name} does`}
      flip={flip}
      className="cr-caps ko-caps"
      head={<><h2 id={'cr-caps-' + SLUG} className="cr-caps-h">What {d.name} does</h2><p className="lv-side cr-caps-side">Capabilities</p></>}
      items={d.caps.map(([t, x], i) => ({
        k: d.kind, rail: t, title: t, body: <p>{x}</p>,
        art: (on) => <div className="cr-art ko-art" data-k={i}><KoePanel k={i} on={on} /><Glyph k={SLUG} i={i} /></div>,
      }))}
    />
  );
}

function Fits({ flip }) {
  const d = C[SLUG];
  return (
    <section className="lv-sec cr-fits ko-fits" aria-labelledby={'cr-fits-' + SLUG}>
      <div className={'x-wrap cr-fits-in' + (flip ? ' flip' : '')}>
        <div className="cr-fits-l">
          <div className="lv-sh ko-sh">
            <h2 id={'cr-fits-' + SLUG} className="lv-h">Where {d.name} fits</h2>
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
        <figure className="cr-fits-art ko-fits-art"><KoePanel k={4} /></figure>
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

function Map() {
  const slug = SLUG;
  const box = useRef(null), tabs = useRef(null);
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
  // phones: the tab row scrolls sideways; keep the chosen field in view as the tour moves on
  useEffect(() => {
    const row = tabs.current, el = row && row.children[f];
    if (!row || !el || row.scrollWidth <= row.clientWidth + 1) return;
    row.scrollTo({ left: Math.max(0, el.offsetLeft - (row.clientWidth - el.offsetWidth) / 2), behavior: calm ? 'auto' : 'smooth' });
  }, [f, calm]);
  const [, list] = FIELDS[f];
  return (
    <section className="lv-sec cr-map ko-map" ref={box} aria-labelledby={'cr-map-' + slug}>
      <div className="x-wrap">
        <div className="lv-sh ko-sh">
          <h2 id={'cr-map-' + slug} className="lv-h">Find your field</h2>
          <p className="lv-side">Hanzo Creative AI</p>
        </div>
        <div className="cr-map-tabs ko-tabs" ref={tabs} role="tablist" aria-label="Fields" onKeyDown={arrows}>
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

// as Creative's default export, for Koe only: shape, aim, over, pos as Launch; demo is the booth Scene
export default function KoeCreative({ shape, aim, over, pos, headClass, demo, flip }) {
  const d = C[SLUG];
  return (
    <Launch slug={SLUG} pos={pos} ask={{ label: 'Request access', to: '/research-access?models=' + SLUG, id: SLUG + '.first' }} shape={shape} aim={aim} over={over} headClass={'cr-head ' + (headClass || '')} head={<Head />}>
      <Caps flip={flip} />
      {demo}
      <Fits flip={flip} />
      <Map />
      <ModelCards slug={SLUG} />
      <Band
        title={`Try ${d.name} on your own work`}
        lede={`Samples of ${d.name}'s own output publish only after blind review, so the pictures here are illustrations. A studio can apply now to test it in its own pipeline.`}
        action="Request access"
        to={'/research-access?models=' + SLUG}
        note={<p className="cr-band-note"><More to="/models">Every model</More><A to="/beta/research">Research preview</A></p>}
      />
    </Launch>
  );
}
