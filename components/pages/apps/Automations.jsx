'use client';
/* Automations (v2, Cloud 4 chat). Archetype C, Catalogue: a hero where the most reached-for apps drop onto a Hanzo Auto
   canvas → the full catalogue, grouped by category, with chips and a search that re-flow it, beside a sticky tray that
   mirrors the canvas → "Not here?" as the one dark closing band.
   Persona: a builder checking whether the apps they use can be steps. Goal: find their app, then open Auto or ask for one.
   CTA: "All Integrations" (hero, ask bar; data-cta primary); the band's ask is Hanzo's "Request Integration" (data-cta
   close). Metric: cta_click:automations.primary.
   V2: 8/10 left-to-right canvas (no dot grid) with drawn wires, travelling run packets and a drop clock, fixed height (no shift); chips and search really filter, re-flowing grouped rails; grey emoji with colour only as state; tiles drop into a sticky tray
   Signature: apps dropping onto a canvas. The twelve most-reached-for apps sit in a dock beside a Hanzo Auto canvas; one by
   one they drop in and wire themselves into a flow, left to right (a change in one starts the run, the next is read, the
   last is written). Tap any app, in the dock or in the catalogue, to drop it in yourself.
   Beyond: type an app's name and the catalogue answers at once; if it is not there, Hanzo's own "Not here?" answer shows
   in place, with the request link beside it.
   Motion: the dock dropping apps in (signature, time, pausable; run packets travel the wires, a clock fills to the next
   drop) + chip pill and card re-flow (state) + tiles lifting under the pointer and dropping into the tray (pointer, state).
   Every word and link is Hanzo's. */
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EASE } from '../../ui';
import { A, Cta } from '../../kit';
import { useDemo, PauseBtn } from '../../v2/x-hamilton/Demo';
import '../../v2/x-hamilton/Launch.css';
import './Automations.css';

const APPS = [
  ["🤖", "OpenAI", "AI & LLMs", 1],
  ["🧠", "Anthropic Claude", "AI & LLMs", 1],
  ["✨", "Google Gemini", "AI & LLMs", 1],
  ["☁️", "Azure OpenAI", "AI & LLMs", 0],
  ["🤗", "Hugging Face", "AI & LLMs", 0],
  ["🔄", "Replicate", "AI & LLMs", 0],
  ["🎨", "Stability AI", "AI & LLMs", 0],
  ["🔊", "ElevenLabs", "AI & LLMs", 0],
  ["🎙️", "Deepgram", "AI & LLMs", 0],
  ["💬", "Slack", "Communication", 1],
  ["🎮", "Discord", "Communication", 1],
  ["✈️", "Telegram", "Communication", 0],
  ["📱", "WhatsApp", "Communication", 1],
  ["👥", "Microsoft Teams", "Communication", 0],
  ["📞", "Twilio", "Communication", 0],
  ["📹", "Zoom", "Communication", 0],
  ["💭", "Google Chat", "Communication", 0],
  ["📝", "Notion", "Productivity", 1],
  ["📊", "Airtable", "Productivity", 1],
  ["📗", "Google Sheets", "Productivity", 1],
  ["📄", "Google Docs", "Productivity", 0],
  ["📁", "Google Drive", "Productivity", 1],
  ["📦", "Dropbox", "Productivity", 0],
  ["📅", "Calendly", "Productivity", 0],
  ["🗓️", "Google Calendar", "Productivity", 0],
  ["📋", "Trello", "Productivity", 0],
  ["✅", "Asana", "Productivity", 0],
  ["🎯", "ClickUp", "Productivity", 0],
  ["📐", "Linear", "Productivity", 1],
  ["🔷", "Jira", "Productivity", 0],
  ["🐘", "PostgreSQL", "Data & Storage", 0],
  ["🐬", "MySQL", "Data & Storage", 0],
  ["🍃", "MongoDB", "Data & Storage", 0],
  ["🔴", "Redis", "Data & Storage", 0],
  ["⚡", "Supabase", "Data & Storage", 0],
  ["🔥", "Firebase", "Data & Storage", 0],
  ["☁️", "AWS S3", "Data & Storage", 0],
  ["☁️", "Google Cloud Storage", "Data & Storage", 0],
  ["❄️", "Snowflake", "Data & Storage", 0],
  ["📊", "BigQuery", "Data & Storage", 0],
  ["☁️", "Salesforce", "CRM & Sales", 1],
  ["🧡", "HubSpot", "CRM & Sales", 1],
  ["📈", "Pipedrive", "CRM & Sales", 0],
  ["📞", "Close", "CRM & Sales", 0],
  ["💬", "Intercom", "CRM & Sales", 0],
  ["🎧", "Zendesk", "CRM & Sales", 0],
  ["🎫", "Freshdesk", "CRM & Sales", 0],
  ["🚀", "Apollo", "CRM & Sales", 0],
  ["💳", "Stripe", "Commerce", 1],
  ["🛒", "Shopify", "Commerce", 1],
  ["🛍️", "WooCommerce", "Commerce", 0],
  ["⬜", "Square", "Commerce", 0],
  ["💰", "PayPal", "Commerce", 0],
  ["💵", "Chargebee", "Commerce", 0],
  ["🏓", "Paddle", "Commerce", 0],
  ["🍋", "LemonSqueezy", "Commerce", 0],
  ["🐵", "Mailchimp", "Marketing", 1],
  ["📧", "SendGrid", "Marketing", 0],
  ["✉️", "Resend", "Marketing", 0],
  ["📬", "ConvertKit", "Marketing", 0],
  ["📊", "ActiveCampaign", "Marketing", 0],
  ["📨", "Brevo", "Marketing", 0],
  ["👤", "Customer.io", "Marketing", 0],
  ["📮", "Postmark", "Marketing", 0],
  ["🐙", "GitHub", "Developer Tools", 1],
  ["🦊", "GitLab", "Developer Tools", 0],
  ["▲", "Vercel", "Developer Tools", 0],
  ["🌐", "Netlify", "Developer Tools", 0],
  ["🚂", "Railway", "Developer Tools", 0],
  ["🎨", "Render", "Developer Tools", 0],
  ["🐛", "Sentry", "Developer Tools", 0],
  ["🚨", "PagerDuty", "Developer Tools", 0],
  ["🐕", "Datadog", "Developer Tools", 0],
  ["𝕏", "Twitter / X", "Social Media", 0],
  ["🔗", "LinkedIn", "Social Media", 1],
  ["📸", "Instagram", "Social Media", 0],
  ["📘", "Facebook", "Social Media", 0],
  ["🎵", "TikTok", "Social Media", 0],
  ["▶️", "YouTube", "Social Media", 0],
  ["📌", "Pinterest", "Social Media", 0],
  ["🦋", "Bluesky", "Social Media", 0]
];
const CATS = ['All', 'AI & LLMs', 'Communication', 'Productivity', 'Data & Storage', 'CRM & Sales', 'Commerce', 'Marketing', 'Developer Tools', 'Social Media'];
const DOCK = ['OpenAI', 'Anthropic Claude', 'Google Gemini', 'Slack', 'Discord', 'WhatsApp', 'Notion', 'Airtable', 'Google Sheets', 'Google Drive', 'Linear', 'Salesforce'];
const BY = Object.fromEntries(APPS.map((a) => [a[1], a]));
const SLUGS = new Set();
const slug = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
APPS.forEach((a) => SLUGS.add(slug(a[1])));
const ROLE = ['a change in it starts a run', 'read from it', 'write to it'];
const EMPH = [0.16, 1, 0.3, 1];
const up = (d) => ({ initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.7, ease: EASE, delay: d } });

/* Signature: the dock and the canvas. Apps drop in by themselves while the canvas is seen (first at 0.45 s, then every
   1.6 s, by a timeout chain); tap one to drop it in yourself, and the flow re-wires left to right: the first starts the
   run, the next is read, the last is written. The canvas always holds three places, so it never changes height. */
function Canvas({ flow, add, mine, drop }) {
  const [ref, live, , paused, toggle] = useDemo(0.3);
  const k = useRef(3);
  const [n, setN] = useState(0);
  const auto = live && !mine;
  useEffect(() => {
    if (!auto) return;
    let t = 0;
    const step = (ms) => { t = setTimeout(() => { add(DOCK[k.current % DOCK.length]); k.current += 5; setN((x) => x + 1); step(1600); }, ms); };
    step(450);
    return () => clearTimeout(t);
  }, [auto]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className={'am2-stage' + (live ? ' live' : '')} ref={ref}>
      <div className="am2-dock-wrap">
        <h2 className="am2-dock-h l2-mono">Most reached for</h2>
        <ul className="am2-dock">
          {DOCK.map((t) => (
            <li key={t}>
              <button type="button" className={flow.includes(t) ? 'in' : ''} aria-pressed={flow.includes(t)} onClick={() => drop(t)}>
                <span className="am2-em" aria-hidden="true">{BY[t][0]}</span><span className="am2-dn">{t}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="am2-canvas">
        <ol className="am2-flow" aria-live="polite">
          <AnimatePresence initial={false} mode="popLayout">
            {flow.map((t, i) => (
              <motion.li key={t} layout className={'am2-step' + (i > 0 ? ' w' : ' first') +(i === flow.length - 1 ? ' new' : '')} initial={{ opacity: 0, y: 80, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }} transition={{ duration: 0.3, ease: EMPH }}>
                {i > 0 && <motion.i className="am2-wire" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5, ease: EASE, delay: 0.2 }} aria-hidden="true"><b className="am2-pkt" /></motion.i>}
                <A to={'#' + slug(t)} className="am2-node" target="_self" rel={undefined}>
                  <span className="am2-em" aria-hidden="true">{BY[t][0]}</span>
                  <b>{t}</b>
                  <em className="l2-mono">{ROLE[i]}</em>
                </A>
              </motion.li>
            ))}
          </AnimatePresence>
          {Array.from({ length: 3 - flow.length }, (_, j) => <li key={'slot' + (flow.length + j)} className="am2-slot w" aria-hidden="true"><i className="am2-wire" /><span /></li>)}
        </ol>
        <div className="am2-canvas-foot">
          <span className="am2-canvas-k l2-mono">Hanzo Auto</span>
          <span className="am2-clock" aria-hidden="true">{auto && n > 0 && <i key={n} />}</span>
          <PauseBtn paused={paused} onClick={toggle} />
        </div>
      </div>
    </div>
  );
}

function Hero(props) {
  return (
    <section className="am2-hero" aria-labelledby="am2-h1">
      <div className="l2-wrap">
        <div className="am2-top">
          <div className="am2-name">
            <h1 id="am2-h1" className="l2-display">
              {['The apps', 'a workflow', 'can reach'].map((t, i) => <span key={t} className="l2-ln"><motion.span initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 0.7, ease: EASE, delay: 0.04 + i * 0.06 }}>{t}{' '}</motion.span></span>)}
            </h1>
            <motion.p className="l2-stage-kick l2-mono am2-kick" {...up(0.18)}>Hanzo Auto · Connectors</motion.p>
          </div>
          <div className="am2-side">
            <motion.p className="l2-lede" {...up(0.14)}>Every one of these is a step you can drop onto a Hanzo Auto canvas: read from it, write to it, or let a change in it start a run.</motion.p>
            <motion.div className="l2-acts" {...up(0.2)}><Cta to="#all" id="primary" size="lg" thumb data-thumb="All Integrations" target="_self" rel={undefined}>All Integrations</Cta></motion.div>
          </div>
        </div>
        <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: 0.08 }}><Canvas {...props} /></motion.div>
      </div>
    </section>
  );
}

/* The tray: the canvas's flow, mirrored beside the catalogue, so a tapped tile visibly lands somewhere. A packet runs
   the wires once each time the flow changes. */
function Tray({ flow }) {
  const run = flow.join('|');
  return (
    <div className="am2-tray" aria-hidden="true">
      <span className="am2-tray-k l2-mono">Hanzo Auto</span>
      <ol>
        {[0, 1, 2].map((i) => {
          const t = flow[i];
          return (
            <li key={i} className={t ? 'on' : ''}>
              {i > 0 && <i className="am2-tray-wire">{t && <b key={run} />}</i>}
              {t
                ? <motion.span key={t} className="am2-tray-n" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: EMPH }}><span className="am2-em">{BY[t][0]}</span><span className="am2-tray-t">{t}</span></motion.span>
                : <span className="am2-tray-n empty" />}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/* The catalogue: grouped by category; the chips and search hide what does not match and the rest re-flow into place
   (FLIP on transform, 300 ms ease-emphasis). The search answers "is my app here?" (Beyond). A tile drops its app into
   the flow; the tray beside it shows where it landed. */
function Catalog({ flow, drop }) {
  const [cat, setCat] = useState('All');
  const [q, setQ] = useState('');
  const input = useRef(null);
  const s = q.trim().toLowerCase();
  const groups = useMemo(() => CATS.slice(1).filter((c) => cat === 'All' || c === cat)
    .map((c) => [c, APPS.filter((a) => a[2] === c && (!s || a[1].toLowerCase().includes(s)))])
    .filter((g) => g[1].length), [cat, s]);
  const shown = groups.reduce((m, g) => m + g[1].length, 0);
  const nothing = s && !shown;
  const count = (c) => (c === 'All' ? APPS.length : APPS.filter((a) => a[2] === c).length);
  useEffect(() => { // a canvas node links to its entry: show the whole catalogue so the entry is there to land on
    const on = () => {
      const id = location.hash.slice(1);
      if (!SLUGS.has(id)) return;
      const there = document.getElementById(id);
      setCat('All'); setQ('');
      if (!there) setTimeout(() => document.getElementById(id)?.scrollIntoView({ block: 'center' }), 60);
    };
    addEventListener('hashchange', on);
    return () => removeEventListener('hashchange', on);
  }, []);
  return (
    <section className="l2-sec am2-cat" id="all">
      <div className="l2-wrap am2-cat-in">
        <div className="am2-cat-side">
          <h2 className="l2-head">All Integrations</h2>
          <p className="am2-count l2-mono" aria-live="polite">{shown === 81 ? '81 integrations' : `${shown} of 81 integrations`}</p>
          <label className="am2-find">
            <svg viewBox="0 0 16 16" width="18" height="18" aria-hidden="true"><circle cx="7" cy="7" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="M10.5 10.5 14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            <input ref={input} type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search integrations..." aria-label="Search integrations..." />
            <AnimatePresence initial={false}>
              {q && (
                <motion.button key="x" type="button" className="am2-clear" aria-label="Clear" onClick={() => { setQ(''); input.current?.focus(); }} initial={{ scale: 0.6, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0.6, rotate: 90, opacity: 0 }} transition={{ duration: 0.25, ease: EMPH }}>
                  <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
                </motion.button>
              )}
            </AnimatePresence>
          </label>
          <Tray flow={flow} />
        </div>
        <div className="am2-cat-main">
          <div className="am2-chips" role="group" aria-label="Category" data-swipe-own>
            {CATS.map((c) => (
              <button key={c} type="button" aria-pressed={cat === c} onClick={() => setCat(c)}>
                {cat === c && <motion.span layoutId="am2-chip" className="am2-chip-bg" transition={{ duration: 0.3, ease: EMPH }} />}
                <span>{c}</span><em className="l2-mono" aria-hidden="true">{count(c)}</em>
              </button>
            ))}
          </div>
          <AnimatePresence>
            {nothing && (
              <motion.div className="am2-none" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35, ease: EASE }}>
                <p><b>Not here?</b> Anything with an HTTP API can be a step today — a request node and a connection holding the credential.</p>
                <div className="am2-none-acts"><Cta to="#not-here" kind="link" id="find-not-here" target="_self" rel={undefined}>Request Integration</Cta></div>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="am2-groups">
            <AnimatePresence initial={false} mode="popLayout">
              {groups.map(([c, apps]) => (
                <motion.div key={c} layout="position" className="am2-group" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.15 } }} transition={{ duration: 0.3, ease: EMPH }}>
                  <div className="am2-group-h"><h3>{c}</h3><em className="l2-mono">{apps.length}</em></div>
                  <motion.ul className="am2-rail" layoutScroll data-swipe-own>
                    <AnimatePresence initial={false} mode="popLayout">
                      {apps.map(([e, t, , pop]) => {
                        const at = flow.indexOf(t);
                        return (
                          <motion.li key={t} layout="position" id={slug(t)} className="am2-card" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }} transition={{ duration: 0.3, ease: EMPH }}>
                            <button type="button" className={at >= 0 ? 'in' : ''} aria-pressed={at >= 0} onClick={() => drop(t)}>
                              <span className="am2-em" aria-hidden="true">{e}</span>
                              <span className="am2-card-t"><span className="am2-name-t">{t}</span>{pop ? <span className="am2-pop l2-mono">Popular</span> : null}</span>
                              <span className="am2-at l2-mono" aria-hidden="true">{at >= 0 ? at + 1 : <svg viewBox="0 0 16 16" width="12" height="12"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>}</span>
                            </button>
                          </motion.li>
                        );
                      })}
                    </AnimatePresence>
                  </motion.ul>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

function NotHere() {
  return (
    <section className="l2-sec l2-dark am2-not" id="not-here" data-room="dark" data-ask-hide>
      <div className="l2-wrap l2-grid">
        <div className="am2-not-l">
          <h2 className="l2-head am2-not-h">Not here?</h2>
          <p className="l2-lede">Anything with an HTTP API can be a step today — a request node and a connection holding the credential. If it deserves a proper connector, tell us and we will add one.</p>
          <div className="l2-acts"><Cta to="/contact" id="close" size="lg">Request Integration</Cta><Cta to="https://docs.hanzo.ai/docs/cli/auto" kind="link" id="close-build">Build Custom Integration</Cta></div>
        </div>
        <div className="am2-req" aria-hidden="true">
          <div className="am2-req-node"><span className="l2-mono">request node</span><b>HTTP</b></div>
          <i className="am2-req-wire" />
          <div className="am2-req-node key"><span className="l2-mono">connection</span><b>credential</b></div>
        </div>
      </div>
    </section>
  );
}

export default function Automations() {
  const [flow, setFlow] = useState(['Slack', 'OpenAI', 'Notion']);
  const [mine, setMine] = useState(false);
  const add = (t) => setFlow((f) => (f.length >= 3 ? [t] : [...f.filter((x) => x !== t), t]));
  const drop = (t) => { setMine(true); add(t); };
  return (
    <main id="main" className="l2-page am2" data-ask="off">
      <Hero flow={flow} add={add} mine={mine} drop={drop} />
      <Catalog flow={flow} drop={drop} />
      <NotHere />
    </main>
  );
}
