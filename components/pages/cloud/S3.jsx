'use client';
/* Object Storage, v2 launch page (Cloud 3), round 2 to JAMES.md.
   V2: 8/10 The object comes first: a full-width stage where an object breaks into fourteen shards that fly to fourteen volume servers, survives four going dark and reads back from the rest, huge type beneath it; four facts open on the section's own title and play on one pinned diagram of the binary's four roles; one dark room where the figures cut in beside the agent prompt; ink and greys only.
   Signature: an object, kept. An object breaks into ten data shards and four parity shards that fly to fourteen volume
   servers; any four go dark and the object still reads, back from the ten that are left. It loops by itself while seen
   (pause in the stage's own legend).
   Beyond: lose four yourself. Tap any volume servers dark, up to the four Hanzo says can be lost, and watch the object
   keep reading whichever four you choose; point at a volume first and it shows which shard it holds; Replay hands the
   loop back.
   Persona: Developer storing objects (buckets from code). Goal: call the S3 API.
   CTA: "API reference" → https://docs.hanzo.ai/docs/openapi/s3 (data-cta s3.hero, s3.close; the site's sticky ask carries
   the same label from data-thumb). Metric: api_key_created.
   Motion: idle = the shards flying out, four volumes going dark, the object reading back (pausable); pointer = a volume
   you point at lifts its shard and names it, the magnetic close; state = tapping volumes dark (spring ✕), Replay;
   arrival = the cut-in title, the timed wipe into the dark room and the figures cutting in there (never counted); scroll = the pinned
   diagram only. Every word and link is Hanzo's. */
import { useEffect, useMemo, useState } from 'react';
import { motion, LayoutGroup } from 'motion/react';
import { A } from '../../kit';
import { Paste, useLive } from './Frame';
import PinnedChapters from '../../v2/PinnedChapters';
import ClipWipe from '../../v2/ClipWipe';
import SpecDrawer from '../../v2/SpecDrawer';
import LaunchClose, { Arr } from '../../v2/LaunchClose';
import LineMask from '../../v2/LineMask';
import LivePause, { usePause } from '../../v2/LivePause';
import './S3.css';

const API = 'https://docs.hanzo.ai/docs/openapi/s3';
const GH = 'https://github.com/hanzoai/s3';

/* ---------- the hero stage: an object, kept ---------- */
const N = 14; // ten data shards, four parity
const hash = (i) => { const x = Math.sin(i * 12.9898) * 43758.5453; return x - Math.floor(x); };
const name = (i) => (i < 10 ? 'd' + (i + 1) : 'p' + (i - 9));
// volume centres on the stage (percent), for the fan: two rows of seven to the right of the object
const VX = (i) => 36 + ((i % 7) + 0.5) * (62 / 7);
const VY = (i) => (i < 7 ? 37.5 : 72.5); // row centres of .s3-vols (top 20%, height 70%)

function Shard({ i }) {
  return <motion.i layoutId={'s3-' + i} className={'s3-shard' + (i >= 10 ? ' p' : '')} transition={{ type: 'spring', stiffness: 170, damping: 24, delay: (i % 7) * 0.035 }} />;
}

function Kept() {
  const [ref, live, calm] = useLive(0.3);
  const [paused, pause] = usePause();
  const [phase, setPhase] = useState(0); // 0 object, 1 sharded, 2 four lost, 3 still reads
  const [cycle, setCycle] = useState(0);
  const [pick, setPick] = useState(null); // volumes taken dark by hand; null = the loop chooses
  const [hov, setHov] = useState(null); // the volume a fine pointer is on
  useEffect(() => {
    if (calm) { setPhase(3); return; }
    if (!live || pick || paused || hov !== null) return;
    // the very first break-up starts within half a second, so the first screen is moving before you look for it
    const t = setTimeout(() => {
      if (phase === 3) { setPhase(0); setCycle((c) => c + 1); } else setPhase(phase + 1);
    }, phase === 0 && cycle === 0 ? 450 : [1500, 1800, 1300, 2600][phase]);
    return () => clearTimeout(t);
  }, [phase, cycle, live, calm, pick, paused, hov]);
  const auto = useMemo(() => new Set(Array.from({ length: N }, (_, i) => i).sort((a, b) => hash(a + cycle * N) - hash(b + cycle * N)).slice(0, 4)), [cycle]);
  const lost = pick || auto;
  const toggle = (i) => {
    const next = new Set(pick || []);
    if (next.has(i)) next.delete(i); else if (next.size < 4) next.add(i);
    setPick(next);
    setPhase(next.size ? 3 : 1);
  };
  const reads = phase === 3;
  const live1 = (i) => phase >= 1 && !(phase >= 2 && lost.has(i));
  return (
    <div className="s3-kept" ref={ref} data-phase={phase}>
      <p className="lx-kick s3-name">Storage</p>
      <LayoutGroup>
        <svg className="s3-fan" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {Array.from({ length: N }).map((_, i) => {
            const x = VX(i), y = VY(i), m = (19 + x) / 2;
            return <path key={i} d={`M18 46 C ${m} 46, ${m} ${y}, ${x} ${y}`} className={(live1(i) ? 'on' : phase >= 2 && lost.has(i) ? 'cut' : '') + (hov === i ? ' hov' : '')} />;
          })}
        </svg>
        <div className={'s3-obj' + (reads ? ' reads' : '')}>
          <p className="s3-k">object</p>
          <div className="s3-file">
            {phase === 0
              ? Array.from({ length: N }).map((_, i) => <Shard key={i} i={i} />)
              : Array.from({ length: N }).map((_, i) => <i key={'g' + i} className={'s3-ghost' + (i >= 10 ? ' p' : '') + (reads && !lost.has(i) ? ' back' : '')} style={{ '--i': i }} />)}
          </div>
          <p className="s3-read" aria-live="polite">{reads ? '✓ still reads' : phase === 0 ? 'erasure-coded' : phase === 1 ? 'ten data · four parity' : 'four go dark'}</p>
        </div>
        <div className="s3-vols" role="group" aria-label="Volume servers: take up to four dark">
          {Array.from({ length: N }).map((_, i) => {
            const gone = phase >= 2 && lost.has(i);
            return (
              <button type="button" key={i} className={'s3-vol' + (gone ? ' gone' : '') + (i >= 10 ? ' par' : '') + (hov === i ? ' hov' : '')} aria-pressed={!!pick && pick.has(i)} aria-label={'Volume server ' + name(i)} disabled={!!pick && pick.size >= 4 && !pick.has(i)} onClick={() => toggle(i)}
                onPointerEnter={(e) => e.pointerType === 'mouse' && setHov(i)} onPointerLeave={() => setHov(null)} data-cursor={gone ? 'Restore' : 'Lose'}>
                <span className="s3-vn" aria-hidden="true">{name(i)}</span>
                <span className="s3-slot" aria-hidden="true">{phase >= 1 && !gone && <Shard i={i} />}</span>
                {gone && <motion.b aria-hidden="true" initial={{ scale: 0.4 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 380, damping: 22 }}>✕</motion.b>}
              </button>
            );
          })}
        </div>
      </LayoutGroup>
      <div className="s3-legend">
        <span><i />ten data shards</span><span><i className="p" />four parity</span><span><i className="x" />four can be lost</span>
        <span className="s3-mine" aria-live="polite">{hov !== null ? `${name(hov)} · ${hov < 10 ? 'data' : 'parity'}${phase >= 2 && lost.has(hov) ? ' · dark' : ''}` : pick ? pick.size + ' / 4 dark · still reads' : 'tap any four'}</span>
        {pick && <button type="button" className="s3-again" onClick={() => { setPick(null); setPhase(0); setCycle((c) => c + 1); }}>Replay</button>}
        <LivePause paused={paused} onToggle={pause} className="s3-pause" />
      </div>
    </div>
  );
}

/* ---------- the chapters' object: one binary, four roles ---------- */
const FACTS = [
  ['One binary, four roles', 'One binary in four roles: a master that tracks where everything is, volume servers that hold the bytes, a filer for the namespace and the HTTP gateway your code talks to.'],
  ['Keys from KMS', 'Server-side encryption whose keys are minted by Hanzo KMS rather than read out of a config file.'],
  ['Ten data shards, four parity', 'Objects are erasure-coded across ten data shards and four parity shards, so four can be lost and the object still reads.'],
  ['One protocol', 'Every call between the pieces speaks one binary protocol, with no gRPC anywhere: one transport to secure and one to debug.'],
];
const ROLES = [['master', 'tracks where everything is'], ['volume servers', 'hold the bytes'], ['filer', 'the namespace'], ['HTTP gateway', 'your code talks to']];
const DEAD = new Set([2, 6, 11, 13]);

function Roles({ step }) {
  const lit = (i) => step === 0 || step === 3 || ((step === 1 || step === 2) && i === 1);
  return (
    <div className="s3-roles" data-step={step}>
      <div className="s3-dia">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {[[25, 27], [75, 27], [25, 73], [75, 73]].map(([x, y], i) => <line key={i} x1="50" y1="50" x2={x} y2={y} />)}
          {step === 3 && [[25, 27, 75, 27], [25, 73, 75, 73], [25, 27, 25, 73], [75, 27, 75, 73]].map(([a, b, c, d], i) => <line key={'p' + i} x1={a} y1={b} x2={c} y2={d} className="proto" />)}
        </svg>
        {ROLES.map(([r, d], i) => (
          <div key={r} className={'s3-role' + (lit(i) ? ' on' : '')} style={{ '--i': i }}>
            <b>{r}</b><span>{d}</span>
            {i === 1 && <svg className={'s3-lock' + (step === 1 ? ' on' : '')} viewBox="0 0 16 16" width="18" height="18" aria-hidden="true"><rect x="3" y="7" width="10" height="7.5" rx="2" fill="currentColor" /><path d="M5.2 7V5.2a2.8 2.8 0 0 1 5.6 0V7" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg>}
          </div>
        ))}
        <span className="s3-bin">one binary</span>
      </div>
      <div className="s3-strip" key={step}>
        {step === 0 && <p><b>one binary</b> · four roles</p>}
        {step === 1 && <p><span className="s3-kms">Hanzo KMS</span><i className="s3-arrow" /><b>server-side encryption</b><s>config file</s></p>}
        {step === 2 && (
          <div className="s3-cells">
            {Array.from({ length: N }).map((_, i) => <i key={i} className={(i >= 10 ? 'p' : '') + (DEAD.has(i) ? ' x' : '')} />)}
            <b>✓ still reads</b>
          </div>
        )}
        {step === 3 && <p><b>one binary protocol</b><s>gRPC</s></p>}
      </div>
    </div>
  );
}

const FIG = [[10, 'data shards'], [4, 'parity shards'], [4, 'can be lost, and it still reads'], [1, 'binary, four roles']];

export default function S3() {
  return (
    <main className="lx s3">
      <section className="s3-hero" data-morph-target data-ask-name="Hanzo Object Storage">
        <div className="lx-wrap">
          <Kept />
          <div className="s3-hero-grid">
            <LineMask as="h1" className="lx-display s3-h1" lines={['Hanzo Object', 'Storage']} />
            <div className="s3-hero-r">
              <p className="lx-lede s3-sub">Buckets and objects, presigned links, multipart uploads, versioning and object lock.</p>
              <div className="s3-acts">
                <A to={API} className="lx-cta" data-thumb="API reference" data-cta="s3.hero">API reference<Arr /></A>
                <A to={GH} className="lx-text">Source</A>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PinnedChapters label="An object, kept" per={82}
        intro={{ title: ['An object,', 'kept'] }}
        steps={FACTS.map(([t, d]) => ({ t, d }))}
        visual={(at) => <Roles step={at} />} />

      <ClipWipe dark className="s3-room">
        <div className="lx-wrap">
          <SpecDrawer className="s3-spec" rows={FIG.map(([v, l], i) => ({ v: <LineMask as="span" lines={[String(v)]} delay={i * 0.08} inView />, l }))} />
          <Paste dark name="Object Storage" api="/v1/s3/buckets" prompt="Read https://hanzo.ai/skill.md and use Hanzo Object Storage in my project. Start with: hanzo s3 buckets list" className="s3-paste" />
        </div>
      </ClipWipe>

      <LaunchClose name="Object Storage" tag="Distributed object storage" seed="s3" data={[10, 4, 4]} ask={['API reference', API]} cta="s3.close" repo={['hanzoai/s3', GH]} stars="4 stars" />
    </main>
  );
}
