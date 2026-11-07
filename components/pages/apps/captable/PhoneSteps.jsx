'use client';
/* Phone chapters for /captable (<= 900px): one compact table pins under the header and the six chapters scroll
   under it. The chapter crossing the reading line lights its rows in the one table (01 / 06 … 06 / 06), so one
   object changes instead of six copies of it stacking. Every word stays in the HTML. */
import { useEffect, useRef, useState } from 'react';

const two = (n) => String(n).padStart(2, '0');

export default function PhoneSteps({ items, stage, label, children }) {
  const ref = useRef(null);
  const [at, setAt] = useState(0);
  useEffect(() => {
    const els = [...ref.current.querySelectorAll('[data-pch]')];
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setAt(+e.target.dataset.pch)), { rootMargin: '-58% 0px -40% 0px' });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items.length]);
  return (
    <section ref={ref} className="ct-pch" aria-label={label}>
      {children}
      <div className="bz-wrap ct-pch-wrap">
        <div className="ct-pch-pin">{stage(at)}</div>
        <ol className="ct-pch-list">
          {items.map((it, i) => (
            <li key={i} data-pch={i} className={'ct-pch-i' + (at === i ? ' on' : i < at ? ' past' : '')} aria-current={at === i ? 'step' : undefined}>
              <h3 className="bz-headline">{it.t}</h3>
              <p className="bz-kick"><span className="x-mono">{two(i + 1)} / {two(items.length)}</span></p>
              {it.d && <p className="bz-body">{it.d}</p>}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
