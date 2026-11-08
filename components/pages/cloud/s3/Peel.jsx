'use client';
/* Object Storage's peel (the page's signature, docs/MOTION-MAP.md `peel`). "One binary, four roles": the binary is
   one slab in 3D, and as the section is read it lifts apart into its four floating roles, top to bottom the HTTP
   gateway your code talks to, the filer (the namespace), the master that tracks where everything is, and the volume
   servers that hold the bytes. Open, it walks Hanzo's other three facts on the same layers: the keys from Hanzo KMS
   land on the volume servers; the ten data and four parity shards sit on them and four go dark while it still reads;
   one binary protocol runs between every layer (no gRPC). Then it closes back into one binary and starts again.
   Pick a fact (its title is a button) and the stack goes to it and stays; point at a layer and it lights. Transform
   only: each layer is one translateZ inside one rotated plane (orthographic), moved by a 900 ms ease-in-out scene
   move; the labels beside it ride the same heights in 2D. Reduced motion: open and still. JS off: open, every word in
   order. */
import { useEffect, useRef, useState } from 'react';
import { useCalm } from '../../../ui';
import LivePause, { usePause } from '../../../v2/LivePause';
import { useArrive } from './S3Enter';

export const FACTS = [
  ['One binary, four roles', 'One binary in four roles: a master that tracks where everything is, volume servers that hold the bytes, a filer for the namespace and the HTTP gateway your code talks to.'],
  ['Keys from KMS', 'Server-side encryption whose keys are minted by Hanzo KMS rather than read out of a config file.'],
  ['Ten data shards, four parity', 'Objects are erasure-coded across ten data shards and four parity shards, so four can be lost and the object still reads.'],
  ['One protocol', 'Every call between the pieces speaks one binary protocol, with no gRPC anywhere: one transport to secure and one to debug.'],
];
// top layer first
const ROLES = [['HTTP gateway', 'your code talks to', 'gw'], ['filer', 'the namespace', 'fl'], ['master', 'tracks where everything is', 'ms'], ['volume servers', 'hold the bytes', 'vs']];
const N = 14;
const DEAD = new Set([2, 6, 11, 13]);
// the walk: 0 one binary (closed), 1 the four roles (open), 2 keys from KMS, 3 shards, 4 one protocol
const FACT_OF = [0, 0, 1, 2, 3];
const HOLD = [1700, 2800, 2600, 3200, 2800];

function useSeen(ref) {
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => setSeen(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
  return seen;
}

export default function Peel() {
  const ref = useRef(null);
  const calm = useCalm();
  const seen = useSeen(ref);
  const [paused, pause] = usePause();
  const [ph, setPh] = useState(1); // the server frame is open: with JS off every role is named
  const [mine, setMine] = useState(false);
  const [hot, setHot] = useState(null);
  // below the fold at load, it closes into one binary so the first thing seen is the lift
  useEffect(() => {
    const el = ref.current;
    if (el && el.getBoundingClientRect().top > innerHeight * 0.8 && !matchMedia('(prefers-reduced-motion: reduce)').matches) setPh(0);
  }, []);
  useEffect(() => { if (calm) setPh((p) => (p === 0 ? 1 : p)); }, [calm]);
  useEffect(() => {
    if (!seen || paused || mine || calm) return;
    const id = setTimeout(() => setPh((p) => (p + 1) % 5), HOLD[ph]);
    return () => clearTimeout(id);
  }, [ph, seen, paused, mine, calm]);
  const go = (f) => { setMine(true); setPh(f + 1); };
  // entrances (MOTION-MAP): a film plays through the heading's letters (text-mask-film), the stage opens on an iris
  const [filmRef, film] = useArrive('0px 0px -15% 0px', 1900);
  const [irisRef, iris] = useArrive('0px 0px -20% 0px');
  const open = ph > 0;
  const fact = FACT_OF[ph];
  return (
    <div className="s3-peel" ref={ref}>
      <div className="s3-facts">
        <h2 className="lx-headline s3-peel-h s3-film" ref={filmRef} data-fm={film}>An object, kept</h2>
        <ol className="s3-fl">
          {FACTS.map(([t, d], i) => (
            <li key={t} className={i === fact ? 'on' : ''}>
              <h3 className="s3-ft"><button type="button" aria-pressed={i === fact} onClick={() => go(i)}>{t}</button></h3>
              <p className="lx-kick s3-fk">{`0${i + 1} / 04`}</p>
              <p className="s3-fd">{d}</p>
            </li>
          ))}
        </ol>
      </div>
      <div className="s3-stage" ref={irisRef} data-iris={iris} data-ph={ph} data-open={open || undefined} data-hot={hot ?? undefined}>
        <div className="s3-stage-bar">
          <LivePause inline paused={paused || mine} onToggle={() => { if (mine) { setMine(false); if (paused) pause(); } else pause(); }} className="s3-ppause" />
        </div>
        <div className="s3-scene" aria-hidden="true">
          <div className="s3-plane">
            {ROLES.map(([r, , k], i) => (
              <div key={k} className={'s3-layer ' + k + (hot === i ? ' hot' : '')} style={{ '--b': 3 - i }}>
                {k === 'vs' && (
                  <div className="s3-lshards">
                    {Array.from({ length: N }, (_, s) => <i key={s} className={(s >= 10 ? 'p' : '') + (ph === 3 && DEAD.has(s) ? ' x' : '')} style={{ '--k': [...DEAD].indexOf(s) }} />)}
                  </div>
                )}
                {k === 'ms' && <div className="s3-lmap">{Array.from({ length: 9 }, (_, s) => <i key={s} />)}</div>}
                {k === 'fl' && <div className="s3-ltree"><i /><i /><i /><i /></div>}
                {k === 'gw' && <div className="s3-lgw"><i /></div>}
                {k === 'vs' && <svg className="s3-llock" viewBox="0 0 16 16" aria-hidden="true"><rect x="3" y="7" width="10" height="7.5" rx="2" fill="currentColor" /><path d="M5.2 7V5.2a2.8 2.8 0 0 1 5.6 0V7" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg>}
                <span className="s3-lname">{r}</span>
              </div>
            ))}
            {/* one binary protocol between every layer: the posts that join them */}
            <div className="s3-posts">{[0, 1, 2, 3].map((p) => <i key={p} />)}</div>
          </div>
        </div>
        <ul className="s3-tags">
          {ROLES.map(([r, d, k], i) => (
            <li key={k} style={{ '--b': 3 - i }} onPointerEnter={(e) => e.pointerType === 'mouse' && setHot(i)} onPointerLeave={() => setHot(null)}>
              <b>{r}</b><span>{d}</span>
            </li>
          ))}
        </ul>
        <span className="s3-one">one binary</span>
        <div className="s3-strip" aria-live="polite">
          {ph <= 1 && <p><b>one binary</b> · four roles</p>}
          {ph === 2 && <p><span className="s3-kms">Hanzo KMS</span><i className="s3-arrow" /><b>server-side encryption</b><s>config file</s></p>}
          {ph === 3 && <p><b>ten data · four parity</b><b className="s3-ok">✓ still reads</b></p>}
          {ph === 4 && <p><b>one binary protocol</b><s>gRPC</s></p>}
        </div>
      </div>
    </div>
  );
}
