'use client';
/* Persona: developers who run coding agents in shells on their own machines. Goal: open Tabs. CTA: "Open Tabs" → tabs.hanzo.ai. Metric: signup_start (app handoff).
   Tabs. V2: 7/10 the window is the hero (name and address in its own bar, the tree in its sidebar), pinned chapters, a linked-machines map, a dark room of four running objects closing on one ask, greys only
   Keep tabs on your agents.
   Signature: the layout is a tree, drawn live. Shell panes split themselves inside a browser window while the tree
   beside them grows a branch for every split; close a pane and its sibling takes the space, and nothing else moves.
   Split and close them yourself.
   Beyond: the phone flip. The same tree, turned into what Tabs does on a phone: swipeable pages instead of slivers,
   with the key row a soft keyboard lacks (Esc, Ctrl, Tab and the arrows).
   Motion budget: signature = the live tree (layout re-flow); supporting = Settle, Chapters (PinChapters),
   magnetic primary. No springs (ease-emphasis 300ms). Scale rhythm via Rhythm.css (h1 52, h2 26). Colour: none (0 UI hues; no terminal green). Pause buttons on the self-running tree and chapter
   visuals. One dark room: "What you get". Every word is Hanzo's. */
import { useRef, useState } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'motion/react';
import { EASE, Copy, Magnetic } from '../ui';
import { A } from '../kit';
import { useLive, useEvery } from './cloud/Frame';
import { leaf, split, close, leaves, isLeaf } from './tabsTree';
import LineMask from '../v2/x-gauss/LineMask';
import Settle from '../v2/Settle';
import PinChapters from '../v2/x-gauss/PinChapters';
import NoJs from '../v2/x-gauss/NoJs';
import { usePause } from '../v2/x-gauss/Pause';
import '../v2/Scale.css';
import '../v2/x-gauss/Rhythm.css';
import './Tabs.css';

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
    <motion.div layout layoutId={'xtb-' + p.id} className={'xtb-pane' + (doomed ? ' doomed' : '')} initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
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
      <Panes key={t.a.id} t={t.a} n={n} doomed={doomed} hand={hand} />
      <Panes key={t.b.id} t={t.b} n={n} doomed={doomed} hand={hand} />
    </div>
  );
}

function Tree({ t }) {
  // keyed by id, no shared layoutId: a new split node fades in on its own and nothing is reused mid-flight
  const enter = { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 }, transition: { duration: 0.3, ease: EASE } };
  if (isLeaf(t)) return <motion.li layout="position" className="xtb-leaf" {...enter}><span className="x-mono">{t.name}</span></motion.li>;
  return (
    <motion.li layout="position" className="xtb-node" {...enter}>
      <span className="x-mono">{t.dir === 'row' ? 'split ⇄' : 'split ⇅'}</span>
      <ul><Tree key={t.a.id} t={t.a} /><Tree key={t.b.id} t={t.b} /></ul>
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
        <motion.div className="xtb-phone-track" animate={{ x: -i * 100 + '%' }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
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
  const [ref, live] = useLive(0.12);
  const [paused, pauseBtn] = usePause({ right: 8, top: 6 });
  const [t, setT] = useState(START);
  const [n, setN] = useState(0);
  const [mine, setMine] = useState(false);
  const [phone, setPhone] = useState(false);
  const [warn, setWarn] = useState(false);
  useEvery(1300, live && !mine && !phone && !paused, () => {
    // odd beats warn the pane that is about to close, even beats change the tree
    if (DOOMED[n] && !warn) { setWarn(true); return; }
    setWarn(false); setT((v) => SCRIPT[n](v)); setN((v) => (v + 1) % SCRIPT.length);
  });
  const id = useRef(10);
  const hand = (fn, pid, dir) => {
    setMine(true); setWarn(false);
    if (fn === close) return setT((v) => close(v, pid));
    const k = ++id.current;
    const cap = typeof window !== 'undefined' && innerWidth < 900 ? 4 : 6; // a phone keeps panes wide enough to close
    setT((v) => (leaves(v).length >= cap ? v : split(v, pid, dir, leaf('p' + k, 'shell ' + (leaves(v).length + 1)), 's' + k)));
  };
  const list = leaves(t);
  return (
    <section className="xtb-hero" aria-labelledby="xtb-h1" data-morph-target>
      <div className="w2-wrap">
        <div className="xtb-top">
          <LineMask as="h1" id="xtb-h1" now className="w2-display xtb-h1" lines={['Keep tabs on your agents.']} />
          <motion.div className="xtb-top-r" initial={{ y: 14 }} animate={{ y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}>
            <Magnetic strength={0.25}><A to="https://tabs.hanzo.ai" className="w2-cta" data-thumb="Open Tabs" data-cta="tabs.hero">Open Tabs <i aria-hidden="true">↗</i></A></Magnetic>
          </motion.div>
        </div>
        <div ref={ref}>
          <Settle from={1.02} lift={20}>
            <LayoutGroup>
              <div className={'xtb-stage' + (paused ? ' paused' : '')}>
                <div className="xtb-win-bar">
                  <i /><i /><i />
                  <b className="xtb-name">Hanzo Tabs</b>
                  <span className="x-mono xtb-url">tabs.hanzo.ai</span>
                  <div className="xtb-seg" role="radiogroup" aria-label="Show it on" onKeyDown={(e) => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { setPhone((p) => !p); } }}>
                    {['Browser', 'Phone'].map((k, i) => (
                      <button key={k} type="button" role="radio" aria-checked={phone === !!i} aria-label={k} tabIndex={phone === !!i ? 0 : -1} onClick={() => setPhone(!!i)}>
                        {i ? <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true"><rect x="4.5" y="1.5" width="7" height="13" rx="1.6" fill="none" stroke="currentColor" strokeWidth="1.4" /><path d="M7 12.5h2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
                          : <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true"><rect x="1.5" y="2.5" width="13" height="11" rx="1.6" fill="none" stroke="currentColor" strokeWidth="1.4" /><path d="M1.5 5.5h13" stroke="currentColor" strokeWidth="1.4" /></svg>}
                      </button>
                    ))}
                  </div>
                  {mine && <button type="button" className="xtb-reset" aria-label="Reset" onClick={() => { setT(START); setN(0); setMine(false); }}><svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true"><path d="M3.5 8a4.5 4.5 0 1 0 1.4-3.3M3.5 2.5v2.4h2.4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></button>}
                  <span className="xtb-pause">{pauseBtn}</span>
                </div>
                <div className="xtb-room">
                  <AnimatePresence mode="wait" initial={false}>
                    {phone ? (
                      <motion.div key="p" className="xtb-room-in" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.45, ease: EASE }}><Phone list={list} /></motion.div>
                    ) : (
                      <motion.div key="b" className="xtb-room-in xtb-win-body" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
                        <Panes t={t} n={list.length} doomed={warn ? DOOMED[n] : null} hand={hand} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div className="xtb-tree" aria-label="The layout as a tree">
                    <p className="x-mono">layout</p>
                    <ul><Tree t={t} /></ul>
                  </div>
                </div>
              </div>
            </LayoutGroup>
          </Settle>
        </div>
        <p className="w2-lede xtb-lede">Your coding agents work in shells on real machines. Tabs puts every one of those shells in front of you — split, tiled, and reachable from anywhere you can open a browser.</p>
      </div>
    </section>
  );
}


const WHY = [
  ['There is no backend', 'Not a small one — none. Running hanzo link on a machine publishes a terminal over a zero-trust tunnel, already authenticated and already gated, and the browser frames it directly. A server here would be a third party to a conversation that has two.', 'none'],
  ['A shell is a URL', 'One link serves as many independent tmux sessions as you ask for, so a build runs in one pane while you work in another. There is no spawn endpoint because none is needed — asking for a name attaches to that session or creates it.', 'url'],
  ['The layout is a tree', 'A list of rectangles is the shape that looks easier and then cannot answer the only question that matters: close a pane, and who gets the space? With a tree the space belongs to the sibling, so closing replaces the split with that sibling and nothing else moves.', 'tree'],
];

/* Chapter visuals: each idea drawn large. */
function NoServer() {
  return (
    <div className="xtb-v none" aria-hidden="true">
      <b>browser</b>
      <i className="xtb-v-wire"><em /><em /><em /></i>
      <s className="x-mono">server</s>
      <i className="xtb-v-wire back"><em /><em /><em /></i>
      <b>machine</b>
    </div>
  );
}
function ShellUrl({ on }) {
  const [k, setK] = useState(0);
  useEvery(1500, on, () => setK((v) => (v + 1) % 2));
  return (
    <div className="xtb-v url" aria-hidden="true">
      <div className="xtb-v-bar x-mono">tabs.hanzo.ai/<AnimatePresence mode="popLayout" initial={false}><motion.b key={k} initial={{ y: '80%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '-80%', opacity: 0 }} transition={{ duration: 0.4, ease: EASE }}>{['build', 'work'][k]}</motion.b></AnimatePresence></div>
      <div className="xtb-v-two">
        {['build', 'work'].map((s, i) => <div key={s} className={'xtb-v-sess' + (k === i ? ' on' : '')}><span className="x-mono">tmux · {s}</span><i /><i /><i /></div>)}
      </div>
    </div>
  );
}
function SpaceTree({ on }) {
  const [shut, setShut] = useState(false);
  useEvery(1800, on, () => setShut((v) => !v));
  return (
    <div className="xtb-v tree" aria-hidden="true">
      <div className="xtb-v-grid">
        <motion.div layout className="xtb-v-p a" transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}><span className="x-mono">build</span></motion.div>
        <motion.div layout className="xtb-v-col" transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
          <motion.div layout className="xtb-v-p b" transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}><span className="x-mono">work</span></motion.div>
          {!shut && <motion.div layout className="xtb-v-p c" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}><span className="x-mono">shell 3</span></motion.div>}
        </motion.div>
      </div>
      <p className="xtb-v-note x-mono">{shut ? 'closed · the sibling takes the space' : 'split ⇅ · two siblings'}</p>
    </div>
  );
}

function Why() {
  const [ref, live] = useLive(0.05);
  const [paused, pauseBtn] = usePause({ right: 0, bottom: 0, top: 'auto' });
  return (
    <div ref={ref}>
      <PinChapters id="xtb-why" label="Why it is shaped this way" className="xtb-pin"
        title="Why it is shaped this way"
        chapters={WHY.map(([t, d]) => ({ t, b: <p>{d}</p> }))}
        visual={(at) => (
          <div className={'xtb-vis' + (paused ? ' paused' : '')}>
            {pauseBtn}
            {[NoServer, ShellUrl, SpaceTree].map((V, i) => (
              <motion.div key={i} className="xtb-vis-i" initial={false} animate={{ opacity: at === i ? 1 : 0, scale: at === i ? 1 : 0.96 }} transition={{ duration: 0.6, ease: EASE }} aria-hidden={at !== i}>
                <V on={live && !paused && at === i} />
              </motion.div>
            ))}
          </div>
        )} />
    </div>
  );
}

const MACHINES = ['a laptop', 'a workstation', 'a GPU box'];

function Machines() {
  return (
    <section className="w2-sec xtb-link" aria-labelledby="xtb-link">
      <div className="w2-wrap xtb-link-grid">
        <div className="xtb-link-copy">
          <h2 id="xtb-link" className="w2-headline">Link a machine, and it appears here</h2>
          <p className="w2-body">Run <code className="x-mono">hanzo link</code> on a laptop, a workstation, a GPU box — anything with a shell. The machine keeps the connection, and nothing is exposed to the network it sits on. Open Tabs and the shells are there.</p>
          <div className="xtb-cmd"><span className="x-mono">$ hanzo link</span><Copy text="hanzo link" /></div>
        </div>
        <div className="xtb-map" aria-hidden="true">
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
    <section className="w2-sec xtb-what w2-dark" data-room="dark" aria-labelledby="xtb-what">
      <div className="w2-wrap">
        <LineMask as="h2" id="xtb-what" className="w2-display s xtb-what-h" lines={['What you get']} inView />
        <div className="xtb-tiles">
          {GET.map(([t, d, k]) => (
            <article key={t} className={'xtb-tile ' + k}>
              {k === 'mit' ? (
                <A to="https://github.com/hanzo-apps/tabs" className="xtb-tile-v xtb-src" data-cta="tabs.source"><b className="x-mono">MIT</b><span>Read the source <i aria-hidden="true">↗</i></span></A>
              ) : (
                <div className="xtb-tile-v" aria-hidden="true">
                  {k === 'term' && <div className="xtb-sb">{[62, 80, 45, 70, 90, 38, 66, 84, 52, 74, 40, 88].map((w, i) => <i key={i} style={{ width: w + '%' }} />)}<span className="x-mono"><b>$</b><em /></span></div>}
                  {k === 'keep' && <div className="xtb-keep"><i><span className="x-mono">build</span></i><i className="go"><span className="x-mono">work</span></i><i><span className="x-mono">shell 3</span></i></div>}
                  {k === 'phone' && <div className="xtb-mphone"><div className="xtb-mphone-s"><i /><i /><i /></div><div className="xtb-mphone-k">{KEYS.map((x, i) => <b key={x} className="x-mono" style={{ '--i': i }}>{x}</b>)}</div></div>}
                </div>
              )}
              <h3 className="w2-title">{t}</h3>
              <p>{d}</p>
            </article>
          ))}
        </div>
        <div className="xtb-what-ask">
          <Magnetic strength={0.25}><A to="https://tabs.hanzo.ai" className="w2-cta" data-thumb="Open Tabs" data-cta="tabs.close">Open Tabs <i aria-hidden="true">↗</i></A></Magnetic>
        </div>
      </div>
    </section>
  );
}

export default function Tabs() {
  return (
    <main id="main" className="xtb w2 gx">
      <NoJs />
      <Hero />
      <Why />
      <Machines />
      <What />
    </main>
  );
}
