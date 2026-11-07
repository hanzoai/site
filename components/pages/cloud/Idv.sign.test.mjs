// node components/pages/cloud/Idv.sign.test.mjs
import assert from 'node:assert/strict';
import { hmac, same, verify } from './Idv.sign.mjs';
// RFC 4231 test case 2
assert.equal(await hmac('Jefe', 'what do ya want for nothing?'), '5bdcc146bf60754e6a042426089575c75a003f089d2739839dec58b964ec3843');
const sig = await hmac('k', '{"status":"rejected"}');
assert.equal(await verify('k', '{"status":"rejected"}', sig), 'accepted');
assert.equal(await verify('k', '{"status":"rejected"}', sig.toUpperCase()), 'accepted', 'hex case does not matter');
assert.equal(await verify('k', '{"status":"approved"}', sig), 'turned away', 'a changed body fails');
assert.equal(await verify('', '{"status":"rejected"}', sig), 'refused', 'an empty secret is a refusal');
assert.equal(same('ab', 'abc'), false);
console.log('Idv.sign: OK');
