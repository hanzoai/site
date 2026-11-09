/* One shell for every page: Hanzo's header and footer persist across navigation, so only the page between them changes.
   HOW TO USE (pages add nothing here; see docs/build-notes/review/SYSTEM.md):
   - Every page.jsx exports its own `metadata` ({ title, description }) and renders <JsonLd route="/its/path" /> once:
     that gives it its canonical link, share card (Open Graph, X) and schema.org data.
   - Styles load in this order: Hanzo's hanzo.css, globals.css, system.css (tokens and states), then the page's own CSS,
     so a page rule always wins.
   - Layers mounted once here: arrival, progress, morph (page transitions), the phone ask, the sound kit, the phone
     layer. No cursor label: nothing floats over content (MASTER 3.3). */
import { bootScript } from '@hanzo/appearance/state';
import '@hanzo/design/tokens/colors.css'; // Hanzo's colour ramps: dark by default, .light for light (hanzo.css carries the same)
import './globals.css';
import './system.css';
import { Smooth, Progress, Header, Footer } from '../components/Chrome';
import { HeaderHTML, FooterHTML } from '../components/Shell';
import { OpenerProvider } from '../components/Opener';
import Morph from '../components/Morph';
import Phone from '../components/Phone';
import Ask from '../components/Ask';
import Sound from '../components/Sound';
import { ARRIVE } from '../components/arrival';
import Appearance from '../components/Appearance';
import Telemetry from '../components/Telemetry';
import OneTap from '../components/OneTap';

export const metadata = {
  metadataBase: new URL('https://hanzo.ai'),
  title: 'Hanzo AI — Smarter, Faster, Cheaper. Pick all three.',
  description: 'Frontier intelligence over 200× faster and 400× cheaper. Every model behind one key.',
  applicationName: 'Hanzo AI',
  robots: { index: true, follow: true, 'max-image-preview': 'large' },
  formatDetection: { telephone: false, email: false, address: false },
  twitter: { card: 'summary_large_image', site: '@hanzoai' },
};
// the browser chrome follows the theme: Hanzo's own colours (#0A0A0A dark, as live); light stays our white
export const viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover', interactiveWidget: 'resizes-content', themeColor: [{ media: '(prefers-color-scheme: light)', color: '#ffffff' }, { media: '(prefers-color-scheme: dark)', color: '#0A0A0A' }], colorScheme: 'light dark' };

/* Dark mode (docs/DARK-MODE.md): Hanzo's own @hanzo/appearance, as live hanzo.ai runs it. bootScript() replays the
   choice saved under localStorage "hanzo.appearance.painted" ({ theme: 'light' | 'dark' | 'system', vars }), else the
   install default "system" (the device's prefers-color-scheme), and puts light/t_light or dark/t_dark, color-scheme and
   data-scheme on <html> before the first paint. The call is live's own: its output is byte-identical to the script in
   hanzo.ai's HTML. <Appearance /> (useAppearance() at the root) applies the person's choice after hydration. React never
   writes these classes (the server sends live's class="t_dark" and suppressHydrationWarning), so hydration keeps them. */
const BOOT = bootScript({ base: { theme: 'system' } });

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-brand="hanzo" className="t_dark" suppressHydrationWarning>
      <head>
        {/* the theme, before anything paints */}
        <script dangerouslySetInnerHTML={{ __html: BOOT }} />
        {/* Hanzo's own stylesheet: their header, footer and page content render exactly as they ship them */}
        <link rel="stylesheet" href="/hanzo.css" />
        {/* both faces preload, and both use font-display: block, so text paints once in Zen: no visible swap */}
        <link rel="preload" href="/fonts/Zen-Variable.woff2" as="font" type="font/woff2" crossOrigin="" />
        <link rel="preload" href="/fonts/ZenMono-Variable.woff2" as="font" type="font/woff2" crossOrigin="" />
        {/* html.js is set before first paint when JS runs, so pages can hide entrance states only then:
            .js .my-step:not(.on) { opacity: 0 }  →  with JS off every step stays readable */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        {/* JS off: every word is legible. Entrance states written into the server HTML (opacity 0, a rising transform, a
            clip) are cleared, so readers and crawlers without JS see the final page (PLAN 2.3 "server-rendered text") */}
        <noscript><style>{'main [style*="opacity:0"],main [style*="opacity: 0"]{opacity:1!important}main [style*="translate"],main [style*="transform"]{transform:none!important;translate:none!important}main [style*="clip-path"]{clip-path:none!important}main [style*="visibility:hidden"]{visibility:visible!important}.x-rv{opacity:1!important;transform:none!important}'}</style></noscript>
      </head>
      <body>
        {/* the first tab stop: jumps past the header to the page */}
        <a href="#main" className="x-skip">Skip to content</a>
        {/* arrival: runs before React, outside <body>; see components/arrival.js */}
        <script dangerouslySetInnerHTML={{ __html: ARRIVE }} />
        <Smooth>
          <OpenerProvider>
            <Appearance />
            <Telemetry />
            <OneTap />
            <Progress />
            <Morph />
            <Phone />
            <Ask />
            <Sound />
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
