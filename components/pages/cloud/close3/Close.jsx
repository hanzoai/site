'use client';
/* The closing ask for /pubsub, /realtime and /s3: a page-local copy of components/v2/LaunchClose.jsx (same markup,
   classes and CSS), with one change: reduced motion is read after hydration (useCalm), so the server and the client
   render the same h2 and Next shows no hydration warning under prefers-reduced-motion. */
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import Sigil from '../../../Sigil';
import { A } from '../../../kit';
import { useCalm } from '../../../ui';
import '../../../v2/LaunchType.css';
import '../../../v2/LaunchClose.css';

const Gh = () => <svg viewBox="0 0 16 16" width="15" height="15" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" /></svg>;
export const Arr = () => <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>;

/* The magnetic ask: follows a fine pointer up to 22px, eased 300ms (no spring), home on leave. */
function Pull({ children, calm }) {
  const ref = useRef(null);
  const move = (e) => {
    if (calm || e.pointerType !== 'mouse') return;
    const r = ref.current.getBoundingClientRect();
    const dx = Math.max(-22, Math.min(22, (e.clientX - r.left - r.width / 2) * 0.22));
    const dy = Math.max(-22, Math.min(22, (e.clientY - r.top - r.height / 2) * 0.3));
    ref.current.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
  };
  const leave = () => { if (ref.current) ref.current.style.transform = ''; };
  return <span ref={ref} className="lx-close-pull" onPointerMove={move} onPointerLeave={leave}>{children}</span>;
}

export default function Close({ name, tag, seed, data = [], ask, cta, repo = ['hanzoai', 'https://github.com/hanzoai'], stars, license = 'Apache-2.0', deploy = 'https://platform.hanzo.ai/deploy', self, children, className = '' }) {
  const [label, to] = ask || ['Deploy to Cloud', deploy];
  const deployIsAsk = to === deploy;
  const ref = useRef(null);
  const calm = useCalm();
  // the heading grows from 26px to 64px as the close comes up the screen, then rests at 64
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start 35%'] });
  const scale = useTransform(scrollYProgress, [0, 1], [26 / 64, 1], { clamp: true });
  return (
    <section ref={ref} className={'lx-close ' + className}>
      <div className="lx-wrap lx-close-in">
        <div className="lx-close-copy">
          <motion.h2 className="lx-close-h" style={calm ? undefined : { scale }}>Get {name}</motion.h2>
          {tag && <p className="lx-lede lx-close-tag">{tag}</p>}
          <div className="lx-close-acts">
            <Pull calm={calm}><A to={to} className="lx-cta" data-cta={cta} data-thumb={label} data-cursor="">{label}<Arr /></A></Pull>
            {deploy && !deployIsAsk && <A to={deploy} className="lx-text">Deploy to Cloud</A>}
            {self && <A to={self} className="lx-text">Self-host</A>}
          </div>
          <ul className="lx-close-facts">
            {license && <li><span>License:</span> {license}</li>}
            {repo && <li><A to={repo[1]} className="lx-close-repo"><Gh /><span>{repo[0]}</span>{stars && <em>{stars}</em>}</A></li>}
          </ul>
          {children}
        </div>
        <div className="lx-close-art" aria-hidden="true">
          <Sigil seed={seed || name} data={data} className="lx-close-sigil" />
          <p className="lx-close-mark"><b>{name}</b><span>{license}</span></p>
        </div>
      </div>
    </section>
  );
}
