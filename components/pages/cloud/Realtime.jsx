'use client';
/* Realtime. Signature: the same record landing on three screens at once. Three connected clients watch one collection;
   a record is created, updated, then deleted, and each change lands on every screen in the same instant, except that
   the delete reaches only the clients whose rule would have let them read it. The handshake section steps through the
   three calls while the matching line lights in the raw code; use cases drift past on a slow rail; growth is the
   page's dark room. Every word and link is Hanzo's; record contents are examples.
   Beyond: the rule switch. Each client's access rule can be flipped (can read record b, or cannot), and the same create,
   update and delete replay: a client whose rule cannot read b never sees it arrive, change or leave, which is Hanzo's
   "deletes are checked too" played out instead of told. */
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EASE, Rise } from '../../ui';
import { A } from '../../kit';
import { Hero, Get, Code, Head, useLive, useSteps } from './Frame';
import './Realtime.css';

const WATCH = `// Watch a collection
const stop = await base
  .collection('messages')
  .subscribe('*', (e) => {
    console.log(e.action, e.record.id);
    render(e.record);
  });
// create | update | delete`;

// a little life of one record: [action, rows shown]
const BEATS = [['create', ['a', 'b']], ['create', ['a', 'b', 'c']], ['update', ['a', 'b*', 'c']], ['delete', ['a', 'c']]];

function Screens() {
  const [ref, live, calm] = useLive(0.3);
  const [i, setI] = useState(0);
  const [deny, setDeny] = useState([false, false, true]); // client 3's rule cannot read record b, until you flip it
  useEffect(() => { if (calm) setI(2); }, [calm]); // reduced motion: the update beat, set after hydration
  useEffect(() => {
    if (calm || !live) return;
    const t = setTimeout(() => setI((v) => (v + 1) % BEATS.length), 2200);
    return () => clearTimeout(t);
  }, [i, live, calm]);
  const [action, rows] = BEATS[i];
  return (
    <div className="rt-stage" ref={ref}>
      <div className="rt-conn" aria-hidden="true"><b>Live connection</b><span>One open stream</span><span>Records arrive as they change</span></div>
      <div className="rt-screens">
        {[1, 2, 3].map((c) => {
          const no = deny[c - 1];
          return (
            <div key={c} className={'rt-screen' + (no ? ' no' : '')}>
              <div className="rt-top"><span>Client {c}</span><em aria-hidden="true">Connected</em></div>
              <button type="button" className="rt-gate" aria-pressed={!no} aria-label={`Client ${c}'s rule can read record b`} onClick={() => setDeny((d) => d.map((v, k) => (k === c - 1 ? !v : v)))}>
                <i aria-hidden="true" />{no ? "rule can't read b" : 'rule reads b'}
              </button>
              <ul aria-hidden="true">
                <AnimatePresence initial={false}>
                  {rows.filter((r) => !(no && r.startsWith('b'))).map((r) => (
                    <motion.li key={r[0]} layout initial={{ opacity: 0, y: -10, backgroundColor: '#e8f8ed' }} animate={{ opacity: 1, y: 0, backgroundColor: r.endsWith('*') ? '#fff7e6' : '#ffffff' }} exit={{ opacity: 0, x: 30, transition: { duration: 0.3 } }} transition={{ duration: 0.45, ease: EASE }}>
                      <i /><span style={{ width: { a: '62%', b: '48%', c: '70%' }[r[0]] }} />
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
              {no && action !== 'create' && <p className="rt-rule" aria-hidden="true">rule · not for this subscriber</p>}
            </div>
          );
        })}
      </div>
      <div className="rt-act" aria-hidden="true">
        {['create', 'update', 'delete'].map((a) => <span key={a} className={a === action ? 'on ' + a : ''}>{a}</span>)}
      </div>
      <p className="rt-ruleline">A delete is announced only to the subscribers whose rule would have let them read the record.</p>
      <Code className="rt-watch" title="Watch" tabs={[{ k: 'subscribe', code: WATCH }]} />
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

const USES = [
  ['Chat Applications', 'Build messaging apps with real-time delivery, typing indicators, and read receipts.'],
  ['Collaborative Workspaces', 'Create shared workspaces where multiple users can collaborate simultaneously.'],
  ['Collaborative Editing', "Several people editing one document, each of them seeing the others' changes land as they happen."],
  ['Multiplayer Games', 'Develop low-latency multiplayer games with synchronized game state across players.'],
  ['Live Dashboards', 'Build dashboards that update in real-time as new data becomes available.'],
  ['Dev Tooling', 'Create collaborative coding environments with real-time changes and execution.'],
];

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
  const [at, choose] = useSteps(3, 3600, live);
  return (
    <section className="x-sec rt-hand" ref={ref}>
      <div className="x-wrap">
        <Head title="Three calls, then it is live" lede="Mint a grant, spend it to open the stream, say what you want to hear about" />
        <div className="rt-hand-grid">
          <div>
            <h3 className="rt-h3">The handshake, in full</h3>
            <p className="rt-p">There is no hidden protocol here. A grant is minted on a normal authenticated request, the stream spends it once, and the client id that comes back is how you tell the server which collections and records you want. The SDK does all three for you; the raw calls are there if you would rather do it yourself.</p>
            <ol className="rt-calls">
              {CALLS.map(([t, d], i) => (
                <li key={t} className={at === i ? 'on' : ''}>
                  <button type="button" onClick={() => choose(i)} aria-pressed={at === i}><span>{i + 1}</span><b>{t}</b></button>
                  <p>{d}</p>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <p className="rt-wire-k">The wire, without the SDK</p>
            <Code light title="Wire" mark={CALLS[at][2]} tabs={[{ k: 'realtime.js', code: WIRE }]} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Realtime() {
  return (
    <main className="rt">
      <Hero
        kick="Live record updates"
        title={['Your screen updates', 'when the data does']}
        lede="Open one stream and records reach the browser as they change — created, updated, deleted — with no polling loop and no timer deciding how stale a page is allowed to get. A subscription is a collection, or a single record inside it, and the access rule already guarding that collection decides what any given subscriber is allowed to receive."
        acts={[['Start Building', 'https://platform.hanzo.ai/api-keys'], ['View Documentation', 'https://docs.hanzo.ai']]}
      >
        <Screens />
      </Hero>
      <section className="x-sec rt-gives">
        <div className="x-wrap">
          <Head title="What the stream gives you" lede="One connection, and the rules you already wrote deciding what goes down it" />
          <div className="rt-bento">
            {GIVES.map(([t, d], i) => (
              <Rise key={t} className={'rt-b b' + i} delay={(i % 4) * 0.05} y={18}>
                <span className="rt-b-n">{String(i + 1).padStart(2, '0')}</span>
                <h3>{t}</h3>
                <p>{d}</p>
              </Rise>
            ))}
          </div>
        </div>
      </section>
      <section className="x-sec rt-uses">
        <div className="x-wrap"><Head kick="Popular Use Cases" title="Build Interactive Experiences" lede="Hanzo Realtime powers a wide range of applications that demand immediate data updates" /></div>
        <div className="rt-rail" tabIndex={0} aria-label="Use cases" role="region" data-swipe-own>
          <div className="rt-rail-in">
            {[...USES, ...USES].map(([t, d], i) => (
              <article key={i} className="rt-use" aria-hidden={i >= USES.length}><span className="rt-dot" /><h3>{t}</h3><p>{d}</p></article>
            ))}
          </div>
        </div>
      </section>
      <Handshake />
      <section className="x-sec rt-grow" data-room="dark">
        <div className="x-wrap">
          <Head dark title="What happens as it grows" lede="The parts that scale, and the parts that are simply not in the way" />
          <div className="rt-three">
            {[['A change costs its audience', 'A record is written once and handed to the subscribers already attached to it. The work is the number of people watching, not the size of the collection they are watching.', 'Cost of a write', 'Per subscriber'], ['A stream is a response', 'Not a process, not a socket server beside the API — an HTTP response left open. They are cheap to hold, and one that goes away releases what it held without anything needing to be told.', '', 'One open response'], ['Isolated by tenant', "Every org's subscribers sit on that org's own broker, over that org's own data. Adding a tenant adds a broker rather than widening a shared one, so nobody's growth is anybody else's problem.", 'Blast radius', 'One tenant']].map(([t, d, k, v], i) => (
              <Rise key={t} className="rt-g" delay={i * 0.08}>
                <p className="rt-g-k">{k}</p>
                <p className="rt-g-v">{v}</p>
                <h3>{t}</h3>
                <p>{d}</p>
              </Rise>
            ))}
          </div>
          <ul className="rt-small">
            {[['No polling', 'The client asks once, not every second'], ['Reconnects itself', 'A dropped stream reopens with a fresh grant'], ['Nothing extra to run', 'The same binary that serves the API serves the stream']].map(([a, b]) => <li key={a}><b>{a}</b><span>{b}</span></li>)}
          </ul>
        </div>
      </section>
      <section className="x-sec rt-open">
        <div className="x-wrap rt-open-grid">
          <div>
            <p className="x-kick">Open a stream</p>
            <h2>Two calls and the page keeps itself current</h2>
            <p>Mint a grant, open the stream, name a collection. No credit card to start.</p>
            <div className="rt-acts"><A to="https://platform.hanzo.ai/api-keys" className="x-btn solid" data-thumb="Start Building">Start Building</A><A to="https://docs.hanzo.ai" className="x-btn">Documentation</A></div>
          </div>
          <div className="rt-first">
            <h3>Subscribe to your first collection</h3>
            <A to="https://github.com/hanzoai" className="x-btn">View on GitHub</A>
          </div>
        </div>
      </section>
      <Get name="Realtime" tag="Realtime channels + presence" />
    </main>
  );
}
