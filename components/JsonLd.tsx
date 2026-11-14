import fs from 'node:fs';
import path from 'node:path';
import { cardPath, cardText } from '../lib/share.ts';
import { OFFERS } from '../lib/plans';

/* What a page states with figures is stated once, so the data and the words cannot differ: a page that asks its own
   questions passes them as `faq` ([question, answer] pairs, the ones it draws) and they are the FAQPage's; a plan in an
   OfferCatalog is priced by the plan list (lib/plans.js), never by the file. */
interface Schema { '@type'?: string; itemListElement?: { name: string }[]; [key: string]: unknown }

function stated(d: Schema, faq?: readonly (readonly string[])[]): Schema {
  if (d['@type'] === 'FAQPage' && faq) return { ...d, mainEntity: faq.map(([name, text]) => ({ '@type': 'Question', name, acceptedAnswer: { '@type': 'Answer', text } })) };
  if (d['@type'] !== 'OfferCatalog') return d;
  return { ...d, itemListElement: d.itemListElement!.map((o) => { if (!OFFERS[o.name]) throw new Error(`${o.name} is not a plan in the plan list`); return { ...o, ...OFFERS[o.name] }; }) };
}

/* Every page renders <JsonLd route="/its/path" /> once, in its page.jsx. That gives it three things, with nothing else to do:
   - its canonical address (https://hanzo.ai/its/path, the home page https://hanzo.ai: hanzo.ai's own form, no trailing slash), so copies (intercepted card routes, ?query variants) all
     point search engines at the one real page;
   - Hanzo's schema.org data for the page (FAQs, products, breadcrumbs), so search engines read the same facts;
   - its share card: Open Graph and X <meta> tags pointing at its own image (/og/<route>.png, drawn by app/og). React
     lifts these tags into <head>. */
export default function JsonLd({ route, faq }: { route: string; faq?: readonly (readonly string[])[] }) {
  const f = path.join(process.cwd(), 'content', 'jsonld', (route.replace(/^\/|\/$/g, '') || 'index') + '.json');
  const items = ((fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : []) as Schema[]).map((d) => stated(d, faq));
  const { route: r, title, description } = cardText(route);
  const img = 'https://hanzo.ai' + cardPath(r);
  const url = 'https://hanzo.ai' + (r === '/' ? '' : r);
  return (
    <>
      <link rel="canonical" href={url} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Hanzo AI" />
      <meta property="og:url" content={url} />
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
