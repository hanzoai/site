'use client';
/* KeynoteStage: the Stage hero (VISION motion 2). Huge type cuts in line by line at first paint; the hero object
   starts big and settles into its place as you scroll (scale and position only), like an apple.com product page.
   Owned by the Cloud 1 chat.
   Usage:
     <KeynoteStage kick="AI inference engine" title={['Hanzo Engine']} lede="…" acts={[['Get started', '/docs'], ['GitHub', url]]}
                   look="split" from={1.12} cta="engine.hero">
       <MyProductUI />
     </KeynoteStage>
   - look: 'split' (title on 8 columns, lede and actions on the right 4, the object full width below) or
           'side' (title and lede on 5 columns, the object on 7 bleeding to the right edge).
   - from: the object's starting scale (1.1–1.25). Phones use a gentler start automatically. Do not use motion
     layoutId/layout animations inside the object (the scroll scale breaks layout projection); use CSS state.
   - cta: pass '<page>.hero' (the data-cta id of the ask). acts: [label, to]; the first is the page's one ask (the kit's solid <Cta>, magnetic, data-thumb for the sticky ask
     bar, data-cta = cta); the rest are text-link <Cta>s (the header's "Try Hanzo" is always solid, so one own solid).
     When the ask is the header's own "Try Hanzo" it is drawn quiet, so two identical solid buttons never share a view.
   - kick: Hanzo's small label. It is never set above the h1 (a banned tell); it sits under the actions with meta.
   - pause: true gives the demo its pause control (WCAG 2.2.2), in the flow beside the meta line (first in the DOM,
     never over the product). Read it with useStagePause() and run JS loops only while !paused; CSS loops inside the
     object hold their frame by themselves.
   Scale rhythm: the h1 rests at 52px (40px on phones); the product object is the one big thing and settles as you scroll.
   Everything on the first screen arrives by CSS at first paint, without waiting for the page's script; with JS off it
   simply stands in place. Reduced motion: the object is in place. */
import { createContext, useContext, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';
import { Magnetic } from '../ui';
import { Cta } from '../kit';
import KeynoteLines from './KeynoteLines';
import { useWide } from './KeynoteChapters';
import './Keynote.css';
import './KeynoteStage.css';

const Paused = createContext(false);
/* true while the visitor has paused the hero's live demo */
export const useStagePause = () => useContext(Paused);

export default function KeynoteStage({ kick, title, lede, acts = [], meta, look = 'split', from = 1.15, children, className = '', size = '', cta = 'hero', pause = true }) {
  const sec = useRef(null);
  const calm = useReducedMotion();
  const wide = useWide();
  const [paused, setPaused] = useState(false);
  const { scrollYProgress: p } = useScroll({ target: sec, offset: ['start start', 'end start'] });
  const f = wide ? from : 1 + (from - 1) * 0.25;
  const scale = useTransform(p, [0, 0.42], [f, 1], { clamp: true });
  const y = useTransform(p, [0, 0.42], [wide ? (look === 'side' ? '4%' : '5%') : '3%', '0%'], { clamp: true });
  return (
    <section ref={sec} className={`kns ${look} ${className}`} data-morph-target="" data-paused={paused ? '' : undefined}>
      <div className="kn-wrap kn-grid kns-g">
        <div className="kns-t">
          <KeynoteLines as="h1" mount className={'kn-display ' + size} lines={title} delay={0.04} />
        </div>
        <div className="kns-r">
          {lede && <p className="kn-lede kns-in" style={{ '--d': '.3s' }}>{lede}</p>}
          {acts.length > 0 && (
            <div className="kn-acts kns-acts kns-in" style={{ '--d': '.42s' }}>
              {acts.map(([t, to], i) => i === 0
                ? <Magnetic key={t} strength={0.22}><Cta to={to} id={cta} thumb size="md" kind={t === 'Try Hanzo' ? 'quiet' : 'solid'}>{t}</Cta></Magnetic>
                : <Cta key={t} to={to} kind="link" id={cta + '-' + (i + 1)}>{t}</Cta>)}
            </div>
          )}
          {(kick || meta || pause) && (
            <div className="kns-meta kns-in" style={{ '--d': '.54s' }}>
              {pause && (
                <button type="button" className="kn-pause kns-pause" aria-pressed={paused} aria-label="Pause" onClick={() => setPaused((v) => !v)}>
                  {paused
                    ? <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M4.5 3v10l8.5-5z" fill="currentColor" /></svg>
                    : <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><rect x="4" y="3" width="2.6" height="10" rx="1" fill="currentColor" /><rect x="9.4" y="3" width="2.6" height="10" rx="1" fill="currentColor" /></svg>}
                </button>
              )}
              <div className="kns-meta-t">
                {kick && <p className="kn-kick kns-k">{kick}</p>}
                {meta}
              </div>
            </div>
          )}
        </div>
        <div className="kns-obj-wrap">
          <div className="kns-obj-in">
            <motion.div className="kns-obj" style={calm ? undefined : { scale, y }}>
              <Paused.Provider value={paused}>{children}</Paused.Provider>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
