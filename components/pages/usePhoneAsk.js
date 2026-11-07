'use client';
/* usePhoneAsk: one solid ask at a time on phones, for the pages that call it (owned by the Programs/Apps chat that
   owns /features /founder /gallery /gen /grants /history /ide /investors /iro /kata).
   The shared Ask (components/Ask.jsx) swaps the header's "Try Hanzo" for the page's own ask only above 700px. On phones
   the header kept a solid "Try Hanzo" beside the hero's solid ask. This hook does on phones exactly what the shared
   desktop effect does, through the same shared hooks (no shared file edited):
   - while the page's ask ([data-thumb], or any button with its words) is on screen, html[data-ask=quiet] outlines
     the header button (rule in app/system.css);
   - once the hero's ask has gone by, the header button carries the page's ask (its words and link).
   It restores the header on leave. Request filed in docs/requests/founder.md for the shared owner to fold this in.
   Usage: call usePhoneAsk() once in the page component. */
import { useEffect } from 'react';

const words = (t) => (t || '').replace(/[→↗\s]+/g, ' ').trim().toLowerCase();

export default function usePhoneAsk() {
  useEffect(() => {
    if (!matchMedia('(max-width: 700px)').matches) return;
    const H = document.documentElement;
    let btn = null, own = null, label = '', href = '', t = 0, swapped = false;
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
      if (!btn || !own || !label || !href || words(label) === words(btn.dataset.xAsk)) return;
      const twins = [...document.querySelectorAll('main a, main button')].filter((el) => el === own || words(el.getAttribute('data-thumb') || el.textContent) === words(label));
      const ask = twins.some(seen);
      const past = own.getBoundingClientRect().bottom < 60;
      if (ask) H.dataset.ask = 'quiet'; else delete H.dataset.ask;
      if (past !== swapped) {
        swapped = past;
        btn.textContent = past ? label : btn.dataset.xAsk;
        btn.setAttribute('href', past ? href : btn.dataset.xHref);
      }
    };
    const onScroll = () => { clearTimeout(t); t = setTimeout(update, 80); };
    addEventListener('scroll', onScroll, { passive: true });
    const timers = [250, 1400, 2800].map((ms) => setTimeout(update, ms));
    return () => {
      clearTimeout(t); timers.forEach(clearTimeout); removeEventListener('scroll', onScroll);
      delete H.dataset.ask;
      if (btn && swapped) { btn.textContent = btn.dataset.xAsk; btn.setAttribute('href', btn.dataset.xHref); }
    };
  }, []);
}
