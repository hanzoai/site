'use client';
/* /press. V2: 8/10 Story on the Hanzo deck (third review's fixes: scale rhythm, a beat per lower section, phone news card, kit signature). The headline and its one ask sit beside a stack of the
   three press-kit plates; scroll and the stack itself fans out into the kit (one object, one pinned stage, never shown
   twice). Hanzo's boilerplate is read word by word, the four facts settle once, the news reads as an editorial index with
   a card beside the row you point at, press contact is the one black room where the email cuts in with its copy button
   beside it, then brand assets with the partners as one still row, the channels as a hairline list, and the leadership.
   Persona: a journalist or analyst writing about Hanzo (MASTER: investors and press).
   Goal: leave with the kit, the facts and the right person to email.
   CTA: "Contact Press Team" (mailto:press@hanzo.ai) in the hero and the shared sticky ask bar (data-thumb), data-cta
   press.hero; "Request Executive Bios" (press.bios) closes the page; metric: one contact click.
   Signature: the kit deals out. The three press-kit plates sit as one stack beside the headline; pinned, the stack fans
   out into the kit spread as you scroll (stack to spread), a move no other page makes. A sheen crosses the dark plate.
   Demoted to support: the boilerplate read word by word (scroll), the facts settling once.
   Supporting (3): masked headline cut-in, once (with the team names and section heads); the boilerplate word fill
   (scroll); the email typed into the black room, one beat per section below it (time: the partner hairlines drawing
   one by one, the channel index walking 01 to 09 once, the guidelines mark drawing in), each running once, then at rest.
   The news index beside a still dark column that holds the story in focus (01 / 06, a progress
   hairline, its summary and date rising in at 300ms); focus follows pointer, keyboard, or the row crossing mid-screen. State: copy and download draw a tick. Arrival: the lede and asks rise once (1 fade-up).
   Beyond: the boilerplate copies in one press, and the press email copies beside itself in the black room, so a writer
   leaves with both without retyping. Every word and link is Hanzo's.
   Deletes: the second copy of the kit plates (the stack becomes the spread), the 3×3 channel tiles and their icon
   circles, the six partner boxes, the page tokens that overrode deck.css's greys, the hidden-only "Press & Media" and
   "Leadership" (now captions under their headings), springs, filters on photos. */
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import LivePause, { usePause } from '../v2/LivePause';
import { motion, AnimatePresence, useInView, useMotionValue, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { Copy, Mark } from '../ui';
import { A, Img } from '../kit';
import Sigil from '../Sigil';
import MaskLines from './company/MaskLines';
import '../v2/vc-type.css';
import './company/deck.css';
import './Press.css';

const EASE = [0.16, 1, 0.3, 1];
const KIT = '/press/hanzo-press-kit.zip';
const MAIL = 'mailto:press@hanzo.ai';
const PLATES = [['Logo - Dark Background', 'White logo for use on dark backgrounds', 'SVG, PNG', 'dark'], ['Logo - Light Background', 'Black logo for use on light backgrounds', 'SVG, PNG', 'light'], ['Icon Only', 'Standalone icon without wordmark', 'SVG, PNG, ICO', 'icon']];
const ARROW = <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const DOWN = <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M8 2.5v8M4.5 7.5 8 11l3.5-3.5M3 13.5h10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
// JS off: every word visible and in place, the pinned stage laid out flat, no empty pointer card
const NOJS = { __html: '<style>.xpe-w{opacity:1!important}.xpe-fig span,.xpe-mail-i{transform:none!important}.xpe-kp,.xpe-hk-in{transform:none!important}.xpe-kitc-t,.xpe-hero-c{opacity:1!important}.xpe-hk{height:auto!important}.xpe-hk-st{position:static!important;height:auto!important}.xpe-card{display:none!important}.xpe-ts2{display:block!important}.xpe-copy-w{opacity:1!important;transform:none!important;pointer-events:auto!important}.xpe-face{clip-path:none!important}.xpe-partners li::before,.xpe-p-img{transform:none!important}.xpe-guide-p svg{clip-path:none!important}.xpe-caret{display:none!important}</style>' };

/* A Hanzo picture that steps aside for its fallback when it cannot load (MASTER part 17). */
function Pic({ fallback = null, ...p }) {
  const [bad, setBad] = useState(false);
  const ref = useRef(null);
  useLayoutEffect(() => { const i = ref.current; if (i && i.complete && !i.naturalWidth) setBad(true); }, []);
  if (bad) return fallback;
  return <Img ref={ref} {...p} onError={() => setBad(true)} />;
}

/* ui Copy plus a polite status line, so a screen reader hears "Copied" (MASTER part 8). */
function CopyIt({ text, label, className }) {
  const [msg, setMsg] = useState('');
  return (
    <span className="xpe-copy" onClickCapture={() => { setMsg('Copied'); setTimeout(() => setMsg(''), 1600); }}>
      <Copy text={text} label={label} className={className} />
      <span className="x-sr" role="status">{msg}</span>
    </span>
  );
}

function Download({ className, children, ...rest }) {
  const [got, setGot] = useState(false);
  return (
    <motion.a href={KIT} download className={className} {...rest} onClick={() => { setGot(true); setTimeout(() => setGot(false), 2200); }} whileTap={{ scale: 0.97 }}>
      <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
        {got
          ? <motion.path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3 }} />
          : <path d="M8 2.5v8M4.5 7.5 8 11l3.5-3.5M3 13.5h10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />}
      </svg>
      {children}
    </motion.a>
  );
}

function Plate({ kind }) {
  return (
    <span className={'xpe-plate ' + kind} aria-hidden="true">
      <Mark size={kind === 'icon' ? 88 : 52} />
      {kind !== 'icon' && <b>Hanzo</b>}
    </span>
  );
}

/* Once a section is half in view, step a counter 0..n every `ms`, then rest at n (MASTER part 9: Time kind, ends at rest).
   Reduced motion and JS-off show the end state. Returns [step, done, ref]. */
function useBeat(n, ms, amount = 0.5) {
  const ref = useRef(null);
  const calm = useReducedMotion();
  const seen = useInView(ref, { once: true, amount });
  const [k, setK] = useState(n);
  const armed = useRef(false);
  useLayoutEffect(() => { if (!calm && !armed.current) { armed.current = true; setK(0); } }, [calm]);
  useLayoutEffect(() => {
    if (calm || !seen) return undefined;
    let i = 0;
    const id = setInterval(() => { i += 1; setK(i); if (i >= n) clearInterval(id); }, ms);
    return () => clearInterval(id);
  }, [seen, calm, n, ms]);
  return [calm ? n : k, calm || k >= n, ref];
}

/* Keep "10-54%"-style tokens whole: a break after their hyphen reads as broken copy. Words unchanged. */
const keep = (t) => t.split(/(\S*\d-\d\S*)/).map((w, i) => (i % 2 ? <span key={i} className="xpe-nb">{w}</span> : w));

const clamp = (v) => Math.max(0, Math.min(1, v));
const io = (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2); // ease-in-out along the scroll
const STACK = [[0, 0, -4], [30, -34, 2], [60, -68, 7]]; // the hero stack: offset x, y and turn of each plate

/* One kit plate. In the hero it sits in the stack; as the stage scrolls it travels to its own place in the spread. */
function KitPlate({ i, t, p, m, tick }) {
  const g = (v) => io(clamp((v - 0.12) / 0.6));
  const x = useTransform([p, tick], ([v]) => (m.current ? m.current[i].x * (1 - g(v)) : 0));
  const y = useTransform([p, tick], ([v]) => (m.current ? m.current[i].y * (1 - g(v)) : 0));
  const s = useTransform([p, tick], ([v]) => (m.current ? 1 + (m.current[i].s - 1) * (1 - g(v)) : 1));
  const r = useTransform([p, tick], ([v]) => (m.current ? STACK[i][2] * (1 - g(v)) : 0));
  const o = useTransform([p, tick], ([v]) => (m.current ? clamp((v - 0.62) / 0.16) : 1));
  const [title, desc, fmt, kind] = t;
  return (
    <li className={'xpe-kitc-w ' + kind} style={{ zIndex: 3 - i }}>
      <motion.a href={KIT} download className="xpe-kp" aria-label={'Download Press Kit: ' + title} style={{ x, y, scale: s, rotate: r }}>
        <Plate kind={kind} />
        <motion.span className="xpe-fmt" style={i ? { opacity: o } : undefined}>{fmt.split(', ').map((f) => <i key={f}>{f}</i>)}<span className="x-sr">{fmt}</span></motion.span>
      </motion.a>
      <motion.span className="xpe-kitc-t" style={{ opacity: o }}><h2 className="vc-title">{title}</h2><span>{desc}</span></motion.span>
    </li>
  );
}

/* The hero and the kit are one pinned stage: the headline leaves as the stack fans out into the three plates. */
function HeroKit() {
  const ref = useRef(null), inner = useRef(null), text = useRef(null), list = useRef(null);
  const m = useRef(null);
  const lift = useRef(0);
  const tick = useMotionValue(0);
  const calm = useReducedMotion();
  useLayoutEffect(() => {
    const measure = () => {
      const el = inner.current, tx = text.current, ul = list.current;
      if (!el || !tx || !ul || innerWidth < 900 || calm) { m.current = null; lift.current = 0; tick.set(tick.get() + 1); return; }
      const W = el.offsetWidth;
      const cx = W * 0.78, cy = tx.offsetTop + tx.offsetHeight * 0.55; // the stack sits right of the headline
      m.current = [...ul.children].map((li, i) => {
        const a = li.firstChild; // the plate
        const px = ul.offsetLeft + li.offsetLeft + a.offsetLeft + a.offsetWidth / 2;
        const py = ul.offsetTop + li.offsetTop + a.offsetTop + a.offsetHeight / 2;
        const s = 400 / a.offsetWidth;
        return { x: cx - px + STACK[i][0], y: cy - py + STACK[i][1], s };
      });
      lift.current = ul.offsetTop - 120; // the spread ends near the top of the stage
      tick.set(tick.get() + 1);
    };
    measure();
    addEventListener('resize', measure);
    return () => removeEventListener('resize', measure);
  }, [calm, tick]);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const up = useTransform([p, tick], ([v]) => (m.current ? -lift.current * io(clamp(v / 0.72)) : 0));
  const fade = useTransform([p, tick], ([v]) => (m.current ? 1 - clamp(v / 0.3) : 1));
  return (
    <section className="xpe-hk" ref={ref} aria-labelledby="xpe-h1">
      <div className="xpe-hk-st">
        <motion.div className="vc-grid xpe-hk-in" ref={inner} style={{ y: up }}>
          <motion.div className="xpe-hero-c" ref={text} style={{ opacity: fade }}>
            <div className="xpe-hero-h" data-ask-name="Press & Media">
              <MaskLines as="h1" id="xpe-h1" now delay={0.05} lines={['Press', 'Resources.']} className="vc-display xpe-h1" />
              <p className="vc-kick xpe-cap">Press &amp; Media</p>
            </div>
            <div className="xpe-hero-f xpe-in">
              <p className="vc-lede">Press kit, brand assets, and who to email — for anyone writing about Hanzo AI, Inc.</p>
              <div className="xpe-acts">
                <a href={MAIL} className="xpe-cta" data-thumb="Contact Press Team" data-cta="press.hero">Contact Press Team</a>
                <Download className="xpe-cta q" data-cta="press.kit">Download Press Kit</Download>
              </div>
            </div>
          </motion.div>
          <ul className="xpe-plates" ref={list} aria-label="Press kit">
            {PLATES.map((t, i) => <KitPlate key={t[3]} i={i} t={t} p={p} m={m} tick={tick} />)}
          </ul>
          <p className="xpe-zip"><span className="vc-num">hanzo-press-kit.zip</span><span>SVG · PNG</span></p>
        </motion.div>
      </div>
    </section>
  );
}

const BOILER = 'Hanzo AI, Inc. is an AI technology company building the infrastructure for the next generation of intelligent applications. Founded in 2016 and headquartered in San Francisco, Hanzo is led by CEO Antje Worring and CTO Zach Kelling, providing AI platforms, developer tools, and cloud services to companies worldwide. Our mission is to make AI accessible, safe, and beneficial for everyone.';
const FACTS = [['2016', 'Founded'], ['San Francisco, CA', 'Headquarters'], ['Hanzo AI, Inc.', 'Entity'], ['Techstars ’17', 'Backing']];

/* The signature: the belief line, read word by word as it scrolls through the screen. */
function Word({ p, a, b, children }) {
  const o = useTransform(p, [a, b], [0.16, 1]);
  return <motion.span className="xpe-w" style={{ opacity: o }}>{children} </motion.span>;
}
function Belief({ text }) {
  const ref = useRef(null);
  const calm = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.9', 'end 0.85'] });
  const words = text.split(' ');
  return (
    <p ref={ref} className="xpe-boiler">
      {calm ? text : words.map((w, i) => <Word key={i} p={scrollYProgress} a={(i / words.length) * 0.8} b={Math.min(0.92, ((i + 1.5) / words.length) * 0.8)}>{w}</Word>)}
    </p>
  );
}
/* A fact that settles into its place once, out of its own mask. */
function Fact({ v, k, big }) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.6 });
  return <div ref={ref} className={big ? 'big' : ''}><dd className={'xpe-fig' + (seen ? ' in' : '')}><span>{v}</span></dd><dt className="vc-kick">{k}</dt></div>;
}

function About() {
  return (
    <section className="vc-sec xpe-about" aria-labelledby="xpe-about-h">
      <div className="vc-grid xpe-about-g">
        <div className="xpe-about-h">
          <MaskLines id="xpe-about-h" lines={['About Hanzo', 'AI, Inc.']} className="vc-headline" />
          <CopyIt text={BOILER} label="Copy boilerplate" className="xpe-icon" />
        </div>
        <Belief text={BOILER} />
        <dl className="xpe-facts">
          {FACTS.map(([v, k], i) => <Fact key={k} v={v} k={k} big={i === 0} />)}
        </dl>
      </div>
    </section>
  );
}

const NEWS = [
  ['February 27, 2026', 'Hanzo Launches One API for Every Model — 500+ Models, Zero Markup', 'The Hanzo AI API provides access to over 500 models from every major provider through a single API key with zero markup on third-party pricing.'],
  ['February 27, 2026', 'Hanzo Cloud Launches with 10-54% Lower Pricing Than Competitors', 'Hanzo Cloud offers developer VMs starting at $5/mo with 2x the RAM of DigitalOcean at the same price, zero egress fees, and global multi-cloud routing.'],
  ['February 27, 2026', 'Hanzo Bot: Full-Stack AI Agent Hosting from $5/mo', 'Deploy AI agents with built-in access to 500+ models, 260+ MCP tools, GPU compute, and multimodal capabilities — audio transcription 85% cheaper than OpenAI.'],
  ['February 27, 2026', 'Zen4 Coder 480B: The Largest Open-Source Code Model', 'Zen4 Coder 480B MoE delivers frontier-class code generation with only 22B active parameters, available through the Hanzo AI API.'],
  ['February 9, 2026', 'Zen4 Model Family Launch — 14 Models from 600M to 480B Parameters', 'Zoo Labs Foundation releases the Zen4 model family built on Mixture of Diverse Experts architecture, spanning chat, code, vision, and audio — served on the Hanzo AI API.'],
  ['February 27, 2026', 'Complete AI Pricing Breakdown: Models, Cloud, GPU, and Audio', 'Every Hanzo rate in one place — gateway, cloud, GPU, and audio.'],
];

/* The news index: big headlines on the left; a still column on the right holds the story in focus (its number, date
   and summary). Focus follows the pointer, the keyboard, or, untouched, the row passing the middle of the screen. */
function News() {
  const box = useRef(null);
  const [at, setAt] = useState(0);
  const [pointing, setPointing] = useState(false);
  const calm = useReducedMotion();
  // idle: while the card is in view and nothing holds it, it keeps walking the six stories slowly (4 s each);
  // pointer and focus hold it, the pause control stops it, reduced motion never starts it
  const [paused, pause] = usePause();
  const cref = useRef(null);
  const cardIn = useInView(cref, { amount: 0.5 });
  useEffect(() => {
    if (calm || paused || !cardIn) return undefined;
    const id = setInterval(() => { if (!box.current?.dataset.hold) setAt((a) => (a + 1) % NEWS.length); }, 4000);
    return () => clearInterval(id);
  }, [calm, paused, cardIn]);
  useLayoutEffect(() => {
    const rows = box.current ? [...box.current.querySelectorAll('.xpe-feed li')] : [];
    const ob = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting && !box.current?.dataset.hold) setAt(+e.target.dataset.i); });
    }, { rootMargin: '-48% 0px -48% 0px' });
    rows.forEach((r) => ob.observe(r));
    return () => ob.disconnect();
  }, []);
  const hold = (i) => { box.current.dataset.hold = '1'; setPointing(true); setAt(i); };
  const free = () => { delete box.current.dataset.hold; setPointing(false); };
  const cur = at;
  const [d, , s] = NEWS[cur];
  return (
    <section className="vc-sec xpe-news" aria-labelledby="xpe-news-h">
      <div className="vc-grid xpe-news-g">
        <MaskLines id="xpe-news-h" lines={['Recent News']} className="vc-headline" />
        <p className="vc-lede xpe-news-l">Latest press releases and company announcements.</p>
      </div>
      <div className="vc-wrap xpe-news-w" ref={box} onPointerLeave={free}>
        <ol className={'xpe-feed' + (pointing ? ' pointing' : '')}>
          {NEWS.map(([dd, t, ss], i) => (
            <li key={t} data-i={i} className={i === at ? 'on' : ''}>
              <A to="/blog" className="xpe-item" onPointerEnter={(e) => { if (e.pointerType === 'mouse') hold(i); }} onFocus={() => hold(i)} onBlur={free}>
                <span className="xpe-no vc-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <span className="xpe-tt">{keep(t)}</span>
                <span className="xpe-ts vc-num">{dd}</span>
                <span className="xpe-ts2">{ss}</span>
                <span className="xpe-go" aria-hidden="true">{ARROW}</span>
              </A>
            </li>
          ))}
        </ol>
        <aside className="xpe-card" ref={cref}>
          {!calm && <LivePause paused={paused} onToggle={pause} dark className="xpe-pause" />}
          <span className="xpe-card-n vc-num" aria-hidden="true"><b>{String(cur + 1).padStart(2, '0')}</b> / {String(NEWS.length).padStart(2, '0')}</span>
          <span className="xpe-card-bar" aria-hidden="true"><i style={{ transform: `scaleX(${(cur + 1) / NEWS.length})` }} /></span>
          <span className="xpe-card-st" aria-hidden="true">
            {NEWS.map(([dd, tt, ss]) => <span key={tt} className="xpe-card-b xpe-card-z"><span className="xpe-card-tt">{keep(tt)}</span><span className="xpe-card-s">{ss}</span><span className="vc-kick vc-num">{dd}</span></span>)}
          <AnimatePresence mode="wait" initial={false}>
            <motion.span key={cur} className="xpe-card-b" initial={calm ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={calm ? undefined : { opacity: 0, y: -10 }} transition={{ duration: 0.3, ease: EASE }}>
              <span className="xpe-card-tt">{keep(NEWS[cur][1])}</span>
              <span className="xpe-card-s">{s}</span>
              <span className="vc-kick vc-num">{d}</span>
            </motion.span>
          </AnimatePresence>
          </span>
        </aside>
      </div>
    </section>
  );
}

/* The black room: the email cuts in by line mask, its copy button beside it, its label under it. */
const EMAIL = 'press@hanzo.ai';
function Contact() {
  const [k, done, ref] = useBeat(EMAIL.length, 70);
  const seen = k > 0 || done;
  return (
    <section className="xpe-contact" data-room="dark" aria-labelledby="xpe-contact-h">
      <div className="vc-grid xpe-contact-g">
        <div className="xpe-contact-h">
          <MaskLines id="xpe-contact-h" lines={['Press Contact']} className="vc-headline" />
          <p className="vc-lede">Get in touch with our media relations team.</p>
        </div>
        <div className="xpe-contact-m" ref={ref}>
          <div className="xpe-mail-row">
            <a href={MAIL} className="xpe-mail" data-cta="press.mail"><span className={'xpe-mail-i' + (seen ? ' in' : '')}><span className="xpe-sizer" aria-hidden="true">{EMAIL}</span><span className="xpe-typed"><span className="x-sr">{EMAIL}</span><span aria-hidden="true">{EMAIL.slice(0, k)}</span>{!done && <i className="xpe-caret" aria-hidden="true" />}</span></span></a>
            <span className={'xpe-copy-w' + (done ? ' in' : '')}><CopyIt text="press@hanzo.ai" label="Copy" className="xpe-icon dk" /></span>
          </div>
          <h3 className="vc-kick">Media Inquiries</h3>
          <p className="xpe-tel vc-num">+1 (424) 335-0550</p>
        </div>
        <div className="xpe-contact-a">
          <address>Hanzo AI, Inc.<br />1 Ferry Building<br />San Francisco, CA 94105<br />United States</address>
          <h3 className="vc-kick">Headquarters</h3>
        </div>
      </div>
    </section>
  );
}

const PARTNERS = [['Techstars', '/press/partners/techstars/techstars.png', 'Logo (PNG)'], ['NVIDIA', '/press/partners/nvidia/nvidia.svg', 'Logo (SVG)'], ['Google Cloud', '/press/partners/googlecloud/googlecloud.svg', 'Logo (SVG)'], ['AWS', '/press/partners/aws/aws.svg', 'Logo (SVG)'], ['DigitalOcean', '/press/partners/digitalocean/digitalocean.svg', 'Logo (SVG)'], ['Nebius', '/press/partners/nebius/nebius.svg', 'Logo (SVG)']];

function BrandAssets() {
  const [k, , ref] = useBeat(PARTNERS.length, 160, 0.3);
  const [g, , gref] = useBeat(1, 120, 0.6); // the guidelines mark draws in when its own card is in view
  return (
    <section className="vc-sec xpe-brand" aria-labelledby="xpe-brand-h">
      <div className="vc-grid xpe-brand-g">
        <div className="xpe-brand-h">
          <MaskLines id="xpe-brand-h" lines={['Brand Assets']} className="vc-headline" />
          <p className="vc-body">Download logos and visual assets.</p>
          <Download className="xpe-cta q" data-cta="press.zip">Download Press Kit (ZIP)</Download>
        </div>
        <A to="/brand" className="xpe-guide" ref={gref}>
          <span className={'xpe-guide-p' + (g > 0 ? ' in' : '')} aria-hidden="true"><Mark size={56} /></span>
          <span className="xpe-guide-t"><b>Brand Guidelines</b><span>View Brand Guidelines <i>{ARROW}</i></span></span>
        </A>
        <h3 className="vc-title xpe-h3">Partner Assets</h3>
        <ul className="xpe-partners" ref={ref}>
          {PARTNERS.map(([n, f, l], i) => (
            <li key={n} className={i < k ? 'in' : ''}>
              <span className="xpe-p-img"><Pic src={f} alt={n} w={140} h={32} fallback={<span className="xpe-p-alt" aria-hidden="true">{n.slice(0, 1)}</span>} /></span>
              <b>{n}</b>
              <a href={f} download aria-label={n + ' ' + l}><span>{l}</span>{DOWN}</a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

const SOCIAL = [['Discord', 'discord.gg/XthHQQj', 'https://discord.gg/XthHQQj'], ['X (Twitter)', '@hanzoai', 'https://x.com/hanzoai'], ['GitHub', '@hanzoai', 'https://github.com/hanzoai'], ['LinkedIn', 'hanzo-ai', 'https://linkedin.com/company/hanzo-ai'], ['Facebook', '@hanzoinc', 'https://facebook.com/hanzoinc'], ['Bluesky', '@hanzoai.bsky.social', 'https://bsky.app/profile/hanzoai.bsky.social'], ['Reddit', 'r/HanzoAI', 'https://www.reddit.com/r/HanzoAI/'], ['TikTok', '@hanzoinc', 'https://www.tiktok.com/@hanzoinc'], ['Instagram', '@hanzoinc', 'https://www.instagram.com/hanzoinc']];

function Social() {
  const [k, done, ref] = useBeat(SOCIAL.length + 1, 420);
  const [held, setHeld] = useState(false);
  const lit = held || done ? -1 : k - 1;
  const [hov, setHov] = useState(-1);
  const show = lit >= 0 ? lit : hov >= 0 ? hov : 0;
  return (
    <section className="vc-sec tight xpe-social" aria-labelledby="xpe-soc-h">
      <div className="vc-grid xpe-soc-g">
        <div className="xpe-soc-h">
          <MaskLines id="xpe-soc-h" lines={['Connect With Us']} className="vc-headline" />
          <p className="vc-body">Follow us on social media for the latest updates.</p>
          <div className="xpe-soc-big" aria-hidden="true">
            <span className="xpe-soc-st">
              {SOCIAL.map(([n, h]) => <span key={n} className="xpe-soc-z"><b>{h}</b><span>{n}</span></span>)}
              <AnimatePresence mode="wait" initial={false}>
                <motion.span key={show} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3, ease: EASE }}>
                  <b>{SOCIAL[show][1]}</b><span><i className="vc-num">{String(show + 1).padStart(2, '0')} / 09</i> {SOCIAL[show][0]}</span>
                </motion.span>
              </AnimatePresence>
            </span>
          </div>
        </div>
        <ul className="xpe-soc" ref={ref} onPointerEnter={() => setHeld(true)} onFocus={() => setHeld(true)}>
          {SOCIAL.map(([n, h, to], i) => (
            <li key={n} className={i === lit ? 'lit' : ''} onPointerEnter={() => setHov(i)} onFocus={() => setHov(i)}><A to={to}><span className="xpe-soc-n vc-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span><b>{n}</b><span className="vc-num">{h}</span><i aria-hidden="true"><svg viewBox="0 0 16 16" width="14" height="14"><path d="M5 11 11 5M6 5h5v5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></i></A></li>
          ))}
        </ul>
      </div>
    </section>
  );
}

const LEADS = [['/authors/antje-worring-portrait.jpg', 'Antje Worring', 'CEO'], ['/authors/zach-kelling-portrait.jpg', 'Zach Kelling', 'CTO']];

function Team() {
  const [k, , ref] = useBeat(LEADS.length, 260, 0.3);
  return (
    <section className="xpe-team" aria-labelledby="xpe-team-h">
      <div className="vc-grid xpe-team-g">
        <div className="xpe-team-c">
          <div>
            <MaskLines id="xpe-team-h" lines={['Meet our team']} className="vc-headline" />
            <p className="vc-kick xpe-cap">Leadership</p>
          </div>
          <p className="vc-lede">For executive bios and headshots, visit our team page or contact our press team.</p>
          <div className="xpe-acts">
            <a href={MAIL} className="xpe-cta q" data-cta="press.bios">Request Executive Bios</a>
            <A to="https://hanzo.team" className="xpe-tl" data-cta="press.team">View Team <i aria-hidden="true">{ARROW}</i></A>
          </div>
        </div>
        <ul className="xpe-faces" ref={ref}>
          {LEADS.map(([src, n, role], i) => (
            <li key={n} className={'f' + i + (k > i ? ' in' : '')}>
              <span className="xpe-face">
                <span className="xpe-face-f" aria-hidden="true"><Sigil seed={src} data={[n.length, i + 1]} /></span>
                <Pic src={src} alt={n} w={600} h={750} fallback={<span className="xpe-face-i" aria-hidden="true">{n.split(' ').map((w) => w[0]).join('')}</span>} />
              </span>
              <span className="xpe-face-t"><MaskLines as="p" lines={[n]} delay={0.15 * i} className="xpe-face-n" /><span className="vc-num">{role}</span></span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default function Press() {
  return (
    <main className="vc xpe" style={{ '--acc': '#0a0a0a' }}>
      <noscript dangerouslySetInnerHTML={NOJS} />
      <HeroKit />
      <About />
      <News />
      <Contact />
      <BrandAssets />
      <Social />
      <Team />
    </main>
  );
}
