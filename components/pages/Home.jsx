'use client';
// Persona: developer evaluating Hanzo (first visit); enterprise buyers and founders pass through to /enterprise and /pricing
// Goal: understand "one key reaches every model, for less" in 5 s, then start (MASTER 4.1)
// CTA: "Try Hanzo" → https://hanzo.ai/signup, the sticky header's solid ask at every width (the floating ask bar is off
//      here: nothing floats over content); the hero keeps live hanzo.ai's own sign-up group
// Metric: api_key_created (leading: signup_start via data-cta="home.*", install_copy)
// Signature: a model card opens into its page (SPEC.md cards, WebGL opener), after live hanzo.ai's own hero, kept exactly.
// Beyond: the question-count control on Enso's cost: say how many GPQA Diamond questions and every lane reprices from
//   Hanzo's own per-1,000 rates.
/* Home, v2 (MASTER 3.1, 4.1). The hero is live hanzo.ai's own; every section after it is chaptered, one idea per screen,
   with scale that has rhythm: headings rest at 26px, sublines at 16px, figures at 64px in Zen Air, and a figure grows
   only while it is the moment (the race running, a claim crossing the screen, the year's commits arriving), then
   settles. Motion by kind: time (the hero demo types, sends, answers; the race runs at true speed; counts run once),
   pointer (model cards tilt, the budget line drags, the calendar lens, the repo rail), state (console and pricing
   tabs glide, prices roll, Replay), arrival (headlines cut into their lines), scroll (the product chapters wipe, the
   argument room opens and closes like a door, figures grow and settle).
   Order (MASTER 4.1): hero → model cards → platform chapters → agents → one dark room (speed, cost, frontier) → open
   source → Trusted by → pricing → Backed by → closing band. Colour: none in the UI; only Hanzo's own media. */
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
