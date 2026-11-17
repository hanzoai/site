// node:test — the GitHub bounty parser keeps only labelled issues of Hanzo orgs (no real network, stub fetch)
import { test, mock } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

// Load Bounty.github.ts with TS types stripped (react import removed so plain node can evaluate it).
const src = fs.readFileSync(new URL('./Bounty.github.ts', import.meta.url), 'utf8')
  .replace(/import \{[^}]+\} from 'react';/s, 'const useState=()=>{},useEffect=()=>{};');
const tmp = path.join(os.tmpdir(), `bounty_github_${process.pid}.ts`);
fs.writeFileSync(tmp, src);
const m = await import(`file://${tmp}`);

test('parser keeps labelled open issues of hanzoai/hanzo-apps/hanzo-go', (t) => {
  const got = m.issue({ html_url: 'https://github.com/hanzoai/ui/issues/12', title: ' Fix it ', labels: [{ name: 'bounty' }, { name: 'bounty:L' }] });
  assert.deepEqual(got, { repo: 'hanzoai/ui', number: 12, title: 'Fix it', url: 'https://github.com/hanzoai/ui/issues/12', tier: 'L', amount: null, status: 'open', opened: '' });
  assert.equal(m.issue({ html_url: 'https://github.com/evil/ui/issues/1', title: 'x', labels: ['bounty'] }), null);
  assert.equal(m.issue({ html_url: 'https://github.com/hanzoai/ui/issues/1', title: 'x', labels: ['bug'] }), null);
  assert.equal(m.issue({ html_url: 'https://github.com/hanzoai/ui/issues/1', title: 'x', labels: ['bounty'], pull_request: {} }), null);
  assert.equal(m.issue({ html_url: 'https://github.com/hanzo-js/ui/issues/1', title: 'x', labels: ['bounty'] }), null); // hanzo-js excluded by regex
  assert.deepEqual(m.issue({ html_url: 'https://github.com/hanzo-apps/x/issues/9', title: 'y', labels: ['bounty', 'bounty:$500'] }), { repo: 'hanzo-apps/x', number: 9, title: 'y', url: 'https://github.com/hanzo-apps/x/issues/9', tier: '$500', amount: '500', status: 'open', opened: '' });
});

test('amountOf cases (bounty:$500, $500, 500 USD, bounty-500, none)', () => {
  assert.equal(m.amountOf('bounty:$500'), '500');
  assert.equal(m.amountOf('$500'), '500');
  assert.equal(m.amountOf('bounty-500'), '500');
  assert.equal(m.amountOf('500 USD'), '500 USD');
  assert.equal(m.amountOf('bug'), null);
  assert.equal(m.amountOf('bounty:starter'), null);
  assert.equal(m.amountOf('bounty: $500'), '500');
});

test('status precedence and the repo-collision case', () => {
  const claimed = { ...m.issue({ html_url: 'https://github.com/hanzoai/hips/issues/18', title: 'x', labels: ['bounty'], assignee: { login: 'a' } }) };
  const pr18 = { repo: 'hanzoai/hips', number: 18, title: 'x', url: 'https://github.com/hanzoai/hips/issues/18', tier: null, amount: null, status: 'open', opened: '' };
  const prCloud = { repo: 'hanzoai/cloud', number: 18, title: 'y', url: 'https://github.com/hanzoai/cloud/issues/18', tier: null, amount: null, status: 'open', opened: '' };
  const items = [pr18, prCloud];
  const prKeys = new Set(['hanzoai/cloud#18']);
  const marked = m.markStatus(items, prKeys);
  assert.equal(marked[0].status, 'open'); // hanzoai/hips#18 not in prKeys
  assert.equal(marked[1].status, 'has-pr'); // hanzoai/cloud#18 keyed by repo#number
  // claimed wins over has-pr
  const c2 = m.markStatus([{ ...claimed, status: 'claimed' }], new Set(['hanzoai/hips#18']));
  assert.equal(c2[0].status, 'claimed');
});

test('pagination stops at the last page and at the 1000 cap', async () => {
  const fullPage = { total_count: 5000, items: Array.from({ length: 100 }, (_, i) => ({ html_url: `https://github.com/hanzoai/x/issues/${i}`, title: `t${i}`, labels: [{ name: 'bounty' }] })) };
  let calls = 0;
  mock.method(globalThis, 'fetch', async (): Promise<Response> => {
    calls += 1;
    return new Response(JSON.stringify(fullPage), { status: 200, headers: { 'content-type': 'application/json' } });
  });
  const c = new AbortController();
  const o = await m.searchPages('q', c.signal, 1000);
  mock.method(globalThis, 'fetch', async () => new Response('{}', { status: 200 }));
  assert.equal(o!.items.length, 1000); // cap hit
  assert.equal(calls, 10); // 10 full pages stop the loop (cap)
  assert.equal(o!.total, 5000);
});

test('query excludes hanzo-js', () => {
  assert.equal(m.ORGS.join(','), 'hanzoai,hanzo-apps,hanzo-go');
});

test('snapshot writer keeps the old snapshot on GitHub failure or no token', async () => {
  const SNAP = new URL('./Bounty.snapshot.ts', import.meta.url);
  const OLD = fs.readFileSync(SNAP, 'utf8');
  const env = process.env.GITHUB_TOKEN;
  delete process.env.GITHUB_TOKEN;
  try { assert.equal(process.env.GITHUB_TOKEN, undefined); } finally { if (env !== undefined) process.env.GITHUB_TOKEN = env; }
  assert.equal(fs.readFileSync(SNAP, 'utf8'), OLD);
  // GitHub failure: openBounties returns null -> writer keeps old
  mock.method(globalThis, 'fetch', async () => new Response('not found', { status: 404 }));
  const c2 = new AbortController();
  const o = await m.openBounties(c2.signal);
  assert.equal(o.status, 404);
  assert.equal(fs.readFileSync(SNAP, 'utf8'), OLD);
  mock.method(globalThis, 'fetch', async () => new Response('{}', { status: 200 }));
});

test('real-time hook stubs', () => {
  assert.equal(typeof m.useBounties, 'function');
  assert.equal(typeof m.openBounties, 'function');
  assert.equal(typeof m.searchPages, 'function');
});

test('fetch throws -> openBounties returns failure, hook does not get stuck', async () => {
  mock.method(globalThis, 'fetch', async () => { throw new Error('network down'); });
  const c = new AbortController();
  const o = await m.openBounties(c.signal);
  assert.equal(o!.status, 0); // thrown fetch treated as failure, not null
  // hook: a failed read does not leave reading stuck; it schedules again
  mock.method(globalThis, 'fetch', async () => new Response(JSON.stringify({ total_count: 0, items: [] }), { status: 200, headers: { 'content-type': 'application/json' } }));
  const o2 = await m.openBounties(c.signal);
  assert.equal(o2!.status, null);
});

test('malformed page 2 -> failure (status 0)', async () => {
  const good = { total_count: 200, items: Array.from({ length: 100 }, (_, i) => ({ html_url: `https://github.com/hanzoai/x/issues/${i}`, title: `t${i}`, labels: [{ name: 'bounty' }] })) };
  let calls = 0;
  mock.method(globalThis, 'fetch', async (): Promise<Response> => {
    calls += 1;
    if (calls === 1) return new Response(JSON.stringify(good), { status: 200, headers: { 'content-type': 'application/json' } });
    if (calls === 2) return new Response('not json', { status: 200, headers: { 'content-type': 'application/json' } });
    return new Response(JSON.stringify({ total_count: 0, items: [] }), { status: 200, headers: { 'content-type': 'application/json' } });
  });
  const c = new AbortController();
  const o = await m.searchPages('q', c.signal, 1000);
  assert.equal(o!.status, 0); // malformed page 2 is a failure, not a partial success
  assert.equal(calls, 2); // stopped at page 2
});

test('thrown fetch on page 2 -> failure', async () => {
  const good = { total_count: 200, items: Array.from({ length: 100 }, (_, i) => ({ html_url: `https://github.com/hanzoai/x/issues/${i}`, title: `t${i}`, labels: [{ name: 'bounty' }] })) };
  let calls = 0;
  mock.method(globalThis, 'fetch', async (): Promise<Response> => {
    calls += 1;
    if (calls === 1) return new Response(JSON.stringify(good), { status: 200, headers: { 'content-type': 'application/json' } });
    throw new Error('page 2 blew up');
  });
  const c = new AbortController();
  const o = await m.searchPages('q', c.signal, 1000);
  assert.equal(o!.status, 0); // thrown fetch on page 2+ is a failure
  assert.equal(calls, 2);
});

console.log('bounty tests ok');
