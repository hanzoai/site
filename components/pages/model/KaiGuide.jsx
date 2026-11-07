'use client';
/* How to use Kai (/kai/guide). Page type: Developer (MASTER 4.6): a typewriter terminal as the hero, Copy beside the key ask.
   Chapters: the session; the three question types as a spec sheet; the code in three languages on a Quiet room (kit
   Tabs + CodeBlock, opening on Python); the limits beside a light request checker; the recipes as a stage in the one
   black room; the move from Jev as a light diff; the benchmark as the proof strip; a closing band in the page's words.
   Signature: the session runs itself, once. The guide's own curl request types into a terminal, then the response
   streams back in its documented shape (id, model, routing, usage with output_tokens 0, an answer per question,
   state_hash, latency_ms) with no values made up, then it rests. Text goes into one text node through a ref; the
   terminal starts empty with JS on (full text with JS off and under reduced motion); a pause / replay control sits in
   its bar; its box never changes size.
   Beyond: the request checker. Pick a limit and the checker loads that case (101 questions, a 3,982-token state, a
   state past 32,768, kai-1.4); drag the rulers to check your own request and see its input price at $0.021 per million
   tokens beside Jev's $0.042. Its verdict box always holds the tallest answer, so nothing below it moves.
   V2: 8.5/10 Review round 2: two dark surfaces only (hero terminal, recipes room), code/checker/diff now light; code opens on Python so the curl shows once; recipes as a self-advancing stage with pause; glyphs loop in turn, row hover fill; Price lights the cost line; rulers SSR-stable (no hydration badge); proof strip + Quiet closing band; hero tightened to 38%, noscript out of the h1. */
// Persona: Developer wiring Kai decisions into a pipeline (MASTER 1: developers).
// Goal: copy the request, then get a key and send a first POST /v1/decisions.
// CTA: Get an API key (Cta solid, data-cta kai-guide.hero, data-thumb), repeated at the close (kai-guide.close).
// Metric: api_key_created
// Signature: the session runs itself once: the guide's curl request typing into a terminal and its response shape streaming back
// Beyond: the request checker, driven by the limit you pick or by your own rulers, priced against Jev
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { Copy } from '../../ui';
import { A, Cta, Tabs, TabPanel, CodeBlock } from '../../kit';
import { check, TRAINED, MAXSTATE, MAXQ } from './kaiLimits';
import { arrows } from './live';
import './KaiGuide.css';

// the deck's motion tokens (MASTER 3.1): durations in seconds, one emphasis curve, no springs
const T = { press: 0.09, fast: 0.15, base: 0.3, slow: 0.4, slower: 0.5, line: 0.7 };
const EMPH = [0.16, 1, 0.3, 1];

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
// the response's documented shape: field names from the guide, each missing value an em dash (nothing invented)
const RESP = `{
  "id": —,
  "model": "kai",
  "routing": —, // the checkpoint that answered: kai-1.3 for the model id kai
  "usage": { "output_tokens": 0 },
  "answers": {
    "department": { "choice": —, "probabilities": —, "confidence": — },
    "urgency":    { "score": —, "legend": —, "probabilities": — },
    "churn_risk": { "noul": — }
  },
  "state_hash": —,
  "latency_ms": —
}`;

const RLINES = RESP.split('\n');
// the lines the session rests on: usage (output_tokens 0) and the answers block, lit in this order once it settles
// the status line in the guide's own words: an em dash while it runs, "0 output tokens" once it rests
const DONE = '0 output tokens';
const KEY = RLINES.map((l, i) => (i >= 4 && i <= 9 ? i - 4 : undefined));

/* the first screen: the request types and the response streams, once (typing into text nodes via refs), then rests on
   the answer: the request dims, the response scrolls so its usage and answers lines sit mid-window, and those lines
   light one by one (no values added: the guide's own shape, its … kept) */
function Session() {
  const box = useRef(null), req = useRef(null), res = useRef(null), scr = useRef(null), say = useRef(null);
  const seen = useInView(box, { amount: 0.4 });
  const calm = useReducedMotion();
  const [hold, setHold] = useState(false);
  const [phase, setPhase] = useState('idle'); // idle (empty, waiting) | run | done
  const [run, setRun] = useState(0);
  const at = useRef({ i: 0, j: 0 });
  const show = (p, s) => { box.current.dataset.phase = p; say.current.textContent = s; };
  // the rest: centre the usage-to-answers block in the window (smoothly when the run ends, at once under reduced motion)
  const settle = (smooth) => {
    const sc = scr.current, ks = res.current.querySelectorAll('[data-k]');
    if (!ks.length) return;
    const top = sc.getBoundingClientRect().top - sc.scrollTop;
    const a = ks[0].getBoundingClientRect().top - top, z = ks[ks.length - 1].getBoundingClientRect().bottom - top;
    sc.scrollTo({ top: Math.max(0, (a + z) / 2 - sc.clientHeight / 2), behavior: smooth ? 'smooth' : 'auto' });
  };
  useEffect(() => {
    if (calm) { req.current.textContent = CURL; [...res.current.children].forEach((l) => { l.dataset.in = ''; }); show('done', DONE); setPhase('done'); return; }
    if (!seen || hold || phase === 'done') return;
    const r = req.current, o = res.current, sc = scr.current, p = at.current;
    let t;
    const pin = () => { sc.scrollTop = sc.scrollHeight; };
    const step = () => {
      p.i = Math.min(CURL.length, p.i + 3 + ((Math.random() * 4) | 0));
      r.textContent = CURL.slice(0, p.i); pin();
      if (p.i < CURL.length) t = setTimeout(step, 14); else { show('wait', '—'); t = setTimeout(stream, 600); }
    };
    const stream = () => {
      if (!p.j) show('stream', '—');
      o.children[p.j++].dataset.in = ''; pin();
      if (p.j < RLINES.length) t = setTimeout(stream, 75);
      else { show('done', DONE); setPhase('done'); }
    };
    if (phase === 'idle') { r.textContent = ''; [...o.children].forEach((l) => { delete l.dataset.in; }); sc.scrollTop = 0; setPhase('run'); }
    show(p.i < CURL.length ? 'type' : 'stream', '—');
    t = setTimeout(p.i < CURL.length ? step : stream, p.i || p.j ? 0 : 450);
    return () => clearTimeout(t);
  }, [seen, calm, hold, phase, run]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (phase !== 'done') return;
    const t = setTimeout(() => settle(!calm), calm ? 0 : 300);
    return () => clearTimeout(t);
  }, [phase, calm]); // eslint-disable-line react-hooks/exhaustive-deps
  const replay = () => { at.current = { i: 0, j: 0 }; setHold(false); setPhase('idle'); setRun((x) => x + 1); };
  const label = phase === 'done' ? 'Replay' : hold ? 'Play' : 'Pause';
  return (
    <figure className="kg-sess" ref={box}>
      <div className="kg-sess-bar">
        <b>POST /v1/decisions</b>
        <span className="kg-sess-st"><i aria-hidden="true" /><span ref={say}>{DONE}</span></span>
        <button type="button" className="kg-sess-btn" aria-label={label} aria-pressed={phase !== 'done' ? hold : undefined} onClick={() => (phase === 'done' ? replay() : setHold((h) => !h))}>
          {phase === 'done'
            ? <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3 8a5 5 0 1 0 1.6-3.7M3 2.5v2.8h2.8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            : hold
              ? <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M5 3.5v9l7.5-4.5z" fill="currentColor" /></svg>
              : <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M5.5 3.5v9M10.5 3.5v9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>}
        </button>
        <span className="kg-sess-copy"><Copy text={CURL} /></span>
      </div>
      <div className="kg-sess-scr" ref={scr} tabIndex={0} data-lenis-prevent aria-label="POST /v1/decisions">
        <pre className="kg-sess-req"><span className="kg-ps" aria-hidden="true">$ </span><code ref={req}>{CURL}</code></pre>
        <pre className="kg-sess-res"><code ref={res}>{RLINES.map((l, i) => <span key={i} className="kg-rl" data-k={KEY[i]} style={KEY[i] !== undefined ? { '--k': KEY[i] } : undefined}>{l}{'\n'}</span>)}</code></pre>
      </div>
    </figure>
  );
}

const TYPES = [
  ['choice', <><b>Send</b> <code>criteria</code>: option → description, or a list of options.</>, <><b>Get</b> <code>choice</code>, <code>probabilities</code> (one per option, summing to 1), <code>confidence</code>.</>],
  ['score', <><b>Send</b> <code>criteria</code>: the levels, lowest first.</>, <><b>Get</b> <code>score</code> (the expected level index), <code>legend</code>, <code>probabilities</code> by level index.</>],
  ['noul', <><b>Send</b> <code>instructions</code>: a yes/no question.</>, <><b>Get</b> <code>noul</code>: P(true). kai-1.3, the default, does not read a noul’s <code>criteria</code>.</>],
];

/* the three types as a spec sheet; each glyph draws its type, then the three take turns showing it again (one mover at a
   time, a 9 s round) while the sheet is on screen, paused off screen and under reduced motion */
function Types() {
  const box = useRef(null);
  const seen = useInView(box, { amount: 0.2 });
  return (
    <section className="kg-types kg-sec" ref={box} data-off={!seen || undefined} aria-labelledby="kg-q">
      <div className="kg-wrap">
        <div className="kg-head">
          <div><h2 id="kg-q" className="kg-h2">Three question types</h2></div>
          <div className="kg-side"><p className="kg-kick">Questions</p><p className="kg-lede-s">Name each question; its answer comes back under the same name.</p></div>
        </div>
        <ol className="kg-rows">
          {TYPES.map(([n, send, get], i) => (
            <li key={n}>
              <div className="kg-row-n"><span className={'kg-glyph g' + i} aria-hidden="true"><i /><i /><i /><i /></span><h3>{n}</h3></div>
              <p>{send}</p>
              <p>{get}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* the hero already typed the curl request, so the code opens on Python (curl stays one tab away) */
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
  const box = useRef(null);
  // the kit CodeBlock marks itself a dark room; here it sits on a white tile, so it is marked light before the header
  // starts watching for dark rooms (layout effects run first), else the header turns dark over light code
  // (docs/requests/kai-guide.md asks for a room prop on CodeBlock)
  useLayoutEffect(() => { box.current?.querySelectorAll('.x-codeblock[data-room]').forEach((el) => el.setAttribute('data-room', 'light')); }, []);
  useEffect(() => {
    const read = () => {
      let i = LANG.indexOf(location.hash.slice(1));
      if (i < 0) { try { i = LANG.indexOf(localStorage.getItem('kg-lang')); } catch { i = -1; } }
      if (i >= 0) setK(i);
    };
    read(); addEventListener('hashchange', read);
    return () => removeEventListener('hashchange', read);
  }, []);
  const choose = (i) => {
    setK(i);
    try { localStorage.setItem('kg-lang', LANG[i]); } catch { /* storage off: the choice lasts this visit */ }
    history.replaceState(history.state, '', '#' + LANG[i]);
  };
  const more = (i) => {
    setAll((a) => a.map((v, j) => v || j === i));
    requestAnimationFrame(() => box.current?.querySelector(`#kg-lang-panel-${i} pre`)?.focus({ preventScroll: true }));
  };
  return (
    <div className="kg-code" ref={box}>
      <Tabs id="kg-lang" label="Language" tabs={CODES.map(([l]) => l)} value={k} onChange={choose} />
      {CODES.map(([l, c], i) => {
        const long = c.split('\n').length > CAP;
        return (
          <TabPanel key={l} id="kg-lang" i={i} value={k} className="kg-code-p">
            <div className="kg-cap" data-cap={(long && !all[i]) || undefined} style={{ '--cap': CAP }}>
              <CodeBlock code={c} label={l} />
              {long && !all[i] && <button type="button" className="kg-more" aria-controls={`kg-lang-panel-${i}`} aria-expanded="false" onClick={() => more(i)}><span>Show all</span><svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="m4 6 4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></button>}
            </div>
          </TabPanel>
        );
      })}
    </div>
  );
}

// the checker only ever shows the guide's own figures: the state ruler snaps to the four points the guide names
// (1,024 trained, the 3,982-token example, 32,768, past 32,768) and the questions are up to 100 or 101; no figure is
// worked out from another, so the old per-request price readout is gone and Price lights the guide's own price line
const STOPS = [[1024, '1,024'], [3982, '3,982'], [32768, '32,768'], [65536, 'Past 32,768']];
const QS = [[100, 'Up to 100'], [101, '101']];
const SCENES = [[0, 0, 0], [0, 1, 0], [1, 1, 0], [1, 3, 0], [0, 0, 1]]; // [model, state stop, questions stop]
// the five answers kaiLimits can give, so the verdict box always holds the tallest one
const OUTS = [check(0, 1024, 101), check(0, 65536, 100), check(0, 3982, 100), check(0, 1024, 100), check(1, 1024, 100)];
const WALK = [2, 3, 4, 0, 1]; // the order the checker plays the five cases, ending where it began
const SCENE_ROW = [3, 2, 0, 2, 1]; // which limit each checker case illustrates (Model, Questions, State, Time, Price)
const ROW_SCENE = [2, 4, 1, 0, 0];
const LO = Math.log2(256), HI = Math.log2(65536);
const tokPos = (t) => (Math.log2(Math.max(256, t)) - LO) / (HI - LO);
const nearest = (p) => STOPS.reduce((best, [t], i) => (Math.abs(tokPos(t) - p) < Math.abs(tokPos(STOPS[best][0]) - p) ? i : best), 0);

// a ruler's thumb position as one fixed string, the same on the server and in the browser (no hydration drift).
// The range input carries suppressHydrationWarning: a screenshot taken before hydration writes an inline caret-color on
// every input, and that one attribute is all React would otherwise flag (the input itself renders no style).
const run = (p) => ({ transform: `translateX(${(Math.round(p * 10000) / 100).toFixed(2)}%)` });

function Checker({ s, mine, setMine, price }) {
  const [m, si, qi] = mine || SCENES[s];
  const tok = STOPS[si][0];
  const r = check(m, tok, QS[qi][0]);
  const set = (i, v) => { const n = [...(mine || SCENES[s])]; n[i] = v; setMine(n); };
  const key = (e) => {
    const d = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1 }[e.key];
    const to = e.key === 'Home' ? 0 : e.key === 'End' ? STOPS.length - 1 : d !== undefined ? Math.min(STOPS.length - 1, Math.max(0, si + d)) : null;
    if (to === null) return;
    e.preventDefault(); set(1, to);
  };
  return (
    <div className="kg-check">
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

const LIMITS = [
  ['Model', <>The model id <code>kai</code> answers from kai-1.3, the default. Ask for <code>kai-1.4</code> by id for the unified version: one encoder and one head, trained on long states. Ask for <code>kai-1.5</code> by id for the agentic preview: whether a tool fits a request, and whether to call one at all.</>],
  ['Questions', <>Up to 100 a request; 101 is refused with 422.</>],
  ['State', <>kai-1.3, the default, was trained on 1,024 tokens of state beside each question. Up to 32,768 is answered with <code>routing.extrapolated: true</code> and is unreliable: a fact at the end of a 3,982-token state read 0.507. <code>kai-1.4</code> was trained on long states and marks no read up to 32,768 extrapolated. Past 32,768 the answer is 422 <code>state_too_long</code>.</>],
  ['Time', <>One yes/no question takes &lt;1 ms of server time at p50 in production on GPU (0.27 ms cached in process). Every response reports its own <code>latency_ms</code>.</>],
  ['Price', <>$0.021 per million input tokens; output is free. Jev costs $0.042.</>],
];

/* the limits one at a time: the five mono labels sit in one row and only the open one's sentence shows beneath them;
   the other four sentences stay in the HTML (hidden="until-found", so find-in-page and #limit-<name> open them). The
   open limit follows the checker as it walks Hanzo's cases, and a click on a label opens it and loads its case, so the
   two move together. The sentence slot keeps the height of the tallest sentence, so nothing moves as they change. */
const slug = (k) => 'limit-' + k.toLowerCase();
function Limits() {
  const box = useRef(null), list = useRef(null);
  const seen = useInView(box, { amount: 0.3 });
  const calm = useReducedMotion();
  const [s, setS] = useState(1);
  const [n, setN] = useState(0); // steps played: the checker walks Hanzo's cases once, then rests on the extrapolated one
  const [mine, setMine] = useState(null); // [model, tokens, questions] once the visitor takes over
  const [row, setRow] = useState(null);
  const [open, setOpen] = useState(SCENE_ROW[1]);
  useEffect(() => {
    if (!seen || mine || calm || n >= WALK.length) return;
    const t = setTimeout(() => { setS(WALK[n]); setN(n + 1); }, 2600);
    return () => clearTimeout(t);
  }, [seen, mine, calm, n]);
  const lit = row !== null ? row : mine ? null : SCENE_ROW[s];
  // the open limit follows the checker's walk; the sentence slot keeps one height, so nothing moves when it changes
  useEffect(() => { if (lit !== null) setOpen(lit); }, [lit]);
  const pick = (i) => { setOpen(i); setRow(i); setMine([...SCENES[ROW_SCENE[i]]]); };
  useEffect(() => {
    const dl = list.current;
    const dds = [...dl.querySelectorAll('dd')];
    // find-in-page or a #limit-<name> link reveals a folded sentence: open that row with it
    const found = dds.map((d, i) => { const f = () => pick(i); d.addEventListener('beforematch', f); return f; });
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
                <dd id={slug(k) + '-d'} hidden={open === i ? undefined : 'until-found'}>{v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="kg-limits-c">
          <Checker s={s} mine={mine} price={open === 4} setMine={(n) => { setRow(null); setMine(n); }} />
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
  const box = useRef(null);
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
              <span className="kg-rx-m"><code>{n}</code></span>
              <p>{d}</p>
            </div>
          ))}
        </div>
      </div>
      <ul className="kg-rec">
        {RECIPES.map(([n], i) => (
          <li key={n} data-on={i === k || undefined}>
            <button type="button" aria-pressed={i === k} onPointerEnter={(e) => { if (e.pointerType === 'mouse') setK(i); }} onFocus={() => setK(i)} onClick={() => setK(i)}><code>{n}</code></button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* the move from Jev as one diff: the three changed lines land in turn when the diff reaches the screen */
function Jev() {
  const box = useRef(null);
  const seen = useInView(box, { once: true, amount: 0.4 });
  const [armed, setArmed] = useState(false);
  useEffect(() => { if (!matchMedia('(prefers-reduced-motion: reduce)').matches) setArmed(true); }, []);
  const L = (sign, body, n) => <span className="kg-dl-l" data-s={sign} style={n !== undefined ? { '--n': n } : undefined}><i aria-hidden="true">{sign === '-' ? '−' : sign === '+' ? '+' : ' '}</i>{body}{'\n'}</span>;
  return (
    <div className="kg-jev-d" ref={box} data-arm={armed || undefined} data-on={seen || undefined}>
      <pre tabIndex={0} data-lenis-prevent><code>
        {L('-', <span className="kg-cm">{'# Jev on OpenRouter'}</span>, 0)}
        {L('+', <span className="kg-cm">{'# Kai on Hanzo: the same body'}</span>, 0)}
        {L('-', <>{'curl '}<mark>https://openrouter.ai/api/alpha/decisions</mark>{' \\'}</>, 1)}
        {L('+', <>{'curl '}<mark>https://api.hanzo.ai/v1/decisions</mark>{' \\'}</>, 1)}
        {L('-', <>{'  -H "Authorization: Bearer $'}<mark>OPENROUTER_API_KEY</mark>{'" \\'}</>, 2)}
        {L('+', <>{'  -H "Authorization: Bearer $'}<mark>HANZO_API_KEY</mark>{'" \\'}</>, 2)}
        {L(' ', '  -H "Content-Type: application/json" \\')}
        {L('-', <>{'  -d \'{"model": "'}<mark>typesafe/jev-1.13</mark>{'", "state": "…", "questions": {…}}\''}</>, 3)}
        {L('+', <>{'  -d \'{"model": "'}<mark>kai</mark>{'", "state": "…", "questions": {…}}\''}</>, 3)}
      </code></pre>
    </div>
  );
}

function Bench() {
  const box = useRef(null);
  const seen = useInView(box, { once: true, amount: 0.5 });
  const [armed, setArmed] = useState(false);
  useEffect(() => { if (!matchMedia('(prefers-reduced-motion: reduce)').matches) setArmed(true); }, []);
  return (
    <div className="kg-bench-f" ref={box} data-arm={armed || undefined} data-on={seen || undefined} aria-hidden="true">
      {[['kai-1.4', '84.4%', 84.4], ['Jev', '76.6%', 76.6]].map(([n, v, x]) => (
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
   sentence cuts in by line mask when it arrives, then the key ask and the reference, centred, on the Quiet room */
function End() {
  const box = useRef(null);
  const seen = useInView(box, { once: true, amount: 0.5 });
  const [armed, setArmed] = useState(false);
  useEffect(() => { if (!matchMedia('(prefers-reduced-motion: reduce)').matches) setArmed(true); }, []);
  return (
    <section className="kg-end" ref={box} data-arm={armed || undefined} data-on={seen || undefined} aria-labelledby="kg-e">
      <div className="kg-wrap">
        <h2 id="kg-e" className="kg-end-h">
          <span className="x-line"><span className="x-line-in">Kai answers each question with a probability for every answer it allows, and writes no text.</span></span>
        </h2>
        <div className="kg-acts kg-close">
          <Cta to="https://platform.hanzo.ai/api-keys" id="kai-guide.close">Get an API key</Cta>
          <Cta to="https://docs.hanzo.ai/docs/decisions" kind="link" id="kai-guide.close-reference">Read the reference</Cta>
        </div>
      </div>
    </section>
  );
}

export default function KaiGuide() {
  return (
    <main className="kg">
      <section className="kg-hero" aria-labelledby="kg-h">
        <noscript><style>{'.kg-h1 .x-line-in,.kg-verdict b{transform:none!important;opacity:1!important}.kg-sess-btn,.kg-rx-btn{display:none!important}.kg-code [role=tabpanel]{display:block!important}.kg-code [role=tablist]{display:none!important}.kg-more{display:none!important}.kg-dl dd{grid-row:auto!important}.kg-dl dd[hidden]{display:block!important;content-visibility:visible!important}'}</style></noscript>
        <div className="kg-wrap kg-hero-g">
          <div className="kg-hero-t">
            <h1 id="kg-h" className="kg-h1">
              <span className="x-line"><motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: T.line, ease: EMPH, delay: 0.1 }}>How to</motion.span></span>
              <span className="x-line"><motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: T.line, ease: EMPH, delay: 0.16 }}>Use Kai</motion.span></span>
            </h1>
            <p className="kg-kick kg-sub">Hanzo decision model · 0 output tokens</p>
            <p className="kg-lede">Send a state and typed questions to <code>POST /v1/decisions</code> with <code>model: &quot;kai&quot;</code>. Kai answers each question with a probability for every answer it allows, and writes no text.</p>
            <div className="kg-acts">
              <Cta to="https://platform.hanzo.ai/api-keys" id="kai-guide.hero" thumb>Get an API key</Cta>
              <Cta to="https://docs.hanzo.ai/docs/decisions" kind="link" id="kai-guide.hero-reference">Read the reference</Cta>
            </div>
            <p className="kg-crumb"><A to="/models">Models</A> <span aria-hidden="true">/</span> <span>Kai Guide</span></p>
          </div>
          <Session />
        </div>
      </section>

      <Types />

      <section className="kg-call kg-sec" aria-labelledby="kg-c">
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

      <Limits />

      <section className="kg-recipes kg-sec" aria-labelledby="kg-r">
        <div className="kg-wrap kg-room" data-room="dark">
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
      </section>

      <section className="kg-jev kg-sec" aria-labelledby="kg-j">
        <div className="kg-wrap">
          <div className="kg-head">
            <div><h2 id="kg-j" className="kg-h2">Change the URL, the key and the model</h2></div>
            <div className="kg-side"><p className="kg-kick">Coming from Jev</p><p className="kg-lede-s">Kai takes the request body Jev takes. The same endpoint also serves typesafe/jev-1.13 with a Hanzo key, at Jev’s price.</p></div>
          </div>
          <Jev />
          <p className="kg-differs">What differs: Kai answers at most <b>100</b> questions a request, refuses a state past <b>32,768</b> tokens with <b>422</b>, and kai-1.3, the default, ignores a noul’s criteria. OpenAI’s Decisions body (<code>input</code> and a list of questions) is refused.</p>
        </div>
      </section>

      {/* the proof strip, then the closing band: the page's own sentence, the key ask, the reference */}
      <section className="kg-proof">
        <div className="kg-wrap kg-proof-g">
          <Bench />
          <p>On the frozen harness, kai-1.4 averaged 84.4% accuracy against Jev’s 76.6% across the 11 suites it leads, both models on the same questions. <A to="/kai#benchmarks" className="kg-runs">The runs →</A></p>
        </div>
      </section>
      <End />
    </main>
  );
}
