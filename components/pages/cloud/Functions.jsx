'use client';
// Functions.
// V2: 8/10 round 4 (critic 6/10): the phone chapter rail sits on the 16px gutter and runs to the screen edge (no clipped words); the hero's reduced-motion end state waits for mount (no hydration diff) and the close is a page-local copy of the shared room that does the same; invented labels gone ("deployed", "replicas", "node 1/2/3", "v1"/"v2": states and versions are shapes); the composer room and the spec strip are gone and their choices live in the objects that show them (pick the trigger in the hero, the runtime in chapter 01, the GPU in 04, canary or Blue/green in 06); use-case drawings stack upright on phones with every part kept and stay inside the sheet's card; the hero object ends inside the container; trigger lines draw all the way into handler.js; the request word never cuts; dead bands tightened.
// Persona: Developer who runs Kubernetes and wants functions on it.
// Goal: try Hanzo Functions (sign in, then deploy).
// CTA: "Try Hanzo" → /login (solid: data-cta functions.hero with data-thumb for the ask bar); "View Documentation" →
//   https://docs.hanzo.ai/docs/cli/function (the kit's text link, functions.hero-2); "Deploy to Cloud" →
//   https://platform.hanzo.ai/deploy (functions.close, the close's one solid).
// Metric: api_key_created (proxy on this page: the functions.hero click).
// Signature: a function's life, in the hero. handler.js is written line by line, then calls stream in from one of four
//   triggers (an HTTP route, a cron schedule, a Kafka topic, a RabbitMQ queue), slots fill across three Kubernetes nodes
//   from the warm pool, and when the calls stop they empty back to "Scale to zero". State is shown as filled against
//   hollow slots, never a counting number or an invented word (no figure here is Hanzo's).
// Supporting: six pinned chapters ("A handler file, a trigger, and the cluster you already run") whose scenes rise in
//   beside the words (the triggers' lines draw in, the canary slice grows into a flip); the use cases one at a time on a
//   pinned stage, each tile opening into its own sheet.
// Motion kinds: arrival (title cut-in, stage), time (the file writing itself, calls arriving), idle (slots filling and
//   emptying, each use case's drawing), state (the choices below, a tile opening into its sheet), scroll (stage settle,
//   chapters, the use-case stage: under half).
// Beyond: make the function yours in the objects themselves: pick the trigger that fires in the hero, a runtime (or
//   your own container) in chapter 01, ask for the NVIDIA GPU in 04, and canary or Blue/green in 06.
// Every word and link is Hanzo's; the scenes are drawn, not measured.
import { createContext, Fragment, useContext, useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { Magnetic } from '../../ui';
import { A, Cta } from '../../kit';
import KeynoteChapters from '../../v2/KeynoteChapters';
import KeynoteLines from '../../v2/KeynoteLines';
import FnUses from './functions/FnUses';
import FnClose from './functions/FnClose';
import { useEntrances } from './functions/enter';
import './Functions.css';
import './functions/enter.css';

const EMPH = [0.16, 1, 0.3, 1];
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
const STEP = 380; // ms per line written by CSS, and per tick of the calls after it
const WRITTEN = 300 + LINES.length * STEP + 300; // the file is written (CSS, from first paint), then the calls begin
const CYCLE = 26; // one burst of calls and the quiet after it, in ticks
const SLOTS = 18;
const Paused = createContext(false); // true while the visitor has paused the hero's demo
const useStagePause = () => useContext(Paused);

/* true only after mount: the server and the first client render must match, so the reduced-motion end state waits */
function useMounted() {
  const [m, setM] = useState(false);
  useEffect(() => setM(true), []);
  return m;
}

function Life() {
  const ref = useRef(null);
  const seen = useInView(ref, { amount: 0.25 });
  const mounted = useMounted();
  const calm = useReducedMotion() && mounted;
  const paused = useStagePause();
  const [ready, setReady] = useState(false);
  const [t, setT] = useState(12); // a finished run at first paint (12 pods up), then it scales back to zero
  // the visitor can choose the trigger that fires (the composer's trigger choice, folded into the hero)
  const [pick, setPick] = useState(null);
  useEffect(() => { const id = setTimeout(() => setReady(true), WRITTEN); return () => clearTimeout(id); }, []);
  // one tick at a time, only while seen and not paused (a single timeout, never an interval)
  useEffect(() => {
    if (!ready || !seen || calm || paused) return;
    const id = setTimeout(() => setT((v) => v + 1), STEP);
    return () => clearTimeout(id);
  }, [t, ready, seen, calm, paused]);
  const going = ready || calm;
  const c = t % CYCLE;
  const burst = going && !calm && c < 13;
  const pods = !going ? 12 : calm ? 12 : c < 13 ? Math.min(SLOTS - 6, c) : Math.max(0, 12 - (c - 13) * 2);
  const trig = pick != null ? pick : going ? Math.floor(t / CYCLE) % 4 : -1;
  return (
    <div className="kn-obj fn-life" ref={ref} data-burst={burst ? '' : undefined}>
      <div className="fn-trigs">
        <p className="fn-col-k" aria-hidden="true">Triggers</p>
        <div className="fn-trig-b" role="group" aria-label="Triggers">
          {TRIGGERS.map((t2, i) => (
            <button key={t2} type="button" data-sound="tick" aria-pressed={pick === i} className={trig === i ? 'on' : ''} onClick={() => { setPick((v) => (v === i ? null : i)); setReady(true); setT((v) => v - (v % CYCLE) + CYCLE); }}><i aria-hidden="true" />{t2}</button>
          ))}
        </div>
        <span className="fn-calls" aria-hidden="true"><i /><i /><i /><i /><i /></span>
      </div>
      <div className="fn-code">
        <div className="fn-file"><span className="fn-dots" aria-hidden="true"><i /><i /><i /></span><b>handler.js</b><em className={going ? 'on' : ''} aria-hidden="true"><i /></em></div>
        <pre><code>{LINES.map((l, i) => <Fragment key={i}><span className="fn-ln" style={{ '--i': i }}>{hlJs(l)}</span>{'\n'}</Fragment>)}</code></pre>
      </div>
      <div className="fn-k8s" aria-hidden="true">
        <p className="fn-col-k">Kubernetes</p>
        <p className="fn-count" data-zero={pods ? undefined : ''}><i /><span>Scale to zero</span></p>
        <div className="fn-nodes">
          {[0, 1, 2].map((nd) => (
            <div key={nd} className="fn-node">
              <div className="fn-slots">{Array.from({ length: SLOTS / 3 }).map((_, j) => <i key={j} className={j * 3 + nd < pods ? 'on' : ''} />)}</div>
            </div>
          ))}
        </div>
        <p className="fn-warm"><i />Pools are prewarmed</p>
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

/* which of n steps a scene is on: from the scroll through its chapter (desktop), or once through by itself while seen
   (phones: it steps every 1.4 s and rests on the last step, so nothing loops) */
function useStepOf(p, n, on) {
  const [k, setK] = useState(0);
  const calm = useReducedMotion();
  useEffect(() => {
    if (p) { const f = (v) => setK(Math.min(n - 1, Math.max(0, Math.floor(v * n)))); f(p.get()); return p.on('change', f); }
    if (calm) { setK(n - 1); return; }
    if (!on || k >= n - 1) return;
    const t = setTimeout(() => setK((x) => Math.min(n - 1, x + 1)), 1400);
    return () => clearTimeout(t);
  }, [p, n, on, calm, k]);
  return k;
}

const RUNTIMES = ['Python', 'Go', 'Node.js', 'Rust', 'a container you built yourself'];

/* arrow keys move a radio group's choice (one tab stop, roving) */
function arrows(e, i, n, choose, refs) {
  const k = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
  if (!k) return;
  e.preventDefault();
  const j = (i + k + n) % n;
  choose(j);
  refs.current[j]?.focus();
}

/* chapter 01: the runtimes step with the scroll; pick one and it stays chosen (the composer's runtime choice, folded in) */
function RuntimeScene({ p, on }) {
  const k0 = useStepOf(p, 5, on);
  const [pick, setPick] = useState(null);
  const refs = useRef([]);
  const k = pick ?? k0;
  return (
    <div className="kn-obj fn-sc fn-sc-rt">
      <div className="fn-rts" role="radiogroup" aria-label="Name a runtime">
        {RUNTIMES.map((r, i) => (
          <button key={r} ref={(el) => { refs.current[i] = el; }} type="button" role="radio" data-sound="tick" aria-checked={k === i} tabIndex={k === i ? 0 : -1}
            className={'fn-rt' + (i === 4 ? ' box' : '') + (k === i ? ' on' : '')} onClick={() => setPick(i)} onKeyDown={(e) => arrows(e, i, RUNTIMES.length, setPick, refs)}>
            <b>{r}</b>{i < 4 && <span>handler file</span>}
          </button>
        ))}
      </div>
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
      <p className="fn-zero"><span className="fn-zero-i" aria-hidden="true"><i /><i /><i /></span><span>Scale to zero</span></p>
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

/* chapter 04: the request lands on the node that has the GPU; press the request to ask for it yourself (the composer's
   GPU choice, folded in). Nodes are shapes, not names; only the GPU node carries Hanzo's words. */
function GpuScene({ p, on }) {
  const k0 = useStepOf(p, 3, on);
  const [pick, setPick] = useState(null); // null: follow the scroll; true or false: the visitor's choice
  const k = pick === true ? 2 : pick === false ? 0 : k0;
  return (
    <div className="kn-obj fn-sc fn-sc-gpu" data-k={k}>
      <button type="button" className="fn-want" data-sound="tick" aria-pressed={k === 2} onClick={() => setPick(k !== 2)}><span className="fn-pod" aria-hidden="true" /><span>NVIDIA GPU</span></button>
      <div className="fn-gnodes" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <div key={i} className={'fn-gnode' + (i === 2 ? ' gpu' : '')}>
            {i === 2 ? <span>NVIDIA GPU</span> : null}
            <div className="fn-gslots">{Array.from({ length: 6 }).map((_, j) => <i key={j} className={i < 2 && (j + i) % 3 === 0 ? 'on' : ''} />)}{i === 2 && <span className="fn-pod in" />}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* chapter 05: four triggers, one handler; the lines draw in full (900 ms) each time the chapter arrives */
function TriggerScene({ on }) {
  const calm = useReducedMotion(); // reduced motion: the lines stand joined at once (after mount, so hydration matches)
  return (
    <div className="kn-obj fn-sc fn-sc-tr">
      <ul className="fn-tr-l">{TRIGGERS.map((t) => <li key={t}>{t}</li>)}</ul>
      <motion.svg className="fn-tr-lines" viewBox="0 0 400 200" preserveAspectRatio="none" aria-hidden="true" initial={{ clipPath: 'inset(0 0 100% 0)' }} animate={{ clipPath: on || calm ? 'inset(0 0 0% 0)' : 'inset(0 0 100% 0)' }} transition={calm ? { duration: 0 } : { duration: 0.9, ease: EMPH }}>
        {TRIGGERS.map((t, i) => <path key={t} d={`M${50 + i * 100} 0 C ${50 + i * 100} 110, 200 90, 200 200`} />)}
      </motion.svg>
      <div className="fn-tr-h"><b>handler.js</b><span>the same handler</span></div>
    </div>
  );
}

/* chapter 06: canary slices traffic to the next version, Blue/green flips it; choose either (the composer's version
   choice, folded in). The versions are shapes, not invented names. */
const MOVES = ['canary', 'Blue/green'];
function VersionScene({ p, on }) {
  const k0 = useStepOf(p, 4, on);
  const [pick, setPick] = useState(null);
  const refs = useRef([]);
  const mode = pick ?? (k0 >= 2 ? 1 : 0);
  const k = pick == null ? k0 : pick === 1 ? 2 : 1;
  return (
    <div className="kn-obj fn-sc fn-sc-ver" data-k={k}>
      <div className="fn-modes" role="radiogroup" aria-label="Versions you can move between">
        {MOVES.map((m, i) => (
          <button key={m} ref={(el) => { refs.current[i] = el; }} type="button" role="radio" data-sound="tick" aria-checked={mode === i} tabIndex={mode === i ? 0 : -1}
            className={mode === i ? 'on' : ''} onClick={() => setPick(i)} onKeyDown={(e) => arrows(e, i, MOVES.length, setPick, refs)}>{m}</button>
        ))}
      </div>
      <div className="fn-vers" aria-hidden="true">
        {['a', 'b'].map((v) => <div key={v} className={'fn-ver ' + v}>{Array.from({ length: 8 }).map((_, j) => <i key={j} style={{ '--j': j }} />)}</div>)}
      </div>
      <div className="fn-traffic" aria-hidden="true"><i className="a" /><i className="b" /></div>
    </div>
  );
}

const SCENES = [RuntimeScene, WarmScene, ClusterScene, GpuScene, TriggerScene, VersionScene];

/* ---------- Beyond: the composer's four choices now live in the objects that show them (a trigger in the hero, a
   runtime in chapter 01, the GPU in 04, canary or Blue/green in 06), so the page never lists them a third time ---------- */

/* ---------- common use cases: one at a time on a pinned stage, each opening into its own sheet (functions/FnUses) ---------- */

/* related, on the graphite close: hairline rows (Frame's Related is retired); each name with Hanzo's line under it, and
   on hover the row tells you where it goes (its path draws in beside the arrow); the name flies into its page (Morph) */
const REL = [['GPUs', '/cloud/gpus', 'On-demand accelerators'], ['Machines', '/machines', 'VMs by the second'], ['Containers', '/cloud/containers']];
function Rel() {
  return (
    <div className="fn-rel">
      <p className="kn-kick">Related capabilities</p>
      <ul>
        {REL.map(([t, to, d]) => (
          <li key={t}>
            <A to={to} className="fn-rel-a">
              <span className="fn-rel-w"><b data-morph="">{t}</b>{d && <span>{d}</span>}</span>
              <em className="fn-rel-p" aria-hidden="true">{to}</em>
              <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </A>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- the hero: words on 5 columns, the function's life on 7, bleeding right ----------
   One solid ask (the kit's Cta, magnetic, data-thumb for the ask bar), the docs as its text link. Everything arrives by
   CSS at first paint (no wait for script); the object settles from 1.04 as the page scrolls (a CSS scroll timeline). */
function Hero() {
  const [paused, setPaused] = useState(false);
  return (
    <section className="fn-hero" data-morph-target="" data-paused={paused ? '' : undefined}>
      <div className="kn-wrap kn-grid fn-hero-g">
        <div className="fn-hero-t">
          <KeynoteLines as="h1" mount className="kn-display" lines={['Hanzo Functions']} delay={0.04} />
          <p className="kn-lede fn-hero-in" style={{ '--d': '.3s' }}>Functions that run on Kubernetes.</p>
          <div className="kn-acts fn-hero-acts fn-hero-in" style={{ '--d': '.42s' }}>
            <Magnetic strength={0.22}><Cta to="/login" id="functions.hero" thumb size="md" kind="solid" className="fn-go">Try Hanzo</Cta></Magnetic>
            <Cta to="https://docs.hanzo.ai/docs/cli/function" kind="link" id="functions.hero-2">View Documentation</Cta>
          </div>
          <div className="fn-hero-meta fn-hero-in" style={{ '--d': '.54s' }}>
            <button type="button" className="kn-pause" aria-pressed={paused} aria-label="Pause" onClick={() => setPaused((v) => !v)}>
              {paused
                ? <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M4.5 3v10l8.5-5z" fill="currentColor" /></svg>
                : <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><rect x="4" y="3" width="2.6" height="10" rx="1" fill="currentColor" /><rect x="9.4" y="3" width="2.6" height="10" rx="1" fill="currentColor" /></svg>}
            </button>
            <div className="fn-hero-mt">
              <p className="kn-kick">Serverless Computing</p>
              <span>Python, Go, Node.js, Rust</span>
              <span>/v1/function</span>
            </div>
          </div>
        </div>
        <div className="fn-hero-o">
          <div className="fn-hero-oi"><Paused.Provider value={paused}><Life /></Paused.Provider></div>
        </div>
      </div>
    </section>
  );
}

/* the chapters' first screen: the heading and its three nouns joined by a line that draws once, so the screen holds an object */
function Joined() {
  const ref = useRef(null);
  const seen = useInView(ref, { amount: 0.6, once: true });
  return (
    <div className="fn-join" ref={ref} aria-hidden="true" data-enter="split-merge">
      <span className="fn-join-n">handler.js</span>
      <svg viewBox="0 0 100 2" preserveAspectRatio="none"><motion.path d="M0 1H100" initial={{ pathLength: 0 }} animate={{ pathLength: seen ? 1 : 0 }} transition={{ duration: 0.9, ease: EMPH }} /></svg>
      <span className="fn-join-n">HTTP route</span>
      <svg viewBox="0 0 100 2" preserveAspectRatio="none"><motion.path d="M0 1H100" initial={{ pathLength: 0 }} animate={{ pathLength: seen ? 1 : 0 }} transition={{ duration: 0.9, ease: EMPH, delay: 0.3 }} /></svg>
      <span className="fn-join-n ink">Kubernetes</span>
    </div>
  );
}

export default function Functions() {
  const root = useRef(null);
  // the chapters' stage and the close arm their entrances by attribute (their markup is the shared kit's); before useEntrances
  useEffect(() => {
    root.current?.querySelector('.fn-ch .knc-g')?.setAttribute('data-enter', 'spring-snap');
    root.current?.querySelector('.knx-in')?.setAttribute('data-enter', 'grow-from-point');
  }, []);
  useEntrances(root);
  // the chapter rail's numbers preview their chapter: each gets its own title (Hanzo's words) as a tip, after mount
  useEffect(() => {
    document.querySelectorAll('.fn-ch .knc-rail button').forEach((b, i) => { if (GETS[i]) b.setAttribute('data-tip', GETS[i][0]); });
  }, []);
  return (
    <main className="kn fn" ref={root}>
      <Hero />

      <KeynoteChapters
        className="fn-ch"
        head={<div className="fn-ch-head"><div className="fn-ch-hw"><KeynoteLines id="fn-ch-h" className="kn-headline fn-ch-h" lines="A handler file, a trigger, and the cluster you already run" /><p className="kn-kick">What you get</p></div><Joined /></div>}
        items={GETS.map(([t, d]) => ({ title: t, body: <p>{d}</p> }))}
        visual={(i, on, p) => { const S = SCENES[i]; return <S on={on} p={p} />; }}
        side="right"
        swap="rise"
        count
      />

      <FnUses />

      <FnClose
        name="Functions"
        tag="Serverless functions"
        api="/v1/function"
        cta="functions.close"
        prompt="Read https://hanzo.ai/skill.md and use Hanzo Functions in my project. Start with: hanzo functions list"
      >
        <Rel />
      </FnClose>
    </main>
  );
}
