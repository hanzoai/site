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
    bio: 'Founding Maintainer · Sovereign AI Cloud, Zen models & Hanzo MCP.',
    rank: '#1',
    rankLong: '#1 Global',
    level: 'Lv 10',
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
    bio: 'CEO @ Hanzo AI · Building autonomous AI teammates & global developer tools.',
    rank: '#3',
    rankLong: '#3 Global',
    level: 'Lv 8',
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
    bio: 'Security Researcher & Top Bug Hunter · Open-source contributor.',
    rank: '#2',
    rankLong: '#2 Hunter',
    level: 'Lv 6',
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
  { id: 'rank', label: 'Rank', icon: 'crown' },
  { id: 'points', label: 'Points', icon: 'bolt' },
  { id: 'tokens', label: 'Tokens', icon: 'spark' },
  { id: 'level', label: 'Level', icon: 'layers' },
  { id: 'badges', label: 'Badges', icon: 'medal' },
];

const FINISHES = [
  { id: 'graphite', label: 'Graphite', leftBg: '#0a0a0a', leftFg: '#fafafa', rightBg: '#171717', rightFg: '#fafafa', border: '#333333' },
  { id: 'obsidian', label: 'Obsidian', leftBg: '#000000', leftFg: '#fafafa', rightBg: '#0f0f0f', rightFg: '#e5e5e5', border: '#262626' },
  { id: 'silver', label: 'Silver', leftBg: '#0a0a0a', leftFg: '#fafafa', rightBg: '#f5f5f5', rightFg: '#0a0a0a', border: '#d4d4d4' },
  { id: 'inverted', label: 'Inverted', leftBg: '#fafafa', leftFg: '#0a0a0a', rightBg: '#0a0a0a', rightFg: '#fafafa', border: '#404040' },
];

const KINDS = [
  {
    id: 'profile',
    label: 'Flex your stats',
    tag: 'Profile',
    icon: 'crown',
    desc: 'Rank, points, and token compute shield for your personal GitHub README.',
  },
  {
    id: 'deploy',
    label: 'Deploy to Hanzo',
    tag: 'Deploy',
    icon: 'rocket',
    desc: 'One-click cloud deploy button for any open-source repository README.',
  },
  {
    id: 'edit',
    label: 'Edit on Hanzo',
    tag: 'Dev IDE',
    icon: 'terminal',
    desc: 'Launch any repository directly inside Hanzo Dev cloud workspace.',
  },
  {
    id: 'built',
    label: 'Built with Hanzo',
    tag: 'Project',
    icon: 'hanzo',
    desc: 'Monochrome 20px shield for apps powered by Zen, MCP, or Hanzo Cloud.',
  },
  {
    id: 'rank',
    label: 'Leaderboard rank',
    tag: 'Standing',
    icon: 'trophy',
    desc: 'Compact global leaderboard standing badge for your GitHub profile.',
  },
];

/* Crisp monochrome geometric vector icons */
function Icon({ name, size = 14 }) {
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

function cleanRepo(raw: string) {
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

function buildTargetHref(kind: string, code: string, repo: string, handle: string) {
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

function buildImageSrc({
  kind,
  theme,
  style,
  fields,
  label,
  handle,
  pillDeploy,
  finish,
}: {
  kind: string;
  theme: string;
  style: string;
  fields: string[];
  label: string;
  handle: string;
  pillDeploy: boolean;
  finish: string;
}) {
  const cleanHandle = (handle || '').trim().replace(/^@/, '').toLowerCase() || 'zeekay';
  const useLightVariant = theme === 'light' || finish === 'silver';
  if (kind === 'built') {
    return `${HOME}/badges/built-with-hanzo${useLightVariant ? '-dark' : ''}.svg`;
  }
  if (kind === 'deploy') {
    if (pillDeploy) return `${HOME}/deploy.svg`;
    return `${HOME}/badges/deploy-to-hanzo${useLightVariant ? '-dark' : ''}.svg`;
  }
  if (kind === 'edit') {
    return `${HOME}/badges/edit-on-hanzo${useLightVariant ? '-dark' : ''}.svg`;
  }

  const preset = PROFILES[cleanHandle as keyof typeof PROFILES];
  const isDefaultFields =
    fields.length === 3 &&
    fields.includes('rank') &&
    fields.includes('points') &&
    fields.includes('tokens') &&
    !label.trim();
  if (preset && isDefaultFields && style !== 'strip') {
    if (kind === 'rank') return preset.staticRank;
    if (style === 'square') return preset.staticSquare;
    if (useLightVariant) return preset.staticFlatLight;
    return preset.staticFlat;
  }

  const apiStyle = style === 'strip' ? 'card' : 'flat';
  const apiTheme = useLightVariant ? 'light' : 'dark';
  const q = new URLSearchParams({ theme: apiTheme, style: apiStyle });
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

function buildAlt(kind: string, handle: string) {
  const h = (handle || '').trim().replace(/^@/, '') || 'zeekay';
  if (kind === 'built') return 'Built with Hanzo';
  if (kind === 'deploy') return 'Deploy to Hanzo';
  if (kind === 'edit') return 'Edit on Hanzo';
  if (kind === 'rank') return `Hanzo Leaderboard @${h}`;
  return `Hanzo @${h}`;
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
        finish,
      }),
    [kind, theme, style, fields, label, handle, pillDeploy, finish],
  );

  const targetHref = useMemo(() => buildTargetHref(kind, refCode, repo, handle), [kind, refCode, repo, handle]);
  const altText = useMemo(() => buildAlt(kind, handle), [kind, handle]);

  const markdownSnippet = useMemo(() => `[![${altText}](${imgSrc})](${targetHref})`, [altText, imgSrc, targetHref]);
  const htmlSnippet = useMemo(
    () => `<a href="${targetHref}"><img src="${imgSrc}" alt="${altText}" /></a>`,
    [altText, imgSrc, targetHref],
  );
  const activeSnippet = format === 'markdown' ? markdownSnippet : htmlSnippet;

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

  const cleanHandle = (handle || '').trim().replace(/^@/, '').toLowerCase() || 'zeekay';
  const cleanRepoSlug = cleanRepo(repo) || 'hanzoai/hanzo';
  const presetProfile = PROFILES[cleanHandle as keyof typeof PROFILES];
  const activeRepoSlug = isPersonal
    ? presetProfile?.readmeRepo || `${cleanHandle}/${cleanHandle}`
    : cleanRepoSlug;
  const activeRepoUrl = `https://github.com/${activeRepoSlug}`;
  const githubReadmeEditUrl = `${activeRepoUrl}/edit/main/README.md`;

  const deployCompanionHref = useMemo(
    () => buildTargetHref('deploy', refCode, repo, handle),
    [refCode, repo, handle],
  );
  const editCompanionHref = useMemo(
    () => buildTargetHref('edit', refCode, repo, handle),
    [refCode, repo, handle],
  );
  const builtCompanionHref = useMemo(
    () => buildTargetHref('built', refCode, repo, handle),
    [refCode, repo, handle],
  );

  const quickPresets = useMemo(
    () => [
      {
        id: 'zeekay',
        icon: 'crown',
        title: '@zeekay · Profile Shield',
        sub: 'Live on github.com/zeekay/zeekay · #1 Global · 1,510 pts · 106M tok',
        badgeSrc: '/badges/zeekay.svg',
        darkSrc: '/badges/zeekay-dark.svg',
        href: `${HOME}/leaderboard?ref=zeekay`,
        md: `[![Hanzo @zeekay](${HOME}/badges/zeekay.svg)](${HOME}/leaderboard?ref=zeekay)`,
      },
      {
        id: 'zooqueen',
        icon: 'crown',
        title: '@zooqueen · Profile Shield',
        sub: 'Live on github.com/zooqueen · #3 Global · 252 pts · 5.2M tok',
        badgeSrc: '/badges/zooqueen.svg',
        darkSrc: '/badges/zooqueen-dark.svg',
        href: `${HOME}/leaderboard?ref=zooqueen`,
        md: `[![Hanzo @zooqueen](${HOME}/badges/zooqueen.svg)](${HOME}/leaderboard?ref=zooqueen)`,
      },
      {
        id: 'deploy',
        icon: 'rocket',
        title: 'Deploy to Hanzo',
        sub: 'One-click cloud deploy shield for any repository README.md',
        badgeSrc: '/badges/deploy-to-hanzo.svg',
        darkSrc: '/badges/deploy-to-hanzo-dark.svg',
        href: deployCompanionHref,
        md: `[![Deploy to Hanzo](${HOME}/badges/deploy-to-hanzo.svg)](${deployCompanionHref})`,
      },
      {
        id: 'edit',
        icon: 'terminal',
        title: 'Edit on Hanzo',
        sub: 'Open repository in Hanzo Dev cloud IDE & AI coding agent',
        badgeSrc: '/badges/edit-on-hanzo.svg',
        darkSrc: '/badges/edit-on-hanzo-dark.svg',
        href: editCompanionHref,
        md: `[![Edit on Hanzo](${HOME}/badges/edit-on-hanzo.svg)](${editCompanionHref})`,
      },
      {
        id: 'built',
        icon: 'hanzo',
        title: 'Built with Hanzo',
        sub: 'Monochrome 20px vector badge with your referral code',
        badgeSrc: '/badges/built-with-hanzo.svg',
        darkSrc: '/badges/built-with-hanzo-dark.svg',
        href: builtCompanionHref,
        md: `[![Built with Hanzo](${HOME}/badges/built-with-hanzo.svg)](${builtCompanionHref})`,
      },
      {
        id: 'rank',
        icon: 'trophy',
        title: 'Leaderboard Rank Shield',
        sub: 'Compact global standing shield for any GitHub README',
        badgeSrc: cleanHandle === 'zooqueen' ? '/badges/zooqueen-rank.svg' : '/badges/zeekay-rank.svg',
        darkSrc: null,
        href: `${HOME}/leaderboard?ref=${cleanHandle}`,
        md: `[![Hanzo Rank](${HOME}/badges/${cleanHandle === 'zooqueen' ? 'zooqueen' : 'zeekay'}-rank.svg)](${HOME}/leaderboard?ref=${cleanHandle})`,
      },
    ],
    [deployCompanionHref, editCompanionHref, builtCompanionHref, cleanHandle],
  );

  const suffix = theme === 'light' || finish === 'silver' ? '-dark' : '';

  return (
    <main className="bdg" data-slot="flair-builder" data-state={isPersonal ? 'public' : 'built'}>
      {/* HERO */}
      <section className="bdg-hero">
        <div className="bdg-wrap">
          <div className="bdg-hero-top">
            <span className="bdg-eyebrow">
              <Icon name="hanzo" size={12} />
              <span>GitHub Profile &amp; Repository Badges</span>
            </span>
            <div className="bdg-hero-links">
              <a href="/leaderboard" className="bdg-top-link">
                <Icon name="trophy" size={13} />
                <span>Leaderboard</span>
              </a>
              <a href="/referral" className="bdg-top-link">
                <Icon name="spark" size={13} />
                <span>Referrals &amp; Points</span>
              </a>
            </div>
          </div>
          <h1 className="bdg-h1">Show it off.</h1>
          <p className="bdg-lead">
            Crisp monochrome GitHub shields for your repository <code>README.md</code> and personal profile (
            <code>github.com/&lt;you&gt;/&lt;you&gt;</code>) — <strong>Deploy to Hanzo</strong>,{' '}
            <strong>Edit on Hanzo</strong>, <strong>Built with Hanzo</strong>, or flex your live compute volume and
            leaderboard rank.
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
                        onClick={() => setKind(k.id)}
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

              {isPersonal && (
                <div className="bdg-group">
                  <span className="bdg-label">Featured builders</span>
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
                </div>
              )}

              {isPersonal && (
                <div className="bdg-group">
                  <span className="bdg-label">2. Layout &amp; shape</span>
                  <div className="bdg-chips" role="radiogroup" aria-label="Style">
                    {[
                      { id: 'flat', label: 'Flat Shield (20px)' },
                      { id: 'square', label: 'Flat Square' },
                      { id: 'pill', label: 'Capsule Pill' },
                      { id: 'strip', label: 'Wide Strip' },
                    ].map((s) => (
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
                </div>
              )}

              <div className="bdg-splitControls">
                <div className="bdg-group">
                  <span className="bdg-label">{isPersonal ? '3. README canvas' : '2. README canvas'}</span>
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
                </div>

                {kind === 'deploy' && (
                  <div className="bdg-group">
                    <span className="bdg-label">3. Button size</span>
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
                  </div>
                )}

                {isPersonal && (
                  <div className="bdg-group">
                    <span className="bdg-label">4. Monochrome finish</span>
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
                  </div>
                )}
              </div>

              {kind === 'profile' && style !== 'strip' && (
                <div className="bdg-group" data-slot="flair-fields">
                  <span className="bdg-label">5. Stats shown on shield</span>
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
                    <span className="bdg-label">Repository (owner/repo)</span>
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
                    <span className="bdg-label">Left cap label (optional)</span>
                    <input
                      type="text"
                      maxLength={24}
                      value={label}
                      onChange={(e) => setLabel(e.target.value)}
                      placeholder={kind === 'rank' ? 'Rank' : 'Hanzo'}
                      className="bdg-input"
                    />
                  </label>
                )}

                <label className="bdg-field">
                  <span className="bdg-label">Referral code (optional)</span>
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

            {/* RIGHT: INTERACTIVE README MOCKUP + SNIPPET */}
            <div className="bdg-previewCol">
              <div className={`bdg-stage ${theme === 'dark' ? 'is-dark' : 'is-light'}`} data-slot="flair-stage">
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
                      <span className="bdg-stageSlash">/</span>
                      <span>README.md</span>
                      <Icon name="ext" size={11} />
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
                    <div className="bdg-readmeBadgeBar">
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
                              src={
                                pillDeploy && kind === 'deploy'
                                  ? '/deploy.svg'
                                  : `/badges/${
                                      kind === 'built'
                                        ? 'built-with-hanzo'
                                        : kind === 'deploy'
                                          ? 'deploy-to-hanzo'
                                          : 'edit-on-hanzo'
                                    }${suffix}.svg`
                              }
                              alt={altText}
                              height={pillDeploy && kind === 'deploy' ? 32 : 20}
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
                              <img src={`/badges/edit-on-hanzo${suffix}.svg`} alt="Edit on Hanzo" height="20" />
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
                              <img src={`/badges/built-with-hanzo${suffix}.svg`} alt="Built with Hanzo" height="20" />
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
                              <img src={`/badges/built-with-hanzo${suffix}.svg`} alt="Built with Hanzo" height="20" />
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
                    <Icon name="ext" size={11} />
                  </a>
                  <a
                    href={activeRepoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bdg-stagePublicLink"
                  >
                    <span>GitHub README</span>
                    <Icon name="ext" size={11} />
                  </a>
                </div>
              </div>

              {/* EMBED SNIPPET */}
              <div className="bdg-embedBox" data-slot="flair-embed">
                <div className="bdg-embedHeader">
                  <div className="bdg-seg" role="radiogroup" aria-label="Snippet format">
                    <button
                      type="button"
                      role="radio"
                      aria-checked={format === 'markdown'}
                      className={`bdg-segBtn ${format === 'markdown' ? 'is-on' : ''}`}
                      onClick={() => setFormat('markdown')}
                    >
                      <span>Markdown</span>
                    </button>
                    <button
                      type="button"
                      role="radio"
                      aria-checked={format === 'html'}
                      className={`bdg-segBtn ${format === 'html' ? 'is-on' : ''}`}
                      onClick={() => setFormat('html')}
                    >
                      <span>HTML</span>
                    </button>
                  </div>
                  <div className="bdg-embedActions">
                    <button
                      type="button"
                      className="bdg-copyPrimary"
                      onClick={() => copyText(activeSnippet, 'main')}
                    >
                      <Icon name={copiedKey === 'main' ? 'check' : 'copy'} size={13} />
                      <span>
                        {copiedKey === 'main'
                          ? 'Copied'
                          : `Copy ${format === 'markdown' ? 'Markdown' : 'HTML'}`}
                      </span>
                    </button>
                    <a
                      href={githubReadmeEditUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bdg-ghBtn"
                    >
                      <Icon name="github" size={13} />
                      <span>Add to README</span>
                      <Icon name="ext" size={11} />
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
              <span className="bdg-eyebrow">
                <Icon name="spark" size={11} />
                <span>Ready-to-paste vector shields</span>
              </span>
              <h2 className="bdg-h2">Built for GitHub profiles &amp; repositories.</h2>
            </div>
            <p className="bdg-secSub">
              Pure-path monochrome SVGs with zero external fonts — instant rendering through GitHub&apos;s{' '}
              <code>camo.githubusercontent.com</code> proxy in dark and light mode.
            </p>
          </div>

          <div className="bdg-presetGrid">
            {quickPresets.map((p) => (
              <div key={p.id} className="bdg-presetCard">
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
                    className="bdg-copyMini"
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
                      <img src={p.badgeSrc} alt={p.title} height="20" />
                    </a>
                    {p.darkSrc && (
                      <a
                        href={p.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bdg-presetSwatch is-light"
                        title={`Click to test (light variant): ${p.href}`}
                      >
                        <img src={p.darkSrc} alt={`${p.title} light`} height="20" />
                      </a>
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
