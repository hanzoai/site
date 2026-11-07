'use client';
/* Parts of the /integrations/<tool> guide (v2): the editor that types its first sample by itself, the still code card
   each chapter shows, and the "Only the Hanzo lines" switch they all share. Code is always in the HTML in full; the
   typing only blanks and refills the text nodes in the browser (no React state per character). */
import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'motion/react';
import { Copy } from '../../ui';

export const HANZO = /hanzo/i;
const lineText = (l) => l.map((t) => t[1]).join('');
export const hitsOf = (code) => {
  const lines = code ? code.lines : [];
  return { hits: lines.filter((l) => HANZO.test(lineText(l))).length, of: lines.filter((l) => l.length).length };
};

/* the code itself: numbered lines, tokens coloured by kind, Hanzo's lines marked in the page's accent */
export function Lines({ code, only, typed, label }) {
  return (
    <pre className={'xig-pre' + (only ? ' only' : '')} tabIndex={0} aria-label={label} data-lenis-prevent data-swipe-own>
      <code>
        {code.lines.map((l, j) => (
          <span key={j} className={'xig-ln' + (HANZO.test(lineText(l)) ? ' hz' : '')}>
            {l.length ? l.map(([k, x], n) => <span key={n} className={'c-' + k} data-t={typed ? '' : undefined}>{x}</span>) : ' '}{'\n'}
          </span>
        ))}
      </code>
    </pre>
  );
}

/* the switch: dims every line that is not about Hanzo, in every window on the page */
export function Only({ only, setOnly, code, dark }) {
  const { hits, of } = hitsOf(code);
  return (
    <div className={'xig-only' + (dark ? ' dark' : '')}>
      <button type="button" aria-pressed={only} onClick={() => setOnly(!only)} className="xig-switch"><i aria-hidden="true" /><span>Only the Hanzo lines</span></button>
      <span className="x-mono xig-hits" aria-live="polite">{hits} of {of} lines point at Hanzo</span>
    </div>
  );
}

/* the hero's editor: the first sample types itself, once, when the window is first seen */
export function Editor({ sample, only, setOnly, aside, name }) {
  const box = useRef(null);
  const seen = useInView(box, { once: true, amount: 0.25 });
  const calm = useReducedMotion();
  const [state, setState] = useState('rest'); // rest (full code, as served) → typing → done
  useEffect(() => {
    if (!seen || calm || !sample.code) return;
    const pre = box.current.querySelector('.xig-pre');
    const spans = [...pre.querySelectorAll('[data-t]')];
    const full = spans.map((s) => s.textContent);
    const total = full.reduce((a, s) => a + s.length, 0);
    if (!total) return;
    const caret = document.createElement('i');
    caret.className = 'xig-caret';
    caret.setAttribute('aria-hidden', 'true');
    spans.forEach((s) => { s.textContent = ''; });
    setState('typing');
    const per = Math.max(1, Math.ceil(total / (4.2 * 60))); // the whole sample in about four seconds
    let i = 0, j = 0, raf = 0, wait = 0;
    const start = performance.now() + 650;
    const step = (t) => {
      if (t < start) { raf = requestAnimationFrame(step); return; }
      if (wait > 0) { wait--; raf = requestAnimationFrame(step); return; }
      let k = per;
      while (k > 0 && i < spans.length) {
        const take = Math.min(k, full[i].length - j);
        j += take; k -= take;
        spans[i].textContent = full[i].slice(0, j);
        if (j >= full[i].length) {
          i++; j = 0;
          // a short breath at the end of each line, like a person typing
          if (i < spans.length && spans[i].parentNode !== spans[i - 1].parentNode) { wait = 3; break; }
        }
      }
      const at = spans[Math.min(i, spans.length - 1)];
      if (at && at.nextSibling !== caret) at.after(caret);
      if (i < spans.length) raf = requestAnimationFrame(step);
      else { caret.remove(); setState('done'); }
    };
    raf = requestAnimationFrame(step);
    return () => { cancelAnimationFrame(raf); caret.remove(); spans.forEach((s, n) => { s.textContent = full[n]; }); };
  }, [seen, calm, sample.code]);
  return (
    <div className="xig-ed" ref={box} data-state={state}>
      <div className="xig-ed-bar">
        <span className="xig-dots" aria-hidden="true"><i /><i /><i /></span>
        <span className="xig-tab"><span className="x-mono xig-tab-n">01</span>{sample.title}</span>
        {sample.lang && <span className="x-mono xig-lang">{sample.lang}</span>}
        {sample.code && <Copy text={sample.code.text} className="xig-copy" />}
      </div>
      <div className="xig-ed-g">
        <div className="xig-ed-code">
          {sample.code ? <Lines code={sample.code} only={only} typed label={name + ': ' + sample.title} /> : null}
          {sample.code && <Only only={only} setOnly={setOnly} code={sample.code} />}
        </div>
        {aside && <aside className="xig-ed-side">{aside}</aside>}
      </div>
    </div>
  );
}

/* a chapter's picture: one sample, still, in a card */
export function CodeCard({ sample, only, Loose, name }) {
  return (
    <div className="xig-card">
      <div className="xig-card-bar">
        <span className="xig-tab">{sample.title}</span>
        {sample.lang && <span className="x-mono xig-lang">{sample.lang}</span>}
      </div>
      {sample.code ? <Lines code={sample.code} only={only} label={name + ': ' + sample.title} /> : <div className="xig-prose"><Loose nodes={sample.nodes} /></div>}
    </div>
  );
}
