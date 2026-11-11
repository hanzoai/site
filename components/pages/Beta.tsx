'use client';
/* Hanzo beta (/beta): three equal-sized early-access passes (Beta access, Research access, Design partner) playing
   Enso, Zen and Kai's dark-cinema films, opening directly into each programme's full-screen application. */
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { A, Film } from '../kit';
import AskBar from '../v2/AskBar';
import { NoJs } from '../v2/LineReveal';
import { useEnter } from './beta/enter';
import { press } from '../../lib/press';
import { track } from '../../lib/track';
import '../v2/ProgramScale.css';
import './Beta.css';
import './beta/enter.css';
import './Frame.css';

const PASSES: [string, string, string, string, string][] = [
  ['a', 'Beta access', 'New releases before they ship.', '/beta/apply', 'enso'],
  ['b', 'Research access', 'Research models and checkpoints to evaluate before release.', '/beta/research', 'zen'],
  ['c', 'Design partner', 'Build it with the team. Chosen from applications.', '/beta/design', 'kai'],
];
// the program each pass opens, as the app's analytics name it
const PROGRAM: Record<string, string> = { a: 'beta', b: 'research', c: 'partner' };
const chosen = (i: number, fromKey = false) => {
  const row = PASSES[i];
  if (!row) return;
  track('beta_track_selected', { program: PROGRAM[row[0]], program_name: row[1], from_key: fromKey });
};

function Passes() {
  const router = useRouter();
  const sent = useRef(-1);

  useEffect(() => press('.xbt-pass .xbt-hit, .xbt-pass .xbt-stub', (a) => {
    const href = a.getAttribute('href') || '';
    const idx = PASSES.findIndex(([, , , to]) => href.startsWith(to));
    if (idx >= 0 && sent.current !== idx) {
      sent.current = idx;
      chosen(idx, false);
      setTimeout(() => { sent.current = -1; }, 400);
    }
  }), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
      if (document.querySelector('.x-pal, .x-pop, .x-nav-panel.open, [aria-modal="true"]')) return;
      const idx = ['a', 'b', 'c'].indexOf(e.key.toLowerCase());
      if (idx >= 0) {
        e.preventDefault();
        chosen(idx, true);
        router.push(PASSES[idx][3]);
      }
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [router]);

  const onTap = (i: number) => {
    if (sent.current === i) return;
    sent.current = i;
    chosen(i, false);
    setTimeout(() => { sent.current = -1; }, 400);
  };

  return (
    <section className="zf-sec xbt-passes" aria-labelledby="xbt-h1">
      <h1 id="xbt-h1" className="x-sr">Hanzo Beta</h1>
      <div className="xp-wrap xbt-stage">
        <ul className="xbt-grid">
          {PASSES.map(([k, t, d, to, film], i) => (
            <li key={k} className={'xbt-cell c' + i} data-enter="card" style={{ '--i': i } as React.CSSProperties}>
              <article className="xbt-pass dark" data-room="dark">
                <div className="xbt-pass-m" aria-hidden="true">
                  <Film src={`/models/${film}.webm`} poster={`/models/${film}.webp`} w={1200} h={1500} className={'xbt-pass-film ' + film} />
                </div>
                <A to={to} className="xbt-hit" aria-label={`${t} — ${d}`} onClick={() => onTap(i)} />
                <span className="xbt-key x-mono" aria-hidden="true">{k.toUpperCase()}</span>
                <span className="xbt-arrow" aria-hidden="true">
                  <svg viewBox="0 0 16 16" width="16" height="16"><path d="M4.5 11.5 11.5 4.5M6 4.5h5.5V10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </span>
                <div className="xbt-pass-b">
                  <h2 className="xp-title xbt-t">{t}</h2>
                  <p className="xbt-d">{d}</p>
                  <span className="x-arrow xbt-stub" aria-hidden="true">
                    <span>Apply</span>
                    <svg viewBox="0 0 16 16" width="14" height="14"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </span>
                </div>
              </article>
            </li>
          ))}
        </ul>
        <nav className="xbt-foot" aria-label="Beta links">
          <A to="/login?next=%2Fbeta" className="xbt-big" onClick={() => track('beta_feedback_opened', { from: 'home', program: 'none' })}>Feedback</A>
          <span className="xbt-dot" aria-hidden="true">·</span>
          <A to="/pricing" className="xbt-link" data-cta="beta.go-paid">Skip the wait, go paid</A>
          <span className="xbt-dot" aria-hidden="true">·</span>
          <a className="xbt-link" href="https://cal.com/hanzo" target="_blank" rel="noopener noreferrer" onClick={() => track('beta_call_booked', { from: 'landing' })}>Book a call<span aria-hidden="true"> ↗</span></a>
        </nav>
      </div>
    </section>
  );
}

export default function Beta() {
  const root = useRef(null);
  useEnter(root);
  useEffect(() => { track('beta_viewed', { initial_program: 'none', resumed: false }); }, []);
  return (
    <main className="xp xbt zf" ref={root}>
      <NoJs />
      <Passes />
      <AskBar title="Hanzo beta" label="Apply" to="/beta/apply" cta="beta.hero" />
    </main>
  );
}
