import fs from 'node:fs';
import path from 'node:path';
import { cardPath, cardText } from '../lib/share.mjs';

/* Every page renders <JsonLd route="/its/path" /> once, in its page.jsx. That gives it two things, with nothing else to do:
   - Hanzo's schema.org data for the page (FAQs, products, breadcrumbs), so search engines read the same facts;
   - its share card: Open Graph and X <meta> tags pointing at its own image (/og/<route>.png, drawn by app/og). React
     lifts these tags into <head>. */
export default function JsonLd({ route }) {
  const f = path.join(process.cwd(), 'content', 'jsonld', (route.replace(/^\/|\/$/g, '') || 'index') + '.json');
  const items = fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : [];
  const { route: r, title, description } = cardText(route);
  const img = 'https://hanzo.ai' + cardPath(r);
  return (
    <>
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Hanzo AI" />
      <meta property="og:url" content={'https://hanzo.ai' + (r === '/' ? '/' : r + '/')} />
      <meta property="og:title" content={title} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:image" content={img} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content={img} />
      {items.map((d, i) => <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(d).replace(/</g, '\\u003c') }} />)}
    </>
  );
}
