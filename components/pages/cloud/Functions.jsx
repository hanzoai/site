'use client';
/* Functions.
   V2: 8/10 Apple-style launch: a function's whole life plays in the hero as it settles, six pinned chapters on the right each with a scene, a composer that reads your function back, the use cases as sheets that stack, one dark close.
   Signature: a function's life, on loop in the hero. handler.js is written line by line, then calls stream in from
   one of four triggers (an HTTP route, a cron schedule, a Kafka topic, a RabbitMQ queue), replicas spring up across
   three Kubernetes nodes from the warm pool and the count climbs, and when the calls stop they fall back to zero.
   Supporting: six pinned chapters ("A handler file, a trigger, and the cluster you already run") whose scenes rise in
   from below, words on the right (the triggers' lines draw as you scroll, the canary slice grows into a flip); the
   runtime pill that slides in "Compose yours"; the use cases as sheets that stack as you scroll (CSS sticky).
   Beyond: "Compose yours" - pick a runtime (or your own container), the triggers it answers to, a GPU and a way to
   move between versions, and the function you described is read back in Hanzo's own lines.
   Accent: functions indigo, the colour of a replica that is running. Every word and link is Hanzo's. */
import { useEffect, useState } from 'react';
import { motion, useMotionValue, useReducedMotion, useTransform } from 'motion/react';
import { useLive, useEvery, Related } from './Frame';
import KeynoteStage from '../../v2/KeynoteStage';
import KeynoteChapters from '../../v2/KeynoteChapters';
import KeynoteClose from '../../v2/KeynoteClose';
import KeynoteLines from '../../v2/KeynoteLines';
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
const LINES = CODE.split('\n');

function hlJs(line) {
  if (/^\s*\/\//.test(line)) return <span className="c">{line}</span>;
  return line.split(/\b(export|async|function|const|await|return|true|handler|processData)\b/).map((w, i) => (i % 2 ? <span key={i} className={/^(handler|processData)$/.test(w) ? 'f' : 'k'}>{w}</span> : w));
}

/* ---------- the hero: a function's life ---------- */
const WRITE = LINES.length + 1; // ticks spent writing, then the calls begin
const CYCLE = 26; // one burst of calls and the quiet after it
const SLOTS = 18;

function Life() {
  const [ref, live, calm] = useLive(0.25);
  const [k, setK] = useState(calm ? WRITE + CYCLE - 1 : 0);
  useEffect(() => { if (calm) setK(WRITE + CYCLE - 1); }, [calm]);
  useEvery(380, live, () => setK((v) => v + 1));
  const n = Math.min(LINES.length, k); // lines written
  const c = Math.max(0, k - WRITE) % CYCLE;
  const going = k >= WRITE;
  const burst = going && c < 13;
  const pods = !going ? 0 : c < 13 ? Math.min(SLOTS - 6, c) : Math.max(0, 12 - (c - 13) * 2);
  const trig = going ? Math.floor((k - WRITE) / CYCLE) % 4 : -1;
  return (
    <div className="kn-obj fn-life" ref={ref} data-burst={burst ? '' : undefined}>
      <div className="fn-trigs" aria-hidden="true">
        <p className="fn-col-k">Triggers</p>
        <ul>{TRIGGERS.map((t, i) => <li key={t} className={trig === i ? 'on' : ''}><i />{t}</li>)}</ul>
        <span className="fn-calls"><i /><i /><i /><i /><i /></span>
      </div>
      <div className="fn-code">
        <div className="fn-file"><span className="fn-dots"><i /><i /><i /></span><b>handler.js</b><em className={going ? 'on' : ''}>{going ? 'deployed' : 'editing'}</em></div>
        <pre><code>{LINES.map((l, i) => <span key={i} className={'fn-ln' + (i < n ? ' on' : '') + (i === n - 1 && !going ? ' cur' : '')}>{hlJs(l)}{'\n'}</span>)}</code></pre>
      </div>
      <div className="fn-k8s" aria-hidden="true">
        <p className="fn-col-k">Kubernetes</p>
        <p className="fn-count"><b className="kn-fig">{pods}</b><span>{pods ? 'replicas' : 'scaled to zero'}</span></p>
        <div className="fn-nodes">
          {[0, 1, 2].map((nd) => (
            <div key={nd} className="fn-node">
              <span>node {nd + 1}</span>
              <div className="fn-slots">{Array.from({ length: SLOTS / 3 }).map((_, j) => <i key={j} className={j * 3 + nd < pods ? 'on' : ''} />)}</div>
            </div>
          ))}
        </div>
        <p className="fn-warm"><i />warm pool</p>
      </div>
    </div>
  );
}

/* ---------- chapters: what you get ---------- */
const GETS = [
  ['Python, Go, Node.js, Rust', 'Name a runtime and point at a handler file. When the language you want is not one of them, bring a container you built yourself and deploy that instead.'],
  ['Warm before the request', 'Pools are prewarmed, so a function is not booting on the request that needed it. Scale to zero is still the default when nothing is calling.'],
  ['On your own cluster', 'Install it with Helm into Kubernetes you already run. Functions are ordinary workloads there, so quotas, node pools and network policy keep meaning what they meant.'],
  ['A GPU is a normal ask', 'A function can request an NVIDIA GPU and be scheduled onto a node that has one. That is what lets model work be a function instead of a service somebody has to keep alive.'],
  ['Triggers, not just HTTP', 'An HTTP route, a cron schedule, a Kafka topic, a RabbitMQ queue. The trigger is its own object, so the same handler can answer to several without knowing about any of them.'],
  ['Versions you can move between', 'Blue/green and canary between versions of a function, so backing out a bad deploy is a traffic decision rather than another build.'],
];

/* which of n steps a scene is on: from the scroll through its chapter (desktop), or by itself while seen (phones) */
function useStepOf(p, n, on) {
  const [k, setK] = useState(0);
  const calm = useReducedMotion();
  useEffect(() => {
    if (p) { const f = (v) => setK(Math.min(n - 1, Math.max(0, Math.floor(v * n)))); f(p.get()); return p.on('change', f); }
    if (!on || calm) { if (calm) setK(n - 1); return; }
    const t = setInterval(() => setK((x) => (x + 1) % n), 1400);
    return () => clearInterval(t);
  }, [p, n, on, calm]);
  return k;
}

const RUNTIMES = ['Python', 'Go', 'Node.js', 'Rust', 'Your container'];

function RuntimeScene({ p, on }) {
  const k = useStepOf(p, 5, on);
  return (
    <div className="kn-obj fn-sc fn-sc-rt">
      <div className="fn-rts">{RUNTIMES.map((r, i) => <div key={r} className={'fn-rt' + (i === 4 ? ' box' : '') + (k === i ? ' on' : '')}><b>{r}</b><span>{i === 4 ? 'a container you built yourself' : 'handler file'}</span></div>)}</div>
    </div>
  );
}

function WarmScene({ p, on }) {
  const k = useStepOf(p, 4, on);
  return (
    <div className="kn-obj ink fn-sc fn-sc-warm" data-k={k}>
      <p className="fn-sc-k">Pools are prewarmed</p>
      <div className="fn-pool">{Array.from({ length: 8 }).map((_, i) => <i key={i} className={i === 0 && k >= 2 ? 'hit' : ''} />)}</div>
      <div className="fn-req"><span className="fn-req-dot" /><span className="fn-req-l">request</span></div>
      <p className="fn-zero"><b className="kn-fig">0</b><span>Scale to zero is still the default when nothing is calling.</span></p>
    </div>
  );
}

function ClusterScene({ p, on }) {
  const k = useStepOf(p, 3, on);
  const TAGS = ['quotas', 'node pools', 'network policy'];
  return (
    <div className="kn-obj fn-sc fn-sc-cl">
      <div className="fn-cl-top"><span className="fn-helm">Helm</span><span>Kubernetes you already run</span></div>
      <div className="fn-tags">{TAGS.map((t, i) => <span key={t} className={k === i ? 'on' : ''}>{t}</span>)}</div>
      <div className="fn-pools">
        {[0, 1, 2].map((r) => (
          <div key={r} className={'fn-pool-r' + (k === 1 ? ' lit' : '')}>
            {Array.from({ length: 7 }).map((_, j) => <i key={j} className={(j + r * 2) % 3 === 0 ? 'fn' : ''} />)}
          </div>
        ))}
      </div>
      <p className="fn-cl-f"><i />Functions are ordinary workloads there</p>
    </div>
  );
}

function GpuScene({ p, on }) {
  const k = useStepOf(p, 3, on);
  return (
    <div className="kn-obj fn-sc fn-sc-gpu" data-k={k}>
      <div className="fn-want"><span className="fn-pod" /><span>NVIDIA GPU</span></div>
      <div className="fn-gnodes">
        {['node', 'node', 'NVIDIA GPU'].map((t, i) => (
          <div key={i} className={'fn-gnode' + (i === 2 ? ' gpu' : '')}>
            <span>{t}</span>
            <div>{i === 2 && <span className="fn-pod in" />}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TriggerScene({ p, on }) {
  const zero = useMotionValue(0);
  const draw = useTransform(p || zero, (v) => Math.min(1, v * 1.6));
  return (
    <div className="kn-obj fn-sc fn-sc-tr">
      <ul className="fn-tr-l">{TRIGGERS.map((t) => <li key={t}>{t}</li>)}</ul>
      <svg className="fn-tr-lines" viewBox="0 0 400 200" preserveAspectRatio="none" aria-hidden="true">
        {TRIGGERS.map((t, i) => (
          <motion.path key={t} d={`M${50 + i * 100} 0 C ${50 + i * 100} 110, 200 90, 200 200`} style={p ? { pathLength: draw } : undefined} initial={p ? false : { pathLength: 0 }} animate={p ? undefined : { pathLength: on ? 1 : 0 }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 }} />
        ))}
      </svg>
      <div className="fn-tr-h"><b>handler.js</b><span>the same handler</span></div>
    </div>
  );
}

function VersionScene({ p, on }) {
  const k = useStepOf(p, 4, on);
  return (
    <div className="kn-obj fn-sc fn-sc-ver" data-k={k}>
      <div className="fn-modes"><span className={k < 2 ? 'on' : ''}>canary</span><span className={k >= 2 ? 'on' : ''}>Blue/green</span></div>
      <div className="fn-vers">
        <div className="fn-ver a"><b>v1</b><i /></div>
        <div className="fn-ver b"><b>v2</b><i /></div>
      </div>
      <div className="fn-traffic"><i className="a" /><i className="b" /></div>
      <p className="fn-sc-k">a traffic decision rather than another build</p>
    </div>
  );
}

const SCENES = [RuntimeScene, WarmScene, ClusterScene, GpuScene, TriggerScene, VersionScene];

/* ---------- Beyond: compose yours ---------- */
const MOVES = ['One version', 'Blue/green', 'Canary'];

function Compose() {
  const [rt, setRt] = useState(2);
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
  const spring = { type: 'spring', stiffness: 300, damping: 30 };
  return (
    <section className="kn-sec fn-mix" aria-labelledby="fn-mix-h">
      <div className="kn-wrap kn-grid fn-mix-g">
        <div className="fn-mix-in">
          <p className="kn-kick ac">Compose yours</p>
          <KeynoteLines id="fn-mix-h" className="kn-headline" lines="One handler, your choices" />
          <fieldset><legend>Runtime</legend><div className="fn-row" role="radiogroup" aria-label="Runtime">{RUNTIMES.map((r, i) => <button key={r} type="button" role="radio" aria-checked={rt === i} onClick={() => setRt(i)}>{rt === i && <motion.span layoutId="fn-rt" className="fn-pill" transition={spring} />}<span>{r}</span></button>)}</div></fieldset>
          <fieldset><legend>Triggers</legend><div className="fn-row">{TRIGGERS.map((t, i) => <button key={t} type="button" aria-pressed={tr[i]} onClick={() => setTr((v) => v.map((x, j) => (j === i ? !x : x)))}><span>{t}</span></button>)}</div></fieldset>
          <fieldset><legend>GPU</legend><div className="fn-row"><button type="button" aria-pressed={gpu} onClick={() => setGpu(!gpu)}><span>NVIDIA GPU</span></button></div></fieldset>
          <fieldset><legend>Versions</legend><div className="fn-row" role="radiogroup" aria-label="Versions">{MOVES.map((m, i) => <button key={m} type="button" role="radio" aria-checked={mv === i} onClick={() => setMv(i)}>{mv === i && <motion.span layoutId="fn-mv" className="fn-pill" transition={spring} />}<span>{m}</span></button>)}</div></fieldset>
        </div>
        <div className="fn-card">
          <div className="fn-card-h">
            <b>handler</b>
            <span>{rt === 4 ? 'Your container' : RUNTIMES[rt]}</span>
            {gpu && <span className="gpu">NVIDIA GPU</span>}
          </div>
          <div className="fn-card-t">{TRIGGERS.map((t, i) => <span key={t} className={tr[i] ? 'on' : ''}>{t}</span>)}</div>
          <ol className="fn-card-l" aria-live="polite">{lines.map((l) => <li key={l}>{l}</li>)}</ol>
        </div>
      </div>
    </section>
  );
}

/* ---------- common use cases: sheets that stack ---------- */
const USES = [
  ['API Backends', 'Build complete REST or GraphQL APIs with automatic scaling and no server management.', ['Custom middleware for authentication and validation', 'API versioning and documentation generation', 'Automatic OpenAPI schema generation']],
  ['Real-time Processing', 'Process events in real-time with automatic scaling for traffic spikes.', ['Webhook handlers for third-party services', 'Event-driven data transformation and enrichment', 'Real-time analytics processing']],
  ['AI/ML Inference', 'Deploy machine learning models for inference with built-in GPU acceleration.', ['Image and text classification', 'AI chatbots and virtual assistants', 'Real-time recommendations']],
  ['Scheduled Tasks', 'Run tasks on a schedule without maintaining a dedicated server.', ['Periodic data cleanup and maintenance', 'Scheduled reports and notifications', 'Recurring data integration and ETL processes']],
];

function Uses() {
  return (
    <section className="kn-sec fn-uses" aria-labelledby="fn-uses-h">
      <div className="kn-wrap kn-grid fn-uses-g">
        <div className="fn-uses-h">
          <KeynoteLines id="fn-uses-h" className="kn-display sm" lines={['Common', 'Use Cases']} />
          <p className="kn-lede">Hanzo Functions powers a wide range of serverless applications</p>
        </div>
        <ol className="fn-stack">
          {USES.map(([t, d, pts], i) => (
            <li key={t} className="fn-sheet" style={{ '--i': i }}>
              <span className="fn-sheet-n kn-fig">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="kn-headline">{t}</h3>
              <p className="kn-body">{d}</p>
              <ul>{pts.map((x) => <li key={x}>{x}</li>)}</ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default function Functions() {
  return (
    <main className="kn fn" style={{ '--ac': '#737373' }}>
      <KeynoteStage
        kick="Serverless Computing"
        title={['Hanzo Functions']}
        lede="Functions that run on Kubernetes."
        acts={[['Try Hanzo', '/login'], ['View Documentation', 'https://docs.hanzo.ai/docs/cli/function']]}
        meta={<span>Python · Go · Node.js · Rust · /v1/function</span>}
        from={1.15}
      >
        <Life />
      </KeynoteStage>

      <KeynoteChapters
        className="fn-ch"
        head={<div className="fn-ch-head"><p className="kn-kick ac">What you get</p><KeynoteLines className="kn-display sm fn-ch-h" lines={['A handler file, a trigger,', 'and the cluster you already run']} /></div>}
        items={GETS.map(([t, d]) => ({ title: t, body: <p>{d}</p> }))}
        visual={(i, on, p) => { const S = SCENES[i]; return <S on={on} p={p} />; }}
        side="right"
        swap="rise"
        count
      />

      <Compose />
      <Uses />

      <KeynoteClose
        name="Functions"
        tag="Serverless functions"
        api="/v1/function"
        prompt="Read https://hanzo.ai/skill.md and use Hanzo Functions in my project. Start with: hanzo functions list"
      >
        <Related className="fn-rel" items={[['GPUs', '/cloud/gpus', 'On-demand accelerators'], ['Machines', '/machines', 'VMs by the second'], ['Containers', '/cloud/containers']]} />
      </KeynoteClose>
    </main>
  );
}
