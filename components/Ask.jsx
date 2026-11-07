'use client';
/* The ask bar (mounted once in app/layout.jsx): one solid ask, in Hanzo's words, that arrives once the hero has gone by,
   on every page and at every width. Desktop: a small bar at the bottom centre (Hanzo mark, page name, search, the ask).
   Phones and tablets (≤ 900 px): a full-width bar under the thumb. While it is on, the header's own "Try Hanzo" turns
   from solid to outline, so exactly one solid button is ever on screen; it is also an outline while the page's own
   hero ask ([data-thumb]) or closing band is in view, and solid otherwise.
   HOW TO USE on a page (all optional):
   - data-thumb on your hero's main button or link: the bar carries the same words and href
     (<Go to="/contact-sales" solid data-thumb="Talk to sales">Talk to sales</Go>). Without one it carries the header's
     "Try Hanzo". The bar also steps aside whenever any [data-thumb] button is itself on screen.
   - data-ask-name="Hanzo Dev" anywhere in <main> to name the page in the bar (default: the first part of its <title>);
     data-ask-note="No card needed" for the 12 px risk line beside the button (desktop), only with Hanzo's own words.
   - data-ask-hide on a section whose bottom edge holds something the bar must not cover (a caption, a dock).
   - data-ask="off" on <main> for a page with no ask at all (use sparingly). data-dock on your own fixed bottom bar.
   It also yields to the footer, the closing band (.x-band), open menus, search, sheets, the cookie note and the
   phone keyboard. Arrival: opacity, scale .96 → 1 and y 12 → 0 in 250 ms (BRIEF-v3 §3.3 rule 3). */
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { EASE_CALM } from '../lib/motion';
import { onDomChange } from '../lib/domwatch';

const HEADER_ASK = { label: 'Try Hanzo', href: 'https://hanzo.ai/signup' }; // Hanzo's own header words
const OVERLAY = '.x-cookie:not([hidden]), .x-sheet, .x-pal, .x-pop, .x-nav-panel, .x-sheet2-wrap, [aria-modal="true"], [data-dock], .xcr-dock';
const nameOf = (t) => (t || '').split(/\s+[—|–-]\s+/)[0].trim();
// a wrapper with display: contents has no box for IntersectionObserver; watch the link or button inside it instead
const boxOf = (el) => (el.getClientRects().length ? el : el.querySelector('a, button') || el.firstElementChild || el);
const SOLID = 'main .x-btn.solid, main [data-thumb], .x-band';

export default function Ask() {
  const path = usePathname();
  const [ask, setAsk] = useState(null); // { label, href, name, note }
  const [on, setOn] = useState(false);
  const [quiet, setQuiet] = useState(false); // another solid ask (hero data-thumb, closing band) is on screen
  const [dark, setDark] = useState(false);
  const bar = useRef(null);

  useEffect(() => {
    setOn(false); setQuiet(false);
    let off = false;
    const cleanups = [];
    // pages render after the route change; read them once they are in the DOM
    const start = () => {
      if (off) return;
      const main = document.querySelector('main');
      if (!main || main.closest('[data-ask="off"]') || main.matches('[data-ask="off"]') || main.querySelector('[data-ask="off"]')) { setAsk(null); return; }
      const own = main.querySelector('[data-thumb]');
      const label = own ? (own.getAttribute('data-thumb') || own.textContent.trim()) : HEADER_ASK.label;
      const href = own ? (own.getAttribute('href') || own.querySelector('a')?.getAttribute('href') || own.dataset.href || HEADER_ASK.href) : HEADER_ASK.href;
      const name = main.querySelector('[data-ask-name]')?.getAttribute('data-ask-name') || nameOf(document.title) || 'Hanzo AI';
      const note = main.querySelector('[data-ask-note]')?.getAttribute('data-ask-note') || '';
      setAsk({ label, href, name, note });

      // the hero: the first block of the page that is more than a strip
      const hero = [...main.children].find((c) => c.getBoundingClientRect().height > 200) || main;
      const phone = matchMedia('(max-width: 900px)');
      let past = false, typing = false;
      const blocking = new Set();
      let solids = new Set();
      const update = () => {
        if (off) return;
        const show = past && !blocking.size && !solids.size && !typing && !document.querySelector(OVERLAY);
        setOn(show);
        setQuiet(solids.size > 0);
      };
      const io = new IntersectionObserver((es) => {
        es.forEach((e) => {
          if (e.target === hero) past = !e.isIntersecting && e.boundingClientRect.top < 0;
          else if (e.isIntersecting) blocking.add(e.target); else blocking.delete(e.target);
        });
        update();
      }, { rootMargin: '-64px 0px 0px 0px' });
      io.observe(hero);
      document.querySelectorAll('footer, .x-band, [data-ask-hide], main [data-thumb]').forEach((el) => io.observe(boxOf(el)));
      // every solid button in the page: while one is on screen, the header's ask is an outline (one solid at a time)
      solids = new Set();
      const sio = new IntersectionObserver((es) => { es.forEach((e) => (e.isIntersecting ? solids.add(e.target) : solids.delete(e.target))); update(); }, { rootMargin: '-60px 0px 0px 0px' });
      const watchSolids = () => document.querySelectorAll(SOLID).forEach((el) => sio.observe(boxOf(el)));
      watchSolids();

      // the room under the bar: a dark one turns the bar dark
      const rooms = new Set();
      let roomIo = null;
      const watchRooms = () => {
        roomIo?.disconnect(); rooms.clear();
        roomIo = new IntersectionObserver((es) => {
          es.forEach((e) => (e.isIntersecting ? rooms.add(e.target) : rooms.delete(e.target)));
          setDark(rooms.size > 0);
        }, { rootMargin: `-${Math.max(0, innerHeight - 56)}px 0px -24px 0px` });
        document.querySelectorAll('[data-room=dark]').forEach((r) => roomIo.observe(r));
      };
      watchRooms();
      addEventListener('resize', watchRooms);

      const fin = (e) => { typing = phone.matches && /INPUT|TEXTAREA|SELECT/.test(e.target.tagName); update(); };
      const fout = () => { typing = false; setTimeout(update, 60); };
      addEventListener('focusin', fin); addEventListener('focusout', fout);
      // menus, sheets, search and the cookie note come and go without telling anyone; late sections bring new asks
      const watchMore = () => { document.querySelectorAll('.x-band, [data-ask-hide], main [data-thumb]').forEach((el) => io.observe(boxOf(el))); watchSolids(); update(); };
      const offDom = onDomChange(watchMore);
      cleanups.push(() => { io.disconnect(); sio.disconnect(); roomIo?.disconnect(); offDom(); removeEventListener('resize', watchRooms); removeEventListener('focusin', fin); removeEventListener('focusout', fout); });
    };
    const r = requestAnimationFrame(() => setTimeout(start, 120));
    return () => { off = true; cancelAnimationFrame(r); cleanups.forEach((f) => f()); };
  }, [path]);

  // one solid ask on screen: the header's own ask steps back to an outline while the bar carries the ask, and while
  // the page's own hero ask or closing band is in view (PLAN 0.9: outlined while the hero CTA is in view)
  useEffect(() => {
    const h = document.documentElement;
    if (ask && (on || quiet)) h.dataset.ask = 'on'; else delete h.dataset.ask;
    return () => { delete h.dataset.ask; };
  }, [on, quiet, ask]);

  if (!ask) return null;
  const ext = /^https?:/.test(ask.href);
  const search = () => dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true, ctrlKey: true }));
  const top = () => { window.__lenis ? window.__lenis.scrollTo(0) : scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); };
  const track = () => dispatchEvent(new CustomEvent('hz-event', { detail: { name: 'cta_click', where: 'ask-bar', label: ask.label, path } }));
  return (
    <AnimatePresence>
      {on && (
        <motion.div
          ref={bar}
          key="ask"
          className="x-ask"
          data-tone={dark ? 'dark' : 'light'}
          role="region"
          aria-label="Get started"
          initial={{ opacity: 0, y: 12, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.97, transition: { duration: 0.2, ease: [0.7, 0, 0.84, 0] } }}
          transition={{ duration: 0.25, ease: EASE_CALM }}
        >
          <button type="button" className="x-ask-name" onClick={top} aria-label={`${ask.name}: back to top`}>
            <svg viewBox="0 0 67 67" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M22.21 67V44.6369H0V67H22.21Z" /><path d="M66.7038 22.3184H22.2534L0.0878906 44.6367H44.4634L66.7038 22.3184Z" /><path d="M22.21 0H0V22.3184H22.21V0Z" /><path d="M66.7198 0H44.5098V22.3184H66.7198V0Z" /><path d="M66.7198 44.6369H44.5098V67H66.7198V44.6369Z" /></svg>
            <span>{ask.name}</span>
          </button>
          <button type="button" className="x-ask-s" aria-label="Search Hanzo" onClick={search}>
            <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><circle cx="9" cy="9" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.7" /><path d="m13.2 13.2 3.6 3.6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>
          </button>
          {ask.note && <span className="x-ask-note">{ask.note}</span>}
          <a href={ask.href} className="x-ask-a" onClick={track} {...(ext ? { rel: 'noopener' } : {})}>
            <span>{ask.label}</span><i aria-hidden="true">→</i>
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
