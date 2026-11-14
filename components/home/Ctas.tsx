'use client';
/* Every link followed on the landing is one funnel event: cta_clicked { page, section, cta, target }. The section is
   the band the link stands in (its data-hz-view, else its data-slot); the cta is the link's data-cta or its words.
   A link marked data-ga sends its own moment (a plan card's plan_clicked). Draws nothing. */
import { useEffect } from 'react';
import { track } from '../../lib/track';

/* Where a link goes, as the funnel names it: a path on this site, origin and path elsewhere, with its own query kept and
   the visitor ids another Hanzo host is handed (hz_aid, hz_sid, hz_ft) taken off, so a target is one value however many
   people press it (app components/home/Home.tsx). */
function target(a: HTMLAnchorElement) {
  const u = new URL(a.href);
  for (const k of ['hz_aid', 'hz_sid', 'hz_ft']) u.searchParams.delete(k);
  const q = u.searchParams.toString();
  return `${u.origin === location.origin ? '' : u.origin}${u.pathname}${q ? `?${q}` : ''}${u.hash}`;
}

export default function Ctas() {
  useEffect(() => {
    const click = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.<HTMLAnchorElement>('main a[href]');
      if (!a || a.hasAttribute('data-ga')) return;
      const section = a.closest('[data-hz-view]')?.getAttribute('data-hz-view') ?? a.closest('[data-slot]')?.getAttribute('data-slot') ?? 'page';
      const cta = a.getAttribute('data-cta') ?? (a.getAttribute('aria-label') || a.textContent || '').trim().slice(0, 80);
      track('cta_clicked', { page: '/', section, cta, target: target(a) });
    };
    document.addEventListener('click', click, { capture: true });
    return () => document.removeEventListener('click', click, { capture: true });
  }, []);
  return null;
}
