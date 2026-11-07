'use client';
/* Network. Signature: peers, not regions. The fabric is drawn as the peers connected right now, each wearing the models
   it has loaded; ask for a model and the request walks the links to a peer that already holds it, while a model nobody
   has loaded gets a placement. The six facts read as a ledger anchored the way the work is: each one a block in a
   chain. Two ends of the same fabric close the page, and lean toward your pointer. Every word and link is Hanzo's.
   Beyond: Lend it to. Choose inference or builds and get the one command that puts the machine there
   (hanzo fabric join or hanzo runner), with Hanzo's own line for each and a copy button. */
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EASE, Rise, Magnetic, Copy } from '../../ui';
import { A } from '../../kit';
import { Hero, Paste, Related, Get, useLive, useSteps } from './Frame';
import './Network.css';

// peers: [x%, y%, models loaded]
const PEERS = [[14, 22, ['zen']], [36, 12, ['kai']], [62, 18, []], [86, 26, ['enso']], [24, 52, ['koe']], [48, 44, ['zen', 'kai']], [74, 54, []], [12, 82, []], [38, 80, ['enso']], [64, 84, ['zen']], [88, 78, ['koe']]];
const LINKS = [[0, 1], [1, 2], [2, 3], [0, 4], [1, 5], [2, 5], [3, 6], [4, 5], [5, 6], [4, 7], [4, 8], [5, 8], [5, 9], [6, 9], [6, 10], [8, 9], [9, 10]];
// [model asked for, path of peers, placed (nobody had it)]
const ASKS = [['kai', [7, 4, 5]], ['enso', [7, 4, 8]], ['koe', [7, 4]], ['uta', [7, 4, 5, 6], true]];

function Fabric() {
  const [ref, live] = useLive(0.3);
  const [at, choose] = useSteps(ASKS.length, 3400, live);
  const [model, path, placed] = ASKS[at];
  const end = path[path.length - 1];
  const onPath = (a, b) => path.some((p, i) => i > 0 && ((path[i - 1] === a && p === b) || (path[i - 1] === b && p === a)));
  return (
    <div className="nw-fab" ref={ref}>
      <svg className="nw-links" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {LINKS.map(([a, b]) => <line key={a + '-' + b} x1={PEERS[a][0]} y1={PEERS[a][1]} x2={PEERS[b][0]} y2={PEERS[b][1]} className={onPath(a, b) ? 'on' : ''} />)}
      </svg>
      {PEERS.map(([x, y, ms], i) => {
        const lit = path.includes(i);
        return (
          <div key={i} className={'nw-peer' + (lit ? ' lit' : '') + (i === end ? ' end' : '') + (i === 7 ? ' you' : '')} style={{ left: x + '%', top: y + '%' }} aria-hidden="true">
            <i />
            {i === 7 ? <span className="nw-tag you">you</span> : ms.map((m) => <span key={m} className={'nw-tag' + (m === model && i === end ? ' hit' : '')}>{m}</span>)}
            {placed && i === end && <motion.span key={'p' + at} className="nw-tag hit" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.2, type: 'spring', stiffness: 300, damping: 18 }}>{model}</motion.span>}
          </div>
        );
      })}
      <div className="nw-ask">
        <p className="nw-ask-k">ask the fabric for</p>
        <div className="nw-models" role="tablist" aria-label="Model">
          {ASKS.map(([m], i) => <button key={m} type="button" role="tab" aria-selected={at === i} onClick={() => choose(i)}>{m}</button>)}
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.p key={at} className="nw-ans" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease: EASE }}>
            {placed ? 'nobody has it loaded · placement' : 'a peer that already has it loaded'}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}

const FACTS = [
  ['Peers, not regions', 'There is no region menu to choose from. A node discovers its peers over the fabric, and the topology is whatever is connected right now — you can ask it and read the answer.'],
  ['Metered by the work', "A tenth of the block reward funds AI compute, and a provider's share is scaled by the level of the work it did. No subscription, no seat, nothing billed while a machine sits idle."],
  ['Proof of AI', "A node's confidential-compute tier is attested rather than declared, and what it earns is scaled by that attestation and by a trust score. A claim about a machine is worth nothing on its own."],
  ['Whatever the peers have loaded', 'Ask the cluster which models it serves, which node would answer for one, and where a model nobody has loaded should be placed. Routing follows what is really in memory.'],
  ['One command to join', 'hanzo fabric join names a network and starts the node on it. If you would rather lend the machine to builds than to inference, hanzo runner offers the same box as a CI runner.'],
  ['Anchored, not asserted', 'Work is ordered on the Hanzo L2 and committed to Lux as a Merkle root, under a stake-weighted validator set. What you can check is what settled, not what a status page says.'],
];

const LEND = [['inference', 'hanzo fabric join', 'names a network and starts the node on it.'], ['builds', 'hanzo runner', 'offers the same box as a CI runner.']];

function Lend() {
  const [k, setK] = useState(0);
  const [, cmd, d] = LEND[k];
  return (
    <div className="nw-lend">
      <p className="nw-end-k" id="nw-lend-k">Lend the machine to</p>
      <div className="nw-lend-c" role="group" aria-labelledby="nw-lend-k">
        {LEND.map(([w], i) => <button key={w} type="button" aria-pressed={k === i} onClick={() => setK(i)}>{w}</button>)}
      </div>
      <p className="nw-lend-a" aria-live="polite"><code>{cmd}</code> {d}</p>
      <Copy text={cmd} label={'Copy ' + cmd} />
    </div>
  );
}

function Chain() {
  return (
    <section className="x-sec nw-chain">
      <div className="x-wrap">
        <div className="nw-chain-h"><h2>How the Network Works</h2><span className="x-mono">01 / 06 — 06 / 06</span></div>
        <ol className="nw-blocks">
          {FACTS.map(([t, d], i) => (
            <Rise as="li" key={t} delay={i * 0.05} y={24}>
              <span className="nw-blk">block {String(i + 1).padStart(2, '0')} / 06</span>
              <h3>{t}</h3>
              <p>{d}</p>
              <i className="nw-hash" aria-hidden="true" />
            </Rise>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default function Network() {
  return (
    <main className="nw">
      <Hero
        dark
        look="stack"
        kick="Compute Marketplace"
        title="Hanzo Network"
        lede="hanzo.network is the fabric that hanzod nodes form. Put a machine on it and it serves models to whoever the cluster routes there. Ask the fabric for a model and it finds a peer that already has it loaded."
        acts={[['Buy Compute', 'https://docs.hanzo.ai/docs/network'], ['Run a Node', '/node']]}
      >
        <Fabric />
      </Hero>
      <Chain />
      <section className="x-sec nw-ends">
        <div className="x-wrap">
          <div className="nw-ends-h">
            <h2>Two ends of the same fabric</h2>
            <p>Take a key and call it, or bring a machine and serve it. Most people who do the second started by doing the first.</p>
          </div>
          <div className="nw-two">
            <Magnetic strength={0.08}><A to="https://platform.hanzo.ai/api-keys" className="nw-end" data-thumb="Get an API Key"><span className="nw-end-k">call it</span><b>Get an API Key</b><span className="nw-arrow">→</span></A></Magnetic>
            <Magnetic strength={0.08}><A to="/node" className="nw-end dark" data-morph><span className="nw-end-k">serve it</span><b>Provide Compute</b><span className="nw-arrow">→</span></A></Magnetic>
          </div>
          <Lend />
          <div className="nw-gh"><A to="https://github.com/hanzoai" className="x-btn">View on GitHub</A></div>
        </div>
      </section>
      <section className="x-sec nw-paste">
        <div className="x-wrap">
          <Paste name="Network" prompt="Read https://hanzo.ai/skill.md and use Hanzo Network in my project. Start with: hanzo network list" />
          <Related className="nw-rel" title="Network" items={[['Network docs →', 'https://docs.hanzo.ai/docs/network']]} />
        </div>
      </section>
      <Get name="Network" tag="Decentralized compute network" self="https://docs.hanzo.ai/docs/network" />
    </main>
  );
}
