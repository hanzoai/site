'use client';
/* UI. Signature: the component board that uses itself. Buttons, a field, a panel and a table sit on a board; the
   DropdownMenu and the Dialog (the two real components) open on their own with a focus ring walking the keyboard path,
   and the tokens under everything retune now and then, so the whole board changes at once.
   Beyond: "Retune the tokens". Pick an accent, drag the radius and the density: every component on the board moves
   together because every value is a token, which is Hanzo's own claim made touchable. Also: the sixty-second init as
   a terminal beside the component it renders. Every word and link is Hanzo's. */
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EASE, Rise, Copy } from '../../ui';
import { A } from '../../kit';
import { Paste, Code, Get, useLive, useEvery, useSteps } from '../cloud/Frame';
import './UiPage.css';

const GH = 'https://github.com/hanzoai/ui';
const up = (d) => ({ initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, ease: EASE, delay: d } });
const ACCENTS = [['ink', '#0a0a0a'], ['blue', '#0a58ca'], ['green', '#1a7f37'], ['violet', '#6e3fd8']];
const SCRIPT = ['menu', 'idle', 'dialog', 'idle', 'retune', 'idle'];

function Board({ tok, setTok, mine, setMine }) {
  const [ref, live] = useLive(0.3);
  const [k, setK] = useState(0);
  const [menu, setMenu] = useState(false);
  const [dlg, setDlg] = useState(false);
  const [focus, setFocus] = useState(0);
  useEvery(1500, live && !mine, () => {
    const n = (k + 1) % SCRIPT.length; setK(n);
    const s = SCRIPT[n];
    setMenu(s === 'menu'); setDlg(s === 'dialog');
    if (s === 'retune') setTok((t) => ({ ...t, a: (t.a + 1) % ACCENTS.length, r: t.r === 14 ? 4 : t.r === 4 ? 22 : 14 }));
    setFocus((f) => (f + 1) % 4);
  });
  const style = { '--ua': ACCENTS[tok.a][1], '--ur': tok.r + 'px', '--ud': tok.d };
  return (
    <div className="ui-board" ref={ref} style={style}>
      <div className="ui-row">
        <button type="button" className={'ui-b solid' + (focus === 0 && !mine ? ' ui-ring' : '')} onClick={() => { setMine(true); setDlg(true); }}>Ship it</button>
        <button type="button" className={'ui-b' + (focus === 1 && !mine ? ' ui-ring' : '')} onClick={() => { setMine(true); setMenu(!menu); }} aria-expanded={menu}>Options ▾</button>
        <AnimatePresence>
          {menu && (
            <motion.ul className="ui-menu" role="menu" initial={{ opacity: 0, y: -6, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -4, scale: 0.98, transition: { duration: 0.12 } }} transition={{ duration: 0.22, ease: EASE }}>
              {['button', 'dialog', 'dropdown-menu'].map((t, i) => <li key={t} role="menuitem" className={i === 1 ? 'on' : ''} onClick={() => setMenu(false)}>{t}</li>)}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
      <label className={'ui-field' + (focus === 2 && !mine ? ' ui-ring' : '')}><span>Field</span><input placeholder="@hanzo/ui" onFocus={() => setMine(true)} /></label>
      <div className="ui-panel">
        <p className="ui-pk">Panel</p>
        <table className="ui-table">
          <tbody>
            {[['chat.hanzo.ai', 'in production'], ['platform.hanzo.ai', 'in production'], ['every Hanzo dashboard', 'in production']].map(([a, b], i) => <tr key={a} className={focus === 3 && i === 0 && !mine ? 'ui-ring' : ''}><td>{a}</td><td><i />{b}</td></tr>)}
          </tbody>
        </table>
      </div>
      <AnimatePresence>
        {dlg && (
          <motion.div className="ui-scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} onClick={() => setDlg(false)}>
            <motion.div className="ui-dialog" role="dialog" aria-label="Dialog" initial={{ opacity: 0, y: 14, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.98 }} transition={{ type: 'spring', stiffness: 420, damping: 30 }} onClick={(e) => e.stopPropagation()}>
              <b>Dialog</b>
              <p>Focus management, keyboard behaviour and placement that CSS cannot.</p>
              <div className="ui-row"><button type="button" className="ui-b solid" onClick={() => setDlg(false)}>Close</button></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Tokens({ tok, setTok, setMine }) {
  const set = (p) => { setMine(true); setTok((t) => ({ ...t, ...p })); };
  return (
    <div className="ui-tok">
      <p className="ui-tok-k x-mono">@hanzo/design tokens</p>
      <div className="ui-sw" role="radiogroup" aria-label="Accent token">
        {ACCENTS.map(([n, c], i) => <button key={n} type="button" role="radio" aria-checked={tok.a === i} aria-label={n} style={{ background: c }} onClick={() => set({ a: i })} />)}
      </div>
      <label><span>--radius <b className="x-mono">{tok.r}px</b></span><input type="range" min="0" max="24" value={tok.r} onChange={(e) => set({ r: +e.target.value })} /></label>
      <label><span>--density <b className="x-mono">{tok.d.toFixed(2)}</b></span><input type="range" min="0.8" max="1.3" step="0.05" value={tok.d} onChange={(e) => set({ d: +e.target.value })} /></label>
    </div>
  );
}

function Hero() {
  const [tok, setTok] = useState({ a: 0, r: 14, d: 1 });
  const [mine, setMine] = useState(false);
  return (
    <section className="ui-hero" aria-labelledby="ui-h1">
      <div className="x-wrap ui-hero-grid">
        <div className="ui-copy">
          <motion.p className="ui-kick" {...up(0)}><img src="/models/enso.webp" alt="" />React Component Library</motion.p>
          <h1 id="ui-h1" className="ui-h1"><span className="x-line"><motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.05 }}>Hanzo UI</motion.span></span></h1>
          <motion.p className="ui-lede" {...up(0.3)}>The React components powering Hanzo apps</motion.p>
          <motion.div className="ui-acts" {...up(0.42)}>
            <motion.span className="x-go" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}><A to={GH} className="x-btn solid" data-thumb="GitHub">GitHub</A></motion.span>
          </motion.div>
          <motion.div {...up(0.5)}><Tokens tok={tok} setTok={setTok} setMine={setMine} /></motion.div>
        </div>
        <motion.div initial={{ opacity: 0, y: 30, rotate: -1 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ duration: 1.2, ease: EASE, delay: 0.2 }}>
          <Board tok={tok} setTok={setTok} mine={mine} setMine={setMine} />
        </motion.div>
      </div>
    </section>
  );
}

const PROPS = [
  ['Overlays are components. The rest is CSS.', 'Dialog and DropdownMenu are real components, because they carry focus management, keyboard behaviour and placement that CSS cannot. Buttons, panels, fields and tables are classes over tokens — which is why reading the markup is still possible.'],
  ['Accessible by Default', "WAI-ARIA compliant, keyboard navigable, screen reader tested. Accessibility isn't an afterthought — it's the foundation."],
  ['Nothing invents a colour', 'Every value comes from a @hanzo/design token — a plain CSS variable, alongside self-hosted faces. Nothing hard-codes a colour, a size or a radius, so retuning the tokens retunes everything at once and a brand fork costs nothing.'],
  ['One package, everywhere', 'pnpm add @hanzo/ui. The same components run chat, console, and cloud — upgrade once and all three move together.'],
  ['Zero Runtime CSS', 'Built on @hanzo/gui primitives. No styled-components, no emotion, no CSS-in-JS at render — one atomic stylesheet, generated at build.'],
  ['Production Tested', 'Powers chat.hanzo.ai, platform.hanzo.ai, and every Hanzo dashboard. If it ships in our products, it ships in your code.'],
];

function Props() {
  const [ref, live] = useLive(0.3);
  const [at, choose] = useSteps(6, 3200, live);
  return (
    <section className="x-sec ui-props" ref={ref}>
      <div className="x-wrap">
        <p className="ui-props-k"><span>Components your design team will sign off on</span><span className="x-mono">{String(at + 1).padStart(2, '0')} / 06</span></p>
        <ol className="ui-spec">
          {PROPS.map(([t, d], i) => (
            <li key={t} className={at === i ? 'on' : ''} onMouseEnter={() => choose(i)}>
              <button type="button" aria-pressed={at === i} onClick={() => choose(i)}><span className="x-mono">{String(i + 1).padStart(2, '0')}</span><h3>{t}</h3></button>
              <p>{d}</p>
            </li>
          ))}
        </ol>
        <p className="x-sr">02 / 06 03 / 06 04 / 06 05 / 06 06 / 06</p>
      </div>
    </section>
  );
}

const CODE = `# Initialize in any React project
npx @hanzo/ui init

# Add the components you need
npx @hanzo/ui add button dialog dropdown-menu

# Use them
import { Button } from "@hanzo/ui"

export function Hello() {
  return <Button>Ship it</Button>
}`;

function Init() {
  return (
    <section className="x-sec ui-init" data-room="dark">
      <div className="x-wrap">
        <header className="ui-init-h">
          <h2>From <code>init</code> to UI in <span className="ui-60">60</span> seconds</h2>
          <p>Add the components you need. Skip the ones you don't.</p>
        </header>
        <div className="ui-init-grid">
          <Rise><Code tabs={[{ k: 'terminal', code: CODE }]} mark="npx @hanzo/ui init" /></Rise>
          <Rise className="ui-render" delay={0.1}>
            <p className="x-mono">Hello()</p>
            <motion.button type="button" className="ui-ship" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}>Ship it</motion.button>
          </Rise>
        </div>
      </div>
    </section>
  );
}

function Stop() {
  return (
    <section className="x-sec ui-stop">
      <div className="x-wrap ui-stop-in">
        <h2>Stop reinventing buttons.</h2>
        <p>Hanzo UI gives you the components — you focus on what makes your product different.</p>
        <div className="ui-stop-acts">
          <A to={GH} className="x-btn solid">View on GitHub</A>
          <span className="ui-pnpm x-mono">pnpm add @hanzo/ui <Copy text="pnpm add @hanzo/ui" /></span>
        </div>
      </div>
    </section>
  );
}

export default function UiPage() {
  return (
    <main className="uip">
      <Hero />
      <Props />
      <section className="x-sec ui-paste"><div className="x-wrap"><Paste name="UI" prompt="Read https://hanzo.ai/skill.md and use Hanzo UI in my project." /></div></section>
      <Init />
      <Stop />
      <Get name="UI" tag="Headless UI primitives" license="MIT" repo={['hanzoai/ui', GH]} stars="8 stars" />
    </main>
  );
}
