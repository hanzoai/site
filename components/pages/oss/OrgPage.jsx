'use client';
/* One of Hanzo's GitHub organizations (/oss/<org>, 56 of them, one template). The first screen is the organization's
   own ledger: its repositories, stars, forks and commits rolling up on a black card, over a contour field seeded from
   its name and figures, with its year of commits drawn as a waveform a playhead keeps reading.
   Signature: every repository opens into its own card. Click a row and it lifts into a card (shared-layout morph):
   stars, forks, this year's commits, last push, its monthly bars at full size.
   Beyond: clone in one press. Each card hands you the git clone command for GitHub or Hanzo Forge, ready to copy;
   the list re-sorts by stars or by this year's commits, and searches as you type. */
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, LayoutGroup, useReducedMotion } from 'motion/react';
import { EASE, Copy, Count } from '../../ui';
import { A } from '../../kit';
import Sigil from '../../Sigil';
import { Loose } from '../models/parts';
import './oss.css';

const up = (d) => ({ initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, ease: EASE, delay: d } });
const SORTS = [['listed', 'Recently pushed'], ['stars', 'Stars'], ['commits', 'Commits this year']];
const n0 = (v) => (v == null ? '—' : v.toLocaleString('en-US'));

/* a year of commits, month by month: bars that rise once, then a playhead that keeps reading them */
function Wave({ bars, label = 'Commits a month over the past year', big, i = 0 }) {
  if (!bars || !bars.length) return null;
  return (
    <div className={'xos-wave' + (big ? ' big' : '')} role="img" aria-label={label} style={{ '--n': bars.length, '--d': (i % 7) * -0.9 + 's' }}>
      {bars.map((h, k) => <i key={k} style={{ '--h': Math.max(0.03, h / 100), '--k': k }} />)}
      <b aria-hidden="true" />
    </div>
  );
}

function Star() { return <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true"><path d="M8 1.8l1.8 3.9 4.2.5-3.1 2.9.8 4.2L8 11.2l-3.7 2.1.8-4.2L2 6.2l4.2-.5z" fill="currentColor" /></svg>; }
function Fork() { return <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true"><path d="M5 3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm9 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zM9.5 12.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zM3.5 5v1.5c0 1.1.9 2 2 2h5c1.1 0 2-.9 2-2V5M8 8.5V11" fill="none" stroke="currentColor" strokeWidth="1.3" /></svg>; }

/* the open card: one repository at full size, with its clone command */
function Card({ r, onClose }) {
  const [src, setSrc] = useState(r.href ? 'gh' : 'forge');
  const close = useRef(null);
  useEffect(() => {
    const back = document.activeElement;
    close.current && close.current.focus({ preventScroll: true });
    const esc = (e) => { if (e.key === 'Escape') onClose(); };
    addEventListener('keydown', esc);
    return () => { removeEventListener('keydown', esc); back && back.focus && back.focus({ preventScroll: true }); };
  }, [onClose]);
  const url = src === 'gh' ? r.href : r.forge;
  const cmd = url ? `git clone ${url}.git` : '';
  return (
    <div className="xos-modal" role="dialog" aria-modal="true" aria-label={r.name}>
      <motion.button type="button" className="xos-scrim" aria-label="Close" tabIndex={-1} onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.2 } }} />
      <motion.article className="xos-card" layoutId={'xos-' + r.name} transition={{ type: 'spring', stiffness: 300, damping: 34 }}>
        <motion.div className="xos-card-in" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.12, duration: 0.3 } }} exit={{ opacity: 0, transition: { duration: 0.1 } }}>
          <header className="xos-card-h">
            <div>
              {r.lang && <p className="xos-lang x-mono">{r.lang}</p>}
              <h3>{r.name}</h3>
            </div>
            <button type="button" ref={close} className="xos-x" onClick={onClose} aria-label="Close">
              <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
            </button>
          </header>
          {r.desc && <p className="xos-card-d">{r.desc}</p>}
          <dl className="xos-stats">
            <div><dt>Stars</dt><dd className="x-mono">{n0(r.stars)}</dd></div>
            <div><dt>Forks</dt><dd className="x-mono">{n0(r.forks)}</dd></div>
            <div><dt>This year</dt><dd className="x-mono">{r.commits ? n0(r.nCommits) : '—'}</dd></div>
            <div><dt>Last push</dt><dd>{r.pushed ? r.pushed.replace(/^Pushed /, '') : '—'}</dd></div>
          </dl>
          {r.spark && <Wave bars={r.spark} big />}
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
            {r.href && <A to={r.href} className="x-btn solid">Open on GitHub</A>}
            {r.forge && <A to={r.forge} className="x-btn">Open on Hanzo Forge</A>}
          </div>
        </motion.div>
      </motion.article>
    </div>
  );
}

export default function OrgPage({ doc }) {
  const calm = useReducedMotion();
  const [q, setQ] = useState('');
  const [sort, setSort] = useState('listed');
  const [open, setOpen] = useState(null);
  const [more, setMore] = useState({ state: 'idle', items: [] });
  const R = doc.repos;
  const all = useMemo(() => (R ? [...R.items.map((r, i) => ({ ...r, i })), ...more.items] : []), [R, more.items]);
  const t = q.trim().toLowerCase();
  const shown = all.filter((r) => !t || (r.name + ' ' + r.desc + ' ' + (r.lang || '')).toLowerCase().includes(t)).sort((a, b) => (
    sort === 'stars' ? (b.stars || 0) - (a.stars || 0) || a.i - b.i : sort === 'commits' ? (b.nCommits || 0) - (a.nCommits || 0) || a.i - b.i : a.i - b.i));
  const hit = new Set(shown.map((r) => r.name));
  const cur = all.find((r) => r.name === open);
  // "Show all": the rest of the organization's public repositories, read from GitHub in the browser (forks left out, as Hanzo counts)
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
  const key = doc.key;
  return (
    <main className="xos">
      <section className="xos-hero" aria-labelledby="xos-h1">
        <div className="x-wrap xos-hero-g">
          <div>
            {doc.label && <motion.p className="xos-pill x-mono" {...up(0)}>{doc.label}</motion.p>}
            <h1 id="xos-h1" className="xos-h1" data-morph-target>
              <span className="x-line"><motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.06 }}>{doc.name}</motion.span></span>
            </h1>
            {doc.lede && <motion.p className="xos-lede" {...up(0.28)}>{doc.lede}</motion.p>}
            <motion.div className="xos-acts" {...up(0.4)}>
              {doc.links.map((l, i) => <A key={l.href} to={l.href} className={i === 2 ? 'x-arrow xos-every' : 'x-btn' + (i ? '' : ' solid')} {...(i ? {} : { 'data-thumb': '' })}>{l.label}</A>)}
            </motion.div>
          </div>
          <motion.div className="xos-ledger" initial={{ opacity: 0, y: 26, rotateX: 8 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} transition={{ duration: 1.2, ease: EASE, delay: 0.15 }}>
            <Sigil seed={doc.route} data={key.map((f) => f.n)} className="xos-sigil" />
            <p className="xos-ledger-h x-mono"><span>{doc.org}</span><span>{(doc.counts[0] && doc.counts[0].notes[0]) ? doc.counts[0].notes[0].replace(/^.*read from /, '') : ''}</span></p>
            <dl className="xos-ledger-g">
              {key.map((f) => (
                <div key={f.label}>
                  <dt>{f.label.replace(/,.*$/, '')}</dt>
                  <dd className="x-mono"><Count to={f.n} duration={1.8} delay={0.3} /></dd>
                </div>
              ))}
            </dl>
            <Wave bars={doc.spark} big />
          </motion.div>
        </div>
      </section>

      {doc.counts.length > 0 && (
        <section className="x-sec xos-counted">
          <div className="x-wrap xos-counted-g">
            {doc.counts.map((c) => (
              <div className="xos-led" key={c.title}>
                <h2>{c.title}</h2>
                <dl>
                  {c.figures.map((f) => <div key={f.label}><dt>{f.label}</dt><dd className="x-mono">{f.value}</dd></div>)}
                </dl>
                {c.spark && <Wave bars={c.spark} />}
                {c.notes.map((n) => <p key={n} className="xos-note">{n}</p>)}
              </div>
            ))}
          </div>
        </section>
      )}

      {R && (
        <section className="x-sec xos-repos" id="repositories">
          <div className="x-wrap">
            <div className="xos-repos-h">
              <h2>{R.title}</h2>
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
            <LayoutGroup>
              <ul className="xos-list">
                {[...shown, ...all.filter((r) => !hit.has(r.name))].map((r, k) => (
                  <motion.li key={r.name} layout={calm || all.length > 80 ? false : 'position'} transition={{ type: 'spring', stiffness: 300, damping: 32 }} hidden={!hit.has(r.name)}>
                    <motion.div layoutId={'xos-' + r.name} className="xos-row" style={{ borderRadius: 18 }}>
                      <div className="xos-row-t">
                        <button type="button" className="xos-open" onClick={() => setOpen(r.name)} aria-haspopup="dialog" data-cursor="Open">
                          <span className="xos-name x-mono">{r.name}</span>
                        </button>
                        {r.href && <A to={r.href} className="xos-gh" aria-label={r.name + ' on GitHub'}>↗</A>}
                        <span className="xos-meta">
                          {r.lang && <span>{r.lang}</span>}
                          {r.stars != null && <span className="x-mono" aria-label={r.stars + ' stars'}><Star />{n0(r.stars)}</span>}
                          {r.forks != null && <span className="x-mono" aria-label={r.forks + ' forks'}><Fork />{n0(r.forks)}</span>}
                        </span>
                      </div>
                      {r.desc && <p className="xos-desc">{r.desc}</p>}
                      <div className="xos-row-f">
                        <Wave bars={r.spark} i={k} />
                        {r.pushed && <span>{r.pushed}</span>}
                        {r.archived && <span className="xos-arch x-mono">{r.archived}</span>}
                        {r.commits && <span className="x-mono">{r.commits}</span>}
                        {r.forge && <A to={r.forge} className="xos-forge">{r.forgeLabel || 'Forge'}</A>}
                      </div>
                    </motion.div>
                  </motion.li>
                ))}
              </ul>
              {shown.length === 0 && <p className="xos-empty" role="status">No repository matches “{q}”.</p>}
              <AnimatePresence>{cur && <Card key={cur.name} r={cur} onClose={() => setOpen(null)} />}</AnimatePresence>
            </LayoutGroup>
            {R.more && more.state !== 'done' && (
              more.state === 'failed'
                ? <p className="xos-more"><A to={doc.links[0] ? doc.links[0].href : 'https://github.com/' + doc.org} className="x-btn">{R.more}</A></p>
                : <p className="xos-more"><button type="button" className="x-btn" onClick={loadAll} disabled={more.state === 'loading'} aria-busy={more.state === 'loading'}>{more.state === 'loading' ? 'Reading GitHub…' : R.more}</button></p>
            )}
          </div>
        </section>
      )}

      {doc.extra.map((e, i) => <section className="x-sec" key={i}><div className="x-wrap"><Loose nodes={e.nodes} /></div></section>)}
    </main>
  );
}
