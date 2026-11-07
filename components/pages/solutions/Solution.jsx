'use client';
/* One solution (/solutions/<team, industry or use case>, 18 pages, one template), read as a launch. The first screen
   is one sentence at display size and the solution's own film as the hero object, which starts close and settles into
   place as you scroll, with the products it runs on riding along its foot.
   Signature: the jobs as a scroll-scrubbed build-up. Each job the solution does is one chapter: its words pin on the
   left while the film re-frames on the right, one shot wiping in as the last goes out, and the story bar over the shot
   fills one segment per job, so the solution assembles itself as you scroll.
   Beyond: the overlap finder. Pick another team or industry and see which products the two share and which each adds,
   so a buyer with more than one team sees what one account covers.
   V2: 8/10 Stage hero with the film settling, jobs as sticky wipe chapters, products as one account object, calm trust list, siblings as cards that open into their page, one accent per member. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'motion/react';
import { A } from '../../kit';
import { Loose } from '../models/parts';
import { media } from '../../../lib/models';
import FamLines from '../../v2/FamLines';
import FamStage from '../../v2/FamStage';
import FamChapters from '../../v2/FamChapters';
import FamNext from '../../v2/FamNext';
import { accentAt } from '../../v2/famAccent';
import '../../v2/fam.css';
import './solutions.css';
import './Solution.css';

const pad = (n) => String(n).padStart(2, '0');
const ARROW = <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;

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

/* the jobs, playing like stories on the film (the /solutions index uses it) */
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

/* one job's shot: the film's still, framed anew for each job, with the story bar over it */
const FRAMES = [['50% 50%', 1.08], ['12% 18%', 1.85], ['88% 72%', 1.6], ['30% 92%', 2.1], ['78% 14%', 1.7], ['50% 62%', 2.4]];
function Shot({ slug, k, n, label }) {
  const [p, s] = FRAMES[k % FRAMES.length];
  return (
    <div className="xs2-shot" aria-hidden="true" style={{ '--p': p, '--s': s }}>
      {slug && <img src={media(slug, 'webp')} alt="" decoding="async" loading="lazy" />}
      <span className="xs2-shot-scrim" />
      <div className="xs2-shot-top">
        <div className="xs2-shot-bar">{Array.from({ length: n }, (_, i) => <i key={i} className={i < k ? 'done' : i === k ? 'cur' : ''} />)}</div>
        <span className="x-mono">{label}</span>
      </div>
      <b className="xs2-shot-n">{pad(k + 1)}</b>
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
    <div className="xsl-ovl xs2-ovl">
      <div className="xsl-ovl-pick" role="group" aria-label="Compare with" data-swipe-own>
        {sibs.map((s) => (
          <button key={s.href} type="button" aria-pressed={s.href === pick} onClick={() => setPick(s.href)}>
            {s.href === pick && <motion.span layoutId="xsl-ovl" className="xsl-ovl-bg" transition={{ type: 'spring', stiffness: 300, damping: 30 }} />}
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
  const reel = doc.reel;
  const n = reel ? reel.steps.length : 0;
  const sibLinks = doc.more ? doc.more.links.filter((l) => /^\/solutions\/[^/]+$/.test(l.href) && data[l.href.split('/').pop()]) : [];
  const otherLinks = doc.more ? doc.more.links.filter((l) => !doc.sibs.some((s) => s.href === l.href)) : [];
  const here = doc.runs ? doc.runs.items.map((x) => x.name) : [];
  const cards = doc.sibs.map((s) => {
    const l = doc.more.links.find((x) => x.href === s.href);
    return { href: s.href, kicker: l ? l.label : s.label, title: s.title, meta: s.first, seed: s.href, data: s.n, acc: accentAt(s.i) };
  });
  return (
    <main className="xsl xs2 v2f" style={{ '--acc': accentAt(doc.i) }}>
      <section className="xs2-hero" aria-labelledby="xs2-h1">
        <div className="v2f-wrap v2f-grid xs2-hero-g">
          <div className="xs2-hero-t">
            {doc.label && <p className="v2f-kick acc xs2-kick">{doc.label}</p>}
            <FamLines as="h1" id="xs2-h1" text={doc.title} className="v2f-display xs2-h1" data-morph-target />
          </div>
          <div className="xs2-hero-r">
            <p className="v2f-lede">{doc.lede}</p>
            <div className="xs2-acts">
              {doc.actions.map((a, i) => <A key={a.label} to={a.href} className={'v2f-btn' + (i ? '' : ' acc')} {...(i ? {} : { 'data-thumb': '' })}>{a.label}</A>)}
            </div>
          </div>
        </div>
        {reel && (
          <div className="v2f-wrap">
            <FamStage className="xs2-stage" from={1.1}>
              <div className="xs2-film">
                <Film slug={reel.slug} />
                <span className="xs2-film-scrim" aria-hidden="true" />
                <div className="xs2-film-top" aria-hidden="true"><span className="x-mono">{reel.label}</span><span className="x-mono">{pad(1)} — {pad(n)}</span></div>
                {reel.names.length > 0 && <div className="xs2-names" data-swipe-own>{reel.names.map((m) => <span key={m}>{m}</span>)}</div>}
              </div>
            </FamStage>
          </div>
        )}
      </section>

      {reel && n > 0 && (
        <FamChapters
          id="xs2-jobs"
          className="xs2-jobs"
          label={reel.label}
          items={reel.steps.map((s, k) => ({
            key: s.title,
            name: s.title,
            text: (
              <div className="xs2-ch-t">
                <p className="v2f-kick acc">{pad(k + 1)} / {pad(n)}</p>
                <h2 className="v2f-head">{s.title}</h2>
                {s.text && <p className="v2f-body">{s.text}</p>}
              </div>
            ),
            visual: <Shot slug={reel.slug} k={k} n={n} label={reel.label} />,
          }))}
        />
      )}

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

      {doc.runs && (
        <section className="v2f-sec xs2-runs" aria-labelledby="xs2-runs-h">
          <div className="v2f-wrap v2f-grid">
            <header className="xs2-side">
              <FamLines as="h2" id="xs2-runs-h" play="view" className="v2f-head" text={doc.runs.title} />
              {doc.runs.lede && <p className="v2f-lede">{doc.runs.lede}</p>}
              <div className="xs2-links">{doc.runs.links.map((l) => <A key={l.href} to={l.href} className="x-arrow"><span>{l.label}</span>{ARROW}</A>)}</div>
            </header>
            <ol className="xs2-stack v2f-obj">
              {doc.runs.items.map((p, i) => (
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
          </div>
        </section>
      )}

      {doc.security && (
        <section className="v2f-sec xs2-trust" aria-labelledby="xs2-trust-h">
          <div className="v2f-wrap v2f-grid">
            <header className="xs2-trust-h">
              <FamLines as="h2" id="xs2-trust-h" play="view" className="v2f-display small" text={doc.security.title} />
            </header>
            <div className="xs2-trust-r">
              <ul className="xs2-proof">
                {doc.security.items.map((s, i) => (
                  <li key={s.title}>
                    <span className="x-mono xs2-proof-n">{pad(i + 1)}</span>
                    <div><h3 className="v2f-title">{s.title}</h3><p className="v2f-body">{s.text}</p></div>
                  </li>
                ))}
              </ul>
              <div className="xs2-links">{doc.security.links.map((l) => <A key={l.href} to={l.href} className="x-arrow"><span>{l.label}</span>{ARROW}</A>)}</div>
            </div>
          </div>
        </section>
      )}

      {doc.extra.map((e, i) => <section className="v2f-sec" key={i}><div className="v2f-wrap"><Loose nodes={e.nodes} /></div></section>)}

      {doc.more && (
        <section className="v2f-sec xs2-more" aria-labelledby="xs2-more-h">
          <div className="v2f-wrap">
            <header className="xs2-more-h">
              <FamLines as="h2" id="xs2-more-h" play="view" className="v2f-head" text={doc.more.title} />
              <div className="xs2-links">{otherLinks.map((l) => <A key={l.href} to={l.href} className="x-arrow"><span>{l.label}</span>{ARROW}</A>)}</div>
            </header>
            <FamNext items={cards} label={doc.more.title} />
            {sibLinks.length > 0 && here.length > 0 && <Overlap here={here} sibs={sibLinks} data={data} />}
          </div>
        </section>
      )}

      {doc.band && (
        <section className="xs2-band" data-room="dark">
          <Film slug={reel && reel.slug} className="xs2-band-film" />
          <div className="v2f-wrap v2f-grid xs2-band-g">
            <h2 className="v2f-display small xs2-band-h">{doc.band.title}</h2>
            <div className="xs2-band-r">
              {doc.band.lede && <p className="v2f-lede">{doc.band.lede}</p>}
              <div className="xs2-acts">{doc.band.actions.map((a, i) => <A key={a.label} to={a.href} className={'v2f-btn' + (i ? ' ghost' : ' light')}>{a.label}</A>)}</div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
