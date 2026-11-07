'use client';
/* Chapters: the Apple product-page backbone. One idea per screen: the text pins on one side while the picture on the
   other changes, scrubbed to the scroll, each new picture wiping up over the last as its words take over.
   Owned by the Zen-names chat (wave 2, group 12); partner of Launch.jsx.

   Usage:
     <Chapters id="eo-ch" label="Three tiers" flip={false} items={[
       { k: 'Enso Flash', title: 'At volume.', body: <p>…</p>, art: <MyPicture /> }, …
     ]} />
   - items: k (a short label for the chapter rail; no eyebrow is drawn above the title), rail (overrides k on the rail), title (heading text), body (node), art (node drawn inside a 28px frame; it may move by itself,
     or a function (on) => node, where on is true while its chapter is the one being read).
   - flip puts the picture on the left. The chapter rail on the side jumps to a chapter (buttons, keyboard).
   - Phones and reduced motion get a plain vertical story (picture, then words); every word is always in the HTML. */
import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent, useReducedMotion } from 'motion/react';
import { clamp01 } from '../Launch';

function Layer({ p, i, n, live, children }) {
  const clip = useTransform(p, (v) => {
    if (!live || i === 0) return 'none';
    const k = clamp01((v * n - i + 0.2) / 0.36);
    const e = 1 - Math.pow(1 - k, 3);
    return `inset(${((1 - e) * 100).toFixed(2)}% 0 0 0 round 0)`;
  });
  const y = useTransform(p, (v) => (live && i > 0 ? `${(clamp01(1 - (v * n - i + 0.2) / 0.36) * 8).toFixed(2)}%` : '0%'));
  return (
    <motion.div className="lv-ch-art" style={{ clipPath: clip, zIndex: i, '--o': i }}>
      <motion.div className="lv-ch-art-in" style={{ y }}>{children}</motion.div>
    </motion.div>
  );
}

export default function Chapters({ id, label, items, flip, className = '' }) {
  const sec = useRef(null);
  const calm = useReducedMotion();
  const [wide, setWide] = useState(false);
  const [at, setAt] = useState(0);
  const n = items.length;
  useEffect(() => {
    const q = matchMedia('(min-width: 901px)');
    const f = () => setWide(q.matches);
    f(); q.addEventListener('change', f);
    return () => q.removeEventListener('change', f);
  }, []);
  const live = wide && !calm;
  const { scrollYProgress: p } = useScroll({ target: sec, offset: ['start 60px', 'end end'] });
  const bar = useTransform(p, [0, 1], [0, 1]);
  useMotionValueEvent(p, 'change', (v) => setAt(Math.min(n - 1, Math.max(0, Math.floor(v * n)))));
  const go = (i) => {
    const el = sec.current;
    const top = el.getBoundingClientRect().top + scrollY - 60;
    const run = el.offsetHeight - (innerHeight - 60);
    const y = top + ((i + 0.5) / n) * run;
    window.__lenis ? window.__lenis.scrollTo(y) : scrollTo({ top: y, behavior: 'smooth' });
  };
  return (
    <section id={id} className={'lv-ch ' + (flip ? 'flip ' : '') + className} ref={sec} style={{ '--n': n }} data-live={live ? '' : undefined} aria-label={label}>
      <div className="lv-ch-pin">
        <div className="x-wrap lv-ch-grid">
          <div className="lv-ch-words">
            <div className="lv-ch-texts">
              {items.map((c, i) => (
                <article key={c.title} className="lv-ch-t" style={{ '--o': i }} data-on={!live || i === at ? '' : undefined} aria-hidden={live && i !== at ? 'true' : undefined}>
                  <h3 className="lv-ch-h"><span className="lv-ln"><span>{c.title}</span></span></h3>
                  <div className="lv-ch-b">{c.body}</div>
                </article>
              ))}
            </div>
            {live && (
              <nav className="lv-ch-rail" aria-label={label + ': chapters'}>
                <motion.i className="lv-ch-bar" style={{ scaleY: bar }} aria-hidden="true" />
                {items.map((c, i) => (
                  <button key={c.title} type="button" aria-current={i === at ? 'step' : undefined} onClick={() => go(i)}>
                    <span className="mb-tnum">{String(i + 1).padStart(2, '0')}</span>{c.rail || c.k}
                  </button>
                ))}
              </nav>
            )}
          </div>
          <div className="lv-ch-stack">
            {items.map((c, i) => <Layer key={c.title} p={p} i={i} n={n} live={live}>{typeof c.art === 'function' ? c.art(!live || i === at) : c.art}</Layer>)}
          </div>
        </div>
      </div>
    </section>
  );
}
