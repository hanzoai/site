'use client';
/* The phone ask (mounted once in app/layout.jsx). MASTER 3.2 rule 6: the one solid ask lives in Hanzo's sticky header
   ("Try Hanzo") at every width; nothing floats over content on desktop. On phones (≤ 700 px) a slim, quiet bar carries
   the page's OWN ask once the hero's button has gone by, and only where it covers nothing:
   - only when the page marks its own ask with data-thumb and its words differ from the header's "Try Hanzo";
   - never while that ask, or any button with the same words, is on screen;
   - never while scrolling (it settles in at rest), and never where text, a picture or a control sits under it;
   - never over the footer, the closing band (.x-band), [data-ask-hide], menus, search, sheets, the cookie note or the
     keyboard.
   HOW TO USE on a page: data-thumb on your hero's main button (<Cta thumb> or data-thumb="Talk to sales"). That's all. */
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { onDomChange } from '../lib/domwatch';

const HEADER_ASK = 'Try Hanzo';
const PHONE = '(max-width: 700px)';
const OVERLAY = '.x-cookie, .x-sheet, .x-pal, .x-pop, .x-nav-panel, .x-sheet2-wrap, [aria-modal="true"], [data-dock], .xcr-dock';
const words = (t) => (t || '').replace(/[→↗\s]+/g, ' ').trim().toLowerCase();
const boxOf = (el) => (el.getClientRects().length ? el : el.querySelector('a, button') || el.firstElementChild || el);
const shown = (el) => el.isConnected && el.getClientRects().length > 0 && getComputedStyle(el).visibility !== 'hidden' && !el.closest('[hidden], [inert], [aria-hidden="true"]');
const visible = (el) => { if (!shown(el)) return false; for (let x = el; x && x !== document.body; x = x.parentElement) if (+getComputedStyle(x).opacity < 0.6) return false; const r = el.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight; };
const MEDIA = 'img, video, canvas, svg, picture, iframe, button, a, input, textarea, select, label';
// is anything readable, tappable or boxed (a card) in the band where the bar would sit? Full-width section
// backgrounds are only surfaces; a card's surface, text, pictures and controls are content.
const painted = (cs) => !/rgba\(0, 0, 0, 0\)|transparent/.test(cs.backgroundColor) || parseFloat(cs.borderTopWidth) > 0 || cs.boxShadow !== 'none';
function covered() {
  const base = innerHeight - 10; // the bar spans base-44 … base
  for (const y of [base - 2, base - 22, base - 42, base - 54]) for (let x = 14; x < innerWidth - 8; x += 22) {
    for (const el of document.elementsFromPoint(x, y)) {
      if (el.closest('.x-ask')) continue;
      if (el === document.documentElement || el === document.body || el.tagName === 'MAIN') break;
      if (el.matches(MEDIA) || el.closest('button, a')) return true;
      if ([...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) return true;
      if (el.getBoundingClientRect().width < innerWidth * 0.92 && painted(getComputedStyle(el))) return true; // a card
    }
  }
  return false;
}

export default function Ask() {
  const path = usePathname();
  const [ask, setAsk] = useState(null); // { label, href }
  const [on, setOn] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setOn(false); setAsk(null);
    const mq = matchMedia(PHONE);
    let stop = () => {};
    const start = () => {
      stop(); setOn(false);
      if (!mq.matches) { setAsk(null); return; }
      const main = document.querySelector('main');
      const own = main?.querySelector('[data-thumb]');
      if (!main || !own || main.closest('[data-ask="off"]') || main.matches('[data-ask="off"]')) { setAsk(null); return; }
      const label = own.getAttribute('data-thumb') || own.textContent.trim();
      if (!label || words(label) === words(HEADER_ASK)) { setAsk(null); return; } // the header already carries it
      const href = own.getAttribute('href') || own.querySelector('a')?.getAttribute('href') || own.dataset.href;
      if (!href) { setAsk(null); return; }
      setAsk({ label, href });

      const trigger = boxOf(own);
      let typing = false, scrolling = false, rest = 0, recheck = [0, 0];
      const twins = () => [...main.querySelectorAll('a, button, [data-thumb]')].filter((el) => el === own || words(el.getAttribute('data-thumb') || el.textContent) === words(label));
      const blockers = () => [...document.querySelectorAll('footer, .x-band, [data-ask-hide]')];
      const update = () => {
        const r = trigger.getBoundingClientRect();
        const past = r.bottom < 60 || (scrollY > innerHeight * 0.8 && !visible(trigger)); // gone by, or faded in a pinned hero
        const show = past && !scrolling && !typing
          && !twins().some((el) => visible(boxOf(el)))
          && !blockers().some(visible)
          && ![...document.querySelectorAll(OVERLAY)].some(shown)
          && !covered();
        setOn(show);
        // headlines and pictures can slide in under it a moment later: look again while it shows
        clearTimeout(recheck[0]); clearTimeout(recheck[1]);
        if (show) recheck = [setTimeout(update, 600), setTimeout(update, 1500)];
        const under = document.elementsFromPoint(innerWidth / 2, innerHeight - 30).find((el) => !el.closest('.x-ask'));
        setDark(!!under?.closest('[data-room=dark]'));
      };
      const onScroll = () => { scrolling = true; setOn(false); clearTimeout(rest); rest = setTimeout(() => { scrolling = false; update(); }, 260); };
      const fin = (e) => { typing = /INPUT|TEXTAREA|SELECT/.test(e.target.tagName); update(); };
      const fout = () => { typing = false; setTimeout(update, 60); };
      addEventListener('scroll', onScroll, { passive: true });
      addEventListener('focusin', fin); addEventListener('focusout', fout);
      const offDom = onDomChange(update);
      const first = setTimeout(update, 400);
      stop = () => { clearTimeout(rest); clearTimeout(first); recheck.forEach(clearTimeout); removeEventListener('scroll', onScroll); removeEventListener('focusin', fin); removeEventListener('focusout', fout); offDom(); };
    };
    const t = setTimeout(start, 150);
    mq.addEventListener('change', start);
    return () => { clearTimeout(t); stop(); mq.removeEventListener('change', start); };
  }, [path]);

  if (!ask) return null;
  const ext = /^https?:/.test(ask.href);
  return (
    <AnimatePresence>
      {on && (
        <motion.a
          key="ask"
          href={ask.href}
          className="x-ask"
          data-tone={dark ? 'dark' : 'light'}
          {...(ext ? { rel: 'noopener' } : {})}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8, transition: { duration: 0.15 } }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          onClick={() => dispatchEvent(new CustomEvent('hz-event', { detail: { name: 'cta_click', where: 'phone-ask', label: ask.label, path } }))}
        >
          <span>{ask.label}</span><i aria-hidden="true">→</i>
        </motion.a>
      )}
    </AnimatePresence>
  );
}
