'use client';
// Persona: a product team that needs sign-in for its own users.
// Goal: see the hosted sign-in working, what the token carries, and one session across every app.
// CTA: Try Hanzo (identity.hero, identity.mid, identity.close).
// Metric: signup_start (cta_click identity.hero)
// Motion map: signature spotlight; entrances line-draw, ink-spread, typewriter, stretch-scroll, conveyor
// Signature: spotlight. "Add sign-in" is a dark room the cursor lights up: under the light, each step shows what it makes (the client id, authorize to callback, the SDK's runtimes). Touch: tap to place the light; keyboard: the steps (and arrow keys) move it.
// Beyond: white-labelled by hostname: the hosted card redrawn from your hostname, your mark and the ways in.
/* Identity (v2, archetype A Launch).
   V2: 8/10 motion map: no pinned scene; the hosted card leads and re-hosts itself on a customer's hostname; the dark Add sign-in room is the spotlight (second screen); five page-local entrances in order: the room's outline draws then fills (line-draw), the three stages spread in by ink (ink-spread), "What it does" types itself (typewriter), the large-organization panel stretches with scroll (stretch-scroll), the white-label card and form ride in on a conveyor (conveyor)
   C1 (7 Nov): the first screen is Identity's own, not /iam's split: the title centred over a fan of three hosted cards
   (before: the ways in; live: re-hosting on a customer's hostname and signing in; after: every app), the side cards
   sliding out from behind and parting toward the pointer. The motion-map CSS that was missing is written (spotlight
   layers, line-draw room, ink-spread stages, typewriter, stretch panel, conveyor form); the token rows and the
   append-only log run while seen (pausable); phone stages stack.
   Signature: spotlight. The hosted card leads the first screen (its address bar rewrites from hanzo.id to a
   customer's hostname, then it signs someone in by itself). Next, the dark Add sign-in room: the cursor is a light;
   what sits under it (the client id, authorize to callback, the runtimes) comes up to full ink, the rest stays dim.
   Untouched, the light walks the three steps in turn; a tap places it; the steps and arrow keys move it.
   Supporting: kinetic title lines; the three stages as rows, each with the hosted card in that stage; "What it does"
   as a bento of tiles, each with its own small drawing; the large-organization tabs, each driving a drawing made from
   its own words.
   Beyond: white-labelled by hostname - type your hostname and your mark, choose the ways in, and the hosted card redraws
   as yours. Nothing is saved or sent. The close: every app in the organization at rest, growing once as it arrives.
   Greys only (Hanzo's deck). Every word and link is Hanzo's; state is shown by shape (tick, fill, outline); the app
   marks are drawn shapes, not anyone's logo.
   CTA: Try Hanzo (hero, Add sign-in and the close; one solid button per screen, the others text links). */
import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent, PointerEvent, RefObject } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { A, Cta } from '../../kit';
import { useLive } from './Frame';
import { Lines, useTick } from '../../v2/LiftStage';
import LivePause, { usePause } from '../../v2/LivePause';
import '../../v2/v2scale.css';
import './Identity.css';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

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

/* page-local entrance trigger: sets data-in once, when the element's top passes 75% of the screen. It writes a DOM
   attribute after mount (never React state), so server and first client render always match. */
function useIn() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.setAttribute('data-in', ''); io.disconnect(); } }, { rootMargin: '0px 0px -25% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

/* The hosted card in the hero: re-hosted on a customer's hostname, then signing someone in by itself.
   Server and first client render are the same frame (hanzo.id, empty field). */
function SignCard() {
  const [ref, seen, calm] = useLive(0.3);
  const [paused, togglePause] = usePause();
  const live = seen && !paused;
  // hero loop: 0 hanzo.id, 1 the hostname rewrites, 2 password, 3 go, 4 code, 5 signed in
  const [t, setT] = useState(0);
  useEffect(() => { if (calm) setT(5); }, [calm]);
  useEffect(() => {
    if (!live) return;
    const id = setTimeout(() => setT((v) => (v + 1) % 6), [900, 1500, 1500, 700, 1800, 2000][t]);
    return () => clearTimeout(id);
  }, [t, live]);
  const at = 0;
  const theirs = t >= 1;
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
        <div className="id-screen">
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
        </div>
      </div>
    </div>
  );
}

/* the same hosted card in each of the three stages: 1 the ways in (lit in turn), 2 the token, 3 every app.
   The token rows and app marks arrive with the stages' entrance (CSS, keyed on the section's data-in). */
function StageCard({ i }: { i: number }) {
  const [ref, live] = useLive(0.4);
  const [paused, togglePause] = usePause();
  const [w, setW] = useState(0); // which way in (stage 1) or which claim (stage 2) is lit
  useTick(i === 1 ? 900 : 1300, i < 3 && live && !paused, () => setW((v) => (v + 1) % (i === 1 ? 5 : 3)));
  return (
    <div className="lp-host id-st-host" ref={ref}>
      {i < 3 && <LivePause paused={paused} onToggle={togglePause} className="id-pause" />}
      <div className="id-card st" aria-hidden="true">
        <p className="id-url"><i /><span className="id-host"><span className="id-host-t">hanzo.id</span></span></p>
        <div className="id-screen">
          {i === 1 && (
            <div className="id-form">
              <p className="id-t">Sign-in</p>
              <span className={'id-field' + (w === 0 ? ' lit' : '')}><b>••••••••••</b></span>
              <span className={'id-btn dark' + (w === 1 ? ' lit' : '')}>passkey</span>
              <span className={'id-btn' + (w === 2 ? ' lit' : '')}>Google</span>
              <span className={'id-btn' + (w === 3 ? ' lit' : '')}>GitHub</span>
              <span className={'id-2fa' + (w === 4 ? ' lit' : '')}>{[0, 1, 2, 3, 4, 5].map((k) => <i key={k} />)}</span>
            </div>
          )}
          {i === 2 && (
            <div className="id-token">
              <p className="id-t">token</p>
              {CLAIMS.map((g, k) => <p key={k} className={w === k ? 'lit' : undefined} style={{ '--k': k }}><b>{g}</b><span className="id-mask">{'•'.repeat([9, 13, 7][k])}</span></p>)}
            </div>
          )}
          {i === 3 && (
            <div className="id-apps">
              <div>
                {MARKS.map((m, k) => (
                  <i key={k} style={{ '--k': k }}><svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" stroke="currentColor" strokeWidth="0">{m}</svg></i>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* a tile leans toward a fine pointer (2.5° at most); touch: nothing */
function lean(e: PointerEvent<HTMLElement>) {
  if (e.pointerType !== 'mouse') return;
  const el = e.currentTarget;
  if (el.hasAttribute('data-open')) return; // an open tile holds still so its words are sharp
  const r = el.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
  el.style.setProperty('--ry', ((x - 0.5) * 5).toFixed(2) + 'deg');
  el.style.setProperty('--rx', ((0.5 - y) * 5).toFixed(2) + 'deg');
}
function unlean(e: PointerEvent<HTMLElement>) { const s = e.currentTarget.style; s.setProperty('--ry', '0deg'); s.setProperty('--rx', '0deg'); }

/* the two cards fanned behind the live one: the same hosted sign-in, before (the ways in) and after (every app). They
   slide out from behind it as the page arrives and part a little toward a fine pointer. */
function Ghost({ k }: { k: number }) {
  return (
    <div className="id-card ghost" aria-hidden="true">
      <p className="id-url"><i /><span className="id-host"><span className="id-host-t">{k ? THEIRS : 'hanzo.id'}</span></span></p>
      <div className="id-screen">
        {k === 0 ? (
          <div className="id-form">
            <p className="id-t">Sign-in</p>
            <span className="id-btn dark">passkey</span>
            <span className="id-btn">Google</span>
            <span className="id-btn">GitHub</span>
          </div>
        ) : (
          <div className="id-apps"><div>{MARKS.map((m, i) => <i key={i}><svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" stroke="currentColor" strokeWidth="0">{m}</svg></i>)}</div></div>
        )}
      </div>
    </div>
  );
}
function part(e: PointerEvent<HTMLElement>) {
  if (e.pointerType !== 'mouse') return;
  const r = e.currentTarget.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
  const s = e.currentTarget.style;
  s.setProperty('--px', x.toFixed(3));
  s.setProperty('--ry', (x * 5).toFixed(2) + 'deg');
  s.setProperty('--rx', (-y * 5).toFixed(2) + 'deg');
}
function unpart(e: PointerEvent<HTMLElement>) { const s = e.currentTarget.style; s.setProperty('--px', '0'); s.setProperty('--ry', '0deg'); s.setProperty('--rx', '0deg'); }

/* The first screen, Identity's own: the title centred over a fan of hosted cards. The middle one is live (it re-hosts
   itself on a customer's hostname, then signs someone in); behind it, the same card before and after. */
function Hero() {
  return (
    <section className="id-hero-s" aria-label="Hanzo Identity">
      <div className="v2-wrap id-hero">
        <Lines as="h1" className="v2-display id-h1" lines={['Hanzo Identity']} data-morph-target="" />
        <p className="v2-lede id-sub v2-in" style={{ animationDelay: '.3s' }}>The sign-in your users actually see.</p>
        <div className="v2-acts id-hero-acts">
          <Cta to="/login" id="identity.hero" thumb>Try Hanzo</Cta>
          <Cta to="https://docs.hanzo.ai/docs/openapi/iam" kind="link" id="identity.view-documentation">View Documentation</Cta>
        </div>
      </div>
      <div className="id-fan" onPointerMove={part} onPointerLeave={unpart}>
        <div className="id-fan-side l"><Ghost k={0} /></div>
        <div className="id-card-wrap"><SignCard /></div>
        <div className="id-fan-side r"><Ghost k={1} /></div>
      </div>
    </section>
  );
}

/* Entrance 2, ink-spread: the three stages, each a row with the hosted card in that stage, revealed by an organic
   ink-blot mask that spreads from the centre. The 0N / 03 caption sits under each heading. */
function Stages() {
  const ref = useIn();
  return (
    <section className="v2-sec id-stages" data-entrance="ink-spread" ref={ref}>
      <div className="v2-wrap id-ink">
        {STAGES.map(([t, d], i) => (
          <article key={t} className={'id-stage-row r' + i}>
            <div className="id-stage-txt">
              <h2 className="v2-headline">{t}</h2>
              <p className="id-stage-n x-mono" aria-hidden="true"><span>{String(i + 1).padStart(2, '0')} / 03</span>{STAGES.map(([k], j) => <i key={k} data-on={j <= i || undefined} />)}</p>
              <p className="v2-body">{d}</p>
            </div>
            <div className="id-stage-card"><StageCard i={i + 1} /></div>
          </article>
        ))}
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
function Glyph({ k, paused }: { k: string; paused: boolean }) {
  if (k === 'code') return <div className="id-g-code">{[0, 1, 2, 3, 4, 5].map((i) => <i key={i} style={{ '--k': i }} />)}</div>;
  if (k === 'people') return <div className="id-g-people">{[0, 1, 2, 3, 4].map((i) => <i key={i} style={{ '--k': i }}>{PERSON}</i>)}<span>SCIM 2.0</span></div>;
  if (k === 'sso') return <div className="id-g-sso"><span style={{ '--k': 0 }}>client id</span><span style={{ '--k': 1 }}>client id</span><span style={{ '--k': 2 }}>client id</span><b>authorize</b></div>;
  if (k === 'places') return <div className="id-g-places"><span>organization<span>workspace<span>project</span></span></span></div>;
  if (k === 'key') return <div className="id-g-key"><svg viewBox="0 0 48 48" width="56" height="56"><path d="M24 6c-7 0-12 5-12 12v6M36 24v-6c0-3-1-6-3-8M18 42c-2-4-3-9-3-14 0-5 4-9 9-9s9 4 9 9c0 3 0 6-1 9M24 27c0 6-1 11-4 15M29 40c1-3 2-7 2-12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /></svg><span>WebAuthn</span></div>;
  return <LogGlyph paused={paused} />;
}

/* the append-only log, live: while it is on screen a new write lands at the foot every 2.6 s and the oldest leaves; the
   struck "edit" never arrives. Pausable; reduced motion holds three writes still. */
function LogGlyph({ paused }: { paused: boolean }) {
  const [ref, live] = useLive(0.4);
  const [n, setN] = useState(3);
  useTick(2600, live && !paused, () => setN((v) => v + 1));
  return (
    <div className="id-g-log" ref={ref}>
      <div className="id-log-rows">{[n - 3, n - 2, n - 1].map((k) => <p key={k} style={{ '--k': k % 3 }}><i />write</p>)}</div>
      <p className="no"><i />edit</p>
    </div>
  );
}

/* a tile: its drawing and title at rest; the + opens Hanzo's sentence over the drawing, so the grid never moves */
function Tile({ t, d, g, i }: { t: string; d: string; g: string; i: number }) {
  const [open, setOpen] = useState(false);
  const [paused, togglePause] = usePause(); // only the live log uses it
  const toggle = () => setOpen((o) => !o);
  return (
    <article className={'id-tile t' + i} data-open={open || undefined} onPointerMove={lean} onPointerLeave={unlean} onClick={toggle}>
      {g === 'log' && <span className="id-log-p" onClick={(e) => e.stopPropagation()}><LivePause paused={paused} onToggle={togglePause} className="id-pause" /></span>}
      <div className="id-tile-g" aria-hidden="true"><Glyph k={g} paused={paused} /></div>
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

/* Entrance 3, typewriter: the heading types itself out with a caret. Every letter is in the server HTML; before the
   section arrives (JS on) the letters are hidden and they appear one by one; reduced motion and JS off show them all. */
function Typed({ text }: { text: string }) {
  let n = 0;
  const words = text.split(' ');
  return (
    <>
      <span className="id-sr">{text}</span>
      <span aria-hidden="true">
        {words.map((w, wi) => (
          <span key={wi} className="id-tw-w">
            {[...w].map((c, ci) => { const k = n++; return <span key={ci} className={'id-tw-c' + (k === text.replace(/ /g, '').length - 1 ? ' last' : '')} style={{ '--i': k + wi }}>{c}</span>; })}
            {wi < words.length - 1 ? ' ' : ''}
          </span>
        ))}
      </span>
    </>
  );
}

function Does() {
  const sec = useIn();
  const box = useRef<HTMLDivElement>(null);
  // each drawing plays once as its tile arrives
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.setAttribute('data-in', ''); io.unobserve(e.target); } }), { threshold: 0.4 });
    box.current?.querySelectorAll('.id-tile').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return (
    <section className="v2-sec id-does" data-entrance="typewriter" ref={sec}>
      <div className="v2-wrap">
        <div className="v2-grid id-does-h">
          <h2 className="v2-display s id-tw"><Typed text="What it does" /></h2>
          <p className="v2-lede">Standards, not a proprietary protocol. If your framework can read an OpenID Connect discovery document, it can already talk to this.</p>
        </div>
        <div className="id-bento" ref={box}>
          {DOES.map(([t, d, g], i) => <Tile key={t} t={t} d={d} g={g} i={i} />)}
        </div>
      </div>
    </section>
  );
}

const LARGE: [string, string, string[]][] = [
  ['Where the data sits', 'An organization is a tenancy boundary, and the boundary is enforced by the code that reads the token rather than by a column somebody has to remember to filter on.', ['Enterprise security with GDPR and privacy controls', 'Self-host it, in your own region, on your own cluster', 'One Go binary, embedded SQLite by default — nothing to run beside it']],
  ['Bring the identity you already have', 'Point Identity at your own issuer and it becomes the entry point without becoming the record.', ['Federate to any OpenID Connect issuer by naming its discovery URL', 'SCIM 2.0 provisioning, so joiners and leavers arrive from your directory', 'White-labelled by hostname — your mark on your domain, never ours']],
  ['Signing up your customers', 'An organization can hold its own customers as sub-organizations, so a business you serve manages its people without any of it reaching yours.', ['Sign in with Google or GitHub, or with any issuer you add', 'A consent screen the person has to pass before an app gets a token', 'Org admins manage their own members without platform access']],
  ['What you write', 'Almost nothing. Nobody should be hand-rolling OAuth in 2026, and with this you do not.', ['One SDK with an entry point per runtime — server, React, browser, Next.js, Passport', 'An OpenAPI 3.1 description generated from the handlers themselves', 'The sign-in page is hosted and already built — you send people to it']],
];
const RUNTIMES = ['server', 'React', 'browser', 'Next.js', 'Passport'];

/* each tab's drawing, made only from that tab's own words; it plays when the tab opens */
function LargeArt({ i }: { i: number }) {
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

/* Entrance 4, stretch-scroll: the panel arrives stretched and relaxes; while it is on screen it stretches a little
   with scroll speed (at most 6%) and relaxes when the scroll stops. Transform only; off under reduced motion. */
function useStretch(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let on = false, y = scrollY, tm = 0;
    let rest: ReturnType<typeof setTimeout> | undefined;
    const io = new IntersectionObserver(([e]) => { on = e.isIntersecting; }, { threshold: 0 });
    io.observe(el);
    const onScroll = () => {
      if (!on) { y = scrollY; return; }
      const now = performance.now(), dt = Math.max(16, now - tm), v = Math.abs(scrollY - y) / dt;
      y = scrollY; tm = now;
      el.style.setProperty('--st', (1 + Math.min(0.06, v * 0.03)).toFixed(3));
      clearTimeout(rest);
      rest = setTimeout(() => el.style.setProperty('--st', '1'), 140);
    };
    addEventListener('scroll', onScroll, { passive: true });
    return () => { io.disconnect(); removeEventListener('scroll', onScroll); clearTimeout(rest); };
  }, [ref]);
}

function Large() {
  const [at, setAt] = useState(0);
  const sec = useIn();
  const stretch = useRef<HTMLDivElement>(null);
  useStretch(stretch);
  return (
    <section className="v2-sec id-large" data-entrance="stretch-scroll" ref={sec}>
      <div className="v2-wrap">
        <div className="v2-grid id-large-h">
          <h2 className="v2-display s">Running it for a large organization</h2>
          <p className="v2-lede">The same service, wearing your name, on hardware you choose.</p>
        </div>
        <div className="id-stretch" ref={stretch}>
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
      </div>
    </section>
  );
}

const WAYS = ['password', 'passkey', 'Google', 'GitHub', 'second factor'];
const HOST = /^(?=.{1,253}$)([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/;

/* the hosted card, white-labelled: your hostname in the bar, your mark on the page, the ways in you chose */
interface Brand { host: string; name: string; on: boolean[] }

function Branded({ brand, small }: { brand: Brand; small?: boolean }) {
  const { host, name, on } = brand;
  const h = host.trim().toLowerCase();
  const ok = HOST.test(h);
  const who = name.trim();
  const has = (w: string) => on[WAYS.indexOf(w)];
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
/* Entrance 5, conveyor: the form's parts and the hosted card ride in from the right on a horizontal belt, one after
   another, and stop in place; the belt line runs only while they ride. */
function Wear({ brand, set }: { brand: Brand; set: (b: Brand) => void }) {
  const ok = HOST.test(brand.host.trim().toLowerCase());
  const sec = useIn();
  return (
    <section className="v2-sec id-wear" aria-labelledby="id-wl" data-entrance="conveyor" ref={sec}>
      <i className="id-belt" aria-hidden="true" />
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

/* Signature, spotlight: Add sign-in is a dark room the cursor lights up. Each step's row holds what it makes (the client
   id, authorize to callback, the runtimes), dim; under the light it comes up to full ink. Untouched, the light walks
   the steps in turn; a tap places it (and picks the step under it); the steps and the arrow keys move it.
   Entrance 1, line-draw: the room's rounded outline draws itself, then it fills black and opens to full width. */
const STEPS = ['Register the app', 'set the callback', 'install the SDK'];
const KEYICON = <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><circle cx="8" cy="12" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.8" /><path d="M12.5 12H21M18 12v3M21 12v2.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>;
function Made({ i }: { i: number }) {
  if (i === 0) return <span className="id-made-id">{KEYICON}<span className="id-made-dots">{Array.from({ length: 4 }, (_, k) => <span key={k}>••••</span>)}</span></span>;
  if (i === 1) return <span className="id-made-flow"><b>authorize</b><em>{ARROW}</em><b className="lit">callback</b></span>;
  return <span className="id-made-rt">{RUNTIMES.map((r) => <i key={r}>{r}</i>)}</span>;
}
function Add() {
  const sec = useIn();
  const spot = useRef<HTMLDivElement | null>(null);
  const btns = useRef<(HTMLButtonElement | null)[]>([]);
  const [ref, live] = useLive<HTMLDivElement>(0.4); // live is false under reduced motion, so the light rests on the chosen step
  const [step, setStep] = useState(0);
  const [held, setHeld] = useState(false);
  const [hand, setHand] = useState(false); // a pointer is driving the light
  useTick(2400, live && !held && !hand, () => setStep((s) => (s + 1) % 3));
  // the light sits on the chosen step's row unless a pointer is moving it
  const toRow = (i: number) => {
    const s = spot.current, r = s?.querySelectorAll('.id-spot-row')[i];
    if (!s || !r) return;
    const a = s.getBoundingClientRect(), b = r.getBoundingClientRect();
    s.style.setProperty('--id-mx', (b.left - a.left + b.width * 0.62).toFixed(0) + 'px');
    s.style.setProperty('--id-my', (b.top - a.top + b.height / 2).toFixed(0) + 'px');
  };
  useEffect(() => { if (!hand) toRow(step); }, [step, hand]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { const f = () => { if (!hand) toRow(step); }; addEventListener('resize', f); return () => removeEventListener('resize', f); });
  const rowAt = (y: number) => {
    const rows = [...(spot.current?.querySelectorAll('.id-spot-row') || [])];
    const k = rows.findIndex((r) => { const b = r.getBoundingClientRect(); return y >= b.top && y <= b.bottom; });
    return k;
  };
  const place = (e: PointerEvent) => {
    const s = spot.current;
    if (!s) return;
    const a = s.getBoundingClientRect();
    s.style.setProperty('--id-mx', (e.clientX - a.left).toFixed(0) + 'px');
    s.style.setProperty('--id-my', (e.clientY - a.top).toFixed(0) + 'px');
    const k = rowAt(e.clientY);
    if (k >= 0 && k !== step) setStep(k);
  };
  const onMove = (e: PointerEvent) => { if (e.pointerType !== 'mouse') return; setHand(true); place(e); };
  const onDown = (e: PointerEvent) => { if (e.pointerType === 'mouse') return; setHeld(true); place(e); };
  const pick = (i: number) => { setStep(i); setHeld(true); setHand(false); };
  const onKey = (e: KeyboardEvent) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    e.preventDefault();
    const i = (step + (e.key === 'ArrowDown' ? 1 : 2)) % 3;
    pick(i); btns.current[i]?.focus();
  };
  return (
    <section className="id-add" aria-labelledby="id-add-h" data-entrance="line-draw" ref={sec}>
      <div className="id-add-room v2-dark" data-room="dark">
        <svg className="id-ld" aria-hidden="true"><rect pathLength="1" /></svg>
        <div className="v2-wrap v2-grid id-add-in">
          <div className="id-add-l">
            <h2 id="id-add-h" className="v2-display s">Add sign-in</h2>
            <p className="v2-lede">Register the app, set the callback your framework already uses, install the SDK. That is the whole integration.</p>
            <div className="v2-acts"><Cta to="/login" id="identity.mid">Try Hanzo</Cta><Cta to="https://docs.hanzo.ai/docs/openapi/iam" kind="link" id="identity.read-documentation">Read Documentation</Cta></div>
          </div>
          <div className="id-spot" ref={(el) => { spot.current = el; ref.current = el; }} data-hand={hand || undefined} onPointerMove={onMove} onPointerLeave={() => setHand(false)} onPointerDown={onDown}>
            <div className="id-spot-l base" role="group" aria-label="Add sign-in" onKeyDown={onKey}>
              {STEPS.map((t, i) => (
                <div key={t} className="id-spot-row" data-on={step === i || undefined}>
                  <button type="button" ref={(el) => { btns.current[i] = el; }} aria-pressed={step === i} onClick={() => pick(i)} onFocus={() => { if (step !== i) pick(i); }}>
                    <span className="id-step-n">{i + 1}</span>{t}
                  </button>
                  <span className="id-spot-made" aria-hidden="true"><Made i={i} /></span>
                </div>
              ))}
            </div>
            <div className="id-spot-l lit" aria-hidden="true">
              {STEPS.map((t, i) => (
                <div key={t} className="id-spot-row" data-on={step === i || undefined}>
                  <span className="id-spot-b"><span className="id-step-n">{i + 1}</span>{t}</span>
                  <span className="id-spot-made"><Made i={i} /></span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* the close: every app in the organization, at rest. As it is reached it grows past its resting size, then settles. */
function EndApps() {
  const box = useRef<HTMLDivElement>(null);
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
  const [brand, setBrand] = useState<Brand>({ host:
 'hanzo.id', name: 'Hanzo', on: [true, true, true, false, true] });
  return (
    <main className="v2 id">
      <Hero />
      <Add />
      <Stages />
      <Does />
      <Large />
      <Wear brand={brand} set={setBrand} />
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
