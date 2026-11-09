// lib/heat.mjs: the shade a day's commits earn.
import test from 'node:test';
import assert from 'node:assert/strict';
import { cuts, shade } from '../lib/heat.mjs';

test('a shade is a quartile of the days that had commits, and an outlier does not flatten the rest', () => {
  const days = [...Array.from({ length: 100 }, (_, i) => i + 1), 1e6, 0, 0];
  const cut = cuts(days);
  assert.deepEqual(cut, [26, 51, 76]);
  assert.deepEqual([0, 1, 26, 27, 51, 52, 76, 77, 1e6].map((v) => shade(v, cut)), [0, 1, 1, 2, 2, 3, 3, 4, 4]);
  assert.deepEqual([1, 2, 3, 4].map((l) => days.filter((v) => shade(v, cut) === l).length), [26, 25, 25, 25]);
});

test('weeks that are quiet beside the year are a shade, not the empty cell', () => {
  const loud = Array.from({ length: 300 }, (_, i) => 1000 + i * 7), quiet = Array.from({ length: 65 }, (_, i) => 100 + i);
  const cut = cuts([...loud, ...quiet]);
  assert.ok(quiet.every((v) => shade(v, cut) === 1));
  assert.ok(loud.some((v) => shade(v, cut) === 4));
});
