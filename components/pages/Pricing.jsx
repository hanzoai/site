'use client';
/* Pricing, v2 (VISION archetype E, Utility: calm, precise and fast, with one delight; PLAN-COMPONENTS 5.2).
   V2: 8/10 one plan panel that morphs between tabs and plans (one solid ask), the model art answering the plan picked, names that roll through a clipped slot like the odometer beside them; section entrances text-mask-film, grow-from-point, scroll-tilt, vertical-ticker, underline-sweep; greys only
   Persona: a builder or a team lead choosing a plan. Goal: know the price before you ask. CTA: "Try Hanzo" on the plan
   you pick (data-cta pricing.free / pricing.go / pricing.pro); metric: cta_click on those ids.
   Thesis: know the price before you ask.
   Signature (morph-panel, MOTION-MAP 7 Nov): one plan panel, many states. The Personal / Team / API tabs and the plan
   rail beside the panel drive ONE panel that never remounts: its height eases to the new plan (500ms in-out), the name
   lifts out as the next rises in, the price odometer rolls between real prices (Go $8 to Pro $15 to a Team total),
   word prices cross over, Hanzo's included lines slide to their new places while lines that differ leave and arrive,
   and the seat mixer or the usage ladder grows in only for the plan that has one. The Pro rail row walks its own
   ladder (3x, 5x, 15x, unlimited: $15, $45, $95, $195) once until a hand takes over.
   Open: "Compare plans" grows a sheet out of the panel (synchronized.studio), the plan's column lit.
   Beyond: the compare sheet. Hanzo's own lines for every personal plan side by side, each plan carrying what it inherits
   ("Everything in Go, plus"), so you see what each step up adds; and the seat mixer on Team.
   Removed (ledger): the three swapped tab panels of plan cards (now one morphing panel), the dark "recommended" cards,
   checkout buttons with no real destination (Dev, Max, Ultra and Team offer "Chat with buying specialist"), the
   repeated "Pay as you go" price line, the invented helper sentences, the reading-row stripe.
   Every tier, price, line and footnote on Hanzo's page is in the HTML: the panel shows one plan, and the plan index
   (hidden, shown when JavaScript is off) holds every plan whole. */
// Persona: a builder or a team lead choosing a plan
// Goal: know the price before you ask
// CTA: the selected plan's ask (Try Hanzo); metric: cta_click on pricing.free / pricing.go / pricing.pro
// Signature: one plan panel, many states: tabs and the plan rail morph a single panel (height, name, rolling price, Hanzo's lines) with no cut, and the Pro row walks its ladder
// Beyond: the compare sheet: every personal plan's own lines side by side with what each inherits, opened out of the panel
import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, MotionConfig, useInView, useScroll, useVelocity, useTransform, useSpring } from 'motion/react';
import { EASE, useCalm } from '../ui';
import { A, More, Cta, Tabs, Faq, DataTable, Band, Img } from '../kit';
import Odometer from '../v2/Odometer';
import Drawer from '../v2/x-cannon/Drawer';
import NoJs from '../NoJs';
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
const FREE = ['Chat on the web with Enso Auto', 'Free model requests and Kai decisions included', 'Search the web from chat', 'Write, edit and create content', 'Make code, pages and charts beside the chat', 'Choose how hard it thinks'];
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

/* ---------- the plans as states of one panel ---------- */
const SEAT = { Standard: [20, 25], Premium: [100, 125] };
const TEAM_INC = ["Add premium seats to raise the team's shared usage", 'One shared workspace: chat, meetings, calendar and contacts', 'Single sign-on, roles and an audit log', 'One bill for the whole team', 'Automations, with daily runs included'];
const ENT_INC = ['Audit logs', 'SCIM provisioning through Hanzo IAM'];
const PAYG_INC = ['Frontier & open-source models via unified API', 'OpenAI-compatible /v1/chat/completions endpoint', 'Intelligent semantic auto-routing & fallback', 'Prompt caching discounts up to 90%', 'Sandboxed code execution, web search & tools', 'Real-time spend limits, webhooks & usage alerts'];
const VOL_INC = ['Committed-use volume discounts starting at $5k/mo', 'Dedicated GPU clusters (H100, B200) in your cloud or VPC', 'Custom rate limits exceeding 100k+ RPM', 'Zero data retention & HIPAA / BAA compliance', '24/7 dedicated engineering Slack & priority routing'];
const SETS = [['free', 'go', 'pro'], ['team', 'ent'], ['payg', 'vol']];
const DEF = { x: '3x', bill: 'Annual', std: 2, prem: 0 };
const BUY = 'Chat with buying specialist';

// one plan, as one state of the panel: every string is Hanzo's (fig rolls; word is a price said in words)
function planOf(id, s = DEF) {
  if (id === 'free') return { name: 'Free', d: 'Chat and build with Hanzo, free.', word: 'No card needed', cta: ['Try Hanzo', '/signup', 'pricing.free'], note: 'Instant access · Free forever', items: FREE.slice(0, 4), col: 0 };
  if (id === 'go') return { name: 'Go', d: 'Your everyday AI development toolkit, with access to every model and more included usage.', fig: '$8', sub: 'Billed monthly', cta: ['Try Hanzo', PAY('go'), 'pricing.go'], note: 'No commitment · Cancel anytime', head: 'Everything in Free, plus:', items: GO.slice(0, 4), col: 1 };
  if (id === 'pro') {
    const i = Math.max(0, PRO.findIndex((q) => q.x === s.x)), q = PRO[i];
    return { name: q.name, ladder: true, d: q.d, fig: '$' + q.price, sub: 'Billed monthly', cta: q.to ? ['Try Hanzo', q.to, 'pricing.pro'] : [BUY, HELP, 'pricing.help'], note: 'No commitment · Cancel anytime', head: q.head, items: q.f, col: 2 + i };
  }
  if (id === 'team') {
    const k = s.bill === 'Annual' ? 0 : 1;
    return { name: 'Team', seats: true, d: 'For teams of 2 to 100: every model and usage for each member, one workspace, one bill.', fig: '$' + (s.std * SEAT.Standard[k] + s.prem * SEAT.Premium[k]).toLocaleString('en-US'), cta: [BUY, HELP, 'pricing.team'], note: ['Standard & Premium seats · From 2 members', 'Organizations can mix Standard and Premium seats · Cancel anytime'], items: TEAM_INC };
  }
  if (id === 'ent') return { name: 'Enterprise', d: 'For large businesses operating at scale', word: 'Seat price + usage at API rates', sub: 'US$20/seat/month, billed annually, 20 seat minimum. Usage cost scales with model and task.', cta: ['Get Enterprise plan', '/enterprise/start', 'pricing.enterprise'], alt: [BUY, HELP], head: 'All Team plan features, plus:', items: ENT_INC };
  if (id === 'payg') return { name: 'Pay as you go', d: 'Direct metered access to all frontier models, coding agents, and tools with zero commitments.', word: 'Metered per token & second', cta: ['Get API Key', '/dev', 'pricing.api.key'], note: 'Instant access · No minimum spend', items: PAYG_INC };
  return { name: 'Volume & Dedicated', d: 'For organizations with high-throughput inference, custom routing, or dedicated VPC deployments.', word: 'Custom rates', sub: ['Volume discounts from $5k/mo', 'Dedicated GPU clusters & custom routing SLAs'], cta: ['Contact API Sales', '/contact-sales', 'pricing.api.sales'], note: 'Dedicated VPC & 24/7 Slack support available', head: 'Everything in Pay as you go, plus:', items: VOL_INC };
}
const lines = (v) => [].concat(v || []);

/* ---------- the motion of the panel (MASTER 3.1: in-out for things that move and stay, emphasis for arrivals) ---------- */
const EM = [0.4, 0, 0.2, 1];
const MOVE = { duration: 0.5, ease: EM };
const IN = { duration: 0.3, ease: EASE };
const NONE = { duration: 0 };

// text that changes in place: the old line lifts away while the new one rises into its seat (no cut, no remount)
// `roll`: a one-line name rolls through a clipped slot like the odometer beside it (the two words never overlap)
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

// a block of the panel that glides to its new place when the blocks above it grow or shrink
const Slot = ({ className, children }) => <motion.div layout="position" transition={MOVE} className={className}>{children}</motion.div>;

// the price: the odometer stays mounted while the plan has a figure, so $8 rolls to $15 or to a Team total
function Price({ p }) {
  return (
    <div className="xpr-price" aria-live="polite">
      <AnimatePresence mode="popLayout" initial={false}>
        {p.fig
          ? <motion.span key="fig" className="xpr-fig" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={IN}><Odometer value={p.fig} /><span className="xpr-u">USD/month</span></motion.span>
          : <motion.span key={p.word} className="xpr-word" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={IN}>{p.word}</motion.span>}
      </AnimatePresence>
    </div>
  );
}

// Hanzo's included lines: a line both plans share keeps its row and slides; the others leave and arrive in a 60 ms stagger
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

const fade = { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, transition: { duration: 0.15 } }, transition: IN };

function Stepper({ label, n, set, min, max }) {
  return (
    <div className="xpr-step" role="group" aria-label={label}>
      <button type="button" onClick={() => set(n - 1)} disabled={n <= min} aria-label={label + ' −'}>−</button>
      <output aria-live="polite">{n}</output>
      <button type="button" onClick={() => set(n + 1)} disabled={n >= max} aria-label={label + ' +'}>+</button>
    </div>
  );
}

// Team's seats: Hanzo's two seat prices, each with a stepper that prices your own mix (from 2 members to 100)
function Seats({ s, set }) {
  const k = s.bill === 'Annual' ? 0 : 1;
  const setS = (v) => set.std(Math.max(Math.max(0, 2 - s.prem), Math.min(100 - s.prem, v)));
  const setP = (v) => set.prem(Math.max(Math.max(0, 2 - s.std), Math.min(100 - s.std, v)));
  return (
    <div className="xpr-seats">
      <div>
        <b>Standard seat</b>
        <span>All Hanzo features, plus more usage than Pro</span>
        <p className="xpr-seat-p" aria-live="polite"><Odometer value={'$' + SEAT.Standard[k]} /></p>
        <small>Per seat / month if billed annually. $25 if billed monthly.</small>
        <Stepper label="Standard seat" n={s.std} set={setS} min={Math.max(0, 2 - s.prem)} max={100 - s.prem} />
      </div>
      <div>
        <b>Premium seat</b>
        <span>5x more usage than standard seats</span>
        <p className="xpr-seat-p" aria-live="polite"><Odometer value={'$' + SEAT.Premium[k]} /></p>
        <small>Per seat / month if billed annually. $125 if billed monthly.</small>
        <Stepper label="Premium seat" n={s.prem} set={setP} min={Math.max(0, 2 - s.std)} max={100 - s.std} />
      </div>
    </div>
  );
}

// Hanzo's own trust links, beside the asks (PLAN-COMPONENTS 2.4 "Pricing objections")
// scroll-tilt: the row arrives leaning back and levels out, then leans on rotateX with the speed of the scroll
function Trust() {
  const calm = useCalm();
  const [on, setOn] = useState(false); // after hydration and only when motion is welcome
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

/* ---------- section entrances (MOTION-MAP /pricing: text-mask-film, grow-from-point, scroll-tilt, vertical-ticker,
   underline-sweep), page-local. The first two are on the first screen, so they play from the first paint in CSS (no
   wait on hydration); the rest are marked once with data-in by one observer when a quarter of them (or of the screen)
   is in view, and Pricing.css plays them. Start states live under html.js and prefers-reduced-motion: no-preference,
   so the server markup is final and JS off or reduced motion show everything at rest. ---------- */
function useEnter(root) {
  useEffect(() => {
    const band = root.current?.querySelector('.x-band');
    if (band && !band.dataset.enter) band.dataset.enter = 'underline-sweep'; // the kit Band, swept page-locally
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

/* ---------- the signature: ONE plan panel. The rail picks a plan, the tabs pick a set; the panel never remounts ---------- */
function PlanPanel({ tab, at, setAt, s, set, open, hand, live }) {
  const calm = useCalm();
  const still = calm || !live; // the first paint (and a #team link) lands without moving; reduced motion never moves
  const ids = SETS[tab];
  const p = planOf(ids[at], s);
  const inner = useRef(null);
  const [h, setH] = useState('auto');
  useEffect(() => {
    const el = inner.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setH(el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const keys = (e) => {
    const k = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
    if (!k) return;
    e.preventDefault();
    const n = (at + k + ids.length) % ids.length;
    setAt(n);
    document.getElementById('xpr-rail-' + n)?.focus();
  };
  const note = p.alt ? <A to={p.alt[1]} className="xpr-alt">{p.alt[0]}</A> : lines(p.note).map((n) => <span key={n} className="xpr-line">{n}</span>);
  return (
    <div className="xpr-morph" data-enter="grow-from-point" role="tabpanel" id={'xpr-plans-panel-' + tab} aria-labelledby={'xpr-plans-tab-' + tab} data-set={tab} onPointerEnter={hand} onFocusCapture={hand}>
      <MotionCfg calm={calm}>
        <div className="xpr-rail" role="radiogroup" aria-label={TABS[tab]} onKeyDown={keys}>
          <AnimatePresence mode="popLayout" initial={false}>
            {ids.map((id, i) => {
              const q = planOf(id, s), on = i === at;
              return (
                <motion.button key={id} id={'xpr-rail-' + i} type="button" role="radio" aria-checked={on} tabIndex={on ? 0 : -1} className="xpr-rail-i" onClick={() => setAt(i)}
                  layout="position" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0, transition: { ...IN, delay: 0.06 * i } }} exit={{ opacity: 0, transition: { duration: 0.15 } }} transition={MOVE}>
                  {on && <motion.span layoutId="xpr-rail-bg" className="xpr-rail-bg" transition={MOVE} />}
                  <span className="xpr-rail-n"><Swap k={q.name} roll>{q.name}</Swap></span>
                  <span className={'xpr-rail-p' + (q.fig ? ' fig' : '')}>{q.fig ? <Odometer value={q.fig} /> : q.word}</span>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>
        <motion.div className="xpr-frame" initial={false} animate={{ height: h }} transition={still ? NONE : MOVE}>
          <div className="xpr-detail" ref={inner}>
            <Slot className="xpr-pa">
              <div className="xpr-r-name">
                <h2 className="xpr-pname"><Swap k={p.name} roll>{p.name}</Swap></h2>
                <AnimatePresence mode="popLayout" initial={false}>
                  {p.ladder && <motion.div key="ladder" {...fade}><Seg opts={PRO.map((q) => q.x)} val={s.x} set={(v) => { hand(); set.x(v); }} id="xpr-mult" label="Usage multiple" /></motion.div>}
                  {p.seats && <motion.div key="bill" className="xpr-bill" {...fade}><Seg opts={['Annual', 'Monthly']} val={s.bill} set={set.bill} id="xpr-bill" label="Billing period" /><span className="xpr-save">−20%</span></motion.div>}
                </AnimatePresence>
              </div>
              <Swap k={p.d} className="xpr-d">{p.d}</Swap>
              <Price p={p} />
              <Swap k={lines(p.sub).join('|')} className="xpr-sub">{lines(p.sub).map((t) => <span key={t} className="xpr-line">{t}</span>)}</Swap>
              <AnimatePresence mode="popLayout" initial={false}>
                {p.seats && <motion.div key="seats" {...fade}><Seats s={s} set={set} /></motion.div>}
              </AnimatePresence>
              <div className="xpr-r-cta"><Cta to={p.cta[1]} size="lg" id={p.cta[2]} className="xpr-cta" thumb>{p.cta[0]}</Cta></div>
              <Swap k={p.alt ? 'alt' : lines(p.note).join('|')} className="xpr-note">{note}</Swap>
            </Slot>
            <Slot className="xpr-pb">
              <div className="xpr-inc">
                <p className="xpr-inc-h">What’s included</p>
                <Swap k={p.head || '-'} className="xpr-head">{p.head || ''}</Swap>
                <Lines items={p.items} />
              </div>
              <AnimatePresence mode="popLayout" initial={false}>
                {p.col != null && <motion.button key="cmp" type="button" className="xpr-more" onClick={(e) => open(e, p.col)} data-cursor="" {...fade}><span>Compare plans</span><span aria-hidden="true">→</span></motion.button>}
              </AnimatePresence>
            </Slot>
          </div>
        </motion.div>
      </MotionCfg>
    </div>
  );
}

// under reduced motion nothing in the panel travels (no slides, no height ease); words still cross over in place
const MotionCfg = ({ calm, children }) => <MotionConfig reducedMotion={calm ? 'always' : 'never'}>{children}</MotionConfig>;

/* the plan index: every plan whole, in the HTML for readers, search and the parity check; shown when JavaScript is off */
function Index() {
  const all = [['Personal', ['free', 'go', ...PRO.map((q) => ['pro', { ...DEF, x: q.x }])]], ['Team', ['team', 'ent']], ['API', ['payg', 'vol']]];
  return (
    <div className="xpr-all" hidden>
      {all.map(([t, ids]) => (
        <section key={t} aria-label={t}>
          <h2 className="xpr-all-t">{t}</h2>
          {ids.map((x) => {
            const p = Array.isArray(x) ? planOf(x[0], x[1]) : planOf(x);
            return (
              <article key={p.name} className="xpr-all-p">
                <h3>{p.name}</h3>
                {p.seats && <p className="xpr-sub">Annual · Monthly <span className="xpr-save">−20%</span></p>}
                <p className="xpr-d">{p.d}</p>
                <p className="xpr-all-f">{p.fig ? p.fig + ' USD/month' : p.word}</p>
                {lines(p.sub).map((t) => <p key={t} className="xpr-sub">{t}</p>)}
                {p.seats && <Seats s={DEF} set={{ std() {}, prem() {} }} />}
                <p><A to={p.cta[1]}>{p.cta[0]}</A></p>
                {p.alt ? <p><A to={p.alt[1]}>{p.alt[0]}</A></p> : lines(p.note).map((t) => <p key={t} className="xpr-note">{t}</p>)}
                <p className="xpr-inc-h">What’s included</p>
                {p.head && <p className="xpr-head">{p.head}</p>}
                <List items={p.items} />
              </article>
            );
          })}
        </section>
      ))}
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

// the API set's own reading, under the panel while the API tab is on (in the HTML always)
function ApiMore({ on }) {
  const [allBill, setAllBill] = useState(false); // phones show the first way we bill; the rest open behind "Read more"
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
    </div>
  );
}

/* ---------- questions ---------- */
const QA = [
  ['What is free?', 'Running your own private AI on your own machine, and the open Zen weights, free forever. Enso Auto on the Free plan, on a daily pool. Everything open source is yours to download and run.'],
  ['What does a plan cost?', 'Exactly the price on its card, by the month or, where a year is sold, by the year. Free costs nothing. Team is priced per member, from 2 members. Paid plans include usage on every model; top up prepaid credit anytime for more. Enterprise is priced with our team.'],
  ["What happens when I reach my plan's included usage?", "Keep using any model with prepaid credit, which you can add anytime. Your plan's usage renews every billing period."],
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
// models that plan's own lines name: Free lights "Enso Auto"; Go and every plan above it light "Every model,
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
  const root = useRef(null);
  useEnter(root);
  const [tab, setTab] = useState(0);
  const [ats, setAts] = useState([0, 0, 0]); // the plan picked in each set (the lowest by default: Free, Team, Pay as you go)
  const at = ats[tab];
  const setAt = (i) => { setLive(true); setAts((a) => a.map((v, j) => (j === tab ? i : v))); };
  const artOn = tab === 0 && at === 0 ? [0] : [0, 1, 2];
  const [src, setSrc] = useState(null);
  const [lit, setLit] = useState(-1);
  const [live, setLive] = useState(false); // the panel eases its height only once a hand has touched it
  // the panel's own state: the Pro ladder rung, Team's billing period and seat mix
  const [x, setX] = useState(DEF.x);
  const [bill, setBill] = useState(DEF.bill);
  const [std, setStd] = useState(DEF.std);
  const [prem, setPrem] = useState(DEF.prem);
  const s = { x, bill, std, prem };
  const set = { x: setX, bill: setBill, std: setStd, prem: setPrem };
  // idle: the Pro row walks its ladder once (Pro, Dev, Max, Ultra, back to Pro) within 4.3 s and rests (WCAG 2.2.2:
  // moving content under 5 s needs no pause control); a pointer or focus on the panel stops it at once
  const rail = useRef(null);
  const seen = useInView(rail, { amount: 0.3 });
  const calm = useCalm();
  const [mine, setMine] = useState(false);
  const hand = useCallback(() => { setMine(true); setLive(true); }, []);
  useEffect(() => {
    if (mine || calm || !seen || tab !== 0) return;
    let n = 0, t = 0;
    const step = () => { n += 1; setX(PRO[n % PRO.length].x); if (n >= PRO.length) { clearInterval(t); setMine(true); } };
    const first = setTimeout(() => { step(); t = setInterval(step, 1100); }, 1000);
    return () => { clearTimeout(first); clearInterval(t); };
  }, [mine, calm, seen, tab]);
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
  const pick = (i) => { setLive(true); setTab(i); try { history.replaceState(null, '', '#' + TABS[i].toLowerCase()); } catch { /* the tab still changes */ } };
  const open = useCallback((e, col) => { setLit(col); setSrc(e.currentTarget.closest('.xpr-morph') || e.currentTarget); }, []);
  const close = useCallback(() => setSrc(null), []);
  return (
    <main ref={root} className="xpr">
      <section className="xpr-hero" aria-labelledby="xpr-h1">
        <div className="xpr-w xpr-hero-g">
          <h1 id="xpr-h1" className="xpr-h1" data-enter="text-mask-film"><span className="xpr-cut"><span>Pricing</span></span></h1>
          <p className="xpr-lede">Start free, every model on one bill.</p>
          <Art lit={artOn} />
        </div>
      </section>
      <div className="xpr-room">
        <div className="xpr-tabs">
          <div className="xpr-w"><Tabs id="xpr-plans" label="Plans" tabs={TABS} value={tab} onChange={pick} size="lg" /></div>
        </div>
        <div className="xpr-w xpr-panels" ref={rail}>
          <PlanPanel tab={tab} at={at} setAt={setAt} s={s} set={set} open={open} hand={hand} live={live} />
          <Trust />
          <Index />
          <ApiMore on={tab === 2} />
        </div>
      </div>
      <NoJs css=".xpr-morph{display:none}.xpr-all{display:grid!important}.xpr-api{display:block!important}" />

      <section className="xpr-faq" aria-labelledby="xpr-faq-h">
        <div className="xpr-w xpr-split">
          <header className="xpr-stick"><h2 id="xpr-faq-h" className="xpr-h">Frequently Asked Questions</h2></header>
          <div data-enter="vertical-ticker">
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
        note={<p className="xpr-band-note"><span>Need dedicated VPC clusters, custom fine-tuning, or high-volume enterprise SLAs?</span> <A to="/enterprise">Contact our engineering team →</A></p>}
      />

      <Drawer open={!!src} from={src} onClose={close} title="Compare plans" label="Compare plans">
        <CompareSheet lit={lit} />
      </Drawer>
    </main>
  );
}
