'use client';
/* ShipPrompt (owner: Cloud 2 chat). The cloud family's "Paste and ship", at v2 scale: one big prompt card you copy
   into any agent, with this product's related links as a quiet row underneath.
   Usage: <ShipPrompt name="Gateway" prompt="Read https://hanzo.ai/skill.md and use …" api="/v1/gateway"
            related={[[title, href, line?], …]} relatedTitle="Related capabilities" flip />
   Words are Hanzo's own (they are the live pages' words). The prompt is the kit's CodeBlock (copy equals display).
   Styles: ShipPrompt.css (prefix sp-). */
import { A, CodeBlock } from '../kit';
import './ShipPrompt.css';

const arrow = <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;

export default function ShipPrompt({ name, prompt, api, related, relatedTitle = 'Related capabilities', flip, children, className = '' }) {
  return (
    <section className={`sp v2-sec ${flip ? 'sp-flip' : ''} ${className}`}>
      <div className="v2-wrap v2-grid sp-grid">
        <div className="sp-copy">
          <h2 className="v2-headline sp-h">Paste and ship</h2>
          <p className="v2-body sp-d">Paste this into any agent. It reads the skill manifest and calls {name} from there.</p>
          {children}
        </div>
        <div className="sp-card">
          {api && <p className="sp-api"><i>api</i>{api}</p>}
          <CodeBlock code={prompt} label="Agent prompt" className="sp-code" />
        </div>
        {related && (
          <nav className="sp-rel" aria-label={relatedTitle}>
            <p className="v2-kick">{relatedTitle}</p>
            <ul>
              {related.map(([t, to, d]) => (
                <li key={t}>
                  <A to={to} className="sp-rel-a"><b>{t}</b>{d && <span>{d}</span>}{!t.endsWith('→') && arrow}</A>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </section>
  );
}
