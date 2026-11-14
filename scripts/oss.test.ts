// lib/oss.mjs: the open-source read, on a simulated estate and a simulated GitHub (nothing here touches the network).
import test from 'node:test';
import assert from 'node:assert/strict';
import { combine, github, said } from '../lib/oss.ts';

const day = (n: number) => new Date(Date.UTC(2026, 10, 9) - n * 864e5).toISOString().slice(0, 10);
const days = Object.fromEntries(Array.from({ length: 365 }, (_, i) => [day(364 - i), 1]));
const group = (name: string, mirrors: number) => ({ name, mirrors, daily: days, active: days, latest: [{ repo: 'a/x', sha: '0123456789abcdef', at: '2026-11-09T00:00:00Z', message: 'm', url: 'https://git.hanzo.ai/a/x/commit/0123456789abcdef', ours: true }], commits: 365, merges: 5, active30: 3, orgs: 1, repos: 4, public: 3, private: 1, ours: 2, contributors: 9, people: 2, months: [1], mergeMonths: [1], oursMonths: [1] });
const index = {
  read: '2026-11-09T07:00:00Z', window: { from: day(364), to: day(0) }, months: ['2026-11'], complete: true,
  totals: { orgs: 2, repos: 4, public: 3, private: 1, active: 3, active30: 3, commits: 365, merges: 5, ours: 2, contributors: 9, people: 2, months: [1], mergeMonths: [1], oursMonths: [1] },
  groups: [group('hanzo', 3), group('lux', 1), group('zoo', 0)],
  orgs: [{ name: 'a', group: 'hanzo', github: 'https://github.com/a', commits: 40, months: [40], forge: 'https://git.hanzo.ai/a' }, { name: 'gone', group: 'hanzo', github: 'https://github.com/gone' }, { name: 'z', group: 'zoo' }],
  repos: [{ repo: 'a/x', org: 'a', commits: 30, months: [30], forge: 'https://git.hanzo.ai/a/x', github: 'https://github.com/a/x' }],
};
const repo = (name: string, over: Record<string, unknown> = {}) => ({ full_name: 'a/' + name, name, stargazers_count: 0, forks_count: 0, fork: false, archived: false, language: 'Go', pushed_at: '2026-11-01T00:00:00Z', description: null, homepage: null, ...over });
const page1 = Array.from({ length: 100 }, (_, i) => repo('r' + i, { fork: i < 10, stargazers_count: 1 }));
const page2 = [repo('x', { stargazers_count: 7, forks_count: 2, language: 'Rust' }), repo('y', { archived: true, stargazers_count: 99 })];

function stub(calls: string[]) {
  const json = (body: unknown, status = 200, headers: Record<string, string> = {}) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json', ...headers } });
  return async (input: string | URL | Request) => {
    const url = String(input);
    calls.push(url);
    if (url.includes('/orgs/gone/')) return json({ message: 'Not Found' }, 404);
    if (url.includes('/orgs/a/repos')) return url.endsWith('page=1') ? json(page1, 200, { link: '<https://api.github.com/orgs/a/repos?page=2>; rel="next", <https://api.github.com/orgs/a/repos?page=2>; rel="last"' }) : json(page2);
    if (url.endsWith('/orgs/a')) return json({ name: ' A ', description: 'Runs on Qwen3 weights.' });
    if (url.includes('/contributors?per_page=100')) return json([{ login: 'u1', type: 'User' }, { login: 'bot', type: 'Bot' }, { login: 'u2', type: 'User' }]);
    throw new Error('unexpected ' + url);
  };
}

test('a description loses lineage and upstream names, and is left out whole when it makes a claim', () => {
  assert.equal(said('Speech model, ~1.7B, 24-layer encoder feeding a Qwen3 decoder; 30 languages.'), 'Speech model, ~1.7B; 30 languages.');
  assert.equal(said('Fast. Fine-tuned from a base model. Small.'), 'Fast. Small.');
  assert.equal(said(['SOC', '2 Type II', 'certified.'].join(' ')), undefined);
  assert.equal(said('A router (see the'), 'A router');
  assert.equal(said(null), undefined);
});

test('GitHub is read page by page, forks left out of the originals, archived repositories off the cards', async () => {
  const calls: string[] = [];
  const real = globalThis.fetch;
  globalThis.fetch = stub(calls);
  try {
    const gh = await github({ index, token: 't', kept: null, thrifty: false });
    const h = gh.groups.hanzo;
    assert.deepEqual([h.checked, h.repos, h.public], [1, 92, 102]); // 'gone' is not on GitHub, so not checked
    assert.equal(h.stars, 100 + 7 + 99); // every public repository's stars, forks and archived included
    assert.equal(h.forks, 2 + 10); // a fork of someone else's counts once
    assert.equal(h.top.length, 16);
    assert.equal(h.top[0].repo, 'a/x'); // the most starred; the archived 'y' is not a card
    assert.deepEqual([h.top[0].contributors, h.top[0].faces, h.top[0].commits], [2, ['u1', 'u2'], 30]);
    assert.deepEqual(h.orgs, [{ login: 'a', name: 'A', description: undefined, repos: 92, stars: 90 + 7 + 99 }]);
    assert.equal(h.languages[0].name, 'Go');
  } finally { globalThis.fetch = real; }
});

test('a push reuses a card\'s contributors and an org\'s description instead of asking again', async () => {
  const calls: string[] = [];
  const real = globalThis.fetch;
  globalThis.fetch = stub(calls);
  try {
    const kept = { groups: { hanzo: { top: [{ repo: 'a/x', contributors: 5, faces: ['k'], site: 'https://x.dev' }], orgs: [{ login: 'a', name: 'Kept', description: 'Kept.' }] } } };
    const gh = await github({ index, token: 't', kept, thrifty: true });
    assert.deepEqual([gh.groups.hanzo.top[0].contributors, gh.groups.hanzo.top[0].site, gh.groups.hanzo.orgs[0].name], [5, 'https://x.dev', 'Kept']);
    assert.ok(!calls.some((u) => u.includes('/repos/a/x/contributors')) && !calls.some((u) => u.endsWith('/orgs/a')));
  } finally { globalThis.fetch = real; }
});

test('without a token GitHub is not asked', async () => {
  await assert.rejects(github({ index, token: '', kept: null, thrifty: false }), /needs GITHUB_TOKEN/);
});

test('the estate and GitHub combine as sync-oss writes them: a mirror counts once among stars and forks, the unlisted repository keeps its year', () => {
  const gh = { groups: { hanzo: { checked: 1, repos: 92, public: 102, stars: 10, forks: 4, languages: [], orgs: [{ login: 'a', repos: 92, stars: 10 }], top: [{ repo: 'a/x', stars: 7, contributors: 2, faces: [] }, { repo: 'a/ai', stars: 3, contributors: 1, faces: [], commits: 5391, months: [5391] }] }, lux: { checked: 0, repos: 0, public: 0, stars: 0, forks: 0, languages: [], orgs: [], top: [] }, zoo: { checked: 0, repos: 0, public: 0, stars: 0, forks: 0, languages: [], orgs: [], top: [] } } };
  const { sum, act } = combine(index, gh);
  const h = sum.groups.hanzo;
  assert.deepEqual([h.stars, h.forks], [13, 7]);
  assert.deepEqual(h.commits, { year: 365, month: 30, week: 7 });
  assert.deepEqual([h.top[0].commits, h.top[0].forge], [30, 'https://git.hanzo.ai/a/x']);
  assert.deepEqual([h.top[1].commits, h.top[1].forge], [5391, undefined]);
  assert.deepEqual([h.orgs[0].commits, h.orgs[0].forge], [40, 'https://git.hanzo.ai/a']);
  assert.deepEqual([act.from, act.to, act.groups.hanzo.latest[0].sha, act.groups.hanzo.latest[0].url], [index.window.from, index.window.to, '0123456', 'https://github.com/a/x/commit/0123456789abcdef']);
  assert.deepEqual([sum.forge.repos, sum.estate.commits], [3, 365]);
});
