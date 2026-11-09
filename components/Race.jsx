'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, animate, useInView, useMotionValue, useReducedMotion, useTransform } from 'motion/react';
import { EASE, Head, Arrow, Count, Rise } from './ui';
import useFigures from './home/useFigures';

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
    <Rise className="x-race x-shine" ref={ref}>
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
  const { CODING: K1, KAI: K2 } = useFigures();
  return (
    <section className="x-sec x-faster" data-room="dark" id="faster" data-hz-view="faster" aria-labelledby="faster-h">
      <div className="x-wrap">
        <Head dark title="Faster where the work happens." lede="Hanzo Dev and Kai, each measured side by side." />
        <div className="x-races">
          <RaceCard
            kicker="Hanzo Dev vs Claude Code"
            big={K1.big} decimals={2}
            cap="faster on the same coding tasks"
            note={`Paired over ${K1.n} tasks both agents solved · 95% interval ${K1.lo}–${K1.hi}×.`}
            title="Median time a task · less time is faster"
            lanes={[{ who: 'Hanzo Dev', ms: K1.ours.ms, done: K1.ours.done, hi: true }, { who: 'Claude Code', ms: K1.base.ms, done: K1.base.done }]}
            extra={(
              <dl className="x-facts">
                <div><dt>{`Settled by search, no model call, ${K1.search.n} tasks`}</dt><dd className="x-mono">{`${K1.search.x}× faster`}</dd></div>
                <div><dt>model calls a task</dt><dd className="x-mono">{`${K1.calls[0]} vs ${K1.calls[1]}`}</dd></div>
              </dl>
            )}
            link={<Arrow href="/benchmarks#coding-agent">Every coding task and both runs</Arrow>}
          />
          <RaceCard
            kicker="Kai vs an LLM call"
            big={K2.big} decimals={1}
            cap="faster than an LLM call, over the network"
            note={`Each a p50 timed at the client, network included: a ${K2.model} call as Claude Code saw it, over ${K2.llmN} calls, and a Kai decision on api.hanzo.ai, over ${K2.kaiN}. Served on one GPU with no network, its input repeated, Kai answers in ${K2.gpu.done}.`}
            title="Average time & Kai speedup per call · less time is faster"
            lanes={[
              { who: 'Kai served on one GPU, no network', ms: K2.gpu.ms, done: K2.gpu.done, hi: true },
              { who: 'Kai on api.hanzo.ai', ms: K2.net.ms, done: K2.net.done, hi: true },
              ...K2.lanes,
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
