// Self-check for scripts/live.mjs: a source that is offline, rate-limited, half-answered or returns garbage keeps its
// last good file untouched AND the run exits 1 naming it (the build stops); HZ_LIVE_OFFLINE=1 reads nothing and exits 0;
// every file in content/live/_*.json has its shape. (lib/oss.mjs, the open-source read, is checked by oss.test.mjs.)
// Usage: node scripts/live.test.mjs            offline: simulated sources only, then the shapes of the files on disk
//        node scripts/live.test.mjs --online   first refreshes from the live sources and requires that to succeed
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FILES = ['_git.json', '_github.json', '_pricing.json', '_oss.json', '_research.json', '_models.json'];
const read = (f, root = ROOT) => fs.readFileSync(path.join(root, 'content', 'live', f), 'utf8');
const run = (env = {}, stub, root = ROOT) => {
  try { return { code: 0, out: execFileSync(process.execPath, [...(stub ? ['--import', stub] : []), path.join(root, 'scripts', 'live.mjs')], { cwd: root, encoding: 'utf8', stdio: 'pipe', env: { ...process.env, HZ_LIVE_OFFLINE: '', ...env } }) }; }
  catch (e) { return { code: e.status, out: String(e.stdout) + String(e.stderr) }; }
};
// a run where some source fails must stop the build: exit 1, and name the failure
const live = (env, stub, root) => { const r = run(env, stub, root); assert.equal(r.code, 1, 'a failed source must exit 1'); assert.match(r.out, /LIVE FIGURES FAILED/); return r.out; };
const fresh = (s, since) => Date.parse(s) >= since;

if (process.argv.includes('--online')) {
  const since = Date.now();
  const { code, out } = run();
  process.stdout.write(out);
  assert.equal(code, 0, 'every live source must answer');
  for (const f of ['_git.json', '_pricing.json', '_oss.json', '_research.json', '_models.json']) assert.ok(fresh(JSON.parse(read(f)).fetched_at, since), f + ' was not refreshed live');
  if (process.env.GITHUB_TOKEN) assert.ok(fresh(JSON.parse(read('_github.json')).fetched_at, since), '_github.json was not refreshed live');
  console.log('ok  online: live sources answered and were written');
}

// Simulated sources: each scenario replaces fetch in the child process, which runs a copy of scripts/live.mjs and the
// snapshots in a temp folder, so the real files never hold test data, even if this run is killed.
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'live-test-'));
const before = Object.fromEntries(FILES.map((f) => [f, read(f)]));
fs.mkdirSync(path.join(tmp, 'scripts'));
fs.mkdirSync(path.join(tmp, 'content', 'live'), { recursive: true });
fs.copyFileSync(path.join(ROOT, 'scripts', 'live.mjs'), path.join(tmp, 'scripts', 'live.mjs'));
fs.mkdirSync(path.join(tmp, 'lib'));
fs.copyFileSync(path.join(ROOT, 'lib', 'liveSources.mjs'), path.join(tmp, 'lib', 'liveSources.mjs')); // the sources live.mjs shares with the home page
fs.copyFileSync(path.join(ROOT, 'lib', 'oss.mjs'), path.join(tmp, 'lib', 'oss.mjs'));
fs.copyFileSync(path.join(ROOT, 'lib', 'heat.mjs'), path.join(tmp, 'lib', 'heat.mjs'));
fs.mkdirSync(path.join(tmp, 'components', 'pages', 'openSource'), { recursive: true });
fs.copyFileSync(path.join(ROOT, 'components', 'pages', 'openSource', 'shape.mjs'), path.join(tmp, 'components', 'pages', 'openSource', 'shape.mjs'));
for (const f of FILES) fs.writeFileSync(path.join(tmp, 'content', 'live', f), before[f]);
const g = JSON.parse(before['_git.json']);
const activity = {
  complete: true, read: g.read, window: g.window, totals: { commits: g.commits, merges: g.merges, orgs: g.orgs },
  daily: Object.fromEntries(g.days.map(([d, c]) => [d, c])), active: Object.fromEntries(g.days.map(([d, , r]) => [d, r])),
};
const stub = (name, body) => {
  const f = path.join(tmp, name + '.mjs');
  fs.writeFileSync(f, `const json = (b, status = 200, h = {}) => new Response(JSON.stringify(b), { status, headers: { 'content-type': 'application/json', ...h } });
const ACT = ${JSON.stringify(activity)};
globalThis.fetch = async (u) => { u = String(u); ${body} };`);
  return f;
};
const kept = (out, f, why) => assert.match(out, new RegExp(`${f.replace('.', '\\.')}\\s+kept snapshot from \\S+: .*(?:${why})`), `${f} should keep its snapshot (${why})`);
const same = (...fs_) => { for (const f of fs_) assert.equal(read(f, tmp), before[f], f + ' changed'); };

try {
  for (const [name, body, why] of [
    ['offline', `throw new TypeError('fetch failed (simulated: offline)');`, 'fetch failed'],
    ['rate-limited', `return json({ message: 'API rate limit exceeded' }, 403, { 'x-ratelimit-remaining': '0' });`, 'rate limited|403'],
    ['garbage', `return json({ daily: {}, plans: 'none' });`, 'unexpected data'],
  ]) {
    const out = live({ GITHUB_TOKEN: 'test' }, stub(name, body), tmp);
    for (const f of FILES.filter((x) => x !== '_github.json')) kept(out, f, why);
    same(...FILES);
    console.log(`ok  ${name}: every file kept its last good snapshot and the run exited 1`);
  }

  let r = run({ HZ_LIVE_OFFLINE: '1' }, stub('offline-on-purpose', `throw new Error('HZ_LIVE_OFFLINE=1 must not read ' + u);`), tmp);
  assert.equal(r.code, 0, 'HZ_LIVE_OFFLINE=1 exits 0');
  assert.match(r.out, /HZ_LIVE_OFFLINE=1: no source read/);
  same(...FILES);
  console.log('ok  HZ_LIVE_OFFLINE=1: nothing is read, every snapshot stays, exit 0');
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}

// The shapes the pages and lib/commits.js read. A number is never missing, empty, negative or made up of parts.
const int = (n) => Number.isInteger(n) && n >= 0;
for (const f of FILES) {
  const d = JSON.parse(read(f));
  assert.match(d.source, /^(https:\/\/|snapshot: )/, f + ' source');
  assert.ok(Date.parse(d.fetched_at) <= Date.now() + 6e4, f + ' fetched_at');
}
const git = JSON.parse(read('_git.json'));
assert.ok(git.days.length === 365 || git.days.length === 366, 'a year of days');
git.days.forEach(([d, c, r], i) => {
  assert.ok(int(c) && int(r), 'counts on ' + d);
  if (i) assert.equal(Date.parse(d) - Date.parse(git.days[i - 1][0]), 864e5, 'consecutive days at ' + d);
});
assert.deepEqual([git.days[0][0], git.days.at(-1)[0]], [git.window.from, git.window.to]);
assert.ok([git.commits, git.merges, git.orgs].every((n) => int(n) && n > 0), 'year, merges, orgs');
assert.equal(git.week, git.days.slice(-7).reduce((s, x) => s + x[1], 0), 'week is the last 7 days');
const gh = JSON.parse(read('_github.json'));
for (const k of ['hanzo', 'lux', 'zoo']) {
  const x = gh.groups[k];
  assert.ok([x.checked, x.repos, x.public, x.stars, x.forks].every((n) => int(n) && n > 0) && x.repos <= x.public, 'github totals ' + k);
  assert.ok(x.top.length >= 6 && x.top.every((c) => int(c.stars) && int(c.contributors) && Array.isArray(c.faces) && int(c.commits) && c.months.length === 13), 'github cards ' + k);
  assert.ok(x.languages.length > 0 && x.orgs.length > 0 && x.orgs.every((o) => o.login && int(o.repos)), 'github languages and orgs ' + k);
}
const pr = JSON.parse(read('_pricing.json'));
for (const slug of ['free', 'go', 'pro-3x', 'dev-5x', 'max-15x', 'ultra', 'team', 'team-premium', 'enterprise', 'enterprise-300', 'white-label']) {
  const p = pr.plans[slug];
  assert.ok(p && typeof p.name === 'string' && Number.isFinite(p.price) && p.price >= 0 && (p.priceAnnual === null || Number.isFinite(p.priceAnnual)), 'plan ' + slug);
}
assert.ok(Object.values(pr.plans).some((p) => p.category === 'agency'), 'agency plans');
const oss = JSON.parse(read('_oss.json'));
assert.ok([oss.estate.commits, oss.estate.merges, oss.estate.orgs, oss.calendar.week].every((n) => int(n) && n > 0), 'open-source figures');
assert.ok(oss.estate.mergeMonths.length > 0 && oss.estate.mergeMonths.every(int), 'merges a month');
assert.ok(oss.calendar.days.length >= 365 && oss.groups.hanzo.top.length >= 12, 'calendar and repository cards');
const rs = JSON.parse(read('_research.json'));
for (const k of ['repair', 'latency', 'gpqa']) assert.ok(Array.isArray(rs[k]) && rs[k].length > 0, 'research ' + k);
const md = JSON.parse(read('_models.json'));
assert.ok(md.models.some((m) => m.id === 'kai' && m.pricing.input_per_million > 0) && Object.keys(md.names).length > 0, 'models and names');
for (const f of FILES) console.log(`ok  shape ${f.padEnd(14)}${JSON.parse(read(f)).source} · ${JSON.parse(read(f)).fetched_at}`);
