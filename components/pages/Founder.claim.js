/* The Founder Program claim, as hanzo.ai sends it: a sales lead and a form response, both checked first. */
import { ORGS } from './Bounty.github.js';

export const SUPPORT = 'support@hanzo.ai';
const PULL = new RegExp(`^https://github\\.com/(${ORGS.join('|')})/[A-Za-z0-9._-]+/pull/\\d+/?$`);

// fields -> { ok, gh, pull, need, mail, lead, form }; nothing is sent unless ok
export function claim({ email = '', name = '', github = '', pull = '' }) {
  const e = email.trim(), n = name.trim(), gh = github.trim().replace(/^@/, ''), p = pull.trim();
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) && /^[A-Za-z0-9-]{1,39}$/.test(gh) && PULL.test(p);
  const need = `Founder Program claim. GitHub: @${gh}. Merged pull request: ${p}`;
  return {
    ok, gh, pull: p, need,
    mail: `mailto:${SUPPORT}?subject=${encodeURIComponent('Founder Program claim')}&body=${encodeURIComponent(need)}`,
    lead: { email: e, name: n || gh, source: 'hanzo.ai/founder', need },
    form: { token: `fn_${Date.now()}`, answers: [{ field: 'email', text: e }, { field: 'name', text: n || gh }, { field: 'github', text: gh }, { field: 'pull', text: p }], hidden: { source: 'hanzo.ai/founder' } },
  };
}
