// node --test components/pages/ContactSales.send.test.mjs: /contact-sales files what hanzo.ai files (contact-sales/page.tsx).
import test from 'node:test';
import assert from 'node:assert/strict';
import { arrived, asked, code, lead, response } from './ContactSales.send.ts';

const v = { name: ' Ada ', email: ' ada@example.com ', company: ' Acme ', size: '50-249', need: 'Run it offline' };

test('the lead: the answers, where it came from, and nothing the visit did not carry', () => {
  const none = arrived('');
  assert.deepEqual(none, { campaign: null, coupon: null, program: null });
  assert.deepEqual(lead(v, { consent: '' }, none), { name: 'Ada', email: 'ada@example.com', company: 'Acme', size: '50-249', need: 'Run it offline', source: 'hanzo.ai/contact-sales', visit: { consent: '' } });
  const from = arrived('?utm_source=x&utm_medium=y&other=z&coupon=SAVE-10&program=enterprise&asked=seats,contract,nonsense&most=500');
  assert.deepEqual(from.campaign, { utm_source: 'x', utm_medium: 'y' });
  assert.equal(from.coupon, 'SAVE-10');
  const body = lead(v, {}, from);
  assert.equal(body.program, 'enterprise');
  assert.deepEqual(body.answers, [{ question: 'Does your team need any of these?', answer: 'More than 500 seats, Tailored contract (usage commitments, product bundling)' }]);
});

test('an offer code has a code\'s shape or is not sent; a kept one stands in only when the address has none', () => {
  assert.equal(code(' abc_1 '), 'abc_1');
  assert.equal(code('has space'), null);
  assert.equal(code('x'.repeat(33)), null);
  assert.equal(arrived('?coupon=bad code', 'KEPT').coupon, 'KEPT');
  assert.equal(asked('seats', 'abc'), '');
});

test('the form response: one answer for each question answered, the lead\'s id in the token', () => {
  assert.deepEqual(response(v, arrived(''), 'lead_01/AB', 9), {
    token: 'cs_lead01AB',
    answers: [{ field: 'name', text: 'Ada' }, { field: 'email', text: 'ada@example.com' }, { field: 'company', text: 'Acme' }, { field: 'size', text: '50-249' }, { field: 'need', text: 'Run it offline' }],
    hidden: { program: 'enterprise', source: 'hanzo.ai/contact-sales' },
  });
  assert.equal(response({ ...v, name: '', need: ' ' }, arrived(''), undefined, 9).token, 'cs_9');
  assert.equal(response({ ...v, name: '', need: ' ' }, arrived(''), undefined, 9).answers.length, 3);
});
