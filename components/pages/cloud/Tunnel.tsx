'use client';
/* Tunnel (v2, Cloud 4 chat; motion-map build, 7 Nov). A terminal-first hero where the URL is the headline → the share
   peeled into its layers → one command → the four facts, one with the four modes → the dark room where the URL opens and
   closes → close. Ink, greys and white only.
   Signature: peel (MOTION-MAP.md). The share as a stack (127.0.0.1:3000, café network, Hanzo fabric, the public URL) lifts
   apart into named layers in 3D and closes again: scroll and drag on desktop, by itself and by tap on phones
   (tunnel/Peel.jsx). No pinned chapter scene.
   Entrances: noise-dissolve (the peel), explode-gather (one command), count-roll (the facts), spiral-in (the dark room),
   glitch-in (the close). Each is its own CSS in Tunnel.css; tunnel/enter.js only says when.
   V2: 7/10 motion-map build: peel signature, five page-local entrances, the dark room no longer pinned
   (the notes below are from before the motion map; "Signature:" there is the old one, now the dark room's own loop).
   Persona: a developer who needs a real URL for something on their laptop (a webhook, a demo, a phone test).
   Goal: install the CLI and share a port. CTA: "View Source" (hero, ask bar) / "View on GitHub" (close), same href.
   Metric: github_click (MASTER §1 researchers: a GitHub click), fired as cta_click with data-cta="tunnel.hero".
   Signature: the URL opens and closes. In a pinned dark room, `hanzo share 3000` types itself; a clip-path wipe grows from
   the URL and lights the open internet, a phone loads the page through the fabric while the café network still sees
   nothing listening; then the terminal closes and the wipe shrinks back: the URL stops answering. Scrubbed by scroll on
   desktop, played when seen on phones.
   Beyond: "A name you can keep". Type a name and a target (a port, a host:port or a full URL) and read the share command
   and the URL that stays yours, from Hanzo's own --name rule.
   Motion: clip-path wipe scrub (signature, scroll; plays by itself on phones, with Pause) + typing (time) + the mode
   switch and name builder (state). Every word and link is Hanzo's; the URL is the
   example Hanzo prints. */
import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Copy } from '../../ui';
import NoJs from '../../NoJs';
import { motion, animate, useScroll, useTransform, useMotionValue, useMotionValueEvent } from 'motion/react';
import useCalm from '../../v2/useCalm';
import { EASE } from '../../ui';
import { Cta } from '../../kit';
import { PauseBtn } from '../../v2/x-hamilton/Demo';
import { useLive } from './Frame';
import Finale from '../../v2/Finale';
import Peel from './tunnel/Peel';
import { useEnter, scatter } from './tunnel/enter';
import './Tunnel.css';
import ArtCard from './ArtCard';

/* count-roll: a two-digit number whose digits roll down into place as the facts arrive (the real number is read out) */
function Roll({ n }: { n: number }) {
  const d = String(n).padStart(2, '0');
  return (
    <span className="tn2-roll">
      <span className="tn2-sr">{d}</span>
      {[...d].map((c, k) => (
        <span key={k} className="tn2-roll-d" aria-hidden="true">
          <span className="tn2-roll-s" style={{ '--n': +c, '--k': k }}>{'0123456789'.split('').map((x) => <i key={x}>{x}</i>)}</span>
        </span>
      ))}
    </span>
  );
}
/* explode-gather: each piece starts thrown out from its place (a deterministic scatter) and collapses into it */
const frag = (i: number) => ({ '--fx': ((scatter(i, 1) - 0.5) * 260).toFixed(0) + 'px', '--fy': ((scatter(i, 2) - 0.5) * 200).toFixed(0) + 'px', '--fr': ((scatter(i, 4) - 0.5) * 40).toFixed(0) + 'deg', '--fd': i * 60 + 'ms' });

const GH = 'https://github.com/hanzoai';
const URL_ = 'https://wispyfox7421.share.hanzo.ai';
const CMD = 'hanzo share 3000';
const up = (d: number) => ({ initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, ease: EASE, delay: d } });

/* Hero: the command types into a text node; the URL lands as the headline's second act. */
function Hero() {
  const [ref, live] = useLive<HTMLElement>(0.05);
  const calm = useCalm();
  const cmd = useRef<HTMLSpanElement>(null);
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (calm) { if (cmd.current) cmd.current.textContent = CMD; setDone(true); return; }
    if (!live || done) return;
    if (cmd.current) cmd.current.textContent = ''; // the server text is the full command (JS off); the browser types it
    let i = 0;
    let t: ReturnType<typeof setTimeout> | undefined;
    const step = () => { i++; if (cmd.current) cmd.current.textContent = CMD.slice(0, i); t = i >= CMD.length ? setTimeout(() => setDone(true), 350) : setTimeout(step, 85); };
    t = setTimeout(step, 85);
    return () => clearTimeout(t);
  }, [live, calm, done]);
  // once the URL is up, requests keep arriving through the fabric: one line at a time, while seen, until paused
  const [hits, setHits] = useState(0);
  const [hold, setHold] = useState(false);
  useEffect(() => {
    if (!done || calm || !live || hold) return;
    let t: ReturnType<typeof setTimeout> | undefined;
    const next = () => { setHits((n) => n + 1); t = setTimeout(next, 2600); };
    t = setTimeout(next, 900);
    return () => clearTimeout(t);
  }, [done, calm, live, hold]);
  return (
    <section className="tn2-hero" ref={ref}>
      <div className="l2-wrap">
        <h1 className="l2-display"><span className="l2-ln"><motion.span initial={{ y: '108%' }} animate={{ y: 0 }} transition={{ duration: 1.15, ease: EASE, delay: 0.08 }}>Hanzo Tunnel</motion.span></span></h1>
        <p className="l2-kick tn2-kick">hanzo share</p>
        <div className="tn2-hero-row">
          <motion.p className="l2-lede" {...up(0.32)}>A public HTTPS URL for something running on your laptop. The port stays bound to localhost and the Hanzo fabric carries the traffic to it, so nothing is listening on whatever network the machine is sitting on.</motion.p>
          <motion.div className="l2-acts" {...up(0.44)}><Cta to={GH} id="tunnel.hero" size="lg" thumb>View Source</Cta></motion.div>
        </div>
      </div>
      <motion.div className="tn2-term" initial={{ y: 40 }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.25 }}>
        <PauseBtn paused={hold} onClick={() => setHold((v) => !v)} className="dk tn2-term-pause" />
        <div className="l2-wrap" aria-hidden="true">
          <p className="tn2-cmd l2-mono"><span className="tn2-ps">$</span> <span ref={cmd} suppressHydrationWarning>{CMD}</span><i className={'tn2-caret' + (done ? ' off' : '')} /></p>
          <p className={'tn2-share l2-mono' + (done ? ' on' : '')}><span>→ sharing 3000</span><span className="tn2-hits">{hits > 0 && <span key={hits} className="tn2-hit">GET / · 127.0.0.1:3000</span>}</span></p>
          <p className={'tn2-url' + (done ? ' on' : '')}><span className="tn2-lock" />wispyfox7421<b>.share.hanzo.ai</b><em className="l2-mono">→ localhost:3000</em></p>
        </div>
      </motion.div>
    </section>
  );
}

const FACTS = [
  ['The port stays on localhost', "Your service keeps listening on 127.0.0.1. The fabric reaches in and carries the traffic, so a café, a client's office, or a conference floor sees nothing."],
  ['A name you can keep', 'You get a random token by default. Pass --name and the subdomain is yours to reuse, so the callback URL you registered last week still works today.'],
  ['Your login is the account', 'No second signup, no config file to fill in. The first share provisions the account from the identity you already signed in with, then prints the URL.'],
  ['A shell is never open by hostname', "hanzo link publishes the terminal you are in so the console can watch it, or drive it. That one is gated behind your org's identity provider — knowing the URL is not enough, and if the gate cannot be applied the command refuses to publish."],
  ['It ends when you do', 'The tunnel belongs to the command that started it. Close the terminal and the URL stops answering — a share cannot outlive the session that meant to make it.'],
  ['Four things to put behind it', 'proxy passes traffic through to a local port. web and static serve a directory as a site. drive hands over files. One flag picks which, and a port, a host:port, or a full URL all work as the target.'],
];

/* Signature: the URL opens (a wipe grows from it) and closes (the wipe shrinks back) as the scene is scrolled. */
function Scene() {
  const sec = useRef<HTMLElement>(null);
  const calm = useCalm();
  const pin = false; // motion map: no pinned chapter scene on /tunnel; the room plays by itself on every width
  const [ref, live] = useLive<HTMLDivElement>(0.3);
  const [eref, ein] = useEnter<HTMLElement>(0.15);
  const [paused, setPaused] = useState(false);
  const { scrollYProgress } = useScroll({ target: sec, offset: ['start start', 'end end'] });
  const clock = useMotionValue(0);
  useEffect(() => { if (calm) clock.set(0.6); }, [calm, clock]);
  // phones: the scene plays by itself when seen, 9 s a loop
  useEffect(() => {
    if (pin || calm || !live || paused) return;
    const c = animate(clock, [0, 1], { duration: 9, ease: 'linear', repeat: Infinity });
    return () => c.stop();
  }, [pin, calm, live, clock, paused]);
  const p = pin ? scrollYProgress : clock;
  const [q, setQ] = useState(0);
  useEffect(() => { if (calm) setQ(60); }, [calm]);
  useMotionValueEvent(p, 'change', (v) => { const n = Math.round(v * 100); if (n !== q) setQ(n); });
  const open = (v: number) => (v < 0.3 ? 0 : v < 0.42 ? (v - 0.3) / 0.12 : v < 0.78 ? 1 : v < 0.9 ? 1 - (v - 0.78) / 0.12 : 0);
  const clip = useTransform(p, (v) => `circle(${(calm ? 1 : open(v)) * 150}% at 22% 62%)`);
  // the café laptop types by time once the room is reached (the wipe stays on scroll)
  const [tt, setTt] = useState(0);
  useEffect(() => {
    if (!pin || !live || tt >= CMD.length) return;
    const t = setTimeout(() => setTt((n) => n + 1), tt ? 85 : 500);
    return () => clearTimeout(t);
  }, [pin, live, tt]);
  const typed = CMD.slice(0, Math.max(pin ? tt : 0, Math.round(Math.min(1, q / 22) * CMD.length)));
  const sheen = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
    e.currentTarget.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
  };
  const up_ = q >= 30 && q < 86;
  const reqs = q < 46 ? 0 : Math.min(3, Math.floor((q - 46) / 8) + 1);
  const closed = q >= 80;
  const cap = q < 50 ? 0 : 4;
  return (
    <section ref={(el) => { sec.current = el; eref.current = el; }} className={'l2-dark tn2-scene' + (pin ? ' pin' : '')} data-room="dark" data-in={ein ? '' : undefined} style={pin ? { height: '320svh' } : undefined}>
      <div className={'tn2-scene-pin' + (paused ? ' still' : '')} ref={ref}>
        <PauseBtn paused={paused} onClick={() => setPaused((v) => !v)} className="dk tn2-pause" />
        <div className="l2-wrap tn2-scene-in">
          <div className="tn2-cap">
            {[0, 4].map((i) => (
              <article key={i} className={'tn2-cap-i' + (cap === i ? ' on' : '')} aria-hidden={cap !== i && pin ? true : undefined}>
                <h2 className="l2-head">{FACTS[i][0]}</h2>
                <p className="l2-ch-n">{String(i + 1).padStart(2, '0')} / 06</p>
                <p className="l2-body">{FACTS[i][1]}</p>
              </article>
            ))}
          </div>
          <div className="tn2-stage" aria-hidden="true" onPointerMove={sheen}>
            <div className="tn2-laptop">
              <p className="tn2-net l2-mono"><span>café network</span><em>nothing listening</em></p>
              <div className="tn2-tw">
                <p><span className="tn2-ps">$</span> {typed}{typed.length < CMD.length && <i className="tn2-caret" />}</p>
                {q >= 26 && <p className="g">→ sharing 3000</p>}
                {q >= 28 && <p className="u">{URL_} → localhost:3000</p>}
                {Array.from({ length: reqs }).map((_, i) => <p key={i} className="d">GET / · 127.0.0.1:3000</p>)}
                {closed && <p className="x">terminal closed</p>}
              </div>
              <p className="tn2-bind l2-mono">127.0.0.1:3000</p>
            </div>
            <motion.div className="tn2-open" style={{ clipPath: clip }}>
              <span className="tn2-open-k l2-mono">open internet</span>
              <div className="tn2-wire">{up_ && [0, 1, 2].map((i) => <b key={i} style={{ animationDelay: i * 0.4 + 's' }} />)}<span className="l2-mono">Hanzo fabric</span></div>
            </motion.div>
            <div className={'tn2-phone' + (up_ ? ' up' : closed ? ' down' : '')}>
              <p className="tn2-bar l2-mono"><i />wispyfox7421.share.hanzo.ai</p>
              <div className="tn2-page">
                {up_ ? <div className="tn2-site"><i /><i /><i /><i /><i /></div> : <p className="tn2-none">{q < 30 ? '…' : 'stopped answering'}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const MODES = [['proxy', 'passes traffic through to a local port'], ['web', 'serves a directory as a site'], ['static', 'serves a directory as a site'], ['drive', 'hands over files']];

/* The other four facts, an editorial list; the one in the reading line leads, the rest step back. The last carries the
   four modes, which step through once by themselves when first seen. */
function Facts() {
  const [mode, setMode] = useState(0);
  const [at, setAt] = useState(1);
  const list = useRef<HTMLOListElement>(null);
  const touched = useRef(false);
  const [mref, mlive] = useLive(0.6);
  const calm = useCalm();
  const [eref, ein] = useEnter<HTMLElement>(0.12);
  useEffect(() => {
    const items = [...(list.current?.children || [])];
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) setAt(+(e.target as HTMLElement).dataset.i!); }), { rootMargin: '-45% 0px -45% 0px' });
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  const ran = useRef(false);
  useEffect(() => {
    if (!mlive || calm || ran.current || touched.current) return;
    ran.current = true;
    let k = 0, t: ReturnType<typeof setTimeout> | undefined;
    const next = () => { if (touched.current || ++k > 3) return; setMode(k); t = setTimeout(next, 1300); };
    t = setTimeout(next, 1300);
    return () => clearTimeout(t);
  }, [mlive, calm]);
  const pick = (k: number) => { touched.current = true; setMode(k); };
  const keys = (e: React.KeyboardEvent) => {
    const d = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const k = (mode + d + MODES.length) % MODES.length;
    pick(k);
    e.currentTarget.querySelectorAll('button')[k]?.focus();
  };
  return (
    <section className="l2-sec tn2-facts" ref={eref} data-in={ein ? '' : undefined}>
      <div className="l2-wrap l2-grid">
        <div className="tn2-facts-l">
          <h2 className="l2-display m tn2-facts-h">For the things that need a real URL</h2>
          <p className="tn2-facts-at" aria-hidden="true"><span key={at}>{String(at + 1).padStart(2, '0')}<small> / 06</small></span></p>
          <ArtCard slug="iro" className="tn2-art" />
        </div>
        <ol className="tn2-list" ref={list}>
          {[1, 2, 3, 5].map((i) => (
            <li key={i} data-i={i} className={at === i ? 'on' : undefined} style={{ '--li': i }}>
              <h3 className="l2-title">{FACTS[i][0]}</h3>
              <span className="l2-ch-n"><Roll n={i + 1} /> / 06</span>
              <p className="l2-body">{FACTS[i][1]}</p>
              {i === 1 && <div className="tn2-name-in-list"><Name /></div>}
              {i === 2 && <Print />}
              {i === 3 && <Gate />}
              {i === 5 && (
                <div className="tn2-modes" ref={mref}>
                  <div role="radiogroup" aria-label="Mode" onKeyDown={keys}>
                    {MODES.map(([m], k) => (
                      <button key={m} type="button" role="radio" aria-checked={mode === k} tabIndex={mode === k ? 0 : -1} onClick={() => pick(k)}>
                        {mode === k && <motion.span layoutId="tn2-mode" className="tn2-mode-bg" transition={{ duration: 0.3, ease: EASE }} />}
                        <span>{m}</span>
                      </button>
                    ))}
                  </div>
                  <p aria-live="polite"><b className="l2-mono">{MODES[mode][0]}</b> {MODES[mode][1]}</p>
                </div>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* Fact 03's object: the first share, as it prints. Nothing to fill in between the command and the URL; the URL lands
   once when the fact is read (it is in the HTML from the start, so the card never changes size). */
function Print() {
  const [ref, live, calm] = useLive(0.8);
  const [on, setOn] = useState(false);
  useEffect(() => { if (live || calm) setOn(true); }, [live, calm]);
  return (
    <div className={'tn2-print' + (on ? ' on' : '')} ref={ref} aria-hidden="true">
      <p className="l2-mono"><span>$</span> {CMD}</p>
      <p className="l2-mono tn2-print-u">{URL_}</p>
    </div>
  );
}

/* Fact 04's object: the published terminal behind its gate. The shackle shuts when the fact is read. */
function Gate() {
  const [ref, live, calm] = useLive(0.8);
  // first render matches the server (open); the shackle shuts after mount, so reduced motion never mismatches
  const [shut, setShut] = useState(false);
  useEffect(() => { if (live || calm) setShut(true); }, [live, calm]);
  return (
    <div className={'tn2-gate' + (shut ? ' shut' : '')} ref={ref} aria-hidden="true">
      <p className="tn2-gate-k l2-mono"><span>$</span> hanzo link</p>
      <svg viewBox="0 0 48 56" width="48" height="56"><path className="tn2-gate-s" d="M14 26V16a10 10 0 0 1 20 0v10" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /><rect x="6" y="26" width="36" height="26" rx="6" fill="currentColor" /></svg>
    </div>
  );
}

/* Beyond: a name you keep and a target; the command and the URL that stays yours. */
function Name() {
  const [name, setName] = useState('');
  const [target, setTarget] = useState('3000');
  const [ref, live, calm] = useLive(0.7);
  const typed = useRef<boolean | 'user'>(false);
  useEffect(() => {
    if (!live || calm || typed.current) return;
    typed.current = true;
    const w = 'acme-callbacks';
    let i = 0, t: ReturnType<typeof setTimeout> | undefined;
    const step = () => { i++; setName((v) => (typed.current === 'user' ? v : w.slice(0, i))); if (i < w.length && typed.current !== 'user') t = setTimeout(step, 90); };
    t = setTimeout(step, 600);
    return () => clearTimeout(t);
  }, [live, calm]);
  const mine = (f: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => { typed.current = 'user'; f(e.target.value); };
  const n = name.toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 40);
  const t = target.trim();
  const kind = /^\d{1,5}$/.test(t) ? 'a port' : /^https?:\/\//.test(t) ? 'a full URL' : /^[\w.-]+:\d{1,5}$/.test(t) ? 'a host:port' : t ? '' : '';
  return (
    <div className="tn2-name" ref={ref}>
      <p className="l2-kick">A name you can keep</p>
      <div className="tn2-name-in">
        <label><span>--name</span><input value={name} onChange={mine(setName)} onFocus={() => { typed.current = 'user'; }} placeholder="acme-callbacks" spellCheck="false" autoComplete="off" /></label>
        <label><span>target</span><input value={target} onChange={mine(setTarget)} placeholder="3000" spellCheck="false" autoComplete="off" /></label>
      </div>
      {/* one text node per line, the domain and the note's second sentence on their own lines: typing never moves text */}
      <p className="tn2-name-cmd l2-mono" aria-live="polite">{`$ hanzo share ${n ? `--name ${n} ` : ''}${t || '3000'}`}</p>
      <p className="tn2-name-url">https://<b>{n || 'wispyfox7421'}</b><span className="tn2-name-d">.share.hanzo.ai</span></p>
      <p className="tn2-name-note"><span>{n ? 'Yours to reuse.' : 'A random token by default.'}</span> <span>{kind ? `Target: ${kind}.` : t ? 'A port, a host:port, or a full URL.' : ''}</span></p>
    </div>
  );
}

function One() {
  // the command and its output land by line mask when the block is reached (the hero and the café laptop type; this
  // one does not), then a caret waits
  const ref = useRef(null);
  const end = true;
  const [eref, ein] = useEnter(0.25);
  return (
    <section className="l2-sec tn2-one" ref={eref} data-in={ein ? '' : undefined}>
      <div className="l2-wrap l2-grid">
        <div className="tn2-one-l">
          <h2 className="l2-head tn2-frag" style={frag(0)}>One command, one URL</h2>
          <p className="l2-body tn2-frag" style={frag(1)}>Install the CLI, sign in once, and name a port. It is the same sign-in that runs your agents and bills your usage, so there is nothing else to set up.</p>
          <div className="l2-acts tn2-frag" style={frag(2)}><Cta to="https://docs.hanzo.ai/docs/cli" kind="quiet" id="tunnel.install-cli">Install the CLI</Cta><Cta to="/pricing" kind="link" id="tunnel.pricing" className="tn2-link">See Pricing</Cta></div>
        </div>
        <div className="tn2-one-r tn2-frag" style={frag(3)}>
          {/* the Copy takes the command only: the "$" and the two output lines are shown, never copied */}
          <div className="cf-code" ref={ref}>
            <div className="cf-code-bar"><i /><i /><i /><span className="cf-code-k">terminal</span><Copy text={CMD} /></div>
            <div className="cf-code-body tn2-one-code" tabIndex={0} role="region" aria-label="Tunnel terminal">
              {/* each line is its own block and the typed command is the line's only text node (its caret is a ::after),
                  so typing never moves anything; the output's arrow keeps "→ localhost:3000" together */}
              <pre><code><span className="cf-ln tn2-ln"><span className="tn2-ps-c" aria-hidden="true">$ </span><span className={'tn2-typed' + (end ? '' : ' on')}>{CMD}</span></span><span className={'cf-ln tn2-ln tn2-out' + (end ? '' : ' wait')}>→ sharing 3000</span><span className={'cf-ln tn2-ln tn2-out' + (end ? '' : ' wait')}>{URL_}<wbr /><span className="tn2-nb">{' → localhost:3000'}</span></span><i className={'tn2-caret tn2-wait' + (end ? '' : ' hold')} aria-hidden="true" /></code></pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* The close's object: the share as it stands while the terminal is open, and then, once, the page's own ending:
   the terminal closes and the URL stops answering. It rests there. */
function Shared() {
  const [ref, live, calm] = useLive(0.6);
  const [end, setEnd] = useState(false);
  useEffect(() => {
    if (calm || !live || end) return;
    const t = setTimeout(() => setEnd(true), 2600);
    return () => clearTimeout(t);
  }, [live, calm, end]);
  return (
    <div className={'tn2-end' + (end ? ' off' : '')} ref={ref} aria-hidden="true">
      <p className="tn2-end-k l2-mono"><span className="tn2-end-c"><span>$</span> hanzo share 3000</span><em className="tn2-end-x">terminal closed</em></p>
      <p className="tn2-end-u"><i />wispyfox7421<b>.share.hanzo.ai</b></p>
      <p className="tn2-end-t l2-mono"><span>{end ? 'stopped answering' : '→ localhost:3000'}</span><span>127.0.0.1:3000</span></p>
    </div>
  );
}

/* glitch-in: the close arrives as a short monochrome glitch (slices jump, ≤ 280 ms), then holds still */
function Glitch({ children }: { children?: ReactNode }) {
  const [ref, on] = useEnter<HTMLDivElement>(0.2);

  return <div ref={ref} className="tn2-gl" data-in={on ? '' : undefined}>{children}</div>;
}

export default function Tunnel() {
  return (
    <main id="main" className="l2-page tn2">
      <NoJs css=".tn2-url,.tn2-share{opacity:1!important;transform:none!important}.tn2-cap-i{position:relative!important;opacity:1!important;transform:none!important}.tn2-cap{min-height:0!important}" />
      <Hero />
      <Peel />
      <One />
      <Facts />
      <Scene />
      <Glitch><Finale name="Tunnel" head="Get started with Tunnel" ask={['View on GitHub', GH]} object={<Shared />} prompt="Read https://hanzo.ai/skill.md and use Hanzo Tunnel in my project. Start with: hanzo share" tag="Secure tunnels" className="tn2-fin" /></Glitch>
    </main>
  );
}
