'use client';
/* MQ, v2 launch page (Cloud 3).
   V2: 8/10 Centred launch in grey: the title and its one ask over a live job conveyor that fits the first screen (its own
   toolbar carries "Job queue", a pause and the job under your pointer); the statement opens six pinned chapters over one
   job inspector whose tabs you can press; worker.ts in the one dark room; the free tier as a giant figure over the spec.
   Signature: jobs on a conveyor. Tickets ride in by priority and the urgent one cuts ahead; two workers take them up to
   their concurrency under a limiter; one fails, waits out its backoff, retries, and after its last attempt lands in the
   failed set with its error rather than vanishing, while QueueEvents prints each life as it happens.
   Beyond: the job inspector. Each fact is shown working on one queue (a schedule held through a process restart, a
   limiter window filling, a priority-1 job cutting ahead, backoff gaps widening, events streaming, a failed job you can
   retry), so you see the behaviour before you pick a queue.
   Persona: Developer. Goal: try Hanzo MQ (read the source, then deploy it).
   CTA: "GitHub" → https://github.com/hanzoai (data-cta mq.hero, mq.close; the site's sticky ask carries the same words).
   Metric: api_key_created.
   Motion: idle = the conveyor and the inspector's panels (each with a pause); pointer = a job under the cursor shows
   its options in the conveyor's toolbar, the inspector's tabs, the magnetic ask at the close; state = the tab bar
   morphs, Retry puts the failed job back; arrival = the cut-in title, the timed wipe into the dark room, the free tier
   cutting in (the real figure, never counted through numbers that are not Hanzo's); scroll = the stage settle and the pinned chapters only.
   States differ by fill, weight, dash and a shape cue, never by hue. Every word, figure and link is Hanzo's; job names
   are examples. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { A } from '../../kit';
import { Paste, Code, useLive } from './Frame';
import SettleStage from '../../v2/SettleStage';
import PinnedChapters from '../../v2/PinnedChapters';
import ClipWipe from '../../v2/ClipWipe';
import SpecDrawer from '../../v2/SpecDrawer';
import LaunchClose, { Arr } from '../../v2/LaunchClose';
import LineMask from '../../v2/LineMask';
import LivePause, { usePause } from '../../v2/LivePause';
import './Mq.css';

const GH = 'https://github.com/hanzoai';
const EASE = [0.16, 1, 0.3, 1];
const SPRING = { type: 'spring', stiffness: 300, damping: 30 };
const SNAP = { type: 'spring', stiffness: 420, damping: 34 };
const NAMES = ['welcome', 'invoice', 'resize', 'digest', 'sync', 'export'];

/* One tick of the queue, as a pure step: finish, retry or fail; then a worker takes the most urgent waiting job. */
export function step(s) {
  const t = s.t + 1, ev = [];
  let id = s.id;
  const wait = [...s.wait], done = [...s.done], active = [];
  s.active.map((j) => ({ ...j, age: j.age + 1 })).forEach((j) => {
    if (j.age < 2) { active.push(j); return; }
    if (j.fail && j.attempt < 3) { ev.push(['failed', j.n + ' · attempt ' + j.attempt]); wait.unshift({ ...j, attempt: j.attempt + 1, back: true }); }
    else if (j.fail) { ev.push(['failed', j.n + ' → failed set']); done.unshift({ ...j, ok: false }); }
    else { ev.push(['completed', j.n]); done.unshift({ ...j, ok: true }); }
  });
  const sorted = wait.sort((x, y) => x.p - y.p); // stable: first in, first out inside one priority
  let started = 0;
  while (active.length < 2 && sorted.length) { const j = sorted.shift(); ev.push(['progress', j.n]); active.push({ ...j, age: 0, attempt: j.attempt || 1 }); started++; }
  if (sorted.length < 4) sorted.push({ id: id++, n: NAMES[t % NAMES.length], p: t % 4 === 0 ? 1 : 2, fail: t % 5 === 0, born: t });
  const win = t % 6 === 0 ? started : Math.min(6, s.win + started);
  return { t, id, win, wait: sorted, active, done: done.slice(0, 4), events: [...ev.map((e, k) => ({ k: t * 10 + k, e })), ...s.events].slice(0, 4) };
}
const START = { t: 0, id: 4, win: 0, wait: [0, 1, 2, 3].map((i) => ({ id: i, n: NAMES[i], p: i === 2 ? 1 : 2 })), active: [], done: [], events: [] };
const WARM = [1, 2, 3, 4].reduce((x) => step(x), START); // the first frame already has every lane at work

/* where a job is, in the words the conveyor already uses */
const where = (j, kind) => (kind === 'ok' ? 'completed' : kind === 'bad' ? 'failed set' : kind ? 'worker' : j.back ? 'backoff · exponential' : 'waiting');

/* A ticket keeps its layoutId from lane to lane, so a move is one FLIP glide from where it was (no AnimatePresence:
   the copy it leaves goes at once, so a lane closes up while the glide runs). Only a job just added slides in. */
function Ticket({ j, kind, t, onPeek, children }) {
  return (
    <motion.div layoutId={'mq' + j.id} className={'mq-tk ' + (kind || '') + (j.p === 1 ? ' hi' : '') + (j.back ? ' back' : '')}
      onPointerEnter={(e) => e.pointerType === 'mouse' && onPeek({ ...j, at: where(j, kind) })}
      initial={!kind && j.born === t ? { opacity: 0, x: -24 } : false} animate={{ opacity: 1, x: 0 }} transition={SNAP}>
      <b>{j.n}</b>{children}
    </motion.div>
  );
}

/* ---------- the hero object: the queue at work ---------- */
function Conveyor() {
  const [ref, live] = useLive(0.3);
  const [paused, pause] = usePause();
  const run = live && !paused;
  const [s, setS] = useState(WARM);
  const [peek, setPeek] = useState(null);
  useEffect(() => {
    if (!run) return;
    const t = setTimeout(() => setS(step), 1300);
    return () => clearTimeout(t);
  }, [s, run]);
  const { wait, active, done, events, win } = s;
  return (
    <div className="mq-conv" ref={ref} onPointerLeave={() => setPeek(null)} data-paused={paused || undefined}>
      <LivePause paused={paused} onToggle={pause} className="mq-pause" />
      <div className="mq-bar">
        <p className="mq-bar-k"><i aria-hidden="true" />Job queue</p>
        <span className="mq-chip">emails</span>
        <p className="mq-peek" aria-hidden="true">
          <AnimatePresence mode="wait" initial={false}>
            {peek && (
              <motion.span key={peek.id + peek.at} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6, transition: { duration: 0.12 } }} transition={{ duration: 0.3, ease: EASE }}>
                <b>{peek.n}</b> priority {peek.p} · attempt {peek.attempt || 1} / 3 · {peek.at}
              </motion.span>
            )}
          </AnimatePresence>
        </p>
      </div>
      <div className="mq-lanes" role="img" aria-label="A job queue at work: waiting, workers, completed and failed">
        <div className="mq-lane">
          <p className="mq-k">waiting</p>
          <div className="mq-stack">
            {[...wait].sort((a, b) => a.p - b.p).map((j) => <Ticket key={j.id} j={j} t={s.t} onPeek={setPeek}><span>{j.back ? 'backoff · exponential' : j.p === 1 ? 'priority 1' : 'priority 2'}</span></Ticket>)}
          </div>
        </div>
        <div className="mq-lane work">
          <p className="mq-k">workers · concurrency</p>
          {[0, 1].map((k) => {
            const j = active[k];
            return (
              <div key={k} className="mq-slot">
                {j && <Ticket key={j.id} j={j} onPeek={setPeek} kind={'run' + (j.fail ? ' risky' : '')}><span>attempt {j.attempt}</span><i /></Ticket>}
              </div>
            );
          })}
          <div className="mq-lim">
            <span>limiter · max per window</span>
            <span className="mq-cells">{[0, 1, 2, 3, 4, 5].map((c) => <i key={c} className={c < win ? 'on' : ''} />)}</span>
          </div>
        </div>
        <div className="mq-lane">
          <p className="mq-k">completed · failed</p>
          <div className="mq-stack">
            {done.map((j) => <Ticket key={j.id + (j.ok ? 'c' : 'f')} j={j} onPeek={setPeek} kind={j.ok ? 'ok' : 'bad'}><span>{j.ok ? 'completed' : 'error · stack kept'}</span></Ticket>)}
          </div>
        </div>
        <div className="mq-ev">
          <p className="mq-k">QueueEvents</p>
          <div className="mq-ev-row">
            <AnimatePresence initial={false} mode="popLayout">
              {events.map(({ k, e: [type, what] }) => <motion.p key={k} layout className={type} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, ease: EASE }}><b>{type}</b> {what}</motion.p>)}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- the chapters' object: one queue, inspected ---------- */
const TABS = ['schedule', 'limiter', 'priority', 'retries', 'events', 'failed set'];
const PRI = [['invoice', 2, 1], ['digest', 2, 2], ['resize', 2, 3], ['sync', 2, 4], ['welcome', 1, 5]];
const STREAM = [['completed', 'welcome'], ['progress', 'resize'], ['failed', 'sync · attempt 1'], ['stalled', 'digest'], ['completed', 'invoice'], ['progress', 'export']];
/* the intro: the queue as rows of data, and the two workers that are yours */
const ROWS = [['welcome', 'waiting', 'priority 1', ''], ['invoice', 'worker a', 'attempt 1', 'a'], ['resize', 'worker b', 'attempt 2', 'b'], ['digest', 'completed', 'attempt 1', ''], ['sync', 'failed set', 'attempts 3 / 3', '']];

function Overview({ n }) {
  const lit = n % 2 ? 'b' : 'a';
  return (
    <div className="mq-p">
      <ul className="mq-rows">
        {ROWS.map(([name, st, d, w], i) => (
          <li key={name} className={(w ? 'w' : '') + (w === lit ? ' on' : '') + (st === 'failed set' ? ' bad' : '')}>
            <span className="mq-ord">#{i + 41}</span><b>{name}</b><span className="mq-st">{st}</span><span>{d}</span>
          </li>
        ))}
      </ul>
      <div className="mq-held">
        <span className={'mq-proc' + (lit === 'a' ? '' : ' down')}><i />worker a</span>
        <span className={'mq-proc' + (lit === 'b' ? '' : ' down')}><i />worker b</span>
        <span className="mq-store"><i />emails · held in the store</span>
      </div>
    </div>
  );
}

function Panel({ step, n }) {
  if (step === 0) {
    const on = n % 3;
    const down = n % 4 === 3;
    return (
      <div className="mq-p">
        <ul className="mq-sched">
          {[['cron', '0 9 * * *', 'timezone aware'], ['delay', '5000', 'milliseconds'], ['every', 'interval', 'repeats']].map(([k, v, d], i) => (
            <li key={k} className={on === i ? 'on' : ''}><b>{k}</b><code>{v}</code><span>{d}</span></li>
          ))}
        </ul>
        <div className="mq-held">
          <span className={'mq-proc' + (down ? ' down' : '')}><i />process · {down ? 'restarting' : 'running'}</span>
          <span className="mq-store"><i />schedule · held in the store</span>
        </div>
      </div>
    );
  }
  if (step === 1) {
    const starts = n % 11;
    return (
      <div className="mq-p">
        <p className="mq-pk">one window</p>
        <div className="mq-win">{Array.from({ length: 8 }, (_, i) => <i key={i} className={i < Math.min(starts, 8) ? 'on' : ''} />)}</div>
        <p className="mq-pk">waits for the next</p>
        <div className="mq-win next">{Array.from({ length: 3 }, (_, i) => <i key={i} className={i < Math.max(0, starts - 8) ? 'on' : ''} />)}</div>
        <code className="mq-cfg">concurrency: 10, limiter: {'{'} max: 100, duration: 60_000 {'}'}</code>
      </div>
    );
  }
  if (step === 2) {
    const phase = n % 4;
    const list = phase === 0 ? PRI.slice(0, 4) : phase === 1 ? PRI : [PRI[4], ...PRI.slice(0, 4)];
    return (
      <div className="mq-p">
        <ol className="mq-pri">
          {list.map(([name, p, order]) => (
            <motion.li key={name} layout transition={SPRING} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className={p === 1 ? 'hi' : ''}>
              <span className="mq-ord">#{order}</span><b>{name}</b><span>priority {p}</span>
            </motion.li>
          ))}
        </ol>
      </div>
    );
  }
  if (step === 3) {
    const k = n % 5;
    const lockB = n % 6 >= 3;
    return (
      <div className="mq-p">
        <p className="mq-pk">attempts · backoff · exponential</p>
        <div className="mq-tl">
          <i className="mq-tl-line" />
          {[[0, 'x', 'attempt 1'], [30, 'x', 'attempt 2'], [78, 'ok', 'attempt 3']].map(([x, r, l], i) => (
            <span key={l} className={'mq-at ' + r + (k > i ? ' on' : '')} style={{ left: x + '%' }}><i />{l}</span>
          ))}
        </div>
        <div className="mq-lock">
          <span className={lockB ? '' : 'on'}>worker a {lockB ? '· died mid-job' : '· holds the lock'}</span>
          <span className="mq-lock-k" aria-hidden="true">→</span>
          <span className={lockB ? 'on' : ''}>worker b {lockB ? '· handed the job' : ''}</span>
        </div>
      </div>
    );
  }
  if (step === 4) {
    const rows = Array.from({ length: 5 }, (_, i) => STREAM[(n + i) % STREAM.length]).reverse();
    return (
      <div className="mq-p">
        <div className="mq-stream">
          <AnimatePresence initial={false} mode="popLayout">
            {rows.map(([t, w], i) => <motion.p key={n - i} layout className={t} initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, ease: EASE }}><b>{t}</b>{w}</motion.p>)}
          </AnimatePresence>
        </div>
      </div>
    );
  }
  return <Failed />;
}

function Failed() {
  const [back, setBack] = useState(false);
  return (
    <div className="mq-p">
      <div className={'mq-fail' + (back ? ' back' : '')}>
        <p className="mq-fail-h"><b>sync</b><span>{back ? 'back in waiting' : 'attempts 3 / 3'}</span></p>
        <pre>{'Error: request failed\n    at sendEmail (worker.ts)\n    at Worker.process'}</pre>
        <button type="button" className="mq-retry" aria-pressed={back} onClick={() => setBack((b) => !b)}>{back ? 'Undo' : 'Retry'}</button>
      </div>
    </div>
  );
}

function Inspector({ step, intro }) {
  const [ref, live] = useLive(0.3);
  const [paused, pause] = usePause();
  const run = live && !paused;
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!run) return;
    const t = setTimeout(() => setN((v) => v + 1), 1000);
    return () => clearTimeout(t);
  }, [n, run]);
  const cur = intro ? -1 : step;
  // a tab takes you to its chapter: the same scroll the chapter rail makes
  const go = (i) => {
    const el = ref.current?.closest('.lx-pin');
    if (!el || !el.hasAttribute('data-live')) return;
    const total = el.querySelectorAll('.lx-pin-step').length;
    const lead = total - TABS.length;
    const y = el.getBoundingClientRect().top + scrollY + ((i + lead + 0.5) / total) * (el.offsetHeight - innerHeight);
    const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.__lenis ? window.__lenis.scrollTo(y, { duration: calm ? 0 : 1.2, easing: (t) => 1 - Math.pow(1 - t, 4) }) : scrollTo({ top: y, behavior: calm ? 'auto' : 'smooth' });
  };
  return (
    <div className="mq-ins" ref={ref}>
      <LivePause paused={paused} onToggle={pause} className="mq-pause" />
      <div className="mq-ins-bar">
        <span className="mq-chip"><i aria-hidden="true" />emails</span>
        <nav className="mq-tabs" aria-label="emails">
          {TABS.map((t, i) => (
            <button key={t} type="button" aria-current={i === cur ? 'step' : undefined} onClick={() => go(i)}>
              {i === cur && <motion.span layoutId="mq-tab" className="mq-tab-u" transition={SNAP} />}
              {t}
            </button>
          ))}
        </nav>
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={cur} className="mq-ins-body" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12, transition: { duration: 0.18 } }} transition={{ duration: 0.45, ease: EASE }}>
          {cur < 0 ? <Overview n={n} /> : <Panel step={cur} n={n} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

const FACTS = [
  ['Scheduling', 'A cron expression, a delay in milliseconds, or a job that repeats on an interval — timezone aware, and held in the store rather than in a process that might restart.'],
  ['Rate Limiting', 'Cap how many jobs a queue may start in a window, and how many a single worker runs at once. The third-party API with a quota stops being the reason your service falls over.'],
  ['Priority Queues', 'A job carries a priority, so the urgent one goes ahead of the backlog. Inside one priority it stays first in, first out, which is what keeps ordinary work from quietly starving.'],
  ['Retry & Backoff', 'Set attempts and a backoff — fixed, exponential, or a function you write. A worker that dies mid-job loses its lock and the job is handed to another, so work is attempted at least once and can be attempted twice. Write it to be idempotent and that is a property rather than a surprise.'],
  ['Watch it happen', "QueueEvents streams completed, failed, progress and stalled as they occur, so a job's life is something you observe rather than reconstruct from logs afterwards."],
  ['Failure is a state, not a deletion', 'A job that runs out of attempts lands in the failed set carrying its error and stack. Read it, fix the cause, retry it. Nothing disappears because it went wrong.'],
];

const CODE = `import { Queue, Worker } from "@hanzo/mq"

const queue = new Queue("emails", {
  connection: { host: "kv.hanzo.ai", port: 6379 }
})

// Add jobs with options
await queue.add("welcome", { userId: "usr_123" }, {
  priority: 1,
  delay: 5000,
  attempts: 3,
  backoff: { type: "exponential", delay: 1000 },
})

// Process jobs
const worker = new Worker("emails", async (job) => {
  await sendEmail(job.data.userId, "welcome")
}, {
  connection: { host: "kv.hanzo.ai", port: 6379 },
  concurrency: 10,
  limiter: { max: 100, duration: 60_000 },
})`;

export default function Mq() {
  const steps = FACTS.map(([t, d]) => ({ t, d }));
  return (
    <main className="lx mq">
      <section className="mq-hero" data-morph-target data-ask-name="Hanzo MQ">
        <div className="lx-wrap mq-hero-c">
          <LineMask as="h1" className="lx-display mq-h1" lines={['Hanzo MQ']} />
          <div className="mq-lead">
            <p className="lx-lede mq-sub">Background work, done later</p>
            <A to={GH} className="lx-cta" data-thumb="GitHub" data-cta="mq.hero">GitHub<Arr /></A>
          </div>
        </div>
        <div className="lx-wrap"><SettleStage from={1.04} lift={24} className="mq-stage"><Conveyor /></SettleStage></div>
      </section>

      <PinnedChapters flip label="The queue is data, the workers are yours" per={80}
        intro={{ title: ['The queue is data,', 'the workers are yours'] }}
        steps={steps}
        visual={(at, intro) => <Inspector step={at} intro={intro} />} />

      <ClipWipe dark className="mq-room">
        <div className="lx-wrap mq-room-grid">
          <div className="mq-room-l">
            <h2 className="lx-headline">Add a job here, run it there</h2>
            <Paste dark name="MQ" prompt="Read https://hanzo.ai/skill.md and use Hanzo MQ in my project. Start with: hanzo mq stream list" className="lx-paste" />
          </div>
          <Code title="MQ" tabs={[{ k: 'worker.ts', code: CODE }]} className="mq-code" />
        </div>
      </ClipWipe>

      <section className="lx-sec mq-walk">
        <div className="lx-wrap">
          <div className="mq-walk-top">
            <div className="mq-walk-l">
              <h2 className="lx-display s">Add a job and walk away</h2>
              <A to={GH} className="lx-ghost">View on GitHub<Arr /></A>
            </div>
            <div className="mq-walk-r">
              <LineMask as="p" className="mq-fig" aria-hidden="true" lines={['10K']} inView />
              <p className="mq-free">Free tier includes 10K jobs/month. No job size limits.</p>
            </div>
          </div>
          <SpecDrawer className="mq-spec" rows={[{ v: 'Library', l: 'No broker to run' }, { v: 'Cron', l: '' }, { v: 'Retries', l: 'With backoff' }, { v: 'At-least-once', l: 'Delivery' }]} />
        </div>
      </section>

      <LaunchClose name="MQ" tag="Message queue" seed="mq" data={[6379, 10, 100, 60000]} ask={['GitHub', GH]} cta="mq.close" repo={['hanzoai', GH]} />
    </main>
  );
}
