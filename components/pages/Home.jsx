'use client';
// Persona: developer evaluating Hanzo (first visit); enterprise buyers and founders pass through to /enterprise and /pricing
// Goal: understand "one key reaches every model, for less" in 5 s, then start (PLAN-COMPONENTS 1, brief 5.1)
// CTA: "Try Hanzo" → https://hanzo.ai/signup (header, the site ask bar after the hero, pricing, closing band); every
//      hero button is quiet so exactly one solid ask is on screen
// Metric: api_key_created (leading: signup_start via data-cta="home.*", install_copy)
// Signature: Stage and Open. The live desktop app sits huge under "Pick all three." and settles as you scroll while
//   the phone slides out from behind it (Hero.jsx); every model tile lifts off and opens into its page (Models.jsx),
//   and every product name opens into its page (Platform.jsx).
// Beyond: the spine, a quiet chapter index at the right edge written from the page's own headings.
/* Home, v2 (the bar-setter, docs/VISION.md, JAMES.md, PLAN-COMPONENTS 5.1). Chaptered: one idea per screen, the
   product as the hero, every card opens. Motion by kind: time (the hero demo types, sends and answers; the install
   line types; the roster steps), pointer (the app leans, the agent wall swells, tiles play their film and show their
   tags), state (console tabs and pricing tabs glide, prices roll, the race replays), arrival (headlines cut into
   their lines), scroll (the stage settles, the product chapters wipe, the argument room opens like a door).
   Rhythm: stage → model tiles → pinned chapters → agent wall + console → the one dark room (speed, cost, frontier as
   one argument) → figures + calendar + rail → logo wall → calm pricing → backers → closing band.
   Colour: none in the UI (JAMES.md 7); only Hanzo's own media brings colour. */
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
