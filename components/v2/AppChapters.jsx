'use client';
/* AppChapters: Apple-style sticky chapters (VISION.md motion 1). Owner: the Wave 1 Apps chat. Used by /chat.
   Usage:
     <AppChapters label="What Hanzo Chat does" dark head={<h2>…</h2>}
       items={[{ key: 'route', title: 'The right model, every time', body: '…', icon: <svg/>, art: <MyArt /> }, …]} />
   Desktop: the copy pins on the left while the scroll moves you through the chapters; one comes in as the last goes
   out. The art on the right changes with a clip-path wipe (the next scene wipes up from below, the last wipes out above),
   and a hairline under the index fills with the scroll. The index buttons jump to a chapter.
   Phones and narrow windows: the same DOM reflows into a plain vertical story, copy then art, one chapter after another.
   Art that is off screen, or not the current chapter, gets [data-off] so its CSS loops pause. Reduced motion: the
   chapters still change with the scroll, with no wipes. Every chapter's words are in the HTML at all times. */
import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValueEvent, useScroll, useTransform } from 'motion/react';
import './AppChapters.css';

export default function AppChapters({ items, head, label, dark = false, className = '', id }) {
  const track = useRef(null);
  const box = useRef(null);
  const [at, setAt] = useState(0);
  const n = items.length;
  const { scrollYProgress } = useScroll({ target: track, offset: ['start start', 'end end'] });
  useMotionValueEvent(scrollYProgress, 'change', (v) => setAt(Math.min(n - 1, Math.max(0, Math.floor(v * n)))));
  const fill = useTransform(scrollYProgress, (v) => Math.min(1, Math.max(0, v))); // a function, so it is never handed to a native scroll timeline

  // pause the art that is not on screen (phones) or not the current chapter (desktop)
  useEffect(() => {
    const arts = [...(box.current?.querySelectorAll('.v2a-ch-art') || [])];
    const io = new IntersectionObserver((es) => es.forEach((e) => e.target.toggleAttribute('data-off', !e.isIntersecting)), { threshold: 0.15 });
    arts.forEach((a) => io.observe(a));
    return () => io.disconnect();
  }, []);

  const jump = (i) => {
    const t = track.current;
    if (!t) return;
    const top = t.getBoundingClientRect().top + scrollY;
    const y = top + ((i + 0.5) / n) * (t.offsetHeight - innerHeight);
    if (window.__lenis) window.__lenis.scrollTo(y, { duration: 1.1 });
    else scrollTo({ top: y, behavior: 'smooth' });
  };

  return (
    <section className={'v2a-ch' + (dark ? ' dark' : '') + ' ' + className} data-room={dark ? 'dark' : undefined} aria-label={label} id={id} ref={box}>
      {head}
      <div className="v2a-ch-track" ref={track} style={{ '--n': n }}>
        <div className="v2a-ch-pin">
          <div className="v2a-wrap v2a-ch-grid">
            {items.map((it, i) => (
              <div key={it.key} className={'v2a-ch-item' + (i === at ? ' on' : i < at ? ' past' : '')}>
                <div className="v2a-ch-txt">
                  <p className="v2a-ch-n x-mono">{String(i + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}</p>
                  <h3 className="v2a-ch-t">{it.title}</h3>
                  <p className="v2a-ch-b">{it.body}</p>
                  {it.more}
                </div>
                <div className="v2a-ch-art" aria-hidden="true"><div className="v2a-ch-art-in">{it.art}</div></div>
              </div>
            ))}
            <nav className="v2a-ch-nav" aria-label={label ? label + ', chapters' : 'Chapters'}>
              <div className="v2a-ch-nav-row">
                {items.map((it, i) => (
                  <button key={it.key} type="button" aria-current={i === at ? 'step' : undefined} onClick={() => jump(i)}>
                    {it.icon}<span>{it.short || it.title}</span>
                  </button>
                ))}
              </div>
              <i className="v2a-ch-bar" aria-hidden="true"><motion.b style={{ scaleX: fill }} /></i>
            </nav>
          </div>
        </div>
      </div>
    </section>
  );
}
