'use client';
/* The shared parts of the app and checkout pages (/pay, /pay/cart, /pay/confirm/card, /signup, /login, /auth/callback,
   /onboarding, /docs/quickstart, /docs/cli). One stage: a calm frame under a lit corner of Hanzo's halftone, sized so
   the page's one decision (plan, total, button) sits in a single screen at 1470 x 801. Colours are the site tokens
   (--ink, --soft, --card, --line, --bg, --x-raised), which point at @hanzo/design in dark. */
import { useEffect, useState } from 'react';
import { Mark } from '../../ui';
import './flow.css';

// the page's query, read once in the browser (a static page has no server to read it); null until read
export function useQuery() {
  const [q, setQ] = useState(null);
  useEffect(() => {
    const read = () => setQ(Object.fromEntries(new URLSearchParams(location.search)));
    read();
    addEventListener('popstate', read);
    return () => removeEventListener('popstate', read);
  }, []);
  return q;
}

// replace the query in place (a plan or seat change) without a reload
export function setQuery(q) {
  const s = new URLSearchParams(Object.entries(q).filter(([, v]) => v !== undefined && v !== null && v !== '')).toString();
  history.replaceState(null, '', location.pathname + (s ? '?' + s : ''));
  dispatchEvent(new PopStateEvent('popstate'));
}

export const money = (n) => '$' + Number(n).toLocaleString('en-US');

export function Stage({ children, className = '', lit = 'right', label }) {
  return (
    <main className={'fl ' + className} data-lit={lit} aria-label={label}>
      <div className="fl-halftone" aria-hidden="true" />
      <div className="fl-light" aria-hidden="true" />
      <div className="fl-wrap">{children}</div>
    </main>
  );
}

export const Brand = () => <span className="fl-brand" aria-hidden="true"><Mark size={22} /></span>;

export const Ck = () => <svg className="fl-ck" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>;
export const Lock = () => <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><rect x="3" y="7" width="10" height="7" rx="2" fill="none" stroke="currentColor" strokeWidth="1.4" /><path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" fill="none" stroke="currentColor" strokeWidth="1.4" /></svg>;
export const Card = () => <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><rect x="1.5" y="3.5" width="13" height="9" rx="2" fill="none" stroke="currentColor" strokeWidth="1.4" /><path d="M1.5 6.5h13" stroke="currentColor" strokeWidth="1.4" /></svg>;
// Google's G, drawn in one colour (the brand deck has no UI hues)
export const GoogleG = () => <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M21.6 12.23c0-.7-.06-1.37-.18-2.02H12v3.82h5.38a4.6 4.6 0 0 1-2 3.02v2.5h3.24c1.9-1.74 2.98-4.3 2.98-7.32zM12 22c2.7 0 4.96-.9 6.62-2.43l-3.24-2.5c-.9.6-2.04.96-3.38.96-2.6 0-4.8-1.76-5.59-4.12H3.07v2.58A10 10 0 0 0 12 22zM6.41 13.9a6 6 0 0 1 0-3.8V7.52H3.07a10 10 0 0 0 0 8.96l3.34-2.58zM12 5.98c1.47 0 2.79.5 3.83 1.5l2.87-2.87A9.6 9.6 0 0 0 12 2a10 10 0 0 0-8.93 5.52l3.34 2.58C7.2 7.74 9.4 5.98 12 5.98z" /></svg>;
export const Mail = () => <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="3" fill="none" stroke="currentColor" strokeWidth="1.6" /><path d="m4 7 8 6 8-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /></svg>;

export const Lines = ({ head, items }) => (
  <div className="fl-lines">
    {head && <p className="fl-lines-h">{head}</p>}
    <ul>{items.map((t) => <li key={t}><Ck />{t}</li>)}</ul>
  </div>
);

// the waiting state: Hanzo's halftone breathing in a ring (reduced motion: it holds still)
export function Waiting({ label }) {
  return (
    <div className="fl-wait" role="status" aria-live="polite">
      <span className="fl-wait-ring" aria-hidden="true"><span /><Mark size={26} /></span>
      <span className="fl-wait-l">{label}</span>
    </div>
  );
}
