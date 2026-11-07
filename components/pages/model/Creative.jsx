'use client';
/* The creative family's shared body (iro, koma, oto, koe, uta, mori). Each model's own first screen and demo come in
   as children (Iro.jsx, Koma.jsx...); after it every member runs the same rhythm with its own words, glyph and film:
   what it does (a list that wears the model's live glyph), where it fits (three rooms), the studio map, the preview.
   Beyond (family): the studio map. Pick a field and see every Hanzo creative model that serves it, in each model's
   own words; it tours the fields by itself and each tile opens its model with the card-to-page transition. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'motion/react';
import { EASE } from '../../ui';
import { A, More } from '../../kit';
import { useOpener } from '../../Opener';
import { media } from '../../../lib/models';
import { C, ORDER, FIELDS } from './creative';
import { Glyph } from './Studio';
import { arrows } from './live';
import './Creative.css';

function Caps({ slug }) {
  const d = C[slug];
  return (
    <section className="cr-caps mb-sec" aria-labelledby="cr-caps-h">
      <div className="x-wrap cr-caps-in">
        <div className="cr-caps-head">
          <p className="mb-kick">Capabilities</p>
          <h2 id="cr-caps-h" className="mb-h2">What {d.name} does</h2>
        </div>
        <ol className="cr-caps-list">
          {d.caps.map(([t, x], i) => (
            <motion.li key={t} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.8, ease: EASE, delay: i * 0.05 }}>
              <Glyph k={slug} i={i} />
              <span className="cr-n mb-tnum">{String(i + 1).padStart(2, '0')}</span>
              <h3>{t}</h3>
              <p>{x}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Fits({ slug }) {
  const d = C[slug];
  return (
    <section className="cr-fits mb-sec" aria-labelledby="cr-fits-h">
      <div className="x-wrap">
        <p className="mb-kick">In production</p>
        <h2 id="cr-fits-h" className="mb-h2">Where {d.name} fits</h2>
        <ul className="cr-fits-list">
          {d.fits.map(([k, t, x], i) => (
            <motion.li key={t} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.9, ease: EASE, delay: i * 0.06 }}>
              <div className="cr-fit-top"><span className="cr-fit-k">{k}</span><Glyph k={slug} i={i + 4} /></div>
              <h3>{t}</h3>
              <p>{x}</p>
            </motion.li>
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
    <section className="cr-map mb-sec" ref={box} aria-labelledby="cr-map-h">
      <div className="x-wrap">
        <p className="mb-kick">Hanzo Creative AI</p>
        <h2 id="cr-map-h" className="mb-h2">Find your field</h2>
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
                <span className="cr-tile-img"><img src={media(s, 'webp')} alt="" loading="lazy" /></span>
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
                  <a href={'/' + s} className="cr-tile-a" data-card={s} data-cursor="Open" onClick={(e) => opener.open(e, { el: e.currentTarget.querySelector('.cr-tile-img'), src: media(s, 'webp'), href: '/' + s, key: s })}>{body}</a>
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
    <section className="cr-pre mb-sec" aria-labelledby="cr-pre-h">
      <div className="x-wrap cr-pre-in">
        <div>
          <p className="mb-kick"><A to="/beta/research">Research preview</A></p>
          <h2 id="cr-pre-h" className="mb-h2">Try {d.name} on your own work</h2>
          <p className="mb-lede">Samples of {d.name}&apos;s own output publish only after blind review, so the pictures here are illustrations. A studio can apply now to test it in its own pipeline.</p>
          <div className="mb-acts">
            <A to={'/research-access?models=' + slug} className="x-btn solid">Request access</A>
            <More to="/models">Every model</More>
          </div>
        </div>
        <div className="cr-pre-film" aria-hidden="true">
          <img src={media(slug, 'webp')} alt="" loading="lazy" />
          <video src={media(slug, 'webm')} autoPlay muted loop playsInline preload="metadata" />
        </div>
      </div>
    </section>
  );
}

export default function Creative({ slug, children }) {
  return (
    <>
      {children}
      <Caps slug={slug} />
      <Fits slug={slug} />
      <Map slug={slug} />
      <Preview slug={slug} />
    </>
  );
}
