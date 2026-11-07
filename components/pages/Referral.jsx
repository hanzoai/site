'use client';
/* Referrals.
   Persona: a builder already on Hanzo who wants to bring a friend or teammate. Goal: get their referral link.
   CTA: "Get your link" (/signup?next=/referral; data-cta referral.hero, thumb). Metric: signup_start.
   Signature: every way out, in motion: the seven ways to share run past as one rail at display size, its centre word
   lit in ink while the rest wait in grey, between a small rail of the link and a medium rail of the three counts; the
   rails speed up as you scroll (a marquee that answers the scroll) and have a pause control.
   Beyond: the four steps as one object that happens: Share fans the link out to every way, Signs up locks one account
   to it, Qualifies swings the first metered spend, Moves up lifts you through the waitlist. It runs once, then rests;
   pick any step to replay it.
   Supporting (3): the line-masked h1 (arrival); hanzo.ai's own signed-out card with one builder riding in, once, from
   the link through the three counts (time, idle); the steps' drawings (svg line draw, state).
   Scale: the h1 at 52 is the first screen's one big thing; the ways rail is the rails' one big line (84), the counts 26,
   the link 17; step titles 21; the dark room's heading 44 with 21px sides.
   V2: 8/10 no label over the h1 or the dark room's heading; a larger card where one builder lands once; the rails have
   rhythm (one big, one medium, one small), answer the scroll and pause; the four icon boxes became one object that
   steps itself; Copy fills on hover instead of fading; deck greys only.
   Every word is Hanzo's; no figure is shown that Hanzo does not show. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'motion/react';
import { A, Cta } from '../kit';
import LineReveal from '../v2/LineReveal';
import '../v2/ProgramScale.css';
import './Referral.css';

const EASE = [0.16, 1, 0.3, 1];
const WAYS = ['X', 'LinkedIn', 'Facebook', 'Bluesky', 'Reddit', 'Hacker News', 'Email'];
const COUNTS = ['Referred', 'Pending', 'Qualified'];
const STEPS = [
  ['Share it anywhere: every way out carries your link.', 'share'],
  ['An account that signs up through it is yours, once and for good.', 'lock'],
  ['It qualifies with its first metered spend.', 'meter'],
  ['Each one moves you up the beta waitlist.', 'up'],
];

/* hanzo.ai's own signed-out card. One builder rides in from the link, once, and lands in each count in turn. */
function Card() {
  const [nudge, setNudge] = useState(0);
  const calm = useReducedMotion();
  const [at, setAt] = useState(calm ? 3 : -1);
  useEffect(() => {
    if (calm) { setAt(3); return; }
    const t = [900, 2300, 3700, 5100].map((ms, i) => setTimeout(() => setAt(i), ms));
    return () => t.forEach(clearTimeout);
  }, [calm]);
  return (
    <div className="xrf-win xp-obj" data-slot="referral">
      <div className="xrf-win-top"><i /><i /><i /><span className="x-mono">Your referral link</span></div>
      <div className="xrf-win-in">
        <div className={'xrf-link' + (at >= 0 ? ' sent' : '')}>
          <span className="x-mono xrf-url">hanzo.ai/?ref=…</span>
          <button type="button" className="xrf-copy" aria-disabled="true" aria-label="Copy link" data-sound="tick" onClick={() => setNudge((n) => n + 1)}>
            <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><rect x="5" y="5" width="8.5" height="8.5" rx="2" fill="none" stroke="currentColor" strokeWidth="1.4" /><path d="M10.5 3.2V3a.8.8 0 0 0-.8-.8H3a.8.8 0 0 0-.8.8v6.7c0 .44.36.8.8.8h.2" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
            Copy
          </button>
        </div>
        <ul className="xrf-ways" aria-label="Every way out carries your link">
          {WAYS.map((w, i) => <li key={w} style={{ '--i': i }}>{w}</li>)}
        </ul>
        <div className="xrf-counts" data-at={at}>
          <i className="xrf-flow" aria-hidden="true">{[0, 1, 2, 3, 4].map((k) => <b key={k} style={{ '--k': k }} />)}</i>
          <i className="xrf-rider" aria-hidden="true" style={{ '--at': Math.max(at, 0) }} data-on={at >= 1 ? '' : undefined} />
          {COUNTS.map((c, i) => (
            <div key={c} className={'xrf-count' + (at === i + 1 || (at === 3 && i === 2) ? ' lit' : '') + (at > i + 1 ? ' past' : '')}><span className="x-mono">—</span><span>{c}</span></div>
          ))}
        </div>
        <p className="xrf-q">An account qualifies with its first metered spend.</p>
        <AnimatePresence mode="popLayout">
          <motion.p key={nudge} className={'xrf-signin' + (nudge ? ' on' : '')} initial={nudge ? { x: -6 } : false} animate={{ x: 0 }} transition={{ duration: 0.3, ease: EASE }} aria-live="polite">Sign in and your link, and everyone it brings, is here.</motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="xrf-hero" aria-labelledby="xrf-h1">
      <div className="xp-wrap xp-grid">
        <div className="xrf-words">
          <LineReveal as="h1" id="xrf-h1" className="xp-display md" lines={['Bring a builder', 'to Hanzo.']} />
          <div className="xrf-rest">
            <p className="xp-lede xrf-lede">One link counts everyone who signs up through it, and who goes on to use Hanzo.</p>
            <div className="xrf-acts">
              <Cta to="/signup?next=%2Freferral" id="referral.hero" thumb className="xp-cta">Get your link</Cta>
              <Cta to="/login?next=%2Freferral" kind="quiet" id="referral.signin" className="xp-ghost">Sign in</Cta>
            </div>
            <p className="xp-kick plain xrf-cap">Referrals</p>
          </div>
        </div>
        <div className="xrf-card"><Card /></div>
      </div>
    </section>
  );
}

/* One rail. Runs by itself (rAF), faster while you scroll, pauses with the section's control, stops off screen, and
   freezes under reduced motion. `lit` marks the word nearest the middle of the screen. */
function Run({ dir = 1, speed = 40, paused, lit, children }) {
  const run = useRef(null);
  const calm = useReducedMotion();
  useEffect(() => {
    const el = run.current; if (!el || calm) return;
    let x = 0, last = performance.now(), boost = 0, lastY = scrollY, vis = true, raf = 0, prev = null;
    const io = new IntersectionObserver(([e]) => { vis = e.isIntersecting; });
    io.observe(el);
    const onScroll = () => { boost = Math.min(boost + Math.abs(scrollY - lastY) * 0.9, 900); lastY = scrollY; };
    addEventListener('scroll', onScroll, { passive: true });
    const tick = (t) => {
      const dt = Math.min(t - last, 64) / 1000; last = t;
      if (vis && !paused.current) {
        const half = el.scrollWidth / 2;
        x = (x + dir * (speed + boost) * dt) % half;
        el.style.transform = `translate3d(${dir > 0 ? -x : -(half + x) % half}px,0,0)`;
        if (lit) {
          const mid = innerWidth / 2; let best = null, d = 1e9;
          for (const c of el.children) { const r = c.getBoundingClientRect(); const k = Math.abs(r.left + r.width / 2 - mid); if (k < d) { d = k; best = c; } }
          if (best !== prev) { prev?.removeAttribute('data-lit'); best?.setAttribute('data-lit', ''); prev = best; }
        }
      }
      boost *= 0.92;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); io.disconnect(); removeEventListener('scroll', onScroll); };
  }, [calm, dir, speed, lit, paused]);
  return <div className="xrf-run" ref={run}>{children}</div>;
}

/* Every way out: one big rail of the ways, a small rail of the link, a medium rail of the counts. */
function Rails() {
  const [off, setOff] = useState(false);
  const paused = useRef(false);
  paused.current = off;
  const row = (k) => WAYS.map((w) => <span key={k + w} className="xrf-rw">{w}<i aria-hidden="true" /></span>);
  return (
    <section className="xrf-rails" aria-label="Every way out carries your link" data-off={off ? '' : undefined}>
      <div className="xp-wrap xrf-rails-bar">
        <button type="button" className="xrf-pause" aria-pressed={off} aria-label={off ? 'Play' : 'Pause'} data-sound="tick" onClick={() => setOff((v) => !v)}>
          <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">{off ? <path d="M5 3.5v9l7-4.5z" fill="currentColor" /> : <path d="M5 3.5v9M11 3.5v9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />}</svg>
        </button>
      </div>
      <div className="xrf-rail sm" aria-hidden="true"><Run dir={-1} speed={28} paused={paused}>{[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((k) => <span key={k} className="xrf-rl x-mono">hanzo.ai/?ref=…</span>)}</Run></div>
      <div className="xrf-rail lg" aria-hidden="true"><Run dir={1} speed={46} paused={paused} lit>{row('a')}{row('b')}</Run></div>
      <div className="xrf-rail md" aria-hidden="true"><Run dir={-1} speed={34} paused={paused}>{COUNTS.concat(COUNTS, COUNTS, COUNTS, COUNTS, COUNTS).map((c, k) => <span key={k} className="xrf-rc">{c}<i aria-hidden="true">→</i></span>)}</Run></div>
    </section>
  );
}

/* The four steps as one object that happens. */
function Scene({ k }) {
  const draw = (d = 0) => ({ initial: { pathLength: 0 }, animate: { pathLength: 1 }, transition: { duration: 0.8, ease: EASE, delay: d } });
  const ways = WAYS.map((w, i) => { const y = 34 + i * 34; return { w, y }; });
  return (
    <svg viewBox="0 0 400 280" className="xrf-scene" aria-hidden="true">
      {k === 'share' && <g key="share">
        <rect x="18" y="122" width="132" height="36" rx="18" className="xrf-s-pill" />
        <text x="84" y="145" textAnchor="middle" className="xrf-s-mono">?ref=…</text>
        {ways.map(({ w, y }, i) => <g key={w}>
          <motion.path d={`M150 140 C 210 140, 220 ${y}, 270 ${y}`} className="xrf-s-line" {...draw(0.08 * i)} />
          <motion.circle cx="274" cy={y} r="4" className="xrf-s-dot" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.3, ease: EASE, delay: 0.5 + 0.08 * i }} />
          <motion.text x="286" y={y + 5} className="xrf-s-txt" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.55 + 0.08 * i }}>{w}</motion.text>
        </g>)}
      </g>}
      {k === 'lock' && <g key="lock">
        <rect x="30" y="122" width="132" height="36" rx="18" className="xrf-s-pill" />
        <text x="96" y="145" textAnchor="middle" className="xrf-s-mono">?ref=…</text>
        <motion.g initial={{ x: 80 }} animate={{ x: 0 }} transition={{ duration: 0.9, ease: EASE }}>
          <circle cx="318" cy="140" r="30" className="xrf-s-ink" />
          <circle cx="318" cy="132" r="9" className="xrf-s-hole" />
          <path d="M302 160a16 12 0 0 1 32 0" className="xrf-s-hole" />
        </motion.g>
        <motion.path d="M162 140H288" className="xrf-s-line thick" {...draw(0.6)} />
        <motion.path d="M214 140v-10a11 11 0 0 1 22 0v10M208 138h34v20h-34z" className="xrf-s-line" {...draw(1.1)} />
      </g>}
      {k === 'meter' && <g key="meter">
        <path d="M80 220a120 120 0 0 1 240 0" className="xrf-s-track" />
        <motion.path d="M80 220a120 120 0 0 1 240 0" className="xrf-s-line thick" {...draw(0)} />
        {[0, 1, 2, 3, 4, 5, 6].map((i) => { const a = Math.PI - (i / 6) * Math.PI; return <path key={i} d={`M${200 + Math.cos(a) * 104} ${220 - Math.sin(a) * 104}L${200 + Math.cos(a) * 92} ${220 - Math.sin(a) * 92}`} className="xrf-s-tick" />; })}
        <motion.g style={{ originX: '200px', originY: '220px' }} initial={{ rotate: -90 }} animate={{ rotate: 50 }} transition={{ duration: 1.2, ease: EASE, delay: 0.3 }}>
          <path d="M200 220V128" className="xrf-s-needle" />
        </motion.g>
        <circle cx="200" cy="220" r="8" className="xrf-s-ink" />
      </g>}
      {k === 'up' && <g key="up">
        {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x="90" y={28 + i * 40} width="220" height="28" rx="14" className="xrf-s-bar" />)}
        <motion.rect x="90" width="220" height="28" rx="14" className="xrf-s-ink" initial={{ y: 228 }} animate={{ y: 68 }} transition={{ duration: 1.4, ease: EASE, delay: 0.3 }} />
        <motion.path d="M340 220V80M330 92l10-12 10 12" className="xrf-s-line" {...draw(0.3)} />
      </g>}
    </svg>
  );
}

function How() {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.45 });
  const calm = useReducedMotion();
  const [i, setI] = useState(calm ? 3 : 0);
  const [auto, setAuto] = useState(!calm);
  useEffect(() => {
    if (!seen || !auto || calm) return;
    if (i >= STEPS.length - 1) { setAuto(false); return; }
    const t = setTimeout(() => setI((v) => v + 1), 2600);
    return () => clearTimeout(t);
  }, [seen, auto, i, calm]);
  const pick = (n) => { setAuto(false); setI(n); };
  return (
    <section className="xp-sec xrf-how" aria-labelledby="xrf-how-h">
      <div className="xp-wrap xp-grid">
        <div className="xrf-how-l">
          <h2 id="xrf-how-h" className="xp-head">How it works</h2>
          <ol className="xrf-steps" role="tablist" aria-label="How it works" aria-orientation="vertical">
            {STEPS.map(([t, k], n) => (
              <li key={k} role="presentation">
                <button type="button" role="tab" id={'xrf-t-' + k} aria-selected={n === i} aria-controls="xrf-stage" tabIndex={n === i ? 0 : -1} data-sound="tick"
                  className={'xrf-step' + (n === i ? ' on' : '') + (n < i ? ' done' : '')} onClick={() => pick(n)}
                  onKeyDown={(e) => { if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); pick((n + 1) % 4); e.currentTarget.parentElement.parentElement.children[(n + 1) % 4].firstChild.focus(); } if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); pick((n + 3) % 4); e.currentTarget.parentElement.parentElement.children[(n + 3) % 4].firstChild.focus(); } }}>
                  <span className="xrf-n x-mono">{String(n + 1).padStart(2, '0')}</span>
                  <span className="xp-title">{t}</span>
                  <i className="xrf-bar" aria-hidden="true" data-run={n === i && auto && seen ? '' : undefined} />
                </button>
              </li>
            ))}
          </ol>
        </div>
        <div className="xrf-stage" id="xrf-stage" role="tabpanel" aria-labelledby={'xrf-t-' + STEPS[i][1]} ref={ref}>
          {seen ? <Scene key={i} k={STEPS[i][1]} /> : <svg viewBox="0 0 400 280" className="xrf-scene" aria-hidden="true" />}
          <span className="xp-count xrf-of">{String(i + 1).padStart(2, '0')} / 04</span>
        </div>
      </div>
    </section>
  );
}

const SIDES = [
  ['Referral', [['Pays', 'A referral pays nothing.'], ['Moves', 'Each one moves you up the beta waitlist.'], ['Counts', 'It qualifies with its first metered spend.']]],
  ['Affiliate', [['Pays', 'Affiliates are paid on what their referrals spend.'], ['Joins', 'Apply to become an affiliate.'], ['Terms', 'The terms are agreed with each affiliate we approve.']]],
];

/* Referral or affiliate, side by side (the one dark room). Its caption sits under the heading, never above it. */
function Which() {
  return (
    <section className="xp-sec xp-dark xrf-which" data-room="dark" aria-labelledby="xrf-which-h">
      <div className="xp-wrap">
        <h2 id="xrf-which-h" className="xp-display sm xrf-which-h">A referral pays nothing. <span><A to="/affiliate">Affiliates</A> are paid on what their referrals spend.</span></h2>
        <p className="xp-kick plain xrf-which-k">Referral or affiliate</p>
        <div className="xrf-sides">
          {SIDES.map(([k, rows], j) => (
            <div key={k} className={'xrf-side s' + j}>
              <h3 className="xp-title">{k}</h3>
              <dl>
                {rows.map(([l, t]) => <div key={l}><dt className="x-mono">{l}</dt><dd>{t}</dd></div>)}
              </dl>
              {j === 1 && <A to="/affiliate" className="xrf-more">Affiliates</A>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Referral() {
  return (
    <main className="xp xrf">
      <Hero />
      <Rails />
      <How />
      <Which />
    </main>
  );
}
