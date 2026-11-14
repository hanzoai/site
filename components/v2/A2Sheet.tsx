'use client';
/* A2Sheet — "see the spec": detail that lives in something you open (Apps 2 chat; styles in A2.css).
   Usage: <A2Sheet label="See every capability" title="Capabilities">…anything…</A2Sheet>
   A button opens a panel from the right (a sheet rising from the bottom on phones) over a soft scrim. The contents are
   always in the HTML (closed = hidden and inert), so nothing is lost. Escape, the scrim and the close button shut it,
   focus moves in on open and back to the button on close, and the smooth scroller pauses while it is open. With
   JavaScript off its contents sit in the page where the button was. */
import { useEffect, useId, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import NoJs from '../NoJs';

interface A2SheetProps {
  label: ReactNode;
  title: string;
  children?: ReactNode;
  className?: string;
  btnClass?: string;
}

export default function A2Sheet({ label, title, children, className = '', btnClass = '' }: A2SheetProps) {
  const [open, setOpen] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);
  const x = useRef<HTMLButtonElement>(null);
  const id = useId();
  useEffect(() => {
    if (!open) return;
    const l = window.__lenis;
    l?.stop?.();
    const t = setTimeout(() => x.current?.focus({ preventScroll: true }), 60);
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    addEventListener('keydown', key);
    return () => { clearTimeout(t); removeEventListener('keydown', key); l?.start?.(); btn.current?.focus({ preventScroll: true }); };
  }, [open]);
  return (
    <>
      <NoJs css={'.a2-sheet-btn,.a2-sheet-scrim,.a2-sheet-x{display:none!important}.a2-sheet{position:static!important;visibility:visible!important}.a2-sheet-panel{position:static!important;transform:none!important;width:auto!important;box-shadow:none!important;border-radius:0!important}.a2-sheet-top{padding:24px 0 8px!important}.a2-sheet-body{padding:0!important;overflow:visible!important}'} />
      <button ref={btn} type="button" className={'a2-sheet-btn ' + btnClass} aria-haspopup="dialog" aria-expanded={open} aria-controls={id} onClick={() => setOpen(true)}>
        {label}<i aria-hidden="true">+</i>
      </button>
      <div className={'a2-sheet ' + className} data-open={open} id={id}>
        <button type="button" className="a2-sheet-scrim" tabIndex={-1} aria-hidden="true" onClick={() => setOpen(false)} />
        <div className="a2-sheet-panel" role="dialog" aria-modal="true" aria-label={title} inert={!open} data-lenis-prevent="">
          <div className="a2-sheet-top">
            <h3 className="a2-title">{title}</h3>
            <button ref={x} type="button" className="a2-sheet-x" aria-label="Close" onClick={() => setOpen(false)}>×</button>
          </div>
          <div className="a2-sheet-body">{children}</div>
        </div>
      </div>
    </>
  );
}
