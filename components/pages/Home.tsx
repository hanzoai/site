/* Home, as hanzo.ai's landing was before the site split from hanzo-inc/app: the hero, who backs us, the models, the
   nine products three by three, the agents it works with, faster, cheaper, the frontier, open source, pricing, and who
   trusts us. A server component: every section is in the HTML, and the products' screens never ship as script. The only
   motion is what a pointer or the hero's demo drives. */
import type { ComponentProps } from 'react';
import { Marquee } from '../Chrome';
import Hero from '../Hero';
import Models from '../Models';
import Platform from '../home/Platform';
import Agents from '../Agents';
import Race from '../Race';
import Cheaper from '../Cheaper';
import Pareto from '../Pareto';
import Open from '../Open';
import Pricing from '../home/Pricing';
import Ctas from '../home/Ctas';
import { FiguresProvider } from '../home/useFigures';
import { A } from '../kit';
import LOGOS from '../../content/logos';
import './Home.css';

export default function Home({ figures }: { figures: ComponentProps<typeof FiguresProvider>['value'] }) {
  return (
    <FiguresProvider value={figures}>
    <main className="x-home">
      <Ctas />
      <A to="/beta" className="x-ann" data-slot="beta">
        <svg data-beta-spark="" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
          <path d="M20 3v4M22 5h-4M4 17v2M5 18H3" />
        </svg>
        <span>Apply for Beta Access</span>
        <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" />
        </svg>
      </A>
      <Hero />
      <Marquee items={LOGOS.backed} label="Backed by" still />
      <Models />
      <Platform />
      <Agents />
      <Race />
      <Cheaper />
      <Pareto />
      <Open />
      <Pricing />
      <Marquee items={LOGOS.trusted} label="Trusted by" reverse view="trusted" />
    </main>
    </FiguresProvider>
  );
}
