// scripts/skill.mjs: the families read out of the API document, and /skill.md drawn from them.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { families, render, summarize } from './skill.mjs';

test('a package doc becomes one sentence about the family', () => {
  assert.equal(summarize('Package vector is vector search over your data. Import it as foo.'), 'Vector search over your data.');
  assert.equal(summarize('Package kms secrets, kept.'), 'Secrets, kept.');
  assert.equal(summarize(''), '');
});

test('families come from the document, counted by tag, keeping the held category', () => {
  const doc = {
    tags: [{ name: 'chat', description: 'Package chat is chat.' }, { name: 'new', description: 'A new one.' }],
    paths: { '/v1/chat': { get: { tags: ['chat'] }, post: { tags: ['chat'] }, parameters: [] }, '/v1/new': { get: { tags: ['new'] } } },
  };
  assert.deepEqual(families(doc, [{ name: 'chat', category: 'ai' }]), [
    { name: 'chat', category: 'ai', operations: 2, summary: 'Chat.' },
    { name: 'new', category: null, operations: 1, summary: 'A new one.' },
  ]);
});

test('/skill.md is the frame, then the families under their categories and Rest', () => {
  const md = render('# Hanzo\n\n> Summary.', {
    source: 'https://api.hanzo.ai/v1/openapi.json',
    fetched_at: '2026-11-09T00:00:00Z',
    categories: [{ id: 'ai', label: 'AI' }, { id: 'web3', label: 'Web3' }],
    families: [
      { name: 'chat', category: 'ai', operations: 2, summary: 'Chat.' },
      { name: 'misc', category: 'gone', operations: 1, summary: '' },
    ],
  });
  assert.ok(md.startsWith('# Hanzo\n\n> Summary.\n\n## Families'));
  assert.match(md, /2 families, 3 operations, read from https:\/\/api\.hanzo\.ai\/v1\/openapi\.json on 2026-11-09\./);
  assert.match(md, /### AI\n\n- `\/v1\/chat` — Chat\. \(2 operations\)\n/);
  assert.match(md, /### Rest\n\n- `\/v1\/misc` \(1 operation\)\n/);
  assert.doesNotMatch(md, /### Web3/);
});

test('the committed frame and snapshot are usable', () => {
  const frame = fs.readFileSync(new URL('../public/skill.md', import.meta.url), 'utf8');
  assert.ok(frame.startsWith('# Hanzo\n'));
  assert.match(frame, /^> /m);
  assert.doesNotMatch(frame, /## Families/);
  const snap = JSON.parse(fs.readFileSync(new URL('../content/live/_families.json', import.meta.url), 'utf8'));
  assert.ok(snap.families.length > 50 && snap.categories.length > 5);
});
