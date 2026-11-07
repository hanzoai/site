'use client';
/* Trust. Its idea is calm proof: big statements, and the evidence kept in drawers you open. The first screen is the
   headline over one wide product object — the evidence locker, a cabinet of the six things a review gets, whose
   drawers pull themselves out one at a time (or at your hand), each marked Published or On request, its contents in
   the tray beside it. Then the two published papers, which open into their pages; where Hanzo stands, said plainly;
   and every control, grouped as Hanzo groups them, as a quiet list whose rows open their evidence in a sheet. It
   closes in the one dark room with the address for what you find and the one ask. Every word is Hanzo's.
   No accent hue: hierarchy from ink alone, a filled or hollow mark for Published / On request.
   Signature: the evidence locker — a wide cabinet under the headline whose drawers pull themselves out one by one, each with its Published or On request mark and its contents in the tray beside it.
   Beyond: "Find a control". Type what your questionnaire asks (PKCE, SCIM, argon2id, HKDF): the answers appear in
   place under each group as you type, each opening the drawer that holds it; the count says how many of Hanzo's
   controls match, and nothing matching is met with Hanzo's own line: if a control you need is not on this page, ask.
   Motion: signature (drawers on springs, idle) + MaskLines headline cut-in (arrival) + answers re-flowing as you type
   (state; sheets rise) + the SceneWipe dark room (the one scroll-linked effect).
   V2: 8/10 calm-proof rebuild in ink only: headline over a wide self-opening evidence cabinet, papers that open into their pages, plain statements, five control groups as a quiet list of evidence sheets with answer-as-you-type, one ask sticky after the hero. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'motion/react';
import { A, More } from '../kit';
import MaskLines from '../v2/MaskLines';
import SceneWipe from '../v2/SceneWipe';
import DetailSheet from '../v2/DetailSheet';
import AskBar from '../v2/AskBar';
import '../v2/ProofScale.css';
import './Trust.css';

const ASK = 'Request a review or an enterprise deployment';
const REVIEW = [
  ['The Data Processing Addendum', 'The processor terms in full — roles and instructions, subprocessor governance, security measures, the Standard Contractual Clause modules for EEA and UK transfers, and the U.S. state service-provider terms. Still a draft pending counsel, which the page says at the top, so read it as terms proposed rather than terms signed.', '/legal/dpa'],
  ['The subprocessor register', 'Which providers can process your data, what each one does, where it runs, and whether it may train on your content — including the model providers a routed request reaches through a gateway. Rows still being confirmed against a provider’s signed terms are marked as such rather than left to look settled.', '/legal/subprocessors'],
  ['A security questionnaire, answered', 'Send the one your process uses — SIG, CAIQ, VSA, or your own spreadsheet. We answer it against the code, and where an answer is a mechanism rather than a yes, we point at the mechanism.'],
  ['An architecture review', 'A working session with the engineers who wrote it. Identity, tenancy, the audit trail, key custody — whichever part your reviewer wants to press on, in as much depth as they want to go.'],
  ['The control detail behind this page', 'Everything summarised below, at the level a reviewer needs: the algorithms, the parameters, the failure behaviour, and what happens at each boundary. Under NDA where your process requires one.'],
  ['A framework scoped to your engagement', 'Tell us what your process runs on and what your reviewer needs to see. We scope the work with you as part of the enterprise agreement rather than pointing at a checkmark.'],
];
const pad = (i) => String(i + 1).padStart(2, '0');

/* ---------- signature: the evidence locker ---------- */
function Locker() {
  const [at, setAt] = useState(-1); // -1: every drawer shut, as the page arrives
  const [mine, setMine] = useState(false);
  const calm = useReducedMotion();
  const ref = useRef(null);
  const live = useInView(ref, { amount: 0.3 });
  useEffect(() => {
    if (calm) { setAt((v) => (v < 0 ? 0 : v)); return; }
    if (mine || !live) return;
    const t = setTimeout(() => setAt((v) => (v + 1) % 6), at < 0 ? 650 : 3400);
    return () => clearTimeout(t);
  }, [at, mine, calm, live]);
  const pick = (i) => { setMine(true); setAt(i); };
  const keys = (e) => {
    const k = { ArrowDown: 1, ArrowUp: -1 }[e.key];
    if (!k) return;
    e.preventDefault();
    const n = (Math.max(at, 0) + k + 6) % 6;
    pick(n);
    document.getElementById('xtr-dr-' + n)?.focus();
  };
  return (
    <div className="xtr-locker" ref={ref}>
      <div className="xtr-cab-w">
        <p className="xtr-locker-h">
          <span>What a review gets</span>
          <span className="pf-mono">{pad(Math.max(at, 0))} / 06</span>
        </p>
        <div className="xtr-cab" role="tablist" aria-label="What a review gets" aria-orientation="vertical" onKeyDown={keys}>
          {REVIEW.map(([t, , to], i) => (
            <motion.button
              key={t} type="button" role="tab" id={'xtr-dr-' + i} aria-selected={at === i} aria-controls={'xtr-tray-' + i} tabIndex={at === i || (at < 0 && i === 0) ? 0 : -1}
              className={'xtr-drawer' + (at === i ? ' on' : '')} onClick={() => pick(i)}
              initial={false} animate={{ x: at === i ? 28 : 0 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <span className="xtr-dr-n pf-mono">{pad(i)}</span>
              <span className="xtr-dr-t">{t}</span>
              <span className={'xtr-chip' + (to ? ' pub' : '')}><i aria-hidden="true" />{to ? 'Published' : 'On request'}</span>
              <span className="xtr-handle" aria-hidden="true" />
            </motion.button>
          ))}
        </div>
      </div>
      <div className="xtr-tray">
        {/* every drawer's contents are in the page; the open one is shown */}
        {REVIEW.map(([t, d, to], i) => (
          <div key={t} id={'xtr-tray-' + i} role="tabpanel" aria-labelledby={'xtr-dr-' + i} className="xtr-tray-p" data-on={at === i || (at < 0 && i === 0)} inert={!(at === i || (at < 0 && i === 0))}>
            <span className="xtr-tray-n" aria-hidden="true">{pad(i)}</span>
            <b className="pf-title">{t}</b>
            <p>{d}</p>
            {to ? <More to={to}>Read {t.replace(/^The /, 'the ')}</More> : <More to="/contact-sales">Ask for it</More>}
          </div>
        ))}
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="xtr-hero" aria-labelledby="xtr-h1">
      <div className="pf-wrap">
        <div className="xtr-hero-top">
          <div>
            <MaskLines as="h1" id="xtr-h1" className="pf-display" lines={['Security', 'you can read']} />
            <p className="pf-kick xtr-cap">Trust</p>
          </div>
          <div className="xtr-hero-r">
            <p className="pf-lede">How you get in, what a credential reaches, what gets written down, and where the keys live — each one a mechanism you can point at in the source.</p>
            <A to="/contact-sales" className="pf-btn solid" data-thumb={ASK}>{ASK}</A>
          </div>
        </div>
        <Locker />
      </div>
    </section>
  );
}

/* ---------- the two papers you can read now; each opens into its page ---------- */
function Docs() {
  return (
    <section className="pf-sec xtr-docs" aria-labelledby="xtr-docs-h">
      <div className="pf-wrap xtr-docs-g">
        <div className="xtr-docs-c">
          <MaskLines id="xtr-docs-h" className="pf-head" lines={['What you can read,', 'and what you can ask for']} />
          <p className="pf-body">The two documents a review opens first are published — read them now, no email. The other four we send on request: the questionnaire, the review session and the control detail come back the same week.</p>
        </div>
        <div className="xtr-papers">
          {REVIEW.slice(0, 2).map(([t, d, to], i) => (
            <A key={t} to={to} className={'xtr-paper p' + i}>
              <span className="xtr-paper-k pf-mono">{to}</span>
              <b data-morph>{t}</b>
              <span className="xtr-paper-d">{d}</span>
              <i className="xtr-paper-go" aria-hidden="true"><svg viewBox="0 0 16 16" width="16" height="16"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></i>
            </A>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- where we stand today: said plainly ---------- */
function Stand() {
  return (
    <section className="pf-sec xtr-stand" aria-labelledby="xtr-stand-h">
      <div className="pf-wrap xtr-stand-g">
        <MaskLines id="xtr-stand-h" className="pf-head" lines={['Where we', 'stand today']} />
        <div>
          <p className="xtr-say">We run the controls those audits examine, and this page is the evidence — every mechanism below was read in the source before it was written here. Bring your questionnaire and we will answer it against the code rather than against a summary of it.</p>
          <div className="xtr-stand-p">
            <p className="pf-body">On frameworks: we audit ourselves continually and send the report on request — ask and it comes back, no questionnaire first. If your review runs on a named framework, tell us which one and what your reviewer needs to see. We scope it with you as part of the engagement, at the speed of the engagement rather than a calendar.</p>
            <p className="pf-body">If a control you need is not on this page, ask. Where we have it we will show you the code, and where we do not you will get a straight answer the same day.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- the controls: a quiet list, each group's evidence in a sheet ---------- */
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
const ALL = GROUPS.flatMap((g) => g[2]);
const has = (q) => ([t, d]) => !!q && (t + ' ' + d).toLowerCase().includes(q);

/* open a group's sheet from outside it (an answer under the search), then bring that control into view inside it */
const openAt = (gi, i) => {
  document.querySelector('.xtr-g-btn-' + gi)?.click();
  setTimeout(() => document.getElementById(`xtr-c-${gi}-${i}`)?.scrollIntoView({ block: 'start', behavior: 'smooth' }), 380);
};

function Group({ g, gi, k }) {
  const [name, lede, items] = g;
  const hit = has(k);
  const hits = items.map((it, i) => [it, i]).filter(([it]) => hit(it));
  return (
    <li className={'xtr-grp' + (k && !hits.length ? ' miss' : '')}>
      <span className="xtr-grp-n" aria-hidden="true">{pad(gi)}</span>
      <div className="xtr-grp-c">
        <DetailSheet label={name} title={name} className={'xtr-g-btn xtr-g-btn-' + gi} wide>
          <p className="xtr-sh-lede">{lede}</p>
          {items.map(([t, d], i) => (
            <article key={t} id={`xtr-c-${gi}-${i}`} className={'xtr-sh-c' + (hit([t, d]) ? ' hit' : '')}>
              <h3><span className="pf-mono">{pad(i)}</span>{t}</h3>
              <p>{d}</p>
            </article>
          ))}
        </DetailSheet>
        <p className="xtr-grp-l">{lede}</p>
        <AnimatePresence initial={false}>
          {k && hits.length > 0 && (
            <motion.ul className="xtr-ans" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6, transition: { duration: 0.2 } }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
              {hits.map(([[t], i]) => (
                <li key={t}><button type="button" onClick={() => openAt(gi, i)}><span className="pf-mono">{pad(i)}</span>{t}</button></li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
      <span className="xtr-dots" aria-hidden="true">
        {items.map((it, i) => <i key={i} data-hit={hit(it)} />)}
      </span>
    </li>
  );
}

function Controls() {
  const [q, setQ] = useState('');
  const k = q.trim().toLowerCase();
  const n = k ? ALL.filter(has(k)).length : ALL.length;
  return (
    <section className="pf-sec xtr-ctl" id="controls" aria-label="Find a control">
      <div className="pf-wrap">
        <div className="xtr-find">
          <label className="xtr-find-l" htmlFor="xtr-q">Find a control</label>
          <div className="xtr-find-f">
            <svg viewBox="0 0 20 20" width="22" height="22" aria-hidden="true"><circle cx="8.5" cy="8.5" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.7" /><path d="M13 13l4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>
            <input id="xtr-q" type="search" className="xtr-find-i" value={q} placeholder="PKCE, SCIM, argon2id, HKDF…" autoComplete="off" spellCheck="false" onChange={(e) => setQ(e.target.value)} />
            {q && <button type="button" className="xtr-find-x" aria-label="Clear" onClick={() => setQ('')}><svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg></button>}
          </div>
          <p className="xtr-find-n pf-mono" aria-live="polite"><b>{n}</b> / {ALL.length}</p>
        </div>
        <AnimatePresence initial={false}>
          {k && !n && (
            <motion.div className="xtr-none" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
              <p className="pf-title">If a control you need is not on this page, ask.</p>
              <More to="/contact-sales">Ask for it</More>
            </motion.div>
          )}
        </AnimatePresence>
        <ol className="xtr-grps">
          {GROUPS.map((g, i) => <Group key={g[0]} g={g} gi={i} k={k} />)}
        </ol>
      </div>
    </section>
  );
}

/* ---------- where we stand: the first email, answered ---------- */
const FACTS = [
  ['Frameworks.', <>Our controls are built to be compatible with SOC 2, and we audit them continually. The audit report is available upon request — ask and it comes back, no questionnaire first. If your review runs on a named framework, the fourth card above is how that conversation starts.</>],
  ['FIPS:', <>our code implements published standards, ML-KEM and ML-DSA among them, but implementing a standard is not the same as holding a validation, and a 140-3 validation belongs to the vendor of a module rather than to us. Nor do we run one today: signing happens in our own process, not inside an external module. If your deployment requires validated hardware custody, tell us and we will scope it with you rather than imply you already have it.</>],
  ['Passkeys.', <>Passkey credentials can be stored and managed, but <b>a passkey cannot complete a sign-in</b> — the assertion ceremony is not in the build running today, so the login screen does not offer it, which is the only honest thing a login screen can do about a method the server cannot yet perform. Second factors that do work: an authenticator app, SMS, and email, with recovery codes.</>],
  ['Availability.', <>An uptime number is a contractual commitment, so ours lives in the agreement where it has consequences rather than on a marketing page where it does not. Ask for the number your agreement would carry and we will put it in writing.</>],
];

function Facts() {
  return (
    <section className="pf-sec xtr-facts" aria-labelledby="xtr-facts-h">
      <div className="pf-wrap xtr-facts-g">
        <div className="xtr-facts-h">
          <MaskLines id="xtr-facts-h" className="pf-display s" lines={['Where we stand']} />
          <p className="pf-lede">Everything a reviewer establishes in the first email, answered here instead.</p>
        </div>
        <dl className="xtr-fact-l">
          {FACTS.map(([k, t]) => (
            <div key={k} className="xtr-fact">
              <dt className="pf-title">{k}</dt>
              <dd>{t}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/* ---------- the one dark room: the address, then the one ask ---------- */
function Close() {
  return (
    <SceneWipe className="xtr-dark" label="Found something">
      <div className="pf-sec">
        <div className="pf-wrap xtr-found">
          <h2 className="pf-head">Found something</h2>
          <div>
            <p className="xtr-found-p">Send it to <a href="mailto:security@hanzo.ai">security@hanzo.ai</a>. The same address is published at <a href="/.well-known/security.txt">/.well-known/security.txt</a> under RFC 9116, so a scanner finds it without reading this page. Tell us what you did and what came back; we do not need a proof-of-concept exploit to take a report seriously, and we will not threaten anyone who sends one in good faith.</p>
            <p className="pf-body">For the mechanisms in more detail — encryption, infrastructure, what an enterprise agreement adds — see <A to="/security">the security page</A>.</p>
          </div>
        </div>
        <div className="pf-wrap xtr-band">
          <MaskLines className="pf-display m" lines={['Bring us the', 'hard questions']} />
          <div className="xtr-band-r">
            <p className="pf-lede">Your questionnaire, your architecture review, your framework. We answer against the code, we move at the speed of your review, and you will always know which of those two you are getting.</p>
            <A to="/contact-sales" className="pf-btn solid xtr-light">{ASK}</A>
          </div>
        </div>
      </div>
    </SceneWipe>
  );
}

export default function Trust() {
  return (
    <main className="xtr">
      <Hero />
      <Docs />
      <Stand />
      <Controls />
      <Facts />
      <Close />
      <AskBar title="Trust" label={ASK} to="/contact-sales" />
    </main>
  );
}
