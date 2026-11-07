'use client';
/* GetIt (owner: Cloud 2 chat). The one closing call to action for a cloud product page, at v2 scale: "Get X" as display
   type, its line, licence and source, and where to run it, beside the product's own Sigil (a contour field drawn from
   that product's real figures, so no two product pages close on the same picture).
   Usage: <GetIt name="Gateway" tag="API gateway" seed="gateway" data={[429, 6]} self="https://docs…" stars="3 stars"
            repo={['hanzoai/iam', 'https://github.com/hanzoai/iam']} license="Apache-2.0" deploy="https://platform.hanzo.ai/deploy" />
   ask: [label, href, id] - the page's one ask, repeated here as the one solid button (the hero's words, so the close and
   the sticky ask bar say the same thing); "Deploy to Cloud" and "Self-host" then sit beneath it as text links.
   children: an extra line or links under the tag (a page's own words). Styles: GetIt.css (prefix gi-). */
import Sigil from '../Sigil';
import { A } from '../kit';
import './GetIt.css';

const Gh = () => <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" /></svg>;

const arrow = <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;

export default function GetIt({ name, tag, seed, data = [], license = 'Apache-2.0', repo = ['hanzoai', 'https://github.com/hanzoai'], stars, deploy = 'https://platform.hanzo.ai/deploy', self, ask, lead, children, className = '' }) {
  return (
    <section className={'gi ' + className}>
      <div className="v2-wrap gi-in">
        <div className="gi-copy">
          <h2 className="v2-display gi-h">Get {name}</h2>
          {lead && <p className="v2-kick gi-lead">{lead}</p>}
          {tag && <p className="v2-lede gi-tag">{tag}</p>}
          <div className="gi-meta">
            {license && <span className="gi-chip"><span>License:</span> {license}</span>}
            {repo && <A to={repo[1]} className="gi-chip"><Gh />{repo[0]}{stars && <em>{stars}</em>}</A>}
          </div>
          {children}
          {ask ? (
            <div className="gi-acts">
              <A to={ask[1]} className="v2-btn solid" data-cta={ask[2]}>{ask[0]}{arrow}</A>
              <p className="gi-more">
                {deploy && <A to={deploy} className="v2-link">Deploy to Cloud{arrow}</A>}
                {self && <A to={self} className="v2-link">Self-host{arrow}</A>}
              </p>
            </div>
          ) : (
            <div className="v2-acts gi-acts">
              {deploy && <A to={deploy} className="v2-btn solid">Deploy to Cloud</A>}
              {self && <A to={self} className="v2-btn">Self-host</A>}
            </div>
          )}
        </div>
        <div className="gi-art" aria-hidden="true">
          <Sigil seed={seed || name} data={data} className="gi-sigil" />
        </div>
      </div>
    </section>
  );
}
