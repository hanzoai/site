'use client';
/* Automations (v2, Cloud 4 chat). Archetype C, Catalogue. Order: the hero (title, ask, and the dock and board building a
   flow) → the sideways gallery: the whole catalogue as one horizontal track that the page's vertical scroll drives,
   Popular first, then each category, ending on Hanzo's dark "Not here?" panel → the footer. There is no closing band,
   no pinned chapter scene and no scroll-scrubbed reveal.
   Persona: a builder checking whether the apps they use can be steps. Goal: find their app, then open Auto or ask for one.
   CTA: "All Integrations" (hero; data-cta primary); the last panel's ask is Hanzo's "Request Integration" (data-cta close).
   Metric: cta_click:automations.primary.
   V2: 8/10 h-gallery signature: vertical scroll drives the catalogue sideways through 11 panels (Popular, nine categories, "Not here?") and then releases; swipe or trackpad moves it too; chips are its index; frameless zig-zag board; the first tap stops the demo
   Signature: h-gallery, Sideways gallery. Under the hero the catalogue holds still and the page travels sideways: scrolling
   down moves a track of panels left (Popular, then one panel per category, then "Not here?"), and when the last panel
   is in, the page releases and scrolls on. A horizontal swipe (phone) or trackpad swipe moves the same track and the
   page follows; the chips are the index (the ink pill glides to the panel in view, a tap travels there). Tap any tile to
   drop it into the flow; the tray beside the track mirrors it.
   Beyond: type an app's name and the catalogue answers at once; if it is not there, Hanzo's own "Not here?" answer shows
   in place, with the request link beside it.
   Motion: the sideways gallery (signature, scroll and swipe) + the board building itself in the hero (time, pausable) +
   chip pill, search re-flow and the tray growing into a 3 / 3 run (state) + tile lift (pointer).
   Entrances (MOTION-MAP rule 7, in order, each once, CSS keyframes run once on first view; the final state is the markup's
   own, so JS off and reduced motion show it standing): 1 underline-sweep, the hero title (ink underlines sweep under
   "workflow" and "reach" in turn); 2 spring-snap, the dock and board (snap in from the right and overshoot); 3
   side-carousel, the gallery's track (its first panels slide in from the right one after another and snap); 4
   squash-land, the gallery's side (title, search, tray land with a squash and settle); 5 grow-from-point, the dark
   "Not here?" panel (opens as a circle from the point last clicked or under the cursor).
   Every word and link is Hanzo's. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent, useInView } from 'motion/react';
import { EASE } from '../../ui';
import { A, Cta } from '../../kit';
import { scrollToY } from '../../../lib/scroll';
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
const slug = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const BY_SLUG = Object.fromEntries(APPS.map((a) => [slug(a[1]), a]));
/* the gallery's panels: "All" opens on the popular apps, then one panel per category, then "Not here?" */
const STAGES = CATS.map((c, i) => (i === 0 ? APPS.filter((a) => a[3]) : APPS.filter((a) => a[2] === c)));
const LAST = STAGES.length; // index of the "Not here?" panel
const ROLE = ['a change in it starts a run', 'read from it', 'write to it'];
const EMPH = [0.16, 1, 0.3, 1];
const K = 0.8; // px of vertical scroll per px the track travels
/* the track rests on each panel for the first part of its share of the scroll, then glides to the next, so a panel is
   read whole (one in, one out) instead of two halves sliding past; HOLD is that resting share. */
const HOLD = 0.5;
const ease3 = (x) => x * x * (3 - 2 * x);
const uneas3 = (y) => 0.5 - Math.sin(Math.asin(1 - 2 * Math.min(1, Math.max(0, y))) / 3);
const held = (raw, step, travel) => { // page scroll (px of track) -> where the track sits
  const p = raw / step, i = Math.floor(p), f = p - i;
  return Math.min(travel, (i + (f < HOLD ? 0 : ease3((f - HOLD) / (1 - HOLD)))) * step);
};
const unheld = (left, step) => { // where the track sits -> page scroll (px of track), the middle of the glide
  const p = left / step, i = Math.floor(p), f = p - i;
  return (i + (f < 0.001 ? HOLD / 2 : HOLD + (1 - HOLD) * uneas3(f))) * step;
};
const self = { target: '_self', rel: undefined }; // kit A treats an in-page #hash as external; keep these in the tab

/* Entrances: a section waits in its start state only after mount and only while out of view; on first view it runs its
   own keyframes once (data-ent="go"). Sections already in view at mount go at once. */
const PT = { x: -1, y: -1 }; // the last point the visitor clicked or hovered (for grow-from-point)
function useEnter(before) {
  const ref = useRef(null);
  const [st, setSt] = useState(undefined);
  useEffect(() => {
    const el = ref.current;
    const go = () => { before?.(el); setSt('go'); };
    const r = el.getBoundingClientRect();
    const inView = r.top < innerHeight && r.bottom > 0 && r.left < innerWidth && r.right > 0;
    if (inView) { go(); return; }
    setSt('wait');
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { go(); io.disconnect(); } }, { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return [ref, st];
}
function usePoint() {
  useEffect(() => {
    const on = (e) => { PT.x = e.clientX; PT.y = e.clientY; };
    addEventListener('pointerdown', on, { passive: true });
    addEventListener('pointermove', on, { passive: true });
    return () => { removeEventListener('pointerdown', on); removeEventListener('pointermove', on); };
  }, []);
}

/* The board's three places, in px from its own box: a zig-zag (left high, middle low, right high) on desktop, and a
   left-right stagger standing up on the phone. The same numbers place the nodes (CSS) and draw the wires (SVG). */
function places(w, h, narrow) {
  if (narrow) { const nw = w * 0.8, nh = 84; return [[0, 0], [w * 0.2, 112], [0, 224]].map(([x, y]) => ({ x, y, w: nw, h: nh })); }
  const nw = w * 0.3, nh = 116;
  return [[0, 0], [w * 0.35, h - nh], [w * 0.7, 0]].map(([x, y]) => ({ x, y, w: nw, h: nh }));
}
function wire(p, i, narrow) {
  const a = p[i - 1], b = p[i];
  if (narrow) {
    if (i === 1) { const ax = a.x + a.w, ay = a.y + a.h / 2, bx = b.x + b.w * 0.88, by = b.y; return `M${ax} ${ay} C${bx} ${ay}, ${bx} ${ay + 10}, ${bx} ${by}`; }
    const ax = a.x, ay = a.y + a.h / 2, bx = b.x + b.w * 0.12, by = b.y; return `M${ax} ${ay} C${bx} ${ay}, ${bx} ${ay + 10}, ${bx} ${by}`;
  }
  if (i === 1) { const ax = a.x + a.w / 2, ay = a.y + a.h, bx = b.x, by = b.y + b.h / 2; return `M${ax} ${ay} C${ax} ${by}, ${ax} ${by}, ${bx} ${by}`; }
  const ax = a.x + a.w, ay = a.y + a.h / 2, bx = b.x + b.w / 2, by = b.y + b.h; return `M${ax} ${ay} C${bx} ${ay}, ${bx} ${ay}, ${bx} ${by}`;
}

/* The hero's object: the dock and the board. Apps fly in by themselves while the board is seen (first at 0.45 s, then
   every 1.6 s, by a timeout chain). The first tap hands the board to the visitor: the loop stops for good. */
function Canvas({ flow, add, mine, drop }) {
  const [ref, live, , paused, toggle] = useDemo(0.3);
  const board = useRef(null);
  const [box, setBox] = useState(null);
  const k = useRef(3);
  const [n, setN] = useState(0);
  const auto = live && !mine;
  useEffect(() => {
    const el = board.current;
    const ro = new ResizeObserver(() => setBox({ w: el.clientWidth, h: el.clientHeight, narrow: matchMedia('(max-width: 600px)').matches }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  useEffect(() => {
    if (!auto) return;
    let t = 0;
    const step = (ms) => { t = setTimeout(() => { add(DOCK[k.current % DOCK.length]); k.current += 5; setN((x) => x + 1); step(1600); }, ms); };
    step(450);
    return () => clearTimeout(t);
  }, [auto]); // eslint-disable-line react-hooks/exhaustive-deps
  const p = box && places(box.w, box.h, box.narrow);
  const from = box?.narrow ? { opacity: 0, y: 220, x: 0, scale: 0.6 } : { opacity: 0, x: -220, y: 60, scale: 0.6 };
  const run = flow.join('|');
  return (
    <div className={'am2-stage' + (live ? ' live' : '') + (mine ? ' mine' : '')} ref={ref}>
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
        <div className="am2-board" ref={board}>
          {p && (
            <svg className="am2-wires" viewBox={`0 0 ${box.w} ${box.h}`} width={box.w} height={box.h} aria-hidden="true">
              {[1, 2].map((i) => (flow[i]
                ? <motion.path key={flow[i - 1] + '>' + flow[i]} d={wire(p, i, box.narrow)} className="on" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, ease: EASE, delay: 0.2 }} />
                : <path key={'e' + i} d={wire(p, i, box.narrow)} className="off" />))}
            </svg>
          )}
          {p && [1, 2].map((i) => flow[i] && <i key={run + i} className={'am2-pkt' + (mine ? ' once' : '')} style={{ offsetPath: `path('${wire(p, i, box.narrow)}')`, animationDelay: (mine ? (i - 1) * 0.5 + 0.6 : 0.6) + 's' }} aria-hidden="true" />)}
          {[0, 1, 2].map((i) => !flow[i] && <span key={'slot' + i} className={'am2-slot p' + i} aria-hidden="true" />)}
          <ol className="am2-flow" aria-live="polite">
            <AnimatePresence initial={false} mode="popLayout">
              {flow.map((t, i) => (
                <motion.li key={t} layout className={'am2-step p' + i + (i === flow.length - 1 ? ' new' : '')} initial={from} animate={{ opacity: 1, x: 0, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }} transition={{ duration: 0.45, ease: EMPH }}>
                  <A to={'#' + slug(t)} className="am2-node" {...self} onClick={(e) => { e.preventDefault(); history.replaceState(null, '', '#' + slug(t)); dispatchEvent(new CustomEvent('am2-go', { detail: slug(t) })); }}>
                    <span className="am2-em" aria-hidden="true">{BY[t][0]}</span>
                    <b>{t}</b>
                    <em className="l2-mono">{ROLE[i]}</em>
                  </A>
                </motion.li>
              ))}
            </AnimatePresence>
          </ol>
        </div>
        <div className="am2-canvas-foot">
          <span className="am2-canvas-k l2-mono">Hanzo Auto</span>
          <span className="am2-clock" aria-hidden="true">{auto && n > 0 && <i key={n} />}{mine && <i key={'m' + run} className={'mine f' + flow.length} />}</span>
          <PauseBtn paused={paused} onClick={toggle} />
        </div>
      </div>
    </div>
  );
}

function Hero(props) {
  const [top, e1] = useEnter();
  const [obj, e2] = useEnter();
  return (
    <section className="am2-hero" aria-labelledby="am2-h1">
      <div className="l2-wrap">
        <div className="am2-top am2-ent e-sweep" ref={top} data-ent={e1}>
          <div className="am2-name">
            <h1 id="am2-h1" className="l2-display">
              {/* the sentence whole for readers (and the copy check); the lines below carry the underlines */}
              <span className="x-sr">The apps a workflow can reach</span>
              <span className="l2-ln" aria-hidden="true">The apps </span>
              <span className="l2-ln" aria-hidden="true">a <span className="am2-ul">workflow</span> </span>
              <span className="l2-ln" aria-hidden="true">can <span className="am2-ul u2">reach</span></span>
            </h1>
            <p className="l2-stage-kick l2-mono am2-kick">Hanzo Auto · Connectors</p>
          </div>
          <div className="am2-side">
            <p className="l2-lede">Every one of these is a step you can drop onto a Hanzo Auto canvas: read from it, write to it, or let a change in it start a run.</p>
            <div className="l2-acts"><Cta to="#all" id="primary" size="lg" thumb data-thumb="All Integrations" {...self}>All Integrations</Cta></div>
          </div>
        </div>
        <div className="am2-ent e-snap" ref={obj} data-ent={e2}><Canvas {...props} /></div>
      </div>
    </section>
  );
}

/* The tray: the board's flow, mirrored beside the gallery. When the visitor fills the third place it grows into a
   full-width run with a 64px "3 / 3" for 2.4 s, then settles back (shared layout). */
function Tray({ flow, big, close }) {
  const run = flow.join('|');
  return (
    <>
      <div className="am2-tray" aria-hidden="true">
        <span className="am2-tray-k l2-mono">Hanzo Auto <span>{flow.length} / 3</span></span>
        {!big && (
          <motion.ol layoutId="am2-run" transition={{ duration: 0.5, ease: EMPH }}>
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
          </motion.ol>
        )}
        {big && <ol className="am2-tray-hold">{[0, 1, 2].map((i) => <li key={i}>{i > 0 && <i className="am2-tray-wire" />}<span className="am2-tray-n empty" /></li>)}</ol>}
      </div>
      <AnimatePresence>
        {big && (
          <motion.div className="am2-big" aria-hidden="true" onClick={close} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.3 } }} transition={{ duration: 0.25 }}>
            <motion.b className="am2-big-n" initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6, ease: EMPH, delay: 0.15 }}>3 / 3</motion.b>
            <motion.ol layoutId="am2-run" transition={{ duration: 0.5, ease: EMPH }}>
              {flow.map((t, i) => (
                <li key={t}>
                  {i > 0 && <i className="am2-big-wire"><b /></i>}
                  <span className="am2-big-node"><span className="am2-em">{BY[t][0]}</span><span><b>{t}</b><em className="l2-mono">{ROLE[i]}</em></span></span>
                </li>
              ))}
            </motion.ol>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Tile({ a, flow, drop, id, lit }) {
  const [e, t, , pop] = a;
  const at = flow.indexOf(t);
  return (
    <button type="button" id={id} className={(at >= 0 ? 'in' : '') + (lit && id === lit ? ' lit' : '')} aria-pressed={at >= 0} onClick={() => drop(t)}>
      <span className="am2-em" aria-hidden="true">{e}</span>
      <span className="am2-card-t"><span className="am2-name-t">{t}</span>{pop ? <span className="am2-pop l2-mono">Popular</span> : null}</span>
      <span className="am2-at l2-mono" aria-hidden="true">{at >= 0 ? at + 1 : <svg viewBox="0 0 16 16" width="12" height="12"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>}</span>
    </button>
  );
}

/* Signature: h-gallery. The section is tall; its view holds still under the header while the page's vertical scroll
   moves the track sideways (scrollLeft = travelled × 1/K). The track is also a real horizontal scroller, so a swipe or a
   trackpad moves it, and the page follows to the matching height. Under 900px the side (title, count, search, tray)
   scrolls away first and only the chips and the track hold. Every tile stays in the HTML. */
function Gallery({ flow, mine, drop }) {
  const [idx, setIdx] = useState(0);
  const [q, setQ] = useState('');
  const [big, setBig] = useState(false);
  const [lit, setLit] = useState('');
  const [drawn, setDrawn] = useState(false);
  const input = useRef(null);
  const outer = useRef(null);
  const pin = useRef(null);
  const side = useRef(null);
  const track = useRef(null);
  const chips = useRef(null);
  const geo = useRef({ travel: 0, step: 1 });
  const seen = useInView(pin, { amount: 0.4 });
  usePoint();
  const [viewRef, e3] = useEnter();
  const [sideRef, e4] = useEnter();
  /* the last panel enters when the track reaches it (an IntersectionObserver cannot see it through its own start clip) */
  const notRef = useRef(null);
  const [e5, setE5] = useState(undefined);
  useEffect(() => { setE5((v) => v || 'wait'); }, []);
  useEffect(() => {
    if (!drawn || !notRef.current) return;
    const el = notRef.current, r = el.getBoundingClientRect(); // grow from the last point, in the panel's own box
    const x = PT.x < 0 ? r.width / 2 : PT.x - r.left, y = PT.y < 0 ? r.height / 2 : PT.y - r.top;
    el.style.setProperty('--gx', Math.round(x) + 'px');
    el.style.setProperty('--gy', Math.round(y) + 'px');
    setE5('go');
  }, [drawn]);
  const setSide = (el) => { side.current = el; sideRef.current = el; };
  const s = q.trim().toLowerCase();
  const hits = s ? APPS.filter((a) => a[1].toLowerCase().includes(s)) : [];
  const nothing = s && !hits.length;
  const shown = s ? hits.length : idx === 0 || idx === LAST ? 81 : STAGES[idx].length;
  const count = (c) => (c === 'All' ? APPS.length : APPS.filter((a) => a[2] === c).length);
  const stick = () => parseFloat(getComputedStyle(pin.current).top) || 0;
  const want = () => { // where the track should be for the page's scroll
    const { travel, step } = geo.current;
    return held(Math.max(0, (stick() - outer.current.getBoundingClientRect().top) / K), step, travel);
  };
  const mark = (left) => {
    const { travel, step } = geo.current;
    const i = left >= travel - 4 ? LAST : Math.min(LAST, Math.round(left / step));
    setIdx((x) => (x === i ? x : i));
    if (i === LAST) setDrawn(true);
  };
  const sync = () => {
    const t = track.current;
    if (!t || !geo.current.travel) return;
    const left = want();
    if (Math.abs(t.scrollLeft - left) > 1) t.scrollLeft = left;
    mark(left);
  };
  useEffect(() => {
    const fit = () => {
      const t = track.current, narrow = matchMedia('(max-width: 900px)').matches;
      pin.current.style.setProperty('--side-h', narrow ? side.current.offsetHeight + 'px' : '0px');
      const panels = t.children;
      geo.current = { travel: Math.max(0, t.scrollWidth - t.clientWidth), step: panels[1] ? panels[1].offsetLeft - panels[0].offsetLeft : 1 };
      const { travel, step } = geo.current; // every glide, then a last rest on the final panel
      outer.current.style.height = pin.current.offsetHeight + (travel ? (Math.ceil(travel / step - 0.001) + HOLD) * step : 0) * K + 'px';
      sync();
    };
    const ro = new ResizeObserver(fit);
    ro.observe(track.current); ro.observe(side.current);
    fit();
    return () => ro.disconnect();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, 'change', sync);
  const userAt = useRef(-1e9);
  const touched = () => { userAt.current = performance.now(); };
  const onSwipe = () => { // the visitor moved the track itself (swipe, trackpad, keys): bring the page to the matching height
    const t = track.current, top = outer.current.getBoundingClientRect().top;
    if (performance.now() - userAt.current > 900 || Math.abs(t.scrollLeft - want()) < 2) return;
    touched(); // momentum after the finger lifts still belongs to the visitor
    if (top > stick() + 2 || top + outer.current.offsetHeight < innerHeight - 2) { mark(t.scrollLeft); return; }
    scrollToY(top + window.scrollY - stick() + unheld(t.scrollLeft, geo.current.step) * K, { immediate: true });
    mark(t.scrollLeft);
  };
  const go = (i) => {
    setQ('');
    const { travel, step } = geo.current;
    const top = outer.current.getBoundingClientRect().top + window.scrollY;
    scrollToY(top - stick() + (Math.min(i, Math.ceil(travel / step - 0.001)) + HOLD / 2) * step * K, { duration: 1 });
  };
  useEffect(() => { // keep the current chip in view on the phone's swipe row
    const row = chips.current, b = row?.children[Math.min(idx, CATS.length - 1)];
    if (row && b && row.scrollWidth > row.clientWidth) row.scrollTo({ left: b.offsetLeft - 16, behavior: 'smooth' });
  }, [idx]);
  useEffect(() => { // a board node links to its entry: travel to that entry's panel and ring the entry
    const open = (id) => { const a = BY_SLUG[id]; if (!a) return; go(CATS.indexOf(a[2])); setLit(id); };
    const onGo = (e) => open(e.detail);
    const onHash = () => open(location.hash.slice(1));
    addEventListener('am2-go', onGo);
    addEventListener('hashchange', onHash);
    return () => { removeEventListener('am2-go', onGo); removeEventListener('hashchange', onHash); };
  }); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (!lit) return; const t = setTimeout(() => setLit(''), 2600); return () => clearTimeout(t); }, [lit]);
  useEffect(() => { // the scale moment: the visitor's third place fills while the gallery is seen
    if (!(mine && flow.length === 3 && seen)) return;
    setBig(true);
    const t = setTimeout(() => setBig(false), 2400);
    return () => clearTimeout(t);
  }, [flow.join('|'), mine]); // eslint-disable-line react-hooks/exhaustive-deps
  const line = (d) => ({ initial: { pathLength: 0 }, animate: drawn ? { pathLength: 1 } : { pathLength: 0 }, transition: { duration: 0.9, ease: EASE, delay: d } });
  const toLast = (e) => { e.preventDefault(); go(LAST); };
  return (
    <section className={'am2-gal' + (s ? ' find' : '')} id="all" aria-labelledby="am2-all" ref={outer}>
      <div className="am2-pin" ref={pin}>
        <div className="l2-wrap am2-cat-in">
          <div className="am2-cat-side am2-ent e-squash" ref={setSide} data-ent={e4}>
            <h2 className="l2-head" id="am2-all">All Integrations</h2>
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
            <Tray flow={flow} big={big} close={() => setBig(false)} />
          </div>
          <div className="am2-cat-main">
            <div className="am2-chips" role="group" aria-label="Category" data-swipe-own ref={chips}>
              {CATS.map((c, i) => (
                <button key={c} type="button" aria-pressed={!s && idx === i} onClick={() => go(i)}>
                  {!s && idx === i && <motion.span layoutId="am2-chip" className="am2-chip-bg" transition={{ duration: 0.3, ease: EMPH }} />}
                  <span>{c}</span><em className="l2-mono" aria-hidden="true">{count(c)}</em>
                </button>
              ))}
            </div>
            <div className="am2-view am2-ent e-carousel" ref={viewRef} data-ent={e3}>
              <div className="am2-trackx" ref={track} onScroll={onSwipe} onPointerDown={touched} onTouchStart={touched} onWheel={(e) => { if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) touched(); }} onKeyDown={touched} onFocus={touched} data-swipe-own>
                {STAGES.map((apps, i) => (
                  <div key={CATS[i]} className={'am2-panel' + (!s && i === idx ? ' on' : '')}>
                    <div className="am2-panel-h"><h3>{i === 0 ? 'Popular' : CATS[i]}</h3><span className="l2-mono">{String(i + 1).padStart(2, '0')} / {LAST + 1}</span></div>
                    <ul>
                      {apps.map((a, j) => <li key={a[1]} className="am2-card" style={{ '--k': j }}><Tile a={a} flow={flow} drop={drop} id={i > 0 ? slug(a[1]) : undefined} lit={lit} /></li>)}
                    </ul>
                  </div>
                ))}
                <div className={'am2-panel am2-not am2-ent e-grow' + (idx === LAST ? ' on' : '')} id="not-here" data-room="dark" ref={notRef} data-ent={e5}>
                  <div className="am2-not-l">
                    <h2 className="l2-head am2-not-h">Not here?</h2>
                    <p className="l2-lede">Anything with an HTTP API can be a step today — a request node and a connection holding the credential. If it deserves a proper connector, tell us and we will add one.</p>
                    <div className="l2-acts"><Cta to="/contact" id="close" size="lg">Request Integration</Cta><Cta to="https://docs.hanzo.ai/docs/cli/auto" kind="link" id="close-build">Build Custom Integration</Cta></div>
                  </div>
                  <div className="am2-req" aria-hidden="true">
                    <div className="am2-req-node">
                      <svg className="am2-req-line"><motion.rect width="100%" height="100%" rx="20" {...line(0)} /></svg>
                      <span className="l2-mono">request node</span><b>HTTP</b>
                    </div>
                    <svg className="am2-req-wire" viewBox="0 0 2 40" preserveAspectRatio="none"><motion.path d="M1 0V40" vectorEffect="non-scaling-stroke" {...line(0.45)} /></svg>
                    <div className="am2-req-node key">
                      <svg className="am2-req-line"><motion.rect width="100%" height="100%" rx="20" {...line(0.8)} /></svg>
                      <span className="l2-mono">connection</span><b>credential</b>
                    </div>
                  </div>
                </div>
              </div>
              <AnimatePresence mode="popLayout">
                {s && (
                  <motion.div key="find" className="am2-results" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, transition: { duration: 0.15 } }} transition={{ duration: 0.3, ease: EMPH }}>
                    <AnimatePresence>
                      {nothing && (
                        <motion.div className="am2-none" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35, ease: EASE }}>
                          <p><b>Not here?</b> Anything with an HTTP API can be a step today — a request node and a connection holding the credential.</p>
                          <div className="am2-none-acts"><Cta to="#not-here" kind="link" id="find-not-here" {...self} onClick={toLast}>Request Integration</Cta></div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <ul className="am2-hits">
                      <AnimatePresence initial={false} mode="popLayout">
                        {hits.map((a) => (
                          <motion.li key={a[1]} layout="position" className="am2-card" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }} transition={{ duration: 0.3, ease: EMPH }}>
                            <Tile a={a} flow={flow} drop={drop} />
                          </motion.li>
                        ))}
                      </AnimatePresence>
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="am2-rail-bar" aria-hidden="true">{STAGES.concat([0]).map((_, i) => <i key={i} className={i === idx ? 'on' : ''} />)}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Automations() {
  const [flow, setFlow] = useState(['Slack', 'OpenAI', 'Notion']);
  const [mine, setMine] = useState(false);
  const own = useRef(false);
  const add = (t) => { if (!own.current) setFlow((f) => (f.length >= 3 ? [t] : [...f.filter((x) => x !== t), t])); };
  /* The first tap hands the flow to the visitor for good: it starts fresh with their app. After that a tap adds the app
     (the oldest leaves once three are placed), and a tap on a placed app takes it out. */
  const drop = (t) => {
    const first = !own.current;
    own.current = true;
    setMine(true);
    setFlow((f) => (first ? [t] : f.includes(t) ? f.filter((x) => x !== t) : f.length >= 3 ? [...f.slice(1), t] : [...f, t]));
  };
  return (
    <main id="main" className="l2-page am2" data-ask="off">
      <Hero flow={flow} add={add} mine={mine} drop={drop} />
      <Gallery flow={flow} mine={mine} drop={drop} />
    </main>
  );
}
