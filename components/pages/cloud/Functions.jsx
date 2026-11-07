'use client';
// Functions.
// V2: 8/10 round 3 (critic 7/10): the use cases are one at a time on a pinned stage, each with its own live drawing from its own words, and each tile opens into its own full-screen sheet (grows out of the tile, Back/Esc/Close reverse it; points behind the open, in the HTML); phone chapters are a swipe rail (drawing first, one in one out); the phone composer keeps its card above compact choice rails; chapter titles rest at 26px and "Get Functions" at 52px; hovers say something (rail numbers show their chapter, related rows show their path, composer choices preview their effect on the card); hero stage content inset to the container while its fill bleeds; the invented "Choose at least one trigger." line is gone; the close ends without dead black.
// Persona: Developer who runs Kubernetes and wants functions on it.
// Goal: try Hanzo Functions (sign in, then deploy).
// CTA: "Try Hanzo" → /login (solid: data-cta functions.hero with data-thumb for the ask bar); "View Documentation" →
//   https://docs.hanzo.ai/docs/cli/function (the kit's text link, functions.hero-2); "Deploy to Cloud" →
//   https://platform.hanzo.ai/deploy (functions.close, the close's one solid).
// Metric: api_key_created (proxy on this page: the functions.hero click).
// Signature: a function's life, in the hero. handler.js is written line by line, then calls stream in from one of four
//   triggers (an HTTP route, a cron schedule, a Kafka topic, a RabbitMQ queue), replicas fill slots across three
//   Kubernetes nodes from the warm pool, and when the calls stop they empty back to "scaled to zero". State is shown as
//   filled against hollow slots and a word, never a counting number (no figure here is Hanzo's).
// Supporting: six pinned chapters ("A handler file, a trigger, and the cluster you already run") whose scenes rise in
//   beside the words (the triggers' lines draw as you scroll, the canary slice grows into a flip); the runtime pill that
//   glides in "Compose yours"; the use cases one at a time on a pinned stage, each tile opening into its own sheet.
// Motion kinds: arrival (title cut-in, stage), time (the file writing itself, calls arriving), idle (replicas filling and
//   emptying, each use case's drawing), state (composer pills and their hover previews, the read-back, a tile opening into
//   its sheet), scroll (stage settle, chapters, the use-case stage: under half).
// Beyond: "Compose yours": pick a runtime (or your own container), the triggers it answers to, a GPU and a way to move
//   between versions, and the function you described is read back in Hanzo's own lines.
// Every word and link is Hanzo's; the scenes are drawn, not measured.
import { createContext, Fragment, useContext, useEffect, useRef, useState } from 'react';
import { motion, useInView, useMotionValue, useReducedMotion, useTransform } from 'motion/react';
import { Magnetic } from '../../ui';
import { A, Cta } from '../../kit';
import KeynoteChapters from '../../v2/KeynoteChapters';
import KeynoteClose from '../../v2/KeynoteClose';
import KeynoteLines from '../../v2/KeynoteLines';
import FnUses from './functions/FnUses';
import './Functions.css';

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

function Life() {
  const ref = useRef(null);
  const seen = useInView(ref, { amount: 0.25 });
  const calm = useReducedMotion();
  const paused = useStagePause();
  const [ready, setReady] = useState(false);
  const [t, setT] = useState(0);
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
  const pods = !going ? 0 : calm ? 12 : c < 13 ? Math.min(SLOTS - 6, c) : Math.max(0, 12 - (c - 13) * 2);
  const trig = going ? Math.floor(t / CYCLE) % 4 : -1;
  return (
    <div className="kn-obj fn-life" ref={ref} data-burst={burst ? '' : undefined}>
      <div className="fn-trigs" aria-hidden="true">
        <p className="fn-col-k">Triggers</p>
        <ul>{TRIGGERS.map((t2, i) => <li key={t2} className={trig === i ? 'on' : ''}><i />{t2}</li>)}</ul>
        <span className="fn-calls"><i /><i /><i /><i /><i /></span>
      </div>
      <div className="fn-code">
        <div className="fn-file"><span className="fn-dots" aria-hidden="true"><i /><i /><i /></span><b>handler.js</b><em className={going ? 'on' : ''}><i aria-hidden="true" />{going && 'deployed'}</em></div>
        <pre><code>{LINES.map((l, i) => <Fragment key={i}><span className="fn-ln" style={{ '--i': i }}>{hlJs(l)}</span>{'\n'}</Fragment>)}</code></pre>
      </div>
      <div className="fn-k8s" aria-hidden="true">
        <p className="fn-col-k">Kubernetes</p>
        <p className="fn-count" data-zero={pods ? undefined : ''}><i /><span>{pods ? 'replicas' : 'Scale to zero'}</span></p>
        <div className="fn-nodes">
          {[0, 1, 2].map((nd) => (
            <div key={nd} className="fn-node">
              <span>node {nd + 1}</span>
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

function RuntimeScene({ p, on }) {
  const k = useStepOf(p, 5, on);
  return (
    <div className="kn-obj fn-sc fn-sc-rt">
      <div className="fn-rts">{RUNTIMES.map((r, i) => <div key={r} className={'fn-rt' + (i === 4 ? ' box' : '') + (k === i ? ' on' : '')}><b>{r}</b>{i < 4 && <span>handler file</span>}</div>)}</div>
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
      <p className="fn-zero"><span className="fn-zero-i" aria-hidden="true"><i /><i /><i /></span><span>Scale to zero is still the default when nothing is calling.</span></p>
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
          <motion.path key={t} d={`M${50 + i * 100} 0 C ${50 + i * 100} 110, 200 90, 200 200`} style={p ? { pathLength: draw } : undefined} initial={p ? false : { pathLength: 0 }} animate={p ? undefined : { pathLength: on ? 1 : 0 }} transition={{ duration: 0.9, ease: EMPH, delay: i * 0.06 }} />
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

/* ---------- Beyond: compose a function from the page's own choices (no heading of its own: Hanzo's page has none) ---------- */
const MOVES = ['Blue/green', 'canary'];
/* the read-back is Hanzo's own sentences, whole, one per choice */
const SAY = {
  rt: 'Name a runtime and point at a handler file.',
  box: 'When the language you want is not one of them, bring a container you built yourself and deploy that instead.',
  tr: 'The trigger is its own object, so the same handler can answer to several without knowing about any of them.',
  gpu: 'A function can request an NVIDIA GPU and be scheduled onto a node that has one.',
  mv: 'Blue/green and canary between versions of a function, so backing out a bad deploy is a traffic decision rather than another build.',
  zero: 'Scale to zero is still the default when nothing is calling.',
};

/* a radio row: one ink pill glides to the choice (300 ms, ease-emphasis); arrows move it */
function Radios({ id, label, items, value, onChange, onPeek = () => {} }) {
  const refs = useRef([]);
  const key = (e, i) => {
    const k = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!k) return;
    e.preventDefault();
    const j = (i + k + items.length) % items.length;
    onChange(j); refs.current[j]?.focus();
  };
  return (
    <div className="fn-row" role="radiogroup" aria-label={label}>
      {items.map((r, i) => (
        <button key={r} ref={(el) => { refs.current[i] = el; }} type="button" role="radio" aria-checked={value === i} tabIndex={value === i ? 0 : -1} onClick={() => onChange(i)} onKeyDown={(e) => key(e, i)}
          onPointerEnter={(e) => e.pointerType === 'mouse' && onPeek(i)} onPointerLeave={() => onPeek(null)}>
          {value === i && <motion.span layoutId={id} className="fn-pill" transition={{ duration: 0.3, ease: EMPH }} />}
          <span>{r}</span>
        </button>
      ))}
    </div>
  );
}

const Tick = () => <svg className="fn-tick" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;

function Compose() {
  const [rtC, setRt] = useState(2);
  const [trC, setTr] = useState([true, false, false, false]);
  const [gpuC, setGpu] = useState(false);
  const [mvC, setMv] = useState(-1); // -1: no move between versions chosen (shown by shape: no pill is filled)
  // hovering a choice (fine pointers) previews its effect on the card before you commit; the card marks it as a preview
  const [peek, setPeek] = useState(null);
  const at = (k) => (peek && peek.k === k ? peek : null);
  const rt = at('rt') ? peek.i : rtC;
  const tr = at('tr') ? trC.map((x, j) => (j === peek.i ? !x : x)) : trC;
  const gpu = at('gpu') ? !gpuC : gpuC;
  const mv = at('mv') ? (mvC === peek.i ? -1 : peek.i) : mvC;
  const hover = (k, i) => ({ onPointerEnter: (e) => e.pointerType === 'mouse' && setPeek({ k, i }), onPointerLeave: () => setPeek(null) });
  const n = tr.filter(Boolean).length;
  const lines = [rt === 4 ? SAY.box : SAY.rt, n > 0 && SAY.tr, gpu && SAY.gpu, mv >= 0 && SAY.mv, SAY.zero].filter(Boolean);
  return (
    <section className="kn-sec fn-mix" aria-labelledby="fn-ch-h">
      <div className="kn-wrap kn-grid fn-mix-g">
        <div className="fn-mix-in">
          <fieldset><legend>Runtime</legend><Radios id="fn-rt" label="Runtime" items={RUNTIMES} value={rtC} onChange={(i) => { setRt(i); setPeek(null); }} onPeek={(i) => setPeek(i == null ? null : { k: 'rt', i })} /></fieldset>
          <fieldset><legend>Triggers</legend><div className="fn-row">{TRIGGERS.map((t, i) => <button key={t} type="button" aria-pressed={trC[i]} onClick={() => { setTr((v) => v.map((x, j) => (j === i ? !x : x))); setPeek(null); }} {...hover('tr', i)}><Tick /><span>{t}</span></button>)}</div></fieldset>
          <fieldset><legend>GPU</legend><div className="fn-row"><button type="button" aria-pressed={gpuC} onClick={() => { setGpu(!gpuC); setPeek(null); }} {...hover('gpu', 0)}><Tick /><span>NVIDIA GPU</span></button></div></fieldset>
          <fieldset><legend>Versions</legend><Radios id="fn-mv" label="Versions" items={MOVES} value={mvC} onChange={(i) => { setMv(i); setPeek(null); }} onPeek={(i) => setPeek(i == null ? null : { k: 'mv', i })} /></fieldset>
        </div>
        <div className="fn-card" data-peek={peek ? '' : undefined}>
          <div className="fn-card-h">
            <b>handler</b>
            <span>{rt === 4 ? 'Your container' : RUNTIMES[rt]}</span>
            {gpu && <span className="gpu">NVIDIA GPU</span>}
          </div>
          <div className="fn-card-t">{TRIGGERS.map((t, i) => <span key={t} className={tr[i] ? 'on' : ''}>{t}</span>)}</div>
          <ol className="fn-card-l" aria-live={peek ? 'off' : 'polite'}>{lines.map((l) => <li key={l}><span className="fn-m"><span>{l}</span></span></li>)}</ol>
        </div>
      </div>
    </section>
  );
}

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
    <div className="fn-join" ref={ref} aria-hidden="true">
      <span className="fn-join-n">handler.js</span>
      <svg viewBox="0 0 100 2" preserveAspectRatio="none"><motion.path d="M0 1H100" initial={{ pathLength: 0 }} animate={{ pathLength: seen ? 1 : 0 }} transition={{ duration: 0.9, ease: EMPH }} /></svg>
      <span className="fn-join-n">HTTP route</span>
      <svg viewBox="0 0 100 2" preserveAspectRatio="none"><motion.path d="M0 1H100" initial={{ pathLength: 0 }} animate={{ pathLength: seen ? 1 : 0 }} transition={{ duration: 0.9, ease: EMPH, delay: 0.3 }} /></svg>
      <span className="fn-join-n ink">Kubernetes</span>
    </div>
  );
}

/* a quiet, stationary row of what the page has said, just before the close */
const FACTS = ['Python, Go, Node.js, Rust', 'Helm', 'NVIDIA GPU', 'Blue/green', '/v1/function'];

export default function Functions() {
  return (
    <main className="kn fn">
      <Hero />

      <KeynoteChapters
        className="fn-ch"
        head={<div className="fn-ch-head"><div className="fn-ch-hw"><KeynoteLines className="kn-headline fn-ch-h" lines="A handler file, a trigger, and the cluster you already run" /><p className="kn-kick">What you get</p></div><Joined /></div>}
        items={GETS.map(([t, d]) => ({ title: t, body: <p>{d}</p> }))}
        visual={(i, on, p) => { const S = SCENES[i]; return <S on={on} p={p} />; }}
        side="right"
        swap="rise"
        count
      />

      <Compose />
      <FnUses>
        <div className="kn-wrap"><ul className="fn-facts" aria-label="Hanzo Functions">{FACTS.map((f) => <li key={f}>{f}</li>)}</ul></div>
      </FnUses>

      <KeynoteClose
        name="Functions"
        tag="Serverless functions"
        api="/v1/function"
        cta="functions.close"
        prompt="Read https://hanzo.ai/skill.md and use Hanzo Functions in my project. Start with: hanzo functions list"
      >
        <Rel />
      </KeynoteClose>
    </main>
  );
}
