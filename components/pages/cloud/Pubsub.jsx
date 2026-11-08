'use client';
/* PubSub, Cloud 3 launch page (docs/build-notes/MASTER.md, the only brief).
   Persona: Developer. Goal: try Hanzo PubSub (read the source, then deploy it).
   CTA: "GitHub" → https://github.com/hanzoai/pubsub (data-cta pubsub.hero, pubsub.close; data-thumb "GitHub", so the
   site's sticky ask carries the same words). Metric: github_click (MASTER §1 names a GitHub click as a metric; the live
   ask is "GitHub", so api_key_created would be fed by no button here).
// Signature: globe — one message on events.user.signup is published in one place, written into the stream EVENTS in another, fanned out round the planet to analytics, audit and one member of a queue group, and acked home; drag to spin it
// Beyond: ack policy switch — the same fan-out re-runs under Hanzo's three ack choices (every message, all below a sequence, none), so the redelivery arc and the acks appear and vanish as you pick
   Motion (docs/MOTION-MAP.md `globe`): the signature is the globe in the hero's black room. A dark planet drawn as a
   graticule turns to follow the message: the publish pulses, its arc draws to the stream (the sequence lights in the
   tray under it), three arcs fan out, acks come home on dashed arcs, the audit copy is redelivered once under "ack
   every". Drag spins it (sideways on touch, vertical stays scroll; it lets go with inertia and turns back to the
   message); hovering a place lights its arcs and names it in the toolbar. Supporting: the ack pill that glides
   (layoutId), the replay preview over the stream's sequences (pointer), the h1 cut-in (the page's one reveal). The
   pinned six chapters are gone: their words pass beside one held drawing that draws each fact once. Tweens only (ease-emphasis 300 ms, ease-in-out
   400 ms); no springs.
   States differ by fill, weight, dash and a shape, never by hue. Every word, figure and link is Hanzo's; places,
   sequence numbers and values are drawn.
   V2: 8/10 the black room is the hero: name, line and one ask left (5), the globe right (8) with the stream tray, the
   three subscribers and the ack switch under it (phones: queue group a full-width row, no state cut); then events.go
   walked once beside "Put it between your services"; the six facts passing beside one held drawing that draws the fact
   at the middle (pubsub/PsFacts.jsx); the prompt and the 4222 spec in the quiet room; the close. Entrances
   (pubsub/PsEnter.jsx): line-draw, cursor-trail, spring-snap, cover-slide, pixel-resolve. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { A, Img } from '../../kit';
import { useCalm } from '../../ui';
import { LeafPaste as Paste, LeafCode as Code } from './close3/Leaf';
import SpecDrawer from '../../v2/SpecDrawer';
import LaunchClose, { Arr } from './close3/Close';
import LineMask from '../../v2/LineMask';
import NoJs from '../../NoJs';
import LivePause, { usePause } from '../../v2/LivePause';
import PsGlobe, { PLACES } from './pubsub/PsGlobe';
import PsFacts from './pubsub/PsFacts';
import { Outline, CursorTrail, CoverSlide, PixelResolve } from './pubsub/PsEnter';
import './Pubsub.css';

const GH = 'https://github.com/hanzoai/pubsub';
const EASE = [0.16, 1, 0.3, 1]; // ease-emphasis: arrivals
const ARRIVE = { duration: 0.3, ease: EASE };
const QUICK = { duration: 0.15, ease: [0, 0, 0.2, 1] };

// Hanzo's three ack choices, each with its own clause from "Acked, so nothing goes quiet"
const ACKS = [
  ['every', 'ack every', 'Ack every message'],
  ['below', 'ack all below', 'ack a sequence to cover everything below it'],
  ['none', 'no acks', 'ask for no acks at all when fire-and-forget is what you meant'],
];

/* the fan-out clock: 0 publish, 1 stored, 2 fanned out, 3 acks (one redelivered), 4 settled */
function useFan(run, calm) {
  const [t, setT] = useState(4); // the server frame is a settled fan-out; the next publish drops in within half a second
  const [seq, setSeq] = useState(41);
  useEffect(() => { if (calm) setT(4); }, [calm]);
  const first = useRef(true);
  useEffect(() => {
    if (calm || !run) return;
    const ms = first.current ? 450 : [900, 900, 1300, 1500, 1800][t];
    const id = setTimeout(() => { first.current = false; if (t >= 4) { setT(0); setSeq((s) => s + 1); } else setT(t + 1); }, ms);
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

/* the inView observer for the hero object (its own, so the loop stops off screen) */
function useSeen(ref, amount) {
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => setSeen(e.isIntersecting), { threshold: amount });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, amount]);
  return seen;
}

/* ---------- the hero object: the globe, the stream tray under it, the subscribers, the ack switch ---------- */
function Planet() {
  const ref = useRef(null);
  const calm = useCalm();
  const seen = useSeen(ref, 0.25);
  const [paused, pause] = usePause();
  const run = seen && !paused && !calm;
  const [t, seq] = useFan(run, calm);
  const [ack, setAck] = useState('every');
  const [rp, setRp] = useState(null); // the sequence a replay would start from, under the pointer
  const [hov, setHov] = useState(null); // the place under the pointer on the globe
  const top = seq + (t >= 1 ? 1 : 0);
  const pick = seq % 3;
  const nums = Array.from({ length: 6 }, (_, i) => top - 5 + i);
  const states = ['analytics', 'audit'].map((s, i) => subState(t, ack, i, top));
  const qState = subState(t, ack, 2, top);
  const mark = (c, l) => (c === 'ack' ? '✓ ' + l : c === 'wait' ? '↻ ' + l : l);
  const label = {
    pub: 'events.user.signup',
    str: t >= 1 ? '#' + top : '#' + seq,
    analytics: mark(...states[0]),
    audit: mark(...states[1]),
    ['q' + pick]: mark(...qState),
  };
  const named = hov ? (PLACES[hov].q !== undefined ? 'queue group · ' + (PLACES[hov].q === pick ? 'one of three · ' + mark(...qState) : 'idle') : PLACES[hov].name + ' · ' + label[hov]) : null;
  const line = named || (rp !== null ? `replay · from #${rp} → #${top}` : null);
  const at = ACKS.findIndex((a) => a[0] === ack);
  return (
    <div className="ps-busw" ref={ref} data-paused={paused || undefined}>
      <div className="ps-bar">
        <p className="ps-bar-k">NATS JetStream</p>
        <p className="ps-rp" aria-hidden="true">
          <AnimatePresence mode="wait" initial={false}>
            {line && (
              <motion.span key={line} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6, transition: QUICK }} transition={ARRIVE}>
                {line}
              </motion.span>
            )}
          </AnimatePresence>
        </p>
        <LivePause dark paused={paused} onToggle={pause} className="ps-pause" />
      </div>
      <div role="img" aria-label="A globe: one message is published on events.user.signup, written into the stream EVENTS with its sequence, copied to analytics and audit in other places and handed to exactly one member of a queue group; acks travel back. Drag to spin it.">
        <PsGlobe t={t} seq={seq} ack={ack} pick={pick} run={run} calm={calm} onHover={setHov} label={label} />
      </div>
      <div className="ps-tray">
        <p className="ps-k">stream EVENTS · events.&gt;</p>
        <div className="ps-seqs" onPointerLeave={() => setRp(null)}>
          <Outline d={0.15} />
          {nums.map((n, i) => (
            <span key={n} style={{ '--k': i }} onPointerEnter={(e) => e.pointerType === 'mouse' && setRp(n)}
              className={(i === 5 && t >= 1 ? 'new' : '') + (rp !== null && n >= rp ? ' rp' : '') + (n === rp ? ' from' : '')}>{n}</span>
          ))}
        </div>
      </div>
      <div className="ps-subs" aria-live="polite">
        {['analytics', 'audit'].map((s, i) => {
          const [c, l] = states[i];
          return <div key={s} className={'ps-sub' + (t >= 2 ? ' got' : '') + (c ? ' ' + c : '')} style={{ '--fd': 0.55 + i * 0.12 + 's' }}><Outline d={0.3 + i * 0.12} /><b>{s}</b><span>{l}</span></div>;
        })}
        <div className={'ps-sub ps-grp' + (t >= 2 ? ' got' : '') + (qState[0] ? ' ' + qState[0] : '')} style={{ '--fd': '0.79s' }}>
          <Outline d={0.54} />
          <b>queue group</b>
          <span className="ps-one">{[0, 1, 2].map((k) => <i key={k} className={t >= 2 && k === pick ? 'on' : ''} />)}</span>
        </div>
      </div>
      <div className="ps-switch-b ps-acks" role="group" aria-label="Ack policy">
        {ACKS.map(([k, l, d], i) => (
          <button key={k} type="button" aria-pressed={at === i} title={d} onClick={() => setAck(k)}>
            {at === i && <motion.span layoutId="ps-pill-ack" className="ps-pill" transition={ARRIVE} />}
            <span>{l}</span>
          </button>
        ))}
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

/* events.go, walked once as it arrives: connect, the stream, the publish, the consumer that fetches and acks, one
   beat each (1.25 s, 5 s in all), then every line back in ink. A pointer on the code ends the walk at once. */
const BEATS = ['conn', 'stream', 'pub', 'sub'];
function Walked() {
  const ref = useRef(null);
  const calm = useCalm();
  const seen = useSeen(ref, 0.5);
  const [beat, setBeat] = useState(-1);
  const [held, setHeld] = useState(false);
  useEffect(() => { if (!seen) { setBeat(-1); setHeld(false); } }, [seen]);
  useEffect(() => {
    if (calm || held || !seen) return;
    if (beat >= BEATS.length) return;
    const id = setTimeout(() => setBeat((b) => b + 1), beat < 0 ? 350 : 1250);
    return () => clearTimeout(id);
  }, [beat, seen, calm, held]);
  const step = !held && beat >= 0 && beat < BEATS.length ? BEATS[beat] : undefined;
  return (
    <div className="ps-codew" ref={ref} data-step={step} onPointerEnter={() => setHeld(true)}>
      <Code light title="PubSub" tabs={[{ k: 'events.go', code: CODE }]} className="ps-code" />
    </div>
  );
}

export default function Pubsub() {
  return (
    <main className="lx ps" data-cursor="">
      {/* without JavaScript the canvas stays empty: the stream tray and the subscribers carry the story instead */}
      <NoJs css=".ps-globe,.ps-figw,.ps-figm{display:none}" />
      <section className="ps-hero lx-dark" data-room="dark" data-morph-target data-ask-name="Hanzo PubSub">
        <div className="lx-wrap ps-hero-in">
          <div className="ps-hero-title">
            <LineMask as="h1" className="lx-display ps-h1" lines={['Hanzo PubSub']} />
            <p className="lx-lede ps-tag">The bus everything else rides</p>
            <A to={GH} className="lx-cta" data-thumb="GitHub" data-cta="pubsub.hero" data-cursor="">GitHub<Arr /></A>
          </div>
          <Planet />
        </div>
      </section>

      <CursorTrail className="lx-sec ps-walk">
        <div className="lx-wrap ps-walk-in">
          <div className="ps-walk-l">
            <h2 className="lx-headline">Put it between your services</h2>
            <p className="lx-lede">Free tier includes 1M messages/month.</p>
            <A to={GH} className="lx-ghost">View on GitHub<Arr /></A>
            {/* Hanzo's own picture on this page (mori), kept: a black card under the words */}
            <div className="ps-mori"><Img src="/models/mori.webp" alt="" w={1200} h={1500} /></div>
          </div>
          <Walked />
        </div>
      </CursorTrail>

      <section className="lx-sec ps-facts" aria-labelledby="ps-facts-h">
        <div className="lx-wrap">
          <PsFacts facts={FACTS} />
        </div>
      </section>

      <CoverSlide className="ps-room">
        <div className="lx-wrap">
          <div className="ps-room-top">
            <h2 className="lx-headline">Publish and Subscribe</h2>
            <Paste name="Pubsub" prompt="Read https://hanzo.ai/skill.md and use Hanzo Pubsub in my project. Start with: hanzo pubsub publish" className="lx-paste ps-paste" />
          </div>
          <SpecDrawer className="ps-spec" rows={[{ v: '4222', l: 'Client port' }, { v: 'Replay', l: 'From any point' }, { v: 'Durable', l: 'Written to disk' }, { v: 'Replicas', l: 'Set per stream' }]} />
        </div>
      </CoverSlide>

      <PixelResolve>
        <LaunchClose name="PubSub" tag="Pub/sub messaging" seed="pubsub" data={[4222, 3, 1000000]} ask={['GitHub', GH]} cta="pubsub.close" repo={['hanzoai/pubsub', GH]} stars="4 stars" />
      </PixelResolve>
    </main>
  );
}
