'use client';
/* BizOpen: cards that open into their own page-sized panel with a shared-element morph (synchronized.studio).
   Owned by the Business 1 chat.
   Usage:
     <BizOpen label="Plans" className="ct-plans" items={[{ id: 'growth', label: 'Growth', card: <>…</>, panel: <>…</>, style }]} />
   Click (or Enter on) a card and the card itself grows into a panel over the page (a spring, 300/30); the panel's words
   arrive once it has landed. Esc, the backdrop or Close send it back into its card, and focus returns to it.
   Phones: the panel rises as a full-width sheet. Reduced motion: it simply appears. Every panel's words are also in the
   card's hidden copy, so they are in the HTML before anything is opened. Card and panel content are yours to style. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Close } from './BizSheet';
import './Biz.css';

const SPRING = { type: 'spring', stiffness: 300, damping: 30 };
const Plus = () => <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>;

export default function BizOpen({ items, label, className = '', cardClass = '', as = 'ul' }) {
  const [open, setOpen] = useState(null);
  const calm = useReducedMotion();
  const cards = useRef({});
  const cur = items.find((it) => it.id === open);
  useEffect(() => {
    if (!open) return;
    const back = cards.current[open];
    window.__lenis?.stop();
    document.documentElement.classList.add('x-lock');
    const key = (e) => { if (e.key === 'Escape') setOpen(null); };
    addEventListener('keydown', key);
    return () => {
      removeEventListener('keydown', key);
      window.__lenis?.start();
      document.documentElement.classList.remove('x-lock');
      back?.focus({ preventScroll: true });
    };
  }, [open]);
  const List = as;
  return (
    <>
      <List className={'bz-open-grid ' + className} aria-label={label}>
        {items.map((it) => (
          <li key={it.id} style={it.style} className={it.className}>
            <motion.button
              ref={(el) => { cards.current[it.id] = el; }}
              type="button"
              layoutId={calm ? undefined : 'bzo-' + it.id}
              transition={SPRING}
              className={'bz-open-card ' + cardClass}
              style={{ borderRadius: 16 }}
              onClick={() => setOpen(it.id)}
              aria-haspopup="dialog"
              aria-label={it.label ? 'Open ' + it.label : undefined}
              data-cursor="Open"
            >
              {it.card}
              <span className="bz-open-plus" aria-hidden="true"><Plus /></span>
            </motion.button>
            <div hidden>{it.panel}</div>
          </li>
        ))}
      </List>
      <AnimatePresence>
        {cur && (
          <div className="bz-open-layer" role="dialog" aria-modal="true" aria-label={cur.label}>
            <motion.div className="bz-open-back" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} onClick={() => setOpen(null)} />
            <motion.div layoutId={calm ? undefined : 'bzo-' + cur.id} transition={SPRING} className="bz-open-panel" style={{ borderRadius: 28 }} data-lenis-prevent="">
              <button type="button" className="bz-sheet-x bz-open-x" aria-label="Close" onClick={() => setOpen(null)} autoFocus><Close /></button>
              <motion.div className="bz-open-scroll" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0, transition: { duration: 0.4, delay: calm ? 0 : 0.18 } }} exit={{ opacity: 0, transition: { duration: 0.12 } }}>
                {cur.panel}
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
