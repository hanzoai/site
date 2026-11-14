'use client';
/* RelatedCards: "Related capabilities" as cards that open into their page (synchronized.studio, NEXT-LEVEL Morph). Each
   card's picture is the destination's own Sigil (drawn still, from its slug), its title is the morph source, and the
   whole card is one link: one tab stop, real <a href>. Hover deepens the fill and drifts the art (no lift, no cursor label); press is .97.
   Usage: <RelatedCards items={[['Logs', '/cloud/logs', 'Search every line']]} title="Related capabilities" />
   items: Hanzo's own [label, href, line]. Owned by Cloud 3. */
import type { ReactNode } from 'react';
import Sigil from '../Sigil';
import { A } from '../kit';
import './LaunchType.css';
import './RelatedCards.css';

const Arr = () => <svg viewBox="0 0 16 16" width="20" height="20" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const slug = (to: string) => to.replace(/^\/+|\/+$/g, '').split('/').pop() || 'hanzo';

interface RelatedCardsProps {
  items: string[][]; // [label, href, line?]
  title?: string;
  className?: string;
  children?: ReactNode;
}

export default function RelatedCards({ items, title = 'Related capabilities', className = '', children }: RelatedCardsProps) {
  return (
    <section className={'lx-rel ' + className}>
      <div className="lx-wrap">
        {children}
        <h2 className="lx-rel-h">{title}</h2>
        <ul className="lx-rel-grid" data-n={items.length}>
          {items.map(([t, to, d]) => (
            <li key={t}>
              <A to={to} className="lx-rel-card" data-cursor="">
                <span className="lx-rel-art" aria-hidden="true"><Sigil seed={slug(to)} still className="lx-rel-sigil" /></span>
                <span className="lx-rel-t" data-morph>{t}</span>
                {d && <span className="lx-rel-d">{d}</span>}
                <Arr />
              </A>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
