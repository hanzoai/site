'use client';
/* KeynoteClose: the one call to action that ends a cloud launch page. "Get X" set huge, its line, licence and source,
   where to run it, and Hanzo's "Paste and ship" agent prompt as a real terminal you can copy from.
   By default it is the page's dark room (KeynoteRoom: the dark opens out to full width as it arrives).
   Owned by the Cloud 1 chat.
   Usage:
     <KeynoteClose name="Engine" tag="AI inference engine" prompt="Read https://hanzo.ai/skill.md and …"
                   lead="Get started with Hanzo Engine" api="/v1/engine" />
   - light: render on white instead (when the page's dark room is elsewhere).
   - license, repo [label, href], stars, deploy, self: as on Hanzo's own "Get X" block.
   - children: anything else Hanzo's page has in its closing (links, notes), shown under the actions.
   - lead: Hanzo's line, set under "Get X" (never above it). cta: the data-cta id of "Deploy to Cloud". */
import { Copy, Magnetic } from '../ui';
import { A, Cta } from '../kit';
import KeynoteRoom from './KeynoteRoom';
import KeynoteLines from './KeynoteLines';
import './Keynote.css';
import './KeynoteClose.css';

const Gh = () => <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" /></svg>;

function Body({ name, tag, lead, prompt, api, cta = 'close', license = 'Apache-2.0', repo = ['hanzoai', 'https://github.com/hanzoai'], stars, deploy = 'https://platform.hanzo.ai/deploy', self, children, light }) {
  return (
    <div className="kn-wrap knx-in">
      <KeynoteLines as="h2" className="kn-display md knx-h" lines={`Get ${name}`} />
      {lead && <p className="kn-kick knx-lead">{lead}</p>}
      <div className="kn-grid knx-g">
        <div className="knx-l">
          {tag && <p className="kn-lede knx-tag">{tag}</p>}
          <div className="knx-meta">
            {license && <span className="knx-chip"><span>License:</span> {license}</span>}
            {repo && <A to={repo[1]} className="knx-chip"><Gh />{repo[0]}{stars && <em>{stars}</em>}</A>}
          </div>
          <div className="kn-acts knx-acts">
            {deploy && <Magnetic strength={0.2}><Cta to={deploy} id={cta} className="knx-go">Deploy to Cloud</Cta></Magnetic>}
            {self && <Cta to={self} kind="quiet" id={cta + '-self'} className="knx-self">Self-host</Cta>}
          </div>
          {children}
        </div>
        {prompt && (
          <div className="knx-paste">
            <p className="kn-title knx-pt">Paste and ship</p>
            <p className="knx-pd">Paste this into any agent. It reads the skill manifest and calls {name} from there.</p>
            <div className="knx-term">
              <div className="knx-bar">
                <i /><i /><i />
                <span className="knx-k">Agent prompt</span>
                {api && <span className="knx-api"><i>api</i>{api}</span>}
                <Copy text={prompt} />
              </div>
              <pre className="knx-code"><code>{prompt}</code><span className="knx-caret" aria-hidden="true" /></pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function KeynoteClose(props) {
  if (props.light) return <section className={'kn-sec knx light ' + (props.className || '')}><Body {...props} /></section>;
  return <KeynoteRoom className={'kn-sec knx ' + (props.className || '')}><Body {...props} /></KeynoteRoom>;
}
