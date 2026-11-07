'use client';
/* Visor (v2, Cloud 4 chat). Archetype B, System: the fleet console arriving beside the title (Stage, side, flipped) →
   six tiles in the one dark room that open into their cards → a batch you name → Get Visor → one closing band.
   Persona: a platform engineer running machines on more than one cloud. Goal: open the repo and try the API.
   CTA: "View on GitHub" (hero, ask bar, close; data-cta primary / close). Metric: cta_click:visor.primary.
   V2: 8/10 one request launches a fleet from three clouds as the hero; six tiles open into full cards in the kit Sheet; a batch you name; greys only, one ask, a closing band
   Signature: every tile opens. The six things you get are tiles with their own small working picture; tap one and its
   card rises with the picture large and Hanzo's paragraph beside it; Previous and Next walk the six; Escape or Back close.
   Beyond: "Name a fleet". Choose a prefix and a count and see the machines a batch launch will name, in sequence under
   the prefix, beside the node pool and the cluster in the same inventory, and whether it is a dry run that spends nothing.
   Motion: tile open (signature, state) + the hero's launch sequence (time, pausable) + inventory re-flow (state).
   Every word and link is Hanzo's; providers, regions and machine names are examples. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useScroll, useMotionValueEvent } from 'motion/react';
import useCalm from '../../v2/useCalm';
import { useWide } from '../../v2/useWide';
import { EASE } from '../../ui';
import { useDemo, PauseBtn } from '../../v2/x-hamilton/Demo';
import { Sheet, Cta } from '../../kit';
import StageHero from '../../v2/StageHero';
import Finale from '../../v2/Finale';
import './Visor.css';

const GH = 'https://github.com/hanzoai';
const PROVIDERS = ['DigitalOcean', 'AWS', 'GCP'];

/* Stage object: one request; every provider's catalogue answers; a dry run quotes; the launch names machines in order
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
  return (
    <div className="l2-obj vs2-fleet" ref={ref} data-paused={paused ? '' : undefined}>
      <PauseBtn paused={paused} onClick={toggle} className="dk vs2-pause" />
      <div className="vs2-req" aria-hidden="true">
        <p className="vs2-k l2-mono">one API</p>
        <p className="vs2-cmd">launch <b>3</b> × GPU instance · prefix <b>train</b></p>
      </div>
      <div className="vs2-cat" aria-hidden="true">
        {PROVIDERS.map((p, i) => (
          <div key={p} className={'vs2-prov' + (t >= 1 ? ' on' : '') + (t >= 2 && i === 1 ? ' pick' : '')} style={{ transitionDelay: i * 90 + 'ms' }}>
            <b>{p}</b><span>regions · sizes · GPUs</span><em className="l2-mono">{t >= 1 ? 'cached and priced' : '…'}</em>
          </div>
        ))}
      </div>
      <div className="vs2-dry l2-mono" aria-hidden="true"><span className={t === 2 ? 'on' : ''}>dry run · quote returned · spends nothing</span></div>
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
        <div className={'vs2-con' + (t >= 6 ? ' on' : '')}><p className="l2-mono"><span>SSH</span><span>train-01</span></p><code className="l2-mono">{t >= 6 ? <>$ <i className="vs2-caret">▍</i></> : ''}</code></div>
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
  const d = (k) => ({ '--d': k * 120 + 'ms' });
  if (i === 0) return <div className="vs2-p0">{PROVIDERS.map((p, r) => <span key={p}><b>{p}</b><i style={d(r * 3)} /><i style={d(r * 3 + 1)} /><i className="g" style={d(r * 3 + 2)} /></span>)}</div>;
  if (i === 1) return <div className="vs2-p1"><span className="vol">volume</span><span className="img">image</span>{[1, 2, 3].map((k) => <span key={k} className="vm l2-mono" style={d(k * 2)}>train-0{k}</span>)}</div>;
  if (i === 2) return <div className="vs2-p2"><span className="k8s">cluster</span><span className="pool">node pool</span>{Array.from({ length: 6 }).map((_, k) => <i key={k} style={d(k)} />)}</div>;
  if (i === 3) return <div className="vs2-p3"><p className="l2-mono">dry run</p><span className="vs2-mask"><b className="l2-fig">quote</b></span><p className="l2-mono">spends nothing</p></div>;
  if (i === 4) return <div className="vs2-p4"><p className="l2-mono">{['RDP', 'VNC', 'SSH'].map((x, k) => <span key={x} className={k === 2 ? 'on' : ''} style={d(k * 2)}>{x}</span>)}</p><code className="l2-mono">$ <i className="vs2-caret">▍</i></code></div>;
  return <ul className="vs2-p5">{['launched', 'console opened', 'destroyed'].map((x, k) => <li key={x} className="l2-mono" style={d(k * 3)}><i />{x}<span>org · project</span></li>)}</ul>;
}

/* One row of the numbered list. On a phone it is a card with its own small picture, which plays its sequence once as
   the card arrives (time, not scroll): the bars price, the machines name themselves, the pool fills, "quote" cuts in,
   the console is picked, the audit rows land. On desktop the row is a line in the pinned list; hovering or focusing it
   shows its picture on the stage (the hover tells you what it opens). Its paragraph stays in the HTML, findable. */
function Row({ t, d, i, at, onOpen, onPeek }) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.45 });
  return (
    <li ref={ref} data-on={seen ? '' : undefined} data-at={at === i ? '' : undefined}>
      <button type="button" className="vs2-tile" onClick={() => onOpen(i)} onPointerEnter={(e) => e.pointerType === 'mouse' && onPeek(i)} onFocus={() => onPeek(i)} aria-haspopup="dialog">
        <span className="vs2-n l2-mono">{String(i + 1).padStart(2, '0')}</span>
        <span className="vs2-tp" aria-hidden="true"><Pic i={i} /></span>
        <span className="vs2-th">{t}</span>
        <svg className="vs2-plus" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
      </button>
      <p className="vs2-find" hidden="until-found">{d}</p>
    </li>
  );
}

/* Signature: one pinned stage (desktop). The six things you get are a numbered list on the left; the stage on the right
   shows one picture large. Scrolling walks 01 → 06; resting 4 s without scrolling steps to the next by itself; hovering
   a row previews it. Every row opens into its full card (the kit Sheet: focus held inside, Escape and Back close it,
   focus returns to the row). Phones and reduced motion: no pin, the rows stack as cards with their own pictures. */
function Tiles() {
  const [open, setOpen] = useState(-1);
  const at = Math.max(0, open);
  const sec = useRef(null);
  const calm = useCalm();
  const wide = useWide();
  const pin = wide && !calm;
  const [cur, setCur] = useState(0);
  const [idle, setIdle] = useState(0); // bumps on every scroll; the idle step waits on it
  const live = useInView(sec, { amount: 0.25 });
  const { scrollYProgress: p } = useScroll({ target: sec, offset: ['start start', 'end end'] });
  useMotionValueEvent(p, 'change', (v) => { if (!pin) return; setCur(Math.min(5, Math.max(0, Math.floor(v * 6.0001)))); setIdle((k) => k + 1); });
  useEffect(() => {
    if (!pin || !live || open >= 0) return;
    const id = setTimeout(() => setCur((c) => (c + 1) % 6), 4000);
    return () => clearTimeout(id);
  }, [pin, live, open, cur, idle]);
  return (
    <section className={'l2-dark vs2-tiles' + (pin ? ' pin' : '')} data-room="dark" ref={sec}>
      <div className="vs2-pin">
        <div className="l2-wrap vs2-room">
          <div className="vs2-side">
            <h2 className="l2-head vs2-tiles-h">What you get for the price of one integration</h2>
            <ol className="vs2-grid">
              {FACTS.map(([t, d], i) => <Row key={t} t={t} d={d} i={i} at={cur} onOpen={setOpen} onPeek={setCur} />)}
            </ol>
          </div>
          <div className="vs2-stage" aria-hidden="true">
            <p className="vs2-sn l2-mono"><b className="l2-tnum">{String(cur + 1).padStart(2, '0')}</b> / 06</p>
            <div className="vs2-big" key={cur} data-on="">
              <Pic i={cur} />
            </div>
            <p className="vs2-st">{FACTS[cur][0]}</p>
            <i className="vs2-prog"><i style={{ transform: `scaleX(${(cur + 1) / 6})` }} /></i>
          </div>
        </div>
      </div>
      <Sheet open={open >= 0} onClose={() => setOpen(-1)} title={FACTS[at][0]} kicker={String(at + 1).padStart(2, '0') + ' / 06'} wide className="vs2-sheet">
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

/* Beyond: name a fleet; see what a batch launch will create, and in which inventory. */
function Name() {
  const [prefix, setPrefix] = useState('train');
  const [count, setCount] = useState(3);
  const [dry, setDry] = useState(true);
  const sec = useRef(null);
  const here = useInView(sec, { once: true, amount: 0.4 });
  const calm = useCalm();
  const armed = useRef(false);
  /* Arrival: the batch names itself, 01 then 02 then 03, the first time the section is reached (untouched only). */
  useEffect(() => {
    if (calm || !sec.current || sec.current.getBoundingClientRect().top < innerHeight) return;
    armed.current = true; setCount(1);
  }, [calm]);
  useEffect(() => {
    if (!here || !armed.current) return;
    const a = setTimeout(() => armed.current && setCount(2), 500), b = setTimeout(() => { if (armed.current) setCount(3); armed.current = false; }, 1000);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, [here]);
  const touch = (fn) => () => { armed.current = false; fn(); };
  const px = prefix.toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 24) || 'train';
  return (
    <section className="l2-sec vs2-name" ref={sec}>
      <div className="l2-wrap l2-grid">
        <div className="vs2-name-l">
          <h2 className="l2-head">{FACTS[1][0]}</h2>
          <div className="vs2-form">
            <label><span className="l2-mono">prefix</span><input value={prefix} onChange={(e) => { armed.current = false; setPrefix(e.target.value); }} spellCheck="false" autoComplete="off" /></label>
            <div className="vs2-count" role="group" aria-label="Machines">
              <span className="l2-mono">machines</span>
              <div><button type="button" onClick={touch(() => setCount((c) => Math.max(1, c - 1)))} aria-label="Fewer"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg></button><b className="l2-fig">{count}</b><button type="button" onClick={touch(() => setCount((c) => Math.min(8, c + 1)))} aria-label="More"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg></button></div>
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

/* The close's object: Visor in miniature. The inventory the visitor ends with: the batch lands machine by machine
   under its prefix beside the node pool and the cluster, then the console opens. Plays once on arrival. */
function Close() {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.5 });
  return (
    <div className="vs2-close" ref={ref} data-on={seen ? '' : undefined} aria-hidden="true">
      <p className="vs2-k l2-mono">one inventory · prefix <b>train</b></p>
      <ul>
        {['train-01', 'train-02', 'train-03'].map((m, i) => <li key={m} style={{ '--d': i * 160 + 'ms' }}><i className="m" /><b className="l2-mono">{m}</b><span>machine</span></li>)}
        <li style={{ '--d': '480ms' }}><i className="p" /><b className="l2-mono">gpu-pool</b><span>node pool</span></li>
        <li style={{ '--d': '640ms' }}><i className="k" /><b className="l2-mono">cluster</b><span>managed Kubernetes</span></li>
      </ul>
      <p className="vs2-close-con l2-mono"><span>SSH</span><span>train-01</span><code>$ <i className="vs2-caret">▍</i></code></p>
    </div>
  );
}

export default function Visor() {
  return (
    <main id="main" className="l2-page vs2" data-ask="off">
      <StageHero look="rise" className="vs2-hero" kick="hanzoai/visor" title="Hanzo Visor" sub="Machines from several clouds, through one API" acts={[['View on GitHub', GH]]} travel={{ s: [1.04, 1], y: ['1svh', '-10svh'] }}>
        <Fleet />
      </StageHero>
      <Tiles />
      <Name />
      <Finale name="Visor" head="Get started with Hanzo Visor" ask={['View on GitHub', GH]} object={<Close />} prompt="Read https://hanzo.ai/skill.md and use Hanzo Visor in my project. Start with: hanzo visor machines list" tag="Machines, volumes, and clusters" />
    </main>
  );
}
