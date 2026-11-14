'use client';
/* /tag's drawn parts, shared by the board and the page's sections: the three rooms' art and the four product frames.
   Every word comes from slackData.js (Hanzo's copy); nothing here adds a word. */
import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import { ASK, ANSWER, CANVAS, DIFF, SETUP, BUILT, SESSION, WINDOW, VIEW, PEOPLE, Msg, Face } from '../slackData';

export const P = 'xtg';

/* The server cannot know the visitor's motion setting: anything that depends on it waits for the first browser render,
   so the server HTML and the first client render match (no hydration mismatch under reduced motion). */
export function useMounted() {
  const [m, setM] = useState(false);
  useEffect(() => setM(true), []);
  return m;
}

/* What each room looks like, drawn from the same channel: the mention, the canvas and diff, the federated identity. */
export function RoomArt({ k }: { k: number }) {
  if (k === 0) return <div className={`${P}-art t0`}><Msg m={ASK} p={P} /><Msg m={ANSWER} p={P} /></div>;
  if (k === 1) return (
    <div className={`${P}-art t1`}>
      <p className={`${P}-cv-t`}><i /><span><b>{CANVAS.title}</b><span>{CANVAS.meta}</span></span></p>
      <pre>{DIFF.lines.slice(3, 8).map(([, , s, t], i) => <span key={i} className={s === '+' ? 'add' : 'del'}>{s} {t}{'\n'}</span>)}</pre>
    </div>
  );
  return (
    <div className={`${P}-art t2`}>
      <p className={`${P}-art-v`}><i>✓</i>{SETUP.verified}</p>
      <p className={`${P}-art-role`}><b>{BUILT.items[4][0]}</b><span>{SETUP.steps[2][1]}</span></p>
      <p className={`${P}-art-tok`}>{[6, 10, 4, 13, 7, 9, 5, 11].map((w, i) => <i key={i} style={{ '--w': w, '--i': i } as CSSProperties} />)}</p>
    </div>
  );
}

/* Each product's surface, drawn from what this page already shows: the tagged thread, the workspace's channels, the
   resident bot's trace, and the side panel beside the button it fixed. */
const TRACE = (SESSION[0].msgs[0].trace ?? []).map(([k]) => k);
export function Frame({ k }: { k: number }) {
  if (k === 0) return (
    <span className={`${P}-frame f0`} aria-hidden="true">
      <span className={`${P}-fr-h`}># {SETUP.channel.slice(1)}</span>
      <span className={`${P}-fr-row`}><Face who="harry" p={`${P}-fr`} /><span className={`${P}-fr-at`}>@Hanzo</span></span>
      <span className={`${P}-fr-row`}><Face who="hanzo" p={`${P}-fr`} /><span className={`${P}-fr-chip`}>{WINDOW.prReady}</span></span>
    </span>
  );
  if (k === 1) return (
    <span className={`${P}-frame f1`} aria-hidden="true">
      {WINDOW.groups.map(([g, chans]) => (
        <span key={g} className={`${P}-fr-g`}><span className={`${P}-fr-gl`}>{g}</span>{chans.map((c) => <span key={c} className={c === 'bug-button-darkmode' ? 'on' : ''}># {c}</span>)}</span>
      ))}
    </span>
  );
  if (k === 2) return (
    <span className={`${P}-frame f2`} aria-hidden="true">
      <span className={`${P}-fr-row`}><Face who="dev" p={`${P}-fr`} /><b>{PEOPLE.dev.name}</b><i className={`${P}-fr-live`} /></span>
      <span className={`${P}-fr-tr`}>{TRACE.map((t, j) => <span key={t} style={{ '--j': j } as CSSProperties}>{t}</span>)}</span>
    </span>
  );
  return (
    <span className={`${P}-frame f3`} aria-hidden="true">
      <span className={`${P}-fr-bar`}><i /><i /><i /></span>
      <span className={`${P}-fr-page`}><b style={VIEW.old}>{VIEW.button}</b><b style={VIEW.fix}>{VIEW.button}</b></span>
      <span className={`${P}-fr-side`}><Face who="hanzo" p={`${P}-fr`} /></span>
    </span>
  );
}
