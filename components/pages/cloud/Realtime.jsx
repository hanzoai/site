'use client';
/* Realtime, Cloud 3 launch page (docs/MASTER.md, the only brief).
   Persona: Developer. Goal: get an API key and open a first stream.
   CTA: "Start Building" → https://platform.hanzo.ai/api-keys (data-cta realtime.hero, realtime.close; data-thumb
   "Start Building", so the site's sticky ask carries the same words). Metric: api_key_created.
   Signature: the same record landing on three client screens at once (a desktop, a tablet and a phone, three sizes).
   A record is created, updated, then deleted; each change pulses down the one open stream and lands on every screen in
   the same instant, except that the delete reaches only the clients whose rule would have let them read it.
   Beyond: the rule switch. Flip each client's access rule (reads record b, or cannot) and the same create, update and
   delete replay: a client whose rule cannot read b never sees it arrive, change or leave, Hanzo's "deletes are checked
   too" played out instead of told.
   Overload, fixed by presentation (every word stays in the HTML): one idea per screen. The handshake shows one call's
   words at a time beside the wire, and "The handshake, in full" is a disclosure you open; growth shows one note open at
   a time beside one tenant map (its figure grows to its moment, the others rest small); the "Two calls" card is a calm
   strip at section-heading size, so "Get Realtime" is the one big thing at the end.
   Motion: idle = the three screens, the stream map, the handshake and the tenant map step by themselves (each with a
   pause); pointer = the use-case rail you throw (drag with inertia, hard stops), a growth figure under the cursor opens
   its note and changes the tenant map, the card's art drift, the magnetic ask at the close; state = each client's rule
   switch, the handshake's three calls marking their line in the wire, the disclosure; arrival = the cut-in title, the
   timed wipe into the black room; scroll = the stage settling big → small, the pinned chapters and "Get Realtime"
   growing. Tweens only (ease-emphasis 300 ms, ease-in-out 400–500 ms); no springs.
   States differ by fill, weight, dash and a shape, never by hue. Every word and link is Hanzo's; record contents,
   ids and org names are examples.
   V2: 8/10 Three live clients of three sizes settle under a two-line title beside the one ask; eight pinned chapters
   over one outlined stream map; use cases on a drag rail; the handshake in the black room one call at a time with the
   full paragraph behind a disclosure; growth one note at a time beside the tenant map; a calm card strip, then the
   close. Deck greys, tweens only. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, animate } from 'motion/react';
import { A } from '../../kit';
import { Code, useLive, useSteps } from './Frame';
import SettleStage from '../../v2/SettleStage';
import PinnedChapters from '../../v2/PinnedChapters';
import ClipWipe from '../../v2/ClipWipe';
import SpecDrawer from '../../v2/SpecDrawer';
import LaunchClose, { Arr } from '../../v2/LaunchClose';
import LineMask from '../../v2/LineMask';
import LivePause, { usePause } from '../../v2/LivePause';
import RelatedCards from '../../v2/RelatedCards';
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
        <b>Live connection</b><span>One open stream</span><span>Records arrive as they change</span>
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

/* ---------- the chapters' object: the stream, mapped ---------- */
const MAP = ['GET /v1/realtime', 'subscriptions', 'brokers', 'delete · b', 'one store', 'access rule', 'grant', 'deployment'];
/* the intro: one open stream, and the rule deciding what goes down it */
const FLOW = [['messages', 'create', true], ['orders', 'update', false], ['messages', 'update', true], ['messages', 'delete', true], ['orders', 'create', false]];

function Intro({ n }) {
  const rows = Array.from({ length: 4 }, (_, k) => FLOW[(n + k) % FLOW.length]);
  return (
    <div className="rt-p">
      <p className="rt-net"><i />HTTP 200 · text/event-stream · open</p>
      <div className="rt-flow">
        <AnimatePresence initial={false} mode="popLayout">
          {rows.map(([c, a, ok], k) => (
            <motion.p key={n + '-' + k} layout className={ok ? 'ok' : 'no'} initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, transition: QUICK }} transition={{ ...ARRIVE, layout: GLIDE }}>
              <code>event: {c} · {a}</code><span><i aria-hidden="true">{ok ? '✓' : '×'}</i><em>access rule</em></span>
            </motion.p>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Panel({ step, n }) {
  if (step === 0) {
    const drop = n % 8 >= 6;
    const lines = Array.from({ length: 4 }, (_, k) => ['create', 'update', 'update', 'delete'][(n + k) % 4]);
    return (
      <div className="rt-p">
        <p className={'rt-net' + (drop ? ' drop' : '')}><i />{drop ? 'network dropped · reconnecting' : 'HTTP 200 · text/event-stream · open'}</p>
        <div className="rt-sse">
          <AnimatePresence initial={false} mode="popLayout">
            {lines.map((a, k) => <motion.code key={n + '-' + k} layout className={drop ? 'dim' : ''} initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, transition: QUICK }} transition={{ ...ARRIVE, layout: GLIDE }}>event: messages · {a}</motion.code>)}
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
          <li className={(k >= 1 ? 'on' : '') + (k >= 5 ? ' spent' : '')}><code>grant</code><span className="lx-num">{k >= 5 ? 'spent' : left + 's'}</span></li>
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

function StreamMap({ step, intro }) {
  const [ref, live] = useLive(0.3);
  const [paused, pause] = usePause();
  const n = useBeat(live && !paused, 1100);
  const cur = intro ? -1 : step;
  return (
    <div className="rt-map" ref={ref}>
      <div className="rt-map-h">
        <span className="rt-live" aria-hidden="true" />
        <AnimatePresence mode="wait" initial={false}>
          <motion.code key={cur} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8, transition: QUICK }} transition={ARRIVE}>{cur < 0 ? MAP[0] : MAP[cur]}</motion.code>
        </AnimatePresence>
        <LivePause inline dark paused={paused} onToggle={pause} className="rt-mpause" />
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={cur} className="rt-map-b" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, transition: QUICK }} transition={{ duration: 0.4, ease: EASE }}>
          {cur < 0 ? <Intro n={n} /> : <Panel step={cur} n={n} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ---------- the chapters' object: the hero's three clients, pinned; each chapter changes what they show ----------
   0 one stream (it drops and reopens on its own); 1 client 3 watches one record, not the collection; 2 client 3 sits
   on another org's broker; 3 a delete reaches only the clients whose rule can read b; 4 API and stream read one store;
   5 the access rule decides per client; 6 a grant counts down and is spent once; 7 a third org waits on a limit of
   two. The words are Hanzo's (the chapter titles and the map labels); records and org names are drawn. */
function ChapterClients({ step, intro }) {
  const [ref, live] = useLive(0.3);
  const [paused, pause] = usePause();
  const n = useBeat(live && !paused, 1100);
  const s = intro ? -1 : step;
  const beat = BEATS[n % BEATS.length];
  const [action, rows0] = beat;
  const drop = s === 0 && n % 6 >= 4;
  const left = Math.max(0, 30 - (n % 8) * 5);
  const conn = s === 0 ? (drop ? 'network dropped · reconnecting' : 'HTTP 200 · text/event-stream · open')
    : s === 6 ? (n % 8 >= 6 ? 'grant spent · stream open' : 'grant · ' + left + 's') : s === 7 ? 'deployment · limit 2' : s === 4 ? 'one store · API and stream' : 'One open stream';
  const who = (c) => (s === 2 ? (c < 3 ? 'org a' : 'org b') : s === 7 ? ['org a', 'org b', 'org c'][c - 1] : s === 1 && c === 3 ? 'orders/ord_42' : s === 5 ? (c === 3 ? "rule can't read b" : 'rule reads b') : 'Client ' + c);
  const rowsFor = (c) => {
    if (s === 7 && c === 3) return [];
    if (s === 1 && c === 3) return ['b'];
    if ((s === 3 || s === 5) && c === 3) return rows0.filter((r) => !r.startsWith('b'));
    return rows0;
  };
  const tag = (c) => (s === 7 && c === 3 ? 'waits' : s === 3 && c === 3 && action === 'delete' ? 'not told' : s === 0 && drop ? 'reconnecting' : 'Connected');
  return (
    <div className={'rt-stage rt-cstage' + (drop ? ' drop' : '')} ref={ref} data-step={s} data-paused={paused || undefined}>
      <div className="rt-conn">
        <b>{s < 0 ? MAP[0] : MAP[s]}</b><span className="rt-cconn">{conn}</span>
        <span className="rt-acts" aria-hidden="true">{['create', 'update', 'delete'].map((a) => <i key={a} className={a === action ? 'on' : ''}>{a}</i>)}</span>
        <LivePause inline paused={paused} onToggle={pause} className="rt-pause" />
      </div>
      <div className="rt-screens" aria-hidden="true">
        {[1, 2, 3].map((c) => {
          const wait = s === 7 && c === 3;
          const no = (s === 3 || s === 5) && c === 3;
          return (
            <div key={c} className={'rt-screen ' + ['desk', 'tab', 'hand'][c - 1] + (no || wait ? ' no' : '') + (s === 2 && c === 3 ? ' other' : '')}>
              <div className="rt-top"><span>{who(c)}</span><em>{tag(c)}</em></div>
              <ul>
                <AnimatePresence initial={false} mode="popLayout">
                  {rowsFor(c).map((r) => (
                    <motion.li key={r[0]} layout className={r.endsWith('*') ? 'upd' : ''} initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 24, transition: ARRIVE }} transition={{ ...ARRIVE, layout: GLIDE }}>
                      <i>{r[0]}</i><span style={{ width: W[r[0]] }} />
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
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
          {USES.map(([t, d, k]) => (
            <article key={t} className="rt-use">
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
              <button type="button" onClick={() => choose(i)} aria-expanded={at === i} aria-controls={'rt-call-' + i}><span className="lx-num">{i + 1}</span><b>{t}</b></button>
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
  const steps = GIVES.map(([t, d]) => ({ t, d }));
  return (
    <main className="lx rt" data-cursor="">
      <section className="rt-hero" data-morph-target data-ask-name="Hanzo Realtime">
        <div className="lx-wrap">
          <LineMask as="h1" className="lx-display rt-h1" lines={['Your screen updates', 'when the data does']} />
          <div className="rt-hero-grid">
            <SettleStage from={1.04} lift={24} className="rt-hero-obj"><Screens /></SettleStage>
            <div className="rt-hero-r">
              <p className="lx-lede rt-sub">Live record updates</p>
              <A to={KEYS} className="lx-cta" data-thumb="Start Building" data-cta="realtime.hero" data-cursor="">Start Building<Arr /></A>
              <A to={DOCS} className="lx-text rt-docs">View Documentation</A>
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

      <PinnedChapters label="What the stream gives you" per={66} objH={38}
        intro={{ title: ['What the stream', 'gives you'], lede: 'One connection, and the rules you already wrote deciding what goes down it' }}
        steps={steps}
        visual={(at, intro) => <ChapterClients step={at} intro={intro} />} />

      <section className="lx-sec rt-uses">
        <div className="lx-wrap rt-uses-h">
          <h2 className="lx-headline">Build Interactive Experiences</h2>
          <p className="lx-lede">Hanzo Realtime powers a wide range of applications that demand immediate data updates</p>
        </div>
        <Rail />
      </section>

      <ClipWipe dark className="rt-room"><Handshake /></ClipWipe>

      <section className="lx-sec rt-grow">
        <div className="lx-wrap">
          <div className="rt-grow-h">
            <h2 className="lx-headline">What happens as it grows</h2>
            <p className="lx-lede">The parts that scale, and the parts that are simply not in the way</p>
          </div>
          <Grow />
          <SpecDrawer className="rt-spec" rows={[{ v: 'No polling', l: 'The client asks once, not every second' }, { v: 'Reconnects itself', l: 'A dropped stream reopens with a fresh grant' }, { v: 'Nothing extra to run', l: 'The same binary that serves the API serves the stream' }]} />
        </div>
      </section>

      <RelatedCards className="rt-open" title="Open a stream" items={[['Subscribe to your first collection', 'https://github.com/hanzoai', 'View on GitHub']]}>
        <div className="rt-open-l">
          <h2 className="lx-headline">Two calls and the page keeps itself current</h2>
          <p className="lx-lede">Mint a grant, open the stream, name a collection. No credit card to start.</p>
          <div className="rt-open-acts"><A to={KEYS} className="lx-text">Start Building</A><A to={DOCS} className="lx-text">Documentation</A></div>
        </div>
      </RelatedCards>

      <LaunchClose name="Realtime" tag="Realtime channels + presence" seed="realtime" data={[30, 3, 2]} ask={['Start Building', KEYS]} cta="realtime.close" />
    </main>
  );
}
