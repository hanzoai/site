'use client';
/* /investors. Story page (MASTER 4.4), Hanzo's deck only.
   V2: 7/10 critic round 2 (7 Nov): the commit stats render on one line again (a selector had caught the rolling digits), bars keep their true lengths on phones and under reduced motion, 44px counter steps, links press. Before that: the hero arrives after the curtain and reads with JS off; the thesis and the results are
   pinned scenes where one thing replaces the last (the outgoing title clears first) and each figure rolls in with a
   true object beside it (16 of 16 tasks lit, 152 of 159 dots, LiveCodeBench and Kai bars on a zero baseline, Dev's
   interval, 200x against 400x at twice the length); the stack's slabs layer as you scroll with Hanzo's 03 / 02 / 01 as
   their numerals; the commit stats roll in one at a time; the close carries one solid, ir@hanzo.ai.
   Persona: an investor (or press) doing diligence (MASTER 1, "investors and press").
   Goal: reach investor relations. CTA: "Contact investor relations" (mailto:ir@hanzo.ai). Metric: one contact click
   (cta_click investors.hero / investors.close).
   Signature: the figure counter. Every measured figure rolls in digit by digit, one at a time, each named in Hanzo's
   own words and linked to the run it comes from; press any step to hold it, Pause or Replay it.
   Supporting (3): line-mask headlines; the pinned scenes (thesis and results) where figures roll in; the stack's
   slabs layering as you scroll.
   Beyond: "Read the source": the seven figures as one list you tick off as you open each source, a giant tabular
   counter filling as you go, kept in this browser.
   Deletes: the indigo accent, the eyebrows, the endless counter loop and marquee, native checkboxes, the drawn (not
   measured) Pareto scatter, invented labels, visible initials, the forked UiBtn buttons (now the kit's Cta).
   Every word, figure and link is Hanzo's. */
import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react';
import { A, Img, Cta } from '../kit';
import Sigil from '../Sigil';
import MaskLines from './company/MaskLines';
import useArrived from './company/useArrived';
import { H } from './investorsEco';
import '../v2/vc-type.css';
import './company/deck.css';
import usePhoneAsk from './usePhoneAsk';
import './Investors.css';

const EASE = [0.16, 1, 0.3, 1];
// JS off: the hero's lede, asks and counter show, and every pinned scene stacks readable (PLAN 2.3, 2.17)
const NOJS = { __html: '<style>.xin-roll-f[aria-hidden=true]{display:none!important}.xin-hero-l,.xin-hero-o,.xin-stats li{opacity:1!important;transform:none!important}.xin-pin{height:auto!important}.xin-pin-st{position:static!important;height:auto!important}.xin-pin-g{display:block!important}.xin-pin-s{display:grid!important;padding:48px 0}.xin-pin-s *{opacity:1!important;transform:none!important}</style>' };
// H: Hanzo's commit record as /investors shows it live (investorsEco.js)
const LAST_DAY = Math.max(...[...H.heat].map((c, i) => (c === '.' ? -1 : i))); // the newest day in the heatmap (Nov 7)
const Arrow = () => <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;

// the seven measured figures: Hanzo's own name for each, its subject, the figure and the page that carries its runs
const [LEAD] = H.stats;
const TICK = [['Research.DecisionSuite', 'Kai', '16 of 16', '/benchmarks#decision-suite'], ['Research.LiveCodeBench', 'Enso', '93.7%', '/enso'], ['GPQA Diamond', 'Enso Ultra', '95.6%', '/enso'], ['One decision, served', 'Kai', '0.8 ms', '/kai'], ['Faster on the same coding tasks', 'Hanzo Dev', '3.02×', '/dev'], ['Prompt tokens a second', 'Zen 6', '~3,665', '/zen#desks'], [LEAD[0], LEAD[2], LEAD[1], H.readTo]];
const Up = () => <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M5 11l6-6M6 5h5v5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const BACKERS = [['techstars', 'Techstars', 'https://www.techstars.com'], ['amazon', 'Amazon', 'https://aws.amazon.com'], ['digitalocean', 'DigitalOcean', 'https://www.digitalocean.com'], ['google', 'Google', 'https://cloud.google.com'], ['microsoft', 'Microsoft', 'https://azure.microsoft.com'], ['nvidia', 'NVIDIA', 'https://www.nvidia.com'], ['nebius', 'Nebius', 'https://nebius.com']];

/* A logo (the kit's Img: reserved box, lazy) that falls back to its name, set in type, when the file can't be fetched. */
function Logo({ src, name }) {
  const ref = useRef(null);
  const [bad, setBad] = useState(false);
  useEffect(() => { const i = ref.current; if (i && i.complete && !i.naturalWidth) setBad(true); }, []);
  return bad
    ? <span className="xin-logo-n">{name}</span>
    : <Img ref={ref} src={src} alt={name + ' logo'} w={140} h={34} onError={() => setBad(true)} />;
}

/* ---------- the signature: the figure counter ----------
   It rolls once through the seven figures and rests on the first; Pause holds it, Replay runs it again (WCAG 2.2.2). */
function Roll({ still = false }) {
  const box = useRef(null);
  const seen = useInView(box, { amount: 0.4 });
  const calm0 = useReducedMotion();
  const [ready, setReady] = useState(false); // the server and the first client paint agree (Pause); the preference applies after mount
  useEffect(() => setReady(true), []);
  const calm = ready && calm0;
  const [at, setAt] = useState(0);
  const [run, setRun] = useState(true); // false once you hold it, pause it or it has gone round once
  const n = TICK.length;
  useEffect(() => {
    if (still || !run || calm || !seen) return;
    const t = setTimeout(() => { if (at === n - 1) { setAt(0); setRun(false); } else setAt(at + 1); }, 3400);
    return () => clearTimeout(t);
  }, [at, run, calm, seen, n]);
  const [label, who, , to] = TICK[at];
  const live = run && !calm;
  return (
    <div className="xin-roll" ref={box}>
      <div className="xin-roll-h">
        <span className="vc-kick xin-roll-k" aria-live="polite"><span>{label}</span> <span className="xin-roll-w">{who}</span></span>
        <button type="button" className="xin-roll-p" aria-label={live ? 'Pause' : 'Replay'} onClick={() => { if (live) setRun(false); else { setAt(0); setRun(true); } }}>
          {live
            ? <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M5 3.5v9M11 3.5v9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
            : <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true"><path d="M4.5 10a5.5 5.5 0 1 0 1.7-4M4.5 3.5V6.5h3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>}
        </button>
      </div>
      <div className="xin-roll-stage">
        {TICK.map(([k, , v], i) => (
          <span key={k} className="xin-roll-f vc-num" aria-hidden={i !== at}>
            {[...v].map((c, j) => (
              <span key={j} className="xin-roll-m">
                <motion.span initial={false} className="xin-roll-c"
                  animate={i === at ? { y: '0%', opacity: 1 } : { y: i < at ? '-105%' : '105%', opacity: 0 }}
                  transition={{ duration: i === at ? 0.8 : 0.45, ease: EASE, delay: i === at ? 0.12 + j * 0.035 : j * 0.02 }}>
                  {c === ' ' ? '\u00a0' : c}
                </motion.span>
              </span>
            ))}
          </span>
        ))}
      </div>
      <div className="xin-roll-f2">
        <ol className="xin-roll-n" aria-label="Measured figures">
          {TICK.map(([k, w, v], i) => (
            <li key={k}>
              <button type="button" aria-label={`${v} ${k} ${w}`} aria-pressed={i === at} onClick={() => { setRun(false); setAt(i); }}>
                <i>{i === at && <u key={at + (live ? 'r' : 'm')} className={live ? 'run' : 'done'} />}</i>
              </button>
            </li>
          ))}
        </ol>
        <A to={to} className="xin-roll-go" aria-label="Read the source"><Up /></A>
      </div>
    </div>
  );
}

function Hero() {
  const ok = useArrived();
  return (
    <section className="xin-hero" aria-label="Hanzo Investor Relations" data-ask-name="Hanzo Investor Relations">
      <noscript dangerouslySetInnerHTML={NOJS} />
      <div className="vc-grid xin-hero-g">
        <div className="xin-hero-t">
          {/* Hanzo's own kicker, kept word for word but visually hidden: nothing sits above the h1 */}
          <p className="x-sr">Hanzo Investor Relations</p>
          <MaskLines as="h1" id="xin-h1" now delay={0.05} lines={['The intelligence', 'layer for business.']} className="vc-display xin-h1" />
        </div>
        <motion.div className="xin-hero-l" initial={{ opacity: 0, y: 12 }} animate={ok ? { opacity: 1, y: 0 } : undefined} transition={{ duration: 0.52, ease: EASE, delay: 0.45 }}>
          <p className="vc-lede">Models, agents and the cloud beneath them — one account, one key, one bill.</p>
          <div className="xin-acts">
            <Cta to="mailto:ir@hanzo.ai" target="_self" className="xin-big" id="investors.hero" thumb>Contact investor relations</Cta>
            <Cta to="/investors#research" kind="quiet" className="xin-big" id="investors.research">See the research</Cta>
          </div>
        </motion.div>
        <motion.div className="xin-hero-o" initial={{ opacity: 0, y: 40 }} animate={ok ? { opacity: 1, y: 0 } : undefined} transition={{ duration: 0.8, ease: EASE, delay: 0.3 }}>
          <Roll still={!ok} />
        </motion.div>
      </div>
      <div className="vc-grid xin-backed">
        <p className="vc-kick">Backed by</p>
        <ul>{BACKERS.map(([f, n, to]) => <li key={f}><A to={to} aria-label={n}><Logo src={`/logos/partners/${f}.svg`} name={n} /></A></li>)}</ul>
      </div>
    </section>
  );
}

/* A figure that rolls in digit by digit when its scene is on (the counter's own roll). */
function RollFig({ v, on, className = '' }) {
  return (
    <span className={'xin-rf vc-num ' + className}>
      {[...v].map((c, j) => (
        <span key={j} className="xin-roll-m">
          <motion.span className="xin-roll-c" initial={false} animate={on ? { y: '0%' } : { y: '105%' }}
            transition={{ duration: on ? 0.7 : 0.25, ease: EASE, delay: on ? 0.28 + j * 0.035 : 0 }}>{c === ' ' ? ' ' : c}</motion.span>
        </span>
      ))}
    </span>
  );
}

/* A pinned scene (page-local): the words pin on the left while the object on the right changes. The outgoing title
   slides out of its mask before the next one rises, so two titles never share the frame. Phones, reduced motion and
   JS off get every scene stacked. Keyboard focus inside a scene scrolls the page to it. */
function Pinned({ id, label, dark, scenes, className = '', head }) {
  const ref = useRef(null);
  const n = scenes.length;
  const [at, setAt] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  useMotionValueEvent(scrollYProgress, 'change', (p) => setAt(Math.min(n - 1, Math.max(0, Math.floor(p * n * 0.999)))));
  const go = (i) => {
    const el = ref.current;
    if (!el || innerWidth <= 900) return;
    const y = el.getBoundingClientRect().top + scrollY + (el.offsetHeight - innerHeight) * ((i + 0.5) / n);
    window.__lenis ? window.__lenis.scrollTo(y, { immediate: true, force: true }) : scrollTo(0, y);
  };
  return (
    <section ref={ref} id={id} className={'xin-pin ' + className} style={{ '--n': n }} aria-label={label} data-room={dark ? 'dark' : undefined}>
      {head}
      <div className="xin-pin-st">
        <div className="vc-grid xin-pin-g">
          {scenes.map((s, i) => {
            const st = i === at ? 'on' : i < at ? 'past' : 'next';
            return (
              <div className="xin-pin-s" key={s.key} data-st={st} onFocusCapture={() => i !== at && go(i)}>
                <div className="xin-pin-t">
                  {s.pre && <motion.div className="xin-pin-pre" initial={false} animate={{ opacity: st === 'on' ? 1 : 0 }} transition={{ duration: st === 'on' ? 0.3 : 0.15, delay: st === 'on' ? 0.25 : 0 }}>{s.pre}</motion.div>}
                  <div className="xin-pin-h">
                    <motion.div initial={false} animate={{ y: st === 'on' ? '0%' : st === 'past' ? '-105%' : '105%' }} transition={{ duration: st === 'on' ? 0.6 : 0.28, ease: EASE, delay: st === 'on' ? 0.3 : 0 }}>{s.title(st === 'on')}</motion.div>
                  </div>
                  <motion.div className="xin-pin-b" initial={false} animate={{ opacity: st === 'on' ? 1 : 0 }} transition={{ duration: st === 'on' ? 0.4 : 0.2, delay: st === 'on' ? 0.45 : 0 }}>{s.body}</motion.div>
                </div>
                <motion.div className="xin-pin-v" initial={false} animate={{ opacity: st === 'on' ? 1 : 0, scale: st === 'on' ? 1 : 0.97 }} transition={{ duration: st === 'on' ? 0.6 : 0.28, ease: EASE, delay: st === 'on' ? 0.2 : 0 }}>{s.visual(st === 'on')}</motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------- the thesis: three pinned chapters, each with a true object ---------- */
const THESIS = [['Smarter', 'Frontier intelligence on a measured Pareto frontier.'], ['Faster', 'Up to 200× faster for direct decisions.'], ['Cheaper', 'Up to 400× cheaper on the work we measure.']];
// 200× and 400× against the same 1× mark: the 400× bar is twice the 200× bar
const Times = ({ v, w, on }) => (
  <div className="xin-big-f" aria-hidden="true">
    <b className="vc-num">{v}</b>
    <span className="xin-big-bar"><i className="one" /><span><motion.i style={{ '--xin-s': w }} initial={false} animate={{ scaleX: on ? w : 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.35 }} /></span></span>
  </div>
);
const THESIS_V = [
  () => <div className="xin-th-sig" aria-hidden="true"><Sigil seed="Hanzo.Thesis Smarter" data={[93.7, 95.6, 16]} /></div>,
  (on) => <Times v="200×" w={0.5} on={on} />,
  (on) => <Times v="400×" w={1} on={on} />,
];

function Thesis() {
  return (
    <Pinned
      label="Hanzo.Thesis · one platform"
      className="xin-thesis"
      head={<p className="x-sr"><span>Hanzo.Thesis</span> <span>one platform</span></p>}
      scenes={THESIS.map(([t, d], i) => ({
        key: t,
        title: () => <h3 className="vc-display s">{t}</h3>,
        body: <p className="vc-lede">{d}</p>,
        visual: THESIS_V[i],
      }))}
    />
  );
}

/* ---------- the stack: three slabs that layer as you scroll ---------- */
const LAYERS = [['Frontier models', 'One API for intelligence, with measured accuracy, speed and cost.', '/models'], ['Agents that do the work', 'Coding agents and autonomous runs on the same account and tools.', '/dev'], ['A cloud they can own', 'Managed on Hanzo, in a customer cloud, or on their own hardware.', '/platform']];
function Stack() {
  return (
    <section className="vc-sec xin-stack" aria-labelledby="xin-stack">
      <div className="vc-grid">
        <header className="xin-stack-h">
          <MaskLines id="xin-stack" lines={['One account for', 'the whole AI stack.']} className="vc-headline" />
          <p className="vc-body">The models people use, the agents that put them to work, and the infrastructure a company needs to run both. Each layer makes the next one more useful.</p>
        </header>
        <ol className="xin-slabs">
          {LAYERS.map(([t, d, to], i) => (
            <li key={t} style={{ '--i': i }}>
              <A to={to} className="xin-slab">
                <span className="xin-slab-n vc-num">{String(3 - i).padStart(2, '0')}</span>
                <span className="xin-slab-t">{t}</span>
                <span className="xin-slab-d">{d}</span>
                <span className="xin-slab-go">Explore <Arrow /></span>
              </A>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------- the results room: a pinned scene, one giant figure at a time (the one dark room) ---------- */
const LCB = [['Enso', 93.7], ['gpt-5.6-sol', 93.1], ['gpt-5.5', 91.4], ['opus-5.5', 80.0], ['fable-5.1', 80.0], ['fable-5', 78.3]];
const Dots = ({ n, lit, cols, on }) => (
  <span className="xin-dots" style={{ '--cols': cols }} aria-hidden="true">
    {Array.from({ length: n }, (_, i) => <motion.i key={i} className={i < lit ? 'on' : ''} initial={false} animate={{ opacity: on ? 1 : 0.2 }} transition={{ duration: 0.3, delay: on ? 0.3 + (i / n) * 0.8 : 0 }} />)}
  </span>
);
const Bars = ({ rows, max, on, fmt }) => (
  <ul className="xin-bars" aria-hidden="true">
    {rows.map(([nm, v], i) => (
      <li key={nm} className={i ? '' : 'me'}>
        <span>{nm}</span>
        <i><motion.b style={{ '--xin-s': v / max }} initial={false} animate={{ scaleX: on ? v / max : 0 }} transition={{ duration: 0.8, ease: EASE, delay: on ? 0.3 + i * 0.06 : 0 }} /></i>
        <b>{fmt(v)}</b>
      </li>
    ))}
  </ul>
);
const Interval = ({ on }) => ( // 3.02×, 95% interval 2.06–4.36×, on an axis from 0 with the 1× mark
  <span className="xin-int" aria-hidden="true">
    <i className="axis" /><i className="one" style={{ left: `${(1 / 5) * 100}%` }} />
    <motion.i className="band" initial={false} style={{ left: `${(2.06 / 5) * 100}%`, width: `${((4.36 - 2.06) / 5) * 100}%` }} animate={{ opacity: on ? 1 : 0, scaleX: on ? 1 : 0.2 }} transition={{ duration: 0.7, ease: EASE, delay: 0.35 }} />
    <motion.i className="pt" initial={false} style={{ left: `${(3.02 / 5) * 100}%` }} animate={{ scale: on ? 1 : 0 }} transition={{ duration: 0.3, ease: EASE, delay: 0.6 }} />
  </span>
);
const RESULTS = [
  { key: 'ds', k: 'Research.DecisionSuite', m: 'Kai', v: '16 of 16', t: 'Decision Suite tasks won by Kai', d: <><span>Each set on</span> <span className="x-mono">Oct 15, 2026,</span> <span>with its public data and the runs of both models.</span></>, to: '/benchmarks#decision-suite', go: 'Each task and its runs →', vis: (on) => <Dots n={16} lit={16} cols={4} on={on} /> },
  { key: 'lcb', k: 'Research.LiveCodeBench', m: '175 questions', v: '93.7%', d: <><span className="xin-pin-p">Enso as enso-bench measured it on 2026-07-19, beside each single model on the same questions. Each bar is a run&apos;s accuracy.</span><span className="xin-pin-p"><span>LiveCodeBench&apos;s recent problems: Enso</span> <b className="x-mono"><span>93.7%,</span></b> <span>164 of 175 right, against 93.1% for gpt-5.6-sol, the next model on the same questions.</span></span></>, to: '/enso', vis: (on) => <Bars rows={LCB} max={100} on={on} fmt={(v) => v.toFixed(1) + '%'} /> },
  { key: 'gpqa', m: 'Enso Ultra', v: '95.6%', t: 'GPQA Diamond', d: '152 of 159 new questions right, against 93.1% for the best single model on the same questions.', to: '/enso', vis: (on) => <Dots n={159} lit={152} cols={20} on={on} /> },
  { key: 'kai', m: 'Kai', v: '0.8 ms', t: 'One decision, served', d: 'Kai on GPU, each a p50: 0.3 ms cached, 0.4 ms through the runtime, 0.8 ms served over HTTP.', to: '/kai', vis: (on) => <Bars rows={[['cached', 0.3], ['runtime', 0.4], ['HTTP', 0.8]]} max={0.8} on={on} fmt={(v) => v + ' ms'} /> },
  { key: 'dev', m: 'Hanzo Dev', v: '3.02×', t: 'Faster on the same coding tasks', d: 'Over the 42 tasks both agents solved, 95% interval 2.06–4.36×.', to: '/dev', vis: (on) => <Interval on={on} /> },
  { key: 'zen', m: 'Zen 6', v: '~3,665', t: 'Prompt tokens a second', d: 'On NVIDIA Grace-Blackwell, NVFP4 + Latent Sparse Attention (D-LSA). Measured by Hanzo, Nov 4, 2026.', to: '/zen#desks', vis: () => <span className="xin-res-sig" aria-hidden="true"><Sigil seed="Zen 6 ~3,665" data={[3665, 4]} /></span> },
];
function Research() {
  return (
    <Pinned
      id="research"
      dark
      label="The latest results, with every task."
      className="xin-res"
      head={(
        <div className="vc-grid xin-res-h">
          <MaskLines id="xin-res" lines={['The latest results,', 'with every task.']} className="vc-display s" />
          <p className="vc-body">Each result is read from research runs on public questions, the same for every model.</p>
        </div>
      )}
      scenes={RESULTS.map((r) => ({
        key: r.key,
        pre: <p className="xin-cell-m">{r.k && <span className="x-mono">{r.k}</span>} <span>{r.m}</span></p>,
        title: (on) => <RollFig v={r.v} on={on} className="xin-giant" />,
        body: (
          <>
            {r.t && <b className="xin-cell-t"><span>{r.t}</span></b>}
            <span className="xin-cell-d">{r.d}</span>
            {r.go
              ? <A to={r.to} className="xin-go">{r.go}</A>
              : <A to={r.to} className="xin-go-i" aria-label={r.t || r.k}><Up /></A>}
          </>
        ),
        visual: r.vis,
      }))}
    />
  );
}

/* ---------- built in public: the commit record ---------- */
function Public() {
  const cols = Math.ceil(H.heat.length / 7);
  const [lead, ...rest] = H.stats;
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.4 });
  return (
    <section className="vc-sec xin-pub" aria-labelledby="xin-pub">
      <div className="vc-grid">
        <header className="xin-pub-h">
          <h2 id="xin-pub" className="vc-headline">Built in public. Shipping every day.</h2>
          <p className="vc-body">The cloud, the gateway, the agents and the runtime are developed in the open. This is the public commit record, not a marketing projection.</p>
        </header>
        <A to={H.statTo[0]} className="xin-lead">
          <b className="vc-display vc-num">{lead[1]}<span className="xin-up"><Up /></span></b>
          <span className="xin-lead-k">{lead[0]}</span>
          <small>{lead[2]}</small>
        </A>
        <ul className="xin-stats" ref={ref}>
          {rest.map(([k, v, s], i) => (
            <li key={i}><A to={H.statTo[i + 1]}><span>{k}</span><RollFig v={v} on={seen} className="xin-stat-v" /><small><span>{s}</span></small><span className="xin-up"><Up /></span></A></li>
          ))}
        </ul>
        <figure className="xin-heat">
          <figcaption className="vc-title">Commits a day</figcaption>
          <div className="xin-heat-sc">
            <div className="xin-heat-m" aria-hidden="true">{['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'].map((m, i) => <span key={i}>{m}</span>)}</div>
            <div className="xin-heat-g" role="img" aria-label={H.heatLabel} style={{ '--cols': cols }}>
              {[...H.heat].map((c, i) => <i key={i} className={(c === '.' ? 'x' : 'l' + c) + (i === LAST_DAY ? ' now' : '')} />)}
            </div>
          </div>
          <div className="xin-heat-f"><span>Commits a day, from Nov 8, 2025 to Nov 7, 2026</span><span className="xin-leg">Less {[0, 1, 2, 3, 4].map((l) => <i key={l} className={'l' + l} />)} More</span></div>
        </figure>
        <div className="xin-commits">
          <h3 className="vc-title">Latest commits</h3>
          <ol>
            {H.commits.map(([repo, msg, when, to], i) => <li key={to}><A to={to}><span className="x-mono">{repo}</span><span>{msg}</span><small className="x-mono">{i === 0 && <i className="xin-live" aria-hidden="true" />}<span>{when}</span> <span>UTC</span></small></A></li>)}
          </ol>
        </div>
        <p className="xin-read"><span className="x-mono">{H.read}</span><A to={H.readTo} className="x-arrow"><span>Read the source</span><Arrow /></A></p>
      </div>
    </section>
  );
}

/* ---------- what Hanzo built: a still wall ---------- */
const BUILT = [['damon-motorcycles.svg', 'Damon Motorcycles', '/customers/damon-motorcycles'], ['kanoa.png', 'KANOA', '/customers/kanoa'], ['skully.png', 'SKULLY', '/customers#skully'], ['bellabeat.svg', 'Bellabeat', '/customers#bellabeat'], ['stoned.svg', 'STONED Audio', '/customers#stoned'], ['unikoin-gold.svg', 'Unikrn', '/customers#unikoin-gold'], ['arca.png', 'Arca', '/customers#arca'], ['casper-blockchain.svg', 'Casper Labs', '/customers#casper-blockchain'], ['trillerfest.png', 'Triller', '/customers#trillerfest'], ['cover-build.svg', 'Cover Build', '/customers#cover-build'], ['myle-tap.png', 'Myle Tap', '/customers#myle-tap'], ['keek-social.svg', 'Personas Social', '/customers#keek-social']];
function Built() {
  return (
    <section className="xin-built" aria-labelledby="xin-built-h">
      <div className="vc-grid"><h2 id="xin-built-h" className="vc-title xin-built-k">Products Hanzo built and launched</h2></div>
      <div className="vc-grid">
        <ul className="xin-wall">
          {BUILT.map(([f, nm, to], i) => <li key={f} style={{ '--i': i }}><A to={to} aria-label={nm}><Logo src={'/logos/customers/' + f} name={nm} /></A></li>)}
        </ul>
      </div>
    </section>
  );
}

/* ---------- people and structure ---------- */
/* A portrait (the kit's Img) whose fallback is the person's own Sigil, not a blank disc. */
function Face({ slug, name }) {
  const ref = useRef(null);
  const [bad, setBad] = useState(false);
  useEffect(() => { const i = ref.current; if (i && i.complete && !i.naturalWidth) setBad(true); }, []);
  return (
    <span className="xin-ini" aria-hidden="true">
      {bad ? <Sigil seed={name} data={[name.length]} still /> : <Img ref={ref} src={`/authors/${slug}-portrait.jpg`} alt="" w={56} h={56} onError={() => setBad(true)} />}
    </span>
  );
}
function People() {
  return (
    <section className="vc-sec xin-people" aria-labelledby="xin-people">
      <div className="vc-grid">
        <header className="xin-people-h">
          <MaskLines id="xin-people" lines={['Operators building', 'for the long term.']} className="vc-headline" />
          <p className="vc-body">Executive leadership of Hanzo AI, Inc., with the corporate structure and governance stated plainly.</p>
        </header>
        <div className="xin-org" aria-hidden="true">
          <span className="xin-org-n">Hanzo Industries Inc.</span>
          <span className="xin-org-l"><i /><b className="vc-num">51%</b></span>
          <span className="xin-org-n ink">Hanzo AI, Inc.</span>
        </div>
        <div className="xin-people-r">
          <div className="xin-execs">
            {[['Antje Worring', 'CEO, Hanzo AI, Inc.', 'https://www.linkedin.com/in/antje-worring/', 'antje-worring'], ['Zach Kelling', 'CTO, Hanzo AI, Inc.', 'https://www.linkedin.com/in/zeekay/', 'zach-kelling']].map(([nm, r, to, slug]) => (
              <A key={nm} to={to} className="xin-exec"><Face slug={slug} name={nm} /><b><span>{nm}</span></b><span>{r}</span><i aria-hidden="true">↗</i></A>
            ))}
          </div>
          <div className="xin-gov">
            <h3 className="xin-gov-h">Corporate structure</h3>
            <p className="vc-body">Investors invest in Hanzo Industries Inc., the holding company. It owns 51% of Hanzo AI, Inc., which holds the AI IP and the app.</p>
            <h3 className="xin-gov-h">Governance</h3>
            <p className="vc-body">Hanzo Industries Inc. is privately held and does not publish financial statements. Requests for information are answered case by case by investor relations.</p>
            <p className="xin-gov-l"><A to="/legal/terms">Legal</A><A to="/security">Security</A><A to="/press">Press</A></p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Beyond: "Read the source", a calm list of proof ----------
   Each figure with Hanzo's own name for it and its source. Open a source (or press the tick) and it is ticked off; a
   giant tabular counter fills as you go. Kept in this browser (try/catch: private windows just start empty). */
const SAVE = 'hz-investors-checked';
function Diligence() {
  const [done, setDone] = useState([]);
  useEffect(() => { try { setDone(JSON.parse(localStorage.getItem(SAVE)) || []); } catch { /* private window: start empty */ } }, []);
  const mark = (i, on = true) => setDone((d) => {
    const nx = on ? [...new Set([...d, i])] : d.filter((x) => x !== i);
    try { localStorage.setItem(SAVE, JSON.stringify(nx)); } catch { /* not stored; still ticked for this visit */ }
    return nx;
  });
  return (
    <section className="vc-sec xin-dd" aria-labelledby="xin-dd">
      <div className="vc-grid">
        <div className="xin-dd-h">
          <h2 id="xin-dd" className="vc-headline">Read the source</h2>
          <p className="xin-dd-n vc-num" aria-live="polite" aria-label={`${done.length} / ${TICK.length}`}><b>{done.length}</b><span>/ {TICK.length}</span></p>
          <i className="xin-dd-bar" aria-hidden="true"><b style={{ transform: `scaleX(${done.length / TICK.length})` }} /></i>
        </div>
        <ol className="xin-dd-list">
          {TICK.map(([k, w, v, to], i) => {
            const on = done.includes(i);
            return (
              <li key={k} className={on ? 'on' : ''}>
                <button type="button" className="xin-dd-t" aria-pressed={on} aria-label={`${v} ${k} ${w}`} onClick={() => mark(i, !on)}>
                  <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><circle cx="12" cy="12" r="10.5" fill="none" strokeWidth="1.5" /><path d="M7.5 12.5l3 3 6-6.5" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
                <A to={to} onClick={() => mark(i)} className="xin-dd-go">
                  <b className="vc-num">{v}</b>
                  <span>{k} <span className="xin-dd-w">{w}</span></span>
                  <Up />
                </A>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

function Close() {
  return (
    <section className="xin-close" aria-labelledby="xin-close">
      <div className="vc-grid">
        <MaskLines id="xin-close" lines={['Build the future', 'with us.']} className="vc-display m" />
        <div className="xin-close-art" aria-hidden="true"><Sigil seed="/investors" data={[732288, 51, 16, 93.7]} /></div>
        <div className="xin-close-r">
          <p className="vc-lede">For investment enquiries, company information and requests beyond this page, write directly to our team.</p>
          <div className="xin-acts">
            <Cta to="mailto:ir@hanzo.ai" target="_self" className="xin-big" id="investors.close" data-thumb="Contact investor relations">ir@hanzo.ai</Cta>
            <Cta to="https://cal.com/hanzo" kind="quiet" className="xin-big" id="investors.call">Book a call</Cta>
          </div>
        </div>
      </div>
    </section>
  );
}

/* On phones "Contact investor relations" is too long for the header, so usePhoneAsk would keep "Try Hanzo" there for
   the whole scroll. The same ask in Hanzo's shorter words is the close's own label, ir@hanzo.ai (the same mailto), so
   on phones the hero's ask hands the header that label: after the hero an investor sees ir@hanzo.ai, never Try Hanzo.
   Runs before usePhoneAsk reads the label. Desktop keeps the full words. */
function usePhoneThumb() {
  useEffect(() => {
    if (!matchMedia('(max-width: 700px)').matches) return undefined;
    const a = document.querySelector('main.xin [data-cta="investors.hero"]');
    if (!a) return undefined;
    const was = a.getAttribute('data-thumb');
    a.setAttribute('data-thumb', 'ir@hanzo.ai');
    return () => a.setAttribute('data-thumb', was);
  }, []);
}

export default function Investors() {
  usePhoneThumb();
  usePhoneAsk();
  return (
    <main className="vc xin" style={{ '--acc': '#0a0a0a' }}>
      <Hero />
      <Thesis />
      <Stack />
      <Research />
      <Public />
      <Built />
      <People />
      <Diligence />
      <Close />
    </main>
  );
}
