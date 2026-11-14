'use client';
/* GUI (v2, archetype A "Launch"): one component, four platforms, in step.
   Persona: a front-end or mobile developer who wants one UI kit for iOS, Android, web and desktop
   Metric: github_click
   Goal: see one component render the same on four platforms, set its props from the tokens, then go to the source
   CTA: View on GitHub -> https://github.com/hanzoai/gui (hero, the site's sticky ask bar at every width, close; data-thumb, data-cta gui.hero / gui.close)
   Signature: one component, four platforms, in step. Under a centred two-line title, four device frames stand in one row
   (an iOS phone, an Android phone, a web window, a desktop window) and settle as you scroll. Hanzo's own Welcome
   component (a YStack with a Text and a Button) renders in all four; its props (p, bg, rounded) change by themselves in
   the code bar above them, and every frame springs to the new state together. The code bar carries the Pause.
   Beyond: "The shorthands are the API", in the one dark room. Set p, bg and rounded from the tokens and all four
   platforms follow; type a value that has drifted out of the design system and the typecheck fails instead of shipping.
   Not only scroll: the frames change by themselves (idle), the editor and the platform cards answer the hand (state);
   Stage and chapters are the scroll half.
   Motion: the four frames in step (hero) + the compare slider (signature) + platform cards that open.
// Motion map: signature compare; entrances split-merge, velocity-skew, domino, cursor-lens, grow-from-point
   (docs/MOTION-MAP.md, 7 Nov: no pinned chapter scene on this page. The hero's four still cycle the props; the signature
   is a divider the visitor drags across one window, Hanzo's source on one side and the platform it renders on the other;
   the five chapters are plain rows, each with its own object. Entrances, in page order: the compare's two halves split
   and merge; the chapter list leans with scroll speed; the editor's rows tip in like dominoes; a lens sweeps the
   platform cards and then follows the pointer; the close grows from the last point clicked.)
V2: 8/10 motion map: the pinned five-chapter stage is replaced by the compare signature (drag, touch, arrow keys; 50% under reduced motion) and five plain chapter rows with their own objects (render targets, the token flip, the flat rule, the primitives, the wave); five page-local entrances in the map's order, final state in the server HTML. Round 6: phone hero keeps 44px before the stage and the pinned grid leads with the object (the heading and its 0N / 06 above the two frames, the chapter's paragraph under them), so the code bar and devices are on the first screen at 375 and start at 536 of 640 at 320; render tags hang under their frames (never over a card inside a window, measured at 1470, 375, 320); token names only $4 and $8 (Hanzo's own code), no "9:41" clock; the iOS card shows its sheet at rest; the picker's closing field shows the value the YStack takes; the opened Desktop's sidebar at 10–13px; opened cards carry only words about their platform (web: the atomic-CSS sentence; the rest name and sub-label); "Get GUI" and its prompt start on one line, the h2 first; the lit chip and the cards answer hover (the sub-label slides up for the woken props). Round 5: phone rail art sized to its box (never over a card's name, 375 and 320); the hero props first change at ~0.8 s; each stage step gets ~1.08 screens so a one-screen wheel lands on all five; on phones the words sit above the pinned frames so they leave first; card→sheet morph crossfades the flying card's content (no stretch); cards tilt and wake (their props take the next state) when pointed at or focused; phone stage h2 21 over h3 17, the lit step title grows and settles; the playground's typed value is an empty dashed slot in its chip row and the typecheck sits on the closing line; the phone terminal scrolls with an edge fade; hero ask hovers #262626 and presses 1px. Round 4: one object, many states. The hero's four frames ARE the pinned stage (no second device row): the opening cycles the props, then 01 wires the one source to the four with their render tags, 02 flips the brand token on all four, 03 collapses every screen to the flat rule, 04 takes the card apart into YStack/Text/Button with the kit's primitives under it, 05 rolls each new state across the four in a wave while the buttons press themselves. Phones keep the stage pinned and swap only the words; counters agree (01–05 / 06, the dark room 06 / 06); no invented words (token names only from the page's code scale, typecheck by shape, aria from ui-strings); each opened platform carries its own chapter's sentence; cards share one baseline and lift; the ask leans to the pointer; code scrolls instead of wrapping. Round 3: the pinned title is centred on the grid and releases with the stage (one grid cell, no crossing); the lit chapter title grows 26→32px and settles; colours swap in 150ms so the ink ($accent) state never goes grey-on-grey; hero captions on one baseline; gaps under the rail and the dark room closed; a platform card opens into a full-screen page of that platform (its device large with its live props, the name at 52px) and Esc, Close or Back return it. Round 2: hydration-safe hero settle; hero devices and labels inside 801px; each platform card its own screen (iOS sheet, Android list, Web form, Desktop split) that tilts and shows its tokens, opening into a live one; the dark room is one large window the chips restyle; chapters grow in as their step arrives and count 01–05; mock buttons answer; no clipping; Deploy to Cloud sits beside the ask. Round 1: a centred 52px title over four live device frames in step (the one big thing) with a Pause; five sticky chapters explain the one component across four platforms; the graphite room is the token editor with a real typecheck; platform cards open into their device; one ask; deck colours, radii and scale, outlined frames, no springs
   Every word and link is Hanzo's. */
import type React from 'react';
import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { useEnter, useGrowFromPoint, useVelocitySkew, useLens } from './gui/GuiMotion';
import { A, Cta } from '../../kit';
import BizLines from '../../v2/BizLines';
import { EASE_OUT_EXPO, type Bezier } from '../../../lib/motion';
import { Code, useLive } from '../cloud/Frame';
import BizPaste from '../../v2/BizPaste';
import BizOpen from '../../v2/BizOpen';
import './Gui.css';

const GH = 'https://github.com/hanzoai/gui';
const DEPLOY = 'https://platform.hanzo.ai/deploy';
const SPR: { duration: number; ease: Bezier } = { duration: 0.4, ease: [0.4, 0, 0.2, 1] }; // deck: no springs; the frames move and stay (ease-in-out, slow)
// colours swap fast (150 ms, ease-out) while shape and padding take the slow 400 ms, so "Hello, Hanzo" never sits
// grey on grey halfway between the light and the ink ($8) state
const INK: { duration: number; ease: Bezier } = { duration: 0.15, ease: [0, 0, 0.2, 1] };
const SHAPE = { ...SPR, backgroundColor: INK, color: INK };
const ARRIVE = { duration: 0.3, ease: EASE_OUT_EXPO };

/* the tokens the shorthands accept: only the two Hanzo's own code uses ($4 and $8), no invented names */
const SPACE: Record<string, number> = { $4: 16, $8: 28 };
const BG: Record<string, string> = { $4: '#ffffff', $8: '#0a0a0a' };
const INKY = '$8';
const ROUND: Record<string, number> = { $4: 10, $8: 24 };
const TOK: Record<string, Record<string, number | string>> = { p: SPACE, bg: BG, rounded: ROUND };
/* the three shorthands a Welcome takes, each holding a token name */
const PROP_KEYS = ['p', 'bg', 'rounded'] as const;
type PropKey = (typeof PROP_KEYS)[number];
interface Preset {
  p: string;
  bg: string;
  rounded: string;
}
const PRESETS: Preset[] = [{ p: '$4', bg: '$4', rounded: '$4' }, { p: '$8', bg: '$4', rounded: '$8' }, { p: '$4', bg: '$8', rounded: '$8' }];
const PLAT: [string, string, string][] = [['iOS', 'Native', 'ios'], ['Android', 'Native', 'android'], ['Web', 'Atomic CSS', 'web'], ['Desktop', 'macOS · Win · Linux', 'desk']];
const OK = (k: string, val: string) => TOK[k][val] !== undefined;

/* The hero row settles as you scroll (from 1.03, lifted 20px, to its place over 700px). Page-local so the server and
   the client render the same style; reduced motion pins it in place from CSS. */
interface SettleProps {
  children: ReactNode;
  className?: string;
}
function Settle({ children, className = '' }: SettleProps) {
  const { scrollY } = useScroll();
  const scale = useTransform(scrollY, [0, 700], [1.03, 1], { clamp: true });
  const y = useTransform(scrollY, [0, 700], [8, 0], { clamp: true });
  return <div className={'gu-settle-o ' + className}><motion.div className="gu-settle" style={{ scale, y }}>{children}</motion.div></div>;
}

/* Hanzo's Welcome component: a YStack with a Text and a Button. parts outlines the primitives it is made of;
   delay lets the four frames take a new state one after another (a wave across the platforms). */
interface WelcomeProps {
  v: Preset;
  parts?: boolean;
  delay?: number;
}
function Welcome({ v, parts, delay = 0 }: WelcomeProps) {
  const dark = v.bg === INKY;
  const r = ROUND[v.rounded];
  const tr = delay ? { ...SHAPE, delay, backgroundColor: { ...INK, delay }, color: { ...INK, delay } } : SHAPE;
  return (
    <motion.div layout className={'gu-w' + (parts ? ' parts' : '')} data-part="YStack" data-bg={v.bg} style={{ '--pad': SPACE[v.p] }} initial={false} animate={{ borderRadius: r, backgroundColor: BG[v.bg] }} transition={tr}>
      <motion.span layout="position" className="gu-t" data-part="Text" initial={false} animate={{ color: dark ? '#f5f5f5' : '#0a0a0a' }} transition={tr}>Hello, Hanzo</motion.span>
      <motion.span layout="position" className="gu-b" data-part="Button" initial={false} animate={{ backgroundColor: dark ? '#f5f5f5' : '#0a0a0a', color: dark ? '#0a0a0a' : '#ffffff', borderRadius: r * 0.6 }} transition={tr}>Get started</motion.span>
    </motion.div>
  );
}

/* The same component once the compiler has been through it: the props it was given, flattened to one rule. */
interface FlatProps {
  v: Preset;
}
function Flat({ v }: FlatProps) {
  return (
    <div className="gu-flat x-mono" aria-hidden="true">
      <span className="gu-flat-t">{'<YStack'}</span>
      {PROP_KEYS.map((k) => <span key={k}>{k}="{v[k]}"</span>)}
      <span className="gu-flat-t">{'/>'}</span>
    </div>
  );
}

/* One device frame, drawn the way its platform draws it. */
interface DevProps {
  k: string;
  v: Preset;
  parts?: boolean;
  tag?: string | null;
  flat?: boolean;
  delay?: number;
  children?: ReactNode;
}
function Dev({ k, v, parts, tag, flat, delay, children }: DevProps) {
  return (
    <div className="gu-dev"><div className={'gu-frame gu-' + k}>
      {/* a neutral status bar: the island or camera hole only, no invented time */}
      {k === 'ios' && <i className="gu-island" aria-hidden="true" />}
      {k === 'android' && <><i className="gu-hole" aria-hidden="true" /><i className="gu-gest" aria-hidden="true" /></>}
      {(k === 'web' || k === 'desk') && (
        <div className="gu-bar" aria-hidden="true"><span className="gu-lights"><i /><i /><i /></span>{k === 'web' ? <span className="gu-url" /> : <span className="gu-wt">Welcome</span>}</div>
      )}
      <div className={'gu-scr' + (flat ? ' flat' : '')}>{children || (flat ? <Flat v={v} /> : <Welcome v={v} parts={parts} delay={delay} />)}</div>
    </div>{tag && <span className="gu-tag x-mono">{tag}</span>}</div>
  );
}

/* The four, in step. step (-1 the opening, 0 to 4 the chapters) picks the state the one object is in. */
interface FourProps {
  v: Preset;
  step?: number;
  cls?: string;
}
function Four({ v, step = -1, cls = '' }: FourProps) {
  return (
    <div className={'gu-four ' + cls} data-step={step}>
      {PLAT.map(([t, s, k], i) => (
        <figure key={k} className={'gu-fig gu-fig-' + k}>
          <Dev k={k} v={v} parts={step === 3} flat={step === 2} tag={step === 0 || step === 2 ? s : null} delay={step === 4 ? i * 0.09 : 0} />
          <figcaption><b>{t}</b><span>{s}</span></figcaption>
        </figure>
      ))}
    </div>
  );
}

const PauseIco = ({ on }: { on: boolean }) => <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">{on ? <path d="M5 3.2v9.6L12.6 8z" fill="currentColor" /> : <path d="M4.5 3h2.4v10H4.5zM9.1 3h2.4v10H9.1z" fill="currentColor" />}</svg>;

/* The code bar: the props the four frames are rendering right now. */
interface BarProps {
  v: Preset;
  hold?: boolean;
  setHold?: (v: boolean) => void;
  off?: boolean;
}
function Bar({ v, hold = false, setHold, off }: BarProps) {
  return (
    <div className="gu-code">
      <p className="x-mono" aria-live="polite">
        <span className="gu-code-t">{'<YStack'}</span>
        {PROP_KEYS.map((k) => (
          <span key={k} className="gu-code-p">{k}=<span className="gu-code-v"><AnimatePresence mode="popLayout" initial={false}><motion.b key={v[k]} initial={{ y: '100%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '-100%', opacity: 0 }} transition={ARRIVE}>"{v[k]}"</motion.b></AnimatePresence></span></span>
        ))}
        <span className="gu-code-t">{'/>'}</span>
      </p>
      {/* off: kept in place (not clickable) so the bar never changes width between states */}
      {off ? <span className="gu-hold off" aria-hidden="true"><PauseIco on={false} /></span>
        : setHold && <button type="button" className="gu-hold" onClick={() => setHold(!hold)} aria-pressed={hold} aria-label="Pause"><PauseIco on={hold} /></button>}
    </div>
  );
}

/* Cycles the presets (or a given list of them) while on and on screen. */
function useCycle<T>(on: boolean, ms: number, list: T[], first = ms) {
  const [i, setI] = useState(0);
  const n = useRef(0); // how many changes so far: the first comes sooner (first), then every ms
  useEffect(() => {
    if (!on) return;
    const t = setTimeout(() => { n.current += 1; setI((k) => (k + 1) % list.length); }, n.current ? ms : first);
    return () => clearTimeout(t);
  }, [i, on, ms, first, list.length]);
  return list[i % list.length];
}
const WAVE = [PRESETS[1], PRESETS[2]]; // chapter 05 never rests on the plain default card

/* The one ask leans toward a fine pointer (22px at most, ease-emphasis, no spring); touch and reduced motion stay put. */
interface PullProps {
  children: ReactNode;
}
function Pull({ children }: PullProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const move = (e: React.PointerEvent<HTMLSpanElement>) => {
    const el = ref.current;
    if (!el || e.pointerType !== 'mouse' || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const r = el.getBoundingClientRect();
    const c = (n: number) => Math.max(-22, Math.min(22, n * 0.3));
    el.style.translate = `${c(e.clientX - r.left - r.width / 2).toFixed(1)}px ${c(e.clientY - r.top - r.height / 2).toFixed(1)}px`;
  };
  return <span ref={ref} className="gu-pull" onPointerMove={move} onPointerLeave={() => { if (ref.current) ref.current.style.translate = ''; }}>{children}</span>;
}

/* The hero: the title, the one ask, and the four frames in step under the code bar, cycling the props by themselves
   (the first change lands at ~0.8 s). Not pinned: the stage scrolls away with the hero. */
function Hero() {
  const [hold, setHold] = useState(false);
  const [seen, live] = useLive<HTMLDivElement>(0.15);
  const v = useCycle(live && !hold, 2600, PRESETS, 800);
  return (
    <section className="gu-hero" aria-labelledby="gu-h1">
      <div className="bz-wrap gu-top">
        <BizLines as="h1" id="gu-h1" className="bz-display gu-h1" lines={['Hanzo GUI', 'One UI kit. Every platform.']} now />
        <p className="gu-pkg x-mono">@hanzo/gui — Cross-Platform UI Kit</p>
        <div className="bz-acts gu-acts">
          <Pull><Cta to={GH} id="gui.hero" thumb>View on GitHub</Cta></Pull>
        </div>
      </div>
      <div ref={seen}>
        <Settle className="bz-wrap gu-stage">
          <Bar v={v} hold={hold} setHold={setHold} />
          <Four v={v} cls="gu-hero-four" />
        </Settle>
      </div>
    </section>
  );
}

/* The five chapters (the sixth, the shorthands, is the dark room): one idea about the one component each. */
const PROPS = [
  ['One codebase, every platform', 'Write your UI once. Render it natively on iOS, Android, web, and desktop. Same components, same props, same behavior.'],
  ['Design tokens, not CSS', 'Colour, spacing, typography and motion are tokens in one place. Brand is resolved from the hostname it is served on, so the same build wears the right name on every domain without a fork.'],
  ['Compile-Time CSS', 'Styles flatten to atomic CSS at build time. Zero runtime cost on the web, zero style recalc on native.'],
  ['Composable Primitives', 'Stack, XStack, YStack, Text, Button, Sheet, and Dialog — primitives that compose into anything without leaking abstraction.'],
  ['Animated by Default', 'Spring-driven animations on every prop. No extra library, no boilerplate — just declare the target state and ship.'],
  ['The shorthands are the API', 'p, px, bg, items, justify, rounded — the short style props are what the config accepts, and every token behind them is typed. A value that has drifted out of the design system fails the typecheck rather than the review.'],
];
const PRIMS_USED = ['YStack', 'Text', 'Button'];

/* The chapters keep their states, each as its own object beside its words:
   01 one codebase: the four platforms and what each renders to; 02 tokens: the same card in the light and the ink token;
   03 compile-time CSS: the flat rule the compiler emits; 04 primitives: the card in its parts, the kit's primitives under
   it; 05 animated: the props change by themselves while it is on screen. */
/* Hanzo's own Welcome source, quoted from the page's install block (CODE, below) */
const SRC: [string, string][] = [
  ['k', 'export function Welcome() {'],
  ['', '  return ('],
  ['t', '    <YStack space="$4" padding="$4">'],
  ['t', '      <Text size="$8">Hello, Hanzo</Text>'],
  ['t', '      <Button>Get started</Button>'],
  ['t', '    </YStack>'],
  ['', '  )'],
  ['k', '}'],
];

/* The signature (compare): one window, a divider the visitor drags across it. Left of the divider is the one source
   Hanzo's code writes; right of it is what that source renders on a platform (the platform turns by itself while the
   window is on screen: iOS, Android, Web, Desktop). Mouse and touch drag the divider anywhere in the window; the
   handle is a slider (arrow keys 5%, Home/End). On arrival it glides once to show it moves; reduced motion rests at 50%. */
function Compare() {
  const box = useRef<HTMLDivElement | null>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const [x, setX] = useState(50);
  const [p, setP] = useState(0);
  const touched = useRef(false);
  const [seen, live] = useLive<HTMLDivElement>(0.3);
  useEnter(wrap);
  useEffect(() => {
    if (!live) return;
    const t = setTimeout(() => setP((n) => (n + 1) % PLAT.length), 2400);
    return () => clearTimeout(t);
  }, [live, p]);
  // the one invitation: the divider glides 50 → 34 → 66 → 50 the first time the window is on screen
  useEffect(() => {
    if (!live || touched.current) return;
    const steps = [34, 66, 50];
    const ts = steps.map((s, i) => setTimeout(() => { if (!touched.current) setX(s); }, 900 + i * 700));
    return () => ts.forEach(clearTimeout);
  }, [live]);
  const at = (clientX: number) => {
    const b = box.current!.getBoundingClientRect();
    setX(Math.max(0, Math.min(100, ((clientX - b.left) / b.width) * 100)));
  };
  const down = (e: React.PointerEvent<HTMLDivElement>) => {
    touched.current = true;
    box.current!.dataset.dragging = '';
    box.current!.setPointerCapture?.(e.pointerId);
    at(e.clientX);
  };
  const move = (e: React.PointerEvent<HTMLDivElement>) => { if (box.current!.dataset.dragging !== undefined) at(e.clientX); };
  const up = () => { if (box.current) delete box.current.dataset.dragging; };
  const key = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const d = { ArrowLeft: -5, ArrowDown: -5, ArrowRight: 5, ArrowUp: 5 }[e.key];
    if (d !== undefined) { e.preventDefault(); touched.current = true; setX((v) => Math.max(0, Math.min(100, v + d))); }
    if (e.key === 'Home') { e.preventDefault(); touched.current = true; setX(0); }
    if (e.key === 'End') { e.preventDefault(); touched.current = true; setX(100); }
  };
  const k = PLAT[p][2];
  return (
    <div ref={wrap} className="bz-wrap gu-cmp-wrap" data-entrance="split-merge">
      <div ref={(n) => { box.current = n; seen.current = n; }} className="gu-cmp" style={{ '--x': x + '%' }}
        onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
        <div className="gu-cmp-b" aria-hidden="true">
          <div className="gu-cmp-dev" data-k={k}><PlatScreen k={k} v={PRESETS[1]} /></div>
          <p className="gu-cmp-plat x-mono">{PLAT.map(([n, , kk]) => <span key={kk} className={kk === k ? 'on' : ''}>{n}</span>)}</p>
        </div>
        <div className="gu-cmp-a" aria-hidden="true">
          <pre className="x-mono">{SRC.map(([c, l], i) => <span key={i} className={c ? 'gu-src-' + c : ''}>{l + '\n'}</span>)}</pre>
        </div>
        <div className="gu-cmp-h" role="slider" tabIndex={0} aria-labelledby="gu-run-h" aria-valuemin={0} aria-valuemax={100}
          aria-valuenow={Math.round(x)} onKeyDown={key}>
          <i aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}

/* Each chapter's own object: what the one component turns into for that idea. */
function ChapterObj({ i, live }: { i: number; live: boolean }) {
  const wave = useCycle(live && i === 4, 1500, WAVE);
  // 01 lights each platform in turn as the one source reaches it; 03 the compiler re-emits the rule as the props change
  const lit = useCycle(live && i === 0, 1200, PLAT);
  const flat = useCycle(live && i === 2, 2200, PRESETS);
  if (i === 0) return (
    <ul className="gu-ch-targets">{PLAT.map(([t, s, k]) => <li key={k} className={lit[2] === k ? 'on' : ''}><b>{t}</b><span className="x-mono">{s}</span></li>)}</ul>
  );
  if (i === 1) return <div className="gu-ch-pair"><Welcome v={PRESETS[0]} /><Welcome v={PRESETS[2]} /></div>;
  if (i === 2) return <div className="gu-ch-flat"><Flat key={flat.p + flat.bg + flat.rounded} v={flat} /></div>;
  if (i === 3) return (
    <div className="gu-ch-parts"><Welcome v={PRESETS[0]} parts />
      <ul className="gu-ch-prims x-mono">{PRIMS.map((p) => <li key={p} className={PRIMS_USED.includes(p) ? 'on' : ''}>{p}</li>)}</ul></div>
  );
  return <div className="gu-ch-wave"><Welcome v={wave} /></div>;
}

interface ChapterProps {
  i: number;
  t: string;
  d: string;
}
function Chapter({ i, t, d }: ChapterProps) {
  const [ref, live] = useLive<HTMLLIElement>(0.4);
  return (
    <li ref={ref} className="gu-ch" style={{ '--i': i }}>
      <div className="gu-ch-copy">
        <h3 className="gu-ch-t">{t}</h3>
        <p className="bz-body">{d}</p>
        <p className="gu-ch-n x-mono">{`${String(i + 1).padStart(2, '0')} / ${String(PROPS.length).padStart(2, '0')}`}</p>
      </div>
      <div className="gu-ch-obj"><ChapterObj i={i} live={live} /></div>
    </li>
  );
}

/* Build it once: the signature, then the five chapters as plain rows that lean with the scroll. */
function Build() {
  const list = useRef<HTMLOListElement>(null);
  useEnter(list);
  useVelocitySkew(list);
  return (
    <section className="bz-sec gu-build" aria-labelledby="gu-run-h">
      <div className="bz-wrap gu-build-top">
        <h2 id="gu-run-h" className="bz-headline">Build it once. Ship it everywhere.</h2>
      </div>
      <Compare />
      <ol ref={list} className="bz-wrap gu-chs" data-entrance="velocity-skew">
        {PROPS.slice(0, 5).map(([t, d], i) => <Chapter key={t} i={i} t={t} d={d} />)}
      </ol>
    </section>
  );
}

/* Beyond, in the one dark room: the shorthands are the API. Tokens set all four; a drifted value fails the typecheck. */
function Editor() {
  const [v, setV] = useState(PRESETS[0]);
  const [draft, setDraft] = useState<Partial<Record<PropKey, string>>>({});
  const set = (k: PropKey, val: string) => {
    setDraft((d) => ({ ...d, [k]: val }));
    if (OK(k, val)) setV((o) => ({ ...o, [k]: val }));
  };
  // a chip sets the token and clears anything typed: the field only ever holds what the visitor typed
  const pick = (k: PropKey, val: string) => { setDraft((d) => ({ ...d, [k]: undefined })); setV((o) => ({ ...o, [k]: val })); };
  const bad = Object.entries(draft).filter(([k, val]) => val !== undefined && !OK(k, val));
  const room = useRef<HTMLElement>(null);
  useEnter(room);
  return (
    <section ref={room} className="bz-sec gu-api" data-room="dark" aria-labelledby="gu-api-h" data-entrance="domino">
      <div className="bz-wrap bz-grid gu-api-top">
        <h2 id="gu-api-h" className="bz-headline">The shorthands are the API</h2>
        <p className="bz-body">{PROPS[5][1]}</p>
      </div>
      <div className="bz-wrap bz-grid gu-api-obj">
        <div className="gu-ed">
          <p className="gu-ed-k x-mono"><span>{'<YStack'}</span><span className="gu-ed-n">06 / 06</span></p>
          {PROP_KEYS.map((k) => (
            <div key={k} className="gu-prop">
              <label className="x-mono" id={'gu-lb-' + k} htmlFor={'gu-in-' + k}>{k}=</label>
              <div className="gu-opts" role="radiogroup" aria-labelledby={'gu-lb-' + k}>
                {Object.keys(TOK[k]).map((o) => (
                  <button key={o} type="button" role="radio" aria-checked={v[k] === o && !(draft[k] && !OK(k, draft[k]))} onClick={() => pick(k, o)} className="x-mono">{o}</button>
                ))}
                {/* the value the YStack takes right now, shown in the field that closes the row; type over it and a value
                    that has drifted out of the design system fails the typecheck */}
                <input id={'gu-in-' + k} className={'x-mono' + (draft[k] && !OK(k, draft[k]) ? ' bad' : '')} value={draft[k] ?? ''} placeholder={v[k]} onChange={(e) => set(k, e.target.value)} spellCheck="false" autoComplete="off" />
              </div>
            </div>
          ))}
          {/* the typecheck sits on the closing line, by shape: a tick while every value is a token; a cross and the drifted value once one is not */}
          <p className="gu-ed-k gu-ed-end x-mono">
            <span>{'/>'}</span>
            <span className={'gu-tc' + (bad.length ? ' bad' : '')} aria-live="polite">
              {bad.length > 0 && <s>{bad.map(([k, val]) => `${k}="${val}"`).join(' ')}</s>}
              <i aria-hidden="true">{bad.length ? '✕' : '✓'}</i>
            </span>
          </p>
        </div>
        <figure className="gu-api-one"><Dev k="web" v={v} /></figure>
      </div>
    </section>
  );
}

const CODE = `# Install
pnpm add @hanzo/gui

# Use it
import { YStack, Button, Text } from '@hanzo/ui'

export function Welcome() {
  return (
    <YStack space="$4" padding="$4">
      <Text size="$8">Hello, Hanzo</Text>
      <Button>Get started</Button>
    </YStack>
  )
}`;

/* Each platform's own screen, built only from the kit's words: iOS a sheet rising, Android a list of the primitives,
   Web a form, Desktop a split pane. `live` (in the opened panel) cycles the tokens so the screen keeps answering. */
const PRIMS = ['Stack', 'XStack', 'YStack', 'Text', 'Button', 'Sheet', 'Dialog'];
/* an opened platform carries only words that are about that platform: the web gets Hanzo's atomic-CSS sentence (its
   own sub-label); the phones and the desktop carry their name and Hanzo's sub-label alone */
const PANEL: Record<string, number> = { web: 2 };
interface PlatScreenProps {
  k: string;
  v: Preset;
  wake?: boolean;
}
function PlatScreen({ k, v, wake }: PlatScreenProps) {
  if (k === 'ios') return (
    <Dev k="ios" v={v}>
      <div className="gu-s gu-s-ios"><span className="gu-s-bars" aria-hidden="true"><i /><i /><i /></span>
        <div className="gu-sheet"><i className="gu-sheet-h" aria-hidden="true" /><Welcome v={v} /></div></div>
    </Dev>
  );
  if (k === 'android') return (
    <Dev k="android" v={v}>
      <div className="gu-s gu-s-list">{PRIMS.slice(0, 5).map((t, i) => <span key={t} className={'gu-li' + (i === (wake ? 4 : 2) ? ' on' : '')}><b>{t}</b><i aria-hidden="true" /></span>)}</div>
    </Dev>
  );
  if (k === 'web') return (
    <Dev k="web" v={v}>
      <div className={'gu-s gu-s-form' + (wake ? ' wake' : '')}><span className="gu-t">Hello, Hanzo</span><span className="gu-field" aria-hidden="true"><i /></span><span className="gu-field short" aria-hidden="true" /><span className="gu-b gu-b-solid">Get started</span></div>
    </Dev>
  );
  return (
    <Dev k="desk" v={v}>
      <div className="gu-s gu-s-split"><span className="gu-side">{PRIMS.map((t) => <b key={t} className={t === 'YStack' ? 'on' : ''}>{t}</b>)}</span><span className="gu-main"><Welcome v={v} /></span></div>
    </Dev>
  );
}
/* The opened card reads as that platform's own page: its device large, the props it renders right now above it. */
interface PlatLiveProps {
  k: string;
}
function PlatLive({ k }: PlatLiveProps) {
  const [ref, live] = useLive<HTMLDivElement>(0.3);
  const v = useCycle(live, 2200, PRESETS);
  return <div ref={ref} className={'gu-pp-dev gu-pp-' + k}><Bar v={v} /><PlatScreen k={k} v={v} /></div>;
}

/* Back closes an opened platform the way Esc does: opening pushes one history entry; Back pops it and presses Close;
   closing any other way takes that entry back off, so the page's own history stays as it was. */
function useBackCloses(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const box = ref.current;
    if (!box) return;
    let ours = false;
    const layer = () => box.querySelector('.bz-open-layer');
    const pop = () => { if (!ours) return; ours = false; layer()?.querySelector<HTMLElement>('.bz-open-x')?.click(); };
    // while a card flies to its sheet and back, its own content is hidden and fades back once it has landed,
    // so nothing inside it is stretched by the morph (a crossfade, not a counter-scale)
    let t: ReturnType<typeof setTimeout> | undefined;
    const mo = new MutationObserver(() => {
      const open = !!layer();
      if (open && !ours) { ours = true; clearTimeout(t); box.classList.add('gu-morph'); history.pushState({ guOpen: 1 }, ''); }
      else if (!open && ours) { ours = false; clearTimeout(t); t = setTimeout(() => box.classList.remove('gu-morph'), 640); if (history.state?.guOpen) history.back(); }
    });
    mo.observe(box, { childList: true, subtree: true });
    addEventListener('popstate', pop);
    return () => { clearTimeout(t); mo.disconnect(); removeEventListener('popstate', pop); };
  }, [ref]);
}

/* A card's device: it tilts toward the pointer (2.5° at most, fine pointers only, flat on leave), and wakes while the
   card is pointed at or focused: its props take the next state once (the list moves to Button, the form fills). */
interface CardDevProps {
  k: string;
}
function CardDev({ k }: CardDevProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [wake, setWake] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const card = el.closest<HTMLElement>('.gu-plat');
    if (!card) return;
    const on = () => setWake(true), off = () => setWake(false);
    card.addEventListener('focus', on); card.addEventListener('blur', off);
    const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!fine) return () => { card.removeEventListener('focus', on); card.removeEventListener('blur', off); };
    const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const move = (e: PointerEvent) => {
      if (calm) return;
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(900px) rotateY(${(x * 5).toFixed(2)}deg) rotateX(${(-y * 5).toFixed(2)}deg)`;
    };
    const enter = () => setWake(true);
    const leave = () => { el.style.transform = ''; setWake(false); };
    card.addEventListener('pointerenter', enter); card.addEventListener('pointermove', move); card.addEventListener('pointerleave', leave);
    return () => {
      card.removeEventListener('focus', on); card.removeEventListener('blur', off);
      card.removeEventListener('pointerenter', enter); card.removeEventListener('pointermove', move); card.removeEventListener('pointerleave', leave);
    };
  }, []);
  return <span ref={ref} className="gu-plat-dev" aria-hidden="true"><PlatScreen k={k} v={wake ? PRESETS[1] : PRESETS[0]} wake={wake} /></span>;
}

/* Drop it in: the install and the code, and the four platforms as cards that open into their device. */
function Ship() {
  const box = useRef<HTMLElement>(null);
  const lens = useRef<HTMLDivElement>(null);
  useBackCloses(box);
  useEnter(lens);
  useLens(lens);
  return (
    <section ref={box} className="bz-sec gu-ship" aria-labelledby="gu-ship-h">
      <div className="bz-wrap bz-grid gu-ship-top">
        <div className="gu-ship-copy">
          <h2 id="gu-ship-h" className="bz-headline">Drop it in. Start shipping.</h2>
          <p className="bz-lede">One install gets you the whole kit.</p>
        </div>
        <div className="gu-ship-code">
          <Code tabs={[{ k: 'terminal', code: CODE }]} light mark="pnpm add @hanzo/gui" />
        </div>
      </div>
      <div ref={lens} className="bz-wrap gu-lens-wrap" data-entrance="cursor-lens">
        <i className="gu-lens" aria-hidden="true" />
        <BizOpen className="gu-plats" cardClass="gu-plat" items={PLAT.map(([t, s, k]) => ({
          id: k,
          className: 'gu-plat-' + k,
          /* the sub-label and, on hover or focus, the props the woken device has just taken share one line */
          card: <><CardDev k={k} /><span className="gu-plat-t"><b>{t}</b><span className="gu-plat-sw"><span className="gu-plat-s">{s}</span><span className="gu-plat-p x-mono" aria-hidden="true">{PROP_KEYS.map((p) => <span key={p}>{p}="{PRESETS[1][p]}"</span>)}</span></span></span></>,
          panel: (
            <div className="gu-pp">
              <PlatLive k={k} />
              <div className="gu-pp-copy">
                <h3 className="bz-headline">{t}</h3>
                <p className="gu-pp-s x-mono">{s}</p>
                {PANEL[k] !== undefined && <p className="bz-body">{PROPS[PANEL[k]][1]}</p>}
              </div>
            </div>
          ),
        }))} />
      </div>
    </section>
  );
}

const Gh = () => <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" /></svg>;

/* Getting it: licence, source, stars, the agent prompt. Text links only. */
function GetGui() {
  return (
    <section className="bz-sec gu-get" aria-labelledby="gu-get-h">
      <div className="bz-wrap bz-grid">
        <div className="gu-get-main">
          <h2 id="gu-get-h" className="bz-headline">Get GUI</h2>
          <p className="bz-lede">React UI library</p>
          <div className="gu-chips">
            <span className="gu-chip"><span>License:</span> Apache-2.0</span>
            <A to={GH} className="gu-chip"><Gh />hanzoai/gui<em className="gu-stars">4 stars</em></A>
          </div>
        </div>
        <BizPaste name="GUI" prompt="Read https://hanzo.ai/skill.md and use Hanzo GUI in my project." className="gu-paste" />
      </div>
    </section>
  );
}

const Arrow = () => <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;

/* The close: one sentence at Display size, the one ask, one text row. */
function End() {
  const ref = useRef<HTMLElement>(null);
  useGrowFromPoint(ref);
  return (
    <section ref={ref} className="bz-sec gu-end" aria-labelledby="gu-end-h" data-entrance="grow-from-point">
      <div className="bz-wrap">
        <div className="gu-end-main">
          <h2 id="gu-end-h" className="bz-display md">The design system that ships your product</h2>
          <p className="bz-lede">Runs every Hanzo app in production, on web, native, and desktop.</p>
          <div className="bz-acts gu-end-acts"><Cta to={GH} id="gui.close">View on GitHub</Cta><A to={DEPLOY} className="gu-row"><span>Deploy to Cloud</span><Arrow /></A></div>
        </div>
      </div>
    </section>
  );
}

export default function Gui() {
  return (
    <main className="bz gu">
      <span data-ask-name="Hanzo GUI" hidden />
      <Hero />
      <Build />
      <Editor />
      <Ship />
      <GetGui />
      <End />
    </main>
  );
}
