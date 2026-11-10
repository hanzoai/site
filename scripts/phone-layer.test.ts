// Self-check for sibling swipes: model pages loop through the nine models, family pages find their neighbours
// within their own family, top-level pages have none. Runs the real siblings() from components/Phone.jsx.
import assert from 'node:assert';
import fs from 'node:fs';
const S = JSON.parse(fs.readFileSync(new URL('../lib/search.json', import.meta.url)));
const src = fs.readFileSync(new URL('../components/Phone.tsx', import.meta.url), 'utf8');
const fn = src.slice(src.indexOf('const FLAG'), src.indexOf('function go('))
  .replace("MODELS.map((m) => '/' + m.slug)", JSON.stringify(['enso', 'kai', 'zen', 'iro', 'koma', 'oto', 'koe', 'uta', 'mori'].map((s) => '/' + s)));
const { siblings } = await import('data:text/javascript,' + encodeURIComponent(fn));
assert.deepEqual([siblings('/enso', S).prev, siblings('/enso', S).next], ['/mori', '/kai']);
assert.equal(siblings('/about', S), null);
const t = siblings('/legal/terms', S); assert.ok(t.next.startsWith('/legal/') && t.prev.startsWith('/legal/'));
const m = siblings('/models/z-ai', S); assert.ok(m && m.next.startsWith('/models/'));
console.log('phone layer: ok');
