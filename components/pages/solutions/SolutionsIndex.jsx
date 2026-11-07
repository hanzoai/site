'use client';
/* Solutions. Its idea is the three-way selector: Teams, Industries and Use cases side by side; point at any one and
   the preview beside it becomes that solution (its model's film, its line, its jobs); press it and it opens. Left
   alone, the preview walks through all seventeen by itself.
   Signature: hover-to-preview across three columns, the film crossfading to each solution's own model.
   Beyond: the preview lists each solution's actual jobs, so you can tell Finance from Financial services before you open either. */
import { useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EASE } from '../../ui';
import { A } from '../../kit';
import { Loose } from '../models/parts';
import { Film, useReel } from './Solution';
import './solutions.css';

const up = (d) => ({ initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, ease: EASE, delay: d } });
const pad = (n) => String(n).padStart(2, '0');

export default function SolutionsIndex({ doc, data }) {
  const all = doc.groups.flatMap((g) => g.items.map((it, i) => ({ ...it, group: g.title, i, n: g.items.length })));
  const box = useRef(null);
  const r = useReel(all.length, box, 3600);
  const cur = all[r.at] || all[0];
  const film = (data[cur.slug] || {}).film || doc.film;
  return (
    <main className="xsl xsl-index">
      <section className="xsl-hero xsl-hero-i" aria-labelledby="xsl-h1">
        <div className="x-wrap xsl-hero-g">
          <div className="xsl-hero-t">
            {doc.label && <motion.p className="xsl-pill x-mono" {...up(0)}>{doc.label}</motion.p>}
            <h1 id="xsl-h1" className="xsl-h1" data-morph-target>
              <span className="x-line"><motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.06 }}>{doc.title}</motion.span></span>
            </h1>
            <motion.p className="xsl-lede" {...up(0.28)}><Loose nodes={doc.lede} /></motion.p>
            <motion.div className="xsl-acts" {...up(0.4)}>
              {doc.actions.map((a, i) => <A key={a.label} to={a.href} className={'x-btn' + (i ? '' : ' solid')} {...(i ? {} : { 'data-thumb': '' })}>{a.label}</A>)}
            </motion.div>
          </div>
          <motion.div className="xsl-prev-wrap" initial={{ opacity: 0, y: 30, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 1.2, ease: EASE, delay: 0.12 }}>
            <div className="xsl-reel xsl-prev" ref={box} {...r.hold}>
              <AnimatePresence initial={false}>
                <motion.span key={film} className="xsl-film-x" initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8, ease: EASE }}>
                  <Film slug={film} />
                </motion.span>
              </AnimatePresence>
              <span className="xsl-scrim" aria-hidden="true" />
              <div className="xsl-reel-top">
                <div className="xsl-reel-meta"><span>{cur.group}</span><span className="x-mono">{pad(cur.i + 1)} / {pad(cur.n)}</span></div>
              </div>
              <div className="xsl-panes">
                {all.map((it, k) => {
                  const d = data[it.slug] || {};
                  return (
                    <div key={it.href} className={'xsl-pane' + (k === r.at ? ' on' : '')} aria-hidden={k !== r.at}>
                      <span className="xsl-pane-t">{it.name}</span>
                      <p>{it.text}</p>
                      {d.steps && d.steps.length > 0 && <ul className="xsl-prev-jobs">{d.steps.map((s) => <li key={s}>{s}</li>)}</ul>}
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
        <div className="x-wrap xsl-three">
          {doc.groups.map((g) => (
            <div key={g.title} className="xsl-three-c">
              <h2>{g.title}<span className="x-mono">{pad(g.items.length)}</span></h2>
              <ul>
                {g.items.map((it) => {
                  const k = all.findIndex((x) => x.href === it.href);
                  return (
                    <li key={it.href}>
                      <A to={it.href} className={'xsl-pick' + (k === r.at ? ' on' : '')} onPointerEnter={() => r.setAt(k)} onFocus={() => r.setAt(k)}>
                        <span data-morph>{it.name}</span><i aria-hidden="true">→</i>
                      </A>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {doc.reserved && (
        <section className="xsl-band xsl-band-r" data-room="dark">
          <Film slug={(data.reserved || {}).film || 'enso'} className="xsl-band-film" />
          <div className="x-wrap">
            <h2>{doc.reserved.title}</h2>
            <p>{doc.reserved.text}</p>
            <div className="xsl-acts"><A to={doc.reserved.link.href} className="x-btn solid">{doc.reserved.link.label}</A></div>
          </div>
        </section>
      )}
    </main>
  );
}
