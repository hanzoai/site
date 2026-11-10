// The figures /open-source shows, as the page draws them: `sum` and `act` are lib/oss.mjs's combine(), the estate and
// GitHub as hanzo-inc/app's scripts/sync-oss.ts writes them. scripts/live.mjs calls shape() and writes snapshot.js.
import { cuts, shade } from '../../../lib/heat.ts';

const n = (x) => Number(x).toLocaleString('en-US');
const plural = (v, one, many) => `${n(v)} ${v === 1 ? one : many}`;
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const d2 = (x) => String(x).padStart(2, '0');
const at = (iso) => { const d = new Date(iso); return `${MON[d.getUTCMonth()]} ${d.getUTCDate()}, ${d2(d.getUTCHours())}:${d2(d.getUTCMinutes())}`; };
const day = (iso) => { const d = new Date(iso.length === 10 ? iso + 'T00:00:00Z' : iso); return `${MON[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`; };

// a year of commits a day as one character a day, Sunday-first weeks ('.' before the first day); levels as Hanzo draws
// them: 0 for a day without commits, then the quartiles of the days with commits
export function heat(daily, from, to) {
  const days = [];
  for (let t = Date.parse(from + 'T00:00:00Z'), end = Date.parse(to + 'T00:00:00Z'); t <= end; t += 864e5) days.push(daily[new Date(t).toISOString().slice(0, 10)] || 0);
  const cut = cuts(days);
  return '.'.repeat(new Date(from + 'T00:00:00Z').getUTCDay()) + days.map((v) => shade(v, cut)).join('');
}

export function shape({ sum, act }) {
  const KEYS = ['hanzo', 'lux', 'zoo'];
  const win = `Commits a day, from ${day(act.from)} to ${day(act.to)}`;
  const eco = KEYS.map((k) => {
    const g = sum.groups[k], a = act.groups[k], gh = 'https://github.com/' + g.lead;
    const tot = g.languages.reduce((s, l) => s + l.count, 0);
    const pc = (c) => ((c / tot) * 100).toFixed(1), five = g.languages.slice(0, 5);
    const top = five.map((l) => [l.name, pc(l.count)]), other = pc(tot - five.reduce((s, l) => s + l.count, 0));
    return {
      stats: [['Commits', n(g.commits.year), 'In the past year'], ['Merges', n(g.estate.merges), 'In the past year'], ['Commits', n(g.commits.week), 'In the past 7 days'],
        [`${g.checked} organizations`, n(g.repos), 'Original repositories'], ['GitHub stars', n(g.stars), 'as GitHub counts them'], ['GitHub forks', n(g.forks), 'as GitHub counts them']],
      heat: heat(a.daily, act.from, act.to),
      window: win,
      commits: a.latest.map((c) => [c.repo, c.message, at(c.at), c.url]),
      read: 'Forge listing · read ' + at(sum.forge.read),
      langs: [...top, ['Other', other]],
      langCap: `The primary language of each of ${n(g.repos)} original repositories, as GitHub reads it`,
      repos: g.top.map((r) => ({
        name: r.repo, desc: r.description || '', lang: r.language || '', stars: n(r.stars), forks: n(r.forks),
        av: r.faces.slice(0, 3).map((f) => f[0].toUpperCase()).join(''), more: r.faces.length > 3 ? '+' + (r.faces.length - 3) : '',
        people: plural(r.contributors, 'contributor', 'contributors'), commits: plural(r.commits, 'commit this year', 'commits this year'),
        pushed: 'Pushed ' + day(r.pushed), to: r.forge ?? 'https://github.com/' + r.repo, months: r.months,
      })),
      readTo: gh,
      statTo: ['https://git.hanzo.ai/explore/repos', 'https://git.hanzo.ai/explore/repos', 'https://git.hanzo.ai/explore/repos', gh, gh, gh],
    };
  });
  const orgs = KEYS.map((k) => {
    const g = sum.groups[k];
    return {
      key: k, name: g.name, sub: `${g.orgs.length} organizations · ${n(g.repos)} repositories`,
      orgs: g.orgs.map((o) => ({ name: o.name || o.login, login: o.login, repos: plural(o.repos, 'repository', 'repositories'),
        commits: o.commits ? plural(o.commits, 'commit this year', 'commits this year') : '', stars: n(o.stars), desc: o.description || '', months: o.months })),
    };
  });
  const groups = KEYS.map((k) => sum.groups[k]);
  return {
    eco, orgs,
    total: [[n(sum.estate.commits), 'Commits, past year'], [n(groups.reduce((s, g) => s + g.repos, 0)), 'Original public repositories'], [n(groups.reduce((s, g) => s + g.stars, 0)), 'GitHub stars']],
    hero: [[n(sum.groups.hanzo.repos), 'Original public repositories'], [n(sum.groups.hanzo.orgs.length), 'Organizations holding them'], [n(sum.groups.hanzo.commits.year), 'Commits, past year'], [n(sum.groups.hanzo.stars), 'GitHub stars']],
    read: sum.forge.read, from: act.from, to: act.to,
  };
}
