'use client';
/* AskBar (components/v2, owned by the Wave 2 "Proof" chat). JAMES.md 5: "One solid ask in Hanzo's words. It sits in
   the header and in a sticky bar after the hero at every width." On desktops (>900px) a quiet pill rises at the foot
   of the screen once the hero has gone by, carrying the page's name and its one ask, and steps aside for the footer,
   for any on-screen copy of the same ask (elements with the same data-cta, e.g. the closing button),
   open sheets and the cookie card (PLAN-COMPONENTS 0.9: two fixed layers at most). On phones the site's thumb bar already does this job: put data-thumb on the hero's ask (see
   components/Phone.jsx) and AskBar stays out of the way.
   Usage (last child of the page's <main>):
     <AskBar title="Leaderboard" label="Open bounties" to="/bounty" />
   Props: title (the page's own name), label + to (the hero's ask, verbatim), hero (CSS selector of the hero; default
   the first section in <main>), cta (the data-cta id, same as the hero's). Press is scale .98; the arrow nudges on hover. Reduced motion: it simply appears. */
import { useEffect, useRef, useState } from 'react';
import { A } from '../kit';
import './AskBar.css';

export default function AskBar({ title, label, to, hero, cta }) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const main = ref.current?.closest('main') || document;
    const h = hero ? document.querySelector(hero) : main.querySelector('section');
    const foot = document.querySelector('footer');
    // the page's own copies of this ask (hero, close): while one is on screen the bar would only repeat it
    const twins = cta ? [...main.querySelectorAll(`[data-cta="${cta}"]`)].filter((e) => !ref.current?.contains(e)) : [];
    const seen = new Set();
    let past = false, atFoot = false;
    // PLAN-COMPONENTS 0.9: at most two fixed layers, so it waits while the cookie card or a sheet is up
    const set = () => setOn(past && !atFoot && !seen.size && !document.querySelector('.pf-sheet[data-open="true"], .x-cookie, .x-pal, .x-pop'));
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => {
        if (e.target === h) past = !e.isIntersecting && e.boundingClientRect.top < 0;
        if (e.target === foot) atFoot = e.isIntersecting;
        if (twins.includes(e.target)) { if (e.isIntersecting) seen.add(e.target); else seen.delete(e.target); }
      });
      set();
    }, { threshold: 0 });
    if (h) io.observe(h);
    if (foot) io.observe(foot);
    twins.forEach((t) => io.observe(t));
    const mo = new MutationObserver(set);
    mo.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ['data-open'] });
    return () => { io.disconnect(); mo.disconnect(); };
  }, [hero, cta]);
  return (
    <div ref={ref} className="pf-ask" data-on={on} aria-hidden={!on} inert={!on}>
      <span className="pf-ask-t">{title}</span>
      <A to={to} className="pf-ask-b" data-cta={cta}>
        <span>{label}</span>
        <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </A>
    </div>
  );
}
