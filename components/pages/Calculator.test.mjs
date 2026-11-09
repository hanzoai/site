// node --test components/pages/Calculator.test.mjs: /calculator's model gives the analyst's figures at the reference
// deployment ($613k of software, $941k a year, 107 vendors), moves the way its formulas say when a control moves, and the
// token calculator's arithmetic and readers work as hanzo.ai's do.
import test from 'node:test';
import assert from 'node:assert/strict';
import { AI_ROW, AI_DEFAULTS, COV_CYCLE, FTE, REF_D, REF_E, ROWS, VENDORS, WEIGHT, aiSaving, dollars, initial, model, money, nextCov } from './Calculator.data.js';
import { HOURS, bought, cost, even, gpus, labs, ours, billed, percent, rate, saves, totals, usd, millions, day, amount } from './calculator/savings.js';
import { readPricing, readSummary, readServed } from './calculator/sources.mjs';

const at = (over = {}) => model({ ...initial(), ...over });

test('the reference deployment reproduces the analyst figures exactly', () => {
  const m = at();
  assert.equal(ROWS.length, 42);
  assert.equal(VENDORS.length, 107);
  assert.equal(m.vendorCount, 107);
  assert.equal(m.D, 30);
  assert.equal(m.software, 613_000); // every factor is 1 at 100 employees and 30% engineers; the vector store counts half
  assert.equal(m.infra, 108_000);
  assert.equal(m.glue, 330_000);
  assert.equal(m.ops, 110_000);
  assert.equal(m.gross, 1_051_000);
  assert.equal(m.runRate, 941_000);
  assert.equal(m.hasDeductions, false); // the fully adjusted tier stays incomplete until a deduction is entered
  assert.equal(money(m.gross), '$1.051M');
  assert.equal(money(m.runRate), '$941k');
  assert.equal(money(m.adjusted * 3), '$2.823M');
  assert.equal(money(m.software), '$613k');
  assert.equal(money(m.infra), '$108k');
  assert.equal(money(m.glue), '$330k');
  assert.equal(money(m.ops), '$110k');
  assert.equal(dollars(m.runRate / 100), '$9,410');
  assert.equal((m.runRate / FTE).toFixed(1), '4.3');
  assert.equal(dollars(m.software / REF_E), '$6,130'); // the market-context line: $613k works out to $6,130 an employee
});

test('the software total is the rows at their weights', () => {
  const raw = ROWS.reduce((s, r) => s + r.k, 0);
  assert.equal(raw, 617);
  assert.equal(raw - ROWS.find((r) => r.name === 'Vector store').k * (1 - WEIGHT.partial), 613);
  assert.equal(ROWS[AI_ROW].name, 'LLM inference & routing');
  assert.ok(ROWS.every((r) => VENDORS.some(([, c]) => c === ROWS.indexOf(r)))); // every line has a vendor that maps to it
  assert.ok(VENDORS.every(([, c]) => c >= 0 && c < ROWS.length));
});

test('rows scale on their billing basis: seats on employees, engineers on engineers, platform fees not at all', () => {
  const one = (name, over) => at(over).value[ROWS.findIndex((r) => r.name === name)];
  assert.equal(one('SSO & workforce identity', { E: 200 }), 20_000); // per seat
  assert.equal(one('Secrets & KMS', { E: 200, Dp: 60 }), 11_000 * (120 / REF_D)); // per engineer: 200 x 60% = 120
  assert.equal(one('Customer identity (product)', { E: 2000, Dp: 60 }), 14_000); // platform fee
  assert.equal(at({ E: 200, Dp: 60 }).D, 120);
});

test('a type-over beats the scaled default, and the AI row takes the computed figure only when asked', () => {
  const i = ROWS.findIndex((r) => r.name === 'CRM');
  assert.equal(at({ price: { [i]: 40 } }).value[i], 40_000);
  assert.equal(at({ price: { [i]: 40 } }).software, 613_000 - 27_000 + 40_000);
  const ai = at({ aiOn: true });
  assert.equal(ai.value[AI_ROW], ai.saving);
  assert.equal(at({ aiOn: false }).value[AI_ROW], 36_000);
});

test('coverage weights and the click cycle', () => {
  assert.deepEqual(COV_CYCLE.map((c) => WEIGHT[c]), [1, 0.5, 0.25, 0]);
  assert.equal(nextCov('full'), 'partial');
  assert.equal(nextCov('roadmap'), 'full');
  const cov = ROWS.map((r) => r.cov);
  cov[0] = 'roadmap';
  assert.equal(at({ cov }).software, 613_000 - 10_000);
  cov[0] = 'experimental';
  assert.equal(at({ cov }).software, 613_000 - 10_000 * 0.75);
});

test('a category counts while any of its vendors is selected; the counter counts vendors', () => {
  const von = VENDORS.map(([, c]) => c !== 0); // Okta, Auth0 and JumpCloud off: the SSO line goes
  const m = at({ von });
  assert.equal(m.vendorCount, 104);
  assert.equal(m.on[0], false);
  assert.equal(m.software, 603_000);
  const some = VENDORS.map(([name]) => name !== 'Okta'); // one of three off: the line stays
  assert.equal(at({ von: some }).software, 613_000);
  assert.equal(at({ von: VENDORS.map(() => false) }).software, 0);
});

test('the controls and the three deductions follow the formulas', () => {
  const m = at({ cloud: 100, infraPct: 50, glueFte: 2, opsFte: 1 });
  assert.equal(m.infra, 100 * 1000 * 12 * 0.5);
  assert.equal(m.glue, 2 * FTE);
  assert.equal(m.ops, FTE);
  assert.equal(m.gross, 613_000 + 600_000 + 440_000);
  assert.equal(m.runRate, m.gross - FTE);
  const d = at({ retained: 50_000, fee: 20_000, migration: 300_000, migYears: 3 });
  assert.equal(d.hasDeductions, true);
  assert.equal(d.amortized, 100_000);
  assert.equal(d.adjusted, 941_000 - 50_000 - 20_000 - 100_000);
  assert.equal(at({ migration: 90_000, migYears: 1 }).amortized, 90_000);
  assert.equal(at({ retained: 1 }).hasDeductions, true);
  assert.equal(money(-12_345), '−$12k');
  assert.equal(money(1_000_000), '$1M');
  assert.equal(money(10_000_000), '$10M');
});

test('the AI sub-calculator never counts frontier pass-through, and its defaults follow the formula', () => {
  assert.equal(aiSaving({ ...AI_DEFAULTS, frontier: 100 }), 0);
  assert.equal(aiSaving({ ...AI_DEFAULTS, spend: 0 }), 0);
  const base = aiSaving(AI_DEFAULTS);
  // 10k a month = 120k a year; 25% frontier stays; 90k addressable; 60% routed = 54k; half hosted
  const routed = 120_000 * 0.75 * 0.6;
  const zen = 0.12 * (70 / 70) * (1 - 0.25 * 0.4);
  assert.ok(Math.abs(base - (routed * 0.5 * (1 - zen) + routed * 0.5 * 0.55) * 0.9) < 1e-6);
  assert.ok(aiSaving({ ...AI_DEFAULTS, gpuUtil: 35 }) < base); // low utilization raises the self-hosted unit cost
  assert.ok(aiSaving({ ...AI_DEFAULTS, batch: 100 }) > base); // batch work lowers it
});

// ---- the token calculator ----
test('token arithmetic: list, spend to tokens, GPUs and where they break even', () => {
  assert.equal(HOURS, 730);
  assert.equal(cost({ input: 500, output: 50 }, { input: 4, output: 20 }), 3000);
  const t = bought(5000, 0.1, { input: 4, output: 20 });
  assert.ok(Math.abs(cost(t, { input: 4, output: 20 }) - 5000) < 1e-9);
  assert.ok(Math.abs(t.output / (t.input + t.output) - 0.1) < 1e-12);
  assert.equal(bought(100, 0.5, { input: 0, output: 0 }), null);
  assert.equal(gpus(1, 3.48), 3.48 * 730);
  assert.equal(usd(gpus(1, 3.48)), '$2,540');
  assert.equal(saves(1500, 3000), 0.5);
  assert.equal(saves(10, 0), null);
  assert.equal(percent(0.4987), '50%');
  const e = even(2540.4, { input: 500, output: 50 }, 3000);
  assert.equal(millions(e.millions), '465.7 million');
  assert.equal(Math.round(e.perSecond), 177);
  assert.equal(even(1, { input: 0, output: 0 }, 0), null);
  assert.equal(usd(1498), '$1,498');
  assert.equal(usd(3.5), '$3.50');
  assert.equal(usd(12), '$12');
  assert.equal(rate(0.33), '$0.33');
  assert.equal(millions(1500), '1.5 billion');
  assert.equal(day('2026-11-09T01:51:19.239Z'), 'Nov 9, 2026');
  assert.equal(amount('-3'), 0);
  assert.equal(amount('abc'), 0);
  assert.equal(amount('12.5'), 12.5);
});

const doc = {
  hanzoModels: [
    { name: 'enso', fullName: 'Enso', family: 'enso', pricing: { input: 0.33, output: 1.65 } },
    { name: 'enso-flash', family: 'enso', pricing: { input: 0.1, output: 0.5 } },
    { name: 'enso/auto', family: 'enso', pricing: { input: 1, output: 1 } },
    { name: 'zen-embedding', family: 'zen', pricing: { input: 0.01, output: 0.01 } },
  ],
  thirdPartyModels: [
    { id: 'a/low', name: 'A: Low', provider: 'A', isFree: false, featured: true, pricing: { input: 1, output: 2 } },
    { id: 'a/high', name: 'A: High', provider: 'A', isFree: false, featured: true, pricing: { input: 4, output: 20 } },
    { id: 'a/high:batch', name: 'A: High batch', provider: 'A', isFree: false, pricing: { input: 2, output: 10 } },
    { id: '~a/latest', name: 'A latest', provider: '~a', isFree: false, pricing: { input: 4, output: 20 } },
    { id: 'b/free', name: 'B: Free', provider: 'B', isFree: true, pricing: { input: 0, output: 0 } },
    { id: 'c/zed', name: 'C: Zed', provider: 'C', isFree: false, pricing: { input: 3, output: 9 } },
    { id: 'c/alpha', name: 'C: Alpha', provider: 'C', isFree: false, pricing: { input: 3, output: 9 } },
  ],
  gpu: [{ gpu: '1x H100', vram: '80 GB', price: 3.48 }],
};

test('the models offered: featured dearest first, then each lab A to Z; batch, alias and free rows are left out', () => {
  const o = labs(doc);
  assert.deepEqual(o.featured.map((m) => m.id), ['a/high', 'a/low']);
  assert.deepEqual(o.byLab.map(([lab, ms]) => [lab, ms.map((m) => m.id)]), [['C', ['c/alpha', 'c/zed']]]);
  assert.deepEqual(o.all.map((m) => m.id), ['a/high', 'a/low', 'c/alpha', 'c/zed']);
  assert.deepEqual(ours(doc).map((m) => m.name), ['enso', 'enso-flash']); // Enso only, and not a routed alias
});

test('the three monthly figures for the example the page opens with', () => {
  const choices = labs(doc).all;
  const mine = ours(doc)[0];
  const rows = [{ model: 'a/high', mTokIn: 500, mTokOut: 50, spend: 5000, share: 10 }];
  const team = { name: 'Team', priceMonthly: 25, maxMembers: 100 };
  const served = [{ id: 'a/high', pricing: { input_per_million: 4.2, output_per_million: 21 } }];
  const t = totals({ rows, mode: 'tokens', choices, mine, team, people: 50, count: 1, hour: 3.48, served });
  assert.equal(t.listed, 3000);
  assert.ok(Math.abs(t.onCloud - (500 * 0.33 + 50 * 1.65)) < 1e-9);
  assert.equal(t.seats, 1250);
  assert.equal(usd(t.cloud), '$1,498');
  assert.equal(usd(t.fleet), '$2,540');
  assert.equal(usd(t.kept), '$3,150'); // the same tokens at the rates Hanzo bills the lab's model
  assert.equal(totals({ rows, mode: 'tokens', choices, mine, team, people: 50, count: 1, hour: 3.48, served: null }).kept, null);
  assert.equal(totals({ rows, mode: 'tokens', choices, mine, team, people: 101, count: 1, hour: 3.48, served }).seats, null); // past Team's members
  assert.equal(totals({ rows, mode: 'tokens', choices, mine, team: null, people: 50, count: 1, hour: 3.48, served }).seats, null);
  const spend = totals({ rows, mode: 'spend', choices, mine, team, people: 50, count: 1, hour: 3.48, served });
  assert.ok(Math.abs(spend.listed - 5000) < 1e-6);
  assert.deepEqual(billed(served, 'a/low'), null);
});

// ---- the readers, against the shapes the API answers ----
const get = (map) => async (url) => {
  if (!(url in map)) throw new Error('404 ' + url);
  return map[url];
};
const card = { rates: [{ name: 'x' }], components: [], windows: [] };

test('the readers keep what the page draws and refuse an answer that is not the document', async () => {
  const price = await readPricing(get({ 'https://api.hanzo.ai/v1/pricing': { updated: '2026-11-09T01:51:19.239Z', tariff: card, hanzoModels: doc.hanzoModels, thirdPartyModels: doc.thirdPartyModels, summary: {}, infrastructure: { gpu: doc.gpu } } }));
  assert.equal(price.updated, '2026-11-09T01:51:19.239Z');
  assert.deepEqual(price.gpu, doc.gpu);
  await assert.rejects(readPricing(get({ 'https://api.hanzo.ai/v1/pricing': { tariff: { rates: [] }, hanzoModels: [], thirdPartyModels: [], summary: {} } })), /unexpected data/);
  await assert.rejects(readPricing(get({})), /404/);
  assert.deepEqual(await readSummary(get({ 'https://api.hanzo.ai/v1/pricing/summary': { totalModels: 414, providers: {} } })), { totalModels: 414 });
  await assert.rejects(readSummary(get({ 'https://api.hanzo.ai/v1/pricing/summary': { providers: {} } })), /unexpected data/);
  const served = await readServed(get({ 'https://api.hanzo.ai/v1/models': { data: [{ id: 'm', pricing: { input_per_million: 1, output_per_million: 2, prompt: 'x' } }, { id: 'n' }] } }));
  assert.deepEqual(served, [{ id: 'm', pricing: { input_per_million: 1, output_per_million: 2 } }, { id: 'n', pricing: { input_per_million: null, output_per_million: null } }]);
  await assert.rejects(readServed(get({ 'https://api.hanzo.ai/v1/models': { data: [] } })), /unexpected data/);
});
