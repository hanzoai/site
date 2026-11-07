'use client';
/* A2Paste — Hanzo's "Paste and ship" strip in the v2 grammar (Apps 2 chat; styles in A2.css).
   Usage: <A2Paste name="IDE" text="Read https://hanzo.ai/skill.md and use Hanzo IDE in my project. Start with: hanzo code" />
   One quiet line between chapters: the words on the left, the prompt and a copy button on the right. */
import { Copy } from '../ui';

export default function A2Paste({ name, text }) {
  return (
    <section className="a2-wrap a2-paste" aria-label="Paste and ship">
      <div>
        <p className="a2-paste-k">Paste and ship</p>
        <p className="a2-paste-d">Paste this into any agent. It reads the skill manifest and calls {name} from there.</p>
      </div>
      <div className="a2-paste-box">
        <div><span className="a2-paste-l">Agent prompt</span><code>{text}</code></div>
        <Copy text={text} />
      </div>
    </section>
  );
}
