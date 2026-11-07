'use client';
/* /contact. V2: 8/10 Utility, calm and exact, in ink and greys only: a two-line kinetic question beside a patch panel
   whose cable swings into the route you choose; "Visit" as the one dark room over Hanzo's address and a live
   San Francisco clock; the community as a big index beside a contour plate that redraws for the network you point at.
   Persona: anyone with a question for Hanzo: a buyer, a developer, a customer who needs help, the press.
   Goal: reach the right people in one choice.
   CTA: "Talk to sales" (/contact-sales), data-cta contact.hero; metric: the one contact click (contact_sales_submit downstream).
   Signature: a patch panel. Four jacks sit across the top; a cable hangs from the jack you choose and swings on a
   spring into the route below, which slides in with the right people and actions. On arrival it patches each line
   once, then rests on Sales.
   Supporting (3): masked kinetic headline, once; the live clock; the community plate redrawing on hover.
   Beyond: San Francisco's local time on a live dial beside Hanzo's Ferry Building address, and one tap to copy
   hello@hanzo.ai.
   Deletes: the blue accent; the "Contact" eyebrow over the h1 and the "Visit" eyebrow over the address; the "01 / 04"
   counters over each route; the invented clock captions; the endless re-patching loop and the running wire pulse;
   the text-only community section; the opacity-0 arrivals that hid the lede with JS off.
   Every word and link is Hanzo's. */
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { A, More } from '../kit';
import Sigil from '../Sigil';
import MaskLines from './company/MaskLines';
import '../v2/vc-type.css';
import './Contact.css';

const EASE = [0.16, 1, 0.3, 1];
const LINES = [
  { k: 'Sales', n: '01' },
  { k: 'Developer Dispatch', n: '02' },
  { k: 'Support', n: '03' },
  { k: 'Press & General', n: '04' },
];

/* Copy hello@hanzo.ai: an icon that turns into a drawn tick; its name is for screen readers only (no new visible words). */
function CopyMail({ text }) {
  const [ok, setOk] = useState(false);
  const t = useRef(0);
  return (
    <button type="button" className="xct-cp" aria-label={ok ? 'Copied' : 'Copy ' + text}
      onClick={async () => {
        let done = true;
        try { await navigator.clipboard.writeText(text); } catch { done = false; }
        if (!done) return;
        setOk(true); clearTimeout(t.current); t.current = setTimeout(() => setOk(false), 1600);
      }}>
      {ok
        ? <svg viewBox="0 0 16 16" width="18" height="18" aria-hidden="true"><motion.path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.35, ease: EASE }} /></svg>
        : <svg viewBox="0 0 16 16" width="18" height="18" aria-hidden="true"><rect x="5" y="5" width="8.5" height="8.5" rx="2" fill="none" stroke="currentColor" strokeWidth="1.4" /><path d="M10.5 3.2V3a.8.8 0 0 0-.8-.8H3a.8.8 0 0 0-.8.8v6.7c0 .44.36.8.8.8h.2" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>}
      <span className="x-sr" role="status">{ok ? 'Copied' : ''}</span>
    </button>
  );
}

function Route({ i }) {
  if (i === 0) return (
    <>
      <h2 className="xct-rh">Bring Hanzo to your company.</h2>
      <p className="xct-rp">Enterprise plans, your own infrastructure, dedicated compute and engineers on call around the clock.</p>
      <div className="xct-acts">
        <A to="/contact-sales" className="x-btn solid xct-big" data-thumb="Talk to sales" data-cta="contact.hero">Talk to sales</A>
        <div className="xct-more"><More to="/enterprise">See Enterprise</More><More to="https://cal.com/hanzo/30min">Book a 30-minute call</More></div>
      </div>
    </>
  );
  if (i === 1) return (
    <>
      <h2 className="xct-rh">Developer Dispatch</h2>
      <p className="xct-rp">Frontier AI model releases (Enso, Zen 6), tutorials, and engineering announcements.</p>
      <div className="xct-acts"><A to="/newsletter" className="x-btn solid xct-big" data-cta="contact.dispatch">Subscribe to newsletter</A></div>
    </>
  );
  if (i === 2) return (
    <>
      <h2 className="xct-rh">Support</h2>
      <p className="xct-rp">Help with your account, billing or the product: the Help Center, the docs and live status.</p>
      <div className="xct-acts"><A to="/support" className="x-btn solid xct-big" data-cta="contact.support">Get support</A></div>
    </>
  );
  return (
    <>
      <h2 className="xct-rh">Press & General</h2>
      <p className="xct-rp">Stories, interviews, partnerships and general inquiries.</p>
      <div className="xct-acts">
        <a className="x-btn solid xct-big" href="mailto:hello@hanzo.ai" data-cta="contact.press">hello@hanzo.ai</a>
        <CopyMail text="hello@hanzo.ai" />
      </div>
    </>
  );
}

/* The patch panel: choosing a jack swings the cable to it and slides its route in. On arrival it patches each line
   once, then rests on Sales; after that it moves only when you choose. */
function Panel() {
  const [at, setAt] = useState(0);
  const [mine, setMine] = useState(false);
  const [lap, setLap] = useState(0);
  const calm = useReducedMotion();
  const box = useRef(null);
  const plug = useRef(null);
  const jacks = useRef([]);
  const seen = useInView(box, { amount: 0.35 });
  const [geo, setGeo] = useState(null);
  const pick = (i) => { setAt(i); setMine(true); };

  useEffect(() => {
    if (mine || calm || !seen || lap >= LINES.length) return;
    const t = setTimeout(() => { setAt((v) => (v + 1) % LINES.length); setLap((n) => n + 1); }, lap === 0 ? 2200 : 2600);
    return () => clearTimeout(t);
  }, [lap, mine, calm, seen]);

  // phones: the jacks are a swipe row, so the chosen one slides into view (the row scrolls, never the page)
  useEffect(() => {
    const j = jacks.current[at];
    const row = j?.parentElement;
    if (!row || row.scrollWidth <= row.clientWidth) return;
    row.scrollTo({ left: Math.max(0, j.offsetLeft - 14), behavior: calm ? 'auto' : 'smooth' });
  }, [at, calm]);

  // the cable hangs from the chosen jack to the plug seated on top of the route
  useLayoutEffect(() => {
    const measure = () => {
      const b = box.current;
      if (!b || !plug.current) return;
      const r = b.getBoundingClientRect();
      const p = plug.current.getBoundingClientRect();
      setGeo({
        w: r.width, h: r.height, px: p.left - r.left + p.width / 2, py: p.top - r.top + 2,
        js: jacks.current.map((j) => { const q = j.getBoundingClientRect(); return [q.left - r.left + q.width / 2, q.bottom - r.top - 2]; }),
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(box.current);
    return () => ro.disconnect();
  }, []);

  let d = '';
  if (geo) {
    const [x0, y0] = geo.js[at];
    const { px: x1, py: y1 } = geo;
    const sag = (y1 - y0) * 0.9;
    d = `M ${x0} ${y0} C ${x0} ${y0 + sag}, ${x1} ${y1 - sag * 0.7}, ${x1} ${y1}`;
  }

  const key = (e, i) => {
    const n = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!n) return;
    e.preventDefault();
    const j = (i + n + LINES.length) % LINES.length;
    pick(j);
    e.currentTarget.parentElement.children[j]?.focus();
  };

  return (
    <div className="xct-obj vc-obj" ref={box}>
      <div className="xct-jacks" role="tablist" aria-label="Contact">
        {LINES.map((l, i) => (
          <button key={l.k} type="button" role="tab" id={'xct-t' + i} aria-controls={'xct-p' + i} aria-selected={at === i} tabIndex={at === i ? 0 : -1}
            className={'xct-jack' + (at === i ? ' on' : '')} onClick={() => pick(i)} onKeyDown={(e) => key(e, i)} ref={(el) => { jacks.current[i] = el; }}>
            <span className="xct-hole" aria-hidden="true"><i /></span>
            <span className="xct-n vc-num" aria-hidden="true">{l.n}</span>
            <span className="xct-k">{l.k}</span>
          </button>
        ))}
      </div>
      <svg className="xct-cable" width={geo ? geo.w : 0} height={geo ? geo.h : 0} aria-hidden="true">
        {d && <motion.path d={d} initial={false} animate={{ d }} transition={{ type: 'spring', stiffness: 120, damping: 14, mass: 0.9 }} className="xct-wire" />}
      </svg>
      <div className="xct-panel">
        <span className="xct-plug" ref={plug} aria-hidden="true" />
        {LINES.map((l, i) => (
          <motion.div key={l.k} id={'xct-p' + i} role="tabpanel" aria-labelledby={'xct-t' + i} className="xct-route"
            initial={false}
            animate={i === at ? { opacity: 1, y: 0 } : { opacity: 0, y: i < at ? -22 : 22 }}
            transition={{ duration: i === at ? 0.52 : 0.22, ease: EASE, delay: i === at ? 0.16 : 0 }}
            aria-hidden={i !== at} inert={i !== at}>
            <Route i={i} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* San Francisco's time on a dial, beside the address; drawn in the browser only (no server clock). */
function Clock() {
  const box = useRef(null);
  const t = useRef(null);
  const hr = useRef(null);
  const mn = useRef(null);
  const sc = useRef(null);
  const seen = useInView(box, { margin: '200px' });
  const calm = useReducedMotion();
  useEffect(() => {
    if (!seen) return;
    const f = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Los_Angeles', hour: 'numeric', minute: '2-digit', timeZoneName: 'short' });
    const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Los_Angeles', hour: 'numeric', minute: 'numeric', second: 'numeric', hourCycle: 'h23' });
    const tick = () => {
      const now = new Date();
      if (t.current) t.current.textContent = f.format(now);
      const p = Object.fromEntries(parts.formatToParts(now).map((x) => [x.type, +x.value]));
      if (hr.current) hr.current.style.transform = `rotate(${(p.hour % 12) * 30 + p.minute * 0.5}deg)`;
      if (mn.current) mn.current.style.transform = `rotate(${p.minute * 6 + p.second * 0.1}deg)`;
      if (sc.current) sc.current.style.transform = `rotate(${p.second * 6}deg)`;
    };
    tick();
    // reduced motion: the hands are set once a minute, so nothing sweeps
    const id = setInterval(tick, calm ? 60000 : 1000);
    return () => clearInterval(id);
  }, [seen, calm]);
  return (
    <div className="xct-clock" ref={box} role="img" aria-label="San Francisco">
      <svg viewBox="0 0 200 200" className="xct-dial" aria-hidden="true">
        <circle cx="100" cy="100" r="98" className="xct-face" />
        {Array.from({ length: 60 }, (_, i) => (
          <line key={i} x1="100" y1={i % 5 ? 8 : 6} x2="100" y2={i % 5 ? 12 : 20} transform={`rotate(${i * 6} 100 100)`} className={i % 5 ? 'xct-tk' : 'xct-tk big'} />
        ))}
        <line ref={hr} x1="100" y1="100" x2="100" y2="52" className="xct-h hr" />
        <line ref={mn} x1="100" y1="100" x2="100" y2="24" className="xct-h mn" />
        <line ref={sc} x1="100" y1="114" x2="100" y2="18" className="xct-h sc" />
        <circle cx="100" cy="100" r="4" className="xct-pin" />
      </svg>
      <p className="xct-clock-t vc-num" ref={t} aria-hidden="true">&nbsp;</p>
    </div>
  );
}

const NETS = [
  ['Discord', 'https://discord.gg/XthHQQj'],
  ['GitHub', 'https://github.com/hanzoai'],
  ['X', 'https://x.com/hanzoai'],
  ['LinkedIn', 'https://linkedin.com/company/hanzo-ai'],
  ['Facebook', 'https://facebook.com/hanzoinc'],
  ['Bluesky', 'https://bsky.app/profile/hanzoai.bsky.social'],
  ['Reddit', 'https://www.reddit.com/r/HanzoAI/'],
  ['TikTok', 'https://www.tiktok.com/@hanzoinc'],
  ['Instagram', 'https://www.instagram.com/hanzoinc'],
];
const where = (u) => u.replace(/^https:\/\/(www\.)?/, '').replace(/\/$/, '');
// let a long address break after its slashes and dots, never mid-word
const breakable = (t) => t.split(/(?<=[/.])/).flatMap((p, i) => (i ? [<wbr key={i} />, p] : [p]));

/* The community: a big index of Hanzo's channels beside a contour plate. Point at (or focus) a channel and the plate
   redraws from that channel's own address, its name settling in below. */
function Community() {
  const [on, setOn] = useState(0);
  const [n, u] = NETS[on];
  return (
    <section className="vc-sec xct-com" aria-labelledby="xct-com-h">
      <div className="vc-grid">
        <div className="xct-com-l">
          <MaskLines id="xct-com-h" lines={['Join the community']} className="vc-headline" />
          <div className="xct-plate vc-obj" aria-hidden="true">
            <Sigil seed={u} data={[n.length, u.length]} className="xct-plate-s" />
            <motion.span key={n} className="xct-plate-n" initial={{ y: '100%' }} animate={{ y: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>{n}</motion.span>
          </div>
        </div>
        <ul className="xct-nets">
          {NETS.map(([name, url], i) => (
            <li key={name}>
              <A to={url} className={'xct-net' + (on === i ? ' on' : '')} data-cursor="Open" onPointerEnter={() => setOn(i)} onFocus={() => setOn(i)}>
                <span className="xct-net-n">{name}</span>
                <span className="xct-net-u">{breakable(where(url))}</span>
                <svg viewBox="0 0 16 16" width="18" height="18" aria-hidden="true"><path d="M5 11 11 5M6 5h5v5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </A>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default function Contact() {
  return (
    <main className="vc xct" style={{ '--acc': '#1d1d1f' }} data-ask-name="Contact">
      <section className="xct-hero vc-scene" aria-labelledby="xct-h1">
        <div className="vc-grid xct-hero-g">
          <div className="xct-hero-c">
            <MaskLines as="h1" id="xct-h1" now delay={0.05} lines={['How can', 'we help?']} className="vc-display" />
            <p className="vc-lede xct-in">Sales, support, press or anything else: reach the right people here.</p>
          </div>
          <div className="xct-hero-o xct-in2">
            <Panel />
          </div>
        </div>
      </section>

      <section className="xct-visit" data-room="dark" aria-labelledby="xct-visit-h">
        <Sigil seed="1 Ferry Building, San Francisco" data={[1, 94105]} className="xct-map" still />
        <div className="vc-grid xct-visit-g">
          <div className="xct-visit-c">
            <MaskLines id="xct-visit-h" lines={['Visit']} className="vc-display" />
            <p className="vc-headline xct-addr">1 Ferry Building</p>
            <p className="vc-lede xct-city">San Francisco, CA 94105</p>
          </div>
          <Clock />
        </div>
      </section>

      <Community />
    </main>
  );
}
