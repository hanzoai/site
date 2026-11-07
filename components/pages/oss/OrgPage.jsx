'use client';
/* One of Hanzo's GitHub organizations (/oss/<org>, 56 of them, one template), at v2: a catalogue with a launch-page
   first screen. The organization's name runs at display size and its ledger (repositories, stars, forks, this year's
   commits, the year as a waveform) is the hero object: a black instrument over a contour field seeded from its name and
   figures, which starts close and settles into place as you scroll. Two chapters then count it, GitHub's figures and
   the forge's, one coming in as the other goes out; then the repositories, as tiles you filter by language.
   Signature: every repository opens into its own card. Press a tile and it lifts and grows into a full card
   (shared-element morph, synchronized.studio): stars, forks, this year's commits and last push at full size, its
   monthly bars across the card, and its clone command.
   Beyond: clone in one press. Each card hands you the git clone command for GitHub or Hanzo Forge, ready to copy; the
   tiles filter by language, re-sort by stars or by this year's commits, and search as you type.
   Motion: one signature (the open morph) plus three: the Stage settle and chapter swaps (scroll), the title's masked
   word rise, and the living contour behind the ledger. The ledger's waveform playhead is its idle life.
   V2: 8/10 Display-size org name, ledger as a Stage hero object, counted figures as two sticky chapters, repositories as language-filtered tiles that open into big cards, sibling orgs as open cards. */
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, LayoutGroup, useReducedMotion } from 'motion/react';
import { Copy } from '../../ui';
import { A } from '../../kit';
import Sigil from '../../Sigil';
import { Loose } from '../models/parts';
import FamLines from '../../v2/FamLines';
import FamStage from '../../v2/FamStage';
import FamChapters from '../../v2/FamChapters';
import FamNext from '../../v2/FamNext';
import { accentAt } from '../../v2/famAccent';
import './oss.css';

const SORTS = [['listed', 'Recently pushed'], ['stars', 'Stars'], ['commits', 'Commits this year']];
const n0 = (v) => (v == null ? '—' : v.toLocaleString('en-US'));
const PAGE = 11; // a wide lead tile and ten more: four even rows of three
const MORPH = { type: 'spring', stiffness: 300, damping: 34 };

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

function Star() { return <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true"><path d="M8 1.8l1.8 3.9 4.2.5-3.1 2.9.8 4.2L8 11.2l-3.7 2.1.8-4.2L2 6.2l4.2-.5z" fill="currentColor" /></svg>; }
function Fork() { return <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true"><path d="M5 3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm9 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zM9.5 12.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zM3.5 5v1.5c0 1.1.9 2 2 2h5c1.1 0 2-.9 2-2V5M8 8.5V11" fill="none" stroke="currentColor" strokeWidth="1.3" /></svg>; }
/* "hanzoai/ui": the organization faint, the repository as the name */
function Name({ name }) {
  const k = name.indexOf('/');
  return k < 0 ? <>{name}</> : <><span className="xos-org">{name.slice(0, k + 1)}</span>{name.slice(k + 1)}</>;
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
      <motion.button type="button" className="xos-scrim" aria-label="Close" tabIndex={-1} onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.2 } }} />
      <motion.article className="xos-card" layoutId={'xos-' + r.name} transition={MORPH} style={{ borderRadius: 28 }} data-lenis-prevent>
        <motion.div className="xos-card-in" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.14, duration: 0.3 } }} exit={{ opacity: 0, transition: { duration: 0.1 } }}>
          <header className="xos-card-h">
            <div>
              {r.lang && <p className="v2f-kick acc">{r.lang}</p>}
              <h3><Name name={r.name} /></h3>
            </div>
            <button type="button" ref={close} className="xos-x" onClick={onClose} aria-label="Close">
              <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
            </button>
          </header>
          {r.desc && <p className="xos-card-d">{r.desc}</p>}
          <dl className="xos-stats">
            <div><dt>Stars</dt><dd className="v2f-num">{n0(r.stars)}</dd></div>
            <div><dt>Forks</dt><dd className="v2f-num">{n0(r.forks)}</dd></div>
            <div><dt>This year</dt><dd className="v2f-num">{r.commits ? n0(r.nCommits) : '—'}</dd></div>
            <div><dt>Last push</dt><dd className="xos-when">{r.pushed ? r.pushed.replace(/^Pushed /, '') : '—'}</dd></div>
          </dl>
          {r.spark && <Wave bars={r.spark} className="xos-card-w" play />}
          {(r.href || r.forge) && (
            <div className="xos-clone">
              <div className="xos-clone-h">
                <span className="x-mono">git clone</span>
                {r.href && r.forge && (
                  <div className="xos-src" role="group" aria-label="Clone from">
                    {[['gh', 'GitHub'], ['forge', 'Hanzo Forge']].map(([k, t]) => (
                      <button key={k} type="button" aria-pressed={src === k} onClick={() => setSrc(k)}>
                        {src === k && <motion.span layoutId="xos-src" className="xos-src-bg" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
                        <span>{t}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="xos-cmd"><code className="x-mono">{cmd}</code><Copy text={cmd} label="Copy clone command" /></div>
            </div>
          )}
          <div className="xos-card-l">
            {r.href && <A to={r.href} className="v2f-btn solid">Open on GitHub</A>}
            {r.forge && <A to={r.forge} className="v2f-btn">Open on Hanzo Forge</A>}
          </div>
        </motion.div>
      </motion.article>
    </div>
  );
}

/* the hero object: the organization's ledger */
function Ledger({ doc }) {
  const key = doc.key;
  // the hero figure: this year's commits when there are any, else the first figure that is not zero
  const order = [...key].sort((a, b) => (/^commits/.test(b.label) ? 1 : 0) - (/^commits/.test(a.label) ? 1 : 0));
  const lead = order.find((f) => f.n > 0) || order[0];
  const rest = key.filter((f) => f !== lead);
  const when = doc.counts[0] && doc.counts[0].notes[0] ? doc.counts[0].notes[0].replace(/^.*read from /, '') : '';
  if (!lead) return null;
  return (
    <div className="xos-ledger">
      <Sigil seed={doc.route} data={key.map((f) => f.n)} className="xos-sigil" />
      <p className="xos-ledger-h x-mono"><span>{doc.org}</span><span>{when}</span></p>
      <div className="xos-ledger-g">
        <div className="xos-lead">
          <span className="xos-lead-l">{lead.label.replace(/,.*$/, '')}</span>
          <b className="v2f-num" style={{ '--ch': lead.value.length }}>{lead.value}</b>
        </div>
        <dl className="xos-ledger-r">
          {rest.map((f) => (
            <div key={f.label}>
              <dt>{f.label.replace(/,.*$/, '')}</dt>
              <dd className="v2f-num">{f.value}</dd>
            </div>
          ))}
        </dl>
      </div>
      <Wave bars={doc.spark} className="xos-ledger-w" play />
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
        <p className="v2f-kick acc">{String(k + 1).padStart(2, '0')} / {String(doc.counts.length).padStart(2, '0')}</p>
        <h2 className="v2f-head">{c.title}</h2>
        {c.notes.map((n) => <p key={n} className="v2f-body xos-ch-n">{n}</p>)}
      </div>
    ),
    visual: <Counted c={c} dark={k === doc.counts.length - 1 && doc.counts.length > 1} />,
  }));
  const near = (doc.near || []).map((o) => ({
    href: '/oss/' + o.org, kicker: o.org, title: o.name, seed: '/oss/' + o.org, data: o.data, acc: accentAt(o.i),
    meta: [o.repos && o.repos.value + ' ' + o.repos.label, o.commits && o.commits.n > 0 && o.commits.value + ' ' + o.commits.label.replace(/,.*$/, '')].filter(Boolean).join(' · '),
  }));
  return (
    <main className="v2f xos" style={{ '--acc': accentAt(doc.i) }}>
      <section className="xos-hero" aria-labelledby="xos-h1">
        <div className="v2f-wrap">
          {doc.label && <p className="v2f-kick acc xos-kick">{doc.label}</p>}
          <FamLines as="h1" id="xos-h1" text={doc.name} className="v2f-display xos-h1" data-morph-target style={{ '--len': longest }} />
          <div className="v2f-grid xos-hero-g">
            {doc.lede && <p className="v2f-lede xos-lede">{doc.lede}</p>}
            <div className="xos-acts">
              {doc.links.map((l, i) => <A key={l.href} to={l.href} className={i === 2 ? 'x-arrow xos-every' : 'v2f-btn' + (i ? '' : ' acc')} {...(i ? {} : { 'data-thumb': '' })}>{i === 2 ? <span>{l.label}</span> : l.label}</A>)}
            </div>
          </div>
          <FamStage className="xos-stage" from={1.08}>
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
                  <div className="xos-seg" role="group" aria-label="Sort">
                    {SORTS.map(([k, l]) => (
                      <button key={k} type="button" aria-pressed={sort === k} onClick={() => setSort(k)}>
                        {sort === k && <motion.span layoutId="xos-seg" className="xos-seg-bg" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
                        <span>{l}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {langs.length > 1 && (
              <div className="xos-chips" role="group" aria-label="Language" data-swipe-own>
                {['', ...langs].map((l) => (
                  <button key={l || 'all'} type="button" aria-pressed={lang === l} onClick={() => setLang(l)}>{l || 'All'}</button>
                ))}
              </div>
            )}
            <LayoutGroup>
              <ul className="xos-list">
                {[...vis, ...all.filter((r) => !hit.has(r.name))].map((r, k) => (
                  <motion.li key={r.name} layout={calm || all.length > 80 ? false : 'position'} transition={{ type: 'spring', stiffness: 300, damping: 32 }} hidden={!hit.has(r.name)} className={k === 0 && vis.length > 2 ? 'lead' : ''}>
                    <motion.div layoutId={'xos-' + r.name} className="xos-row" style={{ borderRadius: 16 }} transition={MORPH}>
                      <div className="xos-row-t">
                        {r.lang ? <span className="xos-lang">{r.lang}</span> : <span />}
                        <span className="xos-meta">
                          {r.stars != null && <span className="x-mono" aria-label={r.stars + ' stars'}><Star />{n0(r.stars)}</span>}
                          {r.forks != null && <span className="x-mono" aria-label={r.forks + ' forks'}><Fork />{n0(r.forks)}</span>}
                          {r.href && <A to={r.href} className="xos-gh" aria-label={r.name + ' on GitHub'}>↗</A>}
                        </span>
                      </div>
                      <button type="button" className="xos-open" onClick={() => setOpen(r.name)} aria-haspopup="dialog" data-cursor="Open">
                        <span className="xos-name"><Name name={r.name} /></span>
                      </button>
                      {r.desc && <p className="xos-desc">{r.desc}</p>}
                      <div className="xos-row-f">
                        <Wave bars={r.spark} className="xos-row-w" />
                        <span className="xos-row-s">
                          {r.commits && <span className="x-mono">{r.commits}</span>}
                          {r.pushed && <span>{r.pushed}</span>}
                          {r.archived && <span className="xos-arch x-mono">{r.archived}</span>}
                        </span>
                        {r.forge && <A to={r.forge} className="xos-forge">{r.forgeLabel || 'Forge'}</A>}
                      </div>
                    </motion.div>
                  </motion.li>
                ))}
              </ul>
              {shown.length === 0 && <p className="xos-empty" role="status">No repository matches “{q}”.</p>}
              <AnimatePresence>{cur && <Card key={cur.name} r={cur} onClose={() => setOpen(null)} />}</AnimatePresence>
            </LayoutGroup>
            {paged && shown.length > PAGE ? (
              <p className="xos-more"><button type="button" className="v2f-btn" onClick={showAll}>{R.more || 'Show all ' + shown.length}</button></p>
            ) : R.more && more.state !== 'done' && (
              more.state === 'failed'
                ? <p className="xos-more"><A to={doc.links[0] ? doc.links[0].href : 'https://github.com/' + doc.org} className="v2f-btn">{R.more}</A></p>
                : <p className="xos-more"><button type="button" className="v2f-btn" onClick={loadAll} disabled={more.state === 'loading'} aria-busy={more.state === 'loading'}>{more.state === 'loading' ? 'Reading GitHub…' : R.more}</button></p>
            )}
          </div>
        </section>
      )}

      {doc.extra.map((e, i) => <section className="v2f-sec" key={i}><div className="v2f-wrap"><Loose nodes={e.nodes} /></div></section>)}

      {near.length > 0 && (
        <section className="v2f-sec tight xos-near" aria-label={doc.links[2] ? doc.links[2].label : 'Organizations'}>
          <div className="v2f-wrap">
            <div className="xos-near-h">
              {doc.links[2] && <A to={doc.links[2].href} className="x-arrow"><span>{doc.links[2].label}</span><svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></A>}
            </div>
            <FamNext items={near} label={doc.links[2] ? doc.links[2].label : 'Organizations'} />
          </div>
        </section>
      )}
    </main>
  );
}
