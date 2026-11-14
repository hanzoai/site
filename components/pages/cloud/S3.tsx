'use client';
/* Object Storage, Cloud 3 launch page, round 3 to docs/build-notes/MASTER.md (the only brief).
   V2: 8/10 Title first on the 8/5 split with the lede and ask beside it, then the object on one flat quiet stage: it breaks into fourteen shards that fly to fourteen volume servers, survives four going dark and reads back from the ten left (phones: shards top-right, readout on its own row, nothing shifts); then the peel: the binary's four roles lift apart into floating layers in 3D beside the four facts, and close again; one black room where "4 can be lost, and it still reads" is the one big figure beside three small ones, then the agent prompt; entrances (s3/S3Enter.jsx): text-mask-film, iris, shutter, cursor-lens, grid-wave; deck greys, flat surfaces, no springs.
// Signature: peel — one binary lifts apart into its four floating roles in 3D (HTTP gateway, filer, master, volume servers), walks KMS keys, ten data and four parity shards (four dark, still reads) and one binary protocol on those layers, then closes back into one binary
// Beyond: lose four yourself — in the hero, tap any volume servers dark, up to the four Hanzo says can be lost, and watch the object keep reading
   Persona: Developer storing objects (buckets from code).
   Goal: call the S3 API.
   CTA: "API reference" → https://docs.hanzo.ai/docs/openapi/s3 (data-cta s3.hero, s3.close; the site's sticky ask
   carries the same label from data-thumb).
   Metric: api_key_created.
   The hero (kept, approved): an object, kept. An object breaks into ten data shards and four parity shards that fly to fourteen volume
   servers; any four go dark and the object still reads, back from the ten that are left. It runs twice by itself while
   seen (about ten seconds) and rests reading; play, first in the stage's toolbar, replays it. Scale rhythm: the object starts whole and big, shrinks to fourteen shards as
   they leave, and fills back when it reads.
   Beyond: lose four yourself. Tap any volume servers dark, up to the four Hanzo says can be lost, and watch the object
   keep reading whichever four you choose; point at a volume first and it names the shard it holds; Replay hands the
   loop back.
   Motion (1 signature + 3): idle = the shards flying out, four volumes going dark, the object reading back (the one
   continuous mover, pausable); pointer = a volume you point at fills and names its shard while its line turns ink, the
   magnetic close; state = tapping volumes dark, Replay, picking a fact on the peel; arrival = the cut-in title and the
   figures cutting in in the black room (one reveal style: the line mask); the peel (s3/Peel.jsx) lifts and closes by
   itself while seen (a 900 ms ease-in-out scene move per state). The pinned chapters (Roles) and the black room's
   timed wipe are gone. Every word and link is Hanzo's. */
import { useEffect, useMemo, useState } from 'react';
import { motion, LayoutGroup } from 'motion/react';
import { A, Img } from '../../kit';
import { useLive } from './Frame';
import { LeafPaste as Paste } from './close3/Leaf';
import SpecDrawer from '../../v2/SpecDrawer';
import LaunchClose, { Arr } from './close3/Close';
import Peel from './s3/Peel';
import { Shutter, CursorLens, GridWave } from './s3/S3Enter';
import LineMask from '../../v2/LineMask';
import LivePause, { usePause } from '../../v2/LivePause';
import './S3.css';

const API = 'https://docs.hanzo.ai/docs/openapi/s3';
const GH = 'https://github.com/hanzoai/s3';
const MOVE = { duration: 0.5, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }; // shards move and stay: ease-in-out, slower (MASTER §3.1), no spring

/* ---------- the hero stage: an object, kept ---------- */
const N = 14; // ten data shards, four parity
const hash = (i: number) => { const x = Math.sin(i * 12.9898) * 43758.5453; return x - Math.floor(x); };
const name = (i: number) => (i < 10 ? 'd' + (i + 1) : 'p' + (i - 9));
// volume centres on the field (percent), for the fan: two rows of seven to the right of the object
const VX = (i: number) => 36 + ((i % 7) + 0.5) * (62 / 7);
const VY = (i: number) => (i < 7 ? 27.5 : 72.5); // row centres of .s3-vols (top 6%, height 88%)

function Shard({ i }: { i: number }) {
  return <motion.i layoutId={'s3-' + i} className={'s3-shard' + (i >= 10 ? ' p' : '')} transition={{ ...MOVE, delay: (i % 7) * 0.035 }} />;
}

function Kept() {
  const [ref, live, calm] = useLive<HTMLDivElement>(0.3);
  const [paused, pause] = usePause();
  const [phase, setPhase] = useState(0); // 0 object, 1 sharded, 2 four lost, 3 still reads
  const [cycle, setCycle] = useState(0);
  const [pick, setPick] = useState<Set<number> | null>(null); // volumes taken dark by hand; null = the loop chooses
  const [hov, setHov] = useState<number | null>(null); // the volume a fine pointer is on
  const [no, setNo] = useState<number | null>(null); // a fifth tap is refused: that tile nudges and the readout says four (the ten stay bright)
  useEffect(() => {
    if (calm) { setPhase(3); return; }
    // MASTER §4.1: it runs twice through (two different fours lost, about ten seconds), then rests reading; play replays
    if (!live || pick || paused || hov !== null || (cycle >= 1 && phase === 3)) return;
    // the very first break-up starts within half a second, so the first screen is moving before you look for it
    const t = setTimeout(() => {
      if (phase === 3) { setPhase(0); setCycle((c) => c + 1); } else setPhase(phase + 1);
    }, phase === 0 && cycle === 0 ? 450 : [1300, 1500, 1200, 2000][phase]);
    return () => clearTimeout(t);
  }, [phase, cycle, live, calm, pick, paused, hov]);
  const auto = useMemo(() => new Set(Array.from({ length: N }, (_, i) => i).sort((a, b) => hash(a + cycle * N) - hash(b + cycle * N)).slice(0, 4)), [cycle]);
  const lost = pick || auto;
  const toggle = (i: number) => {
    const next = new Set<number>(pick || []);
    if (!next.has(i) && next.size >= 4) { setNo(i); setTimeout(() => setNo(null), 320); return; }
    if (next.has(i)) next.delete(i); else next.add(i);
    setPick(next);
    setPhase(next.size ? 3 : 1);
  };
  const reads = phase === 3;
  const rest = !calm && (!!pick || (cycle >= 1 && phase === 3)); // settled: by hand, or after its two runs
  const live1 = (i: number) =>
 phase >= 1 && !(phase >= 2 && lost.has(i));
  return (
    <div className="s3-kept" ref={ref} data-phase={phase}>
      <div className="s3-bar">
        <LivePause paused={paused || rest} onToggle={() => { if (rest) { setPick(null); setPhase(0); setCycle(0); if (paused) pause(); } else pause(); }} inline className="s3-pause" />
        <p className="lx-kick s3-name">Storage</p>
        <div className="s3-legend" aria-hidden="true">
          <span><i />ten data shards</span><span><i className="p" />four parity</span><span><i className="x" />four can be lost</span>
        </div>
        <span className="s3-mine" aria-live="polite">{hov !== null ? `${name(hov)} · ${hov < 10 ? 'data' : 'parity'}${phase >= 2 && lost.has(hov) ? ' · dark' : ''}` : pick ? pick.size + ' / 4 dark · still reads' : 'tap any four'}</span>
        {pick && <button type="button" className="s3-again" onClick={() => { setPick(null); setPhase(0); setCycle((c) => c + 1); }}>Replay</button>}
      </div>
      <div className="s3-field">
        <LayoutGroup>
          <svg className="s3-fan" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            {Array.from({ length: N }).map((_, i) => {
              // each line stops at the volume grid's edge, spread over its row's height: nothing runs under a tile
              const x = 35.6, y = VY(i) + ((i % 7) - 3) * 4.2, m = (19 + x) / 2;
              return <path key={i} d={`M18 50 C ${m} 50, ${m} ${y}, ${x} ${y}`} className={(live1(i) ? 'on' : phase >= 2 && lost.has(i) ? 'cut' : '') + (hov === i ? ' hov' : '')} />;
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
                <button type="button" key={i} className={'s3-vol' + (gone ? ' gone' : '') + (i >= 10 ? ' par' : '') + (hov === i ? ' hov' : '') + (no === i ? ' no' : '')} aria-pressed={!!pick && pick.has(i)} aria-label={'Volume server ' + name(i)} onClick={() => toggle(i)}
                  onPointerEnter={(e) => e.pointerType === 'mouse' && setHov(i)} onPointerLeave={() => setHov(null)}>
                  <span className="s3-vn" aria-hidden="true">{name(i)}</span>
                  <span className="s3-slot" aria-hidden="true">{phase >= 1 && !gone && <Shard i={i} />}</span>
                  {gone && <motion.b aria-hidden="true" initial={calm ? false : { scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>✕</motion.b>}
                </button>
              );
            })}
          </div>
        </LayoutGroup>
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
          <div className="s3-hero-grid">
            <LineMask as="h1" className="lx-display s3-h1" lines={['Hanzo Object', 'Storage']} />
            <div className="s3-hero-r">
              <p className="lx-lede s3-sub">Buckets and objects, presigned links, multipart uploads, versioning and object lock.</p>
              <div className="s3-acts">
                <A to={API} className="lx-cta" data-thumb="API reference" data-cta="s3.hero" data-cursor="">API reference<Arr /></A>
                <A to={GH} className="lx-text" data-cursor="">Source</A>
              </div>
            </div>
          </div>
          <Kept />
        </div>
      </section>

      <section className="s3-peel-sec" aria-label="An object, kept">
        <div className="lx-wrap"><Peel /></div>
      </section>

      <section className="s3-room lx-dark" data-room="dark">
        <div className="lx-wrap">
          <Shutter><SpecDrawer className="s3-spec" rows={FIG.map(([v, l], i) => ({ v: <LineMask as="span" lines={[String(v)]} delay={i * 0.06} inView />, l }))} /></Shutter>
          <CursorLens><Paste dark name="Object Storage" api="/v1/s3/buckets" prompt="Read https://hanzo.ai/skill.md and use Hanzo Object Storage in my project. Start with: hanzo s3 buckets list" className="s3-paste" aside={<div className="s3-kai"><Img src="/models/kai.webp" alt="" w={1200} h={1500} /></div>} /></CursorLens>
        </div>
      </section>

      <GridWave>
        <LaunchClose name="Object Storage" tag="Distributed object storage" seed="s3" data={[10, 4, 4]} ask={['API reference', API]} cta="s3.close" repo={['hanzoai/s3', GH]} stars="4 stars" />
      </GridWave>
    </main>
  );
}
