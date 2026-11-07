'use client';
/* BizPaste: the agent prompt box ("Paste and ship"), word for word as cloud/Frame.jsx's Paste, but with no fade-in, so
   it reads with JavaScript off and stays inside the motion budget. Owned by the Business 1 chat.
   Usage: <BizPaste name="Ledger" prompt="Read https://hanzo.ai/skill.md and use Hanzo Ledger in my project." className="ld-paste" />
   Styles are Frame.css's cf-paste rules (imported here), so it looks like the cloud pages' box; restyle per page. */
import { Copy } from '../ui';
import '../pages/cloud/Frame.css';

export default function BizPaste({ name, prompt, api, dark, className = '' }) {
  return (
    <div className={`cf-paste ${dark ? 'dark' : ''} ${className}`}>
      <div className="cf-paste-h">
        <p className="cf-paste-t">Paste and ship</p>
        <p className="cf-paste-d">Paste this into any agent. It reads the skill manifest and calls {name} from there.</p>
      </div>
      <div className="cf-paste-box">
        <div className="cf-paste-bar">
          <span className="cf-paste-k">Agent prompt</span>
          {api && <span className="cf-api"><i>api</i>{api}</span>}
          <Copy text={prompt} />
        </div>
        <pre className="cf-paste-code"><code>{prompt}</code><span className="cf-caret" aria-hidden="true" /></pre>
      </div>
    </div>
  );
}
