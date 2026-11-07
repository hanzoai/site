'use client';
/* Unfold (v2, owned by the Story chat). A card that opens into its own sheet with a shared-element morph: the card's box
   grows into the sheet and folds back into the card on close (synchronized.studio; VISION.md motion 3, "Open").
   Usage:
     <motion.button layoutId="pillar-3" onClick={() => setOpen(3)} aria-haspopup="dialog">…card…</motion.button>
     <Unfold layoutId={open == null ? null : 'pillar-' + open} onClose={() => setOpen(null)} label="Pillar title">
       …sheet content (it fades in once the sheet has grown)…
     </Unfold>
   - layoutId: the open card's layoutId, or null when closed. Only one sheet is open at a time.
   - The page scroll stops while it is open (Lenis and native); Esc, the close button and the backdrop close it; focus
     goes to the close button and returns to the card. onKey(e) receives other keys (arrows for previous / next).
   - Keep the card's full text in the page as well (collapsed): the sheet is the reading view, not the only copy.
   - Transform and opacity only; reduced motion opens and closes in place. Style hooks: .v2u-back, .v2u-sheet, .v2u-x. */
import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import './Unfold.css';

const EASE = [0.16, 1, 0.3, 1];

export default function Unfold({ layoutId, onClose, label, onKey, children, className = '' }) {
  const close = useRef(null);
  const back = useRef(null);
  const open = layoutId != null;
  useEffect(() => {
    if (!open) return;
    back.current = document.activeElement;
    window.__lenis?.stop();
    document.documentElement.classList.add('x-lock');
    const t = setTimeout(() => close.current?.focus({ preventScroll: true }), 60);
    return () => {
      clearTimeout(t);
      window.__lenis?.start();
      document.documentElement.classList.remove('x-lock');
      back.current?.focus?.({ preventScroll: true });
    };
  }, [open]);
  useEffect(() => {
    if (!open) return;
    const key = (e) => { if (e.key === 'Escape') onClose(); else onKey?.(e); };
    addEventListener('keydown', key);
    return () => removeEventListener('keydown', key);
  }, [open, onClose, onKey]);
  return (
    <AnimatePresence>
      {open && (
        <div className="v2u" key="v2u">
          <motion.div className="v2u-back" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.3 } }} transition={{ duration: 0.4 }} />
          <motion.div layoutId={layoutId} className={'v2u-sheet ' + className} role="dialog" aria-modal="true" aria-label={label} style={{ borderRadius: 28 }} transition={{ type: 'spring', stiffness: 300, damping: 32 }} data-lenis-prevent="">
            <motion.div className="v2u-in" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 0.4, ease: EASE, delay: 0.18 } }} exit={{ opacity: 0, transition: { duration: 0.12 } }}>
              {children}
            </motion.div>
            <button ref={close} type="button" className="v2u-x" onClick={onClose} aria-label="Close">
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
