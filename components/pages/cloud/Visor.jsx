'use client';
/* Visor (v2, Cloud 4 chat; MOTION-MAP build). Archetype B, System. Order: the fleet console hero → the living fleet
   graph (the signature, second screen) → a batch you name → the six things you get as cards that open → Get Visor,
   closing on that same batch as a console session over its machines. No pinned chapter scene (Visor is not `split`).
   Persona: a platform engineer running machines on more than one cloud. Goal: open the repo and try the API.
   CTA: "View on GitHub" (hero and close; data-cta primary / close). Metric: cta_click:visor.primary.
   V2: 7/10 motion-map build: graph signature, five page-local entrances, pinned room removed (own guess, not a critic score)
   Signature: graph. The living fleet graph (visor/Graph.jsx): one API at the centre, the providers on the inner ring,
   the machines, node pool and cluster on the outer ring; the nodes orbit in and settle like a damped spring, then
   drift; hover, focus or tap a node and its path to the API lights and is named; at rest it names one path after
   another. Radial, unlike Telemetry's left-to-right pipeline.
   Entrances: diagonal-wipe, orbit-in, underline-sweep, word-shuffle, curtain-rise (hero console, graph, name a
   batch, the six cards, the close; each built here, never one shared reveal).
   Beyond: "Name a fleet". Choose a prefix and a count and see the machines a batch launch will name, in sequence under
   the prefix, beside the node pool and the cluster in the same inventory, and whether it is a dry run that spends
   nothing. The close lands the batch you named.
   Motion: graph (signature: arrival + idle naming + pointer/focus/tap, pausable) + the hero's launch sequence (time,
   pausable) + inventory re-flow (state) + each card's picture playing on arrival and hover + the close's console
   session landing once (time).
   Every word and link is Hanzo's; providers, regions and machine names are examples. */
import { Fragment, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView } from 'motion/react';
import useCalm from '../../v2/useCalm';
import { EASE } from '../../ui';
import Graph from './visor/Graph';
import { useDemo, PauseBtn } from '../../v2/x-hamilton/Demo';
import { Sheet, Cta } from '../../kit';
import StageHero from '../../v2/StageHero';
import Finale from '../../v2/Finale';
import './Visor.css';

const GH = 'https://github.com/hanzoai';
const PROVIDERS = ['DigitalOcean', 'AWS', 'GCP'];
// a phrase that wraps only at its own dots: each piece stays whole, so a line never starts with "·" and never splits a pair
const Nw = ({ parts }) => parts.map((p, i) => <span key={i}><span className="vs2-nw">{p}</span>{i < parts.length - 1 ? ' ' : ''}</span>);
const DRY = ['dry run ·', 'quote returned ·', 'spends nothing'];
const AUDIT = ['launched ·', 'console opened ·', 'org · project'];

/* Stage object: one request; a dry run quotes; every provider's catalogue answers; the launch names machines in order
   into one inventory; a console opens in a tab; the audit row is written. Loops by itself. */
function Fleet() {
  const [ref, live, , paused, toggle] = useDemo(0.3);
  const calm = useCalm();
  const [t, setT] = useState(0);
  useEffect(() => { if (calm) setT(6); }, [calm]);
  useEffect(() => {
    if (calm || !live) return;
    const id = setTimeout(() => setT((v) => (v >= 7 ? 0 : v + 1)), [500, 1400, 1500, 650, 650, 1000, 2800, 500][t]);
    return () => clearTimeout(id);
  }, [t, live, calm]);
  const n = Math.max(0, Math.min(3, t - 2));
  // entrance 1, diagonal-wipe: the console is uncovered by a diagonal clip from its top-left corner once the page is up
  const [wiped, setWiped] = useState(false);
  useEffect(() => { const id = requestAnimationFrame(() => setWiped(true)); return () => cancelAnimationFrame(id); }, []);
  return (
    <div className="l2-obj vs2-fleet" ref={ref} data-paused={paused ? '' : undefined} data-in={wiped ? '' : undefined}>
      <PauseBtn paused={paused} onClick={toggle} className="dk vs2-pause" />
      <div className="vs2-req" aria-hidden="true">
        <p className="vs2-k l2-mono">one API</p>
        <p className="vs2-cmd">launch <b>3</b> × GPU instance · prefix <b>train</b></p>
      </div>
      <div className="vs2-dry l2-mono" aria-hidden="true"><span className={t === 2 ? 'on' : ''}><Nw parts={DRY} /></span></div>
      <div className="vs2-cat" aria-hidden="true">
        {PROVIDERS.map((p, i) => (
          <div key={p} className={'vs2-prov' + (t >= 1 ? ' on' : '') + (t >= 2 && i === 1 ? ' pick' : '')} style={{ transitionDelay: i * 90 + 'ms' }}>
            <b>{p}</b><span>regions · sizes · GPUs</span><em className="l2-mono">{t >= 1 ? 'cached and priced' : '…'}</em>
          </div>
        ))}
      </div>
      <div className="vs2-inv" aria-hidden="true">
        <p className="vs2-k l2-mono">one inventory</p>
        <ul>
          <li><i className="p" /><b className="l2-mono">gpu-pool</b><span>node pool</span></li>
          <li><i className="k" /><b className="l2-mono">cluster</b><span>managed Kubernetes</span></li>
          {/* three slots reserved from the start: a machine lands in its slot and nothing else moves */}
          {[0, 1, 2].map((i) => (i < n
            ? <motion.li key={'m' + i} className="mc" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45, ease: EASE }}><i className="m" /><b className="l2-mono">train-0{i + 1}</b><span>machine</span></motion.li>
            : <li key={'e' + i} className="mc ph" />))}
        </ul>
        {/* the console is a real terminal waiting from the first frame; "opened" lights its tab and starts the caret */}
        <div className={'vs2-con' + (t >= 6 ? ' on' : '')}><p className="l2-mono"><span>SSH</span><span>train-01</span></p><code className="l2-mono">$ {t >= 6 ? <i className="vs2-caret">▍</i> : <i className="vs2-idle">▍</i>}</code></div>
        <p className={'vs2-audit l2-mono' + (t >= 6 ? ' on' : '')}><Nw parts={AUDIT} /></p>
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
  const d = (k) => ({ '--d': k * 120 + 'ms' });
  if (i === 0) return <div className="vs2-p0">{PROVIDERS.map((p, r) => <span key={p}><b>{p}</b><i style={d(r * 3)} /><i style={d(r * 3 + 1)} /><i className="g" style={d(r * 3 + 2)} /></span>)}</div>;
  if (i === 1) return <div className="vs2-p1"><span className="vol">volume</span><span className="img">image</span>{[1, 2, 3].map((k) => <span key={k} className="vm l2-mono" style={d(k * 2)}>train-0{k}</span>)}</div>;
  if (i === 2) return <div className="vs2-p2"><span className="k8s">cluster</span><span className="pool">node pool</span>{Array.from({ length: 6 }).map((_, k) => <i key={k} style={d(k)} />)}</div>;
  if (i === 3) return <div className="vs2-p3"><p className="l2-mono">dry run</p><span className="vs2-mask"><b className="l2-fig">quote</b></span><p className="l2-mono">spends nothing</p></div>;
  if (i === 4) return <div className="vs2-p4"><p className="l2-mono">{['RDP', 'VNC', 'SSH'].map((x, k) => <span key={x} className={k === 2 ? 'on' : ''} style={d(k * 2)}>{x}</span>)}</p><code className="l2-mono">$ <i className="vs2-caret">▍</i></code></div>;
  return <ul className="vs2-p5">{['launched', 'console opened', 'destroyed'].map((x, k) => <li key={x} className="l2-mono" style={d(k * 3)}><i />{x}<span>org · project</span></li>)}</ul>;
}

/* Entrance 4, word-shuffle: each title's words come in out of order, from alternating sides, and swap into place.
   Offsets and delays come from the word's index (no randomness, so server and browser agree). */
function Shuffle({ text, at = 0 }) {
  const w = text.split(' ');
  return w.map((word, i) => (
    <Fragment key={i}>
      <span className="vs2-w" style={{ '--sx': ((i % 2 ? -1 : 1) * (26 + ((i * 13) % 30))) + 'px', '--sd': at + ((i * 5 + 2) % w.length) * 70 + 'ms' }}>{word}</span>
      {i < w.length - 1 ? ' ' : ''}
    </Fragment>
  ));
}

/* One card of the six. Its own small picture plays its sequence once as the card arrives and again on hover. Its
   paragraph stays in the HTML, findable; the card opens it in the kit Sheet. */
// React renders `hidden` as a boolean, so the paragraph upgrades itself to hidden="until-found" (find in page opens it)
const untilFound = (el) => { if (el) el.setAttribute('hidden', 'until-found'); };

function Row({ t, d, i, onOpen }) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.45 });
  return (
    <li ref={ref} data-on={seen ? '' : undefined}>
      <button type="button" className="vs2-tile" onClick={() => onOpen(i)} aria-haspopup="dialog">
        <span className="vs2-n l2-mono">{String(i + 1).padStart(2, '0')}</span>
        <span className="vs2-tp" aria-hidden="true"><Pic i={i} /></span>
        <span className="vs2-th"><Shuffle text={t} at={200 + i * 90} /></span>
        <svg className="vs2-plus" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
      </button>
      <p className="vs2-find" hidden ref={untilFound}>{d}</p>
    </li>
  );
}

/* The six things you get, as one plain dark section of cards (no pin): every card opens into its full card in the
   kit Sheet (focus held inside, Escape and Back close it, focus returns to the card). */
function Tiles() {
  const [open, setOpen] = useState(-1);
  const at = Math.max(0, open);
  const sec = useRef(null);
  const seen = useInView(sec, { once: true, amount: 0.15 });
  return (
    <section className="l2-dark vs2-tiles" data-room="dark" ref={sec} data-in={seen ? '' : undefined}>
      <div className="l2-wrap">
        <h2 className="l2-head vs2-tiles-h"><Shuffle text="What you get for the price of one integration" /></h2>
        <ol className="vs2-grid">
          {FACTS.map(([t, d], i) => <Row key={t} t={t} d={d} i={i} onOpen={setOpen} />)}
        </ol>
      </div>
      <Sheet open={open >= 0} onClose={() => setOpen(-1)} title={FACTS[at][0]} wide className="vs2-sheet">
        <p className="vs2-cap l2-mono">{String(at + 1).padStart(2, '0')} / 06</p>
        <div className="vs2-cp" aria-hidden="true"><Pic i={at} /></div>
        <p className="l2-body vs2-cd">{FACTS[at][1]}</p>
        <div className="vs2-nav">
          <Cta kind="quiet" id="tile-prev" onClick={() => setOpen((open + 5) % 6)}>Previous</Cta>
          <Cta kind="quiet" id="tile-next" onClick={() => setOpen((open + 1) % 6)}>Next</Cta>
        </div>
      </Sheet>
    </section>
  );
}

const clean = (prefix) => prefix.toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 24) || 'train';

/* Beyond: name a fleet; see what a batch launch will create, and in which inventory. The batch lives on the page, so
   the close lands the batch named here. */
function Name({ prefix, setPrefix, count, setCount, dry, setDry }) {
  const sec = useRef(null);
  const here = useInView(sec, { once: true, amount: 0.4 });
  const calm = useCalm();
  const armed = useRef(false);
  /* Arrival, untouched only: the prefix types itself in letter by letter (60 ms a letter) as the names follow it, then
     the batch names itself 01, 02, 03. */
  useEffect(() => {
    if (calm || !sec.current || sec.current.getBoundingClientRect().top < innerHeight) return;
    armed.current = true; setPrefix(''); setCount(1);
  }, [calm]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!here || !armed.current) return;
    const word = 'train';
    const ids = word.split('').map((_, k) => setTimeout(() => armed.current && setPrefix(word.slice(0, k + 1)), 120 + k * 60));
    ids.push(setTimeout(() => armed.current && setCount(2), 700), setTimeout(() => { if (armed.current) setCount(3); armed.current = false; }, 1200));
    return () => ids.forEach(clearTimeout);
  }, [here]); // eslint-disable-line react-hooks/exhaustive-deps
  const touch = (fn) => () => { if (armed.current) { armed.current = false; setPrefix((v) => v || 'train'); } fn(); };
  const px = clean(prefix);
  return (
    // entrance 3, underline-sweep: as the section arrives, underlines sweep under its key words in turn (the heading,
    // prefix, machines, then the line that says what the launch will cost)
    <section className="l2-sec vs2-name" ref={sec} data-in={here ? '' : undefined}>
      <div className="l2-wrap l2-grid">
        <div className="vs2-name-l">
          <h2 className="l2-head"><span className="vs2-us">{FACTS[1][0]}</span></h2>
          <div className="vs2-form">
            <label><span className="l2-mono"><span className="vs2-us" style={{ '--d': '260ms' }}>prefix</span></span><input value={prefix} onChange={(e) => { armed.current = false; setPrefix(e.target.value); }} spellCheck="false" autoComplete="off" /></label>
            <div className="vs2-count" role="group" aria-label="Machines">
              <span className="l2-mono"><span className="vs2-us" style={{ '--d': '420ms' }}>machines</span></span>
              <div><button type="button" onClick={touch(() => setCount((c) => Math.max(1, c - 1)))} aria-label="Fewer"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg></button><b className="l2-fig">{count}</b><button type="button" onClick={touch(() => setCount((c) => Math.min(8, c + 1)))} aria-label="More"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg></button></div>
            </div>
            <div className="vs2-dryt" role="group" aria-label="Launch">
              <button type="button" aria-pressed={dry} onClick={touch(() => setDry(true))}>dry run</button>
              <button type="button" aria-pressed={!dry} onClick={touch(() => setDry(false))}>launch</button>
            </div>
          </div>
        </div>
        <div className="vs2-name-r" aria-live="polite">
          <div className="vs2-inv2">
            <p className="vs2-k l2-mono">one inventory · prefix <b>{px}</b></p>
            <motion.ul layout>
              <AnimatePresence initial={false}>
                {Array.from({ length: count }).map((_, i) => (
                  <motion.li key={i} layout initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, transition: { duration: 0.15 } }} transition={{ duration: 0.4, ease: EASE }} className={dry ? 'dry' : ''}>
                    <i className="m" /><b className="l2-mono">{px}-{String(i + 1).padStart(2, '0')}</b><span>machine</span>
                  </motion.li>
                ))}
              </AnimatePresence>
              <motion.li layout><i className="p" /><b className="l2-mono">gpu-pool</b><span>node pool</span></motion.li>
              <motion.li layout><i className="k" /><b className="l2-mono">cluster</b><span>managed Kubernetes</span></motion.li>
            </motion.ul>
            <p className={'vs2-out l2-mono' + (dry ? '' : ' live')}><span className="vs2-us" style={{ '--d': '600ms' }}>{dry ? 'dry run · quote returned · spends nothing' : 'metered against the organization · per provider'}</span></p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* The close's object: the batch you named, as a console session. The window opens with one tab per machine in your
   batch (your prefix, your count); the first tab is live with its prompt; the audit row writes itself under it, and the
   line says whether it was a dry run or metered. Plays once on arrival. */
function Close({ px, count, dry }) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.5 });
  const names = Array.from({ length: count }, (_, i) => `${px}-${String(i + 1).padStart(2, '0')}`);
  const shown = names.slice(0, 3);
  return (
    <div className="vs2-close" ref={ref} data-on={seen ? '' : undefined} aria-hidden="true">
      <p className="vs2-close-tabs l2-mono">
        <span className="ssh">SSH</span>
        {shown.map((m, i) => <span key={m} className={i === 0 ? 'on' : ''} style={{ '--d': 200 + i * 140 + 'ms' }}>{m}</span>)}
        {names.length > 3 && <span className="more" style={{ '--d': '620ms' }}>+{names.length - 3}</span>}
      </p>
      <div className="vs2-close-body">
        <code className="l2-mono">$ <i className="vs2-caret">▍</i></code>
        <p className="vs2-close-audit l2-mono"><Nw parts={AUDIT} /></p>
        <p className="vs2-close-out l2-mono">{dry ? <Nw parts={DRY} /> : 'metered against the organization · per provider'}</p>
      </div>
    </div>
  );
}

/* Entrance 5, curtain-rise: the close rises from below behind a clip, like a curtain going up. */
function Curtain({ children }) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.2 });
  return <div className="vs2-fin" ref={ref} data-in={seen ? '' : undefined}>{children}</div>;
}

export default function Visor() {
  const [prefix, setPrefix] = useState('train');
  const [count, setCount] = useState(3);
  const [dry, setDry] = useState(true);
  return (
    <main id="main" className="l2-page vs2" data-ask="off">
      <StageHero look="rise" className="vs2-hero" kick="hanzoai/visor" title="Hanzo Visor" sub="Machines from several clouds, through one API" acts={[['View on GitHub', GH]]} travel={{ s: [1.04, 1], y: ['1svh', '-10svh'] }}>
        <Fleet />
      </StageHero>
      <Graph />
      <Name prefix={prefix} setPrefix={setPrefix} count={count} setCount={setCount} dry={dry} setDry={setDry} />
      <Tiles />
      <Curtain>
        <Finale name="Visor" head="Get started with Hanzo Visor" ask={['View on GitHub', GH]} object={<Close px={clean(prefix)} count={count} dry={dry} />} prompt="Read https://hanzo.ai/skill.md and use Hanzo Visor in my project. Start with: hanzo visor machines list" tag="Machines, volumes, and clusters" />
      </Curtain>
    </main>
  );
}
