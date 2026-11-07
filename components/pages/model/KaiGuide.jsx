'use client';
/* How to use Kai.
   Signature: the request checker. On the first screen a request sweeps through the guide's own limits by itself: a
   short state answered at kai-1.3's trained length, the guide's 3,982-token state answered with
   routing.extrapolated: true, the same state on kai-1.4 with no mark, a state past 32,768 refused with 422
   state_too_long, 101 questions refused with 422. Take the sliders and check your own request.
   Beyond: the checker prices the request at Hanzo's $0.021 per million input tokens (output is free) beside Jev's
   $0.042; the Jev section marks exactly the three things you change. */
import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { EASE, Copy } from '../../ui';
import { A, More } from '../../kit';
import { check, TRAINED, MAXSTATE, MAXQ } from './kaiLimits';
import { arrows } from './live';
import './Model.css';
import './Kai.css';
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

const SCENES = [[0, 800, 3], [0, 3982, 3], [1, 3982, 3], [1, 36000, 3], [0, 2000, 101]];
const LO = Math.log2(256), HI = Math.log2(65536);
const tokPos = (t) => (Math.log2(Math.max(256, t)) - LO) / (HI - LO);
const posTok = (p) => Math.round(Math.pow(2, LO + p * (HI - LO)));
const usd = (x) => '$' + (x < 0.01 ? x.toFixed(5) : x.toFixed(3));

function Checker() {
  const box = useRef(null);
  const seen = useInView(box, { amount: 0.3 });
  const calm = useReducedMotion();
  const [s, setS] = useState(1);
  const [mine, setMine] = useState(null); // [model, tokens, questions] once the visitor takes over
  useEffect(() => {
    if (!seen || mine || calm) return;
    const t = setInterval(() => setS((x) => (x + 1) % SCENES.length), 2600);
    return () => clearInterval(t);
  }, [seen, mine, calm]);
  const [m, tok, q] = mine || SCENES[s];
  const r = check(m, tok, q);
  const set = (i, v) => { const n = [...(mine || SCENES[s])]; n[i] = v; setMine(n); };
  const spring = { type: 'spring', stiffness: 120, damping: 18 };
  return (
    <div className="kg-check mb-panel" ref={box}>
      <div className="mb-bar"><i /><i /><i /><b>POST /v1/decisions</b><em>request check</em></div>
      <div className="kg-ck-body">
        <div className="kg-models mb-chips" role="radiogroup" aria-label="Model id" onKeyDown={arrows}>
          {['kai', 'kai-1.4'].map((id, i) => <button key={id} type="button" role="radio" aria-checked={m === i} className="mb-chip" onClick={() => set(0, i)}>model: &quot;{id}&quot;</button>)}
        </div>
        <label className="kg-ruler">
          <span className="kg-r-h"><span>State</span><b className="mb-tnum">{tok.toLocaleString('en-US')} tokens</b></span>
          <span className="kg-track">
            <i className="kg-zone z1" style={{ transform: `scaleX(${tokPos(TRAINED)})` }} />
            <i className="kg-zone z3" style={{ left: tokPos(MAXSTATE) * 100 + '%' }} />
            <span className="kg-mk" style={{ left: tokPos(TRAINED) * 100 + '%' }}>1,024</span>
            <span className="kg-mk" style={{ left: tokPos(MAXSTATE) * 100 + '%' }}>32,768</span>
            <motion.span className="kg-run" initial={false} animate={{ x: tokPos(tok) * 100 + '%' }} transition={spring}><i /></motion.span>
          </span>
          <input type="range" min="0" max="1000" value={Math.round(tokPos(tok) * 1000)} onChange={(e) => set(1, posTok(+e.target.value / 1000))} aria-label="State tokens" />
        </label>
        <label className="kg-ruler">
          <span className="kg-r-h"><span>Questions</span><b className="mb-tnum">{q}</b></span>
          <span className="kg-track">
            <i className="kg-zone z3" style={{ left: (MAXQ / 101) * 100 + '%' }} />
            <span className="kg-mk" style={{ left: (MAXQ / 101) * 100 + '%' }}>100</span>
            <motion.span className="kg-run" initial={false} animate={{ x: (q / 101) * 100 + '%' }} transition={spring}><i /></motion.span>
          </span>
          <input type="range" min="1" max="101" value={q} onChange={(e) => set(2, +e.target.value)} aria-label="Questions" />
        </label>
        <div className="kg-verdict" data-bad={r.code !== 200 ? '' : undefined} aria-live={mine ? 'polite' : 'off'}>
          <motion.b key={r.code} initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4, ease: EASE }} className="mb-tnum">{r.code}</motion.b>
          <div>
            <code>{r.flag}</code>
            <p>{r.why}</p>
          </div>
        </div>
        <p className="kg-cost mb-tnum">
          <span>Input, per 1,000 requests this size</span>
          <b>{r.code === 200 ? usd((tok * 0.021 * 1000) / 1e6) : '—'}</b>
          <span>Jev {r.code === 200 ? usd((tok * 0.042 * 1000) / 1e6) : '—'} · output is free</span>
        </p>
      </div>
    </div>
  );
}

function CallIt() {
  const [k, setK] = useState(0);
  return (
    <div className="kg-code mb-panel">
      <div className="kg-code-bar">
        <div className="mb-chips" role="tablist" aria-label="Language" onKeyDown={arrows}>
          {CODES.map(([l], i) => <button key={l} type="button" role="tab" id={'kg-t' + i} aria-selected={k === i} aria-controls={'kg-p' + i} className="mb-chip" onClick={() => setK(i)}>{l}</button>)}
        </div>
        <span className="kg-copy"><Copy text={CODES[k][1]} /></span>
      </div>
      {CODES.map(([l, c], i) => <pre key={l} id={'kg-p' + i} role="tabpanel" aria-labelledby={'kg-t' + i} hidden={k !== i}><code>{c}</code></pre>)}
    </div>
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

export default function KaiGuide() {
  return (
    <main className="kg">
      <section className="kg-hero" aria-labelledby="kg-h">
        <div className="x-wrap kg-hero-in">
          <div>
            <p className="kg-crumb"><A to="/models">Models</A> <span aria-hidden="true">/</span> <span>Kai Guide</span></p>
            <p className="mb-kick">Hanzo decision model · 0 output tokens</p>
            <h1 id="kg-h" className="mb-h kg-h">How to Use Kai</h1>
            <p className="mb-lede">Send a state and typed questions to <code>POST /v1/decisions</code> with <code>model: &quot;kai&quot;</code>. Kai answers each question with a probability for every answer it allows, and writes no text.</p>
            <div className="mb-acts">
              <A to="https://platform.hanzo.ai/api-keys" className="x-btn solid" data-thumb="Get an API key">Get an API key</A>
              <More to="https://docs.hanzo.ai/docs/decisions">Read the reference</More>
            </div>
          </div>
          <Checker />
        </div>
      </section>

      <section className="kg-types mb-sec" aria-labelledby="kg-q">
        <div className="x-wrap">
          <p className="mb-kick">Questions</p>
          <h2 id="kg-q" className="mb-h2">Three question types</h2>
          <p className="mb-lede">Name each question; its answer comes back under the same name.</p>
          <ol className="kg-cards">
            <li>
              <span className="ka-glyph ka-g0" aria-hidden="true"><i /><i /><i /></span>
              <h3>choice</h3>
              <p><b>Send</b> <code>criteria</code>: option → description, or a list of options.</p>
              <p><b>Get</b> <code>choice</code>, <code>probabilities</code> (one per option, summing to 1), <code>confidence</code>.</p>
            </li>
            <li>
              <span className="ka-glyph ka-g1" aria-hidden="true"><i /><i /><i /></span>
              <h3>score</h3>
              <p><b>Send</b> <code>criteria</code>: the levels, lowest first.</p>
              <p><b>Get</b> <code>score</code> (the expected level index), <code>legend</code>, <code>probabilities</code> by level index.</p>
            </li>
            <li>
              <span className="ka-glyph ka-g2" aria-hidden="true"><i /><i /><i /></span>
              <h3>noul</h3>
              <p><b>Send</b> <code>instructions</code>: a yes/no question.</p>
              <p><b>Get</b> <code>noul</code>: P(true). kai-1.3, the default, does not read a noul’s <code>criteria</code>.</p>
            </li>
          </ol>
        </div>
      </section>

      <section className="kg-call mb-sec" aria-labelledby="kg-c">
        <div className="x-wrap kg-call-in">
          <div>
            <p className="mb-kick">Call it</p>
            <h2 id="kg-c" className="mb-h2">One request, three questions</h2>
            <p className="mb-lede">Every response also carries id, model, usage (output_tokens is 0), routing (the checkpoint that answered: kai-1.3 for the model id kai), state_hash and latency_ms.</p>
          </div>
          <CallIt />
        </div>
      </section>

      <section className="kg-limits mb-sec" aria-labelledby="kg-l">
        <div className="x-wrap">
          <p className="mb-kick">Limits</p>
          <h2 id="kg-l" className="mb-h2">What a request may hold</h2>
          <dl className="kg-dl">
            <div><dt>Model</dt><dd>The model id <code>kai</code> answers from kai-1.3, the default. Ask for <code>kai-1.4</code> by id for the unified version: one encoder and one head, trained on long states. Ask for <code>kai-1.5</code> by id for the agentic preview: whether a tool fits a request, and whether to call one at all.</dd></div>
            <div><dt>Questions</dt><dd>Up to 100 a request; 101 is refused with 422.</dd></div>
            <div><dt>State</dt><dd>kai-1.3, the default, was trained on 1,024 tokens of state beside each question. Up to 32,768 is answered with <code>routing.extrapolated: true</code> and is unreliable: a fact at the end of a 3,982-token state read 0.507. <code>kai-1.4</code> was trained on long states and marks no read up to 32,768 extrapolated. Past 32,768 the answer is 422 <code>state_too_long</code>.</dd></div>
            <div><dt>Time</dt><dd>One yes/no question takes &lt;1 ms of server time at p50 in production on GPU (0.27 ms cached in process). Every response reports its own <code>latency_ms</code>.</dd></div>
            <div><dt>Price</dt><dd>$0.021 per million input tokens; output is free. Jev costs $0.042.</dd></div>
          </dl>
        </div>
      </section>

      <section className="kg-recipes mb-sec" data-room="dark" aria-labelledby="kg-r">
        <div className="x-wrap">
          <p className="mb-kick">Recipes &amp; Blueprints</p>
          <h2 id="kg-r" className="mb-h2">Composable Decision Recipes</h2>
          <p className="mb-lede">Modular Rust structs and TypeScript workflows that sit inside your pipelines: retail triage, industrial diagnostics, confidence routing, and agent loops.</p>
          <ul className="kg-rec">
            {RECIPES.map(([n, d], i) => (
              <motion.li key={n} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.7, ease: EASE, delay: i * 0.05 }}>
                <code>{n}</code>
                <p>{d}</p>
              </motion.li>
            ))}
          </ul>
          <div className="mb-acts">
            <A to="https://docs.hanzo.ai/docs/guides/cookbook/recipes" className="x-btn solid">Read the Recipes Guide</A>
            <A to="https://docs.hanzo.ai/docs/guides/cookbook" className="x-btn">View All Cookbook Pipelines</A>
            <A to="https://github.com/hanzoai/kai/tree/main/recipes" className="kg-gh">Kai recipes on GitHub ↗</A>
          </div>
        </div>
      </section>

      <section className="kg-jev mb-sec" aria-labelledby="kg-j">
        <div className="x-wrap">
          <p className="mb-kick">Coming from Jev</p>
          <h2 id="kg-j" className="mb-h2">Change the URL, the key and the model</h2>
          <p className="mb-lede">Kai takes the request body Jev takes. The same endpoint also serves typesafe/jev-1.13 with a Hanzo key, at Jev’s price.</p>
          <div className="kg-diff">
            <pre className="mb-panel"><code>{'# Jev on OpenRouter\ncurl '}<mark>https://openrouter.ai/api/alpha/decisions</mark>{' \\\n  -H "Authorization: Bearer $'}<mark>OPENROUTER_API_KEY</mark>{'" \\\n  -H "Content-Type: application/json" \\\n  -d \'{"model": "'}<mark>typesafe/jev-1.13</mark>{'", "state": "…", "questions": {…}}\''}</code></pre>
            <pre className="mb-panel kai"><code>{'# Kai on Hanzo: the same body\ncurl '}<mark>https://api.hanzo.ai/v1/decisions</mark>{' \\\n  -H "Authorization: Bearer $'}<mark>HANZO_API_KEY</mark>{'" \\\n  -H "Content-Type: application/json" \\\n  -d \'{"model": "'}<mark>kai</mark>{'", "state": "…", "questions": {…}}\''}</code></pre>
          </div>
          <p className="kg-differs">What differs: Kai answers at most <b>100</b> questions a request, refuses a state past <b>32,768</b> tokens with <b>422</b>, and kai-1.3, the default, ignores a noul’s criteria. OpenAI’s Decisions body (<code>input</code> and a list of questions) is refused.</p>
          <p className="kg-bench">On the frozen harness, kai-1.4 averaged 84.4% accuracy against Jev’s 76.6% across the 11 suites it leads, both models on the same questions. <A to="/kai#benchmarks" className="kg-runs">The runs →</A></p>
        </div>
      </section>
    </main>
  );
}
