'use client';
/* /press. V2: 8/10 (v3 pass, JAMES.md): no hues and no eyebrows. A masthead-size kinetic headline with its one ask beside
   the press kit dealing its three plates once; the plates as a still asymmetric spread; the boilerplate set like a
   magazine standfirst with the facts as big figures; the news as an index of huge headlines with a card that follows the
   pointer; press contact as the one black room; brand and partner assets, channels, and the
   leadership with their portraits.
   Persona: a journalist or analyst (PLAN 1.1 "Investor and press") writing about Hanzo, on diligence.
   Goal: leave with the kit, the facts and the right person to email.
   CTA: "Contact Press Team" (mailto:press@hanzo.ai) in the hero and the shared sticky ask bar (data-thumb), data-cta
   press.hero; "Request Executive Bios" (press.bios) closes the page; metric: one contact click.
   Signature: the belief line (MASTER 4.4 Story). Hanzo's boilerplate is read word by word: each word turns from
   faint to ink as it scrolls through the screen, and the four facts below it settle into place once.
   Supporting (3): masked headline cut-in, once, after the curtain; the kit's plates dealing themselves to the front once;
   the news index, whose other headlines step back while a card with the story's date and summary rides beside the
   row you point at (300ms ease-out, never over a headline; on phones the summary sits under its headline). State: the download draws a tick.
   Beyond: the boilerplate copies in one press, and the press email copies beside the dark room's address, so a writer
   leaves with both without retyping. Every word and link is Hanzo's.
   Deletes: the magenta accent; the kickers over the h1 ("Press & Media"), over "Meet our team" ("Leadership") and over
   the email and address; the "/blog →" text in the news card; the visible "Copy boilerplate" label (icon + aria-label);
   the endless plate loop; raw <img> (kit Img); opacity:0 arrival states; the contact room's Sigil (third Sigil room among
   the company pages); springs; the greyscale filter on the portraits; hover transforms outside the deck's list. */
import { useEffect, useRef, useState } from 'react';
import { motion, animate, useInView, useMotionValue, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { Copy, Mark } from '../ui';
import { A, Img } from '../kit';
import MaskLines from './company/MaskLines';
import useArrived from './company/useArrived';
import '../v2/vc-type.css';
import './company/deck.css';
import './Press.css';

const EASE = [0.16, 1, 0.3, 1];
const KIT = '/press/hanzo-press-kit.zip';
const MAIL = 'mailto:press@hanzo.ai';
const PLATES = [['Logo - Dark Background', 'White logo for use on dark backgrounds', 'SVG, PNG', 'dark'], ['Logo - Light Background', 'Black logo for use on light backgrounds', 'SVG, PNG', 'light'], ['Icon Only', 'Standalone icon without wordmark', 'SVG, PNG, ICO', 'icon']];
const ARROW = <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;

function Plate({ kind, big }) {
  return (
    <span className={'xpe-plate ' + kind} aria-hidden="true">
      <Mark size={kind === 'icon' ? (big ? 120 : 72) : big ? 64 : 40} />
      {kind !== 'icon' && <b>Hanzo</b>}
    </span>
  );
}

/* a Hanzo picture that steps aside for its fallback when it cannot load (PLAN 2.17) */
function Pic({ fallback = null, ...p }) {
  const [bad, setBad] = useState(false);
  const ref = useRef(null);
  useEffect(() => { const i = ref.current; if (i && i.complete && !i.naturalWidth) setBad(true); }, []);
  if (bad) return fallback;
  return <Img ref={ref} {...p} onError={() => setBad(true)} />;
}

function Download({ className, children, ...rest }) {
  const [got, setGot] = useState(false);
  return (
    <motion.a href={KIT} download className={className} {...rest} onClick={() => { setGot(true); setTimeout(() => setGot(false), 2200); }} whileTap={{ scale: 0.98 }}>
      <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
        {got
          ? <motion.path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.35 }} />
          : <path d="M8 2.5v8M4.5 7.5 8 11l3.5-3.5M3 13.5h10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />}
      </svg>
      {children}
    </motion.a>
  );
}

function Hero() {
  const [top, setTop] = useState(0);
  const [steps, setSteps] = useState(0);
  const calm = useReducedMotion();
  const ok = useArrived(); // nothing deals behind the arrival curtain
  const ref = useRef(null);
  const live = useInView(ref, { amount: 0.3 });
  useEffect(() => {
    if (calm || !ok || !live || steps >= 3) return; // deals the three plates once, then rests with the dark plate in front
    const t = setTimeout(() => { setTop((v) => (v + 1) % 3); setSteps((s) => s + 1); }, 2400);
    return () => clearTimeout(t);
  }, [top, steps, calm, ok, live]);
  return (
    <section className="xpe-hero vc-scene" ref={ref} aria-label="Press & Media" data-ask-name="Press & Media">
      <div className="vc-grid xpe-hero-g">
        <div className="xpe-hero-c">
          <MaskLines as="h1" id="xpe-h1" now delay={0.05} lines={['Press', 'Resources.']} className="vc-display xpe-h1" />
          <div className="xpe-hero-f xpe-in">
            <p className="vc-lede">Press kit, brand assets, and who to email — for anyone writing about Hanzo AI, Inc.</p>
            <div className="xpe-acts">
              <a href={MAIL} className="xpe-cta" data-thumb="Contact Press Team" data-cta="press.hero">Contact Press Team</a>
              <Download className="xpe-cta q" data-cta="press.kit">Download Press Kit</Download>
            </div>
          </div>
        </div>
        <div className="xpe-fan xpe-in2">
          <div className="xpe-fan-s">
            {PLATES.map(([t, , , kind], i) => {
              const k = (i - top + 3) % 3;
              return (
                <motion.a key={kind} href={KIT} download className="xpe-fan-c" aria-label={'Download Press Kit: ' + t} tabIndex={k === 0 ? 0 : -1}
                  initial={false} animate={{ x: k * 30, y: k * -34, rotate: [-4, 2, 7][k], scale: 1 - k * 0.07, zIndex: 3 - k, opacity: 1 - k * 0.12 }}
                  transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}>
                  <Plate kind={kind} big />
                  <span className="xpe-fan-l">{t}</span>
                </motion.a>
              );
            })}
          </div>
          <p className="xpe-zip"><span className="vc-num">hanzo-press-kit.zip</span><span>SVG · PNG</span></p>
        </div>
      </div>
    </section>
  );
}

function Kit() {
  return (
    <section className="xpe-kit" aria-label="Press kit">
      <ul className="vc-grid xpe-plates">
        {PLATES.map(([t, d, f, kind]) => (
          <li key={kind} className={'xpe-kitc-w ' + kind}>
            <a href={KIT} download className="xpe-kitc">
              <Plate kind={kind} big={kind === 'dark'} />
              <span className="xpe-kitc-t"><h3 className="vc-title">{t}</h3><span>{d}</span></span>
              <span className="xpe-fmt">{f.split(', ').map((x) => <i key={x}>{x}</i>)}<span className="x-sr">{f}</span></span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

const BOILER = 'Hanzo AI, Inc. is an AI technology company building the infrastructure for the next generation of intelligent applications. Founded in 2016 and headquartered in San Francisco, Hanzo is led by CEO Antje Worring and CTO Zach Kelling, providing AI platforms, developer tools, and cloud services to companies worldwide. Our mission is to make AI accessible, safe, and beneficial for everyone.';
const FACTS = [['2016', 'Founded'], ['San Francisco, CA', 'Headquarters'], ['Hanzo AI, Inc.', 'Entity'], ['Techstars ’17', 'Backing']];

/* The signature: the belief line, read word by word as it scrolls through the screen. */
const NOJS_W = { __html: '<style>.xpe-w{opacity:1!important}.xpe-fig span{transform:none!important}</style>' };
function Word({ p, a, b, children }) {
  const o = useTransform(p, [a, b], [0.16, 1]);
  return <motion.span className="xpe-w" style={{ opacity: o }}>{children} </motion.span>;
}
function Belief({ text }) {
  const ref = useRef(null);
  const calm = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.55'] });
  const words = text.split(' ');
  return (
    <p ref={ref} className="xpe-boiler">
      {calm ? text : words.map((w, i) => <Word key={i} p={scrollYProgress} a={i / words.length} b={(i + 1.5) / words.length}>{w}</Word>)}
    </p>
  );
}
/* A fact that settles into its place once, out of its own mask. */
function Fact({ v, k }) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.6 });
  return <div ref={ref}><dd className={'xpe-fig' + (seen ? ' in' : '')}><span>{v}</span></dd><dt className="vc-kick">{k}</dt></div>;
}

function About() {
  return (
    <section className="vc-sec xpe-about" aria-labelledby="xpe-about-h">
      <div className="vc-grid xpe-about-g">
        <div className="xpe-about-h">
          <MaskLines id="xpe-about-h" lines={['About Hanzo', 'AI, Inc.']} className="vc-headline" />
          <Copy text={BOILER} label="Copy boilerplate" className="xpe-icon" />
        </div>
        <noscript dangerouslySetInnerHTML={NOJS_W} />
        <Belief text={BOILER} />
        <dl className="xpe-facts">
          {FACTS.map(([v, k]) => <Fact key={k} v={v} k={k} />)}
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

/* The news index: big headlines; a card with the story's date and summary rides beside the row (300ms ease-out). */
function News() {
  const box = useRef(null);
  const [at, setAt] = useState(-1);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  // the card rides beside the row being pointed at, in the empty right of the index, never over a headline
  const place = (row) => {
    const r = box.current.getBoundingClientRect(), q = row.getBoundingClientRect();
    const t = { duration: 0.3, ease: [0, 0, 0.2, 1] };
    animate(x, r.width - 340 - 72, t);
    animate(y, q.top - r.top + 16, t);
  };
  return (
    <section className="vc-sec xpe-news" aria-labelledby="xpe-news-h">
      <div className="vc-grid xpe-news-g">
        <MaskLines id="xpe-news-h" lines={['Recent News']} className="vc-display s" />
        <p className="vc-lede xpe-news-l">Latest press releases and company announcements.</p>
      </div>
      <div className="vc-wrap xpe-news-w" ref={box} onPointerLeave={() => setAt(-1)}>
        <ol className={'xpe-feed' + (at >= 0 ? ' pointing' : '')}>
          {NEWS.map(([d, t, s], i) => (
            <li key={t} className={i === at ? 'on' : ''}>
              <A to="/blog" className="xpe-item" onPointerEnter={(e) => { if (e.pointerType === 'mouse') { place(e.currentTarget); setAt(i); } }} onFocus={() => setAt(i)} onBlur={() => setAt(-1)}>
                <span className="xpe-no vc-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <span className="xpe-ts vc-num">{d}</span>
                <span className="xpe-tt">{t}</span>
                <span className="xpe-ts2">{s}</span>
                <span className="xpe-go" aria-hidden="true">{ARROW}</span>
              </A>
            </li>
          ))}
        </ol>
        <motion.div className="xpe-card" aria-hidden="true" style={{ x, y }} initial={false}
          animate={at >= 0 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.92 }} transition={{ duration: 0.25, ease: EASE }}>
          {at >= 0 && <>
            <span className="vc-kick vc-num">{NEWS[at][0]}</span>
            <span className="xpe-card-s">{NEWS[at][2]}</span>
            <span className="xpe-card-g">{ARROW}</span>
          </>}
        </motion.div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section className="xpe-contact" data-room="dark" aria-labelledby="xpe-contact-h">
      <div className="vc-grid xpe-contact-g">
        <div className="xpe-contact-h">
          <h2 id="xpe-contact-h" className="vc-headline">Press Contact</h2>
          <p className="vc-lede">Get in touch with our media relations team.</p>
        </div>
        <div className="xpe-contact-m">
          <a href={MAIL} className="xpe-mail" data-cta="press.mail">press@hanzo.ai</a>
          <div className="xpe-mail-r">
            <h3 className="vc-kick">Media Inquiries</h3>
            <Copy text="press@hanzo.ai" label="Copy" className="xpe-icon dk" />
            <p className="xpe-tel vc-num">+1 (424) 335-0550</p>
          </div>
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
  return (
    <section className="vc-sec xpe-brand" aria-labelledby="xpe-brand-h">
      <div className="vc-grid xpe-brand-g">
        <div className="xpe-brand-h">
          <h2 id="xpe-brand-h" className="vc-headline">Brand Assets</h2>
          <p className="vc-body">Download logos and visual assets.</p>
          <Download className="xpe-cta q" data-cta="press.zip">Download Press Kit (ZIP)</Download>
        </div>
        <A to="/brand" className="xpe-guide">
          <span className="xpe-guide-p" aria-hidden="true"><Mark size={56} /></span>
          <span className="xpe-guide-t"><b>Brand Guidelines</b><span>View Brand Guidelines <i>{ARROW}</i></span></span>
        </A>
        <h3 className="vc-title xpe-h3">Partner Assets</h3>
        <ul className="xpe-partners">
          {PARTNERS.map(([n, f, l]) => (
            <li key={n}>
              <span className="xpe-p-img"><Pic src={f} alt={n} w={120} h={30} fallback={<span className="xpe-p-alt" aria-hidden="true"><Mark size={22} /></span>} /></span>
              <b>{n}</b>
              <a href={f} download>{l}<svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true"><path d="M8 2.5v8M4.5 7.5 8 11l3.5-3.5M3 13.5h10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

const SOCIAL = [['Discord', 'discord.gg/XthHQQj', 'https://discord.gg/XthHQQj'], ['X (Twitter)', '@hanzoai', 'https://x.com/hanzoai'], ['GitHub', '@hanzoai', 'https://github.com/hanzoai'], ['LinkedIn', 'hanzo-ai', 'https://linkedin.com/company/hanzo-ai'], ['Facebook', '@hanzoinc', 'https://facebook.com/hanzoinc'], ['Bluesky', '@hanzoai.bsky.social', 'https://bsky.app/profile/hanzoai.bsky.social'], ['Reddit', 'r/HanzoAI', 'https://www.reddit.com/r/HanzoAI/'], ['TikTok', '@hanzoinc', 'https://www.tiktok.com/@hanzoinc'], ['Instagram', '@hanzoinc', 'https://www.instagram.com/hanzoinc']];

function Social() {
  return (
    <section className="vc-sec tight xpe-social" aria-labelledby="xpe-soc-h">
      <div className="vc-grid xpe-soc-g">
        <div className="xpe-soc-h">
          <h2 id="xpe-soc-h" className="vc-headline">Connect With Us</h2>
          <p className="vc-body">Follow us on social media for the latest updates.</p>
        </div>
        <ul className="xpe-soc">
          {SOCIAL.map(([n, h, to]) => (
            <li key={n}><A to={to}><b>{n}</b><span className="vc-num">{h}</span><i aria-hidden="true"><svg viewBox="0 0 16 16" width="14" height="14"><path d="M5 11 11 5M6 5h5v5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></i></A></li>
          ))}
        </ul>
      </div>
    </section>
  );
}

const LEADS = [['/authors/antje-worring-portrait.jpg', 'Antje Worring'], ['/authors/zach-kelling-portrait.jpg', 'Zach Kelling']];

function Team() {
  return (
    <section className="xpe-team" aria-label="Leadership">
      <div className="vc-grid xpe-team-g">
        <div className="xpe-team-c">
          <MaskLines id="xpe-team-h" lines={['Meet our team']} className="vc-display m" />
          <p className="vc-lede">For executive bios and headshots, visit our team page or contact our press team.</p>
          <div className="xpe-acts">
            <a href={MAIL} className="xpe-cta" data-thumb="Contact Press Team" data-cta="press.bios">Request Executive Bios</a>
            <A to="https://hanzo.team" className="xpe-cta q" data-cta="press.team">View Team</A>
          </div>
        </div>
        <ul className="xpe-faces">
          {LEADS.map(([src, n], i) => (
            <li key={n} className={'f' + i}>
              <span className="xpe-face-f" aria-hidden="true"><Mark size={40} /></span>
              <Pic src={src} alt={n} w={600} h={750} fallback={<span className="x-sr">{n}</span>} />
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
      <Hero />
      <Kit />
      <About />
      <News />
      <Contact />
      <BrandAssets />
      <Social />
      <Team />
    </main>
  );
}
