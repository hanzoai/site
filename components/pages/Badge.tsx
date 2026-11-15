'use client';
import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from 'react';
import { API, FIELDS, FINISHES, KINDS, PROFILES, badge } from './Badge.links';
import './Badge.css';

/* Crisp monochrome geometric vector icons */
interface IconProps {
  name: string;
  size?: number;
}
function Icon({ name, size = 14 }: IconProps) {
  switch (name) {
    case 'hanzo':
      return (
        <svg viewBox="0 0 67 67" width={size} height={size} aria-hidden="true">
          <path fill="currentColor" d="M22.21 67V44.6369H0V67H22.21Z" />
          <path fill="currentColor" d="M66.7038 22.3184H22.2534L0.0878906 44.6367H44.4634L66.7038 22.3184Z" />
          <path fill="currentColor" d="M22.21 0H0V22.3184H22.21V0Z" />
          <path fill="currentColor" d="M66.7198 0H44.5098V22.3184H66.7198V0Z" />
          <path fill="currentColor" d="M66.7198 67V44.6369H44.5098V67H66.7198Z" />
        </svg>
      );
    case 'crown':
      return (
        <svg viewBox="0 0 16 16" width={size} height={size} fill="none" aria-hidden="true">
          <path
            d="M2.2 11.8L3.3 4.8L6.3 7.6L8 3.2L9.7 7.6L12.7 4.8L13.8 11.8H2.2Z"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
          <path d="M2.5 13.5H13.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      );
    case 'trophy':
      return (
        <svg viewBox="0 0 16 16" width={size} height={size} fill="none" aria-hidden="true">
          <path
            d="M4.5 2.5H11.5V6.5C11.5 8.43 9.93 10 8 10C6.07 10 4.5 8.43 4.5 6.5V2.5Z"
            stroke="currentColor"
            strokeWidth="1.4"
          />
          <path d="M4.5 4H2.5V5.5C2.5 6.88 3.4 7.8 4.6 8M11.5 4H13.5V5.5C13.5 6.88 12.6 7.8 11.4 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          <path d="M8 10V13M5.5 13.5H10.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      );
    case 'rocket':
      return (
        <svg viewBox="0 0 16 16" width={size} height={size} fill="none" aria-hidden="true">
          <path
            d="M9.5 2.5C11.8 2.5 13.5 2.5 13.5 2.5C13.5 2.5 13.5 4.2 13.5 6.5C13.5 9.2 10.6 11.4 8.5 12.2L3.8 7.5C4.6 5.4 6.8 2.5 9.5 2.5Z"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
          <circle cx="10" cy="6" r="1.1" fill="currentColor" />
          <path d="M3.8 10.2L2.2 13.8L5.8 12.2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'terminal':
      return (
        <svg viewBox="0 0 16 16" width={size} height={size} fill="none" aria-hidden="true">
          <rect x="1.75" y="2.75" width="12.5" height="10.5" rx="2.25" stroke="currentColor" strokeWidth="1.4" />
          <path d="M4.5 6L6.8 8L4.5 10M8.2 10H11.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'bolt':
      return (
        <svg viewBox="0 0 16 16" width={size} height={size} fill="none" aria-hidden="true">
          <path d="M8.8 1.8L3.5 8.8H7.8L7.2 14.2L12.5 7.2H8.2L8.8 1.8Z" fill="currentColor" />
        </svg>
      );
    case 'spark':
      return (
        <svg viewBox="0 0 16 16" width={size} height={size} fill="none" aria-hidden="true">
          <path d="M8 1.6L9.7 6.3L14.4 8L9.7 9.7L8 14.4L6.3 9.7L1.6 8L6.3 6.3L8 1.6Z" fill="currentColor" />
        </svg>
      );
    case 'layers':
      return (
        <svg viewBox="0 0 16 16" width={size} height={size} fill="none" aria-hidden="true">
          <path d="M8 2.2L14 5.4L8 8.6L2 5.4L8 2.2Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
          <path d="M2 8.4L8 11.6L14 8.4M2 11.2L8 14.2L14 11.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'medal':
      return (
        <svg viewBox="0 0 16 16" width={size} height={size} fill="none" aria-hidden="true">
          <circle cx="8" cy="9.5" r="4" stroke="currentColor" strokeWidth="1.4" />
          <path d="M6 2H10L9 5.5H7L6 2Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
        </svg>
      );
    case 'github':
      return (
        <svg viewBox="0 0 16 16" width={size} height={size} fill="currentColor" aria-hidden="true">
          <path d="M8 0.2A8 8 0 0 0 5.47 15.79c.4.07.55-.17.55-.38v-1.34c-2.23.49-2.7-1.07-2.7-1.07-.36-.93-.89-1.17-.89-1.17-.73-.5.05-.49.05-.49.81.06 1.23.83 1.23.83.72 1.22 1.88.87 2.34.66.07-.52.28-.87.5-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.55 7.55 0 0 1 4 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48v2.2c0 .21.15.46.55.38A8.01 8.01 0 0 0 8 0.2Z" />
        </svg>
      );
    case 'moon':
      return (
        <svg viewBox="0 0 16 16" width={size} height={size} fill="none" aria-hidden="true">
          <path
            d="M13.2 9.8A5.6 5.6 0 0 1 6.2 2.8a5.6 5.6 0 1 0 7 7Z"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'sun':
      return (
        <svg viewBox="0 0 16 16" width={size} height={size} fill="none" aria-hidden="true">
          <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.4" />
          <path
            d="M8 1.5V3M8 13V14.5M1.5 8H3M13 8H14.5M3.4 3.4L4.5 4.5M11.5 11.5L12.6 12.6M12.6 3.4L11.5 4.5M4.5 11.5L3.4 12.6"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      );
    case 'copy':
      return (
        <svg viewBox="0 0 16 16" width={size} height={size} fill="none" aria-hidden="true">
          <rect x="5.25" y="5.25" width="8.5" height="8.5" rx="1.75" stroke="currentColor" strokeWidth="1.4" />
          <path d="M10.5 5.25V3.5A1.25 1.25 0 0 0 9.25 2.25H3.5A1.25 1.25 0 0 0 2.25 3.5V9.25A1.25 1.25 0 0 0 3.5 10.5H5.25" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      );
    case 'check':
      return (
        <svg viewBox="0 0 16 16" width={size} height={size} fill="none" aria-hidden="true">
          <path d="M3 8.5L6.5 12L13 4.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'ext':
      return (
        <svg viewBox="0 0 16 16" width={size} height={size} fill="none" aria-hidden="true">
          <path d="M4.5 11.5L11.5 4.5M6 4.5H11.5V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'link':
      return (
        <svg viewBox="0 0 16 16" width={size} height={size} fill="none" aria-hidden="true">
          <path
            d="M6.8 9.2L9.2 6.8M5.5 10.5L4.2 11.8a2.1 2.1 0 0 1-3-3L2.5 7.5M10.5 5.5l1.3-1.3a2.1 2.1 0 0 1 3 3l-1.3 1.3"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      );
    default:
      return null;
  }
}

/* Monochrome horizontal GitHub shield with micro-icons, or 4-col horizontal strip */
function CustomBadgePreview({
  kind,
  style,
  fields,
  label,
  handle,
  finish,
}: {
  kind: string;
  style: string;
  fields: string[];
  label: string;
  handle: string;
  finish: string;
}) {
  const cleanHandle = (handle || '').trim().replace(/^@/, '').toLowerCase() || 'zeekay';
  const preset = PROFILES[cleanHandle as keyof typeof PROFILES] || {
    handle: cleanHandle,
    rank: '#12',
    rankLong: '#12 Global',
    level: 'Lv 7',
    points: '1,240 pts',
    tokens: '10M+ tok',
    badges: '6 badges',
  };
  const fin = FINISHES.find((f) => f.id === finish) || FINISHES[0];
  const heading = (label || '').trim() || (kind === 'rank' ? 'Rank' : 'Hanzo');

  const items = useMemo(() => {
    if (kind === 'rank') {
      return [
        { icon: 'crown', text: preset.rankLong, bold: true },
        { icon: 'bolt', text: preset.points, bold: false },
      ];
    }
    const map: Record<string, { icon: string; text: string; bold: boolean }> = {
      rank: { icon: 'crown', text: preset.rank, bold: true },
      points: { icon: 'bolt', text: preset.points, bold: false },
      tokens: { icon: 'spark', text: preset.tokens, bold: false },
      level: { icon: 'layers', text: preset.level, bold: false },
      badges: { icon: 'medal', text: preset.badges, bold: false },
    };
    const out: Array<{ icon: string | null; text: string; bold: boolean }> = [
      { icon: null, text: `@${cleanHandle}`, bold: true },
    ];
    for (const f of FIELDS) {
      if (fields.includes(f.id)) out.push(map[f.id]);
    }
    return out;
  }, [kind, fields, preset, cleanHandle]);

  if (style === 'strip') {
    const stripCells = [
      { k: 'Builder', v: `@${cleanHandle}`, icon: 'github' },
      { k: 'Standing', v: preset.rankLong, icon: 'crown' },
      { k: 'Points', v: preset.points, icon: 'bolt' },
      { k: 'Compute', v: preset.tokens, icon: 'spark' },
    ];
    return (
      <span
        className="bdg-strip"
        style={{ background: fin.rightBg, color: fin.rightFg, borderColor: fin.border }}
      >
        <span className="bdg-strip-brand" style={{ borderColor: fin.border }}>
          <Icon name="hanzo" size={14} />
          <span>{heading}</span>
        </span>
        <span className="bdg-strip-cells">
          {stripCells.map((c) => (
            <span key={c.k} className="bdg-strip-cell">
              <span className="bdg-strip-k">
                <Icon name={c.icon} size={10} />
                {c.k}
              </span>
              <strong className="bdg-strip-v">{c.v}</strong>
            </span>
          ))}
        </span>
      </span>
    );
  }

  const radius = style === 'square' ? '0px' : style === 'pill' ? '999px' : '4px';
  const heightPx = style === 'pill' ? '22px' : '20px';

  return (
    <span
      className="bdg-shield"
      style={{
        borderRadius: radius,
        height: heightPx,
        borderColor: fin.border,
      }}
      data-slot="flair-image"
    >
      <span
        className="bdg-shield-left"
        style={{ background: fin.leftBg, color: fin.leftFg, borderRightColor: fin.border }}
      >
        <Icon name="hanzo" size={11} />
        <span>{heading}</span>
      </span>
      <span
        className="bdg-shield-right"
        style={{ background: fin.rightBg, color: fin.rightFg }}
      >
        {items.map((it, idx) => (
          <span key={`${it.text}-${idx}`} className="bdg-shield-seg">
            {idx > 0 && <i className="bdg-shield-dot" />}
            {it.icon && (
              <span className="bdg-shield-ico">
                <Icon name={it.icon} size={10} />
              </span>
            )}
            <span className={it.bold ? 'is-bold' : 'is-reg'}>{it.text}</span>
          </span>
        ))}
      </span>
    </span>
  );
}

/* the shields' own widths at 20px, so an image holds its place before it loads (the files in /public/badges say the same in their width attribute) */
const SHIELD_W: Record<string, number> = { 'built-with-hanzo': 152, 'deploy-to-hanzo': 136, 'edit-on-hanzo': 160, zeekay: 315, zooqueen: 318, 'zeekay-rank': 217, 'zooqueen-rank': 207, valerypetrov: 336 };
const shieldW = (src: string, h: number) => {
  const w = SHIELD_W[src.replace(/^.*\//, '').replace(/\.svg$/, '').replace(/-(dark|square)$/, '')];
  return w ? Math.round((w * h) / 20) : undefined;
};

/* a separate arrow glyph that nudges on hover (hz-arrow) */
function Arrow({ size }: { size: number }) {
  return (
    <span className="hz-arrow" aria-hidden="true">
      <Icon name="ext" size={size} />
    </span>
  );
}

function Fold({ label, className = '', slot, children }: { label: string; className?: string; slot?: string; children: ReactNode }) {
  return (
    <details className={`hz-card hz-fold bdg-group bdg-fold ${className}`} data-slot={slot}>
      <summary className="bdg-label">{label}</summary>
      {children}
    </details>
  );
}

const STYLES = [
  { id: 'flat', label: 'Flat Shield (20px)' },
  { id: 'square', label: 'Flat Square' },
  { id: 'pill', label: 'Capsule Pill' },
  { id: 'strip', label: 'Wide Strip' },
];

/* the kit names a grid after its item count, so the last row is always full */
const gridOf = (n: number) => (n >= 4 ? 'hz-grid-4' : n === 3 ? 'hz-grid-3' : n === 2 ? 'hz-grid-2' : 'bdg-grid-1');

export default function Badge() {
  const [kind, setKind] = useState('profile');
  const [theme, setTheme] = useState('dark');
  const [style, setStyle] = useState('flat'); // 'flat' | 'square' | 'pill' | 'strip'
  const [finish, setFinish] = useState('graphite');
  const [pillDeploy, setPillDeploy] = useState(false);
  const [fields, setFields] = useState(['rank', 'points', 'tokens']);
  const [label, setLabel] = useState('');
  const [handle, setHandle] = useState('zeekay');
  const [repo, setRepo] = useState('hanzoai/hanzo');
  const [refCode, setRefCode] = useState('');
  const [format, setFormat] = useState('markdown');
  const [copiedKey, setCopiedKey] = useState('');
  const [landKey, setLandKey] = useState(0); // counts step 1 choices: only they make the new badge land on the README

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

  const {
    isPersonal, isRepoAction, targetHref, altText, activeSnippet, cleanHandle, cleanRepoSlug, presetProfile,
    activeRepoSlug, activeRepoUrl, githubReadmeEditUrl, editCompanionHref, builtCompanionHref, quickPresets, suffix,
    previewSrc,
  } = useMemo(
    () => badge({ kind, theme, style, finish, pillDeploy, fields, label, handle, repo, refCode, format }),
    [kind, theme, style, finish, pillDeploy, fields, label, handle, repo, refCode, format],
  );

  const toggleField = (id: string) => {
    setFields((prev) => {
      const has = prev.includes(id);
      if (has && prev.length === 1) return prev;
      return FIELDS.map((f) => f.id).filter((x) => (x === id ? !has : prev.includes(x)));
    });
  };

  const copyText = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey((c) => (c === key ? '' : c)), 2200);
    } catch {}
  };

  // the snippet swaps in when a choice changes it, not on every keystroke in a text field
  const swapKey = [kind, theme, style, finish, pillDeploy, format, fields.join()].join('|');
  const [firstKey] = useState(swapKey);
  const chose = swapKey !== firstKey || landKey > 0; // the arrival already moves the split: the snippet swaps only for a choice

  const pick = (id: string) => {
    if (id === kind) return;
    setKind(id);
    setLandKey((n) => n + 1);
  };

  const showStats = kind === 'profile' && style !== 'strip';
  const steps = (isPersonal ? 2 : 0) + 1 + (kind === 'deploy' ? 1 : 0) + (showStats ? 1 : 0); // layout + finish when personal, canvas, button size, stats
  // the main field sits under step 1; the others are a quiet row under the folded steps
  const primary = isPersonal ? 'handle' : isRepoAction ? 'repo' : 'ref';
  const rest = [isPersonal ? 'label' : '', primary !== 'ref' ? 'ref' : ''].filter(Boolean);
  const field = (id: string) => {
    const spec =
      id === 'handle'
        ? { text: 'GitHub / Hanzo handle', value: handle, set: setHandle, ph: 'zeekay' }
        : id === 'repo'
          ? { text: 'Repository (owner/repo)', value: repo, set: setRepo, ph: 'hanzoai/hanzo' }
          : id === 'label'
            ? { text: 'Left cap label (optional)', value: label, set: setLabel, ph: kind === 'rank' ? 'Rank' : 'Hanzo' }
            : { text: 'Referral code (optional)', value: refCode, set: setRefCode, ph: cleanHandle };
    return (
      <label className="bdg-field" key={id}>
        <span className="bdg-label">{spec.text}</span>
        <span className="hz-field">
          <input
            type="text"
            maxLength={id === 'label' ? 24 : undefined}
            value={spec.value}
            onChange={(e) => spec.set(e.target.value)}
            placeholder={spec.ph}
            className="bdg-input"
          />
        </span>
      </label>
    );
  };

  return (
    <main className="hz bdg" data-slot="flair-builder" data-state={isPersonal ? 'public' : 'built'}>
      {/* HERO */}
      <section className="bdg-hero">
        <div className="hz-wrap">
          <div className="hz-head hz-arrive bdg-head">
            <span className="hz-label bdg-eyebrow">
              <Icon name="hanzo" size={12} />
              <span>GitHub Profile &amp; Repository Badges</span>
            </span>
            <h1 className="bdg-h1">Show it off.</h1>
            <p className="bdg-lead">
              Crisp monochrome GitHub shields for your repository <code>README.md</code> and personal profile (
              <code>github.com/&lt;you&gt;/&lt;you&gt;</code>) — <strong>Deploy to Hanzo</strong>,{' '}
              <strong>Edit on Hanzo</strong>, <strong>Built with Hanzo</strong>, or flex your live compute volume and
              leaderboard rank.
            </p>
            <div className="hz-actions bdg-hero-links">
              <a href="/leaderboard" className="hz-btn hz-btn-sm bdg-top-link">
                <Icon name="trophy" size={13} />
                <span>Leaderboard</span>
              </a>
              <a href="/referral" className="hz-btn hz-btn-sm bdg-top-link">
                <Icon name="spark" size={13} />
                <span>Referrals &amp; Points</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE STUDIO: the live README and its snippet first, then the choices */}
      <section className="bdg-studioSection" aria-label="Badge builder">
        <div className="hz-wrap bdg-studio">
          <div className="bdg-split">
          <div className="bdg-pin">
            <div className="hz-stage bdg-heroStage">
              <div
                className={`bdg-stage hz-gleam ${theme === 'dark' ? 'is-dark' : 'is-light'} ${landKey === 0 ? '' : landKey % 2 ? 'is-landA' : 'is-landB'}`}
                data-slot="flair-stage"
              >
                <div className="bdg-stageBar">
                  <div className="bdg-stageBarLeft">
                    <span className="bdg-stageDots" aria-hidden="true">
                      <i />
                      <i />
                      <i />
                    </span>
                    <a
                      href={activeRepoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bdg-stageRepoLink"
                      title={`Open ${activeRepoSlug} on GitHub`}
                    >
                      <Icon name="github" size={13} />
                      <span>{activeRepoSlug}</span>
                      <span className="bdg-stageTail">
                        <span className="bdg-stageSlash">/</span>
                        <span>README.md</span>
                        <Arrow size={11} />
                      </span>
                    </a>
                  </div>

                  <button
                    type="button"
                    className="bdg-stageThemeToggle"
                    onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
                    title="Toggle README preview surface"
                  >
                    <Icon name={theme === 'dark' ? 'moon' : 'sun'} size={12} />
                    <span>{theme === 'dark' ? 'Dark' : 'Light'}</span>
                  </button>
                </div>

                <div className="bdg-stageCanvas">
                  <div className="bdg-readmeCard">
                    <div className="bdg-readmeHead">
                      <a
                        href={activeRepoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bdg-readmeTitleLink"
                      >
                        <span className="bdg-readmeAvatar" aria-hidden="true">
                          <Icon name={isPersonal ? 'crown' : 'hanzo'} size={14} />
                        </span>
                        <span className="bdg-readmeHeadingText">
                          <strong>
                            {isPersonal
                              ? presetProfile?.name || `@${cleanHandle}`
                              : cleanRepoSlug}
                          </strong>
                          <span>
                            {isPersonal
                              ? `github.com/${activeRepoSlug}`
                              : 'Open-source repository · README.md'}
                          </span>
                        </span>
                      </a>
                      <span className="bdg-clickHint">Click any badge to test link ↗</span>
                    </div>

                    {/* Interactive horizontal README badge bar (every badge is a live clickable <a> link, no dotted divider) */}
                    <div key={landKey} className={`bdg-readmeBadgeBar ${landKey > 0 ? 'hz-swap is-in' : ''}`}>
                      {!isPersonal ? (
                        <>
                          <a
                            href={targetHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bdg-badgeAnchor is-primary"
                            title={`Open ${targetHref}`}
                          >
                            <img
                              src={previewSrc}
                              alt={altText}
                              height={pillDeploy && kind === 'deploy' ? 32 : 20}
                              width={shieldW(previewSrc, pillDeploy && kind === 'deploy' ? 32 : 20)}
                              data-slot="flair-image"
                            />
                          </a>
                          {!pillDeploy && kind !== 'edit' && (
                            <a
                              href={editCompanionHref}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bdg-badgeAnchor is-companion"
                              title={`Open ${editCompanionHref}`}
                            >
                              <img src={`/badges/edit-on-hanzo${suffix}.svg`} alt="Edit on Hanzo" height="20" width={shieldW('edit-on-hanzo', 20)} />
                            </a>
                          )}
                          {!pillDeploy && kind !== 'built' && (
                            <a
                              href={builtCompanionHref}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bdg-badgeAnchor is-companion"
                              title={`Open ${builtCompanionHref}`}
                            >
                              <img src={`/badges/built-with-hanzo${suffix}.svg`} alt="Built with Hanzo" height="20" width={shieldW('built-with-hanzo', 20)} />
                            </a>
                          )}
                        </>
                      ) : (
                        <>
                          <a
                            href={targetHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`bdg-badgeAnchor is-primary ${style === 'strip' ? 'is-full' : ''}`}
                            title={`Open ${targetHref}`}
                          >
                            <CustomBadgePreview
                              kind={kind}
                              style={style}
                              fields={fields}
                              label={label}
                              handle={cleanHandle}
                              finish={finish}
                            />
                          </a>
                          {style !== 'strip' && (
                            <a
                              href={builtCompanionHref}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bdg-badgeAnchor is-companion"
                              title={`Open ${builtCompanionHref}`}
                            >
                              <img src={`/badges/built-with-hanzo${suffix}.svg`} alt="Built with Hanzo" height="20" width={shieldW('built-with-hanzo', 20)} />
                            </a>
                          )}
                        </>
                      )}
                    </div>

                    <p className="bdg-readmeBio">
                      {isPersonal
                        ? presetProfile?.bio ||
                          `Builder on Hanzo Cloud & AI Fleet · View live compute standing and open-source contributions.`
                        : `Deploy one-click to Hanzo Cloud or open directly in Hanzo Dev with full MCP tools and AI coding agent.`}
                    </p>
                  </div>
                </div>

                <div className="bdg-stageFoot">
                  <a
                    href={targetHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bdg-stageTargetLink"
                    title={targetHref}
                  >
                    <Icon name="link" size={12} />
                    <span className="bdg-stageTargetText">{targetHref}</span>
                    <Arrow size={11} />
                  </a>
                  <a
                    href={activeRepoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bdg-stagePublicLink"
                  >
                    <span>GitHub README</span>
                    <Arrow size={11} />
                  </a>
                </div>
              </div>
            </div>

            {/* EMBED SNIPPET */}
            <div className="bdg-embedBox" data-slot="flair-embed">
              <div className="bdg-embedHeader">
                <div
                  className="hz-seg bdg-tabs"
                  style={{ '--hz-seg-i': format === 'markdown' ? 0 : 1, '--hz-seg-n': 2 } as CSSProperties}
                  role="radiogroup"
                  aria-label="Snippet format"
                >
                  <button
                    type="button"
                    role="radio"
                    aria-checked={format === 'markdown'}
                    className={`bdg-tab ${format === 'markdown' ? 'is-on' : ''}`}
                    onClick={() => setFormat('markdown')}
                  >
                    <span>Markdown</span>
                  </button>
                  <button
                    type="button"
                    role="radio"
                    aria-checked={format === 'html'}
                    className={`bdg-tab ${format === 'html' ? 'is-on' : ''}`}
                    onClick={() => setFormat('html')}
                  >
                    <span>HTML</span>
                  </button>
                </div>
                <a
                  href={githubReadmeEditUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hz-btn bdg-ghBtn"
                >
                  <Icon name="github" size={13} />
                  <span>Add to README</span>
                  <Arrow size={11} />
                </a>
              </div>
              <div className="hz-codeblock bdg-codeblock">
                <pre className="hz-code bdg-code" data-slot="flair-snippet">
                  <code key={swapKey} className={chose ? 'hz-swap is-in' : undefined}>
                    {activeSnippet}
                  </code>
                </pre>
                <button
                  type="button"
                  className={`hz-btn hz-btn-primary hz-btn-sm hz-copy hz-gleam bdg-copyPrimary ${copiedKey === 'main' ? 'is-copied' : ''}`}
                  onClick={() => copyText(activeSnippet, 'main')}
                >
                  <Icon name={copiedKey === 'main' ? 'check' : 'copy'} size={13} />
                  <span>
                    {copiedKey === 'main'
                      ? 'Copied'
                      : `Copy ${format === 'markdown' ? 'Markdown' : 'HTML'}`}
                  </span>
                </button>
              </div>
            </div>
          </div>

          <span className="bdg-label bdg-pickLabel">1. Choose a badge</span>

          {/* step 1 and the handle: the right half of the hero */}
          <div className="bdg-pickCol">
            <div className="bdg-group bdg-pick">
              <div className="bdg-kindList" role="radiogroup" aria-label="Badge type">
                {KINDS.map((k) => {
                  const on = kind === k.id;
                  return (
                    <button
                      key={k.id}
                      type="button"
                      role="radio"
                      aria-checked={on}
                      className={`bdg-kindBtn ${on ? 'is-on' : ''}`}
                      onClick={() => pick(k.id)}
                    >
                      <span className="bdg-kindIcon" aria-hidden="true">
                        <Icon name={k.icon} size={16} />
                      </span>
                      <span className="bdg-kindBody">
                        <span className="bdg-kindTop">
                          <strong>{k.label}</strong>
                          <span className="bdg-kindTag">{k.tag}</span>
                        </span>
                        <span className="bdg-kindDesc">{k.desc}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {field(primary)}

            {isPersonal && (
              <Fold label="Featured builders" className="bdg-featured">
                <div className="bdg-chips" role="group" aria-label="Featured handles">
                  {Object.values(PROFILES).map((p) => {
                    const on = cleanHandle === p.handle;
                    return (
                      <button
                        key={p.handle}
                        type="button"
                        className={`bdg-chip ${on ? 'is-on' : ''}`}
                        onClick={() => setHandle(p.handle)}
                      >
                        <Icon name="crown" size={12} />
                        <span>@{p.handle}</span>
                        <em className="bdg-chipMeta">{p.rankLong}</em>
                      </button>
                    );
                  })}
                </div>
              </Fold>
            )}
          </div>
        </div>

        {/* steps 2 to 5 fold away: four equal closed tiles, each opened by its own numbered label */}
        <div className="bdg-controls" data-slot="flair-controls">
          <div className={`hz-grid ${gridOf(steps)} bdg-steps`}>
            {isPersonal && (
              <Fold label="2. Layout &amp; shape">
                <div className="bdg-chips" role="radiogroup" aria-label="Style">
                  {STYLES.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      role="radio"
                      aria-checked={style === s.id}
                      className={`bdg-chip ${style === s.id ? 'is-on' : ''}`}
                      onClick={() => setStyle(s.id)}
                    >
                      <span>{s.label}</span>
                    </button>
                  ))}
                </div>
              </Fold>
            )}

            <Fold label={isPersonal ? '3. README canvas' : '2. README canvas'}>
              <div className="bdg-seg" role="radiogroup" aria-label="Theme">
                <button
                  type="button"
                  role="radio"
                  aria-checked={theme === 'dark'}
                  className={`bdg-segBtn ${theme === 'dark' ? 'is-on' : ''}`}
                  onClick={() => setTheme('dark')}
                >
                  <Icon name="moon" size={12} />
                  <span>Dark</span>
                </button>
                <button
                  type="button"
                  role="radio"
                  aria-checked={theme === 'light'}
                  className={`bdg-segBtn ${theme === 'light' ? 'is-on' : ''}`}
                  onClick={() => setTheme('light')}
                >
                  <Icon name="sun" size={12} />
                  <span>Light</span>
                </button>
              </div>
            </Fold>

            {kind === 'deploy' && (
              <Fold label="3. Button size">
                <div className="bdg-seg" role="radiogroup" aria-label="Button size">
                  <button
                    type="button"
                    role="radio"
                    aria-checked={!pillDeploy}
                    className={`bdg-segBtn ${!pillDeploy ? 'is-on' : ''}`}
                    onClick={() => setPillDeploy(false)}
                  >
                    <span>20px Shield</span>
                  </button>
                  <button
                    type="button"
                    role="radio"
                    aria-checked={pillDeploy}
                    className={`bdg-segBtn ${pillDeploy ? 'is-on' : ''}`}
                    onClick={() => setPillDeploy(true)}
                  >
                    <span>32px Button</span>
                  </button>
                </div>
              </Fold>
            )}

            {isPersonal && (
              <Fold label="4. Monochrome finish">
                <div className="bdg-chips" role="radiogroup" aria-label="Finish">
                  {FINISHES.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      role="radio"
                      aria-checked={finish === f.id}
                      className={`bdg-chip ${finish === f.id ? 'is-on' : ''}`}
                      onClick={() => setFinish(f.id)}
                    >
                      <i
                        className="bdg-finishSwatch"
                        style={{ background: f.rightBg, borderColor: f.border }}
                      />
                      <span>{f.label}</span>
                    </button>
                  ))}
                </div>
              </Fold>
            )}

            {showStats && (
              <Fold label="5. Stats shown on shield" slot="flair-fields">
                <div className="bdg-chips">
                  {FIELDS.map((f) => {
                    const on = fields.includes(f.id);
                    return (
                      <button
                        key={f.id}
                        type="button"
                        aria-pressed={on}
                        className={`bdg-chip ${on ? 'is-on' : ''}`}
                        onClick={() => toggleField(f.id)}
                      >
                        <Icon name={f.icon} size={12} />
                        <span>{f.label}</span>
                      </button>
                    );
                  })}
                </div>
              </Fold>
            )}
          </div>

          {rest.length > 0 && (
            <div className={`hz-grid hz-grid-2 bdg-inputs`}>{rest.map((id) => field(id))}</div>
          )}
        </div>
        </div>
      </section>

      {/* ALL BADGES QUICK-COPY GALLERY */}
      <section className="bdg-gallery" aria-label="All README badges">
        <div className="hz-wrap">
          <div className="hz-head bdg-secHead">
            <span className="hz-label bdg-eyebrow">
              <Icon name="spark" size={11} />
              <span>Ready-to-paste vector shields</span>
            </span>
            <h2 className="bdg-h2">Built for GitHub profiles &amp; repositories.</h2>
            <p className="bdg-secSub">
              Pure-path monochrome SVGs with zero external fonts — instant rendering through GitHub&apos;s{' '}
              <code>camo.githubusercontent.com</code> proxy in dark and light mode.
            </p>
          </div>

          <div className="hz-grid hz-grid-6 bdg-presetGrid">
            {quickPresets.map((p) => (
              <div key={p.id} className="hz-card hz-lift bdg-presetCard">
                <div className="bdg-presetTop">
                  <div className="bdg-presetHeadLeft">
                    <span className="bdg-presetIcon" aria-hidden="true">
                      <Icon name={p.icon} size={15} />
                    </span>
                    <div>
                      <h3 className="bdg-presetTitle">{p.title}</h3>
                      <p className="bdg-presetSub">{p.sub}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className={`hz-btn hz-btn-sm hz-copy bdg-copyMini ${copiedKey === p.id ? 'is-copied' : ''}`}
                    onClick={() => copyText(p.md, p.id)}
                  >
                    <Icon name={copiedKey === p.id ? 'check' : 'copy'} size={12} />
                    <span>{copiedKey === p.id ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <div className="bdg-presetPreview">
                  <div className="bdg-presetPair">
                    <a
                      href={p.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bdg-presetSwatch is-dark"
                      title={`Click to test: ${p.href}`}
                    >
                      <img src={p.badgeSrc} alt={p.title} height="20" width={shieldW(p.badgeSrc, 20)} />
                    </a>
                    {p.darkSrc && (
                      <a
                        href={p.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bdg-presetSwatch is-light"
                        title={`Click to test (light variant): ${p.href}`}
                      >
                        <img src={p.darkSrc} alt={`${p.title} light`} height="20" width={shieldW(p.darkSrc, 20)} />
                      </a>
                    )}
                  </div>
                </div>

                <pre className="hz-code bdg-presetCode">
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
