// Self-check for scripts/live.mjs: a source that is offline, rate-limited, half-answered or returns garbage keeps its
// last good file untouched AND the run exits 1 naming it (the build stops); HZ_LIVE_OFFLINE=1 reads nothing and exits 0;
// the GitHub count is right; every file in content/live/_*.json has its shape.
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
  if (process.env.HZ_LIVE_GITHUB === '1') assert.ok(fresh(JSON.parse(read('_github.json')).fetched_at, since), '_github.json was not refreshed live');
  console.log('ok  online: live sources answered and were written');
}

// Simulated sources: each scenario replaces fetch in the child process, which runs a copy of scripts/live.mjs and the
// snapshots in a temp folder, so the real files never hold test data, even if this run is killed.
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'live-test-'));
const before = Object.fromEntries(FILES.map((f) => [f, read(f)]));
fs.mkdirSync(path.join(tmp, 'scripts'));
fs.mkdirSync(path.join(tmp, 'content', 'live'), { recursive: true });
fs.copyFileSync(path.join(ROOT, 'scripts', 'live.mjs'), path.join(tmp, 'scripts', 'live.mjs'));
for (const f of FILES) fs.writeFileSync(path.join(tmp, 'content', 'live', f), before[f]);
const g = JSON.parse(before['_git.json']);
const activity = {
  complete: true, read: g.read, window: g.window, totals: { commits: g.commits, merges: g.merges, orgs: g.orgs },
  daily: Object.fromEntries(g.days.map(([d, c]) => [d, c])), active: Object.fromEntries(g.days.map(([d, , r]) => [d, r])),
  orgs: [{ github: 'https://github.com/a', group: 'hanzo' }, { github: 'https://github.com/b', group: 'lux' }, { github: 'https://github.com/gone', group: 'lux' }, { group: 'zoo' }],
};
const repos = (n, forks) => Array.from({ length: n }, (_, i) => ({ fork: i < forks }));
const stub = (name, body) => {
  const f = path.join(tmp, name + '.mjs');
  fs.writeFileSync(f, `const json = (b, status = 200, h = {}) => new Response(JSON.stringify(b), { status, headers: { 'content-type': 'application/json', ...h } });
const ACT = ${JSON.stringify(activity)};
globalThis.fetch = async (u) => { u = String(u); ${body} };`);
  return f;
};
const GH = `if (u.includes('/git/activity')) return json(ACT);
  if (u.includes('/billing/plans')) return json({ error: 'down' }, 503);
  if (u.includes('/orgs/a/') && u.endsWith('page=1')) return json(${JSON.stringify(repos(100, 40))});
  if (u.includes('/orgs/a/')) return json(${JSON.stringify(repos(3, 0))});
  if (u.includes('/orgs/gone/')) return json({ message: 'Not Found' }, 404);`;
const kept = (out, f, why) => assert.match(out, new RegExp(`${f.replace('.', '\\.')}\\s+kept snapshot from \\S+: .*(?:${why})`), `${f} should keep its snapshot (${why})`);
const same = (...fs_) => { for (const f of fs_) assert.equal(read(f, tmp), before[f], f + ' changed'); };

try {
  for (const [name, body, why] of [
    ['offline', `throw new TypeError('fetch failed (simulated: offline)');`, 'fetch failed|needs the organization list'],
    ['rate-limited', `return json({ message: 'API rate limit exceeded' }, 403, { 'x-ratelimit-remaining': '0' });`, 'rate limited|needs the organization list'],
    ['garbage', `return json({ daily: {}, plans: 'none' });`, 'unexpected data|needs the organization list'],
  ]) {
    const out = live({ GITHUB_TOKEN: 'test', HZ_LIVE_GITHUB: '1' }, stub(name, body), tmp);
    for (const f of FILES) kept(out, f, why);
    same(...FILES);
    console.log(`ok  ${name}: every file kept its last good snapshot and the run exited 1`);
  }

  let r = run({ HZ_LIVE_OFFLINE: '1' }, stub('offline-on-purpose', `throw new Error('HZ_LIVE_OFFLINE=1 must not read ' + u);`), tmp);
  assert.equal(r.code, 0, 'HZ_LIVE_OFFLINE=1 exits 0');
  assert.match(r.out, /HZ_LIVE_OFFLINE=1: no source read/);
  same(...FILES);
  console.log('ok  HZ_LIVE_OFFLINE=1: nothing is read, every snapshot stays, exit 0');

  let out = live({ GITHUB_TOKEN: 'test', HZ_LIVE_GITHUB: '' }, stub('no-github', `if (u.includes('/git/activity')) return json(ACT); if (u.includes('github.com')) throw new Error('GitHub must not be called'); return json({}, 500);`), tmp);
  assert.match(out, /_github\.json\s+skipped/);
  same('_github.json');
  console.log('ok  without HZ_LIVE_GITHUB=1: GitHub is not called and its snapshot stays');

  out = live({ GITHUB_TOKEN: 'test', HZ_LIVE_GITHUB: '1' }, stub('half', `${GH} return json({ message: 'API rate limit exceeded' }, 403, { 'x-ratelimit-remaining': '0' });`), tmp);
  kept(out, '_github.json', '403');
  kept(out, '_pricing.json', '503');
  same('_github.json', '_pricing.json');
  console.log('ok  GitHub answers one org, then rate-limits: no partial count is written');

  const since = Date.now();
  out = live({ GITHUB_TOKEN: 'test', HZ_LIVE_GITHUB: '1' }, stub('github', `${GH} if (u.includes('/orgs/b/')) return json(${JSON.stringify(repos(2, 1))}); throw new Error('unexpected ' + u);`), tmp);
  const gh = JSON.parse(read('_github.json', tmp));
  assert.ok(fresh(gh.fetched_at, since));
  assert.deepEqual({ orgs: gh.orgs, repos: gh.repos, groups: gh.groups }, { orgs: 2, repos: 64, groups: { hanzo: { orgs: 1, repos: 63 }, lux: { orgs: 1, repos: 1 } } });
  assert.deepEqual(JSON.parse(read('_git.json', tmp)).days, g.days);
  kept(out, '_pricing.json', '503');
  console.log('ok  GitHub: forks left out, both pages counted, a vanished org skipped (64 repos in 2 orgs)');
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
assert.ok(int(gh.repos) && gh.repos > 0 && int(gh.orgs) && gh.orgs > 0, 'github totals');
assert.equal(Object.values(gh.groups).reduce((s, x) => s + x.repos, 0), gh.repos, 'github groups add up');
const pr = JSON.parse(read('_pricing.json'));
for (const slug of ['free', 'go', 'pro-2x', 'dev-5x', 'max-10x', 'ultra', 'team', 'team-premium', 'enterprise']) {
  const p = pr.plans[slug];
  assert.ok(p && typeof p.name === 'string' && Number.isFinite(p.price) && p.price >= 0 && (p.priceAnnual === null || Number.isFinite(p.priceAnnual)), 'plan ' + slug);
}
const oss = JSON.parse(read('_oss.json'));
assert.ok([oss.estate.commits, oss.estate.merges, oss.estate.orgs, oss.calendar.week].every((n) => int(n) && n > 0), 'open-source figures');
assert.ok(oss.calendar.days.length >= 365 && oss.groups.hanzo.top.length >= 12, 'calendar and repository cards');
const rs = JSON.parse(read('_research.json'));
for (const k of ['repair', 'latency', 'gpqa']) assert.ok(Array.isArray(rs[k]) && rs[k].length > 0, 'research ' + k);
const md = JSON.parse(read('_models.json'));
assert.ok(md.models.some((m) => m.id === 'kai' && m.pricing.input_per_million > 0) && Object.keys(md.names).length > 0, 'models and names');
for (const f of FILES) console.log(`ok  shape ${f.padEnd(14)}${JSON.parse(read(f)).source} · ${JSON.parse(read(f)).fetched_at}`);
