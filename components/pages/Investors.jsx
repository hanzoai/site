'use client';
/* Investors. Its idea is the investor terminal. The hero is the thesis on a terminal screen with a quiet ticker of
   the measured figures running beneath it. Signature moment: the results room — a dark terminal where every figure
   counts up from its run and links to it, LiveCodeBench drawn bar by bar. Then the public commit record, the
   companies Hanzo built with, the people, and the corporate structure drawn as it is stated. Beyond: "Check our work" -
   the ticker's seven figures as a diligence list; open each one's source and it is ticked off, and your progress stays
   in this browser for next time. Every word, figure and link is Hanzo's. */
import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';
import { EASE, Rise, Count } from '../ui';
import { A, Go, SecHead, Flap, Band } from '../kit';
import { ECO } from './openSourceData';
import './Investors.css';

const THESIS = [['Smarter', 'Frontier intelligence on a measured Pareto frontier.'], ['Faster', 'Up to 200× faster for direct decisions.'], ['Cheaper', 'Up to 400× cheaper on the work we measure.']];
const TICK = [['Decision Suite', '16 of 16'], ['LiveCodeBench · Enso', '93.7%'], ['GPQA Diamond · Enso Ultra', '95.6%'], ['One decision, served', '0.8 ms'], ['Hanzo Dev', '3.02×'], ['Zen 6 prompt tokens a second', '~3,665'], ['Commits, past year', '732,288']];
const BACKERS = [['techstars', 'Techstars', 'https://www.techstars.com'], ['amazon', 'Amazon', 'https://aws.amazon.com'], ['digitalocean', 'DigitalOcean', 'https://www.digitalocean.com'], ['google', 'Google', 'https://cloud.google.com'], ['microsoft', 'Microsoft', 'https://azure.microsoft.com'], ['nvidia', 'NVIDIA', 'https://www.nvidia.com'], ['nebius', 'Nebius', 'https://nebius.com']];

function Hero() {
  const line = (t, d) => <span className="x-line"><motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: d }}>{t}</motion.span></span>;
  return (
    <section className="xin-hero" aria-labelledby="xin-h1">
      <div className="x-wrap xin-hero-g">
        <div>
          <motion.p className="x-kick" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }}>Hanzo Investor Relations</motion.p>
          <h1 id="xin-h1" className="xin-h1">{line('The intelligence', 0.05)}{line('layer for business.', 0.15)}</h1>
          <motion.p className="xin-lede" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}>Models, agents and the cloud beneath them — one account, one key, one bill.</motion.p>
          <motion.div className="xin-acts" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.5 }}>
            <motion.span className="x-go" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}><a href="mailto:ir@hanzo.ai" className="x-btn solid" data-thumb="Contact investor relations">Contact investor relations</a></motion.span>
            <motion.span className="x-go" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}><a href="#research" className="x-btn">See the research</a></motion.span>
          </motion.div>
        </div>
        <motion.div className="xin-term" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: EASE, delay: 0.25 }}>
          <div className="xin-term-h"><i /><i /><i /><span className="x-mono">Hanzo.Thesis</span><span className="xin-term-s x-mono">one platform</span></div>
          <ol className="xin-thesis">
            {THESIS.map(([t, d], i) => (
              <motion.li key={t} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease: EASE, delay: 0.7 + i * 0.25 }}>
                <span className="x-mono">{String(i + 1).padStart(2, '0')}</span><b>{t}</b><span>{d}</span>
              </motion.li>
            ))}
          </ol>
          <div className="xin-tape" aria-hidden="true">
            <div className="xin-tape-in">{[...TICK, ...TICK].map(([k, v], i) => <span key={i}><b>{v}</b>{k}<i>▲</i></span>)}</div>
          </div>
        </motion.div>
      </div>
      <div className="x-wrap xin-backed">
        <span className="xin-backed-k">Backed by</span>
        <ul>{BACKERS.map(([f, n, to]) => <li key={f}><A to={to}><img src={`/logos/partners/${f}.svg`} alt={n + ' logo'} /></A></li>)}</ul>
      </div>
    </section>
  );
}

const LAYERS = [['Frontier models', 'One API for intelligence, with measured accuracy, speed and cost.', '/models'], ['Agents that do the work', 'Coding agents and autonomous runs on the same account and tools.', '/dev'], ['A cloud they can own', 'Managed on Hanzo, in a customer cloud, or on their own hardware.', '/platform']];

function Stack() {
  return (
    <section className="x-sec xin-stack">
      <div className="x-wrap xin-stack-g">
        <SecHead title="One account for the whole AI stack." lede="The models people use, the agents that put them to work, and the infrastructure a company needs to run both. Each layer makes the next one more useful." />
        <ol className="xin-layers">
          {LAYERS.map(([t, d, to], i) => (
            <Rise as="li" key={t} delay={i * 0.1} y={24} style={{ '--i': i }}>
              <A to={to}>
                <span className="x-mono">{String(3 - i).padStart(2, '0')}</span>
                <b>{t}</b>
                <span className="xin-layer-d">{d}</span>
                <span className="xin-layer-go">Explore →</span>
              </A>
            </Rise>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------- the results room ---------- */
const LCB = [['Enso', 93.7], ['gpt-5.6-sol', 93.1], ['gpt-5.5', 91.4], ['opus-5.5', 80.0], ['fable-5.1', 80.0], ['fable-5', 78.3]];

function Research() {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.2 });
  return (
    <section className="x-sec xin-res" id="research" data-room="dark" ref={ref}>
      <div className="x-wrap">
        <SecHead dark title="The latest results, with every task." lede="Each result is read from research runs on public questions, the same for every model." />
        <div className="xin-grid">
          <A to="/benchmarks#decision-suite" className="xin-cell big">
            <span className="xin-cell-k x-mono">Research.DecisionSuite</span>
            <span className="xin-cell-m">Kai</span>
            <Flap value="16 of 16" className="xin-flap" />
            <b>Decision Suite tasks won by Kai</b>
            <span className="xin-cell-d">Each set on <span className="x-mono">Oct 15, 2026</span>, with its public data and the runs of both models.</span>
            <span className="xin-go">Each task and its runs →</span>
          </A>
          <div className="xin-cell wide">
            <span className="xin-cell-k x-mono">Research.LiveCodeBench</span>
            <span className="xin-cell-m">175 questions</span>
            <ul className="xin-bars">
              {LCB.map(([n, v], i) => (
                <li key={n} className={i ? '' : 'me'}>
                  <span>{n}</span>
                  <i><motion.b initial={{ scaleX: 0 }} animate={seen ? { scaleX: (v - 60) / 40 } : {}} transition={{ duration: 1.2, ease: EASE, delay: 0.2 + i * 0.08 }} /></i>
                  <b className="x-mono">{v.toFixed(1)}%</b>
                </li>
              ))}
            </ul>
            <p className="xin-cell-d">Enso as enso-bench measured it on 2026-07-19, beside each single model on the same questions. Each bar is a run&apos;s accuracy.</p>
            <p className="xin-cell-d">LiveCodeBench&apos;s recent problems: Enso <b className="x-mono">93.7%</b>, 164 of 175 right, against 93.1% for gpt-5.6-sol, the next model on the same questions.</p>
          </div>
          <A to="/enso" className="xin-cell">
            <span className="xin-cell-m">Enso Ultra</span>
            <b className="xin-num"><Count to={95.6} decimals={1} suffix="%" run={seen} /></b>
            <b>GPQA Diamond</b>
            <span className="xin-cell-d">152 of 159 new questions right, against 93.1% for the best single model on the same questions.</span>
          </A>
          <A to="/kai" className="xin-cell">
            <span className="xin-cell-m">Kai</span>
            <b className="xin-num"><Count to={0.8} decimals={1} suffix=" ms" run={seen} /></b>
            <b>One decision, served</b>
            <span className="xin-cell-d">Kai on GPU, each a p50: 0.3 ms cached, 0.4 ms through the runtime, 0.8 ms served over HTTP.</span>
          </A>
          <A to="/dev" className="xin-cell">
            <span className="xin-cell-m">Hanzo Dev</span>
            <b className="xin-num"><Count to={3.02} decimals={2} suffix="×" run={seen} /></b>
            <b>Faster on the same coding tasks</b>
            <span className="xin-cell-d">Over the 42 tasks both agents solved, 95% interval 2.06–4.36×.</span>
          </A>
          <A to="/zen#desks" className="xin-cell">
            <span className="xin-cell-m">Zen 6</span>
            <b className="xin-num">~<Count to={3665} run={seen} /></b>
            <b>Prompt tokens a second</b>
            <span className="xin-cell-d">On NVIDIA Grace-Blackwell, NVFP4 + Latent Sparse Attention (D-LSA). Measured by Hanzo, Nov 4, 2026.</span>
          </A>
        </div>
      </div>
    </section>
  );
}

/* ---------- built in public ---------- */
const H = ECO[0];
function Public() {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.2 });
  const cols = Math.ceil(H.heat.length / 7);
  return (
    <section className="x-sec xin-pub" ref={ref}>
      <div className="x-wrap">
        <SecHead title="Built in public. Shipping every day." lede="The cloud, the gateway, the agents and the runtime are developed in the open. This is the public commit record, not a marketing projection." />
        <ul className="xin-stats">
          {H.stats.map(([k, v, s], i) => (
            <li key={i}><A to={H.statTo[i]}><span>{k}</span><b className="x-mono"><Count to={parseInt(v.replace(/,/g, ''), 10)} run={seen} duration={1.6} delay={i * 0.06} /></b><small>{s}</small></A></li>
          ))}
        </ul>
        <div className="xin-pub-g">
          <figure className="xin-heat">
            <figcaption>Commits a day</figcaption>
            <div className="xin-heat-m" aria-hidden="true">{['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'].map((m, i) => <span key={i}>{m}</span>)}</div>
            <div className={'xin-heat-g' + (seen ? ' on' : '')} role="img" aria-label={H.heatLabel} style={{ '--cols': cols }}>
              {[...H.heat].map((c, i) => <i key={i} className={c === '.' ? 'x' : 'l' + c} style={{ '--d': Math.floor(i / 7) * 12 + 'ms' }} />)}
            </div>
            <div className="xin-heat-f"><span>Commits a day, from Nov 7, 2025 to Nov 6, 2026</span><span className="xin-leg">Less {[0, 1, 2, 3, 4].map((l) => <i key={l} className={'l' + l} />)} More</span></div>
          </figure>
          <div className="xin-commits">
            <h3>Latest commits</h3>
            <ol>
              {H.commits.map(([repo, msg, when, to]) => <li key={to}><A to={to}><span className="x-mono">{repo}</span><span>{msg}</span><small className="x-mono">{when} UTC</small></A></li>)}
            </ol>
            <p className="xin-read"><span>{H.read}</span><A to={H.readTo}>Read the source →</A></p>
          </div>
        </div>
      </div>
    </section>
  );
}

const BUILT = [['damon-motorcycles.svg', 'Damon Motorcycles', '/customers/damon-motorcycles'], ['kanoa.png', 'KANOA', '/customers/kanoa'], ['skully.png', 'SKULLY', '/customers#skully'], ['bellabeat.svg', 'Bellabeat', '/customers#bellabeat'], ['stoned.svg', 'STONED Audio', '/customers#stoned'], ['unikoin-gold.svg', 'Unikrn', '/customers#unikoin-gold'], ['arca.png', 'Arca', '/customers#arca'], ['casper-blockchain.svg', 'Casper Labs', '/customers#casper-blockchain'], ['trillerfest.png', 'Triller', '/customers#trillerfest'], ['cover-build.svg', 'Cover Build', '/customers#cover-build'], ['myle-tap.png', 'Myle Tap', '/customers#myle-tap'], ['keek-social.svg', 'Personas Social', '/customers#keek-social']];

function Built() {
  return (
    <section className="xin-built" aria-labelledby="xin-built-h">
      <div className="x-wrap"><h2 id="xin-built-h" className="xin-built-k">Products Hanzo built and launched</h2></div>
      <div className="xin-mq">
        <div className="xin-mq-in">
          {[0, 1].map((k) => (
            <ul key={k} aria-hidden={k === 1}>
              {BUILT.map(([f, n, to]) => <li key={f}><A to={to} tabIndex={k ? -1 : undefined}><img src={'/logos/customers/' + f} alt={n + ' logo'} loading="lazy" /></A></li>)}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}

function People() {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.4 });
  return (
    <section className="x-sec xin-people">
      <div className="x-wrap">
        <SecHead title="Operators building for the long term." lede="Executive leadership of Hanzo AI, Inc., with the corporate structure and governance stated plainly." />
        <div className="xin-people-g">
          <div className="xin-execs">
            {[['Antje Worring', 'CEO, Hanzo AI, Inc.', 'https://www.linkedin.com/in/antje-worring/', 'AW'], ['Zach Kelling', 'CTO, Hanzo AI, Inc.', 'https://www.linkedin.com/in/zeekay/', 'ZK']].map(([n, r, to, ini], i) => (
              <Rise key={n} delay={i * 0.1}>
                <A to={to} className="xin-exec"><span className="xin-ini" aria-hidden="true">{ini}</span><b>{n}</b><span>{r}</span><i aria-hidden="true">↗</i></A>
              </Rise>
            ))}
          </div>
          <div className="xin-struct" ref={ref}>
            <div className="xin-org" aria-hidden="true">
              <span className="xin-org-n">Hanzo Industries Inc.</span>
              <span className="xin-org-l"><motion.i initial={{ scaleY: 0 }} animate={seen ? { scaleY: 1 } : {}} transition={{ duration: 0.8, ease: EASE, delay: 0.2 }} /><b className="x-mono">51%</b></span>
              <span className="xin-org-n dark">Hanzo AI, Inc.</span>
            </div>
            <div className="xin-gov">
              <h3>Corporate structure</h3>
              <p>Investors invest in Hanzo Industries Inc., the holding company. It owns 51% of Hanzo AI, Inc., which holds the AI IP and the app.</p>
              <h3>Governance</h3>
              <p>Hanzo Industries Inc. is privately held and does not publish financial statements. Requests for information are answered case by case by investor relations.</p>
              <p className="xin-gov-l"><A to="/legal/terms">Legal</A><A to="/security">Security</A><A to="/press">Press</A></p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// the ticker's figures, each with the page that carries its runs
const CHECK = [['/benchmarks#decision-suite'], ['/enso'], ['/enso'], ['/kai'], ['/dev'], ['/zen#desks'], [H.readTo]].map(([to], i) => [...TICK[i], to]);
const SAVE = 'hz-investors-checked';

/* Check our work: a diligence list; what you opened stays ticked in this browser only. */
function Diligence() {
  const [done, setDone] = useState([]);
  useEffect(() => { try { setDone(JSON.parse(localStorage.getItem(SAVE)) || []); } catch { /* private window: start empty */ } }, []);
  const mark = (i, on = true) => setDone((d) => {
    const n = on ? [...new Set([...d, i])] : d.filter((x) => x !== i);
    try { localStorage.setItem(SAVE, JSON.stringify(n)); } catch { /* not stored; still ticked for this visit */ }
    return n;
  });
  return (
    <section className="x-sec xin-dd">
      <div className="x-wrap xin-dd-grid">
        <div className="xin-dd-h">
          <p className="x-kick">Check our work</p>
          <h2>Every figure, to its run</h2>
          <p className="xin-dd-n" aria-live="polite"><b>{done.length}</b> of {CHECK.length} checked</p>
          <i className="xin-dd-bar" aria-hidden="true"><b style={{ transform: `scaleX(${done.length / CHECK.length})` }} /></i>
        </div>
        <ol className="xin-dd-list">
          {CHECK.map(([k, v, to], i) => (
            <li key={k} className={done.includes(i) ? 'on' : ''}>
              <input type="checkbox" id={'xin-dd-' + i} checked={done.includes(i)} onChange={(e) => mark(i, e.target.checked)} />
              <label htmlFor={'xin-dd-' + i}><b className="x-mono">{v}</b><span>{k}</span></label>
              <A to={to} onClick={() => mark(i)}>Open the source →</A>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default function Investors() {
  return (
    <main className="xin">
      <Hero />
      <Stack />
      <Research />
      <Public />
      <Built />
      <People />
      <Diligence />
      <Band
        title="Build the future with us."
        lede="For investment enquiries, company information and requests beyond this page, write directly to our team."
        action="Book a call"
        to="https://cal.com/hanzo"
        note={<p className="x-band-note"><a href="mailto:ir@hanzo.ai">ir@hanzo.ai</a></p>}
      />
    </main>
  );
}
