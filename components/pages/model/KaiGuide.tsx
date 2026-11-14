'use client';
/* How to use Kai (/kai/guide). Page type: Developer (MASTER 4.6): a live conversation with Kai as the hero, Copy beside
   the key ask.
   Order: the hero beside the conversation; the three question types as a spec sheet; the code in three tabs on a Quiet
   room (kit Tabs + CodeBlock, each block capped at 12 lines with Show all) beside the shape of one call; the benchmark
   as the proof strip; the limits one at a time beside a light request checker; the recipes as a stage in the one black
   room; the move from Jev as a light diff; a closing band in the page's words.
   Signature (live-chat): Kai answers on screen. The guide's own example questions sit under the conversation as
   choices (the three of the curl request, then the Python and TypeScript examples'); pick one and it is asked with its
   state, type and criteria, and Kai's answer streams back in its documented response shape: the question's name, the
   fields its type returns, every value Hanzo does not print an em dash, usage output_tokens 0, then the guide's own line
   on what that type returns. With nothing picked it asks the request's three questions once and rests; a pause / replay
   control sits in its bar; the thread and the choices keep one size, so nothing on the page moves. JS off and reduced
   motion: the three answers are there, settled.
   Entrances (motion map rule 7), one per main section in order: ripple (types), drop-in (call), tilt-3d-hover (limits:
   the checker tile then leans toward the pointer), line-draw (the black room's outline draws, then it fills),
   cover-slide (the Jev section slides up over the room). No other section reveal: the h1 cut-in is the page's arrival.
   Beyond: the request checker. Pick a limit and the checker loads that case; switch the model, snap the state ruler to
   the guide's four points (1,024 · 3,982 · 32,768 · past 32,768) and the questions to up to 100 or 101, and read the
   guide's own verdict. No figure is worked out: the price line is the guide's $0.021 and Jev's $0.042.
   V2: 8.5/10 Motion map: live-chat — the self-typing terminal became a conversation (six of the guide's own questions to pick, Kai's answer streaming in its documented shape, em dashes for unprinted values); sticky call and checker columns removed; proof moved above the limits; five page-local entrances replace the diff, bar and closing line-mask reveals. */
// Persona: Developer wiring Kai decisions into a pipeline (MASTER 1: developers).
// Goal: copy the request, then get a key and send a first POST /v1/decisions.
// CTA: Get an API key (Cta solid, data-cta kai-guide.hero, data-thumb), repeated at the close (kai-guide.close).
// Metric: api_key_created
// Signature: live-chat — pick one of the guide's own questions and Kai's answer streams back in its documented response shape
// Beyond: the request checker, driven by the limit you pick or by your own choices, in the guide's own figures
import { Children, Fragment, cloneElement, isValidElement, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { motion, useInView, useReducedMotion } from 'motion/react';
import type { CSSProperties, KeyboardEvent, ReactNode, RefObject } from 'react';
import { Copy } from '../../ui';
import { A, Cta, Tabs, TabPanel, CodeBlock } from '../../kit';
import { check, TRAINED, MAXSTATE, MAXQ } from './kaiLimits';
import { arrows } from './live';
import { useRipple, useDropIn, useTiltIn, useLineDraw, useCoverSlide, Outline } from './kaiEntrances';
import usePhoneAsk from '../usePhoneAsk';
import './KaiGuide.css';

/* W: every loose run of text in a mixed line sits in its own <span>, and the text inside an inline code, b or mark
   sits in a <span> too (no visual change). Hanzo's copy check (scripts/copycheck.mjs) reads only leaf span, p, li…
   elements, so a sentence split around <code> must still arrive as its own leaves, word for word. */
const leafy = (c: ReactNode): ReactNode => {
  if (typeof c === 'string') return c ? <span>{c}</span> : c;
  if (!isValidElement<{ children?: ReactNode }>(c)) return c;
  if (c.type === Fragment) return Children.map(c.props.children, leafy);
  if (typeof c.type === 'string' && ['code', 'b', 'mark', 'em'].includes(c.type) && typeof c.props.children === 'string') return cloneElement(c, {}, <span>{c.props.children}</span>);
  return c;
};
const W = ({ children }: { children?: ReactNode }) => <>{Children.map(children, leafy)}</>;

// the deck's motion tokens (MASTER 3.1): durations in seconds, one emphasis curve, no springs
const T = { press: 0.09, fast: 0.15, base: 0.3, slow: 0.4, slower: 0.5, line: 0.7 };
const EMPH: [number, number, number, number] = [0.16, 1, 0.3, 1];

const CURL = `curl -sS --fail-with-body https://api.hanzo.ai/v1/decisions \\
  -H "Authorization: Bearer $HANZO_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "kai",
    "state": "Customer email: Cancel my plan immediately. Your service was down during our product launch.",
    "questions": {
      "department": {
        "type": "choice",
        "instructions": "Route ticket to appropriate team",
        "criteria": {
          "executive_escalations": "high-value customer cancellation threats",
          "support": "general technical inquiries",
          "billing": "standard invoice updates"
        }
      },
      "urgency": {
        "type": "score",
        "instructions": "Rate ticket urgency",
        "criteria": ["low", "normal", "high", "critical"]
      },
      "churn_risk": {
        "type": "noul",
        "instructions": "Is this account at risk of churning?"
      }
    }
  }'`;
const PY = `# pip install hanzoai
import os

from hanzoai.cloud import ApiClient, Configuration
from hanzoai.cloud.api import AiApi
from hanzoai.cloud.models.ai_decisions_request import AiDecisionsRequest

ai = AiApi(ApiClient(Configuration(access_token=os.environ["HANZO_API_KEY"])))
decision = ai.post_decisions(AiDecisionsRequest.from_dict({
    "model": "kai",
    "state": {"ticket_id": 4821, "text": "Can I get an extension on my payment due date?"},
    "questions": {
        "team": {
            "type": "choice",
            "instructions": "Which team handles this?",
            "criteria": {"billing": "invoices and payments", "support": "technical issues"},
        },
        "is_churn_risk": {"type": "noul", "instructions": "Is the user churning?"},
    },
}))

print(decision.answers["team"].choice, decision.answers["team"].probabilities)
print(decision.answers["is_churn_risk"].noul)`;
const TS = `// npm install hanzoai
import { AiApi, Configuration } from 'hanzoai'

const ai = new AiApi(new Configuration({ accessToken: process.env.HANZO_API_KEY }))
const { data: decision } = await ai.postDecisions({
  aiDecisionsRequest: {
    model: 'kai',
    state: { pull_request: 104, diff_lines: 480, files: ['auth.ts', 'token.go'] },
    questions: {
      risk: {
        type: 'score',
        instructions: 'Rate security risk of code change',
        criteria: ['low: documentation or cosmetic', 'medium: internal logic', 'high: security or auth paths'],
      },
    },
  },
})

console.log(decision.answers.risk.score, decision.answers.risk.probabilities)`;
// tab names in the guide's own words: its first command and the two install lines its code opens with
const CODES = [['curl', CURL], ['pip install hanzoai', PY], ['npm install hanzoai', TS]];

const TYPES: [name: string, send: ReactNode, get: ReactNode][] = [
  ['choice', <><b>Send</b> <code>criteria</code>: option → description, or a list of options.</>, <><b>Get</b> <code>choice</code>, <code>probabilities</code> (one per option, summing to 1), <code>confidence</code>.</>],
  ['score', <><b>Send</b> <code>criteria</code>: the levels, lowest first.</>, <><b>Get</b> <code>score</code> (the expected level index), <code>legend</code>, <code>probabilities</code> by level index.</>],
  ['noul', <><b>Send</b> <code>instructions</code>: a yes/no question.</>, <><b>Get</b> <code>noul</code>: P(true). kai-1.3, the default, does not read a noul’s <code>criteria</code>.</>],
];

/* the conversation's questions: every one is a question this page's own code asks, with that code's state, type and
   criteria (option names only). Kai's answer is the documented shape for that type: field names from the guide, each
   value it does not print an em dash; usage output_tokens is the guide's 0. */
const S_TICKET = 'Customer email: Cancel my plan immediately. Your service was down during our product launch.';
const S_PAY = '{"ticket_id": 4821, "text": "Can I get an extension on my payment due date?"}';
const S_PR = "{ pull_request: 104, diff_lines: 480, files: ['auth.ts', 'token.go'] }";
type Ask = [name: string, type: number, question: string, state: string, criteria?: string[]];
const ASKS: Ask[] = [
  ['churn_risk', 2, 'Is this account at risk of churning?', S_TICKET],
  ['urgency', 1, 'Rate ticket urgency', S_TICKET, ['low', 'normal', 'high', 'critical']],
  ['department', 0, 'Route ticket to appropriate team', S_TICKET, ['executive_escalations', 'support', 'billing']],
  ['team', 0, 'Which team handles this?', S_PAY, ['billing', 'support']],
  ['is_churn_risk', 2, 'Is the user churning?', S_PAY],
  ['risk', 1, 'Rate security risk of code change', S_PR, ['low: documentation or cosmetic', 'medium: internal logic', 'high: security or auth paths']],
];
const FIELDS = [['choice', 'probabilities', 'confidence'], ['score', 'legend', 'probabilities'], ['noul']];
const REPLY = ASKS.map(([n, t]) => {
  const f = FIELDS[t];
  const body = f.length === 1 ? `  "${n}": { "${f[0]}": — }` : `  "${n}": {\n${f.map((x) => `    "${x}": —`).join(',\n')}\n  }`;
  return `"answers": {\n${body}\n},\n"usage": { "output_tokens": 0 }`;
});
const SEED = [0, 1, 2]; // the curl request's three questions: asked by themselves once, and the settled view
const DONE = '0 output tokens';
const KEEP = 6; // the thread holds the last six exchanges

// the streamed text, its em dashes set a step back (the values Hanzo does not print)
const dash = (s: string) => s.split('—').flatMap((p, i) => (i ? [<i key={i}>—</i>, p] : [p]));

interface Exchange { a: number; n: number; id: number }
function Chat() {
  const box = useRef<HTMLElement>(null), scr = useRef<HTMLDivElement>(null), uid = useRef(SEED.length), still = useRef(false);
  const seen = useInView(box, { amount: 0.35 });
  const [live, setLive] = useState(false);
  const [items, setItems] = useState<Exchange[]>(() => SEED.map((a, id) => ({ a, n: Infinity, id })));
  const [auto, setAuto] = useState(SEED.length); // the next question the conversation asks by itself
  const [mine, setMine] = useState(false); // the visitor has picked a question
  const [hold, setHold] = useState(false);
  const last = items[items.length - 1];
  const running = !!last && last.n < REPLY[last.a].length;
  const ask = (a: number) => setItems((xs) => [...xs.map((x) => (x.n === Infinity ? x : { ...x, n: Infinity })), { a, n: still.current ? Infinity : 0, id: uid.current++ }].slice(-KEEP));
  // JS on and motion allowed: start empty and ask by itself; reduced motion keeps the settled three
  useEffect(() => {
    still.current = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!still.current) { setItems([]); setAuto(0); }
    setLive(true);
  }, []);
  useEffect(() => {
    if (!live || hold || !seen) return;
    if (running) {
      const t = setTimeout(() => setItems((xs) => xs.map((x, i) => (i === xs.length - 1 ? { ...x, n: x.n + 2 + ((Math.random() * 4) | 0) } : x))), last.n === 0 ? 560 : 26);
      return () => clearTimeout(t);
    }
    if (!mine && auto < SEED.length) {
      const t = setTimeout(() => { ask(SEED[auto]); setAuto(auto + 1); }, items.length ? 1500 : 500);
      return () => clearTimeout(t);
    }
  }, [live, hold, seen, items, mine, auto]); // eslint-disable-line react-hooks/exhaustive-deps
  // keep the newest line in view inside the thread (the thread scrolls; the page does not)
  useLayoutEffect(() => {
    const sc = scr.current;
    if (!live || !sc) return;
    sc.scrollTo({ top: sc.scrollHeight, behavior: last && last.n === 0 ? 'smooth' : 'auto' });
  }, [items, live]); // eslint-disable-line react-hooks/exhaustive-deps
  const pick = (a: number) => { setMine(true); setHold(false); ask(a); };
  const replay = () => { setItems([]); setMine(false); setHold(false); setAuto(still.current ? SEED.length : 0); if (still.current) setItems(SEED.map((a) => ({ a, n: Infinity, id: uid.current++ }))); };
  const done = !running && (mine || auto >= SEED.length);
  const label = done ? 'Replay' : hold ? 'Play' : 'Pause';
  return (
    <figure className="kg-sess" ref={box} data-live={live || undefined} data-phase={done ? 'done' : 'run'}>
      <div className="kg-sess-bar">
        <b>POST /v1/decisions</b>
        <span className="kg-sess-st"><i aria-hidden="true" /><span>{done ? DONE : '—'}</span></span>
        <button type="button" className="kg-sess-btn" aria-label={label} aria-pressed={!done ? hold : undefined} onClick={() => (done ? replay() : setHold((h) => !h))}>
          {done
            ? <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3 8a5 5 0 1 0 1.6-3.7M3 2.5v2.8h2.8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            : hold
              ? <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M5 3.5v9l7.5-4.5z" fill="currentColor" /></svg>
              : <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M5.5 3.5v9M10.5 3.5v9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>}
        </button>
        <span className="kg-sess-copy"><Copy text={CURL} /></span>
      </div>
      <div className="kg-sess-scr" ref={scr} tabIndex={0} data-lenis-prevent role="log" aria-label="POST /v1/decisions" aria-busy={running}>
        <div className="kg-thread">
          {items.map(({ a, n, id }) => {
            const [name, t, q, st, crit] = ASKS[a];
            const end = n >= REPLY[a].length;
            return (
              <div key={id} className="kg-ex">
                <div className="kg-m kg-m-q">
                  <span className="kg-m-h"><code>{name}</code><span>{TYPES[t][0]}</span></span>
                  <p className="kg-m-text">{q}</p>
                  {crit && <span className="kg-m-c">{crit.map((c) => <code key={c}>{c.split(':')[0]}</code>)}</span>}
                  <span className="kg-m-s"><span>state</span> {st}</span>
                </div>
                <div className="kg-m kg-m-a" data-run={!end || undefined}>
                  <span className="kg-m-h"><code>kai</code></span>
                  <pre><code>{dash(REPLY[a].slice(0, n))}</code></pre>
                  <p className="kg-m-g"><W>{TYPES[t][2]}</W></p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="kg-asks" role="group" aria-label="Questions">
        {ASKS.map(([name, , q], i) => (
          <button key={name} type="button" className="kg-ask" data-on={(last && last.a === i) || undefined} onClick={() => pick(i)}><span>{q}</span></button>
        ))}
      </div>
    </figure>
  );
}

/* the three types as a spec sheet; each glyph draws its type, then the three take turns showing it again (one mover at a
   time, a 9 s round) while the sheet is on screen, paused off screen and under reduced motion. Entrance: ripple */
function Types() {
  const box = useRef<HTMLElement>(null);
  const seen = useInView(box, { amount: 0.2 });
  useRipple(box);
  return (
    <section className="kg-types kg-sec" ref={box} data-off={!seen || undefined} aria-labelledby="kg-q">
      <i className="kg-ring" aria-hidden="true" />
      <div className="kg-wrap">
        <div className="kg-head">
          <div><h2 id="kg-q" className="kg-h2">Three question types</h2></div>
          <div className="kg-side"><p className="kg-kick">Questions</p><p className="kg-lede-s">Name each question; its answer comes back under the same name.</p></div>
        </div>
        <ol className="kg-rows">
          {TYPES.map(([n, send, get], i) => (
            <li key={n}>
              <div className="kg-row-n"><span className={'kg-glyph g' + i} aria-hidden="true"><i /><i /><i /><i /></span><h3>{n}</h3></div>
              <p><W>{send}</W></p>
              <p><W>{get}</W></p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* the shape of one call, drawn from the request's own names: each question goes in under its name and its answer comes
   back under the same name, typed. Pointing at a row lights its line (a figure, aria-hidden: the code beside it says it) */
const SHAPE = [['department', 'choice'], ['urgency', 'score'], ['churn_risk', 'noul']];
function Shape() {
  return (
    <div className="kg-shape" aria-hidden="true">
      <span className="kg-shape-h">questions</span><span /><span className="kg-shape-h">answers</span>
      {SHAPE.map(([n, t]) => (
        <div key={n} className="kg-shape-r">
          <code>{n}</code>
          <span className="kg-shape-w"><i /><em>{t}</em></span>
          <code>{n}</code>
        </div>
      ))}
    </div>
  );
}

/* the language is shared by the hash (#curl, #python, #typescript) and remembered on this device; each block opens
   capped at 12 lines over a fade, with Show all under it (the whole text is in the HTML and Copy copies all of it) */
const LANG = ['curl', 'python', 'typescript'];
const CAP = 12;
function CallIt() {
  const [k, setK] = useState(1);
  const [all, setAll] = useState([false, false, false]);
  const box = useRef<HTMLDivElement>(null);
  // the kit CodeBlock marks itself a dark room; here it sits on a white tile, so it is marked light before the header
  // starts watching for dark rooms (layout effects run first), else the header turns dark over light code
  // (docs/build-notes/requests/kai-guide.md asks for a room prop on CodeBlock)
  useLayoutEffect(() => { box.current?.querySelectorAll('.x-codeblock[data-room]').forEach((el) => el.setAttribute('data-room', 'light')); }, []);
  useEffect(() => {
    const read = () => {
      let i = LANG.indexOf(location.hash.slice(1));
      if (i < 0) { try { i = LANG.indexOf(localStorage.getItem('kg-lang') ?? ''); } catch { i = -1; } }
      if (i >= 0) setK(i);
    };
    read(); addEventListener('hashchange', read);
    return () => removeEventListener('hashchange', read);
  }, []);
  const choose = (i: number) => {
    setK(i);
    try { localStorage.setItem('kg-lang', LANG[i]); } catch { /* storage off: the choice lasts this visit */ }
    history.replaceState(history.state, '', '#' + LANG[i]);
  };
  const more = (i: number) => {
    setAll((a) => a.map((v, j) => v || j === i));
    requestAnimationFrame(() => box.current?.querySelector<HTMLElement>(`#kg-lang-panel-${i} pre`)?.focus({ preventScroll: true }));
  };
  return (
    <div className="kg-code" ref={box}>
      <Tabs id="kg-lang" label="Language" tabs={CODES.map(([l]) => l)} value={k} onChange={choose} />
      {CODES.map(([l, c], i) => {
        const long = c.split('\n').length > CAP;
        return (
          <TabPanel key={l} id="kg-lang" i={i} value={k} className="kg-code-p">
            <div className="kg-cap" data-cap={(long && !all[i]) || undefined} style={{ '--cap': CAP } as CSSProperties}>
              <CodeBlock code={c} label={l} />
              {long && !all[i] && <button type="button" className="kg-more" aria-controls={`kg-lang-panel-${i}`} aria-expanded="false" onClick={() => more(i)}><span>Show all</span><svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="m4 6 4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></button>}
            </div>
          </TabPanel>
        );
      })}
    </div>
  );
}

/* call it: the words beside the code (no sticky column). Entrance: drop-in */
function Call() {
  const box = useRef<HTMLElement>(null);
  useDropIn(box);
  return (
    <section className="kg-call kg-sec" ref={box} aria-labelledby="kg-c">
      <div className="kg-wrap kg-call-g">
        <div className="kg-call-t">
          <h2 id="kg-c" className="kg-h2">One request, three questions</h2>
          <p className="kg-kick kg-sub">Call it</p>
          <p className="kg-lede-s">Every response also carries id, model, usage (output_tokens is 0), routing (the checkpoint that answered: kai-1.3 for the model id kai), state_hash and latency_ms.</p>
          <Shape />
        </div>
        <CallIt />
      </div>
    </section>
  );
}

// the checker only ever shows the guide's own figures: the state ruler snaps to the four points the guide names
// (1,024 trained, the 3,982-token example, 32,768, past 32,768) and the questions are up to 100 or 101; no figure is
// worked out from another, so the old per-request price readout is gone and Price lights the guide's own price line
const STOPS: [number, string][] = [[1024, '1,024'], [3982, '3,982'], [32768, '32,768'], [65536, 'Past 32,768']];
const QS: [number, string][] = [[100, 'Up to 100'], [101, '101']];
type Scene = [model: number, state: number, questions: number];
const SCENES: Scene[] = [[0, 0, 0], [0, 1, 0], [1, 1, 0], [1, 3, 0], [0, 0, 1]]; // [model, state stop, questions stop]
// the five answers kaiLimits can give, so the verdict box always holds the tallest one
const OUTS = [check(0, 1024, 101), check(0, 65536, 100), check(0, 3982, 100), check(0, 1024, 100), check(1, 1024, 100)];
const WALK = [2, 3, 4, 0, 1]; // the order the checker plays the five cases, ending where it began
const SCENE_ROW = [3, 2, 0, 2, 1]; // which limit each checker case illustrates (Model, Questions, State, Time, Price)
const ROW_SCENE = [2, 4, 1, 0, 0];
const LO = Math.log2(256), HI = Math.log2(65536);
const tokPos = (t: number) => (Math.log2(Math.max(256, t)) - LO) / (HI - LO);
const nearest = (p: number) => STOPS.reduce((best, [t], i) => (Math.abs(tokPos(t) - p) < Math.abs(tokPos(STOPS[best][0]) - p) ? i : best), 0);

// a ruler's thumb position as one fixed string, the same on the server and in the browser (no hydration drift).
// The range input carries suppressHydrationWarning: a screenshot taken before hydration writes an inline caret-color on
// every input, and that one attribute is all React would otherwise flag (the input itself renders no style).
const run = (p: number) => ({ transform: `translateX(${(Math.round(p * 10000) / 100).toFixed(2)}%)` });

interface CheckerProps { s: number; mine: Scene | null; setMine: (v: Scene | null) => void; price: boolean; tile: RefObject<HTMLDivElement | null> }
function Checker({ s, mine, setMine, price, tile }: CheckerProps) {
  const [m, si, qi] = mine || SCENES[s];
  const tok = STOPS[si][0];
  const r = check(m, tok, QS[qi][0]);
  const set = (i: number, v: number) => { const n: Scene = [...(mine || SCENES[s])]; n[i] = v; setMine(n); };
  const key = (e: KeyboardEvent<HTMLInputElement>) => {
    const d = ({ ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1 } as Record<string, number | undefined>)[e.key];
    const to = e.key === 'Home' ? 0 : e.key === 'End' ? STOPS.length - 1 : d !== undefined ? Math.min(STOPS.length - 1, Math.max(0, si + d)) : null;
    if (to === null) return;
    e.preventDefault(); set(1, to);
  };
  return (
    <div className="kg-check" ref={tile}>
      <div className="kg-check-bar"><b>POST /v1/decisions</b></div>
      <div className="kg-ck-body">
        <div className="kg-models" role="radiogroup" aria-label="Model" onKeyDown={arrows}>
          {['kai', 'kai-1.4'].map((id, i) => <button key={id} type="button" role="radio" aria-checked={m === i} tabIndex={m === i ? 0 : -1} className="kg-chip" onClick={() => set(0, i)}>{id}</button>)}
        </div>
        <label className="kg-ruler">
          <span className="kg-r-h"><span>State</span><b>{STOPS[si][1]}</b></span>
          <span className="kg-track">
            <i className="kg-zone z1" style={{ transform: `scaleX(${tokPos(TRAINED)})` }} />
            <i className="kg-zone z3" style={{ left: tokPos(MAXSTATE) * 100 + '%' }} />
            <span className="kg-mk" style={{ left: tokPos(TRAINED) * 100 + '%' }}>1,024</span>
            <span className="kg-mk" style={{ left: tokPos(MAXSTATE) * 100 + '%' }}>32,768</span>
            <span className="kg-run" style={run(tokPos(tok))}><i /></span>
            <input type="range" min="0" max="1000" value={Math.round(tokPos(tok) * 1000)} aria-valuetext={STOPS[si][1]} onChange={(e) => set(1, nearest(+e.target.value / 1000))} onKeyDown={key} aria-label="State" suppressHydrationWarning />
          </span>
        </label>
        <div className="kg-ruler">
          <span className="kg-r-h"><span>Questions</span></span>
          <div className="kg-models" role="radiogroup" aria-label="Questions" onKeyDown={arrows}>
            {QS.map(([, l], i) => <button key={l} type="button" role="radio" aria-checked={qi === i} tabIndex={qi === i ? 0 : -1} className="kg-chip" onClick={() => set(2, i)}>{l}</button>)}
          </div>
        </div>
        <div className="kg-verdict" data-bad={r.code !== 200 ? '' : undefined}>
          <motion.b key={r.big} initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: T.slow, ease: EMPH }}>{r.big}</motion.b>
          <div className="kg-v-stack" aria-live={mine ? 'polite' : 'off'}>
            {OUTS.map((o) => (
              <div key={o.flag} data-on={o.flag === r.flag || undefined} aria-hidden={o.flag !== r.flag || undefined}>
                <code>{o.tag}</code>
                <p>{o.why}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="kg-cost" data-on={price || undefined}>
          <span>Price</span>
          <b>$0.021</b>
          <span>per million input tokens; output is free. Jev costs $0.042.</span>
        </p>
      </div>
    </div>
  );
}

const LIMITS: [name: string, text: ReactNode][] = [
  ['Model', <>The model id <code>kai</code> answers from kai-1.3, the default. Ask for <code>kai-1.4</code> by id for the unified version: one encoder and one head, trained on long states. Ask for <code>kai-1.5</code> by id for the agentic preview: whether a tool fits a request, and whether to call one at all.</>],
  ['Questions', <>Up to 100 a request; 101 is refused with 422.</>],
  ['State', <>kai-1.3, the default, was trained on 1,024 tokens of state beside each question. Up to 32,768 is answered with <code>routing.extrapolated: true</code> and is unreliable: a fact at the end of a 3,982-token state read 0.507. <code>kai-1.4</code> was trained on long states and marks no read up to 32,768 extrapolated. Past 32,768 the answer is 422 <code>state_too_long</code>.</>],
  ['Time', <>One yes/no question takes &lt;1 ms of server time at p50 in production on GPU (0.27 ms cached in process). Every response reports its own <code>latency_ms</code>.</>],
  ['Price', <>$0.021 per million input tokens; output is free. Jev costs $0.042.</>],
];

/* the limits one at a time: the five mono labels sit in one row and only the open one's sentence shows beneath them;
   the other four sentences stay in the HTML (hidden="until-found", so find-in-page and #limit-<name> open them). The
   open limit follows the checker as it walks Hanzo's cases, and a click on a label opens it and loads its case, so the
   two move together. The sentence slot keeps the height of the tallest sentence, so nothing moves as they change.
   Entrance: tilt-3d-hover (the checker tile arrives tipped back and levels, then leans toward the pointer) */
const slug = (k: string) => 'limit-' + k.toLowerCase();
function Limits() {
  const box = useRef<HTMLElement>(null), list = useRef<HTMLDListElement>(null), tile = useRef<HTMLDivElement>(null);
  const seen = useInView(box, { amount: 0.3 });
  const calm = useReducedMotion();
  useTiltIn(box, tile);
  const [s, setS] = useState(1);
  const [n, setN] = useState(0); // steps played: the checker walks Hanzo's cases once, then rests on the extrapolated one
  const [mine, setMine] = useState<Scene | null>(null); // [model, tokens, questions] once the visitor takes over
  const [row, setRow] = useState<number | null>(null);
  const [open, setOpen] = useState(SCENE_ROW[1]);
  useEffect(() => {
    if (!seen || mine || calm || n >= WALK.length) return;
    const t = setTimeout(() => { setS(WALK[n]); setN(n + 1); }, 2600);
    return () => clearTimeout(t);
  }, [seen, mine, calm, n]);
  const lit = row !== null ? row : mine ? null : SCENE_ROW[s];
  // the open limit follows the checker's walk; the sentence slot keeps one height, so nothing moves when it changes
  useEffect(() => { if (lit !== null) setOpen(lit); }, [lit]);
  const pick = (i: number) => { setOpen(i); setRow(i); setMine([...SCENES[ROW_SCENE[i]]]); };
  // React writes `hidden` as a plain boolean, so the until-found value is set here, before paint; until then a .js rule
  // folds the same four sentences, and with JS off all five stay open
  useLayoutEffect(() => {
    list.current?.querySelectorAll('dd').forEach((d, i) => (i === open ? d.removeAttribute('hidden') : d.setAttribute('hidden', 'until-found')));
  }, [open]);
  useEffect(() => {
    const dl = list.current;
    if (!dl) return undefined;
    const dds = [...dl.querySelectorAll('dd')];
    // find-in-page or a #limit-<name> link reveals a folded sentence: open that row with it
    const found = dds.map((d, i) => { const f = () => flushSync(() => pick(i)); d.addEventListener('beforematch', f); return f; });
    const hash = () => { const i = LIMITS.findIndex(([k]) => '#' + slug(k) === location.hash); if (i >= 0) pick(i); };
    hash(); addEventListener('hashchange', hash);
    // reserve the tallest open state, so a sentence opening or folding never moves the page
    const fit = () => {
      dl.style.minHeight = '';
      const was = dds.map((d) => d.getAttribute('hidden'));
      let max = 0;
      dds.forEach((_, i) => { dds.forEach((d, j) => (j === i ? d.removeAttribute('hidden') : d.setAttribute('hidden', 'until-found'))); max = Math.max(max, dl.offsetHeight); });
      dds.forEach((d, i) => (was[i] === null ? d.removeAttribute('hidden') : d.setAttribute('hidden', was[i])));
      dl.style.minHeight = max + 'px';
    };
    fit(); document.fonts?.ready.then(fit); addEventListener('resize', fit);
    return () => { dds.forEach((d, i) => d.removeEventListener('beforematch', found[i])); removeEventListener('hashchange', hash); removeEventListener('resize', fit); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <section className="kg-limits kg-sec" ref={box} aria-labelledby="kg-l">
      <div className="kg-wrap kg-limits-g">
        <div className="kg-limits-t">
          <h2 id="kg-l" className="kg-h2">What a request may hold</h2>
          <p className="kg-kick kg-sub">Limits</p>
          <dl className="kg-dl" ref={list}>
            {LIMITS.map(([k, v], i) => (
              <div key={k} id={slug(k)} data-on={open === i || undefined}>
                <dt><button type="button" aria-expanded={open === i} aria-controls={slug(k) + '-d'} onClick={() => pick(i)}><span>{k}</span><svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></button></dt>
                <dd id={slug(k) + '-d'}><W>{v}</W></dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="kg-limits-c">
          <Checker s={s} mine={mine} price={open === 4} tile={tile} setMine={(n) => { setRow(null); setMine(n); }} />
        </div>
      </div>
    </section>
  );
}

const RECIPES = [
  ['recipes::retail', 'Shelf inventory triage, return fraud checks, and corporate pricing safety guardrails.'],
  ['recipes::industrial', 'Multi-criteria powertrain trade studies and telemetry equipment readiness gating.'],
  ['recipes::routing', 'Confidence margin gates that stand on high-certainty decisions and escalate low-confidence queries to Zen.'],
  ['recipes::zen', 'OpenAI-compatible request builders and SSE stream accumulators for reasoning thought tokens.'],
  ['recipes::kata', 'Autonomous test-and-repair agent state machine gating code patch generation vs human review.'],
  ['recipes::gen', 'Conversational assistant harness managing multi-turn history and Model Context Protocol (MCP) dispatch.'],
];

/* the black room's object: one recipe on the stage, its name large and its line beneath, the other five small and grey
   beside it. A hairline fills under the stage and hands on to the next recipe when it is full (6 s); pointing at or
   focusing a name brings it on stage, the pointer on the room holds the fill, and the bar's own control pauses it.
   Off screen and under reduced motion the fill does not run, so nothing changes by itself. */
function Recipes() {
  const box = useRef<HTMLDivElement>(null);
  const seen = useInView(box, { amount: 0.35 });
  const [k, setK] = useState(0);
  const [hold, setHold] = useState(false);
  const next = () => setK((x) => (x + 1) % RECIPES.length);
  return (
    <div className="kg-rx" ref={box} data-off={!seen || undefined} data-hold={hold || undefined}>
      <div className="kg-rx-stage">
        <div className="kg-rx-top">
          <span className="kg-rx-ix" aria-hidden="true">{RECIPES.map(([n], i) => <i key={n} data-on={i === k || undefined} data-past={i < k || undefined} />)}</span>
          <span className="kg-rx-bar" aria-hidden="true"><i key={k} onAnimationEnd={next} /></span>
          <button type="button" className="kg-rx-btn" aria-label={hold ? 'Play' : 'Pause'} aria-pressed={hold} onClick={() => setHold((h) => !h)}>
            {hold
              ? <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M5 3.5v9l7.5-4.5z" fill="currentColor" /></svg>
              : <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M5.5 3.5v9M10.5 3.5v9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>}
          </button>
        </div>
        <div className="kg-rx-stack">
          {RECIPES.map(([n, d], i) => (
            <div key={n} className="kg-rx-it" data-on={i === k || undefined} data-pos={i < k ? 'up' : i > k ? 'down' : undefined} aria-hidden={i !== k || undefined}>
              <span className="kg-rx-m"><code><span>{n}</span></code></span>
              <p>{d}</p>
            </div>
          ))}
        </div>
      </div>
      <ul className="kg-rec">
        {RECIPES.map(([n], i) => (
          <li key={n} data-on={i === k || undefined}>
            <button type="button" aria-pressed={i === k} onPointerEnter={(e) => { if (e.pointerType === 'mouse') setK(i); }} onFocus={() => setK(i)} onClick={() => setK(i)}><code><span>{n}</span></code></button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* the one black room. Entrance: line-draw (its outline strokes itself, then the black fills in behind the words) */
function Room() {
  const box = useRef<HTMLElement>(null);
  useLineDraw(box);
  return (
    <section className="kg-recipes kg-sec" ref={box} aria-labelledby="kg-r">
      <div className="kg-wrap kg-room" data-room="dark">
        <Outline />
        <div className="kg-room-in">
          <div className="kg-head">
            <div><h2 id="kg-r" className="kg-h2">Composable Decision Recipes</h2></div>
            <div className="kg-side"><p className="kg-kick">Recipes &amp; Blueprints</p><p className="kg-lede-s">Modular Rust structs and TypeScript workflows that sit inside your pipelines: retail triage, industrial diagnostics, confidence routing, and agent loops.</p></div>
          </div>
          <Recipes />
          <div className="kg-acts">
            <Cta to="https://docs.hanzo.ai/docs/guides/cookbook/recipes" kind="quiet" id="kai-guide.recipes">Read the Recipes Guide</Cta>
            <Cta to="https://docs.hanzo.ai/docs/guides/cookbook" kind="link" id="kai-guide.recipes-cookbook">View All Cookbook Pipelines</Cta>
            <A to="https://github.com/hanzoai/kai/tree/main/recipes" className="kg-gh" data-cta="kai-guide.recipes-github">Kai recipes on GitHub ↗</A>
          </div>
        </div>
      </div>
    </section>
  );
}

/* the move from Jev as one diff (static: the section's own entrance carries it). Entrance: cover-slide */
function Jev() {
  const box = useRef<HTMLElement>(null);
  useCoverSlide(box);
  // the changed model id inside each body line is marked with the CSS Custom Highlight API, so the JSON body stays one
  // run of text (word for word, as the guide prints it); without the API the line simply shows unmarked
  useEffect(() => {
    if (typeof Highlight === 'undefined' || !window.CSS?.highlights || !box.current) return undefined;
    const was = new Highlight(), now = new Highlight();
    box.current.querySelectorAll<HTMLElement>('.kg-js').forEach((el) => {
      const t = el.firstChild, m = el.dataset.m;
      if (!(t instanceof Text) || !m) return;
      const at = t.data.indexOf(m);
      if (at < 0) return;
      const rg = new Range(); rg.setStart(t, at); rg.setEnd(t, at + m.length);
      (el.closest('[data-s="+"]') ? now : was).add(rg);
    });
    CSS.highlights.set('kg-was', was); CSS.highlights.set('kg-now', now);
    return () => { CSS.highlights.delete('kg-was'); CSS.highlights.delete('kg-now'); };
  }, []);
  const L = (sign: string, body: ReactNode) => <span className="kg-dl-l" data-s={sign}><i aria-hidden="true">{sign === '-' ? '−' : sign === '+' ? '+' : ' '}</i>{body}{'\n'}</span>;
  return (
    <section className="kg-jev kg-sec" ref={box} aria-labelledby="kg-j">
      <div className="kg-wrap">
        <div className="kg-head">
          <div><h2 id="kg-j" className="kg-h2">Change the URL, the key and the model</h2></div>
          <div className="kg-side"><p className="kg-kick">Coming from Jev</p><p className="kg-lede-s">Kai takes the request body Jev takes. The same endpoint also serves typesafe/jev-1.13 with a Hanzo key, at Jev’s price.</p></div>
        </div>
        {/* the highlight pseudo-element is written here: the CSS bundler does not parse ::highlight() yet */}
        <style>{'::highlight(kg-was){color:var(--ink);background-color:var(--brand-tone);text-decoration:line-through;text-decoration-thickness:1px}::highlight(kg-now){color:var(--paper);background-color:var(--ink)}'}</style>
        <div className="kg-jev-d">
          <pre tabIndex={0} data-lenis-prevent><code>
            {L('-', <span className="kg-cm">{'# Jev on OpenRouter'}</span>)}
            {L('+', <span className="kg-cm">{'# Kai on Hanzo: the same body'}</span>)}
            {L('-', <>{'curl '}<mark><span>https://openrouter.ai/api/alpha/decisions</span></mark>{' \\'}</>)}
            {L('+', <>{'curl '}<mark><span>https://api.hanzo.ai/v1/decisions</span></mark>{' \\'}</>)}
            {L('-', <>{'  -H "Authorization: Bearer $'}<mark><span>OPENROUTER_API_KEY</span></mark>{'" \\'}</>)}
            {L('+', <>{'  -H "Authorization: Bearer $'}<mark><span>HANZO_API_KEY</span></mark>{'" \\'}</>)}
            {L(' ', '  -H "Content-Type: application/json" \\')}
            {L('-', <>{"  -d '"}<span className="kg-js" data-m="typesafe/jev-1.13">{'{"model": "typesafe/jev-1.13", "state": "…", "questions": {…}}'}</span>{"'"}</>)}
            {L('+', <>{"  -d '"}<span className="kg-js" data-m="kai">{'{"model": "kai", "state": "…", "questions": {…}}'}</span>{"'"}</>)}
          </code></pre>
        </div>
        <p className="kg-differs"><W>What differs: Kai answers at most <b>100</b> questions a request, refuses a state past <b>32,768</b> tokens with <b>422</b>, and kai-1.3, the default, ignores a noul’s criteria. OpenAI’s Decisions body (<code>input</code> and a list of questions) is refused.</W></p>
      </div>
    </section>
  );
}

const BENCH: [name: string, label: string, pct: number][] = [['kai-1.4', '84.4%', 84.4], ['Jev', '76.6%', 76.6]];
function Bench() {
  return (
    <div className="kg-bench-f" aria-hidden="true">
      {BENCH.map(([n, v, x]) => (
        <div key={n} className="kg-bf">
          <span className="kg-bf-n">{n}</span>
          <b className="kg-bf-v">{v}</b>
          <span className="kg-bf-bar"><i style={{ transform: `scaleX(${x / 100})` }} /></span>
        </div>
      ))}
    </div>
  );
}

/* the closing band (page-local: the kit Band is a black room and would make a third dark surface): the guide's own
   sentence, then the key ask and the reference, centred, on the Quiet room */
function End() {
  return (
    <section className="kg-end" aria-labelledby="kg-e">
      <div className="kg-wrap">
        <h2 id="kg-e" className="kg-end-h">Kai answers each question with a probability for every answer it allows, and writes no text.</h2>
        <div className="kg-acts kg-close">
          <Cta to="https://platform.hanzo.ai/api-keys" id="kai-guide.close">Get an API key</Cta>
          <Cta to="https://docs.hanzo.ai/docs/decisions" kind="link" id="kai-guide.close-reference">Read the reference</Cta>
        </div>
      </div>
    </section>
  );
}

export default function KaiGuide() {
  usePhoneAsk(); // one solid ask at a time: the header's button outlines while the hero's or the close's ask is on screen
  return (
    <main className="kg">
      <section className="kg-hero" aria-labelledby="kg-h">
        <noscript><style>{'.kg-h1 .x-line-in,.kg-verdict b{transform:none!important;opacity:1!important}.kg-sess-btn,.kg-rx-btn,.kg-asks{display:none!important}.kg-code [role=tabpanel]{display:block!important}.kg-code [role=tablist]{display:none!important}.kg-more{display:none!important}.kg-dl dd{grid-row:auto!important}.kg-dl dd[hidden]{display:block!important;content-visibility:visible!important}'}</style></noscript>
        <div className="kg-wrap kg-hero-g">
          <div className="kg-hero-t">
            <h1 id="kg-h" className="kg-h1">
              <span className="x-line"><motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: T.line, ease: EMPH, delay: 0.1 }}>How to</motion.span></span>
              <span className="x-line"><motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: T.line, ease: EMPH, delay: 0.16 }}>Use Kai</motion.span></span>
            </h1>
            <p className="kg-kick kg-sub">Hanzo decision model · 0 output tokens</p>
            <p className="kg-lede"><W>Send a state and typed questions to <code>POST /v1/decisions</code> with <code>model: &quot;kai&quot;</code>. Kai answers each question with a probability for every answer it allows, and writes no text.</W></p>
            <div className="kg-acts">
              <Cta to="https://platform.hanzo.ai/api-keys" id="kai-guide.hero" thumb>Get an API key</Cta>
              <Cta to="https://docs.hanzo.ai/docs/decisions" kind="link" id="kai-guide.hero-reference">Read the reference</Cta>
            </div>
            <p className="kg-crumb"><A to="/models">Models</A> <span aria-hidden="true">/</span> <span>Kai Guide</span></p>
          </div>
          <Chat />
        </div>
      </section>

      <Types />
      <Call />

      {/* the proof strip, between the code and the limits */}
      <section className="kg-proof">
        <div className="kg-wrap kg-proof-g">
          <Bench />
          <p><span>On the frozen harness, kai-1.4 averaged 84.4% accuracy against Jev’s 76.6% across the 11 suites it leads, both models on the same questions.</span> <A to="/kai#benchmarks" className="kg-runs">The runs →</A></p>
        </div>
      </section>

      <Limits />
      <Room />
      <Jev />
      <End />
    </main>
  );
}
