// Hanzo Desktop's builds, read off its latest GitHub release, so the download page never pins a version
// (hanzo-inc/app issue 318). The page is built with whatever release was latest at build time, and the browser
// asks GitHub again when it opens, so a Desktop release published after the last build is the one offered.
//
// A build is [label, size, path under github.com/hanzoai/]. Its place in the list is what the download page reads:
// [0] macOS, [1] Windows, [2] Linux AppImage (x86_64), [3] Linux deb (x86_64), [4] Linux arm64, [5] Windows portable.
export type Build = [name: string, size: string, path: string];
export interface Asset { name: string; size: number }
export interface Desktop { v: string; builds: Build[] }

export const DESKTOP_RELEASES = 'desktop/releases/latest'; // the release page: every build and its checksums
export const DESKTOP_API = 'https://api.github.com/repos/hanzoai/desktop/releases/latest';

// Each slot takes the first asset its patterns match, in order, so a renamed or newly added file still lands in the
// right place (a universal .dmg before a per-chip one). A slot nothing matches links to the release page instead.
const SLOTS: [label: string, tests: RegExp[]][] = [
  ['macOS', [/universal\.dmg$/i, /(aarch64|arm64)[^/]*\.dmg$/i, /\.dmg$/i]],
  ['Windows', [/x64[-_]setup\.exe$/i, /setup[^/]*\.exe$/i, /\.msi$/i]],
  ['Linux (AppImage)', [/(amd64|x86_64|x64)[^/]*\.AppImage$/i]],
  ['Linux (deb)', [/(amd64|x86_64|x64)[^/]*\.deb$/i]],
  ['Linux (arm64)', [/(arm64|aarch64)[^/]*\.AppImage$/i]],
  ['Windows (Portable)', [/portable[^/]*\.zip$/i]],
];

export function size(bytes: number): string {
  if (!(bytes > 0)) return '';
  const mb = bytes / 1048576;
  return mb >= 1 ? Math.round(mb) + ' MB' : Math.max(1, Math.round(bytes / 1024)) + ' KB';
}

/** The page's builds from a release's tag and assets; null when the tag is not a plain version. */
export function desktopBuilds(tag: unknown, assets: unknown): Desktop | null {
  if (typeof tag !== 'string' || !/^v\d+\.\d+\.\d+$/.test(tag) || !Array.isArray(assets)) return null;
  const files = assets.filter((a): a is Asset => !!a && typeof a.name === 'string' && /^[\w.+-]+$/.test(a.name) && typeof a.size === 'number');
  const builds = SLOTS.map(([label, tests]): Build => {
    for (const t of tests) {
      const a = files.find((f) => t.test(f.name));
      if (a) return [label, size(a.size), `desktop/releases/download/${tag}/${a.name}`];
    }
    return [label, '', DESKTOP_RELEASES];
  });
  // a release with no installer for any system is not one to offer
  return builds.some((b) => b[2] !== DESKTOP_RELEASES) ? { v: tag, builds } : null;
}

/** The same, from GitHub's `releases/latest` JSON. */
export const fromRelease = (r: unknown): Desktop | null =>
  r && typeof r === 'object' ? desktopBuilds((r as { tag_name?: unknown }).tag_name, (r as { assets?: unknown }).assets) : null;

// The latest release when this file was last written, used only if GitHub cannot be read at build time and in the
// browser. Sizes in bytes, as GitHub reports them.
export const DESKTOP_FALLBACK: Desktop = desktopBuilds('v1.1.56', [
  { name: 'Hanzo_Desktop_1.1.56_universal.dmg', size: 631116111 },
  { name: 'Hanzo_Desktop_1.1.56_x64-setup.exe', size: 503767525 },
  { name: 'Hanzo_Desktop_1.1.56_amd64.AppImage', size: 664881656 },
  { name: 'Hanzo_Desktop_1.1.56_amd64.deb', size: 593193290 },
  { name: 'Hanzo_Desktop_1.1.56_arm64.AppImage', size: 662690312 },
  { name: 'Hanzo_Desktop_1.1.56_x64-portable.zip', size: 600429768 },
])!;

/** Build time: the latest release, or undefined (the page keeps its fallback). */
export async function latestDesktop(): Promise<Desktop | undefined> {
  try {
    const r = await fetch(DESKTOP_API, { signal: AbortSignal.timeout(4000) });
    return (r.ok && fromRelease(await r.json())) || undefined;
  } catch { return undefined; }
}

/** Build time: the tag of github.com/hanzoai/<repo>'s latest release, for a label beside a releases/latest link. */
export async function latestTag(repo: string): Promise<string | undefined> {
  try {
    const r = await fetch(`https://api.github.com/repos/hanzoai/${repo}/releases/latest`, { signal: AbortSignal.timeout(4000) });
    const tag = r.ok ? (await r.json())?.tag_name : null;
    return typeof tag === 'string' && /^v\d+\.\d+\.\d+$/.test(tag) ? tag : undefined;
  } catch { return undefined; }
}
