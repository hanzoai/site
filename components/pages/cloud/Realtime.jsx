'use client';
/* Realtime, v2 launch page (Cloud 3).
   V2: 8/10 Split launch: three live client screens settle under a two-line title, the stream's eight promises pin over one stream map, use cases on a drag rail, the handshake as the one dark room, growth as huge figures.
   Signature: the same record landing on three client screens at once. A record is created, updated, then deleted;
   each change pulses down the one open stream and lands on every screen in the same instant, except that the delete
   reaches only the clients whose rule would have let them read it.
   Beyond: the rule switch. Flip each client's access rule (reads record b, or cannot) and the same create, update and
   delete replay: a client whose rule cannot read b never sees it arrive, change or leave, Hanzo's "deletes are checked
   too" played out instead of told.
   Motion: signature = the three screens; supporting = Stage settle and pinned chapters (scroll), the drag rail of use
   cases, the clip wipe into the dark room. Every word and link is Hanzo's; record contents are examples. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, animate } from 'motion/react';
import { A } from '../../kit';
import { Code, useLive, useEvery, useSteps } from './Frame';
import SettleStage from '../../v2/SettleStage';
import PinnedChapters from '../../v2/PinnedChapters';
import ClipWipe from '../../v2/ClipWipe';
import SpecDrawer from '../../v2/SpecDrawer';
import LaunchClose from '../../v2/LaunchClose';
import LineMask from '../../v2/LineMask';
import './Realtime.css';

const EASE = [0.16, 1, 0.3, 1];
const SPRING = { type: 'spring', stiffness: 300, damping: 30 };

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
  const [i, setI] = useState(1);
  const [deny, setDeny] = useState([false, false, true]); // client 3's rule cannot read record b, until you flip it
  useEffect(() => { if (calm) setI(2); }, [calm]);
  useEffect(() => {
    if (calm || !live) return;
    const t = setTimeout(() => setI((v) => (v + 1) % BEATS.length), 2300);
    return () => clearTimeout(t);
  }, [i, live, calm]);
  const [action, rows] = BEATS[i];
  const hitsB = action !== 'create' || i === 0;
  return (
    <div className="rt-stage" ref={ref}>
      <div className="rt-conn">
        <b>Live connection</b><span>One open stream</span><span>Records arrive as they change</span>
        <span className="rt-acts" aria-hidden="true">{['create', 'update', 'delete'].map((a) => <i key={a} className={a === action ? 'on' : ''}>{a}</i>)}</span>
      </div>
      <div className="rt-pipes" aria-hidden="true">{[0, 1, 2].map((c) => <i key={c + '-' + i} className={deny[c] && hitsB && action !== 'create' ? 'mute' : 'go'} style={{ animationDelay: c * 40 + 'ms' }} />)}</div>
      <div className="rt-screens">
        {[1, 2, 3].map((c) => {
          const no = deny[c - 1];
          return (
            <div key={c} className={'rt-screen' + (no ? ' no' : '')}>
              <div className="rt-top"><span>Client {c}</span><em>Connected</em></div>
              <ul aria-hidden="true">
                <AnimatePresence initial={false} mode="popLayout">
                  {rows.filter((r) => !(no && r.startsWith('b'))).map((r) => (
                    <motion.li key={r[0]} layout className={r.endsWith('*') ? 'upd' : ''} initial={{ opacity: 0, y: -14, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, x: 36, transition: { duration: 0.28 } }} transition={SPRING}>
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

/* ---------- the chapters' object: the stream, mapped ---------- */
const MAP = ['GET /v1/realtime', 'subscriptions', 'brokers', 'delete · b', 'one store', 'access rule', 'grant', 'deployment'];

function Panel({ step, n }) {
  if (step === 0) {
    const drop = n % 8 >= 6;
    const lines = Array.from({ length: 4 }, (_, k) => ['create', 'update', 'update', 'delete'][(n + k) % 4]);
    return (
      <div className="rt-p">
        <p className={'rt-net' + (drop ? ' drop' : '')}><i />{drop ? 'network dropped · reconnecting' : 'HTTP 200 · text/event-stream · open'}</p>
        <div className="rt-sse">
          <AnimatePresence initial={false} mode="popLayout">
            {lines.map((a, k) => <motion.code key={n + '-' + k} layout initial={{ opacity: 0, y: -12 }} animate={{ opacity: drop ? 0.35 : 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35, ease: EASE }}>event: messages · {a}</motion.code>)}
          </AnimatePresence>
        </div>
      </div>
    );
  }
  if (step === 1) {
    const one = Math.floor(n / 3) % 2 === 1;
    return (
      <div className="rt-p">
        <div className="rt-chips"><span className={one ? '' : 'on'}>messages</span><span className={one ? 'on' : ''}>orders/ord_42</span><em>stream · still open</em></div>
        <div className="rt-ev">
          {[['messages', 'msg_7'], ['orders', 'ord_42'], ['orders', 'ord_43'], ['messages', 'msg_8']].map(([c, id]) => {
            const heard = one ? id === 'ord_42' : c === 'messages';
            return <p key={id} className={heard ? 'on' : ''}><b>{c}</b>{id}<em>{heard ? 'heard' : '—'}</em></p>;
          })}
        </div>
      </div>
    );
  }
  if (step === 2) {
    return (
      <div className="rt-p">
        <div className="rt-orgs">
          {['org a', 'org b'].map((o, k) => (
            <div key={o} className={'rt-org' + (n % 2 === k ? ' on' : '')}>
              <p>{o} · broker</p>
              <code>messages</code>
              <span className="rt-dots">{[0, 1, 2].map((d) => <i key={d} className={n % 2 === k && d <= n % 3 ? 'on' : ''} />)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (step === 3) {
    const sent = n % 3 !== 0;
    return (
      <div className="rt-p">
        <p className="rt-del"><b>delete</b>record b</p>
        <div className="rt-subs">
          {[['subscriber 1', true], ['subscriber 2', true], ['subscriber 3', false]].map(([s, can]) => (
            <p key={s} className={can ? (sent ? 'on' : '') : 'no'}><b>{s}</b><span>{can ? (sent ? 'told · delete b' : '…') : 'rule cannot read b · not told'}</span></p>
          ))}
        </div>
      </div>
    );
  }
  if (step === 4) {
    return (
      <div className="rt-p">
        <div className="rt-same">
          <span className={'rt-r' + (n % 2 ? ' on' : '')}>API</span>
          <span className="rt-store">one store</span>
          <span className={'rt-r' + (n % 2 ? '' : ' on')}>stream</span>
        </div>
        <p className="rt-bus"><s>event bus</s> nothing to keep in step</p>
      </div>
    );
  }
  if (step === 5) {
    return (
      <div className="rt-p">
        <p className="rt-who">identity · usr_123</p>
        <div className="rt-pred"><code>access rule</code></div>
        <div className="rt-same two"><span className={'rt-r' + (n % 2 ? ' on' : '')}>guards the API</span><span className={'rt-r' + (n % 2 ? '' : ' on')}>filters the stream</span></div>
      </div>
    );
  }
  if (step === 6) {
    const k = n % 8;
    const left = Math.max(0, 30 - k * 5);
    return (
      <div className="rt-p">
        <ol className="rt-grant">
          <li className={k >= 0 ? 'on' : ''}><code>POST /v1/realtime/token</code><span>authenticated</span></li>
          <li className={k >= 1 ? 'on' : ''}><code>grant</code><span className="lx-num">{k >= 5 ? 'spent' : left + 's'}</span></li>
          <li className={k >= 5 ? 'on' : ''}><code>EventSource · ?token=grant</code><span>once</span></li>
        </ol>
        <p className="rt-bus"><s>token in the URL</s> nothing for a proxy log to keep</p>
      </div>
    );
  }
  const k = n % 4;
  return (
    <div className="rt-p">
      <div className="rt-lim">
        <p>deployment · limit 2</p>
        <div className="rt-slots">{[0, 1].map((s) => <i key={s} className={s < Math.min(2, k + 1) ? 'on' : ''}>{s < Math.min(2, k + 1) ? ['org a', 'org b'][s] : ''}</i>)}</div>
      </div>
      <p className={'rt-wait' + (k >= 2 ? ' on' : '')}>org c · waits: counted once for the process</p>
    </div>
  );
}

function StreamMap({ step }) {
  const [ref, live] = useLive(0.3);
  const [n, setN] = useState(0);
  useEvery(1100, live, () => setN((v) => v + 1));
  return (
    <div className="rt-map" ref={ref}>
      <div className="rt-map-h">
        <span className="rt-live" aria-hidden="true" />
        <AnimatePresence mode="wait" initial={false}>
          <motion.code key={step} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3, ease: EASE }}>{MAP[step]}</motion.code>
        </AnimatePresence>
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={step} className="rt-map-b" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, transition: { duration: 0.16 } }} transition={{ duration: 0.45, ease: EASE }}>
          <Panel step={step} n={n} />
        </motion.div>
      </AnimatePresence>
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
  const nudge = (d) => {
    const w = wrap.current, t = track.current;
    if (!w || !t) return;
    const min = Math.min(0, w.offsetWidth - t.scrollWidth);
    animate(x, Math.max(min, Math.min(0, x.get() - d * (w.offsetWidth * 0.6))), SPRING);
  };
  return (
    <div className="rt-rail">
      <div className="rt-rail-v" ref={wrap} data-cursor="Drag" data-swipe-own>
        <motion.div className="rt-rail-in" ref={track} style={{ x }} drag="x" dragConstraints={wrap} dragElastic={0.08} dragTransition={{ power: 0.25, timeConstant: 260 }}>
          {USES.map(([t, d, k]) => (
            <article key={t} className="rt-use">
              <Vignette k={k} />
              <h3 className="lx-title">{t}</h3>
              <p>{d}</p>
            </article>
          ))}
        </motion.div>
      </div>
      <div className="lx-wrap rt-rail-ctl">
        <button type="button" aria-label="Previous use cases" onClick={() => nudge(-1)}>←</button>
        <button type="button" aria-label="Next use cases" onClick={() => nudge(1)}>→</button>
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
  const [at, choose] = useSteps(3, 3600, live);
  return (
    <div className="lx-wrap rt-hand" ref={ref}>
      <div className="rt-hand-l">
        <h2 className="lx-headline">Three calls, then it is live</h2>
        <p className="lx-lede">Mint a grant, spend it to open the stream, say what you want to hear about</p>
        <ol className="rt-calls">
          {CALLS.map(([t, d], i) => (
            <li key={t} className={at === i ? 'on' : ''}>
              <button type="button" onClick={() => choose(i)} aria-pressed={at === i}><span className="lx-num">{i + 1}</span><b>{t}</b></button>
              <p>{d}</p>
            </li>
          ))}
        </ol>
        <h3 className="rt-h3">The handshake, in full</h3>
        <p className="rt-hp">There is no hidden protocol here. A grant is minted on a normal authenticated request, the stream spends it once, and the client id that comes back is how you tell the server which collections and records you want. The SDK does all three for you; the raw calls are there if you would rather do it yourself.</p>
      </div>
      <div className="rt-hand-r">
        <p className="lx-kick">The wire, without the SDK</p>
        <Code title="Wire" mark={CALLS[at][2]} tabs={[{ k: 'realtime.js', code: WIRE }]} className="rt-wire" />
      </div>
    </div>
  );
}

const GROW = [
  ['A change costs its audience', 'A record is written once and handed to the subscribers already attached to it. The work is the number of people watching, not the size of the collection they are watching.', 'Cost of a write', 'Per subscriber'],
  ['A stream is a response', 'Not a process, not a socket server beside the API — an HTTP response left open. They are cheap to hold, and one that goes away releases what it held without anything needing to be told.', '', 'One open response'],
  ['Isolated by tenant', "Every org's subscribers sit on that org's own broker, over that org's own data. Adding a tenant adds a broker rather than widening a shared one, so nobody's growth is anybody else's problem.", 'Blast radius', 'One tenant'],
];

export default function Realtime() {
  const steps = GIVES.map(([t, d]) => ({ t, d }));
  return (
    <main className="lx rt">
      <section className="rt-hero" data-morph-target>
        <div className="lx-wrap">
          <p className="lx-kick"><b>●</b> Live record updates</p>
          <LineMask as="h1" className="lx-display m rt-h1" lines={['Your screen updates', 'when the data does']} />
          <div className="rt-hero-grid">
            <SettleStage from={1.04} lift={30} className="rt-hero-obj"><Screens /></SettleStage>
            <div className="rt-hero-r">
              <A to="https://platform.hanzo.ai/api-keys" className="lx-cta" data-thumb="Start Building">Start Building</A>
              <A to="https://docs.hanzo.ai" className="lx-ghost">View Documentation</A>
              <p className="rt-hint">tap a client's rule ↙</p>
            </div>
          </div>
        </div>
      </section>

      <section className="lx-sec rt-say">
        <div className="lx-wrap rt-say-grid">
          <p className="rt-say-t">Open one stream and records reach the browser as they change — created, updated, deleted — with no polling loop and no timer deciding how stale a page is allowed to get. A subscription is a collection, or a single record inside it, and the access rule already guarding that collection decides what any given subscriber is allowed to receive.</p>
          <Code className="rt-watch" title="Watch" tabs={[{ k: 'subscribe', code: WATCH }]} light />
        </div>
      </section>

      <section className="lx-sec rt-gives-h">
        <div className="lx-wrap">
          <LineMask as="h2" className="lx-display m" lines={['What the stream', 'gives you']} inView />
          <p className="lx-lede rt-gives-l">One connection, and the rules you already wrote deciding what goes down it</p>
        </div>
      </section>

      <PinnedChapters label="What the stream gives you" steps={steps} per={66} visual={(at) => <StreamMap step={at} />} />

      <section className="lx-sec rt-uses">
        <div className="lx-wrap rt-uses-h">
          <p className="lx-kick">Popular Use Cases</p>
          <h2 className="lx-headline">Build Interactive Experiences</h2>
          <p className="lx-lede">Hanzo Realtime powers a wide range of applications that demand immediate data updates</p>
        </div>
        <Rail />
      </section>

      <ClipWipe dark className="rt-room"><Handshake /></ClipWipe>

      <section className="lx-sec rt-grow">
        <div className="lx-wrap">
          <div className="rt-grow-h">
            <h2 className="lx-display s">What happens as it grows</h2>
            <p className="lx-lede">The parts that scale, and the parts that are simply not in the way</p>
          </div>
          <div className="rt-three">
            {GROW.map(([t, d, k, v]) => (
              <article key={t} className="rt-g">
                <p className="lx-kick">{k || ' '}</p>
                <p className="rt-g-v">{v}</p>
                <h3 className="lx-title">{t}</h3>
                <p className="rt-g-d">{d}</p>
              </article>
            ))}
          </div>
          <SpecDrawer className="rt-spec" rows={[{ v: 'No polling', l: 'The client asks once, not every second' }, { v: 'Reconnects itself', l: 'A dropped stream reopens with a fresh grant' }, { v: 'Nothing extra to run', l: 'The same binary that serves the API serves the stream' }]} />
        </div>
      </section>

      <section className="lx-sec rt-open">
        <div className="lx-wrap rt-open-grid">
          <div>
            <p className="lx-kick"><b>●</b> Open a stream</p>
            <h2 className="lx-display s">Two calls and the page keeps itself current</h2>
            <p className="lx-lede">Mint a grant, open the stream, name a collection. No credit card to start.</p>
            <div className="rt-open-acts"><A to="https://platform.hanzo.ai/api-keys" className="lx-cta">Start Building</A><A to="https://docs.hanzo.ai" className="lx-ghost">Documentation</A></div>
          </div>
          <A to="https://github.com/hanzoai" className="rt-first">
            <span className="lx-title">Subscribe to your first collection</span>
            <span className="rt-first-b">View on GitHub</span>
          </A>
        </div>
      </section>

      <LaunchClose name="Realtime" tag="Realtime channels + presence" seed="realtime" data={[30, 3, 2]} />
    </main>
  );
}
