'use client';
/* usePhoneAsk: one solid ask at a time, for the pages that call it (owned by the chat that owns /features /founder
   /gallery /gen /grants /history /ide /investors /iro /kata). No shared file is edited.
   - Every width: while a solid ask of the page (its hero ask, a form's submit, a closing band's button) or the shared
     phone bar is on screen, html[data-pq] outlines the header's button (rule in usePhoneAsk.css, the same look as the
     shared html[data-ask=quiet] rule in app/system.css). Its own attribute, so it never races the shared Ask.
   - Phones (≤ 700px): the shared Ask swaps the header's "Try Hanzo" for the page's own ask only on desktop; here the
     header button carries the page's ask once the hero's ask has gone by, unless the words would not fit the screen.
   It restores the header on leave. Request filed in docs/build-notes/requests/founder.md for the shared owner to fold this in.
   Usage: call usePhoneAsk() once in the page component. */
import { useEffect } from 'react';
import './usePhoneAsk.css';

const words = (t?: string | null) => (t || '').replace(/[→↗\s]+/g, ' ').trim().toLowerCase();
const rgb = (c: string) => (c.match(/[\d.]+/g) || []).map(Number);
/* a filled button: an opaque dark fill on paper, or an opaque light fill inside a dark room */
const solid = (el: Element) => {
  const [r, g, b, a = 1] = rgb(getComputedStyle(el).backgroundColor);
  if (a < 0.6 || r === undefined) return false;
  const sum = r + g + b;
  return sum < 180 || (sum > 690 && el.closest('[data-room]')?.getAttribute('data-room') === 'dark'); // the nearest room decides
};

export default function usePhoneAsk() {
  useEffect(() => {
    const phone = matchMedia('(max-width: 700px)').matches;
    const H = document.documentElement;
    let btn: HTMLAnchorElement | null = null, own: HTMLElement | null = null, label = '', href = '', t = 0, t2: ReturnType<typeof setTimeout> | undefined, swapped = false;
    const find = () => {
      btn = document.querySelector<HTMLAnchorElement>('header[data-slot=masthead] a[data-x-ask]');
      own = document.querySelector<HTMLElement>('main [data-thumb]');
      if (own) {
        label = own.getAttribute('data-thumb') || own.textContent?.trim() || '';
        href = own.getAttribute('href') || own.querySelector('a')?.getAttribute('href') || '';
      }
    };
    const seen = (el: Element) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.bottom > 0 && r.top < innerHeight; };
    const update = () => {
      if (!btn || !own) find();
      if (!btn) return;
      // the page's asks only: its [data-thumb] and its closing or submit buttons, never a dark product card
      const asks = [...document.querySelectorAll('main [data-thumb], main [data-cta]')]
        .filter((el) => el.hasAttribute('data-thumb') || /\.(hero|band|close|apply|claim|submit|send)$/.test(el.getAttribute('data-cta') || ''))
        .filter((el) => seen(el) && solid(el));
      const bar = document.querySelector('.x-ask'); // the shared slim bar, when it rises, is the solid one
      const barOn = !!bar && seen(bar) && +getComputedStyle(bar).opacity > 0.5;
      if (asks.length || barOn) H.dataset.pq = ''; else delete H.dataset.pq;
      H.dataset.pqReady = ''; // from here the hook decides (the arrival default in usePhoneAsk.css lifts)
      if (!phone || !own || !label || !href || words(label) === words(btn.dataset.xAsk)) return;
      const past = own.getBoundingClientRect().bottom < 60;
      if (past !== swapped) {
        swapped = past;
        const edge = btn.getBoundingClientRect().right; // where Hanzo's own label ends: the swapped one must end there too
        btn.textContent = past ? label : btn.dataset.xAsk ?? '';
        btn.setAttribute('href', past ? href : btn.dataset.xHref ?? '');
        // a long ask must never be clipped: if it runs past the screen's 16px gutter, keep Hanzo's own label
        if (past && (btn.getBoundingClientRect().right > Math.max(edge, innerWidth - 16) + 1 || btn.scrollWidth > btn.clientWidth + 1)) { btn.textContent = btn.dataset.xAsk ?? ''; btn.setAttribute('href', btn.dataset.xHref ?? ''); }
      }
    };
    let raf = 0; // follow the scroll as it happens (once a frame), and look again once the shared bar has settled
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; update(); }); clearTimeout(t2); t2 = setTimeout(update, 800); };
    addEventListener('scroll', onScroll, { passive: true });
    update(); // at once, so the header is never solid beside the hero's ask on arrival
    const timers = [120, 400, 1400, 2800].map((ms) => setTimeout(update, ms));
    return () => {
      clearTimeout(t); clearTimeout(t2); cancelAnimationFrame(raf); timers.forEach(clearTimeout); removeEventListener('scroll', onScroll);
      delete H.dataset.pq; delete H.dataset.pqReady;
      if (btn && swapped) { btn.textContent = btn.dataset.xAsk ?? ''; btn.setAttribute('href', btn.dataset.xHref ?? ''); }
    };
  }, []);
}
