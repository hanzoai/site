'use client';
/* Stream. Signature: the event tape. Records run past on a tape, each with the Kafka offset stamped into its batch
   header; a consumer group's committed offset rides the tape as a marker, the consumer dies and comes back exactly where
   it left off, and a batch whose chain does not line up bounces off with INVALID_RECORD instead of being written. The
   Kafka clients plug into the same port with only the bootstrap server changed. Every word, figure and link is Hanzo's. */
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EASE, Rise } from '../../ui';
import { A } from '../../kit';
import { Hero, Paste, Get, Code, useLive, useEvery } from './Frame';
import './Stream.css';

const CLIENTS = ['kafka-python', 'sarama', 'confluent-kafka', 'franz-go'];

function Tape() {
  const [ref, live] = useLive(0.3);
  const [off, setOff] = useState(1200); // newest offset on the tape
  const [tick, setTick] = useState(0);
  useEvery(800, live, () => { setTick((t) => t + 1); setOff((o) => o + 1); });
  const phase = Math.floor(tick / 6) % 3; // 0 consuming, 1 consumer down, 2 back at its offset
  const committed = phase === 1 ? off - 6 : off - 3;
  const bad = tick % 9 === 4;
  return (
    <div className="st-tape-wrap" ref={ref} aria-hidden="true">
      <div className="st-clients">{CLIENTS.map((c) => <span key={c}>{c}</span>)}<b>stream.hanzo.ai:9092</b></div>
      <div className="st-tape">
        <AnimatePresence initial={false}>
          {Array.from({ length: 12 }).map((_, i) => {
            const n = off - 11 + i;
            return (
              <motion.div key={n} layout className={'st-rec' + (n === committed ? ' mark' : '') + (n > committed ? ' ahead' : '')} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ type: 'spring', stiffness: 260, damping: 30 }}>
                <span className="st-off">{n}</span>
                <i />
                {n === committed && <em className={phase === 1 ? 'down' : ''}>my-service</em>}
              </motion.div>
            );
          })}
        </AnimatePresence>
        <AnimatePresence>{bad && <motion.div className="st-bad" initial={{ x: 60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 80, opacity: 0, transition: { duration: 0.4 } }}>INVALID_RECORD</motion.div>}</AnimatePresence>
      </div>
      <div className="st-under">
        <span>one topic partition = one durable PubSub stream</span>
        <span className={'st-state' + (phase === 1 ? ' down' : '')}>{phase === 1 ? 'consumer down · offset kept' : phase === 2 ? 'back where it left off' : 'committed offset'}</span>
      </div>
    </div>
  );
}

const FACTS = [
  ['It speaks Kafka', 'Produce, Fetch, ListOffsets, Metadata, OffsetCommit, OffsetFetch, FindCoordinator, JoinGroup, SyncGroup, Heartbeat, CreateTopics and ApiVersions, at the versions modern clients negotiate. kafka-python, sarama, confluent-kafka and franz-go all connect.'],
  ['The log lives in PubSub', "One topic partition is one durable PubSub stream. Retention, replicas and disk are that stream's settings, so the thing actually holding your events is a system you already run and already back up."],
  ['Nothing to operate', 'One Go binary that keeps no state of its own. Restart it, run several, roll it mid-deploy — the log is somewhere else, so the gateway is never the piece you are afraid to touch.'],
  ['Offsets survive a restart', "A group's committed offsets live in a PubSub key-value bucket, so a consumer that dies comes back where it left off instead of at the top. Ask for an offset that has aged out and you get OFFSET_OUT_OF_RANGE, so the client resets rather than hangs."],
  ['Offsets are stamped, not inferred', "Every Kafka offset is written into the record batch header when the batch is produced, and read straight back from there. Deriving them from the store's own sequence numbers works right up until the sequence has gaps in it — and then one record can make every fetch after it unreadable."],
  ['Bad batches are refused on arrival', 'A produce whose batch chain does not line up is refused with INVALID_RECORD instead of being written and discovered later by a consumer that cannot get past it. The scan that recovers a partition\'s bounds is capped, so a damaged topic degrades rather than stalls.'],
];

const CODE = `import json
from kafka import KafkaProducer, KafkaConsumer

# The only line that changes
producer = KafkaProducer(
    bootstrap_servers=["stream.hanzo.ai:9092"],
    value_serializer=lambda v: json.dumps(v).encode(),
)

producer.send("events", {"type": "user.signup", "user_id": "usr_123"})

# Consumer groups work identically
consumer = KafkaConsumer(
    "events",
    bootstrap_servers=["stream.hanzo.ai:9092"],
    group_id="my-service",
    auto_offset_reset="earliest",
)

for message in consumer:
    process(message.value)`;

export default function Stream() {
  return (
    <main className="st">
      <Hero look="stack" kick="Kafka Wire Protocol" title="Hanzo Stream" sub="A Kafka port in front of Hanzo PubSub" acts={[['GitHub', 'https://github.com/hanzoai/stream']]}>
        <Tape />
      </Hero>
      <section className="x-sec st-facts" data-room="dark">
        <div className="x-wrap">
          <div className="st-facts-h"><Rise as="h2">Your clients, our store</Rise><span className="x-mono">01 / 06 — 06 / 06</span></div>
          <ol className="st-ruler">
            {FACTS.map(([t, d], i) => (
              <Rise as="li" key={t} y={18}>
                <span className="st-ofs">offset {String(i + 1).padStart(4, '0')}</span>
                <div><h3>{t}</h3><p>{d}</p></div>
              </Rise>
            ))}
          </ol>
          <ul className="st-figs">{[['Kafka', 'Wire protocol'], ['PubSub', 'Holds the log'], ['Stateless', 'No broker disk'], ['Durable', 'At-least-once']].map(([a, b], i) => <Rise as="li" key={a} delay={i * 0.06}><b>{a}</b><span>{b}</span></Rise>)}</ul>
        </div>
      </section>
      <section className="x-sec st-code">
        <div className="x-wrap st-code-grid">
          <div>
            <Rise as="h2">One line changes: the bootstrap server</Rise>
            <Paste name="Stream" prompt="Read https://hanzo.ai/skill.md and use Hanzo Stream in my project." className="st-paste" />
          </div>
          <Code light title="Stream" mark="stream.hanzo.ai:9092" tabs={[{ k: 'producer.py', code: CODE, lang: 'python' }]} />
        </div>
      </section>
      <section className="st-walk">
        <div className="x-wrap st-walk-in">
          <div><Rise as="h2">Point the bootstrap server at it</Rise><Rise as="p" delay={0.08}>The clients stay as they are. The cluster underneath them goes away.</Rise></div>
          <A to="https://github.com/hanzoai/stream" className="x-btn">View on GitHub</A>
        </div>
      </section>
      <Get name="Stream" tag="Event stream" repo={['hanzoai/stream', 'https://github.com/hanzoai/stream']} stars="4 stars" />
    </main>
  );
}
