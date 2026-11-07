'use client';
/* Pricing, v2 (VISION archetype E, Utility: calm, precise and fast, with one delight; PLAN-COMPONENTS 5.2).
   V2: 8/10 equal plan cards with aligned asks and prices that roll in 300ms; kit tabs, tables, FAQ and Band; no dead buttons; greys only
   Persona: a builder or a team lead choosing a plan. Goal: know the price before you ask. CTA: "Try Hanzo" on the plan
   you pick (data-cta pricing.free / pricing.go / pricing.pro); metric: cta_click on those ids.
   Thesis: know the price before you ask.
   Signature: rolling prices. Every price is an odometer whose digits roll to the figure in 300ms and is announced
   politely; the Pro card walks its own ladder (3x, 5x, 15x, unlimited: $15, $45, $95, $195) until a hand takes over,
   and on Team the seat prices and your own total roll as you change the mix.
   Open: "Compare plans" grows a sheet out of the card you pressed (synchronized.studio), its column lit.
   Beyond: the compare sheet. Hanzo's own lines for every personal plan side by side, each plan carrying what it inherits
   ("Everything in Go, plus"), so you see what each step up adds; and the seat mixer on Team.
   Removed (ledger): the dark "recommended" Pro and Team cards (no written rule for a recommendation), checkout buttons
   with no real destination (Dev, Max, Ultra and Team now offer "Chat with buying specialist"), the repeated
   "Pay as you go" price line, the invented helper sentences, the reading-row stripe.
   Every tier, price, line and footnote on Hanzo's page is here; the tabs you are not on are in the page, hidden. */
// Persona: a builder or a team lead choosing a plan
// Goal: know the price before you ask
// CTA: the selected plan's ask (Try Hanzo); metric: cta_click on pricing.free / pricing.go / pricing.pro
// Signature: rolling prices: every price is an odometer, and the Pro card walks its own ladder until you take over
// Beyond: the compare sheet: every personal plan's own lines side by side with what each inherits, opened out of the card you clicked
import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'motion/react';
import { EASE } from '../ui';
import { A, More, Cta, Tabs, TabPanel, Faq, DataTable, Band, Img } from '../kit';
import Odometer from '../v2/Odometer';
import Drawer from '../v2/x-cannon/Drawer';
import './Pricing.css';

const PAY = (p) => `/pay/confirm/card?plan=${p}&returnUrl=https%3A%2F%2Fhanzo.ai%2Fchat`;
const HELP = '/buying-specialist';

/* ---------- small parts ---------- */
// a small segmented choice inside a card (the usage ladder, the billing period)
function Seg({ opts, val, set, id, label }) {
  const keys = (e) => {
    const k = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    if (!k) return;
    e.preventDefault();
    const n = (opts.indexOf(val) + k + opts.length) % opts.length;
    set(opts[n]);
    document.getElementById(id + '-' + n)?.focus();
  };
  return (
    <div className="xpr-seg" role="radiogroup" aria-label={label} onKeyDown={keys}>
      {opts.map((o, i) => (
        <button key={o} id={id + '-' + i} type="button" role="radio" aria-checked={val === o} tabIndex={val === o ? 0 : -1} onClick={() => set(o)}>
          {val === o && <motion.span layoutId={'seg-' + id} className="xpr-seg-bg" transition={{ duration: 0.3, ease: EASE }} />}
          <span>{o}</span>
        </button>
      ))}
    </div>
  );
}

const Ck = () => <svg className="xpr-ck" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const List = ({ items }) => <ul className="xpr-list">{items.map((t) => <li key={t}><Ck />{t}</li>)}</ul>;

/* ---------- the plans, as Hanzo lists them ---------- */
const FREE = ['Chat on the web with Enso Free and Zen Free', 'Free model requests and Kai decisions included', 'Search the web from chat', 'Write, edit and create content', 'Make code, pages and charts beside the chat', 'Choose how hard it thinks'];
const GO = ['Build apps with Hanzo Dev', 'Connect any MCP server in Hanzo Dev', 'The Hanzo CLI for macOS, Windows and Linux', 'Every model, including Enso Ultra and Kai', 'Usage included on every model', 'Priority inference and priority support', 'Your own agents, working in the background', 'Automations, with daily runs included'];
const COMMON = ['Early access to new models and features', 'Train custom models on your data', 'Hanzo Engine to run models on your own hardware', 'Dedicated support'];
// to: only Pro has a checkout on Hanzo's page; the others offer the buying specialist until theirs exists
const PRO = [
  { x: '3x', name: 'Pro', price: 15, to: PAY('pro-2x'), head: 'Everything in Go, plus:', d: 'For serious builders running agents, shipping code, and needing substantially higher limits.', f: ['3x more usage than Go', '3x higher limits than Go', 'Hanzo Bot: 1 bot of your own'] },
  { x: '5x', name: 'Dev', price: 45, head: 'Everything in Pro, plus:', d: 'For serious builders running agents, shipping code, and needing substantially higher limits.', f: ['5x more usage than Go', '5x higher limits than Go', 'Hanzo Bot: 2 bots of your own'] },
  { x: '15x', name: 'Max', price: 95, head: 'Everything in Dev, plus:', d: 'For serious builders running agents, shipping code, and needing substantially higher limits.', f: ['15x more usage than Go', '15x higher limits than Go', 'Hanzo Bot: 5 bots of your own'] },
  { x: '∞', name: 'Ultra', price: 195, head: 'Everything in Max, plus:', d: 'For the biggest workloads. Usage beyond what is included is paid from your prepaid balance at list price', f: ['Highest included usage across every model', 'Continuous usage with no window resets', 'Usage beyond what is included is paid from your prepaid balance at list price', 'Hanzo Bot: 10 bots of your own'] },
];

/* the compare sheet: every personal plan's own lines; a line holds from the plan that adds it upward */
const COLS = [
  { name: 'Free', price: 'No card needed', to: '/signup' },
  { name: 'Go', price: '$8', to: PAY('go') },
  ...PRO.map((p) => ({ name: p.name, price: '$' + p.price, to: p.to })),
];
const ROWS = [
  ['Usage', [null, 'Usage included on every model', '3x more usage than Go', '5x more usage than Go', '15x more usage than Go', 'Highest included usage across every model']],
  ['Limits', [null, null, '3x higher limits than Go', '5x higher limits than Go', '15x higher limits than Go', 'Continuous usage with no window resets']],
  ['Hanzo Bot', [null, null, 'Hanzo Bot: 1 bot of your own', 'Hanzo Bot: 2 bots of your own', 'Hanzo Bot: 5 bots of your own', 'Hanzo Bot: 10 bots of your own']],
  ...FREE.map((t) => [t, 0]),
  ...GO.filter((t) => t !== 'Usage included on every model').map((t) => [t, 1]),
  ...COMMON.map((t) => [t, 2]),
  ['Usage beyond what is included is paid from your prepaid balance at list price', 5],
];

function Compare({ lit }) {
  const cols = [
    { key: 'line', label: <span className="x-sr">Plan line</span> },
    ...COLS.map((c, i) => ({
      key: 'c' + i,
      subject: i === lit,
      label: (
        <span className="xpr-cmp-h">
          <b>{c.name}</b>
          <span className={c.price.startsWith('$') ? 'xpr-cmp-p' : 'xpr-cmp-p word'}>{c.price}{c.price.startsWith('$') && <small> USD/month</small>}</span>
        </span>
      ),
    })),
  ];
  const rows = ROWS.map(([label, v]) => {
    const r = { line: label };
    COLS.forEach((c, i) => {
      const cell = Array.isArray(v) ? v[i] : i >= v;
      r['c' + i] = cell === true ? <><Ck /><span className="x-sr">Included</span></> : cell || null;
    });
    return r;
  });
  return <DataTable caption="Compare plans" cols={cols} rows={rows} gap="Not included" className="xpr-cmp" />;
}

// on a phone the sheet shows one plan's column at a time, picked here (the columns stay in the table)
function CompareSheet({ lit }) {
  const [one, setOne] = useState(Math.max(0, lit));
  useEffect(() => setOne(Math.max(0, lit)), [lit]);
  return (
    <div className="xpr-cmpwrap" data-one={one}>
      <div className="xpr-cmp-pick"><Seg opts={COLS.map((c) => c.name)} val={COLS[one].name} set={(v) => setOne(COLS.findIndex((c) => c.name === v))} id="xpr-cmp-one" label="Compare plans" /></div>
      <Compare lit={one} />
    </div>
  );
}

/* a plan card: its rows sit on the card grid's shared rows, so every name, price and ask lines up across the cards */
// the selected column carries the one solid ask; pointing previews, a click or focus selects (PLAN 2.4: lowest by default)
const picker = (on, pick) => ({
  'data-selected': on || undefined,
  onClick: (e) => { if (!e.target.closest('a, button')) pick(); },
  onFocusCapture: pick,
});

function Plan({ name, d, price, sub, cta, note, head, items, open, sel, pick, className = '' }) {
  return (
    <article className={'xpr-plan' + (className ? ' ' + className : '')} {...picker(sel, pick)}>
      <div className="xpr-r-name"><h2>{name}</h2></div>
      <p className="xpr-d">{d}</p>
      <div className="xpr-price" aria-live="polite">{price}</div>
      <p className="xpr-sub">{sub}</p>
      <div className="xpr-r-cta">{cta}</div>
      <p className="xpr-note">{note}</p>
      <div className="xpr-inc">
        <p className="xpr-inc-h">What’s included</p>
        {head && <p className="xpr-head">{head}</p>}
        <List items={items} />
      </div>
      <button type="button" className="xpr-more" onClick={open} data-cursor=""><span>Compare plans</span><span aria-hidden="true">→</span></button>
    </article>
  );
}

function ProCard({ open, sel, pick, active }) {
  const ref = useRef(null);
  const seen = useInView(ref, { amount: 0.5 });
  const calm = useReducedMotion();
  const [x, setX] = useState('3x');
  const [mine, setMine] = useState(false);
  const at = PRO.findIndex((p) => p.x === x);
  // idle: the card walks its ladder once (Pro, Dev, Max, Ultra, back to Pro) within 4.3 s and rests (WCAG 2.2.2: moving
  // content under 5 s needs no pause control); a pointer or focus stops it at once
  useEffect(() => {
    if (mine || calm || !seen) return;
    let n = 0, t = 0;
    const step = () => { n += 1; setX(PRO[n % PRO.length].x); if (n >= PRO.length) { clearInterval(t); setMine(true); } };
    const first = setTimeout(() => { step(); t = setInterval(step, 1100); }, 1000);
    return () => { clearTimeout(first); clearInterval(t); };
  }, [mine, calm, seen]);
  const p = PRO[at];
  // each row holds all four variants in one cell, so the card never changes height as it walks
  const vary = (fn, cls = '') => (
    <div className={'xpr-vars ' + cls}>
      {PRO.map((q, i) => <div key={q.x} className={'xpr-var' + (i === at ? ' on' : '')} aria-hidden={i !== at} inert={i !== at}>{fn(q)}</div>)}
    </div>
  );
  return (
    <article className="xpr-plan xpr-pro" ref={ref} onPointerEnter={() => setMine(true)} onFocus={() => setMine(true)} {...picker(sel, pick)}>
      <div className="xpr-r-name">
        <h2 className="xpr-pro-name">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span key={p.name} initial={{ y: '90%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '-90%', opacity: 0 }} transition={{ duration: 0.3, ease: EASE }}>{p.name}</motion.span>
          </AnimatePresence>
        </h2>
        <Seg opts={PRO.map((q) => q.x)} val={x} set={(v) => { setMine(true); setX(v); }} id="xpr-mult" label="Usage multiple" />
      </div>
      {vary((q) => <p className="xpr-d">{q.d}</p>, 'r-d')}
      <div className="xpr-price" aria-live="polite"><Odometer value={'$' + p.price} /><span className="xpr-u">USD/month</span></div>
      <p className="xpr-sub">Billed monthly</p>
      {vary((q) => (q.to ? <Cta to={q.to} kind={sel ? 'solid' : 'quiet'} size="lg" id="pricing.pro" className="xpr-cta" thumb={active && sel}>Try Hanzo</Cta> : <Cta to={HELP} kind="quiet" size="lg" id="pricing.help" className="xpr-cta">Chat with buying specialist</Cta>), 'xpr-r-cta')}
      <p className="xpr-note">No commitment · Cancel anytime</p>
      {vary((q) => (
        <div className="xpr-inc">
          <p className="xpr-inc-h">What’s included</p>
          <p className="xpr-head">{q.head}</p>
          <List items={q.f} />
        </div>
      ), 'r-inc')}
      <button type="button" className="xpr-more" onClick={(e) => open(e, 2 + at)} data-cursor=""><span>Compare plans</span><span aria-hidden="true">→</span></button>
    </article>
  );
}

// Hanzo's own trust links, beside the asks (PLAN-COMPONENTS 2.4 "Pricing objections")
const Trust = () => (
  <div className="xpr-trust">
    <More to="/security">How Hanzo is secured</More>
    <More to="/trust">Trust center</More>
    <More to="/privacy">Read the Privacy Policy</More>
  </div>
);

function Personal({ open, sel, setSel, active }) {
  const k = (i) => (sel === i ? 'solid' : 'quiet');
  return (
    <>
      <div className="xpr-plans">
        <Plan name="Free" d="Chat and build with Hanzo, free." price={<span className="xpr-free">No card needed</span>} cta={<Cta to="/signup" kind={k(0)} size="lg" id="pricing.free" className="xpr-cta" thumb={active && sel === 0}>Try Hanzo</Cta>} note="Instant access · Free forever" items={FREE.slice(0, 4)} open={(e) => open(e, 0)} sel={sel === 0} pick={() => setSel(0)} />
        <Plan name="Go" d="Your everyday AI development toolkit, with access to every model and more included usage." price={<><Odometer value="$8" /><span className="xpr-u">USD/month</span></>} sub="Billed monthly" cta={<Cta to={PAY('go')} kind={k(1)} size="lg" id="pricing.go" className="xpr-cta" thumb={active && sel === 1}>Try Hanzo</Cta>} note="No commitment · Cancel anytime" head="Everything in Free, plus:" items={GO.slice(0, 4)} open={(e) => open(e, 1)} sel={sel === 1} pick={() => setSel(1)} />
        <ProCard open={open} sel={sel === 2} active={active} pick={() => setSel(2)} />
      </div>
      <Trust />
    </>
  );
}

/* ---------- Team: seat prices, and a mixer that prices your own team ---------- */
const SEAT = { Standard: [20, 25], Premium: [100, 125] };

function Stepper({ label, n, set, min, max }) {
  return (
    <div className="xpr-step" role="group" aria-label={label}>
      <button type="button" onClick={() => set(n - 1)} disabled={n <= min} aria-label={label + ' −'}>−</button>
      <output aria-live="polite">{n}</output>
      <button type="button" onClick={() => set(n + 1)} disabled={n >= max} aria-label={label + ' +'}>+</button>
    </div>
  );
}

function Team({ active }) {
  const [sel, setSel] = useState(0);
  const [bill, setBill] = useState('Annual');
  const yr = bill === 'Annual';
  const [std, setStd] = useState(2);
  const [prem, setPrem] = useState(0);
  const k = yr ? 0 : 1;
  const total = std * SEAT.Standard[k] + prem * SEAT.Premium[k];
  // from 2 members to 100, in any mix
  const setS = (v) => setStd(Math.max(Math.max(0, 2 - prem), Math.min(100 - prem, v)));
  const setP = (v) => setPrem(Math.max(Math.max(0, 2 - std), Math.min(100 - std, v)));
  return (
    <>
      <div className="xpr-plans two">
        <article className="xpr-plan xpr-team" {...picker(sel === 0, () => setSel(0))}>
          <div className="xpr-r-name">
            <h2>Team</h2>
            <div className="xpr-bill"><Seg opts={['Annual', 'Monthly']} val={bill} set={setBill} id="xpr-bill" label="Billing period" /><span className="xpr-save">−20%</span></div>
          </div>
          <p className="xpr-d">For teams of 2 to 100: every model and usage for each member, one workspace, one bill.</p>
          <div className="xpr-price" aria-live="polite"><Odometer value={'$' + total.toLocaleString('en-US')} /><span className="xpr-u">USD/month</span></div>
          <div className="xpr-seats">
            <div>
              <b>Standard seat</b>
              <span>All Hanzo features, plus more usage than Pro</span>
              <p className="xpr-seat-p" aria-live="polite"><Odometer value={'$' + SEAT.Standard[k]} /></p>
              <small>Per seat / month if billed annually. $25 if billed monthly.</small>
              <Stepper label="Standard seat" n={std} set={setS} min={Math.max(0, 2 - prem)} max={100 - prem} />
            </div>
            <div>
              <b>Premium seat</b>
              <span>5x more usage than standard seats</span>
              <p className="xpr-seat-p" aria-live="polite"><Odometer value={'$' + SEAT.Premium[k]} /></p>
              <small>Per seat / month if billed annually. $125 if billed monthly.</small>
              <Stepper label="Premium seat" n={prem} set={setP} min={Math.max(0, 2 - std)} max={100 - std} />
            </div>
          </div>
          <div className="xpr-r-cta"><Cta to={HELP} kind={sel === 0 ? 'solid' : 'quiet'} size="lg" id="pricing.team" className="xpr-cta" thumb={active && sel === 0}>Chat with buying specialist</Cta></div>
          <div className="xpr-note xpr-note-l">
            <p>Standard &amp; Premium seats · From 2 members</p>
            <p>Organizations can mix Standard and Premium seats · Cancel anytime</p>
          </div>
          <div className="xpr-inc">
            <p className="xpr-inc-h">What’s included</p>
            <List items={["Add premium seats to raise the team's shared usage", 'One shared workspace: chat, meetings, calendar and contacts', 'Single sign-on, roles and an audit log', 'One bill for the whole team', 'Automations, with daily runs included']} />
          </div>
        </article>
        <article className="xpr-plan xpr-ent" {...picker(sel === 1, () => setSel(1))}>
          <div className="xpr-r-name"><h2>Enterprise</h2></div>
          <p className="xpr-d">For large businesses operating at scale</p>
          <p className="xpr-price word">Seat price + usage at API rates</p>
          <p className="xpr-sub">US$20/seat/month, billed annually, 20 seat minimum. Usage cost scales with model and task.</p>
          <div className="xpr-r-cta"><Cta to="/enterprise/start" kind={sel === 1 ? 'solid' : 'quiet'} size="lg" id="pricing.enterprise" className="xpr-cta" thumb={active && sel === 1}>Get Enterprise plan</Cta></div>
          <p className="xpr-note"><A to={HELP} className="xpr-alt">Chat with buying specialist</A></p>
          <div className="xpr-inc">
            <p className="xpr-inc-h">What’s included</p>
            <p className="xpr-head">All Team plan features, plus:</p>
            <List items={['Audit logs', 'SCIM provisioning through Hanzo IAM']} />
          </div>
        </article>
      </div>
      <Trust />
    </>
  );
}

/* ---------- API: plans, the way we bill, rates, models ---------- */
const BILL = [
  ['Model inference', 'per token, five tiers', 'Input, cached reads, cache writes, output and reasoning are metered as five disjoint tiers, at the tariff for the completion window the request asked for.', ['input', 'cache_read', 'cache_write', 'output', 'reasoning']],
  ['Computer', 'per second, while running', 'vCPU and memory on what the machine was given. Nothing to create one, nothing while it sleeps, and the boot disk is inside the allowance — so a computer waiting between turns meters nothing.'],
  ['Web tools', 'per call', 'Priced from what the provider charged, so a web call is booked after it runs. A fetch the domain policy refuses is stopped before the request and costs nothing.'],
  ['Media generation', 'what the job cost', "Billed once per finished job at its real cost; a render cannot be quoted before it runs, so it is admitted against the headroom under the agent's per-task cap instead. A job that fails is not billed."],
];
const RATES = [
  ['Computer · vCPU', ['$0.0504/hr', '$0.000014/second'], 'Charged by the second, while running.'],
  ['Computer · memory', ['$0.0162/GiB-hr', '$0.0000045/GiB-second'], 'Charged by the second, on the memory the machine was given.'],
  ['Computer · paused', ['$0'], 'No vCPU, no memory, no storage.'],
  ['Computer · created', ['$0'], 'There is no creation fee.'],
  ['web_search', ['$0.002158/call'], 'One query, up to ten results.'],
  ['web_fetch', ['$0.001079/call'], 'One page read as text.'],
  ['MCP, SDK and CLI', ['$0'], 'The interfaces are not metered.'],
  ['Seats', ['$0'], 'No per-seat fee, however many people use the organization.'],
];
const WINDOWS = [['immediate', 'Answers now, at the highest tariff.'], ['priority', 'Answers soon, at a lower one.'], ['loose', 'Answers eventually, at the lowest.']];

const M = (name, tags, d, chips, price, o = {}) => ({ name, tags, d, chips, price, ...o });
const GROUPS = [
  {
    h: 'Hanzo Enso', d: 'Flagship frontier models — Flash, Pro, and Ultra. Live per-token retail, one API key.', link: ['Explore Enso', '/enso'],
    rows: [
      M('Enso Flash', ['pro'], 'Fast, economical Enso tier for high-volume, low-latency everyday work, with 1M-context overflow.', ['1M context window', 'Low latency'], ['$0.33 / MTok', '$1.65 / MTok', '$0.4125 / MTok', '$0.033 / MTok'], { cta: 'Start Using enso-flash' }),
      M('Enso', ['ultra max'], "Hanzo's proprietary frontier model — Opus-class reasoning by default with 1M-context overflow.", ['1M context window', 'Frontier reasoning'], ['$0.33 / MTok', '$1.65 / MTok', '$0.4125 / MTok', '$0.033 / MTok'], { cta: 'Start Using enso' }),
      M('enso-pro', ['pro'], '', [], ['$4.4 / MTok', '$22 / MTok', '$5.5 / MTok', '$0.22 / MTok'], { cta: 'Start Using enso-pro' }),
      M('Enso Ultra', ['ultra max'], 'Adaptive fan-out — probes a task-appropriate model, escalates to a top-K panel only when needed, then verifies-then-selects the best answer.', ['200K context window', 'Adaptive fan-out'], ['$5.5 / MTok', '$27.5 / MTok', '$6.875 / MTok', '$0.275 / MTok'], { cta: 'Start Using enso-ultra' }),
    ],
  },
  {
    h: 'Zen Models', d: '8 models across LLM, embedding, reranker, image, audio, and video', legend: ['ultra max', 'ultra', 'pro max', 'pro'], extra: 'Updated Nov 6, 2026', link: ['Full Model Catalog', '/zen/models'],
    rows: [
      M('Zen Guard — Content Safety', ['starter'], 'Safety classifier for moderation and guardrails across a broad category and language set.', ['128K context', 'Safety classifier'], ['Free', 'Free']),
      M('Zen VL — Vision-Language', ['pro'], 'Reads images and reasons over them — visual Q&A, document and chart understanding, grounded captioning.', ['128K context', 'Vision + Language'], ['Free', 'Free'], { cta: 'Start Using zen-vl' }),
      M('Zen5 (Default)', ['pro'], 'Canonical Zen5 default. a 35B frontier MoE (3B active) (35B total / 3B active per token, released Apr 2026, Apache-2.0). 256K context, agentic-trained, OpenAI + Anthropic API. The everyday Zen5 chat model.', ['256K context window', '35B total / 3B active (MoE)', 'Zen base', 'Apr 2026 release', 'OpenAI + Anthropic API'], ['Free', 'Free'], { cta: 'Start Using zen5', spec: [['Parameters:', '35B (3B active)'], ['Architecture:', 'Zen frontier MoE']] }),
      M('Zen5 Coder', ['pro'], 'Code-specialized Zen5 tier. 80B sparse MoE tuned for repo-scale code understanding, agentic refactoring, and tool-use coding loops.', ['256K context', '80B sparse MoE', 'Code-specialized', 'Agentic / tool-use'], ['Free', 'Free'], { cta: 'Start Using zen5-coder', spec: [['Parameters:', '80B (MoE)'], ['Architecture:', 'Zen Coder MoE']] }),
      M('Zen5 Flash', ['starter'], 'Smallest and cheapest text-only Zen5 chat tier. 4B-class dense, sub-100ms TTFT, 32K context. For high-volume routing and simple agent loops.', ['32K context window', '4B parameters (dense)', 'Sub-100ms TTFT', 'Highest throughput'], ['Free', 'Free'], { cta: 'Start Using zen5-flash', spec: [['Parameters:', '4B'], ['Architecture:', 'Zen dense']] }),
      M('Zen5 Mini', ['pro'], 'Frontier agentic at the lowest cost in the family. Built on a 230B agentic MoE (10B active) (230B MoE / 10B active, released Feb 2026). 80.2% SWE-Bench Verified, 76.3% BrowseComp; trained on 200K+ real-world environments via large-scale RL.', ['192K context window', '230B total / 10B active (MoE)', 'Zen agentic base', 'Frontier agentic / coding', 'Lowest $/token in family'], ['Free', 'Free'], { cta: 'Start Using zen5-mini', spec: [['Parameters:', '230B (10B active)'], ['Architecture:', 'Zen MoE']] }),
      M('Zen5 Pro', ['ultra'], 'Zen Flash IQ2_XXS-imatrix weights (81 GB GGUF on zenlm/zen-5-pro-gguf). 284B total / 37B active per token, 1M context, asymmetric routed-MoE quant. Fits a single 128 GB Apple Silicon / DGX Spark / H100 80 GB.', ['1M context window', '284B total / 37B active (MoE)', 'Zen Flash base', 'IQ2_XXS-imatrix quant (81 GB)', 'Runs on 128 GB hardware'], ['Free', 'Free'], { cta: 'Start Using zen5-pro', spec: [['Parameters:', '284B (37B active)'], ['Architecture:', 'Zen Flash MoE']] }),
    ],
    after: <p className="xpr-after">All Zen LLMs available via OpenAI-compatible API at <code>api.hanzo.ai/v1/chat/completions</code></p>,
  },
  {
    h: 'Embedding Models', d: <>High-quality text embeddings via <code>/v1/embeddings</code></>,
    rows: [M('Zen Embedding', ['starter'], 'Dense text embeddings for semantic search, retrieval, and clustering.', ['8K context', 'Embeddings'], ['$0.01 / MTok', '$0.01 / MTok', '$0.0125 / MTok', '$0.01 / MTok'])],
    after: <p className="xpr-after">Prompt caching pricing is for the standard 5-minute TTL. A longer one costs more.</p>, cta: ['Try Hanzo', '/login'],
  },
  {
    h: 'Hanzo Kai', d: <>The decision model: a typed answer to each question, via <code>/v1/decisions</code></>, link: ['Explore Kai', '/kai'],
    rows: [
      M('Kai', ['starter'], "Hanzo's decision model: a typed answer with a probability on every option, at POST /v1/decisions. A native decision writes 0 output tokens.", ['choice, score and noul questions', 'A probability on every option', '0 output tokens'], ['$0.021 / MTok', 'Free', '$0.026250000000000002 / MTok', '$0.0021000000000000003 / MTok'], { spec: [['Parameters:', '322.1M encoder, 60.2M yes/no reader'], ['Architecture:', 'Encoder (mmBERT-base, 22 layers × 768)']], end: '/v1/decisions' }),
      M('Zen 6', ['starter'], 'Zen 6 answering typed decisions at /v1/decisions under a strict JSON schema. $2.28 per million input tokens and $7.26 per million output tokens.', ['Decisions'], ['$2.28 / MTok', '$7.26 / MTok', '$2.8499999999999996 / MTok', '$0.22799999999999998 / MTok'], { spec: [['Architecture:', 'decision']], end: '/v1/decisions' }),
      M('Zen 6 Flash', ['starter'], 'Zen 6 Flash answering typed decisions at /v1/decisions under a strict JSON schema. $2.28 per million input tokens and $7.26 per million output tokens.', ['Decisions'], ['$2.28 / MTok', '$7.26 / MTok', '$2.8499999999999996 / MTok', '$0.22799999999999998 / MTok'], { spec: [['Architecture:', 'decision']], end: '/v1/decisions' }),
    ],
  },
];
const TOOLS = [['Web Search', 'per call', '0.002158'], ['Code Interpreter', 'per session minute', '0.03'], ['File Storage', 'per GB/month', '0.2'], ['Image Generation', 'per image', '0.04'], ['Speech-to-Text', 'per minute', '0.006'], ['Text-to-Speech', 'per 1M characters', '15'], ['Web Fetch', 'per call', '0.001079']];

// a few rates arrive with floating-point dust (0.026250000000000002): shown at their real precision (0.02625)
const clean = (v) => v && v.replace(/\d+\.\d{9,}/g, (m) => String(+(+m).toPrecision(10)));

const MCOLS = [
  { key: 'm', label: 'Model' },
  { key: 'i', label: 'Input', num: true },
  { key: 'o', label: 'Output', num: true },
  { key: 'w', label: 'Cache write', num: true },
  { key: 'r', label: 'Cache read', num: true },
];
const cellOf = (r) => {
  const more = r.d || r.spec || r.chips.length || r.end || r.cta;
  const name = <span className="xpr-nm"><b>{r.name}</b>{r.tags.map((t) => <em key={t}>{t}</em>)}</span>;
  if (!more) return <span className="xpr-m">{name}</span>;
  return (
    <details className="xpr-m">
      <summary>{name}<i aria-hidden="true" /><span className="x-sr">Read more</span></summary>
      <span className="xpr-m-body">
        {r.d && <span className="xpr-m-d">{r.d}</span>}
        {r.spec && <span className="xpr-m-spec">{r.spec.map(([k, v]) => <span key={k}><span className="xpr-m-k">{k}</span> {v}</span>)}</span>}
        {r.chips.length > 0 && <span className="xpr-chips">{r.chips.map((c) => <span key={c}>{c}</span>)}</span>}
        {r.end && <code>{r.end}</code>}
        {r.cta && <A to="/chat" className="xpr-use">{r.cta}</A>}
      </span>
    </details>
  );
};

function Models() {
  return (
    <div className="xpr-groups">
      {GROUPS.map((g, gi) => (
        // one family open at a time on arrival; the rest fold under their name (every row stays in the HTML)
        <details key={g.h} className="xpr-group" open={gi === 0}>
          <summary className="xpr-group-s"><h4>{g.h}</h4><span className="xpr-group-n" aria-hidden="true">{g.rows.length}</span><i aria-hidden="true" /></summary>
          <div className="xpr-group-h">
            <p>{g.d}</p>
            {g.legend && <span className="xpr-chips">{g.legend.map((t) => <span key={t}>{t}</span>)}</span>}
            {g.extra && <small>{g.extra}</small>}
            {g.link && <More to={g.link[1]}>{g.link[0]}</More>}
          </div>
          <DataTable
            caption={g.h}
            cols={MCOLS}
            rows={g.rows.map((r) => { const [i, o, w, c] = r.price.map(clean); return { m: cellOf(r), i, o, w, r: c }; })}
            className="xpr-mt"
          />
          {g.after}
          {g.cta && <A to={g.cta[1]} className="xpr-use">{g.cta[0]}</A>}
        </details>
      ))}
    </div>
  );
}

function Api({ active }) {
  return (
    <>
      <div className="xpr-plans two">
        <article className="xpr-plan xpr-payg">
          <div className="xpr-r-name"><h2>Pay as you go</h2></div>
          <p className="xpr-d">Direct metered access to all frontier models, coding agents, and tools with zero commitments.</p>
          <p className="xpr-price word">Metered per token &amp; second</p>
          <p className="xpr-sub" aria-hidden="true" />
          <div className="xpr-r-cta"><Cta to="/dev" size="lg" id="pricing.api.key" className="xpr-cta" thumb={active}>Get API Key</Cta></div>
          <p className="xpr-note">Instant access · No minimum spend</p>
          <div className="xpr-inc"><p className="xpr-inc-h">What’s included</p><List items={['Frontier & open-source models via unified API', 'OpenAI-compatible /v1/chat/completions endpoint', 'Intelligent semantic auto-routing & fallback', 'Prompt caching discounts up to 90%', 'Sandboxed code execution, web search & tools', 'Real-time spend limits, webhooks & usage alerts']} /></div>
        </article>
        <article className="xpr-plan xpr-vol">
          <div className="xpr-r-name"><h2>Volume &amp; Dedicated</h2></div>
          <p className="xpr-d">For organizations with high-throughput inference, custom routing, or dedicated VPC deployments.</p>
          <p className="xpr-price word">Custom rates</p>
          <div className="xpr-sub"><p>Volume discounts from $5k/mo</p><p>Dedicated GPU clusters &amp; custom routing SLAs</p></div>
          <div className="xpr-r-cta"><Cta to="/contact-sales" kind="quiet" size="lg" id="pricing.api.sales" className="xpr-cta">Contact API Sales</Cta></div>
          <p className="xpr-note">Dedicated VPC &amp; 24/7 Slack support available</p>
          <div className="xpr-inc"><p className="xpr-inc-h">What’s included</p><p className="xpr-head">Everything in Pay as you go, plus:</p><List items={['Committed-use volume discounts starting at $5k/mo', 'Dedicated GPU clusters (H100, B200) in your cloud or VPC', 'Custom rate limits exceeding 100k+ RPM', 'Zero data retention & HIPAA / BAA compliance', '24/7 dedicated engineering Slack & priority routing']} /></div>
        </article>
      </div>

      <section className="xpr-ch xpr-split" aria-labelledby="xpr-bill-h">
        <header className="xpr-sh xpr-stick">
          <h2 id="xpr-bill-h">How we bill</h2>
          <p>Transparent pricing based on what your models, agents, and tools use. Predictable, metered, and with no hidden fees.</p>
        </header>
        <ol className="xpr-bills">
          {BILL.map(([n, u, d, tiers], i) => (
            <li key={n}>
              <span className="xpr-bills-n">{String(i + 1).padStart(2, '0')}</span>
              <h3>{n}</h3>
              <span className="xpr-unit">{u}</span>
              <p>{d}</p>
              {tiers && <span className="xpr-chips mono">{tiers.map((t) => <span key={t}>{t}</span>)}</span>}
            </li>
          ))}
        </ol>
      </section>

      <section className="xpr-ch xpr-split" aria-labelledby="xpr-rates-h">
        <header className="xpr-sh xpr-stick">
          <h3 id="xpr-rates-h">The rates</h3>
          <p>Every rate here is the price you pay: the one on your bill, and the one your usage page shows.</p>
        </header>
        {/* the first three rates show; the rest fold behind the register's "Read more" (every rate stays in the HTML) */}
        <div>
          <ul className="xpr-rates">
            {RATES.slice(0, 3).map(([n, v, note]) => (
              <li key={n}>
                <b>{n}</b>
                <span className="xpr-rate">{v.map((x) => <span key={x}>{x}</span>)}</span>
                <span className="xpr-rate-n">{note}</span>
              </li>
            ))}
          </ul>
          <details className="xpr-faq-more xpr-rates-more">
            <summary><span>Read more</span><span className="xpr-faq-n" aria-hidden="true">+ {RATES.length - 3}</span></summary>
            <ul className="xpr-rates">
              {RATES.slice(3).map(([n, v, note]) => (
                <li key={n}>
                  <b>{n}</b>
                  <span className="xpr-rate">{v.map((x) => <span key={x}>{x}</span>)}</span>
                  <span className="xpr-rate-n">{note}</span>
                </li>
              ))}
            </ul>
          </details>
        </div>
      </section>

      <section className="xpr-ch" aria-labelledby="xpr-win-h">
        <header className="xpr-sh">
          <h3 id="xpr-win-h">The completion window is the biggest lever</h3>
          <p>The same model at a different window is a different price, chosen per request. Pay the interactive tariff only when a person is waiting.</p>
        </header>
        <ol className="xpr-wins">
          {WINDOWS.map(([n, d], i) => (
            <li key={n}>
              <span className="xpr-stair" aria-hidden="true">{[0, 1, 2].map((s) => <i key={s} className={s < 3 - i ? 'on' : ''} />)}</span>
              <b>{n}</b>
              <p>{d}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="xpr-ch" aria-labelledby="xpr-models-h">
        <header className="xpr-sh">
          <h3 id="xpr-models-h">Every model, at the price on your bill</h3>
          <p>Model inference is metered per token in five disjoint tiers, at the tariff for the completion window the request asked for.</p>
        </header>
        <Models />
      </section>

      <section className="xpr-ch" aria-labelledby="xpr-tools-h">
        <header className="xpr-sh"><h2 id="xpr-tools-h">Explore pricing for tools</h2></header>
        <DataTable caption="Explore pricing for tools" cols={[{ key: 'n', label: 'Tool' }, { key: 'u', label: 'Unit' }, { key: 'p', label: 'Price', num: true }]} rows={TOOLS.map(([n, u, p]) => ({ n, u, p }))} className="xpr-tt" />
        <p className="xpr-after">*Does not include input and output tokens required to process requests</p>
        <div className="xpr-ends">
          <Cta to="/login" kind="quiet" size="lg" id="pricing.api.try">Try Hanzo</Cta>
          <More to="/models">View third-party model rates (Claude, GPT, Gemini, Grok, DeepSeek...)</More>
        </div>
      </section>
    </>
  );
}

/* ---------- questions ---------- */
const QA = [
  ['What is free?', 'Running your own private AI on your own machine, and the open Zen weights, free forever. The free models on the API, on a daily pool. Everything open source is yours to download and run.'],
  ['What does a plan cost?', 'Exactly the price on its card, by the month or, where a year is sold, by the year. Free costs nothing. Team is priced per member, from 2 members. Paid plans include usage on every model; top up prepaid credit anytime for more. Enterprise is priced with our team.'],
  ["What happens when I reach my plan's included usage?", "Switch to Enso Free and keep chatting, or keep using any model with prepaid credit, which you can add anytime. Your plan's usage renews every billing period."],
  ['What is a bill made of?', 'Four components, and every charge is one of them: model inference, the computer an agent runs on, web tools, and media generation. Each appears on your spend breakdown under its own name, so a month adds up to four lines you can check rather than one you have to trust.'],
  ['Which charges are quoted before they run?', "Model calls and compute. Both can be bounded from above before they happen, so an agent that would breach its budget is refused rather than discovered on an invoice. Web calls and media renders cannot be — a provider's charge and a render's cost are only known afterwards — so those are billed at what they actually cost, and a render runs only while the agent's per-task cap has room for it."],
  ['How are tokens billed?', 'Per token, in five tiers that never overlap: input, cached reads, cache writes, output and reasoning, at the tariff for the completion window the request asked for. Amounts are carried as integer micro-dollars, so nothing rounds in our favor.'],
  ['What is a completion window?', 'How soon you need the answer, chosen per request, and the biggest lever you have on what a call costs — the same model at a different window is a different price. Ask for it immediately and you pay the interactive tariff; ask for it soon, or eventually, and you pay less. Pay the interactive rate only when a person is actually waiting.'],
  ['What does a computer cost when nothing is running on it?', 'Nothing. vCPU and memory meter by the second while the machine runs, on what it was given. Creating one is free, a paused one has no vCPU, no memory and no storage, and its boot disk is inside the allowance — so an agent waiting between turns meters nothing at all.'],
  ['Are MCP, the SDK and the CLI metered?', 'No. The interfaces are free; only the work they ask for is metered. Connecting an editor, a terminal or an agent framework costs nothing by itself.'],
  ['How are web tools billed?', 'Per call, priced from what the provider charged us, so a web call is booked after it runs rather than quoted before it. A fetch your own domain policy refuses never leaves the process, so it costs nothing.'],
  ['How is media generation billed?', "Once per finished job, at what the job actually cost. A render cannot be priced before it runs, so it runs only while the agent's per-task cap has room for it. A job that fails is not billed."],
  ['Are failed calls billed?', 'No. A call or a job that fails is not billed, and any amount it set aside from a budget is returned. A request your own policy refuses is stopped before it is sent and costs nothing.'],
  ['Do you mark up model prices?', 'The rate shown beside a model is the price on your bill: the rates on this page are read from the same place the meter reads them. Our own costs are measured against vendor invoices rather than published rate cards, which overstate real cost substantially.'],
  ['Is streaming billed differently?', 'No. The same tokens at the same tariff, streamed or not.'],
  ['How do budgets work?', 'Every agent carries one: a cap per period and a cap per task. A call that can be quoted is quoted before it runs, and if it would breach the cap it is refused rather than discovered on an invoice. The agent is told in-band, so it can wrap up rather than crash, and a session paused at its cap resumes when the cap is raised. The exact fields and the order of the checks are in the docs.'],
  ['What are the rate limits?', 'The free pool is counted per day. Paid accounts get high limits; Enterprise can arrange dedicated ones.'],
  ['Can I separate environments?', 'Yes. Keys belong to an organization and can be scoped to a project or a service account, so development, staging and production carry their own keys and their own spend.'],
  ['How do I migrate from OpenAI or Anthropic?', 'Point your client at api.hanzo.ai/v1 with a Hanzo key. The chat, embeddings and tool-calling surfaces are compatible, and the same models answer at the same endpoint alongside every other lab’s. Tools work natively, and over MCP through the @hanzo/mcp server, which Claude Code, Cursor, Codex and Zed run from one npx line.'],
  ['What payment methods do you accept?', 'All major cards, and crypto on pay-as-you-go. Enterprise customers can arrange invoicing and PO terms. Payments are processed by our payment provider; we never store your card.'],
  ['Is there a minimum spend or a lock-in?', 'No minimum. A plan renews for the term you bought, a month or a year. Cancel any time; what you already paid for stays yours until the period ends.'],
  ['Do you offer annual billing?', 'Yes, for teams. Choose Annual on the Enterprise card to pay for a whole year at once, which saves 92% against paying monthly.'],
  ['Do you train on my data?', 'No. Your content is yours. We use industry-standard encryption in transit and at rest, and you can request deletion at any time.'],
  ['Do you support SSO?', 'Enterprise accounts sign in through their own identity provider over OIDC or SAML, with SCIM provisioning and org-scoped roles.'],
  ['Where do I check uptime and incidents?', 'status.hanzo.ai, which every dashboard links to.'],
  ['Do you offer pricing for education or nonprofits?', 'Yes, for both. Contact sales with your institution or nonprofit credentials and we will sort out the right rate.'],
];

/* ---------- the hero object: the models the bill covers, as Hanzo's own art ---------- */
// "every model on one bill": Enso, Zen and Kai deal onto the page, then the strip answers the plan you pick with the
// models that plan's own lines name: Free lights "Enso Free and Zen Free"; Go and every plan above it light "Every model,
// including Enso Ultra and Kai". A model the plan does not cover rests low and small (never dimmed). Hanzo's media is the only colour.
const ART = [['enso', 'Enso'], ['zen', 'Zen'], ['kai', 'Kai']];
function Art({ lit }) {
  return (
    <div className="xpr-art" aria-hidden="true">
      {ART.map(([s, n], i) => (
        <span key={s} className={'xpr-art-c' + (i === 0 ? ' big' : '')} style={{ '--i': i }} data-on={lit.includes(i)}>
          <Img src={`/models/${s}.webp`} w={i ? 192 : 320} h={240} priority={i === 0} />
          <b>{n}</b>
        </span>
      ))}
    </div>
  );
}

/* ---------- the room ---------- */
const TABS = ['Personal', 'Team', 'API'];

export default function Pricing() {
  const [tab, setTab] = useState(0);
  const [sel, setSel] = useState(0); // the personal plan picked (Free by default, the lowest)
  const artOn = tab === 0 && sel === 0 ? [0, 1] : [0, 1, 2];
  const [src, setSrc] = useState(null);
  const [lit, setLit] = useState(-1);
  useEffect(() => {
    const read = () => {
      const h = decodeURIComponent(location.hash.slice(1)).toLowerCase();
      const t = TABS.findIndex((x) => x.toLowerCase() === h);
      if (t >= 0) setTab(t);
    };
    read();
    addEventListener('hashchange', read);
    return () => removeEventListener('hashchange', read);
  }, []);
  const pick = (i) => { setTab(i); try { history.replaceState(null, '', '#' + TABS[i].toLowerCase()); } catch { /* the tab still changes */ } };
  const open = useCallback((e, col) => { setLit(col); setSrc(e.currentTarget.closest('article') || e.currentTarget); }, []);
  const close = useCallback(() => setSrc(null), []);
  return (
    <main className="xpr">
      <section className="xpr-hero" aria-labelledby="xpr-h1">
        <div className="xpr-w xpr-hero-g">
          <h1 id="xpr-h1" className="xpr-h1"><span className="xpr-cut"><span>Pricing</span></span></h1>
          <p className="xpr-lede">Start free, every model on one bill.</p>
          <Art lit={artOn} />
        </div>
      </section>
      <div className="xpr-room">
        <div className="xpr-tabs">
          <div className="xpr-w"><Tabs id="xpr-plans" label="Plans" tabs={TABS} value={tab} onChange={pick} size="lg" /></div>
        </div>
        <div className="xpr-w xpr-panels">
          <TabPanel id="xpr-plans" i={0} value={tab}><Personal open={open} sel={sel} setSel={setSel} active={tab === 0} /></TabPanel>
          <TabPanel id="xpr-plans" i={1} value={tab}><Team active={tab === 1} /></TabPanel>
          <TabPanel id="xpr-plans" i={2} value={tab}><Api active={tab === 2} /></TabPanel>
        </div>
      </div>

      <section className="xpr-faq" aria-labelledby="xpr-faq-h">
        <div className="xpr-w xpr-split">
          <header className="xpr-stick"><h2 id="xpr-faq-h" className="xpr-h">Frequently Asked Questions</h2></header>
          <div>
            <Faq items={QA.slice(0, 3)} first={0} multi />
            <details className="xpr-faq-more">
              <summary><span>Read more</span><span className="xpr-faq-n" aria-hidden="true">+ {QA.length - 3}</span></summary>
              <Faq items={QA.slice(3)} first={-1} multi />
            </details>
          </div>
        </div>
      </section>

      <Band
        title="Need help sizing seats or configuring the right plan?"
        action="Talk to our AI Buying Specialist →"
        to="/buying-specialist"
        note={<p className="xpr-band-note">Need dedicated VPC clusters, custom fine-tuning, or high-volume enterprise SLAs? <A to="/enterprise">Contact our engineering team →</A></p>}
      />

      <Drawer open={!!src} from={src} onClose={close} title="Compare plans" label="Compare plans">
        <CompareSheet lit={lit} />
      </Drawer>
    </main>
  );
}
