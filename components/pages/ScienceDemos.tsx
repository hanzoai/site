'use client';
/* "How it works across disciplines": the eight walkthroughs and the connector explorer. A walkthrough is a player with
   three chapters: it plays by itself while it is on screen (Pause holds it, a chapter takes it over, the arrow button
   restarts it, 1x/2x sets the pace), the picture moves with its progress, and Hanzo's script for the chapter sits beside
   it. Reduced motion: it rests paused. Every discipline and every chapter stays in the HTML (hidden, not removed), and
   so does every connector (a filter hides the ones it does not pick). Words, scripts and figures are Hanzo's. */
import { useEffect, useReducer, useRef, useState } from 'react';
import { useInView } from 'motion/react';
import { Tabs, TabPanel } from '../kit';
import { useCalm } from '../ui';
import { Demo } from './ScienceDiagrams';
import { VIDEO_DEMOS, CONNECTORS, CONNECTOR_TABS } from './scienceData';
import './ScienceDemos.css';

const START_AT = VIDEO_DEMOS.findIndex((d) => d.id === 'materials'); // Hanzo opens on the crystal

const Icon = ({ d }: { d: string }) => <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true"><path d={d} fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const FILM = 'M2.5 3h11v10h-11zM5 3v10M11 3v10M2.5 6.5H5M2.5 9.5H5M11 6.5h2.5M11 9.5h2.5';
const DB = 'M3 4.5C3 3.4 5.2 2.5 8 2.5s5 .9 5 2S10.8 6.5 8 6.5 3 5.6 3 4.5Zm0 0v7c0 1.1 2.2 2 5 2s5-.9 5-2v-7M3 8c0 1.1 2.2 2 5 2s5-.9 5-2';

/* the player's position: which chapter, how far along it (0 to 100); one reducer so a chapter turns over exactly once */
interface Pos {
  c: number;
  p: number;
}
type Act = { t: 'tick'; by: number; n: number } | { t: 'set'; c: number; p: number };
function move(s: Pos, a: Act): Pos {
  if (a.t === 'tick') { const n = s.p + a.by; return n >= 100 ? { c: (s.c + 1) % a.n, p: 0 } : { c: s.c, p: n }; }
  return { c: a.c, p: a.p };
}

interface Controls {
  to: (c: number, p: number) => void;
  toggle: () => void;
  restart: () => void;
  pace: () => void;
}
function Player({ d, on, pos, playing, speed, controls }: { d: (typeof VIDEO_DEMOS)[number]; on: boolean; pos: Pos; playing: boolean; speed: number; controls: Controls }) {
  const c = on ? pos.c : 0;
  return (
    <div className="xsd-play">
      <div className="xsd-screen">
        <header>
          <span data-b>{d.title}</span>
          {d.chapters.map((ch, k) => <span key={ch.step} className="x-mono" hidden={k !== c}>{ch.metric}</span>)}
        </header>
        <div className="xsd-fig">{on && <Demo id={d.id} progress={pos.p} />}</div>
        <div className="xsd-ctl">
          <div className="xsd-chaps">
            {d.chapters.map((ch, k) => (
              <button type="button" key={ch.step} data-on={k === c ? '' : undefined} onClick={() => controls.to(k, 15)}>
                <i><u style={{ width: k < c ? '100%' : k === c ? pos.p + '%' : '0%' }} /></i>
                <span className="x-mono">{ch.step}. {ch.label}</span>
              </button>
            ))}
          </div>
          <div className="xsd-bar">
            <div className="xsd-btns">
              <button type="button" className="xsd-play-b" aria-label={playing ? 'Pause walkthrough' : 'Play walkthrough'} onClick={controls.toggle}>
                <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true">{playing ? <path d="M3 2v8M9 2v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /> : <path d="M3 1.8v8.4L10 6z" fill="currentColor" />}</svg>
                <span>{playing ? 'Pause' : 'Play'}</span>
              </button>
              <button type="button" className="xsd-ic" aria-label="Restart walkthrough" onClick={controls.restart}>
                <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true"><path d="M2 6a4 4 0 1 0 1.2-2.9M2 1.8v2.4h2.4" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              <button type="button" className="xsd-ic x-mono" aria-label="Playback speed" onClick={controls.pace}>{speed}x</button>
            </div>
            <span className="x-mono xsd-time">{d.chapters.map((ch, k) => <span key={ch.step} hidden={k !== c}>{ch.time}</span>)} / {d.duration}</span>
          </div>
        </div>
      </div>
      <div className="xsd-side">
        <p className="xsd-sum">{d.summary}</p>
        <ol className="xsd-list">
          {d.chapters.map((ch, k) => (
            <li key={ch.step}>
              <button type="button" data-on={k === c ? '' : undefined} onClick={() => controls.to(k, 20)}>
                <span data-b>{ch.step}. {ch.label}</span><span>{ch.detail}</span>
              </button>
            </li>
          ))}
        </ol>
        <div className="xsd-code">
          {d.chapters.map((ch, k) => (
            <div key={ch.step} hidden={k !== c}>
              <p className="x-mono xsd-code-h"><Icon d="M5.5 4 2.5 8l3 4M10.5 4l3 4-3 4" />Step {ch.step} script</p>
              <pre tabIndex={0}><code><span>{ch.code}</span></code></pre>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Walkthroughs() {
  const box = useRef<HTMLDivElement>(null);
  const seen = useInView(box, { amount: 0.25 });
  const calm = useCalm();
  const [di, setDi] = useState(START_AT);
  const [pos, dispatch] = useReducer(move, { c: 0, p: 36 });
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const n = VIDEO_DEMOS[di].chapters.length;
  useEffect(() => { if (calm) setPlaying(false); }, [calm]);
  useEffect(() => {
    if (!playing || !seen) return;
    const t = setInterval(() => dispatch({ t: 'tick', by: speed * 2, n }), 350);
    return () => clearInterval(t);
  }, [playing, seen, speed, n]);
  const controls: Controls = {
    to: (c, p) => dispatch({ t: 'set', c, p }),
    toggle: () => setPlaying((v) => !v),
    restart: () => { dispatch({ t: 'set', c: 0, p: 0 }); setPlaying(true); },
    pace: () => setSpeed((s) => (s === 1 ? 2 : 1)),
  };
  const pick = (i: number) => { setDi(i); dispatch({ t: 'set', c: 0, p: 24 }); };
  return (
    <div className="xsd-wk" ref={box} data-slot="science-video-showcase">
      <div className="xsd-head">
        <h3><Icon d={FILM} />Interactive walkthroughs across disciplines</h3>
        <Tabs id="xsd" label="Discipline" tabs={VIDEO_DEMOS.map((d) => d.discipline)} value={di} onChange={pick} />
      </div>
      {VIDEO_DEMOS.map((d, i) => (
        <TabPanel key={d.id} id="xsd" i={i} value={di}>
          <Player d={d} on={i === di} pos={pos} playing={playing} speed={speed} controls={controls} />
        </TabPanel>
      ))}
    </div>
  );
}

export function Connectors() {
  const [dom, setDom] = useState('all');
  return (
    <div className="xsd-cn" data-slot="science-connectors-explorer">
      <div className="xsd-head">
        <h3><Icon d={DB} />Domain packs, scientific databases, simulators &amp; compute connectors</h3>
        <div className="xsd-tabs" role="group" aria-label="Domain">
          {CONNECTOR_TABS.map((t) => <button key={t.id} type="button" className="x-btn sm" aria-pressed={dom === t.id} onClick={() => setDom(t.id)}>{t.label}</button>)}
        </div>
      </div>
      <ul className="xsd-grid">
        {CONNECTORS.map((c) => (
          <li key={c.name} hidden={dom !== 'all' && c.domain !== dom}>
            <div><span data-b>{c.name}</span><span className="xsd-meta"><span className="xsd-kind">{c.kind}</span><span className="x-mono">{c.status}</span></span></div>
            <p>{c.detail}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
