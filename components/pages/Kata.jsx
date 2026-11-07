'use client';
// Persona: an engineer whose CI keeps going red.
// Goal: get an API key.
// CTA: Get API key (kata.hero; the close repeats it in the Band).
// Metric: cta_click kata.hero
// Signature: the headline is the loop: Test. Repair. Verify. light in turn while a live session runs beside them.
// Beyond: pick your runner, your CI and your language, and Hanzo's own sentence lights the words you use.
/* Kata.
   V2: 8/10 the deck scale (h1 52, sections 26, figures 64; the one big figure grows only while the suite turns); the headline is the loop (Test. Repair. Verify. light in turn with a live session that has a pause control), a pinned dial through the four stations, one dark room that opens from a rounded card and wipes 1 failed into 0 failed, Hanzo's own sentences lighting your stack, kit Cta and Band. Greys only.
   Signature: the headline is the loop itself: "Test." lights while the suite runs and one test fails, "Repair." while
   Kai triages and Enso writes the edit, "Verify." when 13 passed · 0 failed lands; the terminal and the test board
   beside it run Hanzo's session on their own (pause control first in the box). The loop is a dial pinned on screen
   while its four stations come in one by one. The one dark room enters as a rounded card, holds "1 failed" until a
   white wipe, scrubbed by your scroll, turns it into "0 failed"; that figure is the page's one big moment, growing
   from 64px while the wipe runs and settling back after it. Capabilities tick in as a list.
   Beyond: pick your test runner, your CI and your example language; the words you pick light up inside Hanzo's own
   sentences about what Kata supports, and a tick draws beside each one that holds them. Nothing is invented: every
   option and sentence is Hanzo's. Greys only; the diff is drawn as bars, not invented code. */
import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { A, Cta, Band, Tick } from '../kit';
import A2Lines from '../v2/A2Lines';
import A2Paste from '../v2/A2Paste';
import A2Chapters from '../v2/A2Chapters';
import A2Faq from '../v2/A2Faq';
import A2Pause from '../v2/A2Pause';
import A2Room from '../v2/A2Room';
import useNarrow from '../v2/A2Narrow';
import { T, EMPH, MOVE } from '../v2/A2Motion';
import '../v2/A2.css';
import usePhoneAsk from './usePhoneAsk';
import './Kata.css';

const KEYS = 'https://platform.hanzo.ai/keys';
const SESSION = [
  ['kata run --suite tests/unit', '12 passed · 1 failed (test_token_expiry)', 'bad'],
  ['kata triage', 'Kai decision: patch · confidence: 0.96 · root cause: off-by-one jitter', ''],
  ['kata repair --model enso-ultra', 'synthesized AST edit in auth/tokens.py · re-running test suite...', ''],
  [null, '13 passed · 0 failed · 100% green verification', 'good'],
];
const DIFF = ['ctx', 'ctx', 'out', 'in', 'in', 'ctx']; // the diff's shape only: lines out (−) and in (+)
const WORDS = ['Test.', 'Repair.', 'Verify.'];
const wordAt = (s) => (s <= 1 ? 0 : s <= 3 ? 1 : 2);

/* One clock for the hero: 0 running, 1 one failing, 2 triage, 3 repair, 4 passing. Server and reduced motion show 4.
   A chain of timeouts (no setInterval) that stops off screen and while paused. */
function useLoop(ref, paused) {
  const [step, setStep] = useState(4);
  const [run, setRun] = useState(0);
  const seen = useInView(ref, { amount: 0.2 });
  const calm = useReducedMotion();
  useEffect(() => { if (!calm) setStep(0); }, [calm]);
  useEffect(() => {
    if (calm || !seen || paused) return;
    const t = setTimeout(() => (step < 4 ? setStep(step + 1) : (setStep(0), setRun((r) => r + 1))), step === 4 ? 3800 : step === 0 ? 1000 : 1900);
    return () => clearTimeout(t);
  }, [step, seen, calm, paused]);
  return [step, run, () => { setStep(0); setRun((r) => r + 1); }];
}

function Board({ step, run }) {
  const pass = step >= 4;
  const fail = step >= 1 && !pass;
  return (
    <div className="xkt-board" aria-hidden="true">
      <div className="xkt-figs">
        <span className="xkt-fig"><b>{pass ? 13 : 12}</b><span>passed</span></span>
        <span className={'xkt-fig' + (fail ? ' bad' : '')}><b>{pass ? 0 : 1}</b><span>failed</span></span>
      </div>
      <div className="xkt-dots">
        {Array.from({ length: 13 }).map((_, i) => {
          const bad = i === 8;
          const state = step === 0 ? 'wait' : bad && !pass ? 'fail' : 'pass';
          return (
            <motion.i key={i + '-' + run} className={state} initial={{ scale: 0.4, opacity: 0.3 }} animate={{ scale: step === 0 ? 0.55 : 1, opacity: step === 0 ? 0.35 : 1 }} transition={{ ...MOVE, delay: step === 1 ? i * 0.03 : 0 }}>
              {bad && pass && <motion.b initial={{ scale: 0.6, opacity: 0.8 }} animate={{ scale: 2.8, opacity: 0 }} transition={{ duration: T.scene, ease: EMPH }} />}
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
      <div className="xkt-term-bar"><i /><i /><i />
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
  const [paused, setPaused] = useState(false);
  const [step, run, replay] = useLoop(ref, paused);
  const lit = wordAt(step);
  return (
    <section className="xkt-hero" ref={ref} aria-labelledby="xkt-h1">
      <div className="a2-wrap">
        {/* the loop on one line; the word the loop is on is the one in ink */}
        <h1 id="xkt-h1" className="a2-display xkt-h1">
          {WORDS.map((w, i) => (
            <span className="a2-ln" key={w}>
              <motion.span className={'a2-ln-in xkt-w' + (i === lit ? ' on' : '')} initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: T.line, ease: EMPH, delay: 0.05 + i * T.stagger }}>{w}</motion.span>{' '}
            </span>
          ))}
          <span className="xkt-auto">Autonomous loop.</span>
        </h1>
        <p className="a2-kick"><b>Hanzo Kata</b> · Test repair</p>
        <div className="a2-grid xkt-hero-grid">
          <div className="xkt-hero-copy">
            <p className="a2-lede">Kata keeps your tests green. It triages a failing CI run, finds the regression, writes the fix and runs the suite again before anything lands.</p>
            <div className="a2-acts">
              <Cta to={KEYS} id="kata.hero" thumb>Get API key</Cta>
              <Cta to="https://github.com/hanzoai/kata" kind="quiet">Explore GitHub examples →</Cta>
            </div>
            <p className="xkt-docs"><A to="https://docs.hanzo.ai/docs/coding" className="xkt-doc">Read the docs →</A></p>
          </div>
          <motion.div className={'xkt-hero-obj' + (paused ? ' a2-paused' : '')} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: T.slower, ease: EMPH, delay: 0.15 }}>
            <A2Pause paused={paused} onChange={setPaused} label="Pause" className="xkt-pause" />
            <Board step={step} run={run} />
            <Term step={step} run={run} replay={replay} />
          </motion.div>
        </div>
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
          <p className="a2-kick">The loop</p>
          <A2Lines id="xkt-loop-h" className="a2-headline xkt-intro-h" lines={['From a failing test', 'to a verified fix.']} />
          <p className="a2-lede xkt-intro-l">Kata never submits speculative code: Kai triages every failure, Enso writes the fix, and your own test suite decides whether it lands.</p>
        </div>
      </section>
      <A2Chapters flip label="The loop" items={STATIONS.map(([k, t, d]) => ({ k, t, d }))} visual={(i) => <Dial at={i} />} />
    </>
  );
}

/* The one dark room: it enters as a rounded card, holds "1 failed" until a white wipe, scrubbed by scroll, turns the
   suite. The figure is the page's moment: it rests at 64px, grows while the wipe runs, and settles after it. */
const ease3 = (k) => k * k * (3 - 2 * k);
function Wipe() {
  const ref = useRef(null);
  const calm = useReducedMotion();
  const narrow = useNarrow();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const clip = useTransform(p, (v) => `circle(${calm ? 150 : Math.max(0, Math.min(1, (v - 0.22) / 0.42)) * 150}% at 50% 56%)`);
  const scale = useTransform(p, (v) => {
    if (calm || narrow) return 1;
    const r = 1 / 3; // 64px of the 192px the figure is set at
    if (v < 0.08) return r;
    if (v < 0.4) return r + (1 - r) * ease3((v - 0.08) / 0.32);
    if (v < 0.7) return 1;
    if (v < 0.94) return 1 - (1 - r) * ease3((v - 0.7) / 0.24);
    return r;
  });
  return (
    <A2Room className="xkt-room" room={null} aria-label="The suite turns">
      <div className="xkt-wipe" ref={ref}>
        {/* the header is dark only while black is under it: until the white wipe passes the top of the screen */}
        <i className="xkt-wipe-dark" data-room="dark" aria-hidden="true" />
        <div className="xkt-wipe-stick">
          <div className="xkt-wipe-l fail" aria-hidden="true">
            <p className="xkt-wipe-cmd x-mono">kata run --suite tests/unit</p>
            <motion.p className="xkt-wipe-fig" style={{ scale }}>1 <span>failed</span></motion.p>
            <p className="xkt-wipe-cap x-mono">12 passed · 1 failed (test_token_expiry)</p>
          </div>
          <motion.div className="xkt-wipe-l pass" style={{ clipPath: clip }}>
            <p className="xkt-wipe-cmd x-mono">kata repair --model enso-ultra</p>
            <motion.p className="xkt-wipe-fig" style={{ scale }}>0 <span>failed</span></motion.p>
            <p className="xkt-wipe-cap x-mono">13 passed · 0 failed · 100% green verification</p>
          </motion.div>
        </div>
      </div>
    </A2Room>
  );
}

const CAPS = [
  ['Test repair, end to end', 'Finds regressions and flaky tests, traces each to its root cause, writes the smallest diff and checks that the suite passes.'],
  ['Triage by Kai', 'No prose to parse: Kai returns a probability for each action, patch, roll back, retry or approve.'],
  ['Models picked by Enso', 'Each attempt runs on enso-auto, enso-flash or enso-ultra, trading cost against accuracy.'],
  ['Runs in your pipeline', 'In GitHub Actions, GitLab CI or a pre-push hook in your terminal.'],
];
/* What Hanzo says Kata supports, and the sentence on this page that says it. Picking an option lights it there. */
const FIT = [
  { name: 'Test runner', opts: ['pytest', 'vitest', 'jest', 'cargo test', 'go test', 'TAP or JUnit XML'], says: 'Kata natively supports pytest, vitest, jest, cargo test, go test, and custom test runners emitting standard TAP or JUnit XML output.' },
  { name: 'CI', opts: ['GitHub Actions', 'GitLab CI', 'pre-push hook'], says: 'In GitHub Actions, GitLab CI or a pre-push hook in your terminal.' },
  { name: 'Language', opts: ['Python', 'TypeScript', 'Go', 'Rust', 'cURL'], says: 'runnable examples in Python, TypeScript, Go, Rust, and cURL' },
];

function Lit({ text, word }) {
  if (!word) return <span>{text}</span>;
  const i = text.indexOf(word);
  if (i < 0) return <span>{text}</span>;
  return <span>{text.slice(0, i)}<mark>{word}</mark>{text.slice(i + word.length)}</span>;
}

function Fit() {
  const [pick, setPick] = useState([null, null, null]);
  const set = (g, o) => setPick((p) => p.map((v, k) => (k === g ? (v === o ? null : o) : v)));
  return (
    <div className="xkt-fit">
      {FIT.map((g, gi) => (
        <div className="xkt-fit-row" key={g.name}>
          <div role="radiogroup" aria-label={g.name} className="xkt-chips">
            {g.opts.map((o) => <button key={o} type="button" role="radio" aria-checked={pick[gi] === o} onClick={() => set(gi, o)}>{o}</button>)}
          </div>
          <p className={'xkt-says' + (pick[gi] ? ' on' : '')} aria-live="polite">
            <span className="xkt-says-t" aria-hidden="true">{pick[gi] ? <Tick key={pick[gi]} size={22} /> : null}</span>
            <Lit text={g.says} word={pick[gi]} />
          </p>
        </div>
      ))}
    </div>
  );
}

function Capabilities() {
  return (
    <section className="a2-sec xkt-caps" id="features" aria-labelledby="xkt-caps-h">
      <div className="a2-wrap a2-grid">
        <div className="xkt-caps-head">
          <p className="a2-kick">Capabilities</p>
          <A2Lines id="xkt-caps-h" className="a2-headline" lines={['Built for', 'the pipeline.']} />
          <p className="a2-lede">Test repair, triage and the choice of model, in the CI you already run.</p>
        </div>
        <ul className="xkt-report">
          {CAPS.map(([t, d], i) => (
            <li key={t}>
              <Tick delay={0.1 + i * 0.1} size={24} />
              <span><h3 className="a2-title">{t}</h3><span>{d}</span></span>
            </li>
          ))}
        </ul>
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
    <section className="a2-sec xkt-read" aria-labelledby="xkt-read-h">
      <div className="a2-wrap">
        <div className="xkt-read-head">
          <p className="a2-kick">Read</p>
          <h2 id="xkt-read-h" className="a2-headline">The agent, the loop, the documentation.</h2>
          <p className="a2-body">Explore the source code, recipes, and documentation.</p>
        </div>
        <div className="xkt-cols">
          {READ.map(([h, items]) => (
            <div key={h} className="xkt-col">
              <h3 className="xkt-col-h">{h}</h3>
              <ul className="xkt-links">
                {items.map(([to, t, d]) => (
                  <li key={t}>
                    {/* site pages open by Morph: the title you click becomes the next page's hero */}
                    <A to={to} className="xkt-link"><span><b {...(to.startsWith('/') ? { 'data-morph': '' } : {})}>{t}</b>{d && <span>{d}</span>}</span><i aria-hidden="true">→</i></A>
                  </li>
                ))}
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
        </div>
        <div className="xkt-qa-list"><A2Faq items={QA} /></div>
      </div>
    </section>
  );
}

export default function Kata() {
  usePhoneAsk();
  return (
    <main className="a2 xkt">
      <Hero />
      <A2Paste name="Kata" text="Read https://hanzo.ai/skill.md and use Hanzo Kata in my project. Start with: hanzo kata run" />
      <TheLoop />
      <Wipe />
      <Capabilities />
      <Read />
      <Questions />
      <Band title={WORDS.join(' ')} action="Get API key" to={KEYS} />
    </main>
  );
}
