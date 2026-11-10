/* The token calculator's arithmetic and the way it reads the price list: the same monthly tokens priced three ways
   (at the labs' list prices, on Hanzo Cloud, and on GPUs of the reader's own). Nothing here holds a price: it holds
   arithmetic and one fact, a month is 730 hours (8,760 a year over twelve). Every rate is read from the price list. */

/** The hours in a month: 8,760 a year over twelve. */
export const HOURS = (365 * 24) / 12;

export const NO_TOKENS = { input: 0, output: 0 };

/** What tokens (millions a month) cost at a rate (dollars per million), in dollars. */
export const cost = (t, r) => t.input * r.input + t.output * r.output;

/** The tokens a monthly spend buys at a rate, given the share of tokens that are output (0 to 1). Null where the rate prices nothing. */
export function bought(spend, share, r) {
  const each = (1 - share) * r.input + share * r.output;
  if (!(each > 0) || !(spend >= 0)) return null;
  const total = spend / each;
  return { input: total * (1 - share), output: total * share };
}

/** What GPUs on all month cost: how many, at an hourly rate each. */
export const gpus = (count, hourly) => count * hourly * HOURS;

/** One minus `of` over `against`: what `of` saves against `against`. Null when `against` is nothing. */
export const saves = (of, against) => (against > 0 ? 1 - of / against : null);

/** Where GPUs on all month cost what the same tokens cost at list: the monthly tokens, in millions, at the usage's own mix of input and output, and that as tokens a second around the clock. Null when the usage prices nothing. */
export function even(monthly, usage, listed) {
  const total = usage.input + usage.output;
  if (!(total > 0) || !(listed > 0)) return null;
  const millions = monthly / (listed / total);
  return { millions, perSecond: (millions * 1e6) / (HOURS * 3600) };
}

/** Dollars: a whole amount bare, whole above a hundred, and to the cent below. */
export const usd = (v) => `$${v.toLocaleString('en-US', v >= 100 || Number.isInteger(v) ? { maximumFractionDigits: 0 } : { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/** A rate as the price list states it: every digit it gives. */
export const rate = (v) => `$${v}`;

/** A share as a whole percent. */
export const percent = (v) => `${Math.round(v * 100)}%`;

/** The price list's date as an English reader dates it: 2026-11-09T01:51:19Z reads Nov 9, 2026. */
export const day = (iso) => (iso ? new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }) : '–');

/** Millions of tokens as a reader says them: 500 million, 1.5 billion. */
export const millions = (v) => (v >= 1000 ? `${(v / 1000).toLocaleString('en-US', { maximumFractionDigits: 2 })} billion` : `${v.toLocaleString('en-US', { maximumFractionDigits: 1 })} million`);

/** A number field's value, never below nothing. */
export const amount = (v) => {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : 0;
};

/* A lab's model the calculator can price: paid, with both rates, at its list price, and itself. A `:batch` row is the
   same model discounted, and a `~` row ("~anthropic/claude-opus-latest") is an alias of whichever model is the lab's
   latest; both repeat a row that is already offered. */
const priced = (m) => !m.isFree && m.pricing.input > 0 && m.pricing.output > 0 && !m.id.endsWith(':batch') && !m.id.startsWith('~');

/* The models a reader picks from: every model of the labs the price list prices. The list's featured ones lead,
   dearest first, and the page opens on the first of them; every other follows under its lab, A to Z. What is
   offered is not curated, so a lab's new model is here the day the price list lists it. */
export function labs(doc) {
  const paid = doc.thirdPartyModels.filter(priced);
  const featured = paid.filter((m) => m.featured).sort((a, b) => b.pricing.output - a.pricing.output || a.name.localeCompare(b.name));
  const rest = paid.filter((m) => !m.featured);
  const byLab = [...new Set(rest.map((m) => m.provider))]
    .sort((a, b) => a.localeCompare(b))
    .map((p) => [p, rest.filter((m) => m.provider === p).sort((a, b) => a.name.localeCompare(b.name))]);
  return { featured, byLab, all: [...featured, ...byLab.flatMap(([, ms]) => ms)] };
}

/** Ours to move the tokens to: the Enso models the price list prices. */
export const ours = (doc) => doc.hanzoModels.filter((m) => m.family === 'enso' && m.pricing?.input != null && m.pricing.output != null && !m.name.includes('/'));

/** A model's rates, dollars per million tokens. */
export const at = (m) => ({ input: m.pricing?.input ?? 0, output: m.pricing?.output ?? 0 });

/** What Hanzo bills a provider's model at, from the model list, where it lists it. */
export function billed(served, id) {
  const p = served?.find((s) => s.id === id)?.pricing;
  return p?.input_per_million != null && p.output_per_million != null ? { input: p.input_per_million, output: p.output_per_million } : null;
}

/* The three monthly figures for the reader's use. `rows` are { model, mTokIn, mTokOut, spend, share } (model = an id of
   `choices`), `mode` is 'tokens' or 'spend', `mine` the Enso model chosen, `team` the Team seat (or null), `people`
   the reader's headcount, `fleet` the GPU bill. */
export function totals({ rows, mode, choices, mine, team, people, count, hour, served }) {
  const usage = rows.map((r) => {
    const m = choices.find((c) => c.id === r.model) ?? choices[0];
    const tokens = mode === 'tokens' ? { input: r.mTokIn, output: r.mTokOut } : bought(r.spend, Math.min(100, r.share) / 100, at(m)) ?? NO_TOKENS;
    return { m, tokens };
  });
  const total = usage.reduce((t, u) => ({ input: t.input + u.tokens.input, output: t.output + u.tokens.output }), NO_TOKENS);
  const listed = usage.reduce((s, u) => s + cost(u.tokens, at(u.m)), 0);
  const onCloud = cost(total, at(mine));
  const seats = team && people > 0 && (team.maxMembers == null || people <= Number(team.maxMembers)) ? people * team.priceMonthly : null;
  const cloud = onCloud + (seats ?? 0);
  const fleet = gpus(count, hour);
  const point = even(fleet, total, listed);
  const kept = usage.every((u) => billed(served, u.m.id)) ? usage.reduce((s, u) => s + cost(u.tokens, billed(served, u.m.id)), 0) : null;
  return { usage, total, listed, onCloud, seats, cloud, fleet, point, kept };
}
