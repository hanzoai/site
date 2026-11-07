'use client';
/* Hanzo's black model cards, copied exactly from live hanzo.ai (docs/refs/hanzo-model-cards/SPEC.md): Enso tall on the
   left (385×452 at a 1131px content width), Kai Zen Iro Koma over Oto Koe Uta Mori (192×220), 12px gaps; #000 cards
   with 20px radii, the title and its arrow top left at 21px, the description under it, the tag pills at the foot, the
   model's own film over its poster (never filtered or dimmed), and a pointer-follow tilt of up to 3° that settles flat
   on leave. Used as the "related" block of every named model page (/enso … /mori); the page you are on is marked.
   Films: Enso's plays while in view and the card under the pointer or focus plays too, so at most two run at once
   (PLAN-COMPONENTS 2.10). A click lifts the card into its page (WebGL opener, synchronized.studio); reduced motion and
   touch navigate plainly. Owned by the Zen-names chat. */
import { useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { Img, Film } from '../../kit';
import { Arrow } from '../../ui';
import { useOpener } from '../../Opener';
import { MODELS, media } from '../../../lib/models';
import { scrollToY } from '../../../lib/scroll';
import './ModelCards.css';

function Card({ m, big, here, live, setLive }) {
  const ref = useRef(null);
  const opener = useOpener();
  const calm = useReducedMotion();
  const tilt = (e) => {
    if (calm || e.pointerType !== 'mouse') return;
    const r = ref.current.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 2 - 1, y = ((e.clientY - r.top) / r.height) * 2 - 1;
    ref.current.style.transform = `perspective(900px) rotateX(${(y * 3).toFixed(2)}deg) rotateY(${(-x * 3).toFixed(2)}deg)`;
  };
  const flat = () => { if (ref.current) ref.current.style.transform = ''; setLive((a) => (a === m.slug ? null : a)); };
  const plays = big || live === m.slug;
  return (
    <li className={'mc-cell' + (big ? ' big' : '')}>
      <a
        ref={ref}
        href={'/' + m.slug}
        className="mc-card"
        data-card={m.slug}
        data-cursor=""
        aria-current={here ? 'page' : undefined}
        onPointerEnter={() => setLive(m.slug)}
        onPointerMove={tilt}
        onPointerLeave={flat}
        onFocus={() => setLive(m.slug)}
        onBlur={flat}
        onClick={(e) => {
          if (here) { e.preventDefault(); scrollToY(0); return; }
          opener.open(e, { el: ref.current, src: media(m.slug, 'webp'), href: '/' + m.slug, key: m.slug });
        }}
      >
        <span className="mc-media" aria-hidden="true">
          <Img src={media(m.slug, 'webp')} w={1200} h={1500} />
          {plays && <Film src={media(m.slug, 'webm')} w={1200} h={1500} className="mc-film" onPlaying={(e) => e.currentTarget.classList.add('on')} />}
        </span>
        <span className="mc-top">
          {big && m.kicker && <span className="mc-pill mc-flag">{m.kicker}</span>}
          <span className="mc-t">{m.name}<span className="mc-arr" aria-hidden="true"> →</span></span>
          <span className="mc-d">{m.desc}</span>
        </span>
        <span className="mc-tags">{m.tags.map((t) => <span key={t} className="mc-pill">{t}</span>)}</span>
      </a>
    </li>
  );
}

export default function ModelCards({ slug }) {
  const [live, setLive] = useState(null);
  return (
    <section className="mc lv-sec" aria-labelledby="mc-h">
      <div className="mc-wrap">
        <h2 id="mc-h" className="mc-h">Frontier AI for everything you build.</h2>
        <p className="mc-sub">Language, routing, decisions and creative models.</p>
        <ul className="mc-grid">
          {MODELS.map((m, i) => <Card key={m.slug} m={m} big={i === 0} here={m.slug === slug} live={live} setLive={setLive} />)}
        </ul>
        <p className="mc-links">
          <Arrow href="/pricing">Explore model pricing</Arrow>
          <Arrow href="/models">View full model catalog</Arrow>
        </p>
      </div>
    </section>
  );
}
