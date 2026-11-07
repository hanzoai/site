'use client';
/* MQ. Signature: jobs on a conveyor. Jobs ride in by priority, the urgent one cutting ahead; workers take them up to
   their concurrency under a rate limit; one fails, waits out an exponential backoff, is retried, and after its last
   attempt lands in the failed set with its error rather than vanishing; QueueEvents prints each life as it happens.
   Every word, figure and link is Hanzo's; job names are examples. */
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EASE, Rise } from '../../ui';
import { A } from '../../kit';
import { Hero, Paste, Get, Code, Head, useLive, useEvery } from './Frame';
import './Mq.css';

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
  if (active.length < 2 && sorted.length) { const j = sorted.shift(); ev.push(['progress', j.n]); active.push({ ...j, age: 0, attempt: j.attempt || 1 }); }
  if (sorted.length < 4) sorted.push({ id: id++, n: NAMES[t % NAMES.length], p: t % 4 === 0 ? 1 : 2, fail: t % 5 === 0 });
  return { t, id, wait: sorted, active, done: done.slice(0, 4), events: [...ev.map((e, k) => ({ k: t * 10 + k, e })), ...s.events].slice(0, 5) };
}
const START = { t: 0, id: 4, wait: [0, 1, 2, 3].map((i) => ({ id: i, n: NAMES[i], p: i === 2 ? 1 : 2 })), active: [], done: [], events: [] };

function Belt() {
  const [ref, live] = useLive(0.3);
  const [s, setS] = useState(START);
  useEvery(1100, live, () => setS(step));
  const { wait, active, done, events } = s;
  return (
    <div className="mq-belt" ref={ref} aria-hidden="true">
      <div className="mq-col">
        <p className="mq-k">waiting</p>
        <div className="mq-stack">
          <AnimatePresence initial={false}>
            {[...wait].sort((a, b) => a.p - b.p).map((j) => (
              <motion.div key={j.id} layout layoutId={'mq' + j.id} className={'mq-job' + (j.p === 1 ? ' hi' : '') + (j.back ? ' back' : '')} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 28 }}>
                <b>{j.n}</b><span>{j.back ? 'backoff · exponential' : j.p === 1 ? 'priority 1' : 'priority 2'}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
      <div className="mq-col work">
        <p className="mq-k">workers · concurrency</p>
        {[0, 1].map((k) => {
          const j = active[k];
          return (
            <div key={k} className="mq-slot">
              <AnimatePresence>{j && <motion.div key={j.id} layoutId={'mq' + j.id} className={'mq-job run' + (j.fail ? ' risky' : '')} transition={{ type: 'spring', stiffness: 260, damping: 28 }}><b>{j.n}</b><span>attempt {j.attempt}</span><i /></motion.div>}</AnimatePresence>
            </div>
          );
        })}
        <p className="mq-lim">limiter · max per window</p>
      </div>
      <div className="mq-col">
        <p className="mq-k">completed · failed</p>
        <div className="mq-stack">
          <AnimatePresence initial={false}>
            {done.map((j) => <motion.div key={j.id + (j.ok ? 'c' : 'f')} layout className={'mq-job ' + (j.ok ? 'ok' : 'bad')} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35, ease: EASE }}><b>{j.n}</b><span>{j.ok ? 'completed' : 'error · stack kept'}</span></motion.div>)}
          </AnimatePresence>
        </div>
      </div>
      <div className="mq-events">
        <p className="mq-k">QueueEvents</p>
        <AnimatePresence initial={false}>
          {events.map(({ k, e: [type, what] }) => <motion.p key={k} layout initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={type}><b>{type}</b> {what}</motion.p>)}
        </AnimatePresence>
      </div>
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
  return (
    <main className="mq">
      <Hero look="stack" kick="Job queue" title="Hanzo MQ" sub="Background work, done later" acts={[['GitHub', 'https://github.com/hanzoai']]}>
        <Belt />
      </Hero>
      <section className="x-sec mq-facts">
        <div className="x-wrap">
          <div className="mq-facts-h"><Rise as="h2">The queue is data, the workers are yours</Rise><span className="x-mono">01 / 06 — 06 / 06</span></div>
          <dl className="mq-dl">
            {FACTS.map(([t, d], i) => (
              <Rise key={t} className="mq-def" y={16} delay={(i % 2) * 0.05}>
                <dt><span>{String(i + 1).padStart(2, '0')} / 06</span>{t}</dt>
                <dd>{d}</dd>
              </Rise>
            ))}
          </dl>
        </div>
      </section>
      <section className="mq-figs">
        <div className="x-wrap">
          <ul>{[['Library', 'No broker to run'], ['Cron', ''], ['Retries', 'With backoff'], ['At-least-once', 'Delivery']].map(([a, b], i) => <Rise as="li" key={a} delay={i * 0.06}><b>{a}</b>{b && <span>{b}</span>}</Rise>)}</ul>
        </div>
      </section>
      <section className="x-sec mq-code" data-room="dark">
        <div className="x-wrap mq-code-grid">
          <div>
            <Head dark title="Add a job here, run it there" />
            <Paste dark name="MQ" prompt="Read https://hanzo.ai/skill.md and use Hanzo MQ in my project. Start with: hanzo mq stream list" className="mq-paste" />
          </div>
          <Code title="MQ" tabs={[{ k: 'worker.ts', code: CODE }]} />
        </div>
      </section>
      <section className="mq-walk">
        <div className="x-wrap mq-walk-in">
          <div><Rise as="h2">Add a job and walk away</Rise><Rise as="p" delay={0.08}>Free tier includes 10K jobs/month. No job size limits.</Rise></div>
          <A to="https://github.com/hanzoai" className="x-btn">View on GitHub</A>
        </div>
      </section>
      <Get name="MQ" tag="Message queue" />
    </main>
  );
}
