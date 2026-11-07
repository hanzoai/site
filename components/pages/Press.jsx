'use client';
/* /press. V2: 8/10 Editorial story: a masthead-size kinetic headline beside the press kit dealing its three plates; the
   plates as a still asymmetric spread; the boilerplate set like a magazine standfirst with the facts as big figures;
   the news as an index of huge headlines with a card that follows the pointer; press contact as the one dark room;
   partner assets, channels and leadership as quiet editorial lists. Accent: magenta.
   Signature: the news index. Six headlines set huge, one per line; point at one and the others step back while a
   card carrying its date and summary follows the pointer on a spring (osply / hamol); on phones the summary sits
   under its headline.
   Supporting (3): masked kinetic headlines, once; the press kit plates dealing themselves to the front; the download
   that turns into a drawn tick.
   Beyond: the boilerplate copies in one press, and the press email copies beside the dark room's address, so a
   writer leaves with both without retyping. Every word and link is Hanzo's. */
import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion, useSpring } from 'motion/react';
import { Copy, Mark } from '../ui';
import { A } from '../kit';
import MaskLines from './company/MaskLines';
import '../v2/vc-type.css';
import './Press.css';

const EASE = [0.16, 1, 0.3, 1];
const KIT = '/press/hanzo-press-kit.zip';
const PLATES = [['Logo - Dark Background', 'White logo for use on dark backgrounds', 'SVG, PNG', 'dark'], ['Logo - Light Background', 'Black logo for use on light backgrounds', 'SVG, PNG', 'light'], ['Icon Only', 'Standalone icon without wordmark', 'SVG, PNG, ICO', 'icon']];

function Plate({ kind, big }) {
  return (
    <span className={'xpe-plate ' + kind} aria-hidden="true">
      <Mark size={kind === 'icon' ? (big ? 120 : 72) : big ? 64 : 40} />
      {kind !== 'icon' && <b>Hanzo</b>}
    </span>
  );
}

/* a picture that steps aside when it cannot load, leaving its name */
function Img({ fallback = null, ...p }) {
  const [bad, setBad] = useState(false);
  const ref = useRef(null);
  useEffect(() => { const i = ref.current; if (i && i.complete && !i.naturalWidth) setBad(true); }, []);
  if (bad) return fallback;
  return <img ref={ref} {...p} onError={() => setBad(true)} />;
}

function Download({ className, children, ...rest }) {
  const [got, setGot] = useState(false);
  return (
    <motion.a href={KIT} download className={className} {...rest} onClick={() => { setGot(true); setTimeout(() => setGot(false), 2200); }} whileTap={{ scale: 0.97 }}>
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
  const calm = useReducedMotion();
  const ref = useRef(null);
  const live = useInView(ref, { amount: 0.3 });
  useEffect(() => {
    if (calm || !live) return;
    const t = setTimeout(() => setTop((v) => (v + 1) % 3), 2800);
    return () => clearTimeout(t);
  }, [top, calm, live]);
  return (
    <section className="xpe-hero vc-scene" ref={ref} aria-labelledby="xpe-h1">
      <div className="vc-grid xpe-hero-g">
        <div className="xpe-hero-c">
          <motion.p className="vc-kick acc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, ease: EASE }}>Press &amp; Media</motion.p>
          <MaskLines as="h1" id="xpe-h1" now delay={0.05} lines={['Press', 'Resources.']} className="vc-display xpe-h1" />
          <motion.div className="xpe-hero-f" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, ease: EASE, delay: 0.6 }}>
            <p className="vc-lede">Press kit, brand assets, and who to email — for anyone writing about Hanzo AI, Inc.</p>
            <div className="xpe-acts">
              <Download className="x-btn solid xpe-big" data-thumb="Download Press Kit">Download Press Kit</Download>
              <a href="mailto:press@hanzo.ai" className="x-btn xpe-big">Contact Press Team</a>
            </div>
          </motion.div>
        </div>
        <motion.div className="xpe-fan" initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.3, ease: EASE, delay: 0.25 }}>
          <div className="xpe-fan-s">
            {PLATES.map(([t, , , kind], i) => {
              const k = (i - top + 3) % 3;
              return (
                <motion.a key={kind} href={KIT} download className="xpe-fan-c" aria-label={'Download Press Kit: ' + t} tabIndex={k === 0 ? 0 : -1}
                  initial={false} animate={{ x: k * 30, y: k * -34, rotate: [-4, 2, 7][k], scale: 1 - k * 0.07, zIndex: 3 - k, opacity: 1 - k * 0.12 }}
                  transition={{ type: 'spring', stiffness: 170, damping: 24 }}>
                  <Plate kind={kind} big />
                  <span className="xpe-fan-l">{t}</span>
                </motion.a>
              );
            })}
          </div>
          <p className="xpe-zip"><span className="vc-num">hanzo-press-kit.zip</span><span>SVG · PNG</span></p>
        </motion.div>
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

function About() {
  return (
    <section className="vc-sec xpe-about" aria-labelledby="xpe-about-h">
      <div className="vc-grid xpe-about-g">
        <div className="xpe-about-h">
          <MaskLines id="xpe-about-h" lines={['About Hanzo', 'AI, Inc.']} className="vc-headline" />
          <Copy text={BOILER} label="Copy boilerplate" className="xpe-copyb" />
        </div>
        <p className="xpe-boiler">{BOILER}</p>
        <dl className="xpe-facts">
          {FACTS.map(([v, k]) => <div key={k}><dd>{v}</dd><dt className="vc-kick">{k}</dt></div>)}
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

/* The signature: huge headlines; a card with the story's date and summary follows the pointer on a spring. */
function News() {
  const box = useRef(null);
  const [at, setAt] = useState(-1);
  const x = useSpring(0, { stiffness: 300, damping: 30 });
  const y = useSpring(0, { stiffness: 300, damping: 30 });
  const move = (e) => {
    if (e.pointerType !== 'mouse') return;
    const r = box.current.getBoundingClientRect();
    x.set(e.clientX - r.left + 28);
    y.set(e.clientY - r.top - 40);
  };
  return (
    <section className="vc-sec xpe-news" aria-labelledby="xpe-news-h">
      <div className="vc-grid xpe-news-g">
        <MaskLines id="xpe-news-h" lines={['Recent News']} className="vc-display s" />
        <p className="vc-lede xpe-news-l">Latest press releases and company announcements.</p>
      </div>
      <div className="vc-wrap xpe-news-w" ref={box} onPointerMove={move} onPointerLeave={() => setAt(-1)}>
        <ol className={'xpe-feed' + (at >= 0 ? ' pointing' : '')}>
          {NEWS.map(([d, t, s], i) => (
            <li key={t} className={i === at ? 'on' : ''}>
              <A to="/blog" className="xpe-item" onPointerEnter={(e) => { if (e.pointerType === 'mouse') { move(e); setAt(i); } }} onFocus={() => setAt(i)} onBlur={() => setAt(-1)}>
                <span className="xpe-no vc-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <span className="xpe-ts vc-num">{d}</span>
                <span className="xpe-tt">{t}</span>
                <span className="xpe-ts2">{s}</span>
                <span className="xpe-go" aria-hidden="true">→</span>
              </A>
            </li>
          ))}
        </ol>
        <motion.div className="xpe-card" aria-hidden="true" style={{ x, y }} initial={false}
          animate={at >= 0 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.92 }} transition={{ duration: 0.25, ease: EASE }}>
          {at >= 0 && <>
            <span className="vc-kick acc vc-num">{NEWS[at][0]}</span>
            <span className="xpe-card-s">{NEWS[at][2]}</span>
            <span className="xpe-card-g">/blog →</span>
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
          <h2 id="xpe-contact-h" className="vc-kick">Press Contact</h2>
          <p className="vc-lede">Get in touch with our media relations team.</p>
        </div>
        <div className="xpe-contact-m">
          <h3 className="vc-kick acc">Media Inquiries</h3>
          <a href="mailto:press@hanzo.ai" className="xpe-mail">press@hanzo.ai</a>
          <div className="xpe-mail-r">
            <Copy text="press@hanzo.ai" label="Copy" className="xpe-copyd" />
            <p className="xpe-tel vc-num">+1 (424) 335-0550</p>
          </div>
        </div>
        <div className="xpe-contact-a">
          <h3 className="vc-kick">Headquarters</h3>
          <address>Hanzo AI, Inc.<br />1 Ferry Building<br />San Francisco, CA 94105<br />United States</address>
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
        </div>
        <div className="xpe-brand-a">
          <A to="/brand" className="xpe-guide"><b>Brand Guidelines</b><span>View Brand Guidelines →</span></A>
          <Download className="x-btn solid xpe-big">Download Press Kit (ZIP)</Download>
        </div>
        <h3 className="vc-kick xpe-h3">Partner Assets</h3>
        <ul className="xpe-partners">
          {PARTNERS.map(([n, f, l]) => (
            <li key={n}>
              <span className="xpe-p-img"><Img src={f} alt={n} loading="lazy" fallback={<span className="xpe-p-alt">{n}</span>} /></span>
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
            <li key={n}><A to={to}><b>{n}</b><span className="vc-num">{h}</span><i aria-hidden="true">↗</i></A></li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Team() {
  return (
    <section className="xpe-team" aria-labelledby="xpe-team-h">
      <div className="vc-grid xpe-team-g">
        <p className="vc-kick acc">Leadership</p>
        <MaskLines id="xpe-team-h" lines={['Meet our team']} className="vc-display m" />
        <p className="vc-lede xpe-team-l">For executive bios and headshots, visit our team page or contact our press team.</p>
        <div className="xpe-acts xpe-team-a">
          <A to="https://hanzo.team" className="x-btn solid xpe-big">View Team</A>
          <a href="mailto:press@hanzo.ai" className="x-btn xpe-big">Request Executive Bios</a>
        </div>
      </div>
    </section>
  );
}

export default function Press() {
  return (
    <main className="vc xpe" style={{ '--acc': '#db2777' }}>
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
