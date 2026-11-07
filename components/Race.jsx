'use client';
/* Home, speed (v2): the page's one dark room. It opens like a door: the room wipes from a rounded panel to the full
   screen as you scroll in. Each measurement is a hero figure, and beside it the race runs once at true speed (every bar
   grows at the same rate, so the faster one simply stops first). Replay runs it again. */
import { useEffect, useRef, useState } from 'react';
import { motion, animate, useInView, useMotionValue, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { EASE, Arrow, Count } from './ui';
import Lines from './v2/Lines';

function Lane({ t, max, who, ms, done, label, hi }) {
  const w = useTransform(t, (v) => Math.min(v, ms) / max);
  const live = useTransform(t, (v) => {
    const x = Math.min(v, ms);
    return x >= ms ? done : ms >= 1000 ? (x / 1000).toFixed(2) + ' s' : Math.round(x).toLocaleString('en-US') + ' ms';
  });
  const fin = useTransform(t, (v) => (v >= ms ? 1 : 0));
  return (
    <div className={'hv-lane' + (hi ? ' hi' : '')}>
      <div className="hv-lane-h">
        <span>{who}</span>
        <motion.span className="x-mono hv-lane-v">{label ? label : live}</motion.span>
      </div>
      <i className="hv-lane-track"><motion.b style={{ scaleX: w }} /><motion.em style={{ opacity: fin }} aria-hidden="true">✓</motion.em></i>
    </div>
  );
}

function Run({ kicker, big, decimals, cap, note, title, lanes, extra, link, flip }) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.5 });
  const calm = useReducedMotion();
  const max = Math.max(...lanes.map((l) => l.ms));
  const t = useMotionValue(0);
  const [runs, setRuns] = useState(0);
  useEffect(() => {
    if (!seen) return;
    if (calm) { t.set(max); return; }
    t.set(0);
    const c = animate(t, max, { duration: max / 1000, ease: 'linear' });
    return () => c.stop();
  }, [seen, runs]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <article className={'hv-run v2-grid' + (flip ? ' flip' : '')} ref={ref}>
      <div className="hv-run-fig">
        <p className="v2-kicker">{kicker}</p>
        <p className="v2-figure hv-run-big"><Count to={big} decimals={decimals} suffix="×" duration={1.4} /></p>
        <p className="v2-title hv-run-cap">{cap}</p>
        <p className="hv-run-note">{note}</p>
      </div>
      <div className="hv-run-data">
        <div className="hv-run-top">
          <p className="x-mono hv-run-title">{title}</p>
          <motion.button type="button" className="hv-replay" aria-label="Replay the race" onClick={() => setRuns((r) => r + 1)} whileTap={{ rotate: -360, scale: 0.9 }} transition={{ duration: 0.6, ease: EASE }}>
            <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true"><path d="M13 8a5 5 0 1 1-1.6-3.7M13 2.5v3h-3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </motion.button>
        </div>
        <div className="hv-lanes">{lanes.map((l) => <Lane key={l.who} t={t} max={max} {...l} />)}</div>
        {extra}
        <div className="hv-run-end">{link}</div>
      </div>
    </article>
  );
}

export default function Race() {
  const ref = useRef(null);
  // the door (reduced motion: Home.css keeps it open): a rounded panel inset from the page that opens to the full screen as it arrives
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start end', 'start 0.15'] });
  const clip = useTransform(p, (v) => { const e = 1 - Math.pow(1 - Math.min(1, v), 3); return `inset(0% ${(1 - e) * 5}% 0% ${(1 - e) * 5}% round ${(1 - e) * 40}px)`; });
  return (
    <motion.section className="hv-race" data-room="dark" id="faster" aria-labelledby="faster-h" ref={ref} style={{ clipPath: clip }}>
      <div className="v2-wrap">
        <header className="hv-head v2-grid">
          <Lines as="h2" id="faster-h" className="v2-display-m hv-head-t" lines={['Faster where', 'the work happens.']} />
          <div className="hv-head-r"><p className="v2-lede">Hanzo Dev and Kai, each measured side by side.</p></div>
        </header>
        <Run
          kicker="Hanzo Dev vs Claude Code"
          big={3.02} decimals={2}
          cap="faster on the same coding tasks"
          note="Paired over 42 tasks both agents solved · 95% interval 2.06–4.36×."
          title="Median time a task · less time is faster"
          lanes={[{ who: 'Hanzo Dev', ms: 2290, done: '2.29 s', hi: true }, { who: 'Claude Code', ms: 9520, done: '9.52 s' }]}
          extra={(
            <dl className="hv-facts">
              <div><dt>Settled by search, no model call, 24 tasks</dt><dd className="x-mono">8.22× faster</dd></div>
              <div><dt>model calls a task</dt><dd className="x-mono">1.0 vs 3.8</dd></div>
            </dl>
          )}
          link={<Arrow href="/benchmarks#coding-agent">Every coding task and both runs</Arrow>}
        />
        <Run
          flip
          kicker="Kai vs an LLM call"
          big={9.6} decimals={1}
          cap="faster than an LLM call, over the network"
          note="Each a p50 timed at the client, network included: a Claude Sonnet 5.5 call as Claude Code saw it, over 650 calls, and a Kai decision on api.hanzo.ai, over 100. Served on one GPU with no network, its input repeated, Kai answers in 0.8 ms."
          title="Average time & Kai speedup per call · less time is faster"
          lanes={[
            { who: 'Kai served on one GPU, no network', ms: 0.8, done: '0.8 ms', hi: true },
            { who: 'Kai on api.hanzo.ai', ms: 241, done: '241 ms', hi: true },
            { who: 'Claude Haiku 4.5', ms: 1120, done: '4.7× · 1,120 ms' },
            { who: 'Claude Sonnet 5.5', ms: 2307, done: '9.6× · 2,307 ms' },
            { who: 'Claude Opus 5', ms: 3180, done: '13.2× · 3,180 ms' },
            { who: 'Claude Fable 5.1', ms: 3840, done: '16× · 3,840 ms' },
          ]}
          link={(
            <div className="hv-links">
              <Arrow href="/kai">How Kai makes decisions</Arrow>
              <Arrow href="https://docs.hanzo.ai/docs/dev/getting-started/install">Install Hanzo Dev</Arrow>
              <Arrow href="https://docs.hanzo.ai/docs/decisions">Ask Kai your first decision</Arrow>
            </div>
          )}
        />
      </div>
    </motion.section>
  );
}
