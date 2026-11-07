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
import { useEffect, useRef, useState } from 'react';
import { A, Band, Img } from '../kit';
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

/* Nothing floats over content (MASTER 3.3): the site's contextual cursor stays silent on this page. It reads
   data-cursor from the element under the pointer, so every link, card and rail here carries an empty one. */
function useQuietCursor() {
  useEffect(() => {
    const mark = () => document.querySelectorAll('main.hv a, main.hv [data-card], main.hv [data-morph], main.hv .x-rail, main.hv [role=slider]').forEach((el) => { if (!el.hasAttribute('data-cursor')) el.setAttribute('data-cursor', ''); });
    mark();
    const mo = new MutationObserver(mark);
    mo.observe(document.querySelector('main.hv'), { childList: true, subtree: true });
    return () => mo.disconnect();
  }, []);
}

/* The proof walls (PLAN-COMPONENTS 2.5): still, ordered rows of Hanzo's own logo files, grey until you point at one,
   which then shows its own colour and its name. If a logo file cannot load, its name stands in for it. */
function Wall({ items, label, cta }) {
  const ref = useRef(null);
  useEffect(() => {
    ref.current?.querySelectorAll('img').forEach((im) => {
      const fail = () => im.closest('a')?.setAttribute('data-fail', '');
      if (im.complete && !im.naturalWidth) fail(); else im.addEventListener('error', fail, { once: true });
    });
  }, []);
  return (
    <section className="hv-proof" aria-label={label} ref={ref}>
      <div className="v2-wrap hv-proof-in">
        <p className="hv-proof-t">{label}</p>
        <ul style={{ '--n': items.length > 7 ? 6 : items.length }}>
          {items.map((l) => (
            <li key={l.name}>
              <A to={l.href} className="hv-logo" data-cta={`home.${cta}.${l.name.toLowerCase().replace(/\W+/g, '-')}`}>
                <Img src={l.src} alt={l.name} w={160} h={40} />
                <span>{l.name}</span>
              </A>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default function Home() {
  useQuietCursor();
  return (
    <main className="hv" data-ask="off">
      <A to="/beta" className="x-ann">
        <span>Apply for Beta Access or Start Free</span>
        <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </A>
      <Hero />
      <Models />
      <Platform />
      <Agents />
      <Race />
      <Cheaper />
      <Pareto />
      <Open />
      <Wall items={C.trusted} label="Trusted by" cta="trusted" />
      <Pricing />
      <Wall items={C.backed} label="Backed by" cta="backed" />
      <Band title="Pick all three." lede="Every model behind one key." action="Try Hanzo" to="https://hanzo.ai/signup" />
    </main>
  );
}
