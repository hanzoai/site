'use client';
/* Contact. Signature: a switchboard. Four lines (sales, the developer dispatch, support, press) sit on the left; a
   patch cable runs from the line you choose to its route, which slides in with the right people and actions. Idle, the
   board patches each line in turn. Below, the Ferry Building on a living contour map and the community, one jack each.
   Beyond: the local time in San Francisco beside Hanzo's address, and one tap to copy hello@hanzo.ai.
   Every word and link is Hanzo's. */
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { EASE, Copy } from '../ui';
import { A, Go, More } from '../kit';
import Sigil from '../Sigil';
import './Contact.css';

const LINES = [
  { k: 'Sales', n: '01' },
  { k: 'Developer Dispatch', n: '02' },
  { k: 'Support', n: '03' },
  { k: 'Press & General', n: '04' },
];

function Route({ i }) {
  if (i === 0) return (
    <>
      <p className="x-kick">01 / 04</p>
      <h2 className="xct-rh">Bring Hanzo to your company.</h2>
      <p className="xct-rp">Enterprise plans, your own infrastructure, dedicated compute and engineers on call around the clock.</p>
      <div className="xct-acts">
        <A to="/contact-sales" className="x-btn solid" data-thumb="Talk to sales">Talk to sales</A>
        <div className="xct-more"><More to="/enterprise">See Enterprise</More><More to="https://cal.com/hanzo/30min">Book a 30-minute call</More></div>
      </div>
    </>
  );
  if (i === 1) return (
    <>
      <p className="x-kick">02 / 04</p>
      <h3 className="xct-rh">Developer Dispatch</h3>
      <p className="xct-rp">Frontier AI model releases (Enso, Zen 6), tutorials, and engineering announcements.</p>
      <div className="xct-acts"><Go to="/newsletter" solid>Subscribe to newsletter</Go></div>
    </>
  );
  if (i === 2) return (
    <>
      <p className="x-kick">03 / 04</p>
      <h3 className="xct-rh">Support</h3>
      <p className="xct-rp">Help with your account, billing or the product: the Help Center, the docs and live status.</p>
      <div className="xct-acts"><Go to="/support" solid>Get support</Go></div>
    </>
  );
  return (
    <>
      <p className="x-kick">04 / 04</p>
      <h3 className="xct-rh">Press & General</h3>
      <p className="xct-rp">Stories, interviews, partnerships and general inquiries.</p>
      <div className="xct-acts xct-mail">
        <a className="x-btn solid" href="mailto:hello@hanzo.ai">hello@hanzo.ai</a>
        <Copy text="hello@hanzo.ai" label="Copy address" />
      </div>
    </>
  );
}

/* The board: choosing a line moves the cable's plug to it and swaps the route in; idle, it patches each line in turn. */
function Switchboard() {
  const [at, setAtState] = useState(0);
  const [mine, setMine] = useState(false);
  const calm = useReducedMotion();
  const box = useRef(null);
  const jacks = useRef([]);
  const seen = useInView(box, { amount: 0.35 });
  const [geo, setGeo] = useState(null);
  const [seat, setSeat] = useState(0); // every tap re-seats the plug, even on the line already patched
  const pick = (i) => { setAtState(i); setMine(true); setSeat((v) => v + 1); };

  useEffect(() => {
    if (mine || calm || !seen) return;
    const t = setTimeout(() => setAtState((v) => (v + 1) % LINES.length), 3600);
    return () => clearTimeout(t);
  }, [at, mine, calm, seen]);

  // the cable runs from the chosen line's jack to the middle of the route panel
  useLayoutEffect(() => {
    const measure = () => {
      const b = box.current;
      if (!b) return;
      const r = b.getBoundingClientRect();
      setGeo({ w: r.width, h: r.height, ys: jacks.current.map((j) => { const q = j.getBoundingClientRect(); return q.top - r.top + q.height / 2; }), xs: jacks.current.map((j) => { const q = j.getBoundingClientRect(); return q.left - r.left + q.width / 2; }) });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(box.current);
    return () => ro.disconnect();
  }, []);

  let d = '';
  if (geo) {
    const x0 = geo.xs[at], y0 = geo.ys[at], x1 = geo.w * 0.5 + 8, y1 = geo.h / 2;
    const mid = (x0 + x1) / 2;
    d = `M ${x0} ${y0} C ${mid} ${y0}, ${mid} ${y1}, ${x1} ${y1}`;
  }

  const key = (e, i) => {
    const n = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
    if (!n) return;
    e.preventDefault();
    const j = (i + n + LINES.length) % LINES.length;
    pick(j);
    e.currentTarget.parentElement.children[j]?.focus();
  };

  return (
    <div className="xct-board" ref={box}>
      <div className="xct-lines" role="tablist" aria-label="Why you are writing" aria-orientation="vertical">
        {LINES.map((l, i) => (
          <button key={l.k} type="button" role="tab" id={'xct-t' + i} aria-controls={'xct-p' + i} aria-selected={at === i} tabIndex={at === i ? 0 : -1}
            className={'xct-line' + (at === i ? ' on' : '')} onClick={() => pick(i)} onKeyDown={(e) => key(e, i)}>
            <span className="xct-n">{l.n}</span>
            <span className="xct-k">{l.k}</span>
            <span className="xct-jack" ref={(el) => { jacks.current[i] = el; }} aria-hidden="true"><i /></span>
          </button>
        ))}
        {!mine && <p className="xct-hint" aria-hidden="true">Choose a line</p>}
      </div>
      <svg className="xct-cable" width={geo ? geo.w : 0} height={geo ? geo.h : 0} aria-hidden="true">
        {d && <>
          <motion.path d={d} initial={false} animate={{ d }} transition={{ type: 'spring', stiffness: 140, damping: 20 }} className="xct-wire" />
          <motion.path d={d} initial={false} animate={{ d }} transition={{ type: 'spring', stiffness: 140, damping: 20 }} className="xct-pulse" />
        </>}
      </svg>
      <div className="xct-panel">
        <motion.span key={seat} className="xct-plug" aria-hidden="true" initial={{ scaleY: seat ? 1.7 : 1, x: seat ? -6 : 0 }} animate={{ scaleY: 1, x: 0 }} transition={{ type: 'spring', stiffness: 500, damping: 18 }} />
        {LINES.map((l, i) => (
          <motion.div key={l.k} id={'xct-p' + i} role="tabpanel" aria-labelledby={'xct-t' + i} className="xct-route"
            initial={false}
            animate={i === at ? { opacity: 1, x: 0, filter: 'blur(0px)' } : { opacity: 0, x: i < at ? -28 : 28, filter: 'blur(6px)' }}
            transition={{ duration: 0.55, ease: EASE }}
            aria-hidden={i !== at} inert={i !== at}>
            <Route i={i} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function Hero() {
  const line = (t, d) => (
    <span className="x-line"><motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: d }}>{t}</motion.span></span>
  );
  return (
    <section className="xct-hero" aria-labelledby="xct-h1">
      <div className="x-wrap">
        <h1 id="xct-h1" className="xct-h1">{line('How can we help?', 0.05)}</h1>
        <motion.p className="xct-lede" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.3 }}>
          Sales, support, press or anything else: reach the right people here.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.45 }}>
          <Switchboard />
        </motion.div>
      </div>
    </section>
  );
}

/* San Francisco's time, ticking beside the address: the date and dial are drawn in the browser only (no server clock). */
function Clock() {
  const t = useRef(null);
  const hand = useRef(null);
  const min = useRef(null);
  const seen = useInView(t, { margin: '200px' });
  useEffect(() => {
    if (!seen) return;
    const f = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Los_Angeles', hour: 'numeric', minute: '2-digit', second: '2-digit', timeZoneName: 'short' });
    const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Los_Angeles', hour: 'numeric', minute: 'numeric', second: 'numeric', hourCycle: 'h23' });
    const tick = () => {
      const now = new Date();
      if (t.current) t.current.textContent = f.format(now);
      const p = Object.fromEntries(parts.formatToParts(now).map((x) => [x.type, +x.value]));
      if (hand.current) hand.current.style.transform = `rotate(${(p.hour % 12) * 30 + p.minute * 0.5}deg)`;
      if (min.current) min.current.style.transform = `rotate(${p.minute * 6 + p.second * 0.1}deg)`;
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [seen]);
  return (
    <div className="xct-clock">
      <svg viewBox="0 0 40 40" width="40" height="40" aria-hidden="true">
        <circle cx="20" cy="20" r="18.5" fill="none" stroke="currentColor" strokeOpacity=".35" />
        <line ref={hand} x1="20" y1="20" x2="20" y2="10.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="xct-hand" />
        <line ref={min} x1="20" y1="20" x2="20" y2="6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" className="xct-hand" />
        <circle cx="20" cy="20" r="1.6" fill="currentColor" />
      </svg>
      <span><span className="xct-clock-k">Local time in San Francisco</span><span className="xct-clock-t x-mono" ref={t} aria-live="off">&nbsp;</span></span>
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

function Visit() {
  return (
    <section className="x-sec xct-dark" data-room="dark" aria-labelledby="xct-visit">
      <div className="x-wrap xct-vgrid">
        <div className="xct-place">
          <Sigil seed="1 Ferry Building, San Francisco" data={[1, 94105]} className="xct-map" />
          <div className="xct-place-in">
            <h3 id="xct-visit">Visit</h3>
            <p className="xct-addr">1 Ferry Building<br />San Francisco, CA 94105</p>
            <Clock />
          </div>
        </div>
        <div>
          <h3 className="xct-ch">Join the community</h3>
          <ul className="xct-nets">
            {NETS.map(([n, u], i) => (
              <li key={n}>
                <A to={u} className="xct-net" data-cursor="Open">
                  <span className="xct-net-n">{n}</span>
                  <span className="xct-net-u x-mono">{where(u)}</span>
                  <i aria-hidden="true">↗</i>
                </A>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default function Contact() {
  return (
    <main className="xct">
      <Hero />
      <Visit />
    </main>
  );
}
