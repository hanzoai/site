'use client';
/* Machines (v2, archetype A Launch).
   V2: 8/10 A black product-shot hero where H100 cards wake in a rack as the dry-run quote rolls in huge (the hour, the working day, the month); an Apple-style tech-spec sheet; the six renting steps as pinned chapters over one API console; four reasons as a tile grid.
   Signature: priced before it exists. A rack of H100 cards sits in the dark; choose 1, 2 or 4 (or let it choose) and
   that many cards wake, the dryRun request rewrites itself and the quote rolls in at the price list's rate.
   Supporting: kinetic title lines; the rack settles from huge on scroll (Stage); the six steps as pinned chapters
   (PinChapters) whose console shows what each call returns, in the step's own words.
   Beyond: the dry-run quote itself - every size priced for an hour, a working day and a month before anything is
   created, exactly what the API's dryRun answers.
   Accent: green, from the card LED. Every word, figure and link is Hanzo's. */
import { motion, AnimatePresence } from 'motion/react';
import { A } from '../../kit';
import { useLive, useSteps } from './Frame';
import { Lines, Lift } from '../../v2/LiftStage';
import PinChapters from '../../v2/PinChapters';
import ShipPrompt from '../../v2/ShipPrompt';
import GetIt from '../../v2/GetIt';
import '../../v2/v2scale.css';
import './Machines.css';

const EASE = [0.16, 1, 0.3, 1];

// [label, cards, VRAM, an hour, a working day, all month]: the live page's dry-run quote for each size
const SIZES = [
  ['1x H100', 1, '80 GB', '$3.48', '$27.84', '$2,540'],
  ['2x H100', 2, '160 GB', '$6.96', '$55.68', '$5,081'],
  ['4x H100', 4, '320 GB', '$13.92', '$111', '$10,162'],
];

function Roll({ v, k }) {
  return (
    <span className="mc-roll">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span key={k + v} initial={{ y: '100%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '-100%', opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>{v}</motion.span>
      </AnimatePresence>
    </span>
  );
}

/* The rack and the quote: choose a size and that many cards wake while the dry-run quote rolls in. */
function Rent() {
  const [ref, live] = useLive(0.3);
  const [at, choose] = useSteps(3, 4000, live);
  const [label, cards, vram, hour, day, month] = SIZES[at];
  return (
    <div className="mc-rent" ref={ref}>
      <div className="mc-rack" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={'mc-card' + (i < cards ? ' on' : '')} style={{ '--i': i }}>
            <span className="mc-card-n">H100</span>
            <span className="mc-fins">{Array.from({ length: 14 }).map((_, k) => <i key={k} />)}</span>
            <span className="mc-led" />
          </div>
        ))}
      </div>
      <div className="mc-req">
        <div className="mc-req-bar">
          <span className="mc-verb">POST /v1/compute/machines</span>
          <span className="mc-dry">dryRun</span>
        </div>
        <div className="mc-sizes" role="tablist" aria-label="Machine size">
          {SIZES.map(([s], i) => (
            <button key={s} type="button" role="tab" aria-selected={at === i} onClick={() => choose(i)}>
              {at === i && <motion.span layoutId="mc-size" className="mc-size-bg" transition={{ type: 'spring', stiffness: 300, damping: 30 }} />}
              <span>{s}</span>
            </button>
          ))}
        </div>
        <pre className="mc-body"><code>{'{ "gpu": '}<b>{'"' + label + '"'}</b>{', "dryRun": true }'}</code></pre>
        <div className="mc-quote" aria-live="polite">
          <p className="mc-hour"><Roll v={hour} k="h" /><span>/ h</span></p>
          <p className="mc-vram"><Roll v={vram} k="v" /></p>
          <dl>
            <div><dt>an hour</dt><dd><Roll v={hour} k="h2" /></dd></div>
            <div><dt>a working day</dt><dd><Roll v={day} k="d" /></dd></div>
            <div><dt>all month</dt><dd><Roll v={month} k="m" /></dd></div>
          </dl>
          <p className="mc-rate">On demand, at the price list’s rate as it stands.</p>
        </div>
        {/* every size's quote stays in the page */}
        <table className="x-sr"><tbody>{SIZES.map((s) => <tr key={s[0]}><td>{s[0]}</td><td>{s[2]}</td><td>{s[3]} / h</td><td>{s[4]}</td><td>{s[5]}</td></tr>)}</tbody></table>
      </div>
    </div>
  );
}

const SPECS = [
  ['NVIDIA H100', 'Dedicated GPU instances for AI/ML training', [['VRAM', '80GB HBM3'], ['Cores', '16,896 CUDA'], ['Tensor Cores', '528 TCs']]],
  ['AMD EPYC 7763', 'High-core count CPU instances', [['Cores', '64 Cores'], ['Threads', '128 Threads'], ['Memory', 'Up to 2TB']]],
  ['Storage Options', 'Ultra-fast NVMe and persistent storage', [['Local NVMe', 'Up to 8TB'], ['Network Storage', 'Unlimited'], ['I/O Performance', '7GB/s']]],
];

const STEPS = [
  ['Ask what exists', 'The sizes and regions you can launch into are an endpoint, not a page in the docs. Read them, then pick one — nothing to keep in sync by hand.'],
  ['Price it before you buy it', 'A launch with dryRun returns the price and creates nothing. The same call without it creates the machine, so what you were quoted is what you asked for.'],
  ['Metered to the organization', "Time is debited from your org's prepaid balance while a machine is up. Before it launches, the cloud says whether you may — and what is missing if you may not."],
  ['One list, whoever owns them', 'Rented machines, the droplets and cluster workers behind them, and your own hardware that dialed in with hanzo link all appear as one fleet, deduplicated.'],
  ['A row per accelerator', 'The GPU view counts real cards: from the size of the nodes you rented, and from what your own workers report through nvidia-smi. Where there is no inventory, it returns nothing rather than inventing something.'],
  ['A machine can carry an agent', 'Bind a cloud agent to a machine and the pair is one thing to launch, message, stop and tear down. Unbinding is separate, so the agent can move without the machine going with it.'],
];

/* The console for each step: what the call gives back, in the step's own words. */
function StepCon({ at }) {
  const rows = [
    [['sizes', '1x H100 · 2x H100 · 4x H100'], ['regions', 'the list the API returns']],
    [['{ "gpu": "1x H100", "dryRun": true }', ''], ['$3.48 / h', 'creates nothing']],
    [["org's prepaid balance", 'debited while up'], ['may you launch?', 'and what is missing']],
    [['rented machines', 'fleet'], ['droplets and cluster workers', 'fleet'], ['your own hardware · hanzo link', 'fleet'], ['one fleet', 'deduplicated']],
    [['nodes you rented', 'a row per card'], ['nvidia-smi', 'a row per card'], ['no inventory', 'nothing']],
    [['agent + machine', 'launch · message · stop · tear down'], ['unbind', 'separate']],
  ][at];
  return (
    <div className="mc-con v2-obj" aria-hidden="true">
      <div className="mc-con-bar"><span className="mc-dots"><i /><i /><i /></span><span>/v1/compute/machines</span><b>{String(at + 1).padStart(2, '0')}</b></div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.ul key={at} className="mc-con-rows" initial="in" animate="on" exit={{ opacity: 0, transition: { duration: 0.15 } }}>
          {rows.map(([a, b], j) => (
            <motion.li key={a} variants={{ in: { opacity: 0, y: 16 }, on: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE, delay: 0.05 + j * 0.06 } } }} className={j === rows.length - 1 ? 'last' : ''}>
              <span>{a}</span>{b && <b>{b}</b>}
            </motion.li>
          ))}
        </motion.ul>
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
  if (i === 0) return <div className="mc-art a0">{Array.from({ length: 7 }).map((_, k) => <i key={k} className={k < 3 ? 'on' : ''} />)}</div>;
  if (i === 1) return <div className="mc-art a1">{Array.from({ length: 24 }).map((_, k) => <i key={k} style={{ height: 30 + ((k * 37) % 60) + '%' }} />)}</div>;
  if (i === 2) return <div className="mc-art a2">{['GPU 0', 'GPU 1', 'any GPU'].map((l) => <p key={l}><em>{l}</em><i /><i /><i /></p>)}</div>;
  return <div className="mc-art a3"><b>agent</b><i /><b>machine</b></div>;
}

const OWN = [
  ['Scoped to your organization', 'A machine belongs to one org and is named within it. Every read and every terminate is checked against the org on your token, not against the id in the URL.'],
  ['Bring your own account', 'Link a DigitalOcean, AWS or GCP account and the clusters it holds fold into the same fleet. Your capacity, your contract, one place to see it.'],
  ['Pick the region deliberately', 'Launches name a region from the list the API returns, so where a workload runs is a decision you made rather than one that was made for you.'],
];

export default function Machines() {
  return (
    <main className="v2 mc">
      <section className="mc-hero v2-dark" data-room="dark">
        <div className="v2-wrap mc-hero-t">
          <p className="v2-kick acc">High-Performance Computing</p>
          <Lines as="h1" className="v2-display mc-h1" lines={['Hanzo Machines']} data-morph-target="" />
          <p className="v2-lede mc-sub">Rent a machine by the hour, metered to your organization.</p>
          <div className="v2-acts mc-acts">
            <A to="/login" className="v2-btn solid">Try Hanzo</A>
            <A to="https://docs.hanzo.ai" className="v2-btn">View Documentation</A>
          </div>
        </div>
        <Lift className="v2-wrap mc-lift" from={1.12} y={40} origin="50% 0%" offset={['start end', 'start 0.2']}>
          <Rent />
        </Lift>
      </section>

      <section className="v2-sec mc-specs">
        <div className="v2-wrap">
          <p className="v2-kick acc mc-specs-k">Tech specs</p>
          <div className="mc-sheet">
            {SPECS.map(([t, d, rows]) => (
              <div key={t} className="mc-col">
                <h3 className="v2-title">{t}</h3>
                <p className="mc-col-d">{d}</p>
                <dl>{rows.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PinChapters
        className="mc-ch"
        label="How renting one works"
        items={STEPS}
        look="left"
        head={<div className="mc-ch-h"><h2 className="v2-title">How renting one works</h2><p className="mc-ch-l">Every step is an API call, so anything you do once by hand you can put in a script afterwards</p></div>}
        visual={(at) => <StepCon at={at} />}
      />

      <section className="v2-sec mc-uses">
        <div className="v2-wrap">
          <div className="v2-grid mc-uses-h">
            <h2 className="v2-display s">When you want a whole machine</h2>
            <p className="v2-lede">Reach for one when the work outlasts a request, or needs a card of its own</p>
          </div>
          <div className="mc-tiles">
            {USES.map(([t, d, pts], i) => (
              <article key={t} className={'mc-tile t' + i}>
                <div className="mc-tile-art" aria-hidden="true"><UseArt i={i} /></div>
                <h3 className="v2-title">{t}</h3>
                <p className="mc-tile-d">{d}</p>
                <ul>{pts.map((p) => <li key={p}>{p}</li>)}</ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="v2-sec mc-own">
        <div className="v2-wrap">
          <div className="v2-grid mc-own-h">
            <h2 className="v2-display s">Whose machine it is</h2>
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
        flip
      />

      <GetIt name="Machines" tag="Long-running compute machines" seed="machines" data={[3.48, 27.84, 2540, 80, 16896, 528]} />
    </main>
  );
}
