'use client';
import { useEffect, useMemo, useState } from 'react';
import './Badge.css';

const API = 'https://api.hanzo.ai';
const HOME = 'https://hanzo.ai';
const DEPLOY_URL = 'https://platform.hanzo.ai/deploy';
const EDIT_URL = 'https://hanzo.app/dev';

const FIELDS = [
  { id: 'level', label: 'Level', sample: 'Lv 7 · Architect' },
  { id: 'points', label: 'Points', sample: '14,820 pts' },
  { id: 'tokens', label: 'Tokens', sample: '10B+ club' },
  { id: 'badges', label: 'Badges', sample: '12 unlocked' },
];

const KINDS = [
  {
    id: 'profile',
    label: 'Flex your stats',
    tag: 'GitHub Profile',
    desc: 'Live SVG card or flat badge for your personal github.com/<handle>/<handle> README.md — shows your Hanzo level, points, token volume tier, and earned badges.',
  },
  {
    id: 'deploy',
    label: 'Deploy to Hanzo',
    tag: 'Repo Action',
    desc: 'One-click cloud deploy button for any open-source repository README.md. Launches your repo directly on Hanzo Cloud.',
  },
  {
    id: 'edit',
    label: 'Edit on Hanzo',
    tag: 'Repo Action',
    desc: 'Open any repository in Hanzo Dev cloud workspace with full MCP tools, terminal, and AI coding agent ready to ship.',
  },
  {
    id: 'built',
    label: 'Built with Hanzo',
    tag: 'Repo Badge',
    desc: 'Clean vector badge for projects powered by Zen, Kai, Enso, Hanzo MCP, or Hanzo Cloud. Automatically carries your referral link.',
  },
  {
    id: 'rank',
    label: 'Leaderboard rank',
    tag: 'GitHub Profile',
    desc: 'Live global standing and compute rank badge from the Hanzo Leaderboard for your personal GitHub profile README.',
  },
];

function cleanRepo(raw) {
  const s = (raw || '')
    .trim()
    .replace(/^https?:\/\/github\.com\//i, '')
    .replace(/\.git$/i, '')
    .replace(/^\/+|\/+$/g, '');
  const parts = s.split('/').filter(Boolean);
  if (parts.length >= 2 && /^[A-Za-z0-9_.-]+$/.test(parts[0]) && /^[A-Za-z0-9_.-]+$/.test(parts[1])) {
    return `${parts[0]}/${parts[1]}`;
  }
  return '';
}

function buildTargetHref(kind, code, repo) {
  const slug = cleanRepo(repo);
  const ref = (code || '').trim();
  if (kind === 'deploy' || kind === 'edit') {
    const base = kind === 'deploy' ? DEPLOY_URL : EDIT_URL;
    const q = new URLSearchParams();
    if (slug) q.set('repo', `https://github.com/${slug}`);
    if (ref) q.set('ref', ref);
    const qs = q.toString();
    return qs ? `${base}?${qs}` : base;
  }
  if (kind === 'rank') {
    return ref ? `${HOME}/leaderboard?ref=${encodeURIComponent(ref)}` : `${HOME}/leaderboard`;
  }
  return ref ? `${HOME}/?ref=${encodeURIComponent(ref)}` : HOME;
}

function buildImageSrc({ kind, theme, style, fields, label, handle, pillDeploy }) {
  const cleanHandle = (handle || '').trim().replace(/^@/, '') || 'zeekay';
  if (kind === 'built') {
    return `${HOME}/badges/built-with-hanzo${theme === 'dark' ? '-dark' : ''}.svg`;
  }
  if (kind === 'deploy') {
    if (pillDeploy) return `${HOME}/deploy.svg`;
    return `${HOME}/badges/deploy-to-hanzo${theme === 'dark' ? '-dark' : ''}.svg`;
  }
  if (kind === 'edit') {
    return `${HOME}/badges/edit-on-hanzo${theme === 'dark' ? '-dark' : ''}.svg`;
  }
  const q = new URLSearchParams({ theme, style });
  if (kind === 'profile') {
    const chosen = FIELDS.map((f) => f.id).filter((id) => fields.includes(id));
    if (chosen.length > 0 && chosen.length < FIELDS.length) {
      q.set('fields', chosen.join(','));
    }
  }
  const cleanLabel = (label || '').trim().slice(0, 24);
  if (cleanLabel) q.set('label', cleanLabel);
  const endpoint = kind === 'profile' ? '/v1/reward/badge' : '/v1/leaderboard/badge';
  return `${API}${endpoint}/${encodeURIComponent(cleanHandle)}.svg?${q.toString().replace(/%2C/g, ',')}`;
}

function buildAlt(kind) {
  if (kind === 'built') return 'Built with Hanzo';
  if (kind === 'deploy') return 'Deploy to Hanzo';
  if (kind === 'edit') return 'Edit on Hanzo';
  if (kind === 'rank') return 'Hanzo leaderboard';
  return 'Hanzo stats';
}

/* Vector preview for live profile / rank badges when previewing any handle or before public profile is enabled */
function LiveStatsSvgPreview({ kind, theme, style, fields, label, handle, liveStats }) {
  const isDark = theme === 'dark';
  const bg = isDark ? '#0a0a0a' : '#fafafa';
  const fg = isDark ? '#fafafa' : '#0a0a0a';
  const muted = isDark ? '#a1a1aa' : '#52525b';
  const border = isDark ? '#27272a' : '#e4e4e7';
  const pillBg = isDark ? '#18181b' : '#f4f4f5';
  const displayHandle = (handle || '').trim().replace(/^@/, '') || 'zeekay';
  const heading = (label || '').trim() || (kind === 'rank' ? 'Hanzo Leaderboard' : 'Hanzo AI');

  const items = useMemo(() => {
    if (kind === 'rank') {
      return [
        { k: 'Global Rank', v: liveStats?.rank ? `#${liveStats.rank}` : '#12 · Top 1%' },
        { k: 'Points', v: liveStats?.points ? `${liveStats.points.toLocaleString()} pts` : '14,820 pts' },
        { k: 'Compute Volume', v: liveStats?.tokens || '10B+ tokens' },
      ];
    }
    const map = {
      level: { k: 'Level', v: liveStats?.level || 'Lv 7 · Architect' },
      points: { k: 'Points', v: liveStats?.points ? `${liveStats.points.toLocaleString()} pts` : '14,820 pts' },
      tokens: { k: 'Tokens', v: liveStats?.tokens || '10B+ club' },
      badges: { k: 'Badges', v: liveStats?.badges || '12 unlocked' },
    };
    return FIELDS.map((f) => f.id)
      .filter((id) => fields.includes(id))
      .map((id) => map[id]);
  }, [kind, fields, liveStats]);

  if (style === 'flat') {
    const summary = items.map((i) => i.v).join('  ·  ');
    return (
      <div className={`bdg-live-flat ${isDark ? 'is-dark' : 'is-light'}`} role="img" aria-label={`${heading}: ${summary}`}>
        <span className="bdg-live-flat-left">
          <svg viewBox="0 0 67 67" width="13" height="13" aria-hidden="true">
            <path fill="currentColor" d="M22.21 67V44.6369H0V67H22.21Z" />
            <path fill="currentColor" d="M66.7038 22.3184H22.2534L0.0878906 44.6367H44.4634L66.7038 22.3184Z" />
            <path fill="currentColor" d="M22.21 0H0V22.3184H22.21V0Z" />
            <path fill="currentColor" d="M66.7198 0H44.5098V22.3184H66.7198V0Z" />
            <path fill="currentColor" d="M66.7198 67V44.6369H44.5098V67H66.7198Z" />
          </svg>
          <span>{heading}</span>
        </span>
        <span className="bdg-live-flat-right">
          <strong>@{displayHandle}</strong>
          <span>{summary}</span>
        </span>
      </div>
    );
  }

  return (
    <div
      className="bdg-live-card"
      style={{ background: bg, color: fg, borderColor: border }}
      role="img"
      aria-label={`${heading} stats card for @${displayHandle}`}
    >
      <div className="bdg-live-card-top">
        <div className="bdg-live-card-brand">
          <svg viewBox="0 0 67 67" width="18" height="18" aria-hidden="true">
            <path fill={fg} d="M22.21 67V44.6369H0V67H22.21Z" />
            <path fill={fg} d="M66.7038 22.3184H22.2534L0.0878906 44.6367H44.4634L66.7038 22.3184Z" />
            <path fill={fg} d="M22.21 0H0V22.3184H22.21V0Z" />
            <path fill={fg} d="M66.7198 0H44.5098V22.3184H66.7198V0Z" />
            <path fill={fg} d="M66.7198 67V44.6369H44.5098V67H66.7198Z" />
          </svg>
          <span>{heading}</span>
        </div>
        <span className="bdg-live-card-handle" style={{ color: muted }}>
          @{displayHandle}
        </span>
      </div>
      <div className="bdg-live-card-grid">
        {items.map((item) => (
          <div key={item.k} className="bdg-live-card-cell" style={{ background: pillBg, borderColor: border }}>
            <span className="bdg-live-card-k" style={{ color: muted }}>
              {item.k}
            </span>
            <span className="bdg-live-card-v">{item.v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Badge() {
  const [kind, setKind] = useState('profile');
  const [theme, setTheme] = useState('dark');
  const [style, setStyle] = useState('card');
  const [pillDeploy, setPillDeploy] = useState(false);
  const [fields, setFields] = useState(['level', 'points', 'tokens', 'badges']);
  const [label, setLabel] = useState('');
  const [handle, setHandle] = useState('zeekay');
  const [repo, setRepo] = useState('hanzoai/hanzo');
  const [refCode, setRefCode] = useState('');
  const [format, setFormat] = useState('markdown');
  const [copiedKey, setCopiedKey] = useState('');
  const [liveSvgLoaded, setLiveSvgLoaded] = useState(false);
  const [signedProfile, setSignedProfile] = useState(null);

  // Opportunistically read signed-in user's handle & referral code from api.hanzo.ai
  useEffect(() => {
    let alive = true;
    fetch(`${API}/v1/reward/me/profile`, { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : null))
      .then((p) => {
        if (!alive || !p) return;
        setSignedProfile(p);
        if (p.handle) setHandle(p.handle);
      })
      .catch(() => undefined);

    fetch(`${API}/v1/referral`, { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : null))
      .then((r) => {
        if (!alive || !r || !r.code) return;
        setRefCode(r.code);
      })
      .catch(() => undefined);

    return () => {
      alive = false;
    };
  }, []);

  const isPersonal = kind === 'profile' || kind === 'rank';
  const isRepoAction = kind === 'deploy' || kind === 'edit';

  const imgSrc = useMemo(
    () =>
      buildImageSrc({
        kind,
        theme: isPersonal ? theme : theme === 'dark' ? 'light' : 'dark',
        style,
        fields,
        label,
        handle,
        pillDeploy,
      }),
    [kind, theme, style, fields, label, handle, pillDeploy, isPersonal],
  );

  useEffect(() => {
    setLiveSvgLoaded(false);
  }, [imgSrc]);

  const targetHref = useMemo(() => buildTargetHref(kind, refCode, repo), [kind, refCode, repo]);
  const altText = useMemo(() => buildAlt(kind), [kind]);

  const markdownSnippet = useMemo(() => `[![${altText}](${imgSrc})](${targetHref})`, [altText, imgSrc, targetHref]);
  const htmlSnippet = useMemo(() => `<a href="${targetHref}"><img src="${imgSrc}" alt="${altText}"></a>`, [altText, imgSrc, targetHref]);
  const activeSnippet = format === 'markdown' ? markdownSnippet : htmlSnippet;

  const toggleField = (id) => {
    setFields((prev) => {
      const has = prev.includes(id);
      if (has && prev.length === 1) return prev;
      return FIELDS.map((f) => f.id).filter((x) => (x === id ? !has : prev.includes(x)));
    });
  };

  const copyText = async (text, key) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey((c) => (c === key ? '' : c)), 2200);
    } catch {}
  };

  const cleanHandle = (handle || '').trim().replace(/^@/, '') || 'zeekay';
  const cleanRepoSlug = cleanRepo(repo) || 'hanzoai/hanzo';
  const githubReadmeTarget = isPersonal
    ? `https://github.com/${cleanHandle}/${cleanHandle}/edit/main/README.md`
    : `https://github.com/${cleanRepoSlug}/edit/main/README.md`;

  const quickPresets = useMemo(
    () => [
      {
        id: 'deploy',
        title: 'Deploy to Hanzo',
        sub: '1-click cloud deploy for any repo README.md',
        badgeSrc: '/badges/deploy-to-hanzo.svg',
        md: `[![Deploy to Hanzo](${HOME}/badges/deploy-to-hanzo.svg)](${ buildTargetHref('deploy', refCode, repo) })`,
      },
      {
        id: 'edit',
        title: 'Edit on Hanzo',
        sub: 'Open repo in Hanzo Dev cloud IDE & agent',
        badgeSrc: '/badges/edit-on-hanzo.svg',
        md: `[![Edit on Hanzo](${HOME}/badges/edit-on-hanzo.svg)](${ buildTargetHref('edit', refCode, repo) })`,
      },
      {
        id: 'built',
        title: 'Built with Hanzo',
        sub: 'Repo badge with your referral link built in',
        badgeSrc: '/badges/built-with-hanzo.svg',
        md: `[![Built with Hanzo](${HOME}/badges/built-with-hanzo.svg)](${ buildTargetHref('built', refCode, repo) })`,
      },
      {
        id: 'profile',
        title: 'Flex Profile Stats',
        sub: `Personal GitHub profile (${cleanHandle}/${cleanHandle})`,
        badgeSrc: null,
        md: `[![Hanzo stats](${API}/v1/reward/badge/${encodeURIComponent(cleanHandle)}.svg?theme=dark&style=card)](${ buildTargetHref('profile', refCode, repo) })`,
      },
      {
        id: 'rank',
        title: 'Global Leaderboard Rank',
        sub: 'Live standing on the Hanzo Leaderboard',
        badgeSrc: null,
        md: `[![Hanzo leaderboard](${API}/v1/leaderboard/badge/${encodeURIComponent(cleanHandle)}.svg?theme=dark&style=flat)](${ buildTargetHref('rank', refCode, repo) })`,
      },
    ],
    [refCode, repo, cleanHandle],
  );

  return (
    <main className="bdg" data-slot="flair-builder" data-state={isPersonal ? 'public' : 'built'}>
      {/* HERO */}
      <section className="bdg-hero">
        <div className="bdg-wrap">
          <div className="bdg-hero-top">
            <span className="bdg-eyebrow">Hanzo Badges · GitHub Profile &amp; Repo READMEs</span>
            <div className="bdg-hero-links">
              <a href="/leaderboard" className="bdg-top-link">
                Live Leaderboard →
              </a>
              <a href="/referral" className="bdg-top-link">
                Referrals &amp; Points →
              </a>
            </div>
          </div>
          <h1 className="bdg-h1">
            Show it off.
          </h1>
          <p className="bdg-lead">
            Add a <strong>Deploy to Hanzo</strong> or <strong>Edit on Hanzo</strong> button to your repository{' '}
            <code>README.md</code>, or flex your live AI compute volume, level, and global leaderboard rank on your
            personal GitHub profile (<code>github.com/&lt;you&gt;/&lt;you&gt;</code>).
          </p>
        </div>
      </section>

      {/* INTERACTIVE STUDIO */}
      <section className="bdg-studioSection" aria-label="Badge builder">
        <div className="bdg-wrap">
          <div className="bdg-studio">
            {/* LEFT: CONTROLS */}
            <div className="bdg-controls" data-slot="flair-controls">
              <div className="bdg-group">
                <span className="bdg-label">1. Choose a badge</span>
                <div className="bdg-kindGrid" role="radiogroup" aria-label="Badge type">
                  {KINDS.map((k) => (
                    <button
                      key={k.id}
                      type="button"
                      role="radio"
                      aria-checked={kind === k.id}
                      className={`bdg-kindBtn ${kind === k.id ? 'is-on' : ''}`}
                      onClick={() => setKind(k.id)}
                    >
                      <span className="bdg-kindTop">
                        <strong>{k.label}</strong>
                        <span className="bdg-kindTag">{k.tag}</span>
                      </span>
                      <span className="bdg-kindDesc">{k.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bdg-row2">
                <div className="bdg-group">
                  <span className="bdg-label">2. Surface theme</span>
                  <div className="bdg-pills" role="radiogroup" aria-label="Theme">
                    <button
                      type="button"
                      role="radio"
                      aria-checked={theme === 'dark'}
                      className={`bdg-pill ${theme === 'dark' ? 'is-on' : ''}`}
                      onClick={() => setTheme('dark')}
                    >
                      Dark README
                    </button>
                    <button
                      type="button"
                      role="radio"
                      aria-checked={theme === 'light'}
                      className={`bdg-pill ${theme === 'light' ? 'is-on' : ''}`}
                      onClick={() => setTheme('light')}
                    >
                      Light README
                    </button>
                  </div>
                </div>

                {isPersonal && (
                  <div className="bdg-group">
                    <span className="bdg-label">3. Layout style</span>
                    <div className="bdg-pills" role="radiogroup" aria-label="Style">
                      <button
                        type="button"
                        role="radio"
                        aria-checked={style === 'card'}
                        className={`bdg-pill ${style === 'card' ? 'is-on' : ''}`}
                        onClick={() => setStyle('card')}
                      >
                        Stats Card
                      </button>
                      <button
                        type="button"
                        role="radio"
                        aria-checked={style === 'flat'}
                        className={`bdg-pill ${style === 'flat' ? 'is-on' : ''}`}
                        onClick={() => setStyle('flat')}
                      >
                        Flat Shield
                      </button>
                    </div>
                  </div>
                )}

                {kind === 'deploy' && (
                  <div className="bdg-group">
                    <span className="bdg-label">3. Button size</span>
                    <div className="bdg-pills" role="radiogroup" aria-label="Button size">
                      <button
                        type="button"
                        role="radio"
                        aria-checked={!pillDeploy}
                        className={`bdg-pill ${!pillDeploy ? 'is-on' : ''}`}
                        onClick={() => setPillDeploy(false)}
                      >
                        Shield (20px)
                      </button>
                      <button
                        type="button"
                        role="radio"
                        aria-checked={pillDeploy}
                        className={`bdg-pill ${pillDeploy ? 'is-on' : ''}`}
                        onClick={() => setPillDeploy(true)}
                      >
                        CTA Button (32px)
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {kind === 'profile' && (
                <div className="bdg-group" data-slot="flair-fields">
                  <span className="bdg-label">Stats to flex on your profile</span>
                  <div className="bdg-pills">
                    {FIELDS.map((f) => {
                      const on = fields.includes(f.id);
                      return (
                        <button
                          key={f.id}
                          type="button"
                          aria-pressed={on}
                          className={`bdg-pill ${on ? 'is-on' : ''}`}
                          onClick={() => toggleField(f.id)}
                        >
                          {f.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="bdg-inputs">
                {isPersonal && (
                  <label className="bdg-field">
                    <span className="bdg-label">Your Hanzo / GitHub handle</span>
                    <input
                      type="text"
                      value={handle}
                      onChange={(e) => setHandle(e.target.value)}
                      placeholder="zeekay"
                      className="bdg-input"
                    />
                  </label>
                )}

                {isRepoAction && (
                  <label className="bdg-field">
                    <span className="bdg-label">Target GitHub repository (owner/repo)</span>
                    <input
                      type="text"
                      value={repo}
                      onChange={(e) => setRepo(e.target.value)}
                      placeholder="hanzoai/hanzo"
                      className="bdg-input"
                    />
                  </label>
                )}

                {isPersonal && (
                  <label className="bdg-field">
                    <span className="bdg-label">Custom badge heading (optional, max 24 chars)</span>
                    <input
                      type="text"
                      maxLength={24}
                      value={label}
                      onChange={(e) => setLabel(e.target.value)}
                      placeholder={kind === 'rank' ? 'Hanzo Leaderboard' : 'Hanzo AI'}
                      className="bdg-input"
                    />
                  </label>
                )}

                <label className="bdg-field">
                  <span className="bdg-label">Referral code (optional — credits you +points on sign-ups)</span>
                  <input
                    type="text"
                    value={refCode}
                    onChange={(e) => setRefCode(e.target.value)}
                    placeholder="e.g. ZEEKAY"
                    className="bdg-input"
                  />
                </label>
              </div>
            </div>

            {/* RIGHT: STAGE + README MOCKUP + SNIPPET */}
            <div className="bdg-previewCol">
              <div className={`bdg-stage ${theme === 'dark' ? 'is-dark' : 'is-light'}`} data-slot="flair-stage">
                <div className="bdg-stageBar">
                  <span className="bdg-stageDots">
                    <i />
                    <i />
                    <i />
                  </span>
                  <span className="bdg-stageFile">
                    {isPersonal ? `${cleanHandle}/${cleanHandle} · README.md` : `${cleanRepoSlug} · README.md`}
                  </span>
                  <span className="bdg-stageTag">{isPersonal ? 'Live SVG' : 'Static Vector SVG'}</span>
                </div>

                <div className="bdg-stageCanvas">
                  {!isPersonal ? (
                    <a href={targetHref} target="_blank" rel="noopener noreferrer" className="bdg-stageLink">
                      <img
                        src={
                          pillDeploy && kind === 'deploy'
                            ? '/deploy.svg'
                            : `/badges/${kind === 'built' ? 'built-with-hanzo' : kind === 'deploy' ? 'deploy-to-hanzo' : 'edit-on-hanzo'}${theme === 'dark' ? '-dark' : ''}.svg`
                        }
                        alt={altText}
                        height={pillDeploy && kind === 'deploy' ? 36 : 28}
                        data-slot="flair-image"
                      />
                    </a>
                  ) : (
                    <div className="bdg-personalPreview">
                      {/* Try loading the live SVG from api.hanzo.ai; show our crisp vector preview while loading or if handle is a preview */}
                      <img
                        src={imgSrc}
                        alt={altText}
                        onLoad={() => setLiveSvgLoaded(true)}
                        onError={() => setLiveSvgLoaded(false)}
                        style={{ display: liveSvgLoaded ? 'block' : 'none', maxHeight: style === 'card' ? 140 : 32 }}
                        data-slot="flair-image"
                      />
                      {!liveSvgLoaded && (
                        <LiveStatsSvgPreview
                          kind={kind}
                          theme={theme}
                          style={style}
                          fields={fields}
                          label={label}
                          handle={cleanHandle}
                        />
                      )}
                    </div>
                  )}
                </div>

                <div className="bdg-stageFoot">
                  <span>Links to: <code>{targetHref}</code></span>
                  {isPersonal && !signedProfile?.public && (
                    <a href="https://hanzo.app/badge" className="bdg-stagePublicLink">
                      Sign in to enable live stats for @{cleanHandle} →
                    </a>
                  )}
                </div>
              </div>

              {/* EMBED SNIPPET */}
              <div className="bdg-embedBox" data-slot="flair-embed">
                <div className="bdg-embedHeader">
                  <div className="bdg-pills" role="radiogroup" aria-label="Snippet format">
                    <button
                      type="button"
                      role="radio"
                      aria-checked={format === 'markdown'}
                      className={`bdg-pill ${format === 'markdown' ? 'is-on' : ''}`}
                      onClick={() => setFormat('markdown')}
                    >
                      Markdown
                    </button>
                    <button
                      type="button"
                      role="radio"
                      aria-checked={format === 'html'}
                      className={`bdg-pill ${format === 'html' ? 'is-on' : ''}`}
                      onClick={() => setFormat('html')}
                    >
                      HTML
                    </button>
                  </div>
                  <div className="bdg-embedActions">
                    <button
                      type="button"
                      className="bdg-copyPrimary"
                      onClick={() => copyText(activeSnippet, 'main')}
                    >
                      {copiedKey === 'main' ? '✓ Copied to clipboard' : `Copy ${format === 'markdown' ? 'Markdown' : 'HTML'}`}
                    </button>
                    <a
                      href={githubReadmeTarget}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bdg-ghBtn"
                    >
                      Add to GitHub README ↗
                    </a>
                  </div>
                </div>
                <pre className="bdg-code" data-slot="flair-snippet">
                  <code>{activeSnippet}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ALL BADGES QUICK-COPY GALLERY */}
      <section className="bdg-gallery" aria-label="All README badges">
        <div className="bdg-wrap">
          <div className="bdg-secHead">
            <div>
              <span className="bdg-eyebrow">Ready-to-paste snippets</span>
              <h2 className="bdg-h2">Every Hanzo badge for your repo or profile.</h2>
            </div>
            <p className="bdg-secSub">
              Pure vector SVGs with zero external fonts or scripts — guaranteed to render fast through GitHub&apos;s{' '}
              <code>camo.githubusercontent.com</code> image proxy in both dark and light mode.
            </p>
          </div>

          <div className="bdg-presetGrid">
            {quickPresets.map((p) => (
              <div key={p.id} className="bdg-presetCard">
                <div className="bdg-presetTop">
                  <div>
                    <h3 className="bdg-presetTitle">{p.title}</h3>
                    <p className="bdg-presetSub">{p.sub}</p>
                  </div>
                  <button
                    type="button"
                    className="bdg-copyMini"
                    onClick={() => copyText(p.md, p.id)}
                  >
                    {copiedKey === p.id ? '✓ Copied' : 'Copy Markdown'}
                  </button>
                </div>

                <div className="bdg-presetPreview">
                  {p.badgeSrc ? (
                    <div className="bdg-presetPair">
                      <span className="bdg-presetSwatch is-light" title="On light README">
                        <img src={p.badgeSrc} alt={p.title} height="20" />
                      </span>
                      <span className="bdg-presetSwatch is-dark" title="On dark README">
                        <img src={p.badgeSrc.replace('.svg', '-dark.svg')} alt={`${p.title} dark`} height="20" />
                      </span>
                    </div>
                  ) : (
                    <LiveStatsSvgPreview
                      kind={p.id}
                      theme="dark"
                      style="flat"
                      fields={['level', 'points', 'tokens']}
                      label=""
                      handle={cleanHandle}
                    />
                  )}
                </div>

                <pre className="bdg-presetCode">
                  <code>{p.md}</code>
                </pre>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
