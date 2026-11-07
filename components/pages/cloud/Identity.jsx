'use client';
// Persona: a product team that needs sign-in for its own users.
// Goal: see the hosted sign-in working, what the token carries, and one session across every app.
// CTA: Try Hanzo (identity.hero, identity.mid, identity.close).
// Metric: signup_start (cta_click identity.hero)
// Signature: the card that never leaves: the first screen pins and three stages step in beside the same hosted card.
// Beyond: Wear your name: the hosted card redrawn from your hostname, name and ways in.
/* Identity (v2, archetype A Launch).
   V2: 8/10 round 2: no counters above headings (a progress mark sits under the card); nine app marks light one by one and people join as glyphs; the bento is 8/5 rows with one line each and the rest opening on click; tiles tilt and play their drawing on hover; one sticky card on phones whose panel swaps with the stage in view; tabs a snap rail on phones; reduced motion shows the finished sign-in; Add sign-in is a rounded black card that opens to full width; one solid ask per screen, deck greys
   Signature: the card that never leaves. The hosted hanzo.id sign-in card sits beside the title signing someone in by
   itself (password, then a second factor). Scroll, and the first screen pins: the title steps out and the three stages
   step in one at a time while the same card changes to show each one - the ways in, what the token carries, one
   session lighting every app in the organization. On phones the same card sticks under the header and swaps with the
   stage you are reading. A pointer light follows the mouse across the stage and the card leans toward it (2.5°).
   Supporting: kinetic title lines; "What it does" as a bento of tiles, each with its own small drawing that plays on
   arrival and on hover; the large-org detail in tabs (all of it in the HTML).
   Beyond: "Wear your name" - type your hostname and your name, choose the ways in, and the hosted card redraws
   white-labelled as yours. Nothing is saved or sent.
   Greys only (Hanzo's deck). Every word and link is Hanzo's; the hostname is an example; the app marks are drawn
   shapes, not anyone's logo.
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

/* The hosted card. at 0: signing someone in by itself; 1 the ways in; 2 the token; 3 every app. */
function SignCard({ at }) {
  const [ref, seen, calm] = useLive(0.3);
  const [paused, togglePause] = usePause();
  const live = seen && !paused;
  const [t, setT] = useState(0); // hero loop: 0 password, 1 continue, 2 code, 3 signed in
  // reduced motion: the finished sign-in, not the empty first frame
  useEffect(() => { if (calm) setT(3); }, [calm]);
  useEffect(() => {
    if (!live || at !== 0) return;
    const id = setTimeout(() => setT((v) => (v + 1) % 4), [1700, 700, 1900, 1900][t]);
    return () => clearTimeout(id);
  }, [t, live, at]);
  const [w, setW] = useState(0); // which way in is lit
  useTick(900, live && at === 1, () => setW((v) => (v + 1) % 5));
  return (
    <div className="lp-host">
      <LivePause paused={paused} onToggle={togglePause} className="id-pause" />
      <div className="id-card" ref={ref} aria-hidden="true">
        <i className="id-sheen" />
        <p className="id-url"><i />hanzo.id<span>Sign-in</span></p>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={at} className="id-screen" initial={{ opacity: 0, y: 16, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, transition: { duration: 0.18 } }} transition={{ duration: 0.55, ease: EASE }}>
            {at === 0 && (
              <div className="id-form">
                <p className="id-t">Sign in</p>
                <span className={'id-field' + (t === 0 ? ' typing' : '')}><em>password</em><b>{t === 0 ? '' : '••••••••••'}</b></span>
                <span className={'id-go' + (t === 1 ? ' press' : '')}>Continue</span>
                <div className={'id-code' + (t >= 2 ? ' on' : '')}>
                  <p>second factor</p>
                  <div>{[0, 1, 2, 3, 4, 5].map((k) => <i key={k} style={{ transitionDelay: t >= 2 && !calm ? k * 0.18 + 's' : '0s' }} />)}</div>
                </div>
                <span className={'id-ok' + (t === 3 ? ' on' : '')}>✓ signed in</span>
              </div>
            )}
            {at === 1 && (
              <div className="id-form">
                <p className="id-t">Sign in</p>
                <span className={'id-field' + (w === 0 ? ' lit' : '')}><em>password</em></span>
                <span className={'id-btn dark' + (w === 1 ? ' lit' : '')}>passkey</span>
                <span className="id-or">or</span>
                <span className={'id-btn' + (w === 2 ? ' lit' : '')}>Google</span>
                <span className={'id-btn' + (w === 3 ? ' lit' : '')}>GitHub</span>
                <span className={'id-2fa' + (w === 4 ? ' lit' : '')}>second factor</span>
              </div>
            )}
            {at === 2 && (
              <div className="id-token">
                <p className="id-t">token</p>
                {[['who', 'signed in'], ['organizations', 'they belong to'], ['role', 'where they act']].map(([k, v], i) => (
                  <motion.p key={k} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.18, duration: 0.5, ease: EASE }}><b>{k}</b><span>{v}</span></motion.p>
                ))}
              </div>
            )}
            {at === 3 && (
              <div className="id-apps">
                <div>
                  {MARKS.map((m, i) => (
                    <motion.i key={i} initial={{ backgroundColor: '#f2f2f2', color: '#a3a3a3', scale: 0.86 }} animate={{ backgroundColor: '#0a0a0a', color: '#fafafa', scale: 1 }} transition={{ delay: 0.25 + i * 0.12, duration: 0.4, ease: EASE }}>
                      <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" stroke="currentColor" strokeWidth="0">{m}</svg>
                    </motion.i>
                  ))}
                </div>
                <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4, duration: 0.4, ease: EASE }}>one session</motion.p>
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
  const el = e.currentTarget, r = el.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
  el.style.setProperty('--sx', (x * 100).toFixed(1) + '%');
  el.style.setProperty('--sy', (y * 100).toFixed(1) + '%');
  el.style.setProperty('--ry', ((x - 0.5) * 5).toFixed(2) + 'deg');
  el.style.setProperty('--rx', ((0.5 - y) * 5).toFixed(2) + 'deg');
}
function unlean(e) { const s = e.currentTarget.style; s.setProperty('--ry', '0deg'); s.setProperty('--rx', '0deg'); }

/* The first screen pins: the title, then the three stages, while the card stays. Phones: the card sticks and swaps. */
function Pin() {
  const sec = useRef(null);
  const [at, setAt] = useState(0);
  const [wide, setWide] = useState(true);
  const arts = useRef([]);
  const { scrollYProgress } = useScroll({ target: sec, offset: ['start start', 'end end'] });
  useEffect(() => { const m = matchMedia('(min-width: 901px)'); const f = () => setWide(m.matches); f(); m.addEventListener('change', f); return () => m.removeEventListener('change', f); }, []);
  useMotionValueEvent(scrollYProgress, 'change', (p) => { if (wide) setAt(Math.max(0, Math.min(3, Math.floor(p * 4 * 0.9999)))); });
  // phones: no pin; the one card sticks under the header and shows the stage that crosses the middle of the screen
  useEffect(() => {
    if (wide) return;
    setAt(0);
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) setAt(+e.target.dataset.i); }), { rootMargin: '-58% 0px -38% 0px' });
    arts.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [wide]);
  const layer = (i) => ({ ref: (el) => (arts.current[i] = el), 'data-i': i, 'data-on': at === i ? '' : undefined, 'data-past': at > i ? '' : undefined });
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

/* a tile: its title and one line; the rest of Hanzo's paragraph opens on click (the words stay in the HTML) */
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

function Large() {
  const [at, setAt] = useState(0);
  return (
    <section className="v2-sec id-large">
      <div className="v2-wrap">
        <div className="v2-grid id-large-h">
          <h2 className="v2-display s">Running it for a large organization</h2>
          <p className="v2-lede">The same service, wearing your name, on hardware you choose.</p>
        </div>
        <div className="id-tabs" role="tablist" aria-label="Running it for a large organization">
          {LARGE.map(([t], i) => (
            <button key={t} type="button" role="tab" id={'id-t' + i} aria-selected={at === i} aria-controls={'id-p' + i} onClick={(e) => { setAt(i); e.currentTarget.scrollIntoView({ block: 'nearest', inline: 'nearest' }); }}>
              {at === i && <motion.span layoutId="id-tab" className="id-tab-bg" transition={{ duration: 0.3, ease: EASE }} />}
              <span className="id-tab-t">{t}</span>
            </button>
          ))}
        </div>
        {LARGE.map(([t, d, pts], i) => (
          <div key={t} id={'id-p' + i} role="tabpanel" aria-labelledby={'id-t' + i} hidden={at !== i} className="id-panel">
            <div className="id-panel-l">
              <h3 className="v2-headline">{t}</h3>
              <p className="v2-body">{d}</p>
              <p className="id-panel-n x-mono" aria-hidden="true"><span>{String(i + 1).padStart(2, '0')} / 04</span>{LARGE.map(([k], j) => <i key={k} data-on={j <= i || undefined} />)}</p>
            </div>
            <ul className="id-checks">{pts.map((p) => <li key={p}><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>{p}</li>)}</ul>
          </div>
        ))}
      </div>
    </section>
  );
}

const WAYS = ['password', 'passkey', 'Google', 'GitHub', 'second factor'];
const HOST = /^(?=.{1,253}$)([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/;

/* Beyond: wear your name. The hosted card, white-labelled by hostname. Nothing is saved or sent. */
function Wear() {
  const [host, setHost] = useState('auth.example.com');
  const [name, setName] = useState('Example');
  const [on, setOn] = useState([true, true, true, false, true]);
  const h = host.trim().toLowerCase();
  const ok = HOST.test(h);
  const who = name.trim() || 'Your company';
  const has = (w) => on[WAYS.indexOf(w)];
  return (
    <section className="v2-sec id-wear">
      <div className="v2-wrap v2-grid">
        <div className="id-wear-l">
          <h2 className="v2-display s">Wear your name</h2>
          <p className="v2-kick acc id-wear-cap">White-labelled by hostname</p>
          <p className="v2-lede">Your mark on your domain, never ours.</p>
          <label className="id-wear-f">
            <span>Hostname</span>
            <input value={host} onChange={(e) => setHost(e.target.value)} spellCheck={false} autoComplete="off" inputMode="url" aria-invalid={!ok} aria-describedby="id-wear-e" maxLength={253} />
          </label>
          <p id="id-wear-e" className="id-wear-e" aria-live="polite">{ok ? '' : 'Type a hostname, like auth.example.com.'}</p>
          <label className="id-wear-f">
            <span>Name</span>
            <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="off" maxLength={32} />
          </label>
          <div className="id-wear-ways" role="group" aria-label="Ways in">
            {WAYS.map((w, i) => <button key={w} type="button" aria-pressed={on[i]} onClick={() => setOn((o) => o.map((v, k) => (k === i ? !v : v)))}>{w}</button>)}
          </div>
        </div>
        <div className="id-wear-r">
          <div className="id-card wear" aria-label={'Preview of the sign-in page at ' + (ok ? h : 'your hostname')}>
            <p className="id-url"><i />{ok ? h : 'your hostname'}</p>
            <div className="id-screen">
              <div className="id-form">
                <span className="id-mark" aria-hidden="true">{who[0].toUpperCase()}</span>
                <p className="id-t">Sign in to {who}</p>
                {has('password') && <span className="id-field"><em>password</em></span>}
                {has('passkey') && <span className="id-btn dark">passkey</span>}
                {(has('Google') || has('GitHub')) && (has('password') || has('passkey')) && <span className="id-or">or</span>}
                {has('Google') && <span className="id-btn">Google</span>}
                {has('GitHub') && <span className="id-btn">GitHub</span>}
                {has('second factor') && <span className="id-2fa">then a second factor</span>}
                {!on.slice(0, 4).some(Boolean) && <span className="id-none">Choose at least one way in.</span>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Add sign-in: a rounded black card inside the gutters that opens to full width as it is reached */
function Add() {
  const room = useRef(null);
  useEffect(() => {
    const el = room.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.setAttribute('data-open', ''); io.disconnect(); } }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <section className="id-add" aria-labelledby="id-add-h">
      <div className="id-add-room v2-dark" data-room="dark" ref={room}>
        <div className="v2-wrap v2-grid">
          <div className="id-add-l">
            <h2 id="id-add-h" className="v2-display m">Add sign-in</h2>
            <p className="v2-lede">Register the app, set the callback your framework already uses, install the SDK. That is the whole integration.</p>
            <div className="v2-acts"><Cta to="/login" id="identity.mid">Try Hanzo</Cta><Cta to="https://docs.hanzo.ai/docs/openapi/iam" kind="link" id="identity.read-documentation">Read Documentation</Cta></div>
          </div>
          <ol className="id-three" aria-hidden="true">
            {['Register the app', 'set the callback', 'install the SDK'].map((s, i) => <li key={s} style={{ '--k': i }}><span>{i + 1}</span>{s}</li>)}
          </ol>
        </div>
      </div>
    </section>
  );
}

export default function Identity() {
  return (
    <main className="v2 id">
      <Pin />
      <Does />
      <Large />
      <Wear />
      <Add />
      <section className="id-end">
        <div className="v2-wrap id-end-in">
          <h2 className="v2-display">Get started with Identity</h2>
          <div className="v2-acts"><Cta to="/login" id="identity.close">Try Hanzo</Cta><Cta to="https://docs.hanzo.ai/docs/projects/hanzoai/iam" kind="link" id="identity.read-the-docs">Read the docs</Cta><Cta to="https://github.com/hanzoai" kind="link" id="identity.view-on-github">View on GitHub</Cta></div>
        </div>
      </section>
    </main>
  );
}
