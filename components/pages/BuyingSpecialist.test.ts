// node components/pages/BuyingSpecialist.test.mjs — the specialist's written answers route and price as Hanzo's do
import assert from 'node:assert';
import { written, P } from './BuyingSpecialist.data.ts';
const team = written('We have a team of 10 developers', 'there');
assert.deepEqual(team.quote, { plan: 'Hanzo Team', seats: 10, monthlyTotal: 250, annualTotal: 2400, savings: 20, checkoutUrl: '/pay/cart?plan=team&interval=year&quantity=10' });
assert.match(team.content, /Mixed Setup \(7 Standard \+ 3 Premium\)\*\*: \*\*\$440\/mo\*\* billed annually \(\$5280\/year\)/);
assert.equal(written('Looking for dedicated VPC & HIPAA', 'there').quote?.seats, 20);
assert.equal(written('Compare Team vs Enterprise', 'there').quote?.plan, 'Enterprise'); // "enterprise" is checked first, as on hanzo.ai
assert.equal(written('Explain Standard vs Premium seats', 'there').quote, undefined);
assert.equal(written('We are 900 people', 'x').quote?.seats, 500);
// Enterprise is billed annually only: one rate, no monthly rate, no "SAVE n%" claim
assert.deepEqual(written('Compare Team vs Enterprise', 'x').quote, { plan: 'Enterprise', seats: 20, monthlyTotal: null, annualTotal: 4800, savings: null, checkoutUrl: '/enterprise/start' });
assert.match(written('hello', 'Ada').content, /^Great to meet you, Ada!/);
assert.equal(P.std / 12, 20);
console.log('buying specialist answers ok');
