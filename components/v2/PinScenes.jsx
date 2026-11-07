'use client';
/* PinScenes (components/v2, owned by the Wave 2 "Proof" chat). The Apple chapter pattern (VISION.md motion 1): a
   sticky, scroll-driven scene where the words pin on one side while the visual changes on the other, and one chapter
   comes in as the last goes out. Desktop pins; phones (≤900px) get the same chapters stacked, each with its visual.
   Usage:
     <PinScenes
       label="How a key is kept"                 // aria-label of the section
       chapters={[{ title: 'Edge', kicker: 'a caption under the title', body: <p>…</p> }, …]}
                                                  // (JAMES.md: nothing sits above a headline, so kicker renders below)
       visual={(at, progress) => <Stage at={at} />}   // at = active chapter; progress = MotionValue 0..1 over the scene
       flip                                       // visual on the left, words on the right
       dark                                       // the page's one dark room (header turns dark over it)
       per={80}                                   // svh of scrolling per chapter (capped so the scene is ≤ 250svh)
     />
   Every chapter's words are in the HTML; the server renders visual(0) only, so words a visual shows for a later
   chapter must also be in that chapter's body (or the visual renders every state, hidden). Keyboard focus inside a chapter scrolls the scene to it. Reduced motion:
   chapters swap without movement. Page CSS can style .pf-pin-* under its own section class. */
import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValueEvent, useScroll } from 'motion/react';
import './ProofScale.css';
import './PinScenes.css';

function useWide() {
  const [wide, setWide] = useState(true);
  useEffect(() => {
    const m = matchMedia('(min-width: 901px)');
    const on = () => setWide(m.matches);
    on();
    m.addEventListener('change', on);
    return () => m.removeEventListener('change', on);
  }, []);
  return wide;
}

export default function PinScenes({ chapters, visual, label, className = '', flip = false, dark = false, per = 80, id }) {
  const ref = useRef(null);
  const wide = useWide();
  const [at, setAt] = useState(0);
  const n = chapters.length;
  // BRIEF-v3 §8.3: a pinned scene's outer section is 250svh at most, so each beat gets at most 150svh / n
  const step = Math.min(per, 150 / n);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  useMotionValueEvent(scrollYProgress, 'change', (p) => setAt(Math.min(n - 1, Math.max(0, Math.floor(p * n * 0.999)))));

  // a keyboard user tabbing into a chapter that is not on screen: bring the scene to it
  const go = (i) => {
    const el = ref.current;
    if (!el || !wide) return;
    const top = el.getBoundingClientRect().top + scrollY;
    const span = el.offsetHeight - innerHeight;
    const y = top + span * ((i + 0.5) / n);
    window.__lenis ? window.__lenis.scrollTo(y, { immediate: true, force: true }) : scrollTo(0, y);
  };

  if (!wide) {
    return (
      <section ref={ref} id={id} className={'pf-pin-flat ' + className} aria-label={label} data-room={dark ? 'dark' : undefined}>
        <div className="pf-wrap">
          {chapters.map((c, i) => (
            <article key={i} className="pf-pin-flat-c">
              <div className="pf-pin-t-in">
                {c.title && <h3 className="pf-head">{c.title}</h3>}
                {c.kicker && <p className="pf-kick pf-pin-cap">{c.kicker}</p>}
                {c.body}
              </div>
              <div className="pf-pin-flat-v">{visual(i, scrollYProgress)}</div>
            </article>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} id={id} className={'pf-pin ' + (flip ? 'flip ' : '') + className} style={{ '--n': n, '--per': step + 'svh' }} aria-label={label} data-room={dark ? 'dark' : undefined}>
      {/* JS off: no pinning, every chapter reads in order */}
      <noscript dangerouslySetInnerHTML={{ __html: '<style>.pf-pin{height:auto!important}.pf-pin-stick{position:static!important;height:auto!important;padding:120px 0}.pf-pin-texts{display:block!important}.pf-pin-t{opacity:1!important;transform:none!important;margin-bottom:64px}</style>' }} />
      <div className="pf-pin-stick">
        <div className="pf-wrap pf-pin-grid">
          <div className="pf-pin-copy">
            <div className="pf-pin-meter" aria-hidden="true">
              <span className="pf-mono">{String(at + 1).padStart(2, '0')}</span>
              <i><motion.b style={{ scaleY: scrollYProgress }} /></i>
              <span className="pf-mono">{String(n).padStart(2, '0')}</span>
            </div>
            <div className="pf-pin-texts">
              {chapters.map((c, i) => (
                <article key={i} className="pf-pin-t" data-on={i === at} data-past={i < at} onFocusCapture={() => i !== at && go(i)}>
                  <div className="pf-pin-t-in">
                    {c.title && <h3 className="pf-head">{c.title}</h3>}
                    {c.kicker && <p className="pf-kick pf-pin-cap">{c.kicker}</p>}
                    {c.body}
                  </div>
                </article>
              ))}
            </div>
          </div>
          <div className="pf-pin-vis">{visual(at, scrollYProgress)}</div>
        </div>
      </div>
    </section>
  );
}
