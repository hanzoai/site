// lib/plans.js holds no price of its own: every figure is the billing API's (content/live/_pricing.json).
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import LIVE from '../content/live/_pricing.json' with { type: 'json' };
import { FLOOR, PARTNERS, PLANS, SEATS, charge, checkout, planItem, usd } from '../lib/plans.js';

const rows = Object.values(LIVE.plans);
// the code of a page without its comments: a figure in a comment is a note, one in a string is what a visitor reads
const code = (file) => fs.readFileSync(new URL(`../components/pages/${file}`, import.meta.url), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');

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

test('a plan is named on the analytics tags by its catalog slug and what the term charges', () => {
  assert.deepEqual(planItem('go', 'month', 'individual'), { item_id: 'go', item_name: LIVE.plans.go.name, item_category: 'individual', price: LIVE.plans.go.price });
  assert.equal(charge('free', 'month'), 0);
  assert.equal(charge('go', 'year'), 0, 'a personal plan sells no year');
  assert.equal(charge('team', 'year'), Math.round(LIVE.plans.team.priceAnnual * 1200) / 100);
  assert.equal(planItem('api-payg', 'month', 'api').item_name, 'Pay as you go');
});

test('a page that sells a plan types no price', () => {
  const rate = /\$\s?\d[\d,]*(?:\.\d+)?\s*(?:\/\s*(?:mo|month|seat|member|year|yr)\b|(?:a|per)\s+(?:month|year|seat|member)\b)/i;
  const saving = /−\s?\d+%|sav\w*\s+\d+%|\d+%\s+discount/i;
  for (const file of ['Bot.jsx', 'Enterprise.jsx']) {
    const text = code(file);
    assert.ok(!rate.test(text), `${file} types a recurring price: it comes from lib/plans.js`);
    assert.ok(!saving.test(text), `${file} types a saving: it comes from SEATS.saving`);
  }
});

test('the bot floor is the cheapest plan with a bot', () => {
  assert.equal(FLOOR.bot, Math.min(...rows.filter((p) => p.category === 'personal' && p.bots).map((p) => p.price)));
  assert.equal(FLOOR.paid, Math.min(...rows.filter((p) => p.category === 'personal' && p.price > 0).map((p) => p.price)));
  assert.equal(PLANS.ultra.bots, LIVE.plans.ultra.bots);
});

test('the partners are the white-label and agency plans', () => {
  const agency = rows.filter((p) => p.category === 'agency');
  assert.equal(PARTNERS.label.price, LIVE.plans['white-label'].price);
  assert.deepEqual(PARTNERS.agency.names, agency.map((p) => p.name));
  assert.equal(PARTNERS.agency.from, Math.min(...agency.map((p) => p.price)));
  assert.equal(usd(4999), '$4,999');
});
