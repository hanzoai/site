'use client';
/* Parts of the /integrations/<tool> guide: the window that types Hanzo's own lines into a sample, the window each
   chapter shows (one window: its tabs are every sample, the one on screen marked), and the "Only the Hanzo lines"
   switch they all share. Code is always in the HTML in full. Ink and greys only: tokens differ by weight and grey
   step (every grey at 4.5:1 or better), never by hue (MASTER.md 3.1); Hanzo's lines are marked in the gutter. */
import { useEffect, useMemo, useRef, useState } from 'react';
import type { MouseEvent, ReactNode } from 'react';
import { useInView, useReducedMotion } from 'motion/react';
import { Copy } from '../../ui';
import { ui } from '../../v2/famUi';
import { play } from '../../../lib/sound';
import { Loose } from '../models/parts';
import type { Child } from '../htmltree';
import type { Code, Sample, Token } from './intData.types';

/* Hanzo's rich lines (a sentence with a link or code inside): each loose run of words sits in its own span, so every
   line of Hanzo's copy is one whole element of its own (what the copy check reads), with the words unchanged */
export function Leaf({ nodes }: { nodes?: Child[] | null }) {
  return (nodes || []).map((n, i) => (typeof n === 'string' ? <span key={i}>{n}</span> : <Loose key={i} nodes={[n]} />));
}

export const HANZO = /hanzo/i;
export const lineText = (l: Token[]) => l.map((t) => t[1]).join('');
export const hitsOf = (code: Code | null | undefined) => {
  const lines: Token[][] = code ? code.lines : [];
  return { hits: lines.filter((l) => HANZO.test(lineText(l))).length, of: lines.filter((l) => l.length).length };
};

/* a JSON sample that opens with // comment lines does not parse: the comment becomes a caption over the code (the
   same words), and Copy hands over only the JSON (MASTER.md part 16) */
export function splitSample(sample: Sample): { code: Code | null; caption: string[] } {
  const code = sample.code;
  if (!code || !/^json/i.test(sample.lang || '')) return { code, caption: [] };
  let k = 0;
  while (k < code.lines.length && /^\s*\/\//.test(lineText(code.lines[k]))) k++;
  if (!k) return { code, caption: [] };
  const lines = code.lines.slice(k);
  return { caption: code.lines.slice(0, k).map((l) => lineText(l).trim()), code: { ...code, lines, text: lines.map(lineText).join('\n').trim() } };
}

/* a press on a link to another page lands on that page's top at once. Hanzo's own stylesheet asks for smooth
   scrolling, which on a phone (no Lenis) would show the new page at the old offset and then glide it up; for the length
   of the page change only, the jump is instant. Used as onClickCapture on the page's <main>. */
export function landAtTop(e: MouseEvent) {
  const t = e.target as Element;
  const a = t.closest && t.closest<HTMLAnchorElement>('a[href^="/"]');
  if (!a || new URL(a.href).pathname === location.pathname) return;
  const h = document.documentElement;
  h.style.scrollBehavior = 'auto';
  setTimeout(() => h.style.removeProperty('scroll-behavior'), 1500);
}

/* the code itself: numbered lines, tokens set apart by weight and grey, Hanzo's lines marked in the gutter */
export function Lines({ code, only, typed, label }: { code: Code; only: boolean; typed?: boolean; label: string }) {
  return (
    <pre className={'xig-pre' + (only ? ' only' : '')} tabIndex={0} aria-label={label} data-lenis-prevent data-swipe-own>
      <code>
        {code.lines.map((l, j) => {
          const hz = HANZO.test(lineText(l));
          const h = hz ? code.lines.slice(0, j).filter((x) => HANZO.test(lineText(x))).length : 0; // its turn among Hanzo's lines
          // the line's own indent sits in its own span, so a phone can draw it as a hanging indent instead (same text)
          const lead = lineText(l).match(/^[ \t]*/)![0]; // the pattern matches the empty string, so it always matches
          const ind = lead.length < lineText(l).length ? lead.replace(/\t/g, '    ').length : 0; // a blank line has none
          let cut = ind ? lead.length : 0;
          const toks = cut ? l.map(([k, x]): Token => { const take = Math.min(cut, x.match(/^[ \t]*/)![0].length); cut -= take; return [k, x.slice(take)]; }) : l;
          const style = hz || ind ? { ...(hz ? { '--h': h } : {}), ...(ind ? { '--ind': ind } : {}) } : undefined;
          return (
            <span key={j} className={'xig-ln' + (hz ? ' hz' : '')} style={style}>
              {ind > 0 && <span className="xig-ind">{lead}</span>}
              {l.length ? toks.map(([k, x], n) => (x ? <span key={n} className={'c-' + k} data-t={typed && hz ? '' : undefined}>{x}</span> : null)) : ' '}{'\n'}
            </span>
          );
        })}
      </code>
    </pre>
  );
}

/* the switch: dims every line that is not about Hanzo, in every window on the page. It only appears where it means
   something (some lines point at Hanzo, not all of them). */
export function Only({ only, setOnly, code, dark }: { only: boolean; setOnly: (on: boolean) => void; code: Code | null; dark?: boolean }) {
  const { hits, of } = hitsOf(code);
  if (!hits || hits >= of) return null;
  return (
    <div className={'xig-only' + (dark ? ' dark' : '')}>
      <button type="button" aria-pressed={only} onClick={() => setOnly(!only)} className="xig-switch">
        <i aria-hidden="true" />
        <span>{ui('int_only')}</span>
      </button>
      <span className="x-mono xig-hits" aria-live="polite"><b>{hits}</b><span aria-hidden="true"> / </span><span className="x-sr"> {ui('of')} </span>{of}<span className="x-sr"> {ui('int_hits')}</span></span>
    </div>
  );
}

/* the hero's window: the sample is whole from the first paint except Hanzo's own lines, which type themselves in
   (CSS keeps them invisible from the first paint, so nothing blinks). Speed is by time, not frames. Stop finishes it
   at once; replay types the Hanzo lines again (WCAG 2.2.2). Reduced motion and JS off show every line. */
export function Editor({ sample, only, setOnly, aside, name, face }: { sample: Sample; only: boolean; setOnly: (on: boolean) => void; aside: ReactNode; name: string; face: string }) {
  const box = useRef<HTMLDivElement>(null);
  const seen = useInView(box, { once: true, amount: 0.15 });
  const calm = useReducedMotion();
  const [state, setState] = useState<'rest' | 'typing' | 'done'>('rest'); // rest (Hanzo lines waiting) → typing → done
  const [run, setRun] = useState(0);
  const stop = useRef<(() => void) | null>(null);
  const { code, caption } = useMemo(() => splitSample(sample), [sample]);
  useEffect(() => {
    if (calm || !code) { setState('done'); return; }
    if (!seen) return;
    const pre = box.current?.querySelector('.xig-pre');
    if (!pre) return;
    const spans = [...pre.querySelectorAll('[data-t]')];
    const full = spans.map((s) => s.textContent || '');
    const total = full.reduce((a, t) => a + t.length, 0);
    if (!total) { setState('done'); return; }
    const parts = spans.map((s, n) => {
      const typed = document.createTextNode('');
      const ghost = document.createElement('span');
      ghost.className = 'xig-ghost';
      ghost.textContent = full[n];
      s.textContent = '';
      s.append(typed, ghost);
      return { typed, ghost };
    });
    const caret = document.createElement('i');
    caret.className = 'xig-caret';
    caret.setAttribute('aria-hidden', 'true');
    setState('typing');
    const ms = Math.min(2200, Math.max(900, total * 18)); // Hanzo's lines in about a second or two
    let raf = 0;
    const t0 = performance.now() + 250;
    const finish = () => { cancelAnimationFrame(raf); caret.remove(); spans.forEach((s, n) => { s.textContent = full[n]; }); setState('done'); };
    stop.current = finish;
    const step = (t: number) => {
      const want = Math.max(0, Math.min(total, Math.round(((t - t0) / ms) * total)));
      let left = want, at: (typeof parts)[number] | null = null;
      for (const [n, p] of parts.entries()) {
        const take = Math.min(left, full[n].length);
        left -= take;
        if (p.typed.data.length !== take) { p.typed.data = full[n].slice(0, take); p.ghost.textContent = full[n].slice(take); }
        if (!at && take < full[n].length) at = p;
      }
      if (at && at.ghost.previousSibling !== caret) at.ghost.before(caret);
      if (want < total) raf = requestAnimationFrame(step);
      else { finish(); play('done'); } // the demo has finished on its own: the kit's faint chime
    };
    raf = requestAnimationFrame(step);
    return () => { cancelAnimationFrame(raf); caret.remove(); spans.forEach((s, n) => { s.textContent = full[n]; }); stop.current = null; };
  }, [seen, calm, code, run]);
  const ctl = state === 'typing'
    ? <button type="button" className="xig-ctl" aria-label={ui('stop')} onClick={() => stop.current && stop.current()}><svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><rect x="3.5" y="3.5" width="9" height="9" rx="1.5" fill="currentColor" /></svg></button>
    : state === 'done' && !calm
      ? <button type="button" className="xig-ctl" aria-label={ui('replay')} onClick={() => setRun((r) => r + 1)}><svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3.2 8a4.8 4.8 0 1 0 1.5-3.5M3.2 2.6v2.6h2.6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
      : null;
  return (
    <div className={'xig-ed ' + face} ref={box} data-state={state}>
      <div className="xig-ed-bar">
        <span className="xig-dots" aria-hidden="true"><i /><i /><i /></span>
        <span className="xig-tab">{sample.title}</span>
        {sample.lang && <span className={'x-mono xig-lang' + (sample.lang.toLowerCase() === sample.title.toLowerCase() ? ' same' : '')}>{sample.lang}</span>}
        <span className="xig-ctl-slot">{ctl}</span>
        {code && <Copy text={code.text} label={ui('int_copy')} className="xig-copy" />}
      </div>
      <div className="xig-ed-g">
        <div className="xig-ed-code">
          {caption.map((c) => <p key={c} className="xig-cap x-mono">{c}</p>)}
          {code ? <Lines code={code} only={only} typed label={name + ': ' + sample.title} /> : null}
          {code && <Only only={only} setOnly={setOnly} code={code} />}
        </div>
        {aside && <aside className="xig-ed-side">{aside}</aside>}
      </div>
    </div>
  );
}

/* a chapter's picture: one window. Its tabs are every sample of the chapters (the one on screen marked), so as the
   chapters change, the same window turns to its next tab and its code changes with the heading. */
type LooseView = typeof Loose;
export function CodeCard({ sample, only, Loose, name, tabs, at }: { sample: Sample; only: boolean; Loose: LooseView; name: string; tabs: string[]; at: number }) {
  const { code, caption } = useMemo(() => splitSample(sample), [sample]);
  return (
    <div className="xig-card">
      <div className="xig-card-bar">
        <span className="xig-tabs">
          {/* each tab takes you to its chapter (the scene's own chapter marks do the scrolling) */}
          {tabs.map((t, k) => (
            <button key={t + k} type="button" tabIndex={-1} className={'xig-tabs-i' + (k === at ? ' on' : '')} aria-current={k === at ? 'step' : undefined}
              onClick={(e) => e.currentTarget.closest('.v2f-ch')?.querySelectorAll<HTMLButtonElement>('.v2f-ch-nav button')[k]?.click()}>{t}</button>
          ))}
        </span>
        <span className="xig-card-t">{sample.title}</span>
        {sample.lang && <span className={'x-mono xig-lang' + (sample.lang.toLowerCase() === sample.title.toLowerCase() ? ' same' : '')}>{sample.lang}</span>}
        {code && <Copy text={code.text} label={ui('int_copy')} className="xig-copy" />}
      </div>
      {caption.map((c) => <p key={c} className="xig-cap x-mono">{c}</p>)}
      {code ? <Lines code={code} only={only} label={name + ': ' + sample.title} /> : <div className="xig-prose"><Loose nodes={sample.nodes} /></div>}
    </div>
  );
}

/* each tool's mark, set in type (no emoji, no borrowed logo): two letters from its own name, like a table of elements.
   Words such as SDK, AI and .dev are dropped; a single word gives its first two letters, several give their initials. */
const SKIP = /^(sdk|ai|\.dev)$/i;
export function monoOf(name = '') {
  const words = name.replace(/\.dev$/i, '').split(/\s+/).filter((w) => w && !SKIP.test(w));
  const parts = words.length > 1 ? words : (words[0] || '').split(/(?<=[a-z])(?=[A-Z])/).filter((w) => !SKIP.test(w));
  if (parts.length > 1 && parts[0].length > 1) return (parts[0][0] + parts[1][0]).toUpperCase();
  const w = parts.join('');
  return w.slice(0, 1).toUpperCase() + w.slice(1, 2).toLowerCase();
}
