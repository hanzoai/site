'use client';
/* DNS.
   V2: 8/10 Launch page on the deck: a 52px title beside the zone as code (the one big thing: the command types itself by CSS at first paint, then each record lands in the zone file as a diff and a query walks its path to the provider and back, pausable); six pinned chapters each draw one capability; the architecture in the one graphite room; use cases; the plans answer "What do you need?"; a quiet close with Hanzo's agent prompt.
   Persona: Platform / infrastructure engineer who runs DNS across several providers.
   Goal: start Hanzo DNS (try it; teams talk to sales about a plan).
   CTA: "Try Hanzo" → /login (data-cta dns.hero, data-thumb); "GitHub" → github.com/hanzoai (dns.hero-2, text link);
   plan asks "Talk to us" / "Contact Sales" → /contact-sales (dns.plan-<name>, one solid: the ink plan); "Deploy to
   Cloud" → platform.hanzo.ai/deploy (dns.close). Metric: api_key_created (proxy on this page: the dns.hero click).
   Signature: DNS as code. The hero is the zone itself: the CLI writes a record, the new line lands in the zone file as
   a diff, and a query for that name then travels its path (resolver, Hanzo DNS, the provider that holds the zone) and
   comes back with the answer; the next record follows, through each of the five providers in turn.
   Supporting: six pinned chapters whose pictures rise in from below (providers round one API, a query fanned out in
   parallel, the CLI lit a step at a time, the API in a pipeline, the DNSSEC key turning, CoreDNS with Hanzo plugins),
   and packets crossing the control plane in the graphite room (with its own pause).
   Use cases: each row carries a small live picture of a scene the page already draws (the CLI writing records, the
   providers round one API, many zones).
   Entrances (docs/MOTION-MAP.md, arrive.js arms them below the fold): domino (the use-case rows), swing-door (What do
   you need?), drop-in (the plans), invert-flash ("Get DNS").
   Motion kinds: idle (the zone cycle, packets), time (the command typing, the path walk), state (needs light a plan),
   arrival (title cut-in), scroll (the chapters, the Stage settle, the room opening).
   Beyond: "What do you need?" - press the needs you have (unlimited zones, DNSSEC, role-based access, Edge DNS...) and
   the lightest plan whose own list covers them becomes the ink tile while the plans that fall short step back.
   Every word and link is Hanzo's; names and addresses in the zone are documentation examples (example.com, 192.0.2.0/24). */
import type { MotionValue } from 'motion/react';
import type { SceneProps } from './scene';
import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useMotionValue, useTransform } from 'motion/react';
import { EASE, useCalm } from '../../ui';
import { Cta, CodeBlock } from '../../kit';
import KeynoteStage, { useStagePause } from './SafeStage';
import KeynoteChapters from '../../v2/KeynoteChapters';
import KeynoteClose, { Room as KeynoteRoom } from './SafeClose';
import { useArrivals } from './arrive';
import KeynoteLines from '../../v2/KeynoteLines';
import './Dns.css';

const PROVIDERS = ['Cloudflare', 'Route53', 'CoreDNS', 'GoDaddy', 'DigitalOcean'];

/* [ref, live, calm]: live while the element is on screen and motion is allowed */
function useSeen<T extends HTMLElement = HTMLDivElement>(amount = 0.25) {
  const ref = useRef<T>(null);
  const seen = useInView(ref, { amount });
  const calm = useCalm();
  return [ref, seen && !calm, calm] as const;
}
/* calls fn every ms while run is true: a chain of timeouts (no setInterval), the latest fn each time */
function useTick(ms: number, run: boolean, fn: () => void) {
  const f = useRef(fn);
  f.current = fn;
  useEffect(() => {
    if (!run) return;
    let t: ReturnType<typeof setTimeout> | 0 = 0;
    const next = () => { t = setTimeout(() => { f.current(); next(); }, ms); };
    next();
    return () => clearTimeout(t);
  }, [ms, run]);
}

/* ---------- the hero: a record lands as a diff, then a query resolves along its path ---------- */
const ZONE = [['@', 'A', '192.0.2.10'], ['www', 'CNAME', 'example.com.']];
const RECS = [['api', 'A', '192.0.2.24'], ['docs', 'CNAME', 'example.com.'], ['mail', 'A', '192.0.2.31'], ['edge', 'A', '192.0.2.47'], ['status', 'CNAME', 'example.com.']];
const PH = 10; // beats per record: 0 command, 1 the diff lands, 2-5 the query walks its path, 6 the answer, 7-9 hold

function Zone() {
  const [ref, live, calm] = useSeen(0.25);
  const paused = useStagePause();
  const [k, setK] = useState(0);
  useTick(520, live && !paused, () => setK((v) => v + 1));
  const r = calm ? 0 : Math.floor(k / PH) % RECS.length;
  const s = calm ? PH - 1 : k % PH;
  const [name, type, val] = RECS[r];
  const prov = PROVIDERS[r % PROVIDERS.length];
  const PATH = [['query', name + '.example.com'], ['resolver', ''], ['Hanzo DNS', 'Record Manager'], [prov, 'zone example.com']];
  const reach = s - 2; // the last node reached
  return (
    <div className="kn-obj ink dn-zone" ref={ref}>
      <div className="dn-bar"><i /><i /><i /><span>example.com</span><em>DNS as code</em></div>
      <p className="dn-cmd"><b>$</b><span className="dn-type">hanzo dns zones records create example.com<i className="dn-caret" aria-hidden="true" /></span></p>
      <div className="dn-zone-b">
        <div className="dn-file" aria-hidden="true">
          <p className="dn-file-h">$ORIGIN example.com.</p>
          {ZONE.map(([n, t, v]) => <p key={n} className="dn-rr"><span className="g"> </span><b>{n}</b><em>{t}</em><span>{v}</span></p>)}
          {RECS.slice(0, r).map(([n, t, v]) => <p key={n} className="dn-rr"><span className="g"> </span><b>{n}</b><em>{t}</em><span>{v}</span></p>)}
          <p key={'add' + r} className={'dn-rr add' + (s >= 1 ? ' in' : '')}><span className="g">+</span><b>{name}</b><em>{type}</em><span>{val}</span></p>
          {/* the rows still to come keep their place, so the file never grows and nothing below it moves */}
          {RECS.slice(r + 1).map(([n]) => <p key={'r' + n} className="dn-rr dn-rr-wait"><span className="g"> </span><b>{n}</b></p>)}
        </div>
        <div className="dn-path" aria-hidden="true">
          <div className="dn-nodes">
            <span className="dn-rail"><i style={{ transform: `scaleY(${Math.max(0, Math.min(1, reach / 3))})` }} /></span>
            {PATH.map(([t, d], i) => (
              <div key={i} className={'dn-node' + (reach >= i ? ' on' : '') + (reach === i ? ' now' : '')}>
                <i />
                <p><b>{t}</b>{d && <span>{d}</span>}</p>
              </div>
            ))}
          </div>
          <div className={'dn-ans' + (s >= 6 ? ' in' : '')}>
            <span>answer</span><b>{name}.example.com.</b><em>{type}</em><b>{val}</b>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- chapters: one capability per screen ---------- */
/* which of n steps a chapter is on: from the scroll through it on desktop (p); on phones it steps through once while
   seen and rests on the last step (no loop) */
function useStepOf(p: MotionValue<number> | null | undefined, n: number, on: boolean) {
  const [k, setK] = useState(0);
  const calm = useCalm();
  useEffect(() => {
    if (!p) return;
    const f = (v: number) => setK(Math.min(n - 1, Math.max(0, Math.floor(v * n))));
    f(p.get());
    return p.on('change', f);
  }, [p, n]);
  useEffect(() => {
    if (p) return;
    if (calm) { setK(n - 1); return; }
    if (!on || k >= n - 1) return;
    const t = setTimeout(() => setK((x) => Math.min(n - 1, x + 1)), 1400);
    return () => clearTimeout(t);
  }, [p, n, on, calm, k]);
  return k;
}

/* 01: five providers round one API, lit one by one */
function ProvidersScene({ p, on }: SceneProps) {
  const k = useStepOf(p, PROVIDERS.length, on);
  const calm = useCalm();
  return (
    <div className="kn-obj dn-sc dn-sc-prov">
      <div className="dn-ring">
        <svg className="dn-spokes" viewBox="0 0 400 400" aria-hidden="true">
          <circle cx="200" cy="200" r="150" className="orbit" />
          {PROVIDERS.map((pv, i) => {
            const a = -Math.PI / 2 + (i / PROVIDERS.length) * Math.PI * 2;
            return <motion.line key={pv} x1="200" y1="200" x2={200 + Math.cos(a) * 150} y2={200 + Math.sin(a) * 150} className={k === i ? 'on' : ''} initial={calm ? false : { pathLength: 0 }} animate={on ? { pathLength: 1 } : undefined} transition={{ duration: 0.9, ease: EASE, delay: i * 0.06 }} />;
          })}
        </svg>
        <div className="dn-hub"><b>One API</b><span>/v1/dns</span></div>
        {PROVIDERS.map((pv, i) => {
          const a = -Math.PI / 2 + (i / PROVIDERS.length) * Math.PI * 2;
          return <span key={pv} className={'dn-pv' + (k === i ? ' on' : '')} style={{ left: 50 + Math.cos(a) * 37.5 + '%', top: 50 + Math.sin(a) * 37.5 + '%' }}>{pv}</span>;
        })}
      </div>
    </div>
  );
}

/* 02: one query to every provider at once, merged into one view */
const LAT = [0.42, 0.7, 0.3, 0.86, 0.56];
function ParallelScene({ p, on }: SceneProps) {
  const k = useStepOf(p, 3, on);
  return (
    <div className="kn-obj dn-sc dn-sc-par" data-k={k}>
      <p className="kn-kick dn-sc-k">Parallel Queries</p>
      <div className="dn-par">
        <div className="dn-par-q"><b>example.com</b></div>
        <ul className="dn-par-l">
          {PROVIDERS.map((pv, i) => <li key={pv}><span>{pv}</span><i><b style={{ '--dn-w': LAT[i] }} /></i></li>)}
        </ul>
      </div>
      <div className="dn-merge">
        <p className="dn-merge-h"><b>one view</b><span>all providers</span></p>
        {[...ZONE, RECS[0]].map(([n, t, v], i) => <p key={n} className="dn-rr" style={{ '--dn-i': i }}><b>{n}</b><em>{t}</em><span>{v}</span></p>)}
      </div>
    </div>
  );
}

/* 03: the CLI, in the kit's CodeBlock, lit a step at a time */
const CLI = [
  ['# Install the Hanzo CLI', 'curl -fsSL https://hanzo.sh | sh'],
  ['# Every zone your org owns, whichever provider holds it', 'hanzo dns zones list'],
  ["# One zone's records", 'hanzo dns zones records list example.com'],
  ['# Add a record to that zone', 'hanzo dns zones records create example.com'],
  ['# Push a set of zones and records in one call', 'hanzo dns sync'],
  ['# Ask the control plane whether it is answering', 'hanzo dns health'],
];
const CLI_CODE = CLI.map(([c, x]) => c + '\n' + x).join('\n');
function CliScene({ p, on }: SceneProps) {
  const k = useStepOf(p, CLI.length, on);
  return (
    <div className="dn-sc dn-sc-cli" data-k={k}>
      <CodeBlock code={CLI_CODE} label="terminal" />
    </div>
  );
}

/* 04: the REST API inside a pipeline */
function ApiScene({ p, on }: SceneProps) {
  const k = useStepOf(p, 4, on);
  const S = [['CI/CD', 'pipelines'], ['REST API', '/v1/dns'], ['Record Manager', 'Hanzo DNS Control Plane'], ['example.com', 'infrastructure code']];
  return (
    <div className="kn-obj dn-sc dn-sc-api">
      <p className="kn-kick dn-sc-k">API First</p>
      <ol className="dn-pipe">
        {S.map(([t, d], i) => <li key={t} className={i <= k ? 'on' : ''}><i>{String(i + 1).padStart(2, '0')}</i><b>{t}</b><span>{d}</span></li>)}
      </ol>
    </div>
  );
}

/* 05: DNSSEC, the signing key turning on its rotation schedule (scrubbed by the scroll; on phones it turns once) */
function DnssecScene({ p, on }: SceneProps) {
  const calm = useCalm();
  const zero = useMotionValue(0);
  const turn = useTransform(p || zero, [0, 1], [0, 300]);
  return (
    <div className="kn-obj dn-sc dn-sc-sec">
      <p className="kn-kick dn-sc-k">DNSSEC</p>
      <div className={'dn-dial' + (!p && on && !calm ? ' spin' : '')}>
        <svg viewBox="0 0 200 200" aria-hidden="true">
          <circle cx="100" cy="100" r="86" className="t" />
          {Array.from({ length: 12 }, (_, i) => <line key={i} x1="100" y1="10" x2="100" y2={i % 3 ? 18 : 24} transform={`rotate(${i * 30} 100 100)`} />)}
        </svg>
        <motion.span className="dn-key" style={p && !calm ? { rotate: turn } : undefined} aria-hidden="true">
          <i><svg viewBox="0 0 24 24" width="22" height="22"><circle cx="8" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M12 12h9M18 12v3M21 12v2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></i>
        </motion.span>
        <div className="dn-dial-c"><b>example.com</b><span>signing · key rotation</span></div>
      </div>
      <div className="dn-threats"><span>spoofing</span><span>cache poisoning</span></div>
    </div>
  );
}

/* 06: CoreDNS at the edge, Hanzo plugins stacked on it */
function EdgeScene({ p, on }: SceneProps) {
  const k = useStepOf(p, 4, on);
  return (
    <div className="kn-obj dn-sc dn-sc-edge">
      <p className="kn-kick dn-sc-k">Edge DNS</p>
      <div className="dn-stack">
        {['custom middleware', 'advanced routing logic', 'Hanzo plugins'].map((t, i) => <span key={t} className={'dn-layer' + (k > 2 - i ? ' on' : '')} style={{ '--dn-i': i }}>{t}</span>)}
        <span className="dn-layer base on">CoreDNS</span>
      </div>
      <p className="dn-edge-f"><i />Low-latency resolution</p>
    </div>
  );
}

const SCENES = [ProvidersScene, ParallelScene, CliScene, ApiScene, DnssecScene, EdgeScene];
const FEATS = [
  ['Multi-Provider', 'Unified API across Cloudflare, CoreDNS, Route53, GoDaddy, and DigitalOcean. Manage all your DNS from one interface.'],
  ['Parallel Queries', 'Query all providers simultaneously and merge results. Get a unified view of your DNS records across every provider.'],
  ['CLI Native', 'Full CLI control with hanzo dns zones list, hanzo dns zones records create, and more. Script and automate your DNS workflows natively.'],
  ['API First', 'REST API for programmatic DNS management. Integrate DNS operations into your CI/CD pipelines and infrastructure code.'],
  ['DNSSEC', 'Built-in DNSSEC signing and automatic key rotation. Protect your domains from spoofing and cache poisoning attacks.'],
  ['Edge DNS', 'CoreDNS at the edge with Hanzo plugins. Low-latency resolution with custom middleware for advanced routing logic.'],
];

/* ---------- the graphite room: where Hanzo DNS sits ---------- */
const COLS: [string, string[]][] = [
  ['Your Applications', ['CI/CD', 'CLI', 'REST API']],
  ['Hanzo DNS Control Plane', ['Record Manager', 'DNSSEC Engine', 'Parallel Query', 'Audit Log']],
  ['DNS Providers', ['Cloudflare', 'Route53', 'CoreDNS', 'GoDaddy', 'DigitalOcean', '+ More']],
];
interface PauseIconProps {
  paused: boolean;
}
const PauseIcon = ({ paused }: PauseIconProps) => (paused
  ? <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M4.5 3v10l8.5-5z" fill="currentColor" /></svg>
  : <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><rect x="4" y="3" width="2.6" height="10" rx="1" fill="currentColor" /><rect x="9.4" y="3" width="2.6" height="10" rx="1" fill="currentColor" /></svg>);
function Arch() {
  const [paused, setPaused] = useState(false);
  return (
    <KeynoteRoom className="kn-sec dn-arch">
      <div className="kn-wrap">
        <div className="kn-grid dn-arch-h">
          <KeynoteLines className="kn-headline dn-arch-t" lines={['Built for', 'Infrastructure Teams']} />
          <p className="kn-lede dn-arch-l">Hanzo DNS sits between your applications and DNS providers, giving you a single control plane for all DNS operations.</p>
        </div>
        <div className="dn-flow-w" data-paused={paused ? '' : undefined}>
          <button type="button" className="kn-pause dn-pause" aria-pressed={paused} aria-label="Pause" onClick={() => setPaused((v) => !v)}><PauseIcon paused={paused} /></button>
          <div className="dn-flow">
            {COLS.map(([h, items], c) => (
              <div key={h} className={'dn-col c' + c}>
                <p className="dn-col-h">{h}</p>
                <ul>{items.map((t) => <li key={t}>{t}</li>)}</ul>
              </div>
            ))}
            {[0, 1].map((w) => <div key={w} className={'dn-wire w' + w} aria-hidden="true">{[0, 1, 2].map((i) => <b key={i} style={{ animationDelay: w * 0.35 + i * 0.7 + 's' }} />)}</div>)}
          </div>
        </div>
        <ul className="dn-checks">
          {['Provider-agnostic record management with automatic conflict resolution', 'Audit logging for every DNS change with rollback support', 'Sub-second propagation checks across global resolvers', 'DNSSEC key management with automated rotation schedules'].map((t) => (
            <li key={t}><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>{t}</li>
          ))}
        </ul>
      </div>
    </KeynoteRoom>
  );
}

/* ---------- use cases ---------- */
const USES = [
  ['DevOps Automation', 'Automate DNS record management as part of your deployment pipeline. Create, update, and clean up records programmatically.'],
  ['Multi-Cloud DNS', 'Manage DNS across AWS, Cloudflare, and DigitalOcean from a single API. No more switching consoles.'],
  ['Domain Portfolio Management', 'Manage hundreds of domains across multiple registrars and DNS providers from one unified interface.'],
];

/* each use case is a scene the page already draws, small: the CLI writing records, the providers round one API, many
   zones lighting a few at a time. They play while the row is seen (reduced motion: their last frame). */
interface UseArtProps {
  k: number;
  on: boolean;
}
function UseArt({ k, on }: UseArtProps) {
  if (k === 0) return (
    <span className="dn-ua dn-ua-cli" data-on={on ? '' : undefined}>
      <span className="dn-ua-cmd"><b>$</b><i /></span>
      {[0, 1, 2].map((j) => <span key={j} className="dn-ua-rr" style={{ '--j': j }}><b>+</b><i /><i /></span>)}
    </span>
  );
  if (k === 1) return (
    <span className="dn-ua dn-ua-ring" data-on={on ? '' : undefined}>
      <svg viewBox="0 0 168 104">
        {[[30, 22], [138, 22], [84, 92]].map(([x, y], j) => <line key={j} x1="84" y1="52" x2={x} y2={y} style={{ '--j': j }} />)}
      </svg>
      {[[30, 22], [138, 22], [84, 92]].map(([x, y], j) => <i key={j} style={{ left: x / 1.68 + '%', top: y / 1.04 + '%', '--j': j }} />)}
      <b />
    </span>
  );
  return (
    <span className="dn-ua dn-ua-zones" data-on={on ? '' : undefined}>
      {Array.from({ length: 24 }, (_, j) => <i key={j} style={{ '--j': (j * 7) % 24 }} />)}
    </span>
  );
}
interface UseProps {
  i: number;
  t: string;
  d: string;
}
function Use({ i, t, d }: UseProps) {
  const ref = useRef<HTMLLIElement>(null);
  const seen = useInView(ref, { amount: 0.6 });
  const calm = useCalm();
  return (
    <li ref={ref} style={{ '--k': i }}>
      <span className="kn-fig">{String(i + 1).padStart(2, '0')}</span>
      <h3 className="dn-h3">{t}</h3>
      <p>{d}</p>
      <UseArt k={i} on={seen && !calm} />
    </li>
  );
}

/* ---------- pricing, with Beyond: what do you need? ---------- */
/* name, what it is for, what it covers, the ask, whether it is the popular one, whether it bills monthly */
const PLANS: [string, string, string[], string, boolean?, boolean?][] = [
  ['Starter', 'Usage-based pricing for getting started', ['Up to 5 zones', '2 DNS providers', 'CLI and API access', 'Volume-based query pricing'], 'Talk to us', false, false],
  ['Pro', 'For teams managing production DNS', ['Unlimited zones', 'All DNS providers', 'DNSSEC management', 'Audit logging', 'Priority support'], 'Talk to us', true, true],
  ['Team', 'For teams with shared DNS management', ['Everything in Pro', 'Team collaboration', 'Role-based access', 'Shared audit log', 'Priority support'], 'Talk to us', false, true],
  ['Enterprise', 'For organizations with advanced needs', ['Everything in Team', 'Edge DNS (CoreDNS)', 'Custom plugins', 'SLA guarantee', 'Dedicated support'], 'Contact Sales', false, true],
];
// each need is a line from a plan's own list, word for word; the number is the first plan (index into PLANS) that carries it
const NEEDS: [string, number][] = [['Unlimited zones', 1], ['All DNS providers', 1], ['DNSSEC management', 1], ['Audit logging', 1], ['Team collaboration', 2], ['Role-based access', 2], ['Edge DNS (CoreDNS)', 3], ['Custom plugins', 3], ['SLA guarantee', 3]];
const Down = () => <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M8 3v9M4.5 8.5 8 12l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;

function Pricing() {
  const [need, setNeed] = useState<number[]>([]);
  const fit = Math.max(0, ...need.map((i) => NEEDS[i][1]));
  // the ink tile (and the one solid ask among the plans): the plan that fits, or Hanzo's "Popular" one
  const ink = need.length ? fit : PLANS.findIndex((x) => x[4]);
  const pick = (i: number) => setNeed((n) => (n.includes(i) ? n.filter((x) => x !== i) : [...n, i]));
  return (
    <section className="kn-sec dn-price">
      <div className="kn-wrap">
        <div className="kn-grid dn-price-h">
          <div className="dn-price-t">
            <KeynoteLines className="kn-headline" lines={['Start free.', 'Scale as you grow.']} />
            <p className="kn-kick">Pricing</p>
          </div>
          <div className="dn-fit" data-enter="swing">
            <p className="dn-fit-h">What do you need?</p>
            <div className="dn-fit-chips" role="group" aria-label="What do you need?">
              {NEEDS.map(([t], i) => <button key={t} type="button" data-sound="tick" aria-pressed={need.includes(i)} onClick={() => pick(i)}>{t}</button>)}
            </div>
            <p className="dn-fit-a" aria-live="polite">{need.length ? <><Down /><b>{PLANS[fit][0]}</b></> : null}</p>
          </div>
        </div>
        <div className={'dn-plans' + (need.length ? ' picking' : '')} data-enter="drop">
          {PLANS.map(([n, d, pts, cta, pop, month], i) => (
            <div key={n} className={'dn-plan' + (i === ink ? ' ink' : '') + (need.length && i < fit ? ' short' : '')}>
              <div className="dn-plan-top">
                <h3 className="kn-title">{n}</h3>
                {pop && <span className="dn-pop">Popular</span>}
              </div>
              <p className="dn-plan-p kn-fig">Custom{month && <span>/month</span>}</p>
              <p className="dn-plan-d">{d}</p>
              <ul>{pts.map((pt) => <li key={pt}><svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>{pt}</li>)}</ul>
              <Cta to="/contact-sales" kind={i === ink ? 'solid' : 'quiet'} id={'dns.plan-' + n.toLowerCase()}>{cta}</Cta>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Dns() {
  const root = useRef<HTMLElement>(null);
  useArrivals(root);
  return (
    <main className="kn dn" ref={root}>
      <KeynoteStage
        look="side"
        kick="Programmable DNS Infrastructure"
        title={['Hanzo', 'DNS']}
        lede="One API for Cloudflare, CoreDNS, Route53, and more."
        acts={[['Try Hanzo', '/login'], ['GitHub', 'https://github.com/hanzoai']]}
        cta="dns.hero"
        from={1.06}
      >
        <Zone />
      </KeynoteStage>

      <KeynoteChapters
        className="dn-ch"
        head={(
          <div className="kn-grid dn-ch-head">
            <KeynoteLines className="kn-headline dn-ch-t" lines={['One API.', 'Every Provider.']} />
            <p className="kn-lede dn-ch-l">Stop juggling provider consoles. Every zone you own, in one place.</p>
          </div>
        )}
        items={FEATS.map(([t, d]) => ({ title: t, body: <p>{d}</p> }))}
        visual={(i, on, p) => { const S = SCENES[i]; return <S on={on} p={p} />; }}
        swap="rise"
        side="right"
        count
      />

      <Arch />

      <section className="kn-sec dn-uses">
        <div className="kn-wrap kn-grid dn-uses-g">
          <div className="dn-uses-t">
            <KeynoteLines className="kn-headline" lines="From startups to enterprise, Hanzo DNS scales with your infrastructure" />
            <p className="kn-kick">Use Cases</p>
          </div>
          <ol className="dn-uses-l" data-enter="domino">
            {USES.map(([t, d], i) => <Use key={t} i={i} t={t} d={d} />)}
          </ol>
        </div>
      </section>

      <Pricing />

      <KeynoteClose
        light
        enter="flash"
        className="dn-close"
        name="DNS"
        tag="DNS as code"
        api="/v1/dns"
        cta="dns.close"
        prompt="Read https://hanzo.ai/skill.md and use Hanzo DNS in my project. Start with: hanzo dns zones list"
      />
    </main>
  );
}
