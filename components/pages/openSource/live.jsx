'use client';
/* The page paints Hanzo's build read (snapshot.js, written by read.mjs), then asks the same source again:
   GET https://api.hanzo.ai/v1/git/activity. The API admits only the hanzo.ai origin (CORS), so elsewhere (a preview, the
   dev server) the request is not made and the build read stays. What a fresh read replaces is only what the API serves
   with the same meaning as the build: each ecosystem's commits and merges of the year, its latest commits and their read
   time, every organization's commits this year and months, and the total's commits. Day cells, the past 7 days and the
   GitHub figures (stars, forks, languages, contributors) stay as the build read them. */
import { createContext, useContext, useEffect, useState } from 'react';
import SNAP from './snapshot';

export const API = 'https://api.hanzo.ai/v1/git/activity';
const KEYS = ['hanzo', 'lux', 'zoo'];
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const d2 = (x) => String(x).padStart(2, '0');
const at = (iso) => { const d = new Date(iso); return `${MON[d.getUTCMonth()]} ${d.getUTCDate()}, ${d2(d.getUTCHours())}:${d2(d.getUTCMinutes())}`; };
const n = (x) => Number(x).toLocaleString('en-US');
const int = (v) => Number.isInteger(v) && v >= 0;
const commits = (v) => `${n(v)} ${v === 1 ? 'commit this year' : 'commits this year'}`;

export function merge(S, a) {
  if (!a || a.complete !== true || !a.read || Date.parse(a.read) <= Date.parse(S.read)) return S;
  const groups = Object.fromEntries((a.groups || []).map((g) => [g.name, g]));
  const orgs = Object.fromEntries((a.orgs || []).map((o) => [o.name, o]));
  const read = 'Forge listing · read ' + at(a.read);
  const eco = S.eco.map((e, i) => {
    const g = groups[KEYS[i]];
    if (!g || !int(g.commits) || !int(g.merges)) return e;
    const latest = (a.latest || []).filter((c) => orgs[c.repo.split('/')[0]]?.group === KEYS[i]).sort((x, y) => Date.parse(y.at) - Date.parse(x.at)).slice(0, 8);
    const stats = e.stats.map((s, j) => (j === 0 ? [s[0], n(g.commits), s[2]] : j === 1 ? [s[0], n(g.merges), s[2]] : s));
    return { ...e, stats, ...(latest.length ? { commits: latest.map((c) => [c.repo, c.message, at(c.at), c.url]), read } : {}) };
  });
  const og = S.orgs.map((x) => ({ ...x, orgs: x.orgs.map((o) => { const f = orgs[o.login]; return f && int(f.commits) ? { ...o, commits: f.commits ? commits(f.commits) : '', months: f.months || o.months } : o; }) }));
  const total = int(a.totals?.commits) ? S.total.map((t, j) => (j ? t : [n(a.totals.commits), t[1]])) : S.total;
  const hero = int(groups.hanzo?.commits) ? S.hero.map((h, j) => (j === 2 ? [n(groups.hanzo.commits), h[1]] : h)) : S.hero;
  return { ...S, eco, orgs: og, total, hero, read: a.read };
}

const Ctx = createContext(SNAP);
export const useOSS = () => useContext(Ctx);

export function OSSData({ children }) {
  const [s, setS] = useState(SNAP);
  useEffect(() => {
    if (location.origin !== 'https://hanzo.ai') return undefined;
    const ac = new AbortController();
    fetch(API, { signal: ac.signal, headers: { accept: 'application/json' } })
      .then((r) => (r.ok ? r.json() : null))
      .then((a) => a && setS((cur) => merge(cur, a)))
      .catch(() => { /* the build read stays */ });
    return () => ac.abort();
  }, []);
  return <Ctx.Provider value={s}>{children}</Ctx.Provider>;
}
