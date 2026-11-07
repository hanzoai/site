'use client';
/* SpecCard (components/v2, owned by the Models chat). Hanzo's model card exactly as live hanzo.ai draws it
   (docs/refs/hanzo-model-cards/SPEC.md): #000, 20px radius, no shadow or border; the title 22px/500/-0.44px with its
   "→" at the top left, inset 21px; the description 13px/18px at 80% white under it; Zen Mono 10px capital pills at the
   foot; the model's film (if it has one) over its poster, never dimmed; a pointer-follow tilt of up to about 3° that
   settles flat on leave (.3s cubic-bezier(.2,.8,.2,1)), no scale, no lift; press .98. SPEC: "Same design wherever the
   model cards appear": the /models catalogue, the maker shelves and the related cards on every model page use this.
   (components/pages/model/ModelCards.jsx draws the fixed nine-card grid on the flagship pages with the same values;
   one source for both is a request in docs/coverage/models.md.)
   Usage:
     <SpecCard to="/models/hanzo/enso" title="Enso" desc="…" tags={['text']} meta={<code>enso</code>} />
     <SpecCard to="/koma" slug="koma" play={hovered} title="Koma" desc="…" tags={['Video']} card="koma" onOpen={open} />
       slug: the model's film and poster; card: data-card key for the WebGL opener (then onOpen(e, el) opens it);
       big: Enso's size (44px title, kicker pill above it); meta: one extra line under the title (ids, context, rate). */
import { useRef } from 'react';
import { useReducedMotion } from 'motion/react';
import { A } from '../kit';
import ModelFilm from './ModelFilm';
import './SpecCard.css';

/* the measured tilt: about ±3° toward the pointer, flat again on leave; mouse only, never under reduced motion */
export function useSpecTilt() {
  const ref = useRef(null);
  const calm = useReducedMotion();
  const onPointerMove = (e) => {
    const el = ref.current;
    if (calm || e.pointerType !== 'mouse' || !el) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 2 - 1, y = ((e.clientY - r.top) / r.height) * 2 - 1;
    el.style.transform = `perspective(900px) rotateX(${(y * 2.7).toFixed(2)}deg) rotateY(${(-x * 2.7).toFixed(2)}deg)`;
  };
  const onPointerLeave = () => { if (ref.current) ref.current.style.transform = ''; };
  return { ref, onPointerMove, onPointerLeave };
}

export default function SpecCard({ to, title, desc, tags = [], meta, slug, play = false, big = false, kicker, card, onOpen, onHot, className = '', label }) {
  const tilt = useSpecTilt();
  const hot = (v) => onHot && onHot(v);
  return (
    <A
      to={to}
      ref={tilt.ref}
      className={'sc-card' + (big ? ' big' : '') + (slug ? ' film' : '') + ' ' + className}
      {...(card ? { 'data-card': card } : {})}
      {...(label ? { 'aria-label': label } : {})}
      onPointerMove={tilt.onPointerMove}
      onPointerEnter={() => hot(true)}
      onPointerLeave={() => { tilt.onPointerLeave(); hot(false); }}
      onFocus={() => hot(true)}
      onBlur={() => hot(false)}
      onClick={onOpen ? (e) => onOpen(e, e.currentTarget) : undefined}
    >
      {slug && <span className="sc-media" aria-hidden="true"><ModelFilm slug={slug} play={play} /></span>}
      <span className="sc-top">
        {kicker && <span className="sc-pill sc-flag">{kicker}</span>}
        <span className="sc-t"><span {...(card ? {} : { 'data-morph': '' })}>{title}</span>{' '}<span className="sc-arr" aria-hidden="true">→</span></span>
        {meta && <span className="sc-meta">{meta}</span>}
        {desc && <span className="sc-d">{desc}</span>}
      </span>
      {tags.length > 0 && <span className="sc-tags">{tags.map((t) => <span key={t} className="sc-pill">{t}</span>)}</span>}
    </A>
  );
}
