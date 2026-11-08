// node components/pages/openSource/read.mjs   (NODE_USE_ENV_PROXY=1 behind a proxy)
// Writes components/pages/openSource/snapshot.js: the figures hanzo.ai/open-source shows, read from the page Hanzo
// deployed. Hanzo's build reads https://api.hanzo.ai/v1/git/activity and GitHub once and bakes the result into the page
// (it makes no request for them in the browser), so the snapshot is taken from that build: the same read, the same
// figures, the same day. On a failure the last good snapshot stays and the run exits 0.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), 'snapshot.js');
const PAGE = 'https://hanzo.ai/open-source';
const get = async (u) => { const r = await fetch(u, { headers: { 'user-agent': 'hanzo-site-live' }, signal: AbortSignal.timeout(30000) }); if (!r.ok) throw new Error(r.status + ' from ' + u); return r.text(); };

// a JS single-quoted string literal, as the bundler wrote it, back to text
const unjs = (s) => s.replace(/\\(u[0-9a-fA-F]{4}|x[0-9a-fA-F]{2}|[\s\S])/g, (_, e) => (e[0] === 'u' || e[0] === 'x') && e.length > 1 ? String.fromCharCode(parseInt(e.slice(1), 16)) : ({ n: '\n', t: '\t', r: '\r' }[e] ?? e));

async function read() {
  const html = await get(PAGE);
  const chunks = [...new Set(html.match(/\/_next\/static\/chunks\/[^"']+\.js/g) || [])];
  const mods = [];
  for (const c of chunks) {
    const js = await get('https://hanzo.ai' + c);
    if (!js.includes('git/activity')) continue;
    for (const m of js.matchAll(/t\.exports=JSON\.parse\('((?:[^'\\]|\\[\s\S])*)'\)/g)) {
      try { const d = JSON.parse(unjs(m[1])); if (d && d.source === 'https://api.hanzo.ai/v1/git/activity') mods.push(d); } catch { /* not ours */ }
    }
  }
  const sum = mods.find((d) => d.groups?.hanzo?.top), act = mods.find((d) => d.groups?.hanzo?.daily);
  if (!sum || !act) throw new Error('the open-source figures were not found in ' + PAGE + "'s build");
  return { sum, act };
}

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
  const nz = days.filter((v) => v > 0).sort((a, b) => a - b), q = [0.25, 0.5, 0.75].map((p) => nz[Math.floor(nz.length * p)] ?? 0);
  return '.'.repeat(new Date(from + 'T00:00:00Z').getUTCDay()) + days.map((v) => (v === 0 ? '0' : v <= q[0] ? '1' : v <= q[1] ? '2' : v <= q[2] ? '3' : '4')).join('');
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
        pushed: 'Pushed ' + day(r.pushed), to: r.forge, months: r.months,
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

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    const s = shape(await read());
    const head = `/* /open-source figures, as hanzo.ai's build read api.hanzo.ai/v1/git/activity and GitHub (read ${s.read}). Written by read.mjs beside it; do not edit by hand. */\n`;
    fs.writeFileSync(OUT, head + `const S = ${JSON.stringify(s)};\nexport default S;\n`);
    console.log('snapshot', s.read, s.from, '→', s.to, s.total.map((t) => t.join(' ')).join(' · '));
  } catch (e) { console.log('kept the last snapshot:', e.message); }
}
