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
import ModelFilm from '../../v2/ModelFilm';
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
        <Cta to={'/research-access?models=' + slug} id={slug + '-hero-access'} thumb>Request access</Cta>
        <Cta to="/design" kind="quiet" id={slug + '-hero-design'}>Try it in Design</Cta>
      </div>
      <p className="lv-crumb"><span>{d.kind}</span><span>{d.ver}</span></p>
    </>
  );
}

// a capability chapter's picture: the model's own film, framed closer each time, wearing its live glyph
const CAM = [[1.08, '0%', '0%'], [1.45, '-12%', '6%'], [1.8, '-16%', '-6%'], [1.3, '-6%', '10%']]; // pans lean left: the films' subjects sit centre-right
function CapArt({ slug, i, title, on }) {
  const [z, x, y] = CAM[i];
  return (
    <div className="cr-art" style={{ '--z': z, '--x': x, '--y': y }}>
      <Img src={film(slug, 'webp')} w={1200} h={1500} />
      <ModelFilm slug={slug} play={on} />
      <div className="cr-art-chip" aria-hidden="true">
        <Glyph k={slug} i={i} />
        <span><em>{C[slug].code} · {String(i + 1).padStart(2, '0')}</em><b>{title}</b></span>
      </div>
    </div>
  );
}

function Caps({ slug, flip }) {
  const d = C[slug];
  return (
    <>
      <section className="lv-sec cr-caps-t" aria-labelledby={'cr-caps-' + slug}>
        <div className="x-wrap lv-sh cr-caps-sh">
          <Lines id={'cr-caps-' + slug} className="cr-caps-h" lines={[`What ${d.name} does`]} reveal />
          <p className="lv-side">Capabilities</p>
        </div>
      </section>
      <Chapters
        id={'cr-ch-' + slug}
        label={`What ${d.name} does`}
        flip={flip}
        items={d.caps.map(([t, x], i) => ({ k: d.kind, rail: t, title: t, body: <p>{x}</p>, art: (on) => <CapArt slug={slug} i={i} title={t} on={on} /> }))}
      />
    </>
  );
}

// where it fits: three rooms as a tile grid of the model's own film, one big and two stacked
function Fits({ slug, flip }) {
  const d = C[slug];
  return (
    <section className="lv-sec cr-fits" aria-labelledby={'cr-fits-' + slug}>
      <div className="x-wrap">
        <div className="lv-sh">
          <h2 id={'cr-fits-' + slug} className="lv-h">Where {d.name} fits</h2>
          <p className="lv-side">In production</p>
        </div>
        <ul className={'cr-fits-grid' + (flip ? ' flip' : '')}>
          {d.fits.map(([k, t, x], i) => (
            <li key={t} className={'cr-fit cr-fit-' + i} style={{ '--z': [1.15, 1.6, 2.1][i], '--x': ['-4%', '-18%', '-24%'][i], '--y': ['0%', '-8%', '8%'][i] }}>
              <Img src={film(slug, 'webp')} w={1200} h={1500} />
              <div className="cr-fit-in">
                <h3>{t}</h3>
                <p className="cr-fit-x">{x}</p>
                <p className="cr-fit-k"><Glyph k={slug} i={i + 4} />{k}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
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
  useEffect(() => {
    if (!seen || mine || calm) return;
    const t = setInterval(() => setF((x) => (x + 1) % FIELDS.length), 3200);
    return () => clearInterval(t);
  }, [seen, mine, calm]);
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

function Preview({ slug }) {
  const d = C[slug];
  return (
    <section className="lv-sec cr-pre" aria-labelledby={'cr-pre-' + slug}>
      <div className="x-wrap cr-pre-in">
        <div className="cr-pre-l">
          <Lines id={'cr-pre-' + slug} lines={[`Try ${d.name} on your own work`]} reveal />
        </div>
        <div className="cr-pre-r">
          <p className="lv-p">Samples of {d.name}&apos;s own output publish only after blind review, so the pictures here are illustrations. A studio can apply now to test it in its own pipeline.</p>
          <div className="lv-acts">
            <Cta to={'/research-access?models=' + slug} kind="quiet" id={slug + '-preview-access'}>Request access</Cta>
            <More to="/models">Every model</More>
          </div>
          <p className="lv-side"><A to="/beta/research">Research preview</A></p>
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

/* slug, shape, aim, over: as Launch. demo: the model's Scene. first: 'demo' puts the demo straight after the stage,
   else the chapters come first. flip: chapters picture-left; fits big tile on the right. The page ends on Hanzo's
   exact model cards and a closing Band that repeats the hero ask. */
export default function Creative({ slug, shape, aim, over, headClass, demo, first = 'demo', flip }) {
  const d = C[slug];
  const caps = <Caps slug={slug} flip={flip} />;
  return (
    <Launch slug={slug} ask={{ label: 'Request access', to: '/research-access?models=' + slug, id: slug + '-hero-access' }} shape={shape} aim={aim} over={over} headClass={'cr-head ' + (headClass || '')} head={<Head slug={slug} />}>
      {first === 'demo' ? <>{demo}{caps}</> : <>{caps}{demo}</>}
      <Fits slug={slug} flip={flip} />
      <Map slug={slug} />
      <Preview slug={slug} />
      <ModelCards slug={slug} />
      <Band title={d.head} action="Request access" to={'/research-access?models=' + slug} />
    </Launch>
  );
}
