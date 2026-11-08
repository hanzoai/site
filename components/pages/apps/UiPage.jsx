'use client';
/* Persona: front-end developers building React products. Goal: add @hanzo/ui to a project. CTA: "GitHub" → github.com/hanzoai/ui. Metric: install_copy.
   UI. V2: 7/10 motion-map build: magnetic grid signature after the hero, five page-local entrances, no pinned chapters (six chapter cards with their own boards), order hero → grid → dark init room → chapters → paste/Get UI → closing band; greys only
   Signature: magnet-grid. A field of the library's parts bends toward the cursor and ripples out from a click or tap
   (components/pages/apps/ui/Motion.jsx). The hero keeps the component board that uses itself:
   Entrances: accordion (the grid), page-curl (the dark init room), magnet-gather (the six chapter cards), cursor-trail
   (paste and Get UI strip; touch shows it at rest), zoom-through (the closing band).
   Hero board: buttons, a field, a panel and a table sit on a board; the
   DropdownMenu and the Dialog (the two real components) open on their own with a focus ring walking the keyboard path,
   and the tokens under everything retune now and then, so the whole board changes at once.
   Beyond: "Retune the tokens". Pick an accent, drag the radius and the density: every component on the board moves
   together because every value is a token, which is Hanzo's own claim made touchable.
   Motion budget: signature = the self-using board; supporting = Stage (a page-local settle), the chapter board (the chapter in
   the middle of the screen drives one real board), magnetic primary. No springs. Colour: none (0 UI hues); the token demo
   retunes between deck greys. Pauses sit in the token panel's bar, the chapter head row and the terminal bar. One dark room: "From init to UI in 60 seconds". Every word and link is Hanzo's. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { EASE, Copy, Magnetic } from '../../ui';
import { A } from '../../kit';
import { Paste, useLive, useEvery } from '../cloud/Frame';
import LineMask from '../../v2/x-gauss/LineMask';
import NoJs from '../../v2/x-gauss/NoJs';
import { usePause } from '../../v2/x-gauss/Pause';
import Slider from '../../v2/x-gauss/Slider';
import '../../v2/Scale.css';
import '../../v2/x-gauss/Rhythm.css';
import { MagnetGrid, Curl, Trail, In } from './ui/Motion';
import './UiPage.css';
import ArtCard from '../cloud/ArtCard';

const GH = 'https://github.com/hanzoai/ui';
const ACCENTS = [['graphite', '#404040'], ['steel', '#525252'], ['silver', '#737373']]; // deck greys: the board never shows a second ink pill beside the ask
const SCRIPT = ['menu', 'idle', 'dialog', 'idle', 'retune', 'idle'];

function Board({ tok, setTok, mine, setMine, paused, hold }) {
  const [ref, live] = useLive(0.3);
  const [k, setK] = useState(0);
  const [menu, setMenu] = useState(false);
  const [dlg, setDlg] = useState(false);
  const [own, setOwn] = useState(null); // 'menu' | 'dialog' only when the visitor opened it; the script never takes focus
  const [focus, setFocus] = useState(0);
  const ship = useRef(null), opts = useRef(null), box = useRef(null), items = useRef([]);
  const run = live && !mine && !paused && !hold; // the script holds while focus is on the board
  // the board wakes inside the first second: its first real act (the menu opens, the ring lands on Options) about
  // 600 ms after it is first seen, then the 1.5 s rhythm takes over
  const woke = useRef(false);
  useEffect(() => {
    if (!run || woke.current) return undefined;
    const t = setTimeout(() => { woke.current = true; setMenu(true); setFocus(1); }, 600);
    return () => clearTimeout(t);
  }, [run]);
  useEvery(1500, run, () => {
    const n = (k + 1) % SCRIPT.length; setK(n);
    const s = SCRIPT[n];
    setMenu(s === 'menu'); setDlg(s === 'dialog');
    if (s === 'retune') setTok((t) => ({ ...t, a: (t.a + 1) % ACCENTS.length, r: t.r === 14 ? 4 : t.r === 4 ? 22 : 14 }));
    setFocus((f) => (f + 1) % 4);
  });
  // focus or the pointer arriving on the board puts away whatever the script had open, so nothing pulls focus
  useEffect(() => { if (hold && !own) { setMenu(false); setDlg(false); } }, [hold, own]);
  // the Dialog does what the copy says: focus moves in, Tab stays inside, Esc closes, focus returns to "Ship it"
  // (only for a Dialog the visitor opened)
  useEffect(() => {
    if (!dlg || own !== 'dialog') return;
    const t = setTimeout(() => box.current?.querySelector('button')?.focus(), 30);
    const key = (e) => {
      if (e.key === 'Escape') { setDlg(false); ship.current?.focus(); }
      if (e.key === 'Tab') { e.preventDefault(); box.current?.querySelector('button')?.focus(); }
    };
    addEventListener('keydown', key);
    return () => { clearTimeout(t); removeEventListener('keydown', key); };
  }, [dlg, own]);
  const closeDlg = () => { const mineDlg = own === 'dialog'; setDlg(false); setOwn(null); if (mineDlg) ship.current?.focus(); };
  // the DropdownMenu: arrows move between items, Esc closes and returns to the trigger
  const menuKey = (e, i) => {
    const n = { ArrowDown: 1, ArrowUp: -1 }[e.key];
    if (n) { e.preventDefault(); items.current[(i + n + 3) % 3]?.focus(); }
    if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setMenu(false); setOwn(null); opts.current?.focus(); }
  };
  useEffect(() => { if (menu && own === 'menu') setTimeout(() => items.current[0]?.focus(), 30); }, [menu, own]);
  const R = (i) => (focus === i && !mine && !hold ? ' ui-ring' : '');
  const style = { '--ua': ACCENTS[tok.a][1], '--ur': tok.r + 'px', '--ud': tok.d };
  return (
    <div className="ui-board" ref={ref} style={style}>
      <div className="ui-row">
        <button ref={ship} type="button" className={'ui-b solid' + R(0)} onClick={() => { setMine(true); setMenu(false); setOwn('dialog'); setDlg(true); }} aria-haspopup="dialog">Ship it</button>
        <button ref={opts} type="button" className={'ui-b' + R(1)} onClick={() => { setMine(true); setDlg(false); const o = !(menu && own === 'menu'); setMenu(o); setOwn(o ? 'menu' : null); }} aria-expanded={menu} aria-haspopup="menu">Options ▾</button>
        <AnimatePresence>
          {menu && (
            <motion.ul className="ui-menu" role="menu" initial={{ opacity: 0, y: -6, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -4, scale: 0.98, transition: { duration: 0.12 } }} transition={{ duration: 0.22, ease: EASE }}>
              {['button', 'dialog', 'dropdown-menu'].map((t, i) => <li key={t} ref={(el) => { items.current[i] = el; }} role="menuitem" tabIndex={-1} className={i === 1 ? 'on' : ''} onClick={() => { setMenu(false); setOwn(null); opts.current?.focus(); }} onKeyDown={(e) => menuKey(e, i)}>{t}</li>)}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
      <label className={'ui-field' + R(2)}><span>Field</span><input placeholder="@hanzo/ui" onFocus={() => setMine(true)} onInput={() => setMine(true)} /></label>
      <div className="ui-panel">
        <p className="ui-pk">Panel</p>
        <ul className="ui-table">
          {[['chat.hanzo.ai', 'in production'], ['platform.hanzo.ai', 'in production'], ['every Hanzo dashboard', 'in production']].map(([a, b], i) => <li key={a} className={i === 0 ? R(3).trim() : ''}><span>{a}</span><span className="ui-live"><i />{b}</span></li>)}
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
  const [hov, setHov] = useState(null); // the swatch under the pointer or focus names its token
  const shownSw = ACCENTS[hov ?? tok.a];
  return (
    <div className="ui-tok">
      <div className="ui-tok-bar"><p className="ui-tok-k x-mono">@hanzo/design tokens</p><span className="ui-pause">{pauseBtn}</span></div>
      <div className="ui-sw-w">
        <div className="ui-sw" role="radiogroup" aria-label="Accent token" onPointerLeave={() => setHov(null)}>
          {ACCENTS.map(([n, c], i) => <button key={n} type="button" role="radio" aria-checked={tok.a === i} tabIndex={tok.a === i ? 0 : -1} aria-label={n} style={{ background: c }} onClick={() => set({ a: i })} onKeyDown={swKey} onPointerEnter={() => setHov(i)} onFocus={() => setHov(i)} onBlur={() => setHov(null)} />)}
        </div>
        <p className="ui-sw-cap x-mono" aria-hidden="true"><b>{shownSw[0]}</b> {shownSw[1]}</p>
      </div>
      <div className="ui-tok-r"><span>--radius <b className="x-mono">{tok.r}px</b></span><Slider label="--radius" min={0} max={24} step={1} value={tok.r} onChange={(v) => set({ r: v })} /></div>
      <div className="ui-tok-r"><span>--density <b className="x-mono">{tok.d.toFixed(2)}</b></span><Slider label="--density" min={0.8} max={1.3} step={0.05} value={tok.d} onChange={(v) => set({ d: v })} /></div>
    </div>
  );
}

/* Stage: the hero settles 10px as the first screen scrolls away. Page-local, not the shared Settle: it renders the
   same style on the server and on the first client render, and reads reduced motion only after mount (the shared one
   reads it during render, which breaks hydration under reduced motion; requested in docs/build-notes/requests/ui.md). */
function Stage({ children, from = 1, lift = 10 }) {
  const [m, setM] = useState({ h: 800, calm: false });
  useEffect(() => {
    const q = matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => setM({ h: innerHeight, calm: q.matches });
    on();
    addEventListener('resize', on);
    q.addEventListener('change', on);
    return () => { removeEventListener('resize', on); q.removeEventListener('change', on); };
  }, []);
  const { scrollY } = useScroll();
  const scale = useTransform(scrollY, [0, m.h * 0.7], [m.calm ? 1 : from, 1], { clamp: true });
  const y = useTransform(scrollY, [0, m.h * 0.7], [m.calm ? 0 : lift, 0], { clamp: true });
  return <motion.div className="w2-settle" style={{ scale, y, transformOrigin: '50% 0%' }}>{children}</motion.div>;
}

function Hero() {
  const [tok, setTok] = useState({ a: 0, r: 14, d: 1 });
  const [mine, setMineRaw] = useState(false);
  const [poke, setPoke] = useState(0);
  const setMine = (v) => { setMineRaw(v); setPoke((n) => n + 1); };
  // focus on the stage holds the board's script, so a keyboard visitor is never interrupted (a click already makes it theirs)
  const stage = useRef(null);
  const [hold, setHold] = useState(false);
  const leave = (next) => { if (!stage.current?.contains(next)) setHold(false); };
  // after 8 s without a touch (and nothing held) the board goes back to using itself, so it never sits dead
  useEffect(() => { if (!mine || hold) return undefined; const t = setTimeout(() => setMineRaw(false), 8000); return () => clearTimeout(t); }, [mine, poke, hold]);
  const [paused, pauseBtn] = usePause({ position: 'relative', right: 'auto', top: 'auto' });
  return (
    <section className="ui-hero" aria-labelledby="ui-h1" data-morph-target>
      <div className="w2-wrap">
        <div className="ui-top">
          <div>
            <LineMask as="h1" id="ui-h1" now className="w2-display ui-h1" lines={['Hanzo UI']} />
            <p className="ui-kick x-mono">React Component Library</p>
          </div>
          <motion.div className="ui-top-r" initial={{ y: 14 }} animate={{ y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}>
            <p className="w2-lede ui-lede">The React components powering Hanzo apps</p>
            <Magnetic strength={0.25}><A to={GH} className="w2-cta" data-thumb="GitHub" data-cta="ui.hero">GitHub <i aria-hidden="true">↗</i></A></Magnetic>
          </motion.div>
        </div>
        <Stage from={1} lift={10}>
          <div className="ui-stage" ref={stage} onFocus={() => setHold(true)} onBlur={(e) => leave(e.relatedTarget)}>
            <Board tok={tok} setTok={setTok} mine={mine} setMine={setMine} paused={paused} hold={hold} />
            <Tokens tok={tok} setTok={setTok} setMine={setMine} pauseBtn={pauseBtn} />
          </div>
        </Stage>
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

/* The chapters act on one real board (the same object, changing), not on drawings of it. Desktop: the board sticks
   on the left while the six chapters scroll past on the right; the chapter in the middle of the screen drives it.
   Phone: the board sits on top and the chapters are a swipe rail under it (scroll-snap, 16% peek). */
const SHOW_TOK = [{ r: 14, a: 0, n: 'graphite' }, { r: 4, a: 1, n: 'steel' }, { r: 22, a: 2, n: 'silver' }];
const APPS = ['chat', 'console', 'cloud'];

const PRODUCTS = ['chat.hanzo.ai', 'platform.hanzo.ai', 'every Hanzo dashboard'];
const SHEET = 45; // cells of the one atomic stylesheet

/* Each chapter recomposes the board's body out of the same parts (a different view of the library, never the
   hero board again): 01 the two real components open side by side with the class-only parts as a quiet row,
   02 the keyboard path as a column of four stops, 03 the tokens as one big readout,
   04 the same parts laid out as chat, console and cloud, 05 the stylesheet filling the board, 06 the three products.
   The close shows the hero board itself, settled small with its tokens at rest, one product row lit at a time. */
const STOPS = [['Ship it', '.button'], ['Options ▾', '<DropdownMenu />'], ['Field', '.field'], ['Panel', '.panel']];

function Body({ at, t, tok, app, menu, dlg, ring }) {
  // 01: the two real components open side by side, named; the class-only parts sit as one quiet row
  if (at === 0) return (
    <div className="uc-v uc-pair">
      <div className="uc-pc">
        <span className="ui-b">Options ▾</span>
        <AnimatePresence>{menu && (
          <motion.ul className="ui-menu uc-pmenu" initial={{ opacity: 0, y: -6, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -4, transition: { duration: 0.12 } }} transition={{ duration: 0.22, ease: EASE }}>
            {['button', 'dialog', 'dropdown-menu'].map((x, i) => <li key={x} className={t % 3 === i ? 'on' : ''}>{x}</li>)}
          </motion.ul>)}
        </AnimatePresence>
        <p className="uc-cap x-mono">&lt;DropdownMenu /&gt;</p>
      </div>
      <div className="uc-pc">
        <AnimatePresence>{dlg && (
          <motion.div className="ui-dialog uc-pdlg" initial={{ opacity: 0, y: 14, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.3, ease: EASE }}>
            <b>Dialog</b>
            <p>Focus management, keyboard behaviour and placement that CSS cannot.</p>
            <div className="ui-row"><span className="ui-b solid">Close</span></div>
          </motion.div>)}
        </AnimatePresence>
        <p className="uc-cap x-mono">&lt;Dialog /&gt;</p>
      </div>
      <p className="uc-quiet x-mono"><span>.button</span><span>.panel</span><span>.field</span><span>.table</span></p>
    </div>
  );
  // 02: the keyboard path, the four stops in a column, the ring walking down them as Tab presses
  if (at === 1) return (
    <ol className="uc-v uc-keys">
      {STOPS.map(([x, c], i) => (
        <li key={x} className={ring === i ? 'on' : ''}><span className="uc-kn x-mono">{i + 1}</span><span className="uc-kx">{x}</span><em className="x-mono">{c}</em></li>
      ))}
    </ol>
  );
  // the close: the hero board itself, settled small, its tokens at rest
  if (at === 6) return (
    <div className="uc-v uc-rest">
      <div className="ui-row"><span className="ui-b solid">Ship it</span><span className="ui-b">Options ▾</span></div>
      <div className="uc-field"><i>@hanzo/ui</i></div>
      <ul className="ui-table">{PRODUCTS.map((a, i) => <li key={a} className={t % 3 === i ? 'uc-hot' : ''}><span>{a}</span><span className="ui-live"><i />in production</span></li>)}</ul>
      <p className="uc-tokn x-mono">--radius {tok.r}px · {tok.n} · @hanzo/design</p>
    </div>
  );
  if (at === 2) return (
    <div className="uc-v uc-tokv">
      <p className="uc-big x-mono"><span>--radius</span><b>{tok.r}px</b></p>
      <p className="uc-tokn x-mono">{tok.n} · {ACCENTS[tok.a][1]} · @hanzo/design</p>
      <div className="ui-row"><span className="ui-b solid">Ship it</span><span className="ui-b">Options ▾</span></div>
      <div className="uc-field"><i>@hanzo/ui</i></div>
    </div>
  );
  if (at === 3) return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div key={app} className={'uc-v uc-app-v uc-' + app} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10, transition: { duration: 0.15 } }} transition={{ duration: 0.35, ease: EASE }}>
        {app === 'chat' && <>
          <p className="uc-msg me">npx @hanzo/ui add button dialog dropdown-menu</p>
          <p className="uc-msg">Focus management, keyboard behaviour and placement that CSS cannot.</p>
          <div className="uc-compose"><i>@hanzo/ui</i><span className="ui-b solid">Ship it</span></div>
        </>}
        {app === 'console' && <>
          <ul className="uc-side">{['button', 'dialog', 'dropdown-menu'].map((x, i) => <li key={x} className={i === 1 ? 'on' : ''}>{x}</li>)}</ul>
          <div className="uc-main">
            <div className="ui-row"><span className="ui-b solid">Ship it</span><span className="ui-b">Options ▾</span></div>
            <ul className="ui-table">{PRODUCTS.map((a) => <li key={a}><span>{a}</span><span className="ui-live"><i />in production</span></li>)}</ul>
          </div>
        </>}
        {app === 'cloud' && PRODUCTS.map((a) => <div key={a} className="uc-tile"><span>{a}</span><span className="ui-live"><i />in production</span></div>)}
      </motion.div>
    </AnimatePresence>
  );
  if (at === 4) {
    const cells = Math.min(SHEET, 9 + t * 9);
    return (
      <div className="uc-v uc-sheetv">
        <p className="uc-gone x-mono"><s>styled-components</s><s>emotion</s><s>CSS-in-JS</s></p>
        <div className="uc-cells">{Array.from({ length: SHEET }).map((_, i) => <i key={i} className={i < cells ? 'on' : ''} />)}</div>
        <p className="uc-tokn x-mono">one atomic stylesheet · <b>{cells}</b> / {SHEET}</p>
      </div>
    );
  }
  if (at === 5) return (
    <ul className="uc-v uc-prod">
      {PRODUCTS.map((a, i) => <li key={a} className={t % 3 === i ? 'on' : ''}><span>{a}</span><span className="ui-live"><i />in production</span></li>)}
    </ul>
  );
  return null;
}

function ShowBoard({ at, run, bare }) {
  const [t, setT] = useState(0);
  useEffect(() => setT(0), [at]);
  useEvery(at === 1 ? 700 : 1400, run, () => setT((v) => v + 1));
  const tok = at === 2 ? SHOW_TOK[t % 3] : SHOW_TOK[0];
  const app = at === 3 ? APPS[t % 3] : APPS[0];
  const ring = at === 1 ? t % 4 : -1;
  const menu = at === 0 && t % 3 !== 2; // the two real components take turns opening, each mostly open
  const dlg = at === 0 && t % 3 !== 0;
  const cells = at === 4 ? Math.min(18, 6 + t * 4) : 0;
  const style = { '--ua': ACCENTS[tok.a][1], '--ur': tok.r + 'px' };
  return (
    <div className={'uc-board c' + at + (bare ? ' bare' : '')} style={style} inert aria-hidden="true">
      <div className="uc-bar"><i /><i /><i />
        {/* the title bar names an app only in the chapter that lays the parts out as chat, console and cloud */}
        <span className="uc-app x-mono"><AnimatePresence mode="popLayout" initial={false}>{at === 3 && <motion.b key={app} initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }} transition={{ duration: 0.3, ease: EASE }}>{app}</motion.b>}</AnimatePresence></span>
      </div>
      <div className="uc-body">
        {at === 1 && <kbd className="uc-tab x-mono" key={t}>Tab</kbd>}
        <Body at={at} t={t} tok={tok} app={app} menu={menu} dlg={dlg} ring={ring} />
      </div>
      {!bare && <div className="uc-foot x-mono">
        <div className="uc-foot-in">
          {[
            <span key={0}>&lt;Dialog /&gt; · &lt;DropdownMenu /&gt; · .button .panel .field .table</span>,
            <span key={1}><kbd>Tab</kbd> aria-* · role · focus</span>,
            <span key={2}>--radius {tok.r}px · {tok.n} · @hanzo/design</span>,
            <span key={3}>pnpm add @hanzo/ui → {app}</span>,
            <span key={4} className="uc-sheet"><s>styled-components</s><s>emotion</s><s>CSS-in-JS</s><b>{Array.from({ length: 18 }).map((_, i) => <i key={i} className={i < cells ? 'on' : ''} />)}</b></span>,
            <span key={5}>chat.hanzo.ai · platform.hanzo.ai · every Hanzo dashboard</span>,
          ].map((n, i) => <motion.div key={i} className="uc-foot-i" initial={false} animate={{ opacity: at === i ? 1 : 0, y: at === i ? 0 : 8 }} transition={{ duration: 0.3, ease: EASE }}>{n}</motion.div>)}
        </div>
        <span className="uc-n">{String(at + 1).padStart(2, '0')} / 06</span>
      </div>}
    </div>
  );
}

/* The six chapters as plain, quick cards (no pinned scene: /ui is not a `split` page). Each card carries its own small
   board in that chapter's state, running only while the card is on screen. They arrive by magnet-gather. */
const SCATTER = [[-120, 60, -6], [140, -40, 5], [-80, 120, 4], [110, 90, -5], [-150, -30, 3], [90, 140, -4]];
function Card({ i, t, d, paused }) {
  const [ref, live] = useLive(0.3);
  const [gx, gy, gr] = SCATTER[i];
  return (
    <li ref={ref} className="uc-ch ux-card" style={{ '--i': i, '--gx': gx + 'px', '--gy': gy + 'px', '--gr': gr + 'deg' }}>
      <ShowBoard at={i} run={live && !paused} />
      <div className="uc-ct">
        <span className="uc-n2 x-mono">{String(i + 1).padStart(2, '0')}</span>
        <h3 className="uc-t">{t}</h3>
        <p>{d}</p>
      </div>
    </li>
  );
}

function Props() {
  const [paused, pauseBtn] = usePause({ position: 'relative', right: 'auto', top: 'auto' });
  return (
    <section className="uc" aria-labelledby="uc-h">
      <div className="w2-wrap">
        <div className="uc-head">
          <h2 id="uc-h" className="w2-title uc-h">Components your design team will sign off on</h2>
          <span className="uc-artside"><ArtCard slug="enso" className="ui-art" /><span className="ui-pause">{pauseBtn}</span></span>
        </div>
        <In as="ol" className="uc-cards ux-gather" amount={0.1}>
          {PROPS.map(([t, d], i) => <Card key={t} i={i} t={t} d={d} paused={paused} />)}
        </In>
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
  // the one figure Hanzo gives here, "60", counts up once as the terminal starts (the HTML carries 60)
  const [sec, setSec] = useState(60);
  const counted = useRef(false);
  useEffect(() => {
    if (!live || calm || counted.current) return undefined;
    counted.current = true;
    let raf = 0; const t0 = performance.now();
    const step = (now) => { const p = Math.min(1, (now - t0) / 1100); setSec(Math.round(60 * (1 - Math.pow(1 - p, 3)))); if (p < 1) raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step);
    return () => { cancelAnimationFrame(raf); setSec(60); };
  }, [live, calm]);
  const [sent, setSent] = useState(false);
  const sentT = useRef(0);
  const ship = () => { setSent(true); clearTimeout(sentT.current); sentT.current = setTimeout(() => setSent(false), 1800); };
  useEffect(() => () => clearTimeout(sentT.current), []);
  return (
    <Curl><section className="w2-sec ui-init w2-dark" data-room="dark" ref={ref}>
      <div className="w2-wrap">
        <header className="ui-init-h">
          <h2 className="w2-display s ui-init-t">From <code>init</code> to UI in <span className="ui-60">{sec}</span> seconds</h2>
          <p className="w2-lede">Add the components you need. Skip the ones you don't.</p>
        </header>
        <div className="ui-init-grid">
          <div className={'ui-term' + (paused ? ' paused' : '')}>
            <div className="ui-term-bar"><i /><i /><i /><span className="x-mono">terminal</span><Copy text={SHELL} /><span className="ui-pause">{pauseBtn}</span></div>
            <pre className="x-mono" tabIndex={0} aria-label="terminal">{LINES.map((l, i) => <span key={i} className={(l.startsWith('#') ? 'c' : '') + (i < k ? ' in' : '')}>{l}{'\n'}</span>)}</pre>
          </div>
          <div className="ui-render" data-sent={sent ? '' : undefined}>
            <p className="x-mono">Hello()</p>
            {/* the rendered button answers: pressed, it ships (a tick lands beside it and the card rings once) */}
            {/* the slot is always there, so Hello() never moves; a quiet outline waits where the button will render */}
            <div className={'ui-slot' + (k > RET ? ' in' : '')}><AnimatePresence>{k > RET && <motion.button key="ship" type="button" className="ui-ship" aria-pressed={sent} onClick={ship} initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} whileTap={{ scale: 0.98 }}>Ship it<span className="ui-ship-ok" aria-hidden="true">✓</span></motion.button>}</AnimatePresence></div>
          </div>
        </div>
      </div>
    </section></Curl>
  );
}

/* The close: the paste prompt and the Get UI strip come first as quiet proof (on paper), then the page ends on one
   band, its line and its one ask beside the hero board settled small, then the footer. */
function Stop() {
  const [ref, live] = useLive(0.3);
  return (
    <section className="w2-sec ui-stop" ref={ref}>
      <div className="w2-wrap">
        <Trail>
        <div className="ui-paste"><Paste name="UI" prompt="Read https://hanzo.ai/skill.md and use Hanzo UI in my project." /></div>
        <div className="ui-get">
          <div><h2 className="w2-title">Get UI</h2><p className="ui-get-tag">Headless UI primitives</p></div>
          <div className="ui-get-meta">
            <span className="ui-chip"><span>License:</span> MIT</span>
            <A to={GH} className="ui-chip">hanzoai/ui<em>8 stars</em></A>
            <A to="https://platform.hanzo.ai/deploy" className="ui-tlink">Deploy to Cloud</A>
          </div>
        </div>
        </Trail>
        <In className="ui-stop-in ux-zoom" amount={0.3}>
          <div className="ui-stop-l">
            <h2 className="w2-display gx-stay">Stop reinventing buttons.</h2>
            <p className="w2-lede">Hanzo UI gives you the components — you focus on what makes your product different.</p>
            <div className="ui-stop-acts">
              <Magnetic strength={0.25}><A to={GH} className="w2-cta" data-thumb="GitHub" data-cta="ui.close"><span>View on GitHub</span> <i aria-hidden="true">↗</i></A></Magnetic>
              <span className="ui-pnpm x-mono">pnpm add @hanzo/ui <Copy text="pnpm add @hanzo/ui" /></span>
            </div>
          </div>
          <div className="ui-stop-obj"><ShowBoard at={6} run={live} bare /></div>
        </In>
      </div>
    </section>
  );
}

export default function UiPage() {
  return (
    <main id="main" className="uip w2 gx">
      <NoJs />
      <Hero />
      <MagnetGrid />
      <Init />
      <Props />
      <Stop />
    </main>
  );
}
