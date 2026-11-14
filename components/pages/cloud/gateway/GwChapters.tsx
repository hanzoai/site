'use client';
/* Gateway's own pinned chapters (page-local, from the shared PinChapters, prefix gwc-).
   One sticky stage at every width: the scene that acts the current chapter out, and that chapter's words, swapped one
   at a time as the section scrolls. Desktop (> 900px): scene left, words right. Phone: a short scene (about 40svh)
   at the top and the chapter's words below it; the words swap in place, so they never slide under the scene.
   The dots (desktop) preview their chapter's scene on hover or focus, show its title, press, and jump to it.
   Every chapter's words and its "01 / 06" caption are in the HTML (shown stacked with scripts off).
   Reduced motion: chapters swap without moving. */
import { useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { useScroll, useMotionValueEvent } from 'motion/react';
import './GwChapters.css';

const pad = (n: number) => String(n).padStart(2, '0');

interface GwChaptersProps {
  items: [string, string][];
  scene: (at: number) => ReactNode;
  label: string;
  className?: string;
}

export default function GwChapters({ items, scene, label, className = '' }: GwChaptersProps) {
  const n = items.length;
  const ref = useRef<HTMLElement>(null);
  const [at, setAt] = useState(0);
  const [peek, setPeek] = useState<number | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    setAt(Math.max(0, Math.min(n - 1, Math.floor(p * n * 0.9999))));
  });

  const go = (i: number) => {

    const el = ref.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + scrollY;
    const y = top + ((i + 0.5) / n) * (el.offsetHeight - innerHeight);
    window.__lenis ? window.__lenis.scrollTo(y, { duration: 1.1 }) : scrollTo({ top: y, behavior: 'smooth' });
  };

  const shown = peek ?? at;
  return (
    <section ref={ref} className={'gwc ' + className} style={{ '--n': n }} aria-label={label}>
      <div className="gwc-stage">
        <div className="gwc-in">
          <div className="gwc-vis" data-peek={peek !== null && peek !== at ? '' : undefined}>{scene(shown)}</div>
          <div className="gwc-copy">
            <div className="gwc-arts">
              {items.map(([t, d], i) => (
                <article key={t} data-i={i} className="gwc-art" data-on={i === at ? '' : undefined} data-past={i < at ? '' : undefined}>
                  <h3 className="gwc-t" id={'gwc-t-' + i}><span>{t}</span></h3>
                  <p className="gwc-n v2-kick">{pad(i + 1)} / {pad(n)}</p>
                  <p className="gwc-d">{d}</p>
                </article>
              ))}
            </div>
            <nav className="gwc-dots" aria-label={label} onPointerLeave={() => setPeek(null)}>
              {items.map(([t], i) => (
                <button
                  key={t}
                  type="button"
                  data-sound="tick"
                  aria-label={t}
                  aria-current={i === at ? 'step' : undefined}
                  onClick={() => { setPeek(null); go(i); }}
                  onPointerEnter={(e) => e.pointerType === 'mouse' && setPeek(i)}
                  onFocus={() => setPeek(i)}
                  onBlur={() => setPeek(null)}
                >
                  <i />
                  <span className="gwc-tip" aria-hidden="true">{t}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </section>
  );
}
