'use client';
/* Morph navigation (mounted once in app/layout.jsx), the synchronized.studio move: a card opens into its page.
   - A big thing you click (a card, a tile, a picture: 160×90 px or more, or anything marked data-morph inside a link)
     grows at once into a full-screen stage that carries its picture (or its colour), with a soft whoosh. The next page
     loads underneath while the stage holds; when it has painted, the stage settles into the page's hero
     ([data-morph-target], else the first section) and dissolves. Nothing waits on the network before moving, so it is
     the same at every connection speed, in dev and in production.
   - A small link turns the page: the current page dims at once, the new one fades in when it arrives. Hanzo's header
     never moves. Back and Forward turn the same way.
   - Reduced motion, modified or new-tab clicks, downloads, other sites, [data-no-morph] regions and the WebGL opener's
     cards ([data-card]) navigate as plain links.
   How to use it on a page: nothing (links already morph). Optional: data-morph on the picture inside a link to choose
   what flies; data-morph-target on the next page's hero; data-no-morph to opt out. Timing lives in Morph.css. */
import { useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import './Morph.css';
import { play } from '../lib/sound';

const BIG = (r) => r.width >= 160 && r.height >= 90;
const calm = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const top = () => (window.__lenis ? window.__lenis.scrollTo(0, { immediate: true, force: true }) : scrollTo(0, 0));
const frames = (n, f) => (n ? requestAnimationFrame(() => frames(n - 1, f)) : f());

// the card's own picture and colour, for the stage it grows into
function stageFor(src, link = src) {
  const stage = document.createElement('div');
  stage.className = 'x-stage';
  stage.setAttribute('aria-hidden', 'true');
  // the card's colour is its largest painted surface (not a small pill inside it); failing that, the page behind it
  const area = (r) => r.width * r.height;
  const full = area(src.getBoundingClientRect());
  let bg = '', best = 0;
  for (const el of [src, ...src.querySelectorAll('*')].slice(0, 80)) {
    const cs = getComputedStyle(el), a = area(el.getBoundingClientRect());
    if (a <= best || a < full * 0.5) continue;
    const grad = /gradient/.test(cs.backgroundImage) && cs.backgroundImage.match(/rgba?\([^)]+\)|#[0-9a-f]{3,8}/i); // a gradient's first colour
    const c = !/rgba\(0, 0, 0, 0\)|transparent/.test(cs.backgroundColor) ? cs.backgroundColor : grad ? grad[0] : '';
    if (c) { bg = c; best = a; }
  }
  // no readable surface (a pseudo-element or an image paints it): light text means a dark card, dark text a light one
  if (!bg) {
    const m = getComputedStyle(src).color.match(/[\d.]+/g);
    const l = m ? (0.2126 * m[0] + 0.7152 * m[1] + 0.0722 * m[2]) / 255 : 0;
    bg = l > 0.6 ? '#0a0a0a' : '#ffffff';
  }
  stage.style.background = bg;
  const lum = ((c) => { const m = (c || '').match(/[\d.]+/g); return m ? (0.2126 * m[0] + 0.7152 * m[1] + 0.0722 * m[2]) / 255 : 1; })(stage.style.background);
  // the flying element may itself be the picture (data-morph on an <svg> or <img>)
  const media = [src, ...src.querySelectorAll('img, video, canvas, svg')].find((el) => /^(img|video|canvas|svg)$/i.test(el.tagName) && area(el.getBoundingClientRect()) >= full * 0.25);
  if (media && media.tagName.toLowerCase() === 'svg') {
    const m = media.cloneNode(true);
    m.setAttribute('class', 'x-stage-m'); m.setAttribute('preserveAspectRatio', 'xMidYMid slice'); m.style.color = getComputedStyle(media).color;
    stage.appendChild(m);
  } else if (media) {
    let m;
    if (media.tagName === 'CANVAS') {
      m = document.createElement('canvas'); m.width = media.width; m.height = media.height;
      try { m.getContext('2d').drawImage(media, 0, 0); } catch { m = null; }
    } else if (media.tagName === 'VIDEO') {
      m = document.createElement('video');
      Object.assign(m, { muted: true, playsInline: true, loop: true, autoplay: true, poster: media.poster, src: media.currentSrc || media.src });
      if (media.currentTime) m.currentTime = media.currentTime;
    } else {
      m = document.createElement('img'); m.src = media.currentSrc || media.src; m.alt = '';
    }
    if (m) { m.className = 'x-stage-m'; stage.appendChild(m); }
  }
  // the card's own title (its largest words) takes the hero's place while the page loads
  let title = null, size = 0;
  for (const el of link.querySelectorAll('h1, h2, h3, h4, b, strong, span, p')) { // the whole link: the title may sit beside the picture
    const t = el.textContent.trim(), fs = parseFloat(getComputedStyle(el).fontSize);
    if (t.length >= 2 && t.length <= 80 && !el.querySelector('h1, h2, h3, h4, p, div') && fs > size) { title = t; size = fs; }
  }
  if (title && size >= 18) {
    const h = document.createElement('p');
    h.className = 'x-stage-t'; h.textContent = title; h.style.color = lum < 0.5 ? '#f5f5f7' : '#0a0a0b';
    stage.appendChild(h);
  }
  return stage;
}

export default function Morph() {
  const router = useRouter();
  const path = usePathname();
  const pending = useRef(null); // { from, done } waiting for the next page to arrive
  const last = useRef(null);

  // the next page has arrived (its pathname is live): let it paint, then run what was waiting for it
  useEffect(() => {
    last.current = location.pathname;
    const p = pending.current;
    if (p && location.pathname !== p.from) { pending.current = null; frames(2, p.done); }
  }, [path]);

  useEffect(() => {
    const H = document.documentElement;
    const clear = () => { delete H.dataset.morph; delete H.dataset.dir; };

    // a small link, or Back/Forward: dim now, fade the new page in when it arrives
    const turn = (from, go) => {
      H.dataset.morph = 'leave';
      const arrive = () => {
        if (!window.__hzPop) top();
        H.dataset.morph = 'arrive';
        setTimeout(() => { if (H.dataset.morph === 'arrive') clear(); }, 700);
      };
      pending.current = { from, done: arrive };
      go?.();
      setTimeout(() => { if (pending.current?.done === arrive) { pending.current = null; clear(); } }, 8000); // never stuck dim
    };

    // a card: it grows into the stage now; the page comes in under it; the stage settles into the hero and dissolves
    const open = (src, from, go, link = src) => {
      play('whoosh'); // a card opening into its page (JAMES rule 10)
      const stage = stageFor(src, link);
      H.dataset.morph = 'open';
      src.style.viewTransitionName = 'hz-morph';
      const vt = document.startViewTransition(() => {
        src.style.viewTransitionName = '';
        document.body.appendChild(stage);
        stage.style.viewTransitionName = 'hz-morph';
        go(); // only after the card's picture has been captured
      });
      vt.ready.catch(() => {}); vt.updateCallbackDone.catch(() => {});
      const grown = vt.finished.catch(() => {});
      let gone = false;
      const dissolve = () => {
        if (gone) return; gone = true;
        delete H.dataset.morph;
        const hero = document.querySelector('[data-morph-target]') || document.querySelector('main > section, main > header, main > div');
        // the stage settles into the hero's box, then dissolves into the page
        if (hero && document.startViewTransition && hero.getBoundingClientRect().height > 40) {
          H.dataset.morph = 'land';
          // the card's title flies onto the page's headline (it is the same words when the page is the card's page)
          const from = stage.querySelector('.x-stage-t'), h1 = document.querySelector('main h1');
          const flyTitle = from && h1 && h1.getBoundingClientRect().height > 0;
          if (flyTitle) from.style.viewTransitionName = 'hz-title';
          const vt2 = document.startViewTransition(() => {
            stage.style.viewTransitionName = '';
            stage.remove();
            hero.style.viewTransitionName = 'hz-morph';
            if (flyTitle) h1.style.viewTransitionName = 'hz-title';
          });
          vt2.ready.catch(() => {}); vt2.updateCallbackDone.catch(() => {});
          vt2.finished.catch(() => {}).finally(() => { hero.style.viewTransitionName = ''; if (h1) h1.style.viewTransitionName = ''; clear(); });
        } else {
          stage.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 450, easing: 'cubic-bezier(.22,1,.36,1)' }).finished.finally(() => stage.remove());
          clear();
        }
      };
      // land once the page's headline is really visible (many pages cut it in with a line mask), or after 1.6 s
      const headlineShown = () => {
        const h1 = document.querySelector('main h1');
        if (!h1) return true;
        for (let x = h1; x && x !== document.body; x = x.parentElement) if (+getComputedStyle(x).opacity < 0.9) return false;
        const hr = h1.getBoundingClientRect();
        const line = [...h1.querySelectorAll('span, div')].find((e) => e.textContent.trim() && !e.closest('.x-sr, .sr-only') && e.getBoundingClientRect().height > 0);
        if (!line) return true;
        const lr = line.getBoundingClientRect();
        return lr.top >= hr.top - 4 && lr.bottom <= hr.bottom + 4 && +getComputedStyle(line).opacity > 0.9;
      };
      const whenShown = (t0 = performance.now()) => (headlineShown() || performance.now() - t0 > 1600 ? dissolve() : setTimeout(() => whenShown(t0), 90));
      pending.current = { from, done: () => { top(); grown.then(() => setTimeout(() => whenShown(), 60)); } };
      setTimeout(() => { if (!gone) { pending.current = null; grown.then(dissolve); } }, 8000); // a page that never comes: let go
    };

    // Back and Forward (the URL has already changed)
    const pop = () => {
      window.__hzPop = true; // Chrome.jsx leaves the restored scroll alone
      const from = last.current;
      if (!from || from === location.pathname || calm()) return;
      H.dataset.dir = 'back';
      turn(from, null);
    };

    const seen = new Set();
    const local = (a) => {
      if (!a || (a.target && a.target !== '_self') || a.hasAttribute('download') || a.closest('[data-no-morph],[data-card]')) return null;
      const u = new URL(a.href, location.href);
      return u.origin === location.origin && !/\.(pdf|xml|txt|md|json|png|jpe?g|webp|svg|zip)$/i.test(u.pathname) ? u : null;
    };
    // fetch the next page while the pointer is on its way to the link
    const warm = (e) => { const u = local(e.target.closest?.('a[href]')); if (u && !seen.has(u.pathname)) { seen.add(u.pathname); router.prefetch(u.pathname); } };
    const click = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target.closest?.('a[href]');
      const u = local(a);
      if (!u || u.pathname === location.pathname || calm()) return;
      e.preventDefault();
      e.stopPropagation();
      const go = () => router.push(u.pathname + u.search + u.hash, { scroll: false });
      const own = a.matches('[data-morph]') ? a : a.querySelector('[data-morph]');
      const src = own || (BIG(a.getBoundingClientRect()) ? a : null);
      if (src && document.startViewTransition) open(src, location.pathname, go, a);
      else turn(location.pathname, go);
    };
    addEventListener('popstate', pop);
    document.addEventListener('pointerover', warm, { passive: true });
    document.addEventListener('touchstart', warm, { passive: true }); // phones: fetch on the first touch, before the tap ends
    document.addEventListener('click', click, true);
    return () => {
      removeEventListener('popstate', pop);
      document.removeEventListener('pointerover', warm); document.removeEventListener('touchstart', warm); document.removeEventListener('click', click, true);
    };
  }, [router]);
  return null;
}
