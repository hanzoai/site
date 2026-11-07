'use client';
/* Home, the models (v2, Open). A tile grid of the models' own films, Apple-style: Enso huge, Kai and Zen beside it,
   the six creative models as a film strip below. Each film plays on its own while on screen. Pointing at a tile
   brings up what it does; a click lifts its picture off the page and opens it into the model's own page (WebGL opener). */
import { useEffect, useRef } from 'react';
import { Arrow } from './ui';
import { useOpener } from './Opener';
import { MODELS, media } from '../lib/models';
import Lines from './v2/Lines';

function Tile({ m, i }) {
  const vid = useRef(null);
  const box = useRef(null);
  const opener = useOpener();
  // every film plays while its tile is on screen, and rests when it leaves
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const v = vid.current;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) v.play().catch(() => {}); else v.pause(); }, { threshold: 0.25 });
    io.observe(v);
    return () => io.disconnect();
  }, []);
  return (
    <li className={'hv-tile t' + i}>
      <a
        href={'/' + m.slug}
        className="hv-tile-a"
        data-card={m.slug}
        ref={box}
        onClick={(e) => opener.open(e, { el: box.current, src: media(m.slug, 'webp'), href: '/' + m.slug, key: m.slug })}
        aria-label={`${m.name}: ${m.desc}`}
      >
        <span className="hv-tile-media">
          <img src={media(m.slug, 'webp')} alt="" loading={i < 3 ? 'eager' : 'lazy'} />
          <video ref={vid} src={media(m.slug, 'webm')} muted loop playsInline preload="metadata" aria-hidden="true" onPlaying={(e) => e.currentTarget.classList.add('on')} />
        </span>
        <span className="hv-tile-text">
          {m.kicker && <span className="hv-tile-kick">{m.kicker}</span>}
          <span className="hv-tile-name">{m.name}<svg viewBox="0 0 16 16" width="20" height="20" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
          <span className="hv-tile-desc">{m.desc}</span>
        </span>
        <span className="hv-tile-tags">{m.tags.map((t) => <span key={t}>{t}</span>)}</span>
      </a>
    </li>
  );
}

export default function Models() {
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
        <ul className="hv-tiles">{MODELS.map((x, i) => <Tile key={x.slug} m={x} i={i} />)}</ul>
      </div>
    </section>
  );
}
