'use client';
/* Home. Signature: the live hero, a prompt typed into the desktop app while the phone answers and the agent roster rolls,
   over a halftone field that swells under the pointer; below it the model cards open into their pages (WebGL).
   Beyond: the spine. A quiet "on this page" index at the right edge, written from the page's own section headings,
   that marks where you are and jumps to speed, cost, the frontier, open source or pricing in one click. */
import { useEffect, useState } from 'react';
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
import { onDomChange } from '../../lib/domwatch';
import { track } from '../../lib/track';
import C from '../../content';
import './Home.css';
import '../home/wow.css';

/* Beyond: the section index, read from the headings on the page (desktop only; phones have the thumb bar) */
function Spine() {
  const [list, setList] = useState([]);
  const [at, setAt] = useState('');
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) setAt(e.target.id); }), { rootMargin: '-45% 0px -50% 0px' });
    const watch = () => {
      const secs = [...document.querySelectorAll('main > section[id][aria-labelledby]')];
      setList(secs.map((s) => [s.id, document.getElementById(s.getAttribute('aria-labelledby'))?.textContent.trim() || s.id]));
      secs.forEach((s) => io.observe(s));
    };
    watch();
    const off = onDomChange(watch);
    const hero = document.querySelector('.x-hero');
    const top = new IntersectionObserver(([e]) => { if (e.isIntersecting) setAt(''); });
    hero && top.observe(hero);
    return () => { io.disconnect(); top.disconnect(); off(); };
  }, []);
  if (!list.length) return null;
  return (
    <nav className={'xh-spine' + (at ? ' on' : '')} aria-label="On this page">
      <ol>{list.map(([id, t]) => <li key={id}><a href={'#' + id} aria-current={at === id ? 'true' : undefined}><span>{t}</span></a></li>)}</ol>
    </nav>
  );
}

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
   A link marked data-ga sends its own moment (a plan card's plan_clicked). The "on this page" index is a way around the
   page, not a call to act, so it is not counted. */
function useCtas() {
  useEffect(() => {
    const click = (e) => {
      const a = e.target?.closest?.('main a[href]');
      if (!a || a.hasAttribute('data-ga') || a.closest('.xh-spine')) return;
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
        <svg data-beta-spark="" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
          <path d="M20 3v4M22 5h-4M4 17v2M5 18H3" />
        </svg>
        <span>Apply for Beta Access or Start Free</span>
        <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" />
        </svg>
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
      <Spine />
    </main>
    </Figures.Provider>
  );
}
