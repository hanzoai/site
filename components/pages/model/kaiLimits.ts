// The Kai guide's request limits as one function (hanzo.ai/kai/guide, 7 Nov 2026). Used by the guide's request checker;
// scripts/kai-limits.test.mjs holds it to the guide's sentences. `code` and `flag` are the checker's own keys; what the
// page shows is `big`, `tag` and `why`, and every one of those is the guide's own words (no figure is derived).
export const TRAINED = 1024, MAXSTATE = 32768, MAXQ = 100;
export function check(m, tok, q) {
  if (q > MAXQ) return { code: 422, flag: '422', big: '422', tag: 'Questions', why: 'Up to 100 a request; 101 is refused with 422.' };
  if (tok > MAXSTATE) return { code: 422, flag: 'state_too_long', big: '422', tag: 'state_too_long', why: 'Past 32,768 the answer is 422' };
  if (m === 0 && tok > TRAINED) return { code: 200, flag: 'routing.extrapolated: true', big: 'kai-1.3', tag: 'routing.extrapolated: true', why: 'kai-1.3, the default, was trained on 1,024 tokens of state beside each question.' };
  if (m === 0) return { code: 200, flag: 'routing: kai-1.3', big: 'kai-1.3', tag: 'model: "kai"', why: 'The model id kai answers from kai-1.3, the default.' };
  return { code: 200, flag: 'no extrapolated mark', big: 'kai-1.4', tag: 'Model', why: 'kai-1.4 was trained on long states and marks no read up to 32,768 extrapolated.' };
}
