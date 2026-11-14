'use client';
/* SafeClose: v2/KeynoteClose (and its KeynoteRoom) with one change, so the pages that use it hydrate cleanly under
   reduced motion (docs/build-notes/requests/reduced-motion-hydration.md). KeynoteRoom reads motion's useReducedMotion() while
   rendering (null on the server, true on the first client render), so the room's clip-path differs and React logs a
   hydration error. This copy reads the kit's useCalm() instead. Same props, same markup, same CSS as KeynoteClose,
   plus enter: a data-enter name for arrive.js on the block. Copy rule (8 Nov): "api /v1/…" and the repo name are each
   one plain text element, as on hanzo.ai.
   Used by /crawl /dashboards /datastore /dns. Delete it and import v2/KeynoteClose again once the shared file is fixed. */
import { useRef } from 'react';
import type { ReactNode } from 'react';
import { motion, useScroll, useTransform, useMotionTemplate } from 'motion/react';
import { Magnetic, useCalm } from '../../ui';
import { A, Cta, CodeBlock } from '../../kit';
import KeynoteLines from '../../v2/KeynoteLines';
import { useWide } from '../../v2/KeynoteChapters';
import '../../v2/Keynote.css';
import '../../v2/KeynoteClose.css';

/* the dark room on its own (v2/KeynoteRoom with useCalm), for a page's graphite section */
interface RoomProps { children?: ReactNode; className?: string; from?: [number, number, number]; tone?: string; id?: string }
export function Room({ children, className = '', from = [6, 7, 24], tone = '#171717', id }: RoomProps) {
  const ref = useRef<HTMLElement>(null);
  const calm = useCalm();
  const wide = useWide();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start end', 'start 15%'] });
  const v = useTransform(p, [0, 1], [wide ? from[0] : 2, 0], { clamp: true });
  const h = useTransform(p, [0, 1], [wide ? from[1] : 3, 0], { clamp: true });
  const r = useTransform(p, [0, 1], [wide ? from[2] : 24, 0], { clamp: true });
  const clip = useMotionTemplate`inset(${v}% ${h}% ${v}% ${h}% round ${r}px)`;
  return (
    <section ref={ref} id={id} className={'knr ' + className} data-room="dark" style={{ position: 'relative', color: '#fafafa', isolation: 'isolate' }}>
      <motion.div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: tone, zIndex: -1, clipPath: calm ? 'none' : clip }} />
      {children}
    </section>
  );
}

const Gh = () => <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" /></svg>;

interface CloseProps {
  name: string; tag?: string; lead?: string; prompt?: string; api?: string; cta?: string; license?: string; repo?: [string, string];
  stars?: string; deploy?: string; self?: string; children?: ReactNode; light?: boolean; enter?: string; className?: string;
}

function Body({ name, tag, lead, prompt, api, cta = 'close', license = 'Apache-2.0', repo = ['hanzoai', 'https://github.com/hanzoai'], stars, deploy = 'https://platform.hanzo.ai/deploy', self, children, light, enter }: CloseProps) {
  return (
    <div className="kn-wrap knx-in" data-enter={enter}>
      <KeynoteLines as="h2" className="kn-display md knx-h" lines={`Get ${name}`} />
      {lead && <p className="kn-kick knx-lead">{lead}</p>}
      <div className="kn-grid knx-g">
        <div className="knx-l">
          {tag && <p className="kn-lede knx-tag">{tag}</p>}
          <div className="knx-meta">
            {license && <span className="knx-chip"><span>License:</span> {license}</span>}
            {repo && <A to={repo[1]} className="knx-chip"><Gh /><span style={{ color: 'inherit' }}>{repo[0]}</span>{stars && <em>{stars}</em>}</A>}
          </div>
          <div className="kn-acts knx-acts">
            {deploy && <Magnetic strength={0.2}><Cta to={deploy} id={cta} className="knx-go">Deploy to Cloud</Cta></Magnetic>}
            {self && <Cta to={self} kind="link" id={cta + '-self'} className="knx-self">Self-host</Cta>}
          </div>
          {children}
        </div>
        {prompt && (
          <div className="knx-paste">
            <p className="kn-title knx-pt">Paste and ship</p>
            <p className="knx-pd">Paste this into any agent. It reads the skill manifest and calls {name} from there.</p>
            {api && <p className="knx-api"><span>api {api}</span></p>}
            <CodeBlock code={prompt} label="Agent prompt" className="knx-code" />
          </div>
        )}
      </div>
    </div>
  );
}

export default function SafeClose(props: CloseProps) {

  if (props.light) return <section className={'kn-sec knx light ' + (props.className || '')}><Body {...props} /></section>;
  return <Room className={'kn-sec knx ' + (props.className || '')}><Body {...props} /></Room>;
}
