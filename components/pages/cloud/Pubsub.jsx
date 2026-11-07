'use client';
/* PubSub. Signature: one message fanning out. A publish on events.user.signup is written into the EVENTS stream with
   its sequence number, then fans out: every subscriber gets a copy, a queue group hands it to exactly one member, and
   each delivery waits for its ack (an unacked one is redelivered). A replay control rewinds a consumer to any point.
   The six facts sit as a subject tree. Every word, figure and link is Hanzo's.
   Beyond: the ack policy switch. The same fan-out re-runs under each of Hanzo's three ack choices (ack every message,
   ack a sequence to cover everything below it, no acks), so you see redelivery appear and vanish before you pick one. */
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { EASE, Rise } from '../../ui';
import { A } from '../../kit';
import { Hero, Paste, Get, Code, useLive } from './Frame';
import './Pubsub.css';

// Hanzo's three ack choices, each with its own clause from "Acked, so nothing goes quiet"
const ACKS = [
  ['every', 'ack every', 'Ack every message'],
  ['below', 'ack all below', 'ack a sequence to cover everything below it'],
  ['none', 'no acks', 'ask for no acks at all when fire-and-forget is what you meant'],
];

function Fan() {
  const [ref, live, calm] = useLive(0.3);
  const [t, setT] = useState(0); // 0 publish, 1 stored, 2 fan out, 3 acks (one redelivered), 4 settle
  const [seq, setSeq] = useState(41);
  const [from, setFrom] = useState(null);
  const [ack, setAck] = useState('every');
  useEffect(() => { if (calm) setT(4); }, [calm]); // final state for reduced motion, set after hydration
  useEffect(() => {
    if (calm || !live) return;
    const id = setTimeout(() => {
      if (t >= 4) { setT(0); setSeq((s) => s + 1); } else setT(t + 1);
    }, [900, 900, 1200, 1500, 1400][t]);
    return () => clearTimeout(id);
  }, [t, live, calm]);
  const groupPick = seq % 3;
  const top = seq + (t >= 1 ? 1 : 0);
  const state = (i) => {
    if (t < 2) return ['', '—'];
    if (t < 3 || ack === 'none') return ['', 'delivered'];
    if (ack === 'every' && i === 1 && t === 3) return ['wait', 'redelivered'];
    return ['ack', ack === 'below' ? 'ack ≤ ' + top : 'ack'];
  };
  return (
    <div className="ps-fan" ref={ref}>
      <div className="ps-pub" aria-hidden="true">
        <p className="ps-k">publish</p>
        <motion.div key={seq} className="ps-msg" initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5, ease: EASE }}>
          <b>events.user.signup</b><span>{'{"id":"usr_123"}'}</span>
        </motion.div>
      </div>
      <div className="ps-stream">
        <p className="ps-k" aria-hidden="true">stream EVENTS · events.&gt;</p>
        <div className="ps-seqs" aria-hidden="true">
          {Array.from({ length: 7 }).map((_, i) => {
            const n = top - 6 + i;
            const cls = (i === 6 && t >= 1 ? 'new' : '') + (from !== null && n >= from ? ' replay' : '') + (ack === 'below' && t >= 3 ? ' acked' : '');
            return <span key={n} className={cls}>{n}</span>;
          })}
        </div>
        <div className="ps-replay" role="group" aria-label="Replay from">
          <span>replay from</span>
          {[['the beginning', 1], ['a sequence', seq - 3], ['newest', null]].map(([l, v]) => (
            <button key={l} type="button" aria-pressed={from === v} onClick={() => setFrom(v)}>{l}</button>
          ))}
        </div>
        <div className="ps-replay" role="group" aria-label="Acks">
          <span>acks</span>
          {ACKS.map(([k, l]) => <button key={k} type="button" aria-pressed={ack === k} onClick={() => setAck(k)}>{l}</button>)}
        </div>
        <p className="ps-ackline" aria-live="polite">{ACKS.find((a) => a[0] === ack)[2]}.</p>
      </div>
      <div className="ps-subs" aria-hidden="true">
        {['analytics', 'audit'].map((s, i) => {
          const [c, label] = state(i);
          return (
            <div key={s} className={'ps-sub' + (t >= 2 ? ' got' : '')} style={{ transitionDelay: i * 0.08 + 's' }}>
              <b>{s}</b>
              <span className={c}>{label}</span>
            </div>
          );
        })}
        <div className="ps-group">
          <p>queue group · exactly one</p>
          <div>{[0, 1, 2].map((k) => <i key={k} className={t >= 2 && k === groupPick ? 'on' : ''} />)}</div>
        </div>
      </div>
    </div>
  );
}

const FACTS = [
  ['Streams write it down', 'A stream captures the subjects you name and keeps them by age, by count or by bytes. A consumer starts at the beginning, at the newest message, at a sequence number or at a wall-clock time, and reads at the original pace or as fast as it can take them.'],
  ['Acked, so nothing goes quiet', 'A message is redelivered until a consumer acknowledges it. Publishers that stamp a message id get duplicates collapsed inside a window — two minutes unless you say otherwise. Ack every message, ack a sequence to cover everything below it, or ask for no acks at all when fire-and-forget is what you meant.'],
  ['Key-value buckets', 'A bucket is a stream that keeps the last value per key, so you get watches, per-key history and expiry from the same server and the same connection. It is where Hanzo Stream keeps its consumer offsets.'],
  ['Request-Reply', 'Send to a subject and wait for one answer. Put several instances of a service in a queue group on that subject and each request goes to exactly one of them — load balancing with nothing in front of them doing it.'],
  ['Object Store', 'Payloads too big to be a message are chunked into a stream and put back together on the way out, with a watch for when one changes. Same connection, same credentials, no second system to stand up.'],
  ['Accounts, not passwords', "An account walls one tenant's subjects off from another's. Credentials are nkeys or signed JWTs rather than a shared secret, permissions are granted per subject, and TLS covers the wire."],
];

const CODE = `nc, _ := nats.Connect("nats://pubsub.hanzo.ai:4222")
js, _ := nc.JetStream()

// Create a durable stream
js.AddStream(&nats.StreamConfig{
    Name:     "EVENTS",
    Subjects: []string{"events.>"},
    Storage:  nats.FileStorage,
    Replicas: 3,
})

// Publish
js.Publish("events.user.signup", []byte(\`{"id":"usr_123"}\`))

// Durable consumer with ack
sub, _ := js.PullSubscribe("events.>", "my-service")
msgs, _ := sub.Fetch(10)
for _, msg := range msgs {
    process(msg.Data)
    msg.Ack()
}`;

export default function Pubsub() {
  return (
    <main className="ps">
      <Hero dark kick="NATS JetStream" title="Hanzo PubSub" sub="The bus everything else rides" acts={[['GitHub', 'https://github.com/hanzoai/pubsub']]}>
        <Fan />
      </Hero>
      <section className="x-sec ps-tree-sec">
        <div className="x-wrap ps-tree-grid">
          <div className="ps-tree-h">
            <Rise as="h2">More than pub/sub</Rise>
            <span className="x-mono">01 / 06 — 06 / 06</span>
            <ul className="ps-figs">{[['4222', 'Client port'], ['Replay', 'From any point'], ['Durable', 'Written to disk'], ['Replicas', 'Set per stream']].map(([a, b]) => <li key={a}><b>{a}</b><span>{b}</span></li>)}</ul>
          </div>
          <ul className="ps-tree">
            {FACTS.map(([t, d], i) => (
              <Rise as="li" key={t} y={16} delay={i * 0.04}>
                <span className="ps-subj">{String(i + 1).padStart(2, '0')} / 06</span>
                <h3>{t}</h3>
                <p>{d}</p>
              </Rise>
            ))}
          </ul>
        </div>
      </section>
      <section className="x-sec ps-code">
        <div className="x-wrap ps-code-grid">
          <div>
            <h2>Publish and Subscribe</h2>
            <Paste name="Pubsub" prompt="Read https://hanzo.ai/skill.md and use Hanzo Pubsub in my project. Start with: hanzo pubsub publish" className="ps-paste" />
          </div>
          <Code light title="PubSub" tabs={[{ k: 'events.go', code: CODE }]} />
        </div>
      </section>
      <section className="ps-walk">
        <div className="x-wrap ps-walk-in">
          <div><h2>Put it between your services</h2><p>Free tier includes 1M messages/month.</p></div>
          <A to="https://github.com/hanzoai/pubsub" className="x-btn" data-thumb="View on GitHub">View on GitHub</A>
        </div>
      </section>
      <Get name="PubSub" tag="Pub/sub messaging" repo={['hanzoai/pubsub', 'https://github.com/hanzoai/pubsub']} stars="4 stars" />
    </main>
  );
}
