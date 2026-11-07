'use client';
/* Kata. V2: 8/10 the headline is the loop (Test. Repair. Verify. light in turn with a live session), a scrubbed dial through the four stations, and one dark room that a green wipe turns into a passing suite.
   Signature: the page turns green. The hero headline is the loop itself: "Test." lights while the suite runs and one
   test goes red, "Repair." while Kai triages and Enso writes the edit, "Verify." when 13 passed · 0 failed lands; the
   terminal and the test board beside it run Hanzo's session on their own. The loop is a dial pinned on screen while
   its four stations come in one by one. The one dark room holds "12 passed · 1 failed" until a green clip-path wipe,
   scrubbed by your scroll, turns it into "13 passed · 0 failed". Capabilities read as a report that passes.
   Beyond: "Will it fit my stack?" Pick your test runner, your CI and your language; the answer comes only from what
   Hanzo says Kata supports. Accent: green, from the passing suite. Every word and figure is Hanzo's; the diff is drawn
   as bars, not invented code. */
import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { A, Tick } from '../kit';
import A2Lines from '../v2/A2Lines';
import A2Paste from '../v2/A2Paste';
import A2Chapters from '../v2/A2Chapters';
import A2Faq from '../v2/A2Faq';
import '../v2/A2.css';
import './Kata.css';

const SESSION = [
  ['kata run --suite tests/unit', '12 passed · 1 failed (test_token_expiry)', 'bad'],
  ['kata triage', 'Kai decision: patch · confidence: 0.96 · root cause: off-by-one jitter', ''],
  ['kata repair --model enso-ultra', 'synthesized AST edit in auth/tokens.py · re-running test suite...', ''],
  [null, '13 passed · 0 failed · 100% green verification', 'good'],
];
const DIFF = ['ctx', 'ctx', 'out', 'in', 'in', 'ctx']; // the diff's shape only: lines out (−) and in (+)
const WORDS = ['Test.', 'Repair.', 'Verify.'];
const wordAt = (s) => (s <= 1 ? 0 : s <= 3 ? 1 : 2);

/* One clock for the hero: 0 running, 1 one red, 2 triage, 3 repair, 4 green. The server and reduced motion show green. */
function useLoop(ref) {
  const [step, setStep] = useState(4);
  const [run, setRun] = useState(0);
  const seen = useInView(ref, { amount: 0.2 });
  const calm = useReducedMotion();
  useEffect(() => { if (!calm) setStep(0); }, [calm]);
  useEffect(() => {
    if (calm || !seen) return;
    const t = setTimeout(() => (step < 4 ? setStep(step + 1) : (setStep(0), setRun((r) => r + 1))), step === 4 ? 3800 : step === 0 ? 1000 : 1900);
    return () => clearTimeout(t);
  }, [step, seen, calm]);
  return [step, run, () => { setStep(0); setRun((r) => r + 1); }];
}

function Board({ step, run }) {
  const green = step >= 4;
  const red = step >= 1 && !green;
  return (
    <div className="xkt-board" aria-hidden="true">
      <div className="xkt-figs">
        <span className="xkt-fig"><b className="a2-fig">{green ? 13 : 12}</b><span>passed</span></span>
        <span className={'xkt-fig f' + (red ? ' bad' : '')}><b className="a2-fig">{green ? 0 : 1}</b><span>failed</span></span>
      </div>
      <div className="xkt-dots">
        {Array.from({ length: 13 }).map((_, i) => {
          const bad = i === 8;
          const state = step === 0 ? 'wait' : bad && !green ? 'red' : 'green';
          return (
            <motion.i key={i + '-' + run} className={state} initial={{ scale: 0.4, opacity: 0.3 }} animate={{ scale: step === 0 ? 0.55 : 1, opacity: step === 0 ? 0.35 : 1 }} transition={{ type: 'spring', stiffness: 300, damping: 30, delay: step === 1 ? i * 0.03 : 0 }}>
              {bad && green && <motion.b initial={{ scale: 0.6, opacity: 0.8 }} animate={{ scale: 2.8, opacity: 0 }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }} />}
            </motion.i>
          );
        })}
      </div>
      <div className="xkt-diff">
        <span className="x-mono" style={{ opacity: step >= 3 ? 1 : 0.3 }}>auth/tokens.py</span>
        <span className="xkt-bars">{DIFF.map((k, i) => <i key={i + '-' + run} className={k + (step >= 3 ? ' on' : '')} style={{ width: [72, 58, 64, 80, 46, 66][i] + '%', transitionDelay: step >= 3 ? 0.15 + i * 0.06 + 's' : '0s' }} />)}</span>
      </div>
    </div>
  );
}

function Term({ step, run, replay }) {
  return (
    <div className="xkt-term" role="log" aria-label="A Kata session">
      <div className="xkt-term-bar"><i /><i /><i /><span className="x-mono">terminal</span>
        <button type="button" className="xkt-replay" onClick={replay}>Replay</button>
      </div>
      <pre className="xkt-term-body x-mono">
        {SESSION.map(([cmd, out, tone], i) => {
          const on = step > i || step === 4;
          return (
            <span key={i + '-' + run} className={'xkt-ln' + (on ? ' on' : '')}>
              {cmd && <span className="xkt-cmd"><span className="xkt-ps">$ </span>{cmd}{'\n'}</span>}
              <span className={'xkt-out ' + tone}>{out}{'\n'}</span>
            </span>
          );
        })}
        <span className="xkt-ps">$ </span><span className="xkt-cur" aria-hidden="true" />
      </pre>
    </div>
  );
}

function Hero() {
  const ref = useRef(null);
  const [step, run, replay] = useLoop(ref);
  const lit = wordAt(step);
  return (
    <section className="xkt-hero" ref={ref} aria-labelledby="xkt-h1">
      <div className="a2-wrap a2-grid xkt-hero-grid">
        <div className="xkt-hero-copy">
          <p className="a2-kick"><b>Hanzo Kata</b> · Test repair</p>
          <h1 id="xkt-h1" className="a2-display xkt-h1">
            {WORDS.map((w, i) => (
              <span className="a2-ln" key={w}>
                <motion.span className={'a2-ln-in xkt-w' + (i === lit ? ' on' : '')} initial={{ y: '108%' }} animate={{ y: 0 }} transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1], delay: 0.05 + i * 0.09 }}>{w}</motion.span>{' '}
              </span>
            ))}
            <span className="xkt-auto">Autonomous loop.</span>
          </h1>
          <p className="a2-lede">Kata keeps your tests green. It triages a failing CI run, finds the regression, writes the fix and runs the suite again before anything lands.</p>
          <div className="a2-acts">
            <A to="https://platform.hanzo.ai/keys" className="x-btn solid" data-thumb="Get API key">Get API key</A>
            <A to="https://github.com/hanzoai/kata" className="x-btn">Explore GitHub examples →</A>
            <A to="https://docs.hanzo.ai/docs/coding" className="xkt-doc">Read the docs →</A>
          </div>
        </div>
        <motion.div className="xkt-hero-obj" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}>
          <Board step={step} run={run} />
          <Term step={step} run={run} replay={replay} />
        </motion.div>
      </div>
    </section>
  );
}

/* The loop: a dial pinned on screen; the four stations come in one by one as you scroll. */
const STATIONS = [
  ['01 · Observe', 'Catch the failure', 'Reads the stack trace, exit code and test log from pytest, cargo test, vitest or go test.'],
  ['02 · Decide', 'Choose what to do', 'Kai scores retry, patch, roll back or hand to a person, as probabilities, and writes no text.'],
  ['03 · Write', 'Write the fix', 'Enso picks the model that writes the edit, weighing quality, latency and budget.'],
  ['04 · Verify', 'Prove it', 'The candidate diff runs in an isolated microVM sandbox. Only a change whose whole suite passes lands.'],
];
const C = 2 * Math.PI * 44;

function Dial({ at }) {
  return (
    <div className="xkt-dial">
      <svg viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="44" className="xkt-dial-track" />
        <circle cx="50" cy="50" r="44" className="xkt-dial-arc" style={{ strokeDasharray: C, strokeDashoffset: C * (1 - (at + 1) / 4) }} />
      </svg>
      {STATIONS.map(([k], i) => (
        <span key={k} className={'xkt-dial-st s' + i + (i <= at ? ' done' : '') + (i === at ? ' on' : '')}><i />{k.split(' · ')[1]}</span>
      ))}
      <div className="xkt-dial-c"><b className="a2-fig">{String(at + 1).padStart(2, '0')}</b><span className="x-mono">/ 04</span></div>
    </div>
  );
}

function TheLoop() {
  return (
    <>
      <section className="a2-sec xkt-intro" aria-labelledby="xkt-loop-h">
        <div className="a2-wrap a2-grid">
          <p className="a2-kick xkt-intro-k">The loop</p>
          <A2Lines id="xkt-loop-h" className="a2-display m xkt-intro-h" lines={['From a failing test', 'to a verified fix.']} />
          <p className="a2-lede xkt-intro-l">Kata never submits speculative code: Kai triages every failure, Enso writes the fix, and your own test suite decides whether it lands.</p>
        </div>
      </section>
      <A2Chapters flip label="The loop" items={STATIONS.map(([k, t, d]) => ({ k, t, d }))} visual={(i) => <Dial at={i} />} />
    </>
  );
}

/* The one dark room: red until a green wipe, scrubbed by scroll, turns the suite. */
function Wipe() {
  const ref = useRef(null);
  const calm = useReducedMotion();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const clip = useTransform(p, (v) => `circle(${calm ? 150 : Math.max(0, Math.min(1, (v - 0.18) / 0.5)) * 150}% at 50% 62%)`);
  return (
    <section className="xkt-wipe" ref={ref} data-room="dark" aria-label="The suite turns green">
      <div className="xkt-wipe-stick">
        <div className="xkt-wipe-l red" aria-hidden="true">
          <p className="a2-kick">kata run --suite tests/unit</p>
          <p className="xkt-wipe-fig a2-fig">1 <span>failed</span></p>
          <p className="xkt-wipe-cap x-mono">12 passed · 1 failed (test_token_expiry)</p>
        </div>
        <motion.div className="xkt-wipe-l green" style={{ clipPath: clip }}>
          <p className="a2-kick">kata repair --model enso-ultra</p>
          <p className="xkt-wipe-fig a2-fig">0 <span>failed</span></p>
          <p className="xkt-wipe-cap x-mono">13 passed · 0 failed · 100% green verification</p>
        </motion.div>
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
      <span className="xkt-pick-l x-mono">{label}</span>
      <div role="radiogroup" aria-label={label} className="xkt-chips">
        {opts.map((o) => <button key={o} type="button" role="radio" aria-checked={v === o} onClick={() => set(v === o ? null : o)}>{o}</button>)}
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
      <p className="a2-title">Will it fit my stack?</p>
      <Pick label="Test runner" opts={RUNNERS} v={r} set={setR} />
      <Pick label="Where it runs" opts={CIS} v={c} set={setC} />
      <Pick label="Example language" opts={LANGS} v={l} set={setL} />
      <p className={'xkt-fit-out' + (picked.length ? ' on' : '')} aria-live="polite">
        {picked.length ? <><span className="xkt-ok" aria-hidden="true">✓</span><span><b>{picked.join(' · ')}</b>: on Hanzo&apos;s list.{l && ' Runnable examples are in hanzoai/kata.'}</span></> : <span>Choose what you use; every option here is one Hanzo names.</span>}
      </p>
    </div>
  );
}

function Capabilities() {
  return (
    <section className="a2-sec xkt-caps" id="features" aria-labelledby="xkt-caps-h">
      <div className="a2-wrap a2-grid">
        <div className="xkt-caps-head">
          <p className="a2-kick">Capabilities</p>
          <A2Lines id="xkt-caps-h" className="a2-display s" lines={['Built for', 'the pipeline.']} />
          <p className="a2-lede">Test repair, triage and the choice of model, in the CI you already run.</p>
        </div>
        <div className="xkt-report">
          <div className="xkt-report-top x-mono"><span>capabilities</span><span className="good">4 passed</span></div>
          <ul>
            {CAPS.map(([t, d], i) => (
              <li key={t}>
                <Tick delay={0.15 + i * 0.12} size={26} />
                <span><h3>{t}</h3><span>{d}</span></span>
                <span className="xkt-pass x-mono" aria-hidden="true">PASS</span>
              </li>
            ))}
          </ul>
        </div>
        <Fit />
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
    <section className="a2-sec tight xkt-read" aria-labelledby="xkt-read-h">
      <div className="a2-wrap">
        <div className="xkt-read-head">
          <p className="a2-kick">Read</p>
          <h2 id="xkt-read-h" className="a2-headline">The agent, the loop, the documentation.</h2>
          <p className="a2-body">Explore the source code, recipes, and documentation.</p>
        </div>
        <div className="xkt-cols">
          {READ.map(([h, items]) => (
            <div key={h}>
              <h3 className="xkt-col-h x-mono">{h}</h3>
              <ul className="xkt-links">
                {items.map(([to, t, d]) => <li key={t}><A to={to} className="xkt-link"><span><b>{t}</b>{d && <span>{d}</span>}</span><i aria-hidden="true">→</i></A></li>)}
              </ul>
            </div>
          ))}
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

function Questions() {
  return (
    <section className="a2-sec xkt-qa" aria-labelledby="xkt-qa-h">
      <div className="a2-wrap a2-grid">
        <div className="xkt-qa-head">
          <p className="a2-kick">Questions</p>
          <h2 id="xkt-qa-h" className="a2-headline">Questions &amp; Answers</h2>
          <div className="a2-acts xkt-qa-acts">
            <A to="https://platform.hanzo.ai/keys" className="x-btn solid">Get API key</A>
          </div>
        </div>
        <div className="xkt-qa-list"><A2Faq items={QA} /></div>
      </div>
    </section>
  );
}

export default function Kata() {
  return (
    <main className="a2 xkt" style={{ '--acc': '#16a34a' }}>
      <Hero />
      <A2Paste name="Kata" text="Read https://hanzo.ai/skill.md and use Hanzo Kata in my project. Start with: hanzo kata run" />
      <TheLoop />
      <Wipe />
      <Capabilities />
      <Read />
      <Questions />
    </main>
  );
}
