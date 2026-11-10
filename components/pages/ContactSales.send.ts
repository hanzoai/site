/* What /contact-sales files (hanzo-inc/app contact-sales/page.tsx): one sales lead (POST /v1/marketing/leads) and the
   same answers as a response to the hanzo.contact-sales form (POST /v1/form/public/hanzo.contact-sales/responses), both
   on api.hanzo.ai. The lead also carries what the visit arrived with: the utm_* tags, an offer code, and the needs an
   Enterprise order carried here (lib/order `sales`: the keys of the needs, never their words). */
export const API = 'https://api.hanzo.ai';

const SLUG = 'enterprise';
const QUESTION = 'Does your team need any of these?';
const CODE = /^[A-Za-z0-9_-]{1,32}$/;
const UTM = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];

/* an offer code from the address (or the one this tab kept), when it has a code's shape */
export const code = (raw) => { const c = (raw ?? '').trim(); return CODE.test(c) ? c : null; };

/* the needs an order ticked, as the lead says them, from the fixed list: no other text in an address is filed */
export function asked(keys, most) {
  const ticked = (keys ?? '').split(',').filter((k) => k === 'seats' || k === 'contract');
  const n = Number(most);
  const m = Number.isInteger(n) && n > 0 && n <= 1_000_000 ? n : null;
  return ticked.flatMap((k) => (k === 'seats' && m !== null ? [`More than ${m} seats`] : k === 'contract' ? ['Tailored contract (usage commitments, product bundling)'] : [])).join(', ');
}

/* what the address carries into the lead: the campaign, the offer code, and an Enterprise order's needs */
export function arrived(search, kept = null) {
  const q = new URLSearchParams(search);
  const campaign = Object.fromEntries(UTM.filter((k) => q.get(k)).map((k) => [k, q.get(k)]));
  const coupon = code(q.get('coupon')) ?? code(kept);
  const program = q.get('program') === SLUG ? { program: SLUG, answers: asked(q.get('asked'), q.get('most')) ? [{ question: QUESTION, answer: asked(q.get('asked'), q.get('most')) }] : [] } : null;
  return { campaign: Object.keys(campaign).length ? campaign : null, coupon, program };
}

/* the lead's body */
export function lead({ name, email, company, size, need }, visit, from) {
  return {
    name: name.trim(), email: email.trim(), company: company.trim(), size, need,
    source: 'hanzo.ai/contact-sales', visit,
    ...(from.campaign ? { campaign: from.campaign } : {}),
    ...(from.coupon ? { coupon: from.coupon } : {}),
    ...(from.program ? from.program : {}),
  };
}

/* the form response's body: one answer for each question that was answered, under the lead's own id when there is one */
export function response({ name, email, company, size, need }, from, id, now = Date.now()) {
  const text = (field, v) => (v.trim() ? [{ field, text: v.trim() }] : []);
  return {
    token: 'cs_' + (id || `${now}`).replace(/[^A-Za-z0-9]/g, '').slice(0, 30),
    answers: [...text('name', name), { field: 'email', text: email.trim() }, ...text('company', company), ...text('size', size), ...text('need', need)],
    hidden: { program: from.program ? from.program.program : 'enterprise', source: 'hanzo.ai/contact-sales' },
  };
}
