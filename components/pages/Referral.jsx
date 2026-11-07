'use client';
/* Referrals.
   Persona: a builder already on Hanzo who wants to bring a friend or teammate. Goal: get their referral link.
   CTA: "Get your link" (/signup?next=/referral; data-cta referral.hero, referral.close; thumb). Metric: signup_start.
   Signature: the counts in motion: Referred → Pending → Qualified run past at display size, the word nearest the middle
   lit in ink, over a small rail of the link; the rails speed up as you scroll (a marquee that answers the scroll) and
   have a pause control.
   Beyond: the four steps as one object that happens: Share fans the link out every way, Signs up locks one account to
   it, Qualifies swings the first metered spend, Moves up lifts you through the waitlist. It runs once, then rests; pick
   any step to replay it.
   Supporting (3): the line-masked h1 (arrival); hanzo.ai's own signed-out card with one builder riding in, once, from
   the link through the three counts (time); the dark room opening from a rounded card to full width, with what each
   referral pays drawn as two tracks (scroll, idle).
   One thing in, one out: the card is the link and its counts; the rails are the counts moving; the stage is the steps;
   the dark room is the one difference (pays nothing, paid on spend); the close is the sign-in line and the ask.
   Scale: the h1 at 52 is the first screen's one big thing; the counts rail 84 over the link at 17; step titles 21;
   the dark room's two sentences 44; the close 26.
   V2: 8/10 each section shows one facet once (card, counts rail, stepping stage, two pay tracks, the close); only
   Hanzo's words; the dark room opens from a card; one ask in one wording at every width; deck greys only.
   Every word is Hanzo's; no figure is shown that Hanzo does not show. */
import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { A, Cta } from '../kit';
import LineReveal from '../v2/LineReveal';
import '../v2/ProgramScale.css';
import './Referral.css';

const EASE = [0.16, 1, 0.3, 1];
const SIGNUP = '/signup?next=%2Freferral';
const LOGIN = '/login?next=%2Freferral';
const COUNTS = ['Referred', 'Pending', 'Qualified'];
const STEPS = [
  ['Share it anywhere: every way out carries your link.', 'share'],
  ['An account that signs up through it is yours, once and for good.', 'lock'],
  ['It qualifies with its first metered spend.', 'meter'],
  ['Each one moves you up the beta waitlist.', 'up'],
];

/* Phones: Hanzo's header carries this page's ask in the same words, as it does on desktop (components/Ask.jsx does it
   above 700px; see docs/requests/referral.md). Quiet while the hero's ask is on screen, then "Get your link". */
function usePhoneHeaderAsk() {
  useEffect(() => {
    const mq = matchMedia('(max-width: 700px)');
    const H = document.documentElement;
    let btn = null, text = '', link = '', io = null;
    const undo = () => {
      io?.disconnect(); io = null;
      if (btn) { btn.textContent = text; btn.setAttribute('href', link); btn.removeAttribute('data-ask-hide'); btn.removeAttribute('data-cta'); }
      if (H.dataset.ask === 'quiet') delete H.dataset.ask;
      btn = null;
    };
    const start = () => {
      undo();
      const own = document.querySelector('main [data-cta="referral.hero"]');
      if (!mq.matches || !own) return;
      btn = document.querySelector('header[data-slot=masthead] a[data-x-ask], header[data-slot=masthead] a[href="https://hanzo.ai/signup"]');
      if (!btn) return;
      text = btn.dataset.xAsk || btn.textContent; link = btn.dataset.xHref || btn.getAttribute('href');
      const label = own.getAttribute('data-thumb'), href = own.getAttribute('href');
      io = new IntersectionObserver(([e]) => {
        if (!btn) return;
        if (e.isIntersecting) { H.dataset.ask = 'quiet'; btn.textContent = text; btn.setAttribute('href', link); btn.removeAttribute('data-ask-hide'); btn.removeAttribute('data-cta'); }
        else { delete H.dataset.ask; btn.textContent = label; btn.setAttribute('href', href); btn.setAttribute('data-ask-hide', ''); btn.setAttribute('data-cta', 'header-ask'); }
      }, { rootMargin: '-60px 0px 0px 0px' });
      io.observe(own);
    };
    const t = setTimeout(start, 300);
    mq.addEventListener('change', start);
    return () => { clearTimeout(t); mq.removeEventListener('change', start); undo(); };
  }, []);
}

/* hanzo.ai's own signed-out card. One builder rides in from the link, once, and lands in each count in turn. */
function Card({ onCopy }) {
  const calm = useReducedMotion();
  const [at, setAt] = useState(calm ? 3 : -1);
  const [nudge, setNudge] = useState(0);
  useEffect(() => {
    if (calm) { setAt(3); return; }
    const t = [900, 2300, 3700, 5100].map((ms, i) => setTimeout(() => setAt(i), ms));
    return () => t.forEach(clearTimeout);
  }, [calm]);
  return (
    <div className="xrf-win xp-obj" data-slot="referral">
      <div className="xrf-win-top"><i /><i /><i /><span className="x-mono">Your referral link</span></div>
      <div className="xrf-win-in">
        <div className={'xrf-link' + (at >= 0 ? ' sent' : '') + (nudge % 2 ? ' nudge' : nudge ? ' nudge2' : '')}>
          <span className="x-mono xrf-url">hanzo.ai/?ref=…</span>
          <button type="button" className="xrf-copy" aria-disabled="true" aria-label="Copy link" aria-describedby="xrf-signin" data-sound="tick" onClick={() => { setNudge((n) => n + 1); onCopy(); }}>
            <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><rect x="5" y="5" width="8.5" height="8.5" rx="2" fill="none" stroke="currentColor" strokeWidth="1.4" /><path d="M10.5 3.2V3a.8.8 0 0 0-.8-.8H3a.8.8 0 0 0-.8.8v6.7c0 .44.36.8.8.8h.2" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
            Copy
          </button>
        </div>
        <div className="xrf-counts" data-at={at}>
          <i className="xrf-rider" aria-hidden="true" data-on={at >= 1 ? '' : undefined} />
          {COUNTS.map((c, i) => (
            <div key={c} className={'xrf-count' + (at === i + 1 || (at === 3 && i === 2) ? ' lit' : '') + (at > i + 1 ? ' past' : '')}><span className="x-mono">—</span><span>{c}</span></div>
          ))}
        </div>
        <i className="xrf-flow" aria-hidden="true">{[0, 1, 2, 3, 4].map((k) => <b key={k} style={{ '--k': k }} />)}</i>
        <p className="xrf-q">An account qualifies with its first metered spend.</p>
      </div>
    </div>
  );
}

function Hero() {
  const [pulse, setPulse] = useState(0);
  return (
    <section className="xrf-hero" aria-labelledby="xrf-h1">
      <div className="xp-wrap xp-grid">
        <div className="xrf-words">
          <LineReveal as="h1" id="xrf-h1" className="xp-display md" lines={['Bring a builder', 'to Hanzo.']} />
          <div className="xrf-rest">
            <p className="xp-lede xrf-lede">One link counts everyone who signs up through it, and who goes on to use Hanzo.</p>
            <div className="xrf-acts">
              <Cta to={SIGNUP} id="referral.hero" thumb className="xp-cta">Get your link</Cta>
              <Cta to={LOGIN} kind="quiet" id="referral.signin" className={'xp-ghost xrf-si' + (pulse ? ' pulse p' + (pulse % 2) : '')}>Sign in</Cta>
            </div>
            <p className="xp-kick plain xrf-cap">Referrals</p>
          </div>
        </div>
        <div className="xrf-card"><Card onCopy={() => setPulse((n) => n + 1)} /></div>
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
        x = (x + (speed + boost) * dt) % half;
        el.style.transform = `translate3d(${dir > 0 ? -x : x - half}px,0,0)`;
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

/* The counts, moving: one big rail of Referred → Pending → Qualified over a small rail of the link. */
function Rails() {
  const [off, setOff] = useState(false);
  const paused = useRef(false);
  paused.current = off;
  const counts = Array.from({ length: 8 }, () => COUNTS).flat();
  return (
    <section className="xrf-rails" aria-label="Referred, Pending, Qualified" data-off={off ? '' : undefined}>
      <div className="xp-wrap xrf-rails-bar">
        <button type="button" className="xrf-pause" aria-pressed={off} aria-label={off ? 'Play' : 'Pause'} data-sound="tick" onClick={() => setOff((v) => !v)}>
          <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">{off ? <path d="M5 3.5v9l7-4.5z" fill="currentColor" /> : <path d="M5 3.5v9M11 3.5v9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />}</svg>
        </button>
      </div>
      <div className="xrf-rail lg" aria-hidden="true"><Run dir={1} speed={46} paused={paused} lit>{counts.map((c, k) => <span key={k} className="xrf-rw">{c}<i aria-hidden="true">→</i></span>)}</Run></div>
      <div className="xrf-rail sm" aria-hidden="true"><Run dir={-1} speed={28} paused={paused}>{Array.from({ length: 12 }, (_, k) => <span key={k} className="xrf-rl x-mono">hanzo.ai/?ref=…</span>)}</Run></div>
    </section>
  );
}

/* The four steps as one object that happens. Wordless drawings: the step's own sentence sits beside it. */
function Scene({ k }) {
  const draw = (d = 0) => ({ initial: { pathLength: 0 }, animate: { pathLength: 1 }, transition: { duration: 0.8, ease: EASE, delay: d } });
  return (
    <svg viewBox="0 0 400 280" className="xrf-scene" aria-hidden="true">
      {k === 'share' && <g key="share">
        <rect x="30" y="122" width="132" height="36" rx="18" className="xrf-s-pill" />
        <text x="96" y="146" textAnchor="middle" className="xrf-s-mono">?ref=…</text>
        {Array.from({ length: 9 }, (_, i) => { const y = 24 + i * 29; return <g key={i}>
          <motion.path d={`M162 140 C 230 140, 240 ${y}, 330 ${y}`} className="xrf-s-line" {...draw(0.07 * i)} />
          <motion.circle cx="336" cy={y} r="6" className="xrf-s-dot" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.3, ease: EASE, delay: 0.5 + 0.07 * i }} />
        </g>; })}
      </g>}
      {k === 'lock' && <g key="lock">
        <rect x="30" y="122" width="132" height="36" rx="18" className="xrf-s-pill" />
        <text x="96" y="146" textAnchor="middle" className="xrf-s-mono">?ref=…</text>
        <motion.g initial={{ x: 80 }} animate={{ x: 0 }} transition={{ duration: 0.9, ease: EASE }}>
          <circle cx="318" cy="140" r="30" className="xrf-s-ink" />
          <circle cx="318" cy="132" r="9" className="xrf-s-hole" />
          <path d="M302 160a16 12 0 0 1 32 0" className="xrf-s-hole" />
        </motion.g>
        <motion.path d="M162 140H288" className="xrf-s-line thick" {...draw(0.6)} />
        <motion.path d="M214 140v-10a11 11 0 0 1 22 0v10M208 138h34v20h-34z" className="xrf-s-line lockd" {...draw(1.1)} />
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
  const pick = (n, e) => {
    setAuto(false); setI(n);
    if (e) e.currentTarget.closest('ol').querySelectorAll('[role=tab]')[n].focus();
  };
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
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); pick((n + 1) % 4, e); }
                    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); pick((n + 3) % 4, e); }
                  }}>
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

/* The one difference, as the dark room: Hanzo's two sentences, each over its own track. Builders ride both; the
   referral track never fills, the affiliate track fills with what they spend. The room enters as a rounded card inside
   the gutters and opens to full width as it is reached. */
function Which() {
  const box = useRef(null);
  const calm = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: box, offset: ['start end', 'start 0.25'] });
  const g = useTransform(scrollYProgress, [0, 1], calm ? ['0px', '0px'] : ['32px', '0px']);
  const r = useTransform(scrollYProgress, [0, 1], calm ? ['0px', '0px'] : ['24px', '0px']);
  const clip = useTransform([g, r], ([a, b]) => `inset(0 ${a} round ${b})`);
  const seen = useInView(box, { once: true, amount: 0.35 });
  return (
    <section className="xrf-which" ref={box} aria-labelledby="xrf-which-h">
      <motion.div className="xp-sec xp-dark xrf-which-in" data-room="dark" style={{ clipPath: clip }}>
        <div className="xp-wrap">
          <h2 id="xrf-which-h" className="xp-display sm xrf-which-h">
            <span className="xrf-half a">A referral pays nothing. </span>
            <span className="xrf-half b"><A to="/affiliate">Affiliates</A> are paid on what their referrals spend.</span>
          </h2>
          <div className={'xrf-tracks' + (seen ? ' on' : '')} aria-hidden="true">
            <div className="xrf-track a"><i className="xrf-fill" />{[0, 1, 2].map((k) => <b key={k} style={{ '--k': k }} />)}<em /></div>
            <div className="xrf-track b"><i className="xrf-fill" />{[0, 1, 2].map((k) => <b key={k} style={{ '--k': k }} />)}<em /></div>
          </div>
          <A to="/affiliate" className="xrf-more">Affiliates</A>
        </div>
      </motion.div>
    </section>
  );
}

/* The close: the sign-in line from hanzo.ai's card, and the one ask again. */
function Close() {
  return (
    <section className="xp-sec xrf-close" aria-labelledby="xrf-signin">
      <div className="xp-wrap xrf-close-in">
        <p id="xrf-signin" className="xp-head xrf-signin" role="heading" aria-level="2">Sign in and your link, and everyone it brings, is here.</p>
        <div className="xrf-acts">
          <Cta to={SIGNUP} id="referral.close" className="xp-cta">Get your link</Cta>
          <Cta to={LOGIN} kind="link" id="referral.close-signin">Sign in</Cta>
        </div>
      </div>
    </section>
  );
}

export default function Referral() {
  usePhoneHeaderAsk();
  return (
    <main className="xp xrf">
      <Hero />
      <Rails />
      <How />
      <Which />
      <Close />
    </main>
  );
}
