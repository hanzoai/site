'use client';
/* Stream (v2, Cloud 4 chat). Archetype A, Launch: a full-bleed dark tape (Stage, frame) → the facts on a sideways tape you
   scroll → the one line that changes → Get Stream → closing band. Ink, greys and white only.
   Persona: a team running Kafka clients who would rather not run a Kafka cluster. Goal: open the repo and point a client at it.
   CTA: "GitHub" / "View on GitHub" (same href: hero, ask bar, close). Metric: cta_click:stream.primary.
   V2: 8/10 a full-bleed event tape clipped into a card as you scroll, then the six facts ride a sideways tape your scroll consumes, offset by offset
   Signature: your scroll is the consumer. The section pins and the page scrolls a tape of records sideways; each fact is a
   record stamped with its offset, and the committed-offset marker at the left edge reads the offset you have reached.
   Phones get the same tape as a swipe rail.
   Beyond: "Does my client's call work?" Type a Kafka API your client makes and it answers from the twelve Hanzo lists,
   at the versions modern clients negotiate, or says it is not among them.
   Motion: horizontal scroll scrub (signature) + the hero's running partitions (idle, with Pause) + the clip-to-card
   settle (scroll) + the API checker (state). Offset labels sit under their headlines.
   Every word, figure and link is Hanzo's; offsets and records are examples. */
import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent, useInView } from 'motion/react';
import useCalm from '../../v2/useCalm';
import { Code } from './Frame';
import { useDemo, PauseBtn, useTick } from '../../v2/x-hamilton/Demo';
import StageHero from '../../v2/StageHero';
import Finale from '../../v2/Finale';
import { useWide } from '../../v2/useWide';
import './Stream.css';

const GHS = 'https://github.com/hanzoai/stream';
const CLIENTS = ['kafka-python', 'sarama', 'confluent-kafka', 'franz-go'];

/* Stage object: four partitions of records running under the clients. The consumer group's committed offset rides lane
   two; it goes down, keeps its offset, comes back where it left off; a batch whose chain does not line up bounces. */
function Tape() {
  const [ref, live, , paused, toggle] = useDemo(0.1);
  const [tick, setTick] = useState(0);
  useTick(900, live, () => setTick((t) => t + 1));
  const phase = Math.floor(tick / 5) % 3; // 0 consuming, 1 consumer down, 2 back where it left off
  const bad = tick % 7 === 3;
  return (
    <div className="st2-tape" ref={ref}>
      <PauseBtn paused={paused} onClick={toggle} className="dk st2-pause" />
      <div className="st2-clients" aria-hidden="true">
        {CLIENTS.map((c) => <span key={c} className="l2-mono">{c}</span>)}
        <b className="l2-mono">stream.hanzo.ai:9092</b>
      </div>
      <div className="st2-lanes" aria-hidden="true">
        {[0, 1, 2, 3].map((l) => (
          <div key={l} className={'st2-lane ln' + l + (live ? '' : ' still')}>
            <span className="st2-p l2-mono">partition {l}</span>
            <div className="st2-strip">
              {[0, 1].map((c) => (
                <div key={c} className="st2-run">
                  {Array.from({ length: 16 }).map((_, i) => <i key={i}><b className="l2-mono">{1180 + l * 37 + i}</b></i>)}
                </div>
              ))}
            </div>
            {l === 1 && <span className={'st2-mark l2-mono' + (phase === 1 ? ' down' : '')}>my-service · {phase === 1 ? 'consumer down · offset kept' : phase === 2 ? 'back where it left off' : 'committed offset'}</span>}
            {l === 2 && bad && <span className="st2-bad l2-mono">INVALID_RECORD</span>}
          </div>
        ))}
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
const FIGS = [['Kafka', 'Wire protocol'], ['PubSub', 'Holds the log'], ['Stateless', 'No broker disk'], ['Durable', 'At-least-once']];

/* Signature: the facts ride a tape that the page's scroll moves sideways; the marker reads the offset reached. */
function Ruler() {
  const sec = useRef(null);
  const track = useRef(null);
  const calm = useCalm();
  const wide = useWide();
  const pin = wide && !calm;
  const [span, setSpan] = useState(3000);
  const [at, setAt] = useState(0);
  const { scrollYProgress: p } = useScroll({ target: sec, offset: ['start start', 'end end'] });
  const head = (
    <div className="st2-rul-h">
      <h2 className="l2-display m">Your clients, our store</h2>
      <p className="l2-mono st2-range">01 / 06 — 06 / 06</p>
    </div>
  );
  const x = useTransform(p, (v) => -Math.min(1, Math.max(0, (v - 0.04) / 0.92)) * span);
  useMotionValueEvent(p, 'change', (v) => {
    const el = track.current;
    if (el && el.scrollWidth - innerWidth !== span) setSpan(Math.max(0, el.scrollWidth - innerWidth + 48));
    setAt(Math.min(6, Math.max(0, Math.floor(((v - 0.04) / 0.92) * 7.4))));
  });
  return (
    <section ref={sec} className={'st2-rul' + (pin ? ' pin' : '')} style={pin ? { height: '480svh' } : undefined}>
      <div className="st2-rul-stick">
        {!pin && head}
        <motion.div ref={track} className="st2-track" style={pin ? { x } : undefined} data-swipe-own>
          {pin && head}
          {FACTS.map(([t, d], i) => (
            <article key={t} className={'st2-rec' + (pin && at > i ? ' read' : '')}>
              <p className="st2-big l2-fig" aria-hidden="true">{String(i + 1).padStart(4, '0')}</p>
              <h3 className="l2-head">{t}</h3>
              <p className="st2-ofs l2-mono"><span>offset {String(i + 1).padStart(4, '0')}</span><span>{String(i + 1).padStart(2, '0')} / 06</span></p>
              <p className="l2-body">{d}</p>
              {/* the record's own picture: a run of example records; the one this fact is about is filled, the last
                  card's refused batch is dashed. Hovering it consumes one record (the strip steps left). */}
              <div className={'st2-recs r' + i} aria-hidden="true">
                <div>{Array.from({ length: 9 }).map((_, j) => <i key={j} className={j === i + 1 ? (i === 5 ? 'bad' : 'on') : ''}><b className="l2-mono">{1290 + i * 9 + j}</b></i>)}</div>
              </div>
            </article>
          ))}
          <ul className="st2-figs">{FIGS.map(([a, b]) => <li key={a}><b>{a}</b><span>{b}</span></li>)}</ul>
        </motion.div>
        {pin && (
          <div className="st2-commit" aria-hidden="true">
            <i />
            <p className="l2-mono">committed offset <b>{String(Math.min(at, 6)).padStart(4, '0')}</b></p>
          </div>
        )}
      </div>
    </section>
  );
}

const APIS = ['Produce', 'Fetch', 'ListOffsets', 'Metadata', 'OffsetCommit', 'OffsetFetch', 'FindCoordinator', 'JoinGroup', 'SyncGroup', 'Heartbeat', 'CreateTopics', 'ApiVersions'];

/* Beyond: answer "does my client's call work?" from the twelve APIs Hanzo lists. */
function Check() {
  const [q, setQ] = useState('');
  // once, when it comes into view, it types one of Hanzo's twelve by itself (so you see it answer), then waits for you
  const box = useRef(null);
  const seen = useInView(box, { once: true, amount: 0.6 });
  const calm = useCalm();
  const [mine, setMine] = useState(false);
  useEffect(() => {
    if (!seen || calm || mine) return;
    const word = 'JoinGroup';
    const ids = [...word].map((_, i) => setTimeout(() => setQ(word.slice(0, i + 1)), 400 + i * 110));
    return () => ids.forEach(clearTimeout);
  }, [seen, calm, mine]);
  const s = q.trim().toLowerCase().replace(/\s+/g, '');
  const hits = s ? APIS.filter((a) => a.toLowerCase().includes(s)) : [];
  const exact = APIS.find((a) => a.toLowerCase() === s);
  return (
    <div className="st2-check" ref={box}>
      <label>
        <span className="l2-kick ac">Does my client's call work?</span>
        <input type="text" value={q} onFocus={() => setMine(true)} onChange={(e) => { setMine(true); setQ(e.target.value); }} placeholder="JoinGroup" spellCheck="false" autoComplete="off" />
      </label>
      <p className="st2-ans" aria-live="polite">
        {!s ? 'Type a Kafka API.' : exact ? <><b>{exact}</b> is one of the twelve, at the versions modern clients negotiate.</> : hits.length ? <>Did you mean {hits.map((h, i) => <button key={h} type="button" onClick={() => setQ(h)}>{h}{i < hits.length - 1 ? '' : ''}</button>)}?</> : <><b>{q.trim()}</b> is not among the twelve APIs Hanzo lists.</>}
      </p>
      <ul className="st2-apis">{APIS.map((a) => <li key={a} className={hits.includes(a) ? 'on' : ''}>{a}</li>)}</ul>
    </div>
  );
}

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

function OneLine() {
  return (
    <section className="l2-sec st2-code">
      <div className="l2-wrap l2-grid">
        <div className="st2-code-l">
          <h2 className="l2-head">One line changes: the bootstrap server</h2>
          <Check />
        </div>
        <div className="st2-code-r"><Code light title="Stream" mark="stream.hanzo.ai:9092" tabs={[{ k: 'producer.py', code: CODE, lang: 'python' }]} /></div>
      </div>
    </section>
  );
}

/* The close's object: one partition still running, the consumer's committed offset riding it. */
function MiniTape() {
  const [ref, live, , paused, toggle] = useDemo(0.2);
  return (
    <div className="st2-mini" ref={ref}>
      <PauseBtn paused={paused} onClick={toggle} />
      <p className="st2-mini-k l2-mono" aria-hidden="true"><span>partition 0</span><b>stream.hanzo.ai:9092</b></p>
      <div className={'st2-mini-lane' + (live ? '' : ' still')} aria-hidden="true">
        <div className="st2-strip">{[0, 1].map((c) => <div key={c} className="st2-run">{Array.from({ length: 12 }).map((_, i) => <i key={i}><b className="l2-mono">{1290 + i}</b></i>)}</div>)}</div>
        <span className="st2-mark l2-mono">my-service · committed offset</span>
      </div>
    </div>
  );
}

export default function Stream() {
  return (
    <main id="main" className="l2-page st2">
      <StageHero look="frame" dark kick="Kafka Wire Protocol" title="Hanzo Stream" sub="A Kafka port in front of Hanzo PubSub" acts={[['GitHub', GHS]]}>
        <Tape />
      </StageHero>
      <Ruler />
      <OneLine />
      <Finale
        name="Stream"
        head="Point the bootstrap server at it"
        lede="The clients stay as they are. The cluster underneath them goes away."
        ask={['View on GitHub', GHS]}
        object={<MiniTape />}
        prompt="Read https://hanzo.ai/skill.md and use Hanzo Stream in my project."
        tag="Event stream"
        repo={['hanzoai/stream', GHS]}
        stars="4 stars"
      />
    </main>
  );
}
