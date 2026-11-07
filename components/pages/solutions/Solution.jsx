'use client';
/* One solution (/solutions/<team, industry or use case>, 18 pages, one template). The first screen is this
   solution's own reel: its model's film, its label and its jobs, over a contour field seeded from its name and counts.
   Signature: the reel. The jobs play one after another on the film, each with a progress line like a story; it pauses
   while you hover or focus it; press a job (or a segment) to jump to it.
   Beyond: the overlap finder. Pick another team or industry and see which products the two share and which each adds,
   so a buyer with more than one team sees what one account covers. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'motion/react';
import { EASE } from '../../ui';
import { A } from '../../kit';
import Sigil from '../../Sigil';
import { Loose } from '../models/parts';
import { media } from '../../../lib/models';
import './solutions.css';

const up = (d) => ({ initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, ease: EASE, delay: d } });
const pad = (n) => String(n).padStart(2, '0');

/* a model's film: the still at once, the film only while on screen */
export function Film({ slug, className = '' }) {
  const v = useRef(null);
  useEffect(() => {
    const el = v.current;
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) el.play().catch(() => {}); else el.pause(); }, { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, [slug]);
  if (!slug) return <span className={'xsl-film ' + className} aria-hidden="true" />;
  return (
    <span className={'xsl-film ' + className} aria-hidden="true">
      <img src={media(slug, 'webp')} alt="" decoding="async" />
      <video ref={v} key={slug} src={media(slug, 'webm')} muted loop playsInline preload="none" onPlaying={(e) => e.currentTarget.classList.add('on')} />
    </span>
  );
}

/* the jobs, playing like stories on the film */
export function useReel(n, box, ms = 5200) {
  const [at, setAt] = useState(0);
  const [held, setHeld] = useState(false);
  const seen = useInView(box, { amount: 0.35 });
  const calm = useReducedMotion();
  const run = seen && !held && !calm && n > 1;
  useEffect(() => {
    if (!run) return;
    const t = setTimeout(() => setAt((a) => (a + 1) % n), ms);
    return () => clearTimeout(t);
  }, [run, at, n, ms]);
  return { at, setAt, run, hold: { onPointerEnter: () => setHeld(true), onPointerLeave: () => setHeld(false), onFocus: () => setHeld(true), onBlur: () => setHeld(false) } };
}

function Reel({ reel, at, setAt, run, hold, box }) {
  const n = reel.steps.length;
  return (
    <div className="xsl-reel" ref={box} {...hold}>
      <Film slug={reel.slug} />
      <span className="xsl-scrim" aria-hidden="true" />
      <div className="xsl-reel-top">
        <div className="xsl-segs" aria-hidden="true">
          {reel.steps.map((s, i) => (
            <button key={i} type="button" tabIndex={-1} onClick={() => setAt(i)}>
              <i className={i < at ? 'done' : i === at ? (run ? 'run' : 'done') : ''} key={i === at ? 'r' + at + run : 'k'} style={{ animationDuration: '5.2s' }} />
            </button>
          ))}
        </div>
        <div className="xsl-reel-meta"><span>{reel.label}</span><span className="x-mono" aria-live="off">{pad(at + 1)} / {pad(n)}</span></div>
      </div>
      <div className="xsl-panes">
        {reel.steps.map((s, i) => (
          <div key={s.title} className={'xsl-pane' + (i === at ? ' on' : '')} aria-hidden={i !== at}>
            <span className="xsl-pane-t">{s.title}</span>
            {s.text && <p>{s.text}</p>}
          </div>
        ))}
      </div>
      {reel.names.length > 0 && <div className="xsl-names">{reel.names.map((m) => <span key={m}>{m}</span>)}</div>}
    </div>
  );
}

function Overlap({ here, sibs, data }) {
  const [pick, setPick] = useState(sibs[0] ? sibs[0].href : null);
  const other = sibs.find((s) => s.href === pick);
  const theirs = other ? (data[other.href.split('/').pop()] || {}).products || [] : [];
  const both = here.filter((p) => theirs.includes(p));
  const mine = here.filter((p) => !theirs.includes(p));
  const only = theirs.filter((p) => !here.includes(p));
  return (
    <div className="xsl-ovl">
      <div className="xsl-ovl-pick" role="group" aria-label="Compare with">
        {sibs.map((s) => (
          <button key={s.href} type="button" aria-pressed={s.href === pick} onClick={() => setPick(s.href)}>
            {s.href === pick && <motion.span layoutId="xsl-ovl" className="xsl-ovl-bg" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
            <span>{s.label}</span>
          </button>
        ))}
      </div>
      {other && (
        <div className="xsl-ovl-g" aria-live="polite">
          <div className="xsl-col"><h3>Only here</h3><ul>{mine.map((p) => <motion.li layout key={p}>{p}</motion.li>)}</ul></div>
          <div className="xsl-col both"><h3><b className="x-mono">{both.length}</b> shared</h3><ul><AnimatePresence initial={false}>{both.map((p) => <motion.li layout key={p} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>{p}</motion.li>)}</AnimatePresence></ul></div>
          <div className="xsl-col"><h3>Only in {other.label}</h3><ul>{only.map((p) => <motion.li layout key={p}>{p}</motion.li>)}</ul><A to={other.href} className="x-arrow xsl-ovl-go">{other.label}</A></div>
        </div>
      )}
    </div>
  );
}

export default function Solution({ doc, data }) {
  const box = useRef(null);
  const n = doc.reel ? doc.reel.steps.length : 0;
  const r = useReel(n, box);
  const sibs = doc.more ? doc.more.links.filter((l) => /^\/solutions\/[^/]+$/.test(l.href) && data[l.href.split('/').pop()]) : [];
  const here = doc.runs ? doc.runs.items.map((x) => x.name) : [];
  const nums = [n, here.length, ...(doc.capacity ? doc.capacity.rows.map((row) => parseFloat(row[2])) : [])];
  return (
    <main className="xsl">
      <section className="xsl-hero" aria-labelledby="xsl-h1">
        <Sigil seed={doc.route} data={nums} className="xsl-sigil" />
        <div className="x-wrap xsl-hero-g">
          <div className="xsl-hero-t">
            {doc.label && <motion.p className="xsl-pill x-mono" {...up(0)}>{doc.label}</motion.p>}
            <h1 id="xsl-h1" className="xsl-h1" data-morph-target>
              <span className="x-line"><motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.06 }}>{doc.title}</motion.span></span>
            </h1>
            <motion.p className="xsl-lede" {...up(0.28)}>{doc.lede}</motion.p>
            <motion.div className="xsl-acts" {...up(0.4)}>
              {doc.actions.map((a, i) => <A key={a.label} to={a.href} className={'x-btn' + (i ? '' : ' solid')} {...(i ? {} : { 'data-thumb': '' })}>{a.label}</A>)}
            </motion.div>
            {doc.reel && (
              <motion.ol className="xsl-jobs" {...up(0.5)}>
                {doc.reel.steps.map((s, i) => (
                  <li key={s.title}>
                    <button type="button" aria-expanded={i === r.at} onClick={() => r.setAt(i)}>
                      <span className="x-mono">{pad(i + 1)}</span><span>{s.title}</span>
                    </button>
                  </li>
                ))}
              </motion.ol>
            )}
          </div>
          {doc.reel && (
            <motion.div initial={{ opacity: 0, y: 30, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 1.2, ease: EASE, delay: 0.12 }}>
              <Reel reel={doc.reel} box={box} {...r} />
            </motion.div>
          )}
        </div>
      </section>

      {doc.runs && (
        <section className="x-sec xsl-runs">
          <div className="x-wrap">
            <header className="xsl-sh"><h2>{doc.runs.title}</h2>{doc.runs.lede && <p>{doc.runs.lede}</p>}</header>
            <ul className="xsl-prods">
              {doc.runs.items.map((p, i) => (
                <motion.li key={p.href} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7, ease: EASE, delay: (i % 3) * 0.06 }}>
                  <A to={p.href} className="xsl-prod">
                    <span className="xsl-prod-n x-mono">{pad(i + 1)}</span>
                    <b data-morph>{p.name}</b>
                    <span className="xsl-prod-t">{p.text}</span>
                    <i aria-hidden="true">→</i>
                  </A>
                </motion.li>
              ))}
            </ul>
            <div className="xsl-links">{doc.runs.links.map((l) => <A key={l.href} to={l.href} className="x-arrow">{l.label}</A>)}</div>
          </div>
        </section>
      )}

      {doc.capacity && (
        <section className="x-sec xsl-cap">
          <div className="x-wrap">
            <header className="xsl-sh"><h2>{doc.capacity.title}</h2>{doc.capacity.lede && <p>{doc.capacity.lede}</p>}</header>
            {doc.capacity.rows.length > 0 && (
              <div className="xsl-table" role="region" aria-label={doc.capacity.title} tabIndex={0}>
                <table>
                  <thead><tr>{doc.capacity.head.map((h, i) => <th key={i} scope="col">{h || <span className="xsl-sr">GPU</span>}</th>)}</tr></thead>
                  <tbody>{doc.capacity.rows.map((row) => <tr key={row[0]}>{row.map((c, i) => (i ? <td key={i} className="x-mono">{c}</td> : <th key={i} scope="row">{c}</th>))}</tr>)}</tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      )}

      {doc.security && (
        <section className="x-sec xsl-sec">
          <div className="x-wrap">
            <header className="xsl-sh"><h2>{doc.security.title}</h2></header>
            <div className="xsl-sec-g">
              {doc.security.items.map((s) => <div key={s.title} className="xsl-sec-i"><h3>{s.title}</h3><p>{s.text}</p></div>)}
            </div>
            <div className="xsl-links">{doc.security.links.map((l) => <A key={l.href} to={l.href} className="x-arrow">{l.label}</A>)}</div>
          </div>
        </section>
      )}

      {doc.extra.map((e, i) => <section className="x-sec" key={i}><div className="x-wrap"><Loose nodes={e.nodes} /></div></section>)}

      {doc.more && (
        <section className="x-sec xsl-more">
          <div className="x-wrap">
            <header className="xsl-sh"><h2>{doc.more.title}</h2></header>
            <ul className="xsl-chips">{doc.more.links.map((l) => <li key={l.href}><A to={l.href}>{l.label}</A></li>)}</ul>
            {sibs.length > 0 && here.length > 0 && <Overlap here={here} sibs={sibs} data={data} />}
          </div>
        </section>
      )}

      {doc.band && (
        <section className="xsl-band" data-room="dark">
          <Film slug={doc.reel && doc.reel.slug} className="xsl-band-film" />
          <div className="x-wrap">
            <h2>{doc.band.title}</h2>
            {doc.band.lede && <p>{doc.band.lede}</p>}
            <div className="xsl-acts">{doc.band.actions.map((a, i) => <A key={a.label} to={a.href} className={'x-btn' + (i ? '' : ' solid')}>{a.label}</A>)}</div>
          </div>
        </section>
      )}
    </main>
  );
}
