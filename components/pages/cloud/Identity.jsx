'use client';
/* Identity. Signature: the sign-in page your users see, working. The hosted hanzo.id card signs someone in (a password,
   a passkey, Google or GitHub), shows what the token carries (who, which organizations, the role where they act), then
   the same session lights every app in the organization. Below: what it does as a staggered two-column text, the four
   ways a large organization runs it as rows with their checklists, and the three-step integration in the dark room.
   Beyond: "Wear your name" - type your hostname and your name, choose the ways in, and the hosted sign-in card
   redraws white-labelled as yours. Every word and link is Hanzo's; the hostname is an example. */
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EASE, Rise } from '../../ui';
import { A } from '../../kit';
import { Hero, Head, useLive, useSteps } from './Frame';
import './Identity.css';

const STAGES = [
  ['Signing in', 'A password, a passkey, or a Google or GitHub account. A second factor when the organization asks for one.'],
  ['What the token carries', 'Who signed in, which organizations they belong to, and the role they hold where they asked to act.'],
  ['One sign-in, every app', 'Sign in once and the session is good across every app in the organization, including ours.'],
];

function Card() {
  const [ref, live] = useLive(0.3);
  const [at, choose] = useSteps(3, 4200, live);
  return (
    <div className="id-stage" ref={ref}>
      <ol className="id-tabs">
        {STAGES.map(([t, d], i) => (
          <li key={t}>
            <button type="button" className={at === i ? 'on' : ''} onClick={() => choose(i)} aria-pressed={at === i}>
              <span className="id-n">{String(i + 1).padStart(2, '0')} / 03</span>
              <b>{t}</b>
              <span className="id-d">{d}</span>
            </button>
          </li>
        ))}
      </ol>
      <div className="id-phone" aria-hidden="true">
        <p className="id-url">hanzo.id</p>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={at} className="id-screen" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8, transition: { duration: 0.18 } }} transition={{ duration: 0.4, ease: EASE }}>
            {at === 0 && (
              <div className="id-form">
                <span className="id-field"><i />password</span>
                <span className="id-btn dark">passkey</span>
                <span className="id-or">or</span>
                <span className="id-btn">Google</span>
                <span className="id-btn">GitHub</span>
                <motion.span className="id-2fa" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.6 }}>second factor ✓</motion.span>
              </div>
            )}
            {at === 1 && (
              <div className="id-token">
                {[['who', 'signed in'], ['organizations', 'they belong to'], ['role', 'where they act']].map(([k, v], i) => (
                  <motion.p key={k} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.25, duration: 0.4, ease: EASE }}><b>{k}</b><span>{v}</span></motion.p>
                ))}
              </div>
            )}
            {at === 2 && (
              <div className="id-apps">
                {Array.from({ length: 9 }).map((_, i) => <motion.i key={i} initial={{ opacity: 0.2, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 + i * 0.12, type: 'spring', stiffness: 320, damping: 20 }} />)}
                <p>one session</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

const DOES = [
  ['A second factor', "An authenticator app, a code by SMS or email, or a passkey. Enrolment sends the material and then demands it back before it writes anything, and the destination is never taken from the request — an enrolment that let the caller name the phone would enrol the attacker's."],
  ['Accounts and membership', 'Create people, put them in an organization, give them a role there. SCIM 2.0 does the same thing from a directory you already run, so joiners and leavers arrive without a script of your own.'],
  ['Single sign-on', 'Every application registers under its own client id and redirects to the same authorize endpoint, so a person who is already signed in comes straight back with a code and never sees a form twice.'],
  ['Roles that travel', 'A role is granted at a place — an organization, a workspace under it, a single project. The token carries the one that applies to the request, so your service decides without asking us anything.'],
  ['Passkeys', 'A WebAuthn credential registered to the account, unlocked by whatever the device already uses — a fingerprint, a face, a PIN. Nothing that can be phished, because there is nothing to type.'],
  ['A record of what happened', 'Actions are written once to an append-only log scoped to the organization they happened in. The write path exists; there is no edit path for normal operation, which is the point of keeping one.'],
];

const LARGE = [
  ['Where the data sits', 'An organization is a tenancy boundary, and the boundary is enforced by the code that reads the token rather than by a column somebody has to remember to filter on.', ['Enterprise security with GDPR and privacy controls', 'Self-host it, in your own region, on your own cluster', 'One Go binary, embedded SQLite by default — nothing to run beside it']],
  ['Bring the identity you already have', 'Point Identity at your own issuer and it becomes the entry point without becoming the record.', ['Federate to any OpenID Connect issuer by naming its discovery URL', 'SCIM 2.0 provisioning, so joiners and leavers arrive from your directory', 'White-labelled by hostname — your mark on your domain, never ours']],
  ['Signing up your customers', 'An organization can hold its own customers as sub-organizations, so a business you serve manages its people without any of it reaching yours.', ['Sign in with Google or GitHub, or with any issuer you add', 'A consent screen the person has to pass before an app gets a token', 'Org admins manage their own members without platform access']],
  ['What you write', 'Almost nothing. Nobody should be hand-rolling OAuth in 2026, and with this you do not.', ['One SDK with an entry point per runtime — server, React, browser, Next.js, Passport', 'An OpenAPI 3.1 description generated from the handlers themselves', 'The sign-in page is hosted and already built — you send people to it']],
];

const WAYS = ['password', 'passkey', 'Google', 'GitHub', 'second factor'];
const HOST = /^(?=.{1,253}$)([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/;

/* Wear your name: the hosted card, white-labelled by hostname. Nothing is saved or sent. */
function Wear() {
  const [host, setHost] = useState('auth.example.com');
  const [name, setName] = useState('Example');
  const [on, setOn] = useState([true, true, true, false, true]);
  const h = host.trim().toLowerCase();
  const ok = HOST.test(h);
  const who = name.trim() || 'Your company';
  const has = (w) => on[WAYS.indexOf(w)];
  return (
    <section className="x-sec id-wear">
      <div className="x-wrap id-wear-grid">
        <div>
          <p className="x-kick">White-labelled by hostname</p>
          <h2>Wear your name</h2>
          <p className="id-wear-l">Your mark on your domain, never ours.</p>
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
        <div className="id-wear-card" aria-label={'Preview of the sign-in page at ' + (ok ? h : 'your hostname')}>
          <p className="id-url">{ok ? h : 'your hostname'}</p>
          <div className="id-wear-in">
            <span className="id-wear-mark" aria-hidden="true">{who[0].toUpperCase()}</span>
            <p className="id-wear-t">Sign in to {who}</p>
            <div className="id-form">
              {has('password') && <span className="id-field"><i />password</span>}
              {has('passkey') && <span className="id-btn dark">passkey</span>}
              {(has('Google') || has('GitHub')) && (has('password') || has('passkey')) && <span className="id-or">or</span>}
              {has('Google') && <span className="id-btn">Google</span>}
              {has('GitHub') && <span className="id-btn">GitHub</span>}
              {has('second factor') && <span className="id-wear-2fa">then a second factor</span>}
              {!on.slice(0, 4).some(Boolean) && <span className="id-wear-none">Choose at least one way in.</span>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Identity() {
  return (
    <main className="id">
      <Hero
        kick="Sign-in"
        title="Hanzo Identity"
        sub="The sign-in your users actually see."
        acts={[['Try Hanzo', '/login'], ['View Documentation', 'https://docs.hanzo.ai/docs/openapi/iam']]}
      >
        <Card />
      </Hero>
      <section className="x-sec id-does">
        <div className="x-wrap">
          <Head title="What it does" lede="Standards, not a proprietary protocol. If your framework can read an OpenID Connect discovery document, it can already talk to this." />
          <div className="id-cols">
            {DOES.map(([t, d], i) => (
              <Rise key={t} className="id-does-i" y={22} delay={(i % 2) * 0.08}><h3>{t}</h3><p>{d}</p></Rise>
            ))}
          </div>
        </div>
      </section>
      <section className="x-sec id-large">
        <div className="x-wrap">
          <Head title="Running it for a large organization" lede="The same service, wearing your name, on hardware you choose." />
          <div className="id-rows">
            {LARGE.map(([t, d, pts], i) => (
              <div key={t} className="id-row">
                <div><span className="id-row-n">{String(i + 1).padStart(2, '0')}</span><h3>{t}</h3><p>{d}</p></div>
                <ul>{pts.map((p) => <li key={p}>{p}</li>)}</ul>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Wear />
      <section className="x-sec id-add" data-room="dark">
        <div className="x-wrap id-add-grid">
          <div>
            <h2>Add sign-in</h2>
            <p>Register the app, set the callback your framework already uses, install the SDK. That is the whole integration.</p>
            <div className="id-add-acts"><A to="/login" className="x-btn solid">Try Hanzo</A><A to="https://docs.hanzo.ai/docs/openapi/iam" className="x-btn">Read Documentation</A></div>
          </div>
          <ol className="id-three" aria-hidden="true">
            {['Register the app', 'set the callback', 'install the SDK'].map((s, i) => (
              <Rise as="li" key={s} delay={0.1 + i * 0.12}><span>{i + 1}</span>{s}<i /></Rise>
            ))}
          </ol>
        </div>
      </section>
      <section className="id-end">
        <div className="x-wrap id-end-in">
          <h2>Get started with Identity</h2>
          <div className="id-end-acts"><A to="https://docs.hanzo.ai/docs/projects/hanzoai/iam" className="x-btn solid">Read the docs</A><A to="https://github.com/hanzoai" className="x-btn">View on GitHub</A></div>
        </div>
      </section>
    </main>
  );
}
