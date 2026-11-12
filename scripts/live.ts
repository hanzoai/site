// Two jobs, both reading hanzo.ai as it is today.
// 1. No arguments: refresh every figure the site shows from the same sources hanzo.ai itself reads, over plain HTTPS
//    (no browser), each into content/live/_<name>.json with `source` and `fetched_at`:
//      _git.json       api.hanzo.ai/v1/git/activity (the commit calendar)
//      _oss.json       the open-source tiles, the calendar and the repository cards: api.hanzo.ai/v1/git/activity (the
//                      year, the days, the months) and GitHub (stars, forks, languages, contributors), lib/oss.mjs. The
//                      same read also writes components/pages/openSource/snapshot.ts (/open-source).
//      _github.json    the GitHub half of that read, kept apart: refreshed when GITHUB_TOKEN is set, otherwise the build
//                      keeps it (a push reuses its contributors, sites and org descriptions, like hanzo-inc/app)
//      _research.json  api.hanzo.ai/v1/research/runs (coding.repair, decision.latency, enso.gpqa_diamond), summary view
//      _models.json    api.hanzo.ai/v1/models and /v1/pricing/models (per-million prices and model names)
//      _pricing.json   api.hanzo.ai/v1/billing/plans (plan prices)
//    It FAILS LOUDLY: if any source fails, is rate-limited or returns something unexpected, it names that source, keeps
//    the last good file (never a half-written one) and exits 1, so `npm run build` (prebuild) stops instead of
//    shipping stale figures. To build from the snapshots on purpose (no network, a known-good run), set
//    HZ_LIVE_OFFLINE=1: no source is read and the run exits 0. In the cloud sandbox Node's fetch needs
//    NODE_USE_ENV_PROXY=1 NODE_EXTRA_CA_CERTS=/root/.ccr/ca-bundle.crt.
// 2. --pages [/path ...]: render hanzo.ai pages in headless Chrome and keep what a visitor sees (content/live/<path>.json
//    { text, links }, parity.py's reference). A browser job: not on James's laptop unless he asks (docs/build-notes/MASTER.md section 5).
import { RUNS, MODELS, PRICES, PLANS_URL, shapePlan, readResearch, readModels } from '../lib/liveSources.ts';
import { estate, github, combine } from '../lib/oss.ts';
import { shape } from '../components/pages/openSource/shape.ts';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'content', 'live');
const args = process.argv.slice(2);
if (args.length) await pages(args.filter((a) => a !== '--pages'));
else await figures();

async function figures() {
  if (process.env.HZ_LIVE_OFFLINE === '1') {
    console.log('HZ_LIVE_OFFLINE=1: no source read; every content/live/_*.json snapshot is kept as it is.');
    return;
  }
  const fetched_at = new Date().toISOString();
  const failed = [];
  const res = async (url, headers = {}) => {
    const r = await fetch(url, { headers: { 'user-agent': 'hanzo-site-live', ...headers }, signal: AbortSignal.timeout(30000) });
    if (!r.ok) throw Object.assign(new Error(`${r.status} from ${url}${r.headers.get('x-ratelimit-remaining') === '0' ? ' (rate limited)' : ''}`), { status: r.status });
    return r;
  };
  const get = async (url, headers = {}) => (await res(url, headers)).json();
  const text = async (url) => (await res(url)).text();
  const int = (n) => Number.isInteger(n) && n >= 0;
  const need = (ok, what) => { if (!ok) throw new Error('unexpected data: ' + what); };
  const n = (x) => x.toLocaleString('en-US');

  // Commits a day, the year's commits and merges, this week, organizations: what hanzo.ai's own calendar and tiles read.
  const GIT = 'https://api.hanzo.ai/v1/git/activity';
  const git = async () => {
    const a = await get(GIT);
    need(a.complete === true, 'activity marked incomplete');
    const days = [];
    for (let t = Date.parse(a.window.from + 'T00:00:00Z'), end = Date.parse(a.window.to + 'T00:00:00Z'); t <= end; t += 864e5) {
      const d = new Date(t).toISOString().slice(0, 10);
      need(int(a.daily[d]) && int(a.active[d]), 'day ' + d);
      days.push([d, a.daily[d], a.active[d]]);
    }
    need(days.length === 365 || days.length === 366, days.length + ' days');
    const { commits, merges, orgs: o } = a.totals;
    need([commits, merges, o].every(int) && commits > 0 && o > 0, 'totals');
    return { source: GIT, fetched_at, read: a.read, window: a.window, commits, merges, orgs: o, week: days.slice(-7).reduce((s, x) => s + x[1], 0), days };
  };

  // The plan prices and entitlements on the home page, /pricing, /bot and /enterprise, in USD (commerce.hanzo.ai gives cents):
  // the plans the site names, every personal plan commerce lists (the usage slider's rungs above Ultra, Ultimate and
  // Unlimited, stand on the page only while listed: lib/plans.ts), and every agency and white-label plan (/enterprise's
  // Partners band lists them as the catalog does).
  const PLANS = PLANS_URL;
  const SHOWN = ['free', 'go', 'pro-3x', 'dev-5x', 'max-15x', 'ultra', 'team', 'team-premium', 'enterprise', 'enterprise-300'];
  const pricing = async () => {
    const list = await get(PLANS);
    need(Array.isArray(list), 'plan list');
    for (const slug of SHOWN) need(list.some((x) => x.slug === slug), 'plan ' + slug);
    const plans = {};
    for (const p of list.filter((x) => SHOWN.includes(x.slug) || ['personal', 'agency', 'white-label'].includes(x.category))) {
      need(int(p.price) && (p.priceAnnual == null || int(p.priceAnnual)), 'plan ' + p.slug);
      plans[p.slug] = shapePlan(p);
    }
    need(plans['white-label'] && Object.values(plans).some((p) => p.category === 'agency'), 'the white-label and agency plans');
    return { source: PLANS, fetched_at, currency: 'usd', plans };
  };

  // The open-source figures the home and /open-source show (lib/oss.mjs): the estate from the API, which must answer whole,
  // and GitHub's half from GitHub when there is a token, else from the last read the build holds. A GitHub that does not
  // answer leaves stars and forks a day older; it never stops a build, the estate not answering does.
  const oss = async () => {
    const index = await estate();
    const file = path.join(OUT, '_github.json');
    let kept = null;
    try { kept = JSON.parse(fs.readFileSync(file, 'utf8')); } catch { /* the first read */ }
    let gh = kept;
    if (process.env.GITHUB_TOKEN) {
      try {
        gh = { ...(await github({ index, token: process.env.GITHUB_TOKEN, kept, thrifty: process.env.GITHUB_EVENT_NAME === 'push' })), fetched_at };
        fs.writeFileSync(file + '.tmp', JSON.stringify(gh) + '\n');
        fs.renameSync(file + '.tmp', file);
        console.log(`_github.json  live  ${n(Object.values(gh.groups).reduce((s, g) => s + g.stars, 0))} stars`);
      } catch (e) { console.log(`_github.json  kept snapshot from ${kept?.fetched_at}: ${e.message}`); }
    } else console.log(`_github.json  kept snapshot from ${kept?.fetched_at}: no GITHUB_TOKEN`);
    need(gh, 'no GitHub read and no GITHUB_TOKEN to make one');
    const { sum, act } = combine(index, gh);
    const e = sum.estate;
    // commits a day (every group added up) and repositories active that day, as hanzo.ai's calendar draws them
    const all = Object.values(act.groups);
    const days = [];
    for (let t = Date.parse(act.from + 'T00:00:00Z'), end = Date.parse(act.to + 'T00:00:00Z'); t <= end; t += 864e5) {
      const d = new Date(t).toISOString().slice(0, 10);
      days.push([d, all.reduce((a, g) => a + (g.daily?.[d] ?? 0), 0), all.reduce((a, g) => a + (g.active?.[d] ?? 0), 0)]);
    }
    need(days.length >= 365 && days.every(([, c, r]) => int(c) && int(r)), 'calendar days');
    need([e.commits, e.merges, e.orgs, e.public].every(int) && Array.isArray(e.monthly) && Array.isArray(e.mergeMonths) && e.mergeMonths.every(int) && e.window?.to, 'estate');
    const groups = Object.fromEntries(Object.entries(sum.groups).map(([k, g]) => {
      need([g.stars, g.forks, g.repos].every(int), 'group ' + k);
      return [k, { name: g.name, repos: g.repos, public: g.public, stars: g.stars, forks: g.forks, top: g.top.map((r) => ({ repo: r.repo, description: r.description ?? '', language: r.language ?? '', stars: r.stars, forks: r.forks, commits: r.commits, months: r.months, contributors: r.contributors, faces: r.faces ?? [], pushed: r.pushed, forge: r.forge ?? 'https://github.com/' + r.repo, site: r.site ?? null })) }];
    }));
    need((groups.hanzo?.top || []).length > 0, 'repository cards');
    const s = shape({ sum, act });
    fs.writeFileSync(path.join(ROOT, 'components/pages/openSource/snapshot.ts'), `/* /open-source figures: api.hanzo.ai/v1/git/activity and GitHub (read ${s.read}). Written by scripts/live.ts; do not edit by hand. */\nconst S = ${JSON.stringify(s)};\nexport default S;\n`);
    return { source: sum.source + ' and https://api.github.com/orgs', github: gh.fetched_at, fetched_at, read: sum.read, estate: { window: e.window, months: e.months, orgs: e.orgs, repos: e.repos, public: e.public, commits: e.commits, merges: e.merges, monthly: e.monthly, mergeMonths: e.mergeMonths }, calendar: { from: act.from, to: act.to, days, week: days.slice(-7).reduce((a, x) => a + x[1], 0) }, forge: sum.forge, groups };
  };

  // the coding race, Kai's speed and Enso's cost, and the per-million prices and model names: the same sources hanzo.ai's
  // home fetches when it opens (lib/liveSources.mjs, which the home page also reads at load)
  const research = async () => ({ source: RUNS + '&benchmark={coding.repair,decision.latency,enso.gpqa_diamond}&view=summary&limit=200', fetched_at, ...(await readResearch(get)) });
  const models = async () => ({ source: MODELS + ' and ' + PRICES, fetched_at, ...(await readModels(get)) });

  const run = async (name, job, say) => {
    const file = path.join(OUT, name);
    try {
      const data = await job();
      fs.writeFileSync(file + '.tmp', JSON.stringify(data) + '\n');
      fs.renameSync(file + '.tmp', file); // whole file or nothing: a half-written snapshot would break the build
      console.log(`${name.padEnd(15)}live  ${say(data)}`);
    } catch (e) {
      let was = null;
      try { was = JSON.parse(fs.readFileSync(file, 'utf8')).fetched_at; } catch {}
      console.log(`${name.padEnd(15)}${was ? 'kept snapshot from ' + was : 'NO DATA AND NO SNAPSHOT'}: ${e.message}`);
      failed.push(`${name}: ${e.message}`);
    }
  };
  await run('_git.json', git, (d) => `${n(d.commits)} commits · ${n(d.merges)} merges · ${n(d.week)} in 7 days · ${d.orgs} orgs · ${d.days.length} days ${d.window.from}…${d.window.to}`);
  await Promise.all([
    run('_pricing.json', pricing, (d) => Object.entries(d.plans).map(([k, p]) => `${k} $${p.price}${p.priceAnnual != null ? '/$' + p.priceAnnual : ''}`).join(' · ')),
    run('_oss.json', oss, (d) => `${n(d.estate.commits)} commits · ${n(d.estate.merges)} merges · ${n(Object.values(d.groups).reduce((s, g) => s + g.stars, 0))} stars · ${d.groups.hanzo.top.length} cards · read ${d.read}`),
    run('_research.json', research, (d) => `${d.repair.length} coding.repair · ${d.latency.length} decision.latency · ${d.gpqa.length} enso.gpqa_diamond runs`),
    run('_models.json', models, (d) => `${d.models.length} models · ${Object.keys(d.names).length} names`),
  ]);
  if (failed.length) {
    console.error(`\nLIVE FIGURES FAILED (${failed.length}): the build stops rather than ship stale figures.\n  ${failed.join('\n  ')}\nFix the source, or set HZ_LIVE_OFFLINE=1 to build from the snapshots on purpose.`);
    process.exit(1);
  }
}

async function pages(paths) {
  const { default: puppeteer } = await import('puppeteer-core');
  const { lock } = await import('./lock.ts');
  await lock();
  const idx = JSON.parse(fs.readFileSync(path.join(ROOT, 'content', 'pages.json'), 'utf8'));
  if (!paths.length) paths = Object.keys(idx).sort((a, b) => a.split('/').length - b.split('/').length || a.localeCompare(b));
  paths = paths.filter((p) => !fs.existsSync(path.join(OUT, (p.slice(1) || 'index') + '.json')) || process.env.FORCE);

  const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true, args: ['--no-first-run', '--mute-audio'] });
  const read = async (p) => {
    const page = await browser.newPage();
    await page.setViewport({ width: 1470, height: 900 });
    try {
      await page.goto('https://hanzo.ai' + p, { waitUntil: 'networkidle2', timeout: 45000 });
      await new Promise((r) => setTimeout(r, 1200));
      const data = await page.evaluate(async () => {
        const main = document.querySelector('main') || document.body;
        const seen = new Set();
        const text = [];
        const grab = () => main.querySelectorAll('*').forEach((el) => {
          if (/^(SCRIPT|STYLE|NOSCRIPT|TEMPLATE)$/.test(el.tagName)) return;
          // each text node on its own, so a sentence with a link in it is read as its two halves
          for (const c of el.childNodes) {
            if (c.nodeType !== 3) continue;
            const own = c.textContent.replace(/\s+/g, ' ').trim();
            if (own.length > 1 && !seen.has(own)) { seen.add(own); text.push(own); }
          }
        });
        grab();
        // open what is hidden behind a click: tabs and accordions, then read again
        for (const b of [...main.querySelectorAll('[role=tab], summary, button[aria-expanded="false"]')].slice(0, 60)) {
          try { b.click(); await new Promise((r) => setTimeout(r, 120)); grab(); } catch {}
        }
        const links = [...new Set([...main.querySelectorAll('a[href]')].map((a) => a.getAttribute('href')))];
        return { text, links };
      });
      fs.mkdirSync(path.dirname(path.join(OUT, (p.slice(1) || 'index') + '.json')), { recursive: true });
      fs.writeFileSync(path.join(OUT, (p.slice(1) || 'index') + '.json'), JSON.stringify(data));
      return true;
    } catch (e) {
      console.log('FAIL', p, e.message.slice(0, 80));
      return false;
    } finally {
      await page.close();
    }
  };
  let ok = 0;
  for (let i = 0; i < paths.length; i += 3) ok += (await Promise.all(paths.slice(i, i + 3).map(read))).filter(Boolean).length;
  await browser.close();
  console.log('live pages read', ok, 'of', paths.length);
}
