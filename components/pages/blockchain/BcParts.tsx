'use client';
/* Parts of the /blockchain/<product> template (BlockPage), kept here so each file stays within its motion budget.
   - Picks: a short list (Built For) as one object: the titles are a selector with an ink bar that glides to the one
     you point at, focus or tap; its sentence and link cross-fade in the panel beside it. It walks the list once by
     itself when it reaches the screen, then waits for you. Every sentence stays in the HTML.
   - Chains: Supported Chains as one object: this product's chains are pills; the panel beside them answers for the
     picked chain (named here or not, and which other Web3 products name it), cross-fading on each pick. Every chain
     Hanzo lists across its Web3 products sits collapsed behind one "Show all" (hidden="until-found", so find-in-page
     and JS-off still reach it).
   - TiltRail: the "next product" rail tilts the card under a fine pointer by up to 2.5 degrees (none on touch or
     under reduced motion). */
import type { ReactNode } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'motion/react';
import Sigil from '../../Sigil';
import { A } from '../../kit';
import FamLines from '../../v2/FamLines';
import { ui } from '../../v2/famUi';
import type { ChainsBlock, Cover, ItemsBlock } from './types';

interface PicksProps {
  b: ItemsBlock;
}
export function Picks({ b }: PicksProps) {
  const box = useRef<HTMLElement>(null);
  const seen = useInView(box, { amount: 0.5 });
  const calm = useReducedMotion();
  const n = b.items.length;
  const [at, setAt] = useState(0);
  const [mine, setMine] = useState(false); // the visitor has taken over: no more walking
  const [walked, setWalked] = useState(false);
  useEffect(() => {
    if (!seen || mine || walked || calm || n < 2) return;
    const t = setTimeout(() => { const nx = at + 1; if (nx >= n) { setWalked(true); setAt(0); } else setAt(nx); }, 2600);
    return () => clearTimeout(t);
  }, [seen, mine, walked, calm, n, at]);
  const pick = (k: number) => { setMine(true); setAt(k); };
  return (
    <section className="v2f-sec xb3-picks" ref={box}>
      <div className="v2f-wrap v2f-grid">
        <header className="xb3-picks-h">
          {b.title && <FamLines as="h2" play="view" className="v2f-head" text={b.title} />}
          {b.lede && <p className="v2f-lede">{b.lede}</p>}
        </header>
        <div className="xb3-picks-o" style={{ '--at': at, '--n': n }}>
          <ol className="xb3-pl">
            <i className="xb3-bar" aria-hidden="true" />
            {b.items.map((it, k) => (
              <li key={it.title}>
                <button type="button" aria-pressed={k === at} aria-controls={'xb3-pp-' + k} onPointerEnter={(e) => e.pointerType === 'mouse' && pick(k)} onFocus={() => pick(k)} onClick={() => pick(k)}>
                  <span className="x-mono" aria-hidden="true">{String(k + 1).padStart(2, '0')}</span>
                  <h3>{it.title}</h3>
                </button>
              </li>
            ))}
          </ol>
          <div className="xb3-pp">
            {b.items.map((it, k) => (
              <div key={it.title} id={'xb3-pp-' + k} className="xb3-pp-i" data-on={k === at ? '' : undefined}>
                <span className="xb3-pp-n v2f-num" aria-hidden="true">{String(k + 1).padStart(2, '0')}</span>
                {it.text && <p>{it.text}</p>}
                {it.link && <A to={it.link.href} className="x-arrow" tabIndex={k === at ? undefined : -1}><span>{it.link.label}</span></A>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

interface ChainsProps {
  b: ChainsBlock;
  all: Cover[];
  self: string;
  seed: string;
}
export function Chains({ b, all, self, seed }: ChainsProps) {
  const [pick, setPick] = useState(b.chains[0]);
  const [open, setOpen] = useState(false);
  const every = useMemo(() => [...new Set(all.flatMap((p) => p.chains))], [all]);
  const every_ = useRef<HTMLDivElement>(null);
  useEffect(() => { // find-in-page opens the collapsed list (hidden="until-found")
    const el = every_.current;
    if (!el) return;
    const on = () => setOpen(true);
    el.addEventListener('beforematch', on);
    return () => el.removeEventListener('beforematch', on);
  }, []);
  useEffect(() => { // React writes hidden as a plain boolean, so the until-found value is set here (JS off: the list shows)
    const el = every_.current;
    if (el) open ? el.removeAttribute('hidden') : el.setAttribute('hidden', 'until-found');
  }, [open]);
  const yes = b.chains.includes(pick);
  const others = all.filter((p) => p.slug !== self && p.chains.includes(pick));
  const choose = (c: string) => setPick(c); // aria-pressed: the sound kit ticks by itself
  return (
    <section className="v2f-sec xb3-chains">
      <div className="v2f-wrap v2f-grid">
        <div className="xb3-chains-l">
          <FamLines as="h2" play="view" className="v2f-head" text={b.title} />
          <ul className="xb2-chiplist">{b.chains.map((c) => <li key={c}><button type="button" aria-pressed={c === pick} onClick={() => choose(c)}>{c}</button></li>)}</ul>
          {every.length > b.chains.length && (
            <>
              <button type="button" className="xb3-more" aria-expanded={open} aria-controls="xb3-every" onClick={() => setOpen(!open)}>
                <span>{ui('oss_show_all')}</span><b className="x-mono">{every.length}</b><i aria-hidden="true" />
              </button>
              <div id="xb3-every" className="xb3-every" role="group" aria-label={b.title} ref={every_}>
                {every.map((c) => <button key={c} type="button" aria-pressed={c === pick} className={b.chains.includes(c) ? 'in' : ''} onClick={() => choose(c)}>{c}</button>)}
              </div>
            </>
          )}
        </div>
        <div className="xb3-ans" aria-live="polite">
          <div className="xb3-ans-sig" aria-hidden="true"><Sigil seed={seed + '#' + pick} data={[b.chains.length, Math.max(1, b.chains.indexOf(pick) + 1)]} /></div>
          <div className="xb3-ans-in" key={pick}>
            <p className={'xb3-verdict' + (yes ? ' yes' : '')}>
              <i role="img" aria-label={ui(yes ? 'named_here' : 'not_named_here')}>{yes ? '✓' : '–'}</i>
              <b>{pick}</b>
            </p>
            <p className="xb3-ans-n x-mono" aria-hidden="true"><b>{others.length}</b> / {all.length - 1}</p>
            <ul aria-label={ui('others_name') + ' ' + pick}>{others.map((p) => <li key={p.slug}><A to={p.href}>{p.name}</A></li>)}</ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* the next-product rail: a 2.5 degree tilt toward a fine pointer (MASTER 3.1), flat again on leave */
interface TiltRailProps {
  children: ReactNode;
}
export function TiltRail({ children }: TiltRailProps) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !matchMedia('(pointer: fine), (pointer: none)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let last: HTMLElement | null = null;
    const flat = (c: HTMLElement | null) => { if (c) { c.style.removeProperty('--rx'); c.style.removeProperty('--ry'); } };
    const move = (e: PointerEvent) => {
      const c = e.target instanceof Element ? e.target.closest<HTMLElement>('.v2f-next-c') : null;
      if (c !== last) { flat(last); last = c; }
      if (!c) return;
      const r = c.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      c.style.setProperty('--ry', (x * 5).toFixed(2) + 'deg');
      c.style.setProperty('--rx', (-y * 5).toFixed(2) + 'deg');
    };
    const leave = () => { flat(last); last = null; };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); };
  }, []);
  return <div ref={ref} className="xb3-tilt">{children}</div>;
}
