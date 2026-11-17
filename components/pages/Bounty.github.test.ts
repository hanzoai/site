// node components/pages/Bounty.github.test.ts — the GitHub bounty parser keeps only labelled issues of Hanzo orgs
import assert from 'node:assert';
import * as m from './Bounty.github.ts';

assert.ok(!m.SEARCH.includes('archived'), 'SEARCH must not include unsupported archived qualifier');
assert.deepEqual(
  m.issue({ html_url: 'https://github.com/hanzoai/ui/issues/12', title: ' Fix it ', labels: [{ name: 'bounty' }, { name: 'bounty:L' }] }),
  { repo: 'hanzoai/ui', number: 12, title: 'Fix it', url: 'https://github.com/hanzoai/ui/issues/12', tier: 'L' }
);
assert.equal(
  m.richIssue({ html_url: 'https://github.com/hanzoai/ai/issues/138', title: '[QA Bounty] [P0] Cross-Model API Compatibility', state: 'open', comments: 8, user: { login: 'zooqueen' }, labels: [{ name: 'bounty' }, { name: 'bounty:P0' }] })?.author,
  'zooqueen'
);
assert.equal(m.issue({ html_url: 'https://github.com/evil/ui/issues/1', title: 'x', labels: ['bounty'] }), null);
assert.equal(m.issue({ html_url: 'https://github.com/hanzoai/ui/issues/1', title: 'x', labels: ['bug'] }), null);
assert.equal(m.issue({ html_url: 'https://github.com/hanzoai/ui/issues/1', title: 'x', labels: ['bounty'], pull_request: {} }), null);
console.log('bounty parser ok');

// --snap: refresh the build snapshot (Bounty.snapshot.ts) the page shows until GitHub answers, or when it does not
if (process.argv.includes('--snap')) {
  const o = await m.openBounties();
  if (!o) throw new Error('GitHub did not answer; snapshot kept');
  const fs = await import('node:fs');
  const head = `// Build snapshot of open bounties (GitHub search, same query and parser as Bounty.github.ts), taken ${new Date().toISOString().slice(0, 10)}.\n// Shown until GitHub answers, and kept when it does not. Refresh: node components/pages/Bounty.github.test.ts --snap\n`;
  fs.writeFileSync(new URL('./Bounty.snapshot.ts', import.meta.url), head + 'export const SNAP = ' + JSON.stringify({ total: o.total, closedTotal: o.closedTotal, items: o.items }, null, 2) + ';\n');
  console.log('snapshot', o.items.length);
}
