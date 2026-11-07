'use client';
/* Tunnel (v2, Cloud 4 chat). Archetype F/A: a terminal-first hero where the URL is the headline → one dark scene that opens
   localhost to the internet and closes it again → the other four facts, one with the four modes → one command → close.
   Accent: share orange.
   V2: 8/10 the command types and the public URL lands as the headline, then a scroll-scrubbed wipe opens localhost to a phone on the internet and shuts it when the terminal closes
   Signature: the URL opens and closes. In a pinned dark room, `hanzo share 3000` types itself; a clip-path wipe grows from
   the URL and lights the open internet, a phone loads the page through the fabric while the café network still sees
   nothing listening; then the terminal closes and the wipe shrinks back: the URL stops answering. Scrubbed by scroll on
   desktop, played when seen on phones.
   Beyond: "A name you can keep". Type a name and a target (a port, a host:port or a full URL) and read the share command
   and the URL that stays yours, from Hanzo's own --name rule.
   Motion: clip-path wipe scrub (signature) + typing + magnetic primary. Every word and link is Hanzo's; the URL is the
   example Hanzo prints. */
import { useEffect, useRef, useState } from 'react';
import { motion, animate, useScroll, useTransform, useMotionValue, useMotionValueEvent, useReducedMotion } from 'motion/react';
import { EASE, Magnetic } from '../../ui';
import { A } from '../../kit';
import { Code, useLive } from './Frame';
import Finale from '../../v2/Finale';
import { useWide } from '../../v2/useWide';
import './Tunnel.css';

const GH = 'https://github.com/hanzoai';
const URL_ = 'https://wispyfox7421.share.hanzo.ai';
const CMD = 'hanzo share 3000';
const up = (d) => ({ initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, ease: EASE, delay: d } });

/* Hero: the command types into a text node; the URL lands as the headline's second act. */
function Hero() {
  const [ref, live, calm] = useLive(0.3);
  const cmd = useRef(null);
  const [done, setDone] = useState(!!calm);
  useEffect(() => {
    if (calm) { if (cmd.current) cmd.current.textContent = CMD; setDone(true); return; }
    if (!live || done) return;
    let i = 0;
    const t = setInterval(() => { i++; if (cmd.current) cmd.current.textContent = CMD.slice(0, i); if (i >= CMD.length) { clearInterval(t); setTimeout(() => setDone(true), 350); } }, 85);
    return () => clearInterval(t);
  }, [live, calm, done]);
  return (
    <section className="tn2-hero" ref={ref}>
      <div className="l2-wrap">
        <motion.p className="l2-kick tn2-kick" {...up(0)}><i aria-hidden="true" />hanzo share</motion.p>
        <h1 className="l2-display"><span className="l2-ln"><motion.span initial={calm ? false : { y: '108%' }} animate={{ y: 0 }} transition={{ duration: 1.15, ease: EASE, delay: 0.08 }}>Hanzo Tunnel</motion.span></span></h1>
        <div className="tn2-hero-row">
          <motion.p className="l2-lede" {...up(0.32)}>A public HTTPS URL for something running on your laptop. The port stays bound to localhost and the Hanzo fabric carries the traffic to it, so nothing is listening on whatever network the machine is sitting on.</motion.p>
          <motion.div className="l2-acts" {...up(0.44)}><Magnetic strength={0.25}><A to={GH} className="x-btn solid" data-thumb="View Source">View Source</A></Magnetic></motion.div>
        </div>
      </div>
      <motion.div className="tn2-term" initial={calm ? false : { opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.25 }} aria-hidden="true">
        <div className="l2-wrap">
          <p className="tn2-cmd l2-mono"><span className="tn2-ps">$</span> <span ref={cmd}>{calm ? CMD : ''}</span><i className={'tn2-caret' + (done ? ' off' : '')} /></p>
          <p className={'tn2-share l2-mono' + (done ? ' on' : '')}>→ sharing 3000</p>
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
  const sec = useRef(null);
  const calm = useReducedMotion();
  const wide = useWide();
  const pin = wide && !calm;
  const [ref, live] = useLive(0.3);
  const { scrollYProgress } = useScroll({ target: sec, offset: ['start start', 'end end'] });
  const clock = useMotionValue(calm ? 0.6 : 0);
  // phones: the scene plays by itself when seen, 9 s a loop
  useEffect(() => {
    if (pin || calm || !live) return;
    const c = animate(clock, [0, 1], { duration: 9, ease: 'linear', repeat: Infinity });
    return () => c.stop();
  }, [pin, calm, live, clock]);
  const p = pin ? scrollYProgress : clock;
  const [q, setQ] = useState(calm ? 60 : 0);
  useMotionValueEvent(p, 'change', (v) => { const n = Math.round(v * 100); if (n !== q) setQ(n); });
  const open = (v) => (v < 0.3 ? 0 : v < 0.42 ? (v - 0.3) / 0.12 : v < 0.78 ? 1 : v < 0.9 ? 1 - (v - 0.78) / 0.12 : 0);
  const clip = useTransform(p, (v) => `circle(${(calm ? 1 : open(v)) * 150}% at 22% 62%)`);
  const typed = CMD.slice(0, Math.round(Math.min(1, q / 22) * CMD.length));
  const up_ = q >= 30 && q < 86;
  const reqs = q < 46 ? 0 : Math.min(3, Math.floor((q - 46) / 8) + 1);
  const closed = q >= 80;
  const cap = q < 50 ? 0 : 4;
  return (
    <section ref={sec} className={'l2-dark tn2-scene' + (pin ? ' pin' : '')} data-room="dark" style={pin ? { height: '320svh' } : undefined}>
      <div className="tn2-scene-pin" ref={ref}>
        <div className="l2-wrap tn2-scene-in">
          <div className="tn2-cap">
            {[0, 4].map((i) => (
              <article key={i} className={'tn2-cap-i' + (cap === i ? ' on' : '')} aria-hidden={cap !== i && pin ? true : undefined}>
                <p className="l2-ch-n">{String(i + 1).padStart(2, '0')} / 06</p>
                <h3 className="l2-head">{FACTS[i][0]}</h3>
                <p className="l2-body">{FACTS[i][1]}</p>
              </article>
            ))}
          </div>
          <div className="tn2-stage" aria-hidden="true">
            <div className="tn2-laptop">
              <p className="tn2-net l2-mono"><span>café network</span><em>nothing listening</em></p>
              <div className="tn2-tw">
                <p><span className="tn2-ps">$</span> {typed}{q < 24 && <i className="tn2-caret" />}</p>
                {q >= 26 && <p className="g">→ sharing 3000</p>}
                {q >= 28 && <p className="u">{URL_} → localhost:3000</p>}
                {Array.from({ length: reqs }).map((_, i) => <p key={i} className="d">GET / · 127.0.0.1:3000</p>)}
                {closed && <p className="x">terminal closed</p>}
              </div>
              <p className="tn2-bind l2-mono">127.0.0.1:3000</p>
            </div>
            <motion.div className="tn2-open" style={{ clipPath: clip }}>
              <span className="tn2-open-k l2-mono">open internet</span>
              <div className="tn2-wire">{up_ && [0, 1, 2].map((i) => <b key={i} style={{ animationDelay: i * 0.35 + 's' }} />)}<span className="l2-mono">Hanzo fabric</span></div>
            </motion.div>
            <div className={'tn2-phone' + (up_ ? ' up' : '')}>
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

/* The other four facts, an editorial list; the last one carries the four modes. */
function Facts() {
  const [mode, setMode] = useState(0);
  return (
    <section className="l2-sec tn2-facts">
      <div className="l2-wrap l2-grid">
        <h2 className="l2-display m tn2-facts-h">For the things that need a real URL</h2>
        <ol className="tn2-list">
          {[1, 2, 3, 5].map((i) => (
            <li key={i}>
              <span className="l2-ch-n">{String(i + 1).padStart(2, '0')} / 06</span>
              <h3 className="l2-title">{FACTS[i][0]}</h3>
              <p className="l2-body">{FACTS[i][1]}</p>
              {i === 5 && (
                <div className="tn2-modes">
                  <div role="group" aria-label="Mode">{MODES.map(([m], k) => <button key={m} type="button" aria-pressed={mode === k} onClick={() => setMode(k)}>{m}</button>)}</div>
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

/* Beyond: a name you keep and a target; the command and the URL that stays yours. */
function Name() {
  const [name, setName] = useState('');
  const [target, setTarget] = useState('3000');
  const n = name.toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 40);
  const t = target.trim();
  const kind = /^\d{1,5}$/.test(t) ? 'a port' : /^https?:\/\//.test(t) ? 'a full URL' : /^[\w.-]+:\d{1,5}$/.test(t) ? 'a host:port' : t ? '' : '';
  return (
    <div className="tn2-name">
      <p className="l2-kick ac">A name you can keep</p>
      <div className="tn2-name-in">
        <label><span>--name</span><input value={name} onChange={(e) => setName(e.target.value)} placeholder="acme-callbacks" spellCheck="false" autoComplete="off" /></label>
        <label><span>target</span><input value={target} onChange={(e) => setTarget(e.target.value)} placeholder="3000" spellCheck="false" autoComplete="off" /></label>
      </div>
      <p className="tn2-name-cmd l2-mono" aria-live="polite">$ hanzo share {n ? `--name ${n} ` : ''}{t || '3000'}</p>
      <p className="tn2-name-url">https://<b>{n || 'wispyfox7421'}</b>.share.hanzo.ai</p>
      <p className="tn2-name-note">{n ? 'Yours to reuse.' : 'A random token by default.'} {kind ? `Target: ${kind}.` : t ? 'A port, a host:port, or a full URL.' : ''}</p>
    </div>
  );
}

function One() {
  return (
    <section className="l2-sec tn2-one">
      <div className="l2-wrap l2-grid">
        <div className="tn2-one-l">
          <h2 className="l2-head">One command, one URL</h2>
          <p className="l2-body">Install the CLI, sign in once, and name a port. It is the same sign-in that runs your agents and bills your usage, so there is nothing else to set up.</p>
          <div className="l2-acts"><A to="https://docs.hanzo.ai/docs/cli" className="x-btn solid">Install the CLI</A><A to="/pricing" className="x-btn">See Pricing</A></div>
          <div className="tn2-code"><Code title="Tunnel terminal" tabs={[{ k: 'terminal', code: '$ hanzo share 3000\n→ sharing 3000\nhttps://wispyfox7421.share.hanzo.ai → localhost:3000' }]} /></div>
        </div>
        <div className="tn2-one-r"><Name /></div>
      </div>
    </section>
  );
}

export default function Tunnel() {
  return (
    <main className="l2-page tn2" style={{ '--ac': '#ff6a13' }}>
      <Hero />
      <Scene />
      <Facts />
      <One />
      <Finale name="Tunnel" head="Get started with Tunnel" acts={[['View on GitHub', GH]]} prompt="Read https://hanzo.ai/skill.md and use Hanzo Tunnel in my project. Start with: hanzo share" tag="Secure tunnels" />
    </main>
  );
}
