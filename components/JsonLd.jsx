import fs from 'node:fs';
import path from 'node:path';

/* Hanzo's schema.org data for a page (FAQs, products, breadcrumbs), kept so search engines read the same facts. */
export default function JsonLd({ route }) {
  const f = path.join(process.cwd(), 'content', 'jsonld', (route.replace(/^\/|\/$/g, '') || 'index') + '.json');
  if (!fs.existsSync(f)) return null;
  const items = JSON.parse(fs.readFileSync(f, 'utf8'));
  return items.map((d, i) => <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(d).replace(/</g, '\\u003c') }} />);
}
