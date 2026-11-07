'use client';
/* Referrals.
   Persona: a builder already on Hanzo who wants to bring a friend or teammate. Goal: get their referral link.
   CTA: "Get your link" (/signup?next=/referral; data-cta referral.hero, referral.close; thumb). Metric: signup_start.
   Signature: one referral's journey. A pinned screen where a single builder leaves your link (shown once) and travels
   Referred → Pending → Qualified as you scroll: one word at display size at a time, cut in by line mask, the rider
   on its track below. On phones (no pin under 900px) the same journey plays once by itself when it is reached.
   Beyond: the four steps as one continuous strip under their four sentences: the link fans out, one account locks to
   it, the needle swings, the bar rises. It runs once, then rests; pick any step to replay its drawing.
   Supporting (3): the line-masked h1 (arrival); hanzo.ai's own signed-out card with one builder riding in, once, from
   the link through the three counts (time); the dark room opening from a rounded card to full width, with what each
   referral pays drawn as two tracks (scroll, idle).
   One thing in, one out: the card is the link and its counts; the journey is one referral moving; the strip is the
   steps; the dark room is the one difference; the close is the card at rest beside the sign-in line and the ask.
   Scale: the h1 at 52 is the first screen's one big thing; the journey's one word at 112 over a 17px link pill;
   step titles 17; the dark room's two sentences 44; the close 26 beside a small card.
   V2: 8/10 the journey is one referral at a time, not a tiled marquee; the steps are one strip, not a list and a box;
   the close ends on the card you get; the dark room never crops its text on phones; one solid ask at a time.
   Every word is Hanzo's; no figure is shown that Hanzo does not show. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion, useScroll, useTransform, useMotionValueEvent } from 'motion/react';
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

function useWide() {
  const [wide, setWide] = useState(true);
  useEffect(() => {
    const mq = matchMedia('(min-width: 900px)');
    const on = () => setWide(mq.matches);
    on(); mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return wide;
}

/* Phones: Hanzo's header carries this page's ask in the same words, as it does on desktop (components/Ask.jsx does it
   above 700px; see docs/requests/referral.md). */
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
      const close = document.querySelector('main [data-cta="referral.close"]');
      if (!mq.matches || !own) return;
      btn = document.querySelector('header[data-slot=masthead] a[data-x-ask], header[data-slot=masthead] a[href="https://hanzo.ai/signup"]');
      if (!btn) return;
      text = btn.dataset.xAsk || btn.textContent; link = btn.dataset.xHref || btn.getAttribute('href');
      const label = own.getAttribute('data-thumb'), href = own.getAttribute('href');
      const vis = new Map();
      // the hero's ask on screen: quiet "Try Hanzo"; past it: solid "Get your link"; the closing ask on screen: quiet
      // "Get your link" (one solid fill at a time, as Ask.jsx does on desktop)
      io = new IntersectionObserver((list) => {
        if (!btn) return;
        list.forEach((e) => vis.set(e.target, e.isIntersecting));
        const hero = vis.get(own), end = close && vis.get(close);
        if (hero) { H.dataset.ask = 'quiet'; btn.textContent = text; btn.setAttribute('href', link); btn.removeAttribute('data-ask-hide'); btn.removeAttribute('data-cta'); return; }
        btn.textContent = label; btn.setAttribute('href', href); btn.setAttribute('data-ask-hide', ''); btn.setAttribute('data-cta', 'header-ask');
        if (end) H.dataset.ask = 'quiet'; else delete H.dataset.ask;
      }, { rootMargin: '-60px 0px 0px 0px' });
      io.observe(own);
      if (close) io.observe(close);
    };
    const t = setTimeout(start, 300);
    mq.addEventListener('change', start);
    return () => { clearTimeout(t); mq.removeEventListener('change', start); undo(); };
  }, []);
}

/* hanzo.ai's own signed-out card. One builder rides in from the link, once, and lands in each count in turn.
   `rest`: already landed (the close); `small`: the close's size. */
function Card({ onCopy, rest, small }) {
  const calm = useReducedMotion() || rest;
  const [at, setAt] = useState(calm ? 3 : -1);
  const [nudge, setNudge] = useState(0);
  useEffect(() => {
    if (calm) { setAt(3); return; }
    const t = [900, 2300, 3700, 5100].map((ms, i) => setTimeout(() => setAt(i), ms));
    return () => t.forEach(clearTimeout);
  }, [calm]);
  return (
    <div className={'xrf-win xp-obj' + (small ? ' small' : '')} data-slot={small ? undefined : 'referral'}>
      <div className="xrf-win-top"><i /><i /><i /><span className="x-mono">Your referral link</span></div>
      <div className="xrf-win-in">
        <div className={'xrf-link' + (at >= 0 ? ' sent' : '') + (nudge % 2 ? ' nudge' : nudge ? ' nudge2' : '')}>
          <span className="x-mono xrf-url">hanzo.ai/?ref=…</span>
          <button type="button" className="xrf-copy" aria-disabled="true" aria-label="Copy link" aria-describedby="xrf-signin" data-sound="tick" onClick={() => { setNudge((n) => n + 1); onCopy?.(); }}>
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
        {!small && <i className="xrf-flow" aria-hidden="true">{[0, 1, 2, 3, 4].map((k) => <b key={k} style={{ '--k': k }} />)}</i>}
        {!small && <p className="xrf-q">An account qualifies with its first metered spend.</p>}
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

/* One referral's journey: the link once, one builder, one word big at a time. Pinned and scrubbed on wide screens;
   on phones it plays once by itself when reached; reduced motion shows it landed. */
function Journey() {
  const box = useRef(null);
  const wide = useWide();
  const calm = useReducedMotion();
  const seen = useInView(box, { once: true, amount: 0.5 });
  const { scrollYProgress } = useScroll({ target: box, offset: ['start start', 'end end'] });
  const [i, setI] = useState(calm ? 2 : 0);
  const [t, setT] = useState(calm ? 1 : 0);
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    if (!wide || calm) return;
    const k = Math.min(1, Math.max(0, (p - 0.08) / 0.8));
    setT(k); setI(Math.round(k * 2));
  });
  useEffect(() => {
    if (wide || calm || !seen) return;
    const ts = [[0, 0], [1100, 0.5], [2400, 1]].map(([ms, k], n) => setTimeout(() => { setI(n); setT(k); }, ms + 300));
    return () => ts.forEach(clearTimeout);
  }, [wide, calm, seen]);
  return (
    <section className="xrf-jour" ref={box} aria-label="Referred, Pending, Qualified">
      <div className="xrf-jour-pin">
        <div className="xp-wrap xrf-jour-in">
          <div className="xrf-jour-word" aria-hidden="true">
            <AnimatePresence initial={false}>
              <motion.span key={i} className="xrf-jour-w" initial={{ y: '105%' }} animate={{ y: 0 }} exit={{ y: '-105%' }} transition={{ duration: 0.7, ease: EASE }}>{COUNTS[i]}</motion.span>
            </AnimatePresence>
          </div>
          <div className="xrf-jour-track" aria-hidden="true">
            <span className="x-mono xrf-jour-pill">hanzo.ai/?ref=…</span>
            <div className="xrf-jour-line">
              <i className="xrf-jour-fill" style={{ transform: `scaleX(${t})` }} />
              {COUNTS.map((c, n) => <b key={c} className={'xrf-jour-stop' + (t >= n / 2 - 0.01 ? ' on' : '')} style={{ left: `${n * 50}%` }} />)}
              <em className="xrf-jour-rider" style={{ left: `${t * 100}%` }} />
            </div>
          </div>
          <span className="xp-count xrf-jour-of">{String(i + 1).padStart(2, '0')} / 03</span>
        </div>
      </div>
    </section>
  );
}

/* The four steps' drawings, wordless; each sentence sits above its own. */
function Scene({ k }) {
  const draw = (d = 0) => ({ initial: { pathLength: 0 }, animate: { pathLength: 1 }, transition: { duration: 0.8, ease: EASE, delay: d } });
  return (
    <svg viewBox="0 0 400 280" className="xrf-scene" aria-hidden="true">
      {k === 'share' && <g>
        <rect x="30" y="122" width="132" height="36" rx="18" className="xrf-s-pill" />
        <text x="96" y="146" textAnchor="middle" className="xrf-s-mono">?ref=…</text>
        {Array.from({ length: 9 }, (_, i) => { const y = 24 + i * 29; return <g key={i}>
          <motion.path d={`M162 140 C 230 140, 240 ${y}, 330 ${y}`} className="xrf-s-line" {...draw(0.07 * i)} />
          <motion.circle cx="336" cy={y} r="6" className="xrf-s-dot" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.3, ease: EASE, delay: 0.5 + 0.07 * i }} />
        </g>; })}
      </g>}
      {k === 'lock' && <g>
        <motion.path d="M20 140H288" className="xrf-s-line thick" {...draw(0.3)} />
        <motion.g initial={{ x: 80 }} animate={{ x: 0 }} transition={{ duration: 0.9, ease: EASE }}>
          <circle cx="318" cy="140" r="30" className="xrf-s-ink" />
          <circle cx="318" cy="132" r="9" className="xrf-s-hole" />
          <path d="M302 160a16 12 0 0 1 32 0" className="xrf-s-hole" />
        </motion.g>
        <rect x="134" y="118" width="44" height="40" rx="6" className="xrf-s-paper" />
        <motion.path d="M145 130v-8a11 11 0 0 1 22 0v8M139 130h34v24h-34z" className="xrf-s-line" {...draw(0.9)} />
      </g>}
      {k === 'meter' && <g>
        <path d="M80 220a120 120 0 0 1 240 0" className="xrf-s-track" />
        <motion.path d="M80 220a120 120 0 0 1 240 0" className="xrf-s-line thick" {...draw(0)} />
        {[0, 1, 2, 3, 4, 5, 6].map((i) => { const a = Math.PI - (i / 6) * Math.PI; return <path key={i} d={`M${200 + Math.cos(a) * 104} ${220 - Math.sin(a) * 104}L${200 + Math.cos(a) * 92} ${220 - Math.sin(a) * 92}`} className="xrf-s-tick" />; })}
        <motion.g style={{ originX: '200px', originY: '220px' }} initial={{ rotate: -90 }} animate={{ rotate: 50 }} transition={{ duration: 1.2, ease: EASE, delay: 0.3 }}>
          <path d="M200 220V128" className="xrf-s-needle" />
        </motion.g>
        <circle cx="200" cy="220" r="8" className="xrf-s-ink" />
      </g>}
      {k === 'up' && <g>
        {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x="90" y={28 + i * 40} width="220" height="28" rx="14" className="xrf-s-bar" />)}
        <motion.rect x="90" width="220" height="28" rx="14" className="xrf-s-ink" initial={{ y: 228 }} animate={{ y: 68 }} transition={{ duration: 1.4, ease: EASE, delay: 0.3 }} />
        <motion.path d="M340 220V80M330 92l10-12 10 12" className="xrf-s-line" {...draw(0.3)} />
      </g>}
    </svg>
  );
}

/* One step: its sentence over its drawing. On phones (stacked, no strip) each drawing plays when it is reached. */
function Step({ n, t, k, i, run, wide, onPick, onSeen }) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.6 });
  useEffect(() => { if (seen && !wide) onSeen(); }, [seen, wide]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <li className={'xrf-st' + (n <= i ? ' on' : '') + (n === i ? ' now' : '')}>
      <button type="button" className="xrf-step" aria-pressed={n === i} data-sound="tick" onClick={() => onPick(n)}>
        <span className="xrf-n x-mono">{String(n + 1).padStart(2, '0')}</span>
        <span className="xrf-st-t">{t}</span>
      </button>
      <div className="xrf-st-art" ref={ref}>
        {n <= i ? <Scene key={run} k={k} /> : <svg viewBox="0 0 400 280" className="xrf-scene" aria-hidden="true"><path d="M20 140H380" className="xrf-s-wait" /></svg>}
      </div>
    </li>
  );
}

/* The four steps as one strip: four sentences in a row, each over its drawing, one hairline running through all four.
   The strip draws itself step by step once it is reached, then rests; press a step to replay its drawing. */
function How() {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.35 });
  const calm = useReducedMotion();
  const [i, setI] = useState(calm ? 3 : -1);
  const [auto, setAuto] = useState(!calm);
  const [runs, setRuns] = useState([0, 0, 0, 0]);
  const wide = useWide();
  useEffect(() => {
    if (!seen || !auto || calm || !wide) return;
    if (i >= STEPS.length - 1) { setAuto(false); return; }
    const t = setTimeout(() => setI((v) => v + 1), i < 0 ? 200 : 2200);
    return () => clearTimeout(t);
  }, [seen, auto, i, calm]);
  const pick = (n) => { setAuto(false); setI((v) => Math.max(v, n)); setRuns((r) => r.map((x, j) => (j === n ? x + 1 : x))); };
  return (
    <section className="xp-sec xrf-how" aria-labelledby="xrf-how-h">
      <div className="xp-wrap">
        <h2 id="xrf-how-h" className="xp-head">How it works</h2>
        <ol className="xrf-strip" ref={ref}>
          {STEPS.map(([t, k], n) => (
            <Step key={k} n={n} t={t} k={k} i={i} run={runs[n]} wide={wide} onPick={pick} onSeen={() => setI((v) => Math.max(v, n))} />
          ))}
        </ol>
      </div>
    </section>
  );
}

/* The one difference, as the dark room: Hanzo's two sentences, each over its own track. Builders ride both; the
   referral track never fills, the affiliate track fills with what they spend. The room enters as a rounded card inside
   the gutters and opens to full width as it is reached (on phones from an 8px inset, inside the text's own margin). */
function Which() {
  const box = useRef(null);
  const calm = useReducedMotion();
  const wide = useWide();
  const { scrollYProgress } = useScroll({ target: box, offset: ['start end', 'start 0.25'] });
  const g0 = calm ? '0px' : wide ? '32px' : '8px';
  const g = useTransform(scrollYProgress, [0, 1], [g0, '0px']);
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
        </div>
      </motion.div>
    </section>
  );
}

/* The closing band: the card you get, at rest, beside the sign-in line from hanzo.ai's card and the one ask again. */
function Close() {
  return (
    <section className="xp-sec xrf-close" aria-labelledby="xrf-signin">
      <div className="xp-wrap xp-grid xrf-close-in">
        <div className="xrf-close-l">
          <p id="xrf-signin" className="xp-head xrf-signin" role="heading" aria-level="2">Sign in and your link, and everyone it brings, is here.</p>
          <div className="xrf-acts">
            <Cta to={SIGNUP} id="referral.close" className="xp-cta">Get your link</Cta>
            <Cta to={LOGIN} kind="link" id="referral.close-signin">Sign in</Cta>
          </div>
        </div>
        <div className="xrf-close-r"><Card rest small /></div>
      </div>
    </section>
  );
}

export default function Referral() {
  usePhoneHeaderAsk();
  return (
    <main className="xp xrf">
      <Hero />
      <Journey />
      <How />
      <Which />
      <Close />
    </main>
  );
}
