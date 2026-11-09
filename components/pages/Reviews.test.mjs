// node --test components/pages/Reviews.test.mjs: the reviews are hanzo.ai's nine, a visitor's own is made and kept the way
// hanzo.ai makes it, and a category shows what it says.
import test from 'node:test';
import assert from 'node:assert/strict';
import { CATEGORIES, PRODUCTS, REVIEWS, entry, kept, visible } from './Reviews.data.js';

const answers = { name: ' Ada Lovelace ', role: '', company: '  ', product: 'Hanzo Cloud', rating: 4, title: ' Fast ', body: ' It works. ' };

test('nine reviews, five products, and every review is of one of them', () => {
  assert.equal(REVIEWS.length, 9);
  assert.deepEqual(CATEGORIES, ['All', ...PRODUCTS]);
  assert.ok(REVIEWS.every((r) => PRODUCTS.includes(r.product) && r.rating === 5 && r.verified));
  assert.equal(new Set(REVIEWS.map((r) => r.id)).size, 9);
});

test('a category shows its own, a visitor\'s review leads, and All shows every one', () => {
  assert.deepEqual(PRODUCTS.map((p) => visible([], p).length), [2, 2, 2, 2, 1]);
  assert.equal(visible([], 'All').length, 9);
  const mine = entry(answers, 7);
  assert.equal(visible([mine], 'All')[0], mine);
  assert.equal(visible([mine], 'Hanzo Cloud')[0], mine);
  assert.equal(visible([mine], 'Enterprise').length, 1);
});

test('a visitor\'s review: trimmed, a role and company defaulted as hanzo.ai defaults them, and refused without a name, headline or review', () => {
  assert.deepEqual(entry(answers, 7), { id: 'user-7', author: 'Ada Lovelace', role: 'Builder', company: 'Community', product: 'Hanzo Cloud', rating: 4, title: 'Fast', body: 'It works.', date: 'Just now', verified: true });
  assert.equal(entry({ ...answers, name: '   ' }), null);
  assert.equal(entry({ ...answers, title: '' }), null);
  assert.equal(entry({ ...answers, body: ' \n ' }), null);
});

test('what localStorage holds comes back only if it is a list', () => {
  assert.deepEqual(kept(null), []);
  assert.deepEqual(kept('{not json'), []);
  assert.deepEqual(kept('{"a":1}'), []);
  assert.deepEqual(kept(JSON.stringify([entry(answers, 7)])), [entry(answers, 7)]);
});
