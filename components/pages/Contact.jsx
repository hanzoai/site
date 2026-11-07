'use client';
/* /contact. V2: 8/10 Utility, calm and exact: a two-line kinetic question beside a patch panel whose cable hangs from
   the line you choose into its route; the address as huge type over a living contour map (the one dark room) with
   San Francisco's clock; the community as a big typographic index. Accent: blue.
   Signature: a patch panel. Four jacks sit across the top of the panel; a cable hangs from the jack you choose and
   swings on a spring into the route below, which slides in with the right people and actions. Idle, the panel
   patches each line in turn.
   Supporting (3): masked kinetic headline, once; the Ferry Building's contour map (Sigil); the ticking clock.
   Beyond: San Francisco's local time on a big dial beside Hanzo's address, how far that is from your own clock, and
   one tap to copy hello@hanzo.ai.
   Every word and link is Hanzo's. */
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { Copy } from '../ui';
import { A, More } from '../kit';
import Sigil from '../Sigil';
import MaskLines from '../v2/MaskLines';
import '../v2/vc-type.css';
import './Contact.css';

const EASE = [0.16, 1, 0.3, 1];
const LINES = [
  { k: 'Sales', n: '01' },
  { k: 'Developer Dispatch', n: '02' },
  { k: 'Support', n: '03' },
  { k: 'Press & General', n: '04' },
];

function Route({ i }) {
  if (i === 0) return (
    <>
      <p className="vc-kick vc-num">01 / 04</p>
      <h2 className="xct-rh">Bring Hanzo to your company.</h2>
      <p className="xct-rp">Enterprise plans, your own infrastructure, dedicated compute and engineers on call around the clock.</p>
      <div className="xct-acts">
        <A to="/contact-sales" className="x-btn solid xct-big" data-thumb="Talk to sales">Talk to sales</A>
        <div className="xct-more"><More to="/enterprise">See Enterprise</More><More to="https://cal.com/hanzo/30min">Book a 30-minute call</More></div>
      </div>
    </>
  );
  if (i === 1) return (
    <>
      <p className="vc-kick vc-num">02 / 04</p>
      <h3 className="xct-rh">Developer Dispatch</h3>
      <p className="xct-rp">Frontier AI model releases (Enso, Zen 6), tutorials, and engineering announcements.</p>
      <div className="xct-acts"><A to="/newsletter" className="x-btn solid xct-big">Subscribe to newsletter</A></div>
    </>
  );
  if (i === 2) return (
    <>
      <p className="vc-kick vc-num">03 / 04</p>
      <h3 className="xct-rh">Support</h3>
      <p className="xct-rp">Help with your account, billing or the product: the Help Center, the docs and live status.</p>
      <div className="xct-acts"><A to="/support" className="x-btn solid xct-big">Get support</A></div>
    </>
  );
  return (
    <>
      <p className="vc-kick vc-num">04 / 04</p>
      <h3 className="xct-rh">Press & General</h3>
      <p className="xct-rp">Stories, interviews, partnerships and general inquiries.</p>
      <div className="xct-acts">
        <a className="x-btn solid xct-big" href="mailto:hello@hanzo.ai">hello@hanzo.ai</a>
        <Copy text="hello@hanzo.ai" label="Copy address" />
      </div>
    </>
  );
}

/* The patch panel: choosing a jack swings the cable to it and slides its route in; idle, it patches each line in turn. */
function Panel() {
  const [at, setAt] = useState(0);
  const [mine, setMine] = useState(false);
  const calm = useReducedMotion();
  const box = useRef(null);
  const plug = useRef(null);
  const jacks = useRef([]);
  const seen = useInView(box, { amount: 0.35 });
  const [geo, setGeo] = useState(null);
  const pick = (i) => { setAt(i); setMine(true); };

  useEffect(() => {
    if (mine || calm || !seen) return;
    const t = setTimeout(() => setAt((v) => (v + 1) % LINES.length), 3800);
    return () => clearTimeout(t);
  }, [at, mine, calm, seen]);

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
      <div className="xct-jacks" role="tablist" aria-label="Why you are writing">
        {LINES.map((l, i) => (
          <button key={l.k} type="button" role="tab" id={'xct-t' + i} aria-controls={'xct-p' + i} aria-selected={at === i} tabIndex={at === i ? 0 : -1}
            className={'xct-jack' + (at === i ? ' on' : '')} onClick={() => pick(i)} onKeyDown={(e) => key(e, i)} ref={(el) => { jacks.current[i] = el; }}>
            <span className="xct-hole" aria-hidden="true"><i /></span>
            <span className="xct-n vc-num">{l.n}</span>
            <span className="xct-k">{l.k}</span>
          </button>
        ))}
      </div>
      <svg className="xct-cable" width={geo ? geo.w : 0} height={geo ? geo.h : 0} aria-hidden="true">
        {d && <>
          <motion.path d={d} initial={false} animate={{ d }} transition={{ type: 'spring', stiffness: 120, damping: 14, mass: 0.9 }} className="xct-wire" />
          <motion.path d={d} initial={false} animate={{ d }} transition={{ type: 'spring', stiffness: 120, damping: 14, mass: 0.9 }} className="xct-pulse" />
        </>}
      </svg>
      <div className="xct-panel">
        <span className="xct-plug" ref={plug} aria-hidden="true" />
        {LINES.map((l, i) => (
          <motion.div key={l.k} id={'xct-p' + i} role="tabpanel" aria-labelledby={'xct-t' + i} className="xct-route"
            initial={false}
            animate={i === at ? { opacity: 1, y: 0 } : { opacity: 0, y: i < at ? -22 : 22 }}
            transition={{ duration: i === at ? 0.6 : 0.3, ease: EASE, delay: i === at ? 0.18 : 0 }}
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
  const t = useRef(null);
  const gap = useRef(null);
  const hr = useRef(null);
  const mn = useRef(null);
  const sc = useRef(null);
  const seen = useInView(t, { margin: '200px' });
  useEffect(() => {
    if (!seen) return;
    const f = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Los_Angeles', hour: 'numeric', minute: '2-digit', second: '2-digit', timeZoneName: 'short' });
    const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Los_Angeles', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hourCycle: 'h23' });
    const tick = () => {
      const now = new Date();
      if (t.current) t.current.textContent = f.format(now);
      const p = Object.fromEntries(parts.formatToParts(now).map((x) => [x.type, +x.value]));
      if (hr.current) hr.current.style.transform = `rotate(${(p.hour % 12) * 30 + p.minute * 0.5}deg)`;
      if (mn.current) mn.current.style.transform = `rotate(${p.minute * 6 + p.second * 0.1}deg)`;
      if (sc.current) sc.current.style.transform = `rotate(${p.second * 6}deg)`;
      if (gap.current) {
        // the visitor's own clock against San Francisco's, in whole hours (or half hours where the zone has them)
        const sf = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute);
        const here = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes());
        const h = Math.round((here - sf) / 1800000) / 2;
        gap.current.textContent = h === 0 ? 'Same time as you' : `${Math.abs(h)} hour${Math.abs(h) === 1 ? '' : 's'} ${h > 0 ? 'behind' : 'ahead of'} you`;
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [seen]);
  return (
    <div className="xct-clock">
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
      <p className="xct-clock-k vc-kick">Local time in San Francisco</p>
      <p className="xct-clock-t vc-num" ref={t} aria-live="off">&nbsp;</p>
      <p className="xct-clock-g" ref={gap} aria-live="off">&nbsp;</p>
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

export default function Contact() {
  return (
    <main className="vc xct" style={{ '--acc': '#0a84ff' }}>
      <section className="xct-hero vc-scene" aria-labelledby="xct-h1">
        <div className="vc-grid xct-hero-g">
          <div className="xct-hero-c">
            <motion.p className="vc-kick acc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, ease: EASE }}>Contact</motion.p>
            <MaskLines as="h1" id="xct-h1" now delay={0.05} lines={['How can', 'we help?']} className="vc-display" />
            <motion.p className="vc-lede" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, ease: EASE, delay: 0.55 }}>
              Sales, support, press or anything else: reach the right people here.
            </motion.p>
          </div>
          <motion.div className="xct-hero-o" initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.3, ease: EASE, delay: 0.25 }}>
            <Panel />
          </motion.div>
        </div>
      </section>

      <section className="xct-visit" data-room="dark" aria-labelledby="xct-visit-h">
        <Sigil seed="1 Ferry Building, San Francisco" data={[1, 94105]} className="xct-map" />
        <div className="vc-grid xct-visit-g">
          <div className="xct-visit-c">
            <h2 id="xct-visit-h" className="vc-kick acc">Visit</h2>
            <p className="vc-display m xct-addr">1 Ferry Building</p>
            <p className="vc-lede xct-city">San Francisco, CA 94105</p>
          </div>
          <Clock />
        </div>
      </section>

      <section className="vc-sec xct-com" aria-labelledby="xct-com-h">
        <div className="vc-grid">
          <header className="xct-com-h">
            <MaskLines id="xct-com-h" lines={['Join the community']} className="vc-headline" />
          </header>
          <ul className="xct-nets">
            {NETS.map(([n, u]) => (
              <li key={n}>
                <A to={u} className="xct-net" data-cursor="Open">
                  <span className="xct-net-n">{n}</span>
                  <span className="xct-net-u">{breakable(where(u))}</span>
                  <svg viewBox="0 0 16 16" width="18" height="18" aria-hidden="true"><path d="M5 11 11 5M6 5h5v5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </A>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
