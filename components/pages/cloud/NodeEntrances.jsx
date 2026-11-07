'use client';
/* Node's five section entrances (docs/MOTION-MAP.md rule 7, "Section entrances, in order"), page-local:
   1. vertical-ticker (A tenth: the five levels ride a vertical ticker up into place)
   2. conveyor        (three commands: the command bar and the processes ride in on a horizontal belt)
   3. underline-sweep (put a machine on the fabric: the three steps are underlined in sequence)
   4. text-mask-film  (paste and ship: a film of the fabric, drawn by the page, plays through the headline's letters)
   5. side-carousel   (why run a node: a horizontal snapping carousel that slides in a card's width and settles)
   Each plays once as its section arrives (IntersectionObserver). The start states live in Node.css under html.js and
   outside prefers-reduced-motion, so with JS off or reduced motion every section simply stands at its final state.
   Transform, opacity and clip only: nothing changes size, so nothing shifts. */
import { useEffect, useRef, useState } from 'react';

/* true once the element is `amount` in view; then it stays true */
export function useArrive(amount = 0.3) {
  const ref = useRef(null);
  const [inn, setInn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || inn) return;
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { setInn(true); io.disconnect(); } }, { threshold: amount });
    io.observe(el);
    return () => io.disconnect();
  }, [amount, inn]);
  return [ref, inn];
}

/* a wrapper that carries the entrance name and its arrived state; CSS does the motion */
export function Arrive({ as: T = 'div', e, amount, className = '', children, ...rest }) {
  const [ref, inn] = useArrive(amount);
  return <T ref={ref} className={className} data-ent={e} data-in={inn || undefined} {...rest}>{children}</T>;
}

/* vertical-ticker: the list sits in a window one list tall; a copy of it waits above, and the column rides up a full
   list's height and stops on the real one, like a departures ticker coming to rest. The copy is hidden from readers. */
export function Ticker({ children, copy, className = '' }) {
  const [ref, inn] = useArrive(0.45);
  return (
    <div ref={ref} className={'nd-tk ' + className} data-ent="ticker" data-in={inn || undefined}>
      <div className="nd-tk-col">
        <div className="nd-tk-copy" aria-hidden="true">{copy}</div>
        {children}
      </div>
    </div>
  );
}

/* underline-sweep: key words underlined one after another (--k orders them) */
export const Sweep = ({ k, children }) => <span className="nd-sw" style={{ '--k': k }}>{children}</span>;

/* text-mask-film: the page draws one tile of the fabric (unlabeled dots and links, deck greys on ink) to a canvas; it
   becomes the headline's fill and pans through the letters once (about 2.6s), then the letters settle to solid ink. */
function fabricTile() {
  const c = document.createElement('canvas');
  const S = 320;
  c.width = S; c.height = S;
  const g = c.getContext('2d');
  if (!g) return '';
  g.fillStyle = '#0a0a0a'; g.fillRect(0, 0, S, S);
  let s = 7;
  const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  const pts = Array.from({ length: 26 }, () => [r() * S, r() * S]);
  g.lineWidth = 1.5;
  g.strokeStyle = '#525252';
  pts.forEach(([x, y], i) => {
    const near = pts.map((p, j) => [j, (p[0] - x) ** 2 + (p[1] - y) ** 2]).sort((a, b) => a[1] - b[1]).slice(1, 3);
    near.forEach(([j]) => { g.beginPath(); g.moveTo(x, y); g.lineTo(pts[j][0], pts[j][1]); g.stroke(); });
    g.fillStyle = i % 5 === 0 ? '#fafafa' : '#a3a3a3';
    g.beginPath(); g.arc(x, y, i % 5 === 0 ? 6 : 4, 0, Math.PI * 2); g.fill();
  });
  return c.toDataURL('image/png');
}
export function FilmHead({ as: T = 'h2', className = '', children }) {
  const [ref, inn] = useArrive(0.8);
  const [st, setSt] = useState('');
  useEffect(() => {
    if (!inn || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const url = fabricTile();
    if (!url || !ref.current) return;
    ref.current.style.setProperty('--film', `url(${url})`);
    setSt('play');
    const t = setTimeout(() => setSt('done'), 2600);
    return () => clearTimeout(t);
  }, [inn]);
  return <T ref={ref} className={'nd-film ' + className} data-ent="film" data-st={st || undefined}>{children}</T>;
}

/* side-carousel: a horizontal snapping track (proximity snap, a peek of the next card). It slides in a card's width
   from the right and settles as it arrives; Previous and Next step it a card at a time (keyboard and pointer). */
export function Carousel({ children, label, prev = 'Previous', next = 'Next' }) {
  const [ref, inn] = useArrive(0.3);
  const track = useRef(null);
  const step = (d) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector('li');
    const w = card ? card.getBoundingClientRect().width + 12 : el.clientWidth * 0.8;
    const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollBy({ left: d * w, behavior: calm ? 'auto' : 'smooth' });
  };
  return (
    <div ref={ref} className="nd-car" data-ent="carousel" data-in={inn || undefined}>
      <div className="nd-car-nav">
        <button type="button" aria-label={prev} onClick={() => step(-1)}><span aria-hidden="true">←</span></button>
        <button type="button" aria-label={next} onClick={() => step(1)}><span aria-hidden="true">→</span></button>
      </div>
      <ol ref={track} className="nd-car-t" aria-label={label} tabIndex={0}>{children}</ol>
    </div>
  );
}
