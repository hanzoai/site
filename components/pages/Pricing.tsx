'use client';
/* Pricing, v2 (VISION archetype E, Utility: calm, precise and fast, with one delight; PLAN-COMPONENTS 5.2).
   Every subscription plan (Free, Go, Pro, Dev, Max, Ultra, Team, Enterprise) and per-token AI model family
   (Hanzo Enso, Hanzo Kai, Hanzo Zen) is read live from https://commerce.hanzo.ai (seeded from content/live snapshots
   for zero-CLS SSR and refreshed on mount so admin.hanzo.ai edits reflect immediately).
   Models (Enso, Kai, Zen) are metered per million tokens and NEVER badged as subscription plans. */
import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, MotionConfig, useScroll, useVelocity, useTransform, useSpring } from 'motion/react';
import { EASE, useCalm } from '../ui';
import { A, More, Cta, Tabs, Faq, DataTable, Band } from '../kit';
import Odometer from '../v2/Odometer';
import NoJs from '../NoJs';
import './Frame.css';
import './Pricing.css';
import { checkout, teamCheckout } from '../../lib/plans';
import useCommercePricing from '../../lib/useCommercePricing';
import { QA } from './Pricing.faq';
import { asked, chose, LIST, picked, RUNG, termed, viewed } from '../../lib/funnel';
import { press } from '../../lib/press';

const PAY = (p) => checkout(p);
const HELP = '/buying-specialist';

/* ---------- small parts ---------- */
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

const ENT_FALLBACK = [
  'SSO (SAML 2.0 & OIDC) and SCIM provisioning through Hanzo IAM',
  'Audit logs, role-based access control and organization policies',
  'Zero data retention, custom privacy controls and HIPAA / BAA',
  'Dedicated VPC, on-prem or air-gapped cluster deployment',
  'Custom rate limits, priority routing and 99.99% uptime SLA',
  'Dedicated solution architect and 24/7 engineering Slack support',
];
const PAYG_INC = ['Frontier & open-source models via unified API', 'OpenAI-compatible /v1/chat/completions endpoint', 'Intelligent semantic auto-routing & fallback', 'Prompt caching discounts up to 90%', 'Sandboxed code execution, web search & tools', 'Real-time spend limits, webhooks & usage alerts'];
const VOL_INC = ['Committed-use volume discounts starting at $5k/mo', 'Dedicated GPU clusters (H100, B200) in your cloud or VPC', 'Custom rate limits exceeding 100k+ RPM', 'Zero data retention & HIPAA / BAA compliance', '24/7 dedicated engineering Slack & priority routing'];
const SETS = [['free', 'go', 'pro'], ['team', 'ent'], ['payg', 'vol']];
const DEF = { x: '3x', bill: 'Annual', std: 2, prem: 0 };
const BUY = 'Chat with buying specialist';

function proRungsOf(P) {
  return [
    { x: '3x', name: P.pro.name, price: P.pro.price, to: PAY(P.pro.id), head: P.pro.head || 'Everything in Go, plus:', d: P.pro.description, f: P.pro.features },
    { x: '5x', name: P.dev.name, price: P.dev.price, to: PAY(P.dev.id), head: P.dev.head || 'Everything in Pro, plus:', d: P.dev.description, f: P.dev.features },
    { x: '15x', name: P.max.name, price: P.max.price, to: PAY(P.max.id), head: P.max.head || 'Everything in Dev, plus:', d: P.max.description, f: P.max.features },
    { x: '∞', name: P.ultra.name, price: P.ultra.price, to: PAY(P.ultra.id), head: P.ultra.head || 'Everything in Max, plus:', d: P.ultra.description, f: P.ultra.features },
  ];
}

function colsOf(P, proRungs) {
  return [
    { name: P.free.name, price: 'No card needed', to: '/signup' },
    { name: P.go.name, price: '$' + P.go.price, to: PAY(P.go.id) },
    ...proRungs.map((p) => ({ name: p.name, price: '$' + p.price, to: p.to })),
  ];
}

function fullRowsOf(P, compareDiff) {
  const seen = new Set();
  const dedup = (arr, startCol) =>
    arr
      .filter((t) => !/usage|higher limits|hanzo\.bot|hanzo\.team/i.test(t))
      .filter((t) => {
        if (seen.has(t)) return false;
        seen.add(t);
        return true;
      })
      .map((t) => [t, startCol]);
  return [
    ...compareDiff,
    ...dedup(P.free.features, 0),
    ...dedup(P.go.features, 1),
    ...dedup(P.pro.features, 2),
  ];
}

function Compare({ lit, cols: colDefs, rows: rowDefs }) {
  const cols = [
    { key: 'line', label: <span className="x-sr">Plan line</span> },
    ...colDefs.map((c, i) => ({
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
  const rows = rowDefs.map(([label, v]) => {
    const r = { line: label };
    colDefs.forEach((_, i) => {
      const cell = Array.isArray(v) ? v[i] : i >= v;
      r['c' + i] = cell === true ? <><Ck /><span className="x-sr">Included</span></> : cell || null;
    });
    return r;
  });
  return <DataTable caption="Compare plans" cols={cols} rows={rows} gap="Not included" className="xpr-cmp" />;
}

function CompareSheet({ lit, cols, rows }) {
  const [one, setOne] = useState(Math.max(0, lit));
  useEffect(() => setOne(Math.max(0, lit)), [lit]);
  return (
    <div className="xpr-cmpwrap" data-one={one}>
      <div className="xpr-cmp-pick"><Seg opts={cols.map((c) => c.name)} val={cols[one].name} set={(v) => setOne(cols.findIndex((c) => c.name === v))} id="xpr-cmp-one" label="Compare plans" /></div>
      <Compare lit={one} cols={cols} rows={rows} />
    </div>
  );
}

function planOf(id, s, live, proRungs) {
  const { plans: P, seats: S } = live;
  const seatRates = { Standard: [S.standard.monthAnnual, S.standard.month], Premium: [S.premium.monthAnnual, S.premium.month] };
  const entItems = S.enterprise.features.length ? S.enterprise.features : ENT_FALLBACK;
  if (id === 'free') return { name: P.free.name, d: P.free.description, word: 'No card needed', cta: ['Try Hanzo', '/signup', 'pricing.free'], note: 'Instant access · Free forever', items: P.free.features.slice(0, 4), fullItems: P.free.features, col: 0 };
  if (id === 'go') return { name: P.go.name, d: P.go.description, fig: '$' + P.go.price, sub: 'Billed monthly', cta: ['Try Hanzo', PAY(P.go.id), 'pricing.go'], note: 'No commitment · Cancel anytime', head: P.go.head || 'Everything in Free, plus:', items: P.go.features.slice(0, 4), fullItems: P.go.features, col: 1 };
  if (id === 'pro') {
    const i = Math.max(0, proRungs.findIndex((q) => q.x === s.x)), q = proRungs[i];
    return { name: q.name, ladder: true, d: q.d, fig: '$' + q.price, sub: 'Billed monthly', cta: q.to ? ['Try Hanzo', q.to, 'pricing.' + q.name.toLowerCase()] : [BUY, HELP, 'pricing.help'], note: 'No commitment · Cancel anytime', head: q.head, items: q.f, fullItems: q.f, col: 2 + i };
  }
  if (id === 'team') {
    const k = s.bill === 'Annual' ? 0 : 1;
    return { name: S.standard.name, seats: true, d: S.standard.description, fig: '$' + (s.std * seatRates.Standard[k] + s.prem * seatRates.Premium[k]).toLocaleString('en-US'), cta: [BUY, HELP, 'pricing.team'], note: [`Standard & Premium seats · From ${S.standard.min || 2} members`, 'Organizations can mix Standard and Premium seats · Cancel anytime'], items: S.standard.features, fullItems: S.standard.features };
  }
  if (id === 'ent') return { name: S.enterprise.name, d: S.enterprise.description, word: 'Seat price + usage at API rates', sub: `US$${S.enterprise.monthAnnual}/seat/month, billed annually, ${S.enterprise.min} seat minimum. Usage cost scales with model and task.`, cta: ['Get Enterprise plan', '/contact-sales', 'pricing.enterprise'], alt: [BUY, HELP], head: S.enterprise.head || 'All Team plan features, plus:', items: entItems, fullItems: entItems };
  if (id === 'payg') return { name: 'Pay as you go', d: 'Direct metered access to all frontier models, coding agents, and tools with zero commitments.', word: 'Metered per token & second', cta: ['Get API Key', '/dev', 'pricing.api.key'], note: 'Instant access · No minimum spend', items: PAYG_INC, fullItems: PAYG_INC };
  return { name: 'Volume & Dedicated', d: 'For organizations with high-throughput inference, custom routing, or dedicated VPC deployments.', word: 'Custom rates', sub: ['Volume discounts from $5k/mo', 'Dedicated GPU clusters & custom routing SLAs'], cta: ['Contact API Sales', '/contact-sales', 'pricing.api.sales'], note: 'Dedicated VPC & 24/7 Slack support available', head: 'Everything in Pay as you go, plus:', items: VOL_INC, fullItems: VOL_INC };
}
const lines = (v) => [].concat(v || []);

const TAB = { free: 'individual', go: 'individual', pro: 'individual', team: 'team', ent: 'team', payg: 'api', vol: 'api' };
function sold(id, s, live, proRungs) {
  const every = s.bill === 'Annual' ? 'year' : 'month';
  const rung = Math.max(0, proRungs.findIndex((q) => q.x === s.x));
  const row = {
    free: { slug: 'free', how: 'free', cta: 'Try Hanzo' },
    go: { slug: live.plans.go.id, how: 'card', cta: 'Get ' + live.plans.go.name },
    pro: { slug: RUNG[rung], how: 'card', cta: 'Get ' + proRungs[rung].name },
    team: { slug: 'team', how: 'card', cta: 'Get Team', every },
    ent: { slug: 'enterprise', how: 'sales', cta: 'Get Enterprise plan', every },
    payg: { slug: 'api-payg', how: 'free', cta: 'Get API Key' },
    vol: { slug: 'api-enterprise', how: 'sales', cta: 'Contact API Sales' },
  }[id];
  return { ...row, tab: TAB[id] };
}

/* ---------- panel motion ---------- */
const EM = [0.4, 0, 0.2, 1];
const MOVE = { duration: 0.5, ease: EM };
const IN = { duration: 0.3, ease: EASE };

function Swap({ k, children, className = '', roll }) {
  const d = roll ? '105%' : 10;
  return (
    <span className={'xpr-swap ' + (roll ? 'roll ' : '') + className}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span key={k} className="xpr-swap-i" initial={{ opacity: 0, y: d }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: roll ? '-105%' : -10 }} transition={IN}>{children}</motion.span>
      </AnimatePresence>
    </span>
  );
}

function Lines({ items }) {
  return (
    <ul className="xpr-list">
      <AnimatePresence mode="popLayout" initial={false}>
        {items.map((t, i) => (
          <motion.li key={t} layout="position" transition={MOVE} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0, transition: { ...IN, delay: 0.06 * i } }} exit={{ opacity: 0, transition: { duration: 0.15 } }}><Ck />{t}</motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}

function Stepper({ label, n, set, min, max }) {
  return (
    <div className="xpr-step" role="group" aria-label={label}>
      <button type="button" onClick={() => set(n - 1)} disabled={n <= min} aria-label={label + ' −'}>−</button>
      <output aria-live="polite">{n}</output>
      <button type="button" onClick={() => set(n + 1)} disabled={n >= max} aria-label={label + ' +'}>+</button>
    </div>
  );
}

function Seats({ s, set, seats }) {
  const k = s.bill === 'Annual' ? 0 : 1;
  const stdRate = [seats.standard.monthAnnual, seats.standard.month];
  const premRate = [seats.premium.monthAnnual, seats.premium.month];
  const minS = seats.standard.min || 2;
  const maxS = seats.standard.max || 100;
  const setS = (v) => set.std(Math.max(Math.max(0, minS - s.prem), Math.min(maxS - s.prem, v)));
  const setP = (v) => set.prem(Math.max(Math.max(0, minS - s.std), Math.min(maxS - s.std, v)));
  return (
    <div className="xpr-seats">
      <div>
        <b>Standard seat</b>
        <span>All Hanzo features, plus more usage than Pro</span>
        <p className="xpr-seat-p" aria-live="polite"><Odometer value={'$' + stdRate[k]} /></p>
        <small>{`Per seat / month if billed annually. $${seats.standard.month} if billed monthly.`}</small>
        <Stepper label="Standard seat" n={s.std} set={setS} min={Math.max(0, minS - s.prem)} max={maxS - s.prem} />
      </div>
      <div>
        <b>Premium seat</b>
        <span>5x more usage than standard seats</span>
        <p className="xpr-seat-p" aria-live="polite"><Odometer value={'$' + premRate[k]} /></p>
        <small>{`Per seat / month if billed annually. $${seats.premium.month} if billed monthly.`}</small>
        <Stepper label="Premium seat" n={s.prem} set={setP} min={Math.max(0, minS - s.std)} max={maxS - s.std} />
      </div>
    </div>
  );
}

function Trust() {
  const calm = useCalm();
  const [on, setOn] = useState(false);
  useEffect(() => setOn(!calm), [calm]);
  const { scrollY } = useScroll();
  const tilt = useSpring(useTransform(useVelocity(scrollY), [-2600, 0, 2600], [-9, 0, 9], { clamp: true }), { stiffness: 170, damping: 26 });
  return (
    <motion.div className="xpr-trust-w" style={on ? { rotateX: tilt, transformPerspective: 900 } : undefined}>
      <div className="xpr-trust" data-enter="scroll-tilt">
        <More to="/security">How Hanzo is secured</More>
        <More to="/trust">Trust center</More>
        <More to="/privacy">Read the Privacy Policy</More>
      </div>
    </motion.div>
  );
}

function cardOf(id, s, live, proRungs) {
  const p = planOf(id, s, live, proRungs);
  if (id === 'free') return { ...p, word: 'Free', sub: 'No card needed', items: p.fullItems };
  if (id === 'go') return { ...p, items: p.fullItems };
  if (id === 'pro') return { ...p, items: p.fullItems, rec: true };
  if (id === 'team') return { ...p, fig: null, word: 'Standard & Premium seats', sub: `From ${live.seats.standard.min || 2} members`, cta: ['Try Hanzo', teamCheckout(s.bill === 'Annual', live.seats.standard.min || 2), 'pricing.team'], note: 'Organizations can mix Standard and Premium seats · Cancel anytime', rec: true };
  return p;
}

function SeatPrices({ bill, seats }) {
  const k = bill === 'Annual' ? 0 : 1;
  const seatRates = { Standard: [seats.standard.monthAnnual, seats.standard.month], Premium: [seats.premium.monthAnnual, seats.premium.month] };
  return (
    <div className="xpr-seats xpr-c-seats">
      {[['Standard seat', 'All Hanzo features, plus more usage than Pro', 'Standard', '$' + seats.standard.month], ['Premium seat', '5x more usage than standard seats', 'Premium', '$' + seats.premium.month]].map(([n, d, key, mo]) => (
        <div key={key}>
          <b>{n}</b>
          <span>{d}</span>
          <p className="xpr-seat-p" aria-live="polite"><Odometer value={'$' + seatRates[key][k]} /></p>
          <small>Per seat / month if billed annually. {mo} if billed monthly.</small>
        </div>
      ))}
    </div>
  );
}

function Card({ id, s, set, hand, i, live, proRungs }) {
  const p = cardOf(id, s, live, proRungs);
  const sub = lines(p.sub);
  return (
    <motion.article className={'xpr-card' + (p.rec ? ' rec' : '')} data-id={id} aria-labelledby={'xpr-c-' + id} style={{ '--i': i }}
      initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0, transition: { ...IN, delay: 0.06 * i } }} exit={{ opacity: 0, transition: { duration: 0.12 } }}>
      {id === 'pro' && <span className="xpr-recd">Recommended</span>}
      <div className="xpr-c-top">
        <h2 className="xpr-c-name" id={'xpr-c-' + id}>{p.ladder ? <Swap k={p.name} roll>{p.name}</Swap> : p.name}</h2>
        {p.ladder && <Seg opts={proRungs.map((q) => q.x)} val={s.x} set={(v) => { hand(); set.x(v); if (v !== s.x) picked(RUNG[proRungs.findIndex((q) => q.x === v)], 'individual'); }} id="xpr-mult" label="Usage multiple" />}
        {id === 'team' && <div className="xpr-bill"><Seg opts={['Annual', 'Monthly']} val={s.bill} set={(v) => { set.bill(v); if (v !== s.bill) termed('team', v === 'Annual', 'team'); }} id="xpr-bill" label="Billing period" /><span className="xpr-save">−{live.seats.saving}%</span></div>}
      </div>
      <p className="xpr-c-d">{p.ladder ? <Swap k={p.d}>{p.d}</Swap> : p.d}</p>
      <div className="xpr-c-price">
        {p.fig ? <span className="xpr-fig"><Odometer value={p.fig} /><span className="xpr-u">USD/month</span></span> : <span className="xpr-word">{p.word}</span>}
        {sub.map((t) => <span key={t} className="xpr-c-sub">{t}</span>)}
      </div>
      <div className="xpr-c-acts">
        <Cta to={p.cta[1]} size="lg" kind={p.rec ? 'solid' : 'outline'} id={p.cta[2]} className="xpr-cta" thumb={p.rec} data-ga="">{p.cta[0]}</Cta>
        {p.alt && <Cta to={p.alt[1]} size="lg" kind="outline" id="pricing.help" className="xpr-cta" data-ga="">{p.alt[0]}</Cta>}
        {!p.alt && lines(p.note).map((n) => <p key={n} className="xpr-note">{n}</p>)}
      </div>
      {id === 'team' ? <SeatPrices bill={s.bill} seats={live.seats} /> : <div className="xpr-c-gap" />}
      <div className="xpr-c-inc">
        <p className="xpr-head">{p.head || 'What’s included'}</p>
        {p.ladder ? <Lines items={p.items} /> : <List items={p.items} />}
      </div>
    </motion.article>
  );
}

function Plans({ tab, s, set, hand, live, proRungs }) {
  const calm = useCalm();
  return (
    <MotionCfg calm={calm}>
      {SETS.map((ids, t) => (
        <div key={t} className={'xpr-cards n' + ids.length} role="tabpanel" id={'xpr-plans-panel-' + t} aria-labelledby={'xpr-plans-tab-' + t} hidden={t !== tab}
          data-enter={t === 0 ? 'grow-from-point' : undefined} onPointerEnter={hand} onFocusCapture={hand}>
          <AnimatePresence initial={false}>
            {t === tab && ids.map((id, i) => <Card key={id} id={id} s={s} set={set} hand={hand} i={i} live={live} proRungs={proRungs} />)}
          </AnimatePresence>
        </div>
      ))}
    </MotionCfg>
  );
}

function useEnter(root) {
  useEffect(() => {
    const band = root.current?.querySelector('.x-band');
    if (band && !band.dataset.enter) band.dataset.enter = 'underline-sweep';
    const els = [...(root.current?.querySelectorAll('[data-enter]:not([data-enter="text-mask-film"]):not([data-enter="grow-from-point"])') || [])];
    if (typeof IntersectionObserver === 'undefined') { els.forEach((el) => { el.dataset.in = ''; }); return; }
    const timers = [];
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting || (e.intersectionRatio < 0.25 && e.intersectionRect.height < innerHeight * 0.25)) return;
      const el = e.target;
      el.dataset.in = '';
      io.unobserve(el);
      timers.push(setTimeout(() => { el.dataset.done = ''; }, 2200));
    }), { threshold: [0, 0.1, 0.25, 0.5] });
    els.forEach((el) => io.observe(el));
    return () => { io.disconnect(); timers.forEach(clearTimeout); };
  }, [root]);
}

const MotionCfg = ({ calm, children }) => <MotionConfig reducedMotion={calm ? 'always' : 'never'}>{children}</MotionConfig>;

function Index({ live, proRungs }) {
  const all = [['Personal', ['free', 'go', ...proRungs.map((q) => ['pro', { ...DEF, x: q.x }])]], ['Team', ['team', 'ent']], ['API', ['payg', 'vol']]];
  return (
    <div className="xpr-all" hidden>
      {all.map(([t, ids]) => (
        <section key={t} aria-label={t}>
          <h2 className="xpr-all-t">{t}</h2>
          {ids.map((x) => {
            const p = Array.isArray(x) ? planOf(x[0], x[1], live, proRungs) : planOf(x, DEF, live, proRungs);
            return (
              <article key={p.name} className="xpr-all-p">
                <h3>{p.name}</h3>
                {p.seats && <p className="xpr-sub">Annual · Monthly <span className="xpr-save">−{live.seats.saving}%</span></p>}
                <p className="xpr-d">{p.d}</p>
                <p className="xpr-all-f">{p.fig ? p.fig + ' USD/month' : p.word}</p>
                {lines(p.sub).map((t2) => <p key={t2} className="xpr-sub">{t2}</p>)}
                {p.seats && <Seats s={DEF} set={{ std() {}, prem() {} }} seats={live.seats} />}
                <p><A to={p.cta[1]}>{p.cta[0]}</A></p>
                {p.alt ? <p><A to={p.alt[1]}>{p.alt[0]}</A></p> : lines(p.note).map((t2) => <p key={t2} className="xpr-note">{t2}</p>)}
                <p className="xpr-inc-h">What’s included</p>
                {p.head && <p className="xpr-head">{p.head}</p>}
                <List items={p.fullItems} />
              </article>
            );
          })}
        </section>
      ))}
    </div>
  );
}

/* ---------- API: metered rates & live models ---------- */
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
const TOOLS = [['Web Search', 'per call', '0.002158'], ['Code Interpreter', 'per session minute', '0.03'], ['File Storage', 'per GB/month', '0.2'], ['Image Generation', 'per image', '0.04'], ['Speech-to-Text', 'per minute', '0.006'], ['Text-to-Speech', 'per 1M characters', '15'], ['Web Fetch', 'per call', '0.001079']];

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
        {r.cta && <A to={r.to || '/chat'} className="xpr-use">{r.cta}</A>}
      </span>
    </details>
  );
};

function Models({ groups }) {
  return (
    <div className="xpr-groups">
      {groups.map((g) => (
        <details key={g.h} className="xpr-group">
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
          {g.afterNote && <p className="xpr-after">{g.afterNote}<code>{g.afterCode}</code></p>}
          {g.cta && <A to={g.cta[1]} className="xpr-use">{g.cta[0]}</A>}
        </details>
      ))}
    </div>
  );
}

function ApiMore({ on, groups }) {
  const [allBill, setAllBill] = useState(false);
  return (
    <div className="xpr-api" hidden={!on}>
      <section className="xpr-ch xpr-split" aria-labelledby="xpr-bill-h">
        <header className="xpr-sh xpr-stick">
          <h2 id="xpr-bill-h">How we bill</h2>
          <p>Transparent pricing based on what your models, agents, and tools use. Predictable, metered, and with no hidden fees.</p>
        </header>
        <div>
        <ol className={'xpr-bills' + (allBill ? ' all' : '')}>
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
        {!allBill && <button type="button" className="xpr-bills-more" onClick={() => setAllBill(true)}><span>Read more</span><span className="xpr-faq-n" aria-hidden="true">+ {BILL.length - 1}</span></button>}
        </div>
      </section>

      <section className="xpr-ch xpr-split" aria-labelledby="xpr-rates-h">
        <header className="xpr-sh xpr-stick">
          <h3 id="xpr-rates-h">The rates</h3>
          <p>Every rate here is the price you pay: the one on your bill, and the one your usage page shows.</p>
        </header>
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
        <Models groups={groups} />
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
    </div>
  );
}

/* ---------- Compare plans ladder ---------- */
function Ladder({ lit, cols, diff, rows }) {
  return (
    <section className="zf-sec xpr-lad" aria-labelledby="xpr-lad-h">
      <div className="xpr-w">
        <header className="zf-head">
          <h2 id="xpr-lad-h">Compare plans</h2>
          <p>No commitment · Cancel anytime</p>
        </header>
        <ol className="xpr-lad-g zf-lift zf-tilt">
          {cols.map((c, i) => {
            const rec = i === 2;
            const paid = c.price.startsWith('$');
            return (
              <li key={c.name} className={'xpr-lad-c' + (rec ? ' rec' : '') + (i === lit ? ' lit' : '')} style={{ '--i': i }}>
                <span className="xpr-lad-step" aria-hidden="true"><i /></span>
                <div className="xpr-lad-top">
                  <h3>{c.name}</h3>
                  {rec && <span className="xpr-recd">Recommended</span>}
                </div>
                <p className="xpr-lad-p">{paid ? <><b>{c.price}</b><small>USD/month</small></> : <b className="word">{c.price}</b>}</p>
                {diff.map(([k, v]) => <div key={k} className="xpr-lad-row"><span className="k">{k}</span><span className="v">{v[i] || <span className="xpr-dash" aria-label="Not included">—</span>}</span></div>)}
                <Cta to={c.to} size="md" kind={rec ? 'solid' : 'outline'} id={'pricing.compare.' + c.name.toLowerCase()} className="xpr-lad-cta">Try Hanzo</Cta>
              </li>
            );
          })}
        </ol>
        <details className="xpr-faq-more xpr-lad-more">
          <summary><span>Full feature breakdown</span><span className="xpr-faq-n" aria-hidden="true">+ {Math.max(0, rows.length - diff.length)}</span></summary>
          <CompareSheet lit={lit} cols={cols} rows={rows} />
        </details>
      </div>
    </section>
  );
}

/* ---------- Hanzo Enso, Hanzo Kai, and Hanzo Zen per-token model pricing ---------- */
const per = (v) => { const m = clean(v).match(/^(\$[\d.]+)\s*(\/ MTok)$/); return m ? <><b>{m[1]}</b><small>{m[2]}</small></> : <b>{clean(v)}</b>; };
function ModelFamilies({ groups }) {
  return (
    <section className="zf-room xpr-enso" data-room="dark" aria-labelledby="xpr-enso-h">
      <div className="xpr-w xpr-enso-stack">
        {groups.map((g) => (
          <div key={g.h} className="xpr-enso-fam">
            <header className="zf-head">
              <h2 id={g.id}>{g.h}</h2>
              <div className="xpr-enso-lede"><p>{g.d}</p>{g.link && <More to={g.link[1]}>{g.link[0]}</More>}</div>
            </header>
            <div className="xpr-enso-t" role="table" aria-label={g.h}>
              <div className="xpr-enso-r xpr-enso-hd" role="row">
                {MCOLS.map((c) => <span key={c.key} role="columnheader">{c.label}</span>)}
                <span role="columnheader"><span className="x-sr">Start</span></span>
              </div>
              {g.rows.map((r, i) => (
                <div key={r.id || r.name} className="xpr-enso-r zf-rise" role="row" style={{ '--i': i }}>
                  <span role="cell" className="xpr-enso-m">
                    <span className="xpr-nm"><b>{r.name}</b>{r.tags.map((t) => <em key={t}>{t}</em>)}</span>
                    {r.d && <span className="xpr-enso-d">{r.d}</span>}
                  </span>
                  {r.price.map((v, k) => <span key={k} role="cell" className={'xpr-enso-v' + (k < 2 ? ' big' : '')} data-k={MCOLS[k + 1].label}>{per(v)}</span>)}
                  <span role="cell" className="xpr-enso-go">{r.cta && <A to={r.to || '/chat'} className="xpr-use">{r.cta}</A>}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- header halftone ---------- */
function Halftone() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const draw = () => {
      const r = c.getBoundingClientRect(), dpr = Math.min(2, devicePixelRatio || 1);
      c.width = Math.round(r.width * dpr); c.height = Math.round(r.height * dpr);
      const g = c.getContext('2d');
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.clearRect(0, 0, r.width, r.height);
      const small = r.width < 600;
      const m = getComputedStyle(c).color.match(/[\d.]+/g) || [10, 10, 10];
      g.fillStyle = `rgba(${m[0]}, ${m[1]}, ${m[2]}, ${small ? 0.2 : 0.28})`;
      const step = r.width < 600 ? 7 : 8, cx = r.width * (small ? 0.5 : 0.4), cy = r.height * (small ? 0.2 : 0.3);
      for (let y = step / 2; y < r.height; y += step) {
        for (let x = step / 2; x < r.width; x += step) {
          const dx = (x - cx) / (r.width * 0.5), dy = (y - cy) / (r.height * 0.75);
          const d = Math.sqrt(dx * dx + dy * dy) + Math.max(0, dx) * 0.35;
          const k = Math.min(1, Math.max(0, (d - (small ? 0.78 : 0.42)) / 0.62));
          const rad = k * k * (step * 0.36);
          if (rad < 0.35) continue;
          g.beginPath(); g.arc(x, y, rad, 0, 6.2832); g.fill();
        }
      }
    };
    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(c);
    const mo = new MutationObserver(draw);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => { ro.disconnect(); mo.disconnect(); };
  }, []);
  return <canvas ref={ref} className="xpr-dots" aria-hidden="true" />;
}

const TABS = ['Personal', 'Team', 'API'];

export default function Pricing() {
  const root = useRef(null);
  useEnter(root);
  const live = useCommercePricing();
  const proRungs = proRungsOf(live.plans);
  const cols = colsOf(live.plans, proRungs);
  const fullRows = fullRowsOf(live.plans, live.compareDiff);

  const [tab, setTab] = useState(0);
  const [x, setX] = useState(DEF.x);
  const [bill, setBill] = useState(DEF.bill);
  const [std, setStd] = useState(DEF.std);
  const [prem, setPrem] = useState(DEF.prem);
  const [placed, setPlaced] = useState(false);
  const s = { x, bill, std, prem };
  const now = useRef({ s, live, proRungs });
  now.current = { s, live, proRungs };
  useEffect(() => press('.xpr-card .xpr-cta', (a) => {
    const id = a.closest('.xpr-card').dataset.id;
    const cur = now.current;
    if (a.dataset.cta === 'pricing.help') asked(sold(id, cur.s, cur.live, cur.proRungs).slug, TAB[id], a.textContent.trim());
    else chose(sold(id, cur.s, cur.live, cur.proRungs));
  }), []);
  const set = { x: setX, bill: setBill, std: setStd, prem: setPrem };
  const rail = useRef(null);
  const [, setMine] = useState(false);
  const hand = useCallback(() => setMine(true), []);
  useEffect(() => {
    const read = () => {
      const h = decodeURIComponent(location.hash.slice(1)).toLowerCase();
      const t = TABS.findIndex((x2) => x2.toLowerCase() === h);
      if (t >= 0) setTab(t);
    };
    read();
    setPlaced(true);
    addEventListener('hashchange', read);
    return () => removeEventListener('hashchange', read);
  }, []);
  useEffect(() => {
    if (!placed) return;
    const name = ['individual', 'team', 'api'][tab];
    viewed(name, LIST[name]);
  }, [placed, tab]);
  const pick = (i) => { setTab(i); try { history.replaceState(null, '', '#' + TABS[i].toLowerCase()); } catch { /* hash optional */ } };
  return (
    <main ref={root} className="xpr zf">
      <section className="xpr-top zf-sec zf-plain" aria-labelledby="xpr-h1">
        <Halftone />
        <div className="xpr-w xpr-hero-g">
          <div className="xpr-hero-t">
            <h1 id="xpr-h1" className="xpr-h1" data-enter="text-mask-film"><span className="xpr-cut"><span>Pricing</span></span></h1>
            <p className="xpr-lede">Start free, every model on one bill.</p>
          </div>
          <div className="xpr-tabs"><Tabs id="xpr-plans" label="Plans" tabs={TABS} value={tab} onChange={pick} size="lg" /></div>
        </div>
        <div className="xpr-w xpr-panels" ref={rail}>
          <Plans tab={tab} s={s} set={set} hand={hand} live={live} proRungs={proRungs} />
        </div>
      </section>
      {tab === 0 && <Ladder lit={proRungs.findIndex((q) => q.x === x) + 2} cols={cols} diff={live.compareDiff} rows={fullRows} />}
      <ModelFamilies groups={live.groups} />
      <div className="xpr-room">
        <div className="xpr-w">
          <Trust />
          <Index live={live} proRungs={proRungs} />
          <ApiMore on={tab === 2} groups={live.groups} />
        </div>
      </div>
      <NoJs css=".xpr-all{display:grid!important}.xpr-api{display:block!important}.xpr-dots{display:none}" />

      <section className="xpr-faq zf-sec" aria-labelledby="xpr-faq-h">
        <div className="xpr-w xpr-split">
          <header className="xpr-stick"><h2 id="xpr-faq-h" className="xpr-h">Frequently Asked Questions</h2></header>
          <div>
            <Faq items={QA} first={0} />
          </div>
        </div>
      </section>

      <Band
        title="Need help sizing seats or configuring the right plan?"
        action="Talk to our AI Buying Specialist →"
        to="/buying-specialist"
        note={<p className="xpr-band-note"><span>Need dedicated VPC clusters, custom fine-tuning, or high-volume enterprise SLAs?</span> <A to="/enterprise">Contact our engineering team →</A></p>}
      />
    </main>
  );
}
