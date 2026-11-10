// sitemap.xml: every page this site has (lib/routes.json) except the unlisted ones (lib/unlisted.json: short addresses of
// a page and pages hanzo.ai serves without listing), at its canonical address (no trailing slash, as JsonLd links it).
import ROUTES from '../lib/routes.json';
import UNLISTED from '../lib/unlisted.json';

export const dynamic = 'force-static';

export default function sitemap() {
  const now = new Date();
  return ROUTES.filter((r) => !UNLISTED.includes(r)).map((r) => {
    const depth = r === '/' ? 0 : r.split('/').filter(Boolean).length;
    return { url: 'https://hanzo.ai' + (r === '/' ? '' : r), lastModified: now, changeFrequency: depth ? 'weekly' : 'daily', priority: depth === 0 ? 1 : depth === 1 ? 0.8 : 0.6 };
  });
}
