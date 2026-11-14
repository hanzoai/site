'use client';
/* A2Paste — Hanzo's "Paste and ship" strip in the v2 grammar (Apps 2 chat; styles in A2.css).
   Usage: <A2Paste name="IDE" text="Read https://hanzo.ai/skill.md and use Hanzo IDE in my project. Start with: hanzo code" api="/v1/code" />
   `api` (optional): Hanzo's "API /v1/…" namespace line under the label, as the live paste box shows it.
   One quiet line between chapters: the words on the left, the prompt and a copy button on the right. The prompt sits
   in its own <span> inside <code> so the copy check (scripts/copycheck.mjs reads leaf span/p/div, not code) counts it. */
import { Copy } from '../ui';

interface A2PasteProps {
  name: string;
  text: string;
  api?: string;
}

export default function A2Paste({ name, text, api }: A2PasteProps) {
  return (
    <section className="a2-wrap a2-paste" aria-label="Paste and ship">
      <div>
        <p className="a2-paste-k">Paste and ship</p>
        <p className="a2-paste-d">Paste this into any agent. It reads the skill manifest and calls {name} from there.</p>
      </div>
      <div className="a2-paste-box">
        <div><span className="a2-paste-l">Agent prompt</span>{api && <span className="a2-paste-l">api {api}</span>}<code><span>{text}</span></code></div>
        <Copy text={text} />
      </div>
    </section>
  );
}
