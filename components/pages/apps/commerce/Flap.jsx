'use client';
/* Commerce's flip board tiles (page-local). Each character sits on its own dark tile; when the text changes, every
   tile whose character changes flips through a few letters of the board's alphabet and lands on the new one, left to
   right, like a departure board. Reduced motion: the new text appears at once. Screen readers get the plain text. */
import { useEffect, useRef, useState } from 'react';

const ABC = " abcdefghijklmnopqrstuvwxyz{}/'ABCDEFGHIJKLMNOPQRSTUVWXYZ.0123456789";

function Cell({ ch, i, calm }) {
  const [c, setC] = useState(ch);
  const [n, setN] = useState(0);
  const now = useRef(ch);
  useEffect(() => {
    if (now.current === ch) return;
    if (calm) { now.current = ch; setC(ch); return; }
    const from = Math.max(0, ABC.indexOf(now.current));
    const steps = 3 + (i % 3);
    const ts = [];
    for (let k = 1; k <= steps; k++) {
      const v = k === steps ? ch : ABC[(from + k * 7) % ABC.length];
      ts.push(setTimeout(() => { now.current = v; setC(v); setN((x) => x + 1); }, i * 26 + k * 62));
    }
    return () => ts.forEach(clearTimeout);
  }, [ch, i, calm]);
  return <span className="cm-fl"><span key={n} className={'cm-fl-c' + (n ? ' go' : '')}>{c === ' ' ? ' ' : c}</span></span>;
}

export default function Flap({ text, len, calm, className = '' }) {
  const s = String(text).slice(0, len).padEnd(len, ' ');
  return (
    <span className={'cm-flap ' + className}>
      <span className="x-sr">{text}</span>
      <span className="cm-flap-t" aria-hidden="true">{[...s].map((ch, i) => <Cell key={i} ch={ch} i={i} calm={calm} />)}</span>
    </span>
  );
}
