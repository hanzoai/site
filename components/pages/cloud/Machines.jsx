'use client';
/* Machines. Signature: renting a GPU, priced before it exists. A rack of H100 cards sits in the dark; choose 1, 2 or 4
   (or let it choose) and that many cards wake, the dry-run request rewrites itself and the quote rolls in: the hour,
   the working day, the month, at the price list's rate. The six steps of renting one draw as a single path; the four
   reasons to want a whole machine are a switcher whose meter shows what is billed. Every word, figure and link is
   Hanzo's. */
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EASE, Rise } from '../../ui';
import { Hero, Paste, Related, Get, Head, useLive, useSteps } from './Frame';
import './Machines.css';

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
        <motion.span key={k + v} initial={{ y: '100%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '-100%', opacity: 0 }} transition={{ type: 'spring', stiffness: 380, damping: 30 }}>{v}</motion.span>
      </AnimatePresence>
    </span>
  );
}

function Rent() {
  const [ref, live] = useLive(0.3);
  const [at, choose] = useSteps(3, 3800, live);
  const [label, cards, vram, hour, day, month] = SIZES[at];
  return (
    <div className="mc-rent" ref={ref}>
      <div className="mc-rack" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={'mc-card' + (i < cards ? ' on' : '')} style={{ '--i': i }}>
            <span className="mc-card-n">H100</span>
            <span className="mc-fans"><i /><i /></span>
            <span className="mc-card-led" />
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
              {at === i && <motion.span layoutId="mc-size" className="mc-size-bg" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
              <span>{s}</span>
            </button>
          ))}
        </div>
        <pre className="mc-body"><code>{'{ "gpu": '}<b>{'"' + label + '"'}</b>{', "dryRun": true }'}</code></pre>
        <div className="mc-quote" aria-live="polite">
          <p className="mc-vram"><Roll v={vram} k="v" /></p>
          <p className="mc-hour"><Roll v={hour} k="h" /><span>/ h</span></p>
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

/* A datasheet: three columns of hardware, the figure big, the unit beside it. */
function Specs() {
  return (
    <section className="x-sec mc-specs">
      <div className="x-wrap mc-sheet">
        {SPECS.map(([t, d, rows], i) => (
          <Rise key={t} className="mc-col" delay={i * 0.08}>
            <p className="mc-col-k">{String(i + 1).padStart(2, '0')}</p>
            <h3>{t}</h3>
            <p className="mc-col-d">{d}</p>
            <dl>{rows.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
          </Rise>
        ))}
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

/* The six steps on one path that draws as you reach it. */
function Steps() {
  return (
    <section className="x-sec mc-steps">
      <div className="x-wrap">
        <Head title="How renting one works" lede="Every step is an API call, so anything you do once by hand you can put in a script afterwards" />
        <ol className="mc-path">
          {STEPS.map(([t, d], i) => (
            <motion.li key={t} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.7, ease: EASE, delay: (i % 3) * 0.08 }}>
              <span className="mc-node"><motion.i initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true, amount: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.2 + (i % 3) * 0.08 }} /></span>
              <motion.span className="mc-seg" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true, amount: 1 }} transition={{ duration: 0.8, ease: EASE, delay: 0.3 + (i % 3) * 0.08 }} />
              <span className="mc-step-n">Step {i + 1}</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}

const USES = [
  ['Training runs', 'A job that needs cards for hours and nothing for the rest of the week.', ['GPU sizes named from the list the API returns', 'GPU-hours metered while the job runs', 'Cancel and the hours used so far are billed, then the job stops']],
  ['Serving a model', 'A machine that stays up because something is calling it.', ['Run Hanzo Engine on a card you rented', 'Terminate it when the traffic goes away', 'The bill follows the machine, not a reservation']],
  ['Work that will not fit in a request', 'Renders, batches and simulations that take longer than an HTTP call.', ['A queue per GPU, plus a shared any-GPU lane', 'Each item says which node claimed it', 'Read the queue instead of guessing where a job went']],
  ['Agents that need a computer', 'An agent with a machine under it, launched and torn down as one thing.', ['Bind a cloud agent to a machine', 'Message it, or stop it, by name', 'Tearing down the pair unbinds the agent first']],
];

/* Each use has its own little meter: what is running, and what is billed, while it runs. */
function Meter({ i }) {
  return (
    <div className={'mc-meter m' + i} aria-hidden="true">
      {i === 0 && <><i className="busy" /><i className="busy" /><i className="busy" /><i /><i /><i /><i /></>}
      {i === 1 && <span className="mc-pulse">{Array.from({ length: 24 }).map((_, k) => <b key={k} style={{ animationDelay: -k * 0.12 + 's' }} />)}</span>}
      {i === 2 && <span className="mc-lanes">{['GPU 0', 'GPU 1', 'any GPU'].map((l, k) => <span key={l}><em>{l}</em>{[0, 1, 2].map((q) => <b key={q} style={{ animationDelay: (k * 0.4 + q * 0.9) + 's' }} />)}</span>)}</span>}
      {i === 3 && <span className="mc-pair"><b>agent</b><i /><b>machine</b></span>}
    </div>
  );
}

function Uses() {
  const [ref, live] = useLive(0.35);
  const [at, choose] = useSteps(USES.length, 5000, live);
  return (
    <section className="x-sec mc-uses" ref={ref}>
      <div className="x-wrap">
        <Head title="When you want a whole machine" lede="Reach for one when the work outlasts a request, or needs a card of its own" />
        <div className="mc-use-grid">
          <div className="mc-use-tabs" role="tablist" aria-label="Uses">
            {USES.map(([t], i) => (
              <button key={t} type="button" role="tab" aria-selected={at === i} id={'mc-u' + i} aria-controls={'mc-up' + i} onClick={() => choose(i)}>
                <span className="mc-use-n">{String(i + 1).padStart(2, '0')}</span>{t}
                {at === i && <motion.i layoutId="mc-use" className="mc-use-bg" transition={{ type: 'spring', stiffness: 380, damping: 34 }} />}
              </button>
            ))}
          </div>
          <div className="mc-use-panel">
            {USES.map(([t, d, pts], i) => (
              <div key={t} role="tabpanel" id={'mc-up' + i} aria-labelledby={'mc-u' + i} hidden={at !== i}>
                <Meter i={i} />
                <motion.p key={'d' + (at === i)} className="mc-use-d" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: EASE }}>{d}</motion.p>
                <ul>{pts.map((p, k) => <motion.li key={p + (at === i)} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, ease: EASE, delay: 0.1 + k * 0.06 }}>{p}</motion.li>)}</ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const OWN = [
  ['Scoped to your organization', 'A machine belongs to one org and is named within it. Every read and every terminate is checked against the org on your token, not against the id in the URL.'],
  ['Bring your own account', 'Link a DigitalOcean, AWS or GCP account and the clusters it holds fold into the same fleet. Your capacity, your contract, one place to see it.'],
  ['Pick the region deliberately', 'Launches name a region from the list the API returns, so where a workload runs is a decision you made rather than one that was made for you.'],
];

function Owner() {
  return (
    <section className="x-sec mc-own">
      <div className="x-wrap mc-own-grid">
        <div className="mc-own-h">
          <Rise as="h2">Whose machine it is</Rise>
          <Rise as="p" delay={0.08}>Ownership, region and account are decisions the API makes you state</Rise>
        </div>
        <div className="mc-own-list">
          {OWN.map(([t, d], i) => (
            <Rise key={t} className="mc-own-i" delay={i * 0.06}><h3>{t}</h3><p>{d}</p></Rise>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Machines() {
  return (
    <main className="mc">
      <Hero
        dark
        kick="High-Performance Computing"
        title="Hanzo Machines"
        sub="Rent a machine by the hour, metered to your organization."
        acts={[['Try Hanzo', '/login'], ['View Documentation', 'https://docs.hanzo.ai']]}
      >
        <Rent />
      </Hero>
      <Specs />
      <Steps />
      <Uses />
      <Owner />
      <section className="x-sec mc-paste">
        <div className="x-wrap">
          <Paste name="Machines" api="/v1/compute/machines" prompt="Read https://hanzo.ai/skill.md and use Hanzo Machines in my project. Start with: hanzo visor machines list" />
          <Related className="mc-rel" items={[['GPUs', '/cloud/gpus', 'On-demand accelerators'], ['Containers', '/cloud/containers'], ['Functions', '/functions', 'Serverless handlers']]} />
        </div>
      </section>
      <Get name="Machines" tag="Long-running compute machines" />
    </main>
  );
}
