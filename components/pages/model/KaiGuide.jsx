'use client';
/* How to use Kai (/kai/guide), archetype F: terminal first, code as the hero.
   Chapters: a live session on the first screen; the three question types as a spec sheet; the code in three languages
   to copy and run; the limits beside a request checker; the recipes in the one dark room; the move from Jev as a diff.
   Signature: the session runs itself. On the first screen the guide's own curl request is typing into a terminal, then
   the response streams back in its documented shape (id, model, routing, usage with output_tokens 0, an answer per
   question, state_hash, latency_ms) with no values made up: Kai writes no text, and the session shows it. The request
   text is written into one text node through a ref, never per-letter React state; reduced motion shows it complete.
   Beyond: the request checker. Pick a limit and the checker loads that case (101 questions, a 3,982-token state, a
   state past 32,768, kai-1.4); drag the rulers to check your own request and see its input price at $0.021 per million
   tokens beside Jev's $0.042.
   V2: 8.5/10 Rebuilt terminal-first: a self-running typed session as hero, a spec-sheet of question types, sticky copy-and-run code, limits that drive the checker, recipes room, Jev move as a landing diff with the benchmark as hero figures. */
// Signature: the session runs itself: the guide's curl request typing into a terminal and its response shape streaming back
// Beyond: the request checker, driven by the limit you pick or by your own rulers, priced against Jev
import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { EASE, Copy } from '../../ui';
import { A, More } from '../../kit';
import { check, TRAINED, MAXSTATE, MAXQ } from './kaiLimits';
import { arrows } from './live';
import './KaiGuide.css';

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
const CODES = [['curl', CURL], ['Python', PY], ['TypeScript', TS]];
// the response's documented shape: field names from the guide, values left out (nothing invented)
const RESP = `{
  "id": "…",
  "model": "kai",
  "routing": {…},          // the checkpoint that answered: kai-1.3
  "usage": { "output_tokens": 0 },
  "answers": {
    "department": { "choice": …, "probabilities": {…}, "confidence": … },
    "urgency":    { "score": …, "legend": […], "probabilities": {…} },
    "churn_risk": { "noul": … }
  },
  "state_hash": "…",
  "latency_ms": …
}`;

/* the first screen: a session that types the request and streams the response (typing into text nodes via refs) */
function Session() {
  const box = useRef(null), req = useRef(null), res = useRef(null), scr = useRef(null), say = useRef(null);
  const seen = useInView(box, { amount: 0.35 });
  const calm = useReducedMotion();
  const [run, setRun] = useState(0);
  useEffect(() => {
    if (calm || !seen) return;
    const b = box.current, r = req.current, o = res.current, sc = scr.current, st = say.current;
    const lines = RESP.split('\n');
    let t, i = 0, j = 0;
    const phase = (p, s) => { b.dataset.phase = p; st.textContent = s; };
    const pin = () => { sc.scrollTop = sc.scrollHeight; };
    const step = () => {
      i = Math.min(CURL.length, i + 3 + ((Math.random() * 4) | 0));
      r.textContent = CURL.slice(0, i); pin();
      if (i < CURL.length) t = setTimeout(step, 14); else { phase('wait', 'sending'); t = setTimeout(stream, 650); }
    };
    const stream = () => {
      if (!j) phase('stream', '200 · streaming');
      o.textContent = lines.slice(0, ++j).join('\n'); pin();
      if (j < lines.length) t = setTimeout(stream, 75); else { phase('done', '200 · output_tokens 0'); t = setTimeout(() => setRun((x) => x + 1), 6500); }
    };
    r.textContent = ''; o.textContent = ''; sc.scrollTop = 0; phase('type', 'typing');
    t = setTimeout(step, 450);
    return () => { clearTimeout(t); r.textContent = CURL; o.textContent = RESP; phase('done', '200 · output_tokens 0'); };
  }, [seen, calm, run]);
  return (
    <figure className="kg-sess" ref={box} data-phase="done">
      <div className="kg-sess-bar">
        <i /><i /><i />
        <b>POST /v1/decisions</b>
        <span className="kg-sess-st"><i aria-hidden="true" /><span ref={say}>200 · output_tokens 0</span></span>
        <span className="kg-sess-copy"><Copy text={CURL} /></span>
      </div>
      <div className="kg-sess-scr" ref={scr} tabIndex={0} data-lenis-prevent aria-label="curl request and the shape of its response">
        <pre className="kg-sess-req"><span className="kg-ps" aria-hidden="true">$ </span><code ref={req}>{CURL}</code><i className="kg-caret" aria-hidden="true" /></pre>
        <pre className="kg-sess-res"><code ref={res}>{RESP}</code></pre>
      </div>
      <button type="button" className="kg-replay" onClick={() => setRun((x) => x + 1)}>
        <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 8a5 5 0 1 0 1.6-3.7M3 2.5v2.8h2.8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>Replay
      </button>
    </figure>
  );
}

const TYPES = [
  ['choice', <><b>Send</b> <code>criteria</code>: option → description, or a list of options.</>, <><b>Get</b> <code>choice</code>, <code>probabilities</code> (one per option, summing to 1), <code>confidence</code>.</>],
  ['score', <><b>Send</b> <code>criteria</code>: the levels, lowest first.</>, <><b>Get</b> <code>score</code> (the expected level index), <code>legend</code>, <code>probabilities</code> by level index.</>],
  ['noul', <><b>Send</b> <code>instructions</code>: a yes/no question.</>, <><b>Get</b> <code>noul</code>: P(true). kai-1.3, the default, does not read a noul’s <code>criteria</code>.</>],
];

function CallIt() {
  const [k, setK] = useState(0);
  return (
    <figure className="kg-code">
      <div className="kg-code-bar">
        <div className="kg-tabs" role="tablist" aria-label="Language" onKeyDown={arrows}>
          {CODES.map(([l], i) => (
            <button key={l} type="button" role="tab" id={'kg-t' + i} aria-selected={k === i} aria-controls={'kg-p' + i} tabIndex={k === i ? 0 : -1} onClick={() => setK(i)}>
              {k === i && <motion.i layoutId="kg-tab-ink" className="kg-tab-ink" transition={{ type: 'spring', stiffness: 300, damping: 30 }} />}<span>{l}</span>
            </button>
          ))}
        </div>
        <span className="kg-code-copy"><Copy text={CODES[k][1]} /></span>
      </div>
      {CODES.map(([l, c], i) => <pre key={l} id={'kg-p' + i} role="tabpanel" aria-labelledby={'kg-t' + i} hidden={k !== i} tabIndex={0} data-lenis-prevent><code>{c}</code></pre>)}
    </figure>
  );
}

const SCENES = [[0, 800, 3], [0, 3982, 3], [1, 3982, 3], [1, 36000, 3], [0, 2000, 101]];
const SCENE_ROW = [3, 2, 0, 2, 1]; // which limit each checker case illustrates (Model, Questions, State, Time, Price)
const ROW_SCENE = [2, 4, 1, 0, 0];
const LO = Math.log2(256), HI = Math.log2(65536);
const tokPos = (t) => (Math.log2(Math.max(256, t)) - LO) / (HI - LO);
const posTok = (p) => Math.round(Math.pow(2, LO + p * (HI - LO)));
const usd = (x) => '$' + (x < 0.01 ? x.toFixed(5) : x.toFixed(3));

function Checker({ s, mine, setMine }) {
  const [m, tok, q] = mine || SCENES[s];
  const r = check(m, tok, q);
  const set = (i, v) => { const n = [...(mine || SCENES[s])]; n[i] = v; setMine(n); };
  const spring = { type: 'spring', stiffness: 300, damping: 30 };
  return (
    <div className="kg-check">
      <div className="kg-check-bar"><b>POST /v1/decisions</b><em>request check</em></div>
      <div className="kg-ck-body">
        <div className="kg-models" role="radiogroup" aria-label="Model id" onKeyDown={arrows}>
          {['kai', 'kai-1.4'].map((id, i) => <button key={id} type="button" role="radio" aria-checked={m === i} tabIndex={m === i ? 0 : -1} className="kg-chip" onClick={() => set(0, i)}>model: &quot;{id}&quot;</button>)}
        </div>
        <label className="kg-ruler">
          <span className="kg-r-h"><span>State</span><b>{tok.toLocaleString('en-US')} tokens</b></span>
          <span className="kg-track">
            <i className="kg-zone z1" style={{ transform: `scaleX(${tokPos(TRAINED)})` }} />
            <i className="kg-zone z3" style={{ left: tokPos(MAXSTATE) * 100 + '%' }} />
            <span className="kg-mk" style={{ left: tokPos(TRAINED) * 100 + '%' }}>1,024</span>
            <span className="kg-mk" style={{ left: tokPos(MAXSTATE) * 100 + '%' }}>32,768</span>
            <motion.span className="kg-run" initial={false} animate={{ x: tokPos(tok) * 100 + '%' }} transition={spring}><i /></motion.span>
            <input type="range" min="0" max="1000" value={Math.round(tokPos(tok) * 1000)} onChange={(e) => set(1, posTok(+e.target.value / 1000))} aria-label="State tokens" />
          </span>
        </label>
        <label className="kg-ruler">
          <span className="kg-r-h"><span>Questions</span><b>{q}</b></span>
          <span className="kg-track">
            <i className="kg-zone z3" style={{ left: (MAXQ / 101) * 100 + '%' }} />
            <span className="kg-mk" style={{ left: (MAXQ / 101) * 100 + '%' }}>100</span>
            <motion.span className="kg-run" initial={false} animate={{ x: (q / 101) * 100 + '%' }} transition={spring}><i /></motion.span>
            <input type="range" min="1" max="101" value={q} onChange={(e) => set(2, +e.target.value)} aria-label="Questions" />
          </span>
        </label>
        <div className="kg-verdict" data-bad={r.code !== 200 ? '' : undefined} aria-live={mine ? 'polite' : 'off'}>
          <motion.b key={r.code} initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4, ease: EASE }}>{r.code}</motion.b>
          <div>
            <code>{r.flag}</code>
            <p>{r.why}</p>
          </div>
        </div>
        <p className="kg-cost">
          <span>Input, per 1,000 requests this size</span>
          <b>{r.code === 200 ? usd((tok * 0.021 * 1000) / 1e6) : '—'}</b>
          <span>Jev {r.code === 200 ? usd((tok * 0.042 * 1000) / 1e6) : '—'} · output is free</span>
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

function Limits() {
  const box = useRef(null);
  const seen = useInView(box, { amount: 0.3 });
  const calm = useReducedMotion();
  const [s, setS] = useState(1);
  const [mine, setMine] = useState(null); // [model, tokens, questions] once the visitor takes over
  const [row, setRow] = useState(null);
  useEffect(() => {
    if (!seen || mine || calm) return;
    const t = setInterval(() => setS((x) => (x + 1) % SCENES.length), 2800);
    return () => clearInterval(t);
  }, [seen, mine, calm]);
  const lit = row !== null ? row : mine ? null : SCENE_ROW[s];
  const pick = (i) => { setRow(i); setMine([...SCENES[ROW_SCENE[i]]]); };
  return (
    <section className="kg-limits kg-sec" ref={box} aria-labelledby="kg-l">
      <div className="kg-wrap kg-limits-g">
        <div className="kg-limits-t">
          <p className="kg-kick">Limits</p>
          <h2 id="kg-l" className="kg-h2">What a request may hold</h2>
          <dl className="kg-dl">
            {LIMITS.map(([k, v], i) => (
              <div key={k} data-on={lit === i || undefined}>
                <dt><button type="button" aria-pressed={row === i} onClick={() => pick(i)}><span>{k}</span><svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></button></dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="kg-limits-c">
          <Checker s={s} mine={mine} setMine={(n) => { setRow(null); setMine(n); }} />
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
  return (
    <div className="kg-bench-f" ref={box} data-on={seen || undefined} aria-hidden="true">
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

export default function KaiGuide() {
  return (
    <main className="kg">
      <section className="kg-hero" aria-labelledby="kg-h">
        <div className="kg-wrap kg-hero-g">
          <div className="kg-hero-t">
            <p className="kg-crumb"><A to="/models">Models</A> <span aria-hidden="true">/</span> <span>Kai Guide</span></p>
            <p className="kg-kick">Hanzo decision model · 0 output tokens</p>
            <h1 id="kg-h" className="kg-h1">
              <span className="x-line"><motion.span className="x-line-in" initial={{ y: '108%' }} animate={{ y: 0 }} transition={{ duration: 1.05, ease: EASE, delay: 0.1 }}>How to</motion.span></span>
              <span className="x-line"><motion.span className="x-line-in" initial={{ y: '108%' }} animate={{ y: 0 }} transition={{ duration: 1.05, ease: EASE, delay: 0.2 }}>Use Kai</motion.span></span>
            </h1>
            <p className="kg-lede">Send a state and typed questions to <code>POST /v1/decisions</code> with <code>model: &quot;kai&quot;</code>. Kai answers each question with a probability for every answer it allows, and writes no text.</p>
            <div className="kg-acts">
              <A to="https://platform.hanzo.ai/api-keys" className="x-btn solid" data-thumb="Get an API key">Get an API key</A>
              <More to="https://docs.hanzo.ai/docs/decisions">Read the reference</More>
            </div>
          </div>
          <Session />
        </div>
      </section>

      <section className="kg-types kg-sec" aria-labelledby="kg-q">
        <div className="kg-wrap">
          <div className="kg-head">
            <div><p className="kg-kick">Questions</p><h2 id="kg-q" className="kg-h2">Three question types</h2></div>
            <p className="kg-lede-s">Name each question; its answer comes back under the same name.</p>
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

      <section className="kg-call kg-sec" aria-labelledby="kg-c">
        <div className="kg-wrap kg-call-g">
          <div className="kg-call-t">
            <p className="kg-kick">Call it</p>
            <h2 id="kg-c" className="kg-h2">One request, three questions</h2>
            <p className="kg-lede-s">Every response also carries id, model, usage (output_tokens is 0), routing (the checkpoint that answered: kai-1.3 for the model id kai), state_hash and latency_ms.</p>
          </div>
          <CallIt />
        </div>
      </section>

      <Limits />

      <section className="kg-recipes kg-sec" data-room="dark" aria-labelledby="kg-r">
        <div className="kg-wrap">
          <div className="kg-head">
            <div><p className="kg-kick">Recipes &amp; Blueprints</p><h2 id="kg-r" className="kg-h2">Composable Decision Recipes</h2></div>
            <p className="kg-lede-s">Modular Rust structs and TypeScript workflows that sit inside your pipelines: retail triage, industrial diagnostics, confidence routing, and agent loops.</p>
          </div>
          <ul className="kg-rec">
            {RECIPES.map(([n, d]) => <li key={n}><code>{n}</code><p>{d}</p></li>)}
          </ul>
          <div className="kg-acts">
            <A to="https://docs.hanzo.ai/docs/guides/cookbook/recipes" className="x-btn solid">Read the Recipes Guide</A>
            <A to="https://docs.hanzo.ai/docs/guides/cookbook" className="x-btn">View All Cookbook Pipelines</A>
            <A to="https://github.com/hanzoai/kai/tree/main/recipes" className="kg-gh">Kai recipes on GitHub ↗</A>
          </div>
        </div>
      </section>

      <section className="kg-jev kg-sec" aria-labelledby="kg-j">
        <div className="kg-wrap">
          <div className="kg-head">
            <div><p className="kg-kick">Coming from Jev</p><h2 id="kg-j" className="kg-h2">Change the URL, the key and the model</h2></div>
            <p className="kg-lede-s">Kai takes the request body Jev takes. The same endpoint also serves typesafe/jev-1.13 with a Hanzo key, at Jev’s price.</p>
          </div>
          <Jev />
          <div className="kg-jev-g">
            <p className="kg-differs">What differs: Kai answers at most <b>100</b> questions a request, refuses a state past <b>32,768</b> tokens with <b>422</b>, and kai-1.3, the default, ignores a noul’s criteria. OpenAI’s Decisions body (<code>input</code> and a list of questions) is refused.</p>
            <div className="kg-bench">
              <Bench />
              <p>On the frozen harness, kai-1.4 averaged 84.4% accuracy against Jev’s 76.6% across the 11 suites it leads, both models on the same questions. <A to="/kai#benchmarks" className="kg-runs">The runs →</A></p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
