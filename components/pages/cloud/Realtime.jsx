'use client';
/* Realtime, Cloud 3 launch page (docs/build-notes/MASTER.md, the only brief).
   Persona: Developer. Goal: get an API key and open a first stream.
   CTA: "Start Building" → https://platform.hanzo.ai/api-keys (data-cta realtime.hero, realtime.close; data-thumb
   "Start Building", so the site's sticky ask carries the same words). Metric: api_key_created.
// Signature: graph — the stream as a living graph: the one store, the API, the access rule, a broker per org, GET /v1/realtime, the grant, the deployment, the subscriptions and three clients settle into place; records travel it, and pointing at a node lights its paths, names them and reads out what that part gives you
// Beyond: the rule switch — in the hero, flip each client's access rule and replay the create, update and delete to see who hears about record b
   The hero keeps the same record landing on three client screens at once (a desktop, a tablet and a phone); the
   rule switch flips who can read record b.
   Motion (docs/MOTION-MAP.md `graph`): the signature is "What the stream gives you", second screen. The parts of one
   deployment settle like a physics graph as it comes into view (heavily damped, no bounce); records ride it by
   themselves (create a, update b, delete b: store → org broker → the stream → clients, and anything about b stops at
   org b's broker because client 3's rule cannot read it). Pointing at a node, tapping it or focusing it lights its
   links and names them, and the panel beside it reads that part's words (all eight in the HTML); a mouse can pull a
   node and the graph settles back. The pinned eight chapters (PinnedChapters + ChapterClients) are gone, and so are the
   hero's scroll settle and the black room's timed wipe: the h1 cut-in is the page's one reveal.
   Supporting: the three screens and the rule switch (idle, state), the use-case rail you throw (drag with inertia,
   hard stops), the handshake's three calls marking their line in the wire, growth one note at a time beside the
   tenant map, "Get Realtime" growing at the close. Tweens only (ease-emphasis 300 ms, ease-in-out 400–500 ms).
   States differ by fill, weight, dash and a shape, never by hue. Every word and link is Hanzo's; record contents,
   ids and org names are examples.
   V2: 8/10 three live clients under the two-line title beside the one ask; then the living graph of the stream with
   its words beside it (rests spaced so no name touches another; phones keep the hub's link names in its panel); the
   statement and the subscribe call close under it; use cases on a drag rail; the handshake in the black room; growth
   beside the tenant map; the card drawn as three clients taking one record (the close keeps the one contour); the
   close. Entrances (realtime/RtEnter.jsx): shrink-to-card, tile-flip, card-deal, vertical-ticker, venetian-type. Deck
   greys, tweens only. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, animate } from 'motion/react';
import { A } from '../../kit';
import { useCalm } from '../../ui';
import { useLive, useSteps } from './Frame';
import { LeafCode as Code } from './close3/Leaf';
import SpecDrawer from '../../v2/SpecDrawer';
import LaunchClose, { Arr } from './close3/Close';
import LineMask from '../../v2/LineMask';
import LivePause, { usePause } from '../../v2/LivePause';
import RelatedCards from '../../v2/RelatedCards';
import NoJs from '../../NoJs';
import RtGraph, { NODES, EVENTS } from './realtime/RtGraph';
import { ShrinkToCard, FlipVeil, CardDeal, Ticker, Venetian } from './realtime/RtEnter';
import './Realtime.css';

const KEYS = 'https://platform.hanzo.ai/api-keys';
const DOCS = 'https://docs.hanzo.ai';
const EASE = [0.16, 1, 0.3, 1]; // ease-emphasis: arrivals
const IO = [0.4, 0, 0.2, 1]; // ease-in-out: things that move and stay
const ARRIVE = { duration: 0.3, ease: EASE };
const GLIDE = { duration: 0.4, ease: IO };
const QUICK = { duration: 0.15, ease: [0, 0, 0.2, 1] };

/* true after hydration: collapsed detail is a JS-only presentation, so with JS off every word reads in order */
function useMounted() {
  const [m, setM] = useState(false);
  useEffect(() => setM(true), []);
  return m;
}

/* a counter that steps every ms while run is true (a timeout chain: nothing ticks off screen or paused) */
function useBeat(run, ms = 1000) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!run) return;
    const id = setTimeout(() => setN((v) => v + 1), ms);
    return () => clearTimeout(id);
  }, [n, run, ms]);
  return n;
}

const WATCH = `// Watch a collection
const stop = await base
  .collection('messages')
  .subscribe('*', (e) => {
    console.log(e.action, e.record.id);
    render(e.record);
  });
// create | update | delete`;

/* ---------- the hero object: three clients on one stream ---------- */
// a little life of one record: [action, rows shown]
const BEATS = [['create', ['a', 'b']], ['create', ['a', 'b', 'c']], ['update', ['a', 'b*', 'c']], ['delete', ['a', 'c']]];
const W = { a: '64%', b: '46%', c: '72%' };

function Screens() {
  const [ref, live, calm] = useLive(0.3);
  const [paused, pause] = usePause();
  const [i, setI] = useState(1);
  const [deny, setDeny] = useState([false, false, true]); // client 3's rule cannot read record b, until you flip it
  useEffect(() => { if (calm) setI(2); }, [calm]);
  const first = useRef(true);
  useEffect(() => {
    if (calm || !live || paused) return;
    // the first change lands within 0.6 s, so the first screen is moving before you look for it
    const t = setTimeout(() => { first.current = false; setI((v) => (v + 1) % BEATS.length); }, first.current ? 600 : 2300);
    return () => clearTimeout(t);
  }, [i, live, calm, paused]);
  const [action, rows] = BEATS[i];
  const hitsB = action !== 'create' || i === 0;
  return (
    <div className="rt-stage" ref={ref} data-paused={paused || undefined}>
      <div className="rt-conn">
        <span className="rt-conn-k">Live connection</span><span>One open stream</span><span>Records arrive as they change</span>
        <span className="rt-acts" aria-hidden="true">{['create', 'update', 'delete'].map((a) => <i key={a} className={a === action ? 'on' : ''}>{a}</i>)}</span>
        <LivePause inline paused={paused} onToggle={pause} className="rt-pause" />
      </div>
      <div className="rt-pipes" aria-hidden="true">{[0, 1, 2].map((c) => <i key={c + '-' + i} className={deny[c] && hitsB && action !== 'create' ? 'mute' : 'go'} style={{ animationDelay: c * 40 + 'ms' }} />)}</div>
      <div className="rt-screens">
        {[1, 2, 3].map((c) => {
          const no = deny[c - 1];
          return (
            <div key={c} className={'rt-screen ' + ['desk', 'tab', 'hand'][c - 1] + (no ? ' no' : '')}>
              <div className="rt-top"><span>Client {c}</span><em>Connected</em></div>
              <ul aria-hidden="true">
                <AnimatePresence initial={false} mode="popLayout">
                  {rows.filter((r) => !(no && r.startsWith('b'))).map((r) => (
                    <motion.li key={r[0]} layout className={r.endsWith('*') ? 'upd' : ''} initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 24, transition: ARRIVE }} transition={{ ...ARRIVE, layout: GLIDE }}>
                      <i>{r[0]}</i><span style={{ width: W[r[0]] }} />
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
              <button type="button" className="rt-gate" aria-pressed={!no} aria-label={`Client ${c}'s rule can read record b`} onClick={() => setDeny((d) => d.map((v, k) => (k === c - 1 ? !v : v)))}>
                <i aria-hidden="true" /><span className="full">{no ? "rule can't read b" : 'rule reads b'}</span><span className="short" aria-hidden="true">{no ? 'no b' : 'reads b'}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const GIVES = [
  ['One stream, server-sent', 'A single long-lived HTTP response carries every update, so nothing special has to sit in front of it. The browser notices a dropped network and reconnects on its own.'],
  ['A collection, or one record', 'Watch a whole collection and hear about everything that lands in it, or watch one record and hear only about that one. Change what you are watching without dropping the stream.'],
  ['One broker per tenant', "An org's subscribers attach to that org's own broker, reading that org's own data. Two tenants using the same collection name are not sharing a topic, so there is no cross-tenant fan-out to get wrong."],
  ['Deletes are checked too', 'A delete is announced only to the subscribers whose rule would have let them read the record. Something you were never allowed to see does not reveal itself on the way out.'],
  ['The same data, not a copy of it', 'The stream reads from the store the API reads. There is no separate event bus to keep in step, and nothing that can be current in one place and stale in the other.'],
  ['The rule is the filter', "What reaches a subscriber is decided by the collection's access rule, evaluated against the identity that opened the stream. It is the same predicate that guards the API, not a second one written for the stream."],
  ['A grant, not your token', 'A browser cannot put a header on the request that opens a stream. So you mint a short-lived grant on an ordinary authenticated call and spend it once, within thirty seconds — rather than putting a token that opens every service into a URL that every proxy and access log will keep.'],
  ['Limits belong to the deployment', 'How many streams and how many requests are settings on the deployment and counted once for the process, not copied onto each tenant — so a limit of two means two.'],
];

/* ---------- the signature: the stream as a living graph, its words beside it ---------- */
// the tour: when no hand has chosen, the graph walks its parts one fact at a time
const TOUR = Array.from({ length: 8 }, (_, f) => NODES.findIndex((n) => n[2] === f)); // the first node of each fact

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

function Gives() {
  const ref = useRef(null);
  const calm = useCalm();
  const seen = useSeen(ref, 0.3);
  const [paused, pause] = usePause();
  const run = seen && !paused && !calm;
  const [sel, setSel] = useState(TOUR[0]);
  const [mine, setMine] = useState(false);
  const [e, setE] = useState(2); // the server frame: delete b, the change that client 3 is not told about
  const [evAt, setEvAt] = useState(0);
  // records: a change every 2.4 s while the graph is seen
  useEffect(() => {
    if (!run) return;
    const id = setTimeout(() => { setE((v) => (v + 1) % EVENTS.length); setEvAt(performance.now()); }, evAt ? 2400 : 500);
    return () => clearTimeout(id);
  }, [e, run, evAt]);
  // the tour: one part every 4.8 s until a hand picks one; a node under the pointer reads out its words meanwhile
  const [peek, setPeek] = useState(null);
  const fi = NODES[peek ?? sel][2];
  useEffect(() => {
    if (!run || mine || peek !== null) return;
    const id = setTimeout(() => setSel(TOUR[(NODES[sel][2] + 1) % TOUR.length]), 4800);
    return () => clearTimeout(id);
  }, [sel, run, mine, peek]);
  const pick = (i) => { setSel(i); setMine(true); };
  const ev = EVENTS[e];
  return (
    <section className="lx-sec rt-gives" aria-labelledby="rt-gives-h" ref={ref}>
      <NoJs css=".rt-facts-in{display:block}.rt-fact{visibility:visible;margin-bottom:32px}.rt-graph-w,.rt-fact-dots{display:none}" />
      <div className="lx-wrap">
        <div className="rt-gives-h">
          <h2 id="rt-gives-h" className="lx-headline">What the stream gives you</h2>
          <p className="lx-lede">One connection, and the rules you already wrote deciding what goes down it</p>
        </div>
        <div className="rt-gives-b">
          <div className="rt-graph-w" data-paused={paused || undefined}>
            <div className="rt-graph-bar">
              <p className="rt-graph-ev" aria-hidden="true"><i />{ev[0]} · record {ev[1]}</p>
              <LivePause inline paused={paused} onToggle={pause} className="rt-gpause" />
            </div>
            <RtGraph sel={sel} onPick={pick} onPeek={setPeek} run={run} calm={calm} ev={ev} evAt={evAt} />
            <FlipVeil />
          </div>
          <div className="rt-facts">
            {/* every part's words in one cell: the panel is as tall as the longest, so changing part never moves a thing */}
            <div className="rt-facts-in" aria-live="polite">
              {GIVES.map(([t, d], i) => (
                <article key={t} className={'rt-fact' + (i === fi ? ' on' : '')} aria-hidden={i !== fi || undefined}>
                  <p className="lx-kick">{`${String(i + 1).padStart(2, '0')} / ${String(GIVES.length).padStart(2, '0')}`}</p>
                  <h3 className="rt-fact-t">{t}</h3>
                  <p className="rt-fact-d">{d}</p>
                </article>
              ))}
            </div>
            <ol className="rt-fact-dots" aria-label="What the stream gives you">
              {GIVES.map(([t], i) => (
                <li key={t}><button type="button" aria-label={t} aria-current={i === fi || undefined} onClick={() => pick(TOUR[i])}><i /></button></li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- use cases: a rail you throw ---------- */
const USES = [
  ['Chat Applications', 'Build messaging apps with real-time delivery, typing indicators, and read receipts.', 'chat'],
  ['Collaborative Workspaces', 'Create shared workspaces where multiple users can collaborate simultaneously.', 'space'],
  ['Collaborative Editing', "Several people editing one document, each of them seeing the others' changes land as they happen.", 'edit'],
  ['Multiplayer Games', 'Develop low-latency multiplayer games with synchronized game state across players.', 'game'],
  ['Live Dashboards', 'Build dashboards that update in real-time as new data becomes available.', 'dash'],
  ['Dev Tooling', 'Create collaborative coding environments with real-time changes and execution.', 'dev'],
];

function Vignette({ k }) {
  if (k === 'chat') return <div className="rt-v chat"><i /><i className="me" /><i /><b>· · ·</b></div>;
  if (k === 'space') return <div className="rt-v space">{[0, 1, 2, 3].map((x) => <i key={x} />)}<u /></div>;
  if (k === 'edit') return <div className="rt-v edit">{[70, 92, 54, 80].map((w, x) => <i key={x} style={{ width: w + '%' }} />)}<u /><u className="b" /></div>;
  if (k === 'game') return <div className="rt-v game">{Array.from({ length: 16 }, (_, x) => <i key={x} className={[5, 10].includes(x) ? 'p' : ''} />)}</div>;
  if (k === 'dash') return <div className="rt-v dash">{[40, 64, 52, 80, 70, 92].map((h, x) => <i key={x} style={{ height: h + '%' }} />)}</div>;
  return <div className="rt-v dev">{[60, 84, 40, 72].map((w, x) => <i key={x} style={{ width: w + '%' }} />)}<u /></div>;
}

function Rail() {
  const wrap = useRef(null);
  const track = useRef(null);
  const x = useMotionValue(0);
  // one hard stop for drag and arrows alike, measured from the track (a throw can never run past where Next stops)
  const [min, setMin] = useState(0);
  useEffect(() => {
    const m = () => { const w = wrap.current, t = track.current; if (w && t) setMin(Math.min(0, w.offsetWidth - t.scrollWidth)); };
    m(); addEventListener('resize', m);
    return () => removeEventListener('resize', m);
  }, []);
  const nudge = (d) => {
    const w = wrap.current, t = track.current;
    if (!w || !t) return;
    const min = Math.min(0, w.offsetWidth - t.scrollWidth);
    animate(x, Math.max(min, Math.min(0, x.get() - d * (w.offsetWidth * 0.6))), { duration: 0.5, ease: IO });
  };
  return (
    <div className="rt-rail">
      <div className="lx-wrap rt-rail-ctl">
        <p className="rt-rail-k">Popular Use Cases</p>
        <button type="button" aria-label="Previous use cases" onClick={() => nudge(-1)}><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M13 8H4M7.5 4.5 4 8l3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
        <button type="button" aria-label="Next use cases" onClick={() => nudge(1)}><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
      </div>
      <div className="rt-rail-v" ref={wrap} data-cursor="" data-swipe-own>
        {/* inertia that stops hard at either end: no elastic overscroll, so nothing springs back */}
        <motion.div className="rt-rail-in" ref={track} style={{ x }} drag="x" dragConstraints={{ left: min, right: 0 }} dragElastic={0} dragTransition={{ power: 0.25, timeConstant: 260 }}>
          {USES.map(([t, d, k], i) => (
            <article key={t} className="rt-use" style={{ '--i': i }}>
              <Vignette k={k} />
              <h3 className="lx-title">{t}</h3>
              <p>{d}</p>
            </article>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

/* ---------- the handshake (the dark room) ---------- */
const WIRE = `// 1. mint a grant on an ordinary authenticated request
const { token } = await post('/v1/realtime/token');

// 2. spend it — once, and within thirty seconds
const es = new EventSource('/v1/realtime?token=' + token);
es.addEventListener('CONNECT', (ev) => {
  const { clientId } = JSON.parse(ev.data);
  // 3. name the collections and records you want
  post('/v1/realtime', {
    clientId,
    subscriptions: [
      'messages',        // the whole collection
      'orders/ord_42',   // one record
    ],
  });
});

// records arrive as events named for the topic
es.addEventListener('messages', (ev) => {
  const { action, record } = JSON.parse(ev.data);
  if (action === 'delete') remove(record.id);
  else render(record);
});

// a grant is spent; a dropped stream reopens with a new one
es.onerror = () => reconnect();`;

const CALLS = [
  ['Mint a grant', 'One authenticated request returns a string good for thirty seconds and exactly one stream', '/v1/realtime/token'],
  ['Open the stream, name your topics', 'Spend the grant, take the client id it hands back, then post the collections and records you care about', 'subscriptions'],
  ['Write a record', 'Any create, update or delete reaches everyone watching whose rule lets them see it', 'render(record)'],
];

function Handshake() {
  const [ref, live] = useLive(0.35);
  const [paused, pause] = usePause();
  const [at, choose] = useSteps(3, 3600, live && !paused);
  const mounted = useMounted();
  return (
    <div className="lx-wrap rt-hand" ref={ref}>
      <div className="rt-hand-l">
        <h2 className="lx-headline">Three calls, then it is live</h2>
        <p className="lx-lede">Mint a grant, spend it to open the stream, say what you want to hear about</p>
        {/* one call open at a time: its words land in one slot under the list (all three stay in the HTML) */}
        <ol className="rt-calls" data-live={mounted || undefined}>
          {CALLS.map(([t, d], i) => (
            <li key={t} className={at === i ? 'on' : ''}>
              <button type="button" onClick={() => choose(i)} aria-expanded={at === i} aria-controls={'rt-call-' + i}><span className="lx-num">{i + 1}</span><span className="rt-call-t">{t}</span></button>
              <p id={'rt-call-' + i}>{d}</p>
            </li>
          ))}
        </ol>
        <details className="rt-full">
          <summary><h3 className="rt-h3">The handshake, in full</h3><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M8 3v10M3 8h10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg></summary>
          <p className="rt-hp">There is no hidden protocol here. A grant is minted on a normal authenticated request, the stream spends it once, and the client id that comes back is how you tell the server which collections and records you want. The SDK does all three for you; the raw calls are there if you would rather do it yourself.</p>
        </details>
      </div>
      <div className="rt-hand-r">
        <div className="rt-hand-bar">
          <p className="lx-kick">The wire, without the SDK</p>
          <LivePause inline dark paused={paused} onToggle={pause} />
        </div>
        <Code title="Wire" mark={CALLS[at][2]} tabs={[{ k: 'realtime.js', code: WIRE }]} className="rt-wire" />
      </div>
    </div>
  );
}

/* ---------- growth: three figures beside one tenant map that changes ---------- */
const GROW = [
  ['A change costs its audience', 'A record is written once and handed to the subscribers already attached to it. The work is the number of people watching, not the size of the collection they are watching.', 'Cost of a write', 'Per subscriber'],
  ['A stream is a response', 'Not a process, not a socket server beside the API — an HTTP response left open. They are cheap to hold, and one that goes away releases what it held without anything needing to be told.', '', 'One open response'],
  ['Isolated by tenant', "Every org's subscribers sit on that org's own broker, over that org's own data. Adding a tenant adds a broker rather than widening a shared one, so nobody's growth is anybody else's problem.", 'Blast radius', 'One tenant'],
];
const ORGS = [['org a', 4], ['org b', 6], ['org c', 3], ['org d', 2]];

function TenantMap({ at, n }) {
  const orgs = at === 2 ? ORGS : ORGS.slice(0, 3);
  const k = n % 6;
  return (
    <div className="rt-tm" data-at={at} aria-hidden="true">
      <div className="rt-tm-col">
        <p className="rt-tm-k">messages</p>
        <div className="rt-tm-rows">{Array.from({ length: 12 }, (_, r) => <i key={r} className={r === 4 ? 'w' : ''} />)}</div>
      </div>
      <div className="rt-tm-lanes">
        <AnimatePresence initial={false}>
          {orgs.map(([o, subs], j) => {
            const lit = at === 0 ? j === 0 : at === 1 ? j === 0 : j === 3;
            return (
              <motion.div key={o} layout className={'rt-lane' + (lit ? ' on' : '')} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, transition: QUICK }} transition={{ ...ARRIVE, layout: GLIDE }}>
                <p>{o} · broker</p>
                <span className="rt-lane-s">
                  {Array.from({ length: subs }, (_, s) => {
                    const on = at === 0 ? j === 0 && s < Math.min(subs, k) : at === 1 ? j === 0 && s === 0 && k < 4 : lit;
                    const gone = at === 1 && j === 0 && s === 0 && k >= 4;
                    return <i key={s} className={(on ? 'on' : '') + (gone ? ' gone' : '')} />;
                  })}
                </span>
                {at === 1 && j === 0 && <em className={k >= 4 ? 'gone' : ''}>HTTP 200 · text/event-stream · open</em>}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Grow() {
  const [ref, live] = useLive(0.3);
  const [paused, pause] = usePause();
  const run = live && !paused;
  const [at, choose] = useSteps(3, 5200, run);
  const n = useBeat(run, 700);
  const mounted = useMounted();
  return (
    <div className="rt-grow-b" ref={ref}>
      {/* one note open at a time: its figure grows to its moment and its words land in one slot under the list */}
      <ol className="rt-gl" data-live={mounted || undefined}>
        {GROW.map(([t, d, k, v], i) => (
          <li key={t} className={'rt-g' + (at === i ? ' on' : '')} onPointerEnter={(e) => e.pointerType === 'mouse' && at !== i && choose(i)}>
            <button type="button" className="rt-g-v" aria-expanded={at === i} aria-controls={'rt-g-' + i} onClick={() => choose(i)}><span>{v}</span></button>
            <div className="rt-g-row"><h3 className="rt-g-t">{t}</h3>{k && <span className="rt-g-k">{k}</span>}</div>
            <p className="rt-g-d" id={'rt-g-' + i}>{d}</p>
          </li>
        ))}
      </ol>
      <div className="rt-tm-w">
        <LivePause paused={paused} onToggle={pause} className="rt-tpause" />
        <TenantMap at={at} n={n} />
      </div>
    </div>
  );
}

export default function Realtime() {
  return (
    <main className="lx rt" data-cursor="">
      <ShrinkToCard className="rt-hero" data-morph-target data-ask-name="Hanzo Realtime">
        <div className="lx-wrap">
          <LineMask as="h1" className="lx-display rt-h1" lines={['Your screen updates', 'when the data does']} />
          <div className="rt-hero-grid">
            <div className="rt-hero-obj rt-frame"><Screens /></div>
            <div className="rt-hero-r">
              <p className="lx-lede rt-sub">Live record updates</p>
              <A to={KEYS} className="lx-cta" data-thumb="Start Building" data-cta="realtime.hero" data-cursor="">Start Building<Arr /></A>
              <A to={DOCS} className="lx-text rt-docs">View Documentation</A>
            </div>
          </div>
        </div>
      </ShrinkToCard>

      <Gives />

      <section className="lx-sec rt-say">
        <div className="lx-wrap rt-say-grid">
          <p className="rt-say-t">Open one stream and records reach the browser as they change — created, updated, deleted — with no polling loop and no timer deciding how stale a page is allowed to get. A subscription is a collection, or a single record inside it, and the access rule already guarding that collection decides what any given subscriber is allowed to receive.</p>
          <Code className="rt-watch" title="Watch" tabs={[{ k: 'subscribe', code: WATCH }]} light />
        </div>
      </section>

      <CardDeal className="lx-sec rt-uses">
        <div className="lx-wrap rt-uses-h">
          <h2 className="lx-headline">Build Interactive Experiences</h2>
          <p className="lx-lede">Hanzo Realtime powers a wide range of applications that demand immediate data updates</p>
        </div>
        <Rail />
      </CardDeal>

      <section className="rt-room lx-dark" data-room="dark"><Handshake /></section>

      <section className="lx-sec rt-grow">
        <div className="lx-wrap">
          <div className="rt-grow-h">
            <h2 className="lx-headline">What happens as it grows</h2>
            <p className="lx-lede">The parts that scale, and the parts that are simply not in the way</p>
          </div>
          <Grow />
          <Ticker><SpecDrawer className="rt-spec" rows={[{ v: 'No polling', l: 'The client asks once, not every second' }, { v: 'Reconnects itself', l: 'A dropped stream reopens with a fresh grant' }, { v: 'Nothing extra to run', l: 'The same binary that serves the API serves the stream' }]} /></Ticker>
        </div>
      </section>

      <RelatedCards className="rt-open" title="Open a stream" items={[['Subscribe to your first collection', 'https://github.com/hanzoai', 'View on GitHub']]}>
        <Venetian className="rt-open-l">
          <h2 className="lx-headline"><span className="rt-vl">Two calls and the page</span> <span className="rt-vl">keeps itself current</span></h2>
          <p className="lx-lede">Mint a grant, open the stream, name a collection. No credit card to start.</p>
          <div className="rt-open-acts"><A to={KEYS} className="lx-text">Start Building</A><A to={DOCS} className="lx-text">Documentation</A></div>
        </Venetian>
      </RelatedCards>

      <LaunchClose name="Realtime" tag="Realtime channels + presence" seed="realtime" data={[30, 3, 2]} ask={['Start Building', KEYS]} cta="realtime.close" />
    </main>
  );
}
