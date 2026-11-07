'use client';
/* Trust. Its idea is the evidence locker. Signature moment: the hero is a cabinet of the six things a review gets;
   its drawers pull themselves out one at a time (or at your hand), each with a live status chip — published and
   readable now, or on request — and the open drawer's contents in the tray beneath. Further down, every control is a
   drawer of its own that opens to the evidence, grouped as Hanzo groups them. Every word is Hanzo's.
   Signature: the evidence locker whose drawers pull themselves out, each with its published / on-request chip.
   Beyond: "Find a control". Type what your questionnaire asks (PKCE, SCIM, argon2id, HKDF) and every group opens the
   drawer that answers it, the rest dim, and the count says how many of Hanzo's controls match; nothing matching is met
   with Hanzo's own line: if a control you need is not on this page, ask. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'motion/react';
import { EASE, Rise } from '../ui';
import { A, More, Band } from '../kit';
import './Trust.css';

const REVIEW = [
  ['The Data Processing Addendum', 'The processor terms in full — roles and instructions, subprocessor governance, security measures, the Standard Contractual Clause modules for EEA and UK transfers, and the U.S. state service-provider terms. Still a draft pending counsel, which the page says at the top, so read it as terms proposed rather than terms signed.', '/legal/dpa'],
  ['The subprocessor register', 'Which providers can process your data, what each one does, where it runs, and whether it may train on your content — including the model providers a routed request reaches through a gateway. Rows still being confirmed against a provider’s signed terms are marked as such rather than left to look settled.', '/legal/subprocessors'],
  ['A security questionnaire, answered', 'Send the one your process uses — SIG, CAIQ, VSA, or your own spreadsheet. We answer it against the code, and where an answer is a mechanism rather than a yes, we point at the mechanism.'],
  ['An architecture review', 'A working session with the engineers who wrote it. Identity, tenancy, the audit trail, key custody — whichever part your reviewer wants to press on, in as much depth as they want to go.'],
  ['The control detail behind this page', 'Everything summarised below, at the level a reviewer needs: the algorithms, the parameters, the failure behaviour, and what happens at each boundary. Under NDA where your process requires one.'],
  ['A framework scoped to your engagement', 'Tell us what your process runs on and what your reviewer needs to see. We scope the work with you as part of the enterprise agreement rather than pointing at a checkmark.'],
];
const pad = (i) => String(i + 1).padStart(2, '0');

function Locker() {
  const [at, setAt] = useState(0);
  const [mine, setMine] = useState(false);
  const calm = useReducedMotion();
  const ref = useRef(null);
  const live = useInView(ref, { amount: 0.3 });
  useEffect(() => {
    if (mine || calm || !live) return;
    const t = setTimeout(() => setAt((v) => (v + 1) % 6), 3200);
    return () => clearTimeout(t);
  }, [at, mine, calm, live]);
  const pick = (i) => { setMine(true); setAt(i); };
  return (
    <div className="xtr-locker" ref={ref}>
      <div className="xtr-locker-h">
        <span>What a review gets</span>
        <span className="x-mono">{pad(at)} / 06</span>
      </div>
      <div className="xtr-cab" role="tablist" aria-label="What a review gets">
        {REVIEW.map(([t, , to], i) => (
          <motion.button key={t} type="button" role="tab" aria-selected={at === i} aria-controls={'xtr-tray-' + i} id={'xtr-dr-' + i}
            className={'xtr-drawer' + (at === i ? ' on' : '')} onClick={() => pick(i)}
            animate={{ x: at === i ? 22 : 0 }} transition={{ type: 'spring', stiffness: 260, damping: 24 }}>
            <span className="xtr-dr-n x-mono">{pad(i)}</span>
            <span className="xtr-dr-t">{t}</span>
            <span className={'xtr-chip' + (to ? ' pub' : '')}><i aria-hidden="true" />{to ? 'Published' : 'On request'}</span>
            <span className="xtr-handle" aria-hidden="true" />
          </motion.button>
        ))}
      </div>
      <div className="xtr-tray">
        {/* every drawer's contents are in the page; the open one is shown */}
        {REVIEW.map(([t, d, to], i) => (
          <motion.div key={t} id={'xtr-tray-' + i} role="tabpanel" aria-labelledby={'xtr-dr-' + i} className="xtr-tray-p" initial={false}
            animate={at === i ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }} transition={{ duration: 0.4, ease: EASE }} aria-hidden={at !== i} inert={at !== i}>
            <p>{d}</p>
            {to ? <More to={to}>Read {t.replace(/^The /, 'the ')}</More> : <More to="/contact-sales">Ask for it</More>}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function Hero() {
  const line = (t, d) => <span className="x-line"><motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: d }}>{t}</motion.span></span>;
  return (
    <section className="xtr-hero" aria-labelledby="xtr-h1">
      <div className="x-wrap xtr-hero-g">
        <div className="xtr-hero-c">
          <motion.p className="x-kick" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }}>Trust</motion.p>
          <h1 id="xtr-h1" className="xtr-h1">{line('Security', 0.05)}{line('you can read', 0.15)}</h1>
          <motion.p className="xtr-lede" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}>How you get in, what a credential reaches, what gets written down, and where the keys live — each one a mechanism you can point at in the source.</motion.p>
          <motion.div className="xtr-seal" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, ease: EASE, delay: 0.5 }} aria-hidden="true">
            <img src="/models/kai.webp" alt="" />
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: EASE, delay: 0.25 }}>
          <Locker />
        </motion.div>
      </div>
    </section>
  );
}

function Docs() {
  return (
    <section className="x-sec xtr-docs">
      <div className="x-wrap xtr-docs-g">
        <div>
          <h2 className="xtr-h2">What you can read, and what you can ask for</h2>
          <p className="xtr-p">The two documents a review opens first are published — read them now, no email. The other four we send on request: the questionnaire, the review session and the control detail come back the same week.</p>
        </div>
        <div className="xtr-papers">
          {REVIEW.slice(0, 2).map(([t, d, to], i) => (
            <Rise key={t} delay={i * 0.1}>
              <A to={to} className="xtr-paper" data-thumb={i === 0 ? 'Read the Data Processing Addendum' : undefined}>
                <span className="xtr-paper-k x-mono">{to}</span>
                <b>{t}</b>
                <span>{d}</span>
                <i aria-hidden="true">→</i>
              </A>
            </Rise>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stand() {
  return (
    <section className="x-sec xtr-stand">
      <div className="x-wrap xtr-stand-g">
        <h2 className="xtr-h2">Where we stand today</h2>
        <div>
          <p className="xtr-say">We run the controls those audits examine, and this page is the evidence — every mechanism below was read in the source before it was written here. Bring your questionnaire and we will answer it against the code rather than against a summary of it.</p>
          <p className="xtr-p">On frameworks: we audit ourselves continually and send the report on request — ask and it comes back, no questionnaire first. If your review runs on a named framework, tell us which one and what your reviewer needs to see. We scope it with you as part of the engagement, at the speed of the engagement rather than a calendar.</p>
          <p className="xtr-p">If a control you need is not on this page, ask. Where we have it we will show you the code, and where we do not you will get a straight answer the same day.</p>
        </div>
      </div>
    </section>
  );
}

/* ---------- the controls, each an evidence drawer ---------- */
const GROUPS = [
  ['Getting in', 'One service issues every credential. Hanzo IAM is the only thing that holds a password or runs a login, and nothing else in the stack has its own.', [
    ['Signing in is a redirect, not a form', 'An application hands you to Hanzo IAM and gets back a code. A client with no registered secret — anything running in a browser or on a laptop — must present a PKCE challenge, and only S256 is accepted. Offer the plain method and the request is refused rather than quietly downgraded.'],
    ['Passwords are hashed, and the digest says how', 'New passwords are argon2id at 64 MiB and two passes, with a random salt. The cost parameters ride inside the stored digest, so raising them later does not lock anyone out. Verification reads the scheme off the row instead of assuming one, and an unrecognised scheme fails closed.'],
    ['A token is trusted for what it cryptographically is', 'Bearer tokens verify against a closed list of signing algorithms: RSA, the NIST curves, and ML-DSA-65. HMAC and alg:none are absent from it, and the key lookup resolves a key id to a public key held by the platform — so there is no symmetric path for a forged header to select.'],
    ['A replayed refresh token ends the whole chain', 'Refresh tokens are single-use. Spending one marks it and mints a successor in the same family, and the spent row stays behind as a tripwire. Present it a second time and every token in that family is deleted, including the successor that still worked — because a replay means the token left your hands.'],
    ['Changing a second factor signs out everywhere else', 'A second factor is an authenticator app, or a code by SMS or email, with recovery codes shown once and stored hashed. Adding one, removing one, or changing which is preferred drops every other session and clears the remember-me window. A session that outlives the change is the same as not having made it.'],
    ['Your directory creates and removes the accounts', 'SCIM 2.0 provisions users from your identity provider — create, update, replace, deactivate, delete, with filter and patch. Someone you remove from your directory loses their Hanzo account by that act rather than by somebody remembering. Groups are not implemented, so role assignment is not driven from your IdP today.'],
  ]],
  ['What a credential reaches', 'Naming a resource and authorizing it are separate questions. Containment names; grants authorize.', [
    ['Access is a grant at a place', 'A resource has a path: organization, then workspace, then project, then whatever sits under those. A grant covers a path and everything below it. One check asks whether some grant the caller holds covers the target and admits the verb — and org-wide access, one workspace, an invite-only project, and a narrowed credential handed to an agent all fall out of that with no special case for any of them.'],
    ['A grant is matched exactly, not by prefix', 'A grant on acme/prod does not cover acme/production. What stops it is an exact match against a known set rather than a prefix walk — a plain string prefix test would admit the second, which is a read across two tenants. An empty path covers nothing, so a scope that arrived missing or malformed denies rather than matching everything.'],
    ['The decision travels, the grant set stays put', 'The edge resolves the scope once and writes what the token proved. Nothing behind it asks a permission service, so a check is a function call with no network on the path — nothing to time out, nothing to fail open when it does.'],
  ]],
  ['Keeping organizations apart', 'A tenancy boundary that only exists in a WHERE clause is one bug from being nothing.', [
    ['The edge deletes what a client claims to be', 'Headers naming an organization, a user, an email, or a role are stripped at the gateway before a handler reads one, and identity is written back only from a verified token. The organization a caller asks to act in is honoured only where the signed membership already admits it; asking for one they are not in falls back to their own rather than through.'],
    ['One organization, one file', 'On Hanzo Base an organization’s data is its own SQLite file. Two organizations are two files, so a query cannot reach across them — there is no second file open to reach into. Where a master key is configured each file is opened under its own derived key, so a leaked key is worth one file rather than the estate. Two derivations exist and only one of them is keyed to the organization; treat this as per-file isolation, which is what it is, rather than as a per-tenant key.'],
  ]],
  ['What gets written down', 'An audit trail is the one control a reviewer can test rather than take on faith, so it is worth saying exactly what is in it.', [
    ['One row per request', 'The trail records the organization and the user who acted, the address they came from, the method and the URI they called, the action, the status the server returned, and the time. It does NOT record the request body: nothing on this path captures one, so there is no payload to mask and none to leak. Who did what, when, from where, and what the system answered.'],
    ['The platform’s own actions cannot be authored', 'Your systems can file their activity in the same trail. They cannot write our half of it. Rows recording a consent answer, or a credential issued or revoked, are reserved — the API refuses to create, correct or delete one. Evidence the subject of the evidence can write is not evidence.'],
    ['Indexed for the questions that get asked', 'Organization, action and time each carry an index, so every time one action was taken is a lookup rather than a walk. The actor is not indexed today, so "everything one person did" still reads the table — answerable, but not yet fast, and worth knowing before you scope a review around it.'],
  ]],
  ['Keys', 'Where a key comes from, and who is able to hold one.', [
    ['A tenant key is derived, not stored', 'Each database gets its key from one master through HKDF-SHA256, bound to the namespace that owns it and to what it holds. It is a pure function of those inputs, so a file reopens after a restart with nothing kept beside it, and no two databases share a key. A master of the wrong length is an error, not a quiet fall back to no key.'],
    ['Signing keys are held by the platform', 'Signing goes through one interface that takes a key id and some bytes and gives back a signature. Today every implementation behind it runs in our own process: the key material is held on the platform and parsed by the running binary. An external key module — where the private key is made inside the module and never enters our memory — is the shape we want and is not what runs now. If your deployment requires it, say so and we will scope it; do not read this row as custody you have not been given.'],
  ]],
];

const has = (q) => ([t, d]) => !!q && (t + ' ' + d).toLowerCase().includes(q);

function Group({ g, gi, q }) {
  const [name, lede, items] = g;
  const [open, setOpen] = useState(0);
  const hit = has(q);
  const hits = items.filter(hit).length;
  useEffect(() => { if (q) setOpen(items.findIndex(hit)); }, [q]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <section className={'xtr-grp' + (gi % 2 ? ' alt' : '') + (q && !hits ? ' miss' : '')} aria-labelledby={'xtr-g' + gi}>
      <div className="x-wrap xtr-grp-g">
        <div className="xtr-grp-h">
          <span className="xtr-grp-n x-mono">{pad(gi)} / 05</span>
          <h2 id={'xtr-g' + gi} className="xtr-h2">{name}</h2>
          <p className="xtr-p">{lede}</p>
          <span className="xtr-count x-mono">{q ? hits + ' of ' : ''}{items.length} {items.length === 1 ? 'drawer' : 'drawers'}</span>
        </div>
        <ul className="xtr-drawers">
          {items.map(([t, d], i) => (
            <Rise as="li" key={t} delay={i * 0.05} y={16} className={(open === i ? 'on' : '') + (hit([t, d]) ? ' hit' : '')}>
              <button type="button" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>
                <span className="xtr-tag x-mono">{name} · {pad(i)}</span>
                <span className="xtr-dt">{t}</span>
                <motion.span className="xtr-pull" animate={{ rotate: open === i ? 180 : 0 }} transition={{ duration: 0.4, ease: EASE }} aria-hidden="true">
                  <svg viewBox="0 0 16 16" width="14" height="14"><path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </motion.span>
              </button>
              {/* the evidence stays in the page; a closed drawer is collapsed */}
              <motion.div className="xtr-ev" initial={false} animate={open === i ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }} transition={{ duration: 0.5, ease: EASE }} aria-hidden={open !== i} inert={open !== i}>
                <p>{d}</p>
              </motion.div>
            </Rise>
          ))}
        </ul>
      </div>
    </section>
  );
}

const FACTS = [
  ['Frameworks.', <>Our controls are built to be compatible with SOC 2, and we audit them continually. The audit report is available upon request — ask and it comes back, no questionnaire first. If your review runs on a named framework, the fourth card above is how that conversation starts.</>],
  ['FIPS:', <>our code implements published standards, ML-KEM and ML-DSA among them, but implementing a standard is not the same as holding a validation, and a 140-3 validation belongs to the vendor of a module rather than to us. Nor do we run one today: signing happens in our own process, not inside an external module. If your deployment requires validated hardware custody, tell us and we will scope it with you rather than imply you already have it.</>],
  ['Passkeys.', <>Passkey credentials can be stored and managed, but <b>a passkey cannot complete a sign-in</b> — the assertion ceremony is not in the build running today, so the login screen does not offer it, which is the only honest thing a login screen can do about a method the server cannot yet perform. Second factors that do work: an authenticator app, SMS, and email, with recovery codes.</>],
  ['Availability.', <>An uptime number is a contractual commitment, so ours lives in the agreement where it has consequences rather than on a marketing page where it does not. Ask for the number your agreement would carry and we will put it in writing.</>],
];

const ALL = GROUPS.flatMap((g) => g[2]);

function Find({ q, k, setQ }) {
  const n = k ? ALL.filter(has(k)).length : ALL.length;
  return (
    <section className="xtr-find" aria-label="Find a control">
      <div className="x-wrap xtr-find-g">
        <label className="xtr-find-l" htmlFor="xtr-q">Find a control</label>
        <input id="xtr-q" type="search" className="xtr-find-i" value={q} placeholder="PKCE, SCIM, argon2id, HKDF…" autoComplete="off"
          onChange={(e) => setQ(e.target.value)} />
        <p className="xtr-find-n x-mono" aria-live="polite">{k ? `${n} of ${ALL.length} controls` : `${ALL.length} controls`}</p>
      </div>
      {k && !n && (
        <div className="x-wrap xtr-find-none">
          <p>If a control you need is not on this page, ask.</p>
          <More to="/contact-sales">Ask for it</More>
        </div>
      )}
    </section>
  );
}

function Facts() {
  return (
    <section className="x-sec xtr-facts">
      <div className="x-wrap">
        <div className="xtr-facts-h">
          <h2 className="xtr-h2">Where we stand</h2>
          <p className="xtr-p">Everything a reviewer establishes in the first email, answered here instead.</p>
        </div>
        <div className="xtr-facts-g">
          {FACTS.map(([k, t], i) => (
            <div key={k} className="xtr-fact">
              <span className="xtr-fact-k">{k}</span>
              <p>{t}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Found() {
  return (
    <section className="xtr-found">
      <div className="x-wrap">
        <div className="xtr-found-c">
          <h2 className="xtr-h2">Found something</h2>
          <p className="xtr-found-p">Send it to <a href="mailto:security@hanzo.ai">security@hanzo.ai</a>. The same address is published at <a href="/.well-known/security.txt">/.well-known/security.txt</a> under RFC 9116, so a scanner finds it without reading this page. Tell us what you did and what came back; we do not need a proof-of-concept exploit to take a report seriously, and we will not threaten anyone who sends one in good faith.</p>
          <p className="xtr-p">For the mechanisms in more detail — encryption, infrastructure, what an enterprise agreement adds — see <A to="/security">the security page</A>.</p>
        </div>
      </div>
    </section>
  );
}

export default function Trust() {
  const [q, setQ] = useState('');
  const k = q.trim().toLowerCase();
  return (
    <main className="xtr">
      <Hero />
      <Docs />
      <Stand />
      <Find q={q} k={k} setQ={setQ} />
      {GROUPS.map((g, i) => <Group key={g[0]} g={g} gi={i} q={k} />)}
      <Facts />
      <Found />
      <Band title="Bring us the hard questions" lede="Your questionnaire, your architecture review, your framework. We answer against the code, we move at the speed of your review, and you will always know which of those two you are getting." action="Request a review or an enterprise deployment" to="/contact-sales" />
    </main>
  );
}
