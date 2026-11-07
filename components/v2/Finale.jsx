'use client';
/* Finale — the v2 launch close (Cloud 4 chat): "Get X" with the agent prompt, then one dark closing band with the page's
   one ask (PLAN-COMPONENTS 2.3 "Page endings": proof, then one Band; JAMES.md 5: one solid ask in Hanzo's words).
   Usage:
     <Finale name="Sentinel" prompt="Read https://hanzo.ai/skill.md and use Hanzo Sentinel in my project." api="/v1/…"
             tag="Error tracking" license="BSL-1.1" repo={['hanzoai', url]} stars="4 stars" deploy={url|null} self={url}
             related={[[title, href, line], …]}
             head="Get started with Hanzo Sentinel" lede="…" small="…" ask={['Read the docs', url]} links={[[label, href], …]} />
   - The light part: "Get X" (display), its tag, licence and repo chips, Deploy to Cloud / Self-host as text links, and
     Hanzo's "Paste and ship" prompt card; then related capabilities as cards that open into their pages (Morph).
   - The band (class x-band, so the site's ask bar steps aside): head, lede, the one solid button (the hero's ask, same
     words and href, data-cta="close"), and text links. With no head, the band is left out.
   - children render under the prompt row (a page's own extra, e.g. a builder). The only idle mover is the prompt caret. */
import { Copy } from '../ui';
import { A, Cta } from '../kit';
import './x-hamilton/Launch.css';

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

export default function Finale({ name, prompt, api, head, lede, small, ask, links = [], tag, license = 'Apache-2.0', repo = ['hanzoai', 'https://github.com/hanzoai'], stars, deploy = 'https://platform.hanzo.ai/deploy', self, related, relTitle = 'Related capabilities', children, className = '' }) {
  return (
    <>
      <section className={'l2-fin ' + className}>
        <div className="l2-wrap">
          <div className="l2-get">
            <div className="l2-get-h">
              <h2 className="l2-display m">Get {name}</h2>
              {tag && <p className="l2-get-tag">{tag}</p>}
              <div className="l2-get-meta">
                {license && <span className="l2-chip"><span>License:</span> {license}</span>}
                {repo && <A to={repo[1]} className="l2-chip"><Gh />{repo[0]}{stars && <em>{stars}</em>}</A>}
              </div>
              <div className="l2-get-links">
                {deploy && <Cta to={deploy} kind="link" id="deploy">Deploy to Cloud</Cta>}
                {self && <Cta to={self} kind="link" id="self-host">Self-host</Cta>}
              </div>
            </div>
            {prompt && <div className="l2-get-pr"><Prompt name={name} prompt={prompt} api={api} /></div>}
          </div>
          {children && <div className="l2-fin-extra">{children}</div>}
          {related && (
            <div className="l2-rel">
              <p className="l2-kick">{relTitle}</p>
              <ul>{related.map(([t, to, d]) => <li key={t}><A to={to} className="l2-rel-a"><b data-morph>{t}</b>{d && <span>{d}</span>}<i aria-hidden="true">→</i></A></li>)}</ul>
            </div>
          )}
        </div>
      </section>
      {head && (
        <section className="x-band l2-band" data-room="dark">
          <div className="l2-wrap">
            <h2 className="l2-head l2-band-h">{head}</h2>
            {lede && <p className="l2-lede">{lede}</p>}
            {small && <p className="l2-band-s">{small}</p>}
            <div className="l2-band-acts">
              {ask && <Cta to={ask[1]} id="close" size="lg">{ask[0]}</Cta>}
              {links.map(([t, to]) => <Cta key={t} to={to} kind="link" id={'close-' + t.toLowerCase().replace(/\W+/g, '-')}>{t}</Cta>)}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
