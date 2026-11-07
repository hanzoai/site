'use client';
/* Identity (v2, archetype A Launch).
   V2: 8/10 The hosted sign-in card is the hero and never leaves: the first screen pins, and as you scroll the title gives way to three chapters while the same card signs someone in, shows what the token carries and lights every app; features as a bento of tiles; large-organization detail in tabs; wear-your-name.
   Signature: the card that never leaves. The hosted hanzo.id sign-in card sits beside the title signing someone in by
   itself (password, then a second factor). Scroll, and the first screen pins: the title steps out and the three stages
   step in one at a time while the same card changes to show each one - the ways in, what the token carries, one
   session lighting every app in the organization.
   Supporting: kinetic title lines; "What it does" as a bento of tiles, each with its own small drawing; the large-org
   detail in tabs (all of it in the HTML).
   Beyond: "Wear your name" - type your hostname and your name, choose the ways in, and the hosted card redraws
   white-labelled as yours. Nothing is saved or sent.
   Accent: rose, from the sign-in button. Every word and link is Hanzo's; the hostname is an example. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'motion/react';
import { A } from '../../kit';
import { useLive } from './Frame';
import { Lines } from '../../v2/LiftStage';
import '../../v2/v2scale.css';
import './Identity.css';

const EASE = [0.16, 1, 0.3, 1];

const STAGES = [
  ['Signing in', 'A password, a passkey, or a Google or GitHub account. A second factor when the organization asks for one.'],
  ['What the token carries', 'Who signed in, which organizations they belong to, and the role they hold where they asked to act.'],
  ['One sign-in, every app', 'Sign in once and the session is good across every app in the organization, including ours.'],
];

/* The hosted card. at 0: signing someone in by itself; 1 the ways in; 2 the token; 3 every app. */
function SignCard({ at }) {
  const [ref, live] = useLive(0.3);
  const [t, setT] = useState(0); // hero loop: 0 password, 1 continue, 2 code, 3 signed in
  useEffect(() => {
    if (!live || at !== 0) return;
    const id = setTimeout(() => setT((v) => (v + 1) % 4), [1700, 700, 1900, 1900][t]);
    return () => clearTimeout(id);
  }, [t, live, at]);
  const [w, setW] = useState(0); // which way in is lit
  useEffect(() => {
    if (!live || at !== 1) return;
    const id = setInterval(() => setW((v) => (v + 1) % 5), 900);
    return () => clearInterval(id);
  }, [live, at]);
  return (
    <div className="id-card" ref={ref} aria-hidden="true">
      <p className="id-url"><i />hanzo.id</p>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={at} className="id-screen" initial={{ opacity: 0, y: 16, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, transition: { duration: 0.18 } }} transition={{ duration: 0.55, ease: EASE }}>
          {at === 0 && (
            <div className="id-form">
              <p className="id-t">Sign in</p>
              <span className={'id-field' + (t === 0 ? ' typing' : '')}><em>password</em><b>{t === 0 ? '' : '••••••••••'}</b></span>
              <span className={'id-go' + (t === 1 ? ' press' : '')}>Continue</span>
              <div className={'id-code' + (t >= 2 ? ' on' : '')}>
                <p>second factor</p>
                <div>{[0, 1, 2, 3, 4, 5].map((k) => <i key={k} style={{ transitionDelay: t >= 2 ? k * 0.18 + 's' : '0s' }} />)}</div>
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
              <div>{Array.from({ length: 9 }).map((_, i) => <motion.i key={i} initial={{ opacity: 0.15, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 + i * 0.09, type: 'spring', stiffness: 300, damping: 22 }} />)}</div>
              <p>one session</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* The first screen pins: the title, then the three stages, while the card stays. */
function Pin() {
  const sec = useRef(null);
  const [at, setAt] = useState(0);
  const [wide, setWide] = useState(true);
  const arts = useRef([]);
  const { scrollYProgress } = useScroll({ target: sec, offset: ['start start', 'end end'] });
  useEffect(() => { const m = matchMedia('(min-width: 901px)'); const f = () => setWide(m.matches); f(); m.addEventListener('change', f); return () => m.removeEventListener('change', f); }, []);
  useMotionValueEvent(scrollYProgress, 'change', (p) => { if (wide) setAt(Math.max(0, Math.min(3, Math.floor(p * 4 * 0.9999)))); });
  useEffect(() => {
    if (wide) return;
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setAt(+e.target.dataset.i)), { rootMargin: '-50% 0px -45% 0px' });
    arts.current.forEach((a) => a && io.observe(a));
    return () => io.disconnect();
  }, [wide]);
  const layer = (i) => ({ ref: (el) => (arts.current[i] = el), 'data-i': i, 'data-on': at === i ? '' : undefined, 'data-past': at > i ? '' : undefined });
  return (
    <section ref={sec} className="id-pin" aria-label="Hanzo Identity">
      <div className="id-pin-stage">
        <div className="v2-wrap v2-grid id-pin-grid">
          <div className="id-layers">
            <div className="id-layer id-hero" {...layer(0)}>
              <p className="v2-kick acc">Sign-in</p>
              <Lines as="h1" className="v2-display id-h1" lines={['Hanzo', 'Identity']} data-morph-target="" />
              <p className="v2-lede id-sub">The sign-in your users actually see.</p>
              <div className="v2-acts">
                <A to="/login" className="v2-btn solid">Try Hanzo</A>
                <A to="https://docs.hanzo.ai/docs/openapi/iam" className="v2-btn">View Documentation</A>
              </div>
            </div>
            {STAGES.map(([t, d], i) => (
              <article key={t} className="id-layer id-stage" {...layer(i + 1)}>
                <p className="v2-kick acc">{String(i + 1).padStart(2, '0')} / 03</p>
                <h2 className="v2-headline"><span>{t}</span></h2>
                <p className="v2-body">{d}</p>
              </article>
            ))}
          </div>
          <div className="id-card-wrap"><SignCard at={at} /></div>
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

/* each tile's small drawing, from its own words */
function Glyph({ k }) {
  if (k === 'code') return <div className="id-g-code">{[0, 1, 2, 3, 4, 5].map((i) => <i key={i} />)}</div>;
  if (k === 'people') return <div className="id-g-people">{[0, 1, 2, 3, 4].map((i) => <i key={i} />)}<span>SCIM 2.0</span></div>;
  if (k === 'sso') return <div className="id-g-sso"><span>client id</span><span>client id</span><span>client id</span><b>authorize</b></div>;
  if (k === 'places') return <div className="id-g-places"><span>organization<span>workspace<span>project</span></span></span></div>;
  if (k === 'key') return <div className="id-g-key"><svg viewBox="0 0 48 48" width="56" height="56"><path d="M24 6c-7 0-12 5-12 12v6M36 24v-6c0-3-1-6-3-8M18 42c-2-4-3-9-3-14 0-5 4-9 9-9s9 4 9 9c0 3 0 6-1 9M24 27c0 6-1 11-4 15M29 40c1-3 2-7 2-12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /></svg><span>WebAuthn</span></div>;
  return <div className="id-g-log">{['write', 'write', 'write'].map((t, i) => <p key={i}><i />{t}</p>)}<p className="no"><i />edit</p></div>;
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
            <button key={t} type="button" role="tab" id={'id-t' + i} aria-selected={at === i} aria-controls={'id-p' + i} onClick={() => setAt(i)}>
              {at === i && <motion.span layoutId="id-tab" className="id-tab-bg" transition={{ type: 'spring', stiffness: 300, damping: 30 }} />}
              <span className="id-tab-t">{t}</span>
            </button>
          ))}
        </div>
        {LARGE.map(([t, d, pts], i) => (
          <div key={t} id={'id-p' + i} role="tabpanel" aria-labelledby={'id-t' + i} hidden={at !== i} className="id-panel">
            <div className="id-panel-l">
              <p className="v2-kick acc">{String(i + 1).padStart(2, '0')} / 04</p>
              <h3 className="v2-headline">{t}</h3>
              <p className="v2-body">{d}</p>
            </div>
            <ul className="id-checks">{pts.map((p) => <li key={p}><i aria-hidden="true">✓</i>{p}</li>)}</ul>
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
          <p className="v2-kick acc">White-labelled by hostname</p>
          <h2 className="v2-display s">Wear your name</h2>
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

export default function Identity() {
  return (
    <main className="v2 id">
      <Pin />

      <section className="v2-sec id-does">
        <div className="v2-wrap">
          <div className="v2-grid id-does-h">
            <h2 className="v2-display s">What it does</h2>
            <p className="v2-lede">Standards, not a proprietary protocol. If your framework can read an OpenID Connect discovery document, it can already talk to this.</p>
          </div>
          <div className="id-bento">
            {DOES.map(([t, d, g], i) => (
              <article key={t} className={'id-tile t' + i}>
                <div className="id-tile-g" aria-hidden="true"><Glyph k={g} /></div>
                <h3 className="v2-title">{t}</h3>
                <p>{d}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Large />

      <Wear />

      <section className="id-add v2-dark" data-room="dark">
        <div className="v2-wrap v2-grid">
          <div className="id-add-l">
            <h2 className="v2-display m">Add sign-in</h2>
            <p className="v2-lede">Register the app, set the callback your framework already uses, install the SDK. That is the whole integration.</p>
            <div className="v2-acts"><A to="/login" className="v2-btn solid">Try Hanzo</A><A to="https://docs.hanzo.ai/docs/openapi/iam" className="v2-btn">Read Documentation</A></div>
          </div>
          <ol className="id-three" aria-hidden="true">
            {['Register the app', 'set the callback', 'install the SDK'].map((s, i) => <li key={s}><span>{i + 1}</span>{s}</li>)}
          </ol>
        </div>
      </section>

      <section className="id-end">
        <div className="v2-wrap id-end-in">
          <h2 className="v2-display">Get started with Identity</h2>
          <div className="v2-acts"><A to="https://docs.hanzo.ai/docs/projects/hanzoai/iam" className="v2-btn solid">Read the docs</A><A to="https://github.com/hanzoai" className="v2-btn">View on GitHub</A></div>
        </div>
      </section>
    </main>
  );
}
