// /badge's data and the one function that turns a selection into the badge's image, link, alt text and snippets.
// Pure (no React), so Badge.links.test.ts can hold every URL and snippet to what hanzo.ai serves today.
export const API = 'https://api.hanzo.ai';
export const HOME = 'https://hanzo.ai';
export const DEPLOY_URL = 'https://platform.hanzo.ai/deploy';
export const EDIT_URL = 'https://hanzo.app/dev';

export const PROFILES = {
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

export const FIELDS = [
  { id: 'rank', label: 'Rank', icon: 'crown' },
  { id: 'points', label: 'Points', icon: 'bolt' },
  { id: 'tokens', label: 'Tokens', icon: 'spark' },
  { id: 'level', label: 'Level', icon: 'layers' },
  { id: 'badges', label: 'Badges', icon: 'medal' },
];

export const FINISHES = [
  { id: 'graphite', label: 'Graphite', leftBg: '#0a0a0a', leftFg: '#fafafa', rightBg: '#171717', rightFg: '#fafafa', border: '#333333' },
  { id: 'obsidian', label: 'Obsidian', leftBg: '#000000', leftFg: '#fafafa', rightBg: '#0f0f0f', rightFg: '#e5e5e5', border: '#262626' },
  { id: 'silver', label: 'Silver', leftBg: '#0a0a0a', leftFg: '#fafafa', rightBg: '#f5f5f5', rightFg: '#0a0a0a', border: '#d4d4d4' },
  { id: 'inverted', label: 'Inverted', leftBg: '#fafafa', leftFg: '#0a0a0a', rightBg: '#0a0a0a', rightFg: '#fafafa', border: '#404040' },
];

export const KINDS = [
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

export function cleanRepo(raw: string) {
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

export function buildTargetHref(kind: string, code: string, repo: string, handle: string) {
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

export function buildImageSrc({
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

export function buildAlt(kind: string, handle: string) {
  const h = (handle || '').trim().replace(/^@/, '') || 'zeekay';
  if (kind === 'built') return 'Built with Hanzo';
  if (kind === 'deploy') return 'Deploy to Hanzo';
  if (kind === 'edit') return 'Edit on Hanzo';
  if (kind === 'rank') return `Hanzo Leaderboard @${h}`;
  return `Hanzo @${h}`;
}

export type Selection = {
  kind: string; theme: string; style: string; finish: string; pillDeploy: boolean; fields: string[];
  label: string; handle: string; repo: string; refCode: string; format: string;
};

/* Everything the page shows and copies for one selection: the snippet, the preview's links and images, the gallery. */
export function badge({ kind, theme, style, finish, pillDeploy, fields, label, handle, repo, refCode, format }: Selection) {
  const isPersonal = kind === 'profile' || kind === 'rank';
  const isRepoAction = kind === 'deploy' || kind === 'edit';
  const imgSrc = buildImageSrc({ kind, theme, style, fields, label, handle, pillDeploy, finish });
  const targetHref = buildTargetHref(kind, refCode, repo, handle);
  const altText = buildAlt(kind, handle);

  const markdownSnippet = `[![${altText}](${imgSrc})](${targetHref})`;
  const htmlSnippet = `<a href="${targetHref}"><img src="${imgSrc}" alt="${altText}" /></a>`;
  const cleanHandle = (handle || '').trim().replace(/^@/, '').toLowerCase() || 'zeekay';
  const cleanRepoSlug = cleanRepo(repo) || 'hanzoai/hanzo';
  const presetProfile = PROFILES[cleanHandle as keyof typeof PROFILES];
  const activeRepoSlug = isPersonal
    ? presetProfile?.readmeRepo || `${cleanHandle}/${cleanHandle}`
    : cleanRepoSlug;
  const activeRepoUrl = `https://github.com/${activeRepoSlug}`;
  const githubReadmeEditUrl = `${activeRepoUrl}/edit/main/README.md`;

  const deployCompanionHref = buildTargetHref('deploy', refCode, repo, handle);
  const editCompanionHref = buildTargetHref('edit', refCode, repo, handle);
  const builtCompanionHref = buildTargetHref('built', refCode, repo, handle);

  const quickPresets = [
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
    ];
  const suffix = theme === 'light' || finish === 'silver' ? '-dark' : '';
  const activeSnippet = format === 'markdown' ? markdownSnippet : htmlSnippet;
  const previewSrc =
    pillDeploy && kind === 'deploy'
      ? '/deploy.svg'
      : `/badges/${kind === 'built' ? 'built-with-hanzo' : kind === 'deploy' ? 'deploy-to-hanzo' : 'edit-on-hanzo'}${suffix}.svg`;
  return {
    isPersonal, isRepoAction, imgSrc, targetHref, altText, markdownSnippet, htmlSnippet, activeSnippet, cleanHandle,
    cleanRepoSlug, presetProfile, activeRepoSlug, activeRepoUrl, githubReadmeEditUrl, deployCompanionHref,
    editCompanionHref, builtCompanionHref, quickPresets, suffix, previewSrc,
  };
}
