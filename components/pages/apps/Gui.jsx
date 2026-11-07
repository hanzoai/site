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
   Motion: the four frames in step (signature) + Stage (the row settles) + sticky chapters + platform cards that open.
V2: 8/10 round 3: the pinned title is centred on the grid and releases with the stage (one grid cell, no crossing); the lit chapter title grows 26→32px and settles; colours swap in 150ms so the ink ($accent) state never goes grey-on-grey; hero captions on one baseline; gaps under the rail and the dark room closed; a platform card opens into a full-screen page of that platform (its device large with its live props, the name at 52px) and Esc, Close or Back return it. Round 2: hydration-safe hero settle; hero devices and labels inside 801px; each platform card its own screen (iOS sheet, Android list, Web form, Desktop split) that tilts and shows its tokens, opening into a live one; the dark room is one large window the chips restyle; chapters grow in as their step arrives and count 01–05; mock buttons answer; no clipping; Deploy to Cloud sits beside the ask. Round 1: a centred 52px title over four live device frames in step (the one big thing) with a Pause; five sticky chapters explain the one component across four platforms; the graphite room is the token editor with a real typecheck; platform cards open into their device; one ask; deck colours, radii and scale, outlined frames, no springs
   Every word and link is Hanzo's. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { A, More, Cta } from '../../kit';
import BizLines from '../../v2/BizLines';
import { EASE_OUT_EXPO } from '../../../lib/motion';
import { Code, useLive } from '../cloud/Frame';
import BizPaste from '../../v2/BizPaste';
import BizChapters from '../../v2/BizChapters';
import BizOpen from '../../v2/BizOpen';
import './Gui.css';

const GH = 'https://github.com/hanzoai/gui';
const DEPLOY = 'https://platform.hanzo.ai/deploy';
const SPR = { duration: 0.4, ease: [0.4, 0, 0.2, 1] }; // deck: no springs; the frames move and stay (ease-in-out, slow)
// colours swap fast (150 ms, ease-out) while shape and padding take the slow 400 ms, so "Hello, Hanzo" never sits
// grey on grey halfway between the light and the $accent (ink) state
const INK = { duration: 0.15, ease: [0, 0, 0.2, 1] };
const SHAPE = { ...SPR, backgroundColor: INK, color: INK };
const ARRIVE = { duration: 0.3, ease: EASE_OUT_EXPO };

/* the tokens the shorthands accept */
const SPACE = { $2: 8, $3: 12, $4: 16, $6: 24 };
const BG = { $background: '#ffffff', $color2: '#e5e5e5', $accent: '#0a0a0a' };
const ROUND = { $2: 6, $4: 14, $8: 26 };
const TOK = { p: SPACE, bg: BG, rounded: ROUND };
const PRESETS = [{ p: '$4', bg: '$background', rounded: '$4' }, { p: '$6', bg: '$color2', rounded: '$8' }, { p: '$3', bg: '$accent', rounded: '$2' }];
const PLAT = [['iOS', 'Native', 'ios'], ['Android', 'Native', 'android'], ['Web', 'Atomic CSS', 'web'], ['Desktop', 'macOS · Win · Linux', 'desk']];
const OK = (k, val) => TOK[k][val] !== undefined;

/* The hero row settles as you scroll (from 1.03, lifted 20px, to its place over 700px). Page-local so the server and
   the client render the same style; reduced motion pins it in place from CSS. */
function Settle({ children, className = '' }) {
  const { scrollY } = useScroll();
  const scale = useTransform(scrollY, [0, 700], [1.03, 1], { clamp: true });
  const y = useTransform(scrollY, [0, 700], [8, 0], { clamp: true });
  return <div className={'gu-settle-o ' + className}><motion.div className="gu-settle" style={{ scale, y }}>{children}</motion.div></div>;
}

/* Hanzo's Welcome component: a YStack with a Text and a Button. parts outlines the primitives it is made of. */
function Welcome({ v, parts }) {
  const dark = v.bg === '$accent';
  const r = ROUND[v.rounded];
  return (
    <motion.div layout className={'gu-w' + (parts ? ' parts' : '')} data-part="YStack" style={{ '--pad': SPACE[v.p] }} initial={false} animate={{ borderRadius: r, backgroundColor: BG[v.bg] }} transition={SHAPE}>
      <motion.span layout="position" className="gu-t" data-part="Text" initial={false} animate={{ color: dark ? '#f5f5f5' : '#0a0a0a' }} transition={SHAPE}>Hello, Hanzo</motion.span>
      <motion.span layout="position" className="gu-b" data-part="Button" initial={false} animate={{ backgroundColor: dark ? '#f5f5f5' : '#0a0a0a', color: dark ? '#0a0a0a' : '#ffffff', borderRadius: r * 0.6 }} transition={SHAPE}>Get started</motion.span>
    </motion.div>
  );
}

/* One device frame, drawn the way its platform draws it. */
function Dev({ k, v, parts, tag, children }) {
  return (
    <div className="gu-dev"><div className={'gu-frame gu-' + k}>
      {k === 'ios' && <><i className="gu-island" aria-hidden="true" /><span className="gu-sb x-mono" aria-hidden="true">9:41</span></>}
      {k === 'android' && <><i className="gu-hole" aria-hidden="true" /><span className="gu-sb x-mono" aria-hidden="true">9:41</span><i className="gu-gest" aria-hidden="true" /></>}
      {(k === 'web' || k === 'desk') && (
        <div className="gu-bar" aria-hidden="true"><span className="gu-lights"><i /><i /><i /></span>{k === 'web' ? <span className="gu-url" /> : <span className="gu-wt">Welcome</span>}</div>
      )}
      <div className="gu-scr">{children || <Welcome v={v} parts={parts} />}</div>
      {tag && <span className="gu-tag x-mono">{tag}</span>}
    </div></div>
  );
}

/* The four, in step. */
function Four({ v, parts, tags, cls = '', names = true }) {
  return (
    <div className={'gu-four ' + cls}>
      {PLAT.map(([t, s, k]) => (
        <figure key={k} className={'gu-fig gu-fig-' + k}>
          <Dev k={k} v={v} parts={parts} tag={tags ? s : null} />
          {names && <figcaption><b>{t}</b><span>{s}</span></figcaption>}
        </figure>
      ))}
    </div>
  );
}

const PauseIco = ({ on }) => <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">{on ? <path d="M5 3.2v9.6L12.6 8z" fill="currentColor" /> : <path d="M4.5 3h2.4v10H4.5zM9.1 3h2.4v10H9.1z" fill="currentColor" />}</svg>;

/* The code bar: the props the four frames are rendering right now. */
function Bar({ v, hold, setHold }) {
  return (
    <div className="gu-code">
      <p className="x-mono" aria-live="polite">
        <span className="gu-code-t">{'<YStack'}</span>
        {['p', 'bg', 'rounded'].map((k) => (
          <span key={k} className="gu-code-p">{k}=<span className="gu-code-v"><AnimatePresence mode="popLayout" initial={false}><motion.b key={v[k]} initial={{ y: '100%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '-100%', opacity: 0 }} transition={ARRIVE}>"{v[k]}"</motion.b></AnimatePresence></span></span>
        ))}
        <span className="gu-code-t">{'/>'}</span>
      </p>
      {setHold && <button type="button" className="gu-hold" onClick={() => setHold(!hold)} aria-pressed={hold} aria-label={hold ? 'Play the props' : 'Pause the props'}><PauseIco on={hold} /></button>}
    </div>
  );
}

/* Cycles the presets while on and on screen. */
function useCycle(on, ms = 2600) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!on) return;
    const t = setTimeout(() => setI((n) => (n + 1) % PRESETS.length), ms);
    return () => clearTimeout(t);
  }, [i, on, ms]);
  return PRESETS[i];
}

function Hero() {
  const [ref, live] = useLive(0.2);
  const [hold, setHold] = useState(false);
  const v = useCycle(live && !hold);
  return (
    <section ref={ref} className="gu-hero" aria-labelledby="gu-h1">
      <div className="bz-wrap gu-top">
        <BizLines as="h1" id="gu-h1" className="bz-display gu-h1" lines={['Hanzo GUI', 'One UI kit. Every platform.']} now />
        <p className="gu-pkg x-mono">@hanzo/gui — Cross-Platform UI Kit</p>
        <div className="bz-acts gu-acts">
          <Cta to={GH} id="gui.hero" thumb>View on GitHub</Cta>
        </div>
      </div>
      <Settle className="bz-wrap gu-stage">
        <Bar v={v} hold={hold} setHold={setHold} />
        <Four v={v} cls="gu-hero-four" />
      </Settle>
    </section>
  );
}

/* Chapters: the four pinned, one idea about the one component per chapter. */
const PROPS = [
  ['One codebase, every platform', 'Write your UI once. Render it natively on iOS, Android, web, and desktop. Same components, same props, same behavior.'],
  ['Design tokens, not CSS', 'Colour, spacing, typography and motion are tokens in one place. Brand is resolved from the hostname it is served on, so the same build wears the right name on every domain without a fork.'],
  ['Compile-Time CSS', 'Styles flatten to atomic CSS at build time. Zero runtime cost on the web, zero style recalc on native.'],
  ['Composable Primitives', 'Stack, XStack, YStack, Text, Button, Sheet, and Dialog — primitives that compose into anything without leaking abstraction.'],
  ['Animated by Default', 'Spring-driven animations on every prop. No extra library, no boilerplate — just declare the target state and ship.'],
  ['The shorthands are the API', 'p, px, bg, items, justify, rounded — the short style props are what the config accepts, and every token behind them is typed. A value that has drifted out of the design system fails the typecheck rather than the review.'],
];
const LABEL = ['iOS · Android · Web · Desktop', 'p $6 · bg $color2 · rounded $8', 'Native · Native · Atomic CSS · macOS · Win · Linux', 'YStack · Text · Button', 'p · bg · rounded'];

function ChStage({ at }) {
  const [ref, live] = useLive(0.3);
  const spin = useCycle(live && at === 4, 1700);
  const v = at === 1 ? PRESETS[1] : at === 4 ? spin : PRESETS[0];
  return (
    <div ref={ref} className="gu-ch-stage">
      <motion.div key={at} className="gu-ch-grow" initial={{ scale: 0.9, opacity: 0.6 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
        <Four v={v} parts={at === 3} tags={at === 2} names={false} cls="gu-ch-four" />
      </motion.div>
      <p className="gu-ch-cap x-mono"><b>{String(at + 1).padStart(2, '0')} / {String(PROPS.length).padStart(2, '0')}</b>{LABEL[at]}</p>
    </div>
  );
}

function Chapters() {
  return (
    <BizChapters label="Build it once. Ship it everywhere." className="gu-ch" items={PROPS.slice(0, 5).map(([t, d]) => ({ t, d }))} stage={(at) => <ChStage at={at} />}>
      <header className="bz-wrap gu-ch-head">
        <h2 className="bz-headline">Build it once. Ship it everywhere.</h2>
      </header>
    </BizChapters>
  );
}

/* Beyond, in the one dark room: the shorthands are the API. Tokens set all four; a drifted value fails the typecheck. */
function Editor() {
  const [v, setV] = useState(PRESETS[0]);
  const [draft, setDraft] = useState({});
  const set = (k, val) => {
    setDraft((d) => ({ ...d, [k]: val }));
    if (OK(k, val)) setV((o) => ({ ...o, [k]: val }));
  };
  const bad = Object.entries(draft).filter(([k, val]) => !OK(k, val));
  return (
    <section className="bz-sec gu-api" data-room="dark" aria-labelledby="gu-api-h">
      <div className="bz-wrap bz-grid gu-api-top">
        <h2 id="gu-api-h" className="bz-headline">The shorthands are the API</h2>
        <p className="bz-body">{PROPS[5][1]}</p>
      </div>
      <div className="bz-wrap bz-grid gu-api-obj">
        <div className="gu-ed">
          <p className="gu-ed-k x-mono"><span>{'<YStack'}</span><span className="gu-ed-n">06 / 06</span></p>
          {['p', 'bg', 'rounded'].map((k) => (
            <div key={k} className="gu-prop">
              <label className="x-mono" htmlFor={'gu-in-' + k}>{k}=</label>
              <div className="gu-opts" role="radiogroup" aria-label={k + ' token'}>
                {Object.keys(TOK[k]).map((o) => (
                  <button key={o} type="button" role="radio" aria-checked={v[k] === o && !(draft[k] && !OK(k, draft[k]))} onClick={() => set(k, o)} className="x-mono">{o}</button>
                ))}
              </div>
              <input id={'gu-in-' + k} className={'x-mono' + (draft[k] && !OK(k, draft[k]) ? ' bad' : '')} value={draft[k] ?? v[k]} onChange={(e) => set(k, e.target.value)} spellCheck="false" autoComplete="off" />
            </div>
          ))}
          <p className="gu-ed-k x-mono">{'/>'}</p>
          <p className={'gu-tc x-mono' + (bad.length ? ' bad' : '')} aria-live="polite">
            <i aria-hidden="true">{bad.length ? '✕' : '✓'}</i>
            {bad.length ? `typecheck: ${bad.map(([k, val]) => `${k}="${val}"`).join(', ')} is not a token` : 'typecheck: every value is a token'}
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
function PlatScreen({ k, v }) {
  if (k === 'ios') return (
    <Dev k="ios" v={v}>
      <div className="gu-s gu-s-ios"><span className="gu-s-bars" aria-hidden="true"><i /><i /><i /></span>
        <div className="gu-sheet"><i className="gu-sheet-h" aria-hidden="true" /><Welcome v={v} /></div></div>
    </Dev>
  );
  if (k === 'android') return (
    <Dev k="android" v={v}>
      <div className="gu-s gu-s-list">{PRIMS.slice(0, 5).map((t, i) => <span key={t} className={'gu-li' + (i === 2 ? ' on' : '')}><b>{t}</b><i aria-hidden="true" /></span>)}</div>
    </Dev>
  );
  if (k === 'web') return (
    <Dev k="web" v={v}>
      <div className="gu-s gu-s-form"><span className="gu-t">Hello, Hanzo</span><span className="gu-field" aria-hidden="true"><i /></span><span className="gu-field short" aria-hidden="true" /><span className="gu-b gu-b-solid">Get started</span></div>
    </Dev>
  );
  return (
    <Dev k="desk" v={v}>
      <div className="gu-s gu-s-split"><span className="gu-side">{PRIMS.map((t) => <b key={t} className={t === 'YStack' ? 'on' : ''}>{t}</b>)}</span><span className="gu-main"><Welcome v={v} /></span></div>
    </Dev>
  );
}
/* The opened card reads as that platform's own page: its device large, the props it renders right now above it. */
function PlatLive({ k }) {
  const [ref, live] = useLive(0.3);
  const v = useCycle(live, 2200);
  return <div ref={ref} className={'gu-pp-dev gu-pp-' + k}><Bar v={v} /><PlatScreen k={k} v={v} /></div>;
}

/* Back closes an opened platform the way Esc does: opening pushes one history entry; Back pops it and presses Close;
   closing any other way takes that entry back off, so the page's own history stays as it was. */
function useBackCloses(ref) {
  useEffect(() => {
    const box = ref.current;
    if (!box) return;
    let ours = false;
    const layer = () => box.querySelector('.bz-open-layer');
    const pop = () => { if (!ours) return; ours = false; layer()?.querySelector('.bz-open-x')?.click(); };
    const mo = new MutationObserver(() => {
      const open = !!layer();
      if (open && !ours) { ours = true; history.pushState({ guOpen: 1 }, ''); }
      else if (!open && ours) { ours = false; if (history.state?.guOpen) history.back(); }
    });
    mo.observe(box, { childList: true, subtree: true });
    addEventListener('popstate', pop);
    return () => { mo.disconnect(); removeEventListener('popstate', pop); };
  }, [ref]);
}

/* A card's device tilts toward the pointer (2.5° at most, fine pointers only, flat on leave). */
function Tilt({ children }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current, card = el && el.closest('.gu-plat');
    if (!card || !matchMedia('(hover: hover) and (pointer: fine)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const move = (e) => { const r = card.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5; el.style.transform = `perspective(900px) rotateY(${(x * 5).toFixed(2)}deg) rotateX(${(-y * 5).toFixed(2)}deg)`; };
    const leave = () => { el.style.transform = ''; };
    card.addEventListener('pointermove', move); card.addEventListener('pointerleave', leave);
    return () => { card.removeEventListener('pointermove', move); card.removeEventListener('pointerleave', leave); };
  }, []);
  return <span ref={ref} className="gu-plat-dev" aria-hidden="true">{children}</span>;
}

/* Drop it in: the install and the code, and the four platforms as cards that open into their device. */
function Ship() {
  const box = useRef(null);
  useBackCloses(box);
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
      <div className="bz-wrap">
        <BizOpen label="Every platform" className="gu-plats" cardClass="gu-plat" items={PLAT.map(([t, s, k]) => ({
          id: k,
          label: t,
          className: 'gu-plat-' + k,
          card: <><Tilt><PlatScreen k={k} v={PRESETS[0]} /></Tilt><span className="gu-plat-t"><b>{t}</b><span>{s}</span><span className="gu-plat-tok x-mono" aria-hidden="true">p="$4" bg="$background" rounded="$4"</span></span></>,
          panel: (
            <div className="gu-pp">
              <PlatLive k={k} />
              <div className="gu-pp-copy">
                <h3 className="bz-headline">{t}</h3>
                <p className="gu-pp-s x-mono">{s}</p>
                <p className="bz-body">{PROPS[0][1]}</p>
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
            <A to={GH} className="gu-chip"><Gh />hanzoai/gui<em>4 stars</em></A>
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
  return (
    <section className="bz-sec gu-end" aria-labelledby="gu-end-h">
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
      <Chapters />
      <Editor />
      <Ship />
      <GetGui />
      <End />
    </main>
  );
}
