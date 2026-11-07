'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, animate, useInView, useMotionValue, useReducedMotion, useTransform } from 'motion/react';
import { EASE, Head, Arrow, Count, Rise } from './ui';

/* One lane of a race at true speed: every bar grows at the same rate, so the faster one simply stops first. */
function Lane({ t, max, who, ms, done, label, hi }) {
  const w = useTransform(t, (v) => Math.min(v, ms) / max);
  const live = useTransform(t, (v) => {
    const x = Math.min(v, ms);
    return x >= ms ? done : ms >= 1000 ? (x / 1000).toFixed(2) + ' s' : Math.round(x).toLocaleString('en-US') + ' ms';
  });
  const fin = useTransform(t, (v) => (v >= ms ? 1 : 0));
  return (
    <div className={'x-lane' + (hi ? ' hi' : '')}>
      <div className="x-lane-h">
        <span>{who}</span>
        <motion.span className="x-mono x-lane-v">{label ? label : live}</motion.span>
      </div>
      <i className="x-lane-track"><motion.b style={{ scaleX: w }} /><motion.em style={{ opacity: fin }} aria-hidden="true">✓</motion.em></i>
    </div>
  );
}

function RaceCard({ kicker, big, decimals, cap, note, title, lanes, extra, link }) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.55 });
  const calm = useReducedMotion();
  const max = Math.max(...lanes.map((l) => l.ms));
  const t = useMotionValue(0);
  const [runs, setRuns] = useState(0);
  const [end, setEnd] = useState(false);
  useEffect(() => {
    if (!seen) return;
    if (calm) { t.set(max); setEnd(true); return; }
    t.set(0); setEnd(false);
    const c = animate(t, max, { duration: max / 1000, ease: 'linear', onComplete: () => setEnd(true) });
    return () => c.stop();
  }, [seen, runs]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <Rise className="x-race" ref={ref}>
      <div className="x-race-top">
        <span className="x-race-k">{kicker}</span>
        <motion.button type="button" className="x-replay" aria-label="Replay the race" onClick={() => setRuns((r) => r + 1)} whileTap={{ rotate: -360, scale: 0.9 }} transition={{ duration: 0.6, ease: EASE }}>
          <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true"><path d="M13 8a5 5 0 1 1-1.6-3.7M13 2.5v3h-3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </motion.button>
      </div>
      <p className="x-race-big"><Count to={big} decimals={decimals} suffix="×" duration={1.4} /></p>
      <p className="x-race-cap">{cap}</p>
      <p className="x-race-note">{note}</p>
      <p className="x-race-title x-mono">{title}</p>
      <div className="x-lanes">
        {lanes.map((l) => <Lane key={l.who} t={t} max={max} {...l} />)}
      </div>
      {extra}
      <motion.div className="x-race-end" animate={{ opacity: end ? 1 : 0.35 }}>{link}</motion.div>
    </Rise>
  );
}

export default function Race() {
  return (
    <section className="x-sec x-faster" data-room="dark" id="faster" aria-labelledby="faster-h">
      <div className="x-wrap">
        <Head dark title="Faster where the work happens." lede="Hanzo Dev and Kai, each measured side by side." />
        <div className="x-races">
          <RaceCard
            kicker="Hanzo Dev vs Claude Code"
            big={3.02} decimals={2}
            cap="faster on the same coding tasks"
            note="Paired over 42 tasks both agents solved · 95% interval 2.06–4.36×."
            title="Median time a task · less time is faster"
            lanes={[{ who: 'Hanzo Dev', ms: 2290, done: '2.29 s', hi: true }, { who: 'Claude Code', ms: 9520, done: '9.52 s' }]}
            extra={(
              <dl className="x-facts">
                <div><dt>Settled by search, no model call, 24 tasks</dt><dd className="x-mono">8.22× faster</dd></div>
                <div><dt>model calls a task</dt><dd className="x-mono">1.0 vs 3.8</dd></div>
              </dl>
            )}
            link={<Arrow href="/benchmarks#coding-agent">Every coding task and both runs</Arrow>}
          />
          <RaceCard
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
              <div className="x-row-links tight">
                <Arrow href="/kai">How Kai makes decisions</Arrow>
                <Arrow href="https://docs.hanzo.ai/docs/dev/getting-started/install">Install Hanzo Dev</Arrow>
                <Arrow href="https://docs.hanzo.ai/docs/decisions">Ask Kai your first decision</Arrow>
              </div>
            )}
          />
        </div>
      </div>
    </section>
  );
}
