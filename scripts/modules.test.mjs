// After `pnpm build` (the postbuild step runs it): every Go module hanzo-inc/app publishes under hanzo.ai answers
// ?go-get=1 with its tag in the static HTML of out/, naming the repository the app names. modules.json is that list as
// hanzo-inc/app lib/go-modules.ts evaluates it (name -> repository), 74 modules, nested paths (lz4/v4) included.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(import.meta.dirname, '..', 'out');
const MODULES = JSON.parse(fs.readFileSync(path.join(import.meta.dirname, 'modules.json'), 'utf8'));
const meta = (html, name) => [...html.matchAll(new RegExp(`<meta name="${name}" content="([^"]*)"`, 'g'))].map((m) => m[1]);

test('out/ has been built', () => {
  assert.ok(fs.existsSync(path.join(OUT, 'index.html')), 'run pnpm build first');
});

for (const [name, repo] of Object.entries(MODULES)) {
  test(`hanzo.ai/${name} carries its go-import tag`, () => {
    const html = fs.readFileSync(path.join(OUT, name, 'index.html'), 'utf8');
    const path_ = `hanzo.ai/${name}`;
    assert.deepEqual(meta(html, 'go-import'), [`${path_} git ${repo}`]);
    assert.deepEqual(meta(html, 'go-source'), [`${path_} ${repo} ${repo}/tree/main{/dir} ${repo}/blob/main{/dir}/{file}#L{line}`]);
  });
}
