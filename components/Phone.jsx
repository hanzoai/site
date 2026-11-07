'use client';
/* The phone layer (mounted once in app/layout.jsx; phones and tablets ≤ 900 px only).
   (1) Thumb bar: once the hero has gone by, search and the page's main action sit under the thumb (52 px targets).
   (2) Sibling swipe: a sideways swipe on a family page (a model, a role, a legal document, a repo) turns to the next or
       previous one, with a hint that says where you are going; the page turns with a ~550 ms slide.
   (3) Sheets: search and the header menus rise from the bottom (components/HeaderTools.jsx).
   How to use it on a page:
   - data-thumb on your main button or link (<Go to="/contact-sales" data-thumb="Talk to sales">…); its label and href
     are read from it. Without one the bar offers Hanzo's own "Try Hanzo";
   - data-dock on your own fixed bottom bar, and the thumb bar steps aside while it is there (it also yields to the
     footer, the keyboard, the cookie note, search and menus);
   - data-swipe-own on anything that handles its own sideways swipe (rails, tables and carousels that scroll natively
     are already left alone). */
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { MODELS } from '../lib/models';
import './Layer.css';

const EASE = [0.16, 1, 0.3, 1];
const FLAG = MODELS.map((m) => '/' + m.slug);
const norm = (p) => '/' + p.split('/').filter(Boolean).join('/');
const wants = (p) => { const s = norm(p).split('/').filter(Boolean); return s.length === 2 || (s.length === 1 && FLAG.includes(norm(p))); };
// the page index is 150 KB, so it loads only on a phone, on a page that has siblings
export function siblings(path, SEARCH) {
  const p = norm(path), s = p.split('/').filter(Boolean);
  const TITLE = Object.fromEntries(SEARCH.map(([q, t]) => [q, t]));
  const list = s.length === 1 && FLAG.includes(p) ? FLAG : s.length === 2 ? SEARCH.map(([q]) => q).filter((q) => q.split('/').filter(Boolean).length === 2 && q.startsWith('/' + s[0] + '/')) : null;
  if (!list || list.length < 2) return null;
  const i = list.indexOf(p);
  if (i < 0) return null;
  const at = (k) => list[(k + list.length) % list.length];
  const name = (q) => TITLE[q] || q.split('/').pop().replace(/-/g, ' ');
  return { prev: at(i - 1), next: at(i + 1), prevName: name(at(i - 1)), nextName: name(at(i + 1)) };
}

function go(href, dir) {
  document.documentElement.dataset.dir = dir;
  const a = document.createElement('a');
  a.href = href; a.style.position = 'fixed'; a.style.width = a.style.height = '0';
  document.body.appendChild(a); a.click(); a.remove(); // the morph layer turns the page
  setTimeout(() => { delete document.documentElement.dataset.dir; }, 1200);
}

function ThumbBar({ path }) {
  const [on, setOn] = useState(false);
  const [act, setAct] = useState({ label: 'Try Hanzo', href: 'https://hanzo.ai/signup' });
  useEffect(() => {
    const mq = matchMedia('(max-width: 900px)');
    if (!mq.matches) { setOn(false); return; }
    const main = document.querySelector('main');
    const own = main?.querySelector('[data-thumb]');
    setAct(own ? { label: own.getAttribute('data-thumb') || own.textContent.trim(), href: own.getAttribute('href') || own.dataset.href } : { label: 'Try Hanzo', href: 'https://hanzo.ai/signup' });
    const hero = main?.firstElementChild, foot = document.querySelector('footer');
    let past = false, footIn = false, typing = false;
    const update = () => setOn(past && !footIn && !typing && !document.querySelector('.x-cookie, .xcr-dock, [data-dock], .x-sheet, .x-pal, .x-pop'));
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.target === hero) past = !e.isIntersecting && e.boundingClientRect.top < 0;
      else footIn = e.isIntersecting;
      update();
    }));
    hero && io.observe(hero); foot && io.observe(foot);
    const fin = (e) => { typing = /INPUT|TEXTAREA|SELECT/.test(e.target.tagName); update(); };
    const fout = () => { typing = false; setTimeout(update, 50); };
    addEventListener('focusin', fin); addEventListener('focusout', fout);
    const t = setInterval(update, 1200); // docks and the cookie note come and go
    return () => { io.disconnect(); removeEventListener('focusin', fin); removeEventListener('focusout', fout); clearInterval(t); };
  }, [path]);
  const ext = /^https?:/.test(act.href || '') && !(act.href || '').startsWith(typeof location !== 'undefined' ? location.origin : '~');
  return (
    <AnimatePresence>
      {on && (
        <motion.div className="x-thumb" initial={{ y: 90, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 90, opacity: 0 }} transition={{ type: 'spring', stiffness: 380, damping: 34 }}>
          <button type="button" className="x-thumb-s" aria-label="Search Hanzo" onClick={() => dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true, ctrlKey: true }))}>
            <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><circle cx="9" cy="9" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.7" /><path d="m13.2 13.2 3.6 3.6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>
          </button>
          <motion.a href={act.href} className="x-thumb-a" whileTap={{ scale: 0.97 }} {...(ext ? { rel: 'noopener' } : {})}>
            <span>{act.label}</span><i aria-hidden="true">→</i>
          </motion.a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Swipe({ path }) {
  const [sib, setSib] = useState(null);
  const [hint, setHint] = useState(null); // { dir, p }
  const g = useRef(null);
  useEffect(() => {
    setSib(null);
    if (!wants(path) || !matchMedia('(pointer: coarse)').matches) return;
    let live = true;
    import('../lib/search.json').then((m) => { if (live) setSib(siblings(path, m.default)); });
    return () => { live = false; };
  }, [path]);
  useEffect(() => {
    if (!sib) return;
    const scroller = (el) => { for (let e = el; e && e !== document.body; e = e.parentElement) { if (e.matches?.('[data-swipe-own], input, textarea, select, .x-sheet, header')) return true; const s = getComputedStyle(e); if (/(auto|scroll)/.test(s.overflowX) && e.scrollWidth > e.clientWidth + 4) return true; } return false; };
    const start = (e) => { const t = e.touches[0]; g.current = t.clientX < 28 || t.clientX > innerWidth - 28 || e.touches.length > 1 || scroller(e.target) ? null : { x: t.clientX, y: t.clientY, on: false }; };
    const move = (e) => {
      const s = g.current; if (!s) return;
      const t = e.touches[0], dx = t.clientX - s.x, dy = t.clientY - s.y;
      if (!s.on && Math.abs(dy) > 24) { g.current = null; setHint(null); return; }
      if (Math.abs(dx) > 14 && Math.abs(dx) > Math.abs(dy) * 1.6) s.on = true;
      if (s.on) setHint({ dir: dx < 0 ? 'next' : 'prev', p: Math.min(1, Math.abs(dx) / 110) });
      s.dx = dx; s.dy = dy;
    };
    const end = () => {
      const s = g.current; g.current = null;
      if (s?.on && Math.abs(s.dx) > 110 && Math.abs(s.dy) < 70) go(s.dx < 0 ? sib.next : sib.prev, s.dx < 0 ? 'next' : 'prev');
      setHint(null);
    };
    addEventListener('touchstart', start, { passive: true });
    addEventListener('touchmove', move, { passive: true });
    addEventListener('touchend', end); addEventListener('touchcancel', end);
    return () => { removeEventListener('touchstart', start); removeEventListener('touchmove', move); removeEventListener('touchend', end); removeEventListener('touchcancel', end); };
  }, [sib]);
  if (!sib || !hint) return null;
  const name = hint.dir === 'next' ? sib.nextName : sib.prevName;
  return (
    <div className={'x-swipe ' + hint.dir} style={{ opacity: 0.25 + hint.p * 0.75, transform: `translate(-50%, 0) scale(${0.92 + hint.p * 0.08})` }} aria-hidden="true">
      {hint.dir === 'prev' && <i>←</i>}<span>{hint.p >= 1 ? 'Release for ' : ''}{name}</span>{hint.dir === 'next' && <i>→</i>}
    </div>
  );
}

export default function Phone() {
  const path = usePathname();
  return <><ThumbBar path={path} /><Swipe path={path} /></>;
}
