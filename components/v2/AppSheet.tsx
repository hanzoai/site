'use client';
/* A sheet that opens (owned by the Apps 1 chat): detail lives in things you open. On desktop it slides in from the right
   as a drawer; on a phone it rises from the bottom. Its words are always in the HTML (closed, it is only hidden).
   Usage: <Sheet label="See the spec" title="Specifications" kick="Hanzo API">…any content…</Sheet>
   - label: the trigger's words; trigger: optional className for the trigger button;
   - place it outside transformed or clipped containers (the panel is position: fixed).
   Esc, the backdrop and the close button close it; focus moves in and comes back; page scroll pauses while open. */
import { useEffect, useId, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import './AppSheet.css';

interface SheetProps {
  label?: ReactNode;
  title?: string;
  kick?: string;
  children?: ReactNode;
  trigger?: string;
  icon?: boolean;
}

export default function Sheet({ label, title, kick, children, trigger = '', icon = true }: SheetProps) {
  const [open, setOpen] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);
  const close = useRef<HTMLButtonElement>(null);
  const id = useId();
  useEffect(() => {
    if (!open) return;
    window.__lenis?.stop();
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    addEventListener('keydown', k);
    const t = setTimeout(() => close.current?.focus(), 60);
    return () => { window.__lenis?.start(); removeEventListener('keydown', k); clearTimeout(t); };
  }, [open]);
  const shut = () => { setOpen(false); btn.current?.focus(); };
  return (
    <>
      <button ref={btn} type="button" className={'av-sh-btn ' + trigger} aria-haspopup="dialog" aria-expanded={open} aria-controls={id} onClick={() => setOpen(true)}>
        <span>{label}</span>
        {icon && <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M8 3v10M3 8h10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>}
      </button>
      <div className={'av-sh' + (open ? ' open' : '')} data-dock={open ? '' : undefined}>
        <div className="av-sh-back" onClick={shut} aria-hidden="true" />
        <div id={id} className="av-sh-panel" role="dialog" aria-modal={open ? true : undefined} aria-label={title || (typeof label === 'string' ? label : undefined)} data-lenis-prevent data-swipe-own>
          <div className="av-sh-top">
            <div>
              {title && <p className="av-sh-title">{title}</p>}
              {kick && <p className="av-kick av-sh-sub">{kick}</p>}
            </div>
            <button ref={close} type="button" className="av-sh-x" onClick={shut} aria-label="Close">
              <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
            </button>
          </div>
          <div className="av-sh-body">{children}</div>
        </div>
      </div>
    </>
  );
}
