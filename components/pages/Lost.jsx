'use client';
/* 404. Signature: every wrong address draws its own living contour map (the Sigil seeded by the missing path), with a
   pin where you are. Beyond: hanzo.ai's 404 offers four links; this one reads the address you tried, suggests the pages
   you most likely meant, and searches every page as you type (lib/search.json: all of content/pages.json). Words are
   Hanzo's own. app/not-found.jsx renders it for every unknown address; pages need nothing. */
import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import Sigil from '../Sigil';
import { A } from '../kit';
import { EASE } from '../ui';
import SEARCH from '../../lib/search.json';
import './Lost.css';

const words = (s) => s.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length > 1);
function rank(q, path) {
  const ws = words(q);
  if (!ws.length) return [];
  return SEARCH.map(([p, t, d]) => {
    const hay = (p + ' ' + t).toLowerCase(), desc = (d || '').toLowerCase();
    let s = 0;
    for (const w of ws) s += (p.toLowerCase().includes(w) ? 3 : 0) + (t.toLowerCase().includes(w) ? 2 : 0) + (desc.includes(w) ? 0.5 : 0) + (hay.split(/[^a-z0-9]+/).some((x) => x.startsWith(w.slice(0, 4))) ? 0.5 : 0);
    return [s - p.length / 400, p, t, d];
  }).filter((r) => r[0] > 0.5 && r[1] !== path).sort((a, b) => b[0] - a[0]).slice(0, 6);
}

export default function Lost() {
  const [path, setPath] = useState('');
  const [q, setQ] = useState('');
  useEffect(() => { setPath(decodeURIComponent(location.pathname)); }, []);
  const hits = useMemo(() => rank(q || path.replace(/[/-]+/g, ' '), path), [q, path]);
  const rise = (d) => ({ initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, ease: EASE, delay: d } });
  return (
    <main className="xlo" data-room="dark">
      <div className="xlo-map" aria-hidden="true">
        {path && <Sigil seed={path} data={[path.length, words(path).length]} className="xlo-sigil" />}
        <motion.span className="xlo-pin" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.5 }}><i /></motion.span>
      </div>
      <section className="xlo-in x-wrap">
        <motion.p className="xlo-code x-mono" {...rise(0.05)}>404</motion.p>
        <h1 className="xlo-h1"><span className="x-line"><motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.1 }}>Page not found.</motion.span></span></h1>
        <motion.p className="xlo-lede" {...rise(0.25)}>This page doesn&apos;t exist, or it has moved.</motion.p>
        {path && <motion.p className="xlo-path x-mono" {...rise(0.3)}>{path}</motion.p>}
        <motion.div className="xlo-acts" {...rise(0.35)}>
          <A to="/" className="x-btn solid">Go home</A>
          <button type="button" className="x-btn" onClick={() => history.back()}>Go back</button>
        </motion.div>
        <motion.div className="xlo-find" {...rise(0.45)}>
          <label htmlFor="xlo-q" className="x-vh">Search every page</label>
          <input id="xlo-q" type="search" placeholder="Search every page" value={q} onChange={(e) => setQ(e.target.value)} autoComplete="off" />
          <ul className="xlo-hits" aria-live="polite">
            {hits.map(([, p, t, d], i) => (
              <motion.li key={p} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, ease: EASE, delay: i * 0.04 }}>
                <A to={p} className="xlo-hit"><b>{t}</b><span>{d}</span><i className="x-mono">{p}</i></A>
              </motion.li>
            ))}
          </ul>
        </motion.div>
        <motion.nav className="xlo-more" aria-label="Elsewhere" {...rise(0.55)}>
          <A to="/products">Products</A><A to="https://docs.hanzo.ai">Documentation</A><A to="/contact">Contact</A><A to="https://status.hanzo.ai">Status</A>
        </motion.nav>
      </section>
    </main>
  );
}
