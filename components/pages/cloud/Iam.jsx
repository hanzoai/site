'use client';
// Persona: a developer wiring sign-in for an app or service on Hanzo.
// Goal: trust how hanzo.id issues and protects tokens.
// CTA: API reference (iam.hero, iam.close).
// Metric: cta_click iam.hero
// Signature: the sign-in, run: a hanzo.id card signs someone in by itself (a way in is picked, the authorization code and PKCE (S256) pass, the token is signed RS256 and its key is found in the JWKS), driving the five-station line under it.
// Beyond: the refresh family in the dark room: it plays once as it arrives (tokens spent one by one, a spent one presented, the family revoked); then press the live token to refresh, or a spent one to revoke the family.
/* IAM (v2, archetype A Launch).
   V2: 8/10 round 5: the demo starts from its first frame on server and client (the finished card only by CSS, for reduced motion and JS off), the hero asks rest from first paint; the rail holds card 01 and card 08 whole in the gutter; card 03 glides into the refresh room and "Refresh tokens" is seen once; order rail, room, Paste and ship, Get IAM (the token at rest, its own object), Related capabilities last with arrows on one edge; dead bands trimmed; link underlines draw; phone rail peeks 40px; reduced-motion grid inks only the current card.
   Earlier, round 4: the hero is a hanzo.id sign-in that runs itself (Google, GitHub, OIDC or a passkey; authorization code; PKCE · S256; the token signed RS256; its key found in the JWKS) and drives the five-station line, on the page with no grey frame; the eight facts pin and slide with a live 0N / 08 counter and end on the last card (a snap rail with a peek on phones); card 03 opens into the refresh room, so each sentence is said once; the refresh family plays once on arrival and rests revoked under reduced motion; the close is IAM's own (the signed-in card at rest), not the shared contour art; every visible word is Hanzo's own; deck greys only, one ask.
   Signature: the sign-in, run. The card picks a way in, the code and PKCE chips land, the token's three parts fill and the
   signature reads RS256, then the key row resolves against the JWKS with a tick; the five stations under the card light
   in step. The server paints the finished sign-in, so JS off and reduced motion show it whole; within a second it starts
   over and runs by itself (pausable), picking the next way in each time.
   Supporting: kinetic title lines; the eight facts as a pinned sideways rail whose lit card follows the scroll and whose
   object draws in; the stage recedes as the rail comes in; the dark room opens from a rounded card to full width.
   Beyond: the refresh family. It plays once when it arrives; then press the live refresh token and the next one is issued,
   or press a spent one and the whole family is revoked, the sentence's own clause lighting up. Status is shape only.
   Greys only (Hanzo's deck). Every visible word and link is Hanzo's; controls carry Hanzo's terms or ui-strings as names.
   Persona: a developer wiring sign-in for an app or service on Hanzo.
   Goal: trust how hanzo.id issues and protects tokens (PKCE, single-use refresh, one tenancy per organization).
   CTA: API reference (hero, the sticky ask bar and the close; one solid button per screen). */
import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent, useReducedMotion } from 'motion/react';
import { A, Cta } from '../../kit';
import { useLive } from './Frame';
import { Lines } from '../../v2/LiftStage';
import ShipPrompt from '../../v2/ShipPrompt';
import LivePause, { usePause } from '../../v2/LivePause';
import '../../v2/v2scale.css';
import '../../v2/GetIt.css';
import './Iam.css';

/* the sign-in's stations, in Hanzo's words (hanzo.id; "Authorization code with PKCE, always S256"; "signed RS256 … the same JWKS") */
const STATIONS = ['hanzo.id', 'Authorization code', ['PKCE', 'S256'], 'RS256', 'JWKS'];
const ALL = STATIONS.length;
/* the ways in, named as Hanzo names them ("from Google, from GitHub or from any OIDC issuer"; "or a passkey") */
const WAYS = ['Google', 'GitHub', 'OIDC', 'passkey'];
/* s: stations lit. The server and the first client paint show the demo's first frame (s = 0); it runs from there.
   Reduced motion and JS off show the finished sign-in through CSS alone, so nothing flips after hydration. */
const BEAT = [1100, 900, 760, 760, 900, 1900];

const Glyph = ({ k }) => (
  <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true">
    {k === 0 && <path d="M10 3.5a6.5 6.5 0 1 0 6.3 8.1H10" />}
    {k === 1 && <path d="M7 16.5c-3-1-4.5-3.4-4.5-6.5a7.5 7.5 0 0 1 15 0c0 3.1-1.5 5.5-4.5 6.5M8 16.5V14M12 16.5V14" />}
    {k === 2 && <path d="M7 4.5H4.5v11H7M13 4.5h2.5v11H13" />}
    {k === 3 && <path d="M7.5 10a3.5 3.5 0 1 0 0-.01M11 10h6.5M15 10v3M17.5 10v2" />}
  </svg>
);

/* the hanzo.id card: a way in, then the code, PKCE, the signed token and its key in the JWKS (shape for every state) */
function SignInCard({ s, pick }) {
  return (
    <div className="ia-si" data-s={s}>
      <p className="ia-si-mark">hanzo.id</p>
      <ul className="ia-si-ways">
        {WAYS.map((w, i) => (
          <li key={w} className={'ia-si-way' + (i === pick ? ' pick' : '')}><Glyph k={i} /><span>{w}</span></li>
        ))}
      </ul>
      <div className="ia-si-flow">
        <p className={'ia-si-chip' + (s >= 2 ? ' on' : '')}>Authorization code</p>
        <p className={'ia-si-chip' + (s >= 3 ? ' on' : '')}><span className="ia-w">PKCE</span><span className="ia-w">S256</span></p>
      </div>
      <div className={'ia-si-tok' + (s >= 4 ? ' on' : '')} aria-hidden="true">
        <i /><b>.</b><i /><b>.</b><i className="sig" />
        <span className="ia-si-alg">RS256</span>
      </div>
      <p className={'ia-si-key' + (s >= 5 ? ' on' : '')}>
        <span>JWKS</span>
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M6 12.5l4 4 8-9" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </p>
    </div>
  );
}

function SignIn() {
  const [ref, seen, calm] = useLive(0.3);
  const [paused, togglePause] = usePause();
  const live = seen && !paused && !calm;
  const [s, setS] = useState(0);
  const [pick, setPick] = useState(1);
  const card = useRef(null);
  useEffect(() => {
    if (!live) return;
    const id = setTimeout(() => {
      setS((v) => {
        if (v >= ALL) { setPick((p) => (p + 1) % WAYS.length); return 0; }
        return v + 1;
      });
    }, s === 0 ? 600 : BEAT[s]);
    return () => clearTimeout(id);
  }, [s, live]);
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
      <div className="ia-sign" ref={(el) => { ref.current = el; card.current = el; }} aria-hidden="true" onPointerMove={tilt} onPointerLeave={flat}>
        <SignInCard s={s} pick={pick} />
        <ol className="ia-path">
          {STATIONS.map((t, i) => (
            <li key={i} className={'ia-st' + (i < s ? ' on' : '') + (i === s - 1 ? ' now' : '')}>
              {i > 0 && <i className="ia-seg"><i /></i>}
              <span className="ia-dot" />
              <span className="ia-lab">{Array.isArray(t) ? t.map((w) => <span key={w} className="ia-w">{w}</span>) : t}</span>
            </li>
          ))}
        </ol>
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

/* card 03 says only its figure and title: its sentence lives in the refresh room it opens into */
const FACTS = [
  ['PKCE', 'Authorization code with PKCE, always S256.', 'S256'],
  ['Passwords', 'The passwords that do exist are argon2id digests, and a scheme IAM does not recognize fails closed.', 'argon2id'],
  ['Refresh tokens', null, 'single-use', '#ia-refresh'],
  ['A second factor', 'A second factor is an authenticator app, a code by SMS or email, or a passkey. Adding or dropping one signs the account out of every other browser.', 'passkey'],
  ['Federation', 'Sign-in arrives from Google, from GitHub or from any OIDC issuer you name, and SCIM 2.0 keeps a directory in step.', 'SCIM 2.0'],
  ['Signing keys', 'Tokens are signed RS256, with ML-DSA-65 available per certificate and published in the same JWKS.', 'RS256'],
  ['Organizations', 'Every organization is a tenancy boundary, and membership travels in the token.', 'tenancy boundary'],
  ['Authorization', 'What you may reach once signed in is Authz’s to decide, reading the same token.', 'Authz'],
];
const N = FACTS.length;
const pad = (k) => String(k).padStart(2, '0');

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

/* a fact card: lit while it is the rail's active card; its object draws in. Card 03 opens into the refresh room: it
   glides there and the room's family plays as it arrives. Its title stays for screen readers only, so "Refresh tokens"
   is seen once, as the room's heading. */
function Fact({ f: [t, d, big, to], i, on }) {
  const Tag = to ? 'a' : 'article';
  const go = to ? (e) => {
    const room = document.querySelector(to);
    if (!room) return;
    e.preventDefault();
    room.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  } : undefined;
  return (
    <Tag className={'ia-card' + (to ? ' ia-card-go' : '')} data-on={on || undefined} href={to} onClick={go}>
      <div className="ia-card-top">
        <p className="ia-card-n">{pad(i + 1)} / 08</p>
        <svg className="ia-obj" viewBox="0 0 120 56" width="120" height="56" aria-hidden="true">
          {OBJ[i].map((p, k) => <path key={k} d={p} style={{ transitionDelay: k * 120 + 'ms' }} />)}
        </svg>
      </div>
      <p className="ia-card-big" aria-hidden="true"><span>{big}</span></p>
      <div>
        <h3 className={'v2-title' + (to ? ' ia-sr' : '')}>{t}</h3>
        {d && <p className="ia-card-d">{d}</p>}
        {to && (
          <svg className="ia-card-arr" viewBox="0 0 16 16" width="18" height="18" aria-hidden="true"><path d="M8 3v9M4.5 8.5 8 12l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        )}
      </div>
    </Tag>
  );
}

/* the eight facts: a pinned sideways rail (about two and a half screens) whose lit card and counter follow the scroll,
   starting on the first card and ending on the last. Phones: a snap rail with the next card peeking, the counter
   following the swipe. Reduced motion: the cards sit in a grid, every one lit. */
function FactRail() {
  const sec = useRef(null);
  const rail = useRef(null);
  const view = useRef(null);
  const [dist, setDist] = useState(0);
  const [active, setActive] = useState(0);
  const calm = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sec, offset: ['start start', 'end end'] });
  // the rail holds still for the first and last tenth of the pin, so card 01 sits whole inside the gutter before the
  // sideways move starts and card 08 sits whole at the end; the counter reads the card that is whole on screen
  const hold = (p) => Math.min(1, Math.max(0, (p - 0.1) / 0.8));
  const x = useTransform(scrollYProgress, (p) => (calm ? 0 : -dist * hold(p)));
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    if (innerWidth <= 900) return;
    setActive(Math.round(hold(p) * (N - 1)));
  });
  useEffect(() => {
    const m = () => { const r = rail.current; if (r) setDist(innerWidth > 900 ? Math.max(0, r.scrollWidth - innerWidth) : 0); };
    m();
    const ro = new ResizeObserver(m);
    rail.current && ro.observe(rail.current);
    addEventListener('resize', m);
    return () => { ro.disconnect(); removeEventListener('resize', m); };
  }, []);
  const swiped = () => {
    const v = view.current, first = rail.current?.children[0];
    if (!v || !first) return;
    const step = first.getBoundingClientRect().width + 12;
    setActive(Math.min(N - 1, Math.max(0, Math.round(v.scrollLeft / step))));
  };
  return (
    <section ref={sec} className="ia-fr" aria-label="hanzo.id">
      <div className="ia-fr-stage">
        <div className="v2-wrap ia-rail-h"><h2 className="v2-headline">hanzo.id</h2><p className="v2-kick ia-count" aria-hidden="true">{pad(active + 1)} / 08</p></div>
        <div className="ia-fr-view" ref={view} onScroll={swiped}>
          <motion.ol ref={rail} className="ia-fr-rail" style={{ x }}>
            {FACTS.map((f, i) => <li key={f[0]}><Fact f={f} i={i} on={i === active} /></li>)}
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
  return <motion.section id="ia-refresh" ref={ref} className="ia-room v2-dark" data-room="dark" style={{ clipPath: clip }}>{children}</motion.section>;
}

/* Beyond: the refresh family. It plays once as it arrives: each refresh spends the live token and issues the next, then a
   spent one is presented and the whole family is revoked. Then it is yours: press the live token, or a spent one.
   Eight places are drawn from the start, so the room never changes height. Reduced motion: it rests revoked. */
const MAX = 8;
const RUN = [[700, { n: 2, dead: false }], [1400, { n: 3, dead: false }], [2100, { n: 4, dead: false }], [3100, { n: 4, dead: true }]];
function Family() {
  const [s, setS] = useState({ n: 1, dead: false });
  const [run, setRun] = useState(0);
  const [ref, seen, calm] = useLive(0.5);
  const played = useRef(-1);
  const { n, dead } = s;
  useEffect(() => { if (calm) setS({ n: 4, dead: true }); }, [calm]);
  useEffect(() => {
    if (!seen || calm || played.current === run) return;
    played.current = run;
    const ids = RUN.map(([ms, v]) => setTimeout(() => setS(v), ms));
    return () => ids.forEach(clearTimeout);
  }, [seen, calm, run]);
  const present = (k) => setS((v) => (v.dead ? v : k < v.n ? { ...v, dead: true } : v.n < MAX ? { ...v, n: v.n + 1 } : v));
  const replay = () => { setS({ n: 1, dead: false }); played.current = -1; setRun((r) => r + 1); };
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
        <div ref={ref} className={'ia-fam-box' + (dead ? ' dead' : '')}>
          <button type="button" className="ia-fam-x" aria-label="Replay" onClick={replay}>
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
          <ul className="ia-fam-key" aria-hidden="true">
            <li className={!dead ? 'on' : ''}><i className="live" />single-use</li>
            <li className={n > 1 && !dead ? 'on' : ''}><i className="spent" />a spent one</li>
            <li className={dead ? 'on' : ''}><i className="dead" />revokes the whole family</li>
          </ul>
        </div>
      </div>
    </Room>
  );
}

/* the close's own object: the token at rest, drawn large and without words: its three parts, the signature in ink, and a
   line from the signature to its key, ticked (the page's own drawing of "signed RS256 … published in the same JWKS") */
function TokenAtRest() {
  return (
    <svg className="ia-ct" viewBox="0 0 360 220" aria-hidden="true">
      <rect x="0" y="40" width="96" height="20" rx="10" className="p" />
      <circle cx="108" cy="50" r="3" className="d" />
      <rect x="120" y="40" width="96" height="20" rx="10" className="p" />
      <circle cx="228" cy="50" r="3" className="d" />
      <rect x="240" y="40" width="120" height="20" rx="10" className="s" />
      <path d="M300 60v62a14 14 0 0 1-14 14H140" className="l" />
      <circle cx="116" cy="136" r="24" className="k" />
      <path d="M140 136h0" className="l" />
      <path d="M104 137l8 8 16-17" className="t" />
      <path d="M0 196h360" className="h" />
    </svg>
  );
}

/* the close: IAM's own, with the token at rest as its object (not the hero's card, not the shared contour field) */
const Gh = () => <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" /></svg>;
function Close() {
  return (
    <section className="gi ia-close">
      <div className="v2-wrap gi-in">
        <div className="gi-copy">
          <h2 className="v2-display m gi-h">Get IAM</h2>
          <p className="v2-lede gi-tag">Identity + access (hanzo.id)</p>
          <div className="gi-meta">
            <span className="gi-chip"><span>License:</span> Apache-2.0</span>
            <A to="https://github.com/hanzoai/iam" className="gi-chip"><Gh />hanzoai/iam<em>3 stars</em></A>
          </div>
          <div className="gi-acts">
            <Cta to="https://docs.hanzo.ai/docs/openapi/iam" id="iam.close" size="lg">API reference</Cta>
            <p className="gi-more"><Cta to="https://platform.hanzo.ai/deploy" kind="link" id="iam.deploy">Deploy to Cloud</Cta></p>
          </div>
        </div>
        <div className="ia-close-art" aria-hidden="true"><TokenAtRest /></div>
      </div>
    </section>
  );
}

/* related capabilities: the last quiet row, under the close. Each row runs the full width with its arrow on one line at
   the right edge; on hover the row fills and the page's path shows beside the arrow. */
const REL = [['Authz', '/authz', 'Fine-grained access'], ['KMS', '/kms', 'Managed keys'], ['Secrets', '/cloud/secrets', 'Store once, sync everywhere']];
const Arrow = () => <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
function Related() {
  return (
    <section className="ia-rel">
      <div className="v2-wrap">
        <nav className="sp-rel" aria-label="Related capabilities">
          <p className="v2-kick">Related capabilities</p>
          <ul>
            {REL.map(([t, to, d]) => (
              <li key={t}>
                <A to={to} className="sp-rel-a"><b>{t}</b><span>{d}</span><i className="ia-rel-to" data-to={to} aria-hidden="true" /><Arrow /></A>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
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
            <div className="v2-acts ia-acts">
              <Cta to="https://docs.hanzo.ai/docs/openapi/iam" id="iam.hero" thumb>API reference</Cta>
              <Cta to="https://hanzo.id/.well-known/openid-configuration" kind="quiet" id="iam.discovery-document">Discovery document</Cta>
              <Cta to="https://github.com/hanzoai/iam" kind="link" id="iam.source">Source</Cta>
            </div>
          </div>
          <Recede><SignIn /></Recede>
        </div>
      </section>

      <FactRail />

      <Family />

      <ShipPrompt
        name="IAM"
        api="/v1/iam"
        prompt="Read https://hanzo.ai/skill.md and use Hanzo IAM in my project. Start with: hanzo iam whoami"
        flip
      />

      <Close />

      <Related />
    </main>
  );
}
