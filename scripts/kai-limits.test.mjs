// The Kai guide's request checker must say what the guide says. Usage: node scripts/kai-limits.test.mjs
import assert from 'node:assert/strict';
import { check } from '../components/pages/model/kaiLimits.js';

assert.equal(check(0, 800, 3).code, 200);                                   // within kai-1.3's 1,024 trained tokens
assert.equal(check(0, 3982, 3).flag, 'routing.extrapolated: true');         // the guide's 3,982-token state on kai
assert.equal(check(1, 3982, 3).flag, 'no extrapolated mark');               // kai-1.4: long states, no mark up to 32,768
assert.equal(check(1, 32768, 3).code, 200);
assert.deepEqual([check(1, 32769, 3).code, check(1, 32769, 3).flag], [422, 'state_too_long']); // past 32,768
assert.equal(check(0, 500, 100).code, 200);                                 // up to 100 questions
assert.equal(check(0, 500, 101).code, 422);                                 // 101 is refused with 422
console.log('kai limits: OK');
