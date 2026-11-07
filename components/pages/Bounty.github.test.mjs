// node components/pages/Bounty.github.test.mjs  — the GitHub bounty parser keeps only labelled issues of Hanzo orgs
import assert from 'node:assert';
const src = (await import('node:fs')).readFileSync(new URL('./Bounty.github.js', import.meta.url),'utf8').replace(/import \{[^}]+\} from 'react';/,'const useState=()=>{},useEffect=()=>{};');
const m = await import('data:text/javascript,' + encodeURIComponent(src));
assert.deepEqual(m.issue({ html_url: 'https://github.com/hanzoai/ui/issues/12', title: ' Fix it ', labels: [{ name: 'bounty' }, { name: 'bounty:L' }] }), { repo: 'hanzoai/ui', number: 12, title: 'Fix it', url: 'https://github.com/hanzoai/ui/issues/12', tier: 'L' });
assert.equal(m.issue({ html_url: 'https://github.com/evil/ui/issues/1', title: 'x', labels: ['bounty'] }), null);
assert.equal(m.issue({ html_url: 'https://github.com/hanzoai/ui/issues/1', title: 'x', labels: ['bug'] }), null);
assert.equal(m.issue({ html_url: 'https://github.com/hanzoai/ui/issues/1', title: 'x', labels: ['bounty'], pull_request: {} }), null);
console.log('bounty parser ok');
// --snap: refresh the build snapshot (Bounty.snapshot.js) the page shows until GitHub answers, or when it does not
if (process.argv.includes('--snap')) {
  const o = await m.openBounties();
  if (!o) throw new Error('GitHub did not answer; snapshot kept');
  const fs = await import('node:fs');
  const head = `// Build snapshot of open bounties (GitHub search, same query and parser as Bounty.github.js), taken ${new Date().toISOString().slice(0, 10)}.\n// Shown until GitHub answers, and kept when it does not. Refresh: node components/pages/Bounty.github.test.mjs --snap\n`;
  fs.writeFileSync(new URL('./Bounty.snapshot.js', import.meta.url), head + 'export const SNAP = ' + JSON.stringify({ total: o.total, items: o.items }).replace(/\},\{/g, '},\n  {') + ';\n');
  console.log('snapshot', o.items.length);
}
