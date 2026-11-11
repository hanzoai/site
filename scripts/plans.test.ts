// lib/plans.js holds no price of its own: every figure is the billing API's (content/live/_pricing.json).
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import LIVE from '../content/live/_pricing.json' with { type: 'json' };
import MODELS from '../content/live/_models.json' with { type: 'json' };
import { FLOOR, OFFERS, PARTNERS, PLANS, SEATS, charge, checkout, planItem, usd } from '../lib/plans.ts';
import { QA as PRICING } from '../components/pages/Pricing.faq.ts';
import { QA as AGENTS, KAI } from '../components/pages/AgentsPage.faq.ts';

const rows = Object.values(LIVE.plans);
const answer = (qa, q) => qa.find(([name]) => name === q)?.[1];
const jsonld = (route) => JSON.parse(fs.readFileSync(new URL(`../content/jsonld/${route}.json`, import.meta.url), 'utf8'));
// the code of a page or a band (a path under components/) without its comments: a figure in a comment is a note, one in a string is what a visitor reads
const code = (file) => fs.readFileSync(new URL(`../components/${file}`, import.meta.url), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');

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

test('a page that sells a plan types no price and no saving', () => {
  const rate = /\$\s?\d[\d,]*(?:\.\d+)?\s*(?:\/\s*(?:mo|month|seat|member|year|yr)\b|(?:a|per)\s+(?:month|year|seat|member)\b)/i;
  const saving = /−\s?\d+%|sav\w*\s+\d+%|\d+%\s+discount/i;
  for (const file of ['pages/Pricing.tsx', 'pages/Pricing.faq.ts', 'pages/Bot.tsx', 'pages/Enterprise.tsx', 'pages/AgentsPage.tsx', 'pages/AgentsPage.faq.ts', 'home/Pricing.tsx']) {
    const text = code(file);
    assert.ok(!rate.test(text), `${file} types a recurring price: it comes from lib/plans.js`);
    assert.ok(!saving.test(text), `${file} types a saving: it comes from SEATS.saving`);
  }
});

test('only Team has a monthly or yearly choice: the annual answer states its saving, and Enterprise is sold by the year', () => {
  const team = LIVE.plans.team;
  assert.equal(SEATS.saving, Math.round((1 - team.priceAnnual / team.price) * 100));
  assert.equal(LIVE.plans.enterprise.interval, 'year');
  const a = answer(PRICING, 'Do you offer annual billing?');
  assert.match(a, new RegExp(`Annual on the Team card .* saves ${SEATS.saving}% against paying monthly`));
  assert.match(a, /Enterprise is sold by the year/);
  assert.doesNotMatch(a, /92/);
});

test('the bot floor is Go and the team workspace floor is Pro', () => {
  assert.equal(FLOOR.bot, PLANS.go.price);
  assert.equal(FLOOR.team, PLANS.pro.price);
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

test('the agents cost answer names the price list\'s Kai rate and the cheapest plan for a person', () => {
  const kai = MODELS.models.find((m) => m.id === 'kai').pricing.input_per_million;
  assert.equal(KAI, '$' + kai);
  const a = answer(AGENTS, 'What does it cost after that?');
  assert.ok(a.includes(`Kai is ${KAI} per million input tokens`), a);
  assert.ok(a.includes(`start at ${usd(FLOOR.paid)} a month`), a);
});

test('the plan offers are the plan list\'s, and Enterprise is a year\'s price spread over twelve months', () => {
  const [month, year] = OFFERS.Enterprise.priceSpecification;
  assert.equal(month.price, LIVE.plans.enterprise.priceAnnual);
  assert.equal(year.price, LIVE.plans.enterprise.priceAnnual * 12);
  assert.equal(OFFERS.Team.priceSpecification[1].price, charge('team', 'year'));
  for (const p of rows.filter((x) => x.category === 'personal')) assert.equal(OFFERS[p.name].price, p.price, p.name);
});

test('the structured data holds no price and no answer of its own: the plan list and the page state them', () => {
  const [, offers, faq] = jsonld('pricing');
  assert.equal(offers['@type'], 'OfferCatalog');
  for (const o of offers.itemListElement) {
    assert.ok(OFFERS[o.name], `${o.name} is a plan`);
    assert.ok(!('price' in o) && !('priceSpecification' in o), `${o.name} has a typed price`);
  }
  for (const route of ['pricing', 'agents']) assert.ok(!jsonld(route).some((d) => d.mainEntity), `${route} types its FAQ`);
  assert.equal(faq['@type'], 'FAQPage');
});
