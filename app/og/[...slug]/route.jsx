/* Share cards (Open Graph images), one per route, written as static PNGs at build: /og/index.png for the home page,
   /og/<route>.png for every other page. Each card carries the page's own title and description and its own contour
   map (the Sigil, seeded by the route and its real numbers), so no two cards are alike. Pages need nothing: JsonLd
   puts the <meta> tags in every page's <head>. Preview one in dev: http://localhost:4180/og/models.png */
import fs from 'node:fs';
import path from 'node:path';
import { ImageResponse } from 'next/og';
import ROUTES from '../../../lib/routes.json';
import { cardPath, cardText } from '../../../lib/share.mjs';
import { sigilParams, field, levels, contour } from '../../../lib/sigil.mjs';
import { MARK } from '../../../components/arrival';

export const dynamic = 'force-static';
export const dynamicParams = false;
export const generateStaticParams = () => ROUTES.map((r) => ({ slug: cardPath(r).slice(4).split('/') }));

const W = 1200, H = 630, CELL = 10;
const font = (f) => fs.readFileSync(path.join(process.cwd(), 'lib', 'og', f)); // static Zen instances (OFL), satori reads no woff2
const FONTS = [
  { name: 'Zen', data: font('zen-400.ttf'), weight: 400, style: 'normal' },
  { name: 'Zen', data: font('zen-560.ttf'), weight: 600, style: 'normal' },
  { name: 'Zen Mono', data: font('zen-mono-500.ttf'), weight: 500, style: 'normal' },
];
const cut = (s, n) => { if (s.length <= n) return s; const i = s.lastIndexOf(' ', n); return s.slice(0, i > n / 2 ? i : n).replace(/[,.;:—-]+$/, '') + '…'; };

export async function GET(_req, { params }) {
  const { slug } = await params;
  const at = '/' + slug.join('/').replace(/\.png$/, '');
  const { route, title, description } = cardText(at === '/index' ? '/' : at);
  const nums = (title + ' ' + description).match(/\d[\d,.]*/g)?.map((s) => parseFloat(s.replace(/,/g, ''))) || [];
  const P = sigilParams(route, nums), cols = W / CELL + 1, rows = H / CELL + 1;
  const v = field(P, new Float32Array(cols * rows), cols, rows, CELL, W, H, 0, { x: 0.5, y: 0.5, s: 0 });
  const lines = levels(P, v).map((l) => {
    let d = '';
    contour({ moveTo: (x, y) => { d += `M${x.toFixed(1)} ${y.toFixed(1)}`; }, lineTo: (x, y) => { d += `L${x.toFixed(1)} ${y.toFixed(1)}`; } }, v, cols, rows, CELL, l);
    return d;
  });
  const t = cut(title, 96), size = t.length <= 24 ? 84 : t.length <= 44 ? 68 : t.length <= 70 ? 56 : 46;
  return new ImageResponse(
    (
      <div style={{ width: W, height: H, display: 'flex', position: 'relative', background: '#fff', color: '#0a0a0a', fontFamily: 'Zen' }}>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', left: 0, top: 0 }}>
          {lines.map((d, k) => <path key={k} d={d} fill="none" stroke="#0a0a0a" strokeWidth={k === P.focus ? 2.2 : 1.2} strokeOpacity={k === P.focus ? 0.6 : 0.1 + (k / lines.length) * 0.18} />)}
        </svg>
        <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: H, display: 'flex', background: 'linear-gradient(90deg, #fff 0%, rgba(255,255,255,0.94) 46%, rgba(255,255,255,0) 82%)' }} />
        <div style={{ position: 'relative', width: W, height: H, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '60px 72px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <svg width="36" height="36" viewBox="0 0 67 67">{MARK.map(([d], k) => <path key={k} d={d} fill="#0a0a0a" />)}</svg>
            <span style={{ marginLeft: 14, fontSize: 30, fontWeight: 600, letterSpacing: '-0.02em' }}>Hanzo</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 820 }}>
            <div style={{ fontSize: size, fontWeight: 600, letterSpacing: '-0.045em', lineHeight: 1.04 }}>{t}</div>
            {description && <div style={{ marginTop: 24, fontSize: 26, lineHeight: 1.4, color: '#6e6e73', maxWidth: 760 }}>{cut(description, 150)}</div>}
          </div>
          <div style={{ display: 'flex', fontFamily: 'Zen Mono', fontWeight: 500, fontSize: 20, color: '#86868b' }}>{'hanzo.ai' + (route === '/' ? '' : route)}</div>
        </div>
      </div>
    ),
    { width: W, height: H, fonts: FONTS },
  );
}
