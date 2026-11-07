// node components/pages/Founder.claim.test.mjs — a claim is sent only with a real email, a GitHub name and a Hanzo PR
import assert from 'node:assert';
import { claim } from './Founder.claim.js';
const good = claim({ email: 'test@example.com', name: '', github: '@octocat', pull: 'https://github.com/hanzoai/ui/pull/1' });
assert.equal(good.ok, true);
assert.equal(good.lead.name, 'octocat');
assert.equal(good.need, 'Founder Program claim. GitHub: @octocat. Merged pull request: https://github.com/hanzoai/ui/pull/1');
assert.equal(claim({ email: 'test@example.com', github: 'octocat', pull: 'https://github.com/evil/ui/pull/1' }).ok, false);
assert.equal(claim({ email: 'test@example.com', github: 'octocat', pull: 'https://github.com/hanzoai/ui/issues/1' }).ok, false);
assert.equal(claim({ email: 'nope', github: 'octocat', pull: 'https://github.com/hanzo-js/x/pull/9/' }).ok, false);
assert.equal(claim({ email: 'a@b.co', github: 'bad name', pull: 'https://github.com/hanzo-js/x/pull/9/' }).ok, false);
assert.match(good.mail, /^mailto:support@hanzo\.ai\?subject=Founder%20Program%20claim&body=/);
assert.equal(claim({ email: 'a@b.co', github: 'octocat', pull: 'github.com/hanzoai/ui/pull/1/files' }).pull, 'https://github.com/hanzoai/ui/pull/1');
assert.equal(claim({ email: 'a@b.co', github: 'octocat', pull: 'https://github.com/hanzoai/ui/pull/1#discussion_r1' }).ok, true);
assert.deepEqual(claim({ email: 'x', github: 'octocat', pull: 'nope' }).bad, { email: true, github: false, pull: true });
console.log('founder claim ok');
