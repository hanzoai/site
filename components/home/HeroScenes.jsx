'use client';
/* The rest of hanzo.ai's hero day, in our hero (8 Nov). Live's hero now runs a whole working day for maxpower: the
   desktop app moves between chat, Dev, Design and terminal tabs; the phone follows along. Every scene here is
   Hanzo's own, word for word (hero-scenes.json, read from the live page). All of them stay in the page; one shows at a
   time. */
import SCENES from './hero-scenes.json';

const pic = (src) => src.replace('/images/models/', '/models/').replace(/^(\/models\/\w+)$/, '$1.webp');
const step = (s) => (Array.isArray(s) ? s[0].replace('{file}', s[1]) : s);

// scene 0 is the hero's own opening (the prompt, the card, the install); the rest follow it
export const MORE = SCENES.slice(1);

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
