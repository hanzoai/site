// The benchmark template must read Hanzo's cells as Hanzo wrote them. Usage: node components/pages/bench/benchData.test.mjs
import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';
// the site's modules import without extensions (Next resolves them); plain node needs the .js
registerHooks({ resolve: (s, c, next) => { try { return next(s, c); } catch (e) { if (s.startsWith('.')) return next(s + '.js', c); throw e; } } });
const { measure, benchDoc } = await import('./benchData.js');

assert.deepEqual(measure('92.9%'), { v: 92.9, dim: '%' });
assert.deepEqual(measure('$5.58'), { v: 5.58, dim: '$' });
assert.equal(measure('0.13 ms').dim, 't'); assert.ok(Math.abs(measure('0.13 ms').v - 0.00013) < 1e-12); // time in seconds
assert.deepEqual(measure('~977 GB at that assumption'), { v: 977e9, dim: 'b' });
assert.deepEqual(measure('184 of 198'), { v: 184, dim: '' });
assert.equal(measure('Jev 86.0%'), null);                                   // words first: not a figure, unless loose
assert.deepEqual(measure('Jev 86.0%', true), { v: 86, dim: '%' });
assert.equal(measure('frontier · 2026-07-19'), null);                       // a date is not a measurement
assert.equal(measure('—'), null);

const kai = benchDoc('kai-ag-news').chart;
assert.equal(kai.kind, 'trend');
assert.deepEqual(kai.ticks, ['85%', '91%', '96%']);                         // hanzo.ai's own axis labels
assert.equal(kai.base.s, 'Jev 86.0%');
assert.equal(benchDoc('fleet').chart.kind, 'versus');                       // Hanzo, measured against the published figure
const gpqa = benchDoc('gpqa').chart;
assert.equal(gpqa.rows.find((r) => r.label === 'deepseek-v4-pro').cells[2].s, '$0.203'); // the live re-priced run cost
assert.equal(benchDoc('sandbox').chart.kind, 'one');
console.log('bench data: OK');
