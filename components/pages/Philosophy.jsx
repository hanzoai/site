'use client';
/* Philosophy: the Zen of Hanzo. Its idea is change itself, drawn in lines. The hero is one hexagram that never holds
   still: its lines flip, one at a time, walking all sixty-four in King Wen order. Signature moment: as you read the
   five laws, a hexagram builds itself beside them, line by line, and its last line keeps changing; then the 64
   patterns, every one active — as a sequence, as the 8 x 8 matrix of trigrams, or by lens — each opening to its
   principle, its practice and its question. It closes in the dark: from one line to sixty-four conditions.
   Every word is Hanzo's. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'motion/react';
import { EASE, Rise } from '../ui';
import { A, Go, SecHead } from '../kit';
import { GROUPS, HEX, LENSES } from './philosophyData';
import './Philosophy.css';

const TRI = { Heaven: [1, 1, 1], Lake: [1, 1, 0], Fire: [1, 0, 1], Thunder: [1, 0, 0], Wind: [0, 1, 1], Water: [0, 1, 0], Mountain: [0, 0, 1], Earth: [0, 0, 0] };
const TRI_ORDER = Object.keys(TRI);
const lines = (h) => [...TRI[h[3]], ...TRI[h[2]]]; // bottom to top: the lower trigram, then the upper
const split = (t) => { const [a, b] = t.split(' — '); return [a, b]; };

/* Six lines, bottom to top. A yang line is whole; a yin line opens in the middle. Transform only. */
function Hexa({ ls, size = 80, drawn = 6, className = '', spring }) {
  const tr = spring || { type: 'spring', stiffness: 260, damping: 24 };
  return (
    <svg className={'xph-hex ' + className} viewBox={`0 0 100 ${ls.length * 16 - 6}`} width={size} height={(size * (ls.length * 16 - 6)) / 100} aria-hidden="true">
      {ls.map((y, i) => {
        const top = (ls.length - 1 - i) * 16; // line 1 at the bottom
        const on = i < drawn;
        return (
          <g key={i} className="xph-l" style={{ opacity: on ? 1 : 0.12 }}>
            <motion.rect x="0" y={top} width="51" height="10" rx="2" style={{ originX: 0 }} initial={false} animate={{ scaleX: y ? 1 : 0.84 }} transition={{ ...tr, delay: i * 0.04 }} />
            <motion.rect x="49" y={top} width="51" height="10" rx="2" style={{ originX: 1 }} initial={false} animate={{ scaleX: y ? 1 : 0.84 }} transition={{ ...tr, delay: i * 0.04 }} />
          </g>
        );
      })}
    </svg>
  );
}

/* ---------- hero: one hexagram walking all sixty-four ---------- */
function Hero() {
  const [i, setI] = useState(0);
  const calm = useReducedMotion();
  const ref = useRef(null);
  const live = useInView(ref, { amount: 0.3 });
  useEffect(() => {
    if (calm || !live) return;
    const t = setTimeout(() => setI((v) => (v + 1) % 64), 1700);
    return () => clearTimeout(t);
  }, [i, calm, live]);
  const h = HEX[i];
  const line = (t, d) => <span className="x-line"><motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: d }}>{t}</motion.span></span>;
  return (
    <section className="xph-hero" ref={ref} aria-labelledby="xph-h1">
      <div className="x-wrap xph-hero-g">
        <div>
          <motion.p className="x-kick" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }}>Philosophy</motion.p>
          <h1 id="xph-h1" className="xph-h1">{line('The Zen', 0.05)}{line('of Hanzo', 0.15)}</h1>
          <motion.p className="xph-sub" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.3 }}>64 patterns for intelligent systems</motion.p>
          <motion.p className="xph-lede" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.42 }}>The <em>I Ching</em> is a map of change. Its 64 hexagrams describe recurring conditions: creation, resistance, conflict, growth, decay, transformation, completion and renewal.</motion.p>
          <motion.div className="xph-acts" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.55 }}>
            <motion.span className="x-go" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}><a href="#patterns" className="x-btn solid">Explore the 64 patterns</a></motion.span>
            <Go to="https://cloud.hanzo.ai">Build with Hanzo</Go>
          </motion.div>
        </div>
        <motion.div className="xph-oracle" initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.3, ease: EASE, delay: 0.2 }}>
          <Hexa ls={lines(h)} size={340} spring={{ type: 'spring', stiffness: 120, damping: 18 }} />
          <div className="xph-oracle-c" aria-live="polite">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.p key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.45, ease: EASE }}>
                <span className="x-mono">{h[0]} / 64</span><b>{split(h[1])[0]}</b><span>{split(h[1])[1]} · {h[2]} over {h[3]}</span>
              </motion.p>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Premise() {
  return (
    <section className="x-sec xph-premise">
      <div className="x-wrap xph-premise-g">
        <div>
          <p className="x-kick">The premise</p>
          <Rise as="h2" className="xph-h2">Intelligence is always changing</Rise>
        </div>
        <div className="xph-premise-t">
          <Rise as="p" className="xph-big">No intelligent system remains fixed.</Rise>
          <Rise as="p" delay={0.06}>Models learn. Data changes. Infrastructure fails. Organizations grow. Interfaces become dependencies. Successful architectures eventually meet conditions they were never designed to handle.</Rise>
          <Rise as="p" delay={0.1}>The goal is not to prevent change. The goal is to build systems capable of changing without losing their integrity.</Rise>
          <Rise as="p" delay={0.14} className="xph-that">That is the Zen of Hanzo.</Rise>
        </div>
      </div>
    </section>
  );
}

/* ---------- the five laws, a hexagram building itself beside them ---------- */
const LAWS = [
  ['See the system clearly', 'Understand the current condition before prescribing action.'],
  ['Separate what changes independently', 'Do not bind together concepts that evolve for different reasons.'],
  ['Compose capability from complete primitives', 'Small components should combine without central coordination or hidden behavior.'],
  ["Preserve the user's authority", 'The user should control their models, data, keys, infrastructure and economic participation.'],
  ['Design for the next transformation', 'Every completed system is already approaching its next condition.'],
];
const BUILD = lines(HEX[63]); // Before Completion: the hexagram that is never finished

function Laws() {
  const [at, setAt] = useState(-1);
  const [flick, setFlick] = useState(BUILD[5]);
  const box = useRef(null);
  const calm = useReducedMotion();
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setAt(+e.target.dataset.i)), { rootMargin: '-45% 0px -50% 0px' });
    box.current.querySelectorAll('[data-i]').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (at < 4 || calm) return;
    const t = setInterval(() => setFlick((v) => 1 - v), 900);
    return () => clearInterval(t);
  }, [at, calm]);
  const ls = [...BUILD.slice(0, 5), at >= 4 ? flick : BUILD[5]];
  return (
    <section className="x-sec xph-laws" aria-labelledby="xph-laws-h">
      <div className="x-wrap xph-laws-g" ref={box}>
        <div className="xph-laws-side">
          <p className="x-kick">The synthesis</p>
          <h2 id="xph-laws-h" className="xph-h2">Five operating laws</h2>
          <div className="xph-build"><Hexa ls={ls} size={220} drawn={Math.max(0, at + 1) + (at >= 4 ? 1 : 0)} /></div>
        </div>
        <ol className="xph-law-l">
          {LAWS.map(([t, d], i) => (
            <li key={t} data-i={i} className={at === i ? 'on' : at > i ? 'past' : ''}>
              <span className="xph-law-n x-mono">{String(i + 1).padStart(2, '0')}</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------- the 64 patterns ---------- */
function Detail({ h, i }) {
  const [main, sub] = split(h[1]);
  return (
    <div className="xph-det">
      <div className="xph-det-h">
        <Hexa ls={lines(h)} size={64} />
        <div><span className="x-mono">{h[0]}</span><b>{main}</b><span>{sub}</span><small>{h[2]} <i>over</i> {h[3]}</small></div>
      </div>
      <dl>
        <div><dt>Principle</dt><dd className="xph-pr">{h[4]}</dd></div>
        <div><dt>In practice</dt><dd>{h[5]}</dd></div>
        <div><dt>Ask</dt><dd className="xph-ask">{h[6]}</dd></div>
        {h[8] && <div><dt>Lenses</dt><dd><span className="xph-chip" title={LENSES[h[8]]}>{h[8]}</span></dd></div>}
      </dl>
    </div>
  );
}

function Tile({ h, i, on, pick }) {
  const [main, sub] = split(h[1]);
  return (
    <button type="button" className={'xph-tile' + (on ? ' on' : '')} onClick={() => pick(i)} aria-expanded={on} aria-controls={'xph-d-' + i} aria-label={`${h[0]} ${h[1]}, ${h[2]} over ${h[3]}`}>
      <Hexa ls={lines(h)} size={46} />
      <span className="xph-tile-n x-mono">{h[0]}</span>
      <span className="xph-tile-t">{main}</span>
      <span className="xph-tile-s">{sub}</span>
    </button>
  );
}

function Sequence({ sel, pick }) {
  return (
    <div className="xph-seq">
      {GROUPS.map(([num, name], g) => {
        const hs = HEX.map((h, i) => [h, i]).filter(([h]) => h[7] === g);
        const open = sel !== null && HEX[sel][7] === g;
        return (
          <section key={num} className="xph-grp" aria-labelledby={'xph-g-' + num}>
            <div className="xph-grp-h"><span className="x-mono">{num}</span><h3 id={'xph-g-' + num}>{name}</h3><span className="x-mono">{hs[0][0][0]} – {hs[7][0][0]}</span></div>
            <div className="xph-tiles">{hs.map(([h, i]) => <Tile key={i} h={h} i={i} on={sel === i} pick={pick} />)}</div>
            {/* every hexagram's principle, practice and question is in the page; the chosen one opens */}
            <motion.div className="xph-drawer" initial={false} animate={open ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }} transition={{ duration: 0.5, ease: EASE }} aria-hidden={!open} inert={!open}>
              {hs.map(([h, i]) => <div key={i} id={'xph-d-' + i} hidden={sel !== i}><Detail h={h} i={i} /></div>)}
            </motion.div>
          </section>
        );
      })}
    </div>
  );
}

function Matrix({ sel, pick }) {
  const [hi, setHi] = useState(null); // a highlighted row (upper) or column (lower): ['u', name] | ['l', name]
  const cur = HEX[sel ?? 0];
  const lit = (up, lo) => hi && ((hi[0] === 'u' && hi[1] === up) || (hi[0] === 'l' && hi[1] === lo));
  const tog = (k) => setHi((h) => (h && h[0] === k[0] && h[1] === k[1] ? null : k));
  return (
    <div className="xph-mx">
      <div>
        <p className="xph-p xph-mx-p">Each hexagram stacks two trigrams — the lower force (bottom three lines) beneath the upper force (top three lines). Select a row or column to see how one force meets every other.</p>
        <div className={'xph-mx-g' + (hi ? ' hi' : '')}>
          <div className="xph-mx-c xph-mx-k"><span>U/L</span></div>
          {TRI_ORDER.map((t) => <button key={t} type="button" className={'xph-mx-c xph-mx-k xph-mx-h' + (hi && hi[0] === 'l' && hi[1] === t ? ' on' : '')} onClick={() => tog(['l', t])} aria-pressed={!!(hi && hi[0] === 'l' && hi[1] === t)} title={'Lower: ' + t}><Hexa ls={TRI[t]} size={22} /><span>{t}</span></button>)}
          {TRI_ORDER.map((up) => (
            <div key={up} className="xph-mx-row">
              <button type="button" className={'xph-mx-c xph-mx-k xph-mx-h' + (hi && hi[0] === 'u' && hi[1] === up ? ' on' : '')} onClick={() => tog(['u', up])} aria-pressed={!!(hi && hi[0] === 'u' && hi[1] === up)} title={'Upper: ' + up}><Hexa ls={TRI[up]} size={22} /><span>{up}</span></button>
              {TRI_ORDER.map((lo) => {
                const i = HEX.findIndex((h) => h[2] === up && h[3] === lo);
                return (
                  <button key={lo} type="button" className={'xph-mx-c xph-mx-b' + (sel === i ? ' on' : '') + (lit(up, lo) ? ' lit' : '')} onClick={() => pick(i)} aria-label={`${HEX[i][0]} ${HEX[i][1]}: ${up} over ${lo}`}>
                    <Hexa ls={lines(HEX[i])} size={34} /><span className="x-mono">{HEX[i][0]}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
        <p className="xph-mx-leg"><b>The eight trigrams</b>{TRI_ORDER.map((t) => <span key={t}><Hexa ls={TRI[t]} size={16} />{t}</span>)}</p>
      </div>
      <div className="xph-mx-side"><Detail h={cur} i={sel ?? 0} /></div>
    </div>
  );
}

function Lenses() {
  const [lens, setLens] = useState(null);
  const names = Object.keys(LENSES);
  const hs = HEX.map((h, i) => [h, i]).filter(([h]) => (lens ? h[8] === lens : h[8]));
  return (
    <div className="xph-lenses">
      <div className="xph-lens-chips">
        <button type="button" aria-pressed={lens === null} onClick={() => setLens(null)}>All lensed patterns</button>
        {names.map((n) => <button key={n} type="button" aria-pressed={lens === n} onClick={() => setLens(n)}>{n} <span>{HEX.filter((h) => h[8] === n).length}</span></button>)}
      </div>
      <p className="xph-p xph-lens-p">{lens ? <><b>{lens}.</b> {LENSES[lens]}</> : 'Four modern minds read the same sixty-four patterns. Select one to see the conditions it illuminates.'}</p>
      <div className="xph-lens-l">{hs.map(([h, i]) => <Detail key={i} h={h} i={i} />)}</div>
    </div>
  );
}

const VIEWS = ['Sequence', 'Matrix', 'Lenses'];
const HINTS = ['All sixty-four, in the traditional King Wen order.', 'The eight forces above and below — every pairing is one condition.', 'The same patterns, read through four modern minds.'];
function Patterns() {
  const [view, setView] = useState('Sequence');
  const [sel, setSel] = useState(null);
  const pick = (i) => setSel((s) => (view === 'Sequence' && s === i ? null : i));
  return (
    <section className="x-sec xph-pat" id="patterns">
      <div className="x-wrap">
        <div className="xph-pat-h">
          <SecHead kicker="The 64 patterns" title="Every hexagram is active" lede="Each represents a condition that can appear in a model, an application, a company, a network or an entire technological ecosystem. The classical title names the condition. The Hanzo principle defines how we respond." />
          <div className="xph-views" role="tablist" aria-label="View">
            {VIEWS.map((v) => (
              <button key={v} type="button" role="tab" id={'tab-' + v.toLowerCase()} aria-selected={view === v} aria-controls={'panel-' + v.toLowerCase()} onClick={() => setView(v)}>
                {view === v && <motion.span layoutId="xph-view" className="xph-view-bg" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
                <span>{v}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="xph-hints">{VIEWS.map((v, i) => <p key={v} className="xph-cap" hidden={view !== v}>{HINTS[i]}</p>)}</div>
        {/* all three views are in the page; the chosen one is shown */}
        <div id="panel-sequence" role="tabpanel" aria-labelledby="tab-sequence" hidden={view !== 'Sequence'}><Sequence sel={sel} pick={pick} /></div>
        <div id="panel-matrix" role="tabpanel" aria-labelledby="tab-matrix" hidden={view !== 'Matrix'}><Matrix sel={sel} pick={pick} /></div>
        <div id="panel-lenses" role="tabpanel" aria-labelledby="tab-lenses" hidden={view !== 'Lenses'}><Lenses /></div>
      </div>
    </section>
  );
}

/* ---------- the method: a cycle ---------- */
const METHOD = [['Observe', 'Identify the actual condition of the system.'], ['Separate', 'Untangle concerns that change for different reasons.'], ['Reduce', 'Find the smallest complete set of concepts.'], ['Compose', 'Combine orthogonal primitives into greater capability.'], ['Verify', 'Measure behavior instead of trusting intention.'], ['Adapt', 'Respond to evidence without abandoning the foundation.'], ['Distribute', 'Place data, computation and authority where they belong.'], ['Continue', 'Treat every completion as the beginning of another cycle.']];

function Method() {
  const [at, setAt] = useState(0);
  const [mine, setMine] = useState(false);
  const calm = useReducedMotion();
  const ref = useRef(null);
  const live = useInView(ref, { amount: 0.4 });
  useEffect(() => {
    if (mine || calm || !live) return;
    const t = setTimeout(() => setAt((v) => (v + 1) % 8), 2000);
    return () => clearTimeout(t);
  }, [at, mine, calm, live]);
  return (
    <section className="x-sec xph-method" ref={ref}>
      <div className="x-wrap xph-method-g">
        <div className="xph-ring" aria-hidden="true">
          <svg viewBox="0 0 200 200"><circle cx="100" cy="100" r="86" className="xph-ring-c" /><motion.circle cx="100" cy="100" r="86" className="xph-ring-p" initial={false} animate={{ pathLength: (at + 1) / 8 }} transition={{ type: 'spring', stiffness: 80, damping: 18 }} /></svg>
          {METHOD.map(([t], i) => {
            const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
            return <span key={t} className={'xph-node' + (i === at ? ' on' : i < at ? ' past' : '')} style={{ left: 50 + Math.cos(a) * 43 + '%', top: 50 + Math.sin(a) * 43 + '%' }}>{String(i + 1).padStart(2, '0')}</span>;
          })}
          <div className="xph-ring-c2">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.b key={at} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4, ease: EASE }}>{METHOD[at][0]}</motion.b>
            </AnimatePresence>
          </div>
        </div>
        <div>
          <SecHead kicker="The method" title="How we build" />
          <ol className="xph-steps">
            {METHOD.map(([t, d], i) => (
              <li key={t} className={i === at ? 'on' : ''}>
                <button type="button" onClick={() => { setMine(true); setAt(i); }}>
                  <span className="x-mono">{String(i + 1).padStart(2, '0')}</span>
                  <h3>{t}</h3>
                  <p>{d}</p>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

const STACK = [
  ['Hanzo Models', 'Open and adaptable intelligence across language, vision, audio, code, tools and physical systems.', '/models'],
  ['Hanzo Platform', 'One control plane, assembled from services you can take apart.', '/platform'],
  ['Hanzo Engine', 'Efficient execution built around measurable performance, hardware awareness and composable runtimes.', '/engine'],
  ['Hanzo Router', 'Model choice treated as a changing systems problem—balancing capability, latency, cost, privacy and availability.', '/gateway'],
  ['Hanzo Network', 'Distributed intelligence designed to reduce centralized dependence and share value with those who contribute compute, models, code and knowledge.', '/network'],
  ['Hanzo Open Source', 'Infrastructure that can be inspected, operated, modified and carried forward by the people who depend upon it.', '/open-source'],
];

function Stack() {
  return (
    <section className="x-sec xph-stack">
      <div className="x-wrap">
        <SecHead kicker="Across the stack" title="One philosophy" />
        <ul className="xph-stack-l">
          {STACK.map(([t, d, to], i) => (
            <Rise as="li" key={t} delay={(i % 3) * 0.06} y={18}>
              <A to={to}>
                <Hexa ls={lines(HEX[[0, 1, 13, 62, 7, 12][i]])} size={36} />
                <b>{t}</b>
                <span>{d}</span>
                <i aria-hidden="true">→</i>
              </A>
            </Rise>
          ))}
        </ul>
      </div>
    </section>
  );
}

const QUESTIONS = ['Is it understandable?', 'Is it composable?', 'Is it verifiable?', 'Can it operate privately?', 'Can the user leave?', 'Can it survive failure?', 'Can it evolve without being destroyed?', 'Does it increase human agency?'];

function Change() {
  return (
    <section className="x-sec xph-change">
      <div className="x-wrap xph-change-g">
        <div>
          <SecHead title="Build systems that can change" lede="The purpose of a philosophy is not to decorate a company. It is to make difficult decisions clearer." />
          <Rise as="p" className="xph-p">When we design a model, an API, an agent, a database or a network, we return to the same questions:</Rise>
        </div>
        <ol className="xph-qs">{QUESTIONS.map((q, i) => <Rise as="li" key={q} delay={i * 0.04} y={14}><span className="x-mono">{String(i + 1).padStart(2, '0')}</span>{q}</Rise>)}</ol>
      </div>
      <div className="x-wrap"><Rise as="p" className="xph-whole">The Zen of Hanzo is not a promise that systems will remain still. It is a method for building systems that remain whole while everything changes.</Rise></div>
    </section>
  );
}

/* the close: from one line to sixty-four conditions */
function Close() {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.35 });
  const stanza = ['From one line, two forces.', 'From two forces, eight patterns.', 'From eight patterns, sixty-four conditions.', 'From small primitives, unbounded intelligence.'];
  return (
    <section className="x-sec xph-close" data-room="dark" ref={ref}>
      <div className="x-wrap">
        <div className="xph-grow" aria-hidden="true">
          <div className="xph-g1"><motion.i initial={{ scaleX: 0 }} animate={seen ? { scaleX: 1 } : {}} transition={{ duration: 0.9, ease: EASE }} /></div>
          <div className="xph-g2"><Hexa ls={[1]} size={60} /><Hexa ls={[0]} size={60} /></div>
          <div className="xph-g8">{TRI_ORDER.map((t, i) => <motion.span key={t} initial={{ opacity: 0, y: 8 }} animate={seen ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.6 + i * 0.05, duration: 0.5, ease: EASE }}><Hexa ls={TRI[t]} size={28} /></motion.span>)}</div>
          <div className="xph-g64">{HEX.map((h, i) => <motion.span key={i} initial={{ opacity: 0 }} animate={seen ? { opacity: 1 } : {}} transition={{ delay: 1.1 + i * 0.012, duration: 0.3 }}><Hexa ls={lines(h)} size={20} /></motion.span>)}</div>
        </div>
        <div className="xph-stanza">{stanza.map((s, i) => <Rise as="p" key={s} delay={0.2 + i * 0.12}>{s}</Rise>)}</div>
        <div className="xph-close-acts">
          <Go to="/" solid>Explore Hanzo</Go>
          <Go to="https://papers.hanzo.ai">Read the research</Go>
          <Go to="https://github.com/hanzoai">View the source</Go>
        </div>
      </div>
    </section>
  );
}

export default function Philosophy() {
  return (
    <main className="xph">
      <Hero />
      <Premise />
      <Laws />
      <Patterns />
      <Method />
      <Stack />
      <Change />
      <Close />
    </main>
  );
}
