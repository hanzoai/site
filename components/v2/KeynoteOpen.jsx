'use client';
/* KeynoteOpen: cards that open into their own page, in place (VISION motion 3, synchronized.studio). Click a card and
   the card itself grows into a full sheet (a shared-element morph); its art keeps its place, the detail arrives inside.
   Close, Esc or the backdrop folds it back into the grid. Owned by the Cloud 1 chat.
   Usage:
     <KeynoteOpen items={[{ id: 'run', kick: '01', title: 'run, serve, bench', sub: 'One binary, three verbs.',
                            art: <MyArt />, body: <p>…</p>, href: '/docs', cta: 'Read the docs' }]} cols={3} />
   - art: the card's picture (live UI, a figure). body: the detail shown once open (also in the HTML, hidden, from the start).
   - href/cta: an optional link inside the opened card. cols: 2, 3 or 4 on desktop; phones show one column.
   Reduced motion: the sheet appears without the morph. */
import { useEffect, useId, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { A } from '../kit';
import './Keynote.css';
import './KeynoteOpen.css';

const T = { type: 'spring', stiffness: 300, damping: 34, mass: 0.9 };

export default function KeynoteOpen({ items, cols = 3, className = '' }) {
  const uid = useId().replace(/:/g, '');
  const [open, setOpen] = useState(null);
  const calm = useReducedMotion();
  const last = useRef(null);
  const cur = items.find((x) => x.id === open);
  useEffect(() => {
    if (!open) return;
    const k = (e) => e.key === 'Escape' && setOpen(null);
    window.addEventListener('keydown', k);
    window.__lenis?.stop();
    return () => { window.removeEventListener('keydown', k); window.__lenis?.start(); };
  }, [open]);
  const shut = () => { setOpen(null); setTimeout(() => last.current?.focus({ preventScroll: true }), 50); };
  const t = calm ? { duration: 0 } : T;
  return (
    <div className={'kno ' + className} style={{ '--cols': cols }}>
      <ul className="kno-grid">
        {items.map((it, i) => (
          <li key={it.id}>
            <motion.button
              type="button" className="kno-card" layoutId={uid + it.id} transition={t}
              style={{ borderRadius: 16, visibility: open === it.id ? 'hidden' : 'visible' }}
              aria-haspopup="dialog" aria-expanded={open === it.id}
              onClick={(e) => { last.current = e.currentTarget; setOpen(it.id); }}
              data-cursor="Open"
            >
              {it.art && <motion.div className="kno-art" layoutId={uid + it.id + 'a'} transition={t} aria-hidden="true">{it.art}</motion.div>}
              <span className="kno-txt">
                {it.kick && <span className="kn-kick">{it.kick}</span>}
                <span className="kn-title kno-t">{it.title}</span>
                {it.sub && <span className="kno-sub">{it.sub}</span>}
              </span>
              <span className="kno-plus" aria-hidden="true"><svg viewBox="0 0 16 16" width="14" height="14"><path d="M8 3v10M3 8h10" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg></span>
            </motion.button>
            {/* the opened detail, in the page from the start */}
            {it.body && <div className="kno-detail" hidden>{it.body}{it.href && <A to={it.href}>{it.cta || 'Learn more'}</A>}</div>}
          </li>
        ))}
      </ul>
      <AnimatePresence>
        {cur && (
          <div className="kno-layer" key="layer">
            <motion.div className="kno-back" onClick={shut} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} />
            <motion.div className="kno-full" role="dialog" aria-modal="true" aria-label={typeof cur.title === 'string' ? cur.title : undefined} layoutId={uid + cur.id} transition={t} style={{ borderRadius: 28 }} data-lenis-prevent="">
              {cur.art && <motion.div className="kno-art big" layoutId={uid + cur.id + 'a'} transition={t} aria-hidden="true">{cur.art}</motion.div>}
              <motion.div className="kno-full-b" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0, transition: { delay: calm ? 0 : 0.22, duration: 0.5, ease: [0.16, 1, 0.3, 1] } }} exit={{ opacity: 0, transition: { duration: 0.12 } }}>
                {cur.kick && <p className="kn-kick ac">{cur.kick}</p>}
                <h3 className="kn-headline">{cur.title}</h3>
                {cur.sub && <p className="kn-lede">{cur.sub}</p>}
                <div className="kno-body">{cur.body}</div>
                {cur.href && <A to={cur.href} className="kn-btn solid kno-cta">{cur.cta || 'Learn more'}</A>}
              </motion.div>
              <button type="button" className="kno-x" onClick={shut} aria-label="Close" autoFocus>
                <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
