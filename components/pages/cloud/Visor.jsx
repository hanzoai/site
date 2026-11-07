'use client';
/* Visor (v2, Cloud 4 chat). Archetype B, System: the fleet console arriving beside the title (Stage, side, flipped) →
   six tiles in a dark room that open into their pages → a batch you name → close. Accent: fleet magenta.
   V2: 8/10 one request launching a fleet from three clouds as the hero, the six facts as tiles that open into full cards with a shared-element morph, a batch-launch preview
   Signature: every tile opens (synchronized.studio). The six things you get are tiles; tap one and it grows, with a
   shared-element morph, into a full card with its own working picture; close it and it folds back into its place.
   Beyond: "Name a fleet". Choose a prefix and a count and see the machines a batch launch will name, in sequence under
   the prefix, beside the node pool and the cluster in the same inventory, and whether it is a dry run that spends nothing.
   Motion: shared-element open (signature) + the hero's launch sequence + layout re-flow of the inventory + magnetic
   primary. Every word and link is Hanzo's; providers, regions and machine names are examples. */
import { useEffect, useState } from 'react';
import { motion, AnimatePresence, LayoutGroup, useReducedMotion } from 'motion/react';
import { EASE } from '../../ui';
import { useLive } from './Frame';
import StageHero from '../../v2/StageHero';
import Finale from '../../v2/Finale';
import './Visor.css';

const GH = 'https://github.com/hanzoai';
const PROVIDERS = ['DigitalOcean', 'AWS', 'GCP'];

/* Stage object: one request; every provider's catalogue answers; a dry run quotes; the launch names machines in order
   into one inventory; a console opens in a tab; the audit row is written. Loops by itself. */
function Fleet() {
  const [ref, live, calm] = useLive(0.3);
  const [t, setT] = useState(calm ? 6 : 0);
  useEffect(() => {
    if (calm || !live) return;
    const id = setTimeout(() => setT((v) => (v >= 7 ? 0 : v + 1)), [1100, 1400, 1500, 650, 650, 1000, 2800, 500][t]);
    return () => clearTimeout(id);
  }, [t, live, calm]);
  const n = Math.max(0, Math.min(3, t - 2));
  return (
    <div className="l2-obj vs2-fleet" ref={ref} aria-hidden="true">
      <div className="vs2-req">
        <p className="vs2-k l2-mono">one API</p>
        <p className="vs2-cmd">launch <b>3</b> × GPU instance · prefix <b>train</b></p>
      </div>
      <div className="vs2-cat">
        {PROVIDERS.map((p, i) => (
          <div key={p} className={'vs2-prov' + (t >= 1 ? ' on' : '') + (t >= 2 && i === 1 ? ' pick' : '')} style={{ transitionDelay: i * 90 + 'ms' }}>
            <b>{p}</b><span>regions · sizes · GPUs</span><em className="l2-mono">{t >= 1 ? 'cached and priced' : '…'}</em>
          </div>
        ))}
      </div>
      <div className="vs2-dry l2-mono"><span className={t === 2 ? 'on' : ''}>dry run · quote returned · spends nothing</span></div>
      <div className="vs2-inv">
        <p className="vs2-k l2-mono">one inventory</p>
        <ul>
          <AnimatePresence initial={false}>
            {Array.from({ length: n }).map((_, i) => <motion.li key={'m' + i} layout initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.45, ease: EASE }}><i className="m" /><b className="l2-mono">train-0{i + 1}</b><span>machine</span></motion.li>)}
          </AnimatePresence>
          <motion.li layout transition={{ duration: 0.45, ease: EASE }}><i className="p" /><b className="l2-mono">gpu-pool</b><span>node pool</span></motion.li>
          <motion.li layout transition={{ duration: 0.45, ease: EASE }}><i className="k" /><b className="l2-mono">cluster</b><span>managed Kubernetes</span></motion.li>
        </ul>
        <div className={'vs2-con' + (t >= 6 ? ' on' : '')}><p className="l2-mono"><span>SSH</span><span>train-01</span></p><code className="l2-mono">{t >= 6 ? '$ ▍' : ''}</code></div>
        <p className={'vs2-audit l2-mono' + (t >= 6 ? ' on' : '')}>launched · console opened · org · project</p>
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

/* Each tile's own picture, small on the tile and large once opened. */
function Pic({ i }) {
  if (i === 0) return <div className="vs2-p0">{PROVIDERS.map((p) => <span key={p}><b>{p}</b><i /><i /><i className="g" /></span>)}</div>;
  if (i === 1) return <div className="vs2-p1"><span className="vol">volume</span><span className="img">image</span><span className="vm l2-mono">train-01</span><span className="vm l2-mono">train-02</span><span className="vm l2-mono">train-03</span></div>;
  if (i === 2) return <div className="vs2-p2"><span className="k8s">cluster</span><span className="pool">node pool</span>{Array.from({ length: 6 }).map((_, k) => <i key={k} />)}</div>;
  if (i === 3) return <div className="vs2-p3"><p className="l2-mono">dry run</p><b className="l2-fig">quote</b><p className="l2-mono">spends nothing</p></div>;
  if (i === 4) return <div className="vs2-p4"><p className="l2-mono">{['RDP', 'VNC', 'SSH'].map((x, k) => <span key={x} className={k === 2 ? 'on' : ''}>{x}</span>)}</p><code className="l2-mono">$ ▍</code></div>;
  return <ul className="vs2-p5">{['launched', 'console opened', 'destroyed'].map((x) => <li key={x} className="l2-mono"><i />{x}<span>org · project</span></li>)}</ul>;
}

/* Signature: tiles that open into their page and fold back. */
function Tiles() {
  const [open, setOpen] = useState(-1);
  const calm = useReducedMotion();
  useEffect(() => {
    if (open < 0) return;
    const k = (e) => { if (e.key === 'Escape') setOpen(-1); };
    addEventListener('keydown', k);
    window.__lenis?.stop();
    return () => { removeEventListener('keydown', k); window.__lenis?.start(); };
  }, [open]);
  const spring = calm ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 30 };
  return (
    <section className="l2-sec l2-dark vs2-tiles" data-room="dark">
      <div className="l2-wrap">
        <div className="vs2-tiles-h">
          <h2 className="l2-display m">What you get for the price of one integration</h2>
          <p className="l2-mono vs2-range">01 / 06 — 06 / 06</p>
        </div>
        <LayoutGroup>
          <ul className="vs2-grid">
            {FACTS.map(([t, d], i) => (
              <li key={t}>
                <motion.button type="button" layoutId={'vs2-t' + i} transition={spring} className={'vs2-tile' + (open === i ? ' gone' : '')} onClick={() => setOpen(i)} aria-haspopup="dialog" data-cursor="Open">
                  <motion.span layoutId={'vs2-n' + i} transition={spring} className="vs2-n l2-mono">{String(i + 1).padStart(2, '0')} / 06</motion.span>
                  <span className="vs2-st l2-mono"><i />ready</span>
                  <motion.span layoutId={'vs2-pic' + i} transition={spring} className="vs2-tp" aria-hidden="true"><Pic i={i} /></motion.span>
                  <motion.span layoutId={'vs2-h' + i} transition={spring} className="vs2-th">{t}</motion.span>
                  <span className="vs2-d" hidden>{d}</span>
                </motion.button>
              </li>
            ))}
          </ul>
          <AnimatePresence>
            {open >= 0 && (
              <motion.div key="scrim" className="vs2-scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} onClick={() => setOpen(-1)} />
            )}
            {open >= 0 && (
              <motion.div key={'card' + open} layoutId={'vs2-t' + open} transition={spring} className="vs2-card" role="dialog" aria-modal="true" aria-label={FACTS[open][0]} data-lenis-prevent>
                <motion.span layoutId={'vs2-n' + open} transition={spring} className="vs2-n l2-mono">{String(open + 1).padStart(2, '0')} / 06</motion.span>
                <button type="button" className="vs2-x" onClick={() => setOpen(-1)} aria-label="Close" autoFocus>×</button>
                <div className="vs2-card-in">
                  <div>
                    <motion.h3 layoutId={'vs2-h' + open} transition={spring} className="l2-head">{FACTS[open][0]}</motion.h3>
                    <motion.p className="l2-body" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.18, duration: 0.5, ease: EASE } }} exit={{ opacity: 0, transition: { duration: 0.1 } }}>{FACTS[open][1]}</motion.p>
                    <div className="vs2-nav">
                      <button type="button" className="x-btn sm" onClick={() => setOpen((open + 5) % 6)}>Previous</button>
                      <button type="button" className="x-btn sm" onClick={() => setOpen((open + 1) % 6)}>Next</button>
                    </div>
                  </div>
                  <motion.div layoutId={'vs2-pic' + open} transition={spring} className="vs2-cp" aria-hidden="true"><Pic i={open} /></motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </LayoutGroup>
      </div>
    </section>
  );
}

/* Beyond: name a fleet; see what a batch launch will create, and in which inventory. */
function Name() {
  const [prefix, setPrefix] = useState('train');
  const [count, setCount] = useState(3);
  const [dry, setDry] = useState(true);
  const px = prefix.toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 24) || 'train';
  return (
    <section className="l2-sec vs2-name">
      <div className="l2-wrap l2-grid">
        <div className="vs2-name-l">
          <p className="l2-kick ac">Name a fleet</p>
          <h2 className="l2-head">{FACTS[1][0]}</h2>
          <div className="vs2-form">
            <label><span className="l2-mono">prefix</span><input value={prefix} onChange={(e) => setPrefix(e.target.value)} spellCheck="false" autoComplete="off" /></label>
            <div className="vs2-count" role="group" aria-label="Machines">
              <span className="l2-mono">machines</span>
              <div><button type="button" onClick={() => setCount((c) => Math.max(1, c - 1))} aria-label="Fewer">−</button><b className="l2-fig">{count}</b><button type="button" onClick={() => setCount((c) => Math.min(8, c + 1))} aria-label="More">+</button></div>
            </div>
            <div className="vs2-dryt" role="group" aria-label="Launch">
              <button type="button" aria-pressed={dry} onClick={() => setDry(true)}>dry run</button>
              <button type="button" aria-pressed={!dry} onClick={() => setDry(false)}>launch</button>
            </div>
          </div>
        </div>
        <div className="vs2-name-r" aria-live="polite">
          <div className="vs2-inv2">
            <p className="vs2-k l2-mono">one inventory · prefix <b>{px}</b></p>
            <motion.ul layout>
              <AnimatePresence initial={false}>
                {Array.from({ length: count }).map((_, i) => (
                  <motion.li key={px + i} layout initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, transition: { duration: 0.15 } }} transition={{ duration: 0.4, ease: EASE }} className={dry ? 'dry' : ''}>
                    <i className="m" /><b className="l2-mono">{px}-{String(i + 1).padStart(2, '0')}</b><span>machine</span>
                  </motion.li>
                ))}
              </AnimatePresence>
              <motion.li layout><i className="p" /><b className="l2-mono">gpu-pool</b><span>node pool</span></motion.li>
              <motion.li layout><i className="k" /><b className="l2-mono">cluster</b><span>managed Kubernetes</span></motion.li>
            </motion.ul>
            <p className={'vs2-out l2-mono' + (dry ? '' : ' live')}>{dry ? 'dry run · quote returned · spends nothing' : 'metered against the organization · per provider'}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Visor() {
  return (
    <main className="l2-page vs2" style={{ '--ac': '#d4379c' }}>
      <StageHero look="side" flip kick="hanzoai/visor" title="Hanzo Visor" sub="Machines from several clouds, through one API" acts={[['View on GitHub', GH]]}>
        <Fleet />
      </StageHero>
      <Tiles />
      <Name />
      <Finale name="Visor" head="Get started with Hanzo Visor" prompt="Read https://hanzo.ai/skill.md and use Hanzo Visor in my project. Start with: hanzo visor machines list" tag="Machines, volumes, and clusters" />
    </main>
  );
}
