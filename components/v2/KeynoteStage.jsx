'use client';
/* KeynoteStage: the Stage hero (VISION motion 2). Huge type plays in line by line; the hero object starts huge and
   settles into its place as you scroll (scale and position only), like an apple.com product page.
   Owned by the Cloud 1 chat.
   Usage:
     <KeynoteStage kick="AI inference engine" title={['Hanzo Engine']} lede="…" acts={[['Get started', '/docs'], ['GitHub', url]]}
                   look="split" from={1.32}>
       <MyProductUI />
     </KeynoteStage>
   - look: 'split' (title on 8 columns, lede and actions on the right 4, the object full width below) or
           'side' (title and lede on 5 columns, the object on 7 bleeding to the right edge).
   - from: the object's starting scale (1.1–1.25). Phones use a gentler start automatically. Do not use motion
     layoutId/layout animations inside the object (the scroll scale breaks layout projection); use CSS state.
   - acts: [label, to]; the first is the primary (magnetic, and the phone thumb bar's action). meta: a small line under.
   - title: an array of lines. Keep each line 12–18 characters so it breaks strongly.
   Reduced motion: the object is simply in place. Nothing animates off screen. */
import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';
import { EASE, Magnetic } from '../ui';
import { A } from '../kit';
import KeynoteLines from './KeynoteLines';
import { useWide } from './KeynoteChapters';
import './Keynote.css';
import './KeynoteStage.css';

export default function KeynoteStage({ kick, title, lede, acts = [], meta, look = 'split', from = 1.15, children, className = '', size = '' }) {
  const sec = useRef(null);
  const calm = useReducedMotion();
  const wide = useWide();
  const { scrollYProgress: p } = useScroll({ target: sec, offset: ['start start', 'end start'] });
  const f = wide ? from : 1 + (from - 1) * 0.25;
  const scale = useTransform(p, [0, 0.42], [f, 1], { clamp: true });
  const y = useTransform(p, [0, 0.42], [wide ? (look === 'side' ? '6%' : '8%') : '4%', '0%'], { clamp: true });
  const fade = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } };
  return (
    <section ref={sec} className={`kns ${look} ${className}`} data-morph-target="">
      <div className="kn-wrap kn-grid kns-g">
        <div className="kns-t">
          {kick && <motion.p className="kn-kick ac" {...(calm ? {} : fade)} transition={{ duration: 0.8, ease: EASE }}>{kick}</motion.p>}
          <KeynoteLines as="h1" mount className={'kn-display ' + size} lines={title} delay={0.08} />
        </div>
        <div className="kns-r">
          {lede && <motion.p className="kn-lede" {...(calm ? {} : fade)} transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}>{lede}</motion.p>}
          {acts.length > 0 && (
            <motion.div className="kn-acts kns-acts" {...(calm ? {} : fade)} transition={{ duration: 0.9, ease: EASE, delay: 0.48 }}>
              {acts.map(([t, to], i) => i === 0
                ? <Magnetic key={t} strength={0.22}><A to={to} className="kn-btn solid" data-thumb={t}>{t}</A></Magnetic>
                : <A key={t} to={to} className="kn-btn">{t}</A>)}
            </motion.div>
          )}
          {meta && <motion.div className="kns-meta" {...(calm ? {} : fade)} transition={{ duration: 0.9, ease: EASE, delay: 0.6 }}>{meta}</motion.div>}
        </div>
        <div className="kns-obj-wrap">
        <motion.div className="kns-obj-in" initial={calm ? false : { opacity: 0, y: 80 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.3, ease: EASE, delay: 0.25 }}>
          <motion.div className="kns-obj" style={calm ? undefined : { scale, y }}>
            {children}
          </motion.div>
        </motion.div>
        </div>
      </div>
    </section>
  );
}
