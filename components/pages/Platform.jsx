'use client';
/* Platform. Its idea is the stack taken apart: eleven layers, from the gateway down to the kernel, lie as one slab;
   as you scroll they lift apart one by one, and a click on a layer opens the stack at that layer into its products.
   Around it, each plane of the cloud is drawn as the thing it is: a ladder of machines, four data shapes, a control
   plane with three homes, a replay of one afternoon of API calls, a pipeline that never stops moving.
   Every word and link is Hanzo's. */
import { useEffect, useRef, useState } from 'react';
import { motion, animate, useInView, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';
import { EASE, Rise, Words, Copy, Mark, fine } from '../ui';
import { A, Go, More, SecHead, Tick } from '../kit';
import './Platform.css';

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const soft = (v) => 1 - Math.pow(1 - clamp(v), 3);

/* a small hook: does this media query match (client only; the server renders the wide layout) */
function useMedia(q) {
  const [m, setM] = useState(false);
  useEffect(() => {
    const mq = matchMedia(q);
    const on = () => setM(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [q]);
  return m;
}

/* ---------- the console window (hero, and again where compute is shown) ---------- */
const TILES = [['Chat', '/cloud/chat'], ['Bot', '/bot'], ['Search', '/search'], ['Crawl', '/crawl'], ['Studio', '/studio'], ['Console', '/console'], ['Referrals', '/cloud/referrals'], ['Marketplace', '/cloud/marketplace']];
const NAV = [['GPUs', '/cloud/gpus'], ['Machines', '/machines'], ['Containers', '/cloud/containers'], ['Functions', '/functions'], ['Edge', '/edge'], ['Applications', '/cloud/applications'], ['Clusters', '/cloud/clusters'], ['Kubernetes', '/cloud/kubernetes']];
const ROWS = [['gateway', 'Ready'], ['payments-api', 'Ready'], ['checkout-web', 'Building'], ['docs-site', 'Ready']];

function Console({ nav, to }) {
  return (
    <div className="xpl-win">
      <div className="xpl-win-bar">
        <i /><i /><i />
        <span className="xpl-win-t"><Mark size={13} /> {nav ? '' : 'API Platform'}</span>
        <span className="xpl-win-h">— Hanzo</span>
      </div>
      <div className="xpl-win-body">
        {nav ? (
          <ul className="xpl-nav">{NAV.map(([t, h]) => <li key={t}><A to={h}>{t}</A></li>)}</ul>
        ) : (
          <ul className="xpl-tiles">{TILES.map(([t, h]) => <li key={t}><A to={h}><i aria-hidden="true">{t[0]}</i>{t}</A></li>)}</ul>
        )}
        <ul className="xpl-rows">
          {ROWS.map(([n, s], i) => (
            <li key={n} className={s === 'Building' ? 'busy' : ''}>
              <b>{n}</b>
              <span className="xpl-st"><i aria-hidden="true" />{s}</span>
              {s === 'Building' && <u aria-hidden="true" />}
              {i === 0 && <small>Every request enters here, so the limiter does too.</small>}
            </li>
          ))}
        </ul>
        <div className="xpl-win-f">
          <A to={to} className="x-arrow"><span>Open in the console</span><svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></A>
          <small>Example project. Every name in it is one you would give your own.</small>
        </div>
      </div>
    </div>
  );
}

/* ---------- hero ---------- */
const CHIPS = ['400+ callable models', 'GPUs', 'Functions', 'Containers', 'Databases', 'Observability', 'One API'];

function Hero() {
  const line = (t, d) => (
    <span className="x-line"><motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: d }}>{t}</motion.span></span>
  );
  return (
    <section className="xpl-hero" aria-labelledby="xpl-h1">
      <div className="x-wrap xpl-hero-grid">
        <div>
          <motion.p className="x-kick" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }}>Hanzo Platform</motion.p>
          <h1 id="xpl-h1" className="xpl-h1">{line('The AI‑native', 0.05)}{line('cloud.', 0.17)}</h1>
          <motion.p className="xpl-lede" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.4 }}>Run models, agents, applications, data and infrastructure through one operating plane.</motion.p>
          <motion.p className="xpl-sub" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.48 }}>Kubernetes-native. Fully observable. Open source. Run it on Hanzo infrastructure or infrastructure you control.</motion.p>
          <motion.div className="xpl-acts" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.58 }}>
            <Go to="https://platform.hanzo.ai/api-keys" solid>Start building</Go>
            <a className="x-btn" href="#stack">Inspect the stack</a>
          </motion.div>
          <motion.div className="xpl-run" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.8 }}>
            <code>docker run -p 8080:8080 ghcr.io/hanzoai/cloud</code>
            <Copy text="docker run -p 8080:8080 ghcr.io/hanzoai/cloud" />
          </motion.div>
        </div>
        <motion.div className="xpl-hero-win" initial={{ opacity: 0, y: 40, rotateX: 10 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} transition={{ duration: 1.3, ease: EASE, delay: 0.3 }}>
          <Console to="/home" />
        </motion.div>
      </div>
      <div className="xpl-chips" aria-label="What runs on it">
        <div className="xpl-chips-t">
          {[0, 1].map((k) => (
            <ul key={k} aria-hidden={k === 1 ? 'true' : undefined}>
              {CHIPS.map((c) => <li key={c}>{c}</li>)}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- the stack: eleven layers that lift apart as you scroll; a click opens the stack at that layer ---------- */
const GROUPS = ['API', 'MIND', 'ACT', 'RUN', 'SILICON'];
const L = (n, name, g, kick, d, why, links, extra) => ({ n, name, g, kick, d, why, links, extra });
const LAYERS = [
  L('01', 'Gateway', 0, "Unified entry", "One entry for the AI stack: keys, orgs, admission, usage limits and routing to the right model or service.", "A stable API boundary, independent of which backend runs the request.", [['Product', '/gateway'], ['Docs', 'https://docs.hanzo.ai/docs/openapi/gateway'], ['Source', 'https://github.com/hanzoai/gateway']]),
  L('02', 'AI Gateway', 0, "Model interface", "A compatible inference interface for chat, completions, embeddings, multimodal models and agent workloads.", "The same client and key can move between models without rebuilding the application.", [['Product', '/api'], ['Docs', 'https://docs.hanzo.ai/docs/openapi/ai'], ['Source', 'https://github.com/hanzoai/ai']]),
  L('03', 'Enso', 1, "Intelligent routing", "Choose models and execution paths by capability, quality, latency and cost. Invoke a specific model when the application needs exact control.", "Enso routes. Zen reasons. Kai decides.", [['Product', '/enso'], ['Docs', 'https://docs.hanzo.ai/docs/models/enso'], ['Examples', 'https://github.com/hanzoai/enso']],
    { stat: "95.6% on GPQA Diamond", sd: "Historical multi-model research evaluation · new questions", text: "Enso Ultra answered 152 of 159 new questions right, against 93.1% for the best single model on the same questions.", more: [['How Enso routes', '/enso'], ['View the measurements', '/benchmarks/gpqa']] }),
  L('04', 'Zen', 1, "Generative reasoning", "Hanzo’s open-weight generative model family for reasoning, coding, language and multimodal generation.", "The reasoning layer: language, synthesis, plans and generation.", [['Product', '/zen'], ['Docs', 'https://docs.hanzo.ai/docs/models/zen'], ['Recipes', 'https://github.com/hanzoai/zen']],
    { more: [['View the measurements', '/benchmarks/zen-6']] }),
  L('05', 'Kai', 1, "Decision intelligence", "Typed decisions and policy-aware evaluations for choosing actions, scoring evidence and guarding what an agent may execute.", "Reasoning can generate proposals; Kai helps turn evidence into accountable decisions.", [['Product', '/kai'], ['Docs', 'https://docs.hanzo.ai/docs/models/kai'], ['Examples', 'https://github.com/hanzoai/kai']],
    { more: [['View the measurements', '/benchmarks#kai']] }),
  L('06', 'Agents', 2, "Autonomous action", "Composable agents coordinate tasks, use tools, schedule work and continue from intention to verified results.", "Agents act across software and services instead of stopping at a response.", [['Product', '/agents'], ['Docs', 'https://docs.hanzo.ai/docs/openapi/agent'], ['Source', 'https://github.com/hanzoai/agents']],
    { stat: "3.02× faster coding", text: "Hanzo Dev beside Claude Code on the same coding repairs, paired over 42 tasks both solved; 95% interval 2.06–4.36×.", more: [['Hanzo Dev', '/dev'], ['View the measurements', '/benchmarks#coding-agent']] }),
  L('07', 'Sandboxes', 2, "Safe execution", "Isolated execution for code, browser work and agent tools, with controlled permissions and lifecycle.", "Keep tool execution separated from model inference and production resources.", [['Product', '/platform'], ['Docs', 'https://docs.hanzo.ai/docs/openapi/sandbox'], ['Source', 'https://github.com/hanzoai/vm']]),
  L('08', 'Hanzo Cloud', 3, "Operating plane", "Deploy and coordinate inference and agent systems across Hanzo infrastructure, your clusters or a hybrid environment.", "One operating plane connects identity, usage, execution and infrastructure.", [['Product', '/platform'], ['Docs', 'https://docs.hanzo.ai/docs/network'], ['Source', 'https://github.com/hanzoai/cloud']]),
  L('09', 'Inference Engine', 3, "Inference runtime", "The native serving engine with continuous batching, paged attention, quantization and persistent KV caching at the node level.", "The inference work runs in one serving binary, from local hardware to GPU-backed systems.", [['Product', '/engine'], ['Docs', 'https://docs.hanzo.ai/docs/openapi/engine'], ['Source', 'https://github.com/hanzoai/engine']],
    { more: [['View the measurements', '/benchmarks/inference']] }),
  L('10', 'Hanzo ML', 4, "Tensor and neural framework", "Rust tensor, neural-network and model-execution primitives with accelerated device backends.", "Hanzo owns framework code close to the math, not just the API wrapper.", [['Product', '/open-source'], ['Docs', 'https://github.com/hanzoai/ml/blob/main/README.md'], ['Source', 'https://github.com/hanzoai/ml']]),
  L('11', 'Kernel DSL', 4, "Hardware acceleration", "A first-party Rust kernel DSL targeting CUDA, ROCm, Vulkan and Metal alongside backend-specific implementations.", "One portable kernel expression, optimized and validated for each device. Backend performance is workload-specific.", [['Product', '/open-source'], ['Docs', 'https://github.com/hanzoai/ml/blob/main/hanzo-kernel/README.md'], ['Source', 'https://github.com/hanzoai/ml/tree/main/hanzo-kernel']]),
];
const N = LAYERS.length;
const GAP = 46; // how far one gap opens, in px
const OPEN = 90; // how far the layers above the chosen one lift away from it

/* height of layer b (0 is the bottom slab) when the stack is p open, with `open` the bottom-index of the chosen layer */
function zOf(b, p, open) {
  let z = 0;
  for (let k = 1; k <= b; k++) z += 2 + GAP * soft((p - (k - 1) * 0.04) / 0.22);
  return z + clamp(b - open + 0.5) * OPEN * soft(p * 4);
}

function Plate({ i, drive, openAt, on, hot, pick, hover }) {
  const b = N - 1 - i;
  const z = useTransform([drive, openAt], ([p, o]) => zOf(b, p, o));
  return (
    <motion.div
      className={'xpl-plate' + (on ? ' on' : '') + (hot ? ' hot' : '')}
      style={{ z }}
      aria-hidden="true"
      onClick={() => pick(i)}
      onPointerEnter={(e) => fine(e) && hover(i)}
      onPointerLeave={() => hover(-1)}
    >
      <i>{LAYERS[i].n}</i>
    </motion.div>
  );
}

function Stack3D({ drive, sel, hot, pick, hover }) {
  const box = useRef(null);
  const calm = useReducedMotion();
  const rx = useSpring(56, { stiffness: 70, damping: 16 });
  const rz = useSpring(-38, { stiffness: 70, damping: 16 });
  const openAt = useSpring(N - 1 - sel, { stiffness: 120, damping: 17 });
  useEffect(() => { openAt.set(N - 1 - sel); }, [sel, openAt]);
  const lift = useTransform([drive, openAt], ([p, o]) => zOf(N - 1, p, o) * 0.42);
  const fit = useRef(1);
  const [k, setK] = useState(1);
  useEffect(() => {
    const el = box.current;
    const ro = new ResizeObserver(([e]) => {
      const { width: w, height: h } = e.contentRect;
      const s = clamp(Math.min(w / 520, h / 640), 0.45, 1.1);
      if (Math.abs(s - fit.current) > 0.01) { fit.current = s; setK(s); }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const move = (e) => {
    if (calm || !fine(e)) return;
    const r = box.current.getBoundingClientRect();
    rz.set(-38 + ((e.clientX - r.left) / r.width - 0.5) * 16);
    rx.set(56 - ((e.clientY - r.top) / r.height - 0.5) * 8);
  };
  return (
    <div className="xpl-scene" ref={box} onPointerMove={move} onPointerLeave={() => { rz.set(-38); rx.set(56); }}>
      <motion.div className="xpl-shift" style={{ y: lift, scale: k }}>
        <motion.div className="xpl-plates" style={{ rotateX: rx, rotateZ: rz }}>
          {LAYERS.map((l, i) => <Plate key={l.n} i={i} drive={drive} openAt={openAt} on={i === sel} hot={i === hot} pick={pick} hover={hover} />)}
        </motion.div>
      </motion.div>
    </div>
  );
}

function Inspector({ sel }) {
  return (
    <aside className="xpl-ins" aria-label="Layer inspector">
      <div className="xpl-ins-h"><span>Layer inspector</span><b aria-live="polite">{String(sel + 1).padStart(2, '0')} / {N}</b></div>
      <div className="xpl-ins-stack">
        {LAYERS.map((l, i) => (
          <article key={l.n} id={'xpl-layer-' + i} className={'xpl-layer' + (i === sel ? ' on' : '')} aria-hidden={i !== sel} inert={i !== sel}>
            <p className="xpl-lk">{l.kick}</p>
            <h3>{l.name}</h3>
            <p className="xpl-ld">{l.d}</p>
            <ul className="xpl-ll">{l.links.map(([t, h]) => <li key={t}><A to={h} className="xpl-pill">{t}</A></li>)}</ul>
            <div className="xpl-why"><span>Why this layer matters</span><p>{l.why}</p></div>
            {l.extra && (
              <div className="xpl-proof">
                {l.extra.stat && <b className="xpl-stat">{l.extra.stat}</b>}
                {l.extra.sd && <span className="xpl-sd">{l.extra.sd}</span>}
                {l.extra.text && <p>{l.extra.text}</p>}
                <div className="x-row-links tight">{l.extra.more.map(([t, h]) => <More key={t} to={h}>{t}</More>)}</div>
              </div>
            )}
          </article>
        ))}
      </div>
      <p className="xpl-ins-f"><span>Select / explore</span> Product · docs · source</p>
    </aside>
  );
}

function Stack() {
  const track = useRef(null);
  const calm = useReducedMotion();
  const phone = useMedia('(max-width: 900px)');
  const [sel, setSel] = useState(0);
  const [hot, setHot] = useState(-1);
  const [picked, setPicked] = useState(false);
  const hand = useRef(null); // progress at the moment of a click: the walk resumes after the reader has scrolled on
  const drive = useMotionValue(calm ? 0.7 : 0);
  const { scrollYProgress } = useScroll({ target: track, offset: ['start start', 'end end'] });
  const view = useInView(track, { amount: 0.25, once: true });

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (calm || phone) return;
    drive.set(clamp(v / 0.5));
    if (hand.current !== null && Math.abs(v - hand.current) > 0.1) hand.current = null;
    if (v > 0.5 && hand.current === null) setSel(Math.min(N - 1, Math.floor(((v - 0.5) / 0.5) * N)));
  });
  // on a phone the stack opens by itself once it is seen
  useEffect(() => {
    if (!phone || calm || !view) return;
    const c = animate(drive, 1, { duration: 2.2, ease: EASE });
    return () => c.stop();
  }, [phone, calm, view, drive]);

  const pick = (i) => { setSel(i); setPicked(true); hand.current = scrollYProgress.get(); };
  return (
    <section className="x-sec xpl-stack" id="stack" data-room="dark" aria-labelledby="xpl-stack-h">
      <div className="x-wrap">
        <header className="x-head dark xpl-stack-head">
          <p className="x-kick">The native AI stack</p>
          <Words text="One stack. Down to the kernel." />
          <Rise as="p" delay={0.2}>Build with agents. Route with Enso. Reason with Zen. Decide with Kai. Run on infrastructure you control.</Rise>
          <Rise delay={0.3}><button type="button" className="x-btn" onClick={() => { pick(0); document.getElementById('xpl-i-0')?.focus({ preventScroll: true }); }}>Inspect every layer</button></Rise>
        </header>
      </div>
      <div className="xpl-track" ref={track}>
        <div className="xpl-pin">
          <div className="x-wrap xpl-map">
            <div className="xpl-map-l">
              <p className="xpl-bar"><span>Hanzo / architecture map</span><span className={'xpl-hint' + (picked ? ' off' : '')}>Select a layer</span></p>
              <div className="xpl-map-in">
                <nav className="xpl-index" aria-label="Layers">
                  <span className="xpl-rail" aria-hidden="true" />
                  {GROUPS.map((g, gi) => (
                    <div key={g} className="xpl-grp" role="group" aria-label={g}>
                      <p>{g}</p>
                      {LAYERS.map((l, i) => l.g === gi && (
                        <button key={l.n} id={'xpl-i-' + i} type="button" className={i === sel ? 'on' : ''} aria-pressed={i === sel} aria-controls={'xpl-layer-' + i} onClick={() => pick(i)} onPointerEnter={(e) => fine(e) && setHot(i)} onPointerLeave={() => setHot(-1)} onFocus={() => setHot(i)} onBlur={() => setHot(-1)}>
                          <span>{l.n}</span><b>{l.name}</b>
                        </button>
                      ))}
                    </div>
                  ))}
                </nav>
                <Stack3D drive={drive} sel={sel} hot={hot} pick={pick} hover={setHot} />
              </div>
              <p className="xpl-bar xpl-bar-f"><span>01—11 / owned and connected</span><span>Interactive drawing · not telemetry</span></p>
              <div className="xpl-zap">
                <span className="xpl-zap-k">{"ZAP / native interconnect"}</span>
                <span className="xpl-zap-d">{"Agent ↔ tool RPC · MCP bridge · typed service communication"}</span>
                <span className="xpl-zap-l"><A to="https://docs.hanzo.ai/docs/zap">Protocol</A><A to="https://github.com/hanzoai/zap">Source</A></span>
              </div>
            </div>
            <Inspector sel={sel} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- one kernel, four targets: the same expression fans out to four devices ---------- */
const TARGETS = [
  ["01 / NVIDIA", 'CUDA', "CUDA kernels, attention and accelerated GPU operations.", 'https://github.com/hanzoai/ml/tree/main/hanzo-kernels'],
  ["02 / AMD", 'ROCm', "HIP/ROCm execution, attention and quantized operations.", 'https://github.com/hanzoai/ml/tree/main/hanzo-rocm-kernels'],
  ["03 / Cross-GPU", 'Vulkan', "SPIR-V shader paths and portable GPU execution.", 'https://github.com/hanzoai/ml/tree/main/hanzo-ml/src/vulkan'],
  ["04 / Apple", 'Metal', "Apple Silicon kernels and GPU-validated execution paths.", 'https://github.com/hanzoai/ml/tree/main/hanzo-metal-kernels'],
];

function Kernel() {
  return (
    <section className="x-sec xpl-kernel">
      <div className="x-wrap">
        <SecHead title={"One kernel DSL. Four targets."} lede={"Four parallel acceleration backends, not four extra hops. First-party kernels and performance tuning for supported workloads."} />
        <div className="xpl-fan">
          <svg viewBox="0 0 1000 120" preserveAspectRatio="none" aria-hidden="true" className="xpl-fan-svg">
            {[125, 375, 625, 875].map((x) => <path key={x} d={`M500 0 C500 60 ${x} 50 ${x} 120`} />)}
            {[125, 375, 625, 875].map((x, i) => <circle key={'d' + x} r="4" className="xpl-fan-dot" style={{ offsetPath: `path('M500 0 C500 60 ${x} 50 ${x} 120')`, animationDelay: i * 0.5 + 's' }} />)}
          </svg>
          <div className="xpl-fan-top"><b>Kernel DSL</b></div>
          <ul className="xpl-targets">
            {TARGETS.map(([k, n, d, to], i) => (
              <Rise as="li" key={n} delay={i * 0.08}>
                <span className="xpl-tk">{k}</span>
                <h3>{n}</h3>
                <p>{d}</p>
                <A to={to} className="x-arrow"><span>Explore<span className="x-sr"> {n}</span></span><svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></A>
              </Rise>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ---------- intelligence that connects to every layer, the request boundary, the trace ---------- */
const REACH = [
  { k: "Retrieve / remember", name: 'Semantic + Graph', d: "Semantic retrieval, durable memory, provenance and connected knowledge for agent work.", stat: "2.0× multi-hop evidence recall vs cosine", sd: "LoCoMo, held-out test split: every evidence turn of a multi-hop question in the top 20 for 37.5% of questions, against 18.8% for cosine search.", links: [['Product', '/products/memory'], ['Docs', 'https://docs.hanzo.ai/docs/openapi/graph'], ['Source', 'https://github.com/hanzoai/semantic'], ['The LoCoMo run', '/benchmarks/locomo']] },
  { k: "Understand / edit", name: 'Code Intelligence', d: "Symbols, ASTs, references and repository-aware code navigation for coding agents.", links: [['Product', '/dev'], ['Docs', 'https://docs.hanzo.ai/docs/openapi/code'], ['Source', 'https://github.com/hanzoai/lsp']] },
  { k: "Build / ship", name: 'Hanzo Forge', d: "Source hosting, builds, CI/CD and deployments connecting agents to shipped software.", links: [['Product', 'https://forge.hanzo.ai'], ['Docs', 'https://docs.hanzo.ai/docs/cli/platform'], ['Source', 'https://github.com/hanzoai/forge']] },
];

function Reach() {
  return (
    <section className="x-sec xpl-reach">
      <div className="x-wrap">
        <SecHead title={"Intelligence that connects to every layer."} lede={"Agent capabilities sit alongside the inference path; not every request crosses every subsystem."} />
        <ul className="xpl-reach-grid">
          {REACH.map((r, i) => (
            <Rise as="li" key={r.name} delay={i * 0.08} className="xpl-rc">
              <span className="xpl-rk">{r.k}</span>
              <h4>{r.name}</h4>
              <p>{r.d}</p>
              {r.stat && <div className="xpl-rstat"><b>{r.stat}</b><span>{r.sd}</span></div>}
              <ul className="xpl-ll">{r.links.map(([t, h]) => <li key={t}><A to={h} className="xpl-pill dark">{t}</A></li>)}</ul>
            </Rise>
          ))}
        </ul>
        <div className="xpl-edge">
          <Rise className="xpl-eg">
            <span className="xpl-rk">{"Edge / ingress + egress"}</span>
            <p className="xpl-eg-l">{"Request boundary"}</p>
            <h4>{"In. Out. Under control."}</h4>
            <p>{"Admission, auth, routing, streaming and responses are boundary functions around the stack rather than another inference step. Outbound calls carry delegated credentials that stay in KMS."}</p>
            <ul className="xpl-ll"><li><A to="/ingress" className="xpl-pill dark">Product</A></li><li><A to="https://github.com/hanzoai/ingress" className="xpl-pill dark">Ingress</A></li><li><A to="https://github.com/hanzoai/egress" className="xpl-pill dark">Egress</A></li></ul>
            <div className="xpl-flow" aria-hidden="true"><i /><i /><i /><u /></div>
          </Rise>
          <Rise className="xpl-eg" delay={0.1}>
            <span className="xpl-rk">{"Telemetry / observability"}</span>
            <p className="xpl-eg-l">{"End to end"}</p>
            <h4>{"Everything leaves a trace."}</h4>
            <p>{"Follow a request across models, decisions, tools and infrastructure to cost, quality, latency, usage and evaluation."}</p>
            <ul className="xpl-ll"><li><A to="/o11y" className="xpl-pill dark">Product</A></li><li><A to="https://docs.hanzo.ai/docs/openapi/o11y" className="xpl-pill dark">Docs</A></li><li><A to="https://github.com/hanzoai/o11y" className="xpl-pill dark">Source</A></li></ul>
            <svg className="xpl-trace" viewBox="0 0 300 40" preserveAspectRatio="none" aria-hidden="true"><path d="M0 30 L30 30 L45 8 L70 34 L95 18 L120 26 L150 6 L180 30 L210 20 L240 28 L270 12 L300 22" /></svg>
          </Rise>
        </div>
      </div>
    </section>
  );
}

/* ---------- not just running: the improvement loop, one step lit at a time ---------- */
const LOOP = [
  ["01 / Observe", "Measure", "Traces · regressions"],
  ["02 / Propose", "Hypothesize", "Candidate upgrades"],
  ["03 / Isolate", "Experiment", "Sandboxed variants"],
  ["04 / Prove", "Benchmark", "Quality · latency · cost"],
  ["05 / Control", "Gate + promote", "Review · rollback"],
];
const FACTS = [
  ["11 native layers", "Inspectable product, docs and source links for each architectural surface.", 'Open source', '/open-source'],
  ["4 GPU backends", "CUDA, ROCm, Vulkan and Metal; backend-specific validation, never blanket speed claims.", 'Kernel DSL', 'https://github.com/hanzoai/ml/tree/main/hanzo-kernel'],
  ["Measure the work", "Published measurements are scoped to a named model, workload, hardware and baseline.", 'Benchmarks', '/benchmarks'],
];

function Loop() {
  const ref = useRef(null);
  const seen = useInView(ref, { amount: 0.3 });
  const calm = useReducedMotion();
  const [at, setAt] = useState(0);
  useEffect(() => {
    if (!seen || calm) return;
    const t = setInterval(() => setAt((v) => (v + 1) % LOOP.length), 1700);
    return () => clearInterval(t);
  }, [seen, calm]);
  return (
    <section className="x-sec xpl-loop" ref={ref}>
      <div className="x-wrap">
        <header className="x-head">
          <p className="x-kick">{"Research / recursive improvement"}</p>
          <Words text={"Not just running. Learning."} />
          <div className="x-row-links tight"><More to="/research">Research</More><More to="/benchmarks">Benchmarks</More><More to="https://github.com/hanzoai/benchmarks">Harness</More></div>
        </header>
        <ol className="xpl-steps" style={{ '--at': at }}>
          {LOOP.map(([n, t, s], i) => (
            <li key={n} className={i === at ? 'on' : i < at ? 'past' : ''}>
              <span className="xpl-sn">{n}</span>
              <b>{t}</b>
              <small>{s}</small>
            </li>
          ))}
          <span className="xpl-ring" aria-hidden="true" />
        </ol>
        <Rise as="p" className="xpl-note">{"A modular feedback architecture, not a claim of unattended production self-modification. Only candidates that meet the relevant evaluation and release gates are promoted."}</Rise>
        <ul className="xpl-facts">
          {FACTS.map(([h, d, l, to], i) => (
            <Rise as="li" key={h} delay={i * 0.08}>
              <b>{h}</b>
              <p>{d}</p>
              <More to={to}>{l}</More>
            </Rise>
          ))}
        </ul>
        <Rise as="p" className="xpl-foot">{"GPU targets are parallel hardware backends, not sequential stages. Zen is generative reasoning; Kai provides decision intelligence. ZAP is a native RPC protocol for supported interconnect paths. Research and evaluation form a gated improvement loop. “Native” describes Hanzo’s architecture surfaces; not every implementation, weight, driver or operating system is owned or open sourced by Hanzo."}</Rise>
      </div>
    </section>
  );
}

/* ---------- compute: a ladder from a function to a cluster ---------- */
const LADDER = [
  ['Functions', "Scale to zero between calls.", 14],
  ['Containers', "Your image, deployed and addressable.", 32],
  ['Sandboxes', "Isolated shells for agents and untrusted code.", 50],
  ['Machines', "A whole machine, by the second.", 68],
  ['GPUs', "Accelerators attached to any of them.", 84],
  ['Kubernetes', "The substrate all of it runs on.", 100],
];
const DEPLOY = ['Containers', 'Machines', 'Sandboxes'];

function Compute() {
  const [tab, setTab] = useState(0);
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.35 });
  const keys = (e) => {
    const k = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    if (!k) return;
    e.preventDefault();
    const n = (tab + k + 3) % 3;
    setTab(n);
    document.getElementById('xpl-tab-' + n)?.focus();
  };
  return (
    <section className="x-sec xpl-compute">
      <div className="x-wrap">
        <SecHead kicker="Compute" title={"One runtime for every kind of work."} lede={"The same plane, held for a millisecond or for a month. What changes is how much of a machine the work needs, not what you have to learn."} />
        <ol className="xpl-ladder" ref={ref}>
          {LADDER.map(([n, d, w], i) => (
            <li key={n}>
              <b>{n}</b>
              <span>{d}</span>
              <i aria-hidden="true"><motion.u initial={{ scaleX: 0 }} animate={seen ? { scaleX: w / 100 } : {}} transition={{ duration: 1.2, ease: EASE, delay: 0.1 + i * 0.12 }} /></i>
            </li>
          ))}
        </ol>
        <div className="xpl-deploy">
          <div>
            <div className="xpl-tabs" role="tablist" aria-label="Kinds of work" onKeyDown={keys}>
              {DEPLOY.map((t, i) => (
                <button key={t} id={'xpl-tab-' + i} type="button" role="tab" aria-selected={tab === i} aria-controls={'xpl-pane-' + i} tabIndex={tab === i ? 0 : -1} onClick={() => setTab(i)}>
                  {tab === i && <motion.span layoutId="xpl-tabbg" className="xpl-tab-bg" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
                  <span>{t}</span>
                </button>
              ))}
            </div>
            <div className="xpl-panes">
              <div id="xpl-pane-0" role="tabpanel" aria-labelledby="xpl-tab-0" hidden={tab !== 0}><p>{"Deploy an image and invoke it. Deployments, triggers, secrets, metrics and logs are all part of the same surface, so a function you ship is a function you can watch."}</p></div>
              <div id="xpl-pane-1" role="tabpanel" aria-labelledby="xpl-tab-1" hidden={tab !== 1}><p>{"A whole machine, by the second."}</p></div>
              <div id="xpl-pane-2" role="tabpanel" aria-labelledby="xpl-tab-2" hidden={tab !== 2}><p>{"Isolated shells for agents and untrusted code."}</p></div>
            </div>
            <p className="xpl-ep"><span>api.hanzo.ai</span><b>/v1/functions</b></p>
            <div className="x-row-links tight">
              <More to="https://docs.hanzo.ai/docs/openapi/compute">Compute API</More>
              <More to="https://docs.hanzo.ai/docs/openapi/function">Function API</More>
              <More to="https://docs.hanzo.ai/docs/openapi/sandbox">Sandbox API</More>
              <More to="/machines">Machines</More>
            </div>
          </div>
          <Rise><Console nav to="https://hanzo.team/" /></Rise>
        </div>
      </div>
    </section>
  );
}

/* ---------- data: four primitives, each drawn in its own shape ---------- */
const PRIM = [
  ['Datastore', "Columnar analytics over everything you collected.", '/datastore'],
  ['Object Storage', "Objects, signed URLs, lifecycle rules.", '/s3'],
  ['Base', "An application backend: records, rules, realtime.", '/base'],
  ['Memory', "What an agent is allowed to remember between runs.", '/cloud/memory'],
];

function Shape({ k }) {
  if (k === 0) return <span className="xpl-sh cols" aria-hidden="true">{[40, 72, 54, 90, 62, 80, 46].map((h, i) => <i key={i} style={{ '--h': h + '%', '--d': i * 0.23 + 's' }} />)}</span>;
  if (k === 1) return <span className="xpl-sh objs" aria-hidden="true">{Array.from({ length: 12 }).map((_, i) => <i key={i} style={{ '--d': i * 0.31 + 's' }} />)}</span>;
  if (k === 2) return <span className="xpl-sh recs" aria-hidden="true">{[0, 1, 2, 3].map((i) => <i key={i} style={{ '--d': i * 0.7 + 's' }}><u /><u /><u /></i>)}</span>;
  return (
    <svg className="xpl-sh mem" viewBox="0 0 120 80" aria-hidden="true">
      <path d="M20 40 L60 14 L100 36 L78 66 L38 62 Z M60 14 L78 66 M20 40 L100 36 M38 62 L100 36" />
      {[[20, 40], [60, 14], [100, 36], [78, 66], [38, 62]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="4.5" style={{ animationDelay: i * 0.5 + 's' }} />)}
    </svg>
  );
}

function Data() {
  return (
    <section className="x-sec xpl-data">
      <div className="x-wrap">
        <SecHead kicker="Data" title={"The data primitives AI applications use."} lede={"Each primitive is the right shape for its job, and they share one project, one key and one bill."} />
        <ul className="xpl-prims">
          {PRIM.map(([n, d, to], i) => (
            <Rise as="li" key={n} delay={i * 0.07}>
              <A to={to} className="xpl-prim">
                <Shape k={i} />
                <h3>{n}</h3>
                <p>{d}</p>
              </A>
            </Rise>
          ))}
        </ul>
        <div className="x-row-links">
          <More to="https://docs.hanzo.ai/docs/openapi/base">Base API</More>
          <More to="https://docs.hanzo.ai/docs/openapi/s3">Object storage API</More>
          <More to="https://docs.hanzo.ai/docs/openapi/kv">KV API</More>
          <More to="/base">Hanzo Base</More>
        </div>
      </div>
    </section>
  );
}

/* ---------- anywhere: one control plane, three homes ---------- */
const HOMES = [['Hanzo Cloud', "Capacity we operate and meter, provisioned by the call."], ["Your cloud account", "Your credentials and your machines, under the same control plane."], ["Your cluster", "Attach Kubernetes you already run and address it like any other."]];

function Anywhere() {
  return (
    <section className="x-sec xpl-any">
      <div className="x-wrap">
        <SecHead kicker={"Anywhere"} title={"One control plane. Any infrastructure."} lede={"The API, the console, the identities and the bill stay the same when the machines underneath change."} />
        <div className="xpl-map2">
          <Rise className="xpl-plane"><b>Control plane</b><span>API · console · identities · bill</span></Rise>
          <svg viewBox="0 0 1000 140" preserveAspectRatio="none" className="xpl-wires" aria-hidden="true">
            {[167, 500, 833].map((x, i) => (
              <g key={x}>
                <path d={`M500 0 C500 70 ${x} 60 ${x} 140`} />
                <circle r="4.5" className="xpl-wire-dot" style={{ offsetPath: `path('M500 0 C500 70 ${x} 60 ${x} 140')`, animationDelay: i * 0.9 + 's' }} />
              </g>
            ))}
          </svg>
          <ul className="xpl-homes">
            {HOMES.map(([n, d], i) => (
              <Rise as="li" key={n} delay={0.1 + i * 0.1}>
                <h3>{n}</h3>
                <p>{d}</p>
              </Rise>
            ))}
          </ul>
        </div>
        <div className="x-row-links">
          <More to="https://docs.hanzo.ai/docs/openapi/compute">Compute API</More>
          <More to="https://docs.hanzo.ai/docs/openapi/node">Node API</More>
          <More to="/visor">Visor</More>
        </div>
      </div>
    </section>
  );
}

/* ---------- security: four locks, each ticks shut as it is reached ---------- */
const LOCKS = [['Identity', "One issuer for people, programs and agents, each request scoped to the org it acts for."], ['Permissions', "Access follows the resource, not the caller."], ['Secrets', "Held in KMS and handed only to the environment that needs them."], ['Audit', "Actions written to a trail you can query, attributable to whoever took them."]];

function Security() {
  return (
    <section className="x-sec xpl-sec">
      <div className="x-wrap xpl-sec-grid">
        <div className="xpl-sec-l">
          <SecHead kicker={"Security"} title={"Security is part of the cloud, not a product on top of it."} lede={"An agent gets an identity because it runs here, and the trail is written because every call goes through the same door."} />
          <div className="x-row-links tight">
            <More to="https://docs.hanzo.ai/docs/openapi/iam">IAM API</More>
            <More to="https://docs.hanzo.ai/docs/openapi/kms">KMS API</More>
            <More to="https://docs.hanzo.ai/docs/openapi/audit">Audit API</More>
            <More to="/security">Security</More>
          </div>
        </div>
        <ul className="xpl-locks">
          {LOCKS.map(([t, d], i) => (
            <Rise as="li" key={t} y={20} delay={i * 0.06}>
              <Tick delay={0.1} size={28} />
              <span><b>{t}</b><span>{d}</span></span>
            </Rise>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------- one API: one afternoon of calls, replayed ---------- */
const OPS = [
  { p: '/v1/models', cap: 'Start with the models.', m: 'GET', d: 'Returns the list of available models from the routing table.', tags: ['Models'] },
  { p: '/v1/agent' },
  { p: '/v1/function' },
  { p: '/v1/provisioning/sql' },
  { p: '/v1/provisioning/vector' },
  { p: '/v1/s3/buckets' },
  { p: '/v1/billing/usage', cap: "Watch what it cost.", m: 'GET', d: "Every billed call the caller's org made, attributed to a product", tags: ["AI Metrics", "Billing"] },
];

function OneApi() {
  const box = useRef(null);
  const seen = useInView(box, { amount: 0.4 });
  const calm = useReducedMotion();
  const [at, setAt] = useState(0);
  const [play, setPlay] = useState(true);
  useEffect(() => {
    if (!play || !seen || calm) return;
    const t = setInterval(() => setAt((v) => (v + 1) % OPS.length), 2200);
    return () => clearInterval(t);
  }, [play, seen, calm]);
  const on = play && !calm;
  return (
    <section className="x-sec xpl-api" ref={box}>
      <div className="x-wrap">
        <SecHead kicker="One API" title={"One API. Every capability."} lede={"The same key, organization, project, policy and usage ledger behind every path. The interface changes; the system does not."} />
        <div className="xpl-api-grid">
          <ul className="xpl-eps">
            {OPS.slice(0, 6).map((o, i) => (
              <li key={o.p}>
                <button type="button" className={at === i ? 'on' : ''} aria-pressed={at === i} onClick={() => { setAt(i); setPlay(false); }}>
                  <span>api.hanzo.ai</span><b>{o.p}</b>
                </button>
              </li>
            ))}
            <li className="xpl-eps-more"><span>api.hanzo.ai/v1/…</span></li>
          </ul>
          <div className="xpl-term">
            <div className="xpl-term-h">
              <p>{"One org, one afternoon: a spaceship shop that did not exist this morning."}</p>
              <button type="button" className="xpl-play" onClick={() => setPlay((v) => !v)} aria-label={on ? 'Pause the replay' : 'Play the replay'} aria-pressed={on}>
                <span className="a">Play</span><span className="b">Pause</span>
              </button>
            </div>
            <p className="xpl-term-s">{"Five operations, one key, no glue. Each is checked against the published OpenAPI document on every build."}</p>
            <div className="xpl-term-b">
              {OPS.map((o, i) => (
                <div key={o.p} className={'xpl-step' + (i === at ? ' on' : '')} aria-hidden={i !== at} inert={i !== at}>
                  {o.cap && <p className="xpl-cap">{o.cap}</p>}
                  <p className="xpl-call">{o.m && <em>{o.m}</em>}<span>api.hanzo.ai</span><b>{o.p}</b>{i === at && on && <i className="x-caret" aria-hidden="true" />}</p>
                  {o.d && <p className="xpl-res">{o.d}</p>}
                  {o.tags && <p className="xpl-tags">{o.tags.map((t) => <span key={t}>{t}</span>)}</p>}
                </div>
              ))}
            </div>
            <i className="xpl-prog" aria-hidden="true"><b style={{ transform: `scaleX(${(at + 1) / OPS.length})` }} /></i>
          </div>
        </div>
        <div className="x-row-links">
          <More to="https://docs.hanzo.ai/docs/openapi">Every capability</More>
          <More to="/api">The API</More>
        </div>
      </div>
    </section>
  );
}

/* ---------- ship: a commit rides the pipeline, station by station, forever ---------- */
const SHIP = [['Push', "A commit to the forge starts the build."], ['Build', "The image is built in the cluster, never on a laptop."], ['Release', "It rolls out with its secrets and its address, ready to roll back."], ['Observe', "Logs, metrics and traces from its first request."]];

function Ship() {
  return (
    <section className="x-sec xpl-ship">
      <div className="x-wrap">
        <SecHead kicker={"Ship"} title={"Push code. Get a production system."} lede={"An address, a certificate, secrets, metrics, logs and its share of the bill come back with it, because none of them is a separate purchase."} />
        <div className="xpl-line">
          <span className="xpl-rail2" aria-hidden="true"><i /></span>
          <ol>
            {SHIP.map(([t, d], i) => (
              <li key={t} style={{ '--i': i }}>
                <span className="xpl-stn" aria-hidden="true" />
                <h3>{t}</h3>
                <p>{d}</p>
              </li>
            ))}
          </ol>
        </div>
        <div className="x-row-links">
          <More to="https://docs.hanzo.ai/docs/openapi/deploy">Deploy API</More>
          <More to="https://docs.hanzo.ai/docs/openapi/registry">Registry API</More>
          <More to="https://docs.hanzo.ai/docs/cli">CLI docs</More>
          <More to="/registry">Registry</More>
        </div>
      </div>
    </section>
  );
}

/* ---------- open: the image we operate is the image you can pull ---------- */
function OpenSec() {
  return (
    <section className="x-sec xpl-open">
      <div className="x-wrap xpl-open-grid">
        <div>
          <SecHead kicker={"Open"} title={"Your cloud should not lock you in."} lede={"The platform is open source, and the image we operate is the image you can pull: the same API and console on your cluster, in your network or on a laptop."} />
          <div className="x-row-links tight">
            <More to="https://docs.hanzo.ai/docs/quickstart">Quickstart</More>
            <More to="/open-source">Open source</More>
            <More to="https://github.com/hanzoai/cloud">Source</More>
          </div>
        </div>
        <Rise className="xpl-sh2">
          {[['curl -fsSL https://hanzo.sh | sh', '1'], ['hanzo serve cloud', '2']].map(([c, n]) => (
            <div key={c} className="xpl-cmd"><span aria-hidden="true">{n}</span><code>{c}</code><Copy text={c} /></div>
          ))}
        </Rise>
      </div>
    </section>
  );
}

/* ---------- pricing: four meters that only run while the work runs ---------- */
const METERS = [['Models', 'By usage'], ['Compute', 'By execution'], ['Storage', 'By consumption'], ['Managed services', 'By usage']];

function Meter() {
  return (
    <section className="x-sec xpl-price">
      <div className="x-wrap">
        <SecHead kicker="Pricing" title={"Pay for what runs."} lede={"Nothing is billed for existing. One organization balance and one usage ledger, and every line traces back to a request."} />
        <ul className="xpl-meters">
          {METERS.map(([n, b], i) => (
            <Rise as="li" key={n} delay={i * 0.07}>
              <h3>{n}</h3>
              <p>{b}</p>
              <i className="xpl-tape" aria-hidden="true" style={{ '--d': i * 0.45 + 's' }} />
            </Rise>
          ))}
        </ul>
        <div className="x-row-links">
          <More to="https://docs.hanzo.ai/docs/pricing">Pricing docs</More>
          <More to="https://docs.hanzo.ai/docs/openapi/billing">Billing API</More>
          <More to="/pricing">Plans and rates</More>
        </div>
      </div>
    </section>
  );
}

/* ---------- catalog: every plane and what is in it ---------- */
const PLANES = [
  ['AI', '/products/models', [['Models', '/models'], ['Agents', '/agents'], ['Inference', '/engine'], ['Embeddings', '/cloud/embeddings'], ['Providers', '/cloud/providers']]],
  ['Compute', '/products/machines', [['GPUs', '/cloud/gpus'], ['Machines', '/machines'], ['Containers', '/cloud/containers'], ['Functions', '/functions'], ['Edge', '/edge']]],
  ['Data', '/products/memory', [['Datastore', '/datastore'], ['Object Storage', '/s3'], ['Base', '/base'], ['Memory', '/cloud/memory']]],
  ['Dev', '/products/agents', [['CLI', '/cli'], ['Playground', '/playground'], ['Desktop', '/desktop'], ['API Keys', '/cloud/api-keys']]],
  ['Observe', '/products/record', [['Logs', '/cloud/logs'], ['Metrics', '/metrics'], ['Dashboards', '/dashboards'], ['O11y', '/o11y'], ['AI Metrics', '/cloud/ai-metrics']]],
  ['Security', '/products/identity', [['IAM', '/iam'], ['Authz', '/authz'], ['KMS', '/kms'], ['Secrets', '/cloud/secrets'], ['Audit', '/cloud/audit']]],
  ['Network', '/products/machines', [['Gateway', '/gateway'], ['DNS', '/dns'], ['Service Mesh', '/cloud/service-mesh'], ['Nodes', '/cloud/nodes']]],
];

function Catalog() {
  return (
    <section className="x-sec xpl-cat">
      <div className="x-wrap">
        <SecHead kicker="Catalog" title={"Explore the platform."} lede={"Every plane, and what is in it."} />
        <ul className="xpl-planes">
          {PLANES.map(([n, to, items], i) => (
            <Rise as="li" key={n} delay={(i % 4) * 0.06} y={20}>
              <h3><A to={to}>{n}</A></h3>
              <ul>{items.map(([t, h]) => <li key={t}><A to={h}>{t}</A></li>)}</ul>
            </Rise>
          ))}
        </ul>
        <div className="x-row-links"><More to="/products">The complete catalog</More></div>
      </div>
    </section>
  );
}

function Close() {
  return (
    <section className="xpl-close">
      <div className="x-wrap">
        <Words text={"Build on the stack."} as="h2" className="xpl-close-a" />
        <Words text={"Or run it yourself."} as="h2" className="xpl-close-b" delay={0.2} />
        <Rise as="p" delay={0.3}>{"Models, agents, compute, data, security and observability behind one API, from prototype to production."}</Rise>
        <Rise className="xpl-acts" delay={0.4}>
          <Go to="https://platform.hanzo.ai/api-keys" solid>Start building</Go>
          <Go to="https://docs.hanzo.ai/docs/quickstart">Read the docs</Go>
        </Rise>
      </div>
    </section>
  );
}

export default function Platform() {
  return (
    <main className="xpl">
      <Hero />
      <Stack />
      <Kernel />
      <Reach />
      <Loop />
      <Compute />
      <Data />
      <Anywhere />
      <Security />
      <OneApi />
      <Ship />
      <OpenSec />
      <Meter />
      <Catalog />
      <Close />
    </main>
  );
}
