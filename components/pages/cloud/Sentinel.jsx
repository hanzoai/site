'use client';
/* Sentinel (v2, Cloud 4 chat). Archetype A, Launch: a side Stage hero with the issue view → one dark scene where the
   events collapse → five stacked sheets → Get Sentinel → closing band. Ink, greys and white only.
   Persona: an engineer whose frontend and services throw errors they can't reproduce. Goal: read the migration docs.
   CTA: "Read the docs" (hero, header ask, close; data-cta primary / close).
   Metric: cta_click:sentinel.primary
   V2: 8/10 the issue view as the hero, ten thousand events collapsing into one issue as you scroll, the facts as stacking sheets
   Signature: ten thousand events become one issue. In a pinned dark room, exceptions rain down a canvas; as you scroll
   they are pulled into a single issue card and its count climbs with them (scrubbed; on phones it plays when seen).
   Beyond: "Route an alert". Choose what happened (new issue, regression, spike), where it goes and which tracker opens
   the ticket, and the rule reads back as a sentence: only the destinations and trackers Hanzo names.
   Motion: scroll scrub (signature) + canvas rain (idle, with Pause) + the hero's ticking issue (idle, with Pause) + the
   alert router and stacked sheets (state, scroll). Labels sit under their headlines. Every word and link is
   Hanzo's; the error, its frames and its counts are made-up examples. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useInView } from 'motion/react';
import useCalm from '../../v2/useCalm';
import { EASE } from '../../ui';
import { useDemo, PauseBtn, useTick } from '../../v2/x-hamilton/Demo';
import StageHero from '../../v2/StageHero';
import Finale from '../../v2/Finale';
import { useWide } from '../../v2/useWide';
import './Sentinel.css';

const DOCS = 'https://docs.hanzo.ai/docs/guides/migrate/sentry';
const GH = 'https://github.com/hanzoai';
const rnd = (i) => { const x = Math.sin(i * 51.7) * 9301.3; return x - Math.floor(x); };
const CRUMBS = ['navigation /cart', 'click “Apply code”', 'fetch POST /discount', 'exception'];

/* The Stage object: the issue as Sentinel shows it, live. Events arrive (the count and the last bar grow), the top frame
   resolves through the source map, and the breadcrumbs line up under it. */
function Issue() {
  const [ref, live, , paused, toggle] = useDemo(0.05);
  const calm = useCalm();
  const [n, setN] = useState(4211);
  const [bars, setBars] = useState(() => Array.from({ length: 28 }, (_, i) => 0.18 + rnd(i + 3) * 0.5 + (i > 20 ? (i - 20) * 0.04 : 0)));
  const [t, setT] = useState(0);
  useTick(140, live, () => { setN((v) => v + 1 + Math.floor(rnd(v) * 9)); setT((x) => x + 1); if (rnd(t) > 0.82) setBars((b) => [...b.slice(1), 0.3 + rnd(t + 9) * 0.65]); });
  const resolved = calm || Math.floor(t / 22) % 2 === 1;
  return (
    <div className="l2-obj sn2-issue" ref={ref}>
      <PauseBtn paused={paused} onClick={toggle} />
      <div className="sn2-top" aria-hidden="true">
        <span className="sn2-dots"><i /><i /><i /></span>
        <span className="l2-mono sn2-host">sentry.hanzo.ai</span>
      </div>
      <div className="sn2-body" aria-hidden="true">
        <div className="sn2-head">
          <span className="sn2-tag l2-mono">TypeError</span>
          <span className="sn2-unres l2-mono">unresolved</span>
        </div>
        <p className="sn2-msg">Cannot read properties of undefined</p>
        <div className="sn2-stats">
          <p><b className="l2-fig">{n.toLocaleString('en-US')}</b><span>events</span></p>
          <p><b className="l2-fig">1</b><span>issue</span></p>
          <div className="sn2-hist">{bars.map((h, i) => <i key={i} style={{ transform: `scaleY(${h})` }} className={i === bars.length - 1 ? 'now' : ''} />)}</div>
        </div>
        <div className="sn2-frame">
          <p className="sn2-k l2-mono">Top frame</p>
          <div className="sn2-code">
            <AnimatePresence initial={false}>
              {resolved
                ? <motion.code key="r" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35, ease: EASE }}><b>checkout/cart.ts:42</b> · applyDiscount()</motion.code>
                : <motion.code key="m" className="min" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>main.3f9a.js:1:88213 · t.a()</motion.code>}
            </AnimatePresence>
            <span className={'sn2-map l2-mono' + (resolved ? ' on' : '')}>source map</span>
          </div>
        </div>
        <ol className="sn2-crumbs">
          <li className="sn2-k l2-mono">Breadcrumbs</li>
          {CRUMBS.map((c, i) => <li key={c} className={i === 3 ? 'ex' : ''}><i />{c}</li>)}
        </ol>
      </div>
    </div>
  );
}

/* Signature: the events rain down a canvas and, as the scene is scrolled (or, on phones, as it plays), they are pulled
   into one issue; the card's count is written straight into its text node. */
const N = 900;
const P = Array.from({ length: N }, (_, i) => ({ x: rnd(i), y: rnd(i + 1777), v: 0.05 + rnd(i + 31) * 0.12, d: rnd(i + 99) * 0.42, jx: rnd(i + 5), jy: rnd(i + 8) }));
const ease = (u) => (u <= 0 ? 0 : u >= 1 ? 1 : 1 - Math.pow(1 - u, 3));

function Collapse() {
  const scene = useRef(null);
  const cv = useRef(null);
  const card = useRef(null);
  const copy = useRef(null);
  const num = useRef(null);
  const [ref, live, , paused, toggle] = useDemo(0.15);
  const calm = useCalm();
  const wide = useWide();
  const pin = wide && !calm;
  const { scrollYProgress } = useScroll({ target: scene, offset: ['start start', 'end end'] });
  const [done, setDone] = useState(false);
  const doneR = useRef(false);
  useEffect(() => {
    const c = cv.current;
    if (!c) return;
    const g = c.getContext('2d');
    let raf = 0, t0 = performance.now(), last = -1;
    const draw = (now) => {
      const w = c.clientWidth, h = c.clientHeight, dpr = Math.min(2, devicePixelRatio || 1);
      if (c.width !== Math.round(w * dpr) || c.height !== Math.round(h * dpr)) { c.width = Math.round(w * dpr); c.height = Math.round(h * dpr); }
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.clearRect(0, 0, w, h);
      const t = (now - t0) / 1000;
      // the scroll drives it on desktop; on phones it plays for 4.5 s, holds, then plays again
      const p = calm ? 1 : pin ? Math.min(1, scrollYProgress.get() * 1.25) : Math.min(1, ((t % 8) / 4.5));
      const cr = card.current.getBoundingClientRect(), r = c.getBoundingClientRect();
      const cx = cr.left - r.left, cy = cr.top - r.top;
      // the rain never falls through the words: particles still in the air skip the copy's box
      const tr = copy.current.getBoundingClientRect();
      const ax = tr.left - r.left - 24, ay = tr.top - r.top - 24, bx = tr.right - r.left + 24, by = tr.bottom - r.top + 24;
      g.fillStyle = '#d4d4d4';
      for (let n = 0; n < P.length; n++) {
        const q = P[n];
        // once everything has landed, one in twenty keeps falling into the issue: the room stays alive
        const late = p >= 0.98 && n % 20 === 0;
        const k = late ? ease(((t * 0.22 + q.x) % 1) * 1.4) : ease((p - q.d) / 0.5);
        const rx = q.x * w, ry = ((q.y + t * q.v) % 1) * h * 1.1 - h * 0.05;
        const tx = cx + 18 + q.jx * (cr.width - 36), ty = cy + 18 + q.jy * (cr.height - 36);
        const x = rx + (tx - rx) * k, y = ry + (ty - ry) * k;
        if (k < 0.5 && x > ax && x < bx && y > ay && y < by) continue;
        g.globalAlpha = (0.25 + q.v * 4) * (1 - k * 0.85);
        g.fillRect(x, y, 2.5, k > 0.02 ? 2.5 : 9);
      }
      g.globalAlpha = 1;
      const shown = Math.round(Math.min(1, p / 0.95) * 10000);
      if (shown !== last && num.current) { num.current.textContent = shown.toLocaleString('en-US'); last = shown; }
      card.current.style.setProperty('--k', String(Math.min(1, Math.max(0, (p - 0.35) / 0.55))));
      if (p >= 0.98 !== doneR.current) { doneR.current = p >= 0.98; setDone(doneR.current); }
      if (!calm && live) raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [live, calm, pin, scrollYProgress, paused]);
  return (
    <section className="l2-dark sn2-col" data-room="dark" ref={scene} style={pin ? { height: '260svh' } : undefined}>
      <div className="sn2-col-pin" ref={ref}>
        <PauseBtn paused={paused} onClick={toggle} className="dk sn2-col-pause" />
        <canvas ref={cv} className="sn2-cv" aria-hidden="true" />
        <div className="l2-wrap sn2-col-in">
          <div className="sn2-col-copy" ref={copy}>
            <h2 className="l2-head">Enough context to fix it without asking</h2>
            <h3 className="l2-title">One issue, not ten thousand events</h3>
            <p className="l2-ch-n">01 / 06</p>
            <p className="l2-body">Identical exceptions collapse into a single issue with a count and a first-seen date. Minified frontend frames are resolved through your source maps, and the breadcrumbs leading up to the throw come with it, so you read what the person did rather than guessing.</p>
          </div>
          <div className={'sn2-card' + (done ? ' done' : '')} ref={card} aria-hidden="true">
            <span className="sn2-tag l2-mono">TypeError</span>
            <p className="sn2-card-m">Cannot read properties of undefined</p>
            <p className="sn2-card-n"><b ref={num} className="l2-fig">10,000</b><span>events</span><em className="l2-mono">1 issue</em></p>
            <p className="sn2-card-f l2-mono">first seen · source map · breadcrumbs</p>
          </div>
        </div>
      </div>
    </section>
  );
}

const DEST = ['Slack', 'PagerDuty', 'Opsgenie', 'Discord', 'Microsoft Teams', 'email', 'webhook'];
const TRACK = ['GitHub', 'GitLab', 'Jira', 'Bitbucket'];
const WHAT = [['New issues', 'A new issue'], ['regressions', 'A regression'], ['spikes', 'A spike']];

/* Beyond: build one alert rule from what Hanzo says Sentinel can route, and read it back as a sentence. */
function Route() {
  const [w, setW] = useState(1);
  const [d, setD] = useState(1);
  const [k, setK] = useState(2);
  const pick = (list, at, set, label) => (
    <div className="sn2-rt-row" role="group" aria-label={label}>
      <p className="l2-mono">{label}</p>
      <div>{list.map((x, i) => <button key={x} type="button" aria-pressed={at === i} onClick={() => set(at === i && label === 'opens a ticket in' ? -1 : i)}>{x}</button>)}</div>
    </div>
  );
  return (
    <div className="sn2-route">
      {pick(WHAT.map((x) => x[0]), w, setW, 'when')}
      {pick(DEST, d, setD, 'route to')}
      {pick(TRACK, k, setK, 'opens a ticket in')}
      <p className="sn2-rt-out" aria-live="polite"><b>{WHAT[w][1]}</b> goes to <b>{DEST[d]}</b>{k >= 0 ? <> and opens the ticket in <b>{TRACK[k]}</b></> : null}.</p>
    </div>
  );
}

function Pic({ i }) {
  if (i === 1) return (
    <div className="sn2-trace">
      {[[0, 94, 'request'], [4, 30, 'service a'], [12, 66, 'service b'], [16, 20, 'service c'], [38, 34, 'service d']].map(([l, wd, t], k) => (
        <p key={k} className={k === 2 ? 'slow' : ''}><span className="l2-mono">{t}</span><i style={{ marginLeft: l + '%', width: wd + '%' }} /></p>
      ))}
      <p className="prof"><span className="l2-mono">profile</span><i style={{ marginLeft: '14%', width: '54%' }}><b /><b /><b /></i></p>
    </div>
  );
  if (i === 2) return (
    <div className="sn2-rel">
      <div className="sn2-rel-bars">{[96, 97, 95, 97, 71, 96].map((v, k) => <i key={k} className={v < 90 ? 'bad' : ''} style={{ height: v + '%', '--k': k }}><span className="l2-mono">release {k + 1}</span></i>)}</div>
      <p className="sn2-cron l2-mono"><span>cron</span>{Array.from({ length: 14 }).map((_, k) => <i key={k} className={k === 10 ? 'miss' : ''} style={{ '--k': k }} />)}</p>
    </div>
  );
  if (i === 3) return (
    <ul className="sn2-acc">{['account 1', 'account 2', 'account 3', 'account 4'].map((a, k) => <li key={a} style={{ '--k': k }}><i style={{ background: ['#0a0a0a', '#404040', '#737373', '#a3a3a3'][k] }} />{a}<em className="l2-mono">{k % 2 ? 'staging' : 'production'}</em></li>)}</ul>
  );
  if (i === 4) return <Route />;
  return (
    <div className="sn2-fork">
      <p className="a">Sentry</p>
      <svg viewBox="0 0 200 120" aria-hidden="true"><path d="M20 20 V100" fill="none" stroke="currentColor" strokeWidth="2" /><path className="sn2-fork-line" d="M20 60 C 20 90, 80 90, 160 90" fill="none" stroke="currentColor" strokeWidth="2.5" pathLength="1" /><circle cx="20" cy="20" r="6" /><circle cx="160" cy="90" r="7" className="me" /></svg>
      <p className="b">Sentinel</p>
      <p className="l2-mono sn2-fsl">Functional Source License · attribution kept current</p>
    </div>
  );
}

const FACTS = [
  ['Traces, and profiles under them', "A request that crosses four services is one trace, and the span that took the time is visible in it. Profiles go a level down to the function. Session replay shows the same failure from the browser's side."],
  ['Did this release make it worse', 'Crash-free sessions per release, so a regression shows up in the first hour of a rollout rather than in a support queue on Monday. Cron monitors catch the opposite failure — the job that stopped running and threw nothing at all.'],
  ['Which customers are hitting it', 'Events carry the identity and the environment they came from, so an issue can be read as a list of affected accounts. That turns triage from a guess about severity into a decision about who to call.'],
  ['Where the alert goes', 'New issues, regressions and spikes route to Slack, PagerDuty, Opsgenie, Discord, Microsoft Teams, email, or a webhook of your own. It can also open the ticket — GitHub, GitLab, Jira and Bitbucket are wired both ways.'],
  ['A fork, and it says so', 'Sentinel is a fork of Sentry, used under the Functional Source License with attribution kept current. Sentry is a trademark of Functional Software, Inc., and Sentinel is neither affiliated with nor endorsed by them. Naming what you forked is not the same as branding yourself with it.'],
];

/* Facts 02–06 as sheets that stack: each one slides up and rests a little below the last. */
function Sheet({ i, t, d }) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.55 });
  return (
    <article ref={ref} className={'sn2-sheet' + (seen ? ' in' : '')} style={{ '--i': i }}>
      <div className="sn2-sheet-copy">
        <h3 className="l2-head">{t}</h3>
        <p className="l2-ch-n">{String(i + 2).padStart(2, '0')} / 06</p>
        <p className="l2-body">{d}</p>
      </div>
      <div className="sn2-pic" aria-hidden={i === 3 ? undefined : true}><Pic i={i + 1} /></div>
    </article>
  );
}

function Sheets() {
  return (
    <section className="sn2-sheets">
      <div className="l2-wrap">
        {FACTS.map(([t, d], i) => <Sheet key={t} i={i} t={t} d={d} />)}
      </div>
    </section>
  );
}

/* The close's object: the issue as it ends up, one issue for ten thousand events, its frame resolved. */
function Resolved() {
  return (
    <div className="sn2-end" aria-hidden="true">
      <div className="sn2-head"><span className="sn2-tag l2-mono">TypeError</span><span className="sn2-unres l2-mono">1 issue</span></div>
      <p className="sn2-msg">Cannot read properties of undefined</p>
      <p className="sn2-end-n"><b className="l2-fig">10,000</b><span>events</span></p>
      <div className="sn2-code"><code><b>checkout/cart.ts:42</b> · applyDiscount()</code><span className="sn2-map l2-mono on">source map</span></div>
    </div>
  );
}

export default function Sentinel() {
  return (
    <main id="main" className="l2-page sn2">
      <StageHero look="side" kick="sentry.hanzo.ai" title="Hanzo Sentinel" sub="Error tracking and performance monitoring" acts={[['Read the docs', DOCS], ['View on GitHub', GH]]}>
        <Issue />
      </StageHero>
      <Collapse />
      <Sheets />
      <Finale name="Sentinel" head="Get started with Hanzo Sentinel" ask={['Read the docs', DOCS]} links={[['View on GitHub', GH]]} object={<Resolved />} prompt="Read https://hanzo.ai/skill.md and use Hanzo Sentinel in my project." tag="Error tracking" license="BSL-1.1" />
    </main>
  );
}
