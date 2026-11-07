'use client';
/* Home, the models (v2, Open). A tile grid of the models' own pictures, Apple-style: Enso huge, Kai and Zen beside it,
   the six creative models as a strip below; nine real visuals on screen at once (JAMES.md 6). Enso's film plays while
   it is on screen; pointing at (or focusing) any other tile plays its film and brings up its tags, so at most two films
   ever run (PLAN-COMPONENTS 2.10). A click lifts the picture off the page and opens it into the model's own page (WebGL
   opener, synchronized.studio). Pause stops the films (WCAG 2.2.2); reduced motion and Data Saver keep the posters. */
import { useState } from 'react';
import { Arrow } from './ui';
import { Img, Film } from './kit';
import { useOpener } from './Opener';
import { MODELS, media } from '../lib/models';
import Lines from './v2/Lines';

function Tile({ m, i, active, setActive, paused }) {
  const [box, setBox] = useState(null);
  const opener = useOpener();
  const plays = !paused && (i === 0 || active === i);
  return (
    <li className={'hv-tile t' + i}>
      <a
        href={'/' + m.slug}
        className="hv-tile-a"
        data-card={m.slug}
        ref={setBox}
        onClick={(e) => opener.open(e, { el: box, src: media(m.slug, 'webp'), href: '/' + m.slug, key: m.slug })}
        onPointerEnter={() => setActive(i)}
        onPointerLeave={() => setActive((a) => (a === i ? -1 : a))}
        onFocus={() => setActive(i)}
        onBlur={() => setActive((a) => (a === i ? -1 : a))}
        aria-label={`${m.name}: ${m.desc}`}
      >
        <span className="hv-tile-media">
          <Img src={media(m.slug, 'webp')} w={1200} h={1500} priority={i === 0} />
          {plays && <Film src={media(m.slug, 'webm')} w={1200} h={1500} onPlaying={(e) => e.currentTarget.classList.add('on')} />}
        </span>
        <span className="hv-tile-text">
          <span className="hv-tile-name">{m.name}<svg viewBox="0 0 16 16" width="20" height="20" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
          {m.kicker && <span className="hv-tile-kick">{m.kicker}</span>}
          <span className="hv-tile-desc">{m.desc}</span>
        </span>
        <span className="hv-tile-tags">{m.tags.map((t) => <span key={t}>{t}</span>)}</span>
      </a>
    </li>
  );
}

export default function Models() {
  const [active, setActive] = useState(-1);
  const [paused, setPaused] = useState(false);
  return (
    <section className="hv-models v2-sec" id="models" aria-labelledby="models-h">
      <div className="v2-wrap">
        <header className="hv-head v2-grid">
          <Lines as="h2" id="models-h" className="v2-display-s hv-head-t" lines={['Frontier AI for', 'everything you build.']} />
          <div className="hv-head-r">
            <p className="v2-lede">Language, routing, decisions and creative models.</p>
            <div className="hv-links">
              <Arrow href="/pricing">Explore model pricing</Arrow>
              <Arrow href="/models">View full model catalog</Arrow>
            </div>
          </div>
        </header>
        <div className="hv-tiles-wrap">
          {/* WCAG 2.2.2: the films can be stopped; this control comes before them */}
          <button type="button" className="hv-pause hv-tiles-pause" aria-label="Pause" aria-pressed={paused} onClick={() => setPaused((x) => !x)}>
            <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
              {paused ? <path d="M5 3.5v9l7.5-4.5z" fill="currentColor" /> : <><rect x="4" y="3.5" width="2.6" height="9" rx=".8" fill="currentColor" /><rect x="9.4" y="3.5" width="2.6" height="9" rx=".8" fill="currentColor" /></>}
            </svg>
          </button>
          <ul className="hv-tiles">{MODELS.map((x, i) => <Tile key={x.slug} m={x} i={i} active={active} setActive={setActive} paused={paused} />)}</ul>
        </div>
      </div>
    </section>
  );
}
