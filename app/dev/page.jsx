// Signature: a live terminal session where the task types, the diff lands in the file and the tests go green, then a split-screen race
// Beyond: your first session, three lines of Hanzo's own commands built from your answers
import DevPage from '../../components/pages/DevPage';
import JsonLd from '../../components/JsonLd';

export const metadata = {
  title: 'Hanzo Dev — the coding agent',
  description: 'Autonomous AI coding agent for your terminal, IDE, and cloud. Reads code, fixes bugs, runs tests, and creates PRs. Open source.',
};

// Dev's latest release, read from GitHub when the page is built (hanzo.ai reads it in the browser; doing it here keeps
// the visitor's console clean when GitHub rate-limits). Any failure keeps DevPage's own last-seen release.
async function latestRelease() {
  try {
    const r = await fetch('https://api.github.com/repos/hanzoai/dev/releases/latest', { signal: AbortSignal.timeout(4000) });
    const tag = r.ok ? (await r.json())?.tag_name : null;
    return /^v\d+\.\d+\.\d+$/.test(tag || '') ? tag : undefined;
  } catch { return undefined; }
}

export default async function Page() {
  return <><JsonLd route="/dev" /><DevPage release={await latestRelease()} /></>;
}
