// Two jobs, both reading hanzo.ai as it is today.
// 1. No arguments: refresh the figures the site shows from Hanzo's own public sources, over plain HTTPS (no browser).
//    Each source writes content/live/_<name>.json with `source` and `fetched_at`; a source that fails, is rate-limited
//    or returns something unexpected keeps its last good file, and the run still exits 0 so a build never fails here.
//    npm run build runs it first (prebuild). GITHUB_TOKEN, when set, lets it read GitHub (120 orgs > 60 requests an hour).
// 2. --pages [/path ...]: render hanzo.ai pages in headless Chrome and keep what a visitor sees (content/live/<path>.json
//    { text, links }, parity.py's reference). A browser job: not on James's laptop unless he asks (docs/DESIGN.md).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'content', 'live');
const args = process.argv.slice(2);
if (args.length) await pages(args.filter((a) => a !== '--pages'));
else await figures();

async function figures() {
  const fetched_at = new Date().toISOString();
  const get = async (url, headers = {}) => {
    const r = await fetch(url, { headers: { 'user-agent': 'hanzo-site-live', ...headers }, signal: AbortSignal.timeout(30000) });
    if (!r.ok) throw Object.assign(new Error(`${r.status} from ${url}${r.headers.get('x-ratelimit-remaining') === '0' ? ' (rate limited)' : ''}`), { status: r.status });
    return r.json();
  };
  const int = (n) => Number.isInteger(n) && n >= 0;
  const need = (ok, what) => { if (!ok) throw new Error('unexpected data: ' + what); };
  const n = (x) => x.toLocaleString('en-US');

  // Commits a day, the year's commits and merges, this week, organizations: what hanzo.ai's own calendar and tiles read.
  const GIT = 'https://api.hanzo.ai/v1/git/activity';
  let orgs = null;
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
    orgs = a.orgs.filter((x) => x.github).map((x) => ({ login: x.github.split('/').pop(), group: x.group }));
    need(orgs.length > 0, 'no GitHub organizations');
    return { source: GIT, fetched_at, read: a.read, window: a.window, commits, merges, orgs: o, week: days.slice(-7).reduce((s, x) => s + x[1], 0), days };
  };

  // Original public repositories as GitHub counts them: non-fork repos of every org hanzo.ai lists (7 Nov: 2,248 against
  // Hanzo's 2,247 of 6 Nov). Stars and forks are not read here: no GitHub count reproduces Hanzo's (6,041 and 4,579).
  const github = async () => {
    if (!orgs) throw new Error('needs the organization list from ' + GIT + ', which failed');
    if (!process.env.GITHUB_TOKEN) throw new Error(`needs GITHUB_TOKEN: ${orgs.length} organizations take ${orgs.length}+ requests and GitHub allows 60 an hour without one`);
    const H = { authorization: 'Bearer ' + process.env.GITHUB_TOKEN, accept: 'application/vnd.github+json' };
    const groups = {};
    const one = async ({ login, group }) => {
      for (let page = 1; ; page++) {
        let list;
        try { list = await get(`https://api.github.com/orgs/${encodeURIComponent(login)}/repos?type=public&per_page=100&page=${page}`, H); }
        catch (e) { if (page === 1 && e.status === 404) return; throw e; } // an org gone from GitHub is not checked, so not counted
        need(Array.isArray(list), login + ' repos');
        const g = (groups[group] ??= { orgs: 0, repos: 0 });
        if (page === 1) g.orgs++;
        g.repos += list.filter((r) => r.fork === false).length;
        if (list.length < 100) return;
      }
    };
    const queue = [...orgs];
    await Promise.all(Array.from({ length: 8 }, async () => { while (queue.length) await one(queue.shift()); }));
    const sum = (k) => Object.values(groups).reduce((s, g) => s + g[k], 0);
    need(sum('repos') > 0, 'no repositories');
    return { source: 'https://api.github.com/orgs/{org}/repos', fetched_at, orgs: sum('orgs'), repos: sum('repos'), groups };
  };

  // The plan prices on the home page and /pricing, in USD (the API gives cents).
  const PLANS = 'https://api.hanzo.ai/v1/billing/plans';
  const SHOWN = ['free', 'go', 'pro-2x', 'dev-5x', 'max-10x', 'ultra', 'team', 'team-premium', 'enterprise'];
  const pricing = async () => {
    const list = await get(PLANS);
    const plans = {};
    for (const slug of SHOWN) {
      const p = list.find?.((x) => x.slug === slug);
      need(p && int(p.price) && (p.priceAnnual == null || int(p.priceAnnual)), 'plan ' + slug);
      plans[slug] = { name: p.name, price: p.price / 100, priceAnnual: p.priceAnnual == null ? null : p.priceAnnual / 100, interval: p.interval, perSeat: !!p.perSeat };
    }
    return { source: PLANS, fetched_at, currency: 'usd', plans };
  };

  const run = async (name, job, say) => {
    const file = path.join(OUT, name);
    try {
      const data = await job();
      fs.writeFileSync(file + '.tmp', JSON.stringify(data) + '\n');
      fs.renameSync(file + '.tmp', file); // whole file or nothing: a half-written snapshot would break the build
      console.log(`${name.padEnd(14)}live  ${say(data)}`);
    } catch (e) {
      let was = null;
      try { was = JSON.parse(fs.readFileSync(file, 'utf8')).fetched_at; } catch {}
      console.log(`${name.padEnd(14)}${was ? 'kept snapshot from ' + was : 'NO DATA AND NO SNAPSHOT'}: ${e.message}`);
    }
  };
  await run('_git.json', git, (d) => `${n(d.commits)} commits · ${n(d.merges)} merges · ${n(d.week)} in 7 days · ${d.orgs} orgs · ${d.days.length} days ${d.window.from}…${d.window.to}`);
  await Promise.all([
    run('_github.json', github, (d) => `${n(d.repos)} original public repos in ${d.orgs} orgs`),
    run('_pricing.json', pricing, (d) => Object.entries(d.plans).map(([k, p]) => `${k} $${p.price}${p.priceAnnual != null ? '/$' + p.priceAnnual : ''}`).join(' · ')),
  ]);
}

async function pages(paths) {
  const { default: puppeteer } = await import('puppeteer-core');
  const { lock } = await import('./lock.mjs');
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
