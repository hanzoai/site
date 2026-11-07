// Share cards: where a route's Open Graph image lives and the words on it (Hanzo's own title and description from
// content/pages.json). Read at build time by components/JsonLd.jsx (the <meta> tags) and app/og (the image).
import fs from 'node:fs';
import path from 'node:path';

const INDEX = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'content', 'pages.json'), 'utf8'));
// the home page is not in the index; its words are the site's own title and description (app/layout.jsx)
const HOME = { title: 'Smarter, Faster, Cheaper. Pick all three.', description: 'Frontier intelligence over 200× faster and 400× cheaper. Every model behind one key.' };

const norm = (route) => '/' + String(route).split('/').filter(Boolean).join('/');
export const cardPath = (route) => '/og' + (norm(route) === '/' ? '/index' : norm(route)) + '.png';

export function cardText(route) {
  const r = norm(route), m = r === '/' ? HOME : INDEX[r] || { title: r.split('/').pop().replace(/-/g, ' '), description: '' };
  const clean = (s) => s.replace(/(\s+[—-]\s+Hanzo AI)+\s*$/, '').replace(/‑/g, '-').replace(/[^\x20-\x7e -ÿ‐-‧™←→×]/g, '').trim();
  return { route: r, title: clean(m.title || ''), description: clean(m.description || '') };
}
