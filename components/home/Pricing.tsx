'use client';
import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'motion/react';
import { EASE } from '../ui';
import { More } from '../kit';
import { Glyph } from './glyphs';
import Usage, { Stack } from '../Usage';
import { checkoutAbs } from '../../lib/plans';
import type { Term } from '../../lib/plans';
import useCommercePricing from '../../lib/useCommercePricing';
import { asked, chose, LIST, picked, termed, viewed } from '../../lib/funnel';
import { press } from '../../lib/press';

const ENT_FALLBACK = [
  'SSO (SAML 2.0 & OIDC) and SCIM provisioning through Hanzo IAM',
  'Audit logs, role-based access control and organization policies',
  'Zero data retention, custom privacy controls and HIPAA / BAA',
  'Dedicated VPC, on-prem or air-gapped cluster deployment',
  'Custom rate limits, priority routing and 99.99% uptime SLA',
  'Dedicated solution architect and 24/7 engineering Slack support',
];

/* A plan's mark at its card's head, and a line's by what it names (first match wins; a line no rule names wears the check). */
const MARK: Record<string, string> = { Free: 'sprout', Go: 'zap', Pro: 'rocket', Dev: 'cpu', Max: 'crown', Ultra: 'gem', Ultimate: 'sparkles', Unlimited: 'infinity', Team: 'users', Enterprise: 'building-2', 'Pay as you go': 'terminal', 'Volume & Dedicated': 'building-2' };
const GLYPHS: [RegExp, string][] = [[/^∞|\bunlimited\b/i, 'infinity'], [/\bterminal\b|\beditor\b|\bCLI\b|\bMCP\b|\bSDK\b/i, 'terminal'], [/\bHanzo Dev\b|\bbuild apps\b|\bcode\b/i, 'code'], [/\blimits?\b.*\bhours?\b|\bevery 5 hours\b/i, 'timer'], [/\busage\b/i, 'gauge'], [/\bautomations?\b/i, 'workflow'], [/\brequests? every day\b|\bdaily\b/i, 'calendar-clock'], [/\bguests?\b|\binvite\b/i, 'user-plus'], [/\bmeetings?\b|\bcalendar\b|\bcontacts\b|\bworkspace\b|\bmembers?\b|\bteam\b/i, 'users'], [/\bbots?\b|\bagents?\b/i, 'bot'], [/\bsupport\b|\bonboarding\b|\barchitect\b/i, 'headphones'], [/\bSSO\b|\bSAML\b|\bSCIM\b|\bRBAC\b|\baudit\b|\bHIPAA\b|\bprivacy\b|\bretention\b/i, 'settings'], [/\bVPC\b|\bcluster\b|\bon-prem\b|\bair-gapped\b/i, 'cloud'], [/\buptime\b|\bSLA\b|\bpriority\b/i, 'activity'], [/\bchat\b/i, 'message-circle'], [/\bmodels?\b|\bEnso\b|\bZen\b|\bKai\b/i, 'sparkles']];
const glyph = (line: string) => GLYPHS.find(([re]) => re.test(line))?.[1] ?? 'check';

/* A price that rolls to its new value: up when it rises, down when it falls. */
function Price({ v, unit = 'USD/month' }: { v: number | string; unit?: string }) {
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

/** A card's lines: a heading and the lines under it. */
interface Lines { head?: string; items: string[] }

function List({ sets, at }: { sets: Lines[]; at: number }) {
  // on a phone each card's lines fold under their heading (hanzo.ai's plan cards); wider, they stay open. A card on the
  // usage slider holds every stop's lines in one cell (Stack), so a move never changes its height.
  const box = useRef<HTMLDetailsElement>(null);
  useEffect(() => { if (matchMedia('(max-width: 900px)').matches) box.current!.open = false; }, []);
  return (
    <details className="x-plan-l" ref={box} open>
      <summary><Stack at={at}>{sets.map((s) => s.head || 'What’s included')}</Stack></summary>
      <Stack at={at} as="div">
        {sets.map((s, k) => <ul key={k}>{s.items.map((t) => <li key={t}><Glyph name={glyph(t)} size={16} />{t}</li>)}</ul>)}
      </Stack>
    </details>
  );
}

/** What a card sells, as the funnel names it: the slug, how it is taken, the way in's name, the tab and the term. */
interface Sold { slug: string; how: string; cta: string; tab: string; every: Term }
interface PlanProps {
  name: string; desc: ReactNode; price?: number | string; unit?: string; sub?: ReactNode; cta?: ReactNode; href?: string;
  alt?: [string, string]; note?: ReactNode; head?: string; items?: string[]; sets?: Lines[]; at?: number; top?: ReactNode;
  pick?: ReactNode; solid?: boolean; free?: boolean; i?: number; sold: Sold;
}

function Plan({ name, desc, price, unit, sub, cta, href, alt, note, head, items = [], sets = [{ head, items }], at = 0, top, pick, solid, free, i = 0, sold }: PlanProps) {
  // the way in is sometimes a page of this site, whose press the page transition takes over: it is read where the
  // transition reads it (lib/press.js)
  const way = useRef<HTMLAnchorElement>(null);
  const help = useRef<HTMLAnchorElement>(null);
  useEffect(() => press(way.current, () => chose(sold)), [sold.slug, sold.every, sold.cta]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => (alt ? press(help.current, () => asked(sold.slug, sold.tab, alt[0])) : undefined), [alt, sold.slug, sold.tab]); // eslint-disable-line react-hooks/exhaustive-deps
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
      <div className="x-plan-h"><motion.h3 layout="position"><Glyph name={MARK[name]} size={20} />{name}</motion.h3></div>
      {top}
      <p className="x-plan-d">{desc}</p>
      {price !== undefined && <Price v={price} unit={unit} />}
      {sub && <p className="x-plan-sub">{sub}</p>}
      {pick}
      <motion.a ref={way} href={href} className={'x-btn' + (solid ? ' solid' : '')} whileTap={{ scale: 0.97 }} data-ga="" data-cta={'home.plan-' + sold.slug}>{cta}</motion.a>
      {alt && <motion.a ref={help} href={alt[1]} className="x-btn x-btn-alt" whileTap={{ scale: 0.97 }} data-ga="" data-cta={'home.plan-' + sold.slug + '-help'}>{alt[0]}</motion.a>}
      {note && <p className="x-plan-note">{note}</p>}
      <List sets={sets} at={at} />
    </motion.article>
  );
}

function Seg({ opts, val, set, id }: { opts: string[]; val: string; set: (v: string) => void; id: string }) {
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

/** The funnel's name for each tab. */
const TAB: Record<string, string> = { Personal: 'individual', Team: 'team', API: 'api' };

export default function Pricing() {
  const { plans: PLANS, rungs, seats: SEATS } = useCommercePricing();
  const go = checkoutAbs(PLANS.go.id);
  const ENT_ITEMS = SEATS.enterprise.features.length ? SEATS.enterprise.features : ENT_FALLBACK;
  const [tab, setTab] = useState('Personal');
  const [step, setStep] = useState(0); // the usage slider's stop: Pro until it moves
  const [bill, setBill] = useState('Annual');
  // a live catalog that sells fewer rungs than the stop stood on brings the slider down to its highest
  const at = Math.min(step, rungs.length - 1);
  const t = rungs[at];
  const move = (k: number) => { setStep(k); if (k !== at) picked(rungs[k].id, 'individual'); };
  // what each card sells, as the app's funnel names it (lib/funnel.js): the slug, the tab, how it is taken and the way in's name
  const every = bill === 'Annual' ? 'year' : 'month';
  const tabName = TAB[tab];
  const sale = (slug: string, how: string, label: string, term: Term = 'month'): Sold => ({ slug, how, cta: label, tab: tabName, every: term });
  // one view per tab a reader looks at, with the prices it shows
  useEffect(() => { viewed(tabName, LIST[tabName]); }, [tabName]);
  return (
    <section className="x-sec x-pricing" id="pricing" data-hz-view="plans" aria-labelledby="pricing-h">
      <div className="x-wrap">
        <header className="x-head center"><h2 id="pricing-h">Pricing</h2></header>
        <div className="x-center"><Seg opts={['Personal', 'Team', 'API']} val={tab} set={setTab} id="price-tab" /></div>
        <LayoutGroup>
          <motion.div layout className={'x-plans n' + (tab === 'Personal' ? 3 : 2)}>
            <AnimatePresence mode="popLayout" initial={false}>
              {tab === 'Personal' && [
                <Plan key="free" i={0} free sold={sale('free', 'free', 'Try Hanzo')} name={PLANS.free.name} desc={PLANS.free.description} price="Free" unit="" sub="No card needed" cta="Try Hanzo" href="https://hanzo.ai/signup" note="Instant access · Free forever" head="What’s included" items={PLANS.free.features} />,
                <Plan key="go" i={1} sold={sale(PLANS.go.id, 'card', 'Get ' + PLANS.go.name)} name={PLANS.go.name} desc={PLANS.go.description} price={PLANS.go.price} sub="Billed monthly" cta="Try Hanzo" href={go} note="No commitment · Cancel anytime" head={PLANS.go.head || 'Everything in Free, plus:'} items={PLANS.go.features} />,
                <Plan key="pro" i={2} solid sold={sale(t.id, 'card', 'Get ' + t.name)} name={t.name} desc={<Stack at={at}>{rungs.map((r) => r.description)}</Stack>} price={t.price} sub="Billed monthly" cta="Try Hanzo" href={checkoutAbs(t.id)} note="No commitment · Cancel anytime"
                  sets={rungs.map((r) => ({ head: r.head, items: r.features }))} at={at} pick={<Usage rungs={rungs} at={at} set={move} />} />,
              ]}
              {tab === 'Team' && [
                <Plan key="team" i={0} solid sold={sale('team', 'card', 'Get Team', every)} name={SEATS.standard.name} desc={SEATS.standard.description} sub="Standard & Premium seats · From 2 members" cta="Try Hanzo" href="https://hanzo.ai/signup" note="Organizations can mix Standard and Premium seats · Cancel anytime"
                  top={(
                    <>
                      <div className="x-bill"><Seg opts={['Annual', 'Monthly']} val={bill} set={(v) => { setBill(v); if (v !== bill) termed('team', v === 'Annual', 'team'); }} id="bill" /><span className="x-save">{`−${SEATS.saving}%`}</span></div>
                      <div className="x-seats">
                        <div><b>Standard seat</b><span>All Hanzo features, plus more usage than Pro</span><Price v={bill === 'Annual' ? SEATS.standard.monthAnnual : SEATS.standard.month} unit="" /><small>{`Per seat / month if billed annually. $${SEATS.standard.month} if billed monthly.`}</small></div>
                        <div><b>Premium seat</b><span>5x more usage than standard seats</span><Price v={bill === 'Annual' ? SEATS.premium.monthAnnual : SEATS.premium.month} unit="" /><small>{`Per seat / month if billed annually. $${SEATS.premium.month} if billed monthly.`}</small></div>
                      </div>
                    </>
                  )}
                  head="" items={SEATS.standard.features} />,
                <Plan key="ent" i={1} sold={sale('enterprise', 'sales', 'Get Enterprise plan', every)} name={SEATS.enterprise.name} desc={SEATS.enterprise.description} price="Seat price + usage at API rates" unit="" sub={`US$${SEATS.enterprise.monthAnnual}/seat/month, billed annually, ${SEATS.enterprise.min} seat minimum. Usage cost scales with model and task.`} cta="Get Enterprise plan" href="/contact-sales" alt={['Chat with buying specialist', '/buying-specialist']} head={SEATS.enterprise.head || 'All Team plan features, plus:'} items={ENT_ITEMS} />,
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
