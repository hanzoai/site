'use client';
/* SafeStage: v2/KeynoteStage with one change, so the pages that use it hydrate cleanly under reduced motion.
   KeynoteStage reads motion's useReducedMotion() while rendering, which is null on the server and true on the first
   client render under reduced motion, so the hero object's transform differs and React logs a hydration error (the
   red "1 Issue" badge). This copy reads the kit's useCalm() instead (false on the server and the first render, then
   live). Same props, same markup, same CSS. Used by /crawl /dashboards /datastore /dns /edge /engine.
   Remove it and import KeynoteStage again once docs/build-notes/requests/reduced-motion-hydration.md lands in the shared file. */
import { createContext, useContext, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Magnetic, useCalm } from '../../ui';
import { Cta } from '../../kit';
import KeynoteLines from '../../v2/KeynoteLines';
import { useWide } from '../../v2/KeynoteChapters';
import '../../v2/Keynote.css';
import '../../v2/KeynoteStage.css';

const Paused = createContext(false);
/* true while the visitor has paused the hero's live demo */
export const useStagePause = () => useContext(Paused);

interface StageProps {
  kick?: ReactNode; title: string[]; lede?: ReactNode; acts?: [string, string][]; meta?: ReactNode; look?: 'split' | 'side'; from?: number;
  children?: ReactNode; className?: string; size?: string; cta?: string; pause?: boolean;
}

export default function SafeStage({ kick, title, lede, acts = [], meta, look = 'split', from = 1.15, children, className = '', size = '', cta = 'hero', pause = true }: StageProps) {
  const sec = useRef<HTMLElement>(null);

  const calm = useCalm();
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
