'use client';
/* Network, v2 launch page (Cloud 3).
   V2: 8/10 The fabric is the first screen: huge type over a live peer map where a request walks to whoever has the model loaded; six facts become a chain of blocks that stacks as you scroll; one dark room for the two ends.
   Signature: ask the fabric. A full-bleed map of the peers connected right now, each wearing the models it has loaded;
   a request leaves "you", walks the links to a peer that already has the model in memory, and a model nobody has loaded
   gets a placement. It runs by itself; pick a model to steer it.
   Beyond: lend it to. In chapter five choose inference or builds and get the one command that puts the machine there
   (hanzo fabric join or hanzo runner), with Hanzo's own line for each and a copy button.
   Motion: signature = the request walking the fabric; supporting = the map zooming in as you leave the hero and the
   pinned chain of blocks (scroll), the clip wipe into the dark room. Every word and link is Hanzo's; the map is drawn. */
import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';
import { Copy } from '../../ui';
import { A } from '../../kit';
import { Paste, useSteps } from './Frame';
import PinnedChapters from '../../v2/PinnedChapters';
import ClipWipe from '../../v2/ClipWipe';
import LaunchClose from '../../v2/LaunchClose';
import LineMask from '../../v2/LineMask';
import './Network.css';

/* ---------- the hero: the fabric, full-bleed ---------- */
// peers: [x%, y%, models loaded]; index 9 is you
const PEERS = [[55, 13, ['zen']], [73, 8, ['kai']], [92, 17, []], [64, 33, ['zen', 'kai']], [84, 37, ['enso']], [46, 49, []], [71, 55, ['koe']], [94, 57, []], [31, 60, ['enso']], [57, 84, []], [80, 63, ['zen']]];
const LINKS = [[0, 1], [1, 2], [0, 3], [1, 3], [2, 4], [3, 4], [3, 5], [3, 6], [4, 6], [4, 7], [5, 8], [5, 6], [6, 7], [6, 10], [7, 10], [5, 9], [6, 9], [8, 9], [9, 10], [0, 5]];
const YOU = 9;
// [model asked for, path of peers from you, placed (nobody had it loaded)]
const ASKS = [['kai', [9, 5, 3]], ['enso', [9, 8]], ['koe', [9, 6]], ['uta', [9, 6, 7], true]];
const HOP = 0.55;

function useSize(ref) {
  const [s, setS] = useState({ w: 0, h: 0 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setS({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return s;
}

function Fabric({ at, arrived, calm }) {
  const box = useRef(null);
  const { w, h } = useSize(box);
  const [model, path, placed] = ASKS[at];
  const end = path[path.length - 1];
  const hop = (a, b) => path.findIndex((p, i) => i > 0 && ((path[i - 1] === a && p === b) || (path[i - 1] === b && p === a)));
  return (
    <div className="nw-map" ref={box} aria-hidden="true">
      <svg className="nw-links" viewBox="0 0 100 100" preserveAspectRatio="none">
        {LINKS.map(([a, b]) => {
          const k = hop(a, b);
          return <line key={a + '-' + b} x1={PEERS[a][0]} y1={PEERS[a][1]} x2={PEERS[b][0]} y2={PEERS[b][1]} className={k > 0 ? 'on' : ''} style={k > 0 ? { transitionDelay: (k - 1) * HOP + 's' } : undefined} />;
        })}
      </svg>
      {PEERS.map(([x, y, ms], i) => {
        const k = path.indexOf(i);
        return (
          <div key={i} className={'nw-peer' + (k >= 0 ? ' lit' : '') + (i === end && arrived ? ' end' : '') + (i === YOU ? ' you' : '')} style={{ left: x + '%', top: y + '%', '--d': Math.max(0, k) * HOP + 's' }}>
            <i />
            <span className="nw-tags">
              {i === YOU ? <b className="nw-tag me">you</b> : ms.map((m) => <b key={m} className={'nw-tag' + (m === model && i === end && arrived ? ' hit' : '')}>{m}</b>)}
              {placed && i === end && arrived && <motion.b key={'p' + at} className="nw-tag hit" initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 22 }}>{model}</motion.b>}
            </span>
          </div>
        );
      })}
      {!calm && w > 0 && (
        <motion.span
          key={'pk' + at}
          className="nw-packet"
          initial={{ x: (PEERS[YOU][0] / 100) * w, y: (PEERS[YOU][1] / 100) * h, opacity: 0 }}
          animate={{ x: path.map((p) => (PEERS[p][0] / 100) * w), y: path.map((p) => (PEERS[p][1] / 100) * h), opacity: [1, 1, 0] }}
          transition={{ duration: HOP * (path.length - 1), ease: 'easeInOut', opacity: { duration: HOP * (path.length - 1) + 0.25, times: [0, 0.8, 1] } }}
        />
      )}
    </div>
  );
}

function Ask({ at, choose, arrived }) {
  const [model, path, placed] = ASKS[at];
  return (
    <div className="nw-ask">
      <p className="nw-ask-k" id="nw-ask-k">ask the fabric for</p>
      <div className="nw-models" role="radiogroup" aria-labelledby="nw-ask-k">
        {ASKS.map(([m], i) => <button key={m} type="button" role="radio" aria-checked={at === i} onClick={() => choose(i)}>{m}</button>)}
      </div>
      <p className="nw-route" aria-hidden="true">{path.map((p, i) => (i === 0 ? 'you' : 'peer ' + String(p).padStart(2, '0'))).join('  →  ')}</p>
      <p className={'nw-ans' + (arrived ? ' on' : '')} aria-live="polite">{arrived ? (placed ? `nobody has ${model} loaded · placement` : `a peer that already has ${model} loaded`) : 'routing…'}</p>
    </div>
  );
}

function Hero() {
  const ref = useRef(null);
  const [live, setLive] = useState(true);
  const calm = useReducedMotion();
  const [at, choose] = useSteps(ASKS.length, 3800, live && !calm);
  const [arrived, setArrived] = useState(true);
  useEffect(() => {
    if (calm) { setArrived(true); return; }
    setArrived(false);
    const t = setTimeout(() => setArrived(true), HOP * (ASKS[at][1].length - 1) * 1000 + 120);
    return () => clearTimeout(t);
  }, [at, calm]);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const zoom = useTransform(scrollYProgress, [0, 1], [1, 1.22]);
  const fade = useTransform(scrollYProgress, [0.2, 0.9], [1, 0.25]);
  useEffect(() => scrollYProgress.on('change', (p) => setLive(p < 0.95)), [scrollYProgress]);
  return (
    <section className="nw-hero" ref={ref} data-morph-target>
      <motion.div className="nw-map-wrap" style={calm ? undefined : { scale: zoom, opacity: fade }}>
        <Fabric at={at} arrived={arrived} calm={calm} />
      </motion.div>
      <div className="lx-wrap nw-hero-in">
        <div className="nw-hero-top">
          <p className="lx-kick"><b>●</b> Compute Marketplace</p>
          <LineMask as="h1" className="lx-display nw-h1" lines={['Hanzo', 'Network']} />
        </div>
        <div className="nw-hero-low">
          <div className="nw-hero-copy">
            <p className="nw-lede">hanzo.network is the fabric that hanzod nodes form. Put a machine on it and it serves models to whoever the cluster routes there. Ask the fabric for a model and it finds a peer that already has it loaded.</p>
            <div className="nw-acts">
              <A to="https://docs.hanzo.ai/docs/network" className="lx-cta" data-thumb="Buy Compute">Buy Compute</A>
              <A to="/node" className="lx-ghost">Run a Node</A>
            </div>
          </div>
          <Ask at={at} choose={choose} arrived={arrived} />
        </div>
      </div>
    </section>
  );
}

/* ---------- the chapters' object: a chain of blocks that stacks ---------- */
const FACTS = [
  ['Peers, not regions', 'There is no region menu to choose from. A node discovers its peers over the fabric, and the topology is whatever is connected right now — you can ask it and read the answer.'],
  ['Metered by the work', "A tenth of the block reward funds AI compute, and a provider's share is scaled by the level of the work it did. No subscription, no seat, nothing billed while a machine sits idle."],
  ['Proof of AI', "A node's confidential-compute tier is attested rather than declared, and what it earns is scaled by that attestation and by a trust score. A claim about a machine is worth nothing on its own."],
  ['Whatever the peers have loaded', 'Ask the cluster which models it serves, which node would answer for one, and where a model nobody has loaded should be placed. Routing follows what is really in memory.'],
  ['One command to join', 'hanzo fabric join names a network and starts the node on it. If you would rather lend the machine to builds than to inference, hanzo runner offers the same box as a CI runner.'],
  ['Anchored, not asserted', 'Work is ordered on the Hanzo L2 and committed to Lux as a Merkle root, under a stake-weighted validator set. What you can check is what settled, not what a status page says.'],
];
const HASH = ['0x4f1c…a2', '0x9be0…17', '0x2d7a…c9', '0xe381…5f', '0x7c52…0b', '0xa96d…e4'];
const LEND = [['inference', 'hanzo fabric join', 'names a network and starts the node on it.'], ['builds', 'hanzo runner', 'offers the same box as a CI runner.']];

function Mini({ i, lend }) {
  if (i === 0) return (
    <div className="nw-m0">
      <span className="nw-region">region ▾</span>
      <svg viewBox="0 0 200 90" className="nw-cl"><g>{[[20, 45, 70, 20], [70, 20, 120, 50], [120, 50, 180, 25], [70, 20, 90, 75], [90, 75, 120, 50], [120, 50, 165, 78], [20, 45, 90, 75]].map(([a, b, c, d], k) => <line key={k} x1={a} y1={b} x2={c} y2={d} />)}</g>{[[20, 45], [70, 20], [120, 50], [180, 25], [90, 75], [165, 78]].map(([x, y], k) => <circle key={k} cx={x} cy={y} r="6" />)}</svg>
      <p>topology · connected right now</p>
    </div>
  );
  if (i === 1) return (
    <div className="nw-m1">
      <p className="nw-mk">block reward</p>
      <div className="nw-ten">{Array.from({ length: 10 }).map((_, k) => <i key={k} className={k === 0 ? 'ai' : ''} />)}</div>
      <p className="nw-mk"><b>a tenth</b> · AI compute</p>
      <ul className="nw-share">{[0.9, 0.5, 0].map((v, k) => <li key={k}><span>{k === 2 ? 'idle' : 'provider'}</span><i><b style={{ transform: `scaleX(${v})` }} /></i><em>{k === 2 ? 'nothing billed' : 'by the work'}</em></li>)}</ul>
    </div>
  );
  if (i === 2) return (
    <div className="nw-m2">
      <div className="nw-claim no"><span>declared</span><b>✕</b></div>
      <div className="nw-claim yes"><span>attested</span><b>✓</b></div>
      <p className="nw-mk">trust score</p>
      <i className="nw-trust"><b /></i>
    </div>
  );
  if (i === 3) return (
    <ul className="nw-m3">
      <li><code>models</code><span>zen · kai · enso · koe</span></li>
      <li><code>route kai</code><span>peer 03</span></li>
      <li><code>placement uta</code><span>peer 07</span></li>
    </ul>
  );
  if (i === 4) return (
    <div className="nw-m4">
      <p className="nw-cmd"><span>$</span> {LEND[lend][1]}</p>
      <p className="nw-mk">{lend ? 'CI runner' : 'inference'}</p>
    </div>
  );
  return (
    <div className="nw-m5">
      <svg viewBox="0 0 200 110">
        {[[30, 95, 60, 60], [90, 95, 60, 60], [110, 95, 140, 60], [170, 95, 140, 60], [60, 60, 100, 22], [140, 60, 100, 22]].map(([a, b, c, d], k) => <line key={k} x1={a} y1={b} x2={c} y2={d} />)}
        {[30, 90, 110, 170].map((x) => <rect key={x} x={x - 9} y="86" width="18" height="18" rx="4" />)}
        {[60, 140].map((x) => <circle key={x} cx={x} cy="60" r="7" />)}
        <circle cx="100" cy="22" r="11" className="root" />
      </svg>
      <p className="nw-mk">Hanzo L2 → <b>Lux</b> · Merkle root</p>
    </div>
  );
}

function Chain({ step, lend }) {
  return (
    <div className="nw-chain" data-step={step}>
      {FACTS.map(([t], i) => {
        const d = step - i;
        const style = d < 0 ? { transform: 'translateY(64px) scale(.98)', opacity: 0 } : { transform: `translateY(${-d * 22}px) scale(${1 - d * 0.045})`, opacity: d > 3 ? 0 : 1 - d * 0.22 };
        return (
          <article key={t} className={'nw-block' + (d === 0 ? ' on' : '')} style={{ ...style, zIndex: 10 + i }} aria-hidden={d !== 0}>
            <div className="nw-block-h"><span>block {String(i + 1).padStart(2, '0')}</span><code>{HASH[i]}</code><em>{d > 0 ? 'settled' : 'proposed'}</em></div>
            <div className="nw-block-b"><Mini i={i} lend={lend} /></div>
            <div className="nw-block-f"><span>prev</span><code>{i ? HASH[i - 1] : 'genesis'}</code></div>
          </article>
        );
      })}
    </div>
  );
}

function Lend({ k, setK }) {
  const [, cmd, d] = LEND[k];
  return (
    <div className="nw-lend">
      <div className="nw-lend-c" role="group" aria-label="Lend the machine to">
        {LEND.map(([w], i) => <button key={w} type="button" aria-pressed={k === i} onClick={() => setK(i)}>{w}</button>)}
      </div>
      <p className="nw-lend-a" aria-live="polite"><code>{cmd}</code> {d}</p>
      <Copy text={cmd} label={'Copy ' + cmd} />
    </div>
  );
}

export default function Network() {
  const [lend, setLend] = useState(0);
  const steps = FACTS.map(([t, d], i) => ({ t, d, extra: i === 4 ? <Lend k={lend} setK={setLend} /> : null }));
  return (
    <main className="lx nw">
      <Hero />

      <section className="lx-sec nw-how">
        <div className="lx-wrap nw-how-grid">
          <p className="lx-kick">01 / 06 — 06 / 06</p>
          <LineMask as="h2" className="lx-display m" lines={['How the', 'Network Works']} inView />
        </div>
      </section>

      <PinnedChapters flip label="How the Network Works" steps={steps} per={76} visual={(at) => <Chain step={at} lend={lend} />} />

      <ClipWipe dark className="nw-ends">
        <div className="lx-wrap">
          <div className="nw-ends-h">
            <h2 className="lx-headline">Two ends of the same fabric</h2>
            <p className="lx-lede">Take a key and call it, or bring a machine and serve it. Most people who do the second started by doing the first.</p>
          </div>
          <div className="nw-two">
            <A to="https://platform.hanzo.ai/api-keys" className="nw-end" data-thumb="Get an API Key">
              <span className="lx-kick">call it</span><b>Get an API Key</b><svg viewBox="0 0 16 16" width="28" height="28" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </A>
            <A to="/node" className="nw-end acc">
              <span className="lx-kick">serve it</span><b data-morph>Provide Compute</b><svg viewBox="0 0 16 16" width="28" height="28" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </A>
          </div>
          <div className="nw-gh"><A to="https://github.com/hanzoai" className="lx-ghost">View on GitHub</A></div>
        </div>
      </ClipWipe>

      <section className="lx-sec nw-paste">
        <div className="lx-wrap">
          <Paste name="Network" prompt="Read https://hanzo.ai/skill.md and use Hanzo Network in my project. Start with: hanzo network list" />
          <div className="nw-docs"><span className="lx-kick">Network</span><A to="https://docs.hanzo.ai/docs/network" className="nw-docs-a">Network docs →</A></div>
        </div>
      </section>

      <LaunchClose name="Network" tag="Decentralized compute network" seed="network" data={[10, 6]} self="https://docs.hanzo.ai/docs/network" />
    </main>
  );
}
