'use client';
/* DNS. Signature: a record propagating. One record is created through the one API, fans out to the five providers on
   the ring, and a check wave sweeps the global resolvers, each flipping to answered as it is reached. The CLI types
   itself line by line; the architecture runs as a live diagram with packets moving from your applications through the
   control plane to the providers; the plans sit on one row. Beyond: "What do you need?" - press the needs you have (more
   than 5 zones, DNSSEC, role-based access, Edge DNS...) and the lightest plan whose own list covers them lights up while
   the plans that fall short step back. Every word and link is Hanzo's. */
import { useState } from 'react';
import { motion } from 'motion/react';
import { EASE, Rise } from '../../ui';
import { A } from '../../kit';
import { Hero, Paste, Get, Head, useLive, useSteps } from './Frame';
import './Dns.css';

const PROVIDERS = ['Cloudflare', 'Route53', 'CoreDNS', 'GoDaddy', 'DigitalOcean'];
const rnd = (i) => { const x = Math.sin(i * 77.3) * 9137.1; return x - Math.floor(x); };
const RESOLVERS = Array.from({ length: 28 }, (_, i) => {
  const a = rnd(i) * Math.PI * 2, r = 0.42 + rnd(i + 40) * 0.5;
  return [50 + Math.cos(a) * r * 46, 50 + Math.sin(a) * r * 46, r];
});

function Propagate() {
  const [ref, live] = useLive(0.3);
  const [k] = useSteps(2, 3600, live);
  return (
    <div className="dn-radar" ref={ref} aria-hidden="true">
      <div className="dn-rings"><i /><i /><i /></div>
      {live && <span key={'w' + k} className="dn-wave" />}
      {RESOLVERS.map(([x, y, r], i) => (
        <span key={k + '-' + i} className={'dn-res' + (live ? ' go' : ' done')} style={{ left: x + '%', top: y + '%', animationDelay: (r * 1.6 + 0.5).toFixed(2) + 's' }} />
      ))}
      {PROVIDERS.map((p, i) => {
        const a = -Math.PI / 2 + (i / PROVIDERS.length) * Math.PI * 2;
        return (
          <span key={p} className="dn-prov" style={{ left: 50 + Math.cos(a) * 30 + '%', top: 50 + Math.sin(a) * 30 + '%' }}>
            <motion.i key={k} initial={{ scale: 0.6, opacity: 0.4 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.15 + i * 0.07, type: 'spring', stiffness: 300, damping: 18 }} />{p}
          </span>
        );
      })}
      <div className="dn-rec">
        <p className="dn-rec-k">hanzo dns zones records create</p>
        <p className="dn-rec-n">example.com</p>
        <p className="dn-rec-s"><b />propagation check</p>
      </div>
    </div>
  );
}

const CLI = [
  ['# Install the Hanzo CLI', 'curl -fsSL https://hanzo.sh | sh'],
  ['# Every zone your org owns, whichever provider holds it', 'hanzo dns zones list'],
  ["# One zone's records", 'hanzo dns zones records list example.com'],
  ['# Add a record to that zone', 'hanzo dns zones records create example.com'],
  ['# Push a set of zones and records in one call', 'hanzo dns sync'],
  ['# Ask the control plane whether it is answering', 'hanzo dns health'],
];

function Cli() {
  const [ref, live] = useLive(0.3);
  return (
    <section className="x-sec dn-cli" ref={ref}>
      <div className="x-wrap dn-cli-grid">
        <div className="dn-term">
          <div className="dn-term-bar"><i /><i /><i /><span>terminal</span></div>
          <pre><code>
            {CLI.map(([c, cmd], i) => (
              <span key={cmd} className={'dn-step' + (live ? ' on' : '')} style={{ '--d': i * 0.55 + 's' }}>
                <span className="dn-c">{c}</span>{'\n'}<span className="dn-cmd"><b>$</b> {cmd}</span>{'\n\n'}
              </span>
            ))}
          </code></pre>
        </div>
        <Paste name="DNS" api="/v1/dns" prompt="Read https://hanzo.ai/skill.md and use Hanzo DNS in my project. Start with: hanzo dns zones list" className="dn-paste" />
      </div>
    </section>
  );
}

const FEATS = [
  ['Multi-Provider', 'Unified API across Cloudflare, CoreDNS, Route53, GoDaddy, and DigitalOcean. Manage all your DNS from one interface.', 'Cloudflare · CoreDNS · Route53 · GoDaddy · DigitalOcean'],
  ['Parallel Queries', 'Query all providers simultaneously and merge results. Get a unified view of your DNS records across every provider.', 'all providers → one view'],
  ['CLI Native', 'Full CLI control with hanzo dns zones list, hanzo dns zones records create, and more. Script and automate your DNS workflows natively.', '$ hanzo dns zones list'],
  ['API First', 'REST API for programmatic DNS management. Integrate DNS operations into your CI/CD pipelines and infrastructure code.', '/v1/dns'],
  ['DNSSEC', 'Built-in DNSSEC signing and automatic key rotation. Protect your domains from spoofing and cache poisoning attacks.', 'signing · key rotation'],
  ['Edge DNS', 'CoreDNS at the edge with Hanzo plugins. Low-latency resolution with custom middleware for advanced routing logic.', 'CoreDNS + Hanzo plugins'],
];

function Feats() {
  const [at, setAt] = useState(-1);
  return (
    <section className="x-sec dn-feats">
      <div className="x-wrap">
        <Head title="One API. Every Provider." lede="Stop juggling provider consoles. Every zone you own, in one place." />
        <ul className="dn-rows" onMouseLeave={() => setAt(-1)}>
          {FEATS.map(([t, d, tag], i) => (
            <li key={t} className={at === i ? 'on' : ''} onMouseEnter={() => setAt(i)}>
              <h3>{t}</h3>
              <p>{d}</p>
              <span className="dn-tag" aria-hidden="true">{tag}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

const COLS = [
  ['Your Applications', ['CI/CD', 'CLI', 'REST API']],
  ['Hanzo DNS Control Plane', ['Record Manager', 'DNSSEC Engine', 'Parallel Query', 'Audit Log']],
  ['DNS Providers', ['Cloudflare', 'Route53', 'CoreDNS', 'GoDaddy', 'DigitalOcean', '+ More']],
];

function Arch() {
  return (
    <section className="x-sec dn-arch" data-room="dark">
      <div className="x-wrap">
        <div className="dn-arch-top">
          <Head dark title="Built for Infrastructure Teams" lede="Hanzo DNS sits between your applications and DNS providers, giving you a single control plane for all DNS operations." />
          <ul className="dn-checks">
            {['Provider-agnostic record management with automatic conflict resolution', 'Audit logging for every DNS change with rollback support', 'Sub-second propagation checks across global resolvers', 'DNSSEC key management with automated rotation schedules'].map((t, i) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
        <div className="dn-flow">
          {COLS.map(([h, items], c) => (
            <Rise key={h} className={'dn-col c' + c} delay={c * 0.1}>
              <p className="dn-col-h">{h}</p>
              <ul>{items.map((t) => <li key={t}>{t}</li>)}</ul>
            </Rise>
          ))}
          <div className="dn-wire w0" aria-hidden="true">{[0, 1, 2].map((i) => <b key={i} style={{ animationDelay: i * 0.6 + 's' }} />)}</div>
          <div className="dn-wire w1" aria-hidden="true">{[0, 1, 2].map((i) => <b key={i} style={{ animationDelay: 0.3 + i * 0.6 + 's' }} />)}</div>
        </div>
      </div>
    </section>
  );
}

const USES = [
  ['DevOps Automation', 'Automate DNS record management as part of your deployment pipeline. Create, update, and clean up records programmatically.'],
  ['Multi-Cloud DNS', 'Manage DNS across AWS, Cloudflare, and DigitalOcean from a single API. No more switching consoles.'],
  ['Domain Portfolio Management', 'Manage hundreds of domains across multiple registrars and DNS providers from one unified interface.'],
];

const PLANS = [
  ['Starter', 'Usage-based pricing for getting started', ['Up to 5 zones', '2 DNS providers', 'CLI and API access', 'Volume-based query pricing'], 'Talk to us', false, false],
  ['Pro', 'For teams managing production DNS', ['Unlimited zones', 'All DNS providers', 'DNSSEC management', 'Audit logging', 'Priority support'], 'Talk to us', true, true],
  ['Team', 'For teams with shared DNS management', ['Everything in Pro', 'Team collaboration', 'Role-based access', 'Shared audit log', 'Priority support'], 'Talk to us', false, true],
  ['Enterprise', 'For organizations with advanced needs', ['Everything in Team', 'Edge DNS (CoreDNS)', 'Custom plugins', 'SLA guarantee', 'Dedicated support'], 'Contact Sales', false, true],
];

// each need is a line from a plan's own list; the number is the first plan (index into PLANS) that carries it
const NEEDS = [['More than 5 zones', 1], ['More than 2 DNS providers', 1], ['DNSSEC management', 1], ['Audit logging', 1], ['Team collaboration', 2], ['Role-based access', 2], ['Edge DNS (CoreDNS)', 3], ['Custom plugins', 3], ['SLA guarantee', 3]];

function Pricing() {
  const [need, setNeed] = useState([]);
  const fit = Math.max(0, ...need.map((i) => NEEDS[i][1]));
  const pick = (i) => setNeed((n) => (n.includes(i) ? n.filter((x) => x !== i) : [...n, i]));
  return (
    <section className="x-sec dn-price">
      <div className="x-wrap">
        <div className="dn-uses">
          <Head kick="Use Cases" title="From startups to enterprise, Hanzo DNS scales with your infrastructure" />
          <ol>{USES.map(([t, d], i) => <li key={t}><span>{String(i + 1).padStart(2, '0')}</span><h3>{t}</h3><p>{d}</p></li>)}</ol>
        </div>
        <Head kick="Pricing" title="Start free. Scale as you grow." center />
        <div className="dn-fit">
          <p className="dn-fit-h">What do you need? <span aria-live="polite">{need.length ? <>Fits: <b>{PLANS[fit][0]}</b></> : 'Starter covers up to 5 zones and 2 DNS providers.'}</span></p>
          <div className="dn-fit-chips" role="group" aria-label="What you need">
            {NEEDS.map(([t], i) => <button key={t} type="button" aria-pressed={need.includes(i)} onClick={() => pick(i)}>{t}</button>)}
          </div>
          {need.length > 0 && <button type="button" className="dn-fit-x" onClick={() => setNeed([])}>Clear</button>}
        </div>
        <div className={'dn-plans' + (need.length ? ' picking' : '')}>
          {PLANS.map(([n, d, pts, cta, pop, month], i) => (
            <Rise key={n} className={'dn-plan' + (pop ? ' pop' : '') + (need.length && i === fit ? ' fit' : '') + (need.length && i < fit ? ' short' : '')} delay={i * 0.06}>
              {pop && <span className="dn-pop">Popular</span>}
              <h3>{n}</h3>
              <p className="dn-plan-p">Custom{month && <span>/month</span>}</p>
              <p className="dn-plan-d">{d}</p>
              <ul>{pts.map((p) => <li key={p}>{p}</li>)}</ul>
              <A to="/contact-sales" className={'x-btn' + (pop ? ' solid' : '')}>{cta}</A>
            </Rise>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Dns() {
  return (
    <main className="dn">
      <Hero
        kick="Programmable DNS Infrastructure"
        title="Hanzo DNS"
        sub="One API for Cloudflare, CoreDNS, Route53, and more."
        acts={[['Try Hanzo', '/login'], ['GitHub', 'https://github.com/hanzoai']]}
      >
        <Propagate />
      </Hero>
      <Cli />
      <Feats />
      <Arch />
      <Pricing />
      <Get name="DNS" tag="DNS as code" />
    </main>
  );
}
