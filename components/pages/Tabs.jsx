'use client';
/* Tabs. Keep tabs on your agents.
   Signature: the layout is a tree, drawn live. Shell panes split themselves inside a browser window while the tree
   beside them grows a branch for every split; close a pane and its sibling takes the space, and nothing else moves.
   Split and close them yourself.
   Beyond: the phone flip. The same tree, turned into what Tabs does on a phone: swipeable pages instead of slivers,
   with the key row a soft keyboard lacks (Esc, Ctrl, Tab and the arrows). Every word is Hanzo's. */
import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EASE, Rise, Copy } from '../ui';
import { A, Go } from '../kit';
import { useLive, useEvery } from './cloud/Frame';
import { leaf, split, close, leaves, isLeaf } from './tabsTree';
import './Tabs.css';

const up = (d) => ({ initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, ease: EASE, delay: d } });
const START = { id: 's0', dir: 'row', a: leaf('p1', 'build'), b: leaf('p2', 'work') };
// the tree tends itself until you take over: two splits, then two closes, and it is back where it began
const SCRIPT = [
  (t) => split(t, 'p2', 'col', leaf('p3', 'shell 3'), 's3'),
  (t) => split(t, 'p1', 'col', leaf('p4', 'shell 4'), 's4'),
  (t) => close(t, 'p3'),
  (t) => close(t, 'p4'),
];
const DOOMED = [null, null, 'p3', 'p4']; // the pane about to close glows first

function Pane({ p, act, doomed, hand }) {
  return (
    <motion.div layout layoutId={'xtb-' + p.id} className={'xtb-pane' + (doomed ? ' doomed' : '')} initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 30 }}>
      <div className="xtb-pane-bar">
        <span className="x-mono">{p.name}</span>
        <span className="xtb-pane-acts">
          <button type="button" onClick={() => hand(split, p.id, 'row')} aria-label={'Split ' + p.name + ' right'}><svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><rect x="2" y="3" width="12" height="10" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.3" /><path d="M8 3v10" stroke="currentColor" strokeWidth="1.3" /></svg></button>
          <button type="button" onClick={() => hand(split, p.id, 'col')} aria-label={'Split ' + p.name + ' down'}><svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><rect x="2" y="3" width="12" height="10" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.3" /><path d="M2 8h12" stroke="currentColor" strokeWidth="1.3" /></svg></button>
          <button type="button" onClick={() => hand(close, p.id)} aria-label={'Close ' + p.name} disabled={act === 1}>×</button>
        </span>
      </div>
      <div className={'xtb-pane-body' + (p.name === 'build' ? ' run' : '')} aria-hidden="true">
        <i /><i /><i /><i />
        <span className="x-mono"><b>$</b><em /></span>
      </div>
    </motion.div>
  );
}

function Panes({ t, n, doomed, hand }) {
  if (isLeaf(t)) return <Pane p={t} act={n} doomed={doomed === t.id} hand={hand} />;
  return (
    <div className={'xtb-split ' + t.dir}>
      <Panes t={t.a} n={n} doomed={doomed} hand={hand} />
      <Panes t={t.b} n={n} doomed={doomed} hand={hand} />
    </div>
  );
}

function Tree({ t }) {
  if (isLeaf(t)) return <motion.li layout="position" layoutId={'xtb-t-' + t.id} className="xtb-leaf"><span className="x-mono">{t.name}</span></motion.li>;
  return (
    <motion.li layout="position" layoutId={'xtb-t-' + t.id} className="xtb-node">
      <span className="x-mono">{t.dir === 'row' ? 'split ⇄' : 'split ⇅'}</span>
      <ul><Tree t={t.a} /><Tree t={t.b} /></ul>
    </motion.li>
  );
}

const KEYS = ['Esc', 'Ctrl', 'Tab', '←', '↑', '↓', '→'];

/* The phone flip: the leaves of the same tree as pages you swipe, with the key row underneath. */
function Phone({ list }) {
  const [at, setAt] = useState(0);
  const [key, setKey] = useState(null);
  const x0 = useRef(null);
  const i = Math.min(at, list.length - 1);
  return (
    <div className="xtb-phone" data-swipe-own data-cursor="Drag"
      onPointerDown={(e) => { x0.current = e.clientX; }}
      onPointerUp={(e) => { const d = x0.current == null ? 0 : e.clientX - x0.current; x0.current = null; if (Math.abs(d) > 36) setAt(Math.max(0, Math.min(list.length - 1, i + (d < 0 ? 1 : -1)))); }}>
      <div className="xtb-phone-top x-mono"><span>{list[i].name}</span><span>{i + 1} / {list.length}</span></div>
      <div className="xtb-phone-pages">
        <motion.div className="xtb-phone-track" animate={{ x: -i * 100 + '%' }} transition={{ type: 'spring', stiffness: 300, damping: 32 }}>
          {list.map((p) => (
            <div key={p.id} className={'xtb-pane-body' + (p.name === 'build' ? ' run' : '')} aria-hidden="true"><i /><i /><i /><i /><span className="x-mono"><b>$</b>{key && p.id === list[i].id ? <kbd>{key}</kbd> : null}<em /></span></div>
          ))}
        </motion.div>
      </div>
      <div className="xtb-dots" role="tablist" aria-label="Pages">
        {list.map((p, k) => <button key={p.id} type="button" role="tab" aria-selected={k === i} aria-label={p.name} onClick={() => setAt(k)}><i /></button>)}
      </div>
      <div className="xtb-keyrow">{KEYS.map((k) => <button key={k} type="button" className="x-mono" onClick={() => setKey(k)} aria-label={'Send ' + k}>{k}</button>)}</div>
    </div>
  );
}

function Hero() {
  const [ref, live] = useLive(0.3);
  const [t, setT] = useState(START);
  const [n, setN] = useState(0);
  const [mine, setMine] = useState(false);
  const [phone, setPhone] = useState(false);
  const [warn, setWarn] = useState(false);
  useEvery(1300, live && !mine && !phone, () => {
    // odd beats warn the pane that is about to close, even beats change the tree
    if (DOOMED[n] && !warn) { setWarn(true); return; }
    setWarn(false); setT((v) => SCRIPT[n](v)); setN((v) => (v + 1) % SCRIPT.length);
  });
  const id = useRef(10);
  const hand = (fn, pid, dir) => {
    setMine(true); setWarn(false);
    if (fn === close) return setT((v) => close(v, pid));
    const k = ++id.current;
    setT((v) => (leaves(v).length >= 6 ? v : split(v, pid, dir, leaf('p' + k, 'shell ' + (leaves(v).length + 1)), 's' + k)));
  };
  const list = leaves(t);
  return (
    <section className="xtb-hero" ref={ref} aria-labelledby="xtb-h1">
      <div className="x-wrap xtb-hero-grid">
        <div className="xtb-copy">
          <motion.p className="x-kick" {...up(0)}>Hanzo Tabs</motion.p>
          <h1 id="xtb-h1" className="xtb-h1">{['Keep tabs on', 'your agents.'].map((l, i) => <span className="x-line" key={l}><motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.05 + i * 0.12 }}>{l}</motion.span></span>)}</h1>
          <motion.p className="xtb-lede" {...up(0.35)}>Your coding agents work in shells on real machines. Tabs puts every one of those shells in front of you — split, tiled, and reachable from anywhere you can open a browser.</motion.p>
          <motion.div className="xtb-acts" {...up(0.48)}><A to="https://tabs.hanzo.ai" className="x-btn solid" data-thumb>Open Tabs</A></motion.div>
        </div>
        <motion.div className="xtb-stage" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.2 }}>
          <div className="xtb-bar">
            <div className="xtb-seg" role="radiogroup" aria-label="Show it on">
              {['Browser', 'Phone'].map((k, i) => (
                <button key={k} type="button" role="radio" aria-checked={phone === !!i} onClick={() => setPhone(!!i)}>
                  {phone === !!i && <motion.span layoutId="xtb-seg" className="xtb-seg-bg" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
                  <span>{k}</span>
                </button>
              ))}
            </div>
            {mine && <button type="button" className="xtb-reset" onClick={() => { setT(START); setN(0); setMine(false); }}>Reset</button>}
          </div>
          <div className="xtb-room">
            <AnimatePresence mode="wait" initial={false}>
              {phone ? (
                <motion.div key="p" className="xtb-room-in" initial={{ opacity: 0, rotateY: -20 }} animate={{ opacity: 1, rotateY: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.45, ease: EASE }}><Phone list={list} /></motion.div>
              ) : (
                <motion.div key="b" className="xtb-room-in" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
                  <div className="xtb-win">
                    <div className="xtb-win-bar"><i /><i /><i /><span className="x-mono">tabs.hanzo.ai</span></div>
                    <div className="xtb-win-body"><Panes t={t} n={list.length} doomed={warn ? DOOMED[n] : null} hand={hand} /></div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="xtb-tree" aria-label="The layout as a tree">
              <p className="x-mono">layout</p>
              <ul><Tree t={t} /></ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

const MACHINES = ['a laptop', 'a workstation', 'a GPU box'];

function Machines() {
  return (
    <section className="x-sec xtb-link" aria-labelledby="xtb-link">
      <div className="x-wrap xtb-link-grid">
        <div>
          <h2 id="xtb-link">Link a machine, and it appears here</h2>
          <p>Run <code className="x-mono">hanzo link</code> on a laptop, a workstation, a GPU box — anything with a shell. The machine keeps the connection, and nothing is exposed to the network it sits on. Open Tabs and the shells are there.</p>
          <div className="xtb-cmd"><span className="x-mono">$ hanzo link</span><Copy text="hanzo link" /></div>
        </div>
        <Rise className="xtb-map" delay={0.1} aria-hidden="true">
          <div className="xtb-lan">
            <span className="xtb-lan-k x-mono">its own network · nothing exposed</span>
            {MACHINES.map((m, i) => (
              <div key={m} className="xtb-mach" style={{ '--i': i }}>
                <b>{m}</b><span className="x-mono">hanzo link</span>
                <i className="xtb-wire"><em /></i>
              </div>
            ))}
          </div>
          <div className="xtb-you"><span className="x-mono">tabs.hanzo.ai</span><b>Open Tabs</b><div className="xtb-mini">{MACHINES.map((m) => <i key={m} />)}</div></div>
        </Rise>
      </div>
    </section>
  );
}

const WHY = [
  ['There is no backend', 'Not a small one — none. Running hanzo link on a machine publishes a terminal over a zero-trust tunnel, already authenticated and already gated, and the browser frames it directly. A server here would be a third party to a conversation that has two.', 'none'],
  ['A shell is a URL', 'One link serves as many independent tmux sessions as you ask for, so a build runs in one pane while you work in another. There is no spawn endpoint because none is needed — asking for a name attaches to that session or creates it.', 'url'],
  ['The layout is a tree', 'A list of rectangles is the shape that looks easier and then cannot answer the only question that matters: close a pane, and who gets the space? With a tree the space belongs to the sibling, so closing replaces the split with that sibling and nothing else moves.', 'tree'],
];

function Glyph({ k }) {
  if (k === 'none') return <div className="xtb-g none"><b>browser</b><i><em /></i><s>server</s><i><em /></i><b>machine</b></div>;
  if (k === 'url') return <div className="xtb-g url x-mono"><span>/</span><span className="xtb-url"><em>build</em><em>work</em></span></div>;
  return <svg className="xtb-g tree" viewBox="0 0 120 64"><path d="M60 8v14M60 22H24v14M60 22h36v14M96 36H76v14M96 36h20v14" /><circle cx="60" cy="8" r="4" /><circle cx="24" cy="40" r="4" /><circle cx="76" cy="54" r="4" /><circle cx="116" cy="54" r="4" /></svg>;
}

function Why() {
  return (
    <section className="x-sec xtb-why" aria-labelledby="xtb-why">
      <div className="x-wrap">
        <h2 id="xtb-why" className="xtb-why-h">Why it is shaped this way</h2>
        <div className="xtb-why-grid">
          {WHY.map(([t, d, k], i) => (
            <article key={t}>
              <div aria-hidden="true"><Glyph k={k} /></div>
              <h3>{t}</h3>
              <p>{d}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

const GET = [
  ['Your terminal, not a viewer', 'A real xterm.js terminal with 10k lines of scrollback, true colour and a cursor that blinks. Type in it, page through it, resize it.', 'term'],
  ['Closing a pane loses nothing', 'Every shell is a tmux session that keeps running when the browser goes away. Reopen it by name and the scrollback is exactly where you left it.', 'keep'],
  ['Works on a phone', 'A phone pages; it does not tile. Splits become swipeable pages instead of unreadable slivers, and a key row gives you Esc, Ctrl, Tab and arrows — the keys a soft keyboard does not have.', 'phone'],
  ['Open source, MIT', 'The layout engine, the terminal client and the site. Fork it, host it, or run it against your own machines.', 'mit'],
];

function What() {
  return (
    <section className="x-sec xtb-what" data-room="dark" aria-labelledby="xtb-what">
      <div className="x-wrap">
        <div className="xtb-what-top">
          <h2 id="xtb-what">What you get</h2>
          <div className="xtb-acts"><Go to="https://tabs.hanzo.ai" solid>Open Tabs</Go><Go to="https://github.com/hanzo-apps/tabs">Read the source</Go></div>
        </div>
        <div className="xtb-tiles">
          {GET.map(([t, d, k], i) => (
            <article key={t} className={'xtb-tile ' + k}>
              <div className="xtb-tile-v" aria-hidden="true">
                {k === 'term' && <span className="x-mono"><b>$</b><em /></span>}
                {k === 'keep' && <><i /><i /><i /></>}
                {k === 'phone' && KEYS.map((x) => <b key={x} className="x-mono">{x}</b>)}
                {k === 'mit' && <b className="x-mono">MIT</b>}
              </div>
              <h3>{t}</h3>
              <p>{d}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Tabs() {
  return (
    <main className="xtb">
      <Hero />
      <Machines />
      <Why />
      <What />
    </main>
  );
}
