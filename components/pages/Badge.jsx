'use client';
import { useEffect, useMemo, useState } from 'react';
import './Badge.css';

const API = 'https://api.hanzo.ai';
const HOME = 'https://hanzo.ai';
const DEPLOY_URL = 'https://platform.hanzo.ai/deploy';
const EDIT_URL = 'https://hanzo.app/dev';

const PROFILES = {
  zeekay: {
    handle: 'zeekay',
    name: 'Zach Kelling',
    role: 'Founding Maintainer · #1 Fleet',
    rank: '#1 Global',
    level: 'Lv 10 · Architect',
    points: '1,510 pts',
    tokens: '106M tok',
    badges: '12 badges',
    readmeRepo: 'zeekay/zeekay',
    staticFlat: `${HOME}/badges/zeekay.svg`,
    staticFlatLight: `${HOME}/badges/zeekay-dark.svg`,
    staticSquare: `${HOME}/badges/zeekay-square.svg`,
    staticRank: `${HOME}/badges/zeekay-rank.svg`,
  },
  zooqueen: {
    handle: 'zooqueen',
    name: 'Antje Worring',
    role: 'CEO @ Hanzo AI · Core Contributor',
    rank: '#3 Global',
    level: 'Lv 8 · Core',
    points: '252 pts',
    tokens: '5.2M tok',
    badges: '9 badges',
    readmeRepo: 'zooqueen/antjeworring.com',
    staticFlat: `${HOME}/badges/zooqueen.svg`,
    staticFlatLight: `${HOME}/badges/zooqueen-dark.svg`,
    staticSquare: `${HOME}/badges/zooqueen-square.svg`,
    staticRank: `${HOME}/badges/zooqueen-rank.svg`,
  },
  valerypetrov: {
    handle: 'valerypetrov',
    name: 'zlatan mioslav',
    role: 'Bug Hunter · Top 10',
    rank: '#2 Hunter',
    level: 'Lv 6 · Hunter',
    points: '192 pts',
    tokens: '4.3M tok',
    badges: '7 badges',
    readmeRepo: 'valerypetrov/valerypetrov',
    staticFlat: `${HOME}/badges/valerypetrov.svg`,
    staticFlatLight: `${HOME}/badges/valerypetrov-dark.svg`,
    staticSquare: `${HOME}/badges/valerypetrov.svg`,
    staticRank: `${HOME}/badges/valerypetrov.svg`,
  },
};

const FIELDS = [
  { id: 'rank', label: 'Rank' },
  { id: 'level', label: 'Level' },
  { id: 'points', label: 'Points' },
  { id: 'tokens', label: 'Tokens' },
  { id: 'badges', label: 'Badges' },
];

const ACCENTS = [
  { id: 'carbon', label: 'Carbon', bg: '#18181b', fg: '#fafafa' },
  { id: 'emerald', label: 'Emerald', bg: '#059669', fg: '#ffffff' },
  { id: 'violet', label: 'Violet', bg: '#7c3aed', fg: '#ffffff' },
  { id: 'amber', label: 'Amber', bg: '#d97706', fg: '#ffffff' },
  { id: 'cyan', label: 'Cyan', bg: '#0891b2', fg: '#ffffff' },
  { id: 'light', label: 'Snow', bg: '#f4f4f5', fg: '#0a0a0a' },
];

const KINDS = [
  {
    id: 'profile',
    label: 'Flex your stats',
    tag: 'GitHub Profile',
    desc: 'Standard horizontal GitHub badge or wide stats strip for your personal README.md — shows your Hanzo rank, points, and token volume.',
  },
  {
    id: 'deploy',
    label: 'Deploy to Hanzo',
    tag: 'Repo Action',
    desc: 'One-click cloud deploy badge for any open-source repository README.md. Launches your repo directly on Hanzo Cloud.',
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
    desc: 'Standard 20px vector badge for projects powered by Zen, Kai, Enso, Hanzo MCP, or Hanzo Cloud.',
  },
  {
    id: 'rank',
    label: 'Leaderboard rank',
    tag: 'GitHub Profile',
    desc: 'Compact global standing shield from the Hanzo Leaderboard for your personal GitHub profile README.',
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

function buildTargetHref(kind, code, repo, handle) {
  const slug = cleanRepo(repo);
  const ref = (code || handle || '').trim().replace(/^@/, '');
  if (kind === 'deploy' || kind === 'edit') {
    const base = kind === 'deploy' ? DEPLOY_URL : EDIT_URL;
    const q = new URLSearchParams();
    if (slug) q.set('repo', `https://github.com/${slug}`);
    if (ref) q.set('ref', ref);
    const qs = q.toString();
    return qs ? `${base}?${qs}` : base;
  }
  if (kind === 'rank' || kind === 'profile') {
    return ref ? `${HOME}/leaderboard?ref=${encodeURIComponent(ref)}` : `${HOME}/leaderboard`;
  }
  return ref ? `${HOME}/?ref=${encodeURIComponent(ref)}` : HOME;
}

function buildImageSrc({ kind, theme, style, fields, label, handle, pillDeploy, accent }) {
  const cleanHandle = (handle || '').trim().replace(/^@/, '').toLowerCase() || 'zeekay';
  if (kind === 'built') {
    return `${HOME}/badges/built-with-hanzo${theme === 'light' ? '-dark' : ''}.svg`;
  }
  if (kind === 'deploy') {
    if (pillDeploy) return `${HOME}/deploy.svg`;
    return `${HOME}/badges/deploy-to-hanzo${theme === 'light' ? '-dark' : ''}.svg`;
  }
  if (kind === 'edit') {
    return `${HOME}/badges/edit-on-hanzo${theme === 'light' ? '-dark' : ''}.svg`;
  }

  // Known featured profiles have pre-rendered zero-latency vector SVGs at /badges/<handle>*.svg
  const preset = PROFILES[cleanHandle];
  const isDefaultFields = fields.length === 3 && fields.includes('rank') && fields.includes('points') && fields.includes('tokens') && !label.trim();
  if (preset && isDefaultFields && style !== 'strip') {
    if (kind === 'rank') return preset.staticRank;
    if (style === 'square') return preset.staticSquare;
    if (theme === 'light' || accent === 'light') return preset.staticFlatLight;
    return preset.staticFlat;
  }

  const apiStyle = style === 'strip' ? 'card' : 'flat';
  const q = new URLSearchParams({ theme, style: apiStyle });
  if (kind === 'profile') {
    const apiFields = fields.filter((f) => ['level', 'points', 'tokens', 'badges'].includes(f));
    if (apiFields.length > 0 && apiFields.length < 4) {
      q.set('fields', apiFields.join(','));
    }
  }
  const cleanLabel = (label || '').trim().slice(0, 24);
  if (cleanLabel) q.set('label', cleanLabel);
  const endpoint = kind === 'profile' ? '/v1/reward/badge' : '/v1/leaderboard/badge';
  return `${API}${endpoint}/${encodeURIComponent(cleanHandle)}.svg?${q.toString().replace(/%2C/g, ',')}`;
}

function buildAlt(kind, handle) {
  const h = (handle || '').trim().replace(/^@/, '') || 'zeekay';
  if (kind === 'built') return 'Built with Hanzo';
  if (kind === 'deploy') return 'Deploy to Hanzo';
  if (kind === 'edit') return 'Edit on Hanzo';
  if (kind === 'rank') return `Hanzo Leaderboard @${h}`;
  return `Hanzo @${h}`;
}

/* Standard horizontal GitHub badge (20px flat / flat-square / 24px pill) or wide 4-col horizontal strip */
function CustomBadgePreview({ kind, style, fields, label, handle, accent }) {
  const cleanHandle = (handle || '').trim().replace(/^@/, '').toLowerCase() || 'zeekay';
  const preset = PROFILES[cleanHandle] || {
    handle: cleanHandle,
    rank: '#12 Global',
    level: 'Lv 7 · Builder',
    points: '1,240 pts',
    tokens: '10M+ tok',
    badges: '6 badges',
  };
  const accentObj = ACCENTS.find((a) => a.id === accent) || ACCENTS[0];
  const heading = (label || '').trim() || (kind === 'rank' ? 'Hanzo Rank' : 'Hanzo');

  const parts = useMemo(() => {
    if (kind === 'rank') {
      return [preset.rank, preset.points];
    }
    const map = {
      rank: preset.rank,
      level: preset.level,
      points: preset.points,
      tokens: preset.tokens,
      badges: preset.badges,
    };
    return FIELDS.map((f) => f.id)
      .filter((id) => fields.includes(id))
      .map((id) => map[id]);
  }, [kind, fields, preset]);

  if (style === 'strip') {
    const stripCells = [
      { k: 'Handle', v: `@${cleanHandle}` },
      { k: 'Standing', v: preset.rank },
      { k: 'Score', v: preset.points },
      { k: 'Compute', v: preset.tokens },
    ];
    return (
      <div className="bdg-strip" role="img" aria-label={`${heading} horizontal stats strip for @${cleanHandle}`}>
        <div className="bdg-strip-brand">
          <svg viewBox="0 0 67 67" width="16" height="16" aria-hidden="true">
            <path fill="currentColor" d="M22.21 67V44.6369H0V67H22.21Z" />
            <path fill="currentColor" d="M66.7038 22.3184H22.2534L0.0878906 44.6367H44.4634L66.7038 22.3184Z" />
            <path fill="currentColor" d="M22.21 0H0V22.3184H22.21V0Z" />
            <path fill="currentColor" d="M66.7198 0H44.5098V22.3184H66.7198V0Z" />
            <path fill="currentColor" d="M66.7198 67V44.6369H44.5098V67H66.7198Z" />
          </svg>
          <span>{heading}</span>
        </div>
        <div className="bdg-strip-cells">
          {stripCells.map((c) => (
            <div key={c.k} className="bdg-strip-cell">
              <span className="bdg-strip-k">{c.k}</span>
              <strong className="bdg-strip-v">{c.v}</strong>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const radius = style === 'square' ? '0px' : style === 'pill' ? '999px' : '4px';
  const heightPx = style === 'pill' ? '24px' : '20px';
  const rightText = `@${cleanHandle} · ${parts.join(' · ')}`;

  return (
    <div
      className="bdg-shield"
      style={{ borderRadius: radius, height: heightPx }}
      role="img"
      aria-label={`${heading}: ${rightText}`}
    >
      <span className="bdg-shield-left">
        <svg viewBox="0 0 67 67" width="11" height="11" aria-hidden="true">
          <path fill="#fafafa" d="M22.21 67V44.6369H0V67H22.21Z" />
          <path fill="#fafafa" d="M66.7038 22.3184H22.2534L0.0878906 44.6367H44.4634L66.7038 22.3184Z" />
          <path fill="#fafafa" d="M22.21 0H0V22.3184H22.21V0Z" />
          <path fill="#fafafa" d="M66.7198 0H44.5098V22.3184H66.7198V0Z" />
          <path fill="#fafafa" d="M66.7198 67V44.6369H44.5098V67H66.7198Z" />
        </svg>
        <span>{heading}</span>
      </span>
      <span
        className="bdg-shield-right"
        style={{ background: accentObj.bg, color: accentObj.fg }}
      >
        {rightText}
      </span>
    </div>
  );
}

export default function Badge() {
  // Default to standard horizontal 20px GitHub badge ('flat'), never vertical
  const [kind, setKind] = useState('profile');
  const [theme, setTheme] = useState('dark');
  const [style, setStyle] = useState('flat'); // 'flat' | 'square' | 'pill' | 'strip'
  const [accent, setAccent] = useState('carbon');
  const [pillDeploy, setPillDeploy] = useState(false);
  const [fields, setFields] = useState(['rank', 'points', 'tokens']);
  const [label, setLabel] = useState('');
  const [handle, setHandle] = useState('zeekay');
  const [repo, setRepo] = useState('hanzoai/hanzo');
  const [refCode, setRefCode] = useState('');
  const [format, setFormat] = useState('markdown');
  const [copiedKey, setCopiedKey] = useState('');

  useEffect(() => {
    let alive = true;
    fetch(`${API}/v1/reward/me/profile`, { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : null))
      .then((p) => {
        if (!alive || !p || !p.handle) return;
        setHandle(p.handle);
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
        theme,
        style,
        fields,
        label,
        handle,
        pillDeploy,
        accent,
      }),
    [kind, theme, style, fields, label, handle, pillDeploy, accent],
  );

  const targetHref = useMemo(() => buildTargetHref(kind, refCode, repo, handle), [kind, refCode, repo, handle]);
  const altText = useMemo(() => buildAlt(kind, handle), [kind, handle]);

  const markdownSnippet = useMemo(() => `[![${altText}](${imgSrc})](${targetHref})`, [altText, imgSrc, targetHref]);
  const htmlSnippet = useMemo(() => `<a href="${targetHref}"><img src="${imgSrc}" alt="${altText}" /></a>`, [altText, imgSrc, targetHref]);
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

  const cleanHandle = (handle || '').trim().replace(/^@/, '').toLowerCase() || 'zeekay';
  const cleanRepoSlug = cleanRepo(repo) || 'hanzoai/hanzo';
  const presetProfile = PROFILES[cleanHandle];
  const githubReadmeTarget = isPersonal
    ? `https://github.com/${presetProfile?.readmeRepo || `${cleanHandle}/${cleanHandle}`}/edit/main/README.md`
    : `https://github.com/${cleanRepoSlug}/edit/main/README.md`;

  const quickPresets = useMemo(
    () => [
      {
        id: 'zeekay',
        title: '@zeekay · Personal GitHub Profile Badge',
        sub: 'Live on github.com/zeekay/zeekay · #1 Global · 1,510 pts · 106M tokens',
        badgeSrc: '/badges/zeekay.svg',
        darkSrc: '/badges/zeekay-dark.svg',
        md: `[![Hanzo @zeekay](${HOME}/badges/zeekay.svg)](${HOME}/leaderboard?ref=zeekay)`,
      },
      {
        id: 'zooqueen',
        title: '@zooqueen · Personal GitHub Profile Badge',
        sub: 'Live on github.com/zooqueen · #3 Global · 252 pts · 5.2M tokens',
        badgeSrc: '/badges/zooqueen.svg',
        darkSrc: '/badges/zooqueen-dark.svg',
        md: `[![Hanzo @zooqueen](${HOME}/badges/zooqueen.svg)](${HOME}/leaderboard?ref=zooqueen)`,
      },
      {
        id: 'deploy',
        title: 'Deploy to Hanzo',
        sub: '1-click cloud deploy shield for any repository README.md',
        badgeSrc: '/badges/deploy-to-hanzo.svg',
        darkSrc: '/badges/deploy-to-hanzo-dark.svg',
        md: `[![Deploy to Hanzo](${HOME}/badges/deploy-to-hanzo.svg)](${buildTargetHref('deploy', refCode, repo, handle)})`,
      },
      {
        id: 'edit',
        title: 'Edit on Hanzo',
        sub: 'Open repository in Hanzo Dev cloud IDE & coding agent',
        badgeSrc: '/badges/edit-on-hanzo.svg',
        darkSrc: '/badges/edit-on-hanzo-dark.svg',
        md: `[![Edit on Hanzo](${HOME}/badges/edit-on-hanzo.svg)](${buildTargetHref('edit', refCode, repo, handle)})`,
      },
      {
        id: 'built',
        title: 'Built with Hanzo',
        sub: 'Standard 20px vector repo badge with your referral link',
        badgeSrc: '/badges/built-with-hanzo.svg',
        darkSrc: '/badges/built-with-hanzo-dark.svg',
        md: `[![Built with Hanzo](${HOME}/badges/built-with-hanzo.svg)](${buildTargetHref('built', refCode, repo, handle)})`,
      },
      {
        id: 'rank',
        title: 'Leaderboard Standing Badge',
        sub: 'Compact global rank badge for any GitHub README',
        badgeSrc: cleanHandle === 'zooqueen' ? '/badges/zooqueen-rank.svg' : '/badges/zeekay-rank.svg',
        darkSrc: null,
        md: `[![Hanzo Rank](${HOME}/badges/${cleanHandle === 'zooqueen' ? 'zooqueen' : 'zeekay'}-rank.svg)](${HOME}/leaderboard?ref=${cleanHandle})`,
      },
    ],
    [refCode, repo, handle, cleanHandle],
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
          <h1 className="bdg-h1">Show it off.</h1>
          <p className="bdg-lead">
            Standard horizontal GitHub badges for your repository <code>README.md</code> and personal profile (
            <code>github.com/&lt;you&gt;/&lt;you&gt;</code>) — <strong>Deploy to Hanzo</strong>,{' '}
            <strong>Edit on Hanzo</strong>, <strong>Built with Hanzo</strong>, or flex your live compute volume and
            global leaderboard standing.
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

              {isPersonal && (
                <div className="bdg-group">
                  <span className="bdg-label">Featured profiles (click to preview or type your handle below)</span>
                  <div className="bdg-pills" role="group" aria-label="Featured handles">
                    {Object.values(PROFILES).map((p) => (
                      <button
                        key={p.handle}
                        type="button"
                        className={`bdg-pill ${cleanHandle === p.handle ? 'is-on' : ''}`}
                        onClick={() => setHandle(p.handle)}
                      >
                        @{p.handle} ({p.rank})
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="bdg-row2">
                {isPersonal && (
                  <div className="bdg-group">
                    <span className="bdg-label">2. Badge layout &amp; shape</span>
                    <div className="bdg-pills" role="radiogroup" aria-label="Style">
                      <button
                        type="button"
                        role="radio"
                        aria-checked={style === 'flat'}
                        className={`bdg-pill ${style === 'flat' ? 'is-on' : ''}`}
                        onClick={() => setStyle('flat')}
                      >
                        Flat Shield (20px)
                      </button>
                      <button
                        type="button"
                        role="radio"
                        aria-checked={style === 'square'}
                        className={`bdg-pill ${style === 'square' ? 'is-on' : ''}`}
                        onClick={() => setStyle('square')}
                      >
                        Flat Square
                      </button>
                      <button
                        type="button"
                        role="radio"
                        aria-checked={style === 'pill'}
                        className={`bdg-pill ${style === 'pill' ? 'is-on' : ''}`}
                        onClick={() => setStyle('pill')}
                      >
                        Capsule Pill
                      </button>
                      <button
                        type="button"
                        role="radio"
                        aria-checked={style === 'strip'}
                        className={`bdg-pill ${style === 'strip' ? 'is-on' : ''}`}
                        onClick={() => setStyle('strip')}
                      >
                        Wide Strip
                      </button>
                    </div>
                  </div>
                )}

                <div className="bdg-group">
                  <span className="bdg-label">{isPersonal ? '3. README canvas' : '2. Badge theme'}</span>
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

              {isPersonal && style !== 'strip' && (
                <div className="bdg-group">
                  <span className="bdg-label">Accent color</span>
                  <div className="bdg-pills" role="radiogroup" aria-label="Accent color">
                    {ACCENTS.map((a) => (
                      <button
                        key={a.id}
                        type="button"
                        role="radio"
                        aria-checked={accent === a.id}
                        className={`bdg-pill bdg-colorPill ${accent === a.id ? 'is-on' : ''}`}
                        onClick={() => setAccent(a.id)}
                      >
                        <i className="bdg-SwatchDot" style={{ background: a.bg }} />
                        {a.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {kind === 'profile' && style !== 'strip' && (
                <div className="bdg-group" data-slot="flair-fields">
                  <span className="bdg-label">Stats shown on badge</span>
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
                    <span className="bdg-label">GitHub / Hanzo handle</span>
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
                    <span className="bdg-label">Left segment label (optional, max 24 chars)</span>
                    <input
                      type="text"
                      maxLength={24}
                      value={label}
                      onChange={(e) => setLabel(e.target.value)}
                      placeholder={kind === 'rank' ? 'Hanzo Rank' : 'Hanzo'}
                      className="bdg-input"
                    />
                  </label>
                )}

                <label className="bdg-field">
                  <span className="bdg-label">Referral code (optional — credits +points on sign-ups)</span>
                  <input
                    type="text"
                    value={refCode}
                    onChange={(e) => setRefCode(e.target.value)}
                    placeholder={cleanHandle}
                    className="bdg-input"
                  />
                </label>
              </div>
            </div>

            {/* RIGHT: STAGE + README PREVIEW + SNIPPET */}
            <div className="bdg-previewCol">
              <div className={`bdg-stage ${theme === 'dark' ? 'is-dark' : 'is-light'}`} data-slot="flair-stage">
                <div className="bdg-stageBar">
                  <span className="bdg-stageDots">
                    <i />
                    <i />
                    <i />
                  </span>
                  <span className="bdg-stageFile">
                    {isPersonal
                      ? `${presetProfile?.readmeRepo || `${cleanHandle}/${cleanHandle}`} · README.md`
                      : `${cleanRepoSlug} · README.md`}
                  </span>
                  <span className="bdg-stageTag">{style === 'strip' ? 'Wide Strip' : 'Standard 20px GitHub Shield'}</span>
                </div>

                <div className="bdg-stageCanvas">
                  {!isPersonal ? (
                    <a href={targetHref} target="_blank" rel="noopener noreferrer" className="bdg-stageLink">
                      <img
                        src={
                          pillDeploy && kind === 'deploy'
                            ? '/deploy.svg'
                            : `/badges/${kind === 'built' ? 'built-with-hanzo' : kind === 'deploy' ? 'deploy-to-hanzo' : 'edit-on-hanzo'}${theme === 'light' ? '-dark' : ''}.svg`
                        }
                        alt={altText}
                        height={pillDeploy && kind === 'deploy' ? 32 : 20}
                        data-slot="flair-image"
                      />
                    </a>
                  ) : (
                    <div className="bdg-personalPreview">
                      <CustomBadgePreview
                        kind={kind}
                        style={style}
                        fields={fields}
                        label={label}
                        handle={cleanHandle}
                        accent={accent}
                      />
                      {/* Companion row showing how it sits alongside standard repo badges in a GitHub README */}
                      {style !== 'strip' && (
                        <div className="bdg-readmeRowPreview">
                          <span className="bdg-readmeRowLabel">In your README badge bar:</span>
                          <div className="bdg-readmeRowBadges">
                            <img
                              src={
                                cleanHandle === 'zooqueen'
                                  ? '/badges/zooqueen.svg'
                                  : cleanHandle === 'valerypetrov'
                                    ? '/badges/valerypetrov.svg'
                                    : '/badges/zeekay.svg'
                              }
                              alt={altText}
                              height="20"
                              data-slot="flair-image"
                            />
                            <img src="/badges/built-with-hanzo.svg" alt="Built with Hanzo" height="20" />
                            <img src="/badges/deploy-to-hanzo.svg" alt="Deploy to Hanzo" height="20" />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="bdg-stageFoot">
                  <span>
                    Target URL: <code>{targetHref}</code>
                  </span>
                  <a
                    href={`https://github.com/${presetProfile?.readmeRepo || 'zeekay/zeekay'}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bdg-stagePublicLink"
                  >
                    View live on GitHub (@{cleanHandle}) ↗
                  </a>
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
              <span className="bdg-eyebrow">Live on GitHub · Ready-to-paste snippets</span>
              <h2 className="bdg-h2">Standard GitHub badges for profiles &amp; repositories.</h2>
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
                  <div className="bdg-presetPair">
                    <span className="bdg-presetSwatch is-dark" title="On dark README">
                      <img src={p.badgeSrc} alt={p.title} height="20" />
                    </span>
                    {p.darkSrc && (
                      <span className="bdg-presetSwatch is-light" title="On light README">
                        <img src={p.darkSrc} alt={`${p.title} light`} height="20" />
                      </span>
                    )}
                  </div>
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
