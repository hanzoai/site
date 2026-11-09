'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'motion/react';
import { EASE, Words } from '../ui';
import { More } from '../kit';
import { Glyph } from './glyphs';
import { PLANS, SEATS, checkoutAbs } from '../../lib/plans';
import { chose, LIST, picked, RUNG, termed, viewed } from '../../lib/funnel';
import { press } from '../../lib/press';

const go = checkoutAbs(PLANS.go.id);
const bots = (n) => `Hanzo Bot: ${n} bot${n === 1 ? '' : 's'} of your own`;
const TIERS = {
  '3x': { name: PLANS.pro.name, price: PLANS.pro.price, after: 'Everything in Go, plus:', href: checkoutAbs(PLANS.pro.id), desc: 'For serious builders running agents, shipping code, and needing substantially higher limits.', f: ['3x more usage than Go', '3x higher limits than Go', bots(PLANS.pro.bots)] },
  '5x': { name: PLANS.dev.name, price: PLANS.dev.price, after: 'Everything in Pro, plus:', desc: 'For serious builders running agents, shipping code, and needing substantially higher limits.', f: ['5x more usage than Go', '5x higher limits than Go', bots(PLANS.dev.bots)] },
  '15x': { name: PLANS.max.name, price: PLANS.max.price, after: 'Everything in Dev, plus:', desc: 'For serious builders running agents, shipping code, and needing substantially higher limits.', f: ['15x more usage than Go', '15x higher limits than Go', bots(PLANS.max.bots)] },
  '25x': { name: PLANS.ultra.name, price: PLANS.ultra.price, after: 'Everything in Max, plus:', desc: 'For the biggest workloads. Usage beyond what is included is paid from your prepaid balance at list price', f: ['25x more usage than Go', '25x higher limits than Go', 'Usage beyond what is included is paid from your prepaid balance at list price', bots(PLANS.ultra.bots)] },
};
const COMMON = ['Early access to new models and features', 'Train custom models on your data', 'Hanzo Engine to run models on your own hardware', 'Dedicated support'];

/* A plan's mark at its card's head, and a line's by what it names (first match wins; a line no rule names wears the check). */
const MARK = { Free: 'sprout', Go: 'zap', Pro: 'rocket', Dev: 'cpu', Max: 'crown', Ultra: 'gem', Team: 'users', Enterprise: 'building-2', 'Pay as you go': 'terminal', 'Volume & Dedicated': 'building-2' };
const GLYPHS = [[/\bterminal\b|\beditor\b|\bCLI\b|\bMCP\b|\bSDK\b/i, 'terminal'], [/\bHanzo Dev\b|\bbuild apps\b|\bcode\b/i, 'code'], [/\blimits?\b.*\bhours?\b|\bevery 5 hours\b/i, 'timer'], [/\busage\b/i, 'gauge'], [/\bautomations?\b/i, 'workflow'], [/\brequests? every day\b|\bdaily\b/i, 'calendar-clock'], [/\bguests?\b|\binvite\b/i, 'user-plus'], [/\bmeetings?\b|\bcalendar\b|\bcontacts\b|\bworkspace\b|\bmembers?\b|\bteam\b/i, 'users'], [/\bbots?\b|\bagents?\b/i, 'bot'], [/\bsupport\b|\bonboarding\b/i, 'headphones'], [/\bchat\b/i, 'message-circle'], [/\bmodels?\b|\bEnso\b|\bZen\b|\bKai\b/i, 'sparkles']];
const glyph = (line) => GLYPHS.find(([re]) => re.test(line))?.[1] ?? 'check';

/* A price that rolls to its new value: up when it rises, down when it falls. */
function Price({ v, unit = 'USD/month' }) {
  const prev = useRef(v);
  const dir = typeof v === 'number' && typeof prev.current === 'number' && v < prev.current ? -1 : 1;
  useEffect(() => { prev.current = v; }, [v]);
  return (
    <p className="x-price">
      <span className="x-price-roll">
        <AnimatePresence mode="popLayout" initial={false} custom={dir}>
          <motion.b key={v} custom={dir} className={typeof v === 'string' && v.length > 14 ? 'long' : undefined} variants={{ i: (d) => ({ y: d * 28, opacity: 0, filter: 'blur(4px)' }), a: { y: 0, opacity: 1, filter: 'blur(0px)' }, o: (d) => ({ y: d * -28, opacity: 0, filter: 'blur(4px)' }) }} initial="i" animate="a" exit="o" transition={{ type: 'spring', stiffness: 380, damping: 30 }}>
            {typeof v === 'number' ? '$' + v : v}
          </motion.b>
        </AnimatePresence>
      </span>
      {unit && <span className="x-price-u">{unit}</span>}
    </p>
  );
}

function List({ head, items }) {
  // on a phone each card's lines fold under their heading (hanzo.ai's plan cards); wider, they stay open
  const box = useRef(null);
  useEffect(() => { if (matchMedia('(max-width: 900px)').matches) box.current.open = false; }, []);
  return (
    <details className="x-plan-l" ref={box} open>
      <summary>{head || 'What’s included'}</summary>
      <ul>
        <AnimatePresence mode="popLayout" initial={false}>
          {items.map((t) => (
            <motion.li key={t} layout initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }} transition={{ duration: 0.35, ease: EASE }}><Glyph name={glyph(t)} size={16} />{t}</motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </details>
  );
}

function Plan({ name, desc, price, unit, sub, cta, href, note, head, items, top, pill, solid, free, i = 0, sold }) {
  // the way in is sometimes a page of this site, whose press the page transition takes over: it is read where the
  // transition reads it (lib/press.js)
  const way = useRef(null);
  useEffect(() => press(way.current, () => chose(sold)), [sold.slug, sold.every, sold.cta]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <motion.article
      layout
      className={'x-plan' + (solid ? ' strong' : '')} data-free={free || undefined} data-tilt=""
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
      transition={{ duration: 0.7, ease: EASE, delay: i * 0.07 }}
      whileHover={{ y: -4 }}
    >
      <div className="x-plan-h"><motion.h3 layout="position"><Glyph name={MARK[name]} size={20} />{name}</motion.h3>{pill}</div>
      {top}
      <p className="x-plan-d">{desc}</p>
      {price !== undefined && <Price v={price} unit={unit} />}
      {sub && <p className="x-plan-sub">{sub}</p>}
      <motion.a ref={way} href={href} className={'x-btn' + (solid ? ' solid' : '')} whileTap={{ scale: 0.97 }} data-ga="" data-cta={'home.plan-' + sold.slug}>{cta}</motion.a>
      {note && <p className="x-plan-note">{note}</p>}
      <List head={head} items={items} />
    </motion.article>
  );
}

function Seg({ opts, val, set, id }) {
  return (
    <div className="x-seg" role="tablist">
      {opts.map((o) => (
        <button key={o} type="button" role="tab" aria-selected={val === o} onClick={() => set(o)}>
          {val === o && <motion.span layoutId={id} className="x-seg-bg" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
          <span>{o}</span>
        </button>
      ))}
    </div>
  );
}

export default function Pricing() {
  const [tab, setTab] = useState('Personal');
  const [x, setX] = useState('3x');
  const [bill, setBill] = useState('Annual');
  const t = TIERS[x];
  // what each card sells, as the app's funnel names it (lib/funnel.js): the slug, the tab, how it is taken and the way in's name
  const every = bill === 'Annual' ? 'year' : 'month';
  const tabName = { Personal: 'individual', Team: 'team', API: 'api' }[tab];
  const rung = RUNG[Object.keys(TIERS).indexOf(x)];
  const sale = (slug, how, label, term = 'month') => ({ slug, how, cta: label, tab: tabName, every: term });
  // one view per tab a reader looks at, with the prices it shows
  useEffect(() => { viewed(tabName, LIST[tabName]); }, [tabName]);
  return (
    <section className="x-sec x-pricing" id="pricing" data-hz-view="plans" aria-labelledby="pricing-h">
      <div className="x-wrap">
        <header className="x-head center"><Words text="Pricing" /></header>
        <div className="x-center"><Seg opts={['Personal', 'Team', 'API']} val={tab} set={setTab} id="price-tab" /></div>
        <LayoutGroup>
          <motion.div layout className={'x-plans n' + (tab === 'Personal' ? 3 : 2)}>
            <AnimatePresence mode="popLayout" initial={false}>
              {tab === 'Personal' && [
                <Plan key="free" i={0} free sold={sale('free', 'free', 'Try Hanzo')} name="Free" desc="Chat and build with Hanzo, free." price="Free" unit="" sub="No card needed" cta="Try Hanzo" href="https://hanzo.ai/signup" note="Instant access · Free forever" head="What’s included" items={['Chat on the web with Enso Auto', 'Free model requests and Kai decisions included', 'Search the web from chat', 'Write, edit and create content', 'Make code, pages and charts beside the chat', 'Choose how hard it thinks']} />,
                <Plan key="go" i={1} sold={sale(PLANS.go.id, 'card', 'Get ' + PLANS.go.name)} name="Go" desc="Your everyday AI development toolkit, with access to every model and more included usage." price={PLANS.go.price} sub="Billed monthly" cta="Try Hanzo" href={go} note="No commitment · Cancel anytime" head="Everything in Free, plus:" items={['Build apps with Hanzo Dev', 'Connect any MCP server in Hanzo Dev', 'The Hanzo CLI for macOS, Windows and Linux', 'Every model, including Enso Ultra and Kai', 'Usage included on every model', 'Priority inference and priority support', 'Your own agents, working in the background', 'Automations, with daily runs included']} />,
                <Plan key="pro" i={2} solid sold={sale(rung, 'card', 'Get ' + t.name)} name={t.name} desc={t.desc} price={t.price} sub="Billed monthly" cta="Try Hanzo" href={t.href || '/pricing'} note="No commitment · Cancel anytime" head={t.after} items={[...t.f, ...COMMON]}
                  pill={<Seg opts={['3x', '5x', '15x', '25x']} val={x} set={(v) => { setX(v); if (v !== x) picked(RUNG[Object.keys(TIERS).indexOf(v)], 'individual'); }} id="mult" />} />,
              ]}
              {tab === 'Team' && [
                <Plan key="team" i={0} solid sold={sale('team', 'card', 'Get Team', every)} name="Team" desc="For teams of 2 to 100: every model and usage for each member, one workspace, one bill." sub="Standard & Premium seats · From 2 members" cta="Try Hanzo" href="https://hanzo.ai/signup" note="Organizations can mix Standard and Premium seats · Cancel anytime"
                  top={(
                    <>
                      <div className="x-bill"><Seg opts={['Annual', 'Monthly']} val={bill} set={(v) => { setBill(v); if (v !== bill) termed('team', v === 'Annual', 'team'); }} id="bill" /><span className="x-save">{`−${SEATS.saving}%`}</span></div>
                      <div className="x-seats">
                        <div><b>Standard seat</b><span>All Hanzo features, plus more usage than Pro</span><Price v={bill === 'Annual' ? SEATS.standard.monthAnnual : SEATS.standard.month} unit="" /><small>{`Per seat / month if billed annually. $${SEATS.standard.month} if billed monthly.`}</small></div>
                        <div><b>Premium seat</b><span>5x more usage than standard seats</span><Price v={bill === 'Annual' ? SEATS.premium.monthAnnual : SEATS.premium.month} unit="" /><small>{`Per seat / month if billed annually. $${SEATS.premium.month} if billed monthly.`}</small></div>
                      </div>
                    </>
                  )}
                  head="" items={['Add premium seats to raise the team\'s shared usage', 'One shared workspace: chat, meetings, calendar and contacts', 'Single sign-on, roles and an audit log', 'One bill for the whole team', 'Automations, with daily runs included']} />,
                <Plan key="ent" i={1} sold={sale('enterprise', 'sales', 'Get Enterprise plan', every)} name="Enterprise" desc="For large businesses operating at scale" price="Seat price + usage at API rates" unit="" sub={`US$${SEATS.enterprise.monthAnnual}/seat/month, billed annually, ${SEATS.enterprise.min} seat minimum. Usage cost scales with model and task.`} cta="Get Enterprise plan" href="/pricing" note="Chat with buying specialist" head="All Team plan features, plus:" items={['Audit logs', 'SCIM provisioning through Hanzo IAM']} />,
              ]}
              {tab === 'API' && [
                <Plan key="payg" i={0} solid sold={sale('api-payg', 'free', 'Get API Key')} name="Pay as you go" desc="Direct metered access to all frontier models, coding agents, and tools with zero commitments." price="Pay as you go" unit="" sub="Metered per token & second" cta="Open" href="https://platform.hanzo.ai" head="What’s included" items={['Frontier & open-source models via unified API', 'OpenAI-compatible /v1/chat/completions endpoint', 'Intelligent semantic auto-routing & fallback', 'Prompt caching discounts up to 90%', 'Sandboxed code execution, web search & tools', 'Real-time spend limits, webhooks & usage alerts']} />,
                <Plan key="vol" i={1} sold={sale('api-enterprise', 'sales', 'Contact API Sales')} name="Volume & Dedicated" desc="For organizations with high-throughput inference, custom routing, or dedicated VPC deployments." price="Custom rates" unit="" sub="Volume discounts from $5k/mo · Dedicated GPU clusters & custom routing SLAs" cta="Contact API Sales" href="/pricing" note="Dedicated VPC & 24/7 Slack support available" head="Everything in Pay as you go, plus:" items={['Committed-use volume discounts starting at $5k/mo', 'Dedicated GPU clusters (H100, B200) in your cloud or VPC', 'Custom rate limits exceeding 100k+ RPM', 'Zero data retention & HIPAA / BAA compliance', '24/7 dedicated engineering Slack & priority routing']} />,
              ]}
            </AnimatePresence>
          </motion.div>
        </LayoutGroup>
        <div className="x-row-links"><More to="/pricing">Every plan, model rate and tool price</More></div>
      </div>
    </section>
  );
}
