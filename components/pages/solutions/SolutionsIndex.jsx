'use client';
/* /solutions. V2: 8/10 Catalogue: a three-line kinetic headline beside one live film reel that walks all seventeen
   solutions; then the three groups as huge words you press, a tile grid of model films that re-flows to the group and
   opens each tile into its page; the reserved tier as the one dark room. Accent: crimson.
   Signature: the film tile grid. Teams, Industries and Use cases are the section's own headline; press one and the
   tiles leave and glide into the gap, asymmetric rows of 6 + 3 + 3 like a wall of screens; a tile's film plays under
   the pointer and its jobs rise over it; press it and its name opens into the solution's page (Morph).
   Supporting (3): masked kinetic headline, once; the hero reel walking by itself; films that play under the pointer.
   Beyond: each tile lists that solution's actual jobs, so you can tell Finance from Financial services before you open
   either; the hero reel shows the same jobs on phones, where there is no pointer. */
import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { A } from '../../kit';
import { Loose } from '../models/parts';
import { Film, useReel } from './Solution';
import { media } from '../../../lib/models';
import MaskLines from '../company/MaskLines';
import '../../v2/vc-type.css';
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

function Tile({ it, d, w }) {
  const v = useRef(null);
  const play = (e) => {
    if (e.pointerType !== 'mouse' || !v.current || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!v.current.src) v.current.src = media(d.film, 'webm');
    v.current.play().catch(() => {});
  };
  const stop = () => { if (v.current) v.current.pause(); };
  return (
    <motion.li layout="position" className={'xso-tile w' + w}
      initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.22 } }}
      transition={{ layout: { type: 'spring', stiffness: 300, damping: 30 }, duration: 0.45, ease: EASE }}>
      <A to={it.href} className="xso-tile-a" onPointerEnter={play} onPointerLeave={stop}>
        <span className="xso-tile-m" aria-hidden="true">
          {d.film && <img src={media(d.film, 'webp')} alt="" loading="lazy" decoding="async" />}
          {d.film && <video ref={v} muted loop playsInline preload="none" onPlaying={(e) => e.currentTarget.classList.add('on')} />}
        </span>
        <span className="xso-tile-top">
          <span className="vc-kick">{it.group}</span>
          <i aria-hidden="true">→</i>
        </span>
        {d.steps && d.steps.length > 0 && (
          <span className="xso-jobs">{d.steps.map((s) => <span key={s}>{s}</span>)}</span>
        )}
        <span className="xso-tile-b">
          <span className="xso-tile-n" data-morph>{it.name}</span>
          <span className="xso-tile-t">{it.text}</span>
        </span>
      </A>
    </motion.li>
  );
}

export default function SolutionsIndex({ doc, data }) {
  const all = doc.groups.flatMap((g) => g.items.map((it, i) => ({ ...it, group: g.title, i, n: g.items.length })));
  const box = useRef(null);
  const r = useReel(all.length, box, 3800);
  const cur = all[r.at] || all[0];
  const film = (data[cur.slug] || {}).film || doc.film;
  const [group, setGroup] = useState(null);
  const shown = all.filter((it) => !group || it.group === group);
  const words = doc.title.split(' ');
  const lines = [words.slice(0, 2).join(' '), words.slice(2, 4).join(' '), words.slice(4).join(' ')];
  return (
    <main className="vc xso" style={{ '--acc': '#e5484d' }}>
      <section className="xso-hero vc-scene" aria-labelledby="xso-h1">
        <div className="vc-grid xso-hero-g">
          <div className="xso-hero-c">
            {doc.label && <motion.p className="vc-kick" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, ease: EASE }}>{doc.label}</motion.p>}
            <div data-morph-target><MaskLines as="h1" id="xso-h1" now delay={0.05} lines={lines} className="vc-display xso-h1" /></div>
            <motion.div className="xso-hero-f" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, ease: EASE, delay: 0.65 }}>
              <p className="vc-lede"><Loose nodes={doc.lede} /></p>
              <div className="xso-acts">
                {doc.actions.map((a, i) => <A key={a.label} to={a.href} className={'x-btn xso-big' + (i ? '' : ' solid')} {...(i ? {} : { 'data-thumb': a.label })}>{a.label}</A>)}
              </div>
            </motion.div>
          </div>
          <motion.div className="xso-hero-o" initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.3, ease: EASE, delay: 0.2 }}>
            <div className="xso-reel vc-obj" ref={box} {...r.hold}>
              <AnimatePresence initial={false}>
                <motion.span key={film} className="xso-reel-f" initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.9, ease: EASE }}>
                  <Film slug={film} />
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
              <span className="xso-reel-bar" aria-hidden="true">{r.run && <u key={r.at} />}</span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="vc-sec xso-cat" aria-label="Solutions by team, industry and use case">
        <div className="vc-wrap">
          <div className="xso-groups" role="group" aria-label="Show">
            {doc.groups.map((g) => (
              <h2 key={g.title}>
                <button type="button" aria-pressed={group === g.title} onClick={() => setGroup(group === g.title ? null : g.title)}>
                  {g.title}<sup className="vc-num">{pad(g.items.length)}</sup>
                </button>
              </h2>
            ))}
            <button type="button" className="xso-all" aria-pressed={!group} onClick={() => setGroup(null)}>All <span className="vc-num">{all.length}</span></button>
          </div>
          <ul className="xso-grid">
            <AnimatePresence mode="popLayout" initial={false}>
              {shown.map((it, i) => <Tile key={it.href} it={it} d={data[it.slug] || {}} w={span(i, shown.length)} />)}
            </AnimatePresence>
          </ul>
        </div>
      </section>

      {doc.reserved && (
        <section className="xso-res" data-room="dark" aria-labelledby="xso-res-h">
          <Film slug={(data.reserved || {}).film || 'enso'} className="xso-res-film" />
          <span className="xso-res-scrim" aria-hidden="true" />
          <div className="vc-grid xso-res-g">
            <MaskLines id="xso-res-h" lines={[doc.reserved.title]} className="vc-display m" />
            <div className="xso-res-r">
              <p className="vc-lede">{doc.reserved.text}</p>
              <A to={doc.reserved.link.href} className="x-btn solid xso-big">{doc.reserved.link.label}</A>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
