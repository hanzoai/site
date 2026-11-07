'use client';
/* Automations (v2, Cloud 4 chat). Archetype C, Catalogue: a hero where the most reached-for apps drop onto a Hanzo Auto
   canvas → the full catalogue with chips that re-flow it and a search → "Not here?" as the one dark closing band.
   Persona: a builder checking whether the apps they use can be steps. Goal: find their app, then open Auto or ask for one.
   CTA: "All Integrations" (hero, ask bar; data-cta primary); the band's ask is Hanzo's "Request Integration" (data-cta
   close). Metric: cta_click:automations.primary.
   V2: 8/10 apps drop off a dock onto a live Hanzo Auto canvas and wire themselves into a flow; the catalogue filtered by chips and search with cards that re-flow; greys only, one ask per screen, a closing band
   Signature: apps dropping onto a canvas. The twelve most-reached-for apps sit in a dock beside a Hanzo Auto canvas; one by
   one they drop in and wire themselves into a flow (a change in one starts the run, the next is read, the last is
   written). Tap any app to drop it in yourself.
   Beyond: type an app's name and the catalogue answers at once; if it is not there, Hanzo's own "Not here?" answer shows
   in place, with the request link beside it.
   Motion: the dock dropping apps in (signature, time, pausable) + chip pill and card re-flow (state).
   Every word and link is Hanzo's. */
import { useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EASE } from '../../ui';
import { A, Cta } from '../../kit';
import { useDemo, PauseBtn, useTick } from '../../v2/x-hamilton/Demo';
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
const slug = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const ROLE = ['a change in it starts a run', 'read from it', 'write to it'];
const up = (d) => ({ initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.7, ease: EASE, delay: d } });

/* Signature: the dock and the canvas. Apps drop in by themselves while the canvas is seen; drag one (or tap it) to drop it
   in yourself, and the flow re-wires: the first starts the run, the next is read, the last is written. */
function Canvas() {
  const [ref, live, , paused, toggle] = useDemo(0.3);
  const [flow, setFlow] = useState(['Slack', 'OpenAI', 'Notion']);
  const [mine, setMine] = useState(false);
  const k = useRef(3);
  const canvas = useRef(null);
  const add = (t) => setFlow((f) => (f.length >= 3 ? [t] : [...f.filter((x) => x !== t), t]));
  useTick(1600, live && !mine, () => { add(DOCK[k.current % DOCK.length]); k.current += 5; });
  return (
    <div className="am2-stage" ref={ref}>
      <div className="am2-dock-wrap">
        <h2 className="am2-dock-h l2-mono">Most reached for</h2>
        <ul className="am2-dock">
          {DOCK.map((t) => (
            <li key={t}>
              <button type="button" className={flow.includes(t) ? 'in' : ''} aria-pressed={flow.includes(t)} onClick={() => { setMine(true); add(t); }}>
                <span className="am2-em" aria-hidden="true">{BY[t][0]}</span><span className="am2-dn">{t}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="am2-canvas" ref={canvas} aria-live="polite">
        <span className="am2-canvas-k l2-mono">Hanzo Auto</span>
        <PauseBtn paused={paused} onClick={toggle} />
        <ol className="am2-flow">
          <AnimatePresence initial={false} mode="popLayout">
            {flow.map((t, i) => (
              <motion.li key={t} layout initial={{ opacity: 0, y: 80, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
                {i > 0 && <motion.i className="am2-wire" initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 0.5, ease: EASE, delay: 0.2 }} aria-hidden="true" />}
                <A to={'#' + slug(t)} className="am2-node">
                  <span className="am2-em" aria-hidden="true">{BY[t][0]}</span>
                  <b>{t}</b>
                  <em className="l2-mono">{ROLE[i]}</em>
                </A>
              </motion.li>
            ))}
          </AnimatePresence>
          {flow.length < 3 && <li className="am2-slot" aria-hidden="true" />}
        </ol>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="am2-hero" aria-labelledby="am2-h1">
      <div className="l2-wrap">
        <div className="am2-top">
          <div className="am2-name">
            <h1 id="am2-h1" className="l2-display">
              {['The apps', 'a workflow', 'can reach'].map((t, i) => <span key={t} className="l2-ln"><motion.span initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 0.7, ease: EASE, delay: 0.06 + i * 0.06 }}>{t}{' '}</motion.span></span>)}
            </h1>
            <motion.p className="l2-stage-kick l2-mono am2-kick" {...up(0.3)}>Hanzo Auto · Connectors</motion.p>
          </div>
          <div className="am2-side">
            <motion.p className="l2-lede" {...up(0.4)}>Every one of these is a step you can drop onto a Hanzo Auto canvas: read from it, write to it, or let a change in it start a run.</motion.p>
            <motion.div className="l2-acts" {...up(0.5)}><Cta to="#all" id="primary" size="lg" thumb data-thumb="All Integrations">All Integrations</Cta></motion.div>
          </div>
        </div>
        <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}><Canvas /></motion.div>
      </div>
    </section>
  );
}

/* The catalogue: chips filter it and the cards re-flow into place; the search answers "is my app here?" (Beyond). */
function Catalog() {
  const [cat, setCat] = useState('All');
  const [q, setQ] = useState('');
  const s = q.trim().toLowerCase();
  const list = useMemo(() => APPS.filter((a) => (cat === 'All' || a[2] === cat) && (!s || a[1].toLowerCase().includes(s))), [cat, s]);
  const nothing = s && !list.length;
  const count = (c) => (c === 'All' ? APPS.length : APPS.filter((a) => a[2] === c).length);
  return (
    <section className="l2-sec am2-cat" id="all">
      <div className="l2-wrap">
        <div className="am2-cat-top">
          <div>
            <h2 className="l2-head">All Integrations</h2>
            <p className="am2-count l2-mono" aria-live="polite">{list.length === 81 ? '81 integrations' : `${list.length} of 81 integrations`}</p>
          </div>
          <label className="am2-find">
            <svg viewBox="0 0 16 16" width="18" height="18" aria-hidden="true"><circle cx="7" cy="7" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="M10.5 10.5 14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search integrations..." aria-label="Search integrations..." />
          </label>
        </div>
        <div className="am2-chips" role="group" aria-label="Category" data-swipe-own>
          {CATS.map((c) => (
            <button key={c} type="button" aria-pressed={cat === c} onClick={() => setCat(c)}>
              {cat === c && <motion.span layoutId="am2-chip" className="am2-chip-bg" transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} />}
              <span>{c}</span><em className="l2-mono" aria-hidden="true">{count(c)}</em>
            </button>
          ))}
        </div>
        <AnimatePresence>
          {nothing && (
            <motion.div className="am2-none" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35, ease: EASE }}>
              <p><b>Not here?</b> Anything with an HTTP API can be a step today — a request node and a connection holding the credential.</p>
              <div className="am2-none-acts"><Cta to="#not-here" kind="link" id="find-not-here">Request Integration</Cta></div>
            </motion.div>
          )}
        </AnimatePresence>
        <ul className="am2-grid">
          {APPS.map(([e, t, c, pop]) => {
            const on = (cat === 'All' || c === cat) && (!s || t.toLowerCase().includes(s));
            return (
              <motion.li key={t} layout={on ? 'position' : false} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} id={slug(t)} className="am2-card" hidden={!on}>
                <span className="am2-em" aria-hidden="true">{e}</span>
                <h3>{t}</h3>
                {pop ? <span className="am2-pop l2-mono">Popular</span> : null}
                <em className="am2-c l2-mono">{c}</em>
              </motion.li>
            );
          })}
        </ul>
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
  return (
    <main id="main" className="l2-page am2">
      <Hero />
      <Catalog />
      <NotHere />
    </main>
  );
}
