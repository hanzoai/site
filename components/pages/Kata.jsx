'use client';
/* Kata. Signature: test, repair, verify on a loop. Thirteen tests sit on a board, one of them red; the terminal runs the
   session Hanzo shows (run, triage, repair), the diff slides in between, and the red test turns green. Then it runs again.
   The loop below turns through its four stations; the capabilities read as a suite that passes.
   Beyond: "Will it fit my stack?" Pick your test runner, your CI and your language; the answer comes only from what Hanzo
   says Kata supports. Every word and figure is Hanzo's; the diff is drawn as bars, not invented code. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'motion/react';
import { EASE, Copy } from '../ui';
import { A, SecHead, Faq, Tick } from '../kit';
import './Kata.css';

const SESSION = [
  ['kata run --suite tests/unit', '12 passed · 1 failed (test_token_expiry)', 'bad'],
  ['kata triage', 'Kai decision: patch · confidence: 0.96 · root cause: off-by-one jitter', ''],
  ['kata repair --model enso-ultra', 'synthesized AST edit in auth/tokens.py · re-running test suite...', ''],
  [null, '13 passed · 0 failed · 100% green verification', 'good'],
];
// the diff is shown as its shape only: lines out (−) and in (+)
const DIFF = ['ctx', 'ctx', 'out', 'in', 'in', 'ctx'];

function Loop() {
  const [step, setStep] = useState(4); // the server and reduced motion show the finished, green session
  const [run, setRun] = useState(0);
  const box = useRef(null);
  const seen = useInView(box, { amount: 0.15 });
  const calm = useReducedMotion();
  useEffect(() => { if (!calm) setStep(0); }, [calm]);
  useEffect(() => {
    if (calm || !seen) return;
    const t = setTimeout(() => (step < 4 ? setStep(step + 1) : (setStep(0), setRun((r) => r + 1))), step === 4 ? 3600 : step === 0 ? 900 : 1900);
    return () => clearTimeout(t);
  }, [step, seen, calm]);
  const green = step >= 4;
  return (
    <div className="xkt-loop" ref={box}>
      <div className="xkt-board">
        <div className="xkt-board-top">
          <span className="x-mono">tests/unit</span>
          <span className={'xkt-verdict x-mono' + (green ? ' good' : step >= 1 ? ' bad' : '')}>{green ? '13 / 13' : step >= 1 ? '12 / 13' : '…'}</span>
        </div>
        <div className="xkt-dots" aria-hidden="true">
          {Array.from({ length: 13 }).map((_, i) => {
            const bad = i === 8;
            const state = step === 0 ? 'wait' : bad && !green ? 'red' : 'green';
            return (
              <motion.i key={i + '-' + run} className={state} title={bad ? 'test_token_expiry' : undefined}
                initial={{ scale: 0.4, opacity: 0.3 }} animate={{ scale: step === 0 ? 0.55 : 1, opacity: step === 0 ? 0.35 : 1 }}
                transition={{ type: 'spring', stiffness: 420, damping: 22, delay: step === 1 ? i * 0.03 : 0 }}>
                {bad && green && <motion.b initial={{ scale: 0.6, opacity: 0.8 }} animate={{ scale: 2.6, opacity: 0 }} transition={{ duration: 0.9, ease: EASE }} />}
              </motion.i>
            );
          })}
        </div>
        <p className="xkt-name x-mono">{green ? 'test_token_expiry · passing' : 'test_token_expiry'}</p>
        {/* the diff's room is always there, so nothing below it moves when it arrives */}
        <div className="xkt-diff">
          <motion.span className="xkt-diff-f x-mono" initial={false} animate={{ opacity: step >= 3 ? 1 : 0.25 }} transition={{ duration: 0.4 }}>auth/tokens.py</motion.span>
          <span className="xkt-bars" aria-hidden="true">
            {DIFF.map((k, i) => <motion.i key={i + '-' + run} className={k} initial={false} animate={{ scaleX: step >= 3 ? 1 : 0 }} transition={{ duration: 0.5, ease: EASE, delay: step >= 3 ? 0.15 + i * 0.06 : 0 }} style={{ width: [72, 58, 64, 80, 46, 66][i] + '%' }} />)}
          </span>
        </div>
      </div>
      <div className="xkt-term" role="log" aria-label="A Kata session">
        <div className="xkt-term-bar"><i /><i /><i /><span className="x-mono">terminal</span>
          <button type="button" className="xkt-replay" onClick={() => { setStep(0); setRun((r) => r + 1); }}>Replay</button>
        </div>
        <pre className="xkt-term-body x-mono">
          {SESSION.map(([cmd, out, tone], i) => {
            const on = step > i;
            return (
              <span key={i + '-' + run} className="xkt-ln">
                {cmd && <motion.span className="xkt-cmd" initial={false} animate={on || step === 4 ? { opacity: 1, x: 0 } : { opacity: 0.18, x: -6 }} transition={{ duration: on ? 0.45 : 0, ease: EASE }}><span className="xkt-ps">$ </span>{cmd}{'\n'}</motion.span>}
                <motion.span className={'xkt-out ' + tone} initial={false} animate={{ opacity: on || step === 4 ? 1 : 0, y: on || step === 4 ? 0 : 6 }} transition={{ duration: 0.4, ease: EASE, delay: on && cmd ? 0.4 : 0 }}>{out}{'\n'}</motion.span>
              </span>
            );
          })}
          <span className="xkt-ps">$ </span><span className="xkt-cur" aria-hidden="true" />
        </pre>
      </div>
    </div>
  );
}

function Hero() {
  const line = (t, d, c) => (
    <span className={'x-line ' + (c || '')}><motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: d }}>{t}</motion.span></span>
  );
  return (
    <section className="xkt-hero" aria-labelledby="xkt-h1">
      <div className="x-wrap xkt-hero-grid">
        <div>
          <motion.p className="x-kick" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }}>Hanzo Kata · Test repair</motion.p>
          <h1 id="xkt-h1" className="xkt-h1">{line('Test. Repair. Verify.', 0.05)}{line('Autonomous loop.', 0.18, 'xkt-soft')}</h1>
          <motion.p className="xkt-lede" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}>
            Kata keeps your tests green. It triages a failing CI run, finds the regression, writes the fix and runs the suite again before anything lands.
          </motion.p>
          <motion.div className="xkt-acts" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.5 }}>
            <A to="https://platform.hanzo.ai/keys" className="x-btn solid" data-thumb="Get API key">Get API key</A>
            <A to="https://github.com/hanzoai/kata" className="x-btn">Explore GitHub examples →</A>
            <A to="https://docs.hanzo.ai/docs/coding" className="xkt-doc">Read the docs →</A>
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0, y: 30, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 1.2, ease: EASE, delay: 0.25 }}>
          <Loop />
        </motion.div>
      </div>
    </section>
  );
}

const STATIONS = [
  ['01 · Observe', 'Catch the failure', 'Reads the stack trace, exit code and test log from pytest, cargo test, vitest or go test.'],
  ['02 · Decide', 'Choose what to do', 'Kai scores retry, patch, roll back or hand to a person, as probabilities, and writes no text.'],
  ['03 · Write', 'Write the fix', 'Enso picks the model that writes the edit, weighing quality, latency and budget.'],
  ['04 · Verify', 'Prove it', 'The candidate diff runs in an isolated microVM sandbox. Only a change whose whole suite passes lands.'],
];

/* The loop: four stations on a ring; the lit one turns by itself, or follows your pointer and your taps. */
function Pipeline() {
  const [at, setAt] = useState(0);
  const [mine, setMine] = useState(false);
  const box = useRef(null);
  const seen = useInView(box, { amount: 0.4 });
  const calm = useReducedMotion();
  useEffect(() => {
    if (mine || calm || !seen) return;
    const t = setTimeout(() => setAt((a) => (a + 1) % 4), 2600);
    return () => clearTimeout(t);
  }, [at, mine, calm, seen]);
  return (
    <section className="x-sec xkt-pipe" id="pipeline" data-room="dark" ref={box}>
      <div className="x-wrap">
        <SecHead dark kicker="The loop" title="From a failing test to a verified fix." lede="Kata never submits speculative code: Kai triages every failure, Enso writes the fix, and your own test suite decides whether it lands." />
        <div className="xkt-ring-grid">
          <div className="xkt-ring" aria-hidden="true">
            <svg viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="84" className="xkt-ring-track" />
              <motion.circle cx="100" cy="100" r="84" className="xkt-ring-arc" initial={false} animate={{ rotate: at * 90 - 90 }} transition={{ type: 'spring', stiffness: 90, damping: 16 }} />
              {[0, 1, 2, 3].map((k) => {
                const a = (k * Math.PI) / 2 - Math.PI / 2;
                return <circle key={k} cx={100 + 84 * Math.cos(a)} cy={100 + 84 * Math.sin(a)} r={k === at ? 7 : 4.5} className={'xkt-node' + (k === at ? ' on' : '')} />;
              })}
            </svg>
            <span className="xkt-ring-n x-mono">{String(at + 1).padStart(2, '0')}</span>
            <span className="xkt-spin" />
          </div>
          <ol className="xkt-stations">
            {STATIONS.map(([k, t, d], i) => (
              <li key={k}>
                <button type="button" className={'xkt-st' + (i === at ? ' on' : '')} aria-pressed={i === at}
                  onClick={() => { setAt(i); setMine(true); }} onPointerEnter={(e) => { if (e.pointerType === 'mouse') { setAt(i); setMine(true); } }}>
                  <span className="xkt-st-k x-mono">{k}</span>
                  <h3>{t}</h3>
                  <span className="xkt-st-d">{d}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

const CAPS = [
  ['Test repair, end to end', 'Finds regressions and flaky tests, traces each to its root cause, writes the smallest diff and checks that the suite passes.'],
  ['Triage by Kai', 'No prose to parse: Kai returns a probability for each action, patch, roll back, retry or approve.'],
  ['Models picked by Enso', 'Each attempt runs on enso-auto, enso-flash or enso-ultra, trading cost against accuracy.'],
  ['Runs in your pipeline', 'In GitHub Actions, GitLab CI or a pre-push hook in your terminal.'],
];

// what Hanzo says Kata supports, word for word from this page
const RUNNERS = ['pytest', 'vitest', 'jest', 'cargo test', 'go test', 'TAP or JUnit XML'];
const CIS = ['GitHub Actions', 'GitLab CI', 'pre-push hook'];
const LANGS = ['Python', 'TypeScript', 'Go', 'Rust', 'cURL'];

function Pick({ label, opts, v, set }) {
  return (
    <div className="xkt-pick">
      <span className="xkt-pick-l">{label}</span>
      <div role="radiogroup" aria-label={label} className="xkt-chips">
        {opts.map((o) => (
          <button key={o} type="button" role="radio" aria-checked={v === o} className={v === o ? 'on' : ''} onClick={() => set(v === o ? null : o)}>{o}</button>
        ))}
      </div>
    </div>
  );
}

function Fit() {
  const [r, setR] = useState(null);
  const [c, setC] = useState(null);
  const [l, setL] = useState(null);
  const picked = [r, c, l].filter(Boolean);
  return (
    <div className="xkt-fit">
      <p className="x-kick">Will it fit my stack?</p>
      <Pick label="Test runner" opts={RUNNERS} v={r} set={setR} />
      <Pick label="Where it runs" opts={CIS} v={c} set={setC} />
      <Pick label="Example language" opts={LANGS} v={l} set={setL} />
      <div className="xkt-fit-out" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p key={picked.join('|') || 'none'} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3, ease: EASE }}>
            {picked.length ? <><Tick size={20} /> <span><b>{picked.join(' · ')}</b>: on Hanzo&apos;s list.{l && ' Runnable examples are in hanzoai/kata.'}</span></> : <span className="xkt-fit-none">Choose what you use; every option here is one Hanzo names.</span>}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}

function Capabilities() {
  return (
    <section className="x-sec xkt-caps" id="features">
      <div className="x-wrap">
        <SecHead kicker="Capabilities" title="Built for the pipeline." lede="Test repair, triage and the choice of model, in the CI you already run." />
        <div className="xkt-caps-grid">
          <div className="xkt-report">
            <div className="xkt-report-top x-mono"><span>capabilities</span><span className="good">4 passed</span></div>
            <ul>
              {CAPS.map(([t, d], i) => (
                <li key={t}>
                  <Tick delay={0.15 + i * 0.12} size={24} />
                  <span><h3>{t}</h3><span>{d}</span></span>
                  <span className="xkt-pass x-mono" aria-hidden="true">PASS</span>
                </li>
              ))}
            </ul>
            <span className="xkt-scan" aria-hidden="true" />
          </div>
          <Fit />
        </div>
      </div>
    </section>
  );
}

const QA = [
  ['How does Kata differ from Hanzo Dev and Gen?', 'Dev is the coding agent that plans and writes whole features. Gen runs any coding agent on Hanzo’s tools and models. Kata repairs failing tests in CI: it triages each failure and lands a fix only when the suite passes.'],
  ['Which test frameworks does Kata support?', 'Kata natively supports pytest, vitest, jest, cargo test, go test, and custom test runners emitting standard TAP or JUnit XML output.'],
  ['Where can I find the open-source examples and recipes?', 'The open-source repository is at github.com/hanzoai/kata with runnable examples in Python, TypeScript, Go, Rust, and cURL, along with a standalone Rust recipes crate.'],
  ['How do I authenticate with Hanzo Cloud?', 'Log in once with `hanzo auth login` or export `HANZO_API_KEY` from platform.hanzo.ai/keys.'],
];
const PASTE = 'Read https://hanzo.ai/skill.md and use Hanzo Kata in my project. Start with: hanzo kata run';

function Questions() {
  return (
    <section className="x-sec xkt-qa">
      <div className="x-wrap xkt-split">
        <div>
          <SecHead kicker="Questions" title="Questions & Answers" />
          <Faq items={QA} />
        </div>
        <div className="xkt-sticky">
          <div className="xkt-paste">
            <p className="x-kick">Paste and ship</p>
            <p className="xkt-paste-l">Paste this into any agent. It reads the skill manifest and calls Kata from there.</p>
            <div className="xkt-prompt">
              <div className="xkt-prompt-top"><span className="x-mono">Agent prompt</span><Copy text={PASTE} label="Copy the agent prompt" /></div>
              <pre className="x-mono">{PASTE}<span className="xkt-cur" aria-hidden="true" /></pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const READ = [
  ['Kata', [['https://github.com/hanzoai/kata', 'hanzoai/kata', 'GitHub Repository.'], ['https://github.com/hanzoai/kata/tree/main/examples', 'Multi-Language SDKs'], ['https://github.com/hanzoai/kata/tree/main/recipes', 'Rust Recipes Crate']]],
  ['Agent Systems', [['/dev', 'Hanzo Dev', 'Our coding agent.'], ['/gen', 'Hanzo Gen', 'Universal harness.'], ['/kai', 'Kai', 'Decision engine.']]],
  ['Models', [['/enso', 'Enso', 'Model router.'], ['/zen', 'Zen', 'Open weights.'], ['/models', 'Every model']]],
];

function Read() {
  return (
    <section className="x-sec xkt-read">
      <div className="x-wrap">
        <SecHead kicker="Read" title="The agent, the loop, the documentation." lede="Explore the source code, recipes, and documentation." />
        <div className="xkt-cols">
          {READ.map(([h, items], c) => (
            <div key={h}>
              <h3 className="xkt-col-h">{h}</h3>
              <ul className="xkt-links">
                {items.map(([to, t, d]) => (
                  <li key={t}><A to={to} className="xkt-link"><span><b>{t}</b>{d && <span>{d}</span>}</span><i aria-hidden="true">→</i></A></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Kata() {
  return (
    <main className="xkt">
      <Hero />
      <Pipeline />
      <Capabilities />
      <Read />
      <Questions />
    </main>
  );
}
