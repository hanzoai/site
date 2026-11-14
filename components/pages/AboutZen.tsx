'use client';
/* About, part 5: the Zen of Hanzo, a plain quick section (the pinned scene is gone: James's motion map gives /about no
   split screen). Six principles, each with its line, in a 3 × 2 index; a hand on one lifts it into ink. The section
   enters with `letter-cascade` (components/pages/about/enter.css): the heading's and the principles' letters fall into
   place one by one. The letters are aria-hidden; each name is read once from a visually hidden copy. Styles in About.css. */
import type { ReactNode } from 'react';
import { Cta } from '../kit';

interface Link2Props {
  to: string;
  children: ReactNode;
}
const Link2 = ({ to, children }: Link2Props) => <Cta to={to} kind="link">{children}</Cta>;
const pad = (n: number) => String(n).padStart(2, '0');

const ZEN = [
  ['Enable the Underdog', 'Enable others to win. Democratize technology so small businesses and startups can compete with industry giants.'],
  ['Data-Driven Everything', 'Let data be your guide. Embrace analytics and AI as the foundation of decision-making.'],
  ['Open Innovation', 'Be open, share often. Openness accelerates growth—both for the company and its community.'],
  ['Adaptability', 'Pivot with purpose. There is no failure, only feedback. Move quickly and strike in new directions when opportunity calls.'],
  ['Customer-Centric Growth', 'Treat each client as a long-term partner and guide them to success.'],
  ['First Principles Thinking', 'See the invisible, do the impossible. Boil problems down to their essence and solve them in fundamentally better ways.'],
];

/* letters for the cascade: a running index (--k) so they fall one after another across the whole name */
interface LettersProps {
  text: string;
  from?: number;
}
function Letters({ text, from = 0 }: LettersProps) {
  return (
    <>
      <span className="x-vh">{text}</span>
      <span className="xab-lc" aria-hidden="true">
        {[...text].map((ch, i) => <span key={i} style={{ '--k': from + i }}>{ch === ' ' ? ' ' : ch}</span>)}
      </span>
    </>
  );
}

export default function Zen() {
  return (
    <section className="v2s-sec zf-sec xab-zen" id="zen" aria-labelledby="xab-zen-h" data-enter="letter-cascade">
      <div className="v2s-wrap">
        <div className="zf-head xab-zen-head">
          <div className="xab-hl">
            <p className="v2s-cap">Operating Principles</p>
            <h2 id="xab-zen-h" className="xab-zen-h"><Letters text="The Zen of Hanzo" /></h2>
          </div>
          <div className="xab-zen-l">
            <p className="v2s-lede">The principles the company argues from when a decision is close.</p>
            <Link2 to="/philosophy">Explore the full Zen manifesto</Link2>
          </div>
        </div>
        <ol className="xab-zen-list">
          {ZEN.map(([t, d], i) => (
            <li key={t} style={{ '--z': i }}>
              <span className="xab-zen-n v2s-num" aria-hidden="true">{pad(i + 1)}</span>
              <b className="xab-zen-t"><Letters text={t} from={16 + i * 4} /></b>
              <p className="xab-zen-d">{d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
