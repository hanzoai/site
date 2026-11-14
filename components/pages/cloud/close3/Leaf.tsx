'use client';
/* Page-local copies of Frame's Code and Paste for /pubsub, /realtime, /s3, /playground and /registry (same markup and classes, so Frame.css
   styles them as before), with one change each so Hanzo's lines read whole (docs/build-notes/COPY-RULE.md, copycheck): every code
   line is one element holding exactly that line (a marked line: before, the mark, after), the prompt is one element holding exactly Hanzo's prompt, and the
   api tag is one element ("api /v1/…"), never split into finer spans. A whole comment line keeps the grey (class c). */
import type React from 'react';
import { useState } from 'react';
import { Rise, Copy } from '../../../ui';
import '../Frame.css';
import './Leaf.css';

/* a tab of code: its file or verb, and the code */
interface Tab { k: string; code: string }
interface LeafCodeProps {
  tabs: Tab[];
  title: string;
  light?: boolean;
  mark?: string;
  className?: string;
}
export function LeafCode({ tabs, title, light, mark, className = '' }: LeafCodeProps) {
  const [at] = useState(0);
  const cur = tabs[at];
  return (
    <div className={`cf-code ${light ? 'lt' : ''} ${className}`} data-title={title}>
      <div className="cf-code-bar">
        <i /><i /><i />
        <span className="cf-code-k">{cur.k}</span>
        <Copy text={cur.code} />
      </div>
      <div className="cf-code-body">
        <pre><code>{cur.code.split('\n').map((l, j) => {
          const c = 'cf-ln' + (/^\s*(#|\/\/)/.test(l) ? ' c' : '');
          if (!mark || !l.includes(mark)) return <span key={j} className={c}>{l + '\n'}</span>;
          // a marked line: the mark is its own element holding exactly the marked words, the rest of the line either side
          const k = l.indexOf(mark);
          return <span key={j} className={c}><span>{l.slice(0, k)}</span><span key={mark} className="cf-mark">{mark}</span><span>{l.slice(k + mark.length) + '\n'}</span></span>;
        })}</code></pre>
      </div>
    </div>
  );
}

interface LeafPasteProps {
  name: string;
  prompt: string;
  api?: string;
  dark?: boolean;
  aside?: React.JSX.Element;
  className?: string;
}
export function LeafPaste({ name, prompt, api, dark, aside, className = '' }: LeafPasteProps) {
  return (
    <Rise className={`cf-paste ${dark ? 'dark' : ''} ${className}`}>
      <div className="cf-paste-h">
        <p className="cf-paste-t">Paste and ship</p>
        <p className="cf-paste-d">Paste this into any agent. It reads the skill manifest and calls {name} from there.</p>
        {aside}
      </div>
      <div className="cf-paste-box">
        <div className="cf-paste-bar">
          <span className="cf-paste-k">Agent prompt</span>
          {api && <span className="cf-api">{'api ' + api}</span>}
          <Copy text={prompt} />
        </div>
        <pre className="cf-paste-code"><span className="cf-paste-p">{prompt}</span><span className="cf-caret" aria-hidden="true" /></pre>
      </div>
    </Rise>
  );
}
