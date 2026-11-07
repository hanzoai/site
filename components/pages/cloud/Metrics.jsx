'use client';
/* Metrics, v2 launch page (Cloud 3).
   Round 4: the chapters are a stage (each changes the table itself: stacks arrive, the query bar takes over, a column grows per label, the spike opens into its chart and traces, the query folds into a rule, two orgs slide out) and the mode is a split-flap flip board (motion map: flip-board); one sticky table on phones; the Logs link moved into the black room; close h2 52px.
   Earlier: the chapters play by themselves (each runs its table once, then rests) and stack under 900px; the black room is Metrics' own console (the chart, set dark: the prompt's query lands on the line and opens its traces; one build, then rest); the line slides by transform; one solid fill per screen.
   Signature: the spike that opens. Three series stream across the chart, split by the label you pick; about every six
   seconds a spike rises, the cursor lands on it and the traces for that window open beside it, because they were never
   in a different system. Click the chart to hold a moment and keep its traces open.
   Beyond: Label check. Tick per-model, per-route, per-tenant in chapter three: the table grows a column for each while
   a time-series database would multiply series, Hanzo's own cardinality point made concrete before you pick a store.
   Persona: Developer. Goal: try Hanzo Metrics (read the source, then deploy).
   CTA: "View on GitHub" → https://github.com/hanzoai/metrics (data-cta metrics.hero, metrics.close; the site's thumb
   bar and sticky ask bar carry the same from data-thumb). Metric: api_key_created.
   Motion: idle = the line sliding (one CSS transform loop, no per-frame DOM writes), each chapter's table playing once
   when it arrives, the black room's console; pointer = the crosshair that reads the line under it, the magnetic ask;
   state = split tabs, the label check, PromQL ↔ builder, the held spike, a sent query landing on the line;
   arrival = the cut-in title, the timed wipe into the dark room; scroll = which chapter is on (desktop only).
   Every word and link is Hanzo's; chart and table values are drawn, not measured. */
import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion, useScroll, useMotionValueEvent } from 'motion/react';
import ClipWipe from '../../v2/ClipWipe';
import LaunchClose, { Arr } from '../../v2/LaunchClose';
import LineMask from '../../v2/LineMask';
import LivePause, { usePause } from '../../v2/LivePause';
import { Copy } from '../../ui';
import { A } from '../../kit';
import { play } from '../../../lib/sound';
import '../../v2/LaunchType.css';
import './Metrics.css';

const GH = 'https://github.com/hanzoai/metrics';
const PROMPT = 'Read https://hanzo.ai/skill.md and use Hanzo Metrics in my project. Start with: hanzo metrics query';

/* [ref, live, calm]: live while the element is on screen and motion is allowed. calm is read after mount, so the
   server's frame and the first client frame match (no hydration mismatch under reduced motion). */
function useLive(amount = 0.2) {
  const ref = useRef(null);
  const seen = useInView(ref, { amount });
  const rm = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const calm = mounted && !!rm;
  return [ref, seen && !calm, calm];
}
/* a requestAnimationFrame loop that only reads (the line itself moves by CSS), while run is true */
function useRaf(run, fn) {
  const f = useRef(fn);
  f.current = fn;
  useEffect(() => {
    if (!run) return;
    let raf = 0;
    const loop = () => { f.current(); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [run]);
}

/* ---------- the line: drawn once, two windows wide, slid left by one CSS transform loop ----------
   The waves repeat every window (W), so sliding the drawn path by exactly one window loops with no seam: nothing
   rewrites a path while it runs. Three spikes per window: one about every 5.7 s. */
const N = 96, STEP = 0.075, W = (N - 1) * STEP, SPEED = 0.42, PER = W / SPEED;
const OM = (2 * Math.PI) / W, F = 3 * OM, CUR = 60;
const md = (x, m) => ((x % m) + m) % m;
const wave = (t, k) => 0.36 + 0.11 * Math.sin(OM * t + k * 2.1) + 0.05 * Math.sin(2 * OM * t + k) + 0.02 * Math.sin(5 * OM * t + 2 * k) - k * 0.08 + (k === 0 ? Math.max(0, Math.sin(F * t)) ** 16 * 0.52 : 0);
const Y = (w) => 96 - w * 58; // y in % of the chart: the spike peaks near 38%
const X = (i) => (i * 100) / (N - 1);
const path = (k) => Array.from({ length: 2 * N - 1 }, (_, j) => (j ? 'L' : 'M') + X(j).toFixed(2) + ' ' + Y(wave(j * STEP, k)).toFixed(2)).join('');
const isSpike = (t, i) => wave(t + i * STEP, 0) > 0.6;
const TS = md(Math.PI / 2 / F - CUR * STEP, W / 3); // the window start that puts a spike under the cursor
const T0 = md(TS - 1.9 * SPEED, W); // the first spike lands 1.9 s in, after the line has drawn and the title has cut in
const PATHS = [0, 1, 2, 3].map(path);
const AREA = PATHS[0] + 'L200 100L0 100Z';
const SPANS = [['gateway', 0, 92], ['chat.completion', 6, 78], ['datastore.query', 14, 18], ['model.generate', 34, 48]];

/* The plot: grid, the area under the lead series and up to four series. `start` is where the window opens (0..W);
   `calm` sets it still at the spike. Reading the time back comes from the running animation's progress. */
function Plot({ g, n = 3, start, calm, id, hl = null }) {
  return (
    <svg className="mt-plot" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="currentColor" stopOpacity=".1" /><stop offset="1" stopColor="currentColor" stopOpacity="0" /></linearGradient></defs>
      {[40, 60, 80].map((y) => <line key={y} x1="0" x2="100" y1={y} y2={y} className="grid" />)}
      <g ref={g} className="mt-slide" style={calm ? { animation: 'none', transform: `translateX(${(-(TS / W) * 100).toFixed(3)}px)` } : { animationDuration: `${PER.toFixed(3)}s`, animationDelay: `${(-(start / W) * PER).toFixed(3)}s` }}>
        <path className="fill" d={AREA} fill={`url(#${id})`} />
        {Array.from({ length: n }, (_, k) => n - 1 - k).map((k) => <path key={k} className={'s' + k + (hl === k ? ' hl' : '')} d={PATHS[k]} />)}
      </g>
    </svg>
  );
}
const readT = (g) => {
  const a = g?.getAnimations?.()[0];
  const p = a?.effect?.getComputedTiming().progress;
  return p == null ? TS : p * W;
};

/* ---------- the hero object: the live chart and its traces ---------- */
const SPLIT = { 'per-model': ['zen', 'kai', 'enso'], 'per-route': ['/v1/chat', '/v1/embed', '/v1/search'], 'per-tenant': ['org a', 'org b', 'org c'] };

function Field({ lead }) {
  const [ref, live, calm] = useLive(0.15); // the chart tile only: the loop stops once the chart leaves
  const [paused, pause] = usePause();
  const [split, setSplit] = useState('per-model');
  const [open, setOpen] = useState(false); // the traces for that window are open (3 s after a spike)
  const [ride, setRide] = useState(0); // spikes seen: each restarts the flag riding its spike
  const [seen, setSeen] = useState(false); // traces have opened once: between spikes they rest, dimmed, not blank
  const [held, setHeld] = useState(null); // { i, spike } the hand is holding, or null
  const [hk, setHk] = useState(null); // the series under the crosshair
  const g = useRef(null);
  const el = useRef({ x: null, dot: null, was: false, until: 0 });
  const run = live && held === null && !paused;
  useEffect(() => { if (calm) { setOpen(true); setSeen(true); } }, [calm]);
  useRaf(run, () => {
    const r = el.current, now = performance.now();
    const s = isSpike(readT(g.current), CUR);
    if (s && !r.was) { r.until = now + 3000; setRide((v) => v + 1); setSeen(true); }
    r.was = s;
    const o = now < r.until;
    setOpen((v) => (v === o ? v : o));
  });
  // the crosshair reads the line under a fine pointer (transforms only) and names the series it is nearest
  const move = (e) => {
    if (e.pointerType !== 'mouse' || calm) return;
    const r = el.current, box = e.currentTarget.getBoundingClientRect(), t = readT(g.current);
    const fx = Math.min(1, Math.max(0, (e.clientX - box.left) / box.width));
    const h = box.height - 24; // the chart sits 24px down
    const ys = [0, 1, 2].map((k) => (Y(wave(t + fx * (N - 1) * STEP, k)) / 100) * h);
    const py = e.clientY - box.top - 24;
    const k = ys.reduce((b, y, i) => (Math.abs(y - py) < Math.abs(ys[b] - py) ? i : b), 0);
    r.x?.style.setProperty('transform', `translate3d(${e.clientX - box.left}px,0,0)`);
    r.dot?.style.setProperty('transform', `translate3d(0,${ys[k]}px,0)`);
    r.x?.setAttribute('data-on', '');
    setHk((v) => (v === k ? v : k));
  };
  const out = () => { el.current.x?.removeAttribute('data-on'); setHk(null); };
  // a click holds the moment under the pointer; the line only says "spike" if a spike is really there
  const hold = (e) => {
    if (held !== null) { setHeld(null); return; }
    const box = e.currentTarget.getBoundingClientRect();
    const i = e.detail === 0 ? CUR : Math.round(Math.min(1, Math.max(0, (e.clientX - box.left) / box.width)) * (N - 1));
    setHeld({ i, spike: isSpike(readT(g.current), i) }); setSeen(true);
  };
  const series = SPLIT[split];
  const who = hk !== null ? series[hk] : series[0];
  const show = calm || held !== null || hk !== null || open;
  const flag = held ? held.spike : open || calm;
  return (
    <div className="mt-live">
      <div className="lx-wrap mt-top">
        {lead}
        <div className="mt-tool">
          <LivePause paused={paused} onToggle={pause} inline className="mt-pause" />
          <span className="mt-host">metrics.hanzo.ai</span>
          <code className="mt-q">rate(http_requests_total[5m])</code>
          <div className="mt-split" role="group" aria-label="Split by label" style={{ '--i': Object.keys(SPLIT).indexOf(split) }}>
            {Object.keys(SPLIT).map((l) => <button key={l} type="button" aria-pressed={split === l} onClick={() => setSplit(l)}>{l}</button>)}
          </div>
          <ul className="mt-legend" aria-label="Series">{series.map((s, k) => <li key={s} className={'s' + k + (hk === k ? ' hl' : '')}><i />{s}</li>)}</ul>
        </div>
      </div>
      <div className="lx-wrap mt-stage" ref={ref}>
        <button type="button" className={'mt-field' + (run ? '' : ' stop')} style={{ '--ride': (-(300 / PER)).toFixed(2) + 'cqw' }} aria-label={held !== null ? 'Let the chart run again' : 'Hold this moment and open its traces'} aria-pressed={held !== null} onClick={hold} onPointerMove={move} onPointerLeave={out} data-cursor="">
          <Plot g={g} start={T0} calm={calm} id="mt-g" />
          <span key={held ? 'h' + held.i : 'r' + ride} className={'mt-mark' + (flag || held ? ' on' : '') + (ride && !held && !calm ? ' ride' : '')} style={{ left: X(held ? held.i : CUR) + '%' }} aria-hidden="true">
            <i className="mt-cur" />
            <span className={'mt-flag' + (flag ? ' on' : '')}><svg viewBox="0 0 16 16" width="14" height="14"><path d="M3 2l9 6-4 1-2 4z" fill="currentColor" /></svg>spike · {series[0]}</span>
          </span>
          <span className="mt-x" ref={(e) => (el.current.x = e)} aria-hidden="true"><i ref={(e) => (el.current.dot = e)} /></span>
        </button>
        <div className={'mt-traces' + (show ? ' on' : seen ? ' rest' : '')}>
          <p className="mt-tk" aria-live="polite">{show || seen ? <>traces for that window · <b>{who}</b></> : 'a spike is the start of a question'}</p>
          <ol className="mt-fall">
            {SPANS.map(([n, x, w], i) => (
              <li key={n} style={{ '--i': i }}><span className="mt-sn">{n}</span><span className="mt-sb" aria-hidden="true"><b style={{ left: x + '%', width: w + '%' }} /></span></li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

/* ---------- the chapters' object: a metric as a row ---------- */
const ROWS = [
  ['metric', 'http_requests_total', 0.46, 'zen', '/v1/chat', 'org a'],
  ['trace', 'chat.completion', 0.72, 'zen', '/v1/chat', 'org a'],
  ['log', 'request served', 0.2, 'zen', '/v1/chat', 'org a'],
  ['metric', 'http_requests_total', 0.38, 'kai', '/v1/embed', 'org b'],
  ['trace', 'embed', 0.3, 'kai', '/v1/embed', 'org b'],
  ['metric', 'http_requests_total', 0.52, 'enso', '/v1/search', 'org c'],
  ['log', 'request served', 0.18, 'enso', '/v1/search', 'org c'],
];
const TAGS = ['per-model', 'per-route', 'per-tenant'];
const COL = { 'per-model': 'model', 'per-route': 'route', 'per-tenant': 'tenant' };
// how many beats each chapter plays when it arrives (intro = -1), one every BEAT ms, then it rests on the last
const BEATS = { '-1': 3, 0: 3, 1: 0, 2: 2, 3: 3, 4: 2, 5: 3 };
const BEAT = 900;

/* the beat a chapter is on: 0 when it arrives, +1 every BEAT while seen, resting at its last (calm: the last at once) */
function useBeat(key, live, calm) {
  const max = BEATS[key];
  const [s, setS] = useState({ k: key, p: 0 });
  const p = calm ? max : s.k === key ? s.p : 0;
  useEffect(() => {
    if (!live || calm || p >= max) return;
    const t = setTimeout(() => setS({ k: key, p: p + 1 }), p === 0 ? 500 : BEAT);
    return () => clearTimeout(t);
  }, [key, live, calm, p, max]);
  return p;
}

/* The flip board (the page's signature): a departure-board strip of tiles. When the value changes, each tile whose
   letter changes flips down to the new one, left to right. Padded to a fixed width, so nothing beside it moves. */
const BOARD = 19; // the longest mode, "org from your token"
function Flip({ text, n = BOARD, className = '' }) {
  const s = text.padStart(n, ' ');
  return (
    <span className={'mt-board ' + className} role="img" aria-label={text}>
      {[...s].map((c, j) => <i key={j + ':' + c} className={c === ' ' ? 'sp' : undefined} style={{ '--j': Math.max(0, j - (n - text.length)) }} aria-hidden="true">{c === ' ' ? '' : c}</i>)}
    </span>
  );
}

function Table({ step, on, auto }) {
  const [ref, live, calm] = useLive(0.55); // plays once most of the table is in view, so the reader sees it play
  const p = useBeat(step, live, calm);
  const [alt, setAlt] = useState(false);
  useEffect(() => {
    if (!live || step !== 1) return;
    const t = setTimeout(() => setAlt((a) => !a), 2200);
    return () => clearTimeout(t);
  }, [live, step, alt]);
  // chapter 03 ticks per-route, then per-tenant, through the label check, until the visitor taps one
  useEffect(() => { if (step === 2 && p > 0) auto?.(p); }, [step, p]); // eslint-disable-line react-hooks/exhaustive-deps
  const intro = step === -1;
  const picked = TAGS.filter((_, i) => on[i]).map((t) => COL[t]);
  const by = picked.length ? `sum by (${picked.join(', ')}) ` : '';
  const rule = step === 4 && p >= 2, scoped = step === 5 && p >= 1;
  const mode = step === 1 ? (alt ? 'builder' : 'PromQL') : rule ? 'kept as a rule' : scoped ? 'org from your token' : 'one query';
  return (
    <div className="mt-tab" ref={ref} data-step={intro ? 'intro' : step} data-beat={p} style={step === 2 ? { '--cm': picked.includes('model') ? '.6fr' : '0fr', '--cr': picked.includes('route') ? '1fr' : '0fr', '--ct': picked.includes('tenant') ? '.6fr' : '0fr' } : undefined}>
      <div className="mt-tab-bar">
        <span className="mt-dots" aria-hidden="true"><i /><i /><i /></span>
        <span className="mt-store">Hanzo Datastore</span>
        <span className={'mt-chip' + (rule ? ' on' : '')}>alert rule</span>
        <span className={'mt-chip' + (scoped ? ' on' : '')}>token · org a</span>
      </div>
      <div className="mt-tab-q">
        {step === 1 && alt ? (
          <span className="mt-pills"><i>http_requests_total</i><i>rate</i><i>5m</i></span>
        ) : (
          <code>{step >= 2 && step <= 4 ? by : ''}rate(http_requests_total[5m]){scoped ? '{tenant="org a"}' : ''}</code>
        )}
        <Flip text={mode} className="mt-mode" />
      </div>
      <div className="mt-grid" role="table" aria-label="Metrics, logs and traces as rows in one column store">
        <div className="mt-row head" role="row">
          {['kind', 'name', 'value', 'model', 'route', 'tenant'].map((c) => <span key={c} role="columnheader" className={'c-' + c + ((picked.includes(c) && step === 2) || (c === 'tenant' && scoped) ? ' lit' : '')}>{c}</span>)}
        </div>
        {ROWS.map(([kind, name, v, model, route, tenant], i) => {
          const order = ['metric', 'trace', 'log'].indexOf(kind) + 1;
          const hot = intro ? kind === 'metric' && i < [0, 3, 5][p - 1] + 1 && p > 0
            : step === 0 ? order <= p
            : step === 1 ? kind === 'metric'
            : step === 3 ? (i === 0 && p >= 1) || (i === 1 && p >= 2) || (i === 2 && p >= 3)
            : step === 4 ? i === 0 && p >= 1
            : step === 2 || step === 5;
          const gone = (step === 5 && ((tenant === 'org b' && p >= 2) || (tenant === 'org c' && p >= 3))) || (intro && kind !== 'metric');
          const grown = step === 3 && i === 0 && p >= 1;
          return (
            <div key={i} role="row" className={'mt-row r-' + kind + (hot ? ' hot' : '') + (gone ? ' gone' : '') + (grown ? ' spike' : '')} style={{ '--i': i }}>
              <span role="cell" className="c-kind"><i className={'k-' + kind} />{kind}</span>
              <span role="cell" className="c-name">{name}</span>
              <span role="cell" className="c-value"><b style={{ transform: `scaleX(${grown ? 1 : intro && !hot ? 0.06 : v})` }} /></span>
              <span role="cell" className={'c-model' + (picked.includes('model') && step === 2 ? ' lit' : '')}>{model}</span>
              <span role="cell" className={'c-route' + (picked.includes('route') && step === 2 ? ' lit' : '')}>{route}</span>
              <span role="cell" className={'c-tenant' + ((picked.includes('tenant') && step === 2) || scoped ? ' lit' : '')}>{tenant}</span>
            </div>
          );
        })}
        <div className={'mt-tab-spike' + (step === 3 && p >= 2 ? ' on' : '')} aria-hidden="true">
          <svg viewBox="0 0 100 40" preserveAspectRatio="none"><path d="M0 30 L18 28 L30 31 L42 27 L50 29 L56 6 L62 28 L74 26 L86 29 L100 27" /></svg>
          <ol className="mt-fall">
            {SPANS.map(([n, x, w], k) => (
              <li key={n} style={{ '--i': k }}><span className="mt-sn">{n}</span><span className="mt-sb"><b style={{ left: x + '%', width: w + '%' }} /></span></li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

function LabelCheck({ on, pick }) {
  const picked = TAGS.filter((_, i) => on[i]);
  const f = picked.length ? picked.map((l) => l.slice(4) + 's').join(' × ') : 'one';
  return (
    <div className="mt-lab">
      <div className="mt-lab-c" role="group" aria-label="Labels to add">
        {TAGS.map((l, i) => <button key={l} type="button" aria-pressed={on[i]} onClick={() => pick(i)}>{l}</button>)}
      </div>
      <dl className="mt-lab-r" aria-live="polite">
        <div><dt>In a time-series database</dt><dd>series = {f}</dd></div>
        <div><dt>Here</dt><dd>{picked.length} more column{picked.length === 1 ? '' : 's'}</dd></div>
      </dl>
    </div>
  );
}

/* The chapters: desktop pins the words beside one table that plays each chapter once as it comes on; the numbered rail
   fills while it plays. Under 900px nothing pins: each chapter is its own table above its words. Hidden chapters are
   inert, so their buttons leave the tab order. JS off: every chapter in reading order beside the table. */
const pad = (n) => String(n).padStart(2, '0');
function Chapters({ intro, steps, table }) {
  const ref = useRef(null);
  const n = steps.length, total = n + 1;
  const [at, setAt] = useState(-1);
  const [mounted, setMounted] = useState(false);
  const [wide, setWide] = useState(true);
  useEffect(() => { setMounted(true); const m = matchMedia('(min-width: 900px)'); const f = () => setWide(m.matches); f(); m.addEventListener('change', f); return () => m.removeEventListener('change', f); }, []);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    if (!wide) return;
    const i = Math.min(total - 1, Math.max(0, Math.floor(p * total * 0.999))) - 1;
    setAt((v) => (v === i ? v : i));
  });
  const jump = (i) => {
    const el = ref.current;
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY + ((i + 1.5) / total) * (el.offsetHeight - window.innerHeight);
    const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.__lenis ? window.__lenis.scrollTo(y, { duration: calm ? 0 : 1.4, easing: (t) => 1 - Math.pow(1 - t, 4) }) : window.scrollTo({ top: y, behavior: calm ? 'auto' : 'smooth' });
  };
  const pin = mounted && wide;
  // under 900px nothing pins: one table sticks above the words, and the chapter crossing the middle of the screen drives it
  useEffect(() => {
    if (!mounted || wide || !ref.current) return;
    const arts = [...ref.current.querySelectorAll('.mt-ch-step')];
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setAt(arts.indexOf(e.target) - 1)), { rootMargin: '-55% 0px -40% 0px' });
    arts.forEach((a) => io.observe(a));
    return () => io.disconnect();
  }, [mounted, wide]);
  const where = (i) => (i < at ? 'past' : i === at ? 'on' : 'next');
  const step = (i, body) => (
    <article key={i} className={'mt-ch-step' + (i < 0 ? ' mt-ch-intro' : '')} data-at={where(i)} inert={pin && i !== at ? true : undefined}>
      {body}
    </article>
  );
  return (
    <section ref={ref} className="mt-ch" data-pin={pin || undefined} style={{ '--n': total }} aria-label="What a metric is here">
      <div className="mt-ch-stick">
        <div className="lx-wrap mt-ch-grid">
          <div className="mt-ch-copy">
            <div className="mt-ch-steps">
              {step(-1, <><h2 className="mt-ch-it">{intro.title.map((l, i) => <span key={i}>{l} </span>)}</h2><p className="mt-ch-il">{intro.lede}</p></>)}
              {steps.map((s, i) => step(i, <>
                <h3 className="mt-ch-t">{s.t}</h3>
                <p className="lx-kick mt-ch-k">{`${pad(i + 1)} / ${pad(n)}`}</p>
                <p className="mt-ch-d">{s.d}</p>
                {s.extra}
              </>))}
            </div>
            <nav className="mt-ch-rail" aria-label="What a metric is here">
              {steps.map((s, i) => (
                <button key={i} type="button" tabIndex={pin ? 0 : -1} aria-current={i === at ? 'step' : undefined} aria-label={`${pad(i + 1)}: ${s.t}`} onClick={() => jump(i)} data-at={where(i)}>
                  <span aria-hidden="true">{pad(i + 1)}</span><i key={i === at ? 'on' : 'off'} />
                </button>
              ))}
            </nav>
          </div>
          <div className="mt-ch-obj">{table(at)}</div>
        </div>
      </div>
    </section>
  );
}

const POINTS = [
  ['One store, not four', 'Metrics go where the logs and traces already are — Hanzo Datastore, a column store. Nothing to run beside it and nothing to keep in sync with it.'],
  ['PromQL, or the builder', 'Bring the PromQL you already wrote, or assemble the query in the UI without learning it. Both compile to the same thing.'],
  ['Labels you would not dare add', 'Per-model, per-route, per-tenant. A column store counts distinct values for a living, so a label that would multiply series in a time-series database is just another column here.'],
  ['The number leads somewhere', 'A spike on a chart is the start of a question, not the end. Click it and you are in the traces for that window, because they were never in a different system.'],
  ['Alerts are saved queries', 'You write the query, look at it, then keep it as a rule. What pages you is something you have already seen return the answer you expected.'],
  ['Scoped to your org', 'Every query carries the org from your token, so one deployment serves many tenants and no panel can read across them.'],
];

/* ---------- the black room: Metrics' own console, its chart set dark ----------
   On arrival (and again whenever the prompt is copied, or the chart is clicked) the prompt's query travels to the
   console and lands on the line; its traces open below. checkout-web finishes its one build, chimes, and rests. */
const SIDE = [['Metrics', '/metrics'], ['Logs', '/cloud/logs'], ['Dashboards', '/dashboards'], ['O11y', '/o11y'], ['AI Metrics', '/cloud/ai-metrics'], ['Billing', '/billing'], ['Plans & Pricing', '/cloud/plans'], ['Sessions', '/cloud/sessions']];
const ICONS = ['M2 12l4-4 3 3 5-6', 'M5 2.5h6M3.5 6h9M2 9.5h12v4H2z', 'M2.5 3h11v4h-11zM2.5 9h11v4h-11z', 'M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM1.5 8h13', 'M8 2 2.5 5v6L8 14l5.5-3V5zM2.5 5 8 8l5.5-3M8 8v6', 'M3 3h3v3H3zM10 10h3v3h-3zM6 4.5h3.5v5.5', 'M8 2v4M8 6 4 10M8 6l4 4M4 10v4M12 10v4', 'M8 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6ZM2.5 14c.8-2.6 3-4 5.5-4s4.7 1.4 5.5 4'];
const CAP = 'The service the session above is changing.';
const SERVICES = [['gateway', CAP], ['payments-api'], ['checkout-web', 'A build is running from the last commit on main.'], ['docs-site']];
const LAND = 72; // where a sent query lands on the line (index)
const RT0 = md(TS + 9, W);

function Room() {
  const [ref, live, calm] = useLive(0.3);
  const [paused, pause] = usePause();
  const [sent, setSent] = useState(0); // queries sent: the first goes on arrival
  const [land, setLand] = useState(null); // { x, y } of the landed query, in % of the chart
  const [built, setBuilt] = useState(false); // checkout-web builds once, then rests
  const [at, setAt] = useState(0);
  const g = useRef(null);
  const run = live && !paused;
  const send = () => setSent((v) => v + 1);
  useEffect(() => { if (live && sent === 0) send(); }, [live]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (calm) { setLand({ x: X(LAND), y: Y(wave(TS + LAND * STEP, 0)) }); setBuilt(true); } }, [calm]);
  // a sent query crosses the wire (0.9 s) and lands on the gateway line where the line is at that moment
  useEffect(() => {
    if (!sent || calm) return;
    setLand(null);
    const t = setTimeout(() => { setLand({ x: X(LAND), y: Y(wave(readT(g.current) + LAND * STEP, 0)) }); setAt(0); }, 900);
    return () => clearTimeout(t);
  }, [sent, calm]);
  useEffect(() => {
    if (!land || built || calm || paused) return;
    const t = setTimeout(() => { setBuilt(true); play('done'); }, 3200);
    return () => clearTimeout(t);
  }, [land, built, calm, paused]);
  const status = (n) => (n === 'checkout-web' && !built ? 'Building' : 'Ready');
  const cur = SERVICES[at];
  return (
    <ClipWipe dark className="mt-send">
      <div className="lx-wrap mt-send-grid" ref={ref}>
        <div className="mt-send-l">
          <h2 className="lx-headline">Send a metric, then follow it</h2>
          <div className="mt-paste">
            <p className="mt-paste-t">Paste and ship</p>
            <p className="mt-paste-d">Paste this into any agent. It reads the skill manifest and calls Metrics from there.</p>
            <div className="mt-paste-box">
              <div className="mt-paste-bar">
                <span className="mt-paste-k">Agent prompt</span>
                <span className="mt-api"><i>api</i>/v1/event/insights</span>
                <span className="mt-copy" onClickCapture={send}><Copy text={PROMPT} /></span>
              </div>
              <pre className="mt-paste-code"><code>{PROMPT}</code><span className="mt-caret" aria-hidden="true" /></pre>
            </div>
          </div>
          <nav className="mt-rel" aria-label="Related capabilities">
            <p className="mt-rel-k">Related capabilities</p>
            <A to="/cloud/logs" className="mt-logs"><b>Logs</b><span>Search every line</span><Arr /></A>
          </nav>
        </div>
        <i className="mt-wire" aria-hidden="true"><b key={sent} className={sent && !calm ? 'go' : ''} /></i>
        <div className="mt-send-r">
          <div className={'mt-con' + (run ? '' : ' stop')}>
            <div className="mt-con-bar">
              <LivePause paused={paused} onToggle={pause} dark inline className="mt-con-pause" />
              <span className="mt-dots" aria-hidden="true"><i /><i /><i /></span>
              <A to="/home" className="mt-con-title">Metrics — Hanzo</A>
            </div>
            <div className="mt-con-body">
              <nav className="mt-con-side" aria-label="Products">
                {SIDE.map(([t, to], i) => (
                  <A key={t} to={to} className={'mt-con-ico' + (i === 0 ? ' on' : '')} aria-label={t}>
                    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d={ICONS[i]} fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /></svg>
                    <span className="mt-tip">{t}</span>
                  </A>
                ))}
              </nav>
              <div className="mt-con-main">
                <button type="button" className="mt-rfield" style={{ '--ride': (-(600 / PER)).toFixed(2) + 'cqw' }} aria-label="Send the query again" onClick={send}>
                  <Plot g={g} n={4} start={RT0} calm={calm} id="mt-rg" hl={at} />
                  {land && (
                    <span key={sent} className={'mt-land' + (calm ? '' : ' ride')} style={{ left: land.x + '%', top: land.y + '%' }} aria-hidden="true">
                      <i /><span className="mt-land-f">hanzo metrics query</span>
                    </span>
                  )}
                </button>
                <ul className="mt-svc" aria-label="Projects">
                  {SERVICES.map(([n], i) => (
                    <li key={n}>
                      <button type="button" aria-pressed={at === i} onClick={() => setAt(i)} onPointerEnter={(e) => e.pointerType === 'mouse' && setAt(i)}>
                        <i className={'mt-svc-l s' + i} aria-hidden="true" />
                        <span className="mt-svc-n">{n}</span>
                        <span className={'mt-svc-s' + (status(n) === 'Building' ? ' b' : '')}>{status(n) === 'Building' && <b aria-hidden="true" />}{status(n)}</span>
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="mt-con-cap" aria-live="polite">
                  {SERVICES.filter((s) => s[1]).map(([n, c]) => <p key={n} hidden={cur[0] !== n}>{c}</p>)}
                  {!cur[1] && <p>{cur[0]} · {status(cur[0])}</p>}
                </div>
                <div className={'mt-con-tr' + (land ? ' on' : '')}>
                  <p className="mt-tk">traces for that window · <b>gateway</b></p>
                  <ol className="mt-fall">
                    {SPANS.map(([n, x, w], i) => (
                      <li key={n} style={{ '--i': i }}><span className="mt-sn">{n}</span><span className="mt-sb" aria-hidden="true"><b style={{ left: x + '%', width: w + '%' }} /></span></li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
            <div className="mt-con-foot">
              <span>api.hanzo.ai<b>/v1/event/insights</b></span>
              <A to="https://hanzo.team/" className="mt-con-open">Open in the console ↗</A>
            </div>
          </div>
          <p className="mt-note">Example project. Every name in it is one you would give your own.</p>
        </div>
      </div>
    </ClipWipe>
  );
}

export default function Metrics() {
  const [on, setOn] = useState([true, false, false]);
  const mine = useRef(false);
  const pick = (i) => { mine.current = true; setOn((o) => o.map((v, j) => (j === i ? !v : v))); };
  const auto = (p) => { if (!mine.current) setOn([true, p >= 1, p >= 2]); };
  const steps = POINTS.map(([t, d], i) => ({ t, d, extra: i === 2 ? <LabelCheck on={on} pick={pick} /> : null }));
  return (
    <main className="lx mt">
      <section className="mt-hero" data-morph-target data-ask-name="Hanzo Metrics">
        <Field lead={(
          <div className="mt-lead">
            <LineMask as="h1" className="lx-display mt-h1" lines={['Hanzo Metrics']} />
            <p className="lx-lede mt-sub">The metrics half of Hanzo O11y</p>
            <A to={GH} className="lx-cta" data-thumb="View on GitHub" data-cta="metrics.hero">View on GitHub<Arr /></A>
          </div>
        )} />
      </section>

      <Chapters
        intro={{ title: ['What a metric', 'is here'], lede: 'A row in a column store rather than a series in a store of its own.' }}
        steps={steps}
        table={(at) => <Table step={at} on={on} auto={auto} />} />

      <Room />

      <LaunchClose className="mt-close" name="Metrics" tag="Time-series metrics" seed="metrics" data={[4, 6]} ask={['View on GitHub', GH]} cta="metrics.close" repo={['hanzoai/metrics', GH]} stars="4 stars" />
    </main>
  );
}
