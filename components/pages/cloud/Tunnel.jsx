'use client';
/* Tunnel. Signature: localhost becomes a public URL, and stops being one. `hanzo share 3000` prints the URL; a phone
   on the open internet calls it and the Hanzo fabric carries each request in to 127.0.0.1:3000, while the café network
   the laptop sits on sees nothing listening; close the terminal and the URL stops answering. The six facts are a
   numbered strip that pins as you read; the four modes are switches on one flag. Every word and link is Hanzo's. */
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EASE, Rise } from '../../ui';
import { A } from '../../kit';
import { Hero, Paste, Get, Code, useLive } from './Frame';
import './Tunnel.css';

const URL_ = 'https://wispyfox7421.share.hanzo.ai';

function Share() {
  const [ref, live, calm] = useLive(0.3);
  const [t, setT] = useState(calm ? 2 : 0); // 0 typed, 1 sharing, 2-5 requests, 6 closed
  useEffect(() => {
    if (calm || !live) return;
    const id = setTimeout(() => setT((v) => (v >= 6 ? 0 : v + 1)), [900, 1100, 1000, 1000, 1000, 1400, 2200][t]);
    return () => clearTimeout(id);
  }, [t, live, calm]);
  const up = t >= 1 && t < 6;
  return (
    <div className="tn-scene" ref={ref} aria-hidden="true">
      <div className="tn-phone">
        <p className="tn-url"><i className={up ? 'on' : 'off'} />{URL_.replace('https://', '')}</p>
        <div className="tn-page">
          <AnimatePresence mode="wait" initial={false}>
            {up ? (
              <motion.div key="ok" className="tn-site" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><i /><i /><i /><i /></motion.div>
            ) : (
              <motion.p key="no" className="tn-none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>{t === 0 ? '…' : 'stopped answering'}</motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
      <div className="tn-fabric">
        <span>Hanzo fabric</span>
        <div className="tn-wire">{up && [0, 1, 2].map((i) => <b key={t + '-' + i} style={{ animationDelay: i * 0.3 + 's' }} />)}</div>
      </div>
      <div className="tn-laptop">
        <div className="tn-net"><span>café network</span><em>nothing listening</em></div>
        <div className="tn-term">
          <p><span>$</span> hanzo share 3000</p>
          {t >= 1 && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="g">→ sharing 3000</motion.p>}
          {t >= 1 && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="u">{URL_} → localhost:3000</motion.p>}
          {t >= 2 && t < 6 && <motion.p key={t} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="d">GET / · 127.0.0.1:3000</motion.p>}
          {t >= 6 && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="x">terminal closed</motion.p>}
        </div>
        <p className="tn-bind">127.0.0.1:3000</p>
      </div>
    </div>
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

function Facts() {
  const [mode, setMode] = useState('proxy');
  return (
    <section className="x-sec tn-facts">
      <div className="x-wrap">
        <div className="tn-facts-h">
          <Rise as="h2">For the things that need a real URL</Rise>
          <div className="tn-modes" role="group" aria-label="Mode">
            {['proxy', 'web', 'static', 'drive'].map((m) => <button key={m} type="button" aria-pressed={mode === m} onClick={() => setMode(m)}>{m}</button>)}
          </div>
        </div>
        <ol className="tn-strip">
          {FACTS.map(([t, d], i) => (
            <Rise as="li" key={t} delay={(i % 3) * 0.06} y={20} className={i === 5 ? 'modes' : ''}>
              <span className="tn-n">{String(i + 1).padStart(2, '0')} / 06</span>
              <h3>{t}</h3>
              <p>{d}</p>
              {i === 5 && <p className="tn-mode-now" aria-live="polite"><b>{mode}</b> {mode === 'proxy' ? 'passes traffic through to a local port' : mode === 'drive' ? 'hands over files' : 'serves a directory as a site'}</p>}
            </Rise>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default function Tunnel() {
  return (
    <main className="tn">
      <Hero
        look="stack"
        kick="hanzo share"
        title="Hanzo Tunnel"
        lede="A public HTTPS URL for something running on your laptop. The port stays bound to localhost and the Hanzo fabric carries the traffic to it, so nothing is listening on whatever network the machine is sitting on."
        acts={[['View Source', 'https://github.com/hanzoai']]}
      >
        <Share />
      </Hero>
      <Facts />
      <section className="x-sec tn-one" data-room="dark">
        <div className="x-wrap tn-one-grid">
          <div>
            <Rise as="h2">One command, one URL</Rise>
            <Rise as="p" delay={0.08}>Install the CLI, sign in once, and name a port. It is the same sign-in that runs your agents and bills your usage, so there is nothing else to set up.</Rise>
            <Rise className="tn-one-acts" delay={0.14}><A to="https://docs.hanzo.ai/docs/cli" className="x-btn solid">Install the CLI</A><A to="/pricing" className="x-btn">See Pricing</A></Rise>
          </div>
          <Code title="Tunnel terminal" tabs={[{ k: 'terminal', code: '$ hanzo share 3000\n→ sharing 3000\nhttps://wispyfox7421.share.hanzo.ai → localhost:3000' }]} />
        </div>
      </section>
      <section className="x-sec tn-paste">
        <div className="x-wrap">
          <Paste name="Tunnel" prompt="Read https://hanzo.ai/skill.md and use Hanzo Tunnel in my project. Start with: hanzo share" />
          <div className="tn-start"><Rise as="h2">Get started with Tunnel</Rise><A to="https://github.com/hanzoai" className="x-btn">View on GitHub</A></div>
        </div>
      </section>
      <Get name="Tunnel" tag="Secure tunnels" />
    </main>
  );
}
