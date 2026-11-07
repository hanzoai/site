// The Kai guide's request limits as one function (hanzo.ai/kai/guide, 7 Nov 2026). Used by the guide's request checker;
// scripts/kai-limits.test.mjs holds it to the guide's sentences.
export const TRAINED = 1024, MAXSTATE = 32768, MAXQ = 100;
export function check(m, tok, q) {
  if (q > MAXQ) return { code: 422, flag: '422', why: 'Up to 100 a request; 101 is refused with 422.' };
  if (tok > MAXSTATE) return { code: 422, flag: 'state_too_long', why: 'Past 32,768 the answer is 422.' };
  if (m === 0 && tok > TRAINED) return { code: 200, flag: 'routing.extrapolated: true', why: 'kai-1.3, the default, was trained on 1,024 tokens of state; past that the read is unreliable.' };
  if (m === 0) return { code: 200, flag: 'routing: kai-1.3', why: 'Within the 1,024 tokens of state kai-1.3 was trained on.' };
  return { code: 200, flag: 'no extrapolated mark', why: 'kai-1.4 was trained on long states and marks no read up to 32,768 extrapolated.' };
}
