'use client';
// Persona: an ML engineer who needs a GPU by the hour.
// Goal: price a machine before it exists and see how renting works through the API.
// CTA: Try Hanzo (machines.hero, machines.close).
// Metric: signup_start (cta_click machines.hero)
// Signature: priced before it exists: H100 cards wake as the dry-run quote rolls in.
// Beyond: the dry-run quote for every size: an hour, a working day and a month before anything is created.
/* Machines (v2, archetype A Launch).
   V2: 8/10 Round 2: the spec wall is one H100 moment (80GB HBM3 counts up once as its card lights) beside a hairline
   list; one solid ask in the hero (docs is a text link) and the price sits above the fold at 1470x801; the renting
   console is one object whose request and answer stream in, in the step's own words (no invented labels, no
   traffic-light dots) and the step text cuts instead of crossfading; tiles tilt and run their diagram on hover, rows
   fill; headings rest at 26/21; section breaks alternate; the close is the rack waking at rest, not the shared contours.
   Signature: priced before it exists. A rack of H100 cards sits in the dark; choose 1, 2 or 4 (or let it choose) and
   that many cards wake, the dryRun request rewrites itself and the quote rolls in at the price list's rate.
   Supporting: kinetic title lines; the rack settles on scroll (Lift); the six steps as pinned chapters
   (PinChapters) whose one console streams what each call answers; the size pill glides (layoutId).
   Beyond: the dry-run quote itself - every size priced for an hour, a working day and a month before anything is
   created, exactly what the API's dryRun answers.
   Greys only: the card LED is a grey light. Every word, figure and link is Hanzo's. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion, animate } from 'motion/react';
import { A, Cta } from '../../kit';
import { useLive, useSteps } from './Frame';
import { Lines, Lift } from '../../v2/LiftStage';
import PinChapters from '../../v2/x-hypatia/PinChapters';
import ShipPrompt from '../../v2/ShipPrompt';
import LivePause, { usePause } from '../../v2/LivePause';
import '../../v2/v2scale.css';
import './Machines.css';

const EASE = [0.16, 1, 0.3, 1];

// [label, cards, VRAM, an hour, a working day, all month]. The 1x row is the live page's dry-run quote; the 2x and 4x
// rows are what the live quote shows for those sizes (the 1x rate times the cards: cents kept on the hour and the
// day, whole dollars on the month). Copy question on docs/coverage/machines.md.
const SIZES = [
  ['1x H100', 1, '80 GB', '$3.48', '$27.84', '$2,540'],
  ['2x H100', 2, '160 GB', '$6.96', '$55.68', '$5,081'],
  ['4x H100', 4, '320 GB', '$13.92', '$111.36', '$10,162'],
];

function Roll({ v, k }) {
  return (
    <span className="mc-roll">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span key={k + v} initial={{ y: '100%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '-100%', opacity: 0 }} transition={{ duration: 0.3, ease: EASE }}>{v}</motion.span>
      </AnimatePresence>
    </span>
  );
}

/* The rack of four H100 cards; `on` of them are lit (each wakes 90 ms after the one above). */
function Rack({ on, className = '' }) {
  return (
    <div className={'mc-rack ' + className} aria-hidden="true">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className={'mc-card' + (i < on ? ' on' : '')} style={{ '--i': i }}>
          <span className="mc-card-n">H100</span>
          <span className="mc-fins">{Array.from({ length: 14 }).map((_, k) => <i key={k} />)}</span>
          <span className="mc-led" />
        </div>
      ))}
    </div>
  );
}

/* The rack and the quote: choose a size and that many cards wake while the dry-run quote rolls in. */
function Rent() {
  const [ref, seen] = useLive(0.3);
  const [paused, togglePause] = usePause();
  const live = seen && !paused;
  const [at, choose] = useSteps(3, 4000, live);
  const [tap, setTap] = useState(0);
  const [label, cards, vram, hour, day, month] = SIZES[at];
  const t = String(tap);
  return (
    <div className="mc-rent" ref={ref}>
      <Rack on={cards} />
      <div className="mc-req">
        <div className="mc-req-bar">
          <span className="mc-verb">POST /v1/compute/machines</span>
          <span className="mc-dry">dryRun</span>
          <LivePause paused={paused} onToggle={togglePause} inline dark className="mc-pause" />
        </div>
        <div className="mc-sizes" role="tablist" aria-label="Machine size">
          {SIZES.map(([s], i) => (
            <button key={s} type="button" role="tab" aria-selected={at === i} onClick={() => { choose(i); setTap((n) => n + 1); }}>
              {at === i && <motion.span layoutId="mc-size" className="mc-size-bg" transition={{ duration: 0.3, ease: EASE }} />}
              <span>{s}</span>
            </button>
          ))}
        </div>
        <pre className="mc-body"><code>{'{ "gpu": '}<b>{'"' + label + '"'}</b>{', "dryRun": true }'}</code></pre>
        <div className="mc-quote" aria-live="polite">
          <p className="mc-hour"><Roll v={hour} k={'h' + t} /><span>/ h</span></p>
          <p className="mc-vram"><Roll v={vram} k={'v' + t} /></p>
          <dl>
            <div><dt>an hour</dt><dd><Roll v={hour} k={'h2' + t} /></dd></div>
            <div><dt>a working day</dt><dd><Roll v={day} k={'d' + t} /></dd></div>
            <div><dt>all month</dt><dd><Roll v={month} k={'m' + t} /></dd></div>
          </dl>
          <p className="mc-rate">On demand, at the price list’s rate as it stands.</p>
        </div>
        {/* every size's quote stays in the page */}
        <table className="x-sr"><tbody>{SIZES.map((s) => <tr key={s[0]}><td>{s[0]}</td><td>{s[2]}</td><td>{s[3]} / h</td><td>{s[4]}</td><td>{s[5]}</td></tr>)}</tbody></table>
      </div>
    </div>
  );
}

const H100 = [['Cores', '16,896 CUDA'], ['Tensor Cores', '528 TCs']];
const SPECS = [
  ['AMD EPYC 7763', 'High-core count CPU instances', [['Cores', '64 Cores'], ['Threads', '128 Threads'], ['Memory', 'Up to 2TB']]],
  ['Storage Options', 'Ultra-fast NVMe and persistent storage', [['Local NVMe', 'Up to 8TB'], ['Network Storage', 'Unlimited'], ['I/O Performance', '7GB/s']]],
];

/* One big figure: the H100 card lights and its 80 GB counts up once, beside a hairline list of the rest. */
function Specs() {
  const ref = useRef(null);
  const seen = useInView(ref, { amount: 0.45, once: true });
  const calm = useReducedMotion();
  const [n, setN] = useState(80);
  const armed = useRef(false);
  useEffect(() => {
    // only count when the figure arrives from below; a deep link or reduced motion keeps the true value
    if (calm || !ref.current || ref.current.getBoundingClientRect().top < innerHeight) return;
    armed.current = true;
    setN(0);
  }, [calm]);
  useEffect(() => {
    if (!seen || !armed.current) return;
    const c = animate(0, 80, { duration: 1.1, ease: EASE, delay: 0.25, onUpdate: (v) => setN(Math.round(v)) });
    return () => c.stop();
  }, [seen]);
  const lit = seen || calm;
  return (
    <section className="mc-specs">
      <div className="v2-wrap mc-specs-in">
        <div className="mc-specs-h" ref={ref}>
          <h2 className="v2-headline">NVIDIA H100</h2>
          <p className="mc-specs-d">Dedicated GPU instances for AI/ML training</p>
          <div className={'mc-card solo' + (lit ? ' on' : '')} aria-hidden="true" style={{ '--i': 0 }}>
            <span className="mc-card-n">H100</span>
            <span className="mc-fins">{Array.from({ length: 14 }).map((_, k) => <i key={k} />)}</span>
            <span className="mc-led" />
          </div>
          <dl className="mc-moment">
            <div><dt>VRAM</dt><dd><span className="mc-cnt">{n}</span>GB HBM3</dd></div>
          </dl>
          <dl className="mc-rows">
            {H100.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
          </dl>
        </div>
        <div className="mc-specs-list">
          {SPECS.map(([t, d, rows]) => (
            <div key={t} className="mc-group">
              <h3 className="v2-title">{t}</h3>
              <p className="mc-group-d">{d}</p>
              <dl className="mc-rows">{rows.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const STEPS = [
  ['Ask what exists', 'The sizes and regions you can launch into are an endpoint, not a page in the docs. Read them, then pick one — nothing to keep in sync by hand.'],
  ['Price it before you buy it', 'A launch with dryRun returns the price and creates nothing. The same call without it creates the machine, so what you were quoted is what you asked for.'],
  ['Metered to the organization', "Time is debited from your org's prepaid balance while a machine is up. Before it launches, the cloud says whether you may — and what is missing if you may not."],
  ['One list, whoever owns them', 'Rented machines, the droplets and cluster workers behind them, and your own hardware that dialed in with hanzo link all appear as one fleet, deduplicated.'],
  ['A row per accelerator', 'The GPU view counts real cards: from the size of the nodes you rented, and from what your own workers report through nvidia-smi. Where there is no inventory, it returns nothing rather than inventing something.'],
  ['A machine can carry an agent', 'Bind a cloud agent to a machine and the pair is one thing to launch, message, stop and tear down. Unbinding is separate, so the agent can move without the machine going with it.'],
];

/* One console for all six steps: what is asked, then what comes back, streamed line by line. Every fragment is
   quoted from that step's own text (or the hero's request), so nothing here is new copy. */
const CALLS = [
  ['The sizes and regions you can launch into', ['1x H100', '2x H100', '4x H100']],
  ['{ "gpu": "1x H100", "dryRun": true }', ['$3.48 / h', 'returns the price and creates nothing']],
  ['Before it launches', ['whether you may', 'what is missing if you may not', "Time is debited from your org's prepaid balance"]],
  ['Rented machines', ['the droplets and cluster workers behind them', 'your own hardware that dialed in with hanzo link', 'one fleet, deduplicated']],
  ['The GPU view counts real cards', ['the size of the nodes you rented', 'what your own workers report through nvidia-smi', 'returns nothing rather than inventing something']],
  ['Bind a cloud agent to a machine', ['launch, message, stop and tear down', 'Unbinding is separate']],
];

function StepCon({ at }) {
  const [ask, back] = CALLS[at];
  return (
    <div className="mc-con v2-obj" aria-hidden="true">
      <div className="mc-con-bar"><span>/v1/compute/machines</span><b>{String(at + 1).padStart(2, '0')} / 06</b></div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={at} className="mc-con-body" initial="in" animate="on" exit={{ opacity: 0, transition: { duration: 0.15 } }}>
          <motion.p className="mc-con-ask" variants={{ in: { y: '105%' }, on: { y: 0, transition: { duration: 0.5, ease: EASE } } }}><span>{ask}</span></motion.p>
          <ul className="mc-con-back">
            {back.map((b, j) => (
              <li key={b} className={j === back.length - 1 ? 'last' : ''}>
                <motion.span variants={{ in: { y: '105%' }, on: { y: 0, transition: { duration: 0.5, ease: EASE, delay: 0.3 + j * 0.12 } } }}>{b}</motion.span>
              </li>
            ))}
          </ul>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

const USES = [
  ['Training runs', 'A job that needs cards for hours and nothing for the rest of the week.', ['GPU sizes named from the list the API returns', 'GPU-hours metered while the job runs', 'Cancel and the hours used so far are billed, then the job stops']],
  ['Serving a model', 'A machine that stays up because something is calling it.', ['Run Hanzo Engine on a card you rented', 'Terminate it when the traffic goes away', 'The bill follows the machine, not a reservation']],
  ['Work that will not fit in a request', 'Renders, batches and simulations that take longer than an HTTP call.', ['A queue per GPU, plus a shared any-GPU lane', 'Each item says which node claimed it', 'Read the queue instead of guessing where a job went']],
  ['Agents that need a computer', 'An agent with a machine under it, launched and torn down as one thing.', ['Bind a cloud agent to a machine', 'Message it, or stop it, by name', 'Tearing down the pair unbinds the agent first']],
];

function UseArt({ i }) {
  if (i === 0) return <div className="mc-art a0">{Array.from({ length: 7 }).map((_, k) => <i key={k} className={k < 3 ? 'on' : ''} style={{ '--k': k }} />)}</div>;
  if (i === 1) return <div className="mc-art a1">{Array.from({ length: 24 }).map((_, k) => <i key={k} style={{ height: 30 + ((k * 37) % 60) + '%', '--k': k }} />)}</div>;
  if (i === 2) return <div className="mc-art a2">{['GPU 0', 'GPU 1', 'any GPU'].map((l) => <p key={l}><em>{l}</em><i /><i /><i /></p>)}</div>;
  return <div className="mc-art a3"><b>agent</b><i /><b>machine</b></div>;
}

/* A use tile: its diagram runs on hover (or once it is on screen, on touch), and it tilts up to 2.5° under a mouse. */
function Tile({ i, t, d, pts }) {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.6 });
  const tilt = (e) => {
    if (e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--ry', (((e.clientX - r.left) / r.width - 0.5) * 5).toFixed(2) + 'deg');
    e.currentTarget.style.setProperty('--rx', ((0.5 - (e.clientY - r.top) / r.height) * 5).toFixed(2) + 'deg');
  };
  const flat = (e) => { e.currentTarget.style.setProperty('--rx', '0deg'); e.currentTarget.style.setProperty('--ry', '0deg'); };
  return (
    <article ref={ref} className={'mc-tile t' + i} data-run={inView ? '' : undefined} onPointerMove={tilt} onPointerLeave={flat}>
      <div className="mc-tile-art" aria-hidden="true"><UseArt i={i} /></div>
      <h3 className="v2-title">{t}</h3>
      <p className="mc-tile-d">{d}</p>
      <ul>{pts.map((p) => <li key={p}>{p}</li>)}</ul>
    </article>
  );
}

const OWN = [
  ['Scoped to your organization', 'A machine belongs to one org and is named within it. Every read and every terminate is checked against the org on your token, not against the id in the URL.'],
  ['Bring your own account', 'Link a DigitalOcean, AWS or GCP account and the clusters it holds fold into the same fleet. Your capacity, your contract, one place to see it.'],
  ['Pick the region deliberately', 'Launches name a region from the list the API returns, so where a workload runs is a decision you made rather than one that was made for you.'],
];

const Gh = () => <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" /></svg>;

/* The close: "Get Machines" beside the rack at rest; its four cards wake one after another as it arrives. */
function Close() {
  const ref = useRef(null);
  const seen = useInView(ref, { amount: 0.5, once: true });
  const calm = useReducedMotion();
  return (
    <section className="mc-close">
      <div className="v2-wrap mc-close-in">
        <div className="mc-close-copy">
          <h2 className="v2-headline mc-close-h">Get Machines</h2>
          <p className="v2-lede mc-close-tag">Long-running compute machines</p>
          <div className="mc-close-meta">
            <span className="mc-chip"><span>License:</span> Apache-2.0</span>
            <A to="https://github.com/hanzoai" className="mc-chip"><Gh />hanzoai</A>
          </div>
          <div className="mc-close-acts">
            <Cta to="/login" id="machines.close" size="lg">Try Hanzo</Cta>
            <Cta to="https://platform.hanzo.ai/deploy" kind="link" id="machines.deploy">Deploy to Cloud</Cta>
          </div>
        </div>
        <div className="mc-close-art" ref={ref}>
          <Rack on={seen || calm ? 4 : 0} className="rest" />
        </div>
      </div>
    </section>
  );
}

export default function Machines() {
  return (
    <main className="v2 mc">
      <section className="mc-hero v2-dark" data-room="dark">
        <div className="v2-wrap mc-hero-t">
          <Lines as="h1" className="v2-display mc-h1" lines={['Hanzo Machines']} data-morph-target="" />
          <p className="v2-kick mc-cap">High-Performance Computing</p>
          <p className="v2-lede mc-sub v2-in" style={{ animationDelay: '.3s' }}>Rent a machine by the hour, metered to your organization.</p>
          <div className="v2-acts mc-acts">
            <Cta to="/login" id="machines.hero" thumb>Try Hanzo</Cta>
            <Cta to="https://docs.hanzo.ai" kind="link" id="machines.view-documentation">View Documentation</Cta>
          </div>
        </div>
        <Lift className="mc-lift" from={1.04} y={24} origin="50% 0%" offset={['start end', 'start 0.2']}>
          <Rent />
        </Lift>
      </section>

      <Specs />

      <PinChapters
        className="mc-ch"
        label="How renting one works"
        items={STEPS}
        look="left"
        head={<div className="mc-ch-h"><h2 className="v2-headline">How renting one works</h2><p className="mc-ch-l">Every step is an API call, so anything you do once by hand you can put in a script afterwards</p></div>}
        visual={(at) => <StepCon at={at} />}
      />

      <section className="v2-sec mc-uses">
        <div className="v2-wrap">
          <div className="v2-grid mc-uses-h">
            <h2 className="v2-headline">When you want a whole machine</h2>
            <p className="v2-lede">Reach for one when the work outlasts a request, or needs a card of its own</p>
          </div>
          <div className="mc-tiles">
            {USES.map(([t, d, pts], i) => <Tile key={t} i={i} t={t} d={d} pts={pts} />)}
          </div>
        </div>
      </section>

      <section className="v2-sec mc-own">
        <div className="v2-wrap">
          <div className="v2-grid mc-own-h">
            <h2 className="v2-headline">Whose machine it is</h2>
            <p className="v2-lede">Ownership, region and account are decisions the API makes you state</p>
          </div>
          <div className="mc-own-list">
            {OWN.map(([t, d], i) => (
              <div key={t} className="mc-own-i">
                <span className="mc-own-n">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="v2-title">{t}</h3>
                <p className="v2-body">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ShipPrompt
        name="Machines"
        api="/v1/compute/machines"
        prompt="Read https://hanzo.ai/skill.md and use Hanzo Machines in my project. Start with: hanzo visor machines list"
        related={[['GPUs', '/cloud/gpus', 'On-demand accelerators'], ['Containers', '/cloud/containers'], ['Functions', '/functions', 'Serverless handlers']]}
        className="mc-ship"
        flip
      />

      <Close />
    </main>
  );
}
