'use client';
/* OpenSheet: cards that open into their page (synchronized.studio). The card you click grows into a sheet with a
   shared-element morph, its full text inside; Esc, the close button or the backdrop folds it back into the card.
   Usage:
     <OpenCards items={[{ id: 'accounts', k: '01', t: 'Accounts', d: 'One line.', body: <p>…</p>, art: <Svg/> }]} cols={4} />
     <Sheet open={bool} onClose={fn} layoutId="x" title="…">…</Sheet>   (the sheet on its own, for a button)
   - Every card's full text is in the page (collapsed with `hidden`), so nothing is lost and find-in-page works.
   - The page behind stops scrolling while a sheet is open (Lenis stops), and focus returns to the card.
   - Reduced motion: the sheet appears in place without the morph. Owned by the Business 2 chat. */
import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import './OpenSheet.css';

const EASE = [0.16, 1, 0.3, 1] as const;
const MORPH = { duration: 0.6, ease: [0.4, 0, 0.2, 1] } as const; // Morph: 600ms in-out, no springs (MASTER 3.1)

interface SheetProps {
  open: boolean;
  onClose: () => void;
  layoutId?: string;
  title?: string;
  kicker?: ReactNode;
  children?: ReactNode;
  wide?: boolean;
  art?: ReactNode;
}

export function Sheet({ open, onClose, layoutId, title, kicker, children, wide, art }: SheetProps) {
  const box = useRef<HTMLDivElement>(null);
  const calm = useReducedMotion();
  const [host, setHost] = useState<Element | null>(null);
  useEffect(() => setHost(document.querySelector('main.w2') || document.body), []); // inside the page, so its accent applies
  useEffect(() => {
    if (!open) return;
    window.__lenis?.stop();
    document.documentElement.classList.add('x-lock');
    const back = document.activeElement as HTMLElement | null; // focus returns here when the sheet closes
    const k = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key !== 'Tab' || !box.current) return; // Tab stays inside the sheet
      const f = [...box.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])')].filter((el) => el.getClientRects().length);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1], at = document.activeElement;
      if (!box.current.contains(at)) { e.preventDefault(); first.focus(); }
      else if (e.shiftKey && at === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && at === last) { e.preventDefault(); first.focus(); }
    };
    addEventListener('keydown', k);
    const t = setTimeout(() => box.current?.querySelector<HTMLButtonElement>('button')?.focus({ preventScroll: true }), 60);
    return () => { window.__lenis?.start(); document.documentElement.classList.remove('x-lock'); removeEventListener('keydown', k); clearTimeout(t); back?.focus?.({ preventScroll: true }); };
  }, [open, onClose]);
  if (!host) return null;
  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="w2-sheet-host" key="host">
          <motion.button type="button" className="w2-sheet-back" aria-label="Close" onClick={onClose}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} />
          <motion.div ref={box} role="dialog" aria-modal="true" aria-label={title} className={'w2-sheet' + (wide ? ' wide' : '')}
            layoutId={calm ? undefined : layoutId} transition={MORPH} data-lenis-prevent
            {...(calm || !layoutId ? { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 24 } } : {})}>
            <motion.div className="w2-sheet-in" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.18, duration: 0.35 } }} exit={{ opacity: 0, transition: { duration: 0.12 } }}>
              <button type="button" className="w2-sheet-x" onClick={onClose} aria-label="Close"><span aria-hidden="true">×</span></button>
              {art && <div className="w2-sheet-art">{art}</div>}
              <h3 className="w2-sheet-t">{title}</h3>
              {kicker && <p className="w2-kicker acc w2-sheet-k">{kicker}</p>}
              <div className="w2-sheet-b">{children}</div>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    host
  );
}

/* A button that opens a sheet of detail; the detail is always in the page, collapsed. */
/* label: Hanzo's own words only (for example the items the sheet holds); with no label the button is the "+" alone and
   its accessible name is the sheet's title. */
interface DetailProps {
  label?: string;
  title: string;
  kicker?: ReactNode;
  children?: ReactNode;
  wide?: boolean;
  className?: string;
}

export function Detail({ label, title, kicker, children, wide, className = '' }: DetailProps) {
  const [open, setOpen] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);
  const id = useId();
  return (
    <>
      <motion.button ref={btn} type="button" className={'w2-detail ' + (label ? '' : 'solo ') + className} layoutId={'dt-' + id} transition={MORPH} aria-haspopup="dialog" aria-label={label ? undefined : title} onClick={() => setOpen(true)} data-cursor="Open">
        {label && <span>{label}</span>}<i aria-hidden="true">+</i>
      </motion.button>
      <div hidden>{children}</div>
      <Sheet open={open} onClose={() => { setOpen(false); setTimeout(() => btn.current?.focus({ preventScroll: true }), 50); }} layoutId={'dt-' + id} title={title} kicker={kicker} wide={wide}>{children}</Sheet>
    </>
  );
}

export interface OpenItem {
  id: string;
  k?: string;
  t: string;
  d?: ReactNode;
  body?: ReactNode;
  art?: ReactNode;
}

interface OpenCardsProps {
  items: OpenItem[];
  cols?: number;
  className?: string;
  dark?: boolean;
}

export function OpenCards({ items, cols = 3, className = '', dark }: OpenCardsProps) {
  const [open, setOpen] = useState<string | null>(null);
  const last = useRef<HTMLElement | null>(null);
  const it = items.find((x) => x.id === open);
  const close = () => { setOpen(null); setTimeout(() => last.current?.focus({ preventScroll: true }), 50); };
  return (
    <>
      <ul className={'w2-oc ' + className} style={{ '--cols': cols } as CSSProperties}>
        {items.map((x, i) => (
          <li key={x.id}>
            <motion.button type="button" className={'w2-oc-card' + (dark ? ' dark' : '')} layoutId={'oc-' + x.id} transition={MORPH}
              aria-haspopup="dialog" onClick={(e) => { last.current = e.currentTarget; setOpen(x.id); }} data-cursor="Open"
              whileHover={{ y: -4 }} whileTap={{ scale: 0.985 }}>
              {x.art && <span className="w2-oc-art" aria-hidden="true">{x.art}</span>}
              <span className="w2-oc-k x-mono">{x.k ?? String(i + 1).padStart(2, '0')}</span>
              <span className="w2-oc-t">{x.t}</span>
              {x.d && <span className="w2-oc-d">{x.d}</span>}
              <span className="w2-oc-plus" aria-hidden="true">+</span>
            </motion.button>
            {/* the full text stays in the page, collapsed */}
            <div hidden>{x.body}</div>
          </li>
        ))}
      </ul>
      <Sheet open={!!it} onClose={close} layoutId={it ? 'oc-' + it.id : undefined} title={it?.t} kicker={it?.k} art={it?.art}>{it?.body}</Sheet>
    </>
  );
}
