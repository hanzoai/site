'use client';
/* AskBar (components/v2, owned by the Wave 2 "Proof" chat). JAMES.md 5: "One solid ask in Hanzo's words. It sits in
   the header and in a sticky bar after the hero at every width." On desktops (>900px) a quiet pill rises at the foot
   of the screen once the hero has gone by, carrying the page's name and its one ask, and steps aside for the footer
   and for open sheets. On phones the site's thumb bar already does this job: put data-thumb on the hero's ask (see
   components/Phone.jsx) and AskBar stays out of the way.
   Usage (last child of the page's <main>):
     <AskBar title="Leaderboard" label="Open bounties" to="/bounty" />
   Props: title (the page's own name), label + to (the hero's ask, verbatim), hero (CSS selector of the hero; default
   the first section in <main>). Press is scale .98; the arrow nudges on hover. Reduced motion: it simply appears. */
import { useEffect, useRef, useState } from 'react';
import { A } from '../kit';
import './AskBar.css';

export default function AskBar({ title, label, to, hero }) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const main = ref.current?.closest('main') || document;
    const h = hero ? document.querySelector(hero) : main.querySelector('section');
    const foot = document.querySelector('footer');
    let past = false, atFoot = false;
    const set = () => setOn(past && !atFoot && !document.querySelector('.pf-sheet[data-open="true"]'));
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => {
        if (e.target === h) past = !e.isIntersecting && e.boundingClientRect.top < 0;
        if (e.target === foot) atFoot = e.isIntersecting;
      });
      set();
    }, { threshold: 0 });
    if (h) io.observe(h);
    if (foot) io.observe(foot);
    const mo = new MutationObserver(set);
    mo.observe(document.body, { subtree: true, attributes: true, attributeFilter: ['data-open'] });
    return () => { io.disconnect(); mo.disconnect(); };
  }, [hero]);
  return (
    <div ref={ref} className="pf-ask" data-on={on} aria-hidden={!on} inert={!on}>
      <span className="pf-ask-t">{title}</span>
      <A to={to} className="pf-ask-b">
        <span>{label}</span>
        <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </A>
    </div>
  );
}
