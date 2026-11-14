// Signature: a camera through the stack: eleven plates as one slab, the night opens from it, the plates pull apart and the camera travels down group by group
// Beyond: ask the map: type a word and the plates whose own Hanzo descriptions use it light up, each with the matching phrase and its sheet
import type { Metadata } from 'next';
import fs from 'node:fs';
import path from 'node:path';
import Platform from '../../components/pages/Platform';
import JsonLd from '../../components/JsonLd';
import { MEMBERS, cloudDoc } from '../../components/pages/cloudfam/cloudData';
import { CAT } from '../../components/pages/platformData';

// a group of the directory: its name, its own page, and the products under it
type Group = [string, string, [string, string][]];

export const metadata: Metadata = {
  title: 'Hanzo Platform — one stack, down to the kernel',
  description: 'Models, agents, applications, data and infrastructure on one operating plane, from GPU kernel to autonomous agent. Run it managed or on infrastructure you control.',
};

/* the directory's hover text (PLAN-COMPONENTS 5.9): each product's own existing description, from its own page on
   hanzo.ai (its meta description, or for a cloud product without one, the lede of its page). Nothing is written here. */
function about() {
  const idx = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'content', 'pages.json'), 'utf8'));
  const cloud = new Set(MEMBERS());
  const out: Record<string, string> = {};
  for (const route of (CAT as Group[]).flatMap(([, to, items]) => [to, ...items.map(([, h]) => h)])) {
    const m = idx[route];
    let d = (m && m.description) || '';
    const slug = route.startsWith('/cloud/') ? route.slice(7) : '';
    if (!d && cloud.has(slug)) d = cloudDoc(slug).lede || '';
    if (d) out[route] = d;
  }
  return out;
}

export default function Page() {
  return <><JsonLd route="/platform" /><Platform about={about()} /></>;
}
