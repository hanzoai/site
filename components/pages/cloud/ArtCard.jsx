'use client';
/* ArtCard (page-local, D2 cloud pages + /ui). Hanzo's own model art for the page, kept where hanzo.ai shows it: the black
   tilt card behind the six facts (live: data-model="<slug>" data-tilt, /models/<slug>.webp). COPY-RULE.md rule 5: never
   remove an image Hanzo shows. The film plays only on screen (ModelFilm rules); the card leans toward the pointer.
   Usage: <ArtCard slug="mori" className="st2-art" /> */
import { useRef } from 'react';
import { useReducedMotion } from 'motion/react';
import ModelFilm from '../../v2/ModelFilm';
import './ArtCard.css';

export default function ArtCard({ slug, className = '' }) {
  const ref = useRef(null);
  const calm = useReducedMotion();
  const move = (e) => {
    if (calm || e.pointerType !== 'mouse') return;
    const r = ref.current.getBoundingClientRect();
    ref.current.style.setProperty('--rx', ((0.5 - (e.clientY - r.top) / r.height) * 8).toFixed(2) + 'deg');
    ref.current.style.setProperty('--ry', (((e.clientX - r.left) / r.width - 0.5) * 10).toFixed(2) + 'deg');
  };
  const leave = () => { ref.current.style.setProperty('--rx', '0deg'); ref.current.style.setProperty('--ry', '0deg'); };
  return (
    <figure ref={ref} className={'art-card ' + className} data-model={slug} onPointerMove={move} onPointerLeave={leave}>
      <ModelFilm slug={slug} />
      <i className="art-card-scrim" aria-hidden="true" />
    </figure>
  );
}
