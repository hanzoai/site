// /bounty's build snapshot: refresh components/pages/Bounty.snapshot.ts from GitHub's open bounty issues
// on every build (scripts/live.ts wires this into prebuild). Reads the same query and parser as
// components/pages/Bounty.github.ts with process.env.GITHUB_TOKEN when set (the CI runner token:
// never logged, never written to a file, never NEXT_PUBLIC_*). Paginates (per_page=100) until all
// open bounty issues are read (cap 1000). No token or GitHub failure keeps the existing snapshot,
// prints why, and does not fail the build. Writes `taken` as an ISO timestamp into the snapshot.
import { openBounties } from '../components/pages/Bounty.github.ts';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SNAP = path.join(ROOT, 'components', 'pages', 'Bounty.snapshot.ts');
const CAP = 1000;

async function main() {
  const token = process.env.GITHUB_TOKEN;
  const old = fs.existsSync(SNAP) ? fs.readFileSync(SNAP, 'utf8') : null;
  if (!token) {
    console.log('bounty snapshot kept: no GITHUB_TOKEN');
    return;
  }
  const c = new AbortController();
  const t = setTimeout(() => c.abort(), 120000);
  let o: Awaited<ReturnType<typeof openBounties>> | null = null;
  try { o = await openBounties(c.signal); }
  catch (e) { console.log(`bounty snapshot kept: ${(e as Error).message}`); }
  finally { clearTimeout(t); }
  if (!o) return;
  const head = `// Build snapshot of open bounties (GitHub search, same query and parser as Bounty.github.js), taken ${new Date().toISOString()}.\n// Shown until GitHub answers, and kept when it does not. Refresh: node scripts/bounty.ts\n`;
  const body = 'export const SNAP = ' + JSON.stringify({ taken: new Date().toISOString(), total: o.total, items: o.items }).replace(/\},\{/g, '},\n  {') + ';\n';
  fs.writeFileSync(SNAP + '.tmp', head + body);
  fs.renameSync(SNAP + '.tmp', SNAP);
  console.log(`bounty snapshot live ${o.items.length} issues · total ${o.total} taken ${new Date().toISOString()}`);
}

main().catch((e) => {
  if (old == null) throw e;
  console.log(`bounty snapshot kept: ${(e as Error).message}`);
});
