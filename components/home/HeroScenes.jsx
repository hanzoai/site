'use client';
/* The rest of hanzo.ai's hero day, in our hero (8 Nov). Live's hero now runs a whole working day for maxpower: the
   desktop app moves between chat, Dev, Design and terminal tabs; the phone follows along; and a log of what the
   company's agents are doing ticks beside it. Every scene and every log line here is Hanzo's own, word for word
   (hero-scenes.json and hero-feed.json, read from the live page). All of them stay in the page; one shows at a time. */
import SCENES from './hero-scenes.json';
import FEED from './hero-feed.json';

const pic = (src) => src.replace('/images/models/', '/models/').replace(/^(\/models\/\w+)$/, '$1.webp');
const step = (s) => (Array.isArray(s) ? s[0].replace('{file}', s[1]) : s);
const WHO = { vi: 'Vi', kai: 'Kai', des: 'Des', dev: 'Dev', mark: 'Mark', su: 'Su', sal: 'Sal', fin: 'Fin', law: 'Law', data: 'Data', rev: 'Rev', hanzo: 'H', call: 'Call', person: '' };

// scene 0 is the hero's own opening (the prompt, the card, the install); the rest follow it
export const MORE = SCENES.slice(1);

/* what the company log says when a scene finishes (hanzo.ai's own notes, by kind of scene) */
const note = (s) => (s.place === 'chat' ? (s.card ? 'maxpower is ready' : null)
  : s.place === 'dev' ? (s.ship ? 'Deployed maxpower → maxpower.hanzo.app ✓' : 'CI passed ✓')
    : s.place === 'studio' ? `Des shared ${s.made.length} designs`
      : s.place === 'tabs' ? `${s.panes.length} agents finished`
        : s.place === 'beta' ? 'Hanzo Beta is live' : null);
const NOTES = SCENES.map(note);

/* what maxpower has shipped so far, as chips in the app (hanzo.ai's own labels) */
const CHIP = { offline: 'Works offline', board: 'Leaderboard: you', run: 'Run all' };
export function Chips({ at }) {
  const got = new Set(MORE.slice(0, Math.max(0, at + 1)).map((s) => s.ships).filter(Boolean));
  return (
    <div className="xs-chips">
      {Object.entries(CHIP).map(([k, t]) => <span key={k} className={'xs-chip' + (got.has(k) ? ' on' : '')} aria-hidden={got.has(k) ? undefined : true}>{t}</span>)}
    </div>
  );
}

function Scene({ s }) {
  const ask = s.ask || s.prompt || s.run || s.title;
  return (
    <>
      {s.title && s.ask && <p className="xs-k">{s.title}</p>}
      <div className="xs-me"><span>{ask}</span></div>
      {s.answer && <div className="xs-ai"><span>{s.answer}</span></div>}
      {s.steps && <ul className="xs-steps">{s.steps.map((x, i) => <li key={i}><span>{step(x)}</span></li>)}</ul>}
      {s.made && (
        <div className="xs-made">
          {s.made.map((m, i) => <span key={i} className={i === (s.pick ?? -1) ? 'on' : ''}><img src={pic(m.src)} alt="" loading="lazy" decoding="async" /></span>)}
        </div>
      )}
      {s.status && <p className="xs-status"><span>{s.status}</span></p>}
      {s.panes && (
        <div className="xs-panes x-mono">
          {s.panes.map((p) => (
            <div key={p.name + p.run} className="xs-pane">
              <p className="xs-run"><span>{p.run}</span></p>
              <p className="xs-ask"><span>› {p.ask}</span></p>
              {p.lines.map((l, i) => <p key={i}><span>{l}</span></p>)}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

/* the desktop app's log: every scene in one cell, the current one shown */
export function SceneLog({ at }) {
  return (
    <div className="xs-log">
      {MORE.map((s, i) => <div key={i} className={'xs-scene ' + s.place + (i === at ? ' on' : '')} aria-hidden={i === at ? undefined : true}><Scene s={s} /></div>)}
    </div>
  );
}

/* the terminal: each scene's own shell lines */
export function ShellLines({ at }) {
  return (
    <div className="xs-shell x-mono">
      {MORE.map((s, i) => (s.shell ? (
        <div key={i} className={'xs-sh' + (i === at ? ' on' : '')} aria-hidden={i === at ? undefined : true}>
          <p className="xs-tab"><span>{s.shell.tab}</span></p>
          {s.shell.lines.map(([, kind, t], k) => <p key={k} className={kind}><span>{kind === 'run' ? '$ ' + t : kind === 'ask' ? '› ' + t : t}</span></p>)}
        </div>
      ) : null))}
    </div>
  );
}

/* the phone's Dev tab: what the phone asked, and the cells it got back */
export function PhoneCells({ at }) {
  return (
    <div className="xs-phone x-mono">
      {MORE.map((s, i) => (s.place === 'studio' ? (
        <div key={i} className={'xs-ph studio' + (i === at ? ' on' : '')} aria-hidden={i === at ? undefined : true}>
          <p className="xs-ph-k"><span>Design · Generations</span></p>
          <span className="xs-ph-img"><img src={pic(s.made[s.pick ?? 0].src)} alt="" loading="lazy" decoding="async" /></span>
          <p className="xs-ph-p"><span>{s.prompt}</span></p>
        </div>
      ) : s.phone ? (
        <div key={i} className={'xs-ph' + (i === at ? ' on' : '')} aria-hidden={i === at ? undefined : true}>
          <p className="xs-ph-ask"><span>{s.phone.ask}</span></p>
          {s.phone.cells.map((c, k) => <p key={k}><span>{c}</span></p>)}
        </div>
      ) : null))}
    </div>
  );
}

/* what the company is doing: the two latest entries of the day's log, beside the desktop app */
const JOINS = FEED.filter((e) => e.joins).length;
export function Feed({ i, sc = -1 }) {
  const n = FEED.length;
  const a = ((i % n) + n) % n, b = (a + n - 1) % n;
  const signed = FEED.slice(0, a + 1).filter((e) => e.joins).length;
  const done = sc >= 0 ? NOTES[sc + 1] : null;
  return (
    <div className="xs-feed" role="log" aria-live="off" aria-label="What maxpower’s company is doing">
      {/* the sign-up count as the log has it at each step; the current count shows */}
      <p className="xs-signed">{Array.from({ length: JOINS }, (_, k) => <span key={k} className={k + 1 === signed ? 'on' : ''} aria-hidden={k + 1 === signed ? undefined : true}>{k + 1} signed up · demo</span>)}</p>
      {/* each scene's closing note, the current one on top */}
      {NOTES.map((t, k) => (t ? (
        <div key={'n' + k} className={'xs-ev note' + (done && k === sc + 1 ? ' on a' : '')} aria-hidden={k === sc + 1 ? undefined : true}>
          <i aria-hidden="true">H</i>
          <p><span className="xs-ev-t">{t}</span> <span className="xs-ev-l">· maxpower</span></p>
        </div>
      ) : null))}
      {FEED.map((e, k) => (
        <div key={k} className={'xs-ev' + (k === a ? ' on a' : k === b ? ' on b' : '')} aria-hidden={k === a ? undefined : true}>
          <i aria-hidden="true">{WHO[e.who] ? WHO[e.who][0] : ''}</i>
          <p>{e.joins ? <span className="xs-ev-l">· {e.title}</span> : <><span className="xs-ev-t">{e.title}</span> {e.line && <span className="xs-ev-l">· {e.line}</span>}</>}</p>
          {e.act && <span className="xs-ev-act"><span className="xs-act-a">{e.act[0]}</span><span className="xs-act-b">{e.act[1]}</span></span>}
        </div>
      ))}
    </div>
  );
}
