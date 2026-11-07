'use client';
/* usePhoneAsk: one solid ask at a time, for the pages that call it (owned by the chat that owns /features /founder
   /gallery /gen /grants /history /ide /investors /iro /kata). No shared file is edited.
   - Every width: while a solid ask of the page (its hero ask, a form's submit, a closing band's button) or the shared
     phone bar is on screen, html[data-pq] outlines the header's button (rule in usePhoneAsk.css, the same look as the
     shared html[data-ask=quiet] rule in app/system.css). Its own attribute, so it never races the shared Ask.
   - Phones (≤ 700px): the shared Ask swaps the header's "Try Hanzo" for the page's own ask only on desktop; here the
     header button carries the page's ask once the hero's ask has gone by, unless the words would not fit the screen.
   It restores the header on leave. Request filed in docs/requests/founder.md for the shared owner to fold this in.
   Usage: call usePhoneAsk() once in the page component. */
import { useEffect } from 'react';
import './usePhoneAsk.css';

const words = (t) => (t || '').replace(/[→↗\s]+/g, ' ').trim().toLowerCase();
const rgb = (c) => (c.match(/[\d.]+/g) || []).map(Number);
/* a filled button: an opaque dark fill on paper, or an opaque light fill inside a dark room */
const solid = (el) => {
  const [r, g, b, a = 1] = rgb(getComputedStyle(el).backgroundColor);
  if (a < 0.6 || r === undefined) return false;
  const sum = r + g + b;
  return sum < 180 || (sum > 690 && !!el.closest('[data-room=dark]'));
};

export default function usePhoneAsk() {
  useEffect(() => {
    const phone = matchMedia('(max-width: 700px)').matches;
    const H = document.documentElement;
    let btn = null, own = null, label = '', href = '', t = 0, t2 = 0, swapped = false;
    const find = () => {
      btn = document.querySelector('header[data-slot=masthead] a[data-x-ask]');
      own = document.querySelector('main [data-thumb]');
      if (own) {
        label = own.getAttribute('data-thumb') || own.textContent.trim();
        href = own.getAttribute('href') || own.querySelector('a')?.getAttribute('href') || '';
      }
    };
    const seen = (el) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.bottom > 0 && r.top < innerHeight; };
    const update = () => {
      if (!btn || !own) find();
      if (!btn) return;
      const asks = [...document.querySelectorAll('main [data-cta], main [data-thumb]')].filter((el) => seen(el) && solid(el));
      const bar = document.querySelector('.x-ask'); // the shared slim bar, when it rises, is the solid one
      const barOn = !!bar && seen(bar) && +getComputedStyle(bar).opacity > 0.5;
      if (asks.length || barOn) H.dataset.pq = ''; else delete H.dataset.pq;
      if (!phone || !own || !label || !href || words(label) === words(btn.dataset.xAsk)) return;
      const past = own.getBoundingClientRect().bottom < 60;
      if (past !== swapped) {
        swapped = past;
        btn.textContent = past ? label : btn.dataset.xAsk;
        btn.setAttribute('href', past ? href : btn.dataset.xHref);
        // a long ask must never be clipped: if it runs past the screen's 16px gutter, keep Hanzo's own label
        if (past && (btn.getBoundingClientRect().right > innerWidth - 16 || btn.scrollWidth > btn.clientWidth + 1)) { btn.textContent = btn.dataset.xAsk; btn.setAttribute('href', btn.dataset.xHref); }
      }
    };
    const onScroll = () => { clearTimeout(t); clearTimeout(t2); t = setTimeout(update, 80); t2 = setTimeout(update, 800); }; // again once the bar has settled
    addEventListener('scroll', onScroll, { passive: true });
    const timers = [250, 1400, 2800].map((ms) => setTimeout(update, ms));
    return () => {
      clearTimeout(t); clearTimeout(t2); timers.forEach(clearTimeout); removeEventListener('scroll', onScroll);
      delete H.dataset.pq;
      if (btn && swapped) { btn.textContent = btn.dataset.xAsk; btn.setAttribute('href', btn.dataset.xHref); }
    };
  }, []);
}
