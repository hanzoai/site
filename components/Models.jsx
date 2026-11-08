'use client';
import { useEffect, useRef, useState } from 'react';
import { Head, Arrow } from './ui';
import { useOpener } from './Opener';
import { MODELS, media } from '../lib/models';

/* Wide screens with motion and WebGL get the journey (components/models/Journey.jsx, with three.js, imported only when
   the section comes near). Phones, reduced motion and no WebGL keep the card grid. Until then the server's markup holds
   the journey's place at its full height (CSS decides: models/Journey.css, pulled in by pages/Home.css), so nothing below it moves. */

/* A model card, the static version (phones, reduced motion, no WebGL): Hanzo's still of the model, its words and tags.
   A click lifts the picture off the page and opens it into the model's own page. */
function Card({ m, i }) {
  const box = useRef(null);
  const opener = useOpener();
  const href = '/' + m.slug, src = media(m.slug, 'webp');
  return (
    <li className={'x-mcard' + (i === 0 ? ' big' : '')}>
      <a
        href={href}
        className="x-mbtn"
        data-card={m.slug}
        ref={box}
        onClick={(e) => opener.open(e, { el: box.current, src, href, key: m.slug })}
        aria-label={`${m.name}: ${m.desc}`}
      >
        <span className="x-mtilt">
          <span className="x-mmedia">
            <img src={src} alt="" />
          </span>
          <span className="x-mtext">
            {m.kicker && <span className="x-mkick">{m.kicker}</span>}
            <span className="x-mname">{m.name}<svg viewBox="0 0 16 16" width="18" height="18" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
            <span className="x-mdesc">{m.desc}</span>
          </span>
          <span className="x-mtags">{m.tags.map((t) => <span key={t}>{t}</span>)}</span>
        </span>
      </a>
    </li>
  );
}

const LEDE = 'Language, routing, decisions and creative models.';

export default function Models() {
  // null on the server and first paint (CSS picks), then 'grid' or the Journey module
  const [view, setView] = useState(null);
  const shell = useRef(null);
  useEffect(() => {
    // the CSS already chose (wide, motion allowed): the shell is laid out only then
    const el = shell.current;
    if (!el.offsetParent) return setView('grid');
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      import('./models/Journey').then(setView, () => setView('grid'));
    }, { rootMargin: '100%' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const Journey = view?.default;
  return (
    <section className="x-sec x-models" id="models" aria-labelledby="models-h" data-mode={view && (Journey ? 'journey' : view)}>
      <div className="x-wrap">
        <Head title="Frontier AI for everything you build." lede={LEDE} />
      </div>
      {!view && <div className="x-mj-shell" ref={shell} />}
      {Journey && <Journey models={MODELS} media={media} lede={LEDE} onFail={setView} />}
      <div className="x-wrap">
        {!Journey && <ul className="x-mgrid">{MODELS.map((x, i) => <Card key={x.slug} m={x} i={i} />)}</ul>}
        <div className="x-row-links">
          <Arrow href="/pricing">Explore model pricing</Arrow>
          <Arrow href="/models">View full model catalog</Arrow>
        </div>
      </div>
    </section>
  );
}
