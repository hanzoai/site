'use client';
// Persona: an ML engineer who needs a GPU by the hour.
// Goal: price a machine before it exists and see how renting works through the API.
// CTA: Try Hanzo (machines.hero, machines.close).
// Metric: signup_start (cta_click machines.hero)
// Signature: zoom-map
// Beyond: the dry-run quote for every size: an hour, a working day and a month before anything is created.
/* Machines (v2, archetype A Launch).
   V2: 8/10 Motion map: zoom-map — scroll zooms from a fleet of H100 racks into one card that fills the screen with its own spec sheet (tap-to-zoom on touch); the pinned renting chapters became a plain list and the sections enter five different ways.
   Order: hero (rack and quote) -> the zoom -> the other machines' specs -> uses -> how renting works -> ownership ->
   paste and ship -> close. Entrances (MachinesEnter.jsx), one each, no other reveal: glitch-in (hero), diagonal-wipe
   (zoom), snap-sections (uses), page-curl (renting), noise-dissolve (ownership).
   Kept: the rack wake-up, the rolling price and the gliding size pill (layoutId) in the hero; each size lights its
   cards, rewrites the request and rolls in its own quote from Hanzo's GPU price list (api.hanzo.ai, as live). Tiles tilt and
   run their diagram, rows fill, the 80 GB count (now on the zoomed card), the closing rack wakes card by card.
   Beyond: the dry-run quote itself - priced for an hour, a working day and a month before anything is created.
   Greys only: the card LED is a grey light. Every word, figure and link is Hanzo's. */
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'motion/react';
import { A, Cta } from '../../kit';
import { useLive } from './Frame';
import ShipPrompt from '../../v2/ShipPrompt';
import LivePause, { usePause } from '../../v2/LivePause';
import MachinesZoom from './MachinesZoom';
import HeroDither from '../HeroDither';
import { Glitch, Snap, Curl, Dissolve } from './MachinesEnter';
import '../../v2/v2scale.css';
import './Machines.css';

const EASE = [0.16, 1, 0.3, 1];

// [size label, cards lit]: Hanzo's three sizes. Each one's quote is hanzo.ai's own: the GPU price list it reads from
// api.hanzo.ai/v1/pricing (infrastructure.gpu), an hour, a working day (8 h) and all month (730 h), printed as it prints
// them. GPU0 is that list as read at build: the first paint, and what stays if the request fails.
const SIZES = [['1x H100', 1], ['2x H100', 2], ['4x H100', 4]];
const GPU0 = [{ gpu: '1x H100', price: 3.48, vram: '80 GB' }, { gpu: '2x H100', price: 6.96, vram: '160 GB' }, { gpu: '4x H100', price: 13.92, vram: '320 GB' }];
const usd = (v) => '$' + (v >= 100 ? Math.round(v).toLocaleString('en-US') : v.toFixed(2));
const quoteOf = (g) => [g.vram, usd(g.price), usd(g.price * 8), usd(g.price * 730)];
let GPU_REQ = null;
function useGpus() {
  const [list, setList] = useState(GPU0);
  useEffect(() => {
    let gone = false;
    GPU_REQ ||= fetch('https://api.hanzo.ai/v1/pricing').then((r) => r.json())
      .then((j) => ((j && j.infrastructure && j.infrastructure.gpu) || []).filter((g) => g && g.gpu && g.vram && Number.isFinite(+g.price)).map((g) => ({ ...g, price: +g.price })))
      .catch(() => { GPU_REQ = null; return []; });
    GPU_REQ.then((l) => { if (!gone && l.length) setList(l); });
    return () => { gone = true; };
  }, []);
  return list;
}

/* The size the hero last showed (chosen, or where the cycle stood when it left the screen): the close remembers it. */
let lastSize = 0;
const sizeSubs = new Set();
const setLastSize = (i) => { lastSize = i; sizeSubs.forEach((f) => f()); };
const subSize = (f) => { sizeSubs.add(f); return () => sizeSubs.delete(f); };
const useLastSize = () => useSyncExternalStore(subSize, () => lastSize, () => 0);

/* Steps through n states while live: the first change after `first` ms, then every `ms`; a choice stops it. */
function useCycle(n, first, ms, live) {
  const [at, setAt] = useState(0);
  const [mine, setMine] = useState(false);
  const ticks = useRef(0);
  useEffect(() => {
    if (!live || mine) return;
    const t = setTimeout(() => { ticks.current += 1; setAt((v) => (v + 1) % n); }, ticks.current ? ms : first);
    return () => clearTimeout(t);
  }, [at, live, mine, n, ms, first]);
  return [at, (i) => { setAt(i); setMine(true); }];
}

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
function Rack({ on, count = 4, className = '' }) {
  return (
    <div className={'mc-rack ' + className} aria-hidden="true">
      {Array.from({ length: count }, (_, i) => i).map((i) => (
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
  const [at, choose] = useCycle(3, 1200, 4000, live);
  const [label, cards] = SIZES[at];
  const gpus = useGpus();
  const [vram, hour, day, month] = quoteOf(gpus.find((g) => g.gpu === label) || GPU0[at]);
  useEffect(() => { setLastSize(at); }, [at]);
  // each size's quote rolls in as its cards wake
  const t = String(at);
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
            <button key={s} type="button" role="tab" aria-selected={at === i} onClick={() => choose(i)}>
              {at === i && <motion.span layoutId="mc-size" className="mc-size-bg" transition={{ duration: 0.3, ease: EASE }} />}
              <span>{s}</span>
            </button>
          ))}
        </div>
        <pre className="mc-body"><code>{'{ "gpu": '}<b>{'"' + label + '"'}</b>{', "dryRun": true }'}</code></pre>
        <div className="mc-quote">
          <p className="mc-hour"><Roll v={hour} k={'h' + t} /><span>/ h</span></p>
          <p className="mc-vram"><Roll v={vram} k={'v' + t} /></p>
          <dl>
            <div><dt>an hour</dt><dd><Roll v={hour} k={'h2' + t} /></dd></div>
            <div><dt>a working day</dt><dd><Roll v={day} k={'d' + t} /></dd></div>
            <div><dt>all month</dt><dd><Roll v={month} k={'m' + t} /></dd></div>
          </dl>
          <p className="mc-rate">On demand, at the price list’s rate as it stands.</p>
        </div>
        {/* every size's quote stays in the page, whichever one is showing */}
        <table className="x-sr"><tbody>{SIZES.map(([s], i) => {
          const [v, h, d, m] = quoteOf(gpus.find((g) => g.gpu === s) || GPU0[i]);
          return <tr key={s}><td>{s}</td><td>{v}</td><td>{h} / h</td><td>{d}</td><td>{m}</td></tr>;
        })}</tbody></table>
      </div>
    </div>
  );
}

const SPECS = [
  ['AMD EPYC 7763', 'High-core count CPU instances', [['Cores', '64 Cores'], ['Threads', '128 Threads'], ['Memory', 'Up to 2TB']]],
  ['Storage Options', 'Ultra-fast NVMe and persistent storage', [['Local NVMe', 'Up to 8TB'], ['Network Storage', 'Unlimited'], ['I/O Performance', '7GB/s']]],
];

/* The other machines, beside the zoom's H100: two hairline lists, side by side. */
function Specs() {
  return (
    <section className="mc-specs">
      <div className="v2-wrap mc-specs-in">
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

/* How renting one works: a plain numbered list (it was a pinned chapter scene). The section enters by page-curl. */
function Steps() {
  return (
    <Curl className="v2-sec mc-steps">
      <div className="v2-wrap mc-steps-in">
        <div className="mc-steps-h">
          <h2 className="v2-headline">How renting one works</h2>
          <p className="mc-ch-l">Every step is an API call, so anything you do once by hand you can put in a script afterwards</p>
        </div>
        <ol className="mc-steps-l">
          {STEPS.map(([t, d], i) => (
            <li key={t} className="mc-own-i mc-step">
              <span className="mc-own-n">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="v2-title">{t}</h3>
              <p className="v2-body">{d}</p>
            </li>
          ))}
        </ol>
      </div>
    </Curl>
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
  // a queue per card, plus the shared lane (labels are Hanzo's: the card's name and "any-GPU")
  if (i === 2) return <div className="mc-art a2">{['H100', 'H100', 'any-GPU'].map((l, k) => <p key={k}><em>{l}</em><i /><i /><i /></p>)}</div>;
  return <div className="mc-art a3"><b>agent</b><i /><b>machine</b></div>;
}

/* A use tile on the rail: its diagram runs when it is the tile in focus (and again on hover), and it tilts up to 2.5°
   under a mouse. A tile out of focus sits back; a click brings it in. */
const Tile = ({ i, t, d, pts, on, setRef, onPick }) => {
  const tilt = (e) => {
    if (e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--ry', (((e.clientX - r.left) / r.width - 0.5) * 5).toFixed(2) + 'deg');
    e.currentTarget.style.setProperty('--rx', ((0.5 - (e.clientY - r.top) / r.height) * 5).toFixed(2) + 'deg');
  };
  const flat = (e) => { e.currentTarget.style.setProperty('--rx', '0deg'); e.currentTarget.style.setProperty('--ry', '0deg'); };
  return (
    <article ref={setRef} data-i={i} className={'mc-tile t' + i} data-on={on ? '' : undefined} onPointerMove={tilt} onPointerLeave={flat} onClick={on ? undefined : onPick}>
      <div className="mc-tile-art" aria-hidden="true"><UseArt i={i} /></div>
      <div className="mc-tile-txt">
        <h3 className="v2-title">{t}</h3>
        <p className="mc-tile-d">{d}</p>
        <ul>{pts.map((p) => <li key={p}>{p}</li>)}</ul>
      </div>
    </article>
  );
};

const arrowL = <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const arrowR = <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;

/* When you want a whole machine: one tile in focus at a time, on a snap rail with the next one peeking. */
function Uses() {
  const rail = useRef(null);
  const tiles = useRef([]);
  const [at, setAt] = useState(0);
  useEffect(() => {
    const r = rail.current;
    if (!r) return;
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setAt(+e.target.dataset.i)), { root: r, threshold: 0.75 });
    tiles.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);
  const go = (i) => {
    const r = rail.current, el = tiles.current[i];
    if (!r || !el) return;
    setAt(i);
    r.scrollTo({ left: el.offsetLeft, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  };
  const n = USES.length;
  return (
    <Snap className="v2-sec mc-uses">
      <div className="v2-wrap mc-snap-in">
        <div className="v2-grid mc-uses-h">
          <h2 className="v2-headline">When you want a whole machine</h2>
          <p className="v2-lede">Reach for one when the work outlasts a request, or needs a card of its own</p>
        </div>
        <div className="mc-rail" ref={rail} tabIndex={0} role="region" aria-label="When you want a whole machine">
          {USES.map(([t, d, pts], i) => <Tile key={t} i={i} t={t} d={d} pts={pts} on={i === at} setRef={(el) => (tiles.current[i] = el)} onPick={() => go(i)} />)}
        </div>
        <div className="mc-rail-nav">
          <span className="mc-rail-n" aria-hidden="true">{String(at + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}</span>
          <span className="mc-rail-bar" aria-hidden="true"><i style={{ transform: `translateX(${at * 100}%)`, width: 100 / n + '%' }} /></span>
          <button type="button" aria-label="Previous" disabled={at === 0} onClick={() => go(at - 1)}>{arrowL}</button>
          <button type="button" aria-label="Next" disabled={at === n - 1} onClick={() => go(at + 1)}>{arrowR}</button>
        </div>
      </div>
    </Snap>
  );
}

/* Whose machine it is: the three rows drive one small diagram of org, accounts and region. The focused (or hovered)
   row lights its part; untouched, it walks the three while it is on screen. Labels are Hanzo's words from the rows. */
function OwnMap({ at }) {
  return (
    <div className="mc-map" data-at={at} aria-hidden="true">
      <div className="mc-map-accts g1">{['DigitalOcean', 'AWS', 'GCP'].map((a) => <span key={a}>{a}</span>)}</div>
      <div className="mc-map-links g1"><i /><i /><i /></div>
      <div className="mc-map-org g0">
        <em>org</em>
        <div className="mc-map-ms">{[0, 1, 2].map((k) => <b key={k} style={{ '--k': k }}>machine</b>)}</div>
      </div>
      <div className="mc-map-reg g2">
        <em>region</em>
        <span className="mc-map-dots">{[0, 1, 2, 3, 4].map((k) => <i key={k} className={k === 2 ? 'pick' : ''} />)}</span>
      </div>
    </div>
  );
}

function Own() {
  const [ref, live] = useLive(0.4);
  const [auto, pick] = useCycle(OWN.length, 1200, 3600, live);
  const [hov, setHov] = useState(null);
  const at = hov ?? auto;
  return (
    <Dissolve className="v2-sec mc-own">
      <div className="v2-wrap">
        <div className="v2-grid mc-own-h">
          <h2 className="v2-headline">Whose machine it is</h2>
          <p className="v2-lede">Ownership, region and account are decisions the API makes you state</p>
        </div>
        <div className="mc-own-in" ref={ref}>
          <div className="mc-own-list" onPointerLeave={() => setHov(null)}>
            {OWN.map(([t, d], i) => (
              <div key={t} className="mc-own-i" tabIndex={0} data-on={i === at ? '' : undefined}
                onPointerEnter={() => { setHov(i); pick(i); }} onFocus={() => { setHov(i); pick(i); }} onBlur={() => setHov(null)} onClick={() => pick(i)}>
                <span className="mc-own-n">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="v2-title">{t}</h3>
                <p className="v2-body">{d}</p>
              </div>
            ))}
          </div>
          <OwnMap at={at} />
        </div>
      </div>
    </Dissolve>
  );
}

const OWN = [
  ['Scoped to your organization', 'A machine belongs to one org and is named within it. Every read and every terminate is checked against the org on your token, not against the id in the URL.'],
  ['Bring your own account', 'Link a DigitalOcean, AWS or GCP account and the clusters it holds fold into the same fleet. Your capacity, your contract, one place to see it.'],
  ['Pick the region deliberately', 'Launches name a region from the list the API returns, so where a workload runs is a decision you made rather than one that was made for you.'],
];

const Gh = () => <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" /></svg>;

/* The close: "Get Machines" beside the rack at rest, ending lit at the size the visitor last saw in the hero (chosen, or
   where the cycle stood), with that request beside it. Its cards wake one after another as it arrives. */
function Close() {
  const ref = useRef(null);
  const seen = useInView(ref, { amount: 0.5, once: true });
  const calm = useReducedMotion();
  const [up, setUp] = useState(false); // reduced motion is known only after mount: the server and first client frame match
  useEffect(() => setUp(true), []);
  const [label, cards] = SIZES[useLastSize()];
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
          <Rack on={seen || (up && calm) ? cards : 0} className="rest" />
          <pre className="mc-body mc-close-body" aria-hidden="true"><code>{'{ "gpu": '}<b><Roll v={'"' + label + '"'} k="c" /></b>{', "dryRun": true }'}</code></pre>
        </div>
      </div>
    </section>
  );
}

export default function Machines() {
  return (
    <main className="v2 mc">
      <Glitch as="section" className="mc-hero v2-dark" data-room="dark">
        <HeroDither />
        <div className="v2-wrap mc-hero-t">
          <h1 className="v2-display mc-h1 mc-gl-t" data-text="Hanzo Machines" data-morph-target="">Hanzo Machines</h1>
          <p className="v2-kick mc-cap">High-Performance Computing</p>
          <p className="v2-lede mc-sub mc-gl-t" data-text="Rent a machine by the hour, metered to your organization.">Rent a machine by the hour, metered to your organization.</p>
          <div className="v2-acts mc-acts">
            <Cta to="/login" id="machines.hero" thumb>Try Hanzo</Cta>
            <Cta to="https://docs.hanzo.ai" kind="link" id="machines.view-documentation">View Documentation</Cta>
          </div>
        </div>
        <div className="mc-lift">
          <Rent />
        </div>
      </Glitch>

      <MachinesZoom />

      <Specs />

      <Uses />

      <Steps />

      <Own />

      <ShipPrompt
        name="Machines"
        prompt="Read https://hanzo.ai/skill.md and use Hanzo Machines in my project. Start with: hanzo visor machines list"
        related={[['GPUs', '/cloud/gpus', 'On-demand accelerators'], ['Containers', '/cloud/containers'], ['Functions', '/functions', 'Serverless handlers']]}
        className="mc-ship"
        flip
      >
        {/* Hanzo prints the endpoint as one plain line ("api /v1/compute/machines"), so it is one line here too */}
        <p className="mc-api">api /v1/compute/machines</p>
      </ShipPrompt>

      <Close />
    </main>
  );
}
