'use client';
/* /investors. V2: 8/10 Calm story in huge tabular figures, ink and greys only: a two-line display hero beside a figure
   counter that rolls once through the seven measured results and rests (pause and replay control), the thesis as three
   pinned chapters (Pareto, 200×, 400×), the stack as layered slabs, the results room as a wall of giant figures (the one
   dark room), the public commit record, a still wall of what Hanzo built, the structure with 51% as its figure, every
   figure listed to its source, and a Sigil close.
   Persona: an investor (or press) doing diligence (PLAN 1.1 "Investor and press").
   Goal: reach investor relations. CTA: "Contact investor relations" (mailto:ir@hanzo.ai), metric: the one contact
   click (cta_click investors.*); one solid per screen, carried by the site's shared ask bar after the hero.
   Signature: the figure counter. Every measured figure rolls in digit by digit, one at a time, each named in Hanzo's
   own words and linked to the run it comes from; press any step to hold it.
   Supporting (3): masked kinetic lines; the thesis as pinned chapters (PinScenes); the Sigil close drifting.
   Beyond: "Read the source": the seven figures as one list you tick off as you open each source, a giant tabular
   counter that fills as you go, kept in this browser for next time.
   Deletes: the indigo accent, the eyebrows ("Hanzo Investor Relations", "Hanzo.Thesis · one platform"), the endless
   counter loop, the endlessly drifting logo marquee, the native checkboxes, the invented labels ("Open the source",
   "Check our work", "Every figure, to its run", "checked", composed figure names) and the visible initials.
   Every word, figure and link is Hanzo's. */
import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { Btn as UiBtn } from '../ui';
import { A, Img } from '../kit';
import Sigil from '../Sigil';
import { href as hrefOf } from '../../lib/route';
import MaskLines from './company/MaskLines';
import PinScenes from './company/PinScenes';
import { ECO } from './openSourceData';
import '../v2/vc-type.css';
import './Investors.css';

const EASE = [0.16, 1, 0.3, 1];
const H = ECO[0];
const Arrow = () => <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;

// the seven measured figures: Hanzo's own name for each, its subject, the figure and the page that carries its runs
const [LEAD] = H.stats;
const TICK = [['Research.DecisionSuite', 'Kai', '16 of 16', '/benchmarks#decision-suite'], ['Research.LiveCodeBench', 'Enso', '93.7%', '/enso'], ['GPQA Diamond', 'Enso Ultra', '95.6%', '/enso'], ['One decision, served', 'Kai', '0.8 ms', '/kai'], ['Faster on the same coding tasks', 'Hanzo Dev', '3.02×', '/dev'], ['Prompt tokens a second', 'Zen 6', '~3,665', '/zen#desks'], [LEAD[0], LEAD[2], LEAD[1], H.readTo]];
const Btn = ({ to, children, ...r }) => <UiBtn href={hrefOf(to)} {...r}>{children}</UiBtn>;
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
function Roll() {
  const box = useRef(null);
  const seen = useInView(box, { amount: 0.4 });
  const calm = useReducedMotion();
  const [at, setAt] = useState(0);
  const [run, setRun] = useState(true); // false once you hold it, pause it or it has gone round once
  const n = TICK.length;
  useEffect(() => {
    if (!run || calm || !seen) return;
    const t = setTimeout(() => { if (at === n - 1) { setAt(0); setRun(false); } else setAt(at + 1); }, 3400);
    return () => clearTimeout(t);
  }, [at, run, calm, seen, n]);
  const [label, who, , to] = TICK[at];
  const live = run && !calm;
  return (
    <div className="xin-roll vc-obj" ref={box}>
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
  return (
    <section className="xin-hero" aria-label="Hanzo Investor Relations" data-ask-name="Hanzo Investor Relations">
      <div className="vc-grid xin-hero-g">
        <div className="xin-hero-t">
          <MaskLines as="h1" id="xin-h1" now delay={0.05} lines={['The intelligence', 'layer for business.']} className="vc-display xin-h1" />
        </div>
        <motion.div className="xin-hero-l" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, ease: EASE, delay: 0.6 }}>
          <p className="vc-lede">Models, agents and the cloud beneath them — one account, one key, one bill.</p>
          <div className="xin-acts">
            <UiBtn href="mailto:ir@hanzo.ai" solid className="xin-big" data-thumb="Contact investor relations" data-cta="investors.hero">Contact investor relations</UiBtn>
            <UiBtn href="#research" className="xin-big" data-cta="investors.research">See the research</UiBtn>
          </div>
        </motion.div>
        <motion.div className="xin-hero-o" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: EASE, delay: 0.3 }}>
          <Roll />
        </motion.div>
      </div>
      <div className="vc-grid xin-backed">
        <p className="vc-kick">Backed by</p>
        <ul>{BACKERS.map(([f, n, to]) => <li key={f}><A to={to}><Logo src={`/logos/partners/${f}.svg`} name={n} /></A></li>)}</ul>
      </div>
    </section>
  );
}

/* ---------- the thesis: three pinned chapters ---------- */
const THESIS = [['Smarter', 'Frontier intelligence on a measured Pareto frontier.'], ['Faster', 'Up to 200× faster for direct decisions.'], ['Cheaper', 'Up to 400× cheaper on the work we measure.']];
const Pareto = () => (
  <svg className="xin-pareto" viewBox="0 0 600 500" aria-hidden="true">
    <path d="M70 40V440H570" fill="none" stroke="rgba(0,0,0,.14)" strokeWidth="1.5" />
    {[[150, 360], [210, 330], [260, 300], [330, 250], [400, 230], [460, 190], [300, 340], [380, 300], [470, 270], [520, 240], [240, 380]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="7" fill="#c7c7cc" />)}
    <path d="M110 420C170 300 260 190 380 140S520 90 560 82" fill="none" stroke="#1d1d1f" strokeWidth="3" strokeLinecap="round" strokeDasharray="2 10" />
    <circle cx="380" cy="140" r="16" fill="#1d1d1f" />
    <circle cx="380" cy="140" r="30" fill="none" stroke="#1d1d1f" strokeOpacity=".25" strokeWidth="2" />
  </svg>
);
const Big = ({ v }) => (
  <div className="xin-big-f" aria-hidden="true">
    <b className="vc-num">{v}</b>
    <span className="xin-big-bar"><i style={{ '--w': v === '200×' ? '50%' : '100%' }} /><i className="one" /></span>
  </div>
);
const THESIS_V = [<Pareto key="p" />, <Big key="2" v="200×" />, <Big key="4" v="400×" />];

function Thesis() {
  return (
    <>
      <PinScenes
        label="Hanzo.Thesis · one platform"
        className="xin-thesis"
        scenes={THESIS.map(([t, d], i) => ({
          key: t,
          title: <h3 className="vc-display s">{t}</h3>,
          body: <p className="vc-lede">{d}</p>,
          visual: THESIS_V[i],
        }))}
      />
    </>
  );
}

/* ---------- the stack: three layered slabs ---------- */
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

/* ---------- the results room: a wall of giant figures (the one dark room) ---------- */
const LCB = [['Enso', 93.7], ['gpt-5.6-sol', 93.1], ['gpt-5.5', 91.4], ['opus-5.5', 80.0], ['fable-5.1', 80.0], ['fable-5', 78.3]];
const CELLS = [
  ['/enso', 'Enso Ultra', '95.6%', 'GPQA Diamond', '152 of 159 new questions right, against 93.1% for the best single model on the same questions.'],
  ['/kai', 'Kai', '0.8 ms', 'One decision, served', 'Kai on GPU, each a p50: 0.3 ms cached, 0.4 ms through the runtime, 0.8 ms served over HTTP.'],
  ['/dev', 'Hanzo Dev', '3.02×', 'Faster on the same coding tasks', 'Over the 42 tasks both agents solved, 95% interval 2.06–4.36×.'],
  ['/zen#desks', 'Zen 6', '~3,665', 'Prompt tokens a second', 'On NVIDIA Grace-Blackwell, NVFP4 + Latent Sparse Attention (D-LSA). Measured by Hanzo, Nov 4, 2026.'],
];
function Research() {
  return (
    <section className="vc-sec xin-res" id="research" data-room="dark" aria-labelledby="xin-res">
      <div className="vc-grid">
        <header className="xin-res-h">
          <MaskLines id="xin-res" lines={['The latest results,', 'with every task.']} className="vc-display s" />
          <p className="vc-body">Each result is read from research runs on public questions, the same for every model.</p>
        </header>
        <A to="/benchmarks#decision-suite" className="xin-cell ds">
          <span className="xin-cell-k x-mono">Research.DecisionSuite</span>
          <span className="xin-cell-m">Kai</span>
          <b className="xin-giant vc-num">16 of 16</b>
          <b className="xin-cell-t">Decision Suite tasks won by Kai</b>
          <span className="xin-cell-d">Each set on <span className="x-mono">Oct 15, 2026</span>, with its public data and the runs of both models.</span>
          <span className="xin-go">Each task and its runs →</span>
        </A>
        <div className="xin-cell lcb">
          <span className="xin-cell-k x-mono">Research.LiveCodeBench</span>
          <span className="xin-cell-m">175 questions</span>
          <ul className="xin-bars">
            {LCB.map(([nm, v], i) => (
              <li key={nm} className={i ? '' : 'me'} style={{ '--w': (v - 60) / 40 }}>
                <span>{nm}</span>
                <i><b /></i>
                <b className="x-mono">{v.toFixed(1)}%</b>
              </li>
            ))}
          </ul>
          <p className="xin-cell-d">Enso as enso-bench measured it on 2026-07-19, beside each single model on the same questions. Each bar is a run&apos;s accuracy.</p>
          <p className="xin-cell-d">LiveCodeBench&apos;s recent problems: Enso <b className="x-mono">93.7%</b>, 164 of 175 right, against 93.1% for gpt-5.6-sol, the next model on the same questions.</p>
        </div>
        {CELLS.map(([to, m, v, t, d]) => (
          <A key={t} to={to} className="xin-cell fig">
            <span className="xin-cell-m">{m}</span>
            <b className="xin-num vc-num">{v}</b>
            <b className="xin-cell-t">{t}</b>
            <span className="xin-cell-d">{d}</span>
          </A>
        ))}
      </div>
    </section>
  );
}

/* ---------- built in public: the commit record ---------- */
function Public() {
  const cols = Math.ceil(H.heat.length / 7);
  const [lead, ...rest] = H.stats;
  return (
    <section className="vc-sec xin-pub" aria-labelledby="xin-pub">
      <div className="vc-grid">
        <header className="xin-pub-h">
          <h2 id="xin-pub" className="vc-headline">Built in public. Shipping every day.</h2>
          <p className="vc-body">The cloud, the gateway, the agents and the runtime are developed in the open. This is the public commit record, not a marketing projection.</p>
        </header>
        <A to={H.statTo[0]} className="xin-lead">
          <span className="vc-kick acc">{lead[0]}</span>
          <b className="vc-display vc-num">{lead[1]}</b>
          <small>{lead[2]}</small>
        </A>
        <ul className="xin-stats">
          {rest.map(([k, v, s], i) => (
            <li key={i}><A to={H.statTo[i + 1]}><span>{k}</span><b className="vc-num">{v}</b><small>{s}</small></A></li>
          ))}
        </ul>
        <figure className="xin-heat">
          <figcaption className="vc-kick">Commits a day</figcaption>
          <div className="xin-heat-m" aria-hidden="true">{['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'].map((m, i) => <span key={i}>{m}</span>)}</div>
          <div className="xin-heat-g" role="img" aria-label={H.heatLabel} style={{ '--cols': cols }}>
            {[...H.heat].map((c, i) => <i key={i} className={c === '.' ? 'x' : 'l' + c} />)}
          </div>
          <div className="xin-heat-f"><span>Commits a day, from Nov 7, 2025 to Nov 6, 2026</span><span className="xin-leg">Less {[0, 1, 2, 3, 4].map((l) => <i key={l} className={'l' + l} />)} More</span></div>
        </figure>
        <div className="xin-commits">
          <h3 className="vc-title">Latest commits</h3>
          <ol>
            {H.commits.map(([repo, msg, when, to]) => <li key={to}><A to={to}><span className="x-mono">{repo}</span><span>{msg}</span><small className="x-mono">{when} UTC</small></A></li>)}
          </ol>
        </div>
        <p className="xin-read"><span className="x-mono">{H.read}</span><A to={H.readTo} className="x-arrow"><span>Read the source</span><Arrow /></A></p>
      </div>
    </section>
  );
}

/* ---------- what Hanzo built: a wall that drifts ---------- */
const BUILT = [['damon-motorcycles.svg', 'Damon Motorcycles', '/customers/damon-motorcycles'], ['kanoa.png', 'KANOA', '/customers/kanoa'], ['skully.png', 'SKULLY', '/customers#skully'], ['bellabeat.svg', 'Bellabeat', '/customers#bellabeat'], ['stoned.svg', 'STONED Audio', '/customers#stoned'], ['unikoin-gold.svg', 'Unikrn', '/customers#unikoin-gold'], ['arca.png', 'Arca', '/customers#arca'], ['casper-blockchain.svg', 'Casper Labs', '/customers#casper-blockchain'], ['trillerfest.png', 'Triller', '/customers#trillerfest'], ['cover-build.svg', 'Cover Build', '/customers#cover-build'], ['myle-tap.png', 'Myle Tap', '/customers#myle-tap'], ['keek-social.svg', 'Personas Social', '/customers#keek-social']];
function Built() {
  return (
    <section className="xin-built" aria-labelledby="xin-built-h">
      <div className="vc-grid"><h2 id="xin-built-h" className="vc-kick xin-built-k">Products Hanzo built and launched</h2></div>
      <div className="vc-grid">
        <ul className="xin-wall">
          {BUILT.map(([f, nm, to]) => <li key={f}><A to={to} aria-label={nm}><Logo src={'/logos/customers/' + f} name={nm} /></A></li>)}
        </ul>
      </div>
    </section>
  );
}

/* ---------- people and structure ---------- */
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
            {[['Antje Worring', 'CEO, Hanzo AI, Inc.', 'https://www.linkedin.com/in/antje-worring/', 'antje-worring'], ['Zach Kelling', 'CTO, Hanzo AI, Inc.', 'https://www.linkedin.com/in/zeekay/', 'zach-kelling']].map(([nm, r, to, ini]) => (
              <A key={nm} to={to} className="xin-exec"><span className="xin-ini" aria-hidden="true" style={{ '--img': `url(https://hanzo.ai/authors/${ini}-portrait.jpg)` }} /><b>{nm}</b><span>{r}</span><i aria-hidden="true">↗</i></A>
            ))}
          </div>
          <div className="xin-gov">
            <h3 className="vc-kick acc">Corporate structure</h3>
            <p className="vc-body">Investors invest in Hanzo Industries Inc., the holding company. It owns 51% of Hanzo AI, Inc., which holds the AI IP and the app.</p>
            <h3 className="vc-kick acc">Governance</h3>
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
        <div className="xin-close-art vc-obj" aria-hidden="true"><Sigil seed="/investors" data={[732288, 51, 16, 93.7]} /></div>
        <div className="xin-close-r">
          <p className="vc-lede">For investment enquiries, company information and requests beyond this page, write directly to our team.</p>
          <div className="xin-acts">
            <Btn to="https://cal.com/hanzo" className="xin-big" data-cta="investors.call">Book a call</Btn>
            <a href="mailto:ir@hanzo.ai" className="xin-mail">ir@hanzo.ai</a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Investors() {
  return (
    <main className="vc xin" style={{ '--acc': '#1d1d1f' }}>
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
