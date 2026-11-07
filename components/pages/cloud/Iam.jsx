'use client';
// Persona: a developer wiring sign-in for an app or service on Hanzo.
// Goal: trust how hanzo.id issues and protects tokens.
// CTA: API reference (iam.hero, iam.close).
// Metric: cta_click iam.hero
// Signature: the sign-in, live: authorize, PKCE S256, code, token light in turn; the refresh-token family grows link by link and is revoked at once when a spent token is replayed.
// Beyond: Try to steal one: copy the token as the thief and refresh in any order.
/* IAM (v2, archetype A Launch).
   V2: 8/10 round 2: name first (h1, lede, API reference at the left, the live sign-in at the right, h1 near 38% of the screen); the stage holds rt1 from the first frame and changes within 1 s (authorize, PKCE S256, code, token light in turn, then the family grows and is revoked); the card tilts 2.5° to a fine pointer and recedes as you scroll on; the eight facts light one at a time as each reaches the middle of the rail (its term grows 44 to 64px); the steal room has one solid next move; deck greys only, one ask.
   Signature: the sign-in, live. A sign-in at hanzo.id lights authorize, the PKCE exchange (S256), the code and the token in
   turn and mints the first refresh token; each refresh spends the last one and issues the next; then a spent one is
   presented again and the whole family turns over to revoked at once (a CSS flip, so reduced motion lands on the end).
   Supporting: kinetic title lines; the eight facts as a scroll-scrubbed sideways rail (ScrubRail) where the card in the
   middle is the one lit; the stage recedes as the rail comes in (scroll); a 2.5° pointer tilt on the stage.
   Beyond: "Try to steal one" - you hold the live refresh token; copy it as the thief, then refresh as either of you, in
   any order. Whoever comes second presents a spent token and the whole family is revoked. The next move is the one solid button.
   Greys only (Hanzo's deck). Every word and link is Hanzo's.
   Persona: a developer wiring sign-in for an app or service on Hanzo.
   Goal: trust how hanzo.id issues and protects tokens (PKCE, single-use refresh, one tenancy per organization).
   CTA: API reference (hero, the sticky ask bar and the close; one solid button per screen). */
import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Cta } from '../../kit';
import { useLive } from './Frame';
import { Lines } from '../../v2/LiftStage';
import ScrubRail from '../../v2/ScrubRail';
import ShipPrompt from '../../v2/ShipPrompt';
import GetIt from '../../v2/GetIt';
import LivePause, { usePause } from '../../v2/LivePause';
import '../../v2/v2scale.css';
import './Iam.css';

/* the stage's beats. f: how many of authorize, PKCE S256, code, token are lit; n: refresh tokens minted;
   r: rt1 presented again; d: the family revoked. Beat 0 is what the server paints: signed in, rt1 live. */
const BEATS = [
  { f: 4, n: 1, ms: 1000 },
  { f: 4, n: 2, ms: 1000 },
  { f: 4, n: 3, ms: 1100 },
  { f: 4, n: 3, r: 1, ms: 1500 },
  { f: 4, n: 3, d: 1, ms: 2800 },
  { f: 1, n: 0, ms: 650 },
  { f: 2, n: 0, ms: 650 },
  { f: 3, n: 0, ms: 650 },
];
const END = 4;

function Arrow() {
  return <svg className="ia-arr" viewBox="0 0 24 8" width="24" height="8" aria-hidden="true"><path d="M0 4h21M18 1l3 3-3 3" fill="none" stroke="currentColor" strokeWidth="1.2" /></svg>;
}

/* hero stage: the sign-in, then the refresh-token family */
function Family() {
  const [ref, seen, calm] = useLive(0.3);
  const [paused, togglePause] = usePause();
  const live = seen && !paused;
  const [t, setT] = useState(0);
  const card = useRef(null);
  useEffect(() => { if (calm) setT(END); }, [calm]);
  useEffect(() => {
    if (!live) return;
    const id = setTimeout(() => setT((v) => (v + 1) % BEATS.length), BEATS[t].ms);
    return () => clearTimeout(id);
  }, [t, live]);
  const b = BEATS[t];
  // a fine pointer tilts the card up to 2.5°; touch and reduced motion leave it flat
  const tilt = (e) => {
    const el = card.current;
    if (!el || calm || e.pointerType !== 'mouse') return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--ry', (((e.clientX - r.left) / r.width - 0.5) * 5).toFixed(2) + 'deg');
    el.style.setProperty('--rx', (((e.clientY - r.top) / r.height - 0.5) * -5).toFixed(2) + 'deg');
  };
  const flat = () => { const el = card.current; if (el) { el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg'); } };
  const flow = [<span key="a">authorize</span>, <b key="p">PKCE · S256</b>, <span key="c">code</span>, <span key="t">token</span>];
  return (
    <div className="lp-host ia-host-wrap">
      <LivePause paused={paused} onToggle={togglePause} className="ia-pause" />
      <div className={'ia-fam' + (b.d ? ' dead' : '')} ref={(el) => { ref.current = el; card.current = el; }} aria-hidden="true" onPointerMove={tilt} onPointerLeave={flat}>
        <div className="ia-fam-top">
          <p className="ia-host"><i />hanzo.id</p>
          <p className="ia-flow" aria-label="code → token">
            {flow.map((x, i) => (
              <span key={i} className={'ia-node' + (i < b.f ? ' on' : '') + (i === b.f - 1 && b.n <= 1 && !b.d ? ' now' : '')}>{i > 0 && <Arrow />}{x}</span>
            ))}
          </p>
        </div>
        <ol className="ia-chain">
          {[1, 2, 3].map((k) => (
            <li key={k} className={k > b.n ? 'slot' : b.d ? 'dead' : k < b.n ? 'spent' : 'live'}>
              <span className="ia-face">
                <span className="ia-flip" style={{ transitionDelay: (k - 1) * 90 + 'ms' }}>
                  <span className="ia-tok">rt{k}</span>
                  <span className="ia-st">{k < b.n ? 'spent' : 'live'}</span>
                  <span className="ia-back">revoked</span>
                </span>
              </span>
            </li>
          ))}
        </ol>
        <div className="ia-fam-foot">
          <p className="ia-k">refresh tokens <span>single-use · kept as a hash</span></p>
          <p className={'ia-replay' + (b.r || b.d ? ' on' : '') + (b.d ? ' dead' : '')} key={b.d ? 'd' : b.r ? 'r' : 'x'}>
            {b.d ? 'a spent one was presented · the whole family is revoked' : b.r ? 'rt1 presented again' : ''}
          </p>
        </div>
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

/* a fact card: lit while it sits in the middle of the rail (its term grows, its sentence shows), quiet either side */
function Fact({ f: [t, d, big], i }) {
  const ref = useRef(null);
  const [on, setOn] = useState(false); // reduced motion: the CSS shows every sentence, so the server and client agree
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting), { rootMargin: '0px -49.5% 0px -49.5%' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <article ref={ref} className="ia-card" data-on={on || undefined}>
      <p className="ia-card-n">{String(i + 1).padStart(2, '0')} / 08</p>
      <p className="ia-card-big" aria-hidden="true"><span>{big}</span></p>
      <div>
        <h3 className="v2-title">{t}</h3>
        <p className="ia-card-d">{d}</p>
      </div>
    </article>
  );
}

/* Beyond: try to steal one. Two holders, one family; a spent token presented by anyone revokes the family.
   The next move that teaches something is the one solid button; the rest are outlined. */
function Steal() {
  const [s, setS] = useState({ n: 1, you: 1, thief: 0, dead: '' });
  const use = (who) => setS((v) => {
    if (v.dead) return v;
    const tok = v[who];
    if (tok < v.n) return { ...v, dead: who };
    return { ...v, n: v.n + 1, [who]: v.n + 1 };
  });
  const { n, you, thief, dead } = s;
  const next = dead ? '' : !thief ? 'copy' : you < n ? 'you' : thief < n ? 'thief' : 'thief';
  const say = dead
    ? `${dead === 'you' ? 'You' : 'The thief'} presented spent rt${s[dead]}: the whole family is revoked, so a stolen token cannot outlive its session.`
    : thief ? `The thief holds rt${thief}. Refresh as either of you.` : `You hold rt${you}. Copy it as the thief.`;
  return (
    <section className="ia-steal v2-dark" data-room="dark">
      <div className="v2-wrap v2-grid ia-steal-grid">
        <div className="ia-steal-copy">
          <h2 className="v2-display s">Try to steal one</h2>
          <p className="v2-kick acc ia-steal-cap">Refresh tokens</p>
          <p className="v2-body">Refresh tokens are single-use and kept only as a hash. Presenting a spent one revokes the whole family.</p>
        </div>
        <div className={'ia-steal-box' + (dead ? ' dead' : '')}>
          <ol className="ia-steal-chain">
            {Array.from({ length: n }, (_, i) => i + 1).map((k) => (
              <motion.li key={k} className={dead ? 'dead' : k < n ? 'spent' : 'live'} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
                <b>rt{k}</b><span>{dead ? 'revoked' : k < n ? 'spent' : 'live'}</span>
                <em>{you === k && 'you'}{you === k && thief === k && ' · '}{thief === k && 'thief'}</em>
              </motion.li>
            ))}
          </ol>
          <p className="ia-steal-say" aria-live="polite">{say}</p>
        </div>
        <div className="ia-steal-acts">
          <Cta kind={next === 'copy' ? 'solid' : 'quiet'} onClick={() => setS((v) => ({ ...v, thief: v.you }))} disabled={!!dead || !!thief}>Copy it as the thief</Cta>
          <Cta kind={next === 'you' ? 'solid' : 'quiet'} onClick={() => use('you')} disabled={!!dead}>Refresh as you</Cta>
          <Cta kind={next === 'thief' ? 'solid' : 'quiet'} onClick={() => use('thief')} disabled={!!dead || !thief}>Refresh as the thief</Cta>
          <button type="button" className="ia-steal-x" onClick={() => setS({ n: 1, you: 1, thief: 0, dead: '' })}>Start again</button>
        </div>
      </div>
    </section>
  );
}

const NOJS = '.ia-card .ia-card-d{opacity:1!important}';

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
          <Recede><Family /></Recede>
        </div>
      </section>

      <ScrubRail
        className="ia-rail"
        label="How hanzo.id signs you in"
        head={<div className="ia-rail-h"><h2 className="v2-headline">hanzo.id</h2><p className="v2-kick">01 / 08 — 08 / 08</p></div>}
        items={FACTS}
        card={(f, i) => <Fact f={f} i={i} />}
      />

      <ShipPrompt
        name="IAM"
        api="/v1/iam"
        prompt="Read https://hanzo.ai/skill.md and use Hanzo IAM in my project. Start with: hanzo iam whoami"
        related={[['Authz', '/authz', 'Fine-grained access'], ['KMS', '/kms', 'Managed keys'], ['Secrets', '/cloud/secrets', 'Store once, sync everywhere']]}
        flip
      />

      <Steal />

      <GetIt name="IAM" tag="Identity + access (hanzo.id)" seed="iam" data={[256, 65, 3]} repo={['hanzoai/iam', 'https://github.com/hanzoai/iam']} stars="3 stars" ask={['API reference', 'https://docs.hanzo.ai/docs/openapi/iam', 'iam.close']} />
    </main>
  );
}
