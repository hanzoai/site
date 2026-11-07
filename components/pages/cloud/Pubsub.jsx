'use client';
/* PubSub, Cloud 3 launch page (docs/MASTER.md, the only brief).
   Persona: Developer. Goal: try Hanzo PubSub (read the source, then deploy it).
   CTA: "GitHub" → https://github.com/hanzoai/pubsub (data-cta pubsub.hero, pubsub.close; data-thumb "GitHub", so the
   site's sticky ask carries the same words). Metric: github_click (MASTER §1 names a GitHub click as a metric; the live
   ask is "GitHub", so api_key_created would be fed by no button here).
   Signature: one message fanning out. A publish on events.user.signup is written into the EVENTS stream with its
   sequence, then the wires draw down to every subscriber and to exactly one member of a queue group; deliveries wait
   for an ack and an unacked one is redelivered.
   Beyond: ack policy switch. In chapter two the same fan-out re-runs under Hanzo's three ack choices (ack every
   message, ack a sequence to cover everything below it, no acks), so redelivery appears and vanishes before you pick.
   Motion: idle = the fan-out on the bus and the inspector's panels (each with a pause); pointer = a sequence under the
   cursor lights everything a replay from it would read (named in the bus's own toolbar), the inspector's rows, the
   magnetic ask at the close; state = the start and ack switches (a pill that glides), rows that open their chapter;
   arrival = the cut-in title, the wires drawing, the timed wipe into the quiet room; scroll = the pinned chapters and
   "Get PubSub" growing to its moment. Tweens only (ease-emphasis 300 ms, ease-in-out 400 ms; the wires draw in 800 ms
   as line art); no springs.
   States differ by fill, weight, dash and a shape, never by hue. Every word, figure and link is Hanzo's; sequence
   numbers and values are drawn.
   V2: 8/10 The page's one black room is the hero: name, line and one ask left (5), the bus right (8), where one
   message drops into the stream and fans out down drawn wires; six pinned chapters over the same bus (ChapterBus),
   each changing what it does; the prompt and the 4222 spec in the quiet room; events.go beside "Put it between your
   services"; deck greys, tweens only. (Inspector/Overview/Panel below are the earlier chapter object, unused.) */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { A } from '../../kit';
import { Paste, Code, useLive } from './Frame';
import PinnedChapters from '../../v2/PinnedChapters';
import ClipWipe from '../../v2/ClipWipe';
import SpecDrawer from '../../v2/SpecDrawer';
import LaunchClose, { Arr } from '../../v2/LaunchClose';
import LineMask from '../../v2/LineMask';
import LivePause, { usePause } from '../../v2/LivePause';
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
    // the first step comes within half a second, so the first screen is moving before you look for it
    const ms = first.current ? 450 : [900, 900, 1300, 1500, 1300][t];
    const id = setTimeout(() => { first.current = false; if (t >= 4) { setT(0); setSeq((s) => s + 1); } else setT(t + 1); }, ms);
    return () => clearTimeout(id);
  }, [t, run, calm]);
  return [t, seq];
}

/* a counter that steps once a second while run is true (a timeout chain, nothing ticks off screen or paused) */
function useBeat(run) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!run) return;
    const id = setTimeout(() => setN((v) => v + 1), 1000);
    return () => clearTimeout(id);
  }, [n, run]);
  return n;
}

const subState = (t, ack, i, top) => {
  if (t < 2) return ['', '—'];
  if (t < 3 || ack === 'none') return ['', 'delivered'];
  if (ack === 'every' && i === 1 && t === 3) return ['wait', 'redelivered'];
  return ['ack', ack === 'below' ? 'ack ≤ ' + top : 'ack'];
};

/* the bus's wires run top to bottom: one line from the publish into the stream, then a fan to every subscriber */
function Wire({ on, xs = [50] }) {
  return (
    <svg className={'ps-wire' + (xs.length > 1 ? ' fan' : '')} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      {xs.map((x) => <path key={'b' + x} className="base" d={`M50 0 C 50 55, ${x} 45, ${x} 100`} />)}
      {xs.map((x, i) => <path key={'f' + x} className={'flow' + (on ? ' on' : '')} style={{ transitionDelay: on ? i * 0.06 + 's' : '0s' }} pathLength="1" d={`M50 0 C 50 55, ${x} 45, ${x} 100`} />)}
    </svg>
  );
}

/* ---------- the hero object: the bus ---------- */
function Bus() {
  const [ref, live, calm] = useLive(0.3);
  const [paused, pause] = usePause();
  const [t, seq] = useFan(live && !paused, calm);
  const [rp, setRp] = useState(null); // the sequence a replay would start from, under the pointer
  const top = seq + (t >= 1 ? 1 : 0);
  const pick = seq % 3;
  const nums = Array.from({ length: 6 }, (_, i) => top - 5 + i);
  return (
    <div className="ps-busw" ref={ref} data-paused={paused || undefined}>
      <div className="ps-bar">
        <p className="ps-bar-k"><i aria-hidden="true" />NATS JetStream</p>
        <p className="ps-rp" aria-hidden="true">
          <AnimatePresence mode="wait" initial={false}>
            {rp !== null && (
              <motion.span key={rp} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6, transition: QUICK }} transition={ARRIVE}>
                replay · from <b>#{rp}</b> → #{top}
              </motion.span>
            )}
          </AnimatePresence>
        </p>
        <LivePause dark paused={paused} onToggle={pause} className="ps-pause" />
      </div>
      <div className="ps-bus" role="img" aria-label="One message is published, written into the EVENTS stream with its sequence, copied to every subscriber, and handed to exactly one member of a queue group">
        <div className="ps-node ps-pub">
          <p className="ps-k">publish</p>
          <motion.div key={seq} className="ps-msg" initial={seq === 41 ? false : { y: -16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4, ease: EASE }}>
            <b>events.user.signup</b><span>{'{"id":"usr_123"}'}</span>
          </motion.div>
        </div>
        <Wire on={t >= 1} />
        <div className="ps-node ps-str">
          <p className="ps-k">stream EVENTS · events.&gt;</p>
          <div className="ps-seqs" onPointerLeave={() => setRp(null)}>
            {nums.map((n, i) => (
              <span key={n} onPointerEnter={(e) => e.pointerType === 'mouse' && setRp(n)}
                className={(i === 5 && t >= 1 ? 'new' : '') + (rp !== null && n >= rp ? ' rp' : '') + (n === rp ? ' from' : '')}>{n}</span>
            ))}
          </div>
        </div>
        <Wire on={t >= 2} xs={[15, 46, 81]} />
        <div className="ps-node ps-subs">
          {['analytics', 'audit'].map((s, i) => {
            const [c, l] = subState(t, 'every', i, top);
            return <div key={s} className={'ps-sub' + (t >= 2 ? ' got' : '') + (c ? ' ' + c : '')}><b>{s}</b><span>{l}</span></div>;
          })}
          <div className={'ps-sub ps-grp' + (t >= 2 ? ' got' : '')}>
            <b>queue group</b>
            <span className="ps-one">{[0, 1, 2].map((k) => <i key={k} className={t >= 2 && k === pick ? 'on' : ''} />)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- the chapters' object: one server, inspected ---------- */
const STARTS = [['the beginning', 0], ['a sequence', 4], ['a time', 6], ['newest', 9]];

function Pills({ label, items, on, set }) {
  return (
    <div className="ps-switch-b" role="group" aria-label={label}>
      {items.map(([k, l], i) => (
        <button key={k} type="button" aria-pressed={on === i} onClick={() => set(i)}>
          {on === i && <motion.span layoutId={'ps-pill-' + label} className="ps-pill" transition={ARRIVE} />}
          <span>{l}</span>
        </button>
      ))}
    </div>
  );
}

function AckSwitch({ ack, setAck }) {
  const at = ACKS.findIndex((a) => a[0] === ack);
  return (
    <div className="ps-switch">
      <Pills label="Ack policy" items={ACKS} on={at} set={(i) => setAck(ACKS[i][0])} />
      <p className="ps-ackline" aria-live="polite">{ACKS[at][2]}.</p>
    </div>
  );
}

function StartSwitch({ from, setFrom }) {
  return (
    <div className="ps-switch">
      <Pills label="A consumer starts at" items={STARTS.map(([l]) => [l, l])} on={from} set={setFrom} />
    </div>
  );
}

const SUBJ = ['stream EVENTS', 'events.user.signup', 'bucket · offsets', 'svc.quote', 'object store · assets', 'accounts'];
const SUBJ_D = ['keep by age', 'ack every', 'last value', 'one answer', 'chunked into a stream', 'per-subject'];

function Overview({ n, go }) {
  return (
    <div className="ps-p">
      <ul className="ps-ov">
        {SUBJ.map((s, i) => (
          <li key={s}>
            <button type="button" className={n % 6 === i ? 'on' : ''} onClick={() => go(i)}>
              <span className="ps-ov-n">{String(i + 1).padStart(2, '0')}</span><b>{s}</b><span>{SUBJ_D[i]}</span>
              <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

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

function Inspector({ step, intro, ack, from }) {
  const [ref, live, calm] = useLive(0.3);
  const [paused, pause] = usePause();
  const run = live && !paused;
  const n = useBeat(run);
  const [t, seq] = useFan(run && !intro && step === 1, calm);
  const cur = intro ? -1 : step;
  // a row takes you to its chapter: the same scroll the chapter rail makes
  const go = (i) => {
    const el = ref.current?.closest('.lx-pin');
    if (!el || !el.hasAttribute('data-live')) return;
    const total = el.querySelectorAll('.lx-pin-step').length;
    const lead = total - SUBJ.length;
    const y = el.getBoundingClientRect().top + scrollY + ((i + lead + 0.5) / total) * (el.offsetHeight - innerHeight);
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.__lenis ? window.__lenis.scrollTo(y, { duration: still ? 0 : 1.2, easing: (x) => 1 - Math.pow(1 - x, 4) }) : scrollTo({ top: y, behavior: still ? 'auto' : 'smooth' });
  };
  return (
    <div className="ps-ins" ref={ref}>
      <LivePause dark paused={paused} onToggle={pause} className="ps-ipause" />
      <div className="ps-ins-h">
        <span className="ps-dot" aria-hidden="true" />
        <AnimatePresence mode="wait" initial={false}>
          <motion.code key={cur} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8, transition: QUICK }} transition={ARRIVE}>{cur < 0 ? 'pubsub.hanzo.ai' : SUBJ[cur]}</motion.code>
        </AnimatePresence>
        <span className="ps-port">:4222</span>
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={cur} className="ps-ins-b" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16, transition: QUICK }} transition={{ duration: 0.4, ease: EASE }}>
          {cur < 0 ? <Overview n={n} go={go} /> : <Panel step={cur} n={n} ack={ack} from={from} t={t} seq={seq} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ---------- the chapters' object: the hero's bus itself, pinned; each chapter changes what it does ----------
   The same toolbar, publish card, stream cells, wires and three subscriber cards as the hero. Per chapter:
   0 streams keep a window (old sequences age out) and a consumer starts where you choose; 1 the ack policy plays on
   the subscribers (redelivery is a dashed card); 2 the stream becomes a bucket keeping each key's last value;
   3 a request goes to exactly one instance; 4 a payload splits into chunks along the wire and is put back together;
   5 an account wall drops between subscribers. The words are Hanzo's; values and sequence numbers are drawn. */
const START_AT = [0, 2, 3, 5]; // which stream cell each start choice reads from (the beginning, a sequence, a time, newest)
function ChapterBus({ step, intro, ack, from }) {
  const [ref, live, calm] = useLive(0.3);
  const [paused, pause] = usePause();
  const run = live && !paused;
  const n = useBeat(run);
  const [t, seq] = useFan(run && step === 1 && !intro, calm);
  const s = intro ? -1 : step;
  const top = seq + (t >= 1 ? 1 : 0);
  const nums = Array.from({ length: 6 }, (_, i) => (s === 1 ? top - 5 + i : 38 + i));
  const k = n % 3;
  const chunks = Math.min(6, n % 9);
  const msg = s === 2 ? ['orders', String(1040 + n)] : s === 3 ? ['svc.quote', 'request'] : s === 4 ? ['assets/report.pdf', 'payload'] : ['events.user.signup', '{"id":"usr_123"}'];
  const mid = s === 0 ? 'stream EVENTS · keep by ' + ['age', 'count', 'bytes'][k] : s === 2 ? 'bucket · offsets · last value' : s === 3 ? 'svc.quote · queue group' : s === 4 ? 'object store · chunked into a stream' : s === 5 ? 'accounts' : 'stream EVENTS · events.>';
  const cell = (i) => {
    if (s === 0) return (i < 1 + k % 2 ? 'old' : '') + (i >= START_AT[from] ? ' rd' : '') + (i === START_AT[from] ? ' from' : '');
    if (s === 1) return i === 5 && t >= 1 ? 'new' : '';
    if (s === 2) return i === 5 ? 'new' : 'old';
    if (s === 3) return i === 5 ? 'new' : 'old';
    if (s === 4) return i < chunks ? 'rd' : '';
    if (s === 5) return i < 3 ? 'rd' : 'old';
    return '';
  };
  // what each chapter's stream cells carry: sequences, a key's history down to its last value, the request waiting,
  // chunks, or the subjects each account owns
  const label = (x, i) => (s === 2 ? (i === 5 ? String(1040 + n) : '') : s === 3 ? (i === 5 ? 'req' : '') : s === 4 ? (i < chunks ? '▪' : '') : s === 5 ? (i < 3 ? 'a' : 'b') : x);
  const foot = s === 1 ? 'msg id usr_123 · duplicate collapsed · two minutes' : s === 5 ? 'nkey · signed JWT · per-subject · TLS' : s === 0 ? (n % 2 ? 'original pace' : 'as fast as it can') : '';
  const subs = s === 1
    ? ['analytics', 'audit', 'my-service'].map((x, i) => { const [c, l] = subState(t, ack, i, top); return [x, l, c]; })
    : s === 0 ? [['my-service', 'from ' + STARTS[from][0], 'got'], ['analytics', 'reading', 'got'], ['audit', '—', '']]
      : s === 2 ? ['orders', 'payments', 'signups'].map((x, i) => [x, i === k ? 'watch · ' + (1040 + n) : 'last value', i === k ? 'got ack' : ''])
        : s === 3 ? [0, 1, 2].map((i) => ['instance ' + (i + 1), i === k ? 'one answer' : '—', i === k ? 'got ack' : ''])
          : s === 4 ? [['assets', chunks >= 6 ? 'put back together' : 'chunk ' + chunks + ' / 6', chunks >= 6 ? 'got ack' : ''], ['watch', chunks >= 6 ? 'changed' : '—', chunks >= 6 ? 'got' : ''], ['my-service', '—', '']]
            : s === 5 ? [['account a', 'events.>', 'got'], ['account a', 'orders.>', 'got'], ['account b', 'events.>', 'wall']]
              : [['analytics', 'delivered', 'got'], ['audit', 'delivered', 'got'], ['queue group', 'one of three', 'got']];
  const flow = s === 1 ? t >= 2 : s === 4 ? chunks >= 6 : true;
  return (
    <div className="ps-busw ps-cbus" ref={ref} data-step={s} data-paused={paused || undefined}>
      <div className="ps-bar">
        <p className="ps-bar-k"><i aria-hidden="true" />NATS JetStream</p>
        <AnimatePresence mode="wait" initial={false}>
          <motion.code key={s} className="ps-cbus-k" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6, transition: QUICK }} transition={ARRIVE}>{s < 0 ? 'pubsub.hanzo.ai:4222' : SUBJ[s]}</motion.code>
        </AnimatePresence>
        <LivePause dark paused={paused} onToggle={pause} className="ps-pause" />
      </div>
      <div className="ps-bus" aria-hidden="true">
        <div className="ps-node ps-pub">
          <p className="ps-k">{s === 3 ? 'request' : 'publish'}</p>
          <div className="ps-msg"><b>{msg[0]}</b><span>{msg[1]}</span></div>
        </div>
        <Wire on={s !== 1 || t >= 1} />
        <div className="ps-node ps-str">
          <p className="ps-k">{mid}</p>
          <div className="ps-seqs">{nums.map((x, i) => <span key={i} className={cell(i)}>{label(x, i)}</span>)}</div>
        </div>
        {/* the one-instance chapter still draws a fan (two coinciding paths), so the wire keeps its height */}
        <Wire on={flow} xs={s === 5 ? [15, 46] : s === 3 ? [[15, 46, 81][k], [15, 46, 81][k] + 0.01] : [15, 46, 81]} />
        <div className={'ps-node ps-subs' + (s === 5 ? ' walled' : '')}>
          {subs.map(([b, l, c], i) => <div key={i} className={'ps-sub ' + (c || '')}><b>{b}</b><span>{l}</span></div>)}
        </div>
        <p className="ps-cfoot">{foot || ' '}</p>
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
  const [ack, setAck] = useState('every');
  const [from, setFrom] = useState(0);
  const steps = FACTS.map(([t, d], i) => ({ t, d, extra: i === 0 ? <StartSwitch from={from} setFrom={setFrom} /> : i === 1 ? <AckSwitch ack={ack} setAck={setAck} /> : null }));
  return (
    <main className="lx ps" data-cursor="">
      <section className="ps-hero lx-dark" data-room="dark" data-morph-target data-ask-name="Hanzo PubSub">
        <div className="lx-wrap ps-hero-in">
          <div className="ps-hero-title">
            <LineMask as="h1" className="lx-display ps-h1" lines={['Hanzo PubSub']} />
            <p className="lx-lede ps-tag">The bus everything else rides</p>
            <A to={GH} className="lx-cta" data-thumb="GitHub" data-cta="pubsub.hero" data-cursor="">GitHub<Arr /></A>
          </div>
          <Bus />
        </div>
      </section>

      <PinnedChapters label="More than pub/sub" per={80} objH={35}
        intro={{ title: ['More than', 'pub/sub'] }}
        steps={steps}
        visual={(at, intro) => <ChapterBus step={at} intro={intro} ack={ack} from={from} />} />

      <ClipWipe className="ps-room">
        <div className="lx-wrap">
          <div className="ps-room-top">
            <h2 className="lx-headline">Publish and Subscribe</h2>
            <Paste name="Pubsub" prompt="Read https://hanzo.ai/skill.md and use Hanzo Pubsub in my project. Start with: hanzo pubsub publish" className="lx-paste ps-paste" />
          </div>
          <SpecDrawer className="ps-spec" rows={[{ v: '4222', l: 'Client port' }, { v: 'Replay', l: 'From any point' }, { v: 'Durable', l: 'Written to disk' }, { v: 'Replicas', l: 'Set per stream' }]} />
        </div>
      </ClipWipe>

      <section className="lx-sec ps-walk">
        <div className="lx-wrap ps-walk-in">
          <div className="ps-walk-l">
            <h2 className="lx-headline">Put it between your services</h2>
            <p className="lx-lede">Free tier includes 1M messages/month.</p>
            <A to={GH} className="lx-ghost">View on GitHub<Arr /></A>
          </div>
          <Code light title="PubSub" tabs={[{ k: 'events.go', code: CODE }]} className="ps-code" />
        </div>
      </section>

      <LaunchClose name="PubSub" tag="Pub/sub messaging" seed="pubsub" data={[4222, 3, 1000000]} ask={['GitHub', GH]} cta="pubsub.close" repo={['hanzoai/pubsub', GH]} stars="4 stars" />
    </main>
  );
}
