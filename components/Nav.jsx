'use client';
/* Hanzo's header menus, working. Their header buttons open a panel that drops from the header; moving between menus
   morphs the panel and slides the columns in the direction you moved; links arrive in a short cascade. On phones the
   Hanzo AI chevron opens a full-screen sheet with each menu as an accordion. Escape, the backdrop or a link closes it. */
import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { NAV, MENUS } from '../lib/nav';

const EASE = [0.16, 1, 0.3, 1];
const isLocal = (h) => h.startsWith('/');

function Item({ l, i, onGo }) {
  const cls = 'x-nav-a' + (l.big ? ' big' : '');
  const body = <>{l.label}{l.ext && <span aria-hidden="true"> ↗</span>}</>;
  return (
    <motion.li initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: EASE, delay: 0.04 + i * 0.018 }}>
      {isLocal(l.href)
        ? <Link href={l.href} className={cls} onClick={onGo}>{body}</Link>
        : <a href={l.href} className={cls} onClick={onGo} {...(l.ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{body}</a>}
    </motion.li>
  );
}

function Columns({ name, onGo }) {
  let n = 0;
  return NAV[name].map((c) => (
    <div className="x-nav-col" key={c.head}>
      <p className="x-nav-h">{c.head}</p>
      <ul>{c.links.map((l) => <Item key={l.label + l.href} l={l} i={n++} onGo={onGo} />)}</ul>
    </div>
  ));
}

export default function Nav({ headerRef }) {
  const [open, setOpen] = useState(null);
  const [dir, setDir] = useState(0);
  const [sheet, setSheet] = useState(false);
  const [acc, setAcc] = useState(null);
  const timer = useRef(0);
  const btns = useRef({});
  const path = usePathname();

  const show = useCallback((name) => {
    clearTimeout(timer.current);
    setOpen((cur) => { if (cur && name && cur !== name) setDir(MENUS.indexOf(name) > MENUS.indexOf(cur) ? 1 : -1); return name; });
  }, []);
  const later = useCallback(() => { clearTimeout(timer.current); timer.current = setTimeout(() => setOpen(null), 160); }, []);
  const close = useCallback(() => { clearTimeout(timer.current); setOpen(null); setSheet(false); }, []);

  useEffect(close, [path, close]); // a new page closes every menu

  // wire Hanzo's own header buttons
  useEffect(() => {
    const h = headerRef.current?.querySelector('header');
    if (!h) return;
    const offs = [];
    const on = (el, ev, fn) => { el.addEventListener(ev, fn); offs.push(() => el.removeEventListener(ev, fn)); };
    h.querySelectorAll('button').forEach((b) => {
      const name = b.getAttribute('aria-label') === 'Company' ? 'Company' : b.textContent.trim();
      if (!NAV[name]) return;
      btns.current[name] = b;
      b.setAttribute('aria-haspopup', 'true');
      b.setAttribute('aria-expanded', 'false');
      b.setAttribute('aria-controls', 'x-nav-panel');
      let hover = 0;
      on(b, 'pointerenter', (e) => { if (e.pointerType === 'mouse' && innerWidth > 900) hover = setTimeout(() => show(name), 70); });
      on(b, 'pointerleave', () => { clearTimeout(hover); });
      on(b, 'click', (e) => {
        e.preventDefault();
        if (innerWidth <= 900) { setSheet((s) => !s); return; } // on phones the chevron opens the sheet
        setOpen((cur) => (cur === name ? null : (cur && setDir(MENUS.indexOf(name) > MENUS.indexOf(cur) ? 1 : -1), name)));
      });
    });
    on(h, 'pointerleave', (e) => { if (e.pointerType === 'mouse') later(); });
    on(h, 'pointerenter', () => clearTimeout(timer.current));
    const key = (e) => { if (e.key === 'Escape') { const b = btns.current[open]; close(); b?.focus(); } };
    addEventListener('keydown', key);
    offs.push(() => removeEventListener('keydown', key));
    return () => offs.forEach((f) => f());
  }, [headerRef, show, later, close, open]);

  useEffect(() => { Object.entries(btns.current).forEach(([n, b]) => b.setAttribute('aria-expanded', String(open === n || (sheet && n === 'Company')))); }, [open, sheet]);
  useEffect(() => {
    if (!sheet) return;
    window.__lenis?.stop();
    document.documentElement.classList.add('x-lock');
    return () => { window.__lenis?.start(); document.documentElement.classList.remove('x-lock'); };
  }, [sheet]);

  return (
    <>
      <AnimatePresence>
        {open && (
          <>
            <motion.div key="scrim" className="x-nav-scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} onPointerEnter={later} onClick={close} aria-hidden="true" />
            <motion.div
              key="panel"
              id="x-nav-panel"
              className="x-nav-panel"
              role="region"
              aria-label={open + ' menu'}
              onPointerEnter={() => clearTimeout(timer.current)}
              onPointerLeave={later}
              initial={{ clipPath: 'inset(0 0 100% 0)' }}
              animate={{ clipPath: 'inset(0 0 0% 0)' }}
              exit={{ clipPath: 'inset(0 0 100% 0)', transition: { duration: 0.28, ease: [0.7, 0, 0.84, 0] } }}
              transition={{ duration: 0.5, ease: EASE }}
              layout
            >
              <AnimatePresence mode="popLayout" initial={false} custom={dir}>
                <motion.div
                  key={open}
                  className="x-nav-grid"
                  custom={dir}
                  variants={{ i: (d) => ({ opacity: 0, x: d * 40 }), a: { opacity: 1, x: 0 }, o: (d) => ({ opacity: 0, x: d * -40 }) }}
                  initial="i" animate="a" exit="o"
                  transition={{ duration: 0.4, ease: EASE }}
                >
                  <Columns name={open} onGo={close} />
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {sheet && (
          <motion.nav
            className="x-sheet"
            aria-label="Menu"
            initial={{ clipPath: 'circle(0% at 24px 30px)' }}
            animate={{ clipPath: 'circle(150% at 24px 30px)' }}
            exit={{ clipPath: 'circle(0% at 24px 30px)', transition: { duration: 0.45, ease: [0.7, 0, 0.84, 0] } }}
            transition={{ duration: 0.7, ease: EASE }}
          >
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
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
