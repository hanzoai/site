'use client';
/* LogoWall (v2): a calm wall of logos in motion, the chatgpt.com/business/enterprise way.
   Usage:
     import LogoWall from '../v2/LogoWall';
     <LogoWall items={[{ name: 'nvidia', src: '/logos/partners/nvidia.svg', href: '/x' }]} label="Clouds Hanzo deploys on" />
   - One slow CSS drift (no JS loop), so it costs nothing on the main thread. It pauses while the pointer or focus is on
     it, and off screen (the shell's [data-off] rule pauses CSS animations of a section that is not visible).
   - Reduced motion: the logos sit still, wrapped and centred.
   - A logo that fails to load turns into its name set in type, so the wall never shows a broken image.
   - `href` is optional: with it each logo is a link, without it a plain figure.
   Owned by the Enterprise + Pricing chat (v2 wave 1). */
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import './LogoWall.css';

export interface LogoItem {
  name: string;
  src: string;
  href?: string;
}

function Logo({ name, src, hidden }: { name: string; src: string; hidden: boolean }) {
  const ref = useRef<HTMLImageElement>(null);
  const [bad, setBad] = useState(false);
  // an image that failed before React hydrated never fires onError for us, so check once on mount
  useEffect(() => { const i = ref.current; if (i && i.complete && !i.naturalWidth) setBad(true); }, []);
  if (bad) return <span className="v2-lw-name">{name}</span>;
  return <img ref={ref} src={src} alt={hidden ? '' : name} onError={() => setBad(true)} decoding="async" />;
}

interface LogoWallProps {
  items: LogoItem[];
  label?: string;
  speed?: number;
  className?: string;
}

export default function LogoWall({ items, label, speed = 46, className = '' }: LogoWallProps) {
  const row = (k: number) => items.map((l) => {
    const hidden = k > 0;
    const inner = <Logo name={l.name} src={l.src} hidden={hidden} />;
    return l.href ? (
      <a key={k + l.name} href={l.href} className="v2-lw-i" aria-hidden={hidden || undefined} tabIndex={hidden ? -1 : undefined}>{inner}</a>
    ) : (
      <span key={k + l.name} className="v2-lw-i" aria-hidden={hidden || undefined}>{inner}</span>
    );
  });
  return (
    <div className={'v2-lw' + (className ? ' ' + className : '')} role="group" aria-label={label}>
      <div className="v2-lw-track" style={{ '--lw-t': speed + 's' } as CSSProperties}>
        <div className="v2-lw-half">{row(0)}{row(1)}</div>
        <div className="v2-lw-half" aria-hidden="true">{row(2)}{row(3)}</div>
      </div>
    </div>
  );
}
