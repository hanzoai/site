// lib/heat.mjs and components/home/spark.js: the shade a day's commits earn, and the bars the open-source band draws.
import test from 'node:test';
import assert from 'node:assert/strict';
import { cuts, shade } from '../lib/heat.mjs';
import spark, { bars } from '../components/home/spark.js';

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

test('bars are as tall as their share of the tallest, at least 4%, and none is a line one pixel tall', () => {
  const h = (html) => [...html.matchAll(/style="height:([^"]+)"/g)].map((m) => m[1]);
  assert.deepEqual(h(bars([0, 5, 10])), ['1px', '50%', '100%']);
  assert.deepEqual(h(bars([1, 100])), ['4%', '100%']);
  assert.match(bars([0, 5]), /x-bar none"[^>]*height:1px/);
  assert.equal(bars([]), '');
  const html = spark([3, 6], 'Commits a day over the past 7 days', 28);
  assert.match(html, /^<div aria-label="Commits a day over the past 7 days" [^>]*data-slot="sparkline" role="img" style="height:28px">/);
});
