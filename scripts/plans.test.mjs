// lib/plans.js holds no price of its own: every figure is the billing API's (content/live/_pricing.json).
import test from 'node:test';
import assert from 'node:assert/strict';
import LIVE from '../content/live/_pricing.json' with { type: 'json' };
import { PLANS, SEATS, checkout } from '../lib/plans.js';

test('personal plans are the API rows, billed by the month only', () => {
  for (const k of ['go', 'pro', 'dev', 'max', 'ultra']) {
    const row = LIVE.plans[PLANS[k].id];
    assert.equal(PLANS[k].price, row.price, k);
    assert.equal(row.priceAnnual, null, `${k} offers no year`);
    assert.equal(row.interval, 'month', k);
  }
});

test('seats are the API rows', () => {
  assert.equal(SEATS.standard.month, LIVE.plans.team.price);
  assert.equal(SEATS.standard.monthAnnual, LIVE.plans.team.priceAnnual);
  assert.equal(SEATS.standard.min, LIVE.plans.team.minSeats);
  assert.equal(SEATS.enterprise.year, LIVE.plans.enterprise.price);
  assert.equal(SEATS.enterprise.min, LIVE.plans.enterprise.minSeats);
});

test('checkout is hanzo.app and returns there', () => {
  assert.match(checkout('go'), /^\/pay\/confirm\/card\?plan=go&returnUrl=https%3A%2F%2Fhanzo\.app%2Fchat$/);
});
