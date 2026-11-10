'use client';
/* Platform (/platform). Archetype B, System: a map you zoom into, from the whole into one part (MASTER 4.2).
   Persona: Developer (MASTER part 1), with the enterprise buyer second.
   Goal: api_key_created.   CTA: "Start building" → platform.hanzo.ai/api-keys (hero, the site's sticky ask via data-thumb,
   the closing Band). Live /platform has no sales ask, so Hanzo's own label stays.
   Signature: the camera. The first screen is the whole stack resting slightly open beside the headline; on arrival each
   of the eleven plates slides out and names itself once (under 5 s), then the pointer turns it. Scroll and the headline
   settles from 84 to 52px while the black room rises as a rounded card and opens to full width; the plates pull apart and
   the camera travels down the stack group by group (API, MIND, ACT, RUN, SILICON), each group's words pinned on the left
   and its figure growing while it is the moment. Any layer opens its sheet (layer 11 holds the kernel's four targets).
   Order (MASTER 4.2 /platform): hero and map, the product directory, the planes, then capabilities, One API, the loop,
   open, the figures, the Band. About 15 screens at 1470×801 before the footer.
   Scale rhythm (MASTER 3.1): one big thing per screen; headings rest at 26px, figures at 64px, h1 at 52px.
   Motion mix (scroll is half at most): scroll (the camera; the plane chapters), idle (the arrival walk, the capability
   walk, the One API replay, the improvement ring; each with a pause where it runs past 5 s), pointer (the stack turns,
   directory previews), state (sheets rise, tab and endpoint pills glide), arrival (headlines cut into their lines).
   Beyond: ask the map. Type a word (CUDA, keys, routing, memory) and the plates whose own Hanzo descriptions use it
   light up in the stack, each with the phrase that matched and a click into its sheet. Built only from Hanzo's words.
   V2: 8/10 the camera through the stack with words and plates in step (the camera crosses groups only around the switch, the words crossfade), a directory that reads 01-07, shorter planes, and five section entrances (inertia-drag, count-roll, spiral-in, underline-sweep, explode-gather).
   Colour: none. Deck greys, ink and white only. One dark room (the map) and the closing Band.
   Every word and link is Hanzo's (parity 330/330, 129/129). Coverage: docs/build-notes/coverage/platform.md. */
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, animate, useInView, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { Mark, Copy } from '../ui';
import { A, Band, Tabs, TabPanel, Cta } from '../kit';
import Sigil from '../Sigil';
import IsoStack, { zOf, LIFT } from '../v2/IsoStack';
import PinChapters from '../v2/PinChapters';
import SheetPanel from '../v2/SheetPanel';
import useCalm from '../v2/useCalm';
import { CAT } from './platformData';
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
const KEY_URL = 'https://platform.hanzo.ai/api-keys';

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

/* the pointer turns the stack (fine pointers only): two CSS variables, the stack follows with a soft transition */
const turn = (e) => {
  if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--iso-tz', (((e.clientX - r.left) / r.width - 0.5) * 14).toFixed(2) + 'deg');
  e.currentTarget.style.setProperty('--iso-tx', (((e.clientY - r.top) / r.height - 0.5) * -8).toFixed(2) + 'deg');
};
const rest = (e) => { e.currentTarget.style.setProperty('--iso-tz', '0deg'); e.currentTarget.style.setProperty('--iso-tx', '0deg'); };

/* kinetic type: each line rises out of its own mask, once, when the heading is seen (no-JS: shown, see NOJS) */
function Lines({ as: Tag = 'h2', lines, className = '', id, now }) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.4 });
  return (
    <Tag ref={ref} id={id} className={'xpl-lines ' + className} data-seen={now || seen}>
      {lines.map((l, i) => <span key={i} className="xpl-l"><span style={{ '--d': i * 0.09 + 's' }}>{l}</span></span>)}
    </Tag>
  );
}

/* a command as Hanzo prints it: "$ " and the command in one line of text (the prompt is greyed in CSS); Copy copies the
   command without the prompt */
const Cmd = ({ code, className = '' }) => (
  <figure className={'x-codeblock xpl-cmd ' + className} data-room="dark">
    <figcaption className="x-codeblock-h"><span /><Copy text={code} /></figcaption>
    <pre tabIndex={0} aria-label="Code"><code><span className="x-codeblock-l xpl-cmd-l">{'$ ' + code}</span></code></pre>
  </figure>
);

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
IN_GROUP[-1] = LAYERS.map((_, i) => i);
const HAY = LAYERS.map((l) => [l.name, l.kick, l.d, l.why, l.extra && l.extra.stat, l.extra && l.extra.sd, l.extra && l.extra.text].filter(Boolean));
/* a stat as a hero figure: the number big, the words after it */
const Stat = ({ s }) => { const [f, ...r] = s.split(' '); return <><b>{f}</b> <span>{r.join(' ')}</span></>; };

/* the journey's timeline, as fractions of its scroll */
const REST = 0.34; // the stack rests slightly open on the first screen, so its plates read as layers, not one slab
const T = { heroOut: [0.015, 0.085], wipe: [0.04, 0.15], explode: [0.07, 0.25], map: [0.075, 0.1], intro: [0.08, 0.115, 0.33, 0.355], g0: 0.34, close: [1.5, 1.6] }; // the room no longer closes: the map scrolls away whole and the directory follows (no blank screen)
const GLEN = (1 - T.g0 - 0.02) / GROUPS.length;
const groupAt = (p) => (p < T.g0 ? -1 : Math.min(GROUPS.length - 1, Math.floor((p - T.g0) / GLEN)));
const zMid = (g, e) => { const b = IN_GROUP[g].map((i) => N - 1 - i); return (zOf(Math.min(...b), e) + zOf(Math.max(...b), e)) / 2; };

/* the camera at progress p (desktop): the whole stack, then each group in turn, eased between stops */
function camAt(p, k) {
  const e = io(p, ...T.explode);
  const sw = k * (1 - 0.36 * e); // the whole stack shrinks a little as it opens, so it always fits
  const whole = { y: LIFT * zMid(-1, e) * sw, s: sw, x: 0 };
  if (p < T.g0 - 0.06) return whole;
  // the camera holds on a group while its words are up and crosses to the next only around the boundary where the words
  // change (within ±HOP of it), so the plates and the words on the left move in step
  const grp = GROUPS.map((_, g) => ({ y: LIFT * zMid(g, 1) * k * 1.3, s: k * 1.3, x: -60 * k }));
  const HOP = 0.015;
  const stops = [whole], at = [T.g0 - 0.03];
  GROUPS.forEach((_, g) => { stops.push(grp[g], grp[g]); at.push(T.g0 + g * GLEN + HOP, T.g0 + (g + 1) * GLEN - HOP); });
  let j = at.length - 1;
  while (j > 0 && p < at[j]) j--;
  if (j === at.length - 1) return stops[j];
  const t = io(p, at[j], at[j + 1]);
  const m = (key) => stops[j][key] + (stops[j + 1][key] - stops[j][key]) * t;
  return { y: m('y'), s: m('s'), x: m('x') };
}

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
  const e = useMotionValue(REST);
  const camY = useMotionValue(LIFT * zMid(-1, REST));
  const camS = useMotionValue(1);
  const camX = useMotionValue(0);
  const { scrollYProgress: p } = useScroll({ target: track, offset: ['start start', 'end end'] });

  // computed in JS on purpose: a plain range map would be handed to the browser's scroll timeline, which misreads a pinned track
  const heroY = useTransform(p, (v) => map(v, [0, T.heroOut[1]], [0, -90]));
  const heroO = useTransform(p, (v) => map(v, T.heroOut, [1, 0]));
  const chipsO = useTransform(p, (v) => map(v, [0, 0.04], [1, 0]));
  const artO = useTransform(p, (v) => map(v, [T.close[0], T.close[0] + 0.025], [1, 0]));
  const mapO = useTransform(p, (v) => map(v, [T.map[0], T.map[1], T.close[0] - 0.01, T.close[0] + 0.02], [0, 1, 1, 0]));
  const introO = useTransform(p, (v) => map(v, T.intro, [0, 1, 1, 0]));
  const introY = useTransform(p, (v) => map(v, T.intro, [36, 0, 0, -36]));
  // the black room (MASTER 3.1): a rounded card inside the gutters that rises, then opens past the screen edges so its
  // corners leave; at the end it closes back into a card and rises away. Transform only.
  const roomY = useTransform(p, (v) => (v < 0.6 ? (1 - io(v, T.wipe[0], T.wipe[0] + 0.07)) * 100 : -io(v, T.close[0] + 0.02, T.close[1]) * 100) + '%');
  const roomS = useTransform(p, (v) => (v < 0.6 ? 0.94 + 0.1 * io(v, T.wipe[0] + 0.05, T.wipe[1]) : 1.04 - 0.1 * io(v, T.close[0], T.close[0] + 0.025)));
  // the headline is the hero's moment: it starts at 84px and settles toward 52px as the journey begins
  const h1S = useTransform(p, (v) => map(v, [0, T.heroOut[1]], [1, 0.62]));

  const frame = (v) => {
    if (!pinned) return;
    e.set(REST + (1 - REST) * io(v, ...T.explode));
    const c = camAt(v, k.current);
    camY.set(c.y);
    camS.set(c.s);
    camX.set(c.x);
    const gi = groupAt(v);
    setG((o) => (o === gi ? o : gi));
    const pi = v < 0.09 || v > T.close[1] ? 0 : 1;
    setPh((o) => (o === pi ? o : pi));
  };
  useMotionValueEvent(p, 'change', frame);

  // fit the stack to its box; on phones and for reduced motion the stack opens by itself, once it is seen
  useEffect(() => {
    const el = art.current;
    const ro = new ResizeObserver(([r]) => {
      const { width: w, height: h } = r.contentRect;
      k.current = pinned ? clamp(Math.min(w / 560, h / 760), 0.42, 1.15) : clamp(Math.min(w / 520, h / 600), 0.4, 1);
      el.dataset.sized = ''; // the art shows only once it has its size, so it never paints large over the hero's words
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
    const c = animate(e, 1, { duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 5.4 });
    return () => { c.stop(); sync(); };
  }, [pinned, calm, artSeen]); // eslint-disable-line react-hooks/exhaustive-deps

  // arrival: one pass down the eleven plates, each named as it lifts (450ms a plate, under 5s), then rest on the top
  const [walk, setWalk] = useState(-1);
  const touched = useRef(false);
  useEffect(() => {
    if (calm) return;
    let i = 0;
    let t = setTimeout(function next() {
      if (touched.current) { setWalk(-1); return; }
      setWalk(i);
      i += 1;
      t = setTimeout(i < N ? next : () => setWalk(-1), 450);
    }, 700);
    return () => clearTimeout(t);
  }, [calm]);
  const onHot = (i) => { touched.current = true; setWalk(-1); setHot(i); };

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
    const h = i === hot || (hot < 0 && i === walk && ph === 0) ? ' hot' : '';
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
        <input type="search" suppressHydrationWarning value={q} onChange={(ev) => setQ(ev.target.value)} placeholder="Find in the stack" autoComplete="off" spellCheck={false} aria-describedby="xpl-ask-n" />
        {q && <button type="button" className="xpl-ask-x" onClick={() => setQ('')} aria-label="Clear"><svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg></button>}
      </label>
      <p id="xpl-ask-n" className="xpl-ask-n" aria-live="polite">{hits ? `${hits.length} / ${N}` : ''}</p>
      {hits && !!hits.length && (
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
        </ul>
      )}
    </div>
  );

  return (
    <section ref={track} className="xpl-jr" aria-labelledby="xpl-h1" data-ph={ph} data-g={g}>
      <span className="xpl-jr-dark" data-room="dark" aria-hidden="true" />
      <div className="xpl-jr-stage" onPointerMove={turn} onPointerLeave={rest}>
        <motion.div className="xpl-jr-bg" style={pinned ? { y: roomY, scale: roomS } : undefined} aria-hidden="true" />

        <motion.div className="xpl-hero" style={pinned ? { y: heroY, opacity: heroO } : undefined}>
          <div className="xpl-hero-t" onFocus={follow(0, ph === 0)}>
            <motion.div className="xpl-h1w" style={pinned ? { scale: h1S } : undefined}><Lines as="h1" id="xpl-h1" className="xpl-display" lines={['The AI‑native', 'cloud.']} now /></motion.div>
            <p className="xpl-tag">Hanzo Platform</p>
            <p className="xpl-lede">Run models, agents, applications, data and infrastructure through one operating plane.</p>
            <p className="xpl-body">Kubernetes-native. Fully observable. Open source. Run it on Hanzo infrastructure or infrastructure you control.</p>
            <div className="xpl-acts">
              <Cta to={KEY_URL} id="platform.hero" thumb>Start building</Cta>
              <Cta to="#stack" kind="quiet" id="platform.stack" onClick={(ev) => { ev.preventDefault(); goTo(0.235); }}>Inspect the stack</Cta>
            </div>
            <Cmd code="docker run -p 8080:8080 ghcr.io/hanzoai/cloud" className="xpl-run" />
          </div>
        </motion.div>

        <motion.div ref={art} className="xpl-art" style={pinned ? { opacity: artO } : undefined}>
          <IsoStack items={ITEMS} explode={e} camX={camX} camY={camY} camScale={camS} tone="paper" mark={mark} onPick={openLayer} onHot={onHot} className="xpl-iso" />
        </motion.div>

        <motion.ul className="xpl-chips" aria-label="What runs on it" style={pinned ? { opacity: chipsO } : undefined}>
          {['400+ callable models', 'GPUs', 'Functions', 'Containers', 'Databases', 'Observability', 'One API'].map((c) => <li key={c}>{c}</li>)}
        </motion.ul>

        <motion.div id="stack" className="xpl-map" data-ask-hide style={pinned ? { opacity: mapO } : undefined}>
          <i className="xpl-map-room" data-room="dark" aria-hidden="true" />
          <div className="xpl-bar xpl-bar-t" onFocus={follow(0.24, ph === 1)}>
            {/* the hint is a caption beside the finder, never a label above the room's headline */}
            <span aria-hidden="true" />
            <span className="xpl-ask-row"><span className={'xpl-hint' + (g >= 0 || lit ? ' off' : '')}>Select a layer</span>{finder}</span>
          </div>

          <motion.header className="xpl-intro" onFocus={follow(0.24, ph === 1 && g < 0)} style={pinned ? { opacity: introO, y: introY } : undefined}>
            <Lines className="xpl-h2" lines={['One stack.', 'Down to the kernel.']} />
            <p className="xpl-tag">The native AI stack</p>
            <p className="xpl-lede">Build with agents. Route with Enso. Reason with Zen. Decide with Kai. Run on infrastructure you control.</p>
            <Cta kind="quiet" id="platform.inspect" onClick={() => openLayer(0)} aria-haspopup="dialog" className="xpl-btn-dk">Inspect every layer</Cta>
          </motion.header>

          <div className="xpl-groups">
            {GROUPS.map((name, gi) => {
              const ids = IN_GROUP[gi];
              const stat = ids.map((i) => LAYERS[i].extra && LAYERS[i].extra.stat).find(Boolean);
              return (
                <div key={name} className="xpl-grp" data-on={g === gi} data-past={g > gi} role="group" aria-label={name} onFocus={follow(T.g0 + gi * GLEN + GLEN * 0.5, g === gi)}>
                  <span className="xpl-mini" aria-hidden="true">{LAYERS.map((l, i) => <i key={i} className={l.g === gi ? 'on' : ''} />)}</span>
                  <p className="xpl-grp-k">{name}<span>{LAYERS[ids[0]].n}—{LAYERS[ids[ids.length - 1]].n}</span></p>
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
            <span>Hanzo / architecture map</span>
            <span>01—11 / owned and connected</span>
            <span>Interactive drawing · not telemetry</span>
            <span className="xpl-zap">
              <span className="xpl-zap-t">ZAP / native interconnect</span>
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
          <h3 className="xpl-ins-h">{l.name}</h3>
          <p className="xpl-tag">{l.kick}</p>
          <p className="xpl-ins-d">{l.d}</p>
          <ul className="xpl-pills">{l.links.map(([t, h]) => <li key={t}><A to={h} className="xpl-pill">{t}</A></li>)}</ul>
          <div className="xpl-why"><p className="xpl-why-k">Why this layer matters</p><p>{l.why}</p></div>
          {l.n === '11' && <KernelFan />}
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
        <p><span>Select / explore</span> <span>Product · docs · source</span></p>
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

/* opened from layer 11 (Kernel DSL): one expression fanning out to four targets; a target lights its wire */
function KernelFan() {
  const [hot, setHot] = useState(-1);
  return (
    <div className="xpl-kernel">
      <h4 className="xpl-kn-h">One kernel DSL. Four targets.</h4>
      <p className="xpl-body">Four parallel acceleration backends, not four extra hops. First-party kernels and performance tuning for supported workloads.</p>
      <div className="xpl-fan" data-hot={hot}>
        <div className="xpl-fan-src" aria-hidden="true"><Mark size={20} /></div>
        <i className="xpl-fan-dot" aria-hidden="true" />
        <ul className="xpl-targets">
          {TARGETS.map(([k, n, d, to], i) => (
            <li key={n} onPointerEnter={() => setHot(i)} onPointerLeave={() => setHot(-1)} onFocus={() => setHot(i)} onBlur={() => setHot(-1)}>
              <h5>{n}</h5>
              <p className="xpl-cap-s">{k}</p>
              <p>{d}</p>
              <A to={to} className="xpl-go"><span>Explore<span className="x-sr"> {n}</span></span><Arrow /></A>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ---------- intelligence that connects to every layer: an Apple tile grid; each tile's object plays on hover ---------- */
const Pills = ({ list }) => <ul className="xpl-pills">{list.map(([t, h]) => <li key={t}><A to={h} className="xpl-pill">{t}</A></li>)}</ul>;

const CAPS = [
  { k: 'mem', t: 'Semantic + Graph', tag: 'Retrieve / remember', d: 'Semantic retrieval, durable memory, provenance and connected knowledge for agent work.', fig: '2.0× multi-hop evidence recall vs cosine', sd: 'LoCoMo, held-out test split: every evidence turn of a multi-hop question in the top 20 for 37.5% of questions, against 18.8% for cosine search.', pills: [['Product', '/products/memory'], ['Docs', 'https://docs.hanzo.ai/docs/openapi/graph'], ['Source', 'https://github.com/hanzoai/semantic'], ['The LoCoMo run', '/benchmarks/locomo']],
    art: <svg className="xpl-graph" viewBox="0 0 220 160" aria-hidden="true"><path d="M30 80 L100 30 L190 60 L150 135 L60 128 Z M100 30 L150 135 M30 80 L190 60 M60 128 L190 60" />{[[30, 80], [100, 30], [190, 60], [150, 135], [60, 128]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="6" style={{ '--i': i }} />)}</svg> },
  { k: 'code', t: 'Code Intelligence', tag: 'Understand / edit', d: 'Symbols, ASTs, references and repository-aware code navigation for coding agents.', pills: [['Product', '/dev'], ['Docs', 'https://docs.hanzo.ai/docs/openapi/code'], ['Source', 'https://github.com/hanzoai/lsp']],
    art: <svg className="xpl-tree" viewBox="0 0 240 110" aria-hidden="true"><path d="M120 12 V36 M120 36 H52 V60 M120 36 H188 V60 M52 60 V84 M52 84 H24 V100 M52 84 H80 V100 M188 60 V100" />{[[120, 12], [52, 60], [188, 60], [24, 100], [80, 100], [188, 100]].map(([x, y], i) => <rect key={i} x={x - 9} y={y - 6} width="18" height="12" rx="3" style={{ '--i': i }} />)}</svg> },
  { k: 'forge', t: 'Hanzo Forge', tag: 'Build / ship', d: 'Source hosting, builds, CI/CD and deployments connecting agents to shipped software.', pills: [['Product', 'https://forge.hanzo.ai'], ['Docs', 'https://docs.hanzo.ai/docs/cli/platform'], ['Source', 'https://github.com/hanzoai/forge']],
    art: <svg className="xpl-commits" viewBox="0 0 240 60" aria-hidden="true"><path d="M8 30 H232 M60 30 C80 30 84 12 104 12 H160 C180 12 184 30 204 30" />{[8, 60, 104, 160, 204, 232].map((x, i) => <circle key={x} cx={x} cy={i === 2 || i === 3 ? 12 : 30} r="6" style={{ '--i': i }} />)}</svg> },
  { k: 'edge', t: 'In. Out. Under control.', tag: 'Edge / ingress + egress · Request boundary', d: 'Admission, auth, routing, streaming and responses are boundary functions around the stack rather than another inference step. Outbound calls carry delegated credentials that stay in KMS.', pills: [['Product', '/ingress'], ['Ingress', 'https://github.com/hanzoai/ingress'], ['Egress', 'https://github.com/hanzoai/egress']],
    art: <div className="xpl-flow" aria-hidden="true"><i /><i /><i /><u /></div> },
  { k: 'trace', t: 'Everything leaves a trace.', tag: 'Telemetry / observability · End to end', d: 'Follow a request across models, decisions, tools and infrastructure to cost, quality, latency, usage and evaluation.', pills: [['Product', '/o11y'], ['Docs', 'https://docs.hanzo.ai/docs/openapi/o11y'], ['Source', 'https://github.com/hanzoai/o11y']],
    art: <svg className="xpl-trace" viewBox="0 0 600 120" preserveAspectRatio="none" aria-hidden="true"><path d="M0 90 L60 90 L90 24 L140 102 L190 54 L240 78 L300 18 L360 90 L420 60 L480 84 L540 36 L600 66" /></svg> },
];

const PauseIcon = ({ on }) => (on
  ? <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M5 3.5v9M11 3.5v9" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /></svg>
  : <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M5 3.5v9l7.5-4.5z" fill="currentColor" /></svg>);

function Reach() {
  const ref = useRef(null);
  const seen = useInView(ref, { amount: 0.35 });
  const calm = useCalm();
  const [at, setAt] = useState(0);
  const [run, setRun] = useState(true);
  const live = run && !calm;
  useEffect(() => {
    if (!seen || !live) return;
    const t = setTimeout(() => setAt((v) => (v + 1) % CAPS.length), 3600);
    return () => clearTimeout(t);
  }, [seen, live, at]);
  const pick = (i) => { setAt(i); setRun(false); };
  return (
    <section ref={ref} className="xpl-sec xpl-reach" aria-labelledby="xpl-rc-h" data-enter="count-roll">
      <div className="xpl-wrap">
        <header className="xpl-head">
          <Lines id="xpl-rc-h" className="xpl-h2" lines={['Intelligence that connects', 'to every layer.']} />
          <p className="xpl-body">Agent capabilities sit alongside the inference path; not every request crosses every subsystem.</p>
        </header>
        <div className="xpl-cap-g">
          <div className="xpl-cap-l">
            <ol className="xpl-cap-list">
              {CAPS.map((c, i) => (
                <li key={c.k}>
                  <button type="button" className={i === at ? 'on' : ''} aria-pressed={i === at} aria-controls={'xpl-cap-' + c.k} onClick={() => pick(i)} onPointerEnter={(ev) => ev.pointerType === 'mouse' && pick(i)}>
                    <span className="xpl-cap-n">{pad(i + 1)}</span><b>{c.t}</b>{i === at && live && seen && <i className="xpl-cap-t" aria-hidden="true" />}
                  </button>
                </li>
              ))}
            </ol>
            <button type="button" className="xpl-play" onClick={() => setRun((v) => !v)} aria-label={live ? 'Pause' : 'Play'} aria-pressed={live}><PauseIcon on={live} /></button>
          </div>
          <div className="xpl-cap-stage">
            {CAPS.map((c, i) => (
              <article key={c.k} id={'xpl-cap-' + c.k} className={'xpl-cap-p t-' + c.k} data-on={i === at} aria-hidden={i !== at} inert={i !== at}>
                <div className="xpl-cap-art">{c.art}</div>
                <h3 className="x-sr">{c.t}</h3>
                <p className="xpl-cap-s">{c.tag}</p>
                <p className="xpl-cap-d">{c.d}</p>
                {c.fig && <p className="xpl-tile-fig"><Stat s={c.fig} /></p>}
                {c.sd && <p className="xpl-tile-sd">{c.sd}</p>}
                <Pills list={c.pills} />
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- not just running: the improvement loop as a ring that turns by itself; a click holds a step ---------- */
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
  const calm = useCalm(); // read after mount: the pause button renders the same on server and client
  const [at, setAt] = useState(0);
  const [held, setHeld] = useState(false);
  const [run, setRun] = useState(true);
  useEffect(() => {
    if (!seen || calm || held || !run) return;
    const t = setTimeout(() => setAt((v) => (v + 1) % LOOP.length), 1900);
    return () => clearTimeout(t);
  }, [seen, calm, held, run, at]);
  return (
    <section className="xpl-sec xpl-loop" aria-labelledby="xpl-lp-h">
      <div className="xpl-wrap xpl-lp-g">
        <div className="xpl-lp-l">
          <Lines id="xpl-lp-h" className="xpl-h2" lines={['Not just running.', 'Learning.']} />
          <div className="xpl-links"><Go to="/research">Research</Go><Go to="/benchmarks">Benchmarks</Go><Go to="https://github.com/hanzoai/benchmarks">Harness</Go></div>
          <p className="xpl-body xpl-small">A modular feedback architecture, not a claim of unattended production self-modification. Only candidates that meet the relevant evaluation and release gates are promoted.</p>
        </div>
        <div ref={ref} className="xpl-ring" data-enter="spiral-in" style={{ '--at': at }} onPointerLeave={() => setHeld(false)}>
          <span className="xpl-ring-c" aria-hidden="true" />
          <span className="xpl-ring-arc" aria-hidden="true" />
          <p className="xpl-ring-mid" aria-hidden="true"><b>{LOOP[at][1]}</b><span>{LOOP[at][2]}</span></p>
          <ol>
            {LOOP.map(([n, t, s], i) => (
              <li key={n} style={{ '--i': i }} className={i === at ? 'on' : ''}>
                <i className="xpl-ring-d" aria-hidden="true" />
                <button type="button" aria-pressed={i === at} onClick={() => { setAt(i); setHeld(true); }} onPointerEnter={(ev) => { if (ev.pointerType === 'mouse') { setAt(i); setHeld(true); } }}>
                  <span className="xpl-ring-lab">
                    <span className="xpl-ring-n">{n}</span>
                    <span className="xpl-ring-t">{t}</span>
                    <span className="xpl-ring-s">{s}</span>
                  </span>
                </button>
              </li>
            ))}
          </ol>
          <p className="xpl-ring-cap"><span className="xpl-cap-s">Research / recursive improvement</span>
            <button type="button" className="xpl-play" onClick={() => setRun((v) => !v)} aria-label={run && !calm ? 'Pause' : 'Play'} aria-pressed={run && !calm}><PauseIcon on={run && !calm} /></button>
          </p>
        </div>
      </div>
    </section>
  );
}

/* ---------- the cloud, plane by plane: sticky chapters ---------- */
const TILES = [['Chat', '/cloud/chat'], ['Bot', '/bot'], ['Search', '/search'], ['Crawl', '/crawl'], ['Studio', '/studio'], ['Console', '/console'], ['Referrals', '/cloud/referrals'], ['Marketplace', '/cloud/marketplace']];
const NAV = [['GPUs', '/cloud/gpus'], ['Machines', '/machines'], ['Containers', '/cloud/containers'], ['Functions', '/functions'], ['Edge', '/edge'], ['Applications', '/cloud/applications'], ['Clusters', '/cloud/clusters'], ['Kubernetes', '/cloud/kubernetes']];
const ROWS = [['gateway', 'Ready', 'Every request enters here, so the limiter does too.'], ['payments-api', 'Ready', 'The service the session above is changing.'], ['checkout-web', 'Building', 'A build is running from the last commit on main.'], ['docs-site', 'Ready', 'Static, published by the same pipeline as the rest.']];
const LADDER = [['Functions', "Scale to zero between calls.", 14], ['Containers', "Your image, deployed and addressable.", 32], ['Sandboxes', "Isolated shells for agents and untrusted code.", 50], ['Machines', "A whole machine, by the second.", 68], ['GPUs', "Accelerators attached to any of them.", 84], ['Kubernetes', "The substrate all of it runs on.", 100]];
const DEPLOY = [['Containers', "Deploy an image and invoke it. Deployments, triggers, secrets, metrics and logs are all part of the same surface, so a function you ship is a function you can watch."], ['Machines', "A whole machine, by the second."], ['Sandboxes', "Isolated shells for agents and untrusted code."]];

function ConsoleWin() {
  const [tab, setTab] = useState(0);
  return (
    <div className="xpl-win" data-room="dark">
      <div className="xpl-win-bar">
        <span className="xpl-dots" aria-hidden="true"><i /><i /><i /></span>
        <A to="https://hanzo.team/" className="xpl-win-t"><Mark size={13} /> <span>API Platform — Hanzo</span></A>
      </div>
      <div className="xpl-win-body">
        <ul className="xpl-win-nav">{NAV.map(([t, h], i) => <li key={t}><A to={h} className={i === 0 ? 'on' : ''}>{t}</A></li>)}</ul>
        <div className="xpl-win-main">
          <p className="xpl-win-k">Containers — Hanzo</p>
          <ul className="xpl-win-tiles">{TILES.map(([t, h]) => <li key={t}><A to={h}><i aria-hidden="true">{t[0]}</i>{t}</A></li>)}</ul>
          <Tabs id="xpl-work" tabs={DEPLOY.map(([t]) => t)} value={tab} onChange={setTab} label="Kinds of work" className="xpl-tabs" />
          {DEPLOY.map(([t, d], i) => <TabPanel key={t} id="xpl-work" i={i} value={tab} className="xpl-pane"><p>{d}</p></TabPanel>)}
          <ul className="xpl-win-rows">
            {ROWS.map(([n, s, note], i) => (
              <li key={n} className={s === 'Building' ? 'busy' : ''}>
                <span className="xpl-win-n">{n}</span>
                <span className="xpl-st"><i aria-hidden="true" /><span>{s}</span></span>
                <span className="xpl-win-note">{note}</span>
              </li>
            ))}
          </ul>
          <p className="xpl-ep">api.hanzo.ai/v1/functions</p>
        </div>
      </div>
      <div className="xpl-win-f">
        <A to="/home" className="xpl-go"><span>Open in the console</span><Arrow /></A>
        <span className="xpl-win-cap">Example project. Every name in it is one you would give your own.</span>
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

/* a chapter's words: the headline first, never a label above it (the chapter's name is in the index) */
const Ch = ({ title, lede, links, children }) => (
  <>
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
      <Ch title="One runtime for every kind of work." lede="The same plane, held for a millisecond or for a month. What changes is how much of a machine the work needs, not what you have to learn." links={[['Compute API', 'https://docs.hanzo.ai/docs/openapi/compute'], ['Function API', 'https://docs.hanzo.ai/docs/openapi/function'], ['Sandbox API', 'https://docs.hanzo.ai/docs/openapi/sandbox'], ['Machines', '/machines']]}>
        <ol className="xpl-lad">{LADDER.map(([n, d, w], i) => <li key={n} style={{ '--w': w / 100, '--i': i }}><b>{n}</b><span>{d}</span><i aria-hidden="true"><u /></i></li>)}</ol>
      </Ch>
    ),
    visual: <ConsoleWin />,
  },
  {
    id: 'data', tab: 'Data',
    copy: <Ch title="The data primitives AI applications use." lede="Each primitive is the right shape for its job, and they share one project, one key and one bill." links={[['Base API', 'https://docs.hanzo.ai/docs/openapi/base'], ['Object storage API', 'https://docs.hanzo.ai/docs/openapi/s3'], ['KV API', 'https://docs.hanzo.ai/docs/openapi/kv'], ['Hanzo Base', '/base']]} />,
    visual: (
      <ul className="xpl-prims">
        {PRIM.map(([n, d, to], i) => <li key={n}><A to={to} className="xpl-prim"><Shape k={i} /><h3>{n}</h3><p>{d}</p></A></li>)}
      </ul>
    ),
  },
  {
    id: 'anywhere', tab: 'Anywhere',
    copy: <Ch title="One control plane. Any infrastructure." lede="The API, the console, the identities and the bill stay the same when the machines underneath change." links={[['Compute API', 'https://docs.hanzo.ai/docs/openapi/compute'], ['Node API', 'https://docs.hanzo.ai/docs/openapi/node'], ['Visor', '/visor']]} />,
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
    copy: <Ch title="Security is part of the cloud, not a product on top of it." lede="An agent gets an identity because it runs here, and the trail is written because every call goes through the same door." links={[['IAM API', 'https://docs.hanzo.ai/docs/openapi/iam'], ['KMS API', 'https://docs.hanzo.ai/docs/openapi/kms'], ['Audit API', 'https://docs.hanzo.ai/docs/openapi/audit'], ['Security', '/security']]} />,
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
    copy: <Ch title="Push code. Get a production system." lede="An address, a certificate, secrets, metrics, logs and its share of the bill come back with it, because none of them is a separate purchase." links={[['Deploy API', 'https://docs.hanzo.ai/docs/openapi/deploy'], ['Registry API', 'https://docs.hanzo.ai/docs/openapi/registry'], ['CLI docs', 'https://docs.hanzo.ai/docs/cli'], ['Registry', '/registry']]} />,
    visual: (
      <div className="xpl-line">
        <span className="xpl-rail" aria-hidden="true"><i /></span>
        <ol>{SHIP.map(([t, d], i) => <li key={t} style={{ '--i': i }}><span className="xpl-stn" aria-hidden="true" /><h3>{t}</h3><p>{d}</p></li>)}</ol>
      </div>
    ),
  },
  {
    id: 'pricing', tab: 'Pricing',
    copy: <Ch title="Pay for what runs." lede="Nothing is billed for existing. One organization balance and one usage ledger, and every line traces back to a request." links={[['Pricing docs', 'https://docs.hanzo.ai/docs/pricing'], ['Billing API', 'https://docs.hanzo.ai/docs/openapi/billing'], ['Plans and rates', '/pricing']]} />,
    visual: (
      <ul className="xpl-meters">
        {METERS.map(([n, b], i) => <li key={n}><h3>{n}</h3><p>{b}</p><i className="xpl-tape" aria-hidden="true" style={{ '--d': i * 0.45 + 's' }} /></li>)}
      </ul>
    ),
  },
];

function Planes() {
  return (
    <section className="xpl-planes" aria-label="The cloud, plane by plane" data-ask-hide>
      <PinChapters label="Planes" chapters={PLANES} className="xpl-pc" />
    </section>
  );
}

/* ---------- one API: one afternoon of calls, replayed, each path typing itself ---------- */
/* Hanzo's six listed paths (the left column) and its five-beat tour (the right), as hanzo.ai/platform prints them */
const EPS = ['/v1/models', '/v1/agent', '/v1/function', '/v1/provisioning/sql', '/v1/provisioning/vector', '/v1/s3/buckets'];
const OPS = [
  { p: '/v1/models', cap: 'Start with the models.', m: 'GET', d: 'Returns the list of available models from the routing table.', tags: ['Models'] },
  { p: '/v1/ai/routes', cap: 'Blend them behind one route.', m: 'POST', d: 'Create a model-route' },
  { p: '/v1/chat/completions', cap: 'Ask it something.', m: 'POST', d: 'Implements the OpenAI-compatible chat completions API' },
  { p: '/v1/agent', cap: 'Hand it your own tools.', m: 'POST', d: "Defines an agent in the caller's org: a model, a system prompt (instructions) and a set of tool names." },
  { p: '/v1/billing/usage', cap: "Watch what it cost.", m: 'GET', d: "Every billed call the caller's org made, attributed to a product", tags: ["AI Metrics", "Billing"] },
];

/* the call path types itself into a text node, a character at a time (no React state per character) */
function typing(el, text, alive) {
  // visual only: the text node always holds the whole path; a clip widens one character at a time over it
  return new Promise((done) => {
    let i = 0;
    el.dataset.typing = '';
    el.style.setProperty('--n', 0);
    const step = () => {
      if (!alive()) return done(false);
      el.style.setProperty('--n', ++i);
      if (i < text.length) setTimeout(step, 42); else { delete el.dataset.typing; done(true); }
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
    return () => { live = false; clearTimeout(t); if (el) { delete el.dataset.typing; el.style.removeProperty('--n'); } };
  }, [at, on, seen]);
  return (
    <section className="xpl-sec xpl-api" aria-labelledby="xpl-api-h">
      <div className="xpl-wrap">
        <header className="xpl-head xpl-api-head">
          <Lines id="xpl-api-h" className="xpl-h2" lines={['One API.', 'Every capability.']} />
          <p className="xpl-body">The same key, organization, project, policy and usage ledger behind every path. The interface changes; the system does not.</p>
        </header>
        <div ref={box} className="xpl-term" data-room="dark">
          <ul className="xpl-eps" style={{ '--at': Math.max(0, EPS.indexOf(OPS[at].p)) }}>
            <li className="xpl-ep-bg" aria-hidden="true" data-on={EPS.includes(OPS[at].p)} />
            {EPS.map((p) => {
              const j = OPS.findIndex((o) => o.p === p);
              const lit = OPS[at].p === p;
              return (
                <li key={p}>
                  {j < 0 ? <span className="xpl-ep-b"><span className="xpl-ep-h">api.hanzo.ai</span><span className="xpl-ep-p">{p}</span></span>
                    : <button type="button" className={lit ? 'on' : ''} aria-pressed={lit} onClick={() => { setAt(j); setPlay(false); }}>
                      <span className="xpl-ep-h">api.hanzo.ai</span><span className="xpl-ep-p">{p}</span>
                    </button>}
                </li>
              );
            })}
            <li className="xpl-eps-more"><span>api.hanzo.ai/v1/…</span></li>
          </ul>
          <div className="xpl-term-r">
            <div className="xpl-term-h">
              <p>One org, one afternoon: a spaceship shop that did not exist this morning.</p>
              <button type="button" className="xpl-play" onClick={() => setPlay((v) => !v)} aria-label={on ? 'Pause' : 'Play'} aria-pressed={on}>
                <svg className="a" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M5 3.5v9l7.5-4.5z" fill="currentColor" /></svg>
                <svg className="b" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M5 3.5v9M11 3.5v9" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /></svg>
              </button>
            </div>
            <p className="xpl-term-s">Five operations, one key, no glue. Each is checked against the published OpenAPI document on every build.</p>
            <div className="xpl-term-b">
              {OPS.map((o, i) => (
                <div key={o.p} className={'xpl-step' + (i === at ? ' on' : '')} aria-hidden={i !== at} inert={i !== at}>
                  {o.cap && <p className="xpl-cap">{o.cap}</p>}
                  <p className="xpl-call">{o.m && <em>{o.m}</em>}<span>api.hanzo.ai</span><span className="xpl-call-p" ref={(el) => { out.current[i] = el; }}>{o.p}</span>{i === at && on && <i className="xpl-caret" aria-hidden="true" />}</p>
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

/* ---------- open: the image we operate is the image you can pull; the object is the terminal you would paste into ---------- */
function OpenSec() {
  return (
    <section className="xpl-sec xpl-open" aria-labelledby="xpl-op-h" data-enter="underline-sweep">
      <div className="xpl-wrap xpl-op-g">
        <div>
          <Lines id="xpl-op-h" className="xpl-h2 xpl-op-h" lines={['Your cloud should', 'not lock you in.']} />
          <p className="xpl-lede xpl-op-l">The platform is open source, and the image we operate is the image you can pull: the same API and console on your cluster, in your network or on a laptop.</p>
          <div className="xpl-links"><Go to="https://docs.hanzo.ai/docs/self-hosting">Self-host guide</Go><Go to="/open-source">Open source</Go><Go to="https://github.com/hanzoai/cloud">Source</Go></div>
        </div>
        <div className="xpl-tty">
          <Cmd code="git clone https://github.com/hanzoai/cloud && cd cloud && make dev" />
          <Cmd code="curl -sS http://127.0.0.1:9090/healthz" />
          <p className="xpl-cap-s">Open</p>
        </div>
      </div>
    </section>
  );
}

/* ---------- the directory (PLAN-COMPONENTS 5.9): every plane and what is in it; a row's own description on hover ---------- */

function Catalog({ about = {} }) {
  const [pick, setPick] = useState({ name: CAT[1][2][0][0], to: CAT[1][2][0][1] });
  const show = (name, to) => () => setPick((o) => (o.to === to ? o : { name, to }));
  const d = about[pick.to] || '';
  return (
    <section className="xpl-sec xpl-cat" aria-labelledby="xpl-cat-h">
      <div className="xpl-wrap">
        <header className="xpl-head xpl-cat-head">
          <Lines id="xpl-cat-h" className="xpl-h2" lines={['Explore the platform.']} />
          <p className="xpl-body">Every plane, and what is in it.</p>
        </header>
        <div className="xpl-dir" data-enter="inertia-drag">
          <div className="xpl-dir-cols">
            {CAT.map(([n, to, items], i) => (
              <div key={n} className="xpl-dir-g">
                <A to={to} className="xpl-dir-h" onPointerEnter={show(n, to)} onFocus={show(n, to)}><span>{pad(i + 1)}</span><b data-morph>{n}</b><Arrow /></A>
                <ul>
                  {items.map(([t, h]) => (
                    <li key={t}>
                      <A to={h} className={'xpl-dir-r' + (pick.to === h ? ' on' : '')} onPointerEnter={show(t, h)} onFocus={show(t, h)}>
                        <span data-morph>{t}</span><Arrow />
                      </A>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <aside className="xpl-dir-pv" aria-live="polite">
            <p className="xpl-cap-s">Catalog</p>
            <div className="xpl-dir-art" aria-hidden="true"><Sigil seed={pick.to} data={[d.length, pick.name.length]} className="xpl-dir-sig" /></div>
            <p className="xpl-dir-n">{pick.name}</p>
            {d && <p className="xpl-dir-d">{d}</p>}
          </aside>
        </div>
        <div className="xpl-links"><Go to="/products">The complete catalog</Go></div>
      </div>
    </section>
  );
}

/* ---------- the proof strip before the close (MASTER part 3): Hanzo's measured figures, each to its method ---------- */
const PROOF = [
  ['95.6%', 'on GPQA Diamond', '/benchmarks/gpqa'],
  ['3.02×', 'faster coding', '/benchmarks#coding-agent'],
  ['2.0×', 'multi-hop evidence recall vs cosine', '/benchmarks/locomo'],
];
function Proof() {
  return (
    <section className="xpl-sec xpl-proofs" aria-label="View the measurements">
      <div className="xpl-wrap">
        <div className="xpl-facts" data-enter="explode-gather">
          {FACTS.map(([f, h, d, l, to], i) => (
            <div key={h} className={'xpl-fact' + (i ? '' : ' big')}>
              <p className="xpl-fact-h">{f ? f + ' ' + h : h}</p>
              <p className="xpl-fact-d">{d}</p>
              <Go to={to}>{l}</Go>
            </div>
          ))}
          <ul className="xpl-pfs">
            {PROOF.map(([f, l, to]) => (
              <li key={f}><A to={to} className="xpl-pf"><span>{f + ' ' + l}</span><Arrow /></A></li>
            ))}
          </ul>
        </div>
        <p className="xpl-foot">GPU targets are parallel hardware backends, not sequential stages. Zen is generative reasoning; Kai provides decision intelligence. ZAP is a native RPC protocol for supported interconnect paths. Research and evaluation form a gated improvement loop. “Native” describes Hanzo’s architecture surfaces; not every implementation, weight, driver or operating system is owned or open sourced by Hanzo.</p>
      </div>
    </section>
  );
}

/* ---------- section entrances (MOTION-MAP /platform: inertia-drag, count-roll, spiral-in, underline-sweep,
   explode-gather), page-local. One observer marks each [data-enter] once with data-in when a quarter of it (or a
   quarter of the screen) is in view; Platform.css plays the entrance it names. Start states live in the CSS under
   html.js and prefers-reduced-motion: no-preference, so the server markup is final, JS off and reduced motion show
   everything at rest. Every entrance is visual only: the text in the page is always Hanzo's final text. ---------- */
function useEnter(root) {
  useEffect(() => {
    const els = [...(root.current?.querySelectorAll('[data-enter]') || [])];
    if (typeof IntersectionObserver === 'undefined') { els.forEach((el) => { el.dataset.in = ''; }); return; }
    const timers = [];
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting || (e.intersectionRatio < 0.25 && e.intersectionRect.height < innerHeight * 0.25)) return;
      const el = e.target;
      el.dataset.in = '';
      io.unobserve(el);
      timers.push(setTimeout(() => { el.dataset.done = ''; }, 1800));
    }), { threshold: [0, 0.1, 0.25, 0.5] });
    els.forEach((el) => io.observe(el));
    return () => { io.disconnect(); timers.forEach(clearTimeout); };
  }, [root]);
}

/* JS off: every scene readable in flow (PLAN-COMPONENTS 2.3 and 2.17) */
const NOJS = `.xpl .xpl-l>span{transform:none!important}.xpl-jr{height:auto!important;margin-top:0!important}.xpl-jr-dark,.xpl-jr-bg{display:none!important}.xpl-jr-stage{position:relative!important;height:auto!important;overflow:visible!important}.xpl-hero{position:relative!important;inset:auto!important;display:block!important;padding:72px 0 0!important;margin:0 var(--side)!important;opacity:1!important;transform:none!important}.xpl-hero-t{width:auto!important}.xpl-art{position:relative!important;width:100%!important;height:420px!important}.xpl-chips{position:relative!important;bottom:auto!important;opacity:1!important}.xpl-map{position:relative!important;inset:auto!important;opacity:1!important;pointer-events:auto!important;padding:96px var(--side) 72px!important;background:#070708}.xpl-map-room{display:block!important;position:absolute;inset:0}.xpl-bar-t,.xpl-bar-b,.xpl-intro,.xpl-groups{position:relative!important;inset:auto!important;width:auto!important;opacity:1!important;transform:none!important}.xpl-groups{display:block!important}.xpl-grp{opacity:1!important;transform:none!important;margin-top:72px}.pc{height:auto!important}.pc-stage{position:static!important;height:auto!important}.pc-grid{display:flex!important;flex-direction:column;height:auto!important}.pc-idx{display:none!important}.pc-copy{order:calc(var(--i)*2);opacity:1!important;transform:none!important;padding-top:96px}.pc-vis{order:calc(var(--i)*2 + 1);clip-path:none!important;opacity:1!important;margin-top:40px}.xpl-term-b{display:block!important}.xpl-step{opacity:1!important;transform:none!important;margin-bottom:28px}.v2s{position:static!important;visibility:visible!important}.v2s-scrim{display:none}.v2s-panel{position:static!important;transform:none!important;width:auto!important;margin:0 var(--side);box-shadow:none!important}.xpl-ins[hidden]{display:block!important;margin-bottom:48px}.xpl-cap-p{position:static!important;opacity:1!important;visibility:visible!important;transform:none!important;margin-bottom:44px}.xpl-cap-stage{display:block!important}.x-band .x-word,.x-band p,.x-band-act{opacity:1!important;transform:none!important;filter:none!important}[role=tabpanel][hidden]{display:block!important}.xpl-ring{aspect-ratio:auto!important;width:100%!important;margin:44px 0 0!important}.xpl-ring-c,.xpl-ring-arc,.xpl-ring-mid,.xpl-ring-d,.xpl-ring-cap .xpl-play{display:none!important}.xpl-ring li{position:relative!important;left:auto!important;top:auto!important;width:auto!important;height:auto!important;border-top:1px solid rgba(0,0,0,.1)}.xpl-ring li button{position:static!important;transform:none!important;width:auto!important;text-align:left!important;padding:12px 0!important}.xpl-ring small{display:block!important}.xpl-ring-cap{position:static!important;justify-content:flex-start!important;margin-top:17px!important}`;

export default function Platform({ about }) {
  const root = useRef(null);
  useEnter(root);
  const [sel, setSel] = useState(0);
  const [open, setOpen] = useState(false);
  const openLayer = (i) => { setSel(i); setOpen(true); };
  const step = (d) => setSel((s) => (s + d + N) % N);
  return (
    <main ref={root} className="xpl" data-ask-name="Hanzo Platform">
      <noscript><style>{NOJS}</style></noscript>
      <Journey openLayer={openLayer} />
      <Catalog about={about} />
      <Planes />
      <Reach />
      <OneApi />
      <Loop />
      <OpenSec />
      <Proof />
      <Band
        title="Build on the stack. Or run it yourself."
        lede="Models, agents, compute, data, security and observability behind one API, from prototype to production."
        action="Start building"
        to={KEY_URL}
        note={<A to="https://docs.hanzo.ai/docs/quickstart" className="x-link xpl-band-l">Read the docs</A>}
      />
      <Inspector sel={sel} open={open} onClose={() => setOpen(false)} step={step} />
    </main>
  );
}
