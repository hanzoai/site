'use client';
/* Platform (/platform), v2. Archetype B, System: a map you travel, from the whole into one part.
   Signature: the camera. The first screen is the whole stack, eleven plates as one white slab beside the headline.
   Scroll and the night comes in as a circle from the stack (a clip wipe), the plates pull apart, and the camera
   travels down the stack group by group (API, MIND, ACT, RUN, SILICON): the group's plates light in iris while the
   words for that group pin on the left. Any layer opens its inspector sheet (product, docs, source, why it matters,
   the measured proof). Below the map, the cloud is told plane by plane in sticky chapters (Compute, Data, Anywhere,
   Security, Ship, Pricing), and one API replays a live afternoon of calls that type themselves.
   Supporting motion (3): clip wipes between scenes, the One API replay typing, line-masked headlines played once.
   Beyond: ask the map. Type a word (CUDA, keys, routing, memory) and the plates whose own Hanzo descriptions use it
   light up in the stack, each with the phrase that matched and a click into its sheet. Built only from Hanzo's words.
   One accent: iris (#8b5cf6), from Hanzo's own art palette. One dark room: the map. Every word and link is Hanzo's. */
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, animate, useInView, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { Copy, Mark } from '../ui';
import { A } from '../kit';
import IsoStack, { zOf, LIFT } from '../v2/IsoStack';
import PinChapters from '../v2/PinChapters';
import SheetPanel from '../v2/SheetPanel';
import useCalm from '../v2/useCalm';
import './Platform.css';

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (t) => 1 - Math.pow(1 - clamp(t), 3);
const io = (t, a, b) => ease((t - a) / (b - a)); // 0→1 eased between a and b
const pad = (n) => String(n).padStart(2, '0');
/* piecewise-linear map of v from the stops in `a` to the values in `b`, clamped at both ends */
const map = (v, a, b) => {
  if (v <= a[0]) return b[0];
  for (let i = 1; i < a.length; i++) if (v <= a[i]) return b[i - 1] + (b[i] - b[i - 1]) * ((v - a[i - 1]) / (a[i] - a[i - 1] || 1));
  return b[b.length - 1];
};

/* is the page pinned (desktop, motion allowed)? the server renders the pinned layout; phones restyle by CSS */
function usePinned() {
  const [pinned, setPinned] = useState(true);
  useEffect(() => {
    const mq = matchMedia('(max-width: 900px), (prefers-reduced-motion: reduce)');
    const on = () => setPinned(!mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return pinned;
}

const scrollToY = (y) => (window.__lenis ? window.__lenis.scrollTo(y, { force: true }) : scrollTo({ top: y, behavior: 'smooth' }));

/* kinetic type: each line rises out of its own mask, once, when the heading is seen */
function Lines({ as: Tag = 'h2', lines, className = '', id, now }) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.4 });
  return (
    <Tag ref={ref} id={id} className={'xpl-lines ' + className} data-seen={now || seen}>
      {lines.map((l, i) => <span key={i} className="xpl-l"><span style={{ '--d': i * 0.09 + 's' }}>{l}</span></span>)}
    </Tag>
  );
}

const Arrow = () => <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const Go = ({ to, children }) => <A to={to} className="xpl-go"><span>{children}</span><Arrow /></A>;

/* ---------- the stack: eleven layers, Hanzo's words ---------- */
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
const ITEMS = LAYERS.map((l) => ({ key: l.n, n: l.n, name: l.name }));
const IN_GROUP = GROUPS.map((_, g) => LAYERS.map((l, i) => (l.g === g ? i : -1)).filter((i) => i >= 0));
const HAY = LAYERS.map((l) => [l.name, l.kick, l.d, l.why, l.extra && l.extra.stat, l.extra && l.extra.sd, l.extra && l.extra.text].filter(Boolean));
/* a stat as a hero figure: the number big, the words after it */
const Stat = ({ s }) => { const [f, ...r] = s.split(' '); return <><b>{f}</b> <span>{r.join(' ')}</span></>; };

/* the journey's timeline, as fractions of its scroll */
const T = { heroOut: [0.015, 0.085], wipe: [0.04, 0.15], explode: [0.07, 0.25], map: [0.14, 0.19], intro: [0.15, 0.2, 0.29, 0.33], g0: 0.34, lift: [0.955, 1] };
const GLEN = (1 - T.g0 - 0.03) / GROUPS.length;
const groupAt = (p) => (p < T.g0 ? -1 : Math.min(GROUPS.length - 1, Math.floor((p - T.g0) / GLEN)));
const zMid = (g, e) => { const b = IN_GROUP[g].map((i) => N - 1 - i); return (zOf(Math.min(...b), e) + zOf(Math.max(...b), e)) / 2; };

/* the camera at progress p (desktop): the whole stack, then each group in turn, eased between stops */
function camAt(p, k) {
  const e = io(p, ...T.explode);
  const sw = k * (1 - 0.36 * e); // the whole stack shrinks a little as it opens, so it always fits
  const whole = { y: LIFT * zMid(-1, e) * sw, s: sw, x: 0 };
  if (p < T.g0 - 0.06) return whole;
  const stops = [whole, ...GROUPS.map((_, g) => ({ y: LIFT * zMid(g, 1) * k * 1.3, s: k * 1.3, x: -60 * k }))];
  const at = [T.g0 - 0.06, ...GROUPS.map((_, g) => T.g0 + g * GLEN + GLEN * 0.35)];
  let j = at.length - 1;
  while (j > 0 && p < at[j]) j--;
  if (j === at.length - 1) return stops[j];
  const t = io(p, at[j], at[j + 1]);
  const m = (key) => stops[j][key] + (stops[j + 1][key] - stops[j][key]) * t;
  return { y: m('y'), s: m('s'), x: m('x') };
}
IN_GROUP[-1] = LAYERS.map((_, i) => i);

function Journey({ openLayer }) {
  const track = useRef(null);
  const art = useRef(null);
  const pinned = usePinned();
  const calm = useReducedMotion();
  const [g, setG] = useState(-1);
  const [ph, setPh] = useState(0); // 0: the hero, 1: the map
  const [hot, setHot] = useState(-1);
  const [q, setQ] = useState('');
  const k = useRef(1);
  const e = useMotionValue(0);
  const camY = useMotionValue(LIFT * zMid(-1, 0));
  const camS = useMotionValue(1);
  const camX = useMotionValue(0);
  const { scrollYProgress: p } = useScroll({ target: track, offset: ['start start', 'end end'] });

  // computed in JS on purpose: a plain range map would be handed to the browser's scroll timeline, which misreads a pinned track
  const heroY = useTransform(p, (v) => map(v, [0, T.heroOut[1]], [0, -90]));
  const heroO = useTransform(p, (v) => map(v, T.heroOut, [1, 0]));
  const chipsO = useTransform(p, (v) => map(v, [0, 0.04], [1, 0]));
  const mapO = useTransform(p, (v) => map(v, T.map, [0, 1]));
  const introO = useTransform(p, (v) => map(v, T.intro, [0, 1, 1, 0]));
  const introY = useTransform(p, (v) => map(v, T.intro, [36, 0, 0, -36]));
  // the night arrives as a circle opening from the stack, and lifts off as a card at the end
  const bgClip = useTransform(p, (v) => {
    if (v < T.lift[0]) return `circle(${(io(v, ...T.wipe) * 150).toFixed(2)}% at 72% 52%)`;
    const t = io(v, ...T.lift);
    return `inset(0% ${(t * 2.5).toFixed(2)}% ${(t * 3).toFixed(2)}% ${(t * 2.5).toFixed(2)}% round 0 0 ${(t * 44).toFixed(1)}px ${(t * 44).toFixed(1)}px)`;
  });

  const frame = (v) => {
    if (!pinned) return;
    e.set(io(v, ...T.explode));
    const c = camAt(v, k.current);
    camY.set(c.y);
    camS.set(c.s);
    camX.set(c.x);
    const gi = groupAt(v);
    setG((o) => (o === gi ? o : gi));
    const pi = v < 0.12 ? 0 : 1;
    setPh((o) => (o === pi ? o : pi));
  };
  useMotionValueEvent(p, 'change', frame);

  // fit the stack to its box; on phones and for reduced motion the stack opens by itself, once it is seen
  useEffect(() => {
    const el = art.current;
    const ro = new ResizeObserver(([r]) => {
      const { width: w, height: h } = r.contentRect;
      k.current = pinned ? clamp(Math.min(w / 560, h / 760), 0.42, 1.15) : clamp(Math.min(w / 520, h / 600), 0.4, 1);
      if (pinned) frame(p.get());
      else { camS.set(k.current); camY.set(LIFT * zMid(-1, e.get()) * k.current); }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [pinned]); // eslint-disable-line react-hooks/exhaustive-deps
  const artSeen = useInView(art, { once: true, amount: 0.4 });
  useEffect(() => {
    if (pinned) return;
    setG(-1);
    const sync = e.on('change', (v) => camY.set(LIFT * zMid(-1, v) * camS.get()));
    if (calm) { e.set(1); return sync; }
    if (!artSeen) return sync;
    const c = animate(e, 1, { duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.4 });
    return () => { c.stop(); sync(); };
  }, [pinned, calm, artSeen]); // eslint-disable-line react-hooks/exhaustive-deps

  // Beyond: ask the map
  const hits = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (s.length < 2) return null;
    return LAYERS.map((l, i) => {
      const t = HAY[i].find((x) => x.toLowerCase().includes(s));
      if (!t) return null;
      const at = t.toLowerCase().indexOf(s);
      const a = Math.max(0, at - 28);
      return { i, pre: (a ? '…' : '') + t.slice(a, at), hit: t.slice(at, at + s.length), post: t.slice(at + s.length, at + s.length + 36) + (at + s.length + 36 < t.length ? '…' : '') };
    }).filter(Boolean);
  }, [q]);
  const lit = hits ? new Set(hits.map((h) => h.i)) : null;
  const mark = (i) => {
    const h = i === hot ? ' hot' : '';
    if (lit) return (lit.has(i) ? 'match' : 'dim') + h;
    if (!pinned || g < 0) return h.trim();
    return (LAYERS[i].g === g ? 'lit' : 'dim') + h;
  };

  const goTo = (frac, now) => {
    const el = track.current;
    if (!el) return;
    if (!pinned) { document.getElementById('stack')?.scrollIntoView({ behavior: calm ? 'auto' : 'smooth' }); return; }
    const y = el.getBoundingClientRect().top + scrollY + (el.offsetHeight - innerHeight) * frac;
    if (now) { window.__lenis ? window.__lenis.scrollTo(y, { immediate: true, force: true }) : scrollTo(0, y); } else scrollToY(y);
  };
  // keyboard focus on a part of the map that is not on screen brings the camera there
  const follow = (frac, here) => () => { if (pinned && !here) goTo(frac, true); };

  const finder = (
    <div className="xpl-ask">
      <label className="xpl-ask-in">
        <span className="x-sr">Find in the stack</span>
        <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true"><circle cx="7" cy="7" r="4.6" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="M10.4 10.4 14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
        <input type="search" value={q} onChange={(ev) => setQ(ev.target.value)} placeholder="CUDA, keys, routing…" autoComplete="off" aria-describedby="xpl-ask-n" />
      </label>
      <p id="xpl-ask-n" className="xpl-ask-n" aria-live="polite">{hits ? `${hits.length} / ${N}` : ''}</p>
      {hits && (
        <ul className="xpl-ask-list">
          {hits.map((h) => (
            <li key={h.i}>
              <button type="button" onClick={() => openLayer(h.i)} aria-haspopup="dialog">
                <span className="xpl-ask-k">{LAYERS[h.i].n}</span>
                <b>{LAYERS[h.i].name}</b>
                <span className="xpl-ask-t">{h.pre}<mark>{h.hit}</mark>{h.post}</span>
              </button>
            </li>
          ))}
          {!hits.length && <li className="xpl-ask-none"><span>{q}</span><button type="button" className="xpl-chip" onClick={() => setQ('')}>Clear</button></li>}
        </ul>
      )}
    </div>
  );

  return (
    <section ref={track} className="xpl-jr" aria-labelledby="xpl-h1" data-ph={ph} data-g={g}>
      <span className="xpl-jr-dark" data-room="dark" aria-hidden="true" />
      <div className="xpl-jr-stage">
        <motion.div className="xpl-jr-bg" style={{ clipPath: pinned ? bgClip : undefined }} aria-hidden="true" />

        <motion.div className="xpl-hero" style={pinned ? { y: heroY, opacity: heroO } : undefined}>
          <div className="xpl-hero-t" onFocus={follow(0, ph === 0)}>
            <p className="xpl-kick">Hanzo Platform</p>
            <Lines as="h1" id="xpl-h1" className="xpl-display" lines={['The AI‑native', 'cloud.']} now />
            <p className="xpl-lede">Run models, agents, applications, data and infrastructure through one operating plane.</p>
            <p className="xpl-body">Kubernetes-native. Fully observable. Open source. Run it on Hanzo infrastructure or infrastructure you control.</p>
            <div className="xpl-acts">
              <A to="https://platform.hanzo.ai/api-keys" className="x-btn solid xpl-btn" data-thumb="">Start building</A>
              <a className="x-btn xpl-btn" href="#stack" onClick={(ev) => { ev.preventDefault(); goTo(0.235); }}>Inspect the stack</a>
            </div>
            <div className="xpl-run">
              <code>docker run -p 8080:8080 ghcr.io/hanzoai/cloud</code>
              <Copy text="docker run -p 8080:8080 ghcr.io/hanzoai/cloud" />
            </div>
          </div>
        </motion.div>

        <div ref={art} className="xpl-art">
          <IsoStack items={ITEMS} explode={e} camX={camX} camY={camY} camScale={camS} tone="light" mark={mark} onPick={openLayer} onHot={setHot} className="xpl-iso" />
        </div>

        <motion.div className="xpl-chips" aria-label="What runs on it" style={pinned ? { opacity: chipsO } : undefined}>
          <div className="xpl-chips-t">
            {[0, 1].map((r) => (
              <ul key={r} aria-hidden={r === 1 ? 'true' : undefined}>
                {['400+ callable models', 'GPUs', 'Functions', 'Containers', 'Databases', 'Observability', 'One API'].map((c) => <li key={c}>{c}</li>)}
              </ul>
            ))}
          </div>
        </motion.div>

        <motion.div id="stack" className="xpl-map" style={pinned ? { opacity: mapO } : undefined}>
          <i className="xpl-map-room" data-room="dark" aria-hidden="true" />
          <div className="xpl-bar xpl-bar-t" onFocus={follow(0.24, ph === 1)}>
            <span>Hanzo / architecture map</span>
            <span className={'xpl-hint' + (g >= 0 || lit ? ' off' : '')}>Select a layer</span>
            {finder}
          </div>

          <motion.header className="xpl-intro" onFocus={follow(0.24, ph === 1 && g < 0)} style={pinned ? { opacity: introO, y: introY } : undefined}>
            <p className="xpl-kick">The native AI stack</p>
            <Lines className="xpl-h2" lines={['One stack.', 'Down to the kernel.']} />
            <p className="xpl-lede">Build with agents. Route with Enso. Reason with Zen. Decide with Kai. Run on infrastructure you control.</p>
            <button type="button" className="x-btn xpl-btn xpl-btn-dk" onClick={() => openLayer(0)} aria-haspopup="dialog">Inspect every layer</button>
          </motion.header>

          <div className="xpl-groups">
            {GROUPS.map((name, gi) => {
              const ids = IN_GROUP[gi];
              const stat = ids.map((i) => LAYERS[i].extra && LAYERS[i].extra.stat).find(Boolean);
              return (
                <div key={name} className="xpl-grp" data-on={g === gi} data-past={g > gi} role="group" aria-label={name} onFocus={follow(T.g0 + gi * GLEN + GLEN * 0.5, g === gi)}>
                  <span className="xpl-mini" aria-hidden="true">{LAYERS.map((l, i) => <i key={i} className={l.g === gi ? 'on' : ''} />)}</span>
                  <p className="xpl-kick xpl-grp-k">{name}<span>{LAYERS[ids[0]].n}—{LAYERS[ids[ids.length - 1]].n}</span></p>
                  <ul className="xpl-rows">
                    {ids.map((i) => (
                      <li key={i}>
                        <button type="button" className={'xpl-row' + (lit && !lit.has(i) ? ' dim' : '') + (hot === i ? ' hot' : '')} onClick={() => openLayer(i)} aria-haspopup="dialog" onPointerEnter={(ev) => ev.pointerType === 'mouse' && setHot(i)} onPointerLeave={() => setHot(-1)} onFocus={() => setHot(i)} onBlur={() => setHot(-1)}>
                          <span className="xpl-row-n">{LAYERS[i].n}</span>
                          <span className="xpl-row-b"><b>{LAYERS[i].name}</b><em>{LAYERS[i].kick}</em></span>
                          <Arrow />
                        </button>
                      </li>
                    ))}
                  </ul>
                  {stat && <p className="xpl-grp-stat"><Stat s={stat} /></p>}
                </div>
              );
            })}
          </div>

          <div className="xpl-bar xpl-bar-b" onFocus={follow(0.24, ph === 1)}>
            <span>01—11 / owned and connected</span>
            <span>Interactive drawing · not telemetry</span>
            <span className="xpl-zap">
              <b>ZAP / native interconnect</b>
              <span>Agent ↔ tool RPC · MCP bridge · typed service communication</span>
              <A to="https://docs.hanzo.ai/docs/zap">Protocol</A>
              <A to="https://github.com/hanzoai/zap">Source</A>
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- the inspector: any layer, opened as a sheet ---------- */
function Inspector({ sel, open, onClose, step }) {
  return (
    <SheetPanel open={open} onClose={onClose} label="Layer inspector" className="xpl-sheet" head={<b className="xpl-sh-c" aria-live="polite">{pad(sel + 1)} / {N}</b>}>
      {LAYERS.map((l, i) => (
        <article key={l.n} className="xpl-ins" hidden={i !== sel}>
          <p className="xpl-kick">{l.kick}</p>
          <h3 className="xpl-ins-h">{l.name}</h3>
          <p className="xpl-ins-d">{l.d}</p>
          <ul className="xpl-pills">{l.links.map(([t, h]) => <li key={t}><A to={h} className="xpl-pill">{t}</A></li>)}</ul>
          <div className="xpl-why"><span className="xpl-kick">Why this layer matters</span><p>{l.why}</p></div>
          {l.extra && (
            <div className="xpl-proof">
              {l.extra.stat && <p className="xpl-proof-s"><Stat s={l.extra.stat} /></p>}
              {l.extra.sd && <p className="xpl-proof-sd">{l.extra.sd}</p>}
              {l.extra.text && <p className="xpl-proof-t">{l.extra.text}</p>}
              <div className="xpl-links">{l.extra.more.map(([t, h]) => <Go key={t} to={h}>{t}</Go>)}</div>
            </div>
          )}
        </article>
      ))}
      <div className="xpl-ins-f">
        <p><span>Select / explore</span> Product · docs · source</p>
        <div className="xpl-ins-nav">
          <button type="button" className="xpl-chip" onClick={() => step(-1)} aria-label="Previous layer"><svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M13 8H4M7.5 4.5 4 8l3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
          <button type="button" className="xpl-chip" onClick={() => step(1)} aria-label="Next layer"><Arrow /></button>
        </div>
      </div>
    </SheetPanel>
  );
}

/* ---------- one kernel, four targets ---------- */
const TARGETS = [
  ["01 / NVIDIA", 'CUDA', "CUDA kernels, attention and accelerated GPU operations.", 'https://github.com/hanzoai/ml/tree/main/hanzo-kernels'],
  ["02 / AMD", 'ROCm', "HIP/ROCm execution, attention and quantized operations.", 'https://github.com/hanzoai/ml/tree/main/hanzo-rocm-kernels'],
  ["03 / Cross-GPU", 'Vulkan', "SPIR-V shader paths and portable GPU execution.", 'https://github.com/hanzoai/ml/tree/main/hanzo-ml/src/vulkan'],
  ["04 / Apple", 'Metal', "Apple Silicon kernels and GPU-validated execution paths.", 'https://github.com/hanzoai/ml/tree/main/hanzo-metal-kernels'],
];
const FAN = [100, 300, 500, 700];

function Kernel() {
  return (
    <section className="xpl-sec xpl-kernel" aria-labelledby="xpl-kn-h">
      <div className="xpl-wrap xpl-kn-g">
        <div className="xpl-kn-l">
          <p className="xpl-kick">Kernel DSL</p>
          <Lines id="xpl-kn-h" className="xpl-h2" lines={['One kernel DSL.', 'Four targets.']} />
          <p className="xpl-body">Four parallel acceleration backends, not four extra hops. First-party kernels and performance tuning for supported workloads.</p>
        </div>
        <div className="xpl-fan">
          <div className="xpl-fan-src"><span className="xpl-kick">Rust</span><b>Kernel DSL</b></div>
          <svg className="xpl-fan-svg" viewBox="0 0 800 160" preserveAspectRatio="none" aria-hidden="true">
            {FAN.map((x) => <path key={x} d={`M400 0 C400 90 ${x} 70 ${x} 160`} />)}
            {FAN.map((x, i) => <circle key={'d' + x} r="5" className="xpl-fan-dot" style={{ offsetPath: `path('M400 0 C400 90 ${x} 70 ${x} 160')`, animationDelay: i * 0.45 + 's' }} />)}
          </svg>
          <ul className="xpl-targets">
            {TARGETS.map(([k, n, d, to]) => (
              <li key={n}>
                <span className="xpl-kick">{k}</span>
                <h3>{n}</h3>
                <p>{d}</p>
                <A to={to} className="xpl-go"><span>Explore<span className="x-sr"> {n}</span></span><Arrow /></A>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ---------- intelligence that connects to every layer: an Apple tile grid ---------- */
function Reach() {
  return (
    <section className="xpl-sec xpl-reach" aria-labelledby="xpl-rc-h">
      <div className="xpl-wrap">
        <header className="xpl-head">
          <Lines id="xpl-rc-h" className="xpl-h2" lines={['Intelligence that connects', 'to every layer.']} />
          <p className="xpl-body">Agent capabilities sit alongside the inference path; not every request crosses every subsystem.</p>
        </header>
        <div className="xpl-tiles">
          <article className="xpl-tile t-mem">
            <p className="xpl-kick">Retrieve / remember</p>
            <h3>Semantic + Graph</h3>
            <p className="xpl-tile-d">Semantic retrieval, durable memory, provenance and connected knowledge for agent work.</p>
            <p className="xpl-tile-fig"><Stat s="2.0× multi-hop evidence recall vs cosine" /></p>
            <p className="xpl-tile-sd">LoCoMo, held-out test split: every evidence turn of a multi-hop question in the top 20 for 37.5% of questions, against 18.8% for cosine search.</p>
            <ul className="xpl-pills">{[['Product', '/products/memory'], ['Docs', 'https://docs.hanzo.ai/docs/openapi/graph'], ['Source', 'https://github.com/hanzoai/semantic'], ['The LoCoMo run', '/benchmarks/locomo']].map(([t, h]) => <li key={t}><A to={h} className="xpl-pill">{t}</A></li>)}</ul>
            <svg className="xpl-graph" viewBox="0 0 220 160" aria-hidden="true"><path d="M30 80 L100 30 L190 60 L150 135 L60 128 Z M100 30 L150 135 M30 80 L190 60 M60 128 L190 60" />{[[30, 80], [100, 30], [190, 60], [150, 135], [60, 128]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="6" style={{ animationDelay: i * 0.6 + 's' }} />)}</svg>
          </article>
          <article className="xpl-tile t-code">
            <p className="xpl-kick">Understand / edit</p>
            <h3>Code Intelligence</h3>
            <p className="xpl-tile-d">Symbols, ASTs, references and repository-aware code navigation for coding agents.</p>
            <ul className="xpl-pills">{[['Product', '/dev'], ['Docs', 'https://docs.hanzo.ai/docs/openapi/code'], ['Source', 'https://github.com/hanzoai/lsp']].map(([t, h]) => <li key={t}><A to={h} className="xpl-pill">{t}</A></li>)}</ul>
          </article>
          <article className="xpl-tile t-forge">
            <p className="xpl-kick">Build / ship</p>
            <h3>Hanzo Forge</h3>
            <p className="xpl-tile-d">Source hosting, builds, CI/CD and deployments connecting agents to shipped software.</p>
            <ul className="xpl-pills">{[['Product', 'https://forge.hanzo.ai'], ['Docs', 'https://docs.hanzo.ai/docs/cli/platform'], ['Source', 'https://github.com/hanzoai/forge']].map(([t, h]) => <li key={t}><A to={h} className="xpl-pill">{t}</A></li>)}</ul>
          </article>
          <article className="xpl-tile t-edge">
            <p className="xpl-kick">Edge / ingress + egress</p>
            <p className="xpl-tile-l">Request boundary</p>
            <h3>In. Out. Under control.</h3>
            <p className="xpl-tile-d">Admission, auth, routing, streaming and responses are boundary functions around the stack rather than another inference step. Outbound calls carry delegated credentials that stay in KMS.</p>
            <ul className="xpl-pills">{[['Product', '/ingress'], ['Ingress', 'https://github.com/hanzoai/ingress'], ['Egress', 'https://github.com/hanzoai/egress']].map(([t, h]) => <li key={t}><A to={h} className="xpl-pill">{t}</A></li>)}</ul>
            <div className="xpl-flow" aria-hidden="true"><i /><i /><i /><u /></div>
          </article>
          <article className="xpl-tile t-trace">
            <div>
              <p className="xpl-kick">Telemetry / observability</p>
              <p className="xpl-tile-l">End to end</p>
              <h3>Everything leaves a trace.</h3>
              <p className="xpl-tile-d">Follow a request across models, decisions, tools and infrastructure to cost, quality, latency, usage and evaluation.</p>
              <ul className="xpl-pills">{[['Product', '/o11y'], ['Docs', 'https://docs.hanzo.ai/docs/openapi/o11y'], ['Source', 'https://github.com/hanzoai/o11y']].map(([t, h]) => <li key={t}><A to={h} className="xpl-pill">{t}</A></li>)}</ul>
            </div>
            <svg className="xpl-trace" viewBox="0 0 600 120" preserveAspectRatio="none" aria-hidden="true"><path d="M0 90 L60 90 L90 24 L140 102 L190 54 L240 78 L300 18 L360 90 L420 60 L480 84 L540 36 L600 66" /></svg>
          </article>
        </div>
      </div>
    </section>
  );
}

/* ---------- not just running: the improvement loop as a ring ---------- */
const LOOP = [
  ["01 / Observe", "Measure", "Traces · regressions"],
  ["02 / Propose", "Hypothesize", "Candidate upgrades"],
  ["03 / Isolate", "Experiment", "Sandboxed variants"],
  ["04 / Prove", "Benchmark", "Quality · latency · cost"],
  ["05 / Control", "Gate + promote", "Review · rollback"],
];
const FACTS = [
  ["11", "native layers", "Inspectable product, docs and source links for each architectural surface.", 'Open source', '/open-source'],
  ["4", "GPU backends", "CUDA, ROCm, Vulkan and Metal; backend-specific validation, never blanket speed claims.", 'Kernel DSL', 'https://github.com/hanzoai/ml/tree/main/hanzo-kernel'],
  ["", "Measure the work", "Published measurements are scoped to a named model, workload, hardware and baseline.", 'Benchmarks', '/benchmarks'],
];

function Loop() {
  const ref = useRef(null);
  const seen = useInView(ref, { amount: 0.4 });
  const calm = useReducedMotion();
  const [at, setAt] = useState(0);
  useEffect(() => {
    if (!seen || calm) return;
    const t = setInterval(() => setAt((v) => (v + 1) % LOOP.length), 1900);
    return () => clearInterval(t);
  }, [seen, calm]);
  return (
    <section className="xpl-sec xpl-loop" aria-labelledby="xpl-lp-h">
      <div className="xpl-wrap xpl-lp-g">
        <div className="xpl-lp-l">
          <p className="xpl-kick">Research / recursive improvement</p>
          <Lines id="xpl-lp-h" className="xpl-h2" lines={['Not just running.', 'Learning.']} />
          <div className="xpl-links"><Go to="/research">Research</Go><Go to="/benchmarks">Benchmarks</Go><Go to="https://github.com/hanzoai/benchmarks">Harness</Go></div>
          <p className="xpl-body xpl-soft">A modular feedback architecture, not a claim of unattended production self-modification. Only candidates that meet the relevant evaluation and release gates are promoted.</p>
        </div>
        <div ref={ref} className="xpl-ring" style={{ '--at': at }}>
          <span className="xpl-ring-c" aria-hidden="true" />
          <span className="xpl-ring-arc" aria-hidden="true" />
          <p className="xpl-ring-mid" aria-hidden="true"><b>{pad(at + 1)}</b><span>/ {pad(LOOP.length)}</span></p>
          <ol>
            {LOOP.map(([n, t, s], i) => (
              <li key={n} style={{ '--i': i }} className={i === at ? 'on' : ''} aria-current={i === at ? 'step' : undefined}>
                <i className="xpl-ring-d" aria-hidden="true" />
                <span className="xpl-ring-lab">
                  <span className="xpl-ring-n">{n}</span>
                  <b>{t}</b>
                  <small>{s}</small>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
      <div className="xpl-wrap">
        <ul className="xpl-facts">
          {FACTS.map(([f, h, d, l, to]) => (
            <li key={h}>
              <p className="xpl-fact-h">{f && <b>{f}</b>} <span>{h}</span></p>
              <p className="xpl-fact-d">{d}</p>
              <Go to={to}>{l}</Go>
            </li>
          ))}
        </ul>
        <p className="xpl-foot">GPU targets are parallel hardware backends, not sequential stages. Zen is generative reasoning; Kai provides decision intelligence. ZAP is a native RPC protocol for supported interconnect paths. Research and evaluation form a gated improvement loop. “Native” describes Hanzo’s architecture surfaces; not every implementation, weight, driver or operating system is owned or open sourced by Hanzo.</p>
      </div>
    </section>
  );
}

/* ---------- the cloud, plane by plane: sticky chapters ---------- */
const TILES = [['Chat', '/cloud/chat'], ['Bot', '/bot'], ['Search', '/search'], ['Crawl', '/crawl'], ['Studio', '/studio'], ['Console', '/console'], ['Referrals', '/cloud/referrals'], ['Marketplace', '/cloud/marketplace']];
const NAV = [['GPUs', '/cloud/gpus'], ['Machines', '/machines'], ['Containers', '/cloud/containers'], ['Functions', '/functions'], ['Edge', '/edge'], ['Applications', '/cloud/applications'], ['Clusters', '/cloud/clusters'], ['Kubernetes', '/cloud/kubernetes']];
const ROWS = [['gateway', 'Ready'], ['payments-api', 'Ready'], ['checkout-web', 'Building'], ['docs-site', 'Ready']];
const LADDER = [['Functions', "Scale to zero between calls.", 14], ['Containers', "Your image, deployed and addressable.", 32], ['Sandboxes', "Isolated shells for agents and untrusted code.", 50], ['Machines', "A whole machine, by the second.", 68], ['GPUs', "Accelerators attached to any of them.", 84], ['Kubernetes', "The substrate all of it runs on.", 100]];
const DEPLOY = [['Containers', "Deploy an image and invoke it. Deployments, triggers, secrets, metrics and logs are all part of the same surface, so a function you ship is a function you can watch."], ['Machines', "A whole machine, by the second."], ['Sandboxes', "Isolated shells for agents and untrusted code."]];

function ConsoleWin() {
  const [tab, setTab] = useState(0);
  const keys = (ev) => {
    const d = { ArrowRight: 1, ArrowLeft: -1 }[ev.key];
    if (!d) return;
    ev.preventDefault();
    const n = (tab + d + DEPLOY.length) % DEPLOY.length;
    setTab(n);
    document.getElementById('xpl-tab-' + n)?.focus();
  };
  return (
    <div className="xpl-win">
      <div className="xpl-win-bar">
        <span className="xpl-dots" aria-hidden="true"><i /><i /><i /></span>
        <A to="https://hanzo.team/" className="xpl-win-t"><Mark size={13} /> <span>API Platform</span> <span className="xpl-win-h">— Hanzo</span></A>
      </div>
      <div className="xpl-win-body">
        <ul className="xpl-win-nav">{NAV.map(([t, h], i) => <li key={t}><A to={h} className={i === 0 ? 'on' : ''}>{t}</A></li>)}</ul>
        <div className="xpl-win-main">
          <ul className="xpl-win-tiles">{TILES.map(([t, h]) => <li key={t}><A to={h}><i aria-hidden="true">{t[0]}</i>{t}</A></li>)}</ul>
          <div className="xpl-tabs" role="tablist" aria-label="Kinds of work" onKeyDown={keys}>
            {DEPLOY.map(([t], i) => (
              <button key={t} id={'xpl-tab-' + i} type="button" role="tab" aria-selected={tab === i} aria-controls={'xpl-pane-' + i} tabIndex={tab === i ? 0 : -1} onClick={() => setTab(i)}>
                {tab === i && <motion.span layoutId="xpl-tab-bg" className="xpl-tab-bg" transition={{ type: 'spring', stiffness: 300, damping: 30 }} />}
                <span>{t}</span>
              </button>
            ))}
          </div>
          {DEPLOY.map(([t, d], i) => <p key={t} id={'xpl-pane-' + i} role="tabpanel" aria-labelledby={'xpl-tab-' + i} hidden={tab !== i} className="xpl-pane">{d}</p>)}
          <ul className="xpl-win-rows">
            {ROWS.map(([n, s], i) => (
              <li key={n} className={s === 'Building' ? 'busy' : ''}>
                <b>{n}</b>
                <span className="xpl-st"><i aria-hidden="true" />{s}</span>
                {i === 0 && <small>Every request enters here, so the limiter does too.</small>}
              </li>
            ))}
          </ul>
          <p className="xpl-ep"><span>api.hanzo.ai</span><b>/v1/functions</b></p>
        </div>
      </div>
      <div className="xpl-win-f">
        <A to="/home" className="xpl-go"><span>Open in the console</span><Arrow /></A>
        <small>Example project. Every name in it is one you would give your own.</small>
      </div>
    </div>
  );
}

const PRIM = [['Datastore', "Columnar analytics over everything you collected.", '/datastore'], ['Object Storage', "Objects, signed URLs, lifecycle rules.", '/s3'], ['Base', "An application backend: records, rules, realtime.", '/base'], ['Memory', "What an agent is allowed to remember between runs.", '/cloud/memory']];
function Shape({ k }) {
  if (k === 0) return <span className="xpl-sh cols" aria-hidden="true">{[40, 72, 54, 90, 62, 80, 46].map((h, i) => <i key={i} style={{ '--h': h + '%', '--d': i * 0.23 + 's' }} />)}</span>;
  if (k === 1) return <span className="xpl-sh objs" aria-hidden="true">{Array.from({ length: 12 }).map((_, i) => <i key={i} style={{ '--d': i * 0.31 + 's' }} />)}</span>;
  if (k === 2) return <span className="xpl-sh recs" aria-hidden="true">{[0, 1, 2, 3].map((i) => <i key={i} style={{ '--d': i * 0.7 + 's' }}><u /><u /><u /></i>)}</span>;
  return <svg className="xpl-sh mem" viewBox="0 0 120 80" aria-hidden="true"><path d="M20 40 L60 14 L100 36 L78 66 L38 62 Z M60 14 L78 66 M20 40 L100 36 M38 62 L100 36" />{[[20, 40], [60, 14], [100, 36], [78, 66], [38, 62]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="4.5" style={{ animationDelay: i * 0.5 + 's' }} />)}</svg>;
}
const HOMES = [['Hanzo Cloud', "Capacity we operate and meter, provisioned by the call."], ["Your cloud account", "Your credentials and your machines, under the same control plane."], ["Your cluster", "Attach Kubernetes you already run and address it like any other."]];
const LOCKS = [['Identity', "One issuer for people, programs and agents, each request scoped to the org it acts for."], ['Permissions', "Access follows the resource, not the caller."], ['Secrets', "Held in KMS and handed only to the environment that needs them."], ['Audit', "Actions written to a trail you can query, attributable to whoever took them."]];
const SHIP = [['Push', "A commit to the forge starts the build."], ['Build', "The image is built in the cluster, never on a laptop."], ['Release', "It rolls out with its secrets and its address, ready to roll back."], ['Observe', "Logs, metrics and traces from its first request."]];
const METERS = [['Models', 'By usage'], ['Compute', 'By execution'], ['Storage', 'By consumption'], ['Managed services', 'By usage']];

const Ch = ({ k, title, lede, links, children }) => (
  <>
    <p className="xpl-kick">{k}</p>
    <h2 className="xpl-h2 xpl-ch-h">{title}</h2>
    <p className="xpl-body">{lede}</p>
    {children}
    <div className="xpl-links">{links.map(([t, h]) => <Go key={t} to={h}>{t}</Go>)}</div>
  </>
);

const PLANES = [
  {
    id: 'compute', tab: 'Compute',
    copy: (
      <Ch k="Compute" title="One runtime for every kind of work." lede="The same plane, held for a millisecond or for a month. What changes is how much of a machine the work needs, not what you have to learn." links={[['Compute API', 'https://docs.hanzo.ai/docs/openapi/compute'], ['Function API', 'https://docs.hanzo.ai/docs/openapi/function'], ['Sandbox API', 'https://docs.hanzo.ai/docs/openapi/sandbox'], ['Machines', '/machines']]}>
        <ol className="xpl-lad">{LADDER.map(([n, d, w], i) => <li key={n} style={{ '--w': w / 100, '--i': i }}><b>{n}</b><span>{d}</span><i aria-hidden="true"><u /></i></li>)}</ol>
      </Ch>
    ),
    visual: <ConsoleWin />,
  },
  {
    id: 'data', tab: 'Data',
    copy: <Ch k="Data" title="The data primitives AI applications use." lede="Each primitive is the right shape for its job, and they share one project, one key and one bill." links={[['Base API', 'https://docs.hanzo.ai/docs/openapi/base'], ['Object storage API', 'https://docs.hanzo.ai/docs/openapi/s3'], ['KV API', 'https://docs.hanzo.ai/docs/openapi/kv'], ['Hanzo Base', '/base']]} />,
    visual: (
      <ul className="xpl-prims">
        {PRIM.map(([n, d, to], i) => <li key={n}><A to={to} className="xpl-prim"><Shape k={i} /><h3>{n}</h3><p>{d}</p></A></li>)}
      </ul>
    ),
  },
  {
    id: 'anywhere', tab: 'Anywhere',
    copy: <Ch k="Anywhere" title="One control plane. Any infrastructure." lede="The API, the console, the identities and the bill stay the same when the machines underneath change." links={[['Compute API', 'https://docs.hanzo.ai/docs/openapi/compute'], ['Node API', 'https://docs.hanzo.ai/docs/openapi/node'], ['Visor', '/visor']]} />,
    visual: (
      <div className="xpl-any">
        <div className="xpl-plane"><b>Control plane</b><span>API · console · identities · bill</span></div>
        <svg viewBox="0 0 1000 150" preserveAspectRatio="none" className="xpl-wires" aria-hidden="true">
          {[167, 500, 833].map((x, i) => (
            <g key={x}><path d={`M500 0 C500 80 ${x} 70 ${x} 150`} /><circle r="5" className="xpl-wire-dot" style={{ offsetPath: `path('M500 0 C500 80 ${x} 70 ${x} 150')`, animationDelay: i * 0.9 + 's' }} /></g>
          ))}
        </svg>
        <ul className="xpl-homes">{HOMES.map(([n, d]) => <li key={n}><h3>{n}</h3><p>{d}</p></li>)}</ul>
      </div>
    ),
  },
  {
    id: 'security', tab: 'Security',
    copy: <Ch k="Security" title="Security is part of the cloud, not a product on top of it." lede="An agent gets an identity because it runs here, and the trail is written because every call goes through the same door." links={[['IAM API', 'https://docs.hanzo.ai/docs/openapi/iam'], ['KMS API', 'https://docs.hanzo.ai/docs/openapi/kms'], ['Audit API', 'https://docs.hanzo.ai/docs/openapi/audit'], ['Security', '/security']]} />,
    visual: (
      <ul className="xpl-locks">
        {LOCKS.map(([t, d], i) => (
          <li key={t} style={{ '--i': i }}>
            <svg viewBox="0 0 28 28" width="28" height="28" aria-hidden="true"><circle cx="14" cy="14" r="13" /><path d="M8.5 14.5l3.6 3.6 7.4-8" /></svg>
            <span><b>{t}</b><span>{d}</span></span>
          </li>
        ))}
      </ul>
    ),
  },
  {
    id: 'ship', tab: 'Ship',
    copy: <Ch k="Ship" title="Push code. Get a production system." lede="An address, a certificate, secrets, metrics, logs and its share of the bill come back with it, because none of them is a separate purchase." links={[['Deploy API', 'https://docs.hanzo.ai/docs/openapi/deploy'], ['Registry API', 'https://docs.hanzo.ai/docs/openapi/registry'], ['CLI docs', 'https://docs.hanzo.ai/docs/cli'], ['Registry', '/registry']]} />,
    visual: (
      <div className="xpl-line">
        <span className="xpl-rail" aria-hidden="true"><i /></span>
        <ol>{SHIP.map(([t, d], i) => <li key={t} style={{ '--i': i }}><span className="xpl-stn" aria-hidden="true" /><h3>{t}</h3><p>{d}</p></li>)}</ol>
      </div>
    ),
  },
  {
    id: 'pricing', tab: 'Pricing',
    copy: <Ch k="Pricing" title="Pay for what runs." lede="Nothing is billed for existing. One organization balance and one usage ledger, and every line traces back to a request." links={[['Pricing docs', 'https://docs.hanzo.ai/docs/pricing'], ['Billing API', 'https://docs.hanzo.ai/docs/openapi/billing'], ['Plans and rates', '/pricing']]} />,
    visual: (
      <ul className="xpl-meters">
        {METERS.map(([n, b], i) => <li key={n}><h3>{n}</h3><p>{b}</p><i className="xpl-tape" aria-hidden="true" style={{ '--d': i * 0.45 + 's' }} /></li>)}
      </ul>
    ),
  },
];

function Planes() {
  return (
    <section className="xpl-planes" aria-label="The cloud, plane by plane">
      <PinChapters label="Planes" chapters={PLANES} className="xpl-pc" />
    </section>
  );
}

/* ---------- one API: one afternoon of calls, replayed, each path typing itself ---------- */
const OPS = [
  { p: '/v1/models', cap: 'Start with the models.', m: 'GET', d: 'Returns the list of available models from the routing table.', tags: ['Models'] },
  { p: '/v1/agent' }, { p: '/v1/function' }, { p: '/v1/provisioning/sql' }, { p: '/v1/provisioning/vector' }, { p: '/v1/s3/buckets' },
  { p: '/v1/billing/usage', cap: "Watch what it cost.", m: 'GET', d: "Every billed call the caller's org made, attributed to a product", tags: ["AI Metrics", "Billing"] },
];

/* the call path types itself into a text node, a character at a time (no React state per character) */
function typing(el, text, alive) {
  return new Promise((done) => {
    let i = 0;
    el.textContent = '';
    const step = () => {
      if (!alive()) return done(false);
      el.textContent = text.slice(0, ++i);
      if (i < text.length) setTimeout(step, 42); else done(true);
    };
    setTimeout(step, 160);
  });
}

function OneApi() {
  const box = useRef(null);
  const out = useRef([]);
  const seen = useInView(box, { amount: 0.35 });
  const calm = useCalm();
  const [at, setAt] = useState(0);
  const [play, setPlay] = useState(true);
  const on = play && !calm;
  useEffect(() => {
    if (!on || !seen) return;
    let live = true;
    const el = out.current[at];
    if (el) typing(el, OPS[at].p, () => live);
    const t = setTimeout(() => live && setAt((v) => (v + 1) % OPS.length), 2600);
    return () => { live = false; clearTimeout(t); if (el) el.textContent = OPS[at].p; };
  }, [at, on, seen]);
  return (
    <section className="xpl-sec xpl-api" aria-labelledby="xpl-api-h">
      <div className="xpl-wrap">
        <header className="xpl-head xpl-api-head">
          <div>
            <p className="xpl-kick">One API</p>
            <Lines id="xpl-api-h" className="xpl-h2" lines={['One API.', 'Every capability.']} />
          </div>
          <p className="xpl-body">The same key, organization, project, policy and usage ledger behind every path. The interface changes; the system does not.</p>
        </header>
        <div ref={box} className="xpl-term">
          <ul className="xpl-eps">
            {OPS.slice(0, 6).map((o, i) => (
              <li key={o.p}>
                <button type="button" className={at === i ? 'on' : ''} aria-pressed={at === i} onClick={() => { setAt(i); setPlay(false); }}>
                  {at === i && <motion.span layoutId="xpl-ep-bg" className="xpl-ep-bg" transition={{ type: 'spring', stiffness: 300, damping: 30 }} />}
                  <span>api.hanzo.ai</span><b>{o.p}</b>
                </button>
              </li>
            ))}
            <li className="xpl-eps-more"><span>api.hanzo.ai/v1/…</span></li>
          </ul>
          <div className="xpl-term-r">
            <div className="xpl-term-h">
              <p>One org, one afternoon: a spaceship shop that did not exist this morning.</p>
              <button type="button" className="xpl-play" onClick={() => setPlay((v) => !v)} aria-label={on ? 'Pause the replay' : 'Play the replay'} aria-pressed={on}>
                <span className="a">Play</span><span className="b">Pause</span>
              </button>
            </div>
            <p className="xpl-term-s">Five operations, one key, no glue. Each is checked against the published OpenAPI document on every build.</p>
            <div className="xpl-term-b">
              {OPS.map((o, i) => (
                <div key={o.p} className={'xpl-step' + (i === at ? ' on' : '')} aria-hidden={i !== at} inert={i !== at}>
                  {o.cap && <p className="xpl-cap">{o.cap}</p>}
                  <p className="xpl-call">{o.m && <em>{o.m}</em>}<span>api.hanzo.ai</span><b ref={(el) => { out.current[i] = el; }}>{o.p}</b>{i === at && on && <i className="xpl-caret" aria-hidden="true" />}</p>
                  {o.d && <p className="xpl-res">{o.d}</p>}
                  {o.tags && <p className="xpl-tags">{o.tags.map((t) => <span key={t}>{t}</span>)}</p>}
                </div>
              ))}
            </div>
            <i className="xpl-prog" aria-hidden="true"><b style={{ transform: `scaleX(${(at + 1) / OPS.length})` }} /></i>
          </div>
        </div>
        <div className="xpl-links"><Go to="https://docs.hanzo.ai/docs/openapi">Every capability</Go><Go to="/api">The API</Go></div>
      </div>
    </section>
  );
}

/* ---------- open: the image we operate is the image you can pull ---------- */
function OpenSec() {
  return (
    <section className="xpl-sec xpl-open" aria-labelledby="xpl-op-h">
      <div className="xpl-wrap xpl-op-g">
        <div>
          <p className="xpl-kick">Open</p>
          <Lines id="xpl-op-h" className="xpl-h2 xpl-op-h" lines={['Your cloud should', 'not lock you in.']} />
        </div>
        <div className="xpl-op-r">
          <p className="xpl-lede">The platform is open source, and the image we operate is the image you can pull: the same API and console on your cluster, in your network or on a laptop.</p>
          <div className="xpl-cmds">
            {[['curl -fsSL https://hanzo.sh | sh', '1'], ['hanzo serve cloud', '2']].map(([c, n]) => (
              <div key={c} className="xpl-cmd"><span aria-hidden="true">{n}</span><code>{c}</code><Copy text={c} /></div>
            ))}
          </div>
          <div className="xpl-links"><Go to="https://docs.hanzo.ai/docs/quickstart">Quickstart</Go><Go to="/open-source">Open source</Go><Go to="https://github.com/hanzoai/cloud">Source</Go></div>
        </div>
      </div>
    </section>
  );
}

/* ---------- catalog: every plane, as cards that open into their pages ---------- */
const CAT = [
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
    <section className="xpl-sec xpl-cat" aria-labelledby="xpl-cat-h">
      <div className="xpl-wrap">
        <header className="xpl-head xpl-cat-head">
          <div>
            <p className="xpl-kick">Catalog</p>
            <Lines id="xpl-cat-h" className="xpl-h2" lines={['Explore the platform.']} />
          </div>
          <p className="xpl-body">Every plane, and what is in it.</p>
        </header>
        <ul className="xpl-cards">
          {CAT.map(([n, to, items], i) => (
            <li key={n} className={'xpl-card c' + i}>
              <A to={to} className="xpl-card-h" data-morph><span className="xpl-kick">{pad(i + 1)}</span><b>{n}</b><Arrow /></A>
              <ul>{items.map(([t, h]) => <li key={t}><A to={h}>{t}</A></li>)}</ul>
            </li>
          ))}
        </ul>
        <div className="xpl-links"><Go to="/products">The complete catalog</Go></div>
      </div>
    </section>
  );
}

function Close() {
  return (
    <section className="xpl-close" aria-labelledby="xpl-close-h">
      <div className="xpl-wrap">
        <h2 id="xpl-close-h" className="xpl-display xpl-close-h"><span>Build on the stack.</span> <span>Or run it yourself.</span></h2>
        <div className="xpl-close-r">
          <p className="xpl-lede">Models, agents, compute, data, security and observability behind one API, from prototype to production.</p>
          <div className="xpl-acts">
            <A to="https://platform.hanzo.ai/api-keys" className="x-btn solid xpl-btn">Start building</A>
            <A to="https://docs.hanzo.ai/docs/quickstart" className="x-btn xpl-btn">Read the docs</A>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Platform() {
  const [sel, setSel] = useState(0);
  const [open, setOpen] = useState(false);
  const openLayer = (i) => { setSel(i); setOpen(true); };
  const step = (d) => setSel((s) => (s + d + N) % N);
  return (
    <main className="xpl">
      <Journey openLayer={openLayer} />
      <Kernel />
      <Reach />
      <Loop />
      <Planes />
      <OneApi />
      <OpenSec />
      <Catalog />
      <Close />
      <Inspector sel={sel} open={open} onClose={() => setOpen(false)} step={step} />
    </main>
  );
}
