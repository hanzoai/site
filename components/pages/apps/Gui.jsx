'use client';
/* GUI (v2, archetype A "Launch"): one component, four platforms, in step.
   Persona: a front-end or mobile developer who wants one UI kit for iOS, Android, web and desktop
   Goal: see one component render the same on four platforms, set its props from the tokens, then go to the source
   CTA: View on GitHub -> https://github.com/hanzoai/gui (hero, the site's sticky ask bar at every width, close; data-thumb, data-cta)
   Signature: one component, four platforms, in step. Under a centred two-line title, four device frames stand in one row
   (an iOS phone, an Android phone, a web window, a desktop window) and settle as you scroll. Hanzo's own Welcome
   component (a YStack with a Text and a Button) renders in all four; its props (p, bg, rounded) change by themselves in
   the code bar above them, and every frame springs to the new state together. The code bar carries the Pause.
   Beyond: "The shorthands are the API", in the one dark room. Set p, bg and rounded from the tokens and all four
   platforms follow; type a value that has drifted out of the design system and the typecheck fails instead of shipping.
   Not only scroll: the frames change by themselves (idle), the editor and the platform cards answer the hand (state);
   Stage and chapters are the scroll half.
   Motion: the four frames in step (signature) + Stage (the row settles) + sticky chapters + platform cards that open.
V2: 8/10 centred title over four live device frames in step with a Pause; five sticky chapters explain the one component across four platforms; the dark room is the token editor with a real typecheck; platform cards open into their device; one ask; greys only, nothing above the h1
   Every word and link is Hanzo's. */
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { A, Go, More } from '../../kit';
import { SPRING } from '../../../lib/motion';
import { Code, useLive } from '../cloud/Frame';
import BizPaste from '../../v2/BizPaste';
import BizStage from '../../v2/BizStage';
import BizChapters from '../../v2/BizChapters';
import BizOpen from '../../v2/BizOpen';
import './Gui.css';

const GH = 'https://github.com/hanzoai/gui';
const DEPLOY = 'https://platform.hanzo.ai/deploy';
const SPR = SPRING.morph;

/* the tokens the shorthands accept */
const SPACE = { $2: 8, $3: 12, $4: 16, $6: 24 };
const BG = { $background: '#ffffff', $color2: '#e8e8ed', $accent: '#0a0a0a' };
const ROUND = { $2: 6, $4: 14, $8: 26 };
const TOK = { p: SPACE, bg: BG, rounded: ROUND };
const PRESETS = [{ p: '$4', bg: '$background', rounded: '$4' }, { p: '$6', bg: '$color2', rounded: '$8' }, { p: '$3', bg: '$accent', rounded: '$2' }];
const PLAT = [['iOS', 'Native', 'ios'], ['Android', 'Native', 'android'], ['Web', 'Atomic CSS', 'web'], ['Desktop', 'macOS · Win · Linux', 'desk']];
const OK = (k, val) => TOK[k][val] !== undefined;

/* Hanzo's Welcome component: a YStack with a Text and a Button. parts outlines the primitives it is made of. */
function Welcome({ v, parts }) {
  const dark = v.bg === '$accent';
  const r = ROUND[v.rounded];
  return (
    <motion.div layout className={'gu-w' + (parts ? ' parts' : '')} data-part="YStack" style={{ '--pad': SPACE[v.p] }} initial={false} animate={{ borderRadius: r, backgroundColor: BG[v.bg] }} transition={SPR}>
      <motion.span layout="position" className="gu-t" data-part="Text" initial={false} animate={{ color: dark ? '#f5f5f7' : '#0a0a0a' }} transition={SPR}>Hello, Hanzo</motion.span>
      <motion.span layout="position" className="gu-b" data-part="Button" initial={false} animate={{ backgroundColor: dark ? '#f5f5f7' : '#0a0a0a', color: dark ? '#0a0a0a' : '#ffffff', borderRadius: r * 0.6 }} transition={SPR}>Get started</motion.span>
    </motion.div>
  );
}

/* One device frame, drawn the way its platform draws it. */
function Dev({ k, v, parts, tag }) {
  return (
    <div className="gu-dev"><div className={'gu-frame gu-' + k}>
      {k === 'ios' && <><i className="gu-island" aria-hidden="true" /><span className="gu-sb x-mono" aria-hidden="true">9:41</span></>}
      {k === 'android' && <><i className="gu-hole" aria-hidden="true" /><span className="gu-sb x-mono" aria-hidden="true">9:41</span><i className="gu-gest" aria-hidden="true" /></>}
      {(k === 'web' || k === 'desk') && (
        <div className="gu-bar" aria-hidden="true"><span className="gu-lights"><i /><i /><i /></span>{k === 'web' ? <span className="gu-url" /> : <span className="gu-wt">Welcome</span>}</div>
      )}
      <div className="gu-scr"><Welcome v={v} parts={parts} /></div>
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
          <span key={k} className="gu-code-p">{k}=<span className="gu-code-v"><AnimatePresence mode="popLayout" initial={false}><motion.b key={v[k]} initial={{ y: '100%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '-100%', opacity: 0 }} transition={SPRING.pill}>"{v[k]}"</motion.b></AnimatePresence></span></span>
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
        <h1 id="gu-h1" className="bz-display md gu-h1"><span>Hanzo GUI</span> <span className="gu-h1-2">One UI kit. Every platform.</span></h1>
        <p className="gu-pkg x-mono">@hanzo/gui — Cross-Platform UI Kit</p>
        <div className="bz-acts gu-acts">
          <span data-thumb="View on GitHub" data-cta="primary"><Go to={GH} solid>View on GitHub</Go></span>
        </div>
      </div>
      <BizStage from={1.03} over={700} lift={20} className="bz-wrap gu-stage">
        <Bar v={v} hold={hold} setHold={setHold} />
        <Four v={v} cls="gu-hero-four" />
      </BizStage>
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
      <Four v={v} parts={at === 3} tags={at === 2} names={false} cls="gu-ch-four" />
      <p className="gu-ch-cap x-mono"><b>{String(at + 1).padStart(2, '0')} / 06</b>{LABEL[at]}</p>
    </div>
  );
}

function Chapters() {
  return (
    <BizChapters label="Build it once. Ship it everywhere." className="gu-ch" items={PROPS.slice(0, 5).map(([t, d]) => ({ t, d }))} stage={(at) => <ChStage at={at} />}>
      <header className="bz-wrap gu-ch-head">
        <h2 className="bz-display md">Build it once. Ship it everywhere.</h2>
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
        <h2 id="gu-api-h" className="bz-display md">The shorthands are the API</h2>
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
        <Four v={v} names={false} cls="gu-api-four" />
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

/* Drop it in: the install and the code, and the four platforms as cards that open into their device. */
function Ship() {
  return (
    <section className="bz-sec gu-ship" aria-labelledby="gu-ship-h">
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
          card: <><span className="gu-plat-dev" aria-hidden="true"><Dev k={k} v={PRESETS[0]} /></span><span className="gu-plat-t"><b>{t}</b><span>{s}</span></span></>,
          panel: (
            <div className="gu-pp">
              <div className={'gu-pp-dev gu-pp-' + k}><Dev k={k} v={PRESETS[1]} /></div>
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
          <div className="bz-acts"><span data-cta="primary"><Go to={GH} solid>View on GitHub</Go></span></div>
        </div>
        <A to={DEPLOY} className="gu-row"><span>Deploy to Cloud</span><Arrow /></A>
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
