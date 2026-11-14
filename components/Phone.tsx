'use client';
/* The phone layer (mounted once in app/layout.jsx; phones and tablets ≤ 900 px only).
   (1) The thumb bar now lives in components/Ask.jsx (one ask bar for every width); it still reads data-thumb and
       data-dock exactly as before, so nothing on a page changes.
   (2) Sibling swipe: a sideways swipe on a family page (a model, a role, a legal document, a repo) turns to the next or
       previous one, with a hint that says where you are going; the page turns with a ~550 ms slide.
   (3) Sheets: search and the header menus rise from the bottom (components/HeaderTools.jsx).
   How to use it on a page:
   - data-thumb on your main button or link (<Go to="/contact-sales" data-thumb="Talk to sales">…); see Ask.jsx;
   - data-dock on your own fixed bottom bar, and the ask bar steps aside while it is there;
   - data-swipe-own on anything that handles its own sideways swipe (rails, tables and carousels that scroll natively
     are already left alone). */
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { MODELS } from '../lib/models';
import './Layer.css';

const FLAG = MODELS.map((m) => '/' + m.slug);
const norm = (p: string) => '/' + p.split('/').filter(Boolean).join('/');
const wants = (p: string) => { const s = norm(p).split('/').filter(Boolean); return s.length === 2 || (s.length === 1 && FLAG.includes(norm(p))); };
// the page index is 150 KB, so it loads only on a phone, on a page that has siblings
export function siblings(path: string, SEARCH: readonly (readonly string[])[]) {
  const p = norm(path), s = p.split('/').filter(Boolean);
  const TITLE: Record<string, string> = Object.fromEntries(SEARCH.map(([q, t]): [string, string] => [q, t]));
  const list = s.length === 1 && FLAG.includes(p) ? FLAG : s.length === 2 ? SEARCH.map(([q]) => q).filter((q) => q.split('/').filter(Boolean).length === 2 && q.startsWith('/' + s[0] + '/')) : null;
  if (!list || list.length < 2) return null;
  const i = list.indexOf(p);
  if (i < 0) return null;
  const at = (k: number) => list[(k + list.length) % list.length];
  const name = (q: string) => TITLE[q] || q.split('/').pop()!.replace(/-/g, ' ');
  return { prev: at(i - 1), next: at(i + 1), prevName: name(at(i - 1)), nextName: name(at(i + 1)) };
}

function go(href: string, dir: string) {
  document.documentElement.dataset.dir = dir;
  const a = document.createElement('a');
  a.href = href; a.style.position = 'fixed'; a.style.width = a.style.height = '0';
  document.body.appendChild(a); a.click(); a.remove(); // the morph layer turns the page
  setTimeout(() => { delete document.documentElement.dataset.dir; }, 1200);
}

// a sideways drag in progress: where it began, whether it has become a swipe, and how far it has gone
interface Drag { x: number; y: number; on: boolean; dx: number; dy: number }

function Swipe({ path }: { path: string }) {
  const [sib, setSib] = useState<ReturnType<typeof siblings>>(null);
  const [hint, setHint] = useState<{ dir: 'next' | 'prev'; p: number } | null>(null);
  const g = useRef<Drag | null>(null);
  useEffect(() => {
    setSib(null);
    if (!wants(path) || !matchMedia('(pointer: coarse)').matches) return;
    let live = true;
    import('../lib/search.json').then((m) => { if (live) setSib(siblings(path, m.default)); });
    return () => { live = false; };
  }, [path]);
  useEffect(() => {
    if (!sib) return;
    const scroller = (el: Element | null) => { for (let e: Element | null = el; e && e !== document.body; e = e.parentElement) { if (e.matches?.('[data-swipe-own], input, textarea, select, .x-sheet, header')) return true; const s = getComputedStyle(e); if (/(auto|scroll)/.test(s.overflowX) && e.scrollWidth > e.clientWidth + 4) return true; } return false; };
    const start = (e: TouchEvent) => { const t = e.touches[0]; g.current = t.clientX < 28 || t.clientX > innerWidth - 28 || e.touches.length > 1 || scroller(e.target as Element) ? null : { x: t.clientX, y: t.clientY, on: false, dx: 0, dy: 0 }; };
    const move = (e: TouchEvent) => {
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
  return <Swipe path={path} />;
}
