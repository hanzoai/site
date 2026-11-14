'use client';
/* GetIt (owner: Cloud 2 chat). The one closing call to action for a cloud product page, at v2 scale: "Get X" as display
   type, its line, licence and source, and where to run it, beside the product's own Sigil (a contour field drawn from
   that product's real figures, so no two product pages close on the same picture).
   Usage: <GetIt name="Gateway" tag="API gateway" seed="gateway" data={[429, 6]} self="https://docs…" stars="3 stars"
            repo={['hanzoai/iam', 'https://github.com/hanzoai/iam']} license="Apache-2.0" deploy="https://platform.hanzo.ai/deploy" />
   ask: [label, href, id] - the page's one ask, repeated here as the one solid button (the hero's words, so the close and
   the sticky ask bar say the same thing); "Deploy to Cloud" and "Self-host" then sit beneath it as text links.
   children: an extra line or links under the tag (a page's own words). Styles: GetIt.css (prefix gi-). */
import type { ReactNode } from 'react';
import Sigil from '../Sigil';
import { A, Cta } from '../kit';
import './GetIt.css';

const Gh = () => <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" /></svg>;

interface GetItProps {
  name: string;
  tag?: string;
  seed?: string;
  data?: ReadonlyArray<number | string>;
  license?: string;
  repo?: readonly [label: ReactNode, href: string];
  stars?: string;
  deploy?: string | null;
  self?: string;
  ask?: readonly [label: string, href: string, id?: string];
  lead?: ReactNode;
  children?: ReactNode;
  className?: string;
}

export default function GetIt({ name, tag, seed, data = [], license = 'Apache-2.0', repo = ['hanzoai', 'https://github.com/hanzoai'], stars, deploy = 'https://platform.hanzo.ai/deploy', self, ask, lead, children, className = '' }: GetItProps) {
  return (
    <section className={'gi ' + className}>
      <div className="v2-wrap gi-in">
        <div className="gi-copy">
          <h2 className="v2-display m gi-h">Get {name}</h2>
          {lead && <p className="v2-kick gi-lead">{lead}</p>}
          {tag && <p className="v2-lede gi-tag">{tag}</p>}
          <div className="gi-meta">
            {license && <span className="gi-chip"><span>License:</span> {license}</span>}
            {repo && <A to={repo[1]} className="gi-chip"><Gh /><span style={{ color: 'inherit' }}>{repo[0]}</span>{stars && <em>{stars}</em>}</A>}
          </div>
          {children}
          {ask ? (
            <div className="gi-acts">
              <Cta to={ask[1]} id={ask[2]} size="lg">{ask[0]}</Cta>
              <p className="gi-more">
                {deploy && <Cta to={deploy} kind="link" id={(ask[2] || '').split('.')[0] + '.deploy'}>Deploy to Cloud</Cta>}
                {self && <Cta to={self} kind="link" id={(ask[2] || '').split('.')[0] + '.self-host'}>Self-host</Cta>}
              </p>
            </div>
          ) : (
            <div className="v2-acts gi-acts">
              {deploy && <Cta to={deploy} size="lg">Deploy to Cloud</Cta>}
              {self && <Cta to={self} kind="quiet" size="lg">Self-host</Cta>}
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
