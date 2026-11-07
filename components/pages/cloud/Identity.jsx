'use client';
// Persona: a product team that needs sign-in for its own users.
// Goal: see the hosted sign-in working, what the token carries, and one session across every app.
// CTA: Try Hanzo (identity.hero, identity.mid, identity.close).
// Metric: signup_start (cta_click identity.hero)
// Signature: the card that never leaves: it re-hosts itself on a customer's hostname, then the first screen pins and three stages step in beside it.
// Beyond: white-labelled by hostname: the hosted card redrawn from your hostname, your mark and the ways in.
/* Identity (v2, archetype A Launch).
   V2: 8/10 round 4: the hosted card leads (left) and re-hosts itself from hanzo.id to a customer's hostname before it signs someone in; "Sign-in" as Hanzo writes it; no fragment labels (fields, token claims and the client id are drawn and masked); the white-label bullet stays a bullet; Add sign-in fits 320; phone bento is a snap rail; the close is every app in the organization, growing as it arrives; no pointer glow
   Signature: the card that never leaves. The hosted sign-in card leads the first screen: its address bar rewrites
   from hanzo.id to a customer's hostname and its mark changes, then it signs someone in by itself (password, then a
   second factor). Scroll, and the first screen pins (on every width): the title steps out and the three stages step
   in one at a time while the same card changes to show each one - the ways in, what the token carries, one session
   lighting every app in the organization. The card leans toward a fine pointer (2.5°).
   Supporting: kinetic title lines; "What it does" as a bento of tiles, each with its own small drawing that plays on
   arrival and on hover, the sentence opening over the drawing; the large-organization tabs, each driving a drawing
   made from its own words; Add sign-in as a scene that lights each step and shows what it makes.
   Beyond: white-labelled by hostname - type your hostname and your mark, choose the ways in, and the hosted card redraws
   as yours. Nothing is saved or sent. The close: every app in the organization at rest, growing once as it arrives.
   Greys only (Hanzo's deck). Every word and link is Hanzo's; state is shown by shape (tick, fill, outline); the app
   marks are drawn shapes, not anyone's logo.
   CTA: Try Hanzo (hero, Add sign-in and the close; one solid button per screen, the others text links). */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'motion/react';
import { A, Cta } from '../../kit';
import { useLive } from './Frame';
import { Lines, useTick } from '../../v2/LiftStage';
import LivePause, { usePause } from '../../v2/LivePause';
import '../../v2/v2scale.css';
import './Identity.css';

const EASE = [0.16, 1, 0.3, 1];

const STAGES = [
  ['Signing in', 'A password, a passkey, or a Google or GitHub account. A second factor when the organization asks for one.'],
  ['What the token carries', 'Who signed in, which organizations they belong to, and the role they hold where they asked to act.'],
  ['One sign-in, every app', 'Sign in once and the session is good across every app in the organization, including ours.'],
];

const TICK = <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const ARROW = <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;

/* nine drawn app marks (shapes, not logos) for "every app in the organization" */
const MARKS = [
  <circle key="a" cx="12" cy="12" r="6" />,
  <rect key="b" x="6" y="6" width="12" height="12" rx="2" />,
  <path key="c" d="M12 5l7 13H5z" />,
  <path key="d" d="M12 4l8 8-8 8-8-8z" />,
  <><circle key="e1" cx="12" cy="12" r="7" fill="none" strokeWidth="2.4" /><circle key="e2" cx="12" cy="12" r="2.4" /></>,
  <path key="f" d="M12 4l7 4v8l-7 4-7-4V8z" />,
  <><rect key="g1" x="5" y="13" width="3" height="6" rx="1" /><rect key="g2" x="10.5" y="9" width="3" height="10" rx="1" /><rect key="g3" x="16" y="5" width="3" height="14" rx="1" /></>,
  <path key="h" d="M10 5h4v5h5v4h-5v5h-4v-5H5v-4h5z" />,
  <path key="i" d="M4 14c2.5-5 5.5-5 8 0s5.5 5 8 0" fill="none" strokeWidth="2.6" strokeLinecap="round" />,
];

/* the token's three claims as drawn rows: a person, an organization, a role; values masked (no invented words) */
const CLAIMS = [
  <svg key="who" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><circle cx="12" cy="9" r="4" fill="currentColor" /><path d="M4.5 20c1.2-3.6 4.2-5.4 7.5-5.4s6.3 1.8 7.5 5.4" fill="currentColor" /></svg>,
  <svg key="org" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="3" fill="none" stroke="currentColor" strokeWidth="2" /><rect x="8" y="8" width="8" height="8" rx="1.5" fill="currentColor" /></svg>,
  <svg key="role" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M12 3l7 3v6c0 4-3 7.5-7 9-4-1.5-7-5-7-9V6z" fill="currentColor" /></svg>,
];

/* the customer's address the card is re-hosted on (data, not copy: the documentation domain) */
const THEIRS = 'id.example.com';

/* The hosted card. at 0: re-hosted on a customer's hostname, then signing someone in by itself; 1 the ways in;
   2 the token; 3 every app. Server and first client render are the same frame (hanzo.id, empty field). */
function SignCard({ at }) {
  const [ref, seen, calm] = useLive(0.3);
  const [paused, togglePause] = usePause();
  const live = seen && !paused;
  // hero loop: 0 hanzo.id, 1 the hostname rewrites, 2 password, 3 go, 4 code, 5 signed in
  const [t, setT] = useState(0);
  useEffect(() => { if (calm) setT(5); }, [calm]);
  useEffect(() => {
    if (!live || at !== 0) return;
    const id = setTimeout(() => setT((v) => (v + 1) % 6), [900, 1500, 1500, 700, 1800, 2000][t]);
    return () => clearTimeout(id);
  }, [t, live, at]);
  const [w, setW] = useState(0); // which way in is lit
  useTick(900, live && at === 1, () => setW((v) => (v + 1) % 5));
  const theirs = at === 0 && t >= 1;
  return (
    <div className="lp-host">
      <LivePause paused={paused} onToggle={togglePause} className="id-pause" />
      <div className="id-card" ref={ref} aria-hidden="true">
        <p className={'id-url' + (theirs ? ' theirs' : '')}>
          <i />
          <span className="id-host">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={theirs ? 'b' : 'a'} className="id-host-t" initial={{ clipPath: 'inset(0 100% 0 0)' }} animate={{ clipPath: 'inset(0 0% 0 0)' }} exit={{ opacity: 0, transition: { duration: 0.12 } }} transition={{ duration: 0.7, ease: EASE }}>{theirs ? THEIRS : 'hanzo.id'}</motion.span>
            </AnimatePresence>
          </span>
        </p>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={at} className="id-screen" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10, transition: { duration: 0.18 } }} transition={{ duration: 0.55, ease: EASE }}>
            {at === 0 && (
              <div className="id-form">
                <span className={'id-mark-row' + (theirs ? ' theirs' : '')}><span className="id-mark h">H</span><span className="id-mark c" /></span>
                <p className="id-t">Sign-in</p>
                <span className={'id-field' + (t === 2 ? ' typing' : '')}><b>{t >= 3 ? '••••••••••' : ''}</b></span>
                <span className={'id-go' + (t === 3 ? ' press' : '')}>{ARROW}</span>
                <div className={'id-code' + (t >= 4 ? ' on' : '')}>
                  <div>{[0, 1, 2, 3, 4, 5].map((k) => <i key={k} style={{ transitionDelay: t >= 4 && !calm ? k * 0.18 + 's' : '0s' }} />)}</div>
                </div>
                <span className={'id-ok' + (t === 5 ? ' on' : '')}>{TICK}</span>
              </div>
            )}
            {at === 1 && (
              <div className="id-form">
                <p className="id-t">Sign-in</p>
                <span className={'id-field' + (w === 0 ? ' lit' : '')}><b>••••••••••</b></span>
                <span className={'id-btn dark' + (w === 1 ? ' lit' : '')}>passkey</span>
                <span className={'id-btn' + (w === 2 ? ' lit' : '')}>Google</span>
                <span className={'id-btn' + (w === 3 ? ' lit' : '')}>GitHub</span>
                <span className={'id-2fa' + (w === 4 ? ' lit' : '')}>{[0, 1, 2, 3, 4, 5].map((k) => <i key={k} />)}</span>
              </div>
            )}
            {at === 2 && (
              <div className="id-token">
                <p className="id-t">token</p>
                {CLAIMS.map((g, i) => (
                  <motion.p key={i} initial={calm ? false : { opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.18, duration: 0.5, ease: EASE }}><b>{g}</b><span className="id-mask">{'•'.repeat([9, 13, 7][i])}</span></motion.p>
                ))}
              </div>
            )}
            {at === 3 && (
              <div className="id-apps">
                <div>
                  {MARKS.map((m, i) => (
                    <motion.i key={i} initial={calm ? false : { backgroundColor: '#f2f2f2', color: '#a3a3a3', scale: 0.86 }} animate={{ backgroundColor: '#0a0a0a', color: '#fafafa', scale: 1 }} transition={{ delay: 0.25 + i * 0.12, duration: 0.4, ease: EASE }}>
                      <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" stroke="currentColor" strokeWidth="0">{m}</svg>
                    </motion.i>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* the card leans toward a fine pointer (2.5° at most) and a soft light follows it across the stage; touch: nothing */
function lean(e) {
  if (e.pointerType !== 'mouse') return;
  const el = e.currentTarget;
  if (el.hasAttribute('data-open')) return; // an open tile holds still so its words are sharp
  const r = el.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
  el.style.setProperty('--sx', (x * 100).toFixed(1) + '%');
  el.style.setProperty('--sy', (y * 100).toFixed(1) + '%');
  el.style.setProperty('--ry', ((x - 0.5) * 5).toFixed(2) + 'deg');
  el.style.setProperty('--rx', ((0.5 - y) * 5).toFixed(2) + 'deg');
}
function unlean(e) { const s = e.currentTarget.style; s.setProperty('--ry', '0deg'); s.setProperty('--rx', '0deg'); }

/* The first screen pins on every width: the title, then the three stages, while the card stays. */
function Pin() {
  const sec = useRef(null);
  const [at, setAt] = useState(0);
  const { scrollYProgress } = useScroll({ target: sec, offset: ['start start', 'end end'] });
  useMotionValueEvent(scrollYProgress, 'change', (p) => setAt(Math.max(0, Math.min(3, Math.floor(p * 4 * 0.9999)))));
  const layer = (i) => ({ 'data-on': at === i ? '' : undefined, 'data-past': at > i ? '' : undefined });
  return (
    <section ref={sec} className="id-pin" aria-label="Hanzo Identity">
      <div className="id-pin-stage" onPointerMove={lean} onPointerLeave={unlean}>
        <div className="v2-wrap v2-grid id-pin-grid">
          <div className="id-layers">
            <div className="id-layer id-hero" {...layer(0)}>
              <Lines as="h1" className="v2-display id-h1" lines={['Hanzo', 'Identity']} data-morph-target="" />
              <p className="v2-lede id-sub v2-in" style={{ animationDelay: '.3s' }}>The sign-in your users actually see.</p>
              <div className="v2-acts">
                <Cta to="/login" id="identity.hero" thumb>Try Hanzo</Cta>
                <Cta to="https://docs.hanzo.ai/docs/openapi/iam" kind="link" id="identity.view-documentation">View Documentation</Cta>
              </div>
            </div>
            {STAGES.map(([t, d], i) => (
              <article key={t} className="id-layer id-stage" {...layer(i + 1)}>
                <h2 className="v2-headline"><span>{t}</span></h2>
                <p className="v2-body">{d}</p>
              </article>
            ))}
          </div>
          <div className="id-card-wrap">
            <SignCard at={at} />
            <div className="id-prog" aria-hidden="true">
              {STAGES.map(([t], i) => <i key={t} data-on={at > i ? '' : undefined} />)}
              <span className="x-mono">{String(Math.max(at, 1)).padStart(2, '0')} / 03</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const DOES = [
  ['A second factor', "An authenticator app, a code by SMS or email, or a passkey. Enrolment sends the material and then demands it back before it writes anything, and the destination is never taken from the request — an enrolment that let the caller name the phone would enrol the attacker's.", 'code'],
  ['Accounts and membership', 'Create people, put them in an organization, give them a role there. SCIM 2.0 does the same thing from a directory you already run, so joiners and leavers arrive without a script of your own.', 'people'],
  ['Single sign-on', 'Every application registers under its own client id and redirects to the same authorize endpoint, so a person who is already signed in comes straight back with a code and never sees a form twice.', 'sso'],
  ['Roles that travel', 'A role is granted at a place — an organization, a workspace under it, a single project. The token carries the one that applies to the request, so your service decides without asking us anything.', 'places'],
  ['Passkeys', 'A WebAuthn credential registered to the account, unlocked by whatever the device already uses — a fingerprint, a face, a PIN. Nothing that can be phished, because there is nothing to type.', 'key'],
  ['A record of what happened', 'Actions are written once to an append-only log scoped to the organization they happened in. The write path exists; there is no edit path for normal operation, which is the point of keeping one.', 'log'],
];

const PERSON = <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><circle cx="12" cy="9" r="4" fill="currentColor" /><path d="M4.5 20c1.2-3.6 4.2-5.4 7.5-5.4s6.3 1.8 7.5 5.4" fill="currentColor" /></svg>;

/* each tile's small drawing, from its own words; it plays once on arrival and again on hover */
function Glyph({ k }) {
  if (k === 'code') return <div className="id-g-code">{[0, 1, 2, 3, 4, 5].map((i) => <i key={i} style={{ '--k': i }} />)}</div>;
  if (k === 'people') return <div className="id-g-people">{[0, 1, 2, 3, 4].map((i) => <i key={i} style={{ '--k': i }}>{PERSON}</i>)}<span>SCIM 2.0</span></div>;
  if (k === 'sso') return <div className="id-g-sso"><span style={{ '--k': 0 }}>client id</span><span style={{ '--k': 1 }}>client id</span><span style={{ '--k': 2 }}>client id</span><b>authorize</b></div>;
  if (k === 'places') return <div className="id-g-places"><span>organization<span>workspace<span>project</span></span></span></div>;
  if (k === 'key') return <div className="id-g-key"><svg viewBox="0 0 48 48" width="56" height="56"><path d="M24 6c-7 0-12 5-12 12v6M36 24v-6c0-3-1-6-3-8M18 42c-2-4-3-9-3-14 0-5 4-9 9-9s9 4 9 9c0 3 0 6-1 9M24 27c0 6-1 11-4 15M29 40c1-3 2-7 2-12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /></svg><span>WebAuthn</span></div>;
  return <div className="id-g-log">{['write', 'write', 'write', 'write'].map((t, i) => <p key={i} style={{ '--k': i }}><i />{t}</p>)}<p className="no"><i />edit</p></div>;
}

/* a tile: its drawing and title at rest; the + opens Hanzo's sentence over the drawing, so the grid never moves */
function Tile({ t, d, g, i }) {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen((o) => !o);
  return (
    <article className={'id-tile t' + i} data-open={open || undefined} onPointerMove={lean} onPointerLeave={unlean} onClick={toggle}>
      <div className="id-tile-g" aria-hidden="true"><Glyph k={g} /></div>
      <div className="id-tile-h">
        <h3 className="v2-title">{t}</h3>
        <button type="button" className="id-more" aria-expanded={open} aria-controls={'id-d' + i} aria-label={t} onClick={(e) => { e.stopPropagation(); toggle(); }}>
          <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
        </button>
      </div>
      <p id={'id-d' + i} className="id-tile-d">{d}</p>
    </article>
  );
}

function Does() {
  const box = useRef(null);
  // each drawing plays once as its tile arrives
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.setAttribute('data-in', ''); io.unobserve(e.target); } }), { threshold: 0.4 });
    box.current?.querySelectorAll('.id-tile').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return (
    <section className="v2-sec id-does">
      <div className="v2-wrap">
        <div className="v2-grid id-does-h">
          <h2 className="v2-display s">What it does</h2>
          <p className="v2-lede">Standards, not a proprietary protocol. If your framework can read an OpenID Connect discovery document, it can already talk to this.</p>
        </div>
        <div className="id-bento" ref={box}>
          {DOES.map(([t, d, g], i) => <Tile key={t} t={t} d={d} g={g} i={i} />)}
        </div>
      </div>
    </section>
  );
}

const LARGE = [
  ['Where the data sits', 'An organization is a tenancy boundary, and the boundary is enforced by the code that reads the token rather than by a column somebody has to remember to filter on.', ['Enterprise security with GDPR and privacy controls', 'Self-host it, in your own region, on your own cluster', 'One Go binary, embedded SQLite by default — nothing to run beside it']],
  ['Bring the identity you already have', 'Point Identity at your own issuer and it becomes the entry point without becoming the record.', ['Federate to any OpenID Connect issuer by naming its discovery URL', 'SCIM 2.0 provisioning, so joiners and leavers arrive from your directory', 'White-labelled by hostname — your mark on your domain, never ours']],
  ['Signing up your customers', 'An organization can hold its own customers as sub-organizations, so a business you serve manages its people without any of it reaching yours.', ['Sign in with Google or GitHub, or with any issuer you add', 'A consent screen the person has to pass before an app gets a token', 'Org admins manage their own members without platform access']],
  ['What you write', 'Almost nothing. Nobody should be hand-rolling OAuth in 2026, and with this you do not.', ['One SDK with an entry point per runtime — server, React, browser, Next.js, Passport', 'An OpenAPI 3.1 description generated from the handlers themselves', 'The sign-in page is hosted and already built — you send people to it']],
];
const RUNTIMES = ['server', 'React', 'browser', 'Next.js', 'Passport'];

/* each tab's drawing, made only from that tab's own words; it plays when the tab opens */
function LargeArt({ i }) {
  if (i === 0) return (
    <div className="id-art id-art-region">
      <span className="id-art-pin">your own region</span>
      <div className="id-art-org">
        <span className="id-art-k">organization</span>
        <div className="id-art-bin"><b>One Go binary</b><span className="id-art-db"><i />embedded SQLite</span></div>
        <span className="id-art-tok">token</span>
      </div>
      <div className="id-art-org ghost"><span className="id-art-k">organization</span></div>
      <span className="id-art-foot">your own cluster</span>
    </div>
  );
  if (i === 1) return (
    <div className="id-art id-art-issuer">
      <div className="id-art-node"><span className="id-art-k">your own issuer</span><b>the record</b></div>
      <div className="id-art-wire"><i /><span>discovery URL</span></div>
      <div className="id-art-node dark"><span className="id-art-k">Identity</span><b>the entry point</b></div>
      <span className="id-art-foot">OpenID Connect</span>
    </div>
  );
  if (i === 2) return (
    <div className="id-art id-art-tree">
      <div className="id-art-root">organization</div>
      <div className="id-art-kids">
        {[0, 1, 2].map((k) => (
          <div key={k} className="id-art-sub" style={{ '--k': k }}>
            <span>sub-organizations</span>
            <div>{[0, 1, 2].map((p) => <i key={p} style={{ '--p': p }}>{PERSON}</i>)}</div>
          </div>
        ))}
      </div>
      <span className="id-art-gate">consent screen<em>{ARROW}</em>token</span>
    </div>
  );
  return (
    <div className="id-art id-art-sdk">
      <b className="id-art-core">One SDK</b>
      <div className="id-art-rt">{RUNTIMES.map((r, k) => <span key={r} style={{ '--k': k }}>{r}</span>)}</div>
      <span className="id-art-foot">OpenAPI 3.1</span>
    </div>
  );
}

function Large() {
  const [at, setAt] = useState(0);
  return (
    <section className="v2-sec id-large">
      <div className="v2-wrap">
        <div className="v2-grid id-large-h">
          <h2 className="v2-display s">Running it for a large organization</h2>
          <p className="v2-lede">The same service, wearing your name, on hardware you choose.</p>
        </div>
        <div className="id-tabs-rail">
          <div className="id-tabs" role="tablist" aria-label="Running it for a large organization">
            {LARGE.map(([t], i) => (
              <button key={t} type="button" role="tab" id={'id-t' + i} aria-selected={at === i} aria-controls={'id-p' + i} onClick={(e) => { setAt(i); e.currentTarget.scrollIntoView({ block: 'nearest', inline: 'center' }); }}>
                {at === i && <motion.span layoutId="id-tab" className="id-tab-bg" transition={{ duration: 0.3, ease: EASE }} />}
                <span className="id-tab-t">{t}</span>
              </button>
            ))}
          </div>
        </div>
        {LARGE.map(([t, d, pts], i) => (
          <div key={t} id={'id-p' + i} role="tabpanel" aria-labelledby={'id-t' + i} hidden={at !== i} className="id-panel">
            <div className="id-panel-art" aria-hidden="true">{at === i && <LargeArt i={i} />}</div>
            <div className="id-panel-l">
              <h3 className="v2-title">{t}</h3>
              <p className="v2-body">{d}</p>
              <ul className="id-checks">{pts.map((p) => <li key={p} id={p.startsWith('White-labelled') ? 'id-wl' : undefined}>{TICK}{p}</li>)}</ul>
              <p className="id-panel-n x-mono" aria-hidden="true"><span>{String(i + 1).padStart(2, '0')} / 04</span>{LARGE.map(([k], j) => <i key={k} data-on={j <= i || undefined} />)}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

const WAYS = ['password', 'passkey', 'Google', 'GitHub', 'second factor'];
const HOST = /^(?=.{1,253}$)([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/;

/* the hosted card, white-labelled: your hostname in the bar, your mark on the page, the ways in you chose */
function Branded({ brand, small }) {
  const { host, name, on } = brand;
  const h = host.trim().toLowerCase();
  const ok = HOST.test(h);
  const who = name.trim();
  const has = (w) => on[WAYS.indexOf(w)];
  const none = !on.slice(0, 4).some(Boolean);
  return (
    <div className={'id-card wear' + (small ? ' small' : '')} aria-hidden="true">
      <p className={'id-url' + (ok ? '' : ' off')}><i />{ok ? h : ''}</p>
      <div className="id-screen">
        <div className="id-form">
          <span className="id-brand"><span className="id-mark">{who ? who[0].toUpperCase() : ''}</span>{who}</span>
          <p className="id-t">Sign-in</p>
          {has('password') && <span className="id-field"><b>••••••••••</b></span>}
          {has('passkey') && <span className="id-btn dark">passkey</span>}
          {has('Google') && <span className="id-btn">Google</span>}
          {has('GitHub') && <span className="id-btn">GitHub</span>}
          {none && <span className="id-empty" />}
          {has('second factor') && <span className="id-2fa">{[0, 1, 2, 3, 4, 5].map((k) => <i key={k} />)}</span>}
        </div>
      </div>
    </div>
  );
}

/* Beyond: white-labelled by hostname (Hanzo's bullet in the large-organization tabs names it). The hosted card
   redrawn as yours: your hostname in the bar, your mark on the page. Nothing is saved or sent. */
function Wear({ brand, set }) {
  const ok = HOST.test(brand.host.trim().toLowerCase());
  return (
    <section className="v2-sec id-wear" aria-labelledby="id-wl">
      <div className="v2-wrap v2-grid">
        <div className="id-wear-l">
          <label className="id-wear-f">
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="1.6" /><path d="M3.5 12h17M12 3.5c2.6 2.4 3.8 5.2 3.8 8.5s-1.2 6.1-3.8 8.5c-2.6-2.4-3.8-5.2-3.8-8.5s1.2-6.1 3.8-8.5z" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg>
            <input value={brand.host} onChange={(e) => set({ ...brand, host: e.target.value })} spellCheck={false} autoComplete="off" inputMode="url" aria-invalid={!ok} aria-label="hostname" maxLength={253} />
          </label>
          <label className="id-wear-f">
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="4" fill="currentColor" /></svg>
            <input value={brand.name} onChange={(e) => set({ ...brand, name: e.target.value })} autoComplete="off" aria-label="your mark" maxLength={32} />
          </label>
          <div className="id-wear-ways" role="group" aria-label={STAGES[0][1]}>
            {WAYS.map((w, i) => <button key={w} type="button" aria-pressed={brand.on[i]} onClick={() => set({ ...brand, on: brand.on.map((v, k) => (k === i ? !v : v)) })}>{w}</button>)}
          </div>
        </div>
        <div className="id-wear-r"><Branded brand={brand} /></div>
      </div>
    </section>
  );
}

/* Add sign-in: a rounded black card that opens to full width; the three steps light in turn and show what each makes */
const STEPS = ['Register the app', 'set the callback', 'install the SDK'];
function Add() {
  const room = useRef(null);
  const [ref, seen, calm] = useLive(0.4);
  const [step, setStep] = useState(0);
  const [held, setHeld] = useState(false);
  useEffect(() => {
    const el = room.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.setAttribute('data-open', ''); io.disconnect(); } }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useTick(2400, seen && !held && !calm, () => setStep((s) => (s + 1) % 3));
  return (
    <section className="id-add" aria-labelledby="id-add-h">
      <div className="id-add-room v2-dark" data-room="dark" ref={room}>
        <div className="v2-wrap v2-grid">
          <div className="id-add-l">
            <h2 id="id-add-h" className="v2-display s">Add sign-in</h2>
            <p className="v2-lede">Register the app, set the callback your framework already uses, install the SDK. That is the whole integration.</p>
            <div className="v2-acts"><Cta to="/login" id="identity.mid">Try Hanzo</Cta><Cta to="https://docs.hanzo.ai/docs/openapi/iam" kind="link" id="identity.read-documentation">Read Documentation</Cta></div>
          </div>
          <div className="id-scene" ref={ref}>
            <div className="id-steps" role="group" aria-label="Add sign-in">
              {STEPS.map((s, i) => (
                <button key={s} type="button" aria-pressed={step === i} data-past={step > i || undefined} onClick={() => { setStep(i); setHeld(true); }}>
                  <span className="id-step-n">{step > i ? TICK : i + 1}</span>{s}
                </button>
              ))}
            </div>
            <div className="id-made" aria-hidden="true">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={step} className="id-made-in" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }} transition={{ duration: 0.45, ease: EASE }}>
                  {step === 0 && (
                    <span className="id-made-id">
                      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><circle cx="8" cy="12" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.8" /><path d="M12.5 12H21M18 12v3M21 12v2.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
                      <span className="id-made-dots">{Array.from({ length: 4 }, (_, k) => <span key={k} style={{ '--k': k }}>••••</span>)}</span>
                    </span>
                  )}
                  {step === 1 && (
                    <span className="id-made-flow"><b>authorize</b><em>{ARROW}</em><b className="lit">callback</b></span>
                  )}
                  {step === 2 && (
                    <span className="id-made-rt">{RUNTIMES.map((r, k) => <i key={r} style={{ '--k': k }}>{r}</i>)}</span>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* the close: every app in the organization, at rest. As it is reached it grows past its resting size, then settles. */
function EndApps() {
  const box = useRef(null);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.setAttribute('data-in', ''); io.disconnect(); } }, { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div className="id-end-apps" ref={box} aria-hidden="true">
      {MARKS.map((m, i) => (
        <i key={i} style={{ '--k': i }}><svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor" stroke="currentColor" strokeWidth="0">{m}</svg></i>
      ))}
    </div>
  );
}

export default function Identity() {
  const [brand, setBrand] = useState({ host: 'hanzo.id', name: 'Hanzo', on: [true, true, true, false, true] });
  return (
    <main className="v2 id">
      <Pin />
      <Does />
      <Large />
      <Wear brand={brand} set={setBrand} />
      <Add />
      <section className="id-end">
        <div className="v2-wrap v2-grid id-end-in">
          <div className="id-end-l">
            <h2 className="v2-display m">Get started with Identity</h2>
            <div className="v2-acts"><Cta to="/login" id="identity.close">Try Hanzo</Cta><Cta to="https://docs.hanzo.ai/docs/projects/hanzoai/iam" kind="link" id="identity.read-the-docs">Read the docs</Cta><Cta to="https://github.com/hanzoai" kind="link" id="identity.view-on-github">View on GitHub</Cta></div>
          </div>
          <div className="id-end-r"><EndApps /></div>
        </div>
      </section>
    </main>
  );
}
