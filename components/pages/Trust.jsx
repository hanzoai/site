'use client';
// Persona: a security or procurement reviewer checking Hanzo before signing (arrives from /security, /enterprise, the footer or a questionnaire)
// Goal: read what is published, find the control the questionnaire asks about, and request a review
// CTA: Request a review or an enterprise deployment -> /contact-sales (hero; the shared ask bar after it; the closing band) · data-cta="trust.hero" / "trust.band"
// Metric: contact_sales_submit (enterprise buyers, MASTER §1) via cta_click on trust.hero and trust.band
// Signature: the evidence locker — a wide cabinet under the headline whose drawers pull themselves out one by one, each with its Published or On request mark and its contents in the tray beside it
// Beyond: "Find a control" — type what your questionnaire asks (PKCE, SCIM, argon2id, HKDF) and the answers appear in place under each group, each opening the drawer that holds it, with a count of Hanzo's controls that match
/* Trust. Its idea is calm proof: big statements, and the evidence kept in drawers you open. The first screen is a
   centred statement (chatgpt.com/business/enterprise) over one wide product object — the evidence locker, a cabinet of the six things a review gets, whose
   drawers pull themselves out one at a time (or at your hand), each marked Published or On request, its contents in
   the tray beside it. Then the two published papers, which open into their pages; where Hanzo stands, said plainly;
   and every control, grouped as Hanzo groups them, as a quiet list whose rows open their evidence in a sheet. It
   closes in the one dark room with the address for what you find and the one ask. Every word is Hanzo's.
   No accent hue: hierarchy from ink alone, a filled or hollow mark for Published / On request.
   Signature: the evidence locker — a wide cabinet under the headline whose drawers pull themselves out one by one, each with its Published or On request mark and its contents in the tray beside it.
   Beyond: "Find a control". Type what your questionnaire asks (PKCE, SCIM, argon2id, HKDF): the answers appear in
   place under each group as you type, each opening the drawer that holds it; the count says how many of Hanzo's
   controls match, and nothing matching is met with Hanzo's own line: if a control you need is not on this page, ask.
   Motion (deck ease-emphasis, no springs): signature (drawers slide out, idle) + line-mask headline cut-in (arrival) +
   the "today" statement inking in word by word (scroll) + "Where we stand" as a pinned stage, one stance in focus at a
   time with a scrubbed progress rail (scroll; an accordion on phones) + "Find a control" typing one example itself
   once on arrival, then answers appearing as you type (time, state; sheets rise) + the black room's entry (scroll).
   Lines and Room are this page's hydration-safe builds of v2/MaskLines and v2/SceneWipe: those read the reduced-motion
   preference during render, so the server and client HTML differed (docs/requests/trust.md). Same motion, same values.
   Scale has rhythm (ProofRhythm): h1 52, headings 26, figures 64; one big thing per screen (the cabinet, the papers, the
   statement, the live count, the stance stage, the closing line at 84).
   Conflict noted on the card: MASTER §3.1 keeps centred heads for the closing section, but the hero is a centred
   statement at the coordinator's request after the critic found /trust sharing /leaderboard's frame (JAMES.md 8,
   neighbouring pages differ).
   V2: 8/10 calm proof with something to look at on every screen: the self-opening evidence cabinet (on phones each drawer's contents ride in under it), ruled papers that open into their pages, a statement that inks in as you read, a pinned stance stage whose index grows as each stance enters (an accordion on phones), a search that shows itself working, one ask. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion, useScroll, useTransform, useMotionTemplate, useMotionValueEvent } from 'motion/react';
import { A, More } from '../kit';
import DetailSheet from '../v2/x-pascal/DetailSheet'; // the coherent <dialog> build: main's v2/DetailSheet.jsx is the older div build against dialog-only CSS (docs/requests/trust.md)
import '../v2/ProofScale.css';
import '../v2/ProofRhythm.css';
import './Trust.css';

const ASK = 'Request a review or an enterprise deployment';
const EMPH = [0.16, 1, 0.3, 1]; // deck ease-emphasis
const REVIEW = [
  ['The Data Processing Addendum', 'The processor terms in full — roles and instructions, subprocessor governance, security measures, the Standard Contractual Clause modules for EEA and UK transfers, and the U.S. state service-provider terms. Still a draft pending counsel, which the page says at the top, so read it as terms proposed rather than terms signed.', '/legal/dpa'],
  ['The subprocessor register', 'Which providers can process your data, what each one does, where it runs, and whether it may train on your content — including the model providers a routed request reaches through a gateway. Rows still being confirmed against a provider’s signed terms are marked as such rather than left to look settled.', '/legal/subprocessors'],
  ['A security questionnaire, answered', 'Send the one your process uses — SIG, CAIQ, VSA, or your own spreadsheet. We answer it against the code, and where an answer is a mechanism rather than a yes, we point at the mechanism.'],
  ['An architecture review', 'A working session with the engineers who wrote it. Identity, tenancy, the audit trail, key custody — whichever part your reviewer wants to press on, in as much depth as they want to go.'],
  ['The control detail behind this page', 'Everything summarised below, at the level a reviewer needs: the algorithms, the parameters, the failure behaviour, and what happens at each boundary. Under NDA where your process requires one.'],
  ['A framework scoped to your engagement', 'Tell us what your process runs on and what your reviewer needs to see. We scope the work with you as part of the enterprise agreement rather than pointing at a checkmark.'],
];
const pad = (i) => String(i + 1).padStart(2, '0');

/* client-only facts, read after mount so the first client render equals the server HTML (no hydration mismatch) */
function useMedia(q, before) {
  const [on, setOn] = useState(before);
  useEffect(() => { const m = matchMedia(q); const f = () => setOn(m.matches); f(); m.addEventListener('change', f); return () => m.removeEventListener('change', f); }, [q]);
  return on;
}
const useCalm = () => useMedia('(prefers-reduced-motion: reduce)', false); // CSS shows the final state before this lands
const WIDE = '(min-width: 900px)';

/* a heading whose lines rise out of their own masks once reached (v2/MaskLines' motion: 105% to 0, 700 ms, 60 ms apart) */
function Lines({ as = 'h2', lines, className = '', id, amount = 0.4 }) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount });
  const calm = useCalm();
  const [ready, setReady] = useState(true); // a first visit waits for the arrival curtain to lift, or no one sees the cut-in
  useEffect(() => {
    if (!document.documentElement.classList.contains('x-arriving')) return;
    setReady(false);
    const go = () => setReady(true);
    addEventListener('hz-arrived', go, { once: true });
    const t = setTimeout(go, 4000);
    return () => { removeEventListener('hz-arrived', go); clearTimeout(t); };
  }, []);
  const Tag = motion[as] || motion.h2;
  const up = calm || (seen && ready);
  return (
    <Tag ref={ref} id={id} className={className}>
      {lines.map((l, i) => (
        <span key={i} className="pf-mask-l">
          <motion.span className="pf-mask-in" initial={{ y: '105%' }} animate={{ y: up ? '0%' : '105%' }} transition={calm ? { duration: 0 } : { duration: 0.7, ease: EMPH, delay: i * 0.06 }}>{l}</motion.span>
          {i < lines.length - 1 ? ' ' : null}
        </span>
      ))}
    </Tag>
  );
}

/* the one dark room: arrives as a rounded panel inside the gutters and opens to full bleed as you reach it (v2/SceneWipe's move) */
function Room({ children, className = '', label }) {
  const ref = useRef(null);
  const calm = useCalm();
  const wide = useMedia('(min-width: 901px)', true);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start 0.1'] });
  const side = useTransform(scrollYProgress, [0, 1], [5, 0]);
  const top = useTransform(scrollYProgress, [0, 1], [56, 0]);
  const round = useTransform(scrollYProgress, [0, 1], [40, 0]);
  const clip = useMotionTemplate`inset(${top}px ${side}% 0px ${side}% round ${round}px ${round}px 0px 0px)`;
  return (
    <section ref={ref} className={'pf-wipe xtr-room ' + className} data-room="dark" aria-label={label}>
      <motion.div aria-hidden="true" className="xtr-room-bg" style={{ clipPath: calm || !wide ? 'none' : clip }} />
      {children}
    </section>
  );
}

/* ---------- signature: the evidence locker ---------- */
function Locker() {
  const [at, setAt] = useState(-1); // -1: every drawer shut, as the page arrives
  const [mine, setMine] = useState(false);
  const [under, setUnder] = useState(false); // the pointer is on the locker: it waits under the hand
  const calm = useReducedMotion();
  const ref = useRef(null);
  const live = useInView(ref, { amount: 0.3 });
  /* phones: the open drawer's contents ride directly under it. The tray keeps its place in the flow (so nothing
     reflows); it is carried up under the open drawer and the drawers below it step down by its height (transform only). */
  const narrow = useMedia('(max-width: 899px)', false);
  const [geo, setGeo] = useState(null);
  useEffect(() => {
    if (!narrow) { setGeo(null); return; }
    const el = ref.current;
    const tray = el?.querySelector('.xtr-tray');
    if (!tray) return;
    const measure = () => {
      const gap = parseFloat(getComputedStyle(tray).marginTop) || 0;
      const ds = [...el.querySelectorAll('.xtr-drawer')];
      setGeo({ under: ds.map((d) => d.offsetTop + d.offsetHeight + gap - tray.offsetTop), push: tray.offsetHeight + gap });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el); ro.observe(tray);
    return () => ro.disconnect();
  }, [narrow]);
  const move = calm ? { duration: 0 } : { duration: 0.3, ease: EMPH };
  const inline = geo && at >= 0;
  useEffect(() => {
    if (calm) { setAt((v) => (v < 0 ? 0 : v)); return; }
    if (mine || !live || (under && at >= 0)) return;
    const t = setTimeout(() => setAt((v) => (v + 1) % 6), at < 0 ? 650 : 3400);
    return () => clearTimeout(t);
  }, [at, mine, calm, live, under]);
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
    <div className="xtr-locker" ref={ref} onPointerEnter={(e) => e.pointerType === 'mouse' && setUnder(true)} onPointerLeave={() => setUnder(false)}>
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
              initial={false} animate={{ x: at === i ? (narrow ? 8 : 28) : 0, y: inline && i > at ? geo.push : 0 }} transition={move}
            >
              <span className="xtr-dr-n pf-mono">{pad(i)}</span>
              <span className="xtr-dr-t">{t}</span>
              <span className={'xtr-chip' + (to ? ' pub' : '')}><i aria-hidden="true" />{to ? 'Published' : 'On request'}</span>
              <span className="xtr-handle" aria-hidden="true" />
            </motion.button>
          ))}
        </div>
      </div>
      <motion.div className="xtr-tray" initial={false} animate={{ x: inline ? 8 : 0, y: inline ? geo.under[at] : 0 }} transition={move}>
        {/* every drawer's contents are in the page; the open one is shown */}
        {REVIEW.map(([t, d, to], i) => (
          <div key={t} id={'xtr-tray-' + i} role="tabpanel" aria-labelledby={'xtr-dr-' + i} className="xtr-tray-p" data-on={at === i || (at < 0 && i === 0)} inert={!(at === i || (at < 0 && i === 0))}>
            <span className="xtr-tray-n pf-figure" aria-hidden="true">{pad(i)}</span>
            <b className="pf-title">{t}</b>
            <p>{d}</p>
            {to ? <More to={to}>Read {t.replace(/^The /, 'the ')}</More> : <More to="/contact-sales">Ask for it</More>}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

function Hero() {
  return (
    <section className="xtr-hero" aria-labelledby="xtr-h1">
      <div className="pf-wrap">
        <div className="xtr-hero-top">
          <Lines as="h1" id="xtr-h1" className="pf-display" lines={['Security', 'you can read']} />
          <p className="pf-kick xtr-cap">Trust</p>
          <p className="pf-lede">How you get in, what a credential reaches, what gets written down, and where the keys live — each one a mechanism you can point at in the source.</p>
          <A to="/contact-sales" className="pf-btn solid" data-thumb={ASK} data-cta="trust.hero">{ASK}</A>
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
          <Lines id="xtr-docs-h" className="pf-head" lines={['What you can read,', 'and what you can ask for']} />
          <p className="pf-body">The two documents a review opens first are published — read them now, no email. The other four we send on request: the questionnaire, the review session and the control detail come back the same week.</p>
        </div>
        <div className="xtr-papers">
          {/* path, title and arrow: the description is already in the cabinet's tray above, so the paper does not say it twice */}
          {REVIEW.slice(0, 2).map(([t, , to], i) => (
            <A key={t} to={to} className={'xtr-paper p' + i}>
              <span className="xtr-paper-k pf-mono">{to}</span>
              <b data-morph>{t}</b>
              <span className="xtr-paper-r" aria-hidden="true">{[92, 100, 84, 96, 61, 0, 100, 88, 72].map((w, j) => <i key={j} style={{ width: w + '%' }} />)}</span>
              <i className="xtr-paper-go" aria-hidden="true"><svg viewBox="0 0 16 16" width="16" height="16"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></i>
            </A>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- where we stand today: said plainly ---------- */
const SAY = 'We run the controls those audits examine, and this page is the evidence — every mechanism below was read in the source before it was written here. Bring your questionnaire and we will answer it against the code rather than against a summary of it.'.split(' ');

/* one word of the statement: it inks in as the reader's eye reaches it (opacity only, tied to scroll) */
function Word({ p, i, children }) {
  const a = i / SAY.length;
  const o = useTransform(p, [a, Math.min(1, a + 6 / SAY.length)], [0.16, 1]);
  return <><motion.span className="xtr-w" style={{ opacity: o }}>{children}</motion.span>{' '}</>;
}

function Stand() {
  const say = useRef(null);
  const { scrollYProgress } = useScroll({ target: say, offset: ['start 0.82', 'end 0.42'] });
  return (
    <section className="pf-sec xtr-stand" aria-labelledby="xtr-stand-h">
      <div className="pf-wrap xtr-stand-g">
        <Lines id="xtr-stand-h" className="pf-head" lines={['Where we', 'stand today']} />
        <div>
          <p className="xtr-say" ref={say}>{SAY.map((w, i) => <Word key={i} p={scrollYProgress} i={i}>{w}</Word>)}</p>
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
        <div className="xtr-grp-h">
        <DetailSheet label={<span className="xtr-vh">{name}</span>} title={name} className={'xtr-g-btn xtr-g-btn-' + gi} wide>
          <p className="xtr-sh-lede">{lede}</p>
          {items.map(([t, d], i) => (
            <article key={t} id={`xtr-c-${gi}-${i}`} className={'xtr-sh-c' + (hit([t, d]) ? ' hit' : '')}>
              <h3><span className="pf-mono">{pad(i)}</span><span>{t}</span></h3>
              <p>{d}</p>
            </article>
          ))}
        </DetailSheet>
        <h2 className="xtr-grp-t" onClick={() => document.querySelector('.xtr-g-btn-' + gi)?.click()}>{name}</h2>
        </div>
        <p className="xtr-grp-l">{lede}</p>
        {!k && (
          <ol className="xtr-idx">
            {items.map(([t], i) => (
              <li key={t}><button type="button" onClick={() => openAt(gi, i)}><span className="pf-mono" aria-hidden="true">{pad(i)}</span><span>{t}</span></button></li>
            ))}
          </ol>
        )}
        <AnimatePresence initial={false}>
          {k && hits.length > 0 && (
            <motion.ul className="xtr-ans" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6, transition: { duration: 0.15 } }} transition={{ duration: 0.3, ease: EMPH }}>
              {hits.map(([[t], i]) => (
                <li key={t}><button type="button" onClick={() => openAt(gi, i)}><span className="pf-mono">{pad(i)}</span><span>{t}</span></button></li>
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

/* the idle moment: once the search is 60% in view it types the placeholder's first example, lets the answer and the
   count settle, then clears. It stops for good the moment the reader touches the field; reduced motion never runs it. */
const DEMO = 'PKCE';
function useDemo(box) {
  const seen = useInView(box, { once: true, amount: 0.6 });
  const calm = useCalm();
  const [demo, setDemo] = useState('');
  const [typing, setTyping] = useState(false);
  const timers = useRef([]);
  const done = useRef(false);
  useEffect(() => {
    if (!seen || calm || done.current) return;
    done.current = true;
    const at = (ms, f) => timers.current.push(setTimeout(f, ms));
    let t = 400;
    at(t, () => setTyping(true));
    for (let i = 1; i <= DEMO.length; i++) { t += 150; at(t, () => setDemo(DEMO.slice(0, i))); }
    t += 2400;
    for (let i = DEMO.length - 1; i >= 0; i--) { t += 90; at(t, () => setDemo(DEMO.slice(0, i))); }
    at(t + 90, () => setTyping(false));
  }, [seen, calm]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const stop = () => { done.current = true; timers.current.forEach(clearTimeout); setTyping(false); setDemo(''); };
  return [demo, typing, stop];
}

function Controls() {
  const [q, setQ] = useState('');
  const box = useRef(null);
  const [demo, typing, stop] = useDemo(box);
  const k = (q || demo).trim().toLowerCase();
  const n = k ? ALL.filter(has(k)).length : ALL.length;
  return (
    <section className="pf-sec xtr-ctl" id="controls" aria-labelledby="xtr-find-h">
      <div className="pf-wrap">
        <div className="xtr-find" ref={box}>
          <h2 className="xtr-find-l" id="xtr-find-h">Find a control</h2>
          <div className="xtr-find-f" data-typing={typing}>
            <svg viewBox="0 0 20 20" width="22" height="22" aria-hidden="true"><circle cx="8.5" cy="8.5" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.7" /><path d="M13 13l4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>
            <input id="xtr-q" type="search" aria-labelledby="xtr-find-h" className="xtr-find-i" value={q || demo} placeholder="PKCE, SCIM, argon2id, HKDF…" autoComplete="off" spellCheck="false" onPointerDown={stop} onFocus={stop} onChange={(e) => { stop(); setQ(e.target.value); }} />
            {q && <button type="button" className="xtr-find-x" aria-label="Clear" onClick={() => setQ('')}><svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg></button>}
          </div>
          <p className="xtr-find-n pf-mono" aria-live={typing ? 'off' : 'polite'}><b>{n}</b> / {ALL.length}</p>
        </div>
        <AnimatePresence initial={false}>
          {k && !n && (
            <motion.div className="xtr-none" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, transition: { duration: 0.15 } }} transition={{ duration: 0.3, ease: EMPH }}>
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

/* one segment of the stage's progress rail: it fills as you scroll through its stance (transform only) */
function Seg({ p, i }) {
  const s = useTransform(p, [i / 4, (i + 1) / 4], [0, 1]);
  return <i><motion.b style={{ scaleX: s }} /></i>;
}

/* "Where we stand" as a pinned stage (≥ 900px): the section holds still while you scroll through it, one stance in
   focus on the stage at a time, its name lit in the list. On phones it is an accordion, one open at a time; the closed
   bodies stay in the HTML as hidden="until-found", so find-in-page opens them. */
function Facts() {
  const ref = useRef(null);
  const bodies = useRef([]);
  const wide = useMedia(WIDE, false);
  const calm = useCalm();
  const [at, setAt] = useState(0); // the stance in focus on the stage
  const [open, setOpen] = useState(0); // the open row on a phone
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  useMotionValueEvent(scrollYProgress, 'change', (v) => { if (wide) setAt(Math.min(3, Math.max(0, Math.floor(v * 4)))); });
  useEffect(() => {
    bodies.current.forEach((el, i) => {
      if (!el) return;
      if (!wide && open !== i) el.setAttribute('hidden', 'until-found'); else el.removeAttribute('hidden');
      el.inert = wide && at !== i;
    });
  }, [wide, open, at]);
  useEffect(() => {
    const offs = bodies.current.map((el, i) => { const f = () => setOpen(i); el?.addEventListener('beforematch', f); return () => el?.removeEventListener('beforematch', f); });
    return () => offs.forEach((f) => f());
  }, []);
  const go = (i) => {
    if (!wide) { setOpen((o) => (o === i ? -1 : i)); return; }
    setAt(i);
    const el = ref.current;
    const y = el.getBoundingClientRect().top + scrollY + (el.offsetHeight - innerHeight) * ((i + 0.5) / 4);
    if (window.__lenis) window.__lenis.scrollTo(y, calm ? { immediate: true } : { duration: 0.5 });
    else scrollTo({ top: y, behavior: calm ? 'auto' : 'smooth' });
  };
  return (
    <section ref={ref} className="xtr-facts" aria-labelledby="xtr-facts-h">
      <div className="xtr-pin">
        <div className="pf-wrap xtr-facts-g">
          <div className="xtr-facts-h">
            <Lines id="xtr-facts-h" className="xtr-facts-t" lines={['Where we stand']} />
            <p className="pf-lede">Everything a reviewer establishes in the first email, answered here instead.</p>
          </div>
          <div className="xtr-stage" aria-hidden="true">
            <span className="xtr-stage-n pf-mono">{pad(at)} / 04</span>
            <span className="xtr-segs">{FACTS.map((f, i) => <Seg key={i} p={scrollYProgress} i={i} />)}</span>
          </div>
          <dl className="xtr-fact-l">
            {FACTS.map(([k, t], i) => (
              <div key={k} className="xtr-fact" data-on={at === i} data-open={open === i}>
                <dt>
                  <button type="button" className="xtr-fact-b" aria-expanded={wide ? at === i : open === i} aria-controls={'xtr-fact-' + i} onClick={() => go(i)}>
                    <span className="xtr-fact-n pf-mono">{pad(i)}</span>
                    <span className="pf-title">{k}</span>
                    <i className="xtr-fact-pm" aria-hidden="true" />
                  </button>
                </dt>
                <dd id={'xtr-fact-' + i} ref={(el) => { bodies.current[i] = el; }}>
                  <span className="xtr-fact-big pf-figure" aria-hidden="true">{pad(i)}</span>
                  <b className="xtr-fact-k" aria-hidden="true">{k}</b>
                  <span className="xtr-fact-in">{t}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

/* ---------- the one dark room: the address, then the one ask ---------- */
function Close() {
  return (
    <Room className="xtr-dark" label="Found something">
      <div className="pf-sec">
        <div className="pf-wrap xtr-found">
          <h2 className="pf-head">Found something</h2>
          <div>
            <p className="xtr-found-p">Send it to <a href="mailto:security@hanzo.ai">security@hanzo.ai</a>. The same address is published at <a href="/.well-known/security.txt">/.well-known/security.txt</a> under RFC 9116, so a scanner finds it without reading this page. Tell us what you did and what came back; we do not need a proof-of-concept exploit to take a report seriously, and we will not threaten anyone who sends one in good faith.</p>
            <p className="pf-body">For the mechanisms in more detail — encryption, infrastructure, what an enterprise agreement adds — see <A to="/security">the security page</A>.</p>
          </div>
        </div>
        <div className="pf-wrap xtr-band">
          <Lines className="pf-moment" lines={['Bring us the', 'hard questions']} />
          <div className="xtr-band-r">
            <p className="pf-lede">Your questionnaire, your architecture review, your framework. We answer against the code, we move at the speed of your review, and you will always know which of those two you are getting.</p>
            <A to="/contact-sales" className="pf-btn solid xtr-light" data-cta="trust.band">{ASK}</A>
          </div>
        </div>
      </div>
    </Room>
  );
}

export default function Trust() {
  return (
    <main className="xtr pf-r">
      {/* JS off: every drawer's contents stand stacked in the tray, headings and the statement stand in place, every
          stance reads in a column, and the dark room is simply there */}
      <noscript dangerouslySetInnerHTML={{ __html: '<style>.xtr-tray-p{opacity:1!important;transform:none!important;grid-area:auto!important;pointer-events:auto!important;margin-top:28px}.pf-mask-in{transform:none!important}.xtr-w{opacity:1!important}.pf-wipe>div[aria-hidden]{clip-path:none!important}.xtr-grp-h{flex-wrap:wrap}.xtr-grp-h .pf-sheet{order:3;flex:1 1 100%}.xtr-facts{height:auto!important}.xtr-pin{position:static!important;height:auto!important}.xtr-fact-l,.xtr-fact{display:block!important}.xtr-stage,.xtr-fact-big,.xtr-fact-k{display:none!important}.xtr-facts dd{opacity:1!important;transform:none!important;padding:10.5px 0 27px!important}</style>' }} />
      <Hero />
      <Docs />
      <Stand />
      <Controls />
      <Facts />
      <Close />
    </main>
  );
}
