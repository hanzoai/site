'use client';
/* Telemetry (v2, Cloud 4 chat). Archetype A, Launch: an editorial split Stage with the live collector → the six facts as
   chapters over the collector's own config (the one dark room) → Get Telemetry with a config you assemble → closing band.
   Ink, greys and white only.
   Persona: a platform engineer who wants one collector between apps and backends. Goal: open the repo.
   CTA: "View on GitHub" (hero, ask bar, close). Metric: cta_click:telemetry.primary.
   V2: 8/10 the live collector rising under an editorial split hero, the six facts scrolled through its own config file, a config you assemble and copy
   Signature: read the collector's config as you scroll. A config file pins on the left; each fact lights the block that
   does it (receivers, pipelines, batch, memory_limiter, the builder manifest, exporters) while the pipeline strip above
   it lights the same stage.
   Beyond: "Your config". Choose the signals, the protocols and the processors and the collector config writes itself,
   ready to copy, from the parts Hanzo names (OTLP over gRPC and HTTP, batching, a memory ceiling, OTLP out).
   Motion: pinned chapters (signature, scroll) + the hero's running collector (idle, with Pause; hover a signal and only
   that kind flows in) + each chapter's arrival (a span runs the strip to the lit stage and keeps running it until Pause,
   the lit lines write in, a caret blinks 5 times) + the config builder (state) + the stage settle (scroll). Every word and link is Hanzo's;
   the config is a standard OpenTelemetry collector config with placeholders, not a Hanzo default. */
import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView } from 'motion/react';
import { EASE, Copy, useCalm } from '../../ui';
import { useDemo, PauseBtn, useTick } from '../../v2/x-hamilton/Demo';
import StageHero from '../../v2/StageHero';
import PinScenes from '../../v2/x-hamilton/PinScenes';
import Finale from '../../v2/Finale';
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
      <div className="tl2-col" aria-hidden="true">
        <p className="tl2-k l2-mono">OTLP in · gRPC · HTTP</p>
        <div className="tl2-lane">
          <AnimatePresence>
            {!s.refused && <motion.span key={s.t} className={'tl2-span ' + kind} initial={{ x: -60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 120, opacity: 0, transition: { duration: 0.3 } }} transition={{ duration: 0.32, ease: EASE }}>{kind}</motion.span>}
          </AnimatePresence>
          {s.refused && <span className="tl2-refuse l2-mono">refused</span>}
        </div>
        <ul className="tl2-sig l2-mono" onPointerLeave={() => setOnly(-1)}>{['traces', 'metrics', 'logs'].map((n, i) => <li key={n} className={(only < 0 ? i === s.t % 3 : i === only) ? 'on' : ''} onPointerEnter={(e) => e.pointerType === 'mouse' && setOnly(i)}>{n}</li>)}</ul>
      </div>
      <div className="tl2-col core" aria-hidden="true">
        <p className="tl2-k l2-mono">collector</p>
        <div className="tl2-batch">{Array.from({ length: 6 }).map((_, i) => <i key={i} className={i < s.held ? 'on' : ''} />)}</div>
        <p className="tl2-sub l2-mono">batching</p>
        <div className="tl2-mem">
          <p className="l2-mono"><span>memory</span><span className="c">ceiling</span></p>
          <i><b style={{ transform: `scaleX(${s.mem})` }} className={s.mem > 0.85 ? 'hot' : ''} /><em /></i>
        </div>
      </div>
      <div className="tl2-col" aria-hidden="true">
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
  // after the arrival, a span keeps running the strip to the lit stage (idle), until Pause. Pinned (desktop) the picture
  // is on screen whenever its chapter is, so the flow follows the chapter index; stacked (phone) it waits to be seen.
  const flow = go && !held && (compact ? seen : true);
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
            return <span key={(at === 4 ? 'b' : 'c') + i} className={'tl2-ln' + (on ? ' on' : '')}><em>{String(i + 1).padStart(2, ' ')}</em>{on
              ? <motion.span className="tl2-w" variants={{ a: { clipPath: 'inset(0 100% 0 0)' }, b: { clipPath: 'inset(0 0% 0 0)' } }} transition={{ duration: 0.5, delay: 0.5 + 0.08 * n++, ease: [0.16, 1, 0.3, 1] }}>{body}</motion.span>
              : body}{'\n'}</span>;
          })}
          {/* builder.yaml is 9 lines: under it, the config.yaml the built binary runs, dimmed, so the window stays full */}
          {at === 4 && !compact && <>
            <span className="tl2-ln tl2-ghost-h" aria-hidden="true"><em>{'  '}</em>config.yaml{'\n'}</span>
            {CFG.slice(0, 10).map(([l], i) => <span key={'g' + i} className="tl2-ln tl2-ghost" aria-hidden="true"><em>{String(i + 1).padStart(2, ' ')}</em>{l}{'\n'}</span>)}
          </>}
        </code></pre>
      </div>
    </motion.div>
  );
}

/* the chapter's own Pause (the visual beside it is decorative), the same switch as the hero's */
function ChapterKey({ k }) {
  const [held, toggle] = useContext(Hold);
  return <div className="tl2-kr"><p className="tl2-key l2-mono">{k}:</p><PauseBtn paused={held} onClick={toggle} className="tl2-kp" /></div>;
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
        <pre><code>{text}</code></pre>
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
      <StageHero look="split" kick="telemetry.hanzo.ai" title="Hanzo Telemetry" sub="The collector that sits between your app and wherever the data goes" acts={[['View on GitHub', GH]]}>
        <Pipe />
      </StageHero>
      <PinScenes flip head="One hop you control" items={FACTS.map(([t, d, k]) => [t, d, <ChapterKey key="k" k={k} />])} visual={(at, p) => <Config at={at} compact={!p} />} />
      <Finale name="Telemetry" head="Put it in front of your backend" ask={['View on GitHub', GH]} object={<YourConfig />} prompt="Read https://hanzo.ai/skill.md and use Hanzo Telemetry in my project." tag="OpenTelemetry ingest" />
    </main>
    </Hold.Provider>
  );
}
