'use client';
/* Persona: front-end developers building React products. Goal: add @hanzo/ui to a project. CTA: "GitHub" → github.com/hanzoai/ui. Metric: install_copy.
   UI. V2: 7/10 the component board uses itself beside its token panel (drawn sliders), six pinned chapters with specimens, a dark init room that types once and renders its button, one ask closes; greys only
   Signature: the component board that uses itself. Buttons, a field, a panel and a table sit on a board; the
   DropdownMenu and the Dialog (the two real components) open on their own with a focus ring walking the keyboard path,
   and the tokens under everything retune now and then, so the whole board changes at once.
   Beyond: "Retune the tokens". Pick an accent, drag the radius and the density: every component on the board moves
   together because every value is a token, which is Hanzo's own claim made touchable.
   Motion budget: signature = the self-using board; supporting = Stage (Settle), Chapters (PinChapters), magnetic
   primary. No springs. Colour: none (0 UI hues); the token demo retunes between deck greys. Pauses sit in the token
   panel's bar and under the chapter visual. One dark room: "From init to UI in 60 seconds". Every word and link is Hanzo's. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EASE, Copy, Magnetic } from '../../ui';
import { A, Img } from '../../kit';
import { Paste, useLive, useEvery } from '../cloud/Frame';
import LineMask from '../../v2/x-gauss/LineMask';
import Settle from '../../v2/Settle';
import PinChapters from '../../v2/x-gauss/PinChapters';
import NoJs from '../../v2/x-gauss/NoJs';
import { usePause } from '../../v2/x-gauss/Pause';
import Slider from '../../v2/x-gauss/Slider';
import '../../v2/Scale.css';
import '../../v2/x-gauss/Rhythm.css';
import './UiPage.css';

const GH = 'https://github.com/hanzoai/ui';
const ACCENTS = [['graphite', '#404040'], ['steel', '#525252'], ['silver', '#737373']]; // deck greys: the board never shows a second ink pill beside the ask
const SCRIPT = ['menu', 'idle', 'dialog', 'idle', 'retune', 'idle'];

function Board({ tok, setTok, mine, setMine, paused }) {
  const [ref, live] = useLive(0.3);
  const [k, setK] = useState(0);
  const [menu, setMenu] = useState(false);
  const [dlg, setDlg] = useState(false);
  const [focus, setFocus] = useState(0);
  const ship = useRef(null), opts = useRef(null), box = useRef(null), items = useRef([]);
  useEvery(1500, live && !mine && !paused, () => {
    const n = (k + 1) % SCRIPT.length; setK(n);
    const s = SCRIPT[n];
    setMenu(s === 'menu'); setDlg(s === 'dialog');
    if (s === 'retune') setTok((t) => ({ ...t, a: (t.a + 1) % ACCENTS.length, r: t.r === 14 ? 4 : t.r === 4 ? 22 : 14 }));
    setFocus((f) => (f + 1) % 4);
  });
  // the Dialog does what the copy says: focus moves in, Tab stays inside, Esc closes, focus returns to "Ship it"
  useEffect(() => {
    if (!dlg || !mine) return;
    const t = setTimeout(() => box.current?.querySelector('button')?.focus(), 30);
    const key = (e) => {
      if (e.key === 'Escape') { setDlg(false); ship.current?.focus(); }
      if (e.key === 'Tab') { e.preventDefault(); box.current?.querySelector('button')?.focus(); }
    };
    addEventListener('keydown', key);
    return () => { clearTimeout(t); removeEventListener('keydown', key); };
  }, [dlg, mine]);
  const closeDlg = () => { setDlg(false); if (mine) ship.current?.focus(); };
  // the DropdownMenu: arrows move between items, Esc closes and returns to the trigger
  const menuKey = (e, i) => {
    const n = { ArrowDown: 1, ArrowUp: -1 }[e.key];
    if (n) { e.preventDefault(); items.current[(i + n + 3) % 3]?.focus(); }
    if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setMenu(false); opts.current?.focus(); }
  };
  useEffect(() => { if (menu && mine) setTimeout(() => items.current[0]?.focus(), 30); }, [menu, mine]);
  const style = { '--ua': ACCENTS[tok.a][1], '--ur': tok.r + 'px', '--ud': tok.d };
  return (
    <div className="ui-board" ref={ref} style={style}>
      <div className="ui-row">
        <button ref={ship} type="button" className={'ui-b solid' + (focus === 0 && !mine ? ' ui-ring' : '')} onClick={() => { setMine(true); setDlg(true); }} aria-haspopup="dialog">Ship it</button>
        <button ref={opts} type="button" className={'ui-b' + (focus === 1 && !mine ? ' ui-ring' : '')} onClick={() => { setMine(true); setMenu(!menu); }} aria-expanded={menu} aria-haspopup="menu">Options ▾</button>
        <AnimatePresence>
          {menu && (
            <motion.ul className="ui-menu" role="menu" initial={{ opacity: 0, y: -6, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -4, scale: 0.98, transition: { duration: 0.12 } }} transition={{ duration: 0.22, ease: EASE }}>
              {['button', 'dialog', 'dropdown-menu'].map((t, i) => <li key={t} ref={(el) => { items.current[i] = el; }} role="menuitem" tabIndex={-1} className={i === 1 ? 'on' : ''} onClick={() => { setMenu(false); opts.current?.focus(); }} onKeyDown={(e) => menuKey(e, i)}>{t}</li>)}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
      <label className={'ui-field' + (focus === 2 && !mine ? ' ui-ring' : '')}><span>Field</span><input placeholder="@hanzo/ui" onFocus={() => setMine(true)} /></label>
      <div className="ui-panel">
        <p className="ui-pk">Panel</p>
        <ul className="ui-table">
          {[['chat.hanzo.ai', 'in production'], ['platform.hanzo.ai', 'in production'], ['every Hanzo dashboard', 'in production']].map(([a, b], i) => <li key={a} className={focus === 3 && i === 0 && !mine ? 'ui-ring' : ''}><span>{a}</span><span className="ui-live"><i />{b}</span></li>)}
        </ul>
      </div>
      <AnimatePresence>
        {dlg && (
          <motion.div className="ui-scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} onClick={closeDlg}>
            <motion.div ref={box} className="ui-dialog" role="dialog" aria-modal="true" aria-label="Dialog" initial={{ opacity: 0, y: 14, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.98 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} onClick={(e) => e.stopPropagation()}>
              <b>Dialog</b>
              <p>Focus management, keyboard behaviour and placement that CSS cannot.</p>
              <div className="ui-row"><button type="button" className="ui-b solid" onClick={closeDlg}>Close</button></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Tokens({ tok, setTok, setMine, pauseBtn }) {
  const set = (p) => { setMine(true); setTok((t) => ({ ...t, ...p })); };
  const swKey = (e) => {
    const d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!d) return;
    e.preventDefault();
    const n = (tok.a + d + ACCENTS.length) % ACCENTS.length;
    set({ a: n });
    e.currentTarget.parentElement.querySelectorAll('button')[n]?.focus();
  };
  return (
    <div className="ui-tok">
      <div className="ui-tok-bar"><p className="ui-tok-k x-mono">@hanzo/design tokens</p><span className="ui-pause">{pauseBtn}</span></div>
      <div className="ui-sw" role="radiogroup" aria-label="Accent token">
        {ACCENTS.map(([n, c], i) => <button key={n} type="button" role="radio" aria-checked={tok.a === i} tabIndex={tok.a === i ? 0 : -1} aria-label={n} style={{ background: c }} onClick={() => set({ a: i })} onKeyDown={swKey} />)}
      </div>
      <div className="ui-tok-r"><span>--radius <b className="x-mono">{tok.r}px</b></span><Slider label="--radius" min={0} max={24} step={1} value={tok.r} onChange={(v) => set({ r: v })} /></div>
      <div className="ui-tok-r"><span>--density <b className="x-mono">{tok.d.toFixed(2)}</b></span><Slider label="--density" min={0.8} max={1.3} step={0.05} value={tok.d} onChange={(v) => set({ d: v })} /></div>
    </div>
  );
}

function Hero() {
  const [tok, setTok] = useState({ a: 0, r: 14, d: 1 });
  const [mine, setMine] = useState(false);
  const [paused, pauseBtn] = usePause({ position: 'relative', right: 'auto', top: 'auto' });
  return (
    <section className="ui-hero" aria-labelledby="ui-h1" data-morph-target>
      <div className="w2-wrap">
        <div className="ui-top">
          <div>
            <LineMask as="h1" id="ui-h1" now className="w2-display ui-h1" lines={['Hanzo UI']} />
            <p className="ui-kick"><Img src="/models/enso.webp" alt="" w={24} h={24} />React Component Library</p>
          </div>
          <motion.div className="ui-top-r" initial={{ y: 14 }} animate={{ y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}>
            <p className="w2-lede ui-lede">The React components powering Hanzo apps</p>
            <Magnetic strength={0.25}><A to={GH} className="w2-cta" data-thumb="GitHub" data-cta="ui.hero">GitHub <i aria-hidden="true">↗</i></A></Magnetic>
          </motion.div>
        </div>
        <Settle from={1.02} lift={10}>
          <div className="ui-stage">
            <Board tok={tok} setTok={setTok} mine={mine} setMine={setMine} paused={paused} />
            <Tokens tok={tok} setTok={setTok} setMine={setMine} pauseBtn={pauseBtn} />
          </div>
        </Settle>
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

/* Six specimens, one per chapter. */
function Overlays() {
  return (
    <div className="ui-sp ov" aria-hidden="true">
      <div className="ui-sp-real"><span className="x-mono">&lt;Dialog /&gt;</span><div className="ui-sp-dlg"><b>Dialog</b><i /><i /><em /></div></div>
      <div className="ui-sp-real"><span className="x-mono">&lt;DropdownMenu /&gt;</span><ul className="ui-sp-menu"><li>button</li><li className="on">dialog</li><li>dropdown-menu</li></ul></div>
      <div className="ui-sp-css x-mono">{['.button', '.panel', '.field', '.table'].map((c) => <span key={c}>{c}</span>)}</div>
    </div>
  );
}
function Keys({ on }) {
  const [f, setF] = useState(0);
  useEvery(700, on, () => setF((v) => (v + 1) % 4));
  return (
    <div className="ui-sp keys" aria-hidden="true">
      <div className="ui-sp-row">{['Ship it', 'Options ▾', 'Field', 'Close'].map((t, i) => <span key={t} className={'ui-sp-b' + (f === i ? ' ring' : '')}>{t}</span>)}</div>
      <div className="ui-sp-kbd x-mono"><b>Tab</b><span>aria-* · role · focus</span></div>
    </div>
  );
}
function Tokens2() {
  return (
    <div className="ui-sp tok" aria-hidden="true">
      {[['a colour', 'c'], ['a size', 's'], ['a radius', 'r']].map(([n, k]) => <div key={n} className={'ui-sp-t ' + k}><i /><span className="x-mono">{n}</span></div>)}
      <p className="x-mono">@hanzo/design</p>
    </div>
  );
}
function Everywhere({ on }) {
  const [v, setV] = useState(0);
  useEvery(1400, on, () => setV((x) => (x + 1) % 2));
  return (
    <div className="ui-sp pkg" aria-hidden="true">
      <p className="ui-sp-cmd x-mono">pnpm add @hanzo/ui</p>
      <div className="ui-sp-apps">{['chat', 'console', 'cloud'].map((a) => <motion.div key={a} className="ui-sp-app" animate={{ y: v ? -10 : 0 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}><span className="x-mono">{a}</span><i /><i /></motion.div>)}</div>
    </div>
  );
}
function Atomic() {
  return (
    <div className="ui-sp atom" aria-hidden="true">
      <div className="ui-sp-gone x-mono">{['styled-components', 'emotion', 'CSS-in-JS'].map((x) => <s key={x}>{x}</s>)}</div>
      <div className="ui-sp-sheet"><span className="x-mono">one atomic stylesheet</span><div>{Array.from({ length: 18 }).map((_, i) => <i key={i} />)}</div><em className="x-mono">generated at build</em></div>
    </div>
  );
}
function Prod() {
  return (
    <div className="ui-sp prod" aria-hidden="true">
      {['chat.hanzo.ai', 'platform.hanzo.ai', 'every Hanzo dashboard'].map((a) => <p key={a}><span>{a}</span><b className="x-mono"><i />in production</b></p>)}
    </div>
  );
}

function Props() {
  const [ref, live] = useLive(0.05);
  const [paused, pauseBtn] = usePause({ right: 0, bottom: 0, top: 'auto' });
  return (
    <div ref={ref}>
      <PinChapters id="ui-props" label="Components your design team will sign off on" className="ui-pin"
        title="Components your design team will sign off on"
        chapters={PROPS.map(([t, d]) => ({ t, b: <p>{d}</p> }))}
        visual={(at) => (
          <div className={'ui-vis' + (paused ? ' paused' : '')}>
            {pauseBtn}
            {[Overlays, Keys, Tokens2, Everywhere, Atomic, Prod].map((V, i) => (
              <motion.div key={i} className="ui-vis-i" initial={false} animate={{ opacity: at === i ? 1 : 0, scale: at === i ? 1 : 0.97 }} transition={{ duration: 0.55, ease: EASE }} aria-hidden={at !== i}>
                <V on={live && !paused && at === i} />
              </motion.div>
            ))}
            <p className="ui-vis-n x-mono" aria-hidden="true">{String(at + 1).padStart(2, '0')} / 06</p>
            <p className="x-sr">01 / 06</p>
          </div>
        )} />
    </div>
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

const LINES = CODE.split('\n');
const SHELL = 'npx @hanzo/ui init\nnpx @hanzo/ui add button dialog dropdown-menu';
const RET = LINES.findIndex((l) => l.includes('return <Button>'));

function Init() {
  const [ref, live, calm] = useLive(0.4);
  const [paused, pauseBtn] = usePause({ position: 'relative', right: 'auto', top: 'auto' });
  const [k, setK] = useState(LINES.length); // the HTML carries every line; it types once when first seen
  const [ran, setRan] = useState(false);
  useEffect(() => { if (live && !ran && !calm) { setRan(true); setK(0); } }, [live, ran, calm]);
  useEvery(260, live && !paused && k < LINES.length, () => setK((v) => Math.min(LINES.length, v + 1)));
  return (
    <section className="w2-sec ui-init w2-dark" data-room="dark" ref={ref}>
      <div className="w2-wrap">
        <header className="ui-init-h">
          <h2 className="w2-display s">From <code>init</code> to UI in <span className="ui-60">60</span> seconds</h2>
          <p className="w2-lede">Add the components you need. Skip the ones you don't.</p>
        </header>
        <div className="ui-init-grid">
          <div className={'ui-term' + (paused ? ' paused' : '')}>
            <div className="ui-term-bar"><i /><i /><i /><span className="x-mono">terminal</span><Copy text={SHELL} /><span className="ui-pause">{pauseBtn}</span></div>
            <pre className="x-mono" tabIndex={0} aria-label="terminal">{LINES.map((l, i) => <span key={i} className={(l.startsWith('#') ? 'c' : '') + (i < k ? ' in' : '')}>{l}{'\n'}</span>)}</pre>
          </div>
          <div className="ui-render">
            <p className="x-mono">Hello()</p>
            <AnimatePresence>{k > RET && <motion.button key="ship" type="button" className="ui-ship" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} whileTap={{ scale: 0.98 }}>Ship it</motion.button>}</AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stop() {
  return (
    <section className="w2-sec ui-stop">
      <div className="w2-wrap">
        <div className="ui-paste"><Paste name="UI" prompt="Read https://hanzo.ai/skill.md and use Hanzo UI in my project." /></div>
        <div className="ui-stop-in">
          <h2 className="w2-display">Stop reinventing buttons.</h2>
          <div className="ui-stop-r">
            <p className="w2-lede">Hanzo UI gives you the components — you focus on what makes your product different.</p>
            <div className="ui-stop-acts">
              <Magnetic strength={0.25}><A to={GH} className="w2-cta" data-thumb="GitHub" data-cta="ui.close">View on GitHub <i aria-hidden="true">↗</i></A></Magnetic>
              <span className="ui-pnpm x-mono">pnpm add @hanzo/ui <Copy text="pnpm add @hanzo/ui" /></span>
            </div>
          </div>
        </div>
        <div className="ui-get">
          <div><h2 className="w2-title">Get UI</h2><p className="ui-get-tag">Headless UI primitives</p></div>
          <div className="ui-get-meta">
            <span className="ui-chip"><span>License:</span> MIT</span>
            <A to={GH} className="ui-chip">hanzoai/ui<em>8 stars</em></A>
            <A to="https://platform.hanzo.ai/deploy" className="ui-tlink">Deploy to Cloud</A>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function UiPage() {
  return (
    <main id="main" className="uip w2 gx">
      <NoJs />
      <Hero />
      <Props />
      <Init />
      <Stop />
    </main>
  );
}
