'use client';
/* PubSub, v2 launch page (Cloud 3).
   V2: 8/10 Poster launch: the hero is the page's one dark room, a full-bleed bus where one message fans out with drawn wires above a giant title; six facts pin over one bus inspector; ack policy switch inside chapter two; 4222 as a spec sheet with events.go in a rising sheet.
   Signature: one message fanning out. A publish on events.user.signup is written into the EVENTS stream with its
   sequence, then the wires draw out to every subscriber and to exactly one member of a queue group; deliveries wait for
   an ack and an unacked one is redelivered.
   Beyond: ack policy switch. In chapter two the same fan-out re-runs under Hanzo's three ack choices (ack every
   message, ack a sequence to cover everything below it, no acks), so redelivery appears and vanishes before you pick.
   Motion: signature = the fan-out (svg wires drawn); supporting = pinned chapters (scroll), the clip wipe into the
   light code room, the line-masked title. Every word, figure and link is Hanzo's; sequence numbers are drawn. */
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { A } from '../../kit';
import { Paste, Code, useLive, useEvery } from './Frame';
import PinnedChapters from '../../v2/PinnedChapters';
import ClipWipe from '../../v2/ClipWipe';
import SpecDrawer from '../../v2/SpecDrawer';
import LaunchClose from '../../v2/LaunchClose';
import LineMask from '../../v2/LineMask';
import './Pubsub.css';

const EASE = [0.16, 1, 0.3, 1];
const SPRING = { type: 'spring', stiffness: 300, damping: 30 };

// Hanzo's three ack choices, each with its own clause from "Acked, so nothing goes quiet"
const ACKS = [
  ['every', 'ack every', 'Ack every message'],
  ['below', 'ack all below', 'ack a sequence to cover everything below it'],
  ['none', 'no acks', 'ask for no acks at all when fire-and-forget is what you meant'],
];

/* the fan-out clock: 0 publish, 1 stored, 2 fanned out, 3 acks (one redelivered), 4 settled */
function useFan(run, calm) {
  const [t, setT] = useState(2);
  const [seq, setSeq] = useState(41);
  useEffect(() => { if (calm) setT(4); }, [calm]);
  useEffect(() => {
    if (calm || !run) return;
    const id = setTimeout(() => { if (t >= 4) { setT(0); setSeq((s) => s + 1); } else setT(t + 1); }, [900, 900, 1300, 1500, 1300][t]);
    return () => clearTimeout(id);
  }, [t, run, calm]);
  return [t, seq];
}

const subState = (t, ack, i, top) => {
  if (t < 2) return ['', '—'];
  if (t < 3 || ack === 'none') return ['', 'delivered'];
  if (ack === 'every' && i === 1 && t === 3) return ['wait', 'redelivered'];
  return ['ack', ack === 'below' ? 'ack ≤ ' + top : 'ack'];
};

function Wire({ on, ys = [50] }) {
  return (
    <svg className="ps-wire" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      {ys.map((y) => <path key={'b' + y} className="base" d={`M0 50 C 55 50, 45 ${y}, 100 ${y}`} />)}
      {ys.map((y, i) => <path key={'f' + y} className={'flow' + (on ? ' on' : '')} style={{ transitionDelay: on ? i * 0.07 + 's' : '0s' }} pathLength="1" d={`M0 50 C 55 50, 45 ${y}, 100 ${y}`} />)}
    </svg>
  );
}

/* ---------- the hero object: the bus ---------- */
function Bus() {
  const [ref, live, calm] = useLive(0.3);
  const [t, seq] = useFan(live, calm);
  const top = seq + (t >= 1 ? 1 : 0);
  const pick = seq % 3;
  return (
    <div className="ps-bus" ref={ref} role="img" aria-label="One message is published, written into the EVENTS stream with its sequence, copied to every subscriber, and handed to exactly one member of a queue group">
      <div className="ps-node ps-pub">
        <p className="ps-k">publish</p>
        <motion.div key={seq} className="ps-msg" initial={{ x: -40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.6, ease: EASE }}>
          <b>events.user.signup</b><span>{'{"id":"usr_123"}'}</span>
        </motion.div>
      </div>
      <Wire on={t >= 1} />
      <div className="ps-node ps-str">
        <p className="ps-k">stream EVENTS · events.&gt;</p>
        <div className="ps-seqs">
          {Array.from({ length: 6 }, (_, i) => { const n = top - 5 + i; return <span key={n} className={i === 5 && t >= 1 ? 'new' : ''}>{n}</span>; })}
        </div>
      </div>
      <Wire on={t >= 2} ys={[16, 50, 84]} />
      <div className="ps-node ps-subs">
        {['analytics', 'audit'].map((s, i) => {
          const [c, l] = subState(t, 'every', i, top);
          return <div key={s} className={'ps-sub' + (t >= 2 ? ' got' : '')}><b>{s}</b><span className={c}>{l}</span></div>;
        })}
        <div className={'ps-sub ps-grp' + (t >= 2 ? ' got' : '')}>
          <b>queue group</b>
          <span className="ps-one">{[0, 1, 2].map((k) => <i key={k} className={t >= 2 && k === pick ? 'on' : ''} />)}</span>
        </div>
      </div>
    </div>
  );
}

/* ---------- the chapters' object: one server, inspected ---------- */
const STARTS = [['the beginning', 0], ['a sequence', 4], ['a time', 6], ['newest', 9]];

function AckSwitch({ ack, setAck }) {
  return (
    <div className="ps-switch">
      <div className="ps-switch-b" role="group" aria-label="Ack policy">
        {ACKS.map(([k, l]) => <button key={k} type="button" aria-pressed={ack === k} onClick={() => setAck(k)}>{l}</button>)}
      </div>
      <p className="ps-ackline" aria-live="polite">{ACKS.find((a) => a[0] === ack)[2]}.</p>
    </div>
  );
}

function StartSwitch({ from, setFrom }) {
  return (
    <div className="ps-switch">
      <div className="ps-switch-b" role="group" aria-label="A consumer starts at">
        {STARTS.map(([l], i) => <button key={l} type="button" aria-pressed={from === i} onClick={() => setFrom(i)}>{l}</button>)}
      </div>
    </div>
  );
}

const SUBJ = ['stream EVENTS', 'events.user.signup', 'bucket · offsets', 'svc.quote', 'object store · assets', 'accounts'];

function Panel({ step, n, ack, from, t, seq }) {
  if (step === 0) {
    const start = STARTS[from][1];
    const fast = Math.floor(n / 4) % 2 === 1;
    const read = Math.min(9, start + (fast ? (n % 4) * 3 : n % 4));
    return (
      <div className="ps-p">
        <div className="ps-chips">{['by age', 'by count', 'by bytes'].map((c, i) => <span key={c} className={n % 3 === i ? 'on' : ''}>keep {c}</span>)}</div>
        <div className="ps-tape">
          {Array.from({ length: 10 }, (_, i) => <span key={i} className={(i >= start && i <= read ? 'read' : '') + (i === start ? ' cur' : '')}>{33 + i}</span>)}
        </div>
        <p className="ps-pace"><i className={fast ? '' : 'on'}>original pace</i><i className={fast ? 'on' : ''}>as fast as it can</i></p>
      </div>
    );
  }
  if (step === 1) {
    const top = seq + (t >= 1 ? 1 : 0);
    return (
      <div className="ps-p">
        <div className="ps-rows">
          {['analytics', 'audit', 'my-service'].map((s, i) => {
            const [c, l] = subState(t, ack, i, top);
            return <p key={s} className={c}><b>{s}</b><span>#{top}</span><em>{l}</em></p>;
          })}
        </div>
        <div className="ps-dup">
          <span>msg id usr_123</span><span className="twice">msg id usr_123</span>
          <em>duplicate collapsed · two minutes</em>
        </div>
      </div>
    );
  }
  if (step === 2) {
    const v = (k) => 1040 + n * (k + 1);
    return (
      <div className="ps-p">
        <div className="ps-kv">
          <p className="h"><span>key</span><span>last value</span><span>history</span></p>
          {['orders', 'payments', 'signups'].map((k, i) => (
            <p key={k} className={n % 3 === i ? 'hot' : ''}><b>{k}</b><span className="lx-num">{v(i)}</span><span className="ps-hist">{[0, 1, 2, 3, 4].map((d) => <i key={d} className={d < 2 + ((n + i) % 4) ? 'on' : ''} />)}</span></p>
          ))}
        </div>
        <p className="ps-watch"><i />watch · {['orders', 'payments', 'signups'][n % 3]} → {v(n % 3)}</p>
      </div>
    );
  }
  if (step === 3) {
    const p = n % 3, back = n % 2 === 1;
    return (
      <div className="ps-p">
        <div className="ps-rr">
          <span className={'ps-req' + (back ? '' : ' on')}>request</span>
          <span className="ps-arrow" aria-hidden="true">→</span>
          <div className="ps-insts">{['instance 1', 'instance 2', 'instance 3'].map((s, i) => <span key={s} className={i === p ? 'on' : ''}>{s}</span>)}</div>
        </div>
        <p className={'ps-reply' + (back ? ' on' : '')}>reply · one answer from instance {p + 1}</p>
      </div>
    );
  }
  if (step === 4) {
    const k = n % 12;
    return (
      <div className="ps-p">
        <div className={'ps-blob' + (k < 2 ? ' whole' : k >= 10 ? ' whole back' : '')}><b>assets/report.pdf</b><span>{k < 2 ? 'payload' : k >= 10 ? 'put back together' : 'chunked into a stream'}</span></div>
        <div className="ps-chunks">{Array.from({ length: 8 }, (_, i) => <i key={i} className={k >= 2 && i < k - 1 ? 'on' : ''} />)}</div>
        <p className={'ps-watch' + (k >= 10 ? '' : ' dim')}><i />watch · changed</p>
      </div>
    );
  }
  return (
    <div className="ps-p">
      <div className="ps-acc">
        {[['account a', ['events.>', 'orders.>']], ['account b', ['events.>', 'billing.>']]].map(([a, subs], i) => (
          <div key={a} className={'ps-acc-c' + (n % 2 === i ? ' on' : '')}><p>{a}</p>{subs.map((s) => <span key={s}>{s}</span>)}</div>
        ))}
      </div>
      <div className="ps-chips">{['nkey', 'signed JWT', 'per-subject', 'TLS'].map((c, i) => <span key={c} className={n % 4 === i ? 'on' : ''}>{c}</span>)}</div>
    </div>
  );
}

function Inspector({ step, ack, from }) {
  const [ref, live, calm] = useLive(0.3);
  const [n, setN] = useState(0);
  const [t, seq] = useFan(live && step === 1, calm);
  useEvery(1000, live, () => setN((v) => v + 1));
  return (
    <div className="ps-ins" ref={ref}>
      <div className="ps-ins-h">
        <span className="ps-dot" aria-hidden="true" />
        <AnimatePresence mode="wait" initial={false}>
          <motion.code key={step} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3, ease: EASE }}>{SUBJ[step]}</motion.code>
        </AnimatePresence>
        <span className="ps-port">:4222</span>
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={step} className="ps-ins-b" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16, transition: { duration: 0.18 } }} transition={{ ...SPRING }}>
          <Panel step={step} n={n} ack={ack} from={from} t={t} seq={seq} />
        </motion.div>
      </AnimatePresence>
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
  const [ack, setAck] = useState('every');
  const [from, setFrom] = useState(0);
  const steps = FACTS.map(([t, d], i) => ({ t, d, extra: i === 0 ? <StartSwitch from={from} setFrom={setFrom} /> : i === 1 ? <AckSwitch ack={ack} setAck={setAck} /> : null }));
  return (
    <main className="lx ps">
      <section className="ps-hero lx-dark" data-room="dark" data-morph-target>
        <div className="lx-wrap ps-hero-in">
          <div className="ps-hero-top">
            <p className="lx-kick"><b>●</b> NATS JetStream</p>
            <p className="ps-tag">The bus everything else rides</p>
          </div>
          <Bus />
          <div className="ps-hero-foot">
            <LineMask as="h1" className="lx-display ps-h1" lines={['Hanzo PubSub']} />
            <A to="https://github.com/hanzoai/pubsub" className="lx-cta" data-thumb="GitHub">GitHub</A>
          </div>
        </div>
      </section>

      <section className="lx-sec ps-more">
        <div className="lx-wrap ps-more-in">
          <LineMask as="h2" className="lx-display m" lines={['More than', 'pub/sub']} inView />
        </div>
      </section>

      <PinnedChapters label="More than pub/sub" steps={steps} per={80} visual={(at) => <Inspector step={at} ack={ack} from={from} />} />

      <ClipWipe className="ps-room">
        <div className="lx-wrap">
          <div className="ps-room-top">
            <h2 className="lx-headline">Publish and Subscribe</h2>
            <Paste name="Pubsub" prompt="Read https://hanzo.ai/skill.md and use Hanzo Pubsub in my project. Start with: hanzo pubsub publish" className="lx-paste ps-paste" />
          </div>
          <SpecDrawer className="ps-spec" rows={[{ v: '4222', l: 'Client port' }, { v: 'Replay', l: 'From any point' }, { v: 'Durable', l: 'Written to disk' }, { v: 'Replicas', l: 'Set per stream' }]} open="See events.go" sheetTitle="events.go">
            <Code light title="PubSub" tabs={[{ k: 'events.go', code: CODE }]} />
          </SpecDrawer>
        </div>
      </ClipWipe>

      <section className="lx-sec ps-walk">
        <div className="lx-wrap ps-walk-in">
          <div>
            <h2 className="lx-display s">Put it between your services</h2>
            <p className="lx-lede">Free tier includes 1M messages/month.</p>
          </div>
          <A to="https://github.com/hanzoai/pubsub" className="lx-ghost">View on GitHub</A>
        </div>
      </section>

      <LaunchClose name="PubSub" tag="Pub/sub messaging" seed="pubsub" data={[4222, 3, 1000000]} repo={['hanzoai/pubsub', 'https://github.com/hanzoai/pubsub']} stars="4 stars" />
    </main>
  );
}
