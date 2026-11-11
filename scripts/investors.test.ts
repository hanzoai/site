// Investors is the footer's only (Zach, hanzo-inc/app#204): no header menu lists /investors (lib/nav.js, which the bar's
// panels and the phone sheet draw, and the header's own markup in content.js), and the footer still does.
import test from 'node:test';
import assert from 'node:assert/strict';
import { NAV } from '../lib/nav.ts';
import C from '../content/shell.ts';

const investors = /^(https:\/\/hanzo\.ai)?\/investors\/?$/;

test('no header menu lists Investors: not the bar, its panels or the phone sheet', () => {
  const rows = Object.values(NAV).flatMap((cols) => cols.flatMap((c) => c.links));
  assert.ok(rows.length > 0);
  assert.deepEqual(rows.filter((l) => investors.test(l.href) || l.label === 'Investors'), []);
  assert.doesNotMatch(C.header, /href="(https:\/\/hanzo\.ai)?\/investors\/?"/);
});

test('the footer still links Investors', () => {
  assert.match(C.footer, /href="\/investors"[^>]*>Investors<\/a>/);
});
