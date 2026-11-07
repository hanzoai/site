'use client';
/* Visor. Signature: one fleet from several clouds. A request goes out once; the catalogue answers from every provider
   at the same time; a dry run returns a quote and spends nothing; the real launch names its machines in sequence under
   one prefix, they join the same inventory as the node pool and the cluster, a console opens in a tab, and the audit
   row is written. The six facts are an inventory table you can open row by row. Every word and link is Hanzo's;
   provider, region and machine names are examples. */
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EASE, Rise } from '../../ui';
import { Hero, Paste, Get, useLive } from './Frame';
import './Visor.css';

const PROVIDERS = ['DigitalOcean', 'AWS', 'GCP'];

function Fleet() {
  const [ref, live, calm] = useLive(0.3);
  const [t, setT] = useState(calm ? 6 : 0); // 0 ask, 1 catalogue, 2 dry run, 3-5 launch, 6 console + audit
  useEffect(() => {
    if (calm || !live) return;
    const id = setTimeout(() => setT((v) => (v >= 7 ? 0 : v + 1)), [1000, 1300, 1300, 600, 600, 900, 2400, 400][t]);
    return () => clearTimeout(id);
  }, [t, live, calm]);
  const n = Math.max(0, Math.min(3, t - 2));
  return (
    <div className="vs-fleet" ref={ref} aria-hidden="true">
      <div className="vs-ask">
        <p className="vs-k">one API</p>
        <p className="vs-req">launch <b>3</b> × GPU instance · prefix <b>train</b></p>
        <div className="vs-cat">
          {PROVIDERS.map((p, i) => (
            <div key={p} className={'vs-prov' + (t >= 1 ? ' on' : '') + (t >= 2 && i === 1 ? ' pick' : '')} style={{ transitionDelay: i * 80 + 'ms' }}>
              <b>{p}</b><span>regions · sizes · GPUs</span><em>{t >= 1 ? 'cached and priced' : '…'}</em>
            </div>
          ))}
        </div>
        <AnimatePresence>{t === 2 && <motion.p className="vs-dry" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>dry run · quote returned · spends nothing</motion.p>}</AnimatePresence>
      </div>
      <div className="vs-inv">
        <p className="vs-k">one inventory</p>
        <ul>
          <AnimatePresence initial={false}>
            {Array.from({ length: n }).map((_, i) => <motion.li key={'m' + i} layout initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, ease: EASE }}><i className="m" /><b>train-0{i + 1}</b><span>machine</span></motion.li>)}
          </AnimatePresence>
          <li><i className="p" /><b>gpu-pool</b><span>node pool</span></li>
          <li><i className="k" /><b>cluster</b><span>managed Kubernetes</span></li>
        </ul>
        <div className={'vs-console' + (t >= 6 ? ' on' : '')}>
          <div className="vs-tab"><span>SSH</span><span>train-01</span></div>
          <p>{t >= 6 ? '$ ▍' : ''}</p>
        </div>
        <p className={'vs-audit' + (t >= 6 ? ' on' : '')}>launched · console opened · org · project</p>
      </div>
    </div>
  );
}

const FACTS = [
  ['One catalogue, GPUs included', 'Regions, sizes and GPU instances from each provider, cached and priced, read through the same call. Ask for what you want; Visor knows which provider can give it to you and what it will cost there.'],
  ['Volumes and images', 'Attach and detach block storage, launch from a provider image or one of your own. Batch launches name themselves in sequence and group under the prefix, so a fleet is just machines and there is no second object to learn.'],
  ['Pools, and managed Kubernetes', 'Node pools group machines by shape and role. Managed Kubernetes clusters are provisioned the same way, so the cluster and the machines beside it are one inventory rather than two consoles.'],
  ['Priced before it exists', 'A launch can run as a dry run: it returns the quote and spends nothing. A real launch is metered against the organization as it goes, per provider, so the bill is assembled from the same numbers the quote came from.'],
  ['A console in the browser', 'RDP, VNC and SSH reach the machine through a gateway and render in a tab — no client to install, no key to hand out, and no bastion of your own to keep patched. The session is a record, not just a connection.'],
  ['Every action leaves a row', 'Who launched it, who opened a console, who destroyed it, under which organization and project. Authorization runs through the same grant calculus the rest of the estate uses, so a machine cannot be reached by anyone whose token does not cover it.'],
];

function Table() {
  const [open, setOpen] = useState(0);
  return (
    <section className="x-sec vs-table-sec">
      <div className="x-wrap">
        <div className="vs-th"><Rise as="h2">What you get for the price of one integration</Rise><span className="x-mono">01 / 06 — 06 / 06</span></div>
        <div className="vs-table" role="table" aria-label="What you get">
          {FACTS.map(([t, d], i) => (
            <div key={t} role="row" className={'vs-row' + (open === i ? ' open' : '')}>
              <button type="button" role="cell" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>
                <span className="vs-id">{String(i + 1).padStart(2, '0')} / 06</span>
                <span className="vs-t">{t}</span>
                <span className="vs-st"><i />ready</span>
                <motion.span className="vs-plus" animate={{ rotate: open === i ? 45 : 0 }} transition={{ duration: 0.3, ease: EASE }} aria-hidden="true">+</motion.span>
              </button>
              <motion.div role="cell" className="vs-d" initial={false} animate={open === i ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: EASE }} aria-hidden={open !== i}>
                <p>{d}</p>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Visor() {
  return (
    <main className="vs">
      <Hero dark kick="hanzoai/visor" title="Hanzo Visor" sub="Machines from several clouds, through one API" acts={[['View on GitHub', 'https://github.com/hanzoai']]}>
        <Fleet />
      </Hero>
      <Table />
      <section className="x-sec vs-paste">
        <div className="x-wrap">
          <Rise as="h2" className="vs-start">Get started with Hanzo Visor</Rise>
          <Paste name="Visor" prompt="Read https://hanzo.ai/skill.md and use Hanzo Visor in my project. Start with: hanzo visor machines list" />
        </div>
      </section>
      <Get name="Visor" tag="Machines, volumes, and clusters" />
    </main>
  );
}
