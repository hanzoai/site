'use client';
/* Home. Signature: the live hero, a prompt typed into the desktop app while the phone answers and the agent roster rolls,
   over a halftone field that swells under the pointer; below it the model cards open into their pages (WebGL).
   Beyond: the spine. A quiet "on this page" index at the right edge, written from the page's own section headings,
   that marks where you are and jumps to speed, cost, the frontier, open source or pricing in one click. */
import { useEffect } from 'react';
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
import { Figures } from '../home/useFigures';
import { A } from '../kit';
import { track } from '../../lib/track';
import C from '../../content';
import './Home.css';
import '../home/wow.css';

/* Where a link goes, as the funnel names it: a path on this site, origin and path elsewhere, with its own query kept and
   the visitor ids another Hanzo host is handed (hz_aid, hz_sid, hz_ft) taken off, so a target is one value however many
   people press it (app components/home/Home.tsx). */
function target(a) {
  const u = new URL(a.href);
  for (const k of ['hz_aid', 'hz_sid', 'hz_ft']) u.searchParams.delete(k);
  const q = u.searchParams.toString();
  return `${u.origin === location.origin ? '' : u.origin}${u.pathname}${q ? `?${q}` : ''}${u.hash}`;
}

/* Every link followed on the landing is one funnel event: cta_clicked { page, section, cta, target }. The section is
   the band the link stands in (its data-hz-view, else its data-slot); the cta is the link's data-cta or its words.
   A link marked data-ga sends its own moment (a plan card's plan_clicked). */
function useCtas() {
  useEffect(() => {
    const click = (e) => {
      const a = e.target?.closest?.('main a[href]');
      if (!a || a.hasAttribute('data-ga')) return;
      const section = a.closest('[data-hz-view]')?.getAttribute('data-hz-view') ?? a.closest('[data-slot]')?.getAttribute('data-slot') ?? 'page';
      const cta = a.getAttribute('data-cta') ?? (a.getAttribute('aria-label') || a.textContent || '').trim().slice(0, 80);
      track('cta_clicked', { page: '/', section, cta, target: target(a) });
    };
    document.addEventListener('click', click, { capture: true });
    return () => document.removeEventListener('click', click, { capture: true });
  }, []);
}

export default function Home({ figures }) {
  useCtas();
  return (
    <Figures.Provider value={figures}>
    <main>
      <A to="/beta" className="x-ann" data-slot="beta">
        <span>Apply for Beta Access or Start Free</span>
      </A>
      <Hero />
      <Marquee items={C.backed} label="Backed by" />
      <Models />
      <Platform />
      <Agents />
      <Race />
      <Cheaper />
      <Pareto />
      <Open />
      <Pricing />
      <Marquee items={C.trusted} label="Trusted by" reverse view="trusted" />
    </main>
    </Figures.Provider>
  );
}
