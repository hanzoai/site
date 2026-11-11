'use client';
/* Hanzo's header menus, working. Their header buttons open a panel that drops from the header; moving between menus
   morphs the panel and slides the columns in the direction you moved; links arrive in a short cascade. On phones the
   Hanzo AI chevron opens a full-screen sheet with each menu as an accordion. Escape, the backdrop or a link closes it.
   Keyboard: Enter, Space or ↓ on a heading opens its menu and moves focus to the first link; ↑ ↓ move through the
   links; Tab past the last link closes it and goes on to the next heading; Shift+Tab from the first link goes back to
   the heading; Escape closes and returns focus. The items and words are Hanzo's own (lib/nav.js); pages add nothing. */
import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { NAV, MENUS } from '../lib/nav';
import { LOGIN } from '../lib/header';
import { resolveNavPreview, resolveNavDescription } from '../lib/visuals';

const EASE = [0.16, 1, 0.3, 1];
const isLocal = (h) => h.startsWith('/');

function Item({ l, head, i, onGo, onPeek }) {
  const cls = 'x-nav-a' + (l.big ? ' big' : '');
  const body = <>{l.label}{l.ext && <span aria-hidden="true"> ↗</span>}</>;
  const peek = onPeek ? { onMouseEnter: () => onPeek({ head, l }), onFocus: () => onPeek({ head, l }) } : {};
  return (
    <motion.li initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: EASE, delay: 0.04 + i * 0.018 }}>
      {isLocal(l.href)
        ? <Link href={l.href} className={cls} onClick={onGo} {...peek}>{body}</Link>
        : <a href={l.href} className={cls} onClick={onGo} {...peek} {...(l.ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{body}</a>}
    </motion.li>
  );
}

function Columns({ name, onGo, onPeek }) {
  let n = 0;
  return NAV[name].map((c) => (
    <div className="x-nav-col" key={c.head}>
      <p className="x-nav-h">{c.head}</p>
      <ul>{c.links.map((l) => <Item key={l.label + l.href} l={l} head={c.head} i={n++} onGo={onGo} onPeek={onPeek} />)}</ul>
    </div>
  ));
}

/* The menu's stage: a high-resolution dark-cinema preview of the link under the pointer or focus — matching Hanzo's
   flagship model cards (looping film + poster + kicker + tags), product window mockups (macOS dark-glass chrome +
   live product UI), and thematic 3D category sculptures across all six menus. */
let INDEX = null;
function Stage({ menu, head, l, onGo }) {
  const router = useRouter();
  const stageRef = useRef(null);
  const [, force] = useState(0);
  useEffect(() => { if (!INDEX) import('../lib/search.json').then((m) => { INDEX = new Map(m.default.map(([p, t, d]) => [p, [t, d]])); force((x) => x + 1); }); }, []);
  if (!l) return null;
  const local = isLocal(l.href);
  const path = local ? l.href.split(/[?#]/)[0].replace(/\/$/, '') || '/' : null;
  const [, rawIdx] = (local && INDEX?.get(path)) || [];
  const raw = rawIdx || resolveNavDescription(l.href);
  // the index keeps the first ~120 characters of Hanzo's description: end on a whole word with an ellipsis
  const d = raw && raw.length >= 115 ? raw.slice(0, raw.lastIndexOf(' ')).replace(/[,;:.]$/, '') + '…' : raw;
  const where = local ? 'hanzo.ai' + path : l.href.replace(/^https?:\/\//, '').replace(/\/$/, '');
  const spec = resolveNavPreview(menu || 'Company', head || '', l);
  const mediaKey = `${spec.mode}|${spec.poster}|${spec.video || ''}|${spec.screen || ''}|${spec.pos || ''}`;

  const onMove = (e) => {
    if (e.pointerType !== 'mouse' || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = stageRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const nx = ((e.clientX - r.left) / r.width - 0.5) * 2;
    const ny = ((e.clientY - r.top) / r.height - 0.5) * 2;
    el.style.setProperty('--nx', nx.toFixed(3));
    el.style.setProperty('--ny', ny.toFixed(3));
  };
  const onLeave = () => {
    const el = stageRef.current;
    if (!el) return;
    el.style.setProperty('--nx', '0');
    el.style.setProperty('--ny', '0');
  };

  const visit = () => {
    onGo?.();
    if (local) router.push(l.href);
    else window.open(l.href, l.ext ? '_blank' : '_self', 'noopener,noreferrer');
  };
  return (
    <aside
      ref={stageRef}
      className={`x-nav-stage x-nav-stage-${spec.mode}`}
      data-mode={spec.mode}
      aria-hidden="true"
      onClick={visit}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={mediaKey}
          className="x-nav-stage-media"
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.36, ease: EASE }}
          style={{
            '--st-pos': spec.pos || '50% 50%',
            '--st-scale': String(spec.scale || 1.04),
            '--st-flip': String(spec.flip || 1),
          }}
        >
          <img className="x-nav-stage-bg" src={spec.poster} alt="" decoding="async" draggable={false} />
          {spec.video && (
            <video
              className="x-nav-stage-vid"
              muted
              loop
              autoPlay
              playsInline
              preload="metadata"
              onLoadedData={(e) => e.currentTarget.classList.add('on')}
              onPlaying={(e) => e.currentTarget.classList.add('on')}
            >
              <source src={spec.video} type="video/webm" />
              <source src={spec.video.replace(/\.webm$/, '.mp4')} type="video/mp4" />
            </video>
          )}
          {spec.mode === 'product' && spec.screen && (
            <div className="x-nav-win">
              <div className="x-nav-win-bar">
                <span className="x-nav-win-dots"><i /><i /><i /></span>
                <span className="x-nav-win-title">{spec.windowBar || where}</span>
              </div>
              <div className="x-nav-win-body">
                <img src={spec.screen} alt="" decoding="async" draggable={false} />
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="x-nav-stage-top">
        <span className="x-nav-stage-kick">{spec.kicker}</span>
        {spec.tags && spec.tags.length > 0 && (
          <span className="x-nav-stage-tags">
            {spec.tags.slice(0, 2).map((tag) => <i key={tag}>{tag}</i>)}
          </span>
        )}
      </div>

      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div key={l.href} className="x-nav-stage-t" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.3, ease: EASE }}>
          <b>
            <span>{l.label}</span>
            <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
              <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </b>
          {d && <p>{d}</p>}
          <span className="x-nav-stage-url">{where}</span>
        </motion.div>
      </AnimatePresence>
    </aside>
  );
}

export default function Nav({ headerRef }) {
  const [open, setOpen] = useState(null);
  const [peek, setPeek] = useState(null);
  const [dir, setDir] = useState(0);
  const [sheet, setSheet] = useState(false);
  const [acc, setAcc] = useState(null);
  const timer = useRef(0);
  const openedAt = useRef({ name: null, t: 0 });
  const btns = useRef({});
  const path = usePathname();

  const show = useCallback((name) => {
    clearTimeout(timer.current); timer.current = 0;
    openedAt.current = { name, t: performance.now() };
    window.dispatchEvent(new CustomEvent('hz-header-exclusive', { detail: 'nav' }));
    setOpen((cur) => { if (cur && name && cur !== name) setDir(MENUS.indexOf(name) > MENUS.indexOf(cur) ? 1 : -1); return name; });
  }, []);
  const later = useCallback(() => { clearTimeout(timer.current); timer.current = setTimeout(() => { timer.current = 0; setOpen(null); }, 600); }, []);
  const close = useCallback(() => { clearTimeout(timer.current); timer.current = 0; setOpen(null); setSheet(false); }, []);

  useEffect(close, [path, close]); // a new page closes every menu
  useEffect(() => {
    if (open) {
      const col = NAV[open][0];
      setPeek({ head: col.head, l: col.links[0] });
    }
  }, [open]); // the stage starts on the menu's first link

  // wire Hanzo's own header buttons. Hover intent is decided by WHERE the pointer is, not by enter/leave events:
  // while a menu is open it stays open as long as the pointer is over the header, the panel, or the corridor between
  // the heading it opened from and the panel; it closes 600 ms after the pointer has truly left. Switching to another
  // heading needs the pointer to rest on it (160 ms), so a diagonal trip down to a link never flips the menu.
  const openRef = useRef(null);
  useEffect(() => { openRef.current = open; }, [open]);
  useEffect(() => {
    const h = headerRef.current?.querySelector('header');
    if (!h) return;
    const offs = [];
    const on = (el, ev, fn, o) => { el.addEventListener(ev, fn, o); offs.push(() => el.removeEventListener(ev, fn, o)); };
    let rest = 0, origin = null;
    const intoPanel = (name) => { let n = 0; const t = () => { const a = document.querySelector(`#x-nav-panel .x-nav-grid[data-menu="${name}"] a`); if (a) a.focus(); else if (n++ < 20) requestAnimationFrame(t); }; requestAnimationFrame(t); };
    const nameOf = (b) => (b.getAttribute('aria-label') === 'Company' ? 'Company' : b.textContent.trim());
    const menuTargets = [];
    h.querySelectorAll('button').forEach((b) => {
      const name = nameOf(b);
      if (!NAV[name]) return;
      btns.current[name] = b;
      b.setAttribute('aria-haspopup', 'true');
      b.setAttribute('aria-expanded', 'false');
      b.setAttribute('aria-controls', 'x-nav-panel');
      const hoverTarget = name === 'Company' ? (b.parentElement || b) : b;
      menuTargets.push(hoverTarget);
      on(hoverTarget, 'pointerenter', (e) => {
        if (e.pointerType !== 'mouse' || innerWidth <= 900) return;
        clearTimeout(rest);
        const cur = openRef.current;
        rest = setTimeout(() => { if (hoverTarget.matches(':hover')) { origin = hoverTarget.getBoundingClientRect(); show(name); } }, cur && cur !== name ? 80 : 60);
      });
      on(hoverTarget, 'pointerleave', () => clearTimeout(rest));
      on(b, 'keydown', (e) => {
        if (e.key !== 'ArrowDown' || innerWidth <= 900) return;
        e.preventDefault(); origin = b.getBoundingClientRect(); show(name); intoPanel(name);
      });
      on(b, 'click', (e) => {
        e.preventDefault();
        if (innerWidth <= 900) { setSheet((s) => !s); return; } // on phones the chevron opens the sheet
        if (e.detail === 0 && openRef.current !== name) intoPanel(name); // opened from the keyboard: focus goes into the menu
        // a click right after hover opened the menu keeps it open (hover-then-click must not close it)
        const fresh = openedAt.current.name === name && performance.now() - openedAt.current.t < 900;
        origin = b.getBoundingClientRect();
        window.dispatchEvent(new CustomEvent('hz-header-exclusive', { detail: 'nav' }));
        setOpen((cur) => (cur === name && !fresh ? null : (cur && cur !== name && setDir(MENUS.indexOf(name) > MENUS.indexOf(cur) ? 1 : -1), name)));
        openedAt.current = { name, t: 0 };
      });
    });
    // hovering a non-menu header item (Pricing, Search, EN, Log in, Try Hanzo) closes any open dropdown menu immediately
    h.querySelectorAll('a[href], button').forEach((el) => {
      if (menuTargets.some((t) => t.contains(el))) return;
      on(el, 'pointerenter', (e) => {
        if (e.pointerType !== 'mouse' || innerWidth <= 900) return;
        clearTimeout(rest);
        clearTimeout(timer.current);
        timer.current = 0;
        origin = null;
        if (openRef.current) setOpen(null);
        if (el.tagName === 'A') window.dispatchEvent(new CustomEvent('hz-header-exclusive', { detail: 'link' }));
      });
    });
    on(window, 'hz-header-exclusive', (e) => { if (e.detail !== 'nav' && openRef.current) { clearTimeout(rest); close(); } });
    // inside = header, panel, or the funnel from the heading down to the panel's full width
    const inside = (x, y) => {
      const hr = h.getBoundingClientRect();
      if (y >= hr.top && y <= hr.bottom + 2) return true;
      const p = document.getElementById('x-nav-panel');
      if (!p) return false;
      const pr = p.getBoundingClientRect();
      if (x >= pr.left && x <= pr.right && y >= pr.top - 2 && y <= pr.bottom + 24) return true;
      if (origin && y > origin.top && y < pr.top + 40) { const k = (y - origin.bottom) / Math.max(1, pr.top - origin.bottom); return x > origin.left - k * origin.left - 40 && x < origin.right + k * (pr.right - origin.right) + 40; }
      return false;
    };
    on(window, 'pointermove', (e) => {
      if (e.pointerType !== 'mouse' || !openRef.current) return;
      if (inside(e.clientX, e.clientY)) { clearTimeout(timer.current); timer.current = 0; }
      else if (!timer.current) timer.current = setTimeout(() => { timer.current = 0; setOpen(null); }, 600);
    }, { passive: true });
    on(document.documentElement, 'pointerleave', () => { if (openRef.current) later(); }); // pointer left the window
    const key = (e) => { if (e.key === 'Escape' && openRef.current) { const b = btns.current[openRef.current]; close(); b?.focus(); } };
    on(window, 'keydown', key);
    return () => { clearTimeout(rest); offs.forEach((f) => f()); };
  }, [headerRef, show, later, close]);

  useEffect(() => { Object.entries(btns.current).forEach(([n, b]) => b.setAttribute('aria-expanded', String(open === n || (sheet && n === 'Company')))); }, [open, sheet]);

  // keyboard inside the open panel: arrows walk the links; Tab off either end hands focus back to the header
  const panelKey = (e) => {
    const links = [...e.currentTarget.querySelectorAll(`.x-nav-grid[data-menu="${open}"] a`)];
    const i = links.indexOf(document.activeElement);
    if (i < 0) return;
    const trigger = btns.current[open];
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); links[(i + (e.key === 'ArrowDown' ? 1 : -1) + links.length) % links.length].focus(); }
    else if (e.key === 'Home' || e.key === 'End') { e.preventDefault(); links[e.key === 'Home' ? 0 : links.length - 1].focus(); }
    else if (e.key === 'Tab' && e.shiftKey && i === 0) { e.preventDefault(); trigger?.focus(); }
    else if (e.key === 'Tab' && !e.shiftKey && i === links.length - 1) {
      e.preventDefault();
      const all = [...(headerRef.current?.querySelectorAll('header a[href], header button') || [])];
      const next = all[all.indexOf(trigger) + 1];
      close(); (next || trigger)?.focus();
    }
  };
  useEffect(() => {
    if (!sheet) return;
    window.__lenis?.stop();
    document.documentElement.classList.add('x-lock');
    const esc = (e) => { if (e.key === 'Escape') { setSheet(false); btns.current.Company?.focus(); } };
    addEventListener('keydown', esc);
    const t = setTimeout(() => document.querySelector('.x-sheet-x')?.focus(), 60);
    return () => { clearTimeout(t); removeEventListener('keydown', esc); window.__lenis?.start(); document.documentElement.classList.remove('x-lock'); };
  }, [sheet]);
  // Tab stays inside the open sheet
  const sheetKey = (e) => {
    if (e.key !== 'Tab') return;
    const f = [...e.currentTarget.querySelectorAll('a[href], button:not([disabled])')];
    if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
    else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
  };
  const search = () => { setSheet(false); setTimeout(() => dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true, ctrlKey: true })), 80); };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div key="scrim" className="x-nav-scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} onClick={close} aria-hidden="true" />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            id="x-nav-panel"
            className="x-nav-panel"
            role="region"
            aria-label={open + ' menu'}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6, transition: { duration: 0.18, ease: [0.7, 0, 0.84, 0] } }}
            transition={{ duration: 0.3, ease: EASE }}
            onKeyDown={panelKey}
          >
            <span className="x-nav-bridge" aria-hidden="true" />
            <Stage menu={open} head={peek?.head} l={peek?.l} onGo={close} />
            <AnimatePresence mode="popLayout" initial={false} custom={dir}>
              <motion.div
                key={open}
                data-menu={open}
                className="x-nav-grid"
                custom={dir}
                variants={{ i: (d) => ({ opacity: 0, x: d * 40 }), a: { opacity: 1, x: 0 }, o: (d) => ({ opacity: 0, x: d * -40 }) }}
                initial="i" animate="a" exit="o"
                transition={{ duration: 0.4, ease: EASE }}
              >
                <Columns name={open} onGo={close} onPeek={setPeek} />
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {sheet && (
          <motion.nav
            className="x-sheet"
            aria-label="Menu"
            role="dialog"
            aria-modal="true"
            onKeyDown={sheetKey}
            initial={{ clipPath: 'circle(0% at 24px 30px)' }}
            animate={{ clipPath: 'circle(150% at 24px 30px)' }}
            exit={{ clipPath: 'circle(0% at 24px 30px)', transition: { duration: 0.45, ease: [0.7, 0, 0.84, 0] } }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <div className="x-sheet-top">
              <Link href="/" className="x-sheet-home" onClick={close} aria-label="Hanzo AI home">Hanzo AI</Link>
              <button type="button" className="x-sheet-s" onClick={search} aria-label="Search Hanzo or ask AI">
                <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><circle cx="9" cy="9" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.7" /><path d="m13.2 13.2 3.6 3.6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>
              </button>
            </div>
            <button type="button" className="x-sheet-x" onClick={close} aria-label="Close menu">✕</button>
            <ul className="x-sheet-list">
              {MENUS.map((m, i) => (
                <motion.li key={m} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE, delay: 0.15 + i * 0.05 }}>
                  <button type="button" className="x-sheet-b" aria-expanded={acc === m} onClick={() => setAcc((a) => (a === m ? null : m))}>
                    {m}<motion.span animate={{ rotate: acc === m ? 45 : 0 }} aria-hidden="true">+</motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {acc === m && (
                      <motion.div className="x-sheet-body" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.45, ease: EASE }}>
                        <Columns name={m} onGo={close} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.li>
              ))}
              <motion.li initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE, delay: 0.5 }}>
                <Link href="/pricing" className="x-sheet-b" onClick={close}>Pricing</Link>
              </motion.li>
            </ul>
            {/* pinned under the thumb: Hanzo's own Log in choices and its ask, in the header's words */}
            <motion.div className="x-sheet-foot" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE, delay: 0.4 }}>
              <p className="x-sheet-lh">Log in</p>
              <div className="x-sheet-login">
                {LOGIN.map((l) => <a key={l.label} href={l.href} onClick={close}><b>{l.label}</b><span>{l.sub}</span></a>)}
              </div>
              <a href="https://hanzo.ai/signup" className="x-btn solid lg x-sheet-ask" onClick={close}>Try Hanzo</a>
            </motion.div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
