'use client';
/* Morph navigation (mounted once in app/layout.jsx): every in-site click is a ~600 ms View Transition. A big thing you
   click (a card, a tile, a picture, 160×90 px or more) opens into the next page's hero; a small link turns the page like
   a sheet while Hanzo's header stays put. Browsers without View Transitions, reduced motion, modified or new-tab clicks
   and the WebGL opener's model cards ([data-card]) navigate instantly, as before.
   How to use it on a page:
   - nothing: links already morph. To choose what flies, put data-morph on the element inside the link (an image, a title);
   - data-morph-target on the next page's hero (otherwise its first section receives the card);
   - data-no-morph on a link or a region to opt out. Timing lives in components/Morph.css.
   Back and Forward turn the page the other way. The screen is never held more than 700 ms: a slow page cuts over. */
import { useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import './Morph.css';

const BIG = (r) => r.width >= 160 && r.height >= 90;

export default function Morph() {
  const router = useRouter();
  const path = usePathname();
  const pending = useRef(null);
  const last = useRef(null);

  useEffect(() => { last.current = location.pathname; const p = pending.current; if (p && location.pathname !== p.from) { pending.current = null; p.done(); } }, [path]);

  // Back and Forward: the page turns the other way (no card flies; the URL already changed)
  useEffect(() => {
    const pop = () => {
      window.__hzPop = true; // Chrome.jsx leaves the restored scroll alone
      const from = last.current;
      if (!document.startViewTransition || !from || from === location.pathname || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      document.documentElement.dataset.morph = 'back';
      let vt = null;
      vt = document.startViewTransition(() => new Promise((ok) => {
        pending.current = { from, done: () => requestAnimationFrame(() => ok()) };
        setTimeout(() => { const p = pending.current; if (p) { pending.current = null; ok(); vt?.skipTransition?.(); } }, 700);
      }));
      vt.ready.catch(() => {}); vt.updateCallbackDone.catch(() => {});
      vt.finished.catch(() => {}).finally(() => { delete document.documentElement.dataset.morph; });
    };
    addEventListener('popstate', pop);
    return () => removeEventListener('popstate', pop);
  }, []);

  useEffect(() => {
    const seen = new Set();
    const local = (a) => {
      if (!a || (a.target && a.target !== '_self') || a.hasAttribute('download') || a.closest('[data-no-morph],[data-card]')) return null;
      const u = new URL(a.href, location.href);
      return u.origin === location.origin && !/\.(pdf|xml|txt|json|png|jpe?g|webp|svg|zip)$/i.test(u.pathname) ? u : null;
    };
    // fetch the next page while the pointer is on its way to the link
    const warm = (e) => { const u = local(e.target.closest?.('a[href]')); if (u && !seen.has(u.pathname)) { seen.add(u.pathname); router.prefetch(u.pathname); } };
    const click = (e) => {
      if (!document.startViewTransition || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target.closest?.('a[href]');
      const u = local(a);
      if (!u || u.pathname === location.pathname || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      e.preventDefault();
      e.stopPropagation();
      const own = a.matches('[data-morph]') ? a : a.querySelector('[data-morph]');
      const src = own || (BIG(a.getBoundingClientRect()) ? a : null);
      if (src) src.style.viewTransitionName = 'hz-morph';
      document.documentElement.dataset.morph = src ? 'open' : 'turn';
      let vt = null;
      vt = document.startViewTransition(() => new Promise((ok) => {
        if (src) src.style.viewTransitionName = '';
        const done = () => {
          window.__lenis ? window.__lenis.scrollTo(0, { immediate: true, force: true }) : scrollTo(0, 0);
          const t = document.querySelector('[data-morph-target]') || document.querySelector('main > section, main > header, main > div');
          if (src && t) t.style.viewTransitionName = 'hz-morph';
          requestAnimationFrame(() => ok());
        };
        pending.current = { from: location.pathname, done };
        router.push(u.pathname + u.search + u.hash, { scroll: false });
        // never hold the screen: after 700 ms the page simply cuts over when it is ready (PLAN 2.9)
        setTimeout(() => { const p = pending.current; if (p) { pending.current = null; p.done(); vt?.skipTransition?.(); } }, 700);
      }));
      vt.ready.catch(() => {}); vt.updateCallbackDone.catch(() => {}); // a skipped transition is not an error
      vt.finished.catch(() => {}).finally(() => {
        document.querySelectorAll('[style*="view-transition-name"]').forEach((el) => { el.style.viewTransitionName = ''; });
        delete document.documentElement.dataset.morph;
      });
    };
    document.addEventListener('pointerover', warm, { passive: true });
    document.addEventListener('touchstart', warm, { passive: true }); // phones: fetch on the first touch, before the tap ends
    document.addEventListener('click', click, true);
    return () => { document.removeEventListener('pointerover', warm); document.removeEventListener('touchstart', warm); document.removeEventListener('click', click, true); };
  }, [router]);
  return null;
}
