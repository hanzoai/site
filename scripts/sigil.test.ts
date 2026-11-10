// Self-check for the Sigil (lib/sigil.mjs, drawn by components/Sigil.jsx and the share cards): the same page always gets
// the same picture, different pages and different numbers get different ones, the pointer bends the field, and one
// frame of a full-screen Sigil costs little enough for 30 fps drift beside a 50+ fps page on an 8 GB Air.
// Usage: node scripts/sigil.test.mjs
import assert from 'node:assert';
import { sigilParams, field, levels, contour } from '../lib/sigil.ts';

const a = JSON.stringify(sigilParams('zen-7', [480])), b = JSON.stringify(sigilParams('zen-7', [480]));
assert.equal(a, b, 'same seed, same picture');
assert.notEqual(a, JSON.stringify(sigilParams('kai', [480])), 'different pages differ');
assert.notEqual(a, JSON.stringify(sigilParams('zen-7', [3])), 'numbers matter');
const seen = new Set(Array.from({ length: 544 }, (_, i) => JSON.stringify(sigilParams('model-' + i))));
assert.equal(seen.size, 544, '544 model pages, 544 different sigils');

// the pointer leans the hills: same time, pointer on vs off, different field
const P = sigilParams('/models', [200, 400]), W = 1470, H = 900, cols = Math.ceil(W / P.cell) + 1, rows = Math.ceil(H / P.cell) + 1;
const still = field(P, new Float32Array(cols * rows), cols, rows, P.cell, W, H, 3, { x: 0.5, y: 0.5, s: 0 });
const bent = field(P, new Float32Array(cols * rows), cols, rows, P.cell, W, H, 3, { x: 0.9, y: 0.1, s: 1 });
assert.ok(still.some((v, i) => Math.abs(v - bent[i]) > 1e-3), 'the pointer bends the field');
const later = field(P, new Float32Array(cols * rows), cols, rows, P.cell, W, H, 9, { x: 0.5, y: 0.5, s: 0 });
assert.ok(still.some((v, i) => Math.abs(v - later[i]) > 1e-3), 'the field drifts with time');

// cost of one full-screen frame (field + every contour level), worst cell size, after warm-up
const pen = { n: 0, moveTo() { this.n++; }, lineTo() {} };
const v = new Float32Array(cols * rows), lv = levels(P, field(P, v, cols, rows, P.cell, W, H, 0, { x: 0.5, y: 0.5, s: 0 }));
const frame = (t) => { field(P, v, cols, rows, P.cell, W, H, t, { x: 0.5, y: 0.5, s: 0.5 }); for (const l of lv) contour(pen, v, cols, rows, P.cell, l); };
for (let i = 0; i < 30; i++) frame(i / 30);
const t0 = performance.now();
for (let i = 0; i < 120; i++) frame(i / 30);
const ms = (performance.now() - t0) / 120;
assert.ok(pen.n > 0, 'contours drawn');
assert.ok(ms < 6, `one 1470×900 frame took ${ms.toFixed(2)} ms (budget 6 ms of a 33 ms drift frame)`);
console.log(`sigil: ok  (1470×900 frame ${ms.toFixed(2)} ms of maths, ${cols}×${rows} grid, ${lv.length} levels)`);
