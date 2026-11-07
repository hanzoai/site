'use client';
/* Finale — the v2 launch close (Cloud 4 chat): one statement, one action, the agent prompt, and "Get X".
   Usage:
     <Finale name="Sentinel" prompt="Read https://hanzo.ai/skill.md and use Hanzo Sentinel in my project." api="/v1/…"
             head="Get started with Hanzo Sentinel" lede="…" small="…" acts={[[label, href], …]}
             tag="Error tracking" license="BSL-1.1" repo={['hanzoai', url]} stars="4 stars" deploy={url|null} self={url}
             related={[[title, href, line], …]} dark />
   Words are the page's own (Hanzo's "Paste and ship" block and "Get X" block, re-composed in the v2 type scale).
   The only moving thing is the prompt's caret; "Deploy to Cloud" is the magnetic primary. */
import { Copy, Magnetic } from '../ui';
import { A } from '../kit';
import './Launch.css';

const Gh = () => <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" /></svg>;

export function Prompt({ name, prompt, api, className = '' }) {
  return (
    <div className={'l2-pr ' + className}>
      <div className="l2-pr-h">
        <p className="l2-pr-t">Paste and ship</p>
        <p className="l2-pr-d">Paste this into any agent. It reads the skill manifest and calls {name} from there.</p>
      </div>
      <div className="l2-pr-box">
        <div className="l2-pr-bar">
          <span className="l2-pr-k">Agent prompt</span>
          {api && <span className="l2-pr-api"><i>api</i>{api}</span>}
          <Copy text={prompt} />
        </div>
        <pre className="l2-pr-code"><code>{prompt}</code></pre>
      </div>
    </div>
  );
}

export default function Finale({ name, prompt, api, head, lede, small, acts = [], tag, license = 'Apache-2.0', repo = ['hanzoai', 'https://github.com/hanzoai'], stars, deploy = 'https://platform.hanzo.ai/deploy', self, related, relTitle = 'Related capabilities', dark, children, className = '' }) {
  return (
    <section className={`l2-fin ${dark ? 'l2-dark' : ''} ${className}`} data-room={dark ? 'dark' : undefined}>
      <div className="l2-wrap">
        <div className="l2-fin-top">
          <div className="l2-fin-copy">
            {head && <h2 className="l2-head">{head}</h2>}
            {lede && <p className="l2-lede">{lede}</p>}
            {small && <p className="l2-fin-s">{small}</p>}
            {acts.length > 0 && <div className="l2-acts">{acts.map(([t, to], i) => <A key={t} to={to} className={'x-btn' + (i === 0 ? ' solid' : '')}>{t}</A>)}</div>}
            {children}
          </div>
          {prompt && <div className="l2-fin-prompt"><Prompt name={name} prompt={prompt} api={api} /></div>}
        </div>
        {related && (
          <div className="l2-rel">
            <p className="l2-kick">{relTitle}</p>
            <ul>{related.map(([t, to, d]) => <li key={t}><A to={to}><b>{t}</b>{d && <span>{d}</span>}</A></li>)}</ul>
          </div>
        )}
        <div className="l2-get">
          <div className="l2-get-h">
            <h2 className="l2-display">Get {name}</h2>
            {tag && <p className="l2-get-tag">{tag}</p>}
            <div className="l2-get-meta">
              {license && <span className="l2-chip"><span>License:</span> {license}</span>}
              {repo && <A to={repo[1]} className="l2-chip"><Gh />{repo[0]}{stars && <em>{stars}</em>}</A>}
            </div>
          </div>
          <div className="l2-get-acts">
            {self && <A to={self} className="x-btn">Self-host</A>}
            {deploy && <Magnetic strength={0.25}><A to={deploy} className="x-btn solid">Deploy to Cloud</A></Magnetic>}
          </div>
        </div>
      </div>
    </section>
  );
}
