/* One shell for every page: Hanzo's header and footer persist across navigation, so only the page between them changes.
   HOW TO USE (pages add nothing here; see docs/review/SYSTEM.md):
   - Every page.jsx exports its own `metadata` ({ title, description }) and renders <JsonLd route="/its/path" /> once:
     that gives it its canonical link, share card (Open Graph, X) and schema.org data.
   - Styles load in this order: Hanzo's hanzo.css, globals.css, system.css (tokens and states), then the page's own CSS,
     so a page rule always wins.
   - Layers mounted once here: arrival, progress, morph (page transitions), the ask bar, the phone layer, the cursor. */
import './globals.css';
import './system.css';
import { Smooth, Progress, Header, Footer } from '../components/Chrome';
import { HeaderHTML, FooterHTML } from '../components/Shell';
import { OpenerProvider } from '../components/Opener';
import Morph from '../components/Morph';
import Phone from '../components/Phone';
import Ask from '../components/Ask';
import Cursor from '../components/Cursor';
import { ARRIVE } from '../components/arrival';

export const metadata = {
  metadataBase: new URL('https://hanzo.ai'),
  title: 'Hanzo AI — Smarter, Faster, Cheaper. Pick all three.',
  description: 'Frontier intelligence over 200× faster and 400× cheaper. Every model behind one key.',
  applicationName: 'Hanzo AI',
  robots: { index: true, follow: true, 'max-image-preview': 'large' },
  formatDetection: { telephone: false, email: false, address: false },
  twitter: { card: 'summary_large_image', site: '@hanzoai' },
};
export const viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover', themeColor: '#ffffff', colorScheme: 'light' };

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-brand="hanzo" className="light t_light" suppressHydrationWarning>
      <head>
        {/* Hanzo's own stylesheet: their header, footer and page content render exactly as they ship them */}
        <link rel="stylesheet" href="/hanzo.css" />
        {/* both faces preload, and both use font-display: block, so text paints once in Zen: no visible swap */}
        <link rel="preload" href="/fonts/Zen-Variable.woff2" as="font" type="font/woff2" crossOrigin="" />
        <link rel="preload" href="/fonts/ZenMono-Variable.woff2" as="font" type="font/woff2" crossOrigin="" />
      </head>
      <body>
        {/* the first tab stop: jumps past the header to the page */}
        <a href="#main" className="x-skip">Skip to content</a>
        {/* arrival: runs before React, outside <body>; see components/arrival.js */}
        <script dangerouslySetInnerHTML={{ __html: ARRIVE }} />
        <Smooth>
          <OpenerProvider>
            <Progress />
            <Morph />
            <Phone />
            <Ask />
            <Cursor />
            <div className="x-page">
              <HeaderHTML />
              <Header />
              <div id="main" tabIndex={-1} className="x-main-mark" />
              {children}
              <FooterHTML />
              <Footer />
            </div>
          </OpenerProvider>
        </Smooth>
      </body>
    </html>
  );
}
