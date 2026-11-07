'use client';
/* One of Hanzo's GitHub organizations (/oss/<org>, 56 of them, one template): a catalogue with a launch-page first
   screen. The organization's name runs at display size on the left; its ledger (this year's commits huge, then
   repositories, stars and forks, and the year as a waveform a playhead keeps reading) is the hero object on the right,
   a black instrument over the organization's own contour (Sigil seeded with its route and drawn from its figures), and
   it settles into place as you scroll. Two chapters then count it, GitHub's figures and the forge's; then the
   repositories, as tiles you filter by language; then the next organizations, as cards that open into their page.
   Persona: Developer and researcher (PLAN-COMPONENTS 1.1). Goal: find a repository and clone it.
   CTA: "<org> on GitHub" (Hanzo's hero link; data-thumb, so the site's ask bar carries it after the hero).
   Metric: GitHub or weights click.
   Signature: every repository opens into its own card. Press a tile and it lifts and grows into a full card
   (shared-element morph, synchronized.studio): stars, forks, this year's commits and last push at full size, its
   monthly bars across the card, and its clone command.
   Beyond: clone in one press. Each card hands you the git clone command for GitHub or Hanzo Forge, ready to copy; the
   tiles filter by language, re-sort (as listed, by stars, by this year's commits) and search as you type.
   Motion, by kind (scroll is two of them): idle, the ledger's playhead reading the year and the contour drifting;
   pointer, the magnetic ask, a hovered tile's own playhead, the sibling rail that drags with inertia; state, the tile
   that opens into its card, the sort pill gliding, tiles re-flowing as you filter; arrival, the name's masked rise;
   scroll, the ledger settling and the counted chapters swapping.
   Colour: none of our own (JAMES.md 7): ink, greys and white; the organizations differ by their contour and figures.
   V2: 8/10 v5: live hanzo.ai sizes (h1 52, figures 64, the ledger's lead grows past its rest only on arrival and settles as you scroll), no springs (600 ms in-out open, 300 ms glides), no cursor label, deck greys. v4: the ledger leads with the strongest true figure (never a zero), its digits rise into place, and an org with no commits shows its own repositories as a slow ticker, so the first screen moves within 1 s for every member. v3: name and ledger side by side so the ledger is whole on the first screen at 1470×801 and 375×812, no labels above headings, 0 hues (white-on-black ledger, silver waveforms), icon controls with registered names, Hanzo's own words on every card, siblings with their own line on hover. */
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, LayoutGroup, useReducedMotion } from 'motion/react';
import { Copy, Magnetic } from '../../ui';
import { A } from '../../kit';
import Sigil from '../../Sigil';
import { Loose } from '../models/parts';
import FamLines from '../../v2/FamLines';
import FamStage from '../../v2/FamStage';
import FamChapters from '../../v2/FamChapters';
import FamNext from '../../v2/FamNext';
import FamGrow from '../../v2/FamGrow';
import { ui } from '../../v2/famUi';
import './oss.css';

const n0 = (v) => (v == null ? '—' : v.toLocaleString('en-US'));
const PAGE = 11; // a wide lead tile and ten more: four even rows of three
const MORPH = { duration: 0.6, ease: [0.4, 0, 0.2, 1] }; // the open: 600 ms in-out, no spring (MASTER.md 3.1)
const GLIDE = { duration: 0.3, ease: [0.16, 1, 0.3, 1] };

/* icons: Hanzo's page names stars and forks in its own aria-labels ("3 stars", "0 forks") */
function Star() { return <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M8 1.8l1.8 3.9 4.2.5-3.1 2.9.8 4.2L8 11.2l-3.7 2.1.8-4.2L2 6.2l4.2-.5z" fill="currentColor" /></svg>; }
function Fork() { return <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M5 3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm9 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zM9.5 12.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zM3.5 5v1.5c0 1.1.9 2 2 2h5c1.1 0 2-.9 2-2V5M8 8.5V11" fill="none" stroke="currentColor" strokeWidth="1.3" /></svg>; }
function Clock() { return <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true"><circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="1.4" /><path d="M8 4.6V8l2.4 1.6" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>; }
function Bars() { return <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true"><path d="M3 13V8M6.3 13V4M9.7 13V7M13 13V2.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>; }
function Grid() { return <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true"><path d="M3 3h4v4H3zM9 3h4v4H9zM3 9h4v4H3zM9 9h4v4H9z" fill="none" stroke="currentColor" strokeWidth="1.3" /></svg>; }
function Out() { return <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true"><path d="M5.5 3.5h7v7M12.5 3.5 4 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
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
/* "2,107 commits this year": the figure big, Hanzo's words after it */
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
    const esc = (e) => { if (e.key === 'Escape') onClose(); };
    addEventListener('keydown', esc);
    return () => {
      removeEventListener('keydown', esc);
      html.classList.remove('x-lock');
      window.__lenis && window.__lenis.start();
      back && back.focus && back.focus({ preventScroll: true });
    };
  }, [onClose]);
  const url = src === 'gh' ? r.href : r.forge;
  const cmd = url ? `git clone ${url}.git` : '';
  return (
    <div className="xos-modal" role="dialog" aria-modal="true" aria-label={r.name} data-swipe-own>
      <motion.button type="button" className="xos-scrim" aria-label={ui('close')} tabIndex={-1} onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.2 } }} />
      <motion.article className="xos-card" layoutId={'xos-' + r.name} transition={MORPH} style={{ borderRadius: 32 }} data-lenis-prevent>
        <motion.div className="xos-card-in" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.14, duration: 0.3 } }} exit={{ opacity: 0, transition: { duration: 0.1 } }}>
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
            {r.stars != null && <div><dt><Star /><span className="x-sr">stars</span></dt><dd className="v2f-num">{n0(r.stars)}</dd></div>}
            {r.forks != null && <div><dt><Fork /><span className="x-sr">forks</span></dt><dd className="v2f-num">{n0(r.forks)}</dd></div>}
            {r.commits && <div className="xos-stats-c"><dt className="x-sr">{r.commits}</dt><dd><Split s={r.commits} /></dd></div>}
            {r.pushed && <div className="xos-stats-w"><dt className="x-sr">{r.pushed}</dt><dd className="xos-when">{r.pushed}</dd></div>}
          </dl>
          {r.spark && <Wave bars={r.spark} className="xos-card-w" play />}
          {(r.href || r.forge) && (
            <div className="xos-clone">
              <div className="xos-clone-h">
                <span className="x-mono">git clone</span>
                {r.href && r.forge && (
                  <div className="xos-src" role="group" aria-label={ui('oss_clone_from')}>
                    {[['gh', 'GitHub'], ['forge', 'Hanzo Forge']].map(([k, t]) => (
                      <button key={k} type="button" aria-pressed={src === k} onClick={() => setSrc(k)}>
                        {src === k && <motion.span layoutId="xos-src" className="xos-src-bg" transition={GLIDE} />}
                        <span>{t}</span>
                      </button>
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

/* the hero object: the organization's ledger. Its lead is its strongest true figure, never a zero (this year's
   commits, then its public repositories, then the forge's count); zeros stay in the small row. The lead's digits rise
   into place (Hanzo's own figure throughout, never a count passing through other numbers). Something is always
   alive on arrival: the year's waveform and its playhead where the organization has commits, otherwise its own
   repositories passing as a slow ticker; the contour drifts behind both. */
function Ledger({ doc }) {
  const key = doc.key;
  const forge = doc.counts.flatMap((c) => c.figures).filter((f) => !key.includes(f));
  const pick = (re, list) => list.find((f) => re.test(f.label) && f.n > 0);
  const lead = pick(/^commits/, key) || pick(/^public repositories/, key) || pick(/^repositories/, forge) || [...key].sort((a, b) => b.n - a.n)[0];
  const rest = key.filter((f) => f !== lead);
  const when = doc.counts[0] && doc.counts[0].notes[0] ? doc.counts[0].notes[0].replace(/^.*read from /, '') : '';
  const names = doc.repos ? doc.repos.items.slice(0, 14).map((r) => r.name) : [];
  if (!lead) return null;
  return (
    <div className="xos-ledger">
      <Sigil seed={doc.route} data={key.map((f) => f.n)} className="xos-sigil" />
      <p className="xos-ledger-h x-mono"><span>{doc.org}</span><span>{when}</span></p>
      <div className="xos-lead">
        <FamGrow to={1.6}>
          <b className="v2f-num xos-dgs" style={{ '--ch': lead.value.length }} aria-label={lead.value}>
            {[...lead.value].map((c, i) => <span key={i} className="xos-dg" aria-hidden="true"><span style={{ '--i': i }}>{c}</span></span>)}
          </b>
        </FamGrow>
        <span className="xos-lead-l">{lead.label.replace(/,.*$/, '')}</span>
      </div>
      {doc.spark && doc.spark.some((v) => v > 0)
        ? <Wave bars={doc.spark} className="xos-ledger-w" play />
        : names.length > 0 && (
          <div className="xos-tick" aria-hidden="true" style={{ '--n': names.length }}>
            <div className="xos-tick-r">{[0, 1].map((k) => <span key={k}>{names.map((n) => <i key={n}>{n}</i>)}</span>)}</div>
          </div>
        )}
      <dl className="xos-ledger-r">
        {rest.map((f) => (
          <div key={f.label}>
            <dd className="v2f-num">{f.value}</dd>
            <dt>{f.label.replace(/,.*$/, '')}</dt>
          </div>
        ))}
      </dl>
    </div>
  );
}

/* one chapter's picture: a counted ledger at full size */
function Counted({ c, dark }) {
  return (
    <div className={'xos-ct' + (dark ? ' dark' : '') + (c.figures.length % 2 ? ' odd' : '')}>
      <dl>
        {c.figures.map((f) => (
          <div key={f.label}>
            <dd className="v2f-num" style={{ '--ch': f.value.length }}>{f.value}</dd>
            <dt>{f.label}</dt>
          </div>
        ))}
      </dl>
      {c.spark && <Wave bars={c.spark} className="xos-ct-w" />}
    </div>
  );
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
  const chapters = doc.counts.map((c, k) => ({
    key: c.title,
    name: c.title,
    text: (
      <div className="xos-ch-t">
        <h2 className="v2f-head">{c.title}</h2>
        {c.notes.map((n) => <p key={n} className="v2f-body xos-ch-n">{n}</p>)}
      </div>
    ),
    visual: <Counted c={c} dark={k === doc.counts.length - 1 && doc.counts.length > 1} />,
  }));
  const near = (doc.near || []).map((o) => ({
    href: '/oss/' + o.org, title: o.name, preview: o.lede, seed: '/oss/' + o.org, data: o.data,
    meta: [o.repos && o.repos.value + ' ' + o.repos.label, o.commits && o.commits.n > 0 && o.commits.value + ' ' + o.commits.label.replace(/,.*$/, '')].filter(Boolean).join(' · '),
  }));
  const [gh, forge, every] = doc.links;
  return (
    <main className="v2f xos">
      <section className="xos-hero" aria-labelledby="xos-h1">
        <div className="v2f-wrap v2f-grid xos-hero-g">
          <div className="xos-hero-t" style={{ '--len': longest }}>
            <FamLines as="h1" id="xos-h1" text={doc.name} className="v2f-display xos-h1" data-morph-target />
            {doc.lede && <p className="v2f-lede xos-lede">{doc.lede}</p>}
            {doc.label && <p className="v2f-kick xos-meta-l">{doc.label}</p>}
            <div className="xos-acts">
              {gh && <Magnetic strength={0.2}><A to={gh.href} className="v2f-btn solid" data-thumb="" data-cta="oss.hero">{gh.label}<Out /></A></Magnetic>}
              {forge && <A to={forge.href} className="x-arrow xos-link"><span>{forge.label}</span></A>}
              {every && <A to={every.href} className="x-arrow xos-link"><span>{every.label}</span></A>}
            </div>
          </div>
          <FamStage className="xos-stage" from={1.05} span={480}>
            <Ledger doc={doc} />
          </FamStage>
        </div>
      </section>

      {chapters.length > 0 && <FamChapters label={doc.name} items={chapters} className="xos-ch" />}

      {R && (
        <section className="v2f-sec xos-repos" id="repositories" aria-labelledby="xos-repos-h">
          <div className="v2f-wrap">
            <div className="v2f-grid xos-repos-h">
              <FamLines as="h2" id="xos-repos-h" play="view" text={R.title} className="v2f-display small" />
              <div className="xos-tools">
                {R.search && (
                  <label className="xos-search">
                    <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true"><circle cx="7" cy="7" r="4.6" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="M10.5 10.5 14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                    <input type="search" placeholder={R.search} aria-label={'Search the repositories of ' + doc.org} value={q} onChange={(e) => setQ(e.target.value)} />
                  </label>
                )}
                {R.items.length > 1 && (
                  <div className="xos-seg" role="group" aria-label={ui('oss_sort')}>
                    {SORTS.map(([k, l, Icon]) => (
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
                  <button key={l || 'all'} type="button" aria-pressed={lang === l} aria-label={l ? undefined : ui('oss_all')} onClick={() => setLang(l)}>{l || <Grid />}</button>
                ))}
              </div>
            )}
            <LayoutGroup>
              <ul className="xos-list">
                {[...vis, ...all.filter((r) => !hit.has(r.name))].map((r, k) => (
                  <motion.li key={r.name} layout={calm || all.length > 80 ? false : 'position'} transition={GLIDE} hidden={!hit.has(r.name)} className={k === 0 && vis.length > 2 ? 'lead' : ''}>
                    <motion.div layoutId={'xos-' + r.name} className="xos-row" style={{ borderRadius: 16 }} transition={MORPH}>
                      <button type="button" className="xos-open" onClick={() => setOpen(r.name)} aria-haspopup="dialog">
                        <span className="xos-name"><Name name={r.name} /></span>
                      </button>
                      {r.desc && <p className="xos-desc">{r.desc}</p>}
                      <div className="xos-row-f">
                        <Wave bars={r.spark} className="xos-row-w" />
                        <span className="xos-row-s">
                          {r.commits && <span className="x-mono">{r.commits}</span>}
                          {r.pushed && <span>{r.pushed}</span>}
                        </span>
                      </div>
                      <div className="xos-row-t">
                        <span className="xos-meta">
                          {r.lang && <span className="xos-lang">{r.lang}</span>}
                          {r.archived && <span className="xos-arch x-mono">{r.archived}</span>}
                          {r.stars != null && <span className="x-mono" aria-label={r.stars + ' stars'}><Star />{n0(r.stars)}</span>}
                          {r.forks != null && <span className="x-mono" aria-label={r.forks + ' forks'}><Fork />{n0(r.forks)}</span>}
                        </span>
                        <span className="xos-ends">
                          {r.forge && <A to={r.forge} className="xos-forge">{r.forgeLabel || 'Forge'}</A>}
                          {r.href && <A to={r.href} className="xos-gh" aria-label={r.name}><Out /></A>}
                        </span>
                      </div>
                    </motion.div>
                  </motion.li>
                ))}
              </ul>
              {shown.length === 0 && (
                <p className="xos-empty" role="status">
                  <svg viewBox="0 0 16 16" width="20" height="20" aria-hidden="true"><circle cx="7" cy="7" r="4.6" fill="none" stroke="currentColor" strokeWidth="1.4" /><path d="M10.5 10.5 14 14M4.6 4.6l4.8 4.8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
                  <span className="x-sr">{ui('oss_no_match')}</span><span aria-hidden="true">“{q}”</span>
                </p>
              )}
              <AnimatePresence>{cur && <Card key={cur.name} r={cur} onClose={() => setOpen(null)} />}</AnimatePresence>
            </LayoutGroup>
            {paged && shown.length > PAGE ? (
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
        <section className="v2f-sec tight xos-near" aria-label={every ? every.label : doc.name}>
          <div className="v2f-wrap">
            <FamNext items={near} label={every ? every.label : doc.name} />
            {every && <p className="xos-near-f"><A to={every.href} className="x-arrow"><span>{every.label}</span><svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></A></p>}
          </div>
        </section>
      )}

      {/* the close: the organization's own contour, its name and line, and the one ask (the site's ask bar steps aside) */}
      <section className="x-band xos-close" data-room="dark" aria-labelledby="xos-close-h">
        <Sigil seed={doc.route + '#close'} data={doc.key.map((f) => f.n)} className="xos-close-s" />
        <div className="v2f-wrap v2f-grid xos-close-g">
          <FamLines as="h2" id="xos-close-h" play="view" text={doc.name} className="v2f-display small xos-close-h" />
          <div className="xos-close-r">
            {doc.lede && <p className="v2f-lede">{doc.lede}</p>}
            {gh && <Magnetic strength={0.2}><A to={gh.href} className="v2f-btn xos-close-b" data-cta="oss.close">{gh.label}<Out /></A></Magnetic>}
          </div>
        </div>
      </section>
    </main>
  );
}
