'use client';
/* Gateway's own pinned chapters (page-local, from the shared PinChapters, prefix gwc-).
   Desktop (> 900px): the section is n screens tall; a sticky stage holds one chapter's words at a time beside the
   scene that acts that chapter out. The dots show the chapter's title on hover or focus, press, and jump to it.
   Phone: one short scene sticks under the header and swaps as each chapter's words cross the middle of the screen, so
   one thing comes in as one goes out; the words scroll beneath it on an opaque stage, never through it.
   Every chapter's words and its "01 / 06" caption are in the HTML. Reduced motion: chapters swap without moving. */
import { useEffect, useRef, useState } from 'react';
import { useScroll, useMotionValueEvent } from 'motion/react';
import './GwChapters.css';

const pad = (n) => String(n).padStart(2, '0');

export default function GwChapters({ items, scene, label, className = '' }) {
  const n = items.length;
  const ref = useRef(null);
  const arts = useRef([]);
  const [at, setAt] = useState(0);
  const [wide, setWide] = useState(true);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  useEffect(() => {
    const m = matchMedia('(min-width: 901px)');
    const f = () => setWide(m.matches);
    f();
    m.addEventListener('change', f);
    return () => m.removeEventListener('change', f);
  }, []);

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    if (!wide) return;
    setAt(Math.max(0, Math.min(n - 1, Math.floor(p * n * 0.9999))));
  });

  // phone: the chapter whose words cross the lower middle of the screen is the one the scene shows
  useEffect(() => {
    if (wide) return;
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setAt(+e.target.dataset.i)), { rootMargin: '-62% 0px -30% 0px' });
    arts.current.forEach((a) => a && io.observe(a));
    return () => io.disconnect();
  }, [wide]);

  const go = (i) => {
    const el = ref.current;
    if (!el) return;
    if (!wide) { arts.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
    const top = el.getBoundingClientRect().top + scrollY;
    const y = top + ((i + 0.5) / n) * (el.offsetHeight - innerHeight);
    window.__lenis ? window.__lenis.scrollTo(y, { duration: 1.1 }) : scrollTo({ top: y, behavior: 'smooth' });
  };

  return (
    <section ref={ref} className={'gwc ' + className} style={{ '--n': n }} aria-label={label}>
      <div className="gwc-stage">
        <div className="gwc-in">
          <div className="gwc-vis">{scene(at)}</div>
          <div className="gwc-copy">
            <div className="gwc-arts">
              {items.map(([t, d], i) => (
                <article key={t} ref={(el) => (arts.current[i] = el)} data-i={i} className="gwc-art" data-on={i === at ? '' : undefined} data-past={i < at ? '' : undefined}>
                  <h3 className="gwc-t"><span>{t}</span></h3>
                  <p className="gwc-n v2-kick">{pad(i + 1)} / {pad(n)}</p>
                  <p className="gwc-d">{d}</p>
                </article>
              ))}
            </div>
            <nav className="gwc-dots" aria-label={(label || 'Chapters') + ': go to'}>
              {items.map(([t], i) => (
                <button key={t} type="button" data-sound="tick" aria-label={t} aria-current={i === at ? 'step' : undefined} onClick={() => go(i)}>
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
