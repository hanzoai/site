'use client';
/* FamNext (Families A kit): the siblings, as cards that open into their page (synchronized.studio). Each card is a big
   in-site link whose title carries data-morph, so the Morph layer flies it into the next page's hero
   (data-morph-target there). Each card wears its sibling's own still contour (Sigil seeded with its name) in its own
   accent. A native swipe rail on phones; the contextual cursor says Open.
   How to use it:
   - <FamNext items={[{ href, kicker, title, meta, seed, acc }]} label="Other benchmarks" />. */
import { A } from '../kit';
import Sigil from '../Sigil';

export default function FamNext({ items, label, className = '' }) {
  if (!items || !items.length) return null;
  return (
    <nav className={'v2f-next ' + className} aria-label={label} data-swipe-own>
      {items.map((it) => (
        <A key={it.href} to={it.href} className="v2f-next-c" style={it.acc ? { '--c': it.acc } : undefined}>
          {it.seed && <span className="v2f-next-s" aria-hidden="true"><Sigil seed={it.seed} data={it.data || []} still /></span>}
          <span>
            {it.kicker && <span className="v2f-kick" style={{ display: 'block', marginBottom: 16 }}>{it.kicker}</span>}
            <span className="v2f-next-t" data-morph style={{ display: 'block' }}>{it.title}</span>
          </span>
          <span className="v2f-next-m">
            <span>{it.meta}</span>
            <span className="v2f-next-go" aria-hidden="true">
              <svg viewBox="0 0 16 16" width="16" height="16"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </span>
          </span>
        </A>
      ))}
    </nav>
  );
}
