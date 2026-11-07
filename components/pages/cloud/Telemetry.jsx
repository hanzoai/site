'use client';
/* Telemetry (v2, Cloud 4 chat, motion-map build). Order: the split Stage with the live collector → the living graph
   (signature, one dark room) → the six facts → the collector's own config, read fact by fact → Get Telemetry with a
   config you assemble. No pinned chapter scene (MOTION-MAP rule 3). Ink, greys and white only.
   Persona: a platform engineer who wants one collector between apps and backends. Goal: open the repo.
   CTA: "View on GitHub" (hero, close). Metric: cta_click:telemetry.primary.
   V2: 7/10 motion-map build: living-graph signature second, five page-local entrances, pinned chapters removed
   Signature: graph. The pipeline (traces, metrics, logs → gRPC / HTTP → OTLP in → collector → memory_limiter → batch →
   OTLP out) settles like a physics graph; hover, focus or tap a node and its paths light and are named.
   Entrances: domino, ink-spread, text-mask-film, magnet-gather, shutter (hero collector columns tip in like dominoes;
   the graph room spreads in as an ink blot; the facts' heading plays a signal film through its letters; the config's
   lines are pulled together from scattered; the close opens behind a shutter).
   Beyond: "Your config". Choose the signals, the protocols and the processors and the collector config writes itself,
   ready to copy, from the parts Hanzo names (OTLP over gRPC and HTTP, batching, a memory ceiling, OTLP out).
   Motion: the graph (signature: arrival, idle, pointer) + the hero's running collector (idle, with Pause; hover a signal
   and only that kind flows in) + the config stepping through the six facts (time, with Pause; tap a key to read it) +
   the config builder (state) + the five entrances. Every word and link is Hanzo's; the config is a standard
   OpenTelemetry collector config with placeholders, not a Hanzo default. */
import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView } from 'motion/react';
import { EASE, Copy, useCalm } from '../../ui';
import { useDemo, PauseBtn, useTick } from '../../v2/x-hamilton/Demo';
import StageHero from '../../v2/StageHero';
import Finale from '../../v2/Finale';
import Graph from './telemetry/Graph';
import { useEnter } from './telemetry/enter';
import './Telemetry.css';

const GH = 'https://github.com/hanzoai';
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

// one Pause for the page's self-running parts: the hero collector and the span that keeps running the chapter strip
const Hold = createContext([false, () => {}]);

/* Stage object: spans in one at a time, out in batches, under a memory ceiling. */
function Pipe() {
  const [ref, seen] = useDemo(0.05);
  const [paused, toggle] = useContext(Hold);
  const live = seen && !paused;
  const [s, setS] = useState({ t: 0, held: 3, out: [{ id: -1, n: 6 }, { id: -2, n: 6 }], mem: 0.5, refused: false });
  const [only, setOnly] = useState(-1); // pointer: hover a signal and only that kind comes in
  useTick(420, live, () => setS(tick));
  const kind = only >= 0 ? KINDS[only] : KINDS[s.t % 3];
  return (
    <div className="l2-obj tl2-pipe" ref={ref}>
      <PauseBtn paused={paused} onClick={toggle} />
      <div className="tl2-col" aria-hidden="true" style={{ '--i': 0 }}>
        <p className="tl2-k l2-mono">OTLP in · gRPC · HTTP</p>
        <div className="tl2-lane">
          <AnimatePresence>
            {!s.refused && <motion.span key={s.t} className={'tl2-span ' + kind} initial={{ x: -60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 120, opacity: 0, transition: { duration: 0.3 } }} transition={{ duration: 0.32, ease: EASE }}>{kind}</motion.span>}
          </AnimatePresence>
          {s.refused && <span className="tl2-refuse l2-mono">refused</span>}
        </div>
        <ul className="tl2-sig l2-mono" onPointerLeave={() => setOnly(-1)}>{['traces', 'metrics', 'logs'].map((n, i) => <li key={n} className={(only < 0 ? i === s.t % 3 : i === only) ? 'on' : ''} onPointerEnter={(e) => e.pointerType === 'mouse' && setOnly(i)}>{n}</li>)}</ul>
      </div>
      <div className="tl2-col core" aria-hidden="true" style={{ '--i': 1 }}>
        <p className="tl2-k l2-mono">collector</p>
        <div className="tl2-batch">{Array.from({ length: 6 }).map((_, i) => <i key={i} className={i < s.held ? 'on' : ''} />)}</div>
        <p className="tl2-sub l2-mono">batching</p>
        <div className="tl2-mem">
          <p className="l2-mono"><span>memory</span><span className="c">ceiling</span></p>
          <i><b style={{ transform: `scaleX(${s.mem})` }} className={s.mem > 0.85 ? 'hot' : ''} /><em /></i>
        </div>
      </div>
      <div className="tl2-col" aria-hidden="true" style={{ '--i': 2 }}>
        <p className="tl2-k l2-mono">OTLP out</p>
        <ul className="tl2-out">
          <AnimatePresence initial={false}>
            {s.out.map((b) => <motion.li key={b.id} layout initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, ease: EASE }}><b>batch</b><span className="l2-mono">{b.n} spans · 1 request</span></motion.li>)}
          </AnimatePresence>
        </ul>
      </div>
    </div>
  );
}

const FACTS = [
  ['OTLP in, OTLP out', 'Receives over gRPC and HTTP, exports the same way. OTLP is the format the OpenTelemetry SDKs already speak, so nothing in your code changes to point at it.', 'receivers'],
  ['Traces, metrics and logs', 'All three move through the same process, so there is one thing to run, one config to read and one place to look when telemetry stops arriving.', 'pipelines'],
  ['Batching', 'Spans arrive one at a time and leave in batches. That is the difference between a request per span and a request per few thousand, and your backend feels it.', 'batch'],
  ['A memory ceiling', 'Tell it how much memory it may use and it refuses work rather than exceeding it. Telemetry is the thing that should degrade during an incident, not the thing that causes one.', 'memory_limiter'],
  ['Assembled, not installed', 'This is the collector itself. Build a distribution with the receivers, processors and exporters you actually want, and ship one binary containing those and nothing else.', 'build'],
  ['It runs where you run', 'A binary in your own network. Whatever you decide not to forward, you decide before the data has left — which is the only point where that is still your call.', 'exporters'],
];

// the collector's config, line by line, each line tagged with the fact (chapter) it belongs to
const CFG = [
  ['receivers:', 0], ['  otlp:', 0], ['    protocols:', 0], ['      grpc:', 0], ['      http:', 0], ['', -1],
  ['processors:', 2], ['  memory_limiter:', 3], ['    limit_mib: ${CEILING}', 3], ['  batch:', 2], ['', -1],
  ['exporters:', 5], ['  otlp:', 5], ['    endpoint: ${BACKEND}', 5], ['', -1],
  ['service:', 1], ['  pipelines:', 1], ['    traces:  [otlp] → [memory_limiter, batch] → [otlp]', 1], ['    metrics: [otlp] → [memory_limiter, batch] → [otlp]', 1], ['    logs:    [otlp] → [memory_limiter, batch] → [otlp]', 1],
];
const BUILD = [['dist:', 4], ['  name: my-collector', 4], ['receivers:', 4], ['  - otlpreceiver', 4], ['processors:', 4], ['  - batchprocessor', 4], ['  - memorylimiterprocessor', 4], ['exporters:', 4], ['  - otlpexporter', 4]];
const STAGES = [['OTLP in', [0]], ['pipelines', [1]], ['memory_limiter', [3]], ['batch', [2]], ['OTLP out', [5]]];

/* The chapter picture: the config file with the reached fact's block lit, and the pipeline strip above it. */
function Config({ at, compact }) {
  // on phones (stacked chapters) each chapter shows only its own block, not the whole file six times
  const file = (at === 4 ? BUILD : CFG).filter(([, f]) => !compact || f === at || at === 4);
  const stop = Math.max(0, STAGES.findIndex(([, f]) => f.includes(at)));
  const dest = at === 4 ? STAGES.length - 1 : stop;
  const lastOn = file.reduce((k, [, f], i) => (f === at ? i : k), -1);
  const calm = useCalm();
  const [up, setUp] = useState(false);
  useEffect(() => setUp(true), []);
  const go = up && !calm; // server HTML, JS off and reduced motion: the final frame, nothing hidden
  const [held] = useContext(Hold);
  const box = useRef(null);
  const seen = useInView(box, { amount: 0.3 });
  // after the arrival, a span keeps running the strip to the lit stage (idle) while the file is on screen, until Pause
  const flow = go && !held && seen;
  const strip = useRef(null);
  const [to, setTo] = useState(`${((dest + 0.5) / STAGES.length) * 100}%`);
  useEffect(() => { // park the span under the lit stage itself (the pills wrap and differ in width)
    const el = strip.current, pill = el && el.querySelectorAll(':scope > span')[dest];
    if (pill) setTo(`${((pill.offsetLeft + pill.offsetWidth / 2) / el.offsetWidth) * 100}%`);
  }, [dest]);
  let n = 0;
  return (
    <motion.div ref={box} className={'tl2-ed' + (compact ? ' cp' : '')} key={at} initial={go ? 'a' : false} whileInView="b" viewport={{ once: !!compact, amount: 0.4 }}>
      <div className="tl2-strip" ref={strip}>
        {STAGES.map(([t, f], i) => <span key={t} className={'l2-mono' + (f.includes(at) || at === 4 ? ' on' : '')}>{t}</span>)}
        <div className="tl2-track" aria-hidden="true"><motion.div className="tl2-run" variants={{ a: { x: '0%' }, b: { x: to } }} transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}><b /></motion.div>
          <motion.div className="tl2-run flow" initial={{ opacity: 0 }} animate={flow ? { x: ['0%', '0%', to, to], opacity: [0, 1, 1, 0] } : { opacity: 0 }} transition={flow ? { duration: 2.2, times: [0, 0.1, 0.8, 1], ease: [0.4, 0, 0.2, 1], repeat: Infinity, repeatDelay: 0.8, delay: 1.6 } : { duration: 0.3 }}><b /></motion.div></div>
      </div>
      <div className="tl2-win">
        <div className="tl2-tabs l2-mono"><span className={at !== 4 ? 'on' : ''}>config.yaml</span><span className={at === 4 ? 'on' : ''}>builder.yaml</span></div>
        <pre className="tl2-code"><code>
          {file.map(([l, f], i) => {
            const m = l.match(/^(\s*)(-\s)?([\w${}.-]+:)?(.*)$/);
            const on = f === at;
            const body = <>{m[1]}{m[2]}{m[3] && <b>{m[3]}</b>}{m[4]}{i === lastOn && <i className="tl2-caret" />}</>;
            // magnet-gather: each line starts scattered (a fixed offset per line, the same on server and client)
            const mg = { '--i': i, '--dx': `${((i * 37) % 11 - 5) * 16}px`, '--dy': `${((i * 53) % 9 - 4) * 12}px`, '--r': `${((i * 29) % 7 - 3) * 2}deg` };
            return <span key={(at === 4 ? 'b' : 'c') + i} className={'tl2-ln' + (on ? ' on' : '')} style={mg}><em>{String(i + 1).padStart(2, ' ')}</em>{on
              ? <motion.span className="tl2-w" variants={{ a: { clipPath: 'inset(0 100% 0 0)' }, b: { clipPath: 'inset(0 0% 0 0)' } }} transition={{ duration: 0.5, delay: 0.5 + 0.08 * n++, ease: [0.16, 1, 0.3, 1] }}>{body}</motion.span>
              : body}{'\n'}</span>;
          })}
          {/* builder.yaml is 9 lines: under it, the config.yaml the built binary runs, dimmed, so the window stays full */}
          {at === 4 && !compact && <>
            <span className="tl2-ln tl2-ghost-h" aria-hidden="true"><em>{'  '}</em>config.yaml{'\n'}</span>
            {CFG.slice(0, 9).map(([l], i) => <span key={'g' + i} className="tl2-ln tl2-ghost" aria-hidden="true"><em>{String(i + 1).padStart(2, ' ')}</em>{l}{'\n'}</span>)}
          </>}
        </code></pre>
      </div>
    </motion.div>
  );
}

/* 2. The living graph (signature) in the one dark room. Entrance: ink-spread (an ink blot opens the room). */
// the blot: 12 points round the centre at uneven radii, small then past the corners (same point count, so it morphs)
const R = [1, 0.82, 1.1, 0.9, 1.05, 0.78, 1, 0.88, 1.12, 0.85, 0.96, 0.8];
const blob = (s, cx, cy) => `polygon(${R.map((r, i) => { const a = (i / R.length) * Math.PI * 2; return `${(cx + Math.cos(a) * r * s).toFixed(1)}% ${(cy + Math.sin(a) * r * s * 1.4).toFixed(1)}%`; }).join(', ')})`;
const INK = { '--b0': blob(4, 30, 45), '--b1': blob(190, 30, 45) };

function GraphRoom() {
  const [ref, inn] = useEnter(0.2);
  const [held, toggle] = useContext(Hold);
  return (
    <section className="l2-dark tl2-gsec" data-room="dark" aria-label="The collector's pipeline" ref={ref} data-in={inn} style={INK}>
      <div className="l2-wrap"><Graph held={held} onHold={toggle} /></div>
    </section>
  );
}

/* 3. The six facts. Entrance: text-mask-film (a signal film plays through the heading's letters, then it settles). */
function FilmHead({ text, inn }) {
  // the film: rows of dashes running through the letters at different speeds (transform only)
  const rows = Array.from({ length: 7 });
  return (
    <h2 className="l2-head tl2-fh" data-in={inn}>
      <span className="tl2-fh-t">{text}</span>
      <svg className="tl2-fh-film" aria-hidden="true" width="100%" height="1.15em">
        <defs><clipPath id="tl2-fh-clip"><text x="0" y="50%" dominantBaseline="central">{text}</text></clipPath></defs>
        <g clipPath="url(#tl2-fh-clip)">
          <rect width="100%" height="100%" fill="#d4d4d4" />
          {rows.map((_, i) => (
            <g key={i} className="tl2-fh-row" style={{ '--s': `${1.1 + (i % 3) * 0.45}s`, '--d': `${-i * 0.3}s` }}>
              {Array.from({ length: 14 }).map((__, k) => <rect key={k} x={k * 64 + (i % 2) * 22} y={`${(i / rows.length) * 100}%`} width={18 + ((i + k) % 4) * 10} height="14%" fill="#0a0a0a" />)}
            </g>
          ))}
        </g>
      </svg>
    </h2>
  );
}

function Facts() {
  const [ref, inn] = useEnter(0.3);
  return (
    <section className="l2-sec tl2-facts" ref={ref}>
      <div className="l2-wrap">
        <FilmHead text="One hop you control" inn={inn} />
        <ol className="tl2-fl">
          {FACTS.map(([t, d, k], i) => (
            <li key={t}>
              <p className="tl2-fl-n l2-mono">{String(i + 1).padStart(2, '0')}</p>
              <h3>{t}</h3>
              <p>{d}</p>
              <p className="tl2-key l2-mono">{k}:</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* 4. The collector's config, read fact by fact: it steps through the six facts by itself (Pause), or tap a key.
   Entrance: magnet-gather (the file's lines are pulled together from scattered). */
function ConfigRoom() {
  const [ref, inn] = useEnter(0.25);
  const [held, toggle] = useContext(Hold);
  const [at, setAt] = useState(0);
  const [mine, setMine] = useState(false);
  const [phone, setPhone] = useState(false);
  const calm = useCalm();
  const seen = useInView(ref, { amount: 0.3 });
  useEffect(() => { const m = matchMedia('(max-width: 900px)'); const s = () => setPhone(m.matches); s(); m.addEventListener('change', s); return () => m.removeEventListener('change', s); }, []);
  useTick(4800, seen && !held && !mine && !calm, () => setAt((a) => (a + 1) % FACTS.length));
  return (
    <section className="l2-sec tl2-cfg" ref={ref}>
      <div className="l2-wrap tl2-mg" data-in={inn}>
        <div className="tl2-cfg-keys" role="group" aria-label="config.yaml">
          {FACTS.map(([t, , k], i) => <button key={k} type="button" aria-pressed={i === at} aria-label={t} onClick={() => { setMine(true); setAt(i); }} className="l2-mono">{k}</button>)}
          <PauseBtn paused={held} onClick={toggle} className="tl2-cfg-pause" />
        </div>
        <p className="tl2-cfg-t">{FACTS[at][0]}</p>
        <Config at={at} compact={phone} />
      </div>
    </section>
  );
}

/* 5. The close. Entrance: shutter (bars close from the top and bottom, then open on it). */
function Shutter({ children }) {
  const [ref, inn] = useEnter(0.15);
  return (
    <div className="tl2-shut" ref={ref} data-in={inn}>
      {children}
      <i className="tl2-shut-b t" aria-hidden="true" /><i className="tl2-shut-b b" aria-hidden="true" />
    </div>
  );
}

const SIG = ['traces', 'metrics', 'logs'];

/* Beyond: choose signals, protocols and processors; the config writes itself. */
function YourConfig() {
  const [sig, setSig] = useState([true, true, true]);
  const [pro, setPro] = useState([true, true]);
  const [prc, setPrc] = useState([true, true]);
  const flip = (arr, set, i) => set(arr.map((v, k) => (k === i ? !v : v)));
  const text = useMemo(() => {
    const procs = [prc[1] && 'memory_limiter', prc[0] && 'batch'].filter(Boolean);
    const L = ['receivers:', '  otlp:', '    protocols:'];
    if (pro[0]) L.push('      grpc:');
    if (pro[1]) L.push('      http:');
    if (procs.length) { L.push('processors:'); if (prc[1]) L.push('  memory_limiter:', '    limit_mib: ${CEILING}'); if (prc[0]) L.push('  batch:'); }
    L.push('exporters:', '  otlp:', '    endpoint: ${BACKEND}', 'service:', '  pipelines:');
    SIG.forEach((s, i) => { if (sig[i]) L.push(`    ${s}:`, '      receivers: [otlp]', ...(procs.length ? [`      processors: [${procs.join(', ')}]`] : []), '      exporters: [otlp]'); });
    return L.join('\n');
  }, [sig, pro, prc]);
  const group = (label, names, arr, set) => (
    <div className="tl2-g" role="group" aria-label={label}>
      <p className="l2-mono">{label}</p>
      <div>{names.map((n, i) => <button key={n} type="button" aria-pressed={arr[i]} onClick={() => flip(arr, set, i)}><i aria-hidden="true">{arr[i] ? '✓' : ''}</i>{n}</button>)}</div>
    </div>
  );
  return (
    <div className="tl2-yc">
      <p className="l2-kick ac">Your config</p>
      {/* the collector at rest, in its final state: it redraws from the choices below (state) */}
      <div className="tl2-rest l2-mono" aria-hidden="true">
        <div className="tl2-rest-c"><span className="tl2-rest-k">OTLP in</span>{SIG.map((s, i) => <span key={s} className="tl2-rest-p" data-off={sig[i] ? undefined : ''}>{s}</span>)}</div>
        <i className="tl2-rest-a" />
        <div className="tl2-rest-c core"><span className="tl2-rest-k">collector</span>{['batching', 'memory ceiling'].map((s, i) => <span key={s} className="tl2-rest-p" data-off={prc[i] ? undefined : ''}>{s}</span>)}</div>
        <i className="tl2-rest-a" />
        <div className="tl2-rest-c"><span className="tl2-rest-k">OTLP out</span><span className="tl2-rest-p">batch</span></div>
      </div>
      {group('signals', SIG, sig, setSig)}
      {group('protocols', ['gRPC', 'HTTP'], pro, setPro)}
      {group('processors', ['batching', 'memory ceiling'], prc, setPrc)}
      <div className="tl2-yc-out">
        <div className="tl2-yc-bar l2-mono"><span>config.yaml</span><Copy text={text} /></div>
        <pre tabIndex={0} aria-label="config.yaml"><code>{text}</code></pre>
      </div>
    </div>
  );
}

export default function Telemetry() {
  const [held, setHeld] = useState(false);
  const hold = useMemo(() => [held, () => setHeld((h) => !h)], [held]);
  return (
    <Hold.Provider value={hold}>
    <main id="main" className="l2-page tl2">
      {/* 1. Entrance: domino (the collector's three columns tip into place one after another) */}
      <StageHero look="split" kick="telemetry.hanzo.ai" title="Hanzo Telemetry" sub="The collector that sits between your app and wherever the data goes" acts={[['View on GitHub', GH]]}>
        <Pipe />
      </StageHero>
      <GraphRoom />
      <Facts />
      <ConfigRoom />
      <Shutter>
        <Finale name="Telemetry" head="Put it in front of your backend" ask={['View on GitHub', GH]} object={<YourConfig />} prompt="Read https://hanzo.ai/skill.md and use Hanzo Telemetry in my project." tag="OpenTelemetry ingest" />
      </Shutter>
    </main>
    </Hold.Provider>
  );
}
