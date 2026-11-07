'use client';
/* Telemetry. Signature: spans in one at a time, out in batches, under a memory ceiling. Spans, metrics and logs trickle
   in over OTLP from the left; the collector gathers them and lets them go as batches to the right; a memory gauge rises
   and, at the ceiling you set, the collector refuses work instead of exceeding it, then recovers. The six facts are
   the collector's own config, receivers to exporters, a block you can read top to bottom. Every word and link is
   Hanzo's. */
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EASE, Rise } from '../../ui';
import { Hero, Paste, Get, useLive, useEvery } from './Frame';
import './Telemetry.css';

const KINDS = ['trace', 'metric', 'log'];

export function tick(s) {
  const t = s.t + 1;
  const full = s.mem >= 0.92;
  const take = full ? 0 : 1;
  let held = s.held + take;
  let out = s.out;
  if (held >= 6) { out = [{ id: t, n: held }, ...out].slice(0, 4); held = 0; }
  const mem = Math.max(0.3, Math.min(1, s.mem + (full ? -0.28 : 0.035 + (t % 7 === 0 ? 0.12 : 0))));
  return { t, held, out, mem, refused: full };
}

function Pipe() {
  const [ref, live] = useLive(0.3);
  const [s, setS] = useState({ t: 0, held: 2, out: [], mem: 0.45, refused: false });
  useEvery(420, live, () => setS(tick));
  return (
    <div className="tl-pipe" ref={ref} aria-hidden="true">
      <div className="tl-in">
        <p className="tl-k">OTLP in · gRPC · HTTP</p>
        <div className="tl-lane">
          {live && <AnimatePresence>{!s.refused && <motion.span key={s.t} className={'tl-span ' + KINDS[s.t % 3]} initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 60, opacity: 0, transition: { duration: 0.3 } }} transition={{ duration: 0.3 }}>{KINDS[s.t % 3]}</motion.span>}</AnimatePresence>}
          {s.refused && <motion.span className="tl-refuse" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>refused</motion.span>}
        </div>
      </div>
      <div className="tl-core">
        <p className="tl-k">collector</p>
        <div className="tl-batch">{Array.from({ length: 6 }).map((_, i) => <i key={i} className={i < s.held ? 'on' : ''} />)}</div>
        <p className="tl-sub">batching</p>
        <div className="tl-mem"><span>memory</span><i><motion.b animate={{ scaleX: s.mem }} transition={{ duration: 0.4, ease: EASE }} className={s.mem > 0.85 ? 'hot' : ''} /><em /></i><span className="tl-ceil">ceiling</span></div>
      </div>
      <div className="tl-out">
        <p className="tl-k">OTLP out</p>
        <AnimatePresence initial={false}>
          {s.out.map((b) => <motion.div key={b.id} layout className="tl-sent" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35, ease: EASE }}><b>batch</b><span>{b.n} spans · 1 request</span></motion.div>)}
        </AnimatePresence>
      </div>
    </div>
  );
}

const FACTS = [
  ['OTLP in, OTLP out', 'Receives over gRPC and HTTP, exports the same way. OTLP is the format the OpenTelemetry SDKs already speak, so nothing in your code changes to point at it.', 'receivers'],
  ['Traces, metrics and logs', 'All three move through the same process, so there is one thing to run, one config to read and one place to look when telemetry stops arriving.', 'pipelines'],
  ['Batching', 'Spans arrive one at a time and leave in batches. That is the difference between a request per span and a request per few thousand, and your backend feels it.', 'processors'],
  ['A memory ceiling', 'Tell it how much memory it may use and it refuses work rather than exceeding it. Telemetry is the thing that should degrade during an incident, not the thing that causes one.', 'processors'],
  ['Assembled, not installed', 'This is the collector itself. Build a distribution with the receivers, processors and exporters you actually want, and ship one binary containing those and nothing else.', 'build'],
  ['It runs where you run', 'A binary in your own network. Whatever you decide not to forward, you decide before the data has left — which is the only point where that is still your call.', 'exporters'],
];

export default function Telemetry() {
  return (
    <main className="tl">
      <Hero dark kick="telemetry.hanzo.ai" title="Hanzo Telemetry" sub="The collector that sits between your app and wherever the data goes" acts={[['View on GitHub', 'https://github.com/hanzoai']]}>
        <Pipe />
      </Hero>
      <section className="x-sec tl-hop">
        <div className="x-wrap tl-hop-grid">
          <div className="tl-hop-h"><Rise as="h2">One hop you control</Rise><span className="x-mono">01 / 06 — 06 / 06</span></div>
          <div className="tl-cfg">
            {FACTS.map(([t, d, key], i) => (
              <Rise key={t} className="tl-blk" y={14} delay={i * 0.04}>
                <p className="tl-key"><span>{String(i + 1).padStart(2, '0')} / 06</span>{key}:</p>
                <h3>{t}</h3>
                <p className="tl-d">{d}</p>
              </Rise>
            ))}
          </div>
        </div>
      </section>
      <section className="x-sec tl-paste">
        <div className="x-wrap">
          <Rise as="h2" className="tl-start">Put it in front of your backend</Rise>
          <Paste name="Telemetry" prompt="Read https://hanzo.ai/skill.md and use Hanzo Telemetry in my project." />
        </div>
      </section>
      <Get name="Telemetry" tag="OpenTelemetry ingest" />
    </main>
  );
}
