'use client';
/* Kai: made for decisions.
   Signature: the decision tree that resolves itself. A state types in, its typed questions branch out (choice,
   score, noul) and each settles on an answer: a choice's options weigh up, a score's marker finds its level, a
   yes/no tips. It runs Hanzo's own three requests from the Kai guide in turn; pick one by hand any time.
   Beyond: copy the exact request you just watched resolve (verbatim from the guide) and run it yourself; the three
   question types sit below as live answer shapes that lead into the guide. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'motion/react';
import { EASE, Copy } from '../../ui';
import { A, More } from '../../kit';
import Sigil from '../../Sigil';
import { arrows } from './live';
import './Kai.css';

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

// Hanzo's three guide requests. The weights only draw the shape of an answer (an illustration, no figures shown).
const CASES = [
  { tab: 'Support ticket', lang: 'curl', code: CURL, state: 'Customer email: Cancel my plan immediately. Your service was down during our product launch.', qs: [
    { name: 'department', type: 'choice', ins: 'Route ticket to appropriate team', opts: [['executive_escalations', 'high-value customer cancellation threats', 0.8], ['support', 'general technical inquiries', 0.14], ['billing', 'standard invoice updates', 0.06]] },
    { name: 'urgency', type: 'score', ins: 'Rate ticket urgency', levels: ['low', 'normal', 'high', 'critical'], at: 2.45 },
    { name: 'churn_risk', type: 'noul', ins: 'Is this account at risk of churning?', p: 0.86 },
  ] },
  { tab: 'Payment question', lang: 'Python', code: PY, state: '{"ticket_id": 4821, "text": "Can I get an extension on my payment due date?"}', qs: [
    { name: 'team', type: 'choice', ins: 'Which team handles this?', opts: [['billing', 'invoices and payments', 0.88], ['support', 'technical issues', 0.12]] },
    { name: 'is_churn_risk', type: 'noul', ins: 'Is the user churning?', p: 0.18 },
  ] },
  { tab: 'Code change', lang: 'TypeScript', code: TS, state: "{ pull_request: 104, diff_lines: 480, files: ['auth.ts', 'token.go'] }", qs: [
    { name: 'risk', type: 'score', ins: 'Rate security risk of code change', levels: ['low: documentation or cosmetic', 'medium: internal logic', 'high: security or auth paths'], at: 1.8 },
  ] },
];

function Answer({ q, on }) {
  if (q.type === 'choice') {
    const top = Math.max(...q.opts.map((o) => o[2]));
    return (
      <ul className="ka-opts">
        {q.opts.map(([k, d, w], i) => (
          <li key={k} data-win={on && w === top ? '' : undefined}>
            <span className="ka-opt-k">{k}</span>
            <span className="ka-opt-d">{d}</span>
            <span className="ka-bar"><motion.i initial={false} animate={{ scaleX: on ? w : 0 }} transition={{ duration: 0.9, ease: EASE, delay: on ? 0.35 + i * 0.08 : 0 }} /></span>
          </li>
        ))}
      </ul>
    );
  }
  if (q.type === 'score') {
    const n = q.levels.length - 1;
    return (
      <div className="ka-score">
        <div className="ka-track">
          {q.levels.map((l, i) => <span key={l} className="ka-tick" style={{ left: (i / n) * 100 + '%' }} />)}
          <motion.span className="ka-run" initial={false} animate={{ x: on ? (q.at / n) * 100 + '%' : '0%', opacity: on ? 1 : 0.3 }} transition={{ type: 'spring', stiffness: 120, damping: 16 }}><i className="ka-mark" /></motion.span>
        </div>
        <ol className="ka-levels">{q.levels.map((l, i) => <li key={l} data-win={on && Math.round(q.at) === i ? '' : undefined}>{l}</li>)}</ol>
      </div>
    );
  }
  return (
    <div className="ka-noul">
      <span>no</span>
      <div className="ka-track"><motion.span className="ka-run" initial={false} animate={{ x: on ? q.p * 100 + '%' : '50%' }} transition={{ type: 'spring', stiffness: 110, damping: 14 }}><i className="ka-mark" /></motion.span></div>
      <span>yes</span>
      <em>P(true)</em>
    </div>
  );
}

function Tree() {
  const box = useRef(null), typed = useRef(null);
  const seen = useInView(box, { amount: 0.3 });
  const calm = useReducedMotion();
  const [c, setC] = useState(0);
  const [step, setStep] = useState(99); // 0 typing; 1.. one per question; the server renders the resolved tree
  const [mine, setMine] = useState(false);
  const cs = CASES[c];
  const total = cs.qs.length;

  useEffect(() => { if (!calm) setStep(0); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (calm && typed.current) typed.current.textContent = cs.state; }, [calm, cs.state]); // React never rewrites the typed node
  // type the state into a text node, then resolve one question at a time, hold, move to the next case
  useEffect(() => {
    if (calm || (!seen && !mine)) return;
    let t;
    if (step === 0) {
      const el = typed.current, s = cs.state;
      let i = 0;
      el.textContent = '';
      t = setInterval(() => { i += 2; el.textContent = s.slice(0, i); if (i >= s.length) { clearInterval(t); setStep(1); } }, 16);
      return () => clearInterval(t);
    }
    if (step <= total) { t = setTimeout(() => setStep(step + 1), 1300); return () => clearTimeout(t); }
    if (!mine) { t = setTimeout(() => { setC((c + 1) % CASES.length); setStep(0); }, 3400); return () => clearTimeout(t); }
  }, [step, seen, calm, c, mine, total, cs.state]);

  const pick = (i) => { setMine(true); setC(i); setStep(calm ? 99 : 0); };

  return (
    <div className="ka-tree mb-panel" ref={box}>
      <div className="ka-tabs" role="tablist" aria-label="Requests from the Kai guide" onKeyDown={arrows}>
        {CASES.map((k, i) => (
          <button key={k.tab} type="button" role="tab" id={'ka-t' + i} aria-selected={i === c} aria-controls="ka-panel" className="mb-chip" onClick={() => pick(i)}>{k.tab}</button>
        ))}
      </div>
      <div id="ka-panel" role="tabpanel" aria-labelledby={'ka-t' + c} className="ka-body">
        <div className="ka-root">
          <p className="mb-mono">state</p>
          <p className="ka-state"><span ref={typed}>{CASES[0].state}</span><i className="ka-caret" aria-hidden="true" data-on={step === 0 ? '' : undefined} /></p>
        </div>
        <svg className="ka-wires" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">
          {cs.qs.map((q, i) => {
            const x = ((i + 0.5) / total) * 100;
            return <motion.path key={c + q.name} d={`M50 0 C50 20 ${x} 20 ${x} 40`} vectorEffect="non-scaling-stroke" initial={{ pathLength: 0 }} animate={{ pathLength: step > i ? 1 : 0 }} transition={{ duration: 0.5, ease: EASE }} />;
          })}
        </svg>
        <div className="ka-qs" style={{ '--n': total }}>
          <AnimatePresence mode="popLayout" initial={false}>
            {cs.qs.map((q, i) => (
              <motion.div key={c + q.name} className="ka-q" data-on={step > i ? '' : undefined} initial={{ opacity: 0, y: 16 }} animate={{ opacity: step > i ? 1 : 0.35, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, ease: EASE }}>
                <p className="ka-q-h"><b>{q.name}</b><em>{q.type}</em></p>
                <p className="ka-q-i">{q.ins}</p>
                <Answer q={q} on={step > i} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
      <div className="ka-foot">
        <p className="ka-foot-t"><code>POST /v1/decisions</code> <span>{cs.lang} · {total} {total === 1 ? 'question' : 'questions'}</span></p>
        <Copy text={cs.code} label="Copy request" />
        <More to="/kai/guide">Read the guide</More>
      </div>
      <p className="ka-note">Kai answers each question with a probability for every answer it allows, and writes no text. The bars here only draw the shape of an answer.</p>
    </div>
  );
}

const TYPES = [
  ['choice', 'Send criteria: option → description, or a list of options.', 'Get choice, probabilities (one per option, summing to 1), confidence.'],
  ['score', 'Send criteria: the levels, lowest first.', 'Get score (the expected level index), legend, probabilities by level index.'],
  ['noul', 'Send instructions: a yes/no question.', 'Get noul: P(true).'],
];

export default function Kai() {
  return (
    <>
      <section className="ka-intro mb-sec" aria-labelledby="ka-h">
        <div className="x-wrap ka-split">
          <div className="ka-copy">
            <p className="mb-kick">Hanzo / Kai</p>
            <h2 id="ka-h" className="mb-h">Kai.<span className="mb-l2">Made for decisions.</span></h2>
            <p className="mb-lede">The decision model family from Hanzo. Explore each version, its capabilities and the evidence behind it.</p>
            <div className="mb-acts">
              <a href="#models" className="x-btn solid">Explore models</a>
              <A to="https://platform.hanzo.ai/decisions" className="x-btn" data-thumb="Open Decisions">Open Decisions</A>
              <More to="https://github.com/hanzoai/kai">Docs on GitHub</More>
            </div>
          </div>
          <Tree />
        </div>
      </section>
      <section className="ka-models mb-sec" id="models" aria-labelledby="ka-m">
        <div className="x-wrap">
          <h2 id="ka-m" className="mb-h2">Kai models</h2>
          <p className="mb-lede">Explore the model cards</p>
          <ul className="ka-cards">
            {[['Kai 1.8', 'Versioned model', 'kai-1.8', '/models/hanzo/kai-1.8', [1.8, 1024, 32768]], ['Kai', 'Default API alias', 'kai', '/models/hanzo/kai', [100, 0.021, 422]]].map(([n, l, code, to, data]) => (
              <li key={code}>
                <A to={to} className="ka-card" data-cursor="Open">
                  <Sigil seed={'kai/' + code} data={data} className="ka-sig" />
                  <span className="ka-card-l">{l}</span>
                  <span className="ka-card-n" data-morph>{n}</span>
                  <code>{code}</code>
                  <span className="ka-card-go">View model card <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
                </A>
              </li>
            ))}
          </ul>
          <ol className="ka-types">
            {TYPES.map(([t, send, get], i) => (
              <li key={t}>
                <A to="/kai/guide" className="ka-type">
                  <span className={'ka-glyph ka-g' + i} aria-hidden="true"><i /><i /><i /></span>
                  <b>{t}</b>
                  <span>{send}</span>
                  <span>{get}</span>
                </A>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
