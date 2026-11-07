'use client';
/* Automations. Signature: apps dropping onto a canvas. The twelve most-reached-for apps sit in a dock under a Hanzo
   Auto canvas; one by one they drop onto it and wire themselves into a flow (a change in one starts the run, the next
   is read, the last is written). Tap or drag any app in the dock to drop it in yourself.
   Beyond: "Is my app here?". Type an app's name: the catalogue answers at once, and if it is not there it says what
   Hanzo says, that anything with an HTTP API can be a step today, with the request link beside it.
   The full catalogue filters by category with a live count. Every word and link is Hanzo's. */
import { useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EASE, Rise } from '../../ui';
import { A } from '../../kit';
import { useLive, useEvery } from '../cloud/Frame';
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
const up = (d) => ({ initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, ease: EASE, delay: d } });

function Canvas() {
  const [ref, live] = useLive(0.3);
  const [flow, setFlow] = useState(['Slack', 'OpenAI', 'Notion']);
  const [mine, setMine] = useState(false);
  const k = useRef(3);
  const canvas = useRef(null);
  const add = (t) => setFlow((f) => (f.length >= 3 ? [t] : [...f.filter((x) => x !== t), t]));
  useEvery(1500, live && !mine, () => { add(DOCK[k.current % DOCK.length]); k.current += 5; });
  const dropped = (t, info) => {
    const r = canvas.current.getBoundingClientRect();
    const x = info.point.x - scrollX, y = info.point.y - scrollY; // the point is in page coordinates
    if (x > r.left && x < r.right && y > r.top && y < r.bottom) { setMine(true); add(t); }
  };
  return (
    <div className="am-stage" ref={ref}>
      <div className="am-canvas" ref={canvas} aria-live="polite">
        <span className="am-canvas-k x-mono">Hanzo Auto canvas</span>
        <ol className="am-flow">
          <AnimatePresence initial={false} mode="popLayout">
            {flow.map((t, i) => (
              <motion.li key={t} layout initial={{ opacity: 0, y: 60, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }} transition={{ type: 'spring', stiffness: 320, damping: 24 }}>
                {i > 0 && <motion.i className="am-wire" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.5, ease: EASE, delay: 0.2 }} aria-hidden="true" />}
                <a href={'#' + slug(t)} className="am-node">
                  <span className="am-em" aria-hidden="true">{BY[t][0]}</span>
                  <b>{t}</b>
                  <em className="x-mono">{ROLE[i]}</em>
                </a>
              </motion.li>
            ))}
          </AnimatePresence>
          {flow.length < 3 && <li className="am-slot" aria-hidden="true">drop an app here</li>}
        </ol>
      </div>
      <div className="am-dock-wrap">
        <h2 className="am-dock-h">Most reached for</h2>
        <ul className="am-dock">
          {DOCK.map((t) => (
            <li key={t}>
              <motion.button type="button" className={flow.includes(t) ? 'in' : ''} drag dragSnapToOrigin dragElastic={0.6} whileDrag={{ scale: 1.12, zIndex: 20 }} onDragEnd={(e, info) => dropped(t, info)} onClick={() => { setMine(true); add(t); }} aria-label={'Drop ' + t + ' onto the canvas'} data-cursor="Drag">
                <span className="am-em" aria-hidden="true">{BY[t][0]}</span><span>{t}</span>
              </motion.button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="am-hero" aria-labelledby="am-h1">
      <div className="x-wrap am-hero-grid">
        <div className="am-copy">
          <motion.p className="am-kick x-mono" {...up(0)}>Hanzo Auto · Connectors</motion.p>
          <h1 id="am-h1" className="am-h1">
            {['The apps', 'a workflow', 'can reach'].map((t, i) => <span key={t} className="x-line"><motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.05 + i * 0.1 }}>{t}{' '}</motion.span></span>)}
          </h1>
          <motion.p className="am-lede" {...up(0.4)}>Every one of these is a step you can drop onto a Hanzo Auto canvas: read from it, write to it, or let a change in it start a run.</motion.p>
          <motion.div className="am-acts" {...up(0.5)}>
            <motion.span className="x-go" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}><a href="#all" className="x-btn solid" data-thumb>All Integrations</a></motion.span>
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.2 }}><Canvas /></motion.div>
      </div>
    </section>
  );
}

function Catalog() {
  const [cat, setCat] = useState('All');
  const [q, setQ] = useState('');
  const s = q.trim().toLowerCase();
  const list = useMemo(() => APPS.filter((a) => (cat === 'All' || a[2] === cat) && (!s || a[1].toLowerCase().includes(s))), [cat, s]);
  const nothing = s && !list.length;
  return (
    <section className="x-sec am-cat" id="all">
      <div className="x-wrap">
        <div className="am-cat-top">
          <div>
            <Rise as="h2" y={20}>All Integrations</Rise>
            <p className="am-count x-mono" aria-live="polite">{list.length === 81 ? '81 integrations' : `${list.length} of 81 integrations`}</p>
          </div>
          <label className="am-find">
            <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true"><circle cx="7" cy="7" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="M10.5 10.5 14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            <span className="x-sr">Is my app here?</span>
            <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Is my app here? Type its name" />
          </label>
        </div>
        <div className="am-chips" role="group" aria-label="Category">
          {CATS.map((c) => (
            <button key={c} type="button" aria-pressed={cat === c} onClick={() => setCat(c)}>
              {cat === c && <motion.span layoutId="am-chip" className="am-chip-bg" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
              <span>{c}</span>
            </button>
          ))}
        </div>
        <AnimatePresence>
          {nothing && (
            <motion.div className="am-none" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35, ease: EASE }}>
              <p><b>“{q}” is not in the catalogue yet.</b> Anything with an HTTP API can be a step today — a request node and a connection holding the credential.</p>
              <div className="am-none-acts"><A to="/contact" className="x-btn sm solid">Request Integration</A><A to="https://docs.hanzo.ai/docs/cli/auto" className="x-btn sm">Build Custom Integration</A></div>
            </motion.div>
          )}
        </AnimatePresence>
        <ul className="am-grid">
          {APPS.map(([e, t, c, pop]) => {
            const on = (cat === 'All' || c === cat) && (!s || t.toLowerCase().includes(s));
            return (
              <li key={t} id={slug(t)} className={'am-card' + (on ? '' : ' off')} hidden={!on}>
                <span className="am-em" aria-hidden="true">{e}</span>
                <h3>{t}</h3>
                {pop ? <span className="am-pop">Popular</span> : null}
                <em className="am-c x-mono">{c}</em>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

function NotHere() {
  return (
    <section className="x-sec am-not" data-room="dark">
      <div className="x-wrap am-not-grid">
        <div>
          <h2>Not here?</h2>
          <p>Anything with an HTTP API can be a step today — a request node and a connection holding the credential. If it deserves a proper connector, tell us and we will add one.</p>
          <div className="am-not-acts"><A to="/contact" className="x-btn solid">Request Integration</A><A to="https://docs.hanzo.ai/docs/cli/auto" className="x-btn">Build Custom Integration</A></div>
        </div>
        <Rise className="am-req" delay={0.1} aria-hidden="true">
          <div className="am-req-node"><span className="x-mono">request node</span><b>HTTP</b></div>
          <i className="am-req-wire" />
          <div className="am-req-node key"><span className="x-mono">connection</span><b>credential</b></div>
        </Rise>
      </div>
    </section>
  );
}

export default function Automations() {
  return (
    <main className="am">
      <Hero />
      <Catalog />
      <NotHere />
    </main>
  );
}
