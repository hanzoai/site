'use client';
/* Press. Its idea is the press room. The hero is the press kit itself: the three logo plates fanned out, shuffling to
   the front one after another, with the download one press away. Signature moment: the news as a wire — the feed
   prints itself line by line as it arrives, newest first. Around it, the boilerplate with a copy button, the contact
   card, partner assets with their downloads, and every channel. Every word and link is Hanzo's. */
import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { EASE, Rise, Copy, Mark } from '../ui';
import { A, SecHead } from '../kit';
import './Press.css';

const KIT = '/press/hanzo-press-kit.zip';
const PLATES = [['Logo - Dark Background', 'White logo for use on dark backgrounds', 'SVG, PNG', 'dark'], ['Logo - Light Background', 'Black logo for use on light backgrounds', 'SVG, PNG', 'light'], ['Icon Only', 'Standalone icon without wordmark', 'SVG, PNG, ICO', 'icon']];

function Plate({ kind }) {
  return (
    <span className={'xpe-plate ' + kind} aria-hidden="true">
      <Mark size={kind === 'icon' ? 64 : 40} />
      {kind !== 'icon' && <b>Hanzo</b>}
    </span>
  );
}

function Hero() {
  const [top, setTop] = useState(0);
  const [got, setGot] = useState(false);
  const calm = useReducedMotion();
  const ref = useRef(null);
  const live = useInView(ref, { amount: 0.3 });
  useEffect(() => {
    if (calm || !live) return;
    const t = setTimeout(() => setTop((v) => (v + 1) % 3), 2600);
    return () => clearTimeout(t);
  }, [top, calm, live]);
  const line = (t, d) => <span className="x-line"><motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: d }}>{t}</motion.span></span>;
  return (
    <section className="xpe-hero" ref={ref} aria-labelledby="xpe-h1">
      <div className="x-wrap xpe-hero-g">
        <div>
          <motion.p className="x-kick" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }}>Press &amp; Media</motion.p>
          <h1 id="xpe-h1" className="xpe-h1">{line('Press', 0.05)}{line('Resources.', 0.15)}</h1>
          <motion.p className="xpe-lede" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}>Press kit, brand assets, and who to email — for anyone writing about Hanzo AI, Inc.</motion.p>
          <motion.div className="xpe-acts" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.5 }}>
            <motion.a href={KIT} download className="x-btn solid xpe-dl" onClick={() => { setGot(true); setTimeout(() => setGot(false), 2200); }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
              <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true">{got ? <motion.path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.35 }} /> : <path d="M8 2.5v8M4.5 7.5 8 11l3.5-3.5M3 13.5h10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />}</svg>
              Download Press Kit
            </motion.a>
            <motion.a href="mailto:press@hanzo.ai" className="x-btn" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>Contact Press Team</motion.a>
          </motion.div>
        </div>
        <motion.div className="xpe-fan" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: EASE, delay: 0.25 }}>
          <div className="xpe-fan-s">
            {PLATES.map(([t, , , kind], i) => {
              const k = (i - top + 3) % 3;
              return (
                <motion.a key={kind} href={KIT} download className="xpe-fan-c" aria-label={'Download Press Kit: ' + t} tabIndex={k === 0 ? 0 : -1}
                  initial={false} animate={{ x: k * 46, y: k * -26, rotate: [-5, 3, 9][k], scale: 1 - k * 0.06, zIndex: 3 - k }} transition={{ type: 'spring', stiffness: 160, damping: 22 }} whileHover={k === 0 ? { y: -8, rotate: -3 } : undefined}>
                  <Plate kind={kind} />
                  <span className="xpe-fan-l">{t}</span>
                </motion.a>
              );
            })}
          </div>
          <p className="xpe-zip"><span className="x-mono">hanzo-press-kit.zip</span><span>SVG · PNG</span></p>
        </motion.div>
      </div>
    </section>
  );
}

function Kit() {
  return (
    <section className="xpe-kit">
      <div className="x-wrap">
        <ul className="xpe-plates">
          {PLATES.map(([t, d, f, kind], i) => (
            <Rise as="li" key={kind} delay={i * 0.08}>
              <a href={KIT} download className="xpe-kitc">
                <Plate kind={kind} />
                <span className="xpe-kitc-t"><h3>{t}</h3><span>{d}</span></span>
                <span className="xpe-fmt">{f.split(', ').map((x) => <i key={x}>{x}</i>)}<span className="x-sr">{f}</span></span>
              </a>
            </Rise>
          ))}
        </ul>
      </div>
    </section>
  );
}

const BOILER = 'Hanzo AI, Inc. is an AI technology company building the infrastructure for the next generation of intelligent applications. Founded in 2016 and headquartered in San Francisco, Hanzo is led by CEO Antje Worring and CTO Zach Kelling, providing AI platforms, developer tools, and cloud services to companies worldwide. Our mission is to make AI accessible, safe, and beneficial for everyone.';
const FACTS = [['2016', 'Founded'], ['San Francisco, CA', 'Headquarters'], ['Hanzo AI, Inc.', 'Entity'], ['Techstars ’17', 'Backing']];

function About() {
  return (
    <section className="x-sec xpe-about">
      <div className="x-wrap xpe-about-g">
        <div>
          <SecHead title="About Hanzo AI, Inc." />
          <Rise as="p" className="xpe-boiler">{BOILER}</Rise>
          <Rise className="xpe-copy" delay={0.1}><Copy text={BOILER} label="Copy boilerplate" /></Rise>
        </div>
        <dl className="xpe-facts">
          {FACTS.map(([v, k], i) => <Rise key={k} delay={i * 0.06}><dd>{v}</dd><dt>{k}</dt></Rise>)}
        </dl>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section className="xpe-contact">
      <div className="x-wrap">
        <div className="xpe-card">
          <div>
            <h2>Press Contact</h2>
            <p>Get in touch with our media relations team.</p>
          </div>
          <div className="xpe-card-c">
            <h3>Media Inquiries</h3>
            <p className="xpe-mail"><a href="mailto:press@hanzo.ai">press@hanzo.ai</a><Copy text="press@hanzo.ai" label="Copy" /></p>
            <p className="xpe-tel x-mono">+1 (424) 335-0550</p>
          </div>
          <div className="xpe-card-c">
            <h3>Headquarters</h3>
            <address>Hanzo AI, Inc.<br />1 Ferry Building<br />San Francisco, CA 94105<br />United States</address>
          </div>
        </div>
      </div>
    </section>
  );
}

const PARTNERS = [['Techstars', '/press/partners/techstars/techstars.png', 'Logo (PNG)'], ['NVIDIA', '/press/partners/nvidia/nvidia.svg', 'Logo (SVG)'], ['Google Cloud', '/press/partners/googlecloud/googlecloud.svg', 'Logo (SVG)'], ['AWS', '/press/partners/aws/aws.svg', 'Logo (SVG)'], ['DigitalOcean', '/press/partners/digitalocean/digitalocean.svg', 'Logo (SVG)'], ['Nebius', '/press/partners/nebius/nebius.svg', 'Logo (SVG)']];

function Brand() {
  return (
    <section className="x-sec xpe-brand">
      <div className="x-wrap">
        <div className="xpe-brand-h">
          <SecHead title="Brand Assets" lede="Download logos and visual assets." />
          <div className="xpe-brand-a">
            <A to="/brand" className="xpe-guide"><b>Brand Guidelines</b><span>View Brand Guidelines →</span></A>
            <a href={KIT} download className="x-btn solid">Download Press Kit (ZIP)</a>
          </div>
        </div>
        <h3 className="xpe-h3">Partner Assets</h3>
        <ul className="xpe-partners">
          {PARTNERS.map(([n, f, l], i) => (
            <Rise as="li" key={n} delay={(i % 3) * 0.06} y={16}>
              <span className="xpe-p-img"><img src={f} alt={n} loading="lazy" /></span>
              <b>{n}</b>
              <a href={f} download>{l}<svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true"><path d="M8 2.5v8M4.5 7.5 8 11l3.5-3.5M3 13.5h10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></a>
            </Rise>
          ))}
        </ul>
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

/* the wire: each item prints in, one after another, when the feed comes into view */
function Wire() {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.25 });
  return (
    <section className="x-sec xpe-wire" data-room="dark" ref={ref}>
      <div className="x-wrap">
        <div className="xpe-wire-h">
          <SecHead dark title="Recent News" lede="Latest press releases and company announcements." />
          <span className="xpe-live x-mono" aria-hidden="true"><i />Wire</span>
        </div>
        <ol className="xpe-feed">
          {NEWS.map(([d, t, s], i) => (
            <li key={t}>
              <A to="/blog" className="xpe-item">
                <motion.span className="xpe-ts x-mono" initial={{ opacity: 0 }} animate={seen ? { opacity: 1 } : {}} transition={{ duration: 0.3, delay: 0.2 + i * 0.45 }}>{d}</motion.span>
                <motion.span className="xpe-tt" initial={{ clipPath: 'inset(0 100% 0 0)' }} animate={seen ? { clipPath: 'inset(0 0% 0 0)' } : {}} transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1], delay: 0.3 + i * 0.45 }}>{t}</motion.span>
                <motion.span className="xpe-ts2" initial={{ opacity: 0, y: 6 }} animate={seen ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.75 + i * 0.45 }}>{s}</motion.span>
                <span className="xpe-go" aria-hidden="true">→</span>
              </A>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

const SOCIAL = [['Discord', 'discord.gg/XthHQQj', 'https://discord.gg/XthHQQj'], ['X (Twitter)', '@hanzoai', 'https://x.com/hanzoai'], ['GitHub', '@hanzoai', 'https://github.com/hanzoai'], ['LinkedIn', 'hanzo-ai', 'https://linkedin.com/company/hanzo-ai'], ['Facebook', '@hanzoinc', 'https://facebook.com/hanzoinc'], ['Bluesky', '@hanzoai.bsky.social', 'https://bsky.app/profile/hanzoai.bsky.social'], ['Reddit', 'r/HanzoAI', 'https://www.reddit.com/r/HanzoAI/'], ['TikTok', '@hanzoinc', 'https://www.tiktok.com/@hanzoinc'], ['Instagram', '@hanzoinc', 'https://www.instagram.com/hanzoinc']];

function Social() {
  return (
    <section className="x-sec xpe-social">
      <div className="x-wrap">
        <SecHead title="Connect With Us" lede="Follow us on social media for the latest updates." />
        <ul className="xpe-soc">
          {SOCIAL.map(([n, h, to], i) => (
            <Rise as="li" key={n} delay={(i % 3) * 0.05} y={14}>
              <A to={to}><b>{n}</b><span className="x-mono">{h}</span><i aria-hidden="true">↗</i></A>
            </Rise>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Team() {
  return (
    <section className="xpe-team">
      <div className="x-wrap">
        <div className="xpe-team-c">
          <div>
            <p className="x-kick">Leadership</p>
            <h2>Meet our team</h2>
            <p>For executive bios and headshots, visit our team page or contact our press team.</p>
          </div>
          <div className="xpe-team-a">
            <A to="https://hanzo.team" className="x-btn solid">View Team</A>
            <a href="mailto:press@hanzo.ai" className="x-btn">Request Executive Bios</a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Press() {
  return (
    <main className="xpe">
      <Hero />
      <Kit />
      <About />
      <Contact />
      <Brand />
      <Wire />
      <Social />
      <Team />
    </main>
  );
}
