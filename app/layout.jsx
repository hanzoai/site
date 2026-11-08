/* One shell for every page: Hanzo's header and footer persist across navigation, so only the page between them changes.
   HOW TO USE (pages add nothing here; see docs/review/SYSTEM.md):
   - Every page.jsx exports its own `metadata` ({ title, description }) and renders <JsonLd route="/its/path" /> once:
     that gives it its canonical link, share card (Open Graph, X) and schema.org data.
   - Styles load in this order: Hanzo's hanzo.css, globals.css, system.css (tokens and states), then the page's own CSS,
     so a page rule always wins.
   - Layers mounted once here: arrival, progress, morph (page transitions), the phone ask, the sound kit, the phone
     layer. No cursor label: nothing floats over content (MASTER 3.3). */
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

/* Dark mode (docs/DARK-MODE.md). Live hanzo.ai's own pre-paint script, word for word in what it does: the theme saved
   under localStorage "hanzo.appearance.painted" ({ theme: 'light' | 'dark' | 'system' }), else the device setting,
   sets html's light/dark + t_light/t_dark, color-scheme and data-scheme before the first paint (no flash). Added: while
   the theme is "system", a change of the device setting re-applies it, and React never owns these classes (see
   the hydration check in docs/DARK-MODE.md), so hydration cannot reset them. The server HTML says "light t_light": with JS off it is bright. */
const THEME = "(function(){try{var d=document.documentElement,s=d.style,c=null;try{c=JSON.parse(localStorage.getItem('hanzo.appearance.painted')||'null')}catch(e){}if(!c||typeof c!=='object')c={vars:{},theme:'system'};var v=c.vars||{};for(var k in v)if(k.slice(0,2)==='--'&&typeof v[k]==='string')s.setProperty(k,v[k]);var t=c.theme;if(t!=='light'&&t!=='dark')t='system';var q=window.matchMedia&&matchMedia('(prefers-color-scheme: dark)');var a=function(){var n=t==='dark'||(t==='system'&&!!q&&q.matches);var l=d.classList;l.toggle('light',!n);l.toggle('dark',n);l.toggle('t_light',!n);l.toggle('t_dark',n);s.colorScheme=n?'dark':'light';d.setAttribute('data-scheme',t)};a();if(q&&t==='system'&&q.addEventListener)q.addEventListener('change',a)}catch(e){}})()";

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-brand="hanzo" className="light t_light" suppressHydrationWarning>
      <head>
        {/* the theme, before anything paints */}
        <script dangerouslySetInnerHTML={{ __html: THEME }} />
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
