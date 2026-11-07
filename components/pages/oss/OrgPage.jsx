'use client';
/* One of Hanzo's GitHub organizations (/oss/<org>, 56 of them, one template): a catalogue whose first screen is the
   organization's year, laid flat. Its own face among the families: no black card and no pinned chapters. The name
   sits left with Hanzo's lede, caption and one ask on the right; under them, full width and light, the year's commits
   run as a wide strip of bars (a playhead keeps reading them) with the organization's strongest figure set on it and
   its own contour behind; an organization with no commits this year lets its repositories pass along the strip
   instead. Every figure is said once: GitHub's in a small row under the strip, the forge's own in hairline rows, each
   with its share drawn from Hanzo's own numbers (private of all repositories, by our people and agents of all
   commits). Zeros never stand big: they drop into a small grey line. Then the repositories as a numbered list whose
   rows open into cards; the next organizations; and a quiet close, the organization's contour full width with the ask.
   Persona: Developer and researcher (MASTER.md 1). Goal: find a repository and clone it.
   CTA: "<org> on GitHub" (Hanzo's hero link; data-thumb, so the site's ask carries it after the hero).
   Metric: GitHub or weights click.
   Signature: every repository opens into its own card. Press a row and it grows into a full card (shared-element
   morph, synchronized.studio): stars, forks, this year's commits and last push, its monthly bars, its clone command.
   Beyond: clone in one press. Each card hands you the git clone command for GitHub or Hanzo Forge, ready to copy; the
   rows filter by language, re-sort (as listed, by stars, by this year's commits) and search as you type.
   Motion, by kind (scroll is one of them): idle, the strip's playhead or its passing repositories, the contour
   drifting (it leans toward the pointer); pointer, the magnetic ask, a hovered row's own playhead, the sibling rail
   that drags with inertia; state, the row that opens into its card, the sort pill, rows re-flowing as you filter;
   arrival, the name arriving large and settling, the lead's digits rising; scroll, the lead growing as it passes.
   Colour: none of our own (MASTER.md 3.1); organizations differ by their contour, figures and repositories.
   V2: 8/10 v6: a light, full-width year strip as the hero object (its own face: no black card, no pinned chapters, no dark close), each figure said once with the forge's shares drawn from Hanzo's numbers, zeros in a small line, repositories as numbered rows (72px on phones), siblings named by id, a quiet close with the contour and the ask. */
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, LayoutGroup, useInView, useReducedMotion, useScroll, useTransform } from 'motion/react';
import useCalm from '../../v2/useCalm';
import NoJs from '../../NoJs';
import { Copy, Magnetic } from '../../ui';
import { A } from '../../kit';
import Sigil from '../../Sigil';
import { Loose } from '../models/parts';
import FamLines from '../../v2/FamLines';
import FamNext from '../../v2/FamNext';
import FamGrow from '../../v2/FamGrow';
import { ui } from '../../v2/famUi';
import './oss.css';

const n0 = (v) => (v == null ? '—' : v.toLocaleString('en-US'));
const num = (s) => { const v = parseFloat(String(s).replace(/,/g, '')); return Number.isFinite(v) ? v : 0; };
const PAGE = 11;
const MORPH = { duration: 0.6, ease: [0.4, 0, 0.2, 1] }; // the open: 600 ms in-out, no spring (MASTER.md 3.1)
const GLIDE = { duration: 0.3, ease: [0.16, 1, 0.3, 1] };

/* icons: Hanzo's page names stars and forks in its own aria-labels ("3 stars", "0 forks") */
function Star() { return <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M8 1.8l1.8 3.9 4.2.5-3.1 2.9.8 4.2L8 11.2l-3.7 2.1.8-4.2L2 6.2l4.2-.5z" fill="currentColor" /></svg>; }
function Fork() { return <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M5 3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm9 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zM9.5 12.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zM3.5 5v1.5c0 1.1.9 2 2 2h5c1.1 0 2-.9 2-2V5M8 8.5V11" fill="none" stroke="currentColor" strokeWidth="1.3" /></svg>; }
function Clock() { return <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true"><circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="1.4" /><path d="M8 4.6V8l2.4 1.6" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>; }
function Bars() { return <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true"><path d="M3 13V8M6.3 13V4M9.7 13V7M13 13V2.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>; }
function Grid() { return <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true"><path d="M3 3h4v4H3zM9 3h4v4H9zM3 9h4v4H3zM9 9h4v4H9z" fill="none" stroke="currentColor" strokeWidth="1.3" /></svg>; }
function Out() { return <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true"><path d="M5.5 3.5h7v7M12.5 3.5 4 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
function Arrow() { return <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
const SORTS = [['listed', 'oss_sort_pushed', Clock], ['stars', 'oss_sort_stars', Star], ['commits', 'oss_sort_commits', Bars]];

/* a year of commits, month by month: bars that rise once; a playhead reads them where the page wants life */
function Wave({ bars, label = 'Commits a month over the past year', className = '', play }) {
  if (!bars || !bars.length) return null;
  return (
    <div className={'xos-wave ' + className + (play ? ' play' : '')} role="img" aria-label={label} style={{ '--n': bars.length }}>
      {bars.map((h, k) => <i key={k} style={{ '--h': Math.max(0.03, h / 100), '--k': k }} />)}
      <b aria-hidden="true" />
    </div>
  );
}

/* "hanzoai/ui": the organization faint, the repository as the name */
function Name({ name }) {
  const k = name.indexOf('/');
  return k < 0 ? <>{name}</> : <><span className="xos-org">{name.slice(0, k + 1)}</span>{name.slice(k + 1)}</>;
}
/* "2,107 commits this year": the figure, then Hanzo's words after it */
function Split({ s }) {
  const m = /^([\d,.]+)\s+(.*)$/.exec(s || '');
  return m ? <><b className="v2f-num">{m[1]}</b><span>{m[2]}</span></> : <span>{s}</span>;
}

/* the open card: one repository at full size, with its clone command */
function Card({ r, onClose }) {
  const [src, setSrc] = useState(r.href ? 'gh' : 'forge');
  const close = useRef(null);
  useEffect(() => {
    const back = document.activeElement;
    const html = document.documentElement;
    html.classList.add('x-lock');
    window.__lenis && window.__lenis.stop();
    close.current && close.current.focus({ preventScroll: true });
    // Esc closes; Tab and Shift+Tab stay inside the card (a modal keeps focus until it is closed)
    const esc = (e) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key !== 'Tab') return;
      const box = document.querySelector('.xos-card');
      const f = box ? [...box.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')].filter((el) => el.offsetParent !== null) : [];
      if (!f.length) return;
      const [first, last] = [f[0], f[f.length - 1]];
      if (e.shiftKey && (document.activeElement === first || !box.contains(document.activeElement))) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && (document.activeElement === last || !box.contains(document.activeElement))) { e.preventDefault(); first.focus(); }
    };
    addEventListener('keydown', esc);
    return () => {
      removeEventListener('keydown', esc);
      html.classList.remove('x-lock');
      window.__lenis && window.__lenis.start();
      // focus goes back to the row that opened the card (found by its name: the row may have re-rendered meanwhile)
      const row = document.querySelector('.xos-open[data-row="' + CSS.escape(r.name) + '"]');
      (row || back) && (row || back).focus && (row || back).focus({ preventScroll: true });
    };
  }, [onClose, r.name]);
  const url = src === 'gh' ? r.href : r.forge;
  const cmd = url ? `git clone ${url}.git` : '';
  return (
    <div className="xos-modal" role="dialog" aria-modal="true" aria-label={r.name} data-swipe-own>
      <motion.button type="button" className="xos-scrim" aria-label={ui('close')} tabIndex={-1} onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.2 } }} />
      <motion.article className="xos-card" layoutId={'xos-' + r.name} transition={MORPH} style={{ borderRadius: 24 }} data-lenis-prevent>
        <motion.div className="xos-card-in" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.18, duration: 0.3 } }} exit={{ opacity: 0, transition: { duration: 0.1 } }}>
          <header className="xos-card-h">
            <div>
              <h3><Name name={r.name} /></h3>
              {(r.lang || r.archived) && <p className="v2f-kick xos-card-k">{[r.lang, r.archived].filter(Boolean).join(' · ')}</p>}
            </div>
            <button type="button" ref={close} className="xos-x" onClick={onClose} aria-label={ui('close')}>
              <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
            </button>
          </header>
          {r.desc && <p className="xos-card-d">{r.desc}</p>}
          <dl className="xos-stats">
            {r.stars != null && <div className={r.stars ? '' : 'nil'}><dt><Star /><span className="x-sr">stars</span></dt><dd className="v2f-num">{n0(r.stars)}</dd></div>}
            {r.forks != null && <div className={r.forks ? '' : 'nil'}><dt><Fork /><span className="x-sr">forks</span></dt><dd className="v2f-num">{n0(r.forks)}</dd></div>}
            {r.commits && <div className="xos-stats-c"><dt className="x-sr">{r.commits}</dt><dd><Split s={r.commits} /></dd></div>}
            {r.pushed && <div className="xos-stats-w"><dt className="x-sr">{r.pushed}</dt><dd className="xos-when">{r.pushed}</dd></div>}
          </dl>
          {r.spark && <Wave bars={r.spark} className="xos-card-w" play />}
          {(r.href || r.forge) && (
            <div className="xos-clone">
              <div className="xos-clone-h">
                <span className="x-mono">git clone</span>
                {r.href && r.forge && (
                  /* the pill is placed by CSS, so it never slides in while the card opens */
                  <div className="xos-src" role="group" aria-label={ui('oss_clone_from')} data-at={src}>
                    <span className="xos-src-bg" aria-hidden="true" />
                    {[['gh', 'GitHub'], ['forge', 'Hanzo Forge']].map(([k, t]) => (
                      <button key={k} type="button" aria-pressed={src === k} onClick={() => setSrc(k)}><span>{t}</span></button>
                    ))}
                  </div>
                )}
              </div>
              <div className="xos-cmd"><code className="x-mono">{cmd}</code><Copy text={cmd} label={ui('oss_copy')} /></div>
            </div>
          )}
          <div className="xos-card-l">
            {r.href && <A to={r.href} className="v2f-btn solid" data-cta="oss.card">{r.name}<Out /></A>}
            {r.forge && <A to={r.forge} className="v2f-btn">{r.forgeLabel || 'Forge'}<Out /></A>}
          </div>
        </motion.div>
      </motion.article>
    </div>
  );
}

/* the figures, each once: the lead (the strongest true figure, never a zero) goes on the strip; GitHub's others in a
   small row; the forge's own in rows. A forge figure that only restates the lead is not repeated. */
function figures(doc) {
  const [gh, forge] = [doc.counts.find((c) => /GitHub/.test(c.title)), doc.counts.find((c) => /Forge/.test(c.title))];
  const all = doc.counts.flatMap((c) => c.figures);
  const pick = (re) => all.find((f) => re.test(f.label) && f.n > 0);
  const lead = pick(/^commits/) || pick(/^public repositories/) || pick(/^repositories/) || all.find((f) => f.n > 0) || all[0];
  return { gh, forge, lead };
}

/* the hero object: the year, laid flat across the page */
function Year({ doc, lead }) {
  const when = doc.counts[0] && doc.counts[0].notes[0] ? doc.counts[0].notes[0].replace(/^.*read from /, '') : '';
  const names = doc.repos ? doc.repos.items.slice(0, 16).map((r) => r.name) : [];
  const live = doc.spark && doc.spark.some((v) => v > 0);
  return (
    <div className={'xos-year' + (live ? '' : ' tick')}>
      <Sigil seed={doc.route} data={doc.key.map((f) => f.n)} className="xos-year-s" />
      <p className="xos-year-h x-mono"><span>{doc.org}</span><span>{when}</span></p>
      {lead && (
        <div className="xos-lead">
          <FamGrow to={1.25}>
            <b className="v2f-num v2f-fig xos-dgs" aria-label={lead.value}>
              {[...lead.value].map((c, i) => <span key={i} className="xos-dg" aria-hidden="true"><span style={{ '--i': i }}>{c}</span></span>)}
            </b>
          </FamGrow>
          <span className="xos-lead-l">{lead.label}</span>
        </div>
      )}
      {live
        ? <Wave bars={doc.spark} className="xos-year-w" play />
        : names.length > 0 && (
          <div className="xos-tick" aria-hidden="true" style={{ '--n': names.length }}>
            <div className="xos-tick-r">{[0, 1].map((k) => <span key={k}>{names.map((n) => <i key={n}>{n}</i>)}</span>)}</div>
          </div>
        )}
    </div>
  );
}

/* a figure whose digits rise out of their masks (the same move as the lead), held until its section arrives */
function Digits({ value, className = '' }) {
  return (
    <b className={'xos-dgs ' + className} aria-label={value}>
      {[...value].map((c, i) => <span key={i} className="xos-dg" aria-hidden="true"><span style={{ '--i': i }}>{c}</span></span>)}
    </b>
  );
}
/* data-in on a section once a fifth of it is on screen: its held arrivals (digits, rows) play then, once */
function useArrive(amount = 0.2) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount });
  return [ref, seen ? '' : undefined];
}
/* with scripts off every held arrival shows at rest */
const NOJS = '.xos .xos-dg>span,.xos .xos-list>li{animation:none!important;transform:none!important;opacity:1!important}';

/* one goes out as the next comes in: as you scroll on, the year strip settles back (a little smaller, lifting away)
   while the counted figures rise under it. Scroll-linked, transform only; still under reduced motion. */
function Recede({ children }) {
  const ref = useRef(null);
  const calm = useCalm();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start 0.35', 'end start'] });
  const scale = useTransform(p, [0, 1], [1, 0.9]);
  const y = useTransform(p, [0, 1], [0, -48]);
  const opacity = useTransform(p, [0, 0.55, 1], [1, 1, 0.35]);
  return <motion.div ref={ref} className="xos-recede" style={calm ? undefined : { scale, y, opacity }}>{children}</motion.div>;
}

/* a share, drawn from two of Hanzo's own figures */
function Share({ part, of }) {
  if (!(part > 0) || !(of > 0) || part > of) return null;
  return <span className="xos-share" aria-hidden="true"><i style={{ transform: `scaleX(${(part / of).toFixed(4)})` }} /></span>;
}

export default function OrgPage({ doc }) {
  const calm = useReducedMotion();
  const [q, setQ] = useState('');
  const [sort, setSort] = useState('listed');
  const [lang, setLang] = useState('');
  const [all2, setAll2] = useState(false);
  const [open, setOpen] = useState(null);
  const [more, setMore] = useState({ state: 'idle', items: [] });
  const R = doc.repos;
  const all = useMemo(() => (R ? [...R.items.map((r, i) => ({ ...r, i })), ...more.items] : []), [R, more.items]);
  const langs = useMemo(() => {
    const n = {};
    all.forEach((r) => { if (r.lang) n[r.lang] = (n[r.lang] || 0) + 1; });
    return Object.keys(n).sort((a, b) => n[b] - n[a]);
  }, [all]);
  const t = q.trim().toLowerCase();
  const shown = all
    .filter((r) => (!t || (r.name + ' ' + r.desc + ' ' + (r.lang || '')).toLowerCase().includes(t)) && (!lang || r.lang === lang))
    .sort((a, b) => (sort === 'stars' ? (b.stars || 0) - (a.stars || 0) || a.i - b.i : sort === 'commits' ? (b.nCommits || 0) - (a.nCommits || 0) || a.i - b.i : a.i - b.i));
  const paged = !t && !lang && !all2;
  const vis = paged ? shown.slice(0, PAGE) : shown;
  const hit = new Set(vis.map((r) => r.name));
  const cur = all.find((r) => r.name === open);
  // "Show all": every listed repository, plus (where Hanzo offers it) the rest of the organization's public ones, read
  // from GitHub in the browser (forks left out, as Hanzo counts)
  const loadAll = async () => {
    setMore({ state: 'loading', items: [] });
    try {
      const got = [];
      const pages = Math.min(10, Math.ceil(parseInt((R.total || '0').replace(/,/g, ''), 10) / 100) || 1);
      for (let p = 1; p <= pages; p++) {
        const res = await fetch(`https://api.github.com/orgs/${doc.org}/repos?per_page=100&sort=pushed&page=${p}`);
        if (!res.ok) throw new Error(res.status);
        const j = await res.json();
        got.push(...j);
        if (j.length < 100) break;
      }
      const have = new Set(R.items.map((r) => r.name));
      const items = got.filter((g) => !g.fork && !have.has(g.full_name)).map((g, k) => ({
        name: g.full_name, href: g.html_url, forge: null, lang: g.language, stars: g.stargazers_count, forks: g.forks_count, desc: g.description || '',
        pushed: g.pushed_at ? 'Pushed ' + new Date(g.pushed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : null,
        commits: '', nCommits: 0, spark: null, i: R.items.length + k,
      }));
      setMore({ state: 'done', items });
    } catch { setMore({ state: 'failed', items: [] }); }
  };
  const showAll = () => { setAll2(true); if (R.more && more.state === 'idle') loadAll(); };
  const longest = Math.max(...doc.name.split(/\s+/).map((w) => w.length));
  const { gh: ghC, forge: forgeC, lead } = figures(doc);
  // GitHub's figures, minus the lead, in one small row; the forge's own, minus the lead, as rows (zeros in a line)
  const ghFigs = ghC ? ghC.figures.filter((f) => f !== lead) : [];
  const commits = doc.counts.flatMap((c) => c.figures).find((f) => /^commits/.test(f.label));
  // a forge figure that says the lead's number again ("11" public repositories, then "11" repositories) drops to the small line
  const forgeFigs = forgeC ? forgeC.figures.filter((f) => f !== lead).map((f) => (lead && f.value === lead.value && f.n > 0 ? { ...f, again: true } : f)) : [];
  const forgeRows = forgeFigs.filter((f) => f.n > 0 && !f.again);
  const forgeZero = forgeFigs.filter((f) => !(f.n > 0) || f.again);
  const shareOf = (f) => {
    const m = /^repositories, ([\d,]+) of them private/.exec(f.label);
    if (m) return [num(m[1]), f.n];
    if (/^of those commits/.test(f.label) && commits) return [f.n, commits.n];
    return null;
  };
  const growIx = forgeRows.reduce((b, f, k) => (f.n > (forgeRows[b] ? forgeRows[b].n : -1) ? k : b), 0);
  // the next organizations: never this one, and each name once
  const seenNames = new Set([doc.name]);
  const near = (doc.near || []).filter((o) => o.org !== doc.org && !seenNames.has(o.name) && seenNames.add(o.name)).map((o) => ({
    href: '/oss/' + o.org, title: o.name, preview: o.lede, seed: '/oss/' + o.org, data: o.data,
    meta: [o.org, o.repos && o.repos.value + ' ' + o.repos.label, o.commits && o.commits.n > 0 && o.commits.value + ' ' + o.commits.label.replace(/,.*$/, '')].filter(Boolean).join(' · '),
  }));
  const [gh, forge, every] = doc.links;
  const [ghRef, ghIn] = useArrive();
  const [fgRef, fgIn] = useArrive();
  const [listRef, listIn] = useArrive(0.05);
  const clear = () => { setQ(''); setLang(''); };
  return (
    <main className="v2f xos">
      <NoJs css={NOJS} />
      <section className="xos-hero" aria-labelledby="xos-h1">
        <div className="v2f-wrap v2f-grid xos-top">
          <div className="xos-top-l" style={{ '--len': longest }}>
            <FamLines as="h1" id="xos-h1" text={doc.name} className="v2f-display xos-h1" settle={false} data-morph-target />
          </div>
          <div className="xos-top-r">
            {doc.lede && <p className="v2f-lede xos-lede">{doc.lede}</p>}
            {doc.label && <p className="v2f-kick xos-meta-l">{doc.label}</p>}
            <div className="xos-acts">
              {gh && <Magnetic strength={0.2}><A to={gh.href} className="v2f-btn solid" data-thumb="" data-cta="oss.hero">{gh.label}<Out /></A></Magnetic>}
              {forge && <A to={forge.href} className="x-arrow xos-link"><span>{forge.label}</span><Arrow /></A>}
            </div>
          </div>
        </div>
        <div className="v2f-wrap"><Recede><Year doc={doc} lead={lead} /></Recede></div>
        {ghC && (
          <div className="v2f-wrap v2f-grid xos-ghr" ref={ghRef} data-in={ghIn}>
            <div className="xos-ghr-l">
              <FamLines as="h2" play="view" text={ghC.title} className="v2f-head" />
              {ghC.notes.map((n) => <p key={n} className="xos-note">{n}</p>)}
            </div>
            {/* a figure stands big only when it is more than zero; zeros drop into one small grey line */}
            <div className="xos-ghr-r">
              {ghFigs.some((f) => f.n > 0) && (
                <dl className="xos-row-figs">
                  {ghFigs.filter((f) => f.n > 0).map((f) => <div key={f.label}><dd className="v2f-num"><Digits value={f.value} /></dd><dt>{f.label}</dt></div>)}
                </dl>
              )}
              {ghFigs.some((f) => !(f.n > 0)) && <p className="xos-zero">{ghFigs.filter((f) => !(f.n > 0)).map((f) => <span key={f.label}><b>{f.value}</b> {f.label}</span>)}</p>}
            </div>
          </div>
        )}
      </section>

      {forgeC && (
        <section className={'xos-fg' + (forgeRows.length <= 1 ? ' thin' : '')} aria-labelledby="xos-forge-h" ref={fgRef} data-in={fgIn}>
          <div className="v2f-wrap v2f-grid xos-fg-g">
            <div className="xos-fg-l">
              <FamLines as="h2" id="xos-forge-h" play="view" text={forgeC.title} className="v2f-head" />
              {forgeC.notes.map((n) => <p key={n} className="xos-note">{n}</p>)}
            </div>
            <div className="xos-fg-r">
              {forgeRows.length > 0 && (
                <dl className="xos-fr">
                  {forgeRows.map((f, k) => {
                    const s = shareOf(f);
                    const v = <dd className="v2f-num v2f-fig"><Digits value={f.value} /></dd>;
                    return (
                      <div key={f.label}>
                        {k === growIx && forgeRows.length > 1 ? <FamGrow to={1.35}>{v}</FamGrow> : v}
                        <dt>{f.label}{s && <Share part={s[0]} of={s[1]} />}</dt>
                      </div>
                    );
                  })}
                </dl>
              )}
              {forgeZero.length > 0 && <p className="xos-zero">{forgeZero.map((f) => <span key={f.label}><b>{f.value}</b> {f.label}</span>)}</p>}
            </div>
          </div>
        </section>
      )}

      {R && (
        <section className="xos-repos" id="repositories" aria-labelledby="xos-repos-h">
          <div className="v2f-wrap">
            <div className="v2f-grid xos-repos-h">
              <FamLines as="h2" id="xos-repos-h" play="view" text={R.title} className="v2f-head" />
              <div className="xos-tools">
                {R.search && (
                  <label className="xos-search">
                    <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true"><circle cx="7" cy="7" r="4.6" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="M10.5 10.5 14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                    <input type="search" placeholder={R.search} aria-label={'Search the repositories of ' + doc.org} value={q} onChange={(e) => setQ(e.target.value)} />
                  </label>
                )}
                {R.items.length > 1 && all.some((r) => r.stars > 0 || r.nCommits > 0) && (
                  <div className="xos-seg" role="group" aria-label={ui('oss_sort')}>
                    {/* a sort that would change nothing (no stars, or no commits this year, anywhere) is not offered */}
                    {SORTS.filter(([k]) => k === 'listed' || all.some((r) => (k === 'stars' ? r.stars : r.nCommits) > 0)).map(([k, l, Icon]) => (
                      <button key={k} type="button" aria-pressed={sort === k} aria-label={ui(l)} onClick={() => setSort(k)}>
                        {sort === k && <motion.span layoutId="xos-seg" className="xos-seg-bg" transition={GLIDE} />}
                        <span><Icon /></span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {langs.length > 1 && (
              <div className="xos-chips" role="group" aria-label={ui('oss_language')} data-swipe-own>
                {['', ...langs].map((l) => (
                  <button key={l || 'all'} type="button" aria-pressed={lang === l} aria-label={l ? undefined : ui('oss_all')} onClick={() => setLang(l)}>
                    {lang === l && <motion.span layoutId="xos-chip" className="xos-chip-bg" transition={GLIDE} />}
                    <span>{l || <Grid />}</span>
                  </button>
                ))}
              </div>
            )}
            <LayoutGroup>
              <ol className="xos-list" ref={listRef} data-in={listIn}>
                {[...vis, ...all.filter((r) => !hit.has(r.name))].map((r, k) => (
                  <motion.li key={r.name} layout={calm || all.length > 80 ? false : 'position'} transition={GLIDE} hidden={!hit.has(r.name)} className={k === 0 && vis.length > 2 && paged ? 'lead' : ''} style={{ '--k': Math.min(k, 12) }}>
                    <motion.div layoutId={'xos-' + r.name} className="xos-row" transition={MORPH}>
                      <span className="xos-no x-mono" aria-hidden="true">{String(k + 1).padStart(2, '0')}</span>
                      <div className="xos-row-m">
                        <button type="button" className="xos-open" data-row={r.name} onClick={() => setOpen(r.name)} aria-haspopup="dialog">
                          <span className="xos-name"><Name name={r.name} /></span>
                        </button>
                        {r.desc && <p className="xos-desc">{r.desc}</p>}
                        <p className="xos-row-s">
                          {r.lang && <span className="xos-lang">{r.lang}</span>}
                          {r.archived && <span className="xos-arch x-mono">{r.archived}</span>}
                          {r.stars != null && <span className="x-mono" aria-label={r.stars + ' stars'}><Star />{n0(r.stars)}</span>}
                          {r.forks != null && <span className="x-mono xos-hide-p" aria-label={r.forks + ' forks'}><Fork />{n0(r.forks)}</span>}
                          {r.commits && <span className="x-mono xos-hide-p">{r.commits}</span>}
                          {r.pushed && <span className="xos-hide-p">{r.pushed}</span>}
                        </p>
                      </div>
                      {r.spark && r.spark.length ? <Wave bars={r.spark} className="xos-row-w" /> : <span className="xos-row-w" aria-hidden="true" />}
                      <span className="xos-ends">
                        {r.forge && <A to={r.forge} className="xos-forge">{r.forgeLabel || 'Forge'}</A>}
                        {r.href && <A to={r.href} className="xos-gh" aria-label={r.name}><Out /></A>}
                      </span>
                    </motion.div>
                  </motion.li>
                ))}
              </ol>
              {shown.length === 0 && (
                <div className="xos-empty" role="status">
                  <svg viewBox="0 0 16 16" width="20" height="20" aria-hidden="true"><circle cx="7" cy="7" r="4.6" fill="none" stroke="currentColor" strokeWidth="1.4" /><path d="M10.5 10.5 14 14M4.6 4.6l4.8 4.8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
                  <span>{ui('oss_no_match')}{q && <> “{q}”</>}</span>
                  <button type="button" className="v2f-btn" onClick={clear}><Grid />{ui('oss_all')}</button>
                </div>
              )}
              <AnimatePresence>{cur && <Card key={cur.name} r={cur} onClose={() => setOpen(null)} />}</AnimatePresence>
            </LayoutGroup>
            {shown.length === 0 ? null : paged && shown.length > PAGE ? (
              <p className="xos-more">
                {R.more
                  ? <button type="button" className="v2f-btn" onClick={showAll}>{R.more}</button>
                  : <button type="button" className="v2f-btn xos-plus" onClick={showAll} aria-label={ui('oss_show_all') + ' (' + shown.length + ')'}><i aria-hidden="true">+</i><span className="x-mono" aria-hidden="true">{shown.length - PAGE}</span></button>}
              </p>
            ) : R.more && more.state !== 'done' && (
              more.state === 'failed'
                ? <p className="xos-more"><A to={gh ? gh.href : 'https://github.com/' + doc.org} className="v2f-btn">{R.more}</A></p>
                : <p className="xos-more"><button type="button" className="v2f-btn" onClick={loadAll} disabled={more.state === 'loading'} aria-busy={more.state === 'loading'}>{more.state === 'loading' ? <><i className="xos-spin" aria-hidden="true" /><span className="x-sr">{ui('oss_loading')}</span></> : R.more}</button></p>
            )}
          </div>
        </section>
      )}

      {doc.extra.map((e, i) => <section className="v2f-sec" key={i}><div className="v2f-wrap"><Loose nodes={e.nodes} /></div></section>)}

      {near.length > 0 && (
        // the next organizations go straight to their page (the site's page-turn stage would hold a blank page with a
        // card title that cannot land on a differently sized headline)
        <section className="xos-near" aria-label={every ? every.label : doc.name} data-no-morph>
          <div className="v2f-wrap">
            {every && <p className="xos-near-h"><A to={every.href} className="x-arrow"><span>{every.label}</span><Arrow /></A></p>}
            <FamNext items={near} label={every ? every.label : doc.name} />
          </div>
        </section>
      )}

      {/* the close: its own moment, the organization's contour full width (it leans toward the pointer) and the one ask */}
      <section className="x-band xos-close" aria-label={doc.name}>
        <Sigil seed={doc.route + '#close'} data={doc.key.map((f) => f.n)} className="xos-close-s" />
        <div className="v2f-wrap xos-close-g">
          <p className="v2f-kick xos-close-k">{doc.org}</p>
          {gh && <Magnetic strength={0.2}><A to={gh.href} className="v2f-btn solid xos-close-b" data-cta="oss.close">{gh.label}<Out /></A></Magnetic>}
        </div>
      </section>
    </main>
  );
}
