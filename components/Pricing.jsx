'use client';
/* Home, pricing (v2, calm; PLAN-COMPONENTS 5.2 on the home). One word as the headline, the audience tabs (kit Tabs,
   every panel in the HTML), plans on hairlines with their buttons aligned on one line (subgrid). The price rolls to its
   new value when you change the plan or the billing, up when it rises and down when it falls, in under 300 ms, no blur.
   No plan is "recommended" (no written rule for one), and every button is quiet: the page's one solid ask is "Try Hanzo"
   in the header and the ask bar. Buttons Hanzo gave no destination (Dev, Max, Ultra, Enterprise, Volume) are hidden, not
   looped back to /pricing (PLAN-COMPONENTS 1.3 #4). */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EASE } from './ui';
import { More, Tabs, TabPanel } from './kit';
import Lines from './v2/Lines';

const go = 'https://hanzo.ai/pay/confirm/card?plan=go&returnUrl=https%3A%2F%2Fhanzo.ai%2Fchat';
const TIERS = {
  '3x': { name: 'Pro', price: 15, after: 'Everything in Go, plus:', href: 'https://hanzo.ai/pay/confirm/card?plan=pro-2x&returnUrl=https%3A%2F%2Fhanzo.ai%2Fchat', desc: 'For serious builders running agents, shipping code, and needing substantially higher limits.', f: ['3x more usage than Go', '3x higher limits than Go', 'Hanzo Bot: 1 bot of your own'] },
  '5x': { name: 'Dev', price: 45, after: 'Everything in Pro, plus:', desc: 'For serious builders running agents, shipping code, and needing substantially higher limits.', f: ['5x more usage than Go', '5x higher limits than Go', 'Hanzo Bot: 2 bots of your own'] },
  '15x': { name: 'Max', price: 95, after: 'Everything in Dev, plus:', desc: 'For serious builders running agents, shipping code, and needing substantially higher limits.', f: ['15x more usage than Go', '15x higher limits than Go', 'Hanzo Bot: 5 bots of your own'] },
  '∞': { name: 'Ultra', price: 195, after: 'Everything in Max, plus:', desc: 'For the biggest workloads. Usage beyond what is included is paid from your prepaid balance at list price', f: ['Highest included usage across every model', 'Continuous usage with no window resets', 'Usage beyond what is included is paid from your prepaid balance at list price', 'Hanzo Bot: 10 bots of your own'] },
};
const COMMON = ['Early access to new models and features', 'Train custom models on your data', 'Hanzo Engine to run models on your own hardware', 'Dedicated support'];

/* A price that rolls to its new value: up when it rises, down when it falls. */
function Price({ v, unit = 'USD/month' }) {
  const prev = useRef(v);
  const dir = typeof v === 'number' && typeof prev.current === 'number' && v < prev.current ? -1 : 1;
  useEffect(() => { prev.current = v; }, [v]);
  return (
    <p className="x-price" aria-live="polite">
      <span className="x-price-roll">
        <AnimatePresence mode="popLayout" initial={false} custom={dir}>
          <motion.b key={v} custom={dir} variants={{ i: (d) => ({ y: d * 28, opacity: 0 }), a: { y: 0, opacity: 1 }, o: (d) => ({ y: d * -28, opacity: 0 }) }} initial="i" animate="a" exit="o" transition={{ duration: 0.28, ease: EASE }}>
            {typeof v === 'number' ? '$' + v : v}
          </motion.b>
        </AnimatePresence>
      </span>
      {unit && <span className="x-price-u">{unit}</span>}
    </p>
  );
}

function List({ head, items }) {
  return (
    <div className="x-plan-l">
      {head && <p>{head}</p>}
      <ul>
        <AnimatePresence mode="popLayout" initial={false}>
          {items.map((t) => (
            <motion.li key={t} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8, transition: { duration: 0.15 } }} transition={{ duration: 0.28, ease: EASE }}>{t}</motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}

/* Every plan has the same eight rows, so names, prices and buttons line up across the plans (CSS subgrid). */
function Plan({ id, name, desc, price, unit, sub, cta, href, note, head, items, top }) {
  return (
    <article className="x-plan hv-plan" aria-labelledby={id}>
      <h3 id={id}>{name}</h3>
      <div className="hv-plan-top">{top}</div>
      <p className="x-plan-d">{desc}</p>
      {price !== undefined ? <Price v={price} unit={unit} /> : <span aria-hidden="true" />}
      {sub ? <p className="x-plan-sub">{sub}</p> : <span aria-hidden="true" />}
      {href ? <a href={href} className="hv-btn hv-plan-b" data-cta={`home.pricing.${name.toLowerCase().replace(/\W+/g, '-')}`}>{cta}</a> : <span aria-hidden="true" />}
      {note ? <p className="x-plan-note">{note}</p> : <span aria-hidden="true" />}
      <List head={head} items={items} />
    </article>
  );
}

/* A small choice inside a plan (multiplier, billing): a radio group with arrow keys, the pill glides to the choice. */
function Seg({ opts, val, set, id, by }) {
  const refs = useRef([]);
  const key = (e, i) => {
    const d = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const j = (i + d + opts.length) % opts.length;
    set(opts[j]);
    refs.current[j]?.focus();
  };
  return (
    <div className="x-seg" role="radiogroup" aria-labelledby={by}>
      {opts.map((o, i) => (
        <button key={o} ref={(el) => { refs.current[i] = el; }} type="button" role="radio" aria-checked={val === o} tabIndex={val === o ? 0 : -1} onClick={() => set(o)} onKeyDown={(e) => key(e, i)}>
          {val === o && <motion.span layoutId={id} className="x-seg-bg" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
          <span>{o}</span>
        </button>
      ))}
    </div>
  );
}

export default function Pricing() {
  const [tab, setTab] = useState(0);
  const [x, setX] = useState('3x');
  const [bill, setBill] = useState('Annual');
  const t = TIERS[x];
  return (
    <section className="hv-pricing v2-sec" id="pricing" aria-labelledby="pricing-h">
      <div className="v2-wrap">
        <header className="hv-price-head">
          <Lines as="h2" id="pricing-h" className="v2-display" lines={['Pricing']} />
          <Tabs id="hv-price" tabs={['Personal', 'Team', 'API']} value={tab} onChange={setTab} label="Pricing" size="lg" />
        </header>
        <TabPanel id="hv-price" i={0} value={tab} className="x-plans hv-plans n3">
          <Plan id="hv-plan-free" name="Free" desc="Chat and build with Hanzo, free." price="Free" unit="" sub="No card needed" cta="Try Hanzo" href="https://hanzo.ai/signup" note="Instant access · Free forever" head="What’s included" items={['Chat on the web with Enso Free and Zen Free', 'Free model requests and Kai decisions included', 'Search the web from chat', 'Write, edit and create content', 'Make code, pages and charts beside the chat', 'Choose how hard it thinks']} />
          <Plan id="hv-plan-go" name="Go" desc="Your everyday AI development toolkit, with access to every model and more included usage." price={8} sub="Billed monthly" cta="Try Hanzo" href={go} note="No commitment · Cancel anytime" head="Everything in Free, plus:" items={['Build apps with Hanzo Dev', 'Connect any MCP server in Hanzo Dev', 'The Hanzo CLI for macOS, Windows and Linux', 'Every model, including Enso Ultra and Kai', 'Usage included on every model', 'Priority inference and priority support', 'Your own agents, working in the background', 'Automations, with daily runs included']} />
          <Plan id="hv-plan-pro" name={t.name} desc={t.desc} price={t.price} sub="Billed monthly" cta="Try Hanzo" href={t.href} note="No commitment · Cancel anytime" head={t.after} items={[...t.f, ...COMMON]}
            top={<Seg opts={['3x', '5x', '15x', '∞']} val={x} set={setX} id="hv-mult" by="hv-plan-pro" />} />
        </TabPanel>
        <TabPanel id="hv-price" i={1} value={tab} className="x-plans hv-plans n2">
          <Plan id="hv-plan-team" name="Team" desc="For teams of 2 to 100: every model and usage for each member, one workspace, one bill." sub="Standard & Premium seats · From 2 members" cta="Try Hanzo" href="https://hanzo.ai/signup" note="Organizations can mix Standard and Premium seats · Cancel anytime"
            top={(
              <>
                <div className="x-bill"><Seg opts={['Annual', 'Monthly']} val={bill} set={setBill} id="hv-bill" by="hv-plan-team" /><span className="x-save">−20%</span></div>
                <div className="x-seats">
                  <div><b>Standard seat</b><span>All Hanzo features, plus more usage than Pro</span><Price v={bill === 'Annual' ? 20 : 25} unit="" /><small>Per seat / month if billed annually. $25 if billed monthly.</small></div>
                  <div><b>Premium seat</b><span>5x more usage than standard seats</span><Price v={bill === 'Annual' ? 100 : 125} unit="" /><small>Per seat / month if billed annually. $125 if billed monthly.</small></div>
                </div>
              </>
            )}
            head="" items={['Add premium seats to raise the team\'s shared usage', 'One shared workspace: chat, meetings, calendar and contacts', 'Single sign-on, roles and an audit log', 'One bill for the whole team', 'Automations, with daily runs included']} />
          <Plan id="hv-plan-ent" name="Enterprise" desc="For large businesses operating at scale" price="Seat price + usage at API rates" unit="" sub="US$20/seat/month, billed annually, 20 seat minimum. Usage cost scales with model and task." note="Chat with buying specialist" head="All Team plan features, plus:" items={['Audit logs', 'SCIM provisioning through Hanzo IAM']} />
        </TabPanel>
        <TabPanel id="hv-price" i={2} value={tab} className="x-plans hv-plans n2">
          <Plan id="hv-plan-payg" name="Pay as you go" desc="Direct metered access to all frontier models, coding agents, and tools with zero commitments." price="Pay as you go" unit="" sub="Metered per token & second" cta="Open" href="https://platform.hanzo.ai" head="What’s included" items={['Frontier & open-source models via unified API', 'OpenAI-compatible /v1/chat/completions endpoint', 'Intelligent semantic auto-routing & fallback', 'Prompt caching discounts up to 90%', 'Sandboxed code execution, web search & tools', 'Real-time spend limits, webhooks & usage alerts']} />
          <Plan id="hv-plan-vol" name="Volume & Dedicated" desc="For organizations with high-throughput inference, custom routing, or dedicated VPC deployments." price="Custom rates" unit="" sub="Volume discounts from $5k/mo · Dedicated GPU clusters & custom routing SLAs" note="Dedicated VPC & 24/7 Slack support available" head="Everything in Pay as you go, plus:" items={['Committed-use volume discounts starting at $5k/mo', 'Dedicated GPU clusters (H100, B200) in your cloud or VPC', 'Custom rate limits exceeding 100k+ RPM', 'Zero data retention & HIPAA / BAA compliance', '24/7 dedicated engineering Slack & priority routing']} />
        </TabPanel>
        <div className="hv-links"><More to="/pricing">Every plan, model rate and tool price</More></div>
      </div>
    </section>
  );
}
