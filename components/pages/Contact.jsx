'use client';
/* /contact. V2: 8/10 Utility, calm and exact, on Hanzo's deck: a two-line question beside a patch panel whose cable,
   once the headline has landed, sweeps the four sockets and plugs back into Sales (the one ask never moves), then
   hangs and sways a little, leaning toward any jack you point at; "Visit" as the dark middle room beside a big live
   San Francisco clock; the community as an index beside a contour plate that follows the row; a closing Band.
   Persona: anyone with a question for Hanzo: a buyer, a developer, a customer who needs help, the press.
   Goal: reach the right people in one choice.
   CTA: "Talk to sales" (/contact-sales), data-cta contact.hero; metric: the one contact click (contact_sales_submit downstream).
   Signature: a patch panel. Four jacks sit across the top; a cable hangs from the jack you choose into the route
   below, its plug lifting out of one socket and seating in the next (400ms, ease-emphasis, no spring). On arrival the
   cable alone sweeps the four sockets once and lands back on Sales; the Sales route and its button stay put until
   you choose. Phones keep the cable: a short wire from the chosen pill down into its route.
   Supporting (3): masked kinetic headline, once, after the curtain has cleared the top; the live clock; the
   community plate following the row you reach.
   Beyond: San Francisco's local time on a live dial beside Hanzo's Ferry Building address, and one tap to copy
   hello@hanzo.ai.
   Deletes: the blue accent; the eyebrows over the h1 and the address; the route counters and 01–04 jack numerals;
   the mono URL lines; the invented clock captions; the auto-switching routes and the running wire pulse; the Visit
   room's contour map; raw .x-btn heroes (now Go); springs (deck ease curves only); the page CSS that broke the
   Band's hover; the opacity-0 and inert server states that hid three routes with JS off.
   Every word and link is Hanzo's. */
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, animate, useInView, useMotionValue, useReducedMotion } from 'motion/react';
import { A, Go, Band } from '../kit';
import { copyText } from '../ui';
import Sigil from '../Sigil';
import MaskLines from './company/MaskLines';
import useArrived from './company/useArrived';
import '../v2/vc-type.css';
import './company/deck.css';
import './Contact.css';

const EM = [0.16, 1, 0.3, 1]; // deck ease-emphasis (arrivals)
const IO = [0.4, 0, 0.2, 1]; // deck ease-in-out (things that move and stay)
const SWING = { duration: 0.4, ease: EM }; // the plug lifts and seats: ease-emphasis, no spring, no overshoot
const LINES = [
  { k: 'Sales', go: 'Talk to sales' },
  { k: 'Developer Dispatch', go: 'Subscribe to newsletter' },
  { k: 'Support', go: 'Get support' },
  { k: 'Press & General', go: 'hello@hanzo.ai' },
];
// JS off: every route stacked and readable; no cable, no hands on the dial, no plate, no dead copy button (PLAN 2.3)
const NOJS = { __html: '<style>.xct-hero-g{align-items:start!important}.xct-jacks{display:none!important}.xct-panel{display:flex!important;flex-direction:column;gap:40px;margin-top:24px!important}.xct-route{opacity:1!important;transform:none!important}.xct-cable,.xct-plug,.xct-plate,.xct-cp{display:none!important}.xct-in,.xct-in2{animation:none!important}.xct .x-band .x-word,.xct .x-band [style]{opacity:1!important;transform:none!important;filter:none!important}</style>' };

/* `go` turns true when the page may start its entrance: at once on a return visit; on a first visit, 550ms after
   the arrival curtain starts lifting (it wipes up from the bottom, so the top of the screen is clear by then). */
function useGo() {
  const [curtain] = useState(() => typeof document !== 'undefined' && document.documentElement.classList.contains('x-arriving'));
  const ok = useArrived();
  const [go, setGo] = useState(false);
  useEffect(() => {
    if (!ok) return;
    const t = setTimeout(() => setGo(true), curtain ? 550 : 0);
    return () => clearTimeout(t);
  }, [ok, curtain]);
  return go;
}

/* Copy hello@hanzo.ai: the icon turns into a drawn tick and a visible "Copied" slides out beside it (role=status), only
   when the copy really happened (clipboard API, then the select-and-copy fallback phones need; the kit's chime). */
function CopyMail({ text }) {
  const [ok, setOk] = useState(false);
  const t = useRef(0);
  useEffect(() => () => clearTimeout(t.current), []);
  return (
    <span className="xct-cpw">
      <button type="button" className={'xct-cp' + (ok ? ' ok' : '')} aria-label={'Copy ' + text} data-sound=""
        onClick={async () => {
          if (!(await copyText(text))) return; // a failed copy never says "Copied"
          setOk(true); clearTimeout(t.current); t.current = setTimeout(() => setOk(false), 1800);
        }}>
        {ok
          ? <svg viewBox="0 0 16 16" width="18" height="18" aria-hidden="true"><motion.path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3, ease: EM }} /></svg>
          : <svg viewBox="0 0 16 16" width="18" height="18" aria-hidden="true"><rect x="5" y="5" width="8.5" height="8.5" rx="2" fill="none" stroke="currentColor" strokeWidth="1.4" /><path d="M10.5 3.2V3a.8.8 0 0 0-.8-.8H3a.8.8 0 0 0-.8.8v6.7c0 .44.36.8.8.8h.2" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>}
      </button>
      <span className={'xct-cpt' + (ok ? ' on' : '')} role="status" aria-live="polite">{ok ? 'Copied' : ''}</span>
    </span>
  );
}

const Arr = () => <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;

function Route({ i }) {
  if (i === 0) return (
    <>
      <h2 className="xct-rh">Bring Hanzo to your company.</h2>
      <p className="xct-rp">Enterprise plans, your own infrastructure, dedicated compute and engineers on call around the clock.</p>
      <div className="xct-acts">
        <span className="xct-go" data-thumb="Talk to sales" data-cta="contact.hero"><Go to="/contact-sales" solid className="xct-big">Talk to sales</Go></span>
        <div className="xct-more">
          <A to="/enterprise" className="x-arrow"><span>See Enterprise</span><Arr /></A>
          <A to="https://cal.com/hanzo/30min" className="x-arrow"><span>Book a 30-minute call</span><Arr /></A>
        </div>
      </div>
    </>
  );
  if (i === 1) return (
    <>
      <h2 className="xct-rh">Developer Dispatch</h2>
      <p className="xct-rp">Frontier AI model releases (Enso, Zen 6), tutorials, and engineering announcements.</p>
      <div className="xct-acts"><span className="xct-go" data-cta="contact.dispatch"><Go to="/newsletter" solid className="xct-big">Subscribe to newsletter</Go></span></div>
    </>
  );
  if (i === 2) return (
    <>
      <h2 className="xct-rh">Support</h2>
      <p className="xct-rp">Help with your account, billing or the product: the Help Center, the docs and live status.</p>
      <div className="xct-acts"><span className="xct-go" data-cta="contact.support"><Go to="/support" solid className="xct-big">Get support</Go></span></div>
    </>
  );
  return (
    <>
      <h2 className="xct-rh">Press & General</h2>
      <p className="xct-rp">Stories, interviews, partnerships and general inquiries.</p>
      <div className="xct-acts">
        <span className="xct-go" data-cta="contact.press"><Go to="mailto:hello@hanzo.ai" solid className="xct-big">hello@hanzo.ai</Go></span>
        <CopyMail text="hello@hanzo.ai" />
      </div>
    </>
  );
}

/* The patch panel. `at` is the route you chose (it starts, and stays, on Sales); `cab` is the socket the cable is in.
   Desktop: once the headline has landed, the cable alone sweeps the four sockets once and lands back on Sales. Then
   it hangs and sways a little (the hero's one continuous mover), and leans toward a jack you point at. Pointer or
   focus on the panel ends the sweep at once. The plug, the nub and the wire are one drawing. */
function Panel({ go }) {
  const [at, setAt] = useState(0);
  const [cab, setCab] = useState(0);
  const [held, setHeld] = useState(false); // the visitor is here: no demo
  const [hyd, setHyd] = useState(false);
  const [wide, setWide] = useState(true);
  const calm = useReducedMotion();
  const box = useRef(null);
  const row = useRef(null);
  const plug = useRef(null);
  const jacks = useRef([]);
  const wire = useRef(null);
  const nub = useRef(null);
  const geo = useRef(null);
  const cabRef = useRef(0);
  const leanTo = useRef(-1);
  const [size, setSize] = useState(null);
  const seen = useInView(box, { amount: 0.35 });
  const sx = useMotionValue(0);
  const sy = useMotionValue(0);
  const sway = useMotionValue(0); // -1..1, the wire's idle drift
  const lean = useMotionValue(0); // 0..1 toward the jack under the pointer
  const placed = useRef(false);

  useEffect(() => {
    setHyd(true);
    const m = matchMedia('(min-width: 900px)');
    const on = () => setWide(m.matches);
    on(); m.addEventListener('change', on);
    return () => m.removeEventListener('change', on);
  }, []);
  const pick = (i) => { setHeld(true); setAt(i); setCab(i); };
  const hold = () => { if (!held) { setHeld(true); setCab(at); } };

  // the arrival sweep (desktop): Sales → Dispatch → Support → Press → Sales, the cable only, after the h1 has landed
  useEffect(() => {
    if (!wide && go && !held) { setHeld(true); return; } // phones: no sweep; rest (and sway) after the entrance
    if (held || calm || !go || !seen || !wide) return;
    let k = 0, t = 0;
    const path = [1, 2, 3, 0];
    const step = () => { setCab(path[k]); k += 1; if (k < path.length) t = setTimeout(step, 600); else setHeld(true); };
    t = setTimeout(step, 1000);
    return () => clearTimeout(t);
  }, [held, calm, go, seen, wide]);

  // idle: once at rest, the wire sways a few pixels, slowly, while the panel is on screen
  useEffect(() => {
    if (calm || !held || !seen) { sway.set(0); return; }
    const a = animate(sway, [0, 1, 0, -1, 0], { duration: 7, ease: 'easeInOut', repeat: Infinity });
    return () => a.stop();
  }, [calm, held, seen, sway]);

  // draw the wire from the socket point (sx, sy) to the plug on the route; the nub rides the same point
  const draw = () => {
    const g = geo.current;
    if (!g || !wire.current) return;
    const x0 = sx.get(), y0 = sy.get(), x1 = g.px, y1 = g.py;
    const sag = (y1 - y0) * 0.9;
    // idle: the belly drifts sideways about 10px and breathes a little; the two ends never move
    const s = sway.get() * (g.px < 300 ? 48 : 16); // the phone's short wire swings wider so its drift reads
    const b = 1 + sway.get() * 0.06;
    const l = leanTo.current >= 0 && g.js[leanTo.current] ? (g.js[leanTo.current][0] - x0) * 0.22 * lean.get() : 0;
    wire.current.setAttribute('d', `M ${x0} ${y0} C ${x0 + s + l} ${y0 + sag * b}, ${x1 + s * 0.8 + l * 0.6} ${y1 - sag * 0.7 * b}, ${x1} ${y1}`);
    nub.current.setAttribute('transform', `translate(${x0 - 9} ${y0 - 7})`);
    if (!box.current.dataset.wired) box.current.dataset.wired = '1';
  };
  useEffect(() => {
    const u = [sx, sy, sway, lean].map((m) => m.on('change', draw));
    return () => u.forEach((f) => f());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useLayoutEffect(() => {
    const measure = () => {
      const b = box.current;
      if (!b || !plug.current) return;
      const r = b.getBoundingClientRect();
      const p = plug.current.getBoundingClientRect();
      const k = r.width / b.offsetWidth || 1; // the curtain scales the page while it lifts: measure in layout pixels
      geo.current = {
        px: (p.left - r.left + p.width / 2) / k, py: (p.top - r.top + 2) / k,
        js: jacks.current.map((j) => { const q = j.getBoundingClientRect(); return [(q.left - r.left + q.width / 2) / k, (q.bottom - r.top + 2) / k]; }),
      };
      setSize([b.offsetWidth, b.offsetHeight]);
      const [x, y] = geo.current.js[cabRef.current];
      sx.jump(x); sy.jump(y); placed.current = true;
      draw();
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(box.current);
    const r = row.current;
    r.addEventListener('scroll', measure, { passive: true });
    addEventListener('hz-arrived', measure);
    document.fonts?.ready.then(measure);
    return () => { ro.disconnect(); r.removeEventListener('scroll', measure); removeEventListener('hz-arrived', measure); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    cabRef.current = cab;
    const g = geo.current;
    if (!g || !placed.current) return;
    const [x, y] = g.js[cab];
    if (calm) { sx.jump(x); sy.jump(y); draw(); return; }
    const a = animate(sx, x, SWING), b = animate(sy, y, SWING);
    return () => { a.stop(); b.stop(); };
  }, [cab, calm]); // eslint-disable-line react-hooks/exhaustive-deps

  // pointer: the hanging wire leans toward the jack you point at (fine pointers only)
  const point = (i) => {
    if (calm || i === cabRef.current) { animate(lean, 0, { duration: 0.3, ease: IO }); return; }
    leanTo.current = i;
    animate(lean, 1, { duration: 0.3, ease: IO });
  };
  const unpoint = () => animate(lean, 0, { duration: 0.3, ease: IO });

  // once the chosen route has faded in, the shared ask bar (components/Ask.jsx) looks again on a scroll event, so the
  // header's ask stays an outline beside the route's own solid button: one solid fill at a time
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    const t = setTimeout(() => dispatchEvent(new Event('scroll')), 450);
    return () => clearTimeout(t);
  }, [at]);

  // phones: the jacks are a swipe row, so the chosen one slides into view (the row scrolls, never the page)
  useEffect(() => {
    const j = jacks.current[at];
    const r = row.current;
    if (!r || r.scrollWidth <= r.clientWidth) return;
    r.scrollTo({ left: Math.max(0, j.offsetLeft - 20), behavior: calm ? 'auto' : 'smooth' });
  }, [at, calm]);

  const key = (e, i) => {
    const n = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!n) return;
    e.preventDefault();
    const j = (i + n + LINES.length) % LINES.length;
    pick(j);
    e.currentTarget.parentElement.children[j]?.focus();
  };

  return (
    <div className="xct-obj" ref={box} onPointerEnter={hold} onFocusCapture={hold}>
      <noscript dangerouslySetInnerHTML={NOJS} />
      <div className="xct-jacks" role="tablist" aria-label="Contact" ref={row} onPointerLeave={unpoint}>
        {LINES.map((l, i) => (
          <button key={l.k} type="button" role="tab" id={'xct-t' + i} aria-controls={'xct-p' + i} aria-selected={at === i} tabIndex={at === i ? 0 : -1}
            className={'xct-jack' + (at === i ? ' on' : '') + (cab === i ? ' lit' : '')} onClick={() => pick(i)} onKeyDown={(e) => key(e, i)}
            onPointerEnter={(e) => { if (e.pointerType === 'mouse') point(i); }} ref={(el) => { jacks.current[i] = el; }}>
            <span className="xct-hole" aria-hidden="true"><i /></span>
            <span className="xct-jt">
              <span className="xct-k">{l.k}</span>
              <span className="xct-peek" aria-hidden="true">{l.go}</span>
            </span>
          </button>
        ))}
      </div>
      <svg className="xct-cable" width={size ? size[0] : 0} height={size ? size[1] : 0} aria-hidden="true">
        <path ref={wire} className="xct-wire" />
        <g ref={nub}><rect width="18" height="12" rx="3" className="xct-nub" /></g>
      </svg>
      <div className="xct-panel">
        <span className="xct-plug" ref={plug} aria-hidden="true" />
        {LINES.map((l, i) => (
          <motion.div key={l.k} id={'xct-p' + i} role="tabpanel" aria-labelledby={'xct-t' + i} className="xct-route"
            initial={false}
            animate={i === at ? { opacity: 1, y: 0 } : { opacity: 0, y: i < at ? -16 : 16 }}
            transition={{ duration: i === at ? 0.3 : 0.15, ease: EM, delay: i === at ? 0.1 : 0 }}
            {...(hyd && i !== at ? { 'aria-hidden': true, inert: true } : {})}>
            <Route i={i} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* San Francisco's time on a big dial, beside the address. Drawn in the browser only: the hands appear with the first
   tick (none with JS off), and the dial's name carries the time for screen readers, once a minute. */
function Clock() {
  const box = useRef(null);
  const dial = useRef(null);
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
    let last = '';
    const tick = () => {
      const now = new Date();
      const s = f.format(now);
      if (t.current) t.current.textContent = s;
      if (s !== last && box.current) { box.current.setAttribute('aria-label', 'San Francisco, ' + s); last = s; }
      const p = Object.fromEntries(parts.formatToParts(now).map((x) => [x.type, +x.value]));
      if (hr.current) hr.current.style.transform = `rotate(${(p.hour % 12) * 30 + p.minute * 0.5}deg)`;
      if (mn.current) mn.current.style.transform = `rotate(${p.minute * 6 + p.second * 0.1}deg)`;
      if (sc.current) sc.current.style.transform = `rotate(${p.second * 6}deg)`;
      dial.current?.classList.add('live');
    };
    tick();
    // reduced motion: the hands are set once a minute, so nothing sweeps
    const id = setInterval(tick, calm ? 60000 : 1000);
    return () => clearInterval(id);
  }, [seen, calm]);
  return (
    <div className="xct-clock" ref={box} role="img" aria-label="San Francisco">
      <svg viewBox="0 0 200 200" className="xct-dial" ref={dial} aria-hidden="true">
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

/* The community: an index of Hanzo's channels beside a contour plate, in three sizes: names at section-heading size
   (26px), each over its own address in small mono (the link's own words, https:// dropped), and the plate's big name.
   Only the row you are on grows (scale 1.3, 400ms ease-emphasis) and settles back as you leave it. The plate follows
   the row you scroll to and the row you point at or focus; it redraws from that channel's own address with a short
   cross-fade, its name rising in. On phones the plate rides at the top without its name (the row below already says it). */
// the link's own address, https:// and www. dropped, breakable only after a slash
const where = (u) => u.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '').split('/').flatMap((s, i) => (i ? [<wbr key={i} />, '/' + s] : [s]));
function Community() {
  const [on, setOn] = useState(0);
  const [hyd, setHyd] = useState(false);
  const hover = useRef(false);
  const rows = useRef([]);
  useEffect(() => setHyd(true), []);
  useEffect(() => {
    const io = new IntersectionObserver((es) => {
      if (hover.current) return;
      es.forEach((e) => { if (e.isIntersecting) setOn(+e.target.dataset.i); });
    }, { rootMargin: '-46% 0px -50% 0px' });
    rows.current.forEach((r) => r && io.observe(r));
    return () => io.disconnect();
  }, []);
  const [n, u] = NETS[on];
  return (
    <section className="xct-com" aria-labelledby="xct-com-h">
      <div className="vc-grid">
        <div className="xct-com-l">
          <MaskLines id="xct-com-h" lines={['Join the community']} className="vc-headline" />
          <div className="xct-plate-m"><div className="xct-plate" aria-hidden="true">
            <motion.div key={u} className="xct-plate-s" initial={hyd ? { opacity: 0 } : false} animate={{ opacity: 1 }} transition={{ duration: 0.3, ease: EM }}>
              <Sigil seed={u} data={[n.length, u.length]} />
            </motion.div>
            <span className="xct-plate-w">
              <motion.span key={n} className="xct-plate-n" initial={hyd ? { y: '100%' } : false} animate={{ y: 0 }} transition={{ duration: 0.3, ease: EM }}>{n}</motion.span>
            </span>
          </div></div>
        </div>
        <ul className="xct-nets" onPointerLeave={() => { hover.current = false; }}>
          {NETS.map(([name, url], i) => (
            <li key={name} ref={(el) => { rows.current[i] = el; }} data-i={i}>
              <A to={url} className={'xct-net' + (on === i ? ' on' : '')} data-cursor="Open" onPointerEnter={() => { hover.current = true; setOn(i); }} onFocus={() => setOn(i)}>
                <span className="xct-net-t"><span className="xct-net-n">{name}</span><span className="xct-net-u" aria-hidden="true">{where(url)}</span></span>
                <svg viewBox="0 0 16 16" width="20" height="20" aria-hidden="true"><path d="M5 11 11 5M6 5h5v5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </A>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default function Contact() {
  const go = useGo();
  const [curtain] = useState(() => typeof document !== 'undefined' && document.documentElement.classList.contains('x-arriving'));
  return (
    <main className="vc xct" style={{ '--acc': '#0a0a0a' }} data-ask-name="Contact">
      <section className="xct-hero" aria-labelledby="xct-h1">
        <div className="vc-grid xct-hero-g">
          <div className="xct-hero-c">
            <MaskLines as="h1" id="xct-h1" now delay={curtain ? 0.55 : 0.05} stagger={0.06} lines={['How can', 'we help?']} className="vc-display" />
            <p className="vc-lede xct-in">Sales, support, press or anything else: reach the right people here.</p>
          </div>
          <div className="xct-hero-o xct-in2">
            <Panel go={go} />
          </div>
        </div>
      </section>

      <section className="xct-visit" data-room="dark" aria-labelledby="xct-visit-h">
        <div className="vc-grid xct-visit-g">
          <div className="xct-visit-c">
            <MaskLines id="xct-visit-h" lines={['Visit']} className="vc-headline" />
            <p className="vc-headline xct-addr">1 Ferry Building</p>
            <p className="vc-lede xct-city">San Francisco, CA 94105</p>
          </div>
          <Clock />
        </div>
      </section>

      <Community />
      <Band title="Bring Hanzo to your company." action="Talk to sales" to="/contact-sales" />
    </main>
  );
}
