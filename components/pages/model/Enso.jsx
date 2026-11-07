'use client';
/* Enso: one endpoint that routes every request. v2 launch page (Launch + Chapters, ink on white, Enso's own film).
   Signature: the switchboard. Requests stream in by themselves, pass through Enso, which weighs quality, speed and
   cost, and land in the tier made for them (Flash at volume, Pro while someone waits, Ultra where a wrong answer is
   expensive). Send any of Hanzo's own task words by hand.
   Beyond: the GPQA Diamond explorer. Pick any model (or let it tour) and see it beside Enso's three tiers in
   Hanzo's own figures and words, with every result in a table you can re-sort by score or by cost. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'motion/react';
import { EASE } from '../../ui';
import { A, More, Cta, Img, Stat, DataTable, Band } from '../../kit';
import { useLoop, fit } from './live';
import Launch, { Lines, ring, film } from '../../v2/Launch';
import ModelCards from './ModelCards';
import ModelFilm, { usePaused } from '../../v2/ModelFilm';
import Chapters from '../../v2/x-cray/Chapters';
import './Enso.css';

const TIERS = [
  { name: 'Enso Flash', code: 'enso', inp: '$0.33', out: '$1.65', ctx: true, axis: 0, why: 'at volume', wb: 'https://platform.hanzo.ai/workbench?model=enso', desc: 'For chat, extraction, classification and simple agent steps at volume.' },
  { name: 'Enso Pro', code: 'enso-pro', inp: '$4.40', out: '$22', ctx: false, axis: 1, why: 'while someone waits', wb: 'https://platform.hanzo.ai/workbench?model=enso-pro', desc: 'For coding, code review and agents that answer while someone waits.' },
  { name: 'Enso Ultra', code: 'enso-ultra', inp: '$5.50', out: '$27.50', ctx: true, axis: 2, why: 'a wrong answer is expensive', wb: 'https://platform.hanzo.ai/workbench?model=enso-ultra', desc: 'For work where a wrong answer is expensive: research, security review and long autonomous runs.' },
];
const AXES = ['cost', 'speed', 'quality'];
// Hanzo's own task words from each tier, in the order the board sends them by itself
const TASKS = [['chat', 0], ['coding', 1], ['research', 2], ['extraction', 0], ['code review', 1], ['security review', 2], ['classification', 0], ['agents', 1], ['long autonomous runs', 2], ['simple agent steps', 0]];

const bez = (p, t) => { const u = 1 - t; return [0, 1].map((k) => u * u * u * p[0][k] + 3 * u * u * t * p[1][k] + 3 * u * t * t * p[2][k] + t * t * t * p[3][k]); };
const ease = (t) => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3);

function Switchboard() {
  const board = useRef(null), cv = useRef(null), queue = useRef(null), node = useRef(null), lanes = useRef([]);
  const geom = useRef(null), pulses = useRef([]), clock = useRef({ next: 0.6, i: 0, hold: 0 }), uid = useRef(3);
  const [log, setLog] = useState([{ id: 2, task: 'research', tier: 2, done: true }, { id: 1, task: 'coding', tier: 1, done: true }, { id: 0, task: 'chat', tier: 0, done: true }]);
  const [axis, setAxis] = useState(-1);
  const [hit, setHit] = useState(-1);
  const [last, setLast] = useState(['chat', 'coding', 'research']);
  const calm = useReducedMotion();
  const paused = usePaused();

  const measure = () => {
    const b = board.current?.getBoundingClientRect();
    if (!b || !node.current || !queue.current) return;
    const rel = (el) => { const r = el.getBoundingClientRect(); return { l: r.left - b.left, t: r.top - b.top, r: r.right - b.left, b: r.bottom - b.top, w: r.width, h: r.height }; };
    const q = rel(queue.current), n = rel(node.current), L = lanes.current.map(rel);
    const cx = n.l + n.w / 2, cy = n.t + n.h / 2, R = n.w / 2;
    const wide = b.width > 860;
    let inP, outP;
    if (wide) {
      const s = [q.r, q.t + 26], e = [cx - R, cy], m = (s[0] + e[0]) / 2;
      inP = [s, [m, s[1]], [m, e[1]], e];
      outP = L.map((l) => { const s2 = [cx + R, cy], e2 = [l.l, l.t + l.h / 2], m2 = (s2[0] + e2[0]) / 2; return [s2, [m2, s2[1]], [m2, e2[1]], e2]; });
    } else {
      const s = [q.l + q.w / 2, q.b], e = [cx, n.t];
      inP = [s, [s[0], s[1] + 24], [e[0], e[1] - 24], e];
      outP = L.map((l) => { const s2 = [cx, n.b], e2 = [l.l, l.t + 40]; return [s2, [8, s2[1] + 30], [8, e2[1] - 30], e2]; });
    }
    geom.current = { inP, outP };
  };

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(board.current);
    return () => ro.disconnect();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const send = (k, byHand) => {
    const [task, tier] = TASKS[k];
    const id = uid.current++;
    pulses.current.push({ id, tier, task, age: 0, lit: false });
    setLog((l) => [{ id, task, tier, done: false }, ...l].slice(0, 4));
    if (byHand) clock.current.hold = 6;
    if (calm) { setLast((p) => p.map((x, j) => (j === tier ? task : x))); setLog((l) => l.map((e) => (e.id === id ? { ...e, done: true } : e))); }
  };

  useLoop(board, (t, dt, still) => {
    const c = cv.current;
    if (!c || !geom.current) return;
    const { w, h, d } = fit(c);
    const g = c.getContext('2d');
    g.clearRect(0, 0, w, h);
    g.lineWidth = 1.25 * d;
    const curve = (p, a) => { g.strokeStyle = `rgba(255,255,255,${a})`; g.beginPath(); g.moveTo(p[0][0] * d, p[0][1] * d); g.bezierCurveTo(p[1][0] * d, p[1][1] * d, p[2][0] * d, p[2][1] * d, p[3][0] * d, p[3][1] * d); g.stroke(); };
    const { inP, outP } = geom.current;
    curve(inP, 0.16);
    outP.forEach((p, i) => curve(p, i === hit ? 0.42 : 0.13));
    if (still || paused) return;
    const ck = clock.current;
    ck.hold = Math.max(0, ck.hold - dt);
    ck.next -= dt;
    if (ck.next <= 0) { ck.next = 1.7; if (!ck.hold) { send(ck.i % TASKS.length); ck.i++; } }
    const comet = (p, at) => {
      for (let k = 9; k >= 0; k--) {
        const [x, y] = bez(p, Math.max(0, at - k * 0.022));
        g.fillStyle = `rgba(255,255,255,${(1 - k / 10) * (k ? 0.35 : 1)})`;
        g.beginPath(); g.arc(x * d, y * d, (k ? 2.2 : 3.6) * d, 0, 6.283); g.fill();
      }
    };
    pulses.current = pulses.current.filter((pl) => {
      pl.age += dt;
      if (pl.age < 0.6) comet(inP, ease(pl.age / 0.6));
      else if (pl.age < 0.85) { if (!pl.lit) { pl.lit = true; setAxis(TIERS[pl.tier].axis); } }
      else if (pl.age < 1.5) { curve(outP[pl.tier], 0.5); comet(outP[pl.tier], ease((pl.age - 0.85) / 0.65)); }
      else {
        setHit(pl.tier); setAxis(-1);
        setLast((p) => p.map((x, j) => (j === pl.tier ? pl.task : x)));
        setLog((l) => l.map((e) => (e.id === pl.id ? { ...e, done: true } : e)));
        return false;
      }
      return true;
    });
  });

  useEffect(() => { if (hit < 0) return; const t = setTimeout(() => setHit(-1), 900); return () => clearTimeout(t); }, [hit, last]);

  return (
    <div className="eo-board mb-panel" ref={board}>
      <canvas ref={cv} className="eo-wires" aria-hidden="true" />
      <div className="eo-in">
        <p className="mb-mono">Requests</p>
        <ul className="eo-queue" ref={queue}>
          <AnimatePresence initial={false} mode="popLayout">
            {log.map((e) => (
              <motion.li key={e.id} layout initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, transition: { duration: 0.2 } }} transition={{ duration: 0.5, ease: EASE }}>
                <span>{e.task}</span>
                <em data-done={e.done ? '' : undefined}>{e.done ? TIERS[e.tier].name : 'routing'}</em>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>
      <div className="eo-node" ref={node}>
        <svg className="eo-enso" viewBox="0 0 100 100" aria-hidden="true"><path d="M50 8a42 42 0 1 1-30.4 13" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" /></svg>
        <strong>Enso</strong>
        {AXES.map((a, i) => <span key={a} className={'eo-ax eo-ax' + i} data-on={axis === i ? '' : undefined}>{a}</span>)}
      </div>
      <ol className="eo-lanes">
        {TIERS.map((tr, i) => (
          <li key={tr.code} className="eo-lane" ref={(el) => (lanes.current[i] = el)} data-hit={hit === i ? '' : undefined}>
            <div className="eo-lane-top">
              <b>{tr.name}</b>
              <code>{tr.code}</code>
            </div>
            <span className="eo-why">{AXES[tr.axis]} · {tr.why}</span>
            <p className="eo-last" aria-hidden="true"><i />{last[i]}</p>
          </li>
        ))}
      </ol>
      <div className="eo-send">
        <p className="mb-mono">Send a request</p>
        <div className="mb-chips">
          {TASKS.map(([task], k) => <button key={task} type="button" className="mb-chip" onClick={() => send(k, true)}>{task}</button>)}
        </div>
      </div>
    </div>
  );
}

// GPQA Diamond: Hanzo's figures and Hanzo's own sentence for each model, verbatim
const SINGLE = ', a single model tested on the same 198 GPQA Diamond questions, $';
const GPQA = [
  ['DeepSeek V4 Pro', 76.3, 1.05, 'DeepSeek V4 Pro 0423 76.3%' + SINGLE + '1.05 per 1,000 of them'],
  ['Sonnet 5', 77.8, 42.91, 'Claude Sonnet 5 77.8%' + SINGLE + '42.91 per 1,000 of them'],
  ['Fable 5', 82.8, 14.95, 'Claude Fable 5 82.8%' + SINGLE + '14.95 per 1,000 of them'],
  ['Haiku 5.5', 83.3, 1.07, 'Claude Haiku 5.5 83.3%' + SINGLE + '1.07 per 1,000 of them'],
  ['Opus 4.8', 87.4, 45.01, 'Claude Opus 4.8 87.4%' + SINGLE + '45.01 per 1,000 of them'],
  ['Fable 5.1', 87.9, 46.25, 'Claude Fable 5.1 87.9%' + SINGLE + '46.25 per 1,000 of them'],
  ['Sonnet 5.5', 90.4, 10.41, 'Claude Sonnet 5.5 90.4%' + SINGLE + '10.41 per 1,000 of them'],
  ['GPT-5.5', 90.4, 18.64, 'GPT-5.5 90.4%' + SINGLE + '18.64 per 1,000 of them'],
  ['GLM 5.3', 90.9, 0.945, 'GLM 5.3 90.9% on GPQA Diamond, reported by Epoch AI (independent), 2026-08-14; $0.945 per 1,000 questions estimated from its list price. https://epoch.ai/models/glm-5-3', 'https://epoch.ai/models/glm-5-3'],
  ['Opus 5.5', 90.9, 21.23, 'Claude Opus 5.5 90.9%' + SINGLE + '21.23 per 1,000 of them'],
  ['GPT-5.6 Sol', 91.9, 10.08, 'GPT-5.6 Sol 91.9%' + SINGLE + '10.08 per 1,000 of them'],
  ['Grok 4.7', 92.7, 4.57, 'Grok 4.7 92.7% on GPQA Diamond, reported by Epoch AI (independent), 2026-09-21; $4.57 per 1,000 questions estimated from its list price. https://epoch.ai/models/grok-4-7', 'https://epoch.ai/models/grok-4-7'],
  ['Kimi K3', 93.5, 10.61, 'Kimi K3 93.5% on GPQA Diamond, reported by Moonshot AI (lab), 2026-07-16; $10.61 per 1,000 questions estimated from its list price. https://github.com/MoonshotAI/Kimi-K3', 'https://github.com/MoonshotAI/Kimi-K3'],
  ['GPT-6 Sol', 94.3, 5.09, 'GPT-6 Sol 94.3% on GPQA Diamond, reported by Epoch AI (independent), 2026-09-22; $5.09 per 1,000 questions estimated from its list price. https://epoch.ai/models/gpt-6-sol', 'https://epoch.ai/models/gpt-6-sol'],
  ['Enso Flash', 95.5, 3.26, 'Enso Flash at $3.26 per 1,000, its cost on new questions: 95.5% · questions it has seen'],
  ['Enso', 96.5, 10.03, 'Enso at $10.03 per 1,000, its cost on new questions: 96.5% · questions it has seen'],
  ['Enso Ultra', 98.0, 14.76, 'Enso Ultra at $14.76 per 1,000, its cost on new questions: 98.0% · questions it has seen'],
];
const ENSO = GPQA.filter((g) => g[0].startsWith('Enso'));
const OTHERS = GPQA.filter((g) => !g[0].startsWith('Enso'));
const LX = [Math.log10(0.8), Math.log10(60)];
const px = (c) => Math.round((70 + ((Math.log10(c) - LX[0]) / (LX[1] - LX[0])) * 900) * 100) / 100; // rounded: server and browser maths agree
const py = (s) => Math.round((540 - ((s - 75) / 25) * 500) * 100) / 100;
const money = (c) => '$' + (c < 1 ? c.toFixed(3) : c.toFixed(2));

function Gpqa() {
  const box = useRef(null);
  const seen = useInView(box, { amount: 0.35 });
  const once = useInView(box, { once: true, amount: 0.25 });
  const [sel, setSel] = useState(OTHERS.findIndex((g) => g[0] === 'Opus 5.5'));
  const [mine, setMine] = useState(false);
  const [sort, setSort] = useState('score');
  const calm = useReducedMotion();
  const paused = usePaused();
  useEffect(() => {
    if (!seen || mine || calm || paused) return;
    const t = setInterval(() => setSel((s) => (s + 1) % OTHERS.length), 2600);
    return () => clearInterval(t);
  }, [seen, mine, calm, paused]);
  const pick = (i) => { setSel(i); setMine(true); };
  const m = OTHERS[sel];
  const rows = [...GPQA].sort(sort === 'score' ? (a, b) => b[1] - a[1] : (a, b) => a[2] - b[2]);
  const frontier = ENSO.map((g) => `${px(g[2])},${py(g[1])}`).join(' ');
  return (
    <section className="eo-gpqa lv-sec" ref={box} aria-labelledby="eo-gpqa-h">
      <div className="x-wrap">
        <div className="lv-sh">
          <h2 id="eo-gpqa-h" className="lv-h">A New Pareto Frontier of Intelligence</h2>
          <p className="lv-p">GPQA Diamond challenges AI with 198 graduate-level science questions. See how Enso balances accuracy and cost across 1,000 answers.</p>
        </div>
        <div className="lv-stats eo-figs">
          {[...ENSO].reverse().map((g) => <Stat key={g[0]} value={`${g[1].toFixed(1)}%`} label={g[0]} note={`${money(g[2])} per 1,000 questions`} />)}
        </div>
        <div className="eo-plotwrap">
          <svg className="eo-plot" viewBox="0 0 1000 600" role="group" aria-label="GPQA Diamond % against $ per 1,000 questions">
            {[75, 80, 85, 90, 95, 100].map((v) => (
              <g key={v}><line x1="70" x2="970" y1={py(v)} y2={py(v)} className="eo-grid" /><text x="56" y={py(v) + 5} textAnchor="end" className="eo-tick">{v}</text></g>
            ))}
            {[1, 3, 10, 30].map((v) => <text key={v} x={px(v)} y="572" textAnchor="middle" className="eo-tick">${v}</text>)}
            <text x="70" y="22" className="eo-axis">GPQA Diamond %</text>
            <text x="520" y="598" textAnchor="middle" className="eo-axis">cheaper ← $ per 1,000 questions → dearer</text>
            <motion.polyline points={frontier} className="eo-front" initial={{ pathLength: 0 }} animate={once ? { pathLength: 1 } : {}} transition={{ duration: 1.4, ease: EASE, delay: 0.9 }} />
            {m && ENSO.map((g) => (
              <motion.line key={g[0]} className="eo-link" x1={px(m[2])} y1={py(m[1])} animate={{ x2: px(g[2]), y2: py(g[1]) }} initial={false} transition={{ duration: 0.6, ease: EASE }} x2={px(g[2])} y2={py(g[1])} />
            ))}
            {GPQA.map((g, i) => {
              const enso = g[0].startsWith('Enso');
              const k = OTHERS.indexOf(g);
              const on = k === sel;
              return (
                <g key={g[0]} transform={`translate(${px(g[2])} ${py(g[1])})`}>
                  <motion.g
                    className={'eo-dot' + (enso ? ' enso' : '') + (on ? ' on' : '')}
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={once ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.5, ease: EASE, delay: 0.2 + i * 0.045 }}
                    tabIndex={enso ? undefined : 0}
                    role={enso ? 'img' : 'button'}
                    aria-label={g[3]}
                    aria-pressed={enso ? undefined : on}
                    onClick={enso ? undefined : () => pick(k)}
                    onKeyDown={enso ? undefined : (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(k); } }}
                  >
                    <title>{g[3]}</title>
                    <circle r={enso ? 11 : on ? 9 : 6.5} />
                    <circle r="18" className="eo-hit" />
                    <text x={enso || px(g[2]) > 700 ? -16 : 12} y={enso ? 5 : 4} textAnchor={enso || px(g[2]) > 700 ? 'end' : 'start'} className="eo-lab">{`${g[0]} ${g[1].toFixed(1)}%`}</text>
                  </motion.g>
                </g>
              );
            })}
          </svg>
          <aside className="eo-read" aria-live={mine ? 'polite' : 'off'}>
            <p className="mb-mono">Compare</p>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={m[0]} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35, ease: EASE }}>
                <p className="eo-read-m"><b>{m[0]}</b><span className="mb-tnum">{`${m[1].toFixed(1)}% · ${money(m[2])}`}</span></p>
                <p className="eo-read-s">{m[3].replace(/ https:\S+$/, '')}</p>
                {m[4] && <A to={m[4]} className="eo-src">Source</A>}
              </motion.div>
            </AnimatePresence>
            <ul className="eo-vs">
              {ENSO.map((g) => (
                <li key={g[0]}>
                  <b>{g[0]}</b>
                  <span className="mb-tnum">{`${g[1].toFixed(1)}% · ${money(g[2])}`}</span>
                  <em data-yes={g[2] < m[2] ? '' : undefined}>{g[2] < m[2] ? 'cheaper' : 'dearer'}</em>
                </li>
              ))}
            </ul>
          </aside>
        </div>
        <div className="eo-table">
          <div className="eo-sort" role="group" aria-label="Sort">
            <button type="button" className="eo-sortb" aria-pressed={sort === 'score'} onClick={() => setSort('score')}>By score</button>
            <button type="button" className="eo-sortb" aria-pressed={sort === 'cost'} onClick={() => setSort('cost')}>By cost</button>
          </div>
          <DataTable
            caption="GPQA Diamond"
            cols={[{ key: 'm', label: 'Model' }, { key: 's', label: 'GPQA Diamond %', num: true }, { key: 'c', label: '$ per 1,000 questions', num: true }]}
            rows={rows.map((g) => {
              const enso = g[0].startsWith('Enso');
              return {
                m: <>{enso ? <b>{g[0]}</b> : g[0]} {g[4] && <A to={g[4]} className="eo-src" aria-label={g[0] + ' source'}>↗</A>}</>,
                s: enso ? <b>{`${g[1].toFixed(1)}%`}</b> : `${g[1].toFixed(1)}%`,
                c: enso ? <b>{money(g[2])}</b> : money(g[2]),
              };
            })}
          />
        </div>
      </div>
    </section>
  );
}

const RING = ring((W, H, wide) => (wide ? { x: W * 0.71, y: H * 0.5, r: Math.min(H * 0.39, W * 0.24) } : { x: W / 2, y: H * 0.25, r: Math.min(W * 0.34, H * 0.17) }));
const TIER_TASKS = TIERS.map((_, i) => TASKS.filter(([, k]) => k === i).map(([w]) => w));

// a chapter's picture: Enso's own film, framed a little closer each tier, with that tier's card laid on it
function TierArt({ i, on }) {
  const tr = TIERS[i];
  return (
    <div className="eo-art" style={{ '--z': 1.12 + i * 0.22, '--x': ['-4%', '6%', '-2%'][i], '--y': ['3%', '-5%', '2%'][i], ...[{}, { '--cl': 'auto', '--cr': '32px', '--ct': '32px', '--cb': 'auto' }, { '--cl': 'auto', '--cr': '32px' }][i] }}>
      <Img src={film('enso', 'webp')} w={1200} h={1500} />
      <ModelFilm slug="enso" play={on} />
      <div className="eo-tcard" aria-hidden="true">
        <p className="eo-tcard-top"><b>{tr.name}</b><code>{tr.code}</code></p>
        <p className="eo-tcard-ax">{AXES[tr.axis]}</p>
        <ul>{TIER_TASKS[i].map((w) => <li key={w}>{w}</li>)}</ul>
        <p className="eo-tcard-p mb-tnum"><b>{tr.inp}</b> in <b>{tr.out}</b> out</p>
      </div>
    </div>
  );
}

const CHAPTERS = TIERS.map((tr, i) => ({
  k: tr.name,
  title: tr.name,
  art: (on) => <TierArt i={i} on={on} />,
  body: (
    <>
      <p className="eo-ch-price mb-tnum"><b>{tr.inp}</b> <span>in · per 1M tokens</span> <b>{tr.out}</b> <span>out</span></p>
      <p>{tr.desc}</p>
      <p className="eo-meta">{tr.ctx && <span><b>1M</b> context</span>}<span>OpenAI-compatible API</span><span>Anthropic-compatible API</span></p>
      <p className="eo-acts">
        <A to="/login" className="eo-l">Try Hanzo</A>
        <A to={tr.wb} className="eo-l">Open in Workbench</A>
        <A to="https://github.com/hanzoai/enso" className="eo-l">Docs on GitHub</A>
      </p>
    </>
  ),
}));

// the three tiers side by side, every cell in Hanzo's own words and figures
function Spec() {
  const head = (tr) => <>{tr.name} <code>{tr.code}</code></>;
  return (
    <section className="lv-sec eo-spec" aria-labelledby="eo-spec-h">
      <div className="x-wrap">
        <div className="lv-sh">
          <h2 id="eo-spec-h" className="lv-h">One endpoint for every frontier model.</h2>
          <p className="lv-p">Enso routes each request for quality, speed and cost.</p>
        </div>
        <DataTable
          caption="All Enso models"
          cols={[{ key: 'k', label: 'Enso' }, ...TIERS.map((tr) => ({ key: tr.code, label: head(tr), num: true }))]}
          rows={[
            { k: 'in · per 1M tokens', ...Object.fromEntries(TIERS.map((tr) => [tr.code, tr.inp])) },
            { k: 'out', ...Object.fromEntries(TIERS.map((tr) => [tr.code, tr.out])) },
            { k: 'context', ...Object.fromEntries(TIERS.map((tr) => [tr.code, tr.ctx ? '1M' : ''])) },
          ]}
        />
      </div>
    </section>
  );
}

export default function Enso() {
  return (
    <Launch
      slug="enso"
      ask={{ label: 'Try Hanzo', to: '/login', id: 'enso.first' }}
      shape={RING}
      headClass="eo-head"
      head={
        <>
          <Lines id="eo-h" lines={['The right intelligence.', 'Every time.']} />
          <p className="lv-lede">One endpoint for every frontier model. Enso routes each request for quality, speed and cost.</p>
          <div className="lv-acts">
            <Cta to="/login" id="enso.hero" thumb>Try Hanzo</Cta>
            <Cta to="https://platform.hanzo.ai" kind="quiet" id="enso.hero-platform">API Platform</Cta>
            <More to="https://github.com/hanzoai/enso">Docs on GitHub</More>
          </div>
          <p className="lv-crumb">Hanzo / Enso</p>
        </>
      }
    >
      <Chapters id="eo-tiers" label="Enso" items={CHAPTERS} />
      <section className="lv-room lv-sec eo-live" data-room="dark" aria-label="Enso">
        <div className="x-wrap">
          <Switchboard />
          <p className="eo-all"><More to="/models/enso">All Enso models</More></p>
        </div>
      </section>
      <Gpqa />
      <Spec />
      <ModelCards slug="enso" />
      <Band title="The right intelligence. Every time." action="Try Hanzo" to="/login" />
    </Launch>
  );
}
