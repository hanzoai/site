// node --test components/pages/BetaApply.send.test.mjs: an application is sent as hanzo.ai sends it (portal.tsx `file`).
import test from 'node:test';
import assert from 'node:assert/strict';
import { filing, said } from './BetaApply.send.ts';

const asks = [{ id: 'builds' }, { id: 'cadence' }, { id: 'blurb' }, { id: 'company' }];

test('a program\'s answers go to its own form, one field per answered question', () => {
  const sent = filing('research', asks, { builds: ['Web apps', 'AI agents'], cadence: 'Every day', blurb: '  ', company: ' Acme ' }, 1794000000000);
  assert.equal(sent.url, 'https://api.hanzo.ai/v1/form/public/hanzo.research-apply/responses');
  assert.deepEqual(sent.body, {
    token: 'b_1794000000000',
    answers: [{ field: 'builds', text: 'Web apps, AI agents' }, { field: 'cadence', text: 'Every day' }, { field: 'company', text: 'Acme' }],
    hidden: { program: 'research', source: 'hanzo.ai/beta' },
  });
});

test('an answer is cut at 2,000 characters, and nothing answered sends nothing', () => {
  assert.equal(filing('beta', asks, { blurb: 'x'.repeat(2500) }).body.answers[0].text.length, 2000);
  assert.equal(filing('partner', asks, { builds: [], blurb: ' ' }), null);
  assert.equal(said(undefined), '');
});
