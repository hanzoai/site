'use client';
/* Home, section 2: hanzo.ai's model cards, replicated exactly (docs/refs/hanzo-model-cards/SPEC.md, measured on the
   live site; James: "it needs to be the exact same"). Same place (right after a one-screen hero), same grid (Enso 2fr
   over two rows, then Kai Zen Iro Koma / Oto Koe Uta Mori), same black cards, type, pills and links under the grid.
   Each model's film loops over its poster while the card is on screen (0.6 s crossfade, never dimmed). The movement is
   the live one: a pointer-follow tilt, up to about ±3°, perspective 900 px, .3 s cubic-bezier(.2,.8,.2,1), settling
   flat on leave; no tilt for touch or reduced motion. Our only additions are the shared layers: the click lifts the
   picture into the model's own page (WebGL opener), and a pause for the films (WCAG 2.2.2) beside the subline. */
import { useState } from 'react';
import { Img, Film } from './kit';
import { fine } from './ui';
import { useOpener } from './Opener';
import { MODELS, media } from '../lib/models';

function Card({ m, i, paused }) {
  const [box, setBox] = useState(null);
  const opener = useOpener();
  const tilt = (e) => {
    if (!box || !fine(e) || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const r = box.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
    box.style.transform = `perspective(900px) rotateX(${((py - 0.5) * 5.4).toFixed(2)}deg) rotateY(${(-(px - 0.5) * 5.4).toFixed(2)}deg)`;
  };
  const rest = () => { if (box) box.style.transform = ''; };
  return (
    <li className={'hv-mc-li' + (i === 0 ? ' enso' : '')}>
      <a
        href={'/' + m.slug}
        className="hv-mc"
        data-card={m.slug}
        ref={setBox}
        onClick={(e) => opener.open(e, { el: box, src: media(m.slug, 'webp'), href: '/' + m.slug, key: m.slug })}
        onPointerMove={tilt}
        onPointerLeave={rest}
        aria-label={`${m.name}: ${m.desc}`}
      >
        <span className="hv-mc-media" aria-hidden="true">
          <Img src={media(m.slug, 'webp')} w={1200} h={1500} priority={i === 0} />
          {!paused && <Film src={media(m.slug, 'webm')} w={1200} h={1500} onPlaying={(e) => e.currentTarget.classList.add('on')} />}
        </span>
        {m.kicker && <span className="hv-mc-pill hv-mc-flag">{m.kicker}</span>}
        <span className="hv-mc-t">{m.name} <span aria-hidden="true">→</span></span>
        <span className="hv-mc-d">{m.desc}</span>
        <span className="hv-mc-tags">{m.tags.map((t) => <span className="hv-mc-pill" key={t}>{t}</span>)}</span>
      </a>
    </li>
  );
}

export default function Models() {
  const [paused, setPaused] = useState(false);
  return (
    <section className="hv-models" id="models" aria-labelledby="models-h">
      <div className="hv-mc-wrap">
        <div className="hv-mc-head">
          <div>
            <h2 id="models-h" className="hv-mc-h">Frontier AI for everything you build.</h2>
            <p className="hv-mc-sub">Language, routing, decisions and creative models.</p>
          </div>
          {/* WCAG 2.2.2: the films can be stopped; this control comes before them */}
          <button type="button" className="hv-pause hv-mc-pause" aria-label="Pause" aria-pressed={paused} onClick={() => setPaused((x) => !x)}>
            <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
              {paused ? <path d="M5 3.5v9l7.5-4.5z" fill="currentColor" /> : <><rect x="4" y="3.5" width="2.6" height="9" rx=".8" fill="currentColor" /><rect x="9.4" y="3.5" width="2.6" height="9" rx=".8" fill="currentColor" /></>}
            </svg>
          </button>
        </div>
        <ul className="hv-mc-grid">{MODELS.map((x, i) => <Card key={x.slug} m={x} i={i} paused={paused} />)}</ul>
        <div className="hv-mc-links">
          <a href="/pricing" className="hv-mc-link" data-cta="home.models.pricing">Explore model pricing →</a>
          <a href="/models" className="hv-mc-link" data-cta="home.models.catalog">View full model catalog →</a>
        </div>
      </div>
    </section>
  );
}
