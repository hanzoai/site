'use client';
/* KeynoteLines: kinetic type. Each line of a headline rises out of its own mask, once (VISION motion 4).
   Owned by the Cloud 1 chat.
   Usage: <KeynoteLines as="h1" className="kn-display" lines={['Hanzo Engine', 'in one binary']} mount />
   - lines: an array (one entry per line) or a string (one line). The full text is also in the heading for readers.
   - mount: play at first paint (heroes). It is pure CSS, so the title cuts in without waiting for the page's script.
     Otherwise it plays the first time the heading is seen.
   - delay: seconds before the first line; lines follow 90 ms apart.
   With JS off every line simply stands in place; reduced motion shows the final state (site-wide rule). */
import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import './Keynote.css';

interface KeynoteLinesProps {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  lines: string | readonly string[];
  className?: string;
  delay?: number;
  mount?: boolean;
  id?: string;
}

export default function KeynoteLines({ as = 'h2', lines, className = '', delay = 0, mount = false, id }: KeynoteLinesProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    if (mount || seen) return;
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') { setSeen(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, [mount, seen]);
  const L: readonly string[] = typeof lines === 'string' ? [lines] : lines;
  const Tag = as;
  return (
    <Tag ref={ref} id={id} className={'knl ' + (mount ? 'load ' : seen ? 'in ' : '') + className} style={delay ? { '--knl-d': delay + 's' } as CSSProperties : undefined}>
      <span className="x-sr">{L.join(' ')}</span>
      <span aria-hidden="true" className="knl-in">
        {L.map((t, i) => (
          <span className="knl-row" key={i}><span className="knl-t" style={{ '--i': i } as CSSProperties}>{t}</span></span>
        ))}
      </span>
    </Tag>
  );
}
