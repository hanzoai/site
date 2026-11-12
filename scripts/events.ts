// node scripts/events.mjs  (after `pnpm build`): every analytics event the site ports from hanzo-inc/app, in a real browser.
//
// The export in out/ is served as https://hanzo.ai (so the host's own ingest key applies) and every call to
// api.hanzo.ai is answered here, never sent: /v1/event is caught and parsed, the tag set, the lead and the newsletter
// are stubs. Each ported event is made to happen by the visitor action the app fires it on, and must reach the stream
// with the app's name and exactly the app's param keys (the ambient ones the client adds to every event are set aside).
// A negative check for each place the app says nothing. Every step runs; the exit code is 1 if any missed.
//
// Needs a Playwright with browsers (~/.cache/ms-playwright): the one in ~/work/hanzo-inc/app/node_modules (scripts/host.ts).
import { chromium, host, HOST } from './host.ts';
import LIVE from '../content/live/_pricing.json' with { type: 'json' };

// what Personal offers, as the build's plan list has it: Free, Go and every rung of the usage ladder it lists
const PERSONAL = ['free', 'go', ...['pro-3x', 'dev-5x', 'max-15x', 'ultra', 'ultimate', 'unlimited'].filter((s) => LIVE.plans[s])].join();
// what the client adds to an event, whatever it is about (touch, consent, the page): not the app's params
const AMBIENT = new Set(['fbp', 'fbc', 'cid', 'gclid', 'gbraid', 'wbraid', 'fbclid', 'clicked', 'event_id', 'consent', 'tags', 'userAgent', 'url', 'internal']);

const cors = { 'access-control-allow-origin': HOST, 'access-control-allow-credentials': 'true', 'access-control-allow-headers': '*', 'access-control-allow-methods': '*' };
const json = (body, status = 200) => ({ status, body: JSON.stringify(body), headers: { ...cors, 'content-type': 'application/json' } });

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1470, height: 801 }, permissions: ['clipboard-read', 'clipboard-write'] });
// a visitor, not a driven browser: the tag manager loads its (stubbed) Google tag, so a mirrored moment can be read
await ctx.addInitScript(() => {
  Object.defineProperty(Navigator.prototype, 'webdriver', { get: () => false });
  // the client sends its last batch by beacon when the page is hidden; a driven browser does not route a beacon, so it goes by fetch
  navigator.sendBeacon = (url, data) => { fetch(url, { method: 'POST', body: data, keepalive: true }).catch(() => {}); return true; };
});

const sent = []; // every event the stream was sent: { event, p: properties }
const posts = []; // every other write: { url, body }
const state = { lead: 'filed', news: 'pending' };

await ctx.route(/.*/, (r) => r.abort()); // nothing else leaves the machine
await host(ctx);
await ctx.route(/^https:\/\/api\.hanzo\.ai\//, (route) => {
  const req = route.request();
  const u = new URL(req.url());
  if (req.method() === 'OPTIONS') return route.fulfill({ status: 204, headers: cors });
  if (u.pathname === '/v1/event') {
    for (const e of JSON.parse(req.postData() || '{"batch":[]}').batch || []) sent.push({ event: e.event, p: e.properties || {} });
    return route.fulfill(json({}));
  }
  // a global consent rule, so no banner holds a moment back; one Google tag, so a mirrored moment lands in the data layer
  if (u.pathname === '/v1/project/tags') return route.fulfill(json({ tags: [{ platform: 'ga4', type: 'ga', id: 'G-TEST' }], consent: { mode: 'global', version: 1, region: 'US' } }));
  if (req.method() === 'POST') {
    let body = null;
    try { body = JSON.parse(req.postData() || 'null'); } catch { /* not JSON */ }
    posts.push({ path: u.pathname, body });
    if (u.pathname === '/v1/marketing/leads') return route.fulfill(state.lead === 'filed' ? json({ lead: 'lead_0123456789abcdef01234567', stage: 'new' }, 201) : json({ detail: 'down' }, 503));
    if (u.pathname === '/v1/marketing/subscribe') return route.fulfill(state.news === 'pending' ? json({ status: 'pending' }, 202) : json({ detail: 'slow down' }, 429));
    return route.fulfill(json({}));
  }
  route.fulfill(json({}, 404));
});
await ctx.route(/googletagmanager\.com|google-analytics\.com/, (r) => r.fulfill({ status: 200, body: '', headers: { 'content-type': 'text/javascript' } }));

// node scripts/events.mjs [home bands pricing sales search forms beta]: the named parts, else all
const only = process.argv.slice(2);
const on = (part) => only.length === 0 || only.includes(part);

const results = [];
let page;
let doing = ''; // the step a page error is reported under
const ok = (label, pass, why = '') => { results.push({ label, pass, why }); console.log(`${pass ? 'ok  ' : 'FAIL'} ${label}${pass ? '' : '  ' + why}`); };

let base = 0; // where the stream stood when the page was opened: what a page sends as it loads is read from here
/** The visitor opens a page; nothing waits on the stream, so the batch is flushed by hand when it is asked of. */
async function open(p, wait = 900) {
  if (page) await page.close();
  base = sent.length;
  page = await ctx.newPage();
  page.on('pageerror', (e) => console.log(`note ${p} threw during "${doing}": ${String(e).slice(0, 160)}`)); // the page's, not an event's: told, not counted
  await page.goto(HOST + p, { waitUntil: 'networkidle' });
  await page.waitForTimeout(wait);
}
/** The client sends its batch when the page is hidden: say so, rather than wait out its 5 s timer. */
const flush = async () => {
  await page.evaluate(() => {
    Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'hidden' });
    document.dispatchEvent(new Event('visibilitychange'));
    delete document.visibilityState;
    document.dispatchEvent(new Event('visibilitychange')); // and the page is back
  });
  await page.waitForTimeout(250);
};
/** A press on the first (or i-th) match of a selector. A link goes nowhere. */
const tap = (sel, i = 0) => page.evaluate(([s, k]) => {
  const el = document.querySelectorAll(s)[k];
  if (!el) throw new Error('nothing matches ' + s + ' [' + k + ']');
  if (el.matches('a[href]')) el.addEventListener('click', (e) => e.preventDefault(), { once: true });
  el.click();
}, [sel, i]);
const type = async (sel, text) => { await page.locator(sel).first().fill(text); };
// the usage slider (components/Usage.tsx) moved up by the keyboard from where it stands, one stop a press
const raise = async (sel, n) => {
  await page.locator(sel + ' .x-usage input').focus();
  for (let i = 0; i < n; i++) await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(500);
};

const own = (p) => Object.fromEntries(Object.entries(p).filter(([k]) => !AMBIENT.has(k)));
const same = (got, want) => (typeof want === 'function' ? want(got) : want instanceof RegExp ? want.test(String(got)) : JSON.stringify(got) === JSON.stringify(want));
/** The event is on the stream since `from`, with exactly these param keys and these values (a RegExp or a function tests one). */
const find = (event, want, from) => sent.slice(from).find((e) => {
  if (e.event !== event) return false;
  const have = own(e.p);
  if (JSON.stringify(Object.keys(have).sort()) !== JSON.stringify(Object.keys(want).sort())) return false;
  return Object.entries(want).every(([k, v]) => same(have[k], v));
});
/** Do `act`, then require the event (with no `act`, one the page sent as it loaded). Retries the flush for as long as it takes the client to send. */
async function expects(label, event, want, act) {
  doing = label;
  const from = act ? sent.length : base;
  try { await act?.(); } catch (e) { return ok(label, false, 'action failed: ' + String(e.message).slice(0, 140)); }
  let hit;
  for (let i = 0; i < 8 && !hit; i++) { await flush(); hit = find(event, want, from); if (!hit) await page.waitForTimeout(300); }
  if (hit) return ok(`${label}  ${event} ${JSON.stringify(own(hit.p)).slice(0, 110)}`, true);
  const near = sent.slice(from).filter((e) => e.event === event).map((e) => JSON.stringify(own(e.p)));
  ok(label, false, `${event} did not reach the stream with ${JSON.stringify(want, (k, v) => (v instanceof RegExp ? String(v) : typeof v === 'function' ? '[fn]' : v))}; got ${near.length ? near.join(' | ') : 'nothing of that name'}`);
}
/** Do `act`, then require that the event did not come. */
async function silent(label, event, act, test = () => true) {
  const from = sent.length;
  await act();
  await flush();
  await page.waitForTimeout(500);
  await flush();
  const hit = sent.slice(from).filter((e) => e.event === event && test(own(e.p)));
  ok(`${label}  (no ${event})`, hit.length === 0, hit.map((e) => JSON.stringify(own(e.p))).join(' | '));
}
const dataLayer = () => page.evaluate(() => (window.dataLayer || []).map((a) => Array.from(a)).filter((a) => a[0] === 'event'));

/* ---------------------------------------------------------------- home */
if (on('home')) {
// a press on a tab or a segment of the home's plans; the cards of the tab left are still leaving for a moment, so wait them out
const viewBand = async (name) => {
  await page.evaluate((n) => [...document.querySelectorAll('.x-pricing .x-seg button')].find((b) => b.textContent === n).click(), name);
  await page.waitForTimeout(800);
};
await open('/');
await expects('home: the hero is drawn', 'home_viewed', {});
await expects('home: the plans are listed', 'pricing_viewed', { currency: 'USD', item_list_id: 'individual', items: (v) => v.map((i) => i.item_id).join() === PERSONAL && v.every((i) => i.item_category === 'individual' && typeof i.price === 'number') });
await expects('home: a link in the hero', 'cta_clicked', { page: '/', section: 'hero', cta: 'Continue with email', target: '/signup' }, () => tap('.x-hero .x-auth-b.solid'));
await expects('home: a product in the grid', 'cta_clicked', { page: '/', section: 'products', cta: 'Open ↗', target: 'https://hanzo.app/chat' }, () => tap('.xp-card .x-btn.solid', 0));
await expects('hero demo: the sidebar', 'hero_demo', { control: 'sidebar' }, () => tap('.xs-sidet'));
await expects('hero demo: the account menu', 'hero_demo', { control: 'account' }, () => tap('.x-acct-b'));
await expects('hero terminal: Copy', 'home_copied', { block: 'hero', command: 'curl -fsSL https://hanzo.sh | sh' }, () => tap('.x-term-copy'));
await silent('hero: the setup prompt says nothing', 'setup_prompt_copied', () => tap('.x-hero .x-setup-main'));
await silent('hero: its menu says nothing', 'agent_menu_toggled', () => tap('.x-hero .x-setup-chev'));
await expects('install: the curl line', 'home_copied', { block: 'install' }, () => tap('.x-agents .x-panel .x-cmd .x-copy', 0));
await expects('install: the npm line', 'home_copied', { block: 'install', command: 'npm i -g hanzo' }, () => tap('.x-agents .x-panel .x-cmd .x-copy', 1));
await expects('install: the tour', 'home_copied', { block: 'tour', command: /^hanzo dev --/ }, () => tap('.x-agents .x-panel .x-cmd .x-copy', 2));
await expects('setup: Copy setup prompt', 'setup_prompt_copied', { where: 'compatible' }, () => tap('.x-agents .x-setup-main'));
await expects('setup: the agent menu opens', 'agent_menu_toggled', { open: true }, () => tap('.x-agents .x-setup-chev'));
await expects('setup: the agent menu closes', 'agent_menu_toggled', { open: false }, () => tap('.x-agents .x-setup-chev'));
await tap('.x-agents .x-setup-chev');
await expects('setup: an agent is chosen', 'setup_agent_chosen', { agent: /^Open in \S/, target: (v) => typeof v === 'string' && v.length > 0 }, () => tap('.x-agents .x-menu-open'));
await expects('agents: a step is opened', 'agent_step_opened', { step: 2 }, () => tap('.x-agents .x-steps li button', 1));
await expects('agents: the script is shown', 'agent_script_shown', { step: 2 }, () => tap('.x-agents .x-code-t'));
await expects('agents: Copy this step', 'agent_step_copied', { step: 2 }, () => tap('.x-agents .x-panel-f .x-copy', 0));
await expects('agents: Copy the whole script', 'agent_script_copied', { from: 'landing' }, () => tap('.x-agents .x-panel-f .x-copy', 1));
// the plans on the home page
const fromGo = sent.length;
await expects('plans: Go', 'plan_clicked', { plan: 'go', interval: 'month', cta: 'Get Go', item_list_id: 'individual', items: (v) => v[0].item_id === 'go' && v[0].price === 8 }, () => tap('.x-pricing .x-plan .x-btn', 1));
await expects('plans: Go is selected', 'plan_selected', { currency: 'USD', value: 8, items: (v) => v[0].item_id === 'go' });
await expects('plans: Go starts the checkout', 'checkout_started', { currency: 'USD', value: 8, interval: 'month', items: (v) => v[0].item_id === 'go' });
ok('plans: and the link does not also send its own checkout moment', !sent.slice(fromGo).some((e) => e.event === 'checkout_started' && 'link_url' in e.p), '');
ok('plans: nor a cta_clicked', !sent.slice(fromGo).some((e) => e.event === 'cta_clicked' && e.p.target?.includes('plan=go')), '');
await expects('plans: Pro', 'plan_clicked', { plan: 'pro-3x', interval: 'month', cta: 'Get Pro', item_list_id: 'individual', items: (v) => v[0].item_id === 'pro-3x' && v[0].price === 15 }, () => tap('.x-pricing .x-plan .x-btn', 2));
await expects('plans: the usage ladder', 'plan_tier_picked', { plan: 'dev-5x', item_list_id: 'individual' }, () => raise('.x-pricing', 1));
await expects('plans: the Team tab is viewed', 'pricing_viewed', { currency: 'USD', item_list_id: 'team', items: (v) => v.map((i) => i.item_id).join() === 'team,enterprise' }, () => viewBand('Team'));
await expects('plans: the Team term', 'plan_term_changed', { plan: 'team', interval: 'month', item_list_id: 'team' }, () => viewBand('Monthly'));
await expects('plans: Team', 'plan_clicked', { plan: 'team', interval: 'month', cta: 'Get Team', item_list_id: 'team', items: (v) => v[0].item_id === 'team' && v[0].price === 25 }, () => tap('.x-pricing .x-plan .x-btn', 0));
await expects('plans: the API tab is viewed', 'pricing_viewed', { currency: 'USD', item_list_id: 'api', items: (v) => v.map((i) => i.item_id).join() === 'api-payg,api-enterprise' }, () => viewBand('API'));
await expects('plans: Pay as you go', 'plan_clicked', { plan: 'api-payg', interval: 'month', cta: 'Get API Key', item_list_id: 'api', items: (v) => v[0].item_name === 'Pay as you go' && v[0].price === 0 }, () => tap('.x-pricing .x-plan .x-btn', 0));
// links to pages of this site leave the page: each is the last thing done on it
await open('/');
await raise('.x-pricing', 1);
await expects('plans: the Pro card follows the ladder', 'plan_clicked', { plan: 'dev-5x', interval: 'month', cta: 'Get Dev', item_list_id: 'individual', items: (v) => v[0].item_id === 'dev-5x' }, () => tap('.x-pricing .x-plan .x-btn', 2));
await open('/');
await viewBand('Team');
await expects('plans: Enterprise', 'plan_clicked', { plan: 'enterprise', interval: 'year', cta: 'Get Enterprise plan', item_list_id: 'team', items: (v) => v[0].item_id === 'enterprise' }, () => tap('.x-pricing .x-plan .x-btn', 1));
ok('plans: Enterprise is not a checkout', !sent.slice(base).some((e) => e.event === 'plan_selected' && e.p.items?.[0]?.item_id === 'enterprise'), '');
await open('/');
await viewBand('API');
await expects('plans: Volume & Dedicated', 'plan_clicked', { plan: 'api-enterprise', interval: 'month', cta: 'Contact API Sales', item_list_id: 'api', items: (v) => v[0].item_name === 'Volume & Dedicated' }, () => tap('.x-pricing .x-plan .x-btn', 1));
await open('/');
await expects('home: a link in a band', 'cta_clicked', { page: '/', section: 'plans', cta: 'Every plan, model rate and tool price', target: '/pricing' }, () => tap('.x-pricing .x-row-links a'));
await open('/');
await expects('home: the beta ribbon', 'cta_clicked', { page: '/', section: 'beta', cta: /Apply for Beta/, target: '/beta' }, () => tap('a.x-ann'));
await open('/');
await expects('hero demo: Download App', 'hero_demo', { control: 'phone-download' }, () => tap('.x-phone-dl'));
}

/* ---------------------------------------------------------------- $view bands */
if (on('bands')) {
// `$view` names its band in `$section` (the band's data-hz-view). It is sent once per page view, the first time half of the
// band, or what is in view of it covering half the screen, is on screen: so each band is scrolled to, on a page of its own.
async function seen(p, ids) {
  await open(p);
  for (const id of ids) {
    const there = await page.evaluate((name) => {
      const el = document.querySelector(`[data-hz-view="${name}"]`);
      if (!el) return false;
      const r = el.getBoundingClientRect();
      scrollTo({ top: r.height > innerHeight ? r.top + scrollY - 80 : r.top + scrollY - (innerHeight - r.height) / 2, behavior: 'instant' });
      return true;
    }, id);
    if (!there) { ok(`${p}: ${id} is a band`, false, 'not marked'); continue; }
    await page.mouse.wheel(0, 20);
    let hit;
    for (let i = 0; i < 10 && !hit; i++) { await page.waitForTimeout(400); await flush(); hit = sent.slice(base).find((e) => e.event === '$view' && e.p.$section === id); }
    ok(`${p}: ${id} is a band, and $view counts it`, Boolean(hit), 'no $view');
  }
}
await seen('/', ['models', 'products', 'compatible', 'works-with', 'faster', 'cheaper', 'pareto', 'open-source', 'plans', 'trusted']);
await seen('/dev/', ['race']);
await seen('/investors/', ['research', 'trusted']);
}

/* ---------------------------------------------------------------- pricing */
if (on('pricing')) {
await open('/pricing/');
await expects('pricing: Personal is viewed', 'pricing_viewed', { currency: 'USD', item_list_id: 'individual', items: (v) => v.map((i) => i.item_id).join() === PERSONAL });
await expects('pricing: Free', 'plan_clicked', { plan: 'free', interval: 'month', cta: 'Try Hanzo', item_list_id: 'individual', items: (v) => v[0].price === 0 }, () => tap('.xpr-card[data-id="free"] .xpr-cta'));
await silent('pricing: Free is not a checkout', 'plan_selected', () => Promise.resolve(), (p) => p.items?.[0]?.item_id === 'free');
const fromGoCard = sent.length;
await expects('pricing: Go', 'plan_clicked', { plan: 'go', interval: 'month', cta: 'Get Go', item_list_id: 'individual', items: (v) => v[0].item_id === 'go' && v[0].price === 8 }, () => tap('.xpr-card[data-id="go"] .xpr-cta'));
await expects('pricing: Go is selected', 'plan_selected', { currency: 'USD', value: 8, items: (v) => v[0].item_id === 'go' });
await expects('pricing: Go starts the checkout', 'checkout_started', { currency: 'USD', value: 8, interval: 'month', items: (v) => v[0].item_id === 'go' });
ok('pricing: and the link does not also send its own checkout moment', !sent.slice(fromGoCard).some((e) => e.event === 'checkout_started' && 'link_url' in e.p), '');
await expects('pricing: the usage ladder', 'plan_tier_picked', { plan: 'max-15x', item_list_id: 'individual' }, () => raise('.xpr-card[data-id="pro"]', 2));
await expects('pricing: the Pro card follows the ladder', 'plan_clicked', { plan: 'max-15x', interval: 'month', cta: 'Get Max', item_list_id: 'individual', items: (v) => v[0].item_id === 'max-15x' && v[0].price === 95 }, () => tap('.xpr-card[data-id="pro"] .xpr-cta'));
await expects('pricing: the Team tab is viewed', 'pricing_viewed', { currency: 'USD', item_list_id: 'team', items: (v) => v.map((i) => i.item_id).join() === 'team,enterprise' }, () => page.evaluate(() => [...document.querySelectorAll('[role="tablist"] [role="tab"]')].find((b) => b.textContent.trim() === 'Team').click()));
await expects('pricing: Team, by the year', 'plan_clicked', { plan: 'team', interval: 'year', cta: 'Get Team', item_list_id: 'team', items: (v) => v[0].item_id === 'team' && v[0].price === 240 }, () => tap('.xpr-card[data-id="team"] .xpr-cta'));
await expects('pricing: Team is selected', 'plan_selected', { currency: 'USD', value: 240, items: (v) => v[0].item_id === 'team' });
await expects('pricing: the Team term', 'plan_term_changed', { plan: 'team', interval: 'month', item_list_id: 'team' }, () => page.evaluate(() => [...document.querySelectorAll('.xpr-seg button')].find((b) => b.textContent === 'Monthly').click()));
await expects('pricing: Enterprise', 'plan_clicked', { plan: 'enterprise', interval: 'month', cta: 'Get Enterprise plan', item_list_id: 'team', items: (v) => v[0].item_id === 'enterprise' }, () => tap('.xpr-card[data-id="ent"] .xpr-cta', 0));
await open('/pricing/#team');
await expects('pricing: the buying specialist', 'plan_clicked', { plan: 'enterprise', cta: 'Chat with buying specialist', item_list_id: 'team' }, () => tap('.xpr-card[data-id="ent"] .xpr-cta', 1));
await open('/pricing/#api');
await expects('pricing: the API tab is viewed', 'pricing_viewed', { currency: 'USD', item_list_id: 'api', items: (v) => v.map((i) => i.item_id).join() === 'api-payg,api-enterprise' });
await expects('pricing: Pay as you go', 'plan_clicked', { plan: 'api-payg', interval: 'month', cta: 'Get API Key', item_list_id: 'api', items: (v) => v[0].item_name === 'Pay as you go' }, () => tap('.xpr-card[data-id="payg"] .xpr-cta'));
await open('/pricing/#api');
await expects('pricing: Volume & Dedicated', 'plan_clicked', { plan: 'api-enterprise', interval: 'month', cta: 'Contact API Sales', item_list_id: 'api', items: (v) => v[0].item_name === 'Volume & Dedicated' }, () => tap('.xpr-card[data-id="vol"] .xpr-cta'));
await open('/pricing/#team');
await expects('pricing: the tab the address names is the one viewed', 'pricing_viewed', { currency: 'USD', item_list_id: 'team', items: (v) => v.length === 2 });
ok('pricing: and Personal is not counted on the way', !sent.slice(base).some((e) => e.event === 'pricing_viewed' && e.p.item_list_id === 'individual'), '');
}

/* ---------------------------------------------------------------- sales */
if (on('sales')) {
const SALES = async (fill) => {
  await open('/contact-sales/');
  await type('#xcs-name', 'Ada Lovelace'); await page.keyboard.press('Enter');
  await page.waitForTimeout(450);
  await type('#xcs-email', 'ada@example.com'); await page.keyboard.press('Enter');
  await page.waitForTimeout(450);
  await type('#xcs-company', 'Analytical Engines'); await page.keyboard.press('Enter');
  await page.waitForTimeout(450);
  await page.locator('.xcs-size', { hasText: '50–249' }).first().click();
  await page.waitForTimeout(900);
  if (fill) await fill();
};
state.lead = 'filed';
await SALES();
{
  const from = sent.length;
  const before = (await dataLayer()).length;
  await page.locator('.xcs-form button[type="submit"]').first().click();
  await page.waitForTimeout(1500);
  await flush();
  const lead = posts.filter((p) => p.path === '/v1/marketing/leads').at(-1)?.body;
  ok('sales: the lead is filed with the visit as cloud reads it', Boolean(lead) && typeof lead.visit?.tags === 'string' && typeof lead.visit?.consent === 'string' && !lead.visit.consent.startsWith('{') && lead.visit.url === HOST + '/contact-sales/', JSON.stringify(lead?.visit));
  const dl = (await dataLayer()).slice(before);
  const mirrored = dl.find((a) => a[2]?.lead_id === 'lead_0123456789abcdef01234567');
  ok('sales: sales_contacted is mirrored to the tags under the lead id', Boolean(mirrored) && mirrored[2].event_id === 'lead_0123456789abcdef01234567' && mirrored[2].lead_source === 'contact-sales' && mirrored[2].company_size === '50-249', JSON.stringify(dl.map((a) => a.slice(0, 2))));
  ok('sales: and our stream is not told twice  (no sales_contacted)', !sent.slice(from).some((e) => e.event === 'sales_contacted'), '');
}
state.lead = 'down';
await SALES();
await expects('sales: a lead that could not be filed still counts', 'sales_contacted', { lead_source: 'contact-sales', company_size: '50-249' }, () => page.locator('.xcs-form button[type="submit"]').first().click());
state.lead = 'filed';
await SALES(() => page.evaluate(() => { const t = document.querySelector('.xcs-trap input'); const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set; set.call(t, 'spam'); t.dispatchEvent(new Event('input', { bubbles: true })); }));
await expects('sales: the honeypot is counted', 'sales_trapped', { lead_source: 'contact-sales' }, () => page.locator('.xcs-form button[type="submit"]').first().click());
}

/* ---------------------------------------------------------------- enterprise, learn, search */
if (on('search')) {
await open('/enterprise/');
await expects('enterprise: the hero call', 'enterprise_cta', { at: 'hero', to: 'start' }, () => tap('[data-cta="enterprise.hero"]'));
await expects('enterprise: build on Platform', 'enterprise_cta', { at: 'hero', to: 'platform' }, () => tap('[data-cta="enterprise.platform"]'));
await expects('enterprise: a question is opened', 'faq_opened', { q: 'How is our data used?', page: 'enterprise' }, () => page.getByRole('button', { name: 'How is our data used?' }).evaluate((b) => b.click()));
await expects('enterprise: the closing call', 'enterprise_cta', { at: 'end' }, () => tap('.x-band-note a[href="/contact-sales/"], .x-band-note a[href="/contact-sales"]'));
await open('/learn/');
await expects('learn: a question is opened', 'faq_opened', { q: (v) => typeof v === 'string' && v.length > 8 }, () => tap('.x-faq li button', 1));
await open('/models/');
await expects('models: a search', 'search_performed', { search_string: 'claude', from: 'models' }, async () => { await type('.xmo-find input', 'cl'); await page.waitForTimeout(100); await type('.xmo-find input', 'claude'); await page.waitForTimeout(1500); });
await open('/');
await expects('palette: a question asked', 'search_performed', { search_string: 'what does Kai do', from: 'palette' }, async () => {
  await page.keyboard.press('Control+K');
  await page.waitForTimeout(400);
  await type('.x-pal input', 'what does Kai do');
  await page.locator('.x-pal-ask').click();
});
}

/* ---------------------------------------------------------------- forms */
if (on('forms')) {
state.lead = 'filed';
await open('/careers/compiler-engineer/');
await expects('careers: an application', 'career_application_submitted', { role: 'Compiler Engineer', department: 'Engineering', slug: 'compiler-engineer' }, async () => {
  for (const step of [0, 1, 2]) {
    await page.evaluate((k) => {
      const set = (el, v) => { const proto = el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype; Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, v); el.dispatchEvent(new Event('input', { bubbles: true })); };
      document.querySelectorAll(`[data-step="${k}"] input:not([type="file"]):not([type="checkbox"]), [data-step="${k}"] textarea`).forEach((el) => set(el, el.type === 'email' ? 'ada@example.com' : el.type === 'url' ? 'https://example.com' : 'Ada'));
    }, step);
  }
  // three steps: each submit moves on, the last hands the application to the visitor's mail (which this browser lets go)
  for (let k = 0; k < 3; k++) { await page.evaluate(() => document.querySelector('form.xcj-form').requestSubmit()); await page.waitForTimeout(700); }
});
await open('/careers/compiler-engineer/');
await silent('careers: nothing is counted before the application is sent', 'career_application_submitted', () => Promise.resolve());
await open('/grants/#apply');
await expects('grants: an application', 'grant_application_submitted', { track: 'oss', role: 'Open Source Contributor Credit Grant' }, async () => {
  await type('#apply input[name="name"]', 'Ada Lovelace'); await type('#apply input[name="email"]', 'ada@example.com'); await type('#apply textarea[name="summary"]', 'Notes on the engine');
  await page.locator('#apply button[type="submit"]').first().click();
});
state.lead = 'down';
await open('/grants/#apply');
await expects('grants: an application that did not reach us says why', 'grant_application_submitted', { track: 'oss', role: 'Open Source Contributor Credit Grant', error: /HTTP 503/ }, async () => {
  await type('#apply input[name="name"]', 'Ada Lovelace'); await type('#apply input[name="email"]', 'ada@example.com'); await type('#apply textarea[name="summary"]', 'Notes on the engine');
  await page.locator('#apply button[type="submit"]').first().click();
});
state.lead = 'filed';
await open('/founder/');
await expects('founder: a claim', 'founder_claimed', { from: 'founder' }, async () => {
  await type('#claim input[name="email"]', 'ada@example.com'); await type('#claim input[name="github"]', 'ada'); await type('#claim input[name="pull"]', 'https://github.com/hanzoai/site/pull/1');
  await page.locator('#claim button[type="submit"]').first().click();
});
await open('/newsletter/');
await expects('newsletter: subscribed', 'newsletter_submitted', { source: 'hanzo.ai/newsletter' }, async () => {
  await type('#newsletter-email', 'ada@example.com'); await page.keyboard.press('Enter'); await page.waitForTimeout(600);
  await page.locator('[data-cta="newsletter.send"]').click();
});
await expects('newsletter: and counted once the mail is out', 'newsletter_subscribed', { source: 'hanzo.ai/newsletter' });
state.news = 'refused';
await open('/newsletter/');
await expects('newsletter: refused', 'newsletter_refused', { source: 'hanzo.ai/newsletter', status: 429 }, async () => {
  await type('#newsletter-email', 'ada@example.com'); await page.keyboard.press('Enter'); await page.waitForTimeout(600);
  await page.locator('[data-cta="newsletter.send"]').click();
});
state.news = 'pending';
}

/* ---------------------------------------------------------------- beta */
if (on('beta')) {
await open('/beta/');
await expects('beta: the landing is viewed', 'beta_viewed', { initial_program: 'none', resumed: false });
await expects('beta: a pass is chosen', 'beta_track_selected', { program: 'research', program_name: 'Research access', from_key: false }, () => tap('.xbt-hit', 1));
await open('/beta/');
await expects('beta: Feedback', 'beta_feedback_opened', { from: 'home', program: 'none' }, () => tap('.xbt-foot a.xbt-big'));
await expects('beta: Book a call', 'beta_call_booked', { from: 'landing' }, () => tap('.xbt-foot a[href="https://cal.com/hanzo"]'));
await page.evaluate(() => localStorage.clear());
await open('/beta/apply/');
await expects('apply: the application is viewed', 'beta_viewed', { initial_program: 'beta', resumed: false });
await expects('apply: the first question is viewed', 'beta_step_viewed', { program: 'beta', step: 1, total_steps: 8, question_id: 'builds' });
await expects('apply: an option is picked', 'beta_option_picked', { program: 'beta', question_id: 'builds', option: 'Web apps' }, () => tap('.xba-opt', 0));
{
  // answer until the application can be sent, then to the last question
  const answer = async () => {
    for (let guard = 0; guard < 14; guard++) {
      if (await page.locator('.xba-gate').count()) return;
      const opt = page.locator('.xba-opt');
      const field = page.locator('#beta-answer');
      const many = (await opt.count()) && (await opt.first().getAttribute('role')) === 'checkbox';
      if (await opt.count()) { if (!(many && (await opt.first().getAttribute('aria-checked')) === 'true')) await opt.first().evaluate((b) => b.click()); }
      else if (await field.count()) await field.first().fill('Ada');
      await page.waitForTimeout(450);
      const next = page.locator('button.x-btn:has-text("Continue"), button.x-btn:has-text("Submit application"), .xba-acts button:has-text("Continue"), .xba-acts button:has-text("Submit")').first();
      if (await next.count()) await next.evaluate((b) => b.click());
      await page.waitForTimeout(700);
    }
  };
  await expects('apply: Open App, once enough is answered', 'beta_continue_with_plan', { program: 'beta', step: (v) => v >= 3, total_steps: 8 }, async () => {
    for (let guard = 0; guard < 10 && !(await page.locator('.xba-app').count()); guard++) {
      const opt = page.locator('.xba-opt');
      if (await opt.count()) await opt.first().evaluate((b) => b.click()); else await page.locator('#beta-answer').first().fill('Ada');
      await page.waitForTimeout(450);
      const next = page.locator('.xba-acts-r button').first();
      if (await next.count()) await next.evaluate((b) => b.click());
      await page.waitForTimeout(700);
    }
    await tap('.xba-app');
  });
  await open('/beta/apply/');
  await page.evaluate(() => localStorage.clear());
  await open('/beta/apply/');
  await expects('apply: the application is sent', 'beta_step_completed', { program: 'beta', step: 8, total_steps: 8, question_id: 'role', answer: 'Ada' }, answer);
  await expects('apply: and submitted', 'beta_submitted', { program: 'beta' });
  // beta_submitted reaches the tags as a lead (the table of @hanzo/events names it); beta_applied is mirrored only, and the
  // table names it on no platform yet, as for the app: so it is never on our stream, and no tag hears it
  ok('apply: beta_submitted is a lead to the tags', (await dataLayer()).some((a) => a[1] === 'generate_lead' && a[2]?.program === 'beta'), JSON.stringify((await dataLayer()).map((a) => a.slice(0, 2))));
  ok('apply: and beta_applied is never on our stream  (no beta_applied)', !sent.some((e) => e.event === 'beta_applied'), '');
  await expects('apply: the gate, Create free account', 'beta_gate_signup_clicked', { program: 'beta' }, () => tap('.xba-gate-a a', 0));
  await expects('apply: the gate, Sign in', 'beta_gate_login_clicked', { program: 'beta' }, () => tap('.xba-gate-a a', 1));
}
}

await browser.close();
const failed = results.filter((r) => !r.pass);
console.log(`\n${results.length - failed.length} of ${results.length} hold; ${failed.length} do not.`);
if (failed.length) { for (const f of failed) console.log('  FAIL ' + f.label + '  ' + f.why); process.exit(1); }
