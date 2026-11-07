'use client';
/* GUI. Signature: one component, four platforms, in step. Hanzo's own Welcome component (a YStack with a Text and a
   Button) renders at once on an iOS phone, an Android phone, a web window and a desktop window; its props change by
   themselves and every frame springs to the new state together.
   Beyond: "The shorthands are the API". Set p, bg and rounded from the tokens and all four platforms follow; type a value
   that has drifted out of the design system and it fails the typecheck instead of shipping, exactly as Hanzo says.
   Every word and link is Hanzo's. */
import { useState } from 'react';
import { motion } from 'motion/react';
import { EASE, Rise } from '../../ui';
import { A } from '../../kit';
import { Paste, Code, Get, useLive, useEvery, useSteps } from '../cloud/Frame';
import './Gui.css';

const GH = 'https://github.com/hanzoai/gui';
const up = (d) => ({ initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, ease: EASE, delay: d } });
const SPACE = { $2: 8, $3: 12, $4: 16, $6: 24 };
const BG = { $background: '#ffffff', $color2: '#f5f5f7', $accent: '#0a0a0a' };
const ROUND = { $2: 6, $4: 14, $8: 26 };
const PRESETS = [{ p: '$4', bg: '$background', rounded: '$4' }, { p: '$6', bg: '$color2', rounded: '$8' }, { p: '$3', bg: '$accent', rounded: '$2' }];

function Welcome({ v }) {
  const dark = v.bg === '$accent';
  return (
    <motion.div layout className="gu-w" style={{ padding: SPACE[v.p] ?? 16 }} animate={{ borderRadius: ROUND[v.rounded] ?? 14, backgroundColor: BG[v.bg] ?? '#fff' }} transition={{ type: 'spring', stiffness: 260, damping: 24 }}>
      <motion.span layout className="gu-t" style={{ color: dark ? '#f5f5f7' : '#0a0a0a' }}>Hello, Hanzo</motion.span>
      <motion.span layout className="gu-b" style={{ background: dark ? '#f5f5f7' : '#0a0a0a', color: dark ? '#0a0a0a' : '#fff', borderRadius: (ROUND[v.rounded] ?? 14) * 0.6 }}>Get started</motion.span>
    </motion.div>
  );
}

const PLAT = [['iOS', 'Native', 'phone ios'], ['Android', 'Native', 'phone android'], ['Web', 'Atomic CSS', 'win web'], ['Desktop', 'macOS · Win · Linux', 'win desk']];

function Devices({ v }) {
  return (
    <div className="gu-devs">
      {PLAT.map(([t, s, k], i) => (
        <motion.div key={t} className={'gu-dev ' + k} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.25 + i * 0.08 }}>
          <div className="gu-scr">{k.startsWith('win') && <span className="gu-dots" aria-hidden="true"><i /><i /><i /></span>}<Welcome v={v} /></div>
          <p><b>{t}</b><span>{s}</span></p>
        </motion.div>
      ))}
    </div>
  );
}

const OK = (k, val) => ({ p: SPACE, bg: BG, rounded: ROUND }[k][val] !== undefined);

function Props({ v, setV, setMine }) {
  const [draft, setDraft] = useState({});
  const set = (k, val) => {
    setMine(true);
    setDraft((d) => ({ ...d, [k]: val }));
    if (OK(k, val)) setV((o) => ({ ...o, [k]: val }));
  };
  const bad = Object.entries(draft).filter(([k, val]) => !OK(k, val));
  return (
    <div className="gu-props">
      <p className="gu-props-k x-mono">{'<YStack'}</p>
      {[['p', SPACE], ['bg', BG], ['rounded', ROUND]].map(([k, opts]) => (
        <div key={k} className="gu-prop">
          <span className="x-mono">{k}=</span>
          <div className="gu-opts" role="radiogroup" aria-label={k}>
            {Object.keys(opts).map((o) => <button key={o} type="button" role="radio" aria-checked={v[k] === o && OK(k, draft[k] ?? o)} onClick={() => set(k, o)} className="x-mono">{o}</button>)}
          </div>
          <input className={'x-mono' + (draft[k] && !OK(k, draft[k]) ? ' bad' : '')} value={draft[k] ?? v[k]} onChange={(e) => set(k, e.target.value)} aria-label={k + ' value'} spellCheck="false" />
        </div>
      ))}
      <p className="gu-props-k x-mono">{'/>'}</p>
      <p className={'gu-tc x-mono' + (bad.length ? ' bad' : '')} aria-live="polite">
        {bad.length ? `typecheck: ${bad.map(([k, val]) => `${k}="${val}"`).join(', ')} is not a token` : 'typecheck: every value is a token'}
      </p>
    </div>
  );
}

function Hero() {
  const [ref, live] = useLive(0.3);
  const [v, setV] = useState(PRESETS[0]);
  const [mine, setMine] = useState(false);
  const [i, setI] = useState(0);
  useEvery(2400, live && !mine, () => { const n = (i + 1) % PRESETS.length; setI(n); setV(PRESETS[n]); });
  return (
    <section className="gu-hero" ref={ref} aria-labelledby="gu-h1">
      <div className="x-wrap">
        <div className="gu-top">
          <div>
            <motion.p className="gu-kick x-mono" {...up(0)}><img src="/models/kai.webp" alt="" />@hanzo/gui — Cross-Platform UI Kit</motion.p>
            <h1 id="gu-h1" className="gu-h1"><span className="x-line"><motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.05 }}>Hanzo GUI</motion.span></span></h1>
            <motion.p className="gu-lede" {...up(0.3)}>One UI kit. Every platform.</motion.p>
            <motion.div className="gu-acts" {...up(0.42)}>
              <motion.span className="x-go" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}><A to={GH} className="x-btn solid" data-thumb>GitHub</A></motion.span>
            </motion.div>
          </div>
          <motion.div {...up(0.35)}><Props v={v} setV={setV} setMine={setMine} /></motion.div>
        </div>
        <Devices v={v} />
      </div>
    </section>
  );
}

const PROPS = [
  ['One codebase, every platform', 'Write your UI once. Render it natively on iOS, Android, web, and desktop. Same components, same props, same behavior.'],
  ['Design tokens, not CSS', 'Colour, spacing, typography and motion are tokens in one place. Brand is resolved from the hostname it is served on, so the same build wears the right name on every domain without a fork.'],
  ['Compile-Time CSS', 'Styles flatten to atomic CSS at build time. Zero runtime cost on the web, zero style recalc on native.'],
  ['Composable Primitives', 'Stack, XStack, YStack, Text, Button, Sheet, and Dialog — primitives that compose into anything without leaking abstraction.'],
  ['Animated by Default', 'Spring-driven animations on every prop. No extra library, no boilerplate — just declare the target state and ship.'],
  ['The shorthands are the API', 'p, px, bg, items, justify, rounded — the short style props are what the config accepts, and every token behind them is typed. A value that has drifted out of the design system fails the typecheck rather than the review.'],
];

/* The six properties on a horizontal rail you can drag; the one in view counts. */
function Rail() {
  const [ref, live] = useLive(0.3);
  const [at, choose] = useSteps(6, 3400, live);
  return (
    <section className="x-sec gu-rail-sec" ref={ref}>
      <div className="x-wrap">
        <p className="gu-rail-k"><span>Build it once. Ship it everywhere.</span><span className="x-mono">{String(at + 1).padStart(2, '0')} / 06</span></p>
      </div>
      <div className="gu-rail-view">
        <motion.ol className="gu-rail" animate={{ x: `${(-at * 100) / 6}%` }} transition={{ type: 'spring', stiffness: 120, damping: 22 }}>
          {PROPS.map(([t, d], i) => (
            <li key={t} className={at === i ? 'on' : ''}>
              <button type="button" onClick={() => choose(i)} aria-pressed={at === i}>
                <span className="x-mono">{String(i + 1).padStart(2, '0')}</span>
                <h3>{t}</h3>
                <p>{d}</p>
              </button>
            </li>
          ))}
        </motion.ol>
      </div>
      <div className="x-wrap gu-rail-nav">
        <button type="button" aria-label="Previous" onClick={() => choose((at + 5) % 6)}>←</button>
        <button type="button" aria-label="Next" onClick={() => choose((at + 1) % 6)}>→</button>
        <p className="x-sr">02 / 06 03 / 06 04 / 06 05 / 06 06 / 06</p>
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

function Ship() {
  return (
    <section className="x-sec gu-ship" data-room="dark">
      <div className="x-wrap">
        <ul className="gu-plat">
          {PLAT.map(([t, s], i) => <Rise as="li" key={t} delay={i * 0.06}><b>{t}</b><span>{s}</span></Rise>)}
        </ul>
        <div className="gu-ship-grid">
          <div>
            <h2>Drop it in. Start shipping.</h2>
            <p>One install gets you the whole kit.</p>
          </div>
          <div><Code tabs={[{ k: 'terminal', code: CODE }]} mark="pnpm add @hanzo/gui" /></div>
        </div>
      </div>
    </section>
  );
}

export default function Gui() {
  return (
    <main className="gu">
      <Hero />
      <Rail />
      <section className="x-sec gu-paste"><div className="x-wrap"><Paste name="GUI" prompt="Read https://hanzo.ai/skill.md and use Hanzo GUI in my project." /></div></section>
      <Ship />
      <section className="x-sec gu-end">
        <div className="x-wrap gu-end-in">
          <h2>The design system that ships your product</h2>
          <p>Runs every Hanzo app in production, on web, native, and desktop.</p>
          <div><A to={GH} className="x-btn solid">View on GitHub</A></div>
        </div>
      </section>
      <Get name="GUI" tag="React UI library" repo={['hanzoai/gui', GH]} stars="4 stars" />
    </main>
  );
}
