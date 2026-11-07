import './globals.css';
import { Smooth, Progress, Header, Footer } from '../components/Chrome';
import { OpenerProvider } from '../components/Opener';

export const metadata = {
  metadataBase: new URL('https://hanzo.ai'),
  title: 'Hanzo AI — Smarter, Faster, Cheaper. Pick all three.',
  description: 'Frontier intelligence over 200× faster and 400× cheaper. Every model behind one key.',
};
export const viewport = { width: 'device-width', initialScale: 1, themeColor: '#ffffff' };

/* One shell for every page: Hanzo's header and footer persist across navigation, so only the page between them changes. */
export default function RootLayout({ children }) {
  return (
    <html lang="en" data-brand="hanzo" className="light t_light">
      <head>
        {/* Hanzo's own stylesheet: their header, footer and page content render exactly as they ship them */}
        <link rel="stylesheet" href="/hanzo.css" />
        <link rel="preload" href="/fonts/Zen-Variable.woff2" as="font" type="font/woff2" crossOrigin="" />
      </head>
      <body>
        <Smooth>
          <OpenerProvider>
            <Progress />
            <div className="x-page">
              <Header />
              {children}
              <Footer />
            </div>
          </OpenerProvider>
        </Smooth>
      </body>
    </html>
  );
}
