'use client';
/* PinScenes: sticky, scroll-scrubbed chapters (VISION.md motion 1, the Apple product-page pattern). The words pin on
   one side while the visual on the other changes: each scene's words come in as the last ones go out, and its visual
   wipes up over the previous one. A thin rail scrubs with the scroll.
   Usage:
     <PinScenes label="How the team works" scenes={[{ key, kicker, title, body, visual }]} flip={false} />
     - title / body / visual are nodes; kicker is short text. `flip` puts the visual on the left.
   Phones (≤900px) and reduced motion get the scenes stacked, each with its own visual (CSS only, no layout jump).
   Every scene's words are in the HTML. Needs '../v2/vc-type.css'. Page-local kit of the Wave 2 Company chat (main's components/v2/PinScenes is the Proof chat's, with a different API). */
import { useRef, useState } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'motion/react';
import './PinScenes.css';

const EASE = [0.16, 1, 0.3, 1];
// JS off: every scene shows, stacked like the phone layout (PLAN-COMPONENTS 2.3 "JS off legible")
const NOJS = { __html: '<style>.vc-pin{height:auto!important}.vc-pin-sticky{position:static!important;height:auto!important;display:block!important}.vc-pin-stage{display:block!important}.vc-pin-rail{display:none!important}.vc-pin-scene{display:flex!important;flex-direction:column;gap:28px;padding:56px 0}.vc-pin-t,.vc-pin-v{opacity:1!important;transform:none!important;clip-path:none!important}.vc-pin-t{padding-left:0!important}</style>' };

export default function PinScenes({ scenes, label, flip = false, className = '' }) {
  const ref = useRef(null);
  const n = scenes.length;
  const [at, setAt] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    const i = Math.min(n - 1, Math.max(0, Math.floor(p * n * 0.999)));
    if (i !== at) setAt(i);
  });
  return (
    <section ref={ref} className={'vc-pin' + (flip ? ' flip' : '') + ' ' + className} style={{ '--n': n }} aria-label={label}>
      <noscript dangerouslySetInnerHTML={NOJS} />
      <div className="vc-pin-sticky">
        <div className="vc-pin-stage vc-wrap">
          <div className="vc-pin-rail" aria-hidden="true">
            <motion.i style={{ scaleY: scrollYProgress }} />
          </div>
          {scenes.map((s, i) => {
            const st = i === at ? 'on' : i < at ? 'past' : 'next';
            return (
              <div className="vc-pin-scene" key={s.key || i}>
                <motion.div
                  className="vc-pin-t"
                  aria-hidden={st !== 'on' ? true : undefined}
                  initial={false}
                  animate={st === 'on' ? { opacity: 1, y: 0 } : { opacity: 0, y: st === 'past' ? -48 : 48 }}
                  transition={{ duration: st === 'on' ? 0.7 : 0.4, ease: EASE, delay: st === 'on' ? 0.12 : 0 }}
                >
                  {s.kicker && <p className="vc-kick acc">{s.kicker}</p>}
                  {s.title}
                  {s.body}
                </motion.div>
                <motion.div
                  className="vc-pin-v"
                  style={{ zIndex: i }}
                  initial={false}
                  animate={{
                    clipPath: st === 'next' ? 'inset(100% 0% 0% 0% round 28px)' : 'inset(0% 0% 0% 0% round 28px)',
                    scale: st === 'past' ? 0.94 : 1,
                    opacity: st === 'past' ? 0 : 1,
                  }}
                  transition={{ duration: st === 'past' ? 0.9 : 0.85, ease: EASE }}
                >
                  {s.visual}
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
