'use client';
/* Functions. Signature: one handler, four triggers, a cluster that wakes. An HTTP route, a cron schedule, a Kafka topic
   and a RabbitMQ queue take turns firing into the same handler.js; each call lands as a pod on a Kubernetes node, from a
   prewarmed pool, and when nothing calls the replicas fall back to zero. The six things you get ride a rail you can
   drag; the use cases open one at a time. Beyond: "Compose yours" - pick a runtime (or your own container), the
   triggers it answers to, a GPU and a way to move between versions, and the function you described is read back in
   Hanzo's own lines. Every word and link is Hanzo's. */
import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EASE, Rise } from '../../ui';
import { Hero, Paste, Related, Get, Head, useLive, useEvery } from './Frame';
import './Functions.css';

const TRIGGERS = ['HTTP route', 'cron schedule', 'Kafka topic', 'RabbitMQ queue'];
const CODE = `export async function handler(req, res) {
  // Process incoming data
  const { data } = await req.json();
  const result = await processData(data);

  // Return JSON response
  return Response.json({
    success: true,
    data: result
  })
}`;

function hlJs(line) {
  if (/^\s*\/\//.test(line)) return <span className="c">{line}</span>;
  return line.split(/\b(export|async|function|const|await|return|true)\b/).map((w, i) => (i % 2 ? <span key={i} className="k">{w}</span> : w));
}

/* Calls arrive from a trigger, become pods on the nodes, and drain away; idle long enough and it is back to zero. */
function Cluster() {
  const [ref, live] = useLive(0.3);
  const [tick, setTick] = useState(0);
  const [pods, setPods] = useState([]); // [{ id, node, born }]
  const id = useRef(0);
  useEvery(700, live, () => {
    setTick((t) => t + 1);
    const burst = Math.floor(tick / 6) % 3 !== 2; // two bursts of traffic, then a quiet spell
    setPods((ps) => {
      const next = ps.filter((p) => tick - p.born < 5);
      if (burst && next.length < 12) next.push({ id: id.current++, node: id.current % 3, born: tick });
      return next;
    });
  });
  const trig = Math.floor(tick / 6) % 4;
  return (
    <div className="fn-stage" ref={ref}>
      <ul className="fn-trigs" aria-hidden="true">
        {TRIGGERS.map((t, i) => (
          <li key={t} className={trig === i && pods.length ? 'on' : ''}><i />{t}</li>
        ))}
      </ul>
      <div className="fn-code">
        <div className="fn-file">handler.js</div>
        <pre><code>{CODE.split('\n').map((l, i) => <span key={i}>{hlJs(l)}{'\n'}</span>)}</code></pre>
      </div>
      <div className="fn-k8s" aria-hidden="true">
        <p className="fn-k8s-h"><span>Kubernetes</span><b>{pods.length}</b><em>{pods.length ? 'replicas' : 'scaled to zero'}</em></p>
        <div className="fn-nodes">
          {[0, 1, 2].map((n) => (
            <div key={n} className="fn-node">
              <span className="fn-node-k">node {n + 1}</span>
              <div className="fn-pods">
                <AnimatePresence>
                  {pods.filter((p) => p.node === n).map((p) => (
                    <motion.i key={p.id} layout initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.4, opacity: 0, transition: { duration: 0.3 } }} transition={{ type: 'spring', stiffness: 420, damping: 26 }} />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
        <p className="fn-warm"><i />warm pool</p>
      </div>
    </div>
  );
}

const GETS = [
  ['Python, Go, Node.js, Rust', 'Name a runtime and point at a handler file. When the language you want is not one of them, bring a container you built yourself and deploy that instead.'],
  ['Warm before the request', 'Pools are prewarmed, so a function is not booting on the request that needed it. Scale to zero is still the default when nothing is calling.'],
  ['On your own cluster', 'Install it with Helm into Kubernetes you already run. Functions are ordinary workloads there, so quotas, node pools and network policy keep meaning what they meant.'],
  ['A GPU is a normal ask', 'A function can request an NVIDIA GPU and be scheduled onto a node that has one. That is what lets model work be a function instead of a service somebody has to keep alive.'],
  ['Triggers, not just HTTP', 'An HTTP route, a cron schedule, a Kafka topic, a RabbitMQ queue. The trigger is its own object, so the same handler can answer to several without knowing about any of them.'],
  ['Versions you can move between', 'Blue/green and canary between versions of a function, so backing out a bad deploy is a traffic decision rather than another build.'],
];

/* The six as a rail: drag it, scroll it, or use the arrows. */
function Rail() {
  const ref = useRef(null);
  const [edge, setEdge] = useState([true, false]);
  const go = (d) => ref.current?.scrollBy({ left: d * ref.current.clientWidth * 0.8, behavior: 'smooth' });
  const onScroll = () => { const el = ref.current; setEdge([el.scrollLeft < 8, el.scrollLeft + el.clientWidth > el.scrollWidth - 8]); };
  return (
    <section className="x-sec fn-gets">
      <div className="x-wrap fn-gets-h">
        <Head kick="What you get" title="A handler file, a trigger, and the cluster you already run" />
        <div className="fn-arrows">
          <button type="button" onClick={() => go(-1)} disabled={edge[0]} aria-label="Previous">←</button>
          <button type="button" onClick={() => go(1)} disabled={edge[1]} aria-label="Next">→</button>
        </div>
      </div>
      <div className="fn-rail" ref={ref} onScroll={onScroll} tabIndex={0} aria-label="What you get">
        {GETS.map(([t, d], i) => (
          <Rise key={t} className="fn-card" delay={Math.min(i, 3) * 0.06}>
            <span className="fn-card-n">{String(i + 1).padStart(2, '0')}</span>
            <h3>{t}</h3>
            <p>{d}</p>
          </Rise>
        ))}
      </div>
    </section>
  );
}

const USES = [
  ['API Backends', 'Build complete REST or GraphQL APIs with automatic scaling and no server management.', ['Custom middleware for authentication and validation', 'API versioning and documentation generation', 'Automatic OpenAPI schema generation']],
  ['Real-time Processing', 'Process events in real-time with automatic scaling for traffic spikes.', ['Webhook handlers for third-party services', 'Event-driven data transformation and enrichment', 'Real-time analytics processing']],
  ['AI/ML Inference', 'Deploy machine learning models for inference with built-in GPU acceleration.', ['Image and text classification', 'AI chatbots and virtual assistants', 'Real-time recommendations']],
  ['Scheduled Tasks', 'Run tasks on a schedule without maintaining a dedicated server.', ['Periodic data cleanup and maintenance', 'Scheduled reports and notifications', 'Recurring data integration and ETL processes']],
];

function Uses() {
  const [open, setOpen] = useState(0);
  return (
    <section className="x-sec fn-uses" data-room="dark">
      <div className="x-wrap fn-uses-grid">
        <Head dark title="Common Use Cases" lede="Hanzo Functions powers a wide range of serverless applications" />
        <ul className="fn-acc">
          {USES.map(([t, d, pts], i) => (
            <li key={t} className={open === i ? 'open' : ''}>
              <button type="button" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>
                <span className="fn-acc-n">{String(i + 1).padStart(2, '0')}</span>
                <span className="fn-acc-t">{t}</span>
                <motion.i animate={{ rotate: open === i ? 45 : 0 }} transition={{ duration: 0.35, ease: EASE }} aria-hidden="true">+</motion.i>
              </button>
              <motion.div className="fn-acc-a" initial={false} animate={open === i ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }} transition={{ duration: 0.45, ease: EASE }} aria-hidden={open !== i} inert={open !== i}>
                <p>{d}</p>
                <ul>{pts.map((p) => <li key={p}>{p}</li>)}</ul>
              </motion.div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

const RUNTIMES = ['Python', 'Go', 'Node.js', 'Rust', 'Your container'];
const MOVES = ['One version', 'Blue/green', 'Canary'];

/* Compose yours: what you choose, read back in Hanzo's words. */
function Compose() {
  const [rt, setRt] = useState(0);
  const [tr, setTr] = useState([true, false, false, false]);
  const [gpu, setGpu] = useState(false);
  const [mv, setMv] = useState(0);
  const n = tr.filter(Boolean).length;
  const lines = [
    rt === 4 ? 'Bring a container you built yourself and deploy that instead.' : `${RUNTIMES[rt]}: name a runtime and point at a handler file.`,
    n === 0 ? 'Choose at least one trigger.' : n === 1 ? `${TRIGGERS[tr.indexOf(true)]}: the trigger is its own object.` : `${n} triggers: the same handler can answer to several without knowing about any of them.`,
    gpu && 'An NVIDIA GPU: scheduled onto a node that has one.',
    mv > 0 && `${MOVES[mv]}: backing out a bad deploy is a traffic decision rather than another build.`,
    'Pools are prewarmed. Scale to zero is still the default when nothing is calling.',
  ].filter(Boolean);
  return (
    <section className="x-sec fn-mix">
      <div className="x-wrap fn-mix-grid">
        <div className="fn-mix-in">
          <p className="x-kick">Compose yours</p>
          <h2>One handler, your choices</h2>
          <fieldset><legend>Runtime</legend><div className="fn-mix-row" role="radiogroup" aria-label="Runtime">{RUNTIMES.map((r, i) => <button key={r} type="button" role="radio" aria-checked={rt === i} onClick={() => setRt(i)}>{r}</button>)}</div></fieldset>
          <fieldset><legend>Triggers</legend><div className="fn-mix-row">{TRIGGERS.map((t, i) => <button key={t} type="button" aria-pressed={tr[i]} onClick={() => setTr((v) => v.map((x, k) => (k === i ? !x : x)))}>{t}</button>)}</div></fieldset>
          <fieldset><legend>GPU</legend><div className="fn-mix-row"><button type="button" aria-pressed={gpu} onClick={() => setGpu(!gpu)}>NVIDIA GPU</button></div></fieldset>
          <fieldset><legend>Versions</legend><div className="fn-mix-row" role="radiogroup" aria-label="Versions">{MOVES.map((m, i) => <button key={m} type="button" role="radio" aria-checked={mv === i} onClick={() => setMv(i)}>{m}</button>)}</div></fieldset>
        </div>
        <ol className="fn-mix-out" aria-live="polite">
          {lines.map((l) => <li key={l}>{l}</li>)}
        </ol>
      </div>
    </section>
  );
}

export default function Functions() {
  return (
    <main className="fn">
      <Hero
        look="stack"
        kick="Serverless Computing"
        title="Hanzo Functions"
        sub="Functions that run on Kubernetes."
        acts={[['Try Hanzo', '/login'], ['View Documentation', 'https://docs.hanzo.ai/docs/cli/function']]}
      >
        <Cluster />
      </Hero>
      <Rail />
      <Compose />
      <Uses />
      <section className="x-sec fn-paste">
        <div className="x-wrap">
          <Paste name="Functions" api="/v1/function" prompt="Read https://hanzo.ai/skill.md and use Hanzo Functions in my project. Start with: hanzo functions list" />
          <Related className="fn-rel" items={[['GPUs', '/cloud/gpus', 'On-demand accelerators'], ['Machines', '/machines', 'VMs by the second'], ['Containers', '/cloud/containers']]} />
        </div>
      </section>
      <Get name="Functions" tag="Serverless functions" />
    </main>
  );
}
