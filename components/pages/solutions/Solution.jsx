'use client';
/* One solution (/solutions/<team, industry or use case>, 18 pages, one template), read as a launch.
   Persona: a team lead or buyer in that team or industry (Enterprise buyer, Founder).
   Goal: see in one screen what Hanzo does for this team, then what one account runs on.
   CTA: "Try Hanzo" (data-thumb, data-cta="solutions.hero"; the site ask bar carries it after the hero), "Contact sales"
   as the outlined second. Metric: signup_start (contact_sales_submit for the second).
   First screen: the sentence at display size on the left with its ask; on the right the solution's own film (Hanzo
   media) as the hero object, playing its jobs like stories (a bar fills per job, the job's title rises over the film,
   hover holds it), settling into place as you scroll.
   Signature: the jobs as a scroll-scrubbed build-up. Each job is one chapter: its words pin on the left while the film
   re-frames on the right, one shot wiping in as the last goes out, the story bar filling one segment per job; the
   film plays in the job in view (on a phone, in the shot crossing the middle of the screen). The page then ends soon:
   the last job opens "What it runs on" and "Security and compliance" as sheets (every word kept), then the sibling
   rail with the overlap finder over this member's own contour, then the closing room.
   Beyond: the overlap finder. Pick another team or industry and see which products the two share and which each adds,
   so a buyer with more than one team sees what one account covers.
   Motion: idle (the film and its stories) · pointer (magnetic ask, hover holds the stories, drag rail of siblings) ·
   state (overlap pills glide, products re-flow, sheets rise) · scroll (stage settle, the chapters). Each member's own
   contour (Sigil seeded with its slug) sits behind its overlap finder; siblings carry theirs.
   V2: 8/10 film beside the headline playing its jobs as stories, each job's film playing in view (phones too), the tail folded into two sheets from the last job, ink only, no eyebrows, magnetic ask, member contour behind the overlap finder, siblings that drag and open. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'motion/react';
import { A, Img, Film as Clip } from '../../kit';
import { Magnetic } from '../../ui';
import Sigil from '../../Sigil';
import { Loose } from '../models/parts';
import { media } from '../../../lib/models';
import FamLines from '../../v2/FamLines';
import FamStage from '../../v2/FamStage';
import FamChapters from '../../v2/FamChapters';
import FamNext from '../../v2/FamNext';
import FamDrawer from '../../v2/FamDrawer';
import '../../v2/fam.css';
import './solutions.css';
import './Solution.css';

const pad = (n) => String(n).padStart(2, '0');
const ARROW = <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;

/* a model's film (Hanzo's own media): the still at once, the clip only while on screen (kit Img + Film rules);
   play={false} keeps just the still (a job's shot that is not the one in view) */
export function Film({ slug, className = '', priority = false, play = true }) {
  if (!slug) return <span className={'xsl-film ' + className} aria-hidden="true" />;
  return (
    <span className={'xsl-film ' + className} aria-hidden="true">
      <Img src={media(slug, 'webp')} w={1200} h={1500} priority={priority} />
      {play && <Clip key={slug} src={media(slug, 'webm')} poster={media(slug, 'webp')} w={1200} h={1500} onPlaying={(e) => e.currentTarget.classList.add('on')} />}
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

/* one job's shot: the film, framed anew for each job, with the story bar over it. It plays only for the job in view:
   on desktop the pinned chapter on screen (on), on a phone the shot crossing the middle of the screen, so the stacked
   chapters move too. At most two clips play on any screen (PLAN-COMPONENTS 2.10). */
const FRAMES = [['50% 50%', 1.08], ['12% 18%', 1.85], ['88% 72%', 1.6], ['30% 92%', 2.1], ['78% 14%', 1.7], ['50% 62%', 2.4]];
function Shot({ slug, k, n, label, on }) {
  const [p, s] = FRAMES[k % FRAMES.length];
  const box = useRef(null);
  const [mid, setMid] = useState(false);
  const [phone, setPhone] = useState(false);
  useEffect(() => {
    const mq = matchMedia('(max-width: 900px)');
    const set = () => setPhone(mq.matches);
    set();
    mq.addEventListener('change', set);
    const io = new IntersectionObserver(([e]) => setMid(e.isIntersecting), { rootMargin: '-30% 0px -30% 0px' });
    box.current && io.observe(box.current);
    return () => { mq.removeEventListener('change', set); io.disconnect(); };
  }, []);
  return (
    <div ref={box} className="xs2-shot" aria-hidden="true" style={{ '--p': p, '--s': s }}>
      {slug && <Film slug={slug} play={phone ? mid : !!on} />}
      <span className="xs2-shot-scrim" />
      <div className="xs2-shot-top">
        <div className="xs2-shot-bar">{Array.from({ length: n }, (_, i) => <i key={i} className={i < k ? 'done' : i === k ? 'cur' : ''} />)}</div>
        <span className="x-mono">{label}</span>
      </div>
      <b className="xs2-shot-n">{pad(k + 1)}</b>
    </div>
  );
}

function Overlap({ here, me, sibs, data, seed, sig }) {
  const [pick, setPick] = useState(sibs[0] ? sibs[0].href : null);
  const other = sibs.find((s) => s.href === pick);
  const theirs = other ? (data[other.href.split('/').pop()] || {}).products || [] : [];
  const both = here.filter((p) => theirs.includes(p));
  const mine = here.filter((p) => !theirs.includes(p));
  const only = theirs.filter((p) => !here.includes(p));
  return (
    <div className="xsl-ovl xs2-ovl">
      {seed && <Sigil seed={seed} data={sig} className="xs2-ovl-sig" />}
      <div className="xsl-ovl-pick" role="group" aria-label={me} data-swipe-own>
        {sibs.map((s) => (
          <button key={s.href} type="button" aria-pressed={s.href === pick} onClick={() => setPick(s.href)}>
            {s.href === pick && <motion.span layoutId="xsl-ovl" className="xsl-ovl-bg" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
            <span>{s.label}</span>
          </button>
        ))}
      </div>
      {other && (
        <div className="xsl-ovl-g" aria-live="polite">
          <div className="xsl-col both"><h3><b className="x-mono">{both.length}</b> {me} <span aria-hidden="true">∩</span> {other.label}</h3><ul><AnimatePresence initial={false}>{both.map((p) => <motion.li layout key={p} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>{p}</motion.li>)}</AnimatePresence></ul></div>
          <div className="xsl-col"><h3>{me}</h3><ul>{mine.map((p) => <motion.li layout key={p}>{p}</motion.li>)}</ul></div>
          <div className="xsl-col"><h3>{other.label}</h3><ul>{only.map((p) => <motion.li layout key={p}>{p}</motion.li>)}</ul><A to={other.href} className="x-arrow xsl-ovl-go">{other.label}</A></div>
        </div>
      )}
    </div>
  );
}

/* what it runs on, inside its sheet: the products on one account, each a link */
function Runs({ runs }) {
  return (
    <div className="xs2-sheet">
      {runs.lede && <p className="v2f-lede">{runs.lede}</p>}
      <ol className="xs2-stack xs2-stack-s">
        {runs.items.map((p, i) => (
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
      <div className="xs2-links">{runs.links.map((l) => <A key={l.href} to={l.href} className="x-arrow"><span>{l.label}</span>{ARROW}</A>)}</div>
    </div>
  );
}

/* security and compliance, inside its sheet: a calm list of proof */
function Proof({ sec }) {
  return (
    <div className="xs2-sheet">
      <ul className="xs2-proof">
        {sec.items.map((x, i) => (
          <li key={x.title}>
            <span className="xs2-proof-n v2f-num" aria-hidden="true">{pad(i + 1)}</span>
            <div><h3 className="v2f-title">{x.title}</h3><p className="v2f-body">{x.text}</p></div>
          </li>
        ))}
      </ul>
      <div className="xs2-links">{sec.links.map((l) => <A key={l.href} to={l.href} className="x-arrow"><span>{l.label}</span>{ARROW}</A>)}</div>
    </div>
  );
}

/* the hero film plays the jobs like stories: a bar fills per job and the job's title rises over the film; a pointer
   on it holds the story, focus too (useReel); reduced motion shows the first job, still */
function Stories({ reel, n }) {
  const box = useRef(null);
  const r = useReel(n, box, 5200);
  const step = reel.steps[r.at] || reel.steps[0];
  return (
    <div ref={box} className="xs2-film" {...r.hold}>
      <Film slug={reel.slug} priority />
      <span className="xs2-film-scrim" aria-hidden="true" />
      <div className="xs2-film-top" aria-hidden="true">
        <div className="xs2-story">{reel.steps.map((s, i) => <i key={s.title} className={i < r.at ? 'done' : i === r.at ? (r.run ? 'cur run' : 'cur') : ''} />)}</div>
        <span className="xs2-film-l x-mono"><span>{reel.label}</span><span>{pad(r.at + 1)} / {pad(n)}</span></span>
      </div>
      {step && (
        <div className="xs2-film-job" aria-hidden="true">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.b key={step.title} className="xs2-film-n x-mono" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '-100%', transition: { duration: 0.22 } }} transition={{ duration: 0.52, ease: [0.16, 1, 0.3, 1] }}>{pad(r.at + 1)}</motion.b>
          </AnimatePresence>
          <span className="xs2-film-tw">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span key={step.title} className="xs2-film-t" initial={{ y: '105%' }} animate={{ y: 0 }} exit={{ y: '-105%', transition: { duration: 0.22 } }} transition={{ duration: 0.52, ease: [0.16, 1, 0.3, 1] }}>{step.title}</motion.span>
            </AnimatePresence>
          </span>
        </div>
      )}
      {reel.names.length > 0 && <div className="xs2-names">{reel.names.map((m) => <span key={m}>{m}</span>)}</div>}
    </div>
  );
}

export default function Solution({ doc, data }) {
  const reel = doc.reel;
  const n = reel ? reel.steps.length : 0;
  const sibLinks = doc.more ? doc.more.links.filter((l) => /^\/solutions\/[^/]+$/.test(l.href) && data[l.href.split('/').pop()]) : [];
  const otherLinks = doc.more ? doc.more.links.filter((l) => !doc.sibs.some((s) => s.href === l.href)) : [];
  const here = doc.runs ? doc.runs.items.map((x) => x.name) : [];
  const me = reel ? reel.label : doc.title;
  const [job, setJob] = useState(0);
  // the tail ends sooner: what it runs on and security open as sheets from the last job (every word kept)
  const sheets = !!reel && n > 0;
  const cards = doc.sibs.map((s) => {
    const l = doc.more.links.find((x) => x.href === s.href);
    return { href: s.href, title: s.title, preview: s.first, meta: l ? l.label : s.label, seed: '/solutions/' + s.slug, data: s.n };
  });
  return (
    <main className="xsl xs2 v2f">
      <section className="xs2-hero" aria-labelledby="xs2-h1">
        <div className="v2f-wrap v2f-grid xs2-hero-g">
          <div className="xs2-hero-t">
            <FamLines as="h1" id="xs2-h1" text={doc.title} className={'v2f-display xs2-h1' + (doc.title.length > 26 ? ' small' : ' mid')} data-morph-target />
            <p className="v2f-lede xs2-lede">{doc.lede}</p>
            <div className="xs2-acts">
              {doc.actions.map((a, i) => (i ? <A key={a.label} to={a.href} className="v2f-btn" data-cta="solutions.hero-second">{a.label}</A>
                : <Magnetic key={a.label} strength={0.25}><A to={a.href} className="v2f-btn solid" data-thumb={a.label} data-cta="solutions.hero">{a.label}</A></Magnetic>))}
            </div>
            {doc.label && <p className="v2f-kick xs2-meta">{doc.label}</p>}
          </div>
          {reel && (
            <div className="xs2-hero-o">
              <FamStage className="xs2-stage" from={1.06} span={480}><Stories reel={reel} n={n} /></FamStage>
            </div>
          )}
        </div>
      </section>

      {reel && n > 0 && (
        <FamChapters
          id="xs2-jobs"
          className="xs2-jobs"
          label={reel.label}
          onStep={setJob}
          items={reel.steps.map((s, k) => ({
            key: s.title,
            name: s.title,
            text: (
              <div className="xs2-ch-t">
                <h2 className="v2f-head">{s.title}</h2>
                {s.text && <p className="v2f-body">{s.text}</p>}
                {k === n - 1 && sheets && (doc.runs || doc.security) && (
                  <div className="xs2-sheets">
                    {doc.runs && <FamDrawer title={doc.runs.title} preview={doc.runs.title + ' · ' + doc.runs.lede}><Runs runs={doc.runs} /></FamDrawer>}
                    {doc.security && <FamDrawer title={doc.security.title} preview={doc.security.title + ' · ' + doc.security.items.map((x) => x.title).join(' · ')}><Proof sec={doc.security} /></FamDrawer>}
                  </div>
                )}
              </div>
            ),
            visual: <Shot slug={reel.slug} k={k} n={n} label={reel.label} on={k === job} />,
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

      {doc.runs && !sheets && (
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

      {doc.security && !sheets && (
        <section className="v2f-sec xs2-trust" aria-labelledby="xs2-trust-h">
          <div className="v2f-wrap v2f-grid">
            <header className="xs2-trust-h">
              <FamLines as="h2" id="xs2-trust-h" play="view" className="v2f-display small" text={doc.security.title} />
              <div className="xs2-sig v2f-obj" aria-hidden="true"><Sigil seed={'/solutions/' + doc.slug} data={[n, here.length, doc.security.items.length]} /></div>
            </header>
            <div className="xs2-trust-r">
              <ul className="xs2-proof">
                {doc.security.items.map((s, i) => (
                  <li key={s.title}>
                    <span className="xs2-proof-n v2f-num" aria-hidden="true">{pad(i + 1)}</span>
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
            {sibLinks.length > 0 && here.length > 0 && <Overlap here={here} me={me} sibs={sibLinks} data={data} seed={'/solutions/' + doc.slug} sig={[n, here.length]} />}
          </div>
        </section>
      )}

      {doc.band && (
        <section className="xs2-band" data-room="dark" data-ask-hide>
          <Film slug={reel && reel.slug} className="xs2-band-film" />
          <div className="v2f-wrap v2f-grid xs2-band-g">
            <h2 className="v2f-display small xs2-band-h">{doc.band.title}</h2>
            <div className="xs2-band-r">
              {doc.band.lede && <p className="v2f-lede">{doc.band.lede}</p>}
              <div className="xs2-acts">{doc.band.actions.map((a, i) => <A key={a.label} to={a.href} className={'v2f-btn' + (i ? ' ghost' : ' light')} data-cta={i ? 'solutions.band-second' : 'solutions.band'}>{a.label}</A>)}</div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
