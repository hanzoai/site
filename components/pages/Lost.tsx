'use client';
/* 404. Matches the homepage's 3D topological halftone dot wave field (Dots), centered and calm, with zero blinking
   map pin. Reads the address you tried, suggests the pages you most likely meant, and searches every page as you type
   (lib/search.json: all of content/pages.json). Words are Hanzo's own. app/not-found.tsx renders it for every unknown
   address; pages need nothing. */
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, type MotionProps } from 'motion/react';
import Dots from '../Dots';
import { A } from '../kit';
import { EASE } from '../ui';
import './Lost.css';

// a page of the site: its path, title and description
type Entry = string[];

const words = (s: string) => s.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length > 1);
function rank(SEARCH: Entry[] | null, q: string, path: string, typed: boolean) {
  const ws = words(q);
  if (!SEARCH || !ws.length) return [];
  const minScore = typed ? 0.5 : 2.5;
  const limit = typed ? 5 : 3;
  return SEARCH.map(([p, t, d]): [number, string, string, string] => {
    const hay = (p + ' ' + t).toLowerCase(), desc = (d || '').toLowerCase();
    let s = 0;
    for (const w of ws) s += (p.toLowerCase().includes(w) ? 3 : 0) + (t.toLowerCase().includes(w) ? 2 : 0) + (desc.includes(w) ? 0.5 : 0) + (hay.split(/[^a-z0-9]+/).some((x) => x.startsWith(w.slice(0, 4))) ? 0.5 : 0);
    return [s - p.length / 400, p, t, d];
  }).filter((r) => r[0] > minScore && r[1] !== path).sort((a, b) => b[0] - a[0]).slice(0, limit);
}

export default function Lost() {
  const host = useRef<HTMLElement>(null);
  const [path, setPath] = useState('');
  const [q, setQ] = useState('');
  const [back, setBack] = useState(false);
  // the page index (lib/search.json, 150 KB) loads when this page is drawn: the root's not-found boundary rides on every
  // page, so a static import would put the index into every page's script
  const [index, setIndex] = useState<Entry[] | null>(null);
  useEffect(() => { import('../../lib/search.json').then((m) => setIndex(m.default)); }, []);
  useEffect(() => {
    let p = location.pathname;
    try { p = decodeURIComponent(p); } catch { /* a malformed address (/%E0%A4%A) stays as typed */ }
    setPath(p);
    setBack(history.length > 1 && !!document.referrer && new URL(document.referrer).origin === location.origin);
  }, []);
  const typed = q.trim().length > 0;
  const hits = useMemo(() => rank(index, typed ? q : path.replace(/[/-]+/g, ' '), path, typed), [index, q, path, typed]);
  const rise = (d: number): MotionProps => ({ initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.75, ease: EASE, delay: d } });
  return (
    <main ref={host} className="xlo" data-ask="off">
      <Dots host={host} drift />
      <section className="xlo-in x-wrap">
        <motion.div className="xlo-pill" {...rise(0.04)}>
          <span className="xlo-code x-mono">404</span>
          {path && (
            <>
              <span className="xlo-sep" aria-hidden="true" />
              <span className="xlo-path x-mono">{path}</span>
            </>
          )}
        </motion.div>
        <h1 className="xlo-h1">
          <span className="x-line">
            <motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 0.95, ease: EASE, delay: 0.08 }}>
              Page not found.
            </motion.span>
          </span>
        </h1>
        <motion.p className="xlo-lede" {...rise(0.18)}>This page doesn&apos;t exist, or it has moved.</motion.p>
        <motion.div className="xlo-acts" {...rise(0.25)}>
          <A to="/" className="x-btn solid">Go home</A>
          {back && <button type="button" className="x-btn" onClick={() => history.back()}>Go back</button>}
        </motion.div>
        <motion.div className="xlo-find" {...rise(0.32)}>
          <div className="xlo-field">
            <svg className="xlo-mag" viewBox="0 0 16 16" width="15" height="15" aria-hidden="true">
              <circle cx="7" cy="7" r="4.8" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <path d="M10.6 10.6 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <label htmlFor="xlo-q" className="x-vh">Search every page</label>
            <input id="xlo-q" type="search" placeholder="Search every page" value={q} onChange={(e) => setQ(e.target.value)} autoComplete="off" />
          </div>
          <ul className="xlo-hits" aria-live="polite">
            {hits.map(([, p, t, d], i) => (
              <motion.li key={p} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.32, ease: EASE, delay: i * 0.03 }}>
                <A to={p} className="xlo-hit"><b>{t}</b><span>{d}</span><i className="x-mono">{p}</i></A>
              </motion.li>
            ))}
          </ul>
        </motion.div>
        <motion.nav className="xlo-more" aria-label="Elsewhere" {...rise(0.4)}>
          <A to="/products">Products</A><A to="https://docs.hanzo.ai">Documentation</A><A to="/contact">Contact</A><A to="https://status.hanzo.ai">Status</A>
        </motion.nav>
      </section>
    </main>
  );
}
