'use client';
/* Home, v2 (the bar-setter, docs/VISION.md). Chaptered: one idea per screen, the product as the hero, every card opens.
   Signature: Stage and Open. The live desktop app sits huge under "Pick all three." and settles into its place as you
   scroll while the phone and the terminal arrive (Hero.jsx); every model tile lifts off and opens into its own page,
   and every product name opens into its page (Models.jsx, Platform.jsx).
   Supporting (three): Chapters, the platform pinned and told one product at a time, each screen wiping up over the
   last; Live product, the hero demo typing by itself (the only thing that moves while the page is idle); Kinetic type,
   every headline rising out of a line mask once. Hand-driven parts answer on springs (budget line, slider, rails).
   Rhythm: stage → logo wall → media tiles → pinned chapters → agent wall + console → the one dark room → figures on
   white → wide chart → figures + calendar + rail → calm pricing → logo wall.
   Accent: Hanzo's own product blue (the chat UI's data-blue-9), used only for progress, Hanzo's own bars and selection.
   Beyond: the spine. A quiet chapter index at the right edge, written from the page's own headings, that marks where
   you are and jumps to speed, cost, the frontier, open source or pricing in one click. */
import { useEffect, useState } from 'react';
import { Marquee } from '../Chrome';
import Hero from '../Hero';
import Models from '../Models';
import Platform from '../Platform';
import Agents from '../Agents';
import Race from '../Race';
import Cheaper from '../Cheaper';
import Pareto from '../Pareto';
import Open from '../Open';
import Pricing from '../Pricing';
import C from '../../content';
import '../v2/system.css';
import './Home.css';

/* Beyond: the chapter index, read from the headings on the page (desktop only; phones have the thumb bar) */
function Spine() {
  const [list, setList] = useState([]);
  const [at, setAt] = useState('');
  useEffect(() => {
    const secs = [...document.querySelectorAll('main > section[id][aria-labelledby]')];
    setList(secs.map((s) => [s.id, document.getElementById(s.getAttribute('aria-labelledby'))?.textContent.replace(/\s+/g, ' ').trim() || s.id]));
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) setAt(e.target.id); }), { rootMargin: '-45% 0px -50% 0px' });
    secs.forEach((s) => io.observe(s));
    const hero = document.querySelector('.hv-hero');
    const top = new IntersectionObserver(([e]) => { if (e.isIntersecting) setAt(''); }, { rootMargin: '0px 0px -60% 0px' });
    hero && top.observe(hero);
    return () => { io.disconnect(); top.disconnect(); };
  }, []);
  if (!list.length) return null;
  const dark = at === 'faster';
  return (
    <nav className={'hv-spine' + (at ? ' on' : '') + (dark ? ' dark' : '')} aria-label="On this page">
      <ol>{list.map(([id, t], i) => <li key={id}><a href={'#' + id} aria-current={at === id ? 'true' : undefined}><span><b>{String(i + 1).padStart(2, '0')}</b>{t}</span></a></li>)}</ol>
    </nav>
  );
}

export default function Home() {
  return (
    <main className="hv">
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
      <Marquee items={C.trusted} label="Trusted by" reverse />
      <Spine />
    </main>
  );
}
