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
import { A } from '../kit';
import C from '../../content';
import './Home.css';

/* Beyond: the section index, read from the headings on the page (desktop only; phones have the thumb bar) */
function Spine() {
  const [list, setList] = useState([]);
  const [at, setAt] = useState('');
  useEffect(() => {
    const secs = [...document.querySelectorAll('main > section[id][aria-labelledby]')];
    setList(secs.map((s) => [s.id, document.getElementById(s.getAttribute('aria-labelledby'))?.textContent.trim() || s.id]));
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) setAt(e.target.id); }), { rootMargin: '-45% 0px -50% 0px' });
    secs.forEach((s) => io.observe(s));
    const hero = document.querySelector('.x-hero');
    const top = new IntersectionObserver(([e]) => { if (e.isIntersecting) setAt(''); });
    hero && top.observe(hero);
    return () => { io.disconnect(); top.disconnect(); };
  }, []);
  if (!list.length) return null;
  return (
    <nav className={'xh-spine' + (at ? ' on' : '')} aria-label="On this page">
      <ol>{list.map(([id, t]) => <li key={id}><a href={'#' + id} aria-current={at === id ? 'true' : undefined}><span>{t}</span></a></li>)}</ol>
    </nav>
  );
}

export default function Home() {
  return (
    <main>
      <A to="/beta" className="x-ann">
        <span>Apply for Beta Access or Start Free</span>
        <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
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
      <Marquee items={C.trusted} label="Trusted by" reverse />
      <Spine />
    </main>
  );
}
