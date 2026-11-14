'use client';
/* FnClose (page-local to /functions): the page's closing dark room, "Get Functions" with Hanzo's "Paste and ship" prompt.
   A copy of the shared components/v2/KeynoteClose + KeynoteRoom with one change: the room reads the reduced-motion
   setting only after mount, so the server HTML and the first client render match (the shared room renders a clip-path on
   the server and none on a reduced-motion client, which breaks hydration). Same markup and classes, so the shared
   KeynoteClose.css still styles it. The dark opens out of a rounded window to the full width as it scrolls in;
   reduced motion: full width. */
import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { motion, useScroll, useTransform, useReducedMotion, useMotionTemplate } from 'motion/react';
import { Magnetic } from '../../../ui';
import { A, Cta, CodeBlock } from '../../../kit';
import { useWide } from '../../../v2/KeynoteChapters';
import KeynoteLines from '../../../v2/KeynoteLines';
import '../../../v2/Keynote.css';
import '../../../v2/KeynoteClose.css';

const Gh = () => <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" /></svg>;

function Room({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const calm = useReducedMotion() && mounted;
  const wide = useWide();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start end', 'start 15%'] });
  const v = useTransform(p, [0, 1], [wide ? 6 : 2, 0], { clamp: true });
  const h = useTransform(p, [0, 1], [wide ? 7 : 3, 0], { clamp: true });
  const r = useTransform(p, [0, 1], [24, 0], { clamp: true });
  const clip = useMotionTemplate`inset(${v}% ${h}% ${v}% ${h}% round ${r}px)`;
  return (
    <section ref={ref} className="knr kn-sec knx" data-room="dark" style={{ position: 'relative', color: '#fafafa', isolation: 'isolate' }}>
      <motion.div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: '#171717', zIndex: -1, clipPath: calm ? 'none' : clip }} />
      {children}
    </section>
  );
}

interface FnCloseProps {
  name: string;
  tag: ReactNode;
  prompt: string;
  api: ReactNode;
  cta: string;
  children?: ReactNode;
}

export default function FnClose({ name, tag, prompt, api, cta, children }: FnCloseProps) {

  return (
    <Room>
      <div className="kn-wrap knx-in">
        <KeynoteLines as="h2" className="kn-display md knx-h" lines={`Get ${name}`} />
        <div className="kn-grid knx-g">
          <div className="knx-l">
            <p className="kn-lede knx-tag">{tag}</p>
            <div className="knx-meta">
              <span className="knx-chip"><span>License:</span> Apache-2.0</span>
              <A to="https://github.com/hanzoai" className="knx-chip"><Gh />hanzoai</A>
            </div>
            <div className="kn-acts knx-acts">
              <Magnetic strength={0.2}><Cta to="https://platform.hanzo.ai/deploy" id={cta} className="knx-go">Deploy to Cloud</Cta></Magnetic>
            </div>
            {children}
          </div>
          <div className="knx-paste">
            <p className="kn-title knx-pt">Paste and ship</p>
            <p className="knx-pd">Paste this into any agent. It reads the skill manifest and calls {name} from there.</p>
            <p className="knx-api"><i><span>api</span></i><span>{api}</span></p>
            <CodeBlock code={prompt} label="Agent prompt" className="knx-code" />
          </div>
        </div>
      </div>
    </Room>
  );
}
