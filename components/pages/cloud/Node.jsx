'use client';
/* Node. Signature: your machine joins the fabric and gets paid by the level of the work. `hanzo fabric up` starts the
   node; it reports its hardware, the cluster routes work to it, and each finished job climbs the five levels of work
   that scale a provider's share; batches settle as Merkle roots committed to Lux, one block after another. The six
   reasons are a two-column spread with oversized numerals. Every word and link is Hanzo's. */
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EASE, Rise } from '../../ui';
import { A } from '../../kit';
import { Hero, Paste, Related, Get, useLive } from './Frame';
import './Node.css';

const LEVELS = ['embeddings and small models', 'chat-sized models', 'large and multimodal', 'training', 'specialized compute like proofs'];
const HEX = '0123456789abcdef';
const root = (n) => '0x' + Array.from({ length: 10 }, (_, i) => HEX[(n * 7 + i * 11 + n * i) % 16]).join('');

function Up() {
  const [ref, live, calm] = useLive(0.3);
  const [t, setT] = useState(calm ? 12 : 0);
  useEffect(() => {
    if (calm || !live) return;
    const id = setTimeout(() => setT((v) => (v >= 14 ? 3 : v + 1)), t < 3 ? 900 : 1100);
    return () => clearTimeout(id);
  }, [t, live, calm]);
  const job = t >= 3 ? (t - 3) % LEVELS.length : -1;
  const blocks = Math.max(0, Math.floor((t - 3) / 2));
  return (
    <div className="nd-up" ref={ref} aria-hidden="true">
      <div className="nd-term">
        <p><span>$</span> hanzo fabric up</p>
        {t >= 1 && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="d">joined the fabric · peer-to-peer</motion.p>}
        {t >= 2 && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="d">reports what it can serve</motion.p>}
        <div className="nd-hw">{['Consumer cards', 'datacenter accelerators', 'Apple Silicon'].map((h, i) => <span key={h} className={t >= 2 && i === 0 ? 'on' : ''}>{h}</span>)}</div>
      </div>
      <div className="nd-work">
        <p className="nd-k">level of the work</p>
        <ol>
          {LEVELS.map((l, i) => (
            <li key={l} className={job === i ? 'on' : ''}>
              <i style={{ width: 20 + i * 18 + '%' }} />
              <span>{l}</span>
            </li>
          ))}
        </ol>
      </div>
      <div className="nd-lux">
        <p className="nd-k">settled on Lux</p>
        <div className="nd-chain">
          <AnimatePresence initial={false}>
            {Array.from({ length: Math.min(blocks, 4) }).map((_, i) => {
              const n = blocks - Math.min(blocks, 4) + i;
              return <motion.span key={n} layout initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, ease: EASE }}><b>Merkle root</b>{root(n + 1)}</motion.span>;
            })}
          </AnimatePresence>
          {blocks === 0 && <em>waiting for work</em>}
        </div>
      </div>
    </div>
  );
}

const WHY = [
  ['The hardware you already have', 'Consumer cards, datacenter accelerators, or Apple Silicon. The node reports what it can serve and the cluster routes to it on that basis.'],
  ['Paid out of the block reward', "A tenth of the block reward is set aside for AI compute. A provider's share is scaled by the level of the work — embeddings and small models, chat-sized models, large and multimodal, training, or specialized compute like proofs."],
  ['The cluster knows who has what', 'Ask it for models and it lists everything served across the peers your node can see. Ask it to route and it names who would answer; ask for placement and it says where a model nobody serves should be loaded.'],
  ['Attested, then trusted', "A node's confidential-compute tier is attested rather than declared, and its share is scaled by that tier and by a trust score. Claiming a capability is not the same as proving one."],
  ['Three commands, no orchestration', 'up starts it on the active network, join switches network and starts it, stop signals the process this CLI started by its recorded pid — and never anything else that happens to share the name.'],
  ['Settled on Lux', 'Work is ordered on the Hanzo L2 and committed to Lux as a Merkle root, so what a node did is anchored where it cannot quietly be rewritten later.'],
];

export default function Node() {
  return (
    <main className="nd">
      <Hero
        look="flip"
        kick="Decentralized AI Compute"
        title="Hanzo Node"
        lede="hanzod is the node that runs hanzo.network. It joins the fabric over a peer-to-peer transport, serves models to whatever the cluster routes to it, and settles the work on Lux. One Rust binary, started with hanzo fabric up."
        acts={[['Run a Node', 'https://docs.hanzo.ai/docs/proof-of-ai/node-operator'], ['View Source', 'https://github.com/hanzoai']]}
      >
        <Up />
      </Hero>
      <section className="x-sec nd-why">
        <div className="x-wrap">
          <div className="nd-why-h"><Rise as="h2">Why Run a Hanzo Node</Rise><span className="x-mono">01 / 06 — 06 / 06</span></div>
          <div className="nd-spread">
            {WHY.map(([t, d], i) => (
              <Rise key={t} className="nd-item" y={22} delay={(i % 2) * 0.08}>
                <span className="nd-big" aria-hidden="true">{i + 1}</span>
                <div><span className="nd-n">{String(i + 1).padStart(2, '0')} / 06</span><h3>{t}</h3><p>{d}</p></div>
              </Rise>
            ))}
          </div>
        </div>
      </section>
      <section className="x-sec nd-put" data-room="dark">
        <div className="x-wrap nd-put-grid">
          <div>
            <Rise as="h2">Put a machine on the fabric</Rise>
            <Rise as="p" delay={0.08}>Install the CLI, pick a network, run hanzo fabric up. The node binary is resolved from your PATH or an env var — the CLI runs it and never builds it for you.</Rise>
            <Rise className="nd-acts" delay={0.14}>
              <A to="https://docs.hanzo.ai/docs/proof-of-ai/node-operator" className="x-btn solid">Quickstart</A>
              <A to="/network" className="x-btn">About the Network</A>
              <A to="https://github.com/hanzoai" className="x-btn">View on GitHub</A>
            </Rise>
          </div>
          <ol className="nd-cmds" aria-hidden="true">
            {[['up', 'starts it on the active network'], ['join', 'switches network and starts it'], ['stop', 'signals the process this CLI started']].map(([c, d], i) => (
              <Rise as="li" key={c} delay={0.1 + i * 0.1}><code>hanzo fabric {c}</code><span>{d}</span></Rise>
            ))}
          </ol>
        </div>
      </section>
      <section className="x-sec nd-paste">
        <div className="x-wrap">
          <Paste name="Node" prompt="Read https://hanzo.ai/skill.md and use Hanzo Node in my project. Start with: hanzo node list" />
          <Related className="nd-rel" title="Node" items={[['Node docs →', 'https://docs.hanzo.ai/docs/proof-of-ai/node-operator']]} />
        </div>
      </section>
      <Get name="Node" tag="Standalone Hanzo node" self="https://docs.hanzo.ai/docs/proof-of-ai/node-operator" />
    </main>
  );
}
