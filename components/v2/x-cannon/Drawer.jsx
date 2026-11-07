'use client';
/* Drawer (v2): a sheet that opens out of the thing you clicked, the synchronized.studio way: the sheet starts as the
   clicked card's own rectangle and grows into a full sheet, then closes back into it.
   Usage:
     import Drawer from '../v2/Drawer';
     const [from, setFrom] = useState(null);                       // the element it opens out of
     <button onClick={(e) => setFrom(e.currentTarget.closest('article'))}>Compare</button>
     <Drawer open={!!from} from={from} onClose={() => setFrom(null)} label="Compare plans" title="Compare plans">
       ...anything...
     </Drawer>
   - Always in the HTML: closed, it is hidden and inert, but its text stays in the page for search and the parity check.
   - Opening: a clip-path that starts on the source rectangle grows to the sheet (560 ms, EASE); the content settles in
     just after. Closing is quicker (380 ms) and shrinks back into the source. Reduced motion: it simply appears.
   - A real modal: role=dialog, focus moves to the close button and returns to the opener, Esc and the backdrop close
     it, and the page behind stops scrolling (Lenis paused; the sheet scrolls itself with data-lenis-prevent).
   - On phones it is a bottom sheet that fills the screen below the header.
   Owned by the Enterprise + Pricing chat (v2 wave 1). */
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, useAnimate, useReducedMotion } from 'motion/react';
import './Drawer.css';

const EASE = [0.16, 1, 0.3, 1];
const SHUT = 'inset(0px 0px 0px 0px round 28px)';

// the clip that makes the sheet look exactly like the source element
function from(src, panel) {
  if (!src || !panel) return 'inset(40% 30% 40% 30% round 28px)';
  const a = src.getBoundingClientRect(), b = panel.getBoundingClientRect();
  const t = Math.max(0, a.top - b.top), l = Math.max(0, a.left - b.left);
  const r = Math.max(0, b.right - a.right), bt = Math.max(0, b.bottom - a.bottom);
  return `inset(${t}px ${r}px ${bt}px ${l}px round 28px)`;
}

export default function Drawer({ open, from: src, onClose, label, title, children, className = '' }) {
  const [scope, animate] = useAnimate();
  const back = useRef(null);
  const closeBtn = useRef(null);
  const last = useRef(null);
  const calm = useReducedMotion();
  const [shown, setShown] = useState(false);

  useLayoutEffect(() => {
    const panel = scope.current;
    if (!panel) return;
    if (open) {
      last.current = src;
      back.current = document.activeElement;
      setShown(true);
      if (calm) { panel.style.clipPath = 'none'; return; }
      panel.scrollTop = 0;
      animate(panel, { clipPath: [from(src, panel), SHUT] }, { duration: 0.56, ease: EASE });
      animate('.v2-dr-in', { opacity: [0, 1], y: [24, 0] }, { duration: 0.5, ease: EASE, delay: 0.16 });
    } else if (shown) {
      const done = () => setShown(false);
      if (calm) { done(); return; }
      animate('.v2-dr-in', { opacity: 0 }, { duration: 0.14 });
      animate(panel, { clipPath: [SHUT, from(last.current, panel)] }, { duration: 0.38, ease: [0.76, 0, 0.24, 1] }).then(done);
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  // focus, Esc, and the page behind holding still
  useEffect(() => {
    if (!open) return;
    closeBtn.current?.focus({ preventScroll: true });
    const key = (e) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key !== 'Tab' || !scope.current) return;
      // keep Tab inside the sheet while it is open
      const f = [...scope.current.querySelectorAll('a[href], button:not([disabled]), [tabindex="0"]')];
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      else if (!scope.current.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
    };
    addEventListener('keydown', key);
    window.__lenis?.stop();
    const o = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    return () => {
      removeEventListener('keydown', key);
      window.__lenis?.start();
      document.documentElement.style.overflow = o;
      back.current?.focus?.({ preventScroll: true });
    };
  }, [open, onClose]);

  const live = open || shown;
  return (
    <div className={'v2-dr' + (live ? ' live' : '') + (open ? ' open' : '') + (className ? ' ' + className : '')} aria-hidden={!open} inert={!open}>
      <motion.div className="v2-dr-bg" onClick={onClose} initial={false} animate={{ opacity: open ? 1 : 0 }} transition={{ duration: open ? 0.4 : 0.3 }} />
      <div ref={scope} className="v2-dr-p" role="dialog" aria-modal="true" aria-label={label || title} data-lenis-prevent>
        <div className="v2-dr-in">
          <div className="v2-dr-top">
            {title && <h2 className="v2-dr-h">{title}</h2>}
            <button ref={closeBtn} type="button" className="v2-dr-x" onClick={onClose} aria-label="Close"><i aria-hidden="true" /></button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
