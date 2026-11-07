'use client';
/* Pricing, v2 (VISION archetype E, Utility: calm, precise and fast, with one delight).
   Signature: rolling prices. Every price is an odometer whose digits roll to the figure; the Pro card walks its own
   ladder (3x, 5x, 15x, unlimited: $15, $45, $95, $195) by itself until a hand takes over, and the team total rolls as
   you add seats.
   Open: any plan card opens into the compare sheet (the synchronized.studio card-into-page open): the sheet grows out of
   the card you clicked, with that plan's column lit.
   Beyond: the compare sheet. Hanzo's own lines for every personal plan, side by side, each plan carrying what it
   inherits from the one below ("Everything in Go, plus"), so you see what each step up adds. A seat mixer on Team
   prices your own mix of Standard and Premium seats from Hanzo's seat prices.
   Supporting motion is UI only: the sliding tab pill, the row you are reading lighting up in the price tables. Every
   tier, price, line and footnote on Hanzo's page is here; the tabs you are not on are in the page, hidden. */
// Signature: rolling prices: every price is an odometer, and the Pro card walks its own ladder until you take over
// Beyond: the compare sheet: every personal plan's own lines side by side with what each inherits, opened out of the card you clicked
import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'motion/react';
import { EASE } from '../ui';
import { A, More } from '../kit';
import Odometer from '../v2/Odometer';
import Drawer from '../v2/Drawer';
import Answers from '../v2/Answers';
import './Pricing.css';

const PAY = (p) => `/pay/confirm/card?plan=${p}&returnUrl=https%3A%2F%2Fhanzo.ai%2Fchat`;

/* ---------- small parts ---------- */
function Seg({ opts, val, set, id, label, className = '' }) {
  const keys = (e) => {
    const k = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    if (!k) return;
    e.preventDefault();
    const n = (opts.indexOf(val) + k + opts.length) % opts.length;
    set(opts[n]);
    document.getElementById(id + '-' + n)?.focus();
  };
  return (
    <div className={'xpr-seg ' + className} role="tablist" aria-label={label} onKeyDown={keys}>
      {opts.map((o, i) => (
        <button key={o} id={id + '-' + i} type="button" role="tab" aria-selected={val === o} tabIndex={val === o ? 0 : -1} onClick={() => set(o)}>
          {val === o && <motion.span layoutId={'seg-' + id} className="xpr-seg-bg" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
          <span>{o}</span>
        </button>
      ))}
    </div>
  );
}

const Ck = () => <svg className="xpr-ck" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const List = ({ items }) => <ul className="xpr-list">{items.map((t) => <li key={t}><Ck />{t}</li>)}</ul>;
const Cta = ({ to, children, dark }) => <A to={to} className={'xpr-cta' + (dark ? ' dark' : '')}>{children}</A>;

/* ---------- the plans, as Hanzo lists them ---------- */
const FREE = ['Chat on the web with Enso Free and Zen Free', 'Free model requests and Kai decisions included', 'Search the web from chat', 'Write, edit and create content', 'Make code, pages and charts beside the chat', 'Choose how hard it thinks'];
const GO = ['Build apps with Hanzo Dev', 'Connect any MCP server in Hanzo Dev', 'The Hanzo CLI for macOS, Windows and Linux', 'Every model, including Enso Ultra and Kai', 'Usage included on every model', 'Priority inference and priority support', 'Your own agents, working in the background', 'Automations, with daily runs included'];
const COMMON = ['Early access to new models and features', 'Train custom models on your data', 'Hanzo Engine to run models on your own hardware', 'Dedicated support'];
const PRO = [
  { x: '3x', name: 'Pro', price: 15, to: PAY('pro-2x'), head: 'Everything in Go, plus:', d: 'For serious builders running agents, shipping code, and needing substantially higher limits.', f: ['3x more usage than Go', '3x higher limits than Go', 'Hanzo Bot: 1 bot of your own'] },
  { x: '5x', name: 'Dev', price: 45, to: PAY('dev-5x'), head: 'Everything in Pro, plus:', d: 'For serious builders running agents, shipping code, and needing substantially higher limits.', f: ['5x more usage than Go', '5x higher limits than Go', 'Hanzo Bot: 2 bots of your own'] },
  { x: '15x', name: 'Max', price: 95, to: PAY('max-10x'), head: 'Everything in Dev, plus:', d: 'For serious builders running agents, shipping code, and needing substantially higher limits.', f: ['15x more usage than Go', '15x higher limits than Go', 'Hanzo Bot: 5 bots of your own'] },
  { x: '∞', name: 'Ultra', price: 195, to: PAY('ultra'), head: 'Everything in Max, plus:', d: 'For the biggest workloads. Usage beyond what is included is paid from your prepaid balance at list price', f: ['Highest included usage across every model', 'Continuous usage with no window resets', 'Usage beyond what is included is paid from your prepaid balance at list price', 'Hanzo Bot: 10 bots of your own'] },
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
  return (
    <div className="xpr-cmp" tabIndex={0} role="region" aria-label="Every personal plan, line by line" data-swipe-own>
      <table>
        <thead>
          <tr>
            <th scope="col"><span className="x-sr">Plan line</span></th>
            {COLS.map((c, i) => (
              <th key={c.name} scope="col" className={i === lit ? 'lit' : undefined}>
                <b>{c.name}</b>
                <span className={c.price.startsWith('$') ? undefined : 'word'}>{c.price}{c.price.startsWith('$') && <small> USD/month</small>}</span>
                <A to={c.to} className="xpr-cmp-go">Try Hanzo</A>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROWS.map(([label, v]) => (
            <tr key={label}>
              <th scope="row">{label}</th>
              {COLS.map((c, i) => {
                const cell = Array.isArray(v) ? v[i] : i >= v;
                return (
                  <td key={c.name} className={i === lit ? 'lit' : undefined}>
                    {cell === true ? <><Ck /><span className="x-sr">Included</span></> : cell ? <span className="xpr-cmp-t">{cell}</span> : <span className="xpr-cmp-no" aria-label="Not included">–</span>}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Plan({ name, d, price, sub, to, note, head, items, all, open, dark, className = '', children }) {
  return (
    <article className={'xpr-plan' + (dark ? ' dark' : '') + (className ? ' ' + className : '')}>
      <h2>{name}</h2>
      {children || (
        <>
          <p className="xpr-d">{d}</p>
          <p className="xpr-price">{price}</p>
          {sub && <p className="xpr-sub">{sub}</p>}
          <Cta to={to} dark={dark}>Try Hanzo</Cta>
          <p className="xpr-note">{note}</p>
          <div className="xpr-inc">
            <p className="xpr-inc-h">What’s included</p>
            {head && <p className="xpr-head">{head}</p>}
            <List items={items} />
          </div>
        </>
      )}
      <button type="button" className="xpr-more" onClick={open} data-cursor="Compare">
        <span>{all}</span><span aria-hidden="true">→</span>
      </button>
    </article>
  );
}

function ProCard({ open }) {
  const ref = useRef(null);
  const seen = useInView(ref, { amount: 0.5 });
  const calm = useReducedMotion();
  const [x, setX] = useState('3x');
  const [mine, setMine] = useState(false);
  const at = PRO.findIndex((p) => p.x === x);
  // idle: the card walks up its own ladder until a hand takes over
  useEffect(() => {
    if (mine || calm || !seen) return;
    const t = setInterval(() => setX((v) => PRO[(PRO.findIndex((p) => p.x === v) + 1) % PRO.length].x), 2800);
    return () => clearInterval(t);
  }, [mine, calm, seen]);
  const p = PRO[at];
  return (
    <article className="xpr-plan dark xpr-pro" ref={ref} onPointerDown={() => setMine(true)} onFocus={() => setMine(true)}>
      <img className="xpr-pro-art" src="/models/enso.webp" alt="" aria-hidden="true" />
      <div className="xpr-pro-top">
        <h2 className="xpr-pro-name">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span key={p.name} initial={{ y: '90%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '-90%', opacity: 0 }} transition={{ duration: 0.5, ease: EASE }}>{p.name}</motion.span>
          </AnimatePresence>
        </h2>
        <Seg opts={PRO.map((q) => q.x)} val={x} set={(v) => { setMine(true); setX(v); }} id="xpr-mult" label="Usage multiple" className="on-dark" />
      </div>
      <p className="xpr-price big"><Odometer value={'$' + p.price} /><span className="xpr-u">USD/month</span></p>
      <p className="xpr-sub">Billed monthly</p>
      <div className="xpr-vars">
        {PRO.map((q, i) => (
          <div key={q.x} className={'xpr-var' + (i === at ? ' on' : '')} aria-hidden={i !== at} inert={i !== at}>
            <p className="xpr-d">{q.d}</p>
            <Cta to={q.to} dark>Try Hanzo</Cta>
            <p className="xpr-note">No commitment · Cancel anytime</p>
            <div className="xpr-inc">
              <p className="xpr-inc-h">What’s included</p>
              <p className="xpr-head">{q.head}</p>
              <List items={q.f} />
            </div>
          </div>
        ))}
      </div>
      <button type="button" className="xpr-more" onClick={(e) => open(e, 2 + at)} data-cursor="Compare">
        <span>Compare plans</span><span aria-hidden="true">→</span>
      </button>
    </article>
  );
}

function Personal({ open }) {
  return (
    <>
      <div className="xpr-plans">
        <Plan name="Free" d="Chat and build with Hanzo, free." price={<span className="xpr-free">No card needed</span>} to="/signup" note="Instant access · Free forever" items={FREE.slice(0, 4)} all="Compare plans" open={(e) => open(e, 0)} />
        <Plan name="Go" d="Your everyday AI development toolkit, with access to every model and more included usage." price={<><Odometer value="$8" /><span className="xpr-u">USD/month</span></>} sub="Billed monthly" to={PAY('go')} note="No commitment · Cancel anytime" head="Everything in Free, plus:" items={GO.slice(0, 4)} all="Compare plans" open={(e) => open(e, 1)} />
        <ProCard open={open} />
      </div>
      <div className="xpr-cmp-row">
        <button type="button" className="xpr-cmp-open" onClick={(e) => open(e, -1)}>Compare every plan, line by line <span aria-hidden="true">→</span></button>
        <p>Free, Go, Pro, Dev, Max and Ultra in one table, with what each step up adds.</p>
      </div>
    </>
  );
}

/* ---------- Team: seat prices, and a mixer that prices your own team ---------- */
const SEAT = { Standard: [20, 25], Premium: [100, 125] };

function Stepper({ label, n, set, min, max }) {
  return (
    <div className="xpr-step" role="group" aria-label={label}>
      <button type="button" onClick={() => set(n - 1)} disabled={n <= min} aria-label={'Fewer ' + label}>−</button>
      <output aria-live="polite">{n}</output>
      <button type="button" onClick={() => set(n + 1)} disabled={n >= max} aria-label={'More ' + label}>+</button>
    </div>
  );
}

function Team() {
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
    <div className="xpr-plans two">
      <article className="xpr-plan dark xpr-team">
        <div className="xpr-pro-top">
          <h2>Team</h2>
          <div className="xpr-bill"><Seg opts={['Annual', 'Monthly']} val={bill} set={setBill} id="xpr-bill" label="Billing period" className="on-dark" /><span className="xpr-save">−20%</span></div>
        </div>
        <p className="xpr-d">For teams of 2 to 100: every model and usage for each member, one workspace, one bill.</p>
        <div className="xpr-seats">
          <div>
            <b>Standard seat</b>
            <span>All Hanzo features, plus more usage than Pro</span>
            <p className="xpr-price"><Odometer value={'$' + SEAT.Standard[k]} /></p>
            <small>Per seat / month if billed annually. $25 if billed monthly.</small>
            <Stepper label="Standard seats" n={std} set={setS} min={Math.max(0, 2 - prem)} max={100 - prem} />
          </div>
          <div>
            <b>Premium seat</b>
            <span>5x more usage than standard seats</span>
            <p className="xpr-price"><Odometer value={'$' + SEAT.Premium[k]} /></p>
            <small>Per seat / month if billed annually. $125 if billed monthly.</small>
            <Stepper label="Premium seats" n={prem} set={setP} min={Math.max(0, 2 - std)} max={100 - std} />
          </div>
        </div>
        <div className="xpr-total" aria-live="polite">
          <span>Your team · {std + prem} seats</span>
          <p className="xpr-price big"><Odometer value={'$' + total.toLocaleString('en-US')} /><span className="xpr-u">a month{yr ? ', billed annually' : ''}</span></p>
        </div>
        <p className="xpr-sub">Standard &amp; Premium seats</p>
        <p className="xpr-sub">From 2 members</p>
        <Cta to="/pay/confirm/card?plan=team&interval=year&quantity=2&returnUrl=https%3A%2F%2Fhanzo.ai%2Fchat" dark>Try Hanzo</Cta>
        <p className="xpr-note">Organizations can mix Standard and Premium seats · Cancel anytime</p>
        <div className="xpr-inc">
          <p className="xpr-inc-h">What’s included</p>
          <List items={["Add premium seats to raise the team's shared usage", 'One shared workspace: chat, meetings, calendar and contacts', 'Single sign-on, roles and an audit log', 'One bill for the whole team', 'Automations, with daily runs included']} />
        </div>
      </article>
      <article className="xpr-plan xpr-ent">
        <h2>Enterprise</h2>
        <p className="xpr-d">For large businesses operating at scale</p>
        <p className="xpr-price word">Seat price + usage at API rates</p>
        <p className="xpr-sub">US$20/seat/month, billed annually, 20 seat minimum. Usage cost scales with model and task.</p>
        <Cta to="/enterprise/start">Get Enterprise plan</Cta>
        <A to="/buying-specialist" className="xpr-alt">Chat with buying specialist</A>
        <div className="xpr-inc">
          <p className="xpr-inc-h">What’s included</p>
          <p className="xpr-head">All Team plan features, plus:</p>
          <List items={['Audit logs', 'SCIM provisioning through Hanzo IAM']} />
        </div>
      </article>
    </div>
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

/* the row you are reading lights up: the one crossing a line a third of the way down the screen */
function useReading(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rows = [...el.querySelectorAll('tbody tr[data-row]')];
    const io = new IntersectionObserver((es) => es.forEach((e) => e.target.classList.toggle('lit', e.isIntersecting)), { rootMargin: '-38% 0px -61.9% 0px' });
    rows.forEach((r) => io.observe(r));
    return () => io.disconnect();
  }, [ref]);
}

// a few rates arrive with floating-point dust (0.026250000000000002): shown at their real precision (0.02625)
const clean = (v) => v && v.replace(/\d+\.\d{9,}/g, (m) => String(+(+m).toPrecision(10)));

function Priced({ r }) {
  const [i, o, cw, cr] = r.price.map(clean);
  const cells = [['Input', i], ['Output', o], ['Cache write', cw], ['Cache read', cr]];
  return (
    <tr data-row>
      <td className="xpr-m" data-l="Model">
        <div className="xpr-nm"><b>{r.name}</b>{r.tags.map((t) => <em key={t}>{t}</em>)}</div>
        {r.d && <p>{r.d}</p>}
        {r.spec && <dl>{r.spec.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>}
        {r.chips.length > 0 && <ul className="xpr-chips">{r.chips.map((c) => <li key={c}>{c}</li>)}</ul>}
        {r.end && <code>{r.end}</code>}
        {r.cta && <A to="/chat" className="xpr-use">{r.cta}</A>}
      </td>
      {cells.map(([l, v]) => <td key={l} data-l={l} className={v ? 'xpr-v' : 'xpr-v none'}>{v}</td>)}
    </tr>
  );
}

function ModelTable() {
  const ref = useRef(null);
  useReading(ref);
  return (
    <div className="xpr-tw" ref={ref}>
      <table className="xpr-tbl">
        <thead><tr><th scope="col">Model</th><th scope="col">Input</th><th scope="col">Output</th><th scope="col">Cache write</th><th scope="col">Cache read</th></tr></thead>
        {GROUPS.map((g) => (
          <tbody key={g.h}>
            <tr className="grp">
              <th colSpan={5} scope="colgroup">
                <h3>{g.h}</h3>
                <p>{g.d}</p>
                {g.legend && <ul className="xpr-chips">{g.legend.map((t) => <li key={t}>{t}</li>)}</ul>}
                {g.extra && <small>{g.extra}</small>}
                {g.link && <More to={g.link[1]}>{g.link[0]}</More>}
              </th>
            </tr>
            {g.rows.map((r) => <Priced key={r.name} r={r} />)}
            {(g.after || g.cta) && (
              <tr className="aft"><td colSpan={5}>{g.after}{g.cta && <A to={g.cta[1]} className="xpr-use">{g.cta[0]}</A>}</td></tr>
            )}
          </tbody>
        ))}
      </table>
    </div>
  );
}

function Tools() {
  const ref = useRef(null);
  useReading(ref);
  return (
    <div className="xpr-tw" ref={ref}>
      <table className="xpr-tbl tools">
        <thead><tr><th scope="col">Tool</th><th scope="col">Unit</th><th scope="col">Price</th></tr></thead>
        <tbody>
          {TOOLS.map(([n, u, p]) => (
            <tr key={n} data-row><td className="xpr-m" data-l="Tool"><div className="xpr-nm"><b>{n}</b></div></td><td data-l="Unit">{u}</td><td data-l="Price" className="xpr-v">{p}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Api() {
  return (
    <>
      <div className="xpr-plans two">
        <article className="xpr-plan xpr-payg">
          <h2>Pay as you go</h2>
          <p className="xpr-d">Direct metered access to all frontier models, coding agents, and tools with zero commitments.</p>
          <p className="xpr-price word">Pay as you go</p>
          <p className="xpr-sub">Metered per token &amp; second</p>
          <Cta to="/dev">Get API Key</Cta>
          <p className="xpr-note">Instant access · No minimum spend</p>
          <div className="xpr-inc"><p className="xpr-inc-h">What’s included</p><List items={['Frontier & open-source models via unified API', 'OpenAI-compatible /v1/chat/completions endpoint', 'Intelligent semantic auto-routing & fallback', 'Prompt caching discounts up to 90%', 'Sandboxed code execution, web search & tools', 'Real-time spend limits, webhooks & usage alerts']} /></div>
        </article>
        <article className="xpr-plan xpr-vol">
          <h2>Volume &amp; Dedicated</h2>
          <p className="xpr-d">For organizations with high-throughput inference, custom routing, or dedicated VPC deployments.</p>
          <p className="xpr-price word">Custom rates</p>
          <p className="xpr-sub">Volume discounts from $5k/mo</p>
          <p className="xpr-sub">Dedicated GPU clusters &amp; custom routing SLAs</p>
          <Cta to="/contact-sales">Contact API Sales</Cta>
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
              {tiers && <ul className="xpr-chips mono">{tiers.map((t) => <li key={t}>{t}</li>)}</ul>}
            </li>
          ))}
        </ol>
      </section>

      <section className="xpr-ch xpr-split" aria-labelledby="xpr-rates-h">
        <header className="xpr-sh xpr-stick">
          <h3 id="xpr-rates-h">The rates</h3>
          <p>Every rate here is the price you pay: the one on your bill, and the one your usage page shows.</p>
        </header>
        <ul className="xpr-rates">
          {RATES.map(([n, v, note]) => (
            <li key={n}>
              <b>{n}</b>
              <span className="xpr-rate">{v.map((x) => <span key={x}>{x}</span>)}</span>
              <span className="xpr-rate-n">{note}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="xpr-ch" aria-labelledby="xpr-win-h">
        <header className="xpr-sh">
          <h3 id="xpr-win-h">The completion window is the biggest lever</h3>
          <p>The same model at a different window is a different price, chosen per request. Pay the interactive tariff only when a person is waiting.</p>
        </header>
        <ol className="xpr-wins">
          {WINDOWS.map(([n, d], i) => (
            <li key={n} style={{ '--k': i }}>
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
        <ModelTable />
      </section>

      <section className="xpr-ch" aria-labelledby="xpr-tools-h">
        <header className="xpr-sh"><h2 id="xpr-tools-h">Explore pricing for tools</h2></header>
        <Tools />
        <p className="xpr-after">*Does not include input and output tokens required to process requests</p>
        <div className="xpr-ends">
          <Cta to="/login">Try Hanzo</Cta>
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

/* ---------- the room ---------- */
const TABS = ['Personal', 'Team', 'API'];

export default function Pricing() {
  const [tab, setTab] = useState('Personal');
  const [src, setSrc] = useState(null);
  const [lit, setLit] = useState(-1);
  useEffect(() => {
    const h = decodeURIComponent(location.hash.slice(1));
    const t = TABS.find((x) => x.toLowerCase() === h.toLowerCase());
    if (t) setTab(t);
  }, []);
  const pick = (t) => { setTab(t); try { history.replaceState(null, '', '#' + t.toLowerCase()); } catch { /* the tab still changes */ } };
  const open = useCallback((e, col) => { setLit(col); setSrc(e.currentTarget.closest('article') || e.currentTarget); }, []);
  const close = useCallback(() => setSrc(null), []);
  const line = (t, d) => (
    <span className="xpr-line"><motion.span initial={{ y: '108%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: d }}>{t}</motion.span></span>
  );
  return (
    <main className="xpr">
      <section className="xpr-hero" aria-labelledby="xpr-h1">
        <div className="xpr-w xpr-hero-g">
          <h1 id="xpr-h1">{line('Pricing', 0.05)}</h1>
          <motion.p className="xpr-lede" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.4 }}>Start free, every model on one bill.</motion.p>
        </div>
      </section>
      <div className="xpr-room">
        <div className="xpr-tabs">
          <div className="xpr-w"><Seg opts={TABS} val={tab} set={pick} id="xpr-tab" label="Plans" className="big" /></div>
        </div>
        <section className="xpr-panel" hidden={tab !== 'Personal'} aria-label="Personal plans"><div className="xpr-w"><Personal open={open} /></div></section>
        <section className="xpr-panel" hidden={tab !== 'Team'} aria-label="Team plans"><div className="xpr-w"><Team /></div></section>
        <section className="xpr-panel" hidden={tab !== 'API'} aria-label="API pricing"><div className="xpr-w"><Api /></div></section>
      </div>

      <section className="xpr-faq" aria-labelledby="xpr-faq-h">
        <div className="xpr-w xpr-split">
          <header className="xpr-stick"><h2 id="xpr-faq-h" className="xpr-h">Frequently Asked Questions</h2></header>
          <Answers items={QA} />
        </div>
      </section>
      <section className="xpr-help" aria-label="Help choosing">
        <div className="xpr-w xpr-help-g">
          <A to="/buying-specialist" className="xpr-big">
            <p>Need help sizing seats or configuring the right plan?</p>
            <span>Talk to our AI Buying Specialist →</span>
          </A>
          <A to="/enterprise" className="xpr-big">
            <p>Need dedicated VPC clusters, custom fine-tuning, or high-volume enterprise SLAs?</p>
            <span>Contact our engineering team →</span>
          </A>
        </div>
      </section>

      <Drawer open={!!src} from={src} onClose={close} title="Compare plans" label="Compare every personal plan">
        <p className="xpr-cmp-lede">Hanzo&apos;s own lines for each personal plan. Each plan includes everything in the one to its left, plus what it adds.</p>
        <Compare lit={lit} />
      </Drawer>
    </main>
  );
}
