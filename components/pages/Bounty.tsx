'use client';
import type React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { A, Cta } from '../kit';
import LineReveal, { NoJs } from '../v2/LineReveal';
import { SEARCH, SEARCH_CLOSED, REPOS, CONTRIBUTING, useBounties } from './Bounty.github';
import type { Bounty as BountyItem, BountyState } from './Bounty.github';
import { SNAP } from './Bounty.snapshot';
import '../v2/ProgramScale.css';
import './Bounty.css';

const n = (v: number) => v.toLocaleString('en-US');

function rewardFor(it: BountyItem): { label: string; cents: number } {
  const ls = (it.labels || []).map((l) => l.toLowerCase());
  const t = (it.tier || '').toLowerCase();
  if (t === 'p0' || t === 'advanced' || t === 'l' || ls.includes('bounty:p0') || ls.includes('priority: p0') || ls.includes('research')) {
    return { label: '+$100 AI credits', cents: 10000 };
  }
  if (t === 'starter' || t === 's' || t === 'p2' || ls.includes('bounty:starter') || ls.includes('starter')) {
    return { label: '+$20 AI credits', cents: 2000 };
  }
  return { label: '+$50 AI credits', cents: 5000 };
}

function OpenIssueIcon() {
  return (
    <svg className="xbo-gh-ic open" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
      <circle cx="8" cy="8" r="6.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="8" cy="8" r="2" fill="currentColor" />
    </svg>
  );
}

function ClosedIssueIcon() {
  return (
    <svg className="xbo-gh-ic closed" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
      <circle cx="8" cy="8" r="6.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5.2 8.1 7.1 10l3.8-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg className="xbo-gh-cmt-ic" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
      <path d="M2.75 2.5h10.5c.69 0 1.25.56 1.25 1.25v6.5c0 .69-.56 1.25-1.25 1.25H7.5l-3.25 2.5v-2.5H2.75c-.69 0-1.25-.56-1.25-1.25v-6.5c0-.69.56-1.25 1.25-1.25Z" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinejoin="round" />
    </svg>
  );
}

function useOneSolidOnPhone() {
  useEffect(() => {
    const H = document.documentElement;
    const mq = matchMedia('(max-width: 700px)');
    const el = document.querySelector('main.xbo [data-cta="bounty.hero"]');
    if (!el) return;
    let mine = false, vis = false;
    const apply = () => {
      if (mq.matches && vis) { H.dataset.ask = 'quiet'; mine = true; }
      else if (mine) { delete H.dataset.ask; mine = false; }
    };
    const io = new IntersectionObserver(([e]) => { vis = e.isIntersecting; apply(); });
    io.observe(el);
    const timers = [300, 1400].map((ms) => setTimeout(apply, ms));
    mq.addEventListener('change', apply);
    return () => { io.disconnect(); timers.forEach(clearTimeout); mq.removeEventListener('change', apply); if (mine) delete H.dataset.ask; };
  }, []);
}

function Hero({ openTotal }: { openTotal: number }) {
  useOneSolidOnPhone();
  return (
    <section className="xbo-hero" aria-labelledby="xbo-h1">
      <div className="xp-wrap xp-grid">
        <div className="xbo-copy">
          <p className="xp-kick">Bounties &amp; AI Credit Rewards</p>
          <LineReveal as="h1" id="xbo-h1" className="xp-display md" lines={['Ship code.', 'Get paid in AI credits.']} />
          <div className="xbo-in" style={{ '--d': '.1s' } as React.CSSProperties}>
            <p className="xp-lede xbo-lede">
              Pick an open GitHub issue, report a reproducible bug, or merge a pull request across Hanzo’s repositories. You get paid automatically in AI credits — redeemable across all Hanzo models (Zen, Enso, Kai) and 600+ top frontier models in Hanzo Chat, Dev, CLI, and API.
            </p>
            <div className="xbo-acts">
              <Cta to="#issues" id="bounty.hero" thumb className="xp-cta">{`Browse ${n(openTotal)} bounties`}</Cta>
              <A to={SEARCH} className="xbo-link" data-cta="bounty.github">Open on GitHub</A>
              <A to="https://console.hanzo.ai" className="xbo-link" data-cta="bounty.console">Link GitHub account</A>
            </div>
          </div>
        </div>
        <div className="xbo-hero-win xbo-in" style={{ '--d': '.05s', '--y': '20px' } as React.CSSProperties}>
          <div className="xbo-summary xp-obj">
            <div className="xbo-sum-top">
              <span className="xbo-sum-k x-mono">Program Overview</span>
              <span className="xbo-sum-badge x-mono">600+ Models</span>
            </div>
            <ul className="xbo-tiers">
              <li>
                <div className="xbo-tier-h">
                  <b>Merged bounty pull request</b>
                  <span className="xbo-cr x-mono">+$20 – $500 AI credits</span>
                </div>
                <p>Open a PR referencing a bounty issue (<code>Fixes #123</code>). Automatically credited to your linked GitHub account on merge.</p>
              </li>
              <li>
                <div className="xbo-tier-h">
                  <b>Verified bug report or QA issue</b>
                  <span className="xbo-cr x-mono">+$20 AI credits</span>
                </div>
                <p>File a reproducible bug report or QA failure. Automatically rewarded when a maintainer labels it <code>bounty</code> or <code>accepted</code>, or when its fix merges.</p>
              </li>
              <li>
                <div className="xbo-tier-h">
                  <b>Redeemable on all Hanzo &amp; 600+ models</b>
                  <span className="xbo-cr x-mono">100% usage credit</span>
                </div>
                <p>Use your earned credits across Hanzo Zen, Enso, Kai, Claude, GPT, Gemini, DeepSeek, Llama, and Qwen via Chat, Dev, CLI, or <code>api.hanzo.ai</code>.</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

const LABEL_FILTERS = [
  { id: 'all', label: 'All labels' },
  { id: 'p0', label: 'bounty:P0 / Priority', match: (ls: string[]) => ls.some((l) => l.includes('p0')) },
  { id: 'research', label: 'research / HIP', match: (ls: string[]) => ls.includes('research') },
  { id: 'qa', label: 'qa / tests', match: (ls: string[]) => ls.includes('qa') || ls.includes('tests') },
  { id: 'bugfix', label: 'bugfix / perf', match: (ls: string[]) => ls.includes('bugfix') || ls.includes('bug') || ls.includes('perf') },
  { id: 'starter', label: 'starter', match: (ls: string[]) => ls.some((l) => l.includes('starter')) },
];

function IssuesBoard({ st }: { st: BountyState }) {
  const [stateFilter, setStateFilter] = useState<'open' | 'closed' | 'all'>('open');
  const [repoFilter, setRepoFilter] = useState<string>('all');
  const [labelFilter, setLabelFilter] = useState<string>('all');
  const [query, setQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'newest' | 'comments' | 'reward'>('newest');
  const [visibleCount, setVisibleCount] = useState<number>(15);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const allItems = useMemo(() => {
    const snapItems = (SNAP.items || []) as BountyItem[];
    if (st.kind !== 'ready' || !st.open.items.length) return snapItems;
    const byUrl = new Map<string, BountyItem>();
    for (const it of snapItems) byUrl.set(it.url, it);
    for (const it of st.open.items) {
      const prev = byUrl.get(it.url);
      byUrl.set(it.url, { ...prev, ...it, labels: it.labels?.length ? it.labels : prev?.labels, body: it.body || prev?.body });
    }
    return Array.from(byUrl.values());
  }, [st]);

  const counts = useMemo(() => {
    let open = 0, closed = 0;
    for (const it of allItems) {
      if (it.state === 'closed') closed++;
      else open++;
    }
    return {
      open: Math.max(open, SNAP.total || open),
      closed: Math.max(closed, (SNAP as { closedTotal?: number }).closedTotal || closed),
      loadedOpen: open,
      loadedClosed: closed,
    };
  }, [allItems]);

  const repos = useMemo(() => {
    const map = new Map<string, number>();
    for (const it of allItems) {
      if (stateFilter !== 'all' && (it.state || 'open') !== stateFilter) continue;
      map.set(it.repo, (map.get(it.repo) || 0) + 1);
    }
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [allItems, stateFilter]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const lf = LABEL_FILTERS.find((f) => f.id === labelFilter);
    const list = allItems.filter((it) => {
      const itemState = it.state || 'open';
      if (stateFilter !== 'all' && itemState !== stateFilter) return false;
      if (repoFilter !== 'all' && it.repo !== repoFilter) return false;
      const ls = (it.labels || ['bounty', ...(it.tier ? [`bounty:${it.tier}`] : [])]).map((x) => x.toLowerCase());
      if (lf && lf.match && !lf.match(ls)) return false;
      if (q) {
        const hay = `${it.repo} #${it.number} ${it.title} ${it.body || ''} ${ls.join(' ')} ${it.author || ''}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    if (sortBy === 'comments') {
      return [...list].sort((a, b) => (b.comments || 0) - (a.comments || 0));
    }
    if (sortBy === 'reward') {
      return [...list].sort((a, b) => rewardFor(b).cents - rewardFor(a).cents);
    }
    return list;
  }, [allItems, stateFilter, repoFilter, labelFilter, query, sortBy]);

  const shown = filtered.slice(0, visibleCount);
  const hasFilters = repoFilter !== 'all' || labelFilter !== 'all' || query.trim() !== '';

  return (
    <section className="xp-sec tight xbo-board" id="issues" aria-labelledby="xbo-issues-h">
      <div className="xp-wrap">
        <div className="xbo-board-top">
          <div>
            <h2 id="xbo-issues-h" className="xp-head">Bounty issues</h2>
            <p className="xp-body">Search, filter by repository or label, and click any open issue to take it on GitHub.</p>
          </div>
          <div className="xbo-gh-search">
            <svg className="xbo-gh-s-ic" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
              <circle cx="7" cy="7" r="4.75" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <path d="m10.5 10.5 3.25 3.25" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input
              ref={searchInputRef}
              type="search"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setVisibleCount(15); }}
              placeholder="Filter issues by keyword, repo, #number, or label…"
              aria-label="Filter bounty issues"
            />
            {query ? (
              <button type="button" className="xbo-gh-clear" onClick={() => setQuery('')} aria-label="Clear search">×</button>
            ) : (
              <kbd className="xbo-gh-kbd x-mono" aria-hidden="true">/</kbd>
            )}
          </div>
        </div>

        <div className="xbo-gh-layout">
          <aside className="xbo-gh-side" aria-label="Issue filters">
            <div className="xbo-gh-group">
              <h3 className="xbo-gh-side-h">State</h3>
              <ul className="xbo-gh-nav">
                <li>
                  <button type="button" aria-pressed={stateFilter === 'open'} onClick={() => { setStateFilter('open'); setVisibleCount(15); }}>
                    <OpenIssueIcon />
                    <span>Open</span>
                    <em className="x-mono">{n(counts.open)}</em>
                  </button>
                </li>
                <li>
                  <button type="button" aria-pressed={stateFilter === 'closed'} onClick={() => { setStateFilter('closed'); setVisibleCount(15); }}>
                    <ClosedIssueIcon />
                    <span>Closed</span>
                    <em className="x-mono">{n(counts.closed)}</em>
                  </button>
                </li>
                <li>
                  <button type="button" aria-pressed={stateFilter === 'all'} onClick={() => { setStateFilter('all'); setVisibleCount(15); }}>
                    <span>All issues</span>
                    <em className="x-mono">{n(counts.open + counts.closed)}</em>
                  </button>
                </li>
              </ul>
            </div>

            <div className="xbo-gh-group">
              <h3 className="xbo-gh-side-h">Label / Track</h3>
              <ul className="xbo-gh-nav">
                {LABEL_FILTERS.map((f) => (
                  <li key={f.id}>
                    <button type="button" aria-pressed={labelFilter === f.id} onClick={() => { setLabelFilter(f.id); setVisibleCount(15); }}>
                      <span>{f.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="xbo-gh-group">
              <h3 className="xbo-gh-side-h">Repositories</h3>
              <ul className="xbo-gh-nav xbo-gh-repos">
                <li>
                  <button type="button" aria-pressed={repoFilter === 'all'} onClick={() => { setRepoFilter('all'); setVisibleCount(15); }}>
                    <span>All repositories</span>
                    <em className="x-mono">{n(repos.reduce((acc, r) => acc + r[1], 0))}</em>
                  </button>
                </li>
                {repos.slice(0, 12).map(([r, c]) => (
                  <li key={r}>
                    <button type="button" aria-pressed={repoFilter === r} onClick={() => { setRepoFilter(r); setVisibleCount(15); }}>
                      <span className="x-mono">{r}</span>
                      <em className="x-mono">{c}</em>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <div className="xbo-gh-main">
            <div className="xbo-gh-bar">
              <div className="xbo-gh-count">
                <b>{`${n(filtered.length)} ${filtered.length === 1 ? 'result' : 'results'}`}</b>
                {hasFilters && (
                  <button
                    type="button"
                    className="xbo-gh-reset"
                    onClick={() => { setRepoFilter('all'); setLabelFilter('all'); setQuery(''); setVisibleCount(15); }}
                  >
                    Clear filters
                  </button>
                )}
              </div>
              <div className="xbo-gh-sort">
                <label htmlFor="xbo-sort" className="x-mono">Sort by:</label>
                <select id="xbo-sort" value={sortBy} onChange={(e) => setSortBy(e.target.value as 'newest' | 'comments' | 'reward')}>
                  <option value="newest">Newest</option>
                  <option value="reward">Highest reward</option>
                  <option value="comments">Most commented</option>
                </select>
              </div>
            </div>

            {shown.length > 0 ? (
              <ul className="xbo-gh-list">
                {shown.map((it) => {
                  const isClosed = it.state === 'closed';
                  const rw = rewardFor(it);
                  const labels = it.labels?.length ? it.labels : ['bounty', ...(it.tier ? [`bounty:${it.tier}`] : [])];
                  return (
                    <li key={it.url} className="xbo-gh-card">
                      <div className="xbo-gh-card-top">
                        <button type="button" className="xbo-gh-repo x-mono" onClick={() => setRepoFilter(repoFilter === it.repo ? 'all' : it.repo)}>
                          {it.repo}
                        </button>
                        <span className="xbo-gh-reward x-mono">{rw.label}</span>
                      </div>

                      <h3 className="xbo-gh-title">
                        {isClosed ? <ClosedIssueIcon /> : <OpenIssueIcon />}
                        <a href={it.url} target="_blank" rel="noopener noreferrer">{it.title}</a>
                      </h3>

                      {it.body && <p className="xbo-gh-desc">{it.body}</p>}

                      <div className="xbo-gh-labels">
                        {labels.map((lbl) => (
                          <span key={lbl} className={'xbo-gh-lbl x-mono' + (lbl.toLowerCase().startsWith('bounty') ? ' primary' : '')}>
                            {lbl}
                          </span>
                        ))}
                      </div>

                      <div className="xbo-gh-meta x-mono">
                        <div className="xbo-gh-meta-l">
                          <span>{it.author || 'hanzoai'}</span>
                          {typeof it.comments === 'number' && (
                            <span className="xbo-gh-cmt"><CommentIcon /> {it.comments}</span>
                          )}
                          {it.createdAt && <span>{`Opened ${it.createdAt}`}</span>}
                          <span>{`#${it.number}`}</span>
                        </div>
                        <a href={it.url} target="_blank" rel="noopener noreferrer" className="xbo-gh-take">
                          {isClosed ? 'View issue ↗' : 'Take issue ↗'}
                        </a>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="xbo-gh-empty xp-obj">
                <p>No bounty issues match your current filters.</p>
                <button
                  type="button"
                  className="xbo-gh-reset-btn"
                  onClick={() => { setStateFilter('all'); setRepoFilter('all'); setLabelFilter('all'); setQuery(''); }}
                >
                  Show all issues
                </button>
              </div>
            )}

            <div className="xbo-gh-foot">
              {filtered.length > visibleCount && (
                <button type="button" className="xbo-gh-more" onClick={() => setVisibleCount((c) => c + 20)}>
                  {`Show more issues (${n(filtered.length - visibleCount)} remaining)`}
                </button>
              )}
              <a
                className="xbo-gh-ext x-mono"
                href={stateFilter === 'closed' ? SEARCH_CLOSED : SEARCH}
                target="_blank"
                rel="noopener noreferrer"
              >
                View full search on GitHub ↗
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const STEPS = [
  [
    '01',
    'Link GitHub to your Hanzo account',
    'Sign in at console.hanzo.ai with your GitHub account. Hanzo matches every merged PR and accepted issue to your numeric GitHub user ID so rewards land in your account automatically.',
  ],
  [
    '02',
    'Take an issue or file a bug report',
    'Comment on an open bounty issue to claim it and open a pull request with "Fixes #number" in the description — or open a reproducible bug report that a maintainer tags with bounty.',
  ],
  [
    '03',
    'Automatic AI credits on merge',
    'When a maintainer merges your pull request into the default branch, our GitHub webhook verifies the merge and automatically credits both the PR author and the issue reporter.',
  ],
];

function HowItWorks() {
  return (
    <section className="xp-sec tight xbo-how" aria-labelledby="xbo-how-h">
      <div className="xp-wrap">
        <div className="xp-grid xbo-how-head">
          <h2 id="xbo-how-h" className="xp-head">How it works</h2>
          <p className="xp-body">Three steps from picking an issue to spending your AI credits across Zen, Enso, Kai, and 600+ frontier models.</p>
        </div>
        <ol className="xbo-steps">
          {STEPS.map(([num, title, body]) => (
            <li key={num} className="xbo-step xp-obj">
              <span className="xbo-step-n x-mono">{num}</span>
              <h3 className="xp-title">{title}</h3>
              <p className="xp-body">{body}</p>
            </li>
          ))}
        </ol>
        <div className="xbo-propose xp-obj" id="propose">
          <div className="xbo-propose-l">
            <h3 className="xp-title">Found a bug not listed yet?</h3>
            <p className="xp-body">
              Open an issue in the relevant Hanzo repository explaining how to reproduce it. When a maintainer labels your issue <code>bounty</code> or <code>accepted</code> — or when a PR fixing your issue is merged — your linked GitHub account is rewarded automatically. Security vulnerabilities should be reported privately to <a href="mailto:security@hanzo.ai">security@hanzo.ai</a>.
            </p>
          </div>
          <div className="xbo-propose-r">
            <A to={REPOS} className="xbo-link">Hanzo repositories</A>
            <A to={CONTRIBUTING} className="xbo-link">Contributing guide</A>
            <A to="/leaderboard" className="xbo-link">Global leaderboard</A>
          </div>
        </div>
      </div>
    </section>
  );
}

function Close() {
  return (
    <section className="x-band xbo-band" data-room="dark" aria-labelledby="xbo-band-h">
      <div className="xp-wrap">
        <h2 id="xbo-band-h" className="xbo-band-h">
          <span>Ship code. Get paid in AI credits.</span>
        </h2>
        <div className="x-band-act">
          <Cta to={SEARCH} id="bounty.band" size="lg" className="xp-cta">Every open bounty on GitHub</Cta>
        </div>
      </div>
    </section>
  );
}

export default function Bounty() {
  const st = useBounties();
  const openTotal = st.kind === 'ready' ? Math.max(st.open.total, SNAP.total || 179) : (SNAP.total || 179);
  return (
    <main className="xp xbo">
      <NoJs />
      <Hero openTotal={openTotal} />
      <IssuesBoard st={st} />
      <HowItWorks />
      <Close />
    </main>
  );
}
