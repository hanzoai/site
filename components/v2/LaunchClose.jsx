'use client';
/* LaunchClose: the one call to action that ends a launch page. "Get X" set huge over the page's own living Sigil
   (drawn from the product's real figures), the one-line tagline, licence and source as quiet facts, and one primary
   button that leans toward the hand (magnetic). Hanzo's words and links only.
   Usage:
     <LaunchClose name="MQ" tag="Message queue" seed="mq" data={[6379, 10, 100, 60000]}
                  repo={['hanzoai', 'https://github.com/hanzoai']} stars="4 stars" license="Apache-2.0"
                  self="https://…" deploy="https://platform.hanzo.ai/deploy">{optional extra line}</LaunchClose>
   seed/data: the page's slug and its figures from components/pages/cloud/family.js (never invented). Owned by Cloud 3. */
import { useRef } from 'react';
import { motion, useSpring, useReducedMotion } from 'motion/react';
import Sigil from '../Sigil';
import { A } from '../kit';
import LineMask from './LineMask';
import './LaunchType.css';
import './LaunchClose.css';

const Gh = () => <svg viewBox="0 0 16 16" width="15" height="15" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" /></svg>;
const Arr = () => <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>;

function Pull({ children }) {
  const calm = useReducedMotion();
  const x = useSpring(0, { stiffness: 300, damping: 30 });
  const y = useSpring(0, { stiffness: 300, damping: 30 });
  const ref = useRef(null);
  return (
    <motion.span ref={ref} className="lx-close-pull" style={{ x, y }}
      onPointerMove={(e) => { if (calm || e.pointerType !== 'mouse') return; const r = ref.current.getBoundingClientRect(); x.set((e.clientX - r.left - r.width / 2) * 0.28); y.set((e.clientY - r.top - r.height / 2) * 0.36); }}
      onPointerLeave={() => { x.set(0); y.set(0); }}>
      {children}
    </motion.span>
  );
}

export default function LaunchClose({ name, tag, seed, data = [], repo = ['hanzoai', 'https://github.com/hanzoai'], stars, license = 'Apache-2.0', deploy = 'https://platform.hanzo.ai/deploy', self, children, className = '' }) {
  return (
    <section className={'lx-close ' + className}>
      <Sigil seed={seed || name} data={data} className="lx-close-sigil" />
      <div className="lx-wrap lx-close-in">
        <LineMask as="h2" className="lx-display lx-close-h" lines={[`Get ${name}`]} inView />
        {tag && <p className="lx-lede lx-close-tag">{tag}</p>}
        <div className="lx-close-acts">
          {deploy && <Pull><A to={deploy} className="lx-cta" data-thumb="Deploy to Cloud">Deploy to Cloud<Arr /></A></Pull>}
          {self && <A to={self} className="lx-ghost">Self-host</A>}
        </div>
        <ul className="lx-close-facts">
          {license && <li><span>License:</span> {license}</li>}
          {repo && <li><A to={repo[1]} className="lx-close-repo"><Gh />{repo[0]}{stars && <em>{stars}</em>}</A></li>}
        </ul>
        {children}
      </div>
    </section>
  );
}
