'use client';
/* The creative family's v2 body (iro, koma, oto, koe, uta, mori), on the Launch + Chapters shell.
   Each model's own file (Iro.jsx, Koma.jsx...) brings its accent, the shape its film settles into, its live studio
   demo and the order of its scenes; this file gives every member the same grammar with its own words and film:
   the headline beside the settled film, what it does (four pinned chapters on its own film), where it fits (a tile
   grid of its film), the studio map, and the research preview.
   Beyond (family): the studio map. Pick a field and see every Hanzo creative model that serves it, in each model's
   own words and own colour; it tours the fields by itself and each tile opens its model with the card-to-page
   transition. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'motion/react';
import { EASE } from '../../ui';
import { A, More } from '../../kit';
import { useOpener } from '../../Opener';
import Launch, { Lines, film } from '../../v2/Launch';
import Chapters from '../../v2/Chapters';
import { C, ORDER, FIELDS } from './creative';
import { Glyph } from './Studio';
import { arrows } from './live';
import './Creative.css';

// the headline that sits beside the settled film
function Head({ slug }) {
  const d = C[slug];
  return (
    <>
      <p className="lv-kick cr-kick"><span>{d.kind}</span><span className="cr-ver">{d.ver}</span></p>
      <Lines id={'cr-h-' + slug} lines={[d.head]} />
      <p className="lv-lede">{d.desc}</p>
      <div className="lv-acts">
        <A to={'/research-access?models=' + slug} className="x-btn solid" data-thumb="Request access">Request access</A>
        <A to="/design" className="x-btn">Try it in Design</A>
      </div>
    </>
  );
}

// a capability chapter's picture: the model's own film, framed closer each time, wearing its live glyph
const CAM = [[1.08, '0%', '0%'], [1.45, '-12%', '6%'], [1.8, '10%', '-8%'], [1.3, '6%', '10%']];
function CapArt({ slug, i, title }) {
  const [z, x, y] = CAM[i];
  return (
    <div className="cr-art" style={{ '--z': z, '--x': x, '--y': y }}>
      <img src={film(slug, 'webp')} alt="" loading="lazy" />
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
        <div className="x-wrap">
          <p className="lv-kick">Capabilities</p>
          <Lines id={'cr-caps-' + slug} className="cr-caps-h" lines={[`What ${d.name} does`]} reveal />
        </div>
      </section>
      <Chapters
        id={'cr-ch-' + slug}
        label={`What ${d.name} does`}
        flip={flip}
        items={d.caps.map(([t, x], i) => ({ k: d.kind, rail: t, title: t, body: <p>{x}</p>, art: <CapArt slug={slug} i={i} title={t} /> }))}
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
          <div>
            <p className="lv-kick">In production</p>
            <h2 id={'cr-fits-' + slug} className="lv-h">Where {d.name} fits</h2>
          </div>
        </div>
        <ul className={'cr-fits-grid' + (flip ? ' flip' : '')}>
          {d.fits.map(([k, t, x], i) => (
            <li key={t} className={'cr-fit cr-fit-' + i} style={{ '--z': [1.15, 1.6, 2.1][i], '--x': ['0%', '18%', '-16%'][i], '--y': ['0%', '-10%', '12%'][i] }}>
              <img src={film(slug, 'webp')} alt="" loading="lazy" />
              <div className="cr-fit-in">
                <p className="cr-fit-k"><Glyph k={slug} i={i + 4} />{k}</p>
                <h3>{t}</h3>
                <p className="cr-fit-x">{x}</p>
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
          <div>
            <p className="lv-kick">Hanzo Creative AI</p>
            <h2 id={'cr-map-' + slug} className="lv-h">Find your field</h2>
          </div>
        </div>
        <div className="cr-map-tabs" role="tablist" aria-label="Fields" onKeyDown={arrows}>
          {FIELDS.map(([name], i) => (
            <button key={name} type="button" role="tab" id={'cr-f' + i} aria-controls="cr-fields" aria-selected={i === f} className="cr-tab" onClick={() => { setF(i); setMine(true); }}>
              {name}
              {i === f && <motion.span layoutId="cr-tab-ink" className="cr-tab-ink" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
            </button>
          ))}
        </div>
        <div id="cr-fields" role="tabpanel" aria-labelledby={'cr-f' + f}>
          <ul className="cr-map-grid">
            {ORDER.map((s) => {
              const uses = list.filter(([m]) => m === s).map(([, k]) => C[s].fits[k]);
              const here = s === slug;
              const on = uses.length > 0;
              const body = (
                <>
                  <span className="cr-tile-img"><img src={film(s, 'webp')} alt="" loading="lazy" /></span>
                  <span className="cr-tile-n">{C[s].name}{here && <em>This page</em>}</span>
                  <span className="cr-tile-u">
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.span key={f + s} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.35, ease: EASE }}>
                        {on ? uses.map((u) => u[1]).join(' · ') : C[s].kind}
                      </motion.span>
                    </AnimatePresence>
                  </span>
                </>
              );
              return (
                <li key={s} className="cr-tile" data-on={on ? '' : undefined} data-here={here ? '' : undefined}>
                  {here ? <div className="cr-tile-a">{body}</div> : (
                    <a href={'/' + s} className="cr-tile-a" data-card={s} data-cursor="Open" onClick={(e) => opener.open(e, { el: e.currentTarget.querySelector('.cr-tile-img'), src: film(s, 'webp'), href: '/' + s, key: s })}>{body}</a>
                  )}
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
      <div className="x-wrap lv-cta">
        <div className="cr-pre-l">
          <p className="lv-kick"><A to="/beta/research">Research preview</A></p>
          <Lines id={'cr-pre-' + slug} lines={[`Try ${d.name} on your own work`]} reveal />
        </div>
        <div className="lv-cta-r">
          <p className="lv-p">Samples of {d.name}&apos;s own output publish only after blind review, so the pictures here are illustrations. A studio can apply now to test it in its own pipeline.</p>
          <div className="lv-acts">
            <A to={'/research-access?models=' + slug} className="x-btn solid">Request access</A>
            <More to="/models">Every model</More>
          </div>
        </div>
      </div>
    </section>
  );
}

// a model's live studio scene: a short head over its demo (the demo itself comes from the model's file)
export function Scene({ slug, k, title, lede, dark, className = '', children }) {
  return (
    <section className={'lv-sec cr-scene ' + (dark ? 'lv-room ' : '') + className} aria-labelledby={'cr-sc-' + slug}>
      <div className="x-wrap">
        <div className="lv-sh">
          <div>
            <p className="lv-kick"><span className="mb-live">{k}</span></p>
            <h2 id={'cr-sc-' + slug} className="lv-h">{title}</h2>
          </div>
          {lede && <p className="lv-p">{lede}</p>}
        </div>
        {children}
      </div>
    </section>
  );
}

/* slug, accent, ink, shape, aim, over: as Launch. demo: the model's Scene. first: 'demo' puts the demo straight
   after the stage, else the chapters come first. flip: chapters picture-left; fits big tile on the right. */
export default function Creative({ slug, accent, ink, shape, aim, over, headClass, demo, first = 'demo', flip }) {
  const caps = <Caps slug={slug} flip={flip} />;
  return (
    <Launch slug={slug} accent={accent} ink={ink} shape={shape} aim={aim} over={over} headClass={'cr-head ' + (headClass || '')} head={<Head slug={slug} />}>
      {first === 'demo' ? <>{demo}{caps}</> : <>{caps}{demo}</>}
      <Fits slug={slug} flip={flip} />
      <Map slug={slug} />
      <Preview slug={slug} />
    </Launch>
  );
}
