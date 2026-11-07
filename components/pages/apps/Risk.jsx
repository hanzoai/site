'use client';
/* Risk. Signature: the dial that decides, and shows its work. Pick a stage (signup, payment, post-purchase; the stage
   is a field), and signals light up; the needle swings to a score and the plane returns an action and its reasons.
   It never declines on its own: past the line it summons a person, the ceiling Hanzo's engine refuses to start above.
   Beyond: "Attribution, by hand". Set any signal back to neutral and score again; the drop is that signal's
   contribution, which is exactly how Hanzo says its scores explain themselves. The dial is labelled an illustration,
   because no figure on this page is a customer result.
   Also: an alert that becomes a case with its citation, two lanes for agents and the anonymous, and a status on every
   capability (available now or in development). Every word and link is Hanzo's. */
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EASE, Rise } from '../../ui';
import { A } from '../../kit';
import { useLive, useEvery, useSteps } from '../cloud/Frame';
import './Risk.css';

const up = (d) => ({ initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, ease: EASE, delay: d } });
const Live = () => <span className="rk-badge live">Available now</span>;
const Dev = () => <span className="rk-badge dev">In development</span>;

// illustrative weights for the dial (not measured, not a customer result)
const STAGES = [
  ['signup', 'Signup and onboarding', [['several customers acting as one', 34], ['free-trial abuse', 21], ['account sharing', 12]]],
  ['payment', 'Payment', [['card testing', 38], ['velocity counters', 19], ['bot-driven payment abuse', 15]]],
  ['post-purchase', 'Ongoing and post-purchase', [['payout fraud', 30], ['negative balances', 16], ['disputes', 11]]],
];
const LINE = 50;

function Dial() {
  const [ref, live] = useLive(0.3);
  const [st, setSt] = useState(1);
  const [off, setOff] = useState([false, false, false]); // a signal set back to neutral
  const [mine, setMine] = useState(false);
  const [beat, setBeat] = useState(0);
  // idle: walk the stages and set one signal to neutral, then back, so the dial is always deciding something
  useEvery(2200, live && !mine, () => {
    const b = beat + 1;
    setBeat(b);
    if (b % 3 === 0) { setSt((s) => (s + 1) % 3); setOff([false, false, false]); }
    else setOff([false, false, false].map((_, i) => i === (b % 3) - 1));
  });
  const sig = STAGES[st][2];
  const score = sig.reduce((a, [, w], i) => a + (off[i] ? 0 : w), 0);
  const act = score >= LINE ? 'summon a person' : 'allow';
  const rot = -90 + (score / 100) * 180;
  const pick = (i) => { setMine(true); setSt(i); setOff([false, false, false]); };
  const flip = (i) => { setMine(true); setOff((o) => o.map((v, k) => (k === i ? !v : v))); };
  return (
    <div className="rk-dial" ref={ref}>
      <div className="rk-stage" role="tablist" aria-label="Stage">
        {STAGES.map(([k], i) => (
          <button key={k} type="button" role="tab" aria-selected={st === i} onClick={() => pick(i)}>
            {st === i && <motion.span layoutId="rk-st" className="rk-st-bg" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
            <span>{k}</span>
          </button>
        ))}
      </div>
      <p className="rk-field x-mono">stage: '{STAGES[st][0]}'</p>
      <div className="rk-gauge" aria-hidden="true">
        <svg viewBox="0 0 220 124">
          <path d="M14 112 A 96 96 0 0 1 206 112" className="rk-arc" />
          <path d="M110 16 A 96 96 0 0 1 206 112" className="rk-arc hot" />
          <line x1="110" y1="8" x2="110" y2="26" className="rk-tick" />
        </svg>
        <motion.i className="rk-needle" animate={{ rotate: rot }} transition={{ type: 'spring', stiffness: 70, damping: 12 }} />
        <span className="rk-hub" />
        <span className="rk-l0 x-mono">0</span><span className="rk-l1 x-mono">100</span>
      </div>
      <div className="rk-out">
        <div><span>score</span><AnimatePresence mode="popLayout" initial={false}><motion.b key={score} className="x-mono" initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -16, opacity: 0 }} transition={{ type: 'spring', stiffness: 420, damping: 30 }}>{score}</motion.b></AnimatePresence></div>
        <div><span>action</span><AnimatePresence mode="popLayout" initial={false}><motion.b key={act} className={'rk-act' + (score >= LINE ? ' hot' : '')} initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -16, opacity: 0 }} transition={{ type: 'spring', stiffness: 420, damping: 30 }}>{act}</motion.b></AnimatePresence></div>
      </div>
      <p className="rk-reasons-k">reasons · tap one to set it back to neutral</p>
      <ul className="rk-reasons">
        {sig.map(([t, w], i) => (
          <li key={STAGES[st][0] + t}>
            <button type="button" aria-pressed={off[i]} onClick={() => flip(i)} className={off[i] ? 'off' : ''}>
              <span>{t}</span>
              <motion.i style={{ originX: 0 }} animate={{ scaleX: off[i] ? 0 : w / 40 }} transition={{ type: 'spring', stiffness: 200, damping: 24 }} />
              <b className="x-mono">{off[i] ? `−${w}` : `+${w}`}</b>
            </button>
          </li>
        ))}
      </ul>
      <p className="rk-ill">Illustration. No figure on this page is a customer result.</p>
    </div>
  );
}

function Hero() {
  return (
    <section className="rk-hero" aria-labelledby="rk-h1">
      <div className="x-wrap rk-hero-grid">
        <div className="rk-copy">
          <motion.p className="rk-kick" {...up(0)}>Risk</motion.p>
          <h1 id="rk-h1" className="rk-h1">
            {['One risk plane', 'for accounts,', 'payments and agents'].map((t, i) => (
              <span key={t} className="x-line"><motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.05 + i * 0.1 }}>{t}{' '}</motion.span></span>
            ))}
          </h1>
          <motion.p className="rk-lede" {...up(0.4)}>Two faces over one engine, at two different stages. Available now — the compliance face, at api.hanzo.ai/v1/aml: monitoring, alerts, cases, rules, sanctions screening, relationship lookback and a retained-record clock. In development — the decide plane, which will score an account, a transaction, a session or an agent and return a decision you can explain, from a model trained on your organization's own data rather than a pooled model of somebody else's traffic.</motion.p>
          <motion.div className="rk-acts" {...up(0.5)}>
            <motion.span className="x-go" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}><A to="/contact-sales" className="x-btn solid" data-thumb="Talk to us">Talk to us</A></motion.span>
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2, ease: EASE, delay: 0.2 }}>
          <Dial />
        </motion.div>
      </div>
    </section>
  );
}

function Today() {
  return (
    <section className="x-sec rk-today">
      <div className="x-wrap">
        <h2 className="rk-h2">Where this is today</h2>
        <div className="rk-faces">
          <div className="rk-face live">
            <p className="rk-face-k"><i />compliance face<code>/v1/aml</code></p>
            <p>Hanzo Risk is two faces over one engine, and they are not at the same stage. The <strong>compliance face is live</strong> at <strong>api.hanzo.ai/v1/aml</strong>, behind your Hanzo identity: monitoring, alerts, cases, rules, sanctions screening, relationship lookback, and a retained-record plane that keeps a five-year clock.</p>
            <p>Its source is public and every rule cites the instrument it implements, so what this page claims can be read back out of the code. It is <strong>not open source</strong>: the engine is licensed under the Lux Ecosystem License — free for research and on Lux networks, and licensed separately for commercial use anywhere else.</p>
          </div>
          <div className="rk-face dev">
            <p className="rk-face-k"><i />decide plane<code>/v1/risk</code></p>
            <p>The <strong>decide plane</strong> — <strong>/v1/risk</strong>, everything else on this page — and the shared model plane behind both are being built. Every capability below says which of the two it is.</p>
            <div className="rk-build" aria-hidden="true">{Array.from({ length: 24 }).map((_, i) => <i key={i} style={{ animationDelay: (i % 8) * 0.18 + 's' }} />)}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

const AML = [
  ['Transaction monitoring', 'Transactions are scored against the rule library as they arrive. An alert carries the rule that fired and the citation behind it — the authority, the document and the locator inside it — so a reviewer lands on the primary text instead of taking the alert on trust.'],
  ['Rules you can read', 'Twenty typology rules ship as a starting library, each citing the standard it implements. A candidate rule can be replayed over your own history, and the report is the difference between what it would have caught and what the live library catches — one replay at a time per organization. Activating a rule of your own belongs to the decide plane and is not here yet.'],
  ['Cases', 'An alert becomes a case with a timeline, and both are durable — they are there after a restart, and one institution’s volume cannot evict another’s. Closing a case requires a rationale, and the record keeps it: a resolution nobody can account for is not a resolution.'],
  ['Sanctions screening', 'OFAC, UK OFSI, EU and UN designations, parsed from each authority’s own published export rather than a reseller’s copy of it. The freshness of every list is on the record.'],
  ['Relationship lookback', 'Ask whether a business relationship with a named party is open now, or was open inside the last five years, and what its nature was. The answer is a lookup on that party in an index of relationship records, so what it reads does not grow with the ledger. It reads relationships and not transactions, which is a different question from the one the rules answer.'],
  ['Retention', 'A retained record — a relationship, a transaction, the assessment behind a case, a refusal — carries its own five-year clock, started by the end of the relationship, by the occasional transaction, or by the refusal itself. Disposal runs daily and proves what it destroyed before it reports it. Alerts and case timelines are durable, and are not on that clock.'],
];
const CASE = [['transaction', 'arrives'], ['rule fired', 'with its citation'], ['authority · document · locator', 'the primary text'], ['case opened', 'with a timeline'], ['closed', 'rationale on the record']];

/* An alert becoming a case, step by step, beside the six capabilities of the compliance face. */
function Compliance() {
  const [ref, live] = useLive(0.25);
  const [k, setK] = useState(5);
  useEffect(() => { if (live) setK(0); }, [live]);
  useEvery(1300, live, () => setK((v) => (v >= CASE.length + 2 ? 0 : v + 1)));
  return (
    <section className="x-sec rk-aml" ref={ref}>
      <div className="x-wrap rk-aml-grid">
        <div>
          <h2 className="rk-h2">Available now: the compliance face</h2>
          <p className="rk-lead">Anti-money-laundering monitoring is a different job from stopping fraud, and it is the half that is live. It is one face of the same engine, not a separate product.</p>
          <ol className="rk-list">
            {AML.map(([t, d], i) => (
              <Rise as="li" key={t} y={16} delay={i * 0.04}>
                <h3>{t}{i === 0 && <Live />}</h3>
                <p>{d}</p>
              </Rise>
            ))}
          </ol>
        </div>
        <div className="rk-case-wrap">
          <div className="rk-case" aria-hidden="true">
            <p className="rk-case-k x-mono"><span>/v1/aml</span><span>alert → case</span></p>
            <ol>
              {CASE.map(([t, d], i) => (
                <motion.li key={t} initial={false} animate={{ opacity: i < k ? 1 : 0.15, x: i < k ? 0 : 10 }} transition={{ duration: 0.45, ease: EASE }}>
                  <i className={i < k ? 'on' : ''} /><b>{t}</b><span>{d}</span>
                </motion.li>
              ))}
            </ol>
            <div className="rk-clock">
              <svg viewBox="0 0 44 44"><circle cx="22" cy="22" r="18" /><motion.circle cx="22" cy="22" r="18" className="on" initial={false} animate={{ pathLength: Math.min(1, k / CASE.length) }} transition={{ duration: 1.2, ease: EASE }} /></svg>
              <span><b>five-year clock</b> on every retained record</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const LIFE = [
  ['Signup and onboarding', 'Multi-account abuse, free-trial abuse, account sharing and account fraud, judged when the account is created. The device and pairing signals exist for exactly one question: are several nominally unrelated customers acting as one?'],
  ['Payment', 'Card testing, transaction fraud and bot-driven payment abuse, scored at authorization time. The hot path is meant to read velocity counters held in memory, not the warehouse, so a payment decision does not fail when analytics does.'],
  ['Ongoing and post-purchase', 'Pay-as-you-go abuse, negative balances and payout fraud, plus the disputes that arrive weeks later. A resolved dispute is a label, and the label goes back into the model that made the call.'],
];

function Lifecycle() {
  const [ref, live] = useLive(0.35);
  const [at, choose] = useSteps(3, 3000, live);
  return (
    <section className="x-sec rk-life" ref={ref}>
      <div className="x-wrap">
        <div className="rk-head2">
          <h2 className="rk-h2">The customer lifecycle</h2>
          <p className="rk-lead">In development. Loss does not arrive at one moment, so the plane will not watch one moment. Same call, same record, same model at each stage — the stage is a field.</p>
        </div>
        <div className="rk-track">
          <motion.i className="rk-track-fill" animate={{ scaleX: (at + 1) / 3 }} transition={{ type: 'spring', stiffness: 90, damping: 18 }} aria-hidden="true" />
          {LIFE.map(([t, d], i) => (
            <button key={t} type="button" className={'rk-stop' + (at === i ? ' on' : '')} aria-pressed={at === i} onClick={() => choose(i)} onMouseEnter={() => choose(i)}>
              <i />
              <h3>{t}{i === 0 && <Dev />}</h3>
              <p>{d}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

const ON = [
  ['Accounts', 'Score any account on the platform, at signup and continuously afterwards. Covers multi-account abuse, free-trial abuse, account sharing, account takeover and account fraud. A merchant on your platform is an account too, so onboarding and ongoing monitoring run off the same score.'],
  ['Transactions', 'Score a transaction at authorization and return an action, a score and the reasons behind it. Covers card testing, transaction fraud and payment abuse across whatever methods and processors you already use.'],
  ['Abuse', 'Score the usage plane, not only the money: pay-as-you-go abuse, credential stuffing, scraping, quota abuse and spam. This is the plane that defends an AI product, where the loss is inference spend rather than a chargeback.'],
  ['Disputes', 'Assemble what a dispute response needs — the decision, the rules that fired, the values behind it and the identity of the model that produced it — out of a tamper-evident record. Hanzo does not process payments and has no dispute-network integration; the evidence is yours to submit.'],
];

function DecidesOn() {
  return (
    <section className="x-sec rk-on">
      <div className="x-wrap">
        <div className="rk-head2">
          <h2 className="rk-h2">What it decides on</h2>
          <p className="rk-lead">In development. Fraud is a use of a scoring plane, not a product that sits beside one. One call will judge an account, a transaction, a session or an agent.</p>
        </div>
        <div className="rk-quad">
          {ON.map(([t, d], i) => (
            <div key={t} className="rk-q">
              <span className="rk-q-n x-mono">{String(i + 1).padStart(2, '0')}</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Model() {
  return (
    <section className="x-sec rk-model" data-room="dark">
      <div className="x-wrap">
        <div className="rk-model-top">
          <h2 className="rk-h2">Your data, your model</h2>
          <p className="rk-lead">In development. The endpoint your events already arrive through is live; reading those events as features, and training on them, is what is being built.</p>
        </div>
        <div className="rk-endpoint" aria-hidden="true">
          <span className="x-mono">POST /v1/event</span>
          <div className="rk-stream">{Array.from({ length: 12 }).map((_, i) => <i key={i} style={{ animationDelay: i * 0.33 + 's' }} />)}</div>
          <span className="rk-shadow x-mono">shadow</span>
        </div>
        <div className="rk-model-cols">
          <p>Most fraud products score you against a pooled model built from other people’s traffic. Hanzo already holds yours. Analytics, product events and errors arrive through one endpoint — <strong>POST /v1/event</strong> — and are stored as rows scoped to your organization, beside your model usage, in a warehouse Hanzo runs and every tenant shares. That endpoint is live today. Reading those events as features and training on them is what is coming: your users, your products, your normal.</p>
          <p>The boundary is the hard part, and the commitment is that it will be enforced in the code rather than asserted in a policy. A feature read will not be expressible without a tenant. The organization will come from your verified identity, never from a field a caller can set. Anything shared across organizations will be an <strong>aggregate</strong> — published quantiles, with no organization, no subject and no identifier in the row — and a bucket too few organizations contributed to will not be published at all. The model is meant to be per organization down to its geometry, so that two organizations do not merely keep separate counters; they have separate models.</p>
          <p>Two of the properties that plane needs are already in the engine’s behavioural model, and it is those that will be carried forward. A score there is attributable by construction: move one input back to its neutral value, score again, and the drop is that input’s contribution — no second model is asked to explain the first. And a statistical judgement may summon a person; it may not decline anything on its own, a ceiling the engine refuses to start above. On the live deployment that model runs in <strong>shadow</strong>: it scores, and it contributes nothing to any transaction’s outcome.</p>
        </div>
      </div>
    </section>
  );
}

const FACTS = ['a registration in your organization', 'a credential of a known class', 'a live session', 'metered usage'];

/* Four facts about our own platform; with them a caller is an agent, with none it is anonymous. */
function Agents() {
  const [ref, live] = useLive(0.35);
  const [has, setHas] = useState([true, true, true, true]);
  const [mine, setMine] = useState(false);
  const [n, setN] = useState(0);
  useEvery(1500, live && !mine, () => { const v = (n + 1) % 6; setN(v); setHas(FACTS.map((_, i) => (v < 4 ? i >= v : v === 4 ? false : true))); });
  const count = has.filter(Boolean).length;
  const lane = count === 4 ? 'agent' : count === 0 ? 'anon' : 'mid';
  return (
    <section className="x-sec rk-agents" ref={ref}>
      <div className="x-wrap rk-agents-grid">
        <div>
          <h2 className="rk-h2">Agents are not bots</h2>
          <p className="rk-lead">In development. This is the argument for building the decide plane here rather than buying one, not a description of something running today.</p>
          <p className="rk-p">A user-agent string cannot tell you whether traffic is a scraper or a customer’s agent doing work it was asked to do. The plane will not read one.</p>
          <p className="rk-p">Hanzo runs agents. An agent transacting here has a registration in your organization, a credential of a known class, a live session and metered usage — four facts about our own platform rather than four guesses about a client. Traffic carrying them will be treated as an agent and get the agent policy. Traffic that declares nothing and authenticates as nobody will be in the anonymous lane and bounded like one.</p>
          <p className="rk-p strong">Treating a customer’s agent as a bad bot is a lost sale. Treating a bad bot as an agent is a loss. The difference has to be computed, and computing it needs facts only the platform the agent runs on has.</p>
        </div>
        <div className="rk-lanes">
          <ul className="rk-facts">
            {FACTS.map((f, i) => (
              <li key={f}><button type="button" role="switch" aria-checked={has[i]} onClick={() => { setMine(true); setHas((h) => h.map((v, k) => (k === i ? !v : v))); }}><i />{f}</button></li>
            ))}
          </ul>
          <div className="rk-lane-box" aria-live="polite">
            <div className={'rk-lane' + (lane === 'agent' ? ' on' : '')}><b>agent policy</b><span>all four facts carried</span></div>
            <div className={'rk-lane' + (lane === 'anon' ? ' on anon' : '')}><b>anonymous lane</b><span>declares nothing, authenticates as nobody · bounded</span></div>
            <motion.i className="rk-caller" animate={{ y: lane === 'agent' ? 0 : lane === 'anon' ? 74 : 37, opacity: lane === 'mid' ? 0.4 : 1 }} transition={{ type: 'spring', stiffness: 160, damping: 18 }} aria-hidden="true" />
            <p className="rk-lane-n x-mono">{count} of 4 facts</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function RulesPlat() {
  return (
    <section className="x-sec rk-rules">
      <div className="x-wrap rk-rules-grid">
        <div>
          <div className="rk-head2 tight">
            <h2 className="rk-h2">Rules, lists and suppression</h2>
            <p className="rk-lead">In development.</p>
          </div>
          <ul className="rk-trio">
            {[['Custom rules', 'Write rules over your own fields in the same vocabulary the shipped library uses, and replay them over your own history before you turn them on.'], ['Lists', 'Allow and deny lists over addresses, emails, accounts, card ranges, networks and devices, referenced directly from a rule. Your lists are yours; a designation from a sanctions authority is not editable by a tenant, and the two never merge.'], ['Suppression', 'Suppress an activation you have already judged. A suppressed hit is recorded as suppressed rather than dropped, because silence must never read back as a clean result.']].map(([t, d], i) => (
              <li key={t}><h3>{t}</h3><p>{d}</p></li>
            ))}
          </ul>
        </div>
        <div className="rk-plat">
          <h2 className="rk-h2">Platforms and marketplaces</h2>
          <p className="rk-lead">In development.</p>
          <p className="rk-p">If you run a platform, your risk is your sellers as much as your buyers. Risk will <em>declare</em> a control against a subject — hold a payout, set a reserve, restrict a merchant, block a suspect transaction — and the money plane will read it. Risk will never move money itself.</p>
          <div className="rk-ctrl" aria-hidden="true">
            {['hold a payout', 'set a reserve', 'restrict a merchant', 'block a suspect transaction'].map((c, i) => (
              <span key={c} style={{ animationDelay: i * 0.9 + 's' }}><b className="x-mono">declare</b>{c}</span>
            ))}
            <em className="x-mono">money plane reads it</em>
          </div>
          <p className="rk-p">That separation is deliberate. The thing that decides and the thing that pays should not be the same thing, and a control that is a written record rather than a side effect is one you can still account for a year later.</p>
        </div>
      </div>
    </section>
  );
}

const TIERS = [
  ['Lite', 'The smallest useful shape: screening on one stage, the shipped rules, and the record behind every decision.'],
  ['Standard', 'The full lifecycle — signup, payment and post-purchase — with rules and lists of your own.'],
  ['Plus', 'A model trained on your own events, with the search over model shape that finds which one to use.'],
  ['Pro', 'Platform and marketplace controls, the compliance face alongside the decide plane, and the retention that goes with it.'],
];

function ConnectPlans() {
  return (
    <section className="x-sec rk-plans">
      <div className="x-wrap">
        <div className="rk-conn">
          <div>
            <h2 className="rk-h2">How it connects</h2>
            <p className="rk-lead">In development. Risk will ingest signals and return a decision. Everything about how you take money stays where it is.</p>
          </div>
          <div className="rk-conn-r">
            {[['Keep the processor you have', 'Risk takes signals and returns a decision. It never touches a processor, so nothing about your payment stack has to move and there is no migration to schedule.'], ['Pure API', 'One call from your own system: send what you know, get back an action, a score and the reasons. A signup, a payment, a session and an agent are the same call — the stage is a field, not a different endpoint.']].map(([t, d], i) => (
              <div key={t} className="rk-conn-i"><h3>{t}</h3><p>{d}</p></div>
            ))}
          </div>
        </div>
        <div className="rk-head2">
          <h2 className="rk-h2">Plans</h2>
          <p className="rk-lead">In development. Four tiers, each a subscription with screens included and metered beyond that on the Hanzo bill you already have. A screen is one decision about one transaction, account or customer. Nothing here is priced yet.</p>
        </div>
        <ol className="rk-ladder">
          {TIERS.map(([t, d], i) => (
            <Rise as="li" key={t} delay={i * 0.07} style={{ '--h': 40 + i * 20 + '%' }}>
              <span className="rk-step" aria-hidden="true" />
              <h3>{t}</h3>
              <p>{d}</p>
            </Rise>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Not() {
  return (
    <section className="x-sec rk-not">
      <div className="x-wrap rk-not-grid">
        <div>
          <h2 className="rk-h2">What this is not</h2>
          <p className="rk-p">Hanzo does not process payments — your processor does, and <A to="/commerce">Hanzo Commerce</A> owns the money plane. There is no dispute-network integration today: Risk assembles the evidence, you submit it. No figure on this page is a customer result, because the decide plane has not carried customer traffic yet. When it has, the numbers here will be ours and measured.</p>
          <p className="rk-p">Three unmet requirements decide whether this is enough on its own, and they are named here rather than left to be found. There is no report workflow — no drafting, no approval step, no filing. There is no filing clock, so no deadline is measured anywhere. And there is no confidentiality marking on a case, so nothing in the engine keeps a case note away from the customer. What is here is the detection and the record; the filing is not.</p>
          <p className="rk-p">Anti-money-laundering compliance and fraud prevention are related jobs, not one job. <strong>/v1/aml</strong> is the compliance face, <strong>/v1/risk</strong> is the decide plane, and one engine serves both. Nearby: <A to="/idv">identity verification</A> for proving who somebody is, <A to="/guard">Guard</A> for what a model is allowed to say, and <A to="/analytics">Analytics</A> for the event plane the model reads.</p>
        </div>
        <div className="rk-next">
          <h2 className="rk-next-h">Next</h2>
          {[['Talk to us', 'Tell us which stage is costing you, and help shape what the tiers include.', '/contact-sales'], ['The API', 'One base URL and one key for every Hanzo capability, including this one.', '/api'], ['The engine, source available', 'The monitoring engine underneath the compliance face, under the Lux Ecosystem License. Read it and check the citations; commercial use outside a Lux network is licensed separately.', 'https://github.com/luxfi/aml']].map(([t, d, to], i) => (
            <div key={t}>
              <A to={to} className="rk-next-a"><b>{t}</b><span>{d}</span><i aria-hidden="true">→</i></A>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Risk() {
  return (
    <main className="rk">
      <Hero />
      <Today />
      <Compliance />
      <Lifecycle />
      <DecidesOn />
      <Model />
      <Agents />
      <RulesPlat />
      <ConnectPlans />
      <Not />
    </main>
  );
}
