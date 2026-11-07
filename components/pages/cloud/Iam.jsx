'use client';
// Persona: a developer wiring sign-in for an app or service on Hanzo.
// Goal: trust how hanzo.id issues and protects tokens.
// CTA: API reference (iam.hero, iam.close).
// Metric: cta_click iam.hero
// Signature: the sign-in, drawn: a line runs from hanzo.id through the authorization code, PKCE (S256) and the RS256 signature to the JWKS, and the token assembles as it goes.
// Beyond: the refresh family in the dark room: press the live token to refresh, press a spent one and the whole family is revoked.
/* IAM (v2, archetype A Launch).
   V2: 8/10 round 3: the hero is a line drawing of the sign-in (hanzo.id, Authorization code, PKCE · S256, RS256, JWKS), not KMS's numbered boxes; the eight facts pin for about two and a half screens, start and end centred, each with its own drawn object (stacked, every one reachable, on phones and under reduced motion); the refresh family is a press-the-token room that never changes height and enters as a rounded card opening to full width; every visible word is Hanzo's own; section heads rest at 26px; deck greys only, one ask.
   Signature: the sign-in, drawn. Five stations on one hairline, each lit as the line reaches it; under them the token's
   three parts fill in (the signature at RS256) and a tick lands at JWKS. The server paints the finished sign-in, so JS
   off and reduced motion show the whole line; within a second it starts over and runs by itself (pausable).
   Supporting: kinetic title lines; the eight facts as a pinned sideways rail where the card in the middle is the one lit
   and its object draws in; the stage recedes as the rail comes in; the dark room opens from a rounded card to full width.
   Beyond: the refresh family. Press the live refresh token and the next one is issued; press a spent one and the whole
   family is revoked, the sentence's own clause lighting up. Status is shape only (filled live, hollow spent, struck revoked).
   Greys only (Hanzo's deck). Every visible word and link is Hanzo's; controls carry Hanzo's terms or ui-strings as names.
   Persona: a developer wiring sign-in for an app or service on Hanzo.
   Goal: trust how hanzo.id issues and protects tokens (PKCE, single-use refresh, one tenancy per organization).
   CTA: API reference (hero, the sticky ask bar and the close; one solid button per screen). */
import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';
import { Cta } from '../../kit';
import { useLive } from './Frame';
import { Lines } from '../../v2/LiftStage';
import ShipPrompt from '../../v2/ShipPrompt';
import GetIt from '../../v2/GetIt';
import LivePause, { usePause } from '../../v2/LivePause';
import '../../v2/v2scale.css';
import './Iam.css';

/* the sign-in's stations, in Hanzo's words (hanzo.id; "Authorization code with PKCE, always S256"; "signed RS256 … the same JWKS") */
const STATIONS = ['hanzo.id', 'Authorization code', ['PKCE', 'S256'], 'RS256', 'JWKS'];
const ALL = STATIONS.length;
/* the line's caption, in Hanzo's own sentences, changing as the line reaches each part (index = stations lit) */
const SAY = [
  'Sign-in arrives from Google, from GitHub or from any OIDC issuer you name, and SCIM 2.0 keeps a directory in step.',
  'Authorization code with PKCE, always S256.',
  'Tokens are signed RS256, with ML-DSA-65 available per certificate and published in the same JWKS.',
];
const sayAt = (s) => (s <= 1 ? 0 : s <= 3 ? 1 : 2);
/* s: stations lit. The server paints the finished line (s = 5); then it starts over and runs. */
const BEAT = [1700, 520, 640, 640, 640, 640];

function SignIn() {
  const [ref, seen, calm] = useLive(0.3);
  const [paused, togglePause] = usePause();
  const live = seen && !paused && !calm;
  const [s, setS] = useState(ALL);
  const [first, setFirst] = useState(true);
  const card = useRef(null);
  useEffect(() => {
    if (!live) return;
    const ms = first ? 800 : BEAT[s];
    const id = setTimeout(() => { setFirst(false); setS((v) => (v >= ALL ? 0 : v + 1)); }, ms);
    return () => clearTimeout(id);
  }, [s, live, first]);
  useEffect(() => { if (calm) setS(ALL); }, [calm]);
  // a fine pointer tilts the card up to 2.5°; touch and reduced motion leave it flat
  const tilt = (e) => {
    const el = card.current;
    if (!el || calm || e.pointerType !== 'mouse') return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--ry', (((e.clientX - r.left) / r.width - 0.5) * 5).toFixed(2) + 'deg');
    el.style.setProperty('--rx', (((e.clientY - r.top) / r.height - 0.5) * -5).toFixed(2) + 'deg');
  };
  const flat = () => { const el = card.current; if (el) { el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg'); } };
  return (
    <div className="lp-host ia-host-wrap">
      <LivePause paused={paused} onToggle={togglePause} className="ia-pause" />
      <div className="ia-sign" ref={(el) => { ref.current = el; card.current = el; }} aria-hidden="true" onPointerMove={tilt} onPointerLeave={flat} data-s={s}>
        <ol className="ia-path">
          {STATIONS.map((t, i) => (
            <li key={i} className={'ia-st' + (i < s ? ' on' : '') + (i === s - 1 ? ' now' : '')}>
              {i > 0 && <i className="ia-seg"><i /></i>}
              <span className="ia-dot">{i === ALL - 1 && <svg viewBox="0 0 24 24" width="14" height="14"><path d="M6 12.5l4 4 8-9" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>}</span>
              <span className="ia-lab">{Array.isArray(t) ? t.map((w) => <span key={w} className="ia-w">{w}</span>) : t}</span>
            </li>
          ))}
        </ol>
        <p className="ia-say"><span key={sayAt(s)}>{SAY[sayAt(s)]}</span></p>
      </div>
    </div>
  );
}

/* the stage settles back and lifts away as the rail comes in: scale 1 to .94, up 40px; the server paints it at rest */
function Recede({ children }) {
  const ref = useRef(null); // reduced motion: the CSS holds it at rest, so the server and client render the same
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.1', 'end start'] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -40]);
  return (
    <div ref={ref} className="ia-stage">
      <motion.div className="ia-recede" style={{ scale, y, transformOrigin: '50% 0%' }}>{children}</motion.div>
    </div>
  );
}

const FACTS = [
  ['PKCE', 'Authorization code with PKCE, always S256.', 'S256'],
  ['Passwords', 'The passwords that do exist are argon2id digests, and a scheme IAM does not recognize fails closed.', 'argon2id'],
  ['Refresh tokens', 'Refresh tokens are single-use and kept only as a hash. Presenting a spent one revokes the whole family, so a stolen token cannot outlive its session.', 'single-use'],
  ['A second factor', 'A second factor is an authenticator app, a code by SMS or email, or a passkey. Adding or dropping one signs the account out of every other browser.', 'passkey'],
  ['Federation', 'Sign-in arrives from Google, from GitHub or from any OIDC issuer you name, and SCIM 2.0 keeps a directory in step.', 'SCIM 2.0'],
  ['Signing keys', 'Tokens are signed RS256, with ML-DSA-65 available per certificate and published in the same JWKS.', 'RS256'],
  ['Organizations', 'Every organization is a tenancy boundary, and membership travels in the token.', 'tenancy boundary'],
  ['Authorization', 'What you may reach once signed in is Authz’s to decide, reading the same token.', 'Authz'],
];

/* each fact's own drawn object (no words): the S256 hash of a verifier, a gate that fails closed, a refresh chain with a
   struck link, a device and a key, three issuers meeting in one, two keys in one set, organizations as boundaries, a
   token reaching a gate. Lines draw in while the card is the lit one. */
const OBJ = [
  ['M4 28h34', 'M46 28a10 10 0 1 0 20 0a10 10 0 1 0 -20 0', 'M66 28h12', 'M84 19h32M84 28h32M84 37h32'],
  ['M4 28h58', 'M70 8v40M80 8v40', 'M70 8h10M70 48h10', 'M56 22l6 6-6 6'],
  ['M18 28h16M46 28h16M74 28h16', 'M6 28a6 6 0 1 0 12 0a6 6 0 1 0 -12 0M34 28a6 6 0 1 0 12 0a6 6 0 1 0 -12 0M62 28a6 6 0 1 0 12 0a6 6 0 1 0 -12 0', 'M90 28a6 6 0 1 0 12 0a6 6 0 1 0 -12 0', 'M106 20l10 16M116 20l-10 16'],
  ['M10 6h26a4 4 0 0 1 4 4v36a4 4 0 0 1 -4 4h-26a4 4 0 0 1 -4 -4v-36a4 4 0 0 1 4 -4z', 'M18 42h10', 'M60 28a9 9 0 1 0 18 0a9 9 0 1 0 -18 0', 'M78 28h36M104 28v9M112 28v6'],
  ['M4 10C40 10 52 28 82 28', 'M4 28h78', 'M4 46C40 46 52 28 82 28', 'M82 28a8 8 0 1 0 16 0a8 8 0 1 0 -16 0M98 28h18'],
  ['M8 6v44M8 6h8M8 50h8M112 6v44M112 6h-8M112 50h-8', 'M24 28a7 7 0 1 0 14 0a7 7 0 1 0 -14 0M38 28h16M48 28v7', 'M66 28a7 7 0 1 0 14 0a7 7 0 1 0 -14 0M80 28h16M90 28v7', 'M58 14v28'],
  ['M4 6h112v44h-112z', 'M14 16h42v24h-42z', 'M64 16h42v24h-42z', 'M28 28h14M78 28h14'],
  ['M4 28h44', 'M48 28l10-10 10 10-10 10z', 'M68 28h24', 'M96 10v36M96 10h20M96 46h20'],
];

/* a fact card: lit while it sits in the middle of the rail (or of the screen on phones); its object draws in */
function Fact({ f: [t, d, big], i }) {
  const ref = useRef(null);
  const [on, setOn] = useState(false); // reduced motion and JS off: the CSS shows every card lit
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const narrow = matchMedia('(max-width: 900px)').matches;
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting), { rootMargin: narrow ? '-45% 0px -45% 0px' : '0px -49.5% 0px -49.5%' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <article ref={ref} className="ia-card" data-on={on || undefined}>
      <div className="ia-card-top">
        <p className="ia-card-n">{String(i + 1).padStart(2, '0')} / 08</p>
        <svg className="ia-obj" viewBox="0 0 120 56" width="120" height="56" aria-hidden="true">
          {OBJ[i].map((p, k) => <path key={k} d={p} style={{ transitionDelay: k * 120 + 'ms' }} />)}
        </svg>
      </div>
      <p className="ia-card-big" aria-hidden="true"><span>{big}</span></p>
      <div>
        <h3 className="v2-title">{t}</h3>
        <p className="ia-card-d">{d}</p>
      </div>
    </article>
  );
}

/* the eight facts: a pinned sideways rail (about two and a half screens) that starts and ends with a card in the middle.
   Phones and reduced motion: the cards stack, every one in the page's own scroll. */
function FactRail() {
  const sec = useRef(null);
  const rail = useRef(null);
  const [dist, setDist] = useState(0);
  const calm = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sec, offset: ['start start', 'end end'] });
  const x = useTransform(scrollYProgress, (p) => (calm ? 0 : -dist * Math.min(1, Math.max(0, p))));
  useEffect(() => {
    const m = () => { const r = rail.current; if (r) setDist(innerWidth > 900 ? Math.max(0, r.offsetWidth - innerWidth) : 0); };
    m();
    const ro = new ResizeObserver(m);
    rail.current && ro.observe(rail.current);
    addEventListener('resize', m);
    return () => { ro.disconnect(); removeEventListener('resize', m); };
  }, []);
  return (
    <section ref={sec} className="ia-fr" aria-label="hanzo.id">
      <div className="ia-fr-stage">
        <div className="v2-wrap ia-rail-h"><h2 className="v2-headline">hanzo.id</h2><p className="v2-kick">01 / 08 — 08 / 08</p></div>
        <div className="ia-fr-view">
          <motion.ol ref={rail} className="ia-fr-rail" style={{ x }}>
            {FACTS.map((f, i) => <li key={f[0]}><Fact f={f} i={i} /></li>)}
          </motion.ol>
        </div>
      </div>
    </section>
  );
}

/* the dark room enters as a rounded card inside the gutters and opens to full width as it is reached */
function Room({ children }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start 0.3'] });
  const clip = useTransform(scrollYProgress, (p) => { const g = (24 * (1 - Math.min(1, Math.max(0, p)))).toFixed(1); return `inset(0px ${g}px round ${g}px)`; });
  return <motion.section ref={ref} className="ia-room v2-dark" data-room="dark" style={{ clipPath: clip }}>{children}</motion.section>;
}

/* Beyond: the refresh family. Press the live token: it is spent and the next one is issued. Press a spent one: the whole
   family is revoked. Eight places are drawn from the start, so the room never changes height. */
const MAX = 8;
function Family() {
  const [s, setS] = useState({ n: 1, dead: false });
  const { n, dead } = s;
  const present = (k) => setS((v) => (v.dead ? v : k < v.n ? { ...v, dead: true } : v.n < MAX ? { ...v, n: v.n + 1 } : v));
  return (
    <Room>
      <div className="v2-wrap v2-grid ia-fam-grid">
        <div className="ia-fam-copy">
          <h2 className="v2-headline">Refresh tokens</h2>
          <p className={'v2-body ia-fam-p' + (dead ? ' dead' : '')}>
            <span>Refresh tokens are single-use and kept only as a hash. </span>
            <span className="ia-fam-k">Presenting a spent one revokes the whole family</span>
            <span>, so a stolen token cannot outlive its session.</span>
          </p>
        </div>
        <div className={'ia-fam-box' + (dead ? ' dead' : '')}>
          <button type="button" className="ia-fam-x" aria-label="Replay" onClick={() => setS({ n: 1, dead: false })}>
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M4 12a8 8 0 1 0 2.4-5.7M4 4v4.5h4.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <ol className="ia-fam-track" aria-label="Refresh tokens">
            {Array.from({ length: MAX }, (_, i) => i + 1).map((k) => {
              const st = k > n ? 'slot' : dead ? 'dead' : k < n ? 'spent' : 'live';
              return (
                <li key={k} className={st}>
                  {k > 1 && <i className="ia-fam-seg" />}
                  {k <= n
                    ? <button type="button" className="ia-tok" aria-label={`Refresh tokens ${k}`} aria-pressed={st === 'live'} disabled={dead} onClick={() => present(k)}><i /></button>
                    : <span className="ia-tok" aria-hidden="true"><i /></span>}
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </Room>
  );
}

const NOJS = '.ia-card .ia-card-d{opacity:1!important}.ia-obj path{stroke-dashoffset:0!important}';

export default function Iam() {
  return (
    <main className="v2 ia">
      <noscript><style>{NOJS}</style></noscript>
      <section className="ia-hero">
        <div className="v2-wrap v2-grid ia-hero-g">
          <div className="ia-hero-t">
            <Lines as="h1" className="v2-display ia-h1" lines={['Hanzo IAM']} delay={0} data-morph-target="" />
            <p className="v2-lede ia-sub v2-in" style={{ animationDelay: '.12s' }}>The sign-in behind every Hanzo service.</p>
            <div className="v2-acts v2-in ia-acts" style={{ animationDelay: '.18s' }}>
              <Cta to="https://docs.hanzo.ai/docs/openapi/iam" id="iam.hero" thumb>API reference</Cta>
              <Cta to="https://hanzo.id/.well-known/openid-configuration" kind="quiet" id="iam.discovery-document">Discovery document</Cta>
              <Cta to="https://github.com/hanzoai/iam" kind="link" id="iam.source">Source</Cta>
            </div>
          </div>
          <Recede><SignIn /></Recede>
        </div>
      </section>

      <FactRail />

      <ShipPrompt
        name="IAM"
        api="/v1/iam"
        prompt="Read https://hanzo.ai/skill.md and use Hanzo IAM in my project. Start with: hanzo iam whoami"
        related={[['Authz', '/authz', 'Fine-grained access'], ['KMS', '/kms', 'Managed keys'], ['Secrets', '/cloud/secrets', 'Store once, sync everywhere']]}
        flip
      />

      <Family />

      <GetIt name="IAM" tag="Identity + access (hanzo.id)" seed="iam" data={[256, 65, 3]} repo={['hanzoai/iam', 'https://github.com/hanzoai/iam']} stars="3 stars" ask={['API reference', 'https://docs.hanzo.ai/docs/openapi/iam', 'iam.close']} />
    </main>
  );
}
